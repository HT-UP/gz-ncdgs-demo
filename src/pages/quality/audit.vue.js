import { computed, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { Download, Search } from '@element-plus/icons-vue';
import { qualityAuditLogs } from '@/mock/quality';
const resultTagType = {
    已生效: 'success',
    运行中: 'warning',
    已关闭: 'info',
    通过: 'success',
    审批中: 'warning',
    已驳回: 'danger',
};
const keyword = ref('');
const filterResult = ref('');
const logs = ref([
    ...qualityAuditLogs,
    { time: '2026-08-10 14:02', user: '张三', object: '规则「站名一致性检查」', action: '试跑验证', result: '已生效' },
    { time: '2026-08-10 11:18', user: '赵六', object: '质量报告「月度质量报告」', action: '导出 PDF', result: '已关闭' },
    { time: '2026-08-09 16:44', user: '李四', object: '工单 QD-2026-0809-07', action: '驳回整改', result: '已驳回' },
    { time: '2026-08-09 09:30', user: '王工', object: '《数据安全法》合规项', action: '合规性检查', result: '通过' },
]);
const tickets = [
    { id: 'QD-2026-0811-02', desc: 'ticket_sale.flow_count 存在 12 条负值', status: '处理中', statusType: 'warning', time: '2026-08-11 03:02', owner: '张三' },
    { id: 'QD-2026-0811-03', desc: 'passenger_info.phone 格式异常 26 条', status: '待处理', statusType: 'info', time: '2026-08-11 03:02', owner: '李四' },
    { id: 'QD-2026-0810-05', desc: 'station_info.station_name 编码不规范', status: '已关闭', statusType: 'success', time: '2026-08-10 17:40', owner: '王工' },
];
const complianceItems = [
    { regulation: '《数据安全法》', description: '建立数据分类分级保护制度，敏感数据安全审计', mappedRules: '完整性4项 / 准确性6项', status: '通过', evidence: '审计日志-2026Q2 PDF' },
    { regulation: '《个人信息保护法》', description: '个人信息处理全流程可追溯，脱敏合规', mappedRules: '脱敏一致性8项 / 唯一性3项', status: '通过', evidence: '合规检查报告-08月' },
    { regulation: '《网络安全法》', description: '汇聚数据的安全技术措施与日志留存', mappedRules: '及时性5项 / 完整性2项', status: '整改中', evidence: '整改计划-V2 PDF' },
    { regulation: '《数据出境安全评估办法》', description: '重要数据出境安全评估与备案', mappedRules: '一致性6项', status: '通过', evidence: '评估备案表-01' },
];
const filteredLogs = computed(() => logs.value.filter((log) => {
    if (filterResult.value && log.result !== filterResult.value)
        return false;
    if (!keyword.value)
        return true;
    const kw = keyword.value.toLowerCase();
    return (log.user.toLowerCase().includes(kw) ||
        log.object.toLowerCase().includes(kw) ||
        log.action.toLowerCase().includes(kw));
}));
const exportAudit = () => {
    ElMessage.success('审计证据归档包已导出（Mock）');
};
const generateReport = () => {
    ElMessage.success('合规报告已生成并归档（Mock）');
};
const viewEvidence = (row) => {
    ElMessage.info(`正在打开审计证据：${row.evidence}（Mock）`);
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "standard-page" },
});
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
    span: (16),
}));
const __VLS_6 = __VLS_5({
    span: (16),
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
__VLS_7.slots.default;
const __VLS_8 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    ...{ class: "panel-card dashboard-card" },
    shadow: "never",
}));
const __VLS_10 = __VLS_9({
    ...{ class: "panel-card dashboard-card" },
    shadow: "never",
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
__VLS_11.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_11.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    const __VLS_12 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
        ...{ 'onClick': {} },
        type: "danger",
        icon: (__VLS_ctx.Download),
    }));
    const __VLS_14 = __VLS_13({
        ...{ 'onClick': {} },
        type: "danger",
        icon: (__VLS_ctx.Download),
    }, ...__VLS_functionalComponentArgsRest(__VLS_13));
    let __VLS_16;
    let __VLS_17;
    let __VLS_18;
    const __VLS_19 = {
        onClick: (__VLS_ctx.exportAudit)
    };
    __VLS_15.slots.default;
    var __VLS_15;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "toolbar-row" },
});
const __VLS_20 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
    modelValue: (__VLS_ctx.keyword),
    placeholder: "按操作人 / 对象 / 操作搜索",
    clearable: true,
    ...{ class: "search-input" },
    prefixIcon: (__VLS_ctx.Search),
}));
const __VLS_22 = __VLS_21({
    modelValue: (__VLS_ctx.keyword),
    placeholder: "按操作人 / 对象 / 操作搜索",
    clearable: true,
    ...{ class: "search-input" },
    prefixIcon: (__VLS_ctx.Search),
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
const __VLS_24 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    modelValue: (__VLS_ctx.filterResult),
    placeholder: "结果",
    clearable: true,
    ...{ class: "filter-select" },
}));
const __VLS_26 = __VLS_25({
    modelValue: (__VLS_ctx.filterResult),
    placeholder: "结果",
    clearable: true,
    ...{ class: "filter-select" },
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
__VLS_27.slots.default;
const __VLS_28 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
    label: "已生效",
    value: "已生效",
}));
const __VLS_30 = __VLS_29({
    label: "已生效",
    value: "已生效",
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
const __VLS_32 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
    label: "运行中",
    value: "运行中",
}));
const __VLS_34 = __VLS_33({
    label: "运行中",
    value: "运行中",
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
const __VLS_36 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    label: "已关闭",
    value: "已关闭",
}));
const __VLS_38 = __VLS_37({
    label: "已关闭",
    value: "已关闭",
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
const __VLS_40 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
    label: "通过",
    value: "通过",
}));
const __VLS_42 = __VLS_41({
    label: "通过",
    value: "通过",
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
const __VLS_44 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    label: "审批中",
    value: "审批中",
}));
const __VLS_46 = __VLS_45({
    label: "审批中",
    value: "审批中",
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
var __VLS_27;
const __VLS_48 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
    data: (__VLS_ctx.filteredLogs),
    stripe: true,
    ...{ class: "mt-12" },
}));
const __VLS_50 = __VLS_49({
    data: (__VLS_ctx.filteredLogs),
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
    width: "150",
}));
const __VLS_54 = __VLS_53({
    prop: "time",
    label: "时间",
    width: "150",
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
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
    prop: "object",
    label: "操作对象",
    minWidth: "180",
}));
const __VLS_62 = __VLS_61({
    prop: "object",
    label: "操作对象",
    minWidth: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_61));
