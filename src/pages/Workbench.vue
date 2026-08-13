<template>
  <div class="workbench-page">
    <div class="page-toolbar">
      <div>
        <h2 class="page-title">数据治理全局态势总览驾驶舱</h2>
      </div>
      <div class="page-meta">
        <el-tag effect="dark" type="danger">最后更新：{{ dashboard.updateTime }}</el-tag>
        <el-button :icon="RefreshRight" plain @click="refreshDashboard">刷新数据</el-button>
      </div>
    </div>

    <el-row :gutter="16">
      <el-col :xs="24" :sm="12" :lg="6" v-for="item in dashboard.stats" :key="item.key">
        <el-card class="metric-card dashboard-card" shadow="hover" @click="handleStatClick(item)">
          <div class="stat-topline">
            <div class="stat-badge">
              <el-icon :size="22">
                <component :is="statIconMap[item.key]" />
              </el-icon>
            </div>
            <el-link :underline="false" type="danger">更多 →</el-link>
          </div>
          <div class="metric-title">{{ item.label }}</div>
          <div class="metric-value">{{ item.value }}</div>
          <div class="metric-subtitle">
            <span class="trend-positive">{{ item.trend }}</span>
            <span class="trend-hint">{{ item.routeHint }}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16">
      <el-col :xs="24" :lg="16">
        <el-card class="panel-card dashboard-card" shadow="never">
          <template #header>
            <div class="panel-header">
              <span>智能体运行监控</span>
              <div class="panel-actions">
                <el-tag type="success" effect="dark">{{ dashboard.agents.filter((a) => a.online).length }}/{{ dashboard.agents.length }} 在线 · 8 项能力指标</el-tag>
              </div>
            </div>
          </template>
          <div class="agent-grid">
            <div v-for="ag in dashboard.agents" :key="ag.name" class="agent-cell">
              <div class="agent-cell-head">
                <div class="agent-badge">
                  <el-icon :size="18"><component :is="agentIconMap[ag.icon]" /></el-icon>
                </div>
                <div class="agent-cell-main">
                  <div class="agent-cell-name">{{ ag.name }}</div>
                  <div class="agent-cell-stat">今日运行 {{ ag.runs }} 次</div>
                </div>
                <el-tag size="small" :type="ag.online ? 'success' : 'info'" effect="dark">{{ ag.online ? '在线' : '离线' }}</el-tag>
              </div>
              <div class="agent-cell-metrics">
                <div v-for="m in ag.metrics" :key="m.name" class="agent-cell-metric">
                  <span class="agent-metric-name">{{ m.name }}</span>
                  <span class="agent-metric-value">{{ m.value }}<i class="agent-metric-unit">{{ m.unit }}</i></span>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :lg="8">
        <el-card class="panel-card dashboard-card" shadow="never">
          <template #header>
            <div class="panel-header">
              <span>治理指标看板（35 项）</span>
              <div class="panel-actions">
                <el-tag type="info" effect="plain">达标 {{ govPassed }} 项</el-tag>
              </div>
            </div>
          </template>
          <div class="gov-grid">
            <div v-for="d in dashboard.govDomains" :key="d.name" class="gov-cell" @click="openDomain(d)">
              <div class="gov-head">
                <span class="gov-name">{{ d.name }}</span>
                <span class="gov-rate" :style="{ color: d.rate >= 90 ? '#00A854' : d.rate >= 80 ? '#ED7B2F' : '#DA251D' }">{{ d.rate }}</span>
              </div>
              <el-progress :percentage="d.rate" :stroke-width="7" :show-text="false" :color="d.rate >= 90 ? '#00A854' : d.rate >= 80 ? '#ED7B2F' : '#DA251D'" />
              <div class="gov-sub">达标 {{ d.passed }}/{{ d.items.length }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16">
      <el-col :xs="24" :lg="16">
        <el-card class="panel-card dashboard-card" shadow="never">
          <template #header>
            <div class="panel-header">
              <span>数据质量趋势</span>
              <div class="panel-actions">
                <el-radio-group v-model="trendRange" size="small" @change="renderQualityChart">
                  <el-radio-button label="7d">近7日</el-radio-button>
                  <el-radio-button label="30d">近30日</el-radio-button>
                </el-radio-group>
              </div>
            </div>
          </template>
          <div ref="qualityChartRef" class="chart-box"></div>
        </el-card>
      </el-col>

      <el-col :xs="24" :lg="8">
        <el-card class="panel-card dashboard-card" shadow="never">
          <template #header>
            <div class="panel-header">
              <span>治理任务状态</span>
              <el-link :underline="false" type="danger">查看全部</el-link>
            </div>
          </template>
          <div ref="taskChartRef" class="chart-box chart-box--compact"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16">
      <el-col :xs="24" :lg="12">
        <el-card class="panel-card dashboard-card" shadow="never">
          <template #header>
            <div class="panel-header">
              <span>最新告警</span>
              <el-link :underline="false" type="danger">查看全部</el-link>
            </div>
          </template>
          <el-timeline>
            <el-timeline-item
              v-for="alert in dashboard.alerts"
              :key="`${alert.time}-${alert.content}`"
              :timestamp="alert.time"
              placement="top"
              :color="alert.levelColor"
            >
              <div class="list-item" @click="openDialog('告警详情', alert.content)">
                <div class="list-item-main">
                  <el-tag effect="dark" :style="{ backgroundColor: alert.levelColor, borderColor: alert.levelColor }">
                    {{ alert.level }}
                  </el-tag>
                  <span class="list-item-text">{{ alert.content }}</span>
                </div>
                <span class="list-item-meta">{{ alert.status }}</span>
              </div>
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>

      <el-col :xs="24" :lg="12">
        <el-card class="panel-card dashboard-card" shadow="never">
          <template #header>
            <div class="panel-header">
              <span>待办事项</span>
              <el-link :underline="false" type="danger">查看全部</el-link>
            </div>
          </template>
          <div class="stack-list">
            <div
              v-for="todo in dashboard.todos"
              :key="`${todo.deadline}-${todo.content}`"
              class="stack-item"
              @click="openDialog('待办详情', todo.content)"
            >
              <div class="stack-item-main">
                <el-tag effect="dark" :style="{ backgroundColor: todo.typeColor, borderColor: todo.typeColor }">
                  {{ todo.type }}
                </el-tag>
                <span class="stack-item-text">{{ todo.content }}</span>
              </div>
              <div class="stack-item-meta">
                <span>截止：{{ todo.deadline }}</span>
                <el-tag effect="plain" type="info">优先级 {{ todo.priority }}</el-tag>
              </div>
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
              <span>系统公告</span>
              <el-link :underline="false" type="danger">查看更多</el-link>
            </div>
          </template>
          <div class="notice-list">
            <div
              v-for="notice in dashboard.notices"
              :key="`${notice.time}-${notice.content}`"
              class="notice-item"
              @click="openDialog('公告详情', notice.content)"
            >
              <el-tag effect="dark" :style="{ backgroundColor: notice.typeColor, borderColor: notice.typeColor }">
                {{ notice.type }}
              </el-tag>
              <span class="notice-text">{{ notice.content }}</span>
              <span class="notice-time">{{ notice.time }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog v-model="domainVisible" :title="`治理指标明细 — ${domainTarget?.name ?? ''}`" width="520px">
      <div v-if="domainTarget">
        <div v-for="(it, i) in domainTarget.items" :key="it.name" class="gov-item-row">
          <span class="gov-item-name">{{ i + 1 }}. {{ it.name }}</span>
          <div class="gov-item-bar">
            <div class="gov-item-fill" :style="{ width: it.value + '%', background: it.value >= 90 ? '#00A854' : it.value >= 80 ? '#ED7B2F' : '#DA251D' }"></div>
          </div>
          <span class="gov-item-value">{{ it.value }}</span>
        </div>
        <p class="dialog-text gov-tip">
          达标线 ≥ 90；「{{ domainTarget.name }}」域共 {{ domainTarget.items.length }} 项指标，达标 {{ domainTarget.passed }} 项，未达标项需在对应模块制定整改计划。
        </p>
      </div>
      <template #footer>
        <el-button @click="domainVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="520px">
      <p class="dialog-text">{{ dialogContent }}</p>
      <template #footer>
        <el-button @click="dialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'
import { CircleCheck, Coin, Collection, DataAnalysis, DocumentChecked, Download, MagicStick, Notebook, Odometer, Operation, RefreshRight, StarFilled, Warning } from '@element-plus/icons-vue'
import { createDashboardMock, type DashboardStat, type GovDomain } from '@/mock/dashboard'

const dashboard = ref(createDashboardMock())
const trendRange = ref<'7d' | '30d'>('7d')
const qualityChartRef = ref<HTMLElement>()
const taskChartRef = ref<HTMLElement>()
const dialogVisible = ref(false)
const dialogTitle = ref('')
const dialogContent = ref('')

const statIconMap = {
  dataSourceTotal: Coin,
  standardTotal: DocumentChecked,
  qualityScore: StarFilled,
  taskTotal: Operation,
  auditVol: DataAnalysis,
  auditIssue: Warning,
  auditFixed: CircleCheck,
  auditRate: Odometer,
} satisfies Record<DashboardStat['key'], typeof Coin>

const agentIconMap: Record<string, typeof Coin> = {
  Download,
  MagicStick,
  Collection,
  Notebook,
}

const govPassed = computed(() => dashboard.value.govDomains.reduce((sum, d) => sum + d.passed, 0))

const domainVisible = ref(false)
const domainTarget = ref<GovDomain | null>(null)

const openDomain = (domain: GovDomain) => {
  domainTarget.value = domain
  domainVisible.value = true
}

let qualityChart: echarts.ECharts | null = null
let taskChart: echarts.ECharts | null = null
let refreshTimer: number | undefined

const buildTrendHistory = (days: number) => {
  const end = new Date('2026-08-11T14:32:08')
  const dates = Array.from({ length: days }, (_, index) => {
    const date = new Date(end)
    date.setDate(end.getDate() - (days - 1 - index))
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  })

  const buildSeries = (base: number[]) =>
    Array.from({ length: days }, (_, index) => {
      const seed = base[index % base.length]
      const drift = Math.sin(index / 3) * 1.2 + Math.cos(index / 5) * 0.6
      return Math.max(0, Math.min(100, Math.round((seed + drift) * 10) / 10))
    })

  return {
    dates,
    comprehensive: buildSeries([88, 89, 90, 91, 92, 92, 93]),
    integrity: buildSeries([85, 86, 87, 88, 89, 90, 91]),
    accuracy: buildSeries([90, 91, 92, 92, 93, 93, 94]),
    consistency: buildSeries([87, 88, 88, 89, 90, 91, 91]),
    timeliness: buildSeries([92, 92, 93, 94, 94, 95, 95]),
  }
}

const renderQualityChart = () => {
  if (!qualityChartRef.value) return

  const data = buildTrendHistory(trendRange.value === '30d' ? 30 : 7)
  qualityChart?.dispose()
  qualityChart = echarts.init(qualityChartRef.value)
  qualityChart.setOption({
    tooltip: { trigger: 'axis', axisPointer: { type: 'cross' } },
    legend: {
      data: ['综合评分', '完整性', '准确性', '一致性', '及时性'],
      top: 0,
      left: 0,
    },
    grid: { left: 40, right: 20, top: 44, bottom: 32 },
    color: ['#DA251D', '#2B6CB0', '#00A854', '#ED7B2F', '#9B59B6'],
    xAxis: {
      type: 'category',
      data: data.dates,
      axisLine: { lineStyle: { color: '#E4E7ED' } },
    },
    yAxis: {
      type: 'value',
      min: 80,
      max: 100,
      splitLine: { lineStyle: { type: 'dashed', color: '#E4E7ED' } },
    },
    series: [
      {
        name: '综合评分',
        type: 'line',
        data: data.comprehensive,
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: { color: '#DA251D', width: 3 },
      },
      { name: '完整性', type: 'bar', data: data.integrity, itemStyle: { color: '#2B6CB0', borderRadius: [4, 4, 0, 0] } },
      { name: '准确性', type: 'bar', data: data.accuracy, itemStyle: { color: '#00A854', borderRadius: [4, 4, 0, 0] } },
      { name: '一致性', type: 'bar', data: data.consistency, itemStyle: { color: '#ED7B2F', borderRadius: [4, 4, 0, 0] } },
      { name: '及时性', type: 'bar', data: data.timeliness, itemStyle: { color: '#9B59B6', borderRadius: [4, 4, 0, 0] } },
    ],
  })
}

const renderTaskChart = () => {
  if (!taskChartRef.value) return

  const total = Object.values(dashboard.value.taskStatus).reduce((sum, value) => sum + value, 0)
  taskChart?.dispose()
  taskChart = echarts.init(taskChartRef.value)
  taskChart.setOption({
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      top: 'middle',
    },
    series: [
      {
        name: '治理任务状态',
        type: 'pie',
        radius: ['55%', '78%'],
        center: ['62%', '52%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 8,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: true,
          formatter: '{b}\n{d}%',
        },
        data: [
          { value: dashboard.value.taskStatus.running, name: '运行中', itemStyle: { color: '#2B6CB0' } },
          { value: dashboard.value.taskStatus.success, name: '成功', itemStyle: { color: '#00A854' } },
          { value: dashboard.value.taskStatus.failed, name: '失败', itemStyle: { color: '#E34D59' } },
          { value: dashboard.value.taskStatus.pending, name: '待执行', itemStyle: { color: '#ED7B2F' } },
        ],
      },
    ],
    graphic: [
      {
        type: 'text',
        left: '62%',
        top: '48%',
        style: {
          text: String(total),
          fill: '#DA251D',
          fontSize: 28,
          fontWeight: 700,
          textAlign: 'center',
        },
      },
      {
        type: 'text',
        left: '62%',
        top: '58%',
        style: {
          text: '任务总量',
          fill: '#8C8C8C',
          fontSize: 12,
          textAlign: 'center',
        },
      },
    ],
  })
}

const refreshDashboard = () => {
  dashboard.value = createDashboardMock()
  renderQualityChart()
  renderTaskChart()
  ElMessage.success('Mock 数据已刷新')
}

const handleStatClick = (item: DashboardStat) => {
  ElMessage.info(`即将跳转至${item.routeHint}（当前仅保留工作台页面）`)
}

const openDialog = (title: string, content: string) => {
  dialogTitle.value = title
  dialogContent.value = content
  dialogVisible.value = true
}

const handleResize = () => {
  qualityChart?.resize()
  taskChart?.resize()
}

onMounted(() => {
  renderQualityChart()
  renderTaskChart()
  refreshTimer = window.setInterval(refreshDashboard, 60000)
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  if (refreshTimer) window.clearInterval(refreshTimer)
  window.removeEventListener('resize', handleResize)
  qualityChart?.dispose()
  taskChart?.dispose()
})
</script>

<style lang="scss" scoped>
.agent-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.agent-cell {
  padding: 12px 14px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  background: #fafbfd;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    border-color: #da251d;
    box-shadow: 0 4px 14px rgba(218, 37, 29, 0.1);
  }
}

