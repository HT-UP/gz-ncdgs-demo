import { computed, reactive, ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { DocumentCopy, Download, Plus, Search } from '@element-plus/icons-vue';
import { mockComplianceItems } from '@/mock/security';
const activeTab = ref('classify');
/* ==================== 数据分类分级 ==================== */
const gradeMatrix = [
    { object: '国家安全', low: 'L2', mid: 'L3', high: 'L4' },
    { object: '公共利益', low: 'L2', mid: 'L3', high: 'L4' },
    { object: '个人权益', low: 'L1', mid: 'L2', high: 'L3' },
    { object: '企业权益', low: 'L1', mid: 'L2', high: 'L3' },
];
const gradeBrief = {
    L1: '一般',
    L2: '内部',
    L3: '敏感',
    L4: '核心',
};
const gradeTagType = {
    L1: 'info',
    L2: 'primary',
    L3: 'warning',
    L4: 'danger',
};
const gradeDefine = [
    { level: 'L1', name: '一般数据', desc: '泄露后仅造成轻微影响，可公开' },
    { level: 'L2', name: '内部数据', desc: '泄露后造成一般影响，仅限内部使用' },
    { level: 'L3', name: '敏感数据', desc: '泄露后损害个人 / 企业合法权益' },
    { level: 'L4', name: '核心数据', desc: '泄露后危害国家安全、公共利益' },
];
const categoryPool = ['个人信息', '经营数据', '政务民生', '技术运维', '交通运行', '财务核算'];
const domainPool = ['客运票务', '旅客服务', '基础设施', '设备运维', '运营调度', '财务共享'];
const regulationPool = ['《数据安全法》', '《个人信息保护法》', '《网络安全法》', '《数据出境安全评估办法》', '《关基安全保护条例》'];
const ownerPool = ['张工', '李工', '王工', '赵工'];
const sensitivePool = ['身份证号', '手机号', '姓名', '家庭住址', '购票记录', '支付账户', '设备编号', 'GPS 轨迹', '员工号', '居住地址'];
const classifiedAssets = ref([
    { id: 'cls-01', name: 'ticket_sale_detail', domain: '客运票务', dataType: '结构化表', category: '个人信息', level: 'L3', sensitive: ['身份证号', '姓名', '购票记录'], regulation: '《个人信息保护法》', owner: '李工', updateTime: '2026-08-05' },
    { id: 'cls-02', name: 'passenger_info', domain: '旅客服务', dataType: '结构化表', category: '个人信息', level: 'L3', sensitive: ['身份证号', '手机号', '家庭住址'], regulation: '《个人信息保护法》', owner: '李工', updateTime: '2026-08-05' },
    { id: 'cls-03', name: 'payment_record', domain: '财务共享', dataType: '结构化表', category: '经营数据', level: 'L4', sensitive: ['支付账户', '金额'], regulation: '《数据安全法》', owner: '赵工', updateTime: '2026-07-28' },
    { id: 'cls-04', name: 'flow_stat_daily', domain: '运营调度', dataType: '结构化表', category: '交通运行', level: 'L2', sensitive: ['客流统计'], regulation: '《数据安全法》', owner: '王工', updateTime: '2026-07-22' },
    { id: 'cls-05', name: 'device_status_log', domain: '设备运维', dataType: '结构化表', category: '技术运维', level: 'L2', sensitive: ['设备编号'], regulation: '《网络安全法》', owner: '王工', updateTime: '2026-07-15' },
    { id: 'cls-06', name: 'ticket_sale', domain: '客运票务', dataType: '结构化表', category: '个人信息', level: 'L3', sensitive: ['购票记录', '手机号'], regulation: '《个人信息保护法》', owner: '李工', updateTime: '2026-07-10' },
    { id: 'cls-07', name: 'line_info', domain: '基础设施', dataType: '结构化表', category: '交通运行', level: 'L1', sensitive: [], regulation: '《数据安全法》', owner: '张工', updateTime: '2026-06-30' },
    { id: 'cls-08', name: 'station_video_upload', domain: '旅客服务', dataType: '非结构化文档', category: '个人信息', level: 'L3', sensitive: ['人脸图像', 'GPS 轨迹'], regulation: '《个人信息保护法》', owner: '李工', updateTime: '2026-06-20' },
]);
const classifyKeyword = ref('');
const classifyLevel = ref('');
const classifyCategory = ref('');
const filteredAssets = computed(() => classifiedAssets.value.filter((a) => {
    if (classifyLevel.value && a.level !== classifyLevel.value)
        return false;
    if (classifyCategory.value && a.category !== classifyCategory.value)
        return false;
    if (!classifyKeyword.value)
        return true;
    const kw = classifyKeyword.value.toLowerCase();
    return a.name.toLowerCase().includes(kw) || a.owner.toLowerCase().includes(kw) || a.domain.toLowerCase().includes(kw);
}));
const classifyStats = computed(() => [
    { label: '数据资产总数', value: `${classifiedAssets.value.length} 项`, color: '#4A4A4A' },
    { label: 'L1 一般数据', value: classifiedAssets.value.filter((a) => a.level === 'L1').length, color: '#8c8c8c' },
    { label: 'L2 内部数据', value: classifiedAssets.value.filter((a) => a.level === 'L2').length, color: '#2B6CB0' },
    { label: 'L3 敏感数据', value: classifiedAssets.value.filter((a) => a.level === 'L3').length, color: '#ED7B2F' },
    { label: 'L4 核心数据', value: classifiedAssets.value.filter((a) => a.level === 'L4').length, color: '#DA251D' },
]);
const classifyDrawerVisible = ref(false);
const editingClassify = ref(false);
const classifyForm = reactive({
    id: '',
    name: '',
    domain: '客运票务',
    dataType: '结构化表',
    category: '个人信息',
    level: 'L2',
    sensitive: [],
    regulation: '《数据安全法》',
    owner: '张工',
    remark: '',
});
const openClassifyDrawer = () => {
    editingClassify.value = false;
    Object.assign(classifyForm, {
        id: '',
        name: '',
        domain: '客运票务',
        dataType: '结构化表',
        category: '个人信息',
        level: 'L2',
        sensitive: [],
        regulation: '《数据安全法》',
        owner: '张工',
        remark: '',
    });
    classifyDrawerVisible.value = true;
};
const adjustLevel = (row) => {
    editingClassify.value = true;
    Object.assign(classifyForm, {
        id: row.id,
        name: row.name,
        domain: row.domain,
        dataType: row.dataType,
        category: row.category,
        level: row.level,
        sensitive: row.sensitive,
        regulation: row.regulation,
        owner: row.owner,
        remark: '',
    });
    classifyDrawerVisible.value = true;
};
const saveClassify = () => {
    if (!classifyForm.name.trim()) {
        ElMessage.warning('请输入数据资产名称');
        return;
    }
    if (editingClassify.value) {
        const idx = classifiedAssets.value.findIndex((a) => a.id === classifyForm.id);
        if (idx >= 0) {
            classifiedAssets.value[idx] = { ...classifiedAssets.value[idx], ...classifyForm, level: classifyForm.level, updateTime: new Date().toLocaleDateString('sv-SE') };
        }
        ElMessage.success(`「${classifyForm.name}」分级已调整为 ${classifyForm.level}（Mock）`);
    }
    else {
        classifiedAssets.value.unshift({
            id: `cls-mock-${Date.now()}`,
            name: classifyForm.name,
            domain: classifyForm.domain,
            dataType: classifyForm.dataType,
            category: classifyForm.category,
            level: classifyForm.level,
            sensitive: classifyForm.sensitive,
            regulation: classifyForm.regulation,
            owner: classifyForm.owner,
            updateTime: new Date().toLocaleDateString('sv-SE'),
        });
        ElMessage.success(`数据资产「${classifyForm.name}」定级完成（Mock）`);
    }
    classifyDrawerVisible.value = false;
};
const exportClassify = () => ElMessage.success('分级清单已导出为 Excel，含敏感字段与法规依据（Mock）');
const assetDetail = (row) => ElMessage.info(`「${row.name}」：${row.category}/${row.level}，依据 ${row.regulation}，敏感字段 ${row.sensitive.join('、') || '无'}（Mock）`);
/* ==================== 合规检查 ==================== */
const keyword = ref('');
const filterStatus = ref('');
const filterRisk = ref('');
const currentPage = ref(1);
const pageSize = 20;
const riskVisible = ref(false);
const items = ref([...mockComplianceItems]);
const levelColor = {
    高: '#E34D59',
    中: '#ED7B2F',
    低: '#2B6CB0',
};
const complianceStatusTag = {
    合规: 'success',
    不合规: 'danger',
    待整改: 'warning',
};
const checkStats = computed(() => {
    const total = items.value.length;
    const pass = items.value.filter((i) => i.status === '合规').length;
    const fail = items.value.filter((i) => i.status === '不合规').length;
    const pend = items.value.filter((i) => i.status === '待整改').length;
    const high = items.value.filter((i) => i.riskLevel === '高').length;
    const rate = total ? Math.round((pass / total) * 1000) / 10 : 0;
    return [
        { label: '合规率', value: `${rate}%`, color: rate >= 90 ? '#00A854' : '#ED7B2F' },
        { label: '检查项', value: `${total} 项`, color: '#4A4A4A' },
        { label: '不合规', value: `${fail} 项`, color: '#DA251D' },
        { label: '待整改', value: `${pend} 项`, color: '#ED7B2F' },
        { label: '高风险', value: `${high} 项`, color: '#E34D59' },
    ];
});
const riskList = [
    { id: 'RISK-2026-01', title: '重要数据未配置密钥自动轮换', stage: '验证中', stageTag: 'primary', activeStep: 3, updateTime: '2026-08-12 09:30', owner: '张工' },
    { id: 'RISK-2026-02', title: '个人信息导出流程缺少审批留痕', stage: '整改中', stageTag: 'warning', activeStep: 2, updateTime: '2026-08-11 16:20', owner: '李工' },
    { id: 'RISK-2026-03', title: '数据出境场景未完成安全评估', stage: '工单中', stageTag: 'info', activeStep: 1, updateTime: '2026-08-10 11:00', owner: '王工' },
];
const checkRecords = [
    { time: '2026-08-12 10:00', result: '通过', scope: '全部业务模块自动巡检', executor: '系统自动巡检', summary: '52 项检查 / 48 项合规' },
    { time: '2026-07-12 10:00', result: '通过', scope: '全部业务模块自动巡检', executor: '系统自动巡检', summary: '52 项检查 / 47 项合规' },
    { time: '2026-06-30 15:20', result: '警告', scope: '出口结算专项人工核查', executor: '安全管理员：张工', summary: '发现数据出境未评估风险' },
];
const currentRisk = ref(null);
const filteredItems = computed(() => items.value.filter((item) => {
    if (filterStatus.value && item.status !== filterStatus.value)
        return false;
    if (filterRisk.value && item.riskLevel !== filterRisk.value)
        return false;
    if (!keyword.value)
        return true;
    const kw = keyword.value.toLowerCase();
    return (item.regulation.toLowerCase().includes(kw) ||
        item.clause.toLowerCase().includes(kw) ||
        item.mappedFeature.toLowerCase().includes(kw));
}));
const pagedItems = computed(() => {
    const start = (currentPage.value - 1) * pageSize;
    return filteredItems.value.slice(start, start + pageSize);
});
const changePage = (page) => (currentPage.value = page);
watch([keyword, filterStatus, filterRisk], () => {
    currentPage.value = 1;
});
const autoCheck = () => {
    ElMessage.success('自动检查完成：52 项检查中 48 项合规（Mock）');
};
const jumpToReport = () => {
    ElMessage.success('检查数据已汇总，请在「合规报告」页签生成报告');
    activeTab.value = 'report';
};
const openRisk = (row) => {
    currentRisk.value = row;
    riskVisible.value = true;
};
const closeRisk = () => {
    riskVisible.value = false;
    ElMessage.success('风险已通过复验，流程关闭（Mock）');
};
const exportRiskEvidence = () => {
    ElMessage.success('审计证据包已导出归档（Mock）');
};
const viewEvidence = (row) => {
    ElMessage.info(`查看「${row.regulation} ${row.clause}」检查证据（Mock）`);
};
const reports = ref([
    { id: 'REP-2026Q2', name: '2026 年第二季度数据安全合规检查报告', type: '季度', period: '2026-04-01 ~ 2026-06-30', regulationCount: 4, checkCount: 52, passRate: 92.3, conclusion: '基本合规', createTime: '2026-07-05', creator: '系统生成' },
    { id: 'REP-2025YR', name: '2025 年度数据安全合规评估报告', type: '年度', period: '2025-01-01 ~ 2025-12-31', regulationCount: 5, checkCount: 52, passRate: 94.2, conclusion: '合规', createTime: '2026-01-15', creator: '系统生成' },
    { id: 'REP-2026P1', name: '数据出境安全评估专项报告', type: '专项', period: '2026-05-01 ~ 2026-05-31', regulationCount: 2, checkCount: 8, passRate: 75.0, conclusion: '存在风险', createTime: '2026-06-02', creator: '张工' },
    { id: 'REP-2026P2', name: '个人信息保护专项自查报告', type: '专项', period: '2026-06-01 ~ 2026-06-30', regulationCount: 3, checkCount: 24, passRate: 87.5, conclusion: '基本合规', createTime: '2026-07-10', creator: '李工' },
    { id: 'REP-2026Q1', name: '2026 年第一季度数据安全合规检查报告', type: '季度', period: '2026-01-01 ~ 2026-03-31', regulationCount: 4, checkCount: 52, passRate: 94.2, conclusion: '合规', createTime: '2026-04-08', creator: '系统生成' },
]);
const reportKeyword = ref('');
const reportTypeFilter = ref('');
const reportConclusionFilter = ref('');
const reportTypeTag = {
    年度: 'success',
    季度: 'primary',
    专项: 'warning',
};
const reportConclusionTag = {
    合规: 'success',
    基本合规: 'warning',
    存在风险: 'danger',
};
const filteredReports = computed(() => reports.value.filter((r) => {
    if (reportTypeFilter.value && r.type !== reportTypeFilter.value)
        return false;
    if (reportConclusionFilter.value && r.conclusion !== reportConclusionFilter.value)
        return false;
    if (!reportKeyword.value)
        return true;
    const kw = reportKeyword.value.toLowerCase();
    return r.name.toLowerCase().includes(kw) || r.id.toLowerCase().includes(kw);
}));
const avgPassRate = computed(() => reports.value.length ? Math.round((reports.value.reduce((s, r) => s + r.passRate, 0) / reports.value.length) * 10) / 10 : 0);
const reportStats = computed(() => [
    { label: '报告总数', value: `${reports.value.length} 份`, color: '#4A4A4A' },
    { label: '平均合规率', value: `${avgPassRate.value}%`, color: avgPassRate.value >= 90 ? '#00A854' : '#ED7B2F' },
    { label: '年度报告', value: reports.value.filter((r) => r.type === '年度').length, color: '#2B6CB0' },
    { label: '季度报告', value: reports.value.filter((r) => r.type === '季度').length, color: '#00A854' },
    { label: '专项报告', value: reports.value.filter((r) => r.type === '专项').length, color: '#ED7B2F' },
]);
const reportDrawerVisible = ref(false);
const reportForm = reactive({
    name: '',
    type: '季度',
    period: [],
    regulations: [],
    owner: '系统生成',
    remark: '',
});
const openReportDrawer = () => {
    Object.assign(reportForm, { name: '', type: '季度', period: [], regulations: [regulationPool[0], regulationPool[1]], owner: '系统生成', remark: '' });
    reportDrawerVisible.value = true;
};
const saveReport = () => {
    if (!reportForm.name.trim()) {
        ElMessage.warning('请输入报告名称');
        return;
    }
    if (!reportForm.period.length) {
        ElMessage.warning('请选择统计周期');
        return;
    }
    const pass = 85 + Math.round(Math.random() * 12);
    reports.value.unshift({
        id: `REP-${Date.now().toString().slice(-8)}`,
        name: reportForm.name,
        type: reportForm.type,
        period: `${reportForm.period[0]} ~ ${reportForm.period[1]}`,
        regulationCount: reportForm.regulations.length || regulationPool.length,
        checkCount: 52,
        passRate: pass,
        conclusion: pass >= 90 ? '合规' : pass >= 80 ? '基本合规' : '存在风险',
        createTime: new Date().toLocaleDateString('sv-SE'),
        creator: reportForm.owner,
    });
    reportDrawerVisible.value = false;
    ElMessage.success('合规报告已生成（Mock）');
};
const reportDetail = (row) => ElMessage.info(`报告「${row.name}」：覆盖 ${row.regulationCount} 部法规、${row.checkCount} 项检查，合规率 ${row.passRate}%（Mock）`);
const downloadReport = (row) => ElMessage.success(`「${row.name}」已导出为 PDF（Mock）`);
const regenerateReport = (row) => ElMessage.success(`「${row.name}」已基于最新检查结果重新生成（Mock）`);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['gm-head']} */ ;
/** @type {__VLS_StyleScopedClasses['gm-object']} */ ;
/** @type {__VLS_StyleScopedClasses['gm-cell']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "standard-page compliance-page" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "compliance-tabs-wrap" },
});
const __VLS_0 = {}.ElTabs;
/** @type {[typeof __VLS_components.ElTabs, typeof __VLS_components.elTabs, typeof __VLS_components.ElTabs, typeof __VLS_components.elTabs, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    modelValue: (__VLS_ctx.activeTab),
    type: "border-card",
    stretch: true,
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.activeTab),
    type: "border-card",
    stretch: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
const __VLS_4 = {}.ElTabPane;
/** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    label: "数据分类分级",
    name: "classify",
}));
const __VLS_6 = __VLS_5({
    label: "数据分类分级",
    name: "classify",
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
__VLS_7.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "classify-pane" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "compliance-stats" },
});
for (const [s] of __VLS_getVForSourceType((__VLS_ctx.classifyStats))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (s.label),
        ...{ class: "compliance-stat" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "compliance-stat-value" },
        ...{ style: ({ color: s.color }) },
    });
    (s.value);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "compliance-stat-label" },
    });
    (s.label);
}
const __VLS_8 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    gutter: (16),
    ...{ class: "compliance-rows" },
}));
const __VLS_10 = __VLS_9({
    gutter: (16),
    ...{ class: "compliance-rows" },
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
__VLS_11.slots.default;
const __VLS_12 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
    span: (7),
}));
const __VLS_14 = __VLS_13({
    span: (7),
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
__VLS_15.slots.default;
const __VLS_16 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    ...{ class: "compliance-card" },
    shadow: "never",
}));
const __VLS_18 = __VLS_17({
    ...{ class: "compliance-card" },
    shadow: "never",
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
__VLS_19.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_19.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "block-title dep-text" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "grade-matrix" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gm-head gm-object" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gm-head" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gm-head" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gm-head" },
});
for (const [row] of __VLS_getVForSourceType((__VLS_ctx.gradeMatrix))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (row.object),
        ...{ class: "gm-row" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "gm-object" },
    });
    (row.object);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "gm-cell" },
        ...{ class: (`level-${row.low}`) },
    });
    (row.low);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "gm-cell" },
        ...{ class: (`level-${row.mid}`) },
    });
    (row.mid);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "gm-cell" },
        ...{ class: (`level-${row.high}`) },
    });
    (row.high);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "block-title" },
});
for (const [d] of __VLS_getVForSourceType((__VLS_ctx.gradeDefine))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (d.level),
        ...{ class: "grade-item" },
    });
    const __VLS_20 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
        size: "small",
        type: (__VLS_ctx.gradeTagType[d.level]),
        effect: "dark",
    }));
    const __VLS_22 = __VLS_21({
        size: "small",
        type: (__VLS_ctx.gradeTagType[d.level]),
        effect: "dark",
    }, ...__VLS_functionalComponentArgsRest(__VLS_21));
    __VLS_23.slots.default;
    (d.level);
    var __VLS_23;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "grade-name" },
    });
    (d.name);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "dep-text" },
    });
    (d.desc);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "block-title" },
});
(__VLS_ctx.categoryPool.length);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "category-tags" },
});
for (const [c] of __VLS_getVForSourceType((__VLS_ctx.categoryPool))) {
    const __VLS_24 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
        key: (c),
        size: "small",
        effect: "plain",
        type: "info",
    }));
    const __VLS_26 = __VLS_25({
        key: (c),
        size: "small",
        effect: "plain",
        type: "info",
    }, ...__VLS_functionalComponentArgsRest(__VLS_25));
    __VLS_27.slots.default;
    (c);
    var __VLS_27;
}
var __VLS_19;
var __VLS_15;
const __VLS_28 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
    span: (17),
}));
const __VLS_30 = __VLS_29({
    span: (17),
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
__VLS_31.slots.default;
const __VLS_32 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
    ...{ class: "compliance-card" },
    shadow: "never",
}));
const __VLS_34 = __VLS_33({
    ...{ class: "compliance-card" },
    shadow: "never",
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
__VLS_35.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_35.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.classifiedAssets.length);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-actions" },
    });
    const __VLS_36 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
        ...{ 'onClick': {} },
        type: "danger",
        size: "small",
        icon: (__VLS_ctx.Plus),
    }));
    const __VLS_38 = __VLS_37({
        ...{ 'onClick': {} },
        type: "danger",
        size: "small",
        icon: (__VLS_ctx.Plus),
    }, ...__VLS_functionalComponentArgsRest(__VLS_37));
    let __VLS_40;
    let __VLS_41;
    let __VLS_42;
    const __VLS_43 = {
        onClick: (__VLS_ctx.openClassifyDrawer)
    };
    __VLS_39.slots.default;
    var __VLS_39;
    const __VLS_44 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
        ...{ 'onClick': {} },
        size: "small",
        icon: (__VLS_ctx.Download),
    }));
    const __VLS_46 = __VLS_45({
        ...{ 'onClick': {} },
        size: "small",
        icon: (__VLS_ctx.Download),
    }, ...__VLS_functionalComponentArgsRest(__VLS_45));
    let __VLS_48;
    let __VLS_49;
    let __VLS_50;
    const __VLS_51 = {
        onClick: (__VLS_ctx.exportClassify)
    };
    __VLS_47.slots.default;
    var __VLS_47;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "toolbar-row" },
});
const __VLS_52 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
    modelValue: (__VLS_ctx.classifyKeyword),
    placeholder: "按资产名称 / 责任人搜索",
    clearable: true,
    ...{ class: "search-input" },
    prefixIcon: (__VLS_ctx.Search),
}));
const __VLS_54 = __VLS_53({
    modelValue: (__VLS_ctx.classifyKeyword),
    placeholder: "按资产名称 / 责任人搜索",
    clearable: true,
    ...{ class: "search-input" },
    prefixIcon: (__VLS_ctx.Search),
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
const __VLS_56 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
    modelValue: (__VLS_ctx.classifyLevel),
    placeholder: "分级",
    clearable: true,
    ...{ class: "filter-select" },
}));
const __VLS_58 = __VLS_57({
    modelValue: (__VLS_ctx.classifyLevel),
    placeholder: "分级",
    clearable: true,
    ...{ class: "filter-select" },
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
__VLS_59.slots.default;
for (const [l] of __VLS_getVForSourceType((['L1', 'L2', 'L3', 'L4']))) {
    const __VLS_60 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
        key: (l),
        label: (l),
        value: (l),
    }));
    const __VLS_62 = __VLS_61({
        key: (l),
        label: (l),
        value: (l),
    }, ...__VLS_functionalComponentArgsRest(__VLS_61));
}
var __VLS_59;
const __VLS_64 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
    modelValue: (__VLS_ctx.classifyCategory),
    placeholder: "分类",
    clearable: true,
    ...{ class: "filter-select" },
}));
const __VLS_66 = __VLS_65({
    modelValue: (__VLS_ctx.classifyCategory),
    placeholder: "分类",
    clearable: true,
    ...{ class: "filter-select" },
}, ...__VLS_functionalComponentArgsRest(__VLS_65));
__VLS_67.slots.default;
for (const [c] of __VLS_getVForSourceType((__VLS_ctx.categoryPool))) {
    const __VLS_68 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
        key: (c),
        label: (c),
        value: (c),
    }));
    const __VLS_70 = __VLS_69({
        key: (c),
        label: (c),
        value: (c),
    }, ...__VLS_functionalComponentArgsRest(__VLS_69));
}
var __VLS_67;
const __VLS_72 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
    data: (__VLS_ctx.filteredAssets),
    stripe: true,
}));
const __VLS_74 = __VLS_73({
    data: (__VLS_ctx.filteredAssets),
    stripe: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_73));
__VLS_75.slots.default;
const __VLS_76 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
    prop: "name",
    label: "数据资产名称",
    minWidth: "150",
}));
const __VLS_78 = __VLS_77({
    prop: "name",
    label: "数据资产名称",
    minWidth: "150",
}, ...__VLS_functionalComponentArgsRest(__VLS_77));
__VLS_79.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_79.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "asset-name" },
    });
    (row.name);
}
var __VLS_79;
const __VLS_80 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
    prop: "domain",
    label: "所属业务域",
    width: "100",
}));
const __VLS_82 = __VLS_81({
    prop: "domain",
    label: "所属业务域",
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_81));
const __VLS_84 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
    prop: "category",
    label: "数据分类",
    width: "100",
}));
const __VLS_86 = __VLS_85({
    prop: "category",
    label: "数据分类",
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_85));
const __VLS_88 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
    label: "数据分级",
    width: "76",
    align: "center",
}));
const __VLS_90 = __VLS_89({
    label: "数据分级",
    width: "76",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_89));
__VLS_91.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_91.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_92 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
        size: "small",
        type: (__VLS_ctx.gradeTagType[row.level]),
        effect: "dark",
    }));
    const __VLS_94 = __VLS_93({
        size: "small",
        type: (__VLS_ctx.gradeTagType[row.level]),
        effect: "dark",
    }, ...__VLS_functionalComponentArgsRest(__VLS_93));
    __VLS_95.slots.default;
    (row.level);
    var __VLS_95;
}
var __VLS_91;
const __VLS_96 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
    label: "敏感字段",
    minWidth: "180",
}));
const __VLS_98 = __VLS_97({
    label: "敏感字段",
    minWidth: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_97));
__VLS_99.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_99.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    for (const [s] of __VLS_getVForSourceType((row.sensitive))) {
        const __VLS_100 = {}.ElTag;
        /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
        // @ts-ignore
        const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
            key: (s),
            size: "small",
            type: "danger",
            effect: "plain",
            ...{ class: "mr-4" },
        }));
        const __VLS_102 = __VLS_101({
            key: (s),
            size: "small",
            type: "danger",
            effect: "plain",
            ...{ class: "mr-4" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_101));
        __VLS_103.slots.default;
        (s);
        var __VLS_103;
    }
}
var __VLS_99;
const __VLS_104 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
    prop: "regulation",
    label: "依据法规",
    width: "150",
}));
const __VLS_106 = __VLS_105({
    prop: "regulation",
    label: "依据法规",
    width: "150",
}, ...__VLS_functionalComponentArgsRest(__VLS_105));
const __VLS_108 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
    prop: "owner",
    label: "定级责任人",
    width: "92",
}));
const __VLS_110 = __VLS_109({
    prop: "owner",
    label: "定级责任人",
    width: "92",
}, ...__VLS_functionalComponentArgsRest(__VLS_109));
const __VLS_112 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
    prop: "updateTime",
    label: "更新时间",
    width: "96",
}));
const __VLS_114 = __VLS_113({
    prop: "updateTime",
    label: "更新时间",
    width: "96",
}, ...__VLS_functionalComponentArgsRest(__VLS_113));
const __VLS_116 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
    label: "操作",
    width: "128",
    fixed: "right",
    align: "center",
}));
const __VLS_118 = __VLS_117({
    label: "操作",
    width: "128",
    fixed: "right",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_117));
__VLS_119.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_119.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_120 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
        size: "small",
    }));
    const __VLS_122 = __VLS_121({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_121));
    let __VLS_124;
    let __VLS_125;
    let __VLS_126;
    const __VLS_127 = {
        onClick: (...[$event]) => {
            __VLS_ctx.adjustLevel(row);
        }
    };
    __VLS_123.slots.default;
    var __VLS_123;
    const __VLS_128 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({
        ...{ 'onClick': {} },
        link: true,
        type: "info",
        size: "small",
    }));
    const __VLS_130 = __VLS_129({
        ...{ 'onClick': {} },
        link: true,
        type: "info",
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_129));
    let __VLS_132;
    let __VLS_133;
    let __VLS_134;
    const __VLS_135 = {
        onClick: (...[$event]) => {
            __VLS_ctx.assetDetail(row);
        }
    };
    __VLS_131.slots.default;
    var __VLS_131;
}
var __VLS_119;
var __VLS_75;
var __VLS_35;
var __VLS_31;
var __VLS_11;
var __VLS_7;
const __VLS_136 = {}.ElTabPane;
/** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
// @ts-ignore
const __VLS_137 = __VLS_asFunctionalComponent(__VLS_136, new __VLS_136({
    label: "合规检查",
    name: "check",
}));
const __VLS_138 = __VLS_137({
    label: "合规检查",
    name: "check",
}, ...__VLS_functionalComponentArgsRest(__VLS_137));
__VLS_139.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "check-pane" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "compliance-stats" },
});
for (const [s] of __VLS_getVForSourceType((__VLS_ctx.checkStats))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (s.label),
        ...{ class: "compliance-stat" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "compliance-stat-value" },
        ...{ style: ({ color: s.color }) },
    });
    (s.value);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "compliance-stat-label" },
    });
    (s.label);
}
const __VLS_140 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
// @ts-ignore
const __VLS_141 = __VLS_asFunctionalComponent(__VLS_140, new __VLS_140({
    gutter: (16),
    ...{ class: "compliance-rows" },
}));
const __VLS_142 = __VLS_141({
    gutter: (16),
    ...{ class: "compliance-rows" },
}, ...__VLS_functionalComponentArgsRest(__VLS_141));
__VLS_143.slots.default;
const __VLS_144 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_145 = __VLS_asFunctionalComponent(__VLS_144, new __VLS_144({
    span: (16),
}));
const __VLS_146 = __VLS_145({
    span: (16),
}, ...__VLS_functionalComponentArgsRest(__VLS_145));
__VLS_147.slots.default;
const __VLS_148 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_149 = __VLS_asFunctionalComponent(__VLS_148, new __VLS_148({
    ...{ class: "compliance-card" },
    shadow: "never",
}));
const __VLS_150 = __VLS_149({
    ...{ class: "compliance-card" },
    shadow: "never",
}, ...__VLS_functionalComponentArgsRest(__VLS_149));
__VLS_151.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_151.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-actions" },
    });
    const __VLS_152 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_153 = __VLS_asFunctionalComponent(__VLS_152, new __VLS_152({
        ...{ 'onClick': {} },
        type: "primary",
        plain: true,
        size: "small",
    }));
    const __VLS_154 = __VLS_153({
        ...{ 'onClick': {} },
        type: "primary",
        plain: true,
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_153));
    let __VLS_156;
    let __VLS_157;
    let __VLS_158;
    const __VLS_159 = {
        onClick: (__VLS_ctx.autoCheck)
    };
    __VLS_155.slots.default;
    var __VLS_155;
    const __VLS_160 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_161 = __VLS_asFunctionalComponent(__VLS_160, new __VLS_160({
        ...{ 'onClick': {} },
        type: "danger",
        icon: (__VLS_ctx.DocumentCopy),
        size: "small",
    }));
    const __VLS_162 = __VLS_161({
        ...{ 'onClick': {} },
        type: "danger",
        icon: (__VLS_ctx.DocumentCopy),
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_161));
    let __VLS_164;
    let __VLS_165;
    let __VLS_166;
    const __VLS_167 = {
        onClick: (__VLS_ctx.jumpToReport)
    };
    __VLS_163.slots.default;
    var __VLS_163;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "toolbar-row" },
});
const __VLS_168 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_169 = __VLS_asFunctionalComponent(__VLS_168, new __VLS_168({
    modelValue: (__VLS_ctx.keyword),
    placeholder: "按法规 / 条款 / 映射功能搜索",
    clearable: true,
    ...{ class: "search-input" },
    prefixIcon: (__VLS_ctx.Search),
}));
const __VLS_170 = __VLS_169({
    modelValue: (__VLS_ctx.keyword),
    placeholder: "按法规 / 条款 / 映射功能搜索",
    clearable: true,
    ...{ class: "search-input" },
    prefixIcon: (__VLS_ctx.Search),
}, ...__VLS_functionalComponentArgsRest(__VLS_169));
const __VLS_172 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_173 = __VLS_asFunctionalComponent(__VLS_172, new __VLS_172({
    modelValue: (__VLS_ctx.filterStatus),
    placeholder: "状态",
    clearable: true,
    ...{ class: "filter-select" },
}));
const __VLS_174 = __VLS_173({
    modelValue: (__VLS_ctx.filterStatus),
    placeholder: "状态",
    clearable: true,
    ...{ class: "filter-select" },
}, ...__VLS_functionalComponentArgsRest(__VLS_173));
__VLS_175.slots.default;
const __VLS_176 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_177 = __VLS_asFunctionalComponent(__VLS_176, new __VLS_176({
    label: "合规",
    value: "合规",
}));
const __VLS_178 = __VLS_177({
    label: "合规",
    value: "合规",
}, ...__VLS_functionalComponentArgsRest(__VLS_177));
const __VLS_180 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_181 = __VLS_asFunctionalComponent(__VLS_180, new __VLS_180({
    label: "不合规",
    value: "不合规",
}));
const __VLS_182 = __VLS_181({
    label: "不合规",
    value: "不合规",
}, ...__VLS_functionalComponentArgsRest(__VLS_181));
const __VLS_184 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_185 = __VLS_asFunctionalComponent(__VLS_184, new __VLS_184({
    label: "待整改",
    value: "待整改",
}));
const __VLS_186 = __VLS_185({
    label: "待整改",
    value: "待整改",
}, ...__VLS_functionalComponentArgsRest(__VLS_185));
var __VLS_175;
const __VLS_188 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_189 = __VLS_asFunctionalComponent(__VLS_188, new __VLS_188({
    modelValue: (__VLS_ctx.filterRisk),
    placeholder: "风险等级",
    clearable: true,
    ...{ class: "filter-select" },
}));
const __VLS_190 = __VLS_189({
    modelValue: (__VLS_ctx.filterRisk),
    placeholder: "风险等级",
    clearable: true,
    ...{ class: "filter-select" },
}, ...__VLS_functionalComponentArgsRest(__VLS_189));
__VLS_191.slots.default;
const __VLS_192 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_193 = __VLS_asFunctionalComponent(__VLS_192, new __VLS_192({
    label: "高",
    value: "高",
}));
const __VLS_194 = __VLS_193({
    label: "高",
    value: "高",
}, ...__VLS_functionalComponentArgsRest(__VLS_193));
const __VLS_196 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_197 = __VLS_asFunctionalComponent(__VLS_196, new __VLS_196({
    label: "中",
    value: "中",
}));
const __VLS_198 = __VLS_197({
    label: "中",
    value: "中",
}, ...__VLS_functionalComponentArgsRest(__VLS_197));
const __VLS_200 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_201 = __VLS_asFunctionalComponent(__VLS_200, new __VLS_200({
    label: "低",
    value: "低",
}));
const __VLS_202 = __VLS_201({
    label: "低",
    value: "低",
}, ...__VLS_functionalComponentArgsRest(__VLS_201));
var __VLS_191;
const __VLS_204 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_205 = __VLS_asFunctionalComponent(__VLS_204, new __VLS_204({
    data: (__VLS_ctx.pagedItems),
    stripe: true,
}));
const __VLS_206 = __VLS_205({
    data: (__VLS_ctx.pagedItems),
    stripe: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_205));
__VLS_207.slots.default;
const __VLS_208 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_209 = __VLS_asFunctionalComponent(__VLS_208, new __VLS_208({
    prop: "regulation",
    label: "法规",
    width: "160",
}));
const __VLS_210 = __VLS_209({
    prop: "regulation",
    label: "法规",
    width: "160",
}, ...__VLS_functionalComponentArgsRest(__VLS_209));
const __VLS_212 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_213 = __VLS_asFunctionalComponent(__VLS_212, new __VLS_212({
    prop: "clause",
    label: "条款",
    width: "128",
}));
const __VLS_214 = __VLS_213({
    prop: "clause",
    label: "条款",
    width: "128",
}, ...__VLS_functionalComponentArgsRest(__VLS_213));
const __VLS_216 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_217 = __VLS_asFunctionalComponent(__VLS_216, new __VLS_216({
    prop: "requirement",
    label: "要求说明",
    minWidth: "190",
    showOverflowTooltip: true,
}));
const __VLS_218 = __VLS_217({
    prop: "requirement",
    label: "要求说明",
    minWidth: "190",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_217));
const __VLS_220 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_221 = __VLS_asFunctionalComponent(__VLS_220, new __VLS_220({
    prop: "mappedFeature",
    label: "映射系统功能",
    width: "132",
}));
const __VLS_222 = __VLS_221({
    prop: "mappedFeature",
    label: "映射系统功能",
    width: "132",
}, ...__VLS_functionalComponentArgsRest(__VLS_221));
const __VLS_224 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_225 = __VLS_asFunctionalComponent(__VLS_224, new __VLS_224({
    label: "状态",
    width: "84",
}));
const __VLS_226 = __VLS_225({
    label: "状态",
    width: "84",
}, ...__VLS_functionalComponentArgsRest(__VLS_225));
__VLS_227.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_227.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_228 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_229 = __VLS_asFunctionalComponent(__VLS_228, new __VLS_228({
        type: (__VLS_ctx.complianceStatusTag[row.status]),
        effect: "dark",
    }));
    const __VLS_230 = __VLS_229({
        type: (__VLS_ctx.complianceStatusTag[row.status]),
        effect: "dark",
    }, ...__VLS_functionalComponentArgsRest(__VLS_229));
    __VLS_231.slots.default;
    (row.status);
    var __VLS_231;
}
var __VLS_227;
const __VLS_232 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_233 = __VLS_asFunctionalComponent(__VLS_232, new __VLS_232({
    label: "风险",
    width: "78",
}));
const __VLS_234 = __VLS_233({
    label: "风险",
    width: "78",
}, ...__VLS_functionalComponentArgsRest(__VLS_233));
__VLS_235.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_235.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "security-level" },
        ...{ style: ({ background: __VLS_ctx.levelColor[row.riskLevel] }) },
    });
    (row.riskLevel);
}
var __VLS_235;
const __VLS_236 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_237 = __VLS_asFunctionalComponent(__VLS_236, new __VLS_236({
    label: "操作",
    width: "132",
    fixed: "right",
}));
const __VLS_238 = __VLS_237({
    label: "操作",
    width: "132",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_237));
__VLS_239.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_239.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    if (row.riskId) {
        const __VLS_240 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_241 = __VLS_asFunctionalComponent(__VLS_240, new __VLS_240({
            ...{ 'onClick': {} },
            link: true,
            type: "warning",
            size: "small",
        }));
        const __VLS_242 = __VLS_241({
            ...{ 'onClick': {} },
            link: true,
            type: "warning",
            size: "small",
        }, ...__VLS_functionalComponentArgsRest(__VLS_241));
        let __VLS_244;
        let __VLS_245;
        let __VLS_246;
        const __VLS_247 = {
            onClick: (...[$event]) => {
                if (!(row.riskId))
                    return;
                __VLS_ctx.openRisk(row);
            }
        };
        __VLS_243.slots.default;
        var __VLS_243;
    }
    const __VLS_248 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_249 = __VLS_asFunctionalComponent(__VLS_248, new __VLS_248({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
        size: "small",
    }));
    const __VLS_250 = __VLS_249({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_249));
    let __VLS_252;
    let __VLS_253;
    let __VLS_254;
    const __VLS_255 = {
        onClick: (...[$event]) => {
            __VLS_ctx.viewEvidence(row);
        }
    };
    __VLS_251.slots.default;
    var __VLS_251;
}
var __VLS_239;
var __VLS_207;
const __VLS_256 = {}.ElPagination;
/** @type {[typeof __VLS_components.ElPagination, typeof __VLS_components.elPagination, ]} */ ;
// @ts-ignore
const __VLS_257 = __VLS_asFunctionalComponent(__VLS_256, new __VLS_256({
    ...{ 'onCurrentChange': {} },
    ...{ class: "pager" },
    layout: "total, prev, pager, next",
    total: (__VLS_ctx.filteredItems.length),
    pageSize: (__VLS_ctx.pageSize),
    currentPage: (__VLS_ctx.currentPage),
    background: true,
}));
const __VLS_258 = __VLS_257({
    ...{ 'onCurrentChange': {} },
    ...{ class: "pager" },
    layout: "total, prev, pager, next",
    total: (__VLS_ctx.filteredItems.length),
    pageSize: (__VLS_ctx.pageSize),
    currentPage: (__VLS_ctx.currentPage),
    background: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_257));
