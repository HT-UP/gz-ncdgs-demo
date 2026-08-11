import { computed, reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { Plus, Search } from '@element-plus/icons-vue';
const stageTagType = {
    申请中: 'warning',
    审批中: 'warning',
    已实施: 'success',
};
const keyword = ref('');
const filterStage = ref('');
const compareVisible = ref(false);
const compareTitle = ref('');
const changeVisible = ref(false);
const activeStep = ref(2);
const versions = ref([
    { version: 'V2.1', standardName: '客户信息代码', standardCode: 'BZ-0001', stage: '已实施', changeType: '值域变更', owner: '张三', releaseTime: '2026-08-10 15:20' },
    { version: 'V2.0', standardName: '线路编码标准', standardCode: 'BZ-0007', stage: '已实施', changeType: '字段调整', owner: '李四', releaseTime: '2026-07-28 10:05' },
    { version: 'V1.3', standardName: '车站类型代码', standardCode: 'BZ-0013', stage: '审批中', changeType: '名称修改', owner: '王五', releaseTime: '2026-08-06 09:30' },
    { version: 'V1.2', standardName: '设备状态代码', standardCode: 'BZ-0026', stage: '已实施', changeType: '字段调整', owner: '赵六', releaseTime: '2026-07-15 14:45' },
    { version: 'V1.1', standardName: '工单类型标准', standardCode: 'BZ-0031', stage: '申请中', changeType: '值域变更', owner: '孙七', releaseTime: '2026-08-11 11:00' },
    { version: 'V1.0', standardName: '安全事件等级', standardCode: 'BZ-0042', stage: '已实施', changeType: '首次发布', owner: '张三', releaseTime: '2026-06-30 16:10' },
]);
const impactItems = [
    { label: '关联数据模型', count: 3 },
    { label: '关联质量规则', count: 5 },
    { label: '字段映射关系', count: 12 },
    { label: '受影响业务系统', count: 2 },
];
const compareRows = [
    { field: '编码规则', old: 'BZ-XXXX 四位数字', new: 'BZ-XXXXX 五位数字', changed: true },
    { field: '值域范围', old: 'A-Z 单字符', new: 'A1-Z9 双字符', changed: true },
    { field: '责任人', old: '数据治理中心', new: '数据治理中心', changed: false },
    { field: '映射字段', old: '3 个', new: '3 个', changed: false },
];
const changeForm = reactive({
    standardName: '',
    changeType: '字段调整',
    description: '',
});
const filteredVersions = computed(() => versions.value.filter((row) => {
    if (filterStage.value && row.stage !== filterStage.value)
        return false;
    if (!keyword.value)
        return true;
    const kw = keyword.value.toLowerCase();
    return (row.standardName.toLowerCase().includes(kw) || row.standardCode.toLowerCase().includes(kw));
}));
const showVersion = (row) => {
    ElMessage.info(`标准「${row.standardName}」${row.version} 版本详情（Mock）`);
};
const compareVersion = (row) => {
    compareTitle.value = `版本对比：${row.standardName} ${row.version} vs 上一版本`;
    compareVisible.value = true;
};
const openChange = () => {
    Object.assign(changeForm, { standardName: '', changeType: '字段调整', description: '' });
    changeVisible.value = true;
};
const submitChange = () => {
    if (!changeForm.standardName.trim()) {
        ElMessage.warning('请输入标准名称');
        return;
    }
    versions.value.unshift({
        version: `V${Math.random().toFixed(1)}`,
        standardName: changeForm.standardName,
        standardCode: `BZ-NEW-${versions.value.length + 1}`,
        stage: '申请中',
        changeType: changeForm.changeType,
        owner: '张三',
        releaseTime: new Date().toLocaleString('sv-SE').replace('T', ' '),
    });
    changeVisible.value = false;
    ElMessage.success('变更申请已提交（Mock）');
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
        onClick: (__VLS_ctx.openChange)
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
    placeholder: "按标准名称 / 编码搜索",
    clearable: true,
    ...{ class: "search-input" },
    prefixIcon: (__VLS_ctx.Search),
}));
const __VLS_22 = __VLS_21({
    modelValue: (__VLS_ctx.keyword),
    placeholder: "按标准名称 / 编码搜索",
    clearable: true,
    ...{ class: "search-input" },
    prefixIcon: (__VLS_ctx.Search),
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
const __VLS_24 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    modelValue: (__VLS_ctx.filterStage),
    placeholder: "变更阶段",
    clearable: true,
    ...{ class: "filter-select" },
}));
const __VLS_26 = __VLS_25({
    modelValue: (__VLS_ctx.filterStage),
    placeholder: "变更阶段",
    clearable: true,
    ...{ class: "filter-select" },
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
__VLS_27.slots.default;
const __VLS_28 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
    label: "申请中",
    value: "申请中",
}));
const __VLS_30 = __VLS_29({
    label: "申请中",
    value: "申请中",
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
const __VLS_32 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
    label: "审批中",
    value: "审批中",
}));
const __VLS_34 = __VLS_33({
    label: "审批中",
    value: "审批中",
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
const __VLS_36 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    label: "已实施",
    value: "已实施",
}));
const __VLS_38 = __VLS_37({
    label: "已实施",
    value: "已实施",
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
var __VLS_27;
const __VLS_40 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
    ...{ 'onRowClick': {} },
    data: (__VLS_ctx.filteredVersions),
    stripe: true,
    ...{ class: "mt-12" },
}));
const __VLS_42 = __VLS_41({
    ...{ 'onRowClick': {} },
    data: (__VLS_ctx.filteredVersions),
    stripe: true,
    ...{ class: "mt-12" },
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
let __VLS_44;
let __VLS_45;
let __VLS_46;
const __VLS_47 = {
    onRowClick: (__VLS_ctx.showVersion)
};
__VLS_43.slots.default;
const __VLS_48 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
    prop: "version",
    label: "版本号",
    width: "90",
}));
const __VLS_50 = __VLS_49({
    prop: "version",
    label: "版本号",
    width: "90",
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
const __VLS_52 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
    prop: "standardName",
    label: "标准名称",
    minWidth: "180",
}));
const __VLS_54 = __VLS_53({
    prop: "standardName",
    label: "标准名称",
    minWidth: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
const __VLS_56 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
    prop: "standardCode",
    label: "编码",
    width: "110",
}));
const __VLS_58 = __VLS_57({
    prop: "standardCode",
    label: "编码",
    width: "110",
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
const __VLS_60 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
    prop: "stage",
    label: "变更阶段",
    width: "100",
}));
const __VLS_62 = __VLS_61({
    prop: "stage",
    label: "变更阶段",
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_61));
__VLS_63.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_63.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_64 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
        type: (__VLS_ctx.stageTagType[row.stage]),
        effect: "dark",
    }));
    const __VLS_66 = __VLS_65({
        type: (__VLS_ctx.stageTagType[row.stage]),
        effect: "dark",
    }, ...__VLS_functionalComponentArgsRest(__VLS_65));
    __VLS_67.slots.default;
    (row.stage);
    var __VLS_67;
}
var __VLS_63;
const __VLS_68 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
    prop: "changeType",
    label: "变更类型",
    width: "100",
}));
const __VLS_70 = __VLS_69({
    prop: "changeType",
    label: "变更类型",
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_69));
const __VLS_72 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
    prop: "owner",
    label: "申请人",
    width: "90",
}));
const __VLS_74 = __VLS_73({
    prop: "owner",
    label: "申请人",
    width: "90",
}, ...__VLS_functionalComponentArgsRest(__VLS_73));
const __VLS_76 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
    label: "发布时间",
    width: "150",
}));
const __VLS_78 = __VLS_77({
    label: "发布时间",
    width: "150",
}, ...__VLS_functionalComponentArgsRest(__VLS_77));
__VLS_79.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_79.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    (row.releaseTime);
}
var __VLS_79;
const __VLS_80 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
    label: "操作",
    width: "120",
    fixed: "right",
}));
const __VLS_82 = __VLS_81({
    label: "操作",
    width: "120",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_81));
