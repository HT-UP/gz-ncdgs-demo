import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import * as echarts from 'echarts';
import { useRouter } from 'vue-router';
import { DocumentCopy, List, Share, VideoCamera } from '@element-plus/icons-vue';
import { mockDevTasks } from '@/mock/datadev';
const router = useRouter();
const trendChartRef = ref();
const typePieRef = ref();
const trendRange = ref('24h');
let trendChart = null;
let typePie = null;
const statusTagType = {
    运行中: 'warning',
    成功: 'success',
    失败: 'danger',
    待执行: 'warning',
};
const stats = computed(() => {
    const total = mockDevTasks.length;
    const running = mockDevTasks.filter((task) => task.status === '运行中').length;
    const success = mockDevTasks.filter((task) => task.status === '成功').length;
    const failed = mockDevTasks.filter((task) => task.status === '失败').length;
    return [
        { label: '任务总数', value: total, note: '批量/实时/流式' },
        { label: '运行中', value: running, note: '实时执行' },
        { label: '今日成功', value: success, note: '成功率 91.2%' },
        { label: '今日失败', value: failed, note: '需关注' },
    ];
});
const recentTasks = computed(() => mockDevTasks.slice(0, 8));
const renderTrendChart = () => {
    if (!trendChartRef.value)
        return;
    trendChart?.dispose();
    trendChart = echarts.init(trendChartRef.value);
    const points = trendRange.value === '1h' ? 12 : 24;
    const labels = Array.from({ length: points }, (_, i) => `${String(8 + (i % 14)).padStart(2, '0')}:${String((i * 5) % 60).padStart(2, '0')}`);
    trendChart.setOption({
        tooltip: { trigger: 'axis' },
        legend: { data: ['执行次数', '成功次数', '失败次数'], top: 0, left: 0 },
        grid: { left: 44, right: 20, top: 40, bottom: 30 },
        xAxis: { type: 'category', data: labels },
        yAxis: [{ type: 'value', splitLine: { lineStyle: { type: 'dashed', color: '#E4E7ED' } } }],
        series: [
            { name: '执行次数', type: 'line', smooth: true, data: Array.from({ length: points }, () => 30 + Math.round(Math.random() * 30)), lineStyle: { color: '#DA251D', width: 3 }, itemStyle: { color: '#DA251D' }, symbolSize: 5 },
            { name: '成功次数', type: 'line', smooth: true, data: Array.from({ length: points }, () => 26 + Math.round(Math.random() * 24)), lineStyle: { color: '#00A854', width: 2 }, itemStyle: { color: '#00A854' }, symbolSize: 5 },
            { name: '失败次数', type: 'bar', data: Array.from({ length: points }, (_, i) => (i % 7 === 0 ? 2 : i % 11 === 0 ? 1 : 0)), itemStyle: { color: '#E34D59', borderRadius: [4, 4, 0, 0] } },
        ],
    });
};
const renderTypePie = () => {
    if (!typePieRef.value)
        return;
    typePie?.dispose();
    typePie = echarts.init(typePieRef.value);
    typePie.setOption({
        tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
        series: [
            {
                type: 'pie',
                radius: ['45%', '72%'],
                center: ['50%', '52%'],
                itemStyle: { borderRadius: 8, borderColor: '#fff', borderWidth: 2 },
                label: { formatter: '{b}\n{d}%' },
                data: [
                    { value: 68, name: '批量', itemStyle: { color: '#DA251D' } },
                    { value: 22, name: '实时', itemStyle: { color: '#2B6CB0' } },
                    { value: 16, name: '流式', itemStyle: { color: '#00A854' } },
                ],
            },
        ],
    });
};
const goTo = (path) => {
    router.push(path);
};
const handleResize = () => {
    trendChart?.resize();
    typePie?.resize();
};
onMounted(() => {
    renderTrendChart();
    renderTypePie();
    window.addEventListener('resize', handleResize);
});
onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize);
    trendChart?.dispose();
    typePie?.dispose();
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
for (const [stat] of __VLS_getVForSourceType((__VLS_ctx.stats))) {
    const __VLS_4 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
        xs: (24),
        sm: (12),
        lg: (6),
        key: (stat.label),
    }));
    const __VLS_6 = __VLS_5({
        xs: (24),
        sm: (12),
        lg: (6),
        key: (stat.label),
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
    (stat.label);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "metric-value" },
    });
    (stat.value);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "metric-subtitle" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "trend-positive" },
    });
    (stat.note);
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
    lg: (12),
}));
const __VLS_18 = __VLS_17({
    xs: (24),
    lg: (12),
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
        modelValue: (__VLS_ctx.trendRange),
        size: "small",
    }));
    const __VLS_26 = __VLS_25({
        modelValue: (__VLS_ctx.trendRange),
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
    ref: "trendChartRef",
    ...{ class: "chart-box" },
});
/** @type {typeof __VLS_ctx.trendChartRef} */ ;
var __VLS_23;
var __VLS_19;
const __VLS_36 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    xs: (24),
    lg: (6),
}));
const __VLS_38 = __VLS_37({
    xs: (24),
    lg: (6),
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
    ref: "typePieRef",
    ...{ class: "chart-box chart-box--compact" },
});
/** @type {typeof __VLS_ctx.typePieRef} */ ;
var __VLS_43;
var __VLS_39;
const __VLS_44 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    xs: (24),
    lg: (6),
}));
const __VLS_46 = __VLS_45({
    xs: (24),
    lg: (6),
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
    ...{ class: "quick-entry-grid" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.goTo('/datadev/batch');
        } },
    ...{ class: "quick-entry" },
});
const __VLS_52 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
    size: (20),
}));
const __VLS_54 = __VLS_53({
    size: (20),
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
__VLS_55.slots.default;
const __VLS_56 = {}.DocumentCopy;
/** @type {[typeof __VLS_components.DocumentCopy, ]} */ ;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({}));
const __VLS_58 = __VLS_57({}, ...__VLS_functionalComponentArgsRest(__VLS_57));
var __VLS_55;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.goTo('/datadev/realtime');
        } },
    ...{ class: "quick-entry" },
});
const __VLS_60 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
    size: (20),
}));
const __VLS_62 = __VLS_61({
    size: (20),
}, ...__VLS_functionalComponentArgsRest(__VLS_61));
__VLS_63.slots.default;
const __VLS_64 = {}.VideoCamera;
/** @type {[typeof __VLS_components.VideoCamera, ]} */ ;
// @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({}));
const __VLS_66 = __VLS_65({}, ...__VLS_functionalComponentArgsRest(__VLS_65));
var __VLS_63;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.goTo('/datadev/flow');
        } },
    ...{ class: "quick-entry" },
});
const __VLS_68 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
    size: (20),
}));
const __VLS_70 = __VLS_69({
    size: (20),
}, ...__VLS_functionalComponentArgsRest(__VLS_69));
__VLS_71.slots.default;
const __VLS_72 = {}.Share;
/** @type {[typeof __VLS_components.Share, ]} */ ;
// @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({}));
const __VLS_74 = __VLS_73({}, ...__VLS_functionalComponentArgsRest(__VLS_73));
var __VLS_71;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.goTo('/datadev/task');
        } },
    ...{ class: "quick-entry" },
});
const __VLS_76 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
    size: (20),
}));
const __VLS_78 = __VLS_77({
    size: (20),
}, ...__VLS_functionalComponentArgsRest(__VLS_77));
__VLS_79.slots.default;
const __VLS_80 = {}.List;
/** @type {[typeof __VLS_components.List, ]} */ ;
// @ts-ignore
const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({}));
const __VLS_82 = __VLS_81({}, ...__VLS_functionalComponentArgsRest(__VLS_81));
var __VLS_79;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
var __VLS_51;
var __VLS_47;
var __VLS_15;
const __VLS_84 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
// @ts-ignore
const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
    gutter: (16),
}));
const __VLS_86 = __VLS_85({
    gutter: (16),
}, ...__VLS_functionalComponentArgsRest(__VLS_85));
__VLS_87.slots.default;
const __VLS_88 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
    span: (24),
}));
const __VLS_90 = __VLS_89({
    span: (24),
}, ...__VLS_functionalComponentArgsRest(__VLS_89));
__VLS_91.slots.default;
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
    const __VLS_96 = {}.ElLink;
    /** @type {[typeof __VLS_components.ElLink, typeof __VLS_components.elLink, typeof __VLS_components.ElLink, typeof __VLS_components.elLink, ]} */ ;
    // @ts-ignore
    const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
        ...{ 'onClick': {} },
        underline: (false),
        type: "danger",
    }));
    const __VLS_98 = __VLS_97({
        ...{ 'onClick': {} },
        underline: (false),
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_97));
    let __VLS_100;
    let __VLS_101;
    let __VLS_102;
    const __VLS_103 = {
        onClick: (...[$event]) => {
            __VLS_ctx.goTo('/datadev/monitor');
        }
    };
    __VLS_99.slots.default;
    var __VLS_99;
}
const __VLS_104 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
    data: (__VLS_ctx.recentTasks),
    stripe: true,
}));
const __VLS_106 = __VLS_105({
    data: (__VLS_ctx.recentTasks),
    stripe: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_105));
