import { computed, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { Download, Right, Share, Tickets } from '@element-plus/icons-vue';
const activeTab = ref('overview');
const asset = {
    name: 'ads_line_flow（线网客流指标）',
    type: '汇总指标资产',
    owner: '张工',
    domain: '运营调度',
    code: 'GWIS-SWG-2026-0012',
    status: '已发布',
    sensitive: true,
    rows: '2,360',
    fields: 24,
    qualityScore: '92.6',
    upstream: 4,
    downstream: 6,
    engine: 'Doris（MPP）',
    lastCollect: '2026-08-13 02:00',
    size: '1.2 TB',
    frequency: '每 30 分钟',
    retention: '24 个月',
    related: '客流分析数据集',
    upstreams: ['dws_ticket_daily', 'ods_station_flow', 'dim_station_info', 'dim_line_info'],
    downstreams: ['客流统计查询服务', '月度客流分析报表', '线网规划仿真系统', '车站大屏展示端', '运力调度决策平台', '外部科研合作方'],
};
const fields = [
    { colName: 'line_code', colType: 'VARCHAR(16)', comment: '线路编码', pk: true },
    { colName: 'station_code', colType: 'VARCHAR(16)', comment: '站点编码', pk: true },
    { colName: 'period', colType: 'VARCHAR(20)', comment: '统计区间', pk: true },
    { colName: 'total_passengers', colType: 'BIGINT', comment: '客流量', pk: false },
    { colName: 'peak_cnt', colType: 'BIGINT', comment: '高峰期客流', pk: false },
    { colName: 'congestion', colType: 'DECIMAL(5,2)', comment: '拥挤度指数', pk: false },
    { colName: 'update_time', colType: 'DATETIME', comment: '更新时间', pk: false },
];
const structureFilter = ref('');
const filteredFields = computed(() => (structureFilter.value === '全部字段' || !structureFilter.value ? fields : fields));
const qualityIssues = [
    { rule: '完整性-必填字段非空', level: '一般', type: 'warning', cnt: 8, status: '待修复' },
    { rule: '准确性-客流阈值校验', level: '严重', type: 'danger', cnt: 3, status: '待修复' },
    { rule: '一致性-线路编码参照', level: '严重', type: 'danger', cnt: 1, status: '已修复' },
];
const standardMaps = [
    { field: 'line_code', std: '线路编码数据元标准', stdType: '基础类', ok: true },
    { field: 'station_code', std: '站点编码数据元标准', stdType: '基础类', ok: true },
    { field: 'total_passengers', std: '客流指标口径标准', stdType: '指标类', ok: false },
    { field: 'update_time', std: '时间格式规范', stdType: '格式类', ok: true },
];
const authActors = ['数据平台管理员（读写）', '运营调度组（只读）', 'BI 报表服务账户（只读）', '客流分析平台（订阅）', '审计账户（只读）'];
const shareServices = [
    { svcName: '客流统计查询服务', svcType: 'RESTful API', callers: '车站大屏、客流分析平台', online: true },
    { svcName: '客流数据共享目录项', svcType: '数据集共享', callers: '线网规划仿真系统', online: true },
    { svcName: '旧版点查接口', svcType: 'RESTful API', callers: '历史遗留应用', online: false },
];
const openShare = () => ElMessage.info('已进入共享申请流程（Mock）');
const downloadAsset = () => ElMessage.success('资产信息已导出（Mock）');
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "standard-page asset-detail-page" },
});
const __VLS_0 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ class: "panel-card asset-head-card" },
    shadow: "never",
}));
const __VLS_2 = __VLS_1({
    ...{ class: "panel-card asset-head-card" },
    shadow: "never",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "asset-head" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "asset-icon" },
});
const __VLS_4 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    size: (28),
}));
const __VLS_6 = __VLS_5({
    size: (28),
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
__VLS_7.slots.default;
const __VLS_8 = {}.Tickets;
/** @type {[typeof __VLS_components.Tickets, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({}));
const __VLS_10 = __VLS_9({}, ...__VLS_functionalComponentArgsRest(__VLS_9));
var __VLS_7;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "asset-info" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "asset-title-row" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "asset-name" },
});
(__VLS_ctx.asset.name);
if (__VLS_ctx.asset.sensitive) {
    const __VLS_12 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
        type: "danger",
        effect: "dark",
        size: "small",
    }));
    const __VLS_14 = __VLS_13({
        type: "danger",
        effect: "dark",
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_13));
    __VLS_15.slots.default;
    var __VLS_15;
}
const __VLS_16 = {}.ElTag;
/** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    type: "success",
    effect: "plain",
    size: "small",
}));
const __VLS_18 = __VLS_17({
    type: "success",
    effect: "plain",
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
__VLS_19.slots.default;
(__VLS_ctx.asset.status);
var __VLS_19;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "asset-meta" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
(__VLS_ctx.asset.type);
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
(__VLS_ctx.asset.owner);
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
(__VLS_ctx.asset.domain);
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
(__VLS_ctx.asset.code);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "asset-actions" },
});
const __VLS_20 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
    ...{ 'onClick': {} },
    type: "danger",
    icon: (__VLS_ctx.Share),
    plain: true,
}));
const __VLS_22 = __VLS_21({
    ...{ 'onClick': {} },
    type: "danger",
    icon: (__VLS_ctx.Share),
    plain: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
let __VLS_24;
let __VLS_25;
let __VLS_26;
const __VLS_27 = {
    onClick: (__VLS_ctx.openShare)
};
__VLS_23.slots.default;
var __VLS_23;
const __VLS_28 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
    ...{ 'onClick': {} },
    icon: (__VLS_ctx.Download),
    plain: true,
}));
const __VLS_30 = __VLS_29({
    ...{ 'onClick': {} },
    icon: (__VLS_ctx.Download),
    plain: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
let __VLS_32;
let __VLS_33;
let __VLS_34;
const __VLS_35 = {
    onClick: (__VLS_ctx.downloadAsset)
};
__VLS_31.slots.default;
var __VLS_31;
var __VLS_3;
const __VLS_36 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    ...{ class: "panel-card" },
    shadow: "never",
}));
const __VLS_38 = __VLS_37({
    ...{ class: "panel-card" },
    shadow: "never",
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
__VLS_39.slots.default;
const __VLS_40 = {}.ElTabs;
/** @type {[typeof __VLS_components.ElTabs, typeof __VLS_components.elTabs, typeof __VLS_components.ElTabs, typeof __VLS_components.elTabs, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
    modelValue: (__VLS_ctx.activeTab),
    ...{ class: "asset-tabs" },
}));
const __VLS_42 = __VLS_41({
    modelValue: (__VLS_ctx.activeTab),
    ...{ class: "asset-tabs" },
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
__VLS_43.slots.default;
const __VLS_44 = {}.ElTabPane;
/** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    label: "概览",
    name: "overview",
}));
const __VLS_46 = __VLS_45({
    label: "概览",
    name: "overview",
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
__VLS_47.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "overview-grid" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "ov-card" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "ov-value" },
    ...{ style: {} },
});
(__VLS_ctx.asset.rows);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "ov-label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "ov-card" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "ov-value" },
    ...{ style: {} },
});
(__VLS_ctx.asset.fields);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "ov-label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "ov-card" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "ov-value" },
    ...{ style: {} },
});
(__VLS_ctx.asset.qualityScore);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "ov-label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "ov-card" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "ov-value" },
    ...{ style: {} },
});
(__VLS_ctx.asset.upstream);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "ov-label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "ov-card" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "ov-value" },
    ...{ style: {} },
});
(__VLS_ctx.asset.downstream);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "ov-label" },
});
const __VLS_48 = {}.ElDescriptions;
/** @type {[typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, ]} */ ;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
    column: (3),
    border: true,
    ...{ class: "mt-16" },
}));
const __VLS_50 = __VLS_49({
    column: (3),
    border: true,
    ...{ class: "mt-16" },
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
__VLS_51.slots.default;
const __VLS_52 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
    label: "存储引擎",
}));
const __VLS_54 = __VLS_53({
    label: "存储引擎",
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
__VLS_55.slots.default;
(__VLS_ctx.asset.engine);
var __VLS_55;
const __VLS_56 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
    label: "最近采集",
}));
const __VLS_58 = __VLS_57({
    label: "最近采集",
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
__VLS_59.slots.default;
(__VLS_ctx.asset.lastCollect);
var __VLS_59;
const __VLS_60 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
    label: "数据规模",
}));
const __VLS_62 = __VLS_61({
    label: "数据规模",
}, ...__VLS_functionalComponentArgsRest(__VLS_61));
__VLS_63.slots.default;
(__VLS_ctx.asset.size);
var __VLS_63;
const __VLS_64 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
    label: "更新频率",
}));
const __VLS_66 = __VLS_65({
    label: "更新频率",
}, ...__VLS_functionalComponentArgsRest(__VLS_65));
__VLS_67.slots.default;
(__VLS_ctx.asset.frequency);
var __VLS_67;
const __VLS_68 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
    label: "保留周期",
}));
const __VLS_70 = __VLS_69({
    label: "保留周期",
}, ...__VLS_functionalComponentArgsRest(__VLS_69));
__VLS_71.slots.default;
(__VLS_ctx.asset.retention);
var __VLS_71;
const __VLS_72 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
    label: "关联数据集",
}));
const __VLS_74 = __VLS_73({
    label: "关联数据集",
}, ...__VLS_functionalComponentArgsRest(__VLS_73));
__VLS_75.slots.default;
(__VLS_ctx.asset.related);
var __VLS_75;
var __VLS_51;
var __VLS_47;
const __VLS_76 = {}.ElTabPane;
/** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
// @ts-ignore
const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
    label: "结构",
    name: "structure",
}));
const __VLS_78 = __VLS_77({
    label: "结构",
    name: "structure",
}, ...__VLS_functionalComponentArgsRest(__VLS_77));
__VLS_79.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "toolbar-row" },
});
const __VLS_80 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
    modelValue: (__VLS_ctx.structureFilter),
    placeholder: "全部字段",
    clearable: true,
    ...{ class: "filter-select" },
}));
const __VLS_82 = __VLS_81({
    modelValue: (__VLS_ctx.structureFilter),
    placeholder: "全部字段",
    clearable: true,
    ...{ class: "filter-select" },
}, ...__VLS_functionalComponentArgsRest(__VLS_81));
__VLS_83.slots.default;
for (const [t] of __VLS_getVForSourceType((['全部字段', '标识字段', '属性字段', '时间字段']))) {
    const __VLS_84 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
        key: (t),
        label: (t),
        value: (t),
    }));
    const __VLS_86 = __VLS_85({
        key: (t),
        label: (t),
        value: (t),
    }, ...__VLS_functionalComponentArgsRest(__VLS_85));
}
var __VLS_83;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "dep-text" },
});
(__VLS_ctx.fields.length);
const __VLS_88 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
    data: (__VLS_ctx.filteredFields),
    size: "small",
    stripe: true,
    ...{ class: "mt-12" },
}));
const __VLS_90 = __VLS_89({
    data: (__VLS_ctx.filteredFields),
    size: "small",
    stripe: true,
    ...{ class: "mt-12" },
}, ...__VLS_functionalComponentArgsRest(__VLS_89));
__VLS_91.slots.default;
const __VLS_92 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
    type: "index",
    label: "#",
    width: "46",
}));
const __VLS_94 = __VLS_93({
    type: "index",
    label: "#",
    width: "46",
}, ...__VLS_functionalComponentArgsRest(__VLS_93));
const __VLS_96 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
    prop: "colName",
    label: "字段名",
    minWidth: "140",
}));
const __VLS_98 = __VLS_97({
    prop: "colName",
    label: "字段名",
    minWidth: "140",
}, ...__VLS_functionalComponentArgsRest(__VLS_97));
const __VLS_100 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
    prop: "colType",
    label: "数据类型",
    width: "120",
}));
const __VLS_102 = __VLS_101({
    prop: "colType",
    label: "数据类型",
    width: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_101));
const __VLS_104 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
    prop: "comment",
    label: "说明",
    minWidth: "160",
}));
const __VLS_106 = __VLS_105({
    prop: "comment",
    label: "说明",
    minWidth: "160",
}, ...__VLS_functionalComponentArgsRest(__VLS_105));
const __VLS_108 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
    label: "主键",
    width: "70",
    align: "center",
}));
const __VLS_110 = __VLS_109({
    label: "主键",
    width: "70",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_109));
__VLS_111.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_111.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    if (row.pk) {
        const __VLS_112 = {}.ElTag;
        /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
        // @ts-ignore
        const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
            type: "danger",
            size: "small",
            effect: "dark",
        }));
        const __VLS_114 = __VLS_113({
            type: "danger",
            size: "small",
            effect: "dark",
        }, ...__VLS_functionalComponentArgsRest(__VLS_113));
        __VLS_115.slots.default;
        var __VLS_115;
    }
}
var __VLS_111;
var __VLS_91;
var __VLS_79;
const __VLS_116 = {}.ElTabPane;
/** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
// @ts-ignore
const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
    label: "质量",
    name: "quality",
}));
const __VLS_118 = __VLS_117({
    label: "质量",
    name: "quality",
}, ...__VLS_functionalComponentArgsRest(__VLS_117));
__VLS_119.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "quality-grid" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "q-card" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "q-num" },
    ...{ style: {} },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "q-label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "q-card" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "q-num" },
    ...{ style: {} },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "q-label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "q-card" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "q-num" },
    ...{ style: {} },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "q-label" },
});
const __VLS_120 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({
    ...{ class: "panel-card mt-16 q-detail" },
    shadow: "never",
}));
const __VLS_122 = __VLS_121({
    ...{ class: "panel-card mt-16 q-detail" },
    shadow: "never",
}, ...__VLS_functionalComponentArgsRest(__VLS_121));
__VLS_123.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_123.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
}
const __VLS_124 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({
    data: (__VLS_ctx.qualityIssues),
    size: "small",
}));
const __VLS_126 = __VLS_125({
    data: (__VLS_ctx.qualityIssues),
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_125));
__VLS_127.slots.default;
const __VLS_128 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({
    prop: "rule",
    label: "质量规则",
    minWidth: "150",
}));
const __VLS_130 = __VLS_129({
    prop: "rule",
    label: "质量规则",
    minWidth: "150",
}, ...__VLS_functionalComponentArgsRest(__VLS_129));
const __VLS_132 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132({
    prop: "level",
    label: "严重级别",
    width: "90",
}));
const __VLS_134 = __VLS_133({
    prop: "level",
    label: "严重级别",
    width: "90",
}, ...__VLS_functionalComponentArgsRest(__VLS_133));
__VLS_135.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_135.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_136 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_137 = __VLS_asFunctionalComponent(__VLS_136, new __VLS_136({
        size: "small",
        type: (row.type),
        effect: "dark",
    }));
    const __VLS_138 = __VLS_137({
        size: "small",
        type: (row.type),
        effect: "dark",
    }, ...__VLS_functionalComponentArgsRest(__VLS_137));
    __VLS_139.slots.default;
    (row.level);
    var __VLS_139;
}
var __VLS_135;
const __VLS_140 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_141 = __VLS_asFunctionalComponent(__VLS_140, new __VLS_140({
    prop: "cnt",
    label: "影响记录数",
    width: "100",
    align: "right",
}));
const __VLS_142 = __VLS_141({
    prop: "cnt",
    label: "影响记录数",
    width: "100",
    align: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_141));
const __VLS_144 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_145 = __VLS_asFunctionalComponent(__VLS_144, new __VLS_144({
    prop: "status",
    label: "状态",
    width: "90",
}));
const __VLS_146 = __VLS_145({
    prop: "status",
    label: "状态",
    width: "90",
}, ...__VLS_functionalComponentArgsRest(__VLS_145));
__VLS_147.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_147.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: (row.status === '已修复' ? 'trend-positive' : 'trend-negative') },
    });
    (row.status);
}
var __VLS_147;
var __VLS_127;
var __VLS_123;
var __VLS_119;
const __VLS_148 = {}.ElTabPane;
/** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
// @ts-ignore
const __VLS_149 = __VLS_asFunctionalComponent(__VLS_148, new __VLS_148({
    label: "血缘",
    name: "lineage",
}));
const __VLS_150 = __VLS_149({
    label: "血缘",
    name: "lineage",
}, ...__VLS_functionalComponentArgsRest(__VLS_149));
__VLS_151.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "lineage-row" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "lg-node lg-up" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "lg-title" },
});
for (const [u] of __VLS_getVForSourceType((__VLS_ctx.asset.upstreams))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (u),
        ...{ class: "lg-item" },
    });
    (u);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "lg-arrow" },
});
const __VLS_152 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_153 = __VLS_asFunctionalComponent(__VLS_152, new __VLS_152({}));
const __VLS_154 = __VLS_153({}, ...__VLS_functionalComponentArgsRest(__VLS_153));
__VLS_155.slots.default;
const __VLS_156 = {}.Right;
/** @type {[typeof __VLS_components.Right, ]} */ ;
// @ts-ignore
const __VLS_157 = __VLS_asFunctionalComponent(__VLS_156, new __VLS_156({}));
const __VLS_158 = __VLS_157({}, ...__VLS_functionalComponentArgsRest(__VLS_157));
var __VLS_155;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "lg-node lg-self" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "lg-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "lg-item lg-strong" },
});
(__VLS_ctx.asset.name);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "lg-arrow" },
});
const __VLS_160 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_161 = __VLS_asFunctionalComponent(__VLS_160, new __VLS_160({}));
const __VLS_162 = __VLS_161({}, ...__VLS_functionalComponentArgsRest(__VLS_161));
__VLS_163.slots.default;
const __VLS_164 = {}.Right;
/** @type {[typeof __VLS_components.Right, ]} */ ;
// @ts-ignore
const __VLS_165 = __VLS_asFunctionalComponent(__VLS_164, new __VLS_164({}));
const __VLS_166 = __VLS_165({}, ...__VLS_functionalComponentArgsRest(__VLS_165));
var __VLS_163;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "lg-node lg-down" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "lg-title" },
});
for (const [d] of __VLS_getVForSourceType((__VLS_ctx.asset.downstreams))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (d),
        ...{ class: "lg-item" },
    });
    (d);
}
var __VLS_151;
const __VLS_168 = {}.ElTabPane;
/** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
// @ts-ignore
const __VLS_169 = __VLS_asFunctionalComponent(__VLS_168, new __VLS_168({
    label: "标准映射",
    name: "standard",
}));
const __VLS_170 = __VLS_169({
    label: "标准映射",
    name: "standard",
}, ...__VLS_functionalComponentArgsRest(__VLS_169));
__VLS_171.slots.default;
const __VLS_172 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_173 = __VLS_asFunctionalComponent(__VLS_172, new __VLS_172({
    data: (__VLS_ctx.standardMaps),
    size: "small",
    stripe: true,
}));
const __VLS_174 = __VLS_173({
    data: (__VLS_ctx.standardMaps),
    size: "small",
    stripe: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_173));
__VLS_175.slots.default;
const __VLS_176 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_177 = __VLS_asFunctionalComponent(__VLS_176, new __VLS_176({
    prop: "field",
    label: "数字段",
    minWidth: "140",
}));
const __VLS_178 = __VLS_177({
    prop: "field",
    label: "数字段",
    minWidth: "140",
}, ...__VLS_functionalComponentArgsRest(__VLS_177));
const __VLS_180 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_181 = __VLS_asFunctionalComponent(__VLS_180, new __VLS_180({
    prop: "std",
    label: "映射标准",
    minWidth: "180",
}));
const __VLS_182 = __VLS_181({
    prop: "std",
    label: "映射标准",
    minWidth: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_181));
const __VLS_184 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_185 = __VLS_asFunctionalComponent(__VLS_184, new __VLS_184({
    prop: "stdType",
    label: "标准分类",
    width: "110",
}));
const __VLS_186 = __VLS_185({
    prop: "stdType",
    label: "标准分类",
    width: "110",
}, ...__VLS_functionalComponentArgsRest(__VLS_185));
const __VLS_188 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_189 = __VLS_asFunctionalComponent(__VLS_188, new __VLS_188({
    label: "符合性",
    width: "90",
}));
const __VLS_190 = __VLS_189({
    label: "符合性",
    width: "90",
}, ...__VLS_functionalComponentArgsRest(__VLS_189));
__VLS_191.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_191.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_192 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_193 = __VLS_asFunctionalComponent(__VLS_192, new __VLS_192({
        size: "small",
        type: (row.ok ? 'success' : 'warning'),
        effect: "dark",
    }));
    const __VLS_194 = __VLS_193({
        size: "small",
        type: (row.ok ? 'success' : 'warning'),
        effect: "dark",
    }, ...__VLS_functionalComponentArgsRest(__VLS_193));
    __VLS_195.slots.default;
    (row.ok ? '符合' : '偏离');
    var __VLS_195;
}
var __VLS_191;
var __VLS_175;
var __VLS_171;
const __VLS_196 = {}.ElTabPane;
/** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
// @ts-ignore
const __VLS_197 = __VLS_asFunctionalComponent(__VLS_196, new __VLS_196({
    label: "安全",
    name: "security",
}));
const __VLS_198 = __VLS_197({
    label: "安全",
    name: "security",
}, ...__VLS_functionalComponentArgsRest(__VLS_197));
__VLS_199.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "toolbar-row" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "dep-text" },
});
(__VLS_ctx.asset.sensitive ? 'L3-L4（敏感）' : 'L1-L2（一般）');
const __VLS_200 = {}.ElTag;
/** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
// @ts-ignore
const __VLS_201 = __VLS_asFunctionalComponent(__VLS_200, new __VLS_200({
    size: "small",
    type: "danger",
    effect: "plain",
}));
const __VLS_202 = __VLS_201({
    size: "small",
    type: "danger",
    effect: "plain",
}, ...__VLS_functionalComponentArgsRest(__VLS_201));
__VLS_203.slots.default;
var __VLS_203;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "security-grid mt-12" },
});
const __VLS_204 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_205 = __VLS_asFunctionalComponent(__VLS_204, new __VLS_204({
    ...{ class: "s-card" },
    shadow: "never",
}));
const __VLS_206 = __VLS_205({
    ...{ class: "s-card" },
    shadow: "never",
}, ...__VLS_functionalComponentArgsRest(__VLS_205));
__VLS_207.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "s-col-title" },
});
(5);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "s-list" },
});
for (const [a] of __VLS_getVForSourceType((__VLS_ctx.authActors))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (a),
        ...{ class: "s-item" },
    });
    (a);
}
var __VLS_207;
const __VLS_208 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_209 = __VLS_asFunctionalComponent(__VLS_208, new __VLS_208({
    ...{ class: "s-card" },
    shadow: "never",
}));
const __VLS_210 = __VLS_209({
    ...{ class: "s-card" },
    shadow: "never",
}, ...__VLS_functionalComponentArgsRest(__VLS_209));
__VLS_211.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "s-col-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "s-list" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "s-item" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "s-item" },
});
var __VLS_211;
const __VLS_212 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_213 = __VLS_asFunctionalComponent(__VLS_212, new __VLS_212({
    ...{ class: "s-card" },
    shadow: "never",
}));
const __VLS_214 = __VLS_213({
    ...{ class: "s-card" },
    shadow: "never",
}, ...__VLS_functionalComponentArgsRest(__VLS_213));
__VLS_215.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "s-col-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "s-list" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "s-item" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "s-item" },
});
var __VLS_215;
var __VLS_199;
const __VLS_216 = {}.ElTabPane;
/** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
// @ts-ignore
const __VLS_217 = __VLS_asFunctionalComponent(__VLS_216, new __VLS_216({
    label: "共享服务",
    name: "share",
}));
const __VLS_218 = __VLS_217({
    label: "共享服务",
    name: "share",
}, ...__VLS_functionalComponentArgsRest(__VLS_217));
__VLS_219.slots.default;
const __VLS_220 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_221 = __VLS_asFunctionalComponent(__VLS_220, new __VLS_220({
    data: (__VLS_ctx.shareServices),
    size: "small",
    stripe: true,
}));
const __VLS_222 = __VLS_221({
    data: (__VLS_ctx.shareServices),
    size: "small",
    stripe: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_221));
__VLS_223.slots.default;
const __VLS_224 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_225 = __VLS_asFunctionalComponent(__VLS_224, new __VLS_224({
    prop: "svcName",
    label: "共享服务",
    minWidth: "150",
}));
const __VLS_226 = __VLS_225({
    prop: "svcName",
    label: "共享服务",
    minWidth: "150",
}, ...__VLS_functionalComponentArgsRest(__VLS_225));
const __VLS_228 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_229 = __VLS_asFunctionalComponent(__VLS_228, new __VLS_228({
    prop: "svcType",
    label: "服务类型",
    width: "110",
}));
const __VLS_230 = __VLS_229({
    prop: "svcType",
    label: "服务类型",
    width: "110",
}, ...__VLS_functionalComponentArgsRest(__VLS_229));
const __VLS_232 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_233 = __VLS_asFunctionalComponent(__VLS_232, new __VLS_232({
    prop: "callers",
    label: "订阅方",
    minWidth: "140",
}));
const __VLS_234 = __VLS_233({
    prop: "callers",
    label: "订阅方",
    minWidth: "140",
}, ...__VLS_functionalComponentArgsRest(__VLS_233));
const __VLS_236 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_237 = __VLS_asFunctionalComponent(__VLS_236, new __VLS_236({
    label: "状态",
    width: "90",
}));
const __VLS_238 = __VLS_237({
    label: "状态",
    width: "90",
}, ...__VLS_functionalComponentArgsRest(__VLS_237));
__VLS_239.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_239.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_240 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_241 = __VLS_asFunctionalComponent(__VLS_240, new __VLS_240({
        size: "small",
        type: (row.online ? 'success' : 'info'),
        effect: "dark",
    }));
    const __VLS_242 = __VLS_241({
        size: "small",
        type: (row.online ? 'success' : 'info'),
        effect: "dark",
    }, ...__VLS_functionalComponentArgsRest(__VLS_241));
    __VLS_243.slots.default;
    (row.online ? '已发布' : '已停用');
    var __VLS_243;
}
var __VLS_239;
var __VLS_223;
var __VLS_219;
var __VLS_43;
var __VLS_39;
/** @type {__VLS_StyleScopedClasses['standard-page']} */ ;
/** @type {__VLS_StyleScopedClasses['asset-detail-page']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['asset-head-card']} */ ;
/** @type {__VLS_StyleScopedClasses['asset-head']} */ ;
/** @type {__VLS_StyleScopedClasses['asset-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['asset-info']} */ ;
/** @type {__VLS_StyleScopedClasses['asset-title-row']} */ ;
/** @type {__VLS_StyleScopedClasses['asset-name']} */ ;
/** @type {__VLS_StyleScopedClasses['asset-meta']} */ ;
/** @type {__VLS_StyleScopedClasses['asset-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['asset-tabs']} */ ;
/** @type {__VLS_StyleScopedClasses['overview-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['ov-card']} */ ;
/** @type {__VLS_StyleScopedClasses['ov-value']} */ ;
/** @type {__VLS_StyleScopedClasses['ov-label']} */ ;
/** @type {__VLS_StyleScopedClasses['ov-card']} */ ;
/** @type {__VLS_StyleScopedClasses['ov-value']} */ ;
/** @type {__VLS_StyleScopedClasses['ov-label']} */ ;
/** @type {__VLS_StyleScopedClasses['ov-card']} */ ;
/** @type {__VLS_StyleScopedClasses['ov-value']} */ ;
/** @type {__VLS_StyleScopedClasses['ov-label']} */ ;
/** @type {__VLS_StyleScopedClasses['ov-card']} */ ;
/** @type {__VLS_StyleScopedClasses['ov-value']} */ ;
/** @type {__VLS_StyleScopedClasses['ov-label']} */ ;
/** @type {__VLS_StyleScopedClasses['ov-card']} */ ;
/** @type {__VLS_StyleScopedClasses['ov-value']} */ ;
/** @type {__VLS_StyleScopedClasses['ov-label']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
/** @type {__VLS_StyleScopedClasses['toolbar-row']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-select']} */ ;
/** @type {__VLS_StyleScopedClasses['dep-text']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-12']} */ ;
/** @type {__VLS_StyleScopedClasses['quality-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['q-card']} */ ;
/** @type {__VLS_StyleScopedClasses['q-num']} */ ;
/** @type {__VLS_StyleScopedClasses['q-label']} */ ;
/** @type {__VLS_StyleScopedClasses['q-card']} */ ;
/** @type {__VLS_StyleScopedClasses['q-num']} */ ;
/** @type {__VLS_StyleScopedClasses['q-label']} */ ;
/** @type {__VLS_StyleScopedClasses['q-card']} */ ;
/** @type {__VLS_StyleScopedClasses['q-num']} */ ;
/** @type {__VLS_StyleScopedClasses['q-label']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
/** @type {__VLS_StyleScopedClasses['q-detail']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['lineage-row']} */ ;
/** @type {__VLS_StyleScopedClasses['lg-node']} */ ;
/** @type {__VLS_StyleScopedClasses['lg-up']} */ ;
/** @type {__VLS_StyleScopedClasses['lg-title']} */ ;
/** @type {__VLS_StyleScopedClasses['lg-item']} */ ;
/** @type {__VLS_StyleScopedClasses['lg-arrow']} */ ;
/** @type {__VLS_StyleScopedClasses['lg-node']} */ ;
/** @type {__VLS_StyleScopedClasses['lg-self']} */ ;
/** @type {__VLS_StyleScopedClasses['lg-title']} */ ;
/** @type {__VLS_StyleScopedClasses['lg-item']} */ ;
/** @type {__VLS_StyleScopedClasses['lg-strong']} */ ;
/** @type {__VLS_StyleScopedClasses['lg-arrow']} */ ;
/** @type {__VLS_StyleScopedClasses['lg-node']} */ ;
/** @type {__VLS_StyleScopedClasses['lg-down']} */ ;
/** @type {__VLS_StyleScopedClasses['lg-title']} */ ;
/** @type {__VLS_StyleScopedClasses['lg-item']} */ ;
/** @type {__VLS_StyleScopedClasses['toolbar-row']} */ ;
/** @type {__VLS_StyleScopedClasses['dep-text']} */ ;
/** @type {__VLS_StyleScopedClasses['security-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-12']} */ ;
/** @type {__VLS_StyleScopedClasses['s-card']} */ ;
/** @type {__VLS_StyleScopedClasses['s-col-title']} */ ;
/** @type {__VLS_StyleScopedClasses['s-list']} */ ;
/** @type {__VLS_StyleScopedClasses['s-item']} */ ;
/** @type {__VLS_StyleScopedClasses['s-card']} */ ;
/** @type {__VLS_StyleScopedClasses['s-col-title']} */ ;
/** @type {__VLS_StyleScopedClasses['s-list']} */ ;
/** @type {__VLS_StyleScopedClasses['s-item']} */ ;
/** @type {__VLS_StyleScopedClasses['s-item']} */ ;
/** @type {__VLS_StyleScopedClasses['s-card']} */ ;
/** @type {__VLS_StyleScopedClasses['s-col-title']} */ ;
/** @type {__VLS_StyleScopedClasses['s-list']} */ ;
/** @type {__VLS_StyleScopedClasses['s-item']} */ ;
/** @type {__VLS_StyleScopedClasses['s-item']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Download: Download,
            Right: Right,
            Share: Share,
            Tickets: Tickets,
            activeTab: activeTab,
            asset: asset,
            fields: fields,
            structureFilter: structureFilter,
            filteredFields: filteredFields,
            qualityIssues: qualityIssues,
            standardMaps: standardMaps,
            authActors: authActors,
            shareServices: shareServices,
            openShare: openShare,
            downloadAsset: downloadAsset,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
