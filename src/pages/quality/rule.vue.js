import { computed, reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { CircleCheck, Clock, Connection, Lock, Plus, Search, Setting } from '@element-plus/icons-vue';
import { mockQualityRules } from '@/mock/quality';
const ruleTypes = ['完整性', '准确性', '一致性', '唯一性', '及时性'];
const tablePool = ['ticket_sale', 'passenger_info', 'station_info', 'line_info', 'device_status', 'flow_stat'];
const fieldPool = ['flow_count', 'station_name', 'ticket_no', 'cust_name', 'phone', 'line_code', 'device_no', 'stat_date'];
const typeTagType = {
    完整性: 'danger',
    准确性: 'primary',
    一致性: 'success',
    唯一性: 'warning',
    及时性: 'info',
};
const statusTagType = {
    启用: 'success',
    停用: 'info',
    草稿: 'warning',
};
const templates = [
    { name: '必填完整性模板', description: '关键字段非空检查', icon: CircleCheck },
    { name: '格式准确性模板', description: '手机号/证件号格式校验', icon: Setting },
    { name: '标准一致性模板', description: '字典码值标准比对', icon: Connection },
    { name: '唯一性检查模板', description: '主键/业务键重复检查', icon: Lock },
    { name: '及时性检查模板', description: '数据入库时效检查', icon: Clock },
];
const keyword = ref('');
const filterType = ref('');
const filterStatus = ref('');
const editorVisible = ref(false);
const editingRule = ref(null);
const form = reactive({
    name: '',
    type: '完整性',
    level: '字段级',
    tableName: 'ticket_sale',
    fieldName: 'ticket_no',
    weight: 0.3,
    priority: '中',
    description: '',
});
const filteredRules = computed(() => mockQualityRules.filter((rule) => {
    if (filterType.value && rule.type !== filterType.value)
        return false;
    if (filterStatus.value && rule.status !== filterStatus.value)
        return false;
    if (!keyword.value)
        return true;
    const kw = keyword.value.toLowerCase();
    return rule.name.toLowerCase().includes(kw) || rule.tableName.toLowerCase().includes(kw);
}));
const applyTemplate = (template) => {
    form.name = template.name;
    form.description = `${template.description}（套用模板）`;
    ElMessage.success(`已套用模板「${template.name}」`);
};
const recommendRules = () => {
    ElMessage.success('根据最新发布的数据标准自动生成 12 条质量规则（Mock）');
};
const openCreate = () => {
    editingRule.value = null;
    Object.assign(form, {
        name: '',
        type: '完整性',
        level: '字段级',
        tableName: 'ticket_sale',
        fieldName: 'ticket_no',
        weight: 0.3,
        priority: '中',
        description: '',
    });
    editorVisible.value = true;
};
const openEdit = (row) => {
    editingRule.value = row;
    Object.assign(form, {
        name: row.name,
        type: row.type,
        level: row.level,
        tableName: row.tableName,
        fieldName: row.fieldName,
        weight: row.weight,
        priority: row.priority,
        description: row.description,
    });
    editorVisible.value = true;
};
const saveForm = () => {
    if (!form.name.trim()) {
        ElMessage.warning('请输入规则名称');
        return;
    }
    if (editingRule.value) {
        ElMessage.success(`规则「${form.name}」已保存，版本 ${editingRule.value.version}（Mock）`);
    }
    else {
        mockQualityRules.unshift({
            id: `qr-mock-${Date.now()}`,
            name: form.name,
            type: form.type,
            level: form.level,
            tableName: form.tableName,
            fieldName: form.fieldName,
            templateName: `${form.type}检查模板`,
            weight: form.weight,
            priority: form.priority,
            status: '草稿',
            owner: '张三',
            version: 'V1.0',
            updateTime: new Date().toLocaleString('sv-SE').replace('T', ' '),
            description: form.description,
        });
        ElMessage.success('质量规则已新增（Mock）');
    }
    editorVisible.value = false;
};
const trialRule = (row) => {
    ElMessage.success(`规则「${row.name}」试跑完成：检查 12,845 条，发现 26 条问题（Mock）`);
};
const toggleRule = (row) => {
    row.status = row.status === '启用' ? '停用' : '启用';
    ElMessage.info(`规则「${row.name}」已${row.status === '启用' ? '启用' : '停用'}（Mock）`);
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
    placeholder: "按规则名称 / 表名搜索",
    clearable: true,
    ...{ class: "search-input" },
    prefixIcon: (__VLS_ctx.Search),
}));
const __VLS_22 = __VLS_21({
    modelValue: (__VLS_ctx.keyword),
    placeholder: "按规则名称 / 表名搜索",
    clearable: true,
    ...{ class: "search-input" },
    prefixIcon: (__VLS_ctx.Search),
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
const __VLS_24 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    modelValue: (__VLS_ctx.filterType),
    placeholder: "规则类型",
    clearable: true,
    ...{ class: "filter-select" },
}));
const __VLS_26 = __VLS_25({
    modelValue: (__VLS_ctx.filterType),
    placeholder: "规则类型",
    clearable: true,
    ...{ class: "filter-select" },
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
__VLS_27.slots.default;
for (const [type] of __VLS_getVForSourceType((__VLS_ctx.ruleTypes))) {
    const __VLS_28 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
        key: (type),
        label: (type),
        value: (type),
    }));
    const __VLS_30 = __VLS_29({
        key: (type),
        label: (type),
        value: (type),
    }, ...__VLS_functionalComponentArgsRest(__VLS_29));
}
var __VLS_27;
const __VLS_32 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
    modelValue: (__VLS_ctx.filterStatus),
    placeholder: "状态",
    clearable: true,
    ...{ class: "filter-select" },
}));
const __VLS_34 = __VLS_33({
    modelValue: (__VLS_ctx.filterStatus),
    placeholder: "状态",
    clearable: true,
    ...{ class: "filter-select" },
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
__VLS_35.slots.default;
const __VLS_36 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    label: "启用",
    value: "启用",
}));
const __VLS_38 = __VLS_37({
    label: "启用",
    value: "启用",
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
const __VLS_40 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
    label: "停用",
    value: "停用",
}));
const __VLS_42 = __VLS_41({
    label: "停用",
    value: "停用",
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
const __VLS_44 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    label: "草稿",
    value: "草稿",
}));
const __VLS_46 = __VLS_45({
    label: "草稿",
    value: "草稿",
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
var __VLS_35;
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
    prop: "name",
    label: "规则名称",
    minWidth: "170",
}));
const __VLS_54 = __VLS_53({
    prop: "name",
    label: "规则名称",
    minWidth: "170",
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
const __VLS_56 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
    label: "类型",
    width: "90",
}));
const __VLS_58 = __VLS_57({
    label: "类型",
    width: "90",
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
__VLS_59.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_59.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_60 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
        type: (__VLS_ctx.typeTagType[row.type]),
        effect: "plain",
    }));
    const __VLS_62 = __VLS_61({
        type: (__VLS_ctx.typeTagType[row.type]),
        effect: "plain",
    }, ...__VLS_functionalComponentArgsRest(__VLS_61));
    __VLS_63.slots.default;
    (row.type);
    var __VLS_63;
}
var __VLS_59;
const __VLS_64 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
    prop: "level",
    label: "级别",
    width: "80",
}));
const __VLS_66 = __VLS_65({
    prop: "level",
    label: "级别",
    width: "80",
}, ...__VLS_functionalComponentArgsRest(__VLS_65));
const __VLS_68 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
    prop: "tableName",
    label: "目标表",
    width: "130",
}));
const __VLS_70 = __VLS_69({
    prop: "tableName",
    label: "目标表",
    width: "130",
}, ...__VLS_functionalComponentArgsRest(__VLS_69));
const __VLS_72 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
    prop: "fieldName",
    label: "字段",
    width: "110",
}));
const __VLS_74 = __VLS_73({
    prop: "fieldName",
    label: "字段",
    width: "110",
}, ...__VLS_functionalComponentArgsRest(__VLS_73));
const __VLS_76 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
    label: "权重",
    width: "80",
    align: "center",
}));
const __VLS_78 = __VLS_77({
    label: "权重",
    width: "80",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_77));