__VLS_83.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_83.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_84 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
        ...{ 'onClick': {} },
        link: true,
        type: "danger",
    }));
    const __VLS_86 = __VLS_85({
        ...{ 'onClick': {} },
        link: true,
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_85));
    let __VLS_88;
    let __VLS_89;
    let __VLS_90;
    const __VLS_91 = {
        onClick: (...[$event]) => {
            __VLS_ctx.compareVersion(row);
        }
    };
    __VLS_87.slots.default;
    var __VLS_87;
}
var __VLS_83;
var __VLS_43;
const __VLS_92 = {}.ElPagination;
/** @type {[typeof __VLS_components.ElPagination, typeof __VLS_components.elPagination, ]} */ ;
// @ts-ignore
const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
    ...{ class: "pager" },
    layout: "total, prev, pager, next",
    total: (__VLS_ctx.filteredVersions.length),
    pageSize: (20),
    background: true,
}));
const __VLS_94 = __VLS_93({
    ...{ class: "pager" },
    layout: "total, prev, pager, next",
    total: (__VLS_ctx.filteredVersions.length),
    pageSize: (20),
    background: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_93));
var __VLS_11;
var __VLS_7;
const __VLS_96 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
    span: (8),
}));
const __VLS_98 = __VLS_97({
    span: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_97));
