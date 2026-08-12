export type SystemUser = {
  id: string
  username: string
  realName: string
  dept: string
  tenant: string
  roles: string[]
  status: '启用' | '停用'
  sso: boolean
  ldap: boolean
  phone: string
  lastLoginTime: string
  lastLoginIp: string
  createTime: string
  pwdExpireDays: number
}

export type SystemRole = {
  id: string
  name: string
  code: string
  level: '管理员' | '治理员' | '开发者' | '只读'
  description: string
  userCount: number
  builtin: boolean
  updateTime: string
  updateUser: string
}

export type OperationLog = {
  id: string
  time: string
  user: string
  tenant: string
  operationType: string
  action: string
  object: string
  result: '成功' | '失败'
  ip: string
  duration: string
  abnormal: boolean
  params: string
  response: string
}

export type ResourcePoint = {
  cpu: number
  memory: number
  storage: number
  network: number
}

const pad = (value: number) => String(value).padStart(2, '0')

const formatDate = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(
    date.getMinutes(),
  )}:${pad(date.getSeconds())}`

const tenantPool = ['广州地铁设计研究院', '轨道运营管理公司', '广州盾构工程公司', '市交通运输局', '华南理工大学课题组']

export function createUsers(count: number): SystemUser[] {
  const now = new Date('2026-08-12T10:00:00')
  const deptPool = ['信息中心', '数据治理部', '业务运营部', '综合管理部']
  const rolePool = ['系统管理员', '数据治理员', '数据开发', '只读用户']
  return Array.from({ length: count }, (_, index) => {
    const loginDate = new Date(now)
    loginDate.setDate(now.getDate() - (index % 10))
    const status = index % 13 === 0 ? '停用' : '启用'
    return {
      id: `usr-${index + 1}`,
      username: index === 0 ? 'admin' : `user${index + 1}`,
      realName: ['张三', '李四', '王五', '赵六', '孙七', '周八', '吴九', '郑十'][index % 8],
      dept: deptPool[index % deptPool.length],
      tenant: tenantPool[index % tenantPool.length],
      roles: index === 0 ? ['系统管理员'] : [rolePool[index % rolePool.length]],
      status,
      sso: index % 2 === 0,
      ldap: index % 3 === 0,
      phone: `138${pad((index * 137) % 100000000)}`,
      lastLoginTime: formatDate(loginDate),
      lastLoginIp: `10.20.${(index % 16) + 1}.${(index % 200) + 20}`,
      createTime: `2026-0${(index % 5) + 1}-${pad((index % 20) + 5)} 09:30:00`,
      pwdExpireDays: status === '启用' ? 30 + (index % 60) : 0,
    }
  })
}

export const mockUsers = createUsers(56)

export const rolePermissionTree = [
  {
    key: 'dashboard',
    name: '驾驶舱',
    children: [
      { key: 'dashboard:view', name: '查看总览' },
      { key: 'dashboard:export', name: '导出报表' },
    ],
  },
  {
    key: 'metadata',
    name: '元数据管理',
    children: [
      { key: 'metadata:view', name: '查看元数据' },
      { key: 'metadata:edit', name: '编辑元数据' },
      { key: 'metadata:ai', name: 'AI 智能补全' },
    ],
  },
  {
    key: 'quality',
    name: '数据质量',
    children: [
      { key: 'quality:view', name: '查看质量报告' },
      { key: 'quality:rule', name: '规则配置' },
      { key: 'quality:audit', name: '质量稽核' },
    ],
  },
  {
    key: 'resource',
    name: '数据资源',
    children: [
      { key: 'resource:view', name: '查看资源目录' },
      { key: 'resource:register', name: '资产注册' },
      { key: 'resource:permission', name: '权限申请' },
    ],
  },
  {
    key: 'security',
    name: '数据安全',
    children: [
      { key: 'security:view', name: '安全总览' },
      { key: 'security:policy', name: '策略配置' },
      { key: 'security:audit', name: '审计日志' },
    ],
  },
  {
    key: 'intelligence',
    name: '智能治理',
    children: [
      { key: 'intelligence:view', name: '智能总览' },
      { key: 'intelligence:agent', name: '智能体管理' },
    ],
  },
  {
    key: 'system',
    name: '系统管理',
    children: [
      { key: 'system:user', name: '用户管理' },
      { key: 'system:role', name: '角色权限' },
      { key: 'system:monitor', name: '运维监控' },
      { key: 'system:log', name: '操作日志' },
    ],
  },
]

export const dataScopePool = ['全部数据', '本租户', '本部门', '仅本人']

export function createRoles(count: number): SystemRole[] {
  const levelPool = ['管理员', '管理员', '治理员', '开发者', '开发者', '只读'] as const
  const namePool = ['超级管理员', '系统管理员', '数据治理员', '数据开发', '业务分析员', '只读用户', '安全审计员', '租户管理员', '运维工程师', '外部访客']
  return Array.from({ length: count }, (_, index) => {
    const now = new Date(2026, 7, 1 + (index % 11))
    return {
      id: `role-${index + 1}`,
      name: namePool[index % namePool.length],
      code: ['super_admin', 'system_admin', 'governance', 'developer', 'analyst', 'readonly'][index % 6],
      level: levelPool[index % levelPool.length],
      description: `${['拥有全部系统权限', '负责系统配置与账号管理', '负责元数据与质量管理', '负责数据开发与调度', '负责业务数据分析', '仅可查看数据，不可操作'][index % 6]}`,
      userCount: 2 + ((index * 7) % 40),
      builtin: index === 0,
      updateTime: `2026-08-${pad((index % 11) + 1)} 14:00:00`,
      updateUser: ['张三', '李四'][index % 2],
    }
  })
}

export const mockRoles = createRoles(12)

export const roleChangeAudit = [
  { time: '2026-08-12 09:12', user: '张三', action: '克隆角色', detail: '克隆「数据治理员」为「数据治理员-副本」' },
  { time: '2026-08-11 17:30', user: '李四', action: '分配权限', detail: '「安全审计员」新增数据安全审计按钮权限' },
  { time: '2026-08-10 15:45', user: '张三', action: '绑定用户', detail: '「只读用户」新增 6 名绑定用户' },
  { time: '2026-08-08 11:20', user: '李四', action: '修改数据权限', detail: '「业务分析员」数据范围改为本租户' },
]

export const passwordPolicy = {
  minLength: 10,
  complexity: 3,
  expireDays: 90,
  history: 5,
  lockAttempts: 5,
  lockMinutes: 30,
}

export const loginRecords = [
  { time: '2026-08-12 09:45:20', ip: '10.20.8.66', device: 'Chrome / Windows', result: '成功' },
  { time: '2026-08-12 09:44:02', ip: '10.20.8.66', device: 'Chrome / Windows', result: '失败（密码错误）' },
  { time: '2026-08-11 18:20:11', ip: '10.20.8.31', device: 'Edge / Windows', result: '成功' },
  { time: '2026-08-11 09:12:47', ip: '10.20.8.66', device: 'Chrome / Windows', result: '成功' },
]

export const realtimeMetrics = {
  cpu: 62,
  memory: 71,
  storage: 58,
  network: 46,
  cpuThreshold: 85,
  memoryThreshold: 85,
  storageThreshold: 80,
  networkThreshold: 80,
}

export const trend30Days = {
  days: Array.from({ length: 30 }, (_, i) => `07-${pad((i % 11) + 14)}`),
  cpu: Array.from({ length: 30 }, (_, i) => 40 + Math.round(Math.abs(Math.sin(i / 3.1)) * 45 + (i % 5) * 1.4)),
  memory: Array.from({ length: 30 }, (_, i) => 50 + Math.round(Math.abs(Math.cos(i / 4.2)) * 35 + (i % 3) * 2.1)),
  storage: Array.from({ length: 30 }, (_, i) => 42 + Math.round((i * 0.9) % 22)),
  network: Array.from({ length: 30 }, (_, i) => 30 + Math.round(Math.abs(Math.sin(i / 2.4)) * 55)),
}

export const capacitySuggestions = [
  { title: '计算资源扩容建议', desc: '近 30 天 CPU 峰值 91%，建议增加 2 个计算节点或将调度并发从 8 提升至 12（Mock）', level: '高' },
  { title: '存储空间优化建议', desc: '归档 90 天前的审计日志可释放约 12% 存储空间（Mock）', level: '中' },
  { title: '网络带宽评估', desc: '当前峰值带宽利用率 46%，未来 6 个月无瓶颈风险（Mock）', level: '低' },
]

export const taskMonitorStats = [
  { name: '元数据采集任务', total: 128, success: 124, avgDuration: '42s', abnormal: 2 },
  { name: '质量稽核任务', total: 96, success: 91, avgDuration: '68s', abnormal: 1 },
  { name: '分类分级任务', total: 64, success: 63, avgDuration: '3m12s', abnormal: 0 },
  { name: '数据同步任务', total: 42, success: 38, avgDuration: '25s', abnormal: 3 },
]

export function createOperationLogs(count: number): OperationLog[] {
  const now = new Date('2026-08-12T10:00:00')
  const typePool = ['登录', '查询', '修改', '删除', '审批'] as const
  const userPool = ['张三', '李四', '王五', '赵六', 'admin', '孙七']
  const actionPool = ['登录系统', '查询元数据', '修改权限策略', '删除资源', '审批通过', '导出报表', '创建任务', '回写元数据']
  const objectPool = ['ticket_sale_detail', '权限策略 pol-12', '用户 user23', '质量规则 rule-7', '资源资产 128', '补全任务 #86']
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(now)
    date.setMinutes(now.getMinutes() - index * 5)
    const result = index % 23 === 0 ? '失败' : '成功'
    return {
      id: `op-${index + 1}`,
      time: formatDate(date),
      user: userPool[index % userPool.length],
      tenant: tenantPool[index % tenantPool.length],
      operationType: typePool[index % typePool.length],
      action: actionPool[index % actionPool.length],
      object: objectPool[index % objectPool.length],
      result,
      ip: `10.20.${(index % 16) + 1}.${(index % 200) + 20}`,
      duration: `${40 + ((index * 17) % 900)}ms`,
      abnormal: result === '失败' && index % 5 === 0,
      params: `{ "keyword": "passenger", "page": 1, "size": 20 }`,
      response: result === '成功' ? '{ "code": 200, "data": { ... } }' : '{ "code": 500, "msg": "服务内部错误" }',
    }
  })
}

export const mockOperationLogs = createOperationLogs(520)