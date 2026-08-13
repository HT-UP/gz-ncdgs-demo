import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import * as echarts from 'echarts';
const stats = [
    { label: '今日调用量', value: '86,472', color: '#DA251D', trend: 12.4 },
    { label: '调用成功率', value: '99.32%', color: '#00A854', trend: 0.21 },
    { label: '平均响应时长', value: '236ms', color: '#2B6CB0', trend: -3.8 },
    { label: '异常告警数', value: '6', color: '#ED7B2F', trend: -2 },
];
const callChartEl = ref();
const rateChartEl = ref();
const callRange = ref('24h');
let callChart = null;
let rateChart = null;
const hourLabels = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`);
const hourCalls = [380, 220, 160, 120, 140, 260, 980, 4200, 6800, 5400, 4600, 3800, 3400, 3600, 3900, 4200, 4700, 5400, 6100, 7800, 9200, 7600, 4800, 2400];
const rateSeries = [100, 99.6, 99.2, 99.5, 99.8, 100, 100, 99.9, 99.4, 99.7, 99.8, 100, 99.6, 99.9, 100, 99.8, 99.5, 99.7, 99.9, 99.9, 99.2, 99.6, 99.8, 100];
const topServices = [
    { name: '车站信息同步服务', calls: '3.2k', pct: 92 },
    { name: '客流统计查询服务', calls: '2.4k', pct: 70 },
    { name: '线路基础信息服务', calls: '1.7k', pct: 52 },
    { name: '订单汇总指标服务', calls: '0.9k', pct: 26 },
    { name: '站点设施知识问答', calls: '0.4k', pct: 14 },
];
const errCodes = [
    { code: '40403', desc: '路径不存在', pct: 38, color: '#DA251D' },
    { code: '40101', desc: '签名校验失败', pct: 24, color: '#ED7B2F' },
    { code: '42900', desc: '触发限流', pct: 18, color: '#2B6CB0' },
    { code: '50001', desc: '服务内部异常', pct: 12, color: '#8c8c8c' },
    { code: '40010', desc: '参数校验失败', pct: 8, color: '#b0b7c3' },
];
const levelBg = { 严重: '#DA251D', 警告: '#ED7B2F', 提示: '#2B6CB0' };
const alerts = ref([
    { id: 1, level: '严重', time: '10:31', text: '售票明细查询服务响应超时 > 2s，连续 5 次' },
    { id: 2, level: '警告', time: '10:12', text: '乘客信息批量导出服务触发限流，请检查调用方' },
    { id: 3, level: '警告', time: '09:48', text: '外部科研合作方 AppKey 签名频繁校验失败' },
    { id: 4, level: '提示', time: '09:20', text: '站点设施知识问答服务并发接近阈值 80%' },
]);
const renderCharts = () => {
    if (callChartEl.value) {
        callChart = echarts.init(callChartEl.value);
        callChart.setOption({
            tooltip: { trigger: 'axis' },
            grid: { left: 48, right: 16, top: 24, bottom: 28 },
            xAxis: { type: 'category', data: hourLabels, axisLine: { lineStyle: { color: '#e4e7ed' } }, axisLabel: { color: '#8c8c8c', interval: 3 } },
            yAxis: { type: 'value', splitLine: { lineStyle: { color: '#f0f2f5' } }, axisLabel: { color: '#8c8c8c' } },
            series: [
                {
                    name: '调用量',
                    type: 'line',
                    smooth: true,
                    data: hourCalls,
                    symbol: 'none',
                    lineStyle: { width: 2, color: '#DA251D' },
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: 'rgba(218,37,29,.22)' },
                            { offset: 1, color: 'rgba(218,37,29,.02)' },
                        ]),
                    },
                },
            ],
        });
    }
    if (rateChartEl.value) {
        rateChart = echarts.init(rateChartEl.value);
        rateChart.setOption({
            tooltip: { trigger: 'axis', valueFormatter: (v) => `${v}%` },
            grid: { left: 48, right: 16, top: 24, bottom: 28 },
            xAxis: { type: 'category', data: hourLabels, axisLine: { lineStyle: { color: '#e4e7ed' } }, axisLabel: { color: '#8c8c8c', interval: 3 } },
            yAxis: { type: 'value', min: 98, max: 100, splitLine: { lineStyle: { color: '#f0f2f5' } }, axisLabel: { color: '#8c8c8c' } },
            series: [
                {
                    name: '成功率',
                    type: 'line',
                    smooth: true,
                    data: rateSeries,
                    symbol: 'none',
                    lineStyle: { width: 2, color: '#00A854' },
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: 'rgba(0,168,84,.2)' },
                            { offset: 1, color: 'rgba(0,168,84,.02)' },
                        ]),
                    },
                },
            ],
        });
    }
};
watch(callRange, () => {
    const labels = callRange.value === '24h' ? hourLabels : Array.from({ length: 7 }, (_, i) => `${8 - i}日`);
    callChart?.setOption({
        xAxis: { data: labels },
        series: [{ data: callRange.value === '24h' ? hourCalls : hourCalls.slice(-7).map((v) => v * 8) }],
    });
});
const handleResize = () => {
    callChart?.resize();
    rateChart?.resize();
};
onMounted(() => {
    renderCharts();
    window.addEventListener('resize', handleResize);
});
onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize);
    callChart?.dispose();
    rateChart?.dispose();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['rank-no']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "standard-page share-monitor-page" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "mon-stats" },
});
for (const [s] of __VLS_getVForSourceType((__VLS_ctx.stats))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (s.label),
        ...{ class: "mon-stat" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "mon-stat-value" },
        ...{ style: ({ color: s.color }) },
    });
    (s.value);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "mon-stat-label" },
    });
    (s.label);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "mon-stat-trend" },
        ...{ style: ({ color: s.trend > 0 ? '#DA251D' : '#00A854' }) },
    });
    (s.trend > 0 ? '▲' : '▼');
    (Math.abs(s.trend));
}
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
    span: (12),
}));
const __VLS_6 = __VLS_5({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
__VLS_7.slots.default;
const __VLS_8 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    ...{ class: "panel-card" },
    shadow: "never",
}));
const __VLS_10 = __VLS_9({
    ...{ class: "panel-card" },
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
    const __VLS_12 = {}.ElRadioGroup;
    /** @type {[typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, ]} */ ;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
        modelValue: (__VLS_ctx.callRange),
        size: "small",
    }));
    const __VLS_14 = __VLS_13({
        modelValue: (__VLS_ctx.callRange),
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_13));
    __VLS_15.slots.default;
    const __VLS_16 = {}.ElRadioButton;
    /** @type {[typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, ]} */ ;
    // @ts-ignore
    const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
        value: "24h",
    }));
    const __VLS_18 = __VLS_17({
        value: "24h",
    }, ...__VLS_functionalComponentArgsRest(__VLS_17));
    __VLS_19.slots.default;
    var __VLS_19;
    const __VLS_20 = {}.ElRadioButton;
    /** @type {[typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, ]} */ ;
    // @ts-ignore
    const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
        value: "7d",
    }));
    const __VLS_22 = __VLS_21({
        value: "7d",
    }, ...__VLS_functionalComponentArgsRest(__VLS_21));
    __VLS_23.slots.default;
    var __VLS_23;
    var __VLS_15;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ref: "callChartEl",
    ...{ class: "chart-box-sm" },
});
/** @type {typeof __VLS_ctx.callChartEl} */ ;
var __VLS_11;
var __VLS_7;
const __VLS_24 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    span: (12),
}));
const __VLS_26 = __VLS_25({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
__VLS_27.slots.default;
const __VLS_28 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
    ...{ class: "panel-card" },
    shadow: "never",
}));
const __VLS_30 = __VLS_29({
    ...{ class: "panel-card" },
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
    ref: "rateChartEl",
    ...{ class: "chart-box-sm" },
});
/** @type {typeof __VLS_ctx.rateChartEl} */ ;
var __VLS_31;
var __VLS_27;
var __VLS_3;
const __VLS_32 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
    gutter: (16),
}));
const __VLS_34 = __VLS_33({
    gutter: (16),
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
__VLS_35.slots.default;
const __VLS_36 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    span: (8),
}));
const __VLS_38 = __VLS_37({
    span: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
__VLS_39.slots.default;
const __VLS_40 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
    ...{ class: "panel-card" },
    shadow: "never",
}));
const __VLS_42 = __VLS_41({
    ...{ class: "panel-card" },
    shadow: "never",
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
__VLS_43.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_43.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
}
for (const [r, i] of __VLS_getVForSourceType((__VLS_ctx.topServices))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (r.name),
        ...{ class: "rank-row" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "rank-no" },
        ...{ class: ({ 'rank-top': i < 3 }) },
    });
    (i + 1);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "rank-name" },
    });
    (r.name);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "rank-progress" },
    });
    const __VLS_44 = {}.ElProgress;
    /** @type {[typeof __VLS_components.ElProgress, typeof __VLS_components.elProgress, ]} */ ;
    // @ts-ignore
    const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
        percentage: (r.pct),
        strokeWidth: (8),
        color: (r.pct > 60 ? '#DA251D' : '#ED7B2F'),
    }));
    const __VLS_46 = __VLS_45({
        percentage: (r.pct),
        strokeWidth: (8),
        color: (r.pct > 60 ? '#DA251D' : '#ED7B2F'),
    }, ...__VLS_functionalComponentArgsRest(__VLS_45));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "rank-num" },
    });
    (r.calls);
}
var __VLS_43;
var __VLS_39;
const __VLS_48 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
    span: (8),
}));
const __VLS_50 = __VLS_49({
    span: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
__VLS_51.slots.default;
const __VLS_52 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
    ...{ class: "panel-card" },
    shadow: "never",
}));
const __VLS_54 = __VLS_53({
    ...{ class: "panel-card" },
    shadow: "never",
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
__VLS_55.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_55.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
}
for (const [e] of __VLS_getVForSourceType((__VLS_ctx.errCodes))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (e.code),
        ...{ class: "err-row" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.code, __VLS_intrinsicElements.code)({
        ...{ class: "err-code" },
    });
    (e.code);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "err-desc" },
    });
    (e.desc);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "err-bar" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "err-bar-fill" },
        ...{ style: ({ width: e.pct + '%', background: e.color }) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "err-num" },
    });
    (e.pct);
}
var __VLS_55;
var __VLS_51;
const __VLS_56 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
    span: (8),
}));
const __VLS_58 = __VLS_57({
    span: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
__VLS_59.slots.default;
const __VLS_60 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
    ...{ class: "panel-card" },
    shadow: "never",
}));
const __VLS_62 = __VLS_61({
    ...{ class: "panel-card" },
    shadow: "never",
}, ...__VLS_functionalComponentArgsRest(__VLS_61));
__VLS_63.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_63.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    const __VLS_64 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
        size: "small",
        type: "danger",
        effect: "dark",
    }));
    const __VLS_66 = __VLS_65({
        size: "small",
        type: "danger",
        effect: "dark",
    }, ...__VLS_functionalComponentArgsRest(__VLS_65));
    __VLS_67.slots.default;
    (__VLS_ctx.alerts.length);
    var __VLS_67;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "alert-list" },
});
for (const [a] of __VLS_getVForSourceType((__VLS_ctx.alerts))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (a.id),
        ...{ class: "alert-item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "alert-item-head" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "alert-level" },
        ...{ style: ({ background: __VLS_ctx.levelBg[a.level], color: '#fff' }) },
    });
    (a.level);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "dep-text" },
    });
    (a.time);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "alert-item-text" },
    });
    (a.text);
}
var __VLS_63;
var __VLS_59;
var __VLS_35;
/** @type {__VLS_StyleScopedClasses['standard-page']} */ ;
/** @type {__VLS_StyleScopedClasses['share-monitor-page']} */ ;
/** @type {__VLS_StyleScopedClasses['mon-stats']} */ ;
/** @type {__VLS_StyleScopedClasses['mon-stat']} */ ;
/** @type {__VLS_StyleScopedClasses['mon-stat-value']} */ ;
/** @type {__VLS_StyleScopedClasses['mon-stat-label']} */ ;
/** @type {__VLS_StyleScopedClasses['mon-stat-trend']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-box-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-box-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['rank-row']} */ ;
/** @type {__VLS_StyleScopedClasses['rank-no']} */ ;
/** @type {__VLS_StyleScopedClasses['rank-name']} */ ;
/** @type {__VLS_StyleScopedClasses['rank-progress']} */ ;
/** @type {__VLS_StyleScopedClasses['rank-num']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['err-row']} */ ;
/** @type {__VLS_StyleScopedClasses['err-code']} */ ;
/** @type {__VLS_StyleScopedClasses['err-desc']} */ ;
/** @type {__VLS_StyleScopedClasses['err-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['err-bar-fill']} */ ;
/** @type {__VLS_StyleScopedClasses['err-num']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['alert-list']} */ ;
/** @type {__VLS_StyleScopedClasses['alert-item']} */ ;
/** @type {__VLS_StyleScopedClasses['alert-item-head']} */ ;
/** @type {__VLS_StyleScopedClasses['alert-level']} */ ;
/** @type {__VLS_StyleScopedClasses['dep-text']} */ ;
/** @type {__VLS_StyleScopedClasses['alert-item-text']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            stats: stats,
            callChartEl: callChartEl,
            rateChartEl: rateChartEl,
            callRange: callRange,
            topServices: topServices,
            errCodes: errCodes,
            levelBg: levelBg,
            alerts: alerts,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
