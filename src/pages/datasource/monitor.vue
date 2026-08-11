<template>
  <div class="standard-page">
    <el-row :gutter="16">
      <el-col :xs="24" :lg="6" v-for="metric in monitorMetrics" :key="metric.label">
        <el-card class="metric-card dashboard-card" shadow="hover">
          <div class="metric-title">{{ metric.label }}</div>
          <div class="metric-value">{{ metric.value }}</div>
          <div class="metric-subtitle">
            <span :class="metric.status === 'warning' ? 'trend-negative' : 'trend-positive'">{{ metric.note }}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16">
      <el-col :xs="24" :lg="16">
        <el-card class="panel-card dashboard-card" shadow="never">
          <template #header>
            <div class="panel-header">
              <span>性能指标监控</span>
              <div class="panel-actions">
                <el-radio-group v-model="metricRange" size="small">
                  <el-radio-button label="1h">近1小时</el-radio-button>
                  <el-radio-button label="24h">近24小时</el-radio-button>
                </el-radio-group>
              </div>
            </div>
          </template>
          <div ref="perfChartRef" class="chart-box"></div>
        </el-card>
      </el-col>

      <el-col :xs="24" :lg="8">
        <el-card class="panel-card dashboard-card" shadow="never">
          <template #header>
            <div class="panel-header">
              <span>告警级别分布</span>
            </div>
          </template>
          <div ref="alertPieRef" class="chart-box chart-box--compact"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16">
      <el-col :span="24">
        <el-card class="panel-card dashboard-card" shadow="never">
          <template #header>
            <div class="panel-header">
              <span>告警历史查询</span>
              <div class="panel-actions">
                <el-select v-model="alertLevel" placeholder="告警级别" clearable class="filter-select" size="small">
                  <el-option label="严重" value="严重" />
                  <el-option label="警告" value="警告" />
                  <el-option label="提示" value="提示" />
                </el-select>
                <el-button type="danger" size="small" @click="queryAlerts">查询</el-button>
              </div>
            </div>
          </template>
          <el-table :data="filteredAlerts" stripe>
            <el-table-column prop="time" label="告警时间" width="160" />
            <el-table-column prop="source" label="数据源" width="170" />
            <el-table-column label="级别" width="90">
              <template #default="{ row }">
                <el-tag :type="alertTagType[row.level]" effect="dark">{{ row.level }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="content" label="告警内容" min-width="240" show-overflow-tooltip />
            <el-table-column label="通知方式" width="130">
              <template #default="{ row }">{{ row.notify.join(' / ') }}</template>
            </el-table-column>
            <el-table-column prop="status" label="处理状态" width="100">
              <template #default="{ row }">
                <el-tag effect="plain" :type="row.status === '已处理' ? 'success' : 'warning'">{{ row.status }}</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'

const monitorMetrics = [
  { label: '今日告警数', value: '17', note: '较昨日 -5', status: 'ok' },
  { label: '异常数据源', value: '3', note: '需要关注', status: 'warning' },
  { label: '平均响应时间', value: '28ms', note: '低于阈值', status: 'ok' },
  { label: '平均吞吐量', value: '1.2K/s', note: '运行平稳', status: 'ok' },
]

const metricRange = ref('1h')
const alertLevel = ref('')
const perfChartRef = ref<HTMLElement>()
const alertPieRef = ref<HTMLElement>()

let perfChart: echarts.ECharts | null = null
let alertPie: echarts.ECharts | null = null

const alerts = ref([
  { time: '2026-08-11 14:05', source: '设备信号库', level: '严重', content: '数据源连接中断，重连 3 次失败', notify: ['站内', '短信'], status: '未处理' },
  { time: '2026-08-11 13:47', source: '票务核心库', level: '警告', content: '响应时间超过阈值 500ms', notify: ['站内'], status: '处理中' },
  { time: '2026-08-11 12:30', source: '客流分析库', level: '提示', content: '连接数使用率超过 80%', notify: ['站内'], status: '已处理' },
  { time: '2026-08-11 10:52', source: '设备信号库', level: '严重', content: '连接池活跃连接数达到上限', notify: ['站内', '邮件'], status: '处理中' },
  { time: '2026-08-11 09:18', source: '票务核心库', level: '警告', content: '吞吐量下降超过 30%', notify: ['站内'], status: '已处理' },
  { time: '2026-08-11 08:45', source: '建设进度库', level: '提示', content: '数据源已完成定时健康探测', notify: ['站内'], status: '已处理' },
])

const alertTagType: Record<string, 'danger' | 'warning' | 'info'> = {
  严重: 'danger',
  警告: 'warning',
  提示: 'info',
}

const filteredAlerts = computed(() =>
  alertLevel.value ? alerts.value.filter((row) => row.level === alertLevel.value) : alerts.value,
)

const renderPerfChart = () => {
  if (!perfChartRef.value) return
  perfChart?.dispose()
  perfChart = echarts.init(perfChartRef.value)
  const hours = metricRange.value === '1h' ? 12 : 24
  const data = Array.from({ length: hours }, (_, i) => 18 + Math.round(Math.sin(i / 2) * 6 + Math.random() * 8))
  perfChart.setOption({
    tooltip: { trigger: 'axis' },
    legend: { data: ['响应时间(ms)', '吞吐量(K/s)', '活跃连接数'], top: 0, left: 0 },
    grid: { left: 44, right: 44, top: 36, bottom: 32 },
    xAxis: {
      type: 'category',
      data: Array.from({ length: hours }, (_, i) => `${String(8 + (i % 14)).padStart(2, '0')}:${String((i * 5) % 60).padStart(2, '0')}`),
    },
    yAxis: [
      { type: 'value', name: 'ms/K/s', splitLine: { lineStyle: { type: 'dashed', color: '#E4E7ED' } } },
      { type: 'value', name: '连接数', splitLine: { show: false } },
    ],
    series: [
      {
        name: '响应时间(ms)',
        type: 'line',
        smooth: true,
        data,
        lineStyle: { color: '#DA251D', width: 3 },
        itemStyle: { color: '#DA251D' },
        symbolSize: 5,
      },
      {
        name: '吞吐量(K/s)',
        type: 'line',
        smooth: true,
        data: data.map((value) => Math.round(value / 1.8)),
        lineStyle: { color: '#2B6CB0', width: 2 },
        itemStyle: { color: '#2B6CB0' },
      },
      {
        name: '活跃连接数',
        type: 'line',
        smooth: true,
        yAxisIndex: 1,
        data: data.map((value) => value * 3 + 40),
        lineStyle: { color: '#00A854', width: 2 },
        itemStyle: { color: '#00A854' },
      },
    ],
  })
}

const renderAlertPie = () => {
  if (!alertPieRef.value) return
  alertPie?.dispose()
  alertPie = echarts.init(alertPieRef.value)
  alertPie.setOption({
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    series: [
      {
        type: 'pie',
        radius: ['45%', '72%'],
        center: ['50%', '52%'],
        itemStyle: { borderRadius: 8, borderColor: '#fff', borderWidth: 2 },
        label: { formatter: '{b}\n{d}%' },
        data: [
          { value: 3, name: '严重', itemStyle: { color: '#E34D59' } },
          { value: 6, name: '警告', itemStyle: { color: '#ED7B2F' } },
          { value: 8, name: '提示', itemStyle: { color: '#2B6CB0' } },
        ],
      },
    ],
  })
}

const queryAlerts = () => {
  ElMessage.success('告警历史已查询（Mock）')
}

const handleResize = () => {
  perfChart?.resize()
  alertPie?.resize()
}

onMounted(() => {
  renderPerfChart()
  renderAlertPie()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  perfChart?.dispose()
  alertPie?.dispose()
})
</script>
