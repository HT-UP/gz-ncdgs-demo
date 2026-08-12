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

    <el-row :gutter="16" class="mb-16">
      <el-col :xs="24" :lg="9">
        <el-card class="panel-card dashboard-card" shadow="never">
          <template #header>
            <div class="panel-header">
              <span>质量综合评分（雷达图）</span>
            </div>
          </template>
          <div ref="radarChartRef" class="chart-box"></div>
          <div class="score-overview">
            <div class="score-big">92.6</div>
            <div class="score-desc">综合质量评分 · 较上月 <span class="trend-positive">+1.2</span></div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :lg="15">
        <el-card class="panel-card dashboard-card" shadow="never">
          <template #header>
            <div class="panel-header">
              <span>评分趋势</span>
              <div class="panel-actions">
                <el-radio-group v-model="trendRange" size="small">
                  <el-radio-button label="day">按日</el-radio-button>
                  <el-radio-button label="week">按周</el-radio-button>
                  <el-radio-button label="month">按月</el-radio-button>
                </el-radio-group>
              </div>
            </div>
          </template>
          <div ref="trendChartRef" class="chart-box"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16">
      <el-col :xs="24" :lg="8">
        <el-card class="panel-card dashboard-card" shadow="never">
          <template #header>
            <div class="panel-header">
              <span>维度下钻评分</span>
            </div>
          </template>
          <el-table :data="dimensionScores" size="small" stripe>
            <el-table-column prop="dimension" label="维度" min-width="90" />
            <el-table-column label="得分" width="80" align="center">
              <template #default="{ row }">
                <span class="dim-score" :style="{ color: row.color }">{{ row.score }}</span>
              </template>
            </el-table-column>
            <el-table-column label="趋势" width="100" align="center">
              <template #default="{ row }">
                <span :class="row.trend >= 0 ? 'trend-positive' : 'trend-negative'">
                  {{ row.trend >= 0 ? '+' : '' }}{{ row.trend }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="占比" min-width="120">
              <template #default="{ row }">
                <el-progress :percentage="row.percentage" :color="row.color" :stroke-width="8" />
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <el-col :xs="24" :lg="8">
        <el-card class="panel-card dashboard-card" shadow="never">
          <template #header>
            <div class="panel-header">
              <span>业务域质量排名</span>
            </div>
          </template>
          <div class="rank-list">
            <div v-for="(item, index) in domainRank" :key="item.name" class="rank-item">
              <span class="rank-no" :class="{ 'rank-top': index < 3 }">{{ index + 1 }}</span>
              <span class="rank-name">{{ item.name }}</span>
              <el-progress
                :percentage="item.score"
                :color="item.score >= 90 ? '#00A854' : item.score >= 80 ? '#2B6CB0' : '#ED7B2F'"
                :stroke-width="9"
                class="rank-progress"
              />
              <span class="rank-score">{{ item.score }}</span>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :lg="8">
        <el-card class="panel-card dashboard-card" shadow="never">
          <template #header>
            <div class="panel-header">
              <span>系统质量横向对比</span>
            </div>
          </template>
          <div ref="compareChartRef" class="chart-box"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import * as echarts from 'echarts'

const radarChartRef = ref<HTMLElement>()
const trendChartRef = ref<HTMLElement>()
const compareChartRef = ref<HTMLElement>()
const trendRange = ref('week')
let radarChart: echarts.ECharts | null = null
let trendChart: echarts.ECharts | null = null
let compareChart: echarts.ECharts | null = null

const metrics = [
  { label: '综合质量评分', value: '92.6', note: '较上月 +1.2', warning: false },
  { label: '规则总数', value: '156', note: '启用 112 条', warning: false },
  { label: '本月检查量', value: '1,284万', note: '较上月 +8.5%', warning: false },
  { label: '问题数据率', value: '1.8%', note: '较上月 -0.3%', warning: false },
]

const dimensionScores = [
  { dimension: '完整性', score: 95, trend: 1.5, percentage: 95, color: '#DA251D' },
  { dimension: '准确性', score: 91, trend: -0.8, percentage: 91, color: '#2B6CB0' },
  { dimension: '一致性', score: 89, trend: 2.1, percentage: 89, color: '#00A854' },
  { dimension: '唯一性', score: 94, trend: 0.6, percentage: 94, color: '#ED7B2F' },
  { dimension: '及时性', score: 92, trend: 1.2, percentage: 92, color: '#9B59B6' },
]

const domainRank = [
  { name: '客运管理', score: 95 },
  { name: '设备设施', score: 92 },
  { name: '运营服务', score: 90 },
  { name: '建设管理', score: 86 },
  { name: '财务资产', score: 82 },
]

const renderRadar = () => {
  if (!radarChartRef.value) return
  radarChart?.dispose()
  radarChart = echarts.init(radarChartRef.value)
  radarChart.setOption({
    tooltip: {},
    radar: {
      indicator: [
        { name: '完整性', max: 100 },
        { name: '准确性', max: 100 },
        { name: '一致性', max: 100 },
        { name: '唯一性', max: 100 },
        { name: '及时性', max: 100 },
      ],
      radius: '66%',
      splitArea: { areaStyle: { color: ['rgba(218,37,29,0.03)', 'rgba(218,37,29,0.06)', 'rgba(218,37,29,0.09)', 'rgba(218,37,29,0.12)', 'rgba(218,37,29,0.15)'] } },
      axisLine: { lineStyle: { color: '#E4E7ED' } },
      splitLine: { lineStyle: { color: '#E4E7ED' } },
      axisName: { color: '#4a4a4a', fontSize: 12 },
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: [95, 91, 89, 94, 92],
            name: '综合评分',
            areaStyle: { color: 'rgba(218,37,29,0.25)' },
            lineStyle: { color: '#DA251D', width: 2 },
            itemStyle: { color: '#DA251D' },
          },
        ],
      },
    ],
  })
}

