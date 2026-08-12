import { computed, reactive, ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { ChatDotRound, Cpu, Plus, Promotion, Search, UploadFilled, User } from '@element-plus/icons-vue';
import { knowledgeCategories, mockKnowledgeEntries, qaPairs } from '@/mock/intelligence';
const activeCategory = ref('全部');
const keyword = ref('');
const filterStatus = ref('');
const currentPage = ref(1);
const pageSize = 20;
const importVisible = ref(false);
const entries = ref([...mockKnowledgeEntries]);
const categories = knowledgeCategories;
const importForm = reactive({
    category: '数据安全知识库',
    format: 'Markdown',
});
const categoryCount = (name) => entries.value.filter((item) => item.category === name).length;
const filteredEntries = computed(() => entries.value.filter((item) => {
    if (activeCategory.value !== '全部' && item.category !== activeCategory.value)
        return false;
    if (filterStatus.value && item.status !== filterStatus.value)
        return false;
    if (!keyword.value)
        return true;
    const kw = keyword.value.toLowerCase();
    return item.title.toLowerCase().includes(kw) || item.source.toLowerCase().includes(kw);
}));
const pagedEntries = computed(() => {
    const start = (currentPage.value - 1) * pageSize;
    return filteredEntries.value.slice(start, start + pageSize);
});
const changePage = (page) => (currentPage.value = page);
watch([activeCategory, keyword, filterStatus], () => {
    currentPage.value = 1;
});
const question = ref('');
const qaMessages = ref([]);
const suggestions = ['哪些字段涉及个人隐私？', '如何定位空值率异常根因？', 'L2 级数据的访问要求？', '质量规则如何配置？'];
const answersMap = {};
qaPairs.forEach((pair) => {
    answersMap[pair.question] = { answer: pair.answer, sources: pair.sources };
});
const sendQuestion = () => {
    const text = question.value.trim();
    if (!text)
        return;
    qaMessages.value.push({ role: 'user', content: text });
    const matched = qaPairs.find((pair) => pair.question === text);
    const answer = matched
        ? matched.answer
        : '已检索数据安全知识库与数据质量知识库，未找到完全匹配条目。建议完善问题描述或前往知识库人工检索。（Mock）';
    const sources = matched ? matched.sources : [];
    setTimeout(() => {
        qaMessages.value.push({ role: 'assistant', content: answer, sources, time: '刚刚' });
    }, 400);
    question.value = '';
};
const openQA = (row) => {
    qaMessages.value = [];
    question.value = row.title;
    ElMessage.info('已载入知识条目到问答区（Mock）');
};
const openImport = () => {
    Object.assign(importForm, { category: '数据安全知识库', format: 'Markdown' });
    importVisible.value = true;
};
const submitImport = () => {
    importVisible.value = false;
    ElMessage.success('知识已提交入库审核，向量化完成后可检索（Mock）');
};
const approveEntry = (row) => {
    row.status = '已入库';
    ElMessage.success(`知识条目「${row.title}」已审核通过并向量化入库（Mock）`);
};
const vectorize = (row) => {
    ElMessage.success(`「${row.title}」已完成增量向量化，共 ${row.vectorCount} 个向量（Mock）`);
};
const publishService = () => {
    ElMessage.success('知识检索能力已编目注册为数据服务，供业务系统调用（Mock）');
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
        type: "danger",
        icon: (__VLS_ctx.Plus),
    }));
    const __VLS_14 = __VLS_13({
        ...{ 'onClick': {} },
        type: "danger",
        icon: (__VLS_ctx.Plus),
    }, ...__VLS_functionalComponentArgsRest(__VLS_13));
    let __VLS_16;
    let __VLS_17;
    let __VLS_18;
    const __VLS_19 = {
        onClick: (__VLS_ctx.openImport)
    };
    __VLS_15.slots.default;
    var __VLS_15;
}
const __VLS_20 = {}.ElTabs;
/** @type {[typeof __VLS_components.ElTabs, typeof __VLS_components.elTabs, typeof __VLS_components.ElTabs, typeof __VLS_components.elTabs, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
    ...{ 'onTabChange': {} },
    modelValue: (__VLS_ctx.activeCategory),
}));
const __VLS_22 = __VLS_21({
    ...{ 'onTabChange': {} },
    modelValue: (__VLS_ctx.activeCategory),
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
let __VLS_24;
let __VLS_25;
let __VLS_26;
const __VLS_27 = {
    onTabChange: (() => { })
};
__VLS_23.slots.default;
const __VLS_28 = {}.ElTabPane;
/** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
    label: (`数据安全知识库 (${__VLS_ctx.categoryCount('数据安全知识库')})`),
    name: "数据安全知识库",
}));
const __VLS_30 = __VLS_29({
    label: (`数据安全知识库 (${__VLS_ctx.categoryCount('数据安全知识库')})`),
    name: "数据安全知识库",
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
const __VLS_32 = {}.ElTabPane;
/** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
    label: (`数据质量知识库 (${__VLS_ctx.categoryCount('数据质量知识库')})`),
    name: "数据质量知识库",
}));
const __VLS_34 = __VLS_33({
    label: (`数据质量知识库 (${__VLS_ctx.categoryCount('数据质量知识库')})`),
    name: "数据质量知识库",
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
const __VLS_36 = {}.ElTabPane;
/** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    label: "全部条目",
    name: "全部",
}));
const __VLS_38 = __VLS_37({
    label: "全部条目",
    name: "全部",
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
var __VLS_23;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "toolbar-row" },
});
const __VLS_40 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
    modelValue: (__VLS_ctx.keyword),
    placeholder: "按标题 / 来源搜索",
    clearable: true,
    ...{ class: "search-input" },
    prefixIcon: (__VLS_ctx.Search),
}));
const __VLS_42 = __VLS_41({
    modelValue: (__VLS_ctx.keyword),
    placeholder: "按标题 / 来源搜索",
    clearable: true,
    ...{ class: "search-input" },
    prefixIcon: (__VLS_ctx.Search),
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
const __VLS_44 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    modelValue: (__VLS_ctx.filterStatus),
    placeholder: "状态",
    clearable: true,
    ...{ class: "filter-select" },
}));
const __VLS_46 = __VLS_45({
    modelValue: (__VLS_ctx.filterStatus),
    placeholder: "状态",
    clearable: true,
    ...{ class: "filter-select" },
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
__VLS_47.slots.default;
const __VLS_48 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
    label: "已入库",
    value: "已入库",
}));
const __VLS_50 = __VLS_49({
    label: "已入库",
    value: "已入库",
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
const __VLS_52 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
    label: "待审核",
    value: "待审核",
}));
const __VLS_54 = __VLS_53({
    label: "待审核",
    value: "待审核",
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
var __VLS_47;
const __VLS_56 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
    ...{ 'onClick': {} },
    type: "primary",
    icon: (__VLS_ctx.Promotion),
}));
const __VLS_58 = __VLS_57({
    ...{ 'onClick': {} },
    type: "primary",
    icon: (__VLS_ctx.Promotion),
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
let __VLS_60;
let __VLS_61;
let __VLS_62;
const __VLS_63 = {
    onClick: (__VLS_ctx.publishService)
};
__VLS_59.slots.default;
var __VLS_59;
const __VLS_64 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
    data: (__VLS_ctx.pagedEntries),
    stripe: true,
    size: "small",
    ...{ class: "mt-12" },
}));
const __VLS_66 = __VLS_65({
    data: (__VLS_ctx.pagedEntries),
    stripe: true,
    size: "small",
    ...{ class: "mt-12" },
}, ...__VLS_functionalComponentArgsRest(__VLS_65));
__VLS_67.slots.default;
const __VLS_68 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
    prop: "title",
    label: "知识条目",
    minWidth: "200",
}));
const __VLS_70 = __VLS_69({
    prop: "title",
    label: "知识条目",
    minWidth: "200",
}, ...__VLS_functionalComponentArgsRest(__VLS_69));
const __VLS_72 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
    label: "格式",
    width: "100",
}));
const __VLS_74 = __VLS_73({
    label: "格式",
    width: "100",
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
        type: (row.format === 'Markdown' ? 'primary' : 'warning'),
        effect: "plain",
    }));
    const __VLS_78 = __VLS_77({
        size: "small",
        type: (row.format === 'Markdown' ? 'primary' : 'warning'),
        effect: "plain",
    }, ...__VLS_functionalComponentArgsRest(__VLS_77));
    __VLS_79.slots.default;
    (row.format);
    var __VLS_79;
}
var __VLS_75;
const __VLS_80 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
    prop: "source",
    label: "来源",
    width: "120",
}));
const __VLS_82 = __VLS_81({
    prop: "source",
    label: "来源",
    width: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_81));
const __VLS_84 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
    label: "向量数",
    width: "90",
    align: "center",
}));
const __VLS_86 = __VLS_85({
    label: "向量数",
    width: "90",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_85));
__VLS_87.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_87.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    (row.vectorCount);
}
var __VLS_87;
const __VLS_88 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
    label: "状态",
    width: "90",
}));
const __VLS_90 = __VLS_89({
    label: "状态",
    width: "90",
}, ...__VLS_functionalComponentArgsRest(__VLS_89));
__VLS_91.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_91.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_92 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
        type: (row.status === '已入库' ? 'success' : 'warning'),
        effect: "dark",
        size: "small",
    }));
    const __VLS_94 = __VLS_93({
        type: (row.status === '已入库' ? 'success' : 'warning'),
        effect: "dark",
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_93));
    __VLS_95.slots.default;
    (row.status);
    var __VLS_95;
}
var __VLS_91;
const __VLS_96 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
    prop: "updateTime",
    label: "更新时间",
    width: "160",
}));
const __VLS_98 = __VLS_97({
    prop: "updateTime",
    label: "更新时间",
    width: "160",
}, ...__VLS_functionalComponentArgsRest(__VLS_97));
const __VLS_100 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
    label: "操作",
    width: "150",
    fixed: "right",
}));
const __VLS_102 = __VLS_101({
    label: "操作",
    width: "150",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_101));
__VLS_103.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_103.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_104 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }));
    const __VLS_106 = __VLS_105({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_105));
    let __VLS_108;
    let __VLS_109;
    let __VLS_110;
    const __VLS_111 = {
        onClick: (...[$event]) => {
            __VLS_ctx.openQA(row);
        }
    };
    __VLS_107.slots.default;
    var __VLS_107;
    if (row.status === '待审核') {
        const __VLS_112 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
            ...{ 'onClick': {} },
            link: true,
            type: "success",
        }));
        const __VLS_114 = __VLS_113({
            ...{ 'onClick': {} },
            link: true,
            type: "success",
        }, ...__VLS_functionalComponentArgsRest(__VLS_113));
        let __VLS_116;
        let __VLS_117;
        let __VLS_118;
        const __VLS_119 = {
            onClick: (...[$event]) => {
                if (!(row.status === '待审核'))
                    return;
                __VLS_ctx.approveEntry(row);
            }
        };
        __VLS_115.slots.default;
        var __VLS_115;
    }
    else {
        const __VLS_120 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({
            ...{ 'onClick': {} },
            link: true,
            type: "warning",
        }));
        const __VLS_122 = __VLS_121({
            ...{ 'onClick': {} },
            link: true,
            type: "warning",
        }, ...__VLS_functionalComponentArgsRest(__VLS_121));
        let __VLS_124;
        let __VLS_125;
        let __VLS_126;
        const __VLS_127 = {
            onClick: (...[$event]) => {
                if (!!(row.status === '待审核'))
                    return;
                __VLS_ctx.vectorize(row);
            }
        };
        __VLS_123.slots.default;
        var __VLS_123;
    }
}
var __VLS_103;
var __VLS_67;
const __VLS_128 = {}.ElPagination;
/** @type {[typeof __VLS_components.ElPagination, typeof __VLS_components.elPagination, ]} */ ;
// @ts-ignore
const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({
    ...{ 'onCurrentChange': {} },
    ...{ class: "pager" },
    layout: "total, prev, pager, next",
    total: (__VLS_ctx.filteredEntries.length),
    pageSize: (__VLS_ctx.pageSize),
    currentPage: (__VLS_ctx.currentPage),
    background: true,
}));
const __VLS_130 = __VLS_129({
    ...{ 'onCurrentChange': {} },
    ...{ class: "pager" },
    layout: "total, prev, pager, next",
    total: (__VLS_ctx.filteredEntries.length),
    pageSize: (__VLS_ctx.pageSize),
    currentPage: (__VLS_ctx.currentPage),
    background: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_129));
