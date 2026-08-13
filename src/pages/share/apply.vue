<template>
  <div class="standard-page share-apply-page">
    <div class="apply-stats">
      <div v-for="s in statsCards" :key="s.label" class="apply-stat" :style="{ background: s.bg, color: s.color }">
        <div class="apply-stat-value">{{ s.value }}</div>
        <div class="apply-stat-label">{{ s.label }}</div>
      </div>
    </div>

    <el-row :gutter="16">
      <el-col :span="9">
        <el-card class="panel-card apply-card" shadow="never">
          <template #header>
            <div class="panel-header">
              <span>共享申请列表</span>
              <div class="panel-actions">
                <el-button type="danger" size="small" :icon="Plus" @click="openApply">新建申请</el-button>
              </div>
            </div>
          </template>

          <div class="toolbar-row">
            <el-input v-model="applKeyword" placeholder="按单号 / 资产搜索" clearable class="search-input-sm w-full" :prefix-icon="Search" />
          </div>

          <el-table :data="filteredApplies" size="small" highlight-current-row height="440" @current-change="selectApply">
            <el-table-column prop="id" label="申请单号" width="110" />
            <el-table-column prop="asset" label="申请资产/服务" min-width="140" show-overflow-tooltip />
            <el-table-column label="数据级别" width="64" align="center">
              <template #default="{ row }">
                <span class="security-level" :style="{ background: levelColor[row.level] }">{{ row.level }}</span>
              </template>
            </el-table-column>
            <el-table-column label="状态" width="84">
              <template #default="{ row }">
                <el-tag size="small" :type="stageTag[row.stage]" effect="dark">{{ row.stage }}</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <el-col :span="15">
        <el-card class="panel-card apply-card" shadow="never">
          <template #header>
            <div class="panel-header">
              <span>申请详情与分级审批</span>
              <div class="panel-actions">
                <el-tag v-if="current" size="small" type="info" effect="plain">审批流：{{ flowName }}</el-tag>
              </div>
            </div>
          </template>

          <template v-if="current">
            <el-descriptions :column="2" border size="small">
              <el-descriptions-item label="申请单号">{{ current.id }}</el-descriptions-item>
              <el-descriptions-item label="申请人">{{ current.applicant }}</el-descriptions-item>
              <el-descriptions-item label="申请资产/服务">{{ current.asset }}</el-descriptions-item>
              <el-descriptions-item label="数据分级">
                <span class="security-level" :style="{ background: levelColor[current.level] }">{{ current.level }}</span>
              </el-descriptions-item>
              <el-descriptions-item label="申请使用期限">{{ current.period }}</el-descriptions-item>
              <el-descriptions-item label="申请时间">{{ current.createTime }}</el-descriptions-item>
              <el-descriptions-item label="申请用途" :span="2">{{ current.purpose }}</el-descriptions-item>
            </el-descriptions>

            <div class="block-title">审批流程（按数据级别差异化）</div>
            <el-steps :active="flowIndex" align-center class="flow-steps">
              <el-step v-for="(n, i) in flowNodes" :key="i" :title="n" />
            </el-steps>
            <div v-if="current.stage === '待审批'" class="approve-box">
              <el-form label-width="84px">
                <el-form-item label="审批意见">
                  <el-input v-model="comment" type="textarea" :rows="3" placeholder="填写审批意见（必填）" />
                </el-form-item>
              </el-form>
              <div class="approve-actions">
                <el-button type="danger" :disabled="!comment.trim()" @click="approve(false)">驳回</el-button>
                <el-button type="primary" :disabled="!comment.trim()" @click="approve(true)">审批通过</el-button>
              </div>
            </div>
            <div v-else class="approve-result">
              <el-tag size="small" :type="stageTag[current.stage]" effect="dark">{{ current.stage }}</el-tag>
              <span class="dep-text ml-4">审批人：{{ current.approver || '—' }} · {{ current.approveTime || '—' }}</span>
              <div class="approve-comment">{{ current.comment || '无' }}</div>
            </div>
          </template>

          <el-empty v-else description="请从左侧选择一条共享申请进行审批" />
        </el-card>
      </el-col>
    </el-row>

    <el-dialog v-model="applyVisible" title="新建共享申请" width="540px" destroy-on-close>
      <el-form :model="applyForm" label-width="100px">
        <el-form-item label="申请资产">
          <el-select v-model="applyForm.asset" filterable class="w-full">
            <el-option v-for="a in assetOptions" :key="a" :label="a" :value="a" />
          </el-select>
        </el-form-item>
        <el-form-item label="使用期限">
          <el-select v-model="applyForm.period" class="w-full">
            <el-option label="30 天" value="30 天" />
            <el-option label="90 天" value="90 天" />
            <el-option label="180 天" value="180 天" />
            <el-option label="1 年" value="1 年" />
          </el-select>
        </el-form-item>
        <el-form-item label="申请用途">
          <el-input v-model="applyForm.purpose" type="textarea" :rows="3" placeholder="说明使用目的与数据范围" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="applyVisible = false">取消</el-button>
        <el-button type="danger" @click="submitApply">提交申请</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, Search } from '@element-plus/icons-vue'

