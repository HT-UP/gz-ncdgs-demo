<template>
  <div class="standard-page">
    <el-row :gutter="16">
      <el-col :xs="24" :lg="17">
        <el-card class="panel-card dashboard-card" shadow="never">
          <template #header>
            <div class="panel-header">
              <span>血缘可视化</span>
              <div class="panel-actions">
                <el-input v-model="searchTable" placeholder="搜索表名" clearable size="small" class="search-input-sm" />
                <el-button type="danger" size="small" @click="highlightTable">定位</el-button>
                <el-button size="small" :icon="Upload" @click="uploadSql">上传SQL解析</el-button>
              </div>
            </div>
          </template>
          <div ref="lineageChartRef" class="lineage-chart"></div>
        </el-card>
      </el-col>

      <el-col :xs="24" :lg="7">
        <el-card class="panel-card dashboard-card" shadow="never">
          <template #header>
            <div class="panel-header">
              <span>血缘明细</span>
            </div>
          </template>
          <el-table :data="lineageDetails" size="small" stripe>
            <el-table-column prop="from" label="源表" min-width="110" />
            <el-table-column prop="via" label="链路" width="80" />
            <el-table-column prop="to" label="目标表" min-width="110" />
          </el-table>
        </el-card>

        <el-card class="panel-card dashboard-card mt-16" shadow="never">
          <template #header>
            <div class="panel-header">
              <span>异常血缘追踪</span>
            </div>
          </template>
          <div class="anomaly-list">
            <div class="anomaly-item">
              <el-tag effect="dark" type="danger">断裂</el-tag>
              <span class="anomaly-text">ticket_sale → report_flow 缺少中间环节</span>
            </div>
            <div class="anomaly-item">
              <el-tag effect="dark" type="warning">循环</el-tag>
              <span class="anomaly-text">line_dim ↔ station_dim 存在循环依赖</span>
            </div>
            <div class="anomaly-item">
              <el-tag effect="dark" type="danger">孤立</el-tag>
              <span class="anomaly-text">temp_data_01 无上游且无下游</span>
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
import * as echarts from 'echarts'
import { Upload } from '@element-plus/icons-vue'

const lineageChartRef = ref<HTMLElement>()
const searchTable = ref('')
let lineageChart: echarts.ECharts | null = null

const lineageDetails = [
  { from: 'ticket_sale', via: 'ETL', to: 'report_flow' },
  { from: 'passenger_info', via: '存储过程', to: 'cust_dim' },
  { from: 'cust_dim', via: 'SQL', to: 'report_flow' },
  { from: 'station_info', via: 'SQL', to: 'station_dim' },
  { from: 'line_info', via: 'SQL', to: 'line_dim' },
  { from: 'station_dim', via: '存储过程', to: 'report_flow' },
]

const nodes = [
  { name: 'ticket_sale', category: 0 },
  { name: 'passenger_info', category: 0 },
  { name: 'station_info', category: 0 },
  { name: 'line_info', category: 0 },
  { name: 'cust_dim', category: 1 },
  { name: 'station_dim', category: 1 },
  { name: 'line_dim', category: 1 },
  { name: 'report_flow', category: 2 },
  { name: 'temp_data_01', category: 3 },
]

const links = [
  { source: 'ticket_sale', target: 'report_flow' },
  { source: 'passenger_info', target: 'cust_dim' },
  { source: 'cust_dim', target: 'report_flow' },
  { source: 'station_info', target: 'station_dim' },
  { source: 'line_info', target: 'line_dim' },
  { source: 'station_dim', target: 'report_flow' },
  { source: 'line_dim', target: 'station_dim' },
]

const renderLineage = (highlight?: string) => {
  if (!lineageChartRef.value) return
  lineageChart?.dispose()
  lineageChart = echarts.init(lineageChartRef.value)
  const graphNodes = nodes.map((node) => ({
    ...node,
    symbolSize: node.category === 2 ? 46 : node.category === 3 ? 34 : 38,
    itemStyle:
      highlight && node.name === highlight
        ? { color: '#DA251D', borderColor: '#DA251D', borderWidth: 3, shadowBlur: 16, shadowColor: 'rgba(218,37,29,0.5)' }
        : undefined,
  }))
  const graphLinks = links.map((link) => ({
    ...link,
    lineStyle: {
      color:
        highlight && (link.source === highlight || link.target === highlight) ? '#DA251D' : '#A9B4C4',
      width: highlight && (link.source === highlight || link.target === highlight) ? 3 : 1.5,
      curveness: 0.15,
    },
  }))
  lineageChart.setOption({
    tooltip: { formatter: (params: { dataType: string; name: string }) => (params.dataType === 'node' ? params.name : '') },
    legend: [
      {
        data: ['源系统表', '中间层表', '目标报表', '孤立表'],
        bottom: 8,
        textStyle: { fontSize: 12 },
      },
    ],
    series: [
      {
        type: 'graph',
        layout: 'force',
        roam: true,
        draggable: true,
        categories: [
          { name: '源系统表', itemStyle: { color: '#2B6CB0' } },
          { name: '中间层表', itemStyle: { color: '#00A854' } },
          { name: '目标报表', itemStyle: { color: '#DA251D' } },
          { name: '孤立表', itemStyle: { color: '#8C8C8C' } },
        ],
        data: graphNodes,
        links: graphLinks,
        label: { show: true, position: 'right', fontSize: 11, color: '#4a4a4a' },
        force: { repulsion: 320, edgeLength: [80, 150], gravity: 0.15 },
        emphasis: { focus: 'adjacency', lineStyle: { width: 4 } },
      },
    ],
  })
}

const highlightTable = () => {
  if (!searchTable.value.trim()) {
    ElMessage.warning('请输入要定位的表名')
    return
  }
  renderLineage(searchTable.value.trim())
  ElMessage.success(`已定位到「${searchTable.value.trim()}」及其血缘链路`)
}

const uploadSql = () => {
  ElMessage.success('SQL 文件已解析，生成血缘关系 8 条（Mock）')
}

const handleResize = () => {
  lineageChart?.resize()
}

onMounted(() => {
  renderLineage()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  lineageChart?.dispose()
})
</script>
