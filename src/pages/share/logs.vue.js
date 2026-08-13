import { computed, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { Download, Search } from '@element-plus/icons-vue';
const appOptions = ['智能客流分析平台', '线网规划仿真系统', '车站大屏展示端', '外部科研合作方'];
const svcOptions = ['客流统计查询服务', '线路基础信息服务', '车站信息同步服务', '售票明细查询服务', '订单汇总指标服务'];
const logs = ref([
    { id: 1, time: '2026-08-13 10:31:22', app: '智能客流分析平台', service: '/api/v1/flow/stat', method: 'GET', param: 'line_code=GZ-L1', code: 0, cost: '182ms', result: '成功', ip: '10.20.8.15', request: '{"line_code":"GZ-L1"}', response: '{"code":0,"data":{"totalPassengers":86472}}' },
    { id: 2, time: '2026-08-13 10:31:05', app: '车站大屏展示端', service: '/api/v1/station/list', method: 'GET', param: 'page=1', code: 0, cost: '96ms', result: '成功', ip: '10.20.12.7', request: '{"page":1}', response: '{"code":0,"data":[{"stationName":"公园前"}]}' },
    { id: 3, time: '2026-08-13 10:30:48', app: '外部科研合作方', service: '/api/v1/ticket/query', method: 'POST', param: 'begin_date=2026-08-01', code: 40101, cost: '12ms', result: '失败', ip: '203.0.113.9', request: '{"begin_date":"2026-08-01"}', response: '{"code":40101,"message":"signature verification failed"}' },
    { id: 4, time: '2026-08-13 10:30:31', app: '线网规划仿真系统', service: '/api/v1/line/detail', method: 'GET', param: 'line_code=GZ-L2', code: 0, cost: '74ms', result: '成功', ip: '10.20.9.21', request: '{"line_code":"GZ-L2"}', response: '{"code":0,"data":{"lineName":"2号线"}}' },
    { id: 5, time: '2026-08-13 10:29:58', app: '智能客流分析平台', service: '/api/v1/order/summary', method: 'GET', param: 'line_code=GZ-L1', code: 42900, cost: '8ms', result: '失败', ip: '10.20.8.15', request: '{"line_code":"GZ-L1"}', response: '{"code":42900,"message":"rate limit exceeded"}' },
    { id: 6, time: '2026-08-13 10:29:40', app: '车站大屏展示端', service: '/api/v1/qa/station', method: 'POST', param: 'question=下一站', code: 0, cost: '1380ms', result: '成功', ip: '10.20.12.7', request: '{"question":"下一站到哪？"}', response: '{"code":0,"data":{"answer":"下一站：烈士陵园"}}' },
    { id: 7, time: '2026-08-13 10:29:12', app: '智能客流分析平台', service: '/api/v1/flow/stat', method: 'GET', param: 'line_code=GZ-L2', code: 0, cost: '175ms', result: '成功', ip: '10.20.8.15', request: '{"line_code":"GZ-L2"}', response: '{"code":0,"data":{"totalPassengers":51003}}' },
    { id: 8, time: '2026-08-13 10:28:55', app: '外部科研合作方', service: '/api/v1/ticket/query', method: 'POST', param: 'begin_date=2026-08-10', code: 0, cost: '221ms', result: '成功', ip: '203.0.113.9', request: '{"begin_date":"2026-08-10"}', response: '{"code":0,"data":[{"orderId":"TS2026..."}]}' },
]);
const timeRange = ref(null);
const appFilter = ref('');
const svcFilter = ref('');
const resultFilter = ref('');
const kw = ref('');
const filteredLogs = computed(() => logs.value.filter((l) => {
    if (appFilter.value && l.app !== appFilter.value)
        return false;
    if (svcFilter.value && l.service !== svcFilter.value && !l.service.includes(svcFilter.value))
        return false;
    if (resultFilter.value && l.result !== resultFilter.value)
        return false;
    if (!kw.value)
        return true;
    const k = kw.value.toLowerCase();
    return l.app.toLowerCase().includes(k) || l.param.toLowerCase().includes(k) || l.ip.includes(k);
}));
const detailVisible = ref(false);
const detailLog = ref(null);
const openDetail = (row) => {
    detailLog.value = row;
    detailVisible.value = true;
};
const exportLogs = () => ElMessage.success(`已导出 ${filteredLogs.value.length} 条调用日志（CSV/Mock）`);
const exportOne = () => ElMessage.success('该条日志已导出（Mock）');
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['log-code']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "standard-page share-logs-page" },
});
const __VLS_0 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ class: "panel-card" },
    shadow: "never",
}));
const __VLS_2 = __VLS_1({
    ...{ class: "panel-card" },
    shadow: "never",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_3.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-actions" },
    });
    const __VLS_4 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
        ...{ 'onClick': {} },
        size: "small",
        type: "danger",
        plain: true,
        icon: (__VLS_ctx.Download),
        disabled: (!__VLS_ctx.filteredLogs.length),
    }));
    const __VLS_6 = __VLS_5({
        ...{ 'onClick': {} },
        size: "small",
        type: "danger",
        plain: true,
        icon: (__VLS_ctx.Download),
        disabled: (!__VLS_ctx.filteredLogs.length),
    }, ...__VLS_functionalComponentArgsRest(__VLS_5));
    let __VLS_8;
    let __VLS_9;
    let __VLS_10;
    const __VLS_11 = {
        onClick: (__VLS_ctx.exportLogs)
    };
    __VLS_7.slots.default;
    var __VLS_7;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "toolbar-row" },
});
const __VLS_12 = {}.ElDatePicker;
/** @type {[typeof __VLS_components.ElDatePicker, typeof __VLS_components.elDatePicker, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
    modelValue: (__VLS_ctx.timeRange),
    type: "datetimerange",
    size: "small",
    rangeSeparator: "至",
    startPlaceholder: "开始时间",
    endPlaceholder: "结束时间",
    ...{ class: "filter-date" },
}));
const __VLS_14 = __VLS_13({
    modelValue: (__VLS_ctx.timeRange),
    type: "datetimerange",
    size: "small",
    rangeSeparator: "至",
    startPlaceholder: "开始时间",
    endPlaceholder: "结束时间",
    ...{ class: "filter-date" },
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
const __VLS_16 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    modelValue: (__VLS_ctx.appFilter),
    placeholder: "调用应用",
    clearable: true,
    size: "small",
    ...{ class: "filter-select-lg" },
}));
const __VLS_18 = __VLS_17({
    modelValue: (__VLS_ctx.appFilter),
    placeholder: "调用应用",
    clearable: true,
    size: "small",
    ...{ class: "filter-select-lg" },
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
__VLS_19.slots.default;
for (const [a] of __VLS_getVForSourceType((__VLS_ctx.appOptions))) {
    const __VLS_20 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
        key: (a),
        label: (a),
        value: (a),
    }));
    const __VLS_22 = __VLS_21({
        key: (a),
        label: (a),
        value: (a),
    }, ...__VLS_functionalComponentArgsRest(__VLS_21));
}
var __VLS_19;
const __VLS_24 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    modelValue: (__VLS_ctx.svcFilter),
    placeholder: "服务",
    clearable: true,
    size: "small",
    ...{ class: "filter-select-lg" },
}));
const __VLS_26 = __VLS_25({
    modelValue: (__VLS_ctx.svcFilter),
    placeholder: "服务",
    clearable: true,
    size: "small",
    ...{ class: "filter-select-lg" },
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
__VLS_27.slots.default;
for (const [s] of __VLS_getVForSourceType((__VLS_ctx.svcOptions))) {
    const __VLS_28 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
        key: (s),
        label: (s),
        value: (s),
    }));
    const __VLS_30 = __VLS_29({
        key: (s),
        label: (s),
        value: (s),
    }, ...__VLS_functionalComponentArgsRest(__VLS_29));
}
var __VLS_27;
const __VLS_32 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
    modelValue: (__VLS_ctx.resultFilter),
    placeholder: "结果",
    clearable: true,
    size: "small",
    ...{ class: "filter-select" },
}));
const __VLS_34 = __VLS_33({
    modelValue: (__VLS_ctx.resultFilter),
    placeholder: "结果",
    clearable: true,
    size: "small",
    ...{ class: "filter-select" },
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
__VLS_35.slots.default;
const __VLS_36 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    label: "成功",
    value: "成功",
}));
const __VLS_38 = __VLS_37({
    label: "成功",
    value: "成功",
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
const __VLS_40 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
    label: "失败",
    value: "失败",
}));
const __VLS_42 = __VLS_41({
    label: "失败",
    value: "失败",
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
var __VLS_35;
const __VLS_44 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    modelValue: (__VLS_ctx.kw),
    placeholder: "按调用方 / 参数关键字",
    clearable: true,
    size: "small",
    ...{ class: "search-input" },
    prefixIcon: (__VLS_ctx.Search),
}));
const __VLS_46 = __VLS_45({
    modelValue: (__VLS_ctx.kw),
    placeholder: "按调用方 / 参数关键字",
    clearable: true,
    size: "small",
    ...{ class: "search-input" },
    prefixIcon: (__VLS_ctx.Search),
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
const __VLS_48 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
    data: (__VLS_ctx.filteredLogs),
    size: "small",
    stripe: true,
    ...{ class: "mt-12" },
}));
const __VLS_50 = __VLS_49({
    data: (__VLS_ctx.filteredLogs),
    size: "small",
    stripe: true,
    ...{ class: "mt-12" },
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
__VLS_51.slots.default;
const __VLS_52 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
    prop: "time",
    label: "调用时间",
    width: "150",
}));
const __VLS_54 = __VLS_53({
    prop: "time",
    label: "调用时间",
    width: "150",
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
const __VLS_56 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
    prop: "app",
    label: "调用方应用",
    minWidth: "130",
    showOverflowTooltip: true,
}));
const __VLS_58 = __VLS_57({
    prop: "app",
    label: "调用方应用",
    minWidth: "130",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
const __VLS_60 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
    prop: "service",
    label: "服务",
    minWidth: "150",
    showOverflowTooltip: true,
}));
const __VLS_62 = __VLS_61({
    prop: "service",
    label: "服务",
    minWidth: "150",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_61));
const __VLS_64 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
    prop: "method",
    label: "Method",
    width: "70",
    align: "center",
}));
const __VLS_66 = __VLS_65({
    prop: "method",
    label: "Method",
    width: "70",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_65));
const __VLS_68 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
    label: "参数",
    minWidth: "150",
}));
const __VLS_70 = __VLS_69({
    label: "参数",
    minWidth: "150",
}, ...__VLS_functionalComponentArgsRest(__VLS_69));
__VLS_71.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_71.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.code, __VLS_intrinsicElements.code)({
        ...{ class: "log-param" },
    });
    (row.param);
}
var __VLS_71;
const __VLS_72 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
    prop: "code",
    label: "返回码",
    width: "80",
    align: "center",
}));
const __VLS_74 = __VLS_73({
    prop: "code",
    label: "返回码",
    width: "80",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_73));
__VLS_75.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_75.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.code, __VLS_intrinsicElements.code)({
        ...{ class: (row.code === 0 ? 'code-ok' : 'code-err') },
    });
    (row.code);
}
var __VLS_75;
const __VLS_76 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
    prop: "cost",
    label: "耗时",
    width: "76",
    align: "right",
}));
const __VLS_78 = __VLS_77({
    prop: "cost",
    label: "耗时",
    width: "76",
    align: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_77));
const __VLS_80 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
    label: "结果",
    width: "70",
}));
const __VLS_82 = __VLS_81({
    label: "结果",
    width: "70",
}, ...__VLS_functionalComponentArgsRest(__VLS_81));
__VLS_83.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_83.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_84 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
        size: "small",
        type: (row.result === '成功' ? 'success' : 'danger'),
        effect: "dark",
    }));
    const __VLS_86 = __VLS_85({
        size: "small",
        type: (row.result === '成功' ? 'success' : 'danger'),
        effect: "dark",
    }, ...__VLS_functionalComponentArgsRest(__VLS_85));
    __VLS_87.slots.default;
    (row.result);
    var __VLS_87;
}
var __VLS_83;
const __VLS_88 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
    label: "操作",
    width: "70",
    fixed: "right",
}));
const __VLS_90 = __VLS_89({
    label: "操作",
    width: "70",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_89));
__VLS_91.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_91.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_92 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
        size: "small",
    }));
    const __VLS_94 = __VLS_93({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_93));
    let __VLS_96;
    let __VLS_97;
    let __VLS_98;
    const __VLS_99 = {
        onClick: (...[$event]) => {
            __VLS_ctx.openDetail(row);
        }
    };
    __VLS_95.slots.default;
    var __VLS_95;
}
var __VLS_91;
var __VLS_51;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "pager" },
});
const __VLS_100 = {}.ElPagination;
/** @type {[typeof __VLS_components.ElPagination, typeof __VLS_components.elPagination, ]} */ ;
// @ts-ignore
const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
    background: true,
    layout: "total, prev, pager, next",
    total: (__VLS_ctx.filteredLogs.length),
    pageSize: (12),
}));
const __VLS_102 = __VLS_101({
    background: true,
    layout: "total, prev, pager, next",
    total: (__VLS_ctx.filteredLogs.length),
    pageSize: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_101));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "retention-note" },
});
var __VLS_3;
const __VLS_104 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
    modelValue: (__VLS_ctx.detailVisible),
    title: "调用日志详情",
    width: "640px",
}));
const __VLS_106 = __VLS_105({
    modelValue: (__VLS_ctx.detailVisible),
    title: "调用日志详情",
    width: "640px",
}, ...__VLS_functionalComponentArgsRest(__VLS_105));
__VLS_107.slots.default;
if (__VLS_ctx.detailLog) {
    const __VLS_108 = {}.ElDescriptions;
    /** @type {[typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, ]} */ ;
    // @ts-ignore
    const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
        column: (2),
        border: true,
        size: "small",
    }));
    const __VLS_110 = __VLS_109({
        column: (2),
        border: true,
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_109));
    __VLS_111.slots.default;
    const __VLS_112 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
        label: "调用时间",
    }));
    const __VLS_114 = __VLS_113({
        label: "调用时间",
    }, ...__VLS_functionalComponentArgsRest(__VLS_113));
    __VLS_115.slots.default;
    (__VLS_ctx.detailLog.time);
    var __VLS_115;
    const __VLS_116 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
        label: "调用方应用",
    }));
    const __VLS_118 = __VLS_117({
        label: "调用方应用",
    }, ...__VLS_functionalComponentArgsRest(__VLS_117));
    __VLS_119.slots.default;
    (__VLS_ctx.detailLog.app);
    var __VLS_119;
    const __VLS_120 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({
        label: "服务路径",
    }));
    const __VLS_122 = __VLS_121({
        label: "服务路径",
    }, ...__VLS_functionalComponentArgsRest(__VLS_121));
    __VLS_123.slots.default;
    (__VLS_ctx.detailLog.service);
    var __VLS_123;
    const __VLS_124 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({
        label: "请求方式",
    }));
    const __VLS_126 = __VLS_125({
        label: "请求方式",
    }, ...__VLS_functionalComponentArgsRest(__VLS_125));
    __VLS_127.slots.default;
    (__VLS_ctx.detailLog.method);
    var __VLS_127;
    const __VLS_128 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({
        label: "调用者 IP",
    }));
    const __VLS_130 = __VLS_129({
        label: "调用者 IP",
    }, ...__VLS_functionalComponentArgsRest(__VLS_129));
    __VLS_131.slots.default;
    (__VLS_ctx.detailLog.ip);
    var __VLS_131;
    const __VLS_132 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132({
        label: "结果",
    }));
    const __VLS_134 = __VLS_133({
        label: "结果",
    }, ...__VLS_functionalComponentArgsRest(__VLS_133));
    __VLS_135.slots.default;
    (__VLS_ctx.detailLog.result);
    var __VLS_135;
    const __VLS_136 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_137 = __VLS_asFunctionalComponent(__VLS_136, new __VLS_136({
        label: "返回码",
    }));
    const __VLS_138 = __VLS_137({
        label: "返回码",
    }, ...__VLS_functionalComponentArgsRest(__VLS_137));
    __VLS_139.slots.default;
    (__VLS_ctx.detailLog.code);
    var __VLS_139;
    const __VLS_140 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_141 = __VLS_asFunctionalComponent(__VLS_140, new __VLS_140({
        label: "耗时",
    }));
    const __VLS_142 = __VLS_141({
        label: "耗时",
    }, ...__VLS_functionalComponentArgsRest(__VLS_141));
    __VLS_143.slots.default;
    (__VLS_ctx.detailLog.cost);
    var __VLS_143;
    var __VLS_111;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "detail-block-title" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.pre, __VLS_intrinsicElements.pre)({
        ...{ class: "log-code" },
    });
    (__VLS_ctx.detailLog.request);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "detail-block-title" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.pre, __VLS_intrinsicElements.pre)({
        ...{ class: "log-code" },
        ...{ class: ({ 'code-error': __VLS_ctx.detailLog.result === '失败' }) },
    });
    (__VLS_ctx.detailLog.response);
}
{
    const { footer: __VLS_thisSlot } = __VLS_107.slots;
    const __VLS_144 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_145 = __VLS_asFunctionalComponent(__VLS_144, new __VLS_144({
        ...{ 'onClick': {} },
    }));
    const __VLS_146 = __VLS_145({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_145));
    let __VLS_148;
    let __VLS_149;
    let __VLS_150;
    const __VLS_151 = {
        onClick: (...[$event]) => {
            __VLS_ctx.detailVisible = false;
        }
    };
    __VLS_147.slots.default;
    var __VLS_147;
    const __VLS_152 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_153 = __VLS_asFunctionalComponent(__VLS_152, new __VLS_152({
        ...{ 'onClick': {} },
        type: "primary",
    }));
    const __VLS_154 = __VLS_153({
        ...{ 'onClick': {} },
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_153));
    let __VLS_156;
    let __VLS_157;
    let __VLS_158;
    const __VLS_159 = {
        onClick: (__VLS_ctx.exportOne)
    };
    __VLS_155.slots.default;
    var __VLS_155;
}
var __VLS_107;
/** @type {__VLS_StyleScopedClasses['standard-page']} */ ;
/** @type {__VLS_StyleScopedClasses['share-logs-page']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['toolbar-row']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-date']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-select-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-select-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-select']} */ ;
/** @type {__VLS_StyleScopedClasses['search-input']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-12']} */ ;
/** @type {__VLS_StyleScopedClasses['log-param']} */ ;
/** @type {__VLS_StyleScopedClasses['pager']} */ ;
/** @type {__VLS_StyleScopedClasses['retention-note']} */ ;
/** @type {__VLS_StyleScopedClasses['detail-block-title']} */ ;
/** @type {__VLS_StyleScopedClasses['log-code']} */ ;
/** @type {__VLS_StyleScopedClasses['detail-block-title']} */ ;
/** @type {__VLS_StyleScopedClasses['log-code']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Download: Download,
            Search: Search,
            appOptions: appOptions,
            svcOptions: svcOptions,
            timeRange: timeRange,
            appFilter: appFilter,
            svcFilter: svcFilter,
            resultFilter: resultFilter,
            kw: kw,
            filteredLogs: filteredLogs,
            detailVisible: detailVisible,
            detailLog: detailLog,
            openDetail: openDetail,
            exportLogs: exportLogs,
            exportOne: exportOne,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
