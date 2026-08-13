import { computed, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { Delete, Plus, Search } from '@element-plus/icons-vue';
const stepTitles = ['选择资产', '服务配置', '预览发布'];
const activeStep = ref(0);
const assetType = ref('table');
const baseUrl = 'https://api.gz-metro-data.cn';
const levelColor = {
    L1: '#8c8c8c',
    L2: '#2B6CB0',
    L3: '#ED7B2F',
    L4: '#DA251D',
};
const domainOptions = ['客运票务', '旅客服务', '运营调度', '财务共享', '设备运维'];
const typeOptions = ['STRING', 'INT', 'BIGINT', 'DECIMAL', 'DATE', 'TIMESTAMP', 'BOOLEAN'];
const statsCards = [
    { label: '已发布服务', value: '12', color: '#fff', bg: 'linear-gradient(135deg, #DA251D, #B71C1C)' },
    { label: '待发布审批', value: '3', color: '#ED7B2F', bg: 'rgba(237,123,47,.1)' },
    { label: '服务草稿', value: '5', color: '#2B6CB0', bg: 'rgba(43,108,176,.1)' },
    { label: '本周新增', value: '4', color: '#00A854', bg: 'rgba(0,168,84,.1)' },
];
const assetPool = [
    { name: 'ticket_sale', source: '票务运营库', level: 'L3', classified: '个人信息/敏感', fields: 12 },
    { name: 'dws_order_report', source: '数据仓库DWS', level: 'L2', classified: '经营数据/内部', fields: 8 },
    { name: 'ads_line_flow', source: '指标中台ADS', level: 'L2', classified: '交通运行/内部', fields: 7 },
    { name: 'station_info', source: '基础信息库', level: 'L1', classified: '基础信息/公开', fields: 5 },
    { name: 'line_info', source: '基础信息库', level: 'L1', classified: '基础信息/公开', fields: 4 },
    { name: '支付流水查询接口', source: '统一接口平台', level: 'L4', classified: '经营数据/核心', fields: 6 },
    { name: '乘客实名知识问答', source: '知识库', level: 'L3', classified: '个人信息/敏感', fields: 0 },
];
const filteredAssets = computed(() => {
    const typeKey = assetType.value === 'table' ? '表' : assetType.value === 'api' ? '接口' : '问答';
    if (assetType.value === 'table')
        return assetPool.filter((a) => !a.name.includes('接口') && !a.name.includes('问答'));
    if (assetType.value === 'api')
        return assetPool.filter((a) => a.name.includes('接口'));
    return assetPool.filter((a) => a.name.includes('问答'));
});
const selectedAsset = ref(null);
const selectAsset = (row) => {
    selectedAsset.value = row;
};
const serviceForm = ref({
    name: '',
    path: '',
    method: 'GET',
    domain: '客运票务',
    kind: '实时查询',
    auth: true,
    sql: '',
    params: [
        { name: 'line_code', type: 'STRING', required: true, desc: '线路编码' },
        { name: 'begin_date', type: 'DATE', required: false, desc: '开始日期' },
    ],
    outputs: [
        { name: 'line_code', type: 'STRING', alias: 'lineCode' },
        { name: 'total_amount', type: 'DECIMAL', alias: 'totalAmount' },
    ],
});
const addParam = (isOutput) => {
    if (isOutput)
        serviceForm.value.outputs.push({ name: '', type: 'STRING', alias: '' });
    else
        serviceForm.value.params.push({ name: '', type: 'STRING', required: false, desc: '' });
};
const requestSample = computed(() => JSON.stringify({
    url: `/api/v1/flow/stat`,
    method: serviceForm.value.method,
    headers: { 'X-AppKey': 'Zx9k...ab3c', 'X-Timestamp': '2026-08-13 10:00:00', 'X-Signature': 'HMAC-SHA256(...)' },
    body: serviceForm.value.params.reduce((acc, p) => ({ ...acc, [p.name]: p.name === 'line_code' ? 'GZ-L1' : '2026-08-01' }), {}),
}, null, 2));
const validateConfig = () => {
    if (!serviceForm.value.name.trim()) {
        ElMessage.warning('请填写服务名称');
        return;
    }
    if (!serviceForm.value.path.trim().startsWith('/')) {
        ElMessage.warning('服务路径需以 / 开头');
        return;
    }
    if (!serviceForm.value.sql.trim()) {
        ElMessage.warning('请填写自定义 SQL 逻辑');
        return;
    }
    activeStep.value++;
};
const regStatusTag = {
    草稿: 'info',
    待发布: 'warning',
    已发布: 'success',
    已驳回: 'danger',
};
const registrations = ref([
    { name: '客流统计查询服务', path: '/api/v1/flow/stat', asset: 'ads_line_flow', status: '已发布', updateTime: '2026-08-11 14:20' },
    { name: '线路基础信息服务', path: '/api/v1/line/detail', asset: 'line_info', status: '已发布', updateTime: '2026-08-09 09:10' },
    { name: '售票明细查询服务', path: '/api/v1/ticket/query', asset: 'ticket_sale', status: '待发布', updateTime: '2026-08-12 16:40' },
    { name: '车站信息同步服务', path: '/api/v1/station/list', asset: 'station_info', status: '草稿', updateTime: '2026-08-12 11:05' },
    { name: '订单汇总指标服务', path: '/api/v1/order/summary', asset: 'dws_order_report', status: '已驳回', updateTime: '2026-08-06 10:30' },
]);
const regKeyword = ref('');
const regStatus = ref('');
const filteredRegistrations = computed(() => registrations.value.filter((r) => {
    if (regStatus.value && r.status !== regStatus.value)
        return false;
    if (!regKeyword.value)
        return true;
    const kw = regKeyword.value.toLowerCase();
    return r.name.toLowerCase().includes(kw) || r.path.toLowerCase().includes(kw);
}));
const saveService = (status) => {
    if (!serviceForm.value.name.trim()) {
        ElMessage.warning('请填写服务名称');
        return;
    }
    registrations.value.unshift({
        name: serviceForm.value.name,
        path: serviceForm.value.path,
        asset: selectedAsset.value?.name ?? '—',
        status,
        updateTime: new Date().toLocaleString('sv-SE').replace('T', ' '),
    });
    ElMessage.success(status === '草稿' ? '服务配置已保存为草稿' : '服务已提交发布审批（Mock）');
    activeStep.value = 0;
    serviceForm.value = { ...serviceForm.value, name: '', path: '', sql: '' };
};
const editService = (row) => {
    serviceForm.value.name = row.name;
    serviceForm.value.path = row.path;
    activeStep.value = 1;
    ElMessage.info('已载入服务配置，可编辑后重新保存（Mock）');
};
const submitService = (row) => {
    row.status = '待发布';
    ElMessage.success(`「${row.name}」已提交发布审批（Mock）`);
};
const viewDoc = (row) => {
    ElMessage.info(`生成 API 文档：${baseUrl}${row.path}（Mock）`);
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "standard-page share-register-page" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "share-stats" },
});
for (const [s] of __VLS_getVForSourceType((__VLS_ctx.statsCards))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (s.label),
        ...{ class: "share-stat" },
        ...{ style: ({ background: s.bg, color: s.color }) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "share-stat-value" },
    });
    (s.value);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "share-stat-label" },
    });
    (s.label);
}
const __VLS_0 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    gutter: (16),
}));
const __VLS_2 = __VLS_1({
    gutter: (16),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
const __VLS_4 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    span: (15),
}));
const __VLS_6 = __VLS_5({
    span: (15),
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
__VLS_7.slots.default;
const __VLS_8 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    ...{ class: "panel-card" },
    shadow: "never",
}));
const __VLS_10 = __VLS_9({
    ...{ class: "panel-card" },
    shadow: "never",
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
__VLS_11.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_11.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-actions" },
    });
    const __VLS_12 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
        type: "danger",
        effect: "plain",
    }));
    const __VLS_14 = __VLS_13({
        type: "danger",
        effect: "plain",
    }, ...__VLS_functionalComponentArgsRest(__VLS_13));
    __VLS_15.slots.default;
    (__VLS_ctx.stepTitles[__VLS_ctx.activeStep]);
    var __VLS_15;
}
const __VLS_16 = {}.ElSteps;
/** @type {[typeof __VLS_components.ElSteps, typeof __VLS_components.elSteps, typeof __VLS_components.ElSteps, typeof __VLS_components.elSteps, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    active: (__VLS_ctx.activeStep),
    alignCenter: true,
    ...{ class: "register-steps mt-12" },
}));
const __VLS_18 = __VLS_17({
    active: (__VLS_ctx.activeStep),
    alignCenter: true,
    ...{ class: "register-steps mt-12" },
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
__VLS_19.slots.default;
const __VLS_20 = {}.ElStep;
/** @type {[typeof __VLS_components.ElStep, typeof __VLS_components.elStep, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
    title: "选择资产",
    description: "选择待封装的数据资产",
}));
const __VLS_22 = __VLS_21({
    title: "选择资产",
    description: "选择待封装的数据资产",
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
const __VLS_24 = {}.ElStep;
/** @type {[typeof __VLS_components.ElStep, typeof __VLS_components.elStep, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    title: "服务配置",
    description: "入参 / 出参 / 自定义SQL",
}));
const __VLS_26 = __VLS_25({
    title: "服务配置",
    description: "入参 / 出参 / 自定义SQL",
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
const __VLS_28 = {}.ElStep;
/** @type {[typeof __VLS_components.ElStep, typeof __VLS_components.elStep, ]} */ ;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
    title: "预览发布",
    description: "生成API文档并提交",
}));
const __VLS_30 = __VLS_29({
    title: "预览发布",
    description: "生成API文档并提交",
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
var __VLS_19;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "asset-step" },
});
__VLS_asFunctionalDirective(__VLS_directives.vShow)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.activeStep === 0) }, null, null);
const __VLS_32 = {}.ElRadioGroup;
/** @type {[typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
    modelValue: (__VLS_ctx.assetType),
    ...{ class: "asset-type-tabs" },
}));
const __VLS_34 = __VLS_33({
    modelValue: (__VLS_ctx.assetType),
    ...{ class: "asset-type-tabs" },
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
__VLS_35.slots.default;
const __VLS_36 = {}.ElRadioButton;
/** @type {[typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    value: "table",
}));
const __VLS_38 = __VLS_37({
    value: "table",
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
__VLS_39.slots.default;
var __VLS_39;
const __VLS_40 = {}.ElRadioButton;
/** @type {[typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
    value: "api",
}));
const __VLS_42 = __VLS_41({
    value: "api",
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
__VLS_43.slots.default;
var __VLS_43;
const __VLS_44 = {}.ElRadioButton;
/** @type {[typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    value: "qa",
}));
const __VLS_46 = __VLS_45({
    value: "qa",
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
__VLS_47.slots.default;
var __VLS_47;
var __VLS_35;
const __VLS_48 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
    ...{ 'onCurrentChange': {} },
    data: (__VLS_ctx.filteredAssets),
    height: "300",
    size: "small",
    highlightCurrentRow: true,
}));
const __VLS_50 = __VLS_49({
    ...{ 'onCurrentChange': {} },
    data: (__VLS_ctx.filteredAssets),
    height: "300",
    size: "small",
    highlightCurrentRow: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
let __VLS_52;
let __VLS_53;
let __VLS_54;
const __VLS_55 = {
    onCurrentChange: (__VLS_ctx.selectAsset)
};
__VLS_51.slots.default;
const __VLS_56 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
    prop: "name",
    label: "资产名称",
    minWidth: "180",
}));
const __VLS_58 = __VLS_57({
    prop: "name",
    label: "资产名称",
    minWidth: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
const __VLS_60 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
    prop: "source",
    label: "来源",
    width: "150",
}));
const __VLS_62 = __VLS_61({
    prop: "source",
    label: "来源",
    width: "150",
}, ...__VLS_functionalComponentArgsRest(__VLS_61));
const __VLS_64 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
    prop: "level",
    label: "级别",
    width: "70",
    align: "center",
}));
const __VLS_66 = __VLS_65({
    prop: "level",
    label: "级别",
    width: "70",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_65));
__VLS_67.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_67.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "level-badge" },
        ...{ style: ({ background: __VLS_ctx.levelColor[row.level] }) },
    });
    (row.level);
}
var __VLS_67;
const __VLS_68 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
    prop: "classified",
    label: "分类分级",
    width: "110",
}));
const __VLS_70 = __VLS_69({
    prop: "classified",
    label: "分类分级",
    width: "110",
}, ...__VLS_functionalComponentArgsRest(__VLS_69));
const __VLS_72 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
    prop: "fields",
    label: "字段数",
    width: "70",
    align: "center",
}));
const __VLS_74 = __VLS_73({
    prop: "fields",
    label: "字段数",
    width: "70",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_73));
var __VLS_51;
const __VLS_76 = {}.ElAlert;
/** @type {[typeof __VLS_components.ElAlert, typeof __VLS_components.elAlert, typeof __VLS_components.ElAlert, typeof __VLS_components.elAlert, ]} */ ;
// @ts-ignore
const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
    type: "info",
    closable: (false),
    showIcon: true,
    ...{ class: "asset-tip" },
}));
const __VLS_78 = __VLS_77({
    type: "info",
    closable: (false),
    showIcon: true,
    ...{ class: "asset-tip" },
}, ...__VLS_functionalComponentArgsRest(__VLS_77));
__VLS_79.slots.default;
{
    const { title: __VLS_thisSlot } = __VLS_79.slots;
}
var __VLS_79;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "config-step" },
});
__VLS_asFunctionalDirective(__VLS_directives.vShow)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.activeStep === 1) }, null, null);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "rule-section-title" },
});
const __VLS_80 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
// @ts-ignore
const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
    gutter: (12),
}));
const __VLS_82 = __VLS_81({
    gutter: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_81));
