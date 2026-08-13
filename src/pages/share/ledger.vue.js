import { computed, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Download, Search } from '@element-plus/icons-vue';
const levelColor = { L1: '#8c8c8c', L2: '#2B6CB0', L3: '#ED7B2F', L4: '#DA251D' };
const statsCards = [
    { label: '有效授权', value: '18', color: '#fff', bg: 'linear-gradient(135deg, #DA251D, #B71C1C)' },
    { label: '即将到期(≤30天)', value: '3', color: '#ED7B2F', bg: 'rgba(237,123,47,.1)' },
    { label: '已回收/已到期', value: '7', color: '#8c8c8c', bg: 'rgba(140,140,140,.1)' },
    { label: '审计通过率', value: '96.8%', color: '#00A854', bg: 'rgba(0,168,84,.1)' },
];
const statusTag = {
    有效: 'success',
    即将到期: 'warning',
    已到期: 'danger',
    已回收: 'info',
};
const records = ref([
    { authNo: 'AUTH-2026-052', applyNo: 'SH-2026-030', asset: 'line_info（线路基础信息）', consumer: '外部合作单位', level: 'L1', grantTime: '2026-08-05', expireTime: '2027-08-04', status: '有效' },
    { authNo: 'AUTH-2026-048', applyNo: 'SH-2026-027', asset: 'ads_line_flow（客流指标）', consumer: '线网规划仿真系统', level: 'L2', grantTime: '2026-07-20', expireTime: '2026-10-18', status: '有效' },
    { authNo: 'AUTH-2026-041', applyNo: 'SH-2026-022', asset: 'dws_order_report（订单汇总）', consumer: '智能客流分析平台', level: 'L2', grantTime: '2026-07-10', expireTime: '2026-09-08', status: '即将到期' },
    { authNo: 'AUTH-2026-036', applyNo: 'SH-2026-018', asset: 'station_info（车站信息）', consumer: '车站大屏展示端', level: 'L1', grantTime: '2026-06-28', expireTime: '2026-08-27', status: '即将到期' },
    { authNo: 'AUTH-2026-030', applyNo: 'SH-2026-014', asset: 'ticket_sale（售票明细）', consumer: '科研合作项目组', level: 'L3', grantTime: '2026-06-15', expireTime: '2026-07-14', status: '已到期' },
    { authNo: 'AUTH-2026-022', applyNo: 'SH-2026-009', asset: 'payment_record（支付流水）', consumer: '财务共享中心', level: 'L4', grantTime: '2026-05-20', expireTime: '2026-06-19', status: '已回收' },
]);
const ledgerKeyword = ref('');
const statusFilter = ref('');
const levelFilter = ref('');
const filteredLedger = computed(() => records.value.filter((r) => {
    if (statusFilter.value && r.status !== statusFilter.value)
        return false;
    if (levelFilter.value && r.level !== levelFilter.value)
        return false;
    if (!ledgerKeyword.value)
        return true;
    const kw = ledgerKeyword.value.toLowerCase();
    return r.authNo.toLowerCase().includes(kw) || r.asset.toLowerCase().includes(kw) || r.consumer.toLowerCase().includes(kw);
}));
const renewalWindow = (row) => {
    const days = Math.max(0, Math.ceil((new Date(row.expireTime).getTime() - Date.now()) / 86400000));
    return days;
};
const renew = (row) => {
    ElMessageBox.confirm(`确认将「${row.asset}」授权续期 90 天？（当前剩余 ${renewalWindow(row)} 天 / Mock）`, '续期确认', { type: 'info' })
        .then(() => {
        const d = new Date();
        d.setDate(d.getDate() + 90);
        row.expireTime = d.toLocaleDateString('sv-SE');
        row.status = '有效';
        ElMessage.success('授权已续期 90 天（Mock）');
    })
        .catch(() => { });
};
const recycle = (row) => {
    ElMessageBox.confirm(`确认回收「${row.asset}」对「${row.consumer}」的授权？回收后调用立即中断。`, '授权回收', { type: 'warning', confirmButtonText: '确认回收' })
        .then(() => {
        row.status = '已回收';
        ElMessage.success('授权已回收，调用凭证同步失效（Mock）');
    })
        .catch(() => { });
};
const auditVisible = ref(false);
const auditResults = [
    { authNo: 'AUTH-2026-052', item: '授权范围与申请单一致', conclusion: '合规', note: 'OK' },
    { authNo: 'AUTH-2026-041', item: '到期前回收提醒已触发', conclusion: '合规', note: '已发送提醒' },
    { authNo: 'AUTH-2026-036', item: 'L1 资产未启用脱敏', conclusion: '关注', note: '建议启用脱敏预览' },
    { authNo: 'AUTH-2026-030', item: '超期使用', conclusion: '关注', note: '已到期未自动回收，建议立即回收' },
];
const runAudit = () => {
    auditVisible.value = true;
};
const viewAudit = (row) => {
    ElMessage.info(`查看「${row.authNo}」审计轨迹：申请→审批→授权→使用→（回收）（Mock）`);
};
const exportLedger = () => ElMessage.success(`已导出 ${filteredLedger.value.length} 条台账记录（Excel/Mock）`);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "standard-page share-ledger-page" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "ledger-stats" },
});
for (const [s] of __VLS_getVForSourceType((__VLS_ctx.statsCards))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (s.label),
        ...{ class: "ledger-stat" },
        ...{ style: ({ background: s.bg, color: s.color }) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "ledger-stat-value" },
    });
    (s.value);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "ledger-stat-label" },
    });
    (s.label);
}
const __VLS_0 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ class: "panel-card" },
    shadow: "never",
}));
const __VLS_2 = __VLS_1({
    ...{ class: "panel-card" },
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
        size: "small",
        type: "primary",
        plain: true,
        icon: (__VLS_ctx.Search),
    }));
    const __VLS_6 = __VLS_5({
        ...{ 'onClick': {} },
        size: "small",
        type: "primary",
        plain: true,
        icon: (__VLS_ctx.Search),
    }, ...__VLS_functionalComponentArgsRest(__VLS_5));
    let __VLS_8;
    let __VLS_9;
    let __VLS_10;
    const __VLS_11 = {
        onClick: (__VLS_ctx.runAudit)
    };
    __VLS_7.slots.default;
    var __VLS_7;
    const __VLS_12 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
        ...{ 'onClick': {} },
        size: "small",
        type: "danger",
        plain: true,
        icon: (__VLS_ctx.Download),
    }));
    const __VLS_14 = __VLS_13({
        ...{ 'onClick': {} },
        size: "small",
        type: "danger",
        plain: true,
        icon: (__VLS_ctx.Download),
    }, ...__VLS_functionalComponentArgsRest(__VLS_13));
    let __VLS_16;
    let __VLS_17;
    let __VLS_18;
    const __VLS_19 = {
        onClick: (__VLS_ctx.exportLedger)
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
    modelValue: (__VLS_ctx.ledgerKeyword),
    placeholder: "按授权编号 / 资产 / 使用方搜索",
    clearable: true,
    ...{ class: "search-input" },
    prefixIcon: (__VLS_ctx.Search),
}));
const __VLS_22 = __VLS_21({
    modelValue: (__VLS_ctx.ledgerKeyword),
    placeholder: "按授权编号 / 资产 / 使用方搜索",
    clearable: true,
    ...{ class: "search-input" },
    prefixIcon: (__VLS_ctx.Search),
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
const __VLS_24 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    modelValue: (__VLS_ctx.statusFilter),
    placeholder: "状态",
    clearable: true,
    ...{ class: "filter-select" },
}));
const __VLS_26 = __VLS_25({
    modelValue: (__VLS_ctx.statusFilter),
    placeholder: "状态",
    clearable: true,
    ...{ class: "filter-select" },
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
__VLS_27.slots.default;
for (const [s] of __VLS_getVForSourceType((['有效', '即将到期', '已到期', '已回收']))) {
    const __VLS_28 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
        key: (s),
        label: (s),
        value: (s),
    }));
    const __VLS_30 = __VLS_29({
        key: (s),
        label: (s),
        value: (s),
    }, ...__VLS_functionalComponentArgsRest(__VLS_29));
}
var __VLS_27;
const __VLS_32 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
    modelValue: (__VLS_ctx.levelFilter),
    placeholder: "数据级别",
    clearable: true,
    ...{ class: "filter-select" },
}));
const __VLS_34 = __VLS_33({
    modelValue: (__VLS_ctx.levelFilter),
    placeholder: "数据级别",
    clearable: true,
    ...{ class: "filter-select" },
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
__VLS_35.slots.default;
for (const [l] of __VLS_getVForSourceType((['L1', 'L2', 'L3', 'L4']))) {
    const __VLS_36 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
        key: (l),
        label: (l),
        value: (l),
    }));
    const __VLS_38 = __VLS_37({
        key: (l),
        label: (l),
        value: (l),
    }, ...__VLS_functionalComponentArgsRest(__VLS_37));
}
var __VLS_35;
const __VLS_40 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
    data: (__VLS_ctx.filteredLedger),
    size: "small",
    stripe: true,
    ...{ class: "mt-12" },
}));
const __VLS_42 = __VLS_41({
    data: (__VLS_ctx.filteredLedger),
    size: "small",
    stripe: true,
    ...{ class: "mt-12" },
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
__VLS_43.slots.default;
const __VLS_44 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    prop: "authNo",
    label: "授权编号",
    width: "110",
}));
const __VLS_46 = __VLS_45({
    prop: "authNo",
    label: "授权编号",
    width: "110",
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
const __VLS_48 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
    prop: "applyNo",
    label: "申请单号",
    width: "110",
}));
const __VLS_50 = __VLS_49({
    prop: "applyNo",
    label: "申请单号",
    width: "110",
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
const __VLS_52 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
    prop: "asset",
    label: "共享资产/服务",
    minWidth: "170",
    showOverflowTooltip: true,
}));
const __VLS_54 = __VLS_53({
    prop: "asset",
    label: "共享资产/服务",
    minWidth: "170",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
const __VLS_56 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
    prop: "consumer",
    label: "使用方",
    minWidth: "120",
    showOverflowTooltip: true,
}));
const __VLS_58 = __VLS_57({
    prop: "consumer",
    label: "使用方",
    minWidth: "120",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
const __VLS_60 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
    label: "级别",
    width: "60",
    align: "center",
}));
const __VLS_62 = __VLS_61({
    label: "级别",
    width: "60",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_61));
