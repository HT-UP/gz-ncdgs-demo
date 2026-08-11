import { computed, reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { Plus, Search } from '@element-plus/icons-vue';
const ruleStatusTagType = {
    已发布: 'success',
    审批中: 'warning',
    草稿: 'info',
};
const keyword = ref('');
const filterMethod = ref('');
const editorVisible = ref(false);
const rules = ref([
    { name: '证件号掩码规则', field: 'cert_no', tableName: 'customer_info', method: '掩码', algorithm: 'FPE-FF1', version: 'V2.1', status: '已发布' },
    { name: '手机号替换规则', field: 'phone', tableName: 'customer_info', method: '替换', algorithm: 'AES-256', version: 'V1.3', status: '已发布' },
    { name: '银行卡哈希规则', field: 'bank_no', tableName: 'account_info', method: '哈希', algorithm: 'SHA-256', version: 'V1.0', status: '审批中' },
    { name: '姓名保留格式', field: 'cust_name', tableName: 'ticket_sale', method: '保留格式', algorithm: 'FPE-FF1', version: 'V1.2', status: '已发布' },
    { name: '邮箱掩码规则', field: 'email', tableName: 'employee', method: '掩码', algorithm: 'FPE-FF1', version: 'V1.0', status: '草稿' },
]);
const encryptItems = [
    { name: '传输层加密', desc: 'TLS 1.3 全链路加密', enabled: true },
    { name: '存储层加密', desc: 'AES-256 透明加密', enabled: true },
    { name: '主密钥管理', desc: 'KMS 托管，每 90 天轮换', enabled: true },
    { name: '字段级加密', desc: '敏感字段独立加密', enabled: false },
];
const auditLogs = [
    { user: '张三', time: '2026-08-11 14:05', action: '提交「手机号替换规则 V1.3」审批', type: 'primary' },
    { user: '王工', time: '2026-08-11 13:20', action: '审批通过「证件号掩码规则 V2.1」', type: 'success' },
    { user: '李四', time: '2026-08-11 10:45', action: '轮换主密钥（KMS-20260811）', type: 'warning' },
    { user: '赵六', time: '2026-08-10 17:30', action: '导出合规报告（2026-Q2）', type: 'info' },
];
const form = reactive({
    name: '',
    tableName: 'customer_info',
    field: '',
    method: '掩码',
    algorithm: 'FPE-FF1',
});
const filteredRules = computed(() => rules.value.filter((rule) => {
    if (filterMethod.value && rule.method !== filterMethod.value)
        return false;
    if (!keyword.value)
        return true;
    const kw = keyword.value.toLowerCase();
    return rule.name.toLowerCase().includes(kw) || rule.field.toLowerCase().includes(kw);
}));
const openCreate = () => {
    Object.assign(form, { name: '', tableName: 'customer_info', field: '', method: '掩码', algorithm: 'FPE-FF1' });
    editorVisible.value = true;
};
const saveForm = () => {
    if (!form.name.trim() || !form.field.trim()) {
        ElMessage.warning('请填写规则名称和字段');
        return;
    }
    rules.value.unshift({
        name: form.name,
        field: form.field,
        tableName: form.tableName,
        method: form.method,
        algorithm: form.algorithm,
        version: 'V1.0',
        status: '草稿',
    });
    editorVisible.value = false;
    ElMessage.success('脱敏规则已创建（Mock）');
};
const submitApproval = (row) => {
    row.status = '审批中';
    ElMessage.success(`规则「${row.name}」已提交审批（Mock）`);
};
const applyRule = (row) => {
    ElMessage.success(`规则「${row.name}」已应用到 ${row.tableName}.${row.field}（Mock）`);
};
const rotateKey = () => {
    ElMessage.success('主密钥已轮换（Mock）');
};
const exportReport = () => {
    ElMessage.success('合规报告已生成并导出（Mock）');
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
    placeholder: "按规则名称 / 字段搜索",
    clearable: true,
    ...{ class: "search-input" },
    prefixIcon: (__VLS_ctx.Search),
}));
const __VLS_22 = __VLS_21({
    modelValue: (__VLS_ctx.keyword),
    placeholder: "按规则名称 / 字段搜索",
    clearable: true,
    ...{ class: "search-input" },
    prefixIcon: (__VLS_ctx.Search),
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
const __VLS_24 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    modelValue: (__VLS_ctx.filterMethod),
    placeholder: "脱敏方式",
    clearable: true,
    ...{ class: "filter-select" },
}));
const __VLS_26 = __VLS_25({
    modelValue: (__VLS_ctx.filterMethod),
    placeholder: "脱敏方式",
    clearable: true,
    ...{ class: "filter-select" },
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
__VLS_27.slots.default;
const __VLS_28 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
    label: "替换",
    value: "替换",
}));
const __VLS_30 = __VLS_29({
    label: "替换",
    value: "替换",
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
const __VLS_32 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
    label: "掩码",
    value: "掩码",
}));
const __VLS_34 = __VLS_33({
    label: "掩码",
    value: "掩码",
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
const __VLS_36 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    label: "哈希",
    value: "哈希",
}));
const __VLS_38 = __VLS_37({
    label: "哈希",
    value: "哈希",
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
const __VLS_40 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
    label: "保留格式",
    value: "保留格式",
}));
const __VLS_42 = __VLS_41({
    label: "保留格式",
    value: "保留格式",
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
var __VLS_27;
const __VLS_44 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    data: (__VLS_ctx.filteredRules),
    stripe: true,
    ...{ class: "mt-12" },
}));
const __VLS_46 = __VLS_45({
    data: (__VLS_ctx.filteredRules),
    stripe: true,
    ...{ class: "mt-12" },
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
__VLS_47.slots.default;
const __VLS_48 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
    prop: "name",
    label: "规则名称",
    minWidth: "140",
}));
const __VLS_50 = __VLS_49({
    prop: "name",
    label: "规则名称",
    minWidth: "140",
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
const __VLS_52 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
    prop: "field",
    label: "字段",
    width: "130",
}));
const __VLS_54 = __VLS_53({
    prop: "field",
    label: "字段",
    width: "130",
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
const __VLS_56 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
    prop: "tableName",
    label: "目标表",
    minWidth: "150",
}));
const __VLS_58 = __VLS_57({
    prop: "tableName",
    label: "目标表",
    minWidth: "150",
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
const __VLS_60 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
    label: "脱敏方式",
    width: "110",
}));
const __VLS_62 = __VLS_61({
    label: "脱敏方式",
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
        type: "danger",
    }));
    const __VLS_66 = __VLS_65({
        effect: "plain",
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_65));
    __VLS_67.slots.default;
    (row.method);
    var __VLS_67;
}
var __VLS_63;
const __VLS_68 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
    label: "算法",
    width: "100",
}));
const __VLS_70 = __VLS_69({
    label: "算法",
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_69));
__VLS_71.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_71.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    (row.algorithm);
}
var __VLS_71;
const __VLS_72 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
    label: "版本",
    width: "80",
    align: "center",
}));
const __VLS_74 = __VLS_73({
    label: "版本",
    width: "80",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_73));