let __VLS_132;
let __VLS_133;
let __VLS_134;
const __VLS_135 = {
    onCurrentChange: (__VLS_ctx.changePage)
};
var __VLS_131;
var __VLS_11;
const __VLS_136 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_137 = __VLS_asFunctionalComponent(__VLS_136, new __VLS_136({
    ...{ class: "panel-card dashboard-card mt-16" },
    shadow: "never",
}));
const __VLS_138 = __VLS_137({
    ...{ class: "panel-card dashboard-card mt-16" },
    shadow: "never",
}, ...__VLS_functionalComponentArgsRest(__VLS_137));
__VLS_139.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_139.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
}
const __VLS_140 = {}.ElDescriptions;
/** @type {[typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, ]} */ ;
// @ts-ignore
const __VLS_141 = __VLS_asFunctionalComponent(__VLS_140, new __VLS_140({
    column: (4),
    border: true,
    size: "small",
}));
const __VLS_142 = __VLS_141({
    column: (4),
    border: true,
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_141));
__VLS_143.slots.default;
const __VLS_144 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_145 = __VLS_asFunctionalComponent(__VLS_144, new __VLS_144({
    label: "向量库",
}));
const __VLS_146 = __VLS_145({
    label: "向量库",
}, ...__VLS_functionalComponentArgsRest(__VLS_145));
__VLS_147.slots.default;
var __VLS_147;
const __VLS_148 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_149 = __VLS_asFunctionalComponent(__VLS_148, new __VLS_148({
    label: "集合数",
}));
const __VLS_150 = __VLS_149({
    label: "集合数",
}, ...__VLS_functionalComponentArgsRest(__VLS_149));
__VLS_151.slots.default;
var __VLS_151;
const __VLS_152 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_153 = __VLS_asFunctionalComponent(__VLS_152, new __VLS_152({
    label: "向量总量",
}));
const __VLS_154 = __VLS_153({
    label: "向量总量",
}, ...__VLS_functionalComponentArgsRest(__VLS_153));
__VLS_155.slots.default;
var __VLS_155;
const __VLS_156 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_157 = __VLS_asFunctionalComponent(__VLS_156, new __VLS_156({
    label: "检索时延",
}));
const __VLS_158 = __VLS_157({
    label: "检索时延",
}, ...__VLS_functionalComponentArgsRest(__VLS_157));
__VLS_159.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.b, __VLS_intrinsicElements.b)({
    ...{ class: "text-primary" },
});
var __VLS_159;
const __VLS_160 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_161 = __VLS_asFunctionalComponent(__VLS_160, new __VLS_160({
    label: "嵌入模型",
}));
const __VLS_162 = __VLS_161({
    label: "嵌入模型",
}, ...__VLS_functionalComponentArgsRest(__VLS_161));
__VLS_163.slots.default;
var __VLS_163;
const __VLS_164 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_165 = __VLS_asFunctionalComponent(__VLS_164, new __VLS_164({
    label: "向量维度",
}));
const __VLS_166 = __VLS_165({
    label: "向量维度",
}, ...__VLS_functionalComponentArgsRest(__VLS_165));
__VLS_167.slots.default;
var __VLS_167;
const __VLS_168 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_169 = __VLS_asFunctionalComponent(__VLS_168, new __VLS_168({
    label: "索引类型",
}));
const __VLS_170 = __VLS_169({
    label: "索引类型",
}, ...__VLS_functionalComponentArgsRest(__VLS_169));
__VLS_171.slots.default;
var __VLS_171;
const __VLS_172 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_173 = __VLS_asFunctionalComponent(__VLS_172, new __VLS_172({
    label: "相似度阈值",
}));
const __VLS_174 = __VLS_173({
    label: "相似度阈值",
}, ...__VLS_functionalComponentArgsRest(__VLS_173));
__VLS_175.slots.default;
var __VLS_175;
var __VLS_143;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "dep-text mt-8" },
});
var __VLS_139;
var __VLS_7;
const __VLS_176 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_177 = __VLS_asFunctionalComponent(__VLS_176, new __VLS_176({
    span: (9),
}));
const __VLS_178 = __VLS_177({
    span: (9),
}, ...__VLS_functionalComponentArgsRest(__VLS_177));
__VLS_179.slots.default;
const __VLS_180 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_181 = __VLS_asFunctionalComponent(__VLS_180, new __VLS_180({
    ...{ class: "panel-card dashboard-card qa-card" },
    shadow: "never",
}));
const __VLS_182 = __VLS_181({
    ...{ class: "panel-card dashboard-card qa-card" },
    shadow: "never",
}, ...__VLS_functionalComponentArgsRest(__VLS_181));
__VLS_183.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_183.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "qa-chat" },
});
for (const [msg, index] of __VLS_getVForSourceType((__VLS_ctx.qaMessages))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (index),
        ...{ class: "qa-row" },
        ...{ class: (msg.role) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "qa-avatar" },
        ...{ class: (msg.role) },
    });
    const __VLS_184 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_185 = __VLS_asFunctionalComponent(__VLS_184, new __VLS_184({
        size: (15),
    }));
    const __VLS_186 = __VLS_185({
        size: (15),
    }, ...__VLS_functionalComponentArgsRest(__VLS_185));
    __VLS_187.slots.default;
    const __VLS_188 = ((msg.role === 'user' ? __VLS_ctx.User : __VLS_ctx.Cpu));
    // @ts-ignore
    const __VLS_189 = __VLS_asFunctionalComponent(__VLS_188, new __VLS_188({}));
    const __VLS_190 = __VLS_189({}, ...__VLS_functionalComponentArgsRest(__VLS_189));
    var __VLS_187;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "qa-bubble-wrap" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "qa-bubble" },
    });
    (msg.content);
    if (msg.role === 'assistant' && msg.sources?.length) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "qa-sources" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "qa-sources-title" },
        });
        for (const [source] of __VLS_getVForSourceType((msg.sources))) {
            const __VLS_192 = {}.ElTag;
            /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
            // @ts-ignore
            const __VLS_193 = __VLS_asFunctionalComponent(__VLS_192, new __VLS_192({
                key: (source),
                size: "small",
                effect: "plain",
                type: "primary",
                ...{ class: "mr-4" },
            }));
            const __VLS_194 = __VLS_193({
                key: (source),
                size: "small",
                effect: "plain",
                type: "primary",
                ...{ class: "mr-4" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_193));
            __VLS_195.slots.default;
            (source);
            var __VLS_195;
        }
    }
    if (msg.time) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "qa-time" },
        });
        (msg.time);
    }
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "qa-input" },
    ...{ style: {} },
});
const __VLS_196 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_197 = __VLS_asFunctionalComponent(__VLS_196, new __VLS_196({
    ...{ 'onKeyup': {} },
    modelValue: (__VLS_ctx.question),
    placeholder: "输入问题，例如：哪些字段涉及个人隐私？",
    prefixIcon: (__VLS_ctx.ChatDotRound),
}));
const __VLS_198 = __VLS_197({
    ...{ 'onKeyup': {} },
    modelValue: (__VLS_ctx.question),
    placeholder: "输入问题，例如：哪些字段涉及个人隐私？",
    prefixIcon: (__VLS_ctx.ChatDotRound),
}, ...__VLS_functionalComponentArgsRest(__VLS_197));
let __VLS_200;
let __VLS_201;
let __VLS_202;
const __VLS_203 = {
    onKeyup: (__VLS_ctx.sendQuestion)
};
var __VLS_199;
const __VLS_204 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_205 = __VLS_asFunctionalComponent(__VLS_204, new __VLS_204({
    ...{ 'onClick': {} },
    type: "danger",
    icon: (__VLS_ctx.Promotion),
}));
const __VLS_206 = __VLS_205({
    ...{ 'onClick': {} },
    type: "danger",
    icon: (__VLS_ctx.Promotion),
}, ...__VLS_functionalComponentArgsRest(__VLS_205));
let __VLS_208;
let __VLS_209;
let __VLS_210;
const __VLS_211 = {
    onClick: (__VLS_ctx.sendQuestion)
};
__VLS_207.slots.default;
var __VLS_207;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "qa-suggestions" },
});
for (const [suggest] of __VLS_getVForSourceType((__VLS_ctx.suggestions))) {
    const __VLS_212 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_213 = __VLS_asFunctionalComponent(__VLS_212, new __VLS_212({
        ...{ 'onClick': {} },
        key: (suggest),
        ...{ class: "qa-suggest" },
        effect: "plain",
    }));
    const __VLS_214 = __VLS_213({
        ...{ 'onClick': {} },
        key: (suggest),
        ...{ class: "qa-suggest" },
        effect: "plain",
    }, ...__VLS_functionalComponentArgsRest(__VLS_213));
    let __VLS_216;
    let __VLS_217;
    let __VLS_218;
    const __VLS_219 = {
        onClick: (...[$event]) => {
            __VLS_ctx.question = suggest;
        }
    };
    __VLS_215.slots.default;
    (suggest);
    var __VLS_215;
}
var __VLS_183;
var __VLS_179;
var __VLS_3;
const __VLS_220 = {}.ElDrawer;
/** @type {[typeof __VLS_components.ElDrawer, typeof __VLS_components.elDrawer, typeof __VLS_components.ElDrawer, typeof __VLS_components.elDrawer, ]} */ ;
// @ts-ignore
const __VLS_221 = __VLS_asFunctionalComponent(__VLS_220, new __VLS_220({
    modelValue: (__VLS_ctx.importVisible),
    title: "知识入库",
    size: "520px",
}));
const __VLS_222 = __VLS_221({
    modelValue: (__VLS_ctx.importVisible),
    title: "知识入库",
    size: "520px",
}, ...__VLS_functionalComponentArgsRest(__VLS_221));
__VLS_223.slots.default;
const __VLS_224 = {}.ElSteps;
/** @type {[typeof __VLS_components.ElSteps, typeof __VLS_components.elSteps, typeof __VLS_components.ElSteps, typeof __VLS_components.elSteps, ]} */ ;
// @ts-ignore
const __VLS_225 = __VLS_asFunctionalComponent(__VLS_224, new __VLS_224({
    active: (1),
    simple: true,
    finishStatus: "success",
    ...{ class: "mb-16" },
}));
const __VLS_226 = __VLS_225({
    active: (1),
    simple: true,
    finishStatus: "success",
    ...{ class: "mb-16" },
}, ...__VLS_functionalComponentArgsRest(__VLS_225));
__VLS_227.slots.default;
const __VLS_228 = {}.ElStep;
/** @type {[typeof __VLS_components.ElStep, typeof __VLS_components.elStep, ]} */ ;
// @ts-ignore
const __VLS_229 = __VLS_asFunctionalComponent(__VLS_228, new __VLS_228({
    title: "上传/转换",
}));
const __VLS_230 = __VLS_229({
    title: "上传/转换",
}, ...__VLS_functionalComponentArgsRest(__VLS_229));
const __VLS_232 = {}.ElStep;
/** @type {[typeof __VLS_components.ElStep, typeof __VLS_components.elStep, ]} */ ;
// @ts-ignore
const __VLS_233 = __VLS_asFunctionalComponent(__VLS_232, new __VLS_232({
    title: "向量化",
}));
const __VLS_234 = __VLS_233({
    title: "向量化",
}, ...__VLS_functionalComponentArgsRest(__VLS_233));
const __VLS_236 = {}.ElStep;
/** @type {[typeof __VLS_components.ElStep, typeof __VLS_components.elStep, ]} */ ;
// @ts-ignore
const __VLS_237 = __VLS_asFunctionalComponent(__VLS_236, new __VLS_236({
    title: "审核",
}));
const __VLS_238 = __VLS_237({
    title: "审核",
}, ...__VLS_functionalComponentArgsRest(__VLS_237));
var __VLS_227;
const __VLS_240 = {}.ElUpload;
/** @type {[typeof __VLS_components.ElUpload, typeof __VLS_components.elUpload, typeof __VLS_components.ElUpload, typeof __VLS_components.elUpload, ]} */ ;
// @ts-ignore
const __VLS_241 = __VLS_asFunctionalComponent(__VLS_240, new __VLS_240({
    drag: true,
    ...{ class: "w-full" },
    autoUpload: (false),
}));
const __VLS_242 = __VLS_241({
    drag: true,
    ...{ class: "w-full" },
    autoUpload: (false),
}, ...__VLS_functionalComponentArgsRest(__VLS_241));
__VLS_243.slots.default;
const __VLS_244 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_245 = __VLS_asFunctionalComponent(__VLS_244, new __VLS_244({
    ...{ class: "el-icon--upload" },
}));
const __VLS_246 = __VLS_245({
    ...{ class: "el-icon--upload" },
}, ...__VLS_functionalComponentArgsRest(__VLS_245));
__VLS_247.slots.default;
const __VLS_248 = {}.UploadFilled;
/** @type {[typeof __VLS_components.UploadFilled, ]} */ ;
// @ts-ignore
const __VLS_249 = __VLS_asFunctionalComponent(__VLS_248, new __VLS_248({}));
const __VLS_250 = __VLS_249({}, ...__VLS_functionalComponentArgsRest(__VLS_249));
var __VLS_247;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "el-upload__text" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.em, __VLS_intrinsicElements.em)({});
var __VLS_243;
const __VLS_252 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_253 = __VLS_asFunctionalComponent(__VLS_252, new __VLS_252({
    model: (__VLS_ctx.importForm),
    labelWidth: "90px",
    ...{ class: "mt-16" },
}));
const __VLS_254 = __VLS_253({
    model: (__VLS_ctx.importForm),
    labelWidth: "90px",
    ...{ class: "mt-16" },
}, ...__VLS_functionalComponentArgsRest(__VLS_253));
__VLS_255.slots.default;
const __VLS_256 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_257 = __VLS_asFunctionalComponent(__VLS_256, new __VLS_256({
    label: "目标知识库",
}));
const __VLS_258 = __VLS_257({
    label: "目标知识库",
}, ...__VLS_functionalComponentArgsRest(__VLS_257));
__VLS_259.slots.default;
const __VLS_260 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_261 = __VLS_asFunctionalComponent(__VLS_260, new __VLS_260({
    modelValue: (__VLS_ctx.importForm.category),
    ...{ class: "w-full" },
}));
const __VLS_262 = __VLS_261({
    modelValue: (__VLS_ctx.importForm.category),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_261));
