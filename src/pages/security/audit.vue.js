import { computed, ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { Download } from '@element-plus/icons-vue';
import { mockAuditLogs } from '@/mock/security';
const operationTypes = ['认证', '访问', '导出', '治理', '配置'];
const userPool = ['张三', '李四', '王五', '赵六', 'admin', '孙七'];
const timeRange = ref([]);
const filterType = ref('');
const filterUser = ref('');
const filterResult = ref('');
const onlyAbnormal = ref(false);
const currentPage = ref(1);
const pageSize = 20;
const traceVisible = ref(false);
const logs = ref(mockAuditLogs.map((log, index) => ({
    ...log,
    traceChain: index % 5 === 0
        ? [
            { time: log.time, title: `${log.user} 登录系统`, detail: `IP ${log.ip} 登录成功`, type: 'primary' },
            { time: log.time, title: log.action, detail: `对象：${log.object}`, type: 'success' },
            { time: log.time, title: '会话结束', detail: '操作完成，记录留痕', type: 'info' },
        ]
        : [
            { time: log.time, title: `${log.user} ${log.action}`, detail: `对象：${log.object}（${log.result}）`, type: 'primary' },
            { time: log.time, title: '审计记录归档', detail: '已写入审计存储', type: 'info' },
        ],
})));
const currentLog = ref(null);
const filteredLogs = computed(() => logs.value.filter((log) => {
    if (onlyAbnormal.value && !log.abnormal)
        return false;
    if (filterType.value && log.operationType !== filterType.value)
        return false;
    if (filterUser.value && log.user !== filterUser.value)
        return false;
    if (filterResult.value && log.result !== filterResult.value)
        return false;
    if (timeRange.value.length === 2) {
        const time = log.time.slice(0, 10);
        if (time < timeRange.value[0] || time > timeRange.value[1])
            return false;
    }
    return true;
}));
const pagedLogs = computed(() => {
    const start = (currentPage.value - 1) * pageSize;
    return filteredLogs.value.slice(start, start + pageSize);
});
const changePage = (page) => (currentPage.value = page);
watch([timeRange, filterType, filterUser, filterResult, onlyAbnormal], () => {
    currentPage.value = 1;
});
const openTrace = (row) => {
    currentLog.value = row;
    traceVisible.value = true;
};
const exportEvidence = () => {
    ElMessage.success('合规举证材料已生成并导出（Mock）');
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "standard-page" },
});
const __VLS_0 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ class: "panel-card dashboard-card" },
    shadow: "never",
}));
const __VLS_2 = __VLS_1({
    ...{ class: "panel-card dashboard-card" },
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
        type: "danger",
        icon: (__VLS_ctx.Download),
    }));
    const __VLS_6 = __VLS_5({
        ...{ 'onClick': {} },
        type: "danger",
        icon: (__VLS_ctx.Download),
    }, ...__VLS_functionalComponentArgsRest(__VLS_5));
    let __VLS_8;
    let __VLS_9;
    let __VLS_10;
    const __VLS_11 = {
        onClick: (__VLS_ctx.exportEvidence)
    };
    __VLS_7.slots.default;
    var __VLS_7;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "toolbar-row audit-toolbar" },
});
const __VLS_12 = {}.ElDatePicker;
/** @type {[typeof __VLS_components.ElDatePicker, typeof __VLS_components.elDatePicker, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
    modelValue: (__VLS_ctx.timeRange),
    type: "daterange",
    startPlaceholder: "开始时间",
    endPlaceholder: "结束时间",
    valueFormat: "YYYY-MM-DD",
    ...{ class: "filter-date" },
}));
const __VLS_14 = __VLS_13({
    modelValue: (__VLS_ctx.timeRange),
    type: "daterange",
    startPlaceholder: "开始时间",
    endPlaceholder: "结束时间",
    valueFormat: "YYYY-MM-DD",
    ...{ class: "filter-date" },
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
const __VLS_16 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    modelValue: (__VLS_ctx.filterType),
    placeholder: "操作类型",
    clearable: true,
    ...{ class: "filter-select" },
}));
const __VLS_18 = __VLS_17({
    modelValue: (__VLS_ctx.filterType),
    placeholder: "操作类型",
    clearable: true,
    ...{ class: "filter-select" },
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
__VLS_19.slots.default;
for (const [type] of __VLS_getVForSourceType((__VLS_ctx.operationTypes))) {
    const __VLS_20 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
        key: (type),
        label: (type),
        value: (type),
    }));
    const __VLS_22 = __VLS_21({
        key: (type),
        label: (type),
        value: (type),
    }, ...__VLS_functionalComponentArgsRest(__VLS_21));
}
var __VLS_19;
const __VLS_24 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    modelValue: (__VLS_ctx.filterUser),
    placeholder: "操作人",
    clearable: true,
    ...{ class: "filter-select" },
}));
const __VLS_26 = __VLS_25({
    modelValue: (__VLS_ctx.filterUser),
    placeholder: "操作人",
    clearable: true,
    ...{ class: "filter-select" },
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
__VLS_27.slots.default;
for (const [user] of __VLS_getVForSourceType((__VLS_ctx.userPool))) {
    const __VLS_28 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
        key: (user),
        label: (user),
        value: (user),
    }));
    const __VLS_30 = __VLS_29({
        key: (user),
        label: (user),
        value: (user),
    }, ...__VLS_functionalComponentArgsRest(__VLS_29));
}
var __VLS_27;
const __VLS_32 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
    modelValue: (__VLS_ctx.filterResult),
    placeholder: "结果",
    clearable: true,
    ...{ class: "filter-select" },
}));
const __VLS_34 = __VLS_33({
    modelValue: (__VLS_ctx.filterResult),
    placeholder: "结果",
    clearable: true,
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
const __VLS_44 = {}.ElCheckbox;
/** @type {[typeof __VLS_components.ElCheckbox, typeof __VLS_components.elCheckbox, typeof __VLS_components.ElCheckbox, typeof __VLS_components.elCheckbox, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    modelValue: (__VLS_ctx.onlyAbnormal),
    ...{ class: "filter-check" },
}));
const __VLS_46 = __VLS_45({
    modelValue: (__VLS_ctx.onlyAbnormal),
    ...{ class: "filter-check" },
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
__VLS_47.slots.default;
var __VLS_47;
const __VLS_48 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
    data: (__VLS_ctx.pagedLogs),
    stripe: true,
    ...{ class: "mt-12" },
}));
const __VLS_50 = __VLS_49({
    data: (__VLS_ctx.pagedLogs),
    stripe: true,
    ...{ class: "mt-12" },
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
__VLS_51.slots.default;
const __VLS_52 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
    prop: "time",
    label: "时间",
    width: "160",
}));
const __VLS_54 = __VLS_53({
    prop: "time",
    label: "时间",
    width: "160",
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
const __VLS_56 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
    prop: "user",
    label: "操作人",
    width: "90",
}));
const __VLS_58 = __VLS_57({
    prop: "user",
    label: "操作人",
    width: "90",
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
const __VLS_60 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
    label: "操作类型",
    width: "90",
}));
const __VLS_62 = __VLS_61({
    label: "操作类型",
    width: "90",
}, ...__VLS_functionalComponentArgsRest(__VLS_61));
__VLS_63.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_63.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_64 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
        size: "small",
        effect: "plain",
    }));
    const __VLS_66 = __VLS_65({
        size: "small",
        effect: "plain",
    }, ...__VLS_functionalComponentArgsRest(__VLS_65));
    __VLS_67.slots.default;
    (row.operationType);
    var __VLS_67;
}
var __VLS_63;
const __VLS_68 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
    prop: "action",
    label: "操作",
    minWidth: "120",
}));
const __VLS_70 = __VLS_69({
    prop: "action",
    label: "操作",
    minWidth: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_69));
const __VLS_72 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
    prop: "object",
    label: "对象",
    minWidth: "140",
}));
const __VLS_74 = __VLS_73({
    prop: "object",
    label: "对象",
    minWidth: "140",
}, ...__VLS_functionalComponentArgsRest(__VLS_73));
const __VLS_76 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
    label: "结果",
    width: "80",
}));
const __VLS_78 = __VLS_77({
    label: "结果",
    width: "80",
}, ...__VLS_functionalComponentArgsRest(__VLS_77));
__VLS_79.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_79.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: (row.result === '成功' ? 'audit-success' : 'audit-fail') },
    });
    (row.result);
}
var __VLS_79;
const __VLS_80 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
    prop: "ip",
    label: "来源 IP",
    width: "130",
}));
const __VLS_82 = __VLS_81({
    prop: "ip",
    label: "来源 IP",
    width: "130",
}, ...__VLS_functionalComponentArgsRest(__VLS_81));
const __VLS_84 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
    label: "异常",
    width: "70",
    align: "center",
}));
const __VLS_86 = __VLS_85({
    label: "异常",
    width: "70",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_85));
__VLS_87.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_87.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    if (row.abnormal) {
        const __VLS_88 = {}.ElTag;
        /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
        // @ts-ignore
        const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
            type: "danger",
            size: "small",
            effect: "dark",
        }));
        const __VLS_90 = __VLS_89({
            type: "danger",
            size: "small",
            effect: "dark",
        }, ...__VLS_functionalComponentArgsRest(__VLS_89));
        __VLS_91.slots.default;
        var __VLS_91;
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "dep-text" },
        });
    }
}
var __VLS_87;
const __VLS_92 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
    label: "操作",
    width: "110",
    fixed: "right",
}));
const __VLS_94 = __VLS_93({
    label: "操作",
    width: "110",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_93));
__VLS_95.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_95.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_96 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }));
    const __VLS_98 = __VLS_97({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_97));
    let __VLS_100;
    let __VLS_101;
    let __VLS_102;
    const __VLS_103 = {
        onClick: (...[$event]) => {
            __VLS_ctx.openTrace(row);
        }
    };
    __VLS_99.slots.default;
    var __VLS_99;
}
var __VLS_95;
var __VLS_51;
const __VLS_104 = {}.ElPagination;
/** @type {[typeof __VLS_components.ElPagination, typeof __VLS_components.elPagination, ]} */ ;
// @ts-ignore
const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
    ...{ 'onCurrentChange': {} },
    ...{ class: "pager" },
    layout: "total, prev, pager, next",
    total: (__VLS_ctx.filteredLogs.length),
    pageSize: (__VLS_ctx.pageSize),
    currentPage: (__VLS_ctx.currentPage),
    background: true,
}));
const __VLS_106 = __VLS_105({
    ...{ 'onCurrentChange': {} },
    ...{ class: "pager" },
    layout: "total, prev, pager, next",
    total: (__VLS_ctx.filteredLogs.length),
    pageSize: (__VLS_ctx.pageSize),
    currentPage: (__VLS_ctx.currentPage),
    background: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_105));