const levelColor: Record<string, string> = { L1: '#8c8c8c', L2: '#2B6CB0', L3: '#ED7B2F', L4: '#DA251D' }

const statsCards = [
  { label: '待审批申请', value: '4', color: '#fff', bg: 'linear-gradient(135deg, #DA251D, #B71C1C)' },
  { label: '本月已授权', value: '11', color: '#00A854', bg: 'rgba(0,168,84,.1)' },
  { label: '本月已驳回', value: '3', color: '#8c8c8c', bg: 'rgba(140,140,140,.1)' },
  { label: '审批通过率', value: '78%', color: '#2B6CB0', bg: 'rgba(43,108,176,.1)' },
]

const stageTag: Record<string, 'info' | 'warning' | 'success' | 'danger' | 'primary'> = {
  草稿: 'info',
  待审批: 'warning',
  已通过: 'success',
  已驳回: 'danger',
  已授权: 'primary',
}

type ShareApply = {
  id: string
  asset: string
  level: string
  stage: '草稿' | '待审批' | '已通过' | '已驳回' | '已授权'
  applicant: string
  period: string
  purpose: string
  createTime: string
  approver?: string
  approveTime?: string
  comment?: string
}

const applies = ref<ShareApply[]>([
  { id: 'SH-2026-035', asset: '售票明细查询服务', level: 'L3', stage: '待审批', applicant: '李工', period: '90 天', purpose: '票务异常分析需要售票明细数据', createTime: '2026-08-12 16:20' },
  { id: 'SH-2026-034', asset: 'passenger_info（乘客信息表）', level: 'L4', stage: '待审批', applicant: '王工', period: '30 天', purpose: '乘客服务体验调研', createTime: '2026-08-12 11:05' },
  { id: 'SH-2026-033', asset: 'ads_line_flow（客流指标）', level: 'L2', stage: '待审批', applicant: '赵工', period: '180 天', purpose: '线路运力规划建模', createTime: '2026-08-11 15:40' },
  { id: 'SH-2026-030', asset: 'line_info（线路基础信息）', level: 'L1', stage: '已授权', applicant: '外部合作单位', period: '1 年', purpose: '车站导乘屏展示', createTime: '2026-08-05 09:20', approver: '张工', approveTime: '2026-08-05 14:00', comment: '公开数据，准予共享' },
  { id: 'SH-2026-029', asset: 'payment_record（支付流水）', level: 'L4', stage: '已驳回', applicant: '李工', period: '90 天', purpose: '财务对账', createTime: '2026-08-03 10:10', approver: '安全管理员', approveTime: '2026-08-04 09:30', comment: '涉及敏感支付信息，需补充脱敏方案后重新申请' },
])

const applKeyword = ref('')
const current = ref<ShareApply | null>(null)
const comment = ref('')

const filteredApplies = computed(() =>
  applies.value.filter((a) => {
    if (!applKeyword.value) return true
    const kw = applKeyword.value.toLowerCase()
    return a.id.toLowerCase().includes(kw) || a.asset.toLowerCase().includes(kw)
  }),
)

