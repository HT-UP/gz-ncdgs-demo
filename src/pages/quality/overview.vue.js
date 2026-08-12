import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import * as echarts from 'echarts';
const radarChartRef = ref();
const trendChartRef = ref();
const compareChartRef = ref();
const trendRange = ref('week');
let radarChart = null;
let trendChart = null;
let compareChart = null;
const metrics = [
    { label: '综合质量评分', value: '92.6', note: '较上月 +1.2', warning: false },
    { label: '规则总数', value: '156', note: '启用 112 条', warning: false },
    { label: '本月检查量', value: '1,284万', note: '较上月 +8.5%', warning: false },
    { label: '问题数据率', value: '1.8%', note: '较上月 -0.3%', warning: false },
];
const dimensionScores = [
    { dimension: '完整性', score: 95, trend: 1.5, percentage: 95, color: '#DA251D' },
    { dimension: '准确性', score: 91, trend: -0.8, percentage: 91, color: '#2B6CB0' },
    { dimension: '一致性', score: 89, trend: 2.1, percentage: 89, color: '#00A854' },
    { dimension: '唯一性', score: 94, trend: 0.6, percentage: 94, color: '#ED7B2F' },
    { dimension: '及时性', score: 92, trend: 1.2, percentage: 92, color: '#9B59B6' },
];
const domainRank = [
    { name: '客运管理', score: 95 },
    { name: '设备设施', score: 92 },
    { name: '运营服务', score: 90 },
    { name: '建设管理', score: 86 },
    { name: '财务资产', score: 82 },
];
const renderRadar = () => {
    if (!radarChartRef.value)
        return;
    radarChart?.dispose();
    radarChart = echarts.init(radarChartRef.value);
    radarChart.setOption({
        tooltip: {},
        radar: {
            indicator: [
                { name: '完整性', max: 100 },
                { name: '准确性', max: 100 },
                { name: '一致性', max: 100 },
                { name: '唯一性', max: 100 },
                { name: '及时性', max: 100 },
            ],
            radius: '66%',
            splitArea: { areaStyle: { color: ['rgba(218,37,29,0.03)', 'rgba(218,37,29,0.06)', 'rgba(218,37,29,0.09)', 'rgba(218,37,29,0.12)', 'rgba(218,37,29,0.15)'] } },
            axisLine: { lineStyle: { color: '#E4E7ED' } },
            splitLine: { lineStyle: { color: '#E4E7ED' } },
            axisName: { color: '#4a4a4a', fontSize: 12 },
        },
        series: [
            {
                type: 'radar',
                data: [
                    {
                        value: [95, 91, 89, 94, 92],
                        name: '综合评分',
                        areaStyle: { color: 'rgba(218,37,29,0.25)' },
                        lineStyle: { color: '#DA251D', width: 2 },
                        itemStyle: { color: '#DA251D' },
                    },
                ],
            },
        ],
    });
};
const renderTrend = () => {
    if (!trendChartRef.value)
        return;
    trendChart?.dispose();
    trendChart = echarts.init(trendChartRef.value);
    const labels = trendRange.value === 'day'
        ? Array.from({ length: 30 }, (_, i) => `08-${String(i + 1).padStart(2, '0')}`)
        : trendRange.value === 'week'
            ? Array.from({ length: 12 }, (_, i) => `第${i + 1}周`)
            : Array.from({ length: 12 }, (_, i) => `${i + 1}月`);
    const length = labels.length;
    const build = (base, wave) => Array.from({ length }, (_, i) => Math.round(base + Math.sin(i / wave) * 3 + Math.random() * 2));
    trendChart.setOption({
        tooltip: { trigger: 'axis' },
        legend: { data: ['综合评分', '准确性', '及时性'], top: 0, left: 0 },
        grid: { left: 40, right: 20, top: 40, bottom: 30 },
        xAxis: { type: 'category', data: labels },
        yAxis: [{ type: 'value', min: 80, max: 100, splitLine: { lineStyle: { type: 'dashed', color: '#E4E7ED' } } }],
        series: [
            { name: '综合评分', type: 'line', smooth: true, data: build(92.6, 3), lineStyle: { color: '#DA251D', width: 3 }, itemStyle: { color: '#DA251D' }, symbolSize: 5 },
            { name: '准确性', type: 'line', smooth: true, data: build(91, 2.5), lineStyle: { color: '#2B6CB0', width: 2 }, itemStyle: { color: '#2B6CB0' }, symbolSize: 5 },
            { name: '及时性', type: 'line', smooth: true, data: build(92, 2.8), lineStyle: { color: '#00A854', width: 2 }, itemStyle: { color: '#00A854' }, symbolSize: 5 },
        ],
    });
};
const renderCompare = () => {
    if (!compareChartRef.value)
        return;
    compareChart?.dispose();
    compareChart = echarts.init(compareChartRef.value);
    const systems = ['票务系统', '客流系统', '设备系统', '建设系统', '财务系统', '运营系统'];
    const scores = [95, 92, 90, 86, 82, 88];
    compareChart.setOption({
        tooltip: { trigger: 'axis' },
        grid: { left: 70, right: 20, top: 20, bottom: 30 },
        xAxis: { type: 'value', max: 100, splitLine: { lineStyle: { type: 'dashed', color: '#E4E7ED' } } },
        yAxis: { type: 'category', data: systems.reverse() },
        series: [
            {
                name: '质量评分',
                type: 'bar',
                barWidth: 14,
                data: scores.reverse().map((value, index) => ({
                    value,
                    itemStyle: { color: ['#DA251D', '#2B6CB0', '#00A854', '#ED7B2F', '#9B59B6', '#2B6CB0'][index] },
                    label: { show: true, position: 'right', color: '#4a4a4a' },
                })),
            },
        ],
    });
};
const handleResize = () => {
    radarChart?.resize();
    trendChart?.resize();
    compareChart?.resize();
};
watch(trendRange, renderTrend);
onMounted(() => {
    renderRadar();
    renderTrend();
    renderCompare();
    window.addEventListener('resize', handleResize);
});
onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize);
    radarChart?.dispose();
    trendChart?.dispose();
    compareChart?.dispose();
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
for (const [metric] of __VLS_getVForSourceType((__VLS_ctx.metrics))) {
    const __VLS_4 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
        xs: (24),
        lg: (6),
        key: (metric.label),
    }));
    const __VLS_6 = __VLS_5({
        xs: (24),
        lg: (6),
        key: (metric.label),
    }, ...__VLS_functionalComponentArgsRest(__VLS_5));
    __VLS_7.slots.default;
    const __VLS_8 = {}.ElCard;
    /** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
        ...{ class: "metric-card dashboard-card" },
        shadow: "hover",
    }));
    const __VLS_10 = __VLS_9({
        ...{ class: "metric-card dashboard-card" },
        shadow: "hover",
    }, ...__VLS_functionalComponentArgsRest(__VLS_9));
    __VLS_11.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "metric-title" },
    });
    (metric.label);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "metric-value" },
    });
    (metric.value);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "metric-subtitle" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: (metric.warning ? 'trend-negative' : 'trend-positive') },
    });
    (metric.note);
    var __VLS_11;
    var __VLS_7;
}
var __VLS_3;
const __VLS_12 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
    gutter: (16),
    ...{ class: "mb-16" },
}));
const __VLS_14 = __VLS_13({
    gutter: (16),
    ...{ class: "mb-16" },
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
__VLS_15.slots.default;
const __VLS_16 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    xs: (24),
    lg: (9),
}));
const __VLS_18 = __VLS_17({
    xs: (24),
    lg: (9),
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
__VLS_19.slots.default;
const __VLS_20 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
    ...{ class: "panel-card dashboard-card" },
    shadow: "never",
}));
const __VLS_22 = __VLS_21({
    ...{ class: "panel-card dashboard-card" },
    shadow: "never",
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
__VLS_23.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_23.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ref: "radarChartRef",
    ...{ class: "chart-box" },
});
/** @type {typeof __VLS_ctx.radarChartRef} */ ;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "score-overview" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "score-big" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "score-desc" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "trend-positive" },
});
var __VLS_23;
var __VLS_19;
const __VLS_24 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    xs: (24),
    lg: (15),
}));
const __VLS_26 = __VLS_25({
    xs: (24),
    lg: (15),
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
__VLS_27.slots.default;
const __VLS_28 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
    ...{ class: "panel-card dashboard-card" },
    shadow: "never",
}));
const __VLS_30 = __VLS_29({
    ...{ class: "panel-card dashboard-card" },
    shadow: "never",
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
__VLS_31.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_31.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-actions" },
    });
    const __VLS_32 = {}.ElRadioGroup;
    /** @type {[typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, ]} */ ;
    // @ts-ignore
    const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
        modelValue: (__VLS_ctx.trendRange),
        size: "small",
    }));
    const __VLS_34 = __VLS_33({
        modelValue: (__VLS_ctx.trendRange),
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_33));
    __VLS_35.slots.default;
    const __VLS_36 = {}.ElRadioButton;
    /** @type {[typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, ]} */ ;
    // @ts-ignore
    const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
        label: "day",
    }));
    const __VLS_38 = __VLS_37({
        label: "day",
    }, ...__VLS_functionalComponentArgsRest(__VLS_37));
    __VLS_39.slots.default;
    var __VLS_39;
    const __VLS_40 = {}.ElRadioButton;
    /** @type {[typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, ]} */ ;
    // @ts-ignore
    const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
        label: "week",
    }));
    const __VLS_42 = __VLS_41({
        label: "week",
    }, ...__VLS_functionalComponentArgsRest(__VLS_41));
    __VLS_43.slots.default;
    var __VLS_43;
    const __VLS_44 = {}.ElRadioButton;
    /** @type {[typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, ]} */ ;
    // @ts-ignore
    const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
        label: "month",
    }));
    const __VLS_46 = __VLS_45({
        label: "month",
    }, ...__VLS_functionalComponentArgsRest(__VLS_45));
    __VLS_47.slots.default;
    var __VLS_47;
    var __VLS_35;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ref: "trendChartRef",
    ...{ class: "chart-box" },
});
/** @type {typeof __VLS_ctx.trendChartRef} */ ;
var __VLS_31;
var __VLS_27;
var __VLS_15;
const __VLS_48 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
    gutter: (16),
}));
const __VLS_50 = __VLS_49({
    gutter: (16),
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
__VLS_51.slots.default;
const __VLS_52 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
    xs: (24),
    lg: (8),
}));
const __VLS_54 = __VLS_53({
    xs: (24),
    lg: (8),
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
const __VLS_60 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
    data: (__VLS_ctx.dimensionScores),
    size: "small",
    stripe: true,
}));
const __VLS_62 = __VLS_61({
    data: (__VLS_ctx.dimensionScores),
    size: "small",
    stripe: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_61));
