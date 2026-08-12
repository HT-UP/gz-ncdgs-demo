import { computed, reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { Plus, Search } from '@element-plus/icons-vue';
import { mockCertifications } from '@/mock/quality';
const gradeColor = {
    A: '#00A854',
    B: '#2B6CB0',
    C: '#ED7B2F',
    D: '#E34D59',
};
const certStatusTagType = {
    有效: 'success',
    即将到期: 'warning',
    已过期: 'danger',
};
const metrics = [
    { label: '认证资产总数', value: '120', note: '覆盖 7 类数据资产', warning: false },
    { label: 'A/B 级占比', value: '76%', note: '较上季度 +5%', warning: false },
    { label: '即将到期', value: '9', note: '7 天内需续期', warning: true },
    { label: '已过期', value: '3', note: '已进入整改流程', warning: true },
];
const keyword = ref('');
const filterGrade = ref('');
const filterStatus = ref('');
const applyVisible = ref(false);
const certVisible = ref(false);
const certAssetName = ref('');
const certNo = ref('');
const certScore = ref(0);
const certGrade = ref('A');
const certExpire = ref('');
const certs = ref([...mockCertifications]);
const applyForm = reactive({
    assetName: '票务核心库',
    assetType: '数据源',
    note: '',
});
const filteredCerts = computed(() => certs.value.filter((cert) => {
    if (filterGrade.value && cert.grade !== filterGrade.value)
        return false;
    if (filterStatus.value && cert.status !== filterStatus.value)
        return false;
    if (!keyword.value)
        return true;
    const kw = keyword.value.toLowerCase();
    return cert.assetName.toLowerCase().includes(kw) || cert.certNo.toLowerCase().includes(kw);
}));
const openApply = () => {
    Object.assign(applyForm, { assetName: '票务核心库', assetType: '数据源', note: '' });
    applyVisible.value = true;
};
const submitApply = () => {
    applyVisible.value = false;
    ElMessage.success('认证申请已提交，进入评定流程（Mock）');
};
const showCert = (row) => {
    certAssetName.value = row.assetName;
    certNo.value = row.certNo;
    certScore.value = row.score;
    certGrade.value = row.grade;
    certExpire.value = row.expireDate;
    certVisible.value = true;
};
const downloadCert = () => {
    ElMessage.success('认证证书已下载（Mock）');
};
const renewCert = (row) => {
    ElMessage.info(`已为「${row.assetName}」发起续期申请（Mock）`);
};
const showHistory = (row) => {
    ElMessage.info(`「${row.assetName}」认证历史：2024 B级 → 2025 A级 → 2026 ${row.grade}级（Mock）`);
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
for (const [metric] of __VLS_getVForSourceType((__VLS_ctx.metrics))) {
    const __VLS_4 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
        xs: (24),
        lg: (6),
        key: (metric.label),
    }));
    const __VLS_6 = __VLS_5({
        xs: (24),
        lg: (6),
        key: (metric.label),
    }, ...__VLS_functionalComponentArgsRest(__VLS_5));
    __VLS_7.slots.default;
    const __VLS_8 = {}.ElCard;
    /** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
        ...{ class: "metric-card dashboard-card" },
        shadow: "hover",
    }));
    const __VLS_10 = __VLS_9({
        ...{ class: "metric-card dashboard-card" },
        shadow: "hover",
    }, ...__VLS_functionalComponentArgsRest(__VLS_9));
    __VLS_11.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "metric-title" },
    });
    (metric.label);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "metric-value" },
    });
    (metric.value);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "metric-subtitle" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: (metric.warning ? 'trend-negative' : 'trend-positive') },
    });
    (metric.note);
    var __VLS_11;
    var __VLS_7;
}
var __VLS_3;
const __VLS_12 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
    ...{ class: "panel-card dashboard-card mt-16" },
    shadow: "never",
}));
const __VLS_14 = __VLS_13({
    ...{ class: "panel-card dashboard-card mt-16" },
    shadow: "never",
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
__VLS_15.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_15.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    const __VLS_16 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
        ...{ 'onClick': {} },
        type: "danger",
        icon: (__VLS_ctx.Plus),
    }));
    const __VLS_18 = __VLS_17({
        ...{ 'onClick': {} },
        type: "danger",
        icon: (__VLS_ctx.Plus),
    }, ...__VLS_functionalComponentArgsRest(__VLS_17));
    let __VLS_20;
    let __VLS_21;
    let __VLS_22;
    const __VLS_23 = {
        onClick: (__VLS_ctx.openApply)
    };
    __VLS_19.slots.default;
    var __VLS_19;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "toolbar-row" },
});
const __VLS_24 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    modelValue: (__VLS_ctx.keyword),
    placeholder: "按资产名称 / 证书编号搜索",
    clearable: true,
    ...{ class: "search-input" },
    prefixIcon: (__VLS_ctx.Search),
}));
const __VLS_26 = __VLS_25({
    modelValue: (__VLS_ctx.keyword),
    placeholder: "按资产名称 / 证书编号搜索",
    clearable: true,
    ...{ class: "search-input" },
    prefixIcon: (__VLS_ctx.Search),
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
const __VLS_28 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
    modelValue: (__VLS_ctx.filterGrade),
    placeholder: "等级",
    clearable: true,
    ...{ class: "filter-select" },
}));
const __VLS_30 = __VLS_29({
    modelValue: (__VLS_ctx.filterGrade),
    placeholder: "等级",
    clearable: true,
    ...{ class: "filter-select" },
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
__VLS_31.slots.default;
const __VLS_32 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
    label: "A 级",
    value: "A",
}));
const __VLS_34 = __VLS_33({
    label: "A 级",
    value: "A",
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
const __VLS_36 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    label: "B 级",
    value: "B",
}));
const __VLS_38 = __VLS_37({
    label: "B 级",
    value: "B",
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
const __VLS_40 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
    label: "C 级",
    value: "C",
}));
const __VLS_42 = __VLS_41({
    label: "C 级",
    value: "C",
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
const __VLS_44 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    label: "D 级",
    value: "D",
}));
const __VLS_46 = __VLS_45({
    label: "D 级",
    value: "D",
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
var __VLS_31;
const __VLS_48 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
    modelValue: (__VLS_ctx.filterStatus),
    placeholder: "状态",
    clearable: true,
    ...{ class: "filter-select" },
}));
const __VLS_50 = __VLS_49({
    modelValue: (__VLS_ctx.filterStatus),
    placeholder: "状态",
    clearable: true,
    ...{ class: "filter-select" },
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
__VLS_51.slots.default;
const __VLS_52 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
    label: "有效",
    value: "有效",
}));
const __VLS_54 = __VLS_53({
    label: "有效",
    value: "有效",
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
const __VLS_56 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
    label: "即将到期",
    value: "即将到期",
}));
const __VLS_58 = __VLS_57({
    label: "即将到期",
    value: "即将到期",
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
var __VLS_51;
const __VLS_64 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
    data: (__VLS_ctx.filteredCerts),
    stripe: true,
    ...{ class: "mt-12" },
}));
const __VLS_66 = __VLS_65({
    data: (__VLS_ctx.filteredCerts),
    stripe: true,
    ...{ class: "mt-12" },
}, ...__VLS_functionalComponentArgsRest(__VLS_65));
__VLS_67.slots.default;
const __VLS_68 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
    prop: "assetName",
    label: "资产名称",
    minWidth: "150",
}));
const __VLS_70 = __VLS_69({
    prop: "assetName",
    label: "资产名称",
    minWidth: "150",
}, ...__VLS_functionalComponentArgsRest(__VLS_69));
const __VLS_72 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
    prop: "assetType",
    label: "资产类型",
    width: "110",
}));
const __VLS_74 = __VLS_73({
    prop: "assetType",
    label: "资产类型",
    width: "110",
}, ...__VLS_functionalComponentArgsRest(__VLS_73));
const __VLS_76 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
    label: "等级",
    width: "90",
    align: "center",
}));
const __VLS_78 = __VLS_77({
    label: "等级",
    width: "90",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_77));
__VLS_79.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_79.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "grade-badge" },
        ...{ style: ({ background: __VLS_ctx.gradeColor[row.grade], color: '#fff' }) },
    });
    (row.grade);
}
var __VLS_79;
const __VLS_80 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
    label: "评分",
    width: "80",
    align: "center",
}));
const __VLS_82 = __VLS_81({
    label: "评分",
    width: "80",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_81));
__VLS_83.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_83.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    (row.score);
}
var __VLS_83;
const __VLS_84 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
    prop: "certNo",
    label: "证书编号",
    width: "150",
}));
const __VLS_86 = __VLS_85({
    prop: "certNo",
    label: "证书编号",
    width: "150",
}, ...__VLS_functionalComponentArgsRest(__VLS_85));
const __VLS_88 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
    label: "有效期",
    minWidth: "200",
}));
const __VLS_90 = __VLS_89({
    label: "有效期",
    minWidth: "200",
}, ...__VLS_functionalComponentArgsRest(__VLS_89));
__VLS_91.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_91.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    (row.issueDate);
    (row.expireDate);
}
var __VLS_91;
const __VLS_92 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
    label: "状态",
    width: "100",
}));
const __VLS_94 = __VLS_93({
    label: "状态",
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_93));
__VLS_95.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_95.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_96 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
        type: (__VLS_ctx.certStatusTagType[row.status]),
        effect: "dark",
    }));
    const __VLS_98 = __VLS_97({
        type: (__VLS_ctx.certStatusTagType[row.status]),
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
    width: "200",
    fixed: "right",
}));
const __VLS_102 = __VLS_101({
    label: "操作",
    width: "200",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_101));
__VLS_103.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_103.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    if (row.status !== '已过期') {
        const __VLS_104 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
            ...{ 'onClick': {} },
            link: true,
            type: "danger",
        }));
        const __VLS_106 = __VLS_105({
            ...{ 'onClick': {} },
            link: true,
            type: "danger",
        }, ...__VLS_functionalComponentArgsRest(__VLS_105));
        let __VLS_108;
        let __VLS_109;
        let __VLS_110;
        const __VLS_111 = {
            onClick: (...[$event]) => {
                if (!(row.status !== '已过期'))
                    return;
                __VLS_ctx.renewCert(row);
            }
        };
        __VLS_107.slots.default;
        var __VLS_107;
    }
    const __VLS_112 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }));
    const __VLS_114 = __VLS_113({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_113));
    let __VLS_116;
    let __VLS_117;
    let __VLS_118;
    const __VLS_119 = {
        onClick: (...[$event]) => {
            __VLS_ctx.showCert(row);
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
            __VLS_ctx.showHistory(row);
        }
    };
    __VLS_123.slots.default;
    var __VLS_123;
}
var __VLS_103;
var __VLS_67;
const __VLS_128 = {}.ElPagination;
/** @type {[typeof __VLS_components.ElPagination, typeof __VLS_components.elPagination, ]} */ ;
// @ts-ignore
const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({
    ...{ class: "pager" },
    layout: "total, prev, pager, next",
    total: (__VLS_ctx.filteredCerts.length),
    pageSize: (20),
    background: true,
}));
const __VLS_130 = __VLS_129({
    ...{ class: "pager" },
    layout: "total, prev, pager, next",
    total: (__VLS_ctx.filteredCerts.length),
    pageSize: (20),
    background: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_129));
