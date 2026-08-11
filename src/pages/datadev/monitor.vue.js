import { onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
import * as echarts from 'echarts';
const metrics = [
    { label: '运行中任务', value: '12', note: '并行执行', warning: false },
    { label: '今日执行次数', value: '486', note: '较昨日 +32', warning: false },
    { label: '平均成功率', value: '96.8%', note: '持续平稳', warning: false },
    { label: '平均处理速率', value: '1.8万/s', note: '无瓶颈', warning: false },
];
const statusTagType = {
    运行中: 'warning',
    成功: 'success',
    失败: 'danger',
    待执行: 'warning',
};
const resourceChartRef = ref();
const alarmVisible = ref(false);
const logVisible = ref(false);
const logTaskName = ref('');
let resourceChart = null;
const bottleneckNodes = [
    { name: 'HiveSQL-节点05', usage: 92, note: '慢节点：CPU 100%' },
    { name: 'Flink-作业02', usage: 78, note: '背压 3 级' },
    { name: 'Spark-作业11', usage: 65, note: 'Shuffle 倾斜' },
    { name: '同步-任务07', usage: 45, note: '正常' },
];
const runningDetails = [
    { name: '票务数据日结同步', status: '运行中', progress: 68, dataCount: '1,280,450', rate: '2.3万/s', duration: '00:08:12' },
    { name: '客流统计批量加工', status: '运行中', progress: 42, dataCount: '356,120', rate: '1.1万/s', duration: '00:05:47' },
    { name: '客户主数据实时同步', status: '成功', progress: 100, dataCount: '82,450', rate: '3.2万/s', duration: '00:02:30' },
    { name: '运营指标流式聚合', status: '运行中', progress: 85, dataCount: '2,450,890', rate: '5.6万/s', duration: '00:15:02' },
    { name: '财务数据月度汇总', status: '失败', progress: 100, dataCount: '0', rate: '0/s', duration: '00:00:08' },
];
const alarmForm = reactive({
    target: '全部任务',
    condition: '任务失败',
    notify: ['站内', '邮件'],
    users: ['张三'],
});
const logContent = `2026-08-11 14:32:08 [INFO] 任务启动
2026-08-11 14:32:09 [INFO] 连接数据源成功（票务核心库）
2026-08-11 14:32:15 [INFO] 读取分区 stat_date=20260811 完成
2026-08-11 14:32:40 [INFO] 字段映射 12/12 完成
2026-08-11 14:33:20 [WARN] 目标表存在重复键，已按规则去重 356 条
2026-08-11 14:34:12 [INFO] 数据写入 DWD 层完成
2026-08-11 14:34:13 [INFO] 任务执行成功，处理 1,280,450 条
2026-08-11 14:34:13 [INFO] 质量检查通过，无异常数据`;
const renderResourceChart = () => {
    if (!resourceChartRef.value)
        return;
    resourceChart?.dispose();
    resourceChart = echarts.init(resourceChartRef.value);
    const labels = Array.from({ length: 12 }, (_, i) => `${String(9 + i).padStart(2, '0')}:00`);
    resourceChart.setOption({
        tooltip: { trigger: 'axis' },
        legend: { data: ['CPU 使用率', '内存使用率', '网络吞吐'], top: 0, left: 0 },
        grid: { left: 44, right: 20, top: 40, bottom: 30 },
        xAxis: { type: 'category', data: labels },
        yAxis: [{ type: 'value', max: 100, splitLine: { lineStyle: { type: 'dashed', color: '#E4E7ED' } } }],
        series: [
            { name: 'CPU 使用率', type: 'line', smooth: true, data: Array.from({ length: 12 }, (_, i) => 55 + Math.round(Math.sin(i / 2) * 22 + Math.random() * 10)), lineStyle: { color: '#DA251D', width: 3 }, itemStyle: { color: '#DA251D' }, symbolSize: 5 },
            { name: '内存使用率', type: 'line', smooth: true, data: Array.from({ length: 12 }, (_, i) => 60 + Math.round(Math.cos(i / 3) * 12 + Math.random() * 8)), lineStyle: { color: '#2B6CB0', width: 2 }, itemStyle: { color: '#2B6CB0' }, symbolSize: 5 },
            { name: '网络吞吐', type: 'line', smooth: true, data: Array.from({ length: 12 }, (_, i) => 40 + Math.round(Math.sin(i / 1.8) * 18 + Math.random() * 12)), lineStyle: { color: '#00A854', width: 2 }, itemStyle: { color: '#00A854' }, symbolSize: 5 },
        ],
    });
};
const openAlarmRule = () => {
    alarmVisible.value = true;
};
const saveAlarm = () => {
    alarmVisible.value = false;
    ElMessage.success('告警规则已保存（Mock）');
};
const showLog = (row) => {
    logTaskName.value = row.name;
    logVisible.value = true;
};
const handleResize = () => {
    resourceChart?.resize();
};
onMounted(() => {
    renderResourceChart();
    window.addEventListener('resize', handleResize);
});
onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize);
    resourceChart?.dispose();
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
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ref: "resourceChartRef",
    ...{ class: "chart-box" },
});
/** @type {typeof __VLS_ctx.resourceChartRef} */ ;
var __VLS_23;
var __VLS_19;
const __VLS_24 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    xs: (24),
    lg: (12),
}));
const __VLS_26 = __VLS_25({
    xs: (24),
    lg: (12),
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
    const __VLS_32 = {}.ElLink;
    /** @type {[typeof __VLS_components.ElLink, typeof __VLS_components.elLink, typeof __VLS_components.ElLink, typeof __VLS_components.elLink, ]} */ ;
    // @ts-ignore
    const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
        underline: (false),
        type: "danger",
    }));
    const __VLS_34 = __VLS_33({
        underline: (false),
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_33));
    __VLS_35.slots.default;
    var __VLS_35;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "bottleneck-list" },
});
for (const [node] of __VLS_getVForSourceType((__VLS_ctx.bottleneckNodes))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (node.name),
        ...{ class: "bottleneck-item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "bottleneck-name" },
    });
    (node.name);
    const __VLS_36 = {}.ElProgress;
    /** @type {[typeof __VLS_components.ElProgress, typeof __VLS_components.elProgress, ]} */ ;
    // @ts-ignore
    const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
        percentage: (node.usage),
        color: (node.usage > 85 ? '#E34D59' : node.usage > 70 ? '#ED7B2F' : '#00A854'),
        strokeWidth: (10),
        ...{ class: "bottleneck-progress" },
    }));
    const __VLS_38 = __VLS_37({
        percentage: (node.usage),
        color: (node.usage > 85 ? '#E34D59' : node.usage > 70 ? '#ED7B2F' : '#00A854'),
        strokeWidth: (10),
        ...{ class: "bottleneck-progress" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_37));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "bottleneck-desc" },
    });
    (node.note);
}
var __VLS_31;
var __VLS_27;
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
    span: (24),
}));
const __VLS_46 = __VLS_45({
    span: (24),
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
    const __VLS_52 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
        ...{ 'onClick': {} },
        type: "danger",
        size: "small",
    }));
    const __VLS_54 = __VLS_53({
        ...{ 'onClick': {} },
        type: "danger",
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_53));
    let __VLS_56;
    let __VLS_57;
    let __VLS_58;
    const __VLS_59 = {
        onClick: (__VLS_ctx.openAlarmRule)
    };
    __VLS_55.slots.default;
    var __VLS_55;
}
const __VLS_60 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
    data: (__VLS_ctx.runningDetails),
    stripe: true,
}));
const __VLS_62 = __VLS_61({
    data: (__VLS_ctx.runningDetails),
    stripe: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_61));
