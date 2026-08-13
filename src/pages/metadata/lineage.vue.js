import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import * as echarts from 'echarts';
import { Connection, Delete, Search } from '@element-plus/icons-vue';
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
    { name: '票务运营库', tables: ['ticket_sale', 'passenger_info', 'payment_record'] },
    { name: '基础信息库', tables: ['station_info', 'line_info', 'train_info'] },
    { name: '设备监控库', tables: ['device_status_log', 'train_operation_log'] },
    { name: '数据仓库ODS', tables: ['ods_order_detail', 'ods_passenger', 'ods_station'] },
];
const downDbs = [
    { name: '数据仓库DWD', tables: ['dwd_order_detail', 'dwd_payment', 'dwd_ticket'] },
    { name: '数据仓库DIM', tables: ['dim_passenger', 'dim_station', 'dim_line'] },
    { name: '数据仓库DWS', tables: ['dws_order_report', 'dws_line_flow'] },
    { name: '指标中台ADS', tables: ['ads_line_flow', 'ads_operation_kpi'] },
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
                    upField: `${up.table}_id`,
                    downField: `${down.table}_id`,
                });
                linkRevision.value++;
                validateReportLinks();
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
    editingBatchId.value = null;
    reportTitle.value = '';
    reportLinks.value = [];
    activeLinkId.value = null;
    lineageDialogVisible.value = true;
    nextTick(() => {
        linkRevision.value++;
        validateReportLinks();
    });
};
const editBatch = (batch) => {
    editingBatchId.value = batch.id;
    reportTitle.value = batch.title;
    reportLinks.value = batch.links.map((l) => ({ ...l }));
    activeLinkId.value = null;
    lineageDialogVisible.value = true;
    nextTick(() => {
        linkRevision.value++;
        validateReportLinks();
    });
};
const resetBuilder = () => {
    reportLinks.value = [];
    activeLinkId.value = null;
    linkRevision.value++;
    validateReportLinks();
};
const removeLink = (id) => {
    reportLinks.value = reportLinks.value.filter((l) => l.id !== id);
    if (activeLinkId.value === id)
        activeLinkId.value = null;
    linkRevision.value++;
    validateReportLinks();
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
/* ==================== 血缘填报 · 校验 ==================== */
const tableFieldTypes = {
    'ticket_sale.order_id': 'STRING', 'ticket_sale.order_date': 'DATE', 'ticket_sale.line_code': 'STRING',
    'ticket_sale.amount': 'DECIMAL', 'ticket_sale.ticket_type': 'STRING', 'ticket_sale.status': 'STRING',
    'ticket_sale.create_time': 'TIMESTAMP',
    'passenger_info.passenger_id': 'STRING', 'passenger_info.passenger_name': 'STRING', 'passenger_info.age': 'INT',
    'passenger_info.phone': 'STRING', 'passenger_info.create_time': 'TIMESTAMP',
    'station_info.station_code': 'STRING', 'station_info.station_name': 'STRING', 'station_info.station_type': 'STRING',
    'station_info.status': 'STRING',
    'line_info.line_code': 'STRING', 'line_info.line_name': 'STRING', 'line_info.status': 'STRING',
    'dwd_order_detail.order_id': 'STRING', 'dwd_order_detail.order_date': 'DATE', 'dwd_order_detail.line_code': 'STRING',
    'dwd_order_detail.amount': 'DECIMAL', 'dwd_order_detail.ticket_type': 'STRING', 'dwd_order_detail.create_time': 'TIMESTAMP',
    'dim_passenger.passenger_id': 'STRING', 'dim_passenger.passenger_name': 'STRING', 'dim_passenger.age_group': 'STRING',
    'dim_passenger.create_time': 'TIMESTAMP',
    'dim_station.station_code': 'STRING', 'dim_station.station_name': 'STRING',
    'dim_line.line_code': 'STRING', 'dim_line.line_name': 'STRING',
    'dws_order_report.order_id': 'STRING', 'dws_order_report.order_date': 'DATE', 'dws_order_report.line_code': 'STRING',
    'dws_order_report.line_name': 'STRING', 'dws_order_report.total_amount': 'DECIMAL', 'dws_order_report.order_count': 'INT',
    'dws_order_report.ticket_type': 'STRING', 'dws_order_report.create_time': 'TIMESTAMP',
    'ads_line_flow.line_code': 'STRING', 'ads_line_flow.line_name': 'STRING', 'ads_line_flow.station_code': 'STRING',
    'ads_line_flow.station_name': 'STRING', 'ads_line_flow.total_passengers': 'INT', 'ads_line_flow.avg_age': 'DECIMAL',
    'ads_line_flow.flow_date': 'DATE', 'ads_line_flow.update_time': 'TIMESTAMP',
};
const knownTables = computed(() => {
    const set = new Set(Object.keys(tableFields));
    upDbs.forEach((db) => db.tables.forEach((t) => set.add(t)));
    downDbs.forEach((db) => db.tables.forEach((t) => set.add(t)));
    return set;
});
const fieldsOf = (table) => tableFields[table] || [];
const typeGroup = (t) => ['INT', 'BIGINT', 'DECIMAL', 'DOUBLE', 'NUMERIC'].includes(t) ? 'num' : ['DATE', 'DATETIME', 'TIMESTAMP'].includes(t) ? 'time' : t;
const typeCompatible = (a, b) => typeGroup(a) === typeGroup(b) || typeGroup(b) === 'STRING';
const reachable = (adj, from, to) => {
    if (!adj.has(from))
        return false;
    const queue = [from];
    const seen = new Set([from]);
    while (queue.length) {
        const cur = queue.shift();
        if (cur === to)
            return true;
        for (const next of adj.get(cur) ?? []) {
            if (!seen.has(next)) {
                seen.add(next);
                queue.push(next);
            }
        }
    }
    return false;
};
const reportTitle = ref('');
const editingBatchId = ref(null);
const batchErrorCount = ref(0);
const errorIssueCount = (issues) => (issues ?? []).filter((i) => i.level === 'error').length;
const hasErrorIssue = (issues) => errorIssueCount(issues) > 0;
const hasWarnIssue = (issues) => (issues ?? []).some((i) => i.level === 'warn');
const validateReportLinks = () => {
    const existingEdges = new Set(fieldLineage.map((f) => `${f.source.split('.')[0]}>${f.target.split('.')[0]}`));
    const adj = new Map();
    fieldLineage.forEach((f) => {
        const u = f.source.split('.')[0];
        const v = f.target.split('.')[0];
        if (!adj.has(u))
            adj.set(u, new Set());
        adj.get(u).add(v);
    });
    reportLinks.value.forEach((l) => {
        const issues = [];
        const upT = l.upTable;
        const downT = l.downTable;
        const upF = l.upField || '';
        const downF = l.downField || '';
        // 自引用检测
        if (upT === downT && upF === downF) {
            issues.push({ level: 'error', text: '自引用检测：上下游为同一字段' });
        }
        else if (upT === downT) {
            issues.push({ level: 'error', text: '自引用检测：字段归属同一张表，请确认血缘方向' });
        }
        // 对象存在性检测
        if (!knownTables.value.has(upT))
            issues.push({ level: 'error', text: `对象存在性：上游表「${upT}」在元数据中不存在` });
        if (!knownTables.value.has(downT))
            issues.push({ level: 'error', text: `对象存在性：下游表「${downT}」在元数据中不存在` });
        if (tableFields[upT] && upF && !tableFields[upT].includes(upF)) {
            issues.push({ level: 'warn', text: `上游字段「${upF}」尚未在元数据中采集，生效时将自动补齐` });
        }
        if (tableFields[downT] && downF && !tableFields[downT].includes(downF)) {
            issues.push({ level: 'warn', text: `下游字段「${downF}」尚未在元数据中采集，生效时将自动补齐` });
        }
        // 字段类型匹配检测
        if (upF && downF) {
            const ut = tableFieldTypes[`${upT}.${upF}`];
            const dt = tableFieldTypes[`${downT}.${downF}`];
            if (ut && dt && !typeCompatible(ut, dt)) {
                issues.push({ level: 'error', text: `字段类型不匹配：${upF}(${ut}) → ${downF}(${dt})` });
            }
            else if (!ut || !dt) {
                issues.push({ level: 'warn', text: '字段类型未知，建议确认映射类型' });
            }
        }
        // 重复检测（与已生效图谱 / 本批次内）
        const key = `${upT}>${downT}`;
        if (existingEdges.has(key))
            issues.push({ level: 'error', text: '重复检测：该表级血缘在生效图谱中已存在' });
        // 环路检测：加入后是否形成环（当前图中 downT 已达 upT）
        if (reachable(adj, downT, upT))
            issues.push({ level: 'error', text: '环路检测：该连线将形成血缘环路' });
        if (!adj.has(upT))
            adj.set(upT, new Set());
        adj.get(upT).add(downT);
        existingEdges.add(key);
        l.issues = issues;
    });
    batchErrorCount.value = reportLinks.value.reduce((s, l) => s + (l.issues ?? []).filter((i) => i.level === 'error').length, 0);
};
const nowText = () => new Date().toLocaleString('sv-SE').replace('T', ' ');
let batchSeq = 0;
const nextBatchId = () => {
    batchSeq++;
    return `RP-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(batchSeq).padStart(3, '0')}`;
};
const saveBatch = (status) => {
    if (!reportLinks.value.length) {
        ElMessage.warning('请先从左侧拖拽连线到右侧，建立至少一条血缘关系');
        return;
    }
    if (status === '待审批' && reportLinks.value.some((l) => !l.upField || !l.downField)) {
        ElMessage.warning('存在未选择源字段 / 目标字段的连线，请补充字段');
        return;
    }
    validateReportLinks();
    if (status === '待审批' && batchErrorCount.value > 0) {
        ElMessage.warning(`存在 ${batchErrorCount.value} 项校验异常，请修复后再提交审批`);
        return;
    }
    const links = reportLinks.value.map((l) => ({ ...l }));
    if (editingBatchId.value) {
        const idx = batches.value.findIndex((b) => b.id === editingBatchId.value);
        if (idx >= 0) {
            const old = batches.value[idx];
            batches.value[idx] = {
                ...old,
                title: reportTitle.value,
                links,
                errorCount: batchErrorCount.value,
                status: status === '待审批' ? '待审批' : old.status,
                ...(status === '待审批' ? { submitTime: nowText() } : {}),
            };
        }
    }
    else {
        batches.value.unshift({
            id: nextBatchId(),
            title: reportTitle.value,
            creator: '当前用户',
            createTime: nowText(),
            links,
            errorCount: batchErrorCount.value,
            status,
            ...(status === '待审批' ? { submitTime: nowText() } : {}),
        });
    }
    lineageDialogVisible.value = false;
    reportLinks.value = [];
    ElMessage.success(status === '草稿' ? '已保存为草稿，可在填报列表中继续编辑' : '已提交审批，等待管理员审批');
};
const batchStatusList = ['草稿', '待审批', '已通过', '已驳回', '已回滚'];
const batchStatusTag = {
    草稿: 'info',
    待审批: 'warning',
    已通过: 'success',
    已驳回: 'danger',
    已回滚: 'primary',
};
const batches = ref([
    {
        id: 'RP-20260801-001',
        title: '支付流水接入 ODS 层（历史批次基线）',
        creator: '张工',
        createTime: '2026-08-01 10:20',
        links: [
            { id: 1, upDb: '票务运营库', upTable: 'ticket_sale', upField: 'order_id', downDb: '数据仓库ODS', downTable: 'dwd_order_detail', downField: 'order_id', func: '直接映射', issues: [] },
            { id: 2, upDb: '票务运营库', upTable: 'passenger_info', upField: 'passenger_id', downDb: '数据仓库DIM', downTable: 'dim_passenger', downField: 'passenger_id', func: '直接映射', issues: [] },
        ],
        errorCount: 0,
        status: '已通过',
        submitTime: '2026-08-01 11:00',
        approver: '安全管理员',
        approveTime: '2026-08-01 15:30',
        comment: '核对无误，准予生效',
        versionNo: 'V2.0',
    },
    {
        id: 'RP-20260806-002',
        title: '客流指标口径拆分（待审批）',
        creator: '李工',
        createTime: '2026-08-06 14:00',
        links: [
            { id: 1, upDb: '数据仓库DWD', upTable: 'dwd_order_detail', upField: 'amount', downDb: '数据仓库DWS', downTable: 'dws_order_report', downField: 'total_amount', func: 'SUM()', issues: [] },
        ],
        errorCount: 0,
        status: '待审批',
        submitTime: '2026-08-06 16:00',
    },
    {
        id: 'RP-20260810-003',
        title: '设备状态接入运营报表（草稿，含重复连线）',
        creator: '王工',
        createTime: '2026-08-10 09:30',
        links: [
            { id: 1, upDb: '设备监控库', upTable: 'device_status_log', upField: 'device_id', downDb: '数据仓库DWS', downTable: 'train_operation_log', downField: 'device_id', func: '直接映射', issues: [] },
            { id: 2, upDb: '数据仓库DWD', upTable: 'dwd_order_detail', upField: 'order_id', downDb: '数据仓库DWS', downTable: 'dws_order_report', downField: 'order_id', func: '直接映射', issues: [] },
        ],
        errorCount: 1,
        status: '草稿',
    },
    {
        id: 'RP-20260812-004',
        title: '临时表迁移方案（已驳回）',
        creator: '李工',
        createTime: '2026-08-12 11:20',
        links: [
            { id: 1, upDb: '基础信息库', upTable: 'station_info', upField: 'station_code', downDb: '数据仓库DIM', downTable: 'dim_station', downField: 'station_code', func: '直接映射', issues: [{ level: 'warn', text: '审批意见：与已有映射重复' }] },
        ],
        errorCount: 0,
        status: '已驳回',
        submitTime: '2026-08-12 11:40',
        approver: '安全管理员',
        approveTime: '2026-08-12 14:10',
        comment: '与现有血缘重复，请补充差异说明后重新提交',
    },
]);
const batchKeyword = ref('');
const batchStatusFilter = ref('');
const filteredBatches = computed(() => batches.value.filter((b) => {
    if (batchStatusFilter.value && b.status !== batchStatusFilter.value)
        return false;
    if (!batchKeyword.value)
        return true;
    const kw = batchKeyword.value.toLowerCase();
    return b.id.toLowerCase().includes(kw) || b.creator.toLowerCase().includes(kw) || b.title.toLowerCase().includes(kw);
}));
const passedBatches = computed(() => batches.value.filter((b) => b.status === '已通过').length);
const submitBatch = (batch) => {
    if (batch.errorCount > 0) {
        ElMessage.warning(`该批次存在 ${batch.errorCount} 项校验异常，请编辑修复后再提交`);
        return;
    }
    batch.status = '待审批';
    batch.submitTime = nowText();
    ElMessage.success(`批次「${batch.id}」已提交审批（Mock）`);
};
/* ==================== 提交审批流 ==================== */
const approveVisible = ref(false);
const approveTarget = ref(null);
const approverPool = ['安全管理员', '数据治理管理员', '平台管理员'];
const approveForm = reactive({ approver: '安全管理员', comment: '' });
let graphVersionSeq = 2;
const openApproveDialog = (batch) => {
    approveTarget.value = batch;
    approveForm.approver = '安全管理员';
    approveForm.comment = '';
    approveVisible.value = true;
};
const applyBatchToLineage = (batch) => {
    let added = 0;
    batch.links.forEach((l) => {
        const source = `${l.upTable}.${l.upField}`;
        const target = `${l.downTable}.${l.downField}`;
        if (!fieldLineage.some((f) => f.source === source && f.target === target)) {
            fieldLineage.push({ source, target, func: l.func || '直接映射', flow: Math.round(Math.random() * 5000) + 500 });
            added++;
        }
        ensureReportTable(l.upTable, l.upField, 'up');
        ensureReportTable(l.downTable, l.downField, 'down');
    });
    return added;
};
const doApprove = (pass) => {
    const b = approveTarget.value;
    if (!b)
        return;
    if (!approveForm.approver) {
        ElMessage.warning('请选择审批人');
        return;
    }
    if (!approveForm.comment.trim()) {
        ElMessage.warning('请填写审批意见');
        return;
    }
    if (pass && b.errorCount > 0) {
        ElMessage.warning('该批次存在校验异常，不能审批通过');
        return;
    }
    if (pass) {
        const added = applyBatchToLineage(b);
        b.status = '已通过';
        b.approver = approveForm.approver;
        b.approveTime = nowText();
        b.comment = approveForm.comment;
        b.versionNo = `V${++graphVersionSeq}.0`;
        renderLineage();
        ElMessage.success(`审批通过，${added} 条血缘已生效入图谱，当前图谱版本 ${b.versionNo}`);
    }
    else {
        b.status = '已驳回';
        b.approver = approveForm.approver;
        b.approveTime = nowText();
        b.comment = approveForm.comment;
        ElMessage.warning('已驳回该填报批次');
    }
    approveVisible.value = false;
};
/* ==================== 版本对比与回滚 ==================== */
const compareVisible = ref(false);
const compareBase = ref('BASE');
const compareTarget = ref('');
const compareOptions = ref([]);
const openVersionCompare = (batch) => {
    compareOptions.value = [
        { label: '基线版本（初始图谱 V1.0）', value: 'BASE' },
        ...batches.value
            .filter((b) => b.status === '已通过' || b.status === '已回滚')
            .map((b) => ({ label: `${b.id}（${b.versionNo ?? '—'}）`, value: b.id })),
    ];
    compareBase.value = 'BASE';
    compareTarget.value = batch.id;
    compareVisible.value = true;
};
const snapshotOf = (option) => {
    if (option === 'BASE') {
        const applied = new Set(batches.value
            .filter((b) => b.status === '已通过' || b.status === '已回滚')
            .flatMap((b) => b.links.map((l) => `${l.upTable}.${l.upField}>${l.downTable}.${l.downField}`)));
        return fieldLineage.filter((f) => !applied.has(`${f.source}>${f.target}`)).map((f) => ({ source: f.source, func: f.func, target: f.target }));
    }
    const b = batches.value.find((x) => x.id === option);
    return b ? b.links.map((l) => ({ source: `${l.upTable}.${l.upField}`, func: l.func, target: `${l.downTable}.${l.downField}` })) : [];
};
const diffResult = computed(() => {
    const a = snapshotOf(compareBase.value);
    const b = snapshotOf(compareTarget.value);
    const key = (r) => `${r.source}>${r.target}`;
    const setB = new Set(b.map(key));
    const setA = new Set(a.map(key));
    return {
        added: b.filter((r) => !setA.has(key(r))),
        removed: a.filter((r) => !setB.has(key(r))),
        common: a.filter((r) => setB.has(key(r))).length,
    };
});
const diffRows = computed(() => [
    ...diffResult.value.added.map((r) => ({ ...r, change: '新增' })),
    ...diffResult.value.removed.map((r) => ({ ...r, change: '移除' })),
]);
const rollbackBatch = (batch) => {
    ElMessageBox.confirm(`确认回滚批次「${batch.id}」？该批次生效的 ${batch.links.length} 条血缘将从图谱中移除，图谱回到上一版本。`, '回滚确认', { type: 'warning', confirmButtonText: '确认回滚', cancelButtonText: '取消' })
        .then(() => {
        let removed = 0;
        batch.links.forEach((l) => {
            const source = `${l.upTable}.${l.upField}`;
            const target = `${l.downTable}.${l.downField}`;
            const idx = fieldLineage.findIndex((f) => f.source === source && f.target === target);
            if (idx >= 0) {
                fieldLineage.splice(idx, 1);
                removed++;
            }
        });
        batch.status = '已回滚';
        batch.rollbackTime = nowText();
        renderLineage();
        ElMessage.success(`已回滚，${removed} 条血缘已从图谱移除（Mock）`);
    })
        .catch(() => { });
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
const __VLS_24 = {}.ElTabPane;
/** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    label: "血缘明细",
    name: "detail",
}));
const __VLS_26 = __VLS_25({
    label: "血缘明细",
    name: "detail",
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
__VLS_27.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "lineage-detail-pane" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "lineage-toolbar" },
});
const __VLS_28 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
    modelValue: (__VLS_ctx.detailFilter),
    size: "small",
    ...{ class: "filter-select-sm" },
}));
const __VLS_30 = __VLS_29({
    modelValue: (__VLS_ctx.detailFilter),
    size: "small",
    ...{ class: "filter-select-sm" },
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
__VLS_31.slots.default;
const __VLS_32 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
    label: "全部目标表",
    value: "",
}));
const __VLS_34 = __VLS_33({
    label: "全部目标表",
    value: "",
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
for (const [t] of __VLS_getVForSourceType((__VLS_ctx.targetTables))) {
    const __VLS_36 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
        key: (t),
        label: (t),
        value: (t),
    }));
    const __VLS_38 = __VLS_37({
        key: (t),
        label: (t),
        value: (t),
    }, ...__VLS_functionalComponentArgsRest(__VLS_37));
}
var __VLS_31;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "dep-text" },
});
(__VLS_ctx.filteredDetails.length);
const __VLS_40 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
    data: (__VLS_ctx.filteredDetails),
    size: "small",
    stripe: true,
    height: "100%",
}));
const __VLS_42 = __VLS_41({
    data: (__VLS_ctx.filteredDetails),
    size: "small",
    stripe: true,
    height: "100%",
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
__VLS_43.slots.default;
const __VLS_44 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    label: "源字段",
    minWidth: "170",
}));
const __VLS_46 = __VLS_45({
    label: "源字段",
    minWidth: "170",
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
__VLS_47.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_47.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "field-source" },
    });
    (row.source);
}
var __VLS_47;
const __VLS_48 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
    label: "处理函数",
    width: "140",
}));
const __VLS_50 = __VLS_49({
    label: "处理函数",
    width: "140",
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
        type: "warning",
        effect: "plain",
    }));
    const __VLS_54 = __VLS_53({
        size: "small",
        type: "warning",
        effect: "plain",
    }, ...__VLS_functionalComponentArgsRest(__VLS_53));
    __VLS_55.slots.default;
    (row.func);
    var __VLS_55;
}
var __VLS_51;
const __VLS_56 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
    label: "目标字段",
    minWidth: "170",
}));
const __VLS_58 = __VLS_57({
    label: "目标字段",
    minWidth: "170",
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
__VLS_59.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_59.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "field-target" },
    });
    (row.target);
}
var __VLS_59;
const __VLS_60 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
    label: "数据量",
    width: "100",
    align: "right",
}));
const __VLS_62 = __VLS_61({
    label: "数据量",
    width: "100",
    align: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_61));
__VLS_63.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_63.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    (row.flowText);
}
var __VLS_63;
var __VLS_43;
var __VLS_27;
const __VLS_64 = {}.ElTabPane;
/** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
// @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
    label: "异常血缘追踪",
    name: "anomaly",
}));
const __VLS_66 = __VLS_65({
    label: "异常血缘追踪",
    name: "anomaly",
}, ...__VLS_functionalComponentArgsRest(__VLS_65));
__VLS_67.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "lineage-anomaly-pane" },
});
const __VLS_68 = {}.ElAlert;
/** @type {[typeof __VLS_components.ElAlert, typeof __VLS_components.elAlert, ]} */ ;
// @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
    title: "系统自动巡检血缘链路，标记断裂、循环、孤立、口径冲突与函数告警，供人工复核处理（Mock）",
    type: "warning",
    closable: (false),
    showIcon: true,
    ...{ class: "mb-12" },
}));
const __VLS_70 = __VLS_69({
    title: "系统自动巡检血缘链路，标记断裂、循环、孤立、口径冲突与函数告警，供人工复核处理（Mock）",
    type: "warning",
    closable: (false),
    showIcon: true,
    ...{ class: "mb-12" },
}, ...__VLS_functionalComponentArgsRest(__VLS_69));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "anomaly-list" },
});
for (const [item] of __VLS_getVForSourceType((__VLS_ctx.anomalies))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (item.text),
        ...{ class: "anomaly-item" },
    });
    const __VLS_72 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
        effect: "dark",
        type: (item.level),
        size: "small",
    }));
    const __VLS_74 = __VLS_73({
        effect: "dark",
        type: (item.level),
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_73));
    __VLS_75.slots.default;
    (item.type);
    var __VLS_75;
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
var __VLS_67;
const __VLS_76 = {}.ElTabPane;
/** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
// @ts-ignore
const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
    label: "血缘填报列表",
    name: "report",
}));
const __VLS_78 = __VLS_77({
    label: "血缘填报列表",
    name: "report",
}, ...__VLS_functionalComponentArgsRest(__VLS_77));
__VLS_79.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "report-pane" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "report-pane-toolbar" },
});
const __VLS_80 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
    ...{ 'onClick': {} },
    type: "danger",
    size: "small",
    icon: (__VLS_ctx.Connection),
}));
const __VLS_82 = __VLS_81({
    ...{ 'onClick': {} },
    type: "danger",
    size: "small",
    icon: (__VLS_ctx.Connection),
}, ...__VLS_functionalComponentArgsRest(__VLS_81));
let __VLS_84;
let __VLS_85;
let __VLS_86;
const __VLS_87 = {
    onClick: (__VLS_ctx.openLineageDialog)
};
__VLS_83.slots.default;
var __VLS_83;
const __VLS_88 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
    modelValue: (__VLS_ctx.batchKeyword),
    placeholder: "按填报单号 / 填报人 / 说明搜索",
    clearable: true,
    size: "small",
    ...{ class: "search-input-sm" },
    prefixIcon: (__VLS_ctx.Search),
}));
const __VLS_90 = __VLS_89({
    modelValue: (__VLS_ctx.batchKeyword),
    placeholder: "按填报单号 / 填报人 / 说明搜索",
    clearable: true,
    size: "small",
    ...{ class: "search-input-sm" },
    prefixIcon: (__VLS_ctx.Search),
}, ...__VLS_functionalComponentArgsRest(__VLS_89));
const __VLS_92 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
    modelValue: (__VLS_ctx.batchStatusFilter),
    placeholder: "状态",
    clearable: true,
    size: "small",
    ...{ class: "filter-select-sm" },
}));
const __VLS_94 = __VLS_93({
    modelValue: (__VLS_ctx.batchStatusFilter),
    placeholder: "状态",
    clearable: true,
    size: "small",
    ...{ class: "filter-select-sm" },
}, ...__VLS_functionalComponentArgsRest(__VLS_93));
__VLS_95.slots.default;
for (const [s] of __VLS_getVForSourceType((__VLS_ctx.batchStatusList))) {
    const __VLS_96 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
        key: (s),
        label: (s),
        value: (s),
    }));
    const __VLS_98 = __VLS_97({
        key: (s),
        label: (s),
        value: (s),
    }, ...__VLS_functionalComponentArgsRest(__VLS_97));
}
var __VLS_95;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "dep-text" },
});
(__VLS_ctx.filteredBatches.length);
(__VLS_ctx.passedBatches);
const __VLS_100 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
    data: (__VLS_ctx.filteredBatches),
    size: "small",
    stripe: true,
    ...{ class: "batch-table" },
}));
const __VLS_102 = __VLS_101({
    data: (__VLS_ctx.filteredBatches),
    size: "small",
    stripe: true,
    ...{ class: "batch-table" },
}, ...__VLS_functionalComponentArgsRest(__VLS_101));
__VLS_103.slots.default;
const __VLS_104 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
    type: "expand",
}));
const __VLS_106 = __VLS_105({
    type: "expand",
}, ...__VLS_functionalComponentArgsRest(__VLS_105));
__VLS_107.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_107.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "batch-detail" },
    });
    if (row.title) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "batch-detail-title" },
        });
        (row.title);
    }
    const __VLS_108 = {}.ElTable;
    /** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
    // @ts-ignore
    const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
        data: (row.links),
        size: "mini",
        border: true,
    }));
    const __VLS_110 = __VLS_109({
        data: (row.links),
        size: "mini",
        border: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_109));
    __VLS_111.slots.default;
    const __VLS_112 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
        label: "上游（表 · 字段）",
        minWidth: "190",
    }));
    const __VLS_114 = __VLS_113({
        label: "上游（表 · 字段）",
        minWidth: "190",
    }, ...__VLS_functionalComponentArgsRest(__VLS_113));
    __VLS_115.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_115.slots;
        const { row: l } = __VLS_getSlotParam(__VLS_thisSlot);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "field-source" },
        });
        (l.upTable);
        (l.upField);
    }
    var __VLS_115;
    const __VLS_116 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
        label: "处理函数",
        width: "130",
    }));
    const __VLS_118 = __VLS_117({
        label: "处理函数",
        width: "130",
    }, ...__VLS_functionalComponentArgsRest(__VLS_117));
    __VLS_119.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_119.slots;
        const { row: l } = __VLS_getSlotParam(__VLS_thisSlot);
        const __VLS_120 = {}.ElTag;
        /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
        // @ts-ignore
        const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({
            size: "small",
            type: "warning",
            effect: "plain",
        }));
        const __VLS_122 = __VLS_121({
            size: "small",
            type: "warning",
            effect: "plain",
        }, ...__VLS_functionalComponentArgsRest(__VLS_121));
        __VLS_123.slots.default;
        (l.func);
        var __VLS_123;
    }
    var __VLS_119;
    const __VLS_124 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({
        label: "下游（表 · 字段）",
        minWidth: "190",
    }));
    const __VLS_126 = __VLS_125({
        label: "下游（表 · 字段）",
        minWidth: "190",
    }, ...__VLS_functionalComponentArgsRest(__VLS_125));
    __VLS_127.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_127.slots;
        const { row: l } = __VLS_getSlotParam(__VLS_thisSlot);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "field-target" },
        });
        (l.downTable);
        (l.downField);
    }
    var __VLS_127;
    const __VLS_128 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({
        label: "校验",
        minWidth: "230",
    }));
    const __VLS_130 = __VLS_129({
        label: "校验",
        minWidth: "230",
    }, ...__VLS_functionalComponentArgsRest(__VLS_129));
    __VLS_131.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_131.slots;
        const { row: l } = __VLS_getSlotParam(__VLS_thisSlot);
        if (l.issues && l.issues.length) {
            for (const [it, i] of __VLS_getVForSourceType((l.issues))) {
                const __VLS_132 = {}.ElTag;
                /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
                // @ts-ignore
                const __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132({
                    key: (i),
                    size: "mini",
                    type: (it.level === 'error' ? 'danger' : 'warning'),
                    effect: "plain",
                    ...{ class: "mr-4" },
                }));
                const __VLS_134 = __VLS_133({
                    key: (i),
                    size: "mini",
                    type: (it.level === 'error' ? 'danger' : 'warning'),
                    effect: "plain",
                    ...{ class: "mr-4" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_133));
                __VLS_135.slots.default;
                (it.text);
                var __VLS_135;
            }
        }
        else {
            const __VLS_136 = {}.ElTag;
            /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
            // @ts-ignore
            const __VLS_137 = __VLS_asFunctionalComponent(__VLS_136, new __VLS_136({
                size: "mini",
                type: "success",
                effect: "plain",
            }));
            const __VLS_138 = __VLS_137({
                size: "mini",
                type: "success",
                effect: "plain",
            }, ...__VLS_functionalComponentArgsRest(__VLS_137));
            __VLS_139.slots.default;
            var __VLS_139;
        }
    }
    var __VLS_131;
    var __VLS_111;
}
var __VLS_107;
const __VLS_140 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_141 = __VLS_asFunctionalComponent(__VLS_140, new __VLS_140({
    prop: "id",
    label: "填报单号",
    width: "130",
}));
const __VLS_142 = __VLS_141({
    prop: "id",
    label: "填报单号",
    width: "130",
}, ...__VLS_functionalComponentArgsRest(__VLS_141));
const __VLS_144 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_145 = __VLS_asFunctionalComponent(__VLS_144, new __VLS_144({
    prop: "creator",
    label: "填报人",
    width: "76",
}));
const __VLS_146 = __VLS_145({
    prop: "creator",
    label: "填报人",
    width: "76",
}, ...__VLS_functionalComponentArgsRest(__VLS_145));
const __VLS_148 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_149 = __VLS_asFunctionalComponent(__VLS_148, new __VLS_148({
    prop: "createTime",
    label: "填报时间",
    width: "128",
}));
const __VLS_150 = __VLS_149({
    prop: "createTime",
    label: "填报时间",
    width: "128",
}, ...__VLS_functionalComponentArgsRest(__VLS_149));
const __VLS_152 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_153 = __VLS_asFunctionalComponent(__VLS_152, new __VLS_152({
    label: "连线数",
    width: "72",
    align: "center",
}));
const __VLS_154 = __VLS_153({
    label: "连线数",
    width: "72",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_153));
__VLS_155.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_155.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "dep-text" },
    });
    (row.links.length);
}
var __VLS_155;
const __VLS_156 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_157 = __VLS_asFunctionalComponent(__VLS_156, new __VLS_156({
    label: "校验结果",
    width: "106",
}));
const __VLS_158 = __VLS_157({
    label: "校验结果",
    width: "106",
}, ...__VLS_functionalComponentArgsRest(__VLS_157));
__VLS_159.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_159.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    if (row.errorCount === 0) {
        const __VLS_160 = {}.ElTag;
        /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
        // @ts-ignore
        const __VLS_161 = __VLS_asFunctionalComponent(__VLS_160, new __VLS_160({
            type: "success",
            effect: "dark",
            size: "small",
        }));
        const __VLS_162 = __VLS_161({
            type: "success",
            effect: "dark",
            size: "small",
        }, ...__VLS_functionalComponentArgsRest(__VLS_161));
        __VLS_163.slots.default;
        var __VLS_163;
    }
    else {
        const __VLS_164 = {}.ElTag;
        /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
        // @ts-ignore
        const __VLS_165 = __VLS_asFunctionalComponent(__VLS_164, new __VLS_164({
            type: "danger",
            effect: "dark",
            size: "small",
        }));
        const __VLS_166 = __VLS_165({
            type: "danger",
            effect: "dark",
            size: "small",
        }, ...__VLS_functionalComponentArgsRest(__VLS_165));
        __VLS_167.slots.default;
        (row.errorCount);
        var __VLS_167;
    }
}
var __VLS_159;
const __VLS_168 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_169 = __VLS_asFunctionalComponent(__VLS_168, new __VLS_168({
    label: "状态",
    width: "86",
}));
const __VLS_170 = __VLS_169({
    label: "状态",
    width: "86",
}, ...__VLS_functionalComponentArgsRest(__VLS_169));
__VLS_171.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_171.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_172 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_173 = __VLS_asFunctionalComponent(__VLS_172, new __VLS_172({
        type: (__VLS_ctx.batchStatusTag[row.status]),
        effect: "dark",
        size: "small",
    }));
    const __VLS_174 = __VLS_173({
        type: (__VLS_ctx.batchStatusTag[row.status]),
        effect: "dark",
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_173));
    __VLS_175.slots.default;
    (row.status);
    var __VLS_175;
}
var __VLS_171;
const __VLS_176 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_177 = __VLS_asFunctionalComponent(__VLS_176, new __VLS_176({
    label: "审批人 / 审批时间",
    minWidth: "150",
}));
const __VLS_178 = __VLS_177({
    label: "审批人 / 审批时间",
    minWidth: "150",
}, ...__VLS_functionalComponentArgsRest(__VLS_177));
__VLS_179.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_179.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "dep-text" },
    });
    (row.approver ? `${row.approver} · ${row.approveTime}` : '—');
}
var __VLS_179;
const __VLS_180 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_181 = __VLS_asFunctionalComponent(__VLS_180, new __VLS_180({
    label: "图谱版本",
    width: "84",
    align: "center",
}));
const __VLS_182 = __VLS_181({
    label: "图谱版本",
    width: "84",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_181));
__VLS_183.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_183.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "dep-text" },
    });
    (row.versionNo || '—');
}
var __VLS_183;
const __VLS_184 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_185 = __VLS_asFunctionalComponent(__VLS_184, new __VLS_184({
    label: "操作",
    width: "210",
    fixed: "right",
    align: "center",
}));
const __VLS_186 = __VLS_185({
    label: "操作",
    width: "210",
    fixed: "right",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_185));
__VLS_187.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_187.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    if (row.status === '草稿') {
        const __VLS_188 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_189 = __VLS_asFunctionalComponent(__VLS_188, new __VLS_188({
            ...{ 'onClick': {} },
            link: true,
            type: "primary",
            size: "small",
        }));
        const __VLS_190 = __VLS_189({
            ...{ 'onClick': {} },
            link: true,
            type: "primary",
            size: "small",
        }, ...__VLS_functionalComponentArgsRest(__VLS_189));
        let __VLS_192;
        let __VLS_193;
        let __VLS_194;
        const __VLS_195 = {
            onClick: (...[$event]) => {
                if (!(row.status === '草稿'))
                    return;
                __VLS_ctx.editBatch(row);
            }
        };
        __VLS_191.slots.default;
        var __VLS_191;
    }
    if (row.status === '草稿') {
        const __VLS_196 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_197 = __VLS_asFunctionalComponent(__VLS_196, new __VLS_196({
            ...{ 'onClick': {} },
            link: true,
            type: "warning",
            size: "small",
        }));
        const __VLS_198 = __VLS_197({
            ...{ 'onClick': {} },
            link: true,
            type: "warning",
            size: "small",
        }, ...__VLS_functionalComponentArgsRest(__VLS_197));
        let __VLS_200;
        let __VLS_201;
        let __VLS_202;
        const __VLS_203 = {
            onClick: (...[$event]) => {
                if (!(row.status === '草稿'))
                    return;
                __VLS_ctx.submitBatch(row);
            }
        };
        __VLS_199.slots.default;
        var __VLS_199;
    }
    if (row.status === '待审批') {
        const __VLS_204 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_205 = __VLS_asFunctionalComponent(__VLS_204, new __VLS_204({
            ...{ 'onClick': {} },
            link: true,
            type: "warning",
            size: "small",
        }));
        const __VLS_206 = __VLS_205({
            ...{ 'onClick': {} },
            link: true,
            type: "warning",
            size: "small",
        }, ...__VLS_functionalComponentArgsRest(__VLS_205));
        let __VLS_208;
        let __VLS_209;
        let __VLS_210;
        const __VLS_211 = {
            onClick: (...[$event]) => {
                if (!(row.status === '待审批'))
                    return;
                __VLS_ctx.openApproveDialog(row);
            }
        };
        __VLS_207.slots.default;
        var __VLS_207;
    }
    if (['已通过', '已回滚'].includes(row.status)) {
        const __VLS_212 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_213 = __VLS_asFunctionalComponent(__VLS_212, new __VLS_212({
            ...{ 'onClick': {} },
            link: true,
            type: "primary",
            size: "small",
        }));
        const __VLS_214 = __VLS_213({
            ...{ 'onClick': {} },
            link: true,
            type: "primary",
            size: "small",
        }, ...__VLS_functionalComponentArgsRest(__VLS_213));
        let __VLS_216;
        let __VLS_217;
        let __VLS_218;
        const __VLS_219 = {
            onClick: (...[$event]) => {
                if (!(['已通过', '已回滚'].includes(row.status)))
                    return;
                __VLS_ctx.openVersionCompare(row);
            }
        };
        __VLS_215.slots.default;
        var __VLS_215;
    }
    if (row.status === '已通过') {
        const __VLS_220 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_221 = __VLS_asFunctionalComponent(__VLS_220, new __VLS_220({
            ...{ 'onClick': {} },
            link: true,
            type: "danger",
            size: "small",
        }));
        const __VLS_222 = __VLS_221({
            ...{ 'onClick': {} },
            link: true,
            type: "danger",
            size: "small",
        }, ...__VLS_functionalComponentArgsRest(__VLS_221));
        let __VLS_224;
        let __VLS_225;
        let __VLS_226;
        const __VLS_227 = {
            onClick: (...[$event]) => {
                if (!(row.status === '已通过'))
                    return;
                __VLS_ctx.rollbackBatch(row);
            }
        };
        __VLS_223.slots.default;
        var __VLS_223;
    }
}
var __VLS_187;
var __VLS_103;
var __VLS_79;
var __VLS_3;
const __VLS_228 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_229 = __VLS_asFunctionalComponent(__VLS_228, new __VLS_228({
    modelValue: (__VLS_ctx.lineageDialogVisible),
    title: "血缘填报 · 拖拽连线",
    fullscreen: true,
    ...{ class: "lineage-report-dialog" },
    destroyOnClose: true,
}));
const __VLS_230 = __VLS_229({
    modelValue: (__VLS_ctx.lineageDialogVisible),
    title: "血缘填报 · 拖拽连线",
    fullscreen: true,
    ...{ class: "lineage-report-dialog" },
    destroyOnClose: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_229));
__VLS_231.slots.default;
const __VLS_232 = {}.ElAlert;
/** @type {[typeof __VLS_components.ElAlert, typeof __VLS_components.elAlert, typeof __VLS_components.ElAlert, typeof __VLS_components.elAlert, ]} */ ;
// @ts-ignore
const __VLS_233 = __VLS_asFunctionalComponent(__VLS_232, new __VLS_232({
    ...{ class: "report-hint" },
    type: "info",
    closable: (false),
    showIcon: true,
}));
const __VLS_234 = __VLS_233({
    ...{ class: "report-hint" },
    type: "info",
    closable: (false),
    showIcon: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_233));