__VLS_63.slots.default;
const __VLS_64 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
    prop: "dimension",
    label: "维度",
    minWidth: "90",
}));
const __VLS_66 = __VLS_65({
    prop: "dimension",
    label: "维度",
    minWidth: "90",
}, ...__VLS_functionalComponentArgsRest(__VLS_65));
const __VLS_68 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
    label: "得分",
    width: "80",
    align: "center",
}));
const __VLS_70 = __VLS_69({
    label: "得分",
    width: "80",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_69));
__VLS_71.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_71.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "dim-score" },
        ...{ style: ({ color: row.color }) },
    });
    (row.score);
}
var __VLS_71;
const __VLS_72 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
    label: "趋势",
    width: "100",
    align: "center",
}));
const __VLS_74 = __VLS_73({
    label: "趋势",
    width: "100",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_73));
__VLS_75.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_75.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: (row.trend >= 0 ? 'trend-positive' : 'trend-negative') },
    });
    (row.trend >= 0 ? '+' : '');
    (row.trend);
}
var __VLS_75;
const __VLS_76 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
    label: "占比",
    minWidth: "120",
}));
const __VLS_78 = __VLS_77({
    label: "占比",
    minWidth: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_77));
__VLS_79.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_79.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_80 = {}.ElProgress;
    /** @type {[typeof __VLS_components.ElProgress, typeof __VLS_components.elProgress, ]} */ ;
    // @ts-ignore
    const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
        percentage: (row.percentage),
        color: (row.color),
        strokeWidth: (8),
    }));
    const __VLS_82 = __VLS_81({
        percentage: (row.percentage),
        color: (row.color),
        strokeWidth: (8),
    }, ...__VLS_functionalComponentArgsRest(__VLS_81));
}
var __VLS_79;
var __VLS_63;
var __VLS_59;
var __VLS_55;
const __VLS_84 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
    xs: (24),
    lg: (8),
}));
const __VLS_86 = __VLS_85({
    xs: (24),
    lg: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_85));
