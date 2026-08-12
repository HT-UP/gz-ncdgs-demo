export type AssetLevel = 'L1' | 'L2' | 'L3' | 'L4'

export type CatalogNode = {
  id: string
  label: string
  type: 'domain' | 'layer' | 'custom'
  assetCount?: number
  children?: CatalogNode[]
}

export type AssetRecord = {
  id: string
  name: string
  type: '表' | '接口' | '视图'
  catalogPath: string
  catalogId: string
  responsibleDept: string
  owner: string
  level: AssetLevel
  tags: string[]
  description: string
  storageLayer: string
  tableCount?: number
  sizeMb: number
}

export type FieldMeta = {
  name: string
  dataType: string
  typeLabel: string
  length: number
  nullable: boolean
  primary: boolean
  comment: string
  sample: string
}

export type PermissionApplication = {
  id: string
  applicant: string
  resourceName: string
  resourceType: string
  permType: '读' | '写' | '全部'
  reason: string
  effectiveDate: string
  expireDate: string
  status: '已批准' | '待审批' | '已驳回' | '已到期'
  applyTime: string
  approver?: string
  opinion?: string
}

export type FeatureResult = {
  id: string
  tableName: string
  fieldName: string
  dataType: string
  semanticType: string
  fieldRole: '主键' | '外键' | '业务字段'
  distribution: string
  pattern: string
  rules: string[]
  tags: string[]
  status: '已确认' | '待确认'
  confidence: number
}

export type ExploreTask = {
  id: string
  name: string
  target: string
  type: string
  trigger: '手动触发' | '定时调度' | '事件触发'
  status: '运行中' | '成功' | '失败' | '待执行'
  progress: number
  lastRun: string
  owner: string
  result?: string
}

const pad = (value: number) => String(value).padStart(2, '0')

