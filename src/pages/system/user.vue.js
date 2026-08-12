import { computed, reactive, ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { Download, Plus, Search, Upload } from '@element-plus/icons-vue';
import { loginRecords, mockUsers, passwordPolicy as mockPolicy } from '@/mock/system';
const keyword = ref('');
const filterTenant = ref('');
const filterStatus = ref('');
const currentPage = ref(1);
const pageSize = 20;
const editorVisible = ref(false);
const loginVisible = ref(false);
const policyVisible = ref(false);
const editing = ref(false);
const users = ref([...mockUsers]);
const currentUser = ref(null);
const tenantPool = ['广州地铁设计研究院', '轨道运营管理公司', '广州盾构工程公司', '市交通运输局', '华南理工大学课题组'];
const deptPool = ['信息中心', '数据治理部', '业务运营部', '综合管理部'];
const rolePool = ['系统管理员', '数据治理员', '数据开发', '只读用户'];
const roleTagType = {
    系统管理员: 'danger',
    数据治理员: 'primary',
    数据开发: 'warning',
    只读用户: 'info',
};
const passwordPolicy = reactive({ ...mockPolicy });
const form = reactive({
    username: '',
    realName: '',
    dept: '信息中心',
    tenant: tenantPool[0],
    roles: [],
    phone: '',
    sso: false,
    ldap: false,
});
const filteredUsers = computed(() => users.value.filter((user) => {
    if (filterTenant.value && user.tenant !== filterTenant.value)
        return false;
    if (filterStatus.value && user.status !== filterStatus.value)
        return false;
    if (!keyword.value)
        return true;
    const kw = keyword.value.toLowerCase();
    return (user.username.toLowerCase().includes(kw) ||
        user.realName.toLowerCase().includes(kw) ||
        user.phone.toLowerCase().includes(kw));
}));
const pagedUsers = computed(() => {
    const start = (currentPage.value - 1) * pageSize;
    return filteredUsers.value.slice(start, start + pageSize);
});
const changePage = (page) => (currentPage.value = page);
watch([keyword, filterTenant, filterStatus], () => {
    currentPage.value = 1;
});
const openCreate = () => {
    editing.value = false;
    Object.assign(form, { username: '', realName: '', dept: '信息中心', tenant: tenantPool[0], roles: [], phone: '', sso: false, ldap: false });
    editorVisible.value = true;
};
const openEdit = (row) => {
    editing.value = true;
    Object.assign(form, {
        username: row.username,
        realName: row.realName,
        dept: row.dept,
        tenant: row.tenant,
        roles: [...row.roles],
        phone: row.phone,
        sso: row.sso,
        ldap: row.ldap,
    });
    editorVisible.value = true;
};
const saveForm = () => {
    if (!form.username.trim() || !form.realName.trim()) {
        ElMessage.warning('请输入用户名和姓名');
        return;
    }
    if (editing.value) {
        ElMessage.success(`用户「${form.username}」已更新（Mock）`);
    }
    else {
        users.value.unshift({
            id: `usr-mock-${Date.now()}`,
            username: form.username,
            realName: form.realName,
            dept: form.dept,
            tenant: form.tenant,
            roles: [...form.roles],
            status: '启用',
            sso: form.sso,
            ldap: form.ldap,
            phone: form.phone,
            lastLoginTime: '—',
            lastLoginIp: '—',
            createTime: new Date().toLocaleString('sv-SE').replace('T', ' '),
            pwdExpireDays: passwordPolicy.expireDays,
        });
        ElMessage.success('用户已新增（Mock）');
    }
    editorVisible.value = false;
};
const toggleUser = (row) => {
    row.status = row.status === '启用' ? '停用' : '启用';
    ElMessage.info(`用户「${row.username}」已${row.status}（Mock）`);
};
const removeUser = (row) => {
    users.value = users.value.filter((item) => item.id !== row.id);
    ElMessage.success(`用户「${row.username}」已删除（Mock）`);
};
const openLoginRecord = (row) => {
    currentUser.value = row;
    loginVisible.value = true;
};
const importUsers = () => ElMessage.success('批量导入模板已下载，请按模板填写后上传（Mock）');
const exportUsers = () => ElMessage.success('用户列表已导出为 Excel（Mock）');
const savePolicy = () => {
    policyVisible.value = false;
    ElMessage.success('密码策略已保存并即时生效（Mock）');
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
        icon: (__VLS_ctx.Upload),
    }));
    const __VLS_6 = __VLS_5({
        ...{ 'onClick': {} },
        icon: (__VLS_ctx.Upload),
    }, ...__VLS_functionalComponentArgsRest(__VLS_5));
    let __VLS_8;
    let __VLS_9;
    let __VLS_10;
    const __VLS_11 = {
        onClick: (__VLS_ctx.importUsers)
    };
    __VLS_7.slots.default;
    var __VLS_7;
    const __VLS_12 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
        ...{ 'onClick': {} },
        icon: (__VLS_ctx.Download),
    }));
    const __VLS_14 = __VLS_13({
        ...{ 'onClick': {} },
        icon: (__VLS_ctx.Download),
    }, ...__VLS_functionalComponentArgsRest(__VLS_13));
    let __VLS_16;
    let __VLS_17;
    let __VLS_18;
    const __VLS_19 = {
        onClick: (__VLS_ctx.exportUsers)
    };
    __VLS_15.slots.default;
    var __VLS_15;
    const __VLS_20 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
        ...{ 'onClick': {} },
        type: "danger",
        icon: (__VLS_ctx.Plus),
    }));
    const __VLS_22 = __VLS_21({
        ...{ 'onClick': {} },
        type: "danger",
        icon: (__VLS_ctx.Plus),
    }, ...__VLS_functionalComponentArgsRest(__VLS_21));
    let __VLS_24;
    let __VLS_25;
    let __VLS_26;
    const __VLS_27 = {
        onClick: (__VLS_ctx.openCreate)
    };
    __VLS_23.slots.default;
    var __VLS_23;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "toolbar-row" },
});
const __VLS_28 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
    modelValue: (__VLS_ctx.keyword),
    placeholder: "按用户名 / 姓名 / 手机号搜索",
    clearable: true,
    ...{ class: "search-input" },
    prefixIcon: (__VLS_ctx.Search),
}));
const __VLS_30 = __VLS_29({
    modelValue: (__VLS_ctx.keyword),
    placeholder: "按用户名 / 姓名 / 手机号搜索",
    clearable: true,
    ...{ class: "search-input" },
    prefixIcon: (__VLS_ctx.Search),
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
const __VLS_32 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
    modelValue: (__VLS_ctx.filterTenant),
    placeholder: "所属租户",
    clearable: true,
    ...{ class: "filter-select" },
}));
const __VLS_34 = __VLS_33({
    modelValue: (__VLS_ctx.filterTenant),
    placeholder: "所属租户",
    clearable: true,
    ...{ class: "filter-select" },
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
__VLS_35.slots.default;
for (const [tenant] of __VLS_getVForSourceType((__VLS_ctx.tenantPool))) {
    const __VLS_36 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
        key: (tenant),
        label: (tenant),
        value: (tenant),
    }));
    const __VLS_38 = __VLS_37({
        key: (tenant),
        label: (tenant),
        value: (tenant),
    }, ...__VLS_functionalComponentArgsRest(__VLS_37));
}
var __VLS_35;
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
    label: "启用",
    value: "启用",
}));
const __VLS_46 = __VLS_45({
    label: "启用",
    value: "启用",
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
const __VLS_48 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
    label: "停用",
    value: "停用",
}));
const __VLS_50 = __VLS_49({
    label: "停用",
    value: "停用",
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
var __VLS_43;
const __VLS_52 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
    data: (__VLS_ctx.pagedUsers),
    stripe: true,
    ...{ class: "mt-12" },
}));
const __VLS_54 = __VLS_53({
    data: (__VLS_ctx.pagedUsers),
    stripe: true,
    ...{ class: "mt-12" },
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
__VLS_55.slots.default;
const __VLS_56 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
    prop: "username",
    label: "用户名",
    width: "110",
}));
const __VLS_58 = __VLS_57({
    prop: "username",
    label: "用户名",
    width: "110",
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
__VLS_59.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_59.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "policy-subject" },
    });
    (row.username);
}
var __VLS_59;
const __VLS_60 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
    prop: "realName",
    label: "姓名",
    width: "80",
}));
const __VLS_62 = __VLS_61({
    prop: "realName",
    label: "姓名",
    width: "80",
}, ...__VLS_functionalComponentArgsRest(__VLS_61));
const __VLS_64 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
    prop: "dept",
    label: "部门",
    width: "100",
}));
const __VLS_66 = __VLS_65({
    prop: "dept",
    label: "部门",
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_65));
const __VLS_68 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
    prop: "tenant",
    label: "所属租户",
    minWidth: "150",
}));
const __VLS_70 = __VLS_69({
    prop: "tenant",
    label: "所属租户",
    minWidth: "150",
}, ...__VLS_functionalComponentArgsRest(__VLS_69));
const __VLS_72 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
    label: "角色",
    minWidth: "140",
}));
const __VLS_74 = __VLS_73({
    label: "角色",
    minWidth: "140",
}, ...__VLS_functionalComponentArgsRest(__VLS_73));
__VLS_75.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_75.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    for (const [role] of __VLS_getVForSourceType((row.roles))) {
        const __VLS_76 = {}.ElTag;
        /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
        // @ts-ignore
        const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
            key: (role),
            size: "small",
            type: (__VLS_ctx.roleTagType[role]),
            effect: "plain",
            ...{ class: "mr-4" },
        }));
        const __VLS_78 = __VLS_77({
            key: (role),
            size: "small",
            type: (__VLS_ctx.roleTagType[role]),
            effect: "plain",
            ...{ class: "mr-4" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_77));
        __VLS_79.slots.default;
        (role);
        var __VLS_79;
    }
}
var __VLS_75;
const __VLS_80 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
    label: "状态",
    width: "80",
}));
const __VLS_82 = __VLS_81({
    label: "状态",
    width: "80",
}, ...__VLS_functionalComponentArgsRest(__VLS_81));
__VLS_83.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_83.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_84 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
        type: (row.status === '启用' ? 'success' : 'info'),
        effect: "dark",
        size: "small",
    }));
    const __VLS_86 = __VLS_85({
        type: (row.status === '启用' ? 'success' : 'info'),
        effect: "dark",
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_85));
    __VLS_87.slots.default;
    (row.status);
    var __VLS_87;
}
var __VLS_83;
const __VLS_88 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
    label: "账号对接",
    width: "130",
}));
const __VLS_90 = __VLS_89({
    label: "账号对接",
    width: "130",
}, ...__VLS_functionalComponentArgsRest(__VLS_89));
__VLS_91.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_91.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    if (row.sso) {
        const __VLS_92 = {}.ElTag;
        /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
        // @ts-ignore
        const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
            size: "small",
            type: "primary",
            effect: "plain",
            ...{ class: "mr-4" },
        }));
        const __VLS_94 = __VLS_93({
            size: "small",
            type: "primary",
            effect: "plain",
            ...{ class: "mr-4" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_93));
        __VLS_95.slots.default;
        var __VLS_95;
    }
    if (row.ldap) {
        const __VLS_96 = {}.ElTag;
        /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
        // @ts-ignore
        const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
            size: "small",
            effect: "plain",
        }));
        const __VLS_98 = __VLS_97({
            size: "small",
            effect: "plain",
        }, ...__VLS_functionalComponentArgsRest(__VLS_97));
        __VLS_99.slots.default;
        var __VLS_99;
    }
    if (!row.sso && !row.ldap) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "dep-text" },
        });
    }
}
var __VLS_91;
const __VLS_100 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
    label: "最近登录",
    width: "160",
}));
const __VLS_102 = __VLS_101({
    label: "最近登录",
    width: "160",
}, ...__VLS_functionalComponentArgsRest(__VLS_101));
__VLS_103.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_103.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    (row.lastLoginTime);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "dep-text" },
    });
    (row.lastLoginIp);
}
var __VLS_103;
const __VLS_104 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
    label: "操作",
    width: "240",
    fixed: "right",
}));
const __VLS_106 = __VLS_105({
    label: "操作",
    width: "240",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_105));
