<template>
  <div class="standard-page">
    <el-card class="panel-card dashboard-card" shadow="never">
      <template #header>
        <div class="panel-header">
          <span>数据治理智能体</span>
          <div class="panel-actions">
            <el-button :icon="Operation" @click="openConfig">可视化流程配置</el-button>
          </div>
        </div>
      </template>

      <el-tabs v-model="activeAgent" @tab-change="() => {}">
        <el-tab-pane v-for="agent in agentTabs" :key="agent.key" :name="agent.key">
          <template #label>
            <span class="agent-tab-label">
              <el-icon :size="14"><Cpu /></el-icon>
              {{ agent.name }}
              <el-tag
                :type="agentStatusTag[agent.status]"
                effect="dark"
                size="small"
                class="agent-tab-status"
              >{{ agent.status }}</el-tag>
            </span>
          </template>
        </el-tab-pane>
      </el-tabs>

      <div class="toolbar-row">
        <el-input
          v-model="keyword"
          :placeholder="`按${activeTabDesc.actionLabel} / 对象搜索`"
          clearable
          class="search-input"
          :prefix-icon="Search"
        />
        <el-select v-model="filterStatus" placeholder="状态" clearable class="filter-select">
          <el-option label="成功" value="成功" />
          <el-option label="运行中" value="运行中" />
          <el-option label="失败" value="失败" />
        </el-select>
        <span class="dep-text">共 {{ logs.length }} 条执行记录</span>
      </div>

      <el-row :gutter="16" class="mt-12">
        <el-col :span="16">
          <el-table :data="pagedLogs" stripe size="small">
            <el-table-column :prop="activeTabDesc.actionProp" :label="activeTabDesc.actionLabel" min-width="140" />
            <el-table-column prop="target" label="处理对象" min-width="160" />
            <el-table-column label="状态" width="90">
              <template #default="{ row }">
                <el-tag :type="logStatusTag[row.status]" effect="dark" size="small">{{ row.status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="duration" label="耗时" width="80" />
            <el-table-column prop="tokens" label="Token" width="90">
              <template #default="{ row }">{{ row.tokens.toLocaleString() }}</template>
            </el-table-column>
            <el-table-column prop="time" label="时间" width="160" />
          </el-table>

          <el-pagination
            class="pager"
            layout="total, prev, pager, next"
            :total="filteredLogs.length"
            :page-size="pageSize"
            :current-page="currentPage"
            background
            @current-change="changePage"
          />
        </el-col>

        <el-col :span="8">
          <div class="section-title">{{ activeAgentInfo.name }}能力</div>
          <div class="agent-feature" v-for="feature in activeAgentInfo.features" :key="feature.title">
            <div class="agent-feature-icon" :style="{ background: feature.color }">
              <el-icon :size="15"><component :is="feature.icon" /></el-icon>
            </div>
            <div class="agent-feature-body">
              <div class="agent-feature-title">{{ feature.title }}</div>
              <div class="agent-feature-desc">{{ feature.desc }}</div>
              <el-button link type="primary" size="small" @click="triggerAction(feature.title)">执行</el-button>
            </div>
          </div>

          <div class="section-title mt-16">智能体运行摘要</div>
          <el-descriptions :column="1" border size="small">
            <el-descriptions-item label="今日执行">38 次 · 成功率 92.1%</el-descriptions-item>
            <el-descriptions-item label="模型用量">{{ activeAgentInfo.tokens }} token</el-descriptions-item>
            <el-descriptions-item label="最近异常">无（Mock）</el-descriptions-item>
          </el-descriptions>
        </el-col>
      </el-row>
    </el-card>

    <el-drawer v-model="configVisible" title="智能体可视化流程配置" size="680px">
      <div class="section-title mb-8">流程编排（拖拽调整节点顺序）</div>
      <el-timeline>
        <el-timeline-item v-for="(node, index) in flowNodes" :key="node.key" :type="node.type" :timestamp="`步骤 ${index + 1}`">
          <div class="flow-node">
            <span>{{ node.name }}</span>
            <div class="flow-node-actions">
              <el-button link type="primary" size="small" :icon="Top">上移</el-button>
              <el-button link type="warning" size="small" :icon="Bottom">下移</el-button>
              <el-button link type="danger" size="small">删除</el-button>
            </div>
          </div>
        </el-timeline-item>
      </el-timeline>
      <div class="maintain-actions">
        <el-button size="small" :icon="Plus">添加节点</el-button>
        <el-button size="small" type="primary">保存并生效</el-button>
      </div>
      <div class="dep-text mt-8">根据集团实例模式变化进行流程化调整，调整后对新增任务立即生效（Mock）</div>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Aim, Bottom, ChatDotRound, Collection, Cpu, DataLine, Document, Files, FolderOpened, Monitor, Operation, Plus, Promotion, Search, Share, Top, TrendCharts } from '@element-plus/icons-vue'
import { agentCards, createAgentLogs } from '@/mock/intelligence'

const agentTabs = ref(agentCards)

const agentStatusTag: Record<string, 'success' | 'info' | 'danger'> = {
  运行中: 'success',
  已停止: 'info',
  异常: 'danger',
}

const logStatusTag: Record<string, 'success' | 'warning' | 'danger'> = {
  成功: 'success',
  运行中: 'warning',
  失败: 'danger',
}

const activeAgent = ref('meta')
const keyword = ref('')
const filterStatus = ref('')
const currentPage = ref(1)
const pageSize = 20
const configVisible = ref(false)

const agentInfoMap = {
  meta: {
    name: '元数据管理智能体',
    actionLabel: '执行动作',
    actionProp: 'action',
    tokens: '1.8 万',
    features: [
      { title: '自动接入数据源', desc: '自动识别抽取技术元数据', icon: DataLine, color: '#2B6CB0' },
      { title: '技术元数据自动补全', desc: '基于语义模型智能补全', icon: TrendCharts, color: '#9B59B6' },
      { title: '资产信息自动补全', desc: '表摘要、字段描述完善', icon: Aim, color: '#DA251D' },
      { title: '分类分级', desc: '自动完成资产分类分级', icon: Collection, color: '#ED7B2F' },
      { title: '评估报告自动生成', desc: '自动生成资产评估报告', icon: Document, color: '#00A854' },
    ],
  },
  quality: {
    name: '数据质量管理智能体',
    actionLabel: '执行动作',
    actionProp: 'action',
    tokens: '2.4 万',
    features: [
      { title: '自动化规则执行', desc: '按调度自动执行质量规则', icon: DataLine, color: '#DA251D' },
      { title: '实时规则监控与分析', desc: '流式监控与异常分析', icon: Monitor, color: '#2B6CB0' },
      { title: '质量专项方案', desc: '制定、执行与报告闭环', icon: Document, color: '#9B59B6' },
      { title: '自动化报告生成', desc: '合规率 95.1%', icon: Files, color: '#00A854' },
    ],
  },
  resource: {
    name: '数据资源管理智能体',
    actionLabel: '执行动作',
    actionProp: 'action',
    tokens: '1.2 万',
    features: [
      { title: '智能分析与归类', desc: '智能分析归类数据资产', icon: FolderOpened, color: '#2B6CB0' },
      { title: '目录信息确认', desc: '可视化界面确认目录归属', icon: Aim, color: '#ED7B2F' },
      { title: '目录信息回写', desc: '一键回写、批量操作', icon: Promotion, color: '#DA251D' },
    ],
  },
  search: {
    name: '智能找数智能体',
    actionLabel: '执行动作',
    actionProp: 'action',
    tokens: '3.1 万',
    features: [
      { title: '问答式数据搜索', desc: '自然语言语义解析', icon: ChatDotRound, color: '#9B59B6' },
      { title: '数据关系视图', desc: '自动生成数据关系视图', icon: Share, color: '#00A854' },
    ],
  },
}

const activeAgentInfo = computed(() => agentInfoMap[activeAgent.value as keyof typeof agentInfoMap])

const activeTabDesc = computed(() => {
  const info = agentInfoMap[activeAgent.value as keyof typeof agentInfoMap]
  return { actionLabel: info.actionLabel, actionProp: info.actionProp }
})

const logs = computed(() => createAgentLogs(activeAgent.value as keyof typeof createAgentLogs, 56))

const filteredLogs = computed(() =>
  logs.value.filter((log) => {
    if (filterStatus.value && log.status !== filterStatus.value) return false
    if (!keyword.value) return true
    const kw = keyword.value.toLowerCase()
    return log.action.toLowerCase().includes(kw) || log.target.toLowerCase().includes(kw)
  }),
)

const pagedLogs = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredLogs.value.slice(start, start + pageSize)
})

const changePage = (page: number) => (currentPage.value = page)

watch([activeAgent, keyword, filterStatus], () => {
  currentPage.value = 1
})

const triggerAction = (title: string) => {
  ElMessage.success(`「${title}」已触发执行（Mock）`)
}

const flowNodes = [
  { key: '1', name: '数据源接入（自动发现）', type: 'primary' as const },
  { key: '2', name: '技术元数据抽取', type: 'primary' as const },
  { key: '3', name: 'AI 语义补全', type: 'success' as const },
  { key: '4', name: '分类分级推理', type: 'success' as const },
  { key: '5', name: '结果确认与回写', type: 'warning' as const },
]

const openConfig = () => {
  configVisible.value = true
}
</script>