__VLS_83.slots.default;
const __VLS_84 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
    span: (8),
}));
const __VLS_86 = __VLS_85({
    span: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_85));
__VLS_87.slots.default;
const __VLS_88 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
    label: "服务名称",
}));
const __VLS_90 = __VLS_89({
    label: "服务名称",
}, ...__VLS_functionalComponentArgsRest(__VLS_89));
__VLS_91.slots.default;
const __VLS_92 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
    modelValue: (__VLS_ctx.serviceForm.name),
    placeholder: "如：客流统计查询服务",
}));
const __VLS_94 = __VLS_93({
    modelValue: (__VLS_ctx.serviceForm.name),
    placeholder: "如：客流统计查询服务",
}, ...__VLS_functionalComponentArgsRest(__VLS_93));
var __VLS_91;
var __VLS_87;
const __VLS_96 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
    span: (8),
}));
const __VLS_98 = __VLS_97({
    span: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_97));
__VLS_99.slots.default;
const __VLS_100 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
    label: "服务路径",
}));
const __VLS_102 = __VLS_101({
    label: "服务路径",
}, ...__VLS_functionalComponentArgsRest(__VLS_101));
__VLS_103.slots.default;
const __VLS_104 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
    modelValue: (__VLS_ctx.serviceForm.path),
    placeholder: "/api/v1/flow/stat",
}));
const __VLS_106 = __VLS_105({
    modelValue: (__VLS_ctx.serviceForm.path),
    placeholder: "/api/v1/flow/stat",
}, ...__VLS_functionalComponentArgsRest(__VLS_105));
var __VLS_103;
var __VLS_99;
const __VLS_108 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
    span: (8),
}));
const __VLS_110 = __VLS_109({
    span: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_109));
