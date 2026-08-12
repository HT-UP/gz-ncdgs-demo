import { computed, reactive, ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { Folder, Lock, Plus, Search } from '@element-plus/icons-vue';
import { catalogTree, mockAssets } from '@/mock/resource';
const levelColor = {
    L1: '#E34D59',
    L2: '#ED7B2F',
    L3: '#2B6CB0',
    L4: '#8C8C8C',
};
const nodeIcon = { folder: Folder, layer: Folder };
const treeKeyword = ref('');
const keyword = ref('');
const filterLevel = ref('');
const currentPage = ref(1);
const pageSize = 20;
const currentLabel = ref('全部目录');
const currentCatalogId = ref('');
const assets = ref([...mockAssets]);
const servicePool = [
    { name: '票务查询服务', type: '查询类', interfaceCount: 12, desc: '票务数据统一查询接口' },
    { name: '客流统计服务', type: '统计类', interfaceCount: 8, desc: '客流指标聚合接口' },
    { name: '设备状态服务', type: '查询类', interfaceCount: 6, desc: '设备运行状态接入' },
    { name: '乘客信息服务', type: '管理类', interfaceCount: 5, desc: '乘客档案读写接口' },
];
const flattenTree = computed(() => {
    const result = [];
    const walk = (nodes) => {
        nodes.forEach((node) => {
            result.push({ id: node.id, label: node.label });
            if (node.children)
                walk(node.children);
        });
    };
    walk(catalogTree);
    return result.slice(1);
});
const filteredTree = computed(() => {
    if (!treeKeyword.value)
        return catalogTree;
    const match = (node) => {
        if (node.label.includes(treeKeyword.value))
            return true;
        if (node.children)
            return node.children.some((child) => match(child));
        return false;
    };
    return catalogTree.filter(match);
});
const filteredAssets = computed(() => assets.value.filter((asset) => {
    if (filterLevel.value && asset.level !== filterLevel.value)
        return false;
    if (keyword.value) {
        const kw = keyword.value.toLowerCase();
        const matched = asset.name.toLowerCase().includes(kw) ||
            asset.type.toLowerCase().includes(kw) ||
            asset.level.toLowerCase().includes(kw);
        if (!matched)
            return false;
    }
    if (currentCatalogId.value) {
        if (currentCatalogId.value.startsWith('biz-') && !asset.catalogPath.includes(currentCatalogId.value.replace('biz-', ''))) {
            return false;
        }
        if ((currentCatalogId.value === 'layer-ods' || currentCatalogId.value === 'layer-dwd' || currentCatalogId.value === 'layer-dws' || currentCatalogId.value === 'layer-ads') && !asset.storageLayer.includes(currentCatalogId.value.replace('layer-', '').toUpperCase())) {
            return false;
        }
    }
    return true;
}));
const pagedAssets = computed(() => {
    const start = (currentPage.value - 1) * pageSize;
    return filteredAssets.value.slice(start, start + pageSize);
});
const changePage = (page) => {
    currentPage.value = page;
};
watch([keyword, filterLevel, currentCatalogId], () => {
    currentPage.value = 1;
});
watch(filteredAssets, (list) => {
    const maxPage = Math.max(1, Math.ceil(list.length / pageSize));
    if (currentPage.value > maxPage)
        currentPage.value = maxPage;
});
const selectNode = (data) => {
    if (data.assetCount === undefined)
        return;
    currentLabel.value = data.label;
    currentCatalogId.value = data.id;
    currentPage.value = 1;
    ElMessage.info(`已定位至「${data.label}」目录，共 ${data.assetCount} 项资产（Mock）`);
};
const registerVisible = ref(false);
const registerForm = reactive({
    catalog: '客运管理',
    dept: '信息中心',
    owner: '',
    level: 'L3',
    tags: [],
    desc: '',
});
const openRegister = () => {
    Object.assign(registerForm, { catalog: '客运管理', dept: '信息中心', owner: '张三', level: 'L3', tags: [], desc: '' });
    registerVisible.value = true;
};
const selectService = (row) => {
    ElMessage.info(`已选择服务「${row.name}」（Mock）`);
};
const submitRegister = () => {
    registerVisible.value = false;
    ElMessage.success('资产已注册入目（Mock）');
};
const editVisible = ref(false);
const editForm = reactive({
    id: '',
    name: '',
    catalog: '',
    dept: '',
    owner: '',
    level: 'L3',
    tags: [],
    desc: '',
});
const openEdit = (row) => {
    Object.assign(editForm, {
        id: row.id,
        name: row.name,
        catalog: row.catalogPath.replace('/按业务域/', ''),
        dept: row.responsibleDept,
        owner: row.owner,
        level: row.level,
        tags: [...row.tags],
        desc: row.description,
    });
    editVisible.value = true;
};
const saveEdit = () => {
    const target = assets.value.find((item) => item.id === editForm.id);
    if (target) {
        target.responsibleDept = editForm.dept;
        target.owner = editForm.owner;
        target.level = editForm.level;
        target.tags = [...editForm.tags];
        target.description = editForm.desc;
    }
    editVisible.value = false;
    ElMessage.success('资产属性已保存（Mock）');
};
const migrateVisible = ref(false);
const migrateTarget = ref('');
let migrateRow = null;
const openMigrate = (row) => {
    migrateRow = row;
    migrateTarget.value = row.name;
    migrateVisible.value = true;
};
const pickMigrateNode = (data) => {
    if (migrateRow) {
        migrateRow.catalogPath = `/按业务域/${data.label}`;
    }
};
const submitMigrate = () => {
    migrateVisible.value = false;
    ElMessage.success(`资产「${migrateTarget.value}」已迁移目录（Mock）`);
};
const detailVisible = ref(false);
const detailAsset = ref(null);
const openDetail = (row) => {
    detailAsset.value = row;
    detailVisible.value = true;
};
const removeAsset = (row) => {
    assets.value = assets.value.filter((item) => item.id !== row.id);
    ElMessage.success(`资产「${row.name}」已删除（Mock）`);
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
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-actions" },
    });
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
        onClick: (__VLS_ctx.openRegister)
    };
    __VLS_7.slots.default;
    var __VLS_7;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "catalog-layout" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "catalog-tree-panel" },
});
const __VLS_12 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
    modelValue: (__VLS_ctx.treeKeyword),
    placeholder: "搜索目录",
    prefixIcon: (__VLS_ctx.Search),
    clearable: true,
    size: "small",
}));
const __VLS_14 = __VLS_13({
    modelValue: (__VLS_ctx.treeKeyword),
    placeholder: "搜索目录",
    prefixIcon: (__VLS_ctx.Search),
    clearable: true,
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
const __VLS_16 = {}.ElTree;
/** @type {[typeof __VLS_components.ElTree, typeof __VLS_components.elTree, typeof __VLS_components.ElTree, typeof __VLS_components.elTree, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    ...{ 'onNodeClick': {} },
    data: (__VLS_ctx.filteredTree),
    nodeKey: "id",
    defaultExpandAll: true,
    highlightCurrent: true,
    props: ({ label: 'label', children: 'children' }),
}));
const __VLS_18 = __VLS_17({
    ...{ 'onNodeClick': {} },
    data: (__VLS_ctx.filteredTree),
    nodeKey: "id",
    defaultExpandAll: true,
    highlightCurrent: true,
    props: ({ label: 'label', children: 'children' }),
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
let __VLS_20;
let __VLS_21;
let __VLS_22;
const __VLS_23 = {
    onNodeClick: (__VLS_ctx.selectNode)
};
__VLS_19.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_19.slots;
    const [{ data }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "catalog-node" },
    });
    const __VLS_24 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
        size: (14),
    }));
    const __VLS_26 = __VLS_25({
        size: (14),
    }, ...__VLS_functionalComponentArgsRest(__VLS_25));
    __VLS_27.slots.default;
    const __VLS_28 = ((__VLS_ctx.nodeIcon[data.type === 'layer' ? 'layer' : 'folder']));
    // @ts-ignore
    const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({}));
    const __VLS_30 = __VLS_29({}, ...__VLS_functionalComponentArgsRest(__VLS_29));
    var __VLS_27;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (data.label);
    if (data.assetCount) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "catalog-count" },
        });
        (data.assetCount);
    }
    if (data.type === 'custom' && data.id.startsWith('custom-map')) {
        const __VLS_32 = {}.Lock;
        /** @type {[typeof __VLS_components.Lock, ]} */ ;
        // @ts-ignore
        const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
            ...{ class: "catalog-lock" },
            size: (12),
        }));
        const __VLS_34 = __VLS_33({
            ...{ class: "catalog-lock" },
            size: (12),
        }, ...__VLS_functionalComponentArgsRest(__VLS_33));
    }
}
var __VLS_19;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "catalog-table-panel" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "toolbar-row" },
});
const __VLS_36 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    modelValue: (__VLS_ctx.keyword),
    placeholder: "按名称 / 类型 / 分级搜索",
    clearable: true,
    ...{ class: "search-input" },
    prefixIcon: (__VLS_ctx.Search),
}));
const __VLS_38 = __VLS_37({
    modelValue: (__VLS_ctx.keyword),
    placeholder: "按名称 / 类型 / 分级搜索",
    clearable: true,
    ...{ class: "search-input" },
    prefixIcon: (__VLS_ctx.Search),
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
const __VLS_40 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
    modelValue: (__VLS_ctx.filterLevel),
    placeholder: "资产分级",
    clearable: true,
    ...{ class: "filter-select" },
}));
const __VLS_42 = __VLS_41({
    modelValue: (__VLS_ctx.filterLevel),
    placeholder: "资产分级",
    clearable: true,
    ...{ class: "filter-select" },
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
__VLS_43.slots.default;
const __VLS_44 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    label: "L1 核心",
    value: "L1",
}));
const __VLS_46 = __VLS_45({
    label: "L1 核心",
    value: "L1",
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
const __VLS_48 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
    label: "L2 重要",
    value: "L2",
}));
const __VLS_50 = __VLS_49({
    label: "L2 重要",
    value: "L2",
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
const __VLS_52 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
    label: "L3 一般",
    value: "L3",
}));
const __VLS_54 = __VLS_53({
    label: "L3 一般",
    value: "L3",
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
const __VLS_56 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
    label: "L4 可公开",
    value: "L4",
}));
const __VLS_58 = __VLS_57({
    label: "L4 可公开",
    value: "L4",
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
var __VLS_43;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "catalog-context" },
});
(__VLS_ctx.currentLabel);
const __VLS_60 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
    data: (__VLS_ctx.pagedAssets),
    stripe: true,
}));
const __VLS_62 = __VLS_61({
    data: (__VLS_ctx.pagedAssets),
    stripe: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_61));
