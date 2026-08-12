import { computed, reactive, ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { Key, Plus, Search } from '@element-plus/icons-vue';
import { mockMaskingRules } from '@/mock/security';
const keyword = ref('');
const filterMethod = ref('');
const filterStatus = ref('');
const currentPage = ref(1);
const pageSize = 20;
const editorVisible = ref(false);
const editing = ref(false);
const rules = ref([...mockMaskingRules]);
const fieldPool = ['passenger_info.cust_name', 'passenger_info.phone', 'passenger_info.id_card', 'passenger_info.address', 'ticket_sale_detail.ticket_no'];
const methodTagType = {
    替换: 'primary',
    掩码: 'warning',
    哈希: 'info',
};
const ruleStatusTag = {
    已上线: 'success',
    审批中: 'warning',
    草稿: 'info',
};
const transport = reactive({ https: true, tls: 'TLS 1.3' });
const storage = reactive({ algorithm: 'SM4', rotation: true, rotationCycle: '90' });
const keys = [
    { name: '数据加密主密钥', desc: 'SM4 · 创建于 2026-01-15', status: '正常', statusType: 'success', color: '#00A854' },
    { name: '传输会话密钥', desc: 'TLS 1.3 · 每日轮换', status: '正常', statusType: 'success', color: '#2B6CB0' },
    { name: '脱敏 HMAC 密钥', desc: 'HMAC-SHA256 · 30 天轮换', status: '即将轮换', statusType: 'warning', color: '#ED7B2F' },
];
const form = reactive({
    name: '',
    field: 'passenger_info.phone',
    method: '掩码',
    preserveFormat: true,
    scope: '查询实时脱敏',
});
const filteredRules = computed(() => rules.value.filter((rule) => {
    if (filterMethod.value && rule.method !== filterMethod.value)
        return false;
    if (filterStatus.value && rule.status !== filterStatus.value)
        return false;
    if (!keyword.value)
        return true;
    const kw = keyword.value.toLowerCase();
    return rule.name.toLowerCase().includes(kw) || rule.field.toLowerCase().includes(kw);
}));
const pagedRules = computed(() => {
    const start = (currentPage.value - 1) * pageSize;
    return filteredRules.value.slice(start, start + pageSize);
});
const changePage = (page) => (currentPage.value = page);
watch([keyword, filterMethod, filterStatus], () => {
    currentPage.value = 1;
});
const openCreate = () => {
    editing.value = false;
    Object.assign(form, { name: '', field: 'passenger_info.phone', method: '掩码', preserveFormat: true, scope: '查询实时脱敏' });
    editorVisible.value = true;
};
const openEdit = (row) => {
    editing.value = true;
    Object.assign(form, {
        name: row.name,
        field: row.field,
        method: row.method,
        preserveFormat: row.preserveFormat,
        scope: row.scope,
    });
    editorVisible.value = true;
};
const saveForm = () => {
    if (!form.name.trim()) {
        ElMessage.warning('请输入规则名称');
        return;
    }
    if (editing.value) {
        ElMessage.success(`脱敏规则「${form.name}」已保存并进入审批（Mock）`);
    }
    else {
        rules.value.unshift({
            id: `msk-mock-${Date.now()}`,
            name: form.name,
            field: form.field,
            method: form.method,
            preserveFormat: form.preserveFormat,
            sampleBefore: '示例数据',
            sampleAfter: form.method === '掩码' ? '示例****' : '示例数据',
            scope: form.scope,
            status: '审批中',
            version: 'V1.0',
            updateTime: new Date().toLocaleString('sv-SE').replace('T', ' '),
        });
        ElMessage.success('脱敏规则已提交审批（Mock）');
    }
    editorVisible.value = false;
};
const versionHistory = (row) => {
    ElMessage.info(`「${row.name}」版本历史：${row.version} → V${Number(row.version.slice(1)) + 1}.0（Mock）`);
};
const onlineRule = (row) => {
    row.status = row.status === '已上线' ? '草稿' : '已上线';
    ElMessage.success(`规则「${row.name}」已${row.status === '已上线' ? '上线' : '下线'}（Mock）`);
};
const manageCert = () => ElMessage.info('打开证书管理（Mock）');
const rotateKey = () => ElMessage.success('密钥轮换已触发，新密钥将在 24 小时内生效（Mock）');
const createKey = () => ElMessage.info('创建新密钥向导（Mock）');
const destroyKey = () => ElMessage.warning('销毁操作需要二次审批，已生成审批单（Mock）');
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
    label: "已上线",
    value: "已上线",
}));
const __VLS_46 = __VLS_45({
    label: "已上线",
    value: "已上线",
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
const __VLS_48 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
    label: "审批中",
    value: "审批中",
}));
const __VLS_50 = __VLS_49({
    label: "审批中",
    value: "审批中",
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
const __VLS_52 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
    label: "草稿",
    value: "草稿",
}));
const __VLS_54 = __VLS_53({
    label: "草稿",
    value: "草稿",
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
var __VLS_43;
const __VLS_56 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
    data: (__VLS_ctx.pagedRules),
    stripe: true,
    ...{ class: "mt-12" },
}));
const __VLS_58 = __VLS_57({
    data: (__VLS_ctx.pagedRules),
    stripe: true,
    ...{ class: "mt-12" },
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
__VLS_59.slots.default;
const __VLS_60 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
    prop: "name",
    label: "规则名称",
    minWidth: "140",
}));
const __VLS_62 = __VLS_61({
    prop: "name",
    label: "规则名称",
    minWidth: "140",
}, ...__VLS_functionalComponentArgsRest(__VLS_61));
const __VLS_64 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
    prop: "field",
    label: "目标字段",
    minWidth: "170",
}));
const __VLS_66 = __VLS_65({
    prop: "field",
    label: "目标字段",
    minWidth: "170",
}, ...__VLS_functionalComponentArgsRest(__VLS_65));
const __VLS_68 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
    label: "方式",
    width: "80",
}));
const __VLS_70 = __VLS_69({
    label: "方式",
    width: "80",
}, ...__VLS_functionalComponentArgsRest(__VLS_69));
__VLS_71.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_71.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_72 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
        type: (__VLS_ctx.methodTagType[row.method]),
        effect: "plain",
    }));
    const __VLS_74 = __VLS_73({
        type: (__VLS_ctx.methodTagType[row.method]),
        effect: "plain",
    }, ...__VLS_functionalComponentArgsRest(__VLS_73));
    __VLS_75.slots.default;
    (row.method);
    var __VLS_75;
}
var __VLS_71;
const __VLS_76 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
    label: "保留格式",
    width: "90",
    align: "center",
}));
const __VLS_78 = __VLS_77({
    label: "保留格式",
    width: "90",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_77));
