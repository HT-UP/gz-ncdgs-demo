import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import * as echarts from 'echarts';
import { MagicStick, Search } from '@element-plus/icons-vue';
const keyword = ref('');
const filterLevel = ref('');
const currentPage = ref(1);
const pageSize = ref(20);
const systemChartRef = ref();
const domainChartRef = ref();
let systemChart = null;
let domainChart = null;
const metrics = [
    { label: '总体落标率', value: '86.4%', trend: '+2.3% 较上月', hint: '标准覆盖 220 条' },
    { label: '已完全落标标准', value: '148', trend: '+12 条 较上月', hint: '目标 160 条' },
    { label: '部分落标标准', value: '52', trend: '-6 条 较上月', hint: '待整改 12 条' },
    { label: '未落标标准', value: '20', trend: '-5 条 较上月', hint: '重点跟进中' },
];
const items = [
    { code: 'BZ-0001', name: '客户信息代码', system: '票务系统', domain: '客运管理', owner: '张三', rate: 0, level: '完全未落标', reason: '源系统字段结构与标准不一致，需字段级映射改造' },
    { code: 'BZ-0007', name: '线路编码标准', system: '线网管理系统', domain: '建设管理', owner: '李四', rate: 0, level: '完全未落标', reason: '系统使用历史编码体系，与标准编码规则不兼容' },
    { code: 'BZ-0013', name: '车站类型代码', system: '票务系统', domain: '客运管理', owner: '王五', rate: 35, level: '部分落标', reason: '仅覆盖 A 型车站，B/C 型车站尚未映射' },
    { code: 'BZ-0026', name: '设备状态代码', system: '设备管理系统', domain: '设备设施', owner: '赵六', rate: 0, level: '完全未落标', reason: '设备状态枚举值含自定义扩展，需数据清洗' },
    { code: 'BZ-0031', name: '工单类型标准', system: '运维工单系统', domain: '运营服务', owner: '孙七', rate: 60, level: '部分落标', reason: '存量数据部分分类未按新标准归并' },
    { code: 'BZ-0042', name: '安全事件等级', system: '应急管理系统', domain: '安全应急', owner: '张三', rate: 0, level: '完全未落标', reason: '系统上线时间早于标准发布时间，未纳入改造计划' },
    { code: 'BZ-0058', name: '资产分类代码', system: '资产管理系统', domain: '财务资产', owner: '李四', rate: 45, level: '部分落标', reason: '一级分类已映射，二级分类存在差异' },
    { code: 'BZ-0069', name: '信号设备代码', system: '信号控制系统', domain: '设备设施', owner: '王五', rate: 0, level: '完全未落标', reason: '现场控制设备编码为独立体系，等待专项改造' },
];
const filteredItems = computed(() => items.filter((item) => {
    if (filterLevel.value && item.level !== filterLevel.value)
        return false;
    if (!keyword.value)
        return true;
    const kw = keyword.value.toLowerCase();
    return (item.name.toLowerCase().includes(kw) ||
        item.code.toLowerCase().includes(kw) ||
        item.owner.toLowerCase().includes(kw));
}));
const pagedItems = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    return filteredItems.value.slice(start, start + pageSize.value);
});
const renderSystemChart = () => {
    if (!systemChartRef.value)
        return;
    systemChart?.dispose();
    systemChart = echarts.init(systemChartRef.value);
    systemChart.setOption({
        tooltip: { trigger: 'axis' },
        grid: { left: 40, right: 20, top: 30, bottom: 40 },
        xAxis: {
            type: 'category',
            data: ['票务系统', '设备管理', '运维工单', '线网管理', '应急管理', '资产系统'],
            axisLabel: { interval: 0, rotate: 20 },
        },
        yAxis: { type: 'value', max: 100, splitLine: { lineStyle: { type: 'dashed', color: '#E4E7ED' } } },
        series: [
            {
                name: '落标率(%)',
                type: 'bar',
                data: [78, 52, 66, 43, 38, 71],
                itemStyle: { color: '#DA251D', borderRadius: [4, 4, 0, 0] },
                label: { show: true, position: 'top', formatter: '{c}%' },
            },
        ],
    });
};
const renderDomainChart = () => {
    if (!domainChartRef.value)
        return;
    domainChart?.dispose();
    domainChart = echarts.init(domainChartRef.value);
    domainChart.setOption({
        tooltip: { trigger: 'axis' },
        grid: { left: 40, right: 20, top: 30, bottom: 40 },
        xAxis: {
            type: 'category',
            data: ['客运管理', '建设管理', '设备设施', '运营服务', '安全应急', '财务资产'],
            axisLabel: { interval: 0, rotate: 20 },
        },
        yAxis: { type: 'value', max: 100, splitLine: { lineStyle: { type: 'dashed', color: '#E4E7ED' } } },
        series: [
            {
                name: '落标率(%)',
                type: 'bar',
                data: [81, 64, 58, 72, 49, 77],
                itemStyle: { color: '#2B6CB0', borderRadius: [4, 4, 0, 0] },
                label: { show: true, position: 'top', formatter: '{c}%' },
            },
        ],
    });
};
const generateReport = () => {
    ElMessage.success('已生成「标准评估与优化报告」（Mock）');
};
const generateSuggestions = () => {
    ElMessage.success('已生成 8 条落标整改建议（Mock）');
};
const handleResize = () => {
    systemChart?.resize();
    domainChart?.resize();
};
onMounted(() => {
    renderSystemChart();
    renderDomainChart();
    window.addEventListener('resize', handleResize);
});
onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize);
    systemChart?.dispose();
    domainChart?.dispose();
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
        sm: (12),
        lg: (6),
        key: (metric.label),
    }));
    const __VLS_6 = __VLS_5({
        xs: (24),
        sm: (12),
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
        ...{ class: (metric.trend.startsWith('-') ? 'trend-negative' : 'trend-positive') },
    });
    (metric.trend);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "trend-hint" },
    });
    (metric.hint);
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
    ref: "systemChartRef",
    ...{ class: "chart-box chart-box--compact" },
});
/** @type {typeof __VLS_ctx.systemChartRef} */ ;
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
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ref: "domainChartRef",
    ...{ class: "chart-box chart-box--compact" },
});
/** @type {typeof __VLS_ctx.domainChartRef} */ ;
var __VLS_31;
var __VLS_27;
var __VLS_15;
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
    span: (24),
}));
const __VLS_38 = __VLS_37({
    span: (24),
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
    const __VLS_44 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
        ...{ 'onClick': {} },
        type: "danger",
        size: "small",
    }));
    const __VLS_46 = __VLS_45({
        ...{ 'onClick': {} },
        type: "danger",
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_45));
    let __VLS_48;
    let __VLS_49;
    let __VLS_50;
    const __VLS_51 = {
        onClick: (__VLS_ctx.generateReport)
    };
    __VLS_47.slots.default;
    var __VLS_47;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "toolbar-row" },
});
const __VLS_52 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
    modelValue: (__VLS_ctx.keyword),
    placeholder: "按名称 / 编码 / 责任人搜索",
    clearable: true,
    ...{ class: "search-input" },
    prefixIcon: (__VLS_ctx.Search),
}));
const __VLS_54 = __VLS_53({
    modelValue: (__VLS_ctx.keyword),
    placeholder: "按名称 / 编码 / 责任人搜索",
    clearable: true,
    ...{ class: "search-input" },
    prefixIcon: (__VLS_ctx.Search),
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
const __VLS_56 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
    modelValue: (__VLS_ctx.filterLevel),
    placeholder: "未落标程度",
    clearable: true,
    ...{ class: "filter-select" },
}));
const __VLS_58 = __VLS_57({
    modelValue: (__VLS_ctx.filterLevel),
    placeholder: "未落标程度",
    clearable: true,
    ...{ class: "filter-select" },
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
__VLS_59.slots.default;
const __VLS_60 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
    label: "完全未落标",
    value: "完全未落标",
}));
const __VLS_62 = __VLS_61({
    label: "完全未落标",
    value: "完全未落标",
}, ...__VLS_functionalComponentArgsRest(__VLS_61));
const __VLS_64 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
    label: "部分落标",
    value: "部分落标",
}));
const __VLS_66 = __VLS_65({
    label: "部分落标",
    value: "部分落标",
}, ...__VLS_functionalComponentArgsRest(__VLS_65));
var __VLS_59;
const __VLS_68 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
    ...{ 'onClick': {} },
    icon: (__VLS_ctx.MagicStick),
    type: "danger",
    plain: true,
}));
const __VLS_70 = __VLS_69({
    ...{ 'onClick': {} },
    icon: (__VLS_ctx.MagicStick),
    type: "danger",
    plain: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_69));