.agent-cell-head {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.agent-badge {
  width: 36px;
  height: 36px;
  flex: none;
  border-radius: 8px;
  display: grid;
  place-items: center;
  background: rgba(218, 37, 29, 0.08);
  color: #da251d;
}

.agent-cell-main {
  flex: 1;
  min-width: 0;
}

.agent-cell-name {
  font-size: 13px;
  font-weight: 700;
  color: #4a4a4a;
}

.agent-cell-stat {
  margin-top: 2px;
  color: #8c8c8c;
  font-size: 11px;
}

.agent-cell-metrics {
  display: flex;
  gap: 8px;
}

.agent-cell-metric {
  flex: 1;
  padding: 6px 8px;
  border-radius: 6px;
  background: #fff;
  border: 1px solid #edf0f5;
  text-align: center;
}

.agent-metric-name {
  display: block;
  color: #8c8c8c;
  font-size: 11px;
  margin-bottom: 2px;
}

.agent-metric-value {
  font-size: 18px;
  font-weight: 700;
  color: #da251d;
}

.agent-metric-unit {
  font-style: normal;
  font-size: 11px;
  margin-left: 2px;
  color: #da251d;
}

.gov-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.gov-cell {
  padding: 10px 12px;
  border: 1px solid #edf0f5;
  border-radius: 8px;
  cursor: pointer;
  background: #fff;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    border-color: #da251d;
    box-shadow: 0 4px 12px rgba(218, 37, 29, 0.1);
  }
}

.gov-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

.gov-name {
  font-size: 12px;
  font-weight: 600;
  color: #4a4a4a;
}

.gov-rate {
  font-size: 15px;
  font-weight: 700;
}

.gov-sub {
  margin-top: 4px;
  color: #8c8c8c;
  font-size: 11px;
}

.gov-item-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
}

.gov-item-name {
  width: 130px;
  flex: none;
  color: #4a4a4a;
  font-size: 12px;
}

.gov-item-bar {
  flex: 1;
  height: 10px;
  border-radius: 5px;
  background: #f0f2f5;
  overflow: hidden;
}

.gov-item-fill {
  height: 100%;
  border-radius: 5px;
}

.gov-item-value {
  width: 32px;
  flex: none;
  text-align: right;
  font-weight: 700;
  color: #4a4a4a;
  font-size: 12px;
}

.gov-tip {
  margin-top: 14px;
  padding: 10px 12px;
  border-radius: 8px;
  background: rgba(218, 37, 29, 0.06);
  color: #8c8c8c;
}
</style>