__VLS_79.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_79.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: (row.preserveFormat ? 'trend-positive' : 'dep-text') },
    });
    (row.preserveFormat ? '是' : '否');
}
var __VLS_79;
const __VLS_80 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
    label: "示例",
    minWidth: "210",
}));
const __VLS_82 = __VLS_81({
    label: "示例",
    minWidth: "210",
}, ...__VLS_functionalComponentArgsRest(__VLS_81));
__VLS_83.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_83.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "mask-sample-before" },
    });
    (row.sampleBefore);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "dep-text" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "mask-sample-after" },
    });
    (row.sampleAfter);
}
var __VLS_83;
const __VLS_84 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
    prop: "scope",
    label: "场景",
    width: "130",
}));
const __VLS_86 = __VLS_85({
    prop: "scope",
    label: "场景",
    width: "130",
}, ...__VLS_functionalComponentArgsRest(__VLS_85));
const __VLS_88 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
    prop: "version",
    label: "版本",
    width: "70",
    align: "center",
}));
const __VLS_90 = __VLS_89({
    prop: "version",
    label: "版本",
    width: "70",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_89));
const __VLS_92 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
    label: "状态",
    width: "90",
}));
const __VLS_94 = __VLS_93({
    label: "状态",
    width: "90",
}, ...__VLS_functionalComponentArgsRest(__VLS_93));
__VLS_95.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_95.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_96 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
        type: (__VLS_ctx.ruleStatusTag[row.status]),
        effect: "dark",
    }));
    const __VLS_98 = __VLS_97({
        type: (__VLS_ctx.ruleStatusTag[row.status]),
        effect: "dark",
    }, ...__VLS_functionalComponentArgsRest(__VLS_97));
    __VLS_99.slots.default;
    (row.status);
    var __VLS_99;
}
var __VLS_95;
const __VLS_100 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
    label: "操作",
    width: "190",
    fixed: "right",
}));
const __VLS_102 = __VLS_101({
    label: "操作",
    width: "190",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_101));
