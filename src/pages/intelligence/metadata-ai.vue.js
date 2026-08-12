import { reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { Clock, InfoFilled, MagicStick, Promotion } from '@element-plus/icons-vue';
import { completionHistory, missingMeta } from '@/mock/intelligence';
const wizardActive = ref(false);
const step = ref(1);
const historyVisible = ref(false);
const config = reactive({
    model: 'deepseek-v3',
    apiUrl: 'https://api.example.com/v1',
    apiKey: 'sk-****demo****',
    temperature: 0.2,
    maxTokens: 2048,
    prompt: '你是轨道交通数据治理领域的元数据补全专家。请基于以下上下文补全缺失元数据：\n1. 严格遵循数据命名规范（表名：业务域_主题_层级；字段：驼峰命名）；\n2. 字段描述需包含业务含义与约束；\n3. 识别维度/指标类型与代码含义；\n4. 输出 JSON 格式结果并附带置信度。',
});
const completionResults = ref([]);
const startWizard = () => {
    wizardActive.value = true;
    step.value = 1;
};
const runCompletion = () => {
    step.value = 3;
    completionResults.value = missingMeta.map((item, index) => ({
        id: item.id,
        tableName: item.tableName,
        missingType: item.missingType,
        result: item.suggest,
        confidence: 86 + ((index * 3) % 13),
        confirmed: true,
    }));
    ElMessage.success('AI 补全执行完成，请人工确认（Mock）');
};
const writeBack = () => {
    const confirmed = completionResults.value.filter((item) => item.confirmed).length;
    wizardActive.value = false;
    ElMessage.success(`已回写元数据中心 ${confirmed} 项补全结果（Mock）`);
};
const viewHistory = (row) => {
    ElMessage.info(`「${row.name}」追溯详情：成功 ${row.success}/${row.count}，已生成补全差异报告（Mock）`);
};
const confidenceColor = (value) => (value >= 90 ? '#00A854' : value >= 80 ? '#ED7B2F' : '#E34D59');
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
        icon: (__VLS_ctx.Clock),
    }));
    const __VLS_6 = __VLS_5({
        ...{ 'onClick': {} },
        icon: (__VLS_ctx.Clock),
    }, ...__VLS_functionalComponentArgsRest(__VLS_5));
    let __VLS_8;
    let __VLS_9;
    let __VLS_10;
    const __VLS_11 = {
        onClick: (...[$event]) => {
            __VLS_ctx.historyVisible = true;
        }
    };
    __VLS_7.slots.default;
    var __VLS_7;
    const __VLS_12 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
        ...{ 'onClick': {} },
        type: "danger",
        icon: (__VLS_ctx.MagicStick),
    }));
    const __VLS_14 = __VLS_13({
        ...{ 'onClick': {} },
        type: "danger",
        icon: (__VLS_ctx.MagicStick),
    }, ...__VLS_functionalComponentArgsRest(__VLS_13));
    let __VLS_16;
    let __VLS_17;
    let __VLS_18;
    const __VLS_19 = {
        onClick: (__VLS_ctx.startWizard)
    };
    __VLS_15.slots.default;
    var __VLS_15;
}
if (!__VLS_ctx.wizardActive) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "wizard-empty" },
    });
    const __VLS_20 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
        size: (56),
        color: "#DA251D",
    }));
    const __VLS_22 = __VLS_21({
        size: (56),
        color: "#DA251D",
    }, ...__VLS_functionalComponentArgsRest(__VLS_21));
    __VLS_23.slots.default;
    const __VLS_24 = {}.MagicStick;
    /** @type {[typeof __VLS_components.MagicStick, ]} */ ;
    // @ts-ignore
    const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({}));
    const __VLS_26 = __VLS_25({}, ...__VLS_functionalComponentArgsRest(__VLS_25));
    var __VLS_23;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "wizard-empty-title" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "wizard-empty-desc" },
    });
    const __VLS_28 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
        ...{ 'onClick': {} },
        type: "danger",
        size: "large",
        icon: (__VLS_ctx.MagicStick),
    }));
    const __VLS_30 = __VLS_29({
        ...{ 'onClick': {} },
        type: "danger",
        size: "large",
        icon: (__VLS_ctx.MagicStick),
    }, ...__VLS_functionalComponentArgsRest(__VLS_29));
    let __VLS_32;
    let __VLS_33;
    let __VLS_34;
    const __VLS_35 = {
        onClick: (__VLS_ctx.startWizard)
    };
    __VLS_31.slots.default;
    var __VLS_31;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "wizard-steps-preview" },
    });
    const __VLS_36 = {}.ElSteps;
    /** @type {[typeof __VLS_components.ElSteps, typeof __VLS_components.elSteps, typeof __VLS_components.ElSteps, typeof __VLS_components.elSteps, ]} */ ;
    // @ts-ignore
    const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
        active: (3),
        finishStatus: "success",
        simple: true,
    }));
    const __VLS_38 = __VLS_37({
        active: (3),
        finishStatus: "success",
        simple: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_37));
    __VLS_39.slots.default;
    const __VLS_40 = {}.ElStep;
    /** @type {[typeof __VLS_components.ElStep, typeof __VLS_components.elStep, ]} */ ;
    // @ts-ignore
    const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
        title: "补全前状态识别",
    }));
    const __VLS_42 = __VLS_41({
        title: "补全前状态识别",
    }, ...__VLS_functionalComponentArgsRest(__VLS_41));
    const __VLS_44 = {}.ElStep;
    /** @type {[typeof __VLS_components.ElStep, typeof __VLS_components.elStep, ]} */ ;
    // @ts-ignore
    const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
        title: "AI 触发配置",
    }));
    const __VLS_46 = __VLS_45({
        title: "AI 触发配置",
    }, ...__VLS_functionalComponentArgsRest(__VLS_45));
    const __VLS_48 = {}.ElStep;
    /** @type {[typeof __VLS_components.ElStep, typeof __VLS_components.elStep, ]} */ ;
    // @ts-ignore
    const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
        title: "补全结果确认",
    }));
    const __VLS_50 = __VLS_49({
        title: "补全结果确认",
    }, ...__VLS_functionalComponentArgsRest(__VLS_49));
    var __VLS_39;
}
else {
    const __VLS_52 = {}.ElSteps;
    /** @type {[typeof __VLS_components.ElSteps, typeof __VLS_components.elSteps, typeof __VLS_components.ElSteps, typeof __VLS_components.elSteps, ]} */ ;
    // @ts-ignore
    const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
        active: (__VLS_ctx.step),
        finishStatus: "success",
        alignCenter: true,
        ...{ class: "wizard-steps" },
    }));
    const __VLS_54 = __VLS_53({
        active: (__VLS_ctx.step),
        finishStatus: "success",
        alignCenter: true,
        ...{ class: "wizard-steps" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_53));
    __VLS_55.slots.default;
    const __VLS_56 = {}.ElStep;
    /** @type {[typeof __VLS_components.ElStep, typeof __VLS_components.elStep, ]} */ ;
    // @ts-ignore
    const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
        title: "补全前状态识别",
        description: "识别元数据缺失",
    }));
    const __VLS_58 = __VLS_57({
        title: "补全前状态识别",
        description: "识别元数据缺失",
    }, ...__VLS_functionalComponentArgsRest(__VLS_57));
    const __VLS_60 = {}.ElStep;
    /** @type {[typeof __VLS_components.ElStep, typeof __VLS_components.elStep, ]} */ ;
    // @ts-ignore
    const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
        title: "AI 触发配置",
        description: "模型与提示词",
    }));
    const __VLS_62 = __VLS_61({
        title: "AI 触发配置",
        description: "模型与提示词",
    }, ...__VLS_functionalComponentArgsRest(__VLS_61));
    const __VLS_64 = {}.ElStep;
    /** @type {[typeof __VLS_components.ElStep, typeof __VLS_components.elStep, ]} */ ;
    // @ts-ignore
    const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
        title: "补全结果确认",
        description: "人工确认与回写",
    }));
    const __VLS_66 = __VLS_65({
        title: "补全结果确认",
        description: "人工确认与回写",
    }, ...__VLS_functionalComponentArgsRest(__VLS_65));
    var __VLS_55;
    if (__VLS_ctx.step === 1) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "wizard-panel" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "section-title mb-8" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "missing-stats" },
        });
        const __VLS_68 = {}.ElTag;
        /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
        // @ts-ignore
        const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
            type: "danger",
            effect: "dark",
        }));
        const __VLS_70 = __VLS_69({
            type: "danger",
            effect: "dark",
        }, ...__VLS_functionalComponentArgsRest(__VLS_69));
        __VLS_71.slots.default;
        var __VLS_71;
        const __VLS_72 = {}.ElTag;
        /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
        // @ts-ignore
        const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
            type: "warning",
            effect: "dark",
        }));
        const __VLS_74 = __VLS_73({
            type: "warning",
            effect: "dark",
        }, ...__VLS_functionalComponentArgsRest(__VLS_73));
        __VLS_75.slots.default;
        var __VLS_75;
        const __VLS_76 = {}.ElTag;
        /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
        // @ts-ignore
        const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
            type: "primary",
            effect: "plain",
        }));
        const __VLS_78 = __VLS_77({
            type: "primary",
            effect: "plain",
        }, ...__VLS_functionalComponentArgsRest(__VLS_77));
        __VLS_79.slots.default;
        var __VLS_79;
        const __VLS_80 = {}.ElTable;
        /** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
        // @ts-ignore
        const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
            data: (__VLS_ctx.missingMeta),
            stripe: true,
            size: "small",
            ...{ class: "mt-12" },
        }));
        const __VLS_82 = __VLS_81({
            data: (__VLS_ctx.missingMeta),
            stripe: true,
            size: "small",
            ...{ class: "mt-12" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_81));
        __VLS_83.slots.default;
        const __VLS_84 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
            prop: "tableName",
            label: "表名",
            minWidth: "150",
        }));
        const __VLS_86 = __VLS_85({
            prop: "tableName",
            label: "表名",
            minWidth: "150",
        }, ...__VLS_functionalComponentArgsRest(__VLS_85));
        const __VLS_88 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
            prop: "fieldName",
            label: "字段名",
            width: "110",
        }));
        const __VLS_90 = __VLS_89({
            prop: "fieldName",
            label: "字段名",
            width: "110",
        }, ...__VLS_functionalComponentArgsRest(__VLS_89));
        __VLS_91.slots.default;
        {
            const { default: __VLS_thisSlot } = __VLS_91.slots;
            const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
            if (row.fieldName) {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
                (row.fieldName);
            }
            else {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                    ...{ class: "dep-text" },
                });
            }
        }
        var __VLS_91;
        const __VLS_92 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
            label: "缺失类型",
            width: "130",
        }));
        const __VLS_94 = __VLS_93({
            label: "缺失类型",
            width: "130",
        }, ...__VLS_functionalComponentArgsRest(__VLS_93));
        __VLS_95.slots.default;
        {
            const { default: __VLS_thisSlot } = __VLS_95.slots;
            const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
            const __VLS_96 = {}.ElTag;
            /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
            // @ts-ignore
            const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
                size: "small",
                effect: "plain",
            }));
            const __VLS_98 = __VLS_97({
                size: "small",
                effect: "plain",
            }, ...__VLS_functionalComponentArgsRest(__VLS_97));
            __VLS_99.slots.default;
            (row.missingType);
            var __VLS_99;
        }
        var __VLS_95;
        const __VLS_100 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
            prop: "current",
            label: "当前值",
            width: "110",
        }));
        const __VLS_102 = __VLS_101({
            prop: "current",
            label: "当前值",
            width: "110",
        }, ...__VLS_functionalComponentArgsRest(__VLS_101));
        __VLS_103.slots.default;
        {
            const { default: __VLS_thisSlot } = __VLS_103.slots;
            const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
            if (row.current) {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                    ...{ class: "dep-text" },
                });
                (row.current);
            }
            else {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                    ...{ class: "missing-mark" },
                });
            }
        }
        var __VLS_103;
        const __VLS_104 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
            prop: "suggest",
            label: "AI 建议补全值",
            minWidth: "200",
        }));
        const __VLS_106 = __VLS_105({
            prop: "suggest",
            label: "AI 建议补全值",
            minWidth: "200",
        }, ...__VLS_functionalComponentArgsRest(__VLS_105));
        __VLS_107.slots.default;
        {
            const { default: __VLS_thisSlot } = __VLS_107.slots;
            const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "suggest-value" },
            });
            (row.suggest);
        }
        var __VLS_107;
        var __VLS_83;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "wizard-actions" },
        });
        const __VLS_108 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
            ...{ 'onClick': {} },
            type: "danger",
        }));
        const __VLS_110 = __VLS_109({
            ...{ 'onClick': {} },
            type: "danger",
        }, ...__VLS_functionalComponentArgsRest(__VLS_109));
        let __VLS_112;
        let __VLS_113;
        let __VLS_114;
        const __VLS_115 = {
            onClick: (...[$event]) => {
                if (!!(!__VLS_ctx.wizardActive))
                    return;
                if (!(__VLS_ctx.step === 1))
                    return;
                __VLS_ctx.step = 2;
            }
        };
        __VLS_111.slots.default;
        var __VLS_111;
    }
    if (__VLS_ctx.step === 2) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "wizard-panel" },
        });
        const __VLS_116 = {}.ElRow;
        /** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
        // @ts-ignore
        const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
            gutter: (16),
        }));
        const __VLS_118 = __VLS_117({
            gutter: (16),
        }, ...__VLS_functionalComponentArgsRest(__VLS_117));
        __VLS_119.slots.default;
        const __VLS_120 = {}.ElCol;
        /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
        // @ts-ignore
        const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({
            span: (10),
        }));
        const __VLS_122 = __VLS_121({
            span: (10),
        }, ...__VLS_functionalComponentArgsRest(__VLS_121));
        __VLS_123.slots.default;
        const __VLS_124 = {}.ElForm;
        /** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
        // @ts-ignore
        const __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({
            labelWidth: "100px",
        }));
        const __VLS_126 = __VLS_125({
            labelWidth: "100px",
        }, ...__VLS_functionalComponentArgsRest(__VLS_125));
        __VLS_127.slots.default;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "section-title mb-8" },
        });
        const __VLS_128 = {}.ElFormItem;
        /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
        // @ts-ignore
        const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({
            label: "模型选择",
        }));
        const __VLS_130 = __VLS_129({
            label: "模型选择",
        }, ...__VLS_functionalComponentArgsRest(__VLS_129));
        __VLS_131.slots.default;
        const __VLS_132 = {}.ElSelect;
        /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
        // @ts-ignore
        const __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132({
            modelValue: (__VLS_ctx.config.model),
            ...{ class: "w-full" },
        }));
        const __VLS_134 = __VLS_133({
            modelValue: (__VLS_ctx.config.model),
            ...{ class: "w-full" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_133));
        __VLS_135.slots.default;
        const __VLS_136 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_137 = __VLS_asFunctionalComponent(__VLS_136, new __VLS_136({
            label: "deepseek-v3",
            value: "deepseek-v3",
        }));
        const __VLS_138 = __VLS_137({
            label: "deepseek-v3",
            value: "deepseek-v3",
        }, ...__VLS_functionalComponentArgsRest(__VLS_137));
        const __VLS_140 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_141 = __VLS_asFunctionalComponent(__VLS_140, new __VLS_140({
            label: "qwen-max",
            value: "qwen-max",
        }));
        const __VLS_142 = __VLS_141({
            label: "qwen-max",
            value: "qwen-max",
        }, ...__VLS_functionalComponentArgsRest(__VLS_141));
        const __VLS_144 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_145 = __VLS_asFunctionalComponent(__VLS_144, new __VLS_144({
            label: "GLM-4",
            value: "GLM-4",
        }));
        const __VLS_146 = __VLS_145({
            label: "GLM-4",
            value: "GLM-4",
        }, ...__VLS_functionalComponentArgsRest(__VLS_145));
        var __VLS_135;
        var __VLS_131;
        const __VLS_148 = {}.ElFormItem;
        /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
        // @ts-ignore
        const __VLS_149 = __VLS_asFunctionalComponent(__VLS_148, new __VLS_148({
            label: "API 地址",
        }));
        const __VLS_150 = __VLS_149({
            label: "API 地址",
        }, ...__VLS_functionalComponentArgsRest(__VLS_149));
        __VLS_151.slots.default;
        const __VLS_152 = {}.ElInput;
        /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
        // @ts-ignore
        const __VLS_153 = __VLS_asFunctionalComponent(__VLS_152, new __VLS_152({
            modelValue: (__VLS_ctx.config.apiUrl),
            placeholder: "https://api.example.com/v1",
        }));
        const __VLS_154 = __VLS_153({
            modelValue: (__VLS_ctx.config.apiUrl),
            placeholder: "https://api.example.com/v1",
        }, ...__VLS_functionalComponentArgsRest(__VLS_153));
        var __VLS_151;
        const __VLS_156 = {}.ElFormItem;
        /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
        // @ts-ignore
        const __VLS_157 = __VLS_asFunctionalComponent(__VLS_156, new __VLS_156({
            label: "API Key",
        }));
        const __VLS_158 = __VLS_157({
            label: "API Key",
        }, ...__VLS_functionalComponentArgsRest(__VLS_157));
        __VLS_159.slots.default;
        const __VLS_160 = {}.ElInput;
        /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
        // @ts-ignore
        const __VLS_161 = __VLS_asFunctionalComponent(__VLS_160, new __VLS_160({
            modelValue: (__VLS_ctx.config.apiKey),
            type: "password",
            showPassword: true,
            placeholder: "sk-****",
        }));
        const __VLS_162 = __VLS_161({
            modelValue: (__VLS_ctx.config.apiKey),
            type: "password",
            showPassword: true,
            placeholder: "sk-****",
        }, ...__VLS_functionalComponentArgsRest(__VLS_161));
        var __VLS_159;
        const __VLS_164 = {}.ElFormItem;
        /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
        // @ts-ignore
        const __VLS_165 = __VLS_asFunctionalComponent(__VLS_164, new __VLS_164({
            label: "温度参数",
        }));
        const __VLS_166 = __VLS_165({
            label: "温度参数",
        }, ...__VLS_functionalComponentArgsRest(__VLS_165));
        __VLS_167.slots.default;
        const __VLS_168 = {}.ElSlider;
        /** @type {[typeof __VLS_components.ElSlider, typeof __VLS_components.elSlider, ]} */ ;
        // @ts-ignore
        const __VLS_169 = __VLS_asFunctionalComponent(__VLS_168, new __VLS_168({
            modelValue: (__VLS_ctx.config.temperature),
            min: (0),
            max: (1),
            step: (0.1),
        }));
        const __VLS_170 = __VLS_169({
            modelValue: (__VLS_ctx.config.temperature),
            min: (0),
            max: (1),
            step: (0.1),
        }, ...__VLS_functionalComponentArgsRest(__VLS_169));
        var __VLS_167;
        const __VLS_172 = {}.ElFormItem;
        /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
        // @ts-ignore
        const __VLS_173 = __VLS_asFunctionalComponent(__VLS_172, new __VLS_172({
            label: "最大 Token",
        }));
        const __VLS_174 = __VLS_173({
            label: "最大 Token",
        }, ...__VLS_functionalComponentArgsRest(__VLS_173));
        __VLS_175.slots.default;
        const __VLS_176 = {}.ElInputNumber;
        /** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
        // @ts-ignore
        const __VLS_177 = __VLS_asFunctionalComponent(__VLS_176, new __VLS_176({
            modelValue: (__VLS_ctx.config.maxTokens),
            min: (256),
            max: (8192),
            step: (256),
        }));
        const __VLS_178 = __VLS_177({
            modelValue: (__VLS_ctx.config.maxTokens),
            min: (256),
            max: (8192),
            step: (256),
        }, ...__VLS_functionalComponentArgsRest(__VLS_177));
        var __VLS_175;
        var __VLS_127;
        var __VLS_123;
        const __VLS_180 = {}.ElCol;
        /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
        // @ts-ignore
        const __VLS_181 = __VLS_asFunctionalComponent(__VLS_180, new __VLS_180({
            span: (14),
        }));
        const __VLS_182 = __VLS_181({
            span: (14),
        }, ...__VLS_functionalComponentArgsRest(__VLS_181));
        __VLS_183.slots.default;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "section-title mb-8" },
        });
        const __VLS_184 = {}.ElInput;
        /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
        // @ts-ignore
        const __VLS_185 = __VLS_asFunctionalComponent(__VLS_184, new __VLS_184({
            modelValue: (__VLS_ctx.config.prompt),
            type: "textarea",
            rows: (10),
        }));
        const __VLS_186 = __VLS_185({
            modelValue: (__VLS_ctx.config.prompt),
            type: "textarea",
            rows: (10),
        }, ...__VLS_functionalComponentArgsRest(__VLS_185));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "prompt-note" },
        });
        const __VLS_188 = {}.ElIcon;
        /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
        // @ts-ignore
        const __VLS_189 = __VLS_asFunctionalComponent(__VLS_188, new __VLS_188({
            size: (14),
        }));
        const __VLS_190 = __VLS_189({
            size: (14),
        }, ...__VLS_functionalComponentArgsRest(__VLS_189));
        __VLS_191.slots.default;
        const __VLS_192 = {}.InfoFilled;
        /** @type {[typeof __VLS_components.InfoFilled, ]} */ ;
        // @ts-ignore
        const __VLS_193 = __VLS_asFunctionalComponent(__VLS_192, new __VLS_192({}));
        const __VLS_194 = __VLS_193({}, ...__VLS_functionalComponentArgsRest(__VLS_193));
        var __VLS_191;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "section-title mt-16 mb-8" },
        });
        const __VLS_196 = {}.ElDescriptions;
        /** @type {[typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, ]} */ ;
        // @ts-ignore
        const __VLS_197 = __VLS_asFunctionalComponent(__VLS_196, new __VLS_196({
            column: (3),
            border: true,
            size: "small",
        }));
        const __VLS_198 = __VLS_197({
            column: (3),
            border: true,
            size: "small",
        }, ...__VLS_functionalComponentArgsRest(__VLS_197));
        __VLS_199.slots.default;
        const __VLS_200 = {}.ElDescriptionsItem;
        /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
        // @ts-ignore
        const __VLS_201 = __VLS_asFunctionalComponent(__VLS_200, new __VLS_200({
            label: "历史样本",
        }));
        const __VLS_202 = __VLS_201({
            label: "历史样本",
        }, ...__VLS_functionalComponentArgsRest(__VLS_201));
        __VLS_203.slots.default;
        var __VLS_203;
        const __VLS_204 = {}.ElDescriptionsItem;
        /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
        // @ts-ignore
        const __VLS_205 = __VLS_asFunctionalComponent(__VLS_204, new __VLS_204({
            label: "业务域",
        }));
        const __VLS_206 = __VLS_205({
            label: "业务域",
        }, ...__VLS_functionalComponentArgsRest(__VLS_205));
        __VLS_207.slots.default;
        var __VLS_207;
        const __VLS_208 = {}.ElDescriptionsItem;
        /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
        // @ts-ignore
        const __VLS_209 = __VLS_asFunctionalComponent(__VLS_208, new __VLS_208({
            label: "学习准确率",
        }));
        const __VLS_210 = __VLS_209({
            label: "学习准确率",
        }, ...__VLS_functionalComponentArgsRest(__VLS_209));
        __VLS_211.slots.default;
        var __VLS_211;
        var __VLS_199;
        var __VLS_183;
        var __VLS_119;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "wizard-actions" },
        });
        const __VLS_212 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_213 = __VLS_asFunctionalComponent(__VLS_212, new __VLS_212({
            ...{ 'onClick': {} },
        }));
        const __VLS_214 = __VLS_213({
            ...{ 'onClick': {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_213));
        let __VLS_216;
        let __VLS_217;
        let __VLS_218;
        const __VLS_219 = {
            onClick: (...[$event]) => {
                if (!!(!__VLS_ctx.wizardActive))
                    return;
                if (!(__VLS_ctx.step === 2))
                    return;
                __VLS_ctx.step = 1;
            }
        };
        __VLS_215.slots.default;
        var __VLS_215;
        const __VLS_220 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_221 = __VLS_asFunctionalComponent(__VLS_220, new __VLS_220({
            ...{ 'onClick': {} },
            type: "danger",
        }));
        const __VLS_222 = __VLS_221({
            ...{ 'onClick': {} },
            type: "danger",
        }, ...__VLS_functionalComponentArgsRest(__VLS_221));
        let __VLS_224;
        let __VLS_225;
        let __VLS_226;
        const __VLS_227 = {
            onClick: (__VLS_ctx.runCompletion)
        };
        __VLS_223.slots.default;
        var __VLS_223;
    }
    if (__VLS_ctx.step === 3) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "wizard-panel" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "section-title mb-8" },
        });
        (__VLS_ctx.completionResults.length);
        const __VLS_228 = {}.ElAlert;
        /** @type {[typeof __VLS_components.ElAlert, typeof __VLS_components.elAlert, ]} */ ;
        // @ts-ignore
        const __VLS_229 = __VLS_asFunctionalComponent(__VLS_228, new __VLS_228({
            title: "AI 已基于历史元数据完成补全，请人工确认后一键回写元数据中心。",
            type: "success",
            closable: (false),
            ...{ class: "mb-16" },
        }));
        const __VLS_230 = __VLS_229({
            title: "AI 已基于历史元数据完成补全，请人工确认后一键回写元数据中心。",
            type: "success",
            closable: (false),
            ...{ class: "mb-16" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_229));
        const __VLS_232 = {}.ElTable;
        /** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
        // @ts-ignore
        const __VLS_233 = __VLS_asFunctionalComponent(__VLS_232, new __VLS_232({
            data: (__VLS_ctx.completionResults),
            stripe: true,
            size: "small",
        }));
        const __VLS_234 = __VLS_233({
            data: (__VLS_ctx.completionResults),
            stripe: true,
            size: "small",
        }, ...__VLS_functionalComponentArgsRest(__VLS_233));
        __VLS_235.slots.default;
        const __VLS_236 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_237 = __VLS_asFunctionalComponent(__VLS_236, new __VLS_236({
            prop: "tableName",
            label: "表名",
            minWidth: "150",
        }));
        const __VLS_238 = __VLS_237({
            prop: "tableName",
            label: "表名",
            minWidth: "150",
        }, ...__VLS_functionalComponentArgsRest(__VLS_237));
        const __VLS_240 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_241 = __VLS_asFunctionalComponent(__VLS_240, new __VLS_240({
            prop: "missingType",
            label: "补全类型",
            width: "130",
        }));
        const __VLS_242 = __VLS_241({
            prop: "missingType",
            label: "补全类型",
            width: "130",
        }, ...__VLS_functionalComponentArgsRest(__VLS_241));
        __VLS_243.slots.default;
        {
            const { default: __VLS_thisSlot } = __VLS_243.slots;
            const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
            const __VLS_244 = {}.ElTag;
            /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
            // @ts-ignore
            const __VLS_245 = __VLS_asFunctionalComponent(__VLS_244, new __VLS_244({
                size: "small",
                effect: "plain",
            }));
            const __VLS_246 = __VLS_245({
                size: "small",
                effect: "plain",
            }, ...__VLS_functionalComponentArgsRest(__VLS_245));
            __VLS_247.slots.default;
            (row.missingType);
            var __VLS_247;
        }
        var __VLS_243;
        const __VLS_248 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_249 = __VLS_asFunctionalComponent(__VLS_248, new __VLS_248({
            label: "AI 补全结果",
            minWidth: "180",
        }));
        const __VLS_250 = __VLS_249({
            label: "AI 补全结果",
            minWidth: "180",
        }, ...__VLS_functionalComponentArgsRest(__VLS_249));
        __VLS_251.slots.default;
        {
            const { default: __VLS_thisSlot } = __VLS_251.slots;
            const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
            const __VLS_252 = {}.ElInput;
            /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
            // @ts-ignore
            const __VLS_253 = __VLS_asFunctionalComponent(__VLS_252, new __VLS_252({
                modelValue: (row.result),
                size: "small",
            }));
            const __VLS_254 = __VLS_253({
                modelValue: (row.result),
                size: "small",
            }, ...__VLS_functionalComponentArgsRest(__VLS_253));
        }
        var __VLS_251;
        const __VLS_256 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_257 = __VLS_asFunctionalComponent(__VLS_256, new __VLS_256({
            label: "置信度",
            width: "110",
        }));
        const __VLS_258 = __VLS_257({
            label: "置信度",
            width: "110",
        }, ...__VLS_functionalComponentArgsRest(__VLS_257));
        __VLS_259.slots.default;
        {
            const { default: __VLS_thisSlot } = __VLS_259.slots;
            const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ style: ({ color: __VLS_ctx.confidenceColor(row.confidence) }) },
            });
            (row.confidence);
        }
        var __VLS_259;
        const __VLS_260 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_261 = __VLS_asFunctionalComponent(__VLS_260, new __VLS_260({
            label: "确认",
            width: "110",
            align: "center",
        }));
        const __VLS_262 = __VLS_261({
            label: "确认",
            width: "110",
            align: "center",
        }, ...__VLS_functionalComponentArgsRest(__VLS_261));
        __VLS_263.slots.default;
        {
            const { default: __VLS_thisSlot } = __VLS_263.slots;
            const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
            const __VLS_264 = {}.ElSwitch;
            /** @type {[typeof __VLS_components.ElSwitch, typeof __VLS_components.elSwitch, ]} */ ;
            // @ts-ignore
            const __VLS_265 = __VLS_asFunctionalComponent(__VLS_264, new __VLS_264({
                modelValue: (row.confirmed),
                activeText: "确认",
            }));
            const __VLS_266 = __VLS_265({
                modelValue: (row.confirmed),
                activeText: "确认",
            }, ...__VLS_functionalComponentArgsRest(__VLS_265));
        }
        var __VLS_263;
        var __VLS_235;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "wizard-actions" },
        });
        const __VLS_268 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_269 = __VLS_asFunctionalComponent(__VLS_268, new __VLS_268({
            ...{ 'onClick': {} },
        }));
        const __VLS_270 = __VLS_269({
            ...{ 'onClick': {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_269));
        let __VLS_272;
        let __VLS_273;
        let __VLS_274;
        const __VLS_275 = {
            onClick: (...[$event]) => {
                if (!!(!__VLS_ctx.wizardActive))
                    return;
                if (!(__VLS_ctx.step === 3))
                    return;
                __VLS_ctx.step = 2;
            }
        };
        __VLS_271.slots.default;
        var __VLS_271;
        const __VLS_276 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_277 = __VLS_asFunctionalComponent(__VLS_276, new __VLS_276({
            ...{ 'onClick': {} },
            type: "danger",
            icon: (__VLS_ctx.Promotion),
        }));
        const __VLS_278 = __VLS_277({
            ...{ 'onClick': {} },
            type: "danger",
            icon: (__VLS_ctx.Promotion),
        }, ...__VLS_functionalComponentArgsRest(__VLS_277));
        let __VLS_280;
        let __VLS_281;
        let __VLS_282;
        const __VLS_283 = {
            onClick: (__VLS_ctx.writeBack)
        };
        __VLS_279.slots.default;
        var __VLS_279;
    }
}
var __VLS_3;
const __VLS_284 = {}.ElDrawer;
/** @type {[typeof __VLS_components.ElDrawer, typeof __VLS_components.elDrawer, typeof __VLS_components.ElDrawer, typeof __VLS_components.elDrawer, ]} */ ;
// @ts-ignore
const __VLS_285 = __VLS_asFunctionalComponent(__VLS_284, new __VLS_284({
    modelValue: (__VLS_ctx.historyVisible),
    title: "补全历史记录",
    size: "560px",
}));
const __VLS_286 = __VLS_285({
    modelValue: (__VLS_ctx.historyVisible),
    title: "补全历史记录",
    size: "560px",
}, ...__VLS_functionalComponentArgsRest(__VLS_285));
__VLS_287.slots.default;
const __VLS_288 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_289 = __VLS_asFunctionalComponent(__VLS_288, new __VLS_288({
    data: (__VLS_ctx.completionHistory),
    stripe: true,
    size: "small",
}));
const __VLS_290 = __VLS_289({
    data: (__VLS_ctx.completionHistory),
    stripe: true,
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_289));
__VLS_291.slots.default;
const __VLS_292 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_293 = __VLS_asFunctionalComponent(__VLS_292, new __VLS_292({
    prop: "name",
    label: "任务",
    minWidth: "170",
}));
const __VLS_294 = __VLS_293({
    prop: "name",
    label: "任务",
    minWidth: "170",
}, ...__VLS_functionalComponentArgsRest(__VLS_293));
const __VLS_296 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_297 = __VLS_asFunctionalComponent(__VLS_296, new __VLS_296({
    prop: "count",
    label: "识别数",
    width: "80",
    align: "center",
}));
const __VLS_298 = __VLS_297({
    prop: "count",
    label: "识别数",
    width: "80",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_297));
