import { computed, reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { InfoFilled, Plus, Search } from '@element-plus/icons-vue';
import { mockCollectionTasks } from '@/mock/metadata';
const keyword = ref('');
const filterStatus = ref('');
const filterType = ref('');
const createVisible = ref(false);
const createStep = ref(0);
const sourceTypes = Array.from(new Set(mockCollectionTasks.map((item) => item.sourceType)));
const statusTagType = {
    成功: 'success',
    运行中: 'warning',
    失败: 'danger',
    等待调度: 'info',
};
const usedSources = Array.from(new Set(mockCollectionTasks.map((item) => item.sourceName)));
const availableSources = ['票务核心库', '设备信号库', '客流分析库', '建设进度库', '资产管理系统', '运维工单库'].filter((source) => !usedSources.includes(source));
const scopeOptions = ['表结构', '字段信息', '主键索引', '存储过程', '视图定义', '分区信息'];
const createForm = reactive({
    sourceName: '',
    scope: ['表结构', '字段信息'],
    schedule: '每日 02:00',
    name: '',
});
const filteredTasks = computed(() => mockCollectionTasks.filter((task) => {
    if (filterStatus.value && task.status !== filterStatus.value)
        return false;
    if (filterType.value && task.sourceType !== filterType.value)
        return false;
    if (!keyword.value)
        return true;
    const kw = keyword.value.toLowerCase();
    return task.name.toLowerCase().includes(kw) || task.sourceName.toLowerCase().includes(kw);
}));
const openCreate = () => {
    createStep.value = 0;
    Object.assign(createForm, { sourceName: '', scope: ['表结构', '字段信息'], schedule: '每日 02:00', name: '' });
    createVisible.value = true;
};
const submitCreate = () => {
    if (!createForm.sourceName || !createForm.name) {
        ElMessage.warning('请完整填写任务信息');
        return;
    }
    mockCollectionTasks.unshift({
        id: `task-mock-${Date.now()}`,
        name: createForm.name,
        sourceName: createForm.sourceName,
        sourceType: 'MySQL',
        schedule: createForm.schedule,
        status: '等待调度',
        collectedCount: 0,
        lastRunTime: '-',
        owner: '张三',
    });
    createVisible.value = false;
    ElMessage.success('采集任务已创建（Mock）');
};
const runNow = (row) => {
    row.status = '运行中';
    ElMessage.success(`任务「${row.name}」已触发立即执行（Mock）`);
};
const rerunTask = (row) => {
    row.status = '运行中';
    ElMessage.success(`任务「${row.name}」已重跑（Mock）`);
};
const stopTask = (row) => {
    row.status = '等待调度';
    ElMessage.info(`任务「${row.name}」已中止（Mock）`);
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "standard-page" },
});
const __VLS_0 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ class: "panel-card dashboard-card" },
    shadow: "never",
}));
const __VLS_2 = __VLS_1({
    ...{ class: "panel-card dashboard-card" },
    shadow: "never",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_3.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    const __VLS_4 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
        ...{ 'onClick': {} },
        type: "danger",
        icon: (__VLS_ctx.Plus),
    }));
    const __VLS_6 = __VLS_5({
        ...{ 'onClick': {} },
        type: "danger",
        icon: (__VLS_ctx.Plus),
    }, ...__VLS_functionalComponentArgsRest(__VLS_5));
    let __VLS_8;
    let __VLS_9;
    let __VLS_10;
    const __VLS_11 = {
        onClick: (__VLS_ctx.openCreate)
    };
    __VLS_7.slots.default;
    var __VLS_7;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "toolbar-row" },
});
const __VLS_12 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
    modelValue: (__VLS_ctx.keyword),
    placeholder: "按任务名称 / 数据源搜索",
    clearable: true,
    ...{ class: "search-input" },
    prefixIcon: (__VLS_ctx.Search),
}));
const __VLS_14 = __VLS_13({
    modelValue: (__VLS_ctx.keyword),
    placeholder: "按任务名称 / 数据源搜索",
    clearable: true,
    ...{ class: "search-input" },
    prefixIcon: (__VLS_ctx.Search),
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
const __VLS_16 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    modelValue: (__VLS_ctx.filterStatus),
    placeholder: "任务状态",
    clearable: true,
    ...{ class: "filter-select" },
}));
const __VLS_18 = __VLS_17({
    modelValue: (__VLS_ctx.filterStatus),
    placeholder: "任务状态",
    clearable: true,
    ...{ class: "filter-select" },
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
__VLS_19.slots.default;
const __VLS_20 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
    label: "成功",
    value: "成功",
}));
const __VLS_22 = __VLS_21({
    label: "成功",
    value: "成功",
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
const __VLS_24 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    label: "运行中",
    value: "运行中",
}));
const __VLS_26 = __VLS_25({
    label: "运行中",
    value: "运行中",
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
const __VLS_28 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
    label: "失败",
    value: "失败",
}));
const __VLS_30 = __VLS_29({
    label: "失败",
    value: "失败",
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
const __VLS_32 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
    label: "等待调度",
    value: "等待调度",
}));
const __VLS_34 = __VLS_33({
    label: "等待调度",
    value: "等待调度",
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
var __VLS_19;
const __VLS_36 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    modelValue: (__VLS_ctx.filterType),
    placeholder: "数据源类型",
    clearable: true,
    ...{ class: "filter-select" },
}));
const __VLS_38 = __VLS_37({
    modelValue: (__VLS_ctx.filterType),
    placeholder: "数据源类型",
    clearable: true,
    ...{ class: "filter-select" },
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
__VLS_39.slots.default;
for (const [type] of __VLS_getVForSourceType((__VLS_ctx.sourceTypes))) {
    const __VLS_40 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
        key: (type),
        label: (type),
        value: (type),
    }));
    const __VLS_42 = __VLS_41({
        key: (type),
        label: (type),
        value: (type),
    }, ...__VLS_functionalComponentArgsRest(__VLS_41));
}
var __VLS_39;
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
    minWidth: "200",
}));
const __VLS_50 = __VLS_49({
    prop: "name",
    label: "任务名称",
    minWidth: "200",
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
const __VLS_52 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
    prop: "sourceName",
    label: "数据源",
    width: "140",
}));
const __VLS_54 = __VLS_53({
    prop: "sourceName",
    label: "数据源",
    width: "140",
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
const __VLS_56 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
    prop: "sourceType",
    label: "类型",
    width: "100",
}));
const __VLS_58 = __VLS_57({
    prop: "sourceType",
    label: "类型",
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
const __VLS_60 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
    prop: "schedule",
    label: "调度方式",
    width: "130",
}));
const __VLS_62 = __VLS_61({
    prop: "schedule",
    label: "调度方式",
    width: "130",
}, ...__VLS_functionalComponentArgsRest(__VLS_61));
const __VLS_64 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
    label: "状态",
    width: "100",
}));
const __VLS_66 = __VLS_65({
    label: "状态",
    width: "100",
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
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
    prop: "collectedCount",
    label: "已采集(条)",
    width: "110",
    align: "center",
}));
const __VLS_74 = __VLS_73({
    prop: "collectedCount",
    label: "已采集(条)",
    width: "110",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_73));