let __VLS_260;
let __VLS_261;
let __VLS_262;
const __VLS_263 = {
    onCurrentChange: (__VLS_ctx.changePage)
};
var __VLS_259;
var __VLS_151;
var __VLS_147;
const __VLS_264 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_265 = __VLS_asFunctionalComponent(__VLS_264, new __VLS_264({
    span: (8),
}));
const __VLS_266 = __VLS_265({
    span: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_265));
__VLS_267.slots.default;
const __VLS_268 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_269 = __VLS_asFunctionalComponent(__VLS_268, new __VLS_268({
    ...{ class: "compliance-card" },
    shadow: "never",
}));
const __VLS_270 = __VLS_269({
    ...{ class: "compliance-card" },
    shadow: "never",
}, ...__VLS_functionalComponentArgsRest(__VLS_269));
__VLS_271.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_271.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
}
for (const [risk] of __VLS_getVForSourceType((__VLS_ctx.riskList))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (risk.id),
        ...{ class: "risk-item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "risk-head" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "risk-id" },
    });
    (risk.id);
    const __VLS_272 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_273 = __VLS_asFunctionalComponent(__VLS_272, new __VLS_272({
        size: "small",
        type: (risk.stageTag),
        effect: "plain",
    }));
    const __VLS_274 = __VLS_273({
        size: "small",
        type: (risk.stageTag),
        effect: "plain",
    }, ...__VLS_functionalComponentArgsRest(__VLS_273));
    __VLS_275.slots.default;
    (risk.stage);
    var __VLS_275;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "risk-desc" },
    });
    (risk.title);
    const __VLS_276 = {}.ElSteps;
    /** @type {[typeof __VLS_components.ElSteps, typeof __VLS_components.elSteps, typeof __VLS_components.ElSteps, typeof __VLS_components.elSteps, ]} */ ;
    // @ts-ignore
    const __VLS_277 = __VLS_asFunctionalComponent(__VLS_276, new __VLS_276({
        active: (risk.activeStep),
        size: "small",
        alignCenter: true,
        ...{ class: "risk-steps" },
    }));
    const __VLS_278 = __VLS_277({
        active: (risk.activeStep),
        size: "small",
        alignCenter: true,
        ...{ class: "risk-steps" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_277));
    __VLS_279.slots.default;
    const __VLS_280 = {}.ElStep;
    /** @type {[typeof __VLS_components.ElStep, typeof __VLS_components.elStep, ]} */ ;
    // @ts-ignore
    const __VLS_281 = __VLS_asFunctionalComponent(__VLS_280, new __VLS_280({
        title: "风险",
    }));
    const __VLS_282 = __VLS_281({
        title: "风险",
    }, ...__VLS_functionalComponentArgsRest(__VLS_281));
    const __VLS_284 = {}.ElStep;
    /** @type {[typeof __VLS_components.ElStep, typeof __VLS_components.elStep, ]} */ ;
    // @ts-ignore
    const __VLS_285 = __VLS_asFunctionalComponent(__VLS_284, new __VLS_284({
        title: "工单",
    }));
    const __VLS_286 = __VLS_285({
        title: "工单",
    }, ...__VLS_functionalComponentArgsRest(__VLS_285));
    const __VLS_288 = {}.ElStep;
    /** @type {[typeof __VLS_components.ElStep, typeof __VLS_components.elStep, ]} */ ;
    // @ts-ignore
    const __VLS_289 = __VLS_asFunctionalComponent(__VLS_288, new __VLS_288({
        title: "整改",
    }));
    const __VLS_290 = __VLS_289({
        title: "整改",
    }, ...__VLS_functionalComponentArgsRest(__VLS_289));
    const __VLS_292 = {}.ElStep;
    /** @type {[typeof __VLS_components.ElStep, typeof __VLS_components.elStep, ]} */ ;
    // @ts-ignore
    const __VLS_293 = __VLS_asFunctionalComponent(__VLS_292, new __VLS_292({
        title: "验证",
    }));
    const __VLS_294 = __VLS_293({
        title: "验证",
    }, ...__VLS_functionalComponentArgsRest(__VLS_293));
    var __VLS_279;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "dep-text" },
    });
    (risk.updateTime);
    (risk.owner);
}
var __VLS_271;
const __VLS_296 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_297 = __VLS_asFunctionalComponent(__VLS_296, new __VLS_296({
    ...{ class: "compliance-card mt-16" },
    shadow: "never",
}));
const __VLS_298 = __VLS_297({
    ...{ class: "compliance-card mt-16" },
    shadow: "never",
}, ...__VLS_functionalComponentArgsRest(__VLS_297));
__VLS_299.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_299.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
}
for (const [rec] of __VLS_getVForSourceType((__VLS_ctx.checkRecords))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (rec.time),
        ...{ class: "record-item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "record-head" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "record-time" },
    });
    (rec.time);
    const __VLS_300 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_301 = __VLS_asFunctionalComponent(__VLS_300, new __VLS_300({
        size: "small",
        type: (rec.result === '通过' ? 'success' : 'warning'),
        effect: "dark",
    }));
    const __VLS_302 = __VLS_301({
        size: "small",
        type: (rec.result === '通过' ? 'success' : 'warning'),
        effect: "dark",
    }, ...__VLS_functionalComponentArgsRest(__VLS_301));
    __VLS_303.slots.default;
    (rec.result);
    var __VLS_303;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "record-scope" },
    });
    (rec.scope);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "dep-text" },
    });
    (rec.executor);
    (rec.summary);
}
var __VLS_299;
var __VLS_267;
var __VLS_143;
var __VLS_139;
const __VLS_304 = {}.ElTabPane;
/** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
// @ts-ignore
const __VLS_305 = __VLS_asFunctionalComponent(__VLS_304, new __VLS_304({
    label: "合规报告",
    name: "report",
}));
const __VLS_306 = __VLS_305({
    label: "合规报告",
    name: "report",
}, ...__VLS_functionalComponentArgsRest(__VLS_305));
__VLS_307.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "report-pane" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "compliance-stats" },
});
for (const [s] of __VLS_getVForSourceType((__VLS_ctx.reportStats))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (s.label),
        ...{ class: "compliance-stat" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "compliance-stat-value" },
        ...{ style: ({ color: s.color }) },
    });
    (s.value);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "compliance-stat-label" },
    });
    (s.label);
}
const __VLS_308 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_309 = __VLS_asFunctionalComponent(__VLS_308, new __VLS_308({
    ...{ class: "compliance-card" },
    shadow: "never",
}));
const __VLS_310 = __VLS_309({
    ...{ class: "compliance-card" },
    shadow: "never",
}, ...__VLS_functionalComponentArgsRest(__VLS_309));
__VLS_311.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_311.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.reports.length);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-actions" },
    });
    const __VLS_312 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_313 = __VLS_asFunctionalComponent(__VLS_312, new __VLS_312({
        ...{ 'onClick': {} },
        type: "danger",
        size: "small",
        icon: (__VLS_ctx.DocumentCopy),
    }));
    const __VLS_314 = __VLS_313({
        ...{ 'onClick': {} },
        type: "danger",
        size: "small",
        icon: (__VLS_ctx.DocumentCopy),
    }, ...__VLS_functionalComponentArgsRest(__VLS_313));
    let __VLS_316;
    let __VLS_317;
    let __VLS_318;
    const __VLS_319 = {
        onClick: (__VLS_ctx.openReportDrawer)
    };
    __VLS_315.slots.default;
    var __VLS_315;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "toolbar-row" },
});
const __VLS_320 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_321 = __VLS_asFunctionalComponent(__VLS_320, new __VLS_320({
    modelValue: (__VLS_ctx.reportKeyword),
    placeholder: "按报告名称 / 编号搜索",
    clearable: true,
    ...{ class: "search-input" },
    prefixIcon: (__VLS_ctx.Search),
}));
const __VLS_322 = __VLS_321({
    modelValue: (__VLS_ctx.reportKeyword),
    placeholder: "按报告名称 / 编号搜索",
    clearable: true,
    ...{ class: "search-input" },
    prefixIcon: (__VLS_ctx.Search),
}, ...__VLS_functionalComponentArgsRest(__VLS_321));
const __VLS_324 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_325 = __VLS_asFunctionalComponent(__VLS_324, new __VLS_324({
    modelValue: (__VLS_ctx.reportTypeFilter),
    placeholder: "报告类型",
    clearable: true,
    ...{ class: "filter-select" },
}));
const __VLS_326 = __VLS_325({
    modelValue: (__VLS_ctx.reportTypeFilter),
    placeholder: "报告类型",
    clearable: true,
    ...{ class: "filter-select" },
}, ...__VLS_functionalComponentArgsRest(__VLS_325));
__VLS_327.slots.default;
const __VLS_328 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_329 = __VLS_asFunctionalComponent(__VLS_328, new __VLS_328({
    label: "年度",
    value: "年度",
}));
const __VLS_330 = __VLS_329({
    label: "年度",
    value: "年度",
}, ...__VLS_functionalComponentArgsRest(__VLS_329));
const __VLS_332 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_333 = __VLS_asFunctionalComponent(__VLS_332, new __VLS_332({
    label: "季度",
    value: "季度",
}));
const __VLS_334 = __VLS_333({
    label: "季度",
    value: "季度",
}, ...__VLS_functionalComponentArgsRest(__VLS_333));
const __VLS_336 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_337 = __VLS_asFunctionalComponent(__VLS_336, new __VLS_336({
    label: "专项",
    value: "专项",
}));
const __VLS_338 = __VLS_337({
    label: "专项",
    value: "专项",
}, ...__VLS_functionalComponentArgsRest(__VLS_337));
var __VLS_327;
const __VLS_340 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_341 = __VLS_asFunctionalComponent(__VLS_340, new __VLS_340({
    modelValue: (__VLS_ctx.reportConclusionFilter),
    placeholder: "结论",
    clearable: true,
    ...{ class: "filter-select" },
}));
const __VLS_342 = __VLS_341({
    modelValue: (__VLS_ctx.reportConclusionFilter),
    placeholder: "结论",
    clearable: true,
    ...{ class: "filter-select" },
}, ...__VLS_functionalComponentArgsRest(__VLS_341));
__VLS_343.slots.default;
const __VLS_344 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_345 = __VLS_asFunctionalComponent(__VLS_344, new __VLS_344({
    label: "合规",
    value: "合规",
}));
const __VLS_346 = __VLS_345({
    label: "合规",
    value: "合规",
}, ...__VLS_functionalComponentArgsRest(__VLS_345));
const __VLS_348 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_349 = __VLS_asFunctionalComponent(__VLS_348, new __VLS_348({
    label: "基本合规",
    value: "基本合规",
}));
const __VLS_350 = __VLS_349({
    label: "基本合规",
    value: "基本合规",
}, ...__VLS_functionalComponentArgsRest(__VLS_349));
const __VLS_352 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_353 = __VLS_asFunctionalComponent(__VLS_352, new __VLS_352({
    label: "存在风险",
    value: "存在风险",
}));
const __VLS_354 = __VLS_353({
    label: "存在风险",
    value: "存在风险",
}, ...__VLS_functionalComponentArgsRest(__VLS_353));
var __VLS_343;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "dep-text" },
});
(__VLS_ctx.filteredReports.length);
const __VLS_356 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_357 = __VLS_asFunctionalComponent(__VLS_356, new __VLS_356({
    data: (__VLS_ctx.filteredReports),
    stripe: true,
}));
const __VLS_358 = __VLS_357({
    data: (__VLS_ctx.filteredReports),
    stripe: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_357));
__VLS_359.slots.default;
const __VLS_360 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_361 = __VLS_asFunctionalComponent(__VLS_360, new __VLS_360({
    prop: "id",
    label: "报告编号",
    width: "118",
}));
const __VLS_362 = __VLS_361({
    prop: "id",
    label: "报告编号",
    width: "118",
}, ...__VLS_functionalComponentArgsRest(__VLS_361));
const __VLS_364 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_365 = __VLS_asFunctionalComponent(__VLS_364, new __VLS_364({
    prop: "name",
    label: "报告名称",
    minWidth: "190",
    showOverflowTooltip: true,
}));
const __VLS_366 = __VLS_365({
    prop: "name",
    label: "报告名称",
    minWidth: "190",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_365));
const __VLS_368 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_369 = __VLS_asFunctionalComponent(__VLS_368, new __VLS_368({
    prop: "type",
    label: "类型",
    width: "72",
}));
const __VLS_370 = __VLS_369({
    prop: "type",
    label: "类型",
    width: "72",
}, ...__VLS_functionalComponentArgsRest(__VLS_369));
__VLS_371.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_371.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_372 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_373 = __VLS_asFunctionalComponent(__VLS_372, new __VLS_372({
        size: "small",
        type: (__VLS_ctx.reportTypeTag[row.type]),
        effect: "plain",
    }));
    const __VLS_374 = __VLS_373({
        size: "small",
        type: (__VLS_ctx.reportTypeTag[row.type]),
        effect: "plain",
    }, ...__VLS_functionalComponentArgsRest(__VLS_373));
    __VLS_375.slots.default;
    (row.type);
    var __VLS_375;
}
var __VLS_371;
const __VLS_376 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_377 = __VLS_asFunctionalComponent(__VLS_376, new __VLS_376({
    prop: "period",
    label: "统计周期",
    width: "180",
}));
const __VLS_378 = __VLS_377({
    prop: "period",
    label: "统计周期",
    width: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_377));
const __VLS_380 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_381 = __VLS_asFunctionalComponent(__VLS_380, new __VLS_380({
    prop: "regulationCount",
    label: "覆盖法规",
    width: "86",
    align: "center",
}));
const __VLS_382 = __VLS_381({
    prop: "regulationCount",
    label: "覆盖法规",
    width: "86",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_381));
__VLS_383.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_383.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "dep-text" },
    });
    (row.regulationCount);
}
var __VLS_383;
const __VLS_384 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_385 = __VLS_asFunctionalComponent(__VLS_384, new __VLS_384({
    prop: "checkCount",
    label: "检查项",
    width: "72",
    align: "center",
}));
const __VLS_386 = __VLS_385({
    prop: "checkCount",
    label: "检查项",
    width: "72",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_385));
const __VLS_388 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_389 = __VLS_asFunctionalComponent(__VLS_388, new __VLS_388({
    label: "合规率",
    width: "150",
}));
const __VLS_390 = __VLS_389({
    label: "合规率",
    width: "150",
}, ...__VLS_functionalComponentArgsRest(__VLS_389));
__VLS_391.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_391.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_392 = {}.ElProgress;
    /** @type {[typeof __VLS_components.ElProgress, typeof __VLS_components.elProgress, ]} */ ;
    // @ts-ignore
    const __VLS_393 = __VLS_asFunctionalComponent(__VLS_392, new __VLS_392({
        percentage: (row.passRate),
        strokeWidth: (8),
        color: (row.passRate >= 90 ? '#00A854' : '#ED7B2F'),
    }));
    const __VLS_394 = __VLS_393({
        percentage: (row.passRate),
        strokeWidth: (8),
        color: (row.passRate >= 90 ? '#00A854' : '#ED7B2F'),
    }, ...__VLS_functionalComponentArgsRest(__VLS_393));
}
var __VLS_391;
const __VLS_396 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_397 = __VLS_asFunctionalComponent(__VLS_396, new __VLS_396({
    label: "结论",
    width: "92",
}));
const __VLS_398 = __VLS_397({
    label: "结论",
    width: "92",
}, ...__VLS_functionalComponentArgsRest(__VLS_397));
__VLS_399.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_399.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_400 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_401 = __VLS_asFunctionalComponent(__VLS_400, new __VLS_400({
        size: "small",
        type: (__VLS_ctx.reportConclusionTag[row.conclusion]),
        effect: "dark",
    }));
    const __VLS_402 = __VLS_401({
        size: "small",
        type: (__VLS_ctx.reportConclusionTag[row.conclusion]),
        effect: "dark",
    }, ...__VLS_functionalComponentArgsRest(__VLS_401));
    __VLS_403.slots.default;
    (row.conclusion);
    var __VLS_403;
}
var __VLS_399;
const __VLS_404 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_405 = __VLS_asFunctionalComponent(__VLS_404, new __VLS_404({
    prop: "createTime",
    label: "生成时间",
    width: "96",
}));
const __VLS_406 = __VLS_405({
    prop: "createTime",
    label: "生成时间",
    width: "96",
}, ...__VLS_functionalComponentArgsRest(__VLS_405));
const __VLS_408 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_409 = __VLS_asFunctionalComponent(__VLS_408, new __VLS_408({
    prop: "creator",
    label: "生成人",
    width: "88",
}));
const __VLS_410 = __VLS_409({
    prop: "creator",
    label: "生成人",
    width: "88",
}, ...__VLS_functionalComponentArgsRest(__VLS_409));
const __VLS_412 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_413 = __VLS_asFunctionalComponent(__VLS_412, new __VLS_412({
    label: "操作",
    width: "150",
    fixed: "right",
    align: "center",
}));
const __VLS_414 = __VLS_413({
    label: "操作",
    width: "150",
    fixed: "right",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_413));