__VLS_99.slots.default;
const __VLS_100 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
    ...{ class: "panel-card dashboard-card" },
    shadow: "never",
}));
const __VLS_102 = __VLS_101({
    ...{ class: "panel-card dashboard-card" },
    shadow: "never",
}, ...__VLS_functionalComponentArgsRest(__VLS_101));
__VLS_103.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_103.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
}
const __VLS_104 = {}.ElSteps;
/** @type {[typeof __VLS_components.ElSteps, typeof __VLS_components.elSteps, typeof __VLS_components.ElSteps, typeof __VLS_components.elSteps, ]} */ ;
// @ts-ignore
const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
    direction: "vertical",
    active: (__VLS_ctx.activeStep),
    finishStatus: "success",
}));
const __VLS_106 = __VLS_105({
    direction: "vertical",
    active: (__VLS_ctx.activeStep),
    finishStatus: "success",
}, ...__VLS_functionalComponentArgsRest(__VLS_105));
__VLS_107.slots.default;
const __VLS_108 = {}.ElStep;
/** @type {[typeof __VLS_components.ElStep, typeof __VLS_components.elStep, ]} */ ;
// @ts-ignore
const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
    title: "申请",
    description: "填写变更内容与影响说明",
}));
const __VLS_110 = __VLS_109({
    title: "申请",
    description: "填写变更内容与影响说明",
}, ...__VLS_functionalComponentArgsRest(__VLS_109));
const __VLS_112 = {}.ElStep;
/** @type {[typeof __VLS_components.ElStep, typeof __VLS_components.elStep, ]} */ ;
// @ts-ignore
const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
    title: "审批",
    description: "评审委员会审批",
}));
const __VLS_114 = __VLS_113({
    title: "审批",
    description: "评审委员会审批",
}, ...__VLS_functionalComponentArgsRest(__VLS_113));
const __VLS_116 = {}.ElStep;
/** @type {[typeof __VLS_components.ElStep, typeof __VLS_components.elStep, ]} */ ;
// @ts-ignore
const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
    title: "实施",
    description: "发布新版本并通知",
}));
const __VLS_118 = __VLS_117({
    title: "实施",
    description: "发布新版本并通知",
}, ...__VLS_functionalComponentArgsRest(__VLS_117));
var __VLS_107;
var __VLS_103;
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
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "impact-list" },
});
for (const [impact] of __VLS_getVForSourceType((__VLS_ctx.impactItems))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (impact.label),
        ...{ class: "impact-item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (impact.label);
    const __VLS_124 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({
        type: (impact.count > 0 ? 'danger' : 'success'),
        effect: "plain",
    }));
    const __VLS_126 = __VLS_125({
        type: (impact.count > 0 ? 'danger' : 'success'),
        effect: "plain",
    }, ...__VLS_functionalComponentArgsRest(__VLS_125));
    __VLS_127.slots.default;
    (impact.count > 0 ? `${impact.count} 项受影响` : '无影响');
    var __VLS_127;
}
var __VLS_123;
var __VLS_99;
var __VLS_3;
const __VLS_128 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({
    modelValue: (__VLS_ctx.compareVisible),
    title: (__VLS_ctx.compareTitle),
    width: "640px",
}));
const __VLS_130 = __VLS_129({
    modelValue: (__VLS_ctx.compareVisible),
    title: (__VLS_ctx.compareTitle),
    width: "640px",
}, ...__VLS_functionalComponentArgsRest(__VLS_129));
__VLS_131.slots.default;
const __VLS_132 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132({
    data: (__VLS_ctx.compareRows),
    border: true,
    size: "small",
}));
const __VLS_134 = __VLS_133({
    data: (__VLS_ctx.compareRows),
    border: true,
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_133));
__VLS_135.slots.default;
const __VLS_136 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_137 = __VLS_asFunctionalComponent(__VLS_136, new __VLS_136({
    prop: "field",
    label: "字段",
    width: "160",
}));
const __VLS_138 = __VLS_137({
    prop: "field",
    label: "字段",
    width: "160",
}, ...__VLS_functionalComponentArgsRest(__VLS_137));
const __VLS_140 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_141 = __VLS_asFunctionalComponent(__VLS_140, new __VLS_140({
    label: "旧版本",
    minWidth: "180",
}));
const __VLS_142 = __VLS_141({
    label: "旧版本",
    minWidth: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_141));
