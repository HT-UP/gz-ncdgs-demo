<template>
  <div class="standard-page">
    <el-card class="panel-card dashboard-card" shadow="never">
      <template #header>
        <div class="panel-header">
          <span>操作日志</span>
          <div class="panel-actions">
            <el-button :icon="Download" @click="exportLogs">导出 Excel</el-button>
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
        <el-select v-model="filterTenant" placeholder="租户" clearable class="filter-select">
          <el-option v-for="tenant in tenantPool" :key="tenant" :label="tenant" :value="tenant" />
        </el-select>
        <el-select v-model="filterResult" placeholder="结果" clearable class="filter-select">
          <el-option label="成功" value="成功" />
          <el-option label="失败" value="失败" />
        </el-select>
        <el-checkbox v-model="onlyAbnormal" class="filter-check">仅看异常</el-checkbox>
      </div>

      <el-table :data="pagedLogs" stripe class="mt-12" size="small">
        <el-table-column prop="time" label="时间" width="160" />
        <el-table-column prop="user" label="操作人" width="80" />
        <el-table-column prop="tenant" label="租户" min-width="130" />
        <el-table-column label="操作类型" width="90">
          <template #default="{ row }">
            <el-tag size="small" effect="plain">{{ row.operationType }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="action" label="操作" min-width="110" />
        <el-table-column prop="object" label="操作对象" min-width="130" />
        <el-table-column label="结果" width="70">
          <template #default="{ row }">
            <span :class="row.result === '成功' ? 'audit-success' : 'audit-fail'">{{ row.result }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="ip" label="IP" width="120" />
        <el-table-column prop="duration" label="耗时" width="80" />
        <el-table-column label="异常" width="60" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.abnormal" type="danger" size="small" effect="dark">异常</el-tag>
            <span v-else class="dep-text">—</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openDetail(row)">详情</el-button>
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
      <div class="retention-note">系统日志与操作记录保存 180 个自然日，超出部分自动归档（Mock）</div>
    </el-card>

    <el-drawer v-model="detailVisible" title="日志详情" size="560px">
      <template v-if="currentLog">
        <el-alert
          v-if="currentLog.abnormal"
          title="该操作已标记为异常行为并触发告警通知"
          type="error"
          :closable="false"
          class="mb-16"
        />
        <el-descriptions :column="1" border size="small">
          <el-descriptions-item label="操作人">{{ currentLog.user }}</el-descriptions-item>
          <el-descriptions-item label="所属租户">{{ currentLog.tenant }}</el-descriptions-item>
          <el-descriptions-item label="时间">{{ currentLog.time }}</el-descriptions-item>
          <el-descriptions-item label="操作类型">{{ currentLog.operationType }}</el-descriptions-item>
          <el-descriptions-item label="操作内容">{{ currentLog.action }}</el-descriptions-item>
          <el-descriptions-item label="操作对象">{{ currentLog.object }}</el-descriptions-item>
          <el-descriptions-item label="来源 IP">{{ currentLog.ip }}</el-descriptions-item>
          <el-descriptions-item label="耗时">{{ currentLog.duration }}</el-descriptions-item>
        </el-descriptions>
        <div class="section-title mt-16">请求参数</div>
        <el-input :model-value="currentLog.params" type="textarea" :rows="3" readonly class="mt-8" />
        <div class="section-title mt-16">返回结果</div>
        <el-input :model-value="currentLog.response" type="textarea" :rows="3" readonly class="mt-8" />
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Download } from '@element-plus/icons-vue'
import { mockOperationLogs, type OperationLog } from '@/mock/system'

const operationTypes = ['登录', '查询', '修改', '删除', '审批']
const userPool = ['张三', '李四', '王五', '赵六', 'admin', '孙七']
const tenantPool = ['广州地铁设计研究院', '轨道运营管理公司', '广州盾构工程公司', '市交通运输局', '华南理工大学课题组']

const timeRange = ref<string[]>([])
const filterType = ref('')
const filterUser = ref('')
const filterTenant = ref('')
const filterResult = ref('')
const onlyAbnormal = ref(false)
const currentPage = ref(1)
const pageSize = 20
const detailVisible = ref(false)

const logs = ref([...mockOperationLogs])
const currentLog = ref<OperationLog | null>(null)

const filteredLogs = computed(() =>
  logs.value.filter((log) => {
    if (onlyAbnormal.value && !log.abnormal) return false
    if (filterType.value && log.operationType !== filterType.value) return false
    if (filterUser.value && log.user !== filterUser.value) return false
    if (filterTenant.value && log.tenant !== filterTenant.value) return false
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

watch([timeRange, filterType, filterUser, filterTenant, filterResult, onlyAbnormal], () => {
  currentPage.value = 1
})

const openDetail = (row: OperationLog) => {
  currentLog.value = row
  detailVisible.value = true
}

const exportLogs = () => ElMessage.success('操作日志已导出为 Excel（Mock）')
</script>