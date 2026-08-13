<template>
  <div class="standard-page share-logs-page">
    <el-card class="panel-card" shadow="never">
      <template #header>
        <div class="panel-header">
          <span>服务调用日志</span>
          <div class="panel-actions">
            <el-button size="small" type="danger" plain :icon="Download" :disabled="!filteredLogs.length" @click="exportLogs">导出日志</el-button>
          </div>
        </div>
      </template>

      <div class="toolbar-row">
        <el-date-picker v-model="timeRange" type="datetimerange" size="small" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" class="filter-date" />
        <el-select v-model="appFilter" placeholder="调用应用" clearable size="small" class="filter-select-lg">
          <el-option v-for="a in appOptions" :key="a" :label="a" :value="a" />
        </el-select>
        <el-select v-model="svcFilter" placeholder="服务" clearable size="small" class="filter-select-lg">
          <el-option v-for="s in svcOptions" :key="s" :label="s" :value="s" />
        </el-select>
        <el-select v-model="resultFilter" placeholder="结果" clearable size="small" class="filter-select">
          <el-option label="成功" value="成功" />
          <el-option label="失败" value="失败" />
        </el-select>
        <el-input v-model="kw" placeholder="按调用方 / 参数关键字" clearable size="small" class="search-input" :prefix-icon="Search" />
      </div>

      <el-table :data="filteredLogs" size="small" stripe class="mt-12">
        <el-table-column prop="time" label="调用时间" width="150" />
        <el-table-column prop="app" label="调用方应用" min-width="130" show-overflow-tooltip />
        <el-table-column prop="service" label="服务" min-width="150" show-overflow-tooltip />
        <el-table-column prop="method" label="Method" width="70" align="center" />
        <el-table-column label="参数" min-width="150">
          <template #default="{ row }">
            <code class="log-param">{{ row.param }}</code>
          </template>
        </el-table-column>
        <el-table-column prop="code" label="返回码" width="80" align="center">
          <template #default="{ row }">
            <code :class="row.code === 0 ? 'code-ok' : 'code-err'">{{ row.code }}</code>
          </template>
        </el-table-column>
        <el-table-column prop="cost" label="耗时" width="76" align="right" />
        <el-table-column label="结果" width="70">
          <template #default="{ row }">
            <el-tag size="small" :type="row.result === '成功' ? 'success' : 'danger'" effect="dark">{{ row.result }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="70" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="openDetail(row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pager">
        <el-pagination background layout="total, prev, pager, next" :total="filteredLogs.length" :page-size="12" />
      </div>
      <div class="retention-note">日志保留 180 天，支持在线查询与审计导出；访问分析、异常识别分析可跳转安全审计模块。</div>
    </el-card>

    <el-dialog v-model="detailVisible" title="调用日志详情" width="640px">
      <template v-if="detailLog">
        <el-descriptions :column="2" border size="small">
          <el-descriptions-item label="调用时间">{{ detailLog.time }}</el-descriptions-item>
          <el-descriptions-item label="调用方应用">{{ detailLog.app }}</el-descriptions-item>
          <el-descriptions-item label="服务路径">{{ detailLog.service }}</el-descriptions-item>
          <el-descriptions-item label="请求方式">{{ detailLog.method }}</el-descriptions-item>
          <el-descriptions-item label="调用者 IP">{{ detailLog.ip }}</el-descriptions-item>
          <el-descriptions-item label="结果">{{ detailLog.result }}</el-descriptions-item>
          <el-descriptions-item label="返回码">{{ detailLog.code }}</el-descriptions-item>
          <el-descriptions-item label="耗时">{{ detailLog.cost }}</el-descriptions-item>
        </el-descriptions>
        <div class="detail-block-title">请求参数</div>
        <pre class="log-code">{{ detailLog.request }}</pre>
        <div class="detail-block-title">响应内容</div>
        <pre class="log-code" :class="{ 'code-error': detailLog.result === '失败' }">{{ detailLog.response }}</pre>
      </template>
      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
        <el-button type="primary" @click="exportOne">导出该条</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Download, Search } from '@element-plus/icons-vue'

const appOptions = ['智能客流分析平台', '线网规划仿真系统', '车站大屏展示端', '外部科研合作方']
const svcOptions = ['客流统计查询服务', '线路基础信息服务', '车站信息同步服务', '售票明细查询服务', '订单汇总指标服务']

type CallLog = {
  id: number
  time: string
  app: string
  service: string
  method: string
  param: string
  code: number
  cost: string
  result: '成功' | '失败'
  ip: string
  request: string
  response: string
}

