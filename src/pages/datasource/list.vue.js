import { computed, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { Coin, Location, Search } from '@element-plus/icons-vue';
import { mockDataSources } from '@/mock/datasource';
const viewMode = ref('card');
const keyword = ref('');
const filterStatus = ref('');
const filterType = ref('');
const filterOwner = ref('');
const currentPage = ref(1);
const pageSize = ref(12);
const detailVisible = ref(false);
const detailRow = ref(null);
const statuses = ['已连接', '连接中', '已断开', '异常'];
const types = Array.from(new Set(mockDataSources.map((item) => item.type)));
const owners = Array.from(new Set(mockDataSources.map((item) => item.owner)));
const statusTagType = {
    已连接: 'success',
    连接中: 'warning',
    已断开: 'info',
    异常: 'danger',
};
const filteredList = computed(() => mockDataSources.filter((item) => {
    if (filterStatus.value && item.status !== filterStatus.value)
        return false;
    if (filterType.value && item.type !== filterType.value)
        return false;
    if (filterOwner.value && item.owner !== filterOwner.value)
        return false;
    if (!keyword.value)
        return true;
    const kw = keyword.value.toLowerCase();
    return (item.name.toLowerCase().includes(kw) ||
        item.host.toLowerCase().includes(kw) ||
        item.database.toLowerCase().includes(kw));
}));
const pagedList = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    return filteredList.value.slice(start, start + pageSize.value);
});
const resetPagination = () => {
    currentPage.value = 1;
};
const handleSizeChange = (size) => {
    pageSize.value = size;
    resetPagination();
};
const testConnection = (row) => {
    ElMessage({
        message: `正在测试「${row.name}」连接...`,
        duration: 600,
    });
    setTimeout(() => {
        if (row.status === '异常') {
            ElMessage.error(`「${row.name}」连接失败：无法访问 ${row.host}:${row.port}`);
        }
        else {
            row.status = '已连接';
            ElMessage.success(`「${row.name}」连接成功，耗时 ${row.responseTime}ms`);
        }
    }, 600);
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
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-actions" },
    });
    const __VLS_4 = {}.ElRadioGroup;
    /** @type {[typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, ]} */ ;
    // @ts-ignore
    const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
        modelValue: (__VLS_ctx.viewMode),
        size: "small",
    }));
    const __VLS_6 = __VLS_5({
        modelValue: (__VLS_ctx.viewMode),
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_5));
    __VLS_7.slots.default;
    const __VLS_8 = {}.ElRadioButton;
    /** @type {[typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, ]} */ ;
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
        label: "card",
    }));
    const __VLS_10 = __VLS_9({
        label: "card",
    }, ...__VLS_functionalComponentArgsRest(__VLS_9));
    __VLS_11.slots.default;
    var __VLS_11;
    const __VLS_12 = {}.ElRadioButton;
    /** @type {[typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, ]} */ ;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
        label: "table",
    }));
    const __VLS_14 = __VLS_13({
        label: "table",
    }, ...__VLS_functionalComponentArgsRest(__VLS_13));
    __VLS_15.slots.default;
    var __VLS_15;
    var __VLS_7;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "toolbar-row" },
});
const __VLS_16 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    ...{ 'onInput': {} },
    modelValue: (__VLS_ctx.keyword),
    placeholder: "按名称 / 主机搜索",
    clearable: true,
    ...{ class: "search-input" },
    prefixIcon: (__VLS_ctx.Search),
}));
const __VLS_18 = __VLS_17({
    ...{ 'onInput': {} },
    modelValue: (__VLS_ctx.keyword),
    placeholder: "按名称 / 主机搜索",
    clearable: true,
    ...{ class: "search-input" },
    prefixIcon: (__VLS_ctx.Search),
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
let __VLS_20;
let __VLS_21;
let __VLS_22;
const __VLS_23 = {
    onInput: (__VLS_ctx.resetPagination)
};
var __VLS_19;
const __VLS_24 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.filterStatus),
    placeholder: "状态",
    clearable: true,
    ...{ class: "filter-select" },
}));
const __VLS_26 = __VLS_25({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.filterStatus),
    placeholder: "状态",
    clearable: true,
    ...{ class: "filter-select" },
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
let __VLS_28;
let __VLS_29;
let __VLS_30;
const __VLS_31 = {
    onChange: (__VLS_ctx.resetPagination)
};
__VLS_27.slots.default;
for (const [status] of __VLS_getVForSourceType((__VLS_ctx.statuses))) {
    const __VLS_32 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
        key: (status),
        label: (status),
        value: (status),
    }));
    const __VLS_34 = __VLS_33({
        key: (status),
        label: (status),
        value: (status),
    }, ...__VLS_functionalComponentArgsRest(__VLS_33));
}
var __VLS_27;
const __VLS_36 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.filterType),
    placeholder: "类型",
    clearable: true,
    ...{ class: "filter-select" },
}));
const __VLS_38 = __VLS_37({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.filterType),
    placeholder: "类型",
    clearable: true,
    ...{ class: "filter-select" },
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
let __VLS_40;
let __VLS_41;
let __VLS_42;
const __VLS_43 = {
    onChange: (__VLS_ctx.resetPagination)
};
__VLS_39.slots.default;
for (const [type] of __VLS_getVForSourceType((__VLS_ctx.types))) {
    const __VLS_44 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
        key: (type),
        label: (type),
        value: (type),
    }));
    const __VLS_46 = __VLS_45({
        key: (type),
        label: (type),
        value: (type),
    }, ...__VLS_functionalComponentArgsRest(__VLS_45));
}
var __VLS_39;
const __VLS_48 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.filterOwner),
    placeholder: "负责人",
    clearable: true,
    ...{ class: "filter-select" },
}));
const __VLS_50 = __VLS_49({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.filterOwner),
    placeholder: "负责人",
    clearable: true,
    ...{ class: "filter-select" },
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
let __VLS_52;
let __VLS_53;
let __VLS_54;
const __VLS_55 = {
    onChange: (__VLS_ctx.resetPagination)
};
__VLS_51.slots.default;
for (const [owner] of __VLS_getVForSourceType((__VLS_ctx.owners))) {
    const __VLS_56 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
        key: (owner),
        label: (owner),
        value: (owner),
    }));
    const __VLS_58 = __VLS_57({
        key: (owner),
        label: (owner),
        value: (owner),
    }, ...__VLS_functionalComponentArgsRest(__VLS_57));
}
var __VLS_51;
if (__VLS_ctx.viewMode === 'card') {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "ds-card-grid mt-12" },
    });
    for (const [item] of __VLS_getVForSourceType((__VLS_ctx.pagedList))) {
        const __VLS_60 = {}.ElCard;
        /** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
        // @ts-ignore
        const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
            ...{ 'onClick': {} },
            key: (item.id),
            ...{ class: "ds-card" },
            shadow: "hover",
        }));
        const __VLS_62 = __VLS_61({
            ...{ 'onClick': {} },
            key: (item.id),
            ...{ class: "ds-card" },
            shadow: "hover",
        }, ...__VLS_functionalComponentArgsRest(__VLS_61));
        let __VLS_64;
        let __VLS_65;
        let __VLS_66;
        const __VLS_67 = {
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.viewMode === 'card'))
                    return;
                __VLS_ctx.showDetail(item);
            }
        };
        __VLS_63.slots.default;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "ds-card-top" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "ds-type-badge" },
        });
        (item.type);
        const __VLS_68 = {}.ElTag;
        /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
        // @ts-ignore
        const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
            type: (__VLS_ctx.statusTagType[item.status]),
            effect: "dark",
        }));
        const __VLS_70 = __VLS_69({
            type: (__VLS_ctx.statusTagType[item.status]),
            effect: "dark",
        }, ...__VLS_functionalComponentArgsRest(__VLS_69));
        __VLS_71.slots.default;
        (item.status);
        var __VLS_71;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "ds-card-name" },
        });
        (item.name);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "ds-card-meta" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
        const __VLS_72 = {}.ElIcon;
        /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
        // @ts-ignore
        const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
            size: (12),
        }));
        const __VLS_74 = __VLS_73({
            size: (12),
        }, ...__VLS_functionalComponentArgsRest(__VLS_73));
        __VLS_75.slots.default;
        const __VLS_76 = {}.Location;
        /** @type {[typeof __VLS_components.Location, ]} */ ;
        // @ts-ignore
        const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({}));
        const __VLS_78 = __VLS_77({}, ...__VLS_functionalComponentArgsRest(__VLS_77));
        var __VLS_75;
        (item.host);
        (item.port);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
        const __VLS_80 = {}.ElIcon;
        /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
        // @ts-ignore
        const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
            size: (12),
        }));
        const __VLS_82 = __VLS_81({
            size: (12),
        }, ...__VLS_functionalComponentArgsRest(__VLS_81));
        __VLS_83.slots.default;
        const __VLS_84 = {}.Coin;
        /** @type {[typeof __VLS_components.Coin, ]} */ ;
        // @ts-ignore
        const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({}));
        const __VLS_86 = __VLS_85({}, ...__VLS_functionalComponentArgsRest(__VLS_85));
        var __VLS_83;
        (item.category);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "ds-card-footer" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (item.owner);
        const __VLS_88 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
            ...{ 'onClick': {} },
            link: true,
            type: "danger",
            size: "small",
        }));
        const __VLS_90 = __VLS_89({
            ...{ 'onClick': {} },
            link: true,
            type: "danger",
            size: "small",
        }, ...__VLS_functionalComponentArgsRest(__VLS_89));
        let __VLS_92;
        let __VLS_93;
        let __VLS_94;
        const __VLS_95 = {
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.viewMode === 'card'))
                    return;
                __VLS_ctx.testConnection(item);
            }
        };
        __VLS_91.slots.default;
        var __VLS_91;
        var __VLS_63;
    }
}
else {
    const __VLS_96 = {}.ElTable;
    /** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
    // @ts-ignore
    const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
        ...{ 'onRowClick': {} },
        data: (__VLS_ctx.pagedList),
        stripe: true,
        ...{ class: "mt-12" },
    }));
    const __VLS_98 = __VLS_97({
        ...{ 'onRowClick': {} },
        data: (__VLS_ctx.pagedList),
        stripe: true,
        ...{ class: "mt-12" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_97));
    let __VLS_100;
    let __VLS_101;
    let __VLS_102;
    const __VLS_103 = {
        onRowClick: (__VLS_ctx.showDetail)
    };
    __VLS_99.slots.default;
    const __VLS_104 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
        prop: "name",
        label: "数据源名称",
        minWidth: "170",
    }));
    const __VLS_106 = __VLS_105({
        prop: "name",
        label: "数据源名称",
        minWidth: "170",
    }, ...__VLS_functionalComponentArgsRest(__VLS_105));
    const __VLS_108 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
        prop: "type",
        label: "类型",
        width: "110",
    }));
    const __VLS_110 = __VLS_109({
        prop: "type",
        label: "类型",
        width: "110",
    }, ...__VLS_functionalComponentArgsRest(__VLS_109));
    const __VLS_112 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
        prop: "category",
        label: "分类",
        width: "100",
    }));
    const __VLS_114 = __VLS_113({
        prop: "category",
        label: "分类",
        width: "100",
    }, ...__VLS_functionalComponentArgsRest(__VLS_113));
    const __VLS_116 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
        label: "主机/端口",
        width: "170",
    }));
    const __VLS_118 = __VLS_117({
        label: "主机/端口",
        width: "170",
    }, ...__VLS_functionalComponentArgsRest(__VLS_117));
    __VLS_119.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_119.slots;
        const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
        (row.host);
        (row.port);
    }
    var __VLS_119;
    const __VLS_120 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({
        prop: "database",
        label: "库名",
        minWidth: "160",
    }));
    const __VLS_122 = __VLS_121({
        prop: "database",
        label: "库名",
        minWidth: "160",
    }, ...__VLS_functionalComponentArgsRest(__VLS_121));
    const __VLS_124 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({
        prop: "owner",
        label: "负责人",
        width: "90",
    }));
    const __VLS_126 = __VLS_125({
        prop: "owner",
        label: "负责人",
        width: "90",
    }, ...__VLS_functionalComponentArgsRest(__VLS_125));
    const __VLS_128 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({
        prop: "groupName",
        label: "所属分组",
        width: "110",
    }));
    const __VLS_130 = __VLS_129({
        prop: "groupName",
        label: "所属分组",
        width: "110",
    }, ...__VLS_functionalComponentArgsRest(__VLS_129));
    const __VLS_132 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132({
        label: "状态",
        width: "90",
    }));
    const __VLS_134 = __VLS_133({
        label: "状态",
        width: "90",
    }, ...__VLS_functionalComponentArgsRest(__VLS_133));
    __VLS_135.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_135.slots;
        const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
        const __VLS_136 = {}.ElTag;
        /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
        // @ts-ignore
        const __VLS_137 = __VLS_asFunctionalComponent(__VLS_136, new __VLS_136({
            type: (__VLS_ctx.statusTagType[row.status]),
            effect: "dark",
        }));
        const __VLS_138 = __VLS_137({
            type: (__VLS_ctx.statusTagType[row.status]),
            effect: "dark",
        }, ...__VLS_functionalComponentArgsRest(__VLS_137));
        __VLS_139.slots.default;
        (row.status);
        var __VLS_139;
    }
    var __VLS_135;
    const __VLS_140 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_141 = __VLS_asFunctionalComponent(__VLS_140, new __VLS_140({
        label: "响应(ms)",
        width: "90",
        align: "center",
    }));
    const __VLS_142 = __VLS_141({
        label: "响应(ms)",
        width: "90",
        align: "center",
    }, ...__VLS_functionalComponentArgsRest(__VLS_141));
    __VLS_143.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_143.slots;
        const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
        (row.responseTime);
    }
    var __VLS_143;
    const __VLS_144 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_145 = __VLS_asFunctionalComponent(__VLS_144, new __VLS_144({
        label: "操作",
        width: "180",
        fixed: "right",
    }));
    const __VLS_146 = __VLS_145({
        label: "操作",
        width: "180",
        fixed: "right",
    }, ...__VLS_functionalComponentArgsRest(__VLS_145));
    __VLS_147.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_147.slots;
        const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
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
                if (!!(__VLS_ctx.viewMode === 'card'))
                    return;
                __VLS_ctx.testConnection(row);
            }
        };
        __VLS_151.slots.default;
        var __VLS_151;
        const __VLS_156 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_157 = __VLS_asFunctionalComponent(__VLS_156, new __VLS_156({
            ...{ 'onClick': {} },
            link: true,
            type: "primary",
        }));
        const __VLS_158 = __VLS_157({
            ...{ 'onClick': {} },
            link: true,
            type: "primary",
        }, ...__VLS_functionalComponentArgsRest(__VLS_157));
        let __VLS_160;
        let __VLS_161;
        let __VLS_162;
        const __VLS_163 = {
            onClick: (...[$event]) => {
                if (!!(__VLS_ctx.viewMode === 'card'))
                    return;
                __VLS_ctx.showDetail(row);
            }
        };
        __VLS_159.slots.default;
        var __VLS_159;
    }
    var __VLS_147;
    var __VLS_99;
}
const __VLS_164 = {}.ElPagination;
/** @type {[typeof __VLS_components.ElPagination, typeof __VLS_components.elPagination, ]} */ ;
// @ts-ignore
const __VLS_165 = __VLS_asFunctionalComponent(__VLS_164, new __VLS_164({
    ...{ 'onCurrentChange': {} },
    ...{ 'onSizeChange': {} },
    ...{ class: "pager" },
    layout: "total, prev, pager, next, sizes",
    total: (__VLS_ctx.filteredList.length),
    pageSize: (__VLS_ctx.pageSize),
    currentPage: (__VLS_ctx.currentPage),
    pageSizes: ([12, 20, 50]),
    background: true,
}));
const __VLS_166 = __VLS_165({
    ...{ 'onCurrentChange': {} },
    ...{ 'onSizeChange': {} },
    ...{ class: "pager" },
    layout: "total, prev, pager, next, sizes",
    total: (__VLS_ctx.filteredList.length),
    pageSize: (__VLS_ctx.pageSize),
    currentPage: (__VLS_ctx.currentPage),
    pageSizes: ([12, 20, 50]),
    background: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_165));
let __VLS_168;
let __VLS_169;
let __VLS_170;
const __VLS_171 = {
    onCurrentChange: (...[$event]) => {
        __VLS_ctx.currentPage = $event;
    }
};
const __VLS_172 = {
    onSizeChange: (__VLS_ctx.handleSizeChange)
};
var __VLS_167;
var __VLS_3;
const __VLS_173 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_174 = __VLS_asFunctionalComponent(__VLS_173, new __VLS_173({
    modelValue: (__VLS_ctx.detailVisible),
    title: (__VLS_ctx.detailRow?.name ?? '数据源详情'),
    width: "600px",
}));
const __VLS_175 = __VLS_174({
    modelValue: (__VLS_ctx.detailVisible),
    title: (__VLS_ctx.detailRow?.name ?? '数据源详情'),
    width: "600px",
}, ...__VLS_functionalComponentArgsRest(__VLS_174));
__VLS_176.slots.default;
if (__VLS_ctx.detailRow) {
    const __VLS_177 = {}.ElDescriptions;
    /** @type {[typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, ]} */ ;
    // @ts-ignore
    const __VLS_178 = __VLS_asFunctionalComponent(__VLS_177, new __VLS_177({
        column: (2),
        border: true,
    }));
    const __VLS_179 = __VLS_178({
        column: (2),
        border: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_178));
    __VLS_180.slots.default;
    const __VLS_181 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_182 = __VLS_asFunctionalComponent(__VLS_181, new __VLS_181({
        label: "名称",
    }));
    const __VLS_183 = __VLS_182({
        label: "名称",
    }, ...__VLS_functionalComponentArgsRest(__VLS_182));
    __VLS_184.slots.default;
    (__VLS_ctx.detailRow.name);
    var __VLS_184;
    const __VLS_185 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_186 = __VLS_asFunctionalComponent(__VLS_185, new __VLS_185({
        label: "类型",
    }));
    const __VLS_187 = __VLS_186({
        label: "类型",
    }, ...__VLS_functionalComponentArgsRest(__VLS_186));
    __VLS_188.slots.default;
    (__VLS_ctx.detailRow.type);
    var __VLS_188;
    const __VLS_189 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_190 = __VLS_asFunctionalComponent(__VLS_189, new __VLS_189({
        label: "分类",
    }));
    const __VLS_191 = __VLS_190({
        label: "分类",
    }, ...__VLS_functionalComponentArgsRest(__VLS_190));
    __VLS_192.slots.default;
    (__VLS_ctx.detailRow.category);
    var __VLS_192;
    const __VLS_193 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_194 = __VLS_asFunctionalComponent(__VLS_193, new __VLS_193({
        label: "环境",
    }));
    const __VLS_195 = __VLS_194({
        label: "环境",
    }, ...__VLS_functionalComponentArgsRest(__VLS_194));
    __VLS_196.slots.default;
    (__VLS_ctx.detailRow.env);
    var __VLS_196;
    const __VLS_197 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_198 = __VLS_asFunctionalComponent(__VLS_197, new __VLS_197({
        label: "主机地址",
    }));
    const __VLS_199 = __VLS_198({
        label: "主机地址",
    }, ...__VLS_functionalComponentArgsRest(__VLS_198));
    __VLS_200.slots.default;
    (__VLS_ctx.detailRow.host);
    (__VLS_ctx.detailRow.port);
    var __VLS_200;
    const __VLS_201 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_202 = __VLS_asFunctionalComponent(__VLS_201, new __VLS_201({
        label: "库名",
    }));
    const __VLS_203 = __VLS_202({
        label: "库名",
    }, ...__VLS_functionalComponentArgsRest(__VLS_202));
    __VLS_204.slots.default;
    (__VLS_ctx.detailRow.database);
    var __VLS_204;
    const __VLS_205 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_206 = __VLS_asFunctionalComponent(__VLS_205, new __VLS_205({
        label: "负责人",
    }));
    const __VLS_207 = __VLS_206({
        label: "负责人",
    }, ...__VLS_functionalComponentArgsRest(__VLS_206));
    __VLS_208.slots.default;
    (__VLS_ctx.detailRow.owner);
    var __VLS_208;
    const __VLS_209 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_210 = __VLS_asFunctionalComponent(__VLS_209, new __VLS_209({
        label: "所属分组",
    }));
    const __VLS_211 = __VLS_210({
        label: "所属分组",
    }, ...__VLS_functionalComponentArgsRest(__VLS_210));
    __VLS_212.slots.default;
    (__VLS_ctx.detailRow.groupName);
    var __VLS_212;
    const __VLS_213 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_214 = __VLS_asFunctionalComponent(__VLS_213, new __VLS_213({
        label: "状态",
    }));
    const __VLS_215 = __VLS_214({
        label: "状态",
    }, ...__VLS_functionalComponentArgsRest(__VLS_214));
    __VLS_216.slots.default;
    const __VLS_217 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_218 = __VLS_asFunctionalComponent(__VLS_217, new __VLS_217({
        type: (__VLS_ctx.statusTagType[__VLS_ctx.detailRow.status]),
        effect: "dark",
    }));
    const __VLS_219 = __VLS_218({
        type: (__VLS_ctx.statusTagType[__VLS_ctx.detailRow.status]),
        effect: "dark",
    }, ...__VLS_functionalComponentArgsRest(__VLS_218));
    __VLS_220.slots.default;
    (__VLS_ctx.detailRow.status);
    var __VLS_220;
    var __VLS_216;
    const __VLS_221 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_222 = __VLS_asFunctionalComponent(__VLS_221, new __VLS_221({
        label: "更新时间",
    }));
    const __VLS_223 = __VLS_222({
        label: "更新时间",
    }, ...__VLS_functionalComponentArgsRest(__VLS_222));
    __VLS_224.slots.default;
    (__VLS_ctx.detailRow.updateTime);
    var __VLS_224;
    const __VLS_225 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_226 = __VLS_asFunctionalComponent(__VLS_225, new __VLS_225({
        label: "描述",
        span: (2),
    }));
    const __VLS_227 = __VLS_226({
        label: "描述",
        span: (2),
    }, ...__VLS_functionalComponentArgsRest(__VLS_226));
    __VLS_228.slots.default;
    (__VLS_ctx.detailRow.description);
    var __VLS_228;
    var __VLS_180;
}
var __VLS_176;
/** @type {__VLS_StyleScopedClasses['standard-page']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['toolbar-row']} */ ;
/** @type {__VLS_StyleScopedClasses['search-input']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-select']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-select']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-select']} */ ;
/** @type {__VLS_StyleScopedClasses['ds-card-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-12']} */ ;
/** @type {__VLS_StyleScopedClasses['ds-card']} */ ;
/** @type {__VLS_StyleScopedClasses['ds-card-top']} */ ;
/** @type {__VLS_StyleScopedClasses['ds-type-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['ds-card-name']} */ ;
/** @type {__VLS_StyleScopedClasses['ds-card-meta']} */ ;
/** @type {__VLS_StyleScopedClasses['ds-card-footer']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-12']} */ ;
/** @type {__VLS_StyleScopedClasses['pager']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Coin: Coin,
            Location: Location,
            Search: Search,
            viewMode: viewMode,
            keyword: keyword,
            filterStatus: filterStatus,
            filterType: filterType,
            filterOwner: filterOwner,
            currentPage: currentPage,
            pageSize: pageSize,
            detailVisible: detailVisible,
            detailRow: detailRow,
            statuses: statuses,
            types: types,
            owners: owners,
            statusTagType: statusTagType,
            filteredList: filteredList,
            pagedList: pagedList,
            resetPagination: resetPagination,
            handleSizeChange: handleSizeChange,
            testConnection: testConnection,
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
