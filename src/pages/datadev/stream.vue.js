import { computed, reactive, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { CircleCheck, Plus, Search, WindPower } from '@element-plus/icons-vue';
import { mockStreamTasks } from '@/mock/datadev';
const statusTagType = {
    运行中: 'warning',
    成功: 'success',
    失败: 'danger',
    待执行: 'warning',
};
const windowTypes = ['滚动窗口', '滑动窗口', '会话窗口'];
const engines = ['Kafka', 'Pulsar', 'RocketMQ'];
const streamTasks = ref(mockStreamTasks.map((task, index) => ({
    ...task,
    engine: engines[index % engines.length],
    windowType: windowTypes[index % windowTypes.length],
    windowSize: 5 + (index % 4) * 5,
    cep: index % 2 === 0,
    checkpoint: index % 4 !== 1,
})));
const coopItems = [
    { name: '流批一体调度', desc: '同一任务支持流式与批量两种执行模式' },
    { name: '统一元数据', desc: '流批共用表结构定义与质量规则' },
    { name: '双链路结果一致性', desc: '批式结果与流式结果自动校验' },
];
const keyword = ref('');
const filterEngine = ref('');
const editorVisible = ref(false);
const form = reactive({
    name: '',
    engine: 'Kafka',
    windowType: '滚动窗口',
    windowSize: 5,
    cep: true,
    logic: '',
});
const filteredTasks = computed(() => streamTasks.value.filter((task) => {
    if (filterEngine.value && task.engine !== filterEngine.value)
        return false;
    if (!keyword.value)
        return true;
    return task.name.toLowerCase().includes(keyword.value.toLowerCase());
}));
const openCreate = () => {
    Object.assign(form, { name: '', engine: 'Kafka', windowType: '滚动窗口', windowSize: 5, cep: true, logic: '' });
    editorVisible.value = true;
};
const saveForm = () => {
    if (!form.name.trim()) {
        ElMessage.warning('请输入任务名称');
        return;
    }
    streamTasks.value.unshift({
        id: `stream-mock-${Date.now()}`,
        name: form.name,
        type: '流式',
        sourceName: form.engine,
        targetName: '实时数仓',
        schedule: '持续运行',
        status: '待执行',
        progress: 0,
        dataCount: 0,
        owner: '张三',
        lastRunTime: '-',
        description: '新建流式任务',
        engine: form.engine,
        windowType: form.windowType,
        windowSize: form.windowSize,
        cep: form.cep,
        checkpoint: true,
    });
    editorVisible.value = false;
    ElMessage.success('流式任务已创建（Mock）');
};
const showCheckpoint = (row) => {
    ElMessageBox.alert(`任务「${row.name}」\n最近检查点：2026-08-11 14:31:58\n状态：成功（Exactly-Once）\n恢复耗时：1.2s\n数据延迟：0ms`, 'Checkpoint 容错信息', { type: 'success' });
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
    modelValue: (__VLS_ctx.filterEngine),
    placeholder: "消息队列",
    clearable: true,
    ...{ class: "filter-select" },
}));
const __VLS_26 = __VLS_25({
    modelValue: (__VLS_ctx.filterEngine),
    placeholder: "消息队列",
    clearable: true,
    ...{ class: "filter-select" },
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
__VLS_27.slots.default;
const __VLS_28 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
    label: "Kafka",
    value: "Kafka",
}));
const __VLS_30 = __VLS_29({
    label: "Kafka",
    value: "Kafka",
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
const __VLS_32 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
    label: "Pulsar",
    value: "Pulsar",
}));
const __VLS_34 = __VLS_33({
    label: "Pulsar",
    value: "Pulsar",
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
const __VLS_36 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    label: "RocketMQ",
    value: "RocketMQ",
}));
const __VLS_38 = __VLS_37({
    label: "RocketMQ",
    value: "RocketMQ",
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
var __VLS_27;
const __VLS_40 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
    data: (__VLS_ctx.filteredTasks),
    stripe: true,
    ...{ class: "mt-12" },
}));
const __VLS_42 = __VLS_41({
    data: (__VLS_ctx.filteredTasks),
    stripe: true,
    ...{ class: "mt-12" },
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
__VLS_43.slots.default;
const __VLS_44 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    prop: "name",
    label: "任务名称",
    minWidth: "180",
}));
const __VLS_46 = __VLS_45({
    prop: "name",
    label: "任务名称",
    minWidth: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
const __VLS_48 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
    prop: "engine",
    label: "消息队列",
    width: "110",
}));
const __VLS_50 = __VLS_49({
    prop: "engine",
    label: "消息队列",
    width: "110",
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
__VLS_51.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_51.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_52 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
        effect: "plain",
        type: "danger",
    }));
    const __VLS_54 = __VLS_53({
        effect: "plain",
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_53));
    __VLS_55.slots.default;
    (row.engine);
    var __VLS_55;
}
var __VLS_51;
const __VLS_56 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
    label: "窗口类型",
    width: "110",
}));
const __VLS_58 = __VLS_57({
    label: "窗口类型",
    width: "110",
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
__VLS_59.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_59.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    (row.windowType);
}
var __VLS_59;
const __VLS_60 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
    label: "CEP",
    width: "80",
    align: "center",
}));
const __VLS_62 = __VLS_61({
    label: "CEP",
    width: "80",
    align: "center",
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
        type: (row.cep ? 'success' : 'info'),
    }));
    const __VLS_66 = __VLS_65({
        effect: "plain",
        type: (row.cep ? 'success' : 'info'),
    }, ...__VLS_functionalComponentArgsRest(__VLS_65));
    __VLS_67.slots.default;
    (row.cep ? '启用' : '关闭');
    var __VLS_67;
}
var __VLS_63;
const __VLS_68 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
    label: "Checkpoint",
    width: "100",
    align: "center",
}));
const __VLS_70 = __VLS_69({
    label: "Checkpoint",
    width: "100",
    align: "center",
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
        type: (row.checkpoint ? 'success' : 'warning'),
    }));
    const __VLS_74 = __VLS_73({
        effect: "plain",
        type: (row.checkpoint ? 'success' : 'warning'),
    }, ...__VLS_functionalComponentArgsRest(__VLS_73));
    __VLS_75.slots.default;
    (row.checkpoint ? '每 60s' : '未配置');
    var __VLS_75;
}
var __VLS_71;
const __VLS_76 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
    label: "状态",
    width: "90",
}));
const __VLS_78 = __VLS_77({
    label: "状态",
    width: "90",
}, ...__VLS_functionalComponentArgsRest(__VLS_77));
__VLS_79.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_79.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_80 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
        type: (__VLS_ctx.statusTagType[row.status]),
        effect: "dark",
    }));
    const __VLS_82 = __VLS_81({
        type: (__VLS_ctx.statusTagType[row.status]),
        effect: "dark",
    }, ...__VLS_functionalComponentArgsRest(__VLS_81));
    __VLS_83.slots.default;
    (row.status);
    var __VLS_83;
}
var __VLS_79;
const __VLS_84 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
    label: "操作",
    width: "150",
    fixed: "right",
}));
const __VLS_86 = __VLS_85({
    label: "操作",
    width: "150",
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
            __VLS_ctx.showCheckpoint(row);
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
        onClick: (__VLS_ctx.openCreate)
    };
    __VLS_99.slots.default;
    var __VLS_99;
}
var __VLS_87;
var __VLS_43;
const __VLS_104 = {}.ElPagination;
/** @type {[typeof __VLS_components.ElPagination, typeof __VLS_components.elPagination, ]} */ ;
// @ts-ignore
const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
    ...{ class: "pager" },
    layout: "total, prev, pager, next",
    total: (__VLS_ctx.filteredTasks.length),
    pageSize: (20),
    background: true,
}));
const __VLS_106 = __VLS_105({
    ...{ class: "pager" },
    layout: "total, prev, pager, next",
    total: (__VLS_ctx.filteredTasks.length),
    pageSize: (20),
    background: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_105));