__VLS_103.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_103.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
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
            __VLS_ctx.openEdit(row);
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
            __VLS_ctx.versionHistory(row);
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
        type: "success",
    }));
    const __VLS_122 = __VLS_121({
        ...{ 'onClick': {} },
        link: true,
        type: "success",
    }, ...__VLS_functionalComponentArgsRest(__VLS_121));
    let __VLS_124;
    let __VLS_125;
    let __VLS_126;
    const __VLS_127 = {
        onClick: (...[$event]) => {
            __VLS_ctx.onlineRule(row);
        }
    };
    __VLS_123.slots.default;
    (row.status === '已上线' ? '下线' : '上线');
    var __VLS_123;
}
var __VLS_103;
var __VLS_59;
const __VLS_128 = {}.ElPagination;
/** @type {[typeof __VLS_components.ElPagination, typeof __VLS_components.elPagination, ]} */ ;
// @ts-ignore
const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({
    ...{ 'onCurrentChange': {} },
    ...{ class: "pager" },
    layout: "total, prev, pager, next",
    total: (__VLS_ctx.filteredRules.length),
    pageSize: (__VLS_ctx.pageSize),
    currentPage: (__VLS_ctx.currentPage),
    background: true,
}));
const __VLS_130 = __VLS_129({
    ...{ 'onCurrentChange': {} },
    ...{ class: "pager" },
    layout: "total, prev, pager, next",
    total: (__VLS_ctx.filteredRules.length),
    pageSize: (__VLS_ctx.pageSize),
    currentPage: (__VLS_ctx.currentPage),
    background: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_129));
let __VLS_132;
let __VLS_133;
let __VLS_134;
const __VLS_135 = {
    onCurrentChange: (__VLS_ctx.changePage)
};
var __VLS_131;
var __VLS_11;
var __VLS_7;
const __VLS_136 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_137 = __VLS_asFunctionalComponent(__VLS_136, new __VLS_136({
    span: (8),
}));
const __VLS_138 = __VLS_137({
    span: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_137));
__VLS_139.slots.default;
const __VLS_140 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_141 = __VLS_asFunctionalComponent(__VLS_140, new __VLS_140({
    ...{ class: "panel-card dashboard-card" },
    shadow: "never",
}));
const __VLS_142 = __VLS_141({
    ...{ class: "panel-card dashboard-card" },
    shadow: "never",
}, ...__VLS_functionalComponentArgsRest(__VLS_141));
__VLS_143.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_143.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
}
const __VLS_144 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_145 = __VLS_asFunctionalComponent(__VLS_144, new __VLS_144({
    labelWidth: "100px",
}));
const __VLS_146 = __VLS_145({
    labelWidth: "100px",
}, ...__VLS_functionalComponentArgsRest(__VLS_145));
__VLS_147.slots.default;
const __VLS_148 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_149 = __VLS_asFunctionalComponent(__VLS_148, new __VLS_148({
    label: "HTTPS 强制",
}));
const __VLS_150 = __VLS_149({
    label: "HTTPS 强制",
}, ...__VLS_functionalComponentArgsRest(__VLS_149));
__VLS_151.slots.default;
const __VLS_152 = {}.ElSwitch;
/** @type {[typeof __VLS_components.ElSwitch, typeof __VLS_components.elSwitch, ]} */ ;
// @ts-ignore
const __VLS_153 = __VLS_asFunctionalComponent(__VLS_152, new __VLS_152({
    modelValue: (__VLS_ctx.transport.https),
    activeText: "强制启用",
}));
const __VLS_154 = __VLS_153({
    modelValue: (__VLS_ctx.transport.https),
    activeText: "强制启用",
}, ...__VLS_functionalComponentArgsRest(__VLS_153));
var __VLS_151;
const __VLS_156 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_157 = __VLS_asFunctionalComponent(__VLS_156, new __VLS_156({
    label: "TLS 版本",
}));
const __VLS_158 = __VLS_157({
    label: "TLS 版本",
}, ...__VLS_functionalComponentArgsRest(__VLS_157));
__VLS_159.slots.default;
const __VLS_160 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_161 = __VLS_asFunctionalComponent(__VLS_160, new __VLS_160({
    modelValue: (__VLS_ctx.transport.tls),
    ...{ class: "w-full" },
}));
const __VLS_162 = __VLS_161({
    modelValue: (__VLS_ctx.transport.tls),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_161));