__VLS_63.slots.default;
const __VLS_64 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
    prop: "name",
    label: "任务名称",
    minWidth: "170",
}));
const __VLS_66 = __VLS_65({
    prop: "name",
    label: "任务名称",
    minWidth: "170",
}, ...__VLS_functionalComponentArgsRest(__VLS_65));
const __VLS_68 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
    label: "状态",
    width: "90",
}));
const __VLS_70 = __VLS_69({
    label: "状态",
    width: "90",
}, ...__VLS_functionalComponentArgsRest(__VLS_69));
__VLS_71.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_71.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_72 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
        type: (__VLS_ctx.statusTagType[row.status]),
        effect: "dark",
    }));
    const __VLS_74 = __VLS_73({
        type: (__VLS_ctx.statusTagType[row.status]),
        effect: "dark",
    }, ...__VLS_functionalComponentArgsRest(__VLS_73));
    __VLS_75.slots.default;
    (row.status);
    var __VLS_75;
}
var __VLS_71;
const __VLS_76 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
    label: "进度",
    minWidth: "140",
}));
const __VLS_78 = __VLS_77({
    label: "进度",
    minWidth: "140",
}, ...__VLS_functionalComponentArgsRest(__VLS_77));
__VLS_79.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_79.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_80 = {}.ElProgress;
    /** @type {[typeof __VLS_components.ElProgress, typeof __VLS_components.elProgress, ]} */ ;
    // @ts-ignore
    const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
        percentage: (row.progress),
        strokeWidth: (10),
    }));
    const __VLS_82 = __VLS_81({
        percentage: (row.progress),
        strokeWidth: (10),
    }, ...__VLS_functionalComponentArgsRest(__VLS_81));
}
var __VLS_79;
const __VLS_84 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
    prop: "dataCount",
    label: "处理数据量",
    width: "120",
}));
const __VLS_86 = __VLS_85({
    prop: "dataCount",
    label: "处理数据量",
    width: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_85));
