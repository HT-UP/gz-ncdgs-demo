<template>
  <div class="standard-page">
    <el-row :gutter="16">
      <el-col :xs="24" :lg="6" v-for="metric in metrics" :key="metric.label">
        <el-card class="metric-card dashboard-card" shadow="hover">
          <div class="metric-title">{{ metric.label }}</div>
          <div class="metric-value">{{ metric.value }}</div>
          <div class="metric-subtitle">
            <span :class="metric.warning ? 'trend-negative' : 'trend-positive'">{{ metric.note }}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16">
      <el-col :xs="24" :lg="12">
        <el-card class="panel-card dashboard-card" shadow="never">
          <template #header>
            <div class="panel-header">
              <span>资源使用监控</span>
            </div>
          </template>
          <div ref="resourceChartRef" class="chart-box"></div>
        </el-card>
      </el-col>
      <el-col :xs="24" :lg="12">
        <el-card class="panel-card dashboard-card" shadow="never">
          <template #header>
            <div class="panel-header">
              <span>性能瓶颈分析</span>
              <el-link :underline="false" type="danger">慢节点定位 →</el-link>
            </div>
          </template>
          <div class="bottleneck-list">
            <div v-for="node in bottleneckNodes" :key="node.name" class="bottleneck-item">
              <span class="bottleneck-name">{{ node.name }}</span>
              <el-progress
                :percentage="node.usage"
                :color="node.usage > 85 ? '#E34D59' : node.usage > 70 ? '#ED7B2F' : '#00A854'"
                :stroke-width="10"
                class="bottleneck-progress"
              />
              <span class="bottleneck-desc">{{ node.note }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16">
      <el-col :span="24">
        <el-card class="panel-card dashboard-card" shadow="never">
          <template #header>
            <div class="panel-header">
              <span>任务运行明细</span>
              <div class="panel-actions">
                <el-button type="danger" size="small" @click="openAlarmRule">告警规则配置</el-button>
              </div>
            </div>
          </template>
          <el-table :data="runningDetails" stripe>
            <el-table-column prop="name" label="任务名称" min-width="170" />
            <el-table-column label="状态" width="90">
              <template #default="{ row }">
                <el-tag :type="statusTagType[row.status]" effect="dark">{{ row.status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="进度" min-width="140">
              <template #default="{ row }">
                <el-progress :percentage="row.progress" :stroke-width="10" />
              </template>
            </el-table-column>
            <el-table-column prop="dataCount" label="处理数据量" width="120" />
            <el-table-column prop="rate" label="处理速率" width="100" />
            <el-table-column prop="duration" label="耗时" width="90" />
            <el-table-column label="操作" width="100">
              <template #default="{ row }">
                <el-button link type="primary" @click="showLog(row)">日志</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog v-model="alarmVisible" title="告警规则配置" width="560px">
      <el-form :model="alarmForm" label-width="110px">
        <el-form-item label="告警对象">
          <el-select v-model="alarmForm.target" class="w-full">
            <el-option label="全部任务" value="全部任务" />
            <el-option label="批量任务" value="批量任务" />
            <el-option label="实时任务" value="实时任务" />
            <el-option label="流式任务" value="流式任务" />
          </el-select>
        </el-form-item>
        <el-form-item label="触发条件">
          <el-select v-model="alarmForm.condition" class="w-full">
            <el-option label="任务失败" value="任务失败" />
            <el-option label="耗时超过阈值" value="耗时超过阈值" />
            <el-option label="数据量异常" value="数据量异常" />
            <el-option label="资源占用过高" value="资源占用过高" />
          </el-select>
        </el-form-item>
        <el-form-item label="通知方式">
          <el-checkbox-group v-model="alarmForm.notify">
            <el-checkbox value="站内" />
            <el-checkbox value="邮件" />
            <el-checkbox value="短信" />
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="通知人">
          <el-select v-model="alarmForm.users" class="w-full" multiple>
            <el-option v-for="user in ['张三', '李四', '王五', '赵六']" :key="user" :label="user" :value="user" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="alarmVisible = false">取消</el-button>
        <el-button type="danger" @click="saveAlarm">保存规则</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="logVisible" :title="`执行日志：${logTaskName}`" width="680px">
      <pre class="ddl-block">{{ logContent }}</pre>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'

const metrics = [
  { label: '运行中任务', value: '12', note: '并行执行', warning: false },
  { label: '今日执行次数', value: '486', note: '较昨日 +32', warning: false },
  { label: '平均成功率', value: '96.8%', note: '持续平稳', warning: false },
  { label: '平均处理速率', value: '1.8万/s', note: '无瓶颈', warning: false },
]

const statusTagType: Record<string, 'warning' | 'success' | 'danger' | 'warning'> = {
  运行中: 'warning',
  成功: 'success',
  失败: 'danger',
  待执行: 'warning',
}

const resourceChartRef = ref<HTMLElement>()
const alarmVisible = ref(false)
const logVisible = ref(false)
const logTaskName = ref('')
let resourceChart: echarts.ECharts | null = null

const bottleneckNodes = [
  { name: 'HiveSQL-节点05', usage: 92, note: '慢节点：CPU 100%' },
  { name: 'Flink-作业02', usage: 78, note: '背压 3 级' },
  { name: 'Spark-作业11', usage: 65, note: 'Shuffle 倾斜' },
  { name: '同步-任务07', usage: 45, note: '正常' },
]

const runningDetails = [
  { name: '票务数据日结同步', status: '运行中', progress: 68, dataCount: '1,280,450', rate: '2.3万/s', duration: '00:08:12' },
  { name: '客流统计批量加工', status: '运行中', progress: 42, dataCount: '356,120', rate: '1.1万/s', duration: '00:05:47' },
  { name: '客户主数据实时同步', status: '成功', progress: 100, dataCount: '82,450', rate: '3.2万/s', duration: '00:02:30' },
  { name: '运营指标流式聚合', status: '运行中', progress: 85, dataCount: '2,450,890', rate: '5.6万/s', duration: '00:15:02' },
  { name: '财务数据月度汇总', status: '失败', progress: 100, dataCount: '0', rate: '0/s', duration: '00:00:08' },
]

const alarmForm = reactive({
  target: '全部任务',
  condition: '任务失败',
  notify: ['站内', '邮件'] as string[],
  users: ['张三'] as string[],
})

const logContent = `2026-08-11 14:32:08 [INFO] 任务启动
2026-08-11 14:32:09 [INFO] 连接数据源成功（票务核心库）
2026-08-11 14:32:15 [INFO] 读取分区 stat_date=20260811 完成
2026-08-11 14:32:40 [INFO] 字段映射 12/12 完成
2026-08-11 14:33:20 [WARN] 目标表存在重复键，已按规则去重 356 条
2026-08-11 14:34:12 [INFO] 数据写入 DWD 层完成
2026-08-11 14:34:13 [INFO] 任务执行成功，处理 1,280,450 条
2026-08-11 14:34:13 [INFO] 质量检查通过，无异常数据`

const renderResourceChart = () => {
  if (!resourceChartRef.value) return
  resourceChart?.dispose()
  resourceChart = echarts.init(resourceChartRef.value)
  const labels = Array.from({ length: 12 }, (_, i) => `${String(9 + i).padStart(2, '0')}:00`)
  resourceChart.setOption({
    tooltip: { trigger: 'axis' },
    legend: { data: ['CPU 使用率', '内存使用率', '网络吞吐'], top: 0, left: 0 },
    grid: { left: 44, right: 20, top: 40, bottom: 30 },
    xAxis: { type: 'category', data: labels },
    yAxis: [{ type: 'value', max: 100, splitLine: { lineStyle: { type: 'dashed', color: '#E4E7ED' } } }],
    series: [
      { name: 'CPU 使用率', type: 'line', smooth: true, data: Array.from({ length: 12 }, (_, i) => 55 + Math.round(Math.sin(i / 2) * 22 + Math.random() * 10)), lineStyle: { color: '#DA251D', width: 3 }, itemStyle: { color: '#DA251D' }, symbolSize: 5 },
      { name: '内存使用率', type: 'line', smooth: true, data: Array.from({ length: 12 }, (_, i) => 60 + Math.round(Math.cos(i / 3) * 12 + Math.random() * 8)), lineStyle: { color: '#2B6CB0', width: 2 }, itemStyle: { color: '#2B6CB0' }, symbolSize: 5 },
      { name: '网络吞吐', type: 'line', smooth: true, data: Array.from({ length: 12 }, (_, i) => 40 + Math.round(Math.sin(i / 1.8) * 18 + Math.random() * 12)), lineStyle: { color: '#00A854', width: 2 }, itemStyle: { color: '#00A854' }, symbolSize: 5 },
    ],
  })
}

const openAlarmRule = () => {
  alarmVisible.value = true
}

const saveAlarm = () => {
  alarmVisible.value = false
  ElMessage.success('告警规则已保存（Mock）')
}

const showLog = (row: (typeof runningDetails)[number]) => {
  logTaskName.value = row.name
  logVisible.value = true
}

const handleResize = () => {
  resourceChart?.resize()
}

onMounted(() => {
  renderResourceChart()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  resourceChart?.dispose()
})
</script>