__VLS_235.slots.default;
{
    const { title: __VLS_thisSlot } = __VLS_235.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "hint-strong" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "hint-strong" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "hint-strong" },
    });
}
var __VLS_235;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "report-title-row" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "dep-text" },
});
const __VLS_236 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_237 = __VLS_asFunctionalComponent(__VLS_236, new __VLS_236({
    modelValue: (__VLS_ctx.reportTitle),
    size: "small",
    placeholder: "本次填报的目的与说明（选填）",
}));
const __VLS_238 = __VLS_237({
    modelValue: (__VLS_ctx.reportTitle),
    size: "small",
    placeholder: "本次填报的目的与说明（选填）",
}, ...__VLS_functionalComponentArgsRest(__VLS_237));
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
const __VLS_240 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_241 = __VLS_asFunctionalComponent(__VLS_240, new __VLS_240({
    ...{ 'onRowClick': {} },
    data: (__VLS_ctx.reportLinks),
    size: "small",
    height: "176",
    highlightCurrentRow: true,
}));
const __VLS_242 = __VLS_241({
    ...{ 'onRowClick': {} },
    data: (__VLS_ctx.reportLinks),
    size: "small",
    height: "176",
    highlightCurrentRow: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_241));
let __VLS_244;
let __VLS_245;
let __VLS_246;
const __VLS_247 = {
    onRowClick: (__VLS_ctx.onRowClick)
};
__VLS_243.slots.default;
const __VLS_248 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_249 = __VLS_asFunctionalComponent(__VLS_248, new __VLS_248({
    label: "上游（数据库 · 表）",
    minWidth: "170",
}));
const __VLS_250 = __VLS_249({
    label: "上游（数据库 · 表）",
    minWidth: "170",
}, ...__VLS_functionalComponentArgsRest(__VLS_249));
__VLS_251.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_251.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "field-source" },
    });
    (row.upDb);
    (row.upTable);
}
var __VLS_251;
const __VLS_252 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_253 = __VLS_asFunctionalComponent(__VLS_252, new __VLS_252({
    label: "源字段",
    width: "120",
}));
const __VLS_254 = __VLS_253({
    label: "源字段",
    width: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_253));