let __VLS_72;
let __VLS_73;
let __VLS_74;
const __VLS_75 = {
    onClick: (__VLS_ctx.generateSuggestions)
};
__VLS_71.slots.default;
var __VLS_71;
const __VLS_76 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
    data: (__VLS_ctx.pagedItems),
    stripe: true,
    ...{ class: "mt-12" },
}));
const __VLS_78 = __VLS_77({
    data: (__VLS_ctx.pagedItems),
    stripe: true,
    ...{ class: "mt-12" },
}, ...__VLS_functionalComponentArgsRest(__VLS_77));
__VLS_79.slots.default;
const __VLS_80 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
    prop: "code",
    label: "标准编码",
    width: "110",
}));
const __VLS_82 = __VLS_81({
    prop: "code",
    label: "标准编码",
    width: "110",
}, ...__VLS_functionalComponentArgsRest(__VLS_81));
const __VLS_84 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
    prop: "name",
    label: "标准名称",
    minWidth: "180",
}));
const __VLS_86 = __VLS_85({
    prop: "name",
    label: "标准名称",
    minWidth: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_85));
const __VLS_88 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
    prop: "system",
    label: "目标系统",
    width: "140",
}));
const __VLS_90 = __VLS_89({
    prop: "system",
    label: "目标系统",
    width: "140",
}, ...__VLS_functionalComponentArgsRest(__VLS_89));
const __VLS_92 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
    prop: "domain",
    label: "业务域",
    width: "110",
}));
const __VLS_94 = __VLS_93({
    prop: "domain",
    label: "业务域",
    width: "110",
}, ...__VLS_functionalComponentArgsRest(__VLS_93));
const __VLS_96 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
    prop: "owner",
    label: "责任人",
    width: "90",
}));
const __VLS_98 = __VLS_97({
    prop: "owner",
    label: "责任人",
    width: "90",
}, ...__VLS_functionalComponentArgsRest(__VLS_97));
const __VLS_100 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
    label: "落标情况",
    width: "110",
}));
const __VLS_102 = __VLS_101({
    label: "落标情况",
    width: "110",
}, ...__VLS_functionalComponentArgsRest(__VLS_101));
__VLS_103.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_103.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_104 = {}.ElProgress;
    /** @type {[typeof __VLS_components.ElProgress, typeof __VLS_components.elProgress, ]} */ ;
    // @ts-ignore
    const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
        percentage: (row.rate),
        color: (row.rate < 50 ? '#E34D59' : '#ED7B2F'),
        strokeWidth: (10),
    }));
    const __VLS_106 = __VLS_105({
        percentage: (row.rate),
        color: (row.rate < 50 ? '#E34D59' : '#ED7B2F'),
        strokeWidth: (10),
    }, ...__VLS_functionalComponentArgsRest(__VLS_105));
}
var __VLS_103;
const __VLS_108 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
    label: "未落标程度",
    width: "110",
}));
const __VLS_110 = __VLS_109({
    label: "未落标程度",
    width: "110",
}, ...__VLS_functionalComponentArgsRest(__VLS_109));
__VLS_111.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_111.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_112 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
        type: (row.level === '完全未落标' ? 'danger' : 'warning'),
        effect: "dark",
    }));
    const __VLS_114 = __VLS_113({
        type: (row.level === '完全未落标' ? 'danger' : 'warning'),
        effect: "dark",
    }, ...__VLS_functionalComponentArgsRest(__VLS_113));
    __VLS_115.slots.default;
    (row.level);
    var __VLS_115;
}
var __VLS_111;
const __VLS_116 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
    prop: "reason",
    label: "原因分析",
    minWidth: "200",
    showOverflowTooltip: true,
}));
const __VLS_118 = __VLS_117({
    prop: "reason",
    label: "原因分析",
    minWidth: "200",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_117));