__VLS_415.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_415.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_416 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_417 = __VLS_asFunctionalComponent(__VLS_416, new __VLS_416({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
        size: "small",
    }));
    const __VLS_418 = __VLS_417({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_417));
    let __VLS_420;
    let __VLS_421;
    let __VLS_422;
    const __VLS_423 = {
        onClick: (...[$event]) => {
            __VLS_ctx.reportDetail(row);
        }
    };
    __VLS_419.slots.default;
    var __VLS_419;
    const __VLS_424 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_425 = __VLS_asFunctionalComponent(__VLS_424, new __VLS_424({
        ...{ 'onClick': {} },
        link: true,
        type: "success",
        size: "small",
    }));
    const __VLS_426 = __VLS_425({
        ...{ 'onClick': {} },
        link: true,
        type: "success",
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_425));
    let __VLS_428;
    let __VLS_429;
    let __VLS_430;
    const __VLS_431 = {
        onClick: (...[$event]) => {
            __VLS_ctx.downloadReport(row);
        }
    };
    __VLS_427.slots.default;
    var __VLS_427;
    const __VLS_432 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_433 = __VLS_asFunctionalComponent(__VLS_432, new __VLS_432({
        ...{ 'onClick': {} },
        link: true,
        type: "warning",
        size: "small",
    }));
    const __VLS_434 = __VLS_433({
        ...{ 'onClick': {} },
        link: true,
        type: "warning",
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_433));
    let __VLS_436;
    let __VLS_437;
    let __VLS_438;
    const __VLS_439 = {
        onClick: (...[$event]) => {
            __VLS_ctx.regenerateReport(row);
        }
    };
    __VLS_435.slots.default;
    var __VLS_435;
}
var __VLS_415;
var __VLS_359;
var __VLS_311;
var __VLS_307;
var __VLS_3;
const __VLS_440 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_441 = __VLS_asFunctionalComponent(__VLS_440, new __VLS_440({
    modelValue: (__VLS_ctx.classifyDrawerVisible),
    title: (__VLS_ctx.editingClassify ? '调整数据分级' : '新增数据定级'),
    width: "640px",
    ...{ class: "compliance-dialog" },
    destroyOnClose: true,
}));
const __VLS_442 = __VLS_441({
    modelValue: (__VLS_ctx.classifyDrawerVisible),
    title: (__VLS_ctx.editingClassify ? '调整数据分级' : '新增数据定级'),
    width: "640px",
    ...{ class: "compliance-dialog" },
    destroyOnClose: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_441));