const __VLS_300 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_301 = __VLS_asFunctionalComponent(__VLS_300, new __VLS_300({
    prop: "success",
    label: "补全数",
    width: "80",
    align: "center",
}));
const __VLS_302 = __VLS_301({
    prop: "success",
    label: "补全数",
    width: "80",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_301));
const __VLS_304 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_305 = __VLS_asFunctionalComponent(__VLS_304, new __VLS_304({
    prop: "time",
    label: "时间",
    width: "150",
}));
const __VLS_306 = __VLS_305({
    prop: "time",
    label: "时间",
    width: "150",
}, ...__VLS_functionalComponentArgsRest(__VLS_305));
const __VLS_308 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_309 = __VLS_asFunctionalComponent(__VLS_308, new __VLS_308({
    label: "操作",
    width: "80",
}));
const __VLS_310 = __VLS_309({
    label: "操作",
    width: "80",
}, ...__VLS_functionalComponentArgsRest(__VLS_309));
__VLS_311.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_311.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_312 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_313 = __VLS_asFunctionalComponent(__VLS_312, new __VLS_312({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }));
    const __VLS_314 = __VLS_313({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_313));
    let __VLS_316;
    let __VLS_317;
    let __VLS_318;
    const __VLS_319 = {
        onClick: (...[$event]) => {
            __VLS_ctx.viewHistory(row);
        }
    };
    __VLS_315.slots.default;
    var __VLS_315;
}
var __VLS_311;
var __VLS_291;
var __VLS_287;
/** @type {__VLS_StyleScopedClasses['standard-page']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['wizard-empty']} */ ;
/** @type {__VLS_StyleScopedClasses['wizard-empty-title']} */ ;
/** @type {__VLS_StyleScopedClasses['wizard-empty-desc']} */ ;
/** @type {__VLS_StyleScopedClasses['wizard-steps-preview']} */ ;
/** @type {__VLS_StyleScopedClasses['wizard-steps']} */ ;
/** @type {__VLS_StyleScopedClasses['wizard-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
/** @type {__VLS_StyleScopedClasses['missing-stats']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-12']} */ ;
/** @type {__VLS_StyleScopedClasses['dep-text']} */ ;
/** @type {__VLS_StyleScopedClasses['dep-text']} */ ;
/** @type {__VLS_StyleScopedClasses['missing-mark']} */ ;
/** @type {__VLS_StyleScopedClasses['suggest-value']} */ ;
/** @type {__VLS_StyleScopedClasses['wizard-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['wizard-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
/** @type {__VLS_StyleScopedClasses['prompt-note']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
/** @type {__VLS_StyleScopedClasses['wizard-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['wizard-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
/** @type {__VLS_StyleScopedClasses['wizard-actions']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Clock: Clock,
            InfoFilled: InfoFilled,
            MagicStick: MagicStick,
            Promotion: Promotion,
            completionHistory: completionHistory,
            missingMeta: missingMeta,
            wizardActive: wizardActive,
            step: step,
            historyVisible: historyVisible,
            config: config,
            completionResults: completionResults,
            startWizard: startWizard,
            runCompletion: runCompletion,
            writeBack: writeBack,
            viewHistory: viewHistory,
            confidenceColor: confidenceColor,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
