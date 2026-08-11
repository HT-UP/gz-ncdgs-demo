<template>
  <div class="standard-page">
    <el-card class="panel-card dashboard-card" shadow="never">
      <template #header>
        <div class="panel-header">
          <span>数据源列表</span>
          <div class="panel-actions">
            <el-radio-group v-model="viewMode" size="small">
              <el-radio-button label="card">卡片视图</el-radio-button>
              <el-radio-button label="table">列表视图</el-radio-button>
            </el-radio-group>
          </div>
        </div>
      </template>

      <div class="toolbar-row">
        <el-input
          v-model="keyword"
          placeholder="按名称 / 主机搜索"
          clearable
          class="search-input"
          :prefix-icon="Search"
          @input="resetPagination"
        />
        <el-select v-model="filterStatus" placeholder="状态" clearable class="filter-select" @change="resetPagination">
          <el-option v-for="status in statuses" :key="status" :label="status" :value="status" />
        </el-select>
        <el-select v-model="filterType" placeholder="类型" clearable class="filter-select" @change="resetPagination">
          <el-option v-for="type in types" :key="type" :label="type" :value="type" />
        </el-select>
        <el-select v-model="filterOwner" placeholder="负责人" clearable class="filter-select" @change="resetPagination">
          <el-option v-for="owner in owners" :key="owner" :label="owner" :value="owner" />
        </el-select>
      </div>

      <div v-if="viewMode === 'card'" class="ds-card-grid mt-12">
        <el-card
          v-for="item in pagedList"
          :key="item.id"
          class="ds-card"
          shadow="hover"
          @click="showDetail(item)"
        >
          <div class="ds-card-top">
            <div class="ds-type-badge">{{ item.type }}</div>
            <el-tag :type="statusTagType[item.status]" effect="dark">{{ item.status }}</el-tag>
          </div>
          <div class="ds-card-name">{{ item.name }}</div>
          <div class="ds-card-meta">
            <div><el-icon :size="12"><Location /></el-icon> {{ item.host }}:{{ item.port }}</div>
            <div><el-icon :size="12"><Coin /></el-icon> {{ item.category }}</div>
          </div>
          <div class="ds-card-footer">
            <span>负责人：{{ item.owner }}</span>
            <el-button link type="danger" size="small" @click.stop="testConnection(item)">连通性测试</el-button>
          </div>
        </el-card>
      </div>

      <el-table v-else :data="pagedList" stripe class="mt-12" @row-click="showDetail">
        <el-table-column prop="name" label="数据源名称" min-width="170" />
        <el-table-column prop="type" label="类型" width="110" />
        <el-table-column prop="category" label="分类" width="100" />
        <el-table-column label="主机/端口" width="170">
          <template #default="{ row }">{{ row.host }}:{{ row.port }}</template>
        </el-table-column>
        <el-table-column prop="database" label="库名" min-width="160" />
        <el-table-column prop="owner" label="负责人" width="90" />
        <el-table-column prop="groupName" label="所属分组" width="110" />
        <el-table-column label="状态" width="90">
          <template #default="{ row }">
            <el-tag :type="statusTagType[row.status]" effect="dark">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="响应(ms)" width="90" align="center">
          <template #default="{ row }">{{ row.responseTime }}</template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button link type="danger" @click.stop="testConnection(row)">测试</el-button>
            <el-button link type="primary" @click.stop="showDetail(row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        class="pager"
        layout="total, prev, pager, next, sizes"
        :total="filteredList.length"
        :page-size="pageSize"
        :current-page="currentPage"
        :page-sizes="[12, 20, 50]"
        background
        @current-change="currentPage = $event"
        @size-change="handleSizeChange"
      />
    </el-card>

    <el-dialog v-model="detailVisible" :title="detailRow?.name ?? '数据源详情'" width="600px">
      <el-descriptions v-if="detailRow" :column="2" border>
        <el-descriptions-item label="名称">{{ detailRow.name }}</el-descriptions-item>
        <el-descriptions-item label="类型">{{ detailRow.type }}</el-descriptions-item>
        <el-descriptions-item label="分类">{{ detailRow.category }}</el-descriptions-item>
        <el-descriptions-item label="环境">{{ detailRow.env }}</el-descriptions-item>
        <el-descriptions-item label="主机地址">{{ detailRow.host }}:{{ detailRow.port }}</el-descriptions-item>
        <el-descriptions-item label="库名">{{ detailRow.database }}</el-descriptions-item>
        <el-descriptions-item label="负责人">{{ detailRow.owner }}</el-descriptions-item>
        <el-descriptions-item label="所属分组">{{ detailRow.groupName }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="statusTagType[detailRow.status]" effect="dark">{{ detailRow.status }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="更新时间">{{ detailRow.updateTime }}</el-descriptions-item>
        <el-descriptions-item label="描述" :span="2">{{ detailRow.description }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Coin, Location, Search } from '@element-plus/icons-vue'
import { mockDataSources, type DataSourceItem } from '@/mock/datasource'

const viewMode = ref<'card' | 'table'>('card')
const keyword = ref('')
const filterStatus = ref('')
const filterType = ref('')
const filterOwner = ref('')
const currentPage = ref(1)
const pageSize = ref(12)
const detailVisible = ref(false)
const detailRow = ref<DataSourceItem | null>(null)

const statuses = ['已连接', '连接中', '已断开', '异常']
const types = Array.from(new Set(mockDataSources.map((item) => item.type)))
const owners = Array.from(new Set(mockDataSources.map((item) => item.owner)))

const statusTagType: Record<string, 'success' | 'warning' | 'info' | 'danger'> = {
  已连接: 'success',
  连接中: 'warning',
  已断开: 'info',
  异常: 'danger',
}

const filteredList = computed(() =>
  mockDataSources.filter((item) => {
    if (filterStatus.value && item.status !== filterStatus.value) return false
    if (filterType.value && item.type !== filterType.value) return false
    if (filterOwner.value && item.owner !== filterOwner.value) return false
    if (!keyword.value) return true
    const kw = keyword.value.toLowerCase()
    return (
      item.name.toLowerCase().includes(kw) ||
      item.host.toLowerCase().includes(kw) ||
      item.database.toLowerCase().includes(kw)
    )
  }),
)

const pagedList = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredList.value.slice(start, start + pageSize.value)
})

const resetPagination = () => {
  currentPage.value = 1
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  resetPagination()
}

const testConnection = (row: DataSourceItem) => {
  ElMessage({
    message: `正在测试「${row.name}」连接...`,
    duration: 600,
  })
  setTimeout(() => {
    if (row.status === '异常') {
      ElMessage.error(`「${row.name}」连接失败：无法访问 ${row.host}:${row.port}`)
    } else {
      row.status = '已连接'
      ElMessage.success(`「${row.name}」连接成功，耗时 ${row.responseTime}ms`)
    }
  }, 600)
}

const showDetail = (row: DataSourceItem) => {
  detailRow.value = row
  detailVisible.value = true
}
</script>
