<template>
  <div class="standard-page cockpit-page">
    <div class="cockpit-alerts">
      <div class="alert-title"><el-icon><Bell /></el-icon> 预警规则引擎</div>
      <div class="alert-list">
        <div v-for="a in alerts" :key="a.seq" class="alert-item" :style="{ borderColor: alertColor[a.level] }">
          <el-tag size="small" :type="alertTag[a.level]" effect="dark">{{ alertColorName[a.level] }}</el-tag>
          <span class="alert-text">{{ a.text }}</span>
          <span class="alert-time">{{ a.time }}</span>
        </div>
      </div>
    </div>

    <div class="cockpit-kpi">
      <div v-for="k in kpis" :key="k.label" class="kpi-card" :style="{ background: k.bg }">
        <div class="kpi-value" :style="{ color: k.color }">{{ k.value }}</div>
        <div class="kpi-label">{{ k.label }}</div>
        <div class="kpi-note">{{ k.note }}</div>
      </div>
    </div>

    <el-row :gutter="16">
      <el-col :xs="24" :lg="14">
        <el-card class="panel-card" shadow="never">
          <template #header><div class="panel-header"><span>治理指标趋势（实时）</span></div></template>
          <div ref="trendRef" class="chart-box"></div>
        </el-card>
      </el-col>
      <el-col :xs="24" :lg="10">
        <el-card class="panel-card" shadow="never">
          <template #header><div class="panel-header"><span>接入监控 · 数据源状态</span></div></template>
          <div class="ds-stats">
            <div class="ds-stat"><div class="ds-num" style="color:#00a854">14</div><div class="ds-label">正常</div></div>
            <div class="ds-stat"><div class="ds-num" style="color:#ed7b2f">2</div><div class="ds-label">延迟</div></div>
            <div class="ds-stat"><div class="ds-num" style="color:#da251d">0</div><div class="ds-label">异常</div></div>
          </div>
          <el-table :data="sources" size="small" class="mt-12">
            <el-table-column prop="name" label="数据源" min-width="120" />
            <el-table-column prop="type" label="类型" width="80" />
            <el-table-column label="最近采集" width="90">
              <template #default="{ row }"><span class="dep-text">{{ row.last }}</span></template>
            </el-table-column>
            <el-table-column label="状态" width="80">
              <template #default="{ row }">
                <el-tag size="small" :type="row.ok ? 'success' : 'warning'" effect="dark">{{ row.ok ? '正常' : '延迟' }}</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16">
      <el-col :xs="24" :lg="8">
        <el-card class="panel-card zone-card" shadow="never">
          <template #header><div class="panel-header"><span>质量看板</span></div></template>
          <div class="zone-score"><div class="zone-score-num">{{ zone.quality.score }}</div><div class="zone-score-label">综合质量评分</div></div>
          <div v-for="d in zone.quality.dims" :key="d.name" class="zone-row">
            <span class="zone-row-label">{{ d.name }}</span>
            <el-progress :percentage="d.value" :stroke-width="10" :color="d.value >= 90 ? '#00A854' : d.value >= 80 ? '#2B6CB0' : '#da251d'" class="zone-row-bar" />
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :lg="8">
        <el-card class="panel-card zone-card" shadow="never">
          <template #header><div class="panel-header"><span>标准落地</span></div></template>
          <div class="zone-score"><div class="zone-score-num" style="color:#2b6cb0">{{ zone.standard.rate }}%</div><div class="zone-score-label">标准覆盖率</div></div>
          <div v-for="s in zone.standard.items" :key="s.name" class="zone-row">
            <span class="zone-row-label">{{ s.name }}</span>
            <el-progress :percentage="s.value" :stroke-width="10" color="#2b6cb0" class="zone-row-bar" />
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :lg="8">
        <el-card class="panel-card zone-card" shadow="never">
          <template #header><div class="panel-header"><span>安全合规</span></div></template>
          <div class="zone-score"><div class="zone-score-num" style="color:#da251d">{{ zone.security.risk }}</div><div class="zone-score-label">月度风险事件</div></div>
          <div v-for="s in zone.security.items" :key="s.name" class="zone-row">
            <span class="zone-row-label">{{ s.name }}</span>
            <el-tag size="small" :type="s.badgeType" effect="dark">{{ s.value }}</el-tag>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16">
      <el-col :xs="24" :lg="12">
        <el-card class="panel-card zone-card" shadow="never">
          <template #header><div class="panel-header"><span>智能治理 · 智能体运行</span></div></template>
          <div class="agent-grid">
            <div v-for="a in zone.agents" :key="a.name" class="agent-item">
              <div class="agent-name">{{ a.name }}</div>
              <div class="agent-run dep-text">今日运行 {{ a.runs }} 次</div>
              <el-tag size="small" type="success" effect="plain">运行中</el-tag>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :lg="12">
        <el-card class="panel-card zone-card" shadow="never">
          <template #header><div class="panel-header"><span>运营指标</span></div></template>
          <div class="ops-grid">
            <div v-for="o in zone.ops" :key="o.name" class="ops-item">
              <div class="ops-num" :style="{ color: o.color }">{{ o.value }}</div>
              <div class="ops-name">{{ o.name }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { Bell } from '@element-plus/icons-vue'
import * as echarts from 'echarts'

const alertColor: Record<string, string> = { 严重: '#da251d', 警告: '#ed7b2f', 提示: '#2b6cb0' }
const alertColorName: Record<string, string> = { 严重: '严重', 警告: '警告', 提示: '提示' }
const alertTag: Record<string, 'danger' | 'warning' | 'info'> = { 严重: 'danger', 警告: 'warning', 提示: 'info' }

const alerts = [
  { seq: 1, level: '严重', text: '质量评分连续 3 日低于阈值 88，触发「质量看板」预警', time: '10:32' },
  { seq: 2, level: '警告', text: 'ODS 增量采集延迟 512ms 超过阈值 500ms', time: '10:12' },
  { seq: 3, level: '警告', text: '标准覆盖新增低于预期，实时滚动 30 日覆盖率临界 82%', time: '09:48' },
  { seq: 4, level: '提示', text: '智能分类分级待确认建议积压 15 条，请及时评审', time: '09:20' },
]

const kpis = [
  { label: '接入数据源', value: '156', note: '+12 本月', color: '#da251d', bg: 'linear-gradient(135deg,#da251d,#fff)' },
  { label: '注册数据资产', value: '1,280', note: '+86 本月', color: '#2b6cb0', bg: 'linear-gradient(135deg,#2b6cb0,#fff)' },
  { label: '数据标准', value: '234', note: '覆盖率 92%', color: '#00a854', bg: 'linear-gradient(135deg,#00a854,#fff)' },
  { label: '治理任务', value: '1,284', note: '成功率 97.5%', color: '#ed7b2f', bg: 'linear-gradient(135deg,#ed7b2f,#fff)' },
]

const sources = [
  { name: '票务运营库', type: 'MySQL', last: '10:30', ok: true },
  { name: '车票实名库', type: 'Oracle', last: '10:25', ok: true },
  { name: '客流事件流', type: 'Kafka', last: '10:31', ok: true },
  { name: '设备信号采集', type: 'MQTT', last: '10:00', ok: false },
  { name: '财务共享仓', type: 'Hive', last: '10:28', ok: true },
  { name: '运营日志仓', type: 'ClickHouse', last: '10:29', ok: false },
]

const zone = {
  quality: {
    score: 92.6,
    dims: [
      { name: '完整性', value: 96 },
      { name: '准确性', value: 94 },
      { name: '一致性', value: 91 },
      { name: '及时性', value: 89 },
    ],
  },
  standard: {
    rate: 92,
    items: [
      { name: '主数据标准', value: 95 },
      { name: '基础数据标准', value: 92 },
      { name: '指标口径标准', value: 88 },
      { name: '命名规范标准', value: 84 },
    ],
  },
  security: {
    risk: 6,
    items: [
      { name: '未处理高危风险', value: '2', badgeType: 'danger' as const },
      { name: '本月权限变更审计', value: '18', badgeType: 'info' as const },
      { name: '脱敏覆盖率', value: '96.4%', badgeType: 'success' as const },
    ],
  },
  agents: [
    { name: '元数据抽取智能体', runs: 128 },
    { name: '智能补全智能体', runs: 342 },
    { name: '智能分级分类', runs: 89 },
    { name: '知识检索问答', runs: 2156 },
    { name: '合规稽核智能体', runs: 46 },
    { name: '决策建议智能体', runs: 18 },
  ],
  ops: [
    { name: '日均任务执行', value: '486', color: '#da251d' },
    { name: '任务成功率', value: '97.5%', color: '#00a854' },
    { name: '平均同步延迟', value: '236ms', color: '#2b6cb0' },
    { name: '平均质量评分', value: '92.6', color: '#ed7b2f' },
  ],
}

const trendRef = ref<HTMLElement>()
let trendChart: echarts.ECharts | null = null

const renderTrend = () => {
  if (!trendRef.value) return
  trendChart?.dispose()
  trendChart = echarts.init(trendRef.value)
  trendChart.setOption({
    tooltip: { trigger: 'axis' },
    legend: { data: ['数据资源', '数据标准', '质量评分'], top: 0 },
    grid: { left: 48, right: 16, top: 40, bottom: 28 },
    xAxis: {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月'],
      axisLine: { lineStyle: { color: '#e4e7ed' } },
    },
    yAxis: { type: 'value', splitLine: { lineStyle: { type: 'dashed', color: '#e4e7ed' } } },
    series: [
      {
        name: '数据资源',
        type: 'line',
        smooth: true,
        data: [820, 900, 980, 1040, 1120, 1180, 1240, 1280],
        lineStyle: { color: '#2b6cb0', width: 3 },
        itemStyle: { color: '#2b6cb0' },
        areaStyle: { color: 'rgba(43,108,176,.12)' },
      },
      {
        name: '数据标准',
        type: 'line',
        smooth: true,
        data: [160, 178, 192, 205, 218, 226, 232, 234],
        lineStyle: { color: '#00a854', width: 3 },
        itemStyle: { color: '#00a854' },
      },
      {
        name: '质量评分',
        type: 'line',
        smooth: true,
        data: [85, 86, 87, 88.5, 89.5, 90.8, 91.8, 92.6],
        lineStyle: { color: '#da251d', width: 3 },
        itemStyle: { color: '#da251d' },
      },
    ],
  })
}

onMounted(renderTrend)

const handleResize = () => trendChart?.resize()
onMounted(() => window.addEventListener('resize', handleResize))
onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  trendChart?.dispose()
})
</script>