__VLS_111.slots.default;
const __VLS_112 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
    label: "请求方式",
}));
const __VLS_114 = __VLS_113({
    label: "请求方式",
}, ...__VLS_functionalComponentArgsRest(__VLS_113));
__VLS_115.slots.default;
const __VLS_116 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
    modelValue: (__VLS_ctx.serviceForm.method),
    ...{ class: "w-full" },
}));
const __VLS_118 = __VLS_117({
    modelValue: (__VLS_ctx.serviceForm.method),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_117));
__VLS_119.slots.default;
const __VLS_120 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({
    label: "GET",
    value: "GET",
}));
const __VLS_122 = __VLS_121({
    label: "GET",
    value: "GET",
}, ...__VLS_functionalComponentArgsRest(__VLS_121));
const __VLS_124 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({
    label: "POST",
    value: "POST",
}));
const __VLS_126 = __VLS_125({
    label: "POST",
    value: "POST",
}, ...__VLS_functionalComponentArgsRest(__VLS_125));
const __VLS_128 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({
    label: "PUT",
    value: "PUT",
}));
const __VLS_130 = __VLS_129({
    label: "PUT",
    value: "PUT",
}, ...__VLS_functionalComponentArgsRest(__VLS_129));
var __VLS_119;
var __VLS_115;
var __VLS_111;
const __VLS_132 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132({
    span: (8),
}));
const __VLS_134 = __VLS_133({
    span: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_133));
__VLS_135.slots.default;
const __VLS_136 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_137 = __VLS_asFunctionalComponent(__VLS_136, new __VLS_136({
    label: "所属业务域",
}));
const __VLS_138 = __VLS_137({
    label: "所属业务域",
}, ...__VLS_functionalComponentArgsRest(__VLS_137));
__VLS_139.slots.default;
const __VLS_140 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_141 = __VLS_asFunctionalComponent(__VLS_140, new __VLS_140({
    modelValue: (__VLS_ctx.serviceForm.domain),
    ...{ class: "w-full" },
}));
const __VLS_142 = __VLS_141({
    modelValue: (__VLS_ctx.serviceForm.domain),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_141));
__VLS_143.slots.default;
for (const [d] of __VLS_getVForSourceType((__VLS_ctx.domainOptions))) {
    const __VLS_144 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_145 = __VLS_asFunctionalComponent(__VLS_144, new __VLS_144({
        key: (d),
        label: (d),
        value: (d),
    }));
    const __VLS_146 = __VLS_145({
        key: (d),
        label: (d),
        value: (d),
    }, ...__VLS_functionalComponentArgsRest(__VLS_145));
}
var __VLS_143;
var __VLS_139;
var __VLS_135;
const __VLS_148 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_149 = __VLS_asFunctionalComponent(__VLS_148, new __VLS_148({
    span: (8),
}));
const __VLS_150 = __VLS_149({
    span: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_149));
