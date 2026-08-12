import { computed, reactive, ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { Plus, Search } from '@element-plus/icons-vue';
import { mockTenants } from '@/mock/security';
const tenantTypes = ['设计单位', '监理单位', '施工单位', '运营单位', '研究机构', '政府部门'];
const systemPool = ['票务系统', '客流系统', '设备系统', '建设系统'];
const keyword = ref('');
const filterType = ref('');
const filterStatus = ref('');
const currentPage = ref(1);
const pageSize = 20;
const editorVisible = ref(false);
const quotaVisible = ref(false);
const editing = ref(false);
const tenants = ref([...mockTenants]);
const form = reactive({
    name: '',
    type: '设计单位',
    owner: '',
    ldap: false,
    sso: false,
    systems: [],
    expireDate: '',
});
const quotaForm = reactive({
    storageQuota: 2048,
    taskConcurrency: 4,
    cpu: 8,
});
const filteredTenants = computed(() => tenants.value.filter((tenant) => {
    if (filterType.value && tenant.type !== filterType.value)
        return false;
    if (filterStatus.value && tenant.status !== filterStatus.value)
        return false;
    if (!keyword.value)
        return true;
    const kw = keyword.value.toLowerCase();
    return tenant.name.toLowerCase().includes(kw) || tenant.owner.toLowerCase().includes(kw);
}));
const pagedTenants = computed(() => {
    const start = (currentPage.value - 1) * pageSize;
    return filteredTenants.value.slice(start, start + pageSize);
});
const changePage = (page) => {
    currentPage.value = page;
};
watch([keyword, filterType, filterStatus], () => {
    currentPage.value = 1;
});
const openCreate = () => {
    editing.value = false;
    Object.assign(form, { name: '', type: '设计单位', owner: '', ldap: false, sso: false, systems: [], expireDate: '2027-12-31' });
    editorVisible.value = true;
};
const openEdit = (row) => {
    editing.value = true;
    Object.assign(form, {
        name: row.name,
        type: row.type,
        owner: row.owner,
        ldap: row.ldap,
        sso: row.sso,
        systems: [...row.systems],
        expireDate: row.expireDate,
    });
    editorVisible.value = true;
};
const saveForm = () => {
    if (!form.name.trim()) {
        ElMessage.warning('请输入租户名称');
        return;
    }
    if (editing.value) {
        ElMessage.success(`租户「${form.name}」已更新（Mock）`);
    }
    else {
        tenants.value.unshift({
            id: `t-mock-${Date.now()}`,
            name: form.name,
            type: form.type,
            status: '启用',
            ldap: form.ldap,
            sso: form.sso,
            storageQuota: 2048,
            storageUsed: 0,
            taskConcurrency: 4,
            owner: form.owner,
            expireDate: form.expireDate,
            createTime: new Date().toLocaleString('sv-SE').replace('T', ' '),
            systems: [...form.systems],
        });
        ElMessage.success('租户已新增（Mock）');
    }
    editorVisible.value = false;
};
const openQuota = (row) => {
    Object.assign(quotaForm, { storageQuota: row.storageQuota, taskConcurrency: row.taskConcurrency, cpu: row.taskConcurrency * 2 });
    quotaVisible.value = true;
};
const saveQuota = () => {
    quotaVisible.value = false;
    ElMessage.success('资源配额已更新（Mock）');
};
const toggleTenant = (row) => {
    row.status = row.status === '启用' ? '停用' : '启用';
    ElMessage.info(`租户「${row.name}」已${row.status}（Mock）`);
};
const removeTenant = (row) => {
    tenants.value = tenants.value.filter((item) => item.id !== row.id);
    ElMessage.success(`租户「${row.name}」已删除（Mock）`);
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
    const __VLS_4 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
        ...{ 'onClick': {} },
        type: "danger",
        icon: (__VLS_ctx.Plus),
    }));
    const __VLS_6 = __VLS_5({
        ...{ 'onClick': {} },
        type: "danger",
        icon: (__VLS_ctx.Plus),
    }, ...__VLS_functionalComponentArgsRest(__VLS_5));
    let __VLS_8;
    let __VLS_9;
    let __VLS_10;
    const __VLS_11 = {
        onClick: (__VLS_ctx.openCreate)
    };
    __VLS_7.slots.default;
    var __VLS_7;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "toolbar-row" },
});
const __VLS_12 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
    modelValue: (__VLS_ctx.keyword),
    placeholder: "按租户名称 / 负责人搜索",
    clearable: true,
    ...{ class: "search-input" },
    prefixIcon: (__VLS_ctx.Search),
}));
const __VLS_14 = __VLS_13({
    modelValue: (__VLS_ctx.keyword),
    placeholder: "按租户名称 / 负责人搜索",
    clearable: true,
    ...{ class: "search-input" },
    prefixIcon: (__VLS_ctx.Search),
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
const __VLS_16 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    modelValue: (__VLS_ctx.filterType),
    placeholder: "租户类型",
    clearable: true,
    ...{ class: "filter-select" },
}));
const __VLS_18 = __VLS_17({
    modelValue: (__VLS_ctx.filterType),
    placeholder: "租户类型",
    clearable: true,
    ...{ class: "filter-select" },
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
__VLS_19.slots.default;
for (const [type] of __VLS_getVForSourceType((__VLS_ctx.tenantTypes))) {
    const __VLS_20 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
        key: (type),
        label: (type),
        value: (type),
    }));
    const __VLS_22 = __VLS_21({
        key: (type),
        label: (type),
        value: (type),
    }, ...__VLS_functionalComponentArgsRest(__VLS_21));
}
var __VLS_19;
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
    label: "启用",
    value: "启用",
}));
const __VLS_30 = __VLS_29({
    label: "启用",
    value: "启用",
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
const __VLS_32 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
    label: "停用",
    value: "停用",
}));
const __VLS_34 = __VLS_33({
    label: "停用",
    value: "停用",
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
var __VLS_27;
const __VLS_36 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    data: (__VLS_ctx.pagedTenants),
    stripe: true,
    ...{ class: "mt-12" },
}));
const __VLS_38 = __VLS_37({
    data: (__VLS_ctx.pagedTenants),
    stripe: true,
    ...{ class: "mt-12" },
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
__VLS_39.slots.default;
const __VLS_40 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
    prop: "name",
    label: "租户名称",
    minWidth: "170",
}));
const __VLS_42 = __VLS_41({
    prop: "name",
    label: "租户名称",
    minWidth: "170",
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
const __VLS_44 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    prop: "type",
    label: "类型",
    width: "110",
}));
const __VLS_46 = __VLS_45({
    prop: "type",
    label: "类型",
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
    (row.type);
    var __VLS_51;
}
var __VLS_47;
const __VLS_52 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
    label: "状态",
    width: "90",
}));
const __VLS_54 = __VLS_53({
    label: "状态",
    width: "90",
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
__VLS_55.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_55.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_56 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
        type: (row.status === '启用' ? 'success' : 'info'),
        effect: "dark",
    }));
    const __VLS_58 = __VLS_57({
        type: (row.status === '启用' ? 'success' : 'info'),
        effect: "dark",
    }, ...__VLS_functionalComponentArgsRest(__VLS_57));
    __VLS_59.slots.default;
    (row.status);
    var __VLS_59;
}
var __VLS_55;
const __VLS_60 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
    label: "账号对接",
    width: "140",
}));
const __VLS_62 = __VLS_61({
    label: "账号对接",
    width: "140",
}, ...__VLS_functionalComponentArgsRest(__VLS_61));
__VLS_63.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_63.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    if (row.ldap) {
        const __VLS_64 = {}.ElTag;
        /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
        // @ts-ignore
        const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
            size: "small",
            effect: "plain",
            ...{ class: "mr-4" },
        }));
        const __VLS_66 = __VLS_65({
            size: "small",
            effect: "plain",
            ...{ class: "mr-4" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_65));
        __VLS_67.slots.default;
        var __VLS_67;
    }
    if (row.sso) {
        const __VLS_68 = {}.ElTag;
        /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
        // @ts-ignore
        const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
            size: "small",
            type: "primary",
            effect: "plain",
        }));
        const __VLS_70 = __VLS_69({
            size: "small",
            type: "primary",
            effect: "plain",
        }, ...__VLS_functionalComponentArgsRest(__VLS_69));
        __VLS_71.slots.default;
        var __VLS_71;
    }
    if (!row.ldap && !row.sso) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "dep-text" },
        });
    }
}
var __VLS_63;
const __VLS_72 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
    label: "资源配额",
    minWidth: "200",
}));
const __VLS_74 = __VLS_73({
    label: "资源配额",
    minWidth: "200",
}, ...__VLS_functionalComponentArgsRest(__VLS_73));
__VLS_75.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_75.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_76 = {}.ElProgress;
    /** @type {[typeof __VLS_components.ElProgress, typeof __VLS_components.elProgress, ]} */ ;
    // @ts-ignore
    const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
        percentage: (Math.round((row.storageUsed / row.storageQuota) * 100)),
        color: (row.storageUsed / row.storageQuota > 0.8 ? '#E34D59' : '#2B6CB0'),
        strokeWidth: (8),
        format: (() => `${(row.storageUsed / 1024).toFixed(1)} / ${row.storageQuota / 1024} GB`),
    }));
    const __VLS_78 = __VLS_77({
        percentage: (Math.round((row.storageUsed / row.storageQuota) * 100)),
        color: (row.storageUsed / row.storageQuota > 0.8 ? '#E34D59' : '#2B6CB0'),
        strokeWidth: (8),
        format: (() => `${(row.storageUsed / 1024).toFixed(1)} / ${row.storageQuota / 1024} GB`),
    }, ...__VLS_functionalComponentArgsRest(__VLS_77));
}
var __VLS_75;
const __VLS_80 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
    label: "任务并发",
    width: "90",
    align: "center",
}));
const __VLS_82 = __VLS_81({
    label: "任务并发",
    width: "90",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_81));
