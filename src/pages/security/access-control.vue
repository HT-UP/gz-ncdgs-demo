<template>
  <div class="standard-page">
    <el-row :gutter="16">
      <el-col :span="16">
        <el-card class="panel-card dashboard-card" shadow="never">
          <template #header>
            <div class="panel-header">
              <span>访问控制策略</span>
              <el-button type="danger" :icon="Plus" @click="openCreate">新增策略</el-button>
            </div>
          </template>

          <el-tabs v-model="activeTab" @tab-change="() => {}">
            <el-tab-pane label="策略列表" name="list" />
            <el-tab-pane label="权限矩阵" name="matrix" />
            <el-tab-pane label="待审批" name="pending" />
          </el-tabs>

          <div class="toolbar-row">
            <el-input
              v-model="keyword"
              placeholder="按主体 / 对象搜索"
              clearable
              class="search-input"
              :prefix-icon="Search"
            />
            <el-select v-model="filterStatus" placeholder="状态" clearable class="filter-select">
              <el-option label="生效" value="生效" />
              <el-option label="待生效" value="待生效" />
              <el-option label="待审批" value="待审批" />
              <el-option label="已过期" value="已过期" />
            </el-select>
          </div>

          <el-table v-if="activeTab !== 'matrix'" :data="pagedPolicies" stripe class="mt-12">
            <el-table-column label="主体" min-width="130">
              <template #default="{ row }">
                <span class="policy-subject">{{ row.subject }}</span>
                <el-tag size="small" effect="plain" class="ml-4">{{ row.subjectType }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="对象" min-width="150">
              <template #default="{ row }">
                <span>{{ row.object }}</span>
                <el-tag size="small" type="info" effect="plain" class="ml-4">{{ row.objectType }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="权限" width="80" align="center">
              <template #default="{ row }">
                <el-tag :type="actionTagType[row.actions]" effect="dark">{{ row.actions }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="安全等级" width="90">
              <template #default="{ row }">
                <span class="security-level" :style="{ background: levelColor[row.level] }">{{ row.level }}</span>
              </template>
            </el-table-column>
            <el-table-column label="来源" width="80">
              <template #default="{ row }">
                <el-tag size="small" :type="row.source === 'RBAC' ? 'primary' : 'success'" effect="plain">{{ row.source }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="有效期" width="170">
              <template #default="{ row }">{{ row.effectiveDate }}<span class="dep-text"> 至 </span>{{ row.expireDate }}</template>
            </el-table-column>
            <el-table-column label="状态" width="80">
              <template #default="{ row }">
                <el-tag :type="policyStatusTag[row.status]" effect="dark">{{ row.status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150" fixed="right">
              <template #default="{ row }">
                <el-button v-if="row.status === '待审批'" link type="success" @click="approve(row)">通过</el-button>
                <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
                <el-button link type="danger" @click="revoke(row)">回收</el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-table v-else :data="matrixRows" stripe class="mt-12" size="small">
            <el-table-column prop="role" label="角色 / 资源" width="160" fixed />
            <el-table-column
              v-for="resource in matrixResources"
              :key="resource"
              :label="resource"
              min-width="130"
              align="center"
            >
              <template #default="{ row }">
                <el-tag v-if="row[resource] === '读'" type="primary" effect="plain" size="small">读</el-tag>
                <el-tag v-else-if="row[resource] === '写'" type="warning" effect="plain" size="small">写</el-tag>
                <el-tag v-else-if="row[resource] === '全部'" type="danger" effect="plain" size="small">全部</el-tag>
                <span v-else class="dep-text">—</span>
              </template>
            </el-table-column>
          </el-table>

          <el-pagination
            v-if="activeTab !== 'matrix'"
            class="pager"
            layout="total, prev, pager, next"
            :total="listSource.length"
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
            <div class="panel-header"><span>权限变更审计</span></div>
          </template>
          <el-timeline class="mt-8">
            <el-timeline-item v-for="item in changeAudit" :key="`${item.time}-${item.action}`" :timestamp="item.time" :type="item.type">
              <div class="audit-item-title">{{ item.user }} {{ item.action }}</div>
              <div class="audit-item-action">{{ item.detail }}</div>
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>
    </el-row>

    <el-drawer v-model="editorVisible" :title="editingRow ? '编辑策略' : '新增策略'" size="540px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="主体类型">
          <el-radio-group v-model="form.subjectType">
            <el-radio value="角色" />
            <el-radio value="用户" />
            <el-radio value="部门" />
            <el-radio value="租户" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="主体">
          <el-select v-model="form.subject" filterable allow-create default-first-option class="w-full">
            <el-option v-for="subject in subjectPool" :key="subject" :label="subject" :value="subject" />
          </el-select>
        </el-form-item>
        <el-form-item label="授权对象">
          <el-select v-model="form.object" filterable class="w-full">
            <el-option v-for="resource in resourcePool" :key="resource" :label="resource" :value="resource" />
          </el-select>
        </el-form-item>
        <el-form-item label="对象粒度">
          <el-radio-group v-model="form.objectType">
            <el-radio value="表" />
            <el-radio value="字段" />
            <el-radio value="行" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="权限动作">
          <el-radio-group v-model="form.actions">
            <el-radio value="读" />
            <el-radio value="写" />
            <el-radio value="全部" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="安全等级">
          <el-radio-group v-model="form.level">
            <el-radio value="高" />
            <el-radio value="中" />
            <el-radio value="低" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="生效期">
          <el-date-picker v-model="form.range" type="daterange" value-format="YYYY-MM-DD" class="w-full" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editorVisible = false">取消</el-button>
        <el-button type="danger" @click="saveForm">提交</el-button>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, Search } from '@element-plus/icons-vue'
import { mockPolicies, type AccessPolicy } from '@/mock/security'

const activeTab = ref('list')
const keyword = ref('')
const filterStatus = ref('')
const currentPage = ref(1)
const pageSize = 20
const editorVisible = ref(false)
const editingRow = ref<AccessPolicy | null>(null)

const policies = ref([...mockPolicies])

const resourcePool = ['ticket_sale_detail', 'passenger_info', 'station_info', 'line_info', 'device_status_log', 'flow_stat_daily']
const subjectPool = ['数据中心管理员', '业务分析员', '数据治理专员', '审计员', '张三', '李四']

const levelColor: Record<string, string> = {
  高: '#E34D59',
  中: '#ED7B2F',
  低: '#2B6CB0',
}

const actionTagType: Record<string, 'primary' | 'warning' | 'danger'> = {
  读: 'primary',
  写: 'warning',
  全部: 'danger',
}

const policyStatusTag: Record<string, 'success' | 'warning' | 'info' | 'danger'> = {
  生效: 'success',
  待生效: 'warning',
  待审批: 'warning',
  已过期: 'info',
}

const changeAudit = [
  { time: '2026-08-12 09:20', user: '张三', action: '新增策略', detail: '给「业务分析员」授权 ticket_sale_detail 读权限', type: 'primary' as const },
  { time: '2026-08-11 17:45', user: '李四', action: '回收权限', detail: '回收「赵六」对 passenger_info 的写权限', type: 'danger' as const },
  { time: '2026-08-11 11:05', user: '王五', action: '修改策略', detail: '「审计员」权限有效期延长至 2027-12-31', type: 'warning' as const },
  { time: '2026-08-10 16:30', user: '张三', action: '过期回收', detail: '自动到期回收 3 条失效策略', type: 'info' as const },
]

const form = reactive({
  subjectType: '角色',
  subject: '业务分析员',
  object: 'ticket_sale_detail',
  objectType: '表',
  actions: '读',
  level: '中',
  range: [] as string[],
})

const filteredPolicies = computed(() =>
  policies.value.filter((policy) => {
    if (filterStatus.value && policy.status !== filterStatus.value) return false
    if (!keyword.value) return true
    const kw = keyword.value.toLowerCase()
    return policy.subject.toLowerCase().includes(kw) || policy.object.toLowerCase().includes(kw)
  }),
)

const listSource = computed(() => {
  if (activeTab.value === 'pending') return filteredPolicies.value.filter((item) => item.status === '待审批')
  return filteredPolicies.value
})

const pagedPolicies = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return listSource.value.slice(start, start + pageSize)
})

const changePage = (page: number) => currentPage.value = page

watch([keyword, filterStatus, activeTab], () => {
  currentPage.value = 1
})

const matrixResources = resourcePool
const matrixRows = [
  { role: '数据中心管理员', ...Object.fromEntries(resourcePool.map((r) => [r, '全部'])) },
  { role: '业务分析员', ticket_sale_detail: '读', passenger_info: '读', flow_stat_daily: '读', station_info: '读' },
  { role: '数据治理专员', ticket_sale_detail: '写', passenger_info: '读', device_status_log: '写', station_info: '读' },
  { role: '审计员', ticket_sale_detail: '读', passenger_info: '读', device_status_log: '读' },
  { role: '外部研究人员', station_info: '读', line_info: '读' },
]

const openCreate = () => {
  editingRow.value = null
  Object.assign(form, { subjectType: '角色', subject: '业务分析员', object: 'ticket_sale_detail', objectType: '表', actions: '读', level: '中', range: [] as string[] })
  editorVisible.value = true
}

const openEdit = (row: AccessPolicy) => {
  editingRow.value = row
  Object.assign(form, {
    subjectType: row.subjectType,
    subject: row.subject,
    object: row.object,
    objectType: row.objectType,
    actions: row.actions,
    level: row.level,
    range: [row.effectiveDate, row.expireDate],
  })
  editorVisible.value = true
}

const saveForm = () => {
  if (editingRow.value) {
    ElMessage.success(`策略「${editingRow.value.subject} → ${editingRow.value.object}」已保存（Mock）`)
  } else {
    policies.value.unshift({
      id: `pol-mock-${Date.now()}`,
      subject: form.subject,
      subjectType: form.subjectType as AccessPolicy['subjectType'],
      resourceType: '表',
      object: form.object,
      objectType: form.objectType as AccessPolicy['objectType'],
      actions: form.actions as AccessPolicy['actions'],
      level: form.level as AccessPolicy['level'],
      effectiveDate: form.range[0] ?? '2026-08-12',
      expireDate: form.range[1] ?? '2026-12-31',
      source: 'RBAC',
      status: '待审批',
      lastChange: new Date().toLocaleString('sv-SE').replace('T', ' '),
      changeUser: '张三',
    })
    ElMessage.success('策略已提交，等待审批（Mock）')
  }
  editorVisible.value = false
}

const approve = (row: AccessPolicy) => {
  row.status = '生效'
  ElMessage.success(`策略已通过并生效（Mock）`)
}

const revoke = (row: AccessPolicy) => {
  row.status = '已过期'
  ElMessage.info(`「${row.subject}」对「${row.object}」的权限已回收（Mock）`)
}
</script>