const __VLS_88 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
    prop: "rate",
    label: "处理速率",
    width: "100",
}));
const __VLS_90 = __VLS_89({
    prop: "rate",
    label: "处理速率",
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_89));
const __VLS_92 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
    prop: "duration",
    label: "耗时",
    width: "90",
}));
const __VLS_94 = __VLS_93({
    prop: "duration",
    label: "耗时",
    width: "90",
}, ...__VLS_functionalComponentArgsRest(__VLS_93));
const __VLS_96 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
    label: "操作",
    width: "100",
}));
const __VLS_98 = __VLS_97({
    label: "操作",
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_97));
__VLS_99.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_99.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_100 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }));
    const __VLS_102 = __VLS_101({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_101));
    let __VLS_104;
    let __VLS_105;
    let __VLS_106;
    const __VLS_107 = {
        onClick: (...[$event]) => {
            __VLS_ctx.showLog(row);
        }
    };
    __VLS_103.slots.default;
    var __VLS_103;
}
var __VLS_99;
var __VLS_63;
var __VLS_51;
var __VLS_47;
var __VLS_43;
const __VLS_108 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
    modelValue: (__VLS_ctx.alarmVisible),
    title: "告警规则配置",
    width: "560px",
}));
const __VLS_110 = __VLS_109({
    modelValue: (__VLS_ctx.alarmVisible),
    title: "告警规则配置",
    width: "560px",
}, ...__VLS_functionalComponentArgsRest(__VLS_109));
__VLS_111.slots.default;
const __VLS_112 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
    model: (__VLS_ctx.alarmForm),
    labelWidth: "110px",
}));
const __VLS_114 = __VLS_113({
    model: (__VLS_ctx.alarmForm),
    labelWidth: "110px",
}, ...__VLS_functionalComponentArgsRest(__VLS_113));
__VLS_115.slots.default;
const __VLS_116 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
    label: "告警对象",
}));
const __VLS_118 = __VLS_117({
    label: "告警对象",
}, ...__VLS_functionalComponentArgsRest(__VLS_117));
__VLS_119.slots.default;
const __VLS_120 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({
    modelValue: (__VLS_ctx.alarmForm.target),
    ...{ class: "w-full" },
}));
const __VLS_122 = __VLS_121({
    modelValue: (__VLS_ctx.alarmForm.target),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_121));
__VLS_123.slots.default;
const __VLS_124 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({
    label: "全部任务",
    value: "全部任务",
}));
const __VLS_126 = __VLS_125({
    label: "全部任务",
    value: "全部任务",
}, ...__VLS_functionalComponentArgsRest(__VLS_125));
const __VLS_128 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({
    label: "批量任务",
    value: "批量任务",
}));
const __VLS_130 = __VLS_129({
    label: "批量任务",
    value: "批量任务",
}, ...__VLS_functionalComponentArgsRest(__VLS_129));
const __VLS_132 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132({
    label: "实时任务",
    value: "实时任务",
}));
const __VLS_134 = __VLS_133({
    label: "实时任务",
    value: "实时任务",
}, ...__VLS_functionalComponentArgsRest(__VLS_133));
const __VLS_136 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_137 = __VLS_asFunctionalComponent(__VLS_136, new __VLS_136({
    label: "流式任务",
    value: "流式任务",
}));
const __VLS_138 = __VLS_137({
    label: "流式任务",
    value: "流式任务",
}, ...__VLS_functionalComponentArgsRest(__VLS_137));
var __VLS_123;
var __VLS_119;
const __VLS_140 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_141 = __VLS_asFunctionalComponent(__VLS_140, new __VLS_140({
    label: "触发条件",
}));
const __VLS_142 = __VLS_141({
    label: "触发条件",
}, ...__VLS_functionalComponentArgsRest(__VLS_141));
__VLS_143.slots.default;
const __VLS_144 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_145 = __VLS_asFunctionalComponent(__VLS_144, new __VLS_144({
    modelValue: (__VLS_ctx.alarmForm.condition),
    ...{ class: "w-full" },
}));
const __VLS_146 = __VLS_145({
    modelValue: (__VLS_ctx.alarmForm.condition),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_145));
