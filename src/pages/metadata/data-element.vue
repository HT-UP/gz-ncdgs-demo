<template>
  <div class="standard-page">
    <el-card class="panel-card dashboard-card" shadow="never">
      <template #header>
        <div class="panel-header">
          <span>数据元管理</span>
          <el-button type="danger" :icon="Plus" @click="openCreate">新增数据元</el-button>
        </div>
      </template>

      <div class="toolbar-row">
        <el-input
          v-model="keyword"
          placeholder="按名称 / 标识符搜索"
          clearable
          class="search-input"
          :prefix-icon="Search"
          @input="resetPagination"
        />
        <el-select v-model="filterDomain" placeholder="业务域" clearable class="filter-select" @change="resetPagination">
          <el-option v-for="domain in domains" :key="domain" :label="domain" :value="domain" />
        </el-select>
        <el-select v-model="filterStatus" placeholder="状态" clearable class="filter-select" @change="resetPagination">
          <el-option v-for="status in statuses" :key="status" :label="status" :value="status" />
        </el-select>
        <el-select v-model="filterDataType" placeholder="数据类型" clearable class="filter-select" @change="resetPagination">
          <el-option v-for="type in dataTypes" :key="type" :label="type" :value="type" />
        </el-select>
      </div>

      <el-table :data="pagedElements" stripe class="mt-12" @row-click="showDetail">
        <el-table-column prop="identifier" label="标识符" width="140" />
        <el-table-column prop="name" label="数据元名称" min-width="140" />
        <el-table-column prop="dataType" label="类型" width="90" />
        <el-table-column prop="length" label="长度" width="70" align="center" />
        <el-table-column prop="domain" label="业务域" width="100" />
        <el-table-column prop="owner" label="负责人" width="90" />
        <el-table-column label="状态" width="90">
          <template #default="{ row }">
            <el-tag :type="statusTagType[row.status]" effect="dark">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="引用字段" width="90" align="center">
          <template #default="{ row }">
            <el-link :underline="false" type="danger" @click.stop="showReferences(row)">{{ row.referencedCount }} 个</el-link>
          </template>
        </el-table-column>
        <el-table-column label="更新时间" width="150">
          <template #default="{ row }">{{ row.updateTime }}</template>
        </el-table-column>
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="{ row }">
            <el-button link type="danger" @click.stop="openEdit(row)">编辑</el-button>
            <el-button link type="danger" @click.stop="openReview(row)">审核</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        class="pager"
        layout="total, prev, pager, next, sizes"
        :total="filteredElements.length"
        :page-size="pageSize"
        :current-page="currentPage"
        :page-sizes="[20, 50, 100]"
        background
        @current-change="currentPage = $event"
        @size-change="handleSizeChange"
      />
    </el-card>

    <el-dialog v-model="editorVisible" :title="editing ? '编辑数据元' : '新增数据元'" width="560px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="标识符">
          <el-input v-model="form.identifier" placeholder="如 CUST_ID" @blur="checkIdentifier" />
          <div v-if="identifierTaken" class="form-error">该标识符已存在，请更换</div>
        </el-form-item>
        <el-form-item label="数据元名称">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="数据类型">
          <el-select v-model="form.dataType" class="w-full">
            <el-option v-for="type in dataTypes" :key="type" :label="type" :value="type" />
          </el-select>
        </el-form-item>
        <el-form-item label="长度">
          <el-input-number v-model="form.length" :min="1" :max="255" />
        </el-form-item>
        <el-form-item label="取值范围">
          <el-select v-model="form.range" class="w-full">
            <el-option label="必填" value="必填" />
            <el-option label="非必填" value="非必填" />
          </el-select>
        </el-form-item>
        <el-form-item label="约束条件">
          <el-select v-model="form.constraint" class="w-full">
            <el-option label="唯一约束" value="唯一约束" />
            <el-option label="无" value="无" />
          </el-select>
        </el-form-item>
        <el-form-item label="业务域">
          <el-select v-model="form.domain" class="w-full">
            <el-option v-for="domain in domains" :key="domain" :label="domain" :value="domain" />
          </el-select>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description" type="textarea" :rows="2" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editorVisible = false">取消</el-button>
        <el-button type="danger" @click="saveForm">保存</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="detailVisible" :title="detailRow?.name ?? '数据元详情'" width="620px">
      <el-descriptions v-if="detailRow" :column="2" border>
        <el-descriptions-item label="标识符">{{ detailRow.identifier }}</el-descriptions-item>
        <el-descriptions-item label="名称">{{ detailRow.name }}</el-descriptions-item>
        <el-descriptions-item label="数据类型">{{ detailRow.dataType }}</el-descriptions-item>
        <el-descriptions-item label="长度">{{ detailRow.length }}</el-descriptions-item>
        <el-descriptions-item label="取值范围">{{ detailRow.range }}</el-descriptions-item>
        <el-descriptions-item label="默认值">{{ detailRow.defaultValue }}</el-descriptions-item>
        <el-descriptions-item label="约束条件">{{ detailRow.constraint }}</el-descriptions-item>
        <el-descriptions-item label="业务域">{{ detailRow.domain }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="statusTagType[detailRow.status]" effect="dark">{{ detailRow.status }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="引用字段">{{ detailRow.referencedCount }} 个</el-descriptions-item>
        <el-descriptions-item label="描述" :span="2">{{ detailRow.description }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>

    <el-dialog v-model="referencesVisible" :title="`引用分析：${detailRow?.name ?? ''}`" width="560px">
      <el-table :data="referenceRows" stripe size="small">
        <el-table-column prop="tableName" label="源表" min-width="140" />
        <el-table-column prop="fieldName" label="字段" width="120" />
        <el-table-column prop="sourceName" label="所属数据源" min-width="130" />
        <el-table-column label="映射方式" width="100">
          <template #default="{ row }">{{ row.mode }}</template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, Search } from '@element-plus/icons-vue'
import { mockDataElements, type DataElement } from '@/mock/metadata'

const statuses = ['草稿', '待审核', '已发布', '已废止']
const domains = Array.from(new Set(mockDataElements.map((item) => item.domain)))
const dataTypes = Array.from(new Set(mockDataElements.map((item) => item.dataType)))

const statusTagType: Record<string, 'info' | 'warning' | 'success' | 'info'> = {
  草稿: 'info',
  待审核: 'warning',
  已发布: 'success',
  已废止: 'info',
}

const keyword = ref('')
const filterDomain = ref('')
const filterStatus = ref('')
const filterDataType = ref('')
const currentPage = ref(1)
const pageSize = ref(20)
const editorVisible = ref(false)
const detailVisible = ref(false)
const referencesVisible = ref(false)
const editing = ref<DataElement | null>(null)
const detailRow = ref<DataElement | null>(null)
const identifierTaken = ref(false)

const form = reactive({
  identifier: '',
  name: '',
  dataType: 'VARCHAR',
  length: 32,
  range: '必填',
  constraint: '无',
  domain: '客运管理',
  description: '',
})

const referenceRows = computed(() =>
  Array.from({ length: Math.min(detailRow.value?.referencedCount ?? 0, 8) }, (_, i) => ({
    tableName: `${['ticket', 'passenger', 'station', 'line'][i % 4]}_info_${i + 1}`,
    fieldName: detailRow.value?.identifier ?? 'FIELD',
    sourceName: ['票务核心库', '客流分析库', '车站信息库'][i % 3],
    mode: i % 2 === 0 ? '一对一' : '一对多',
  })),
)

const filteredElements = computed(() =>
  mockDataElements.filter((item) => {
    if (filterDomain.value && item.domain !== filterDomain.value) return false
    if (filterStatus.value && item.status !== filterStatus.value) return false
    if (filterDataType.value && item.dataType !== filterDataType.value) return false
    if (!keyword.value) return true
    const kw = keyword.value.toLowerCase()
    return (
      item.name.toLowerCase().includes(kw) ||
      item.identifier.toLowerCase().includes(kw)
    )
  }),
)

const pagedElements = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredElements.value.slice(start, start + pageSize.value)
})

const resetPagination = () => {
  currentPage.value = 1
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  resetPagination()
}

const checkIdentifier = () => {
  identifierTaken.value = mockDataElements.some(
    (item) => item.identifier.toLowerCase() === form.identifier.trim().toLowerCase() && item !== editing.value,
  )
}

const openCreate = () => {
  editing.value = null
  identifierTaken.value = false
  Object.assign(form, {
    identifier: '',
    name: '',
    dataType: 'VARCHAR',
    length: 32,
    range: '必填',
    constraint: '无',
    domain: '客运管理',
    description: '',
  })
  editorVisible.value = true
}

const openEdit = (row: DataElement) => {
  editing.value = row
  identifierTaken.value = false
  Object.assign(form, {
    identifier: row.identifier,
    name: row.name,
    dataType: row.dataType,
    length: row.length,
    range: row.range,
    constraint: row.constraint,
    domain: row.domain,
    description: row.description,
  })
  editorVisible.value = true
}

const saveForm = () => {
  if (!form.name.trim() || !form.identifier.trim()) {
    ElMessage.warning('请填写标识符和数据元名称')
    return
  }
  if (identifierTaken.value) {
    ElMessage.error('标识符已存在，请更换')
    return
  }
  if (editing.value) {
    Object.assign(editing.value, {
      identifier: form.identifier,
      name: form.name,
      dataType: form.dataType,
      length: form.length,
      range: form.range,
      constraint: form.constraint,
      domain: form.domain,
      description: form.description,
      status: '草稿',
    })
    ElMessage.success('数据元已更新，进入待审核（Mock）')
  } else {
    mockDataElements.unshift({
      id: `de-mock-${Date.now()}`,
      identifier: form.identifier,
      name: form.name,
      dataType: form.dataType,
      length: form.length,
      range: form.range,
      defaultValue: '-',
      constraint: form.constraint,
      status: '草稿',
      owner: '张三',
      domain: form.domain,
      referencedCount: 0,
      updateTime: new Date().toLocaleString('sv-SE').replace('T', ' '),
      description: form.description || '新建数据元',
    })
    ElMessage.success('数据元已新增，进入待审核（Mock）')
  }
  editorVisible.value = false
}

const openReview = (row: DataElement) => {
  if (row.status === '草稿' || row.status === '待审核') {
    row.status = '已发布'
    ElMessage.success(`数据元「${row.name}」已审核发布（Mock）`)
  } else {
    ElMessage.info(`数据元「${row.name}」当前状态为 ${row.status}，无需审核`)
  }
}

const showDetail = (row: DataElement) => {
  detailRow.value = row
  detailVisible.value = true
}

const showReferences = (row: DataElement) => {
  detailRow.value = row
  referencesVisible.value = true
}
</script>