__VLS_63.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_63.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "security-level" },
        ...{ style: ({ background: __VLS_ctx.levelColor[row.level] }) },
    });
    (row.level);
}
var __VLS_63;
const __VLS_64 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
    prop: "grantTime",
    label: "授权时间",
    width: "96",
}));
const __VLS_66 = __VLS_65({
    prop: "grantTime",
    label: "授权时间",
    width: "96",
}, ...__VLS_functionalComponentArgsRest(__VLS_65));
const __VLS_68 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
    prop: "expireTime",
    label: "到期时间",
    width: "96",
}));
const __VLS_70 = __VLS_69({
    prop: "expireTime",
    label: "到期时间",
    width: "96",
}, ...__VLS_functionalComponentArgsRest(__VLS_69));
const __VLS_72 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
    label: "状态",
    width: "84",
}));
const __VLS_74 = __VLS_73({
    label: "状态",
    width: "84",
}, ...__VLS_functionalComponentArgsRest(__VLS_73));
__VLS_75.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_75.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_76 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
        size: "small",
        type: (__VLS_ctx.statusTag[row.status]),
        effect: "dark",
    }));
    const __VLS_78 = __VLS_77({
        size: "small",
        type: (__VLS_ctx.statusTag[row.status]),
        effect: "dark",
    }, ...__VLS_functionalComponentArgsRest(__VLS_77));
    __VLS_79.slots.default;
    (row.status);
    var __VLS_79;
}
var __VLS_75;
const __VLS_80 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
    label: "操作",
    width: "150",
    fixed: "right",
}));
const __VLS_82 = __VLS_81({
    label: "操作",
    width: "150",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_81));