__VLS_151.slots.default;
const __VLS_152 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_153 = __VLS_asFunctionalComponent(__VLS_152, new __VLS_152({
    label: "服务类型",
}));
const __VLS_154 = __VLS_153({
    label: "服务类型",
}, ...__VLS_functionalComponentArgsRest(__VLS_153));
__VLS_155.slots.default;
const __VLS_156 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_157 = __VLS_asFunctionalComponent(__VLS_156, new __VLS_156({
    modelValue: (__VLS_ctx.serviceForm.kind),
    ...{ class: "w-full" },
}));
const __VLS_158 = __VLS_157({
    modelValue: (__VLS_ctx.serviceForm.kind),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_157));
__VLS_159.slots.default;
const __VLS_160 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_161 = __VLS_asFunctionalComponent(__VLS_160, new __VLS_160({
    label: "实时查询",
    value: "实时查询",
}));
const __VLS_162 = __VLS_161({
    label: "实时查询",
    value: "实时查询",
}, ...__VLS_functionalComponentArgsRest(__VLS_161));
const __VLS_164 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_165 = __VLS_asFunctionalComponent(__VLS_164, new __VLS_164({
    label: "指标计算",
    value: "指标计算",
}));
const __VLS_166 = __VLS_165({
    label: "指标计算",
    value: "指标计算",
}, ...__VLS_functionalComponentArgsRest(__VLS_165));
const __VLS_168 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_169 = __VLS_asFunctionalComponent(__VLS_168, new __VLS_168({
    label: "数据抽取",
    value: "数据抽取",
}));
const __VLS_170 = __VLS_169({
    label: "数据抽取",
    value: "数据抽取",
}, ...__VLS_functionalComponentArgsRest(__VLS_169));
var __VLS_159;
var __VLS_155;
var __VLS_151;
const __VLS_172 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_173 = __VLS_asFunctionalComponent(__VLS_172, new __VLS_172({
    span: (8),
}));
const __VLS_174 = __VLS_173({
    span: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_173));
__VLS_175.slots.default;
const __VLS_176 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_177 = __VLS_asFunctionalComponent(__VLS_176, new __VLS_176({
    label: "接入鉴权",
}));
const __VLS_178 = __VLS_177({
    label: "接入鉴权",
}, ...__VLS_functionalComponentArgsRest(__VLS_177));
__VLS_179.slots.default;
const __VLS_180 = {}.ElSwitch;
/** @type {[typeof __VLS_components.ElSwitch, typeof __VLS_components.elSwitch, ]} */ ;
// @ts-ignore
const __VLS_181 = __VLS_asFunctionalComponent(__VLS_180, new __VLS_180({
    modelValue: (__VLS_ctx.serviceForm.auth),
    activeText: "启用",
    inactiveText: "停用",
}));
const __VLS_182 = __VLS_181({
    modelValue: (__VLS_ctx.serviceForm.auth),
    activeText: "启用",
    inactiveText: "停用",
}, ...__VLS_functionalComponentArgsRest(__VLS_181));
var __VLS_179;
var __VLS_175;
var __VLS_83;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "rule-section-title" },
});
(__VLS_ctx.serviceForm.params.length);
const __VLS_184 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_185 = __VLS_asFunctionalComponent(__VLS_184, new __VLS_184({
    data: (__VLS_ctx.serviceForm.params),
    size: "small",
    border: true,
}));
const __VLS_186 = __VLS_185({
    data: (__VLS_ctx.serviceForm.params),
    size: "small",
    border: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_185));
__VLS_187.slots.default;
const __VLS_188 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_189 = __VLS_asFunctionalComponent(__VLS_188, new __VLS_188({
    label: "参数名",
    minWidth: "120",
}));
const __VLS_190 = __VLS_189({
    label: "参数名",
    minWidth: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_189));
__VLS_191.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_191.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_192 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_193 = __VLS_asFunctionalComponent(__VLS_192, new __VLS_192({
        modelValue: (row.name),
        size: "small",
        placeholder: "如 line_code",
    }));
    const __VLS_194 = __VLS_193({
        modelValue: (row.name),
        size: "small",
        placeholder: "如 line_code",
    }, ...__VLS_functionalComponentArgsRest(__VLS_193));
}
var __VLS_191;
const __VLS_196 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_197 = __VLS_asFunctionalComponent(__VLS_196, new __VLS_196({
    label: "类型",
    width: "110",
}));
const __VLS_198 = __VLS_197({
    label: "类型",
    width: "110",
}, ...__VLS_functionalComponentArgsRest(__VLS_197));
__VLS_199.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_199.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_200 = {}.ElSelect;
    /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
    // @ts-ignore
    const __VLS_201 = __VLS_asFunctionalComponent(__VLS_200, new __VLS_200({
        modelValue: (row.type),
        size: "small",
        ...{ class: "w-full" },
    }));
    const __VLS_202 = __VLS_201({
        modelValue: (row.type),
        size: "small",
        ...{ class: "w-full" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_201));
    __VLS_203.slots.default;
    for (const [t] of __VLS_getVForSourceType((__VLS_ctx.typeOptions))) {
        const __VLS_204 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_205 = __VLS_asFunctionalComponent(__VLS_204, new __VLS_204({
            key: (t),
            label: (t),
            value: (t),
        }));
        const __VLS_206 = __VLS_205({
            key: (t),
            label: (t),
            value: (t),
        }, ...__VLS_functionalComponentArgsRest(__VLS_205));
    }
    var __VLS_203;
}
var __VLS_199;
const __VLS_208 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_209 = __VLS_asFunctionalComponent(__VLS_208, new __VLS_208({
    label: "必填",
    width: "70",
    align: "center",
}));
const __VLS_210 = __VLS_209({
    label: "必填",
    width: "70",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_209));
