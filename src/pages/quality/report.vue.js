import { computed, reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { ArrowDown, Calendar, DocumentCopy, Plus, Promotion, Search, TrendCharts } from '@element-plus/icons-vue';
import { mockQualityTasks } from '@/mock/quality';
const freqs = ['日报告', '周报告', '月报告', '季度报告', '年度报告'];
const reportNames = ['数据质量周报', '数据质量月报', '票务域质量日报', '设备域季度报告', '年度质量总报告'];
const reports = ref(mockQualityTasks.slice(0, 56).map((task, index) => ({
    id: `rp-${index + 1}`,
    name: reportNames[index % reportNames.length],
    freq: freqs[index % freqs.length],
    dimension: ['按业务域', '按组织单位', '按系统', '按表/字段'][index % 4],
    generatedAt: task.lastRunTime,
    creator: task.owner,
    summary: `${90 - (index % 8)}.${index % 10} 分，共检查 ${task.passCount.toLocaleString()} 条数据`,
    templateName: '标准质量报告',
})));
const templates = [
    { name: '标准质量报告', description: '五维度评分 + 明细', icon: DocumentCopy },
    { name: '日报速览模板', description: '核心指标快速呈现', icon: Calendar },
    { name: '趋势分析模板', description: '多维趋势与预测', icon: TrendCharts },
];
const subscriptions = [
    { name: '月度质量报告订阅', desc: '每月 1 日 09:00 推送', channel: '邮件 + 站内' },
    { name: '票务域日报订阅', desc: '每日 08:30 推送', channel: '邮件' },
    { name: '季度合规报告订阅', desc: '每季度初推送', channel: '站内' },
];
const keyword = ref('');
const filterFreq = ref('');
const createVisible = ref(false);
const previewVisible = ref(false);
const subscribeVisible = ref(false);
const preview = ref(reports.value[0]);
const previewItems = [
    { label: '完整性', value: 95 },
    { label: '准确性', value: 91 },
    { label: '一致性', value: 89 },
    { label: '唯一性', value: 94 },
    { label: '及时性', value: 92 },
];
const createForm = reactive({
    name: '',
    freq: '月报告',
    dimension: '按业务域',
    template: '标准质量报告',
    subscribe: true,
});
const subscribeForm = reactive({
    target: '月报告',
    channel: ['邮件'],
    users: ['张三'],
});
const filteredReports = computed(() => reports.value.filter((report) => {
    if (filterFreq.value && report.freq !== filterFreq.value)
        return false;
    if (!keyword.value)
        return true;
    return report.name.toLowerCase().includes(keyword.value.toLowerCase());
}));
const openCreate = () => {
    Object.assign(createForm, { name: '', freq: '月报告', dimension: '按业务域', template: '标准质量报告', subscribe: true });
    createVisible.value = true;
};
const saveCreate = () => {
    if (!createForm.name.trim()) {
        ElMessage.warning('请输入报告名称');
        return;
    }
    reports.value.unshift({
        id: `rp-mock-${Date.now()}`,
        name: createForm.name,
        freq: createForm.freq,
        dimension: createForm.dimension,
        generatedAt: new Date().toLocaleString('sv-SE').replace('T', ' '),
        creator: '张三',
        summary: '新报告生成中，请稍后刷新',
        templateName: createForm.template,
    });
    createVisible.value = false;
    ElMessage.success(`报告「${createForm.name}」已开始生成（Mock）`);
};
const exportReport = (row, format) => {
    ElMessage.success(`报告「${row.name}」已导出为 ${format} 格式（Mock）`);
};
const previewReport = (row) => {
    preview.value = row;
    previewVisible.value = true;
};
const regenerate = (row) => {
    row.generatedAt = new Date().toLocaleString('sv-SE').replace('T', ' ');
    ElMessage.success(`报告「${row.name}」已重新生成（Mock）`);
};
const applyTemplate = (template) => {
    createForm.template = template.name;
    ElMessage.success(`已选择报告模板「${template.name}」`);
};
const openSubscribe = () => {
    Object.assign(subscribeForm, { target: '月报告', channel: ['邮件'], users: ['张三'] });
    subscribeVisible.value = true;
};
const saveSubscribe = () => {
    subscribeVisible.value = false;
    ElMessage.success('订阅推送已配置（Mock）');
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
    placeholder: "按报告名称搜索",
    clearable: true,
    ...{ class: "search-input" },
    prefixIcon: (__VLS_ctx.Search),
}));
const __VLS_22 = __VLS_21({
    modelValue: (__VLS_ctx.keyword),
    placeholder: "按报告名称搜索",
    clearable: true,
    ...{ class: "search-input" },
    prefixIcon: (__VLS_ctx.Search),
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
const __VLS_24 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    modelValue: (__VLS_ctx.filterFreq),
    placeholder: "生成频度",
    clearable: true,
    ...{ class: "filter-select" },
}));
const __VLS_26 = __VLS_25({
    modelValue: (__VLS_ctx.filterFreq),
    placeholder: "生成频度",
    clearable: true,
    ...{ class: "filter-select" },
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
__VLS_27.slots.default;
const __VLS_28 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
    label: "日报告",
    value: "日报告",
}));
const __VLS_30 = __VLS_29({
    label: "日报告",
    value: "日报告",
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
const __VLS_32 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
    label: "周报告",
    value: "周报告",
}));
const __VLS_34 = __VLS_33({
    label: "周报告",
    value: "周报告",
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
const __VLS_36 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    label: "月报告",
    value: "月报告",
}));
const __VLS_38 = __VLS_37({
    label: "月报告",
    value: "月报告",
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
const __VLS_40 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
    label: "季度报告",
    value: "季度报告",
}));
const __VLS_42 = __VLS_41({
    label: "季度报告",
    value: "季度报告",
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
const __VLS_44 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    label: "年度报告",
    value: "年度报告",
}));
const __VLS_46 = __VLS_45({
    label: "年度报告",
    value: "年度报告",
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
var __VLS_27;
const __VLS_48 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
    data: (__VLS_ctx.filteredReports),
    stripe: true,
    ...{ class: "mt-12" },
}));
const __VLS_50 = __VLS_49({
    data: (__VLS_ctx.filteredReports),
    stripe: true,
    ...{ class: "mt-12" },
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
__VLS_51.slots.default;
const __VLS_52 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
    prop: "name",
    label: "报告名称",
    minWidth: "170",
}));
const __VLS_54 = __VLS_53({
    prop: "name",
    label: "报告名称",
    minWidth: "170",
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
const __VLS_56 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
    prop: "freq",
    label: "频度",
    width: "100",
}));
const __VLS_58 = __VLS_57({
    prop: "freq",
    label: "频度",
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
__VLS_59.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_59.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_60 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
        effect: "plain",
        type: "danger",
    }));
    const __VLS_62 = __VLS_61({
        effect: "plain",
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_61));
    __VLS_63.slots.default;
    (row.freq);
    var __VLS_63;
}
var __VLS_59;
const __VLS_64 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
    prop: "dimension",
    label: "维度",
    width: "120",
}));
const __VLS_66 = __VLS_65({
    prop: "dimension",
    label: "维度",
    width: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_65));
