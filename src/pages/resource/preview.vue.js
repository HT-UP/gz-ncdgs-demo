import { computed, reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { Filter, Search } from '@element-plus/icons-vue';
import { mockFields } from '@/mock/resource';
const tableOptions = ['ticket_sale_detail', 'passenger_info', 'flow_stat_daily', 'device_status_log', 'train_operation_log'];
const selectedTable = ref('ticket_sale_detail');
const fieldColumns = ref([...mockFields]);
const typeMeta = {
    字符串: { bg: 'rgba(218,37,29,0.10)', fg: '#DA251D' },
    数值: { bg: 'rgba(43,108,176,0.10)', fg: '#2B6CB0' },
    日期: { bg: 'rgba(0,168,84,0.10)', fg: '#00A854' },
    大文本: { bg: 'rgba(155,89,182,0.10)', fg: '#9B59B6' },
};
const keyword = ref('');
const advanceVisible = ref(false);
const fullVisible = ref(false);
const fullContent = ref('');
const advance = reactive({
    db: 'git_new_gz_dwd',
    field: '',
    tags: [],
    owner: '',
});
const sampleRows = ref(Array.from({ length: 100 }, (_, index) => {
    const row = {};
    mockFields.forEach((field) => {
        row[field.name] =
            field.name === 'stat_date'
                ? `2026-08-${String((index % 28) + 1).padStart(2, '0')}`
                : field.name === 'flow_count'
                    ? String(8000 + index * 97)
                    : `${field.sample}${index + 1}`.slice(0, Math.max(field.sample.length, 12));
    });
    return row;
}));
const filteredFields = computed(() => {
    if (!keyword.value)
        return fieldColumns.value;
    const kw = keyword.value.toLowerCase();
    return fieldColumns.value.filter((field) => field.name.toLowerCase().includes(kw) ||
        field.comment.toLowerCase().includes(kw) ||
        field.sample.toLowerCase().includes(kw));
});
const displayColumns = computed(() => (keyword.value ? filteredFields.value : fieldColumns.value).map((field) => field));
const truncate = (value) => (value.length > 16 ? `${value.slice(0, 16)}…` : value);
const showFull = (fieldName) => {
    const field = fieldColumns.value.find((item) => item.name === fieldName);
    const first = sampleRows.value[0];
    fullContent.value = field ? `${field.comment}\n示例值：${first?.[fieldName] ?? ''}` : '';
    fullVisible.value = true;
};
const loadSample = () => {
    const current = fieldColumns.value;
    sampleRows.value = Array.from({ length: 100 }, (_, index) => {
        const row = {};
        current.forEach((field) => {
            row[field.name] =
                field.name === 'stat_date'
                    ? `2026-08-${String((index % 28) + 1).padStart(2, '0')}`
                    : `${field.sample}${index + 1}`.slice(0, Math.max(field.sample.length, 12));
        });
        return row;
    });
    ElMessage.success(`已加载「${selectedTable.value}」抽样数据（Mock）`);
};
const refresh = () => loadSample();
const runAdvance = () => {
    advanceVisible.value = false;
    ElMessage.success(`已按条件检索到 86 个匹配字段 / 12 张表（Mock）`);
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
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-actions" },
    });
    const __VLS_4 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
        ...{ 'onClick': {} },
        type: "danger",
        size: "small",
    }));
    const __VLS_6 = __VLS_5({
        ...{ 'onClick': {} },
        type: "danger",
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_5));
    let __VLS_8;
    let __VLS_9;
    let __VLS_10;
    const __VLS_11 = {
        onClick: (__VLS_ctx.refresh)
    };
    __VLS_7.slots.default;
    var __VLS_7;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "toolbar-row preview-toolbar" },
});
const __VLS_12 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.selectedTable),
    ...{ class: "table-select" },
}));
const __VLS_14 = __VLS_13({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.selectedTable),
    ...{ class: "table-select" },
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
let __VLS_16;
let __VLS_17;
let __VLS_18;
const __VLS_19 = {
    onChange: (__VLS_ctx.loadSample)
};
__VLS_15.slots.default;
for (const [table] of __VLS_getVForSourceType((__VLS_ctx.tableOptions))) {
    const __VLS_20 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
        key: (table),
        label: (table),
        value: (table),
    }));
    const __VLS_22 = __VLS_21({
        key: (table),
        label: (table),
        value: (table),
    }, ...__VLS_functionalComponentArgsRest(__VLS_21));
}
var __VLS_15;
const __VLS_24 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    modelValue: (__VLS_ctx.keyword),
    placeholder: "全局搜索：字段名 / 备注 / 样例",
    clearable: true,
    ...{ class: "search-input" },
    prefixIcon: (__VLS_ctx.Search),
}));
const __VLS_26 = __VLS_25({
    modelValue: (__VLS_ctx.keyword),
    placeholder: "全局搜索：字段名 / 备注 / 样例",
    clearable: true,
    ...{ class: "search-input" },
    prefixIcon: (__VLS_ctx.Search),
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
const __VLS_28 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
    ...{ 'onClick': {} },
    icon: (__VLS_ctx.Filter),
}));
const __VLS_30 = __VLS_29({
    ...{ 'onClick': {} },
    icon: (__VLS_ctx.Filter),
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
let __VLS_32;
let __VLS_33;
let __VLS_34;
const __VLS_35 = {
    onClick: (...[$event]) => {
        __VLS_ctx.advanceVisible = true;
    }
};
__VLS_31.slots.default;
var __VLS_31;
const __VLS_36 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    gutter: (16),
    ...{ class: "mb-16" },
}));
const __VLS_38 = __VLS_37({
    gutter: (16),
    ...{ class: "mb-16" },
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
__VLS_39.slots.default;
const __VLS_40 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
    xs: (24),
    lg: (16),
}));
const __VLS_42 = __VLS_41({
    xs: (24),
    lg: (16),
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
__VLS_43.slots.default;
const __VLS_44 = {}.ElDescriptions;
/** @type {[typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    title: "表结构信息",
    border: true,
    column: (3),
    size: "small",
}));
const __VLS_46 = __VLS_45({
    title: "表结构信息",
    border: true,
    column: (3),
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
__VLS_47.slots.default;
const __VLS_48 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
    label: "数据总量",
}));
const __VLS_50 = __VLS_49({
    label: "数据总量",
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
__VLS_51.slots.default;
var __VLS_51;
const __VLS_52 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
    label: "字段数",
}));
const __VLS_54 = __VLS_53({
    label: "字段数",
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
__VLS_55.slots.default;
(__VLS_ctx.fieldColumns.length);
var __VLS_55;
const __VLS_56 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
    label: "存储层级",
}));
const __VLS_58 = __VLS_57({
    label: "存储层级",
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
__VLS_59.slots.default;
var __VLS_59;
const __VLS_60 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
    label: "最后更新",
}));
const __VLS_62 = __VLS_61({
    label: "最后更新",
}, ...__VLS_functionalComponentArgsRest(__VLS_61));
__VLS_63.slots.default;
var __VLS_63;
const __VLS_64 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
    label: "更新频率",
}));
const __VLS_66 = __VLS_65({
    label: "更新频率",
}, ...__VLS_functionalComponentArgsRest(__VLS_65));
__VLS_67.slots.default;
var __VLS_67;
const __VLS_68 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
    label: "责任人",
}));
const __VLS_70 = __VLS_69({
    label: "责任人",
}, ...__VLS_functionalComponentArgsRest(__VLS_69));
__VLS_71.slots.default;
var __VLS_71;
var __VLS_47;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "section-title mt-16 mb-8" },
});
const __VLS_72 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
    data: (__VLS_ctx.fieldColumns),
    size: "small",
    stripe: true,
    maxHeight: "260",
}));
const __VLS_74 = __VLS_73({
    data: (__VLS_ctx.fieldColumns),
    size: "small",
    stripe: true,
    maxHeight: "260",
}, ...__VLS_functionalComponentArgsRest(__VLS_73));
__VLS_75.slots.default;
const __VLS_76 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
    label: "字段名",
    width: "150",
}));
const __VLS_78 = __VLS_77({
    label: "字段名",
    width: "150",
}, ...__VLS_functionalComponentArgsRest(__VLS_77));
__VLS_79.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_79.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "field-name" },
        ...{ class: ({ 'field-pk': row.primary }) },
    });
    (row.name);
    if (row.primary) {
        const __VLS_80 = {}.ElTag;
        /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
        // @ts-ignore
        const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
            size: "small",
            type: "danger",
            effect: "dark",
            ...{ class: "pk-tag" },
        }));
        const __VLS_82 = __VLS_81({
            size: "small",
            type: "danger",
            effect: "dark",
            ...{ class: "pk-tag" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_81));
        __VLS_83.slots.default;
        var __VLS_83;
    }
}
var __VLS_79;
const __VLS_84 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
    label: "类型",
    width: "140",
}));
const __VLS_86 = __VLS_85({
    label: "类型",
    width: "140",
}, ...__VLS_functionalComponentArgsRest(__VLS_85));
__VLS_87.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_87.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "type-badge" },
        ...{ style: ({ background: __VLS_ctx.typeMeta[row.typeLabel].bg, color: __VLS_ctx.typeMeta[row.typeLabel].fg }) },
    });
    (row.dataType);
    if (row.length) {
        (row.length);
    }
}
var __VLS_87;
const __VLS_88 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
    prop: "comment",
    label: "描述",
    minWidth: "180",
}));
const __VLS_90 = __VLS_89({
    prop: "comment",
    label: "描述",
    minWidth: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_89));
const __VLS_92 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
    label: "约束",
    width: "90",
}));
const __VLS_94 = __VLS_93({
    label: "约束",
    width: "90",
}, ...__VLS_functionalComponentArgsRest(__VLS_93));
__VLS_95.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_95.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (row.nullable ? '可空' : '非空');
    if (row.primary) {
    }
}
var __VLS_95;
var __VLS_75;
var __VLS_43;
const __VLS_96 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
    xs: (24),
    lg: (8),
}));
const __VLS_98 = __VLS_97({
    xs: (24),
    lg: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_97));
__VLS_99.slots.default;
const __VLS_100 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
    shadow: "never",
    ...{ class: "stat-mini-card" },
}));
const __VLS_102 = __VLS_101({
    shadow: "never",
    ...{ class: "stat-mini-card" },
}, ...__VLS_functionalComponentArgsRest(__VLS_101));
__VLS_103.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "section-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "stat-count" },
});
(__VLS_ctx.sampleRows.length.toLocaleString());
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "dep-text stat-note" },
});
const __VLS_104 = {}.ElDivider;
/** @type {[typeof __VLS_components.ElDivider, typeof __VLS_components.elDivider, ]} */ ;
// @ts-ignore
const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({}));
const __VLS_106 = __VLS_105({}, ...__VLS_functionalComponentArgsRest(__VLS_105));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "section-title" },
});
const __VLS_108 = {}.ElTimeline;
/** @type {[typeof __VLS_components.ElTimeline, typeof __VLS_components.elTimeline, typeof __VLS_components.ElTimeline, typeof __VLS_components.elTimeline, ]} */ ;
// @ts-ignore
const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
    ...{ class: "mt-8" },
}));
const __VLS_110 = __VLS_109({
    ...{ class: "mt-8" },
}, ...__VLS_functionalComponentArgsRest(__VLS_109));
__VLS_111.slots.default;
const __VLS_112 = {}.ElTimelineItem;
/** @type {[typeof __VLS_components.ElTimelineItem, typeof __VLS_components.elTimelineItem, typeof __VLS_components.ElTimelineItem, typeof __VLS_components.elTimelineItem, ]} */ ;
// @ts-ignore
const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
    timestamp: "08-12 03:02",
    type: "primary",
}));
const __VLS_114 = __VLS_113({
    timestamp: "08-12 03:02",
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_113));
__VLS_115.slots.default;
var __VLS_115;
const __VLS_116 = {}.ElTimelineItem;
/** @type {[typeof __VLS_components.ElTimelineItem, typeof __VLS_components.elTimelineItem, typeof __VLS_components.ElTimelineItem, typeof __VLS_components.elTimelineItem, ]} */ ;
// @ts-ignore
const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
    timestamp: "08-11 03:01",
    type: "success",
}));
const __VLS_118 = __VLS_117({
    timestamp: "08-11 03:01",
    type: "success",
}, ...__VLS_functionalComponentArgsRest(__VLS_117));
__VLS_119.slots.default;
var __VLS_119;
const __VLS_120 = {}.ElTimelineItem;
/** @type {[typeof __VLS_components.ElTimelineItem, typeof __VLS_components.elTimelineItem, typeof __VLS_components.ElTimelineItem, typeof __VLS_components.elTimelineItem, ]} */ ;
// @ts-ignore
const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({
    timestamp: "08-10 03:02",
    type: "success",
}));
const __VLS_122 = __VLS_121({
    timestamp: "08-10 03:02",
    type: "success",
}, ...__VLS_functionalComponentArgsRest(__VLS_121));
__VLS_123.slots.default;
var __VLS_123;
var __VLS_111;
var __VLS_103;
var __VLS_99;
var __VLS_39;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "section-title mb-8" },
});
const __VLS_124 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({
    data: (__VLS_ctx.sampleRows),
    stripe: true,
    height: "420",
}));
const __VLS_126 = __VLS_125({
    data: (__VLS_ctx.sampleRows),
    stripe: true,
    height: "420",
}, ...__VLS_functionalComponentArgsRest(__VLS_125));
__VLS_127.slots.default;
for (const [field] of __VLS_getVForSourceType((__VLS_ctx.displayColumns))) {
    const __VLS_128 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({
        key: (field.name),
        label: (field.name),
        minWidth: "120",
        showOverflowTooltip: true,
    }));
    const __VLS_130 = __VLS_129({
        key: (field.name),
        label: (field.name),
        minWidth: "120",
        showOverflowTooltip: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_129));
    __VLS_131.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_131.slots;
        const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ onClick: (...[$event]) => {
                    __VLS_ctx.showFull(field.name);
                } },
            ...{ class: "sample-cell" },
            ...{ style: ({ color: __VLS_ctx.typeMeta[field.typeLabel].fg, background: __VLS_ctx.typeMeta[field.typeLabel].bg }) },
        });
        (__VLS_ctx.truncate(String(row[field.name])));
    }
    var __VLS_131;
}
var __VLS_127;
var __VLS_3;
const __VLS_132 = {}.ElDrawer;
/** @type {[typeof __VLS_components.ElDrawer, typeof __VLS_components.elDrawer, typeof __VLS_components.ElDrawer, typeof __VLS_components.elDrawer, ]} */ ;
// @ts-ignore
const __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132({
    modelValue: (__VLS_ctx.advanceVisible),
    title: "高级检索",
    size: "840px",
}));
const __VLS_134 = __VLS_133({
    modelValue: (__VLS_ctx.advanceVisible),
    title: "高级检索",
    size: "840px",
}, ...__VLS_functionalComponentArgsRest(__VLS_133));
__VLS_135.slots.default;
const __VLS_136 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_137 = __VLS_asFunctionalComponent(__VLS_136, new __VLS_136({
    labelWidth: "80px",
}));
const __VLS_138 = __VLS_137({
    labelWidth: "80px",
}, ...__VLS_functionalComponentArgsRest(__VLS_137));
__VLS_139.slots.default;
const __VLS_140 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_141 = __VLS_asFunctionalComponent(__VLS_140, new __VLS_140({
    label: "库表",
}));
const __VLS_142 = __VLS_141({
    label: "库表",
}, ...__VLS_functionalComponentArgsRest(__VLS_141));
__VLS_143.slots.default;
const __VLS_144 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_145 = __VLS_asFunctionalComponent(__VLS_144, new __VLS_144({
    modelValue: (__VLS_ctx.advance.db),
    ...{ class: "w-full" },
}));
const __VLS_146 = __VLS_145({
    modelValue: (__VLS_ctx.advance.db),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_145));
