import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { Download, Share } from '@element-plus/icons-vue';
import * as echarts from 'echarts';
const tablePool = ['ticket_sale_detail', 'passenger_info', 'flow_stat_daily', 'device_status_log', 'station_info', 'train_operation_log', 'line_info'];
const relations = [
    ['passenger_info', 'ticket_sale_detail'],
    ['station_info', 'flow_stat_daily'],
    ['device_status_log', 'flow_stat_daily'],
    ['ticket_sale_detail', 'flow_stat_daily'],
    ['ticket_sale_detail', 'train_operation_log'],
    ['flow_stat_daily', 'train_operation_log'],
    ['line_info', 'station_info'],
    ['line_info', 'train_operation_log'],
    ['device_status_log', 'train_operation_log'],
];
const viewMode = ref('正向影响');
const selectedTable = ref('ticket_sale_detail');
const lineageChartRef = ref();
let chart = null;
const anomalies = [
    { type: '环状依赖', name: 'flow_stat_daily ⇄ train_operation_log', note: '存在循环引用' },
    { type: '孤立节点', name: 'station_info', note: '无上游血缘', extra: true },
];
const upstreamCount = computed(() => relations.filter(([from, to]) => to === selectedTable.value).length);
const downstreamCount = computed(() => relations.filter(([from, to]) => from === selectedTable.value).length);
const depth = computed(() => 3);
const renderLineage = () => {
    if (!lineageChartRef.value)
        return;
    chart?.dispose();
    chart = echarts.init(lineageChartRef.value);
    const current = selectedTable.value;
    const upStreams = relations.filter(([, to]) => to === current).map(([from]) => from);
    const downStreams = relations.filter(([from]) => from === current).map(([, to]) => to);
    const nodes = [];
    const links = [];
    const nodeSet = new Set();
    const addNode = (name, category) => {
        if (nodeSet.has(name))
            return;
        nodeSet.add(name);
        nodes.push({ name, category, symbolSize: name === current ? 54 : 38 });
    };
    const addLink = (source, target, category) => {
        links.push({
            source,
            target,
            lineStyle: { color: category === 1 ? '#2B6CB0' : category === 2 ? '#00A854' : '#C0C4CC', width: category === 0 ? 3 : 2 },
        });
    };
    addNode(current, 0);
    if (viewMode.value === '反向溯源' || viewMode.value === '全部关系') {
        upStreams.forEach((name) => {
            addNode(name, 1);
            addLink(name, current, 1);
        });
    }
    if (viewMode.value === '正向影响' || viewMode.value === '全部关系') {
        downStreams.forEach((name) => {
            addNode(name, 2);
            addLink(current, name, 2);
        });
    }
    if (viewMode.value === '全部关系') {
        nodes.push({ name: 'cycle-node', category: 3, symbolSize: 26 });
        links.push({ source: 'device_status_log', target: 'cycle-node', lineStyle: { color: '#ED7B2F', width: 2, type: 'dashed' } });
        nodes.push({ name: 'isolated-node', category: 3, symbolSize: 22 });
    }
    chart.setOption({
        tooltip: {
            formatter: (params) => params.dataType === 'edge' ? '' : `表：${params.data?.name}`,
        },
        legend: { show: false },
        animationDurationUpdate: 500,
        series: [
            {
                type: 'graph',
                layout: 'force',
                roam: true,
                draggable: true,
                data: nodes,
                links,
                categories: [
                    { name: '当前表', itemStyle: { color: '#DA251D' } },
                    { name: '上游', itemStyle: { color: '#2B6CB0' } },
                    { name: '下游', itemStyle: { color: '#00A854' } },
                    { name: '异常', itemStyle: { color: '#ED7B2F', opacity: 0.7 } },
                ],
                force: { repulsion: 480, edgeLength: [100, 180], gravity: 0.12 },
                label: {
                    show: true,
                    position: 'bottom',
                    fontSize: 11,
                    color: '#4a4a4a',
                    formatter: (params) => {
                        if (params.name === 'cycle-node')
                            return '环状依赖';
                        if (params.name === 'isolated-node')
                            return '孤立节点';
                        return params.name;
                    },
                },
                lineStyle: { curveness: 0.15, width: 2 },
                emphasis: { focus: 'adjacency', lineStyle: { width: 4 } },
                itemStyle: { borderColor: '#fff', borderWidth: 2 },
            },
        ],
    });
    const instance = chart;
    instance.on('click', (params) => {
        const data = params.data;
        if (data?.name && tablePool.includes(data.name) && data.name !== current) {
            selectedTable.value = data.name;
            renderLineage();
        }
    });
};
const autoDiscover = () => ElMessage.success('血缘自动发现完成：新增 5 条血缘关系（Mock）');
const manualLink = () => ElMessage.info('已打开血缘手动维护编辑器（Mock）');
const removeNode = () => ElMessage.info('请在图谱中选择要删除的节点（Mock）');
const exportLineage = () => ElMessage.success('血缘关系已导出为 JSON / Excel（Mock）');
const handleResize = () => chart?.resize();
onMounted(() => {
    renderLineage();
    window.addEventListener('resize', handleResize);
});
onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize);
    chart?.dispose();
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
    span: (16),
}));
const __VLS_6 = __VLS_5({
    span: (16),
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
    const __VLS_12 = {}.ElRadioGroup;
    /** @type {[typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, ]} */ ;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
        modelValue: (__VLS_ctx.viewMode),
        size: "small",
    }));
    const __VLS_14 = __VLS_13({
        modelValue: (__VLS_ctx.viewMode),
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_13));
    __VLS_15.slots.default;
    const __VLS_16 = {}.ElRadioButton;
    /** @type {[typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, ]} */ ;
    // @ts-ignore
    const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
        label: "正向影响",
    }));
    const __VLS_18 = __VLS_17({
        label: "正向影响",
    }, ...__VLS_functionalComponentArgsRest(__VLS_17));
    __VLS_19.slots.default;
    var __VLS_19;
    const __VLS_20 = {}.ElRadioButton;
    /** @type {[typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, ]} */ ;
    // @ts-ignore
    const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
        label: "反向溯源",
    }));
    const __VLS_22 = __VLS_21({
        label: "反向溯源",
    }, ...__VLS_functionalComponentArgsRest(__VLS_21));
    __VLS_23.slots.default;
    var __VLS_23;
    const __VLS_24 = {}.ElRadioButton;
    /** @type {[typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, ]} */ ;
    // @ts-ignore
    const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
        label: "全部关系",
    }));
    const __VLS_26 = __VLS_25({
        label: "全部关系",
    }, ...__VLS_functionalComponentArgsRest(__VLS_25));
    __VLS_27.slots.default;
    var __VLS_27;
    var __VLS_15;
    const __VLS_28 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
        ...{ 'onClick': {} },
        type: "danger",
        size: "small",
        icon: (__VLS_ctx.Download),
    }));
    const __VLS_30 = __VLS_29({
        ...{ 'onClick': {} },
        type: "danger",
        size: "small",
        icon: (__VLS_ctx.Download),
    }, ...__VLS_functionalComponentArgsRest(__VLS_29));
    let __VLS_32;
    let __VLS_33;
    let __VLS_34;
    const __VLS_35 = {
        onClick: (__VLS_ctx.exportLineage)
    };
    __VLS_31.slots.default;
    var __VLS_31;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ref: "lineageChartRef",
    ...{ class: "lineage-chart" },
});
/** @type {typeof __VLS_ctx.lineageChartRef} */ ;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "lineage-legend" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.i, __VLS_intrinsicElements.i)({
    ...{ class: "legend-dot" },
    ...{ style: {} },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.i, __VLS_intrinsicElements.i)({
    ...{ class: "legend-dot" },
    ...{ style: {} },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.i, __VLS_intrinsicElements.i)({
    ...{ class: "legend-dot" },
    ...{ style: {} },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.i, __VLS_intrinsicElements.i)({
    ...{ class: "legend-dot" },
    ...{ style: {} },
});
var __VLS_11;
var __VLS_7;
const __VLS_36 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    span: (8),
}));
const __VLS_38 = __VLS_37({
    span: (8),
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
const __VLS_44 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.selectedTable),
    filterable: true,
    ...{ class: "w-full" },
}));
const __VLS_46 = __VLS_45({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.selectedTable),
    filterable: true,
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
let __VLS_48;
let __VLS_49;
let __VLS_50;
const __VLS_51 = {
    onChange: (__VLS_ctx.renderLineage)
};
__VLS_47.slots.default;
for (const [table] of __VLS_getVForSourceType((__VLS_ctx.tablePool))) {
    const __VLS_52 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
        key: (table),
        label: (table),
        value: (table),
    }));
    const __VLS_54 = __VLS_53({
        key: (table),
        label: (table),
        value: (table),
    }, ...__VLS_functionalComponentArgsRest(__VLS_53));
}
var __VLS_47;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "lineage-stats mt-16" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "stat-row" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.b, __VLS_intrinsicElements.b)({
    ...{ class: "stat-blue" },
});
(__VLS_ctx.upstreamCount);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "stat-row" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.b, __VLS_intrinsicElements.b)({
    ...{ class: "stat-green" },
});
(__VLS_ctx.downstreamCount);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "stat-row" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.b, __VLS_intrinsicElements.b)({});
(__VLS_ctx.depth);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "stat-row" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.b, __VLS_intrinsicElements.b)({});
(__VLS_ctx.upstreamCount + __VLS_ctx.downstreamCount);
const __VLS_56 = {}.ElDivider;
/** @type {[typeof __VLS_components.ElDivider, typeof __VLS_components.elDivider, ]} */ ;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({}));
const __VLS_58 = __VLS_57({}, ...__VLS_functionalComponentArgsRest(__VLS_57));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "section-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "impact-item" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "impact-icon" },
});
const __VLS_60 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
    size: (16),
}));
const __VLS_62 = __VLS_61({
    size: (16),
}, ...__VLS_functionalComponentArgsRest(__VLS_61));
__VLS_63.slots.default;
const __VLS_64 = {}.Share;
/** @type {[typeof __VLS_components.Share, ]} */ ;
// @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({}));
const __VLS_66 = __VLS_65({}, ...__VLS_functionalComponentArgsRest(__VLS_65));
var __VLS_63;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "impact-info" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "impact-name" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "impact-desc" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.b, __VLS_intrinsicElements.b)({
    ...{ style: {} },
});
const __VLS_68 = {}.ElDivider;
/** @type {[typeof __VLS_components.ElDivider, typeof __VLS_components.elDivider, ]} */ ;
// @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({}));
const __VLS_70 = __VLS_69({}, ...__VLS_functionalComponentArgsRest(__VLS_69));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "section-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "anomaly-list" },
});
for (const [item] of __VLS_getVForSourceType((__VLS_ctx.anomalies))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (item.name),
        ...{ class: "anomaly-item" },
    });
    const __VLS_72 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
        size: "small",
        type: (item.type === '环状依赖' ? 'danger' : 'warning'),
        effect: "dark",
    }));
    const __VLS_74 = __VLS_73({
        size: "small",
        type: (item.type === '环状依赖' ? 'danger' : 'warning'),
        effect: "dark",
    }, ...__VLS_functionalComponentArgsRest(__VLS_73));
    __VLS_75.slots.default;
    (item.type);
    var __VLS_75;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "anomaly-name" },
    });
    (item.name);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "dep-text" },
    });
    (item.note);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "section-title mt-16" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "maintain-actions" },
});
const __VLS_76 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
    ...{ 'onClick': {} },
    size: "small",
}));
const __VLS_78 = __VLS_77({
    ...{ 'onClick': {} },
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_77));
let __VLS_80;
let __VLS_81;
let __VLS_82;
const __VLS_83 = {
    onClick: (__VLS_ctx.autoDiscover)
};
__VLS_79.slots.default;
var __VLS_79;
const __VLS_84 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
    ...{ 'onClick': {} },
    size: "small",
    type: "primary",
}));
const __VLS_86 = __VLS_85({
    ...{ 'onClick': {} },
    size: "small",
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_85));
let __VLS_88;
let __VLS_89;
let __VLS_90;
const __VLS_91 = {
    onClick: (__VLS_ctx.manualLink)
};
__VLS_87.slots.default;
var __VLS_87;
const __VLS_92 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
    ...{ 'onClick': {} },
    size: "small",
    type: "danger",
    plain: true,
}));
const __VLS_94 = __VLS_93({
    ...{ 'onClick': {} },
    size: "small",
    type: "danger",
    plain: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_93));
