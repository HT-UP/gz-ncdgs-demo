import { computed, reactive, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Plus, Search } from '@element-plus/icons-vue';
import { mockStandards, standardCategoryOptions, } from '@/mock/standard';
const categories = standardCategoryOptions.map((item) => item.value);
const domains = Array.from(new Set(mockStandards.map((item) => item.domain)));
const owners = Array.from(new Set(mockStandards.map((item) => item.owner)));
const statuses = Array.from(new Set(mockStandards.map((item) => item.status)));
const statusTagType = {
    草稿: 'info',
    审核中: 'warning',
    已发布: 'success',
    已废止: 'danger',
};
const activeCategory = ref('业务术语');
const keyword = ref('');
const filterDomain = ref('');
const filterOwner = ref('');
const filterStatus = ref('');
const currentPage = ref(1);
const pageSize = ref(20);
const editorVisible = ref(false);
const detailVisible = ref(false);
const editing = ref(null);
const detailRow = ref(null);
const form = reactive({
    name: '',
    category: '业务术语',
    domain: '客运管理',
    owner: '张三',
    description: '',
});
const filteredStandards = computed(() => mockStandards.filter((item) => {
    if (item.category !== activeCategory.value)
        return false;
    if (keyword.value) {
        const kw = keyword.value.toLowerCase();
        if (!item.name.toLowerCase().includes(kw) && !item.code.toLowerCase().includes(kw))
            return false;
    }
    if (filterDomain.value && item.domain !== filterDomain.value)
        return false;
    if (filterOwner.value && item.owner !== filterOwner.value)
        return false;
    if (filterStatus.value && item.status !== filterStatus.value)
        return false;
    return true;
}));
const pagedStandards = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    return filteredStandards.value.slice(start, start + pageSize.value);
});
const resetPagination = () => {
    currentPage.value = 1;
};
const handleSizeChange = (size) => {
    pageSize.value = size;
    resetPagination();
};
const openCreate = () => {
    editing.value = null;
    Object.assign(form, { name: '', category: activeCategory.value, domain: domains[0], owner: owners[0], description: '' });
    editorVisible.value = true;
};
const openEdit = (row) => {
    editing.value = row;
    Object.assign(form, {
        name: row.name,
        category: row.category,
        domain: row.domain,
        owner: row.owner,
        description: row.description,
    });
    editorVisible.value = true;
};
const saveForm = () => {
    if (!form.name.trim()) {
        ElMessage.warning('请输入标准名称');
        return;
    }
    if (editing.value) {
        editing.value.name = form.name;
        editing.value.category = form.category;
        editing.value.domain = form.domain;
        editing.value.owner = form.owner;
        editing.value.description = form.description;
        ElMessage.success('标准已更新（Mock）');
    }
    else {
        mockStandards.unshift({
            id: `mock-${Date.now()}`,
            code: `BZ-${String(mockStandards.length + 1).padStart(4, '0')}`,
            name: form.name,
            category: form.category,
            domain: form.domain,
            owner: form.owner,
            status: '草稿',
            updateTime: new Date().toLocaleString('sv-SE').replace('T', ' '),
            version: 'V1.0',
            mappedFields: 0,
            description: form.description || '新建标准',
        });
        ElMessage.success('标准已新增（Mock）');
    }
    editorVisible.value = false;
};
const confirmDelete = (row) => {
    ElMessageBox.confirm(`确认删除标准「${row.name}」吗？`, '删除确认', { type: 'warning' })
        .then(() => {
        const index = mockStandards.indexOf(row);
        if (index > -1)
            mockStandards.splice(index, 1);
        ElMessage.success('标准已删除（Mock）');
    })
        .catch(() => { });
};
const showDetail = (row) => {
    detailRow.value = row;
    detailVisible.value = true;
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
const __VLS_12 = {}.ElTabs;
/** @type {[typeof __VLS_components.ElTabs, typeof __VLS_components.elTabs, typeof __VLS_components.ElTabs, typeof __VLS_components.elTabs, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
    ...{ 'onTabChange': {} },
    modelValue: (__VLS_ctx.activeCategory),
}));
const __VLS_14 = __VLS_13({
    ...{ 'onTabChange': {} },
    modelValue: (__VLS_ctx.activeCategory),
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
let __VLS_16;
let __VLS_17;
let __VLS_18;
const __VLS_19 = {
    onTabChange: (__VLS_ctx.resetPagination)
};
__VLS_15.slots.default;
for (const [category] of __VLS_getVForSourceType((__VLS_ctx.categories))) {
    const __VLS_20 = {}.ElTabPane;
    /** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
    // @ts-ignore
    const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
        key: (category),
        label: (category),
        name: (category),
    }));
    const __VLS_22 = __VLS_21({
        key: (category),
        label: (category),
        name: (category),
    }, ...__VLS_functionalComponentArgsRest(__VLS_21));
}
var __VLS_15;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "toolbar-row" },
});
const __VLS_24 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    ...{ 'onInput': {} },
    modelValue: (__VLS_ctx.keyword),
    placeholder: "按名称 / 编码搜索",
    clearable: true,
    ...{ class: "search-input" },
    prefixIcon: (__VLS_ctx.Search),
}));
const __VLS_26 = __VLS_25({
    ...{ 'onInput': {} },
    modelValue: (__VLS_ctx.keyword),
    placeholder: "按名称 / 编码搜索",
    clearable: true,
    ...{ class: "search-input" },
    prefixIcon: (__VLS_ctx.Search),
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
let __VLS_28;
let __VLS_29;
let __VLS_30;
const __VLS_31 = {
    onInput: (__VLS_ctx.resetPagination)
};
var __VLS_27;
const __VLS_32 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.filterDomain),
    placeholder: "业务域",
    clearable: true,
    ...{ class: "filter-select" },
}));
const __VLS_34 = __VLS_33({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.filterDomain),
    placeholder: "业务域",
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
for (const [domain] of __VLS_getVForSourceType((__VLS_ctx.domains))) {
    const __VLS_40 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
        key: (domain),
        label: (domain),
        value: (domain),
    }));
    const __VLS_42 = __VLS_41({
        key: (domain),
        label: (domain),
        value: (domain),
    }, ...__VLS_functionalComponentArgsRest(__VLS_41));
}
var __VLS_35;
const __VLS_44 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.filterOwner),
    placeholder: "责任人",
    clearable: true,
    ...{ class: "filter-select" },
}));
const __VLS_46 = __VLS_45({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.filterOwner),
    placeholder: "责任人",
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
for (const [owner] of __VLS_getVForSourceType((__VLS_ctx.owners))) {
    const __VLS_52 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
        key: (owner),
        label: (owner),
        value: (owner),
    }));
    const __VLS_54 = __VLS_53({
        key: (owner),
        label: (owner),
        value: (owner),
    }, ...__VLS_functionalComponentArgsRest(__VLS_53));
}
var __VLS_47;
const __VLS_56 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.filterStatus),
    placeholder: "状态",
    clearable: true,
    ...{ class: "filter-select" },
}));
const __VLS_58 = __VLS_57({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.filterStatus),
    placeholder: "状态",
    clearable: true,
    ...{ class: "filter-select" },
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
let __VLS_60;
let __VLS_61;
let __VLS_62;
const __VLS_63 = {
    onChange: (__VLS_ctx.resetPagination)
};
__VLS_59.slots.default;
for (const [status] of __VLS_getVForSourceType((__VLS_ctx.statuses))) {
    const __VLS_64 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
        key: (status),
        label: (status),
        value: (status),
    }));
    const __VLS_66 = __VLS_65({
        key: (status),
        label: (status),
        value: (status),
    }, ...__VLS_functionalComponentArgsRest(__VLS_65));
}
var __VLS_59;
const __VLS_68 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
    ...{ 'onRowClick': {} },
    data: (__VLS_ctx.pagedStandards),
    stripe: true,
    ...{ class: "mt-12" },
}));
const __VLS_70 = __VLS_69({
    ...{ 'onRowClick': {} },
    data: (__VLS_ctx.pagedStandards),
    stripe: true,
    ...{ class: "mt-12" },
}, ...__VLS_functionalComponentArgsRest(__VLS_69));
let __VLS_72;
let __VLS_73;
let __VLS_74;
const __VLS_75 = {
    onRowClick: (__VLS_ctx.showDetail)
};
__VLS_71.slots.default;
const __VLS_76 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
    prop: "code",
    label: "标准编码",
    width: "110",
}));
const __VLS_78 = __VLS_77({
    prop: "code",
    label: "标准编码",
    width: "110",
}, ...__VLS_functionalComponentArgsRest(__VLS_77));
const __VLS_80 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
    prop: "name",
    label: "标准名称",
    minWidth: "180",
}));
const __VLS_82 = __VLS_81({
    prop: "name",
    label: "标准名称",
    minWidth: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_81));
const __VLS_84 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
    prop: "category",
    label: "类型",
    width: "110",
}));
const __VLS_86 = __VLS_85({
    prop: "category",
    label: "类型",
    width: "110",
}, ...__VLS_functionalComponentArgsRest(__VLS_85));
const __VLS_88 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
    prop: "domain",
    label: "业务域",
    width: "110",
}));
const __VLS_90 = __VLS_89({
    prop: "domain",
    label: "业务域",
    width: "110",
}, ...__VLS_functionalComponentArgsRest(__VLS_89));
const __VLS_92 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
    prop: "owner",
    label: "责任人",
    width: "90",
}));
const __VLS_94 = __VLS_93({
    prop: "owner",
    label: "责任人",
    width: "90",
}, ...__VLS_functionalComponentArgsRest(__VLS_93));
const __VLS_96 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
    prop: "version",
    label: "版本",
    width: "80",
}));
const __VLS_98 = __VLS_97({
    prop: "version",
    label: "版本",
    width: "80",
}, ...__VLS_functionalComponentArgsRest(__VLS_97));
const __VLS_100 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
    label: "映射字段",
    width: "90",
    align: "center",
}));
const __VLS_102 = __VLS_101({
    label: "映射字段",
    width: "90",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_101));
__VLS_103.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_103.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: ({ 'no-mapping': row.mappedFields === 0 }) },
    });
    (row.mappedFields === 0 ? '未映射' : `${row.mappedFields} 个`);
}
var __VLS_103;
const __VLS_104 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
    label: "状态",
    width: "90",
}));
const __VLS_106 = __VLS_105({
    label: "状态",
    width: "90",
}, ...__VLS_functionalComponentArgsRest(__VLS_105));
__VLS_107.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_107.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_108 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
        type: (__VLS_ctx.statusTagType[row.status]),
        effect: "dark",
    }));
    const __VLS_110 = __VLS_109({
        type: (__VLS_ctx.statusTagType[row.status]),
        effect: "dark",
    }, ...__VLS_functionalComponentArgsRest(__VLS_109));
    __VLS_111.slots.default;
    (row.status);
    var __VLS_111;
}
var __VLS_107;
const __VLS_112 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
    label: "更新时间",
    width: "150",
}));
const __VLS_114 = __VLS_113({
    label: "更新时间",
    width: "150",
}, ...__VLS_functionalComponentArgsRest(__VLS_113));
__VLS_115.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_115.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    (row.updateTime);
}
var __VLS_115;
const __VLS_116 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
    label: "操作",
    width: "140",
    fixed: "right",
}));
const __VLS_118 = __VLS_117({
    label: "操作",
    width: "140",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_117));
__VLS_119.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_119.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_120 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({
        ...{ 'onClick': {} },
        link: true,
        type: "danger",
    }));
    const __VLS_122 = __VLS_121({
        ...{ 'onClick': {} },
        link: true,
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_121));
    let __VLS_124;
    let __VLS_125;
    let __VLS_126;
    const __VLS_127 = {
        onClick: (...[$event]) => {
            __VLS_ctx.openEdit(row);
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
        type: "danger",
    }));
    const __VLS_130 = __VLS_129({
        ...{ 'onClick': {} },
        link: true,
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_129));
    let __VLS_132;
    let __VLS_133;
    let __VLS_134;
    const __VLS_135 = {
        onClick: (...[$event]) => {
            __VLS_ctx.confirmDelete(row);
        }
    };
    __VLS_131.slots.default;
    var __VLS_131;
}
var __VLS_119;
var __VLS_71;
const __VLS_136 = {}.ElPagination;
/** @type {[typeof __VLS_components.ElPagination, typeof __VLS_components.elPagination, ]} */ ;
// @ts-ignore
const __VLS_137 = __VLS_asFunctionalComponent(__VLS_136, new __VLS_136({
    ...{ 'onCurrentChange': {} },
    ...{ 'onSizeChange': {} },
    ...{ class: "pager" },
    layout: "total, prev, pager, next, sizes",
    total: (__VLS_ctx.filteredStandards.length),
    pageSize: (__VLS_ctx.pageSize),
    currentPage: (__VLS_ctx.currentPage),
    pageSizes: ([10, 20, 50]),
    background: true,
}));
const __VLS_138 = __VLS_137({
    ...{ 'onCurrentChange': {} },
    ...{ 'onSizeChange': {} },
    ...{ class: "pager" },
    layout: "total, prev, pager, next, sizes",
    total: (__VLS_ctx.filteredStandards.length),
    pageSize: (__VLS_ctx.pageSize),
    currentPage: (__VLS_ctx.currentPage),
    pageSizes: ([10, 20, 50]),
    background: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_137));
let __VLS_140;
let __VLS_141;
let __VLS_142;
const __VLS_143 = {
    onCurrentChange: (...[$event]) => {
        __VLS_ctx.currentPage = $event;
    }
};
const __VLS_144 = {
    onSizeChange: (__VLS_ctx.handleSizeChange)
};
var __VLS_139;
var __VLS_3;
const __VLS_145 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_146 = __VLS_asFunctionalComponent(__VLS_145, new __VLS_145({
    modelValue: (__VLS_ctx.editorVisible),
    title: (__VLS_ctx.editing ? '编辑标准' : '新增标准'),
    width: "560px",
}));
const __VLS_147 = __VLS_146({
    modelValue: (__VLS_ctx.editorVisible),
    title: (__VLS_ctx.editing ? '编辑标准' : '新增标准'),
    width: "560px",
}, ...__VLS_functionalComponentArgsRest(__VLS_146));
__VLS_148.slots.default;
const __VLS_149 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_150 = __VLS_asFunctionalComponent(__VLS_149, new __VLS_149({
    model: (__VLS_ctx.form),
    labelWidth: "90px",
}));
const __VLS_151 = __VLS_150({
    model: (__VLS_ctx.form),
    labelWidth: "90px",
}, ...__VLS_functionalComponentArgsRest(__VLS_150));
__VLS_152.slots.default;
const __VLS_153 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_154 = __VLS_asFunctionalComponent(__VLS_153, new __VLS_153({
    label: "标准名称",
}));
const __VLS_155 = __VLS_154({
    label: "标准名称",
}, ...__VLS_functionalComponentArgsRest(__VLS_154));
__VLS_156.slots.default;
const __VLS_157 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_158 = __VLS_asFunctionalComponent(__VLS_157, new __VLS_157({
    modelValue: (__VLS_ctx.form.name),
}));
const __VLS_159 = __VLS_158({
    modelValue: (__VLS_ctx.form.name),
}, ...__VLS_functionalComponentArgsRest(__VLS_158));
var __VLS_156;
const __VLS_161 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_162 = __VLS_asFunctionalComponent(__VLS_161, new __VLS_161({
    label: "类型",
}));
const __VLS_163 = __VLS_162({
    label: "类型",
}, ...__VLS_functionalComponentArgsRest(__VLS_162));
__VLS_164.slots.default;
const __VLS_165 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_166 = __VLS_asFunctionalComponent(__VLS_165, new __VLS_165({
    modelValue: (__VLS_ctx.form.category),
    ...{ class: "filter-select" },
}));
const __VLS_167 = __VLS_166({
    modelValue: (__VLS_ctx.form.category),
    ...{ class: "filter-select" },
}, ...__VLS_functionalComponentArgsRest(__VLS_166));
__VLS_168.slots.default;
for (const [category] of __VLS_getVForSourceType((__VLS_ctx.categories))) {
    const __VLS_169 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_170 = __VLS_asFunctionalComponent(__VLS_169, new __VLS_169({
        key: (category),
        label: (category),
        value: (category),
    }));
    const __VLS_171 = __VLS_170({
        key: (category),
        label: (category),
        value: (category),
    }, ...__VLS_functionalComponentArgsRest(__VLS_170));
}
var __VLS_168;
var __VLS_164;
const __VLS_173 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_174 = __VLS_asFunctionalComponent(__VLS_173, new __VLS_173({
    label: "业务域",
}));
const __VLS_175 = __VLS_174({
    label: "业务域",
}, ...__VLS_functionalComponentArgsRest(__VLS_174));
__VLS_176.slots.default;
const __VLS_177 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_178 = __VLS_asFunctionalComponent(__VLS_177, new __VLS_177({
    modelValue: (__VLS_ctx.form.domain),
    ...{ class: "filter-select" },
}));
const __VLS_179 = __VLS_178({
    modelValue: (__VLS_ctx.form.domain),
    ...{ class: "filter-select" },
}, ...__VLS_functionalComponentArgsRest(__VLS_178));
__VLS_180.slots.default;
for (const [domain] of __VLS_getVForSourceType((__VLS_ctx.domains))) {
    const __VLS_181 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_182 = __VLS_asFunctionalComponent(__VLS_181, new __VLS_181({
        key: (domain),
        label: (domain),
        value: (domain),
    }));
    const __VLS_183 = __VLS_182({
        key: (domain),
        label: (domain),
        value: (domain),
    }, ...__VLS_functionalComponentArgsRest(__VLS_182));
}
var __VLS_180;
var __VLS_176;
const __VLS_185 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_186 = __VLS_asFunctionalComponent(__VLS_185, new __VLS_185({
    label: "责任人",
}));
const __VLS_187 = __VLS_186({
    label: "责任人",
}, ...__VLS_functionalComponentArgsRest(__VLS_186));
__VLS_188.slots.default;
const __VLS_189 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_190 = __VLS_asFunctionalComponent(__VLS_189, new __VLS_189({
    modelValue: (__VLS_ctx.form.owner),
    ...{ class: "filter-select" },
}));
const __VLS_191 = __VLS_190({
    modelValue: (__VLS_ctx.form.owner),
    ...{ class: "filter-select" },
}, ...__VLS_functionalComponentArgsRest(__VLS_190));
__VLS_192.slots.default;
for (const [owner] of __VLS_getVForSourceType((__VLS_ctx.owners))) {
    const __VLS_193 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_194 = __VLS_asFunctionalComponent(__VLS_193, new __VLS_193({
        key: (owner),
        label: (owner),
        value: (owner),
    }));
    const __VLS_195 = __VLS_194({
        key: (owner),
        label: (owner),
        value: (owner),
    }, ...__VLS_functionalComponentArgsRest(__VLS_194));
}
var __VLS_192;
var __VLS_188;
const __VLS_197 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_198 = __VLS_asFunctionalComponent(__VLS_197, new __VLS_197({
    label: "描述",
}));
const __VLS_199 = __VLS_198({
    label: "描述",
}, ...__VLS_functionalComponentArgsRest(__VLS_198));
__VLS_200.slots.default;
const __VLS_201 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_202 = __VLS_asFunctionalComponent(__VLS_201, new __VLS_201({
    modelValue: (__VLS_ctx.form.description),
    type: "textarea",
    rows: (3),
}));
const __VLS_203 = __VLS_202({
    modelValue: (__VLS_ctx.form.description),
    type: "textarea",
    rows: (3),
}, ...__VLS_functionalComponentArgsRest(__VLS_202));
var __VLS_200;
var __VLS_152;
{
    const { footer: __VLS_thisSlot } = __VLS_148.slots;
    const __VLS_205 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_206 = __VLS_asFunctionalComponent(__VLS_205, new __VLS_205({
        ...{ 'onClick': {} },
    }));
    const __VLS_207 = __VLS_206({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_206));
    let __VLS_209;
    let __VLS_210;
    let __VLS_211;
    const __VLS_212 = {
        onClick: (...[$event]) => {
            __VLS_ctx.editorVisible = false;
        }
    };
    __VLS_208.slots.default;
    var __VLS_208;
    const __VLS_213 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_214 = __VLS_asFunctionalComponent(__VLS_213, new __VLS_213({
        ...{ 'onClick': {} },
        type: "danger",
    }));
    const __VLS_215 = __VLS_214({
        ...{ 'onClick': {} },
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_214));
    let __VLS_217;
    let __VLS_218;
    let __VLS_219;
    const __VLS_220 = {
        onClick: (__VLS_ctx.saveForm)
    };
    __VLS_216.slots.default;
    var __VLS_216;
}
var __VLS_148;
const __VLS_221 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_222 = __VLS_asFunctionalComponent(__VLS_221, new __VLS_221({
    modelValue: (__VLS_ctx.detailVisible),
    title: (__VLS_ctx.detailRow?.name ?? '标准详情'),
    width: "560px",
}));
const __VLS_223 = __VLS_222({
    modelValue: (__VLS_ctx.detailVisible),
    title: (__VLS_ctx.detailRow?.name ?? '标准详情'),
    width: "560px",
}, ...__VLS_functionalComponentArgsRest(__VLS_222));
__VLS_224.slots.default;
const __VLS_225 = {}.ElDescriptions;
/** @type {[typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, ]} */ ;
// @ts-ignore
const __VLS_226 = __VLS_asFunctionalComponent(__VLS_225, new __VLS_225({
    column: (2),
    border: true,
}));
const __VLS_227 = __VLS_226({
    column: (2),
    border: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_226));
__VLS_228.slots.default;
const __VLS_229 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_230 = __VLS_asFunctionalComponent(__VLS_229, new __VLS_229({
    label: "标准编码",
}));
const __VLS_231 = __VLS_230({
    label: "标准编码",
}, ...__VLS_functionalComponentArgsRest(__VLS_230));
__VLS_232.slots.default;
(__VLS_ctx.detailRow?.code);
var __VLS_232;
const __VLS_233 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_234 = __VLS_asFunctionalComponent(__VLS_233, new __VLS_233({
    label: "类型",
}));
const __VLS_235 = __VLS_234({
    label: "类型",
}, ...__VLS_functionalComponentArgsRest(__VLS_234));
__VLS_236.slots.default;
(__VLS_ctx.detailRow?.category);
var __VLS_236;
const __VLS_237 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_238 = __VLS_asFunctionalComponent(__VLS_237, new __VLS_237({
    label: "业务域",
}));
const __VLS_239 = __VLS_238({
    label: "业务域",
}, ...__VLS_functionalComponentArgsRest(__VLS_238));
__VLS_240.slots.default;
(__VLS_ctx.detailRow?.domain);
var __VLS_240;
const __VLS_241 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_242 = __VLS_asFunctionalComponent(__VLS_241, new __VLS_241({
    label: "责任人",
}));
const __VLS_243 = __VLS_242({
    label: "责任人",
}, ...__VLS_functionalComponentArgsRest(__VLS_242));
__VLS_244.slots.default;
(__VLS_ctx.detailRow?.owner);
var __VLS_244;
const __VLS_245 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_246 = __VLS_asFunctionalComponent(__VLS_245, new __VLS_245({
    label: "版本",
}));
const __VLS_247 = __VLS_246({
    label: "版本",
}, ...__VLS_functionalComponentArgsRest(__VLS_246));
__VLS_248.slots.default;
(__VLS_ctx.detailRow?.version);
var __VLS_248;
const __VLS_249 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_250 = __VLS_asFunctionalComponent(__VLS_249, new __VLS_249({
    label: "映射字段",
}));
const __VLS_251 = __VLS_250({
    label: "映射字段",
}, ...__VLS_functionalComponentArgsRest(__VLS_250));
__VLS_252.slots.default;
(__VLS_ctx.detailRow?.mappedFields);
var __VLS_252;
const __VLS_253 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_254 = __VLS_asFunctionalComponent(__VLS_253, new __VLS_253({
    label: "状态",
}));
const __VLS_255 = __VLS_254({
    label: "状态",
}, ...__VLS_functionalComponentArgsRest(__VLS_254));
__VLS_256.slots.default;
if (__VLS_ctx.detailRow) {
    const __VLS_257 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_258 = __VLS_asFunctionalComponent(__VLS_257, new __VLS_257({
        type: (__VLS_ctx.statusTagType[__VLS_ctx.detailRow.status]),
        effect: "dark",
    }));
    const __VLS_259 = __VLS_258({
        type: (__VLS_ctx.statusTagType[__VLS_ctx.detailRow.status]),
        effect: "dark",
    }, ...__VLS_functionalComponentArgsRest(__VLS_258));
    __VLS_260.slots.default;
    (__VLS_ctx.detailRow.status);
    var __VLS_260;
}
var __VLS_256;
const __VLS_261 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_262 = __VLS_asFunctionalComponent(__VLS_261, new __VLS_261({
    label: "更新时间",
}));
const __VLS_263 = __VLS_262({
    label: "更新时间",
}, ...__VLS_functionalComponentArgsRest(__VLS_262));
__VLS_264.slots.default;
(__VLS_ctx.detailRow?.updateTime);
var __VLS_264;
const __VLS_265 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_266 = __VLS_asFunctionalComponent(__VLS_265, new __VLS_265({
    label: "描述",
    span: (2),
}));
const __VLS_267 = __VLS_266({
    label: "描述",
    span: (2),
}, ...__VLS_functionalComponentArgsRest(__VLS_266));
__VLS_268.slots.default;
(__VLS_ctx.detailRow?.description);
var __VLS_268;
var __VLS_228;
var __VLS_224;
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
/** @type {__VLS_StyleScopedClasses['filter-select']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-select']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-select']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Plus: Plus,
            Search: Search,
            categories: categories,
            domains: domains,
            owners: owners,
            statuses: statuses,
            statusTagType: statusTagType,
            activeCategory: activeCategory,
            keyword: keyword,
            filterDomain: filterDomain,
            filterOwner: filterOwner,
            filterStatus: filterStatus,
            currentPage: currentPage,
            pageSize: pageSize,
            editorVisible: editorVisible,
            detailVisible: detailVisible,
            editing: editing,
            detailRow: detailRow,
            form: form,
            filteredStandards: filteredStandards,
            pagedStandards: pagedStandards,
            resetPagination: resetPagination,
            handleSizeChange: handleSizeChange,
            openCreate: openCreate,
            openEdit: openEdit,
            saveForm: saveForm,
            confirmDelete: confirmDelete,
            showDetail: showDetail,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
