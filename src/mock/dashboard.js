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
            {
                key: 'auditVol',
                label: '核查数据量',
                value: '3,680万',
                trend: '+6% 较上月',
                routeHint: '数据质量管理',
                icon: 'DataAnalysis',
            },
            {
                key: 'auditIssue',
                label: '核查问题数',
                value: '45,213',
                trend: '-8% 较上月',
                routeHint: '数据质量管理',
                icon: 'Warning',
            },
            {
                key: 'auditFixed',
                label: '问题治理数',
                value: '39,876',
                trend: '+11% 较上月',
                routeHint: '数据质量管理',
                icon: 'CircleCheck',
            },
            {
                key: 'auditRate',
                label: '治理率',
                value: '88.2%',
                trend: '+3.5% 较上月',
                routeHint: '数据质量管理',
                icon: 'Odometer',
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
        govDomains: [
            {
                name: '数据战略',
                rate: 89,
                passed: 3,
                items: [
                    { name: '数据战略规划', value: 92 },
                    { name: '治理组织建设', value: 90 },
                    { name: '管理制度体系', value: 88 },
                    { name: '资金投入保障', value: 85 },
                ],
            },
            {
                name: '数据治理',
                rate: 89,
                passed: 4,
                items: [
                    { name: '数据责任体系', value: 90 },
                    { name: '数据标准执行', value: 93 },
                    { name: '数据质量治理', value: 91 },
                    { name: '数据安全治理', value: 87 },
                    { name: '数据共享服务', value: 84 },
                ],
            },
            {
                name: '数据架构',
                rate: 89,
                passed: 4,
                items: [
                    { name: '数据模型管理', value: 92 },
                    { name: '元数据管理', value: 90 },
                    { name: '主数据管理', value: 86 },
                    { name: '数据分布管理', value: 88 },
                    { name: '数据流管理', value: 90 },
                ],
            },
            {
                name: '数据标准',
                rate: 91,
                passed: 4,
                items: [
                    { name: '业务术语标准', value: 91 },
                    { name: '参考数据标准', value: 89 },
                    { name: '主数据标准', value: 90 },
                    { name: '指标数据标准', value: 93 },
                ],
            },
            {
                name: '数据质量',
                rate: 92,
                passed: 4,
                items: [
                    { name: '完整性', value: 93 },
                    { name: '准确性', value: 91 },
                    { name: '一致性', value: 92 },
                    { name: '及时性', value: 95 },
                    { name: '有效性', value: 88 },
                ],
            },
            {
                name: '数据安全',
                rate: 90,
                passed: 4,
                items: [
                    { name: '权限管理', value: 94 },
                    { name: '加密脱敏', value: 90 },
                    { name: '安全审计', value: 92 },
                    { name: '隐私保护', value: 86 },
                ],
            },
            {
                name: '数据应用',
                rate: 86,
                passed: 3,
                items: [
                    { name: '数据服务', value: 88 },
                    { name: '数据分析', value: 90 },
                    { name: '数据开放', value: 82 },
                    { name: '数据赋能', value: 85 },
                ],
            },
            {
                name: '数据生存周期',
                rate: 90,
                passed: 4,
                items: [
                    { name: '数据需求', value: 87 },
                    { name: '数据设计', value: 90 },
                    { name: '数据开发', value: 92 },
                    { name: '数据运维', value: 89 },
                ],
            },
        ],
        agents: [
            {
                name: '元数据抽取智能体',
                icon: 'Download',
                runs: 128,
                online: true,
                metrics: [
                    { name: '抽取覆盖率', value: '96.8', unit: '%' },
                    { name: '抽取准确率', value: '98.2', unit: '%' },
                ],
            },
            {
                name: '元数据补全智能体',
                icon: 'MagicStick',
                runs: 342,
                online: true,
                metrics: [
                    { name: '补全准确率', value: '94.5', unit: '%' },
                    { name: '补全置信度均值', value: '0.87', unit: '' },
                ],
            },
            {
                name: '智能分级分类',
                icon: 'Collection',
                runs: 89,
                online: true,
                metrics: [
                    { name: '分级准确率', value: '93.1', unit: '%' },
                    { name: '分类覆盖率', value: '91.6', unit: '%' },
                ],
            },
            {
                name: '知识检索问答',
                icon: 'Notebook',
                runs: 2156,
                online: true,
                metrics: [
                    { name: '检索命中率', value: '95.4', unit: '%' },
                    { name: '问答准确率', value: '92.8', unit: '%' },
                ],
            },
        ],
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
