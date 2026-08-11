import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import * as echarts from 'echarts';
const monitorMetrics = [
    { label: '今日告警数', value: '17', note: '较昨日 -5', status: 'ok' },
    { label: '异常数据源', value: '3', note: '需要关注', status: 'warning' },
    { label: '平均响应时间', value: '28ms', note: '低于阈值', status: 'ok' },
    { label: '平均吞吐量', value: '1.2K/s', note: '运行平稳', status: 'ok' },
];
const metricRange = ref('1h');
const alertLevel = ref('');
const perfChartRef = ref();
const alertPieRef = ref();
let perfChart = null;
let alertPie = null;
const alerts = ref([
    { time: '2026-08-11 14:05', source: '设备信号库', level: '严重', content: '数据源连接中断，重连 3 次失败', notify: ['站内', '短信'], status: '未处理' },
    { time: '2026-08-11 13:47', source: '票务核心库', level: '警告', content: '响应时间超过阈值 500ms', notify: ['站内'], status: '处理中' },
    { time: '2026-08-11 12:30', source: '客流分析库', level: '提示', content: '连接数使用率超过 80%', notify: ['站内'], status: '已处理' },
    { time: '2026-08-11 10:52', source: '设备信号库', level: '严重', content: '连接池活跃连接数达到上限', notify: ['站内', '邮件'], status: '处理中' },
    { time: '2026-08-11 09:18', source: '票务核心库', level: '警告', content: '吞吐量下降超过 30%', notify: ['站内'], status: '已处理' },
    { time: '2026-08-11 08:45', source: '建设进度库', level: '提示', content: '数据源已完成定时健康探测', notify: ['站内'], status: '已处理' },
]);
const alertTagType = {
    严重: 'danger',
    警告: 'warning',
    提示: 'info',
};
const filteredAlerts = computed(() => alertLevel.value ? alerts.value.filter((row) => row.level === alertLevel.value) : alerts.value);
const renderPerfChart = () => {
    if (!perfChartRef.value)
        return;
    perfChart?.dispose();
    perfChart = echarts.init(perfChartRef.value);
    const hours = metricRange.value === '1h' ? 12 : 24;
    const data = Array.from({ length: hours }, (_, i) => 18 + Math.round(Math.sin(i / 2) * 6 + Math.random() * 8));
    perfChart.setOption({
        tooltip: { trigger: 'axis' },
        legend: { data: ['响应时间(ms)', '吞吐量(K/s)', '活跃连接数'], top: 0, left: 0 },
        grid: { left: 44, right: 44, top: 36, bottom: 32 },
        xAxis: {
            type: 'category',
            data: Array.from({ length: hours }, (_, i) => `${String(8 + (i % 14)).padStart(2, '0')}:${String((i * 5) % 60).padStart(2, '0')}`),
        },
        yAxis: [
            { type: 'value', name: 'ms/K/s', splitLine: { lineStyle: { type: 'dashed', color: '#E4E7ED' } } },
            { type: 'value', name: '连接数', splitLine: { show: false } },
        ],
        series: [
            {
                name: '响应时间(ms)',
                type: 'line',
                smooth: true,
                data,
                lineStyle: { color: '#DA251D', width: 3 },
                itemStyle: { color: '#DA251D' },
                symbolSize: 5,
            },
            {
                name: '吞吐量(K/s)',
                type: 'line',
                smooth: true,
                data: data.map((value) => Math.round(value / 1.8)),
                lineStyle: { color: '#2B6CB0', width: 2 },
                itemStyle: { color: '#2B6CB0' },
            },
            {
                name: '活跃连接数',
                type: 'line',
                smooth: true,
                yAxisIndex: 1,
                data: data.map((value) => value * 3 + 40),
                lineStyle: { color: '#00A854', width: 2 },
                itemStyle: { color: '#00A854' },
            },
        ],
    });
};
const renderAlertPie = () => {
    if (!alertPieRef.value)
        return;
    alertPie?.dispose();
    alertPie = echarts.init(alertPieRef.value);
    alertPie.setOption({
        tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
        series: [
            {
                type: 'pie',
                radius: ['45%', '72%'],
                center: ['50%', '52%'],
                itemStyle: { borderRadius: 8, borderColor: '#fff', borderWidth: 2 },
                label: { formatter: '{b}\n{d}%' },
                data: [
                    { value: 3, name: '严重', itemStyle: { color: '#E34D59' } },
                    { value: 6, name: '警告', itemStyle: { color: '#ED7B2F' } },
                    { value: 8, name: '提示', itemStyle: { color: '#2B6CB0' } },
                ],
            },
        ],
    });
};
const queryAlerts = () => {
    ElMessage.success('告警历史已查询（Mock）');
};
const handleResize = () => {
    perfChart?.resize();
    alertPie?.resize();
};
onMounted(() => {
    renderPerfChart();
    renderAlertPie();
    window.addEventListener('resize', handleResize);
});
onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize);
    perfChart?.dispose();
    alertPie?.dispose();
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
for (const [metric] of __VLS_getVForSourceType((__VLS_ctx.monitorMetrics))) {
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
        ...{ class: (metric.status === 'warning' ? 'trend-negative' : 'trend-positive') },
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
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-actions" },
    });
    const __VLS_24 = {}.ElRadioGroup;
    /** @type {[typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, ]} */ ;
    // @ts-ignore
    const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
        modelValue: (__VLS_ctx.metricRange),
        size: "small",
    }));
    const __VLS_26 = __VLS_25({
        modelValue: (__VLS_ctx.metricRange),
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_25));
    __VLS_27.slots.default;
    const __VLS_28 = {}.ElRadioButton;
    /** @type {[typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, ]} */ ;
    // @ts-ignore
    const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
        label: "1h",
    }));
    const __VLS_30 = __VLS_29({
        label: "1h",
    }, ...__VLS_functionalComponentArgsRest(__VLS_29));
    __VLS_31.slots.default;
    var __VLS_31;
    const __VLS_32 = {}.ElRadioButton;
    /** @type {[typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, ]} */ ;
    // @ts-ignore
    const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
        label: "24h",
    }));
    const __VLS_34 = __VLS_33({
        label: "24h",
    }, ...__VLS_functionalComponentArgsRest(__VLS_33));
    __VLS_35.slots.default;
    var __VLS_35;
    var __VLS_27;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ref: "perfChartRef",
    ...{ class: "chart-box" },
});
/** @type {typeof __VLS_ctx.perfChartRef} */ ;
var __VLS_23;
var __VLS_19;
const __VLS_36 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    xs: (24),
    lg: (8),
}));
const __VLS_38 = __VLS_37({
    xs: (24),
    lg: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
__VLS_39.slots.default;
const __VLS_40 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
    ...{ class: "panel-card dashboard-card" },
    shadow: "never",
}));
const __VLS_42 = __VLS_41({
    ...{ class: "panel-card dashboard-card" },
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
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ref: "alertPieRef",
    ...{ class: "chart-box chart-box--compact" },
});
/** @type {typeof __VLS_ctx.alertPieRef} */ ;
var __VLS_43;
var __VLS_39;
var __VLS_15;
const __VLS_44 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    gutter: (16),
}));
const __VLS_46 = __VLS_45({
    gutter: (16),
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
__VLS_47.slots.default;
const __VLS_48 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
    span: (24),
}));
const __VLS_50 = __VLS_49({
    span: (24),
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
__VLS_51.slots.default;
const __VLS_52 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
    ...{ class: "panel-card dashboard-card" },
    shadow: "never",
}));
const __VLS_54 = __VLS_53({
    ...{ class: "panel-card dashboard-card" },
    shadow: "never",
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
__VLS_55.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_55.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-actions" },
    });
    const __VLS_56 = {}.ElSelect;
    /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
    // @ts-ignore
    const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
        modelValue: (__VLS_ctx.alertLevel),
        placeholder: "告警级别",
        clearable: true,
        ...{ class: "filter-select" },
        size: "small",
    }));
    const __VLS_58 = __VLS_57({
        modelValue: (__VLS_ctx.alertLevel),
        placeholder: "告警级别",
        clearable: true,
        ...{ class: "filter-select" },
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_57));
    __VLS_59.slots.default;
    const __VLS_60 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
        label: "严重",
        value: "严重",
    }));
    const __VLS_62 = __VLS_61({
        label: "严重",
        value: "严重",
    }, ...__VLS_functionalComponentArgsRest(__VLS_61));
    const __VLS_64 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
        label: "警告",
        value: "警告",
    }));
    const __VLS_66 = __VLS_65({
        label: "警告",
        value: "警告",
    }, ...__VLS_functionalComponentArgsRest(__VLS_65));
    const __VLS_68 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
        label: "提示",
        value: "提示",
    }));
    const __VLS_70 = __VLS_69({
        label: "提示",
        value: "提示",
    }, ...__VLS_functionalComponentArgsRest(__VLS_69));
    var __VLS_59;
    const __VLS_72 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
        ...{ 'onClick': {} },
        type: "danger",
        size: "small",
    }));
    const __VLS_74 = __VLS_73({
        ...{ 'onClick': {} },
        type: "danger",
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_73));
    let __VLS_76;
    let __VLS_77;
    let __VLS_78;
    const __VLS_79 = {
        onClick: (__VLS_ctx.queryAlerts)
    };
    __VLS_75.slots.default;
    var __VLS_75;
}
const __VLS_80 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
    data: (__VLS_ctx.filteredAlerts),
    stripe: true,
}));
const __VLS_82 = __VLS_81({
    data: (__VLS_ctx.filteredAlerts),
    stripe: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_81));