__VLS_107.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_107.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
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
            __VLS_ctx.openLoginRecord(row);
        }
    };
    __VLS_119.slots.default;
    var __VLS_119;
    const __VLS_124 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({
        ...{ 'onClick': {} },
        link: true,
        type: "success",
    }));
    const __VLS_126 = __VLS_125({
        ...{ 'onClick': {} },
        link: true,
        type: "success",
    }, ...__VLS_functionalComponentArgsRest(__VLS_125));
    let __VLS_128;
    let __VLS_129;
    let __VLS_130;
    const __VLS_131 = {
        onClick: (...[$event]) => {
            __VLS_ctx.toggleUser(row);
        }
    };
    __VLS_127.slots.default;
    (row.status === '启用' ? '停用' : '启用');
    var __VLS_127;
    const __VLS_132 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132({
        ...{ 'onClick': {} },
        link: true,
        type: "danger",
    }));
    const __VLS_134 = __VLS_133({
        ...{ 'onClick': {} },
        link: true,
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_133));
    let __VLS_136;
    let __VLS_137;
    let __VLS_138;
    const __VLS_139 = {
        onClick: (...[$event]) => {
            __VLS_ctx.removeUser(row);
        }
    };
    __VLS_135.slots.default;
    var __VLS_135;
}
var __VLS_107;
var __VLS_55;
const __VLS_140 = {}.ElPagination;
/** @type {[typeof __VLS_components.ElPagination, typeof __VLS_components.elPagination, ]} */ ;
// @ts-ignore
const __VLS_141 = __VLS_asFunctionalComponent(__VLS_140, new __VLS_140({
    ...{ 'onCurrentChange': {} },
    ...{ class: "pager" },
    layout: "total, prev, pager, next",
    total: (__VLS_ctx.filteredUsers.length),
    pageSize: (__VLS_ctx.pageSize),
    currentPage: (__VLS_ctx.currentPage),
    background: true,
}));
const __VLS_142 = __VLS_141({
    ...{ 'onCurrentChange': {} },
    ...{ class: "pager" },
    layout: "total, prev, pager, next",
    total: (__VLS_ctx.filteredUsers.length),
    pageSize: (__VLS_ctx.pageSize),
    currentPage: (__VLS_ctx.currentPage),
    background: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_141));
