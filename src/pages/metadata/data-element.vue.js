import { computed, reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { Plus, Search } from '@element-plus/icons-vue';
import { mockDataElements } from '@/mock/metadata';
const statuses = ['草稿', '待审核', '已发布', '已废止'];
const domains = Array.from(new Set(mockDataElements.map((item) => item.domain)));
const dataTypes = Array.from(new Set(mockDataElements.map((item) => item.dataType)));
const statusTagType = {
    草稿: 'info',
    待审核: 'warning',
    已发布: 'success',
    已废止: 'info',
};
const keyword = ref('');
const filterDomain = ref('');
const filterStatus = ref('');
const filterDataType = ref('');
const currentPage = ref(1);
const pageSize = ref(20);
const editorVisible = ref(false);
const detailVisible = ref(false);
const referencesVisible = ref(false);
const editing = ref(null);
const detailRow = ref(null);
const identifierTaken = ref(false);
const form = reactive({
    identifier: '',
    name: '',
    dataType: 'VARCHAR',
    length: 32,
    range: '必填',
    constraint: '无',
    domain: '客运管理',
    description: '',
});
const referenceRows = computed(() => Array.from({ length: Math.min(detailRow.value?.referencedCount ?? 0, 8) }, (_, i) => ({
    tableName: `${['ticket', 'passenger', 'station', 'line'][i % 4]}_info_${i + 1}`,
    fieldName: detailRow.value?.identifier ?? 'FIELD',
    sourceName: ['票务核心库', '客流分析库', '车站信息库'][i % 3],
    mode: i % 2 === 0 ? '一对一' : '一对多',
})));
const filteredElements = computed(() => mockDataElements.filter((item) => {
    if (filterDomain.value && item.domain !== filterDomain.value)
        return false;
    if (filterStatus.value && item.status !== filterStatus.value)
        return false;
    if (filterDataType.value && item.dataType !== filterDataType.value)
        return false;
    if (!keyword.value)
        return true;
    const kw = keyword.value.toLowerCase();
    return (item.name.toLowerCase().includes(kw) ||
        item.identifier.toLowerCase().includes(kw));
}));
const pagedElements = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    return filteredElements.value.slice(start, start + pageSize.value);
});
const resetPagination = () => {
    currentPage.value = 1;
};
const handleSizeChange = (size) => {
    pageSize.value = size;
    resetPagination();
};
const checkIdentifier = () => {
    identifierTaken.value = mockDataElements.some((item) => item.identifier.toLowerCase() === form.identifier.trim().toLowerCase() && item !== editing.value);
};
const openCreate = () => {
    editing.value = null;
    identifierTaken.value = false;
    Object.assign(form, {
        identifier: '',
        name: '',
        dataType: 'VARCHAR',
        length: 32,
        range: '必填',
        constraint: '无',
        domain: '客运管理',
        description: '',
    });
    editorVisible.value = true;
};
const openEdit = (row) => {
    editing.value = row;
    identifierTaken.value = false;
    Object.assign(form, {
        identifier: row.identifier,
        name: row.name,
        dataType: row.dataType,
        length: row.length,
        range: row.range,
        constraint: row.constraint,
        domain: row.domain,
        description: row.description,
    });
    editorVisible.value = true;
};
const saveForm = () => {
    if (!form.name.trim() || !form.identifier.trim()) {
        ElMessage.warning('请填写标识符和数据元名称');
        return;
    }
    if (identifierTaken.value) {
        ElMessage.error('标识符已存在，请更换');
        return;
    }
    if (editing.value) {
        Object.assign(editing.value, {
            identifier: form.identifier,
            name: form.name,
            dataType: form.dataType,
            length: form.length,
            range: form.range,
            constraint: form.constraint,
            domain: form.domain,
            description: form.description,
            status: '草稿',
        });
        ElMessage.success('数据元已更新，进入待审核（Mock）');
    }
    else {
        mockDataElements.unshift({
            id: `de-mock-${Date.now()}`,
            identifier: form.identifier,
            name: form.name,
            dataType: form.dataType,
            length: form.length,
            range: form.range,
            defaultValue: '-',
            constraint: form.constraint,
            status: '草稿',
            owner: '张三',
            domain: form.domain,
            referencedCount: 0,
            updateTime: new Date().toLocaleString('sv-SE').replace('T', ' '),
            description: form.description || '新建数据元',
        });
        ElMessage.success('数据元已新增，进入待审核（Mock）');
    }
    editorVisible.value = false;
};
const openReview = (row) => {
    if (row.status === '草稿' || row.status === '待审核') {
        row.status = '已发布';
        ElMessage.success(`数据元「${row.name}」已审核发布（Mock）`);
    }
    else {
        ElMessage.info(`数据元「${row.name}」当前状态为 ${row.status}，无需审核`);
    }
};
const showDetail = (row) => {
    detailRow.value = row;
    detailVisible.value = true;
};
const showReferences = (row) => {
    detailRow.value = row;
    referencesVisible.value = true;
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
    ...{ 'onInput': {} },
    modelValue: (__VLS_ctx.keyword),
    placeholder: "按名称 / 标识符搜索",
    clearable: true,
    ...{ class: "search-input" },
    prefixIcon: (__VLS_ctx.Search),
}));
const __VLS_14 = __VLS_13({
    ...{ 'onInput': {} },
    modelValue: (__VLS_ctx.keyword),
    placeholder: "按名称 / 标识符搜索",
    clearable: true,
    ...{ class: "search-input" },
    prefixIcon: (__VLS_ctx.Search),
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
let __VLS_16;
let __VLS_17;
let __VLS_18;
const __VLS_19 = {
    onInput: (__VLS_ctx.resetPagination)
};
var __VLS_15;
const __VLS_20 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.filterDomain),
    placeholder: "业务域",
    clearable: true,
    ...{ class: "filter-select" },
}));
const __VLS_22 = __VLS_21({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.filterDomain),
    placeholder: "业务域",
    clearable: true,
    ...{ class: "filter-select" },
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
let __VLS_24;
let __VLS_25;
let __VLS_26;
const __VLS_27 = {
    onChange: (__VLS_ctx.resetPagination)
};
__VLS_23.slots.default;
for (const [domain] of __VLS_getVForSourceType((__VLS_ctx.domains))) {
    const __VLS_28 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
        key: (domain),
        label: (domain),
        value: (domain),
    }));
    const __VLS_30 = __VLS_29({
        key: (domain),
        label: (domain),
        value: (domain),
    }, ...__VLS_functionalComponentArgsRest(__VLS_29));
}
var __VLS_23;
const __VLS_32 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.filterStatus),
    placeholder: "状态",
    clearable: true,
    ...{ class: "filter-select" },
}));
const __VLS_34 = __VLS_33({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.filterStatus),
    placeholder: "状态",
    clearable: true,
    ...{ class: "filter-select" },
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
let __VLS_36;
let __VLS_37;
let __VLS_38;
const __VLS_39 = {
    onChange: (__VLS_ctx.resetPagination)
};
__VLS_35.slots.default;
for (const [status] of __VLS_getVForSourceType((__VLS_ctx.statuses))) {
    const __VLS_40 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
        key: (status),
        label: (status),
        value: (status),
    }));
    const __VLS_42 = __VLS_41({
        key: (status),
        label: (status),
        value: (status),
    }, ...__VLS_functionalComponentArgsRest(__VLS_41));
}
var __VLS_35;
const __VLS_44 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.filterDataType),
    placeholder: "数据类型",
    clearable: true,
    ...{ class: "filter-select" },
}));
const __VLS_46 = __VLS_45({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.filterDataType),
    placeholder: "数据类型",
    clearable: true,
    ...{ class: "filter-select" },
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
let __VLS_48;
let __VLS_49;
let __VLS_50;
const __VLS_51 = {
    onChange: (__VLS_ctx.resetPagination)
};
__VLS_47.slots.default;
for (const [type] of __VLS_getVForSourceType((__VLS_ctx.dataTypes))) {
    const __VLS_52 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
        key: (type),
        label: (type),
        value: (type),
    }));
    const __VLS_54 = __VLS_53({
        key: (type),
        label: (type),
        value: (type),
    }, ...__VLS_functionalComponentArgsRest(__VLS_53));
}
var __VLS_47;
const __VLS_56 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
    ...{ 'onRowClick': {} },
    data: (__VLS_ctx.pagedElements),
    stripe: true,
    ...{ class: "mt-12" },
}));
const __VLS_58 = __VLS_57({
    ...{ 'onRowClick': {} },
    data: (__VLS_ctx.pagedElements),
    stripe: true,
    ...{ class: "mt-12" },
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
let __VLS_60;
let __VLS_61;
let __VLS_62;
const __VLS_63 = {
    onRowClick: (__VLS_ctx.showDetail)
};
__VLS_59.slots.default;
const __VLS_64 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
    prop: "identifier",
    label: "标识符",
    width: "140",
}));
const __VLS_66 = __VLS_65({
    prop: "identifier",
    label: "标识符",
    width: "140",
}, ...__VLS_functionalComponentArgsRest(__VLS_65));
const __VLS_68 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
    prop: "name",
    label: "数据元名称",
    minWidth: "140",
}));
const __VLS_70 = __VLS_69({
    prop: "name",
    label: "数据元名称",
    minWidth: "140",
}, ...__VLS_functionalComponentArgsRest(__VLS_69));
const __VLS_72 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
    prop: "dataType",
    label: "类型",
    width: "90",
}));
const __VLS_74 = __VLS_73({
    prop: "dataType",
    label: "类型",
    width: "90",
}, ...__VLS_functionalComponentArgsRest(__VLS_73));
const __VLS_76 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
    prop: "length",
    label: "长度",
    width: "70",
    align: "center",
}));
const __VLS_78 = __VLS_77({
    prop: "length",
    label: "长度",
    width: "70",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_77));
