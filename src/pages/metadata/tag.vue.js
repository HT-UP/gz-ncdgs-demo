import { computed, reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
const tagTree = ref([
    {
        name: '业务属性',
        count: 120,
        children: [
            { name: '客户类', count: 45 },
            { name: '票务类', count: 60 },
            { name: '运营类', count: 15 },
        ],
    },
    {
        name: '技术属性',
        count: 260,
        children: [
            { name: '主键类', count: 95 },
            { name: '外键类', count: 110 },
            { name: '时间类', count: 55 },
        ],
    },
    {
        name: '质量属性',
        count: 88,
        children: [
            { name: '敏感数据', count: 30 },
            { name: '核心数据', count: 58 },
        ],
    },
]);
const autoRules = ref([
    { name: '主键自动打标', condition: '字段名匹配 /_id$/ 且为主键 → 自动关联「主键类」', tag: '主键类', matched: 95 },
    { name: '时间字段自动打标', condition: '字段类型为 DATETIME/DATE/TIMESTAMP → 自动关联「时间类」', tag: '时间类', matched: 55 },
    { name: '敏感字段自动打标', condition: '字段注释包含 手机/身份证/银行卡 → 自动关联「敏感数据」', tag: '敏感数据', matched: 30 },
]);
const categoryNames = ['业务属性', '技术属性', '质量属性'];
const statCategory = ref('技术属性');
const tagStats = computed(() => [
    { name: '主键类', category: '技术属性', metadataCount: 95, fieldCount: 128, percentage: 38 },
    { name: '外键类', category: '技术属性', metadataCount: 110, fieldCount: 142, percentage: 44 },
    { name: '时间类', category: '技术属性', metadataCount: 55, fieldCount: 76, percentage: 22 },
].filter((item) => item.category === statCategory.value));
const categoryVisible = ref(false);
const categoryForm = reactive({ name: '' });
const selectTagNode = (data) => {
    ElMessage.info(`标签「${data.name}」当前覆盖元数据 ${data.count} 项（Mock）`);
};
const openCreateCategory = () => {
    Object.assign(categoryForm, { name: '' });
    categoryVisible.value = true;
};
const saveCategory = () => {
    if (!categoryForm.name.trim()) {
        ElMessage.warning('请输入分类名称');
        return;
    }
    tagTree.value.push({ name: categoryForm.name, count: 0, children: [] });
    categoryVisible.value = false;
    ElMessage.success('标签分类已新增（Mock）');
};
const addAutoRule = () => {
    ElMessage.success('新增自动打标规则（Mock）');
};
const applyTag = () => {
    ElMessage.success('已为选中的 36 项元数据批量打标（Mock）');
};
const previewTag = () => {
    ElMessage.success('标签预览已生成：覆盖表 1,284 张，字段 23,562 个（Mock）');
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
    xs: (24),
    lg: (8),
}));
const __VLS_6 = __VLS_5({
    xs: (24),
    lg: (8),
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
        size: "small",
        icon: (__VLS_ctx.Plus),
    }));
    const __VLS_14 = __VLS_13({
        ...{ 'onClick': {} },
        type: "danger",
        size: "small",
        icon: (__VLS_ctx.Plus),
    }, ...__VLS_functionalComponentArgsRest(__VLS_13));
    let __VLS_16;
    let __VLS_17;
    let __VLS_18;
    const __VLS_19 = {
        onClick: (__VLS_ctx.openCreateCategory)
    };
    __VLS_15.slots.default;
    var __VLS_15;
}
const __VLS_20 = {}.ElTree;
/** @type {[typeof __VLS_components.ElTree, typeof __VLS_components.elTree, typeof __VLS_components.ElTree, typeof __VLS_components.elTree, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
    ...{ 'onNodeClick': {} },
    data: (__VLS_ctx.tagTree),
    nodeKey: "name",
    defaultExpandAll: true,
    props: ({ label: 'name', children: 'children' }),
    highlightCurrent: true,
}));
const __VLS_22 = __VLS_21({
    ...{ 'onNodeClick': {} },
    data: (__VLS_ctx.tagTree),
    nodeKey: "name",
    defaultExpandAll: true,
    props: ({ label: 'name', children: 'children' }),
    highlightCurrent: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
let __VLS_24;
let __VLS_25;
let __VLS_26;
const __VLS_27 = {
    onNodeClick: (__VLS_ctx.selectTagNode)
};
__VLS_23.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_23.slots;
    const [{ data }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "tag-tree-node" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (data.name);
    const __VLS_28 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
        size: "small",
        effect: "plain",
    }));
    const __VLS_30 = __VLS_29({
        size: "small",
        effect: "plain",
    }, ...__VLS_functionalComponentArgsRest(__VLS_29));
    __VLS_31.slots.default;
    (data.count);
    var __VLS_31;
}
var __VLS_23;
var __VLS_11;
var __VLS_7;
const __VLS_32 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
    xs: (24),
    lg: (16),
}));
const __VLS_34 = __VLS_33({
    xs: (24),
    lg: (16),
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
__VLS_35.slots.default;
const __VLS_36 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    ...{ class: "panel-card dashboard-card" },
    shadow: "never",
}));
const __VLS_38 = __VLS_37({
    ...{ class: "panel-card dashboard-card" },
    shadow: "never",
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
__VLS_39.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_39.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    const __VLS_40 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
        ...{ 'onClick': {} },
        type: "danger",
        size: "small",
        icon: (__VLS_ctx.Plus),
    }));
    const __VLS_42 = __VLS_41({
        ...{ 'onClick': {} },
        type: "danger",
        size: "small",
        icon: (__VLS_ctx.Plus),
    }, ...__VLS_functionalComponentArgsRest(__VLS_41));
    let __VLS_44;
    let __VLS_45;
    let __VLS_46;
    const __VLS_47 = {
        onClick: (__VLS_ctx.addAutoRule)
    };
    __VLS_43.slots.default;
    var __VLS_43;
}
for (const [rule] of __VLS_getVForSourceType((__VLS_ctx.autoRules))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "auto-rule-item" },
        key: (rule.name),
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "auto-rule-info" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "auto-rule-name" },
    });
    (rule.name);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "auto-rule-desc" },
    });
    (rule.condition);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "auto-rule-meta" },
    });
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
    (rule.tag);
    var __VLS_51;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "auto-rule-matched" },
    });
    (rule.matched);
}
var __VLS_39;
const __VLS_52 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
    ...{ class: "panel-card dashboard-card mt-16" },
    shadow: "never",
}));
const __VLS_54 = __VLS_53({
    ...{ class: "panel-card dashboard-card mt-16" },
    shadow: "never",
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
__VLS_55.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_55.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "toolbar-row" },
});
const __VLS_56 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
    modelValue: (__VLS_ctx.statCategory),
    ...{ class: "filter-select" },
}));
const __VLS_58 = __VLS_57({
    modelValue: (__VLS_ctx.statCategory),
    ...{ class: "filter-select" },
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
__VLS_59.slots.default;
for (const [category] of __VLS_getVForSourceType((__VLS_ctx.categoryNames))) {
    const __VLS_60 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
        key: (category),
        label: (category),
        value: (category),
    }));
    const __VLS_62 = __VLS_61({
        key: (category),
        label: (category),
        value: (category),
    }, ...__VLS_functionalComponentArgsRest(__VLS_61));
}
var __VLS_59;
const __VLS_64 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
    ...{ 'onClick': {} },
    type: "danger",
    plain: true,
}));
const __VLS_66 = __VLS_65({
    ...{ 'onClick': {} },
    type: "danger",
    plain: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_65));
let __VLS_68;
let __VLS_69;
let __VLS_70;
const __VLS_71 = {
    onClick: (__VLS_ctx.applyTag)
};
__VLS_67.slots.default;
var __VLS_67;
const __VLS_72 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
    ...{ 'onClick': {} },
    type: "danger",
}));
const __VLS_74 = __VLS_73({
    ...{ 'onClick': {} },
    type: "danger",
}, ...__VLS_functionalComponentArgsRest(__VLS_73));
let __VLS_76;
let __VLS_77;
let __VLS_78;
const __VLS_79 = {
    onClick: (__VLS_ctx.previewTag)
};
__VLS_75.slots.default;
var __VLS_75;
const __VLS_80 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
    data: (__VLS_ctx.tagStats),
    stripe: true,
    ...{ class: "mt-12" },
}));
const __VLS_82 = __VLS_81({
    data: (__VLS_ctx.tagStats),
    stripe: true,
    ...{ class: "mt-12" },
}, ...__VLS_functionalComponentArgsRest(__VLS_81));
__VLS_83.slots.default;
const __VLS_84 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
    prop: "name",
    label: "标签名称",
    minWidth: "130",
}));
const __VLS_86 = __VLS_85({
    prop: "name",
    label: "标签名称",
    minWidth: "130",
}, ...__VLS_functionalComponentArgsRest(__VLS_85));
const __VLS_88 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
    prop: "category",
    label: "分类",
    width: "110",
}));
const __VLS_90 = __VLS_89({
    prop: "category",
    label: "分类",
    width: "110",
}, ...__VLS_functionalComponentArgsRest(__VLS_89));
const __VLS_92 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
    prop: "metadataCount",
    label: "覆盖元数据",
    width: "110",
    align: "center",
}));
const __VLS_94 = __VLS_93({
    prop: "metadataCount",
    label: "覆盖元数据",
    width: "110",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_93));
const __VLS_96 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
    prop: "fieldCount",
    label: "覆盖字段",
    width: "100",
    align: "center",
}));
const __VLS_98 = __VLS_97({
    prop: "fieldCount",
    label: "覆盖字段",
    width: "100",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_97));
const __VLS_100 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
    label: "占比",
    minWidth: "180",
}));
const __VLS_102 = __VLS_101({
    label: "占比",
    minWidth: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_101));
__VLS_103.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_103.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_104 = {}.ElProgress;
    /** @type {[typeof __VLS_components.ElProgress, typeof __VLS_components.elProgress, ]} */ ;
    // @ts-ignore
    const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
        percentage: (row.percentage),
        color: (row.percentage > 50 ? '#DA251D' : '#2B6CB0'),
        strokeWidth: (10),
    }));
    const __VLS_106 = __VLS_105({
        percentage: (row.percentage),
        color: (row.percentage > 50 ? '#DA251D' : '#2B6CB0'),
        strokeWidth: (10),
    }, ...__VLS_functionalComponentArgsRest(__VLS_105));
}
var __VLS_103;
var __VLS_83;
var __VLS_55;
var __VLS_35;
var __VLS_3;
const __VLS_108 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
    modelValue: (__VLS_ctx.categoryVisible),
    title: "新增标签分类",
    width: "440px",
}));
const __VLS_110 = __VLS_109({
    modelValue: (__VLS_ctx.categoryVisible),
    title: "新增标签分类",
    width: "440px",
}, ...__VLS_functionalComponentArgsRest(__VLS_109));
__VLS_111.slots.default;
const __VLS_112 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
    model: (__VLS_ctx.categoryForm),
    labelWidth: "90px",
}));
const __VLS_114 = __VLS_113({
    model: (__VLS_ctx.categoryForm),
    labelWidth: "90px",
}, ...__VLS_functionalComponentArgsRest(__VLS_113));
__VLS_115.slots.default;
const __VLS_116 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
    label: "分类名称",
}));
const __VLS_118 = __VLS_117({
    label: "分类名称",
}, ...__VLS_functionalComponentArgsRest(__VLS_117));
__VLS_119.slots.default;
const __VLS_120 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({
    modelValue: (__VLS_ctx.categoryForm.name),
}));
const __VLS_122 = __VLS_121({
    modelValue: (__VLS_ctx.categoryForm.name),
}, ...__VLS_functionalComponentArgsRest(__VLS_121));
var __VLS_119;
var __VLS_115;
{
    const { footer: __VLS_thisSlot } = __VLS_111.slots;
    const __VLS_124 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({
        ...{ 'onClick': {} },
    }));
    const __VLS_126 = __VLS_125({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_125));
    let __VLS_128;
    let __VLS_129;
    let __VLS_130;
    const __VLS_131 = {
        onClick: (...[$event]) => {
            __VLS_ctx.categoryVisible = false;
        }
    };
    __VLS_127.slots.default;
    var __VLS_127;
    const __VLS_132 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132({
        ...{ 'onClick': {} },
        type: "danger",
    }));
    const __VLS_134 = __VLS_133({
        ...{ 'onClick': {} },
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_133));
    let __VLS_136;
    let __VLS_137;
    let __VLS_138;
    const __VLS_139 = {
        onClick: (__VLS_ctx.saveCategory)
    };
    __VLS_135.slots.default;
    var __VLS_135;
}
var __VLS_111;
/** @type {__VLS_StyleScopedClasses['standard-page']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['tag-tree-node']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['auto-rule-item']} */ ;
/** @type {__VLS_StyleScopedClasses['auto-rule-info']} */ ;
/** @type {__VLS_StyleScopedClasses['auto-rule-name']} */ ;
/** @type {__VLS_StyleScopedClasses['auto-rule-desc']} */ ;
/** @type {__VLS_StyleScopedClasses['auto-rule-meta']} */ ;
/** @type {__VLS_StyleScopedClasses['auto-rule-matched']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['toolbar-row']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-select']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-12']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Plus: Plus,
            tagTree: tagTree,
            autoRules: autoRules,
            categoryNames: categoryNames,
            statCategory: statCategory,
            tagStats: tagStats,
            categoryVisible: categoryVisible,
            categoryForm: categoryForm,
            selectTagNode: selectTagNode,
            openCreateCategory: openCreateCategory,
            saveCategory: saveCategory,
            addAutoRule: addAutoRule,
            applyTag: applyTag,
            previewTag: previewTag,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