__VLS_63.slots.default;
const __VLS_64 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
    prop: "name",
    label: "资产名称",
    minWidth: "150",
}));
const __VLS_66 = __VLS_65({
    prop: "name",
    label: "资产名称",
    minWidth: "150",
}, ...__VLS_functionalComponentArgsRest(__VLS_65));
__VLS_67.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_67.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_68 = {}.ElLink;
    /** @type {[typeof __VLS_components.ElLink, typeof __VLS_components.elLink, typeof __VLS_components.ElLink, typeof __VLS_components.elLink, ]} */ ;
    // @ts-ignore
    const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
        ...{ 'onClick': {} },
        underline: (false),
        type: "primary",
    }));
    const __VLS_70 = __VLS_69({
        ...{ 'onClick': {} },
        underline: (false),
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_69));
    let __VLS_72;
    let __VLS_73;
    let __VLS_74;
    const __VLS_75 = {
        onClick: (...[$event]) => {
            __VLS_ctx.openDetail(row);
        }
    };
    __VLS_71.slots.default;
    (row.name);
    var __VLS_71;
}
var __VLS_67;
const __VLS_76 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
    prop: "type",
    label: "类型",
    width: "70",
}));
const __VLS_78 = __VLS_77({
    prop: "type",
    label: "类型",
    width: "70",
}, ...__VLS_functionalComponentArgsRest(__VLS_77));
const __VLS_80 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
    label: "分级",
    width: "80",
    align: "center",
}));
const __VLS_82 = __VLS_81({
    label: "分级",
    width: "80",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_81));
__VLS_83.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_83.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "level-badge" },
        ...{ style: ({ background: __VLS_ctx.levelColor[row.level] }) },
    });
    (row.level);
}
var __VLS_83;
const __VLS_84 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
    prop: "responsibleDept",
    label: "责任部门",
    width: "100",
}));
const __VLS_86 = __VLS_85({
    prop: "responsibleDept",
    label: "责任部门",
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_85));
const __VLS_88 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
    prop: "owner",
    label: "责任人",
    width: "80",
}));
const __VLS_90 = __VLS_89({
    prop: "owner",
    label: "责任人",
    width: "80",
}, ...__VLS_functionalComponentArgsRest(__VLS_89));
const __VLS_92 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
    label: "标签",
    minWidth: "140",
}));
const __VLS_94 = __VLS_93({
    label: "标签",
    minWidth: "140",
}, ...__VLS_functionalComponentArgsRest(__VLS_93));
__VLS_95.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_95.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    for (const [tag] of __VLS_getVForSourceType((row.tags))) {
        const __VLS_96 = {}.ElTag;
        /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
        // @ts-ignore
        const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
            key: (tag),
            size: "small",
            ...{ class: "mr-4" },
            effect: "plain",
        }));
        const __VLS_98 = __VLS_97({
            key: (tag),
            size: "small",
            ...{ class: "mr-4" },
            effect: "plain",
        }, ...__VLS_functionalComponentArgsRest(__VLS_97));
        __VLS_99.slots.default;
        (tag);
        var __VLS_99;
    }
}
var __VLS_95;
const __VLS_100 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
    prop: "storageLayer",
    label: "存储层级",
    width: "120",
}));
const __VLS_102 = __VLS_101({
    prop: "storageLayer",
    label: "存储层级",
    width: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_101));
