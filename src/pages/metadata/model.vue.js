import { ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { CircleCheck, Download, Grid, Key, Upload, Warning, ZoomIn, ZoomOut } from '@element-plus/icons-vue';
const versions = ref(['V3.2', 'V3.1', 'V3.0', 'V2.5']);
const currentVersion = ref('V3.2');
const scale = ref(1);
const selectedEntity = ref(null);
const entities = ref([
    {
        id: 'm1',
        name: '客户维度表',
        comment: '客户主数据维度',
        x: 70,
        y: 80,
        standard: '客户信息数据元',
        fields: [
            { name: 'cust_id', type: 'BIGINT', isKey: true },
            { name: 'cust_name', type: 'VARCHAR(64)', isKey: false },
            { name: 'cert_no', type: 'VARCHAR(32)', isKey: false },
            { name: 'phone', type: 'VARCHAR(20)', isKey: false },
        ],
    },
    {
        id: 'm2',
        name: '线路维度表',
        comment: '线路主数据维度',
        x: 420,
        y: 80,
        standard: '线路编码标准',
        fields: [
            { name: 'line_id', type: 'BIGINT', isKey: true },
            { name: 'line_code', type: 'VARCHAR(16)', isKey: false },
            { name: 'line_name', type: 'VARCHAR(64)', isKey: false },
        ],
    },
    {
        id: 'm3',
        name: '客流事实表',
        comment: '客流统计事实',
        x: 240,
        y: 340,
        standard: '未关联',
        fields: [
            { name: 'flow_id', type: 'BIGINT', isKey: true },
            { name: 'station_id', type: 'BIGINT', isKey: false },
            { name: 'flow_count', type: 'INT', isKey: false },
            { name: 'stat_date', type: 'DATE', isKey: false },
        ],
    },
]);
const modelHistory = [
    { content: 'V3.2 保存：新增客流事实表统计粒度说明', time: '2026-08-11 09:30', user: '李四' },
    { content: 'V3.1 评审通过：客户维度表命名规范调整', time: '2026-08-09 15:20', user: '王工' },
    { content: 'V3.0 保存：建立与数据标准自动关联', time: '2026-08-05 11:10', user: '李四' },
];
const zoom = (delta) => {
    scale.value = Math.min(1.6, Math.max(0.6, scale.value + delta));
};
const saveModel = () => {
    ElMessage.success(`模型已保存（Mock），当前版本 ${currentVersion.value}`);
};
const saveAsModel = () => {
    const next = `V${(parseFloat(currentVersion.value.slice(1)) + 0.1).toFixed(1)}`;
    versions.value.unshift(next);
    currentVersion.value = next;
    ElMessage.success(`模型已另存为新版本 ${next}（Mock）`);
};
const exportModel = () => {
    ElMessage.success('模型已导出（支持 JSON / 通用建模格式）（Mock）');
};
const importModel = () => {
    ElMessage.info('请选择模型文件导入（Mock 演示）');
};
const validateModel = () => {
    ElMessageBox.alert('命名规范：通过\n主外键完整性：通过\n重名检查：通过\n\n建模规范校验全部通过！', '校验结果', {
        type: 'success',
    });
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
    const __VLS_12 = {}.ElSelect;
    /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
        modelValue: (__VLS_ctx.currentVersion),
        ...{ class: "version-select" },
        size: "small",
    }));
    const __VLS_14 = __VLS_13({
        modelValue: (__VLS_ctx.currentVersion),
        ...{ class: "version-select" },
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_13));
    __VLS_15.slots.default;
    for (const [version] of __VLS_getVForSourceType((__VLS_ctx.versions))) {
        const __VLS_16 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
            key: (version),
            label: (version),
            value: (version),
        }));
        const __VLS_18 = __VLS_17({
            key: (version),
            label: (version),
            value: (version),
        }, ...__VLS_functionalComponentArgsRest(__VLS_17));
    }
    var __VLS_15;
    const __VLS_20 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
        ...{ 'onClick': {} },
        size: "small",
    }));
    const __VLS_22 = __VLS_21({
        ...{ 'onClick': {} },
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_21));
    let __VLS_24;
    let __VLS_25;
    let __VLS_26;
    const __VLS_27 = {
        onClick: (__VLS_ctx.saveModel)
    };
    __VLS_23.slots.default;
    var __VLS_23;
    const __VLS_28 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
        ...{ 'onClick': {} },
        size: "small",
        type: "danger",
    }));
    const __VLS_30 = __VLS_29({
        ...{ 'onClick': {} },
        size: "small",
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_29));
    let __VLS_32;
    let __VLS_33;
    let __VLS_34;
    const __VLS_35 = {
        onClick: (__VLS_ctx.saveAsModel)
    };
    __VLS_31.slots.default;
    var __VLS_31;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "canvas-wrap model-canvas" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "model-toolbar" },
});
const __VLS_36 = {}.ElButtonGroup;
/** @type {[typeof __VLS_components.ElButtonGroup, typeof __VLS_components.elButtonGroup, typeof __VLS_components.ElButtonGroup, typeof __VLS_components.elButtonGroup, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({}));
const __VLS_38 = __VLS_37({}, ...__VLS_functionalComponentArgsRest(__VLS_37));
__VLS_39.slots.default;
const __VLS_40 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
    ...{ 'onClick': {} },
    size: "small",
    icon: (__VLS_ctx.ZoomIn),
}));
const __VLS_42 = __VLS_41({
    ...{ 'onClick': {} },
    size: "small",
    icon: (__VLS_ctx.ZoomIn),
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
let __VLS_44;
let __VLS_45;
let __VLS_46;
const __VLS_47 = {
    onClick: (...[$event]) => {
        __VLS_ctx.zoom(0.1);
    }
};
__VLS_43.slots.default;
var __VLS_43;
const __VLS_48 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
    ...{ 'onClick': {} },
    size: "small",
    icon: (__VLS_ctx.ZoomOut),
}));
const __VLS_50 = __VLS_49({
    ...{ 'onClick': {} },
    size: "small",
    icon: (__VLS_ctx.ZoomOut),
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
let __VLS_52;
let __VLS_53;
let __VLS_54;
const __VLS_55 = {
    onClick: (...[$event]) => {
        __VLS_ctx.zoom(-0.1);
    }
};
__VLS_51.slots.default;
var __VLS_51;
var __VLS_39;
const __VLS_56 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
    ...{ 'onClick': {} },
    size: "small",
    type: "danger",
    plain: true,
    icon: (__VLS_ctx.Download),
}));
const __VLS_58 = __VLS_57({
    ...{ 'onClick': {} },
    size: "small",
    type: "danger",
    plain: true,
    icon: (__VLS_ctx.Download),
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
let __VLS_60;
let __VLS_61;
let __VLS_62;
const __VLS_63 = {
    onClick: (__VLS_ctx.exportModel)
};
__VLS_59.slots.default;
var __VLS_59;
const __VLS_64 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
    ...{ 'onClick': {} },
    size: "small",
    type: "danger",
    plain: true,
    icon: (__VLS_ctx.Upload),
}));
const __VLS_66 = __VLS_65({
    ...{ 'onClick': {} },
    size: "small",
    type: "danger",
    plain: true,
    icon: (__VLS_ctx.Upload),
}, ...__VLS_functionalComponentArgsRest(__VLS_65));
let __VLS_68;
let __VLS_69;
let __VLS_70;
const __VLS_71 = {
    onClick: (__VLS_ctx.importModel)
};
__VLS_67.slots.default;
var __VLS_67;
const __VLS_72 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
    ...{ 'onClick': {} },
    size: "small",
    icon: (__VLS_ctx.CircleCheck),
}));
const __VLS_74 = __VLS_73({
    ...{ 'onClick': {} },
    size: "small",
    icon: (__VLS_ctx.CircleCheck),
}, ...__VLS_functionalComponentArgsRest(__VLS_73));
let __VLS_76;
let __VLS_77;
let __VLS_78;
const __VLS_79 = {
    onClick: (__VLS_ctx.validateModel)
};
__VLS_75.slots.default;
var __VLS_75;
for (const [entity] of __VLS_getVForSourceType((__VLS_ctx.entities))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.selectedEntity = entity;
            } },
        key: (entity.id),
        ...{ class: "er-table model-entity" },
        ...{ style: ({ top: `${entity.y}px`, left: `${entity.x}px`, transform: `scale(${__VLS_ctx.scale})` }) },
        ...{ class: ({ 'is-selected': __VLS_ctx.selectedEntity?.id === entity.id }) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "er-table-title" },
    });
    const __VLS_80 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
        size: (14),
    }));
    const __VLS_82 = __VLS_81({
        size: (14),
    }, ...__VLS_functionalComponentArgsRest(__VLS_81));
    __VLS_83.slots.default;
    const __VLS_84 = {}.Grid;
    /** @type {[typeof __VLS_components.Grid, ]} */ ;
    // @ts-ignore
    const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({}));
    const __VLS_86 = __VLS_85({}, ...__VLS_functionalComponentArgsRest(__VLS_85));
    var __VLS_83;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (entity.name);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "er-table-fields" },
    });
    for (const [field] of __VLS_getVForSourceType((entity.fields))) {
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
            const __VLS_88 = {}.ElIcon;
            /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
            // @ts-ignore
            const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
                ...{ class: "er-field-key" },
            }));
            const __VLS_90 = __VLS_89({
                ...{ class: "er-field-key" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_89));
            __VLS_91.slots.default;
            const __VLS_92 = {}.Key;
            /** @type {[typeof __VLS_components.Key, ]} */ ;
            // @ts-ignore
            const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({}));
            const __VLS_94 = __VLS_93({}, ...__VLS_functionalComponentArgsRest(__VLS_93));
            var __VLS_91;
        }
    }
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "model-validation mt-12" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "validation-title" },
});
const __VLS_96 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
    size: (14),
}));
const __VLS_98 = __VLS_97({
    size: (14),
}, ...__VLS_functionalComponentArgsRest(__VLS_97));
__VLS_99.slots.default;
const __VLS_100 = {}.Warning;
/** @type {[typeof __VLS_components.Warning, ]} */ ;
// @ts-ignore
const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({}));
const __VLS_102 = __VLS_101({}, ...__VLS_functionalComponentArgsRest(__VLS_101));
var __VLS_99;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "validation-item" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "validation-item" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "validation-item" },
});
var __VLS_11;
var __VLS_7;
const __VLS_104 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
    span: (8),
}));
const __VLS_106 = __VLS_105({
    span: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_105));