const __VLS_68 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
    prop: "generatedAt",
    label: "生成时间",
    width: "150",
}));
const __VLS_70 = __VLS_69({
    prop: "generatedAt",
    label: "生成时间",
    width: "150",
}, ...__VLS_functionalComponentArgsRest(__VLS_69));
const __VLS_72 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
    prop: "creator",
    label: "创建人",
    width: "80",
}));
const __VLS_74 = __VLS_73({
    prop: "creator",
    label: "创建人",
    width: "80",
}, ...__VLS_functionalComponentArgsRest(__VLS_73));
const __VLS_76 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
    label: "内容概览",
    minWidth: "200",
}));
const __VLS_78 = __VLS_77({
    label: "内容概览",
    minWidth: "200",
}, ...__VLS_functionalComponentArgsRest(__VLS_77));
__VLS_79.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_79.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "dep-text" },
    });
    (row.summary);
}
var __VLS_79;
const __VLS_80 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
    label: "操作",
    width: "200",
    fixed: "right",
}));
const __VLS_82 = __VLS_81({
    label: "操作",
    width: "200",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_81));
__VLS_83.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_83.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_84 = {}.ElDropdown;
    /** @type {[typeof __VLS_components.ElDropdown, typeof __VLS_components.elDropdown, typeof __VLS_components.ElDropdown, typeof __VLS_components.elDropdown, ]} */ ;
    // @ts-ignore
    const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
        ...{ 'onCommand': {} },
        trigger: "click",
    }));
    const __VLS_86 = __VLS_85({
        ...{ 'onCommand': {} },
        trigger: "click",
    }, ...__VLS_functionalComponentArgsRest(__VLS_85));
    let __VLS_88;
    let __VLS_89;
    let __VLS_90;
    const __VLS_91 = {
        onCommand: ((format) => __VLS_ctx.exportReport(row, format))
    };
    __VLS_87.slots.default;
    const __VLS_92 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
        link: true,
        type: "danger",
    }));
    const __VLS_94 = __VLS_93({
        link: true,
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_93));
    __VLS_95.slots.default;
    const __VLS_96 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
        ...{ class: "el-icon--right" },
    }));
    const __VLS_98 = __VLS_97({
        ...{ class: "el-icon--right" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_97));
    __VLS_99.slots.default;
    const __VLS_100 = {}.ArrowDown;
    /** @type {[typeof __VLS_components.ArrowDown, ]} */ ;
    // @ts-ignore
    const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({}));
    const __VLS_102 = __VLS_101({}, ...__VLS_functionalComponentArgsRest(__VLS_101));
    var __VLS_99;
    var __VLS_95;
    {
        const { dropdown: __VLS_thisSlot } = __VLS_87.slots;
        const __VLS_104 = {}.ElDropdownMenu;
        /** @type {[typeof __VLS_components.ElDropdownMenu, typeof __VLS_components.elDropdownMenu, typeof __VLS_components.ElDropdownMenu, typeof __VLS_components.elDropdownMenu, ]} */ ;
        // @ts-ignore
        const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({}));
        const __VLS_106 = __VLS_105({}, ...__VLS_functionalComponentArgsRest(__VLS_105));
        __VLS_107.slots.default;
        const __VLS_108 = {}.ElDropdownItem;
        /** @type {[typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, ]} */ ;
        // @ts-ignore
        const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
            command: "PDF",
        }));
        const __VLS_110 = __VLS_109({
            command: "PDF",
        }, ...__VLS_functionalComponentArgsRest(__VLS_109));
        __VLS_111.slots.default;
        var __VLS_111;
        const __VLS_112 = {}.ElDropdownItem;
        /** @type {[typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, ]} */ ;
        // @ts-ignore
        const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
            command: "Excel",
        }));
        const __VLS_114 = __VLS_113({
            command: "Excel",
        }, ...__VLS_functionalComponentArgsRest(__VLS_113));
        __VLS_115.slots.default;
        var __VLS_115;
        const __VLS_116 = {}.ElDropdownItem;
        /** @type {[typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, ]} */ ;
        // @ts-ignore
        const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
            command: "HTML",
        }));
        const __VLS_118 = __VLS_117({
            command: "HTML",
        }, ...__VLS_functionalComponentArgsRest(__VLS_117));
        __VLS_119.slots.default;
        var __VLS_119;
        var __VLS_107;
    }
    var __VLS_87;
    const __VLS_120 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }));
    const __VLS_122 = __VLS_121({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_121));
    let __VLS_124;
    let __VLS_125;
    let __VLS_126;
    const __VLS_127 = {
        onClick: (...[$event]) => {
            __VLS_ctx.previewReport(row);
        }
    };
    __VLS_123.slots.default;
    var __VLS_123;
    const __VLS_128 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({
        ...{ 'onClick': {} },
        link: true,
        type: "warning",
    }));
    const __VLS_130 = __VLS_129({
        ...{ 'onClick': {} },
        link: true,
        type: "warning",
    }, ...__VLS_functionalComponentArgsRest(__VLS_129));
    let __VLS_132;
    let __VLS_133;
    let __VLS_134;
    const __VLS_135 = {
        onClick: (...[$event]) => {
            __VLS_ctx.regenerate(row);
        }
    };
    __VLS_131.slots.default;
    var __VLS_131;
}
var __VLS_83;
var __VLS_51;
const __VLS_136 = {}.ElPagination;
/** @type {[typeof __VLS_components.ElPagination, typeof __VLS_components.elPagination, ]} */ ;
// @ts-ignore
const __VLS_137 = __VLS_asFunctionalComponent(__VLS_136, new __VLS_136({
    ...{ class: "pager" },
    layout: "total, prev, pager, next",
    total: (__VLS_ctx.filteredReports.length),
    pageSize: (20),
    background: true,
}));
const __VLS_138 = __VLS_137({
    ...{ class: "pager" },
    layout: "total, prev, pager, next",
    total: (__VLS_ctx.filteredReports.length),
    pageSize: (20),
    background: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_137));
