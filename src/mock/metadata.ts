export type DataElementStatus = '草稿' | '待审核' | '已发布' | '已废止'

export type DataElement = {
  id: string
  identifier: string
  name: string
  dataType: string
  length: number
  range: string
  defaultValue: string
  constraint: string
  status: DataElementStatus
  owner: string
  domain: string
  referencedCount: number
  updateTime: string
  description: string
}

const identifierPool = ['CUST_ID', 'LINE_CODE', 'STATION_NAME', 'TICKET_NO', 'DEVICE_NO', 'WORK_ORDER_NO', 'ASSET_CODE', 'FLOW_COUNT', 'PASSENGER_COUNT', 'ALARM_LEVEL', 'SIGNAL_STATUS', 'POWER_VOLTAGE', 'TUNNEL_SECTION', 'TRAIN_NO', 'SAFETY_EVENT_NO']
const namePool = ['客户编号', '线路编码', '车站名称', '车票编号', '设备编号', '工单编号', '资产编码', '客流量', '客流量统计', '告警级别', '信号状态', '供电电压', '隧道区间', '车次号', '安全事件编号']
const dataTypePool = ['VARCHAR', 'INT', 'DECIMAL', 'DATETIME', 'CHAR', 'BIGINT']
const domainPool = ['客运管理', '建设管理', '设备设施', '运营服务', '财务资产', '安全应急']
const ownerPool = ['张三', '李四', '王五', '赵六', '孙七']
const statusPool: DataElementStatus[] = ['已发布', '已发布', '待审核', '草稿', '已废止']

const pad = (value: number) => String(value).padStart(2, '0')

const formatDate = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(
    date.getMinutes(),
  )}:${pad(date.getSeconds())}`

export function createDataElements(count: number): DataElement[] {
  const now = new Date('2026-08-11T14:32:08')
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(now)
    date.setDate(now.getDate() - (index % 60))
    const length = dataTypePool[index % dataTypePool.length] === 'VARCHAR' ? 16 + (index % 3) * 16 : 11
    return {
      id: `de-${index + 1}`,
      identifier: identifierPool[index % identifierPool.length],
      name: namePool[index % namePool.length],
      dataType: dataTypePool[index % dataTypePool.length],
      length,
      range: index % 2 === 0 ? '必填' : '非必填',
      defaultValue: index % 3 === 0 ? '0' : '-',
      constraint: index % 2 === 0 ? '唯一约束' : '无',
      status: statusPool[index % statusPool.length],
      owner: ownerPool[index % ownerPool.length],
      domain: domainPool[index % domainPool.length],
      referencedCount: (index * 7) % 18,
      updateTime: formatDate(date),
      description: `${namePool[index % namePool.length]}数据元的业务定义与约束说明`,
    }
  })
}

export const mockDataElements = createDataElements(220)

export type CollectionTaskStatus = '成功' | '运行中' | '失败' | '等待调度'

export type CollectionTask = {
  id: string
  name: string
  sourceName: string
  sourceType: string
  schedule: string
  status: CollectionTaskStatus
  collectedCount: number
  lastRunTime: string
  owner: string
}

export function createCollectionTasks(count: number): CollectionTask[] {
  const now = new Date('2026-08-11T14:32:08')
  const sourcePool = ['票务核心库', '设备信号库', '客流分析库', '建设进度库', '资产管理系统', '运维工单库']
  const typePool = ['MySQL', 'Oracle', 'Kafka', 'MongoDB', 'SQLServer']
  const schedulePool = ['每小时', '每日 02:00', '每日 06:00', '每周一 03:00', '每分钟']
  const statusPool: CollectionTaskStatus[] = ['成功', '成功', '运行中', '失败', '等待调度']
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(now)
    date.setHours(now.getHours() - (index % 24))
    return {
      id: `task-${index + 1}`,
      name: `${sourcePool[index % sourcePool.length]}-元数据采集`,
      sourceName: sourcePool[index % sourcePool.length],
      sourceType: typePool[index % typePool.length],
      schedule: schedulePool[index % schedulePool.length],
      status: statusPool[index % statusPool.length],
      collectedCount: 20 + ((index * 37) % 400),
      lastRunTime: formatDate(date),
      owner: ownerPool[index % ownerPool.length],
    }
  })
}

export const mockCollectionTasks = createCollectionTasks(52)

export const metadataCatalog = [
  {
    name: '客运管理',
    children: ['票务核心库', '客流分析库', '票务历史库'],
  },
  {
    name: '建设管理',
    children: ['建设进度库', '设计图纸库', '工程档案库'],
  },
  {
    name: '设备设施',
    children: ['设备信号库', '供电监控库', '隧道监测库'],
  },
  {
    name: '运营服务',
    children: ['运维工单库', '客服服务库'],
  },
]
