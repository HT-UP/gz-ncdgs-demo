<template>
  <div class="standard-page impact-page">
    <el-row :gutter="16">
      <el-col :span="6">
        <el-card class="panel-card impact-left" shadow="never">
          <template #header>
            <div class="panel-header">
              <span>数据模型</span>
              <div class="panel-actions">
                <el-tag size="small" type="info" effect="plain">{{ models.length }} 个</el-tag>
              </div>
            </div>
          </template>
          <el-input v-model="modelKeyword" placeholder="搜索模型" clearable size="small" class="mb-12 w-full" :prefix-icon="Search" />
          <div class="model-list">
            <div
              v-for="m in filteredModels"
              :key="m.id"
              class="model-item"
              :class="{ 'is-active': activeModelId === m.id }"
              @click="selectModel(m)"
            >
              <div class="model-item-head">
                <span class="model-item-name">{{ m.name }}</span>
                <span class="model-item-tables">{{ m.tables }} 表</span>
              </div>
              <div class="model-item-meta">{{ m.dom }} · 最近变更 {{ m.lastChange }}</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="18">
        <el-card class="panel-card" shadow="never">
          <template #header>
            <div class="panel-header">
              <span>模型影响分析{{ activeModel ? ` — ${activeModel.name}` : '' }}</span>
              <div class="panel-actions">
                <el-button size="small" type="danger" plain :icon="DataAnalysis" :disabled="!activeModel" @click="runAnalysis">自动分析影响</el-button>
                <el-button size="small" plain :icon="Notification" :disabled="!analysisDone" @click="notifyOwners">通知责任人</el-button>
              </div>
            </div>
          </template>

          <template v-if="activeModel">
            <el-form inline size="small" class="change-form">
              <el-form-item label="变更类型">
                <el-select v-model="changeType" class="wf-160">
                  <el-option v-for="c in changeTypes" :key="c" :label="c" :value="c" />
                </el-select>
              </el-form-item>
              <el-form-item label="变更对象">
                <el-select v-model="changeObject" filterable default-first-option class="wf-160">
                  <el-option v-for="c in changeObjects" :key="c" :label="c" :value="c" />
                </el-select>
              </el-form-item>
              <el-form-item label="变更内容">
                <el-input v-model="changeDesc" placeholder="如：新增字段 passenger_phone" class="wf-240" />
              </el-form-item>
            </el-form>

            <div v-if="analysisDone" class="impact-summary">
              <div class="impact-summary-item">
                <div class="impact-summary-num" style="color: #da251d">{{ impactTotal }}</div>
                <div class="impact-summary-label">影响对象总数</div>
              </div>
              <div class="impact-summary-item">
                <div class="impact-summary-num" style="color: #e34d59">{{ impactCountByLevel['高'] }}</div>
                <div class="impact-summary-label">高影响（阻断性）</div>
              </div>
              <div class="impact-summary-item">
                <div class="impact-summary-num" style="color: #ed7b2f">{{ impactCountByLevel['中'] }}</div>
                <div class="impact-summary-label">中影响（风险性）</div>
              </div>
              <div class="impact-summary-item">
                <div class="impact-summary-num" style="color: #2b6cb0">{{ impactCountByLevel['低'] }}</div>
                <div class="impact-summary-label">低影响（提示性）</div>
              </div>
            </div>

            <el-tabs v-if="analysisDone" v-model="impactTab" class="impact-tabs">
              <el-tab-pane :label="`表（${impactByType['表'].length}）`" name="表">
                <el-table :data="impactByType['表']" size="small" stripe>
                  <el-table-column prop="name" label="受影响表" min-width="170" />
                  <el-table-column prop="owner" label="表责任人" width="90" />
                  <el-table-column label="影响等级" width="80">
                    <template #default="{ row }">
                      <el-tag size="small" :type="levelTag[row.level]" effect="dark">{{ row.level }}</el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column label="影响路径" min-width="200" show-overflow-tooltip>
                    <template #default="{ row }">{{ row.path }}</template>
                  </el-table-column>
                  <el-table-column label="影响说明" min-width="200" show-overflow-tooltip>
                    <template #default="{ row }">{{ row.desc }}</template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane :label="`任务（${impactByType['任务'].length}）`" name="任务">
                <el-table :data="impactByType['任务']" size="small" stripe>
                  <el-table-column prop="name" label="受影响任务" min-width="180" />
                  <el-table-column prop="owner" label="任务责任人" width="90" />
                  <el-table-column label="影响等级" width="80">
                    <template #default="{ row }">
                      <el-tag size="small" :type="levelTag[row.level]" effect="dark">{{ row.level }}</el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column prop="path" label="影响路径" min-width="200" show-overflow-tooltip />
                  <el-table-column prop="desc" label="影响说明" min-width="200" show-overflow-tooltip />
                </el-table>
              </el-tab-pane>
              <el-tab-pane :label="`服务（${impactByType['服务'].length}）`" name="服务">
                <el-table :data="impactByType['服务']" size="small" stripe>
                  <el-table-column prop="name" label="受影响服务" min-width="180" />
                  <el-table-column prop="owner" label="服务负责人" width="90" />
                  <el-table-column label="影响等级" width="80">
                    <template #default="{ row }">
                      <el-tag size="small" :type="levelTag[row.level]" effect="dark">{{ row.level }}</el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column prop="path" label="调用路径" min-width="180" show-overflow-tooltip />
                  <el-table-column prop="desc" label="影响说明" min-width="200" show-overflow-tooltip />
                </el-table>
              </el-tab-pane>
              <el-tab-pane :label="`报表（${impactByType['报表'].length}）`" name="报表">
                <el-table :data="impactByType['报表']" size="small" stripe>
                  <el-table-column prop="name" label="受影响报表" min-width="180" />
                  <el-table-column prop="owner" label="报表责任人" width="90" />
                  <el-table-column label="影响等级" width="80">
                    <template #default="{ row }">
                      <el-tag size="small" :type="levelTag[row.level]" effect="dark">{{ row.level }}</el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column prop="path" label="引用位置" min-width="180" show-overflow-tooltip />
                  <el-table-column prop="desc" label="影响说明" min-width="200" show-overflow-tooltip />
                </el-table>
              </el-tab-pane>
              <el-tab-pane :label="`标准映射（${impactByType['标准映射'].length}）`" name="标准映射">
                <el-table :data="impactByType['标准映射']" size="small" stripe>
                  <el-table-column prop="name" label="关联标准" min-width="180" />
                  <el-table-column prop="owner" label="标准责任人" width="90" />
                  <el-table-column label="影响等级" width="80">
                    <template #default="{ row }">
                      <el-tag size="small" :type="levelTag[row.level]" effect="dark">{{ row.level }}</el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column prop="path" label="映射关系" min-width="200" show-overflow-tooltip />
                  <el-table-column prop="desc" label="影响说明" min-width="200" show-overflow-tooltip />
                </el-table>
              </el-tab-pane>
            </el-tabs>

            <el-empty v-else description="选择模型并配置变更内容后，点击「自动分析影响」计算下游影响对象" />
          </template>

          <el-empty v-else description="请从左侧选择需要分析的数据模型" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { DataAnalysis, Notification, Search } from '@element-plus/icons-vue'