var __VLS_11;
var __VLS_7;
const __VLS_140 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_141 = __VLS_asFunctionalComponent(__VLS_140, new __VLS_140({
    span: (8),
}));
const __VLS_142 = __VLS_141({
    span: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_141));
__VLS_143.slots.default;
const __VLS_144 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_145 = __VLS_asFunctionalComponent(__VLS_144, new __VLS_144({
    ...{ class: "panel-card dashboard-card" },
    shadow: "never",
}));
const __VLS_146 = __VLS_145({
    ...{ class: "panel-card dashboard-card" },
    shadow: "never",
}, ...__VLS_functionalComponentArgsRest(__VLS_145));
__VLS_147.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_147.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
}
for (const [template] of __VLS_getVForSourceType((__VLS_ctx.templates))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.applyTemplate(template);
            } },
        key: (template.name),
        ...{ class: "template-item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "template-icon" },
    });
    const __VLS_148 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_149 = __VLS_asFunctionalComponent(__VLS_148, new __VLS_148({
        size: (18),
    }));
    const __VLS_150 = __VLS_149({
        size: (18),
    }, ...__VLS_functionalComponentArgsRest(__VLS_149));
    __VLS_151.slots.default;
    const __VLS_152 = ((template.icon));
    // @ts-ignore
    const __VLS_153 = __VLS_asFunctionalComponent(__VLS_152, new __VLS_152({}));
    const __VLS_154 = __VLS_153({}, ...__VLS_functionalComponentArgsRest(__VLS_153));
    var __VLS_151;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "template-info" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "template-name" },
    });
    (template.name);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "template-desc" },
    });
    (template.description);
}
var __VLS_147;
const __VLS_156 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_157 = __VLS_asFunctionalComponent(__VLS_156, new __VLS_156({
    ...{ class: "panel-card dashboard-card mt-16" },
    shadow: "never",
}));
const __VLS_158 = __VLS_157({
    ...{ class: "panel-card dashboard-card mt-16" },
    shadow: "never",
}, ...__VLS_functionalComponentArgsRest(__VLS_157));
__VLS_159.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_159.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    const __VLS_160 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_161 = __VLS_asFunctionalComponent(__VLS_160, new __VLS_160({
        ...{ 'onClick': {} },
        type: "danger",
        size: "small",
    }));
    const __VLS_162 = __VLS_161({
        ...{ 'onClick': {} },
        type: "danger",
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_161));
    let __VLS_164;
    let __VLS_165;
    let __VLS_166;
    const __VLS_167 = {
        onClick: (__VLS_ctx.openSubscribe)
    };
    __VLS_163.slots.default;
    var __VLS_163;
}
for (const [sub] of __VLS_getVForSourceType((__VLS_ctx.subscriptions))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (sub.name),
        ...{ class: "coop-item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "coop-item-icon" },
    });
    const __VLS_168 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_169 = __VLS_asFunctionalComponent(__VLS_168, new __VLS_168({
        size: (16),
    }));
    const __VLS_170 = __VLS_169({
        size: (16),
    }, ...__VLS_functionalComponentArgsRest(__VLS_169));
    __VLS_171.slots.default;
    const __VLS_172 = {}.Promotion;
    /** @type {[typeof __VLS_components.Promotion, ]} */ ;
    // @ts-ignore
    const __VLS_173 = __VLS_asFunctionalComponent(__VLS_172, new __VLS_172({}));
    const __VLS_174 = __VLS_173({}, ...__VLS_functionalComponentArgsRest(__VLS_173));
    var __VLS_171;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "coop-item-info" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "coop-item-name" },
    });
    (sub.name);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "coop-item-desc" },
    });
    (sub.desc);
    (sub.channel);
}
var __VLS_159;
var __VLS_143;
var __VLS_3;
const __VLS_176 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_177 = __VLS_asFunctionalComponent(__VLS_176, new __VLS_176({
    modelValue: (__VLS_ctx.createVisible),
    title: "生成新报告",
    width: "560px",
}));
const __VLS_178 = __VLS_177({
    modelValue: (__VLS_ctx.createVisible),
    title: "生成新报告",
    width: "560px",
}, ...__VLS_functionalComponentArgsRest(__VLS_177));
__VLS_179.slots.default;
const __VLS_180 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_181 = __VLS_asFunctionalComponent(__VLS_180, new __VLS_180({
    model: (__VLS_ctx.createForm),
    labelWidth: "100px",
}));
const __VLS_182 = __VLS_181({
    model: (__VLS_ctx.createForm),
    labelWidth: "100px",
}, ...__VLS_functionalComponentArgsRest(__VLS_181));
__VLS_183.slots.default;
const __VLS_184 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_185 = __VLS_asFunctionalComponent(__VLS_184, new __VLS_184({
    label: "报告名称",
}));
const __VLS_186 = __VLS_185({
    label: "报告名称",
}, ...__VLS_functionalComponentArgsRest(__VLS_185));
__VLS_187.slots.default;
const __VLS_188 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_189 = __VLS_asFunctionalComponent(__VLS_188, new __VLS_188({
    modelValue: (__VLS_ctx.createForm.name),
}));
const __VLS_190 = __VLS_189({
    modelValue: (__VLS_ctx.createForm.name),
}, ...__VLS_functionalComponentArgsRest(__VLS_189));
var __VLS_187;
const __VLS_192 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_193 = __VLS_asFunctionalComponent(__VLS_192, new __VLS_192({
    label: "生成频度",
}));
const __VLS_194 = __VLS_193({
    label: "生成频度",
}, ...__VLS_functionalComponentArgsRest(__VLS_193));
__VLS_195.slots.default;
const __VLS_196 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_197 = __VLS_asFunctionalComponent(__VLS_196, new __VLS_196({
    modelValue: (__VLS_ctx.createForm.freq),
    ...{ class: "w-full" },
}));
const __VLS_198 = __VLS_197({
    modelValue: (__VLS_ctx.createForm.freq),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_197));
