<template>
  <div class="standard-page">
    <el-row :gutter="16">
      <el-col :span="15">
        <el-card class="panel-card dashboard-card" shadow="never">
          <template #header>
            <div class="panel-header">
              <span>知识条目管理</span>
              <div class="panel-actions">
                <el-button type="danger" :icon="Plus" @click="openImport">知识入库</el-button>
              </div>
            </div>
          </template>

          <el-tabs v-model="activeCategory" @tab-change="() => {}">
            <el-tab-pane :label="`数据安全知识库 (${categoryCount('数据安全知识库')})`" name="数据安全知识库" />
            <el-tab-pane :label="`数据质量知识库 (${categoryCount('数据质量知识库')})`" name="数据质量知识库" />
            <el-tab-pane label="全部条目" name="全部" />
          </el-tabs>

          <div class="toolbar-row">
            <el-input
              v-model="keyword"
              placeholder="按标题 / 来源搜索"
              clearable
              class="search-input"
              :prefix-icon="Search"
            />
            <el-select v-model="filterStatus" placeholder="状态" clearable class="filter-select">
              <el-option label="已入库" value="已入库" />
              <el-option label="待审核" value="待审核" />
            </el-select>
            <el-button type="primary" :icon="Promotion" @click="publishService">知识服务发布</el-button>
          </div>

          <el-table :data="pagedEntries" stripe size="small" class="mt-12">
            <el-table-column prop="title" label="知识条目" min-width="200" />
            <el-table-column label="格式" width="100">
              <template #default="{ row }">
                <el-tag size="small" :type="row.format === 'Markdown' ? 'primary' : 'warning'" effect="plain">{{ row.format }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="source" label="来源" width="120" />
            <el-table-column label="向量数" width="90" align="center">
              <template #default="{ row }">{{ row.vectorCount }}</template>
            </el-table-column>
            <el-table-column label="状态" width="90">
              <template #default="{ row }">
                <el-tag :type="row.status === '已入库' ? 'success' : 'warning'" effect="dark" size="small">{{ row.status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="updateTime" label="更新时间" width="160" />
            <el-table-column label="操作" width="150" fixed="right">
              <template #default="{ row }">
                <el-button link type="primary" @click="openQA(row)">问答</el-button>
                <el-button v-if="row.status === '待审核'" link type="success" @click="approveEntry(row)">审核</el-button>
                <el-button v-else link type="warning" @click="vectorize(row)">向量化</el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-pagination
            class="pager"
            layout="total, prev, pager, next"
            :total="filteredEntries.length"
            :page-size="pageSize"
            :current-page="currentPage"
            background
            @current-change="changePage"
          />
        </el-card>

        <el-card class="panel-card dashboard-card mt-16" shadow="never">
          <template #header>
            <div class="panel-header"><span>向量化存储管理</span></div>
          </template>
          <el-descriptions :column="4" border size="small">
            <el-descriptions-item label="向量库">Milvus</el-descriptions-item>
            <el-descriptions-item label="集合数">2</el-descriptions-item>
            <el-descriptions-item label="向量总量">38,216</el-descriptions-item>
            <el-descriptions-item label="检索时延"><b class="text-primary">18ms</b></el-descriptions-item>
            <el-descriptions-item label="嵌入模型">bge-m3</el-descriptions-item>
            <el-descriptions-item label="向量维度">1,024</el-descriptions-item>
            <el-descriptions-item label="索引类型">HNSW</el-descriptions-item>
            <el-descriptions-item label="相似度阈值">0.72</el-descriptions-item>
          </el-descriptions>
          <div class="dep-text mt-8">支持文档、结构化数据、图片等信息转化为 Markdown 格式后写入向量数据库，检索响应毫秒级。</div>
        </el-card>
      </el-col>

      <el-col :span="9">
        <el-card class="panel-card dashboard-card qa-card" shadow="never">
          <template #header>
            <div class="panel-header"><span>RAG 智能问答</span></div>
          </template>
          <div class="qa-chat">
            <div v-for="(msg, index) in qaMessages" :key="index" class="qa-row" :class="msg.role">
              <div class="qa-avatar" :class="msg.role">
                <el-icon :size="15"><component :is="msg.role === 'user' ? User : Cpu" /></el-icon>
              </div>
              <div class="qa-bubble-wrap">
                <div class="qa-bubble">{{ msg.content }}</div>
                <div v-if="msg.role === 'assistant' && msg.sources?.length" class="qa-sources">
                  <span class="qa-sources-title">溯源引用</span>
                  <el-tag v-for="source in msg.sources" :key="source" size="small" effect="plain" type="primary" class="mr-4">{{ source }}</el-tag>
                </div>
                <div v-if="msg.time" class="qa-time">{{ msg.time }}</div>
              </div>
            </div>
          </div>
          <div class="qa-input" style="display: flex; align-items: center; gap: 10px;">
            <el-input
              v-model="question"
              placeholder="输入问题，例如：哪些字段涉及个人隐私？"
              :prefix-icon="ChatDotRound"
              @keyup.enter="sendQuestion"
            />
            <el-button type="danger" :icon="Promotion" @click="sendQuestion">发送</el-button>
          </div>
          <div class="qa-suggestions">
            <el-tag
              v-for="suggest in suggestions"
              :key="suggest"
              class="qa-suggest"
              effect="plain"
              @click="question = suggest"
            >{{ suggest }}</el-tag>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-drawer v-model="importVisible" title="知识入库" size="520px">
      <el-steps :active="1" simple finish-status="success" class="mb-16">
        <el-step title="上传/转换" />
        <el-step title="向量化" />
        <el-step title="审核" />
      </el-steps>
      <el-upload drag class="w-full" :auto-upload="false">
        <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
        <div class="el-upload__text">拖拽文件到此处，或 <em>点击选择</em>（支持 PDF / Word / Markdown / 图片）</div>
      </el-upload>
      <el-form :model="importForm" label-width="90px" class="mt-16">
        <el-form-item label="目标知识库">
          <el-select v-model="importForm.category" class="w-full">
            <el-option v-for="category in ['数据安全知识库', '数据质量知识库']" :key="category" :label="category" :value="category" />
          </el-select>
        </el-form-item>
        <el-form-item label="知识格式">
          <el-radio-group v-model="importForm.format">
            <el-radio value="Markdown" />
            <el-radio value="结构化数据" />
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="importVisible = false">取消</el-button>
        <el-button type="danger" @click="submitImport">提交入库审核</el-button>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { ChatDotRound, Cpu, Plus, Promotion, Search, UploadFilled, User } from '@element-plus/icons-vue'
import { knowledgeCategories, mockKnowledgeEntries, qaPairs } from '@/mock/intelligence'

const activeCategory = ref('全部')
const keyword = ref('')
const filterStatus = ref('')
const currentPage = ref(1)
const pageSize = 20
const importVisible = ref(false)

const entries = ref([...mockKnowledgeEntries])
const categories = knowledgeCategories

const importForm = reactive({
  category: '数据安全知识库',
  format: 'Markdown',
})

const categoryCount = (name: string) => entries.value.filter((item) => item.category === name).length

const filteredEntries = computed(() =>
  entries.value.filter((item) => {
    if (activeCategory.value !== '全部' && item.category !== activeCategory.value) return false
    if (filterStatus.value && item.status !== filterStatus.value) return false
    if (!keyword.value) return true
    const kw = keyword.value.toLowerCase()
    return item.title.toLowerCase().includes(kw) || item.source.toLowerCase().includes(kw)
  }),
)

const pagedEntries = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredEntries.value.slice(start, start + pageSize)
})

const changePage = (page: number) => (currentPage.value = page)

watch([activeCategory, keyword, filterStatus], () => {
  currentPage.value = 1
})

interface QAMessage {
  role: 'user' | 'assistant'
  content: string
  sources?: string[]
  time?: string
}

const question = ref('')
const qaMessages = ref<QAMessage[]>([])

const suggestions = ['哪些字段涉及个人隐私？', '如何定位空值率异常根因？', 'L2 级数据的访问要求？', '质量规则如何配置？']

const answersMap: Record<string, { answer: string; sources: string[] }> = {}
qaPairs.forEach((pair) => {
  answersMap[pair.question] = { answer: pair.answer, sources: pair.sources }
})

const sendQuestion = () => {
  const text = question.value.trim()
  if (!text) return
  qaMessages.value.push({ role: 'user', content: text })
  const matched = qaPairs.find((pair) => pair.question === text)
  const answer = matched
    ? matched.answer
    : '已检索数据安全知识库与数据质量知识库，未找到完全匹配条目。建议完善问题描述或前往知识库人工检索。（Mock）'
  const sources = matched ? matched.sources : []
  setTimeout(() => {
    qaMessages.value.push({ role: 'assistant', content: answer, sources, time: '刚刚' })
  }, 400)
  question.value = ''
}

const openQA = (row: (typeof entries.value)[number]) => {
  qaMessages.value = []
  question.value = row.title
  ElMessage.info('已载入知识条目到问答区（Mock）')
}

const openImport = () => {
  Object.assign(importForm, { category: '数据安全知识库', format: 'Markdown' })
  importVisible.value = true
}

const submitImport = () => {
  importVisible.value = false
  ElMessage.success('知识已提交入库审核，向量化完成后可检索（Mock）')
}

const approveEntry = (row: (typeof entries.value)[number]) => {
  row.status = '已入库'
  ElMessage.success(`知识条目「${row.title}」已审核通过并向量化入库（Mock）`)
}

const vectorize = (row: (typeof entries.value)[number]) => {
  ElMessage.success(`「${row.title}」已完成增量向量化，共 ${row.vectorCount} 个向量（Mock）`)
}

const publishService = () => {
  ElMessage.success('知识检索能力已编目注册为数据服务，供业务系统调用（Mock）')
}
</script>