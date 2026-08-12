<template>
  <div class="standard-page">
    <el-card class="panel-card dashboard-card" shadow="never">
      <template #header>
        <div class="panel-header">
          <span>用户管理</span>
          <div class="panel-actions">
            <el-button :icon="Upload" @click="importUsers">批量导入</el-button>
            <el-button :icon="Download" @click="exportUsers">导出用户</el-button>
            <el-button type="danger" :icon="Plus" @click="openCreate">新增用户</el-button>
          </div>
        </div>
      </template>

      <div class="toolbar-row">
        <el-input
          v-model="keyword"
          placeholder="按用户名 / 姓名 / 手机号搜索"
          clearable
          class="search-input"
          :prefix-icon="Search"
        />
        <el-select v-model="filterTenant" placeholder="所属租户" clearable class="filter-select">
          <el-option v-for="tenant in tenantPool" :key="tenant" :label="tenant" :value="tenant" />
        </el-select>
        <el-select v-model="filterStatus" placeholder="状态" clearable class="filter-select">
          <el-option label="启用" value="启用" />
          <el-option label="停用" value="停用" />
        </el-select>
      </div>

      <el-table :data="pagedUsers" stripe class="mt-12">
        <el-table-column prop="username" label="用户名" width="110">
          <template #default="{ row }">
            <span class="policy-subject">{{ row.username }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="realName" label="姓名" width="80" />
        <el-table-column prop="dept" label="部门" width="100" />
        <el-table-column prop="tenant" label="所属租户" min-width="150" />
        <el-table-column label="角色" min-width="140">
          <template #default="{ row }">
            <el-tag
              v-for="role in row.roles"
              :key="role"
              size="small"
              :type="roleTagType[role]"
              effect="plain"
              class="mr-4"
            >{{ role }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === '启用' ? 'success' : 'info'" effect="dark" size="small">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="账号对接" width="130">
          <template #default="{ row }">
            <el-tag v-if="row.sso" size="small" type="primary" effect="plain" class="mr-4">SSO</el-tag>
            <el-tag v-if="row.ldap" size="small" effect="plain">LDAP</el-tag>
            <span v-if="!row.sso && !row.ldap" class="dep-text">本地</span>
          </template>
        </el-table-column>
        <el-table-column label="最近登录" width="160">
          <template #default="{ row }">
            <div>{{ row.lastLoginTime }}</div>
            <div class="dep-text">{{ row.lastLoginIp }}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="240" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
            <el-button link type="warning" @click="openLoginRecord(row)">登录记录</el-button>
            <el-button link type="success" @click="toggleUser(row)">{{ row.status === '启用' ? '停用' : '启用' }}</el-button>
            <el-button link type="danger" @click="removeUser(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        class="pager"
        layout="total, prev, pager, next"
        :total="filteredUsers.length"
        :page-size="pageSize"
        :current-page="currentPage"
        background
        @current-change="changePage"
      />
    </el-card>

    <el-drawer v-model="editorVisible" :title="editing ? '编辑用户' : '新增用户'" size="540px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="用户名">
          <el-input v-model="form.username" :disabled="editing" />
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="form.realName" />
        </el-form-item>
        <el-form-item label="所属部门">
          <el-select v-model="form.dept" class="w-full">
            <el-option v-for="dept in deptPool" :key="dept" :label="dept" :value="dept" />
          </el-select>
        </el-form-item>
        <el-form-item label="所属租户">
          <el-select v-model="form.tenant" class="w-full">
            <el-option v-for="tenant in tenantPool" :key="tenant" :label="tenant" :value="tenant" />
          </el-select>
        </el-form-item>
        <el-form-item label="分配角色">
          <el-select v-model="form.roles" multiple class="w-full">
            <el-option v-for="role in rolePool" :key="role" :label="role" :value="role" />
          </el-select>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="form.phone" />
        </el-form-item>
        <el-form-item label="账号对接">
          <el-checkbox v-model="form.sso">SSO 单点登录</el-checkbox>
          <el-checkbox v-model="form.ldap">LDAP 集成</el-checkbox>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editorVisible = false">取消</el-button>
        <el-button type="danger" @click="saveForm">保存</el-button>
      </template>
    </el-drawer>

    <el-drawer v-model="loginVisible" title="登录记录" size="480px">
      <div class="section-title mb-8">{{ currentUser?.username }}（{{ currentUser?.realName }}）最近登录</div>
      <el-table :data="loginRecords" stripe size="small">
        <el-table-column prop="time" label="时间" width="170" />
        <el-table-column prop="device" label="设备" min-width="130" />
        <el-table-column prop="ip" label="IP" width="120" />
        <el-table-column label="结果" width="110">
          <template #default="{ row }">
            <span :class="row.result === '成功' ? 'audit-success' : 'audit-fail'">{{ row.result }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-drawer>

    <el-drawer v-model="policyVisible" title="密码策略配置" size="480px">
      <el-form :model="passwordPolicy" label-width="130px">
        <el-form-item label="最小长度">
          <el-input-number v-model="passwordPolicy.minLength" :min="6" :max="32" /> 位
        </el-form-item>
        <el-form-item label="复杂度要求">
          <el-select v-model="passwordPolicy.complexity" class="w-full">
            <el-option label="需含大小写字母 + 数字" :value="3" />
            <el-option label="需含字母 + 数字" :value="2" />
            <el-option label="仅字母数字" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="定期修改周期">
          <el-input-number v-model="passwordPolicy.expireDays" :min="30" :max="180" :step="30" /> 天
        </el-form-item>
        <el-form-item label="禁止重复次数">
          <el-input-number v-model="passwordPolicy.history" :min="1" :max="10" /> 次
        </el-form-item>
        <el-form-item label="连续失败锁定">
          <el-input-number v-model="passwordPolicy.lockAttempts" :min="3" :max="10" /> 次
        </el-form-item>
        <el-form-item label="锁定时长">
          <el-input-number v-model="passwordPolicy.lockMinutes" :min="5" :max="120" :step="5" /> 分钟
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="policyVisible = false">取消</el-button>
        <el-button type="danger" @click="savePolicy">保存策略</el-button>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Download, Plus, Search, Upload } from '@element-plus/icons-vue'
import { loginRecords, mockUsers, passwordPolicy as mockPolicy, type SystemUser } from '@/mock/system'

const keyword = ref('')
const filterTenant = ref('')
const filterStatus = ref('')
const currentPage = ref(1)
const pageSize = 20
const editorVisible = ref(false)
const loginVisible = ref(false)
const policyVisible = ref(false)
const editing = ref(false)

const users = ref([...mockUsers])
const currentUser = ref<SystemUser | null>(null)

const tenantPool = ['广州地铁设计研究院', '轨道运营管理公司', '广州盾构工程公司', '市交通运输局', '华南理工大学课题组']
const deptPool = ['信息中心', '数据治理部', '业务运营部', '综合管理部']
const rolePool = ['系统管理员', '数据治理员', '数据开发', '只读用户']

const roleTagType: Record<string, 'danger' | 'primary' | 'warning' | 'info'> = {
  系统管理员: 'danger',
  数据治理员: 'primary',
  数据开发: 'warning',
  只读用户: 'info',
}

const passwordPolicy = reactive({ ...mockPolicy })

const form = reactive({
  username: '',
  realName: '',
  dept: '信息中心',
  tenant: tenantPool[0],
  roles: [] as string[],
  phone: '',
  sso: false,
  ldap: false,
})

const filteredUsers = computed(() =>
  users.value.filter((user) => {
    if (filterTenant.value && user.tenant !== filterTenant.value) return false
    if (filterStatus.value && user.status !== filterStatus.value) return false
    if (!keyword.value) return true
    const kw = keyword.value.toLowerCase()
    return (
      user.username.toLowerCase().includes(kw) ||
      user.realName.toLowerCase().includes(kw) ||
      user.phone.toLowerCase().includes(kw)
    )
  }),
)

const pagedUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredUsers.value.slice(start, start + pageSize)
})

