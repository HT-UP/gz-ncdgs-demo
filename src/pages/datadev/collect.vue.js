import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { Switch } from '@element-plus/icons-vue';
const activeTab = ref('calendar');
const todayPlan = 5;
const todayPlanList = [
    { time: '02:00', name: '全量采集-票务运营库', done: true },
    { time: '02:30', name: '增量采集-实名库', done: true },
    { time: '03:00', name: '变更捕获-运营调度库', done: true },
    { time: '08:00', name: '全量比对-客流事实', done: false },
    { time: '09:00', name: '流批合并-日关口抽取', waiting: true },
];
const schedMap = {};
schedMap['2026-08-13'] = 5;
['2026-08-05', '2026-08-07', '2026-08-12'].forEach((d) => (schedMap[d] = 3));
const compareRows = [
    { task: '客流事实-日比对', source: '1,280,452', target: '1,280,452', gap: 0 },
    { task: '票务明细-增量比对', source: '86,412', target: '86,394', gap: 18 },
    { task: '设备台账-全量比对', source: '56,208', target: '56,208', gap: 0 },
    { task: '订单汇总-本周比对', source: '324,900', target: '324,880', gap: 20 },
];
const unifiedRows = [
    { logic: '客流指标计算', batch: { job: '批式-客流日指标', cycle: '每日 03:00' }, stream: { job: '流式-客流指标', window: '5 分钟窗口' } },
    { logic: '欠费订单识别', batch: { job: '批式-欠费扫描', cycle: '每日 02:00' }, stream: { job: '流式-欠费告警', window: '1 分钟窗口' } },
    { logic: '车站拥挤度评估', batch: { job: '批式-拥挤度评级', cycle: '每小时' }, stream: { job: '流式-拥挤度', window: '10 秒窗口' } },
];
const aiSuggests = [
    { type: '调度建议', content: '发现「实名信息-增量采集」在高峰段存在积压，建议将调度频率由每 30 分钟调整为每 10 分钟。' },
    { type: '映射推荐', content: '新表 device_log 的 12 个字段命中设备台账标准映射，其中 10 个可一键应用。' },
    { type: '比对补盲', content: '检测到「乘客评价」链路 72 小时未执行数据比对，建议加入每日比对计划。' },
];
const runCompare = () => ElMessage.success('已触发 4 个比对任务，预计 3 分钟内完成（Mock）');
const diffDetail = (row) => {
    ElMessage.info(`「${row.task}」差异明细：目标端缺失 18 条，推送补数任务（Mock）`);
};
const acceptSug = (s) => ElMessage.success(`已采纳：${s.content}`);
const dismissSug = (s) => ElMessage.info('已忽略该建议');
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "collect-config-page" },
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
    ...{ class: "pane-body" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "pane-tools" },
});
const __VLS_8 = {}.ElTag;
/** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    type: "danger",
    effect: "dark",
}));
const __VLS_10 = __VLS_9({
    type: "danger",
    effect: "dark",
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
__VLS_11.slots.default;
(__VLS_ctx.todayPlan);
var __VLS_11;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "plan-list" },
});
for (const [p] of __VLS_getVForSourceType((__VLS_ctx.todayPlanList))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (p.time),
        ...{ class: "plan-row" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "plan-time" },
    });
    (p.time);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "plan-name" },
    });
    (p.name);
    const __VLS_12 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
        size: "small",
        type: (p.done ? 'success' : p.waiting ? 'info' : 'warning'),
        effect: "plain",
    }));
    const __VLS_14 = __VLS_13({
        size: "small",
        type: (p.done ? 'success' : p.waiting ? 'info' : 'warning'),
        effect: "plain",
    }, ...__VLS_functionalComponentArgsRest(__VLS_13));
    __VLS_15.slots.default;
    (p.done ? '已完成' : p.waiting ? '待执行' : '执行中');
    var __VLS_15;
}
const __VLS_16 = {}.ElCalendar;
/** @type {[typeof __VLS_components.ElCalendar, typeof __VLS_components.elCalendar, typeof __VLS_components.ElCalendar, typeof __VLS_components.elCalendar, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({}));
const __VLS_18 = __VLS_17({}, ...__VLS_functionalComponentArgsRest(__VLS_17));
__VLS_19.slots.default;
{
    const { 'date-cell': __VLS_thisSlot } = __VLS_19.slots;
    const [{ data }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "cal-box" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "cal-day" },
    });
    (data.day.split('-')[2]);
    if (__VLS_ctx.schedMap[data.day]) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "cal-tasks" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "tick" },
        });
        (__VLS_ctx.schedMap[data.day]);
    }
}
var __VLS_19;
var __VLS_7;
const __VLS_20 = {}.ElTabPane;
/** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
    label: "数据比对",
    name: "compare",
}));
const __VLS_22 = __VLS_21({
    label: "数据比对",
    name: "compare",
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
__VLS_23.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "pane-body" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "toolbar-row" },
});
const __VLS_24 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    ...{ 'onClick': {} },
    size: "small",
    type: "danger",
    icon: (__VLS_ctx.Switch),
}));
const __VLS_26 = __VLS_25({
    ...{ 'onClick': {} },
    size: "small",
    type: "danger",
    icon: (__VLS_ctx.Switch),
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
let __VLS_28;
let __VLS_29;
let __VLS_30;
const __VLS_31 = {
    onClick: (__VLS_ctx.runCompare)
};
__VLS_27.slots.default;
var __VLS_27;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "dep-text" },
});
const __VLS_32 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
    data: (__VLS_ctx.compareRows),
    size: "small",
    stripe: true,
    ...{ class: "mt-12" },
}));
const __VLS_34 = __VLS_33({
    data: (__VLS_ctx.compareRows),
    size: "small",
    stripe: true,
    ...{ class: "mt-12" },
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
__VLS_35.slots.default;
const __VLS_36 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    prop: "task",
    label: "比对任务",
    minWidth: "140",
}));
const __VLS_38 = __VLS_37({
    prop: "task",
    label: "比对任务",
    minWidth: "140",
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
const __VLS_40 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
    prop: "source",
    label: "源端（记录数）",
    width: "130",
}));
const __VLS_42 = __VLS_41({
    prop: "source",
    label: "源端（记录数）",
    width: "130",
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
const __VLS_44 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    prop: "target",
    label: "目标端（记录数）",
    width: "130",
}));
const __VLS_46 = __VLS_45({
    prop: "target",
    label: "目标端（记录数）",
    width: "130",
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
const __VLS_48 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
    prop: "gap",
    label: "差异数",
    width: "90",
    align: "right",
}));
const __VLS_50 = __VLS_49({
    prop: "gap",
    label: "差异数",
    width: "90",
    align: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
const __VLS_52 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
    label: "比对结果",
    width: "90",
}));
const __VLS_54 = __VLS_53({
    label: "比对结果",
    width: "90",
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
__VLS_55.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_55.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_56 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
        size: "small",
        type: (row.gap === 0 ? 'success' : 'danger'),
        effect: "dark",
    }));
    const __VLS_58 = __VLS_57({
        size: "small",
        type: (row.gap === 0 ? 'success' : 'danger'),
        effect: "dark",
    }, ...__VLS_functionalComponentArgsRest(__VLS_57));
    __VLS_59.slots.default;
    (row.gap === 0 ? '一致' : '不一致');
    var __VLS_59;
}
var __VLS_55;
const __VLS_60 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
    label: "操作",
    width: "70",
}));
const __VLS_62 = __VLS_61({
    label: "操作",
    width: "70",
}, ...__VLS_functionalComponentArgsRest(__VLS_61));
__VLS_63.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_63.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    if (row.gap > 0) {
        const __VLS_64 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
            ...{ 'onClick': {} },
            link: true,
            type: "primary",
            size: "small",
        }));
        const __VLS_66 = __VLS_65({
            ...{ 'onClick': {} },
            link: true,
            type: "primary",
            size: "small",
        }, ...__VLS_functionalComponentArgsRest(__VLS_65));
        let __VLS_68;
        let __VLS_69;
        let __VLS_70;
        const __VLS_71 = {
            onClick: (...[$event]) => {
                if (!(row.gap > 0))
                    return;
                __VLS_ctx.diffDetail(row);
            }
        };
        __VLS_67.slots.default;
        var __VLS_67;
    }
}
var __VLS_63;
var __VLS_35;
var __VLS_23;
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
    ...{ class: "pane-body" },
});
const __VLS_76 = {}.ElAlert;
/** @type {[typeof __VLS_components.ElAlert, typeof __VLS_components.elAlert, typeof __VLS_components.ElAlert, typeof __VLS_components.elAlert, ]} */ ;
// @ts-ignore
const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
    type: "info",
    closable: (false),
    showIcon: true,
    ...{ class: "mb-12" },
}));
const __VLS_78 = __VLS_77({
    type: "info",
    closable: (false),
    showIcon: true,
    ...{ class: "mb-12" },
}, ...__VLS_functionalComponentArgsRest(__VLS_77));
__VLS_79.slots.default;
{
    const { title: __VLS_thisSlot } = __VLS_79.slots;
}
var __VLS_79;
const __VLS_80 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
    data: (__VLS_ctx.unifiedRows),
    size: "small",
    stripe: true,
}));
const __VLS_82 = __VLS_81({
    data: (__VLS_ctx.unifiedRows),
    size: "small",
    stripe: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_81));
