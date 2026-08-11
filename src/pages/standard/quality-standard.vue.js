import { computed, reactive, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Checked, Plus, Search } from '@element-plus/icons-vue';
const levelTagType = {
    核心: 'danger',
    重要: 'warning',
    一般: 'info',
};
const keyword = ref('');
const ruleCategory = ref('完整性');
const editorVisible = ref(false);
const detailVisible = ref(false);
const editing = ref(null);
const detailRow = ref(null);
const rules = ref([
    { code: 'QR-001', name: '字段非空校验', category: '完整性', level: '核心', weight: 20, scope: '字段级', source: '标准即规则', description: '目标字段不允许为空值或空白字符串' },
    { code: 'QR-002', name: '必填字段完整性检查', category: '完整性', level: '核心', weight: 15, scope: '表级', source: '手工配置', description: '业务关键字段必须全部填写' },
    { code: 'QR-003', name: '编码格式校验', category: '准确性', level: '重要', weight: 12, scope: '字段级', source: '规则模板', description: '字段值必须符合约定的编码格式' },
    { code: 'QR-004', name: '数值范围检查', category: '准确性', level: '重要', weight: 10, scope: '字段级', source: '规则模板', description: '数值字段取值必须在定义范围内' },
    { code: 'QR-005', name: '跨表一致性校验', category: '一致性', level: '核心', weight: 18, scope: '表级', source: '手工配置', description: '关联表相同业务字段取值一致' },
    { code: 'QR-006', name: '主键唯一性检查', category: '唯一性', level: '核心', weight: 15, scope: '字段级', source: '标准即规则', description: '主键或唯一字段不允许重复' },
    { code: 'QR-007', name: '采集时效检查', category: '及时性', level: '一般', weight: 5, scope: '表级', source: '规则模板', description: '数据必须在约定时间内完成采集' },
    { code: 'QR-008', name: '数据同步延迟监控', category: '及时性', level: '重要', weight: 5, scope: '表级', source: '手工配置', description: '同步延迟不得超过阈值' },
]);
const templates = [
    { name: '非空校验模板', description: '字段不允许为空，适用于核心业务字段', category: '完整性' },
    { name: '格式校验模板', description: '校验编码、证件号、手机号等格式', category: '准确性' },
    { name: '唯一性校验模板', description: '校验主键及唯一索引不重复', category: '唯一性' },
    { name: '一致性校验模板', description: '跨表、跨系统同义字段取值一致', category: '一致性' },
    { name: '时效性校验模板', description: '数据采集与同步时间阈值校验', category: '及时性' },
];
const form = reactive({
    name: '',
    category: '完整性',
    level: '核心',
    weight: 10,
    description: '',
});
const filteredRules = computed(() => rules.value.filter((rule) => {
    if (rule.category !== ruleCategory.value)
        return false;
    if (!keyword.value)
        return true;
    const kw = keyword.value.toLowerCase();
    return rule.name.toLowerCase().includes(kw) || rule.code.toLowerCase().includes(kw);
}));
const openCreate = () => {
    editing.value = null;
    Object.assign(form, { name: '', category: ruleCategory.value, level: '核心', weight: 10, description: '' });
    editorVisible.value = true;
};
const saveForm = () => {
    if (!form.name.trim()) {
        ElMessage.warning('请输入规则名称');
        return;
    }
    if (editing.value) {
        Object.assign(editing.value, { ...form });
        ElMessage.success('规则已更新（Mock）');
    }
    else {
        rules.value.unshift({
            code: `QR-${String(rules.value.length + 1).padStart(3, '0')}`,
            name: form.name,
            category: form.category,
            level: form.level,
            weight: form.weight,
            scope: '字段级',
            source: '手工配置',
            description: form.description,
        });
        ElMessage.success('规则已新增（Mock）');
    }
    editorVisible.value = false;
};
const openDetail = (row) => {
    detailRow.value = row;
    detailVisible.value = true;
};
const runTest = (row) => {
    ElMessage.success(`规则「${row.name}」试跑完成：通过率 96.8%（Mock）`);
};
const confirmDelete = (row) => {
    ElMessageBox.confirm(`确认删除规则「${row.name}」吗？`, '删除确认', { type: 'warning' })
        .then(() => {
        const index = rules.value.indexOf(row);
        if (index > -1)
            rules.value.splice(index, 1);
        ElMessage.success('规则已删除（Mock）');
    })
        .catch(() => { });
};
const applyTemplate = (template) => {
    ruleCategory.value = template.category;
    Object.assign(form, {
        name: template.name,
        category: template.category,
        level: '重要',
        weight: 10,
        description: template.description,
    });
    editorVisible.value = true;
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
    placeholder: "按规则名称 / 编号搜索",
    clearable: true,
    ...{ class: "search-input" },
    prefixIcon: (__VLS_ctx.Search),
}));
const __VLS_22 = __VLS_21({
    modelValue: (__VLS_ctx.keyword),
    placeholder: "按规则名称 / 编号搜索",
    clearable: true,
    ...{ class: "search-input" },
    prefixIcon: (__VLS_ctx.Search),
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
const __VLS_24 = {}.ElRadioGroup;
/** @type {[typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    modelValue: (__VLS_ctx.ruleCategory),
    size: "small",
}));
const __VLS_26 = __VLS_25({
    modelValue: (__VLS_ctx.ruleCategory),
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
__VLS_27.slots.default;
const __VLS_28 = {}.ElRadioButton;
/** @type {[typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, ]} */ ;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
    label: "完整性",
}));
const __VLS_30 = __VLS_29({
    label: "完整性",
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
const __VLS_32 = {}.ElRadioButton;
/** @type {[typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
    label: "准确性",
}));
const __VLS_34 = __VLS_33({
    label: "准确性",
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
const __VLS_36 = {}.ElRadioButton;
/** @type {[typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    label: "一致性",
}));
const __VLS_38 = __VLS_37({
    label: "一致性",
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
const __VLS_40 = {}.ElRadioButton;
/** @type {[typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
    label: "唯一性",
}));
const __VLS_42 = __VLS_41({
    label: "唯一性",
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
const __VLS_44 = {}.ElRadioButton;
/** @type {[typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    label: "及时性",
}));
const __VLS_46 = __VLS_45({
    label: "及时性",
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
var __VLS_27;
const __VLS_48 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
    data: (__VLS_ctx.filteredRules),
    stripe: true,
    ...{ class: "mt-12" },
}));
const __VLS_50 = __VLS_49({
    data: (__VLS_ctx.filteredRules),
    stripe: true,
    ...{ class: "mt-12" },
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
__VLS_51.slots.default;
const __VLS_52 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
    prop: "code",
    label: "规则编号",
    width: "130",
}));
const __VLS_54 = __VLS_53({
    prop: "code",
    label: "规则编号",
    width: "130",
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
const __VLS_56 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
    prop: "name",
    label: "规则名称",
    minWidth: "200",
}));
const __VLS_58 = __VLS_57({
    prop: "name",
    label: "规则名称",
    minWidth: "200",
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
const __VLS_60 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
    prop: "category",
    label: "类型",
    width: "90",
}));
const __VLS_62 = __VLS_61({
    prop: "category",
    label: "类型",
    width: "90",
}, ...__VLS_functionalComponentArgsRest(__VLS_61));
const __VLS_64 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
    prop: "level",
    label: "级别",
    width: "80",
    align: "center",
}));
const __VLS_66 = __VLS_65({
    prop: "level",
    label: "级别",
    width: "80",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_65));
__VLS_67.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_67.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_68 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
        type: (__VLS_ctx.levelTagType[row.level]),
        effect: "dark",
    }));
    const __VLS_70 = __VLS_69({
        type: (__VLS_ctx.levelTagType[row.level]),
        effect: "dark",
    }, ...__VLS_functionalComponentArgsRest(__VLS_69));
    __VLS_71.slots.default;
    (row.level);
    var __VLS_71;
}
var __VLS_67;
const __VLS_72 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
    label: "权重",
    width: "80",
    align: "center",
}));
const __VLS_74 = __VLS_73({
    label: "权重",
    width: "80",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_73));
__VLS_75.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_75.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    (row.weight);
}
var __VLS_75;
const __VLS_76 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
    label: "作用范围",
    width: "90",
    align: "center",
}));
const __VLS_78 = __VLS_77({
    label: "作用范围",
    width: "90",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_77));
__VLS_79.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_79.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    (row.scope);
}
var __VLS_79;
const __VLS_80 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
    prop: "source",
    label: "来源",
    width: "110",
}));
const __VLS_82 = __VLS_81({
    prop: "source",
    label: "来源",
    width: "110",
}, ...__VLS_functionalComponentArgsRest(__VLS_81));
const __VLS_84 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
    label: "操作",
    width: "200",
    fixed: "right",
}));
const __VLS_86 = __VLS_85({
    label: "操作",
    width: "200",
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
        onClick: (...[$event]) => {
            __VLS_ctx.openDetail(row);
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
        type: "primary",
    }));
    const __VLS_98 = __VLS_97({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_97));
    let __VLS_100;
    let __VLS_101;
    let __VLS_102;
    const __VLS_103 = {
        onClick: (...[$event]) => {
            __VLS_ctx.runTest(row);
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
            __VLS_ctx.confirmDelete(row);
        }
    };
    __VLS_107.slots.default;
    var __VLS_107;
}
var __VLS_87;
var __VLS_51;
const __VLS_112 = {}.ElPagination;
/** @type {[typeof __VLS_components.ElPagination, typeof __VLS_components.elPagination, ]} */ ;
// @ts-ignore
const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
    ...{ class: "pager" },
    layout: "total, prev, pager, next",
    total: (__VLS_ctx.filteredRules.length),
    pageSize: (20),
    background: true,
}));
const __VLS_114 = __VLS_113({
    ...{ class: "pager" },
    layout: "total, prev, pager, next",
    total: (__VLS_ctx.filteredRules.length),
    pageSize: (20),
    background: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_113));
