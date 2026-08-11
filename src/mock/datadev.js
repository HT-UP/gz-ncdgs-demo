const taskNamePool = [
    '票务数据日结同步',
    '客流统计批量加工',
    '设备状态增量采集',
    '客户主数据实时同步',
    '车站客流实时汇聚',
    '运营指标流式聚合',
    '财务数据月度汇总',
    '安全事件实时告警',
    '信号设备状态清洗',
    '隧道监测数据入库',
    '工单数据全量刷新',
    '资产数据增量同步',
];
const sourcePool = ['票务核心库', '设备信号库', '客流分析库', 'Kafka 客流主题', '建设进度库', '运维工单库'];
const targetPool = ['数据湖 ODS', '数仓 DWD', '数仓 DWS', '数据集市', '指标库'];
const schedulePool = ['每日 02:00', '每小时', '每分钟', '每周一 03:00', '手动触发'];
const statusPool = ['成功', '成功', '运行中', '失败', '待执行', '成功'];
const typePool = ['批量', '批量', '批量', '实时', '流式'];
const pad = (value) => String(value).padStart(2, '0');
const formatDate = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
export function createDevTasks(count) {
    const now = new Date('2026-08-11T14:32:08');
    return Array.from({ length: count }, (_, index) => {
        const date = new Date(now);
        date.setMinutes(now.getMinutes() - index * 17);
        return {
            id: `dev-${index + 1}`,
            name: taskNamePool[index % taskNamePool.length],
            type: typePool[index % typePool.length],
            sourceName: sourcePool[index % sourcePool.length],
            targetName: targetPool[index % targetPool.length],
            schedule: schedulePool[index % schedulePool.length],
            status: statusPool[index % statusPool.length],
            progress: statusPool[index % statusPool.length] === '运行中' ? 40 + (index % 55) : 100,
            dataCount: 1200 + ((index * 631) % 980000),
            owner: ['张三', '李四', '王五', '赵六', '孙七'][index % 5],
            lastRunTime: formatDate(date),
            description: `${taskNamePool[index % taskNamePool.length]}任务的执行说明`,
        };
    });
}
export const mockDevTasks = createDevTasks(108);
export const mockRealtimeTasks = createDevTasks(22).filter((task) => task.type === '实时');
export const mockStreamTasks = createDevTasks(16).filter((task) => task.type === '流式');