__VLS_107.slots.default;
const __VLS_108 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
    ...{ class: "panel-card dashboard-card" },
    shadow: "never",
}));
const __VLS_110 = __VLS_109({
    ...{ class: "panel-card dashboard-card" },
    shadow: "never",
}, ...__VLS_functionalComponentArgsRest(__VLS_109));
__VLS_111.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_111.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
}
if (__VLS_ctx.selectedEntity) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "property-form" },
    });
    const __VLS_112 = {}.ElForm;
    /** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
    // @ts-ignore
    const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
        labelWidth: "80px",
        labelPosition: "left",
    }));
    const __VLS_114 = __VLS_113({
        labelWidth: "80px",
        labelPosition: "left",
    }, ...__VLS_functionalComponentArgsRest(__VLS_113));
    __VLS_115.slots.default;
    const __VLS_116 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
        label: "实体名称",
    }));
    const __VLS_118 = __VLS_117({
        label: "实体名称",
    }, ...__VLS_functionalComponentArgsRest(__VLS_117));
    __VLS_119.slots.default;
    const __VLS_120 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({
        modelValue: (__VLS_ctx.selectedEntity.name),
    }));
    const __VLS_122 = __VLS_121({
        modelValue: (__VLS_ctx.selectedEntity.name),
    }, ...__VLS_functionalComponentArgsRest(__VLS_121));
    var __VLS_119;
    const __VLS_124 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({
        label: "实体说明",
    }));
    const __VLS_126 = __VLS_125({
        label: "实体说明",
    }, ...__VLS_functionalComponentArgsRest(__VLS_125));
    __VLS_127.slots.default;
    const __VLS_128 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({
        modelValue: (__VLS_ctx.selectedEntity.comment),
    }));
    const __VLS_130 = __VLS_129({
        modelValue: (__VLS_ctx.selectedEntity.comment),
    }, ...__VLS_functionalComponentArgsRest(__VLS_129));
    var __VLS_127;
    const __VLS_132 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132({
        label: "关联标准",
    }));
    const __VLS_134 = __VLS_133({
        label: "关联标准",
    }, ...__VLS_functionalComponentArgsRest(__VLS_133));
    __VLS_135.slots.default;
    const __VLS_136 = {}.ElSelect;
    /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
    // @ts-ignore
    const __VLS_137 = __VLS_asFunctionalComponent(__VLS_136, new __VLS_136({
        modelValue: (__VLS_ctx.selectedEntity.standard),
        ...{ class: "w-full" },
    }));
    const __VLS_138 = __VLS_137({
        modelValue: (__VLS_ctx.selectedEntity.standard),
        ...{ class: "w-full" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_137));
    __VLS_139.slots.default;
    const __VLS_140 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_141 = __VLS_asFunctionalComponent(__VLS_140, new __VLS_140({
        label: "客户信息数据元",
        value: "客户信息数据元",
    }));
    const __VLS_142 = __VLS_141({
        label: "客户信息数据元",
        value: "客户信息数据元",
    }, ...__VLS_functionalComponentArgsRest(__VLS_141));
    const __VLS_144 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_145 = __VLS_asFunctionalComponent(__VLS_144, new __VLS_144({
        label: "线路编码标准",
        value: "线路编码标准",
    }));
    const __VLS_146 = __VLS_145({
        label: "线路编码标准",
        value: "线路编码标准",
    }, ...__VLS_functionalComponentArgsRest(__VLS_145));
    const __VLS_148 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_149 = __VLS_asFunctionalComponent(__VLS_148, new __VLS_148({
        label: "车站信息数据元",
        value: "车站信息数据元",
    }));
    const __VLS_150 = __VLS_149({
        label: "车站信息数据元",
        value: "车站信息数据元",
    }, ...__VLS_functionalComponentArgsRest(__VLS_149));
    const __VLS_152 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_153 = __VLS_asFunctionalComponent(__VLS_152, new __VLS_152({
        label: "未关联",
        value: "未关联",
    }));
    const __VLS_154 = __VLS_153({
        label: "未关联",
        value: "未关联",
    }, ...__VLS_functionalComponentArgsRest(__VLS_153));
    var __VLS_139;
    var __VLS_135;
    var __VLS_115;
}
else {
    const __VLS_156 = {}.ElEmpty;
    /** @type {[typeof __VLS_components.ElEmpty, typeof __VLS_components.elEmpty, ]} */ ;
    // @ts-ignore
    const __VLS_157 = __VLS_asFunctionalComponent(__VLS_156, new __VLS_156({
        description: "点击画布中的实体进行配置",
        imageSize: (80),
    }));
    const __VLS_158 = __VLS_157({
        description: "点击画布中的实体进行配置",
        imageSize: (80),
    }, ...__VLS_functionalComponentArgsRest(__VLS_157));
}
var __VLS_111;
const __VLS_160 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_161 = __VLS_asFunctionalComponent(__VLS_160, new __VLS_160({
    ...{ class: "panel-card dashboard-card mt-16" },
    shadow: "never",
}));
const __VLS_162 = __VLS_161({
    ...{ class: "panel-card dashboard-card mt-16" },
    shadow: "never",
}, ...__VLS_functionalComponentArgsRest(__VLS_161));
__VLS_163.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_163.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
}
const __VLS_164 = {}.ElTimeline;
/** @type {[typeof __VLS_components.ElTimeline, typeof __VLS_components.elTimeline, typeof __VLS_components.ElTimeline, typeof __VLS_components.elTimeline, ]} */ ;
// @ts-ignore
const __VLS_165 = __VLS_asFunctionalComponent(__VLS_164, new __VLS_164({}));
const __VLS_166 = __VLS_165({}, ...__VLS_functionalComponentArgsRest(__VLS_165));
__VLS_167.slots.default;
for (const [record] of __VLS_getVForSourceType((__VLS_ctx.modelHistory))) {
    const __VLS_168 = {}.ElTimelineItem;
    /** @type {[typeof __VLS_components.ElTimelineItem, typeof __VLS_components.elTimelineItem, typeof __VLS_components.ElTimelineItem, typeof __VLS_components.elTimelineItem, ]} */ ;
    // @ts-ignore
    const __VLS_169 = __VLS_asFunctionalComponent(__VLS_168, new __VLS_168({
        key: (record.time),
        timestamp: (record.time),
        placement: "top",
        color: "#DA251D",
    }));
    const __VLS_170 = __VLS_169({
        key: (record.time),
        timestamp: (record.time),
        placement: "top",
        color: "#DA251D",
    }, ...__VLS_functionalComponentArgsRest(__VLS_169));
    __VLS_171.slots.default;
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
    var __VLS_171;
}
var __VLS_167;
var __VLS_163;
var __VLS_107;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['standard-page']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['version-select']} */ ;
/** @type {__VLS_StyleScopedClasses['canvas-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['model-canvas']} */ ;
/** @type {__VLS_StyleScopedClasses['model-toolbar']} */ ;
/** @type {__VLS_StyleScopedClasses['er-table']} */ ;
/** @type {__VLS_StyleScopedClasses['model-entity']} */ ;
/** @type {__VLS_StyleScopedClasses['er-table-title']} */ ;
/** @type {__VLS_StyleScopedClasses['er-table-fields']} */ ;
/** @type {__VLS_StyleScopedClasses['er-table-field']} */ ;
/** @type {__VLS_StyleScopedClasses['er-field-name']} */ ;
/** @type {__VLS_StyleScopedClasses['er-field-type']} */ ;
/** @type {__VLS_StyleScopedClasses['er-field-key']} */ ;
/** @type {__VLS_StyleScopedClasses['model-validation']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-12']} */ ;
/** @type {__VLS_StyleScopedClasses['validation-title']} */ ;
/** @type {__VLS_StyleScopedClasses['validation-item']} */ ;
/** @type {__VLS_StyleScopedClasses['validation-item']} */ ;
/** @type {__VLS_StyleScopedClasses['validation-item']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['property-form']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['list-item']} */ ;
/** @type {__VLS_StyleScopedClasses['no-border']} */ ;
/** @type {__VLS_StyleScopedClasses['list-item-text']} */ ;
/** @type {__VLS_StyleScopedClasses['list-item-meta']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            CircleCheck: CircleCheck,
            Download: Download,
            Grid: Grid,
            Key: Key,
            Upload: Upload,
            Warning: Warning,
            ZoomIn: ZoomIn,
            ZoomOut: ZoomOut,
            versions: versions,
            currentVersion: currentVersion,
            scale: scale,
            selectedEntity: selectedEntity,
            entities: entities,
            modelHistory: modelHistory,
            zoom: zoom,
            saveModel: saveModel,
            saveAsModel: saveAsModel,
            exportModel: exportModel,
            importModel: importModel,
            validateModel: validateModel,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