var __VLS_79;
const __VLS_120 = {}.ElPagination;
/** @type {[typeof __VLS_components.ElPagination, typeof __VLS_components.elPagination, ]} */ ;
// @ts-ignore
const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({
    ...{ 'onCurrentChange': {} },
    ...{ class: "pager" },
    layout: "total, prev, pager, next",
    total: (__VLS_ctx.filteredItems.length),
    pageSize: (__VLS_ctx.pageSize),
    currentPage: (__VLS_ctx.currentPage),
    background: true,
}));
const __VLS_122 = __VLS_121({
    ...{ 'onCurrentChange': {} },
    ...{ class: "pager" },
    layout: "total, prev, pager, next",
    total: (__VLS_ctx.filteredItems.length),
    pageSize: (__VLS_ctx.pageSize),
    currentPage: (__VLS_ctx.currentPage),
    background: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_121));
let __VLS_124;
let __VLS_125;
let __VLS_126;
const __VLS_127 = {
    onCurrentChange: (...[$event]) => {
        __VLS_ctx.currentPage = $event;
    }
};
var __VLS_123;
var __VLS_43;
var __VLS_39;
var __VLS_35;
/** @type {__VLS_StyleScopedClasses['standard-page']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-title']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-value']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-subtitle']} */ ;
/** @type {__VLS_StyleScopedClasses['trend-hint']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-box']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-box--compact']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-box']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-box--compact']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['toolbar-row']} */ ;
/** @type {__VLS_StyleScopedClasses['search-input']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-select']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-12']} */ ;
/** @type {__VLS_StyleScopedClasses['pager']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            MagicStick: MagicStick,
            Search: Search,
            keyword: keyword,
            filterLevel: filterLevel,
            currentPage: currentPage,
            pageSize: pageSize,
            systemChartRef: systemChartRef,
            domainChartRef: domainChartRef,
            metrics: metrics,
            filteredItems: filteredItems,
            pagedItems: pagedItems,
            generateReport: generateReport,
            generateSuggestions: generateSuggestions,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