var __VLS_11;
var __VLS_7;
const __VLS_108 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
    span: (8),
}));
const __VLS_110 = __VLS_109({
    span: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_109));
__VLS_111.slots.default;
const __VLS_112 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
    ...{ class: "panel-card dashboard-card" },
    shadow: "never",
}));
const __VLS_114 = __VLS_113({
    ...{ class: "panel-card dashboard-card" },
    shadow: "never",
}, ...__VLS_functionalComponentArgsRest(__VLS_113));
__VLS_115.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_115.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
}
for (const [item] of __VLS_getVForSourceType((__VLS_ctx.coopItems))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "coop-item" },
        key: (item.name),
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "coop-item-icon" },
    });
    const __VLS_116 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
        size: (16),
    }));
    const __VLS_118 = __VLS_117({
        size: (16),
    }, ...__VLS_functionalComponentArgsRest(__VLS_117));
    __VLS_119.slots.default;
    const __VLS_120 = {}.WindPower;
    /** @type {[typeof __VLS_components.WindPower, ]} */ ;
    // @ts-ignore
    const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({}));
    const __VLS_122 = __VLS_121({}, ...__VLS_functionalComponentArgsRest(__VLS_121));
    var __VLS_119;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "coop-item-info" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "coop-item-name" },
    });
    (item.name);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "coop-item-desc" },
    });
    (item.desc);
}
var __VLS_115;
const __VLS_124 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({
    ...{ class: "panel-card dashboard-card mt-16" },
    shadow: "never",
}));
const __VLS_126 = __VLS_125({
    ...{ class: "panel-card dashboard-card mt-16" },
    shadow: "never",
}, ...__VLS_functionalComponentArgsRest(__VLS_125));
__VLS_127.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_127.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "coop-item" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "coop-item-icon" },
});
const __VLS_128 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({
    size: (16),
}));
const __VLS_130 = __VLS_129({
    size: (16),
}, ...__VLS_functionalComponentArgsRest(__VLS_129));
__VLS_131.slots.default;
const __VLS_132 = {}.CircleCheck;
/** @type {[typeof __VLS_components.CircleCheck, ]} */ ;
// @ts-ignore
const __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132({}));
const __VLS_134 = __VLS_133({}, ...__VLS_functionalComponentArgsRest(__VLS_133));
var __VLS_131;
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
const __VLS_136 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_137 = __VLS_asFunctionalComponent(__VLS_136, new __VLS_136({
    size: (16),
}));
const __VLS_138 = __VLS_137({
    size: (16),
}, ...__VLS_functionalComponentArgsRest(__VLS_137));
__VLS_139.slots.default;
const __VLS_140 = {}.CircleCheck;
/** @type {[typeof __VLS_components.CircleCheck, ]} */ ;
// @ts-ignore
const __VLS_141 = __VLS_asFunctionalComponent(__VLS_140, new __VLS_140({}));
const __VLS_142 = __VLS_141({}, ...__VLS_functionalComponentArgsRest(__VLS_141));
var __VLS_139;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "coop-item-info" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "coop-item-name" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "coop-item-desc" },
});
var __VLS_127;
var __VLS_111;
var __VLS_3;
const __VLS_144 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_145 = __VLS_asFunctionalComponent(__VLS_144, new __VLS_144({
    modelValue: (__VLS_ctx.editorVisible),
    title: "新建流式任务",
    width: "560px",
}));
const __VLS_146 = __VLS_145({
    modelValue: (__VLS_ctx.editorVisible),
    title: "新建流式任务",
    width: "560px",
}, ...__VLS_functionalComponentArgsRest(__VLS_145));
__VLS_147.slots.default;
const __VLS_148 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_149 = __VLS_asFunctionalComponent(__VLS_148, new __VLS_148({
    model: (__VLS_ctx.form),
    labelWidth: "100px",
}));
const __VLS_150 = __VLS_149({
    model: (__VLS_ctx.form),
    labelWidth: "100px",
}, ...__VLS_functionalComponentArgsRest(__VLS_149));
__VLS_151.slots.default;
const __VLS_152 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_153 = __VLS_asFunctionalComponent(__VLS_152, new __VLS_152({
    label: "任务名称",
}));
const __VLS_154 = __VLS_153({
    label: "任务名称",
}, ...__VLS_functionalComponentArgsRest(__VLS_153));
__VLS_155.slots.default;
const __VLS_156 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_157 = __VLS_asFunctionalComponent(__VLS_156, new __VLS_156({
    modelValue: (__VLS_ctx.form.name),
}));
const __VLS_158 = __VLS_157({
    modelValue: (__VLS_ctx.form.name),
}, ...__VLS_functionalComponentArgsRest(__VLS_157));
var __VLS_155;
const __VLS_160 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_161 = __VLS_asFunctionalComponent(__VLS_160, new __VLS_160({
    label: "消息队列",
}));
const __VLS_162 = __VLS_161({
    label: "消息队列",
}, ...__VLS_functionalComponentArgsRest(__VLS_161));
__VLS_163.slots.default;
const __VLS_164 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_165 = __VLS_asFunctionalComponent(__VLS_164, new __VLS_164({
    modelValue: (__VLS_ctx.form.engine),
    ...{ class: "w-full" },
}));
const __VLS_166 = __VLS_165({
    modelValue: (__VLS_ctx.form.engine),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_165));
