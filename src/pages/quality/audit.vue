<template>
  <div class="standard-page">
    <el-row :gutter="16">
      <el-col :span="16">
        <el-card class="panel-card dashboard-card" shadow="never">
          <template #header>
            <div class="panel-header">
              <span>审计日志</span>
              <el-button type="danger" :icon="Download" @click="exportAudit">审计证据导出</el-button>
            </div>
          </template>

          <div class="toolbar-row">
            <el-input
              v-model="keyword"
              placeholder="按操作人 / 对象 / 操作搜索"
              clearable
              class="search-input"
              :prefix-icon="Search"
            />
            <el-select v-model="filterResult" placeholder="结果" clearable class="filter-select">
              <el-option label="已生效" value="已生效" />
              <el-option label="运行中" value="运行中" />
              <el-option label="已关闭" value="已关闭" />
              <el-option label="通过" value="通过" />
              <el-option label="审批中" value="审批中" />
            </el-select>
          </div>

          <el-table :data="filteredLogs" stripe class="mt-12">
            <el-table-column prop="time" label="时间" width="150" />
            <el-table-column prop="user" label="操作人" width="90" />
            <el-table-column prop="object" label="操作对象" min-width="180" />
            <el-table-column prop="action" label="操作" min-width="170" />
            <el-table-column label="结果" width="100">
              <template #default="{ row }">
                <el-tag :type="resultTagType[row.result]" effect="dark">{{ row.result }}</el-tag>
              </template>
            </el-table-column>
          </el-table>

          <el-pagination class="pager" layout="total, prev, pager, next" :total="filteredLogs.length" :page-size="20" background />
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card class="panel-card dashboard-card" shadow="never">
          <template #header>
            <div class="panel-header">
              <span>问题工单流转</span>
            </div>
          </template>
          <div v-for="ticket in tickets" :key="ticket.id" class="ticket-item">
            <div class="ticket-head">
              <span class="ticket-id">{{ ticket.id }}</span>
              <el-tag size="small" :type="ticket.statusType" effect="plain">{{ ticket.status }}</el-tag>
            </div>
            <div class="ticket-desc">{{ ticket.desc }}</div>
            <div class="ticket-meta">{{ ticket.time }} · {{ ticket.owner }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-card class="panel-card dashboard-card mt-16" shadow="never">
      <template #header>
        <div class="panel-header">
          <span>监管要求合规映射</span>
          <el-button type="danger" size="small" @click="generateReport">生成合规报告</el-button>
        </div>
      </template>
      <el-table :data="complianceItems" stripe>
        <el-table-column prop="regulation" label="监管要求" min-width="180" />
        <el-table-column prop="description" label="要求说明" min-width="220" />
        <el-table-column label="映射质量规则" min-width="180">
          <template #default="{ row }">{{ row.mappedRules }}</template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === '通过' ? 'success' : row.status === '整改中' ? 'warning' : 'danger'" effect="dark">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="evidence" label="审计证据" width="130">
          <template #default="{ row }">
            <el-link :underline="false" type="primary" @click="viewEvidence(row)">{{ row.evidence }}</el-link>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Download, Search } from '@element-plus/icons-vue'
import { qualityAuditLogs } from '@/mock/quality'

const resultTagType: Record<string, 'success' | 'warning' | 'primary' | 'danger' | 'info'> = {
  已生效: 'success',
  运行中: 'warning',
  已关闭: 'info',
  通过: 'success',
  审批中: 'warning',
  已驳回: 'danger',
}

const keyword = ref('')
const filterResult = ref('')

const logs = ref([
  ...qualityAuditLogs,
  { time: '2026-08-10 14:02', user: '张三', object: '规则「站名一致性检查」', action: '试跑验证', result: '已生效' },
  { time: '2026-08-10 11:18', user: '赵六', object: '质量报告「月度质量报告」', action: '导出 PDF', result: '已关闭' },
  { time: '2026-08-09 16:44', user: '李四', object: '工单 QD-2026-0809-07', action: '驳回整改', result: '已驳回' },
  { time: '2026-08-09 09:30', user: '王工', object: '《数据安全法》合规项', action: '合规性检查', result: '通过' },
])

const tickets = [
  { id: 'QD-2026-0811-02', desc: 'ticket_sale.flow_count 存在 12 条负值', status: '处理中', statusType: 'warning' as const, time: '2026-08-11 03:02', owner: '张三' },
  { id: 'QD-2026-0811-03', desc: 'passenger_info.phone 格式异常 26 条', status: '待处理', statusType: 'info' as const, time: '2026-08-11 03:02', owner: '李四' },
  { id: 'QD-2026-0810-05', desc: 'station_info.station_name 编码不规范', status: '已关闭', statusType: 'success' as const, time: '2026-08-10 17:40', owner: '王工' },
]

const complianceItems = [
  { regulation: '《数据安全法》', description: '建立数据分类分级保护制度，敏感数据安全审计', mappedRules: '完整性4项 / 准确性6项', status: '通过', evidence: '审计日志-2026Q2 PDF' },
  { regulation: '《个人信息保护法》', description: '个人信息处理全流程可追溯，脱敏合规', mappedRules: '脱敏一致性8项 / 唯一性3项', status: '通过', evidence: '合规检查报告-08月' },
  { regulation: '《网络安全法》', description: '汇聚数据的安全技术措施与日志留存', mappedRules: '及时性5项 / 完整性2项', status: '整改中', evidence: '整改计划-V2 PDF' },
  { regulation: '《数据出境安全评估办法》', description: '重要数据出境安全评估与备案', mappedRules: '一致性6项', status: '通过', evidence: '评估备案表-01' },
]

const filteredLogs = computed(() =>
  logs.value.filter((log) => {
    if (filterResult.value && log.result !== filterResult.value) return false
    if (!keyword.value) return true
    const kw = keyword.value.toLowerCase()
    return (
      log.user.toLowerCase().includes(kw) ||
      log.object.toLowerCase().includes(kw) ||
      log.action.toLowerCase().includes(kw)
    )
  }),
)

const exportAudit = () => {
  ElMessage.success('审计证据归档包已导出（Mock）')
}

const generateReport = () => {
  ElMessage.success('合规报告已生成并归档（Mock）')
}

const viewEvidence = (row: (typeof complianceItems)[number]) => {
  ElMessage.info(`正在打开审计证据：${row.evidence}（Mock）`)
}
</script>