var __VLS_15;
const __VLS_132 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132({
    modelValue: (__VLS_ctx.applyVisible),
    title: "质量认证申请",
    width: "560px",
}));
const __VLS_134 = __VLS_133({
    modelValue: (__VLS_ctx.applyVisible),
    title: "质量认证申请",
    width: "560px",
}, ...__VLS_functionalComponentArgsRest(__VLS_133));
__VLS_135.slots.default;
const __VLS_136 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_137 = __VLS_asFunctionalComponent(__VLS_136, new __VLS_136({
    model: (__VLS_ctx.applyForm),
    labelWidth: "100px",
}));
const __VLS_138 = __VLS_137({
    model: (__VLS_ctx.applyForm),
    labelWidth: "100px",
}, ...__VLS_functionalComponentArgsRest(__VLS_137));
__VLS_139.slots.default;
const __VLS_140 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_141 = __VLS_asFunctionalComponent(__VLS_140, new __VLS_140({
    label: "认证资产",
}));
const __VLS_142 = __VLS_141({
    label: "认证资产",
}, ...__VLS_functionalComponentArgsRest(__VLS_141));
__VLS_143.slots.default;
const __VLS_144 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_145 = __VLS_asFunctionalComponent(__VLS_144, new __VLS_144({
    modelValue: (__VLS_ctx.applyForm.assetName),
    ...{ class: "w-full" },
}));
const __VLS_146 = __VLS_145({
    modelValue: (__VLS_ctx.applyForm.assetName),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_145));
