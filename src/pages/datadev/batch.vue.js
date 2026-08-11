import { computed, reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { Aim, Brush, Coin, Filter, Lock, MagicStick, Plus, Refresh, Sort, Search } from '@element-plus/icons-vue';
import { mockDevTasks } from '@/mock/datadev';
const statusTagType = {
    运行中: 'warning',
    成功: 'success',
    失败: 'danger',
    待执行: 'warning',
};
const modes = ['全量', '增量-时间戳', '增量-自增ID', '刷新采集', '数据比对'];
const batchTasks = ref(mockDevTasks.filter((task) => task.type === '批量').map((task) => ({ ...task, mode: modes[task.id.charCodeAt(task.id.length - 1) % modes.length] })));
const operators = [
    { name: '条件过滤', desc: '按字段条件筛选记录', icon: Filter },
    { name: '字段映射', desc: '源字段到目标字段映射', icon: Coin },
    { name: '类型转换', desc: '数据类型自动转换', icon: Refresh },
    { name: '数据清洗', desc: '去空、去重、格式化', icon: Brush },
    { name: '数据归并', desc: '多表合并与聚合', icon: Sort },
    { name: '数据富化', desc: '关联外部数据补充', icon: MagicStick },
    { name: '数据标准化', desc: '按数据标准统一口径', icon: Aim },
    { name: '脱敏加密', desc: '敏感字段脱敏处理', icon: Lock },
];
const sources = ['票务核心库', '设备信号库', '客流分析库', '建设进度库', '运维工单库', '资产管理系统'];
const schedules = ['每日 02:00', '每小时', '每周一 03:00', '每分钟', '手动触发'];
const keyword = ref('');
const filterStatus = ref('');
const editorVisible = ref(false);
const editingTask = ref(null);
const form = reactive({
    name: '',
    source: '票务核心库',
    schedule: '每日 02:00',
    mode: '全量',
    retry: true,
    sql: 'SELECT * FROM ticket_sale WHERE stat_date = \'${bizDate}\'',
});
const filteredTasks = computed(() => batchTasks.value.filter((task) => {
    if (filterStatus.value && task.status !== filterStatus.value)
        return false;
    if (!keyword.value)
        return true;
    return task.name.toLowerCase().includes(keyword.value.toLowerCase());
}));
const openCreate = () => {
    editingTask.value = null;
    Object.assign(form, {
        name: '',
        source: '票务核心库',
        schedule: '每日 02:00',
        mode: '全量',
        retry: true,
        sql: 'SELECT * FROM ticket_sale WHERE stat_date = \'${bizDate}\'',
    });
    editorVisible.value = true;
};
const openEditor = (row) => {
    editingTask.value = row;
    Object.assign(form, {
        name: row.name,
        source: row.sourceName,
        schedule: row.schedule,
        mode: modes[0],
        retry: true,
        sql: `SELECT * FROM ${row.sourceName.split(' ')[0].toLowerCase()} WHERE ${row.schedule.includes('增量') ? 'updated_at >= ${lastSyncTime}' : '1=1'}`,
    });
    editorVisible.value = true;
};
const saveForm = () => {
    if (!form.name.trim()) {
        ElMessage.warning('请输入任务名称');
        return;
    }
    if (editingTask.value) {
        ElMessage.success(`批量任务「${form.name}」已保存（Mock）`);
    }
    else {
        batchTasks.value.unshift({
            id: `dev-batch-${Date.now()}`,
            name: form.name,
            type: '批量',
            sourceName: form.source,
            targetName: '数仓 DWD',
            schedule: form.schedule,
            status: '待执行',
            progress: 0,
            dataCount: 0,
            owner: '张三',
            lastRunTime: '-',
            description: '新建批量任务',
            mode: form.mode,
        });
        ElMessage.success('批量任务已创建（Mock）');
    }
    editorVisible.value = false;
};
const cloneTask = (row) => {
    batchTasks.value.push({ ...row, name: `${row.name}（副本）`, id: `dev-clone-${Date.now()}` });
    ElMessage.success(`任务「${row.name}」已克隆（Mock）`);
};
const runTask = (row) => {
    row.status = '运行中';
    row.progress = 20;
    ElMessage.success(`任务「${row.name}」已触发执行（Mock）`);
};
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
    const __VLS_12 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
        ...{ 'onClick': {} },
        type: "danger",
        icon: (__VLS_ctx.Plus),
    }));
    const __VLS_14 = __VLS_13({
        ...{ 'onClick': {} },
        type: "danger",
        icon: (__VLS_ctx.Plus),
    }, ...__VLS_functionalComponentArgsRest(__VLS_13));
    let __VLS_16;
    let __VLS_17;
    let __VLS_18;
    const __VLS_19 = {
        onClick: (__VLS_ctx.openCreate)
    };
    __VLS_15.slots.default;
    var __VLS_15;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "toolbar-row" },
});
const __VLS_20 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
    modelValue: (__VLS_ctx.keyword),
    placeholder: "按任务名称搜索",
    clearable: true,
    ...{ class: "search-input" },
    prefixIcon: (__VLS_ctx.Search),
}));
const __VLS_22 = __VLS_21({
    modelValue: (__VLS_ctx.keyword),
    placeholder: "按任务名称搜索",
    clearable: true,
    ...{ class: "search-input" },
    prefixIcon: (__VLS_ctx.Search),
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
const __VLS_24 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    modelValue: (__VLS_ctx.filterStatus),
    placeholder: "状态",
    clearable: true,
    ...{ class: "filter-select" },
}));
const __VLS_26 = __VLS_25({
    modelValue: (__VLS_ctx.filterStatus),
    placeholder: "状态",
    clearable: true,
    ...{ class: "filter-select" },
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
__VLS_27.slots.default;
const __VLS_28 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
    label: "运行中",
    value: "运行中",
}));
const __VLS_30 = __VLS_29({
    label: "运行中",
    value: "运行中",
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
const __VLS_32 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
    label: "成功",
    value: "成功",
}));
const __VLS_34 = __VLS_33({
    label: "成功",
    value: "成功",
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
const __VLS_36 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    label: "失败",
    value: "失败",
}));
const __VLS_38 = __VLS_37({
    label: "失败",
    value: "失败",
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
const __VLS_40 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
    label: "待执行",
    value: "待执行",
}));
const __VLS_42 = __VLS_41({
    label: "待执行",
    value: "待执行",
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
var __VLS_27;
const __VLS_44 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    data: (__VLS_ctx.filteredTasks),
    stripe: true,
    ...{ class: "mt-12" },
}));
const __VLS_46 = __VLS_45({
    data: (__VLS_ctx.filteredTasks),
    stripe: true,
    ...{ class: "mt-12" },
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
__VLS_47.slots.default;
const __VLS_48 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
    prop: "name",
    label: "任务名称",
    minWidth: "180",
}));
const __VLS_50 = __VLS_49({
    prop: "name",
    label: "任务名称",
    minWidth: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
const __VLS_52 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
    prop: "sourceName",
    label: "数据源",
    width: "130",
}));
const __VLS_54 = __VLS_53({
    prop: "sourceName",
    label: "数据源",
    width: "130",
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
const __VLS_56 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
    prop: "schedule",
    label: "调度",
    width: "120",
}));
const __VLS_58 = __VLS_57({
    prop: "schedule",
    label: "调度",
    width: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
const __VLS_60 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
    label: "同步模式",
    width: "90",
}));
const __VLS_62 = __VLS_61({
    label: "同步模式",
    width: "90",
}, ...__VLS_functionalComponentArgsRest(__VLS_61));
__VLS_63.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_63.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    (row.mode);
}
var __VLS_63;
const __VLS_64 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
    label: "状态",
    width: "90",
}));
const __VLS_66 = __VLS_65({
    label: "状态",
    width: "90",
}, ...__VLS_functionalComponentArgsRest(__VLS_65));
__VLS_67.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_67.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_68 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
        type: (__VLS_ctx.statusTagType[row.status]),
        effect: "dark",
    }));
    const __VLS_70 = __VLS_69({
        type: (__VLS_ctx.statusTagType[row.status]),
        effect: "dark",
    }, ...__VLS_functionalComponentArgsRest(__VLS_69));
    __VLS_71.slots.default;
    (row.status);
    var __VLS_71;
}
var __VLS_67;
const __VLS_72 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
    label: "进度",
    minWidth: "130",
}));
const __VLS_74 = __VLS_73({
    label: "进度",
    minWidth: "130",
}, ...__VLS_functionalComponentArgsRest(__VLS_73));
__VLS_75.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_75.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_76 = {}.ElProgress;
    /** @type {[typeof __VLS_components.ElProgress, typeof __VLS_components.elProgress, ]} */ ;
    // @ts-ignore
    const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
        percentage: (row.progress),
        strokeWidth: (10),
    }));
    const __VLS_78 = __VLS_77({
        percentage: (row.progress),
        strokeWidth: (10),
    }, ...__VLS_functionalComponentArgsRest(__VLS_77));
}
var __VLS_75;
const __VLS_80 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
    label: "操作",
    width: "200",
    fixed: "right",
}));
const __VLS_82 = __VLS_81({
    label: "操作",
    width: "200",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_81));
