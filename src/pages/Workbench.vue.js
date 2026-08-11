import { onBeforeUnmount, onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import * as echarts from 'echarts';
import { Coin, DocumentChecked, Operation, RefreshRight, StarFilled } from '@element-plus/icons-vue';
import { createDashboardMock } from '@/mock/dashboard';
const dashboard = ref(createDashboardMock());
const trendRange = ref('7d');
const qualityChartRef = ref();
const taskChartRef = ref();
const dialogVisible = ref(false);
const dialogTitle = ref('');
const dialogContent = ref('');
const statIconMap = {
    dataSourceTotal: Coin,
    standardTotal: DocumentChecked,
    qualityScore: StarFilled,
    taskTotal: Operation,
};
let qualityChart = null;
let taskChart = null;
let refreshTimer;
const buildTrendHistory = (days) => {
    const end = new Date('2026-08-11T14:32:08');
    const dates = Array.from({ length: days }, (_, index) => {
        const date = new Date(end);
        date.setDate(end.getDate() - (days - 1 - index));
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    });
    const buildSeries = (base) => Array.from({ length: days }, (_, index) => {
        const seed = base[index % base.length];
        const drift = Math.sin(index / 3) * 1.2 + Math.cos(index / 5) * 0.6;
        return Math.max(0, Math.min(100, Math.round((seed + drift) * 10) / 10));
    });
    return {
        dates,
        comprehensive: buildSeries([88, 89, 90, 91, 92, 92, 93]),
        integrity: buildSeries([85, 86, 87, 88, 89, 90, 91]),
        accuracy: buildSeries([90, 91, 92, 92, 93, 93, 94]),
        consistency: buildSeries([87, 88, 88, 89, 90, 91, 91]),
        timeliness: buildSeries([92, 92, 93, 94, 94, 95, 95]),
    };
};
const renderQualityChart = () => {
    if (!qualityChartRef.value)
        return;
    const data = buildTrendHistory(trendRange.value === '30d' ? 30 : 7);
    qualityChart?.dispose();
    qualityChart = echarts.init(qualityChartRef.value);
    qualityChart.setOption({
        tooltip: { trigger: 'axis', axisPointer: { type: 'cross' } },
        legend: {
            data: ['综合评分', '完整性', '准确性', '一致性', '及时性'],
            top: 0,
            left: 0,
        },
        grid: { left: 40, right: 20, top: 44, bottom: 32 },
        color: ['#DA251D', '#2B6CB0', '#00A854', '#ED7B2F', '#9B59B6'],
        xAxis: {
            type: 'category',
            data: data.dates,
            axisLine: { lineStyle: { color: '#E4E7ED' } },
        },
        yAxis: {
            type: 'value',
            min: 80,
            max: 100,
            splitLine: { lineStyle: { type: 'dashed', color: '#E4E7ED' } },
        },
        series: [
            {
                name: '综合评分',
                type: 'line',
                data: data.comprehensive,
                smooth: true,
                symbol: 'circle',
                symbolSize: 8,
                lineStyle: { color: '#DA251D', width: 3 },
            },
            { name: '完整性', type: 'bar', data: data.integrity, itemStyle: { color: '#2B6CB0', borderRadius: [4, 4, 0, 0] } },
            { name: '准确性', type: 'bar', data: data.accuracy, itemStyle: { color: '#00A854', borderRadius: [4, 4, 0, 0] } },
            { name: '一致性', type: 'bar', data: data.consistency, itemStyle: { color: '#ED7B2F', borderRadius: [4, 4, 0, 0] } },
            { name: '及时性', type: 'bar', data: data.timeliness, itemStyle: { color: '#9B59B6', borderRadius: [4, 4, 0, 0] } },
        ],
    });
};
const renderTaskChart = () => {
    if (!taskChartRef.value)
        return;
    const total = Object.values(dashboard.value.taskStatus).reduce((sum, value) => sum + value, 0);
    taskChart?.dispose();
    taskChart = echarts.init(taskChartRef.value);
    taskChart.setOption({
        tooltip: {
            trigger: 'item',
            formatter: '{b}: {c} ({d}%)',
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            top: 'middle',
        },
        series: [
            {
                name: '治理任务状态',
                type: 'pie',
                radius: ['55%', '78%'],
                center: ['62%', '52%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 8,
                    borderColor: '#fff',
                    borderWidth: 2,
                },
                label: {
                    show: true,
                    formatter: '{b}\n{d}%',
                },
                data: [
                    { value: dashboard.value.taskStatus.running, name: '运行中', itemStyle: { color: '#2B6CB0' } },
                    { value: dashboard.value.taskStatus.success, name: '成功', itemStyle: { color: '#00A854' } },
                    { value: dashboard.value.taskStatus.failed, name: '失败', itemStyle: { color: '#E34D59' } },
                    { value: dashboard.value.taskStatus.pending, name: '待执行', itemStyle: { color: '#ED7B2F' } },
                ],
            },
        ],
        graphic: [
            {
                type: 'text',
                left: '62%',
                top: '48%',
                style: {
                    text: String(total),
                    fill: '#DA251D',
                    fontSize: 28,
                    fontWeight: 700,
                    textAlign: 'center',
                },
            },
            {
                type: 'text',
                left: '62%',
                top: '58%',
                style: {
                    text: '任务总量',
                    fill: '#8C8C8C',
                    fontSize: 12,
                    textAlign: 'center',
                },
            },
        ],
    });
};
const refreshDashboard = () => {
    dashboard.value = createDashboardMock();
    renderQualityChart();
    renderTaskChart();
    ElMessage.success('Mock 数据已刷新');
};
const handleStatClick = (item) => {
    ElMessage.info(`即将跳转至${item.routeHint}（当前仅保留工作台页面）`);
};
const openDialog = (title, content) => {
    dialogTitle.value = title;
    dialogContent.value = content;
    dialogVisible.value = true;
};
const handleResize = () => {
    qualityChart?.resize();
    taskChart?.resize();
};
onMounted(() => {
    renderQualityChart();
    renderTaskChart();
    refreshTimer = window.setInterval(refreshDashboard, 60000);
    window.addEventListener('resize', handleResize);
});
onBeforeUnmount(() => {
    if (refreshTimer)
        window.clearInterval(refreshTimer);
    window.removeEventListener('resize', handleResize);
    qualityChart?.dispose();
    taskChart?.dispose();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "workbench-page" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "page-toolbar" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
    ...{ class: "page-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "page-meta" },
});
const __VLS_0 = {}.ElTag;
/** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    effect: "dark",
    type: "danger",
}));
const __VLS_2 = __VLS_1({
    effect: "dark",
    type: "danger",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
(__VLS_ctx.dashboard.updateTime);
var __VLS_3;
const __VLS_4 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    ...{ 'onClick': {} },
    icon: (__VLS_ctx.RefreshRight),
    plain: true,
}));
const __VLS_6 = __VLS_5({
    ...{ 'onClick': {} },
    icon: (__VLS_ctx.RefreshRight),
    plain: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
let __VLS_8;
let __VLS_9;
let __VLS_10;
const __VLS_11 = {
    onClick: (__VLS_ctx.refreshDashboard)
};
__VLS_7.slots.default;
var __VLS_7;
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
for (const [item] of __VLS_getVForSourceType((__VLS_ctx.dashboard.stats))) {
    const __VLS_16 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
        xs: (24),
        sm: (12),
        lg: (6),
        key: (item.key),
    }));
    const __VLS_18 = __VLS_17({
        xs: (24),
        sm: (12),
        lg: (6),
        key: (item.key),
    }, ...__VLS_functionalComponentArgsRest(__VLS_17));
    __VLS_19.slots.default;
    const __VLS_20 = {}.ElCard;
    /** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
    // @ts-ignore
    const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
        ...{ 'onClick': {} },
        ...{ class: "metric-card dashboard-card" },
        shadow: "hover",
    }));
    const __VLS_22 = __VLS_21({
        ...{ 'onClick': {} },
        ...{ class: "metric-card dashboard-card" },
        shadow: "hover",
    }, ...__VLS_functionalComponentArgsRest(__VLS_21));
    let __VLS_24;
    let __VLS_25;
    let __VLS_26;
    const __VLS_27 = {
        onClick: (...[$event]) => {
            __VLS_ctx.handleStatClick(item);
        }
    };
    __VLS_23.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "stat-topline" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "stat-badge" },
    });
    const __VLS_28 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
        size: (22),
    }));
    const __VLS_30 = __VLS_29({
        size: (22),
    }, ...__VLS_functionalComponentArgsRest(__VLS_29));
    __VLS_31.slots.default;
    const __VLS_32 = ((__VLS_ctx.statIconMap[item.key]));
    // @ts-ignore
    const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({}));
    const __VLS_34 = __VLS_33({}, ...__VLS_functionalComponentArgsRest(__VLS_33));
    var __VLS_31;
    const __VLS_36 = {}.ElLink;
    /** @type {[typeof __VLS_components.ElLink, typeof __VLS_components.elLink, typeof __VLS_components.ElLink, typeof __VLS_components.elLink, ]} */ ;
    // @ts-ignore
    const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
        underline: (false),
        type: "danger",
    }));
    const __VLS_38 = __VLS_37({
        underline: (false),
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_37));
    __VLS_39.slots.default;
    var __VLS_39;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "metric-title" },
    });
    (item.label);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "metric-value" },
    });
    (item.value);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "metric-subtitle" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "trend-positive" },
    });
    (item.trend);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "trend-hint" },
    });
    (item.routeHint);
    var __VLS_23;
    var __VLS_19;
}
var __VLS_15;
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
    lg: (16),
}));
const __VLS_46 = __VLS_45({
    xs: (24),
    lg: (16),
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
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-actions" },
    });
    const __VLS_52 = {}.ElRadioGroup;
    /** @type {[typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, ]} */ ;
    // @ts-ignore
    const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.trendRange),
        size: "small",
    }));
    const __VLS_54 = __VLS_53({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.trendRange),
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_53));
    let __VLS_56;
    let __VLS_57;
    let __VLS_58;
    const __VLS_59 = {
        onChange: (__VLS_ctx.renderQualityChart)
    };
    __VLS_55.slots.default;
    const __VLS_60 = {}.ElRadioButton;
    /** @type {[typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, ]} */ ;
    // @ts-ignore
    const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
        label: "7d",
    }));
    const __VLS_62 = __VLS_61({
        label: "7d",
    }, ...__VLS_functionalComponentArgsRest(__VLS_61));
    __VLS_63.slots.default;
    var __VLS_63;
    const __VLS_64 = {}.ElRadioButton;
    /** @type {[typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, ]} */ ;
    // @ts-ignore
    const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
        label: "30d",
    }));
    const __VLS_66 = __VLS_65({
        label: "30d",
    }, ...__VLS_functionalComponentArgsRest(__VLS_65));
    __VLS_67.slots.default;
    var __VLS_67;
    var __VLS_55;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ref: "qualityChartRef",
    ...{ class: "chart-box" },
});
/** @type {typeof __VLS_ctx.qualityChartRef} */ ;
var __VLS_51;
var __VLS_47;
const __VLS_68 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
    xs: (24),
    lg: (8),
}));
const __VLS_70 = __VLS_69({
    xs: (24),
    lg: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_69));