__VLS_83.slots.default;
const __VLS_84 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
    prop: "time",
    label: "告警时间",
    width: "160",
}));
const __VLS_86 = __VLS_85({
    prop: "time",
    label: "告警时间",
    width: "160",
}, ...__VLS_functionalComponentArgsRest(__VLS_85));
const __VLS_88 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
    prop: "source",
    label: "数据源",
    width: "170",
}));
const __VLS_90 = __VLS_89({
    prop: "source",
    label: "数据源",
    width: "170",
}, ...__VLS_functionalComponentArgsRest(__VLS_89));
const __VLS_92 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
    label: "级别",
    width: "90",
}));
const __VLS_94 = __VLS_93({
    label: "级别",
    width: "90",
}, ...__VLS_functionalComponentArgsRest(__VLS_93));
__VLS_95.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_95.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_96 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
        type: (__VLS_ctx.alertTagType[row.level]),
        effect: "dark",
    }));
    const __VLS_98 = __VLS_97({
        type: (__VLS_ctx.alertTagType[row.level]),
        effect: "dark",
    }, ...__VLS_functionalComponentArgsRest(__VLS_97));
    __VLS_99.slots.default;
    (row.level);
    var __VLS_99;
}
var __VLS_95;
const __VLS_100 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
    prop: "content",
    label: "告警内容",
    minWidth: "240",
    showOverflowTooltip: true,
}));
const __VLS_102 = __VLS_101({
    prop: "content",
    label: "告警内容",
    minWidth: "240",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_101));