__VLS_83.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_83.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_84 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
        ...{ 'onClick': {} },
        link: true,
        type: "danger",
    }));
    const __VLS_86 = __VLS_85({
        ...{ 'onClick': {} },
        link: true,
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_85));
    let __VLS_88;
    let __VLS_89;
    let __VLS_90;
    const __VLS_91 = {
        onClick: (...[$event]) => {
            __VLS_ctx.openEditor(row);
        }
    };
    __VLS_87.slots.default;
    var __VLS_87;
    const __VLS_92 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }));
    const __VLS_94 = __VLS_93({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_93));
    let __VLS_96;
    let __VLS_97;
    let __VLS_98;
    const __VLS_99 = {
        onClick: (...[$event]) => {
            __VLS_ctx.cloneTask(row);
        }
    };
    __VLS_95.slots.default;
    var __VLS_95;
    const __VLS_100 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
        ...{ 'onClick': {} },
        link: true,
        type: "warning",
    }));
    const __VLS_102 = __VLS_101({
        ...{ 'onClick': {} },
        link: true,
        type: "warning",
    }, ...__VLS_functionalComponentArgsRest(__VLS_101));
    let __VLS_104;
    let __VLS_105;
    let __VLS_106;
    const __VLS_107 = {
        onClick: (...[$event]) => {
            __VLS_ctx.runTask(row);
        }
    };
    __VLS_103.slots.default;
    var __VLS_103;
}
var __VLS_83;
var __VLS_47;
const __VLS_108 = {}.ElPagination;
/** @type {[typeof __VLS_components.ElPagination, typeof __VLS_components.elPagination, ]} */ ;
// @ts-ignore
const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
    ...{ class: "pager" },
    layout: "total, prev, pager, next",
    total: (__VLS_ctx.filteredTasks.length),
    pageSize: (20),
    background: true,
}));
const __VLS_110 = __VLS_109({
    ...{ class: "pager" },
    layout: "total, prev, pager, next",
    total: (__VLS_ctx.filteredTasks.length),
    pageSize: (20),
    background: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_109));
