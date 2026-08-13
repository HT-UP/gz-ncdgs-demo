import { onBeforeUnmount, onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import * as echarts from 'echarts';
import { Collection, MagicStick, Notebook, Search, Tickets, TrendCharts } from '@element-plus/icons-vue';
const runSummary = [
    { label: '在线智能体', value: '6', note: '全部在线', color: '#da251d' },
    { label: '今日总调用', value: '2,714', note: '+8.2% 较昨日', color: '#2b6cb0' },
    { label: '平均响应', value: '0.8s', note: 'P95 1.5s', color: '#00a854' },
    { label: '综合效果评分', value: '94.3', note: '较上周 +0.6', color: '#ed7b2f' },
];
const capabilities = [
    { name: '元数据抽取', desc: '自动识别表结构、主外键与数据字典，输出结构化元数据。', today: 128, acc: 98.2, avg: 420, bg: '#2b6cb0', iconComponent: Tickets, summary: '本轮抽取 1,024 张表，字段级抽取完整率 99.1%' },
    { name: '元数据补全', desc: '基于语义推断补全业务描述、数据元映射与标签。', today: 342, acc: 94.5, avg: 260, bg: '#00a854', iconComponent: MagicStick, summary: '生成补全建议 186 条，人工确认采纳 172 条' },
    { name: '智能分级分类', desc: '按敏感要素自动完成分级（L1-L4）与业务分类。', today: 89, acc: 93.1, avg: 380, bg: '#ed7b2f', iconComponent: Collection, summary: '处理 2.4 万字段，敏感命中率 96.8%' },
    { name: '知识检索问答', desc: '面向治理知识与数据资产的语义检索与问答。', today: 2156, acc: 92.8, avg: 620, bg: '#da251d', iconComponent: Notebook, summary: '高频问题 48 个，答案溯源率 100%' },
    { name: '合规稽核', desc: '自动稽查标准落地、脱敏与权限执行情况。', today: 46, acc: 95.6, avg: 760, bg: '#8c8c8c', iconComponent: Search, summary: '发现标准偏离 12 处、未脱敏字段 8 个' },
    { name: '决策建议', desc: '基于治理运行态势输出优化建议与根因分析。', today: 18, acc: 90.2, avg: 1120, bg: '#9b59b6', iconComponent: TrendCharts, summary: '输出月度治理建议 9 条，采纳 7 条' },
];
const evalTab = ref('trend');
const evalChartRef = ref();
let evalChart = null;
const renderEval = () => {
    if (!evalChartRef.value)
        return;
    evalChart?.dispose();
    evalChart = echarts.init(evalChartRef.value);
    evalChart.setOption({
        tooltip: { trigger: 'axis' },
        legend: { data: ['精准率', '召回率', 'F1'], top: 0 },
        grid: { left: 48, right: 20, top: 40, bottom: 30 },
        xAxis: { type: 'category', data: ['第1周', '第2周', '第3周', '第4周', '第5周', '第6周'], axisLine: { lineStyle: { color: '#e4e7ed' } } },
        yAxis: { type: 'value', min: 88, max: 100, splitLine: { lineStyle: { type: 'dashed', color: '#e4e7ed' } } },
        series: [
            { name: '精准率', type: 'line', smooth: true, data: [92.1, 92.8, 93.5, 94.2, 94.8, 95.4], lineStyle: { color: '#da251d', width: 3 }, itemStyle: { color: '#da251d' } },
            { name: '召回率', type: 'line', smooth: true, data: [90.5, 91.2, 92.0, 92.8, 93.4, 94.1], lineStyle: { color: '#2b6cb0', width: 3 }, itemStyle: { color: '#2b6cb0' } },
            { name: 'F1', type: 'line', smooth: true, data: [91.3, 92.0, 92.7, 93.5, 94.1, 94.7], lineStyle: { color: '#00a854', width: 3 }, itemStyle: { color: '#00a854' } },
        ],
    });
};
const agentScores = [
    { name: '元数据抽取', precision: 98.2, recall: 96.5, f1: 97.3, updated: '2026-08-13' },
    { name: '元数据补全', precision: 94.5, recall: 93.1, f1: 93.8, updated: '2026-08-13' },
    { name: '智能分级分类', precision: 93.1, recall: 92.4, f1: 92.7, updated: '2026-08-13' },
    { name: '知识检索问答', precision: 92.8, recall: 91.6, f1: 92.2, updated: '2026-08-13' },
    { name: '合规稽核', precision: 95.6, recall: 93.8, f1: 94.7, updated: '2026-08-12' },
    { name: '决策建议', precision: 90.2, recall: 88.9, f1: 89.5, updated: '2026-08-12' },
];
onMounted(renderEval);
const handleResize = () => evalChart?.resize();
onMounted(() => window.addEventListener('resize', handleResize));
onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize);
    evalChart?.dispose();
});
const exportReport = () => ElMessage.success('智能体效果评估报告已导出（Mock）');
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "standard-page agent-capability-page" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "rs-grid" },
});
for (const [r] of __VLS_getVForSourceType((__VLS_ctx.runSummary))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (r.label),
        ...{ class: "rs-card" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "rs-num" },
        ...{ style: ({ color: r.color }) },
    });
    (r.value);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "rs-label" },
    });
    (r.label);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "rs-note dep-text" },
    });
    (r.note);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "sec-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "cap-grid" },
});
for (const [c] of __VLS_getVForSourceType((__VLS_ctx.capabilities))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (c.name),
        ...{ class: "cap-card" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "cap-head" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "cap-title-row" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "cap-icon" },
        ...{ style: ({ background: c.bg, color: '#fff' }) },
    });
    const __VLS_0 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        size: (18),
    }));
    const __VLS_2 = __VLS_1({
        size: (18),
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    __VLS_3.slots.default;
    const __VLS_4 = ((c.iconComponent));
    // @ts-ignore
    const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({}));
    const __VLS_6 = __VLS_5({}, ...__VLS_functionalComponentArgsRest(__VLS_5));
    var __VLS_3;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "cap-name" },
    });
    (c.name);
    const __VLS_8 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
        size: "small",
        type: "success",
        effect: "dark",
    }));
    const __VLS_10 = __VLS_9({
        size: "small",
        type: "success",
        effect: "dark",
    }, ...__VLS_functionalComponentArgsRest(__VLS_9));
    __VLS_11.slots.default;
    var __VLS_11;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "cap-desc" },
    });
    (c.desc);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "cap-metrics" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "cap-metric" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "cap-m-value" },
    });
    (c.today);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "cap-m-label dep-text" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "cap-metric" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "cap-m-value" },
        ...{ style: {} },
    });
    (c.acc);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "cap-m-label dep-text" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "cap-metric" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "cap-m-value" },
        ...{ style: {} },
    });
    (c.avg);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "cap-m-label dep-text" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "cap-run" },
    });
    (c.summary);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "sec-title" },
});
const __VLS_12 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
    ...{ class: "panel-card" },
    shadow: "never",
}));
const __VLS_14 = __VLS_13({
    ...{ class: "panel-card" },
    shadow: "never",
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
__VLS_15.slots.default;
const __VLS_16 = {}.ElTabs;
/** @type {[typeof __VLS_components.ElTabs, typeof __VLS_components.elTabs, typeof __VLS_components.ElTabs, typeof __VLS_components.elTabs, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    modelValue: (__VLS_ctx.evalTab),
}));
const __VLS_18 = __VLS_17({
    modelValue: (__VLS_ctx.evalTab),
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
__VLS_19.slots.default;
const __VLS_20 = {}.ElTabPane;
/** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
    label: "评估指标趋势",
    name: "trend",
}));
const __VLS_22 = __VLS_21({
    label: "评估指标趋势",
    name: "trend",
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
__VLS_23.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "eval-layout" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ref: "evalChartRef",
    ...{ class: "eval-chart" },
});
/** @type {typeof __VLS_ctx.evalChartRef} */ ;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "eval-side" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "eval-side-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "eval-side-item" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "eval-side-item" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "eval-side-item" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "eval-side-item" },
});
const __VLS_24 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    ...{ 'onClick': {} },
    type: "danger",
    ...{ class: "mt-12" },
    plain: true,
}));
const __VLS_26 = __VLS_25({
    ...{ 'onClick': {} },
    type: "danger",
    ...{ class: "mt-12" },
    plain: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
let __VLS_28;
let __VLS_29;
let __VLS_30;
const __VLS_31 = {
    onClick: (__VLS_ctx.exportReport)
};
__VLS_27.slots.default;
var __VLS_27;
var __VLS_23;
const __VLS_32 = {}.ElTabPane;
/** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
    label: "各智能体评估得分",
    name: "score",
}));
const __VLS_34 = __VLS_33({
    label: "各智能体评估得分",
    name: "score",
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
__VLS_35.slots.default;
const __VLS_36 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    data: (__VLS_ctx.agentScores),
    size: "small",
    stripe: true,
}));
const __VLS_38 = __VLS_37({
    data: (__VLS_ctx.agentScores),
    size: "small",
    stripe: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
__VLS_39.slots.default;
const __VLS_40 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
    prop: "name",
    label: "智能体",
    minWidth: "150",
}));
const __VLS_42 = __VLS_41({
    prop: "name",
    label: "智能体",
    minWidth: "150",
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
const __VLS_44 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    prop: "precision",
    label: "精准率",
    width: "100",
    align: "center",
}));
const __VLS_46 = __VLS_45({
    prop: "precision",
    label: "精准率",
    width: "100",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
const __VLS_48 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
    prop: "recall",
    label: "召回率",
    width: "100",
    align: "center",
}));
const __VLS_50 = __VLS_49({
    prop: "recall",
    label: "召回率",
    width: "100",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
const __VLS_52 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
    prop: "f1",
    label: "F1",
    width: "100",
    align: "center",
}));
const __VLS_54 = __VLS_53({
    prop: "f1",
    label: "F1",
    width: "100",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
const __VLS_56 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
    label: "评估等级",
    width: "110",
}));
const __VLS_58 = __VLS_57({
    label: "评估等级",
    width: "110",
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
__VLS_59.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_59.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_60 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
        size: "small",
        type: (row.precision >= 95 ? 'success' : row.precision >= 90 ? 'warning' : 'danger'),
        effect: "dark",
    }));
    const __VLS_62 = __VLS_61({
        size: "small",
        type: (row.precision >= 95 ? 'success' : row.precision >= 90 ? 'warning' : 'danger'),
        effect: "dark",
    }, ...__VLS_functionalComponentArgsRest(__VLS_61));
    __VLS_63.slots.default;
    (row.precision >= 95 ? '优秀' : row.precision >= 90 ? '良好' : '需优化');
    var __VLS_63;
}
var __VLS_59;
const __VLS_64 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
    prop: "updated",
    label: "最近评估",
    width: "110",
}));
const __VLS_66 = __VLS_65({
    prop: "updated",
    label: "最近评估",
    width: "110",
}, ...__VLS_functionalComponentArgsRest(__VLS_65));
var __VLS_39;
var __VLS_35;
var __VLS_19;
var __VLS_15;
/** @type {__VLS_StyleScopedClasses['standard-page']} */ ;
/** @type {__VLS_StyleScopedClasses['agent-capability-page']} */ ;
/** @type {__VLS_StyleScopedClasses['rs-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['rs-card']} */ ;
/** @type {__VLS_StyleScopedClasses['rs-num']} */ ;
/** @type {__VLS_StyleScopedClasses['rs-label']} */ ;
/** @type {__VLS_StyleScopedClasses['rs-note']} */ ;
/** @type {__VLS_StyleScopedClasses['dep-text']} */ ;
/** @type {__VLS_StyleScopedClasses['sec-title']} */ ;
/** @type {__VLS_StyleScopedClasses['cap-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['cap-card']} */ ;
/** @type {__VLS_StyleScopedClasses['cap-head']} */ ;
/** @type {__VLS_StyleScopedClasses['cap-title-row']} */ ;
/** @type {__VLS_StyleScopedClasses['cap-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['cap-name']} */ ;
/** @type {__VLS_StyleScopedClasses['cap-desc']} */ ;
/** @type {__VLS_StyleScopedClasses['cap-metrics']} */ ;
/** @type {__VLS_StyleScopedClasses['cap-metric']} */ ;
/** @type {__VLS_StyleScopedClasses['cap-m-value']} */ ;
/** @type {__VLS_StyleScopedClasses['cap-m-label']} */ ;
/** @type {__VLS_StyleScopedClasses['dep-text']} */ ;
/** @type {__VLS_StyleScopedClasses['cap-metric']} */ ;
/** @type {__VLS_StyleScopedClasses['cap-m-value']} */ ;
/** @type {__VLS_StyleScopedClasses['cap-m-label']} */ ;
/** @type {__VLS_StyleScopedClasses['dep-text']} */ ;
/** @type {__VLS_StyleScopedClasses['cap-metric']} */ ;
/** @type {__VLS_StyleScopedClasses['cap-m-value']} */ ;
/** @type {__VLS_StyleScopedClasses['cap-m-label']} */ ;
/** @type {__VLS_StyleScopedClasses['dep-text']} */ ;
/** @type {__VLS_StyleScopedClasses['cap-run']} */ ;
/** @type {__VLS_StyleScopedClasses['sec-title']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['eval-layout']} */ ;
/** @type {__VLS_StyleScopedClasses['eval-chart']} */ ;
/** @type {__VLS_StyleScopedClasses['eval-side']} */ ;
/** @type {__VLS_StyleScopedClasses['eval-side-title']} */ ;
/** @type {__VLS_StyleScopedClasses['eval-side-item']} */ ;
/** @type {__VLS_StyleScopedClasses['eval-side-item']} */ ;
/** @type {__VLS_StyleScopedClasses['eval-side-item']} */ ;
/** @type {__VLS_StyleScopedClasses['eval-side-item']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-12']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            runSummary: runSummary,
            capabilities: capabilities,
            evalTab: evalTab,
            evalChartRef: evalChartRef,
            agentScores: agentScores,
            exportReport: exportReport,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