var __VLS_11;
var __VLS_7;
const __VLS_116 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
    span: (8),
}));
const __VLS_118 = __VLS_117({
    span: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_117));
__VLS_119.slots.default;
const __VLS_120 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({
    ...{ class: "panel-card dashboard-card" },
    shadow: "never",
}));
const __VLS_122 = __VLS_121({
    ...{ class: "panel-card dashboard-card" },
    shadow: "never",
}, ...__VLS_functionalComponentArgsRest(__VLS_121));
__VLS_123.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_123.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    const __VLS_124 = {}.ElLink;
    /** @type {[typeof __VLS_components.ElLink, typeof __VLS_components.elLink, typeof __VLS_components.ElLink, typeof __VLS_components.elLink, ]} */ ;
    // @ts-ignore
    const __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({
        underline: (false),
        type: "danger",
    }));
    const __VLS_126 = __VLS_125({
        underline: (false),
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_125));
    __VLS_127.slots.default;
    var __VLS_127;
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
    const __VLS_128 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({
        size: (18),
    }));
    const __VLS_130 = __VLS_129({
        size: (18),
    }, ...__VLS_functionalComponentArgsRest(__VLS_129));
    __VLS_131.slots.default;
    const __VLS_132 = {}.Checked;
    /** @type {[typeof __VLS_components.Checked, ]} */ ;
    // @ts-ignore
    const __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132({}));
    const __VLS_134 = __VLS_133({}, ...__VLS_functionalComponentArgsRest(__VLS_133));
    var __VLS_131;
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
var __VLS_123;
var __VLS_119;
var __VLS_3;
const __VLS_136 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_137 = __VLS_asFunctionalComponent(__VLS_136, new __VLS_136({
    modelValue: (__VLS_ctx.editorVisible),
    title: (__VLS_ctx.editing ? '编辑规则' : '新增规则'),
    width: "560px",
}));
const __VLS_138 = __VLS_137({
    modelValue: (__VLS_ctx.editorVisible),
    title: (__VLS_ctx.editing ? '编辑规则' : '新增规则'),
    width: "560px",
}, ...__VLS_functionalComponentArgsRest(__VLS_137));
__VLS_139.slots.default;
const __VLS_140 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_141 = __VLS_asFunctionalComponent(__VLS_140, new __VLS_140({
    model: (__VLS_ctx.form),
    labelWidth: "90px",
}));
const __VLS_142 = __VLS_141({
    model: (__VLS_ctx.form),
    labelWidth: "90px",
}, ...__VLS_functionalComponentArgsRest(__VLS_141));
__VLS_143.slots.default;
const __VLS_144 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_145 = __VLS_asFunctionalComponent(__VLS_144, new __VLS_144({
    label: "规则名称",
}));
const __VLS_146 = __VLS_145({
    label: "规则名称",
}, ...__VLS_functionalComponentArgsRest(__VLS_145));
__VLS_147.slots.default;
const __VLS_148 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_149 = __VLS_asFunctionalComponent(__VLS_148, new __VLS_148({
    modelValue: (__VLS_ctx.form.name),
}));
const __VLS_150 = __VLS_149({
    modelValue: (__VLS_ctx.form.name),
}, ...__VLS_functionalComponentArgsRest(__VLS_149));
var __VLS_147;
const __VLS_152 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_153 = __VLS_asFunctionalComponent(__VLS_152, new __VLS_152({
    label: "规则类型",
}));
const __VLS_154 = __VLS_153({
    label: "规则类型",
}, ...__VLS_functionalComponentArgsRest(__VLS_153));
__VLS_155.slots.default;
const __VLS_156 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_157 = __VLS_asFunctionalComponent(__VLS_156, new __VLS_156({
    modelValue: (__VLS_ctx.form.category),
    ...{ class: "w-full" },
}));
const __VLS_158 = __VLS_157({
    modelValue: (__VLS_ctx.form.category),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_157));
