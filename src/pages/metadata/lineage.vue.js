import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
import * as echarts from 'echarts';
import { Upload } from '@element-plus/icons-vue';
const fieldLineage = [
    { source: 'ticket_sale.order_id', target: 'dwd_order_detail.order_id', func: '直接映射', flow: 128640 },
    { source: 'ticket_sale.order_date', target: 'dwd_order_detail.order_date', func: 'TO_DATE(order_date)', flow: 128640 },
    { source: 'ticket_sale.amount', target: 'dwd_order_detail.amount', func: 'NVL(amount, 0)', flow: 128640 },
    { source: 'ticket_sale.ticket_type', target: 'dwd_order_detail.ticket_type', func: 'TRIM(ticket_type)', flow: 128640 },
    { source: 'ticket_sale.line_code', target: 'dwd_order_detail.line_code', func: '直接映射', flow: 128640 },
    { source: 'passenger_info.passenger_id', target: 'dim_passenger.passenger_id', func: '直接映射', flow: 8620 },
    { source: 'passenger_info.passenger_name', target: 'dim_passenger.passenger_name', func: 'CONCAT(first_name, last_name)', flow: 8620 },
    { source: 'passenger_info.age', target: 'dim_passenger.age_group', func: 'CASE WHEN 年龄分箱', flow: 8620 },
    { source: 'station_info.station_code', target: 'dim_station.station_code', func: '直接映射', flow: 128 },
    { source: 'station_info.station_name', target: 'dim_station.station_name', func: '直接映射', flow: 128 },
    { source: 'line_info.line_code', target: 'dim_line.line_code', func: '直接映射', flow: 8 },
    { source: 'line_info.line_name', target: 'dim_line.line_name', func: '直接映射', flow: 8 },
    { source: 'dwd_order_detail.order_id', target: 'dws_order_report.order_id', func: '直接映射', flow: 128640 },
    { source: 'dwd_order_detail.amount', target: 'dws_order_report.total_amount', func: 'SUM(amount)', flow: 128640 },
    { source: 'dwd_order_detail.order_id', target: 'dws_order_report.order_count', func: 'COUNT(DISTINCT order_id)', flow: 128640 },
    { source: 'dim_line.line_code', target: 'dws_order_report.line_code', func: 'JOIN 映射', flow: 8 },
    { source: 'dim_line.line_name', target: 'dws_order_report.line_name', func: 'JOIN 映射', flow: 8 },
    { source: 'dim_passenger.passenger_id', target: 'ads_line_flow.total_passengers', func: 'COUNT(passenger_id)', flow: 8620 },
    { source: 'dim_passenger.age_group', target: 'ads_line_flow.avg_age', func: 'AVG(age)', flow: 8620 },
    { source: 'dim_line.line_code', target: 'ads_line_flow.line_code', func: 'JOIN 映射', flow: 8 },
    { source: 'dim_line.line_name', target: 'ads_line_flow.line_name', func: 'JOIN 映射', flow: 8 },
    { source: 'dim_station.station_code', target: 'ads_line_flow.station_code', func: 'JOIN 映射', flow: 128 },
    { source: 'dim_station.station_name', target: 'ads_line_flow.station_name', func: 'JOIN 映射', flow: 128 },
];
const tableMeta = {
    ticket_sale: { label: '售票明细表', layer: 'source' },
    passenger_info: { label: '乘客信息表', layer: 'source' },
    station_info: { label: '车站信息表', layer: 'source' },
    line_info: { label: '线路信息表', layer: 'source' },
    dwd_order_detail: { label: '订单明细层', layer: 'mid' },
    dim_passenger: { label: '乘客维度表', layer: 'mid' },
    dim_station: { label: '车站维度表', layer: 'mid' },
    dim_line: { label: '线路维度表', layer: 'mid' },
    dws_order_report: { label: '订单汇总报表', layer: 'target' },
    ads_line_flow: { label: '线路客流报表', layer: 'target' },
};
const tableFields = {
    ticket_sale: ['order_id', 'order_date', 'line_code', 'amount', 'ticket_type', 'status', 'create_time'],
    passenger_info: ['passenger_id', 'passenger_name', 'age', 'phone', 'create_time'],
    station_info: ['station_code', 'station_name', 'station_type', 'status'],
    line_info: ['line_code', 'line_name', 'status'],
    dwd_order_detail: ['order_id', 'order_date', 'line_code', 'amount', 'ticket_type', 'create_time'],
    dim_passenger: ['passenger_id', 'passenger_name', 'age_group', 'create_time'],
    dim_station: ['station_code', 'station_name'],
    dim_line: ['line_code', 'line_name'],
    dws_order_report: ['order_id', 'order_date', 'line_code', 'line_name', 'total_amount', 'order_count', 'ticket_type', 'create_time'],
    ads_line_flow: ['line_code', 'line_name', 'station_code', 'station_name', 'total_passengers', 'avg_age', 'flow_date', 'update_time'],
};
const pkFields = new Set([
    'ticket_sale.order_id',
    'passenger_info.passenger_id',
    'station_info.station_code',
    'line_info.line_code',
    'dwd_order_detail.order_id',
    'dim_passenger.passenger_id',
    'dim_station.station_code',
    'dim_line.line_code',
    'dws_order_report.order_id',
]);
const layerTables = {
    source: ['ticket_sale', 'passenger_info', 'station_info', 'line_info'],
    mid: ['dwd_order_detail', 'dim_passenger', 'dim_station', 'dim_line'],
    target: ['dws_order_report', 'ads_line_flow'],
};
const layerColor = {
    source: '#2B6CB0',
    mid: '#00A854',
    target: '#DA251D',
};
const layerName = {
    source: '源系统表',
    mid: '中间层表',
    target: '汇总报表层',
};
const legendItems = [
    { label: '源系统表', color: '#2B6CB0' },
    { label: '中间层表（ODS/DWD/DIM）', color: '#00A854' },
    { label: '汇总报表层', color: '#DA251D' },
];
const anomalies = [
    { type: '断裂', level: 'danger', text: 'station_info.station_type 无下游字段，缺少类型转换规则（Mock）' },
    { type: '循环', level: 'warning', text: 'dim_order.order_id ↔ dws_order_report 疑似循环引用，已自动阻断（Mock）' },
    { type: '孤立', level: 'danger', text: 'temp_ticket_sale.temp_field 无上游且无下游，未纳入解析（Mock）' },
    { type: '冲突', level: 'warning', text: 'dws_order_report.total_amount 存在多口径上游，请确认统计口径（Mock）' },
    { type: '告警', level: 'info', text: 'ticket_sale.amount 使用 NVL 隐式转换，建议显式 CAST（Mock）' },
];
const anomalyStats = [
    { label: '断裂', value: 1, color: '#DA251D' },
    { label: '循环', value: 1, color: '#ED7B2F' },
    { label: '孤立', value: 1, color: '#DA251D' },
    { label: '冲突', value: 1, color: '#ED7B2F' },
    { label: '告警', value: 1, color: '#2B6CB0' },
];
const formatFlow = (value) => (value >= 10000 ? `${(value / 10000).toFixed(1)} 万` : `${value}`);
const lineageChartRef = ref();
const searchTable = ref('');
const detailFilter = ref('');
const activeTab = ref('visual');
let lineageChart = null;
const targetTables = computed(() => [...new Set(fieldLineage.map((link) => link.target.split('.')[0]))]);
const filteredDetails = computed(() => detailFilter.value
    ? fieldLineage.map((link) => ({ ...link, flowText: formatFlow(link.flow) })).filter((link) => link.target.startsWith(`${detailFilter.value}.`))
    : fieldLineage.map((link) => ({ ...link, flowText: formatFlow(link.flow) })));