let __VLS_144;
let __VLS_145;
let __VLS_146;
const __VLS_147 = {
    onCurrentChange: (__VLS_ctx.changePage)
};
var __VLS_143;
var __VLS_3;
const __VLS_148 = {}.ElDrawer;
/** @type {[typeof __VLS_components.ElDrawer, typeof __VLS_components.elDrawer, typeof __VLS_components.ElDrawer, typeof __VLS_components.elDrawer, ]} */ ;
// @ts-ignore
const __VLS_149 = __VLS_asFunctionalComponent(__VLS_148, new __VLS_148({
    modelValue: (__VLS_ctx.editorVisible),
    title: (__VLS_ctx.editing ? '编辑用户' : '新增用户'),
    size: "540px",
}));
const __VLS_150 = __VLS_149({
    modelValue: (__VLS_ctx.editorVisible),
    title: (__VLS_ctx.editing ? '编辑用户' : '新增用户'),
    size: "540px",
}, ...__VLS_functionalComponentArgsRest(__VLS_149));
__VLS_151.slots.default;
const __VLS_152 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_153 = __VLS_asFunctionalComponent(__VLS_152, new __VLS_152({
    model: (__VLS_ctx.form),
    labelWidth: "100px",
}));
const __VLS_154 = __VLS_153({
    model: (__VLS_ctx.form),
    labelWidth: "100px",
}, ...__VLS_functionalComponentArgsRest(__VLS_153));
__VLS_155.slots.default;
const __VLS_156 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_157 = __VLS_asFunctionalComponent(__VLS_156, new __VLS_156({
    label: "用户名",
}));
const __VLS_158 = __VLS_157({
    label: "用户名",
}, ...__VLS_functionalComponentArgsRest(__VLS_157));
__VLS_159.slots.default;
const __VLS_160 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_161 = __VLS_asFunctionalComponent(__VLS_160, new __VLS_160({
    modelValue: (__VLS_ctx.form.username),
    disabled: (__VLS_ctx.editing),
}));
const __VLS_162 = __VLS_161({
    modelValue: (__VLS_ctx.form.username),
    disabled: (__VLS_ctx.editing),
}, ...__VLS_functionalComponentArgsRest(__VLS_161));
var __VLS_159;
const __VLS_164 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_165 = __VLS_asFunctionalComponent(__VLS_164, new __VLS_164({
    label: "姓名",
}));
const __VLS_166 = __VLS_165({
    label: "姓名",
}, ...__VLS_functionalComponentArgsRest(__VLS_165));
__VLS_167.slots.default;
const __VLS_168 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_169 = __VLS_asFunctionalComponent(__VLS_168, new __VLS_168({
    modelValue: (__VLS_ctx.form.realName),
}));
const __VLS_170 = __VLS_169({
    modelValue: (__VLS_ctx.form.realName),
}, ...__VLS_functionalComponentArgsRest(__VLS_169));
var __VLS_167;
const __VLS_172 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_173 = __VLS_asFunctionalComponent(__VLS_172, new __VLS_172({
    label: "所属部门",
}));
const __VLS_174 = __VLS_173({
    label: "所属部门",
}, ...__VLS_functionalComponentArgsRest(__VLS_173));
__VLS_175.slots.default;
const __VLS_176 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_177 = __VLS_asFunctionalComponent(__VLS_176, new __VLS_176({
    modelValue: (__VLS_ctx.form.dept),
    ...{ class: "w-full" },
}));
const __VLS_178 = __VLS_177({
    modelValue: (__VLS_ctx.form.dept),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_177));
