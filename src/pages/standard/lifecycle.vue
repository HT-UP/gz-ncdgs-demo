<template>
  <div class="standard-page">
    <el-card shadow="never">
      <div class="panel-header">标准生命周期状态机</div>
      <div class="lifecycle-flow">
        <el-steps :active="flowActive" finish-status="success" align-center>
          <el-step v-for="s in flowSteps" :key="s.title" :title="s.title" :description="s.desc" />
        </el-steps>
      </div>
      <div class="flow-legend">
        <span v-for="(s, i) in flowSteps" :key="i" class="flow-legend-item" :class="{ active: i === flowActive }">
          <i :style="{ background: s.color }" />{{ s.title }}
        </span>
      </div>
    </el-card>

    <el-card shadow="never">
      <div class="panel-header">
        标准清单
        <div class="panel-actions">
          <el-input v-model="keyword" placeholder="搜索标准编号 / 名称" clearable class="search-input" />
          <el-button type="primary" plain :disabled="!selected.length" @click="openTrans">状态流转</el-button>
          <el-button type="danger" plain :disabled="!selected.length" @click="openRetire">直接废止</el-button>
        </div>
      </div>
      <el-table :data="filtered" stripe height="360" @selection-change="onSelect">
        <el-table-column type="selection" width="46" />
        <el-table-column prop="code" label="标准编号" width="150" />
        <el-table-column prop="name" label="标准名称" min-width="180" show-overflow-tooltip />
        <el-table-column prop="type" label="类型" width="110" />
        <el-table-column label="当前状态" width="110">
          <template #default="{ row }">
            <el-tag :type="stateTag(row.state)" effect="light">{{ row.state }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态机节点" min-width="220">
          <template #default="{ row }">
            <div class="node-line">
              <span
                v-for="(n, i) in flowSteps"
                :key="n.title"
                class="node-dot"
                :class="{ on: i <= stateIndex(row.state) }"
              ></span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="owner" label="负责人" width="100" />
        <el-table-column prop="updatedAt" label="最近更新" width="120" />
      </el-table>
      <div class="select-hint">已选择 {{ selected.length }} 条标准</div>
    </el-card>

    <el-row :gutter="16" class="lifecycle-bottom">
      <el-col :xs="24" :md="14">
        <el-card shadow="never" class="full-card">
          <div class="panel-header">流转记录</div>
          <el-timeline v-if="history.length">
            <el-timeline-item
              v-for="h in history"
              :key="h.time"
              :timestamp="h.time"
              :type="h.type"
            >
              <div class="tl-line">
                <b>{{ h.action }}</b>
                <span class="tl-extra">【{{ h.standard }}】{{ h.operator }}</span>
              </div>
            </el-timeline-item>
          </el-timeline>
          <el-empty v-else description="暂无流转记录" :image-size="72" />
        </el-card>
      </el-col>
      <el-col :xs="24" :md="10">
        <el-card shadow="never" class="full-card">
          <div class="panel-header">状态统计</div>
          <div class="stat-mini-grid">
            <div v-for="s in stateStats" :key="s.name" class="stat-mini">
              <div class="stat-mini-value" :style="{ color: s.color }">{{ s.count }}</div>
              <div class="stat-mini-label">{{ s.name }}</div>
            </div>
          </div>
          <el-alert
            title="状态流转说明"
            type="info"
            :closable="false"
            show-icon
            description="标准发布后进入在用状态，废止需通过引用检查，废止记录将保留版本快照。"
          />
        </el-card>
      </el-col>
    </el-row>

    <el-dialog v-model="transVisible" title="状态流转" width="480px">
      <el-form label-width="96px">
        <el-form-item label="目标状态">
          <el-select v-model="targetState" placeholder="选择流转目标" class="w-full">
            <el-option v-for="t in targetOptions" :key="t" :label="t" :value="t" />
          </el-select>
        </el-form-item>
        <el-form-item label="审批意见">
          <el-input v-model="transComment" type="textarea" :rows="3" placeholder="请输入审批意见" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="transVisible = false">取消</el-button>
        <el-button type="primary" @click="doTrans">确认流转</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="retireVisible" title="废止确认" width="480px">
      <el-alert
        type="warning"
        :closable="false"
        show-icon
        :title="`将废止 ${selected.length} 条标准，废止后不可再用，是否继续？`"
      />
      <template #footer>
        <el-button @click="retireVisible = false">取消</el-button>
        <el-button type="danger" @click="doRetire">确认废止</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'

type StandardRow = {
  id: number
  code: string
  name: string
  type: string
  state: string
  owner: string
  updatedAt: string
}

const flowSteps = [
  { title: '草稿', desc: '创建编辑', color: '#8c8c8c' },
  { title: '待审核', desc: '提交审批', color: '#ed7b2f' },
  { title: '已发布', desc: '在用有效', color: '#00a854' },
  { title: '已废止', desc: '归档停用', color: '#e34d59' },
]

const rows: StandardRow[] = [
  { id: 1, code: 'STD-KG-001', name: '城市轨道交通数据元_线路基础信息', type: '数据元', state: '已发布', owner: '王工', updatedAt: '2026-05-12' },
  { id: 2, code: 'STD-KG-002', name: '车站编码规范_V2.1', type: '编码', state: '待审核', owner: '李工', updatedAt: '2026-05-14' },
  { id: 3, code: 'STD-KG-003', name: '列车运行日志数据规范', type: '数据元', state: '草稿', owner: '赵工', updatedAt: '2026-05-15' },
  { id: 4, code: 'STD-KG-004', name: '客流断面统计指标', type: '指标', state: '已发布', owner: '钱工', updatedAt: '2026-05-08' },
  { id: 5, code: 'STD-KG-005', name: '安全事件上报编码', type: '编码', state: '已废止', owner: '孙工', updatedAt: '2026-04-28' },
  { id: 6, code: 'STD-KG-006', name: '票务清分规则数据元', type: '数据元', state: '待审核', owner: '周工', updatedAt: '2026-05-16' },
  { id: 7, code: 'STD-KG-007', name: '信号系统接口数据规范', type: '数据元', state: '已发布', owner: '吴工', updatedAt: '2026-05-11' },
  { id: 8, code: 'STD-KG-008', name: '运营统计周期编码', type: '编码', state: '草稿', owner: '郑工', updatedAt: '2026-05-17' },
]

const keyword = ref('')
const selected = ref<StandardRow[]>([])
const transVisible = ref(false)
const retireVisible = ref(false)
const targetState = ref('')
const transComment = ref('')
const flowActive = 2
const history = ref([
  { time: '2026-05-16 10:24', action: '提交审核', standard: 'STD-KG-006', operator: '周工', type: 'primary' },
  { time: '2026-05-15 16:02', action: '创建草稿', standard: 'STD-KG-003', operator: '赵工', type: 'info' },
  { time: '2026-05-12 09:41', action: '审核通过并发布', standard: 'STD-KG-001', operator: '王工', type: 'success' },
  { time: '2026-05-08 14:18', action: '废止执行', standard: 'STD-KG-005', operator: '孙工', type: 'danger' },
])

const filtered = computed(() =>
  rows.filter((r) => !keyword.value || r.name.includes(keyword.value) || r.code.includes(keyword.value)),
)

const stateStats = computed(() => [
  { name: '草稿', count: rows.filter((r) => r.state === '草稿').length, color: '#8c8c8c' },
  { name: '待审核', count: rows.filter((r) => r.state === '待审核').length, color: '#ed7b2f' },
  { name: '已发布', count: rows.filter((r) => r.state === '已发布').length, color: '#00a854' },
  { name: '已废止', count: rows.filter((r) => r.state === '已废止').length, color: '#e34d59' },
])

function stateTag(s: string) {
  return { 草稿: 'info', 待审核: 'warning', 已发布: 'success', 已废止: 'danger' }[s] as 'info' | 'warning' | 'success' | 'danger'
}

function stateIndex(s: string) {
  return flowSteps.findIndex((f) => f.title === s)
}

const targetOptions = computed(() => {
  const current = selected.value[0]?.state
  if (!current) return []
  const map: Record<string, string[]> = {
    草稿: ['待审核'],
    待审核: ['已发布'],
    已发布: ['待审核', '已废止'],
    已废止: ['已发布'],
  }
  return map[current] ?? []
})

function onSelect(sel: StandardRow[]) {
  selected.value = sel
  targetState.value = ''
}

function openTrans() {
  if (!selected.value.length) return
  targetState.value = targetOptions.value[0] ?? ''
  transVisible.value = true
}

function doTrans() {
  if (!targetState.value) {
    ElMessage.warning('请选择目标状态')
    return
  }
  ElMessage.success(`已将 ${selected.value.length} 条标准流转至「${targetState.value}」`)
  transVisible.value = false
}

function openRetire() {
  retireVisible.value = true
}

function doRetire() {
  ElMessage.success(`已废止 ${selected.value.length} 条标准`)
  retireVisible.value = false
}
</script>

<style scoped>
.lifecycle-flow {
  padding: 10px 4px 6px;
}

.flow-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  padding-top: 10px;
  border-top: 1px solid #edf0f5;
}

