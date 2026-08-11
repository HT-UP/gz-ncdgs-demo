import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { Grid, Key, ZoomIn, ZoomOut } from '@element-plus/icons-vue';
const modelLevel = ref('概念模型');
const targetDb = ref('MySQL');
const selectedTable = ref(null);
const scale = ref(1);
const ddlVisible = ref(false);
const ddlScript = ref('');
const tables = ref([
    {
        id: 't1',
        name: '客户信息表',
        comment: '客户基础信息',
        x: 80,
        y: 90,
        fields: [
            { name: 'cust_id', type: 'VARCHAR(32)', isKey: true },
            { name: 'cust_name', type: 'VARCHAR(64)', isKey: false },
            { name: 'cert_no', type: 'VARCHAR(32)', isKey: false },
            { name: 'phone', type: 'VARCHAR(20)', isKey: false },
            { name: 'created_at', type: 'DATETIME', isKey: false },
        ],
    },
    {
        id: 't2',
        name: '线路信息表',
        comment: '地铁线路信息',
        x: 420,
        y: 90,
        fields: [
            { name: 'line_id', type: 'VARCHAR(32)', isKey: true },
            { name: 'line_code', type: 'VARCHAR(16)', isKey: false },
            { name: 'line_name', type: 'VARCHAR(64)', isKey: false },
            { name: 'start_station', type: 'VARCHAR(64)', isKey: false },
            { name: 'end_station', type: 'VARCHAR(64)', isKey: false },
        ],
    },
    {
        id: 't3',
        name: '车站信息表',
        comment: '车站基础信息',
        x: 250,
        y: 340,
        fields: [
            { name: 'station_id', type: 'VARCHAR(32)', isKey: true },
            { name: 'line_id', type: 'VARCHAR(32)', isKey: false },
            { name: 'station_name', type: 'VARCHAR(64)', isKey: false },
            { name: 'station_type', type: 'VARCHAR(16)', isKey: false },
        ],
    },
]);
const reviewRecords = [
    { content: '概念模型评审通过，建议补充数据字典', time: '2026-08-08 10:20', user: '王工' },
    { content: '逻辑模型完成物理字段映射', time: '2026-08-09 15:40', user: '李四' },
    { content: '物理模型 DDL 已生成待评审', time: '2026-08-11 09:10', user: '王工' },
];
const zoom = (delta) => {
    scale.value = Math.min(1.6, Math.max(0.6, scale.value + delta));
};
const syncFieldCount = (count) => {
    if (!selectedTable.value)
        return;
    const current = selectedTable.value.fields.length;
    if (count > current) {
        for (let i = current; i < count; i += 1) {
            selectedTable.value.fields.push({
                name: `new_field_${i + 1}`,
                type: 'VARCHAR(64)',
                isKey: false,
            });
        }
    }
    else if (count < current) {
        selectedTable.value.fields.splice(count);
    }
};
const generateDdl = () => {
    if (!selectedTable.value)
        return;
    const table = selectedTable.value;
    const fields = table.fields
        .map((field) => {
        const key = field.isKey ? ' PRIMARY KEY' : '';
        return `  \`${field.name}\` ${field.type}${key},`;
    })
        .join('\n');
    ddlScript.value = `CREATE TABLE \`${table.name}\` (\n${fields}\n) COMMENT='${table.comment}';`;
    ddlVisible.value = true;
};
const copyDdl = () => {
    navigator.clipboard?.writeText(ddlScript.value).then(() => ElMessage.success('已复制到剪贴板'));
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
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-actions" },
    });
    const __VLS_12 = {}.ElRadioGroup;
    /** @type {[typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, ]} */ ;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
        modelValue: (__VLS_ctx.modelLevel),
        size: "small",
    }));
    const __VLS_14 = __VLS_13({
        modelValue: (__VLS_ctx.modelLevel),
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_13));
    __VLS_15.slots.default;
    const __VLS_16 = {}.ElRadioButton;
    /** @type {[typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, ]} */ ;
    // @ts-ignore
    const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
        label: "概念模型",
    }));
    const __VLS_18 = __VLS_17({
        label: "概念模型",
    }, ...__VLS_functionalComponentArgsRest(__VLS_17));
    __VLS_19.slots.default;
    var __VLS_19;
    const __VLS_20 = {}.ElRadioButton;
    /** @type {[typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, ]} */ ;
    // @ts-ignore
    const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
        label: "逻辑模型",
    }));
    const __VLS_22 = __VLS_21({
        label: "逻辑模型",
    }, ...__VLS_functionalComponentArgsRest(__VLS_21));
    __VLS_23.slots.default;
    var __VLS_23;
    const __VLS_24 = {}.ElRadioButton;
    /** @type {[typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, ]} */ ;
    // @ts-ignore
    const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
        label: "物理模型",
    }));
    const __VLS_26 = __VLS_25({
        label: "物理模型",
    }, ...__VLS_functionalComponentArgsRest(__VLS_25));
    __VLS_27.slots.default;
    var __VLS_27;
    var __VLS_15;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "canvas-wrap" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "canvas-grid" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "canvas-zoom" },
});
const __VLS_28 = {}.ElButtonGroup;
/** @type {[typeof __VLS_components.ElButtonGroup, typeof __VLS_components.elButtonGroup, typeof __VLS_components.ElButtonGroup, typeof __VLS_components.elButtonGroup, ]} */ ;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({}));
const __VLS_30 = __VLS_29({}, ...__VLS_functionalComponentArgsRest(__VLS_29));
__VLS_31.slots.default;
const __VLS_32 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
    ...{ 'onClick': {} },
    size: "small",
    icon: (__VLS_ctx.ZoomIn),
}));
const __VLS_34 = __VLS_33({
    ...{ 'onClick': {} },
    size: "small",
    icon: (__VLS_ctx.ZoomIn),
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
let __VLS_36;
let __VLS_37;
let __VLS_38;
const __VLS_39 = {
    onClick: (...[$event]) => {
        __VLS_ctx.zoom(0.1);
    }
};
__VLS_35.slots.default;
var __VLS_35;
const __VLS_40 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
    ...{ 'onClick': {} },
    size: "small",
    icon: (__VLS_ctx.ZoomOut),
}));
const __VLS_42 = __VLS_41({
    ...{ 'onClick': {} },
    size: "small",
    icon: (__VLS_ctx.ZoomOut),
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
let __VLS_44;
let __VLS_45;
let __VLS_46;
const __VLS_47 = {
    onClick: (...[$event]) => {
        __VLS_ctx.zoom(-0.1);
    }
};
__VLS_43.slots.default;
var __VLS_43;
var __VLS_31;
for (const [table] of __VLS_getVForSourceType((__VLS_ctx.tables))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.selectedTable = table;
            } },
        key: (table.id),
        ...{ class: "er-table" },
        ...{ style: ({ top: `${table.y}px`, left: `${table.x}px`, transform: `scale(${__VLS_ctx.scale})` }) },
        ...{ class: ({ 'is-selected': __VLS_ctx.selectedTable?.id === table.id }) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "er-table-title" },
    });
    const __VLS_48 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
        size: (14),
    }));
    const __VLS_50 = __VLS_49({
        size: (14),
    }, ...__VLS_functionalComponentArgsRest(__VLS_49));
    __VLS_51.slots.default;
    const __VLS_52 = {}.Grid;
    /** @type {[typeof __VLS_components.Grid, ]} */ ;
    // @ts-ignore
    const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({}));
    const __VLS_54 = __VLS_53({}, ...__VLS_functionalComponentArgsRest(__VLS_53));
    var __VLS_51;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (table.name);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "er-table-fields" },
    });
    for (const [field] of __VLS_getVForSourceType((table.fields))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            key: (field.name),
            ...{ class: "er-table-field" },
            ...{ class: ({ 'is-key': field.isKey }) },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "er-field-name" },
        });
        (field.name);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "er-field-type" },
        });
        (field.type);
        if (field.isKey) {
            const __VLS_56 = {}.ElIcon;
            /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
            // @ts-ignore
            const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
                ...{ class: "er-field-key" },
            }));
            const __VLS_58 = __VLS_57({
                ...{ class: "er-field-key" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_57));
            __VLS_59.slots.default;
            const __VLS_60 = {}.Key;
            /** @type {[typeof __VLS_components.Key, ]} */ ;
            // @ts-ignore
            const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({}));
            const __VLS_62 = __VLS_61({}, ...__VLS_functionalComponentArgsRest(__VLS_61));
            var __VLS_59;
        }
    }
}
var __VLS_11;
var __VLS_7;
const __VLS_64 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
    span: (8),
}));
const __VLS_66 = __VLS_65({
    span: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_65));
