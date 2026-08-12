export type AITaskRecord = {
  id: string
  name: string
  agent: string
  type: '元数据补全' | '分类分级' | '质量规则生成' | '知识入库' | '智能问答' | '报告生成'
  status: '成功' | '运行中' | '失败'
  duration: string
  time: string
  trigger: '自动' | '手动'
  model: string
}

export type MissingMetaItem = {
  id: string
  tableName: string
  fieldName?: string
  missingType: '表中文名' | '表摘要' | '字段描述' | '维度指标类型' | '代码描述'
  current: string
  suggest: string
}

export type MetricConfidence = {
  name: string
  value: number
  target: number
  trend: 'up' | 'down' | 'flat'
}

export type ClassifyModel = {
  id: string
  name: string
  standard: string
  accuracy: number
  version: string
  updateTime: string
  status: '生效' | '草稿' | '停用'
}

export type ClassifyResult = {
  id: string
  assetName: string
  domain: string
  predictedLevel: 'L1' | 'L2' | 'L3' | 'L4'
  predictedLevelName: string
  tags: string[]
  confidence: number
  status: '待复核' | '已通过' | '已驳回'
}

export type KnowledgeEntry = {
  id: string
  title: string
  category: string
  format: 'Markdown' | '结构化数据'
  source: string
  status: '已入库' | '待审核'
  vectorCount: number
  updateTime: string
  owner: string
}

const pad = (value: number) => String(value).padStart(2, '0')