const __VLS_80 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
    prop: "domain",
    label: "业务域",
    width: "100",
}));
const __VLS_82 = __VLS_81({
    prop: "domain",
    label: "业务域",
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_81));
const __VLS_84 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
    prop: "owner",
    label: "负责人",
    width: "90",
}));
const __VLS_86 = __VLS_85({
    prop: "owner",
    label: "负责人",
    width: "90",
}, ...__VLS_functionalComponentArgsRest(__VLS_85));
const __VLS_88 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
    label: "状态",
    width: "90",
}));
const __VLS_90 = __VLS_89({
    label: "状态",
    width: "90",
}, ...__VLS_functionalComponentArgsRest(__VLS_89));
__VLS_91.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_91.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_92 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
        type: (__VLS_ctx.statusTagType[row.status]),
        effect: "dark",
    }));
    const __VLS_94 = __VLS_93({
        type: (__VLS_ctx.statusTagType[row.status]),
        effect: "dark",
    }, ...__VLS_functionalComponentArgsRest(__VLS_93));
    __VLS_95.slots.default;
    (row.status);
    var __VLS_95;
}
var __VLS_91;
const __VLS_96 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
    label: "引用字段",
    width: "90",
    align: "center",
}));
const __VLS_98 = __VLS_97({
    label: "引用字段",
    width: "90",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_97));
