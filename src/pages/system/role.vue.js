import { computed, reactive, ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { CircleCheck, Plus, Search } from '@element-plus/icons-vue';
import { dataScopePool, mockRoles, roleChangeAudit, rolePermissionTree } from '@/mock/system';
const keyword = ref('');
const filterLevel = ref('');
const currentPage = ref(1);
const pageSize = 20;
const permVisible = ref(false);
const usersVisible = ref(false);
const roles = ref([...mockRoles]);
const currentRole = ref(null);
const permTreeRef = ref();
const levelPool = ['管理员', '治理员', '开发者', '只读'];
const levelColor = {
    管理员: '#E34D59',
    治理员: '#2B6CB0',
    开发者: '#ED7B2F',
    只读: '#8C8C8C',
};
const permForm = reactive({
    dataScope: '本租户',
    checkedKeys: [],
});
const boundUsers = ref([]);
const candidateUsers = [
    { id: 'u1', username: 'admin', realName: '张三', tenant: '广州地铁设计研究院' },
    { id: 'u2', username: 'user2', realName: '李四', tenant: '轨道运营管理公司' },
    { id: 'u3', username: 'user3', realName: '王五', tenant: '广州盾构工程公司' },
    { id: 'u4', username: 'user4', realName: '赵六', tenant: '市交通运输局' },
    { id: 'u5', username: 'user5', realName: '孙七', tenant: '华南理工大学课题组' },
    { id: 'u6', username: 'user6', realName: '周八', tenant: '轨道运营管理公司' },
];
const filteredRoles = computed(() => roles.value.filter((role) => {
    if (filterLevel.value && role.level !== filterLevel.value)
        return false;
    if (!keyword.value)
        return true;
    const kw = keyword.value.toLowerCase();
    return role.name.toLowerCase().includes(kw) || role.code.toLowerCase().includes(kw);
}));
const pagedRoles = computed(() => {
    const start = (currentPage.value - 1) * pageSize;
    return filteredRoles.value.slice(start, start + pageSize);
});
const changePage = (page) => (currentPage.value = page);
watch([keyword, filterLevel], () => {
    currentPage.value = 1;
});
const openCreate = () => {
    ElMessage.info('打开新增角色向导（Mock）');
};
const openPermission = (row) => {
    currentRole.value = row;
    permForm.dataScope = '本租户';
    permForm.checkedKeys = ['dashboard:view', 'metadata:view', 'quality:view', 'resource:view', 'security:view', 'intelligence:view', 'system:user'];
    permVisible.value = true;
    setTimeout(() => {
        permTreeRef.value?.setCheckedKeys(permForm.checkedKeys);
    }, 100);
};
const savePermission = () => {
    const keys = permTreeRef.value?.getCheckedKeys(true) ?? [];
    permVisible.value = false;
    ElMessage.success(`角色「${currentRole.value?.name}」权限已保存，共 ${keys.length} 项（Mock）`);
};
const openUsers = (row) => {
    currentRole.value = row;
    boundUsers.value = candidateUsers.slice(0, Math.min(row.userCount, 4)).map((user) => user.id);
    usersVisible.value = true;
};
const saveUsers = () => {
    if (!currentRole.value)
        return;
    currentRole.value.userCount = boundUsers.value.length;
    usersVisible.value = false;
    ElMessage.success(`角色「${currentRole.value.name}」已绑定 ${boundUsers.value.length} 名用户（Mock）`);
};
const cloneRole = (row) => {
    roles.value.unshift({
        ...row,
        id: `role-clone-${Date.now()}`,
        name: `${row.name}-副本`,
        builtin: false,
        userCount: 0,
    });
    ElMessage.success(`角色「${row.name}」已克隆为「${row.name}-副本」（Mock）`);
};
const removeRole = (row) => {
    roles.value = roles.value.filter((item) => item.id !== row.id);
    ElMessage.success(`角色「${row.name}」已删除（Mock）`);
};
const matrixCols = ['元数据', '数据质量', '数据资源', '数据安全', '智能治理', '系统管理'];
const matrixData = [
    { role: '超级管理员', ...Object.fromEntries(matrixCols.map((col) => [col, true])) },
    { role: '数据治理员', 元数据: true, 数据质量: true, 数据资源: true, 数据安全: false, 智能治理: true, 系统管理: false },
    { role: '数据开发', 元数据: true, 数据质量: true, 数据资源: true, 数据安全: false, 智能治理: false, 系统管理: false },
    { role: '只读用户', 元数据: true, 数据质量: false, 数据资源: true, 数据安全: false, 智能治理: false, 系统管理: false },
];
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
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-actions" },
    });
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
    placeholder: "按角色名称 / 编码搜索",
    clearable: true,
    ...{ class: "search-input" },
    prefixIcon: (__VLS_ctx.Search),
}));
const __VLS_22 = __VLS_21({
    modelValue: (__VLS_ctx.keyword),
    placeholder: "按角色名称 / 编码搜索",
    clearable: true,
    ...{ class: "search-input" },
    prefixIcon: (__VLS_ctx.Search),
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
const __VLS_24 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    modelValue: (__VLS_ctx.filterLevel),
    placeholder: "角色级别",
    clearable: true,
    ...{ class: "filter-select" },
}));
const __VLS_26 = __VLS_25({
    modelValue: (__VLS_ctx.filterLevel),
    placeholder: "角色级别",
    clearable: true,
    ...{ class: "filter-select" },
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
__VLS_27.slots.default;
for (const [level] of __VLS_getVForSourceType((__VLS_ctx.levelPool))) {
    const __VLS_28 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
        key: (level),
        label: (level),
        value: (level),
    }));
    const __VLS_30 = __VLS_29({
        key: (level),
        label: (level),
        value: (level),
    }, ...__VLS_functionalComponentArgsRest(__VLS_29));
}
var __VLS_27;
const __VLS_32 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
    data: (__VLS_ctx.pagedRoles),
    stripe: true,
    ...{ class: "mt-12" },
}));
const __VLS_34 = __VLS_33({
    data: (__VLS_ctx.pagedRoles),
    stripe: true,
    ...{ class: "mt-12" },
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
__VLS_35.slots.default;
const __VLS_36 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    prop: "name",
    label: "角色名称",
    minWidth: "140",
}));
const __VLS_38 = __VLS_37({
    prop: "name",
    label: "角色名称",
    minWidth: "140",
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
__VLS_39.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_39.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "policy-subject" },
    });
    (row.name);
    if (row.builtin) {
        const __VLS_40 = {}.ElTag;
        /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
        // @ts-ignore
        const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
            size: "small",
            type: "danger",
            effect: "dark",
            ...{ class: "ml-4" },
        }));
        const __VLS_42 = __VLS_41({
            size: "small",
            type: "danger",
            effect: "dark",
            ...{ class: "ml-4" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_41));
        __VLS_43.slots.default;
        var __VLS_43;
    }
}
var __VLS_39;
const __VLS_44 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    prop: "code",
    label: "编码",
    width: "130",
}));
const __VLS_46 = __VLS_45({
    prop: "code",
    label: "编码",
    width: "130",
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
const __VLS_48 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
    label: "级别",
    width: "90",
}));
const __VLS_50 = __VLS_49({
    label: "级别",
    width: "90",
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
__VLS_51.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_51.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "role-level-badge" },
        ...{ style: ({ background: __VLS_ctx.levelColor[row.level] }) },
    });
    (row.level);
}
var __VLS_51;
const __VLS_52 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
    prop: "description",
    label: "描述",
    minWidth: "180",
}));
const __VLS_54 = __VLS_53({
    prop: "description",
    label: "描述",
    minWidth: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
const __VLS_56 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
    label: "用户数",
    width: "80",
    align: "center",
}));
const __VLS_58 = __VLS_57({
    label: "用户数",
    width: "80",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
__VLS_59.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_59.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    (row.userCount);
}
var __VLS_59;
const __VLS_60 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
    label: "操作",
    width: "260",
    fixed: "right",
}));
const __VLS_62 = __VLS_61({
    label: "操作",
    width: "260",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_61));
