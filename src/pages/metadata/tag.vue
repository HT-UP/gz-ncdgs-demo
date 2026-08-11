<template>
  <div class="standard-page">
    <el-row :gutter="16">
      <el-col :xs="24" :lg="8">
        <el-card class="panel-card dashboard-card" shadow="never">
          <template #header>
            <div class="panel-header">
              <span>标签体系</span>
              <el-button type="danger" size="small" :icon="Plus" @click="openCreateCategory">新增分类</el-button>
            </div>
          </template>
          <el-tree
            :data="tagTree"
            node-key="name"
            default-expand-all
            :props="{ label: 'name', children: 'children' }"
            highlight-current
            @node-click="selectTagNode"
          >
            <template #default="{ data }">
              <div class="tag-tree-node">
                <span>{{ data.name }}</span>
                <el-tag size="small" effect="plain">{{ data.count }}</el-tag>
              </div>
            </template>
          </el-tree>
        </el-card>
      </el-col>

      <el-col :xs="24" :lg="16">
        <el-card class="panel-card dashboard-card" shadow="never">
          <template #header>
            <div class="panel-header">
              <span>自动打标规则</span>
              <el-button type="danger" size="small" :icon="Plus" @click="addAutoRule">新增规则</el-button>
            </div>
          </template>
          <div class="auto-rule-item" v-for="rule in autoRules" :key="rule.name">
            <div class="auto-rule-info">
              <div class="auto-rule-name">{{ rule.name }}</div>
              <div class="auto-rule-desc">{{ rule.condition }}</div>
            </div>
            <div class="auto-rule-meta">
              <el-tag effect="plain" type="danger">{{ rule.tag }}</el-tag>
              <span class="auto-rule-matched">命中 {{ rule.matched }} 项</span>
            </div>
          </div>
        </el-card>

        <el-card class="panel-card dashboard-card mt-16" shadow="never">
          <template #header>
            <div class="panel-header">
              <span>标签统计与分析</span>
            </div>
          </template>
          <div class="toolbar-row">
            <el-select v-model="statCategory" class="filter-select">
              <el-option v-for="category in categoryNames" :key="category" :label="category" :value="category" />
            </el-select>
            <el-button type="danger" plain @click="applyTag">批量打标</el-button>
            <el-button type="danger" @click="previewTag">标签预览</el-button>
          </div>
          <el-table :data="tagStats" stripe class="mt-12">
            <el-table-column prop="name" label="标签名称" min-width="130" />
            <el-table-column prop="category" label="分类" width="110" />
            <el-table-column prop="metadataCount" label="覆盖元数据" width="110" align="center" />
            <el-table-column prop="fieldCount" label="覆盖字段" width="100" align="center" />
            <el-table-column label="占比" min-width="180">
              <template #default="{ row }">
                <el-progress :percentage="row.percentage" :color="row.percentage > 50 ? '#DA251D' : '#2B6CB0'" :stroke-width="10" />
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog v-model="categoryVisible" title="新增标签分类" width="440px">
      <el-form :model="categoryForm" label-width="90px">
        <el-form-item label="分类名称">
          <el-input v-model="categoryForm.name" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="categoryVisible = false">取消</el-button>
        <el-button type="danger" @click="saveCategory">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

type TagNode = {
  name: string
  count: number
  children?: TagNode[]
}

const tagTree = ref<TagNode[]>([
  {
    name: '业务属性',
    count: 120,
    children: [
      { name: '客户类', count: 45 },
      { name: '票务类', count: 60 },
      { name: '运营类', count: 15 },
    ],
  },
  {
    name: '技术属性',
    count: 260,
    children: [
      { name: '主键类', count: 95 },
      { name: '外键类', count: 110 },
      { name: '时间类', count: 55 },
    ],
  },
  {
    name: '质量属性',
    count: 88,
    children: [
      { name: '敏感数据', count: 30 },
      { name: '核心数据', count: 58 },
    ],
  },
])

const autoRules = ref([
  { name: '主键自动打标', condition: '字段名匹配 /_id$/ 且为主键 → 自动关联「主键类」', tag: '主键类', matched: 95 },
  { name: '时间字段自动打标', condition: '字段类型为 DATETIME/DATE/TIMESTAMP → 自动关联「时间类」', tag: '时间类', matched: 55 },
  { name: '敏感字段自动打标', condition: '字段注释包含 手机/身份证/银行卡 → 自动关联「敏感数据」', tag: '敏感数据', matched: 30 },
])

const categoryNames = ['业务属性', '技术属性', '质量属性']
const statCategory = ref('技术属性')

const tagStats = computed(() =>
  [
    { name: '主键类', category: '技术属性', metadataCount: 95, fieldCount: 128, percentage: 38 },
    { name: '外键类', category: '技术属性', metadataCount: 110, fieldCount: 142, percentage: 44 },
    { name: '时间类', category: '技术属性', metadataCount: 55, fieldCount: 76, percentage: 22 },
  ].filter((item) => item.category === statCategory.value),
)

const categoryVisible = ref(false)
const categoryForm = reactive({ name: '' })

const selectTagNode = (data: TagNode) => {
  ElMessage.info(`标签「${data.name}」当前覆盖元数据 ${data.count} 项（Mock）`)
}

const openCreateCategory = () => {
  Object.assign(categoryForm, { name: '' })
  categoryVisible.value = true
}

const saveCategory = () => {
  if (!categoryForm.name.trim()) {
    ElMessage.warning('请输入分类名称')
    return
  }
  tagTree.value.push({ name: categoryForm.name, count: 0, children: [] })
  categoryVisible.value = false
  ElMessage.success('标签分类已新增（Mock）')
}

const addAutoRule = () => {
  ElMessage.success('新增自动打标规则（Mock）')
}

const applyTag = () => {
  ElMessage.success('已为选中的 36 项元数据批量打标（Mock）')
}

const previewTag = () => {
  ElMessage.success('标签预览已生成：覆盖表 1,284 张，字段 23,562 个（Mock）')
}
</script>
