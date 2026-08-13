import { computed, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { Plus, Search } from '@element-plus/icons-vue';
const levelColor = { L1: '#8c8c8c', L2: '#2B6CB0', L3: '#ED7B2F', L4: '#DA251D' };
const statsCards = [
    { label: '待审批申请', value: '4', color: '#fff', bg: 'linear-gradient(135deg, #DA251D, #B71C1C)' },
    { label: '本月已授权', value: '11', color: '#00A854', bg: 'rgba(0,168,84,.1)' },
    { label: '本月已驳回', value: '3', color: '#8c8c8c', bg: 'rgba(140,140,140,.1)' },
    { label: '审批通过率', value: '78%', color: '#2B6CB0', bg: 'rgba(43,108,176,.1)' },
];
const stageTag = {
    草稿: 'info',
    待审批: 'warning',
    已通过: 'success',
    已驳回: 'danger',
    已授权: 'primary',
};
const applies = ref([
    { id: 'SH-2026-035', asset: '售票明细查询服务', level: 'L3', stage: '待审批', applicant: '李工', period: '90 天', purpose: '票务异常分析需要售票明细数据', createTime: '2026-08-12 16:20' },
    { id: 'SH-2026-034', asset: 'passenger_info（乘客信息表）', level: 'L4', stage: '待审批', applicant: '王工', period: '30 天', purpose: '乘客服务体验调研', createTime: '2026-08-12 11:05' },
    { id: 'SH-2026-033', asset: 'ads_line_flow（客流指标）', level: 'L2', stage: '待审批', applicant: '赵工', period: '180 天', purpose: '线路运力规划建模', createTime: '2026-08-11 15:40' },
    { id: 'SH-2026-030', asset: 'line_info（线路基础信息）', level: 'L1', stage: '已授权', applicant: '外部合作单位', period: '1 年', purpose: '车站导乘屏展示', createTime: '2026-08-05 09:20', approver: '张工', approveTime: '2026-08-05 14:00', comment: '公开数据，准予共享' },
    { id: 'SH-2026-029', asset: 'payment_record（支付流水）', level: 'L4', stage: '已驳回', applicant: '李工', period: '90 天', purpose: '财务对账', createTime: '2026-08-03 10:10', approver: '安全管理员', approveTime: '2026-08-04 09:30', comment: '涉及敏感支付信息，需补充脱敏方案后重新申请' },
]);
const applKeyword = ref('');
const current = ref(null);
const comment = ref('');
const filteredApplies = computed(() => applies.value.filter((a) => {
    if (!applKeyword.value)
        return true;
    const kw = applKeyword.value.toLowerCase();
    return a.id.toLowerCase().includes(kw) || a.asset.toLowerCase().includes(kw);
}));
const flowNodesByLevel = {
    L1: ['业务审批', '授权生效'],
    L2: ['业务审批', '授权生效'],
    L3: ['业务审批', '安全管理员复核', '授权生效'],
    L4: ['业务审批', '安全管理员复核', '平台管理员终审', '授权生效'],
};
const flowNodes = computed(() => flowNodesByLevel[current.value?.level ?? 'L1']);
const flowIndex = computed(() => {
    const s = current.value?.stage;
    if (!s || s === '草稿')
        return 0;
    if (s === '待审批')
        return 1;
    if (s === '已授权')
        return flowNodes.value.length - 1;
    return 1;
});
const flowName = computed(() => flowNodes.value.join(' → '));
const selectApply = (row) => {
    current.value = row;
    comment.value = '';
};
const applyVisible = ref(false);
const applyForm = ref({ asset: '', period: '30 天', purpose: '' });
const assetOptions = ['售票明细查询服务', 'passenger_info（乘客信息表）', 'ads_line_flow（客流指标）', 'payment_record（支付流水）', 'dws_order_report（订单汇总）', '站点设施知识问答'];
const openApply = () => {
    applyForm.value = { asset: '', period: '30 天', purpose: '' };
    applyVisible.value = true;
};
const submitApply = () => {
    if (!applyForm.value.asset.trim() || !applyForm.value.purpose.trim()) {
        ElMessage.warning('请填写申请资产与用途');
        return;
    }
    applies.value.unshift({
        id: `SH-2026-${String(Math.floor(Math.random() * 90) + 10)}`,
        asset: applyForm.value.asset,
        level: applyForm.value.asset.includes('passenger') || applyForm.value.asset.includes('payment') ? 'L4' : 'L3',
        stage: '待审批',
        applicant: '当前用户',
        period: applyForm.value.period,
        purpose: applyForm.value.purpose,
        createTime: new Date().toLocaleString('sv-SE').replace('T', ' '),
    });
    applyVisible.value = false;
    ElMessage.success('共享申请已提交，进入分级审批流程（Mock）');
};
const approve = (pass) => {
    const a = current.value;
    if (!a)
        return;
    a.stage = pass ? (a.level === 'L4' ? '待审批' : '已授权') : '已驳回';
    if (pass && a.level === 'L4') {
        ElMessage.warning('L4 级资产需安全管理员与平台管理员两级复核，已流转至下一节点（Mock）');
        return;
    }
    a.approver = pass ? '审批管理员' : '审批管理员';
    a.approveTime = new Date().toLocaleString('sv-SE').replace('T', ' ');
    a.comment = comment.value;
    ElMessage.success(pass ? `「${a.id}」审批通过，已授权生效` : `「${a.id}」已驳回`);
    comment.value = '';
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "standard-page share-apply-page" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "apply-stats" },
});
for (const [s] of __VLS_getVForSourceType((__VLS_ctx.statsCards))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (s.label),
        ...{ class: "apply-stat" },
        ...{ style: ({ background: s.bg, color: s.color }) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "apply-stat-value" },
    });
    (s.value);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "apply-stat-label" },
    });
    (s.label);
}
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
    span: (9),
}));
const __VLS_6 = __VLS_5({
    span: (9),
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
__VLS_7.slots.default;
const __VLS_8 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    ...{ class: "panel-card apply-card" },
    shadow: "never",
}));
const __VLS_10 = __VLS_9({
    ...{ class: "panel-card apply-card" },
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
        onClick: (__VLS_ctx.openApply)
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
    modelValue: (__VLS_ctx.applKeyword),
    placeholder: "按单号 / 资产搜索",
    clearable: true,
    ...{ class: "search-input-sm w-full" },
    prefixIcon: (__VLS_ctx.Search),
}));
const __VLS_22 = __VLS_21({
    modelValue: (__VLS_ctx.applKeyword),
    placeholder: "按单号 / 资产搜索",
    clearable: true,
    ...{ class: "search-input-sm w-full" },
    prefixIcon: (__VLS_ctx.Search),
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
const __VLS_24 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    ...{ 'onCurrentChange': {} },
    data: (__VLS_ctx.filteredApplies),
    size: "small",
    highlightCurrentRow: true,
    height: "440",
}));
const __VLS_26 = __VLS_25({
    ...{ 'onCurrentChange': {} },
    data: (__VLS_ctx.filteredApplies),
    size: "small",
    highlightCurrentRow: true,
    height: "440",
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
let __VLS_28;
let __VLS_29;
let __VLS_30;
const __VLS_31 = {
    onCurrentChange: (__VLS_ctx.selectApply)
};
__VLS_27.slots.default;
const __VLS_32 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
    prop: "id",
    label: "申请单号",
    width: "110",
}));
const __VLS_34 = __VLS_33({
    prop: "id",
    label: "申请单号",
    width: "110",
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
const __VLS_36 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    prop: "asset",
    label: "申请资产/服务",
    minWidth: "140",
    showOverflowTooltip: true,
}));
const __VLS_38 = __VLS_37({
    prop: "asset",
    label: "申请资产/服务",
    minWidth: "140",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
const __VLS_40 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
    label: "数据级别",
    width: "64",
    align: "center",
}));
const __VLS_42 = __VLS_41({
    label: "数据级别",
    width: "64",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
__VLS_43.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_43.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "security-level" },
        ...{ style: ({ background: __VLS_ctx.levelColor[row.level] }) },
    });
    (row.level);
}
var __VLS_43;
const __VLS_44 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    label: "状态",
    width: "84",
}));
const __VLS_46 = __VLS_45({
    label: "状态",
    width: "84",
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
__VLS_47.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_47.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_48 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
        size: "small",
        type: (__VLS_ctx.stageTag[row.stage]),
        effect: "dark",
    }));
    const __VLS_50 = __VLS_49({
        size: "small",
        type: (__VLS_ctx.stageTag[row.stage]),
        effect: "dark",
    }, ...__VLS_functionalComponentArgsRest(__VLS_49));
    __VLS_51.slots.default;
    (row.stage);
    var __VLS_51;
}
var __VLS_47;
var __VLS_27;
var __VLS_11;
var __VLS_7;
const __VLS_52 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
    span: (15),
}));
const __VLS_54 = __VLS_53({
    span: (15),
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
__VLS_55.slots.default;
const __VLS_56 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
    ...{ class: "panel-card apply-card" },
    shadow: "never",
}));
const __VLS_58 = __VLS_57({
    ...{ class: "panel-card apply-card" },
    shadow: "never",
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
__VLS_59.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_59.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-actions" },
    });
    if (__VLS_ctx.current) {
        const __VLS_60 = {}.ElTag;
        /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
        // @ts-ignore
        const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
            size: "small",
            type: "info",
            effect: "plain",
        }));
        const __VLS_62 = __VLS_61({
            size: "small",
            type: "info",
            effect: "plain",
        }, ...__VLS_functionalComponentArgsRest(__VLS_61));
        __VLS_63.slots.default;
        (__VLS_ctx.flowName);
        var __VLS_63;
    }
}
if (__VLS_ctx.current) {
    const __VLS_64 = {}.ElDescriptions;
    /** @type {[typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, ]} */ ;
    // @ts-ignore
    const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
        column: (2),
        border: true,
        size: "small",
    }));
    const __VLS_66 = __VLS_65({
        column: (2),
        border: true,
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_65));
    __VLS_67.slots.default;
    const __VLS_68 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
        label: "申请单号",
    }));
    const __VLS_70 = __VLS_69({
        label: "申请单号",
    }, ...__VLS_functionalComponentArgsRest(__VLS_69));
    __VLS_71.slots.default;
    (__VLS_ctx.current.id);
    var __VLS_71;
    const __VLS_72 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
        label: "申请人",
    }));
    const __VLS_74 = __VLS_73({
        label: "申请人",
    }, ...__VLS_functionalComponentArgsRest(__VLS_73));
    __VLS_75.slots.default;
    (__VLS_ctx.current.applicant);
    var __VLS_75;
    const __VLS_76 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
        label: "申请资产/服务",
    }));
    const __VLS_78 = __VLS_77({
        label: "申请资产/服务",
    }, ...__VLS_functionalComponentArgsRest(__VLS_77));
    __VLS_79.slots.default;
    (__VLS_ctx.current.asset);
    var __VLS_79;
    const __VLS_80 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
        label: "数据分级",
    }));
    const __VLS_82 = __VLS_81({
        label: "数据分级",
    }, ...__VLS_functionalComponentArgsRest(__VLS_81));
    __VLS_83.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "security-level" },
        ...{ style: ({ background: __VLS_ctx.levelColor[__VLS_ctx.current.level] }) },
    });
    (__VLS_ctx.current.level);
    var __VLS_83;
    const __VLS_84 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
        label: "申请使用期限",
    }));
    const __VLS_86 = __VLS_85({
        label: "申请使用期限",
    }, ...__VLS_functionalComponentArgsRest(__VLS_85));
    __VLS_87.slots.default;
    (__VLS_ctx.current.period);
    var __VLS_87;
    const __VLS_88 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
        label: "申请时间",
    }));
    const __VLS_90 = __VLS_89({
        label: "申请时间",
    }, ...__VLS_functionalComponentArgsRest(__VLS_89));
    __VLS_91.slots.default;
    (__VLS_ctx.current.createTime);
    var __VLS_91;
    const __VLS_92 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
        label: "申请用途",
        span: (2),
    }));
    const __VLS_94 = __VLS_93({
        label: "申请用途",
        span: (2),
    }, ...__VLS_functionalComponentArgsRest(__VLS_93));
    __VLS_95.slots.default;
    (__VLS_ctx.current.purpose);
    var __VLS_95;
    var __VLS_67;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "block-title" },
    });
    const __VLS_96 = {}.ElSteps;
    /** @type {[typeof __VLS_components.ElSteps, typeof __VLS_components.elSteps, typeof __VLS_components.ElSteps, typeof __VLS_components.elSteps, ]} */ ;
    // @ts-ignore
    const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
        active: (__VLS_ctx.flowIndex),
        alignCenter: true,
        ...{ class: "flow-steps" },
    }));
    const __VLS_98 = __VLS_97({
        active: (__VLS_ctx.flowIndex),
        alignCenter: true,
        ...{ class: "flow-steps" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_97));
    __VLS_99.slots.default;
    for (const [n, i] of __VLS_getVForSourceType((__VLS_ctx.flowNodes))) {
        const __VLS_100 = {}.ElStep;
        /** @type {[typeof __VLS_components.ElStep, typeof __VLS_components.elStep, ]} */ ;
        // @ts-ignore
        const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
            key: (i),
            title: (n),
        }));
        const __VLS_102 = __VLS_101({
            key: (i),
            title: (n),
        }, ...__VLS_functionalComponentArgsRest(__VLS_101));
    }
    var __VLS_99;
    if (__VLS_ctx.current.stage === '待审批') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "approve-box" },
        });
        const __VLS_104 = {}.ElForm;
        /** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
        // @ts-ignore
        const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
            labelWidth: "84px",
        }));
        const __VLS_106 = __VLS_105({
            labelWidth: "84px",
        }, ...__VLS_functionalComponentArgsRest(__VLS_105));
        __VLS_107.slots.default;
        const __VLS_108 = {}.ElFormItem;
        /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
        // @ts-ignore
        const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
            label: "审批意见",
        }));
        const __VLS_110 = __VLS_109({
            label: "审批意见",
        }, ...__VLS_functionalComponentArgsRest(__VLS_109));
        __VLS_111.slots.default;
        const __VLS_112 = {}.ElInput;
        /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
        // @ts-ignore
        const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
            modelValue: (__VLS_ctx.comment),
            type: "textarea",
            rows: (3),
            placeholder: "填写审批意见（必填）",
        }));
        const __VLS_114 = __VLS_113({
            modelValue: (__VLS_ctx.comment),
            type: "textarea",
            rows: (3),
            placeholder: "填写审批意见（必填）",
        }, ...__VLS_functionalComponentArgsRest(__VLS_113));
        var __VLS_111;
        var __VLS_107;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "approve-actions" },
        });
        const __VLS_116 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
            ...{ 'onClick': {} },
            type: "danger",
            disabled: (!__VLS_ctx.comment.trim()),
        }));
        const __VLS_118 = __VLS_117({
            ...{ 'onClick': {} },
            type: "danger",
            disabled: (!__VLS_ctx.comment.trim()),
        }, ...__VLS_functionalComponentArgsRest(__VLS_117));
        let __VLS_120;
        let __VLS_121;
        let __VLS_122;
        const __VLS_123 = {
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.current))
                    return;
                if (!(__VLS_ctx.current.stage === '待审批'))
                    return;
                __VLS_ctx.approve(false);
            }
        };
        __VLS_119.slots.default;
        var __VLS_119;
        const __VLS_124 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({
            ...{ 'onClick': {} },
            type: "primary",
            disabled: (!__VLS_ctx.comment.trim()),
        }));
        const __VLS_126 = __VLS_125({
            ...{ 'onClick': {} },
            type: "primary",
            disabled: (!__VLS_ctx.comment.trim()),
        }, ...__VLS_functionalComponentArgsRest(__VLS_125));
        let __VLS_128;
        let __VLS_129;
        let __VLS_130;
        const __VLS_131 = {
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.current))
                    return;
                if (!(__VLS_ctx.current.stage === '待审批'))
                    return;
                __VLS_ctx.approve(true);
            }
        };
        __VLS_127.slots.default;
        var __VLS_127;
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "approve-result" },
        });
        const __VLS_132 = {}.ElTag;
        /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
        // @ts-ignore
        const __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132({
            size: "small",
            type: (__VLS_ctx.stageTag[__VLS_ctx.current.stage]),
            effect: "dark",
        }));
        const __VLS_134 = __VLS_133({
            size: "small",
            type: (__VLS_ctx.stageTag[__VLS_ctx.current.stage]),
            effect: "dark",
        }, ...__VLS_functionalComponentArgsRest(__VLS_133));
        __VLS_135.slots.default;
        (__VLS_ctx.current.stage);
        var __VLS_135;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "dep-text ml-4" },
        });
        (__VLS_ctx.current.approver || '—');
        (__VLS_ctx.current.approveTime || '—');
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "approve-comment" },
        });
        (__VLS_ctx.current.comment || '无');
    }
}
else {
    const __VLS_136 = {}.ElEmpty;
    /** @type {[typeof __VLS_components.ElEmpty, typeof __VLS_components.elEmpty, ]} */ ;
    // @ts-ignore
    const __VLS_137 = __VLS_asFunctionalComponent(__VLS_136, new __VLS_136({
        description: "请从左侧选择一条共享申请进行审批",
    }));
    const __VLS_138 = __VLS_137({
        description: "请从左侧选择一条共享申请进行审批",
    }, ...__VLS_functionalComponentArgsRest(__VLS_137));
}
var __VLS_59;
var __VLS_55;
var __VLS_3;
const __VLS_140 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_141 = __VLS_asFunctionalComponent(__VLS_140, new __VLS_140({
    modelValue: (__VLS_ctx.applyVisible),
    title: "新建共享申请",
    width: "540px",
    destroyOnClose: true,
}));
const __VLS_142 = __VLS_141({
    modelValue: (__VLS_ctx.applyVisible),
    title: "新建共享申请",
    width: "540px",
    destroyOnClose: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_141));
