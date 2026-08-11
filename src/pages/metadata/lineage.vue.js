import { onBeforeUnmount, onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import * as echarts from 'echarts';
import { Upload } from '@element-plus/icons-vue';
const lineageChartRef = ref();
const searchTable = ref('');
let lineageChart = null;
const lineageDetails = [
    { from: 'ticket_sale', via: 'ETL', to: 'report_flow' },
    { from: 'passenger_info', via: '存储过程', to: 'cust_dim' },
    { from: 'cust_dim', via: 'SQL', to: 'report_flow' },
    { from: 'station_info', via: 'SQL', to: 'station_dim' },
    { from: 'line_info', via: 'SQL', to: 'line_dim' },
    { from: 'station_dim', via: '存储过程', to: 'report_flow' },
];
const nodes = [
    { name: 'ticket_sale', category: 0 },
    { name: 'passenger_info', category: 0 },
    { name: 'station_info', category: 0 },
    { name: 'line_info', category: 0 },
    { name: 'cust_dim', category: 1 },
    { name: 'station_dim', category: 1 },
    { name: 'line_dim', category: 1 },
    { name: 'report_flow', category: 2 },
    { name: 'temp_data_01', category: 3 },
];
const links = [
    { source: 'ticket_sale', target: 'report_flow' },
    { source: 'passenger_info', target: 'cust_dim' },
    { source: 'cust_dim', target: 'report_flow' },
    { source: 'station_info', target: 'station_dim' },
    { source: 'line_info', target: 'line_dim' },
    { source: 'station_dim', target: 'report_flow' },
    { source: 'line_dim', target: 'station_dim' },
];
const renderLineage = (highlight) => {
    if (!lineageChartRef.value)
        return;
    lineageChart?.dispose();
    lineageChart = echarts.init(lineageChartRef.value);
    const graphNodes = nodes.map((node) => ({
        ...node,
        symbolSize: node.category === 2 ? 46 : node.category === 3 ? 34 : 38,
        itemStyle: highlight && node.name === highlight
            ? { color: '#DA251D', borderColor: '#DA251D', borderWidth: 3, shadowBlur: 16, shadowColor: 'rgba(218,37,29,0.5)' }
            : undefined,
    }));
    const graphLinks = links.map((link) => ({
        ...link,
        lineStyle: {
            color: highlight && (link.source === highlight || link.target === highlight) ? '#DA251D' : '#A9B4C4',
            width: highlight && (link.source === highlight || link.target === highlight) ? 3 : 1.5,
            curveness: 0.15,
        },
    }));
    lineageChart.setOption({
        tooltip: { formatter: (params) => (params.dataType === 'node' ? params.name : '') },
        legend: [
            {
                data: ['源系统表', '中间层表', '目标报表', '孤立表'],
                bottom: 8,
                textStyle: { fontSize: 12 },
            },
        ],
        series: [
            {
                type: 'graph',
                layout: 'force',
                roam: true,
                draggable: true,
                categories: [
                    { name: '源系统表', itemStyle: { color: '#2B6CB0' } },
                    { name: '中间层表', itemStyle: { color: '#00A854' } },
                    { name: '目标报表', itemStyle: { color: '#DA251D' } },
                    { name: '孤立表', itemStyle: { color: '#8C8C8C' } },
                ],
                data: graphNodes,
                links: graphLinks,
                label: { show: true, position: 'right', fontSize: 11, color: '#4a4a4a' },
                force: { repulsion: 320, edgeLength: [80, 150], gravity: 0.15 },
                emphasis: { focus: 'adjacency', lineStyle: { width: 4 } },
            },
        ],
    });
};
const highlightTable = () => {
    if (!searchTable.value.trim()) {
        ElMessage.warning('请输入要定位的表名');
        return;
    }
    renderLineage(searchTable.value.trim());
    ElMessage.success(`已定位到「${searchTable.value.trim()}」及其血缘链路`);
};
const uploadSql = () => {
    ElMessage.success('SQL 文件已解析，生成血缘关系 8 条（Mock）');
};
const handleResize = () => {
    lineageChart?.resize();
};
onMounted(() => {
    renderLineage();
    window.addEventListener('resize', handleResize);
});
onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize);
    lineageChart?.dispose();
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
const __VLS_4 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    xs: (24),
    lg: (17),
}));
const __VLS_6 = __VLS_5({
    xs: (24),
    lg: (17),
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
__VLS_7.slots.default;
const __VLS_8 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    ...{ class: "panel-card dashboard-card" },
    shadow: "never",
}));
const __VLS_10 = __VLS_9({
    ...{ class: "panel-card dashboard-card" },
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
    const __VLS_12 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
        modelValue: (__VLS_ctx.searchTable),
        placeholder: "搜索表名",
        clearable: true,
        size: "small",
        ...{ class: "search-input-sm" },
    }));
    const __VLS_14 = __VLS_13({
        modelValue: (__VLS_ctx.searchTable),
        placeholder: "搜索表名",
        clearable: true,
        size: "small",
        ...{ class: "search-input-sm" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_13));
    const __VLS_16 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
        ...{ 'onClick': {} },
        type: "danger",
        size: "small",
    }));
    const __VLS_18 = __VLS_17({
        ...{ 'onClick': {} },
        type: "danger",
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_17));
    let __VLS_20;
    let __VLS_21;
    let __VLS_22;
    const __VLS_23 = {
        onClick: (__VLS_ctx.highlightTable)
    };
    __VLS_19.slots.default;
    var __VLS_19;
    const __VLS_24 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
        ...{ 'onClick': {} },
        size: "small",
        icon: (__VLS_ctx.Upload),
    }));
    const __VLS_26 = __VLS_25({
        ...{ 'onClick': {} },
        size: "small",
        icon: (__VLS_ctx.Upload),
    }, ...__VLS_functionalComponentArgsRest(__VLS_25));
    let __VLS_28;
    let __VLS_29;
    let __VLS_30;
    const __VLS_31 = {
        onClick: (__VLS_ctx.uploadSql)
    };
    __VLS_27.slots.default;
    var __VLS_27;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ref: "lineageChartRef",
    ...{ class: "lineage-chart" },
});
/** @type {typeof __VLS_ctx.lineageChartRef} */ ;
var __VLS_11;
var __VLS_7;
const __VLS_32 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
    xs: (24),
    lg: (7),
}));
const __VLS_34 = __VLS_33({
    xs: (24),
    lg: (7),
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
const __VLS_40 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
    data: (__VLS_ctx.lineageDetails),
    size: "small",
    stripe: true,
}));
const __VLS_42 = __VLS_41({
    data: (__VLS_ctx.lineageDetails),
    size: "small",
    stripe: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
__VLS_43.slots.default;
const __VLS_44 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    prop: "from",
    label: "源表",
    minWidth: "110",
}));
const __VLS_46 = __VLS_45({
    prop: "from",
    label: "源表",
    minWidth: "110",
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
const __VLS_48 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
    prop: "via",
    label: "链路",
    width: "80",
}));
const __VLS_50 = __VLS_49({
    prop: "via",
    label: "链路",
    width: "80",
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
const __VLS_52 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
    prop: "to",
    label: "目标表",
    minWidth: "110",
}));
const __VLS_54 = __VLS_53({
    prop: "to",
    label: "目标表",
    minWidth: "110",
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
var __VLS_43;
var __VLS_39;
const __VLS_56 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
    ...{ class: "panel-card dashboard-card mt-16" },
    shadow: "never",
}));
const __VLS_58 = __VLS_57({
    ...{ class: "panel-card dashboard-card mt-16" },
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
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "anomaly-list" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "anomaly-item" },
});
const __VLS_60 = {}.ElTag;
/** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
    effect: "dark",
    type: "danger",
}));
const __VLS_62 = __VLS_61({
    effect: "dark",
    type: "danger",
}, ...__VLS_functionalComponentArgsRest(__VLS_61));
__VLS_63.slots.default;
var __VLS_63;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "anomaly-text" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "anomaly-item" },
});
const __VLS_64 = {}.ElTag;
/** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
// @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
    effect: "dark",
    type: "warning",
}));
const __VLS_66 = __VLS_65({
    effect: "dark",
    type: "warning",
}, ...__VLS_functionalComponentArgsRest(__VLS_65));
__VLS_67.slots.default;
var __VLS_67;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "anomaly-text" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "anomaly-item" },
});
const __VLS_68 = {}.ElTag;
/** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
// @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
    effect: "dark",
    type: "danger",
}));
const __VLS_70 = __VLS_69({
    effect: "dark",
    type: "danger",
}, ...__VLS_functionalComponentArgsRest(__VLS_69));
__VLS_71.slots.default;
var __VLS_71;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "anomaly-text" },
});
var __VLS_59;
var __VLS_35;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['standard-page']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['search-input-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['lineage-chart']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['anomaly-list']} */ ;
/** @type {__VLS_StyleScopedClasses['anomaly-item']} */ ;
/** @type {__VLS_StyleScopedClasses['anomaly-text']} */ ;
/** @type {__VLS_StyleScopedClasses['anomaly-item']} */ ;
/** @type {__VLS_StyleScopedClasses['anomaly-text']} */ ;
/** @type {__VLS_StyleScopedClasses['anomaly-item']} */ ;
/** @type {__VLS_StyleScopedClasses['anomaly-text']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Upload: Upload,
            lineageChartRef: lineageChartRef,
            searchTable: searchTable,
            lineageDetails: lineageDetails,
            highlightTable: highlightTable,
            uploadSql: uploadSql,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
