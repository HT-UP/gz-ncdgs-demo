import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
import * as echarts from 'echarts';
import { Connection, Delete } from '@element-plus/icons-vue';
const fieldLineage = [
    { source: 'passenger_info.passenger_id', target: 'ticket_sale_detail.passenger_id', func: '直接映射', flow: 8620 },
    { source: 'station_info.station_code', target: 'flow_stat_daily.station_code', func: 'JOIN 映射', flow: 128 },
    { source: 'station_info.station_name', target: 'flow_stat_daily.station_name', func: 'JOIN 映射', flow: 128 },
    { source: 'device_status_log.device_id', target: 'flow_stat_daily.device_cnt', func: 'COUNT(DISTINCT device_id)', flow: 512 },
    { source: 'ticket_sale_detail.ticket_no', target: 'flow_stat_daily.passenger_cnt', func: 'COUNT(ticket_no)', flow: 8620 },
    { source: 'ticket_sale_detail.ticket_date', target: 'flow_stat_daily.stat_date', func: 'TO_DATE(ticket_date)', flow: 8620 },
    { source: 'line_info.line_code', target: 'station_info.line_code', func: 'JOIN 映射', flow: 8 },
    { source: 'line_info.line_code', target: 'train_operation_log.line_code', func: 'JOIN 映射', flow: 8 },
    { source: 'ticket_sale_detail.amount', target: 'train_operation_log.ticket_cnt', func: 'SUM(amount)', flow: 8620 },
    { source: 'flow_stat_daily.passenger_cnt', target: 'train_operation_log.passenger_cnt', func: 'SUM(passenger_cnt)', flow: 8620 },
    { source: 'flow_stat_daily.stat_date', target: 'train_operation_log.op_date', func: 'TO_DATE(stat_date)', flow: 8620 },
    { source: 'device_status_log.device_id', target: 'train_operation_log.device_id', func: '直接映射', flow: 512 },
    { source: 'device_status_log.status', target: 'train_operation_log.device_status', func: '直接映射', flow: 512 },
];
const tableMeta = {
    passenger_info: { label: '乘客信息表', layer: 'source' },
    station_info: { label: '车站信息表', layer: 'source' },
    line_info: { label: '线路信息表', layer: 'source' },
    device_status_log: { label: '设备状态日志表', layer: 'source' },
    ticket_sale_detail: { label: '售票明细表', layer: 'mid' },
    flow_stat_daily: { label: '客流日统计表', layer: 'mid' },
    train_operation_log: { label: '列车运行日志报表', layer: 'target' },
};
const tableFields = {
    passenger_info: ['passenger_id', 'passenger_name', 'age', 'phone', 'create_time'],
    station_info: ['station_code', 'station_name', 'station_type', 'line_code', 'status'],
    line_info: ['line_code', 'line_name', 'status'],
    device_status_log: ['device_id', 'device_name', 'status', 'report_time', 'create_time'],
    ticket_sale_detail: ['ticket_no', 'passenger_id', 'ticket_date', 'line_code', 'amount', 'create_time'],
    flow_stat_daily: ['stat_date', 'station_code', 'station_name', 'line_code', 'device_cnt', 'passenger_cnt', 'update_time'],
    train_operation_log: ['operation_id', 'line_code', 'station_code', 'device_id', 'device_status', 'passenger_cnt', 'ticket_cnt', 'op_date', 'create_time'],
};
const pkFields = new Set([
    'passenger_info.passenger_id',
    'station_info.station_code',
    'line_info.line_code',
    'device_status_log.device_id',
    'ticket_sale_detail.ticket_no',
    'flow_stat_daily.stat_date',
    'train_operation_log.operation_id',
]);
const layerTables = {
    source: ['passenger_info', 'station_info', 'line_info', 'device_status_log'],
    mid: ['ticket_sale_detail', 'flow_stat_daily'],
    target: ['train_operation_log'],
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
    { type: '断裂', level: 'danger', text: 'passenger_info.phone 无下游字段，缺少脱敏规则（Mock）' },
    { type: '循环', level: 'warning', text: 'flow_stat_daily.passenger_cnt ↔ train_operation_log.passenger_cnt 疑似循环引用，已自动阻断（Mock）' },
    { type: '孤立', level: 'danger', text: 'station_info.station_type 无上游且无下游，未纳入解析（Mock）' },
    { type: '冲突', level: 'warning', text: 'train_operation_log.ticket_cnt 存在多口径上游，请确认统计口径（Mock）' },
    { type: '告警', level: 'info', text: 'ticket_sale_detail.ticket_date 使用隐式转换，建议显式 CAST（Mock）' },
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
    // 表级连线分组：同一对表的多条字段映射渲染为自边缘扇出的平行浅灰弧线
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
    // 图表底部边界，用于判断每条连线所处的垂直位置
    const bottomMax = Math.max(...layerOrder.flatMap((layer) => layerTables[layer].map((table) => ys[table] + cardHeightOf(table))));
    groupMap.forEach((mappers, key) => {
        const [fromTable, toTable] = key.split('>');
        const fromCenterY = ys[fromTable] + cardHeightOf(fromTable) / 2;
        const toCenterY = ys[toTable] + cardHeightOf(toTable) / 2;
        const midY = (fromCenterY + toCenterY) / 2;
        // 0~1 垂直位置：0 顶部，1 底部
        const t = bottomMax > 0 ? midY / bottomMax : 0.5;
        // 正曲率向上弯、负曲率向下弯：上方连线向上弯，下方连线向下弯，中部渐近平缓
        const direction = 0.5 - t;
        mappers.forEach((_m, i) => {
            // 同组多条线沿相同弯曲方向微幅扇开
            const spread = i * 0.03 * (direction >= 0 ? 1 : -1);
            const curveness = direction * 0.7 + spread;
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
                lineStyle: matched
                    ? { color: '#DA251D', width: 2.5, curveness, opacity: 1 }
                    : { color: '#C7CDD8', width: 0.9, curveness, opacity: 0.9 },
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
                lineStyle: { color: '#C7CDD8', width: 0.9, curveness: 0.3, opacity: 0.9 },
                emphasis: { focus: 'adjacency', lineStyle: { width: 2.5, color: '#DA251D', opacity: 1 } },
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
const lineageDialogVisible = ref(false);
const upDbs = [
    { name: '客票系统库', tables: ['ticket_sale_detail', 'passenger_info'] },
    { name: '基础信息库', tables: ['station_info', 'line_info'] },
    { name: '设备监控库', tables: ['device_status_log'] },
];
const downDbs = [
    { name: '数据仓库ODS', tables: ['flow_stat_daily', 'ods_station'] },
    { name: '数据仓库DWS', tables: ['train_operation_log', 'dws_passenger_flow'] },
];
const funcOptions = ['直接映射', 'TO_DATE()', 'NVL()', 'TRIM()', 'CONCAT()', 'CASE WHEN', 'SUM()', 'COUNT()', 'AVG()', 'JOIN 映射'];
const reportLinks = ref([]);
const activeLinkId = ref(null);
const hoverLinkId = ref(null);
const linkRevision = ref(0);
let reportLinkSeq = 0;
const wrapRef = ref();
const tableEls = new Map();
const setTableEl = (key) => (el) => {
    if (el instanceof HTMLElement)
        tableEls.set(key, el);
};
const wrapRect = () => wrapRef.value?.getBoundingClientRect();
const sidePoint = (el, side) => {
    const wr = wrapRect();
    if (!wr)
        return { x: 0, y: 0 };
    const r = el.getBoundingClientRect();
    return { x: r.left - wr.left + (side === 'right' ? r.width : 0), y: r.top - wr.top + r.height / 2 };
};
const computedLinks = computed(() => {
    void linkRevision.value;
    const wr = wrapRect();
    if (!wr)
        return [];
    return reportLinks.value.map((lnk) => {
        const sp = tableEls.get(`up:${lnk.upDb}:${lnk.upTable}`);
        const dp = tableEls.get(`down:${lnk.downDb}:${lnk.downTable}`);
        if (!sp || !dp)
            return { ...lnk, path: '' };
        const s = sidePoint(sp, 'right');
        const d = sidePoint(dp, 'left');
        const dx = Math.max(60, (d.x - s.x) / 2);
        return {
            ...lnk,
            path: `M ${s.x} ${s.y} C ${s.x + dx} ${s.y}, ${d.x - dx} ${d.y}, ${d.x} ${d.y}`,
            mid: { x: (s.x + d.x) / 2, y: (s.y + d.y) / 2 },
        };
    });
});
const hoverTip = computed(() => {
    const lnk = computedLinks.value.find((l) => l.id === hoverLinkId.value);
    if (!lnk || !lnk.mid)
        return null;
    return { x: lnk.mid.x, y: lnk.mid.y, text: `${lnk.upTable} —[${lnk.func}]→ ${lnk.downTable}` };
});
const dragging = ref(null);
const dragPos = ref({ x: 0, y: 0 });
const tempPath = computed(() => {
    const d = dragging.value;
    if (!d)
        return '';
    const p = dragPos.value;
    const dx = Math.max(60, (p.x - d.start.x) / 2);
    return `M ${d.start.x} ${d.start.y} C ${d.start.x + dx} ${d.start.y}, ${p.x - dx} ${p.y}, ${p.x} ${p.y}`;
});
const toWrapPoint = (e) => {
    const wr = wrapRect();
    if (!wr)
        return { x: 0, y: 0 };
    return { x: e.clientX - wr.left, y: e.clientY - wr.top };
};
const startDrag = (e, side, db, table) => {
    if (e.button !== 0)
        return;
    e.preventDefault();
    const key = `${side}:${db}:${table}`;
    const el = tableEls.get(key);
    if (!el)
        return;
    dragging.value = { side, key, start: sidePoint(el, side === 'up' ? 'right' : 'left') };
    dragPos.value = dragging.value.start;
    window.addEventListener('pointermove', onDragMove);
    window.addEventListener('pointerup', onDragUp);
};
const onDragMove = (e) => {
    if (!dragging.value)
        return;
    dragPos.value = toWrapPoint(e);
};
const onDragUp = (e) => {
    const d = dragging.value;
    if (d) {
        const p = toWrapPoint(e);
        const targetSide = d.side === 'up' ? 'down' : 'up';
        const hit = [...tableEls.entries()].find(([key, el]) => {
            if (!key.startsWith(`${targetSide}:`))
                return false;
            const wr = wrapRect();
            if (!wr)
                return false;
            const r = el.getBoundingClientRect();
            return (p.x >= r.left - wr.left - 8 &&
                p.x <= r.left - wr.left + r.width + 8 &&
                p.y >= r.top - wr.top - 8 &&
                p.y <= r.top - wr.top + r.height + 8);
        });
        if (hit) {
            const targetKey = hit[0];
            const [, tDb, tTable] = targetKey.split(':');
            const [, sDb, sTable] = d.key.split(':');
            const up = d.side === 'up' ? { db: sDb, table: sTable } : { db: tDb, table: tTable };
            const down = d.side === 'down' ? { db: sDb, table: sTable } : { db: tDb, table: tTable };
            const dup = reportLinks.value.some((l) => l.upTable === up.table && l.downTable === down.table);
            if (dup) {
                ElMessage.warning(`「${up.table} → ${down.table}」已存在，请先删除原连线`);
            }
            else {
                reportLinks.value.push({
                    id: ++reportLinkSeq,
                    upDb: up.db,
                    upTable: up.table,
                    downDb: down.db,
                    downTable: down.table,
                    func: '直接映射',
                });
                linkRevision.value++;
            }
        }
    }
    cleanupDrag();
};
const cleanupDrag = () => {
    dragging.value = null;
    window.removeEventListener('pointermove', onDragMove);
    window.removeEventListener('pointerup', onDragUp);
};
const openLineageDialog = () => {
    reportLinks.value = [];
    activeLinkId.value = null;
    lineageDialogVisible.value = true;
    nextTick(() => linkRevision.value++);
};
const resetBuilder = () => {
    reportLinks.value = [];
    activeLinkId.value = null;
    linkRevision.value++;
};
const removeLink = (id) => {
    reportLinks.value = reportLinks.value.filter((l) => l.id !== id);
    if (activeLinkId.value === id)
        activeLinkId.value = null;
    linkRevision.value++;
};
const onRowClick = (row) => {
    activeLinkId.value = row.id;
};
const ensureReportTable = (table, field, side) => {
    if (!tableFields[table]) {
        tableFields[table] = [field];
        const layer = /^(dws|ads|rpt|report)/i.test(table)
            ? 'target'
            : /^(dim|dwd|ods|mid|fct)/i.test(table)
                ? 'mid'
                : side === 'up'
                    ? 'source'
                    : 'mid';
        layerTables[layer].push(table);
        tableMeta[table] = { label: `新增表 ${table}`, layer };
    }
    else if (field && !tableFields[table].includes(field)) {
        tableFields[table].push(field);
    }
};
const saveLineage = () => {
    if (!reportLinks.value.length) {
        ElMessage.warning('请先从左侧拖拽连线到右侧，建立至少一条血缘关系');
        return;
    }
    const baseCount = fieldLineage.length;
    reportLinks.value.forEach((lnk) => {
        const source = `${lnk.upTable}.${lnk.upTable}_id`;
        const target = `${lnk.downTable}.${lnk.downTable}_id`;
        fieldLineage.push({
            source,
            target,
            func: lnk.func || '直接映射',
            flow: Math.round(Math.random() * 5000) + 500,
        });
        ensureReportTable(lnk.upTable, `${lnk.upTable}_id`, 'up');
        ensureReportTable(lnk.downTable, `${lnk.downTable}_id`, 'down');
    });
    renderLineage();
    lineageDialogVisible.value = false;
    reportLinks.value = [];
    ElMessage.success(`血缘填报成功，新增 ${fieldLineage.length - baseCount} 条字段级血缘关系`);
};
const handleResize = () => lineageChart?.resize();
watch(activeTab, () => {
    if (activeTab.value === 'visual') {
        nextTick(() => handleResize());
    }
});
let reportResizeObserver = null;
watch(lineageDialogVisible, (visible) => {
    if (visible) {
        nextTick(() => {
            // 弹框打开后重算连线坐标，并监听容器尺寸变化自动刷新
            linkRevision.value++;
            reportResizeObserver?.disconnect();
            if (wrapRef.value && typeof ResizeObserver !== 'undefined') {
                reportResizeObserver = new ResizeObserver(() => linkRevision.value++);
                reportResizeObserver.observe(wrapRef.value);
            }
        });
    }
    else {
        reportResizeObserver?.disconnect();
        reportResizeObserver = null;
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
    reportResizeObserver?.disconnect();
    lineageChart?.dispose();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['lineage-report-dialog']} */ ;
/** @type {__VLS_StyleScopedClasses['lineage-report-dialog']} */ ;
/** @type {__VLS_StyleScopedClasses['lineage-anomaly-pane']} */ ;
/** @type {__VLS_StyleScopedClasses['lineage-detail-pane']} */ ;
/** @type {__VLS_StyleScopedClasses['lineage-report-dialog']} */ ;
/** @type {__VLS_StyleScopedClasses['port']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "standard-page lineage-page" },
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
    icon: (__VLS_ctx.Connection),
}));
const __VLS_26 = __VLS_25({
    ...{ 'onClick': {} },
    size: "small",
    icon: (__VLS_ctx.Connection),
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
let __VLS_28;
let __VLS_29;
let __VLS_30;
const __VLS_31 = {
    onClick: (__VLS_ctx.openLineageDialog)
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
const __VLS_84 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
    modelValue: (__VLS_ctx.lineageDialogVisible),
    title: "血缘填报 · 拖拽连线",
    fullscreen: true,
    ...{ class: "lineage-report-dialog" },
    destroyOnClose: true,
}));
const __VLS_86 = __VLS_85({
    modelValue: (__VLS_ctx.lineageDialogVisible),
    title: "血缘填报 · 拖拽连线",
    fullscreen: true,
    ...{ class: "lineage-report-dialog" },
    destroyOnClose: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_85));
__VLS_87.slots.default;
const __VLS_88 = {}.ElAlert;
/** @type {[typeof __VLS_components.ElAlert, typeof __VLS_components.elAlert, typeof __VLS_components.ElAlert, typeof __VLS_components.elAlert, ]} */ ;
// @ts-ignore
const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
    ...{ class: "report-hint" },
    type: "info",
    closable: (false),
    showIcon: true,
}));
const __VLS_90 = __VLS_89({
    ...{ class: "report-hint" },
    type: "info",
    closable: (false),
    showIcon: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_89));
__VLS_91.slots.default;
{
    const { title: __VLS_thisSlot } = __VLS_91.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "hint-strong" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "hint-strong" },
    });
}
var __VLS_91;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "report-builder" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    id: "report-canvas",
    ref: "wrapRef",
    ...{ class: "report-canvas-wrap" },
});
/** @type {typeof __VLS_ctx.wrapRef} */ ;
__VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
    ...{ class: "report-svg" },
});
for (const [lnk] of __VLS_getVForSourceType((__VLS_ctx.computedLinks))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
        ...{ onMouseenter: (...[$event]) => {
                __VLS_ctx.hoverLinkId = lnk.id;
            } },
        ...{ onMouseleave: (...[$event]) => {
                __VLS_ctx.hoverLinkId = null;
            } },
        key: (lnk.id),
        d: (lnk.path),
        ...{ class: ({ 'is-active': __VLS_ctx.activeLinkId === lnk.id || __VLS_ctx.hoverLinkId === lnk.id }) },
    });
}
if (__VLS_ctx.dragging) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
        d: (__VLS_ctx.tempPath),
        ...{ class: "report-temp-path" },
    });
}
if (__VLS_ctx.hoverTip) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "report-hover-tip" },
        ...{ style: ({ left: __VLS_ctx.hoverTip.x + 'px', top: __VLS_ctx.hoverTip.y + 'px' }) },
    });
    (__VLS_ctx.hoverTip.text);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.aside, __VLS_intrinsicElements.aside)({
    ...{ onScroll: (...[$event]) => {
            __VLS_ctx.linkRevision++;
        } },
    ...{ class: "report-side report-side-left" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "side-title" },
});
for (const [db] of __VLS_getVForSourceType((__VLS_ctx.upDbs))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (db.name),
        ...{ class: "db-section" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "db-head" },
    });
    (db.name);
    for (const [t] of __VLS_getVForSourceType((db.tables))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ onPointerdown: (...[$event]) => {
                    __VLS_ctx.startDrag($event, 'up', db.name, t);
                } },
            key: (t),
            ...{ class: "table-row" },
            ref: (__VLS_ctx.setTableEl(`up:${db.name}:${t}`)),
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "table-name" },
        });
        (t);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span)({
            ...{ class: "port port-right" },
            title: "拖拽到右侧建立血缘",
        });
    }
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.aside, __VLS_intrinsicElements.aside)({
    ...{ onScroll: (...[$event]) => {
            __VLS_ctx.linkRevision++;
        } },
    ...{ class: "report-side report-side-right" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "side-title" },
});
for (const [db] of __VLS_getVForSourceType((__VLS_ctx.downDbs))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (db.name),
        ...{ class: "db-section" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "db-head" },
    });
    (db.name);
    for (const [t] of __VLS_getVForSourceType((db.tables))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ onPointerdown: (...[$event]) => {
                    __VLS_ctx.startDrag($event, 'down', db.name, t);
                } },
            key: (t),
            ...{ class: "table-row" },
            ref: (__VLS_ctx.setTableEl(`down:${db.name}:${t}`)),
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span)({
            ...{ class: "port port-left" },
            title: "拖拽到左侧建立血缘",
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "table-name" },
        });
        (t);
    }
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "report-links" },
});
const __VLS_92 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
    ...{ 'onRowClick': {} },
    data: (__VLS_ctx.reportLinks),
    size: "small",
    height: "150",
    highlightCurrentRow: true,
}));
const __VLS_94 = __VLS_93({
    ...{ 'onRowClick': {} },
    data: (__VLS_ctx.reportLinks),
    size: "small",
    height: "150",
    highlightCurrentRow: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_93));
