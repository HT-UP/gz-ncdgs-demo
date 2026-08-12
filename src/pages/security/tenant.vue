<template>
  <div class="standard-page">
    <el-card class="panel-card dashboard-card" shadow="never">
      <template #header>
        <div class="panel-header">
          <span>多租户管理</span>
          <el-button type="danger" :icon="Plus" @click="openCreate">新增租户</el-button>
        </div>
      </template>

      <div class="toolbar-row">
        <el-input
          v-model="keyword"
          placeholder="按租户名称 / 负责人搜索"
          clearable
          class="search-input"
          :prefix-icon="Search"
        />
        <el-select v-model="filterType" placeholder="租户类型" clearable class="filter-select">
          <el-option v-for="type in tenantTypes" :key="type" :label="type" :value="type" />
        </el-select>
        <el-select v-model="filterStatus" placeholder="状态" clearable class="filter-select">
          <el-option label="启用" value="启用" />
          <el-option label="停用" value="停用" />
        </el-select>
      </div>

      <el-table :data="pagedTenants" stripe class="mt-12">
        <el-table-column prop="name" label="租户名称" min-width="170" />
        <el-table-column prop="type" label="类型" width="110">
          <template #default="{ row }">
            <el-tag effect="plain" type="danger">{{ row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="90">
          <template #default="{ row }">
            <el-tag :type="row.status === '启用' ? 'success' : 'info'" effect="dark">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="账号对接" width="140">
          <template #default="{ row }">
            <el-tag v-if="row.ldap" size="small" effect="plain" class="mr-4">LDAP</el-tag>
            <el-tag v-if="row.sso" size="small" type="primary" effect="plain">SSO</el-tag>
            <span v-if="!row.ldap && !row.sso" class="dep-text">本地账号</span>
          </template>
        </el-table-column>
        <el-table-column label="资源配额" min-width="200">
          <template #default="{ row }">
            <el-progress
              :percentage="Math.round((row.storageUsed / row.storageQuota) * 100)"
              :color="row.storageUsed / row.storageQuota > 0.8 ? '#E34D59' : '#2B6CB0'"
              :stroke-width="8"
              :format="() => `${(row.storageUsed / 1024).toFixed(1)} / ${row.storageQuota / 1024} GB`"
            />
          </template>
        </el-table-column>
        <el-table-column label="任务并发" width="90" align="center">
          <template #default="{ row }">{{ row.taskConcurrency }} 个</template>
        </el-table-column>
        <el-table-column prop="owner" label="负责人" width="80" />
        <el-table-column prop="createTime" label="创建时间" width="150" />
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
            <el-button link type="warning" @click="openQuota(row)">配额</el-button>
            <el-button link type="success" @click="toggleTenant(row)">{{ row.status === '启用' ? '停用' : '启用' }}</el-button>
            <el-button link type="danger" @click="removeTenant(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        class="pager"
        layout="total, prev, pager, next"
        :total="filteredTenants.length"
        :page-size="pageSize"
        :current-page="currentPage"
        background
        @current-change="changePage"
      />
    </el-card>

    <el-drawer v-model="editorVisible" :title="editing ? '编辑租户' : '新增租户'" size="520px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="租户名称">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="租户类型">
          <el-select v-model="form.type" class="w-full">
            <el-option v-for="type in tenantTypes" :key="type" :label="type" :value="type" />
          </el-select>
        </el-form-item>
        <el-form-item label="负责人">
          <el-input v-model="form.owner" />
        </el-form-item>
        <el-form-item label="账号对接">
          <el-checkbox v-model="form.ldap">LDAP 集成</el-checkbox>
          <el-checkbox v-model="form.sso">SSO 单点登录</el-checkbox>
        </el-form-item>
        <el-form-item label="接入系统">
          <el-select v-model="form.systems" multiple class="w-full">
            <el-option v-for="system in systemPool" :key="system" :label="system" :value="system" />
          </el-select>
        </el-form-item>
        <el-form-item label="有效期至">
          <el-date-picker v-model="form.expireDate" type="date" value-format="YYYY-MM-DD" class="w-full" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editorVisible = false">取消</el-button>
        <el-button type="danger" @click="saveForm">保存</el-button>
      </template>
    </el-drawer>

    <el-drawer v-model="quotaVisible" title="资源配额管理" size="460px">
      <el-form :model="quotaForm" label-width="110px">
        <el-form-item label="存储配额">
          <el-input-number v-model="quotaForm.storageQuota" :min="64" :max="8192" :step="64" /> GB
        </el-form-item>
        <el-form-item label="任务并发数">
          <el-input-number v-model="quotaForm.taskConcurrency" :min="1" :max="32" :step="1" /> 个
        </el-form-item>
        <el-form-item label="计算资源">
          <el-input-number v-model="quotaForm.cpu" :min="1" :max="64" :step="1" /> 核
        </el-form-item>
      </el-form>
      <div class="section-title mt-8">隔离说明</div>
      <div class="dep-text">该租户存储、计算、调度资源独立隔离，配额调整后立即生效（Mock）</div>
      <template #footer>
        <el-button @click="quotaVisible = false">取消</el-button>
        <el-button type="danger" @click="saveQuota">保存配额</el-button>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, Search } from '@element-plus/icons-vue'
import { mockTenants, type Tenant } from '@/mock/security'

const tenantTypes = ['设计单位', '监理单位', '施工单位', '运营单位', '研究机构', '政府部门']
const systemPool = ['票务系统', '客流系统', '设备系统', '建设系统']

const keyword = ref('')
const filterType = ref('')
const filterStatus = ref('')
const currentPage = ref(1)
const pageSize = 20
const editorVisible = ref(false)
const quotaVisible = ref(false)
const editing = ref(false)

const tenants = ref([...mockTenants])

const form = reactive({
  name: '',
  type: '设计单位',
  owner: '',
  ldap: false,
  sso: false,
  systems: [] as string[],
  expireDate: '',
})

const quotaForm = reactive({
  storageQuota: 2048,
  taskConcurrency: 4,
  cpu: 8,
})

const filteredTenants = computed(() =>
  tenants.value.filter((tenant) => {
    if (filterType.value && tenant.type !== filterType.value) return false
    if (filterStatus.value && tenant.status !== filterStatus.value) return false
    if (!keyword.value) return true
    const kw = keyword.value.toLowerCase()
    return tenant.name.toLowerCase().includes(kw) || tenant.owner.toLowerCase().includes(kw)
  }),
)

const pagedTenants = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredTenants.value.slice(start, start + pageSize)
})

