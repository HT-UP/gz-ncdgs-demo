import { computed, reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { Connection, Plus, Search } from '@element-plus/icons-vue';
import { mockQualityTasks } from '@/mock/quality';
const statusTagType = {
    运行中: 'warning',
    成功: 'success',
    失败: 'danger',
    待执行: 'warning',
};
const tasks = ref(mockQualityTasks.map((task, index) => ({
    ...task,
    dependencies: index % 2 === 0 ? `上游任务 qt-${(index % 5) + 1}` : '',
})));
const keyword = ref('');
const filterTrigger = ref('');
const filterStatus = ref('');
const createVisible = ref(false);
const problemVisible = ref(false);
const logVisible = ref(false);
const dagVisible = ref(false);
const logTaskName = ref('');
const createForm = reactive({
    name: '',
    trigger: '周期调度',
    schedule: '每日 03:00',
    scope: '票务核心库',
    incremental: true,
});
const problemRows = [
    { pk: 'TS-20260811-0001', field: 'cust_name', value: 'null', ruleName: '必填字段完整性检查', severity: '严重' },
    { pk: 'TS-20260811-0002', field: 'flow_count', value: '-128', ruleName: '客流量数值范围校验', severity: '严重' },
    { pk: 'TS-20260811-0003', field: 'phone', value: '138****', ruleName: '手机号格式准确性', severity: '警告' },
    { pk: 'TS-20260811-0004', field: 'ticket_no', value: '重复: T20260808015', ruleName: '票号唯一性检查', severity: '警告' },
    { pk: 'TS-20260811-0005', field: 'stat_date', value: '2026-08-09', ruleName: '数据及时性检查', severity: '提示' },
];
const logContent = `2026-08-11 03:00:02 [INFO] 质量任务启动（周期调度）
2026-08-11 03:00:05 [INFO] 加载 8 条检查规则
2026-08-11 03:00:45 [INFO] 完整性检查完成：通过 99.2%
2026-08-11 03:01:20 [WARN] 准确性检查发现 12 条异常（flow_count 为负值）
2026-08-11 03:02:10 [INFO] 一致性检查通过
2026-08-11 03:02:40 [WARN] 唯一性检查发现 8 条重复票号
2026-08-11 03:03:02 [INFO] 任务执行成功，共检查 1,280,450 条数据
2026-08-11 03:03:02 [INFO] 问题数据已生成工单，通知处理人`;
const dagNodes = [
    { name: '元数据采集任务', status: '已完成' },
    { name: '数据标准映射', status: '已完成' },
    { name: '票务数据质量检查（当前）', status: '运行中' },
    { name: '问题工单生成', status: '待执行' },
];
const filteredTasks = computed(() => tasks.value.filter((task) => {
    if (filterTrigger.value && task.trigger !== filterTrigger.value)
        return false;
    if (filterStatus.value && task.status !== filterStatus.value)
        return false;
    if (!keyword.value)
        return true;
    const kw = keyword.value.toLowerCase();
    return task.name.toLowerCase().includes(kw) || task.owner.toLowerCase().includes(kw);
}));
const openCreate = () => {
    Object.assign(createForm, { name: '', trigger: '周期调度', schedule: '每日 03:00', scope: '票务核心库', incremental: true });
    createVisible.value = true;
};
const saveCreate = () => {
    if (!createForm.name.trim()) {
        ElMessage.warning('请输入任务名称');
        return;
    }
    tasks.value.unshift({
        id: `qt-mock-${Date.now()}`,
        name: createForm.name,
        ruleCount: 8,
        trigger: createForm.trigger,
        schedule: createForm.schedule,
        status: '待执行',
        progress: 0,
        passCount: 0,
        problemCount: 0,
        owner: '张三',
        lastRunTime: '-',
        scope: createForm.scope,
        dependencies: '',
    });
    createVisible.value = false;
    ElMessage.success('质量任务已创建（Mock）');
};
const showProblems = (row) => {
    problemVisible.value = true;
};
const showLog = (row) => {
    logTaskName.value = row.name;
    logVisible.value = true;
};
const runTask = (row) => {
    row.status = '运行中';
    row.progress = 25;
    ElMessage.success(`任务「${row.name}」已触发执行（Mock）`);
};
const showDag = (row) => {
    dagVisible.value = true;
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
    placeholder: "按任务名称 / 负责人搜索",
    clearable: true,
    ...{ class: "search-input" },
    prefixIcon: (__VLS_ctx.Search),
}));
const __VLS_22 = __VLS_21({
    modelValue: (__VLS_ctx.keyword),
    placeholder: "按任务名称 / 负责人搜索",
    clearable: true,
    ...{ class: "search-input" },
    prefixIcon: (__VLS_ctx.Search),
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
const __VLS_24 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    modelValue: (__VLS_ctx.filterTrigger),
    placeholder: "触发方式",
    clearable: true,
    ...{ class: "filter-select" },
}));
const __VLS_26 = __VLS_25({
    modelValue: (__VLS_ctx.filterTrigger),
    placeholder: "触发方式",
    clearable: true,
    ...{ class: "filter-select" },
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
__VLS_27.slots.default;
const __VLS_28 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
    label: "周期调度",
    value: "周期调度",
}));
const __VLS_30 = __VLS_29({
    label: "周期调度",
    value: "周期调度",
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
const __VLS_32 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
    label: "实时触发",
    value: "实时触发",
}));
const __VLS_34 = __VLS_33({
    label: "实时触发",
    value: "实时触发",
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
const __VLS_36 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    label: "手动执行",
    value: "手动执行",
}));
const __VLS_38 = __VLS_37({
    label: "手动执行",
    value: "手动执行",
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
var __VLS_27;
const __VLS_40 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
    modelValue: (__VLS_ctx.filterStatus),
    placeholder: "状态",
    clearable: true,
    ...{ class: "filter-select" },
}));
const __VLS_42 = __VLS_41({
    modelValue: (__VLS_ctx.filterStatus),
    placeholder: "状态",
    clearable: true,
    ...{ class: "filter-select" },
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
__VLS_43.slots.default;
const __VLS_44 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    label: "运行中",
    value: "运行中",
}));
const __VLS_46 = __VLS_45({
    label: "运行中",
    value: "运行中",
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
const __VLS_48 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
    label: "成功",
    value: "成功",
}));
const __VLS_50 = __VLS_49({
    label: "成功",
    value: "成功",
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
const __VLS_52 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
    label: "失败",
    value: "失败",
}));
const __VLS_54 = __VLS_53({
    label: "失败",
    value: "失败",
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
const __VLS_56 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
    label: "待执行",
    value: "待执行",
}));
const __VLS_58 = __VLS_57({
    label: "待执行",
    value: "待执行",
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
var __VLS_43;
const __VLS_60 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
    data: (__VLS_ctx.filteredTasks),
    stripe: true,
    ...{ class: "mt-12" },
}));
const __VLS_62 = __VLS_61({
    data: (__VLS_ctx.filteredTasks),
    stripe: true,
    ...{ class: "mt-12" },
}, ...__VLS_functionalComponentArgsRest(__VLS_61));
__VLS_63.slots.default;
const __VLS_64 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
    prop: "name",
    label: "任务名称",
    minWidth: "170",
}));
const __VLS_66 = __VLS_65({
    prop: "name",
    label: "任务名称",
    minWidth: "170",
}, ...__VLS_functionalComponentArgsRest(__VLS_65));
const __VLS_68 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
    label: "触发方式",
    width: "100",
}));
const __VLS_70 = __VLS_69({
    label: "触发方式",
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_69));
__VLS_71.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_71.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_72 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
        effect: "plain",
        type: "danger",
    }));
    const __VLS_74 = __VLS_73({
        effect: "plain",
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_73));
    __VLS_75.slots.default;
    (row.trigger);
    var __VLS_75;
}
var __VLS_71;
const __VLS_76 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
    prop: "ruleCount",
    label: "规则数",
    width: "70",
    align: "center",
}));
const __VLS_78 = __VLS_77({
    prop: "ruleCount",
    label: "规则数",
    width: "70",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_77));