__VLS_163.slots.default;
const __VLS_164 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_165 = __VLS_asFunctionalComponent(__VLS_164, new __VLS_164({
    label: "TLS 1.3",
    value: "TLS 1.3",
}));
const __VLS_166 = __VLS_165({
    label: "TLS 1.3",
    value: "TLS 1.3",
}, ...__VLS_functionalComponentArgsRest(__VLS_165));
const __VLS_168 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_169 = __VLS_asFunctionalComponent(__VLS_168, new __VLS_168({
    label: "TLS 1.2",
    value: "TLS 1.2",
}));
const __VLS_170 = __VLS_169({
    label: "TLS 1.2",
    value: "TLS 1.2",
}, ...__VLS_functionalComponentArgsRest(__VLS_169));
var __VLS_163;
var __VLS_159;
const __VLS_172 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_173 = __VLS_asFunctionalComponent(__VLS_172, new __VLS_172({
    label: "证书管理",
}));
const __VLS_174 = __VLS_173({
    label: "证书管理",
}, ...__VLS_functionalComponentArgsRest(__VLS_173));
__VLS_175.slots.default;
const __VLS_176 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_177 = __VLS_asFunctionalComponent(__VLS_176, new __VLS_176({
    ...{ 'onClick': {} },
    size: "small",
}));
const __VLS_178 = __VLS_177({
    ...{ 'onClick': {} },
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_177));
let __VLS_180;
let __VLS_181;
let __VLS_182;
const __VLS_183 = {
    onClick: (__VLS_ctx.manageCert)
};
__VLS_179.slots.default;
var __VLS_179;
var __VLS_175;
var __VLS_147;
const __VLS_184 = {}.ElDivider;
/** @type {[typeof __VLS_components.ElDivider, typeof __VLS_components.elDivider, ]} */ ;
// @ts-ignore
const __VLS_185 = __VLS_asFunctionalComponent(__VLS_184, new __VLS_184({}));
const __VLS_186 = __VLS_185({}, ...__VLS_functionalComponentArgsRest(__VLS_185));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "section-title" },
});
const __VLS_188 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_189 = __VLS_asFunctionalComponent(__VLS_188, new __VLS_188({
    labelWidth: "100px",
}));
const __VLS_190 = __VLS_189({
    labelWidth: "100px",
}, ...__VLS_functionalComponentArgsRest(__VLS_189));
__VLS_191.slots.default;
const __VLS_192 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_193 = __VLS_asFunctionalComponent(__VLS_192, new __VLS_192({
    label: "加密算法",
}));
const __VLS_194 = __VLS_193({
    label: "加密算法",
}, ...__VLS_functionalComponentArgsRest(__VLS_193));
__VLS_195.slots.default;
const __VLS_196 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_197 = __VLS_asFunctionalComponent(__VLS_196, new __VLS_196({
    modelValue: (__VLS_ctx.storage.algorithm),
    ...{ class: "w-full" },
}));
const __VLS_198 = __VLS_197({
    modelValue: (__VLS_ctx.storage.algorithm),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_197));