__VLS_159.slots.default;
const __VLS_160 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_161 = __VLS_asFunctionalComponent(__VLS_160, new __VLS_160({
    label: "完整性",
    value: "完整性",
}));
const __VLS_162 = __VLS_161({
    label: "完整性",
    value: "完整性",
}, ...__VLS_functionalComponentArgsRest(__VLS_161));
const __VLS_164 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_165 = __VLS_asFunctionalComponent(__VLS_164, new __VLS_164({
    label: "准确性",
    value: "准确性",
}));
const __VLS_166 = __VLS_165({
    label: "准确性",
    value: "准确性",
}, ...__VLS_functionalComponentArgsRest(__VLS_165));
const __VLS_168 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_169 = __VLS_asFunctionalComponent(__VLS_168, new __VLS_168({
    label: "一致性",
    value: "一致性",
}));
const __VLS_170 = __VLS_169({
    label: "一致性",
    value: "一致性",
}, ...__VLS_functionalComponentArgsRest(__VLS_169));
const __VLS_172 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_173 = __VLS_asFunctionalComponent(__VLS_172, new __VLS_172({
    label: "唯一性",
    value: "唯一性",
}));
const __VLS_174 = __VLS_173({
    label: "唯一性",
    value: "唯一性",
}, ...__VLS_functionalComponentArgsRest(__VLS_173));
const __VLS_176 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_177 = __VLS_asFunctionalComponent(__VLS_176, new __VLS_176({
    label: "及时性",
    value: "及时性",
}));
const __VLS_178 = __VLS_177({
    label: "及时性",
    value: "及时性",
}, ...__VLS_functionalComponentArgsRest(__VLS_177));
var __VLS_159;
var __VLS_155;
const __VLS_180 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_181 = __VLS_asFunctionalComponent(__VLS_180, new __VLS_180({
    label: "规则级别",
}));
const __VLS_182 = __VLS_181({
    label: "规则级别",
}, ...__VLS_functionalComponentArgsRest(__VLS_181));
__VLS_183.slots.default;
const __VLS_184 = {}.ElRadioGroup;
/** @type {[typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, ]} */ ;
// @ts-ignore
const __VLS_185 = __VLS_asFunctionalComponent(__VLS_184, new __VLS_184({
    modelValue: (__VLS_ctx.form.level),
}));
const __VLS_186 = __VLS_185({
    modelValue: (__VLS_ctx.form.level),
}, ...__VLS_functionalComponentArgsRest(__VLS_185));
__VLS_187.slots.default;
const __VLS_188 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
const __VLS_189 = __VLS_asFunctionalComponent(__VLS_188, new __VLS_188({
    value: "核心",
}));
const __VLS_190 = __VLS_189({
    value: "核心",
}, ...__VLS_functionalComponentArgsRest(__VLS_189));
const __VLS_192 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
const __VLS_193 = __VLS_asFunctionalComponent(__VLS_192, new __VLS_192({
    value: "重要",
}));
const __VLS_194 = __VLS_193({
    value: "重要",
}, ...__VLS_functionalComponentArgsRest(__VLS_193));
const __VLS_196 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
const __VLS_197 = __VLS_asFunctionalComponent(__VLS_196, new __VLS_196({
    value: "一般",
}));
const __VLS_198 = __VLS_197({
    value: "一般",
}, ...__VLS_functionalComponentArgsRest(__VLS_197));
var __VLS_187;
var __VLS_183;
const __VLS_200 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_201 = __VLS_asFunctionalComponent(__VLS_200, new __VLS_200({
    label: "权重",
}));
const __VLS_202 = __VLS_201({
    label: "权重",
}, ...__VLS_functionalComponentArgsRest(__VLS_201));
__VLS_203.slots.default;
const __VLS_204 = {}.ElSlider;
/** @type {[typeof __VLS_components.ElSlider, typeof __VLS_components.elSlider, ]} */ ;
// @ts-ignore
const __VLS_205 = __VLS_asFunctionalComponent(__VLS_204, new __VLS_204({
    modelValue: (__VLS_ctx.form.weight),
    min: (1),
    max: (100),
    showInput: true,
}));
const __VLS_206 = __VLS_205({
    modelValue: (__VLS_ctx.form.weight),
    min: (1),
    max: (100),
    showInput: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_205));