__VLS_75.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_75.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    (row.version);
}
var __VLS_75;
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
        type: (__VLS_ctx.ruleStatusTagType[row.status]),
        effect: "dark",
    }));
    const __VLS_82 = __VLS_81({
        type: (__VLS_ctx.ruleStatusTagType[row.status]),
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
    width: "160",
    fixed: "right",
}));
const __VLS_86 = __VLS_85({
    label: "操作",
    width: "160",
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
            __VLS_ctx.submitApproval(row);
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
            __VLS_ctx.applyRule(row);
        }
    };
    __VLS_99.slots.default;
    var __VLS_99;
}
var __VLS_87;
var __VLS_47;
const __VLS_104 = {}.ElPagination;
/** @type {[typeof __VLS_components.ElPagination, typeof __VLS_components.elPagination, ]} */ ;
// @ts-ignore
const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
    ...{ class: "pager" },
    layout: "total, prev, pager, next",
    total: (__VLS_ctx.filteredRules.length),
    pageSize: (20),
    background: true,
}));
const __VLS_106 = __VLS_105({
    ...{ class: "pager" },
    layout: "total, prev, pager, next",
    total: (__VLS_ctx.filteredRules.length),
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
for (const [item] of __VLS_getVForSourceType((__VLS_ctx.encryptItems))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "encrypt-item" },
        key: (item.name),
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "encrypt-item-info" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "encrypt-item-name" },
    });
    (item.name);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "encrypt-item-desc" },
    });
    (item.desc);
    const __VLS_116 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
        effect: "plain",
        type: (item.enabled ? 'success' : 'info'),
    }));
    const __VLS_118 = __VLS_117({
        effect: "plain",
        type: (item.enabled ? 'success' : 'info'),
    }, ...__VLS_functionalComponentArgsRest(__VLS_117));
    __VLS_119.slots.default;
    (item.enabled ? '已启用' : '未启用');
    var __VLS_119;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "key-actions" },
});
const __VLS_120 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({
    ...{ 'onClick': {} },
    size: "small",
    type: "danger",
}));
const __VLS_122 = __VLS_121({
    ...{ 'onClick': {} },
    size: "small",
    type: "danger",
}, ...__VLS_functionalComponentArgsRest(__VLS_121));
let __VLS_124;
let __VLS_125;
let __VLS_126;
const __VLS_127 = {
    onClick: (__VLS_ctx.rotateKey)
};
__VLS_123.slots.default;
var __VLS_123;
const __VLS_128 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({
    ...{ 'onClick': {} },
    size: "small",
}));
const __VLS_130 = __VLS_129({
    ...{ 'onClick': {} },
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_129));
let __VLS_132;
let __VLS_133;
let __VLS_134;
const __VLS_135 = {
    onClick: (__VLS_ctx.exportReport)
};
__VLS_131.slots.default;
var __VLS_131;
var __VLS_115;
const __VLS_136 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_137 = __VLS_asFunctionalComponent(__VLS_136, new __VLS_136({
    ...{ class: "panel-card dashboard-card mt-16" },
    shadow: "never",
}));
const __VLS_138 = __VLS_137({
    ...{ class: "panel-card dashboard-card mt-16" },
    shadow: "never",
}, ...__VLS_functionalComponentArgsRest(__VLS_137));
__VLS_139.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_139.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
}
for (const [log] of __VLS_getVForSourceType((__VLS_ctx.auditLogs))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "audit-item" },
        key: (`${log.time}-${log.action}`),
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "audit-item-head" },
    });
    const __VLS_140 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_141 = __VLS_asFunctionalComponent(__VLS_140, new __VLS_140({
        effect: "dark",
        size: "small",
        type: (log.type),
    }));
    const __VLS_142 = __VLS_141({
        effect: "dark",
        size: "small",
        type: (log.type),
    }, ...__VLS_functionalComponentArgsRest(__VLS_141));
    __VLS_143.slots.default;
    (log.user);
    var __VLS_143;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "audit-item-time" },
    });
    (log.time);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "audit-item-action" },
    });
    (log.action);
}
var __VLS_139;
var __VLS_111;
var __VLS_3;
const __VLS_144 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_145 = __VLS_asFunctionalComponent(__VLS_144, new __VLS_144({
    modelValue: (__VLS_ctx.editorVisible),
    title: "新增脱敏规则",
    width: "560px",
}));
const __VLS_146 = __VLS_145({
    modelValue: (__VLS_ctx.editorVisible),
    title: "新增脱敏规则",
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
    label: "规则名称",
}));
const __VLS_154 = __VLS_153({
    label: "规则名称",
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
    label: "目标表",
}));
const __VLS_162 = __VLS_161({
    label: "目标表",
}, ...__VLS_functionalComponentArgsRest(__VLS_161));
__VLS_163.slots.default;
const __VLS_164 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_165 = __VLS_asFunctionalComponent(__VLS_164, new __VLS_164({
    modelValue: (__VLS_ctx.form.tableName),
    ...{ class: "w-full" },
}));
const __VLS_166 = __VLS_165({
    modelValue: (__VLS_ctx.form.tableName),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_165));