__VLS_99.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_99.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_100 = {}.ElLink;
    /** @type {[typeof __VLS_components.ElLink, typeof __VLS_components.elLink, typeof __VLS_components.ElLink, typeof __VLS_components.elLink, ]} */ ;
    // @ts-ignore
    const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
        ...{ 'onClick': {} },
        underline: (false),
        type: "danger",
    }));
    const __VLS_102 = __VLS_101({
        ...{ 'onClick': {} },
        underline: (false),
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_101));
    let __VLS_104;
    let __VLS_105;
    let __VLS_106;
    const __VLS_107 = {
        onClick: (...[$event]) => {
            __VLS_ctx.showReferences(row);
        }
    };
    __VLS_103.slots.default;
    (row.referencedCount);
    var __VLS_103;
}
var __VLS_99;
const __VLS_108 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
    label: "更新时间",
    width: "150",
}));
const __VLS_110 = __VLS_109({
    label: "更新时间",
    width: "150",
}, ...__VLS_functionalComponentArgsRest(__VLS_109));
__VLS_111.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_111.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    (row.updateTime);
}
var __VLS_111;
const __VLS_112 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
    label: "操作",
    width: "160",
    fixed: "right",
}));
const __VLS_114 = __VLS_113({
    label: "操作",
    width: "160",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_113));
