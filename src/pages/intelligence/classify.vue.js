import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { Plus, Search } from '@element-plus/icons-vue';
import * as echarts from 'echarts';
import { classifyModels, mockClassifyResults } from '@/mock/intelligence';
const keyword = ref('');
const filterLevel = ref('');
const filterStatus = ref('');
const currentPage = ref(1);
const pageSize = 20;
const batchVisible = ref(false);
const batchRunning = ref(false);
const batchProgress = ref(0);
const results = ref([...mockClassifyResults]);
const levelColor = {
    L1: '#E34D59',
    L2: '#ED7B2F',
    L3: '#2B6CB0',
    L4: '#8C8C8C',
};
const resultStatusTag = {
    待复核: 'warning',
    已通过: 'success',
    已驳回: 'danger',
};
const batchForm = reactive({
    scope: '未分级资产',
    model: '轨道交通分类模型 V3',
    autoWrite: true,
});
const filteredResults = computed(() => results.value.filter((item) => {
    if (filterLevel.value && item.predictedLevel !== filterLevel.value)
        return false;
    if (filterStatus.value && item.status !== filterStatus.value)
        return false;
    if (!keyword.value)
        return true;
    return item.assetName.toLowerCase().includes(keyword.value.toLowerCase());
}));
const pendingCount = computed(() => results.value.filter((item) => item.status === '待复核').length);
const pagedResults = computed(() => {
    const start = (currentPage.value - 1) * pageSize;
    return filteredResults.value.slice(start, start + pageSize);
});
const changePage = (page) => (currentPage.value = page);
watch([keyword, filterLevel, filterStatus], () => {
    currentPage.value = 1;
});
const confidenceColor = (value) => (value >= 85 ? '#00A854' : value >= 75 ? '#ED7B2F' : '#E34D59');
const review = (row, pass) => {
    row.status = pass ? '已通过' : '已驳回';
    ElMessage[pass ? 'success' : 'warning'](`资产「${row.assetName}」已${pass ? '通过' : '驳回'}${pass ? '并回写资产分级与标签' : ''}（Mock）`);
};
const viewResult = (row) => {
    ElMessage.info(`「${row.assetName}」分级 ${row.predictedLevel} ${row.predictedLevelName}，标签：${row.tags.join('、')}（Mock）`);
};
const createBatch = () => {
    batchVisible.value = true;
};
const startBatch = () => {
    batchRunning.value = true;
    batchProgress.value = 20;
    const timer = setInterval(() => {
        batchProgress.value += 15;
        if (batchProgress.value >= 100) {
            clearInterval(timer);
            batchRunning.value = false;
            batchVisible.value = false;
            ElMessage.success('批量分类分级完成，生成了 1,080 条待复核结果（Mock）');
        }
    }, 400);
};
const addModel = () => ElMessage.info('打开模型配置向导（Mock）');
const trainModel = () => ElMessage.success('模型训练任务已提交（Mock）');
const manageModel = () => ElMessage.info('打开模型版本管理（Mock）');
const levelChartRef = ref();
let levelChart = null;
const renderLevelChart = () => {
    if (!levelChartRef.value)
        return;
    levelChart?.dispose();
    levelChart = echarts.init(levelChartRef.value);
    const counts = ['L1', 'L2', 'L3', 'L4'].map((level) => mockClassifyResults.filter((item) => item.predictedLevel === level).length);
    levelChart.setOption({
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        grid: { left: 34, right: 10, top: 20, bottom: 26 },
        xAxis: { type: 'category', data: ['L1 核心', 'L2 重要', 'L3 一般', 'L4 可公开'] },
        yAxis: { type: 'value', splitLine: { lineStyle: { type: 'dashed', color: '#E4E7ED' } } },
        series: [
            {
                type: 'bar',
                barWidth: 28,
                data: counts.map((count, index) => ({ value: count, itemStyle: { color: ['#E34D59', '#ED7B2F', '#2B6CB0', '#8C8C8C'][index] } })),
            },
        ],
    });
};
const handleResize = () => levelChart?.resize();
onMounted(() => {
    renderLevelChart();
    window.addEventListener('resize', handleResize);
});
onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize);
    levelChart?.dispose();
});
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
        onClick: (__VLS_ctx.createBatch)
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
    placeholder: "按资产名称 / 分级检索",
    clearable: true,
    ...{ class: "search-input" },
    prefixIcon: (__VLS_ctx.Search),
}));
const __VLS_22 = __VLS_21({
    modelValue: (__VLS_ctx.keyword),
    placeholder: "按资产名称 / 分级检索",
    clearable: true,
    ...{ class: "search-input" },
    prefixIcon: (__VLS_ctx.Search),
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
const __VLS_24 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    modelValue: (__VLS_ctx.filterLevel),
    placeholder: "分级",
    clearable: true,
    ...{ class: "filter-select" },
}));
const __VLS_26 = __VLS_25({
    modelValue: (__VLS_ctx.filterLevel),
    placeholder: "分级",
    clearable: true,
    ...{ class: "filter-select" },
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
__VLS_27.slots.default;
const __VLS_28 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
    label: "L1 核心",
    value: "L1",
}));
const __VLS_30 = __VLS_29({
    label: "L1 核心",
    value: "L1",
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
const __VLS_32 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
    label: "L2 重要",
    value: "L2",
}));
const __VLS_34 = __VLS_33({
    label: "L2 重要",
    value: "L2",
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
const __VLS_36 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    label: "L3 一般",
    value: "L3",
}));
const __VLS_38 = __VLS_37({
    label: "L3 一般",
    value: "L3",
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
const __VLS_40 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
    label: "L4 可公开",
    value: "L4",
}));
const __VLS_42 = __VLS_41({
    label: "L4 可公开",
    value: "L4",
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
var __VLS_27;
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
    label: "待复核",
    value: "待复核",
}));
const __VLS_50 = __VLS_49({
    label: "待复核",
    value: "待复核",
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
const __VLS_52 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
    label: "已通过",
    value: "已通过",
}));
const __VLS_54 = __VLS_53({
    label: "已通过",
    value: "已通过",
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
const __VLS_56 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
    label: "已驳回",
    value: "已驳回",
}));
const __VLS_58 = __VLS_57({
    label: "已驳回",
    value: "已驳回",
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
var __VLS_47;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "dep-text" },
});
(__VLS_ctx.pendingCount);
const __VLS_60 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
    data: (__VLS_ctx.pagedResults),
    stripe: true,
    ...{ class: "mt-12" },
}));
const __VLS_62 = __VLS_61({
    data: (__VLS_ctx.pagedResults),
    stripe: true,
    ...{ class: "mt-12" },
}, ...__VLS_functionalComponentArgsRest(__VLS_61));
__VLS_63.slots.default;
const __VLS_64 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
    prop: "assetName",
    label: "资产名称",
    minWidth: "150",
}));
const __VLS_66 = __VLS_65({
    prop: "assetName",
    label: "资产名称",
    minWidth: "150",
}, ...__VLS_functionalComponentArgsRest(__VLS_65));
const __VLS_68 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
    prop: "domain",
    label: "所属业务域",
    width: "110",
}));
const __VLS_70 = __VLS_69({
    prop: "domain",
    label: "所属业务域",
    width: "110",
}, ...__VLS_functionalComponentArgsRest(__VLS_69));
const __VLS_72 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
    label: "智能分级",
    width: "90",
}));
const __VLS_74 = __VLS_73({
    label: "智能分级",
    width: "90",
}, ...__VLS_functionalComponentArgsRest(__VLS_73));
__VLS_75.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_75.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "level-badge" },
        ...{ style: ({ background: __VLS_ctx.levelColor[row.predictedLevel] }) },
    });
    (row.predictedLevel);
}
var __VLS_75;
const __VLS_76 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
    prop: "predictedLevelName",
    label: "分级名称",
    width: "90",
}));
const __VLS_78 = __VLS_77({
    prop: "predictedLevelName",
    label: "分级名称",
    width: "90",
}, ...__VLS_functionalComponentArgsRest(__VLS_77));
const __VLS_80 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
    label: "智能标签",
    minWidth: "130",
}));
const __VLS_82 = __VLS_81({
    label: "智能标签",
    minWidth: "130",
}, ...__VLS_functionalComponentArgsRest(__VLS_81));
__VLS_83.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_83.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    for (const [tag] of __VLS_getVForSourceType((row.tags))) {
        const __VLS_84 = {}.ElTag;
        /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
        // @ts-ignore
        const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
            key: (tag),
            size: "small",
            effect: "plain",
            ...{ class: "mr-4" },
        }));
        const __VLS_86 = __VLS_85({
            key: (tag),
            size: "small",
            effect: "plain",
            ...{ class: "mr-4" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_85));
        __VLS_87.slots.default;
        (tag);
        var __VLS_87;
    }
}
var __VLS_83;
const __VLS_88 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
    label: "置信度",
    width: "120",
}));
const __VLS_90 = __VLS_89({
    label: "置信度",
    width: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_89));