__VLS_255.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_255.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_256 = {}.ElSelect;
    /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
    // @ts-ignore
    const __VLS_257 = __VLS_asFunctionalComponent(__VLS_256, new __VLS_256({
        ...{ 'onChange': {} },
        modelValue: (row.upField),
        size: "small",
        filterable: true,
        allowCreate: true,
        defaultFirstOption: true,
        placeholder: "选择 / 输入",
    }));
    const __VLS_258 = __VLS_257({
        ...{ 'onChange': {} },
        modelValue: (row.upField),
        size: "small",
        filterable: true,
        allowCreate: true,
        defaultFirstOption: true,
        placeholder: "选择 / 输入",
    }, ...__VLS_functionalComponentArgsRest(__VLS_257));
    let __VLS_260;
    let __VLS_261;
    let __VLS_262;
    const __VLS_263 = {
        onChange: (__VLS_ctx.validateReportLinks)
    };
    __VLS_259.slots.default;
    for (const [f] of __VLS_getVForSourceType((__VLS_ctx.fieldsOf(row.upTable)))) {
        const __VLS_264 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_265 = __VLS_asFunctionalComponent(__VLS_264, new __VLS_264({
            key: (f),
            label: (f),
            value: (f),
        }));
        const __VLS_266 = __VLS_265({
            key: (f),
            label: (f),
            value: (f),
        }, ...__VLS_functionalComponentArgsRest(__VLS_265));
    }
    var __VLS_259;
}
var __VLS_255;
const __VLS_268 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_269 = __VLS_asFunctionalComponent(__VLS_268, new __VLS_268({
    label: "处理函数",
    width: "140",
}));
const __VLS_270 = __VLS_269({
    label: "处理函数",
    width: "140",
}, ...__VLS_functionalComponentArgsRest(__VLS_269));
__VLS_271.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_271.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_272 = {}.ElSelect;
    /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
    // @ts-ignore
    const __VLS_273 = __VLS_asFunctionalComponent(__VLS_272, new __VLS_272({
        modelValue: (row.func),
        size: "small",
        filterable: true,
        allowCreate: true,
        defaultFirstOption: true,
    }));
    const __VLS_274 = __VLS_273({
        modelValue: (row.func),
        size: "small",
        filterable: true,
        allowCreate: true,
        defaultFirstOption: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_273));
    __VLS_275.slots.default;
    for (const [f] of __VLS_getVForSourceType((__VLS_ctx.funcOptions))) {
        const __VLS_276 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_277 = __VLS_asFunctionalComponent(__VLS_276, new __VLS_276({
            key: (f),
            label: (f),
            value: (f),
        }));
        const __VLS_278 = __VLS_277({
            key: (f),
            label: (f),
            value: (f),
        }, ...__VLS_functionalComponentArgsRest(__VLS_277));
    }
    var __VLS_275;
}
var __VLS_271;
const __VLS_280 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_281 = __VLS_asFunctionalComponent(__VLS_280, new __VLS_280({
    label: "目标字段",
    width: "120",
}));
const __VLS_282 = __VLS_281({
    label: "目标字段",
    width: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_281));
