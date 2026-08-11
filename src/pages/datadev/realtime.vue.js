import { computed, reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { Plus, Search } from '@element-plus/icons-vue';
import { mockRealtimeTasks } from '@/mock/datadev';
const statusTagType = {
    运行中: 'warning',
    成功: 'success',
    失败: 'danger',
    待执行: 'warning',
};
const realtimeTasks = ref(mockRealtimeTasks.map((task, index) => ({
    ...task,
    channel: index % 2 === 0 ? 'Kafka' : 'RabbitMQ',
    topic: index % 2 === 0 ? `metro.${task.sourceName.split(' ')[0]}.delta` : `queue.${task.sourceName.split(' ')[0]}`,
    format: ['JSON', 'JSON', 'Avro', 'XML'][index % 4],
    cdc: index % 3 !== 0,
})));
const keyword = ref('');
const filterChannel = ref('');
const editorVisible = ref(false);
const previewTopic = ref('metro.customer.delta');
const previewRows = [
    { field: 'cust_id', value: 'C1000001', timestamp: '14:32:08.124' },
    { field: 'cust_name', value: '张三', timestamp: '14:32:08.124' },
    { field: 'op_type', value: 'UPDATE', timestamp: '14:32:08.124' },
    { field: 'cert_no', value: '4401***9123（脱敏）', timestamp: '14:32:08.124' },
];
const form = reactive({
    name: '',
    channel: 'Kafka',
    topic: '',
    format: 'JSON',
    cdc: true,
    logic: '',
});
const filteredTasks = computed(() => realtimeTasks.value.filter((task) => {
    if (filterChannel.value && task.channel !== filterChannel.value)
        return false;
    if (!keyword.value)
        return true;
    return task.name.toLowerCase().includes(keyword.value.toLowerCase());
}));
const openCreate = () => {
    Object.assign(form, { name: '', channel: 'Kafka', topic: '', format: 'JSON', cdc: true, logic: '' });
    editorVisible.value = true;
};
const saveForm = () => {
    if (!form.name.trim() || !form.topic.trim()) {
        ElMessage.warning('请填写任务名称和 Topic');
        return;
    }
    realtimeTasks.value.unshift({
        id: `realtime-mock-${Date.now()}`,
        name: form.name,
        type: '实时',
        sourceName: form.channel,
        targetName: '实时数仓',
        schedule: '实时',
        status: '待执行',
        progress: 0,
        dataCount: 0,
        owner: '张三',
        lastRunTime: '-',
        description: '新建实时任务',
        channel: form.channel,
        topic: form.topic,
        format: form.format,
        cdc: form.cdc,
    });
    editorVisible.value = false;
    ElMessage.success('实时任务已创建（Mock）');
};
const previewTask = (row) => {
    previewTopic.value = row.topic;
    ElMessage.success(`已获取「${row.name}」实时采样数据 4 条（Mock）`);
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
    modelValue: (__VLS_ctx.filterChannel),
    placeholder: "消息队列",
    clearable: true,
    ...{ class: "filter-select" },
}));
const __VLS_26 = __VLS_25({
    modelValue: (__VLS_ctx.filterChannel),
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
    label: "RabbitMQ",
    value: "RabbitMQ",
}));
const __VLS_34 = __VLS_33({
    label: "RabbitMQ",
    value: "RabbitMQ",
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
var __VLS_27;
const __VLS_36 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    data: (__VLS_ctx.filteredTasks),
    stripe: true,
    ...{ class: "mt-12" },
}));
const __VLS_38 = __VLS_37({
    data: (__VLS_ctx.filteredTasks),
    stripe: true,
    ...{ class: "mt-12" },
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
__VLS_39.slots.default;
const __VLS_40 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
    prop: "name",
    label: "任务名称",
    minWidth: "180",
}));
const __VLS_42 = __VLS_41({
    prop: "name",
    label: "任务名称",
    minWidth: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
const __VLS_44 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    prop: "channel",
    label: "消息队列",
    width: "110",
}));
const __VLS_46 = __VLS_45({
    prop: "channel",
    label: "消息队列",
    width: "110",
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
__VLS_47.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_47.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_48 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
        effect: "plain",
        type: "danger",
    }));
    const __VLS_50 = __VLS_49({
        effect: "plain",
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_49));
    __VLS_51.slots.default;
    (row.channel);
    var __VLS_51;
}
var __VLS_47;
const __VLS_52 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
    prop: "topic",
    label: "主题/Topic",
    width: "140",
}));
const __VLS_54 = __VLS_53({
    prop: "topic",
    label: "主题/Topic",
    width: "140",
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
const __VLS_56 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
    label: "消息格式",
    width: "90",
}));
const __VLS_58 = __VLS_57({
    label: "消息格式",
    width: "90",
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
__VLS_59.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_59.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    (row.format);
}
var __VLS_59;
const __VLS_60 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
    label: "CDC",
    width: "80",
    align: "center",
}));
const __VLS_62 = __VLS_61({
    label: "CDC",
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
        type: (row.cdc ? 'success' : 'info'),
    }));
    const __VLS_66 = __VLS_65({
        effect: "plain",
        type: (row.cdc ? 'success' : 'info'),
    }, ...__VLS_functionalComponentArgsRest(__VLS_65));
    __VLS_67.slots.default;
    (row.cdc ? '启用' : '关闭');
    var __VLS_67;
}
var __VLS_63;
const __VLS_68 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
    label: "状态",
    width: "90",
}));
const __VLS_70 = __VLS_69({
    label: "状态",
    width: "90",
}, ...__VLS_functionalComponentArgsRest(__VLS_69));
__VLS_71.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_71.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_72 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
        type: (__VLS_ctx.statusTagType[row.status]),
        effect: "dark",
    }));
    const __VLS_74 = __VLS_73({
        type: (__VLS_ctx.statusTagType[row.status]),
        effect: "dark",
    }, ...__VLS_functionalComponentArgsRest(__VLS_73));
    __VLS_75.slots.default;
    (row.status);
    var __VLS_75;
}
var __VLS_71;
const __VLS_76 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
    label: "操作",
    width: "180",
    fixed: "right",
}));
const __VLS_78 = __VLS_77({
    label: "操作",
    width: "180",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_77));