__VLS_91.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_91.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_92 = {}.ElProgress;
    /** @type {[typeof __VLS_components.ElProgress, typeof __VLS_components.elProgress, ]} */ ;
    // @ts-ignore
    const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
        percentage: (row.confidence),
        strokeWidth: (8),
        color: (__VLS_ctx.confidenceColor(row.confidence)),
    }));
    const __VLS_94 = __VLS_93({
        percentage: (row.confidence),
        strokeWidth: (8),
        color: (__VLS_ctx.confidenceColor(row.confidence)),
    }, ...__VLS_functionalComponentArgsRest(__VLS_93));
}
var __VLS_91;
const __VLS_96 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
    label: "状态",
    width: "90",
}));
const __VLS_98 = __VLS_97({
    label: "状态",
    width: "90",
}, ...__VLS_functionalComponentArgsRest(__VLS_97));
__VLS_99.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_99.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_100 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
        type: (__VLS_ctx.resultStatusTag[row.status]),
        effect: "dark",
        size: "small",
    }));
    const __VLS_102 = __VLS_101({
        type: (__VLS_ctx.resultStatusTag[row.status]),
        effect: "dark",
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_101));
    __VLS_103.slots.default;
    (row.status);
    var __VLS_103;
}
var __VLS_99;
const __VLS_104 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
    label: "操作",
    width: "150",
    fixed: "right",
}));
const __VLS_106 = __VLS_105({
    label: "操作",
    width: "150",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_105));