const changePage = (page: number) => {
  currentPage.value = page
}

watch([keyword, filterType, filterStatus], () => {
  currentPage.value = 1
})

const openCreate = () => {
  editing.value = false
  Object.assign(form, { name: '', type: '设计单位', owner: '', ldap: false, sso: false, systems: [], expireDate: '2027-12-31' })
  editorVisible.value = true
}

const openEdit = (row: Tenant) => {
  editing.value = true
  Object.assign(form, {
    name: row.name,
    type: row.type,
    owner: row.owner,
    ldap: row.ldap,
    sso: row.sso,
    systems: [...row.systems],
    expireDate: row.expireDate,
  })
  editorVisible.value = true
}

const saveForm = () => {
  if (!form.name.trim()) {
    ElMessage.warning('请输入租户名称')
    return
  }
  if (editing.value) {
    ElMessage.success(`租户「${form.name}」已更新（Mock）`)
  } else {
    tenants.value.unshift({
      id: `t-mock-${Date.now()}`,
      name: form.name,
      type: form.type as Tenant['type'],
      status: '启用',
      ldap: form.ldap,
      sso: form.sso,
      storageQuota: 2048,
      storageUsed: 0,
      taskConcurrency: 4,
      owner: form.owner,
      expireDate: form.expireDate,
      createTime: new Date().toLocaleString('sv-SE').replace('T', ' '),
      systems: [...form.systems],
    })
    ElMessage.success('租户已新增（Mock）')
  }
  editorVisible.value = false
}

const openQuota = (row: Tenant) => {
  Object.assign(quotaForm, { storageQuota: row.storageQuota, taskConcurrency: row.taskConcurrency, cpu: row.taskConcurrency * 2 })
  quotaVisible.value = true
}

const saveQuota = () => {
  quotaVisible.value = false
  ElMessage.success('资源配额已更新（Mock）')
}

const toggleTenant = (row: Tenant) => {
  row.status = row.status === '启用' ? '停用' : '启用'
  ElMessage.info(`租户「${row.name}」已${row.status}（Mock）`)
}

const removeTenant = (row: Tenant) => {
  tenants.value = tenants.value.filter((item) => item.id !== row.id)
  ElMessage.success(`租户「${row.name}」已删除（Mock）`)
}
</script>