const flowNodesByLevel: Record<string, string[]> = {
  L1: ['业务审批', '授权生效'],
  L2: ['业务审批', '授权生效'],
  L3: ['业务审批', '安全管理员复核', '授权生效'],
  L4: ['业务审批', '安全管理员复核', '平台管理员终审', '授权生效'],
}

const flowNodes = computed(() => flowNodesByLevel[current.value?.level ?? 'L1'])
const flowIndex = computed(() => {
  const s = current.value?.stage
  if (!s || s === '草稿') return 0
  if (s === '待审批') return 1
  if (s === '已授权') return flowNodes.value.length - 1
  return 1
})
const flowName = computed(() => flowNodes.value.join(' → '))

const selectApply = (row: ShareApply | null) => {
  current.value = row
  comment.value = ''
}

const applyVisible = ref(false)
const applyForm = ref({ asset: '', period: '30 天', purpose: '' })

const assetOptions = ['售票明细查询服务', 'passenger_info（乘客信息表）', 'ads_line_flow（客流指标）', 'payment_record（支付流水）', 'dws_order_report（订单汇总）', '站点设施知识问答']

const openApply = () => {
  applyForm.value = { asset: '', period: '30 天', purpose: '' }
  applyVisible.value = true
}

const submitApply = () => {
  if (!applyForm.value.asset.trim() || !applyForm.value.purpose.trim()) {
    ElMessage.warning('请填写申请资产与用途')
    return
  }
  applies.value.unshift({
    id: `SH-2026-${String(Math.floor(Math.random() * 90) + 10)}`,
    asset: applyForm.value.asset,
    level: applyForm.value.asset.includes('passenger') || applyForm.value.asset.includes('payment') ? 'L4' : 'L3',
    stage: '待审批',
    applicant: '当前用户',
    period: applyForm.value.period,
    purpose: applyForm.value.purpose,
    createTime: new Date().toLocaleString('sv-SE').replace('T', ' '),
  })
  applyVisible.value = false
  ElMessage.success('共享申请已提交，进入分级审批流程（Mock）')
}

const approve = (pass: boolean) => {
  const a = current.value
  if (!a) return
  a.stage = pass ? (a.level === 'L4' ? '待审批' : '已授权') : '已驳回'
  if (pass && a.level === 'L4') {
    ElMessage.warning('L4 级资产需安全管理员与平台管理员两级复核，已流转至下一节点（Mock）')
    return
  }
  a.approver = pass ? '审批管理员' : '审批管理员'
  a.approveTime = new Date().toLocaleString('sv-SE').replace('T', ' ')
  a.comment = comment.value
  ElMessage.success(pass ? `「${a.id}」审批通过，已授权生效` : `「${a.id}」已驳回`)
  comment.value = ''
}
</script>

<style lang="scss" scoped>
.share-apply-page {
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;

  :deep(.el-col) {
    height: 100%;
  }
}

.apply-stats {
  display: flex;
  gap: 12px;
}

.apply-stat {
  flex: 1;
  border-radius: 8px;
  border: 1px solid #edf0f5;
  padding: 12px 14px;
  text-align: center;
}

.apply-stat-value {
  font-size: 22px;
  font-weight: 700;
  line-height: 1.2;
}

.apply-stat-label {
  margin-top: 4px;
  font-size: 12px;
  opacity: 0.9;
}

.apply-card {
  height: calc(100vh - 240px);
  display: flex;
  flex-direction: column;

  :deep(.el-card__body) {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  :deep(.el-table) {
    flex: 1;
    min-height: 0;
  }
}

.block-title {
  font-size: 13px;
  font-weight: 700;
  color: #4a4a4a;
  margin: 16px 0 10px;
  padding-left: 8px;
  border-left: 3px solid #da251d;
}

.flow-steps {
  margin: 10px 0 16px;

  :deep(.el-step__title) {
    font-size: 12px;
  }
}

.approve-box {
  margin-top: 8px;
}

.approve-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.approve-result {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: #fafbfd;
  border-radius: 8px;
  flex-wrap: wrap;
}

.approve-comment {
  width: 100%;
  color: #4a4a4a;
  font-size: 12px;
  line-height: 1.6;
}

.ml-4 {
  margin-left: 4px;
}

.search-input-sm {
  width: 170px;
}
</style>