__VLS_443.slots.default;
const __VLS_444 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_445 = __VLS_asFunctionalComponent(__VLS_444, new __VLS_444({
    model: (__VLS_ctx.classifyForm),
    labelWidth: "104px",
}));
const __VLS_446 = __VLS_445({
    model: (__VLS_ctx.classifyForm),
    labelWidth: "104px",
}, ...__VLS_functionalComponentArgsRest(__VLS_445));
__VLS_447.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "rule-section-title" },
});
const __VLS_448 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_449 = __VLS_asFunctionalComponent(__VLS_448, new __VLS_448({
    label: "数据资产名称",
}));
const __VLS_450 = __VLS_449({
    label: "数据资产名称",
}, ...__VLS_functionalComponentArgsRest(__VLS_449));
__VLS_451.slots.default;
const __VLS_452 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_453 = __VLS_asFunctionalComponent(__VLS_452, new __VLS_452({
    modelValue: (__VLS_ctx.classifyForm.name),
    placeholder: "如表名 / 数据文件 / 接口名称",
}));
const __VLS_454 = __VLS_453({
    modelValue: (__VLS_ctx.classifyForm.name),
    placeholder: "如表名 / 数据文件 / 接口名称",
}, ...__VLS_functionalComponentArgsRest(__VLS_453));
var __VLS_451;
const __VLS_456 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_457 = __VLS_asFunctionalComponent(__VLS_456, new __VLS_456({
    label: "所属业务域",
}));
const __VLS_458 = __VLS_457({
    label: "所属业务域",
}, ...__VLS_functionalComponentArgsRest(__VLS_457));
__VLS_459.slots.default;
const __VLS_460 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_461 = __VLS_asFunctionalComponent(__VLS_460, new __VLS_460({
    modelValue: (__VLS_ctx.classifyForm.domain),
    ...{ class: "w-full" },
}));
const __VLS_462 = __VLS_461({
    modelValue: (__VLS_ctx.classifyForm.domain),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_461));