__VLS_115.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_115.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_116 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
        ...{ 'onClick': {} },
        link: true,
        type: "danger",
    }));
    const __VLS_118 = __VLS_117({
        ...{ 'onClick': {} },
        link: true,
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_117));
    let __VLS_120;
    let __VLS_121;
    let __VLS_122;
    const __VLS_123 = {
        onClick: (...[$event]) => {
            __VLS_ctx.openEdit(row);
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
        type: "danger",
    }));
    const __VLS_126 = __VLS_125({
        ...{ 'onClick': {} },
        link: true,
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_125));
    let __VLS_128;
    let __VLS_129;
    let __VLS_130;
    const __VLS_131 = {
        onClick: (...[$event]) => {
            __VLS_ctx.openReview(row);
        }
    };
    __VLS_127.slots.default;
    var __VLS_127;
}
var __VLS_115;
var __VLS_59;
const __VLS_132 = {}.ElPagination;
/** @type {[typeof __VLS_components.ElPagination, typeof __VLS_components.elPagination, ]} */ ;
// @ts-ignore
const __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132({
    ...{ 'onCurrentChange': {} },
    ...{ 'onSizeChange': {} },
    ...{ class: "pager" },
    layout: "total, prev, pager, next, sizes",
    total: (__VLS_ctx.filteredElements.length),
    pageSize: (__VLS_ctx.pageSize),
    currentPage: (__VLS_ctx.currentPage),
    pageSizes: ([20, 50, 100]),
    background: true,
}));
const __VLS_134 = __VLS_133({
    ...{ 'onCurrentChange': {} },
    ...{ 'onSizeChange': {} },
    ...{ class: "pager" },
    layout: "total, prev, pager, next, sizes",
    total: (__VLS_ctx.filteredElements.length),
    pageSize: (__VLS_ctx.pageSize),
    currentPage: (__VLS_ctx.currentPage),
    pageSizes: ([20, 50, 100]),
    background: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_133));
let __VLS_136;
let __VLS_137;
let __VLS_138;
const __VLS_139 = {
    onCurrentChange: (...[$event]) => {
        __VLS_ctx.currentPage = $event;
    }
};
const __VLS_140 = {
    onSizeChange: (__VLS_ctx.handleSizeChange)
};
var __VLS_135;
var __VLS_3;
const __VLS_141 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_142 = __VLS_asFunctionalComponent(__VLS_141, new __VLS_141({
    modelValue: (__VLS_ctx.editorVisible),
    title: (__VLS_ctx.editing ? '编辑数据元' : '新增数据元'),
    width: "560px",
}));
const __VLS_143 = __VLS_142({
    modelValue: (__VLS_ctx.editorVisible),
    title: (__VLS_ctx.editing ? '编辑数据元' : '新增数据元'),
    width: "560px",
}, ...__VLS_functionalComponentArgsRest(__VLS_142));
__VLS_144.slots.default;
const __VLS_145 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_146 = __VLS_asFunctionalComponent(__VLS_145, new __VLS_145({
    model: (__VLS_ctx.form),
    labelWidth: "100px",
}));
const __VLS_147 = __VLS_146({
    model: (__VLS_ctx.form),
    labelWidth: "100px",
}, ...__VLS_functionalComponentArgsRest(__VLS_146));
__VLS_148.slots.default;
const __VLS_149 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_150 = __VLS_asFunctionalComponent(__VLS_149, new __VLS_149({
    label: "标识符",
}));
const __VLS_151 = __VLS_150({
    label: "标识符",
}, ...__VLS_functionalComponentArgsRest(__VLS_150));
__VLS_152.slots.default;
const __VLS_153 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_154 = __VLS_asFunctionalComponent(__VLS_153, new __VLS_153({
    ...{ 'onBlur': {} },
    modelValue: (__VLS_ctx.form.identifier),
    placeholder: "如 CUST_ID",
}));
const __VLS_155 = __VLS_154({
    ...{ 'onBlur': {} },
    modelValue: (__VLS_ctx.form.identifier),
    placeholder: "如 CUST_ID",
}, ...__VLS_functionalComponentArgsRest(__VLS_154));
let __VLS_157;
let __VLS_158;
let __VLS_159;
const __VLS_160 = {
    onBlur: (__VLS_ctx.checkIdentifier)
};
var __VLS_156;
if (__VLS_ctx.identifierTaken) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "form-error" },
    });
}
var __VLS_152;
const __VLS_161 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_162 = __VLS_asFunctionalComponent(__VLS_161, new __VLS_161({
    label: "数据元名称",
}));
const __VLS_163 = __VLS_162({
    label: "数据元名称",
}, ...__VLS_functionalComponentArgsRest(__VLS_162));
__VLS_164.slots.default;
const __VLS_165 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_166 = __VLS_asFunctionalComponent(__VLS_165, new __VLS_165({
    modelValue: (__VLS_ctx.form.name),
}));
const __VLS_167 = __VLS_166({
    modelValue: (__VLS_ctx.form.name),
}, ...__VLS_functionalComponentArgsRest(__VLS_166));
var __VLS_164;
const __VLS_169 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_170 = __VLS_asFunctionalComponent(__VLS_169, new __VLS_169({
    label: "数据类型",
}));
const __VLS_171 = __VLS_170({
    label: "数据类型",
}, ...__VLS_functionalComponentArgsRest(__VLS_170));
__VLS_172.slots.default;
const __VLS_173 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_174 = __VLS_asFunctionalComponent(__VLS_173, new __VLS_173({
    modelValue: (__VLS_ctx.form.dataType),
    ...{ class: "w-full" },
}));
const __VLS_175 = __VLS_174({
    modelValue: (__VLS_ctx.form.dataType),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_174));