const changePage = (page: number) => (currentPage.value = page)

watch([keyword, filterTenant, filterStatus], () => {
  currentPage.value = 1
})

const openCreate = () => {
  editing.value = false
  Object.assign(form, { username: '', realName: '', dept: '信息中心', tenant: tenantPool[0], roles: [], phone: '', sso: false, ldap: false })
  editorVisible.value = true
}

const openEdit = (row: SystemUser) => {
  editing.value = true
  Object.assign(form, {
    username: row.username,
    realName: row.realName,
    dept: row.dept,
    tenant: row.tenant,
    roles: [...row.roles],
    phone: row.phone,
    sso: row.sso,
    ldap: row.ldap,
  })
  editorVisible.value = true
}

const saveForm = () => {
  if (!form.username.trim() || !form.realName.trim()) {
    ElMessage.warning('请输入用户名和姓名')
    return
  }
  if (editing.value) {
    ElMessage.success(`用户「${form.username}」已更新（Mock）`)
  } else {
    users.value.unshift({
      id: `usr-mock-${Date.now()}`,
      username: form.username,
      realName: form.realName,
      dept: form.dept,
      tenant: form.tenant,
      roles: [...form.roles],
      status: '启用',
      sso: form.sso,
      ldap: form.ldap,
      phone: form.phone,
      lastLoginTime: '—',
      lastLoginIp: '—',
      createTime: new Date().toLocaleString('sv-SE').replace('T', ' '),
      pwdExpireDays: passwordPolicy.expireDays,
    })
    ElMessage.success('用户已新增（Mock）')
  }
  editorVisible.value = false
}

const toggleUser = (row: SystemUser) => {
  row.status = row.status === '启用' ? '停用' : '启用'
  ElMessage.info(`用户「${row.username}」已${row.status}（Mock）`)
}

const removeUser = (row: SystemUser) => {
  users.value = users.value.filter((item) => item.id !== row.id)
  ElMessage.success(`用户「${row.username}」已删除（Mock）`)
}

const openLoginRecord = (row: SystemUser) => {
  currentUser.value = row
  loginVisible.value = true
}

const importUsers = () => ElMessage.success('批量导入模板已下载，请按模板填写后上传（Mock）')
const exportUsers = () => ElMessage.success('用户列表已导出为 Excel（Mock）')
const savePolicy = () => {
  policyVisible.value = false
  ElMessage.success('密码策略已保存并即时生效（Mock）')
}
</script>