__VLS_463.slots.default;
for (const [d] of __VLS_getVForSourceType((__VLS_ctx.domainPool))) {
    const __VLS_464 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_465 = __VLS_asFunctionalComponent(__VLS_464, new __VLS_464({
        key: (d),
        label: (d),
        value: (d),
    }));
    const __VLS_466 = __VLS_465({
        key: (d),
        label: (d),
        value: (d),
    }, ...__VLS_functionalComponentArgsRest(__VLS_465));
}
var __VLS_463;
var __VLS_459;
const __VLS_468 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_469 = __VLS_asFunctionalComponent(__VLS_468, new __VLS_468({
    label: "数据类型",
}));
const __VLS_470 = __VLS_469({
    label: "数据类型",
}, ...__VLS_functionalComponentArgsRest(__VLS_469));
__VLS_471.slots.default;
const __VLS_472 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_473 = __VLS_asFunctionalComponent(__VLS_472, new __VLS_472({
    modelValue: (__VLS_ctx.classifyForm.dataType),
    ...{ class: "w-full" },
}));
const __VLS_474 = __VLS_473({
    modelValue: (__VLS_ctx.classifyForm.dataType),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_473));
__VLS_475.slots.default;
const __VLS_476 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_477 = __VLS_asFunctionalComponent(__VLS_476, new __VLS_476({
    label: "结构化表",
    value: "结构化表",
}));
const __VLS_478 = __VLS_477({
    label: "结构化表",
    value: "结构化表",
}, ...__VLS_functionalComponentArgsRest(__VLS_477));
const __VLS_480 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_481 = __VLS_asFunctionalComponent(__VLS_480, new __VLS_480({
    label: "半结构化文件",
    value: "半结构化文件",
}));
const __VLS_482 = __VLS_481({
    label: "半结构化文件",
    value: "半结构化文件",
}, ...__VLS_functionalComponentArgsRest(__VLS_481));
const __VLS_484 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_485 = __VLS_asFunctionalComponent(__VLS_484, new __VLS_484({
    label: "非结构化文档",
    value: "非结构化文档",
}));
const __VLS_486 = __VLS_485({
    label: "非结构化文档",
    value: "非结构化文档",
}, ...__VLS_functionalComponentArgsRest(__VLS_485));
const __VLS_488 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_489 = __VLS_asFunctionalComponent(__VLS_488, new __VLS_488({
    label: "API 服务",
    value: "API 服务",
}));
const __VLS_490 = __VLS_489({
    label: "API 服务",
    value: "API 服务",
}, ...__VLS_functionalComponentArgsRest(__VLS_489));
var __VLS_475;
var __VLS_471;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "rule-section-title" },
});
const __VLS_492 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_493 = __VLS_asFunctionalComponent(__VLS_492, new __VLS_492({
    label: "数据分类",
}));
const __VLS_494 = __VLS_493({
    label: "数据分类",
}, ...__VLS_functionalComponentArgsRest(__VLS_493));
__VLS_495.slots.default;
const __VLS_496 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_497 = __VLS_asFunctionalComponent(__VLS_496, new __VLS_496({
    modelValue: (__VLS_ctx.classifyForm.category),
    ...{ class: "w-full" },
}));
const __VLS_498 = __VLS_497({
    modelValue: (__VLS_ctx.classifyForm.category),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_497));
