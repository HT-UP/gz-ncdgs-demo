import { computed, ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { Download } from '@element-plus/icons-vue';
import { mockOperationLogs } from '@/mock/system';
const operationTypes = ['登录', '查询', '修改', '删除', '审批'];
const userPool = ['张三', '李四', '王五', '赵六', 'admin', '孙七'];
const tenantPool = ['广州地铁设计研究院', '轨道运营管理公司', '广州盾构工程公司', '市交通运输局', '华南理工大学课题组'];
const timeRange = ref([]);
const filterType = ref('');
const filterUser = ref('');
const filterTenant = ref('');
const filterResult = ref('');
const onlyAbnormal = ref(false);
const currentPage = ref(1);
const pageSize = 20;
const detailVisible = ref(false);
const logs = ref([...mockOperationLogs]);
const currentLog = ref(null);
const filteredLogs = computed(() => logs.value.filter((log) => {
    if (onlyAbnormal.value && !log.abnormal)
        return false;
    if (filterType.value && log.operationType !== filterType.value)
        return false;
    if (filterUser.value && log.user !== filterUser.value)
        return false;
    if (filterTenant.value && log.tenant !== filterTenant.value)
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
watch([timeRange, filterType, filterUser, filterTenant, filterResult, onlyAbnormal], () => {
    currentPage.value = 1;
});
const openDetail = (row) => {
    currentLog.value = row;
    detailVisible.value = true;
};
const exportLogs = () => ElMessage.success('操作日志已导出为 Excel（Mock）');
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
        icon: (__VLS_ctx.Download),
    }));
    const __VLS_6 = __VLS_5({
        ...{ 'onClick': {} },
        icon: (__VLS_ctx.Download),
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
    modelValue: (__VLS_ctx.filterTenant),
    placeholder: "租户",
    clearable: true,
    ...{ class: "filter-select" },
}));
const __VLS_34 = __VLS_33({
    modelValue: (__VLS_ctx.filterTenant),
    placeholder: "租户",
    clearable: true,
    ...{ class: "filter-select" },
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
__VLS_35.slots.default;
for (const [tenant] of __VLS_getVForSourceType((__VLS_ctx.tenantPool))) {
    const __VLS_36 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
        key: (tenant),
        label: (tenant),
        value: (tenant),
    }));
    const __VLS_38 = __VLS_37({
        key: (tenant),
        label: (tenant),
        value: (tenant),
    }, ...__VLS_functionalComponentArgsRest(__VLS_37));
}
var __VLS_35;
const __VLS_40 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
    modelValue: (__VLS_ctx.filterResult),
    placeholder: "结果",
    clearable: true,
    ...{ class: "filter-select" },
}));
const __VLS_42 = __VLS_41({
    modelValue: (__VLS_ctx.filterResult),
    placeholder: "结果",
    clearable: true,
    ...{ class: "filter-select" },
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
__VLS_43.slots.default;
const __VLS_44 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    label: "成功",
    value: "成功",
}));
const __VLS_46 = __VLS_45({
    label: "成功",
    value: "成功",
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
const __VLS_48 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
    label: "失败",
    value: "失败",
}));
const __VLS_50 = __VLS_49({
    label: "失败",
    value: "失败",
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
var __VLS_43;
const __VLS_52 = {}.ElCheckbox;
/** @type {[typeof __VLS_components.ElCheckbox, typeof __VLS_components.elCheckbox, typeof __VLS_components.ElCheckbox, typeof __VLS_components.elCheckbox, ]} */ ;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
    modelValue: (__VLS_ctx.onlyAbnormal),
    ...{ class: "filter-check" },
}));
const __VLS_54 = __VLS_53({
    modelValue: (__VLS_ctx.onlyAbnormal),
    ...{ class: "filter-check" },
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
__VLS_55.slots.default;
var __VLS_55;
const __VLS_56 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
    data: (__VLS_ctx.pagedLogs),
    stripe: true,
    ...{ class: "mt-12" },
    size: "small",
}));
const __VLS_58 = __VLS_57({
    data: (__VLS_ctx.pagedLogs),
    stripe: true,
    ...{ class: "mt-12" },
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
__VLS_59.slots.default;
const __VLS_60 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
    prop: "time",
    label: "时间",
    width: "160",
}));
const __VLS_62 = __VLS_61({
    prop: "time",
    label: "时间",
    width: "160",
}, ...__VLS_functionalComponentArgsRest(__VLS_61));
const __VLS_64 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
    prop: "user",
    label: "操作人",
    width: "80",
}));
const __VLS_66 = __VLS_65({
    prop: "user",
    label: "操作人",
    width: "80",
}, ...__VLS_functionalComponentArgsRest(__VLS_65));
const __VLS_68 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
    prop: "tenant",
    label: "租户",
    minWidth: "130",
}));
const __VLS_70 = __VLS_69({
    prop: "tenant",
    label: "租户",
    minWidth: "130",
}, ...__VLS_functionalComponentArgsRest(__VLS_69));
const __VLS_72 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
    label: "操作类型",
    width: "90",
}));
const __VLS_74 = __VLS_73({
    label: "操作类型",
    width: "90",
}, ...__VLS_functionalComponentArgsRest(__VLS_73));
__VLS_75.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_75.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_76 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
        size: "small",
        effect: "plain",
    }));
    const __VLS_78 = __VLS_77({
        size: "small",
        effect: "plain",
    }, ...__VLS_functionalComponentArgsRest(__VLS_77));
    __VLS_79.slots.default;
    (row.operationType);
    var __VLS_79;
}
var __VLS_75;
const __VLS_80 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
    prop: "action",
    label: "操作",
    minWidth: "110",
}));
const __VLS_82 = __VLS_81({
    prop: "action",
    label: "操作",
    minWidth: "110",
}, ...__VLS_functionalComponentArgsRest(__VLS_81));
const __VLS_84 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
    prop: "object",
    label: "操作对象",
    minWidth: "130",
}));
const __VLS_86 = __VLS_85({
    prop: "object",
    label: "操作对象",
    minWidth: "130",
}, ...__VLS_functionalComponentArgsRest(__VLS_85));
const __VLS_88 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
    label: "结果",
    width: "70",
}));
const __VLS_90 = __VLS_89({
    label: "结果",
    width: "70",
}, ...__VLS_functionalComponentArgsRest(__VLS_89));
__VLS_91.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_91.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: (row.result === '成功' ? 'audit-success' : 'audit-fail') },
    });
    (row.result);
}
var __VLS_91;
const __VLS_92 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
    prop: "ip",
    label: "IP",
    width: "120",
}));
const __VLS_94 = __VLS_93({
    prop: "ip",
    label: "IP",
    width: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_93));