__VLS_79.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_79.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    (row.weight);
}
var __VLS_79;
const __VLS_80 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
    prop: "priority",
    label: "优先级",
    width: "80",
}));
const __VLS_82 = __VLS_81({
    prop: "priority",
    label: "优先级",
    width: "80",
}, ...__VLS_functionalComponentArgsRest(__VLS_81));
const __VLS_84 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
    label: "状态",
    width: "80",
}));
const __VLS_86 = __VLS_85({
    label: "状态",
    width: "80",
}, ...__VLS_functionalComponentArgsRest(__VLS_85));
__VLS_87.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_87.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_88 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
        type: (__VLS_ctx.statusTagType[row.status]),
        effect: "dark",
    }));
    const __VLS_90 = __VLS_89({
        type: (__VLS_ctx.statusTagType[row.status]),
        effect: "dark",
    }, ...__VLS_functionalComponentArgsRest(__VLS_89));
    __VLS_91.slots.default;
    (row.status);
    var __VLS_91;
}
var __VLS_87;
const __VLS_92 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
    prop: "version",
    label: "版本",
    width: "70",
    align: "center",
}));
const __VLS_94 = __VLS_93({
    prop: "version",
    label: "版本",
    width: "70",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_93));
const __VLS_96 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
    label: "操作",
    width: "190",
    fixed: "right",
}));
const __VLS_98 = __VLS_97({
    label: "操作",
    width: "190",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_97));