__VLS_199.slots.default;
for (const [freq] of __VLS_getVForSourceType((__VLS_ctx.freqs))) {
    const __VLS_200 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_201 = __VLS_asFunctionalComponent(__VLS_200, new __VLS_200({
        key: (freq),
        label: (freq),
        value: (freq),
    }));
    const __VLS_202 = __VLS_201({
        key: (freq),
        label: (freq),
        value: (freq),
    }, ...__VLS_functionalComponentArgsRest(__VLS_201));
}
var __VLS_199;
var __VLS_195;
const __VLS_204 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_205 = __VLS_asFunctionalComponent(__VLS_204, new __VLS_204({
    label: "统计维度",
}));
const __VLS_206 = __VLS_205({
    label: "统计维度",
}, ...__VLS_functionalComponentArgsRest(__VLS_205));
__VLS_207.slots.default;
const __VLS_208 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_209 = __VLS_asFunctionalComponent(__VLS_208, new __VLS_208({
    modelValue: (__VLS_ctx.createForm.dimension),
    ...{ class: "w-full" },
}));
const __VLS_210 = __VLS_209({
    modelValue: (__VLS_ctx.createForm.dimension),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_209));
__VLS_211.slots.default;
const __VLS_212 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_213 = __VLS_asFunctionalComponent(__VLS_212, new __VLS_212({
    label: "按业务域",
    value: "按业务域",
}));
const __VLS_214 = __VLS_213({
    label: "按业务域",
    value: "按业务域",
}, ...__VLS_functionalComponentArgsRest(__VLS_213));
const __VLS_216 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_217 = __VLS_asFunctionalComponent(__VLS_216, new __VLS_216({
    label: "按组织单位",
    value: "按组织单位",
}));
const __VLS_218 = __VLS_217({
    label: "按组织单位",
    value: "按组织单位",
}, ...__VLS_functionalComponentArgsRest(__VLS_217));
const __VLS_220 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_221 = __VLS_asFunctionalComponent(__VLS_220, new __VLS_220({
    label: "按系统",
    value: "按系统",
}));
const __VLS_222 = __VLS_221({
    label: "按系统",
    value: "按系统",
}, ...__VLS_functionalComponentArgsRest(__VLS_221));
const __VLS_224 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_225 = __VLS_asFunctionalComponent(__VLS_224, new __VLS_224({
    label: "按表/字段",
    value: "按表/字段",
}));
const __VLS_226 = __VLS_225({
    label: "按表/字段",
    value: "按表/字段",
}, ...__VLS_functionalComponentArgsRest(__VLS_225));
var __VLS_211;
var __VLS_207;
const __VLS_228 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_229 = __VLS_asFunctionalComponent(__VLS_228, new __VLS_228({
    label: "报告模板",
}));
const __VLS_230 = __VLS_229({
    label: "报告模板",
}, ...__VLS_functionalComponentArgsRest(__VLS_229));
__VLS_231.slots.default;
const __VLS_232 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_233 = __VLS_asFunctionalComponent(__VLS_232, new __VLS_232({
    modelValue: (__VLS_ctx.createForm.template),
    ...{ class: "w-full" },
}));
const __VLS_234 = __VLS_233({
    modelValue: (__VLS_ctx.createForm.template),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_233));
