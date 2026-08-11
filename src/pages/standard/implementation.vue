<template>
  <div class="standard-page">
    <el-row :gutter="16">
      <el-col :xs="24" :sm="12" :lg="6" v-for="metric in metrics" :key="metric.label">
        <el-card class="metric-card dashboard-card" shadow="hover">
          <div class="metric-title">{{ metric.label }}</div>
          <div class="metric-value">{{ metric.value }}</div>
          <div class="metric-subtitle">
            <span :class="metric.trend.startsWith('-') ? 'trend-negative' : 'trend-positive'">{{ metric.trend }}</span>
            <span class="trend-hint">{{ metric.hint }}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16">
      <el-col :xs="24" :lg="12">
        <el-card class="panel-card dashboard-card" shadow="never">
          <template #header>
            <div class="panel-header">
              <span>落标率统计（按系统）</span>
            </div>
          </template>
          <div ref="systemChartRef" class="chart-box chart-box--compact"></div>
        </el-card>
      </el-col>
      <el-col :xs="24" :lg="12">
        <el-card class="panel-card dashboard-card" shadow="never">
          <template #header>
            <div class="panel-header">
              <span>落标率统计（按业务域）</span>
            </div>
          </template>
          <div ref="domainChartRef" class="chart-box chart-box--compact"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16">
      <el-col :span="24">
        <el-card class="panel-card dashboard-card" shadow="never">
          <template #header>
            <div class="panel-header">
              <span>未落标项清单</span>
              <el-button type="danger" size="small" @click="generateReport">生成评估报告</el-button>
            </div>
          </template>

          <div class="toolbar-row">
            <el-input
              v-model="keyword"
              placeholder="按名称 / 编码 / 责任人搜索"
              clearable
              class="search-input"
              :prefix-icon="Search"
            />
            <el-select v-model="filterLevel" placeholder="未落标程度" clearable class="filter-select">
              <el-option label="完全未落标" value="完全未落标" />
              <el-option label="部分落标" value="部分落标" />
            </el-select>
            <el-button :icon="MagicStick" type="danger" plain @click="generateSuggestions">生成落标建议</el-button>
          </div>

          <el-table :data="pagedItems" stripe class="mt-12">
            <el-table-column prop="code" label="标准编码" width="110" />
            <el-table-column prop="name" label="标准名称" min-width="180" />
            <el-table-column prop="system" label="目标系统" width="140" />
            <el-table-column prop="domain" label="业务域" width="110" />
            <el-table-column prop="owner" label="责任人" width="90" />
            <el-table-column label="落标情况" width="110">
              <template #default="{ row }">
                <el-progress
                  :percentage="row.rate"
                  :color="row.rate < 50 ? '#E34D59' : '#ED7B2F'"
                  :stroke-width="10"
                />
              </template>
            </el-table-column>
            <el-table-column label="未落标程度" width="110">
              <template #default="{ row }">
                <el-tag :type="row.level === '完全未落标' ? 'danger' : 'warning'" effect="dark">
                  {{ row.level }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="reason" label="原因分析" min-width="200" show-overflow-tooltip />
          </el-table>

          <el-pagination
            class="pager"
            layout="total, prev, pager, next"
            :total="filteredItems.length"
            :page-size="pageSize"
            :current-page="currentPage"
            background
            @current-change="currentPage = $event"
          />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'
import { MagicStick, Search } from '@element-plus/icons-vue'

const keyword = ref('')
const filterLevel = ref('')
const currentPage = ref(1)
const pageSize = ref(20)
const systemChartRef = ref<HTMLElement>()
const domainChartRef = ref<HTMLElement>()

let systemChart: echarts.ECharts | null = null
let domainChart: echarts.ECharts | null = null

const metrics = [
  { label: '总体落标率', value: '86.4%', trend: '+2.3% 较上月', hint: '标准覆盖 220 条' },
  { label: '已完全落标标准', value: '148', trend: '+12 条 较上月', hint: '目标 160 条' },
  { label: '部分落标标准', value: '52', trend: '-6 条 较上月', hint: '待整改 12 条' },
  { label: '未落标标准', value: '20', trend: '-5 条 较上月', hint: '重点跟进中' },
]

const items = [
  { code: 'BZ-0001', name: '客户信息代码', system: '票务系统', domain: '客运管理', owner: '张三', rate: 0, level: '完全未落标', reason: '源系统字段结构与标准不一致，需字段级映射改造' },
  { code: 'BZ-0007', name: '线路编码标准', system: '线网管理系统', domain: '建设管理', owner: '李四', rate: 0, level: '完全未落标', reason: '系统使用历史编码体系，与标准编码规则不兼容' },
  { code: 'BZ-0013', name: '车站类型代码', system: '票务系统', domain: '客运管理', owner: '王五', rate: 35, level: '部分落标', reason: '仅覆盖 A 型车站，B/C 型车站尚未映射' },
  { code: 'BZ-0026', name: '设备状态代码', system: '设备管理系统', domain: '设备设施', owner: '赵六', rate: 0, level: '完全未落标', reason: '设备状态枚举值含自定义扩展，需数据清洗' },
  { code: 'BZ-0031', name: '工单类型标准', system: '运维工单系统', domain: '运营服务', owner: '孙七', rate: 60, level: '部分落标', reason: '存量数据部分分类未按新标准归并' },
  { code: 'BZ-0042', name: '安全事件等级', system: '应急管理系统', domain: '安全应急', owner: '张三', rate: 0, level: '完全未落标', reason: '系统上线时间早于标准发布时间，未纳入改造计划' },
  { code: 'BZ-0058', name: '资产分类代码', system: '资产管理系统', domain: '财务资产', owner: '李四', rate: 45, level: '部分落标', reason: '一级分类已映射，二级分类存在差异' },
  { code: 'BZ-0069', name: '信号设备代码', system: '信号控制系统', domain: '设备设施', owner: '王五', rate: 0, level: '完全未落标', reason: '现场控制设备编码为独立体系，等待专项改造' },
]

const filteredItems = computed(() =>
  items.filter((item) => {
    if (filterLevel.value && item.level !== filterLevel.value) return false
    if (!keyword.value) return true
    const kw = keyword.value.toLowerCase()
    return (
      item.name.toLowerCase().includes(kw) ||
      item.code.toLowerCase().includes(kw) ||
      item.owner.toLowerCase().includes(kw)
    )
  }),
)

const pagedItems = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredItems.value.slice(start, start + pageSize.value)
})