const __VLS_96 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
    prop: "duration",
    label: "耗时",
    width: "80",
}));
const __VLS_98 = __VLS_97({
    prop: "duration",
    label: "耗时",
    width: "80",
}, ...__VLS_functionalComponentArgsRest(__VLS_97));
const __VLS_100 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
    label: "异常",
    width: "60",
    align: "center",
}));
const __VLS_102 = __VLS_101({
    label: "异常",
    width: "60",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_101));
__VLS_103.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_103.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    if (row.abnormal) {
        const __VLS_104 = {}.ElTag;
        /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
        // @ts-ignore
        const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
            type: "danger",
            size: "small",
            effect: "dark",
        }));
        const __VLS_106 = __VLS_105({
            type: "danger",
            size: "small",
            effect: "dark",
        }, ...__VLS_functionalComponentArgsRest(__VLS_105));
        __VLS_107.slots.default;
        var __VLS_107;
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "dep-text" },
        });
    }
}
var __VLS_103;
const __VLS_108 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
    label: "操作",
    width: "80",
    fixed: "right",
}));
const __VLS_110 = __VLS_109({
    label: "操作",
    width: "80",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_109));
__VLS_111.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_111.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_112 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }));
    const __VLS_114 = __VLS_113({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_113));
    let __VLS_116;
    let __VLS_117;
    let __VLS_118;
    const __VLS_119 = {
        onClick: (...[$event]) => {
            __VLS_ctx.openDetail(row);
        }
    };
    __VLS_115.slots.default;
    var __VLS_115;
}
var __VLS_111;
var __VLS_59;
const __VLS_120 = {}.ElPagination;
/** @type {[typeof __VLS_components.ElPagination, typeof __VLS_components.elPagination, ]} */ ;
// @ts-ignore
const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({
    ...{ 'onCurrentChange': {} },
    ...{ class: "pager" },
    layout: "total, prev, pager, next",
    total: (__VLS_ctx.filteredLogs.length),
    pageSize: (__VLS_ctx.pageSize),
    currentPage: (__VLS_ctx.currentPage),
    background: true,
}));
const __VLS_122 = __VLS_121({
    ...{ 'onCurrentChange': {} },
    ...{ class: "pager" },
    layout: "total, prev, pager, next",
    total: (__VLS_ctx.filteredLogs.length),
    pageSize: (__VLS_ctx.pageSize),
    currentPage: (__VLS_ctx.currentPage),
    background: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_121));