const __VLS_80 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
    label: "状态",
    width: "90",
}));
const __VLS_82 = __VLS_81({
    label: "状态",
    width: "90",
}, ...__VLS_functionalComponentArgsRest(__VLS_81));
__VLS_83.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_83.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_84 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
        type: (__VLS_ctx.statusTagType[row.status]),
        effect: "dark",
    }));
    const __VLS_86 = __VLS_85({
        type: (__VLS_ctx.statusTagType[row.status]),
        effect: "dark",
    }, ...__VLS_functionalComponentArgsRest(__VLS_85));
    __VLS_87.slots.default;
    (row.status);
    var __VLS_87;
}
var __VLS_83;
const __VLS_88 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
    label: "进度",
    minWidth: "130",
}));
const __VLS_90 = __VLS_89({
    label: "进度",
    minWidth: "130",
}, ...__VLS_functionalComponentArgsRest(__VLS_89));
__VLS_91.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_91.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_92 = {}.ElProgress;
    /** @type {[typeof __VLS_components.ElProgress, typeof __VLS_components.elProgress, ]} */ ;
    // @ts-ignore
    const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
        percentage: (row.progress),
        strokeWidth: (10),
    }));
    const __VLS_94 = __VLS_93({
        percentage: (row.progress),
        strokeWidth: (10),
    }, ...__VLS_functionalComponentArgsRest(__VLS_93));
}
var __VLS_91;
const __VLS_96 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
    label: "问题数据",
    width: "100",
    align: "center",
}));
const __VLS_98 = __VLS_97({
    label: "问题数据",
    width: "100",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_97));
