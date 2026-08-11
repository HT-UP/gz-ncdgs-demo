import { ref } from 'vue';
import { ElMessage } from 'element-plus';
const nodeTypes = [
    { type: 'batch', label: '批处理节点', color: '#2B6CB0' },
    { type: 'stream', label: '流处理节点', color: '#00A854' },
    { type: 'script', label: '脚本节点', color: '#ED7B2F' },
    { type: 'quality', label: '质量检查节点', color: '#DA251D' },
    { type: 'notify', label: '通知节点', color: '#9B59B6' },
    { type: 'branch', label: '条件分支', color: '#8C8C8C' },
    { type: 'loop', label: '循环节点', color: '#5B8DEF' },
];
const flowVersions = ref(['V2.3', 'V2.2', 'V2.1']);
const flowVersion = ref('V2.3');
const selectedNode = ref(null);
const flowNodes = ref([
    { id: 'n1', label: '票务数据同步', typeLabel: '批处理节点', color: '#2B6CB0', x: 30, y: 60, status: '成功', params: 'source=ticket_core\ntarget=ODS' },
    { id: 'n2', label: '数据清洗脚本', typeLabel: '脚本节点', color: '#ED7B2F', x: 290, y: 60, status: '成功', params: 'python clean.py' },
    { id: 'n3', label: '质量检查', typeLabel: '质量检查节点', color: '#DA251D', x: 550, y: 60, status: '成功', params: 'rules=QR-001,QR-006' },
    { id: 'n4', label: '客流实时汇聚', typeLabel: '流处理节点', color: '#00A854', x: 290, y: 250, status: '未执行', params: 'window=5min' },
    { id: 'n5', label: '通知运维', typeLabel: '通知节点', color: '#9B59B6', x: 550, y: 250, status: '未执行', params: 'channel=站内/邮件' },
]);
const flowEdges = [
    { id: 'e1', fromX: 190, fromY: 100, toX: 290, toY: 100 },
    { id: 'e2', fromX: 450, fromY: 100, toX: 550, toY: 100 },
    { id: 'e3', fromX: 450, fromY: 100, toX: 290, toY: 250 },
    { id: 'e4', fromX: 450, fromY: 290, toX: 550, toY: 290 },
];
const saveFlow = () => {
    ElMessage.success('流程已保存（Mock）');
};
const debugFlow = () => {
    ElMessage.success('断点调试模式已开启，可单步执行节点（Mock）');
};
const runNode = () => {
    if (!selectedNode.value)
        return;
    selectedNode.value.status = '成功';
    ElMessage.success(`节点「${selectedNode.value.label}」执行成功（Mock）`);
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
    span: (5),
}));
const __VLS_6 = __VLS_5({
    span: (5),
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
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flow-node-palette" },
});
for (const [nodeType] of __VLS_getVForSourceType((__VLS_ctx.nodeTypes))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (nodeType.type),
        ...{ class: "flow-palette-item" },
        ...{ style: ({ borderColor: nodeType.color, color: nodeType.color }) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "flow-palette-dot" },
        ...{ style: ({ background: nodeType.color }) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (nodeType.label);
}
var __VLS_11;
var __VLS_7;
const __VLS_12 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
    span: (14),
}));
const __VLS_14 = __VLS_13({
    span: (14),
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
__VLS_15.slots.default;
const __VLS_16 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    ...{ class: "panel-card dashboard-card" },
    shadow: "never",
}));
const __VLS_18 = __VLS_17({
    ...{ class: "panel-card dashboard-card" },
    shadow: "never",
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
__VLS_19.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_19.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-actions" },
    });
    const __VLS_20 = {}.ElSelect;
    /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
    // @ts-ignore
    const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
        modelValue: (__VLS_ctx.flowVersion),
        size: "small",
        ...{ class: "version-select" },
    }));
    const __VLS_22 = __VLS_21({
        modelValue: (__VLS_ctx.flowVersion),
        size: "small",
        ...{ class: "version-select" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_21));
    __VLS_23.slots.default;
    for (const [version] of __VLS_getVForSourceType((__VLS_ctx.flowVersions))) {
        const __VLS_24 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
            key: (version),
            label: (version),
            value: (version),
        }));
        const __VLS_26 = __VLS_25({
            key: (version),
            label: (version),
            value: (version),
        }, ...__VLS_functionalComponentArgsRest(__VLS_25));
    }
    var __VLS_23;
    const __VLS_28 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
        ...{ 'onClick': {} },
        size: "small",
    }));
    const __VLS_30 = __VLS_29({
        ...{ 'onClick': {} },
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_29));
    let __VLS_32;
    let __VLS_33;
    let __VLS_34;
    const __VLS_35 = {
        onClick: (__VLS_ctx.saveFlow)
    };
    __VLS_31.slots.default;
    var __VLS_31;
    const __VLS_36 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
        ...{ 'onClick': {} },
        size: "small",
        type: "danger",
    }));
    const __VLS_38 = __VLS_37({
        ...{ 'onClick': {} },
        size: "small",
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_37));
    let __VLS_40;
    let __VLS_41;
    let __VLS_42;
    const __VLS_43 = {
        onClick: (__VLS_ctx.debugFlow)
    };
    __VLS_39.slots.default;
    var __VLS_39;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "canvas-wrap flow-canvas" },
});
for (const [node] of __VLS_getVForSourceType((__VLS_ctx.flowNodes))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.selectedNode = node;
            } },
        key: (node.id),
        ...{ class: "flow-node" },
        ...{ style: ({ top: `${node.y}px`, left: `${node.x}px`, borderColor: node.color }) },
        ...{ class: ({ 'is-selected': __VLS_ctx.selectedNode?.id === node.id }) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flow-node-title" },
        ...{ style: ({ background: node.color }) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (node.label);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flow-node-status" },
    });
    const __VLS_44 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
        size: "small",
        effect: "plain",
        type: (node.status === '成功' ? 'success' : node.status === '失败' ? 'danger' : 'info'),
    }));
    const __VLS_46 = __VLS_45({
        size: "small",
        effect: "plain",
        type: (node.status === '成功' ? 'success' : node.status === '失败' ? 'danger' : 'info'),
    }, ...__VLS_functionalComponentArgsRest(__VLS_45));
    __VLS_47.slots.default;
    (node.status);
    var __VLS_47;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
    ...{ class: "flow-svg" },
});
for (const [edge] of __VLS_getVForSourceType((__VLS_ctx.flowEdges))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.line)({
        key: (edge.id),
        x1: (edge.fromX),
        y1: (edge.fromY),
        x2: (edge.toX),
        y2: (edge.toY),
        stroke: "#A9B4C4",
        'stroke-width': "2",
        'stroke-dasharray': "6 4",
    });
}
var __VLS_19;
var __VLS_15;
const __VLS_48 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
    span: (5),
}));
const __VLS_50 = __VLS_49({
    span: (5),
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
__VLS_51.slots.default;
const __VLS_52 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
    ...{ class: "panel-card dashboard-card" },
    shadow: "never",
}));
const __VLS_54 = __VLS_53({
    ...{ class: "panel-card dashboard-card" },
    shadow: "never",
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
__VLS_55.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_55.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
}
if (__VLS_ctx.selectedNode) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "property-form" },
    });
    const __VLS_56 = {}.ElForm;
    /** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
    // @ts-ignore
    const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
        labelWidth: "70px",
        labelPosition: "left",
    }));
    const __VLS_58 = __VLS_57({
        labelWidth: "70px",
        labelPosition: "left",
    }, ...__VLS_functionalComponentArgsRest(__VLS_57));
    __VLS_59.slots.default;
    const __VLS_60 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
        label: "节点名称",
    }));
    const __VLS_62 = __VLS_61({
        label: "节点名称",
    }, ...__VLS_functionalComponentArgsRest(__VLS_61));
    __VLS_63.slots.default;
    const __VLS_64 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
        modelValue: (__VLS_ctx.selectedNode.label),
    }));
    const __VLS_66 = __VLS_65({
        modelValue: (__VLS_ctx.selectedNode.label),
    }, ...__VLS_functionalComponentArgsRest(__VLS_65));
    var __VLS_63;
    const __VLS_68 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
        label: "节点类型",
    }));
    const __VLS_70 = __VLS_69({
        label: "节点类型",
    }, ...__VLS_functionalComponentArgsRest(__VLS_69));
    __VLS_71.slots.default;
    const __VLS_72 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
        modelValue: (__VLS_ctx.selectedNode.typeLabel),
        disabled: true,
    }));
    const __VLS_74 = __VLS_73({
        modelValue: (__VLS_ctx.selectedNode.typeLabel),
        disabled: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_73));
    var __VLS_71;
    const __VLS_76 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
        label: "执行参数",
    }));
    const __VLS_78 = __VLS_77({
        label: "执行参数",
    }, ...__VLS_functionalComponentArgsRest(__VLS_77));
    __VLS_79.slots.default;
    const __VLS_80 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
        modelValue: (__VLS_ctx.selectedNode.params),
        type: "textarea",
        rows: (4),
    }));
    const __VLS_82 = __VLS_81({
        modelValue: (__VLS_ctx.selectedNode.params),
        type: "textarea",
        rows: (4),
    }, ...__VLS_functionalComponentArgsRest(__VLS_81));
    var __VLS_79;
    var __VLS_59;
    const __VLS_84 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
        ...{ 'onClick': {} },
        type: "danger",
        ...{ class: "w-full" },
    }));
    const __VLS_86 = __VLS_85({
        ...{ 'onClick': {} },
        type: "danger",
        ...{ class: "w-full" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_85));
    let __VLS_88;
    let __VLS_89;
    let __VLS_90;
    const __VLS_91 = {
        onClick: (__VLS_ctx.runNode)
    };
    __VLS_87.slots.default;
    var __VLS_87;
}
else {
    const __VLS_92 = {}.ElEmpty;
    /** @type {[typeof __VLS_components.ElEmpty, typeof __VLS_components.elEmpty, ]} */ ;
    // @ts-ignore
    const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
        description: "点击画布节点进行配置",
        imageSize: (80),
    }));
    const __VLS_94 = __VLS_93({
        description: "点击画布节点进行配置",
        imageSize: (80),
    }, ...__VLS_functionalComponentArgsRest(__VLS_93));
}
var __VLS_55;
var __VLS_51;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['standard-page']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['flow-node-palette']} */ ;
/** @type {__VLS_StyleScopedClasses['flow-palette-item']} */ ;
/** @type {__VLS_StyleScopedClasses['flow-palette-dot']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['version-select']} */ ;
/** @type {__VLS_StyleScopedClasses['canvas-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['flow-canvas']} */ ;
/** @type {__VLS_StyleScopedClasses['flow-node']} */ ;
/** @type {__VLS_StyleScopedClasses['flow-node-title']} */ ;
/** @type {__VLS_StyleScopedClasses['flow-node-status']} */ ;
/** @type {__VLS_StyleScopedClasses['flow-svg']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['property-form']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            nodeTypes: nodeTypes,
            flowVersions: flowVersions,
            flowVersion: flowVersion,
            selectedNode: selectedNode,
            flowNodes: flowNodes,
            flowEdges: flowEdges,
            saveFlow: saveFlow,
            debugFlow: debugFlow,
            runNode: runNode,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