__VLS_143.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_143.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: ({ 'diff-cell': row.changed }) },
    });
    (row.old);
}
var __VLS_143;
const __VLS_144 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_145 = __VLS_asFunctionalComponent(__VLS_144, new __VLS_144({
    label: "新版本",
    minWidth: "180",
}));
const __VLS_146 = __VLS_145({
    label: "新版本",
    minWidth: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_145));
__VLS_147.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_147.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: ({ 'diff-cell diff-cell--new': row.changed }) },
    });
    (row.new);
}
var __VLS_147;
var __VLS_135;
var __VLS_131;
const __VLS_148 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_149 = __VLS_asFunctionalComponent(__VLS_148, new __VLS_148({
    modelValue: (__VLS_ctx.changeVisible),
    title: "发起变更申请",
    width: "520px",
}));
const __VLS_150 = __VLS_149({
    modelValue: (__VLS_ctx.changeVisible),
    title: "发起变更申请",
    width: "520px",
}, ...__VLS_functionalComponentArgsRest(__VLS_149));
__VLS_151.slots.default;
const __VLS_152 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_153 = __VLS_asFunctionalComponent(__VLS_152, new __VLS_152({
    model: (__VLS_ctx.changeForm),
    labelWidth: "90px",
}));
const __VLS_154 = __VLS_153({
    model: (__VLS_ctx.changeForm),
    labelWidth: "90px",
}, ...__VLS_functionalComponentArgsRest(__VLS_153));
__VLS_155.slots.default;
const __VLS_156 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_157 = __VLS_asFunctionalComponent(__VLS_156, new __VLS_156({
    label: "标准名称",
}));
const __VLS_158 = __VLS_157({
    label: "标准名称",
}, ...__VLS_functionalComponentArgsRest(__VLS_157));
__VLS_159.slots.default;
const __VLS_160 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_161 = __VLS_asFunctionalComponent(__VLS_160, new __VLS_160({
    modelValue: (__VLS_ctx.changeForm.standardName),
    placeholder: "选择或输入标准名称",
}));
const __VLS_162 = __VLS_161({
    modelValue: (__VLS_ctx.changeForm.standardName),
    placeholder: "选择或输入标准名称",
}, ...__VLS_functionalComponentArgsRest(__VLS_161));
var __VLS_159;
const __VLS_164 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_165 = __VLS_asFunctionalComponent(__VLS_164, new __VLS_164({
    label: "变更类型",
}));
const __VLS_166 = __VLS_165({
    label: "变更类型",
}, ...__VLS_functionalComponentArgsRest(__VLS_165));
__VLS_167.slots.default;
const __VLS_168 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_169 = __VLS_asFunctionalComponent(__VLS_168, new __VLS_168({
    modelValue: (__VLS_ctx.changeForm.changeType),
    ...{ class: "w-full" },
}));
const __VLS_170 = __VLS_169({
    modelValue: (__VLS_ctx.changeForm.changeType),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_169));
