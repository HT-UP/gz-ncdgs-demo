import { computed, ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { Aim, Bottom, ChatDotRound, Collection, Cpu, DataLine, Document, Files, FolderOpened, Monitor, Operation, Plus, Promotion, Search, Share, Top, TrendCharts } from '@element-plus/icons-vue';
import { agentCards, createAgentLogs } from '@/mock/intelligence';
const agentTabs = ref(agentCards);
const agentStatusTag = {
    运行中: 'success',
    已停止: 'info',
    异常: 'danger',
};
const logStatusTag = {
    成功: 'success',
    运行中: 'warning',
    失败: 'danger',
};
const activeAgent = ref('meta');
const keyword = ref('');
const filterStatus = ref('');
const currentPage = ref(1);
const pageSize = 20;
const configVisible = ref(false);
const agentInfoMap = {
    meta: {
        name: '元数据管理智能体',
        actionLabel: '执行动作',
        actionProp: 'action',
        tokens: '1.8 万',
        features: [
            { title: '自动接入数据源', desc: '自动识别抽取技术元数据', icon: DataLine, color: '#2B6CB0' },
            { title: '技术元数据自动补全', desc: '基于语义模型智能补全', icon: TrendCharts, color: '#9B59B6' },
            { title: '资产信息自动补全', desc: '表摘要、字段描述完善', icon: Aim, color: '#DA251D' },
            { title: '分类分级', desc: '自动完成资产分类分级', icon: Collection, color: '#ED7B2F' },
            { title: '评估报告自动生成', desc: '自动生成资产评估报告', icon: Document, color: '#00A854' },
        ],
    },
    quality: {
        name: '数据质量管理智能体',
        actionLabel: '执行动作',
        actionProp: 'action',
        tokens: '2.4 万',
        features: [
            { title: '自动化规则执行', desc: '按调度自动执行质量规则', icon: DataLine, color: '#DA251D' },
            { title: '实时规则监控与分析', desc: '流式监控与异常分析', icon: Monitor, color: '#2B6CB0' },
            { title: '质量专项方案', desc: '制定、执行与报告闭环', icon: Document, color: '#9B59B6' },
            { title: '自动化报告生成', desc: '合规率 95.1%', icon: Files, color: '#00A854' },
        ],
    },
    resource: {
        name: '数据资源管理智能体',
        actionLabel: '执行动作',
        actionProp: 'action',
        tokens: '1.2 万',
        features: [
            { title: '智能分析与归类', desc: '智能分析归类数据资产', icon: FolderOpened, color: '#2B6CB0' },
            { title: '目录信息确认', desc: '可视化界面确认目录归属', icon: Aim, color: '#ED7B2F' },
            { title: '目录信息回写', desc: '一键回写、批量操作', icon: Promotion, color: '#DA251D' },
        ],
    },
    search: {
        name: '智能找数智能体',
        actionLabel: '执行动作',
        actionProp: 'action',
        tokens: '3.1 万',
        features: [
            { title: '问答式数据搜索', desc: '自然语言语义解析', icon: ChatDotRound, color: '#9B59B6' },
            { title: '数据关系视图', desc: '自动生成数据关系视图', icon: Share, color: '#00A854' },
        ],
    },
};
const activeAgentInfo = computed(() => agentInfoMap[activeAgent.value]);
const activeTabDesc = computed(() => {
    const info = agentInfoMap[activeAgent.value];
    return { actionLabel: info.actionLabel, actionProp: info.actionProp };
});
const logs = computed(() => createAgentLogs(activeAgent.value, 56));
const filteredLogs = computed(() => logs.value.filter((log) => {
    if (filterStatus.value && log.status !== filterStatus.value)
        return false;
    if (!keyword.value)
        return true;
    const kw = keyword.value.toLowerCase();
    return log.action.toLowerCase().includes(kw) || log.target.toLowerCase().includes(kw);
}));
const pagedLogs = computed(() => {
    const start = (currentPage.value - 1) * pageSize;
    return filteredLogs.value.slice(start, start + pageSize);
});
const changePage = (page) => (currentPage.value = page);
watch([activeAgent, keyword, filterStatus], () => {
    currentPage.value = 1;
});
const triggerAction = (title) => {
    ElMessage.success(`「${title}」已触发执行（Mock）`);
};
const flowNodes = [
    { key: '1', name: '数据源接入（自动发现）', type: 'primary' },
    { key: '2', name: '技术元数据抽取', type: 'primary' },
    { key: '3', name: 'AI 语义补全', type: 'success' },
    { key: '4', name: '分类分级推理', type: 'success' },
    { key: '5', name: '结果确认与回写', type: 'warning' },
];
const openConfig = () => {
    configVisible.value = true;
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
        icon: (__VLS_ctx.Operation),
    }));
    const __VLS_6 = __VLS_5({
        ...{ 'onClick': {} },
        icon: (__VLS_ctx.Operation),
    }, ...__VLS_functionalComponentArgsRest(__VLS_5));
    let __VLS_8;
    let __VLS_9;
    let __VLS_10;
    const __VLS_11 = {
        onClick: (__VLS_ctx.openConfig)
    };
    __VLS_7.slots.default;
    var __VLS_7;
}
const __VLS_12 = {}.ElTabs;
/** @type {[typeof __VLS_components.ElTabs, typeof __VLS_components.elTabs, typeof __VLS_components.ElTabs, typeof __VLS_components.elTabs, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
    ...{ 'onTabChange': {} },
    modelValue: (__VLS_ctx.activeAgent),
}));
const __VLS_14 = __VLS_13({
    ...{ 'onTabChange': {} },
    modelValue: (__VLS_ctx.activeAgent),
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
let __VLS_16;
let __VLS_17;
let __VLS_18;
const __VLS_19 = {
    onTabChange: (() => { })
};
__VLS_15.slots.default;
for (const [agent] of __VLS_getVForSourceType((__VLS_ctx.agentTabs))) {
    const __VLS_20 = {}.ElTabPane;
    /** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
    // @ts-ignore
    const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
        key: (agent.key),
        name: (agent.key),
    }));
    const __VLS_22 = __VLS_21({
        key: (agent.key),
        name: (agent.key),
    }, ...__VLS_functionalComponentArgsRest(__VLS_21));
    __VLS_23.slots.default;
    {
        const { label: __VLS_thisSlot } = __VLS_23.slots;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "agent-tab-label" },
        });
        const __VLS_24 = {}.ElIcon;
        /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
        // @ts-ignore
        const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
            size: (14),
        }));
        const __VLS_26 = __VLS_25({
            size: (14),
        }, ...__VLS_functionalComponentArgsRest(__VLS_25));
        __VLS_27.slots.default;
        const __VLS_28 = {}.Cpu;
        /** @type {[typeof __VLS_components.Cpu, ]} */ ;
        // @ts-ignore
        const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({}));
        const __VLS_30 = __VLS_29({}, ...__VLS_functionalComponentArgsRest(__VLS_29));
        var __VLS_27;
        (agent.name);
        const __VLS_32 = {}.ElTag;
        /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
        // @ts-ignore
        const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
            type: (__VLS_ctx.agentStatusTag[agent.status]),
            effect: "dark",
            size: "small",
            ...{ class: "agent-tab-status" },
        }));
        const __VLS_34 = __VLS_33({
            type: (__VLS_ctx.agentStatusTag[agent.status]),
            effect: "dark",
            size: "small",
            ...{ class: "agent-tab-status" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_33));
        __VLS_35.slots.default;
        (agent.status);
        var __VLS_35;
    }
    var __VLS_23;
}
var __VLS_15;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "toolbar-row" },
});
const __VLS_36 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    modelValue: (__VLS_ctx.keyword),
    placeholder: (`按${__VLS_ctx.activeTabDesc.actionLabel} / 对象搜索`),
    clearable: true,
    ...{ class: "search-input" },
    prefixIcon: (__VLS_ctx.Search),
}));
const __VLS_38 = __VLS_37({
    modelValue: (__VLS_ctx.keyword),
    placeholder: (`按${__VLS_ctx.activeTabDesc.actionLabel} / 对象搜索`),
    clearable: true,
    ...{ class: "search-input" },
    prefixIcon: (__VLS_ctx.Search),
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
const __VLS_40 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
    modelValue: (__VLS_ctx.filterStatus),
    placeholder: "状态",
    clearable: true,
    ...{ class: "filter-select" },
}));
const __VLS_42 = __VLS_41({
    modelValue: (__VLS_ctx.filterStatus),
    placeholder: "状态",
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
    label: "运行中",
    value: "运行中",
}));
const __VLS_50 = __VLS_49({
    label: "运行中",
    value: "运行中",
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
const __VLS_52 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
    label: "失败",
    value: "失败",
}));
const __VLS_54 = __VLS_53({
    label: "失败",
    value: "失败",
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
var __VLS_43;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "dep-text" },
});
(__VLS_ctx.logs.length);
const __VLS_56 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
    gutter: (16),
    ...{ class: "mt-12" },
}));
const __VLS_58 = __VLS_57({
    gutter: (16),
    ...{ class: "mt-12" },
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
__VLS_59.slots.default;
const __VLS_60 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
    span: (16),
}));
const __VLS_62 = __VLS_61({
    span: (16),
}, ...__VLS_functionalComponentArgsRest(__VLS_61));
__VLS_63.slots.default;
const __VLS_64 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
    data: (__VLS_ctx.pagedLogs),
    stripe: true,
    size: "small",
}));
const __VLS_66 = __VLS_65({
    data: (__VLS_ctx.pagedLogs),
    stripe: true,
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_65));
__VLS_67.slots.default;
const __VLS_68 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
    prop: (__VLS_ctx.activeTabDesc.actionProp),
    label: (__VLS_ctx.activeTabDesc.actionLabel),
    minWidth: "140",
}));
const __VLS_70 = __VLS_69({
    prop: (__VLS_ctx.activeTabDesc.actionProp),
    label: (__VLS_ctx.activeTabDesc.actionLabel),
    minWidth: "140",
}, ...__VLS_functionalComponentArgsRest(__VLS_69));
const __VLS_72 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
    prop: "target",
    label: "处理对象",
    minWidth: "160",
}));
const __VLS_74 = __VLS_73({
    prop: "target",
    label: "处理对象",
    minWidth: "160",
}, ...__VLS_functionalComponentArgsRest(__VLS_73));
const __VLS_76 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
    label: "状态",
    width: "90",
}));
const __VLS_78 = __VLS_77({
    label: "状态",
    width: "90",
}, ...__VLS_functionalComponentArgsRest(__VLS_77));
__VLS_79.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_79.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_80 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
        type: (__VLS_ctx.logStatusTag[row.status]),
        effect: "dark",
        size: "small",
    }));
    const __VLS_82 = __VLS_81({
        type: (__VLS_ctx.logStatusTag[row.status]),
        effect: "dark",
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_81));
    __VLS_83.slots.default;
    (row.status);
    var __VLS_83;
}
var __VLS_79;
const __VLS_84 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
    prop: "duration",
    label: "耗时",
    width: "80",
}));
const __VLS_86 = __VLS_85({
    prop: "duration",
    label: "耗时",
    width: "80",
}, ...__VLS_functionalComponentArgsRest(__VLS_85));
const __VLS_88 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
    prop: "tokens",
    label: "Token",
    width: "90",
}));
const __VLS_90 = __VLS_89({
    prop: "tokens",
    label: "Token",
    width: "90",
}, ...__VLS_functionalComponentArgsRest(__VLS_89));
__VLS_91.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_91.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    (row.tokens.toLocaleString());
}
var __VLS_91;
const __VLS_92 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
    prop: "time",
    label: "时间",
    width: "160",
}));
const __VLS_94 = __VLS_93({
    prop: "time",
    label: "时间",
    width: "160",
}, ...__VLS_functionalComponentArgsRest(__VLS_93));
var __VLS_67;
const __VLS_96 = {}.ElPagination;
/** @type {[typeof __VLS_components.ElPagination, typeof __VLS_components.elPagination, ]} */ ;
// @ts-ignore
const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
    ...{ 'onCurrentChange': {} },
    ...{ class: "pager" },
    layout: "total, prev, pager, next",
    total: (__VLS_ctx.filteredLogs.length),
    pageSize: (__VLS_ctx.pageSize),
    currentPage: (__VLS_ctx.currentPage),
    background: true,
}));
const __VLS_98 = __VLS_97({
    ...{ 'onCurrentChange': {} },
    ...{ class: "pager" },
    layout: "total, prev, pager, next",
    total: (__VLS_ctx.filteredLogs.length),
    pageSize: (__VLS_ctx.pageSize),
    currentPage: (__VLS_ctx.currentPage),
    background: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_97));