type DModel = {
  id: number
  name: string
  dom: string
  tables: number
  lastChange: string
}

const models = ref<DModel[]>([
  { id: 1, name: '票务运营域逻辑模型', dom: '客运票务', tables: 56, lastChange: '2026-08-10' },
  { id: 2, name: '旅客服务域逻辑模型', dom: '旅客服务', tables: 38, lastChange: '2026-08-05' },
  { id: 3, name: '设备运维域物理模型', dom: '设备运维', tables: 64, lastChange: '2026-07-30' },
  { id: 4, name: '财务共享域逻辑模型', dom: '财务共享', tables: 42, lastChange: '2026-07-22' },
  { id: 5, name: '调度指挥域物理模型', dom: '运营调度', tables: 47, lastChange: '2026-07-15' },
])

const modelKeyword = ref('')
const filteredModels = computed(() =>
  models.value.filter((m) => (modelKeyword.value ? m.name.includes(modelKeyword.value) : true)),
)

const activeModelId = ref<number | null>(null)
const activeModel = computed(() => models.value.find((m) => m.id === activeModelId.value) ?? null)

const selectModel = (m: DModel) => {
  activeModelId.value = m.id
  analysisDone.value = false
  result.value = []
}

const changeTypes = ['新增字段', '删除字段', '修改字段类型', '修改字段长度', '新增索引', '表重命名', '字段改名']
const changeType = ref('修改字段类型')
const changeObjects = ref([] as string[])
const changeDesc = ref('')

