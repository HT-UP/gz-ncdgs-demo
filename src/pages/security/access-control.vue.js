import { computed, reactive, ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { Plus, Search } from '@element-plus/icons-vue';
import { mockPolicies } from '@/mock/security';
const activeTab = ref('list');
const keyword = ref('');
const filterStatus = ref('');
const currentPage = ref(1);
const pageSize = 20;
const editorVisible = ref(false);
const editingRow = ref(null);
const policies = ref([...mockPolicies]);
const resourcePool = ['ticket_sale_detail', 'passenger_info', 'station_info', 'line_info', 'device_status_log', 'flow_stat_daily'];
const subjectPool = ['数据中心管理员', '业务分析员', '数据治理专员', '审计员', '张三', '李四'];
const levelColor = {
    高: '#E34D59',
    中: '#ED7B2F',
    低: '#2B6CB0',
};
const actionTagType = {
    读: 'primary',
    写: 'warning',
    全部: 'danger',
};
const policyStatusTag = {
    生效: 'success',
    待生效: 'warning',
    待审批: 'warning',
    已过期: 'info',
};
const changeAudit = [
    { time: '2026-08-12 09:20', user: '张三', action: '新增策略', detail: '给「业务分析员」授权 ticket_sale_detail 读权限', type: 'primary' },
    { time: '2026-08-11 17:45', user: '李四', action: '回收权限', detail: '回收「赵六」对 passenger_info 的写权限', type: 'danger' },
    { time: '2026-08-11 11:05', user: '王五', action: '修改策略', detail: '「审计员」权限有效期延长至 2027-12-31', type: 'warning' },
    { time: '2026-08-10 16:30', user: '张三', action: '过期回收', detail: '自动到期回收 3 条失效策略', type: 'info' },
];
const form = reactive({
    subjectType: '角色',
    subject: '业务分析员',
    object: 'ticket_sale_detail',
    objectType: '表',
    actions: '读',
    level: '中',
    range: [],
});
const filteredPolicies = computed(() => policies.value.filter((policy) => {
    if (filterStatus.value && policy.status !== filterStatus.value)
        return false;
    if (!keyword.value)
        return true;
    const kw = keyword.value.toLowerCase();
    return policy.subject.toLowerCase().includes(kw) || policy.object.toLowerCase().includes(kw);
}));
const listSource = computed(() => {
    if (activeTab.value === 'pending')
        return filteredPolicies.value.filter((item) => item.status === '待审批');
    return filteredPolicies.value;
});
const pagedPolicies = computed(() => {
    const start = (currentPage.value - 1) * pageSize;
    return listSource.value.slice(start, start + pageSize);
});
const changePage = (page) => currentPage.value = page;
watch([keyword, filterStatus, activeTab], () => {
    currentPage.value = 1;
});
const matrixResources = resourcePool;
const matrixRows = [
    { role: '数据中心管理员', ...Object.fromEntries(resourcePool.map((r) => [r, '全部'])) },
    { role: '业务分析员', ticket_sale_detail: '读', passenger_info: '读', flow_stat_daily: '读', station_info: '读' },
    { role: '数据治理专员', ticket_sale_detail: '写', passenger_info: '读', device_status_log: '写', station_info: '读' },
    { role: '审计员', ticket_sale_detail: '读', passenger_info: '读', device_status_log: '读' },
    { role: '外部研究人员', station_info: '读', line_info: '读' },
];
const openCreate = () => {
    editingRow.value = null;
    Object.assign(form, { subjectType: '角色', subject: '业务分析员', object: 'ticket_sale_detail', objectType: '表', actions: '读', level: '中', range: [] });
    editorVisible.value = true;
};
const openEdit = (row) => {
    editingRow.value = row;
    Object.assign(form, {
        subjectType: row.subjectType,
        subject: row.subject,
        object: row.object,
        objectType: row.objectType,
        actions: row.actions,
        level: row.level,
        range: [row.effectiveDate, row.expireDate],
    });
    editorVisible.value = true;
};
const saveForm = () => {
    if (editingRow.value) {
        ElMessage.success(`策略「${editingRow.value.subject} → ${editingRow.value.object}」已保存（Mock）`);
    }
    else {
        policies.value.unshift({
            id: `pol-mock-${Date.now()}`,
            subject: form.subject,
            subjectType: form.subjectType,
            resourceType: '表',
            object: form.object,
            objectType: form.objectType,
            actions: form.actions,
            level: form.level,
            effectiveDate: form.range[0] ?? '2026-08-12',
            expireDate: form.range[1] ?? '2026-12-31',
            source: 'RBAC',
            status: '待审批',
            lastChange: new Date().toLocaleString('sv-SE').replace('T', ' '),
            changeUser: '张三',
        });
        ElMessage.success('策略已提交，等待审批（Mock）');
    }
    editorVisible.value = false;
};
const approve = (row) => {
    row.status = '生效';
    ElMessage.success(`策略已通过并生效（Mock）`);
};
const revoke = (row) => {
    row.status = '已过期';
    ElMessage.info(`「${row.subject}」对「${row.object}」的权限已回收（Mock）`);
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
const __VLS_20 = {}.ElTabs;
/** @type {[typeof __VLS_components.ElTabs, typeof __VLS_components.elTabs, typeof __VLS_components.ElTabs, typeof __VLS_components.elTabs, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
    ...{ 'onTabChange': {} },
    modelValue: (__VLS_ctx.activeTab),
}));
const __VLS_22 = __VLS_21({
    ...{ 'onTabChange': {} },
    modelValue: (__VLS_ctx.activeTab),
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
let __VLS_24;
let __VLS_25;
let __VLS_26;
const __VLS_27 = {
    onTabChange: (() => { })
};
__VLS_23.slots.default;
const __VLS_28 = {}.ElTabPane;
/** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
    label: "策略列表",
    name: "list",
}));
const __VLS_30 = __VLS_29({
    label: "策略列表",
    name: "list",
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
const __VLS_32 = {}.ElTabPane;
/** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
    label: "权限矩阵",
    name: "matrix",
}));
const __VLS_34 = __VLS_33({
    label: "权限矩阵",
    name: "matrix",
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
const __VLS_36 = {}.ElTabPane;
/** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    label: "待审批",
    name: "pending",
}));
const __VLS_38 = __VLS_37({
    label: "待审批",
    name: "pending",
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
var __VLS_23;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "toolbar-row" },
});
const __VLS_40 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
    modelValue: (__VLS_ctx.keyword),
    placeholder: "按主体 / 对象搜索",
    clearable: true,
    ...{ class: "search-input" },
    prefixIcon: (__VLS_ctx.Search),
}));
const __VLS_42 = __VLS_41({
    modelValue: (__VLS_ctx.keyword),
    placeholder: "按主体 / 对象搜索",
    clearable: true,
    ...{ class: "search-input" },
    prefixIcon: (__VLS_ctx.Search),
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
const __VLS_44 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    modelValue: (__VLS_ctx.filterStatus),
    placeholder: "状态",
    clearable: true,
    ...{ class: "filter-select" },
}));
const __VLS_46 = __VLS_45({
    modelValue: (__VLS_ctx.filterStatus),
    placeholder: "状态",
    clearable: true,
    ...{ class: "filter-select" },
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
__VLS_47.slots.default;
const __VLS_48 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
    label: "生效",
    value: "生效",
}));
const __VLS_50 = __VLS_49({
    label: "生效",
    value: "生效",
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
const __VLS_52 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
    label: "待生效",
    value: "待生效",
}));
const __VLS_54 = __VLS_53({
    label: "待生效",
    value: "待生效",
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
const __VLS_56 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
    label: "待审批",
    value: "待审批",
}));
const __VLS_58 = __VLS_57({
    label: "待审批",
    value: "待审批",
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
const __VLS_60 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
    label: "已过期",
    value: "已过期",
}));
const __VLS_62 = __VLS_61({
    label: "已过期",
    value: "已过期",
}, ...__VLS_functionalComponentArgsRest(__VLS_61));
var __VLS_47;
if (__VLS_ctx.activeTab !== 'matrix') {
    const __VLS_64 = {}.ElTable;
    /** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
    // @ts-ignore
    const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
        data: (__VLS_ctx.pagedPolicies),
        stripe: true,
        ...{ class: "mt-12" },
    }));
    const __VLS_66 = __VLS_65({
        data: (__VLS_ctx.pagedPolicies),
        stripe: true,
        ...{ class: "mt-12" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_65));
    __VLS_67.slots.default;
    const __VLS_68 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
        label: "主体",
        minWidth: "130",
    }));
    const __VLS_70 = __VLS_69({
        label: "主体",
        minWidth: "130",
    }, ...__VLS_functionalComponentArgsRest(__VLS_69));
    __VLS_71.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_71.slots;
        const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "policy-subject" },
        });
        (row.subject);
        const __VLS_72 = {}.ElTag;
        /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
        // @ts-ignore
        const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
            size: "small",
            effect: "plain",
            ...{ class: "ml-4" },
        }));
        const __VLS_74 = __VLS_73({
            size: "small",
            effect: "plain",
            ...{ class: "ml-4" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_73));
        __VLS_75.slots.default;
        (row.subjectType);
        var __VLS_75;
    }
    var __VLS_71;
    const __VLS_76 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
        label: "对象",
        minWidth: "150",
    }));
    const __VLS_78 = __VLS_77({
        label: "对象",
        minWidth: "150",
    }, ...__VLS_functionalComponentArgsRest(__VLS_77));
    __VLS_79.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_79.slots;
        const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (row.object);
        const __VLS_80 = {}.ElTag;
        /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
        // @ts-ignore
        const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
            size: "small",
            type: "info",
            effect: "plain",
            ...{ class: "ml-4" },
        }));
        const __VLS_82 = __VLS_81({
            size: "small",
            type: "info",
            effect: "plain",
            ...{ class: "ml-4" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_81));
        __VLS_83.slots.default;
        (row.objectType);
        var __VLS_83;
    }
    var __VLS_79;
    const __VLS_84 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
        label: "权限",
        width: "80",
        align: "center",
    }));
    const __VLS_86 = __VLS_85({
        label: "权限",
        width: "80",
        align: "center",
    }, ...__VLS_functionalComponentArgsRest(__VLS_85));
    __VLS_87.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_87.slots;
        const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
        const __VLS_88 = {}.ElTag;
        /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
        // @ts-ignore
        const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
            type: (__VLS_ctx.actionTagType[row.actions]),
            effect: "dark",
        }));
        const __VLS_90 = __VLS_89({
            type: (__VLS_ctx.actionTagType[row.actions]),
            effect: "dark",
        }, ...__VLS_functionalComponentArgsRest(__VLS_89));
        __VLS_91.slots.default;
        (row.actions);
        var __VLS_91;
    }
    var __VLS_87;
    const __VLS_92 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
        label: "安全等级",
        width: "90",
    }));
    const __VLS_94 = __VLS_93({
        label: "安全等级",
        width: "90",
    }, ...__VLS_functionalComponentArgsRest(__VLS_93));
    __VLS_95.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_95.slots;
        const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "security-level" },
            ...{ style: ({ background: __VLS_ctx.levelColor[row.level] }) },
        });
        (row.level);
    }
    var __VLS_95;
    const __VLS_96 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
        label: "来源",
        width: "80",
    }));
    const __VLS_98 = __VLS_97({
        label: "来源",
        width: "80",
    }, ...__VLS_functionalComponentArgsRest(__VLS_97));
    __VLS_99.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_99.slots;
        const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
        const __VLS_100 = {}.ElTag;
        /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
        // @ts-ignore
        const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
            size: "small",
            type: (row.source === 'RBAC' ? 'primary' : 'success'),
            effect: "plain",
        }));
        const __VLS_102 = __VLS_101({
            size: "small",
            type: (row.source === 'RBAC' ? 'primary' : 'success'),
            effect: "plain",
        }, ...__VLS_functionalComponentArgsRest(__VLS_101));
        __VLS_103.slots.default;
        (row.source);
        var __VLS_103;
    }
    var __VLS_99;
    const __VLS_104 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
        label: "有效期",
        width: "170",
    }));
    const __VLS_106 = __VLS_105({
        label: "有效期",
        width: "170",
    }, ...__VLS_functionalComponentArgsRest(__VLS_105));
    __VLS_107.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_107.slots;
        const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
        (row.effectiveDate);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "dep-text" },
        });
        (row.expireDate);
    }
    var __VLS_107;
    const __VLS_108 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
        label: "状态",
        width: "80",
    }));
    const __VLS_110 = __VLS_109({
        label: "状态",
        width: "80",
    }, ...__VLS_functionalComponentArgsRest(__VLS_109));
    __VLS_111.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_111.slots;
        const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
        const __VLS_112 = {}.ElTag;
        /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
        // @ts-ignore
        const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
            type: (__VLS_ctx.policyStatusTag[row.status]),
            effect: "dark",
        }));
        const __VLS_114 = __VLS_113({
            type: (__VLS_ctx.policyStatusTag[row.status]),
            effect: "dark",
        }, ...__VLS_functionalComponentArgsRest(__VLS_113));
        __VLS_115.slots.default;
        (row.status);
        var __VLS_115;
    }
    var __VLS_111;
    const __VLS_116 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
        label: "操作",
        width: "150",
        fixed: "right",
    }));
    const __VLS_118 = __VLS_117({
        label: "操作",
        width: "150",
        fixed: "right",
    }, ...__VLS_functionalComponentArgsRest(__VLS_117));
    __VLS_119.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_119.slots;
        const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
        if (row.status === '待审批') {
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
                    if (!(__VLS_ctx.activeTab !== 'matrix'))
                        return;
                    if (!(row.status === '待审批'))
                        return;
                    __VLS_ctx.approve(row);
                }
            };
            __VLS_123.slots.default;
            var __VLS_123;
        }
        const __VLS_128 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({
            ...{ 'onClick': {} },
            link: true,
            type: "primary",
        }));
        const __VLS_130 = __VLS_129({
            ...{ 'onClick': {} },
            link: true,
            type: "primary",
        }, ...__VLS_functionalComponentArgsRest(__VLS_129));
        let __VLS_132;
        let __VLS_133;
        let __VLS_134;
        const __VLS_135 = {
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.activeTab !== 'matrix'))
                    return;
                __VLS_ctx.openEdit(row);
            }
        };
        __VLS_131.slots.default;
        var __VLS_131;
        const __VLS_136 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_137 = __VLS_asFunctionalComponent(__VLS_136, new __VLS_136({
            ...{ 'onClick': {} },
            link: true,
            type: "danger",
        }));
        const __VLS_138 = __VLS_137({
            ...{ 'onClick': {} },
            link: true,
            type: "danger",
        }, ...__VLS_functionalComponentArgsRest(__VLS_137));
        let __VLS_140;
        let __VLS_141;
        let __VLS_142;
        const __VLS_143 = {
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.activeTab !== 'matrix'))
                    return;
                __VLS_ctx.revoke(row);
            }
        };
        __VLS_139.slots.default;
        var __VLS_139;
    }
    var __VLS_119;
    var __VLS_67;
}
else {
    const __VLS_144 = {}.ElTable;
    /** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
    // @ts-ignore
    const __VLS_145 = __VLS_asFunctionalComponent(__VLS_144, new __VLS_144({
        data: (__VLS_ctx.matrixRows),
        stripe: true,
        ...{ class: "mt-12" },
        size: "small",
    }));
    const __VLS_146 = __VLS_145({
        data: (__VLS_ctx.matrixRows),
        stripe: true,
        ...{ class: "mt-12" },
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_145));
    __VLS_147.slots.default;
    const __VLS_148 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_149 = __VLS_asFunctionalComponent(__VLS_148, new __VLS_148({
        prop: "role",
        label: "角色 / 资源",
        width: "160",
        fixed: true,
    }));
    const __VLS_150 = __VLS_149({
        prop: "role",
        label: "角色 / 资源",
        width: "160",
        fixed: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_149));
    for (const [resource] of __VLS_getVForSourceType((__VLS_ctx.matrixResources))) {
        const __VLS_152 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_153 = __VLS_asFunctionalComponent(__VLS_152, new __VLS_152({
            key: (resource),
            label: (resource),
            minWidth: "130",
            align: "center",
        }));
        const __VLS_154 = __VLS_153({
            key: (resource),
            label: (resource),
            minWidth: "130",
            align: "center",
        }, ...__VLS_functionalComponentArgsRest(__VLS_153));
        __VLS_155.slots.default;
        {
            const { default: __VLS_thisSlot } = __VLS_155.slots;
            const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
            if (row[resource] === '读') {
                const __VLS_156 = {}.ElTag;
                /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
                // @ts-ignore
                const __VLS_157 = __VLS_asFunctionalComponent(__VLS_156, new __VLS_156({
                    type: "primary",
                    effect: "plain",
                    size: "small",
                }));
                const __VLS_158 = __VLS_157({
                    type: "primary",
                    effect: "plain",
                    size: "small",
                }, ...__VLS_functionalComponentArgsRest(__VLS_157));
                __VLS_159.slots.default;
                var __VLS_159;
            }
            else if (row[resource] === '写') {
                const __VLS_160 = {}.ElTag;
                /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
                // @ts-ignore
                const __VLS_161 = __VLS_asFunctionalComponent(__VLS_160, new __VLS_160({
                    type: "warning",
                    effect: "plain",
                    size: "small",
                }));
                const __VLS_162 = __VLS_161({
                    type: "warning",
                    effect: "plain",
                    size: "small",
                }, ...__VLS_functionalComponentArgsRest(__VLS_161));
                __VLS_163.slots.default;
                var __VLS_163;
            }
            else if (row[resource] === '全部') {
                const __VLS_164 = {}.ElTag;
                /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
                // @ts-ignore
                const __VLS_165 = __VLS_asFunctionalComponent(__VLS_164, new __VLS_164({
                    type: "danger",
                    effect: "plain",
                    size: "small",
                }));
                const __VLS_166 = __VLS_165({
                    type: "danger",
                    effect: "plain",
                    size: "small",
                }, ...__VLS_functionalComponentArgsRest(__VLS_165));
                __VLS_167.slots.default;
                var __VLS_167;
            }
            else {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                    ...{ class: "dep-text" },
                });
            }
        }
        var __VLS_155;
    }
    var __VLS_147;
}
if (__VLS_ctx.activeTab !== 'matrix') {
    const __VLS_168 = {}.ElPagination;
    /** @type {[typeof __VLS_components.ElPagination, typeof __VLS_components.elPagination, ]} */ ;
    // @ts-ignore
    const __VLS_169 = __VLS_asFunctionalComponent(__VLS_168, new __VLS_168({
        ...{ 'onCurrentChange': {} },
        ...{ class: "pager" },
        layout: "total, prev, pager, next",
        total: (__VLS_ctx.listSource.length),
        pageSize: (__VLS_ctx.pageSize),
        currentPage: (__VLS_ctx.currentPage),
        background: true,
    }));
    const __VLS_170 = __VLS_169({
        ...{ 'onCurrentChange': {} },
        ...{ class: "pager" },
        layout: "total, prev, pager, next",
        total: (__VLS_ctx.listSource.length),
        pageSize: (__VLS_ctx.pageSize),
        currentPage: (__VLS_ctx.currentPage),
        background: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_169));
    let __VLS_172;
    let __VLS_173;
    let __VLS_174;
    const __VLS_175 = {
        onCurrentChange: (__VLS_ctx.changePage)
    };
    var __VLS_171;
}
var __VLS_11;
var __VLS_7;
const __VLS_176 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_177 = __VLS_asFunctionalComponent(__VLS_176, new __VLS_176({
    span: (8),
}));
const __VLS_178 = __VLS_177({
    span: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_177));
__VLS_179.slots.default;
const __VLS_180 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_181 = __VLS_asFunctionalComponent(__VLS_180, new __VLS_180({
    ...{ class: "panel-card dashboard-card" },
    shadow: "never",
}));
const __VLS_182 = __VLS_181({
    ...{ class: "panel-card dashboard-card" },
    shadow: "never",
}, ...__VLS_functionalComponentArgsRest(__VLS_181));
__VLS_183.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_183.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
}
const __VLS_184 = {}.ElTimeline;
/** @type {[typeof __VLS_components.ElTimeline, typeof __VLS_components.elTimeline, typeof __VLS_components.ElTimeline, typeof __VLS_components.elTimeline, ]} */ ;
// @ts-ignore
const __VLS_185 = __VLS_asFunctionalComponent(__VLS_184, new __VLS_184({
    ...{ class: "mt-8" },
}));
const __VLS_186 = __VLS_185({
    ...{ class: "mt-8" },
}, ...__VLS_functionalComponentArgsRest(__VLS_185));
__VLS_187.slots.default;
for (const [item] of __VLS_getVForSourceType((__VLS_ctx.changeAudit))) {
    const __VLS_188 = {}.ElTimelineItem;
    /** @type {[typeof __VLS_components.ElTimelineItem, typeof __VLS_components.elTimelineItem, typeof __VLS_components.ElTimelineItem, typeof __VLS_components.elTimelineItem, ]} */ ;
    // @ts-ignore
    const __VLS_189 = __VLS_asFunctionalComponent(__VLS_188, new __VLS_188({
        key: (`${item.time}-${item.action}`),
        timestamp: (item.time),
        type: (item.type),
    }));
    const __VLS_190 = __VLS_189({
        key: (`${item.time}-${item.action}`),
        timestamp: (item.time),
        type: (item.type),
    }, ...__VLS_functionalComponentArgsRest(__VLS_189));
    __VLS_191.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "audit-item-title" },
    });
    (item.user);
    (item.action);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "audit-item-action" },
    });
    (item.detail);
    var __VLS_191;
}
var __VLS_187;
var __VLS_183;
var __VLS_179;
var __VLS_3;
const __VLS_192 = {}.ElDrawer;
/** @type {[typeof __VLS_components.ElDrawer, typeof __VLS_components.elDrawer, typeof __VLS_components.ElDrawer, typeof __VLS_components.elDrawer, ]} */ ;
// @ts-ignore
const __VLS_193 = __VLS_asFunctionalComponent(__VLS_192, new __VLS_192({
    modelValue: (__VLS_ctx.editorVisible),
    title: (__VLS_ctx.editingRow ? '编辑策略' : '新增策略'),
    size: "540px",
}));
const __VLS_194 = __VLS_193({
    modelValue: (__VLS_ctx.editorVisible),
    title: (__VLS_ctx.editingRow ? '编辑策略' : '新增策略'),
    size: "540px",
}, ...__VLS_functionalComponentArgsRest(__VLS_193));
__VLS_195.slots.default;
const __VLS_196 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_197 = __VLS_asFunctionalComponent(__VLS_196, new __VLS_196({
    model: (__VLS_ctx.form),
    labelWidth: "100px",
}));
const __VLS_198 = __VLS_197({
    model: (__VLS_ctx.form),
    labelWidth: "100px",
}, ...__VLS_functionalComponentArgsRest(__VLS_197));
__VLS_199.slots.default;
const __VLS_200 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_201 = __VLS_asFunctionalComponent(__VLS_200, new __VLS_200({
    label: "主体类型",
}));
const __VLS_202 = __VLS_201({
    label: "主体类型",
}, ...__VLS_functionalComponentArgsRest(__VLS_201));
__VLS_203.slots.default;
const __VLS_204 = {}.ElRadioGroup;
/** @type {[typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, ]} */ ;
// @ts-ignore
const __VLS_205 = __VLS_asFunctionalComponent(__VLS_204, new __VLS_204({
    modelValue: (__VLS_ctx.form.subjectType),
}));
const __VLS_206 = __VLS_205({
    modelValue: (__VLS_ctx.form.subjectType),
}, ...__VLS_functionalComponentArgsRest(__VLS_205));
__VLS_207.slots.default;
const __VLS_208 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
const __VLS_209 = __VLS_asFunctionalComponent(__VLS_208, new __VLS_208({
    value: "角色",
}));
const __VLS_210 = __VLS_209({
    value: "角色",
}, ...__VLS_functionalComponentArgsRest(__VLS_209));
const __VLS_212 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
const __VLS_213 = __VLS_asFunctionalComponent(__VLS_212, new __VLS_212({
    value: "用户",
}));
const __VLS_214 = __VLS_213({
    value: "用户",
}, ...__VLS_functionalComponentArgsRest(__VLS_213));
const __VLS_216 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
const __VLS_217 = __VLS_asFunctionalComponent(__VLS_216, new __VLS_216({
    value: "部门",
}));
const __VLS_218 = __VLS_217({
    value: "部门",
}, ...__VLS_functionalComponentArgsRest(__VLS_217));
const __VLS_220 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
const __VLS_221 = __VLS_asFunctionalComponent(__VLS_220, new __VLS_220({
    value: "租户",
}));
const __VLS_222 = __VLS_221({
    value: "租户",
}, ...__VLS_functionalComponentArgsRest(__VLS_221));
var __VLS_207;
var __VLS_203;
const __VLS_224 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_225 = __VLS_asFunctionalComponent(__VLS_224, new __VLS_224({
    label: "主体",
}));
const __VLS_226 = __VLS_225({
    label: "主体",
}, ...__VLS_functionalComponentArgsRest(__VLS_225));
__VLS_227.slots.default;
const __VLS_228 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_229 = __VLS_asFunctionalComponent(__VLS_228, new __VLS_228({
    modelValue: (__VLS_ctx.form.subject),
    filterable: true,
    allowCreate: true,
    defaultFirstOption: true,
    ...{ class: "w-full" },
}));
const __VLS_230 = __VLS_229({
    modelValue: (__VLS_ctx.form.subject),
    filterable: true,
    allowCreate: true,
    defaultFirstOption: true,
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_229));
__VLS_231.slots.default;
for (const [subject] of __VLS_getVForSourceType((__VLS_ctx.subjectPool))) {
    const __VLS_232 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_233 = __VLS_asFunctionalComponent(__VLS_232, new __VLS_232({
        key: (subject),
        label: (subject),
        value: (subject),
    }));
    const __VLS_234 = __VLS_233({
        key: (subject),
        label: (subject),
        value: (subject),
    }, ...__VLS_functionalComponentArgsRest(__VLS_233));
}
var __VLS_231;
var __VLS_227;
const __VLS_236 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_237 = __VLS_asFunctionalComponent(__VLS_236, new __VLS_236({
    label: "授权对象",
}));
const __VLS_238 = __VLS_237({
    label: "授权对象",
}, ...__VLS_functionalComponentArgsRest(__VLS_237));
__VLS_239.slots.default;
const __VLS_240 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_241 = __VLS_asFunctionalComponent(__VLS_240, new __VLS_240({
    modelValue: (__VLS_ctx.form.object),
    filterable: true,
    ...{ class: "w-full" },
}));
const __VLS_242 = __VLS_241({
    modelValue: (__VLS_ctx.form.object),
    filterable: true,
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_241));
__VLS_243.slots.default;
for (const [resource] of __VLS_getVForSourceType((__VLS_ctx.resourcePool))) {
    const __VLS_244 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_245 = __VLS_asFunctionalComponent(__VLS_244, new __VLS_244({
        key: (resource),
        label: (resource),
        value: (resource),
    }));
    const __VLS_246 = __VLS_245({
        key: (resource),
        label: (resource),
        value: (resource),
    }, ...__VLS_functionalComponentArgsRest(__VLS_245));
}
var __VLS_243;
var __VLS_239;
const __VLS_248 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_249 = __VLS_asFunctionalComponent(__VLS_248, new __VLS_248({
    label: "对象粒度",
}));
const __VLS_250 = __VLS_249({
    label: "对象粒度",
}, ...__VLS_functionalComponentArgsRest(__VLS_249));
__VLS_251.slots.default;
const __VLS_252 = {}.ElRadioGroup;
/** @type {[typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, ]} */ ;
// @ts-ignore
const __VLS_253 = __VLS_asFunctionalComponent(__VLS_252, new __VLS_252({
    modelValue: (__VLS_ctx.form.objectType),
}));
const __VLS_254 = __VLS_253({
    modelValue: (__VLS_ctx.form.objectType),
}, ...__VLS_functionalComponentArgsRest(__VLS_253));
__VLS_255.slots.default;
const __VLS_256 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
const __VLS_257 = __VLS_asFunctionalComponent(__VLS_256, new __VLS_256({
    value: "表",
}));
const __VLS_258 = __VLS_257({
    value: "表",
}, ...__VLS_functionalComponentArgsRest(__VLS_257));
const __VLS_260 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
const __VLS_261 = __VLS_asFunctionalComponent(__VLS_260, new __VLS_260({
    value: "字段",
}));
const __VLS_262 = __VLS_261({
    value: "字段",
}, ...__VLS_functionalComponentArgsRest(__VLS_261));
const __VLS_264 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
const __VLS_265 = __VLS_asFunctionalComponent(__VLS_264, new __VLS_264({
    value: "行",
}));
const __VLS_266 = __VLS_265({
    value: "行",
}, ...__VLS_functionalComponentArgsRest(__VLS_265));
var __VLS_255;
var __VLS_251;
const __VLS_268 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_269 = __VLS_asFunctionalComponent(__VLS_268, new __VLS_268({
    label: "权限动作",
}));
const __VLS_270 = __VLS_269({
    label: "权限动作",
}, ...__VLS_functionalComponentArgsRest(__VLS_269));
__VLS_271.slots.default;
const __VLS_272 = {}.ElRadioGroup;
/** @type {[typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, ]} */ ;
// @ts-ignore
const __VLS_273 = __VLS_asFunctionalComponent(__VLS_272, new __VLS_272({
    modelValue: (__VLS_ctx.form.actions),
}));
const __VLS_274 = __VLS_273({
    modelValue: (__VLS_ctx.form.actions),
}, ...__VLS_functionalComponentArgsRest(__VLS_273));
__VLS_275.slots.default;
const __VLS_276 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
const __VLS_277 = __VLS_asFunctionalComponent(__VLS_276, new __VLS_276({
    value: "读",
}));
const __VLS_278 = __VLS_277({
    value: "读",
}, ...__VLS_functionalComponentArgsRest(__VLS_277));
const __VLS_280 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
const __VLS_281 = __VLS_asFunctionalComponent(__VLS_280, new __VLS_280({
    value: "写",
}));
const __VLS_282 = __VLS_281({
    value: "写",
}, ...__VLS_functionalComponentArgsRest(__VLS_281));
const __VLS_284 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
const __VLS_285 = __VLS_asFunctionalComponent(__VLS_284, new __VLS_284({
    value: "全部",
}));
const __VLS_286 = __VLS_285({
    value: "全部",
}, ...__VLS_functionalComponentArgsRest(__VLS_285));
var __VLS_275;
var __VLS_271;
const __VLS_288 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_289 = __VLS_asFunctionalComponent(__VLS_288, new __VLS_288({
    label: "安全等级",
}));
const __VLS_290 = __VLS_289({
    label: "安全等级",
}, ...__VLS_functionalComponentArgsRest(__VLS_289));
__VLS_291.slots.default;
const __VLS_292 = {}.ElRadioGroup;
/** @type {[typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, ]} */ ;
// @ts-ignore
const __VLS_293 = __VLS_asFunctionalComponent(__VLS_292, new __VLS_292({
    modelValue: (__VLS_ctx.form.level),
}));
const __VLS_294 = __VLS_293({
    modelValue: (__VLS_ctx.form.level),
}, ...__VLS_functionalComponentArgsRest(__VLS_293));
__VLS_295.slots.default;
const __VLS_296 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
const __VLS_297 = __VLS_asFunctionalComponent(__VLS_296, new __VLS_296({
    value: "高",
}));
const __VLS_298 = __VLS_297({
    value: "高",
}, ...__VLS_functionalComponentArgsRest(__VLS_297));
const __VLS_300 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
const __VLS_301 = __VLS_asFunctionalComponent(__VLS_300, new __VLS_300({
    value: "中",
}));
const __VLS_302 = __VLS_301({
    value: "中",
}, ...__VLS_functionalComponentArgsRest(__VLS_301));
const __VLS_304 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
const __VLS_305 = __VLS_asFunctionalComponent(__VLS_304, new __VLS_304({
    value: "低",
}));
const __VLS_306 = __VLS_305({
    value: "低",
}, ...__VLS_functionalComponentArgsRest(__VLS_305));
var __VLS_295;
var __VLS_291;
const __VLS_308 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_309 = __VLS_asFunctionalComponent(__VLS_308, new __VLS_308({
    label: "生效期",
}));
const __VLS_310 = __VLS_309({
    label: "生效期",
}, ...__VLS_functionalComponentArgsRest(__VLS_309));
__VLS_311.slots.default;
const __VLS_312 = {}.ElDatePicker;
/** @type {[typeof __VLS_components.ElDatePicker, typeof __VLS_components.elDatePicker, ]} */ ;
// @ts-ignore
const __VLS_313 = __VLS_asFunctionalComponent(__VLS_312, new __VLS_312({
    modelValue: (__VLS_ctx.form.range),
    type: "daterange",
    valueFormat: "YYYY-MM-DD",
    ...{ class: "w-full" },
}));
const __VLS_314 = __VLS_313({
    modelValue: (__VLS_ctx.form.range),
    type: "daterange",
    valueFormat: "YYYY-MM-DD",
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_313));
var __VLS_311;
var __VLS_199;
{
    const { footer: __VLS_thisSlot } = __VLS_195.slots;
    const __VLS_316 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_317 = __VLS_asFunctionalComponent(__VLS_316, new __VLS_316({
        ...{ 'onClick': {} },
    }));
    const __VLS_318 = __VLS_317({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_317));
    let __VLS_320;
    let __VLS_321;
    let __VLS_322;
    const __VLS_323 = {
        onClick: (...[$event]) => {
            __VLS_ctx.editorVisible = false;
        }
    };
    __VLS_319.slots.default;
    var __VLS_319;
    const __VLS_324 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_325 = __VLS_asFunctionalComponent(__VLS_324, new __VLS_324({
        ...{ 'onClick': {} },
        type: "danger",
    }));
    const __VLS_326 = __VLS_325({
        ...{ 'onClick': {} },
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_325));
    let __VLS_328;
    let __VLS_329;
    let __VLS_330;
    const __VLS_331 = {
        onClick: (__VLS_ctx.saveForm)
    };
    __VLS_327.slots.default;
    var __VLS_327;
}
var __VLS_195;
/** @type {__VLS_StyleScopedClasses['standard-page']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['toolbar-row']} */ ;
/** @type {__VLS_StyleScopedClasses['search-input']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-select']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-12']} */ ;
/** @type {__VLS_StyleScopedClasses['policy-subject']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
/** @type {__VLS_StyleScopedClasses['security-level']} */ ;
/** @type {__VLS_StyleScopedClasses['dep-text']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-12']} */ ;
/** @type {__VLS_StyleScopedClasses['dep-text']} */ ;
/** @type {__VLS_StyleScopedClasses['pager']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
/** @type {__VLS_StyleScopedClasses['audit-item-title']} */ ;
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
            activeTab: activeTab,
            keyword: keyword,
            filterStatus: filterStatus,
            currentPage: currentPage,
            pageSize: pageSize,
            editorVisible: editorVisible,
            editingRow: editingRow,
            resourcePool: resourcePool,
            subjectPool: subjectPool,
            levelColor: levelColor,
            actionTagType: actionTagType,
            policyStatusTag: policyStatusTag,
            changeAudit: changeAudit,
            form: form,
            listSource: listSource,
            pagedPolicies: pagedPolicies,
            changePage: changePage,
            matrixResources: matrixResources,
            matrixRows: matrixRows,
            openCreate: openCreate,
            openEdit: openEdit,
            saveForm: saveForm,
            approve: approve,
            revoke: revoke,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