__VLS_167.slots.default;
const __VLS_168 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_169 = __VLS_asFunctionalComponent(__VLS_168, new __VLS_168({
    label: "Kafka",
    value: "Kafka",
}));
const __VLS_170 = __VLS_169({
    label: "Kafka",
    value: "Kafka",
}, ...__VLS_functionalComponentArgsRest(__VLS_169));
const __VLS_172 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_173 = __VLS_asFunctionalComponent(__VLS_172, new __VLS_172({
    label: "Pulsar",
    value: "Pulsar",
}));
const __VLS_174 = __VLS_173({
    label: "Pulsar",
    value: "Pulsar",
}, ...__VLS_functionalComponentArgsRest(__VLS_173));
const __VLS_176 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_177 = __VLS_asFunctionalComponent(__VLS_176, new __VLS_176({
    label: "RocketMQ",
    value: "RocketMQ",
}));
const __VLS_178 = __VLS_177({
    label: "RocketMQ",
    value: "RocketMQ",
}, ...__VLS_functionalComponentArgsRest(__VLS_177));
var __VLS_167;
var __VLS_163;
const __VLS_180 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_181 = __VLS_asFunctionalComponent(__VLS_180, new __VLS_180({
    label: "窗口类型",
}));
const __VLS_182 = __VLS_181({
    label: "窗口类型",
}, ...__VLS_functionalComponentArgsRest(__VLS_181));
__VLS_183.slots.default;
const __VLS_184 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_185 = __VLS_asFunctionalComponent(__VLS_184, new __VLS_184({
    modelValue: (__VLS_ctx.form.windowType),
    ...{ class: "w-full" },
}));
const __VLS_186 = __VLS_185({
    modelValue: (__VLS_ctx.form.windowType),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_185));