const __VLS_76 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
    prop: "lastRunTime",
    label: "上次执行",
    width: "150",
}));
const __VLS_78 = __VLS_77({
    prop: "lastRunTime",
    label: "上次执行",
    width: "150",
}, ...__VLS_functionalComponentArgsRest(__VLS_77));
const __VLS_80 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
    prop: "owner",
    label: "负责人",
    width: "90",
}));
const __VLS_82 = __VLS_81({
    prop: "owner",
    label: "负责人",
    width: "90",
}, ...__VLS_functionalComponentArgsRest(__VLS_81));
const __VLS_84 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
    label: "操作",
    width: "240",
    fixed: "right",
}));
const __VLS_86 = __VLS_85({
    label: "操作",
    width: "240",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_85));
__VLS_87.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_87.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_88 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }));
    const __VLS_90 = __VLS_89({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_89));
    let __VLS_92;
    let __VLS_93;
    let __VLS_94;
    const __VLS_95 = {
        onClick: (...[$event]) => {
            __VLS_ctx.runNow(row);
        }
    };
    __VLS_91.slots.default;
    var __VLS_91;
    const __VLS_96 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
        ...{ 'onClick': {} },
        link: true,
        type: "warning",
    }));
    const __VLS_98 = __VLS_97({
        ...{ 'onClick': {} },
        link: true,
        type: "warning",
    }, ...__VLS_functionalComponentArgsRest(__VLS_97));
    let __VLS_100;
    let __VLS_101;
    let __VLS_102;
    const __VLS_103 = {
        onClick: (...[$event]) => {
            __VLS_ctx.rerunTask(row);
        }
    };
    __VLS_99.slots.default;
    var __VLS_99;
    const __VLS_104 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
        ...{ 'onClick': {} },
        link: true,
        type: "danger",
    }));
    const __VLS_106 = __VLS_105({
        ...{ 'onClick': {} },
        link: true,
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_105));
    let __VLS_108;
    let __VLS_109;
    let __VLS_110;
    const __VLS_111 = {
        onClick: (...[$event]) => {
            __VLS_ctx.stopTask(row);
        }
    };
    __VLS_107.slots.default;
    var __VLS_107;
}
var __VLS_87;
var __VLS_47;
const __VLS_112 = {}.ElPagination;
/** @type {[typeof __VLS_components.ElPagination, typeof __VLS_components.elPagination, ]} */ ;
// @ts-ignore
const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
    ...{ class: "pager" },
    layout: "total, prev, pager, next",
    total: (__VLS_ctx.filteredTasks.length),
    pageSize: (20),
    background: true,
}));
const __VLS_114 = __VLS_113({
    ...{ class: "pager" },
    layout: "total, prev, pager, next",
    total: (__VLS_ctx.filteredTasks.length),
    pageSize: (20),
    background: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_113));
