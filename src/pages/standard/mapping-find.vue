<template>
  <div class="standard-page">
    <el-card shadow="never">
      <div class="panel-header">映射发现任务</div>
      <div class="map-toolbar">
        <el-select v-model="scope" style="width: 200px">
          <el-option label="全部数据库" value="all" />
          <el-option label="运营库（ODS）" value="ods" />
          <el-option label="数仓 DWD 层" value="dwd" />
          <el-option label="数仓 DWS 层" value="dws" />
        </el-select>
        <el-button type="primary" plain><el-icon class="act-icon"><MagicStick /></el-icon>开始自动发现</el-button>
      </div>
      <el-alert
        class="mt-12"
        type="info"
        :closable="false"
        show-icon
        title="四维匹配算法"
        description="名称匹配 40% + 数据类型匹配 20% + 值域匹配 20% + 语义匹配 20%，综合得分 ≥ 85 自动建议映射，60~85 需人工确认，＜60 建议忽略。"
      />
    </el-card>

    <el-row :gutter="16">
      <el-col v-for="s in stats" :key="s.label" :xs="12" :md="6">
        <el-card shadow="never" class="mstat-card">
          <div class="mstat-value" :style="{ color: s.color }">{{ s.value }}</div>
          <div class="mstat-label">{{ s.label }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-card shadow="never">
      <div class="panel-header">
        匹配结果（{{ filtered.length }}）
        <div class="panel-actions">
          <el-select v-model="statusFilter" clearable placeholder="按状态筛选" style="width: 140px">
            <el-option label="建议映射" value="建议映射" />
            <el-option label="待确认" value="待确认" />
            <el-option label="已确认" value="已确认" />
            <el-option label="已忽略" value="已忽略" />
          </el-select>
          <el-button type="primary" :disabled="!pendingCount">批量确认推荐</el-button>
        </div>
      </div>
      <el-table :data="filtered" stripe height="420">
        <el-table-column prop="source" label="来源字段" min-width="200" show-overflow-tooltip />
        <el-table-column prop="fieldType" label="字段类型" width="110" />
        <el-table-column prop="candidate" label="候选数据元" min-width="200" show-overflow-tooltip />
        <el-table-column label="维度得分" min-width="240">
          <template #default="{ row }">
            <div class="dim-scores">
              <span class="dim-item" :class="{ good: row.dim.name >= 60 }" title="名称匹配 40%">名 {{ row.dim.name }}</span>
              <span class="dim-item" :class="{ good: row.dim.type >= 60 }" title="类型匹配 20%">型 {{ row.dim.type }}</span>
              <span class="dim-item" :class="{ good: row.dim.range >= 60 }" title="值域匹配 20%">域 {{ row.dim.range }}</span>
              <span class="dim-item" :class="{ good: row.dim.semantic >= 60 }" title="语义匹配 20%">义 {{ row.dim.semantic }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="综合得分" width="140">
          <template #default="{ row }">
            <div class="score-cell">
              <span class="score-num">{{ row.score }}</span>
              <el-progress :percentage="row.score" :color="scoreColor(row.score)" :show-text="false" :stroke-width="6" />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="置信度" width="90">
          <template #default="{ row }">
            <el-tag :type="row.confidence === '高' ? 'success' : row.confidence === '中' ? 'warning' : 'info'" size="small">
              {{ row.confidence }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <span :class="statusClass(row.status)">{{ row.status }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <template v-if="row.status === '建议映射'">
              <el-button link type="primary" size="small" @click="confirm(row)">确认</el-button>
              <el-button link type="info" size="small" @click="ignore(row)">忽略</el-button>
            </template>
            <span v-else class="op-done">已处理</span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'

type MatchRow = {
  id: number
  source: string
  fieldType: string
  candidate: string
  dim: { name: number; type: number; range: number; semantic: number }
  score: number
  confidence: string
  status: string
}

const scope = ref('all')
const statusFilter = ref('')

const records: MatchRow[] = [
  { id: 1, source: 'ODS.inbound_auth.entry_station_code', fieldType: 'VARCHAR(8)', candidate: '乘车站编码', dim: { name: 92, type: 85, range: 90, semantic: 88 }, score: 90, confidence: '高', status: '建议映射' },
  { id: 2, source: 'ODS.inbound_auth.entry_datetime', fieldType: 'DATETIME', candidate: '乘车日期时间', dim: { name: 88, type: 95, range: 80, semantic: 90 }, score: 87, confidence: '高', status: '建议映射' },
  { id: 3, source: 'DWD.fare_settle.amount', fieldType: 'DECIMAL(10,2)', candidate: '清分金额', dim: { name: 90, type: 92, range: 85, semantic: 86 }, score: 89, confidence: '高', status: '建议映射' },
  { id: 4, source: 'DWD.fare_settle.set_type', fieldType: 'VARCHAR(16)', candidate: '结算类型编码', dim: { name: 72, type: 80, range: 74, semantic: 60 }, score: 72, confidence: '中', status: '待确认' },
  { id: 5, source: 'ODS.train_run.power_usage', fieldType: 'DECIMAL(12,2)', candidate: '用电能耗', dim: { name: 78, type: 90, range: 66, semantic: 70 }, score: 76, confidence: '中', status: '待确认' },
  { id: 6, source: 'DWS.passenger_flow.max_flow', fieldType: 'INT', candidate: '断面客流量', dim: { name: 95, type: 98, range: 82, semantic: 92 }, score: 94, confidence: '高', status: '已确认' },
  { id: 7, source: 'ODS.asset.device_status', fieldType: 'VARCHAR(4)', candidate: '设备状态码', dim: { name: 44, type: 50, range: 40, semantic: 38 }, score: 44, confidence: '低', status: '已忽略' },
  { id: 8, source: 'DWS.train_punctual.rate', fieldType: 'DECIMAL(5,2)', candidate: '列车准点率', dim: { name: 91, type: 88, range: 90, semantic: 89 }, score: 90, confidence: '高', status: '建议映射' },
]

const stats = computed(() => {
  const total = records.length
  const suggested = records.filter((r) => r.status === '建议映射').length
  const confirmed = records.filter((r) => r.status === '已确认').length
  return [
    { label: '待校验字段', value: total, color: '#4a4a4a' },
    { label: '自动建议映射', value: suggested, color: '#da251d' },
    { label: '人工已确认', value: confirmed, color: '#00a854' },
    { label: '推荐覆盖率', value: `${Math.round((suggested / total) * 100)}%`, color: '#2b6cb0' },
  ]
})

const filtered = computed(() =>
  records.filter((r) => !statusFilter.value || r.status === statusFilter.value),
)

const pendingCount = computed(() => records.filter((r) => r.status === '建议映射').length)

function scoreColor(s: number) {
  return s >= 85 ? '#00a854' : s >= 60 ? '#ed7b2f' : '#e34d59'
}

function statusClass(s: string) {
  return { 建议映射: 'st-suggest', 待确认: 'st-wait', 已确认: 'st-done', 已忽略: 'st-ignored' }[s] || ''
}

function confirm(row: MatchRow) {
  row.status = '已确认'
  ElMessage.success(`已确认映射：${row.source} → ${row.candidate}`)
}

function ignore(row: MatchRow) {
  row.status = '已忽略'
  ElMessage.info(`已忽略：${row.source}`)
}
</script>

<style scoped>
.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.map-toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 10px 0 4px;
}

.act-icon {
  margin-right: 4px;
}

.mt-12 {
  margin-top: 12px;
}

.mstat-card :deep(.el-card__body) {
  padding: 16px 20px;
}

.mstat-value {
  font-size: 28px;
  font-weight: 700;
}

.mstat-label {
  margin-top: 2px;
  color: #8c8c8c;
  font-size: 12px;
}

.dim-scores {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.dim-item {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 6px;
  background: #f0f2f5;
  color: #8c8c8c;
  font-size: 12px;
}

.dim-item.good {
  background: rgba(0, 168, 84, 0.1);
  color: #00a854;
}

.score-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.score-num {
  width: 34px;
  flex: none;
  font-weight: 700;
  color: #4a4a4a;
  font-size: 13px;
}

.st-suggest {
  color: #d9641a;
  font-weight: 600;
}

.st-wait {
  color: #ed7b2f;
}

.st-done {
  color: #00a854;
}

.st-ignored {
  color: #8c8c8c;
}

.op-done {
  color: #c0c4cc;
  font-size: 12px;
}
</style>