__VLS_167.slots.default;
const __VLS_168 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_169 = __VLS_asFunctionalComponent(__VLS_168, new __VLS_168({
    label: "customer_info",
    value: "customer_info",
}));
const __VLS_170 = __VLS_169({
    label: "customer_info",
    value: "customer_info",
}, ...__VLS_functionalComponentArgsRest(__VLS_169));
const __VLS_172 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_173 = __VLS_asFunctionalComponent(__VLS_172, new __VLS_172({
    label: "ticket_sale",
    value: "ticket_sale",
}));
const __VLS_174 = __VLS_173({
    label: "ticket_sale",
    value: "ticket_sale",
}, ...__VLS_functionalComponentArgsRest(__VLS_173));
const __VLS_176 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_177 = __VLS_asFunctionalComponent(__VLS_176, new __VLS_176({
    label: "employee",
    value: "employee",
}));
const __VLS_178 = __VLS_177({
    label: "employee",
    value: "employee",
}, ...__VLS_functionalComponentArgsRest(__VLS_177));
var __VLS_167;
var __VLS_163;
const __VLS_180 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_181 = __VLS_asFunctionalComponent(__VLS_180, new __VLS_180({
    label: "目标字段",
}));
const __VLS_182 = __VLS_181({
    label: "目标字段",
}, ...__VLS_functionalComponentArgsRest(__VLS_181));
__VLS_183.slots.default;
const __VLS_184 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_185 = __VLS_asFunctionalComponent(__VLS_184, new __VLS_184({
    modelValue: (__VLS_ctx.form.field),
    placeholder: "如 cert_no / phone",
}));
const __VLS_186 = __VLS_185({
    modelValue: (__VLS_ctx.form.field),
    placeholder: "如 cert_no / phone",
}, ...__VLS_functionalComponentArgsRest(__VLS_185));
var __VLS_183;
const __VLS_188 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_189 = __VLS_asFunctionalComponent(__VLS_188, new __VLS_188({
    label: "脱敏方式",
}));
const __VLS_190 = __VLS_189({
    label: "脱敏方式",
}, ...__VLS_functionalComponentArgsRest(__VLS_189));
__VLS_191.slots.default;
const __VLS_192 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_193 = __VLS_asFunctionalComponent(__VLS_192, new __VLS_192({
    modelValue: (__VLS_ctx.form.method),
    ...{ class: "w-full" },
}));
const __VLS_194 = __VLS_193({
    modelValue: (__VLS_ctx.form.method),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_193));
