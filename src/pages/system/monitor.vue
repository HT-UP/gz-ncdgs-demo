<template>
  <div class="standard-page">
    <el-row :gutter="16">
      <el-col :xs="24" :lg="6" v-for="metric in realtime" :key="metric.key">
        <el-card class="metric-card dashboard-card" shadow="hover">
          <div class="metric-title">{{ metric.label }}</div>
          <div class="metric-value" :style="{ color: metric.value > metric.threshold ? '#E34D59' : '#DA251D' }">
            {{ metric.value }}<span class="metric-cell-unit">%</span>
          </div>
          <div class="metric-subtitle">
            <span :class="metric.value > metric.threshold ? 'trend-negative' : 'trend-positive'">
              {{ metric.value > metric.threshold ? `超阈值（${metric.threshold}%）` : '运行正常' }}
            </span>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16">
      <el-col :xs="24" :lg="16">
        <el-card class="panel-card dashboard-card" shadow="never">
          <template #header>
            <div class="panel-header"><span>容量趋势分析（近 30 天）</span></div>
          </template>
          <div ref="trendChartRef" class="chart-box monitor-trend-chart"></div>
          <div class="threshold-note">
            <span class="threshold-dot" style="background: #E34D59"></span> 超阈值区域（CPU/内存 > 85%，存储/网络 > 80%）
          </div>
        </el-card>

        <el-card class="panel-card dashboard-card mt-16" shadow="never">
          <template #header>
            <div class="panel-header"><span>治理任务运行状态</span></div>
          </template>
          <el-table :data="taskMonitorStats" stripe size="small">
            <el-table-column prop="name" label="任务类型" min-width="140" />
            <el-table-column prop="total" label="执行总数" width="90" align="center" />
            <el-table-column label="成功率" width="160">
              <template #default="{ row }">
                <el-progress
                  :percentage="Math.round((row.success / row.total) * 100)"
                  :stroke-width="9"
                  :color="row.success / row.total >= 0.95 ? '#00A854' : '#ED7B2F'"
                />
              </template>
            </el-table-column>
            <el-table-column prop="avgDuration" label="平均时长" width="100" />
            <el-table-column label="异常任务" width="100" align="center">
              <template #default="{ row }">
                <el-tag v-if="row.abnormal > 0" type="danger" effect="dark" size="small">{{ row.abnormal }}</el-tag>
                <span v-else class="dep-text">0</span>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <el-col :xs="24" :lg="8">
        <el-card class="panel-card dashboard-card" shadow="never">
          <template #header>
            <div class="panel-header"><span>预警机制配置</span></div>
          </template>
          <el-form label-width="90px">
            <el-form-item v-for="item in alertRules" :key="item.key" :label="item.label">
              <div class="alert-rule-row">
                <span class="dep-text">超过</span>
                <el-input-number v-model="item.threshold" :min="50" :max="99" size="small" />
                <span class="dep-text">% 告警</span>
                <el-checkbox-group v-model="item.channels">
                  <el-checkbox value="站内" size="small">站内</el-checkbox>
                  <el-checkbox value="邮件" size="small">邮件</el-checkbox>
                  <el-checkbox value="短信" size="small">短信</el-checkbox>
                </el-checkbox-group>
              </div>
            </el-form-item>
          </el-form>
          <el-button type="danger" size="small" @click="saveAlerts">保存预警规则</el-button>
        </el-card>

        <el-card class="panel-card dashboard-card mt-16" shadow="never">
          <template #header>
            <div class="panel-header"><span>任务高可用保障</span></div>
          </template>
          <el-form label-width="110px">
            <el-form-item label="失败自动重试">
              <el-switch v-model="retry.enabled" />
            </el-form-item>
            <el-form-item label="最大重试次数">
              <el-input-number v-model="retry.maxTimes" :min="0" :max="10" :disabled="!retry.enabled" />
            </el-form-item>
            <el-form-item label="重试间隔">
              <el-select v-model="retry.interval" :disabled="!retry.enabled" class="w-full">
                <el-option label="1 分钟" value="1m" />
                <el-option label="5 分钟" value="5m" />
                <el-option label="30 分钟" value="30m" />
              </el-select>
            </el-form-item>
            <el-form-item label="失败通知">
              <el-checkbox v-model="retry.notify" :disabled="!retry.enabled">重试仍失败时通知负责人</el-checkbox>
            </el-form-item>
          </el-form>
          <el-button type="danger" size="small" @click="saveRetry">保存配置</el-button>
        </el-card>

        <el-card class="panel-card dashboard-card mt-16" shadow="never">
          <template #header>
            <div class="panel-header"><span>系统容量评估</span></div>
          </template>
          <div v-for="suggest in capacitySuggestions" :key="suggest.title" class="risk-item">
            <div class="risk-head">
              <span class="risk-id">{{ suggest.title }}</span>
              <el-tag :type="suggest.level === '高' ? 'danger' : suggest.level === '中' ? 'warning' : 'info'" effect="dark" size="small">{{ suggest.level }}</el-tag>
            </div>
            <div class="risk-desc">{{ suggest.desc }}</div>
          </div>
          <el-button type="primary" size="small" class="mt-8" @click="startAssessment">开始容量评估</el-button>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'