let __VLS_96;
let __VLS_97;
let __VLS_98;
const __VLS_99 = {
    onRowClick: (__VLS_ctx.onRowClick)
};
__VLS_95.slots.default;
const __VLS_100 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
    label: "上游（数据库 · 表）",
    minWidth: "180",
}));
const __VLS_102 = __VLS_101({
    label: "上游（数据库 · 表）",
    minWidth: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_101));
__VLS_103.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_103.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "field-source" },
    });
    (row.upDb);
    (row.upTable);
}
var __VLS_103;
const __VLS_104 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
    label: "处理函数",
    width: "180",
}));
const __VLS_106 = __VLS_105({
    label: "处理函数",
    width: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_105));
__VLS_107.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_107.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_108 = {}.ElSelect;
    /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
    // @ts-ignore
    const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
        modelValue: (row.func),
        size: "small",
        filterable: true,
        allowCreate: true,
        defaultFirstOption: true,
    }));
    const __VLS_110 = __VLS_109({
        modelValue: (row.func),
        size: "small",
        filterable: true,
        allowCreate: true,
        defaultFirstOption: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_109));
    __VLS_111.slots.default;
    for (const [f] of __VLS_getVForSourceType((__VLS_ctx.funcOptions))) {
        const __VLS_112 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
            key: (f),
            label: (f),
            value: (f),
        }));
        const __VLS_114 = __VLS_113({
            key: (f),
            label: (f),
            value: (f),
        }, ...__VLS_functionalComponentArgsRest(__VLS_113));
    }
    var __VLS_111;
}
var __VLS_107;
const __VLS_116 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
    label: "下游（数据库 · 表）",
    minWidth: "180",
}));
const __VLS_118 = __VLS_117({
    label: "下游（数据库 · 表）",
    minWidth: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_117));
