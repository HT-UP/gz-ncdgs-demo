import { onBeforeUnmount, onMounted, ref } from 'vue';
import { Cpu } from '@element-plus/icons-vue';
import * as echarts from 'echarts';
import { agentCards, llmStatus, metrics, mockAITasks, trendData } from '@/mock/intelligence';
const agents = ref(agentCards);
const agentStatusTag = {
    运行中: 'success',
    已停止: 'info',
    异常: 'danger',
};
const taskStatusTag = {
    成功: 'success',
    运行中: 'warning',
    失败: 'danger',
};
const metricColor = (value) => {
    if (value >= 80)
        return '#00A854';
    if (value >= 60)
        return '#ED7B2F';
    return '#E34D59';
};
const trendArrow = (trend) => (trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→');
const trendClass = (trend) => (trend === 'down' ? 'trend-down' : 'trend-up');
const quotaColor = llmStatus.usagePercent >= 80 ? '#E34D59' : '#2B6CB0';
const recentTasks = ref([...mockAITasks].slice(0, 10));
const trendChartRef = ref();
let trendChart = null;
const renderTrend = () => {
    if (!trendChartRef.value)
        return;
    trendChart?.dispose();
    trendChart = echarts.init(trendChartRef.value);
    trendChart.setOption({
        tooltip: { trigger: 'axis' },
        legend: { data: ['调用量', '成功量', 'Token 消耗（万）'], top: 0, icon: 'roundRect', itemWidth: 12, itemHeight: 4 },
        grid: { left: 8, right: 8, top: 40, bottom: 10, containLabel: true },
        xAxis: { type: 'category', boundaryGap: false, data: trendData.dates },
        yAxis: [
            { type: 'value', name: '次数', nameGap: 12, splitLine: { lineStyle: { type: 'dashed', color: '#E4E7ED' } } },
            { type: 'value', name: 'Token', nameGap: 12, splitLine: { show: false } },
        ],
        series: [
            {
                name: '调用量',
                type: 'line',
                smooth: true,
                data: trendData.calls,
                itemStyle: { color: '#DA251D' },
                lineStyle: { color: '#DA251D', width: 3 },
                areaStyle: { color: 'rgba(218,37,29,0.08)' },
            },
            {
                name: '成功量',
                type: 'line',
                smooth: true,
                data: trendData.success,
                itemStyle: { color: '#00A854' },
                lineStyle: { color: '#00A854', width: 2 },
            },
            {
                name: 'Token 消耗（万）',
                type: 'line',
                yAxisIndex: 1,
                smooth: true,
                data: trendData.tokens,
                itemStyle: { color: '#9B59B6' },
                lineStyle: { color: '#9B59B6', width: 2, type: 'dashed' },
            },
        ],
    });
};
let resizeObserver = null;
const handleResize = () => trendChart?.resize();
onMounted(() => {
    renderTrend();
    window.addEventListener('resize', handleResize);
    if (trendChartRef.value && typeof ResizeObserver !== 'undefined') {
        resizeObserver = new ResizeObserver(() => handleResize());
        resizeObserver.observe(trendChartRef.value);
    }
});
onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize);
    resizeObserver?.disconnect();
    trendChart?.dispose();
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
for (const [agent] of __VLS_getVForSourceType((__VLS_ctx.agents))) {
    const __VLS_4 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
        xs: (24),
        lg: (6),
        key: (agent.key),
    }));
    const __VLS_6 = __VLS_5({
        xs: (24),
        lg: (6),
        key: (agent.key),
    }, ...__VLS_functionalComponentArgsRest(__VLS_5));
    __VLS_7.slots.default;
    const __VLS_8 = {}.ElCard;
    /** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
        ...{ class: "agent-status-card dashboard-card" },
        shadow: "hover",
    }));
    const __VLS_10 = __VLS_9({
        ...{ class: "agent-status-card dashboard-card" },
        shadow: "hover",
    }, ...__VLS_functionalComponentArgsRest(__VLS_9));
    __VLS_11.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "agent-status-head" },
    });
    const __VLS_12 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
        size: (18),
        ...{ class: "agent-icon" },
    }));
    const __VLS_14 = __VLS_13({
        size: (18),
        ...{ class: "agent-icon" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_13));
    __VLS_15.slots.default;
    const __VLS_16 = {}.Cpu;
    /** @type {[typeof __VLS_components.Cpu, ]} */ ;
    // @ts-ignore
    const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({}));
    const __VLS_18 = __VLS_17({}, ...__VLS_functionalComponentArgsRest(__VLS_17));
    var __VLS_15;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "agent-name" },
    });
    (agent.name);
    const __VLS_20 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
        type: (__VLS_ctx.agentStatusTag[agent.status]),
        effect: "dark",
        size: "small",
    }));
    const __VLS_22 = __VLS_21({
        type: (__VLS_ctx.agentStatusTag[agent.status]),
        effect: "dark",
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_21));
    __VLS_23.slots.default;
    (agent.status);
    var __VLS_23;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "agent-desc" },
    });
    (agent.desc);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "agent-metric" },
    });
    (agent.metric);
    var __VLS_11;
    var __VLS_7;
}
var __VLS_3;
const __VLS_24 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    ...{ class: "panel-card dashboard-card metrics-card" },
    shadow: "never",
}));
const __VLS_26 = __VLS_25({
    ...{ class: "panel-card dashboard-card metrics-card" },
    shadow: "never",
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
__VLS_27.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_27.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
}
const __VLS_28 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
    gutter: (16),
}));
const __VLS_30 = __VLS_29({
    gutter: (16),
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
__VLS_31.slots.default;
for (const [metric] of __VLS_getVForSourceType((__VLS_ctx.metrics))) {
    const __VLS_32 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
        xs: (24),
        sm: (12),
        lg: (6),
        key: (metric.name),
    }));
    const __VLS_34 = __VLS_33({
        xs: (24),
        sm: (12),
        lg: (6),
        key: (metric.name),
    }, ...__VLS_functionalComponentArgsRest(__VLS_33));
    __VLS_35.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "metric-cell" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "metric-cell-name" },
    });
    (metric.name);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "metric-cell-value" },
        ...{ style: ({ color: __VLS_ctx.metricColor(metric.value) }) },
    });
    (metric.value);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "metric-cell-unit" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "metric-cell-trend" },
        ...{ class: (__VLS_ctx.trendClass(metric.trend)) },
    });
    (__VLS_ctx.trendArrow(metric.trend));
    const __VLS_36 = {}.ElProgress;
    /** @type {[typeof __VLS_components.ElProgress, typeof __VLS_components.elProgress, ]} */ ;
    // @ts-ignore
    const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
        percentage: (metric.value),
        color: (__VLS_ctx.metricColor(metric.value)),
        showText: (false),
        strokeWidth: (7),
    }));
    const __VLS_38 = __VLS_37({
        percentage: (metric.value),
        color: (__VLS_ctx.metricColor(metric.value)),
        showText: (false),
        strokeWidth: (7),
    }, ...__VLS_functionalComponentArgsRest(__VLS_37));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "metric-cell-target" },
    });
    (metric.target);
    var __VLS_35;
}
var __VLS_31;
var __VLS_27;
const __VLS_40 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
    gutter: (16),
}));
const __VLS_42 = __VLS_41({
    gutter: (16),
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
__VLS_43.slots.default;
const __VLS_44 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    xs: (24),
    lg: (14),
}));
const __VLS_46 = __VLS_45({
    xs: (24),
    lg: (14),
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
__VLS_47.slots.default;
const __VLS_48 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
    ...{ class: "panel-card dashboard-card" },
    shadow: "never",
}));
const __VLS_50 = __VLS_49({
    ...{ class: "panel-card dashboard-card" },
    shadow: "never",
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
__VLS_51.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_51.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ref: "trendChartRef",
    ...{ class: "chart-box trend-chart" },
});
/** @type {typeof __VLS_ctx.trendChartRef} */ ;
var __VLS_51;
var __VLS_47;
const __VLS_52 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
    xs: (24),
    lg: (10),
}));
const __VLS_54 = __VLS_53({
    xs: (24),
    lg: (10),
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
__VLS_55.slots.default;
const __VLS_56 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
    ...{ class: "panel-card dashboard-card" },
    shadow: "never",
}));
const __VLS_58 = __VLS_57({
    ...{ class: "panel-card dashboard-card" },
    shadow: "never",
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
__VLS_59.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_59.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
}
const __VLS_60 = {}.ElDescriptions;
/** @type {[typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, ]} */ ;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
    column: (1),
    border: true,
    size: "small",
}));
const __VLS_62 = __VLS_61({
    column: (1),
    border: true,
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_61));
__VLS_63.slots.default;
const __VLS_64 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
    label: "模型名称",
}));
const __VLS_66 = __VLS_65({
    label: "模型名称",
}, ...__VLS_functionalComponentArgsRest(__VLS_65));
__VLS_67.slots.default;
(__VLS_ctx.llmStatus.model);
var __VLS_67;
const __VLS_68 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
    label: "调用状态",
}));
const __VLS_70 = __VLS_69({
    label: "调用状态",
}, ...__VLS_functionalComponentArgsRest(__VLS_69));
__VLS_71.slots.default;
const __VLS_72 = {}.ElTag;
/** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
// @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
    type: "success",
    effect: "dark",
    size: "small",
}));
const __VLS_74 = __VLS_73({
    type: "success",
    effect: "dark",
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_73));
__VLS_75.slots.default;
(__VLS_ctx.llmStatus.status);
var __VLS_75;
var __VLS_71;
const __VLS_76 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
    label: "配额使用",
}));
const __VLS_78 = __VLS_77({
    label: "配额使用",
}, ...__VLS_functionalComponentArgsRest(__VLS_77));
__VLS_79.slots.default;
const __VLS_80 = {}.ElProgress;
/** @type {[typeof __VLS_components.ElProgress, typeof __VLS_components.elProgress, ]} */ ;
// @ts-ignore
const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
    percentage: (__VLS_ctx.llmStatus.usagePercent),
    strokeWidth: (10),
    color: (__VLS_ctx.quotaColor),
}));
const __VLS_82 = __VLS_81({
    percentage: (__VLS_ctx.llmStatus.usagePercent),
    strokeWidth: (10),
    color: (__VLS_ctx.quotaColor),
}, ...__VLS_functionalComponentArgsRest(__VLS_81));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "dep-text" },
});
(__VLS_ctx.llmStatus.used);
(__VLS_ctx.llmStatus.quota);
var __VLS_79;
const __VLS_84 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
    label: "平均时延",
}));
const __VLS_86 = __VLS_85({
    label: "平均时延",
}, ...__VLS_functionalComponentArgsRest(__VLS_85));
__VLS_87.slots.default;
(__VLS_ctx.llmStatus.avgLatency);
var __VLS_87;
const __VLS_88 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
    label: "近 7 日调用量",
}));
const __VLS_90 = __VLS_89({
    label: "近 7 日调用量",
}, ...__VLS_functionalComponentArgsRest(__VLS_89));
__VLS_91.slots.default;
(__VLS_ctx.llmStatus.calls);
var __VLS_91;
var __VLS_63;
if (__VLS_ctx.llmStatus.usagePercent > 40) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "quota-alert" },
    });
}
var __VLS_59;
var __VLS_55;
var __VLS_43;
const __VLS_92 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
    ...{ class: "panel-card dashboard-card" },
    shadow: "never",
}));
const __VLS_94 = __VLS_93({
    ...{ class: "panel-card dashboard-card" },
    shadow: "never",
}, ...__VLS_functionalComponentArgsRest(__VLS_93));
__VLS_95.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_95.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
}
const __VLS_96 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
    data: (__VLS_ctx.recentTasks),
    stripe: true,
    size: "small",
}));
const __VLS_98 = __VLS_97({
    data: (__VLS_ctx.recentTasks),
    stripe: true,
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_97));
__VLS_99.slots.default;
const __VLS_100 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
    prop: "time",
    label: "时间",
    width: "160",
}));
const __VLS_102 = __VLS_101({
    prop: "time",
    label: "时间",
    width: "160",
}, ...__VLS_functionalComponentArgsRest(__VLS_101));
const __VLS_104 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
    prop: "name",
    label: "任务名称",
    minWidth: "170",
}));
const __VLS_106 = __VLS_105({
    prop: "name",
    label: "任务名称",
    minWidth: "170",
}, ...__VLS_functionalComponentArgsRest(__VLS_105));
const __VLS_108 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
    prop: "agent",
    label: "智能体",
    width: "150",
}));
const __VLS_110 = __VLS_109({
    prop: "agent",
    label: "智能体",
    width: "150",
}, ...__VLS_functionalComponentArgsRest(__VLS_109));
const __VLS_112 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
    prop: "type",
    label: "类型",
    width: "120",
}));
const __VLS_114 = __VLS_113({
    prop: "type",
    label: "类型",
    width: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_113));