__VLS_283.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_283.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_284 = {}.ElSelect;
    /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
    // @ts-ignore
    const __VLS_285 = __VLS_asFunctionalComponent(__VLS_284, new __VLS_284({
        ...{ 'onChange': {} },
        modelValue: (row.downField),
        size: "small",
        filterable: true,
        allowCreate: true,
        defaultFirstOption: true,
        placeholder: "选择 / 输入",
    }));
    const __VLS_286 = __VLS_285({
        ...{ 'onChange': {} },
        modelValue: (row.downField),
        size: "small",
        filterable: true,
        allowCreate: true,
        defaultFirstOption: true,
        placeholder: "选择 / 输入",
    }, ...__VLS_functionalComponentArgsRest(__VLS_285));
    let __VLS_288;
    let __VLS_289;
    let __VLS_290;
    const __VLS_291 = {
        onChange: (__VLS_ctx.validateReportLinks)
    };
    __VLS_287.slots.default;
    for (const [f] of __VLS_getVForSourceType((__VLS_ctx.fieldsOf(row.downTable)))) {
        const __VLS_292 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_293 = __VLS_asFunctionalComponent(__VLS_292, new __VLS_292({
            key: (f),
            label: (f),
            value: (f),
        }));
        const __VLS_294 = __VLS_293({
            key: (f),
            label: (f),
            value: (f),
        }, ...__VLS_functionalComponentArgsRest(__VLS_293));
    }
    var __VLS_287;
}
var __VLS_283;
const __VLS_296 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_297 = __VLS_asFunctionalComponent(__VLS_296, new __VLS_296({
    label: "下游（数据库 · 表）",
    minWidth: "170",
}));
const __VLS_298 = __VLS_297({
    label: "下游（数据库 · 表）",
    minWidth: "170",
}, ...__VLS_functionalComponentArgsRest(__VLS_297));
__VLS_299.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_299.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "field-target" },
    });
    (row.downDb);
    (row.downTable);
}
var __VLS_299;
const __VLS_300 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_301 = __VLS_asFunctionalComponent(__VLS_300, new __VLS_300({
    label: "校验",
    width: "150",
}));
const __VLS_302 = __VLS_301({
    label: "校验",
    width: "150",
}, ...__VLS_functionalComponentArgsRest(__VLS_301));
__VLS_303.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_303.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_304 = {}.ElTooltip;
    /** @type {[typeof __VLS_components.ElTooltip, typeof __VLS_components.elTooltip, typeof __VLS_components.ElTooltip, typeof __VLS_components.elTooltip, ]} */ ;
    // @ts-ignore
    const __VLS_305 = __VLS_asFunctionalComponent(__VLS_304, new __VLS_304({
        disabled: (!row.issues || !row.issues.length),
        placement: "top",
    }));
    const __VLS_306 = __VLS_305({
        disabled: (!row.issues || !row.issues.length),
        placement: "top",
    }, ...__VLS_functionalComponentArgsRest(__VLS_305));
    __VLS_307.slots.default;
    {
        const { content: __VLS_thisSlot } = __VLS_307.slots;
        for (const [it, i] of __VLS_getVForSourceType((row.issues))) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                key: (i),
                ...{ class: "issue-line" },
                ...{ class: (it.level === 'error' ? 'issue-error' : 'issue-warn') },
            });
            (it.level === 'error' ? '✗' : '!');
            (it.text);
        }
    }
    if (__VLS_ctx.hasErrorIssue(row.issues)) {
        const __VLS_308 = {}.ElTag;
        /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
        // @ts-ignore
        const __VLS_309 = __VLS_asFunctionalComponent(__VLS_308, new __VLS_308({
            type: "danger",
            size: "small",
            effect: "dark",
        }));
        const __VLS_310 = __VLS_309({
            type: "danger",
            size: "small",
            effect: "dark",
        }, ...__VLS_functionalComponentArgsRest(__VLS_309));
        __VLS_311.slots.default;
        (__VLS_ctx.errorIssueCount(row.issues));
        var __VLS_311;
    }
    else if (__VLS_ctx.hasWarnIssue(row.issues)) {
        const __VLS_312 = {}.ElTag;
        /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
        // @ts-ignore
        const __VLS_313 = __VLS_asFunctionalComponent(__VLS_312, new __VLS_312({
            type: "warning",
            size: "small",
            effect: "plain",
        }));
        const __VLS_314 = __VLS_313({
            type: "warning",
            size: "small",
            effect: "plain",
        }, ...__VLS_functionalComponentArgsRest(__VLS_313));
        __VLS_315.slots.default;
        var __VLS_315;
    }
    else {
        const __VLS_316 = {}.ElTag;
        /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
        // @ts-ignore
        const __VLS_317 = __VLS_asFunctionalComponent(__VLS_316, new __VLS_316({
            type: "success",
            size: "small",
            effect: "plain",
        }));
        const __VLS_318 = __VLS_317({
            type: "success",
            size: "small",
            effect: "plain",
        }, ...__VLS_functionalComponentArgsRest(__VLS_317));
        __VLS_319.slots.default;
        var __VLS_319;
    }
    var __VLS_307;
}
var __VLS_303;
const __VLS_320 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_321 = __VLS_asFunctionalComponent(__VLS_320, new __VLS_320({
    label: "操作",
    width: "64",
    align: "center",
}));
const __VLS_322 = __VLS_321({
    label: "操作",
    width: "64",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_321));