__VLS_235.slots.default;
for (const [template] of __VLS_getVForSourceType((__VLS_ctx.templates))) {
    const __VLS_236 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_237 = __VLS_asFunctionalComponent(__VLS_236, new __VLS_236({
        key: (template.name),
        label: (template.name),
        value: (template.name),
    }));
    const __VLS_238 = __VLS_237({
        key: (template.name),
        label: (template.name),
        value: (template.name),
    }, ...__VLS_functionalComponentArgsRest(__VLS_237));
}
var __VLS_235;
var __VLS_231;
const __VLS_240 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_241 = __VLS_asFunctionalComponent(__VLS_240, new __VLS_240({
    label: "订阅推送",
}));
const __VLS_242 = __VLS_241({
    label: "订阅推送",
}, ...__VLS_functionalComponentArgsRest(__VLS_241));
__VLS_243.slots.default;
const __VLS_244 = {}.ElCheckbox;
/** @type {[typeof __VLS_components.ElCheckbox, typeof __VLS_components.elCheckbox, typeof __VLS_components.ElCheckbox, typeof __VLS_components.elCheckbox, ]} */ ;
// @ts-ignore
const __VLS_245 = __VLS_asFunctionalComponent(__VLS_244, new __VLS_244({
    modelValue: (__VLS_ctx.createForm.subscribe),
}));
const __VLS_246 = __VLS_245({
    modelValue: (__VLS_ctx.createForm.subscribe),
}, ...__VLS_functionalComponentArgsRest(__VLS_245));
__VLS_247.slots.default;
var __VLS_247;
var __VLS_243;
var __VLS_183;
{
    const { footer: __VLS_thisSlot } = __VLS_179.slots;
    const __VLS_248 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_249 = __VLS_asFunctionalComponent(__VLS_248, new __VLS_248({
        ...{ 'onClick': {} },
    }));
    const __VLS_250 = __VLS_249({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_249));
    let __VLS_252;
    let __VLS_253;
    let __VLS_254;
    const __VLS_255 = {
        onClick: (...[$event]) => {
            __VLS_ctx.createVisible = false;
        }
    };
    __VLS_251.slots.default;
    var __VLS_251;
    const __VLS_256 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_257 = __VLS_asFunctionalComponent(__VLS_256, new __VLS_256({
        ...{ 'onClick': {} },
        type: "danger",
    }));
    const __VLS_258 = __VLS_257({
        ...{ 'onClick': {} },
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_257));
    let __VLS_260;
    let __VLS_261;
    let __VLS_262;
    const __VLS_263 = {
        onClick: (__VLS_ctx.saveCreate)
    };
    __VLS_259.slots.default;
    var __VLS_259;
}
var __VLS_179;
const __VLS_264 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_265 = __VLS_asFunctionalComponent(__VLS_264, new __VLS_264({
    modelValue: (__VLS_ctx.previewVisible),
    title: "报告预览",
    width: "720px",
}));
const __VLS_266 = __VLS_265({
    modelValue: (__VLS_ctx.previewVisible),
    title: "报告预览",
    width: "720px",
}, ...__VLS_functionalComponentArgsRest(__VLS_265));
__VLS_267.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "report-preview" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "preview-title" },
});
(__VLS_ctx.preview.name);
(__VLS_ctx.preview.freq);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "preview-meta" },
});
(__VLS_ctx.preview.generatedAt);
(__VLS_ctx.preview.dimension);
(__VLS_ctx.preview.creator);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "preview-summary" },
});
(__VLS_ctx.preview.summary);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "preview-section" },
});
for (const [item] of __VLS_getVForSourceType((__VLS_ctx.previewItems))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "preview-item" },
        key: (item.label),
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "preview-item-label" },
    });
    (item.label);
    const __VLS_268 = {}.ElProgress;
    /** @type {[typeof __VLS_components.ElProgress, typeof __VLS_components.elProgress, ]} */ ;
    // @ts-ignore
    const __VLS_269 = __VLS_asFunctionalComponent(__VLS_268, new __VLS_268({
        percentage: (item.value),
        color: (item.value >= 90 ? '#00A854' : item.value >= 80 ? '#2B6CB0' : '#ED7B2F'),
        strokeWidth: (10),
    }));
    const __VLS_270 = __VLS_269({
        percentage: (item.value),
        color: (item.value >= 90 ? '#00A854' : item.value >= 80 ? '#2B6CB0' : '#ED7B2F'),
        strokeWidth: (10),
    }, ...__VLS_functionalComponentArgsRest(__VLS_269));
}
var __VLS_267;
const __VLS_272 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_273 = __VLS_asFunctionalComponent(__VLS_272, new __VLS_272({
    modelValue: (__VLS_ctx.subscribeVisible),
    title: "新增订阅",
    width: "520px",
}));
const __VLS_274 = __VLS_273({
    modelValue: (__VLS_ctx.subscribeVisible),
    title: "新增订阅",
    width: "520px",
}, ...__VLS_functionalComponentArgsRest(__VLS_273));
__VLS_275.slots.default;
const __VLS_276 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_277 = __VLS_asFunctionalComponent(__VLS_276, new __VLS_276({
    model: (__VLS_ctx.subscribeForm),
    labelWidth: "100px",
}));
const __VLS_278 = __VLS_277({
    model: (__VLS_ctx.subscribeForm),
    labelWidth: "100px",
}, ...__VLS_functionalComponentArgsRest(__VLS_277));
__VLS_279.slots.default;
const __VLS_280 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_281 = __VLS_asFunctionalComponent(__VLS_280, new __VLS_280({
    label: "订阅对象",
}));
const __VLS_282 = __VLS_281({
    label: "订阅对象",
}, ...__VLS_functionalComponentArgsRest(__VLS_281));
__VLS_283.slots.default;
const __VLS_284 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_285 = __VLS_asFunctionalComponent(__VLS_284, new __VLS_284({
    modelValue: (__VLS_ctx.subscribeForm.target),
    ...{ class: "w-full" },
}));
const __VLS_286 = __VLS_285({
    modelValue: (__VLS_ctx.subscribeForm.target),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_285));
