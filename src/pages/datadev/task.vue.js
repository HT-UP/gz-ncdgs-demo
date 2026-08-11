import { computed, reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { Clock, DocumentCopy, Plus, Search, VideoCamera, WindPower } from '@element-plus/icons-vue';
import { mockDevTasks } from '@/mock/datadev';
const statusTagType = {
    运行中: 'warning',
    成功: 'success',
    失败: 'danger',
    待执行: 'warning',
    已暂停: 'info',
};
const templates = [
    { name: '标准日结任务', description: '每日数据同步 + 汇总', icon: Clock },
    { name: '增量同步模板', description: '时间戳增量同步', icon: DocumentCopy },
    { name: '实时告警模板', description: '实时事件监控告警', icon: VideoCamera },
    { name: '流式聚合模板', description: '滑动窗口流式聚合', icon: WindPower },
];
const taskTemplates = templates.map((template) => template.name);
const tasks = ref(mockDevTasks.map((task, index) => ({
    ...task,
    templateName: taskTemplates[index % taskTemplates.length],
    dependencies: index % 3 === 0 ? mockDevTasks[(index + 3) % mockDevTasks.length].name : '',
    status: task.status,
})));
const keyword = ref('');
const filterStatus = ref('');
const wizardVisible = ref(false);
const wizardStep = ref(0);
const auditVisible = ref(false);
const form = reactive({
    name: '',
    type: '批量',
    templateName: '标准日结任务',
    schedule: '每日 02:00',
    dependencies: [],
    params: [{ key: '', value: '' }],
});
const filteredTasks = computed(() => tasks.value.filter((task) => {
    if (filterStatus.value && task.status !== filterStatus.value)
        return false;
    if (!keyword.value)
        return true;
    const kw = keyword.value.toLowerCase();
    return task.name.toLowerCase().includes(kw) || task.owner.toLowerCase().includes(kw);
}));
const auditRows = [
    { time: '2026-08-11 14:02', user: '张三', action: '启动任务', detail: '任务由待执行→运行中' },
    { time: '2026-08-11 09:30', user: '李四', action: '修改参数', detail: '更新并行度 4→8' },
    { time: '2026-08-10 17:15', user: '张三', action: '克隆任务', detail: '从「票务日结」克隆' },
];
const openWizard = () => {
    wizardStep.value = 0;
    Object.assign(form, {
        name: '',
        type: '批量',
        templateName: '标准日结任务',
        schedule: '每日 02:00',
        dependencies: [],
        params: [{ key: '', value: '' }],
    });
    wizardVisible.value = true;
};
const applyTemplate = (template) => {
    form.templateName = template.name;
    ElMessage.success(`已套用模板「${template.name}」（Mock）`);
};
const addParam = () => {
    form.params.push({ key: '', value: '' });
};
const removeParam = (index) => {
    form.params.splice(index, 1);
};
const saveForm = () => {
    if (!form.name.trim()) {
        ElMessage.warning('请输入任务名称');
        return;
    }
    tasks.value.unshift({
        id: `task-mock-${Date.now()}`,
        name: form.name,
        type: form.type,
        sourceName: '票务核心库',
        targetName: '数仓 DWD',
        schedule: form.schedule,
        status: '待执行',
        progress: 0,
        dataCount: 0,
        owner: '张三',
        lastRunTime: '-',
        description: '新建治理任务',
        templateName: form.templateName,
        dependencies: form.dependencies.join('，'),
    });
    wizardVisible.value = false;
    ElMessage.success('任务已创建（Mock）');
};
const toggleTask = (row) => {
    if (row.status === '已暂停') {
        row.status = '待执行';
        ElMessage.success(`任务「${row.name}」已恢复（Mock）`);
    }
    else {
        row.status = '已暂停';
        ElMessage.info(`任务「${row.name}」已暂停（Mock）`);
    }
};
const stopTask = (row) => {
    row.status = '待执行';
    ElMessage.info(`任务「${row.name}」已终止（Mock）`);
};
const cloneTask = (row) => {
    tasks.value.push({ ...row, name: `${row.name}（副本）`, id: `clone-${Date.now()}` });
    ElMessage.success(`任务「${row.name}」已克隆（Mock）`);
};
const showAudit = (row) => {
    auditVisible.value = true;
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
        onClick: (__VLS_ctx.openWizard)
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
const __VLS_44 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    label: "已暂停",
    value: "已暂停",
}));
const __VLS_46 = __VLS_45({
    label: "已暂停",
    value: "已暂停",
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
var __VLS_27;
const __VLS_48 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
    data: (__VLS_ctx.filteredTasks),
    stripe: true,
    ...{ class: "mt-12" },
}));
const __VLS_50 = __VLS_49({
    data: (__VLS_ctx.filteredTasks),
    stripe: true,
    ...{ class: "mt-12" },
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
__VLS_51.slots.default;
const __VLS_52 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
    prop: "name",
    label: "任务名称",
    minWidth: "170",
}));
const __VLS_54 = __VLS_53({
    prop: "name",
    label: "任务名称",
    minWidth: "170",
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
const __VLS_56 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
    prop: "type",
    label: "类型",
    width: "80",
}));
const __VLS_58 = __VLS_57({
    prop: "type",
    label: "类型",
    width: "80",
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
const __VLS_60 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
    prop: "templateName",
    label: "模板",
    width: "110",
}));
const __VLS_62 = __VLS_61({
    prop: "templateName",
    label: "模板",
    width: "110",
}, ...__VLS_functionalComponentArgsRest(__VLS_61));
__VLS_63.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_63.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_64 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
        effect: "plain",
        type: "info",
    }));
    const __VLS_66 = __VLS_65({
        effect: "plain",
        type: "info",
    }, ...__VLS_functionalComponentArgsRest(__VLS_65));
    __VLS_67.slots.default;
    (row.templateName);
    var __VLS_67;
}
var __VLS_63;
const __VLS_68 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
    prop: "dependencies",
    label: "依赖任务",
    width: "150",
}));
const __VLS_70 = __VLS_69({
    prop: "dependencies",
    label: "依赖任务",
    width: "150",
}, ...__VLS_functionalComponentArgsRest(__VLS_69));
__VLS_71.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_71.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "dep-text" },
    });
    (row.dependencies || '无依赖');
}
var __VLS_71;
const __VLS_72 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
    label: "状态",
    width: "90",
}));
const __VLS_74 = __VLS_73({
    label: "状态",
    width: "90",
}, ...__VLS_functionalComponentArgsRest(__VLS_73));
__VLS_75.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_75.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_76 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
        type: (__VLS_ctx.statusTagType[row.status]),
        effect: "dark",
    }));
    const __VLS_78 = __VLS_77({
        type: (__VLS_ctx.statusTagType[row.status]),
        effect: "dark",
    }, ...__VLS_functionalComponentArgsRest(__VLS_77));
    __VLS_79.slots.default;
    (row.status);
    var __VLS_79;
}
var __VLS_75;
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
    width: "260",
    fixed: "right",
}));
const __VLS_86 = __VLS_85({
    label: "操作",
    width: "260",
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
        type: "success",
    }));
    const __VLS_90 = __VLS_89({
        ...{ 'onClick': {} },
        link: true,
        type: "success",
    }, ...__VLS_functionalComponentArgsRest(__VLS_89));
    let __VLS_92;
    let __VLS_93;
    let __VLS_94;
    const __VLS_95 = {
        onClick: (...[$event]) => {
            __VLS_ctx.toggleTask(row);
        }
    };
    __VLS_91.slots.default;
    (row.status === '已暂停' ? '恢复' : '暂停');
    var __VLS_91;
    const __VLS_96 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
        ...{ 'onClick': {} },
        link: true,
        type: "danger",
    }));
    const __VLS_98 = __VLS_97({
        ...{ 'onClick': {} },
        link: true,
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_97));
    let __VLS_100;
    let __VLS_101;
    let __VLS_102;
    const __VLS_103 = {
        onClick: (...[$event]) => {
            __VLS_ctx.stopTask(row);
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
        type: "primary",
    }));
    const __VLS_106 = __VLS_105({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_105));
    let __VLS_108;
    let __VLS_109;
    let __VLS_110;
    const __VLS_111 = {
        onClick: (...[$event]) => {
            __VLS_ctx.cloneTask(row);
        }
    };
    __VLS_107.slots.default;
    var __VLS_107;
    const __VLS_112 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
        ...{ 'onClick': {} },
        link: true,
        type: "warning",
    }));
    const __VLS_114 = __VLS_113({
        ...{ 'onClick': {} },
        link: true,
        type: "warning",
    }, ...__VLS_functionalComponentArgsRest(__VLS_113));
    let __VLS_116;
    let __VLS_117;
    let __VLS_118;
    const __VLS_119 = {
        onClick: (...[$event]) => {
            __VLS_ctx.showAudit(row);
        }
    };
    __VLS_115.slots.default;
    var __VLS_115;
}
var __VLS_87;
var __VLS_51;
const __VLS_120 = {}.ElPagination;
/** @type {[typeof __VLS_components.ElPagination, typeof __VLS_components.elPagination, ]} */ ;
// @ts-ignore
const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({
    ...{ class: "pager" },
    layout: "total, prev, pager, next",
    total: (__VLS_ctx.filteredTasks.length),
    pageSize: (20),
    background: true,
}));
const __VLS_122 = __VLS_121({
    ...{ class: "pager" },
    layout: "total, prev, pager, next",
    total: (__VLS_ctx.filteredTasks.length),
    pageSize: (20),
    background: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_121));