__VLS_83.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_83.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    if (row.status === '有效') {
        const __VLS_84 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
            ...{ 'onClick': {} },
            link: true,
            type: "warning",
            size: "small",
        }));
        const __VLS_86 = __VLS_85({
            ...{ 'onClick': {} },
            link: true,
            type: "warning",
            size: "small",
        }, ...__VLS_functionalComponentArgsRest(__VLS_85));
        let __VLS_88;
        let __VLS_89;
        let __VLS_90;
        const __VLS_91 = {
            onClick: (...[$event]) => {
                if (!(row.status === '有效'))
                    return;
                __VLS_ctx.renew(row);
            }
        };
        __VLS_87.slots.default;
        var __VLS_87;
    }
    if (row.status === '有效' || row.status === '即将到期') {
        const __VLS_92 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
            ...{ 'onClick': {} },
            link: true,
            type: "danger",
            size: "small",
        }));
        const __VLS_94 = __VLS_93({
            ...{ 'onClick': {} },
            link: true,
            type: "danger",
            size: "small",
        }, ...__VLS_functionalComponentArgsRest(__VLS_93));
        let __VLS_96;
        let __VLS_97;
        let __VLS_98;
        const __VLS_99 = {
            onClick: (...[$event]) => {
                if (!(row.status === '有效' || row.status === '即将到期'))
                    return;
                __VLS_ctx.recycle(row);
            }
        };
        __VLS_95.slots.default;
        var __VLS_95;
    }
    const __VLS_100 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
        ...{ 'onClick': {} },
        link: true,
        type: "info",
        size: "small",
    }));
    const __VLS_102 = __VLS_101({
        ...{ 'onClick': {} },
        link: true,
        type: "info",
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_101));
    let __VLS_104;
    let __VLS_105;
    let __VLS_106;
    const __VLS_107 = {
        onClick: (...[$event]) => {
            __VLS_ctx.viewAudit(row);
        }
    };
    __VLS_103.slots.default;
    var __VLS_103;
}
var __VLS_83;
var __VLS_43;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "pager" },
});
const __VLS_108 = {}.ElPagination;
/** @type {[typeof __VLS_components.ElPagination, typeof __VLS_components.elPagination, ]} */ ;
// @ts-ignore
const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
    background: true,
    layout: "total, prev, pager, next",
    total: (__VLS_ctx.filteredLedger.length),
    pageSize: (10),
}));
const __VLS_110 = __VLS_109({
    background: true,
    layout: "total, prev, pager, next",
    total: (__VLS_ctx.filteredLedger.length),
    pageSize: (10),
}, ...__VLS_functionalComponentArgsRest(__VLS_109));
var __VLS_3;
const __VLS_112 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
    modelValue: (__VLS_ctx.auditVisible),
    title: "授权台账合规审计",
    width: "620px",
}));
const __VLS_114 = __VLS_113({
    modelValue: (__VLS_ctx.auditVisible),
    title: "授权台账合规审计",
    width: "620px",
}, ...__VLS_functionalComponentArgsRest(__VLS_113));
__VLS_115.slots.default;
const __VLS_116 = {}.ElAlert;
/** @type {[typeof __VLS_components.ElAlert, typeof __VLS_components.elAlert, typeof __VLS_components.ElAlert, typeof __VLS_components.elAlert, ]} */ ;
// @ts-ignore
const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
    type: "success",
    closable: (false),
    showIcon: true,
    ...{ class: "mb-12" },
}));
const __VLS_118 = __VLS_117({
    type: "success",
    closable: (false),
    showIcon: true,
    ...{ class: "mb-12" },
}, ...__VLS_functionalComponentArgsRest(__VLS_117));
__VLS_119.slots.default;
{
    const { title: __VLS_thisSlot } = __VLS_119.slots;
    (__VLS_ctx.records.length);
}
var __VLS_119;
const __VLS_120 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({
    data: (__VLS_ctx.auditResults),
    size: "small",
    border: true,
}));
const __VLS_122 = __VLS_121({
    data: (__VLS_ctx.auditResults),
    size: "small",
    border: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_121));
