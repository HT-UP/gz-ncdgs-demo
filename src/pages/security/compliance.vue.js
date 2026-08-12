import { computed, ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { DocumentCopy, Search } from '@element-plus/icons-vue';
import { mockComplianceItems } from '@/mock/security';
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
const riskList = [
    { id: 'RISK-2026-01', title: '重要数据未配置密钥自动轮换', stage: '验证中', stageTag: 'primary', activeStep: 3, updateTime: '2026-08-12 09:30', owner: '张工' },
    { id: 'RISK-2026-02', title: '个人信息导出流程缺少审批留痕', stage: '整改中', stageTag: 'warning', activeStep: 2, updateTime: '2026-08-11 16:20', owner: '李工' },
    { id: 'RISK-2026-03', title: '数据出境场景未完成安全评估', stage: '工单中', stageTag: 'info', activeStep: 1, updateTime: '2026-08-10 11:00', owner: '王工' },
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
const generateReport = () => {
    ElMessage.success('合规检查报告已生成，包含 4 项风险清单（Mock）');
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
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-actions" },
    });
    const __VLS_12 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
        ...{ 'onClick': {} },
        type: "primary",
        plain: true,
        size: "small",
    }));
    const __VLS_14 = __VLS_13({
        ...{ 'onClick': {} },
        type: "primary",
        plain: true,
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_13));
    let __VLS_16;
    let __VLS_17;
    let __VLS_18;
    const __VLS_19 = {
        onClick: (__VLS_ctx.autoCheck)
    };
    __VLS_15.slots.default;
    var __VLS_15;
    const __VLS_20 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
        ...{ 'onClick': {} },
        type: "danger",
        icon: (__VLS_ctx.DocumentCopy),
    }));
    const __VLS_22 = __VLS_21({
        ...{ 'onClick': {} },
        type: "danger",
        icon: (__VLS_ctx.DocumentCopy),
    }, ...__VLS_functionalComponentArgsRest(__VLS_21));
    let __VLS_24;
    let __VLS_25;
    let __VLS_26;
    const __VLS_27 = {
        onClick: (__VLS_ctx.generateReport)
    };
    __VLS_23.slots.default;
    var __VLS_23;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "toolbar-row" },
});
const __VLS_28 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
    modelValue: (__VLS_ctx.keyword),
    placeholder: "按法规 / 条款 / 映射功能搜索",
    clearable: true,
    ...{ class: "search-input" },
    prefixIcon: (__VLS_ctx.Search),
}));
const __VLS_30 = __VLS_29({
    modelValue: (__VLS_ctx.keyword),
    placeholder: "按法规 / 条款 / 映射功能搜索",
    clearable: true,
    ...{ class: "search-input" },
    prefixIcon: (__VLS_ctx.Search),
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
const __VLS_32 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
    modelValue: (__VLS_ctx.filterStatus),
    placeholder: "状态",
    clearable: true,
    ...{ class: "filter-select" },
}));
const __VLS_34 = __VLS_33({
    modelValue: (__VLS_ctx.filterStatus),
    placeholder: "状态",
    clearable: true,
    ...{ class: "filter-select" },
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
__VLS_35.slots.default;
const __VLS_36 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    label: "合规",
    value: "合规",
}));
const __VLS_38 = __VLS_37({
    label: "合规",
    value: "合规",
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
const __VLS_40 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
    label: "不合规",
    value: "不合规",
}));
const __VLS_42 = __VLS_41({
    label: "不合规",
    value: "不合规",
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
const __VLS_44 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    label: "待整改",
    value: "待整改",
}));
const __VLS_46 = __VLS_45({
    label: "待整改",
    value: "待整改",
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
var __VLS_35;
const __VLS_48 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
    modelValue: (__VLS_ctx.filterRisk),
    placeholder: "风险等级",
    clearable: true,
    ...{ class: "filter-select" },
}));
const __VLS_50 = __VLS_49({
    modelValue: (__VLS_ctx.filterRisk),
    placeholder: "风险等级",
    clearable: true,
    ...{ class: "filter-select" },
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
__VLS_51.slots.default;
const __VLS_52 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
    label: "高",
    value: "高",
}));
const __VLS_54 = __VLS_53({
    label: "高",
    value: "高",
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
const __VLS_56 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
    label: "中",
    value: "中",
}));
const __VLS_58 = __VLS_57({
    label: "中",
    value: "中",
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
const __VLS_60 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
    label: "低",
    value: "低",
}));
const __VLS_62 = __VLS_61({
    label: "低",
    value: "低",
}, ...__VLS_functionalComponentArgsRest(__VLS_61));
var __VLS_51;
const __VLS_64 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
    data: (__VLS_ctx.pagedItems),
    stripe: true,
    ...{ class: "mt-12" },
}));
const __VLS_66 = __VLS_65({
    data: (__VLS_ctx.pagedItems),
    stripe: true,
    ...{ class: "mt-12" },
}, ...__VLS_functionalComponentArgsRest(__VLS_65));
__VLS_67.slots.default;
const __VLS_68 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
    prop: "regulation",
    label: "法规",
    width: "170",
}));
const __VLS_70 = __VLS_69({
    prop: "regulation",
    label: "法规",
    width: "170",
}, ...__VLS_functionalComponentArgsRest(__VLS_69));
const __VLS_72 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
    prop: "clause",
    label: "条款",
    width: "140",
}));
const __VLS_74 = __VLS_73({
    prop: "clause",
    label: "条款",
    width: "140",
}, ...__VLS_functionalComponentArgsRest(__VLS_73));
const __VLS_76 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
    prop: "requirement",
    label: "要求说明",
    minWidth: "200",
}));
const __VLS_78 = __VLS_77({
    prop: "requirement",
    label: "要求说明",
    minWidth: "200",
}, ...__VLS_functionalComponentArgsRest(__VLS_77));
const __VLS_80 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
    prop: "mappedFeature",
    label: "映射系统功能",
    width: "140",
}));
const __VLS_82 = __VLS_81({
    prop: "mappedFeature",
    label: "映射系统功能",
    width: "140",
}, ...__VLS_functionalComponentArgsRest(__VLS_81));
const __VLS_84 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
    label: "状态",
    width: "90",
}));
const __VLS_86 = __VLS_85({
    label: "状态",
    width: "90",
}, ...__VLS_functionalComponentArgsRest(__VLS_85));
__VLS_87.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_87.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_88 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
        type: (__VLS_ctx.complianceStatusTag[row.status]),
        effect: "dark",
    }));
    const __VLS_90 = __VLS_89({
        type: (__VLS_ctx.complianceStatusTag[row.status]),
        effect: "dark",
    }, ...__VLS_functionalComponentArgsRest(__VLS_89));
    __VLS_91.slots.default;
    (row.status);
    var __VLS_91;
}
var __VLS_87;
const __VLS_92 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
    label: "风险",
    width: "90",
}));
const __VLS_94 = __VLS_93({
    label: "风险",
    width: "90",
}, ...__VLS_functionalComponentArgsRest(__VLS_93));
__VLS_95.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_95.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "security-level" },
        ...{ style: ({ background: __VLS_ctx.levelColor[row.riskLevel] }) },
    });
    (row.riskLevel);
}
var __VLS_95;
const __VLS_96 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
    label: "操作",
    width: "150",
    fixed: "right",
}));
const __VLS_98 = __VLS_97({
    label: "操作",
    width: "150",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_97));
