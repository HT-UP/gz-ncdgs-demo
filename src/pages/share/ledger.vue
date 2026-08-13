<template>
  <div class="standard-page share-ledger-page">
    <div class="ledger-stats">
      <div v-for="s in statsCards" :key="s.label" class="ledger-stat" :style="{ background: s.bg, color: s.color }">
        <div class="ledger-stat-value">{{ s.value }}</div>
        <div class="ledger-stat-label">{{ s.label }}</div>
      </div>
    </div>

    <el-card class="panel-card" shadow="never">
      <template #header>
        <div class="panel-header">
          <span>共享授权台账</span>
          <div class="panel-actions">
            <el-button size="small" type="primary" plain :icon="Search" @click="runAudit">合规审计扫描</el-button>
            <el-button size="small" type="danger" plain :icon="Download" @click="exportLedger">导出台账</el-button>
          </div>
        </div>
      </template>

      <div class="toolbar-row">
        <el-input v-model="ledgerKeyword" placeholder="按授权编号 / 资产 / 使用方搜索" clearable class="search-input" :prefix-icon="Search" />
        <el-select v-model="statusFilter" placeholder="状态" clearable class="filter-select">
          <el-option v-for="s in ['有效', '即将到期', '已到期', '已回收']" :key="s" :label="s" :value="s" />
        </el-select>
        <el-select v-model="levelFilter" placeholder="数据级别" clearable class="filter-select">
          <el-option v-for="l in ['L1', 'L2', 'L3', 'L4']" :key="l" :label="l" :value="l" />
        </el-select>
      </div>

      <el-table :data="filteredLedger" size="small" stripe class="mt-12">
        <el-table-column prop="authNo" label="授权编号" width="110" />
        <el-table-column prop="applyNo" label="申请单号" width="110" />
        <el-table-column prop="asset" label="共享资产/服务" min-width="170" show-overflow-tooltip />
        <el-table-column prop="consumer" label="使用方" min-width="120" show-overflow-tooltip />
        <el-table-column label="级别" width="60" align="center">
          <template #default="{ row }">
            <span class="security-level" :style="{ background: levelColor[row.level] }">{{ row.level }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="grantTime" label="授权时间" width="96" />
        <el-table-column prop="expireTime" label="到期时间" width="96" />
        <el-table-column label="状态" width="84">
          <template #default="{ row }">
            <el-tag size="small" :type="statusTag[row.status]" effect="dark">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button v-if="row.status === '有效'" link type="warning" size="small" @click="renew(row)">续期</el-button>
            <el-button v-if="row.status === '有效' || row.status === '即将到期'" link type="danger" size="small" @click="recycle(row)">回收</el-button>
            <el-button link type="info" size="small" @click="viewAudit(row)">审计</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pager">
        <el-pagination background layout="total, prev, pager, next" :total="filteredLedger.length" :page-size="10" />
      </div>
    </el-card>

    <el-dialog v-model="auditVisible" title="授权台账合规审计" width="620px">
      <el-alert type="success" :closable="false" show-icon class="mb-12">
        <template #title>审计扫描完成：共核查 {{ records.length }} 条授权记录，发现 2 项关注项、0 项违规。</template>
      </el-alert>
      <el-table :data="auditResults" size="small" border>
        <el-table-column prop="authNo" label="授权编号" width="110" />
        <el-table-column prop="item" label="核查项" min-width="180" />
        <el-table-column label="结论" width="80" align="center">
          <template #default="{ row }">
            <el-tag size="small" :type="row.conclusion === '合规' ? 'success' : 'warning'" effect="dark">{{ row.conclusion }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="note" label="说明" min-width="150" />
      </el-table>
      <template #footer>
        <el-button type="primary" plain @click="auditVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Download, Search } from '@element-plus/icons-vue'

const levelColor: Record<string, string> = { L1: '#8c8c8c', L2: '#2B6CB0', L3: '#ED7B2F', L4: '#DA251D' }

const statsCards = [
  { label: '有效授权', value: '18', color: '#fff', bg: 'linear-gradient(135deg, #DA251D, #B71C1C)' },
  { label: '即将到期(≤30天)', value: '3', color: '#ED7B2F', bg: 'rgba(237,123,47,.1)' },
  { label: '已回收/已到期', value: '7', color: '#8c8c8c', bg: 'rgba(140,140,140,.1)' },
  { label: '审计通过率', value: '96.8%', color: '#00A854', bg: 'rgba(0,168,84,.1)' },
]

const statusTag: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
  有效: 'success',
  即将到期: 'warning',
  已到期: 'danger',
  已回收: 'info',
}

type Ledger = {
  authNo: string
  applyNo: string
  asset: string
  consumer: string
  level: string
  grantTime: string
  expireTime: string
  status: '有效' | '即将到期' | '已到期' | '已回收'
}

const records = ref<Ledger[]>([
  { authNo: 'AUTH-2026-052', applyNo: 'SH-2026-030', asset: 'line_info（线路基础信息）', consumer: '外部合作单位', level: 'L1', grantTime: '2026-08-05', expireTime: '2027-08-04', status: '有效' },
  { authNo: 'AUTH-2026-048', applyNo: 'SH-2026-027', asset: 'ads_line_flow（客流指标）', consumer: '线网规划仿真系统', level: 'L2', grantTime: '2026-07-20', expireTime: '2026-10-18', status: '有效' },
  { authNo: 'AUTH-2026-041', applyNo: 'SH-2026-022', asset: 'dws_order_report（订单汇总）', consumer: '智能客流分析平台', level: 'L2', grantTime: '2026-07-10', expireTime: '2026-09-08', status: '即将到期' },
  { authNo: 'AUTH-2026-036', applyNo: 'SH-2026-018', asset: 'station_info（车站信息）', consumer: '车站大屏展示端', level: 'L1', grantTime: '2026-06-28', expireTime: '2026-08-27', status: '即将到期' },
  { authNo: 'AUTH-2026-030', applyNo: 'SH-2026-014', asset: 'ticket_sale（售票明细）', consumer: '科研合作项目组', level: 'L3', grantTime: '2026-06-15', expireTime: '2026-07-14', status: '已到期' },
  { authNo: 'AUTH-2026-022', applyNo: 'SH-2026-009', asset: 'payment_record（支付流水）', consumer: '财务共享中心', level: 'L4', grantTime: '2026-05-20', expireTime: '2026-06-19', status: '已回收' },
])

const ledgerKeyword = ref('')
const statusFilter = ref('')
const levelFilter = ref('')

const filteredLedger = computed(() =>
  records.value.filter((r) => {
    if (statusFilter.value && r.status !== statusFilter.value) return false
    if (levelFilter.value && r.level !== levelFilter.value) return false
    if (!ledgerKeyword.value) return true
    const kw = ledgerKeyword.value.toLowerCase()
    return r.authNo.toLowerCase().includes(kw) || r.asset.toLowerCase().includes(kw) || r.consumer.toLowerCase().includes(kw)
  }),
)

const renewalWindow = (row: Ledger) => {
  const days = Math.max(0, Math.ceil((new Date(row.expireTime).getTime() - Date.now()) / 86400000))
  return days
}

const renew = (row: Ledger) => {
  ElMessageBox.confirm(`确认将「${row.asset}」授权续期 90 天？（当前剩余 ${renewalWindow(row)} 天 / Mock）`, '续期确认', { type: 'info' })
    .then(() => {
      const d = new Date()
      d.setDate(d.getDate() + 90)
      row.expireTime = d.toLocaleDateString('sv-SE')
      row.status = '有效'
      ElMessage.success('授权已续期 90 天（Mock）')
    })
    .catch(() => {})
}

const recycle = (row: Ledger) => {
  ElMessageBox.confirm(`确认回收「${row.asset}」对「${row.consumer}」的授权？回收后调用立即中断。`, '授权回收', { type: 'warning', confirmButtonText: '确认回收' })
    .then(() => {
      row.status = '已回收'
      ElMessage.success('授权已回收，调用凭证同步失效（Mock）')
    })
    .catch(() => {})
}

const auditVisible = ref(false)

const auditResults = [
  { authNo: 'AUTH-2026-052', item: '授权范围与申请单一致', conclusion: '合规', note: 'OK' },
  { authNo: 'AUTH-2026-041', item: '到期前回收提醒已触发', conclusion: '合规', note: '已发送提醒' },
  { authNo: 'AUTH-2026-036', item: 'L1 资产未启用脱敏', conclusion: '关注', note: '建议启用脱敏预览' },
  { authNo: 'AUTH-2026-030', item: '超期使用', conclusion: '关注', note: '已到期未自动回收，建议立即回收' },
]

const runAudit = () => {
  auditVisible.value = true
}

const viewAudit = (row: Ledger) => {
  ElMessage.info(`查看「${row.authNo}」审计轨迹：申请→审批→授权→使用→（回收）（Mock）`)
}

const exportLedger = () => ElMessage.success(`已导出 ${filteredLedger.value.length} 条台账记录（Excel/Mock）`)
</script>

<style lang="scss" scoped>
.share-ledger-page {
  height: 100%;
  overflow-y: auto;
}

.ledger-stats {
  display: flex;
  gap: 12px;
}

.ledger-stat {
  flex: 1;
  border-radius: 8px;
  border: 1px solid #edf0f5;
  padding: 12px 14px;
  text-align: center;
}

.ledger-stat-value {
  font-size: 22px;
  font-weight: 700;
  line-height: 1.2;
}

.ledger-stat-label {
  margin-top: 4px;
  font-size: 12px;
  opacity: 0.9;
}

.mt-12 {
  margin-top: 12px;
}

.mb-12 {
  margin-bottom: 12px;
}
</style>