let __VLS_96;
let __VLS_97;
let __VLS_98;
const __VLS_99 = {
    onClick: (__VLS_ctx.removeNode)
};
__VLS_95.slots.default;
var __VLS_95;
var __VLS_43;
var __VLS_39;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['standard-page']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['lineage-chart']} */ ;
/** @type {__VLS_StyleScopedClasses['lineage-legend']} */ ;
/** @type {__VLS_StyleScopedClasses['legend-dot']} */ ;
/** @type {__VLS_StyleScopedClasses['legend-dot']} */ ;
/** @type {__VLS_StyleScopedClasses['legend-dot']} */ ;
/** @type {__VLS_StyleScopedClasses['legend-dot']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['lineage-stats']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-row']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-blue']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-row']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-green']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-row']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-row']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['impact-item']} */ ;
/** @type {__VLS_StyleScopedClasses['impact-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['impact-info']} */ ;
/** @type {__VLS_StyleScopedClasses['impact-name']} */ ;
/** @type {__VLS_StyleScopedClasses['impact-desc']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['anomaly-list']} */ ;
/** @type {__VLS_StyleScopedClasses['anomaly-item']} */ ;
/** @type {__VLS_StyleScopedClasses['anomaly-name']} */ ;
/** @type {__VLS_StyleScopedClasses['dep-text']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
/** @type {__VLS_StyleScopedClasses['maintain-actions']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Download: Download,
            Share: Share,
            tablePool: tablePool,
            viewMode: viewMode,
            selectedTable: selectedTable,
            lineageChartRef: lineageChartRef,
            anomalies: anomalies,
            upstreamCount: upstreamCount,
            downstreamCount: downstreamCount,
            depth: depth,
            renderLineage: renderLineage,
            autoDiscover: autoDiscover,
            manualLink: manualLink,
            removeNode: removeNode,
            exportLineage: exportLineage,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
