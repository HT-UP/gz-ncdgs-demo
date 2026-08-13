import { computed, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
const overview = [
    { label: '接入采集源', value: '32', note: '+3 本周', color: '#da251d' },
    { label: '今日采集表', value: '1,284', note: '较昨日 +6.2%', color: '#2b6cb0' },
    { label: '采集成功率', value: '99.2%', note: '近 7 日', color: '#00a854' },
    { label: '平均耗时', value: '12.6s', note: '单任务', color: '#ed7b2f' },
];
const modes = [
    { name: '全量调度', enabled: true, desc: '定期对数据源全量采集，适合数据量小、变更不频繁的元数据。', scope: '基础信息 / 档案类', tasks: 12 },
    { name: '增量调度', enabled: true, desc: '基于时间戳或水位线采集增量变化，降低资源开销。', scope: '运营流水 / 业务表', tasks: 15 },
    { name: '变更捕获', enabled: true, desc: '通过日志/CDC 实时捕获结构变更，秒级同步元数据。', scope: '核心表 / 实时需求', tasks: 5 },
];
const modeType = { 全量调度: 'primary', 增量调度: 'success', 变更捕获: 'warning' };
const statusType = { 运行中: 'success', 待执行: 'info', 已失败: 'danger' };
const tasks = ref([
    { id: 1, name: '生产库-全量采集', source: '票务库', mode: '全量调度', cycle: '每日 02:00', status: '运行中', failPolicy: '重试 3 次 + 告警', last: '08-13 02:12' },
    { id: 2, name: '生产库-增量采集', source: '票务库', mode: '增量调度', cycle: '每 10 分钟', status: '运行中', failPolicy: '断点续采 + 告警', last: '08-13 10:30' },
    { id: 3, name: '财务共享-变更捕获', source: '财务库', mode: '变更捕获', cycle: '实时', status: '运行中', failPolicy: '重放补偿 + 告警', last: '08-13 10:31' },
    { id: 4, name: '运营日志-增量采集', source: '日志仓', mode: '增量调度', cycle: '每 5 分钟', status: '待执行', failPolicy: '重试 3 次 + 告警', last: '08-13 10:25' },
    { id: 5, name: '设备档案-全量采集', source: '设备库', mode: '全量调度', cycle: '每周日 03:00', status: '已失败', failPolicy: '重试 3 次 + 告警', last: '08-10 03:00' },
]);
const failedTasks = computed(() => tasks.value.filter((t) => t.status === '已失败').map((t) => ({ ...t, reason: '连接超时 / 表结构不兼容' })));
const addTask = () => ElMessage.info('打开新建采集任务向导（Mock）');
const retry = (t) => {
    const task = tasks.value.find((x) => x.name === t.name);
    if (task)
        task.status = '运行中';
    ElMessage.success(`「${t.name}」已触发重试（Mock）`);
};
const remedy = (t) => ElMessage.info(`「${t.name}」进入人工补救流程（Mock）`);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "standard-page meta-schedule-page" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "ovw-grid" },
});
for (const [o] of __VLS_getVForSourceType((__VLS_ctx.overview))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (o.label),
        ...{ class: "ovw-card" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "ovw-num" },
        ...{ style: ({ color: o.color }) },
    });
    (o.value);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "ovw-label" },
    });
    (o.label);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "ovw-note" },
    });
    (o.note);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "sec-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "mode-grid" },
});
for (const [m] of __VLS_getVForSourceType((__VLS_ctx.modes))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (m.name),
        ...{ class: "mode-card" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "mode-head" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "mode-name" },
    });
    (m.name);
    const __VLS_0 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        size: "small",
        type: (m.enabled ? 'success' : 'info'),
        effect: "dark",
    }));
    const __VLS_2 = __VLS_1({
        size: "small",
        type: (m.enabled ? 'success' : 'info'),
        effect: "dark",
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    __VLS_3.slots.default;
    (m.enabled ? '已启用' : '已停用');
    var __VLS_3;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "mode-desc" },
    });
    (m.desc);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "mode-meta dep-text" },
    });
    (m.scope);
    (m.tasks);
}
const __VLS_4 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    ...{ class: "panel-card mt-16" },
    shadow: "never",
}));
const __VLS_6 = __VLS_5({
    ...{ class: "panel-card mt-16" },
    shadow: "never",
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
__VLS_7.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_7.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    const __VLS_8 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
        ...{ 'onClick': {} },
        type: "danger",
        icon: (__VLS_ctx.Plus),
    }));
    const __VLS_10 = __VLS_9({
        ...{ 'onClick': {} },
        type: "danger",
        icon: (__VLS_ctx.Plus),
    }, ...__VLS_functionalComponentArgsRest(__VLS_9));
    let __VLS_12;
    let __VLS_13;
    let __VLS_14;
    const __VLS_15 = {
        onClick: (__VLS_ctx.addTask)
    };
    __VLS_11.slots.default;
    var __VLS_11;
}
const __VLS_16 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    data: (__VLS_ctx.tasks),
    size: "small",
    stripe: true,
}));
const __VLS_18 = __VLS_17({
    data: (__VLS_ctx.tasks),
    size: "small",
    stripe: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
__VLS_19.slots.default;
const __VLS_20 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
    prop: "name",
    label: "采集任务",
    minWidth: "150",
}));
const __VLS_22 = __VLS_21({
    prop: "name",
    label: "采集任务",
    minWidth: "150",
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
const __VLS_24 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    prop: "source",
    label: "数据源",
    minWidth: "110",
}));
const __VLS_26 = __VLS_25({
    prop: "source",
    label: "数据源",
    minWidth: "110",
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
const __VLS_28 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
    label: "调度方式",
    width: "100",
}));
const __VLS_30 = __VLS_29({
    label: "调度方式",
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
__VLS_31.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_31.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_32 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
        size: "small",
        type: (__VLS_ctx.modeType[row.mode]),
        effect: "plain",
    }));
    const __VLS_34 = __VLS_33({
        size: "small",
        type: (__VLS_ctx.modeType[row.mode]),
        effect: "plain",
    }, ...__VLS_functionalComponentArgsRest(__VLS_33));
    __VLS_35.slots.default;
    (row.mode);
    var __VLS_35;
}
var __VLS_31;
const __VLS_36 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    prop: "cycle",
    label: "调度周期",
    width: "110",
}));
const __VLS_38 = __VLS_37({
    prop: "cycle",
    label: "调度周期",
    width: "110",
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
const __VLS_40 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
    label: "状态",
    width: "90",
}));
const __VLS_42 = __VLS_41({
    label: "状态",
    width: "90",
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
__VLS_43.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_43.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_44 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
        size: "small",
        type: (__VLS_ctx.statusType[row.status]),
        effect: "dark",
    }));
    const __VLS_46 = __VLS_45({
        size: "small",
        type: (__VLS_ctx.statusType[row.status]),
        effect: "dark",
    }, ...__VLS_functionalComponentArgsRest(__VLS_45));
    __VLS_47.slots.default;
    (row.status);
    var __VLS_47;
}
var __VLS_43;
const __VLS_48 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
    label: "失败处理",
    minWidth: "130",
}));
const __VLS_50 = __VLS_49({
    label: "失败处理",
    minWidth: "130",
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
__VLS_51.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_51.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    (row.failPolicy);
}
var __VLS_51;
const __VLS_52 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
    prop: "last",
    label: "最近执行",
    width: "110",
}));
const __VLS_54 = __VLS_53({
    prop: "last",
    label: "最近执行",
    width: "110",
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
var __VLS_19;
var __VLS_7;
const __VLS_56 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
    ...{ class: "panel-card mt-16" },
    shadow: "never",
}));
const __VLS_58 = __VLS_57({
    ...{ class: "panel-card mt-16" },
    shadow: "never",
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
__VLS_59.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_59.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
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
    (__VLS_ctx.failedTasks.length);
    var __VLS_63;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "fail-grid" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "fail-policy" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "policy-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "policy-desc" },
});
const __VLS_64 = {}.ElTag;
/** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
// @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
    size: "small",
    type: "success",
    effect: "plain",
}));
const __VLS_66 = __VLS_65({
    size: "small",
    type: "success",
    effect: "plain",
}, ...__VLS_functionalComponentArgsRest(__VLS_65));
__VLS_67.slots.default;
var __VLS_67;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "fail-policy" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "policy-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "policy-desc" },
});
const __VLS_68 = {}.ElTag;
/** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
// @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
    size: "small",
    type: "success",
    effect: "plain",
}));
const __VLS_70 = __VLS_69({
    size: "small",
    type: "success",
    effect: "plain",
}, ...__VLS_functionalComponentArgsRest(__VLS_69));
__VLS_71.slots.default;
var __VLS_71;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "fail-policy" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "policy-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "policy-desc" },
});
const __VLS_72 = {}.ElTag;
/** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
// @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
    size: "small",
    type: "warning",
    effect: "plain",
}));
const __VLS_74 = __VLS_73({
    size: "small",
    type: "warning",
    effect: "plain",
}, ...__VLS_functionalComponentArgsRest(__VLS_73));
__VLS_75.slots.default;
var __VLS_75;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "mt-12" },
});
for (const [f] of __VLS_getVForSourceType((__VLS_ctx.failedTasks))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (f.id),
        ...{ class: "fail-item" },
    });
    const __VLS_76 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
        size: "small",
        type: "danger",
        effect: "dark",
    }));
    const __VLS_78 = __VLS_77({
        size: "small",
        type: "danger",
        effect: "dark",
    }, ...__VLS_functionalComponentArgsRest(__VLS_77));
    __VLS_79.slots.default;
    var __VLS_79;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "fail-name" },
    });
    (f.name);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "fail-reason dep-text" },
    });
    (f.reason);
    const __VLS_80 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
        ...{ 'onClick': {} },
        size: "small",
        link: true,
        type: "primary",
    }));
    const __VLS_82 = __VLS_81({
        ...{ 'onClick': {} },
        size: "small",
        link: true,
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_81));
    let __VLS_84;
    let __VLS_85;
    let __VLS_86;
    const __VLS_87 = {
        onClick: (...[$event]) => {
            __VLS_ctx.retry(f);
        }
    };
    __VLS_83.slots.default;
    var __VLS_83;
    const __VLS_88 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
        ...{ 'onClick': {} },
        size: "small",
        link: true,
        type: "warning",
    }));
    const __VLS_90 = __VLS_89({
        ...{ 'onClick': {} },
        size: "small",
        link: true,
        type: "warning",
    }, ...__VLS_functionalComponentArgsRest(__VLS_89));
    let __VLS_92;
    let __VLS_93;
    let __VLS_94;
    const __VLS_95 = {
        onClick: (...[$event]) => {
            __VLS_ctx.remedy(f);
        }
    };
    __VLS_91.slots.default;
    var __VLS_91;
}
var __VLS_59;
/** @type {__VLS_StyleScopedClasses['standard-page']} */ ;
/** @type {__VLS_StyleScopedClasses['meta-schedule-page']} */ ;
/** @type {__VLS_StyleScopedClasses['ovw-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['ovw-card']} */ ;
/** @type {__VLS_StyleScopedClasses['ovw-num']} */ ;
/** @type {__VLS_StyleScopedClasses['ovw-label']} */ ;
/** @type {__VLS_StyleScopedClasses['ovw-note']} */ ;
/** @type {__VLS_StyleScopedClasses['sec-title']} */ ;
/** @type {__VLS_StyleScopedClasses['mode-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['mode-card']} */ ;
/** @type {__VLS_StyleScopedClasses['mode-head']} */ ;
/** @type {__VLS_StyleScopedClasses['mode-name']} */ ;
/** @type {__VLS_StyleScopedClasses['mode-desc']} */ ;
/** @type {__VLS_StyleScopedClasses['mode-meta']} */ ;
/** @type {__VLS_StyleScopedClasses['dep-text']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['fail-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['fail-policy']} */ ;
/** @type {__VLS_StyleScopedClasses['policy-title']} */ ;
/** @type {__VLS_StyleScopedClasses['policy-desc']} */ ;
/** @type {__VLS_StyleScopedClasses['fail-policy']} */ ;
/** @type {__VLS_StyleScopedClasses['policy-title']} */ ;
/** @type {__VLS_StyleScopedClasses['policy-desc']} */ ;
/** @type {__VLS_StyleScopedClasses['fail-policy']} */ ;
/** @type {__VLS_StyleScopedClasses['policy-title']} */ ;
/** @type {__VLS_StyleScopedClasses['policy-desc']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-12']} */ ;
/** @type {__VLS_StyleScopedClasses['fail-item']} */ ;
/** @type {__VLS_StyleScopedClasses['fail-name']} */ ;
/** @type {__VLS_StyleScopedClasses['fail-reason']} */ ;
/** @type {__VLS_StyleScopedClasses['dep-text']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Plus: Plus,
            overview: overview,
            modes: modes,
            modeType: modeType,
            statusType: statusType,
            tasks: tasks,
            failedTasks: failedTasks,
            addTask: addTask,
            retry: retry,
            remedy: remedy,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
