export type QualityRuleType = '完整性' | '准确性' | '一致性' | '唯一性' | '及时性'

export type QualityRule = {
  id: string
  name: string
  type: QualityRuleType
  level: '表级' | '字段级'
  tableName: string
  fieldName: string
  templateName: string
  weight: number
  priority: '高' | '中' | '低'
  status: '启用' | '停用' | '草稿'
  owner: string
  version: string
  updateTime: string
  description: string
}

const ruleNamePool = [
  '必填字段完整性检查',
  '客流量数值范围校验',
  '时间字段格式校验',
  '车站名称标准一致性',
  '票号唯一性检查',
  '数据及时性检查',
  '手机号格式准确性',
  '证件号编码校验',
  '线路编码一致性',
  '设备状态枚举校验',
]

const tablePool = ['ticket_sale', 'passenger_info', 'station_info', 'line_info', 'device_status', 'flow_stat']
const fieldPool = ['flow_count', 'station_name', 'ticket_no', 'cust_name', 'phone', 'line_code', 'device_no', 'stat_date']
const typePool: QualityRuleType[] = ['完整性', '准确性', '一致性', '唯一性', '及时性']
const priorityPool = ['高', '中', '低'] as const
const statusPool = ['启用', '启用', '启用', '停用', '草稿'] as const

const pad = (value: number) => String(value).padStart(2, '0')

const formatDate = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(
    date.getMinutes(),
  )}:${pad(date.getSeconds())}`

export function createQualityRules(count: number): QualityRule[] {
  const now = new Date('2026-08-11T14:32:08')
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(now)
    date.setDate(now.getDate() - (index % 45))
    return {
      id: `qr-${index + 1}`,
      name: ruleNamePool[index % ruleNamePool.length],
      type: typePool[index % typePool.length],
      level: index % 3 === 0 ? '表级' : '字段级',
      tableName: tablePool[index % tablePool.length],
      fieldName: fieldPool[index % fieldPool.length],
      templateName: `${typePool[index % typePool.length]}检查模板`,
      weight: 0.1 + ((index % 5) * 0.1),
      priority: priorityPool[index % priorityPool.length],
      status: statusPool[index % statusPool.length],
      owner: ['张三', '李四', '王五', '赵六'][index % 4],
      version: `V${1 + (index % 3)}.${index % 4}`,
      updateTime: formatDate(date),
      description: `${ruleNamePool[index % ruleNamePool.length]}的规则说明`,
    }
  })
}

export const mockQualityRules = createQualityRules(156)

export type QualityTask = {
  id: string
  name: string
  ruleCount: number
  trigger: '周期调度' | '实时触发' | '手动执行'
  schedule: string
  status: '运行中' | '成功' | '失败' | '待执行'
  progress: number
  passCount: number
  problemCount: number
  owner: string
  lastRunTime: string
  scope: string
}

export function createQualityTasks(count: number): QualityTask[] {
  const now = new Date('2026-08-11T14:32:08')
  const triggerPool = ['周期调度', '周期调度', '实时触发', '手动执行'] as const
  const schedulePool = ['每日 03:00', '每小时', '实时', '手动'] as const
  const statusPool = ['成功', '成功', '运行中', '失败', '待执行'] as const
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(now)
    date.setMinutes(now.getMinutes() - index * 23)
    const problemCount = (index * 13) % 220
    return {
      id: `qt-${index + 1}`,
      name: `${['票务数据', '客流数据', '设备数据', '乘客数据', '线路数据'][index % 5]}质量检查`,
      ruleCount: 5 + (index % 12),
      trigger: triggerPool[index % triggerPool.length],
      schedule: schedulePool[index % schedulePool.length],
      status: statusPool[index % statusPool.length],
      progress: statusPool[index % statusPool.length] === '运行中' ? 45 + (index % 50) : 100,
      passCount: 8000 + ((index * 977) % 400000),
      problemCount,
      owner: ['张三', '李四', '王五'][index % 3],
      lastRunTime: formatDate(date),
      scope: `${['票务核心库', '客流分析库', '设备信号库', '乘客库'][index % 4]} 全部表`,
    }
  })
}

export const mockQualityTasks = createQualityTasks(86)

export const qualityAuditLogs = [
  { time: '2026-08-11 14:05', user: '张三', object: '规则「客流量数值范围校验」', action: '修改权重 0.1 → 0.3', result: '已生效' },
  { time: '2026-08-11 13:20', user: '王工', object: '质量任务「票务数据质量检查」', action: '触发执行', result: '运行中' },
  { time: '2026-08-11 11:45', user: '李四', object: '工单 QD-2026-0811-02', action: '问题整改完成', result: '已关闭' },
  { time: '2026-08-11 10:30', user: '张三', object: '规则「票号唯一性检查」', action: '版本 V2.1 → V2.2', result: '已发布' },
  { time: '2026-08-10 17:15', user: '王工', object: '《个人信息保护法》合规项', action: '完成合规性检查', result: '通过' },
  { time: '2026-08-10 15:40', user: '赵六', object: '质量认证「票务核心库」', action: '提交续期申请', result: '审批中' },
]

export type CertificationRecord = {
  id: string
  assetName: string
  assetType: string
  grade: 'A' | 'B' | 'C' | 'D'
  score: number
  certNo: string
  issueDate: string
  expireDate: string
  status: '有效' | '即将到期' | '已过期'
  owner: string
}

export function createCertifications(count: number): CertificationRecord[] {
  const assetPool = ['票务核心库', '客流分析库', '设备信号库', '乘客信息库', '线路档案库', '建设进度库', '财务资产库']
  const typePool = ['数据源', '数据集市', '数据表', '数据资产']
  const gradePool: CertificationRecord['grade'][] = ['A', 'A', 'B', 'B', 'C', 'D']
  return Array.from({ length: count }, (_, index) => {
    const issue = new Date(2026, 0, 1 + ((index * 11) % 220))
    const expire = new Date(issue)
    expire.setFullYear(issue.getFullYear() + 1)
    const status = index % 7 === 0 ? '即将到期' : index % 9 === 0 ? '已过期' : '有效'
    return {
      id: `cert-${index + 1}`,
      assetName: assetPool[index % assetPool.length],
      assetType: typePool[index % typePool.length],
      grade: gradePool[index % gradePool.length],
      score: 82 + ((index * 7) % 17),
      certNo: `GZMC-${2026}-${String(index + 1).padStart(4, '0')}`,
      issueDate: `${issue.getFullYear()}-${pad(issue.getMonth() + 1)}-${pad(issue.getDate())}`,
      expireDate: `${expire.getFullYear()}-${pad(expire.getMonth() + 1)}-${pad(expire.getDate())}`,
      status,
      owner: ['张三', '李四', '王五'][index % 3],
    }
  })
}

export const mockCertifications = createCertifications(120)