__VLS_115.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_115.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_116 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
        size: "small",
        effect: "plain",
    }));
    const __VLS_118 = __VLS_117({
        size: "small",
        effect: "plain",
    }, ...__VLS_functionalComponentArgsRest(__VLS_117));
    __VLS_119.slots.default;
    (row.type);
    var __VLS_119;
}
var __VLS_115;
const __VLS_120 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({
    label: "状态",
    width: "90",
}));
const __VLS_122 = __VLS_121({
    label: "状态",
    width: "90",
}, ...__VLS_functionalComponentArgsRest(__VLS_121));
__VLS_123.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_123.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_124 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({
        type: (__VLS_ctx.taskStatusTag[row.status]),
        effect: "dark",
        size: "small",
    }));
    const __VLS_126 = __VLS_125({
        type: (__VLS_ctx.taskStatusTag[row.status]),
        effect: "dark",
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_125));
    __VLS_127.slots.default;
    (row.status);
    var __VLS_127;
}
var __VLS_123;
const __VLS_128 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({
    prop: "duration",
    label: "耗时",
    width: "80",
}));
const __VLS_130 = __VLS_129({
    prop: "duration",
    label: "耗时",
    width: "80",
}, ...__VLS_functionalComponentArgsRest(__VLS_129));
const __VLS_132 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132({
    prop: "model",
    label: "模型",
    width: "110",
}));
const __VLS_134 = __VLS_133({
    prop: "model",
    label: "模型",
    width: "110",
}, ...__VLS_functionalComponentArgsRest(__VLS_133));
const __VLS_136 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_137 = __VLS_asFunctionalComponent(__VLS_136, new __VLS_136({
    prop: "trigger",
    label: "触发",
    width: "80",
}));
const __VLS_138 = __VLS_137({
    prop: "trigger",
    label: "触发",
    width: "80",
}, ...__VLS_functionalComponentArgsRest(__VLS_137));
var __VLS_99;
var __VLS_95;
/** @type {__VLS_StyleScopedClasses['standard-page']} */ ;
/** @type {__VLS_StyleScopedClasses['agent-status-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['agent-status-head']} */ ;
/** @type {__VLS_StyleScopedClasses['agent-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['agent-name']} */ ;
/** @type {__VLS_StyleScopedClasses['agent-desc']} */ ;
/** @type {__VLS_StyleScopedClasses['agent-metric']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['metrics-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-cell']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-cell-name']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-cell-value']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-cell-unit']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-cell-trend']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-cell-target']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-box']} */ ;
/** @type {__VLS_StyleScopedClasses['trend-chart']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['dep-text']} */ ;
/** @type {__VLS_StyleScopedClasses['quota-alert']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Cpu: Cpu,
            llmStatus: llmStatus,
            metrics: metrics,
            agents: agents,
            agentStatusTag: agentStatusTag,
            taskStatusTag: taskStatusTag,
            metricColor: metricColor,
            trendArrow: trendArrow,
            trendClass: trendClass,
            quotaColor: quotaColor,
            recentTasks: recentTasks,
            trendChartRef: trendChartRef,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
