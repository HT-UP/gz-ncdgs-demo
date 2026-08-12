<template>
  <div class="standard-page">
    <el-row :gutter="16">
      <el-col :span="16">
        <el-card class="panel-card dashboard-card" shadow="never">
          <template #header>
            <div class="panel-header">
              <span>角色权限管理</span>
              <div class="panel-actions">
                <el-button type="danger" :icon="Plus" @click="openCreate">新增角色</el-button>
              </div>
            </div>
          </template>

          <div class="toolbar-row">
            <el-input
              v-model="keyword"
              placeholder="按角色名称 / 编码搜索"
              clearable
              class="search-input"
              :prefix-icon="Search"
            />
            <el-select v-model="filterLevel" placeholder="角色级别" clearable class="filter-select">
              <el-option v-for="level in levelPool" :key="level" :label="level" :value="level" />
            </el-select>
          </div>

          <el-table :data="pagedRoles" stripe class="mt-12">
            <el-table-column prop="name" label="角色名称" min-width="140">
              <template #default="{ row }">
                <span class="policy-subject">{{ row.name }}</span>
                <el-tag v-if="row.builtin" size="small" type="danger" effect="dark" class="ml-4">内置</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="code" label="编码" width="130" />
            <el-table-column label="级别" width="90">
              <template #default="{ row }">
                <span class="role-level-badge" :style="{ background: levelColor[row.level] }">{{ row.level }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="description" label="描述" min-width="180" />
            <el-table-column label="用户数" width="80" align="center">
              <template #default="{ row }">{{ row.userCount }}</template>
            </el-table-column>
            <el-table-column label="操作" width="260" fixed="right">
              <template #default="{ row }">
                <el-button link type="primary" @click="openPermission(row)">权限分配</el-button>
                <el-button link type="warning" @click="openUsers(row)">绑定用户</el-button>
                <el-button link type="info" @click="cloneRole(row)">克隆</el-button>
                <el-button link type="danger" @click="removeRole(row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-pagination
            class="pager"
            layout="total, prev, pager, next"
            :total="filteredRoles.length"
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
            <el-timeline-item
              v-for="item in roleChangeAudit"
              :key="`${item.time}-${item.action}`"
              :timestamp="item.time"
              :type="item.action === '分配权限' ? 'success' : item.action === '修改数据权限' ? 'warning' : 'primary'"
            >
              <div class="audit-item-title">{{ item.user }} {{ item.action }}</div>
              <div class="audit-item-action">{{ item.detail }}</div>
            </el-timeline-item>
          </el-timeline>
        </el-card>

        <el-card class="panel-card dashboard-card mt-16" shadow="never">
          <template #header>
            <div class="panel-header"><span>权限矩阵</span></div>
          </template>
          <el-table :data="matrixData" size="small" stripe>
            <el-table-column prop="role" label="角色" width="110" />
            <el-table-column v-for="col in matrixCols" :key="col" :label="col" width="70" align="center">
              <template #default="{ row }">
                <el-icon v-if="row[col]" color="#00A854" :size="15"><CircleCheck /></el-icon>
                <span v-else class="dep-text">—</span>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <el-drawer v-model="permVisible" :title="`权限分配：${currentRole?.name ?? ''}`" size="560px">
      <el-alert title="配置菜单权限、按钮权限与数据权限范围，保存后对绑定用户即时生效（Mock）" type="info" :closable="false" class="mb-16" />
      <el-form label-width="90px">
        <el-form-item label="数据权限">
          <el-radio-group v-model="permForm.dataScope">
            <el-radio v-for="scope in dataScopePool" :key="scope" :value="scope">{{ scope }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <el-tree
        ref="permTreeRef"
        :data="rolePermissionTree"
        show-checkbox
        node-key="key"
        default-expand-all
        :default-checked-keys="permForm.checkedKeys"
      />
      <template #footer>
        <el-button @click="permVisible = false">取消</el-button>
        <el-button type="danger" @click="savePermission">保存权限</el-button>
      </template>
    </el-drawer>

    <el-drawer v-model="usersVisible" :title="`绑定用户：${currentRole?.name ?? ''}`" size="480px">
      <div class="dep-text mb-8">当前已绑定 {{ currentRole?.userCount ?? 0 }} 名用户，勾选可添加 / 移除（Mock）</div>
      <el-checkbox-group v-model="boundUsers" class="role-user-group">
        <el-checkbox v-for="user in candidateUsers" :key="user.id" :value="user.id" class="role-user-item">
          {{ user.username }}（{{ user.realName }} · {{ user.tenant }}）
        </el-checkbox>
      </el-checkbox-group>
      <template #footer>
        <el-button @click="usersVisible = false">取消</el-button>
        <el-button type="danger" @click="saveUsers">保存绑定</el-button>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { CircleCheck, Plus, Search } from '@element-plus/icons-vue'
import { dataScopePool, mockRoles, roleChangeAudit, rolePermissionTree, type SystemRole } from '@/mock/system'

const keyword = ref('')
const filterLevel = ref('')
const currentPage = ref(1)
const pageSize = 20
const permVisible = ref(false)
const usersVisible = ref(false)

const roles = ref([...mockRoles])
const currentRole = ref<SystemRole | null>(null)
const permTreeRef = ref()

const levelPool = ['管理员', '治理员', '开发者', '只读']

const levelColor: Record<string, string> = {
  管理员: '#E34D59',
  治理员: '#2B6CB0',
  开发者: '#ED7B2F',
  只读: '#8C8C8C',
}

const permForm = reactive({
  dataScope: '本租户',
  checkedKeys: [] as string[],
})

const boundUsers = ref<string[]>([])
const candidateUsers = [
  { id: 'u1', username: 'admin', realName: '张三', tenant: '广州地铁设计研究院' },
  { id: 'u2', username: 'user2', realName: '李四', tenant: '轨道运营管理公司' },
  { id: 'u3', username: 'user3', realName: '王五', tenant: '广州盾构工程公司' },
  { id: 'u4', username: 'user4', realName: '赵六', tenant: '市交通运输局' },
  { id: 'u5', username: 'user5', realName: '孙七', tenant: '华南理工大学课题组' },
  { id: 'u6', username: 'user6', realName: '周八', tenant: '轨道运营管理公司' },
]

const filteredRoles = computed(() =>
  roles.value.filter((role) => {
    if (filterLevel.value && role.level !== filterLevel.value) return false
    if (!keyword.value) return true
    const kw = keyword.value.toLowerCase()
    return role.name.toLowerCase().includes(kw) || role.code.toLowerCase().includes(kw)
  }),
)

const pagedRoles = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredRoles.value.slice(start, start + pageSize)
})

