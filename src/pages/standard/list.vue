<template>
  <div class="standard-page">
    <el-card class="panel-card dashboard-card" shadow="never">
      <template #header>
        <div class="panel-header">
          <span>标准列表</span>
          <el-button type="danger" :icon="Plus" @click="openCreate">新增标准</el-button>
        </div>
      </template>

      <el-tabs v-model="activeCategory" @tab-change="resetPagination">
        <el-tab-pane v-for="category in categories" :key="category" :label="category" :name="category" />
      </el-tabs>

      <div class="toolbar-row">
        <el-input
          v-model="keyword"
          placeholder="按名称 / 编码搜索"
          clearable
          class="search-input"
          :prefix-icon="Search"
          @input="resetPagination"
        />
        <el-select v-model="filterDomain" placeholder="业务域" clearable class="filter-select" @change="resetPagination">
          <el-option v-for="domain in domains" :key="domain" :label="domain" :value="domain" />
        </el-select>
        <el-select v-model="filterOwner" placeholder="责任人" clearable class="filter-select" @change="resetPagination">
          <el-option v-for="owner in owners" :key="owner" :label="owner" :value="owner" />
        </el-select>
        <el-select v-model="filterStatus" placeholder="状态" clearable class="filter-select" @change="resetPagination">
          <el-option v-for="status in statuses" :key="status" :label="status" :value="status" />
        </el-select>
      </div>

      <el-table :data="pagedStandards" stripe class="mt-12" @row-click="showDetail">
        <el-table-column prop="code" label="标准编码" width="110" />
        <el-table-column prop="name" label="标准名称" min-width="180" />
        <el-table-column prop="category" label="类型" width="110" />
        <el-table-column prop="domain" label="业务域" width="110" />
        <el-table-column prop="owner" label="责任人" width="90" />
        <el-table-column prop="version" label="版本" width="80" />
        <el-table-column label="映射字段" width="90" align="center">
          <template #default="{ row }">
            <span :class="{ 'no-mapping': row.mappedFields === 0 }">
              {{ row.mappedFields === 0 ? '未映射' : `${row.mappedFields} 个` }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="90">
          <template #default="{ row }">
            <el-tag :type="statusTagType[row.status as keyof typeof statusTagType]" effect="dark">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="更新时间" width="150">
          <template #default="{ row }">{{ row.updateTime }}</template>
        </el-table-column>
        <el-table-column label="操作" width="140" fixed="right">
          <template #default="{ row }">
            <el-button link type="danger" @click.stop="openEdit(row)">编辑</el-button>
            <el-button link type="danger" @click.stop="confirmDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        class="pager"
        layout="total, prev, pager, next, sizes"
        :total="filteredStandards.length"
        :page-size="pageSize"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50]"
        background
        @current-change="currentPage = $event"
        @size-change="handleSizeChange"
      />
    </el-card>

    <el-dialog v-model="editorVisible" :title="editing ? '编辑标准' : '新增标准'" width="560px">
      <el-form :model="form" label-width="90px">
        <el-form-item label="标准名称">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="form.category" class="filter-select">
            <el-option v-for="category in categories" :key="category" :label="category" :value="category" />
          </el-select>
        </el-form-item>
        <el-form-item label="业务域">
          <el-select v-model="form.domain" class="filter-select">
            <el-option v-for="domain in domains" :key="domain" :label="domain" :value="domain" />
          </el-select>
        </el-form-item>
        <el-form-item label="责任人">
          <el-select v-model="form.owner" class="filter-select">
            <el-option v-for="owner in owners" :key="owner" :label="owner" :value="owner" />
          </el-select>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editorVisible = false">取消</el-button>
        <el-button type="danger" @click="saveForm">保存</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="detailVisible" :title="detailRow?.name ?? '标准详情'" width="560px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="标准编码">{{ detailRow?.code }}</el-descriptions-item>
        <el-descriptions-item label="类型">{{ detailRow?.category }}</el-descriptions-item>
        <el-descriptions-item label="业务域">{{ detailRow?.domain }}</el-descriptions-item>
        <el-descriptions-item label="责任人">{{ detailRow?.owner }}</el-descriptions-item>
        <el-descriptions-item label="版本">{{ detailRow?.version }}</el-descriptions-item>
        <el-descriptions-item label="映射字段">{{ detailRow?.mappedFields }} 个</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag
            v-if="detailRow"
            :type="statusTagType[detailRow.status as keyof typeof statusTagType]"
            effect="dark"
          >
            {{ detailRow.status }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="更新时间">{{ detailRow?.updateTime }}</el-descriptions-item>
        <el-descriptions-item label="描述" :span="2">{{ detailRow?.description }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search } from '@element-plus/icons-vue'
import {
  mockStandards,
  standardCategoryOptions,
  type StandardCategory,
  type StandardItem,
} from '@/mock/standard'

const categories = standardCategoryOptions.map((item) => item.value)
const domains = Array.from(new Set(mockStandards.map((item) => item.domain)))
const owners = Array.from(new Set(mockStandards.map((item) => item.owner)))
const statuses = Array.from(new Set(mockStandards.map((item) => item.status)))

const statusTagType = {
  草稿: 'info',
  审核中: 'warning',
  已发布: 'success',
  已废止: 'danger',
}

const activeCategory = ref<StandardCategory>('业务术语')
const keyword = ref('')
const filterDomain = ref('')
const filterOwner = ref('')
const filterStatus = ref('')
const currentPage = ref(1)
const pageSize = ref(20)

const editorVisible = ref(false)
const detailVisible = ref(false)
const editing = ref<StandardItem | null>(null)
const detailRow = ref<StandardItem | null>(null)

const form = reactive({
  name: '',
  category: '业务术语' as StandardCategory,
  domain: '客运管理',
  owner: '张三',
  description: '',
})

const filteredStandards = computed(() =>
  mockStandards.filter((item) => {
    if (item.category !== activeCategory.value) return false
    if (keyword.value) {
      const kw = keyword.value.toLowerCase()
      if (!item.name.toLowerCase().includes(kw) && !item.code.toLowerCase().includes(kw)) return false
    }
    if (filterDomain.value && item.domain !== filterDomain.value) return false
    if (filterOwner.value && item.owner !== filterOwner.value) return false
    if (filterStatus.value && item.status !== filterStatus.value) return false
    return true
  }),
)

const pagedStandards = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredStandards.value.slice(start, start + pageSize.value)
})