__VLS_179.slots.default;
for (const [dept] of __VLS_getVForSourceType((__VLS_ctx.deptPool))) {
    const __VLS_180 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_181 = __VLS_asFunctionalComponent(__VLS_180, new __VLS_180({
        key: (dept),
        label: (dept),
        value: (dept),
    }));
    const __VLS_182 = __VLS_181({
        key: (dept),
        label: (dept),
        value: (dept),
    }, ...__VLS_functionalComponentArgsRest(__VLS_181));
}
var __VLS_179;
var __VLS_175;
const __VLS_184 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_185 = __VLS_asFunctionalComponent(__VLS_184, new __VLS_184({
    label: "所属租户",
}));
const __VLS_186 = __VLS_185({
    label: "所属租户",
}, ...__VLS_functionalComponentArgsRest(__VLS_185));
__VLS_187.slots.default;
const __VLS_188 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_189 = __VLS_asFunctionalComponent(__VLS_188, new __VLS_188({
    modelValue: (__VLS_ctx.form.tenant),
    ...{ class: "w-full" },
}));
const __VLS_190 = __VLS_189({
    modelValue: (__VLS_ctx.form.tenant),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_189));
__VLS_191.slots.default;
for (const [tenant] of __VLS_getVForSourceType((__VLS_ctx.tenantPool))) {
    const __VLS_192 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_193 = __VLS_asFunctionalComponent(__VLS_192, new __VLS_192({
        key: (tenant),
        label: (tenant),
        value: (tenant),
    }));
    const __VLS_194 = __VLS_193({
        key: (tenant),
        label: (tenant),
        value: (tenant),
    }, ...__VLS_functionalComponentArgsRest(__VLS_193));
}
var __VLS_191;
var __VLS_187;
const __VLS_196 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_197 = __VLS_asFunctionalComponent(__VLS_196, new __VLS_196({
    label: "分配角色",
}));
const __VLS_198 = __VLS_197({
    label: "分配角色",
}, ...__VLS_functionalComponentArgsRest(__VLS_197));
__VLS_199.slots.default;
const __VLS_200 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_201 = __VLS_asFunctionalComponent(__VLS_200, new __VLS_200({
    modelValue: (__VLS_ctx.form.roles),
    multiple: true,
    ...{ class: "w-full" },
}));
const __VLS_202 = __VLS_201({
    modelValue: (__VLS_ctx.form.roles),
    multiple: true,
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_201));
__VLS_203.slots.default;
for (const [role] of __VLS_getVForSourceType((__VLS_ctx.rolePool))) {
    const __VLS_204 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_205 = __VLS_asFunctionalComponent(__VLS_204, new __VLS_204({
        key: (role),
        label: (role),
        value: (role),
    }));
    const __VLS_206 = __VLS_205({
        key: (role),
        label: (role),
        value: (role),
    }, ...__VLS_functionalComponentArgsRest(__VLS_205));
}
var __VLS_203;
var __VLS_199;
const __VLS_208 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_209 = __VLS_asFunctionalComponent(__VLS_208, new __VLS_208({
    label: "手机号",
}));
const __VLS_210 = __VLS_209({
    label: "手机号",
}, ...__VLS_functionalComponentArgsRest(__VLS_209));
__VLS_211.slots.default;
const __VLS_212 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_213 = __VLS_asFunctionalComponent(__VLS_212, new __VLS_212({
    modelValue: (__VLS_ctx.form.phone),
}));
const __VLS_214 = __VLS_213({
    modelValue: (__VLS_ctx.form.phone),
}, ...__VLS_functionalComponentArgsRest(__VLS_213));
var __VLS_211;
const __VLS_216 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_217 = __VLS_asFunctionalComponent(__VLS_216, new __VLS_216({
    label: "账号对接",
}));
const __VLS_218 = __VLS_217({
    label: "账号对接",
}, ...__VLS_functionalComponentArgsRest(__VLS_217));
__VLS_219.slots.default;
const __VLS_220 = {}.ElCheckbox;
/** @type {[typeof __VLS_components.ElCheckbox, typeof __VLS_components.elCheckbox, typeof __VLS_components.ElCheckbox, typeof __VLS_components.elCheckbox, ]} */ ;
// @ts-ignore
const __VLS_221 = __VLS_asFunctionalComponent(__VLS_220, new __VLS_220({
    modelValue: (__VLS_ctx.form.sso),
}));
const __VLS_222 = __VLS_221({
    modelValue: (__VLS_ctx.form.sso),
}, ...__VLS_functionalComponentArgsRest(__VLS_221));
__VLS_223.slots.default;
var __VLS_223;
const __VLS_224 = {}.ElCheckbox;
/** @type {[typeof __VLS_components.ElCheckbox, typeof __VLS_components.elCheckbox, typeof __VLS_components.ElCheckbox, typeof __VLS_components.elCheckbox, ]} */ ;
// @ts-ignore
const __VLS_225 = __VLS_asFunctionalComponent(__VLS_224, new __VLS_224({
    modelValue: (__VLS_ctx.form.ldap),
}));
const __VLS_226 = __VLS_225({
    modelValue: (__VLS_ctx.form.ldap),
}, ...__VLS_functionalComponentArgsRest(__VLS_225));
__VLS_227.slots.default;
var __VLS_227;
var __VLS_219;
var __VLS_155;
{
    const { footer: __VLS_thisSlot } = __VLS_151.slots;
    const __VLS_228 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_229 = __VLS_asFunctionalComponent(__VLS_228, new __VLS_228({
        ...{ 'onClick': {} },
    }));
    const __VLS_230 = __VLS_229({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_229));
    let __VLS_232;
    let __VLS_233;
    let __VLS_234;
    const __VLS_235 = {
        onClick: (...[$event]) => {
            __VLS_ctx.editorVisible = false;
        }
    };
    __VLS_231.slots.default;
    var __VLS_231;
    const __VLS_236 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_237 = __VLS_asFunctionalComponent(__VLS_236, new __VLS_236({
        ...{ 'onClick': {} },
        type: "danger",
    }));
    const __VLS_238 = __VLS_237({
        ...{ 'onClick': {} },
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_237));
    let __VLS_240;
    let __VLS_241;
    let __VLS_242;
    const __VLS_243 = {
        onClick: (__VLS_ctx.saveForm)
    };
    __VLS_239.slots.default;
    var __VLS_239;
}
var __VLS_151;
const __VLS_244 = {}.ElDrawer;
/** @type {[typeof __VLS_components.ElDrawer, typeof __VLS_components.elDrawer, typeof __VLS_components.ElDrawer, typeof __VLS_components.elDrawer, ]} */ ;
// @ts-ignore
const __VLS_245 = __VLS_asFunctionalComponent(__VLS_244, new __VLS_244({
    modelValue: (__VLS_ctx.loginVisible),
    title: "登录记录",
    size: "480px",
}));
const __VLS_246 = __VLS_245({
    modelValue: (__VLS_ctx.loginVisible),
    title: "登录记录",
    size: "480px",
}, ...__VLS_functionalComponentArgsRest(__VLS_245));
__VLS_247.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "section-title mb-8" },
});
(__VLS_ctx.currentUser?.username);
(__VLS_ctx.currentUser?.realName);
const __VLS_248 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_249 = __VLS_asFunctionalComponent(__VLS_248, new __VLS_248({
    data: (__VLS_ctx.loginRecords),
    stripe: true,
    size: "small",
}));
const __VLS_250 = __VLS_249({
    data: (__VLS_ctx.loginRecords),
    stripe: true,
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_249));
__VLS_251.slots.default;
const __VLS_252 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_253 = __VLS_asFunctionalComponent(__VLS_252, new __VLS_252({
    prop: "time",
    label: "时间",
    width: "170",
}));
const __VLS_254 = __VLS_253({
    prop: "time",
    label: "时间",
    width: "170",
}, ...__VLS_functionalComponentArgsRest(__VLS_253));
const __VLS_256 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_257 = __VLS_asFunctionalComponent(__VLS_256, new __VLS_256({
    prop: "device",
    label: "设备",
    minWidth: "130",
}));
const __VLS_258 = __VLS_257({
    prop: "device",
    label: "设备",
    minWidth: "130",
}, ...__VLS_functionalComponentArgsRest(__VLS_257));
const __VLS_260 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_261 = __VLS_asFunctionalComponent(__VLS_260, new __VLS_260({
    prop: "ip",
    label: "IP",
    width: "120",
}));
const __VLS_262 = __VLS_261({
    prop: "ip",
    label: "IP",
    width: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_261));