const renderSystemChart = () => {
  if (!systemChartRef.value) return
  systemChart?.dispose()
  systemChart = echarts.init(systemChartRef.value)
  systemChart.setOption({
    tooltip: { trigger: 'axis' },
    grid: { left: 40, right: 20, top: 30, bottom: 40 },
    xAxis: {
      type: 'category',
      data: ['票务系统', '设备管理', '运维工单', '线网管理', '应急管理', '资产系统'],
      axisLabel: { interval: 0, rotate: 20 },
    },
    yAxis: { type: 'value', max: 100, splitLine: { lineStyle: { type: 'dashed', color: '#E4E7ED' } } },
    series: [
      {
        name: '落标率(%)',
        type: 'bar',
        data: [78, 52, 66, 43, 38, 71],
        itemStyle: { color: '#DA251D', borderRadius: [4, 4, 0, 0] },
        label: { show: true, position: 'top', formatter: '{c}%' },
      },
    ],
  })
}

const renderDomainChart = () => {
  if (!domainChartRef.value) return
  domainChart?.dispose()
  domainChart = echarts.init(domainChartRef.value)
  domainChart.setOption({
    tooltip: { trigger: 'axis' },
    grid: { left: 40, right: 20, top: 30, bottom: 40 },
    xAxis: {
      type: 'category',
      data: ['客运管理', '建设管理', '设备设施', '运营服务', '安全应急', '财务资产'],
      axisLabel: { interval: 0, rotate: 20 },
    },
    yAxis: { type: 'value', max: 100, splitLine: { lineStyle: { type: 'dashed', color: '#E4E7ED' } } },
    series: [
      {
        name: '落标率(%)',
        type: 'bar',
        data: [81, 64, 58, 72, 49, 77],
        itemStyle: { color: '#2B6CB0', borderRadius: [4, 4, 0, 0] },
        label: { show: true, position: 'top', formatter: '{c}%' },
      },
    ],
  })
}

const generateReport = () => {
  ElMessage.success('已生成「标准评估与优化报告」（Mock）')
}

const generateSuggestions = () => {
  ElMessage.success('已生成 8 条落标整改建议（Mock）')
}

const handleResize = () => {
  systemChart?.resize()
  domainChart?.resize()
}

onMounted(() => {
  renderSystemChart()
  renderDomainChart()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  systemChart?.dispose()
  domainChart?.dispose()
})
</script>
