const pad = (value) => String(value).padStart(2, '0');
const formatTime = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
const createDates = (count) => {
    const today = new Date('2026-08-11T14:32:08');
    return Array.from({ length: count }, (_, index) => {
        const date = new Date(today);
        date.setDate(today.getDate() - (count - 1 - index));
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
    });
};
const randomShift = (base, delta = 2) => base + Math.round((Math.random() - 0.5) * delta);
export function createDashboardMock() {
    const now = new Date();
    const dates = createDates(7);
    const comprehensive = [88, 89, 90, 91, 92, 92, 93].map((value) => randomShift(value, 1));
    const integrity = [85, 86, 87, 88, 89, 90, 91].map((value) => randomShift(value, 1));
    const accuracy = [90, 91, 92, 92, 93, 93, 94].map((value) => randomShift(value, 1));
    const consistency = [87, 88, 88, 89, 90, 91, 91].map((value) => randomShift(value, 1));
    const timeliness = [92, 92, 93, 94, 94, 95, 95].map((value) => randomShift(value, 1));
    return {
        stats: [
            {
                key: 'dataSourceTotal',
                label: '数据源总数',
                value: '156',
                trend: '+12% 较上月',
                routeHint: '数据源管理',
                icon: 'Database',
            },
            {
                key: 'standardTotal',
                label: '标准总数',
                value: '234',
                trend: '+8% 较上月',
                routeHint: '数据标准管理',
                icon: 'DocumentChecked',
            },
            {
                key: 'qualityScore',
                label: '质量评分',
                value: '92.6',
                trend: '+2.1 较上月',
                routeHint: '数据质量管理',
                icon: 'StarFilled',
            },
            {
                key: 'taskTotal',
                label: '治理任务',
                value: '1,284',
                trend: '+15% 较上月',
                routeHint: '数据开发集成',
                icon: 'Operation',
            },
        ],
        qualityTrend: {
            dates,
            comprehensive,
            integrity,
            accuracy,
            consistency,
            timeliness,
        },
        taskStatus: {
            running: randomShift(450, 8),
            success: randomShift(578, 8),
            failed: randomShift(103, 4),
            pending: randomShift(153, 6),
        },
        alerts: [
            {
                level: '严重',
                levelColor: '#E34D59',
                content: '数据源 MySQL-01 连接超时',
                time: formatTime(new Date(now.getTime() - 1000 * 60 * 22)),
                status: '未处理',
            },
            {
                level: '警告',
                levelColor: '#ED7B2F',
                content: '质量任务 "订单数据完整性检查" 执行失败',
                time: formatTime(new Date(now.getTime() - 1000 * 60 * 37)),
                status: '处理中',
            },
            {
                level: '提示',
                levelColor: '#2B6CB0',
                content: '元数据采集任务 "生产库-全量采集" 已完成',
                time: formatTime(new Date(now.getTime() - 1000 * 60 * 67)),
                status: '已处理',
            },
            {
                level: '严重',
                levelColor: '#E34D59',
                content: '数据存储空间使用率已达 87%（阈值 85%）',
                time: formatTime(new Date(now.getTime() - 1000 * 60 * 109)),
                status: '未处理',
            },
            {
                level: '警告',
                levelColor: '#ED7B2F',
                content: '数据同步延迟 512ms，超过阈值 500ms',
                time: formatTime(new Date(now.getTime() - 1000 * 60 * 124)),
                status: '处理中',
            },
        ],
        todos: [
            {
                type: '待审批',
                typeColor: '#2B6CB0',
                content: '张三申请数据资源 "客户信息表" 查询权限',
                deadline: '2026-08-11',
                priority: '高',
            },
            {
                type: '待处理',
                typeColor: '#ED7B2F',
                content: '数据标准 "客户编号" 变更申请审核',
                deadline: '2026-08-11',
                priority: '中',
            },
            {
                type: '待处理',
                typeColor: '#ED7B2F',
                content: '质量问题工单 #Q20260811-003 修复确认',
                deadline: '2026-08-12',
                priority: '高',
            },
            {
                type: '待确认',
                typeColor: '#9B59B6',
                content: '元数据智能补全建议 15 条待确认',
                deadline: '2026-08-13',
                priority: '中',
            },
            {
                type: '待评审',
                typeColor: '#8C8C8C',
                content: '数据模型变更申请 #M20260810-001',
                deadline: '2026-08-14',
                priority: '低',
            },
        ],
        notices: [
            {
                type: '通知',
                typeColor: '#2B6CB0',
                content: '系统将于2026年8月15日凌晨2:00-4:00进行例行维护，请提前保存工作。',
                time: '2026-08-10 16:00:00',
            },
            {
                type: '公告',
                typeColor: '#DA251D',
                content: '新线建设数据治理系统已成功接入试点新线结构化数据1,280张表，数据量约3.2TB。',
                time: '2026-08-09 10:30:00',
            },
            {
                type: '通知',
                typeColor: '#2B6CB0',
                content: '数据质量管理模块已升级至V2.1，新增异常根因智能定位功能。',
                time: '2026-08-08 14:20:00',
            },
        ],
        updateTime: formatTime(now),
    };
}