__VLS_176.slots.default;
for (const [type] of __VLS_getVForSourceType((__VLS_ctx.dataTypes))) {
    const __VLS_177 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_178 = __VLS_asFunctionalComponent(__VLS_177, new __VLS_177({
        key: (type),
        label: (type),
        value: (type),
    }));
    const __VLS_179 = __VLS_178({
        key: (type),
        label: (type),
        value: (type),
    }, ...__VLS_functionalComponentArgsRest(__VLS_178));
}
var __VLS_176;
var __VLS_172;
const __VLS_181 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_182 = __VLS_asFunctionalComponent(__VLS_181, new __VLS_181({
    label: "长度",
}));
const __VLS_183 = __VLS_182({
    label: "长度",
}, ...__VLS_functionalComponentArgsRest(__VLS_182));
__VLS_184.slots.default;
const __VLS_185 = {}.ElInputNumber;
/** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
// @ts-ignore
const __VLS_186 = __VLS_asFunctionalComponent(__VLS_185, new __VLS_185({
    modelValue: (__VLS_ctx.form.length),
    min: (1),
    max: (255),
}));
const __VLS_187 = __VLS_186({
    modelValue: (__VLS_ctx.form.length),
    min: (1),
    max: (255),
}, ...__VLS_functionalComponentArgsRest(__VLS_186));
var __VLS_184;
const __VLS_189 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_190 = __VLS_asFunctionalComponent(__VLS_189, new __VLS_189({
    label: "取值范围",
}));
const __VLS_191 = __VLS_190({
    label: "取值范围",
}, ...__VLS_functionalComponentArgsRest(__VLS_190));
__VLS_192.slots.default;
const __VLS_193 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_194 = __VLS_asFunctionalComponent(__VLS_193, new __VLS_193({
    modelValue: (__VLS_ctx.form.range),
    ...{ class: "w-full" },
}));
const __VLS_195 = __VLS_194({
    modelValue: (__VLS_ctx.form.range),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_194));
__VLS_196.slots.default;
const __VLS_197 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_198 = __VLS_asFunctionalComponent(__VLS_197, new __VLS_197({
    label: "必填",
    value: "必填",
}));
const __VLS_199 = __VLS_198({
    label: "必填",
    value: "必填",
}, ...__VLS_functionalComponentArgsRest(__VLS_198));
const __VLS_201 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_202 = __VLS_asFunctionalComponent(__VLS_201, new __VLS_201({
    label: "非必填",
    value: "非必填",
}));
const __VLS_203 = __VLS_202({
    label: "非必填",
    value: "非必填",
}, ...__VLS_functionalComponentArgsRest(__VLS_202));
var __VLS_196;
var __VLS_192;
const __VLS_205 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_206 = __VLS_asFunctionalComponent(__VLS_205, new __VLS_205({
    label: "约束条件",
}));
const __VLS_207 = __VLS_206({
    label: "约束条件",
}, ...__VLS_functionalComponentArgsRest(__VLS_206));
__VLS_208.slots.default;
const __VLS_209 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_210 = __VLS_asFunctionalComponent(__VLS_209, new __VLS_209({
    modelValue: (__VLS_ctx.form.constraint),
    ...{ class: "w-full" },
}));
const __VLS_211 = __VLS_210({
    modelValue: (__VLS_ctx.form.constraint),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_210));
__VLS_212.slots.default;
const __VLS_213 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_214 = __VLS_asFunctionalComponent(__VLS_213, new __VLS_213({
    label: "唯一约束",
    value: "唯一约束",
}));
const __VLS_215 = __VLS_214({
    label: "唯一约束",
    value: "唯一约束",
}, ...__VLS_functionalComponentArgsRest(__VLS_214));
const __VLS_217 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_218 = __VLS_asFunctionalComponent(__VLS_217, new __VLS_217({
    label: "无",
    value: "无",
}));
const __VLS_219 = __VLS_218({
    label: "无",
    value: "无",
}, ...__VLS_functionalComponentArgsRest(__VLS_218));
var __VLS_212;
var __VLS_208;
const __VLS_221 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_222 = __VLS_asFunctionalComponent(__VLS_221, new __VLS_221({
    label: "业务域",
}));
const __VLS_223 = __VLS_222({
    label: "业务域",
}, ...__VLS_functionalComponentArgsRest(__VLS_222));
__VLS_224.slots.default;
const __VLS_225 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_226 = __VLS_asFunctionalComponent(__VLS_225, new __VLS_225({
    modelValue: (__VLS_ctx.form.domain),
    ...{ class: "w-full" },
}));
const __VLS_227 = __VLS_226({
    modelValue: (__VLS_ctx.form.domain),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_226));
__VLS_228.slots.default;
for (const [domain] of __VLS_getVForSourceType((__VLS_ctx.domains))) {
    const __VLS_229 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_230 = __VLS_asFunctionalComponent(__VLS_229, new __VLS_229({
        key: (domain),
        label: (domain),
        value: (domain),
    }));
    const __VLS_231 = __VLS_230({
        key: (domain),
        label: (domain),
        value: (domain),
    }, ...__VLS_functionalComponentArgsRest(__VLS_230));
}
var __VLS_228;
var __VLS_224;
const __VLS_233 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_234 = __VLS_asFunctionalComponent(__VLS_233, new __VLS_233({
    label: "描述",
}));
const __VLS_235 = __VLS_234({
    label: "描述",
}, ...__VLS_functionalComponentArgsRest(__VLS_234));
__VLS_236.slots.default;
const __VLS_237 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_238 = __VLS_asFunctionalComponent(__VLS_237, new __VLS_237({
    modelValue: (__VLS_ctx.form.description),
    type: "textarea",
    rows: (2),
}));
const __VLS_239 = __VLS_238({
    modelValue: (__VLS_ctx.form.description),
    type: "textarea",
    rows: (2),
}, ...__VLS_functionalComponentArgsRest(__VLS_238));
var __VLS_236;
var __VLS_148;
{
    const { footer: __VLS_thisSlot } = __VLS_144.slots;
    const __VLS_241 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_242 = __VLS_asFunctionalComponent(__VLS_241, new __VLS_241({
        ...{ 'onClick': {} },
    }));
    const __VLS_243 = __VLS_242({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_242));
    let __VLS_245;
    let __VLS_246;
    let __VLS_247;
    const __VLS_248 = {
        onClick: (...[$event]) => {
            __VLS_ctx.editorVisible = false;
        }
    };
    __VLS_244.slots.default;
    var __VLS_244;
    const __VLS_249 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_250 = __VLS_asFunctionalComponent(__VLS_249, new __VLS_249({
        ...{ 'onClick': {} },
        type: "danger",
    }));
    const __VLS_251 = __VLS_250({
        ...{ 'onClick': {} },
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_250));
    let __VLS_253;
    let __VLS_254;
    let __VLS_255;
    const __VLS_256 = {
        onClick: (__VLS_ctx.saveForm)
    };
    __VLS_252.slots.default;
    var __VLS_252;
}
var __VLS_144;
const __VLS_257 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_258 = __VLS_asFunctionalComponent(__VLS_257, new __VLS_257({
    modelValue: (__VLS_ctx.detailVisible),
    title: (__VLS_ctx.detailRow?.name ?? '数据元详情'),
    width: "620px",
}));
const __VLS_259 = __VLS_258({
    modelValue: (__VLS_ctx.detailVisible),
    title: (__VLS_ctx.detailRow?.name ?? '数据元详情'),
    width: "620px",
}, ...__VLS_functionalComponentArgsRest(__VLS_258));
__VLS_260.slots.default;
if (__VLS_ctx.detailRow) {
    const __VLS_261 = {}.ElDescriptions;
    /** @type {[typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, ]} */ ;
    // @ts-ignore
    const __VLS_262 = __VLS_asFunctionalComponent(__VLS_261, new __VLS_261({
        column: (2),
        border: true,
    }));
    const __VLS_263 = __VLS_262({
        column: (2),
        border: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_262));
    __VLS_264.slots.default;
    const __VLS_265 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_266 = __VLS_asFunctionalComponent(__VLS_265, new __VLS_265({
        label: "标识符",
    }));
    const __VLS_267 = __VLS_266({
        label: "标识符",
    }, ...__VLS_functionalComponentArgsRest(__VLS_266));
    __VLS_268.slots.default;
    (__VLS_ctx.detailRow.identifier);
    var __VLS_268;
    const __VLS_269 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_270 = __VLS_asFunctionalComponent(__VLS_269, new __VLS_269({
        label: "名称",
    }));
    const __VLS_271 = __VLS_270({
        label: "名称",
    }, ...__VLS_functionalComponentArgsRest(__VLS_270));
    __VLS_272.slots.default;
    (__VLS_ctx.detailRow.name);
    var __VLS_272;
    const __VLS_273 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_274 = __VLS_asFunctionalComponent(__VLS_273, new __VLS_273({
        label: "数据类型",
    }));
    const __VLS_275 = __VLS_274({
        label: "数据类型",
    }, ...__VLS_functionalComponentArgsRest(__VLS_274));
    __VLS_276.slots.default;
    (__VLS_ctx.detailRow.dataType);
    var __VLS_276;
    const __VLS_277 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_278 = __VLS_asFunctionalComponent(__VLS_277, new __VLS_277({
        label: "长度",
    }));
    const __VLS_279 = __VLS_278({
        label: "长度",
    }, ...__VLS_functionalComponentArgsRest(__VLS_278));
    __VLS_280.slots.default;
    (__VLS_ctx.detailRow.length);
    var __VLS_280;
    const __VLS_281 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_282 = __VLS_asFunctionalComponent(__VLS_281, new __VLS_281({
        label: "取值范围",
    }));
    const __VLS_283 = __VLS_282({
        label: "取值范围",
    }, ...__VLS_functionalComponentArgsRest(__VLS_282));
    __VLS_284.slots.default;
    (__VLS_ctx.detailRow.range);
    var __VLS_284;
    const __VLS_285 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_286 = __VLS_asFunctionalComponent(__VLS_285, new __VLS_285({
        label: "默认值",
    }));
    const __VLS_287 = __VLS_286({
        label: "默认值",
    }, ...__VLS_functionalComponentArgsRest(__VLS_286));
    __VLS_288.slots.default;
    (__VLS_ctx.detailRow.defaultValue);
    var __VLS_288;
    const __VLS_289 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_290 = __VLS_asFunctionalComponent(__VLS_289, new __VLS_289({
        label: "约束条件",
    }));
    const __VLS_291 = __VLS_290({
        label: "约束条件",
    }, ...__VLS_functionalComponentArgsRest(__VLS_290));
    __VLS_292.slots.default;
    (__VLS_ctx.detailRow.constraint);
    var __VLS_292;
    const __VLS_293 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_294 = __VLS_asFunctionalComponent(__VLS_293, new __VLS_293({
        label: "业务域",
    }));
    const __VLS_295 = __VLS_294({
        label: "业务域",
    }, ...__VLS_functionalComponentArgsRest(__VLS_294));
    __VLS_296.slots.default;
    (__VLS_ctx.detailRow.domain);
    var __VLS_296;
    const __VLS_297 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_298 = __VLS_asFunctionalComponent(__VLS_297, new __VLS_297({
        label: "状态",
    }));
    const __VLS_299 = __VLS_298({
        label: "状态",
    }, ...__VLS_functionalComponentArgsRest(__VLS_298));
    __VLS_300.slots.default;
    const __VLS_301 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_302 = __VLS_asFunctionalComponent(__VLS_301, new __VLS_301({
        type: (__VLS_ctx.statusTagType[__VLS_ctx.detailRow.status]),
        effect: "dark",
    }));
    const __VLS_303 = __VLS_302({
        type: (__VLS_ctx.statusTagType[__VLS_ctx.detailRow.status]),
        effect: "dark",
    }, ...__VLS_functionalComponentArgsRest(__VLS_302));
    __VLS_304.slots.default;
    (__VLS_ctx.detailRow.status);
    var __VLS_304;
    var __VLS_300;
    const __VLS_305 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_306 = __VLS_asFunctionalComponent(__VLS_305, new __VLS_305({
        label: "引用字段",
    }));
    const __VLS_307 = __VLS_306({
        label: "引用字段",
    }, ...__VLS_functionalComponentArgsRest(__VLS_306));
    __VLS_308.slots.default;
    (__VLS_ctx.detailRow.referencedCount);
    var __VLS_308;
    const __VLS_309 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_310 = __VLS_asFunctionalComponent(__VLS_309, new __VLS_309({
        label: "描述",
        span: (2),
    }));
    const __VLS_311 = __VLS_310({
        label: "描述",
        span: (2),
    }, ...__VLS_functionalComponentArgsRest(__VLS_310));
    __VLS_312.slots.default;
    (__VLS_ctx.detailRow.description);
    var __VLS_312;
    var __VLS_264;
}
var __VLS_260;
const __VLS_313 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_314 = __VLS_asFunctionalComponent(__VLS_313, new __VLS_313({
    modelValue: (__VLS_ctx.referencesVisible),
    title: (`引用分析：${__VLS_ctx.detailRow?.name ?? ''}`),
    width: "560px",
}));
const __VLS_315 = __VLS_314({
    modelValue: (__VLS_ctx.referencesVisible),
    title: (`引用分析：${__VLS_ctx.detailRow?.name ?? ''}`),
    width: "560px",
}, ...__VLS_functionalComponentArgsRest(__VLS_314));
__VLS_316.slots.default;
const __VLS_317 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_318 = __VLS_asFunctionalComponent(__VLS_317, new __VLS_317({
    data: (__VLS_ctx.referenceRows),
    stripe: true,
    size: "small",
}));
const __VLS_319 = __VLS_318({
    data: (__VLS_ctx.referenceRows),
    stripe: true,
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_318));
__VLS_320.slots.default;
const __VLS_321 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_322 = __VLS_asFunctionalComponent(__VLS_321, new __VLS_321({
    prop: "tableName",
    label: "源表",
    minWidth: "140",
}));
const __VLS_323 = __VLS_322({
    prop: "tableName",
    label: "源表",
    minWidth: "140",
}, ...__VLS_functionalComponentArgsRest(__VLS_322));
const __VLS_325 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_326 = __VLS_asFunctionalComponent(__VLS_325, new __VLS_325({
    prop: "fieldName",
    label: "字段",
    width: "120",
}));
const __VLS_327 = __VLS_326({
    prop: "fieldName",
    label: "字段",
    width: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_326));