const formatDate = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(
    date.getMinutes(),
  )}:${pad(date.getSeconds())}`

export const agentCards = [
  { key: 'meta', name: '元数据管理智能体', status: '运行中', desc: '自动识别抽取技术元数据并智能补全', metric: '抽取准确率 96.8%' },
  { key: 'quality', name: '数据质量管理智能体', status: '运行中', desc: '自动执行质量规则与根因定位分析', metric: '根因定位 78.2%' },
  { key: 'resource', name: '数据资源管理智能体', status: '异常', desc: '智能分析与归类数据资产', metric: '最近失败 1 次' },
  { key: 'search', name: '智能找数智能体', status: '已停止', desc: '问答式语义检索定位数据资产', metric: '检索准确率 85.4%' },
]

export const metrics: MetricConfidence[] = [
  { name: '元数据自动抽取准确率', value: 96.8, target: 80, trend: 'up' },
  { name: '业务元数据补全准确率', value: 93.5, target: 70, trend: 'up' },
  { name: '资产分类分级准确率', value: 87.2, target: 70, trend: 'up' },
  { name: '质量规则自动生成准确率', value: 89.6, target: 70, trend: 'flat' },
  { name: '质量异常根因定位准确率', value: 78.2, target: 70, trend: 'up' },
  { name: '自动化报告生成合规率', value: 95.1, target: 90, trend: 'flat' },
  { name: '资产逻辑关系识别覆盖率', value: 76.4, target: 70, trend: 'down' },
  { name: '智能找数检索准确率', value: 85.4, target: 80, trend: 'up' },
]

export function createAITasks(count: number): AITaskRecord[] {
  const now = new Date('2026-08-12T10:00:00')
  const agentPool = ['元数据管理智能体', '数据质量管理智能体', '数据资源管理智能体', '智能找数智能体']
  const statusPool = ['成功', '成功', '运行中', '失败'] as const
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(now)
    date.setMinutes(now.getMinutes() - index * 11)
    return {
      id: `ai-${index + 1}`,
      name: `${['元数据补全任务', '分类分级任务', '质量规则生成', '知识入库解析', '智能问答', '合规报告生成'][index % 6]}-${index + 1}`,
      agent: agentPool[index % agentPool.length],
      type: ['元数据补全', '分类分级', '质量规则生成', '知识入库', '智能问答', '报告生成'][index % 6] as AITaskRecord['type'],
      status: statusPool[index % statusPool.length],
      duration: `${1 + ((index * 3) % 42)}s`,
      time: formatDate(date),
      trigger: index % 3 === 0 ? '手动' : '自动',
      model: index % 2 === 0 ? 'deepseek-v3' : 'qwen-max',
    }
  })
}

export const mockAITasks = createAITasks(30)

export const trendData = {
  dates: Array.from({ length: 7 }, (_, i) => `08-${pad((i % 9) + 4)}`),
  calls: [842, 968, 1120, 1064, 1245, 1388, 1502],
  success: [821, 949, 1095, 1046, 1220, 1371, 1489],
  tokens: [320, 410, 480, 451, 540, 620, 718],
}

export const llmStatus = {
  model: 'deepseek-v3',
  status: '正常',
  usagePercent: 46,
  quota: '100 万 token / 日',
  used: '46 万 token / 日',
  avgLatency: '1.8s / 请求',
  calls: '1,502 次 / 7 日',
}

const tablePool = ['ticket_sale_detail', 'passenger_info', 'station_info', 'line_info', 'device_status_log', 'flow_stat_daily', 'train_operation_log']

export const missingMeta: MissingMetaItem[] = [
  { id: 'm1', tableName: tablePool[3], missingType: '表中文名', current: '—', suggest: '线路基础信息表' },
  { id: 'm2', tableName: tablePool[1], missingType: '表摘要', current: '—', suggest: '记录乘客实名制档案及联系方式' },
  { id: 'm3', tableName: tablePool[6], missingType: '表摘要', current: '—', suggest: '列车运行时刻与准点情况记录' },
  { id: 'm4', tableName: tablePool[0], fieldName: 'cust_id', missingType: '字段描述', current: '—', suggest: '乘客唯一标识，关联乘客档案表' },
  { id: 'm5', tableName: tablePool[4], fieldName: 'warning_code', missingType: '代码描述', current: '1', suggest: '1=正常 2=告警 3=故障' },
  { id: 'm6', tableName: tablePool[3], fieldName: 'line_len', missingType: '维度指标类型', current: '—', suggest: '度量指标' },
  { id: 'm7', tableName: tablePool[2], fieldName: 'station_addr', missingType: '字段描述', current: '—', suggest: '车站地址信息' },
  { id: 'm8', tableName: tablePool[1], fieldName: 'id_card', missingType: '维度指标类型', current: '—', suggest: '维度属性' },
]

export const completionHistory = [
  { id: 'h1', name: '批量补全任务 #20260812', count: 128, success: 121, time: '2026-08-12 09:30', user: '系统自动' },
  { id: 'h2', name: '批量补全任务 #20260811', count: 96, success: 92, time: '2026-08-11 09:30', user: '系统自动' },
  { id: 'h3', name: '增量补全任务 #20260810', count: 34, success: 31, time: '2026-08-10 10:00', user: '张三' },
]

export const classifyModels: ClassifyModel[] = [
  { id: 'cm1', name: '轨道交通分类模型 V3', standard: '数据分类分级标准-轨道交通版', accuracy: 87.2, version: 'V3.2', updateTime: '2026-07-28', status: '生效' },
  { id: 'cm2', name: '客流领域分类模型', standard: '数据分类分级标准-通用版', accuracy: 84.6, version: 'V1.8', updateTime: '2026-06-15', status: '生效' },
  { id: 'cm3', name: '财务资产分类模型', standard: '数据分类分级标准-通用版', accuracy: 90.3, version: 'V2.1', updateTime: '2026-05-20', status: '生效' },
  { id: 'cm4', name: '设备物联分类模型', standard: '数据分类分级标准-轨道交通版', accuracy: 82.9, version: 'V0.9', updateTime: '2026-07-02', status: '草稿' },
]

export function createClassifyResults(count: number): ClassifyResult[] {
  const domainPool = ['业务运营', '设备设施', '乘客服务', '建设管理', '财务资产', '基础信息']
  const statusPool = ['待复核', '已通过', '已通过', '已驳回'] as const
  return Array.from({ length: count }, (_, index) => ({
    id: `cr-${index + 1}`,
    assetName: tablePool[index % tablePool.length],
    domain: domainPool[index % domainPool.length],
    predictedLevel: ['L1', 'L2', 'L3', 'L4'][(index * 3) % 4] as ClassifyResult['predictedLevel'],
    predictedLevelName: ['核心', '重要', '一般', '可公开'][(index * 3) % 4],
    tags: [['敏感', '核心'], ['个人隐私'], ['客流'], ['设备依赖'], ['公开数据']][index % 5],
    confidence: 72 + ((index * 5) % 27),
    status: statusPool[index % statusPool.length],
  }))
}

export const mockClassifyResults = createClassifyResults(1080)

export const knowledgeCategories = [
  { key: 'c1', name: '数据安全知识库', count: 128, desc: '安全法规、脱敏规范、分级指引' },
  { key: 'c2', name: '数据质量知识库', count: 86, desc: '质量规则、根因分析案例、修复方案' },
]

export function createKnowledgeEntries(count: number): KnowledgeEntry[] {
  const now = new Date('2026-08-12T10:00:00')
  const titlePool = [
    '《数据安全法》要点解读',
    '个人信息脱敏处理规范',
    '数据分级分类白皮书',
    '空值率异常根因分析案例',
    '质量规则配置最佳实践',
    '实体唯一性校验指南',
  ]
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(now)
    date.setDate(now.getDate() - (index % 30))
    return {
      id: `kb-${index + 1}`,
      title: titlePool[index % titlePool.length],
      category: index % 2 === 0 ? '数据安全知识库' : '数据质量知识库',
      format: index % 4 === 0 ? '结构化数据' : 'Markdown',
      source: index % 3 === 0 ? '制度文档上传' : index % 3 === 1 ? '网络公开资料' : '平台沉淀',
      status: index % 10 === 0 ? '待审核' : '已入库',
      vectorCount: 20 + index * 7,
      updateTime: formatDate(date),
      owner: ['张三', '李四', '王五'][index % 3],
    }
  })
}

export const mockKnowledgeEntries = createKnowledgeEntries(214)

export const qaPairs = [
  {
    question: '地铁客流数据中，哪些字段涉及个人隐私？',
    answer:
      '根据数据分类分级标准与《个人信息保护法》要求，客流域以下字段涉及个人隐私：\n1. passenger_info 表中的 cust_name（姓名）、id_card（身份证号）、phone（联系方式）；\n2. 上述字段均为 L2 重要级别，查询时应通过查询实时脱敏规则处理后输出。',
    sources: ['数据分级分类白皮书 §3.2', '个人信息脱敏处理规范 §2.1'],
    time: '2 分钟前',
  },
  {
    question: '如何定位 ticket_sale_detail 空值率异常的根因？',
    answer:
      '建议按以下步骤排查：\n1. 检查 08-11 03:00 全量同步任务是否成功（当日已发现 1 次失败记录）；\n2. 空值主要集中于 cust_id 字段（空值率 12.6%），与支付渠道为非实名制购票相关；\n3. 已有修复方案见知识库「空值率异常根因分析案例」。',
    sources: ['质量规则配置最佳实践 §4', '空值率异常根因分析案例'],
    time: '35 分钟前',
  },
]

export const agentExecutionPool = {
  meta: {
    actions: ['数据源接入', '元数据抽取', '资产信息补全', '分类分级', '评估报告生成'],
    statusPool: ['成功', '成功', '成功', '失败'] as const,
  },
  quality: {
    actions: ['规则自动执行', '实时规则监控', '专项方案制定', '质量报告生成'],
    statusPool: ['成功', '成功', '运行中', '成功'] as const,
  },
  resource: {
    actions: ['资产智能分析', '目录信息确认', '目录回写', '资产归档'],
    statusPool: ['成功', '运行中', '成功', '失败'] as const,
  },
  search: {
    actions: ['语义解析', '相关性检索', '关系视图生成', '问答回复'],
    statusPool: ['成功', '成功', '成功', '成功'] as const,
  },
}

export function createAgentLogs(agentKey: keyof typeof agentExecutionPool, count: number) {
  const pool = agentExecutionPool[agentKey]
  const now = new Date('2026-08-12T10:00:00')
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(now)
    date.setMinutes(now.getMinutes() - index * 17)
    return {
      id: `${agentKey}-log-${index + 1}`,
      action: pool.actions[index % pool.actions.length],
      target: tablePool[(index * 2) % tablePool.length],
      status: pool.statusPool[index % pool.statusPool.length],
      duration: `${1 + ((index * 2) % 30)}s`,
      time: formatDate(date),
      model: 'deepseek-v3',
      tokens: 800 + ((index * 137) % 9000),
    }
  })
}