<style lang="scss" scoped>
.cockpit-page {
  display: grid;
  gap: 16px;
}

.cockpit-alerts {
  border: 1px solid #edf0f5;
  border-radius: 8px;
  background: #fff;
  padding: 12px 14px;
}

.alert-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 700;
  color: #4a4a4a;
  margin-bottom: 8px;
}

.alert-item {
  display: flex;
  align-items: center;
  gap: 10px;
  border-left: 3px solid;
  padding: 6px 10px;
  font-size: 12px;
}

.alert-text {
  flex: 1;
  color: #4a4a4a;
}

.alert-time {
  color: #8c8c8c;
}

.cockpit-kpi {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
}

.kpi-card {
  border-radius: 8px;
  border: 1px solid #edf0f5;
  padding: 14px 16px;
}

.kpi-value {
  font-size: 22px;
  font-weight: 700;
}

.kpi-label {
  margin-top: 2px;
  color: #4a4a4a;
  font-size: 13px;
  font-weight: 600;
}

.kpi-note {
  color: #8c8c8c;
  font-size: 12px;
}

.chart-box {
  height: 300px;
  width: 100%;
}

.ds-stats {
  display: flex;
  justify-content: space-around;
  text-align: center;
}

.ds-num {
  font-size: 26px;
  font-weight: 700;
}