__VLS_99.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_99.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    if (row.problemCount > 0) {
        const __VLS_100 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
            ...{ 'onClick': {} },
            link: true,
            type: "danger",
        }));
        const __VLS_102 = __VLS_101({
            ...{ 'onClick': {} },
            link: true,
            type: "danger",
        }, ...__VLS_functionalComponentArgsRest(__VLS_101));
        let __VLS_104;
        let __VLS_105;
        let __VLS_106;
        const __VLS_107 = {
            onClick: (...[$event]) => {
                if (!(row.problemCount > 0))
                    return;
                __VLS_ctx.showProblems(row);
            }
        };
        __VLS_103.slots.default;
        (row.problemCount);
        var __VLS_103;
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "dep-text" },
        });
    }
}
var __VLS_99;
const __VLS_108 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
    label: "操作",
    width: "180",
    fixed: "right",
}));
const __VLS_110 = __VLS_109({
    label: "操作",
    width: "180",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_109));
__VLS_111.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_111.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_112 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }));
    const __VLS_114 = __VLS_113({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_113));
    let __VLS_116;
    let __VLS_117;
    let __VLS_118;
    const __VLS_119 = {
        onClick: (...[$event]) => {
            __VLS_ctx.showLog(row);
        }
    };
    __VLS_115.slots.default;
    var __VLS_115;
    const __VLS_120 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({
        ...{ 'onClick': {} },
        link: true,
        type: "danger",
    }));
    const __VLS_122 = __VLS_121({
        ...{ 'onClick': {} },
        link: true,
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_121));
    let __VLS_124;
    let __VLS_125;
    let __VLS_126;
    const __VLS_127 = {
        onClick: (...[$event]) => {
            __VLS_ctx.runTask(row);
        }
    };
    __VLS_123.slots.default;
    var __VLS_123;
    const __VLS_128 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({
        ...{ 'onClick': {} },
        link: true,
        type: "warning",
    }));
    const __VLS_130 = __VLS_129({
        ...{ 'onClick': {} },
        link: true,
        type: "warning",
    }, ...__VLS_functionalComponentArgsRest(__VLS_129));
    let __VLS_132;
    let __VLS_133;
    let __VLS_134;
    const __VLS_135 = {
        onClick: (...[$event]) => {
            __VLS_ctx.showDag(row);
        }
    };
    __VLS_131.slots.default;
    var __VLS_131;
}
var __VLS_111;
var __VLS_63;
const __VLS_136 = {}.ElPagination;
/** @type {[typeof __VLS_components.ElPagination, typeof __VLS_components.elPagination, ]} */ ;
// @ts-ignore
const __VLS_137 = __VLS_asFunctionalComponent(__VLS_136, new __VLS_136({
    ...{ class: "pager" },
    layout: "total, prev, pager, next",
    total: (__VLS_ctx.filteredTasks.length),
    pageSize: (20),
    background: true,
}));
const __VLS_138 = __VLS_137({
    ...{ class: "pager" },
    layout: "total, prev, pager, next",
    total: (__VLS_ctx.filteredTasks.length),
    pageSize: (20),
    background: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_137));