__VLS_187.slots.default;
const __VLS_188 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_189 = __VLS_asFunctionalComponent(__VLS_188, new __VLS_188({
    label: "滚动窗口",
    value: "滚动窗口",
}));
const __VLS_190 = __VLS_189({
    label: "滚动窗口",
    value: "滚动窗口",
}, ...__VLS_functionalComponentArgsRest(__VLS_189));
const __VLS_192 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_193 = __VLS_asFunctionalComponent(__VLS_192, new __VLS_192({
    label: "滑动窗口",
    value: "滑动窗口",
}));
const __VLS_194 = __VLS_193({
    label: "滑动窗口",
    value: "滑动窗口",
}, ...__VLS_functionalComponentArgsRest(__VLS_193));
const __VLS_196 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_197 = __VLS_asFunctionalComponent(__VLS_196, new __VLS_196({
    label: "会话窗口",
    value: "会话窗口",
}));
const __VLS_198 = __VLS_197({
    label: "会话窗口",
    value: "会话窗口",
}, ...__VLS_functionalComponentArgsRest(__VLS_197));
var __VLS_187;
var __VLS_183;
const __VLS_200 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_201 = __VLS_asFunctionalComponent(__VLS_200, new __VLS_200({
    label: "窗口大小",
}));
const __VLS_202 = __VLS_201({
    label: "窗口大小",
}, ...__VLS_functionalComponentArgsRest(__VLS_201));
__VLS_203.slots.default;
const __VLS_204 = {}.ElInputNumber;
/** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
// @ts-ignore
const __VLS_205 = __VLS_asFunctionalComponent(__VLS_204, new __VLS_204({
    modelValue: (__VLS_ctx.form.windowSize),
    min: (1),
    max: (120),
}));
const __VLS_206 = __VLS_205({
    modelValue: (__VLS_ctx.form.windowSize),
    min: (1),
    max: (120),
}, ...__VLS_functionalComponentArgsRest(__VLS_205));
var __VLS_203;
const __VLS_208 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_209 = __VLS_asFunctionalComponent(__VLS_208, new __VLS_208({
    label: "CEP",
}));
const __VLS_210 = __VLS_209({
    label: "CEP",
}, ...__VLS_functionalComponentArgsRest(__VLS_209));
__VLS_211.slots.default;
const __VLS_212 = {}.ElSwitch;
/** @type {[typeof __VLS_components.ElSwitch, typeof __VLS_components.elSwitch, ]} */ ;
// @ts-ignore
const __VLS_213 = __VLS_asFunctionalComponent(__VLS_212, new __VLS_212({
    modelValue: (__VLS_ctx.form.cep),
    activeText: "启用复杂事件处理",
}));
const __VLS_214 = __VLS_213({
    modelValue: (__VLS_ctx.form.cep),
    activeText: "启用复杂事件处理",
}, ...__VLS_functionalComponentArgsRest(__VLS_213));
var __VLS_211;
const __VLS_216 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_217 = __VLS_asFunctionalComponent(__VLS_216, new __VLS_216({
    label: "处理逻辑",
}));
const __VLS_218 = __VLS_217({
    label: "处理逻辑",
}, ...__VLS_functionalComponentArgsRest(__VLS_217));
__VLS_219.slots.default;
const __VLS_220 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_221 = __VLS_asFunctionalComponent(__VLS_220, new __VLS_220({
    modelValue: (__VLS_ctx.form.logic),
    type: "textarea",
    rows: (4),
    placeholder: "实时ETL / 窗口聚合 / 异常事件识别",
}));
const __VLS_222 = __VLS_221({
    modelValue: (__VLS_ctx.form.logic),
    type: "textarea",
    rows: (4),
    placeholder: "实时ETL / 窗口聚合 / 异常事件识别",
}, ...__VLS_functionalComponentArgsRest(__VLS_221));
var __VLS_219;
var __VLS_151;
{
    const { footer: __VLS_thisSlot } = __VLS_147.slots;
    const __VLS_224 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_225 = __VLS_asFunctionalComponent(__VLS_224, new __VLS_224({
        ...{ 'onClick': {} },
    }));
    const __VLS_226 = __VLS_225({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_225));
    let __VLS_228;
    let __VLS_229;
    let __VLS_230;
    const __VLS_231 = {
        onClick: (...[$event]) => {
            __VLS_ctx.editorVisible = false;
        }
    };
    __VLS_227.slots.default;
    var __VLS_227;
    const __VLS_232 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_233 = __VLS_asFunctionalComponent(__VLS_232, new __VLS_232({
        ...{ 'onClick': {} },
        type: "danger",
    }));
    const __VLS_234 = __VLS_233({
        ...{ 'onClick': {} },
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_233));
    let __VLS_236;
    let __VLS_237;
    let __VLS_238;
    const __VLS_239 = {
        onClick: (__VLS_ctx.saveForm)
    };
    __VLS_235.slots.default;
    var __VLS_235;
}
var __VLS_147;
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
/** @type {__VLS_StyleScopedClasses['coop-item']} */ ;
/** @type {__VLS_StyleScopedClasses['coop-item-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['coop-item-info']} */ ;
/** @type {__VLS_StyleScopedClasses['coop-item-name']} */ ;
/** @type {__VLS_StyleScopedClasses['coop-item-desc']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
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
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            CircleCheck: CircleCheck,
            Plus: Plus,
            Search: Search,
            WindPower: WindPower,
            statusTagType: statusTagType,
            coopItems: coopItems,
            keyword: keyword,
            filterEngine: filterEngine,
            editorVisible: editorVisible,
            form: form,
            filteredTasks: filteredTasks,
            openCreate: openCreate,
            saveForm: saveForm,
            showCheckpoint: showCheckpoint,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
