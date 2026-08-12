<template>
  <div class="standard-page">
    <el-card class="panel-card dashboard-card" shadow="never">
      <template #header>
        <div class="panel-header">
          <span>数据预览</span>
          <div class="panel-actions">
            <el-button type="danger" size="small" @click="refresh">重新抽样</el-button>
          </div>
        </div>
      </template>

      <div class="toolbar-row preview-toolbar">
        <el-select v-model="selectedTable" class="table-select" @change="loadSample">
          <el-option v-for="table in tableOptions" :key="table" :label="table" :value="table" />
        </el-select>
        <el-input
          v-model="keyword"
          placeholder="全局搜索：字段名 / 备注 / 样例"
          clearable
          class="search-input"
          :prefix-icon="Search"
        />
        <el-button :icon="Filter" @click="advanceVisible = true">高级检索</el-button>
      </div>

      <el-row :gutter="16" class="mb-16">
        <el-col :xs="24" :lg="16">
          <el-descriptions title="表结构信息" border :column="3" size="small">
            <el-descriptions-item label="数据总量">12,845,032 行</el-descriptions-item>
            <el-descriptions-item label="字段数">{{ fieldColumns.length }} 列</el-descriptions-item>
            <el-descriptions-item label="存储层级">DWD 明细层</el-descriptions-item>
            <el-descriptions-item label="最后更新">2026-08-12 03:02:10</el-descriptions-item>
            <el-descriptions-item label="更新频率">每日 03:00 全量</el-descriptions-item>
            <el-descriptions-item label="责任人">张三</el-descriptions-item>
          </el-descriptions>

          <div class="section-title mt-16 mb-8">字段结构</div>
          <el-table :data="fieldColumns" size="small" stripe max-height="260">
            <el-table-column label="字段名" width="150">
              <template #default="{ row }">
                <span class="field-name" :class="{ 'field-pk': row.primary }">{{ row.name }}</span>
                <el-tag v-if="row.primary" size="small" type="danger" effect="dark" class="pk-tag">PK</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="类型" width="140">
              <template #default="{ row }">
                <span class="type-badge" :style="{ background: typeMeta[row.typeLabel].bg, color: typeMeta[row.typeLabel].fg }">
                  {{ row.dataType }}<template v-if="row.length">({{ row.length }})</template>
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="comment" label="描述" min-width="180" />
            <el-table-column label="约束" width="90">
              <template #default="{ row }">
                <span>{{ row.nullable ? '可空' : '非空' }}<template v-if="row.primary"> · 主键</template></span>
              </template>
            </el-table-column>
          </el-table>
        </el-col>

        <el-col :xs="24" :lg="8">
          <el-card shadow="never" class="stat-mini-card">
            <div class="section-title">数据量统计</div>
            <div class="stat-count">{{ sampleRows.length.toLocaleString() }}</div>
            <div class="dep-text stat-note">当前抽样行数（前 100 条）</div>
            <el-divider />
            <div class="section-title">更新时间线</div>
            <el-timeline class="mt-8">
              <el-timeline-item timestamp="08-12 03:02" type="primary">每日全量同步 · 新增 52 万行</el-timeline-item>
              <el-timeline-item timestamp="08-11 03:01" type="success">每日全量同步 · 新增 48 万行</el-timeline-item>
              <el-timeline-item timestamp="08-10 03:02" type="success">每日全量同步 · 新增 51 万行</el-timeline-item>
            </el-timeline>
          </el-card>
        </el-col>
      </el-row>

      <div class="section-title mb-8">数据抽样预览（前 100 条）</div>
      <el-table :data="sampleRows" stripe height="420">
        <el-table-column v-for="field in displayColumns" :key="field.name" :label="field.name" min-width="120" show-overflow-tooltip>
          <template #default="{ row }">
            <span
              class="sample-cell"
              :style="{ color: typeMeta[field.typeLabel].fg, background: typeMeta[field.typeLabel].bg }"
              @click="showFull(field.name)"
            >
              {{ truncate(String(row[field.name])) }}
            </span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-drawer v-model="advanceVisible" title="高级检索" size="840px">
      <el-form label-width="80px">
        <el-form-item label="库表">
          <el-select v-model="advance.db" class="w-full">
            <el-option v-for="db in ['git_new_gz_ods', 'git_new_gz_dwd', 'git_new_gz_dws', 'git_new_gz_ads']" :key="db" :label="db" :value="db" />
          </el-select>
        </el-form-item>
        <el-form-item label="字段名">
          <el-input v-model="advance.field" placeholder="按字段名匹配" clearable />
        </el-form-item>
        <el-form-item label="资产标签">
          <el-select v-model="advance.tags" multiple placeholder="选择标签" class="w-full">
            <el-option v-for="tag in ['客流', '设备', '财务', '敏感', '核心']" :key="tag" :label="tag" :value="tag" />
          </el-select>
        </el-form-item>
        <el-form-item label="负责人">
          <el-select v-model="advance.owner" placeholder="选择责任人" class="w-full">
            <el-option v-for="owner in ['张三', '李四', '王五', '赵六']" :key="owner" :label="owner" :value="owner" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="advanceVisible = false">取消</el-button>
        <el-button type="danger" @click="runAdvance">搜索</el-button>
      </template>
    </el-drawer>

    <el-drawer v-model="fullVisible" title="字段完整内容" size="460px">
      <div class="full-content-block">
        <div class="section-title">内容预览</div>
        <div class="full-content">{{ fullContent }}</div>
        <div class="dep-text mt-8">该字段为长文本类型，已展示完整内容，可复制使用。</div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Filter, Search } from '@element-plus/icons-vue'