.flow-legend-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #8c8c8c;
}

.flow-legend-item i {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
}

.flow-legend-item.active {
  color: #4a4a4a;
  font-weight: 600;
}

.node-line {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 100%;
}

.node-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #e4e7ed;
  position: relative;
}

.node-dot.on {
  background: #da251d;
}

.node-dot.on::after {
  content: '';
  position: absolute;
  left: 18px;
  top: 6px;
  width: 10px;
  height: 2px;
  background: #da251d;
}

.node-dot:last-child.on::after {
  display: none;
}

.select-hint {
  margin-top: 10px;
  color: #8c8c8c;
  font-size: 12px;
}

.lifecycle-bottom {
  margin-top: 16px;
}

.full-card {
  height: 100%;
}

.tl-line {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  font-size: 13px;
}

.tl-extra {
  color: #8c8c8c;
  font-size: 12px;
}

.stat-mini-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
  gap: 10px;
  margin-bottom: 14px;
}

.stat-mini {
  padding: 12px 8px;
  text-align: center;
  border: 1px solid #edf0f5;
  border-radius: 8px;
}

.stat-mini-value {
  font-size: 22px;
  font-weight: 700;
}

.stat-mini-label {
  margin-top: 2px;
  color: #8c8c8c;
  font-size: 12px;
}
</style>