const changeObjectsMap: Record<string, string[]> = {
  '票务运营域逻辑模型': ['ticket_sale.sale_time', 'ticket_sale.amount', 'dws_ticket_daily.line_code', 'ads_flow_stat.total_passengers'],
  '旅客服务域逻辑模型': ['passenger_info.phone', 'passenger_info.name', 'station_service_feedback.score'],
  '设备运维域物理模型': ['device_health.temperature', 'device_fault.code'],
  '财务共享域逻辑模型': ['finance_order.amount', 'finance_pay.status'],
  '调度指挥域物理模型': ['train_plan.departure_time'],
}

const applyChangeObjects = () => {
  changeObjects.value = changeObjectsMap[activeModel.value?.name ?? ''] ?? []
  const obj = changeObjects.value[0]
  changeObject.value = obj ?? ''
  changeDesc.value = obj ? `将字段 ${obj} 的类型由 VARCHAR(32) 调整为 VARCHAR(64)` : ''
}

const changeObject = ref('')

type ImpactItem = {
  type: string
  name: string
  owner: string
  level: '高' | '中' | '低'
  path: string
  desc: string
}

const result = ref<ImpactItem[]>([])
const analysisDone = ref(false)
const impactTab = ref('表')

const levelTag: Record<string, 'danger' | 'warning' | 'info'> = { 高: 'danger', 中: 'warning', 低: 'info' }

const sampleImpacts: ImpactItem[] = [
  { type: '表', name: 'dws_ticket_daily', owner: '李工', level: '高', path: 'ticket_sale.amount → dws_ticket_daily.amount', desc: '上游字段类型变更，需同步调整字段类型，否则任务将失败' },
  { type: '表', name: 'ads_flow_stat', owner: '张工', level: '高', path: 'dws_ticket_daily.amount → ads_flow_stat.total_amount', desc: '依赖上游聚合字段，变更需评估重算量' },
  { type: '表', name: 'rpt_ticket_monthly', owner: '王工', level: '中', path: '取自 ads_flow_stat', desc: '月报引用上游结果，需验证数据口径' },
  { type: '任务', name: '离线-票务日汇总 DWS 加工', owner: '李工', level: '高', path: '读取 ticket_sale.amount', desc: '字段类型变化可能导致数据转换异常' },
  { type: '任务', name: '实时-售票金额告警流', owner: '赵工', level: '中', path: '消费 ticket_sale 变更事件', desc: '下游实时任务需同步更新字段映射' },
  { type: '任务', name: '补数任务-历史重灌', owner: '赵工', level: '低', path: '主动重算历史分区', desc: '变更后需安排历史数据重算' },
  { type: '服务', name: '客流统计查询服务', owner: '张工', level: '高', path: '/api/v1/flow/stat', desc: '接口出参依赖 total_amount，影响 SLA' },
  { type: '服务', name: '订单汇总指标服务', owner: '张工', level: '中', path: '/api/v1/order/summary', desc: '出参映射需要同步调整' },
  { type: '报表', name: '月度客流运营分析报表', owner: '王工', level: '中', path: 'BI 数据集引用 ads_flow_stat', desc: '报表字段需同步刷新' },
  { type: '报表', name: '票务稽核日报', owner: '王工', level: '低', path: '直连 dws_ticket_daily', desc: '不影响统计口径，仅建议验证' },
  { type: '标准映射', name: 'GB/T 金额类数据元（amount_amt）', owner: '标准管理员', level: '高', path: 'ticket_sale.amount 映射数据元', desc: '字段类型变更违反标准映射约束' },
  { type: '标准映射', name: '数据分级映射（L3 敏感）', owner: '标准管理员', level: '低', path: '金额字段分级不变', desc: '无影响' },
]