import { capacitySuggestions, realtimeMetrics, taskMonitorStats, trend30Days } from '@/mock/system'

const realtime = [
  { key: 'cpu', label: 'CPU 使用率', value: realtimeMetrics.cpu, threshold: realtimeMetrics.cpuThreshold },
  { key: 'memory', label: '内存使用率', value: realtimeMetrics.memory, threshold: realtimeMetrics.memoryThreshold },
  { key: 'storage', label: '存储空间', value: realtimeMetrics.storage, threshold: realtimeMetrics.storageThreshold },
  { key: 'network', label: '网络吞吐量', value: realtimeMetrics.network, threshold: realtimeMetrics.networkThreshold },
]

const alertRules = reactive(
  [
    { key: 'cpu', label: 'CPU 使用率', threshold: realtimeMetrics.cpuThreshold, channels: ['站内', '邮件'] },
    { key: 'memory', label: '内存使用率', threshold: realtimeMetrics.memoryThreshold, channels: ['站内', '邮件'] },
    { key: 'storage', label: '存储空间', threshold: realtimeMetrics.storageThreshold, channels: ['站内'] },
    { key: 'network', label: '网络吞吐', threshold: realtimeMetrics.networkThreshold, channels: ['站内'] },
  ],
)

const retry = reactive({ enabled: true, maxTimes: 3, interval: '5m', notify: true })

const trendChartRef = ref<HTMLElement>()
let trendChart: echarts.ECharts | null = null

const thresholds: Record<string, number> = {
  cpu: 85,
  memory: 85,
  storage: 80,
  network: 80,
}

const renderTrend = () => {
  if (!trendChartRef.value) return
  trendChart?.dispose()
  trendChart = echarts.init(trendChartRef.value)
  const series = [
    { key: 'cpu', name: 'CPU 使用率', color: '#DA251D', data: trend30Days.cpu },
    { key: 'memory', name: '内存使用率', color: '#2B6CB0', data: trend30Days.memory },
    { key: 'storage', name: '存储空间', color: '#00A854', data: trend30Days.storage },
    { key: 'network', name: '网络吞吐量', color: '#9B59B6', data: trend30Days.network },
  ].map((item) => ({
    ...item,
    areaStyle: {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: item.color },
        { offset: 1, color: 'rgba(255,255,255,0)' },
      ]),
    },
  }))
  trendChart.setOption({
    tooltip: { trigger: 'axis' },
    legend: { data: series.map((item) => item.name), bottom: 0, icon: 'roundRect', itemWidth: 12, itemHeight: 4 },
    grid: { left: 8, right: 8, top: 14, bottom: 30, containLabel: true },
    xAxis: { type: 'category', boundaryGap: false, data: trend30Days.days },
    yAxis: { type: 'value', max: 100, splitLine: { lineStyle: { type: 'dashed', color: '#E4E7ED' } } },
    visualMap: {
      show: false,
      pieces: [{ lte: 100, gt: 0, color: 'rgba(0,0,0,0)' }],
    },
    series: series.map((item) => ({
      name: item.name,
      type: 'line',
      smooth: true,
      symbol: 'none',
      data: item.data,
      lineStyle: { color: item.color, width: 2 },
      itemStyle: { color: item.color },
      areaStyle: item.areaStyle,
      markLine: {
        silent: true,
        symbol: 'none',
        data: [{ yAxis: thresholds[item.key] }],
        lineStyle: { color: '#E34D59', type: 'dashed', width: 1 },
        label: { formatter: `阈值 ${thresholds[item.key]}%`, color: '#E34D59', fontSize: 10 },
      },
    })),
  })
}

let resizeObserver: ResizeObserver | null = null
const handleResize = () => trendChart?.resize()

onMounted(() => {
  renderTrend()
  window.addEventListener('resize', handleResize)
  if (trendChartRef.value && typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(() => handleResize())
    resizeObserver.observe(trendChartRef.value)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  resizeObserver?.disconnect()
  trendChart?.dispose()
})

const saveAlerts = () => ElMessage.success('预警规则已保存（Mock）')
const saveRetry = () => ElMessage.success('高可用配置已保存，失败任务将自动重试（Mock）')
const startAssessment = () => ElMessage.success('容量评估任务已启动，预计 10 分钟后生成评估报告（Mock）')
</script>