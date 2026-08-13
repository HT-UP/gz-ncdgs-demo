import { onBeforeUnmount, onMounted, ref } from 'vue';
import { Bell } from '@element-plus/icons-vue';
import * as echarts from 'echarts';
const alertColor = { 严重: '#da251d', 警告: '#ed7b2f', 提示: '#2b6cb0' };
const alertColorName = { 严重: '严重', 警告: '警告', 提示: '提示' };
const alertTag = { 严重: 'danger', 警告: 'warning', 提示: 'info' };
const alerts = [
    { seq: 1, level: '严重', text: '质量评分连续 3 日低于阈值 88，触发「质量看板」预警', time: '10:32' },
    { seq: 2, level: '警告', text: 'ODS 增量采集延迟 512ms 超过阈值 500ms', time: '10:12' },
    { seq: 3, level: '警告', text: '标准覆盖新增低于预期，实时滚动 30 日覆盖率临界 82%', time: '09:48' },
    { seq: 4, level: '提示', text: '智能分类分级待确认建议积压 15 条，请及时评审', time: '09:20' },
];
const kpis = [
    { label: '接入数据源', value: '156', note: '+12 本月', color: '#da251d', bg: 'linear-gradient(135deg,#da251d,#fff)' },
    { label: '注册数据资产', value: '1,280', note: '+86 本月', color: '#2b6cb0', bg: 'linear-gradient(135deg,#2b6cb0,#fff)' },
    { label: '数据标准', value: '234', note: '覆盖率 92%', color: '#00a854', bg: 'linear-gradient(135deg,#00a854,#fff)' },
    { label: '治理任务', value: '1,284', note: '成功率 97.5%', color: '#ed7b2f', bg: 'linear-gradient(135deg,#ed7b2f,#fff)' },
];
const sources = [
    { name: '票务运营库', type: 'MySQL', last: '10:30', ok: true },
    { name: '车票实名库', type: 'Oracle', last: '10:25', ok: true },
    { name: '客流事件流', type: 'Kafka', last: '10:31', ok: true },
    { name: '设备信号采集', type: 'MQTT', last: '10:00', ok: false },
    { name: '财务共享仓', type: 'Hive', last: '10:28', ok: true },
    { name: '运营日志仓', type: 'ClickHouse', last: '10:29', ok: false },
];
const zone = {
    quality: {
        score: 92.6,
        dims: [
            { name: '完整性', value: 96 },
            { name: '准确性', value: 94 },
            { name: '一致性', value: 91 },
            { name: '及时性', value: 89 },
        ],
    },
    standard: {
        rate: 92,
        items: [
            { name: '主数据标准', value: 95 },
            { name: '基础数据标准', value: 92 },
            { name: '指标口径标准', value: 88 },
            { name: '命名规范标准', value: 84 },
        ],
    },
    security: {
        risk: 6,
        items: [
            { name: '未处理高危风险', value: '2', badgeType: 'danger' },
            { name: '本月权限变更审计', value: '18', badgeType: 'info' },
            { name: '脱敏覆盖率', value: '96.4%', badgeType: 'success' },
        ],
    },
    agents: [
        { name: '元数据抽取智能体', runs: 128 },
        { name: '智能补全智能体', runs: 342 },
        { name: '智能分级分类', runs: 89 },
        { name: '知识检索问答', runs: 2156 },
        { name: '合规稽核智能体', runs: 46 },
        { name: '决策建议智能体', runs: 18 },
    ],
    ops: [
        { name: '日均任务执行', value: '486', color: '#da251d' },
        { name: '任务成功率', value: '97.5%', color: '#00a854' },
        { name: '平均同步延迟', value: '236ms', color: '#2b6cb0' },
        { name: '平均质量评分', value: '92.6', color: '#ed7b2f' },
    ],
};
const trendRef = ref();
let trendChart = null;
const renderTrend = () => {
    if (!trendRef.value)
        return;
    trendChart?.dispose();
    trendChart = echarts.init(trendRef.value);
    trendChart.setOption({
        tooltip: { trigger: 'axis' },
        legend: { data: ['数据资源', '数据标准', '质量评分'], top: 0 },
        grid: { left: 48, right: 16, top: 40, bottom: 28 },
        xAxis: {
            type: 'category',
            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月'],
            axisLine: { lineStyle: { color: '#e4e7ed' } },
        },
        yAxis: { type: 'value', splitLine: { lineStyle: { type: 'dashed', color: '#e4e7ed' } } },
        series: [
            {
                name: '数据资源',
                type: 'line',
                smooth: true,
                data: [820, 900, 980, 1040, 1120, 1180, 1240, 1280],
                lineStyle: { color: '#2b6cb0', width: 3 },
                itemStyle: { color: '#2b6cb0' },
                areaStyle: { color: 'rgba(43,108,176,.12)' },
            },
            {
                name: '数据标准',
                type: 'line',
                smooth: true,
                data: [160, 178, 192, 205, 218, 226, 232, 234],
                lineStyle: { color: '#00a854', width: 3 },
                itemStyle: { color: '#00a854' },
            },
            {
                name: '质量评分',
                type: 'line',
                smooth: true,
                data: [85, 86, 87, 88.5, 89.5, 90.8, 91.8, 92.6],
                lineStyle: { color: '#da251d', width: 3 },
                itemStyle: { color: '#da251d' },
            },
        ],
    });
};
onMounted(renderTrend);
const handleResize = () => trendChart?.resize();
onMounted(() => window.addEventListener('resize', handleResize));
onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize);
    trendChart?.dispose();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "standard-page cockpit-page" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "cockpit-alerts" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "alert-title" },
});
const __VLS_0 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({}));
const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
const __VLS_4 = {}.Bell;
/** @type {[typeof __VLS_components.Bell, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({}));
const __VLS_6 = __VLS_5({}, ...__VLS_functionalComponentArgsRest(__VLS_5));
var __VLS_3;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "alert-list" },
});
for (const [a] of __VLS_getVForSourceType((__VLS_ctx.alerts))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (a.seq),
        ...{ class: "alert-item" },
        ...{ style: ({ borderColor: __VLS_ctx.alertColor[a.level] }) },
    });
    const __VLS_8 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
        size: "small",
        type: (__VLS_ctx.alertTag[a.level]),
        effect: "dark",
    }));
    const __VLS_10 = __VLS_9({
        size: "small",
        type: (__VLS_ctx.alertTag[a.level]),
        effect: "dark",
    }, ...__VLS_functionalComponentArgsRest(__VLS_9));
    __VLS_11.slots.default;
    (__VLS_ctx.alertColorName[a.level]);
    var __VLS_11;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "alert-text" },
    });
    (a.text);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "alert-time" },
    });
    (a.time);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "cockpit-kpi" },
});
for (const [k] of __VLS_getVForSourceType((__VLS_ctx.kpis))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (k.label),
        ...{ class: "kpi-card" },
        ...{ style: ({ background: k.bg }) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "kpi-value" },
        ...{ style: ({ color: k.color }) },
    });
    (k.value);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "kpi-label" },
    });
    (k.label);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "kpi-note" },
    });
    (k.note);
}
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
    lg: (14),
}));
const __VLS_18 = __VLS_17({
    xs: (24),
    lg: (14),
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
__VLS_19.slots.default;
const __VLS_20 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
    ...{ class: "panel-card" },
    shadow: "never",
}));
const __VLS_22 = __VLS_21({
    ...{ class: "panel-card" },
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
    ref: "trendRef",
    ...{ class: "chart-box" },
});
/** @type {typeof __VLS_ctx.trendRef} */ ;
var __VLS_23;
var __VLS_19;
const __VLS_24 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    xs: (24),
    lg: (10),
}));
const __VLS_26 = __VLS_25({
    xs: (24),
    lg: (10),
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
    ...{ class: "ds-stats" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "ds-stat" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "ds-num" },
    ...{ style: {} },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "ds-label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "ds-stat" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "ds-num" },
    ...{ style: {} },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "ds-label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "ds-stat" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "ds-num" },
    ...{ style: {} },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "ds-label" },
});
const __VLS_32 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
    data: (__VLS_ctx.sources),
    size: "small",
    ...{ class: "mt-12" },
}));
const __VLS_34 = __VLS_33({
    data: (__VLS_ctx.sources),
    size: "small",
    ...{ class: "mt-12" },
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
__VLS_35.slots.default;
const __VLS_36 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    prop: "name",
    label: "数据源",
    minWidth: "120",
}));
const __VLS_38 = __VLS_37({
    prop: "name",
    label: "数据源",
    minWidth: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
const __VLS_40 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
    prop: "type",
    label: "类型",
    width: "80",
}));
const __VLS_42 = __VLS_41({
    prop: "type",
    label: "类型",
    width: "80",
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
const __VLS_44 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    label: "最近采集",
    width: "90",
}));
const __VLS_46 = __VLS_45({
    label: "最近采集",
    width: "90",
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
__VLS_47.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_47.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "dep-text" },
    });
    (row.last);
}
var __VLS_47;
const __VLS_48 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
    label: "状态",
    width: "80",
}));
const __VLS_50 = __VLS_49({
    label: "状态",
    width: "80",
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
__VLS_51.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_51.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_52 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
        size: "small",
        type: (row.ok ? 'success' : 'warning'),
        effect: "dark",
    }));
    const __VLS_54 = __VLS_53({
        size: "small",
        type: (row.ok ? 'success' : 'warning'),
        effect: "dark",
    }, ...__VLS_functionalComponentArgsRest(__VLS_53));
    __VLS_55.slots.default;
    (row.ok ? '正常' : '延迟');
    var __VLS_55;
}
var __VLS_51;
var __VLS_35;
var __VLS_31;
var __VLS_27;
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
    ...{ class: "panel-card zone-card" },
    shadow: "never",
}));
const __VLS_66 = __VLS_65({
    ...{ class: "panel-card zone-card" },
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
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "zone-score" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "zone-score-num" },
});
(__VLS_ctx.zone.quality.score);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "zone-score-label" },
});
for (const [d] of __VLS_getVForSourceType((__VLS_ctx.zone.quality.dims))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (d.name),
        ...{ class: "zone-row" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "zone-row-label" },
    });
    (d.name);
    const __VLS_68 = {}.ElProgress;
    /** @type {[typeof __VLS_components.ElProgress, typeof __VLS_components.elProgress, ]} */ ;
    // @ts-ignore
    const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
        percentage: (d.value),
        strokeWidth: (10),
        color: (d.value >= 90 ? '#00A854' : d.value >= 80 ? '#2B6CB0' : '#da251d'),
        ...{ class: "zone-row-bar" },
    }));
    const __VLS_70 = __VLS_69({
        percentage: (d.value),
        strokeWidth: (10),
        color: (d.value >= 90 ? '#00A854' : d.value >= 80 ? '#2B6CB0' : '#da251d'),
        ...{ class: "zone-row-bar" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_69));
}
var __VLS_67;
var __VLS_63;
const __VLS_72 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
    xs: (24),
    lg: (8),
}));
const __VLS_74 = __VLS_73({
    xs: (24),
    lg: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_73));