__VLS_195.slots.default;
const __VLS_196 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_197 = __VLS_asFunctionalComponent(__VLS_196, new __VLS_196({
    label: "替换",
    value: "替换",
}));
const __VLS_198 = __VLS_197({
    label: "替换",
    value: "替换",
}, ...__VLS_functionalComponentArgsRest(__VLS_197));
const __VLS_200 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_201 = __VLS_asFunctionalComponent(__VLS_200, new __VLS_200({
    label: "掩码",
    value: "掩码",
}));
const __VLS_202 = __VLS_201({
    label: "掩码",
    value: "掩码",
}, ...__VLS_functionalComponentArgsRest(__VLS_201));
const __VLS_204 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_205 = __VLS_asFunctionalComponent(__VLS_204, new __VLS_204({
    label: "哈希",
    value: "哈希",
}));
const __VLS_206 = __VLS_205({
    label: "哈希",
    value: "哈希",
}, ...__VLS_functionalComponentArgsRest(__VLS_205));
const __VLS_208 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_209 = __VLS_asFunctionalComponent(__VLS_208, new __VLS_208({
    label: "保留格式",
    value: "保留格式",
}));
const __VLS_210 = __VLS_209({
    label: "保留格式",
    value: "保留格式",
}, ...__VLS_functionalComponentArgsRest(__VLS_209));
var __VLS_195;
var __VLS_191;
const __VLS_212 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_213 = __VLS_asFunctionalComponent(__VLS_212, new __VLS_212({
    label: "算法",
}));
const __VLS_214 = __VLS_213({
    label: "算法",
}, ...__VLS_functionalComponentArgsRest(__VLS_213));
__VLS_215.slots.default;
const __VLS_216 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_217 = __VLS_asFunctionalComponent(__VLS_216, new __VLS_216({
    modelValue: (__VLS_ctx.form.algorithm),
    ...{ class: "w-full" },
}));
const __VLS_218 = __VLS_217({
    modelValue: (__VLS_ctx.form.algorithm),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_217));
