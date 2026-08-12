<template>
  <div class="standard-page">
    <el-row :gutter="16">
      <el-col :span="16">
        <el-card class="panel-card dashboard-card" shadow="never">
          <template #header>
            <div class="panel-header">
              <span>合规检查清单</span>
              <div class="panel-actions">
                <el-button type="primary" plain size="small" @click="autoCheck">自动检查</el-button>
                <el-button type="danger" :icon="DocumentCopy" @click="generateReport">生成检查报告</el-button>
              </div>
            </div>
          </template>

          <div class="toolbar-row">
            <el-input
              v-model="keyword"
              placeholder="按法规 / 条款 / 映射功能搜索"
              clearable
              class="search-input"
              :prefix-icon="Search"
            />
            <el-select v-model="filterStatus" placeholder="状态" clearable class="filter-select">
              <el-option label="合规" value="合规" />
              <el-option label="不合规" value="不合规" />
              <el-option label="待整改" value="待整改" />
            </el-select>
            <el-select v-model="filterRisk" placeholder="风险等级" clearable class="filter-select">
              <el-option label="高" value="高" />
              <el-option label="中" value="中" />
              <el-option label="低" value="低" />
            </el-select>
          </div>

          <el-table :data="pagedItems" stripe class="mt-12">
            <el-table-column prop="regulation" label="法规" width="170" />
            <el-table-column prop="clause" label="条款" width="140" />
            <el-table-column prop="requirement" label="要求说明" min-width="200" />
            <el-table-column prop="mappedFeature" label="映射系统功能" width="140" />
            <el-table-column label="状态" width="90">
              <template #default="{ row }">
                <el-tag :type="complianceStatusTag[row.status]" effect="dark">{{ row.status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="风险" width="90">
              <template #default="{ row }">
                <span class="security-level" :style="{ background: levelColor[row.riskLevel] }">{{ row.riskLevel }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150" fixed="right">
              <template #default="{ row }">
                <el-button v-if="row.riskId" link type="warning" @click="openRisk(row)">整改跟踪</el-button>
                <el-button link type="primary" @click="viewEvidence(row)">证据</el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-pagination
            class="pager"
            layout="total, prev, pager, next"
            :total="filteredItems.length"
            :page-size="pageSize"
            :current-page="currentPage"
            background
            @current-change="changePage"
          />
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card class="panel-card dashboard-card" shadow="never">
          <template #header>
            <div class="panel-header"><span>风险整改跟踪</span></div>
          </template>
          <div v-for="risk in riskList" :key="risk.id" class="risk-item">
            <div class="risk-head">
              <span class="risk-id">{{ risk.id }}</span>
              <el-tag size="small" :type="risk.stageTag" effect="plain">{{ risk.stage }}</el-tag>
            </div>
            <div class="risk-desc">{{ risk.title }}</div>
            <el-steps :active="risk.activeStep" size="small" align-center class="risk-steps">
              <el-step title="风险" />
              <el-step title="工单" />
              <el-step title="整改" />
              <el-step title="验证" />
            </el-steps>
            <div class="dep-text">{{ risk.updateTime }} · {{ risk.owner }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog v-model="riskVisible" title="风险整改闭环" width="640px">
      <template v-if="currentRisk">
        <el-descriptions :column="1" border size="small">
          <el-descriptions-item label="风险编号">{{ currentRisk.riskId }}</el-descriptions-item>
          <el-descriptions-item label="关联条款">{{ currentRisk.regulation }} {{ currentRisk.clause }}</el-descriptions-item>
          <el-descriptions-item label="风险内容">{{ currentRisk.requirement }}</el-descriptions-item>
          <el-descriptions-item label="责任部门">信息中心</el-descriptions-item>
        </el-descriptions>
        <div class="section-title mt-16">整改流程</div>
        <el-steps :active="2" align-center class="risk-steps">
          <el-step title="风险登记" />
          <el-step title="工单下发" />
          <el-step title="整改实施" />
          <el-step title="复验关闭" />
        </el-steps>
        <el-timeline class="mt-16">
          <el-timeline-item timestamp="2026-08-10 10:00" type="danger">风险登记：${currentRisk.regulation} 检查不合规</el-timeline-item>
          <el-timeline-item timestamp="2026-08-10 15:20" type="warning">工单下发：WO-2026-0812 已派发至信息中心</el-timeline-item>
          <el-timeline-item timestamp="2026-08-12 09:30" type="primary">整改实施：修复完成，等待验证</el-timeline-item>
        </el-timeline>
      </template>
      <template #footer>
        <el-button type="primary" plain @click="closeRisk">标记验证通过</el-button>
        <el-button type="danger" @click="exportRiskEvidence">导出审计证据</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { DocumentCopy, Search } from '@element-plus/icons-vue'
import { mockComplianceItems, type ComplianceItem } from '@/mock/security'

const keyword = ref('')
const filterStatus = ref('')
const filterRisk = ref('')
const currentPage = ref(1)
const pageSize = 20
const riskVisible = ref(false)

const items = ref([...mockComplianceItems])

const levelColor: Record<string, string> = {
  高: '#E34D59',
  中: '#ED7B2F',
  低: '#2B6CB0',
}

const complianceStatusTag: Record<string, 'success' | 'danger' | 'warning'> = {
  合规: 'success',
  不合规: 'danger',
  待整改: 'warning',
}

const riskList = [
  { id: 'RISK-2026-01', title: '重要数据未配置密钥自动轮换', stage: '验证中', stageTag: 'primary' as const, activeStep: 3, updateTime: '2026-08-12 09:30', owner: '张工' },
  { id: 'RISK-2026-02', title: '个人信息导出流程缺少审批留痕', stage: '整改中', stageTag: 'warning' as const, activeStep: 2, updateTime: '2026-08-11 16:20', owner: '李工' },
  { id: 'RISK-2026-03', title: '数据出境场景未完成安全评估', stage: '工单中', stageTag: 'info' as const, activeStep: 1, updateTime: '2026-08-10 11:00', owner: '王工' },
]

const currentRisk = ref<ComplianceItem | null>(null)

const filteredItems = computed(() =>
  items.value.filter((item) => {
    if (filterStatus.value && item.status !== filterStatus.value) return false
    if (filterRisk.value && item.riskLevel !== filterRisk.value) return false
    if (!keyword.value) return true
    const kw = keyword.value.toLowerCase()
    return (
      item.regulation.toLowerCase().includes(kw) ||
      item.clause.toLowerCase().includes(kw) ||
      item.mappedFeature.toLowerCase().includes(kw)
    )
  }),
)

const pagedItems = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredItems.value.slice(start, start + pageSize)
})

const changePage = (page: number) => (currentPage.value = page)

watch([keyword, filterStatus, filterRisk], () => {
  currentPage.value = 1
})

const autoCheck = () => {
  ElMessage.success('自动检查完成：52 项检查中 48 项合规（Mock）')
}

const generateReport = () => {
  ElMessage.success('合规检查报告已生成，包含 4 项风险清单（Mock）')
}

const openRisk = (row: ComplianceItem) => {
  currentRisk.value = row
  riskVisible.value = true
}

const closeRisk = () => {
  riskVisible.value = false
  ElMessage.success('风险已通过复验，流程关闭（Mock）')
}

const exportRiskEvidence = () => {
  ElMessage.success('审计证据包已导出归档（Mock）')
}

const viewEvidence = (row: ComplianceItem) => {
  ElMessage.info(`查看「${row.regulation} ${row.clause}」检查证据（Mock）`)
}
</script>