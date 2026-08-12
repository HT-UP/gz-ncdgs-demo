<template>
  <div class="standard-page">
    <el-row :gutter="16">
      <el-col :xs="24" :lg="6" v-for="agent in agents" :key="agent.key">
        <el-card class="agent-status-card dashboard-card" shadow="hover">
          <div class="agent-status-head">
            <el-icon :size="18" class="agent-icon"><Cpu /></el-icon>
            <span class="agent-name">{{ agent.name }}</span>
            <el-tag :type="agentStatusTag[agent.status]" effect="dark" size="small">{{ agent.status }}</el-tag>
          </div>
          <div class="agent-desc">{{ agent.desc }}</div>
          <div class="agent-metric">{{ agent.metric }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-card class="panel-card dashboard-card metrics-card" shadow="never">
      <template #header>
        <div class="panel-header"><span>核心准确率指标</span></div>
      </template>
      <el-row :gutter="16">
        <el-col :xs="24" :sm="12" :lg="6" v-for="metric in metrics" :key="metric.name">
          <div class="metric-cell">
            <div class="metric-cell-name">{{ metric.name }}</div>
            <div class="metric-cell-value" :style="{ color: metricColor(metric.value) }">
              {{ metric.value }}<span class="metric-cell-unit">%</span>
              <span class="metric-cell-trend" :class="trendClass(metric.trend)">{{ trendArrow(metric.trend) }}</span>
            </div>
            <el-progress
              :percentage="metric.value"
              :color="metricColor(metric.value)"
              :show-text="false"
              :stroke-width="7"
            />
            <div class="metric-cell-target">阀值要求 ≥ {{ metric.target }}%</div>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <el-row :gutter="16">
      <el-col :xs="24" :lg="14">
        <el-card class="panel-card dashboard-card" shadow="never">
          <template #header>
            <div class="panel-header"><span>智能任务执行趋势（近 7 天）</span></div>
          </template>
          <div ref="trendChartRef" class="chart-box trend-chart"></div>
        </el-card>
      </el-col>

      <el-col :xs="24" :lg="10">
        <el-card class="panel-card dashboard-card" shadow="never">
          <template #header>
            <div class="panel-header"><span>大模型 API 调用状态</span></div>
          </template>
          <el-descriptions :column="1" border size="small">
            <el-descriptions-item label="模型名称">{{ llmStatus.model }}</el-descriptions-item>
            <el-descriptions-item label="调用状态">
              <el-tag type="success" effect="dark" size="small">{{ llmStatus.status }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="配额使用">
              <el-progress :percentage="llmStatus.usagePercent" :stroke-width="10" :color="quotaColor" />
              <div class="dep-text">{{ llmStatus.used }} / {{ llmStatus.quota }}</div>
            </el-descriptions-item>
            <el-descriptions-item label="平均时延">{{ llmStatus.avgLatency }}</el-descriptions-item>
            <el-descriptions-item label="近 7 日调用量">{{ llmStatus.calls }}</el-descriptions-item>
          </el-descriptions>
          <div class="quota-alert" v-if="llmStatus.usagePercent > 40">
            提示：当日配额用量超过 40%，建议关注并调整调度策略（Mock）
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-card class="panel-card dashboard-card" shadow="never">
      <template #header>
        <div class="panel-header"><span>最近智能任务执行记录</span></div>
      </template>
      <el-table :data="recentTasks" stripe size="small">
        <el-table-column prop="time" label="时间" width="160" />
        <el-table-column prop="name" label="任务名称" min-width="170" />
        <el-table-column prop="agent" label="智能体" width="150" />
        <el-table-column prop="type" label="类型" width="120">
          <template #default="{ row }">
            <el-tag size="small" effect="plain">{{ row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="90">
          <template #default="{ row }">
            <el-tag :type="taskStatusTag[row.status]" effect="dark" size="small">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="duration" label="耗时" width="80" />
        <el-table-column prop="model" label="模型" width="110" />
        <el-table-column prop="trigger" label="触发" width="80" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { Cpu } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import { agentCards, llmStatus, metrics, mockAITasks, trendData } from '@/mock/intelligence'

const agents = ref(agentCards)

const agentStatusTag: Record<string, 'success' | 'info' | 'danger'> = {
  运行中: 'success',
  已停止: 'info',
  异常: 'danger',
}

const taskStatusTag: Record<string, 'success' | 'warning' | 'danger'> = {
  成功: 'success',
  运行中: 'warning',
  失败: 'danger',
}

const metricColor = (value: number) => {
  if (value >= 80) return '#00A854'
  if (value >= 60) return '#ED7B2F'
  return '#E34D59'
}

const trendArrow = (trend: string) => (trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→')
const trendClass = (trend: string) => (trend === 'down' ? 'trend-down' : 'trend-up')
const quotaColor = llmStatus.usagePercent >= 80 ? '#E34D59' : '#2B6CB0'

const recentTasks = ref([...mockAITasks].slice(0, 10))

const trendChartRef = ref<HTMLElement>()
let trendChart: echarts.ECharts | null = null

const renderTrend = () => {
  if (!trendChartRef.value) return
  trendChart?.dispose()
  trendChart = echarts.init(trendChartRef.value)
  trendChart.setOption({
    tooltip: { trigger: 'axis' },
    legend: { data: ['调用量', '成功量', 'Token 消耗（万）'], top: 0, icon: 'roundRect', itemWidth: 12, itemHeight: 4 },
    grid: { left: 8, right: 8, top: 40, bottom: 10, containLabel: true },
    xAxis: { type: 'category', boundaryGap: false, data: trendData.dates },
    yAxis: [
      { type: 'value', name: '次数', nameGap: 12, splitLine: { lineStyle: { type: 'dashed', color: '#E4E7ED' } } },
      { type: 'value', name: 'Token', nameGap: 12, splitLine: { show: false } },
    ],
    series: [
      {
        name: '调用量',
        type: 'line',
        smooth: true,
        data: trendData.calls,
        itemStyle: { color: '#DA251D' },
        lineStyle: { color: '#DA251D', width: 3 },
        areaStyle: { color: 'rgba(218,37,29,0.08)' },
      },
      {
        name: '成功量',
        type: 'line',
        smooth: true,
        data: trendData.success,
        itemStyle: { color: '#00A854' },
        lineStyle: { color: '#00A854', width: 2 },
      },
      {
        name: 'Token 消耗（万）',
        type: 'line',
        yAxisIndex: 1,
        smooth: true,
        data: trendData.tokens,
        itemStyle: { color: '#9B59B6' },
        lineStyle: { color: '#9B59B6', width: 2, type: 'dashed' },
      },
    ],
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
</script>