__VLS_107.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_107.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    if (row.status === '待复核') {
        const __VLS_108 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
            ...{ 'onClick': {} },
            link: true,
            type: "success",
        }));
        const __VLS_110 = __VLS_109({
            ...{ 'onClick': {} },
            link: true,
            type: "success",
        }, ...__VLS_functionalComponentArgsRest(__VLS_109));
        let __VLS_112;
        let __VLS_113;
        let __VLS_114;
        const __VLS_115 = {
            onClick: (...[$event]) => {
                if (!(row.status === '待复核'))
                    return;
                __VLS_ctx.review(row, true);
            }
        };
        __VLS_111.slots.default;
        var __VLS_111;
        const __VLS_116 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
            ...{ 'onClick': {} },
            link: true,
            type: "danger",
        }));
        const __VLS_118 = __VLS_117({
            ...{ 'onClick': {} },
            link: true,
            type: "danger",
        }, ...__VLS_functionalComponentArgsRest(__VLS_117));
        let __VLS_120;
        let __VLS_121;
        let __VLS_122;
        const __VLS_123 = {
            onClick: (...[$event]) => {
                if (!(row.status === '待复核'))
                    return;
                __VLS_ctx.review(row, false);
            }
        };
        __VLS_119.slots.default;
        var __VLS_119;
    }
    else {
        const __VLS_124 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({
            ...{ 'onClick': {} },
            link: true,
            type: "primary",
        }));
        const __VLS_126 = __VLS_125({
            ...{ 'onClick': {} },
            link: true,
            type: "primary",
        }, ...__VLS_functionalComponentArgsRest(__VLS_125));
        let __VLS_128;
        let __VLS_129;
        let __VLS_130;
        const __VLS_131 = {
            onClick: (...[$event]) => {
                if (!!(row.status === '待复核'))
                    return;
                __VLS_ctx.viewResult(row);
            }
        };
        __VLS_127.slots.default;
        var __VLS_127;
    }
}
var __VLS_107;
var __VLS_63;
const __VLS_132 = {}.ElPagination;
/** @type {[typeof __VLS_components.ElPagination, typeof __VLS_components.elPagination, ]} */ ;
// @ts-ignore
const __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132({
    ...{ 'onCurrentChange': {} },
    ...{ class: "pager" },
    layout: "total, prev, pager, next",
    total: (__VLS_ctx.filteredResults.length),
    pageSize: (__VLS_ctx.pageSize),
    currentPage: (__VLS_ctx.currentPage),
    background: true,
}));
const __VLS_134 = __VLS_133({
    ...{ 'onCurrentChange': {} },
    ...{ class: "pager" },
    layout: "total, prev, pager, next",
    total: (__VLS_ctx.filteredResults.length),
    pageSize: (__VLS_ctx.pageSize),
    currentPage: (__VLS_ctx.currentPage),
    background: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_133));