__VLS_107.slots.default;
const __VLS_108 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
    prop: "name",
    label: "任务名称",
    minWidth: "180",
}));
const __VLS_110 = __VLS_109({
    prop: "name",
    label: "任务名称",
    minWidth: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_109));
const __VLS_112 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
    prop: "type",
    label: "类型",
    width: "80",
}));
const __VLS_114 = __VLS_113({
    prop: "type",
    label: "类型",
    width: "80",
}, ...__VLS_functionalComponentArgsRest(__VLS_113));
const __VLS_116 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
    prop: "sourceName",
    label: "数据源",
    width: "140",
}));
const __VLS_118 = __VLS_117({
    prop: "sourceName",
    label: "数据源",
    width: "140",
}, ...__VLS_functionalComponentArgsRest(__VLS_117));
const __VLS_120 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({
    prop: "targetName",
    label: "目标",
    width: "110",
}));
const __VLS_122 = __VLS_121({
    prop: "targetName",
    label: "目标",
    width: "110",
}, ...__VLS_functionalComponentArgsRest(__VLS_121));
const __VLS_124 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({
    label: "状态",
    width: "90",
}));
const __VLS_126 = __VLS_125({
    label: "状态",
    width: "90",
}, ...__VLS_functionalComponentArgsRest(__VLS_125));
__VLS_127.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_127.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_128 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({
        type: (__VLS_ctx.statusTagType[row.status]),
        effect: "dark",
    }));
    const __VLS_130 = __VLS_129({
        type: (__VLS_ctx.statusTagType[row.status]),
        effect: "dark",
    }, ...__VLS_functionalComponentArgsRest(__VLS_129));
    __VLS_131.slots.default;
    (row.status);
    var __VLS_131;
}
var __VLS_127;
const __VLS_132 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132({
    label: "进度",
    minWidth: "140",
}));
const __VLS_134 = __VLS_133({
    label: "进度",
    minWidth: "140",
}, ...__VLS_functionalComponentArgsRest(__VLS_133));
__VLS_135.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_135.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_136 = {}.ElProgress;
    /** @type {[typeof __VLS_components.ElProgress, typeof __VLS_components.elProgress, ]} */ ;
    // @ts-ignore
    const __VLS_137 = __VLS_asFunctionalComponent(__VLS_136, new __VLS_136({
        percentage: (row.progress),
        strokeWidth: (10),
    }));
    const __VLS_138 = __VLS_137({
        percentage: (row.progress),
        strokeWidth: (10),
    }, ...__VLS_functionalComponentArgsRest(__VLS_137));
}
var __VLS_135;
const __VLS_140 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_141 = __VLS_asFunctionalComponent(__VLS_140, new __VLS_140({
    prop: "lastRunTime",
    label: "最近执行",
    width: "150",
}));
const __VLS_142 = __VLS_141({
    prop: "lastRunTime",
    label: "最近执行",
    width: "150",
}, ...__VLS_functionalComponentArgsRest(__VLS_141));
var __VLS_107;
var __VLS_95;
var __VLS_91;
var __VLS_87;
/** @type {__VLS_StyleScopedClasses['standard-page']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-title']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-value']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-subtitle']} */ ;
/** @type {__VLS_StyleScopedClasses['trend-positive']} */ ;
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
/** @type {__VLS_StyleScopedClasses['quick-entry-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['quick-entry']} */ ;
/** @type {__VLS_StyleScopedClasses['quick-entry']} */ ;
/** @type {__VLS_StyleScopedClasses['quick-entry']} */ ;
/** @type {__VLS_StyleScopedClasses['quick-entry']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            DocumentCopy: DocumentCopy,
            List: List,
            Share: Share,
            VideoCamera: VideoCamera,
            trendChartRef: trendChartRef,
            typePieRef: typePieRef,
            trendRange: trendRange,
            statusTagType: statusTagType,
            stats: stats,
            recentTasks: recentTasks,
            goTo: goTo,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
