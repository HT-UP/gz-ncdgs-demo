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

    <el-row :gutter="16" class="mb-16">
      <el-col :xs="24" :lg="7">
        <el-card class="panel-card dashboard-card" shadow="never">
          <template #header>
            <div class="panel-header">
              <span>元数据目录</span>
            </div>
          </template>
          <div class="catalog-tree">
            <div v-for="domain in catalog" :key="domain.name" class="catalog-domain">
              <div class="catalog-domain-title">
                <el-icon :size="15"><Folder /></el-icon>
                <span>{{ domain.name }}</span>
              </div>
              <div v-for="source in domain.children" :key="source" class="catalog-source">
                <el-icon :size="13"><Coin /></el-icon>
                <span>{{ source }}</span>
                <el-tag size="small" effect="plain">{{ tableCountOf(source) }}</el-tag>
              </div>
            </div>
          </div>
        </el-card>

        <el-card class="panel-card dashboard-card mt-16" shadow="never">
          <template #header>
            <div class="panel-header">
              <span>快速入口</span>
            </div>
          </template>
          <div class="quick-entry-grid">
            <div class="quick-entry" @click="goTo('/metadata/collection')">
              <el-icon :size="20"><Download /></el-icon>
              <span>创建采集任务</span>
            </div>
            <div class="quick-entry" @click="goTo('/metadata/data-element')">
              <el-icon :size="20"><Document /></el-icon>
              <span>新建数据元</span>
            </div>
            <div class="quick-entry" @click="goTo('/metadata/tag')">
              <el-icon :size="20"><PriceTag /></el-icon>
              <span>配置标签</span>
            </div>
            <div class="quick-entry" @click="goTo('/metadata/lineage')">
              <el-icon :size="20"><Share /></el-icon>
              <span>血缘解析</span>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :lg="17">
        <el-card class="panel-card dashboard-card" shadow="never">
          <template #header>
            <div class="panel-header">
              <span>元数据变更趋势</span>
              <div class="panel-actions">
                <el-radio-group v-model="trendRange" size="small">
                  <el-radio-button label="7d">近7日</el-radio-button>
                  <el-radio-button label="30d">近30日</el-radio-button>
                </el-radio-group>
              </div>
            </div>
          </template>
          <div ref="trendChartRef" class="chart-box"></div>
        </el-card>

        <el-card class="panel-card dashboard-card mt-16" shadow="never">
          <template #header>
            <div class="panel-header">
              <span>采集任务执行概览</span>
              <el-link :underline="false" type="danger" @click="goTo('/metadata/collection')">查看全部</el-link>
            </div>
          </template>
          <div class="overview-task-row">
            <div class="overview-task-item">
              <div class="overview-task-num">42</div>
              <div class="overview-task-label">今日运行</div>
            </div>
            <el-divider direction="vertical" />
            <div class="overview-task-item">
              <div class="overview-task-num overview-task-num--success">38</div>
              <div class="overview-task-label">成功</div>
            </div>
            <el-divider direction="vertical" />
            <div class="overview-task-item">
              <div class="overview-task-num overview-task-num--danger">4</div>
              <div class="overview-task-label">失败</div>
            </div>
            <el-divider direction="vertical" />
            <div class="overview-task-item overview-task-rate">
              <div class="overview-task-num">90.5%</div>
              <div class="overview-task-label">成功率</div>
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
import { useRouter } from 'vue-router'
import { Coin, Document, Download, Folder, PriceTag, Share } from '@element-plus/icons-vue'
import { metadataCatalog } from '@/mock/metadata'

const router = useRouter()

const trendChartRef = ref<HTMLElement>()
const trendRange = ref('7d')
let trendChart: echarts.ECharts | null = null

const stats = [
  { label: '总表数', value: '1,284', note: '覆盖 12 个系统' },
  { label: '总字段数', value: '23,562', note: '较昨日 +126' },
  { label: '采集任务数', value: '52', note: '今日运行 42 个' },
  { label: '标签总数', value: '68', note: '关联元数据 1,000+' },
]

const catalog = metadataCatalog

const tableCountOf = (source: string) => {
  const hash = source.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0)
  return 60 + (hash % 140)
}

const renderTrendChart = () => {
  if (!trendChartRef.value) return
  trendChart?.dispose()
  trendChart = echarts.init(trendChartRef.value)
  const days = trendRange.value === '30d' ? 30 : 7
  const now = new Date('2026-08-11')
  const dates = Array.from({ length: days }, (_, i) => {
    const date = new Date(now)
    date.setDate(now.getDate() - (days - 1 - i))
    return `${date.getMonth() + 1}/${date.getDate()}`
  })
  const buildSeries = (base: number) =>
    Array.from({ length: days }, (_, i) => Math.max(0, base + Math.round(Math.sin(i / 2.5) * 30 + Math.random() * 20)))
  trendChart.setOption({
    tooltip: { trigger: 'axis' },
    legend: { data: ['新增表', '变更字段', '采集失败'], top: 0, left: 0 },
    grid: { left: 40, right: 20, top: 40, bottom: 30 },
    xAxis: { type: 'category', data: dates },
    yAxis: [{ type: 'value', splitLine: { lineStyle: { type: 'dashed', color: '#E4E7ED' } } }],
    series: [
      { name: '新增表', type: 'line', smooth: true, data: buildSeries(20), lineStyle: { color: '#DA251D', width: 3 }, itemStyle: { color: '#DA251D' }, symbolSize: 5 },
      { name: '变更字段', type: 'line', smooth: true, data: buildSeries(45), lineStyle: { color: '#2B6CB0', width: 2 }, itemStyle: { color: '#2B6CB0' }, symbolSize: 5 },
      { name: '采集失败', type: 'bar', data: Array.from({ length: days }, (_, i) => (i % 6 === 0 ? 3 : i % 9 === 0 ? 2 : 0)), itemStyle: { color: '#E34D59', borderRadius: [4, 4, 0, 0] } },
    ],
  })
}

const goTo = (path: string) => {
  router.push(path)
}

const handleResize = () => {
  trendChart?.resize()
}

onMounted(() => {
  renderTrendChart()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  trendChart?.dispose()
})
</script>