__VLS_147.slots.default;
const __VLS_148 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_149 = __VLS_asFunctionalComponent(__VLS_148, new __VLS_148({
    label: "任务失败",
    value: "任务失败",
}));
const __VLS_150 = __VLS_149({
    label: "任务失败",
    value: "任务失败",
}, ...__VLS_functionalComponentArgsRest(__VLS_149));
const __VLS_152 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_153 = __VLS_asFunctionalComponent(__VLS_152, new __VLS_152({
    label: "耗时超过阈值",
    value: "耗时超过阈值",
}));
const __VLS_154 = __VLS_153({
    label: "耗时超过阈值",
    value: "耗时超过阈值",
}, ...__VLS_functionalComponentArgsRest(__VLS_153));
const __VLS_156 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_157 = __VLS_asFunctionalComponent(__VLS_156, new __VLS_156({
    label: "数据量异常",
    value: "数据量异常",
}));
const __VLS_158 = __VLS_157({
    label: "数据量异常",
    value: "数据量异常",
}, ...__VLS_functionalComponentArgsRest(__VLS_157));
const __VLS_160 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_161 = __VLS_asFunctionalComponent(__VLS_160, new __VLS_160({
    label: "资源占用过高",
    value: "资源占用过高",
}));
const __VLS_162 = __VLS_161({
    label: "资源占用过高",
    value: "资源占用过高",
}, ...__VLS_functionalComponentArgsRest(__VLS_161));
var __VLS_147;
var __VLS_143;
const __VLS_164 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_165 = __VLS_asFunctionalComponent(__VLS_164, new __VLS_164({
    label: "通知方式",
}));
const __VLS_166 = __VLS_165({
    label: "通知方式",
}, ...__VLS_functionalComponentArgsRest(__VLS_165));
__VLS_167.slots.default;
const __VLS_168 = {}.ElCheckboxGroup;
/** @type {[typeof __VLS_components.ElCheckboxGroup, typeof __VLS_components.elCheckboxGroup, typeof __VLS_components.ElCheckboxGroup, typeof __VLS_components.elCheckboxGroup, ]} */ ;
// @ts-ignore
const __VLS_169 = __VLS_asFunctionalComponent(__VLS_168, new __VLS_168({
    modelValue: (__VLS_ctx.alarmForm.notify),
}));
const __VLS_170 = __VLS_169({
    modelValue: (__VLS_ctx.alarmForm.notify),
}, ...__VLS_functionalComponentArgsRest(__VLS_169));
__VLS_171.slots.default;
const __VLS_172 = {}.ElCheckbox;
/** @type {[typeof __VLS_components.ElCheckbox, typeof __VLS_components.elCheckbox, ]} */ ;
// @ts-ignore
const __VLS_173 = __VLS_asFunctionalComponent(__VLS_172, new __VLS_172({
    value: "站内",
}));
const __VLS_174 = __VLS_173({
    value: "站内",
}, ...__VLS_functionalComponentArgsRest(__VLS_173));
const __VLS_176 = {}.ElCheckbox;
/** @type {[typeof __VLS_components.ElCheckbox, typeof __VLS_components.elCheckbox, ]} */ ;
// @ts-ignore
const __VLS_177 = __VLS_asFunctionalComponent(__VLS_176, new __VLS_176({
    value: "邮件",
}));
const __VLS_178 = __VLS_177({
    value: "邮件",
}, ...__VLS_functionalComponentArgsRest(__VLS_177));
const __VLS_180 = {}.ElCheckbox;
/** @type {[typeof __VLS_components.ElCheckbox, typeof __VLS_components.elCheckbox, ]} */ ;
// @ts-ignore
const __VLS_181 = __VLS_asFunctionalComponent(__VLS_180, new __VLS_180({
    value: "短信",
}));
const __VLS_182 = __VLS_181({
    value: "短信",
}, ...__VLS_functionalComponentArgsRest(__VLS_181));
var __VLS_171;
var __VLS_167;
const __VLS_184 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_185 = __VLS_asFunctionalComponent(__VLS_184, new __VLS_184({
    label: "通知人",
}));
const __VLS_186 = __VLS_185({
    label: "通知人",
}, ...__VLS_functionalComponentArgsRest(__VLS_185));
__VLS_187.slots.default;
const __VLS_188 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_189 = __VLS_asFunctionalComponent(__VLS_188, new __VLS_188({
    modelValue: (__VLS_ctx.alarmForm.users),
    ...{ class: "w-full" },
    multiple: true,
}));
const __VLS_190 = __VLS_189({
    modelValue: (__VLS_ctx.alarmForm.users),
    ...{ class: "w-full" },
    multiple: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_189));
