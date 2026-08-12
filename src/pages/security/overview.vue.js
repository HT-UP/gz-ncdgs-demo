import { onBeforeUnmount, onMounted, ref } from 'vue';
import * as echarts from 'echarts';
const metrics = [
    { label: '租户总数', value: '8', note: '其中 1 个停用', warning: false },
    { label: '权限策略数', value: '56', note: '本月新增 6 条', warning: false },
    { label: '审计日志数', value: '12.6万', note: '近 30 日', warning: false },
    { label: '合规检查通过率', value: '92.6%', note: '较上季度 +3.4%', warning: false },
];
const events = [
    { name: '高危', value: 12 },
    { name: '中危', value: 34 },
    { name: '低危', value: 68 },
    { name: '提示', value: 118 },
];
const alerts = [
    { level: '高', title: '检测到异常登录：连续 5 次失败后成功登录', source: '认证服务', time: '2026-08-12 09:45' },
    { level: '高', title: '「admin」账号在非业务时间批量导出敏感数据', source: '审计引擎', time: '2026-08-12 08:12' },
    { level: '中', title: '租户 t3 任务并发数超过配额 80%', source: '资源调度', time: '2026-08-12 07:53' },
    { level: '中', title: '脱敏规则「手机号掩码规则」V2.1 待审批', source: '脱敏服务', time: '2026-08-11 18:20' },
    { level: '低', title: '证书「票务核心库」即将到期', source: '质量认证', time: '2026-08-11 16:05' },
];
const regulations = [
    { name: '《数据安全法》', rate: 96 },
    { name: '《个人信息保护法》', rate: 92 },
    { name: '《网络安全法》', rate: 89 },
    { name: '《数据出境安全评估办法》', rate: 87 },
    { name: '《关键信息基础设施安全保护条例》', rate: 97 },
];
const levelTagType = {
    高: 'danger',
    中: 'warning',
    低: 'info',
};
const coverageColors = ['#DA251D', '#2B6CB0', '#00A854', '#9B59B6'];
const eventChartRef = ref();
const gaugeChartRef = ref();
let eventChart = null;
let gaugeChart = null;
const renderEvents = () => {
    if (!eventChartRef.value)
        return;
    eventChart?.dispose();
    eventChart = echarts.init(eventChartRef.value);
    eventChart.setOption({
        tooltip: { trigger: 'item', formatter: '{b}: {c} 起 ({d}%)' },
        legend: { bottom: 0, icon: 'circle', itemWidth: 8, itemHeight: 8 },
        color: ['#E34D59', '#ED7B2F', '#2B6CB0', '#9B59B6'],
        series: [
            {
                name: '安全事件',
                type: 'pie',
                radius: ['48%', '72%'],
                center: ['50%', '44%'],
                avoidLabelOverlap: true,
                itemStyle: { borderColor: '#fff', borderWidth: 2 },
                label: { show: true, formatter: '{c}', fontWeight: 600 },
                data: events,
            },
        ],
    });
};
const renderGauge = () => {
    if (!gaugeChartRef.value)
        return;
    gaugeChart?.dispose();
    gaugeChart = echarts.init(gaugeChartRef.value);
    gaugeChart.setOption({
        series: [
            {
                type: 'gauge',
                startAngle: 210,
                endAngle: -30,
                min: 0,
                max: 100,
                progress: { show: true, width: 16, itemStyle: { color: '#DA251D' } },
                axisLine: { lineStyle: { width: 16, color: [[1, '#F0F2F5']] } },
                pointer: { show: false },
                axisTick: { show: false },
                splitLine: { show: false },
                axisLabel: { show: false },
                detail: { valueAnimation: true, formatter: '{value}%', fontSize: 26, fontWeight: 700, color: '#DA251D', offsetCenter: [0, 0] },
                data: [{ value: 92.6 }],
            },
        ],
    });
};
const handleResize = () => {
    eventChart?.resize();
    gaugeChart?.resize();
};
onMounted(() => {
    renderEvents();
    renderGauge();
    window.addEventListener('resize', handleResize);
});
onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize);
    eventChart?.dispose();
    gaugeChart?.dispose();
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
    lg: (8),
}));
const __VLS_18 = __VLS_17({
    xs: (24),
    lg: (8),
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
    ref: "eventChartRef",
    ...{ class: "chart-box" },
});
/** @type {typeof __VLS_ctx.eventChartRef} */ ;
var __VLS_23;
var __VLS_19;
const __VLS_24 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    xs: (24),
    lg: (8),
}));
const __VLS_26 = __VLS_25({
    xs: (24),
    lg: (8),
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
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gauge-wrap" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ref: "gaugeChartRef",
    ...{ class: "gauge-chart" },
});
/** @type {typeof __VLS_ctx.gaugeChartRef} */ ;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gauge-note" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "trend-positive" },
});
var __VLS_31;
var __VLS_27;
const __VLS_32 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
    xs: (24),
    lg: (8),
}));
const __VLS_34 = __VLS_33({
    xs: (24),
    lg: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
__VLS_35.slots.default;
const __VLS_36 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    ...{ class: "panel-card dashboard-card" },
    shadow: "never",
}));
const __VLS_38 = __VLS_37({
    ...{ class: "panel-card dashboard-card" },
    shadow: "never",
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
__VLS_39.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_39.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "coverage-list" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "coverage-item" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "coverage-head" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.b, __VLS_intrinsicElements.b)({});
const __VLS_40 = {}.ElProgress;
/** @type {[typeof __VLS_components.ElProgress, typeof __VLS_components.elProgress, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
    percentage: (68),
    color: (__VLS_ctx.coverageColors[0]),
    strokeWidth: (10),
}));
const __VLS_42 = __VLS_41({
    percentage: (68),
    color: (__VLS_ctx.coverageColors[0]),
    strokeWidth: (10),
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "coverage-item" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "coverage-head" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.b, __VLS_intrinsicElements.b)({});
const __VLS_44 = {}.ElProgress;
/** @type {[typeof __VLS_components.ElProgress, typeof __VLS_components.elProgress, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    percentage: (92),
    color: (__VLS_ctx.coverageColors[1]),
    strokeWidth: (10),
}));
const __VLS_46 = __VLS_45({
    percentage: (92),
    color: (__VLS_ctx.coverageColors[1]),
    strokeWidth: (10),
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "coverage-item" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "coverage-head" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.b, __VLS_intrinsicElements.b)({});
const __VLS_48 = {}.ElProgress;
/** @type {[typeof __VLS_components.ElProgress, typeof __VLS_components.elProgress, ]} */ ;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
    percentage: (100),
    color: (__VLS_ctx.coverageColors[2]),
    strokeWidth: (10),
}));
const __VLS_50 = __VLS_49({
    percentage: (100),
    color: (__VLS_ctx.coverageColors[2]),
    strokeWidth: (10),
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "coverage-item" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "coverage-head" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.b, __VLS_intrinsicElements.b)({});
const __VLS_52 = {}.ElProgress;
/** @type {[typeof __VLS_components.ElProgress, typeof __VLS_components.elProgress, ]} */ ;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
    percentage: (45),
    color: (__VLS_ctx.coverageColors[3]),
    strokeWidth: (10),
}));
const __VLS_54 = __VLS_53({
    percentage: (45),
    color: (__VLS_ctx.coverageColors[3]),
    strokeWidth: (10),
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "dep-text mt-8" },
});
var __VLS_39;
var __VLS_35;
var __VLS_15;
const __VLS_56 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
    gutter: (16),
}));
const __VLS_58 = __VLS_57({
    gutter: (16),
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
__VLS_59.slots.default;
const __VLS_60 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
    xs: (24),
    lg: (14),
}));
const __VLS_62 = __VLS_61({
    xs: (24),
    lg: (14),
}, ...__VLS_functionalComponentArgsRest(__VLS_61));
__VLS_63.slots.default;
const __VLS_64 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
    ...{ class: "panel-card dashboard-card" },
    shadow: "never",
}));
const __VLS_66 = __VLS_65({
    ...{ class: "panel-card dashboard-card" },
    shadow: "never",
}, ...__VLS_functionalComponentArgsRest(__VLS_65));
__VLS_67.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_67.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
}
const __VLS_68 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
    data: (__VLS_ctx.alerts),
    stripe: true,
    size: "small",
}));
const __VLS_70 = __VLS_69({
    data: (__VLS_ctx.alerts),
    stripe: true,
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_69));
__VLS_71.slots.default;
const __VLS_72 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
    label: "级别",
    width: "80",
}));
const __VLS_74 = __VLS_73({
    label: "级别",
    width: "80",
}, ...__VLS_functionalComponentArgsRest(__VLS_73));
__VLS_75.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_75.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_76 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
        type: (__VLS_ctx.levelTagType[row.level]),
        effect: "dark",
        size: "small",
    }));
    const __VLS_78 = __VLS_77({
        type: (__VLS_ctx.levelTagType[row.level]),
        effect: "dark",
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_77));
    __VLS_79.slots.default;
    (row.level);
    var __VLS_79;
}
var __VLS_75;
const __VLS_80 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
    prop: "title",
    label: "告警内容",
    minWidth: "200",
}));
const __VLS_82 = __VLS_81({
    prop: "title",
    label: "告警内容",
    minWidth: "200",
}, ...__VLS_functionalComponentArgsRest(__VLS_81));
const __VLS_84 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
    prop: "source",
    label: "来源",
    width: "130",
}));
const __VLS_86 = __VLS_85({
    prop: "source",
    label: "来源",
    width: "130",
}, ...__VLS_functionalComponentArgsRest(__VLS_85));
const __VLS_88 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
    prop: "time",
    label: "时间",
    width: "150",
}));
const __VLS_90 = __VLS_89({
    prop: "time",
    label: "时间",
    width: "150",
}, ...__VLS_functionalComponentArgsRest(__VLS_89));
var __VLS_71;
var __VLS_67;
var __VLS_63;
const __VLS_92 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
    xs: (24),
    lg: (10),
}));
const __VLS_94 = __VLS_93({
    xs: (24),
    lg: (10),
}, ...__VLS_functionalComponentArgsRest(__VLS_93));
__VLS_95.slots.default;
const __VLS_96 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
    ...{ class: "panel-card dashboard-card" },
    shadow: "never",
}));
const __VLS_98 = __VLS_97({
    ...{ class: "panel-card dashboard-card" },
    shadow: "never",
}, ...__VLS_functionalComponentArgsRest(__VLS_97));
__VLS_99.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_99.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "regulation-list" },
});
for (const [item] of __VLS_getVForSourceType((__VLS_ctx.regulations))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (item.name),
        ...{ class: "regulation-item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "regulation-name" },
    });
    (item.name);
    const __VLS_100 = {}.ElProgress;
    /** @type {[typeof __VLS_components.ElProgress, typeof __VLS_components.elProgress, ]} */ ;
    // @ts-ignore
    const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
        percentage: (item.rate),
        color: (item.rate >= 95 ? '#00A854' : item.rate >= 85 ? '#ED7B2F' : '#E34D59'),
        strokeWidth: (9),
        ...{ class: "regulation-progress" },
    }));
    const __VLS_102 = __VLS_101({
        percentage: (item.rate),
        color: (item.rate >= 95 ? '#00A854' : item.rate >= 85 ? '#ED7B2F' : '#E34D59'),
        strokeWidth: (9),
        ...{ class: "regulation-progress" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_101));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "regulation-rate" },
    });
    (item.rate);
}
var __VLS_99;
var __VLS_95;
var __VLS_59;
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
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['gauge-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['gauge-chart']} */ ;
/** @type {__VLS_StyleScopedClasses['gauge-note']} */ ;
/** @type {__VLS_StyleScopedClasses['trend-positive']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['coverage-list']} */ ;
/** @type {__VLS_StyleScopedClasses['coverage-item']} */ ;
/** @type {__VLS_StyleScopedClasses['coverage-head']} */ ;
/** @type {__VLS_StyleScopedClasses['coverage-item']} */ ;
/** @type {__VLS_StyleScopedClasses['coverage-head']} */ ;
/** @type {__VLS_StyleScopedClasses['coverage-item']} */ ;
/** @type {__VLS_StyleScopedClasses['coverage-head']} */ ;
/** @type {__VLS_StyleScopedClasses['coverage-item']} */ ;
/** @type {__VLS_StyleScopedClasses['coverage-head']} */ ;
/** @type {__VLS_StyleScopedClasses['dep-text']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['regulation-list']} */ ;
/** @type {__VLS_StyleScopedClasses['regulation-item']} */ ;
/** @type {__VLS_StyleScopedClasses['regulation-name']} */ ;
/** @type {__VLS_StyleScopedClasses['regulation-progress']} */ ;
/** @type {__VLS_StyleScopedClasses['regulation-rate']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            metrics: metrics,
            alerts: alerts,
            regulations: regulations,
            levelTagType: levelTagType,
            coverageColors: coverageColors,
            eventChartRef: eventChartRef,
            gaugeChartRef: gaugeChartRef,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