let __VLS_136;
let __VLS_137;
let __VLS_138;
const __VLS_139 = {
    onCurrentChange: (__VLS_ctx.changePage)
};
var __VLS_135;
var __VLS_11;
var __VLS_7;
const __VLS_140 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_141 = __VLS_asFunctionalComponent(__VLS_140, new __VLS_140({
    span: (8),
}));
const __VLS_142 = __VLS_141({
    span: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_141));
__VLS_143.slots.default;
const __VLS_144 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_145 = __VLS_asFunctionalComponent(__VLS_144, new __VLS_144({
    ...{ class: "panel-card dashboard-card" },
    shadow: "never",
}));
const __VLS_146 = __VLS_145({
    ...{ class: "panel-card dashboard-card" },
    shadow: "never",
}, ...__VLS_functionalComponentArgsRest(__VLS_145));
__VLS_147.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_147.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ref: "levelChartRef",
    ...{ class: "chart-box" },
});
/** @type {typeof __VLS_ctx.levelChartRef} */ ;
var __VLS_147;
const __VLS_148 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_149 = __VLS_asFunctionalComponent(__VLS_148, new __VLS_148({
    ...{ class: "panel-card dashboard-card mt-16" },
    shadow: "never",
}));
const __VLS_150 = __VLS_149({
    ...{ class: "panel-card dashboard-card mt-16" },
    shadow: "never",
}, ...__VLS_functionalComponentArgsRest(__VLS_149));
__VLS_151.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_151.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
}
const __VLS_152 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_153 = __VLS_asFunctionalComponent(__VLS_152, new __VLS_152({
    data: (__VLS_ctx.classifyModels),
    size: "small",
    stripe: true,
}));
const __VLS_154 = __VLS_153({
    data: (__VLS_ctx.classifyModels),
    size: "small",
    stripe: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_153));