const cardWidthOf = (table) => {
    const maxLen = Math.max(...tableFields[table].map((f) => f.length + (pkFields.has(`${table}.${f}`) ? 4 : 0)));
    return Math.max(160, Math.min(260, maxLen * 7.5 + 34));
};
const cardHeightOf = (table) => tableFields[table].length * 20 + 48;
const renderLineage = (highlight) => {
    if (!lineageChartRef.value)
        return;
    lineageChart?.dispose();
    lineageChart = echarts.init(lineageChartRef.value);
    // 横向分层布局：源系统表 → 中间层 → 汇总报表
    const colMaxWidth = { source: 0, mid: 0, target: 0 };
    Object.keys(layerTables).forEach((layer) => {
        colMaxWidth[layer] = Math.max(...layerTables[layer].map(cardWidthOf));
    });
    const xs = { source: 20, mid: 0, target: 0 };
    const layerOrder = ['source', 'mid', 'target'];
    layerOrder.forEach((layer, i) => {
        if (i > 0)
            xs[layer] = xs[layerOrder[i - 1]] + colMaxWidth[layerOrder[i - 1]] + 200;
    });
    const ys = {};
    layerOrder.forEach((layer) => {
        let y = 20;
        layerTables[layer].forEach((table) => {
            ys[table] = y;
            y += cardHeightOf(table) + 46;
        });
    });
    const nodes = layerOrder.flatMap((layer) => layerTables[layer].map((table) => {
        const meta = tableMeta[table];
        const color = layerColor[meta.layer];
        const width = cardWidthOf(table);
        const matched = !!highlight && (table.includes(highlight) || tableFields[table].some((f) => f.includes(highlight)));
        return {
            name: table,
            x: xs[layer],
            y: ys[table],
            symbol: 'rect',
            symbolSize: [width, cardHeightOf(table)],
            tipHtml: `<b>${table}</b><br/>${meta.label}｜${layerName[meta.layer]}<br/>字段数：${tableFields[table].length}`,
            itemStyle: matched
                ? { color: '#fff', borderColor: '#DA251D', borderWidth: 2.5, borderRadius: 6, shadowBlur: 12, shadowColor: 'rgba(218,37,29,0.4)' }
                : { color: '#fff', borderColor: '#D3D8E0', borderWidth: 1.5, borderRadius: 6 },
            label: {
                show: true,
                position: 'inside',
                formatter: () => `{title|${table}}\n{fields|${tableFields[table]
                    .map((f) => (pkFields.has(`${table}.${f}`) ? `PK · ${f}` : f))
                    .join('\n')}}`,
                rich: {
                    title: {
                        width: width - 8,
                        height: 30,
                        backgroundColor: color,
                        color: '#fff',
                        fontSize: 13,
                        fontWeight: 700,
                        lineHeight: 30,
                        padding: [0, 10, 0, 10],
                        align: 'left',
                        verticalAlign: 'middle',
                        borderRadius: [6, 6, 0, 0],
                    },
                    fields: {
                        width: width - 8,
                        color: '#4A4A4A',
                        backgroundColor: '#FFFFFF',
                        fontSize: 12,
                        lineHeight: 20,
                        padding: [6, 10, 12, 10],
                        align: 'left',
                        verticalAlign: 'top',
                        borderRadius: [0, 0, 6, 6],
                    },
                },
            },
        };
    }));
    // 表级连线分组，一组字段映射渲染为多条微偏弧线
    const groupMap = new Map();
    fieldLineage.forEach((link) => {
        const fromTable = link.source.split('.')[0];
        const toTable = link.target.split('.')[0];
        const key = `${fromTable}>${toTable}`;
        if (!groupMap.has(key))
            groupMap.set(key, []);
        groupMap.get(key).push(link);
    });
    const links = [];
    groupMap.forEach((mappers, key) => {
        const [fromTable, toTable] = key.split('>');
        mappers.forEach((_m, i) => {
            const curveness = 0.48 + i * 0.07;
            const matched = !!highlight &&
                (fromTable.includes(highlight) ||
                    toTable.includes(highlight) ||
                    mappers.some((x) => x.source.includes(highlight) || x.target.includes(highlight)));
            links.push({
                source: fromTable,
                target: toTable,
                curveness,
                mappings: mappers,
                matched,
                lineStyle: matched ? { color: '#DA251D', width: 3, curveness } : { color: '#B6BFCB', width: 1.6, curveness },
            });
        });
    });
    lineageChart.setOption({
        tooltip: {
            trigger: 'item',
            formatter: (params) => {
                if (params.dataType === 'edge') {
                    const d = params.data;
                    const rows = (d.mappings ?? [])
                        .map((m) => `<span style="color:#2B6CB0">${m.source}</span> —[${m.func}]→ <span style="color:#DA251D">${m.target}</span>`)
                        .join('<br/>');
                    return `<b>${d.source} → ${d.target}</b><br/><br/>${rows}`;
                }
                return params.data?.tipHtml ?? params.data?.source ?? '';
            },
        },
        series: [
            {
                type: 'graph',
                layout: 'none',
                roam: true,
                draggable: true,
                data: nodes,
                links,
                lineStyle: { color: '#B6BFCB', width: 1.6, curveness: 0.5 },
                emphasis: { focus: 'adjacency', lineStyle: { width: 3, color: '#DA251D' } },
            },
        ],
    });
};
const highlightTable = () => {
    const keyword = searchTable.value.trim();
    if (!keyword) {
        ElMessage.warning('请输入要定位的表名或字段名');
        return;
    }
    renderLineage(keyword);
    ElMessage.success(`已定位到「${keyword}」及其血缘链路`);
};
const uploadSql = () => {
    ElMessage.success(`SQL 文件已解析，生成字段级血缘关系 ${fieldLineage.length} 条（Mock）`);
};
const handleResize = () => lineageChart?.resize();
watch(activeTab, () => {
    if (activeTab.value === 'visual') {
        nextTick(() => handleResize());
    }
});
let chartResizeObserver = null;
onMounted(() => {
    renderLineage();
    window.addEventListener('resize', handleResize);
    // 容器尺寸变化时自动同步 ECharts 画布（CSS 高度变化 / 折叠侧栏 / 标签页切换等）
    if (lineageChartRef.value && typeof ResizeObserver !== 'undefined') {
        chartResizeObserver = new ResizeObserver(() => handleResize());
        chartResizeObserver.observe(lineageChartRef.value);
    }
});
onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize);
    chartResizeObserver?.disconnect();
    lineageChart?.dispose();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "standard-page" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "lineage-tabs-wrap" },
});
const __VLS_0 = {}.ElTabs;
/** @type {[typeof __VLS_components.ElTabs, typeof __VLS_components.elTabs, typeof __VLS_components.ElTabs, typeof __VLS_components.elTabs, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    modelValue: (__VLS_ctx.activeTab),
    type: "border-card",
    stretch: true,
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.activeTab),
    type: "border-card",
    stretch: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
const __VLS_4 = {}.ElTabPane;
/** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    label: "血缘可视化",
    name: "visual",
}));
const __VLS_6 = __VLS_5({
    label: "血缘可视化",
    name: "visual",
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
__VLS_7.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "lineage-visual-pane" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "lineage-toolbar" },
});
const __VLS_8 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    ...{ 'onKeyup': {} },
    modelValue: (__VLS_ctx.searchTable),
    placeholder: "搜索表名 / 字段名",
    clearable: true,
    size: "small",
    ...{ class: "search-input-sm" },
}));
const __VLS_10 = __VLS_9({
    ...{ 'onKeyup': {} },
    modelValue: (__VLS_ctx.searchTable),
    placeholder: "搜索表名 / 字段名",
    clearable: true,
    size: "small",
    ...{ class: "search-input-sm" },
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
let __VLS_12;
let __VLS_13;
let __VLS_14;
const __VLS_15 = {
    onKeyup: (__VLS_ctx.highlightTable)
};
var __VLS_11;
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
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ref: "lineageChartRef",
    ...{ class: "lineage-chart" },
});
/** @type {typeof __VLS_ctx.lineageChartRef} */ ;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "sankey-legend" },
});
for (const [item] of __VLS_getVForSourceType((__VLS_ctx.legendItems))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        key: (item.label),
        ...{ class: "sankey-legend-item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.i, __VLS_intrinsicElements.i)({
        ...{ class: "sankey-legend-dot" },
        ...{ style: ({ background: item.color }) },
    });
    (item.label);
}
var __VLS_7;
const __VLS_32 = {}.ElTabPane;
/** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
    label: "血缘明细",
    name: "detail",
}));
const __VLS_34 = __VLS_33({
    label: "血缘明细",
    name: "detail",
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
__VLS_35.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "lineage-detail-pane" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "lineage-toolbar" },
});
const __VLS_36 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    modelValue: (__VLS_ctx.detailFilter),
    size: "small",
    ...{ class: "filter-select-sm" },
}));
const __VLS_38 = __VLS_37({
    modelValue: (__VLS_ctx.detailFilter),
    size: "small",
    ...{ class: "filter-select-sm" },
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
__VLS_39.slots.default;
const __VLS_40 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
    label: "全部目标表",
    value: "",
}));
const __VLS_42 = __VLS_41({
    label: "全部目标表",
    value: "",
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
for (const [t] of __VLS_getVForSourceType((__VLS_ctx.targetTables))) {
    const __VLS_44 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
        key: (t),
        label: (t),
        value: (t),
    }));
    const __VLS_46 = __VLS_45({
        key: (t),
        label: (t),
        value: (t),
    }, ...__VLS_functionalComponentArgsRest(__VLS_45));
}
var __VLS_39;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "dep-text" },
});
(__VLS_ctx.filteredDetails.length);
const __VLS_48 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
    data: (__VLS_ctx.filteredDetails),
    size: "small",
    stripe: true,
    height: "100%",
}));
const __VLS_50 = __VLS_49({
    data: (__VLS_ctx.filteredDetails),
    size: "small",
    stripe: true,
    height: "100%",
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
__VLS_51.slots.default;
const __VLS_52 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
    label: "源字段",
    minWidth: "170",
}));
const __VLS_54 = __VLS_53({
    label: "源字段",
    minWidth: "170",
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
__VLS_55.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_55.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "field-source" },
    });
    (row.source);
}
var __VLS_55;
const __VLS_56 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
    label: "处理函数",
    width: "140",
}));
const __VLS_58 = __VLS_57({
    label: "处理函数",
    width: "140",
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
__VLS_59.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_59.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_60 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
        size: "small",
        type: "warning",
        effect: "plain",
    }));
    const __VLS_62 = __VLS_61({
        size: "small",
        type: "warning",
        effect: "plain",
    }, ...__VLS_functionalComponentArgsRest(__VLS_61));
    __VLS_63.slots.default;
    (row.func);
    var __VLS_63;
}
var __VLS_59;
const __VLS_64 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
    label: "目标字段",
    minWidth: "170",
}));
const __VLS_66 = __VLS_65({
    label: "目标字段",
    minWidth: "170",
}, ...__VLS_functionalComponentArgsRest(__VLS_65));
__VLS_67.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_67.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "field-target" },
    });
    (row.target);
}
var __VLS_67;
const __VLS_68 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
    label: "数据量",
    width: "100",
    align: "right",
}));
const __VLS_70 = __VLS_69({
    label: "数据量",
    width: "100",
    align: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_69));
__VLS_71.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_71.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    (row.flowText);
}
var __VLS_71;
var __VLS_51;
var __VLS_35;
const __VLS_72 = {}.ElTabPane;
/** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
// @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
    label: "异常血缘追踪",
    name: "anomaly",
}));
const __VLS_74 = __VLS_73({
    label: "异常血缘追踪",
    name: "anomaly",
}, ...__VLS_functionalComponentArgsRest(__VLS_73));
__VLS_75.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "lineage-anomaly-pane" },
});
const __VLS_76 = {}.ElAlert;
/** @type {[typeof __VLS_components.ElAlert, typeof __VLS_components.elAlert, ]} */ ;
// @ts-ignore
const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
    title: "系统自动巡检血缘链路，标记断裂、循环、孤立、口径冲突与函数告警，供人工复核处理（Mock）",
    type: "warning",
    closable: (false),
    showIcon: true,
    ...{ class: "mb-12" },
}));
const __VLS_78 = __VLS_77({
    title: "系统自动巡检血缘链路，标记断裂、循环、孤立、口径冲突与函数告警，供人工复核处理（Mock）",
    type: "warning",
    closable: (false),
    showIcon: true,
    ...{ class: "mb-12" },
}, ...__VLS_functionalComponentArgsRest(__VLS_77));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "anomaly-list" },
});
for (const [item] of __VLS_getVForSourceType((__VLS_ctx.anomalies))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (item.text),
        ...{ class: "anomaly-item" },
    });
    const __VLS_80 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
        effect: "dark",
        type: (item.level),
        size: "small",
    }));
    const __VLS_82 = __VLS_81({
        effect: "dark",
        type: (item.level),
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_81));
    __VLS_83.slots.default;
    (item.type);
    var __VLS_83;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "anomaly-text" },
    });
    (item.text);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "anomaly-stats" },
});
for (const [stat] of __VLS_getVForSourceType((__VLS_ctx.anomalyStats))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (stat.label),
        ...{ class: "anomaly-stat" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "anomaly-stat-value" },
        ...{ style: ({ color: stat.color }) },
    });
    (stat.value);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "anomaly-stat-label" },
    });
    (stat.label);
}
var __VLS_75;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['standard-page']} */ ;
/** @type {__VLS_StyleScopedClasses['lineage-tabs-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['lineage-visual-pane']} */ ;
/** @type {__VLS_StyleScopedClasses['lineage-toolbar']} */ ;
/** @type {__VLS_StyleScopedClasses['search-input-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['lineage-chart']} */ ;
/** @type {__VLS_StyleScopedClasses['sankey-legend']} */ ;
/** @type {__VLS_StyleScopedClasses['sankey-legend-item']} */ ;
/** @type {__VLS_StyleScopedClasses['sankey-legend-dot']} */ ;
/** @type {__VLS_StyleScopedClasses['lineage-detail-pane']} */ ;
/** @type {__VLS_StyleScopedClasses['lineage-toolbar']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-select-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['dep-text']} */ ;
/** @type {__VLS_StyleScopedClasses['field-source']} */ ;
/** @type {__VLS_StyleScopedClasses['field-target']} */ ;
/** @type {__VLS_StyleScopedClasses['lineage-anomaly-pane']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-12']} */ ;
/** @type {__VLS_StyleScopedClasses['anomaly-list']} */ ;
/** @type {__VLS_StyleScopedClasses['anomaly-item']} */ ;
/** @type {__VLS_StyleScopedClasses['anomaly-text']} */ ;
/** @type {__VLS_StyleScopedClasses['anomaly-stats']} */ ;
/** @type {__VLS_StyleScopedClasses['anomaly-stat']} */ ;
/** @type {__VLS_StyleScopedClasses['anomaly-stat-value']} */ ;
/** @type {__VLS_StyleScopedClasses['anomaly-stat-label']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Upload: Upload,
            legendItems: legendItems,
            anomalies: anomalies,
            anomalyStats: anomalyStats,
            lineageChartRef: lineageChartRef,
            searchTable: searchTable,
            detailFilter: detailFilter,
            activeTab: activeTab,
            targetTables: targetTables,
            filteredDetails: filteredDetails,
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