__VLS_75.slots.default;
const __VLS_76 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
    ...{ class: "panel-card zone-card" },
    shadow: "never",
}));
const __VLS_78 = __VLS_77({
    ...{ class: "panel-card zone-card" },
    shadow: "never",
}, ...__VLS_functionalComponentArgsRest(__VLS_77));
__VLS_79.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_79.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "zone-score" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "zone-score-num" },
    ...{ style: {} },
});
(__VLS_ctx.zone.standard.rate);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "zone-score-label" },
});
for (const [s] of __VLS_getVForSourceType((__VLS_ctx.zone.standard.items))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (s.name),
        ...{ class: "zone-row" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "zone-row-label" },
    });
    (s.name);
    const __VLS_80 = {}.ElProgress;
    /** @type {[typeof __VLS_components.ElProgress, typeof __VLS_components.elProgress, ]} */ ;
    // @ts-ignore
    const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
        percentage: (s.value),
        strokeWidth: (10),
        color: "#2b6cb0",
        ...{ class: "zone-row-bar" },
    }));
    const __VLS_82 = __VLS_81({
        percentage: (s.value),
        strokeWidth: (10),
        color: "#2b6cb0",
        ...{ class: "zone-row-bar" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_81));
}
var __VLS_79;
var __VLS_75;
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
    ...{ class: "panel-card zone-card" },
    shadow: "never",
}));
const __VLS_90 = __VLS_89({
    ...{ class: "panel-card zone-card" },
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
    ...{ class: "zone-score" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "zone-score-num" },
    ...{ style: {} },
});
(__VLS_ctx.zone.security.risk);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "zone-score-label" },
});
for (const [s] of __VLS_getVForSourceType((__VLS_ctx.zone.security.items))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (s.name),
        ...{ class: "zone-row" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "zone-row-label" },
    });
    (s.name);
    const __VLS_92 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
        size: "small",
        type: (s.badgeType),
        effect: "dark",
    }));
    const __VLS_94 = __VLS_93({
        size: "small",
        type: (s.badgeType),
        effect: "dark",
    }, ...__VLS_functionalComponentArgsRest(__VLS_93));
    __VLS_95.slots.default;
    (s.value);
    var __VLS_95;
}
var __VLS_91;
var __VLS_87;
var __VLS_59;
const __VLS_96 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
// @ts-ignore
const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
    gutter: (16),
}));
const __VLS_98 = __VLS_97({
    gutter: (16),
}, ...__VLS_functionalComponentArgsRest(__VLS_97));
__VLS_99.slots.default;
const __VLS_100 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
    xs: (24),
    lg: (12),
}));
const __VLS_102 = __VLS_101({
    xs: (24),
    lg: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_101));