__VLS_79.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_79.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_80 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }));
    const __VLS_82 = __VLS_81({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_81));
    let __VLS_84;
    let __VLS_85;
    let __VLS_86;
    const __VLS_87 = {
        onClick: (...[$event]) => {
            __VLS_ctx.previewTask(row);
        }
    };
    __VLS_83.slots.default;
    var __VLS_83;
    const __VLS_88 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
        ...{ 'onClick': {} },
        link: true,
        type: "danger",
    }));
    const __VLS_90 = __VLS_89({
        ...{ 'onClick': {} },
        link: true,
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_89));
    let __VLS_92;
    let __VLS_93;
    let __VLS_94;
    const __VLS_95 = {
        onClick: (__VLS_ctx.openCreate)
    };
    __VLS_91.slots.default;
    var __VLS_91;
}
var __VLS_79;
var __VLS_39;
const __VLS_96 = {}.ElPagination;
/** @type {[typeof __VLS_components.ElPagination, typeof __VLS_components.elPagination, ]} */ ;
// @ts-ignore
const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
    ...{ class: "pager" },
    layout: "total, prev, pager, next",
    total: (__VLS_ctx.filteredTasks.length),
    pageSize: (20),
    background: true,
}));
const __VLS_98 = __VLS_97({
    ...{ class: "pager" },
    layout: "total, prev, pager, next",
    total: (__VLS_ctx.filteredTasks.length),
    pageSize: (20),
    background: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_97));
var __VLS_11;
var __VLS_7;
const __VLS_100 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
    span: (8),
}));
const __VLS_102 = __VLS_101({
    span: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_101));
