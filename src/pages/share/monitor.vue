<template>
  <div class="standard-page share-monitor-page">
    <div class="mon-stats">
      <div v-for="s in stats" :key="s.label" class="mon-stat">
        <div class="mon-stat-value" :style="{ color: s.color }">{{ s.value }}</div>
        <div class="mon-stat-label">{{ s.label }}</div>
        <div class="mon-stat-trend" :style="{ color: s.trend > 0 ? '#DA251D' : '#00A854' }">
          {{ s.trend > 0 ? '▲' : '▼' }} {{ Math.abs(s.trend) }}% 较昨日
        </div>
      </div>
    </div>

    <el-row :gutter="16">
      <el-col :span="12">
        <el-card class="panel-card" shadow="never">
          <template #header>
            <div class="panel-header">
              <span>今日调用量趋势（按小时）</span>
              <div class="panel-actions">
                <el-radio-group v-model="callRange" size="small">
                  <el-radio-button value="24h">近24小时</el-radio-button>
                  <el-radio-button value="7d">近7天</el-radio-button>
                </el-radio-group>
              </div>
            </div>
          </template>
          <div ref="callChartEl" class="chart-box-sm"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="panel-card" shadow="never">
          <template #header>
            <div class="panel-header"><span>调用成功率趋势</span></div>
          </template>
          <div ref="rateChartEl" class="chart-box-sm"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16">
      <el-col :span="8">
        <el-card class="panel-card" shadow="never">
          <template #header>
            <div class="panel-header"><span>Top 服务调用排行</span></div>
          </template>
          <div v-for="(r, i) in topServices" :key="r.name" class="rank-row">
            <span class="rank-no" :class="{ 'rank-top': i < 3 }">{{ i + 1 }}</span>
            <span class="rank-name">{{ r.name }}</span>
            <div class="rank-progress"><el-progress :percentage="r.pct" :stroke-width="8" :color="r.pct > 60 ? '#DA251D' : '#ED7B2F'" /></div>
            <span class="rank-num">{{ r.calls }}</span>
          </div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card class="panel-card" shadow="never">
          <template #header>
            <div class="panel-header"><span>错误码分布</span></div>
          </template>
          <div v-for="e in errCodes" :key="e.code" class="err-row">
            <code class="err-code">{{ e.code }}</code>
            <span class="err-desc">{{ e.desc }}</span>
            <div class="err-bar"><div class="err-bar-fill" :style="{ width: e.pct + '%', background: e.color }"></div></div>
            <span class="err-num">{{ e.pct }}%</span>
          </div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card class="panel-card" shadow="never">
          <template #header>
            <div class="panel-header">
              <span>实时异常告警</span>
              <el-tag size="small" type="danger" effect="dark">{{ alerts.length }} 条</el-tag>
            </div>
          </template>
          <div class="alert-list">
            <div v-for="a in alerts" :key="a.id" class="alert-item">
              <div class="alert-item-head">
                <span class="alert-level" :style="{ background: levelBg[a.level], color: '#fff' }">{{ a.level }}</span>
                <span class="dep-text">{{ a.time }}</span>
              </div>
              <div class="alert-item-text">{{ a.text }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import * as echarts from 'echarts'

const stats = [
  { label: '今日调用量', value: '86,472', color: '#DA251D', trend: 12.4 },
  { label: '调用成功率', value: '99.32%', color: '#00A854', trend: 0.21 },
  { label: '平均响应时长', value: '236ms', color: '#2B6CB0', trend: -3.8 },
  { label: '异常告警数', value: '6', color: '#ED7B2F', trend: -2 },
]

const callChartEl = ref<HTMLElement>()
const rateChartEl = ref<HTMLElement>()
const callRange = ref('24h')

let callChart: echarts.ECharts | null = null
let rateChart: echarts.ECharts | null = null

const hourLabels = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`)
const hourCalls = [380, 220, 160, 120, 140, 260, 980, 4200, 6800, 5400, 4600, 3800, 3400, 3600, 3900, 4200, 4700, 5400, 6100, 7800, 9200, 7600, 4800, 2400]
const rateSeries = [100, 99.6, 99.2, 99.5, 99.8, 100, 100, 99.9, 99.4, 99.7, 99.8, 100, 99.6, 99.9, 100, 99.8, 99.5, 99.7, 99.9, 99.9, 99.2, 99.6, 99.8, 100]

const topServices = [
  { name: '车站信息同步服务', calls: '3.2k', pct: 92 },
  { name: '客流统计查询服务', calls: '2.4k', pct: 70 },
  { name: '线路基础信息服务', calls: '1.7k', pct: 52 },
  { name: '订单汇总指标服务', calls: '0.9k', pct: 26 },
  { name: '站点设施知识问答', calls: '0.4k', pct: 14 },
]

const errCodes = [
  { code: '40403', desc: '路径不存在', pct: 38, color: '#DA251D' },
  { code: '40101', desc: '签名校验失败', pct: 24, color: '#ED7B2F' },
  { code: '42900', desc: '触发限流', pct: 18, color: '#2B6CB0' },
  { code: '50001', desc: '服务内部异常', pct: 12, color: '#8c8c8c' },
  { code: '40010', desc: '参数校验失败', pct: 8, color: '#b0b7c3' },
]

const levelBg: Record<string, string> = { 严重: '#DA251D', 警告: '#ED7B2F', 提示: '#2B6CB0' }

const alerts = ref([
  { id: 1, level: '严重', time: '10:31', text: '售票明细查询服务响应超时 > 2s，连续 5 次' },
  { id: 2, level: '警告', time: '10:12', text: '乘客信息批量导出服务触发限流，请检查调用方' },
  { id: 3, level: '警告', time: '09:48', text: '外部科研合作方 AppKey 签名频繁校验失败' },
  { id: 4, level: '提示', time: '09:20', text: '站点设施知识问答服务并发接近阈值 80%' },
])

const renderCharts = () => {
  if (callChartEl.value) {
    callChart = echarts.init(callChartEl.value)
    callChart.setOption({
      tooltip: { trigger: 'axis' },
      grid: { left: 48, right: 16, top: 24, bottom: 28 },
      xAxis: { type: 'category', data: hourLabels, axisLine: { lineStyle: { color: '#e4e7ed' } }, axisLabel: { color: '#8c8c8c', interval: 3 } },
      yAxis: { type: 'value', splitLine: { lineStyle: { color: '#f0f2f5' } }, axisLabel: { color: '#8c8c8c' } },
      series: [
        {
          name: '调用量',
          type: 'line',
          smooth: true,
          data: hourCalls,
          symbol: 'none',
          lineStyle: { width: 2, color: '#DA251D' },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(218,37,29,.22)' },
              { offset: 1, color: 'rgba(218,37,29,.02)' },
            ]),
          },
        },
      ],
    })
  }
  if (rateChartEl.value) {
    rateChart = echarts.init(rateChartEl.value)
    rateChart.setOption({
      tooltip: { trigger: 'axis', valueFormatter: (v: unknown) => `${v}%` },
      grid: { left: 48, right: 16, top: 24, bottom: 28 },
      xAxis: { type: 'category', data: hourLabels, axisLine: { lineStyle: { color: '#e4e7ed' } }, axisLabel: { color: '#8c8c8c', interval: 3 } },
      yAxis: { type: 'value', min: 98, max: 100, splitLine: { lineStyle: { color: '#f0f2f5' } }, axisLabel: { color: '#8c8c8c' } },
      series: [
        {
          name: '成功率',
          type: 'line',
          smooth: true,
          data: rateSeries,
          symbol: 'none',
          lineStyle: { width: 2, color: '#00A854' },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(0,168,84,.2)' },
              { offset: 1, color: 'rgba(0,168,84,.02)' },
            ]),
          },
        },
      ],
    })
  }
}

watch(callRange, () => {
  const labels = callRange.value === '24h' ? hourLabels : Array.from({ length: 7 }, (_, i) => `${8 - i}日`)
  callChart?.setOption({
    xAxis: { data: labels },
    series: [{ data: callRange.value === '24h' ? hourCalls : hourCalls.slice(-7).map((v) => v * 8) }],
  })
})

const handleResize = () => {
  callChart?.resize()
  rateChart?.resize()
}

onMounted(() => {
  renderCharts()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  callChart?.dispose()
  rateChart?.dispose()
})
</script>

<style lang="scss" scoped>
.share-monitor-page {
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
}

.mon-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
}

.mon-stat {
  border: 1px solid #edf0f5;
  border-radius: 8px;
  padding: 14px 16px;
  background: #fff;
}

.mon-stat-value {
  font-size: 24px;
  font-weight: 700;
}

.mon-stat-label {
  margin-top: 2px;
  color: #8c8c8c;
  font-size: 12px;
}

.mon-stat-trend {
  margin-top: 6px;
  font-size: 12px;
}

.chart-box-sm {
  height: 260px;
  width: 100%;
}

.rank-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
}

.rank-no {
  width: 22px;
  height: 22px;
  flex: none;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: #f0f2f5;
  color: #8c8c8c;
  font-size: 12px;
  font-weight: 700;
}

.rank-no.rank-top {
  background: rgba(218, 37, 29, 0.1);
  color: #da251d;
}

.rank-name {
  width: 110px;
  flex: none;
  color: #4a4a4a;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.rank-progress {
  flex: 1;
}

.rank-num {
  width: 44px;
  flex: none;
  text-align: right;
  color: #4a4a4a;
  font-size: 12px;
  font-weight: 600;
}

.err-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
}

.err-code {
  width: 52px;
  flex: none;
  color: #da251d;
  font-size: 12px;
}

.err-desc {
  width: 88px;
  flex: none;
  color: #4a4a4a;
  font-size: 12px;
}

.err-bar {
  flex: 1;
  height: 8px;
  border-radius: 4px;
  background: #f0f2f5;
  overflow: hidden;
}

.err-bar-fill {
  height: 100%;
  border-radius: 4px;
}

.err-num {
  width: 38px;
  flex: none;
  text-align: right;
  font-size: 12px;
  font-weight: 600;
  color: #4a4a4a;
}

.alert-list {
  display: grid;
  gap: 10px;
}

.alert-item {
  padding-bottom: 10px;
  border-bottom: 1px solid #edf0f5;

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
}

.alert-item-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}

.alert-level {
  padding: 1px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
}

.alert-item-text {
  color: #4a4a4a;
  font-size: 12px;
  line-height: 1.6;
}
</style>