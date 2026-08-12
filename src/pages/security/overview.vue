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
      <el-col :xs="24" :lg="8">
        <el-card class="panel-card dashboard-card" shadow="never">
          <template #header>
            <div class="panel-header"><span>安全事件分布</span></div>
          </template>
          <div ref="eventChartRef" class="chart-box"></div>
        </el-card>
      </el-col>

      <el-col :xs="24" :lg="8">
        <el-card class="panel-card dashboard-card" shadow="never">
          <template #header>
            <div class="panel-header"><span>合规状态仪表盘</span></div>
          </template>
          <div class="gauge-wrap">
            <div ref="gaugeChartRef" class="gauge-chart"></div>
            <div class="gauge-note">综合合规率 · 较上季度 <span class="trend-positive">+3.4%</span></div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :lg="8">
        <el-card class="panel-card dashboard-card" shadow="never">
          <template #header>
            <div class="panel-header"><span>加密与脱敏覆盖</span></div>
          </template>
          <div class="coverage-list">
            <div class="coverage-item">
              <div class="coverage-head"><span>已加密存储表</span><b>68%</b></div>
              <el-progress :percentage="68" :color="coverageColors[0]" :stroke-width="10" />
            </div>
            <div class="coverage-item">
              <div class="coverage-head"><span>敏感字段脱敏</span><b>92%</b></div>
              <el-progress :percentage="92" :color="coverageColors[1]" :stroke-width="10" />
            </div>
            <div class="coverage-item">
              <div class="coverage-head"><span>传输加密通道</span><b>100%</b></div>
              <el-progress :percentage="100" :color="coverageColors[2]" :stroke-width="10" />
            </div>
            <div class="coverage-item">
              <div class="coverage-head"><span>密钥自动轮换</span><b>45%</b></div>
              <el-progress :percentage="45" :color="coverageColors[3]" :stroke-width="10" />
            </div>
          </div>
          <div class="dep-text mt-8">已对 3,458 张表中的 2,351 张启用存储加密</div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16">
      <el-col :xs="24" :lg="14">
        <el-card class="panel-card dashboard-card" shadow="never">
          <template #header>
            <div class="panel-header"><span>近期安全告警</span></div>
          </template>
          <el-table :data="alerts" stripe size="small">
            <el-table-column label="级别" width="80">
              <template #default="{ row }">
                <el-tag :type="levelTagType[row.level]" effect="dark" size="small">{{ row.level }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="title" label="告警内容" min-width="200" />
            <el-table-column prop="source" label="来源" width="130" />
            <el-table-column prop="time" label="时间" width="150" />
          </el-table>
        </el-card>
      </el-col>

      <el-col :xs="24" :lg="10">
        <el-card class="panel-card dashboard-card" shadow="never">
          <template #header>
            <div class="panel-header"><span>法规条款符合率</span></div>
          </template>
          <div class="regulation-list">
            <div v-for="item in regulations" :key="item.name" class="regulation-item">
              <span class="regulation-name">{{ item.name }}</span>
              <el-progress
                :percentage="item.rate"
                :color="item.rate >= 95 ? '#00A854' : item.rate >= 85 ? '#ED7B2F' : '#E34D59'"
                :stroke-width="9"
                class="regulation-progress"
              />
              <span class="regulation-rate">{{ item.rate }}%</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import * as echarts from 'echarts'

const metrics = [
  { label: '租户总数', value: '8', note: '其中 1 个停用', warning: false },
  { label: '权限策略数', value: '56', note: '本月新增 6 条', warning: false },
  { label: '审计日志数', value: '12.6万', note: '近 30 日', warning: false },
  { label: '合规检查通过率', value: '92.6%', note: '较上季度 +3.4%', warning: false },
]

const events = [
  { name: '高危', value: 12 },
  { name: '中危', value: 34 },
  { name: '低危', value: 68 },
  { name: '提示', value: 118 },
]

const alerts = [
  { level: '高', title: '检测到异常登录：连续 5 次失败后成功登录', source: '认证服务', time: '2026-08-12 09:45' },
  { level: '高', title: '「admin」账号在非业务时间批量导出敏感数据', source: '审计引擎', time: '2026-08-12 08:12' },
  { level: '中', title: '租户 t3 任务并发数超过配额 80%', source: '资源调度', time: '2026-08-12 07:53' },
  { level: '中', title: '脱敏规则「手机号掩码规则」V2.1 待审批', source: '脱敏服务', time: '2026-08-11 18:20' },
  { level: '低', title: '证书「票务核心库」即将到期', source: '质量认证', time: '2026-08-11 16:05' },
]

const regulations = [
  { name: '《数据安全法》', rate: 96 },
  { name: '《个人信息保护法》', rate: 92 },
  { name: '《网络安全法》', rate: 89 },
  { name: '《数据出境安全评估办法》', rate: 87 },
  { name: '《关键信息基础设施安全保护条例》', rate: 97 },
]

const levelTagType: Record<string, 'danger' | 'warning' | 'info'> = {
  高: 'danger',
  中: 'warning',
  低: 'info',
}

const coverageColors = ['#DA251D', '#2B6CB0', '#00A854', '#9B59B6']

const eventChartRef = ref<HTMLElement>()
const gaugeChartRef = ref<HTMLElement>()
let eventChart: echarts.ECharts | null = null
let gaugeChart: echarts.ECharts | null = null

const renderEvents = () => {
  if (!eventChartRef.value) return
  eventChart?.dispose()
  eventChart = echarts.init(eventChartRef.value)
  eventChart.setOption({
    tooltip: { trigger: 'item', formatter: '{b}: {c} 起 ({d}%)' },
    legend: { bottom: 0, icon: 'circle', itemWidth: 8, itemHeight: 8 },
    color: ['#E34D59', '#ED7B2F', '#2B6CB0', '#9B59B6'],
    series: [
      {
        name: '安全事件',
        type: 'pie',
        radius: ['48%', '72%'],
        center: ['50%', '44%'],
        avoidLabelOverlap: true,
        itemStyle: { borderColor: '#fff', borderWidth: 2 },
        label: { show: true, formatter: '{c}', fontWeight: 600 },
        data: events,
      },
    ],
  })
}

const renderGauge = () => {
  if (!gaugeChartRef.value) return
  gaugeChart?.dispose()
  gaugeChart = echarts.init(gaugeChartRef.value)
  gaugeChart.setOption({
    series: [
      {
        type: 'gauge',
        startAngle: 210,
        endAngle: -30,
        min: 0,
        max: 100,
        progress: { show: true, width: 16, itemStyle: { color: '#DA251D' } },
        axisLine: { lineStyle: { width: 16, color: [[1, '#F0F2F5']] } },
        pointer: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        detail: { valueAnimation: true, formatter: '{value}%', fontSize: 26, fontWeight: 700, color: '#DA251D', offsetCenter: [0, 0] },
        data: [{ value: 92.6 }],
      },
    ],
  })
}

const handleResize = () => {
  eventChart?.resize()
  gaugeChart?.resize()
}

onMounted(() => {
  renderEvents()
  renderGauge()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  eventChart?.dispose()
  gaugeChart?.dispose()
})
</script>