let __VLS_124;
let __VLS_125;
let __VLS_126;
const __VLS_127 = {
    onCurrentChange: (__VLS_ctx.changePage)
};
var __VLS_123;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "retention-note" },
});
var __VLS_3;
const __VLS_128 = {}.ElDrawer;
/** @type {[typeof __VLS_components.ElDrawer, typeof __VLS_components.elDrawer, typeof __VLS_components.ElDrawer, typeof __VLS_components.elDrawer, ]} */ ;
// @ts-ignore
const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({
    modelValue: (__VLS_ctx.detailVisible),
    title: "日志详情",
    size: "560px",
}));
const __VLS_130 = __VLS_129({
    modelValue: (__VLS_ctx.detailVisible),
    title: "日志详情",
    size: "560px",
}, ...__VLS_functionalComponentArgsRest(__VLS_129));
__VLS_131.slots.default;
if (__VLS_ctx.currentLog) {
    if (__VLS_ctx.currentLog.abnormal) {
        const __VLS_132 = {}.ElAlert;
        /** @type {[typeof __VLS_components.ElAlert, typeof __VLS_components.elAlert, ]} */ ;
        // @ts-ignore
        const __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132({
            title: "该操作已标记为异常行为并触发告警通知",
            type: "error",
            closable: (false),
            ...{ class: "mb-16" },
        }));
        const __VLS_134 = __VLS_133({
            title: "该操作已标记为异常行为并触发告警通知",
            type: "error",
            closable: (false),
            ...{ class: "mb-16" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_133));
    }
    const __VLS_136 = {}.ElDescriptions;
    /** @type {[typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, ]} */ ;
    // @ts-ignore
    const __VLS_137 = __VLS_asFunctionalComponent(__VLS_136, new __VLS_136({
        column: (1),
        border: true,
        size: "small",
    }));
    const __VLS_138 = __VLS_137({
        column: (1),
        border: true,
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_137));
    __VLS_139.slots.default;
    const __VLS_140 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_141 = __VLS_asFunctionalComponent(__VLS_140, new __VLS_140({
        label: "操作人",
    }));
    const __VLS_142 = __VLS_141({
        label: "操作人",
    }, ...__VLS_functionalComponentArgsRest(__VLS_141));
    __VLS_143.slots.default;
    (__VLS_ctx.currentLog.user);
    var __VLS_143;
    const __VLS_144 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_145 = __VLS_asFunctionalComponent(__VLS_144, new __VLS_144({
        label: "所属租户",
    }));
    const __VLS_146 = __VLS_145({
        label: "所属租户",
    }, ...__VLS_functionalComponentArgsRest(__VLS_145));
    __VLS_147.slots.default;
    (__VLS_ctx.currentLog.tenant);
    var __VLS_147;
    const __VLS_148 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_149 = __VLS_asFunctionalComponent(__VLS_148, new __VLS_148({
        label: "时间",
    }));
    const __VLS_150 = __VLS_149({
        label: "时间",
    }, ...__VLS_functionalComponentArgsRest(__VLS_149));
    __VLS_151.slots.default;
    (__VLS_ctx.currentLog.time);
    var __VLS_151;
    const __VLS_152 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_153 = __VLS_asFunctionalComponent(__VLS_152, new __VLS_152({
        label: "操作类型",
    }));
    const __VLS_154 = __VLS_153({
        label: "操作类型",
    }, ...__VLS_functionalComponentArgsRest(__VLS_153));
    __VLS_155.slots.default;
    (__VLS_ctx.currentLog.operationType);
    var __VLS_155;
    const __VLS_156 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_157 = __VLS_asFunctionalComponent(__VLS_156, new __VLS_156({
        label: "操作内容",
    }));
    const __VLS_158 = __VLS_157({
        label: "操作内容",
    }, ...__VLS_functionalComponentArgsRest(__VLS_157));
    __VLS_159.slots.default;
    (__VLS_ctx.currentLog.action);
    var __VLS_159;
    const __VLS_160 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_161 = __VLS_asFunctionalComponent(__VLS_160, new __VLS_160({
        label: "操作对象",
    }));
    const __VLS_162 = __VLS_161({
        label: "操作对象",
    }, ...__VLS_functionalComponentArgsRest(__VLS_161));
    __VLS_163.slots.default;
    (__VLS_ctx.currentLog.object);
    var __VLS_163;
    const __VLS_164 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_165 = __VLS_asFunctionalComponent(__VLS_164, new __VLS_164({
        label: "来源 IP",
    }));
    const __VLS_166 = __VLS_165({
        label: "来源 IP",
    }, ...__VLS_functionalComponentArgsRest(__VLS_165));
    __VLS_167.slots.default;
    (__VLS_ctx.currentLog.ip);
    var __VLS_167;
    const __VLS_168 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_169 = __VLS_asFunctionalComponent(__VLS_168, new __VLS_168({
        label: "耗时",
    }));
    const __VLS_170 = __VLS_169({
        label: "耗时",
    }, ...__VLS_functionalComponentArgsRest(__VLS_169));
    __VLS_171.slots.default;
    (__VLS_ctx.currentLog.duration);
    var __VLS_171;
    var __VLS_139;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "section-title mt-16" },
    });
    const __VLS_172 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_173 = __VLS_asFunctionalComponent(__VLS_172, new __VLS_172({
        modelValue: (__VLS_ctx.currentLog.params),
        type: "textarea",
        rows: (3),
        readonly: true,
        ...{ class: "mt-8" },
    }));
    const __VLS_174 = __VLS_173({
        modelValue: (__VLS_ctx.currentLog.params),
        type: "textarea",
        rows: (3),
        readonly: true,
        ...{ class: "mt-8" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_173));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "section-title mt-16" },
    });
    const __VLS_176 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_177 = __VLS_asFunctionalComponent(__VLS_176, new __VLS_176({
        modelValue: (__VLS_ctx.currentLog.response),
        type: "textarea",
        rows: (3),
        readonly: true,
        ...{ class: "mt-8" },
    }));
    const __VLS_178 = __VLS_177({
        modelValue: (__VLS_ctx.currentLog.response),
        type: "textarea",
        rows: (3),
        readonly: true,
        ...{ class: "mt-8" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_177));
}
var __VLS_131;
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
/** @type {__VLS_StyleScopedClasses['filter-select']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-check']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-12']} */ ;
/** @type {__VLS_StyleScopedClasses['dep-text']} */ ;
/** @type {__VLS_StyleScopedClasses['pager']} */ ;
/** @type {__VLS_StyleScopedClasses['retention-note']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Download: Download,
            operationTypes: operationTypes,
            userPool: userPool,
            tenantPool: tenantPool,
            timeRange: timeRange,
            filterType: filterType,
            filterUser: filterUser,
            filterTenant: filterTenant,
            filterResult: filterResult,
            onlyAbnormal: onlyAbnormal,
            currentPage: currentPage,
            pageSize: pageSize,
            detailVisible: detailVisible,
            currentLog: currentLog,
            filteredLogs: filteredLogs,
            pagedLogs: pagedLogs,
            changePage: changePage,
            openDetail: openDetail,
            exportLogs: exportLogs,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