__VLS_71.slots.default;
const __VLS_72 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
    ...{ class: "panel-card dashboard-card" },
    shadow: "never",
}));
const __VLS_74 = __VLS_73({
    ...{ class: "panel-card dashboard-card" },
    shadow: "never",
}, ...__VLS_functionalComponentArgsRest(__VLS_73));
__VLS_75.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_75.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    const __VLS_76 = {}.ElLink;
    /** @type {[typeof __VLS_components.ElLink, typeof __VLS_components.elLink, typeof __VLS_components.ElLink, typeof __VLS_components.elLink, ]} */ ;
    // @ts-ignore
    const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
        underline: (false),
        type: "danger",
    }));
    const __VLS_78 = __VLS_77({
        underline: (false),
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_77));
    __VLS_79.slots.default;
    var __VLS_79;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ref: "taskChartRef",
    ...{ class: "chart-box chart-box--compact" },
});
/** @type {typeof __VLS_ctx.taskChartRef} */ ;
var __VLS_75;
var __VLS_71;
var __VLS_43;
const __VLS_80 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
// @ts-ignore
const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
    gutter: (16),
}));
const __VLS_82 = __VLS_81({
    gutter: (16),
}, ...__VLS_functionalComponentArgsRest(__VLS_81));
__VLS_83.slots.default;
const __VLS_84 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
    xs: (24),
    lg: (12),
}));
const __VLS_86 = __VLS_85({
    xs: (24),
    lg: (12),
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
    const __VLS_92 = {}.ElLink;
    /** @type {[typeof __VLS_components.ElLink, typeof __VLS_components.elLink, typeof __VLS_components.ElLink, typeof __VLS_components.elLink, ]} */ ;
    // @ts-ignore
    const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
        underline: (false),
        type: "danger",
    }));
    const __VLS_94 = __VLS_93({
        underline: (false),
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_93));
    __VLS_95.slots.default;
    var __VLS_95;
}
const __VLS_96 = {}.ElTimeline;
/** @type {[typeof __VLS_components.ElTimeline, typeof __VLS_components.elTimeline, typeof __VLS_components.ElTimeline, typeof __VLS_components.elTimeline, ]} */ ;
// @ts-ignore
const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({}));
const __VLS_98 = __VLS_97({}, ...__VLS_functionalComponentArgsRest(__VLS_97));
__VLS_99.slots.default;
for (const [alert] of __VLS_getVForSourceType((__VLS_ctx.dashboard.alerts))) {
    const __VLS_100 = {}.ElTimelineItem;
    /** @type {[typeof __VLS_components.ElTimelineItem, typeof __VLS_components.elTimelineItem, typeof __VLS_components.ElTimelineItem, typeof __VLS_components.elTimelineItem, ]} */ ;
    // @ts-ignore
    const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
        key: (`${alert.time}-${alert.content}`),
        timestamp: (alert.time),
        placement: "top",
        color: (alert.levelColor),
    }));
    const __VLS_102 = __VLS_101({
        key: (`${alert.time}-${alert.content}`),
        timestamp: (alert.time),
        placement: "top",
        color: (alert.levelColor),
    }, ...__VLS_functionalComponentArgsRest(__VLS_101));
    __VLS_103.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.openDialog('告警详情', alert.content);
            } },
        ...{ class: "list-item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "list-item-main" },
    });
    const __VLS_104 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
        effect: "dark",
        ...{ style: ({ backgroundColor: alert.levelColor, borderColor: alert.levelColor }) },
    }));
    const __VLS_106 = __VLS_105({
        effect: "dark",
        ...{ style: ({ backgroundColor: alert.levelColor, borderColor: alert.levelColor }) },
    }, ...__VLS_functionalComponentArgsRest(__VLS_105));
    __VLS_107.slots.default;
    (alert.level);
    var __VLS_107;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "list-item-text" },
    });
    (alert.content);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "list-item-meta" },
    });
    (alert.status);
    var __VLS_103;
}
var __VLS_99;
var __VLS_91;
var __VLS_87;
const __VLS_108 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
    xs: (24),
    lg: (12),
}));
const __VLS_110 = __VLS_109({
    xs: (24),
    lg: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_109));