__VLS_147.slots.default;
for (const [db] of __VLS_getVForSourceType((['git_new_gz_ods', 'git_new_gz_dwd', 'git_new_gz_dws', 'git_new_gz_ads']))) {
    const __VLS_148 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_149 = __VLS_asFunctionalComponent(__VLS_148, new __VLS_148({
        key: (db),
        label: (db),
        value: (db),
    }));
    const __VLS_150 = __VLS_149({
        key: (db),
        label: (db),
        value: (db),
    }, ...__VLS_functionalComponentArgsRest(__VLS_149));
}
var __VLS_147;
var __VLS_143;
const __VLS_152 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_153 = __VLS_asFunctionalComponent(__VLS_152, new __VLS_152({
    label: "字段名",
}));
const __VLS_154 = __VLS_153({
    label: "字段名",
}, ...__VLS_functionalComponentArgsRest(__VLS_153));
__VLS_155.slots.default;
const __VLS_156 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_157 = __VLS_asFunctionalComponent(__VLS_156, new __VLS_156({
    modelValue: (__VLS_ctx.advance.field),
    placeholder: "按字段名匹配",
    clearable: true,
}));
const __VLS_158 = __VLS_157({
    modelValue: (__VLS_ctx.advance.field),
    placeholder: "按字段名匹配",
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_157));
var __VLS_155;
const __VLS_160 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_161 = __VLS_asFunctionalComponent(__VLS_160, new __VLS_160({
    label: "资产标签",
}));
const __VLS_162 = __VLS_161({
    label: "资产标签",
}, ...__VLS_functionalComponentArgsRest(__VLS_161));
__VLS_163.slots.default;
const __VLS_164 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_165 = __VLS_asFunctionalComponent(__VLS_164, new __VLS_164({
    modelValue: (__VLS_ctx.advance.tags),
    multiple: true,
    placeholder: "选择标签",
    ...{ class: "w-full" },
}));
const __VLS_166 = __VLS_165({
    modelValue: (__VLS_ctx.advance.tags),
    multiple: true,
    placeholder: "选择标签",
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_165));
__VLS_167.slots.default;
for (const [tag] of __VLS_getVForSourceType((['客流', '设备', '财务', '敏感', '核心']))) {
    const __VLS_168 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_169 = __VLS_asFunctionalComponent(__VLS_168, new __VLS_168({
        key: (tag),
        label: (tag),
        value: (tag),
    }));
    const __VLS_170 = __VLS_169({
        key: (tag),
        label: (tag),
        value: (tag),
    }, ...__VLS_functionalComponentArgsRest(__VLS_169));
}
var __VLS_167;
var __VLS_163;
const __VLS_172 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_173 = __VLS_asFunctionalComponent(__VLS_172, new __VLS_172({
    label: "负责人",
}));
const __VLS_174 = __VLS_173({
    label: "负责人",
}, ...__VLS_functionalComponentArgsRest(__VLS_173));
__VLS_175.slots.default;
const __VLS_176 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_177 = __VLS_asFunctionalComponent(__VLS_176, new __VLS_176({
    modelValue: (__VLS_ctx.advance.owner),
    placeholder: "选择责任人",
    ...{ class: "w-full" },
}));
const __VLS_178 = __VLS_177({
    modelValue: (__VLS_ctx.advance.owner),
    placeholder: "选择责任人",
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_177));
__VLS_179.slots.default;
for (const [owner] of __VLS_getVForSourceType((['张三', '李四', '王五', '赵六']))) {
    const __VLS_180 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_181 = __VLS_asFunctionalComponent(__VLS_180, new __VLS_180({
        key: (owner),
        label: (owner),
        value: (owner),
    }));
    const __VLS_182 = __VLS_181({
        key: (owner),
        label: (owner),
        value: (owner),
    }, ...__VLS_functionalComponentArgsRest(__VLS_181));
}
var __VLS_179;
var __VLS_175;
var __VLS_139;
{
    const { footer: __VLS_thisSlot } = __VLS_135.slots;
    const __VLS_184 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_185 = __VLS_asFunctionalComponent(__VLS_184, new __VLS_184({
        ...{ 'onClick': {} },
    }));
    const __VLS_186 = __VLS_185({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_185));
    let __VLS_188;
    let __VLS_189;
    let __VLS_190;
    const __VLS_191 = {
        onClick: (...[$event]) => {
            __VLS_ctx.advanceVisible = false;
        }
    };
    __VLS_187.slots.default;
    var __VLS_187;
    const __VLS_192 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_193 = __VLS_asFunctionalComponent(__VLS_192, new __VLS_192({
        ...{ 'onClick': {} },
        type: "danger",
    }));
    const __VLS_194 = __VLS_193({
        ...{ 'onClick': {} },
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_193));
    let __VLS_196;
    let __VLS_197;
    let __VLS_198;
    const __VLS_199 = {
        onClick: (__VLS_ctx.runAdvance)
    };
    __VLS_195.slots.default;
    var __VLS_195;
}
var __VLS_135;
const __VLS_200 = {}.ElDrawer;
/** @type {[typeof __VLS_components.ElDrawer, typeof __VLS_components.elDrawer, typeof __VLS_components.ElDrawer, typeof __VLS_components.elDrawer, ]} */ ;
// @ts-ignore
const __VLS_201 = __VLS_asFunctionalComponent(__VLS_200, new __VLS_200({
    modelValue: (__VLS_ctx.fullVisible),
    title: "字段完整内容",
    size: "460px",
}));
const __VLS_202 = __VLS_201({
    modelValue: (__VLS_ctx.fullVisible),
    title: "字段完整内容",
    size: "460px",
}, ...__VLS_functionalComponentArgsRest(__VLS_201));
__VLS_203.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "full-content-block" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "section-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "full-content" },
});
(__VLS_ctx.fullContent);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "dep-text mt-8" },
});
var __VLS_203;
/** @type {__VLS_StyleScopedClasses['standard-page']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['toolbar-row']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-toolbar']} */ ;
/** @type {__VLS_StyleScopedClasses['table-select']} */ ;
/** @type {__VLS_StyleScopedClasses['search-input']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
/** @type {__VLS_StyleScopedClasses['field-name']} */ ;
/** @type {__VLS_StyleScopedClasses['pk-tag']} */ ;
/** @type {__VLS_StyleScopedClasses['type-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-mini-card']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-count']} */ ;
/** @type {__VLS_StyleScopedClasses['dep-text']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-note']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
/** @type {__VLS_StyleScopedClasses['sample-cell']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['full-content-block']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['full-content']} */ ;
/** @type {__VLS_StyleScopedClasses['dep-text']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Filter: Filter,
            Search: Search,
            tableOptions: tableOptions,
            selectedTable: selectedTable,
            fieldColumns: fieldColumns,
            typeMeta: typeMeta,
            keyword: keyword,
            advanceVisible: advanceVisible,
            fullVisible: fullVisible,
            fullContent: fullContent,
            advance: advance,
            sampleRows: sampleRows,
            displayColumns: displayColumns,
            truncate: truncate,
            showFull: showFull,
            loadSample: loadSample,
            refresh: refresh,
            runAdvance: runAdvance,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