__VLS_191.slots.default;
for (const [user] of __VLS_getVForSourceType((['张三', '李四', '王五', '赵六']))) {
    const __VLS_192 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_193 = __VLS_asFunctionalComponent(__VLS_192, new __VLS_192({
        key: (user),
        label: (user),
        value: (user),
    }));
    const __VLS_194 = __VLS_193({
        key: (user),
        label: (user),
        value: (user),
    }, ...__VLS_functionalComponentArgsRest(__VLS_193));
}
var __VLS_191;
var __VLS_187;
var __VLS_115;
{
    const { footer: __VLS_thisSlot } = __VLS_111.slots;
    const __VLS_196 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_197 = __VLS_asFunctionalComponent(__VLS_196, new __VLS_196({
        ...{ 'onClick': {} },
    }));
    const __VLS_198 = __VLS_197({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_197));
    let __VLS_200;
    let __VLS_201;
    let __VLS_202;
    const __VLS_203 = {
        onClick: (...[$event]) => {
            __VLS_ctx.alarmVisible = false;
        }
    };
    __VLS_199.slots.default;
    var __VLS_199;
    const __VLS_204 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_205 = __VLS_asFunctionalComponent(__VLS_204, new __VLS_204({
        ...{ 'onClick': {} },
        type: "danger",
    }));
    const __VLS_206 = __VLS_205({
        ...{ 'onClick': {} },
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_205));
    let __VLS_208;
    let __VLS_209;
    let __VLS_210;
    const __VLS_211 = {
        onClick: (__VLS_ctx.saveAlarm)
    };
    __VLS_207.slots.default;
    var __VLS_207;
}
var __VLS_111;
const __VLS_212 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_213 = __VLS_asFunctionalComponent(__VLS_212, new __VLS_212({
    modelValue: (__VLS_ctx.logVisible),
    title: (`执行日志：${__VLS_ctx.logTaskName}`),
    width: "680px",
}));
const __VLS_214 = __VLS_213({
    modelValue: (__VLS_ctx.logVisible),
    title: (`执行日志：${__VLS_ctx.logTaskName}`),
    width: "680px",
}, ...__VLS_functionalComponentArgsRest(__VLS_213));
__VLS_215.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.pre, __VLS_intrinsicElements.pre)({
    ...{ class: "ddl-block" },
});
(__VLS_ctx.logContent);
var __VLS_215;
/** @type {__VLS_StyleScopedClasses['standard-page']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-title']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-value']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-subtitle']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-box']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['bottleneck-list']} */ ;
/** @type {__VLS_StyleScopedClasses['bottleneck-item']} */ ;
/** @type {__VLS_StyleScopedClasses['bottleneck-name']} */ ;
/** @type {__VLS_StyleScopedClasses['bottleneck-progress']} */ ;
/** @type {__VLS_StyleScopedClasses['bottleneck-desc']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['ddl-block']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            metrics: metrics,
            statusTagType: statusTagType,
            resourceChartRef: resourceChartRef,
            alarmVisible: alarmVisible,
            logVisible: logVisible,
            logTaskName: logTaskName,
            bottleneckNodes: bottleneckNodes,
            runningDetails: runningDetails,
            alarmForm: alarmForm,
            logContent: logContent,
            openAlarmRule: openAlarmRule,
            saveAlarm: saveAlarm,
            showLog: showLog,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