var __VLS_11;
var __VLS_7;
const __VLS_124 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({
    span: (8),
}));
const __VLS_126 = __VLS_125({
    span: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_125));
__VLS_127.slots.default;
const __VLS_128 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({
    ...{ class: "panel-card dashboard-card" },
    shadow: "never",
}));
const __VLS_130 = __VLS_129({
    ...{ class: "panel-card dashboard-card" },
    shadow: "never",
}, ...__VLS_functionalComponentArgsRest(__VLS_129));
__VLS_131.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_131.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    const __VLS_132 = {}.ElLink;
    /** @type {[typeof __VLS_components.ElLink, typeof __VLS_components.elLink, typeof __VLS_components.ElLink, typeof __VLS_components.elLink, ]} */ ;
    // @ts-ignore
    const __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132({
        underline: (false),
        type: "danger",
    }));
    const __VLS_134 = __VLS_133({
        underline: (false),
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_133));
    __VLS_135.slots.default;
    var __VLS_135;
}
for (const [template] of __VLS_getVForSourceType((__VLS_ctx.templates))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.applyTemplate(template);
            } },
        key: (template.name),
        ...{ class: "template-item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "template-icon" },
    });
    const __VLS_136 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_137 = __VLS_asFunctionalComponent(__VLS_136, new __VLS_136({
        size: (18),
    }));
    const __VLS_138 = __VLS_137({
        size: (18),
    }, ...__VLS_functionalComponentArgsRest(__VLS_137));
    __VLS_139.slots.default;
    const __VLS_140 = ((template.icon));
    // @ts-ignore
    const __VLS_141 = __VLS_asFunctionalComponent(__VLS_140, new __VLS_140({}));
    const __VLS_142 = __VLS_141({}, ...__VLS_functionalComponentArgsRest(__VLS_141));
    var __VLS_139;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "template-info" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "template-name" },
    });
    (template.name);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "template-desc" },
    });
    (template.description);
}
var __VLS_131;
var __VLS_127;
var __VLS_3;
const __VLS_144 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_145 = __VLS_asFunctionalComponent(__VLS_144, new __VLS_144({
    modelValue: (__VLS_ctx.wizardVisible),
    title: "新建任务（向导）",
    width: "620px",
}));
const __VLS_146 = __VLS_145({
    modelValue: (__VLS_ctx.wizardVisible),
    title: "新建任务（向导）",
    width: "620px",
}, ...__VLS_functionalComponentArgsRest(__VLS_145));
__VLS_147.slots.default;
const __VLS_148 = {}.ElSteps;
/** @type {[typeof __VLS_components.ElSteps, typeof __VLS_components.elSteps, typeof __VLS_components.ElSteps, typeof __VLS_components.elSteps, ]} */ ;
// @ts-ignore
const __VLS_149 = __VLS_asFunctionalComponent(__VLS_148, new __VLS_148({
    active: (__VLS_ctx.wizardStep),
    alignCenter: true,
    finishStatus: "success",
    ...{ class: "register-steps" },
}));
const __VLS_150 = __VLS_149({
    active: (__VLS_ctx.wizardStep),
    alignCenter: true,
    finishStatus: "success",
    ...{ class: "register-steps" },
}, ...__VLS_functionalComponentArgsRest(__VLS_149));
__VLS_151.slots.default;
const __VLS_152 = {}.ElStep;
/** @type {[typeof __VLS_components.ElStep, typeof __VLS_components.elStep, ]} */ ;
// @ts-ignore
const __VLS_153 = __VLS_asFunctionalComponent(__VLS_152, new __VLS_152({
    title: "基本信息",
}));
const __VLS_154 = __VLS_153({
    title: "基本信息",
}, ...__VLS_functionalComponentArgsRest(__VLS_153));
const __VLS_156 = {}.ElStep;
/** @type {[typeof __VLS_components.ElStep, typeof __VLS_components.elStep, ]} */ ;
// @ts-ignore
const __VLS_157 = __VLS_asFunctionalComponent(__VLS_156, new __VLS_156({
    title: "调度与依赖",
}));
const __VLS_158 = __VLS_157({
    title: "调度与依赖",
}, ...__VLS_functionalComponentArgsRest(__VLS_157));
const __VLS_160 = {}.ElStep;
/** @type {[typeof __VLS_components.ElStep, typeof __VLS_components.elStep, ]} */ ;
// @ts-ignore
const __VLS_161 = __VLS_asFunctionalComponent(__VLS_160, new __VLS_160({
    title: "参数配置",
}));
const __VLS_162 = __VLS_161({
    title: "参数配置",
}, ...__VLS_functionalComponentArgsRest(__VLS_161));
var __VLS_151;
if (__VLS_ctx.wizardStep === 0) {
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
        label: "任务名称",
    }));
    const __VLS_170 = __VLS_169({
        label: "任务名称",
    }, ...__VLS_functionalComponentArgsRest(__VLS_169));
    __VLS_171.slots.default;
    const __VLS_172 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_173 = __VLS_asFunctionalComponent(__VLS_172, new __VLS_172({
        modelValue: (__VLS_ctx.form.name),
    }));
    const __VLS_174 = __VLS_173({
        modelValue: (__VLS_ctx.form.name),
    }, ...__VLS_functionalComponentArgsRest(__VLS_173));
    var __VLS_171;
    const __VLS_176 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_177 = __VLS_asFunctionalComponent(__VLS_176, new __VLS_176({
        label: "任务类型",
    }));
    const __VLS_178 = __VLS_177({
        label: "任务类型",
    }, ...__VLS_functionalComponentArgsRest(__VLS_177));
    __VLS_179.slots.default;
    const __VLS_180 = {}.ElRadioGroup;
    /** @type {[typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, ]} */ ;
    // @ts-ignore
    const __VLS_181 = __VLS_asFunctionalComponent(__VLS_180, new __VLS_180({
        modelValue: (__VLS_ctx.form.type),
    }));
    const __VLS_182 = __VLS_181({
        modelValue: (__VLS_ctx.form.type),
    }, ...__VLS_functionalComponentArgsRest(__VLS_181));
    __VLS_183.slots.default;
    const __VLS_184 = {}.ElRadio;
    /** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
    // @ts-ignore
    const __VLS_185 = __VLS_asFunctionalComponent(__VLS_184, new __VLS_184({
        value: "批量",
    }));
    const __VLS_186 = __VLS_185({
        value: "批量",
    }, ...__VLS_functionalComponentArgsRest(__VLS_185));
    const __VLS_188 = {}.ElRadio;
    /** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
    // @ts-ignore
    const __VLS_189 = __VLS_asFunctionalComponent(__VLS_188, new __VLS_188({
        value: "实时",
    }));
    const __VLS_190 = __VLS_189({
        value: "实时",
    }, ...__VLS_functionalComponentArgsRest(__VLS_189));
    const __VLS_192 = {}.ElRadio;
    /** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
    // @ts-ignore
    const __VLS_193 = __VLS_asFunctionalComponent(__VLS_192, new __VLS_192({
        value: "流式",
    }));
    const __VLS_194 = __VLS_193({
        value: "流式",
    }, ...__VLS_functionalComponentArgsRest(__VLS_193));
    var __VLS_183;
    var __VLS_179;
    const __VLS_196 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_197 = __VLS_asFunctionalComponent(__VLS_196, new __VLS_196({
        label: "选择模板",
    }));
    const __VLS_198 = __VLS_197({
        label: "选择模板",
    }, ...__VLS_functionalComponentArgsRest(__VLS_197));
    __VLS_199.slots.default;
    const __VLS_200 = {}.ElSelect;
    /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
    // @ts-ignore
    const __VLS_201 = __VLS_asFunctionalComponent(__VLS_200, new __VLS_200({
        modelValue: (__VLS_ctx.form.templateName),
        ...{ class: "w-full" },
    }));
    const __VLS_202 = __VLS_201({
        modelValue: (__VLS_ctx.form.templateName),
        ...{ class: "w-full" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_201));
    __VLS_203.slots.default;
    for (const [template] of __VLS_getVForSourceType((__VLS_ctx.templates))) {
        const __VLS_204 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_205 = __VLS_asFunctionalComponent(__VLS_204, new __VLS_204({
            key: (template.name),
            label: (template.name),
            value: (template.name),
        }));
        const __VLS_206 = __VLS_205({
            key: (template.name),
            label: (template.name),
            value: (template.name),
        }, ...__VLS_functionalComponentArgsRest(__VLS_205));
    }
    var __VLS_203;
    var __VLS_199;
    var __VLS_167;
}
else if (__VLS_ctx.wizardStep === 1) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    const __VLS_208 = {}.ElForm;
    /** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
    // @ts-ignore
    const __VLS_209 = __VLS_asFunctionalComponent(__VLS_208, new __VLS_208({
        labelWidth: "100px",
    }));
    const __VLS_210 = __VLS_209({
        labelWidth: "100px",
    }, ...__VLS_functionalComponentArgsRest(__VLS_209));
    __VLS_211.slots.default;
    const __VLS_212 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_213 = __VLS_asFunctionalComponent(__VLS_212, new __VLS_212({
        label: "调度方式",
    }));
    const __VLS_214 = __VLS_213({
        label: "调度方式",
    }, ...__VLS_functionalComponentArgsRest(__VLS_213));
    __VLS_215.slots.default;
    const __VLS_216 = {}.ElSelect;
    /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
    // @ts-ignore
    const __VLS_217 = __VLS_asFunctionalComponent(__VLS_216, new __VLS_216({
        modelValue: (__VLS_ctx.form.schedule),
        ...{ class: "w-full" },
    }));
    const __VLS_218 = __VLS_217({
        modelValue: (__VLS_ctx.form.schedule),
        ...{ class: "w-full" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_217));
    __VLS_219.slots.default;
    const __VLS_220 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_221 = __VLS_asFunctionalComponent(__VLS_220, new __VLS_220({
        label: "每日 02:00",
        value: "每日 02:00",
    }));
    const __VLS_222 = __VLS_221({
        label: "每日 02:00",
        value: "每日 02:00",
    }, ...__VLS_functionalComponentArgsRest(__VLS_221));
    const __VLS_224 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_225 = __VLS_asFunctionalComponent(__VLS_224, new __VLS_224({
        label: "每小时",
        value: "每小时",
    }));
    const __VLS_226 = __VLS_225({
        label: "每小时",
        value: "每小时",
    }, ...__VLS_functionalComponentArgsRest(__VLS_225));
    const __VLS_228 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_229 = __VLS_asFunctionalComponent(__VLS_228, new __VLS_228({
        label: "每周一 03:00",
        value: "每周一 03:00",
    }));
    const __VLS_230 = __VLS_229({
        label: "每周一 03:00",
        value: "每周一 03:00",
    }, ...__VLS_functionalComponentArgsRest(__VLS_229));
    const __VLS_232 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_233 = __VLS_asFunctionalComponent(__VLS_232, new __VLS_232({
        label: "手动触发",
        value: "手动触发",
    }));
    const __VLS_234 = __VLS_233({
        label: "手动触发",
        value: "手动触发",
    }, ...__VLS_functionalComponentArgsRest(__VLS_233));
    var __VLS_219;
    var __VLS_215;
    const __VLS_236 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_237 = __VLS_asFunctionalComponent(__VLS_236, new __VLS_236({
        label: "依赖任务",
    }));
    const __VLS_238 = __VLS_237({
        label: "依赖任务",
    }, ...__VLS_functionalComponentArgsRest(__VLS_237));
    __VLS_239.slots.default;
    const __VLS_240 = {}.ElSelect;
    /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
    // @ts-ignore
    const __VLS_241 = __VLS_asFunctionalComponent(__VLS_240, new __VLS_240({
        modelValue: (__VLS_ctx.form.dependencies),
        ...{ class: "w-full" },
        clearable: true,
        multiple: true,
        placeholder: "选择前置任务",
    }));
    const __VLS_242 = __VLS_241({
        modelValue: (__VLS_ctx.form.dependencies),
        ...{ class: "w-full" },
        clearable: true,
        multiple: true,
        placeholder: "选择前置任务",
    }, ...__VLS_functionalComponentArgsRest(__VLS_241));
    __VLS_243.slots.default;
    for (const [task] of __VLS_getVForSourceType((__VLS_ctx.mockDevTasks.slice(0, 10)))) {
        const __VLS_244 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_245 = __VLS_asFunctionalComponent(__VLS_244, new __VLS_244({
            key: (task.id),
            label: (task.name),
            value: (task.name),
        }));
        const __VLS_246 = __VLS_245({
            key: (task.id),
            label: (task.name),
            value: (task.name),
        }, ...__VLS_functionalComponentArgsRest(__VLS_245));
    }
    var __VLS_243;
    var __VLS_239;
    var __VLS_211;
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    const __VLS_248 = {}.ElForm;
    /** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
    // @ts-ignore
    const __VLS_249 = __VLS_asFunctionalComponent(__VLS_248, new __VLS_248({
        labelWidth: "100px",
    }));
    const __VLS_250 = __VLS_249({
        labelWidth: "100px",
    }, ...__VLS_functionalComponentArgsRest(__VLS_249));
    __VLS_251.slots.default;
    const __VLS_252 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_253 = __VLS_asFunctionalComponent(__VLS_252, new __VLS_252({
        label: "参数化配置",
    }));
    const __VLS_254 = __VLS_253({
        label: "参数化配置",
    }, ...__VLS_functionalComponentArgsRest(__VLS_253));
    __VLS_255.slots.default;
    for (const [param, index] of __VLS_getVForSourceType((__VLS_ctx.form.params))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "param-row" },
            key: (index),
        });
        const __VLS_256 = {}.ElInput;
        /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
        // @ts-ignore
        const __VLS_257 = __VLS_asFunctionalComponent(__VLS_256, new __VLS_256({
            modelValue: (param.key),
            placeholder: "参数名",
            ...{ class: "param-input" },
        }));
        const __VLS_258 = __VLS_257({
            modelValue: (param.key),
            placeholder: "参数名",
            ...{ class: "param-input" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_257));
        const __VLS_260 = {}.ElInput;
        /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
        // @ts-ignore
        const __VLS_261 = __VLS_asFunctionalComponent(__VLS_260, new __VLS_260({
            modelValue: (param.value),
            placeholder: "参数值",
            ...{ class: "param-input" },
        }));
        const __VLS_262 = __VLS_261({
            modelValue: (param.value),
            placeholder: "参数值",
            ...{ class: "param-input" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_261));
        const __VLS_264 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_265 = __VLS_asFunctionalComponent(__VLS_264, new __VLS_264({
            ...{ 'onClick': {} },
            link: true,
            type: "danger",
        }));
        const __VLS_266 = __VLS_265({
            ...{ 'onClick': {} },
            link: true,
            type: "danger",
        }, ...__VLS_functionalComponentArgsRest(__VLS_265));
        let __VLS_268;
        let __VLS_269;
        let __VLS_270;
        const __VLS_271 = {
            onClick: (...[$event]) => {
                if (!!(__VLS_ctx.wizardStep === 0))
                    return;
                if (!!(__VLS_ctx.wizardStep === 1))
                    return;
                __VLS_ctx.removeParam(index);
            }
        };
        __VLS_267.slots.default;
        var __VLS_267;
    }
    const __VLS_272 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_273 = __VLS_asFunctionalComponent(__VLS_272, new __VLS_272({
        ...{ 'onClick': {} },
        size: "small",
        type: "danger",
        plain: true,
    }));
    const __VLS_274 = __VLS_273({
        ...{ 'onClick': {} },
        size: "small",
        type: "danger",
        plain: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_273));
    let __VLS_276;
    let __VLS_277;
    let __VLS_278;
    const __VLS_279 = {
        onClick: (__VLS_ctx.addParam)
    };
    __VLS_275.slots.default;
    var __VLS_275;
    var __VLS_255;
    var __VLS_251;
}
{
    const { footer: __VLS_thisSlot } = __VLS_147.slots;
    if (__VLS_ctx.wizardStep > 0) {
        const __VLS_280 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_281 = __VLS_asFunctionalComponent(__VLS_280, new __VLS_280({
            ...{ 'onClick': {} },
        }));
        const __VLS_282 = __VLS_281({
            ...{ 'onClick': {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_281));
        let __VLS_284;
        let __VLS_285;
        let __VLS_286;
        const __VLS_287 = {
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.wizardStep > 0))
                    return;
                __VLS_ctx.wizardStep -= 1;
            }
        };
        __VLS_283.slots.default;
        var __VLS_283;
    }
    if (__VLS_ctx.wizardStep < 2) {
        const __VLS_288 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_289 = __VLS_asFunctionalComponent(__VLS_288, new __VLS_288({
            ...{ 'onClick': {} },
            type: "danger",
        }));
        const __VLS_290 = __VLS_289({
            ...{ 'onClick': {} },
            type: "danger",
        }, ...__VLS_functionalComponentArgsRest(__VLS_289));
        let __VLS_292;
        let __VLS_293;
        let __VLS_294;
        const __VLS_295 = {
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.wizardStep < 2))
                    return;
                __VLS_ctx.wizardStep += 1;
            }
        };
        __VLS_291.slots.default;
        var __VLS_291;
    }
    else {
        const __VLS_296 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_297 = __VLS_asFunctionalComponent(__VLS_296, new __VLS_296({
            ...{ 'onClick': {} },
            type: "danger",
        }));
        const __VLS_298 = __VLS_297({
            ...{ 'onClick': {} },
            type: "danger",
        }, ...__VLS_functionalComponentArgsRest(__VLS_297));
        let __VLS_300;
        let __VLS_301;
        let __VLS_302;
        const __VLS_303 = {
            onClick: (__VLS_ctx.saveForm)
        };
        __VLS_299.slots.default;
        var __VLS_299;
    }
}
var __VLS_147;
const __VLS_304 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_305 = __VLS_asFunctionalComponent(__VLS_304, new __VLS_304({
    modelValue: (__VLS_ctx.auditVisible),
    title: "操作留痕审计",
    width: "560px",
}));
const __VLS_306 = __VLS_305({
    modelValue: (__VLS_ctx.auditVisible),
    title: "操作留痕审计",
    width: "560px",
}, ...__VLS_functionalComponentArgsRest(__VLS_305));
__VLS_307.slots.default;
const __VLS_308 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_309 = __VLS_asFunctionalComponent(__VLS_308, new __VLS_308({
    data: (__VLS_ctx.auditRows),
    stripe: true,
    size: "small",
}));
const __VLS_310 = __VLS_309({
    data: (__VLS_ctx.auditRows),
    stripe: true,
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_309));
__VLS_311.slots.default;
const __VLS_312 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_313 = __VLS_asFunctionalComponent(__VLS_312, new __VLS_312({
    prop: "time",
    label: "时间",
    width: "150",
}));
const __VLS_314 = __VLS_313({
    prop: "time",
    label: "时间",
    width: "150",
}, ...__VLS_functionalComponentArgsRest(__VLS_313));
const __VLS_316 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_317 = __VLS_asFunctionalComponent(__VLS_316, new __VLS_316({
    prop: "user",
    label: "操作人",
    width: "90",
}));
const __VLS_318 = __VLS_317({
    prop: "user",
    label: "操作人",
    width: "90",
}, ...__VLS_functionalComponentArgsRest(__VLS_317));
const __VLS_320 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_321 = __VLS_asFunctionalComponent(__VLS_320, new __VLS_320({
    prop: "action",
    label: "操作",
    minWidth: "120",
}));
const __VLS_322 = __VLS_321({
    prop: "action",
    label: "操作",
    minWidth: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_321));
const __VLS_324 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_325 = __VLS_asFunctionalComponent(__VLS_324, new __VLS_324({
    prop: "detail",
    label: "详情",
    minWidth: "140",
}));
const __VLS_326 = __VLS_325({
    prop: "detail",
    label: "详情",
    minWidth: "140",
}, ...__VLS_functionalComponentArgsRest(__VLS_325));
var __VLS_311;
var __VLS_307;
/** @type {__VLS_StyleScopedClasses['standard-page']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['toolbar-row']} */ ;
/** @type {__VLS_StyleScopedClasses['search-input']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-select']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-12']} */ ;
/** @type {__VLS_StyleScopedClasses['dep-text']} */ ;
/** @type {__VLS_StyleScopedClasses['pager']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['template-item']} */ ;
/** @type {__VLS_StyleScopedClasses['template-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['template-info']} */ ;
/** @type {__VLS_StyleScopedClasses['template-name']} */ ;
/** @type {__VLS_StyleScopedClasses['template-desc']} */ ;
/** @type {__VLS_StyleScopedClasses['register-steps']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['param-row']} */ ;
/** @type {__VLS_StyleScopedClasses['param-input']} */ ;
/** @type {__VLS_StyleScopedClasses['param-input']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Plus: Plus,
            Search: Search,
            mockDevTasks: mockDevTasks,
            statusTagType: statusTagType,
            templates: templates,
            keyword: keyword,
            filterStatus: filterStatus,
            wizardVisible: wizardVisible,
            wizardStep: wizardStep,
            auditVisible: auditVisible,
            form: form,
            filteredTasks: filteredTasks,
            auditRows: auditRows,
            openWizard: openWizard,
            applyTemplate: applyTemplate,
            addParam: addParam,
            removeParam: removeParam,
            saveForm: saveForm,
            toggleTask: toggleTask,
            stopTask: stopTask,
            cloneTask: cloneTask,
            showAudit: showAudit,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
