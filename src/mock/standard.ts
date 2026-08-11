export type StandardCategory = '业务术语' | '数据元' | '参考数据' | '指标标准'

export type StandardStatus = '草稿' | '审核中' | '已发布' | '已废止'

export type StandardItem = {
  id: string
  code: string
  name: string
  category: StandardCategory
  domain: string
  owner: string
  status: StandardStatus
  updateTime: string
  version: string
  mappedFields: number
  description: string
}

const categoryPool: StandardCategory[] = ['业务术语', '数据元', '参考数据', '指标标准']
const domainPool = ['客运管理', '建设管理', '设备设施', '运营服务', '财务资产', '安全应急']
const ownerPool = ['张三', '李四', '王五', '赵六', '孙七']
const statusPool: StandardStatus[] = ['已发布', '已发布', '审核中', '草稿', '已废止']
const wordPool = ['客户', '线路', '车站', '里程', '客流量', '工程进度', '设备', '工单', '资产', '安全', '信号', '供电', '隧道', '桥梁', '车辆', '站点']

const pad = (value: number) => String(value).padStart(2, '0')

const formatDate = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(
    date.getMinutes(),
  )}:${pad(date.getSeconds())}`

function createStandards(count: number): StandardItem[] {
  const now = new Date('2026-08-11T14:32:08')
  return Array.from({ length: count }, (_, index) => {
    const category = categoryPool[index % categoryPool.length]
    const word1 = wordPool[(index * 7) % wordPool.length]
    const word2 = wordPool[(index * 13 + 3) % wordPool.length]
    const date = new Date(now)
    date.setDate(now.getDate() - (index % 40))
    return {
      id: String(index + 1),
      code: `BZ-${String(index + 1).padStart(4, '0')}`,
      name: `${word1}${word2}${category === '数据元' ? '代码' : category === '指标标准' ? '指标' : '信息'}`,
      category,
      domain: domainPool[index % domainPool.length],
      owner: ownerPool[index % ownerPool.length],
      status: statusPool[index % statusPool.length],
      updateTime: formatDate(date),
      version: `V${Math.floor(index / 20) + 1}.${index % 5}`,
      mappedFields: index % 12,
      description: `${word1}${word2}相关数据标准定义，用于支撑业务数据的一致性与规范化管理`,
    }
  })
}

export const mockStandards = createStandards(220)

export const standardCategoryOptions: { label: StandardCategory; value: StandardCategory }[] = [
  { label: '业务术语', value: '业务术语' },
  { label: '数据元', value: '数据元' },
  { label: '参考数据', value: '参考数据' },
  { label: '指标标准', value: '指标标准' },
]