const __VLS_104 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
    label: "操作",
    width: "190",
    fixed: "right",
}));
const __VLS_106 = __VLS_105({
    label: "操作",
    width: "190",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_105));
__VLS_107.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_107.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_108 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }));
    const __VLS_110 = __VLS_109({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_109));
    let __VLS_112;
    let __VLS_113;
    let __VLS_114;
    const __VLS_115 = {
        onClick: (...[$event]) => {
            __VLS_ctx.openEdit(row);
        }
    };
    __VLS_111.slots.default;
    var __VLS_111;
    const __VLS_116 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
        ...{ 'onClick': {} },
        link: true,
        type: "warning",
    }));
    const __VLS_118 = __VLS_117({
        ...{ 'onClick': {} },
        link: true,
        type: "warning",
    }, ...__VLS_functionalComponentArgsRest(__VLS_117));
    let __VLS_120;
    let __VLS_121;
    let __VLS_122;
    const __VLS_123 = {
        onClick: (...[$event]) => {
            __VLS_ctx.openMigrate(row);
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
            __VLS_ctx.removeAsset(row);
        }
    };
    __VLS_127.slots.default;
    var __VLS_127;
}
var __VLS_107;
var __VLS_63;
const __VLS_132 = {}.ElPagination;
/** @type {[typeof __VLS_components.ElPagination, typeof __VLS_components.elPagination, ]} */ ;
// @ts-ignore
const __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132({
    ...{ 'onCurrentChange': {} },
    ...{ class: "pager" },
    layout: "total, prev, pager, next",
    total: (__VLS_ctx.filteredAssets.length),
    pageSize: (__VLS_ctx.pageSize),
    currentPage: (__VLS_ctx.currentPage),
    background: true,
}));
const __VLS_134 = __VLS_133({
    ...{ 'onCurrentChange': {} },
    ...{ class: "pager" },
    layout: "total, prev, pager, next",
    total: (__VLS_ctx.filteredAssets.length),
    pageSize: (__VLS_ctx.pageSize),
    currentPage: (__VLS_ctx.currentPage),
    background: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_133));
let __VLS_136;
let __VLS_137;
let __VLS_138;
const __VLS_139 = {
    onCurrentChange: (__VLS_ctx.changePage)
};
var __VLS_135;
var __VLS_3;
const __VLS_140 = {}.ElDrawer;
/** @type {[typeof __VLS_components.ElDrawer, typeof __VLS_components.elDrawer, typeof __VLS_components.ElDrawer, typeof __VLS_components.elDrawer, ]} */ ;
// @ts-ignore
const __VLS_141 = __VLS_asFunctionalComponent(__VLS_140, new __VLS_140({
    modelValue: (__VLS_ctx.registerVisible),
    title: "资产注册入目",
    size: "56%",
}));
const __VLS_142 = __VLS_141({
    modelValue: (__VLS_ctx.registerVisible),
    title: "资产注册入目",
    size: "56%",
}, ...__VLS_functionalComponentArgsRest(__VLS_141));
__VLS_143.slots.default;
const __VLS_144 = {}.ElSteps;
/** @type {[typeof __VLS_components.ElSteps, typeof __VLS_components.elSteps, typeof __VLS_components.ElSteps, typeof __VLS_components.elSteps, ]} */ ;
// @ts-ignore
const __VLS_145 = __VLS_asFunctionalComponent(__VLS_144, new __VLS_144({
    active: (1),
    finishStatus: "success",
    ...{ class: "mb-16" },
}));
const __VLS_146 = __VLS_145({
    active: (1),
    finishStatus: "success",
    ...{ class: "mb-16" },
}, ...__VLS_functionalComponentArgsRest(__VLS_145));
__VLS_147.slots.default;
const __VLS_148 = {}.ElStep;
/** @type {[typeof __VLS_components.ElStep, typeof __VLS_components.elStep, ]} */ ;
// @ts-ignore
const __VLS_149 = __VLS_asFunctionalComponent(__VLS_148, new __VLS_148({
    title: "选择服务",
}));
const __VLS_150 = __VLS_149({
    title: "选择服务",
}, ...__VLS_functionalComponentArgsRest(__VLS_149));
const __VLS_152 = {}.ElStep;
/** @type {[typeof __VLS_components.ElStep, typeof __VLS_components.elStep, ]} */ ;
// @ts-ignore
const __VLS_153 = __VLS_asFunctionalComponent(__VLS_152, new __VLS_152({
    title: "属性设置",
}));
const __VLS_154 = __VLS_153({
    title: "属性设置",
}, ...__VLS_functionalComponentArgsRest(__VLS_153));
const __VLS_156 = {}.ElStep;
/** @type {[typeof __VLS_components.ElStep, typeof __VLS_components.elStep, ]} */ ;
// @ts-ignore
const __VLS_157 = __VLS_asFunctionalComponent(__VLS_156, new __VLS_156({
    title: "完成",
}));
const __VLS_158 = __VLS_157({
    title: "完成",
}, ...__VLS_functionalComponentArgsRest(__VLS_157));
var __VLS_147;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "section-title mb-8" },
});
const __VLS_160 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_161 = __VLS_asFunctionalComponent(__VLS_160, new __VLS_160({
    ...{ 'onCurrentChange': {} },
    data: (__VLS_ctx.servicePool),
    size: "small",
    stripe: true,
    highlightCurrentRow: true,
}));
const __VLS_162 = __VLS_161({
    ...{ 'onCurrentChange': {} },
    data: (__VLS_ctx.servicePool),
    size: "small",
    stripe: true,
    highlightCurrentRow: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_161));
let __VLS_164;
let __VLS_165;
let __VLS_166;
const __VLS_167 = {
    onCurrentChange: (__VLS_ctx.selectService)
};
__VLS_163.slots.default;
const __VLS_168 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_169 = __VLS_asFunctionalComponent(__VLS_168, new __VLS_168({
    prop: "name",
    label: "服务名称",
    minWidth: "150",
}));
const __VLS_170 = __VLS_169({
    prop: "name",
    label: "服务名称",
    minWidth: "150",
}, ...__VLS_functionalComponentArgsRest(__VLS_169));
const __VLS_172 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_173 = __VLS_asFunctionalComponent(__VLS_172, new __VLS_172({
    prop: "type",
    label: "类型",
    width: "80",
}));
const __VLS_174 = __VLS_173({
    prop: "type",
    label: "类型",
    width: "80",
}, ...__VLS_functionalComponentArgsRest(__VLS_173));
const __VLS_176 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_177 = __VLS_asFunctionalComponent(__VLS_176, new __VLS_176({
    prop: "interfaceCount",
    label: "接口数",
    width: "80",
    align: "center",
}));
const __VLS_178 = __VLS_177({
    prop: "interfaceCount",
    label: "接口数",
    width: "80",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_177));