__VLS_155.slots.default;
const __VLS_156 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_157 = __VLS_asFunctionalComponent(__VLS_156, new __VLS_156({
    prop: "name",
    label: "模型",
    minWidth: "140",
}));
const __VLS_158 = __VLS_157({
    prop: "name",
    label: "模型",
    minWidth: "140",
}, ...__VLS_functionalComponentArgsRest(__VLS_157));
const __VLS_160 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_161 = __VLS_asFunctionalComponent(__VLS_160, new __VLS_160({
    label: "准确率",
    width: "90",
}));
const __VLS_162 = __VLS_161({
    label: "准确率",
    width: "90",
}, ...__VLS_functionalComponentArgsRest(__VLS_161));
__VLS_163.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_163.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ style: ({ color: __VLS_ctx.confidenceColor(row.accuracy) }) },
    });
    (row.accuracy);
}
var __VLS_163;
const __VLS_164 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_165 = __VLS_asFunctionalComponent(__VLS_164, new __VLS_164({
    prop: "version",
    label: "版本",
    width: "60",
}));
const __VLS_166 = __VLS_165({
    prop: "version",
    label: "版本",
    width: "60",
}, ...__VLS_functionalComponentArgsRest(__VLS_165));
const __VLS_168 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_169 = __VLS_asFunctionalComponent(__VLS_168, new __VLS_168({
    label: "状态",
    width: "70",
}));
const __VLS_170 = __VLS_169({
    label: "状态",
    width: "70",
}, ...__VLS_functionalComponentArgsRest(__VLS_169));
__VLS_171.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_171.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_172 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_173 = __VLS_asFunctionalComponent(__VLS_172, new __VLS_172({
        type: (row.status === '生效' ? 'success' : 'info'),
        effect: "dark",
        size: "small",
    }));
    const __VLS_174 = __VLS_173({
        type: (row.status === '生效' ? 'success' : 'info'),
        effect: "dark",
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_173));
    __VLS_175.slots.default;
    (row.status);
    var __VLS_175;
}
var __VLS_171;
var __VLS_155;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "maintain-actions mt-12" },
});
const __VLS_176 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_177 = __VLS_asFunctionalComponent(__VLS_176, new __VLS_176({
    ...{ 'onClick': {} },
    size: "small",
    icon: (__VLS_ctx.Plus),
}));
const __VLS_178 = __VLS_177({
    ...{ 'onClick': {} },
    size: "small",
    icon: (__VLS_ctx.Plus),
}, ...__VLS_functionalComponentArgsRest(__VLS_177));
let __VLS_180;
let __VLS_181;
let __VLS_182;
const __VLS_183 = {
    onClick: (__VLS_ctx.addModel)
};
__VLS_179.slots.default;
var __VLS_179;
const __VLS_184 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_185 = __VLS_asFunctionalComponent(__VLS_184, new __VLS_184({
    ...{ 'onClick': {} },
    size: "small",
    type: "primary",
}));
const __VLS_186 = __VLS_185({
    ...{ 'onClick': {} },
    size: "small",
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_185));
let __VLS_188;
let __VLS_189;
let __VLS_190;
const __VLS_191 = {
    onClick: (__VLS_ctx.trainModel)
};
__VLS_187.slots.default;
var __VLS_187;
const __VLS_192 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_193 = __VLS_asFunctionalComponent(__VLS_192, new __VLS_192({
    ...{ 'onClick': {} },
    size: "small",
    type: "warning",
    plain: true,
}));
const __VLS_194 = __VLS_193({
    ...{ 'onClick': {} },
    size: "small",
    type: "warning",
    plain: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_193));