__VLS_103.slots.default;
const __VLS_104 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
    ...{ class: "panel-card zone-card" },
    shadow: "never",
}));
const __VLS_106 = __VLS_105({
    ...{ class: "panel-card zone-card" },
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
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "agent-grid" },
});
for (const [a] of __VLS_getVForSourceType((__VLS_ctx.zone.agents))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (a.name),
        ...{ class: "agent-item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "agent-name" },
    });
    (a.name);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "agent-run dep-text" },
    });
    (a.runs);
    const __VLS_108 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
        size: "small",
        type: "success",
        effect: "plain",
    }));
    const __VLS_110 = __VLS_109({
        size: "small",
        type: "success",
        effect: "plain",
    }, ...__VLS_functionalComponentArgsRest(__VLS_109));
    __VLS_111.slots.default;
    var __VLS_111;
}
var __VLS_107;
var __VLS_103;
const __VLS_112 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
    xs: (24),
    lg: (12),
}));
const __VLS_114 = __VLS_113({
    xs: (24),
    lg: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_113));
__VLS_115.slots.default;
const __VLS_116 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
    ...{ class: "panel-card zone-card" },
    shadow: "never",
}));
const __VLS_118 = __VLS_117({
    ...{ class: "panel-card zone-card" },
    shadow: "never",
}, ...__VLS_functionalComponentArgsRest(__VLS_117));
__VLS_119.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_119.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "ops-grid" },
});
for (const [o] of __VLS_getVForSourceType((__VLS_ctx.zone.ops))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (o.name),
        ...{ class: "ops-item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "ops-num" },
        ...{ style: ({ color: o.color }) },
    });
    (o.value);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "ops-name" },
    });
    (o.name);
}
var __VLS_119;
var __VLS_115;
var __VLS_99;
/** @type {__VLS_StyleScopedClasses['standard-page']} */ ;
/** @type {__VLS_StyleScopedClasses['cockpit-page']} */ ;
/** @type {__VLS_StyleScopedClasses['cockpit-alerts']} */ ;
/** @type {__VLS_StyleScopedClasses['alert-title']} */ ;
/** @type {__VLS_StyleScopedClasses['alert-list']} */ ;
/** @type {__VLS_StyleScopedClasses['alert-item']} */ ;
/** @type {__VLS_StyleScopedClasses['alert-text']} */ ;
/** @type {__VLS_StyleScopedClasses['alert-time']} */ ;
/** @type {__VLS_StyleScopedClasses['cockpit-kpi']} */ ;
/** @type {__VLS_StyleScopedClasses['kpi-card']} */ ;
/** @type {__VLS_StyleScopedClasses['kpi-value']} */ ;
/** @type {__VLS_StyleScopedClasses['kpi-label']} */ ;
/** @type {__VLS_StyleScopedClasses['kpi-note']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-box']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['ds-stats']} */ ;
/** @type {__VLS_StyleScopedClasses['ds-stat']} */ ;
/** @type {__VLS_StyleScopedClasses['ds-num']} */ ;
/** @type {__VLS_StyleScopedClasses['ds-label']} */ ;
/** @type {__VLS_StyleScopedClasses['ds-stat']} */ ;
/** @type {__VLS_StyleScopedClasses['ds-num']} */ ;
/** @type {__VLS_StyleScopedClasses['ds-label']} */ ;
/** @type {__VLS_StyleScopedClasses['ds-stat']} */ ;
/** @type {__VLS_StyleScopedClasses['ds-num']} */ ;
/** @type {__VLS_StyleScopedClasses['ds-label']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-12']} */ ;
/** @type {__VLS_StyleScopedClasses['dep-text']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['zone-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['zone-score']} */ ;
/** @type {__VLS_StyleScopedClasses['zone-score-num']} */ ;
/** @type {__VLS_StyleScopedClasses['zone-score-label']} */ ;
/** @type {__VLS_StyleScopedClasses['zone-row']} */ ;
/** @type {__VLS_StyleScopedClasses['zone-row-label']} */ ;
/** @type {__VLS_StyleScopedClasses['zone-row-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['zone-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['zone-score']} */ ;
/** @type {__VLS_StyleScopedClasses['zone-score-num']} */ ;
/** @type {__VLS_StyleScopedClasses['zone-score-label']} */ ;
/** @type {__VLS_StyleScopedClasses['zone-row']} */ ;
/** @type {__VLS_StyleScopedClasses['zone-row-label']} */ ;
/** @type {__VLS_StyleScopedClasses['zone-row-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['zone-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['zone-score']} */ ;
/** @type {__VLS_StyleScopedClasses['zone-score-num']} */ ;
/** @type {__VLS_StyleScopedClasses['zone-score-label']} */ ;
/** @type {__VLS_StyleScopedClasses['zone-row']} */ ;
/** @type {__VLS_StyleScopedClasses['zone-row-label']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['zone-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['agent-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['agent-item']} */ ;
/** @type {__VLS_StyleScopedClasses['agent-name']} */ ;
/** @type {__VLS_StyleScopedClasses['agent-run']} */ ;
/** @type {__VLS_StyleScopedClasses['dep-text']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['zone-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['ops-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['ops-item']} */ ;
/** @type {__VLS_StyleScopedClasses['ops-num']} */ ;
/** @type {__VLS_StyleScopedClasses['ops-name']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Bell: Bell,
            alertColor: alertColor,
            alertColorName: alertColorName,
            alertTag: alertTag,
            alerts: alerts,
            kpis: kpis,
            sources: sources,
            zone: zone,
            trendRef: trendRef,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