__VLS_287.slots.default;
for (const [freq] of __VLS_getVForSourceType((__VLS_ctx.freqs))) {
    const __VLS_288 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_289 = __VLS_asFunctionalComponent(__VLS_288, new __VLS_288({
        key: (freq),
        label: (freq),
        value: (freq),
    }));
    const __VLS_290 = __VLS_289({
        key: (freq),
        label: (freq),
        value: (freq),
    }, ...__VLS_functionalComponentArgsRest(__VLS_289));
}
var __VLS_287;
var __VLS_283;
const __VLS_292 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_293 = __VLS_asFunctionalComponent(__VLS_292, new __VLS_292({
    label: "推送渠道",
}));
const __VLS_294 = __VLS_293({
    label: "推送渠道",
}, ...__VLS_functionalComponentArgsRest(__VLS_293));
__VLS_295.slots.default;
const __VLS_296 = {}.ElCheckboxGroup;
/** @type {[typeof __VLS_components.ElCheckboxGroup, typeof __VLS_components.elCheckboxGroup, typeof __VLS_components.ElCheckboxGroup, typeof __VLS_components.elCheckboxGroup, ]} */ ;
// @ts-ignore
const __VLS_297 = __VLS_asFunctionalComponent(__VLS_296, new __VLS_296({
    modelValue: (__VLS_ctx.subscribeForm.channel),
}));
const __VLS_298 = __VLS_297({
    modelValue: (__VLS_ctx.subscribeForm.channel),
}, ...__VLS_functionalComponentArgsRest(__VLS_297));
__VLS_299.slots.default;
const __VLS_300 = {}.ElCheckbox;
/** @type {[typeof __VLS_components.ElCheckbox, typeof __VLS_components.elCheckbox, ]} */ ;
// @ts-ignore
const __VLS_301 = __VLS_asFunctionalComponent(__VLS_300, new __VLS_300({
    value: "站内",
}));
const __VLS_302 = __VLS_301({
    value: "站内",
}, ...__VLS_functionalComponentArgsRest(__VLS_301));
const __VLS_304 = {}.ElCheckbox;
/** @type {[typeof __VLS_components.ElCheckbox, typeof __VLS_components.elCheckbox, ]} */ ;
// @ts-ignore
const __VLS_305 = __VLS_asFunctionalComponent(__VLS_304, new __VLS_304({
    value: "邮件",
}));
const __VLS_306 = __VLS_305({
    value: "邮件",
}, ...__VLS_functionalComponentArgsRest(__VLS_305));
const __VLS_308 = {}.ElCheckbox;
/** @type {[typeof __VLS_components.ElCheckbox, typeof __VLS_components.elCheckbox, ]} */ ;
// @ts-ignore
const __VLS_309 = __VLS_asFunctionalComponent(__VLS_308, new __VLS_308({
    value: "短信",
}));
const __VLS_310 = __VLS_309({
    value: "短信",
}, ...__VLS_functionalComponentArgsRest(__VLS_309));
var __VLS_299;
var __VLS_295;
const __VLS_312 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_313 = __VLS_asFunctionalComponent(__VLS_312, new __VLS_312({
    label: "接收人",
}));
const __VLS_314 = __VLS_313({
    label: "接收人",
}, ...__VLS_functionalComponentArgsRest(__VLS_313));
__VLS_315.slots.default;
const __VLS_316 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_317 = __VLS_asFunctionalComponent(__VLS_316, new __VLS_316({
    modelValue: (__VLS_ctx.subscribeForm.users),
    ...{ class: "w-full" },
    multiple: true,
}));
const __VLS_318 = __VLS_317({
    modelValue: (__VLS_ctx.subscribeForm.users),
    ...{ class: "w-full" },
    multiple: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_317));