var __VLS_203;
const __VLS_208 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_209 = __VLS_asFunctionalComponent(__VLS_208, new __VLS_208({
    label: "规则描述",
}));
const __VLS_210 = __VLS_209({
    label: "规则描述",
}, ...__VLS_functionalComponentArgsRest(__VLS_209));
__VLS_211.slots.default;
const __VLS_212 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_213 = __VLS_asFunctionalComponent(__VLS_212, new __VLS_212({
    modelValue: (__VLS_ctx.form.description),
    type: "textarea",
    rows: (3),
}));
const __VLS_214 = __VLS_213({
    modelValue: (__VLS_ctx.form.description),
    type: "textarea",
    rows: (3),
}, ...__VLS_functionalComponentArgsRest(__VLS_213));
var __VLS_211;
var __VLS_143;
{
    const { footer: __VLS_thisSlot } = __VLS_139.slots;
    const __VLS_216 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_217 = __VLS_asFunctionalComponent(__VLS_216, new __VLS_216({
        ...{ 'onClick': {} },
    }));
    const __VLS_218 = __VLS_217({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_217));
    let __VLS_220;
    let __VLS_221;
    let __VLS_222;
    const __VLS_223 = {
        onClick: (...[$event]) => {
            __VLS_ctx.editorVisible = false;
        }
    };
    __VLS_219.slots.default;
    var __VLS_219;
    const __VLS_224 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_225 = __VLS_asFunctionalComponent(__VLS_224, new __VLS_224({
        ...{ 'onClick': {} },
        type: "danger",
    }));
    const __VLS_226 = __VLS_225({
        ...{ 'onClick': {} },
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_225));
    let __VLS_228;
    let __VLS_229;
    let __VLS_230;
    const __VLS_231 = {
        onClick: (__VLS_ctx.saveForm)
    };
    __VLS_227.slots.default;
    var __VLS_227;
}
var __VLS_139;
const __VLS_232 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_233 = __VLS_asFunctionalComponent(__VLS_232, new __VLS_232({
    modelValue: (__VLS_ctx.detailVisible),
    title: (__VLS_ctx.detailRow?.name ?? '规则详情'),
    width: "560px",
}));
const __VLS_234 = __VLS_233({
    modelValue: (__VLS_ctx.detailVisible),
    title: (__VLS_ctx.detailRow?.name ?? '规则详情'),
    width: "560px",
}, ...__VLS_functionalComponentArgsRest(__VLS_233));
__VLS_235.slots.default;
const __VLS_236 = {}.ElDescriptions;
/** @type {[typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, ]} */ ;
// @ts-ignore
const __VLS_237 = __VLS_asFunctionalComponent(__VLS_236, new __VLS_236({
    column: (2),
    border: true,
}));
const __VLS_238 = __VLS_237({
    column: (2),
    border: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_237));