var __VLS_11;
var __VLS_7;
const __VLS_140 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_141 = __VLS_asFunctionalComponent(__VLS_140, new __VLS_140({
    span: (8),
}));
const __VLS_142 = __VLS_141({
    span: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_141));
__VLS_143.slots.default;
const __VLS_144 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_145 = __VLS_asFunctionalComponent(__VLS_144, new __VLS_144({
    ...{ class: "panel-card dashboard-card" },
    shadow: "never",
}));
const __VLS_146 = __VLS_145({
    ...{ class: "panel-card dashboard-card" },
    shadow: "never",
}, ...__VLS_functionalComponentArgsRest(__VLS_145));
__VLS_147.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_147.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "overview-chips" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "chip chip-red" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "chip-value" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "chip-label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "chip chip-green" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "chip-value" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "chip-label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "chip chip-orange" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "chip-value" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "chip-label" },
});
const __VLS_148 = {}.ElDivider;
/** @type {[typeof __VLS_components.ElDivider, typeof __VLS_components.elDivider, ]} */ ;
// @ts-ignore
const __VLS_149 = __VLS_asFunctionalComponent(__VLS_148, new __VLS_148({}));
const __VLS_150 = __VLS_149({}, ...__VLS_functionalComponentArgsRest(__VLS_149));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "section-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "coop-item" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "coop-item-icon" },
});
const __VLS_152 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_153 = __VLS_asFunctionalComponent(__VLS_152, new __VLS_152({
    size: (16),
}));
const __VLS_154 = __VLS_153({
    size: (16),
}, ...__VLS_functionalComponentArgsRest(__VLS_153));
__VLS_155.slots.default;
const __VLS_156 = {}.Connection;
/** @type {[typeof __VLS_components.Connection, ]} */ ;
// @ts-ignore
const __VLS_157 = __VLS_asFunctionalComponent(__VLS_156, new __VLS_156({}));
const __VLS_158 = __VLS_157({}, ...__VLS_functionalComponentArgsRest(__VLS_157));
var __VLS_155;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "coop-item-info" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "coop-item-name" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "coop-item-desc" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "coop-item" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "coop-item-icon" },
});
const __VLS_160 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_161 = __VLS_asFunctionalComponent(__VLS_160, new __VLS_160({
    size: (16),
}));
const __VLS_162 = __VLS_161({
    size: (16),
}, ...__VLS_functionalComponentArgsRest(__VLS_161));
__VLS_163.slots.default;
const __VLS_164 = {}.Search;
/** @type {[typeof __VLS_components.Search, ]} */ ;
// @ts-ignore
const __VLS_165 = __VLS_asFunctionalComponent(__VLS_164, new __VLS_164({}));
const __VLS_166 = __VLS_165({}, ...__VLS_functionalComponentArgsRest(__VLS_165));
var __VLS_163;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "coop-item-info" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "coop-item-name" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "coop-item-desc" },
});
var __VLS_147;
var __VLS_143;
var __VLS_3;
const __VLS_168 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_169 = __VLS_asFunctionalComponent(__VLS_168, new __VLS_168({
    modelValue: (__VLS_ctx.createVisible),
    title: "新建质量任务",
    width: "560px",
}));
const __VLS_170 = __VLS_169({
    modelValue: (__VLS_ctx.createVisible),
    title: "新建质量任务",
    width: "560px",
}, ...__VLS_functionalComponentArgsRest(__VLS_169));
__VLS_171.slots.default;
const __VLS_172 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_173 = __VLS_asFunctionalComponent(__VLS_172, new __VLS_172({
    model: (__VLS_ctx.createForm),
    labelWidth: "100px",
}));
const __VLS_174 = __VLS_173({
    model: (__VLS_ctx.createForm),
    labelWidth: "100px",
}, ...__VLS_functionalComponentArgsRest(__VLS_173));
__VLS_175.slots.default;
const __VLS_176 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_177 = __VLS_asFunctionalComponent(__VLS_176, new __VLS_176({
    label: "任务名称",
}));
const __VLS_178 = __VLS_177({
    label: "任务名称",
}, ...__VLS_functionalComponentArgsRest(__VLS_177));
__VLS_179.slots.default;
const __VLS_180 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_181 = __VLS_asFunctionalComponent(__VLS_180, new __VLS_180({
    modelValue: (__VLS_ctx.createForm.name),
}));
const __VLS_182 = __VLS_181({
    modelValue: (__VLS_ctx.createForm.name),
}, ...__VLS_functionalComponentArgsRest(__VLS_181));
var __VLS_179;
const __VLS_184 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_185 = __VLS_asFunctionalComponent(__VLS_184, new __VLS_184({
    label: "触发方式",
}));
const __VLS_186 = __VLS_185({
    label: "触发方式",
}, ...__VLS_functionalComponentArgsRest(__VLS_185));
__VLS_187.slots.default;
const __VLS_188 = {}.ElRadioGroup;
/** @type {[typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, ]} */ ;
// @ts-ignore
const __VLS_189 = __VLS_asFunctionalComponent(__VLS_188, new __VLS_188({
    modelValue: (__VLS_ctx.createForm.trigger),
}));
const __VLS_190 = __VLS_189({
    modelValue: (__VLS_ctx.createForm.trigger),
}, ...__VLS_functionalComponentArgsRest(__VLS_189));
__VLS_191.slots.default;
const __VLS_192 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
const __VLS_193 = __VLS_asFunctionalComponent(__VLS_192, new __VLS_192({
    value: "周期调度",
}));
const __VLS_194 = __VLS_193({
    value: "周期调度",
}, ...__VLS_functionalComponentArgsRest(__VLS_193));
const __VLS_196 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
const __VLS_197 = __VLS_asFunctionalComponent(__VLS_196, new __VLS_196({
    value: "实时触发",
}));
const __VLS_198 = __VLS_197({
    value: "实时触发",
}, ...__VLS_functionalComponentArgsRest(__VLS_197));
const __VLS_200 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
const __VLS_201 = __VLS_asFunctionalComponent(__VLS_200, new __VLS_200({
    value: "手动执行",
}));
const __VLS_202 = __VLS_201({
    value: "手动执行",
}, ...__VLS_functionalComponentArgsRest(__VLS_201));
var __VLS_191;
var __VLS_187;
const __VLS_204 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_205 = __VLS_asFunctionalComponent(__VLS_204, new __VLS_204({
    label: "调度周期",
}));
const __VLS_206 = __VLS_205({
    label: "调度周期",
}, ...__VLS_functionalComponentArgsRest(__VLS_205));
__VLS_207.slots.default;
const __VLS_208 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_209 = __VLS_asFunctionalComponent(__VLS_208, new __VLS_208({
    modelValue: (__VLS_ctx.createForm.schedule),
    ...{ class: "w-full" },
}));
const __VLS_210 = __VLS_209({
    modelValue: (__VLS_ctx.createForm.schedule),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_209));