__VLS_143.slots.default;
const __VLS_144 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_145 = __VLS_asFunctionalComponent(__VLS_144, new __VLS_144({
    model: (__VLS_ctx.applyForm),
    labelWidth: "100px",
}));
const __VLS_146 = __VLS_145({
    model: (__VLS_ctx.applyForm),
    labelWidth: "100px",
}, ...__VLS_functionalComponentArgsRest(__VLS_145));
__VLS_147.slots.default;
const __VLS_148 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_149 = __VLS_asFunctionalComponent(__VLS_148, new __VLS_148({
    label: "申请资产",
}));
const __VLS_150 = __VLS_149({
    label: "申请资产",
}, ...__VLS_functionalComponentArgsRest(__VLS_149));
__VLS_151.slots.default;
const __VLS_152 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_153 = __VLS_asFunctionalComponent(__VLS_152, new __VLS_152({
    modelValue: (__VLS_ctx.applyForm.asset),
    filterable: true,
    ...{ class: "w-full" },
}));
const __VLS_154 = __VLS_153({
    modelValue: (__VLS_ctx.applyForm.asset),
    filterable: true,
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_153));
__VLS_155.slots.default;
for (const [a] of __VLS_getVForSourceType((__VLS_ctx.assetOptions))) {
    const __VLS_156 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_157 = __VLS_asFunctionalComponent(__VLS_156, new __VLS_156({
        key: (a),
        label: (a),
        value: (a),
    }));
    const __VLS_158 = __VLS_157({
        key: (a),
        label: (a),
        value: (a),
    }, ...__VLS_functionalComponentArgsRest(__VLS_157));
}
var __VLS_155;
var __VLS_151;
const __VLS_160 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_161 = __VLS_asFunctionalComponent(__VLS_160, new __VLS_160({
    label: "使用期限",
}));
const __VLS_162 = __VLS_161({
    label: "使用期限",
}, ...__VLS_functionalComponentArgsRest(__VLS_161));
__VLS_163.slots.default;
const __VLS_164 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_165 = __VLS_asFunctionalComponent(__VLS_164, new __VLS_164({
    modelValue: (__VLS_ctx.applyForm.period),
    ...{ class: "w-full" },
}));
const __VLS_166 = __VLS_165({
    modelValue: (__VLS_ctx.applyForm.period),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_165));