let __VLS_108;
let __VLS_109;
let __VLS_110;
const __VLS_111 = {
    onCurrentChange: (__VLS_ctx.changePage)
};
var __VLS_107;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "retention-note" },
});
var __VLS_3;
const __VLS_112 = {}.ElDrawer;
/** @type {[typeof __VLS_components.ElDrawer, typeof __VLS_components.elDrawer, typeof __VLS_components.ElDrawer, typeof __VLS_components.elDrawer, ]} */ ;
// @ts-ignore
const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
    modelValue: (__VLS_ctx.traceVisible),
    title: "操作溯源",
    size: "560px",
}));
const __VLS_114 = __VLS_113({
    modelValue: (__VLS_ctx.traceVisible),
    title: "操作溯源",
    size: "560px",
}, ...__VLS_functionalComponentArgsRest(__VLS_113));
__VLS_115.slots.default;
if (__VLS_ctx.currentLog) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "trace-head" },
    });
    const __VLS_116 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
        type: (__VLS_ctx.currentLog.abnormal ? 'danger' : 'success'),
        effect: "dark",
        size: "small",
    }));
    const __VLS_118 = __VLS_117({
        type: (__VLS_ctx.currentLog.abnormal ? 'danger' : 'success'),
        effect: "dark",
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_117));
    __VLS_119.slots.default;
    (__VLS_ctx.currentLog.abnormal ? '异常行为' : '正常操作');
    var __VLS_119;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "trace-title" },
    });
    (__VLS_ctx.currentLog.action);
    (__VLS_ctx.currentLog.object);
    const __VLS_120 = {}.ElDescriptions;
    /** @type {[typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, ]} */ ;
    // @ts-ignore
    const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({
        column: (1),
        border: true,
        ...{ class: "mt-16" },
        size: "small",
    }));
    const __VLS_122 = __VLS_121({
        column: (1),
        border: true,
        ...{ class: "mt-16" },
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_121));
    __VLS_123.slots.default;
    const __VLS_124 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({
        label: "操作人",
    }));
    const __VLS_126 = __VLS_125({
        label: "操作人",
    }, ...__VLS_functionalComponentArgsRest(__VLS_125));
    __VLS_127.slots.default;
    (__VLS_ctx.currentLog.user);
    var __VLS_127;
    const __VLS_128 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({
        label: "时间",
    }));
    const __VLS_130 = __VLS_129({
        label: "时间",
    }, ...__VLS_functionalComponentArgsRest(__VLS_129));
    __VLS_131.slots.default;
    (__VLS_ctx.currentLog.time);
    var __VLS_131;
    const __VLS_132 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132({
        label: "来源 IP",
    }));
    const __VLS_134 = __VLS_133({
        label: "来源 IP",
    }, ...__VLS_functionalComponentArgsRest(__VLS_133));
    __VLS_135.slots.default;
    (__VLS_ctx.currentLog.ip);
    var __VLS_135;
    const __VLS_136 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_137 = __VLS_asFunctionalComponent(__VLS_136, new __VLS_136({
        label: "操作类型",
    }));
    const __VLS_138 = __VLS_137({
        label: "操作类型",
    }, ...__VLS_functionalComponentArgsRest(__VLS_137));
    __VLS_139.slots.default;
    (__VLS_ctx.currentLog.operationType);
    var __VLS_139;
    const __VLS_140 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_141 = __VLS_asFunctionalComponent(__VLS_140, new __VLS_140({
        label: "结果",
    }));
    const __VLS_142 = __VLS_141({
        label: "结果",
    }, ...__VLS_functionalComponentArgsRest(__VLS_141));
    __VLS_143.slots.default;
    (__VLS_ctx.currentLog.result);
    var __VLS_143;
    var __VLS_123;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "section-title mt-16" },
    });
    const __VLS_144 = {}.ElTimeline;
    /** @type {[typeof __VLS_components.ElTimeline, typeof __VLS_components.elTimeline, typeof __VLS_components.ElTimeline, typeof __VLS_components.elTimeline, ]} */ ;
    // @ts-ignore
    const __VLS_145 = __VLS_asFunctionalComponent(__VLS_144, new __VLS_144({
        ...{ class: "mt-8" },
    }));
    const __VLS_146 = __VLS_145({
        ...{ class: "mt-8" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_145));
    __VLS_147.slots.default;
    for (const [step] of __VLS_getVForSourceType((__VLS_ctx.currentLog.traceChain))) {
        const __VLS_148 = {}.ElTimelineItem;
        /** @type {[typeof __VLS_components.ElTimelineItem, typeof __VLS_components.elTimelineItem, typeof __VLS_components.ElTimelineItem, typeof __VLS_components.elTimelineItem, ]} */ ;
        // @ts-ignore
        const __VLS_149 = __VLS_asFunctionalComponent(__VLS_148, new __VLS_148({
            key: (step.time),
            timestamp: (step.time),
            type: (step.type),
        }));
        const __VLS_150 = __VLS_149({
            key: (step.time),
            timestamp: (step.time),
            type: (step.type),
        }, ...__VLS_functionalComponentArgsRest(__VLS_149));
        __VLS_151.slots.default;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "audit-item-title" },
        });
        (step.title);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "audit-item-action" },
        });
        (step.detail);
        var __VLS_151;
    }
    var __VLS_147;
}
var __VLS_115;
/** @type {__VLS_StyleScopedClasses['standard-page']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['toolbar-row']} */ ;
/** @type {__VLS_StyleScopedClasses['audit-toolbar']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-date']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-select']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-select']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-select']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-check']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-12']} */ ;
/** @type {__VLS_StyleScopedClasses['dep-text']} */ ;
/** @type {__VLS_StyleScopedClasses['pager']} */ ;
/** @type {__VLS_StyleScopedClasses['retention-note']} */ ;
/** @type {__VLS_StyleScopedClasses['trace-head']} */ ;
/** @type {__VLS_StyleScopedClasses['trace-title']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
/** @type {__VLS_StyleScopedClasses['audit-item-title']} */ ;
/** @type {__VLS_StyleScopedClasses['audit-item-action']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Download: Download,
            operationTypes: operationTypes,
            userPool: userPool,
            timeRange: timeRange,
            filterType: filterType,
            filterUser: filterUser,
            filterResult: filterResult,
            onlyAbnormal: onlyAbnormal,
            currentPage: currentPage,
            pageSize: pageSize,
            traceVisible: traceVisible,
            currentLog: currentLog,
            filteredLogs: filteredLogs,
            pagedLogs: pagedLogs,
            changePage: changePage,
            openTrace: openTrace,
            exportEvidence: exportEvidence,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