__VLS_319.slots.default;
for (const [user] of __VLS_getVForSourceType((['张三', '李四', '王五', '赵六']))) {
    const __VLS_320 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_321 = __VLS_asFunctionalComponent(__VLS_320, new __VLS_320({
        key: (user),
        label: (user),
        value: (user),
    }));
    const __VLS_322 = __VLS_321({
        key: (user),
        label: (user),
        value: (user),
    }, ...__VLS_functionalComponentArgsRest(__VLS_321));
}
var __VLS_319;
var __VLS_315;
var __VLS_279;
{
    const { footer: __VLS_thisSlot } = __VLS_275.slots;
    const __VLS_324 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_325 = __VLS_asFunctionalComponent(__VLS_324, new __VLS_324({
        ...{ 'onClick': {} },
    }));
    const __VLS_326 = __VLS_325({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_325));
    let __VLS_328;
    let __VLS_329;
    let __VLS_330;
    const __VLS_331 = {
        onClick: (...[$event]) => {
            __VLS_ctx.subscribeVisible = false;
        }
    };
    __VLS_327.slots.default;
    var __VLS_327;
    const __VLS_332 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_333 = __VLS_asFunctionalComponent(__VLS_332, new __VLS_332({
        ...{ 'onClick': {} },
        type: "danger",
    }));
    const __VLS_334 = __VLS_333({
        ...{ 'onClick': {} },
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_333));
    let __VLS_336;
    let __VLS_337;
    let __VLS_338;
    const __VLS_339 = {
        onClick: (__VLS_ctx.saveSubscribe)
    };
    __VLS_335.slots.default;
    var __VLS_335;
}
var __VLS_275;
/** @type {__VLS_StyleScopedClasses['standard-page']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['toolbar-row']} */ ;
/** @type {__VLS_StyleScopedClasses['search-input']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-select']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-12']} */ ;
/** @type {__VLS_StyleScopedClasses['dep-text']} */ ;
/** @type {__VLS_StyleScopedClasses['el-icon--right']} */ ;
/** @type {__VLS_StyleScopedClasses['pager']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['template-item']} */ ;
/** @type {__VLS_StyleScopedClasses['template-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['template-info']} */ ;
/** @type {__VLS_StyleScopedClasses['template-name']} */ ;
/** @type {__VLS_StyleScopedClasses['template-desc']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['coop-item']} */ ;
/** @type {__VLS_StyleScopedClasses['coop-item-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['coop-item-info']} */ ;
/** @type {__VLS_StyleScopedClasses['coop-item-name']} */ ;
/** @type {__VLS_StyleScopedClasses['coop-item-desc']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['report-preview']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-title']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-meta']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-summary']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-section']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-item']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-item-label']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            ArrowDown: ArrowDown,
            Plus: Plus,
            Promotion: Promotion,
            Search: Search,
            freqs: freqs,
            templates: templates,
            subscriptions: subscriptions,
            keyword: keyword,
            filterFreq: filterFreq,
            createVisible: createVisible,
            previewVisible: previewVisible,
            subscribeVisible: subscribeVisible,
            preview: preview,
            previewItems: previewItems,
            createForm: createForm,
            subscribeForm: subscribeForm,
            filteredReports: filteredReports,
            openCreate: openCreate,
            saveCreate: saveCreate,
            exportReport: exportReport,
            previewReport: previewReport,
            regenerate: regenerate,
            applyTemplate: applyTemplate,
            openSubscribe: openSubscribe,
            saveSubscribe: saveSubscribe,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