__VLS_99.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_99.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
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
            __VLS_ctx.trialRule(row);
        }
    };
    __VLS_103.slots.default;
    var __VLS_103;
    const __VLS_108 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }));
    const __VLS_110 = __VLS_109({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_109));
    let __VLS_112;
    let __VLS_113;
    let __VLS_114;
    const __VLS_115 = {
        onClick: (...[$event]) => {
            __VLS_ctx.openEdit(row);
        }
    };
    __VLS_111.slots.default;
    var __VLS_111;
    const __VLS_116 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
        ...{ 'onClick': {} },
        link: true,
        type: "warning",
    }));
    const __VLS_118 = __VLS_117({
        ...{ 'onClick': {} },
        link: true,
        type: "warning",
    }, ...__VLS_functionalComponentArgsRest(__VLS_117));
    let __VLS_120;
    let __VLS_121;
    let __VLS_122;
    const __VLS_123 = {
        onClick: (...[$event]) => {
            __VLS_ctx.toggleRule(row);
        }
    };
    __VLS_119.slots.default;
    (row.status === '启用' ? '停用' : '启用');
    var __VLS_119;
}
var __VLS_99;
var __VLS_51;
const __VLS_124 = {}.ElPagination;
/** @type {[typeof __VLS_components.ElPagination, typeof __VLS_components.elPagination, ]} */ ;
// @ts-ignore
const __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({
    ...{ class: "pager" },
    layout: "total, prev, pager, next",
    total: (__VLS_ctx.filteredRules.length),
    pageSize: (20),
    background: true,
}));
const __VLS_126 = __VLS_125({
    ...{ class: "pager" },
    layout: "total, prev, pager, next",
    total: (__VLS_ctx.filteredRules.length),
    pageSize: (20),
    background: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_125));
var __VLS_11;
var __VLS_7;
const __VLS_128 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({
    span: (8),
}));
const __VLS_130 = __VLS_129({
    span: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_129));