const __VLS_180 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_181 = __VLS_asFunctionalComponent(__VLS_180, new __VLS_180({
    prop: "desc",
    label: "说明",
    minWidth: "160",
}));
const __VLS_182 = __VLS_181({
    prop: "desc",
    label: "说明",
    minWidth: "160",
}, ...__VLS_functionalComponentArgsRest(__VLS_181));
var __VLS_163;
const __VLS_184 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_185 = __VLS_asFunctionalComponent(__VLS_184, new __VLS_184({
    model: (__VLS_ctx.registerForm),
    labelWidth: "90px",
    ...{ class: "mt-16" },
}));
const __VLS_186 = __VLS_185({
    model: (__VLS_ctx.registerForm),
    labelWidth: "90px",
    ...{ class: "mt-16" },
}, ...__VLS_functionalComponentArgsRest(__VLS_185));
__VLS_187.slots.default;
const __VLS_188 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_189 = __VLS_asFunctionalComponent(__VLS_188, new __VLS_188({
    label: "所属目录",
}));
const __VLS_190 = __VLS_189({
    label: "所属目录",
}, ...__VLS_functionalComponentArgsRest(__VLS_189));
__VLS_191.slots.default;
const __VLS_192 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_193 = __VLS_asFunctionalComponent(__VLS_192, new __VLS_192({
    modelValue: (__VLS_ctx.registerForm.catalog),
    ...{ class: "w-full" },
}));
const __VLS_194 = __VLS_193({
    modelValue: (__VLS_ctx.registerForm.catalog),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_193));
__VLS_195.slots.default;
for (const [node] of __VLS_getVForSourceType((__VLS_ctx.flattenTree))) {
    const __VLS_196 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_197 = __VLS_asFunctionalComponent(__VLS_196, new __VLS_196({
        key: (node.id),
        label: (node.label),
        value: (node.label),
    }));
    const __VLS_198 = __VLS_197({
        key: (node.id),
        label: (node.label),
        value: (node.label),
    }, ...__VLS_functionalComponentArgsRest(__VLS_197));
}
var __VLS_195;
var __VLS_191;
const __VLS_200 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_201 = __VLS_asFunctionalComponent(__VLS_200, new __VLS_200({
    label: "责任部门",
}));
const __VLS_202 = __VLS_201({
    label: "责任部门",
}, ...__VLS_functionalComponentArgsRest(__VLS_201));
__VLS_203.slots.default;
const __VLS_204 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_205 = __VLS_asFunctionalComponent(__VLS_204, new __VLS_204({
    modelValue: (__VLS_ctx.registerForm.dept),
    ...{ class: "w-full" },
}));
const __VLS_206 = __VLS_205({
    modelValue: (__VLS_ctx.registerForm.dept),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_205));