const changePage = (page: number) => (currentPage.value = page)

watch([keyword, filterLevel], () => {
  currentPage.value = 1
})

const openCreate = () => {
  ElMessage.info('打开新增角色向导（Mock）')
}

const openPermission = (row: SystemRole) => {
  currentRole.value = row
  permForm.dataScope = '本租户'
  permForm.checkedKeys = ['dashboard:view', 'metadata:view', 'quality:view', 'resource:view', 'security:view', 'intelligence:view', 'system:user']
  permVisible.value = true
  setTimeout(() => {
    permTreeRef.value?.setCheckedKeys(permForm.checkedKeys)
  }, 100)
}

const savePermission = () => {
  const keys = permTreeRef.value?.getCheckedKeys(true) ?? []
  permVisible.value = false
  ElMessage.success(`角色「${currentRole.value?.name}」权限已保存，共 ${keys.length} 项（Mock）`)
}

const openUsers = (row: SystemRole) => {
  currentRole.value = row
  boundUsers.value = candidateUsers.slice(0, Math.min(row.userCount, 4)).map((user) => user.id)
  usersVisible.value = true
}

const saveUsers = () => {
  if (!currentRole.value) return
  currentRole.value.userCount = boundUsers.value.length
  usersVisible.value = false
  ElMessage.success(`角色「${currentRole.value.name}」已绑定 ${boundUsers.value.length} 名用户（Mock）`)
}

const cloneRole = (row: SystemRole) => {
  roles.value.unshift({
    ...row,
    id: `role-clone-${Date.now()}`,
    name: `${row.name}-副本`,
    builtin: false,
    userCount: 0,
  })
  ElMessage.success(`角色「${row.name}」已克隆为「${row.name}-副本」（Mock）`)
}

const removeRole = (row: SystemRole) => {
  roles.value = roles.value.filter((item) => item.id !== row.id)
  ElMessage.success(`角色「${row.name}」已删除（Mock）`)
}

const matrixCols = ['元数据', '数据质量', '数据资源', '数据安全', '智能治理', '系统管理']
const matrixData = [
  { role: '超级管理员', ...Object.fromEntries(matrixCols.map((col) => [col, true])) },
  { role: '数据治理员', 元数据: true, 数据质量: true, 数据资源: true, 数据安全: false, 智能治理: true, 系统管理: false },
  { role: '数据开发', 元数据: true, 数据质量: true, 数据资源: true, 数据安全: false, 智能治理: false, 系统管理: false },
  { role: '只读用户', 元数据: true, 数据质量: false, 数据资源: true, 数据安全: false, 智能治理: false, 系统管理: false },
]
</script>