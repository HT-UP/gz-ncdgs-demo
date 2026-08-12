<template>
  <div class="standard-page">
    <el-row :gutter="16">
      <el-col :span="16">
        <el-card class="panel-card dashboard-card" shadow="never">
          <template #header>
            <div class="panel-header">
              <span>血缘关系图</span>
              <div class="panel-actions">
                <el-radio-group v-model="viewMode" size="small">
                  <el-radio-button label="正向影响">正向影响</el-radio-button>
                  <el-radio-button label="反向溯源">反向溯源</el-radio-button>
                  <el-radio-button label="全部关系">全部关系</el-radio-button>
                </el-radio-group>
                <el-button type="danger" size="small" :icon="Download" @click="exportLineage">导出血缘</el-button>
              </div>
            </div>
          </template>
          <div ref="lineageChartRef" class="lineage-chart"></div>
          <div class="lineage-legend">
            <span><i class="legend-dot" style="background: #DA251D"></i>当前表</span>
            <span><i class="legend-dot" style="background: #2B6CB0"></i>上游来源</span>
            <span><i class="legend-dot" style="background: #00A854"></i>下游依赖</span>
            <span><i class="legend-dot" style="background: #ED7B2F"></i>异常节点</span>
          </div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card class="panel-card dashboard-card" shadow="never">
          <template #header>
            <div class="panel-header"><span>血缘分析</span></div>
          </template>
          <el-select v-model="selectedTable" filterable class="w-full" @change="renderLineage">
            <el-option v-for="table in tablePool" :key="table" :label="table" :value="table" />
          </el-select>

          <div class="lineage-stats mt-16">
            <div class="stat-row"><span>上游来源</span><b class="stat-blue">{{ upstreamCount }}</b></div>
            <div class="stat-row"><span>下游依赖</span><b class="stat-green">{{ downstreamCount }}</b></div>
            <div class="stat-row"><span>血缘层级</span><b>{{ depth }}</b></div>
            <div class="stat-row"><span>影响范围</span><b>{{ upstreamCount + downstreamCount }} 张表</b></div>
          </div>

          <el-divider />

          <div class="section-title">变更影响评估</div>
          <div class="impact-item">
            <div class="impact-icon"><el-icon :size="16"><Share /></el-icon></div>
            <div class="impact-info">
              <div class="impact-name">结构变更影响面</div>
              <div class="impact-desc">涉及 3 个下游任务、2 个报表依赖，预计影响等级 <b style="color:#ED7B2F">中</b></div>
            </div>
          </div>

          <el-divider />

          <div class="section-title">异常血缘检测</div>
          <div class="anomaly-list">
            <div v-for="item in anomalies" :key="item.name" class="anomaly-item">
              <el-tag size="small" :type="item.type === '环状依赖' ? 'danger' : 'warning'" effect="dark">{{ item.type }}</el-tag>
              <span class="anomaly-name">{{ item.name }}</span>
              <span class="dep-text">{{ item.note }}</span>
            </div>
          </div>

          <div class="section-title mt-16">血缘维护</div>
          <div class="maintain-actions">
            <el-button size="small" @click="autoDiscover">自动发现</el-button>
            <el-button size="small" type="primary" @click="manualLink">手动维护</el-button>
            <el-button size="small" type="danger" plain @click="removeNode">删除节点</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Download, Share } from '@element-plus/icons-vue'
import * as echarts from 'echarts'

const tablePool = ['ticket_sale_detail', 'passenger_info', 'flow_stat_daily', 'device_status_log', 'station_info', 'train_operation_log', 'line_info']

const relations: [string, string][] = [
  ['passenger_info', 'ticket_sale_detail'],
  ['station_info', 'flow_stat_daily'],
  ['device_status_log', 'flow_stat_daily'],
  ['ticket_sale_detail', 'flow_stat_daily'],
  ['ticket_sale_detail', 'train_operation_log'],
  ['flow_stat_daily', 'train_operation_log'],
  ['line_info', 'station_info'],
  ['line_info', 'train_operation_log'],
  ['device_status_log', 'train_operation_log'],
]

const viewMode = ref('正向影响')
const selectedTable = ref('ticket_sale_detail')
const lineageChartRef = ref<HTMLElement>()
let chart: echarts.ECharts | null = null

const anomalies = [
  { type: '环状依赖', name: 'flow_stat_daily ⇄ train_operation_log', note: '存在循环引用' },
  { type: '孤立节点', name: 'station_info', note: '无上游血缘', extra: true },
]