__VLS_87.slots.default;
const __VLS_88 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
    ...{ class: "panel-card dashboard-card" },
    shadow: "never",
}));
const __VLS_90 = __VLS_89({
    ...{ class: "panel-card dashboard-card" },
    shadow: "never",
}, ...__VLS_functionalComponentArgsRest(__VLS_89));
__VLS_91.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_91.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "rank-list" },
});
for (const [item, index] of __VLS_getVForSourceType((__VLS_ctx.domainRank))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (item.name),
        ...{ class: "rank-item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "rank-no" },
        ...{ class: ({ 'rank-top': index < 3 }) },
    });
    (index + 1);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "rank-name" },
    });
    (item.name);
    const __VLS_92 = {}.ElProgress;
    /** @type {[typeof __VLS_components.ElProgress, typeof __VLS_components.elProgress, ]} */ ;
    // @ts-ignore
    const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
        percentage: (item.score),
        color: (item.score >= 90 ? '#00A854' : item.score >= 80 ? '#2B6CB0' : '#ED7B2F'),
        strokeWidth: (9),
        ...{ class: "rank-progress" },
    }));
    const __VLS_94 = __VLS_93({
        percentage: (item.score),
        color: (item.score >= 90 ? '#00A854' : item.score >= 80 ? '#2B6CB0' : '#ED7B2F'),
        strokeWidth: (9),
        ...{ class: "rank-progress" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_93));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "rank-score" },
    });
    (item.score);
}
var __VLS_91;
var __VLS_87;
const __VLS_96 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
    xs: (24),
    lg: (8),
}));
const __VLS_98 = __VLS_97({
    xs: (24),
    lg: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_97));