__VLS_171.slots.default;
const __VLS_172 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_173 = __VLS_asFunctionalComponent(__VLS_172, new __VLS_172({
    label: "字段调整",
    value: "字段调整",
}));
const __VLS_174 = __VLS_173({
    label: "字段调整",
    value: "字段调整",
}, ...__VLS_functionalComponentArgsRest(__VLS_173));
const __VLS_176 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_177 = __VLS_asFunctionalComponent(__VLS_176, new __VLS_176({
    label: "值域变更",
    value: "值域变更",
}));
const __VLS_178 = __VLS_177({
    label: "值域变更",
    value: "值域变更",
}, ...__VLS_functionalComponentArgsRest(__VLS_177));
const __VLS_180 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_181 = __VLS_asFunctionalComponent(__VLS_180, new __VLS_180({
    label: "名称修改",
    value: "名称修改",
}));
const __VLS_182 = __VLS_181({
    label: "名称修改",
    value: "名称修改",
}, ...__VLS_functionalComponentArgsRest(__VLS_181));
const __VLS_184 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_185 = __VLS_asFunctionalComponent(__VLS_184, new __VLS_184({
    label: "废止",
    value: "废止",
}));
const __VLS_186 = __VLS_185({
    label: "废止",
    value: "废止",
}, ...__VLS_functionalComponentArgsRest(__VLS_185));
var __VLS_171;
var __VLS_167;
const __VLS_188 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_189 = __VLS_asFunctionalComponent(__VLS_188, new __VLS_188({
    label: "变更说明",
}));
const __VLS_190 = __VLS_189({
    label: "变更说明",
}, ...__VLS_functionalComponentArgsRest(__VLS_189));
__VLS_191.slots.default;
const __VLS_192 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_193 = __VLS_asFunctionalComponent(__VLS_192, new __VLS_192({
    modelValue: (__VLS_ctx.changeForm.description),
    type: "textarea",
    rows: (3),
}));
const __VLS_194 = __VLS_193({
    modelValue: (__VLS_ctx.changeForm.description),
    type: "textarea",
    rows: (3),
}, ...__VLS_functionalComponentArgsRest(__VLS_193));
var __VLS_191;
var __VLS_155;
{
    const { footer: __VLS_thisSlot } = __VLS_151.slots;
    const __VLS_196 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_197 = __VLS_asFunctionalComponent(__VLS_196, new __VLS_196({
        ...{ 'onClick': {} },
    }));
    const __VLS_198 = __VLS_197({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_197));
    let __VLS_200;
    let __VLS_201;
    let __VLS_202;
    const __VLS_203 = {
        onClick: (...[$event]) => {
            __VLS_ctx.changeVisible = false;
        }
    };
    __VLS_199.slots.default;
    var __VLS_199;
    const __VLS_204 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_205 = __VLS_asFunctionalComponent(__VLS_204, new __VLS_204({
        ...{ 'onClick': {} },
        type: "danger",
    }));
    const __VLS_206 = __VLS_205({
        ...{ 'onClick': {} },
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_205));
    let __VLS_208;
    let __VLS_209;
    let __VLS_210;
    const __VLS_211 = {
        onClick: (__VLS_ctx.submitChange)
    };
    __VLS_207.slots.default;
    var __VLS_207;
}
var __VLS_151;
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
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['impact-list']} */ ;
/** @type {__VLS_StyleScopedClasses['impact-item']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Plus: Plus,
            Search: Search,
            stageTagType: stageTagType,
            keyword: keyword,
            filterStage: filterStage,
            compareVisible: compareVisible,
            compareTitle: compareTitle,
            changeVisible: changeVisible,
            activeStep: activeStep,
            impactItems: impactItems,
            compareRows: compareRows,
            changeForm: changeForm,
            filteredVersions: filteredVersions,
            showVersion: showVersion,
            compareVersion: compareVersion,
            openChange: openChange,
            submitChange: submitChange,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