__VLS_199.slots.default;
const __VLS_200 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_201 = __VLS_asFunctionalComponent(__VLS_200, new __VLS_200({
    label: "SM4（国密）",
    value: "SM4",
}));
const __VLS_202 = __VLS_201({
    label: "SM4（国密）",
    value: "SM4",
}, ...__VLS_functionalComponentArgsRest(__VLS_201));
const __VLS_204 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_205 = __VLS_asFunctionalComponent(__VLS_204, new __VLS_204({
    label: "AES-256",
    value: "AES-256",
}));
const __VLS_206 = __VLS_205({
    label: "AES-256",
    value: "AES-256",
}, ...__VLS_functionalComponentArgsRest(__VLS_205));
var __VLS_199;
var __VLS_195;
const __VLS_208 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_209 = __VLS_asFunctionalComponent(__VLS_208, new __VLS_208({
    label: "密钥轮换",
}));
const __VLS_210 = __VLS_209({
    label: "密钥轮换",
}, ...__VLS_functionalComponentArgsRest(__VLS_209));
__VLS_211.slots.default;
const __VLS_212 = {}.ElSwitch;
/** @type {[typeof __VLS_components.ElSwitch, typeof __VLS_components.elSwitch, ]} */ ;
// @ts-ignore
const __VLS_213 = __VLS_asFunctionalComponent(__VLS_212, new __VLS_212({
    modelValue: (__VLS_ctx.storage.rotation),
    activeText: "自动轮换",
}));
const __VLS_214 = __VLS_213({
    modelValue: (__VLS_ctx.storage.rotation),
    activeText: "自动轮换",
}, ...__VLS_functionalComponentArgsRest(__VLS_213));
var __VLS_211;
const __VLS_216 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_217 = __VLS_asFunctionalComponent(__VLS_216, new __VLS_216({
    label: "轮换周期",
}));
const __VLS_218 = __VLS_217({
    label: "轮换周期",
}, ...__VLS_functionalComponentArgsRest(__VLS_217));
__VLS_219.slots.default;
const __VLS_220 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_221 = __VLS_asFunctionalComponent(__VLS_220, new __VLS_220({
    modelValue: (__VLS_ctx.storage.rotationCycle),
    disabled: (!__VLS_ctx.storage.rotation),
    ...{ class: "w-full" },
}));
const __VLS_222 = __VLS_221({
    modelValue: (__VLS_ctx.storage.rotationCycle),
    disabled: (!__VLS_ctx.storage.rotation),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_221));
__VLS_223.slots.default;
const __VLS_224 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_225 = __VLS_asFunctionalComponent(__VLS_224, new __VLS_224({
    label: "30 天",
    value: "30",
}));
const __VLS_226 = __VLS_225({
    label: "30 天",
    value: "30",
}, ...__VLS_functionalComponentArgsRest(__VLS_225));
const __VLS_228 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_229 = __VLS_asFunctionalComponent(__VLS_228, new __VLS_228({
    label: "90 天",
    value: "90",
}));
const __VLS_230 = __VLS_229({
    label: "90 天",
    value: "90",
}, ...__VLS_functionalComponentArgsRest(__VLS_229));
const __VLS_232 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_233 = __VLS_asFunctionalComponent(__VLS_232, new __VLS_232({
    label: "180 天",
    value: "180",
}));
const __VLS_234 = __VLS_233({
    label: "180 天",
    value: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_233));
var __VLS_223;
var __VLS_219;
var __VLS_191;
var __VLS_143;
const __VLS_236 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_237 = __VLS_asFunctionalComponent(__VLS_236, new __VLS_236({
    ...{ class: "panel-card dashboard-card mt-16" },
    shadow: "never",
}));
const __VLS_238 = __VLS_237({
    ...{ class: "panel-card dashboard-card mt-16" },
    shadow: "never",
}, ...__VLS_functionalComponentArgsRest(__VLS_237));
__VLS_239.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_239.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
}
for (const [key] of __VLS_getVForSourceType((__VLS_ctx.keys))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "key-item" },
        key: (key.name),
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "key-icon" },
        ...{ style: ({ background: key.color }) },
    });
    const __VLS_240 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_241 = __VLS_asFunctionalComponent(__VLS_240, new __VLS_240({
        size: (16),
    }));
    const __VLS_242 = __VLS_241({
        size: (16),
    }, ...__VLS_functionalComponentArgsRest(__VLS_241));
    __VLS_243.slots.default;
    const __VLS_244 = {}.Key;
    /** @type {[typeof __VLS_components.Key, ]} */ ;
    // @ts-ignore
    const __VLS_245 = __VLS_asFunctionalComponent(__VLS_244, new __VLS_244({}));
    const __VLS_246 = __VLS_245({}, ...__VLS_functionalComponentArgsRest(__VLS_245));
    var __VLS_243;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "key-info" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "key-name" },
    });
    (key.name);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "key-desc" },
    });
    (key.desc);
    const __VLS_248 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_249 = __VLS_asFunctionalComponent(__VLS_248, new __VLS_248({
        size: "small",
        type: (key.statusType),
        effect: "dark",
    }));
    const __VLS_250 = __VLS_249({
        size: "small",
        type: (key.statusType),
        effect: "dark",
    }, ...__VLS_functionalComponentArgsRest(__VLS_249));
    __VLS_251.slots.default;
    (key.status);
    var __VLS_251;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "maintain-actions mt-12" },
});
const __VLS_252 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_253 = __VLS_asFunctionalComponent(__VLS_252, new __VLS_252({
    ...{ 'onClick': {} },
    size: "small",
    type: "danger",
    plain: true,
}));
const __VLS_254 = __VLS_253({
    ...{ 'onClick': {} },
    size: "small",
    type: "danger",
    plain: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_253));
