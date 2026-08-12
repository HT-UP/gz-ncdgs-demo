import { computed, reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { CircleCheck, Plus, Search } from '@element-plus/icons-vue';
import { mockPermissions } from '@/mock/resource';
const statusTagType = {
    已批准: 'success',
    待审批: 'warning',
    已驳回: 'danger',
    已到期: 'info',
};
const activeTab = ref('mine');
const keyword = ref('');
const filterStatus = ref('');
const createVisible = ref(false);
const applications = ref([...mockPermissions]);
const resourcePool = ['ticket_sale_detail', 'passenger_info', 'flow_stat_daily', 'device_status_log', 'station_info', 'line_info'];
const recommendations = [
    { id: 1, name: 'ticket_sale_detail', catalog: 'DWD 明细层', frequency: '日更 52 万行', approved: false },
    { id: 2, name: 'flow_stat_daily', catalog: 'DWS 汇总层', frequency: '日更 1.2 万行', approved: false },
    { id: 3, name: 'station_info', catalog: 'ODS 贴源层', frequency: '低频', approved: false },
    { id: 4, name: 'device_status_log', catalog: 'DWD 明细层', frequency: '小时级', approved: true },
    { id: 5, name: 'train_operation_log', catalog: 'DWD 明细层', frequency: '事件型', approved: false },
];
const createForm = reactive({
    resource: 'ticket_sale_detail',
    permType: '读',
    reason: '',
    range: [],
});
const filteredList = computed(() => {
    let source;
    if (activeTab.value === 'mine')
        source = applications.value.filter((item) => item.applicant === '张三');
    else if (activeTab.value === 'approval')
        source = applications.value.filter((item) => item.status === '待审批');
    else
        source = applications.value;
    return source.filter((item) => {
        if (filterStatus.value && item.status !== filterStatus.value)
            return false;
        if (!keyword.value)
            return true;
        const kw = keyword.value.toLowerCase();
        return item.resourceName.toLowerCase().includes(kw) || item.applicant.toLowerCase().includes(kw);
    });
});
const openCreate = () => {
    Object.assign(createForm, { resource: 'ticket_sale_detail', permType: '读', reason: '', range: [] });
    createVisible.value = true;
};
const submitCreate = () => {
    if (!createForm.reason.trim()) {
        ElMessage.warning('请填写申请理由');
        return;
    }
    applications.value.unshift({
        id: `perm-mock-${Date.now()}`,
        applicant: '张三',
        resourceName: createForm.resource,
        resourceType: '表',
        permType: createForm.permType,
        reason: createForm.reason,
        effectiveDate: createForm.range[0] ?? '2026-08-12',
        expireDate: createForm.range[1] ?? '2026-09-12',
        status: '待审批',
        applyTime: new Date().toLocaleString('sv-SE').replace('T', ' '),
    });
    createVisible.value = false;
    ElMessage.success('申请工单已提交，等待审批（Mock）');
};
const approve = (row, pass) => {
    row.status = pass ? '已批准' : '已驳回';
    row.approver = '王工';
    row.opinion = pass ? '用途合理，同意' : '材料不足，已驳回';
    ElMessage[pass ? 'success' : 'warning'](`工单 ${row.id} 已${pass ? '通过' : '驳回'}（Mock）`);
};
const batchApprove = () => ElMessage.success('已批量通过选中申请工单（Mock）');
const renew = (row) => {
    row.status = '待审批';
    ElMessage.info(`「${row.resourceName}」续期申请已提交，等待审批（Mock）`);
};
const viewOpinion = (row) => {
    ElMessage.info(`审批意见：${row.opinion ?? '暂无意见'} | 审批人：${row.approver ?? '-'} | 消息已通过站内信通知（Mock）`);
};
const quickApply = (resource) => {
    recommendations[resource.id - 1].approved = true;
    ElMessage.success(`已快速申请「${resource.name}」读权限（Mock）`);
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
    (__VLS_ctx.activeTab === 'approval' ? '待审批列表' : '数据申请列表');
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
    label: "我的申请",
    name: "mine",
}));
const __VLS_30 = __VLS_29({
    label: "我的申请",
    name: "mine",
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
const __VLS_32 = {}.ElTabPane;
/** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
    label: "全部申请",
    name: "all",
}));
const __VLS_34 = __VLS_33({
    label: "全部申请",
    name: "all",
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
const __VLS_36 = {}.ElTabPane;
/** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    label: "待审批",
    name: "approval",
}));
const __VLS_38 = __VLS_37({
    label: "待审批",
    name: "approval",
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
    placeholder: "按资源 / 申请人搜索",
    clearable: true,
    ...{ class: "search-input" },
    prefixIcon: (__VLS_ctx.Search),
}));
const __VLS_42 = __VLS_41({
    modelValue: (__VLS_ctx.keyword),
    placeholder: "按资源 / 申请人搜索",
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
    label: "已批准",
    value: "已批准",
}));
const __VLS_50 = __VLS_49({
    label: "已批准",
    value: "已批准",
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
const __VLS_52 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
    label: "待审批",
    value: "待审批",
}));
const __VLS_54 = __VLS_53({
    label: "待审批",
    value: "待审批",
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
const __VLS_56 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
    label: "已驳回",
    value: "已驳回",
}));
const __VLS_58 = __VLS_57({
    label: "已驳回",
    value: "已驳回",
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
const __VLS_60 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
    label: "已到期",
    value: "已到期",
}));
const __VLS_62 = __VLS_61({
    label: "已到期",
    value: "已到期",
}, ...__VLS_functionalComponentArgsRest(__VLS_61));
var __VLS_47;
if (__VLS_ctx.activeTab === 'approval') {
    const __VLS_64 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
        ...{ 'onClick': {} },
        type: "success",
        icon: (__VLS_ctx.CircleCheck),
    }));
    const __VLS_66 = __VLS_65({
        ...{ 'onClick': {} },
        type: "success",
        icon: (__VLS_ctx.CircleCheck),
    }, ...__VLS_functionalComponentArgsRest(__VLS_65));
    let __VLS_68;
    let __VLS_69;
    let __VLS_70;
    const __VLS_71 = {
        onClick: (__VLS_ctx.batchApprove)
    };
    __VLS_67.slots.default;
    var __VLS_67;
}
const __VLS_72 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
    data: (__VLS_ctx.filteredList),
    stripe: true,
    ...{ class: "mt-12" },
}));
const __VLS_74 = __VLS_73({
    data: (__VLS_ctx.filteredList),
    stripe: true,
    ...{ class: "mt-12" },
}, ...__VLS_functionalComponentArgsRest(__VLS_73));
__VLS_75.slots.default;
if (__VLS_ctx.activeTab === 'approval') {
    const __VLS_76 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
        type: "selection",
        width: "44",
    }));
    const __VLS_78 = __VLS_77({
        type: "selection",
        width: "44",
    }, ...__VLS_functionalComponentArgsRest(__VLS_77));
}
const __VLS_80 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
    prop: "id",
    label: "工单号",
    width: "110",
}));
const __VLS_82 = __VLS_81({
    prop: "id",
    label: "工单号",
    width: "110",
}, ...__VLS_functionalComponentArgsRest(__VLS_81));
const __VLS_84 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
    prop: "applicant",
    label: "申请人",
    width: "80",
}));
const __VLS_86 = __VLS_85({
    prop: "applicant",
    label: "申请人",
    width: "80",
}, ...__VLS_functionalComponentArgsRest(__VLS_85));
const __VLS_88 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
    prop: "resourceName",
    label: "资源",
    minWidth: "140",
}));
const __VLS_90 = __VLS_89({
    prop: "resourceName",
    label: "资源",
    minWidth: "140",
}, ...__VLS_functionalComponentArgsRest(__VLS_89));
const __VLS_92 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
    label: "权限类型",
    width: "80",
}));
const __VLS_94 = __VLS_93({
    label: "权限类型",
    width: "80",
}, ...__VLS_functionalComponentArgsRest(__VLS_93));
__VLS_95.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_95.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_96 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
        type: (row.permType === '读' ? 'primary' : row.permType === '写' ? 'warning' : 'danger'),
        effect: "plain",
    }));
    const __VLS_98 = __VLS_97({
        type: (row.permType === '读' ? 'primary' : row.permType === '写' ? 'warning' : 'danger'),
        effect: "plain",
    }, ...__VLS_functionalComponentArgsRest(__VLS_97));
    __VLS_99.slots.default;
    (row.permType);
    var __VLS_99;
}
var __VLS_95;
const __VLS_100 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
    prop: "reason",
    label: "申请理由",
    minWidth: "130",
}));
const __VLS_102 = __VLS_101({
    prop: "reason",
    label: "申请理由",
    minWidth: "130",
}, ...__VLS_functionalComponentArgsRest(__VLS_101));
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
    (row.expireDate);
}
var __VLS_107;
const __VLS_108 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
    label: "状态",
    width: "90",
}));
const __VLS_110 = __VLS_109({
    label: "状态",
    width: "90",
}, ...__VLS_functionalComponentArgsRest(__VLS_109));
__VLS_111.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_111.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_112 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
        type: (__VLS_ctx.statusTagType[row.status]),
        effect: "dark",
    }));
    const __VLS_114 = __VLS_113({
        type: (__VLS_ctx.statusTagType[row.status]),
        effect: "dark",
    }, ...__VLS_functionalComponentArgsRest(__VLS_113));
    __VLS_115.slots.default;
    (row.status);
    var __VLS_115;
}
var __VLS_111;
if (__VLS_ctx.activeTab !== 'approval') {
    const __VLS_116 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
        label: "操作",
        width: "110",
        fixed: "right",
    }));
    const __VLS_118 = __VLS_117({
        label: "操作",
        width: "110",
        fixed: "right",
    }, ...__VLS_functionalComponentArgsRest(__VLS_117));
    __VLS_119.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_119.slots;
        const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
        if (row.status === '已批准') {
            const __VLS_120 = {}.ElButton;
            /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
            // @ts-ignore
            const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({
                ...{ 'onClick': {} },
                link: true,
                type: "warning",
            }));
            const __VLS_122 = __VLS_121({
                ...{ 'onClick': {} },
                link: true,
                type: "warning",
            }, ...__VLS_functionalComponentArgsRest(__VLS_121));
            let __VLS_124;
            let __VLS_125;
            let __VLS_126;
            const __VLS_127 = {
                onClick: (...[$event]) => {
                    if (!(__VLS_ctx.activeTab !== 'approval'))
                        return;
                    if (!(row.status === '已批准'))
                        return;
                    __VLS_ctx.renew(row);
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
                if (!(__VLS_ctx.activeTab !== 'approval'))
                    return;
                __VLS_ctx.viewOpinion(row);
            }
        };
        __VLS_131.slots.default;
        var __VLS_131;
    }
    var __VLS_119;
}
else {
    const __VLS_136 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_137 = __VLS_asFunctionalComponent(__VLS_136, new __VLS_136({
        label: "操作",
        width: "150",
        fixed: "right",
    }));
    const __VLS_138 = __VLS_137({
        label: "操作",
        width: "150",
        fixed: "right",
    }, ...__VLS_functionalComponentArgsRest(__VLS_137));
    __VLS_139.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_139.slots;
        const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
        const __VLS_140 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_141 = __VLS_asFunctionalComponent(__VLS_140, new __VLS_140({
            ...{ 'onClick': {} },
            link: true,
            type: "success",
        }));
        const __VLS_142 = __VLS_141({
            ...{ 'onClick': {} },
            link: true,
            type: "success",
        }, ...__VLS_functionalComponentArgsRest(__VLS_141));
        let __VLS_144;
        let __VLS_145;
        let __VLS_146;
        const __VLS_147 = {
            onClick: (...[$event]) => {
                if (!!(__VLS_ctx.activeTab !== 'approval'))
                    return;
                __VLS_ctx.approve(row, true);
            }
        };
        __VLS_143.slots.default;
        var __VLS_143;
        const __VLS_148 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_149 = __VLS_asFunctionalComponent(__VLS_148, new __VLS_148({
            ...{ 'onClick': {} },
            link: true,
            type: "danger",
        }));
        const __VLS_150 = __VLS_149({
            ...{ 'onClick': {} },
            link: true,
            type: "danger",
        }, ...__VLS_functionalComponentArgsRest(__VLS_149));
        let __VLS_152;
        let __VLS_153;
        let __VLS_154;
        const __VLS_155 = {
            onClick: (...[$event]) => {
                if (!!(__VLS_ctx.activeTab !== 'approval'))
                    return;
                __VLS_ctx.approve(row, false);
            }
        };
        __VLS_151.slots.default;
        var __VLS_151;
    }
    var __VLS_139;
}
var __VLS_75;
const __VLS_156 = {}.ElPagination;
/** @type {[typeof __VLS_components.ElPagination, typeof __VLS_components.elPagination, ]} */ ;
// @ts-ignore
const __VLS_157 = __VLS_asFunctionalComponent(__VLS_156, new __VLS_156({
    ...{ class: "pager" },
    layout: "total, prev, pager, next",
    total: (__VLS_ctx.filteredList.length),
    pageSize: (20),
    background: true,
}));
const __VLS_158 = __VLS_157({
    ...{ class: "pager" },
    layout: "total, prev, pager, next",
    total: (__VLS_ctx.filteredList.length),
    pageSize: (20),
    background: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_157));
var __VLS_11;
var __VLS_7;
const __VLS_160 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_161 = __VLS_asFunctionalComponent(__VLS_160, new __VLS_160({
    span: (8),
}));
const __VLS_162 = __VLS_161({
    span: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_161));
__VLS_163.slots.default;
const __VLS_164 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_165 = __VLS_asFunctionalComponent(__VLS_164, new __VLS_164({
    ...{ class: "panel-card dashboard-card" },
    shadow: "never",
}));
const __VLS_166 = __VLS_165({
    ...{ class: "panel-card dashboard-card" },
    shadow: "never",
}, ...__VLS_functionalComponentArgsRest(__VLS_165));
__VLS_167.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_167.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
}
for (const [resource] of __VLS_getVForSourceType((__VLS_ctx.recommendations))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (resource.id),
        ...{ class: "rec-item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "rec-info" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "rec-name" },
    });
    (resource.name);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "rec-desc" },
    });
    (resource.catalog);
    (resource.frequency);
    const __VLS_168 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_169 = __VLS_asFunctionalComponent(__VLS_168, new __VLS_168({
        ...{ 'onClick': {} },
        link: true,
        type: "danger",
        size: "small",
    }));
    const __VLS_170 = __VLS_169({
        ...{ 'onClick': {} },
        link: true,
        type: "danger",
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_169));
    let __VLS_172;
    let __VLS_173;
    let __VLS_174;
    const __VLS_175 = {
        onClick: (...[$event]) => {
            __VLS_ctx.quickApply(resource);
        }
    };
    __VLS_171.slots.default;
    var __VLS_171;
}
var __VLS_167;
const __VLS_176 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_177 = __VLS_asFunctionalComponent(__VLS_176, new __VLS_176({
    ...{ class: "panel-card dashboard-card mt-16" },
    shadow: "never",
}));
const __VLS_178 = __VLS_177({
    ...{ class: "panel-card dashboard-card mt-16" },
    shadow: "never",
}, ...__VLS_functionalComponentArgsRest(__VLS_177));
__VLS_179.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_179.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "overview-chips" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "chip chip-green" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "chip-value" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "chip-label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "chip chip-orange" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "chip-value" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "chip-label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "chip chip-red" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "chip-value" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "chip-label" },
});
const __VLS_180 = {}.ElDivider;
/** @type {[typeof __VLS_components.ElDivider, typeof __VLS_components.elDivider, ]} */ ;
// @ts-ignore
const __VLS_181 = __VLS_asFunctionalComponent(__VLS_180, new __VLS_180({}));
const __VLS_182 = __VLS_181({}, ...__VLS_functionalComponentArgsRest(__VLS_181));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "section-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "dep-text mt-6" },
});
var __VLS_179;
var __VLS_163;
var __VLS_3;
const __VLS_184 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_185 = __VLS_asFunctionalComponent(__VLS_184, new __VLS_184({
    modelValue: (__VLS_ctx.createVisible),
    title: "创建数据申请工单",
    width: "600px",
}));
const __VLS_186 = __VLS_185({
    modelValue: (__VLS_ctx.createVisible),
    title: "创建数据申请工单",
    width: "600px",
}, ...__VLS_functionalComponentArgsRest(__VLS_185));
__VLS_187.slots.default;
const __VLS_188 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_189 = __VLS_asFunctionalComponent(__VLS_188, new __VLS_188({
    model: (__VLS_ctx.createForm),
    labelWidth: "100px",
}));
const __VLS_190 = __VLS_189({
    model: (__VLS_ctx.createForm),
    labelWidth: "100px",
}, ...__VLS_functionalComponentArgsRest(__VLS_189));
__VLS_191.slots.default;
const __VLS_192 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_193 = __VLS_asFunctionalComponent(__VLS_192, new __VLS_192({
    label: "选择资源",
}));
const __VLS_194 = __VLS_193({
    label: "选择资源",
}, ...__VLS_functionalComponentArgsRest(__VLS_193));
__VLS_195.slots.default;
const __VLS_196 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_197 = __VLS_asFunctionalComponent(__VLS_196, new __VLS_196({
    modelValue: (__VLS_ctx.createForm.resource),
    filterable: true,
    ...{ class: "w-full" },
}));
const __VLS_198 = __VLS_197({
    modelValue: (__VLS_ctx.createForm.resource),
    filterable: true,
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_197));
__VLS_199.slots.default;
for (const [resource] of __VLS_getVForSourceType((__VLS_ctx.resourcePool))) {
    const __VLS_200 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_201 = __VLS_asFunctionalComponent(__VLS_200, new __VLS_200({
        key: (resource),
        label: (resource),
        value: (resource),
    }));
    const __VLS_202 = __VLS_201({
        key: (resource),
        label: (resource),
        value: (resource),
    }, ...__VLS_functionalComponentArgsRest(__VLS_201));
}
var __VLS_199;
var __VLS_195;
const __VLS_204 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_205 = __VLS_asFunctionalComponent(__VLS_204, new __VLS_204({
    label: "权限类型",
}));
const __VLS_206 = __VLS_205({
    label: "权限类型",
}, ...__VLS_functionalComponentArgsRest(__VLS_205));
__VLS_207.slots.default;
const __VLS_208 = {}.ElRadioGroup;
/** @type {[typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, ]} */ ;
// @ts-ignore
const __VLS_209 = __VLS_asFunctionalComponent(__VLS_208, new __VLS_208({
    modelValue: (__VLS_ctx.createForm.permType),
}));
const __VLS_210 = __VLS_209({
    modelValue: (__VLS_ctx.createForm.permType),
}, ...__VLS_functionalComponentArgsRest(__VLS_209));
__VLS_211.slots.default;
const __VLS_212 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
const __VLS_213 = __VLS_asFunctionalComponent(__VLS_212, new __VLS_212({
    value: "读",
}));
const __VLS_214 = __VLS_213({
    value: "读",
}, ...__VLS_functionalComponentArgsRest(__VLS_213));
__VLS_215.slots.default;
var __VLS_215;
const __VLS_216 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
const __VLS_217 = __VLS_asFunctionalComponent(__VLS_216, new __VLS_216({
    value: "写",
}));
const __VLS_218 = __VLS_217({
    value: "写",
}, ...__VLS_functionalComponentArgsRest(__VLS_217));
__VLS_219.slots.default;
var __VLS_219;
const __VLS_220 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
const __VLS_221 = __VLS_asFunctionalComponent(__VLS_220, new __VLS_220({
    value: "全部",
}));
const __VLS_222 = __VLS_221({
    value: "全部",
}, ...__VLS_functionalComponentArgsRest(__VLS_221));
__VLS_223.slots.default;
var __VLS_223;
var __VLS_211;
var __VLS_207;
const __VLS_224 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_225 = __VLS_asFunctionalComponent(__VLS_224, new __VLS_224({
    label: "申请理由",
}));
const __VLS_226 = __VLS_225({
    label: "申请理由",
}, ...__VLS_functionalComponentArgsRest(__VLS_225));
__VLS_227.slots.default;
const __VLS_228 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_229 = __VLS_asFunctionalComponent(__VLS_228, new __VLS_228({
    modelValue: (__VLS_ctx.createForm.reason),
    type: "textarea",
    rows: (3),
    placeholder: "请填写申请用途",
}));
const __VLS_230 = __VLS_229({
    modelValue: (__VLS_ctx.createForm.reason),
    type: "textarea",
    rows: (3),
    placeholder: "请填写申请用途",
}, ...__VLS_functionalComponentArgsRest(__VLS_229));
var __VLS_227;
const __VLS_232 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_233 = __VLS_asFunctionalComponent(__VLS_232, new __VLS_232({
    label: "有效期",
}));
const __VLS_234 = __VLS_233({
    label: "有效期",
}, ...__VLS_functionalComponentArgsRest(__VLS_233));
__VLS_235.slots.default;
const __VLS_236 = {}.ElDatePicker;
/** @type {[typeof __VLS_components.ElDatePicker, typeof __VLS_components.elDatePicker, ]} */ ;
// @ts-ignore
const __VLS_237 = __VLS_asFunctionalComponent(__VLS_236, new __VLS_236({
    modelValue: (__VLS_ctx.createForm.range),
    type: "daterange",
    startPlaceholder: "生效日期",
    endPlaceholder: "截止日期",
    ...{ class: "w-full" },
    valueFormat: "YYYY-MM-DD",
}));
const __VLS_238 = __VLS_237({
    modelValue: (__VLS_ctx.createForm.range),
    type: "daterange",
    startPlaceholder: "生效日期",
    endPlaceholder: "截止日期",
    ...{ class: "w-full" },
    valueFormat: "YYYY-MM-DD",
}, ...__VLS_functionalComponentArgsRest(__VLS_237));
var __VLS_235;
var __VLS_191;
{
    const { footer: __VLS_thisSlot } = __VLS_187.slots;
    const __VLS_240 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_241 = __VLS_asFunctionalComponent(__VLS_240, new __VLS_240({
        ...{ 'onClick': {} },
    }));
    const __VLS_242 = __VLS_241({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_241));
    let __VLS_244;
    let __VLS_245;
    let __VLS_246;
    const __VLS_247 = {
        onClick: (...[$event]) => {
            __VLS_ctx.createVisible = false;
        }
    };
    __VLS_243.slots.default;
    var __VLS_243;
    const __VLS_248 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_249 = __VLS_asFunctionalComponent(__VLS_248, new __VLS_248({
        ...{ 'onClick': {} },
        type: "danger",
    }));
    const __VLS_250 = __VLS_249({
        ...{ 'onClick': {} },
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_249));
    let __VLS_252;
    let __VLS_253;
    let __VLS_254;
    const __VLS_255 = {
        onClick: (__VLS_ctx.submitCreate)
    };
    __VLS_251.slots.default;
    var __VLS_251;
}
var __VLS_187;
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
/** @type {__VLS_StyleScopedClasses['rec-item']} */ ;
/** @type {__VLS_StyleScopedClasses['rec-info']} */ ;
/** @type {__VLS_StyleScopedClasses['rec-name']} */ ;
/** @type {__VLS_StyleScopedClasses['rec-desc']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['overview-chips']} */ ;
/** @type {__VLS_StyleScopedClasses['chip']} */ ;
/** @type {__VLS_StyleScopedClasses['chip-green']} */ ;
/** @type {__VLS_StyleScopedClasses['chip-value']} */ ;
/** @type {__VLS_StyleScopedClasses['chip-label']} */ ;
/** @type {__VLS_StyleScopedClasses['chip']} */ ;
/** @type {__VLS_StyleScopedClasses['chip-orange']} */ ;
/** @type {__VLS_StyleScopedClasses['chip-value']} */ ;
/** @type {__VLS_StyleScopedClasses['chip-label']} */ ;
/** @type {__VLS_StyleScopedClasses['chip']} */ ;
/** @type {__VLS_StyleScopedClasses['chip-red']} */ ;
/** @type {__VLS_StyleScopedClasses['chip-value']} */ ;
/** @type {__VLS_StyleScopedClasses['chip-label']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['dep-text']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-6']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            CircleCheck: CircleCheck,
            Plus: Plus,
            Search: Search,
            statusTagType: statusTagType,
            activeTab: activeTab,
            keyword: keyword,
            filterStatus: filterStatus,
            createVisible: createVisible,
            resourcePool: resourcePool,
            recommendations: recommendations,
            createForm: createForm,
            filteredList: filteredList,
            openCreate: openCreate,
            submitCreate: submitCreate,
            approve: approve,
            batchApprove: batchApprove,
            renew: renew,
            viewOpinion: viewOpinion,
            quickApply: quickApply,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