__VLS_207.slots.default;
const __VLS_208 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_209 = __VLS_asFunctionalComponent(__VLS_208, new __VLS_208({
    label: "信息中心",
    value: "信息中心",
}));
const __VLS_210 = __VLS_209({
    label: "信息中心",
    value: "信息中心",
}, ...__VLS_functionalComponentArgsRest(__VLS_209));
const __VLS_212 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_213 = __VLS_asFunctionalComponent(__VLS_212, new __VLS_212({
    label: "票务部",
    value: "票务部",
}));
const __VLS_214 = __VLS_213({
    label: "票务部",
    value: "票务部",
}, ...__VLS_functionalComponentArgsRest(__VLS_213));
const __VLS_216 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_217 = __VLS_asFunctionalComponent(__VLS_216, new __VLS_216({
    label: "设备部",
    value: "设备部",
}));
const __VLS_218 = __VLS_217({
    label: "设备部",
    value: "设备部",
}, ...__VLS_functionalComponentArgsRest(__VLS_217));
const __VLS_220 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_221 = __VLS_asFunctionalComponent(__VLS_220, new __VLS_220({
    label: "运营部",
    value: "运营部",
}));
const __VLS_222 = __VLS_221({
    label: "运营部",
    value: "运营部",
}, ...__VLS_functionalComponentArgsRest(__VLS_221));
var __VLS_207;
var __VLS_203;
const __VLS_224 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_225 = __VLS_asFunctionalComponent(__VLS_224, new __VLS_224({
    label: "责任人",
}));
const __VLS_226 = __VLS_225({
    label: "责任人",
}, ...__VLS_functionalComponentArgsRest(__VLS_225));
__VLS_227.slots.default;
const __VLS_228 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_229 = __VLS_asFunctionalComponent(__VLS_228, new __VLS_228({
    modelValue: (__VLS_ctx.registerForm.owner),
}));
const __VLS_230 = __VLS_229({
    modelValue: (__VLS_ctx.registerForm.owner),
}, ...__VLS_functionalComponentArgsRest(__VLS_229));
var __VLS_227;
const __VLS_232 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_233 = __VLS_asFunctionalComponent(__VLS_232, new __VLS_232({
    label: "资产分级",
}));
const __VLS_234 = __VLS_233({
    label: "资产分级",
}, ...__VLS_functionalComponentArgsRest(__VLS_233));
__VLS_235.slots.default;
const __VLS_236 = {}.ElRadioGroup;
/** @type {[typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, ]} */ ;
// @ts-ignore
const __VLS_237 = __VLS_asFunctionalComponent(__VLS_236, new __VLS_236({
    modelValue: (__VLS_ctx.registerForm.level),
}));
const __VLS_238 = __VLS_237({
    modelValue: (__VLS_ctx.registerForm.level),
}, ...__VLS_functionalComponentArgsRest(__VLS_237));
__VLS_239.slots.default;
const __VLS_240 = {}.ElRadioButton;
/** @type {[typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, ]} */ ;
// @ts-ignore
const __VLS_241 = __VLS_asFunctionalComponent(__VLS_240, new __VLS_240({
    value: "L1",
}));
const __VLS_242 = __VLS_241({
    value: "L1",
}, ...__VLS_functionalComponentArgsRest(__VLS_241));
__VLS_243.slots.default;
var __VLS_243;
const __VLS_244 = {}.ElRadioButton;
/** @type {[typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, ]} */ ;
// @ts-ignore
const __VLS_245 = __VLS_asFunctionalComponent(__VLS_244, new __VLS_244({
    value: "L2",
}));
const __VLS_246 = __VLS_245({
    value: "L2",
}, ...__VLS_functionalComponentArgsRest(__VLS_245));
__VLS_247.slots.default;
var __VLS_247;
const __VLS_248 = {}.ElRadioButton;
/** @type {[typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, ]} */ ;
// @ts-ignore
const __VLS_249 = __VLS_asFunctionalComponent(__VLS_248, new __VLS_248({
    value: "L3",
}));
const __VLS_250 = __VLS_249({
    value: "L3",
}, ...__VLS_functionalComponentArgsRest(__VLS_249));
__VLS_251.slots.default;
var __VLS_251;
const __VLS_252 = {}.ElRadioButton;
/** @type {[typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, ]} */ ;
// @ts-ignore
const __VLS_253 = __VLS_asFunctionalComponent(__VLS_252, new __VLS_252({
    value: "L4",
}));
const __VLS_254 = __VLS_253({
    value: "L4",
}, ...__VLS_functionalComponentArgsRest(__VLS_253));
__VLS_255.slots.default;
var __VLS_255;
var __VLS_239;
var __VLS_235;
const __VLS_256 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_257 = __VLS_asFunctionalComponent(__VLS_256, new __VLS_256({
    label: "资产标签",
}));
const __VLS_258 = __VLS_257({
    label: "资产标签",
}, ...__VLS_functionalComponentArgsRest(__VLS_257));
__VLS_259.slots.default;
const __VLS_260 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_261 = __VLS_asFunctionalComponent(__VLS_260, new __VLS_260({
    modelValue: (__VLS_ctx.registerForm.tags),
    multiple: true,
    filterable: true,
    allowCreate: true,
    defaultFirstOption: true,
    ...{ class: "w-full" },
}));
const __VLS_262 = __VLS_261({
    modelValue: (__VLS_ctx.registerForm.tags),
    multiple: true,
    filterable: true,
    allowCreate: true,
    defaultFirstOption: true,
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_261));
__VLS_263.slots.default;
for (const [tag] of __VLS_getVForSourceType((['核心', '敏感', '个人隐私', '客流', '设备', '财务', '地图']))) {
    const __VLS_264 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_265 = __VLS_asFunctionalComponent(__VLS_264, new __VLS_264({
        key: (tag),
        label: (tag),
        value: (tag),
    }));
    const __VLS_266 = __VLS_265({
        key: (tag),
        label: (tag),
        value: (tag),
    }, ...__VLS_functionalComponentArgsRest(__VLS_265));
}
var __VLS_263;
var __VLS_259;
const __VLS_268 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_269 = __VLS_asFunctionalComponent(__VLS_268, new __VLS_268({
    label: "资产描述",
}));
const __VLS_270 = __VLS_269({
    label: "资产描述",
}, ...__VLS_functionalComponentArgsRest(__VLS_269));
__VLS_271.slots.default;
const __VLS_272 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_273 = __VLS_asFunctionalComponent(__VLS_272, new __VLS_272({
    modelValue: (__VLS_ctx.registerForm.desc),
    type: "textarea",
    rows: (3),
}));
const __VLS_274 = __VLS_273({
    modelValue: (__VLS_ctx.registerForm.desc),
    type: "textarea",
    rows: (3),
}, ...__VLS_functionalComponentArgsRest(__VLS_273));
var __VLS_271;
var __VLS_187;
{
    const { footer: __VLS_thisSlot } = __VLS_143.slots;
    const __VLS_276 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_277 = __VLS_asFunctionalComponent(__VLS_276, new __VLS_276({
        ...{ 'onClick': {} },
    }));
    const __VLS_278 = __VLS_277({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_277));
    let __VLS_280;
    let __VLS_281;
    let __VLS_282;
    const __VLS_283 = {
        onClick: (...[$event]) => {
            __VLS_ctx.registerVisible = false;
        }
    };
    __VLS_279.slots.default;
    var __VLS_279;
    const __VLS_284 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_285 = __VLS_asFunctionalComponent(__VLS_284, new __VLS_284({
        ...{ 'onClick': {} },
        type: "danger",
    }));
    const __VLS_286 = __VLS_285({
        ...{ 'onClick': {} },
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_285));
    let __VLS_288;
    let __VLS_289;
    let __VLS_290;
    const __VLS_291 = {
        onClick: (__VLS_ctx.submitRegister)
    };
    __VLS_287.slots.default;
    var __VLS_287;
}
var __VLS_143;
const __VLS_292 = {}.ElDrawer;
/** @type {[typeof __VLS_components.ElDrawer, typeof __VLS_components.elDrawer, typeof __VLS_components.ElDrawer, typeof __VLS_components.elDrawer, ]} */ ;
// @ts-ignore
const __VLS_293 = __VLS_asFunctionalComponent(__VLS_292, new __VLS_292({
    modelValue: (__VLS_ctx.editVisible),
    title: "资产属性设置",
    size: "520px",
}));
const __VLS_294 = __VLS_293({
    modelValue: (__VLS_ctx.editVisible),
    title: "资产属性设置",
    size: "520px",
}, ...__VLS_functionalComponentArgsRest(__VLS_293));
__VLS_295.slots.default;
const __VLS_296 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_297 = __VLS_asFunctionalComponent(__VLS_296, new __VLS_296({
    model: (__VLS_ctx.editForm),
    labelWidth: "90px",
}));
const __VLS_298 = __VLS_297({
    model: (__VLS_ctx.editForm),
    labelWidth: "90px",
}, ...__VLS_functionalComponentArgsRest(__VLS_297));
__VLS_299.slots.default;
const __VLS_300 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_301 = __VLS_asFunctionalComponent(__VLS_300, new __VLS_300({
    label: "资产名称",
}));
const __VLS_302 = __VLS_301({
    label: "资产名称",
}, ...__VLS_functionalComponentArgsRest(__VLS_301));
__VLS_303.slots.default;
const __VLS_304 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_305 = __VLS_asFunctionalComponent(__VLS_304, new __VLS_304({
    modelValue: (__VLS_ctx.editForm.name),
    disabled: true,
}));
const __VLS_306 = __VLS_305({
    modelValue: (__VLS_ctx.editForm.name),
    disabled: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_305));
var __VLS_303;
const __VLS_308 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_309 = __VLS_asFunctionalComponent(__VLS_308, new __VLS_308({
    label: "所属目录",
}));
const __VLS_310 = __VLS_309({
    label: "所属目录",
}, ...__VLS_functionalComponentArgsRest(__VLS_309));
__VLS_311.slots.default;
const __VLS_312 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_313 = __VLS_asFunctionalComponent(__VLS_312, new __VLS_312({
    modelValue: (__VLS_ctx.editForm.catalog),
    ...{ class: "w-full" },
}));
const __VLS_314 = __VLS_313({
    modelValue: (__VLS_ctx.editForm.catalog),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_313));