__VLS_123.slots.default;
const __VLS_124 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({
    prop: "authNo",
    label: "授权编号",
    width: "110",
}));
const __VLS_126 = __VLS_125({
    prop: "authNo",
    label: "授权编号",
    width: "110",
}, ...__VLS_functionalComponentArgsRest(__VLS_125));
const __VLS_128 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({
    prop: "item",
    label: "核查项",
    minWidth: "180",
}));
const __VLS_130 = __VLS_129({
    prop: "item",
    label: "核查项",
    minWidth: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_129));
const __VLS_132 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132({
    label: "结论",
    width: "80",
    align: "center",
}));
const __VLS_134 = __VLS_133({
    label: "结论",
    width: "80",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_133));
__VLS_135.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_135.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_136 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_137 = __VLS_asFunctionalComponent(__VLS_136, new __VLS_136({
        size: "small",
        type: (row.conclusion === '合规' ? 'success' : 'warning'),
        effect: "dark",
    }));
    const __VLS_138 = __VLS_137({
        size: "small",
        type: (row.conclusion === '合规' ? 'success' : 'warning'),
        effect: "dark",
    }, ...__VLS_functionalComponentArgsRest(__VLS_137));
    __VLS_139.slots.default;
    (row.conclusion);
    var __VLS_139;
}
var __VLS_135;
const __VLS_140 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_141 = __VLS_asFunctionalComponent(__VLS_140, new __VLS_140({
    prop: "note",
    label: "说明",
    minWidth: "150",
}));
const __VLS_142 = __VLS_141({
    prop: "note",
    label: "说明",
    minWidth: "150",
}, ...__VLS_functionalComponentArgsRest(__VLS_141));
var __VLS_123;
{
    const { footer: __VLS_thisSlot } = __VLS_115.slots;
    const __VLS_144 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_145 = __VLS_asFunctionalComponent(__VLS_144, new __VLS_144({
        ...{ 'onClick': {} },
        type: "primary",
        plain: true,
    }));
    const __VLS_146 = __VLS_145({
        ...{ 'onClick': {} },
        type: "primary",
        plain: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_145));
    let __VLS_148;
    let __VLS_149;
    let __VLS_150;
    const __VLS_151 = {
        onClick: (...[$event]) => {
            __VLS_ctx.auditVisible = false;
        }
    };
    __VLS_147.slots.default;
    var __VLS_147;
}
var __VLS_115;
/** @type {__VLS_StyleScopedClasses['standard-page']} */ ;
/** @type {__VLS_StyleScopedClasses['share-ledger-page']} */ ;
/** @type {__VLS_StyleScopedClasses['ledger-stats']} */ ;
/** @type {__VLS_StyleScopedClasses['ledger-stat']} */ ;
/** @type {__VLS_StyleScopedClasses['ledger-stat-value']} */ ;
/** @type {__VLS_StyleScopedClasses['ledger-stat-label']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['toolbar-row']} */ ;
/** @type {__VLS_StyleScopedClasses['search-input']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-select']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-select']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-12']} */ ;
/** @type {__VLS_StyleScopedClasses['security-level']} */ ;
/** @type {__VLS_StyleScopedClasses['pager']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-12']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Download: Download,
            Search: Search,
            levelColor: levelColor,
            statsCards: statsCards,
            statusTag: statusTag,
            records: records,
            ledgerKeyword: ledgerKeyword,
            statusFilter: statusFilter,
            levelFilter: levelFilter,
            filteredLedger: filteredLedger,
            renew: renew,
            recycle: recycle,
            auditVisible: auditVisible,
            auditResults: auditResults,
            runAudit: runAudit,
            viewAudit: viewAudit,
            exportLedger: exportLedger,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