const formatDate = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(
    date.getMinutes(),
  )}:${pad(date.getSeconds())}`

export const catalogTree: CatalogNode[] = [
  {
    id: 'domain',
    label: '按业务域',
    type: 'domain',
    children: [
      { id: 'biz-passenger', label: '客运管理', type: 'custom', assetCount: 620 },
      { id: 'biz-facility', label: '设备设施', type: 'custom', assetCount: 540 },
      { id: 'biz-operation', label: '运营服务', type: 'custom', assetCount: 460 },
      { id: 'biz-construction', label: '建设管理', type: 'custom', assetCount: 380 },
      { id: 'biz-finance', label: '财务资产', type: 'custom', assetCount: 300 },
    ],
  },
  {
    id: 'layer',
    label: '按数据层级',
    type: 'layer',
    children: [
      { id: 'layer-ods', label: 'ODS 贴源层', type: 'custom', assetCount: 980 },
      { id: 'layer-dwd', label: 'DWD 明细层', type: 'custom', assetCount: 760 },
      { id: 'layer-dws', label: 'DWS 汇总层', type: 'custom', assetCount: 520 },
      { id: 'layer-ads', label: 'ADS 应用层', type: 'custom', assetCount: 340 },
    ],
  },
  {
    id: 'custom-cat',
    label: '自定义分类',
    type: 'domain',
    children: [
      { id: 'custom-map', label: '地图与空间数据', type: 'custom', assetCount: 210 },
      { id: 'custom-iot', label: '物联感知数据', type: 'custom', assetCount: 330 },
    ],
  },
]

const tablePool = [
  'ticket_sale_detail',
  'passenger_info',
  'station_info',
  'line_info',
  'device_status_log',
  'flow_stat_daily',
  'train_operation_log',
  'construction_progress',
  'finance_budget',
  'signal_collection',
  'map_geo_point',
  'iot_sensor_record',
]

const deptPool = ['信息中心', '票务部', '设备部', '运营部', '建设部', '财务部']
const ownerPool = ['张三', '李四', '王五', '赵六', '孙七']
const levelPool: AssetLevel[] = ['L1', 'L2', 'L2', 'L3', 'L3', 'L4']
const layerPool = ['ODS 贴源层', 'DWD 明细层', 'DWS 汇总层', 'ADS 应用层']
const tagPool = ['核心', '敏感', '个人隐私', '客流', '设备', '财务', '地图']

export function createAssets(count: number): AssetRecord[] {
  const now = new Date('2026-08-12T10:00:00')
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(now)
    date.setMinutes(now.getMinutes() - index)
    return {
      id: `as-${index + 1}`,
      name: tablePool[index % tablePool.length],
      type: index % 6 === 0 ? '接口' : index % 7 === 0 ? '视图' : '表',
      catalogPath: `/按业务域/${['客运管理', '设备设施', '运营服务', '建设管理', '财务资产'][index % 5]}`,
      catalogId: `biz-${['passenger', 'facility', 'operation', 'construction', 'finance'][index % 5]}`,
      responsibleDept: deptPool[index % deptPool.length],
      owner: ownerPool[index % ownerPool.length],
      level: levelPool[index % levelPool.length],
      tags: [tagPool[(index * 3) % tagPool.length], tagPool[(index * 3 + 1) % tagPool.length]],
      description: `第 ${index + 1} 张资产生成描述`,
      storageLayer: layerPool[index % layerPool.length],
      tableCount: index % 6 === 0 ? undefined : 1,
      sizeMb: 20 + ((index * 137) % 9000),
    }
  })
}

export const mockAssets = createAssets(500)

export const mockFields: FieldMeta[] = [
  { name: 'ticket_no', dataType: 'varchar', typeLabel: '字符串', length: 32, nullable: false, primary: true, comment: '票据唯一编号', sample: 'T202608110001' },
  { name: 'cust_id', dataType: 'bigint', typeLabel: '数值', length: 20, nullable: false, primary: false, comment: '乘客ID', sample: '10002345' },
  { name: 'cust_name', dataType: 'varchar', typeLabel: '字符串', length: 64, nullable: false, primary: false, comment: '乘客姓名', sample: '张三' },
  { name: 'id_card', dataType: 'varchar', typeLabel: '字符串', length: 18, nullable: true, primary: false, comment: '身份证号（脱敏）', sample: '4401**********1234' },
  { name: 'phone', dataType: 'varchar', typeLabel: '字符串', length: 20, nullable: true, primary: false, comment: '手机号', sample: '1380421****' },
  { name: 'flow_count', dataType: 'bigint', typeLabel: '数值', length: 20, nullable: false, primary: false, comment: '客流量', sample: '12845' },
  { name: 'line_code', dataType: 'varchar', typeLabel: '字符串', length: 8, nullable: false, primary: false, comment: '线路编码', sample: 'GZL1' },
  { name: 'station_name', dataType: 'varchar', typeLabel: '字符串', length: 64, nullable: false, primary: false, comment: '车站名称', sample: '广州塔站' },
  { name: 'stat_date', dataType: 'date', typeLabel: '日期', length: 0, nullable: false, primary: false, comment: '统计日期', sample: '2026-08-11' },
  { name: 'create_time', dataType: 'timestamp', typeLabel: '日期', length: 0, nullable: false, primary: false, comment: '入库时间', sample: '2026-08-11 03:02:10' },
  { name: 'device_no', dataType: 'varchar', typeLabel: '字符串', length: 32, nullable: true, primary: false, comment: '设备编号', sample: 'DEV-2026-0012' },
  { name: 'remark', dataType: 'text', typeLabel: '大文本', length: 65535, nullable: true, primary: false, comment: '备注（长文本），记录设备运行异常说明、维修记录等完整描述信息', sample: '设备在 08-11 凌晨发生告警，经排查为网络抖动导致连续 3 次心跳丢失……' },
]

export function createPermissionApplications(count: number): PermissionApplication[] {
  const now = new Date('2026-08-12T10:00:00')
  const statusPool = ['已批准', '待审批', '待审批', '已驳回', '已到期'] as const
  const permPool = ['读', '写', '全部'] as const
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(now)
    date.setHours(now.getHours() - index * 3)
    return {
      id: `perm-${index + 1}`,
      applicant: ownerPool[index % ownerPool.length],
      resourceName: tablePool[index % tablePool.length],
      resourceType: index % 6 === 0 ? '接口' : '表',
      permType: permPool[index % permPool.length],
      reason: ['数据分析需要', '业务运营支撑', '报表开发', '质量核查'][index % 4],
      effectiveDate: '2026-08-12',
      expireDate: new Date(now.getFullYear(), now.getMonth() + 1, now.getDate()).toISOString().slice(0, 10),
      status: statusPool[index % statusPool.length],
      applyTime: formatDate(date),
      approver: index % 3 === 0 ? '王工' : undefined,
      opinion: index % 3 === 0 ? (statusPool[index % statusPool.length] === '已批准' ? '用途合理，同意' : '信息不足，驳回') : undefined,
    }
  })
}

export const mockPermissions = createPermissionApplications(120)

export function createFeatureResults(count: number): FeatureResult[] {
  const semanticPool = ['姓名', '手机号', '身份证号码', '日期', '金额', '编码', '地址', '通用文本']
  const rolePool: FeatureResult['fieldRole'][] = ['主键', '业务字段', '业务字段', '外键', '业务字段']
  const rulePool = [
    '枚举值校验：status ∈ {0,1,2}',
    '取值范围：18 ≤ age ≤ 100',
    '格式校验：手机号 1[3-9] 开头 11 位',
    '逻辑约束：expire_date ≥ issue_date',
    '关联约束：FK → station_info.id',
  ]
  const tagPool = ['标识类', '描述类', '度量类', '时间类']
  return Array.from({ length: count }, (_, index) => ({
    id: `fe-${index + 1}`,
    tableName: tablePool[index % tablePool.length],
    fieldName: ['name', 'phone_no', 'id_card_no', 'amount_num', 'dt_date', 'code_id', 'addr_text'][index % 7],
    dataType: ['varchar', 'bigint', 'date', 'decimal'][index % 4],
    semanticType: semanticPool[index % semanticPool.length],
    fieldRole: rolePool[index % rolePool.length],
    distribution: index % 2 === 0 ? '正态分布' : index % 3 === 0 ? '偏态分布' : '离散分布',
    pattern: index % 4 === 0 ? '日周期性（规律波动）' : index % 4 === 1 ? '周周期性' : '无显著规律',
    rules: [rulePool[index % rulePool.length]],
    tags: [tagPool[index % tagPool.length]],
    status: index % 5 === 0 ? '待确认' : '已确认',
    confidence: 82 + ((index * 3) % 17),
  }))
}

export const mockFeatures = createFeatureResults(120)

export function createExploreTasks(count: number): ExploreTask[] {
  const now = new Date('2026-08-12T10:00:00')
  const triggerPool = ['手动触发', '定时调度', '事件触发'] as const
  const statusPool = ['成功', '成功', '运行中', '失败', '待执行'] as const
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(now)
    date.setMinutes(now.getMinutes() - index * 47)
    return {
      id: `ex-${index + 1}`,
      name: `${['字段特征', '数据分布', '异常模式', '周期规律'][index % 4]}探查-${index + 1}`,
      target: tablePool[index % tablePool.length],
      type: ['字段特征', '数据分布', '异常模式', '周期规律', '业务规则'][index % 5],
      trigger: triggerPool[index % triggerPool.length],
      status: statusPool[index % statusPool.length],
      progress: statusPool[index % statusPool.length] === '运行中' ? 40 + (index % 55) : 100,
      lastRun: formatDate(date),
      owner: ownerPool[index % ownerPool.length],
      result: index % 2 === 0 ? '发现 3 个异常模式，识别 5 个特征标签' : '未发现显著异常',
    }
  })
}

export const mockExploreTasks = createExploreTasks(56)