__VLS_83.slots.default;
const __VLS_84 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
    prop: "logic",
    label: "业务逻辑",
    minWidth: "150",
}));
const __VLS_86 = __VLS_85({
    prop: "logic",
    label: "业务逻辑",
    minWidth: "150",
}, ...__VLS_functionalComponentArgsRest(__VLS_85));
const __VLS_88 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
    label: "批式链路",
    width: "200",
}));
const __VLS_90 = __VLS_89({
    label: "批式链路",
    width: "200",
}, ...__VLS_functionalComponentArgsRest(__VLS_89));
__VLS_91.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_91.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "chain" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (row.batch.job);
    const __VLS_92 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
        size: "small",
        type: "primary",
        effect: "plain",
    }));
    const __VLS_94 = __VLS_93({
        size: "small",
        type: "primary",
        effect: "plain",
    }, ...__VLS_functionalComponentArgsRest(__VLS_93));
    __VLS_95.slots.default;
    (row.batch.cycle);
    var __VLS_95;
}
var __VLS_91;
const __VLS_96 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
    label: "流式链路",
    width: "200",
}));
const __VLS_98 = __VLS_97({
    label: "流式链路",
    width: "200",
}, ...__VLS_functionalComponentArgsRest(__VLS_97));
__VLS_99.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_99.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "chain" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (row.stream.job);
    const __VLS_100 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
        size: "small",
        type: "warning",
        effect: "plain",
    }));
    const __VLS_102 = __VLS_101({
        size: "small",
        type: "warning",
        effect: "plain",
    }, ...__VLS_functionalComponentArgsRest(__VLS_101));
    __VLS_103.slots.default;
    (row.stream.window);
    var __VLS_103;
}
var __VLS_99;
const __VLS_104 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
    label: "共用口径",
    width: "120",
}));
const __VLS_106 = __VLS_105({
    label: "共用口径",
    width: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_105));
