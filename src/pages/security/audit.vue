<template>
  <div class="standard-page">
    <el-card class="panel-card dashboard-card" shadow="never">
      <template #header>
        <div class="panel-header">
          <span>安全审计日志</span>
          <div class="panel-actions">
            <el-button type="danger" :icon="Download" @click="exportEvidence">合规举证导出</el-button>
          </div>
        </div>
      </template>

      <div class="toolbar-row audit-toolbar">
        <el-date-picker
          v-model="timeRange"
          type="daterange"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          value-format="YYYY-MM-DD"
          class="filter-date"
        />
        <el-select v-model="filterType" placeholder="操作类型" clearable class="filter-select">
          <el-option v-for="type in operationTypes" :key="type" :label="type" :value="type" />
        </el-select>
        <el-select v-model="filterUser" placeholder="操作人" clearable class="filter-select">
          <el-option v-for="user in userPool" :key="user" :label="user" :value="user" />
        </el-select>
        <el-select v-model="filterResult" placeholder="结果" clearable class="filter-select">
          <el-option label="成功" value="成功" />
          <el-option label="失败" value="失败" />
        </el-select>
        <el-checkbox v-model="onlyAbnormal" class="filter-check">仅看异常行为</el-checkbox>
      </div>

      <el-table :data="pagedLogs" stripe class="mt-12">
        <el-table-column prop="time" label="时间" width="160" />
        <el-table-column prop="user" label="操作人" width="90" />
        <el-table-column label="操作类型" width="90">
          <template #default="{ row }">
            <el-tag size="small" effect="plain">{{ row.operationType }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="action" label="操作" min-width="120" />
        <el-table-column prop="object" label="对象" min-width="140" />
        <el-table-column label="结果" width="80">
          <template #default="{ row }">
            <span :class="row.result === '成功' ? 'audit-success' : 'audit-fail'">{{ row.result }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="ip" label="来源 IP" width="130" />
        <el-table-column label="异常" width="70" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.abnormal" type="danger" size="small" effect="dark">异常</el-tag>
            <span v-else class="dep-text">—</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="110" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openTrace(row)">溯源</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        class="pager"
        layout="total, prev, pager, next"
        :total="filteredLogs.length"
        :page-size="pageSize"
        :current-page="currentPage"
        background
        @current-change="changePage"
      />
      <div class="retention-note">审计日志保存 180 个自然日，超出部分自动归档（Mock）</div>
    </el-card>

    <el-drawer v-model="traceVisible" title="操作溯源" size="560px">
      <template v-if="currentLog">
        <div class="trace-head">
          <el-tag :type="currentLog.abnormal ? 'danger' : 'success'" effect="dark" size="small">
            {{ currentLog.abnormal ? '异常行为' : '正常操作' }}
          </el-tag>
          <span class="trace-title">{{ currentLog.action }} · {{ currentLog.object }}</span>
        </div>
        <el-descriptions :column="1" border class="mt-16" size="small">
          <el-descriptions-item label="操作人">{{ currentLog.user }}</el-descriptions-item>
          <el-descriptions-item label="时间">{{ currentLog.time }}</el-descriptions-item>
          <el-descriptions-item label="来源 IP">{{ currentLog.ip }}</el-descriptions-item>
          <el-descriptions-item label="操作类型">{{ currentLog.operationType }}</el-descriptions-item>
          <el-descriptions-item label="结果">{{ currentLog.result }}</el-descriptions-item>
        </el-descriptions>
        <div class="section-title mt-16">完整操作链</div>
        <el-timeline class="mt-8">
          <el-timeline-item v-for="step in currentLog.traceChain" :key="step.time" :timestamp="step.time" :type="step.type">
            <div class="audit-item-title">{{ step.title }}</div>
            <div class="audit-item-action">{{ step.detail }}</div>
          </el-timeline-item>
        </el-timeline>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Download } from '@element-plus/icons-vue'
import { mockAuditLogs, type AuditLogItem } from '@/mock/security'

const operationTypes = ['认证', '访问', '导出', '治理', '配置']
const userPool = ['张三', '李四', '王五', '赵六', 'admin', '孙七']

const timeRange = ref<string[]>([])
const filterType = ref('')
const filterUser = ref('')
const filterResult = ref('')
const onlyAbnormal = ref(false)
const currentPage = ref(1)
const pageSize = 20
const traceVisible = ref(false)

const logs = ref(
  mockAuditLogs.map((log, index) => ({
    ...log,
    traceChain:
      index % 5 === 0
        ? [
            { time: log.time, title: `${log.user} 登录系统`, detail: `IP ${log.ip} 登录成功`, type: 'primary' as const },
            { time: log.time, title: log.action, detail: `对象：${log.object}`, type: 'success' as const },
            { time: log.time, title: '会话结束', detail: '操作完成，记录留痕', type: 'info' as const },
          ]
        : [
            { time: log.time, title: `${log.user} ${log.action}`, detail: `对象：${log.object}（${log.result}）`, type: 'primary' as const },
            { time: log.time, title: '审计记录归档', detail: '已写入审计存储', type: 'info' as const },
          ],
  })),
)

type LogWithTrace = (typeof logs.value)[number]
const currentLog = ref<LogWithTrace | null>(null)

const filteredLogs = computed(() =>
  logs.value.filter((log) => {
    if (onlyAbnormal.value && !log.abnormal) return false
    if (filterType.value && log.operationType !== filterType.value) return false
    if (filterUser.value && log.user !== filterUser.value) return false
    if (filterResult.value && log.result !== filterResult.value) return false
    if (timeRange.value.length === 2) {
      const time = log.time.slice(0, 10)
      if (time < timeRange.value[0] || time > timeRange.value[1]) return false
    }
    return true
  }),
)

const pagedLogs = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredLogs.value.slice(start, start + pageSize)
})

const changePage = (page: number) => (currentPage.value = page)

watch([timeRange, filterType, filterUser, filterResult, onlyAbnormal], () => {
  currentPage.value = 1
})

const openTrace = (row: LogWithTrace) => {
  currentLog.value = row
  traceVisible.value = true
}

const exportEvidence = () => {
  ElMessage.success('合规举证材料已生成并导出（Mock）')
}
</script>