__VLS_147.slots.default;
for (const [asset] of __VLS_getVForSourceType((['票务核心库', '客流分析库', '设备信号库', '乘客信息库', '线路档案库']))) {
    const __VLS_148 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_149 = __VLS_asFunctionalComponent(__VLS_148, new __VLS_148({
        key: (asset),
        label: (asset),
        value: (asset),
    }));
    const __VLS_150 = __VLS_149({
        key: (asset),
        label: (asset),
        value: (asset),
    }, ...__VLS_functionalComponentArgsRest(__VLS_149));
}
var __VLS_147;
var __VLS_143;
const __VLS_152 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_153 = __VLS_asFunctionalComponent(__VLS_152, new __VLS_152({
    label: "资产类型",
}));
const __VLS_154 = __VLS_153({
    label: "资产类型",
}, ...__VLS_functionalComponentArgsRest(__VLS_153));
__VLS_155.slots.default;
const __VLS_156 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_157 = __VLS_asFunctionalComponent(__VLS_156, new __VLS_156({
    modelValue: (__VLS_ctx.applyForm.assetType),
    ...{ class: "w-full" },
}));
const __VLS_158 = __VLS_157({
    modelValue: (__VLS_ctx.applyForm.assetType),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_157));
__VLS_159.slots.default;
const __VLS_160 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_161 = __VLS_asFunctionalComponent(__VLS_160, new __VLS_160({
    label: "数据源",
    value: "数据源",
}));
const __VLS_162 = __VLS_161({
    label: "数据源",
    value: "数据源",
}, ...__VLS_functionalComponentArgsRest(__VLS_161));
const __VLS_164 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_165 = __VLS_asFunctionalComponent(__VLS_164, new __VLS_164({
    label: "数据集市",
    value: "数据集市",
}));
const __VLS_166 = __VLS_165({
    label: "数据集市",
    value: "数据集市",
}, ...__VLS_functionalComponentArgsRest(__VLS_165));
const __VLS_168 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_169 = __VLS_asFunctionalComponent(__VLS_168, new __VLS_168({
    label: "数据表",
    value: "数据表",
}));
const __VLS_170 = __VLS_169({
    label: "数据表",
    value: "数据表",
}, ...__VLS_functionalComponentArgsRest(__VLS_169));
var __VLS_159;
var __VLS_155;
const __VLS_172 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_173 = __VLS_asFunctionalComponent(__VLS_172, new __VLS_172({
    label: "申请说明",
}));
const __VLS_174 = __VLS_173({
    label: "申请说明",
}, ...__VLS_functionalComponentArgsRest(__VLS_173));
__VLS_175.slots.default;
const __VLS_176 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_177 = __VLS_asFunctionalComponent(__VLS_176, new __VLS_176({
    modelValue: (__VLS_ctx.applyForm.note),
    type: "textarea",
    rows: (3),
    placeholder: "填写认证申请说明",
}));
const __VLS_178 = __VLS_177({
    modelValue: (__VLS_ctx.applyForm.note),
    type: "textarea",
    rows: (3),
    placeholder: "填写认证申请说明",
}, ...__VLS_functionalComponentArgsRest(__VLS_177));
var __VLS_175;
var __VLS_139;
{
    const { footer: __VLS_thisSlot } = __VLS_135.slots;
    const __VLS_180 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_181 = __VLS_asFunctionalComponent(__VLS_180, new __VLS_180({
        ...{ 'onClick': {} },
    }));
    const __VLS_182 = __VLS_181({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_181));
    let __VLS_184;
    let __VLS_185;
    let __VLS_186;
    const __VLS_187 = {
        onClick: (...[$event]) => {
            __VLS_ctx.applyVisible = false;
        }
    };
    __VLS_183.slots.default;
    var __VLS_183;
    const __VLS_188 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_189 = __VLS_asFunctionalComponent(__VLS_188, new __VLS_188({
        ...{ 'onClick': {} },
        type: "danger",
    }));
    const __VLS_190 = __VLS_189({
        ...{ 'onClick': {} },
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_189));
    let __VLS_192;
    let __VLS_193;
    let __VLS_194;
    const __VLS_195 = {
        onClick: (__VLS_ctx.submitApply)
    };
    __VLS_191.slots.default;
    var __VLS_191;
}
var __VLS_135;
const __VLS_196 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_197 = __VLS_asFunctionalComponent(__VLS_196, new __VLS_196({
    modelValue: (__VLS_ctx.certVisible),
    title: (`质量认证证书：${__VLS_ctx.certAssetName}`),
    width: "560px",
}));
const __VLS_198 = __VLS_197({
    modelValue: (__VLS_ctx.certVisible),
    title: (`质量认证证书：${__VLS_ctx.certAssetName}`),
    width: "560px",
}, ...__VLS_functionalComponentArgsRest(__VLS_197));
__VLS_199.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "certificate-card" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "cert-head" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "cert-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "cert-no" },
});
(__VLS_ctx.certNo);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "cert-body" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "cert-asset" },
});
(__VLS_ctx.certAssetName);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "cert-score" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "cert-score-num" },
});
(__VLS_ctx.certScore);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "cert-grade" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "grade-badge-grade" },
    ...{ style: ({ background: __VLS_ctx.gradeColor[__VLS_ctx.certGrade], color: '#fff' }) },
});
(__VLS_ctx.certGrade);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "cert-validity" },
});
(__VLS_ctx.certExpire);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "cert-footer" },
});
{
    const { footer: __VLS_thisSlot } = __VLS_199.slots;
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
        onClick: (__VLS_ctx.downloadCert)
    };
    __VLS_203.slots.default;
    var __VLS_203;
}
var __VLS_199;
/** @type {__VLS_StyleScopedClasses['standard-page']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-title']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-value']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-subtitle']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['toolbar-row']} */ ;
/** @type {__VLS_StyleScopedClasses['search-input']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-select']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-select']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-12']} */ ;
/** @type {__VLS_StyleScopedClasses['grade-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['pager']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['certificate-card']} */ ;
/** @type {__VLS_StyleScopedClasses['cert-head']} */ ;
/** @type {__VLS_StyleScopedClasses['cert-title']} */ ;
/** @type {__VLS_StyleScopedClasses['cert-no']} */ ;
/** @type {__VLS_StyleScopedClasses['cert-body']} */ ;
/** @type {__VLS_StyleScopedClasses['cert-asset']} */ ;
/** @type {__VLS_StyleScopedClasses['cert-score']} */ ;
/** @type {__VLS_StyleScopedClasses['cert-score-num']} */ ;
/** @type {__VLS_StyleScopedClasses['cert-grade']} */ ;
/** @type {__VLS_StyleScopedClasses['grade-badge-grade']} */ ;
/** @type {__VLS_StyleScopedClasses['cert-validity']} */ ;
/** @type {__VLS_StyleScopedClasses['cert-footer']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Plus: Plus,
            Search: Search,
            gradeColor: gradeColor,
            certStatusTagType: certStatusTagType,
            metrics: metrics,
            keyword: keyword,
            filterGrade: filterGrade,
            filterStatus: filterStatus,
            applyVisible: applyVisible,
            certVisible: certVisible,
            certAssetName: certAssetName,
            certNo: certNo,
            certScore: certScore,
            certGrade: certGrade,
            certExpire: certExpire,
            applyForm: applyForm,
            filteredCerts: filteredCerts,
            openApply: openApply,
            submitApply: submitApply,
            showCert: showCert,
            downloadCert: downloadCert,
            renewCert: renewCert,
            showHistory: showHistory,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