__VLS_323.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_323.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_324 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_325 = __VLS_asFunctionalComponent(__VLS_324, new __VLS_324({
        ...{ 'onClick': {} },
        type: "danger",
        link: true,
        icon: (__VLS_ctx.Delete),
    }));
    const __VLS_326 = __VLS_325({
        ...{ 'onClick': {} },
        type: "danger",
        link: true,
        icon: (__VLS_ctx.Delete),
    }, ...__VLS_functionalComponentArgsRest(__VLS_325));
    let __VLS_328;
    let __VLS_329;
    let __VLS_330;
    const __VLS_331 = {
        onClick: (...[$event]) => {
            __VLS_ctx.removeLink(row.id);
        }
    };
    var __VLS_327;
}
var __VLS_323;
var __VLS_243;
{
    const { footer: __VLS_thisSlot } = __VLS_231.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "report-footer" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "report-count" },
    });
    (__VLS_ctx.reportLinks.length);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: (__VLS_ctx.batchErrorCount > 0 ? 'issue-error' : 'trend-positive') },
    });
    (__VLS_ctx.batchErrorCount > 0 ? `${__VLS_ctx.batchErrorCount} 项异常` : '全部通过');
    const __VLS_332 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_333 = __VLS_asFunctionalComponent(__VLS_332, new __VLS_332({
        ...{ 'onClick': {} },
        size: "small",
    }));
    const __VLS_334 = __VLS_333({
        ...{ 'onClick': {} },
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_333));
    let __VLS_336;
    let __VLS_337;
    let __VLS_338;
    const __VLS_339 = {
        onClick: (__VLS_ctx.resetBuilder)
    };
    __VLS_335.slots.default;
    var __VLS_335;
    const __VLS_340 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_341 = __VLS_asFunctionalComponent(__VLS_340, new __VLS_340({
        ...{ 'onClick': {} },
        size: "small",
    }));
    const __VLS_342 = __VLS_341({
        ...{ 'onClick': {} },
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_341));
    let __VLS_344;
    let __VLS_345;
    let __VLS_346;
    const __VLS_347 = {
        onClick: (...[$event]) => {
            __VLS_ctx.lineageDialogVisible = false;
        }
    };
    __VLS_343.slots.default;
    var __VLS_343;
    const __VLS_348 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_349 = __VLS_asFunctionalComponent(__VLS_348, new __VLS_348({
        ...{ 'onClick': {} },
        size: "small",
        type: "primary",
    }));
    const __VLS_350 = __VLS_349({
        ...{ 'onClick': {} },
        size: "small",
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_349));
    let __VLS_352;
    let __VLS_353;
    let __VLS_354;
    const __VLS_355 = {
        onClick: (...[$event]) => {
            __VLS_ctx.saveBatch('草稿');
        }
    };
    __VLS_351.slots.default;
    var __VLS_351;
    const __VLS_356 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_357 = __VLS_asFunctionalComponent(__VLS_356, new __VLS_356({
        ...{ 'onClick': {} },
        type: "danger",
        size: "small",
        disabled: (__VLS_ctx.batchErrorCount > 0),
    }));
    const __VLS_358 = __VLS_357({
        ...{ 'onClick': {} },
        type: "danger",
        size: "small",
        disabled: (__VLS_ctx.batchErrorCount > 0),
    }, ...__VLS_functionalComponentArgsRest(__VLS_357));
    let __VLS_360;
    let __VLS_361;
    let __VLS_362;
    const __VLS_363 = {
        onClick: (...[$event]) => {
            __VLS_ctx.saveBatch('待审批');
        }
    };
    __VLS_359.slots.default;
    var __VLS_359;
}
var __VLS_231;
const __VLS_364 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_365 = __VLS_asFunctionalComponent(__VLS_364, new __VLS_364({
    modelValue: (__VLS_ctx.approveVisible),
    title: "血缘填报审批",
    width: "680px",
    ...{ class: "batch-approve-dialog" },
    destroyOnClose: true,
}));
const __VLS_366 = __VLS_365({
    modelValue: (__VLS_ctx.approveVisible),
    title: "血缘填报审批",
    width: "680px",
    ...{ class: "batch-approve-dialog" },
    destroyOnClose: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_365));