__VLS_219.slots.default;
const __VLS_220 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_221 = __VLS_asFunctionalComponent(__VLS_220, new __VLS_220({
    label: "AES-256",
    value: "AES-256",
}));
const __VLS_222 = __VLS_221({
    label: "AES-256",
    value: "AES-256",
}, ...__VLS_functionalComponentArgsRest(__VLS_221));
const __VLS_224 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_225 = __VLS_asFunctionalComponent(__VLS_224, new __VLS_224({
    label: "SHA-256",
    value: "SHA-256",
}));
const __VLS_226 = __VLS_225({
    label: "SHA-256",
    value: "SHA-256",
}, ...__VLS_functionalComponentArgsRest(__VLS_225));
const __VLS_228 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_229 = __VLS_asFunctionalComponent(__VLS_228, new __VLS_228({
    label: "FPE-FF1",
    value: "FPE-FF1",
}));
const __VLS_230 = __VLS_229({
    label: "FPE-FF1",
    value: "FPE-FF1",
}, ...__VLS_functionalComponentArgsRest(__VLS_229));
const __VLS_232 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_233 = __VLS_asFunctionalComponent(__VLS_232, new __VLS_232({
    label: "MD5",
    value: "MD5",
}));
const __VLS_234 = __VLS_233({
    label: "MD5",
    value: "MD5",
}, ...__VLS_functionalComponentArgsRest(__VLS_233));
var __VLS_219;
var __VLS_215;
var __VLS_151;
{
    const { footer: __VLS_thisSlot } = __VLS_147.slots;
    const __VLS_236 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_237 = __VLS_asFunctionalComponent(__VLS_236, new __VLS_236({
        ...{ 'onClick': {} },
    }));
    const __VLS_238 = __VLS_237({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_237));
    let __VLS_240;
    let __VLS_241;
    let __VLS_242;
    const __VLS_243 = {
        onClick: (...[$event]) => {
            __VLS_ctx.editorVisible = false;
        }
    };
    __VLS_239.slots.default;
    var __VLS_239;
    const __VLS_244 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_245 = __VLS_asFunctionalComponent(__VLS_244, new __VLS_244({
        ...{ 'onClick': {} },
        type: "danger",
    }));
    const __VLS_246 = __VLS_245({
        ...{ 'onClick': {} },
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_245));
    let __VLS_248;
    let __VLS_249;
    let __VLS_250;
    const __VLS_251 = {
        onClick: (__VLS_ctx.saveForm)
    };
    __VLS_247.slots.default;
    var __VLS_247;
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
/** @type {__VLS_StyleScopedClasses['encrypt-item']} */ ;
/** @type {__VLS_StyleScopedClasses['encrypt-item-info']} */ ;
/** @type {__VLS_StyleScopedClasses['encrypt-item-name']} */ ;
/** @type {__VLS_StyleScopedClasses['encrypt-item-desc']} */ ;
/** @type {__VLS_StyleScopedClasses['key-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['audit-item']} */ ;
/** @type {__VLS_StyleScopedClasses['audit-item-head']} */ ;
/** @type {__VLS_StyleScopedClasses['audit-item-time']} */ ;
/** @type {__VLS_StyleScopedClasses['audit-item-action']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Plus: Plus,
            Search: Search,
            ruleStatusTagType: ruleStatusTagType,
            keyword: keyword,
            filterMethod: filterMethod,
            editorVisible: editorVisible,
            encryptItems: encryptItems,
            auditLogs: auditLogs,
            form: form,
            filteredRules: filteredRules,
            openCreate: openCreate,
            saveForm: saveForm,
            submitApproval: submitApproval,
            applyRule: applyRule,
            rotateKey: rotateKey,
            exportReport: exportReport,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