__VLS_83.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_83.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    (row.taskConcurrency);
}
var __VLS_83;
const __VLS_84 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
    prop: "owner",
    label: "负责人",
    width: "80",
}));
const __VLS_86 = __VLS_85({
    prop: "owner",
    label: "负责人",
    width: "80",
}, ...__VLS_functionalComponentArgsRest(__VLS_85));
const __VLS_88 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
    prop: "createTime",
    label: "创建时间",
    width: "150",
}));
const __VLS_90 = __VLS_89({
    prop: "createTime",
    label: "创建时间",
    width: "150",
}, ...__VLS_functionalComponentArgsRest(__VLS_89));
const __VLS_92 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
    label: "操作",
    width: "220",
    fixed: "right",
}));
const __VLS_94 = __VLS_93({
    label: "操作",
    width: "220",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_93));
__VLS_95.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_95.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
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
            __VLS_ctx.openEdit(row);
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
        type: "warning",
    }));
    const __VLS_106 = __VLS_105({
        ...{ 'onClick': {} },
        link: true,
        type: "warning",
    }, ...__VLS_functionalComponentArgsRest(__VLS_105));
    let __VLS_108;
    let __VLS_109;
    let __VLS_110;
    const __VLS_111 = {
        onClick: (...[$event]) => {
            __VLS_ctx.openQuota(row);
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
        type: "success",
    }));
    const __VLS_114 = __VLS_113({
        ...{ 'onClick': {} },
        link: true,
        type: "success",
    }, ...__VLS_functionalComponentArgsRest(__VLS_113));
    let __VLS_116;
    let __VLS_117;
    let __VLS_118;
    const __VLS_119 = {
        onClick: (...[$event]) => {
            __VLS_ctx.toggleTenant(row);
        }
    };
    __VLS_115.slots.default;
    (row.status === '启用' ? '停用' : '启用');
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
            __VLS_ctx.removeTenant(row);
        }
    };
    __VLS_123.slots.default;
    var __VLS_123;
}
var __VLS_95;
var __VLS_39;
const __VLS_128 = {}.ElPagination;
/** @type {[typeof __VLS_components.ElPagination, typeof __VLS_components.elPagination, ]} */ ;
// @ts-ignore
const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({
    ...{ 'onCurrentChange': {} },
    ...{ class: "pager" },
    layout: "total, prev, pager, next",
    total: (__VLS_ctx.filteredTenants.length),
    pageSize: (__VLS_ctx.pageSize),
    currentPage: (__VLS_ctx.currentPage),
    background: true,
}));
const __VLS_130 = __VLS_129({
    ...{ 'onCurrentChange': {} },
    ...{ class: "pager" },
    layout: "total, prev, pager, next",
    total: (__VLS_ctx.filteredTenants.length),
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
var __VLS_3;
const __VLS_136 = {}.ElDrawer;
/** @type {[typeof __VLS_components.ElDrawer, typeof __VLS_components.elDrawer, typeof __VLS_components.ElDrawer, typeof __VLS_components.elDrawer, ]} */ ;
// @ts-ignore
const __VLS_137 = __VLS_asFunctionalComponent(__VLS_136, new __VLS_136({
    modelValue: (__VLS_ctx.editorVisible),
    title: (__VLS_ctx.editing ? '编辑租户' : '新增租户'),
    size: "520px",
}));
const __VLS_138 = __VLS_137({
    modelValue: (__VLS_ctx.editorVisible),
    title: (__VLS_ctx.editing ? '编辑租户' : '新增租户'),
    size: "520px",
}, ...__VLS_functionalComponentArgsRest(__VLS_137));
__VLS_139.slots.default;
const __VLS_140 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_141 = __VLS_asFunctionalComponent(__VLS_140, new __VLS_140({
    model: (__VLS_ctx.form),
    labelWidth: "100px",
}));
const __VLS_142 = __VLS_141({
    model: (__VLS_ctx.form),
    labelWidth: "100px",
}, ...__VLS_functionalComponentArgsRest(__VLS_141));
__VLS_143.slots.default;
const __VLS_144 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_145 = __VLS_asFunctionalComponent(__VLS_144, new __VLS_144({
    label: "租户名称",
}));
const __VLS_146 = __VLS_145({
    label: "租户名称",
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
    label: "租户类型",
}));
const __VLS_154 = __VLS_153({
    label: "租户类型",
}, ...__VLS_functionalComponentArgsRest(__VLS_153));
__VLS_155.slots.default;
const __VLS_156 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_157 = __VLS_asFunctionalComponent(__VLS_156, new __VLS_156({
    modelValue: (__VLS_ctx.form.type),
    ...{ class: "w-full" },
}));
const __VLS_158 = __VLS_157({
    modelValue: (__VLS_ctx.form.type),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_157));
__VLS_159.slots.default;
for (const [type] of __VLS_getVForSourceType((__VLS_ctx.tenantTypes))) {
    const __VLS_160 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_161 = __VLS_asFunctionalComponent(__VLS_160, new __VLS_160({
        key: (type),
        label: (type),
        value: (type),
    }));
    const __VLS_162 = __VLS_161({
        key: (type),
        label: (type),
        value: (type),
    }, ...__VLS_functionalComponentArgsRest(__VLS_161));
}
var __VLS_159;
var __VLS_155;
const __VLS_164 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_165 = __VLS_asFunctionalComponent(__VLS_164, new __VLS_164({
    label: "负责人",
}));
const __VLS_166 = __VLS_165({
    label: "负责人",
}, ...__VLS_functionalComponentArgsRest(__VLS_165));
__VLS_167.slots.default;
const __VLS_168 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_169 = __VLS_asFunctionalComponent(__VLS_168, new __VLS_168({
    modelValue: (__VLS_ctx.form.owner),
}));
const __VLS_170 = __VLS_169({
    modelValue: (__VLS_ctx.form.owner),
}, ...__VLS_functionalComponentArgsRest(__VLS_169));
var __VLS_167;
const __VLS_172 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_173 = __VLS_asFunctionalComponent(__VLS_172, new __VLS_172({
    label: "账号对接",
}));
const __VLS_174 = __VLS_173({
    label: "账号对接",
}, ...__VLS_functionalComponentArgsRest(__VLS_173));
__VLS_175.slots.default;
const __VLS_176 = {}.ElCheckbox;
/** @type {[typeof __VLS_components.ElCheckbox, typeof __VLS_components.elCheckbox, typeof __VLS_components.ElCheckbox, typeof __VLS_components.elCheckbox, ]} */ ;
// @ts-ignore
const __VLS_177 = __VLS_asFunctionalComponent(__VLS_176, new __VLS_176({
    modelValue: (__VLS_ctx.form.ldap),
}));
const __VLS_178 = __VLS_177({
    modelValue: (__VLS_ctx.form.ldap),
}, ...__VLS_functionalComponentArgsRest(__VLS_177));
__VLS_179.slots.default;
var __VLS_179;
const __VLS_180 = {}.ElCheckbox;
/** @type {[typeof __VLS_components.ElCheckbox, typeof __VLS_components.elCheckbox, typeof __VLS_components.ElCheckbox, typeof __VLS_components.elCheckbox, ]} */ ;
// @ts-ignore
const __VLS_181 = __VLS_asFunctionalComponent(__VLS_180, new __VLS_180({
    modelValue: (__VLS_ctx.form.sso),
}));
const __VLS_182 = __VLS_181({
    modelValue: (__VLS_ctx.form.sso),
}, ...__VLS_functionalComponentArgsRest(__VLS_181));
__VLS_183.slots.default;
var __VLS_183;
var __VLS_175;
const __VLS_184 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_185 = __VLS_asFunctionalComponent(__VLS_184, new __VLS_184({
    label: "接入系统",
}));
const __VLS_186 = __VLS_185({
    label: "接入系统",
}, ...__VLS_functionalComponentArgsRest(__VLS_185));
__VLS_187.slots.default;
const __VLS_188 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_189 = __VLS_asFunctionalComponent(__VLS_188, new __VLS_188({
    modelValue: (__VLS_ctx.form.systems),
    multiple: true,
    ...{ class: "w-full" },
}));
const __VLS_190 = __VLS_189({
    modelValue: (__VLS_ctx.form.systems),
    multiple: true,
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_189));
__VLS_191.slots.default;
for (const [system] of __VLS_getVForSourceType((__VLS_ctx.systemPool))) {
    const __VLS_192 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_193 = __VLS_asFunctionalComponent(__VLS_192, new __VLS_192({
        key: (system),
        label: (system),
        value: (system),
    }));
    const __VLS_194 = __VLS_193({
        key: (system),
        label: (system),
        value: (system),
    }, ...__VLS_functionalComponentArgsRest(__VLS_193));
}
var __VLS_191;
var __VLS_187;
const __VLS_196 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_197 = __VLS_asFunctionalComponent(__VLS_196, new __VLS_196({
    label: "有效期至",
}));
const __VLS_198 = __VLS_197({
    label: "有效期至",
}, ...__VLS_functionalComponentArgsRest(__VLS_197));
__VLS_199.slots.default;
const __VLS_200 = {}.ElDatePicker;
/** @type {[typeof __VLS_components.ElDatePicker, typeof __VLS_components.elDatePicker, ]} */ ;
// @ts-ignore
const __VLS_201 = __VLS_asFunctionalComponent(__VLS_200, new __VLS_200({
    modelValue: (__VLS_ctx.form.expireDate),
    type: "date",
    valueFormat: "YYYY-MM-DD",
    ...{ class: "w-full" },
}));
const __VLS_202 = __VLS_201({
    modelValue: (__VLS_ctx.form.expireDate),
    type: "date",
    valueFormat: "YYYY-MM-DD",
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_201));
var __VLS_199;
var __VLS_143;
{
    const { footer: __VLS_thisSlot } = __VLS_139.slots;
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
var __VLS_139;
const __VLS_220 = {}.ElDrawer;
/** @type {[typeof __VLS_components.ElDrawer, typeof __VLS_components.elDrawer, typeof __VLS_components.ElDrawer, typeof __VLS_components.elDrawer, ]} */ ;
// @ts-ignore
const __VLS_221 = __VLS_asFunctionalComponent(__VLS_220, new __VLS_220({
    modelValue: (__VLS_ctx.quotaVisible),
    title: "资源配额管理",
    size: "460px",
}));
const __VLS_222 = __VLS_221({
    modelValue: (__VLS_ctx.quotaVisible),
    title: "资源配额管理",
    size: "460px",
}, ...__VLS_functionalComponentArgsRest(__VLS_221));
__VLS_223.slots.default;
const __VLS_224 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_225 = __VLS_asFunctionalComponent(__VLS_224, new __VLS_224({
    model: (__VLS_ctx.quotaForm),
    labelWidth: "110px",
}));
const __VLS_226 = __VLS_225({
    model: (__VLS_ctx.quotaForm),
    labelWidth: "110px",
}, ...__VLS_functionalComponentArgsRest(__VLS_225));
__VLS_227.slots.default;
const __VLS_228 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_229 = __VLS_asFunctionalComponent(__VLS_228, new __VLS_228({
    label: "存储配额",
}));
const __VLS_230 = __VLS_229({
    label: "存储配额",
}, ...__VLS_functionalComponentArgsRest(__VLS_229));
__VLS_231.slots.default;
const __VLS_232 = {}.ElInputNumber;
/** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
// @ts-ignore
const __VLS_233 = __VLS_asFunctionalComponent(__VLS_232, new __VLS_232({
    modelValue: (__VLS_ctx.quotaForm.storageQuota),
    min: (64),
    max: (8192),
    step: (64),
}));
const __VLS_234 = __VLS_233({
    modelValue: (__VLS_ctx.quotaForm.storageQuota),
    min: (64),
    max: (8192),
    step: (64),
}, ...__VLS_functionalComponentArgsRest(__VLS_233));
var __VLS_231;
const __VLS_236 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_237 = __VLS_asFunctionalComponent(__VLS_236, new __VLS_236({
    label: "任务并发数",
}));
const __VLS_238 = __VLS_237({
    label: "任务并发数",
}, ...__VLS_functionalComponentArgsRest(__VLS_237));
__VLS_239.slots.default;
const __VLS_240 = {}.ElInputNumber;
/** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
// @ts-ignore
const __VLS_241 = __VLS_asFunctionalComponent(__VLS_240, new __VLS_240({
    modelValue: (__VLS_ctx.quotaForm.taskConcurrency),
    min: (1),
    max: (32),
    step: (1),
}));
const __VLS_242 = __VLS_241({
    modelValue: (__VLS_ctx.quotaForm.taskConcurrency),
    min: (1),
    max: (32),
    step: (1),
}, ...__VLS_functionalComponentArgsRest(__VLS_241));
var __VLS_239;
const __VLS_244 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_245 = __VLS_asFunctionalComponent(__VLS_244, new __VLS_244({
    label: "计算资源",
}));
const __VLS_246 = __VLS_245({
    label: "计算资源",
}, ...__VLS_functionalComponentArgsRest(__VLS_245));
__VLS_247.slots.default;
const __VLS_248 = {}.ElInputNumber;
/** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
// @ts-ignore
const __VLS_249 = __VLS_asFunctionalComponent(__VLS_248, new __VLS_248({
    modelValue: (__VLS_ctx.quotaForm.cpu),
    min: (1),
    max: (64),
    step: (1),
}));
const __VLS_250 = __VLS_249({
    modelValue: (__VLS_ctx.quotaForm.cpu),
    min: (1),
    max: (64),
    step: (1),
}, ...__VLS_functionalComponentArgsRest(__VLS_249));
var __VLS_247;
var __VLS_227;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "section-title mt-8" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "dep-text" },
});
{
    const { footer: __VLS_thisSlot } = __VLS_223.slots;
    const __VLS_252 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_253 = __VLS_asFunctionalComponent(__VLS_252, new __VLS_252({
        ...{ 'onClick': {} },
    }));
    const __VLS_254 = __VLS_253({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_253));
    let __VLS_256;
    let __VLS_257;
    let __VLS_258;
    const __VLS_259 = {
        onClick: (...[$event]) => {
            __VLS_ctx.quotaVisible = false;
        }
    };
    __VLS_255.slots.default;
    var __VLS_255;
    const __VLS_260 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_261 = __VLS_asFunctionalComponent(__VLS_260, new __VLS_260({
        ...{ 'onClick': {} },
        type: "danger",
    }));
    const __VLS_262 = __VLS_261({
        ...{ 'onClick': {} },
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_261));
    let __VLS_264;
    let __VLS_265;
    let __VLS_266;
    const __VLS_267 = {
        onClick: (__VLS_ctx.saveQuota)
    };
    __VLS_263.slots.default;
    var __VLS_263;
}
var __VLS_223;
/** @type {__VLS_StyleScopedClasses['standard-page']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['toolbar-row']} */ ;
/** @type {__VLS_StyleScopedClasses['search-input']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-select']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-select']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-12']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
/** @type {__VLS_StyleScopedClasses['dep-text']} */ ;
/** @type {__VLS_StyleScopedClasses['pager']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
/** @type {__VLS_StyleScopedClasses['dep-text']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Plus: Plus,
            Search: Search,
            tenantTypes: tenantTypes,
            systemPool: systemPool,
            keyword: keyword,
            filterType: filterType,
            filterStatus: filterStatus,
            currentPage: currentPage,
            pageSize: pageSize,
            editorVisible: editorVisible,
            quotaVisible: quotaVisible,
            editing: editing,
            form: form,
            quotaForm: quotaForm,
            filteredTenants: filteredTenants,
            pagedTenants: pagedTenants,
            changePage: changePage,
            openCreate: openCreate,
            openEdit: openEdit,
            saveForm: saveForm,
            openQuota: openQuota,
            saveQuota: saveQuota,
            toggleTenant: toggleTenant,
            removeTenant: removeTenant,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