var __VLS_3;
const __VLS_116 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
    modelValue: (__VLS_ctx.createVisible),
    title: "创建采集任务",
    width: "620px",
}));
const __VLS_118 = __VLS_117({
    modelValue: (__VLS_ctx.createVisible),
    title: "创建采集任务",
    width: "620px",
}, ...__VLS_functionalComponentArgsRest(__VLS_117));
__VLS_119.slots.default;
const __VLS_120 = {}.ElSteps;
/** @type {[typeof __VLS_components.ElSteps, typeof __VLS_components.elSteps, typeof __VLS_components.ElSteps, typeof __VLS_components.elSteps, ]} */ ;
// @ts-ignore
const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({
    active: (__VLS_ctx.createStep),
    alignCenter: true,
    finishStatus: "success",
    ...{ class: "register-steps" },
}));
const __VLS_122 = __VLS_121({
    active: (__VLS_ctx.createStep),
    alignCenter: true,
    finishStatus: "success",
    ...{ class: "register-steps" },
}, ...__VLS_functionalComponentArgsRest(__VLS_121));
__VLS_123.slots.default;
const __VLS_124 = {}.ElStep;
/** @type {[typeof __VLS_components.ElStep, typeof __VLS_components.elStep, ]} */ ;
// @ts-ignore
const __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({
    title: "选择数据源",
}));
const __VLS_126 = __VLS_125({
    title: "选择数据源",
}, ...__VLS_functionalComponentArgsRest(__VLS_125));
const __VLS_128 = {}.ElStep;
/** @type {[typeof __VLS_components.ElStep, typeof __VLS_components.elStep, ]} */ ;
// @ts-ignore
const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({
    title: "选择采集范围",
}));
const __VLS_130 = __VLS_129({
    title: "选择采集范围",
}, ...__VLS_functionalComponentArgsRest(__VLS_129));
const __VLS_132 = {}.ElStep;
/** @type {[typeof __VLS_components.ElStep, typeof __VLS_components.elStep, ]} */ ;
// @ts-ignore
const __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132({
    title: "调度配置",
}));
const __VLS_134 = __VLS_133({
    title: "调度配置",
}, ...__VLS_functionalComponentArgsRest(__VLS_133));
var __VLS_123;
if (__VLS_ctx.createStep === 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    const __VLS_136 = {}.ElSelect;
    /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
    // @ts-ignore
    const __VLS_137 = __VLS_asFunctionalComponent(__VLS_136, new __VLS_136({
        modelValue: (__VLS_ctx.createForm.sourceName),
        placeholder: "选择数据源",
        ...{ class: "w-full" },
    }));
    const __VLS_138 = __VLS_137({
        modelValue: (__VLS_ctx.createForm.sourceName),
        placeholder: "选择数据源",
        ...{ class: "w-full" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_137));
    __VLS_139.slots.default;
    for (const [source] of __VLS_getVForSourceType((__VLS_ctx.availableSources))) {
        const __VLS_140 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_141 = __VLS_asFunctionalComponent(__VLS_140, new __VLS_140({
            key: (source),
            label: (source),
            value: (source),
        }));
        const __VLS_142 = __VLS_141({
            key: (source),
            label: (source),
            value: (source),
        }, ...__VLS_functionalComponentArgsRest(__VLS_141));
    }
    var __VLS_139;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "used-source-tip" },
    });
    const __VLS_144 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_145 = __VLS_asFunctionalComponent(__VLS_144, new __VLS_144({}));
    const __VLS_146 = __VLS_145({}, ...__VLS_functionalComponentArgsRest(__VLS_145));
    __VLS_147.slots.default;
    const __VLS_148 = {}.InfoFilled;
    /** @type {[typeof __VLS_components.InfoFilled, ]} */ ;
    // @ts-ignore
    const __VLS_149 = __VLS_asFunctionalComponent(__VLS_148, new __VLS_148({}));
    const __VLS_150 = __VLS_149({}, ...__VLS_functionalComponentArgsRest(__VLS_149));
    var __VLS_147;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "used-source-tags" },
    });
    for (const [source] of __VLS_getVForSourceType((__VLS_ctx.usedSources))) {
        const __VLS_152 = {}.ElTag;
        /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
        // @ts-ignore
        const __VLS_153 = __VLS_asFunctionalComponent(__VLS_152, new __VLS_152({
            key: (source),
            type: "info",
            effect: "plain",
            disabled: true,
        }));
        const __VLS_154 = __VLS_153({
            key: (source),
            type: "info",
            effect: "plain",
            disabled: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_153));
        __VLS_155.slots.default;
        (source);
        var __VLS_155;
    }
}
else if (__VLS_ctx.createStep === 1) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    const __VLS_156 = {}.ElCheckboxGroup;
    /** @type {[typeof __VLS_components.ElCheckboxGroup, typeof __VLS_components.elCheckboxGroup, typeof __VLS_components.ElCheckboxGroup, typeof __VLS_components.elCheckboxGroup, ]} */ ;
    // @ts-ignore
    const __VLS_157 = __VLS_asFunctionalComponent(__VLS_156, new __VLS_156({
        modelValue: (__VLS_ctx.createForm.scope),
    }));
    const __VLS_158 = __VLS_157({
        modelValue: (__VLS_ctx.createForm.scope),
    }, ...__VLS_functionalComponentArgsRest(__VLS_157));
    __VLS_159.slots.default;
    for (const [scope] of __VLS_getVForSourceType((__VLS_ctx.scopeOptions))) {
        const __VLS_160 = {}.ElCheckbox;
        /** @type {[typeof __VLS_components.ElCheckbox, typeof __VLS_components.elCheckbox, ]} */ ;
        // @ts-ignore
        const __VLS_161 = __VLS_asFunctionalComponent(__VLS_160, new __VLS_160({
            key: (scope),
            label: (scope),
        }));
        const __VLS_162 = __VLS_161({
            key: (scope),
            label: (scope),
        }, ...__VLS_functionalComponentArgsRest(__VLS_161));
    }
    var __VLS_159;
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    const __VLS_164 = {}.ElForm;
    /** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
    // @ts-ignore
    const __VLS_165 = __VLS_asFunctionalComponent(__VLS_164, new __VLS_164({
        labelWidth: "100px",
    }));
    const __VLS_166 = __VLS_165({
        labelWidth: "100px",
    }, ...__VLS_functionalComponentArgsRest(__VLS_165));
    __VLS_167.slots.default;
    const __VLS_168 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_169 = __VLS_asFunctionalComponent(__VLS_168, new __VLS_168({
        label: "调度方式",
    }));
    const __VLS_170 = __VLS_169({
        label: "调度方式",
    }, ...__VLS_functionalComponentArgsRest(__VLS_169));
    __VLS_171.slots.default;
    const __VLS_172 = {}.ElSelect;
    /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
    // @ts-ignore
    const __VLS_173 = __VLS_asFunctionalComponent(__VLS_172, new __VLS_172({
        modelValue: (__VLS_ctx.createForm.schedule),
        ...{ class: "w-full" },
    }));
    const __VLS_174 = __VLS_173({
        modelValue: (__VLS_ctx.createForm.schedule),
        ...{ class: "w-full" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_173));
    __VLS_175.slots.default;
    const __VLS_176 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_177 = __VLS_asFunctionalComponent(__VLS_176, new __VLS_176({
        label: "每分钟",
        value: "每分钟",
    }));
    const __VLS_178 = __VLS_177({
        label: "每分钟",
        value: "每分钟",
    }, ...__VLS_functionalComponentArgsRest(__VLS_177));
    const __VLS_180 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_181 = __VLS_asFunctionalComponent(__VLS_180, new __VLS_180({
        label: "每小时",
        value: "每小时",
    }));
    const __VLS_182 = __VLS_181({
        label: "每小时",
        value: "每小时",
    }, ...__VLS_functionalComponentArgsRest(__VLS_181));
    const __VLS_184 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_185 = __VLS_asFunctionalComponent(__VLS_184, new __VLS_184({
        label: "每日 02:00",
        value: "每日 02:00",
    }));
    const __VLS_186 = __VLS_185({
        label: "每日 02:00",
        value: "每日 02:00",
    }, ...__VLS_functionalComponentArgsRest(__VLS_185));
    const __VLS_188 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_189 = __VLS_asFunctionalComponent(__VLS_188, new __VLS_188({
        label: "每周一 03:00",
        value: "每周一 03:00",
    }));
    const __VLS_190 = __VLS_189({
        label: "每周一 03:00",
        value: "每周一 03:00",
    }, ...__VLS_functionalComponentArgsRest(__VLS_189));
    const __VLS_192 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_193 = __VLS_asFunctionalComponent(__VLS_192, new __VLS_192({
        label: "立即执行",
        value: "立即执行",
    }));
    const __VLS_194 = __VLS_193({
        label: "立即执行",
        value: "立即执行",
    }, ...__VLS_functionalComponentArgsRest(__VLS_193));
    var __VLS_175;
    var __VLS_171;
    const __VLS_196 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_197 = __VLS_asFunctionalComponent(__VLS_196, new __VLS_196({
        label: "任务名称",
    }));
    const __VLS_198 = __VLS_197({
        label: "任务名称",
    }, ...__VLS_functionalComponentArgsRest(__VLS_197));
    __VLS_199.slots.default;
    const __VLS_200 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_201 = __VLS_asFunctionalComponent(__VLS_200, new __VLS_200({
        modelValue: (__VLS_ctx.createForm.name),
    }));
    const __VLS_202 = __VLS_201({
        modelValue: (__VLS_ctx.createForm.name),
    }, ...__VLS_functionalComponentArgsRest(__VLS_201));
    var __VLS_199;
    var __VLS_167;
}
{
    const { footer: __VLS_thisSlot } = __VLS_119.slots;
    if (__VLS_ctx.createStep > 0) {
        const __VLS_204 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_205 = __VLS_asFunctionalComponent(__VLS_204, new __VLS_204({
            ...{ 'onClick': {} },
        }));
        const __VLS_206 = __VLS_205({
            ...{ 'onClick': {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_205));
        let __VLS_208;
        let __VLS_209;
        let __VLS_210;
        const __VLS_211 = {
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.createStep > 0))
                    return;
                __VLS_ctx.createStep -= 1;
            }
        };
        __VLS_207.slots.default;
        var __VLS_207;
    }
    if (__VLS_ctx.createStep < 2) {
        const __VLS_212 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_213 = __VLS_asFunctionalComponent(__VLS_212, new __VLS_212({
            ...{ 'onClick': {} },
            type: "danger",
        }));
        const __VLS_214 = __VLS_213({
            ...{ 'onClick': {} },
            type: "danger",
        }, ...__VLS_functionalComponentArgsRest(__VLS_213));
        let __VLS_216;
        let __VLS_217;
        let __VLS_218;
        const __VLS_219 = {
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.createStep < 2))
                    return;
                __VLS_ctx.createStep += 1;
            }
        };
        __VLS_215.slots.default;
        var __VLS_215;
    }
    else {
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
            onClick: (__VLS_ctx.submitCreate)
        };
        __VLS_223.slots.default;
        var __VLS_223;
    }
}
var __VLS_119;
/** @type {__VLS_StyleScopedClasses['standard-page']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['toolbar-row']} */ ;
/** @type {__VLS_StyleScopedClasses['search-input']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-select']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-select']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-12']} */ ;
/** @type {__VLS_StyleScopedClasses['pager']} */ ;
/** @type {__VLS_StyleScopedClasses['register-steps']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['used-source-tip']} */ ;
/** @type {__VLS_StyleScopedClasses['used-source-tags']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            InfoFilled: InfoFilled,
            Plus: Plus,
            Search: Search,
            keyword: keyword,
            filterStatus: filterStatus,
            filterType: filterType,
            createVisible: createVisible,
            createStep: createStep,
            sourceTypes: sourceTypes,
            statusTagType: statusTagType,
            usedSources: usedSources,
            availableSources: availableSources,
            scopeOptions: scopeOptions,
            createForm: createForm,
            filteredTasks: filteredTasks,
            openCreate: openCreate,
            submitCreate: submitCreate,
            runNow: runNow,
            rerunTask: rerunTask,
            stopTask: stopTask,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