let __VLS_196;
let __VLS_197;
let __VLS_198;
const __VLS_199 = {
    onClick: (__VLS_ctx.manageModel)
};
__VLS_195.slots.default;
var __VLS_195;
var __VLS_151;
var __VLS_143;
var __VLS_3;
const __VLS_200 = {}.ElDrawer;
/** @type {[typeof __VLS_components.ElDrawer, typeof __VLS_components.elDrawer, typeof __VLS_components.ElDrawer, typeof __VLS_components.elDrawer, ]} */ ;
// @ts-ignore
const __VLS_201 = __VLS_asFunctionalComponent(__VLS_200, new __VLS_200({
    modelValue: (__VLS_ctx.batchVisible),
    title: "批量处理任务",
    size: "480px",
}));
const __VLS_202 = __VLS_201({
    modelValue: (__VLS_ctx.batchVisible),
    title: "批量处理任务",
    size: "480px",
}, ...__VLS_functionalComponentArgsRest(__VLS_201));
__VLS_203.slots.default;
const __VLS_204 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_205 = __VLS_asFunctionalComponent(__VLS_204, new __VLS_204({
    labelWidth: "100px",
}));
const __VLS_206 = __VLS_205({
    labelWidth: "100px",
}, ...__VLS_functionalComponentArgsRest(__VLS_205));
__VLS_207.slots.default;
const __VLS_208 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_209 = __VLS_asFunctionalComponent(__VLS_208, new __VLS_208({
    label: "处理范围",
}));
const __VLS_210 = __VLS_209({
    label: "处理范围",
}, ...__VLS_functionalComponentArgsRest(__VLS_209));
__VLS_211.slots.default;
const __VLS_212 = {}.ElRadioGroup;
/** @type {[typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, ]} */ ;
// @ts-ignore
const __VLS_213 = __VLS_asFunctionalComponent(__VLS_212, new __VLS_212({
    modelValue: (__VLS_ctx.batchForm.scope),
}));
const __VLS_214 = __VLS_213({
    modelValue: (__VLS_ctx.batchForm.scope),
}, ...__VLS_functionalComponentArgsRest(__VLS_213));
__VLS_215.slots.default;
const __VLS_216 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
const __VLS_217 = __VLS_asFunctionalComponent(__VLS_216, new __VLS_216({
    value: "全部资产",
}));
const __VLS_218 = __VLS_217({
    value: "全部资产",
}, ...__VLS_functionalComponentArgsRest(__VLS_217));
const __VLS_220 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
const __VLS_221 = __VLS_asFunctionalComponent(__VLS_220, new __VLS_220({
    value: "未分级资产",
}));
const __VLS_222 = __VLS_221({
    value: "未分级资产",
}, ...__VLS_functionalComponentArgsRest(__VLS_221));
const __VLS_224 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
const __VLS_225 = __VLS_asFunctionalComponent(__VLS_224, new __VLS_224({
    value: "指定业务域",
}));
const __VLS_226 = __VLS_225({
    value: "指定业务域",
}, ...__VLS_functionalComponentArgsRest(__VLS_225));
var __VLS_215;
var __VLS_211;
const __VLS_228 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_229 = __VLS_asFunctionalComponent(__VLS_228, new __VLS_228({
    label: "选择模型",
}));
const __VLS_230 = __VLS_229({
    label: "选择模型",
}, ...__VLS_functionalComponentArgsRest(__VLS_229));
__VLS_231.slots.default;
const __VLS_232 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_233 = __VLS_asFunctionalComponent(__VLS_232, new __VLS_232({
    modelValue: (__VLS_ctx.batchForm.model),
    ...{ class: "w-full" },
}));
const __VLS_234 = __VLS_233({
    modelValue: (__VLS_ctx.batchForm.model),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_233));
