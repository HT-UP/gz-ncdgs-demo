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

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="520px">
      <p class="dialog-text">{{ dialogContent }}</p>
      <template #footer>
        <el-button @click="dialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'
import { Coin, DocumentChecked, Operation, RefreshRight, StarFilled } from '@element-plus/icons-vue'
import { createDashboardMock, type DashboardStat } from '@/mock/dashboard'

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
} satisfies Record<DashboardStat['key'], typeof Coin>

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