__VLS_263.slots.default;
for (const [category] of __VLS_getVForSourceType((['数据安全知识库', '数据质量知识库']))) {
    const __VLS_264 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_265 = __VLS_asFunctionalComponent(__VLS_264, new __VLS_264({
        key: (category),
        label: (category),
        value: (category),
    }));
    const __VLS_266 = __VLS_265({
        key: (category),
        label: (category),
        value: (category),
    }, ...__VLS_functionalComponentArgsRest(__VLS_265));
}
var __VLS_263;
var __VLS_259;
const __VLS_268 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_269 = __VLS_asFunctionalComponent(__VLS_268, new __VLS_268({
    label: "知识格式",
}));
const __VLS_270 = __VLS_269({
    label: "知识格式",
}, ...__VLS_functionalComponentArgsRest(__VLS_269));
__VLS_271.slots.default;
const __VLS_272 = {}.ElRadioGroup;
/** @type {[typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, ]} */ ;
// @ts-ignore
const __VLS_273 = __VLS_asFunctionalComponent(__VLS_272, new __VLS_272({
    modelValue: (__VLS_ctx.importForm.format),
}));
const __VLS_274 = __VLS_273({
    modelValue: (__VLS_ctx.importForm.format),
}, ...__VLS_functionalComponentArgsRest(__VLS_273));
__VLS_275.slots.default;
const __VLS_276 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
const __VLS_277 = __VLS_asFunctionalComponent(__VLS_276, new __VLS_276({
    value: "Markdown",
}));
const __VLS_278 = __VLS_277({
    value: "Markdown",
}, ...__VLS_functionalComponentArgsRest(__VLS_277));
const __VLS_280 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
const __VLS_281 = __VLS_asFunctionalComponent(__VLS_280, new __VLS_280({
    value: "结构化数据",
}));
const __VLS_282 = __VLS_281({
    value: "结构化数据",
}, ...__VLS_functionalComponentArgsRest(__VLS_281));
var __VLS_275;
var __VLS_271;
var __VLS_255;
{
    const { footer: __VLS_thisSlot } = __VLS_223.slots;
    const __VLS_284 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_285 = __VLS_asFunctionalComponent(__VLS_284, new __VLS_284({
        ...{ 'onClick': {} },
    }));
    const __VLS_286 = __VLS_285({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_285));
    let __VLS_288;
    let __VLS_289;
    let __VLS_290;
    const __VLS_291 = {
        onClick: (...[$event]) => {
            __VLS_ctx.importVisible = false;
        }
    };
    __VLS_287.slots.default;
    var __VLS_287;
    const __VLS_292 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_293 = __VLS_asFunctionalComponent(__VLS_292, new __VLS_292({
        ...{ 'onClick': {} },
        type: "danger",
    }));
    const __VLS_294 = __VLS_293({
        ...{ 'onClick': {} },
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_293));
    let __VLS_296;
    let __VLS_297;
    let __VLS_298;
    const __VLS_299 = {
        onClick: (__VLS_ctx.submitImport)
    };
    __VLS_295.slots.default;
    var __VLS_295;
}
var __VLS_223;
/** @type {__VLS_StyleScopedClasses['standard-page']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['toolbar-row']} */ ;
/** @type {__VLS_StyleScopedClasses['search-input']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-select']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-12']} */ ;
/** @type {__VLS_StyleScopedClasses['pager']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['dep-text']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['qa-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['qa-chat']} */ ;
/** @type {__VLS_StyleScopedClasses['qa-row']} */ ;
/** @type {__VLS_StyleScopedClasses['qa-avatar']} */ ;
/** @type {__VLS_StyleScopedClasses['qa-bubble-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['qa-bubble']} */ ;
/** @type {__VLS_StyleScopedClasses['qa-sources']} */ ;
/** @type {__VLS_StyleScopedClasses['qa-sources-title']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
/** @type {__VLS_StyleScopedClasses['qa-time']} */ ;
/** @type {__VLS_StyleScopedClasses['qa-input']} */ ;
/** @type {__VLS_StyleScopedClasses['qa-suggestions']} */ ;
/** @type {__VLS_StyleScopedClasses['qa-suggest']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['el-icon--upload']} */ ;
/** @type {__VLS_StyleScopedClasses['el-upload__text']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            ChatDotRound: ChatDotRound,
            Cpu: Cpu,
            Plus: Plus,
            Promotion: Promotion,
            Search: Search,
            UploadFilled: UploadFilled,
            User: User,
            activeCategory: activeCategory,
            keyword: keyword,
            filterStatus: filterStatus,
            currentPage: currentPage,
            pageSize: pageSize,
            importVisible: importVisible,
            importForm: importForm,
            categoryCount: categoryCount,
            filteredEntries: filteredEntries,
            pagedEntries: pagedEntries,
            changePage: changePage,
            question: question,
            qaMessages: qaMessages,
            suggestions: suggestions,
            sendQuestion: sendQuestion,
            openQA: openQA,
            openImport: openImport,
            submitImport: submitImport,
            approveEntry: approveEntry,
            vectorize: vectorize,
            publishService: publishService,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