const __VLS_264 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_265 = __VLS_asFunctionalComponent(__VLS_264, new __VLS_264({
    label: "结果",
    width: "110",
}));
const __VLS_266 = __VLS_265({
    label: "结果",
    width: "110",
}, ...__VLS_functionalComponentArgsRest(__VLS_265));
__VLS_267.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_267.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: (row.result === '成功' ? 'audit-success' : 'audit-fail') },
    });
    (row.result);
}
var __VLS_267;
var __VLS_251;
var __VLS_247;
const __VLS_268 = {}.ElDrawer;
/** @type {[typeof __VLS_components.ElDrawer, typeof __VLS_components.elDrawer, typeof __VLS_components.ElDrawer, typeof __VLS_components.elDrawer, ]} */ ;
// @ts-ignore
const __VLS_269 = __VLS_asFunctionalComponent(__VLS_268, new __VLS_268({
    modelValue: (__VLS_ctx.policyVisible),
    title: "密码策略配置",
    size: "480px",
}));
const __VLS_270 = __VLS_269({
    modelValue: (__VLS_ctx.policyVisible),
    title: "密码策略配置",
    size: "480px",
}, ...__VLS_functionalComponentArgsRest(__VLS_269));
__VLS_271.slots.default;
const __VLS_272 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_273 = __VLS_asFunctionalComponent(__VLS_272, new __VLS_272({
    model: (__VLS_ctx.passwordPolicy),
    labelWidth: "130px",
}));
const __VLS_274 = __VLS_273({
    model: (__VLS_ctx.passwordPolicy),
    labelWidth: "130px",
}, ...__VLS_functionalComponentArgsRest(__VLS_273));
__VLS_275.slots.default;
const __VLS_276 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_277 = __VLS_asFunctionalComponent(__VLS_276, new __VLS_276({
    label: "最小长度",
}));
const __VLS_278 = __VLS_277({
    label: "最小长度",
}, ...__VLS_functionalComponentArgsRest(__VLS_277));
__VLS_279.slots.default;
const __VLS_280 = {}.ElInputNumber;
/** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
// @ts-ignore
const __VLS_281 = __VLS_asFunctionalComponent(__VLS_280, new __VLS_280({
    modelValue: (__VLS_ctx.passwordPolicy.minLength),
    min: (6),
    max: (32),
}));
const __VLS_282 = __VLS_281({
    modelValue: (__VLS_ctx.passwordPolicy.minLength),
    min: (6),
    max: (32),
}, ...__VLS_functionalComponentArgsRest(__VLS_281));
var __VLS_279;
const __VLS_284 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_285 = __VLS_asFunctionalComponent(__VLS_284, new __VLS_284({
    label: "复杂度要求",
}));
const __VLS_286 = __VLS_285({
    label: "复杂度要求",
}, ...__VLS_functionalComponentArgsRest(__VLS_285));
__VLS_287.slots.default;
const __VLS_288 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_289 = __VLS_asFunctionalComponent(__VLS_288, new __VLS_288({
    modelValue: (__VLS_ctx.passwordPolicy.complexity),
    ...{ class: "w-full" },
}));
const __VLS_290 = __VLS_289({
    modelValue: (__VLS_ctx.passwordPolicy.complexity),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_289));
__VLS_291.slots.default;
const __VLS_292 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_293 = __VLS_asFunctionalComponent(__VLS_292, new __VLS_292({
    label: "需含大小写字母 + 数字",
    value: (3),
}));
const __VLS_294 = __VLS_293({
    label: "需含大小写字母 + 数字",
    value: (3),
}, ...__VLS_functionalComponentArgsRest(__VLS_293));
const __VLS_296 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_297 = __VLS_asFunctionalComponent(__VLS_296, new __VLS_296({
    label: "需含字母 + 数字",
    value: (2),
}));
const __VLS_298 = __VLS_297({
    label: "需含字母 + 数字",
    value: (2),
}, ...__VLS_functionalComponentArgsRest(__VLS_297));
const __VLS_300 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_301 = __VLS_asFunctionalComponent(__VLS_300, new __VLS_300({
    label: "仅字母数字",
    value: (1),
}));
const __VLS_302 = __VLS_301({
    label: "仅字母数字",
    value: (1),
}, ...__VLS_functionalComponentArgsRest(__VLS_301));
var __VLS_291;
var __VLS_287;
const __VLS_304 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_305 = __VLS_asFunctionalComponent(__VLS_304, new __VLS_304({
    label: "定期修改周期",
}));
const __VLS_306 = __VLS_305({
    label: "定期修改周期",
}, ...__VLS_functionalComponentArgsRest(__VLS_305));
__VLS_307.slots.default;
const __VLS_308 = {}.ElInputNumber;
/** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
// @ts-ignore
const __VLS_309 = __VLS_asFunctionalComponent(__VLS_308, new __VLS_308({
    modelValue: (__VLS_ctx.passwordPolicy.expireDays),
    min: (30),
    max: (180),
    step: (30),
}));
const __VLS_310 = __VLS_309({
    modelValue: (__VLS_ctx.passwordPolicy.expireDays),
    min: (30),
    max: (180),
    step: (30),
}, ...__VLS_functionalComponentArgsRest(__VLS_309));
var __VLS_307;
const __VLS_312 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_313 = __VLS_asFunctionalComponent(__VLS_312, new __VLS_312({
    label: "禁止重复次数",
}));
const __VLS_314 = __VLS_313({
    label: "禁止重复次数",
}, ...__VLS_functionalComponentArgsRest(__VLS_313));
__VLS_315.slots.default;
const __VLS_316 = {}.ElInputNumber;
/** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
// @ts-ignore
const __VLS_317 = __VLS_asFunctionalComponent(__VLS_316, new __VLS_316({
    modelValue: (__VLS_ctx.passwordPolicy.history),
    min: (1),
    max: (10),
}));
const __VLS_318 = __VLS_317({
    modelValue: (__VLS_ctx.passwordPolicy.history),
    min: (1),
    max: (10),
}, ...__VLS_functionalComponentArgsRest(__VLS_317));
var __VLS_315;
const __VLS_320 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_321 = __VLS_asFunctionalComponent(__VLS_320, new __VLS_320({
    label: "连续失败锁定",
}));
const __VLS_322 = __VLS_321({
    label: "连续失败锁定",
}, ...__VLS_functionalComponentArgsRest(__VLS_321));
__VLS_323.slots.default;
const __VLS_324 = {}.ElInputNumber;
/** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
// @ts-ignore
const __VLS_325 = __VLS_asFunctionalComponent(__VLS_324, new __VLS_324({
    modelValue: (__VLS_ctx.passwordPolicy.lockAttempts),
    min: (3),
    max: (10),
}));
const __VLS_326 = __VLS_325({
    modelValue: (__VLS_ctx.passwordPolicy.lockAttempts),
    min: (3),
    max: (10),
}, ...__VLS_functionalComponentArgsRest(__VLS_325));
var __VLS_323;
const __VLS_328 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_329 = __VLS_asFunctionalComponent(__VLS_328, new __VLS_328({
    label: "锁定时长",
}));
const __VLS_330 = __VLS_329({
    label: "锁定时长",
}, ...__VLS_functionalComponentArgsRest(__VLS_329));
__VLS_331.slots.default;
const __VLS_332 = {}.ElInputNumber;
/** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
// @ts-ignore
const __VLS_333 = __VLS_asFunctionalComponent(__VLS_332, new __VLS_332({
    modelValue: (__VLS_ctx.passwordPolicy.lockMinutes),
    min: (5),
    max: (120),
    step: (5),
}));
const __VLS_334 = __VLS_333({
    modelValue: (__VLS_ctx.passwordPolicy.lockMinutes),
    min: (5),
    max: (120),
    step: (5),
}, ...__VLS_functionalComponentArgsRest(__VLS_333));
var __VLS_331;
var __VLS_275;
{
    const { footer: __VLS_thisSlot } = __VLS_271.slots;
    const __VLS_336 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_337 = __VLS_asFunctionalComponent(__VLS_336, new __VLS_336({
        ...{ 'onClick': {} },
    }));
    const __VLS_338 = __VLS_337({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_337));
    let __VLS_340;
    let __VLS_341;
    let __VLS_342;
    const __VLS_343 = {
        onClick: (...[$event]) => {
            __VLS_ctx.policyVisible = false;
        }
    };
    __VLS_339.slots.default;
    var __VLS_339;
    const __VLS_344 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_345 = __VLS_asFunctionalComponent(__VLS_344, new __VLS_344({
        ...{ 'onClick': {} },
        type: "danger",
    }));
    const __VLS_346 = __VLS_345({
        ...{ 'onClick': {} },
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_345));
    let __VLS_348;
    let __VLS_349;
    let __VLS_350;
    const __VLS_351 = {
        onClick: (__VLS_ctx.savePolicy)
    };
    __VLS_347.slots.default;
    var __VLS_347;
}
var __VLS_271;
/** @type {__VLS_StyleScopedClasses['standard-page']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['toolbar-row']} */ ;
/** @type {__VLS_StyleScopedClasses['search-input']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-select']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-select']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-12']} */ ;
/** @type {__VLS_StyleScopedClasses['policy-subject']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
/** @type {__VLS_StyleScopedClasses['dep-text']} */ ;
/** @type {__VLS_StyleScopedClasses['dep-text']} */ ;
/** @type {__VLS_StyleScopedClasses['pager']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Download: Download,
            Plus: Plus,
            Search: Search,
            Upload: Upload,
            loginRecords: loginRecords,
            keyword: keyword,
            filterTenant: filterTenant,
            filterStatus: filterStatus,
            currentPage: currentPage,
            pageSize: pageSize,
            editorVisible: editorVisible,
            loginVisible: loginVisible,
            policyVisible: policyVisible,
            editing: editing,
            currentUser: currentUser,
            tenantPool: tenantPool,
            deptPool: deptPool,
            rolePool: rolePool,
            roleTagType: roleTagType,
            passwordPolicy: passwordPolicy,
            form: form,
            filteredUsers: filteredUsers,
            pagedUsers: pagedUsers,
            changePage: changePage,
            openCreate: openCreate,
            openEdit: openEdit,
            saveForm: saveForm,
            toggleUser: toggleUser,
            removeUser: removeUser,
            openLoginRecord: openLoginRecord,
            importUsers: importUsers,
            exportUsers: exportUsers,
            savePolicy: savePolicy,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