__VLS_103.slots.default;
const __VLS_104 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
    ...{ class: "panel-card dashboard-card" },
    shadow: "never",
}));
const __VLS_106 = __VLS_105({
    ...{ class: "panel-card dashboard-card" },
    shadow: "never",
}, ...__VLS_functionalComponentArgsRest(__VLS_105));
__VLS_107.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_107.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "preview-bar" },
});
const __VLS_108 = {}.ElTag;
/** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
// @ts-ignore
const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
    effect: "dark",
    type: "danger",
}));
const __VLS_110 = __VLS_109({
    effect: "dark",
    type: "danger",
}, ...__VLS_functionalComponentArgsRest(__VLS_109));
__VLS_111.slots.default;
var __VLS_111;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "preview-topic" },
});
(__VLS_ctx.previewTopic);
const __VLS_112 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
    data: (__VLS_ctx.previewRows),
    size: "small",
    stripe: true,
    ...{ class: "mt-12" },
}));
const __VLS_114 = __VLS_113({
    data: (__VLS_ctx.previewRows),
    size: "small",
    stripe: true,
    ...{ class: "mt-12" },
}, ...__VLS_functionalComponentArgsRest(__VLS_113));
__VLS_115.slots.default;
const __VLS_116 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
    prop: "field",
    label: "字段",
    width: "110",
}));
const __VLS_118 = __VLS_117({
    prop: "field",
    label: "字段",
    width: "110",
}, ...__VLS_functionalComponentArgsRest(__VLS_117));
const __VLS_120 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({
    prop: "value",
    label: "采样值",
    minWidth: "120",
}));
const __VLS_122 = __VLS_121({
    prop: "value",
    label: "采样值",
    minWidth: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_121));
const __VLS_124 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({
    prop: "timestamp",
    label: "时间",
    width: "150",
}));
const __VLS_126 = __VLS_125({
    prop: "timestamp",
    label: "时间",
    width: "150",
}, ...__VLS_functionalComponentArgsRest(__VLS_125));
var __VLS_115;
var __VLS_107;
var __VLS_103;
var __VLS_3;
const __VLS_128 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({
    modelValue: (__VLS_ctx.editorVisible),
    title: "新建实时任务",
    width: "560px",
}));
const __VLS_130 = __VLS_129({
    modelValue: (__VLS_ctx.editorVisible),
    title: "新建实时任务",
    width: "560px",
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
    label: "消息队列",
}));
const __VLS_146 = __VLS_145({
    label: "消息队列",
}, ...__VLS_functionalComponentArgsRest(__VLS_145));
__VLS_147.slots.default;
const __VLS_148 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_149 = __VLS_asFunctionalComponent(__VLS_148, new __VLS_148({
    modelValue: (__VLS_ctx.form.channel),
    ...{ class: "w-full" },
}));
const __VLS_150 = __VLS_149({
    modelValue: (__VLS_ctx.form.channel),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_149));
__VLS_151.slots.default;
const __VLS_152 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_153 = __VLS_asFunctionalComponent(__VLS_152, new __VLS_152({
    label: "Kafka",
    value: "Kafka",
}));
const __VLS_154 = __VLS_153({
    label: "Kafka",
    value: "Kafka",
}, ...__VLS_functionalComponentArgsRest(__VLS_153));
const __VLS_156 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_157 = __VLS_asFunctionalComponent(__VLS_156, new __VLS_156({
    label: "RabbitMQ",
    value: "RabbitMQ",
}));
const __VLS_158 = __VLS_157({
    label: "RabbitMQ",
    value: "RabbitMQ",
}, ...__VLS_functionalComponentArgsRest(__VLS_157));
var __VLS_151;
var __VLS_147;
const __VLS_160 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_161 = __VLS_asFunctionalComponent(__VLS_160, new __VLS_160({
    label: "Topic/队列",
}));
const __VLS_162 = __VLS_161({
    label: "Topic/队列",
}, ...__VLS_functionalComponentArgsRest(__VLS_161));
__VLS_163.slots.default;
const __VLS_164 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_165 = __VLS_asFunctionalComponent(__VLS_164, new __VLS_164({
    modelValue: (__VLS_ctx.form.topic),
    placeholder: "如 metro.customer.delta",
}));
const __VLS_166 = __VLS_165({
    modelValue: (__VLS_ctx.form.topic),
    placeholder: "如 metro.customer.delta",
}, ...__VLS_functionalComponentArgsRest(__VLS_165));
var __VLS_163;
const __VLS_168 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_169 = __VLS_asFunctionalComponent(__VLS_168, new __VLS_168({
    label: "消息格式",
}));
const __VLS_170 = __VLS_169({
    label: "消息格式",
}, ...__VLS_functionalComponentArgsRest(__VLS_169));
__VLS_171.slots.default;
const __VLS_172 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_173 = __VLS_asFunctionalComponent(__VLS_172, new __VLS_172({
    modelValue: (__VLS_ctx.form.format),
    ...{ class: "w-full" },
}));
const __VLS_174 = __VLS_173({
    modelValue: (__VLS_ctx.form.format),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_173));
__VLS_175.slots.default;
const __VLS_176 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_177 = __VLS_asFunctionalComponent(__VLS_176, new __VLS_176({
    label: "JSON",
    value: "JSON",
}));
const __VLS_178 = __VLS_177({
    label: "JSON",
    value: "JSON",
}, ...__VLS_functionalComponentArgsRest(__VLS_177));
const __VLS_180 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_181 = __VLS_asFunctionalComponent(__VLS_180, new __VLS_180({
    label: "XML",
    value: "XML",
}));
const __VLS_182 = __VLS_181({
    label: "XML",
    value: "XML",
}, ...__VLS_functionalComponentArgsRest(__VLS_181));
const __VLS_184 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_185 = __VLS_asFunctionalComponent(__VLS_184, new __VLS_184({
    label: "Avro",
    value: "Avro",
}));
const __VLS_186 = __VLS_185({
    label: "Avro",
    value: "Avro",
}, ...__VLS_functionalComponentArgsRest(__VLS_185));
var __VLS_175;
var __VLS_171;
const __VLS_188 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_189 = __VLS_asFunctionalComponent(__VLS_188, new __VLS_188({
    label: "CDC 捕获",
}));
const __VLS_190 = __VLS_189({
    label: "CDC 捕获",
}, ...__VLS_functionalComponentArgsRest(__VLS_189));
__VLS_191.slots.default;
const __VLS_192 = {}.ElSwitch;
/** @type {[typeof __VLS_components.ElSwitch, typeof __VLS_components.elSwitch, ]} */ ;
// @ts-ignore
const __VLS_193 = __VLS_asFunctionalComponent(__VLS_192, new __VLS_192({
    modelValue: (__VLS_ctx.form.cdc),
    activeText: "启用",
}));
const __VLS_194 = __VLS_193({
    modelValue: (__VLS_ctx.form.cdc),
    activeText: "启用",
}, ...__VLS_functionalComponentArgsRest(__VLS_193));
var __VLS_191;
const __VLS_196 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_197 = __VLS_asFunctionalComponent(__VLS_196, new __VLS_196({
    label: "处理逻辑",
}));
const __VLS_198 = __VLS_197({
    label: "处理逻辑",
}, ...__VLS_functionalComponentArgsRest(__VLS_197));
__VLS_199.slots.default;
const __VLS_200 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_201 = __VLS_asFunctionalComponent(__VLS_200, new __VLS_200({
    modelValue: (__VLS_ctx.form.logic),
    type: "textarea",
    rows: (4),
    placeholder: "时间窗口聚合 / 实时清洗转换 / 实时质量检查",
}));
const __VLS_202 = __VLS_201({
    modelValue: (__VLS_ctx.form.logic),
    type: "textarea",
    rows: (4),
    placeholder: "时间窗口聚合 / 实时清洗转换 / 实时质量检查",
}, ...__VLS_functionalComponentArgsRest(__VLS_201));
var __VLS_199;
var __VLS_135;
{
    const { footer: __VLS_thisSlot } = __VLS_131.slots;
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
            __VLS_ctx.editorVisible = false;
        }
    };
    __VLS_207.slots.default;
    var __VLS_207;
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
        onClick: (__VLS_ctx.saveForm)
    };
    __VLS_215.slots.default;
    var __VLS_215;
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
/** @type {__VLS_StyleScopedClasses['preview-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-topic']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-12']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Plus: Plus,
            Search: Search,
            statusTagType: statusTagType,
            keyword: keyword,
            filterChannel: filterChannel,
            editorVisible: editorVisible,
            previewTopic: previewTopic,
            previewRows: previewRows,
            form: form,
            filteredTasks: filteredTasks,
            openCreate: openCreate,
            saveForm: saveForm,
            previewTask: previewTask,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
