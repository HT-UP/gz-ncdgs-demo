import { computed, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { RefreshRight, Search } from '@element-plus/icons-vue';
const activeTab = ref('calendar');
const currentDate = ref(new Date('2026-08-13'));
const selectedDay = ref('2026-08-13');
const schedMap = {
    '2026-08-01': { success: 18, failed: 0 },
    '2026-08-02': { success: 20, failed: 1 },
    '2026-08-03': { success: 19, failed: 0 },
    '2026-08-04': { success: 22, failed: 0 },
    '2026-08-05': { success: 21, failed: 1 },
    '2026-08-06': { success: 19, failed: 0 },
    '2026-08-07': { success: 20, failed: 0 },
    '2026-08-08': { success: 18, failed: 0 },
    '2026-08-09': { success: 17, failed: 1 },
    '2026-08-10': { success: 22, failed: 0 },
    '2026-08-11': { success: 23, failed: 0 },
    '2026-08-12': { success: 20, failed: 1 },
    '2026-08-13': { success: 21, failed: 1 },
};
const plansMap = {
    '2026-08-13': [
        { id: 1, time: '02:00', name: '全量采集-票务库', ok: true },
        { id: 2, time: '02:30', name: '增量采集-实名库', ok: true },
        { id: 3, time: '06:00', name: '指标重算-客流事实', ok: true },
        { id: 4, time: '10:00', name: '流批合并-订单汇总', ok: false },
    ],
};
const selectedDayPlans = computed(() => plansMap[selectedDay.value] ?? []);
const compareKw = ref('');
const compareTasks = ref([
    { name: '票务明细-全量比对', source: 'MySQL', target: 'Doris', srcCnt: 1280452, tgtCnt: 1280452, diff: 0, last: '2026-08-13 02:10' },
    { name: '客流事实-增量比对', source: 'Kafka', target: 'Doris', srcCnt: 86412, tgtCnt: 86394, diff: 18, last: '2026-08-13 10:30' },
    { name: '订单汇总-日比对', source: 'Oracle', target: 'Hive', srcCnt: 324900, tgtCnt: 324880, diff: 20, last: '2026-08-13 03:00' },
    { name: '车站档案-全量比对', source: 'MySQL', target: 'Redis', srcCnt: 56208, tgtCnt: 56208, diff: 0, last: '2026-08-12 02:00' },
]);
const runCompare = () => ElMessage.success('已触发 4 个数据比对任务（Mock）');
const unifiedJobs = [
    { logic: '客流日指标计算', batch: { name: '批-客流指标加工', cycle: '每日 03:00' }, stream: { name: '流-客流实时聚合', window: '5min 窗口' }, note: '共用口径：乘客数、拥挤度、周转量' },
    { logic: '欠费订单识别', batch: { name: '批-欠费扫描', cycle: '每日 02:00' }, stream: { name: '流-欠费实时告警', window: '1min 窗口' }, note: '共用规则引擎：阈值 + 规则模板' },
    { logic: '车站拥挤度评估', batch: { name: '批-拥挤度评级', cycle: '每小时' }, stream: { name: '流-拥挤度快照', window: '10s 窗口' }, note: '共用模型：CNN 客流预测' },
];
const aiSuggests = ref([
    { type: '字段映射', content: '新增字段 station_name 建议映射至站点档案维度表 dim_station_info.station_name（语义相似度 0.93）', conf: 93, status: '待处理' },
    { type: '分区裁剪', content: '表 dws_ticket_daily 近 30 日按 line_code 分区可裁剪 62% 扫描量，建议启用动态分区', conf: 88, status: '待处理' },
    { type: '参数调优', content: '客流事件流 batchSize 建议由 1000 提升至 2000，延迟预计下降 34%', conf: 82, status: '待处理' },
    { type: '调度建议', content: '票务增量采集由每 30 分钟调整为每 10 分钟，可满足实时看板 SLA', conf: 90, status: '已采纳' },
]);
const applySug = (row) => {
    row.status = '已采纳';
    ElMessage.success('AI 建议已应用（Mock）');
};
const ignoreSug = (row) => {
    row.status = '已忽略';
    ElMessage.info('已忽略该建议');
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "standard-page collect-config-page" },
});
const __VLS_0 = {}.ElTabs;
/** @type {[typeof __VLS_components.ElTabs, typeof __VLS_components.elTabs, typeof __VLS_components.ElTabs, typeof __VLS_components.elTabs, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    modelValue: (__VLS_ctx.activeTab),
    type: "border-card",
    stretch: true,
    ...{ class: "collect-tabs" },
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.activeTab),
    type: "border-card",
    stretch: true,
    ...{ class: "collect-tabs" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
const __VLS_4 = {}.ElTabPane;
/** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    label: "调度日历",
    name: "calendar",
}));
const __VLS_6 = __VLS_5({
    label: "调度日历",
    name: "calendar",
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
__VLS_7.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "calendar-grid" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "cal-main" },
});
const __VLS_8 = {}.ElCalendar;
/** @type {[typeof __VLS_components.ElCalendar, typeof __VLS_components.elCalendar, typeof __VLS_components.ElCalendar, typeof __VLS_components.elCalendar, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    modelValue: (__VLS_ctx.currentDate),
}));
const __VLS_10 = __VLS_9({
    modelValue: (__VLS_ctx.currentDate),
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
__VLS_11.slots.default;
{
    const { 'date-cell': __VLS_thisSlot } = __VLS_11.slots;
    const [{ data }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.selectedDay = data.day;
            } },
        ...{ class: "cal-cell" },
        ...{ class: ({ 'cal-day-selected': __VLS_ctx.selectedDay === data.day }) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "cal-day-num" },
    });
    (data.day.split('-')[2]);
    if (__VLS_ctx.schedMap[data.day]) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "cal-task-nums" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "cal-ok" },
        });
        (__VLS_ctx.schedMap[data.day].success);
        if (__VLS_ctx.schedMap[data.day].failed) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "cal-bad" },
            });
            (__VLS_ctx.schedMap[data.day].failed);
        }
    }
}
var __VLS_11;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "cal-side" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "side-title" },
});
(__VLS_ctx.selectedDay);
for (const [t] of __VLS_getVForSourceType((__VLS_ctx.selectedDayPlans))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (t.id),
        ...{ class: "plan-item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "plan-time" },
    });
    (t.time);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "plan-name" },
    });
    (t.name);
    const __VLS_12 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
        size: "small",
        type: (t.ok ? 'success' : 'warning'),
        effect: "dark",
    }));
    const __VLS_14 = __VLS_13({
        size: "small",
        type: (t.ok ? 'success' : 'warning'),
        effect: "dark",
    }, ...__VLS_functionalComponentArgsRest(__VLS_13));
    __VLS_15.slots.default;
    (t.ok ? '成功' : '失败');
    var __VLS_15;
}
var __VLS_7;
const __VLS_16 = {}.ElTabPane;
/** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    label: "数据比对",
    name: "compare",
}));
const __VLS_18 = __VLS_17({
    label: "数据比对",
    name: "compare",
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
__VLS_19.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "toolbar-row" },
});
const __VLS_20 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
    modelValue: (__VLS_ctx.compareKw),
    placeholder: "按任务 / 数据源搜索",
    clearable: true,
    ...{ class: "search-input" },
    prefixIcon: (__VLS_ctx.Search),
}));
const __VLS_22 = __VLS_21({
    modelValue: (__VLS_ctx.compareKw),
    placeholder: "按任务 / 数据源搜索",
    clearable: true,
    ...{ class: "search-input" },
    prefixIcon: (__VLS_ctx.Search),
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
const __VLS_24 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    ...{ 'onClick': {} },
    type: "danger",
    plain: true,
    icon: (__VLS_ctx.RefreshRight),
}));
const __VLS_26 = __VLS_25({
    ...{ 'onClick': {} },
    type: "danger",
    plain: true,
    icon: (__VLS_ctx.RefreshRight),
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
let __VLS_28;
let __VLS_29;
let __VLS_30;
const __VLS_31 = {
    onClick: (__VLS_ctx.runCompare)
};
__VLS_27.slots.default;
var __VLS_27;
const __VLS_32 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
    data: (__VLS_ctx.compareTasks),
    size: "small",
    stripe: true,
    ...{ class: "mt-12" },
}));
const __VLS_34 = __VLS_33({
    data: (__VLS_ctx.compareTasks),
    size: "small",
    stripe: true,
    ...{ class: "mt-12" },
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
__VLS_35.slots.default;
const __VLS_36 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    prop: "name",
    label: "比对任务",
    minWidth: "150",
}));
const __VLS_38 = __VLS_37({
    prop: "name",
    label: "比对任务",
    minWidth: "150",
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
const __VLS_40 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
    prop: "source",
    label: "源端",
    minWidth: "120",
}));
const __VLS_42 = __VLS_41({
    prop: "source",
    label: "源端",
    minWidth: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
const __VLS_44 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    prop: "target",
    label: "目标端",
    minWidth: "120",
}));
const __VLS_46 = __VLS_45({
    prop: "target",
    label: "目标端",
    minWidth: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
const __VLS_48 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
    label: "源记录数",
    width: "100",
    align: "right",
}));
const __VLS_50 = __VLS_49({
    label: "源记录数",
    width: "100",
    align: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
__VLS_51.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_51.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    (row.srcCnt);
}
var __VLS_51;
const __VLS_52 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
    label: "目标记录数",
    width: "100",
    align: "right",
}));
const __VLS_54 = __VLS_53({
    label: "目标记录数",
    width: "100",
    align: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
__VLS_55.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_55.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    (row.tgtCnt);
}
var __VLS_55;
const __VLS_56 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
    label: "差异数",
    width: "90",
    align: "right",
}));
const __VLS_58 = __VLS_57({
    label: "差异数",
    width: "90",
    align: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
__VLS_59.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_59.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: (row.diff === 0 ? 'trend-positive' : 'trend-negative') },
    });
    (row.diff);
}
var __VLS_59;
const __VLS_60 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
    label: "结果",
    width: "90",
}));
const __VLS_62 = __VLS_61({
    label: "结果",
    width: "90",
}, ...__VLS_functionalComponentArgsRest(__VLS_61));
__VLS_63.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_63.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_64 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
        size: "small",
        type: (row.diff === 0 ? 'success' : 'danger'),
        effect: "dark",
    }));
    const __VLS_66 = __VLS_65({
        size: "small",
        type: (row.diff === 0 ? 'success' : 'danger'),
        effect: "dark",
    }, ...__VLS_functionalComponentArgsRest(__VLS_65));
    __VLS_67.slots.default;
    (row.diff === 0 ? '一致' : '存在差异');
    var __VLS_67;
}
var __VLS_63;
const __VLS_68 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
    prop: "last",
    label: "最近比对",
    width: "110",
}));
const __VLS_70 = __VLS_69({
    prop: "last",
    label: "最近比对",
    width: "110",
}, ...__VLS_functionalComponentArgsRest(__VLS_69));
var __VLS_35;
var __VLS_19;
const __VLS_72 = {}.ElTabPane;
/** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
// @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
    label: "流批一体",
    name: "unified",
}));
const __VLS_74 = __VLS_73({
    label: "流批一体",
    name: "unified",
}, ...__VLS_functionalComponentArgsRest(__VLS_73));
__VLS_75.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "unified-grid" },
});
for (const [u] of __VLS_getVForSourceType((__VLS_ctx.unifiedJobs))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (u.logic),
        ...{ class: "unified-card" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "unified-head" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "unified-logic" },
    });
    (u.logic);
    const __VLS_76 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
        size: "small",
        type: "success",
        effect: "plain",
    }));
    const __VLS_78 = __VLS_77({
        size: "small",
        type: "success",
        effect: "plain",
    }, ...__VLS_functionalComponentArgsRest(__VLS_77));
    __VLS_79.slots.default;
    var __VLS_79;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "unified-row" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "unified-side" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "unified-name" },
    });
    (u.batch.name);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "dep-text" },
    });
    (u.batch.cycle);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "unified-row" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "unified-side" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "unified-name" },
    });
    (u.stream.name);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "dep-text" },
    });
    (u.stream.window);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "unified-note" },
    });
    (u.note);
}
var __VLS_75;
const __VLS_80 = {}.ElTabPane;
/** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
// @ts-ignore
const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
    label: "AI 辅助配置",
    name: "ai",
}));
const __VLS_82 = __VLS_81({
    label: "AI 辅助配置",
    name: "ai",
}, ...__VLS_functionalComponentArgsRest(__VLS_81));
__VLS_83.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "toolbar-row" },
});
const __VLS_84 = {}.ElTag;
/** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
// @ts-ignore
const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
    size: "small",
    type: "info",
    effect: "plain",
}));
const __VLS_86 = __VLS_85({
    size: "small",
    type: "info",
    effect: "plain",
}, ...__VLS_functionalComponentArgsRest(__VLS_85));
__VLS_87.slots.default;
var __VLS_87;
const __VLS_88 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
    data: (__VLS_ctx.aiSuggests),
    size: "small",
    stripe: true,
    ...{ class: "mt-12" },
}));
const __VLS_90 = __VLS_89({
    data: (__VLS_ctx.aiSuggests),
    size: "small",
    stripe: true,
    ...{ class: "mt-12" },
}, ...__VLS_functionalComponentArgsRest(__VLS_89));
__VLS_91.slots.default;
const __VLS_92 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
    prop: "type",
    label: "建议类型",
    width: "110",
}));
const __VLS_94 = __VLS_93({
    prop: "type",
    label: "建议类型",
    width: "110",
}, ...__VLS_functionalComponentArgsRest(__VLS_93));
const __VLS_96 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
    prop: "content",
    label: "建议内容",
    minWidth: "260",
}));
const __VLS_98 = __VLS_97({
    prop: "content",
    label: "建议内容",
    minWidth: "260",
}, ...__VLS_functionalComponentArgsRest(__VLS_97));
const __VLS_100 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
    prop: "conf",
    label: "置信度",
    width: "90",
    align: "center",
}));
const __VLS_102 = __VLS_101({
    prop: "conf",
    label: "置信度",
    width: "90",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_101));
__VLS_103.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_103.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "trend-positive" },
    });
    (row.conf);
}
var __VLS_103;
const __VLS_104 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
    label: "操作",
    width: "170",
}));
const __VLS_106 = __VLS_105({
    label: "操作",
    width: "170",
}, ...__VLS_functionalComponentArgsRest(__VLS_105));
__VLS_107.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_107.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    if (row.status === '待处理') {
        const __VLS_108 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
            ...{ 'onClick': {} },
            size: "small",
            type: "primary",
            link: true,
        }));
        const __VLS_110 = __VLS_109({
            ...{ 'onClick': {} },
            size: "small",
            type: "primary",
            link: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_109));
        let __VLS_112;
        let __VLS_113;
        let __VLS_114;
        const __VLS_115 = {
            onClick: (...[$event]) => {
                if (!(row.status === '待处理'))
                    return;
                __VLS_ctx.applySug(row);
            }
        };
        __VLS_111.slots.default;
        var __VLS_111;
    }
    if (row.status === '待处理') {
        const __VLS_116 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
            ...{ 'onClick': {} },
            size: "small",
            type: "info",
            link: true,
        }));
        const __VLS_118 = __VLS_117({
            ...{ 'onClick': {} },
            size: "small",
            type: "info",
            link: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_117));
        let __VLS_120;
        let __VLS_121;
        let __VLS_122;
        const __VLS_123 = {
            onClick: (...[$event]) => {
                if (!(row.status === '待处理'))
                    return;
                __VLS_ctx.ignoreSug(row);
            }
        };
        __VLS_119.slots.default;
        var __VLS_119;
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "dep-text" },
        });
        (row.status);
    }
}
var __VLS_107;
var __VLS_91;
var __VLS_83;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['standard-page']} */ ;
/** @type {__VLS_StyleScopedClasses['collect-config-page']} */ ;
/** @type {__VLS_StyleScopedClasses['collect-tabs']} */ ;
/** @type {__VLS_StyleScopedClasses['calendar-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['cal-main']} */ ;
/** @type {__VLS_StyleScopedClasses['cal-cell']} */ ;
/** @type {__VLS_StyleScopedClasses['cal-day-num']} */ ;
/** @type {__VLS_StyleScopedClasses['cal-task-nums']} */ ;
/** @type {__VLS_StyleScopedClasses['cal-ok']} */ ;
/** @type {__VLS_StyleScopedClasses['cal-bad']} */ ;
/** @type {__VLS_StyleScopedClasses['cal-side']} */ ;
/** @type {__VLS_StyleScopedClasses['side-title']} */ ;
/** @type {__VLS_StyleScopedClasses['plan-item']} */ ;
/** @type {__VLS_StyleScopedClasses['plan-time']} */ ;
/** @type {__VLS_StyleScopedClasses['plan-name']} */ ;
/** @type {__VLS_StyleScopedClasses['toolbar-row']} */ ;
/** @type {__VLS_StyleScopedClasses['search-input']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-12']} */ ;
/** @type {__VLS_StyleScopedClasses['unified-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['unified-card']} */ ;
/** @type {__VLS_StyleScopedClasses['unified-head']} */ ;
/** @type {__VLS_StyleScopedClasses['unified-logic']} */ ;
/** @type {__VLS_StyleScopedClasses['unified-row']} */ ;
/** @type {__VLS_StyleScopedClasses['unified-side']} */ ;
/** @type {__VLS_StyleScopedClasses['unified-name']} */ ;
/** @type {__VLS_StyleScopedClasses['dep-text']} */ ;
/** @type {__VLS_StyleScopedClasses['unified-row']} */ ;
/** @type {__VLS_StyleScopedClasses['unified-side']} */ ;
/** @type {__VLS_StyleScopedClasses['unified-name']} */ ;
/** @type {__VLS_StyleScopedClasses['dep-text']} */ ;
/** @type {__VLS_StyleScopedClasses['unified-note']} */ ;
/** @type {__VLS_StyleScopedClasses['toolbar-row']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-12']} */ ;
/** @type {__VLS_StyleScopedClasses['trend-positive']} */ ;
/** @type {__VLS_StyleScopedClasses['dep-text']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            RefreshRight: RefreshRight,
            Search: Search,
            activeTab: activeTab,
            currentDate: currentDate,
            selectedDay: selectedDay,
            schedMap: schedMap,
            selectedDayPlans: selectedDayPlans,
            compareKw: compareKw,
            compareTasks: compareTasks,
            runCompare: runCompare,
            unifiedJobs: unifiedJobs,
            aiSuggests: aiSuggests,
            applySug: applySug,
            ignoreSug: ignoreSug,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