__VLS_211.slots.default;
const __VLS_212 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_213 = __VLS_asFunctionalComponent(__VLS_212, new __VLS_212({
    label: "每日 03:00",
    value: "每日 03:00",
}));
const __VLS_214 = __VLS_213({
    label: "每日 03:00",
    value: "每日 03:00",
}, ...__VLS_functionalComponentArgsRest(__VLS_213));
const __VLS_216 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_217 = __VLS_asFunctionalComponent(__VLS_216, new __VLS_216({
    label: "每小时",
    value: "每小时",
}));
const __VLS_218 = __VLS_217({
    label: "每小时",
    value: "每小时",
}, ...__VLS_functionalComponentArgsRest(__VLS_217));
const __VLS_220 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_221 = __VLS_asFunctionalComponent(__VLS_220, new __VLS_220({
    label: "实时",
    value: "实时",
}));
const __VLS_222 = __VLS_221({
    label: "实时",
    value: "实时",
}, ...__VLS_functionalComponentArgsRest(__VLS_221));
const __VLS_224 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_225 = __VLS_asFunctionalComponent(__VLS_224, new __VLS_224({
    label: "手动",
    value: "手动",
}));
const __VLS_226 = __VLS_225({
    label: "手动",
    value: "手动",
}, ...__VLS_functionalComponentArgsRest(__VLS_225));
var __VLS_211;
var __VLS_207;
const __VLS_228 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_229 = __VLS_asFunctionalComponent(__VLS_228, new __VLS_228({
    label: "检查范围",
}));
const __VLS_230 = __VLS_229({
    label: "检查范围",
}, ...__VLS_functionalComponentArgsRest(__VLS_229));
__VLS_231.slots.default;
const __VLS_232 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_233 = __VLS_asFunctionalComponent(__VLS_232, new __VLS_232({
    modelValue: (__VLS_ctx.createForm.scope),
}));
const __VLS_234 = __VLS_233({
    modelValue: (__VLS_ctx.createForm.scope),
}, ...__VLS_functionalComponentArgsRest(__VLS_233));
var __VLS_231;
const __VLS_236 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_237 = __VLS_asFunctionalComponent(__VLS_236, new __VLS_236({
    label: "增量检查",
}));
const __VLS_238 = __VLS_237({
    label: "增量检查",
}, ...__VLS_functionalComponentArgsRest(__VLS_237));
__VLS_239.slots.default;
const __VLS_240 = {}.ElSwitch;
/** @type {[typeof __VLS_components.ElSwitch, typeof __VLS_components.elSwitch, ]} */ ;
// @ts-ignore
const __VLS_241 = __VLS_asFunctionalComponent(__VLS_240, new __VLS_240({
    modelValue: (__VLS_ctx.createForm.incremental),
    activeText: "启用",
}));
const __VLS_242 = __VLS_241({
    modelValue: (__VLS_ctx.createForm.incremental),
    activeText: "启用",
}, ...__VLS_functionalComponentArgsRest(__VLS_241));
var __VLS_239;
var __VLS_175;
{
    const { footer: __VLS_thisSlot } = __VLS_171.slots;
    const __VLS_244 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_245 = __VLS_asFunctionalComponent(__VLS_244, new __VLS_244({
        ...{ 'onClick': {} },
    }));
    const __VLS_246 = __VLS_245({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_245));
    let __VLS_248;
    let __VLS_249;
    let __VLS_250;
    const __VLS_251 = {
        onClick: (...[$event]) => {
            __VLS_ctx.createVisible = false;
        }
    };
    __VLS_247.slots.default;
    var __VLS_247;
    const __VLS_252 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_253 = __VLS_asFunctionalComponent(__VLS_252, new __VLS_252({
        ...{ 'onClick': {} },
        type: "danger",
    }));
    const __VLS_254 = __VLS_253({
        ...{ 'onClick': {} },
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_253));
    let __VLS_256;
    let __VLS_257;
    let __VLS_258;
    const __VLS_259 = {
        onClick: (__VLS_ctx.saveCreate)
    };
    __VLS_255.slots.default;
    var __VLS_255;
}
var __VLS_171;
const __VLS_260 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_261 = __VLS_asFunctionalComponent(__VLS_260, new __VLS_260({
    modelValue: (__VLS_ctx.problemVisible),
    title: "问题数据明细",
    width: "680px",
}));
const __VLS_262 = __VLS_261({
    modelValue: (__VLS_ctx.problemVisible),
    title: "问题数据明细",
    width: "680px",
}, ...__VLS_functionalComponentArgsRest(__VLS_261));
__VLS_263.slots.default;
const __VLS_264 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_265 = __VLS_asFunctionalComponent(__VLS_264, new __VLS_264({
    data: (__VLS_ctx.problemRows),
    stripe: true,
    size: "small",
}));
const __VLS_266 = __VLS_265({
    data: (__VLS_ctx.problemRows),
    stripe: true,
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_265));
__VLS_267.slots.default;
const __VLS_268 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_269 = __VLS_asFunctionalComponent(__VLS_268, new __VLS_268({
    prop: "pk",
    label: "主键",
    width: "120",
}));
const __VLS_270 = __VLS_269({
    prop: "pk",
    label: "主键",
    width: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_269));