__VLS_107.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_107.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
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
    (row.batch.job === row.stream.job ? '是' : '部分');
    var __VLS_111;
}
var __VLS_107;
const __VLS_112 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
    label: "状态",
    width: "80",
}));
const __VLS_114 = __VLS_113({
    label: "状态",
    width: "80",
}, ...__VLS_functionalComponentArgsRest(__VLS_113));
__VLS_115.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_115.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_116 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
        size: "small",
        type: "success",
        effect: "dark",
    }));
    const __VLS_118 = __VLS_117({
        size: "small",
        type: "success",
        effect: "dark",
    }, ...__VLS_functionalComponentArgsRest(__VLS_117));
    __VLS_119.slots.default;
    var __VLS_119;
}
var __VLS_115;
var __VLS_83;
var __VLS_75;
const __VLS_120 = {}.ElTabPane;
/** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
// @ts-ignore
const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({
    label: "AI 辅助配置",
    name: "ai",
}));
const __VLS_122 = __VLS_121({
    label: "AI 辅助配置",
    name: "ai",
}, ...__VLS_functionalComponentArgsRest(__VLS_121));
__VLS_123.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "pane-body" },
});
const __VLS_124 = {}.ElAlert;
/** @type {[typeof __VLS_components.ElAlert, typeof __VLS_components.elAlert, typeof __VLS_components.ElAlert, typeof __VLS_components.elAlert, ]} */ ;
// @ts-ignore
const __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({
    type: "warning",
    closable: (false),
    showIcon: true,
    ...{ class: "mb-12" },
}));
const __VLS_126 = __VLS_125({
    type: "warning",
    closable: (false),
    showIcon: true,
    ...{ class: "mb-12" },
}, ...__VLS_functionalComponentArgsRest(__VLS_125));
__VLS_127.slots.default;
{
    const { title: __VLS_thisSlot } = __VLS_127.slots;
}
var __VLS_127;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "ai-suggest-list" },
});
for (const [s, i] of __VLS_getVForSourceType((__VLS_ctx.aiSuggests))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (i),
        ...{ class: "ai-suggest" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "ai-main" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "ai-tag" },
    });
    (s.type);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "ai-content" },
    });
    (s.content);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "ai-actions" },
    });
    const __VLS_128 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({
        ...{ 'onClick': {} },
        size: "small",
        type: "primary",
        link: true,
    }));
    const __VLS_130 = __VLS_129({
        ...{ 'onClick': {} },
        size: "small",
        type: "primary",
        link: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_129));
    let __VLS_132;
    let __VLS_133;
    let __VLS_134;
    const __VLS_135 = {
        onClick: (...[$event]) => {
            __VLS_ctx.acceptSug(s);
        }
    };
    __VLS_131.slots.default;
    var __VLS_131;
    const __VLS_136 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_137 = __VLS_asFunctionalComponent(__VLS_136, new __VLS_136({
        ...{ 'onClick': {} },
        size: "small",
        type: "info",
        link: true,
    }));
    const __VLS_138 = __VLS_137({
        ...{ 'onClick': {} },
        size: "small",
        type: "info",
        link: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_137));
    let __VLS_140;
    let __VLS_141;
    let __VLS_142;
    const __VLS_143 = {
        onClick: (...[$event]) => {
            __VLS_ctx.dismissSug(s);
        }
    };
    __VLS_139.slots.default;
    var __VLS_139;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "ai-ready mt-12" },
});
var __VLS_123;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['collect-config-page']} */ ;
/** @type {__VLS_StyleScopedClasses['collect-tabs']} */ ;
/** @type {__VLS_StyleScopedClasses['pane-body']} */ ;
/** @type {__VLS_StyleScopedClasses['pane-tools']} */ ;
/** @type {__VLS_StyleScopedClasses['plan-list']} */ ;
/** @type {__VLS_StyleScopedClasses['plan-row']} */ ;
/** @type {__VLS_StyleScopedClasses['plan-time']} */ ;
/** @type {__VLS_StyleScopedClasses['plan-name']} */ ;
/** @type {__VLS_StyleScopedClasses['cal-box']} */ ;
/** @type {__VLS_StyleScopedClasses['cal-day']} */ ;
/** @type {__VLS_StyleScopedClasses['cal-tasks']} */ ;
/** @type {__VLS_StyleScopedClasses['tick']} */ ;
/** @type {__VLS_StyleScopedClasses['pane-body']} */ ;
/** @type {__VLS_StyleScopedClasses['toolbar-row']} */ ;
/** @type {__VLS_StyleScopedClasses['dep-text']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-12']} */ ;
/** @type {__VLS_StyleScopedClasses['pane-body']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-12']} */ ;
/** @type {__VLS_StyleScopedClasses['chain']} */ ;
/** @type {__VLS_StyleScopedClasses['chain']} */ ;
/** @type {__VLS_StyleScopedClasses['pane-body']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-12']} */ ;
/** @type {__VLS_StyleScopedClasses['ai-suggest-list']} */ ;
/** @type {__VLS_StyleScopedClasses['ai-suggest']} */ ;
/** @type {__VLS_StyleScopedClasses['ai-main']} */ ;
/** @type {__VLS_StyleScopedClasses['ai-tag']} */ ;
/** @type {__VLS_StyleScopedClasses['ai-content']} */ ;
/** @type {__VLS_StyleScopedClasses['ai-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['ai-ready']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-12']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Switch: Switch,
            activeTab: activeTab,
            todayPlan: todayPlan,
            todayPlanList: todayPlanList,
            schedMap: schedMap,
            compareRows: compareRows,
            unifiedRows: unifiedRows,
            aiSuggests: aiSuggests,
            runCompare: runCompare,
            diffDetail: diffDetail,
            acceptSug: acceptSug,
            dismissSug: dismissSug,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