__VLS_211.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_211.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_212 = {}.ElSwitch;
    /** @type {[typeof __VLS_components.ElSwitch, typeof __VLS_components.elSwitch, ]} */ ;
    // @ts-ignore
    const __VLS_213 = __VLS_asFunctionalComponent(__VLS_212, new __VLS_212({
        modelValue: (row.required),
        size: "small",
    }));
    const __VLS_214 = __VLS_213({
        modelValue: (row.required),
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_213));
}
var __VLS_211;
const __VLS_216 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_217 = __VLS_asFunctionalComponent(__VLS_216, new __VLS_216({
    label: "说明",
    minWidth: "140",
}));
const __VLS_218 = __VLS_217({
    label: "说明",
    minWidth: "140",
}, ...__VLS_functionalComponentArgsRest(__VLS_217));
__VLS_219.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_219.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_220 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_221 = __VLS_asFunctionalComponent(__VLS_220, new __VLS_220({
        modelValue: (row.desc),
        size: "small",
        placeholder: "参数说明",
    }));
    const __VLS_222 = __VLS_221({
        modelValue: (row.desc),
        size: "small",
        placeholder: "参数说明",
    }, ...__VLS_functionalComponentArgsRest(__VLS_221));
}
var __VLS_219;
const __VLS_224 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_225 = __VLS_asFunctionalComponent(__VLS_224, new __VLS_224({
    label: "操作",
    width: "56",
    align: "center",
}));
const __VLS_226 = __VLS_225({
    label: "操作",
    width: "56",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_225));
__VLS_227.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_227.slots;
    const [{ $index }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_228 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_229 = __VLS_asFunctionalComponent(__VLS_228, new __VLS_228({
        ...{ 'onClick': {} },
        type: "danger",
        link: true,
        icon: (__VLS_ctx.Delete),
    }));
    const __VLS_230 = __VLS_229({
        ...{ 'onClick': {} },
        type: "danger",
        link: true,
        icon: (__VLS_ctx.Delete),
    }, ...__VLS_functionalComponentArgsRest(__VLS_229));
    let __VLS_232;
    let __VLS_233;
    let __VLS_234;
    const __VLS_235 = {
        onClick: (...[$event]) => {
            __VLS_ctx.serviceForm.params.splice($index, 1);
        }
    };
    var __VLS_231;
}
var __VLS_227;
var __VLS_187;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "form-actions" },
});
const __VLS_236 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_237 = __VLS_asFunctionalComponent(__VLS_236, new __VLS_236({
    ...{ 'onClick': {} },
    size: "small",
    type: "primary",
    plain: true,
    icon: (__VLS_ctx.Plus),
}));
const __VLS_238 = __VLS_237({
    ...{ 'onClick': {} },
    size: "small",
    type: "primary",
    plain: true,
    icon: (__VLS_ctx.Plus),
}, ...__VLS_functionalComponentArgsRest(__VLS_237));
let __VLS_240;
let __VLS_241;
let __VLS_242;
const __VLS_243 = {
    onClick: (...[$event]) => {
        __VLS_ctx.addParam(false);
    }
};
__VLS_239.slots.default;
var __VLS_239;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "rule-section-title" },
});
(__VLS_ctx.serviceForm.outputs.length);
const __VLS_244 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_245 = __VLS_asFunctionalComponent(__VLS_244, new __VLS_244({
    data: (__VLS_ctx.serviceForm.outputs),
    size: "small",
    border: true,
}));
const __VLS_246 = __VLS_245({
    data: (__VLS_ctx.serviceForm.outputs),
    size: "small",
    border: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_245));
__VLS_247.slots.default;
const __VLS_248 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_249 = __VLS_asFunctionalComponent(__VLS_248, new __VLS_248({
    label: "字段名",
    minWidth: "120",
}));
const __VLS_250 = __VLS_249({
    label: "字段名",
    minWidth: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_249));
__VLS_251.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_251.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_252 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_253 = __VLS_asFunctionalComponent(__VLS_252, new __VLS_252({
        modelValue: (row.name),
        size: "small",
        placeholder: "如 total_amount",
    }));
    const __VLS_254 = __VLS_253({
        modelValue: (row.name),
        size: "small",
        placeholder: "如 total_amount",
    }, ...__VLS_functionalComponentArgsRest(__VLS_253));
}
var __VLS_251;
const __VLS_256 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_257 = __VLS_asFunctionalComponent(__VLS_256, new __VLS_256({
    label: "类型",
    width: "110",
}));
const __VLS_258 = __VLS_257({
    label: "类型",
    width: "110",
}, ...__VLS_functionalComponentArgsRest(__VLS_257));
__VLS_259.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_259.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_260 = {}.ElSelect;
    /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
    // @ts-ignore
    const __VLS_261 = __VLS_asFunctionalComponent(__VLS_260, new __VLS_260({
        modelValue: (row.type),
        size: "small",
        ...{ class: "w-full" },
    }));
    const __VLS_262 = __VLS_261({
        modelValue: (row.type),
        size: "small",
        ...{ class: "w-full" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_261));
    __VLS_263.slots.default;
    for (const [t] of __VLS_getVForSourceType((__VLS_ctx.typeOptions))) {
        const __VLS_264 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_265 = __VLS_asFunctionalComponent(__VLS_264, new __VLS_264({
            key: (t),
            label: (t),
            value: (t),
        }));
        const __VLS_266 = __VLS_265({
            key: (t),
            label: (t),
            value: (t),
        }, ...__VLS_functionalComponentArgsRest(__VLS_265));
    }
    var __VLS_263;
}
var __VLS_259;
const __VLS_268 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_269 = __VLS_asFunctionalComponent(__VLS_268, new __VLS_268({
    label: "别名",
    minWidth: "140",
}));
const __VLS_270 = __VLS_269({
    label: "别名",
    minWidth: "140",
}, ...__VLS_functionalComponentArgsRest(__VLS_269));
__VLS_271.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_271.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_272 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_273 = __VLS_asFunctionalComponent(__VLS_272, new __VLS_272({
        modelValue: (row.alias),
        size: "small",
        placeholder: "返回字段别名",
    }));
    const __VLS_274 = __VLS_273({
        modelValue: (row.alias),
        size: "small",
        placeholder: "返回字段别名",
    }, ...__VLS_functionalComponentArgsRest(__VLS_273));
}
var __VLS_271;
const __VLS_276 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_277 = __VLS_asFunctionalComponent(__VLS_276, new __VLS_276({
    label: "操作",
    width: "56",
    align: "center",
}));
const __VLS_278 = __VLS_277({
    label: "操作",
    width: "56",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_277));