__VLS_131.slots.default;
const __VLS_132 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132({
    ...{ class: "panel-card dashboard-card" },
    shadow: "never",
}));
const __VLS_134 = __VLS_133({
    ...{ class: "panel-card dashboard-card" },
    shadow: "never",
}, ...__VLS_functionalComponentArgsRest(__VLS_133));
__VLS_135.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_135.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    const __VLS_136 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_137 = __VLS_asFunctionalComponent(__VLS_136, new __VLS_136({
        ...{ 'onClick': {} },
        type: "danger",
        size: "small",
    }));
    const __VLS_138 = __VLS_137({
        ...{ 'onClick': {} },
        type: "danger",
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_137));
    let __VLS_140;
    let __VLS_141;
    let __VLS_142;
    const __VLS_143 = {
        onClick: (__VLS_ctx.recommendRules)
    };
    __VLS_139.slots.default;
    var __VLS_139;
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
    const __VLS_144 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_145 = __VLS_asFunctionalComponent(__VLS_144, new __VLS_144({
        size: (18),
    }));
    const __VLS_146 = __VLS_145({
        size: (18),
    }, ...__VLS_functionalComponentArgsRest(__VLS_145));
    __VLS_147.slots.default;
    const __VLS_148 = ((template.icon));
    // @ts-ignore
    const __VLS_149 = __VLS_asFunctionalComponent(__VLS_148, new __VLS_148({}));
    const __VLS_150 = __VLS_149({}, ...__VLS_functionalComponentArgsRest(__VLS_149));
    var __VLS_147;
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
var __VLS_135;
var __VLS_131;
var __VLS_3;
const __VLS_152 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_153 = __VLS_asFunctionalComponent(__VLS_152, new __VLS_152({
    modelValue: (__VLS_ctx.editorVisible),
    title: (__VLS_ctx.editingRule ? '编辑质量规则' : '新增质量规则'),
    width: "620px",
}));
const __VLS_154 = __VLS_153({
    modelValue: (__VLS_ctx.editorVisible),
    title: (__VLS_ctx.editingRule ? '编辑质量规则' : '新增质量规则'),
    width: "620px",
}, ...__VLS_functionalComponentArgsRest(__VLS_153));
__VLS_155.slots.default;
const __VLS_156 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_157 = __VLS_asFunctionalComponent(__VLS_156, new __VLS_156({
    model: (__VLS_ctx.form),
    labelWidth: "110px",
}));
const __VLS_158 = __VLS_157({
    model: (__VLS_ctx.form),
    labelWidth: "110px",
}, ...__VLS_functionalComponentArgsRest(__VLS_157));
__VLS_159.slots.default;
const __VLS_160 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_161 = __VLS_asFunctionalComponent(__VLS_160, new __VLS_160({
    label: "规则名称",
}));
const __VLS_162 = __VLS_161({
    label: "规则名称",
}, ...__VLS_functionalComponentArgsRest(__VLS_161));
__VLS_163.slots.default;
const __VLS_164 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_165 = __VLS_asFunctionalComponent(__VLS_164, new __VLS_164({
    modelValue: (__VLS_ctx.form.name),
}));
const __VLS_166 = __VLS_165({
    modelValue: (__VLS_ctx.form.name),
}, ...__VLS_functionalComponentArgsRest(__VLS_165));
var __VLS_163;
const __VLS_168 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_169 = __VLS_asFunctionalComponent(__VLS_168, new __VLS_168({
    label: "规则类型",
}));
const __VLS_170 = __VLS_169({
    label: "规则类型",
}, ...__VLS_functionalComponentArgsRest(__VLS_169));
__VLS_171.slots.default;
const __VLS_172 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_173 = __VLS_asFunctionalComponent(__VLS_172, new __VLS_172({
    modelValue: (__VLS_ctx.form.type),
    ...{ class: "w-full" },
}));
const __VLS_174 = __VLS_173({
    modelValue: (__VLS_ctx.form.type),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_173));