const __VLS_64 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
    prop: "action",
    label: "操作",
    minWidth: "170",
}));
const __VLS_66 = __VLS_65({
    prop: "action",
    label: "操作",
    minWidth: "170",
}, ...__VLS_functionalComponentArgsRest(__VLS_65));
const __VLS_68 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
    label: "结果",
    width: "100",
}));
const __VLS_70 = __VLS_69({
    label: "结果",
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_69));
__VLS_71.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_71.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_72 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
        type: (__VLS_ctx.resultTagType[row.result]),
        effect: "dark",
    }));
    const __VLS_74 = __VLS_73({
        type: (__VLS_ctx.resultTagType[row.result]),
        effect: "dark",
    }, ...__VLS_functionalComponentArgsRest(__VLS_73));
    __VLS_75.slots.default;
    (row.result);
    var __VLS_75;
}
var __VLS_71;
var __VLS_51;
const __VLS_76 = {}.ElPagination;
/** @type {[typeof __VLS_components.ElPagination, typeof __VLS_components.elPagination, ]} */ ;
// @ts-ignore
const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
    ...{ class: "pager" },
    layout: "total, prev, pager, next",
    total: (__VLS_ctx.filteredLogs.length),
    pageSize: (20),
    background: true,
}));
const __VLS_78 = __VLS_77({
    ...{ class: "pager" },
    layout: "total, prev, pager, next",
    total: (__VLS_ctx.filteredLogs.length),
    pageSize: (20),
    background: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_77));
var __VLS_11;
var __VLS_7;
const __VLS_80 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
    span: (8),
}));
const __VLS_82 = __VLS_81({
    span: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_81));