__VLS_63.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_63.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_64 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }));
    const __VLS_66 = __VLS_65({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_65));
    let __VLS_68;
    let __VLS_69;
    let __VLS_70;
    const __VLS_71 = {
        onClick: (...[$event]) => {
            __VLS_ctx.openPermission(row);
        }
    };
    __VLS_67.slots.default;
    var __VLS_67;
    const __VLS_72 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
        ...{ 'onClick': {} },
        link: true,
        type: "warning",
    }));
    const __VLS_74 = __VLS_73({
        ...{ 'onClick': {} },
        link: true,
        type: "warning",
    }, ...__VLS_functionalComponentArgsRest(__VLS_73));
    let __VLS_76;
    let __VLS_77;
    let __VLS_78;
    const __VLS_79 = {
        onClick: (...[$event]) => {
            __VLS_ctx.openUsers(row);
        }
    };
    __VLS_75.slots.default;
    var __VLS_75;
    const __VLS_80 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
        ...{ 'onClick': {} },
        link: true,
        type: "info",
    }));
    const __VLS_82 = __VLS_81({
        ...{ 'onClick': {} },
        link: true,
        type: "info",
    }, ...__VLS_functionalComponentArgsRest(__VLS_81));
    let __VLS_84;
    let __VLS_85;
    let __VLS_86;
    const __VLS_87 = {
        onClick: (...[$event]) => {
            __VLS_ctx.cloneRole(row);
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
        onClick: (...[$event]) => {
            __VLS_ctx.removeRole(row);
        }
    };
    __VLS_91.slots.default;
    var __VLS_91;
}
var __VLS_63;
var __VLS_35;
const __VLS_96 = {}.ElPagination;
/** @type {[typeof __VLS_components.ElPagination, typeof __VLS_components.elPagination, ]} */ ;
// @ts-ignore
const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
    ...{ 'onCurrentChange': {} },
    ...{ class: "pager" },
    layout: "total, prev, pager, next",
    total: (__VLS_ctx.filteredRoles.length),
    pageSize: (__VLS_ctx.pageSize),
    currentPage: (__VLS_ctx.currentPage),
    background: true,
}));
const __VLS_98 = __VLS_97({
    ...{ 'onCurrentChange': {} },
    ...{ class: "pager" },
    layout: "total, prev, pager, next",
    total: (__VLS_ctx.filteredRoles.length),
    pageSize: (__VLS_ctx.pageSize),
    currentPage: (__VLS_ctx.currentPage),
    background: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_97));
