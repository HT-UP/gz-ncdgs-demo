<template>
  <div class="standard-page">
    <el-row :gutter="16">
      <el-col :xs="24" :lg="9">
        <el-card class="panel-card dashboard-card" shadow="never">
          <template #header>
            <div class="panel-header">
              <span>分组树</span>
              <el-button type="danger" size="small" :icon="Plus" @click="openCreateGroup">新增分组</el-button>
            </div>
          </template>
          <div class="group-tree-wrap">
            <div class="group-tree-node">
              <div class="group-tree-title">
                <el-icon :size="16"><Folder /></el-icon>
                <span>全部数据源</span>
                <el-tag size="small" effect="plain">{{ mockDataSources.length }}</el-tag>
              </div>
              <div
                v-for="group in groups"
                :key="group.id"
                class="group-tree-child"
                @dragover.prevent
                @drop="handleDrop(group.id)"
              >
                <div class="group-tree-title">
                  <el-icon :size="16"><FolderOpened /></el-icon>
                  <span>{{ group.name }}</span>
                  <el-tag size="small" effect="plain">{{ group.count }}</el-tag>
                  <div class="group-actions">
                    <el-button link type="danger" size="small" @click="editGroup(group)">编辑</el-button>
                    <el-button link type="danger" size="small" @click="removeGroup(group)">删除</el-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="drag-tip">
            <el-icon><InfoFilled /></el-icon>
            <span>拖拽下方数据源卡片到分组即可移动</span>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :lg="15">
        <el-card class="panel-card dashboard-card" shadow="never">
          <template #header>
            <div class="panel-header">
              <span>分组权限控制</span>
              <div class="panel-actions">
                <el-select v-model="permissionGroup" class="filter-select" size="small">
                  <el-option v-for="group in groups" :key="group.id" :label="group.name" :value="group.id" />
                </el-select>
              </div>
            </div>
          </template>
          <div class="permission-row">
            <span class="permission-label">可管理用户</span>
            <el-tag
              v-for="user in selectedGroupUsers"
              :key="user"
              closable
              effect="plain"
              type="danger"
              @close="removeUser(user)"
            >
              {{ user }}
            </el-tag>
            <el-select v-model="pendingUser" placeholder="添加用户" size="small" class="permission-add" @change="addUser">
              <el-option v-for="user in allUsers" :key="user" :label="user" :value="user" />
            </el-select>
          </div>
          <div class="permission-row">
            <span class="permission-label">可访问用户</span>
            <el-tag
              v-for="user in selectedGroupReaders"
              :key="user"
              closable
              effect="plain"
              type="info"
              @close="removeReader(user)"
            >
              {{ user }}
            </el-tag>
            <el-select v-model="pendingReader" placeholder="添加用户" size="small" class="permission-add" @change="addReader">
              <el-option v-for="user in allUsers" :key="user" :label="user" :value="user" />
            </el-select>
          </div>
          <div class="permission-actions">
            <el-button type="danger" size="small" @click="savePermission">保存授权</el-button>
          </div>
        </el-card>

        <el-card class="panel-card dashboard-card mt-16" shadow="never">
          <template #header>
            <div class="panel-header">
              <span>分组内数据源</span>
            </div>
          </template>
          <div class="ds-mini-grid">
            <div
              v-for="item in activeGroupSources"
              :key="item.id"
              class="ds-mini-card"
              draggable="true"
              @dragstart="dragId = item.id"
            >
              <div class="ds-card-name">{{ item.name }}</div>
              <div class="ds-card-meta">{{ item.type }} · {{ item.env }}</div>
            </div>
          </div>
          <el-empty v-if="activeGroupSources.length === 0" description="该分组下暂无数据源" :image-size="70" />
        </el-card>
      </el-col>
    </el-row>

    <el-dialog v-model="groupEditorVisible" :title="editingGroup ? '编辑分组' : '新增分组'" width="460px">
      <el-form :model="groupForm" label-width="90px">
        <el-form-item label="分组名称">
          <el-input v-model="groupForm.name" />
        </el-form-item>
        <el-form-item label="分组描述">
          <el-input v-model="groupForm.description" type="textarea" :rows="2" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="groupEditorVisible = false">取消</el-button>
        <el-button type="danger" @click="saveGroup">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Folder, FolderOpened, InfoFilled, Plus } from '@element-plus/icons-vue'