__VLS_367.slots.default;
if (__VLS_ctx.approveTarget) {
    const __VLS_368 = {}.ElDescriptions;
    /** @type {[typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, ]} */ ;
    // @ts-ignore
    const __VLS_369 = __VLS_asFunctionalComponent(__VLS_368, new __VLS_368({
        column: (2),
        border: true,
        size: "small",
    }));
    const __VLS_370 = __VLS_369({
        column: (2),
        border: true,
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_369));
    __VLS_371.slots.default;
    const __VLS_372 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_373 = __VLS_asFunctionalComponent(__VLS_372, new __VLS_372({
        label: "填报单号",
    }));
    const __VLS_374 = __VLS_373({
        label: "填报单号",
    }, ...__VLS_functionalComponentArgsRest(__VLS_373));
    __VLS_375.slots.default;
    (__VLS_ctx.approveTarget.id);
    var __VLS_375;
    const __VLS_376 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_377 = __VLS_asFunctionalComponent(__VLS_376, new __VLS_376({
        label: "填报人",
    }));
    const __VLS_378 = __VLS_377({
        label: "填报人",
    }, ...__VLS_functionalComponentArgsRest(__VLS_377));
    __VLS_379.slots.default;
    (__VLS_ctx.approveTarget.creator);
    var __VLS_379;
    const __VLS_380 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_381 = __VLS_asFunctionalComponent(__VLS_380, new __VLS_380({
        label: "填报时间",
        span: (1),
    }));
    const __VLS_382 = __VLS_381({
        label: "填报时间",
        span: (1),
    }, ...__VLS_functionalComponentArgsRest(__VLS_381));
    __VLS_383.slots.default;
    (__VLS_ctx.approveTarget.createTime);
    var __VLS_383;
    const __VLS_384 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_385 = __VLS_asFunctionalComponent(__VLS_384, new __VLS_384({
        label: "连线数量",
    }));
    const __VLS_386 = __VLS_385({
        label: "连线数量",
    }, ...__VLS_functionalComponentArgsRest(__VLS_385));
    __VLS_387.slots.default;
    (__VLS_ctx.approveTarget.links.length);
    var __VLS_387;
    const __VLS_388 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_389 = __VLS_asFunctionalComponent(__VLS_388, new __VLS_388({
        label: "校验结果",
        span: (2),
    }));
    const __VLS_390 = __VLS_389({
        label: "校验结果",
        span: (2),
    }, ...__VLS_functionalComponentArgsRest(__VLS_389));
    __VLS_391.slots.default;
    const __VLS_392 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_393 = __VLS_asFunctionalComponent(__VLS_392, new __VLS_392({
        size: "small",
        type: (__VLS_ctx.approveTarget.errorCount === 0 ? 'success' : 'danger'),
        effect: "dark",
    }));
    const __VLS_394 = __VLS_393({
        size: "small",
        type: (__VLS_ctx.approveTarget.errorCount === 0 ? 'success' : 'danger'),
        effect: "dark",
    }, ...__VLS_functionalComponentArgsRest(__VLS_393));
    __VLS_395.slots.default;
    (__VLS_ctx.approveTarget.errorCount === 0 ? '校验通过' : `${__VLS_ctx.approveTarget.errorCount} 项异常`);
    var __VLS_395;
    var __VLS_391;
    var __VLS_371;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "block-title" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "approve-links" },
    });
    for (const [l] of __VLS_getVForSourceType((__VLS_ctx.approveTarget.links))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            key: (l.id),
            ...{ class: "approve-link-item" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "field-source" },
        });
        (l.upTable);
        (l.upField);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "dep-text" },
        });
        (l.func);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "field-target" },
        });
        (l.downTable);
        (l.downField);
    }
    const __VLS_396 = {}.ElForm;
    /** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
    // @ts-ignore
    const __VLS_397 = __VLS_asFunctionalComponent(__VLS_396, new __VLS_396({
        labelWidth: "84px",
        ...{ class: "approve-form" },
    }));
    const __VLS_398 = __VLS_397({
        labelWidth: "84px",
        ...{ class: "approve-form" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_397));
    __VLS_399.slots.default;
    const __VLS_400 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_401 = __VLS_asFunctionalComponent(__VLS_400, new __VLS_400({
        label: "审批人",
    }));
    const __VLS_402 = __VLS_401({
        label: "审批人",
    }, ...__VLS_functionalComponentArgsRest(__VLS_401));
    __VLS_403.slots.default;
    const __VLS_404 = {}.ElSelect;
    /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
    // @ts-ignore
    const __VLS_405 = __VLS_asFunctionalComponent(__VLS_404, new __VLS_404({
        modelValue: (__VLS_ctx.approveForm.approver),
        ...{ class: "w-full" },
    }));
    const __VLS_406 = __VLS_405({
        modelValue: (__VLS_ctx.approveForm.approver),
        ...{ class: "w-full" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_405));
    __VLS_407.slots.default;
    for (const [a] of __VLS_getVForSourceType((__VLS_ctx.approverPool))) {
        const __VLS_408 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_409 = __VLS_asFunctionalComponent(__VLS_408, new __VLS_408({
            key: (a),
            label: (a),
            value: (a),
        }));
        const __VLS_410 = __VLS_409({
            key: (a),
            label: (a),
            value: (a),
        }, ...__VLS_functionalComponentArgsRest(__VLS_409));
    }
    var __VLS_407;
    var __VLS_403;
    const __VLS_412 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_413 = __VLS_asFunctionalComponent(__VLS_412, new __VLS_412({
        label: "审批意见",
    }));
    const __VLS_414 = __VLS_413({
        label: "审批意见",
    }, ...__VLS_functionalComponentArgsRest(__VLS_413));
    __VLS_415.slots.default;
    const __VLS_416 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_417 = __VLS_asFunctionalComponent(__VLS_416, new __VLS_416({
        modelValue: (__VLS_ctx.approveForm.comment),
        type: "textarea",
        rows: (3),
        placeholder: "请填写审批意见（必填）",
    }));
    const __VLS_418 = __VLS_417({
        modelValue: (__VLS_ctx.approveForm.comment),
        type: "textarea",
        rows: (3),
        placeholder: "请填写审批意见（必填）",
    }, ...__VLS_functionalComponentArgsRest(__VLS_417));
    var __VLS_415;
    var __VLS_399;
}
{
    const { footer: __VLS_thisSlot } = __VLS_367.slots;
    const __VLS_420 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_421 = __VLS_asFunctionalComponent(__VLS_420, new __VLS_420({
        ...{ 'onClick': {} },
    }));
    const __VLS_422 = __VLS_421({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_421));
    let __VLS_424;
    let __VLS_425;
    let __VLS_426;
    const __VLS_427 = {
        onClick: (...[$event]) => {
            __VLS_ctx.approveVisible = false;
        }
    };
    __VLS_423.slots.default;
    var __VLS_423;
    const __VLS_428 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_429 = __VLS_asFunctionalComponent(__VLS_428, new __VLS_428({
        ...{ 'onClick': {} },
        type: "danger",
    }));
    const __VLS_430 = __VLS_429({
        ...{ 'onClick': {} },
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_429));
    let __VLS_432;
    let __VLS_433;
    let __VLS_434;
    const __VLS_435 = {
        onClick: (...[$event]) => {
            __VLS_ctx.doApprove(false);
        }
    };
    __VLS_431.slots.default;
    var __VLS_431;
    const __VLS_436 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_437 = __VLS_asFunctionalComponent(__VLS_436, new __VLS_436({
        ...{ 'onClick': {} },
        type: "primary",
    }));
    const __VLS_438 = __VLS_437({
        ...{ 'onClick': {} },
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_437));
    let __VLS_440;
    let __VLS_441;
    let __VLS_442;
    const __VLS_443 = {
        onClick: (...[$event]) => {
            __VLS_ctx.doApprove(true);
        }
    };
    __VLS_439.slots.default;
    var __VLS_439;
}
var __VLS_367;
const __VLS_444 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_445 = __VLS_asFunctionalComponent(__VLS_444, new __VLS_444({
    modelValue: (__VLS_ctx.compareVisible),
    title: "填报版本对比",
    width: "720px",
    ...{ class: "version-compare-dialog" },
    destroyOnClose: true,
}));
const __VLS_446 = __VLS_445({
    modelValue: (__VLS_ctx.compareVisible),
    title: "填报版本对比",
    width: "720px",
    ...{ class: "version-compare-dialog" },
    destroyOnClose: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_445));
__VLS_447.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "compare-bar" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "dep-text" },
});
const __VLS_448 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_449 = __VLS_asFunctionalComponent(__VLS_448, new __VLS_448({
    modelValue: (__VLS_ctx.compareBase),
    size: "small",
    ...{ class: "filter-select-sm" },
    filterable: true,
}));
const __VLS_450 = __VLS_449({
    modelValue: (__VLS_ctx.compareBase),
    size: "small",
    ...{ class: "filter-select-sm" },
    filterable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_449));
__VLS_451.slots.default;
for (const [v] of __VLS_getVForSourceType((__VLS_ctx.compareOptions))) {
    const __VLS_452 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_453 = __VLS_asFunctionalComponent(__VLS_452, new __VLS_452({
        key: (v.value),
        label: (v.label),
        value: (v.value),
    }));
    const __VLS_454 = __VLS_453({
        key: (v.value),
        label: (v.label),
        value: (v.value),
    }, ...__VLS_functionalComponentArgsRest(__VLS_453));
}
var __VLS_451;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "dep-text" },
});
const __VLS_456 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_457 = __VLS_asFunctionalComponent(__VLS_456, new __VLS_456({
    modelValue: (__VLS_ctx.compareTarget),
    size: "small",
    ...{ class: "filter-select-sm" },
    filterable: true,
}));
const __VLS_458 = __VLS_457({
    modelValue: (__VLS_ctx.compareTarget),
    size: "small",
    ...{ class: "filter-select-sm" },
    filterable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_457));
__VLS_459.slots.default;
for (const [v] of __VLS_getVForSourceType((__VLS_ctx.compareOptions))) {
    const __VLS_460 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_461 = __VLS_asFunctionalComponent(__VLS_460, new __VLS_460({
        key: (v.value),
        label: (v.label),
        value: (v.value),
    }));
    const __VLS_462 = __VLS_461({
        key: (v.value),
        label: (v.label),
        value: (v.value),
    }, ...__VLS_functionalComponentArgsRest(__VLS_461));
}
var __VLS_459;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "compare-summary" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.b, __VLS_intrinsicElements.b)({
    ...{ class: "issue-error" },
});
(__VLS_ctx.diffResult.added.length);
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.b, __VLS_intrinsicElements.b)({
    ...{ class: "dep-text" },
});
(__VLS_ctx.diffResult.removed.length);
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.b, __VLS_intrinsicElements.b)({
    ...{ class: "trend-positive" },
});
(__VLS_ctx.diffResult.common);
const __VLS_464 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_465 = __VLS_asFunctionalComponent(__VLS_464, new __VLS_464({
    data: (__VLS_ctx.diffRows),
    size: "small",
    maxHeight: "380",
    stripe: true,
}));
const __VLS_466 = __VLS_465({
    data: (__VLS_ctx.diffRows),
    size: "small",
    maxHeight: "380",
    stripe: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_465));
__VLS_467.slots.default;
const __VLS_468 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_469 = __VLS_asFunctionalComponent(__VLS_468, new __VLS_468({
    label: "变更",
    width: "70",
    align: "center",
}));
const __VLS_470 = __VLS_469({
    label: "变更",
    width: "70",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_469));
__VLS_471.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_471.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_472 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_473 = __VLS_asFunctionalComponent(__VLS_472, new __VLS_472({
        size: "small",
        type: (row.change === '新增' ? 'danger' : row.change === '移除' ? 'info' : 'success'),
        effect: "dark",
    }));
    const __VLS_474 = __VLS_473({
        size: "small",
        type: (row.change === '新增' ? 'danger' : row.change === '移除' ? 'info' : 'success'),
        effect: "dark",
    }, ...__VLS_functionalComponentArgsRest(__VLS_473));
    __VLS_475.slots.default;
    (row.change);
    var __VLS_475;
}
var __VLS_471;
const __VLS_476 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_477 = __VLS_asFunctionalComponent(__VLS_476, new __VLS_476({
    label: "上游（表 · 字段）",
    minWidth: "210",
}));
const __VLS_478 = __VLS_477({
    label: "上游（表 · 字段）",
    minWidth: "210",
}, ...__VLS_functionalComponentArgsRest(__VLS_477));
__VLS_479.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_479.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "field-source" },
    });
    (row.source);
}
var __VLS_479;
const __VLS_480 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_481 = __VLS_asFunctionalComponent(__VLS_480, new __VLS_480({
    label: "处理函数",
    width: "140",
}));
const __VLS_482 = __VLS_481({
    label: "处理函数",
    width: "140",
}, ...__VLS_functionalComponentArgsRest(__VLS_481));
__VLS_483.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_483.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_484 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_485 = __VLS_asFunctionalComponent(__VLS_484, new __VLS_484({
        size: "small",
        type: "warning",
        effect: "plain",
    }));
    const __VLS_486 = __VLS_485({
        size: "small",
        type: "warning",
        effect: "plain",
    }, ...__VLS_functionalComponentArgsRest(__VLS_485));
    __VLS_487.slots.default;
    (row.func);
    var __VLS_487;
}
var __VLS_483;
const __VLS_488 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_489 = __VLS_asFunctionalComponent(__VLS_488, new __VLS_488({
    label: "下游（表 · 字段）",
    minWidth: "210",
}));
const __VLS_490 = __VLS_489({
    label: "下游（表 · 字段）",
    minWidth: "210",
}, ...__VLS_functionalComponentArgsRest(__VLS_489));
__VLS_491.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_491.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "field-target" },
    });
    (row.target);
}
var __VLS_491;
var __VLS_467;
{
    const { footer: __VLS_thisSlot } = __VLS_447.slots;
    const __VLS_492 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_493 = __VLS_asFunctionalComponent(__VLS_492, new __VLS_492({
        ...{ 'onClick': {} },
        type: "primary",
        plain: true,
    }));
    const __VLS_494 = __VLS_493({
        ...{ 'onClick': {} },
        type: "primary",
        plain: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_493));
    let __VLS_496;
    let __VLS_497;
    let __VLS_498;
    const __VLS_499 = {
        onClick: (...[$event]) => {
            __VLS_ctx.compareVisible = false;
        }
    };
    __VLS_495.slots.default;
    var __VLS_495;
}
var __VLS_447;
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
/** @type {__VLS_StyleScopedClasses['report-pane']} */ ;
/** @type {__VLS_StyleScopedClasses['report-pane-toolbar']} */ ;
/** @type {__VLS_StyleScopedClasses['search-input-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-select-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['dep-text']} */ ;
/** @type {__VLS_StyleScopedClasses['batch-table']} */ ;
/** @type {__VLS_StyleScopedClasses['batch-detail']} */ ;
/** @type {__VLS_StyleScopedClasses['batch-detail-title']} */ ;
/** @type {__VLS_StyleScopedClasses['field-source']} */ ;
/** @type {__VLS_StyleScopedClasses['field-target']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
/** @type {__VLS_StyleScopedClasses['dep-text']} */ ;
/** @type {__VLS_StyleScopedClasses['dep-text']} */ ;
/** @type {__VLS_StyleScopedClasses['dep-text']} */ ;
/** @type {__VLS_StyleScopedClasses['lineage-report-dialog']} */ ;
/** @type {__VLS_StyleScopedClasses['report-hint']} */ ;
/** @type {__VLS_StyleScopedClasses['hint-strong']} */ ;
/** @type {__VLS_StyleScopedClasses['hint-strong']} */ ;
/** @type {__VLS_StyleScopedClasses['hint-strong']} */ ;
/** @type {__VLS_StyleScopedClasses['report-title-row']} */ ;
/** @type {__VLS_StyleScopedClasses['dep-text']} */ ;
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
/** @type {__VLS_StyleScopedClasses['issue-line']} */ ;
/** @type {__VLS_StyleScopedClasses['report-footer']} */ ;
/** @type {__VLS_StyleScopedClasses['report-count']} */ ;
/** @type {__VLS_StyleScopedClasses['batch-approve-dialog']} */ ;
/** @type {__VLS_StyleScopedClasses['block-title']} */ ;
/** @type {__VLS_StyleScopedClasses['approve-links']} */ ;
/** @type {__VLS_StyleScopedClasses['approve-link-item']} */ ;
/** @type {__VLS_StyleScopedClasses['field-source']} */ ;
/** @type {__VLS_StyleScopedClasses['dep-text']} */ ;
/** @type {__VLS_StyleScopedClasses['field-target']} */ ;
/** @type {__VLS_StyleScopedClasses['approve-form']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['version-compare-dialog']} */ ;
/** @type {__VLS_StyleScopedClasses['compare-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['dep-text']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-select-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['dep-text']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-select-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['compare-summary']} */ ;
/** @type {__VLS_StyleScopedClasses['issue-error']} */ ;
/** @type {__VLS_StyleScopedClasses['dep-text']} */ ;
/** @type {__VLS_StyleScopedClasses['trend-positive']} */ ;
/** @type {__VLS_StyleScopedClasses['field-source']} */ ;
/** @type {__VLS_StyleScopedClasses['field-target']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Connection: Connection,
            Delete: Delete,
            Search: Search,
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
            editBatch: editBatch,
            resetBuilder: resetBuilder,
            removeLink: removeLink,
            onRowClick: onRowClick,
            fieldsOf: fieldsOf,
            reportTitle: reportTitle,
            batchErrorCount: batchErrorCount,
            errorIssueCount: errorIssueCount,
            hasErrorIssue: hasErrorIssue,
            hasWarnIssue: hasWarnIssue,
            validateReportLinks: validateReportLinks,
            saveBatch: saveBatch,
            batchStatusList: batchStatusList,
            batchStatusTag: batchStatusTag,
            batchKeyword: batchKeyword,
            batchStatusFilter: batchStatusFilter,
            filteredBatches: filteredBatches,
            passedBatches: passedBatches,
            submitBatch: submitBatch,
            approveVisible: approveVisible,
            approveTarget: approveTarget,
            approverPool: approverPool,
            approveForm: approveForm,
            openApproveDialog: openApproveDialog,
            doApprove: doApprove,
            compareVisible: compareVisible,
            compareBase: compareBase,
            compareTarget: compareTarget,
            compareOptions: compareOptions,
            openVersionCompare: openVersionCompare,
            diffResult: diffResult,
            diffRows: diffRows,
            rollbackBatch: rollbackBatch,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