__VLS_167.slots.default;
const __VLS_168 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_169 = __VLS_asFunctionalComponent(__VLS_168, new __VLS_168({
    label: "30 天",
    value: "30 天",
}));
const __VLS_170 = __VLS_169({
    label: "30 天",
    value: "30 天",
}, ...__VLS_functionalComponentArgsRest(__VLS_169));
const __VLS_172 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_173 = __VLS_asFunctionalComponent(__VLS_172, new __VLS_172({
    label: "90 天",
    value: "90 天",
}));
const __VLS_174 = __VLS_173({
    label: "90 天",
    value: "90 天",
}, ...__VLS_functionalComponentArgsRest(__VLS_173));
const __VLS_176 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_177 = __VLS_asFunctionalComponent(__VLS_176, new __VLS_176({
    label: "180 天",
    value: "180 天",
}));
const __VLS_178 = __VLS_177({
    label: "180 天",
    value: "180 天",
}, ...__VLS_functionalComponentArgsRest(__VLS_177));
const __VLS_180 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_181 = __VLS_asFunctionalComponent(__VLS_180, new __VLS_180({
    label: "1 年",
    value: "1 年",
}));
const __VLS_182 = __VLS_181({
    label: "1 年",
    value: "1 年",
}, ...__VLS_functionalComponentArgsRest(__VLS_181));
var __VLS_167;
var __VLS_163;
const __VLS_184 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_185 = __VLS_asFunctionalComponent(__VLS_184, new __VLS_184({
    label: "申请用途",
}));
const __VLS_186 = __VLS_185({
    label: "申请用途",
}, ...__VLS_functionalComponentArgsRest(__VLS_185));
__VLS_187.slots.default;
const __VLS_188 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_189 = __VLS_asFunctionalComponent(__VLS_188, new __VLS_188({
    modelValue: (__VLS_ctx.applyForm.purpose),
    type: "textarea",
    rows: (3),
    placeholder: "说明使用目的与数据范围",
}));
const __VLS_190 = __VLS_189({
    modelValue: (__VLS_ctx.applyForm.purpose),
    type: "textarea",
    rows: (3),
    placeholder: "说明使用目的与数据范围",
}, ...__VLS_functionalComponentArgsRest(__VLS_189));
var __VLS_187;
var __VLS_147;
{
    const { footer: __VLS_thisSlot } = __VLS_143.slots;
    const __VLS_192 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_193 = __VLS_asFunctionalComponent(__VLS_192, new __VLS_192({
        ...{ 'onClick': {} },
    }));
    const __VLS_194 = __VLS_193({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_193));
    let __VLS_196;
    let __VLS_197;
    let __VLS_198;
    const __VLS_199 = {
        onClick: (...[$event]) => {
            __VLS_ctx.applyVisible = false;
        }
    };
    __VLS_195.slots.default;
    var __VLS_195;
    const __VLS_200 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_201 = __VLS_asFunctionalComponent(__VLS_200, new __VLS_200({
        ...{ 'onClick': {} },
        type: "danger",
    }));
    const __VLS_202 = __VLS_201({
        ...{ 'onClick': {} },
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_201));
    let __VLS_204;
    let __VLS_205;
    let __VLS_206;
    const __VLS_207 = {
        onClick: (__VLS_ctx.submitApply)
    };
    __VLS_203.slots.default;
    var __VLS_203;
}
var __VLS_143;
/** @type {__VLS_StyleScopedClasses['standard-page']} */ ;
/** @type {__VLS_StyleScopedClasses['share-apply-page']} */ ;
/** @type {__VLS_StyleScopedClasses['apply-stats']} */ ;
/** @type {__VLS_StyleScopedClasses['apply-stat']} */ ;
/** @type {__VLS_StyleScopedClasses['apply-stat-value']} */ ;
/** @type {__VLS_StyleScopedClasses['apply-stat-label']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['apply-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['toolbar-row']} */ ;
/** @type {__VLS_StyleScopedClasses['search-input-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['security-level']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['apply-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['security-level']} */ ;
/** @type {__VLS_StyleScopedClasses['block-title']} */ ;
/** @type {__VLS_StyleScopedClasses['flow-steps']} */ ;
/** @type {__VLS_StyleScopedClasses['approve-box']} */ ;
/** @type {__VLS_StyleScopedClasses['approve-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['approve-result']} */ ;
/** @type {__VLS_StyleScopedClasses['dep-text']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
/** @type {__VLS_StyleScopedClasses['approve-comment']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Plus: Plus,
            Search: Search,
            levelColor: levelColor,
            statsCards: statsCards,
            stageTag: stageTag,
            applKeyword: applKeyword,
            current: current,
            comment: comment,
            filteredApplies: filteredApplies,
            flowNodes: flowNodes,
            flowIndex: flowIndex,
            flowName: flowName,
            selectApply: selectApply,
            applyVisible: applyVisible,
            applyForm: applyForm,
            assetOptions: assetOptions,
            openApply: openApply,
            submitApply: submitApply,
            approve: approve,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