__VLS_99.slots.default;
const __VLS_100 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
    ...{ class: "panel-card dashboard-card" },
    shadow: "never",
}));
const __VLS_102 = __VLS_101({
    ...{ class: "panel-card dashboard-card" },
    shadow: "never",
}, ...__VLS_functionalComponentArgsRest(__VLS_101));
__VLS_103.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_103.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ref: "compareChartRef",
    ...{ class: "chart-box" },
});
/** @type {typeof __VLS_ctx.compareChartRef} */ ;
var __VLS_103;
var __VLS_99;
var __VLS_51;
/** @type {__VLS_StyleScopedClasses['standard-page']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-title']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-value']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-subtitle']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-box']} */ ;
/** @type {__VLS_StyleScopedClasses['score-overview']} */ ;
/** @type {__VLS_StyleScopedClasses['score-big']} */ ;
/** @type {__VLS_StyleScopedClasses['score-desc']} */ ;
/** @type {__VLS_StyleScopedClasses['trend-positive']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-box']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['dim-score']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['rank-list']} */ ;
/** @type {__VLS_StyleScopedClasses['rank-item']} */ ;
/** @type {__VLS_StyleScopedClasses['rank-no']} */ ;
/** @type {__VLS_StyleScopedClasses['rank-name']} */ ;
/** @type {__VLS_StyleScopedClasses['rank-progress']} */ ;
/** @type {__VLS_StyleScopedClasses['rank-score']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-box']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            radarChartRef: radarChartRef,
            trendChartRef: trendChartRef,
            compareChartRef: compareChartRef,
            trendRange: trendRange,
            metrics: metrics,
            dimensionScores: dimensionScores,
            domainRank: domainRank,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