let __VLS_100;
let __VLS_101;
let __VLS_102;
const __VLS_103 = {
    onCurrentChange: (__VLS_ctx.changePage)
};
var __VLS_99;
var __VLS_11;
var __VLS_7;
const __VLS_104 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
    span: (8),
}));
const __VLS_106 = __VLS_105({
    span: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_105));
__VLS_107.slots.default;
const __VLS_108 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
    ...{ class: "panel-card dashboard-card" },
    shadow: "never",
}));
const __VLS_110 = __VLS_109({
    ...{ class: "panel-card dashboard-card" },
    shadow: "never",
}, ...__VLS_functionalComponentArgsRest(__VLS_109));
__VLS_111.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_111.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
}
const __VLS_112 = {}.ElTimeline;
/** @type {[typeof __VLS_components.ElTimeline, typeof __VLS_components.elTimeline, typeof __VLS_components.ElTimeline, typeof __VLS_components.elTimeline, ]} */ ;
// @ts-ignore
const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
    ...{ class: "mt-8" },
}));
const __VLS_114 = __VLS_113({
    ...{ class: "mt-8" },
}, ...__VLS_functionalComponentArgsRest(__VLS_113));
__VLS_115.slots.default;
for (const [item] of __VLS_getVForSourceType((__VLS_ctx.roleChangeAudit))) {
    const __VLS_116 = {}.ElTimelineItem;
    /** @type {[typeof __VLS_components.ElTimelineItem, typeof __VLS_components.elTimelineItem, typeof __VLS_components.ElTimelineItem, typeof __VLS_components.elTimelineItem, ]} */ ;
    // @ts-ignore
    const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
        key: (`${item.time}-${item.action}`),
        timestamp: (item.time),
        type: (item.action === '分配权限' ? 'success' : item.action === '修改数据权限' ? 'warning' : 'primary'),
    }));
    const __VLS_118 = __VLS_117({
        key: (`${item.time}-${item.action}`),
        timestamp: (item.time),
        type: (item.action === '分配权限' ? 'success' : item.action === '修改数据权限' ? 'warning' : 'primary'),
    }, ...__VLS_functionalComponentArgsRest(__VLS_117));
    __VLS_119.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "audit-item-title" },
    });
    (item.user);
    (item.action);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "audit-item-action" },
    });
    (item.detail);
    var __VLS_119;
}
var __VLS_115;
var __VLS_111;
const __VLS_120 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({
    ...{ class: "panel-card dashboard-card mt-16" },
    shadow: "never",
}));
const __VLS_122 = __VLS_121({
    ...{ class: "panel-card dashboard-card mt-16" },
    shadow: "never",
}, ...__VLS_functionalComponentArgsRest(__VLS_121));
__VLS_123.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_123.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
}
const __VLS_124 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({
    data: (__VLS_ctx.matrixData),
    size: "small",
    stripe: true,
}));
const __VLS_126 = __VLS_125({
    data: (__VLS_ctx.matrixData),
    size: "small",
    stripe: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_125));