let __VLS_100;
let __VLS_101;
let __VLS_102;
const __VLS_103 = {
    onCurrentChange: (__VLS_ctx.changePage)
};
var __VLS_99;
var __VLS_63;
const __VLS_104 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
    span: (8),
}));
const __VLS_106 = __VLS_105({
    span: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_105));
__VLS_107.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "section-title" },
});
(__VLS_ctx.activeAgentInfo.name);
for (const [feature] of __VLS_getVForSourceType((__VLS_ctx.activeAgentInfo.features))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "agent-feature" },
        key: (feature.title),
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "agent-feature-icon" },
        ...{ style: ({ background: feature.color }) },
    });
    const __VLS_108 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
        size: (15),
    }));
    const __VLS_110 = __VLS_109({
        size: (15),
    }, ...__VLS_functionalComponentArgsRest(__VLS_109));
    __VLS_111.slots.default;
    const __VLS_112 = ((feature.icon));
    // @ts-ignore
    const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({}));
    const __VLS_114 = __VLS_113({}, ...__VLS_functionalComponentArgsRest(__VLS_113));
    var __VLS_111;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "agent-feature-body" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "agent-feature-title" },
    });
    (feature.title);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "agent-feature-desc" },
    });
    (feature.desc);
    const __VLS_116 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
        size: "small",
    }));
    const __VLS_118 = __VLS_117({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_117));
    let __VLS_120;
    let __VLS_121;
    let __VLS_122;
    const __VLS_123 = {
        onClick: (...[$event]) => {
            __VLS_ctx.triggerAction(feature.title);
        }
    };
    __VLS_119.slots.default;
    var __VLS_119;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "section-title mt-16" },
});
const __VLS_124 = {}.ElDescriptions;
/** @type {[typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, ]} */ ;
// @ts-ignore
const __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({
    column: (1),
    border: true,
    size: "small",
}));
const __VLS_126 = __VLS_125({
    column: (1),
    border: true,
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_125));
__VLS_127.slots.default;
const __VLS_128 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({
    label: "今日执行",
}));
const __VLS_130 = __VLS_129({
    label: "今日执行",
}, ...__VLS_functionalComponentArgsRest(__VLS_129));
__VLS_131.slots.default;
var __VLS_131;
const __VLS_132 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132({
    label: "模型用量",
}));
const __VLS_134 = __VLS_133({
    label: "模型用量",
}, ...__VLS_functionalComponentArgsRest(__VLS_133));
__VLS_135.slots.default;
(__VLS_ctx.activeAgentInfo.tokens);
var __VLS_135;
const __VLS_136 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_137 = __VLS_asFunctionalComponent(__VLS_136, new __VLS_136({
    label: "最近异常",
}));
const __VLS_138 = __VLS_137({
    label: "最近异常",
}, ...__VLS_functionalComponentArgsRest(__VLS_137));
__VLS_139.slots.default;
var __VLS_139;
var __VLS_127;
var __VLS_107;
var __VLS_59;
var __VLS_3;
const __VLS_140 = {}.ElDrawer;
/** @type {[typeof __VLS_components.ElDrawer, typeof __VLS_components.elDrawer, typeof __VLS_components.ElDrawer, typeof __VLS_components.elDrawer, ]} */ ;
// @ts-ignore
const __VLS_141 = __VLS_asFunctionalComponent(__VLS_140, new __VLS_140({
    modelValue: (__VLS_ctx.configVisible),
    title: "智能体可视化流程配置",
    size: "680px",
}));
const __VLS_142 = __VLS_141({
    modelValue: (__VLS_ctx.configVisible),
    title: "智能体可视化流程配置",
    size: "680px",
}, ...__VLS_functionalComponentArgsRest(__VLS_141));
__VLS_143.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "section-title mb-8" },
});
const __VLS_144 = {}.ElTimeline;
/** @type {[typeof __VLS_components.ElTimeline, typeof __VLS_components.elTimeline, typeof __VLS_components.ElTimeline, typeof __VLS_components.elTimeline, ]} */ ;
// @ts-ignore
const __VLS_145 = __VLS_asFunctionalComponent(__VLS_144, new __VLS_144({}));
const __VLS_146 = __VLS_145({}, ...__VLS_functionalComponentArgsRest(__VLS_145));
__VLS_147.slots.default;
for (const [node, index] of __VLS_getVForSourceType((__VLS_ctx.flowNodes))) {
    const __VLS_148 = {}.ElTimelineItem;
    /** @type {[typeof __VLS_components.ElTimelineItem, typeof __VLS_components.elTimelineItem, typeof __VLS_components.ElTimelineItem, typeof __VLS_components.elTimelineItem, ]} */ ;
    // @ts-ignore
    const __VLS_149 = __VLS_asFunctionalComponent(__VLS_148, new __VLS_148({
        key: (node.key),
        type: (node.type),
        timestamp: (`步骤 ${index + 1}`),
    }));
    const __VLS_150 = __VLS_149({
        key: (node.key),
        type: (node.type),
        timestamp: (`步骤 ${index + 1}`),
    }, ...__VLS_functionalComponentArgsRest(__VLS_149));
    __VLS_151.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flow-node" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (node.name);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flow-node-actions" },
    });
    const __VLS_152 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_153 = __VLS_asFunctionalComponent(__VLS_152, new __VLS_152({
        link: true,
        type: "primary",
        size: "small",
        icon: (__VLS_ctx.Top),
    }));
    const __VLS_154 = __VLS_153({
        link: true,
        type: "primary",
        size: "small",
        icon: (__VLS_ctx.Top),
    }, ...__VLS_functionalComponentArgsRest(__VLS_153));
    __VLS_155.slots.default;
    var __VLS_155;
    const __VLS_156 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_157 = __VLS_asFunctionalComponent(__VLS_156, new __VLS_156({
        link: true,
        type: "warning",
        size: "small",
        icon: (__VLS_ctx.Bottom),
    }));
    const __VLS_158 = __VLS_157({
        link: true,
        type: "warning",
        size: "small",
        icon: (__VLS_ctx.Bottom),
    }, ...__VLS_functionalComponentArgsRest(__VLS_157));
    __VLS_159.slots.default;
    var __VLS_159;
    const __VLS_160 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_161 = __VLS_asFunctionalComponent(__VLS_160, new __VLS_160({
        link: true,
        type: "danger",
        size: "small",
    }));
    const __VLS_162 = __VLS_161({
        link: true,
        type: "danger",
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_161));
    __VLS_163.slots.default;
    var __VLS_163;
    var __VLS_151;
}
var __VLS_147;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "maintain-actions" },
});
const __VLS_164 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_165 = __VLS_asFunctionalComponent(__VLS_164, new __VLS_164({
    size: "small",
    icon: (__VLS_ctx.Plus),
}));
const __VLS_166 = __VLS_165({
    size: "small",
    icon: (__VLS_ctx.Plus),
}, ...__VLS_functionalComponentArgsRest(__VLS_165));
__VLS_167.slots.default;
var __VLS_167;
const __VLS_168 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_169 = __VLS_asFunctionalComponent(__VLS_168, new __VLS_168({
    size: "small",
    type: "primary",
}));
const __VLS_170 = __VLS_169({
    size: "small",
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_169));
__VLS_171.slots.default;
var __VLS_171;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "dep-text mt-8" },
});
var __VLS_143;
/** @type {__VLS_StyleScopedClasses['standard-page']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['agent-tab-label']} */ ;
/** @type {__VLS_StyleScopedClasses['agent-tab-status']} */ ;
/** @type {__VLS_StyleScopedClasses['toolbar-row']} */ ;
/** @type {__VLS_StyleScopedClasses['search-input']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-select']} */ ;
/** @type {__VLS_StyleScopedClasses['dep-text']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-12']} */ ;
/** @type {__VLS_StyleScopedClasses['pager']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['agent-feature']} */ ;
/** @type {__VLS_StyleScopedClasses['agent-feature-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['agent-feature-body']} */ ;
/** @type {__VLS_StyleScopedClasses['agent-feature-title']} */ ;
/** @type {__VLS_StyleScopedClasses['agent-feature-desc']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
/** @type {__VLS_StyleScopedClasses['flow-node']} */ ;
/** @type {__VLS_StyleScopedClasses['flow-node-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['maintain-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['dep-text']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Bottom: Bottom,
            Cpu: Cpu,
            Operation: Operation,
            Plus: Plus,
            Search: Search,
            Top: Top,
            agentTabs: agentTabs,
            agentStatusTag: agentStatusTag,
            logStatusTag: logStatusTag,
            activeAgent: activeAgent,
            keyword: keyword,
            filterStatus: filterStatus,
            currentPage: currentPage,
            pageSize: pageSize,
            configVisible: configVisible,
            activeAgentInfo: activeAgentInfo,
            activeTabDesc: activeTabDesc,
            logs: logs,
            filteredLogs: filteredLogs,
            pagedLogs: pagedLogs,
            changePage: changePage,
            triggerAction: triggerAction,
            flowNodes: flowNodes,
            openConfig: openConfig,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