const __VLS_329 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_330 = __VLS_asFunctionalComponent(__VLS_329, new __VLS_329({
    prop: "sourceName",
    label: "所属数据源",
    minWidth: "130",
}));
const __VLS_331 = __VLS_330({
    prop: "sourceName",
    label: "所属数据源",
    minWidth: "130",
}, ...__VLS_functionalComponentArgsRest(__VLS_330));
const __VLS_333 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_334 = __VLS_asFunctionalComponent(__VLS_333, new __VLS_333({
    label: "映射方式",
    width: "100",
}));
const __VLS_335 = __VLS_334({
    label: "映射方式",
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_334));
__VLS_336.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_336.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    (row.mode);
}
var __VLS_336;
var __VLS_320;
var __VLS_316;
/** @type {__VLS_StyleScopedClasses['standard-page']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['toolbar-row']} */ ;
/** @type {__VLS_StyleScopedClasses['search-input']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-select']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-select']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-select']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-12']} */ ;
/** @type {__VLS_StyleScopedClasses['pager']} */ ;
/** @type {__VLS_StyleScopedClasses['form-error']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Plus: Plus,
            Search: Search,
            statuses: statuses,
            domains: domains,
            dataTypes: dataTypes,
            statusTagType: statusTagType,
            keyword: keyword,
            filterDomain: filterDomain,
            filterStatus: filterStatus,
            filterDataType: filterDataType,
            currentPage: currentPage,
            pageSize: pageSize,
            editorVisible: editorVisible,
            detailVisible: detailVisible,
            referencesVisible: referencesVisible,
            editing: editing,
            detailRow: detailRow,
            identifierTaken: identifierTaken,
            form: form,
            referenceRows: referenceRows,
            filteredElements: filteredElements,
            pagedElements: pagedElements,
            resetPagination: resetPagination,
            handleSizeChange: handleSizeChange,
            checkIdentifier: checkIdentifier,
            openCreate: openCreate,
            openEdit: openEdit,
            saveForm: saveForm,
            openReview: openReview,
            showDetail: showDetail,
            showReferences: showReferences,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