__VLS_83.slots.default;
const __VLS_84 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
    ...{ class: "panel-card dashboard-card" },
    shadow: "never",
}));
const __VLS_86 = __VLS_85({
    ...{ class: "panel-card dashboard-card" },
    shadow: "never",
}, ...__VLS_functionalComponentArgsRest(__VLS_85));
__VLS_87.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_87.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
}
for (const [ticket] of __VLS_getVForSourceType((__VLS_ctx.tickets))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (ticket.id),
        ...{ class: "ticket-item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "ticket-head" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "ticket-id" },
    });
    (ticket.id);
    const __VLS_88 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
        size: "small",
        type: (ticket.statusType),
        effect: "plain",
    }));
    const __VLS_90 = __VLS_89({
        size: "small",
        type: (ticket.statusType),
        effect: "plain",
    }, ...__VLS_functionalComponentArgsRest(__VLS_89));
    __VLS_91.slots.default;
    (ticket.status);
    var __VLS_91;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "ticket-desc" },
    });
    (ticket.desc);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "ticket-meta" },
    });
    (ticket.time);
    (ticket.owner);
}
var __VLS_87;
var __VLS_83;
var __VLS_3;
const __VLS_92 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
    ...{ class: "panel-card dashboard-card mt-16" },
    shadow: "never",
}));
const __VLS_94 = __VLS_93({
    ...{ class: "panel-card dashboard-card mt-16" },
    shadow: "never",
}, ...__VLS_functionalComponentArgsRest(__VLS_93));
__VLS_95.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_95.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    const __VLS_96 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
        ...{ 'onClick': {} },
        type: "danger",
        size: "small",
    }));
    const __VLS_98 = __VLS_97({
        ...{ 'onClick': {} },
        type: "danger",
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_97));
    let __VLS_100;
    let __VLS_101;
    let __VLS_102;
    const __VLS_103 = {
        onClick: (__VLS_ctx.generateReport)
    };
    __VLS_99.slots.default;
    var __VLS_99;
}
const __VLS_104 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
    data: (__VLS_ctx.complianceItems),
    stripe: true,
}));
const __VLS_106 = __VLS_105({
    data: (__VLS_ctx.complianceItems),
    stripe: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_105));
__VLS_107.slots.default;
const __VLS_108 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
    prop: "regulation",
    label: "监管要求",
    minWidth: "180",
}));
const __VLS_110 = __VLS_109({
    prop: "regulation",
    label: "监管要求",
    minWidth: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_109));
const __VLS_112 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
    prop: "description",
    label: "要求说明",
    minWidth: "220",
}));
const __VLS_114 = __VLS_113({
    prop: "description",
    label: "要求说明",
    minWidth: "220",
}, ...__VLS_functionalComponentArgsRest(__VLS_113));
const __VLS_116 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
    label: "映射质量规则",
    minWidth: "180",
}));
const __VLS_118 = __VLS_117({
    label: "映射质量规则",
    minWidth: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_117));
__VLS_119.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_119.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    (row.mappedRules);
}
var __VLS_119;
const __VLS_120 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({
    label: "状态",
    width: "100",
}));
const __VLS_122 = __VLS_121({
    label: "状态",
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_121));
__VLS_123.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_123.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_124 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({
        type: (row.status === '通过' ? 'success' : row.status === '整改中' ? 'warning' : 'danger'),
        effect: "dark",
    }));
    const __VLS_126 = __VLS_125({
        type: (row.status === '通过' ? 'success' : row.status === '整改中' ? 'warning' : 'danger'),
        effect: "dark",
    }, ...__VLS_functionalComponentArgsRest(__VLS_125));
    __VLS_127.slots.default;
    (row.status);
    var __VLS_127;
}
var __VLS_123;
const __VLS_128 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({
    prop: "evidence",
    label: "审计证据",
    width: "130",
}));
const __VLS_130 = __VLS_129({
    prop: "evidence",
    label: "审计证据",
    width: "130",
}, ...__VLS_functionalComponentArgsRest(__VLS_129));
__VLS_131.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_131.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_132 = {}.ElLink;
    /** @type {[typeof __VLS_components.ElLink, typeof __VLS_components.elLink, typeof __VLS_components.ElLink, typeof __VLS_components.elLink, ]} */ ;
    // @ts-ignore
    const __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132({
        ...{ 'onClick': {} },
        underline: (false),
        type: "primary",
    }));
    const __VLS_134 = __VLS_133({
        ...{ 'onClick': {} },
        underline: (false),
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_133));
    let __VLS_136;
    let __VLS_137;
    let __VLS_138;
    const __VLS_139 = {
        onClick: (...[$event]) => {
            __VLS_ctx.viewEvidence(row);
        }
    };
    __VLS_135.slots.default;
    (row.evidence);
    var __VLS_135;
}
var __VLS_131;
var __VLS_107;
var __VLS_95;
/** @type {__VLS_StyleScopedClasses['standard-page']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['toolbar-row']} */ ;
/** @type {__VLS_StyleScopedClasses['search-input']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-select']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-12']} */ ;
/** @type {__VLS_StyleScopedClasses['pager']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['ticket-item']} */ ;
/** @type {__VLS_StyleScopedClasses['ticket-head']} */ ;
/** @type {__VLS_StyleScopedClasses['ticket-id']} */ ;
/** @type {__VLS_StyleScopedClasses['ticket-desc']} */ ;
/** @type {__VLS_StyleScopedClasses['ticket-meta']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Download: Download,
            Search: Search,
            resultTagType: resultTagType,
            keyword: keyword,
            filterResult: filterResult,
            tickets: tickets,
            complianceItems: complianceItems,
            filteredLogs: filteredLogs,
            exportAudit: exportAudit,
            generateReport: generateReport,
            viewEvidence: viewEvidence,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