__VLS_235.slots.default;
for (const [model] of __VLS_getVForSourceType((__VLS_ctx.classifyModels))) {
    const __VLS_236 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_237 = __VLS_asFunctionalComponent(__VLS_236, new __VLS_236({
        key: (model.id),
        label: (model.name),
        value: (model.name),
    }));
    const __VLS_238 = __VLS_237({
        key: (model.id),
        label: (model.name),
        value: (model.name),
    }, ...__VLS_functionalComponentArgsRest(__VLS_237));
}
var __VLS_235;
var __VLS_231;
const __VLS_240 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_241 = __VLS_asFunctionalComponent(__VLS_240, new __VLS_240({
    label: "回写策略",
}));
const __VLS_242 = __VLS_241({
    label: "回写策略",
}, ...__VLS_functionalComponentArgsRest(__VLS_241));
__VLS_243.slots.default;
const __VLS_244 = {}.ElCheckbox;
/** @type {[typeof __VLS_components.ElCheckbox, typeof __VLS_components.elCheckbox, typeof __VLS_components.ElCheckbox, typeof __VLS_components.elCheckbox, ]} */ ;
// @ts-ignore
const __VLS_245 = __VLS_asFunctionalComponent(__VLS_244, new __VLS_244({
    modelValue: (__VLS_ctx.batchForm.autoWrite),
}));
const __VLS_246 = __VLS_245({
    modelValue: (__VLS_ctx.batchForm.autoWrite),
}, ...__VLS_functionalComponentArgsRest(__VLS_245));
__VLS_247.slots.default;
var __VLS_247;
var __VLS_243;
var __VLS_207;
if (__VLS_ctx.batchRunning) {
    const __VLS_248 = {}.ElProgress;
    /** @type {[typeof __VLS_components.ElProgress, typeof __VLS_components.elProgress, ]} */ ;
    // @ts-ignore
    const __VLS_249 = __VLS_asFunctionalComponent(__VLS_248, new __VLS_248({
        percentage: (__VLS_ctx.batchProgress),
        strokeWidth: (12),
    }));
    const __VLS_250 = __VLS_249({
        percentage: (__VLS_ctx.batchProgress),
        strokeWidth: (12),
    }, ...__VLS_functionalComponentArgsRest(__VLS_249));
}
if (__VLS_ctx.batchRunning) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "dep-text mt-8" },
    });
}
{
    const { footer: __VLS_thisSlot } = __VLS_203.slots;
    const __VLS_252 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_253 = __VLS_asFunctionalComponent(__VLS_252, new __VLS_252({
        ...{ 'onClick': {} },
    }));
    const __VLS_254 = __VLS_253({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_253));
    let __VLS_256;
    let __VLS_257;
    let __VLS_258;
    const __VLS_259 = {
        onClick: (...[$event]) => {
            __VLS_ctx.batchVisible = false;
        }
    };
    __VLS_255.slots.default;
    var __VLS_255;
    const __VLS_260 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_261 = __VLS_asFunctionalComponent(__VLS_260, new __VLS_260({
        ...{ 'onClick': {} },
        type: "danger",
        loading: (__VLS_ctx.batchRunning),
    }));
    const __VLS_262 = __VLS_261({
        ...{ 'onClick': {} },
        type: "danger",
        loading: (__VLS_ctx.batchRunning),
    }, ...__VLS_functionalComponentArgsRest(__VLS_261));
    let __VLS_264;
    let __VLS_265;
    let __VLS_266;
    const __VLS_267 = {
        onClick: (__VLS_ctx.startBatch)
    };
    __VLS_263.slots.default;
    var __VLS_263;
}
var __VLS_203;
/** @type {__VLS_StyleScopedClasses['standard-page']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['toolbar-row']} */ ;
/** @type {__VLS_StyleScopedClasses['search-input']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-select']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-select']} */ ;
/** @type {__VLS_StyleScopedClasses['dep-text']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-12']} */ ;
/** @type {__VLS_StyleScopedClasses['level-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
/** @type {__VLS_StyleScopedClasses['pager']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-box']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['maintain-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-12']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['dep-text']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Plus: Plus,
            Search: Search,
            classifyModels: classifyModels,
            keyword: keyword,
            filterLevel: filterLevel,
            filterStatus: filterStatus,
            currentPage: currentPage,
            pageSize: pageSize,
            batchVisible: batchVisible,
            batchRunning: batchRunning,
            batchProgress: batchProgress,
            levelColor: levelColor,
            resultStatusTag: resultStatusTag,
            batchForm: batchForm,
            filteredResults: filteredResults,
            pendingCount: pendingCount,
            pagedResults: pagedResults,
            changePage: changePage,
            confidenceColor: confidenceColor,
            review: review,
            viewResult: viewResult,
            createBatch: createBatch,
            startBatch: startBatch,
            addModel: addModel,
            trainModel: trainModel,
            manageModel: manageModel,
            levelChartRef: levelChartRef,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