__VLS_67.slots.default;
const __VLS_68 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
    ...{ class: "panel-card dashboard-card" },
    shadow: "never",
}));
const __VLS_70 = __VLS_69({
    ...{ class: "panel-card dashboard-card" },
    shadow: "never",
}, ...__VLS_functionalComponentArgsRest(__VLS_69));
__VLS_71.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_71.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
}
if (__VLS_ctx.selectedTable) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "property-form" },
    });
    const __VLS_72 = {}.ElForm;
    /** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
    // @ts-ignore
    const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
        labelWidth: "80px",
        labelPosition: "left",
    }));
    const __VLS_74 = __VLS_73({
        labelWidth: "80px",
        labelPosition: "left",
    }, ...__VLS_functionalComponentArgsRest(__VLS_73));
    __VLS_75.slots.default;
    const __VLS_76 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
        label: "表名称",
    }));
    const __VLS_78 = __VLS_77({
        label: "表名称",
    }, ...__VLS_functionalComponentArgsRest(__VLS_77));
    __VLS_79.slots.default;
    const __VLS_80 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
        modelValue: (__VLS_ctx.selectedTable.name),
    }));
    const __VLS_82 = __VLS_81({
        modelValue: (__VLS_ctx.selectedTable.name),
    }, ...__VLS_functionalComponentArgsRest(__VLS_81));
    var __VLS_79;
    const __VLS_84 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
        label: "表说明",
    }));
    const __VLS_86 = __VLS_85({
        label: "表说明",
    }, ...__VLS_functionalComponentArgsRest(__VLS_85));
    __VLS_87.slots.default;
    const __VLS_88 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
        modelValue: (__VLS_ctx.selectedTable.comment),
    }));
    const __VLS_90 = __VLS_89({
        modelValue: (__VLS_ctx.selectedTable.comment),
    }, ...__VLS_functionalComponentArgsRest(__VLS_89));
    var __VLS_87;
    const __VLS_92 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
        label: "字段数量",
    }));
    const __VLS_94 = __VLS_93({
        label: "字段数量",
    }, ...__VLS_functionalComponentArgsRest(__VLS_93));
    __VLS_95.slots.default;
    const __VLS_96 = {}.ElInputNumber;
    /** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
    // @ts-ignore
    const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.selectedTable.fields.length),
        min: (1),
        max: (20),
    }));
    const __VLS_98 = __VLS_97({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.selectedTable.fields.length),
        min: (1),
        max: (20),
    }, ...__VLS_functionalComponentArgsRest(__VLS_97));
    let __VLS_100;
    let __VLS_101;
    let __VLS_102;
    const __VLS_103 = {
        onChange: (__VLS_ctx.syncFieldCount)
    };
    var __VLS_99;
    var __VLS_95;
    const __VLS_104 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
        label: "目标库",
    }));
    const __VLS_106 = __VLS_105({
        label: "目标库",
    }, ...__VLS_functionalComponentArgsRest(__VLS_105));
    __VLS_107.slots.default;
    const __VLS_108 = {}.ElSelect;
    /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
    // @ts-ignore
    const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
        modelValue: (__VLS_ctx.targetDb),
        ...{ class: "w-full" },
    }));
    const __VLS_110 = __VLS_109({
        modelValue: (__VLS_ctx.targetDb),
        ...{ class: "w-full" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_109));
    __VLS_111.slots.default;
    const __VLS_112 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
        label: "MySQL",
        value: "MySQL",
    }));
    const __VLS_114 = __VLS_113({
        label: "MySQL",
        value: "MySQL",
    }, ...__VLS_functionalComponentArgsRest(__VLS_113));
    const __VLS_116 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
        label: "PostgreSQL",
        value: "PostgreSQL",
    }));
    const __VLS_118 = __VLS_117({
        label: "PostgreSQL",
        value: "PostgreSQL",
    }, ...__VLS_functionalComponentArgsRest(__VLS_117));
    const __VLS_120 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({
        label: "达梦 DM",
        value: "达梦 DM",
    }));
    const __VLS_122 = __VLS_121({
        label: "达梦 DM",
        value: "达梦 DM",
    }, ...__VLS_functionalComponentArgsRest(__VLS_121));
    const __VLS_124 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({
        label: "人大金仓",
        value: "人大金仓",
    }));
    const __VLS_126 = __VLS_125({
        label: "人大金仓",
        value: "人大金仓",
    }, ...__VLS_functionalComponentArgsRest(__VLS_125));
    var __VLS_111;
    var __VLS_107;
    var __VLS_75;
    const __VLS_128 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({
        ...{ 'onClick': {} },
        type: "danger",
        ...{ class: "w-full" },
    }));
    const __VLS_130 = __VLS_129({
        ...{ 'onClick': {} },
        type: "danger",
        ...{ class: "w-full" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_129));
    let __VLS_132;
    let __VLS_133;
    let __VLS_134;
    const __VLS_135 = {
        onClick: (__VLS_ctx.generateDdl)
    };
    __VLS_131.slots.default;
    var __VLS_131;
}
else {
    const __VLS_136 = {}.ElEmpty;
    /** @type {[typeof __VLS_components.ElEmpty, typeof __VLS_components.elEmpty, ]} */ ;
    // @ts-ignore
    const __VLS_137 = __VLS_asFunctionalComponent(__VLS_136, new __VLS_136({
        description: "请点击画布中的表进行配置",
        imageSize: (80),
    }));
    const __VLS_138 = __VLS_137({
        description: "请点击画布中的表进行配置",
        imageSize: (80),
    }, ...__VLS_functionalComponentArgsRest(__VLS_137));
}
var __VLS_71;
const __VLS_140 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_141 = __VLS_asFunctionalComponent(__VLS_140, new __VLS_140({
    ...{ class: "panel-card dashboard-card mt-16" },
    shadow: "never",
}));
const __VLS_142 = __VLS_141({
    ...{ class: "panel-card dashboard-card mt-16" },
    shadow: "never",
}, ...__VLS_functionalComponentArgsRest(__VLS_141));
__VLS_143.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_143.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
}
const __VLS_144 = {}.ElTimeline;
/** @type {[typeof __VLS_components.ElTimeline, typeof __VLS_components.elTimeline, typeof __VLS_components.ElTimeline, typeof __VLS_components.elTimeline, ]} */ ;
// @ts-ignore
const __VLS_145 = __VLS_asFunctionalComponent(__VLS_144, new __VLS_144({}));
const __VLS_146 = __VLS_145({}, ...__VLS_functionalComponentArgsRest(__VLS_145));
__VLS_147.slots.default;
for (const [record] of __VLS_getVForSourceType((__VLS_ctx.reviewRecords))) {
    const __VLS_148 = {}.ElTimelineItem;
    /** @type {[typeof __VLS_components.ElTimelineItem, typeof __VLS_components.elTimelineItem, typeof __VLS_components.ElTimelineItem, typeof __VLS_components.elTimelineItem, ]} */ ;
    // @ts-ignore
    const __VLS_149 = __VLS_asFunctionalComponent(__VLS_148, new __VLS_148({
        key: (`${record.time}-${record.content}`),
        timestamp: (record.time),
        placement: "top",
        color: "#DA251D",
    }));
    const __VLS_150 = __VLS_149({
        key: (`${record.time}-${record.content}`),
        timestamp: (record.time),
        placement: "top",
        color: "#DA251D",
    }, ...__VLS_functionalComponentArgsRest(__VLS_149));
    __VLS_151.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "list-item no-border" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "list-item-text" },
    });
    (record.content);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "list-item-meta" },
    });
    (record.user);
    var __VLS_151;
}
var __VLS_147;
var __VLS_143;
var __VLS_67;
var __VLS_3;
const __VLS_152 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_153 = __VLS_asFunctionalComponent(__VLS_152, new __VLS_152({
    modelValue: (__VLS_ctx.ddlVisible),
    title: "DDL 脚本预览",
    width: "620px",
}));
const __VLS_154 = __VLS_153({
    modelValue: (__VLS_ctx.ddlVisible),
    title: "DDL 脚本预览",
    width: "620px",
}, ...__VLS_functionalComponentArgsRest(__VLS_153));
__VLS_155.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.pre, __VLS_intrinsicElements.pre)({
    ...{ class: "ddl-block" },
});
(__VLS_ctx.ddlScript);
{
    const { footer: __VLS_thisSlot } = __VLS_155.slots;
    const __VLS_156 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_157 = __VLS_asFunctionalComponent(__VLS_156, new __VLS_156({
        ...{ 'onClick': {} },
    }));
    const __VLS_158 = __VLS_157({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_157));
    let __VLS_160;
    let __VLS_161;
    let __VLS_162;
    const __VLS_163 = {
        onClick: (...[$event]) => {
            __VLS_ctx.ddlVisible = false;
        }
    };
    __VLS_159.slots.default;
    var __VLS_159;
    const __VLS_164 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_165 = __VLS_asFunctionalComponent(__VLS_164, new __VLS_164({
        ...{ 'onClick': {} },
        type: "danger",
    }));
    const __VLS_166 = __VLS_165({
        ...{ 'onClick': {} },
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_165));
    let __VLS_168;
    let __VLS_169;
    let __VLS_170;
    const __VLS_171 = {
        onClick: (__VLS_ctx.copyDdl)
    };
    __VLS_167.slots.default;
    var __VLS_167;
}
var __VLS_155;
/** @type {__VLS_StyleScopedClasses['standard-page']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['canvas-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['canvas-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['canvas-zoom']} */ ;
/** @type {__VLS_StyleScopedClasses['er-table']} */ ;
/** @type {__VLS_StyleScopedClasses['er-table-title']} */ ;
/** @type {__VLS_StyleScopedClasses['er-table-fields']} */ ;
/** @type {__VLS_StyleScopedClasses['er-table-field']} */ ;
/** @type {__VLS_StyleScopedClasses['er-field-name']} */ ;
/** @type {__VLS_StyleScopedClasses['er-field-type']} */ ;
/** @type {__VLS_StyleScopedClasses['er-field-key']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['property-form']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['list-item']} */ ;
/** @type {__VLS_StyleScopedClasses['no-border']} */ ;
/** @type {__VLS_StyleScopedClasses['list-item-text']} */ ;
/** @type {__VLS_StyleScopedClasses['list-item-meta']} */ ;
/** @type {__VLS_StyleScopedClasses['ddl-block']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Grid: Grid,
            Key: Key,
            ZoomIn: ZoomIn,
            ZoomOut: ZoomOut,
            modelLevel: modelLevel,
            targetDb: targetDb,
            selectedTable: selectedTable,
            scale: scale,
            ddlVisible: ddlVisible,
            ddlScript: ddlScript,
            tables: tables,
            reviewRecords: reviewRecords,
            zoom: zoom,
            syncFieldCount: syncFieldCount,
            generateDdl: generateDdl,
            copyDdl: copyDdl,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
