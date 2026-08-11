<template>
  <div class="standard-page">
    <el-row :gutter="16">
      <el-col :xs="24" :sm="12" :lg="6" v-for="stat in stats" :key="stat.label">
        <el-card class="metric-card dashboard-card" shadow="hover">
          <div class="metric-title">{{ stat.label }}</div>
          <div class="metric-value">{{ stat.value }}</div>
          <div class="metric-subtitle">
            <span class="trend-positive">{{ stat.note }}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16">
      <el-col :xs="24" :lg="12">
        <el-card class="panel-card dashboard-card" shadow="never">
          <template #header>
            <div class="panel-header">
              <span>今日任务执行趋势</span>
              <div class="panel-actions">
                <el-radio-group v-model="trendRange" size="small">
                  <el-radio-button label="1h">近1小时</el-radio-button>
                  <el-radio-button label="24h">近24小时</el-radio-button>
                </el-radio-group>
              </div>
            </div>
          </template>
          <div ref="trendChartRef" class="chart-box"></div>
        </el-card>
      </el-col>

      <el-col :xs="24" :lg="6">
        <el-card class="panel-card dashboard-card" shadow="never">
          <template #header>
            <div class="panel-header">
              <span>任务类型分布</span>
            </div>
          </template>
          <div ref="typePieRef" class="chart-box chart-box--compact"></div>
        </el-card>
      </el-col>

      <el-col :xs="24" :lg="6">
        <el-card class="panel-card dashboard-card" shadow="never">
          <template #header>
            <div class="panel-header">
              <span>快速入口</span>
            </div>
          </template>
          <div class="quick-entry-grid">
            <div class="quick-entry" @click="goTo('/datadev/batch')">
              <el-icon :size="20"><DocumentCopy /></el-icon>
              <span>新建批量任务</span>
            </div>
            <div class="quick-entry" @click="goTo('/datadev/realtime')">
              <el-icon :size="20"><VideoCamera /></el-icon>
              <span>新建实时任务</span>
            </div>
            <div class="quick-entry" @click="goTo('/datadev/flow')">
              <el-icon :size="20"><Share /></el-icon>
              <span>新建流程任务</span>
            </div>
            <div class="quick-entry" @click="goTo('/datadev/task')">
              <el-icon :size="20"><List /></el-icon>
              <span>任务管理</span>
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
              <span>最近执行状态</span>
              <el-link :underline="false" type="danger" @click="goTo('/datadev/monitor')">任务监控 →</el-link>
            </div>
          </template>
          <el-table :data="recentTasks" stripe>
            <el-table-column prop="name" label="任务名称" min-width="180" />
            <el-table-column prop="type" label="类型" width="80" />
            <el-table-column prop="sourceName" label="数据源" width="140" />
            <el-table-column prop="targetName" label="目标" width="110" />
            <el-table-column label="状态" width="90">
              <template #default="{ row }">
                <el-tag :type="statusTagType[row.status]" effect="dark">{{ row.status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="进度" min-width="140">
              <template #default="{ row }">
                <el-progress :percentage="row.progress" :stroke-width="10" />
              </template>
            </el-table-column>
            <el-table-column prop="lastRunTime" label="最近执行" width="150" />
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import * as echarts from 'echarts'
import { useRouter } from 'vue-router'
import { DocumentCopy, List, Share, VideoCamera } from '@element-plus/icons-vue'
import { mockDevTasks } from '@/mock/datadev'

const router = useRouter()
const trendChartRef = ref<HTMLElement>()
const typePieRef = ref<HTMLElement>()
const trendRange = ref('24h')

let trendChart: echarts.ECharts | null = null
let typePie: echarts.ECharts | null = null

const statusTagType: Record<string, 'warning' | 'success' | 'danger' | 'warning'> = {
  运行中: 'warning',
  成功: 'success',
  失败: 'danger',
  待执行: 'warning',
}

const stats = computed(() => {
  const total = mockDevTasks.length
  const running = mockDevTasks.filter((task) => task.status === '运行中').length
  const success = mockDevTasks.filter((task) => task.status === '成功').length
  const failed = mockDevTasks.filter((task) => task.status === '失败').length
  return [
    { label: '任务总数', value: total, note: '批量/实时/流式' },
    { label: '运行中', value: running, note: '实时执行' },
    { label: '今日成功', value: success, note: '成功率 91.2%' },
    { label: '今日失败', value: failed, note: '需关注' },
  ]
})

const recentTasks = computed(() => mockDevTasks.slice(0, 8))

const renderTrendChart = () => {
  if (!trendChartRef.value) return
  trendChart?.dispose()
  trendChart = echarts.init(trendChartRef.value)
  const points = trendRange.value === '1h' ? 12 : 24
  const labels = Array.from({ length: points }, (_, i) => `${String(8 + (i % 14)).padStart(2, '0')}:${String((i * 5) % 60).padStart(2, '0')}`)
  trendChart.setOption({
    tooltip: { trigger: 'axis' },
    legend: { data: ['执行次数', '成功次数', '失败次数'], top: 0, left: 0 },
    grid: { left: 44, right: 20, top: 40, bottom: 30 },
    xAxis: { type: 'category', data: labels },
    yAxis: [{ type: 'value', splitLine: { lineStyle: { type: 'dashed', color: '#E4E7ED' } } }],
    series: [
      { name: '执行次数', type: 'line', smooth: true, data: Array.from({ length: points }, () => 30 + Math.round(Math.random() * 30)), lineStyle: { color: '#DA251D', width: 3 }, itemStyle: { color: '#DA251D' }, symbolSize: 5 },
      { name: '成功次数', type: 'line', smooth: true, data: Array.from({ length: points }, () => 26 + Math.round(Math.random() * 24)), lineStyle: { color: '#00A854', width: 2 }, itemStyle: { color: '#00A854' }, symbolSize: 5 },
      { name: '失败次数', type: 'bar', data: Array.from({ length: points }, (_, i) => (i % 7 === 0 ? 2 : i % 11 === 0 ? 1 : 0)), itemStyle: { color: '#E34D59', borderRadius: [4, 4, 0, 0] } },
    ],
  })
}

const renderTypePie = () => {
  if (!typePieRef.value) return
  typePie?.dispose()
  typePie = echarts.init(typePieRef.value)
  typePie.setOption({
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    series: [
      {
        type: 'pie',
        radius: ['45%', '72%'],
        center: ['50%', '52%'],
        itemStyle: { borderRadius: 8, borderColor: '#fff', borderWidth: 2 },
        label: { formatter: '{b}\n{d}%' },
        data: [
          { value: 68, name: '批量', itemStyle: { color: '#DA251D' } },
          { value: 22, name: '实时', itemStyle: { color: '#2B6CB0' } },
          { value: 16, name: '流式', itemStyle: { color: '#00A854' } },
        ],
      },
    ],
  })
}

const goTo = (path: string) => {
  router.push(path)
}

const handleResize = () => {
  trendChart?.resize()
  typePie?.resize()
}

onMounted(() => {
  renderTrendChart()
  renderTypePie()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  trendChart?.dispose()
  typePie?.dispose()
})
</script>
