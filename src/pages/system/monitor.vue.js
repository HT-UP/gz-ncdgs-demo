import { onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
import * as echarts from 'echarts';
import { capacitySuggestions, realtimeMetrics, taskMonitorStats, trend30Days } from '@/mock/system';
const realtime = [
    { key: 'cpu', label: 'CPU 使用率', value: realtimeMetrics.cpu, threshold: realtimeMetrics.cpuThreshold },
    { key: 'memory', label: '内存使用率', value: realtimeMetrics.memory, threshold: realtimeMetrics.memoryThreshold },
    { key: 'storage', label: '存储空间', value: realtimeMetrics.storage, threshold: realtimeMetrics.storageThreshold },
    { key: 'network', label: '网络吞吐量', value: realtimeMetrics.network, threshold: realtimeMetrics.networkThreshold },
];
const alertRules = reactive([
    { key: 'cpu', label: 'CPU 使用率', threshold: realtimeMetrics.cpuThreshold, channels: ['站内', '邮件'] },
    { key: 'memory', label: '内存使用率', threshold: realtimeMetrics.memoryThreshold, channels: ['站内', '邮件'] },
    { key: 'storage', label: '存储空间', threshold: realtimeMetrics.storageThreshold, channels: ['站内'] },
    { key: 'network', label: '网络吞吐', threshold: realtimeMetrics.networkThreshold, channels: ['站内'] },
]);
const retry = reactive({ enabled: true, maxTimes: 3, interval: '5m', notify: true });
const trendChartRef = ref();
let trendChart = null;
const thresholds = {
    cpu: 85,
    memory: 85,
    storage: 80,
    network: 80,
};
const renderTrend = () => {
    if (!trendChartRef.value)
        return;
    trendChart?.dispose();
    trendChart = echarts.init(trendChartRef.value);
    const series = [
        { key: 'cpu', name: 'CPU 使用率', color: '#DA251D', data: trend30Days.cpu },
        { key: 'memory', name: '内存使用率', color: '#2B6CB0', data: trend30Days.memory },
        { key: 'storage', name: '存储空间', color: '#00A854', data: trend30Days.storage },
        { key: 'network', name: '网络吞吐量', color: '#9B59B6', data: trend30Days.network },
    ].map((item) => ({
        ...item,
        areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: item.color },
                { offset: 1, color: 'rgba(255,255,255,0)' },
            ]),
        },
    }));
    trendChart.setOption({
        tooltip: { trigger: 'axis' },
        legend: { data: series.map((item) => item.name), bottom: 0, icon: 'roundRect', itemWidth: 12, itemHeight: 4 },
        grid: { left: 8, right: 8, top: 14, bottom: 30, containLabel: true },
        xAxis: { type: 'category', boundaryGap: false, data: trend30Days.days },
        yAxis: { type: 'value', max: 100, splitLine: { lineStyle: { type: 'dashed', color: '#E4E7ED' } } },
        visualMap: {
            show: false,
            pieces: [{ lte: 100, gt: 0, color: 'rgba(0,0,0,0)' }],
        },
        series: series.map((item) => ({
            name: item.name,
            type: 'line',
            smooth: true,
            symbol: 'none',
            data: item.data,
            lineStyle: { color: item.color, width: 2 },
            itemStyle: { color: item.color },
            areaStyle: item.areaStyle,
            markLine: {
                silent: true,
                symbol: 'none',
                data: [{ yAxis: thresholds[item.key] }],
                lineStyle: { color: '#E34D59', type: 'dashed', width: 1 },
                label: { formatter: `阈值 ${thresholds[item.key]}%`, color: '#E34D59', fontSize: 10 },
            },
        })),
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
const saveAlerts = () => ElMessage.success('预警规则已保存（Mock）');
const saveRetry = () => ElMessage.success('高可用配置已保存，失败任务将自动重试（Mock）');
const startAssessment = () => ElMessage.success('容量评估任务已启动，预计 10 分钟后生成评估报告（Mock）');
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
for (const [metric] of __VLS_getVForSourceType((__VLS_ctx.realtime))) {
    const __VLS_4 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
        xs: (24),
        lg: (6),
        key: (metric.key),
    }));
    const __VLS_6 = __VLS_5({
        xs: (24),
        lg: (6),
        key: (metric.key),
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
        ...{ style: ({ color: metric.value > metric.threshold ? '#E34D59' : '#DA251D' }) },
    });
    (metric.value);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "metric-cell-unit" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "metric-subtitle" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: (metric.value > metric.threshold ? 'trend-negative' : 'trend-positive') },
    });
    (metric.value > metric.threshold ? `超阈值（${metric.threshold}%）` : '运行正常');
    var __VLS_11;
    var __VLS_7;
}
var __VLS_3;
const __VLS_12 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
    gutter: (16),
}));
const __VLS_14 = __VLS_13({
    gutter: (16),
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
__VLS_15.slots.default;
const __VLS_16 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    xs: (24),
    lg: (16),
}));
const __VLS_18 = __VLS_17({
    xs: (24),
    lg: (16),
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
    ref: "trendChartRef",
    ...{ class: "chart-box monitor-trend-chart" },
});
/** @type {typeof __VLS_ctx.trendChartRef} */ ;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "threshold-note" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "threshold-dot" },
    ...{ style: {} },
});
var __VLS_23;
const __VLS_24 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    ...{ class: "panel-card dashboard-card mt-16" },
    shadow: "never",
}));
const __VLS_26 = __VLS_25({
    ...{ class: "panel-card dashboard-card mt-16" },
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
const __VLS_28 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
    data: (__VLS_ctx.taskMonitorStats),
    stripe: true,
    size: "small",
}));
const __VLS_30 = __VLS_29({
    data: (__VLS_ctx.taskMonitorStats),
    stripe: true,
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
__VLS_31.slots.default;
const __VLS_32 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
    prop: "name",
    label: "任务类型",
    minWidth: "140",
}));
const __VLS_34 = __VLS_33({
    prop: "name",
    label: "任务类型",
    minWidth: "140",
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
const __VLS_36 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    prop: "total",
    label: "执行总数",
    width: "90",
    align: "center",
}));
const __VLS_38 = __VLS_37({
    prop: "total",
    label: "执行总数",
    width: "90",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
const __VLS_40 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
    label: "成功率",
    width: "160",
}));
const __VLS_42 = __VLS_41({
    label: "成功率",
    width: "160",
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
__VLS_43.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_43.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_44 = {}.ElProgress;
    /** @type {[typeof __VLS_components.ElProgress, typeof __VLS_components.elProgress, ]} */ ;
    // @ts-ignore
    const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
        percentage: (Math.round((row.success / row.total) * 100)),
        strokeWidth: (9),
        color: (row.success / row.total >= 0.95 ? '#00A854' : '#ED7B2F'),
    }));
    const __VLS_46 = __VLS_45({
        percentage: (Math.round((row.success / row.total) * 100)),
        strokeWidth: (9),
        color: (row.success / row.total >= 0.95 ? '#00A854' : '#ED7B2F'),
    }, ...__VLS_functionalComponentArgsRest(__VLS_45));
}
var __VLS_43;
const __VLS_48 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
    prop: "avgDuration",
    label: "平均时长",
    width: "100",
}));
const __VLS_50 = __VLS_49({
    prop: "avgDuration",
    label: "平均时长",
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
const __VLS_52 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
    label: "异常任务",
    width: "100",
    align: "center",
}));
const __VLS_54 = __VLS_53({
    label: "异常任务",
    width: "100",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
__VLS_55.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_55.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    if (row.abnormal > 0) {
        const __VLS_56 = {}.ElTag;
        /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
        // @ts-ignore
        const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
            type: "danger",
            effect: "dark",
            size: "small",
        }));
        const __VLS_58 = __VLS_57({
            type: "danger",
            effect: "dark",
            size: "small",
        }, ...__VLS_functionalComponentArgsRest(__VLS_57));
        __VLS_59.slots.default;
        (row.abnormal);
        var __VLS_59;
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "dep-text" },
        });
    }
}
var __VLS_55;
var __VLS_31;
var __VLS_27;
var __VLS_19;
const __VLS_60 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
    xs: (24),
    lg: (8),
}));
const __VLS_62 = __VLS_61({
    xs: (24),
    lg: (8),
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
const __VLS_68 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
    labelWidth: "90px",
}));
const __VLS_70 = __VLS_69({
    labelWidth: "90px",
}, ...__VLS_functionalComponentArgsRest(__VLS_69));
__VLS_71.slots.default;
for (const [item] of __VLS_getVForSourceType((__VLS_ctx.alertRules))) {
    const __VLS_72 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
        key: (item.key),
        label: (item.label),
    }));
    const __VLS_74 = __VLS_73({
        key: (item.key),
        label: (item.label),
    }, ...__VLS_functionalComponentArgsRest(__VLS_73));
    __VLS_75.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "alert-rule-row" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "dep-text" },
    });
    const __VLS_76 = {}.ElInputNumber;
    /** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
    // @ts-ignore
    const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
        modelValue: (item.threshold),
        min: (50),
        max: (99),
        size: "small",
    }));
    const __VLS_78 = __VLS_77({
        modelValue: (item.threshold),
        min: (50),
        max: (99),
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_77));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "dep-text" },
    });
    const __VLS_80 = {}.ElCheckboxGroup;
    /** @type {[typeof __VLS_components.ElCheckboxGroup, typeof __VLS_components.elCheckboxGroup, typeof __VLS_components.ElCheckboxGroup, typeof __VLS_components.elCheckboxGroup, ]} */ ;
    // @ts-ignore
    const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
        modelValue: (item.channels),
    }));
    const __VLS_82 = __VLS_81({
        modelValue: (item.channels),
    }, ...__VLS_functionalComponentArgsRest(__VLS_81));
    __VLS_83.slots.default;
    const __VLS_84 = {}.ElCheckbox;
    /** @type {[typeof __VLS_components.ElCheckbox, typeof __VLS_components.elCheckbox, typeof __VLS_components.ElCheckbox, typeof __VLS_components.elCheckbox, ]} */ ;
    // @ts-ignore
    const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
        value: "站内",
        size: "small",
    }));
    const __VLS_86 = __VLS_85({
        value: "站内",
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_85));
    __VLS_87.slots.default;
    var __VLS_87;
    const __VLS_88 = {}.ElCheckbox;
    /** @type {[typeof __VLS_components.ElCheckbox, typeof __VLS_components.elCheckbox, typeof __VLS_components.ElCheckbox, typeof __VLS_components.elCheckbox, ]} */ ;
    // @ts-ignore
    const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
        value: "邮件",
        size: "small",
    }));
    const __VLS_90 = __VLS_89({
        value: "邮件",
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_89));
    __VLS_91.slots.default;
    var __VLS_91;
    const __VLS_92 = {}.ElCheckbox;
    /** @type {[typeof __VLS_components.ElCheckbox, typeof __VLS_components.elCheckbox, typeof __VLS_components.ElCheckbox, typeof __VLS_components.elCheckbox, ]} */ ;
    // @ts-ignore
    const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
        value: "短信",
        size: "small",
    }));
    const __VLS_94 = __VLS_93({
        value: "短信",
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_93));
    __VLS_95.slots.default;
    var __VLS_95;
    var __VLS_83;
    var __VLS_75;
}
var __VLS_71;
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
    onClick: (__VLS_ctx.saveAlerts)
};
__VLS_99.slots.default;
var __VLS_99;
var __VLS_67;
const __VLS_104 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
    ...{ class: "panel-card dashboard-card mt-16" },
    shadow: "never",
}));
const __VLS_106 = __VLS_105({
    ...{ class: "panel-card dashboard-card mt-16" },
    shadow: "never",
}, ...__VLS_functionalComponentArgsRest(__VLS_105));
__VLS_107.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_107.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
}
const __VLS_108 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
    labelWidth: "110px",
}));
const __VLS_110 = __VLS_109({
    labelWidth: "110px",
}, ...__VLS_functionalComponentArgsRest(__VLS_109));
__VLS_111.slots.default;
const __VLS_112 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
    label: "失败自动重试",
}));
const __VLS_114 = __VLS_113({
    label: "失败自动重试",
}, ...__VLS_functionalComponentArgsRest(__VLS_113));
__VLS_115.slots.default;
const __VLS_116 = {}.ElSwitch;
/** @type {[typeof __VLS_components.ElSwitch, typeof __VLS_components.elSwitch, ]} */ ;
// @ts-ignore
const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
    modelValue: (__VLS_ctx.retry.enabled),
}));
const __VLS_118 = __VLS_117({
    modelValue: (__VLS_ctx.retry.enabled),
}, ...__VLS_functionalComponentArgsRest(__VLS_117));
var __VLS_115;
const __VLS_120 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({
    label: "最大重试次数",
}));
const __VLS_122 = __VLS_121({
    label: "最大重试次数",
}, ...__VLS_functionalComponentArgsRest(__VLS_121));
__VLS_123.slots.default;
const __VLS_124 = {}.ElInputNumber;
/** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
// @ts-ignore
const __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({
    modelValue: (__VLS_ctx.retry.maxTimes),
    min: (0),
    max: (10),
    disabled: (!__VLS_ctx.retry.enabled),
}));
const __VLS_126 = __VLS_125({
    modelValue: (__VLS_ctx.retry.maxTimes),
    min: (0),
    max: (10),
    disabled: (!__VLS_ctx.retry.enabled),
}, ...__VLS_functionalComponentArgsRest(__VLS_125));
var __VLS_123;
const __VLS_128 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({
    label: "重试间隔",
}));
const __VLS_130 = __VLS_129({
    label: "重试间隔",
}, ...__VLS_functionalComponentArgsRest(__VLS_129));
__VLS_131.slots.default;
const __VLS_132 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132({
    modelValue: (__VLS_ctx.retry.interval),
    disabled: (!__VLS_ctx.retry.enabled),
    ...{ class: "w-full" },
}));
const __VLS_134 = __VLS_133({
    modelValue: (__VLS_ctx.retry.interval),
    disabled: (!__VLS_ctx.retry.enabled),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_133));
__VLS_135.slots.default;
const __VLS_136 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_137 = __VLS_asFunctionalComponent(__VLS_136, new __VLS_136({
    label: "1 分钟",
    value: "1m",
}));
const __VLS_138 = __VLS_137({
    label: "1 分钟",
    value: "1m",
}, ...__VLS_functionalComponentArgsRest(__VLS_137));
const __VLS_140 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_141 = __VLS_asFunctionalComponent(__VLS_140, new __VLS_140({
    label: "5 分钟",
    value: "5m",
}));
const __VLS_142 = __VLS_141({
    label: "5 分钟",
    value: "5m",
}, ...__VLS_functionalComponentArgsRest(__VLS_141));
const __VLS_144 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_145 = __VLS_asFunctionalComponent(__VLS_144, new __VLS_144({
    label: "30 分钟",
    value: "30m",
}));
const __VLS_146 = __VLS_145({
    label: "30 分钟",
    value: "30m",
}, ...__VLS_functionalComponentArgsRest(__VLS_145));
var __VLS_135;
var __VLS_131;
const __VLS_148 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_149 = __VLS_asFunctionalComponent(__VLS_148, new __VLS_148({
    label: "失败通知",
}));
const __VLS_150 = __VLS_149({
    label: "失败通知",
}, ...__VLS_functionalComponentArgsRest(__VLS_149));
__VLS_151.slots.default;
const __VLS_152 = {}.ElCheckbox;
/** @type {[typeof __VLS_components.ElCheckbox, typeof __VLS_components.elCheckbox, typeof __VLS_components.ElCheckbox, typeof __VLS_components.elCheckbox, ]} */ ;
// @ts-ignore
const __VLS_153 = __VLS_asFunctionalComponent(__VLS_152, new __VLS_152({
    modelValue: (__VLS_ctx.retry.notify),
    disabled: (!__VLS_ctx.retry.enabled),
}));
const __VLS_154 = __VLS_153({
    modelValue: (__VLS_ctx.retry.notify),
    disabled: (!__VLS_ctx.retry.enabled),
}, ...__VLS_functionalComponentArgsRest(__VLS_153));
__VLS_155.slots.default;
var __VLS_155;
var __VLS_151;
var __VLS_111;
const __VLS_156 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_157 = __VLS_asFunctionalComponent(__VLS_156, new __VLS_156({
    ...{ 'onClick': {} },
    type: "danger",
    size: "small",
}));
const __VLS_158 = __VLS_157({
    ...{ 'onClick': {} },
    type: "danger",
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_157));
let __VLS_160;
let __VLS_161;
let __VLS_162;
const __VLS_163 = {
    onClick: (__VLS_ctx.saveRetry)
};
__VLS_159.slots.default;
var __VLS_159;
var __VLS_107;
const __VLS_164 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_165 = __VLS_asFunctionalComponent(__VLS_164, new __VLS_164({
    ...{ class: "panel-card dashboard-card mt-16" },
    shadow: "never",
}));
const __VLS_166 = __VLS_165({
    ...{ class: "panel-card dashboard-card mt-16" },
    shadow: "never",
}, ...__VLS_functionalComponentArgsRest(__VLS_165));
__VLS_167.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_167.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
}
for (const [suggest] of __VLS_getVForSourceType((__VLS_ctx.capacitySuggestions))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (suggest.title),
        ...{ class: "risk-item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "risk-head" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "risk-id" },
    });
    (suggest.title);
    const __VLS_168 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_169 = __VLS_asFunctionalComponent(__VLS_168, new __VLS_168({
        type: (suggest.level === '高' ? 'danger' : suggest.level === '中' ? 'warning' : 'info'),
        effect: "dark",
        size: "small",
    }));
    const __VLS_170 = __VLS_169({
        type: (suggest.level === '高' ? 'danger' : suggest.level === '中' ? 'warning' : 'info'),
        effect: "dark",
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_169));
    __VLS_171.slots.default;
    (suggest.level);
    var __VLS_171;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "risk-desc" },
    });
    (suggest.desc);
}
const __VLS_172 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_173 = __VLS_asFunctionalComponent(__VLS_172, new __VLS_172({
    ...{ 'onClick': {} },
    type: "primary",
    size: "small",
    ...{ class: "mt-8" },
}));
const __VLS_174 = __VLS_173({
    ...{ 'onClick': {} },
    type: "primary",
    size: "small",
    ...{ class: "mt-8" },
}, ...__VLS_functionalComponentArgsRest(__VLS_173));
let __VLS_176;
let __VLS_177;
let __VLS_178;
const __VLS_179 = {
    onClick: (__VLS_ctx.startAssessment)
};
__VLS_175.slots.default;
var __VLS_175;
var __VLS_167;
var __VLS_63;
var __VLS_15;
/** @type {__VLS_StyleScopedClasses['standard-page']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-title']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-value']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-cell-unit']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-subtitle']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-box']} */ ;
/** @type {__VLS_StyleScopedClasses['monitor-trend-chart']} */ ;
/** @type {__VLS_StyleScopedClasses['threshold-note']} */ ;
/** @type {__VLS_StyleScopedClasses['threshold-dot']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['dep-text']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['alert-rule-row']} */ ;
/** @type {__VLS_StyleScopedClasses['dep-text']} */ ;
/** @type {__VLS_StyleScopedClasses['dep-text']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['risk-item']} */ ;
/** @type {__VLS_StyleScopedClasses['risk-head']} */ ;
/** @type {__VLS_StyleScopedClasses['risk-id']} */ ;
/** @type {__VLS_StyleScopedClasses['risk-desc']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            capacitySuggestions: capacitySuggestions,
            taskMonitorStats: taskMonitorStats,
            realtime: realtime,
            alertRules: alertRules,
            retry: retry,
            trendChartRef: trendChartRef,
            saveAlerts: saveAlerts,
            saveRetry: saveRetry,
            startAssessment: startAssessment,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