let __VLS_256;
let __VLS_257;
let __VLS_258;
const __VLS_259 = {
    onClick: (__VLS_ctx.rotateKey)
};
__VLS_255.slots.default;
var __VLS_255;
const __VLS_260 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_261 = __VLS_asFunctionalComponent(__VLS_260, new __VLS_260({
    ...{ 'onClick': {} },
    size: "small",
}));
const __VLS_262 = __VLS_261({
    ...{ 'onClick': {} },
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_261));
let __VLS_264;
let __VLS_265;
let __VLS_266;
const __VLS_267 = {
    onClick: (__VLS_ctx.createKey)
};
__VLS_263.slots.default;
var __VLS_263;
const __VLS_268 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_269 = __VLS_asFunctionalComponent(__VLS_268, new __VLS_268({
    ...{ 'onClick': {} },
    size: "small",
    type: "warning",
    plain: true,
}));
const __VLS_270 = __VLS_269({
    ...{ 'onClick': {} },
    size: "small",
    type: "warning",
    plain: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_269));
let __VLS_272;
let __VLS_273;
let __VLS_274;
const __VLS_275 = {
    onClick: (__VLS_ctx.destroyKey)
};
__VLS_271.slots.default;
var __VLS_271;
var __VLS_239;
var __VLS_139;
var __VLS_3;
const __VLS_276 = {}.ElDrawer;
/** @type {[typeof __VLS_components.ElDrawer, typeof __VLS_components.elDrawer, typeof __VLS_components.ElDrawer, typeof __VLS_components.elDrawer, ]} */ ;
// @ts-ignore
const __VLS_277 = __VLS_asFunctionalComponent(__VLS_276, new __VLS_276({
    modelValue: (__VLS_ctx.editorVisible),
    title: (__VLS_ctx.editing ? '编辑脱敏规则' : '新增脱敏规则'),
    size: "520px",
}));
const __VLS_278 = __VLS_277({
    modelValue: (__VLS_ctx.editorVisible),
    title: (__VLS_ctx.editing ? '编辑脱敏规则' : '新增脱敏规则'),
    size: "520px",
}, ...__VLS_functionalComponentArgsRest(__VLS_277));
__VLS_279.slots.default;
const __VLS_280 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_281 = __VLS_asFunctionalComponent(__VLS_280, new __VLS_280({
    model: (__VLS_ctx.form),
    labelWidth: "100px",
}));
const __VLS_282 = __VLS_281({
    model: (__VLS_ctx.form),
    labelWidth: "100px",
}, ...__VLS_functionalComponentArgsRest(__VLS_281));
__VLS_283.slots.default;
const __VLS_284 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_285 = __VLS_asFunctionalComponent(__VLS_284, new __VLS_284({
    label: "规则名称",
}));
const __VLS_286 = __VLS_285({
    label: "规则名称",
}, ...__VLS_functionalComponentArgsRest(__VLS_285));
__VLS_287.slots.default;
const __VLS_288 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_289 = __VLS_asFunctionalComponent(__VLS_288, new __VLS_288({
    modelValue: (__VLS_ctx.form.name),
}));
const __VLS_290 = __VLS_289({
    modelValue: (__VLS_ctx.form.name),
}, ...__VLS_functionalComponentArgsRest(__VLS_289));
var __VLS_287;
const __VLS_292 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_293 = __VLS_asFunctionalComponent(__VLS_292, new __VLS_292({
    label: "目标字段",
}));
const __VLS_294 = __VLS_293({
    label: "目标字段",
}, ...__VLS_functionalComponentArgsRest(__VLS_293));
__VLS_295.slots.default;
const __VLS_296 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_297 = __VLS_asFunctionalComponent(__VLS_296, new __VLS_296({
    modelValue: (__VLS_ctx.form.field),
    filterable: true,
    ...{ class: "w-full" },
}));
const __VLS_298 = __VLS_297({
    modelValue: (__VLS_ctx.form.field),
    filterable: true,
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_297));
__VLS_299.slots.default;
for (const [field] of __VLS_getVForSourceType((__VLS_ctx.fieldPool))) {
    const __VLS_300 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_301 = __VLS_asFunctionalComponent(__VLS_300, new __VLS_300({
        key: (field),
        label: (field),
        value: (field),
    }));
    const __VLS_302 = __VLS_301({
        key: (field),
        label: (field),
        value: (field),
    }, ...__VLS_functionalComponentArgsRest(__VLS_301));
}
var __VLS_299;
var __VLS_295;
const __VLS_304 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_305 = __VLS_asFunctionalComponent(__VLS_304, new __VLS_304({
    label: "脱敏方式",
}));
const __VLS_306 = __VLS_305({
    label: "脱敏方式",
}, ...__VLS_functionalComponentArgsRest(__VLS_305));
__VLS_307.slots.default;
const __VLS_308 = {}.ElRadioGroup;
/** @type {[typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, ]} */ ;
// @ts-ignore
const __VLS_309 = __VLS_asFunctionalComponent(__VLS_308, new __VLS_308({
    modelValue: (__VLS_ctx.form.method),
}));
const __VLS_310 = __VLS_309({
    modelValue: (__VLS_ctx.form.method),
}, ...__VLS_functionalComponentArgsRest(__VLS_309));
__VLS_311.slots.default;
const __VLS_312 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
const __VLS_313 = __VLS_asFunctionalComponent(__VLS_312, new __VLS_312({
    value: "替换",
}));
const __VLS_314 = __VLS_313({
    value: "替换",
}, ...__VLS_functionalComponentArgsRest(__VLS_313));
const __VLS_316 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
const __VLS_317 = __VLS_asFunctionalComponent(__VLS_316, new __VLS_316({
    value: "掩码",
}));
const __VLS_318 = __VLS_317({
    value: "掩码",
}, ...__VLS_functionalComponentArgsRest(__VLS_317));
const __VLS_320 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
const __VLS_321 = __VLS_asFunctionalComponent(__VLS_320, new __VLS_320({
    value: "哈希",
}));
const __VLS_322 = __VLS_321({
    value: "哈希",
}, ...__VLS_functionalComponentArgsRest(__VLS_321));
var __VLS_311;
var __VLS_307;
const __VLS_324 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_325 = __VLS_asFunctionalComponent(__VLS_324, new __VLS_324({
    label: "保留格式",
}));
const __VLS_326 = __VLS_325({
    label: "保留格式",
}, ...__VLS_functionalComponentArgsRest(__VLS_325));
__VLS_327.slots.default;
const __VLS_328 = {}.ElSwitch;
/** @type {[typeof __VLS_components.ElSwitch, typeof __VLS_components.elSwitch, ]} */ ;
// @ts-ignore
const __VLS_329 = __VLS_asFunctionalComponent(__VLS_328, new __VLS_328({
    modelValue: (__VLS_ctx.form.preserveFormat),
    activeText: "启用",
    inactiveText: "关闭",
}));
const __VLS_330 = __VLS_329({
    modelValue: (__VLS_ctx.form.preserveFormat),
    activeText: "启用",
    inactiveText: "关闭",
}, ...__VLS_functionalComponentArgsRest(__VLS_329));
var __VLS_327;
const __VLS_332 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_333 = __VLS_asFunctionalComponent(__VLS_332, new __VLS_332({
    label: "脱敏场景",
}));
const __VLS_334 = __VLS_333({
    label: "脱敏场景",
}, ...__VLS_functionalComponentArgsRest(__VLS_333));
__VLS_335.slots.default;
const __VLS_336 = {}.ElRadioGroup;
/** @type {[typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, ]} */ ;
// @ts-ignore
const __VLS_337 = __VLS_asFunctionalComponent(__VLS_336, new __VLS_336({
    modelValue: (__VLS_ctx.form.scope),
}));
const __VLS_338 = __VLS_337({
    modelValue: (__VLS_ctx.form.scope),
}, ...__VLS_functionalComponentArgsRest(__VLS_337));
__VLS_339.slots.default;
const __VLS_340 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
const __VLS_341 = __VLS_asFunctionalComponent(__VLS_340, new __VLS_340({
    value: "查询实时脱敏",
}));
const __VLS_342 = __VLS_341({
    value: "查询实时脱敏",
}, ...__VLS_functionalComponentArgsRest(__VLS_341));
const __VLS_344 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
const __VLS_345 = __VLS_asFunctionalComponent(__VLS_344, new __VLS_344({
    value: "存储静态脱敏",
}));
const __VLS_346 = __VLS_345({
    value: "存储静态脱敏",
}, ...__VLS_functionalComponentArgsRest(__VLS_345));
var __VLS_339;
var __VLS_335;
var __VLS_283;
{
    const { footer: __VLS_thisSlot } = __VLS_279.slots;
    const __VLS_348 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_349 = __VLS_asFunctionalComponent(__VLS_348, new __VLS_348({
        ...{ 'onClick': {} },
    }));
    const __VLS_350 = __VLS_349({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_349));
    let __VLS_352;
    let __VLS_353;
    let __VLS_354;
    const __VLS_355 = {
        onClick: (...[$event]) => {
            __VLS_ctx.editorVisible = false;
        }
    };
    __VLS_351.slots.default;
    var __VLS_351;
    const __VLS_356 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_357 = __VLS_asFunctionalComponent(__VLS_356, new __VLS_356({
        ...{ 'onClick': {} },
        type: "danger",
    }));
    const __VLS_358 = __VLS_357({
        ...{ 'onClick': {} },
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_357));
    let __VLS_360;
    let __VLS_361;
    let __VLS_362;
    const __VLS_363 = {
        onClick: (__VLS_ctx.saveForm)
    };
    __VLS_359.slots.default;
    var __VLS_359;
}
var __VLS_279;
/** @type {__VLS_StyleScopedClasses['standard-page']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['toolbar-row']} */ ;
/** @type {__VLS_StyleScopedClasses['search-input']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-select']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-select']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-12']} */ ;
/** @type {__VLS_StyleScopedClasses['mask-sample-before']} */ ;
/** @type {__VLS_StyleScopedClasses['dep-text']} */ ;
/** @type {__VLS_StyleScopedClasses['mask-sample-after']} */ ;
/** @type {__VLS_StyleScopedClasses['pager']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['key-item']} */ ;
/** @type {__VLS_StyleScopedClasses['key-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['key-info']} */ ;
/** @type {__VLS_StyleScopedClasses['key-name']} */ ;
/** @type {__VLS_StyleScopedClasses['key-desc']} */ ;
/** @type {__VLS_StyleScopedClasses['maintain-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-12']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Key: Key,
            Plus: Plus,
            Search: Search,
            keyword: keyword,
            filterMethod: filterMethod,
            filterStatus: filterStatus,
            currentPage: currentPage,
            pageSize: pageSize,
            editorVisible: editorVisible,
            editing: editing,
            fieldPool: fieldPool,
            methodTagType: methodTagType,
            ruleStatusTag: ruleStatusTag,
            transport: transport,
            storage: storage,
            keys: keys,
            form: form,
            filteredRules: filteredRules,
            pagedRules: pagedRules,
            changePage: changePage,
            openCreate: openCreate,
            openEdit: openEdit,
            saveForm: saveForm,
            versionHistory: versionHistory,
            onlineRule: onlineRule,
            manageCert: manageCert,
            rotateKey: rotateKey,
            createKey: createKey,
            destroyKey: destroyKey,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