const runAnalysis = () => {
  if (!activeModel.value) return
  if (!changeDesc.value.trim()) {
    ElMessage.warning('请填写变更内容说明')
    return
  }
  result.value = sampleImpacts.map((i) => ({ ...i }))
  analysisDone.value = true
  impactTab.value = '表'
  ElMessage.success(`已自动计算下游影响对象：${result.value.length} 个（表/任务/服务/报表/标准映射）`)
}

const impactTotal = computed(() => result.value.length)
const impactCountByLevel = computed(() => {
  const count: Record<string, number> = { 高: 0, 中: 0, 低: 0 }
  result.value.forEach((i) => (count[i.level] += 1))
  return count
})
const impactByType = computed(() => {
  const grouped: Record<string, ImpactItem[]> = { 表: [], 任务: [], 服务: [], 报表: [], 标准映射: [] }
  result.value.forEach((i) => {
    if (grouped[i.type]) grouped[i.type].push(i)
  })
  return grouped
})

const notifyOwners = () => {
  const owners = Array.from(new Set(result.value.map((i) => i.owner)))
  ElMessage.success(`已通过站内信+邮件通知 ${owners.length} 位责任人（${owners.join('、')}）`)
}

watch(() => activeModel.value?.name, () => {
  if (activeModel.value) applyChangeObjects()
})
</script>

<style lang="scss" scoped>
.impact-page {
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;

  :deep(.el-col) {
    height: 100%;
  }
}

.impact-left {
  height: calc(100vh - 170px);
  :deep(.el-card__body) {
    display: flex;
    flex-direction: column;
  }
}

.mb-12 {
  margin-bottom: 12px;
}

.model-list {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  display: grid;
  gap: 8px;
}

.model-item {
  padding: 10px 12px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  cursor: pointer;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:hover,
  &.is-active {
    border-color: #da251d;
    box-shadow: 0 4px 12px rgba(218, 37, 29, 0.1);
  }
}

.model-item-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.model-item-name {
  font-size: 13px;
  font-weight: 600;
  color: #4a4a4a;
}

.model-item-tables {
  font-size: 11px;
  color: #da251d;
  background: rgba(218, 37, 29, 0.06);
  border-radius: 8px;
  padding: 1px 8px;
}

.model-item-meta {
  margin-top: 4px;
  color: #8c8c8c;
  font-size: 11px;
}

.change-form {
  margin-bottom: 4px;

  :deep(.el-form-item) {
    margin-bottom: 8px;
  }
}

.wf-160 {
  width: 160px;
}

.wf-240 {
  width: 240px;
}

.impact-summary {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin: 6px 0 14px;
}

.impact-summary-item {
  padding: 10px 0;
  text-align: center;
  background: #fafbfd;
  border: 1px solid #edf0f5;
  border-radius: 8px;
}

.impact-summary-num {
  font-size: 24px;
  font-weight: 700;
  line-height: 1.2;
}

.impact-summary-label {
  margin-top: 2px;
  color: #8c8c8c;
  font-size: 12px;
}

.impact-tabs {
  :deep(.el-tabs__item) {
    font-weight: 600;
  }
}
</style>