const logs = ref<CallLog[]>([
  { id: 1, time: '2026-08-13 10:31:22', app: '智能客流分析平台', service: '/api/v1/flow/stat', method: 'GET', param: 'line_code=GZ-L1', code: 0, cost: '182ms', result: '成功', ip: '10.20.8.15', request: '{"line_code":"GZ-L1"}', response: '{"code":0,"data":{"totalPassengers":86472}}' },
  { id: 2, time: '2026-08-13 10:31:05', app: '车站大屏展示端', service: '/api/v1/station/list', method: 'GET', param: 'page=1', code: 0, cost: '96ms', result: '成功', ip: '10.20.12.7', request: '{"page":1}', response: '{"code":0,"data":[{"stationName":"公园前"}]}' },
  { id: 3, time: '2026-08-13 10:30:48', app: '外部科研合作方', service: '/api/v1/ticket/query', method: 'POST', param: 'begin_date=2026-08-01', code: 40101, cost: '12ms', result: '失败', ip: '203.0.113.9', request: '{"begin_date":"2026-08-01"}', response: '{"code":40101,"message":"signature verification failed"}' },
  { id: 4, time: '2026-08-13 10:30:31', app: '线网规划仿真系统', service: '/api/v1/line/detail', method: 'GET', param: 'line_code=GZ-L2', code: 0, cost: '74ms', result: '成功', ip: '10.20.9.21', request: '{"line_code":"GZ-L2"}', response: '{"code":0,"data":{"lineName":"2号线"}}' },
  { id: 5, time: '2026-08-13 10:29:58', app: '智能客流分析平台', service: '/api/v1/order/summary', method: 'GET', param: 'line_code=GZ-L1', code: 42900, cost: '8ms', result: '失败', ip: '10.20.8.15', request: '{"line_code":"GZ-L1"}', response: '{"code":42900,"message":"rate limit exceeded"}' },
  { id: 6, time: '2026-08-13 10:29:40', app: '车站大屏展示端', service: '/api/v1/qa/station', method: 'POST', param: 'question=下一站', code: 0, cost: '1380ms', result: '成功', ip: '10.20.12.7', request: '{"question":"下一站到哪？"}', response: '{"code":0,"data":{"answer":"下一站：烈士陵园"}}' },
  { id: 7, time: '2026-08-13 10:29:12', app: '智能客流分析平台', service: '/api/v1/flow/stat', method: 'GET', param: 'line_code=GZ-L2', code: 0, cost: '175ms', result: '成功', ip: '10.20.8.15', request: '{"line_code":"GZ-L2"}', response: '{"code":0,"data":{"totalPassengers":51003}}' },
  { id: 8, time: '2026-08-13 10:28:55', app: '外部科研合作方', service: '/api/v1/ticket/query', method: 'POST', param: 'begin_date=2026-08-10', code: 0, cost: '221ms', result: '成功', ip: '203.0.113.9', request: '{"begin_date":"2026-08-10"}', response: '{"code":0,"data":[{"orderId":"TS2026..."}]}' },
])

const timeRange = ref<[Date, Date] | null>(null)
const appFilter = ref('')
const svcFilter = ref('')
const resultFilter = ref('')
const kw = ref('')

const filteredLogs = computed(() =>
  logs.value.filter((l) => {
    if (appFilter.value && l.app !== appFilter.value) return false
    if (svcFilter.value && l.service !== svcFilter.value && !l.service.includes(svcFilter.value)) return false
    if (resultFilter.value && l.result !== resultFilter.value) return false
    if (!kw.value) return true
    const k = kw.value.toLowerCase()
    return l.app.toLowerCase().includes(k) || l.param.toLowerCase().includes(k) || l.ip.includes(k)
  }),
)

const detailVisible = ref(false)
const detailLog = ref<CallLog | null>(null)

const openDetail = (row: CallLog) => {
  detailLog.value = row
  detailVisible.value = true
}

const exportLogs = () => ElMessage.success(`已导出 ${filteredLogs.value.length} 条调用日志（CSV/Mock）`)
const exportOne = () => ElMessage.success('该条日志已导出（Mock）')
</script>

<style lang="scss" scoped>
.share-logs-page {
  height: 100%;
  overflow-y: auto;
}

.filter-date {
  width: 300px;
  flex: none;
}

.filter-select-lg {
  width: 170px;
}

.log-param {
  color: #2b6cb0;
  font-size: 12px;
}

.code-ok {
  color: #00a854;
  font-weight: 600;
}

.code-err {
  color: #da251d;
  font-weight: 600;
}

.detail-block-title {
  font-size: 13px;
  font-weight: 700;
  color: #4a4a4a;
  margin: 14px 0 8px;
  padding-left: 8px;
  border-left: 3px solid #da251d;
}

.log-code {
  margin: 0;
  padding: 12px;
  background: #2d2f33;
  color: #d9e0ea;
  border-radius: 6px;
  font-size: 12px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-all;
  max-height: 200px;
  overflow-y: auto;
}

.log-code.code-error {
  color: #f29b9b;
}

.retention-note {
  margin-top: 10px;
  color: #8c8c8c;
  font-size: 12px;
  text-align: right;
}
</style>