const upstreamCount = computed(
  () => relations.filter(([from, to]) => to === selectedTable.value).length,
)
const downstreamCount = computed(
  () => relations.filter(([from, to]) => from === selectedTable.value).length,
)
const depth = computed(() => 3)

interface NodeData {
  name: string
  category: 0 | 1 | 2 | 3
  symbolSize: number
}

interface LinkData {
  source: string
  target: string
  lineStyle?: { color: string; width?: number; type?: string }
}

const renderLineage = () => {
  if (!lineageChartRef.value) return
  chart?.dispose()
  chart = echarts.init(lineageChartRef.value)

  const current = selectedTable.value
  const upStreams = relations.filter(([, to]) => to === current).map(([from]) => from)
  const downStreams = relations.filter(([from]) => from === current).map(([, to]) => to)

  const nodes: NodeData[] = []
  const links: LinkData[] = []
  const nodeSet = new Set<string>()

  const addNode = (name: string, category: NodeData['category']) => {
    if (nodeSet.has(name)) return
    nodeSet.add(name)
    nodes.push({ name, category, symbolSize: name === current ? 54 : 38 })
  }

  const addLink = (source: string, target: string, category: 0 | 1 | 2) => {
    links.push({
      source,
      target,
      lineStyle: { color: category === 1 ? '#2B6CB0' : category === 2 ? '#00A854' : '#C0C4CC', width: category === 0 ? 3 : 2 },
    })
  }

  addNode(current, 0)

  if (viewMode.value === '反向溯源' || viewMode.value === '全部关系') {
    upStreams.forEach((name) => {
      addNode(name, 1)
      addLink(name, current, 1)
    })
  }
  if (viewMode.value === '正向影响' || viewMode.value === '全部关系') {
    downStreams.forEach((name) => {
      addNode(name, 2)
      addLink(current, name, 2)
    })
  }

  if (viewMode.value === '全部关系') {
    nodes.push({ name: 'cycle-node', category: 3, symbolSize: 26 })
    links.push({ source: 'device_status_log', target: 'cycle-node', lineStyle: { color: '#ED7B2F', width: 2, type: 'dashed' } })
    nodes.push({ name: 'isolated-node', category: 3, symbolSize: 22 })
  }

  chart.setOption({
    tooltip: {
      formatter: (params: { dataType?: string; data?: { name: string } }) =>
        params.dataType === 'edge' ? '' : `表：${params.data?.name}`,
    },
    legend: { show: false },
    animationDurationUpdate: 500,
    series: [
      {
        type: 'graph',
        layout: 'force',
        roam: true,
        draggable: true,
        data: nodes,
        links,
        categories: [
          { name: '当前表', itemStyle: { color: '#DA251D' } },
          { name: '上游', itemStyle: { color: '#2B6CB0' } },
          { name: '下游', itemStyle: { color: '#00A854' } },
          { name: '异常', itemStyle: { color: '#ED7B2F', opacity: 0.7 } },
        ],
        force: { repulsion: 480, edgeLength: [100, 180], gravity: 0.12 },
        label: {
          show: true,
          position: 'bottom',
          fontSize: 11,
          color: '#4a4a4a',
          formatter: (params: { name: string }) => {
            if (params.name === 'cycle-node') return '环状依赖'
            if (params.name === 'isolated-node') return '孤立节点'
            return params.name
          },
        },
        lineStyle: { curveness: 0.15, width: 2 },
        emphasis: { focus: 'adjacency', lineStyle: { width: 4 } },
        itemStyle: { borderColor: '#fff', borderWidth: 2 },
      },
    ],
  })
  const instance = chart
  instance.on('click', (params: echarts.ECElementEvent) => {
    const data = params.data as { name?: string } | undefined
    if (data?.name && tablePool.includes(data.name) && data.name !== current) {
      selectedTable.value = data.name
      renderLineage()
    }
  })
}

const autoDiscover = () => ElMessage.success('血缘自动发现完成：新增 5 条血缘关系（Mock）')
const manualLink = () => ElMessage.info('已打开血缘手动维护编辑器（Mock）')
const removeNode = () => ElMessage.info('请在图谱中选择要删除的节点（Mock）')
const exportLineage = () => ElMessage.success('血缘关系已导出为 JSON / Excel（Mock）')

const handleResize = () => chart?.resize()

onMounted(() => {
  renderLineage()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  chart?.dispose()
})
</script>