const __VLS_272 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_273 = __VLS_asFunctionalComponent(__VLS_272, new __VLS_272({
    prop: "field",
    label: "问题字段",
    width: "110",
}));
const __VLS_274 = __VLS_273({
    prop: "field",
    label: "问题字段",
    width: "110",
}, ...__VLS_functionalComponentArgsRest(__VLS_273));
const __VLS_276 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_277 = __VLS_asFunctionalComponent(__VLS_276, new __VLS_276({
    prop: "value",
    label: "异常值",
    minWidth: "140",
}));
const __VLS_278 = __VLS_277({
    prop: "value",
    label: "异常值",
    minWidth: "140",
}, ...__VLS_functionalComponentArgsRest(__VLS_277));
const __VLS_280 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_281 = __VLS_asFunctionalComponent(__VLS_280, new __VLS_280({
    prop: "ruleName",
    label: "命中规则",
    minWidth: "160",
}));
const __VLS_282 = __VLS_281({
    prop: "ruleName",
    label: "命中规则",
    minWidth: "160",
}, ...__VLS_functionalComponentArgsRest(__VLS_281));
const __VLS_284 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_285 = __VLS_asFunctionalComponent(__VLS_284, new __VLS_284({
    prop: "severity",
    label: "级别",
    width: "80",
}));
const __VLS_286 = __VLS_285({
    prop: "severity",
    label: "级别",
    width: "80",
}, ...__VLS_functionalComponentArgsRest(__VLS_285));
__VLS_287.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_287.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_288 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_289 = __VLS_asFunctionalComponent(__VLS_288, new __VLS_288({
        type: (row.severity === '严重' ? 'danger' : row.severity === '警告' ? 'warning' : 'info'),
        size: "small",
    }));
    const __VLS_290 = __VLS_289({
        type: (row.severity === '严重' ? 'danger' : row.severity === '警告' ? 'warning' : 'info'),
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_289));
    __VLS_291.slots.default;
    (row.severity);
    var __VLS_291;
}
var __VLS_287;
var __VLS_267;
var __VLS_263;
const __VLS_292 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_293 = __VLS_asFunctionalComponent(__VLS_292, new __VLS_292({
    modelValue: (__VLS_ctx.logVisible),
    title: (`执行日志：${__VLS_ctx.logTaskName}`),
    width: "680px",
}));
const __VLS_294 = __VLS_293({
    modelValue: (__VLS_ctx.logVisible),
    title: (`执行日志：${__VLS_ctx.logTaskName}`),
    width: "680px",
}, ...__VLS_functionalComponentArgsRest(__VLS_293));
__VLS_295.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.pre, __VLS_intrinsicElements.pre)({
    ...{ class: "ddl-block" },
});
(__VLS_ctx.logContent);
var __VLS_295;
const __VLS_296 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_297 = __VLS_asFunctionalComponent(__VLS_296, new __VLS_296({
    modelValue: (__VLS_ctx.dagVisible),
    title: "任务依赖（DAG）",
    width: "560px",
}));
const __VLS_298 = __VLS_297({
    modelValue: (__VLS_ctx.dagVisible),
    title: "任务依赖（DAG）",
    width: "560px",
}, ...__VLS_functionalComponentArgsRest(__VLS_297));
__VLS_299.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "dag-wrap" },
});
for (const [node, index] of __VLS_getVForSourceType((__VLS_ctx.dagNodes))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "dag-node" },
        key: (node.name),
        ...{ class: ({ 'dag-current': index === 2 }) },
    });
    const __VLS_300 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_301 = __VLS_asFunctionalComponent(__VLS_300, new __VLS_300({
        size: (14),
    }));
    const __VLS_302 = __VLS_301({
        size: (14),
    }, ...__VLS_functionalComponentArgsRest(__VLS_301));
    __VLS_303.slots.default;
    const __VLS_304 = {}.Connection;
    /** @type {[typeof __VLS_components.Connection, ]} */ ;
    // @ts-ignore
    const __VLS_305 = __VLS_asFunctionalComponent(__VLS_304, new __VLS_304({}));
    const __VLS_306 = __VLS_305({}, ...__VLS_functionalComponentArgsRest(__VLS_305));
    var __VLS_303;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (node.name);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "dag-status" },
    });
    (node.status);
}
for (const [index] of __VLS_getVForSourceType((2))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "dag-arrow" },
        key: (`arrow-${index}`),
    });
}
var __VLS_299;
/** @type {__VLS_StyleScopedClasses['standard-page']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['toolbar-row']} */ ;
/** @type {__VLS_StyleScopedClasses['search-input']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-select']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-select']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-12']} */ ;
/** @type {__VLS_StyleScopedClasses['dep-text']} */ ;
/** @type {__VLS_StyleScopedClasses['pager']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['overview-chips']} */ ;
/** @type {__VLS_StyleScopedClasses['chip']} */ ;
/** @type {__VLS_StyleScopedClasses['chip-red']} */ ;
/** @type {__VLS_StyleScopedClasses['chip-value']} */ ;
/** @type {__VLS_StyleScopedClasses['chip-label']} */ ;
/** @type {__VLS_StyleScopedClasses['chip']} */ ;
/** @type {__VLS_StyleScopedClasses['chip-green']} */ ;
/** @type {__VLS_StyleScopedClasses['chip-value']} */ ;
/** @type {__VLS_StyleScopedClasses['chip-label']} */ ;
/** @type {__VLS_StyleScopedClasses['chip']} */ ;
/** @type {__VLS_StyleScopedClasses['chip-orange']} */ ;
/** @type {__VLS_StyleScopedClasses['chip-value']} */ ;
/** @type {__VLS_StyleScopedClasses['chip-label']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['coop-item']} */ ;
/** @type {__VLS_StyleScopedClasses['coop-item-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['coop-item-info']} */ ;
/** @type {__VLS_StyleScopedClasses['coop-item-name']} */ ;
/** @type {__VLS_StyleScopedClasses['coop-item-desc']} */ ;
/** @type {__VLS_StyleScopedClasses['coop-item']} */ ;
/** @type {__VLS_StyleScopedClasses['coop-item-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['coop-item-info']} */ ;
/** @type {__VLS_StyleScopedClasses['coop-item-name']} */ ;
/** @type {__VLS_StyleScopedClasses['coop-item-desc']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['ddl-block']} */ ;
/** @type {__VLS_StyleScopedClasses['dag-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['dag-node']} */ ;
/** @type {__VLS_StyleScopedClasses['dag-status']} */ ;
/** @type {__VLS_StyleScopedClasses['dag-arrow']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Connection: Connection,
            Plus: Plus,
            Search: Search,
            statusTagType: statusTagType,
            keyword: keyword,
            filterTrigger: filterTrigger,
            filterStatus: filterStatus,
            createVisible: createVisible,
            problemVisible: problemVisible,
            logVisible: logVisible,
            dagVisible: dagVisible,
            logTaskName: logTaskName,
            createForm: createForm,
            problemRows: problemRows,
            logContent: logContent,
            dagNodes: dagNodes,
            filteredTasks: filteredTasks,
            openCreate: openCreate,
            saveCreate: saveCreate,
            showProblems: showProblems,
            showLog: showLog,
            runTask: runTask,
            showDag: showDag,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
