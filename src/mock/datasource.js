const typePool = [
    { type: 'MySQL', category: '结构化' },
    { type: 'Oracle', category: '结构化' },
    { type: 'SQLServer', category: '结构化' },
    { type: 'MongoDB', category: '半结构化' },
    { type: 'Kafka', category: '半结构化' },
    { type: 'GaussDB', category: '结构化' },
    { type: 'OceanBase', category: '结构化' },
    { type: '虚谷', category: '结构化' },
    { type: '金仓', category: '结构化' },
    { type: '崖山', category: '结构化' },
    { type: 'RabbitMQ', category: '半结构化' },
    { type: '文本/CSV', category: '非结构化' },
    { type: '图片/音视频', category: '非结构化' },
    { type: 'JSON/XML', category: '半结构化' },
];
const ownerPool = ['张三', '李四', '王五', '赵六', '孙七', '周八'];
const groupPool = ['客运数据组', '建设数据组', '设备数据组', '财务数据组', '安全数据组'];
const envPool = ['生产', '测试', '开发'];
const nameWordPool = ['票务', '线路', '车站', '设备', '工单', '资产', '客流', '安全', '信号', '供电', '隧道', '车辆'];
const statusPool = ['已连接', '已连接', '已连接', '连接中', '已断开', '异常'];
const pad = (value) => String(value).padStart(2, '0');
const formatDate = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
export function createDataSources(count) {
    const now = new Date('2026-08-11T14:32:08');
    return Array.from({ length: count }, (_, index) => {
        const picked = typePool[index % typePool.length];
        const word = nameWordPool[(index * 5) % nameWordPool.length];
        const date = new Date(now);
        date.setMinutes(now.getMinutes() - index * 37);
        const env = envPool[index % envPool.length];
        return {
            id: `ds-${index + 1}`,
            name: `${word}${picked.type}库`,
            type: picked.type,
            category: picked.category,
            host: `10.20.${index % 60}.${(index * 7) % 240}`,
            port: index % 3 === 0 ? '3306' : index % 3 === 1 ? '1521' : '9092',
            database: index % 2 === 0 ? `metro_${word.toLowerCase()}_${env}` : `core_${word.toLowerCase()}`,
            owner: ownerPool[index % ownerPool.length],
            groupName: groupPool[index % groupPool.length],
            status: statusPool[index % statusPool.length],
            env,
            responseTime: 12 + ((index * 13) % 480),
            updateTime: formatDate(date),
            description: `${word}业务域${picked.type}数据源，承载核心业务数据接入`,
        };
    });
}
export const mockDataSources = createDataSources(52);
export const dataSourceTypes = typePool.map((item) => item.type);