.ds-label {
  color: #8c8c8c;
  font-size: 12px;
}

.mt-12 {
  margin-top: 12px;
}

.zone-score {
  text-align: center;
  padding: 6px 0 12px;
  border-bottom: 1px dashed #e4e7ed;
  margin-bottom: 12px;
}

.zone-score-num {
  font-size: 30px;
  font-weight: 700;
  color: #00a854;
}

.zone-score-label {
  color: #8c8c8c;
  font-size: 12px;
  margin-top: 4px;
}

.zone-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.zone-row-label {
  width: 68px;
  flex: none;
  color: #4a4a4a;
  font-size: 12px;
}

.zone-row-bar {
  flex: 1;
}

.zone-card {
  :deep(.el-card__body) {
    min-height: 240px;
  }
}

.agent-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.agent-item {
  border: 1px solid #edf0f5;
  border-radius: 8px;
  padding: 12px;
  text-align: center;
}

.agent-name {
  font-size: 13px;
  font-weight: 600;
  color: #4a4a4a;
}

.agent-run {
  margin: 6px 0 8px;
  font-size: 11px;
}

.ops-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.ops-item {
  border: 1px solid #edf0f5;
  border-radius: 8px;
  text-align: center;
  padding: 18px 8px;
}

.ops-num {
  font-size: 26px;
  font-weight: 700;
}

.ops-name {
  color: #8c8c8c;
  font-size: 12px;
  margin-top: 4px;
}
</style>