__VLS_127.slots.default;
const __VLS_128 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({
    prop: "role",
    label: "角色",
    width: "110",
}));
const __VLS_130 = __VLS_129({
    prop: "role",
    label: "角色",
    width: "110",
}, ...__VLS_functionalComponentArgsRest(__VLS_129));
for (const [col] of __VLS_getVForSourceType((__VLS_ctx.matrixCols))) {
    const __VLS_132 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132({
        key: (col),
        label: (col),
        width: "70",
        align: "center",
    }));
    const __VLS_134 = __VLS_133({
        key: (col),
        label: (col),
        width: "70",
        align: "center",
    }, ...__VLS_functionalComponentArgsRest(__VLS_133));
    __VLS_135.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_135.slots;
        const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
        if (row[col]) {
            const __VLS_136 = {}.ElIcon;
            /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
            // @ts-ignore
            const __VLS_137 = __VLS_asFunctionalComponent(__VLS_136, new __VLS_136({
                color: "#00A854",
                size: (15),
            }));
            const __VLS_138 = __VLS_137({
                color: "#00A854",
                size: (15),
            }, ...__VLS_functionalComponentArgsRest(__VLS_137));
            __VLS_139.slots.default;
            const __VLS_140 = {}.CircleCheck;
            /** @type {[typeof __VLS_components.CircleCheck, ]} */ ;
            // @ts-ignore
            const __VLS_141 = __VLS_asFunctionalComponent(__VLS_140, new __VLS_140({}));
            const __VLS_142 = __VLS_141({}, ...__VLS_functionalComponentArgsRest(__VLS_141));
            var __VLS_139;
        }
        else {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "dep-text" },
            });
        }
    }
    var __VLS_135;
}
var __VLS_127;
var __VLS_123;
var __VLS_107;
var __VLS_3;
const __VLS_144 = {}.ElDrawer;
/** @type {[typeof __VLS_components.ElDrawer, typeof __VLS_components.elDrawer, typeof __VLS_components.ElDrawer, typeof __VLS_components.elDrawer, ]} */ ;
// @ts-ignore
const __VLS_145 = __VLS_asFunctionalComponent(__VLS_144, new __VLS_144({
    modelValue: (__VLS_ctx.permVisible),
    title: (`权限分配：${__VLS_ctx.currentRole?.name ?? ''}`),
    size: "560px",
}));
const __VLS_146 = __VLS_145({
    modelValue: (__VLS_ctx.permVisible),
    title: (`权限分配：${__VLS_ctx.currentRole?.name ?? ''}`),
    size: "560px",
}, ...__VLS_functionalComponentArgsRest(__VLS_145));
__VLS_147.slots.default;
const __VLS_148 = {}.ElAlert;
/** @type {[typeof __VLS_components.ElAlert, typeof __VLS_components.elAlert, ]} */ ;
// @ts-ignore
const __VLS_149 = __VLS_asFunctionalComponent(__VLS_148, new __VLS_148({
    title: "配置菜单权限、按钮权限与数据权限范围，保存后对绑定用户即时生效（Mock）",
    type: "info",
    closable: (false),
    ...{ class: "mb-16" },
}));
const __VLS_150 = __VLS_149({
    title: "配置菜单权限、按钮权限与数据权限范围，保存后对绑定用户即时生效（Mock）",
    type: "info",
    closable: (false),
    ...{ class: "mb-16" },
}, ...__VLS_functionalComponentArgsRest(__VLS_149));
const __VLS_152 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_153 = __VLS_asFunctionalComponent(__VLS_152, new __VLS_152({
    labelWidth: "90px",
}));
const __VLS_154 = __VLS_153({
    labelWidth: "90px",
}, ...__VLS_functionalComponentArgsRest(__VLS_153));
__VLS_155.slots.default;
const __VLS_156 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_157 = __VLS_asFunctionalComponent(__VLS_156, new __VLS_156({
    label: "数据权限",
}));
const __VLS_158 = __VLS_157({
    label: "数据权限",
}, ...__VLS_functionalComponentArgsRest(__VLS_157));
__VLS_159.slots.default;
const __VLS_160 = {}.ElRadioGroup;
/** @type {[typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, ]} */ ;
// @ts-ignore
const __VLS_161 = __VLS_asFunctionalComponent(__VLS_160, new __VLS_160({
    modelValue: (__VLS_ctx.permForm.dataScope),
}));
const __VLS_162 = __VLS_161({
    modelValue: (__VLS_ctx.permForm.dataScope),
}, ...__VLS_functionalComponentArgsRest(__VLS_161));
__VLS_163.slots.default;
for (const [scope] of __VLS_getVForSourceType((__VLS_ctx.dataScopePool))) {
    const __VLS_164 = {}.ElRadio;
    /** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
    // @ts-ignore
    const __VLS_165 = __VLS_asFunctionalComponent(__VLS_164, new __VLS_164({
        key: (scope),
        value: (scope),
    }));
    const __VLS_166 = __VLS_165({
        key: (scope),
        value: (scope),
    }, ...__VLS_functionalComponentArgsRest(__VLS_165));
    __VLS_167.slots.default;
    (scope);
    var __VLS_167;
}
var __VLS_163;
var __VLS_159;
var __VLS_155;
const __VLS_168 = {}.ElTree;
/** @type {[typeof __VLS_components.ElTree, typeof __VLS_components.elTree, ]} */ ;
// @ts-ignore
const __VLS_169 = __VLS_asFunctionalComponent(__VLS_168, new __VLS_168({
    ref: "permTreeRef",
    data: (__VLS_ctx.rolePermissionTree),
    showCheckbox: true,
    nodeKey: "key",
    defaultExpandAll: true,
    defaultCheckedKeys: (__VLS_ctx.permForm.checkedKeys),
}));
const __VLS_170 = __VLS_169({
    ref: "permTreeRef",
    data: (__VLS_ctx.rolePermissionTree),
    showCheckbox: true,
    nodeKey: "key",
    defaultExpandAll: true,
    defaultCheckedKeys: (__VLS_ctx.permForm.checkedKeys),
}, ...__VLS_functionalComponentArgsRest(__VLS_169));
/** @type {typeof __VLS_ctx.permTreeRef} */ ;
var __VLS_172 = {};
var __VLS_171;
{
    const { footer: __VLS_thisSlot } = __VLS_147.slots;
    const __VLS_174 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_175 = __VLS_asFunctionalComponent(__VLS_174, new __VLS_174({
        ...{ 'onClick': {} },
    }));
    const __VLS_176 = __VLS_175({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_175));
    let __VLS_178;
    let __VLS_179;
    let __VLS_180;
    const __VLS_181 = {
        onClick: (...[$event]) => {
            __VLS_ctx.permVisible = false;
        }
    };
    __VLS_177.slots.default;
    var __VLS_177;
    const __VLS_182 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_183 = __VLS_asFunctionalComponent(__VLS_182, new __VLS_182({
        ...{ 'onClick': {} },
        type: "danger",
    }));
    const __VLS_184 = __VLS_183({
        ...{ 'onClick': {} },
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_183));
    let __VLS_186;
    let __VLS_187;
    let __VLS_188;
    const __VLS_189 = {
        onClick: (__VLS_ctx.savePermission)
    };
    __VLS_185.slots.default;
    var __VLS_185;
}
var __VLS_147;
const __VLS_190 = {}.ElDrawer;
/** @type {[typeof __VLS_components.ElDrawer, typeof __VLS_components.elDrawer, typeof __VLS_components.ElDrawer, typeof __VLS_components.elDrawer, ]} */ ;
// @ts-ignore
const __VLS_191 = __VLS_asFunctionalComponent(__VLS_190, new __VLS_190({
    modelValue: (__VLS_ctx.usersVisible),
    title: (`绑定用户：${__VLS_ctx.currentRole?.name ?? ''}`),
    size: "480px",
}));
const __VLS_192 = __VLS_191({
    modelValue: (__VLS_ctx.usersVisible),
    title: (`绑定用户：${__VLS_ctx.currentRole?.name ?? ''}`),
    size: "480px",
}, ...__VLS_functionalComponentArgsRest(__VLS_191));
__VLS_193.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "dep-text mb-8" },
});
(__VLS_ctx.currentRole?.userCount ?? 0);
const __VLS_194 = {}.ElCheckboxGroup;
/** @type {[typeof __VLS_components.ElCheckboxGroup, typeof __VLS_components.elCheckboxGroup, typeof __VLS_components.ElCheckboxGroup, typeof __VLS_components.elCheckboxGroup, ]} */ ;
// @ts-ignore
const __VLS_195 = __VLS_asFunctionalComponent(__VLS_194, new __VLS_194({
    modelValue: (__VLS_ctx.boundUsers),
    ...{ class: "role-user-group" },
}));
const __VLS_196 = __VLS_195({
    modelValue: (__VLS_ctx.boundUsers),
    ...{ class: "role-user-group" },
}, ...__VLS_functionalComponentArgsRest(__VLS_195));
__VLS_197.slots.default;
for (const [user] of __VLS_getVForSourceType((__VLS_ctx.candidateUsers))) {
    const __VLS_198 = {}.ElCheckbox;
    /** @type {[typeof __VLS_components.ElCheckbox, typeof __VLS_components.elCheckbox, typeof __VLS_components.ElCheckbox, typeof __VLS_components.elCheckbox, ]} */ ;
    // @ts-ignore
    const __VLS_199 = __VLS_asFunctionalComponent(__VLS_198, new __VLS_198({
        key: (user.id),
        value: (user.id),
        ...{ class: "role-user-item" },
    }));
    const __VLS_200 = __VLS_199({
        key: (user.id),
        value: (user.id),
        ...{ class: "role-user-item" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_199));
    __VLS_201.slots.default;
    (user.username);
    (user.realName);
    (user.tenant);
    var __VLS_201;
}
var __VLS_197;
{
    const { footer: __VLS_thisSlot } = __VLS_193.slots;
    const __VLS_202 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_203 = __VLS_asFunctionalComponent(__VLS_202, new __VLS_202({
        ...{ 'onClick': {} },
    }));
    const __VLS_204 = __VLS_203({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_203));
    let __VLS_206;
    let __VLS_207;
    let __VLS_208;
    const __VLS_209 = {
        onClick: (...[$event]) => {
            __VLS_ctx.usersVisible = false;
        }
    };
    __VLS_205.slots.default;
    var __VLS_205;
    const __VLS_210 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_211 = __VLS_asFunctionalComponent(__VLS_210, new __VLS_210({
        ...{ 'onClick': {} },
        type: "danger",
    }));
    const __VLS_212 = __VLS_211({
        ...{ 'onClick': {} },
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_211));
    let __VLS_214;
    let __VLS_215;
    let __VLS_216;
    const __VLS_217 = {
        onClick: (__VLS_ctx.saveUsers)
    };
    __VLS_213.slots.default;
    var __VLS_213;
}
var __VLS_193;
/** @type {__VLS_StyleScopedClasses['standard-page']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['toolbar-row']} */ ;
/** @type {__VLS_StyleScopedClasses['search-input']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-select']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-12']} */ ;
/** @type {__VLS_StyleScopedClasses['policy-subject']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
/** @type {__VLS_StyleScopedClasses['role-level-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['pager']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
/** @type {__VLS_StyleScopedClasses['audit-item-title']} */ ;
/** @type {__VLS_StyleScopedClasses['audit-item-action']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['dep-text']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
/** @type {__VLS_StyleScopedClasses['dep-text']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
/** @type {__VLS_StyleScopedClasses['role-user-group']} */ ;
/** @type {__VLS_StyleScopedClasses['role-user-item']} */ ;
// @ts-ignore
var __VLS_173 = __VLS_172;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            CircleCheck: CircleCheck,
            Plus: Plus,
            Search: Search,
            dataScopePool: dataScopePool,
            roleChangeAudit: roleChangeAudit,
            rolePermissionTree: rolePermissionTree,
            keyword: keyword,
            filterLevel: filterLevel,
            currentPage: currentPage,
            pageSize: pageSize,
            permVisible: permVisible,
            usersVisible: usersVisible,
            currentRole: currentRole,
            permTreeRef: permTreeRef,
            levelPool: levelPool,
            levelColor: levelColor,
            permForm: permForm,
            boundUsers: boundUsers,
            candidateUsers: candidateUsers,
            filteredRoles: filteredRoles,
            pagedRoles: pagedRoles,
            changePage: changePage,
            openCreate: openCreate,
            openPermission: openPermission,
            savePermission: savePermission,
            openUsers: openUsers,
            saveUsers: saveUsers,
            cloneRole: cloneRole,
            removeRole: removeRole,
            matrixCols: matrixCols,
            matrixData: matrixData,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