var __VLS_11;
var __VLS_7;
const __VLS_112 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
    span: (8),
}));
const __VLS_114 = __VLS_113({
    span: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_113));
__VLS_115.slots.default;
const __VLS_116 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
    ...{ class: "panel-card dashboard-card" },
    shadow: "never",
}));
const __VLS_118 = __VLS_117({
    ...{ class: "panel-card dashboard-card" },
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
    ...{ class: "operator-list" },
});
for (const [operator] of __VLS_getVForSourceType((__VLS_ctx.operators))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (operator.name),
        ...{ class: "operator-item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "operator-icon" },
    });
    const __VLS_120 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({
        size: (16),
    }));
    const __VLS_122 = __VLS_121({
        size: (16),
    }, ...__VLS_functionalComponentArgsRest(__VLS_121));
    __VLS_123.slots.default;
    const __VLS_124 = ((operator.icon));
    // @ts-ignore
    const __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({}));
    const __VLS_126 = __VLS_125({}, ...__VLS_functionalComponentArgsRest(__VLS_125));
    var __VLS_123;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "operator-name" },
    });
    (operator.name);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "operator-desc" },
    });
    (operator.desc);
}
var __VLS_119;
var __VLS_115;
var __VLS_3;
const __VLS_128 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({
    modelValue: (__VLS_ctx.editorVisible),
    title: (__VLS_ctx.editingTask ? '编辑批量任务' : '新建批量任务'),
    width: "680px",
}));
const __VLS_130 = __VLS_129({
    modelValue: (__VLS_ctx.editorVisible),
    title: (__VLS_ctx.editingTask ? '编辑批量任务' : '新建批量任务'),
    width: "680px",
}, ...__VLS_functionalComponentArgsRest(__VLS_129));
__VLS_131.slots.default;
const __VLS_132 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132({
    model: (__VLS_ctx.form),
    labelWidth: "100px",
}));
const __VLS_134 = __VLS_133({
    model: (__VLS_ctx.form),
    labelWidth: "100px",
}, ...__VLS_functionalComponentArgsRest(__VLS_133));
__VLS_135.slots.default;
const __VLS_136 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_137 = __VLS_asFunctionalComponent(__VLS_136, new __VLS_136({
    label: "任务名称",
}));
const __VLS_138 = __VLS_137({
    label: "任务名称",
}, ...__VLS_functionalComponentArgsRest(__VLS_137));
__VLS_139.slots.default;
const __VLS_140 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_141 = __VLS_asFunctionalComponent(__VLS_140, new __VLS_140({
    modelValue: (__VLS_ctx.form.name),
}));
const __VLS_142 = __VLS_141({
    modelValue: (__VLS_ctx.form.name),
}, ...__VLS_functionalComponentArgsRest(__VLS_141));
var __VLS_139;
const __VLS_144 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_145 = __VLS_asFunctionalComponent(__VLS_144, new __VLS_144({
    label: "数据源",
}));
const __VLS_146 = __VLS_145({
    label: "数据源",
}, ...__VLS_functionalComponentArgsRest(__VLS_145));
__VLS_147.slots.default;
const __VLS_148 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_149 = __VLS_asFunctionalComponent(__VLS_148, new __VLS_148({
    modelValue: (__VLS_ctx.form.source),
    ...{ class: "w-full" },
}));
const __VLS_150 = __VLS_149({
    modelValue: (__VLS_ctx.form.source),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_149));