__VLS_99.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_99.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    if (row.riskId) {
        const __VLS_100 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
            ...{ 'onClick': {} },
            link: true,
            type: "warning",
        }));
        const __VLS_102 = __VLS_101({
            ...{ 'onClick': {} },
            link: true,
            type: "warning",
        }, ...__VLS_functionalComponentArgsRest(__VLS_101));
        let __VLS_104;
        let __VLS_105;
        let __VLS_106;
        const __VLS_107 = {
            onClick: (...[$event]) => {
                if (!(row.riskId))
                    return;
                __VLS_ctx.openRisk(row);
            }
        };
        __VLS_103.slots.default;
        var __VLS_103;
    }
    const __VLS_108 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }));
    const __VLS_110 = __VLS_109({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_109));
    let __VLS_112;
    let __VLS_113;
    let __VLS_114;
    const __VLS_115 = {
        onClick: (...[$event]) => {
            __VLS_ctx.viewEvidence(row);
        }
    };
    __VLS_111.slots.default;
    var __VLS_111;
}
var __VLS_99;
var __VLS_67;
const __VLS_116 = {}.ElPagination;
/** @type {[typeof __VLS_components.ElPagination, typeof __VLS_components.elPagination, ]} */ ;
// @ts-ignore
const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
    ...{ 'onCurrentChange': {} },
    ...{ class: "pager" },
    layout: "total, prev, pager, next",
    total: (__VLS_ctx.filteredItems.length),
    pageSize: (__VLS_ctx.pageSize),
    currentPage: (__VLS_ctx.currentPage),
    background: true,
}));
const __VLS_118 = __VLS_117({
    ...{ 'onCurrentChange': {} },
    ...{ class: "pager" },
    layout: "total, prev, pager, next",
    total: (__VLS_ctx.filteredItems.length),
    pageSize: (__VLS_ctx.pageSize),
    currentPage: (__VLS_ctx.currentPage),
    background: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_117));