__VLS_175.slots.default;
for (const [type] of __VLS_getVForSourceType((__VLS_ctx.ruleTypes))) {
    const __VLS_176 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_177 = __VLS_asFunctionalComponent(__VLS_176, new __VLS_176({
        key: (type),
        label: (type),
        value: (type),
    }));
    const __VLS_178 = __VLS_177({
        key: (type),
        label: (type),
        value: (type),
    }, ...__VLS_functionalComponentArgsRest(__VLS_177));
}
var __VLS_175;
var __VLS_171;
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
    value: "字段级",
}));
const __VLS_190 = __VLS_189({
    value: "字段级",
}, ...__VLS_functionalComponentArgsRest(__VLS_189));
const __VLS_192 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
const __VLS_193 = __VLS_asFunctionalComponent(__VLS_192, new __VLS_192({
    value: "表级",
}));
const __VLS_194 = __VLS_193({
    value: "表级",
}, ...__VLS_functionalComponentArgsRest(__VLS_193));
var __VLS_187;
var __VLS_183;
const __VLS_196 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_197 = __VLS_asFunctionalComponent(__VLS_196, new __VLS_196({
    label: "目标表",
}));
const __VLS_198 = __VLS_197({
    label: "目标表",
}, ...__VLS_functionalComponentArgsRest(__VLS_197));
__VLS_199.slots.default;
const __VLS_200 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_201 = __VLS_asFunctionalComponent(__VLS_200, new __VLS_200({
    modelValue: (__VLS_ctx.form.tableName),
    ...{ class: "w-full" },
}));
const __VLS_202 = __VLS_201({
    modelValue: (__VLS_ctx.form.tableName),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_201));