__VLS_111.slots.default;
const __VLS_112 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
    ...{ class: "panel-card dashboard-card" },
    shadow: "never",
}));
const __VLS_114 = __VLS_113({
    ...{ class: "panel-card dashboard-card" },
    shadow: "never",
}, ...__VLS_functionalComponentArgsRest(__VLS_113));
__VLS_115.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_115.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    const __VLS_116 = {}.ElLink;
    /** @type {[typeof __VLS_components.ElLink, typeof __VLS_components.elLink, typeof __VLS_components.ElLink, typeof __VLS_components.elLink, ]} */ ;
    // @ts-ignore
    const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
        underline: (false),
        type: "danger",
    }));
    const __VLS_118 = __VLS_117({
        underline: (false),
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_117));
    __VLS_119.slots.default;
    var __VLS_119;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "stack-list" },
});
for (const [todo] of __VLS_getVForSourceType((__VLS_ctx.dashboard.todos))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.openDialog('待办详情', todo.content);
            } },
        key: (`${todo.deadline}-${todo.content}`),
        ...{ class: "stack-item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "stack-item-main" },
    });
    const __VLS_120 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({
        effect: "dark",
        ...{ style: ({ backgroundColor: todo.typeColor, borderColor: todo.typeColor }) },
    }));
    const __VLS_122 = __VLS_121({
        effect: "dark",
        ...{ style: ({ backgroundColor: todo.typeColor, borderColor: todo.typeColor }) },
    }, ...__VLS_functionalComponentArgsRest(__VLS_121));
    __VLS_123.slots.default;
    (todo.type);
    var __VLS_123;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "stack-item-text" },
    });
    (todo.content);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "stack-item-meta" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (todo.deadline);
    const __VLS_124 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({
        effect: "plain",
        type: "info",
    }));
    const __VLS_126 = __VLS_125({
        effect: "plain",
        type: "info",
    }, ...__VLS_functionalComponentArgsRest(__VLS_125));
    __VLS_127.slots.default;
    (todo.priority);
    var __VLS_127;
}
var __VLS_115;
var __VLS_111;
var __VLS_83;
const __VLS_128 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
// @ts-ignore
const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({
    gutter: (16),
}));
const __VLS_130 = __VLS_129({
    gutter: (16),
}, ...__VLS_functionalComponentArgsRest(__VLS_129));
__VLS_131.slots.default;
const __VLS_132 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132({
    span: (24),
}));
const __VLS_134 = __VLS_133({
    span: (24),
}, ...__VLS_functionalComponentArgsRest(__VLS_133));
__VLS_135.slots.default;
const __VLS_136 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_137 = __VLS_asFunctionalComponent(__VLS_136, new __VLS_136({
    ...{ class: "panel-card dashboard-card" },
    shadow: "never",
}));
const __VLS_138 = __VLS_137({
    ...{ class: "panel-card dashboard-card" },
    shadow: "never",
}, ...__VLS_functionalComponentArgsRest(__VLS_137));
__VLS_139.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_139.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    const __VLS_140 = {}.ElLink;
    /** @type {[typeof __VLS_components.ElLink, typeof __VLS_components.elLink, typeof __VLS_components.ElLink, typeof __VLS_components.elLink, ]} */ ;
    // @ts-ignore
    const __VLS_141 = __VLS_asFunctionalComponent(__VLS_140, new __VLS_140({
        underline: (false),
        type: "danger",
    }));
    const __VLS_142 = __VLS_141({
        underline: (false),
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_141));
    __VLS_143.slots.default;
    var __VLS_143;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "notice-list" },
});
for (const [notice] of __VLS_getVForSourceType((__VLS_ctx.dashboard.notices))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.openDialog('公告详情', notice.content);
            } },
        key: (`${notice.time}-${notice.content}`),
        ...{ class: "notice-item" },
    });
    const __VLS_144 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_145 = __VLS_asFunctionalComponent(__VLS_144, new __VLS_144({
        effect: "dark",
        ...{ style: ({ backgroundColor: notice.typeColor, borderColor: notice.typeColor }) },
    }));
    const __VLS_146 = __VLS_145({
        effect: "dark",
        ...{ style: ({ backgroundColor: notice.typeColor, borderColor: notice.typeColor }) },
    }, ...__VLS_functionalComponentArgsRest(__VLS_145));
    __VLS_147.slots.default;
    (notice.type);
    var __VLS_147;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "notice-text" },
    });
    (notice.content);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "notice-time" },
    });
    (notice.time);
}
var __VLS_139;
var __VLS_135;
var __VLS_131;
const __VLS_148 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_149 = __VLS_asFunctionalComponent(__VLS_148, new __VLS_148({
    modelValue: (__VLS_ctx.dialogVisible),
    title: (__VLS_ctx.dialogTitle),
    width: "520px",
}));
const __VLS_150 = __VLS_149({
    modelValue: (__VLS_ctx.dialogVisible),
    title: (__VLS_ctx.dialogTitle),
    width: "520px",
}, ...__VLS_functionalComponentArgsRest(__VLS_149));
__VLS_151.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "dialog-text" },
});
(__VLS_ctx.dialogContent);
{
    const { footer: __VLS_thisSlot } = __VLS_151.slots;
    const __VLS_152 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_153 = __VLS_asFunctionalComponent(__VLS_152, new __VLS_152({
        ...{ 'onClick': {} },
    }));
    const __VLS_154 = __VLS_153({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_153));
    let __VLS_156;
    let __VLS_157;
    let __VLS_158;
    const __VLS_159 = {
        onClick: (...[$event]) => {
            __VLS_ctx.dialogVisible = false;
        }
    };
    __VLS_155.slots.default;
    var __VLS_155;
}
var __VLS_151;
/** @type {__VLS_StyleScopedClasses['workbench-page']} */ ;
/** @type {__VLS_StyleScopedClasses['page-toolbar']} */ ;
/** @type {__VLS_StyleScopedClasses['page-title']} */ ;
/** @type {__VLS_StyleScopedClasses['page-meta']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-topline']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-title']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-value']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-subtitle']} */ ;
/** @type {__VLS_StyleScopedClasses['trend-positive']} */ ;
/** @type {__VLS_StyleScopedClasses['trend-hint']} */ ;
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
/** @type {__VLS_StyleScopedClasses['list-item']} */ ;
/** @type {__VLS_StyleScopedClasses['list-item-main']} */ ;
/** @type {__VLS_StyleScopedClasses['list-item-text']} */ ;
/** @type {__VLS_StyleScopedClasses['list-item-meta']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['stack-list']} */ ;
/** @type {__VLS_StyleScopedClasses['stack-item']} */ ;
/** @type {__VLS_StyleScopedClasses['stack-item-main']} */ ;
/** @type {__VLS_StyleScopedClasses['stack-item-text']} */ ;
/** @type {__VLS_StyleScopedClasses['stack-item-meta']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['notice-list']} */ ;
/** @type {__VLS_StyleScopedClasses['notice-item']} */ ;
/** @type {__VLS_StyleScopedClasses['notice-text']} */ ;
/** @type {__VLS_StyleScopedClasses['notice-time']} */ ;
/** @type {__VLS_StyleScopedClasses['dialog-text']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            RefreshRight: RefreshRight,
            dashboard: dashboard,
            trendRange: trendRange,
            qualityChartRef: qualityChartRef,
            taskChartRef: taskChartRef,
            dialogVisible: dialogVisible,
            dialogTitle: dialogTitle,
            dialogContent: dialogContent,
            statIconMap: statIconMap,
            renderQualityChart: renderQualityChart,
            refreshDashboard: refreshDashboard,
            handleStatClick: handleStatClick,
            openDialog: openDialog,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
