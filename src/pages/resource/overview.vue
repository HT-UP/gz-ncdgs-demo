<template>
  <div class="standard-page">
    <el-row :gutter="16">
      <el-col :xs="24" :lg="6" v-for="metric in metrics" :key="metric.label">
        <el-card class="metric-card dashboard-card" shadow="hover">
          <div class="metric-title">{{ metric.label }}</div>
          <div class="metric-value">{{ metric.value }}</div>
          <div class="metric-subtitle"><span class="dep-text">{{ metric.note }}</span></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16" class="mb-16 mt-16">
      <el-col :xs="24" :lg="8">
        <el-card class="panel-card dashboard-card" shadow="never">
          <template #header>
            <div class="panel-header"><span>资产占比分析（按业务域）</span></div>
          </template>
          <div ref="domainChartRef" class="chart-box"></div>
        </el-card>
      </el-col>

      <el-col :xs="24" :lg="8">
        <el-card class="panel-card dashboard-card" shadow="never">
          <template #header>
            <div class="panel-header"><span>数据资产组成（按类型）</span></div>
          </template>
          <div ref="typeChartRef" class="chart-box"></div>
        </el-card>
      </el-col>

      <el-col :xs="24" :lg="8">
        <el-card class="panel-card dashboard-card" shadow="never">
          <template #header>
            <div class="panel-header"><span>存储层级分布</span></div>
          </template>
          <div class="layer-list">
            <div v-for="layer in storageLayers" :key="layer.name" class="layer-item">
              <div class="layer-head">
                <span>{{ layer.name }}</span>
                <span class="layer-pct">{{ layer.percentage }}%</span>
              </div>
              <el-progress :percentage="layer.percentage" :color="layer.color" :stroke-width="9" />
              <div class="layer-size">{{ layer.size }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16">
      <el-col :xs="24" :lg="14">
        <el-card class="panel-card dashboard-card" shadow="never">
          <template #header>
            <div class="panel-header">
              <span>业务分类盘点</span>
              <el-button type="danger" size="small" :icon="Plus" @click="registerAsset">资产注册入目</el-button>
            </div>
          </template>
          <el-table :data="businessBreaks" stripe>
            <el-table-column prop="category" label="业务分类" min-width="140" />
            <el-table-column prop="count" label="资产数量" width="90" align="center" />
            <el-table-column label="占比" min-width="160">
              <template #default="{ row }">
                <el-progress :percentage="row.percentage" :color="row.color" :stroke-width="9" />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="110" fixed="right">
              <template #default="{ row }">
                <el-button link type="primary" @click="drillDown(row)">下钻</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <el-col :xs="24" :lg="10">
        <el-card class="panel-card dashboard-card" shadow="never">
          <template #header>
            <div class="panel-header"><span>资源消耗 TOP6</span></div>
          </template>
          <div class="rank-list">
            <div v-for="(item, index) in topConsumers" :key="item.name" class="rank-item">
              <span class="rank-no" :class="{ 'rank-top': index < 3 }">{{ index + 1 }}</span>
              <span class="rank-name">{{ item.name }}</span>
              <el-progress :percentage="item.percentage" color="#DA251D" :stroke-width="9" class="rank-progress" />
              <span class="rank-score">{{ item.size }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import * as echarts from 'echarts'

const domainChartRef = ref<HTMLElement>()
const typeChartRef = ref<HTMLElement>()
let domainChart: echarts.ECharts | null = null
let typeChart: echarts.ECharts | null = null

const metrics = [
  { label: '目录分类数', value: '50+', note: '含业务域 / 数据层级 / 自定义' },
  { label: '数据资产总表数', value: '3,268', note: '表 2,860 · 接口 336 · 视图 72' },
  { label: '存储总量', value: '3.2 TB', note: '较上月 +8.6%' },
  { label: '本月资源消耗', value: '18.4 万', note: 'CPU 时 · 存储 2.1TB' },
]

const storageLayers = [
  { name: 'ODS 贴源层', percentage: 36, color: '#DA251D', size: '1.15 TB' },
  { name: 'DWD 明细层', percentage: 28, color: '#2B6CB0', size: '0.90 TB' },
  { name: 'DWS 汇总层', percentage: 21, color: '#00A854', size: '0.67 TB' },
  { name: 'ADS 应用层', percentage: 15, color: '#9B59B6', size: '0.48 TB' },
]

const businessBreaks = [
  { category: '客运管理', count: 620, percentage: 22, color: '#DA251D' },
  { category: '设备设施', count: 540, percentage: 19, color: '#2B6CB0' },
  { category: '运营服务', count: 460, percentage: 16, color: '#00A854' },
  { category: '建设管理', count: 380, percentage: 14, color: '#ED7B2F' },
  { category: '财务资产', count: 300, percentage: 11, color: '#9B59B6' },
]

const topConsumers = [
  { name: '客流实时主题', percentage: 28, size: '748 GB' },
  { name: '设备日志明细', percentage: 22, size: '592 GB' },
  { name: '票务交易结算', percentage: 18, size: '481 GB' },
  { name: '信号采集数据', percentage: 13, size: '346 GB' },
  { name: '地图空间数据', percentage: 9, size: '242 GB' },
  { name: '建设进度档案', percentage: 6, size: '168 GB' },
]

const renderDomain = () => {
  if (!domainChartRef.value) return
  domainChart?.dispose()
  domainChart = echarts.init(domainChartRef.value)
  domainChart.setOption({
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    color: ['#DA251D', '#2B6CB0', '#00A854', '#ED7B2F', '#9B59B6'],
    series: [
      {
        type: 'pie',
        radius: ['45%', '70%'],
        center: ['50%', '52%'],
        avoidLabelOverlap: true,
        itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
        label: { formatter: '{b}\n{d}%', fontSize: 11 },
        data: businessBreaks.map((item) => ({ name: item.category, value: item.count })),
      },
    ],
  })
}

const renderType = () => {
  if (!typeChartRef.value) return
  typeChart?.dispose()
  typeChart = echarts.init(typeChartRef.value)
  typeChart.setOption({
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    color: ['#DA251D', '#2B6CB0', '#00A854', '#ED7B2F'],
    series: [
      {
        type: 'pie',
        radius: '70%',
        center: ['50%', '52%'],
        itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
        label: { formatter: '{b}\n{d}%', fontSize: 11 },
        data: [
          { name: '数据表', value: 2860 },
          { name: 'API 接口', value: 336 },
          { name: '视图', value: 72 },
          { name: '数据集市', value: 160 },
        ],
      },
    ],
  })
}

const handleResize = () => {
  domainChart?.resize()
  typeChart?.resize()
}

const registerAsset = () => {
  ElMessage.success('已打开资产注册入目流程（Mock）')
}

const drillDown = (row: (typeof businessBreaks)[number]) => {
  ElMessage.info(`已下钻至「${row.category}」目录，共 ${row.count} 项资产（Mock）`)
}

onMounted(() => {
  renderDomain()
  renderType()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  domainChart?.dispose()
  typeChart?.dispose()
})
</script>