__VLS_119.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_119.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "field-target" },
    });
    (row.downDb);
    (row.downTable);
}
var __VLS_119;
const __VLS_120 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({
    label: "操作",
    width: "80",
    align: "center",
}));
const __VLS_122 = __VLS_121({
    label: "操作",
    width: "80",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_121));
__VLS_123.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_123.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_124 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({
        ...{ 'onClick': {} },
        type: "danger",
        link: true,
        icon: (__VLS_ctx.Delete),
    }));
    const __VLS_126 = __VLS_125({
        ...{ 'onClick': {} },
        type: "danger",
        link: true,
        icon: (__VLS_ctx.Delete),
    }, ...__VLS_functionalComponentArgsRest(__VLS_125));
    let __VLS_128;
    let __VLS_129;
    let __VLS_130;
    const __VLS_131 = {
        onClick: (...[$event]) => {
            __VLS_ctx.removeLink(row.id);
        }
    };
    var __VLS_127;
}
var __VLS_123;
var __VLS_95;
{
    const { footer: __VLS_thisSlot } = __VLS_87.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "report-footer" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "report-count" },
    });
    (__VLS_ctx.reportLinks.length);
    const __VLS_132 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132({
        ...{ 'onClick': {} },
        size: "small",
    }));
    const __VLS_134 = __VLS_133({
        ...{ 'onClick': {} },
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_133));
    let __VLS_136;
    let __VLS_137;
    let __VLS_138;
    const __VLS_139 = {
        onClick: (__VLS_ctx.resetBuilder)
    };
    __VLS_135.slots.default;
    var __VLS_135;
    const __VLS_140 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_141 = __VLS_asFunctionalComponent(__VLS_140, new __VLS_140({
        ...{ 'onClick': {} },
        size: "small",
    }));
    const __VLS_142 = __VLS_141({
        ...{ 'onClick': {} },
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_141));
    let __VLS_144;
    let __VLS_145;
    let __VLS_146;
    const __VLS_147 = {
        onClick: (...[$event]) => {
            __VLS_ctx.lineageDialogVisible = false;
        }
    };
    __VLS_143.slots.default;
    var __VLS_143;
    const __VLS_148 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_149 = __VLS_asFunctionalComponent(__VLS_148, new __VLS_148({
        ...{ 'onClick': {} },
        type: "danger",
        size: "small",
    }));
    const __VLS_150 = __VLS_149({
        ...{ 'onClick': {} },
        type: "danger",
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_149));
    let __VLS_152;
    let __VLS_153;
    let __VLS_154;
    const __VLS_155 = {
        onClick: (__VLS_ctx.saveLineage)
    };
    __VLS_151.slots.default;
    var __VLS_151;
}
var __VLS_87;
/** @type {__VLS_StyleScopedClasses['standard-page']} */ ;
/** @type {__VLS_StyleScopedClasses['lineage-page']} */ ;
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
/** @type {__VLS_StyleScopedClasses['lineage-report-dialog']} */ ;
/** @type {__VLS_StyleScopedClasses['report-hint']} */ ;
/** @type {__VLS_StyleScopedClasses['hint-strong']} */ ;
/** @type {__VLS_StyleScopedClasses['hint-strong']} */ ;
/** @type {__VLS_StyleScopedClasses['report-builder']} */ ;
/** @type {__VLS_StyleScopedClasses['report-canvas-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['report-svg']} */ ;
/** @type {__VLS_StyleScopedClasses['report-temp-path']} */ ;
/** @type {__VLS_StyleScopedClasses['report-hover-tip']} */ ;
/** @type {__VLS_StyleScopedClasses['report-side']} */ ;
/** @type {__VLS_StyleScopedClasses['report-side-left']} */ ;
/** @type {__VLS_StyleScopedClasses['side-title']} */ ;
/** @type {__VLS_StyleScopedClasses['db-section']} */ ;
/** @type {__VLS_StyleScopedClasses['db-head']} */ ;
/** @type {__VLS_StyleScopedClasses['table-row']} */ ;
/** @type {__VLS_StyleScopedClasses['table-name']} */ ;
/** @type {__VLS_StyleScopedClasses['port']} */ ;
/** @type {__VLS_StyleScopedClasses['port-right']} */ ;
/** @type {__VLS_StyleScopedClasses['report-side']} */ ;
/** @type {__VLS_StyleScopedClasses['report-side-right']} */ ;
/** @type {__VLS_StyleScopedClasses['side-title']} */ ;
/** @type {__VLS_StyleScopedClasses['db-section']} */ ;
/** @type {__VLS_StyleScopedClasses['db-head']} */ ;
/** @type {__VLS_StyleScopedClasses['table-row']} */ ;
/** @type {__VLS_StyleScopedClasses['port']} */ ;
/** @type {__VLS_StyleScopedClasses['port-left']} */ ;
/** @type {__VLS_StyleScopedClasses['table-name']} */ ;
/** @type {__VLS_StyleScopedClasses['report-links']} */ ;
/** @type {__VLS_StyleScopedClasses['field-source']} */ ;
/** @type {__VLS_StyleScopedClasses['field-target']} */ ;
/** @type {__VLS_StyleScopedClasses['report-footer']} */ ;
/** @type {__VLS_StyleScopedClasses['report-count']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Connection: Connection,
            Delete: Delete,
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
            lineageDialogVisible: lineageDialogVisible,
            upDbs: upDbs,
            downDbs: downDbs,
            funcOptions: funcOptions,
            reportLinks: reportLinks,
            activeLinkId: activeLinkId,
            hoverLinkId: hoverLinkId,
            linkRevision: linkRevision,
            wrapRef: wrapRef,
            setTableEl: setTableEl,
            computedLinks: computedLinks,
            hoverTip: hoverTip,
            dragging: dragging,
            tempPath: tempPath,
            startDrag: startDrag,
            openLineageDialog: openLineageDialog,
            resetBuilder: resetBuilder,
            removeLink: removeLink,
            onRowClick: onRowClick,
            saveLineage: saveLineage,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