import { mockFields } from '@/mock/resource'

const tableOptions = ['ticket_sale_detail', 'passenger_info', 'flow_stat_daily', 'device_status_log', 'train_operation_log']
const selectedTable = ref('ticket_sale_detail')

const fieldColumns = ref([...mockFields])

const typeMeta: Record<string, { bg: string; fg: string }> = {
  字符串: { bg: 'rgba(218,37,29,0.10)', fg: '#DA251D' },
  数值: { bg: 'rgba(43,108,176,0.10)', fg: '#2B6CB0' },
  日期: { bg: 'rgba(0,168,84,0.10)', fg: '#00A854' },
  大文本: { bg: 'rgba(155,89,182,0.10)', fg: '#9B59B6' },
}

const keyword = ref('')
const advanceVisible = ref(false)
const fullVisible = ref(false)
const fullContent = ref('')

const advance = reactive({
  db: 'git_new_gz_dwd',
  field: '',
  tags: [] as string[],
  owner: '',
})

const sampleRows = ref(
  Array.from({ length: 100 }, (_, index) => {
    const row: Record<string, string> = {}
    mockFields.forEach((field) => {
      row[field.name] =
        field.name === 'stat_date'
          ? `2026-08-${String((index % 28) + 1).padStart(2, '0')}`
          : field.name === 'flow_count'
            ? String(8000 + index * 97)
            : `${field.sample}${index + 1}`.slice(0, Math.max(field.sample.length, 12))
    })
    return row
  }),
)

const filteredFields = computed(() => {
  if (!keyword.value) return fieldColumns.value
  const kw = keyword.value.toLowerCase()
  return fieldColumns.value.filter(
    (field) =>
      field.name.toLowerCase().includes(kw) ||
      field.comment.toLowerCase().includes(kw) ||
      field.sample.toLowerCase().includes(kw),
  )
})

const displayColumns = computed(() =>
  (keyword.value ? filteredFields.value : fieldColumns.value).map((field) => field),
)

const truncate = (value: string) => (value.length > 16 ? `${value.slice(0, 16)}…` : value)

const showFull = (fieldName: string) => {
  const field = fieldColumns.value.find((item) => item.name === fieldName)
  const first = sampleRows.value[0]
  fullContent.value = field ? `${field.comment}\n示例值：${first?.[fieldName] ?? ''}` : ''
  fullVisible.value = true
}

const loadSample = () => {
  const current = fieldColumns.value
  sampleRows.value = Array.from({ length: 100 }, (_, index) => {
    const row: Record<string, string> = {}
    current.forEach((field) => {
      row[field.name] =
        field.name === 'stat_date'
          ? `2026-08-${String((index % 28) + 1).padStart(2, '0')}`
          : `${field.sample}${index + 1}`.slice(0, Math.max(field.sample.length, 12))
    })
    return row
  })
  ElMessage.success(`已加载「${selectedTable.value}」抽样数据（Mock）`)
}

const refresh = () => loadSample()

const runAdvance = () => {
  advanceVisible.value = false
  ElMessage.success(`已按条件检索到 86 个匹配字段 / 12 张表（Mock）`)
}
</script>