let __VLS_120;
let __VLS_121;
let __VLS_122;
const __VLS_123 = {
    onCurrentChange: (__VLS_ctx.changePage)
};
var __VLS_119;
var __VLS_11;
var __VLS_7;
const __VLS_124 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({
    span: (8),
}));
const __VLS_126 = __VLS_125({
    span: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_125));
__VLS_127.slots.default;
const __VLS_128 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({
    ...{ class: "panel-card dashboard-card" },
    shadow: "never",
}));
const __VLS_130 = __VLS_129({
    ...{ class: "panel-card dashboard-card" },
    shadow: "never",
}, ...__VLS_functionalComponentArgsRest(__VLS_129));
__VLS_131.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_131.slots;
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
    const __VLS_132 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132({
        size: "small",
        type: (risk.stageTag),
        effect: "plain",
    }));
    const __VLS_134 = __VLS_133({
        size: "small",
        type: (risk.stageTag),
        effect: "plain",
    }, ...__VLS_functionalComponentArgsRest(__VLS_133));
    __VLS_135.slots.default;
    (risk.stage);
    var __VLS_135;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "risk-desc" },
    });
    (risk.title);
    const __VLS_136 = {}.ElSteps;
    /** @type {[typeof __VLS_components.ElSteps, typeof __VLS_components.elSteps, typeof __VLS_components.ElSteps, typeof __VLS_components.elSteps, ]} */ ;
    // @ts-ignore
    const __VLS_137 = __VLS_asFunctionalComponent(__VLS_136, new __VLS_136({
        active: (risk.activeStep),
        size: "small",
        alignCenter: true,
        ...{ class: "risk-steps" },
    }));
    const __VLS_138 = __VLS_137({
        active: (risk.activeStep),
        size: "small",
        alignCenter: true,
        ...{ class: "risk-steps" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_137));
    __VLS_139.slots.default;
    const __VLS_140 = {}.ElStep;
    /** @type {[typeof __VLS_components.ElStep, typeof __VLS_components.elStep, ]} */ ;
    // @ts-ignore
    const __VLS_141 = __VLS_asFunctionalComponent(__VLS_140, new __VLS_140({
        title: "风险",
    }));
    const __VLS_142 = __VLS_141({
        title: "风险",
    }, ...__VLS_functionalComponentArgsRest(__VLS_141));
    const __VLS_144 = {}.ElStep;
    /** @type {[typeof __VLS_components.ElStep, typeof __VLS_components.elStep, ]} */ ;
    // @ts-ignore
    const __VLS_145 = __VLS_asFunctionalComponent(__VLS_144, new __VLS_144({
        title: "工单",
    }));
    const __VLS_146 = __VLS_145({
        title: "工单",
    }, ...__VLS_functionalComponentArgsRest(__VLS_145));
    const __VLS_148 = {}.ElStep;
    /** @type {[typeof __VLS_components.ElStep, typeof __VLS_components.elStep, ]} */ ;
    // @ts-ignore
    const __VLS_149 = __VLS_asFunctionalComponent(__VLS_148, new __VLS_148({
        title: "整改",
    }));
    const __VLS_150 = __VLS_149({
        title: "整改",
    }, ...__VLS_functionalComponentArgsRest(__VLS_149));
    const __VLS_152 = {}.ElStep;
    /** @type {[typeof __VLS_components.ElStep, typeof __VLS_components.elStep, ]} */ ;
    // @ts-ignore
    const __VLS_153 = __VLS_asFunctionalComponent(__VLS_152, new __VLS_152({
        title: "验证",
    }));
    const __VLS_154 = __VLS_153({
        title: "验证",
    }, ...__VLS_functionalComponentArgsRest(__VLS_153));
    var __VLS_139;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "dep-text" },
    });
    (risk.updateTime);
    (risk.owner);
}
var __VLS_131;
var __VLS_127;
var __VLS_3;
const __VLS_156 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_157 = __VLS_asFunctionalComponent(__VLS_156, new __VLS_156({
    modelValue: (__VLS_ctx.riskVisible),
    title: "风险整改闭环",
    width: "640px",
}));
const __VLS_158 = __VLS_157({
    modelValue: (__VLS_ctx.riskVisible),
    title: "风险整改闭环",
    width: "640px",
}, ...__VLS_functionalComponentArgsRest(__VLS_157));
__VLS_159.slots.default;
if (__VLS_ctx.currentRisk) {
    const __VLS_160 = {}.ElDescriptions;
    /** @type {[typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, ]} */ ;
    // @ts-ignore
    const __VLS_161 = __VLS_asFunctionalComponent(__VLS_160, new __VLS_160({
        column: (1),
        border: true,
        size: "small",
    }));
    const __VLS_162 = __VLS_161({
        column: (1),
        border: true,
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_161));
    __VLS_163.slots.default;
    const __VLS_164 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_165 = __VLS_asFunctionalComponent(__VLS_164, new __VLS_164({
        label: "风险编号",
    }));
    const __VLS_166 = __VLS_165({
        label: "风险编号",
    }, ...__VLS_functionalComponentArgsRest(__VLS_165));
    __VLS_167.slots.default;
    (__VLS_ctx.currentRisk.riskId);
    var __VLS_167;
    const __VLS_168 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_169 = __VLS_asFunctionalComponent(__VLS_168, new __VLS_168({
        label: "关联条款",
    }));
    const __VLS_170 = __VLS_169({
        label: "关联条款",
    }, ...__VLS_functionalComponentArgsRest(__VLS_169));
    __VLS_171.slots.default;
    (__VLS_ctx.currentRisk.regulation);
    (__VLS_ctx.currentRisk.clause);
    var __VLS_171;
    const __VLS_172 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_173 = __VLS_asFunctionalComponent(__VLS_172, new __VLS_172({
        label: "风险内容",
    }));
    const __VLS_174 = __VLS_173({
        label: "风险内容",
    }, ...__VLS_functionalComponentArgsRest(__VLS_173));
    __VLS_175.slots.default;
    (__VLS_ctx.currentRisk.requirement);
    var __VLS_175;
    const __VLS_176 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_177 = __VLS_asFunctionalComponent(__VLS_176, new __VLS_176({
        label: "责任部门",
    }));
    const __VLS_178 = __VLS_177({
        label: "责任部门",
    }, ...__VLS_functionalComponentArgsRest(__VLS_177));
    __VLS_179.slots.default;
    var __VLS_179;
    var __VLS_163;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "section-title mt-16" },
    });
    const __VLS_180 = {}.ElSteps;
    /** @type {[typeof __VLS_components.ElSteps, typeof __VLS_components.elSteps, typeof __VLS_components.ElSteps, typeof __VLS_components.elSteps, ]} */ ;
    // @ts-ignore
    const __VLS_181 = __VLS_asFunctionalComponent(__VLS_180, new __VLS_180({
        active: (2),
        alignCenter: true,
        ...{ class: "risk-steps" },
    }));
    const __VLS_182 = __VLS_181({
        active: (2),
        alignCenter: true,
        ...{ class: "risk-steps" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_181));
    __VLS_183.slots.default;
    const __VLS_184 = {}.ElStep;
    /** @type {[typeof __VLS_components.ElStep, typeof __VLS_components.elStep, ]} */ ;
    // @ts-ignore
    const __VLS_185 = __VLS_asFunctionalComponent(__VLS_184, new __VLS_184({
        title: "风险登记",
    }));
    const __VLS_186 = __VLS_185({
        title: "风险登记",
    }, ...__VLS_functionalComponentArgsRest(__VLS_185));
    const __VLS_188 = {}.ElStep;
    /** @type {[typeof __VLS_components.ElStep, typeof __VLS_components.elStep, ]} */ ;
    // @ts-ignore
    const __VLS_189 = __VLS_asFunctionalComponent(__VLS_188, new __VLS_188({
        title: "工单下发",
    }));
    const __VLS_190 = __VLS_189({
        title: "工单下发",
    }, ...__VLS_functionalComponentArgsRest(__VLS_189));
    const __VLS_192 = {}.ElStep;
    /** @type {[typeof __VLS_components.ElStep, typeof __VLS_components.elStep, ]} */ ;
    // @ts-ignore
    const __VLS_193 = __VLS_asFunctionalComponent(__VLS_192, new __VLS_192({
        title: "整改实施",
    }));
    const __VLS_194 = __VLS_193({
        title: "整改实施",
    }, ...__VLS_functionalComponentArgsRest(__VLS_193));
    const __VLS_196 = {}.ElStep;
    /** @type {[typeof __VLS_components.ElStep, typeof __VLS_components.elStep, ]} */ ;
    // @ts-ignore
    const __VLS_197 = __VLS_asFunctionalComponent(__VLS_196, new __VLS_196({
        title: "复验关闭",
    }));
    const __VLS_198 = __VLS_197({
        title: "复验关闭",
    }, ...__VLS_functionalComponentArgsRest(__VLS_197));
    var __VLS_183;
    const __VLS_200 = {}.ElTimeline;
    /** @type {[typeof __VLS_components.ElTimeline, typeof __VLS_components.elTimeline, typeof __VLS_components.ElTimeline, typeof __VLS_components.elTimeline, ]} */ ;
    // @ts-ignore
    const __VLS_201 = __VLS_asFunctionalComponent(__VLS_200, new __VLS_200({
        ...{ class: "mt-16" },
    }));
    const __VLS_202 = __VLS_201({
        ...{ class: "mt-16" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_201));
    __VLS_203.slots.default;
    const __VLS_204 = {}.ElTimelineItem;
    /** @type {[typeof __VLS_components.ElTimelineItem, typeof __VLS_components.elTimelineItem, typeof __VLS_components.ElTimelineItem, typeof __VLS_components.elTimelineItem, ]} */ ;
    // @ts-ignore
    const __VLS_205 = __VLS_asFunctionalComponent(__VLS_204, new __VLS_204({
        timestamp: "2026-08-10 10:00",
        type: "danger",
    }));
    const __VLS_206 = __VLS_205({
        timestamp: "2026-08-10 10:00",
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_205));
    __VLS_207.slots.default;
    var __VLS_207;
    const __VLS_208 = {}.ElTimelineItem;
    /** @type {[typeof __VLS_components.ElTimelineItem, typeof __VLS_components.elTimelineItem, typeof __VLS_components.ElTimelineItem, typeof __VLS_components.elTimelineItem, ]} */ ;
    // @ts-ignore
    const __VLS_209 = __VLS_asFunctionalComponent(__VLS_208, new __VLS_208({
        timestamp: "2026-08-10 15:20",
        type: "warning",
    }));
    const __VLS_210 = __VLS_209({
        timestamp: "2026-08-10 15:20",
        type: "warning",
    }, ...__VLS_functionalComponentArgsRest(__VLS_209));
    __VLS_211.slots.default;
    var __VLS_211;
    const __VLS_212 = {}.ElTimelineItem;
    /** @type {[typeof __VLS_components.ElTimelineItem, typeof __VLS_components.elTimelineItem, typeof __VLS_components.ElTimelineItem, typeof __VLS_components.elTimelineItem, ]} */ ;
    // @ts-ignore
    const __VLS_213 = __VLS_asFunctionalComponent(__VLS_212, new __VLS_212({
        timestamp: "2026-08-12 09:30",
        type: "primary",
    }));
    const __VLS_214 = __VLS_213({
        timestamp: "2026-08-12 09:30",
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_213));
    __VLS_215.slots.default;
    var __VLS_215;
    var __VLS_203;
}
{
    const { footer: __VLS_thisSlot } = __VLS_159.slots;
    const __VLS_216 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_217 = __VLS_asFunctionalComponent(__VLS_216, new __VLS_216({
        ...{ 'onClick': {} },
        type: "primary",
        plain: true,
    }));
    const __VLS_218 = __VLS_217({
        ...{ 'onClick': {} },
        type: "primary",
        plain: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_217));
    let __VLS_220;
    let __VLS_221;
    let __VLS_222;
    const __VLS_223 = {
        onClick: (__VLS_ctx.closeRisk)
    };
    __VLS_219.slots.default;
    var __VLS_219;
    const __VLS_224 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_225 = __VLS_asFunctionalComponent(__VLS_224, new __VLS_224({
        ...{ 'onClick': {} },
        type: "danger",
    }));
    const __VLS_226 = __VLS_225({
        ...{ 'onClick': {} },
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_225));
    let __VLS_228;
    let __VLS_229;
    let __VLS_230;
    const __VLS_231 = {
        onClick: (__VLS_ctx.exportRiskEvidence)
    };
    __VLS_227.slots.default;
    var __VLS_227;
}
var __VLS_159;
/** @type {__VLS_StyleScopedClasses['standard-page']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['toolbar-row']} */ ;
/** @type {__VLS_StyleScopedClasses['search-input']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-select']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-select']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-12']} */ ;
/** @type {__VLS_StyleScopedClasses['security-level']} */ ;
/** @type {__VLS_StyleScopedClasses['pager']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['risk-item']} */ ;
/** @type {__VLS_StyleScopedClasses['risk-head']} */ ;
/** @type {__VLS_StyleScopedClasses['risk-id']} */ ;
/** @type {__VLS_StyleScopedClasses['risk-desc']} */ ;
/** @type {__VLS_StyleScopedClasses['risk-steps']} */ ;
/** @type {__VLS_StyleScopedClasses['dep-text']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
/** @type {__VLS_StyleScopedClasses['risk-steps']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            DocumentCopy: DocumentCopy,
            Search: Search,
            keyword: keyword,
            filterStatus: filterStatus,
            filterRisk: filterRisk,
            currentPage: currentPage,
            pageSize: pageSize,
            riskVisible: riskVisible,
            levelColor: levelColor,
            complianceStatusTag: complianceStatusTag,
            riskList: riskList,
            currentRisk: currentRisk,
            filteredItems: filteredItems,
            pagedItems: pagedItems,
            changePage: changePage,
            autoCheck: autoCheck,
            generateReport: generateReport,
            openRisk: openRisk,
            closeRisk: closeRisk,
            exportRiskEvidence: exportRiskEvidence,
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