const resetPagination = () => {
  currentPage.value = 1
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  resetPagination()
}

const openCreate = () => {
  editing.value = null
  Object.assign(form, { name: '', category: activeCategory.value, domain: domains[0], owner: owners[0], description: '' })
  editorVisible.value = true
}

const openEdit = (row: StandardItem) => {
  editing.value = row
  Object.assign(form, {
    name: row.name,
    category: row.category,
    domain: row.domain,
    owner: row.owner,
    description: row.description,
  })
  editorVisible.value = true
}

const saveForm = () => {
  if (!form.name.trim()) {
    ElMessage.warning('请输入标准名称')
    return
  }
  if (editing.value) {
    editing.value.name = form.name
    editing.value.category = form.category
    editing.value.domain = form.domain
    editing.value.owner = form.owner
    editing.value.description = form.description
    ElMessage.success('标准已更新（Mock）')
  } else {
    mockStandards.unshift({
      id: `mock-${Date.now()}`,
      code: `BZ-${String(mockStandards.length + 1).padStart(4, '0')}`,
      name: form.name,
      category: form.category,
      domain: form.domain,
      owner: form.owner,
      status: '草稿',
      updateTime: new Date().toLocaleString('sv-SE').replace('T', ' '),
      version: 'V1.0',
      mappedFields: 0,
      description: form.description || '新建标准',
    })
    ElMessage.success('标准已新增（Mock）')
  }
  editorVisible.value = false
}

const confirmDelete = (row: StandardItem) => {
  ElMessageBox.confirm(`确认删除标准「${row.name}」吗？`, '删除确认', { type: 'warning' })
    .then(() => {
      const index = mockStandards.indexOf(row)
      if (index > -1) mockStandards.splice(index, 1)
      ElMessage.success('标准已删除（Mock）')
    })
    .catch(() => {})
}

const showDetail = (row: StandardItem) => {
  detailRow.value = row
  detailVisible.value = true
}
</script>