__VLS_151.slots.default;
for (const [source] of __VLS_getVForSourceType((__VLS_ctx.sources))) {
    const __VLS_152 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_153 = __VLS_asFunctionalComponent(__VLS_152, new __VLS_152({
        key: (source),
        label: (source),
        value: (source),
    }));
    const __VLS_154 = __VLS_153({
        key: (source),
        label: (source),
        value: (source),
    }, ...__VLS_functionalComponentArgsRest(__VLS_153));
}
var __VLS_151;
var __VLS_147;
const __VLS_156 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_157 = __VLS_asFunctionalComponent(__VLS_156, new __VLS_156({
    label: "调度配置",
}));
const __VLS_158 = __VLS_157({
    label: "调度配置",
}, ...__VLS_functionalComponentArgsRest(__VLS_157));
__VLS_159.slots.default;
const __VLS_160 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_161 = __VLS_asFunctionalComponent(__VLS_160, new __VLS_160({
    modelValue: (__VLS_ctx.form.schedule),
    ...{ class: "w-full" },
}));
const __VLS_162 = __VLS_161({
    modelValue: (__VLS_ctx.form.schedule),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_161));
__VLS_163.slots.default;
for (const [schedule] of __VLS_getVForSourceType((__VLS_ctx.schedules))) {
    const __VLS_164 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_165 = __VLS_asFunctionalComponent(__VLS_164, new __VLS_164({
        key: (schedule),
        label: (schedule),
        value: (schedule),
    }));
    const __VLS_166 = __VLS_165({
        key: (schedule),
        label: (schedule),
        value: (schedule),
    }, ...__VLS_functionalComponentArgsRest(__VLS_165));
}
var __VLS_163;
var __VLS_159;
const __VLS_168 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_169 = __VLS_asFunctionalComponent(__VLS_168, new __VLS_168({
    label: "同步模式",
}));
const __VLS_170 = __VLS_169({
    label: "同步模式",
}, ...__VLS_functionalComponentArgsRest(__VLS_169));
__VLS_171.slots.default;
const __VLS_172 = {}.ElRadioGroup;
/** @type {[typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, ]} */ ;
// @ts-ignore
const __VLS_173 = __VLS_asFunctionalComponent(__VLS_172, new __VLS_172({
    modelValue: (__VLS_ctx.form.mode),
}));
const __VLS_174 = __VLS_173({
    modelValue: (__VLS_ctx.form.mode),
}, ...__VLS_functionalComponentArgsRest(__VLS_173));
__VLS_175.slots.default;
const __VLS_176 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
const __VLS_177 = __VLS_asFunctionalComponent(__VLS_176, new __VLS_176({
    value: "全量",
}));
const __VLS_178 = __VLS_177({
    value: "全量",
}, ...__VLS_functionalComponentArgsRest(__VLS_177));
const __VLS_180 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
const __VLS_181 = __VLS_asFunctionalComponent(__VLS_180, new __VLS_180({
    value: "增量-时间戳",
}));
const __VLS_182 = __VLS_181({
    value: "增量-时间戳",
}, ...__VLS_functionalComponentArgsRest(__VLS_181));
const __VLS_184 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
const __VLS_185 = __VLS_asFunctionalComponent(__VLS_184, new __VLS_184({
    value: "增量-自增ID",
}));
const __VLS_186 = __VLS_185({
    value: "增量-自增ID",
}, ...__VLS_functionalComponentArgsRest(__VLS_185));
const __VLS_188 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
const __VLS_189 = __VLS_asFunctionalComponent(__VLS_188, new __VLS_188({
    value: "刷新采集",
}));
const __VLS_190 = __VLS_189({
    value: "刷新采集",
}, ...__VLS_functionalComponentArgsRest(__VLS_189));
const __VLS_192 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
const __VLS_193 = __VLS_asFunctionalComponent(__VLS_192, new __VLS_192({
    value: "数据比对",
}));
const __VLS_194 = __VLS_193({
    value: "数据比对",
}, ...__VLS_functionalComponentArgsRest(__VLS_193));
var __VLS_175;
var __VLS_171;
const __VLS_196 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_197 = __VLS_asFunctionalComponent(__VLS_196, new __VLS_196({
    label: "失败重试",
}));
const __VLS_198 = __VLS_197({
    label: "失败重试",
}, ...__VLS_functionalComponentArgsRest(__VLS_197));
__VLS_199.slots.default;
const __VLS_200 = {}.ElCheckbox;
/** @type {[typeof __VLS_components.ElCheckbox, typeof __VLS_components.elCheckbox, typeof __VLS_components.ElCheckbox, typeof __VLS_components.elCheckbox, ]} */ ;
// @ts-ignore
const __VLS_201 = __VLS_asFunctionalComponent(__VLS_200, new __VLS_200({
    modelValue: (__VLS_ctx.form.retry),
}));
const __VLS_202 = __VLS_201({
    modelValue: (__VLS_ctx.form.retry),
}, ...__VLS_functionalComponentArgsRest(__VLS_201));
__VLS_203.slots.default;
var __VLS_203;
var __VLS_199;
const __VLS_204 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_205 = __VLS_asFunctionalComponent(__VLS_204, new __VLS_204({
    label: "SQL 脚本",
}));
const __VLS_206 = __VLS_205({
    label: "SQL 脚本",
}, ...__VLS_functionalComponentArgsRest(__VLS_205));
__VLS_207.slots.default;
const __VLS_208 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_209 = __VLS_asFunctionalComponent(__VLS_208, new __VLS_208({
    modelValue: (__VLS_ctx.form.sql),
    type: "textarea",
    rows: (6),
    ...{ class: "sql-editor" },
}));
const __VLS_210 = __VLS_209({
    modelValue: (__VLS_ctx.form.sql),
    type: "textarea",
    rows: (6),
    ...{ class: "sql-editor" },
}, ...__VLS_functionalComponentArgsRest(__VLS_209));
var __VLS_207;
var __VLS_135;
{
    const { footer: __VLS_thisSlot } = __VLS_131.slots;
    const __VLS_212 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_213 = __VLS_asFunctionalComponent(__VLS_212, new __VLS_212({
        ...{ 'onClick': {} },
    }));
    const __VLS_214 = __VLS_213({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_213));
    let __VLS_216;
    let __VLS_217;
    let __VLS_218;
    const __VLS_219 = {
        onClick: (...[$event]) => {
            __VLS_ctx.editorVisible = false;
        }
    };
    __VLS_215.slots.default;
    var __VLS_215;
    const __VLS_220 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_221 = __VLS_asFunctionalComponent(__VLS_220, new __VLS_220({
        ...{ 'onClick': {} },
        type: "danger",
    }));
    const __VLS_222 = __VLS_221({
        ...{ 'onClick': {} },
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_221));
    let __VLS_224;
    let __VLS_225;
    let __VLS_226;
    const __VLS_227 = {
        onClick: (__VLS_ctx.saveForm)
    };
    __VLS_223.slots.default;
    var __VLS_223;
}
var __VLS_131;
/** @type {__VLS_StyleScopedClasses['standard-page']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['toolbar-row']} */ ;
/** @type {__VLS_StyleScopedClasses['search-input']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-select']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-12']} */ ;
/** @type {__VLS_StyleScopedClasses['pager']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['operator-list']} */ ;
/** @type {__VLS_StyleScopedClasses['operator-item']} */ ;
/** @type {__VLS_StyleScopedClasses['operator-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['operator-name']} */ ;
/** @type {__VLS_StyleScopedClasses['operator-desc']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['sql-editor']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Plus: Plus,
            Search: Search,
            statusTagType: statusTagType,
            operators: operators,
            sources: sources,
            schedules: schedules,
            keyword: keyword,
            filterStatus: filterStatus,
            editorVisible: editorVisible,
            editingTask: editingTask,
            form: form,
            filteredTasks: filteredTasks,
            openCreate: openCreate,
            openEditor: openEditor,
            saveForm: saveForm,
            cloneTask: cloneTask,
            runTask: runTask,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