__VLS_315.slots.default;
for (const [node] of __VLS_getVForSourceType((__VLS_ctx.flattenTree))) {
    const __VLS_316 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_317 = __VLS_asFunctionalComponent(__VLS_316, new __VLS_316({
        key: (node.id),
        label: (node.label),
        value: (node.label),
    }));
    const __VLS_318 = __VLS_317({
        key: (node.id),
        label: (node.label),
        value: (node.label),
    }, ...__VLS_functionalComponentArgsRest(__VLS_317));
}
var __VLS_315;
var __VLS_311;
const __VLS_320 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_321 = __VLS_asFunctionalComponent(__VLS_320, new __VLS_320({
    label: "责任部门",
}));
const __VLS_322 = __VLS_321({
    label: "责任部门",
}, ...__VLS_functionalComponentArgsRest(__VLS_321));
__VLS_323.slots.default;
const __VLS_324 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_325 = __VLS_asFunctionalComponent(__VLS_324, new __VLS_324({
    modelValue: (__VLS_ctx.editForm.dept),
    ...{ class: "w-full" },
}));
const __VLS_326 = __VLS_325({
    modelValue: (__VLS_ctx.editForm.dept),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_325));
__VLS_327.slots.default;
for (const [dept] of __VLS_getVForSourceType((['信息中心', '票务部', '设备部', '运营部', '建设部', '财务部']))) {
    const __VLS_328 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_329 = __VLS_asFunctionalComponent(__VLS_328, new __VLS_328({
        key: (dept),
        label: (dept),
        value: (dept),
    }));
    const __VLS_330 = __VLS_329({
        key: (dept),
        label: (dept),
        value: (dept),
    }, ...__VLS_functionalComponentArgsRest(__VLS_329));
}
var __VLS_327;
var __VLS_323;
const __VLS_332 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_333 = __VLS_asFunctionalComponent(__VLS_332, new __VLS_332({
    label: "责任人",
}));
const __VLS_334 = __VLS_333({
    label: "责任人",
}, ...__VLS_functionalComponentArgsRest(__VLS_333));
__VLS_335.slots.default;
const __VLS_336 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_337 = __VLS_asFunctionalComponent(__VLS_336, new __VLS_336({
    modelValue: (__VLS_ctx.editForm.owner),
}));
const __VLS_338 = __VLS_337({
    modelValue: (__VLS_ctx.editForm.owner),
}, ...__VLS_functionalComponentArgsRest(__VLS_337));
var __VLS_335;
const __VLS_340 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_341 = __VLS_asFunctionalComponent(__VLS_340, new __VLS_340({
    label: "资产分级",
}));
const __VLS_342 = __VLS_341({
    label: "资产分级",
}, ...__VLS_functionalComponentArgsRest(__VLS_341));
__VLS_343.slots.default;
const __VLS_344 = {}.ElRadioGroup;
/** @type {[typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, ]} */ ;
// @ts-ignore
const __VLS_345 = __VLS_asFunctionalComponent(__VLS_344, new __VLS_344({
    modelValue: (__VLS_ctx.editForm.level),
}));
const __VLS_346 = __VLS_345({
    modelValue: (__VLS_ctx.editForm.level),
}, ...__VLS_functionalComponentArgsRest(__VLS_345));
__VLS_347.slots.default;
const __VLS_348 = {}.ElRadioButton;
/** @type {[typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, ]} */ ;
// @ts-ignore
const __VLS_349 = __VLS_asFunctionalComponent(__VLS_348, new __VLS_348({
    value: "L1",
}));
const __VLS_350 = __VLS_349({
    value: "L1",
}, ...__VLS_functionalComponentArgsRest(__VLS_349));
__VLS_351.slots.default;
var __VLS_351;
const __VLS_352 = {}.ElRadioButton;
/** @type {[typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, ]} */ ;
// @ts-ignore
const __VLS_353 = __VLS_asFunctionalComponent(__VLS_352, new __VLS_352({
    value: "L2",
}));
const __VLS_354 = __VLS_353({
    value: "L2",
}, ...__VLS_functionalComponentArgsRest(__VLS_353));
__VLS_355.slots.default;
var __VLS_355;
const __VLS_356 = {}.ElRadioButton;
/** @type {[typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, ]} */ ;
// @ts-ignore
const __VLS_357 = __VLS_asFunctionalComponent(__VLS_356, new __VLS_356({
    value: "L3",
}));
const __VLS_358 = __VLS_357({
    value: "L3",
}, ...__VLS_functionalComponentArgsRest(__VLS_357));
__VLS_359.slots.default;
var __VLS_359;
const __VLS_360 = {}.ElRadioButton;
/** @type {[typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, ]} */ ;
// @ts-ignore
const __VLS_361 = __VLS_asFunctionalComponent(__VLS_360, new __VLS_360({
    value: "L4",
}));
const __VLS_362 = __VLS_361({
    value: "L4",
}, ...__VLS_functionalComponentArgsRest(__VLS_361));
__VLS_363.slots.default;
var __VLS_363;
var __VLS_347;
var __VLS_343;
const __VLS_364 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_365 = __VLS_asFunctionalComponent(__VLS_364, new __VLS_364({
    label: "资产标签",
}));
const __VLS_366 = __VLS_365({
    label: "资产标签",
}, ...__VLS_functionalComponentArgsRest(__VLS_365));
__VLS_367.slots.default;
const __VLS_368 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_369 = __VLS_asFunctionalComponent(__VLS_368, new __VLS_368({
    modelValue: (__VLS_ctx.editForm.tags),
    multiple: true,
    filterable: true,
    allowCreate: true,
    defaultFirstOption: true,
    ...{ class: "w-full" },
}));
const __VLS_370 = __VLS_369({
    modelValue: (__VLS_ctx.editForm.tags),
    multiple: true,
    filterable: true,
    allowCreate: true,
    defaultFirstOption: true,
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_369));
__VLS_371.slots.default;
for (const [tag] of __VLS_getVForSourceType((['核心', '敏感', '个人隐私', '客流', '设备', '财务', '地图']))) {
    const __VLS_372 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_373 = __VLS_asFunctionalComponent(__VLS_372, new __VLS_372({
        key: (tag),
        label: (tag),
        value: (tag),
    }));
    const __VLS_374 = __VLS_373({
        key: (tag),
        label: (tag),
        value: (tag),
    }, ...__VLS_functionalComponentArgsRest(__VLS_373));
}
var __VLS_371;
var __VLS_367;
const __VLS_376 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_377 = __VLS_asFunctionalComponent(__VLS_376, new __VLS_376({
    label: "资产描述",
}));
const __VLS_378 = __VLS_377({
    label: "资产描述",
}, ...__VLS_functionalComponentArgsRest(__VLS_377));
__VLS_379.slots.default;
const __VLS_380 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_381 = __VLS_asFunctionalComponent(__VLS_380, new __VLS_380({
    modelValue: (__VLS_ctx.editForm.desc),
    type: "textarea",
    rows: (3),
}));
const __VLS_382 = __VLS_381({
    modelValue: (__VLS_ctx.editForm.desc),
    type: "textarea",
    rows: (3),
}, ...__VLS_functionalComponentArgsRest(__VLS_381));
var __VLS_379;
var __VLS_299;
{
    const { footer: __VLS_thisSlot } = __VLS_295.slots;
    const __VLS_384 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_385 = __VLS_asFunctionalComponent(__VLS_384, new __VLS_384({
        ...{ 'onClick': {} },
    }));
    const __VLS_386 = __VLS_385({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_385));
    let __VLS_388;
    let __VLS_389;
    let __VLS_390;
    const __VLS_391 = {
        onClick: (...[$event]) => {
            __VLS_ctx.editVisible = false;
        }
    };
    __VLS_387.slots.default;
    var __VLS_387;
    const __VLS_392 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_393 = __VLS_asFunctionalComponent(__VLS_392, new __VLS_392({
        ...{ 'onClick': {} },
        type: "danger",
    }));
    const __VLS_394 = __VLS_393({
        ...{ 'onClick': {} },
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_393));
    let __VLS_396;
    let __VLS_397;
    let __VLS_398;
    const __VLS_399 = {
        onClick: (__VLS_ctx.saveEdit)
    };
    __VLS_395.slots.default;
    var __VLS_395;
}
var __VLS_295;
const __VLS_400 = {}.ElDrawer;
/** @type {[typeof __VLS_components.ElDrawer, typeof __VLS_components.elDrawer, typeof __VLS_components.ElDrawer, typeof __VLS_components.elDrawer, ]} */ ;
// @ts-ignore
const __VLS_401 = __VLS_asFunctionalComponent(__VLS_400, new __VLS_400({
    modelValue: (__VLS_ctx.migrateVisible),
    title: "资产迁移",
    size: "420px",
}));
const __VLS_402 = __VLS_401({
    modelValue: (__VLS_ctx.migrateVisible),
    title: "资产迁移",
    size: "420px",
}, ...__VLS_functionalComponentArgsRest(__VLS_401));
__VLS_403.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "migrate-from" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.b, __VLS_intrinsicElements.b)({});
(__VLS_ctx.migrateTarget);
const __VLS_404 = {}.ElTree;
/** @type {[typeof __VLS_components.ElTree, typeof __VLS_components.elTree, ]} */ ;
// @ts-ignore
const __VLS_405 = __VLS_asFunctionalComponent(__VLS_404, new __VLS_404({
    ...{ 'onNodeClick': {} },
    data: (__VLS_ctx.catalogTree),
    nodeKey: "id",
    highlightCurrent: true,
    props: ({ label: 'label', children: 'children' }),
    ...{ class: "migrate-tree" },
}));
const __VLS_406 = __VLS_405({
    ...{ 'onNodeClick': {} },
    data: (__VLS_ctx.catalogTree),
    nodeKey: "id",
    highlightCurrent: true,
    props: ({ label: 'label', children: 'children' }),
    ...{ class: "migrate-tree" },
}, ...__VLS_functionalComponentArgsRest(__VLS_405));
let __VLS_408;
let __VLS_409;
let __VLS_410;
const __VLS_411 = {
    onNodeClick: (__VLS_ctx.pickMigrateNode)
};
var __VLS_407;
{
    const { footer: __VLS_thisSlot } = __VLS_403.slots;
    const __VLS_412 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_413 = __VLS_asFunctionalComponent(__VLS_412, new __VLS_412({
        ...{ 'onClick': {} },
    }));
    const __VLS_414 = __VLS_413({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_413));
    let __VLS_416;
    let __VLS_417;
    let __VLS_418;
    const __VLS_419 = {
        onClick: (...[$event]) => {
            __VLS_ctx.migrateVisible = false;
        }
    };
    __VLS_415.slots.default;
    var __VLS_415;
    const __VLS_420 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_421 = __VLS_asFunctionalComponent(__VLS_420, new __VLS_420({
        ...{ 'onClick': {} },
        type: "danger",
    }));
    const __VLS_422 = __VLS_421({
        ...{ 'onClick': {} },
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_421));
    let __VLS_424;
    let __VLS_425;
    let __VLS_426;
    const __VLS_427 = {
        onClick: (__VLS_ctx.submitMigrate)
    };
    __VLS_423.slots.default;
    var __VLS_423;
}
var __VLS_403;
const __VLS_428 = {}.ElDrawer;
/** @type {[typeof __VLS_components.ElDrawer, typeof __VLS_components.elDrawer, typeof __VLS_components.ElDrawer, typeof __VLS_components.elDrawer, ]} */ ;
// @ts-ignore
const __VLS_429 = __VLS_asFunctionalComponent(__VLS_428, new __VLS_428({
    modelValue: (__VLS_ctx.detailVisible),
    title: "资产详情",
    size: "560px",
}));
const __VLS_430 = __VLS_429({
    modelValue: (__VLS_ctx.detailVisible),
    title: "资产详情",
    size: "560px",
}, ...__VLS_functionalComponentArgsRest(__VLS_429));
__VLS_431.slots.default;
if (__VLS_ctx.detailAsset) {
    const __VLS_432 = {}.ElDescriptions;
    /** @type {[typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, ]} */ ;
    // @ts-ignore
    const __VLS_433 = __VLS_asFunctionalComponent(__VLS_432, new __VLS_432({
        title: "基本信息",
        column: (2),
        border: true,
        ...{ class: "mb-16" },
    }));
    const __VLS_434 = __VLS_433({
        title: "基本信息",
        column: (2),
        border: true,
        ...{ class: "mb-16" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_433));
    __VLS_435.slots.default;
    const __VLS_436 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_437 = __VLS_asFunctionalComponent(__VLS_436, new __VLS_436({
        label: "资产名称",
    }));
    const __VLS_438 = __VLS_437({
        label: "资产名称",
    }, ...__VLS_functionalComponentArgsRest(__VLS_437));
    __VLS_439.slots.default;
    (__VLS_ctx.detailAsset.name);
    var __VLS_439;
    const __VLS_440 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_441 = __VLS_asFunctionalComponent(__VLS_440, new __VLS_440({
        label: "类型",
    }));
    const __VLS_442 = __VLS_441({
        label: "类型",
    }, ...__VLS_functionalComponentArgsRest(__VLS_441));
    __VLS_443.slots.default;
    (__VLS_ctx.detailAsset.type);
    var __VLS_443;
    const __VLS_444 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_445 = __VLS_asFunctionalComponent(__VLS_444, new __VLS_444({
        label: "所属目录",
    }));
    const __VLS_446 = __VLS_445({
        label: "所属目录",
    }, ...__VLS_functionalComponentArgsRest(__VLS_445));
    __VLS_447.slots.default;
    (__VLS_ctx.detailAsset.catalogPath);
    var __VLS_447;
    const __VLS_448 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_449 = __VLS_asFunctionalComponent(__VLS_448, new __VLS_448({
        label: "分级",
    }));
    const __VLS_450 = __VLS_449({
        label: "分级",
    }, ...__VLS_functionalComponentArgsRest(__VLS_449));
    __VLS_451.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "level-badge" },
        ...{ style: ({ background: __VLS_ctx.levelColor[__VLS_ctx.detailAsset.level] }) },
    });
    (__VLS_ctx.detailAsset.level);
    var __VLS_451;
    const __VLS_452 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_453 = __VLS_asFunctionalComponent(__VLS_452, new __VLS_452({
        label: "责任部门",
    }));
    const __VLS_454 = __VLS_453({
        label: "责任部门",
    }, ...__VLS_functionalComponentArgsRest(__VLS_453));
    __VLS_455.slots.default;
    (__VLS_ctx.detailAsset.responsibleDept);
    var __VLS_455;
    const __VLS_456 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_457 = __VLS_asFunctionalComponent(__VLS_456, new __VLS_456({
        label: "责任人",
    }));
    const __VLS_458 = __VLS_457({
        label: "责任人",
    }, ...__VLS_functionalComponentArgsRest(__VLS_457));
    __VLS_459.slots.default;
    (__VLS_ctx.detailAsset.owner);
    var __VLS_459;
    const __VLS_460 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_461 = __VLS_asFunctionalComponent(__VLS_460, new __VLS_460({
        label: "存储层级",
    }));
    const __VLS_462 = __VLS_461({
        label: "存储层级",
    }, ...__VLS_functionalComponentArgsRest(__VLS_461));
    __VLS_463.slots.default;
    (__VLS_ctx.detailAsset.storageLayer);
    var __VLS_463;
    const __VLS_464 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_465 = __VLS_asFunctionalComponent(__VLS_464, new __VLS_464({
        label: "存储量",
    }));
    const __VLS_466 = __VLS_465({
        label: "存储量",
    }, ...__VLS_functionalComponentArgsRest(__VLS_465));
    __VLS_467.slots.default;
    ((__VLS_ctx.detailAsset.sizeMb / 1024).toFixed(2));
    var __VLS_467;
    var __VLS_435;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "section-title" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "mb-16" },
    });
    for (const [tag] of __VLS_getVForSourceType((__VLS_ctx.detailAsset.tags))) {
        const __VLS_468 = {}.ElTag;
        /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
        // @ts-ignore
        const __VLS_469 = __VLS_asFunctionalComponent(__VLS_468, new __VLS_468({
            key: (tag),
            ...{ class: "mr-4" },
            effect: "plain",
        }));
        const __VLS_470 = __VLS_469({
            key: (tag),
            ...{ class: "mr-4" },
            effect: "plain",
        }, ...__VLS_functionalComponentArgsRest(__VLS_469));
        __VLS_471.slots.default;
        (tag);
        var __VLS_471;
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "section-title" },
    });
    const __VLS_472 = {}.ElTimeline;
    /** @type {[typeof __VLS_components.ElTimeline, typeof __VLS_components.elTimeline, typeof __VLS_components.ElTimeline, typeof __VLS_components.elTimeline, ]} */ ;
    // @ts-ignore
    const __VLS_473 = __VLS_asFunctionalComponent(__VLS_472, new __VLS_472({
        ...{ class: "mt-8" },
    }));
    const __VLS_474 = __VLS_473({
        ...{ class: "mt-8" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_473));
    __VLS_475.slots.default;
    const __VLS_476 = {}.ElTimelineItem;
    /** @type {[typeof __VLS_components.ElTimelineItem, typeof __VLS_components.elTimelineItem, typeof __VLS_components.ElTimelineItem, typeof __VLS_components.elTimelineItem, ]} */ ;
    // @ts-ignore
    const __VLS_477 = __VLS_asFunctionalComponent(__VLS_476, new __VLS_476({
        timestamp: "数据服务 · 接口 v1.0",
        type: "primary",
    }));
    const __VLS_478 = __VLS_477({
        timestamp: "数据服务 · 接口 v1.0",
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_477));
    __VLS_479.slots.default;
    (__VLS_ctx.detailAsset.id);
    var __VLS_479;
    const __VLS_480 = {}.ElTimelineItem;
    /** @type {[typeof __VLS_components.ElTimelineItem, typeof __VLS_components.elTimelineItem, typeof __VLS_components.ElTimelineItem, typeof __VLS_components.elTimelineItem, ]} */ ;
    // @ts-ignore
    const __VLS_481 = __VLS_asFunctionalComponent(__VLS_480, new __VLS_480({
        timestamp: "数据同步 · 每日 03:00",
        type: "success",
    }));
    const __VLS_482 = __VLS_481({
        timestamp: "数据同步 · 每日 03:00",
        type: "success",
    }, ...__VLS_functionalComponentArgsRest(__VLS_481));
    __VLS_483.slots.default;
    var __VLS_483;
    var __VLS_475;
}
var __VLS_431;
/** @type {__VLS_StyleScopedClasses['standard-page']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['catalog-layout']} */ ;
/** @type {__VLS_StyleScopedClasses['catalog-tree-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['catalog-node']} */ ;
/** @type {__VLS_StyleScopedClasses['catalog-count']} */ ;
/** @type {__VLS_StyleScopedClasses['catalog-lock']} */ ;
/** @type {__VLS_StyleScopedClasses['catalog-table-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['toolbar-row']} */ ;
/** @type {__VLS_StyleScopedClasses['search-input']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-select']} */ ;
/** @type {__VLS_StyleScopedClasses['catalog-context']} */ ;
/** @type {__VLS_StyleScopedClasses['level-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
/** @type {__VLS_StyleScopedClasses['pager']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['migrate-from']} */ ;
/** @type {__VLS_StyleScopedClasses['migrate-tree']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
/** @type {__VLS_StyleScopedClasses['level-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Lock: Lock,
            Plus: Plus,
            Search: Search,
            catalogTree: catalogTree,
            levelColor: levelColor,
            nodeIcon: nodeIcon,
            treeKeyword: treeKeyword,
            keyword: keyword,
            filterLevel: filterLevel,
            currentPage: currentPage,
            pageSize: pageSize,
            currentLabel: currentLabel,
            servicePool: servicePool,
            flattenTree: flattenTree,
            filteredTree: filteredTree,
            filteredAssets: filteredAssets,
            pagedAssets: pagedAssets,
            changePage: changePage,
            selectNode: selectNode,
            registerVisible: registerVisible,
            registerForm: registerForm,
            openRegister: openRegister,
            selectService: selectService,
            submitRegister: submitRegister,
            editVisible: editVisible,
            editForm: editForm,
            openEdit: openEdit,
            saveEdit: saveEdit,
            migrateVisible: migrateVisible,
            migrateTarget: migrateTarget,
            openMigrate: openMigrate,
            pickMigrateNode: pickMigrateNode,
            submitMigrate: submitMigrate,
            detailVisible: detailVisible,
            detailAsset: detailAsset,
            openDetail: openDetail,
            removeAsset: removeAsset,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