import { mockDataSources } from '@/mock/datasource'

type DataGroup = {
  id: string
  name: string
  description: string
  count: number
  users: string[]
  readers: string[]
}

const groups = ref<DataGroup[]>([
  { id: 'g1', name: '客运数据组', description: '客运业务相关数据源', count: 0, users: ['张三', '李四'], readers: ['王五'] },
  { id: 'g2', name: '建设数据组', description: '建设期业务数据源', count: 0, users: ['李四'], readers: ['张三', '赵六'] },
  { id: 'g3', name: '设备数据组', description: '设备设施数据源', count: 0, users: ['王五', '赵六'], readers: [] },
  { id: 'g4', name: '财务数据组', description: '财务资产数据源', count: 0, users: ['孙七'], readers: ['张三'] },
])

const permissionGroup = ref('g1')
const pendingUser = ref('')
const pendingReader = ref('')
const groupEditorVisible = ref(false)
const editingGroup = ref<DataGroup | null>(null)
const dragId = ref('')

const groupForm = reactive({ name: '', description: '' })

const allUsers = ['张三', '李四', '王五', '赵六', '孙七', '周八']

const selectedGroup = computed(() => groups.value.find((group) => group.id === permissionGroup.value) ?? groups.value[0])
const selectedGroupUsers = computed(() => selectedGroup.value.users)
const selectedGroupReaders = computed(() => selectedGroup.value.readers)

const activeGroupSources = computed(() =>
  mockDataSources.filter((item) => item.groupName === selectedGroup.value.name),
)

const handleDrop = (groupId: string) => {
  const source = mockDataSources.find((item) => item.id === dragId.value)
  if (!source) return
  const group = groups.value.find((item) => item.id === groupId)
  if (!group) return
  const oldGroup = groups.value.find((item) => item.name === source.groupName)
  source.groupName = group.name
  if (oldGroup) oldGroup.count = mockDataSources.filter((item) => item.groupName === oldGroup.name).length
  group.count = mockDataSources.filter((item) => item.groupName === group.name).length
  ElMessage.success(`「${source.name}」已移动到「${group.name}」`)
}

const openCreateGroup = () => {
  editingGroup.value = null
  Object.assign(groupForm, { name: '', description: '' })
  groupEditorVisible.value = true
}

const editGroup = (group: DataGroup) => {
  editingGroup.value = group
  Object.assign(groupForm, { name: group.name, description: group.description })
  groupEditorVisible.value = true
}

const saveGroup = () => {
  if (!groupForm.name.trim()) {
    ElMessage.warning('请输入分组名称')
    return
  }
  if (editingGroup.value) {
    editingGroup.value.name = groupForm.name
    editingGroup.value.description = groupForm.description
  } else {
    groups.value.push({
      id: `g${Date.now()}`,
      name: groupForm.name,
      description: groupForm.description,
      count: 0,
      users: [],
      readers: [],
    })
  }
  groupEditorVisible.value = false
  ElMessage.success('分组已保存（Mock）')
}

const removeGroup = (group: DataGroup) => {
  ElMessageBox.confirm(`确认删除分组「${group.name}」吗？分组内数据源不会删除。`, '删除确认', { type: 'warning' })
    .then(() => {
      groups.value = groups.value.filter((item) => item.id !== group.id)
      ElMessage.success('分组已删除（Mock）')
    })
    .catch(() => {})
}

const addUser = (user: string) => {
  if (user && !selectedGroup.value.users.includes(user)) {
    selectedGroup.value.users.push(user)
  }
  pendingUser.value = ''
}

const removeUser = (user: string) => {
  selectedGroup.value.users = selectedGroup.value.users.filter((item) => item !== user)
}

const addReader = (user: string) => {
  if (user && !selectedGroup.value.readers.includes(user)) {
    selectedGroup.value.readers.push(user)
  }
  pendingReader.value = ''
}

const removeReader = (user: string) => {
  selectedGroup.value.readers = selectedGroup.value.readers.filter((item) => item !== user)
}

const savePermission = () => {
  ElMessage.success(`「${selectedGroup.value.name}」授权已保存（Mock）`)
}
</script>