const renderTrend = () => {
  if (!trendChartRef.value) return
  trendChart?.dispose()
  trendChart = echarts.init(trendChartRef.value)
  const labels =
    trendRange.value === 'day'
      ? Array.from({ length: 30 }, (_, i) => `08-${String(i + 1).padStart(2, '0')}`)
      : trendRange.value === 'week'
        ? Array.from({ length: 12 }, (_, i) => `第${i + 1}周`)
        : Array.from({ length: 12 }, (_, i) => `${i + 1}月`)
  const length = labels.length
  const build = (base: number, wave: number) =>
    Array.from({ length }, (_, i) => Math.round(base + Math.sin(i / wave) * 3 + Math.random() * 2))
  trendChart.setOption({
    tooltip: { trigger: 'axis' },
    legend: { data: ['综合评分', '准确性', '及时性'], top: 0, left: 0 },
    grid: { left: 40, right: 20, top: 40, bottom: 30 },
    xAxis: { type: 'category', data: labels },
    yAxis: [{ type: 'value', min: 80, max: 100, splitLine: { lineStyle: { type: 'dashed', color: '#E4E7ED' } } }],
    series: [
      { name: '综合评分', type: 'line', smooth: true, data: build(92.6, 3), lineStyle: { color: '#DA251D', width: 3 }, itemStyle: { color: '#DA251D' }, symbolSize: 5 },
      { name: '准确性', type: 'line', smooth: true, data: build(91, 2.5), lineStyle: { color: '#2B6CB0', width: 2 }, itemStyle: { color: '#2B6CB0' }, symbolSize: 5 },
      { name: '及时性', type: 'line', smooth: true, data: build(92, 2.8), lineStyle: { color: '#00A854', width: 2 }, itemStyle: { color: '#00A854' }, symbolSize: 5 },
    ],
  })
}

const renderCompare = () => {
  if (!compareChartRef.value) return
  compareChart?.dispose()
  compareChart = echarts.init(compareChartRef.value)
  const systems = ['票务系统', '客流系统', '设备系统', '建设系统', '财务系统', '运营系统']
  const scores = [95, 92, 90, 86, 82, 88]
  compareChart.setOption({
    tooltip: { trigger: 'axis' },
    grid: { left: 70, right: 20, top: 20, bottom: 30 },
    xAxis: { type: 'value', max: 100, splitLine: { lineStyle: { type: 'dashed', color: '#E4E7ED' } } },
    yAxis: { type: 'category', data: systems.reverse() },
    series: [
      {
        name: '质量评分',
        type: 'bar',
        barWidth: 14,
        data: scores.reverse().map((value, index) => ({
          value,
          itemStyle: { color: ['#DA251D', '#2B6CB0', '#00A854', '#ED7B2F', '#9B59B6', '#2B6CB0'][index] },
          label: { show: true, position: 'right', color: '#4a4a4a' },
        })),
      },
    ],
  })
}

const handleResize = () => {
  radarChart?.resize()
  trendChart?.resize()
  compareChart?.resize()
}

watch(trendRange, renderTrend)

onMounted(() => {
  renderRadar()
  renderTrend()
  renderCompare()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  radarChart?.dispose()
  trendChart?.dispose()
  compareChart?.dispose()
})
</script>
