<template>
  <div class="standard-page">
    <el-row :gutter="16">
      <el-col :span="16">
        <el-card class="panel-card dashboard-card" shadow="never">
          <template #header>
            <div class="panel-header">
              <span>探查任务</span>
              <el-button type="danger" :icon="Plus" @click="openCreate">新建探查任务</el-button>
            </div>
          </template>

          <div class="toolbar-row">
            <el-input
              v-model="keyword"
              placeholder="按任务名称 / 负责人搜索"
              clearable
              class="search-input"
              :prefix-icon="Search"
            />
            <el-select v-model="filterTrigger" placeholder="触发方式" clearable class="filter-select">
              <el-option label="手动触发" value="手动触发" />
              <el-option label="定时调度" value="定时调度" />
              <el-option label="事件触发" value="事件触发" />
            </el-select>
            <el-select v-model="filterStatus" placeholder="状态" clearable class="filter-select">
              <el-option label="运行中" value="运行中" />
              <el-option label="成功" value="成功" />
              <el-option label="失败" value="失败" />
              <el-option label="待执行" value="待执行" />
            </el-select>
          </div>

          <el-table :data="filteredTasks" stripe class="mt-12">
            <el-table-column prop="name" label="任务名称" min-width="160" />
            <el-table-column prop="target" label="探查对象" width="140" />
            <el-table-column prop="type" label="探查类型" width="100">
              <template #default="{ row }">
                <el-tag effect="plain" type="danger">{{ row.type }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="触发方式" width="100">
              <template #default="{ row }">{{ row.trigger }}</template>
            </el-table-column>
            <el-table-column label="状态" width="90">
              <template #default="{ row }">
                <el-tag :type="statusTagType[row.status]" effect="dark">{{ row.status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="进度" min-width="120">
              <template #default="{ row }">
                <el-progress :percentage="row.progress" :stroke-width="9" />
              </template>
            </el-table-column>
            <el-table-column label="结果" min-width="150">
              <template #default="{ row }">
                <span class="dep-text">{{ row.result }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="180" fixed="right">
              <template #default="{ row }">
                <el-button link type="primary" @click="showResult(row)">结果</el-button>
                <el-button link type="warning" @click="showLog(row)">日志</el-button>
                <el-button link type="danger" @click="run(row)">执行</el-button>              </template>
            </el-table-column>
          </el-table>

          <el-pagination class="pager" layout="total, prev, pager, next" :total="filteredTasks.length" :page-size="20" background />
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card class="panel-card dashboard-card" shadow="never">
          <template #header>
            <div class="panel-header"><span>任务模板</span></div>
          </template>
          <div v-for="template in templates" :key="template.name" class="template-item" @click="useTemplate(template)">
            <div class="template-icon">
              <el-icon :size="18"><component :is="template.icon" /></el-icon>
            </div>
            <div class="template-info">
              <div class="template-name">{{ template.name }}</div>
              <div class="template-desc">{{ template.desc }}</div>
            </div>
            <el-tag size="small" type="danger" effect="plain" class="template-version">{{ template.version }}</el-tag>
          </div>
          <el-button class="w-full mt-12" plain @click="openTemplates">模板版本管理</el-button>
        </el-card>

        <el-card class="panel-card dashboard-card mt-16" shadow="never">
          <template #header>
            <div class="panel-header"><span>趋势分析</span></div>
          </template>
          <div ref="trendChartRef" class="chart-box-trend"></div>
          <div class="threshold-box">
            <div class="section-title">阈值预警</div>
            <div class="dep-text">字段数量异常率持续 3 天超过 5% 阈值，已自动预警（Mock）</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog v-model="createVisible" title="新建探查任务" width="580px">
      <el-form :model="createForm" label-width="100px">
        <el-form-item label="任务名称">
          <el-input v-model="createForm.name" />
        </el-form-item>
        <el-form-item label="探查对象">
          <el-select v-model="createForm.target" filterable class="w-full">
            <el-option v-for="table in ['ticket_sale_detail', 'passenger_info', 'flow_stat_daily', 'device_status_log', 'station_info']" :key="table" :label="table" :value="table" />
          </el-select>
        </el-form-item>
        <el-form-item label="探查类型">
          <el-select v-model="createForm.type" class="w-full">
            <el-option v-for="type in ['字段特征', '数据分布', '异常模式', '周期规律', '业务规则']" :key="type" :label="type" :value="type" />
          </el-select>
        </el-form-item>
        <el-form-item label="触发方式">
          <el-radio-group v-model="createForm.trigger">
            <el-radio value="手动触发" />
            <el-radio value="定时调度" />
            <el-radio value="事件触发" />
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="createVisible = false">取消</el-button>
        <el-button type="danger" @click="saveCreate">创建</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="resultVisible" title="探查结果可视化" width="760px">
      <el-row :gutter="16">
        <el-col :span="12">
          <div ref="resultChartRef" class="chart-box"></div>
        </el-col>
        <el-col :span="12">
          <el-table :data="resultRows" size="small" stripe>
            <el-table-column prop="field" label="字段" width="90" />
            <el-table-column prop="type" label="识别类型" width="90" />
            <el-table-column prop="confidence" label="置信度" width="70" />
            <el-table-column prop="sample" label="样例" min-width="110" />
          </el-table>
        </el-col>
      </el-row>
      <el-divider />
      <div class="section-title">历史任务结果对比</div>
      <el-table :data="historyCompare" size="small" stripe>
        <el-table-column prop="run" label="运行批次" width="110" />
        <el-table-column prop="count" label="识别字段数" width="90" />
        <el-table-column prop="avgConfidence" label="平均置信度" width="100" />
        <el-table-column prop="anomalies" label="异常发现" min-width="140" />
      </el-table>
    </el-dialog>

    <el-dialog v-model="logVisible" :title="`执行日志：${logTaskName}`" width="640px">
      <pre class="ddl-block">{{ logContent }}</pre>
    </el-dialog>

    <el-dialog v-model="templatesVisible" title="模板版本管理" width="600px">
      <el-table :data="templateVersions" stripe size="small">
        <el-table-column prop="name" label="模板名称" min-width="140" />
        <el-table-column prop="version" label="版本" width="100" />
        <el-table-column prop="updateTime" label="更新时间" width="150" />
        <el-table-column prop="updater" label="维护人" width="90" />
        <el-table-column label="操作" width="140">
          <template #default="{ row }">
            <el-button link type="primary">预览</el-button>
            <el-button link type="danger">设为当前</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { DataLine, Plus, Search, TrendCharts } from '@element-plus/icons-vue'
import { mockExploreTasks } from '@/mock/resource'
import * as echarts from 'echarts'

const statusTagType: Record<string, 'warning' | 'success' | 'danger' | 'warning'> = {
  运行中: 'warning',
  成功: 'success',
  失败: 'danger',
  待执行: 'warning',
}

const keyword = ref('')
const filterTrigger = ref('')
const filterStatus = ref('')
const createVisible = ref(false)
const resultVisible = ref(false)
const logVisible = ref(false)
const templatesVisible = ref(false)
const logTaskName = ref('')

const tasks = ref([...mockExploreTasks])

const templates = [
  { name: '字段特征探查模板', desc: '识别语义类型 / 字段角色', icon: DataLine, version: 'V2.3' },
  { name: '数据分布探查模板', desc: '分布形状 / 极值监控', icon: TrendCharts, version: 'V1.8' },
  { name: '异常模式探查模板', desc: '离群点 / 突变检测', icon: Search, version: 'V3.1' },
]

const templateVersions = [
  { name: '字段特征探查模板', version: 'V2.3', updateTime: '2026-08-01', updater: '张三' },
  { name: '字段特征探查模板', version: 'V2.2', updateTime: '2026-06-15', updater: '李四' },
  { name: '异常模式探查模板', version: 'V3.1', updateTime: '2026-07-20', updater: '王五' },
  { name: '数据分布探查模板', version: 'V1.8', updateTime: '2026-05-30', updater: '张三' },
]

const createForm = reactive({
  name: '',
  target: 'ticket_sale_detail',
  type: '字段特征',
  trigger: '手动触发',
})

const trendChartRef = ref<HTMLElement>()
const resultChartRef = ref<HTMLElement>()
let trendChart: echarts.ECharts | null = null
let resultChart: echarts.ECharts | null = null

const resultRows = [
  { field: 'cust_name', type: '姓名', confidence: '96%', sample: '张三' },
  { field: 'phone_no', type: '手机号', confidence: '93%', sample: '138****1234' },
  { field: 'id_card_no', type: '身份证号码', confidence: '97%', sample: '4401**********1234' },
  { field: 'amount_num', type: '金额', confidence: '88%', sample: '12.50' },
]

const historyCompare = [
  { run: '2026-08-12 10:00', count: 386, avgConfidence: '91.2%', anomalies: '2 个突增模式' },
  { run: '2026-08-05 10:00', count: 374, avgConfidence: '90.5%', anomalies: '1 个离群点' },
  { run: '2026-07-29 10:00', count: 362, avgConfidence: '89.8%', anomalies: '无异常' },
]

const logContent = `2026-08-12 10:00:01 [INFO] 探查任务启动（手动触发）
2026-08-12 10:00:12 [INFO] 读取字段元数据 386 个
2026-08-12 10:00:40 [INFO] 字段特征识别完成，语义标注 312 个
2026-08-12 10:01:05 [INFO] 数据分布采样 50 万行
2026-08-12 10:01:48 [WARN] 发现 2 个突增模式（flow_count 08-11 03:00）
2026-08-12 10:02:10 [INFO] 写入特征标签，生成识别报告`

const filteredTasks = computed(() =>
  tasks.value.filter((task) => {
    if (filterTrigger.value && task.trigger !== filterTrigger.value) return false
    if (filterStatus.value && task.status !== filterStatus.value) return false
    if (!keyword.value) return true
    const kw = keyword.value.toLowerCase()
    return task.name.toLowerCase().includes(kw) || task.owner.toLowerCase().includes(kw)
  }),
)

const openCreate = () => {
  Object.assign(createForm, { name: '', target: 'ticket_sale_detail', type: '字段特征', trigger: '手动触发' })
  createVisible.value = true
}

const saveCreate = () => {
  if (!createForm.name.trim()) {
    ElMessage.warning('请输入任务名称')
    return
  }
  tasks.value.unshift({
    id: `ex-mock-${Date.now()}`,
    name: createForm.name,
    target: createForm.target,
    type: createForm.type,
    trigger: createForm.trigger as '手动触发' | '定时调度' | '事件触发',
    status: '待执行',
    progress: 0,
    lastRun: '-',
    owner: '张三',
    result: '尚未执行',
  })
  createVisible.value = false
  ElMessage.success('探查任务已创建（Mock）')
}

const showResult = (_row: (typeof tasks.value)[number]) => {
  resultVisible.value = true
  renderResultChart()
}

const showLog = (row: (typeof tasks.value)[number]) => {
  logTaskName.value = row.name
  logVisible.value = true
}

const run = (row: (typeof tasks.value)[number]) => {
  row.status = '运行中'
  row.progress = 30
  ElMessage.success(`探查任务「${row.name}」已触发（Mock）`)
}

const useTemplate = (template: (typeof templates)[number]) => {
  createForm.name = template.name
  createForm.type = template.name.replace('探查模板', '')
  ElMessage.success(`已套用模板「${template.name}」（${template.version}）`)
}

const openTemplates = () => {
  templatesVisible.value = true
}

const renderTrend = () => {
  if (!trendChartRef.value) return
  trendChart?.dispose()
  trendChart = echarts.init(trendChartRef.value)
  const dates = Array.from({ length: 12 }, (_, i) => `${String(i + 1).padStart(2, '0')}/01`)
  trendChart.setOption({
    tooltip: { trigger: 'axis' },
    grid: { left: 35, right: 12, top: 24, bottom: 24 },
    xAxis: { type: 'category', data: dates, axisLabel: { fontSize: 10 } },
    yAxis: { type: 'value', splitLine: { lineStyle: { type: 'dashed', color: '#E4E7ED' } } },
    series: [
      {
        name: '探查任务数',
        type: 'line',
        smooth: true,
        data: [6, 9, 12, 10, 15, 14, 18, 22, 24, 26, 30, 35],
        lineStyle: { color: '#DA251D', width: 3 },
        itemStyle: { color: '#DA251D' },
        areaStyle: { color: 'rgba(218,37,29,0.08)' },
        symbolSize: 5,
      },
    ],
  })
}

const renderResultChart = () => {
  if (!resultChartRef.value) return
  resultChart?.dispose()
  resultChart = echarts.init(resultChartRef.value)
  resultChart.setOption({
    tooltip: { trigger: 'axis' },
    grid: { left: 32, right: 10, top: 24, bottom: 24 },
    xAxis: { type: 'category', data: ['姓名', '手机号', '身份证', '金额'] },
    yAxis: { type: 'value', max: 100, splitLine: { lineStyle: { type: 'dashed', color: '#E4E7ED' } } },
    series: [
      {
        type: 'bar',
        barWidth: 22,
        data: [
          { value: 96, itemStyle: { color: '#DA251D' } },
          { value: 93, itemStyle: { color: '#2B6CB0' } },
          { value: 97, itemStyle: { color: '#00A854' } },
          { value: 88, itemStyle: { color: '#ED7B2F' } },
        ],
      },
    ],
  })
}

const handleResize = () => {
  trendChart?.resize()
  resultChart?.resize()
}

onMounted(() => {
  renderTrend()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  trendChart?.dispose()
  resultChart?.dispose()
})
</script>