__VLS_279.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_279.slots;
    const [{ $index }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_280 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_281 = __VLS_asFunctionalComponent(__VLS_280, new __VLS_280({
        ...{ 'onClick': {} },
        type: "danger",
        link: true,
        icon: (__VLS_ctx.Delete),
    }));
    const __VLS_282 = __VLS_281({
        ...{ 'onClick': {} },
        type: "danger",
        link: true,
        icon: (__VLS_ctx.Delete),
    }, ...__VLS_functionalComponentArgsRest(__VLS_281));
    let __VLS_284;
    let __VLS_285;
    let __VLS_286;
    const __VLS_287 = {
        onClick: (...[$event]) => {
            __VLS_ctx.serviceForm.outputs.splice($index, 1);
        }
    };
    var __VLS_283;
}
var __VLS_279;
var __VLS_247;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "form-actions" },
});
const __VLS_288 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_289 = __VLS_asFunctionalComponent(__VLS_288, new __VLS_288({
    ...{ 'onClick': {} },
    size: "small",
    type: "primary",
    plain: true,
    icon: (__VLS_ctx.Plus),
}));
const __VLS_290 = __VLS_289({
    ...{ 'onClick': {} },
    size: "small",
    type: "primary",
    plain: true,
    icon: (__VLS_ctx.Plus),
}, ...__VLS_functionalComponentArgsRest(__VLS_289));
let __VLS_292;
let __VLS_293;
let __VLS_294;
const __VLS_295 = {
    onClick: (...[$event]) => {
        __VLS_ctx.addParam(true);
    }
};
__VLS_291.slots.default;
var __VLS_291;
const __VLS_296 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_297 = __VLS_asFunctionalComponent(__VLS_296, new __VLS_296({
    label: "自定义SQL逻辑",
}));
const __VLS_298 = __VLS_297({
    label: "自定义SQL逻辑",
}, ...__VLS_functionalComponentArgsRest(__VLS_297));
__VLS_299.slots.default;
const __VLS_300 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_301 = __VLS_asFunctionalComponent(__VLS_300, new __VLS_300({
    modelValue: (__VLS_ctx.serviceForm.sql),
    type: "textarea",
    rows: (4),
    ...{ class: "sql-editor" },
    spellcheck: "false",
    placeholder: "SELECT line_code, SUM(amount) AS total_amount FROM ticket_sale WHERE line_code = #{line_code} GROUP BY line_code",
}));
const __VLS_302 = __VLS_301({
    modelValue: (__VLS_ctx.serviceForm.sql),
    type: "textarea",
    rows: (4),
    ...{ class: "sql-editor" },
    spellcheck: "false",
    placeholder: "SELECT line_code, SUM(amount) AS total_amount FROM ticket_sale WHERE line_code = #{line_code} GROUP BY line_code",
}, ...__VLS_functionalComponentArgsRest(__VLS_301));
var __VLS_299;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "preview-step" },
});
__VLS_asFunctionalDirective(__VLS_directives.vShow)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.activeStep === 2) }, null, null);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "api-preview" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "api-preview-row" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "api-label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.code, __VLS_intrinsicElements.code)({
    ...{ class: "api-value" },
});
(__VLS_ctx.baseUrl);
(__VLS_ctx.serviceForm.path);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "api-preview-row" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "api-label" },
});
const __VLS_304 = {}.ElTag;
/** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
// @ts-ignore
const __VLS_305 = __VLS_asFunctionalComponent(__VLS_304, new __VLS_304({
    size: "small",
    type: "danger",
    effect: "dark",
}));
const __VLS_306 = __VLS_305({
    size: "small",
    type: "danger",
    effect: "dark",
}, ...__VLS_functionalComponentArgsRest(__VLS_305));
__VLS_307.slots.default;
(__VLS_ctx.serviceForm.method);
var __VLS_307;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "api-preview-row" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "api-label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "dep-text" },
});
(__VLS_ctx.serviceForm.auth ? 'AppKey/Secret + HMAC-SHA256 签名' : '免鉴权（公开服务）');
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "api-preview-row" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "api-label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "dep-text" },
});
(__VLS_ctx.selectedAsset?.name);
(__VLS_ctx.selectedAsset?.classified);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "api-preview-row" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "api-label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.pre, __VLS_intrinsicElements.pre)({
    ...{ class: "api-code" },
});
(__VLS_ctx.requestSample);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "step-actions" },
});
if (__VLS_ctx.activeStep > 0) {
    const __VLS_308 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_309 = __VLS_asFunctionalComponent(__VLS_308, new __VLS_308({
        ...{ 'onClick': {} },
    }));
    const __VLS_310 = __VLS_309({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_309));
    let __VLS_312;
    let __VLS_313;
    let __VLS_314;
    const __VLS_315 = {
        onClick: (...[$event]) => {
            if (!(__VLS_ctx.activeStep > 0))
                return;
            __VLS_ctx.activeStep--;
        }
    };
    __VLS_311.slots.default;
    var __VLS_311;
}
if (__VLS_ctx.activeStep === 0) {
    const __VLS_316 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_317 = __VLS_asFunctionalComponent(__VLS_316, new __VLS_316({
        ...{ 'onClick': {} },
        type: "primary",
        disabled: (!__VLS_ctx.selectedAsset),
    }));
    const __VLS_318 = __VLS_317({
        ...{ 'onClick': {} },
        type: "primary",
        disabled: (!__VLS_ctx.selectedAsset),
    }, ...__VLS_functionalComponentArgsRest(__VLS_317));
    let __VLS_320;
    let __VLS_321;
    let __VLS_322;
    const __VLS_323 = {
        onClick: (...[$event]) => {
            if (!(__VLS_ctx.activeStep === 0))
                return;
            __VLS_ctx.activeStep++;
        }
    };
    __VLS_319.slots.default;
    var __VLS_319;
}
if (__VLS_ctx.activeStep === 1) {
    const __VLS_324 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_325 = __VLS_asFunctionalComponent(__VLS_324, new __VLS_324({
        ...{ 'onClick': {} },
        type: "primary",
    }));
    const __VLS_326 = __VLS_325({
        ...{ 'onClick': {} },
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_325));
    let __VLS_328;
    let __VLS_329;
    let __VLS_330;
    const __VLS_331 = {
        onClick: (__VLS_ctx.validateConfig)
    };
    __VLS_327.slots.default;
    var __VLS_327;
}
if (__VLS_ctx.activeStep === 2) {
    const __VLS_332 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_333 = __VLS_asFunctionalComponent(__VLS_332, new __VLS_332({
        ...{ 'onClick': {} },
        size: "small",
    }));
    const __VLS_334 = __VLS_333({
        ...{ 'onClick': {} },
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_333));
    let __VLS_336;
    let __VLS_337;
    let __VLS_338;
    const __VLS_339 = {
        onClick: (...[$event]) => {
            if (!(__VLS_ctx.activeStep === 2))
                return;
            __VLS_ctx.saveService('草稿');
        }
    };
    __VLS_335.slots.default;
    var __VLS_335;
}
if (__VLS_ctx.activeStep === 2) {
    const __VLS_340 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_341 = __VLS_asFunctionalComponent(__VLS_340, new __VLS_340({
        ...{ 'onClick': {} },
        type: "danger",
        size: "small",
    }));
    const __VLS_342 = __VLS_341({
        ...{ 'onClick': {} },
        type: "danger",
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_341));
    let __VLS_344;
    let __VLS_345;
    let __VLS_346;
    const __VLS_347 = {
        onClick: (...[$event]) => {
            if (!(__VLS_ctx.activeStep === 2))
                return;
            __VLS_ctx.saveService('待发布');
        }
    };
    __VLS_343.slots.default;
    var __VLS_343;
}
var __VLS_11;
var __VLS_7;
const __VLS_348 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_349 = __VLS_asFunctionalComponent(__VLS_348, new __VLS_348({
    span: (9),
}));
const __VLS_350 = __VLS_349({
    span: (9),
}, ...__VLS_functionalComponentArgsRest(__VLS_349));
__VLS_351.slots.default;
const __VLS_352 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_353 = __VLS_asFunctionalComponent(__VLS_352, new __VLS_352({
    ...{ class: "panel-card" },
    shadow: "never",
}));
const __VLS_354 = __VLS_353({
    ...{ class: "panel-card" },
    shadow: "never",
}, ...__VLS_functionalComponentArgsRest(__VLS_353));
__VLS_355.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_355.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-actions" },
    });
    const __VLS_356 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_357 = __VLS_asFunctionalComponent(__VLS_356, new __VLS_356({
        size: "small",
        type: "info",
        effect: "plain",
    }));
    const __VLS_358 = __VLS_357({
        size: "small",
        type: "info",
        effect: "plain",
    }, ...__VLS_functionalComponentArgsRest(__VLS_357));
    __VLS_359.slots.default;
    (__VLS_ctx.registrations.length);
    var __VLS_359;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "toolbar-row" },
});
const __VLS_360 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_361 = __VLS_asFunctionalComponent(__VLS_360, new __VLS_360({
    modelValue: (__VLS_ctx.regKeyword),
    placeholder: "按服务名称 / 路径搜索",
    clearable: true,
    ...{ class: "search-input-sm" },
    prefixIcon: (__VLS_ctx.Search),
}));
const __VLS_362 = __VLS_361({
    modelValue: (__VLS_ctx.regKeyword),
    placeholder: "按服务名称 / 路径搜索",
    clearable: true,
    ...{ class: "search-input-sm" },
    prefixIcon: (__VLS_ctx.Search),
}, ...__VLS_functionalComponentArgsRest(__VLS_361));
const __VLS_364 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_365 = __VLS_asFunctionalComponent(__VLS_364, new __VLS_364({
    modelValue: (__VLS_ctx.regStatus),
    placeholder: "状态",
    clearable: true,
    ...{ class: "filter-select-sm" },
}));
const __VLS_366 = __VLS_365({
    modelValue: (__VLS_ctx.regStatus),
    placeholder: "状态",
    clearable: true,
    ...{ class: "filter-select-sm" },
}, ...__VLS_functionalComponentArgsRest(__VLS_365));
__VLS_367.slots.default;
for (const [s] of __VLS_getVForSourceType((['草稿', '待发布', '已发布', '已驳回']))) {
    const __VLS_368 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_369 = __VLS_asFunctionalComponent(__VLS_368, new __VLS_368({
        key: (s),
        label: (s),
        value: (s),
    }));
    const __VLS_370 = __VLS_369({
        key: (s),
        label: (s),
        value: (s),
    }, ...__VLS_functionalComponentArgsRest(__VLS_369));
}
var __VLS_367;
const __VLS_372 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_373 = __VLS_asFunctionalComponent(__VLS_372, new __VLS_372({
    data: (__VLS_ctx.filteredRegistrations),
    size: "small",
    stripe: true,
    maxHeight: "520",
}));
const __VLS_374 = __VLS_373({
    data: (__VLS_ctx.filteredRegistrations),
    size: "small",
    stripe: true,
    maxHeight: "520",
}, ...__VLS_functionalComponentArgsRest(__VLS_373));
__VLS_375.slots.default;
const __VLS_376 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_377 = __VLS_asFunctionalComponent(__VLS_376, new __VLS_376({
    prop: "name",
    label: "服务名称",
    minWidth: "130",
    showOverflowTooltip: true,
}));
const __VLS_378 = __VLS_377({
    prop: "name",
    label: "服务名称",
    minWidth: "130",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_377));
const __VLS_380 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_381 = __VLS_asFunctionalComponent(__VLS_380, new __VLS_380({
    prop: "path",
    label: "服务路径",
    minWidth: "150",
    showOverflowTooltip: true,
}));
const __VLS_382 = __VLS_381({
    prop: "path",
    label: "服务路径",
    minWidth: "150",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_381));
const __VLS_384 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_385 = __VLS_asFunctionalComponent(__VLS_384, new __VLS_384({
    prop: "asset",
    label: "封装资产",
    width: "90",
    showOverflowTooltip: true,
}));
const __VLS_386 = __VLS_385({
    prop: "asset",
    label: "封装资产",
    width: "90",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_385));
const __VLS_388 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_389 = __VLS_asFunctionalComponent(__VLS_388, new __VLS_388({
    label: "状态",
    width: "80",
}));
const __VLS_390 = __VLS_389({
    label: "状态",
    width: "80",
}, ...__VLS_functionalComponentArgsRest(__VLS_389));
__VLS_391.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_391.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_392 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_393 = __VLS_asFunctionalComponent(__VLS_392, new __VLS_392({
        size: "small",
        type: (__VLS_ctx.regStatusTag[row.status]),
        effect: "dark",
    }));
    const __VLS_394 = __VLS_393({
        size: "small",
        type: (__VLS_ctx.regStatusTag[row.status]),
        effect: "dark",
    }, ...__VLS_functionalComponentArgsRest(__VLS_393));
    __VLS_395.slots.default;
    (row.status);
    var __VLS_395;
}
var __VLS_391;
const __VLS_396 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_397 = __VLS_asFunctionalComponent(__VLS_396, new __VLS_396({
    prop: "updateTime",
    label: "更新时间",
    width: "100",
}));
const __VLS_398 = __VLS_397({
    prop: "updateTime",
    label: "更新时间",
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_397));
const __VLS_400 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_401 = __VLS_asFunctionalComponent(__VLS_400, new __VLS_400({
    label: "操作",
    width: "140",
    fixed: "right",
}));
const __VLS_402 = __VLS_401({
    label: "操作",
    width: "140",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_401));
__VLS_403.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_403.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_404 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_405 = __VLS_asFunctionalComponent(__VLS_404, new __VLS_404({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
        size: "small",
    }));
    const __VLS_406 = __VLS_405({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_405));
    let __VLS_408;
    let __VLS_409;
    let __VLS_410;
    const __VLS_411 = {
        onClick: (...[$event]) => {
            __VLS_ctx.editService(row);
        }
    };
    __VLS_407.slots.default;
    var __VLS_407;
    if (row.status === '草稿') {
        const __VLS_412 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_413 = __VLS_asFunctionalComponent(__VLS_412, new __VLS_412({
            ...{ 'onClick': {} },
            link: true,
            type: "warning",
            size: "small",
        }));
        const __VLS_414 = __VLS_413({
            ...{ 'onClick': {} },
            link: true,
            type: "warning",
            size: "small",
        }, ...__VLS_functionalComponentArgsRest(__VLS_413));
        let __VLS_416;
        let __VLS_417;
        let __VLS_418;
        const __VLS_419 = {
            onClick: (...[$event]) => {
                if (!(row.status === '草稿'))
                    return;
                __VLS_ctx.submitService(row);
            }
        };
        __VLS_415.slots.default;
        var __VLS_415;
    }
    else if (row.status === '待发布') {
        const __VLS_420 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_421 = __VLS_asFunctionalComponent(__VLS_420, new __VLS_420({
            ...{ 'onClick': {} },
            link: true,
            type: "info",
            size: "small",
        }));
        const __VLS_422 = __VLS_421({
            ...{ 'onClick': {} },
            link: true,
            type: "info",
            size: "small",
        }, ...__VLS_functionalComponentArgsRest(__VLS_421));
        let __VLS_424;
        let __VLS_425;
        let __VLS_426;
        const __VLS_427 = {
            onClick: (...[$event]) => {
                if (!!(row.status === '草稿'))
                    return;
                if (!(row.status === '待发布'))
                    return;
                __VLS_ctx.viewDoc(row);
            }
        };
        __VLS_423.slots.default;
        var __VLS_423;
    }
}
var __VLS_403;
var __VLS_375;
var __VLS_355;
var __VLS_351;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['standard-page']} */ ;
/** @type {__VLS_StyleScopedClasses['share-register-page']} */ ;
/** @type {__VLS_StyleScopedClasses['share-stats']} */ ;
/** @type {__VLS_StyleScopedClasses['share-stat']} */ ;
/** @type {__VLS_StyleScopedClasses['share-stat-value']} */ ;
/** @type {__VLS_StyleScopedClasses['share-stat-label']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['register-steps']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-12']} */ ;
/** @type {__VLS_StyleScopedClasses['asset-step']} */ ;
/** @type {__VLS_StyleScopedClasses['asset-type-tabs']} */ ;
/** @type {__VLS_StyleScopedClasses['level-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['asset-tip']} */ ;
/** @type {__VLS_StyleScopedClasses['config-step']} */ ;
/** @type {__VLS_StyleScopedClasses['rule-section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['rule-section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['form-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['rule-section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['form-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['sql-editor']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-step']} */ ;
/** @type {__VLS_StyleScopedClasses['api-preview']} */ ;
/** @type {__VLS_StyleScopedClasses['api-preview-row']} */ ;
/** @type {__VLS_StyleScopedClasses['api-label']} */ ;
/** @type {__VLS_StyleScopedClasses['api-value']} */ ;
/** @type {__VLS_StyleScopedClasses['api-preview-row']} */ ;
/** @type {__VLS_StyleScopedClasses['api-label']} */ ;
/** @type {__VLS_StyleScopedClasses['api-preview-row']} */ ;
/** @type {__VLS_StyleScopedClasses['api-label']} */ ;
/** @type {__VLS_StyleScopedClasses['dep-text']} */ ;
/** @type {__VLS_StyleScopedClasses['api-preview-row']} */ ;
/** @type {__VLS_StyleScopedClasses['api-label']} */ ;
/** @type {__VLS_StyleScopedClasses['dep-text']} */ ;
/** @type {__VLS_StyleScopedClasses['api-preview-row']} */ ;
/** @type {__VLS_StyleScopedClasses['api-label']} */ ;
/** @type {__VLS_StyleScopedClasses['api-code']} */ ;
/** @type {__VLS_StyleScopedClasses['step-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['toolbar-row']} */ ;
/** @type {__VLS_StyleScopedClasses['search-input-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-select-sm']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Delete: Delete,
            Plus: Plus,
            Search: Search,
            stepTitles: stepTitles,
            activeStep: activeStep,
            assetType: assetType,
            baseUrl: baseUrl,
            levelColor: levelColor,
            domainOptions: domainOptions,
            typeOptions: typeOptions,
            statsCards: statsCards,
            filteredAssets: filteredAssets,
            selectedAsset: selectedAsset,
            selectAsset: selectAsset,
            serviceForm: serviceForm,
            addParam: addParam,
            requestSample: requestSample,
            validateConfig: validateConfig,
            regStatusTag: regStatusTag,
            registrations: registrations,
            regKeyword: regKeyword,
            regStatus: regStatus,
            filteredRegistrations: filteredRegistrations,
            saveService: saveService,
            editService: editService,
            submitService: submitService,
            viewDoc: viewDoc,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
