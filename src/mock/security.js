const pad = (value) => String(value).padStart(2, '0');
const formatDate = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
const tenantBase = [
    { id: 't1', name: '广州地铁设计研究院', type: '设计单位' },
    { id: 't2', name: '中铁监理一分公司', type: '监理单位' },
    { id: 't3', name: '广州盾构工程公司', type: '施工单位' },
    { id: 't4', name: '轨道运营管理公司', type: '运营单位' },
    { id: 't5', name: '华南理工大学课题组', type: '研究机构' },
    { id: 't6', name: '市交通运输局', type: '政府部门' },
    { id: 't7', name: '南方测绘工程公司', type: '施工单位' },
    { id: 't8', name: '设备集成安装公司', type: '施工单位' },
];
const resourcePool = ['ticket_sale_detail', 'passenger_info', 'station_info', 'line_info', 'device_status_log', 'flow_stat_daily'];
const systemPool = ['票务系统', '客流系统', '设备系统', '建设系统'];
export function createTenants(count) {
    return tenantBase.slice(0, count).map((tenant, index) => ({
        ...tenant,
        status: index === 0 ? '启用' : index % 4 === 0 ? '停用' : '启用',
        ldap: index % 2 === 0,
        sso: index % 3 === 0,
        storageQuota: 2048,
        storageUsed: 320 + ((index * 173) % 1400),
        taskConcurrency: index % 3 === 0 ? 8 : 4,
        owner: ['张三', '王工', '李四', '赵六'][index % 4],
        expireDate: new Date(2027, 0, 1 + index).toISOString().slice(0, 10),
        createTime: `2026-0${(index % 4) + 1}-${pad((index % 20) + 5)} 10:00:00`,
        systems: [systemPool[index % 4], systemPool[(index + 1) % 4]],
    }));
}
export const mockTenants = createTenants(8);
export function createPolicies(count) {
    const now = new Date('2026-08-12T10:00:00');
    const subjectPool = ['数据中心管理员', '业务分析员', '数据治理专员', '审计员', '张三', '李四'];
    const statusPool = ['生效', '生效', '待生效', '已过期', '待审批'];
    return Array.from({ length: count }, (_, index) => {
        const date = new Date(now);
        date.setDate(now.getDate() - (index % 60));
        return {
            id: `pol-${index + 1}`,
            subject: subjectPool[index % subjectPool.length],
            subjectType: index % 3 === 0 ? '角色' : index % 3 === 1 ? '用户' : '部门',
            resourceType: '表',
            object: resourcePool[index % resourcePool.length],
            objectType: index % 5 === 0 ? '字段' : index % 7 === 0 ? '行' : '表',
            actions: ['读', '全部', '写'][index % 3],
            level: ['高', '中', '低'][index % 3],
            effectiveDate: date.toISOString().slice(0, 10),
            expireDate: new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString().slice(0, 10),
            source: index % 2 === 0 ? 'RBAC' : 'ABAC',
            status: statusPool[index % statusPool.length],
            lastChange: formatDate(date),
            changeUser: ['张三', '李四', '王五'][index % 3],
        };
    });
}
export const mockPolicies = createPolicies(56);
const actionPool = ['登录系统', '查询数据', '导出数据', '修改权限', '创建策略', '下载报告', '删除资源', '执行任务', '脱敏规则变更', '访问受限资源'];
export function createAuditLogs(count) {
    const now = new Date('2026-08-12T10:00:00');
    const userPool = ['张三', '李四', '王五', '赵六', 'admin', '孙七'];
    const objectPool = [...resourcePool, '权限策略', '脱敏规则', '系统配置', '合规报告'];
    return Array.from({ length: count }, (_, index) => {
        const date = new Date(now);
        date.setMinutes(now.getMinutes() - index * 7);
        const abnormal = index % 47 === 0;
        return {
            id: `log-${index + 1}`,
            time: formatDate(date),
            user: userPool[index % userPool.length],
            action: actionPool[index % actionPool.length],
            object: objectPool[index % objectPool.length],
            result: index % 17 === 0 ? '失败' : '成功',
            ip: `10.20.${(index % 16) + 1}.${(index % 200) + 20}`,
            abnormal,
            operationType: ['认证', '访问', '导出', '治理', '配置'][index % 5],
        };
    });
}
export const mockAuditLogs = createAuditLogs(520);
export function createMaskingRules(count) {
    const now = new Date('2026-08-12T10:00:00');
    const methodPool = ['掩码', '掩码', '替换', '哈希'];
    return Array.from({ length: count }, (_, index) => {
        const date = new Date(now);
        date.setDate(now.getDate() - (index % 30));
        const beforePool = ['张三', '13804213190', '440102199001011234', '广州市天河区珠江新城', 'T202608110001'];
        const afterPool = ['张*', '138****3190', '4401**********1234', '广州市****', 'a3f8e1d9c2b4a1f5'];
        return {
            id: `msk-${index + 1}`,
            name: `${['姓名', '手机号', '身份证', '地址', '票号'][index % 5]}掩码规则`,
            field: `passenger_info.${['cust_name', 'phone', 'id_card', 'address', 'ticket_no'][index % 5]}`,
            method: methodPool[index % methodPool.length],
            preserveFormat: index % 3 !== 0,
            sampleBefore: beforePool[index % beforePool.length],
            sampleAfter: afterPool[index % afterPool.length],
            scope: index % 2 === 0 ? '查询实时脱敏' : '存储静态脱敏',
            status: ['已上线', '已上线', '已上线', '审批中', '草稿'][index % 5],
            version: `V${1 + (index % 3)}.${index % 4}`,
            updateTime: formatDate(date),
        };
    });
}
export const mockMaskingRules = createMaskingRules(24);
export function createComplianceItems(count) {
    const regulationPool = ['《数据安全法》', '《个人信息保护法》', '《网络安全法》', '《数据出境安全评估办法》', '《关键信息基础设施安全保护条例》'];
    const clausePool = ['第五章 第三十三条', '第二章 第二十一条', '第四章 第二十七条', '第十二条', '第六条'];
    const featurePool = ['访问控制策略', '加密与脱敏', '安全审计日志', '权限有效期管理', '数据分级分类', '安全总览仪表盘'];
    return Array.from({ length: count }, (_, index) => {
        const date = new Date(2026, 7, 1 + (index % 11));
        const status = index % 6 === 0 ? '不合规' : index % 4 === 0 ? '待整改' : '合规';
        return {
            id: `comp-${index + 1}`,
            regulation: regulationPool[index % regulationPool.length],
            clause: clausePool[index % clausePool.length],
            requirement: `${['建立数据分类分级制度', '个人信息最小必要原则', '日志留存不少于6个月', '重要数据出境评估', '加密传输通道'][index % 5]}要求`,
            mappedFeature: featurePool[index % featurePool.length],
            status,
            riskLevel: ['高', '中', '低'][index % 3],
            checkTime: `2026-08-${pad((index % 11) + 1)} 09:00:00`,
            riskId: status === '合规' ? undefined : `RISK-2026-${pad(index + 1)}`,
        };
    });
}
export const mockComplianceItems = createComplianceItems(52);