__VLS_499.slots.default;
for (const [c] of __VLS_getVForSourceType((__VLS_ctx.categoryPool))) {
    const __VLS_500 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_501 = __VLS_asFunctionalComponent(__VLS_500, new __VLS_500({
        key: (c),
        label: (c),
        value: (c),
    }));
    const __VLS_502 = __VLS_501({
        key: (c),
        label: (c),
        value: (c),
    }, ...__VLS_functionalComponentArgsRest(__VLS_501));
}
var __VLS_499;
var __VLS_495;
const __VLS_504 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_505 = __VLS_asFunctionalComponent(__VLS_504, new __VLS_504({
    label: "数据分级",
}));
const __VLS_506 = __VLS_505({
    label: "数据分级",
}, ...__VLS_functionalComponentArgsRest(__VLS_505));
__VLS_507.slots.default;
const __VLS_508 = {}.ElRadioGroup;
/** @type {[typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, ]} */ ;
// @ts-ignore
const __VLS_509 = __VLS_asFunctionalComponent(__VLS_508, new __VLS_508({
    modelValue: (__VLS_ctx.classifyForm.level),
}));
const __VLS_510 = __VLS_509({
    modelValue: (__VLS_ctx.classifyForm.level),
}, ...__VLS_functionalComponentArgsRest(__VLS_509));
__VLS_511.slots.default;
for (const [l] of __VLS_getVForSourceType((['L1', 'L2', 'L3', 'L4']))) {
    const __VLS_512 = {}.ElRadio;
    /** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
    // @ts-ignore
    const __VLS_513 = __VLS_asFunctionalComponent(__VLS_512, new __VLS_512({
        key: (l),
        value: (l),
    }));
    const __VLS_514 = __VLS_513({
        key: (l),
        value: (l),
    }, ...__VLS_functionalComponentArgsRest(__VLS_513));
    __VLS_515.slots.default;
    (l);
    (__VLS_ctx.gradeBrief[l]);
    var __VLS_515;
}
var __VLS_511;
var __VLS_507;
const __VLS_516 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_517 = __VLS_asFunctionalComponent(__VLS_516, new __VLS_516({
    label: "敏感字段",
}));
const __VLS_518 = __VLS_517({
    label: "敏感字段",
}, ...__VLS_functionalComponentArgsRest(__VLS_517));
__VLS_519.slots.default;
const __VLS_520 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_521 = __VLS_asFunctionalComponent(__VLS_520, new __VLS_520({
    modelValue: (__VLS_ctx.classifyForm.sensitive),
    multiple: true,
    filterable: true,
    allowCreate: true,
    defaultFirstOption: true,
    ...{ class: "w-full" },
    placeholder: "输入敏感字段后回车",
}));
const __VLS_522 = __VLS_521({
    modelValue: (__VLS_ctx.classifyForm.sensitive),
    multiple: true,
    filterable: true,
    allowCreate: true,
    defaultFirstOption: true,
    ...{ class: "w-full" },
    placeholder: "输入敏感字段后回车",
}, ...__VLS_functionalComponentArgsRest(__VLS_521));
__VLS_523.slots.default;
for (const [f] of __VLS_getVForSourceType((__VLS_ctx.sensitivePool))) {
    const __VLS_524 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_525 = __VLS_asFunctionalComponent(__VLS_524, new __VLS_524({
        key: (f),
        label: (f),
        value: (f),
    }));
    const __VLS_526 = __VLS_525({
        key: (f),
        label: (f),
        value: (f),
    }, ...__VLS_functionalComponentArgsRest(__VLS_525));
}
var __VLS_523;
var __VLS_519;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "rule-section-title" },
});
const __VLS_528 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_529 = __VLS_asFunctionalComponent(__VLS_528, new __VLS_528({
    label: "依据法规",
}));
const __VLS_530 = __VLS_529({
    label: "依据法规",
}, ...__VLS_functionalComponentArgsRest(__VLS_529));
__VLS_531.slots.default;
const __VLS_532 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_533 = __VLS_asFunctionalComponent(__VLS_532, new __VLS_532({
    modelValue: (__VLS_ctx.classifyForm.regulation),
    ...{ class: "w-full" },
}));
const __VLS_534 = __VLS_533({
    modelValue: (__VLS_ctx.classifyForm.regulation),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_533));
__VLS_535.slots.default;
for (const [r] of __VLS_getVForSourceType((__VLS_ctx.regulationPool))) {
    const __VLS_536 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_537 = __VLS_asFunctionalComponent(__VLS_536, new __VLS_536({
        key: (r),
        label: (r),
        value: (r),
    }));
    const __VLS_538 = __VLS_537({
        key: (r),
        label: (r),
        value: (r),
    }, ...__VLS_functionalComponentArgsRest(__VLS_537));
}
var __VLS_535;
var __VLS_531;
const __VLS_540 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_541 = __VLS_asFunctionalComponent(__VLS_540, new __VLS_540({
    label: "定级责任人",
}));
const __VLS_542 = __VLS_541({
    label: "定级责任人",
}, ...__VLS_functionalComponentArgsRest(__VLS_541));
__VLS_543.slots.default;
const __VLS_544 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_545 = __VLS_asFunctionalComponent(__VLS_544, new __VLS_544({
    modelValue: (__VLS_ctx.classifyForm.owner),
    ...{ class: "w-full" },
}));
const __VLS_546 = __VLS_545({
    modelValue: (__VLS_ctx.classifyForm.owner),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_545));
__VLS_547.slots.default;
for (const [o] of __VLS_getVForSourceType((__VLS_ctx.ownerPool))) {
    const __VLS_548 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_549 = __VLS_asFunctionalComponent(__VLS_548, new __VLS_548({
        key: (o),
        label: (o),
        value: (o),
    }));
    const __VLS_550 = __VLS_549({
        key: (o),
        label: (o),
        value: (o),
    }, ...__VLS_functionalComponentArgsRest(__VLS_549));
}
var __VLS_547;
var __VLS_543;
const __VLS_552 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_553 = __VLS_asFunctionalComponent(__VLS_552, new __VLS_552({
    label: "修订说明",
}));
const __VLS_554 = __VLS_553({
    label: "修订说明",
}, ...__VLS_functionalComponentArgsRest(__VLS_553));
__VLS_555.slots.default;
const __VLS_556 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_557 = __VLS_asFunctionalComponent(__VLS_556, new __VLS_556({
    modelValue: (__VLS_ctx.classifyForm.remark),
    type: "textarea",
    rows: (2),
    placeholder: "本次定级 / 调整的依据与说明",
}));
const __VLS_558 = __VLS_557({
    modelValue: (__VLS_ctx.classifyForm.remark),
    type: "textarea",
    rows: (2),
    placeholder: "本次定级 / 调整的依据与说明",
}, ...__VLS_functionalComponentArgsRest(__VLS_557));
var __VLS_555;
var __VLS_447;
{
    const { footer: __VLS_thisSlot } = __VLS_443.slots;
    const __VLS_560 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_561 = __VLS_asFunctionalComponent(__VLS_560, new __VLS_560({
        ...{ 'onClick': {} },
    }));
    const __VLS_562 = __VLS_561({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_561));
    let __VLS_564;
    let __VLS_565;
    let __VLS_566;
    const __VLS_567 = {
        onClick: (...[$event]) => {
            __VLS_ctx.classifyDrawerVisible = false;
        }
    };
    __VLS_563.slots.default;
    var __VLS_563;
    const __VLS_568 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_569 = __VLS_asFunctionalComponent(__VLS_568, new __VLS_568({
        ...{ 'onClick': {} },
        type: "danger",
    }));
    const __VLS_570 = __VLS_569({
        ...{ 'onClick': {} },
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_569));
    let __VLS_572;
    let __VLS_573;
    let __VLS_574;
    const __VLS_575 = {
        onClick: (__VLS_ctx.saveClassify)
    };
    __VLS_571.slots.default;
    var __VLS_571;
}
var __VLS_443;
const __VLS_576 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_577 = __VLS_asFunctionalComponent(__VLS_576, new __VLS_576({
    modelValue: (__VLS_ctx.reportDrawerVisible),
    title: "生成合规报告",
    width: "620px",
    ...{ class: "compliance-dialog" },
    destroyOnClose: true,
}));
const __VLS_578 = __VLS_577({
    modelValue: (__VLS_ctx.reportDrawerVisible),
    title: "生成合规报告",
    width: "620px",
    ...{ class: "compliance-dialog" },
    destroyOnClose: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_577));
__VLS_579.slots.default;
const __VLS_580 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_581 = __VLS_asFunctionalComponent(__VLS_580, new __VLS_580({
    model: (__VLS_ctx.reportForm),
    labelWidth: "96px",
}));
const __VLS_582 = __VLS_581({
    model: (__VLS_ctx.reportForm),
    labelWidth: "96px",
}, ...__VLS_functionalComponentArgsRest(__VLS_581));
__VLS_583.slots.default;
const __VLS_584 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_585 = __VLS_asFunctionalComponent(__VLS_584, new __VLS_584({
    label: "报告名称",
}));
const __VLS_586 = __VLS_585({
    label: "报告名称",
}, ...__VLS_functionalComponentArgsRest(__VLS_585));
__VLS_587.slots.default;
const __VLS_588 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_589 = __VLS_asFunctionalComponent(__VLS_588, new __VLS_588({
    modelValue: (__VLS_ctx.reportForm.name),
    placeholder: "如：2026 年第三季度数据安全合规检查报告",
}));
const __VLS_590 = __VLS_589({
    modelValue: (__VLS_ctx.reportForm.name),
    placeholder: "如：2026 年第三季度数据安全合规检查报告",
}, ...__VLS_functionalComponentArgsRest(__VLS_589));
var __VLS_587;
const __VLS_592 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_593 = __VLS_asFunctionalComponent(__VLS_592, new __VLS_592({
    label: "报告类型",
}));
const __VLS_594 = __VLS_593({
    label: "报告类型",
}, ...__VLS_functionalComponentArgsRest(__VLS_593));
__VLS_595.slots.default;
const __VLS_596 = {}.ElRadioGroup;
/** @type {[typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, ]} */ ;
// @ts-ignore
const __VLS_597 = __VLS_asFunctionalComponent(__VLS_596, new __VLS_596({
    modelValue: (__VLS_ctx.reportForm.type),
}));
const __VLS_598 = __VLS_597({
    modelValue: (__VLS_ctx.reportForm.type),
}, ...__VLS_functionalComponentArgsRest(__VLS_597));
__VLS_599.slots.default;
const __VLS_600 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
const __VLS_601 = __VLS_asFunctionalComponent(__VLS_600, new __VLS_600({
    value: "年度",
}));
const __VLS_602 = __VLS_601({
    value: "年度",
}, ...__VLS_functionalComponentArgsRest(__VLS_601));
__VLS_603.slots.default;
var __VLS_603;
const __VLS_604 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
const __VLS_605 = __VLS_asFunctionalComponent(__VLS_604, new __VLS_604({
    value: "季度",
}));
const __VLS_606 = __VLS_605({
    value: "季度",
}, ...__VLS_functionalComponentArgsRest(__VLS_605));
__VLS_607.slots.default;
var __VLS_607;
const __VLS_608 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
const __VLS_609 = __VLS_asFunctionalComponent(__VLS_608, new __VLS_608({
    value: "专项",
}));
const __VLS_610 = __VLS_609({
    value: "专项",
}, ...__VLS_functionalComponentArgsRest(__VLS_609));
__VLS_611.slots.default;
var __VLS_611;
var __VLS_599;
var __VLS_595;
const __VLS_612 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_613 = __VLS_asFunctionalComponent(__VLS_612, new __VLS_612({
    label: "统计周期",
}));
const __VLS_614 = __VLS_613({
    label: "统计周期",
}, ...__VLS_functionalComponentArgsRest(__VLS_613));
__VLS_615.slots.default;
const __VLS_616 = {}.ElDatePicker;
/** @type {[typeof __VLS_components.ElDatePicker, typeof __VLS_components.elDatePicker, ]} */ ;
// @ts-ignore
const __VLS_617 = __VLS_asFunctionalComponent(__VLS_616, new __VLS_616({
    modelValue: (__VLS_ctx.reportForm.period),
    type: "daterange",
    valueFormat: "YYYY-MM-DD",
    rangeSeparator: "至",
    startPlaceholder: "开始日期",
    endPlaceholder: "结束日期",
    ...{ class: "w-full" },
}));
const __VLS_618 = __VLS_617({
    modelValue: (__VLS_ctx.reportForm.period),
    type: "daterange",
    valueFormat: "YYYY-MM-DD",
    rangeSeparator: "至",
    startPlaceholder: "开始日期",
    endPlaceholder: "结束日期",
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_617));
var __VLS_615;
const __VLS_620 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_621 = __VLS_asFunctionalComponent(__VLS_620, new __VLS_620({
    label: "覆盖法规",
}));
const __VLS_622 = __VLS_621({
    label: "覆盖法规",
}, ...__VLS_functionalComponentArgsRest(__VLS_621));
__VLS_623.slots.default;
const __VLS_624 = {}.ElCheckboxGroup;
/** @type {[typeof __VLS_components.ElCheckboxGroup, typeof __VLS_components.elCheckboxGroup, typeof __VLS_components.ElCheckboxGroup, typeof __VLS_components.elCheckboxGroup, ]} */ ;
// @ts-ignore
const __VLS_625 = __VLS_asFunctionalComponent(__VLS_624, new __VLS_624({
    modelValue: (__VLS_ctx.reportForm.regulations),
}));
const __VLS_626 = __VLS_625({
    modelValue: (__VLS_ctx.reportForm.regulations),
}, ...__VLS_functionalComponentArgsRest(__VLS_625));
__VLS_627.slots.default;
for (const [r] of __VLS_getVForSourceType((__VLS_ctx.regulationPool))) {
    const __VLS_628 = {}.ElCheckbox;
    /** @type {[typeof __VLS_components.ElCheckbox, typeof __VLS_components.elCheckbox, typeof __VLS_components.ElCheckbox, typeof __VLS_components.elCheckbox, ]} */ ;
    // @ts-ignore
    const __VLS_629 = __VLS_asFunctionalComponent(__VLS_628, new __VLS_628({
        key: (r),
        value: (r),
    }));
    const __VLS_630 = __VLS_629({
        key: (r),
        value: (r),
    }, ...__VLS_functionalComponentArgsRest(__VLS_629));
    __VLS_631.slots.default;
    (r);
    var __VLS_631;
}
var __VLS_627;
var __VLS_623;
const __VLS_632 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_633 = __VLS_asFunctionalComponent(__VLS_632, new __VLS_632({
    label: "负责人",
}));
const __VLS_634 = __VLS_633({
    label: "负责人",
}, ...__VLS_functionalComponentArgsRest(__VLS_633));
__VLS_635.slots.default;
const __VLS_636 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_637 = __VLS_asFunctionalComponent(__VLS_636, new __VLS_636({
    modelValue: (__VLS_ctx.reportForm.owner),
    ...{ class: "w-full" },
}));
const __VLS_638 = __VLS_637({
    modelValue: (__VLS_ctx.reportForm.owner),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_637));
__VLS_639.slots.default;
for (const [o] of __VLS_getVForSourceType((__VLS_ctx.ownerPool))) {
    const __VLS_640 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_641 = __VLS_asFunctionalComponent(__VLS_640, new __VLS_640({
        key: (o),
        label: (o),
        value: (o),
    }));
    const __VLS_642 = __VLS_641({
        key: (o),
        label: (o),
        value: (o),
    }, ...__VLS_functionalComponentArgsRest(__VLS_641));
}
var __VLS_639;
var __VLS_635;
const __VLS_644 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_645 = __VLS_asFunctionalComponent(__VLS_644, new __VLS_644({
    label: "备注",
}));
const __VLS_646 = __VLS_645({
    label: "备注",
}, ...__VLS_functionalComponentArgsRest(__VLS_645));
__VLS_647.slots.default;
const __VLS_648 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_649 = __VLS_asFunctionalComponent(__VLS_648, new __VLS_648({
    modelValue: (__VLS_ctx.reportForm.remark),
    type: "textarea",
    rows: (2),
    placeholder: "报告关注重点 / 附加说明",
}));
const __VLS_650 = __VLS_649({
    modelValue: (__VLS_ctx.reportForm.remark),
    type: "textarea",
    rows: (2),
    placeholder: "报告关注重点 / 附加说明",
}, ...__VLS_functionalComponentArgsRest(__VLS_649));
var __VLS_647;
var __VLS_583;
{
    const { footer: __VLS_thisSlot } = __VLS_579.slots;
    const __VLS_652 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_653 = __VLS_asFunctionalComponent(__VLS_652, new __VLS_652({
        ...{ 'onClick': {} },
    }));
    const __VLS_654 = __VLS_653({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_653));
    let __VLS_656;
    let __VLS_657;
    let __VLS_658;
    const __VLS_659 = {
        onClick: (...[$event]) => {
            __VLS_ctx.reportDrawerVisible = false;
        }
    };
    __VLS_655.slots.default;
    var __VLS_655;
    const __VLS_660 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_661 = __VLS_asFunctionalComponent(__VLS_660, new __VLS_660({
        ...{ 'onClick': {} },
        type: "danger",
    }));
    const __VLS_662 = __VLS_661({
        ...{ 'onClick': {} },
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_661));
    let __VLS_664;
    let __VLS_665;
    let __VLS_666;
    const __VLS_667 = {
        onClick: (__VLS_ctx.saveReport)
    };
    __VLS_663.slots.default;
    var __VLS_663;
}
var __VLS_579;
const __VLS_668 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_669 = __VLS_asFunctionalComponent(__VLS_668, new __VLS_668({
    modelValue: (__VLS_ctx.riskVisible),
    title: "风险整改闭环",
    width: "640px",
}));
const __VLS_670 = __VLS_669({
    modelValue: (__VLS_ctx.riskVisible),
    title: "风险整改闭环",
    width: "640px",
}, ...__VLS_functionalComponentArgsRest(__VLS_669));
__VLS_671.slots.default;
if (__VLS_ctx.currentRisk) {
    const __VLS_672 = {}.ElDescriptions;
    /** @type {[typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, ]} */ ;
    // @ts-ignore
    const __VLS_673 = __VLS_asFunctionalComponent(__VLS_672, new __VLS_672({
        column: (1),
        border: true,
        size: "small",
    }));
    const __VLS_674 = __VLS_673({
        column: (1),
        border: true,
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_673));
    __VLS_675.slots.default;
    const __VLS_676 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_677 = __VLS_asFunctionalComponent(__VLS_676, new __VLS_676({
        label: "风险编号",
    }));
    const __VLS_678 = __VLS_677({
        label: "风险编号",
    }, ...__VLS_functionalComponentArgsRest(__VLS_677));
    __VLS_679.slots.default;
    (__VLS_ctx.currentRisk.riskId);
    var __VLS_679;
    const __VLS_680 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_681 = __VLS_asFunctionalComponent(__VLS_680, new __VLS_680({
        label: "关联条款",
    }));
    const __VLS_682 = __VLS_681({
        label: "关联条款",
    }, ...__VLS_functionalComponentArgsRest(__VLS_681));
    __VLS_683.slots.default;
    (__VLS_ctx.currentRisk.regulation);
    (__VLS_ctx.currentRisk.clause);
    var __VLS_683;
    const __VLS_684 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_685 = __VLS_asFunctionalComponent(__VLS_684, new __VLS_684({
        label: "风险内容",
    }));
    const __VLS_686 = __VLS_685({
        label: "风险内容",
    }, ...__VLS_functionalComponentArgsRest(__VLS_685));
    __VLS_687.slots.default;
    (__VLS_ctx.currentRisk.requirement);
    var __VLS_687;
    const __VLS_688 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_689 = __VLS_asFunctionalComponent(__VLS_688, new __VLS_688({
        label: "责任部门",
    }));
    const __VLS_690 = __VLS_689({
        label: "责任部门",
    }, ...__VLS_functionalComponentArgsRest(__VLS_689));
    __VLS_691.slots.default;
    var __VLS_691;
    var __VLS_675;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "section-title mt-16" },
    });
    const __VLS_692 = {}.ElSteps;
    /** @type {[typeof __VLS_components.ElSteps, typeof __VLS_components.elSteps, typeof __VLS_components.ElSteps, typeof __VLS_components.elSteps, ]} */ ;
    // @ts-ignore
    const __VLS_693 = __VLS_asFunctionalComponent(__VLS_692, new __VLS_692({
        active: (2),
        alignCenter: true,
        ...{ class: "risk-steps" },
    }));
    const __VLS_694 = __VLS_693({
        active: (2),
        alignCenter: true,
        ...{ class: "risk-steps" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_693));
    __VLS_695.slots.default;
    const __VLS_696 = {}.ElStep;
    /** @type {[typeof __VLS_components.ElStep, typeof __VLS_components.elStep, ]} */ ;
    // @ts-ignore
    const __VLS_697 = __VLS_asFunctionalComponent(__VLS_696, new __VLS_696({
        title: "风险登记",
    }));
    const __VLS_698 = __VLS_697({
        title: "风险登记",
    }, ...__VLS_functionalComponentArgsRest(__VLS_697));
    const __VLS_700 = {}.ElStep;
    /** @type {[typeof __VLS_components.ElStep, typeof __VLS_components.elStep, ]} */ ;
    // @ts-ignore
    const __VLS_701 = __VLS_asFunctionalComponent(__VLS_700, new __VLS_700({
        title: "工单下发",
    }));
    const __VLS_702 = __VLS_701({
        title: "工单下发",
    }, ...__VLS_functionalComponentArgsRest(__VLS_701));
    const __VLS_704 = {}.ElStep;
    /** @type {[typeof __VLS_components.ElStep, typeof __VLS_components.elStep, ]} */ ;
    // @ts-ignore
    const __VLS_705 = __VLS_asFunctionalComponent(__VLS_704, new __VLS_704({
        title: "整改实施",
    }));
    const __VLS_706 = __VLS_705({
        title: "整改实施",
    }, ...__VLS_functionalComponentArgsRest(__VLS_705));
    const __VLS_708 = {}.ElStep;
    /** @type {[typeof __VLS_components.ElStep, typeof __VLS_components.elStep, ]} */ ;
    // @ts-ignore
    const __VLS_709 = __VLS_asFunctionalComponent(__VLS_708, new __VLS_708({
        title: "复验关闭",
    }));
    const __VLS_710 = __VLS_709({
        title: "复验关闭",
    }, ...__VLS_functionalComponentArgsRest(__VLS_709));
    var __VLS_695;
    const __VLS_712 = {}.ElTimeline;
    /** @type {[typeof __VLS_components.ElTimeline, typeof __VLS_components.elTimeline, typeof __VLS_components.ElTimeline, typeof __VLS_components.elTimeline, ]} */ ;
    // @ts-ignore
    const __VLS_713 = __VLS_asFunctionalComponent(__VLS_712, new __VLS_712({
        ...{ class: "mt-16" },
    }));
    const __VLS_714 = __VLS_713({
        ...{ class: "mt-16" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_713));
    __VLS_715.slots.default;
    const __VLS_716 = {}.ElTimelineItem;
    /** @type {[typeof __VLS_components.ElTimelineItem, typeof __VLS_components.elTimelineItem, typeof __VLS_components.ElTimelineItem, typeof __VLS_components.elTimelineItem, ]} */ ;
    // @ts-ignore
    const __VLS_717 = __VLS_asFunctionalComponent(__VLS_716, new __VLS_716({
        timestamp: "2026-08-10 10:00",
        type: "danger",
    }));
    const __VLS_718 = __VLS_717({
        timestamp: "2026-08-10 10:00",
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_717));
    __VLS_719.slots.default;
    (__VLS_ctx.currentRisk.regulation);
    var __VLS_719;
    const __VLS_720 = {}.ElTimelineItem;
    /** @type {[typeof __VLS_components.ElTimelineItem, typeof __VLS_components.elTimelineItem, typeof __VLS_components.ElTimelineItem, typeof __VLS_components.elTimelineItem, ]} */ ;
    // @ts-ignore
    const __VLS_721 = __VLS_asFunctionalComponent(__VLS_720, new __VLS_720({
        timestamp: "2026-08-10 15:20",
        type: "warning",
    }));
    const __VLS_722 = __VLS_721({
        timestamp: "2026-08-10 15:20",
        type: "warning",
    }, ...__VLS_functionalComponentArgsRest(__VLS_721));
    __VLS_723.slots.default;
    var __VLS_723;
    const __VLS_724 = {}.ElTimelineItem;
    /** @type {[typeof __VLS_components.ElTimelineItem, typeof __VLS_components.elTimelineItem, typeof __VLS_components.ElTimelineItem, typeof __VLS_components.elTimelineItem, ]} */ ;
    // @ts-ignore
    const __VLS_725 = __VLS_asFunctionalComponent(__VLS_724, new __VLS_724({
        timestamp: "2026-08-12 09:30",
        type: "primary",
    }));
    const __VLS_726 = __VLS_725({
        timestamp: "2026-08-12 09:30",
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_725));
    __VLS_727.slots.default;
    var __VLS_727;
    var __VLS_715;
}
{
    const { footer: __VLS_thisSlot } = __VLS_671.slots;
    const __VLS_728 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_729 = __VLS_asFunctionalComponent(__VLS_728, new __VLS_728({
        ...{ 'onClick': {} },
        type: "primary",
        plain: true,
    }));
    const __VLS_730 = __VLS_729({
        ...{ 'onClick': {} },
        type: "primary",
        plain: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_729));
    let __VLS_732;
    let __VLS_733;
    let __VLS_734;
    const __VLS_735 = {
        onClick: (__VLS_ctx.closeRisk)
    };
    __VLS_731.slots.default;
    var __VLS_731;
    const __VLS_736 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_737 = __VLS_asFunctionalComponent(__VLS_736, new __VLS_736({
        ...{ 'onClick': {} },
        type: "danger",
    }));
    const __VLS_738 = __VLS_737({
        ...{ 'onClick': {} },
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_737));
    let __VLS_740;
    let __VLS_741;
    let __VLS_742;
    const __VLS_743 = {
        onClick: (__VLS_ctx.exportRiskEvidence)
    };
    __VLS_739.slots.default;
    var __VLS_739;
}
var __VLS_671;
/** @type {__VLS_StyleScopedClasses['standard-page']} */ ;
/** @type {__VLS_StyleScopedClasses['compliance-page']} */ ;
/** @type {__VLS_StyleScopedClasses['compliance-tabs-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['classify-pane']} */ ;
/** @type {__VLS_StyleScopedClasses['compliance-stats']} */ ;
/** @type {__VLS_StyleScopedClasses['compliance-stat']} */ ;
/** @type {__VLS_StyleScopedClasses['compliance-stat-value']} */ ;
/** @type {__VLS_StyleScopedClasses['compliance-stat-label']} */ ;
/** @type {__VLS_StyleScopedClasses['compliance-rows']} */ ;
/** @type {__VLS_StyleScopedClasses['compliance-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['block-title']} */ ;
/** @type {__VLS_StyleScopedClasses['dep-text']} */ ;
/** @type {__VLS_StyleScopedClasses['grade-matrix']} */ ;
/** @type {__VLS_StyleScopedClasses['gm-head']} */ ;
/** @type {__VLS_StyleScopedClasses['gm-object']} */ ;
/** @type {__VLS_StyleScopedClasses['gm-head']} */ ;
/** @type {__VLS_StyleScopedClasses['gm-head']} */ ;
/** @type {__VLS_StyleScopedClasses['gm-head']} */ ;
/** @type {__VLS_StyleScopedClasses['gm-row']} */ ;
/** @type {__VLS_StyleScopedClasses['gm-object']} */ ;
/** @type {__VLS_StyleScopedClasses['gm-cell']} */ ;
/** @type {__VLS_StyleScopedClasses['gm-cell']} */ ;
/** @type {__VLS_StyleScopedClasses['gm-cell']} */ ;
/** @type {__VLS_StyleScopedClasses['block-title']} */ ;
/** @type {__VLS_StyleScopedClasses['grade-item']} */ ;
/** @type {__VLS_StyleScopedClasses['grade-name']} */ ;
/** @type {__VLS_StyleScopedClasses['dep-text']} */ ;
/** @type {__VLS_StyleScopedClasses['block-title']} */ ;
/** @type {__VLS_StyleScopedClasses['category-tags']} */ ;
/** @type {__VLS_StyleScopedClasses['compliance-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['toolbar-row']} */ ;
/** @type {__VLS_StyleScopedClasses['search-input']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-select']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-select']} */ ;
/** @type {__VLS_StyleScopedClasses['asset-name']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
/** @type {__VLS_StyleScopedClasses['check-pane']} */ ;
/** @type {__VLS_StyleScopedClasses['compliance-stats']} */ ;
/** @type {__VLS_StyleScopedClasses['compliance-stat']} */ ;
/** @type {__VLS_StyleScopedClasses['compliance-stat-value']} */ ;
/** @type {__VLS_StyleScopedClasses['compliance-stat-label']} */ ;
/** @type {__VLS_StyleScopedClasses['compliance-rows']} */ ;
/** @type {__VLS_StyleScopedClasses['compliance-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['toolbar-row']} */ ;
/** @type {__VLS_StyleScopedClasses['search-input']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-select']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-select']} */ ;
/** @type {__VLS_StyleScopedClasses['security-level']} */ ;
/** @type {__VLS_StyleScopedClasses['pager']} */ ;
/** @type {__VLS_StyleScopedClasses['compliance-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['risk-item']} */ ;
/** @type {__VLS_StyleScopedClasses['risk-head']} */ ;
/** @type {__VLS_StyleScopedClasses['risk-id']} */ ;
/** @type {__VLS_StyleScopedClasses['risk-desc']} */ ;
/** @type {__VLS_StyleScopedClasses['risk-steps']} */ ;
/** @type {__VLS_StyleScopedClasses['dep-text']} */ ;
/** @type {__VLS_StyleScopedClasses['compliance-card']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['record-item']} */ ;
/** @type {__VLS_StyleScopedClasses['record-head']} */ ;
/** @type {__VLS_StyleScopedClasses['record-time']} */ ;
/** @type {__VLS_StyleScopedClasses['record-scope']} */ ;
/** @type {__VLS_StyleScopedClasses['dep-text']} */ ;
/** @type {__VLS_StyleScopedClasses['report-pane']} */ ;
/** @type {__VLS_StyleScopedClasses['compliance-stats']} */ ;
/** @type {__VLS_StyleScopedClasses['compliance-stat']} */ ;
/** @type {__VLS_StyleScopedClasses['compliance-stat-value']} */ ;
/** @type {__VLS_StyleScopedClasses['compliance-stat-label']} */ ;
/** @type {__VLS_StyleScopedClasses['compliance-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['toolbar-row']} */ ;
/** @type {__VLS_StyleScopedClasses['search-input']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-select']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-select']} */ ;
/** @type {__VLS_StyleScopedClasses['dep-text']} */ ;
/** @type {__VLS_StyleScopedClasses['dep-text']} */ ;
/** @type {__VLS_StyleScopedClasses['compliance-dialog']} */ ;
/** @type {__VLS_StyleScopedClasses['rule-section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['rule-section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['rule-section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['compliance-dialog']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
/** @type {__VLS_StyleScopedClasses['risk-steps']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            DocumentCopy: DocumentCopy,
            Download: Download,
            Plus: Plus,
            Search: Search,
            activeTab: activeTab,
            gradeMatrix: gradeMatrix,
            gradeBrief: gradeBrief,
            gradeTagType: gradeTagType,
            gradeDefine: gradeDefine,
            categoryPool: categoryPool,
            domainPool: domainPool,
            regulationPool: regulationPool,
            ownerPool: ownerPool,
            sensitivePool: sensitivePool,
            classifiedAssets: classifiedAssets,
            classifyKeyword: classifyKeyword,
            classifyLevel: classifyLevel,
            classifyCategory: classifyCategory,
            filteredAssets: filteredAssets,
            classifyStats: classifyStats,
            classifyDrawerVisible: classifyDrawerVisible,
            editingClassify: editingClassify,
            classifyForm: classifyForm,
            openClassifyDrawer: openClassifyDrawer,
            adjustLevel: adjustLevel,
            saveClassify: saveClassify,
            exportClassify: exportClassify,
            assetDetail: assetDetail,
            keyword: keyword,
            filterStatus: filterStatus,
            filterRisk: filterRisk,
            currentPage: currentPage,
            pageSize: pageSize,
            riskVisible: riskVisible,
            levelColor: levelColor,
            complianceStatusTag: complianceStatusTag,
            checkStats: checkStats,
            riskList: riskList,
            checkRecords: checkRecords,
            currentRisk: currentRisk,
            filteredItems: filteredItems,
            pagedItems: pagedItems,
            changePage: changePage,
            autoCheck: autoCheck,
            jumpToReport: jumpToReport,
            openRisk: openRisk,
            closeRisk: closeRisk,
            exportRiskEvidence: exportRiskEvidence,
            viewEvidence: viewEvidence,
            reports: reports,
            reportKeyword: reportKeyword,
            reportTypeFilter: reportTypeFilter,
            reportConclusionFilter: reportConclusionFilter,
            reportTypeTag: reportTypeTag,
            reportConclusionTag: reportConclusionTag,
            filteredReports: filteredReports,
            reportStats: reportStats,
            reportDrawerVisible: reportDrawerVisible,
            reportForm: reportForm,
            openReportDrawer: openReportDrawer,
            saveReport: saveReport,
            reportDetail: reportDetail,
            downloadReport: downloadReport,
            regenerateReport: regenerateReport,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