__VLS_239.slots.default;
const __VLS_240 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_241 = __VLS_asFunctionalComponent(__VLS_240, new __VLS_240({
    label: "规则编号",
}));
const __VLS_242 = __VLS_241({
    label: "规则编号",
}, ...__VLS_functionalComponentArgsRest(__VLS_241));
__VLS_243.slots.default;
(__VLS_ctx.detailRow?.code);
var __VLS_243;
const __VLS_244 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_245 = __VLS_asFunctionalComponent(__VLS_244, new __VLS_244({
    label: "规则类型",
}));
const __VLS_246 = __VLS_245({
    label: "规则类型",
}, ...__VLS_functionalComponentArgsRest(__VLS_245));
__VLS_247.slots.default;
(__VLS_ctx.detailRow?.category);
var __VLS_247;
const __VLS_248 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_249 = __VLS_asFunctionalComponent(__VLS_248, new __VLS_248({
    label: "级别",
}));
const __VLS_250 = __VLS_249({
    label: "级别",
}, ...__VLS_functionalComponentArgsRest(__VLS_249));
__VLS_251.slots.default;
(__VLS_ctx.detailRow?.level);
var __VLS_251;
const __VLS_252 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_253 = __VLS_asFunctionalComponent(__VLS_252, new __VLS_252({
    label: "权重",
}));
const __VLS_254 = __VLS_253({
    label: "权重",
}, ...__VLS_functionalComponentArgsRest(__VLS_253));
__VLS_255.slots.default;
(__VLS_ctx.detailRow?.weight);
var __VLS_255;
const __VLS_256 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_257 = __VLS_asFunctionalComponent(__VLS_256, new __VLS_256({
    label: "作用范围",
}));
const __VLS_258 = __VLS_257({
    label: "作用范围",
}, ...__VLS_functionalComponentArgsRest(__VLS_257));
__VLS_259.slots.default;
(__VLS_ctx.detailRow?.scope);
var __VLS_259;
const __VLS_260 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_261 = __VLS_asFunctionalComponent(__VLS_260, new __VLS_260({
    label: "来源",
}));
const __VLS_262 = __VLS_261({
    label: "来源",
}, ...__VLS_functionalComponentArgsRest(__VLS_261));
__VLS_263.slots.default;
(__VLS_ctx.detailRow?.source);
var __VLS_263;
const __VLS_264 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_265 = __VLS_asFunctionalComponent(__VLS_264, new __VLS_264({
    label: "描述",
    span: (2),
}));
const __VLS_266 = __VLS_265({
    label: "描述",
    span: (2),
}, ...__VLS_functionalComponentArgsRest(__VLS_265));
__VLS_267.slots.default;
(__VLS_ctx.detailRow?.description);
var __VLS_267;
var __VLS_239;
var __VLS_235;
/** @type {__VLS_StyleScopedClasses['standard-page']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['toolbar-row']} */ ;
/** @type {__VLS_StyleScopedClasses['search-input']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-12']} */ ;
/** @type {__VLS_StyleScopedClasses['pager']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['template-item']} */ ;
/** @type {__VLS_StyleScopedClasses['template-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['template-info']} */ ;
/** @type {__VLS_StyleScopedClasses['template-name']} */ ;
/** @type {__VLS_StyleScopedClasses['template-desc']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Checked: Checked,
            Plus: Plus,
            Search: Search,
            levelTagType: levelTagType,
            keyword: keyword,
            ruleCategory: ruleCategory,
            editorVisible: editorVisible,
            detailVisible: detailVisible,
            editing: editing,
            detailRow: detailRow,
            templates: templates,
            form: form,
            filteredRules: filteredRules,
            openCreate: openCreate,
            saveForm: saveForm,
            openDetail: openDetail,
            runTest: runTest,
            confirmDelete: confirmDelete,
            applyTemplate: applyTemplate,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