__VLS_203.slots.default;
for (const [table] of __VLS_getVForSourceType((__VLS_ctx.tablePool))) {
    const __VLS_204 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_205 = __VLS_asFunctionalComponent(__VLS_204, new __VLS_204({
        key: (table),
        label: (table),
        value: (table),
    }));
    const __VLS_206 = __VLS_205({
        key: (table),
        label: (table),
        value: (table),
    }, ...__VLS_functionalComponentArgsRest(__VLS_205));
}
var __VLS_203;
var __VLS_199;
if (__VLS_ctx.form.level === '字段级') {
    const __VLS_208 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_209 = __VLS_asFunctionalComponent(__VLS_208, new __VLS_208({
        label: "目标字段",
    }));
    const __VLS_210 = __VLS_209({
        label: "目标字段",
    }, ...__VLS_functionalComponentArgsRest(__VLS_209));
    __VLS_211.slots.default;
    const __VLS_212 = {}.ElSelect;
    /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
    // @ts-ignore
    const __VLS_213 = __VLS_asFunctionalComponent(__VLS_212, new __VLS_212({
        modelValue: (__VLS_ctx.form.fieldName),
        ...{ class: "w-full" },
    }));
    const __VLS_214 = __VLS_213({
        modelValue: (__VLS_ctx.form.fieldName),
        ...{ class: "w-full" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_213));
    __VLS_215.slots.default;
    for (const [field] of __VLS_getVForSourceType((__VLS_ctx.fieldPool))) {
        const __VLS_216 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_217 = __VLS_asFunctionalComponent(__VLS_216, new __VLS_216({
            key: (field),
            label: (field),
            value: (field),
        }));
        const __VLS_218 = __VLS_217({
            key: (field),
            label: (field),
            value: (field),
        }, ...__VLS_functionalComponentArgsRest(__VLS_217));
    }
    var __VLS_215;
    var __VLS_211;
}
const __VLS_220 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_221 = __VLS_asFunctionalComponent(__VLS_220, new __VLS_220({
    label: "权重",
}));
const __VLS_222 = __VLS_221({
    label: "权重",
}, ...__VLS_functionalComponentArgsRest(__VLS_221));
__VLS_223.slots.default;
const __VLS_224 = {}.ElSlider;
/** @type {[typeof __VLS_components.ElSlider, typeof __VLS_components.elSlider, ]} */ ;
// @ts-ignore
const __VLS_225 = __VLS_asFunctionalComponent(__VLS_224, new __VLS_224({
    modelValue: (__VLS_ctx.form.weight),
    min: (0.1),
    max: (1),
    step: (0.1),
    showInput: true,
}));
const __VLS_226 = __VLS_225({
    modelValue: (__VLS_ctx.form.weight),
    min: (0.1),
    max: (1),
    step: (0.1),
    showInput: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_225));
var __VLS_223;
const __VLS_228 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_229 = __VLS_asFunctionalComponent(__VLS_228, new __VLS_228({
    label: "优先级",
}));
const __VLS_230 = __VLS_229({
    label: "优先级",
}, ...__VLS_functionalComponentArgsRest(__VLS_229));
__VLS_231.slots.default;
const __VLS_232 = {}.ElRadioGroup;
/** @type {[typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, ]} */ ;
// @ts-ignore
const __VLS_233 = __VLS_asFunctionalComponent(__VLS_232, new __VLS_232({
    modelValue: (__VLS_ctx.form.priority),
}));
const __VLS_234 = __VLS_233({
    modelValue: (__VLS_ctx.form.priority),
}, ...__VLS_functionalComponentArgsRest(__VLS_233));
__VLS_235.slots.default;
const __VLS_236 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
const __VLS_237 = __VLS_asFunctionalComponent(__VLS_236, new __VLS_236({
    value: "高",
}));
const __VLS_238 = __VLS_237({
    value: "高",
}, ...__VLS_functionalComponentArgsRest(__VLS_237));
const __VLS_240 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
const __VLS_241 = __VLS_asFunctionalComponent(__VLS_240, new __VLS_240({
    value: "中",
}));
const __VLS_242 = __VLS_241({
    value: "中",
}, ...__VLS_functionalComponentArgsRest(__VLS_241));
const __VLS_244 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
const __VLS_245 = __VLS_asFunctionalComponent(__VLS_244, new __VLS_244({
    value: "低",
}));
const __VLS_246 = __VLS_245({
    value: "低",
}, ...__VLS_functionalComponentArgsRest(__VLS_245));
var __VLS_235;
var __VLS_231;
const __VLS_248 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_249 = __VLS_asFunctionalComponent(__VLS_248, new __VLS_248({
    label: "检查逻辑",
}));
const __VLS_250 = __VLS_249({
    label: "检查逻辑",
}, ...__VLS_functionalComponentArgsRest(__VLS_249));
__VLS_251.slots.default;
const __VLS_252 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_253 = __VLS_asFunctionalComponent(__VLS_252, new __VLS_252({
    modelValue: (__VLS_ctx.form.description),
    type: "textarea",
    rows: (3),
}));
const __VLS_254 = __VLS_253({
    modelValue: (__VLS_ctx.form.description),
    type: "textarea",
    rows: (3),
}, ...__VLS_functionalComponentArgsRest(__VLS_253));
var __VLS_251;
var __VLS_159;
{
    const { footer: __VLS_thisSlot } = __VLS_155.slots;
    const __VLS_256 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_257 = __VLS_asFunctionalComponent(__VLS_256, new __VLS_256({
        ...{ 'onClick': {} },
    }));
    const __VLS_258 = __VLS_257({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_257));
    let __VLS_260;
    let __VLS_261;
    let __VLS_262;
    const __VLS_263 = {
        onClick: (...[$event]) => {
            __VLS_ctx.editorVisible = false;
        }
    };
    __VLS_259.slots.default;
    var __VLS_259;
    const __VLS_264 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_265 = __VLS_asFunctionalComponent(__VLS_264, new __VLS_264({
        ...{ 'onClick': {} },
        type: "danger",
    }));
    const __VLS_266 = __VLS_265({
        ...{ 'onClick': {} },
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_265));
    let __VLS_268;
    let __VLS_269;
    let __VLS_270;
    const __VLS_271 = {
        onClick: (__VLS_ctx.saveForm)
    };
    __VLS_267.slots.default;
    var __VLS_267;
}
var __VLS_155;
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
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['template-item']} */ ;
/** @type {__VLS_StyleScopedClasses['template-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['template-info']} */ ;
/** @type {__VLS_StyleScopedClasses['template-name']} */ ;
/** @type {__VLS_StyleScopedClasses['template-desc']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Plus: Plus,
            Search: Search,
            ruleTypes: ruleTypes,
            tablePool: tablePool,
            fieldPool: fieldPool,
            typeTagType: typeTagType,
            statusTagType: statusTagType,
            templates: templates,
            keyword: keyword,
            filterType: filterType,
            filterStatus: filterStatus,
            editorVisible: editorVisible,
            editingRule: editingRule,
            form: form,
            filteredRules: filteredRules,
            applyTemplate: applyTemplate,
            recommendRules: recommendRules,
            openCreate: openCreate,
            openEdit: openEdit,
            saveForm: saveForm,
            trialRule: trialRule,
            toggleRule: toggleRule,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