const __VLS_104 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
    label: "通知方式",
    width: "130",
}));
const __VLS_106 = __VLS_105({
    label: "通知方式",
    width: "130",
}, ...__VLS_functionalComponentArgsRest(__VLS_105));
__VLS_107.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_107.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    (row.notify.join(' / '));
}
var __VLS_107;
const __VLS_108 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
    prop: "status",
    label: "处理状态",
    width: "100",
}));
const __VLS_110 = __VLS_109({
    prop: "status",
    label: "处理状态",
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_109));
__VLS_111.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_111.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_112 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
        effect: "plain",
        type: (row.status === '已处理' ? 'success' : 'warning'),
    }));
    const __VLS_114 = __VLS_113({
        effect: "plain",
        type: (row.status === '已处理' ? 'success' : 'warning'),
    }, ...__VLS_functionalComponentArgsRest(__VLS_113));
    __VLS_115.slots.default;
    (row.status);
    var __VLS_115;
}
var __VLS_111;
var __VLS_83;
var __VLS_55;
var __VLS_51;
var __VLS_47;
/** @type {__VLS_StyleScopedClasses['standard-page']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-title']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-value']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-subtitle']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-box']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-box']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-box--compact']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-select']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            monitorMetrics: monitorMetrics,
            metricRange: metricRange,
            alertLevel: alertLevel,
            perfChartRef: perfChartRef,
            alertPieRef: alertPieRef,
            alertTagType: alertTagType,
            filteredAlerts: filteredAlerts,
            queryAlerts: queryAlerts,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
