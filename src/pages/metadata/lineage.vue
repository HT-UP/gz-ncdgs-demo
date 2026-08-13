<template>
  <div class="standard-page lineage-page">
    <div class="lineage-tabs-wrap">
      <el-tabs v-model="activeTab" type="border-card" stretch>
        <el-tab-pane label="血缘可视化" name="visual">
          <div class="lineage-visual-pane">
            <div class="lineage-toolbar">
              <el-input
                v-model="searchTable"
                placeholder="搜索表名 / 字段名"
                clearable
                size="small"
                class="search-input-sm"
                @keyup.enter="highlightTable"
              />
              <el-button type="danger" size="small" @click="highlightTable">定位</el-button>
              <el-button size="small" :icon="Upload" @click="uploadSql">上传SQL解析</el-button>
            </div>
            <div ref="lineageChartRef" class="lineage-chart"></div>
            <div class="sankey-legend">
              <span v-for="item in legendItems" :key="item.label" class="sankey-legend-item">
                <i class="sankey-legend-dot" :style="{ background: item.color }"></i>{{ item.label }}
              </span>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="血缘明细" name="detail">
          <div class="lineage-detail-pane">
            <div class="lineage-toolbar">
              <el-select v-model="detailFilter" size="small" class="filter-select-sm">
                <el-option label="全部目标表" value="" />
                <el-option v-for="t in targetTables" :key="t" :label="t" :value="t" />
              </el-select>
              <span class="dep-text">共 {{ filteredDetails.length }} 条字段级血缘记录</span>
            </div>
            <el-table :data="filteredDetails" size="small" stripe height="100%">
              <el-table-column label="源字段" min-width="170">
                <template #default="{ row }">
                  <span class="field-source">{{ row.source }}</span>
                </template>
              </el-table-column>
              <el-table-column label="处理函数" width="140">
                <template #default="{ row }">
                  <el-tag size="small" type="warning" effect="plain">{{ row.func }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="目标字段" min-width="170">
                <template #default="{ row }">
                  <span class="field-target">{{ row.target }}</span>
                </template>
              </el-table-column>
              <el-table-column label="数据量" width="100" align="right">
                <template #default="{ row }">{{ row.flowText }}</template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>

        <el-tab-pane label="异常血缘追踪" name="anomaly">
          <div class="lineage-anomaly-pane">
            <el-alert title="系统自动巡检血缘链路，标记断裂、循环、孤立、口径冲突与函数告警，供人工复核处理（Mock）" type="warning" :closable="false" show-icon class="mb-12" />
            <div class="anomaly-list">
              <div v-for="item in anomalies" :key="item.text" class="anomaly-item">
                <el-tag effect="dark" :type="item.level" size="small">{{ item.type }}</el-tag>
                <span class="anomaly-text">{{ item.text }}</span>
              </div>
            </div>
            <div class="anomaly-stats">
              <div v-for="stat in anomalyStats" :key="stat.label" class="anomaly-stat">
                <div class="anomaly-stat-value" :style="{ color: stat.color }">{{ stat.value }}</div>
                <div class="anomaly-stat-label">{{ stat.label }}</div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'
import { Upload } from '@element-plus/icons-vue'

type FieldLink = {
  source: string
  target: string
  func: string
  flow: number
}

type Layer = 'source' | 'mid' | 'target'

const fieldLineage: FieldLink[] = [
  { source: 'ticket_sale.order_id', target: 'dwd_order_detail.order_id', func: '直接映射', flow: 128640 },
  { source: 'ticket_sale.order_date', target: 'dwd_order_detail.order_date', func: 'TO_DATE(order_date)', flow: 128640 },
  { source: 'ticket_sale.amount', target: 'dwd_order_detail.amount', func: 'NVL(amount, 0)', flow: 128640 },
  { source: 'ticket_sale.ticket_type', target: 'dwd_order_detail.ticket_type', func: 'TRIM(ticket_type)', flow: 128640 },
  { source: 'ticket_sale.line_code', target: 'dwd_order_detail.line_code', func: '直接映射', flow: 128640 },
  { source: 'passenger_info.passenger_id', target: 'dim_passenger.passenger_id', func: '直接映射', flow: 8620 },
  { source: 'passenger_info.passenger_name', target: 'dim_passenger.passenger_name', func: 'CONCAT(first_name, last_name)', flow: 8620 },
  { source: 'passenger_info.age', target: 'dim_passenger.age_group', func: 'CASE WHEN 年龄分箱', flow: 8620 },
  { source: 'station_info.station_code', target: 'dim_station.station_code', func: '直接映射', flow: 128 },
  { source: 'station_info.station_name', target: 'dim_station.station_name', func: '直接映射', flow: 128 },
  { source: 'line_info.line_code', target: 'dim_line.line_code', func: '直接映射', flow: 8 },
  { source: 'line_info.line_name', target: 'dim_line.line_name', func: '直接映射', flow: 8 },
  { source: 'dwd_order_detail.order_id', target: 'dws_order_report.order_id', func: '直接映射', flow: 128640 },
  { source: 'dwd_order_detail.amount', target: 'dws_order_report.total_amount', func: 'SUM(amount)', flow: 128640 },
  { source: 'dwd_order_detail.order_id', target: 'dws_order_report.order_count', func: 'COUNT(DISTINCT order_id)', flow: 128640 },
  { source: 'dim_line.line_code', target: 'dws_order_report.line_code', func: 'JOIN 映射', flow: 8 },
  { source: 'dim_line.line_name', target: 'dws_order_report.line_name', func: 'JOIN 映射', flow: 8 },
  { source: 'dim_passenger.passenger_id', target: 'ads_line_flow.total_passengers', func: 'COUNT(passenger_id)', flow: 8620 },
  { source: 'dim_passenger.age_group', target: 'ads_line_flow.avg_age', func: 'AVG(age)', flow: 8620 },
  { source: 'dim_line.line_code', target: 'ads_line_flow.line_code', func: 'JOIN 映射', flow: 8 },
  { source: 'dim_line.line_name', target: 'ads_line_flow.line_name', func: 'JOIN 映射', flow: 8 },
  { source: 'dim_station.station_code', target: 'ads_line_flow.station_code', func: 'JOIN 映射', flow: 128 },
  { source: 'dim_station.station_name', target: 'ads_line_flow.station_name', func: 'JOIN 映射', flow: 128 },
]

const tableMeta: Record<string, { label: string; layer: Layer }> = {
  ticket_sale: { label: '售票明细表', layer: 'source' },
  passenger_info: { label: '乘客信息表', layer: 'source' },
  station_info: { label: '车站信息表', layer: 'source' },
  line_info: { label: '线路信息表', layer: 'source' },
  dwd_order_detail: { label: '订单明细层', layer: 'mid' },
  dim_passenger: { label: '乘客维度表', layer: 'mid' },
  dim_station: { label: '车站维度表', layer: 'mid' },
  dim_line: { label: '线路维度表', layer: 'mid' },
  dws_order_report: { label: '订单汇总报表', layer: 'target' },
  ads_line_flow: { label: '线路客流报表', layer: 'target' },
}

const tableFields: Record<string, string[]> = {
  ticket_sale: ['order_id', 'order_date', 'line_code', 'amount', 'ticket_type', 'status', 'create_time'],
  passenger_info: ['passenger_id', 'passenger_name', 'age', 'phone', 'create_time'],
  station_info: ['station_code', 'station_name', 'station_type', 'status'],
  line_info: ['line_code', 'line_name', 'status'],
  dwd_order_detail: ['order_id', 'order_date', 'line_code', 'amount', 'ticket_type', 'create_time'],
  dim_passenger: ['passenger_id', 'passenger_name', 'age_group', 'create_time'],
  dim_station: ['station_code', 'station_name'],
  dim_line: ['line_code', 'line_name'],
  dws_order_report: ['order_id', 'order_date', 'line_code', 'line_name', 'total_amount', 'order_count', 'ticket_type', 'create_time'],
  ads_line_flow: ['line_code', 'line_name', 'station_code', 'station_name', 'total_passengers', 'avg_age', 'flow_date', 'update_time'],
}

const pkFields = new Set([
  'ticket_sale.order_id',
  'passenger_info.passenger_id',
  'station_info.station_code',
  'line_info.line_code',
  'dwd_order_detail.order_id',
  'dim_passenger.passenger_id',
  'dim_station.station_code',
  'dim_line.line_code',
  'dws_order_report.order_id',
])

const layerTables: Record<Layer, string[]> = {
  source: ['ticket_sale', 'passenger_info', 'station_info', 'line_info'],
  mid: ['dwd_order_detail', 'dim_passenger', 'dim_station', 'dim_line'],
  target: ['dws_order_report', 'ads_line_flow'],
}

const layerColor: Record<Layer, string> = {
  source: '#2B6CB0',
  mid: '#00A854',
  target: '#DA251D',
}

const layerName: Record<Layer, string> = {
  source: '源系统表',
  mid: '中间层表',
  target: '汇总报表层',
}

const legendItems = [
  { label: '源系统表', color: '#2B6CB0' },
  { label: '中间层表（ODS/DWD/DIM）', color: '#00A854' },
  { label: '汇总报表层', color: '#DA251D' },
]

const anomalies = [
  { type: '断裂', level: 'danger', text: 'station_info.station_type 无下游字段，缺少类型转换规则（Mock）' },
  { type: '循环', level: 'warning', text: 'dim_order.order_id ↔ dws_order_report 疑似循环引用，已自动阻断（Mock）' },
  { type: '孤立', level: 'danger', text: 'temp_ticket_sale.temp_field 无上游且无下游，未纳入解析（Mock）' },
  { type: '冲突', level: 'warning', text: 'dws_order_report.total_amount 存在多口径上游，请确认统计口径（Mock）' },
  { type: '告警', level: 'info', text: 'ticket_sale.amount 使用 NVL 隐式转换，建议显式 CAST（Mock）' },
]

const anomalyStats = [
  { label: '断裂', value: 1, color: '#DA251D' },
  { label: '循环', value: 1, color: '#ED7B2F' },
  { label: '孤立', value: 1, color: '#DA251D' },
  { label: '冲突', value: 1, color: '#ED7B2F' },
  { label: '告警', value: 1, color: '#2B6CB0' },
]

const formatFlow = (value: number) => (value >= 10000 ? `${(value / 10000).toFixed(1)} 万` : `${value}`)

const lineageChartRef = ref<HTMLElement>()
const searchTable = ref('')
const detailFilter = ref('')
const activeTab = ref('visual')
let lineageChart: echarts.ECharts | null = null

const targetTables = computed(() => [...new Set(fieldLineage.map((link) => link.target.split('.')[0]))])

const filteredDetails = computed(() =>
  detailFilter.value
    ? fieldLineage.map((link) => ({ ...link, flowText: formatFlow(link.flow) })).filter((link) => link.target.startsWith(`${detailFilter.value}.`))
    : fieldLineage.map((link) => ({ ...link, flowText: formatFlow(link.flow) })),
)

const cardWidthOf = (table: string) => {
  const maxLen = Math.max(...tableFields[table].map((f) => f.length + (pkFields.has(`${table}.${f}`) ? 4 : 0)))
  return Math.max(160, Math.min(260, maxLen * 7.5 + 34))
}

const cardHeightOf = (table: string) => tableFields[table].length * 20 + 48

const renderLineage = (highlight?: string) => {
  if (!lineageChartRef.value) return
  lineageChart?.dispose()
  lineageChart = echarts.init(lineageChartRef.value)

  // 横向分层布局：源系统表 → 中间层 → 汇总报表
  const colMaxWidth: Record<Layer, number> = { source: 0, mid: 0, target: 0 }
  ;(Object.keys(layerTables) as Layer[]).forEach((layer) => {
    colMaxWidth[layer] = Math.max(...layerTables[layer].map(cardWidthOf))
  })
  const xs: Record<Layer, number> = { source: 20, mid: 0, target: 0 }
  const layerOrder: Layer[] = ['source', 'mid', 'target']
  layerOrder.forEach((layer, i) => {
    if (i > 0) xs[layer] = xs[layerOrder[i - 1]] + colMaxWidth[layerOrder[i - 1]] + 200
  })

  const ys: Record<string, number> = {}
  layerOrder.forEach((layer) => {
    let y = 20
    layerTables[layer].forEach((table) => {
      ys[table] = y
      y += cardHeightOf(table) + 46
    })
  })

  const nodes = layerOrder.flatMap((layer) =>
    layerTables[layer].map((table) => {
      const meta = tableMeta[table]
      const color = layerColor[meta.layer]
      const width = cardWidthOf(table)
      const matched = !!highlight && (table.includes(highlight) || tableFields[table].some((f) => f.includes(highlight)))
      return {
        name: table,
        x: xs[layer],
        y: ys[table],
        symbol: 'rect',
        symbolSize: [width, cardHeightOf(table)],
        tipHtml: `<b>${table}</b><br/>${meta.label}｜${layerName[meta.layer]}<br/>字段数：${tableFields[table].length}`,
        itemStyle: matched
          ? { color: '#fff', borderColor: '#DA251D', borderWidth: 2.5, borderRadius: 6, shadowBlur: 12, shadowColor: 'rgba(218,37,29,0.4)' }
          : { color: '#fff', borderColor: '#D3D8E0', borderWidth: 1.5, borderRadius: 6 },
        label: {
          show: true,
          position: 'inside',
          formatter: () =>
            `{title|${table}}\n{fields|${tableFields[table]
              .map((f) => (pkFields.has(`${table}.${f}`) ? `PK · ${f}` : f))
              .join('\n')}}`,
          rich: {
            title: {
              width: width - 8,
              height: 30,
              backgroundColor: color,
              color: '#fff',
              fontSize: 13,
              fontWeight: 700,
              lineHeight: 30,
              padding: [0, 10, 0, 10],
              align: 'left',
              verticalAlign: 'middle',
              borderRadius: [6, 6, 0, 0],
            },
            fields: {
              width: width - 8,
              color: '#4A4A4A',
              backgroundColor: '#FFFFFF',
              fontSize: 12,
              lineHeight: 20,
              padding: [6, 10, 12, 10],
              align: 'left',
              verticalAlign: 'top',
              borderRadius: [0, 0, 6, 6],
            },
          },
        },
      }
    }),
  )

  // 表级连线分组，一组字段映射渲染为多条微偏弧线
  const groupMap = new Map<string, FieldLink[]>()
  fieldLineage.forEach((link) => {
    const fromTable = link.source.split('.')[0]
    const toTable = link.target.split('.')[0]
    const key = `${fromTable}>${toTable}`
    if (!groupMap.has(key)) groupMap.set(key, [])
    groupMap.get(key)!.push(link)
  })

  const links: any[] = []
  groupMap.forEach((mappers, key) => {
    const [fromTable, toTable] = key.split('>')
    mappers.forEach((_m, i) => {
      const curveness = 0.48 + i * 0.07
      const matched =
        !!highlight &&
        (fromTable.includes(highlight) ||
          toTable.includes(highlight) ||
          mappers.some((x) => x.source.includes(highlight) || x.target.includes(highlight)))
      links.push({
        source: fromTable,
        target: toTable,
        curveness,
        mappings: mappers,
        matched,
        lineStyle: matched ? { color: '#DA251D', width: 3, curveness } : { color: '#B6BFCB', width: 1.6, curveness },
      })
    })
  })

  lineageChart.setOption({
    tooltip: {
      trigger: 'item',
      formatter: (params: { dataType: string; data: { mappings?: FieldLink[]; tipHtml?: string; source?: string; target?: string } }) => {
        if (params.dataType === 'edge') {
          const d = params.data
          const rows = (d.mappings ?? [])
            .map(
              (m) =>
                `<span style="color:#2B6CB0">${m.source}</span> —[${m.func}]→ <span style="color:#DA251D">${m.target}</span>`,
            )
            .join('<br/>')
          return `<b>${d.source} → ${d.target}</b><br/><br/>${rows}`
        }
        return params.data?.tipHtml ?? params.data?.source ?? ''
      },
    },
    series: [
      {
        type: 'graph',
        layout: 'none',
        roam: true,
        draggable: true,
        data: nodes,
        links,
        lineStyle: { color: '#B6BFCB', width: 1.6, curveness: 0.5 },
        emphasis: { focus: 'adjacency', lineStyle: { width: 3, color: '#DA251D' } },
      },
    ],
  })
}

const highlightTable = () => {
  const keyword = searchTable.value.trim()
  if (!keyword) {
    ElMessage.warning('请输入要定位的表名或字段名')
    return
  }
  renderLineage(keyword)
  ElMessage.success(`已定位到「${keyword}」及其血缘链路`)
}

const uploadSql = () => {
  ElMessage.success(`SQL 文件已解析，生成字段级血缘关系 ${fieldLineage.length} 条（Mock）`)
}

const handleResize = () => lineageChart?.resize()

watch(activeTab, () => {
  if (activeTab.value === 'visual') {
    nextTick(() => handleResize())
  }
})

let chartResizeObserver: ResizeObserver | null = null

onMounted(() => {
  renderLineage()
  window.addEventListener('resize', handleResize)
  // 容器尺寸变化时自动同步 ECharts 画布（CSS 高度变化 / 折叠侧栏 / 标签页切换等）
  if (lineageChartRef.value && typeof ResizeObserver !== 'undefined') {
    chartResizeObserver = new ResizeObserver(() => handleResize())
    chartResizeObserver.observe(lineageChartRef.value)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  chartResizeObserver?.disconnect()
  lineageChart?.dispose()
})
</script>

<style lang="scss" scoped>
.lineage-page {
  height: 100%;
}

.lineage-tabs-wrap {
  height: 100%;
  min-height: 540px;
  display: flex;
  flex-direction: column;

  :deep(.el-tabs--border-card) {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    border-radius: 8px;
  }

  :deep(.el-tabs__content) {
    flex: 1;
    min-height: 0;
    overflow: hidden;
  }

  :deep(.el-tab-pane) {
    height: 100%;
    overflow: hidden;
  }
}

.lineage-visual-pane,
.lineage-detail-pane,
.lineage-anomaly-pane {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.lineage-anomaly-pane {
  overflow: auto;
}

.lineage-toolbar {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.filter-select-sm {
  width: 130px;
}

.lineage-detail-pane {
  :deep(.el-table) {
    flex: 1;
    min-height: 0;
  }
}

.lineage-chart {
  flex: 1;
  min-height: 0;
  width: 100%;
  height: auto;
  overflow: hidden;
}

.sankey-legend {
  display: flex;
  gap: 18px;
  flex-wrap: wrap;
  padding: 6px 2px 0;
}

.sankey-legend-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #8c8c8c;
}

.sankey-legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 3px;
  display: inline-block;
}

.anomaly-text {
  color: #4a4a4a;
  line-height: 1.6;
}

.anomaly-stats {
  display: flex;
  gap: 12px;
  margin-top: 16px;
  flex-wrap: wrap;
}

.anomaly-stat {
  flex: 1;
  min-width: 110px;
  border: 1px solid #edf0f5;
  border-radius: 8px;
  padding: 14px;
  text-align: center;
  background: #fafafa;
}

.anomaly-stat-value {
  font-size: 24px;
  font-weight: 700;
  line-height: 1.2;
}

.anomaly-stat-label {
  margin-top: 4px;
  font-size: 12px;
  color: #8c8c8c;
}

.field-source {
  color: #2b6cb0;
  font-weight: 600;
  font-size: 12px;
}

.field-target {
  color: #da251d;
  font-weight: 600;
  font-size: 12px;
}
</style>
