import { computed, reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { CircleCheckFilled, CircleCloseFilled, Coin, Document, Picture } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const structuredTypes = ['MySQL', 'Oracle', 'SQLServer', 'OceanBase', 'GaussDB', '虚谷', '金仓', '崖山', 'HBase'];
const semiStructuredTypes = ['MongoDB', 'Kafka', 'RabbitMQ', 'JSON/XML'];
const unstructuredTypes = ['文本/CSV', '图片/音视频'];
const groups = ['客运数据组', '建设数据组', '设备数据组', '财务数据组', '安全数据组'];
const owners = ['张三', '李四', '王五', '赵六', '孙七'];
const activeStep = ref(0);
const testState = ref('idle');
const isTesting = computed(() => testState.value === 'testing');
const progress = ref(0);
let timer;
const form = reactive({
    type: 'MySQL',
    name: '',
    host: '',
    port: '',
    database: '',
    username: '',
    password: '',
    groupName: '客运数据组',
    owner: '张三',
    description: '',
});
const runTest = () => {
    testState.value = 'testing';
    progress.value = 0;
    timer = window.setInterval(() => {
        progress.value += 10;
        if (progress.value >= 100) {
            window.clearInterval(timer);
            testState.value = form.host ? 'success' : 'fail';
        }
    }, 100);
};
const goList = () => {
    router.push('/datasource/list');
};
const reset = () => {
    activeStep.value = 0;
    testState.value = 'idle';
    Object.assign(form, {
        type: 'MySQL',
        name: '',
        host: '',
        port: '',
        database: '',
        username: '',
        password: '',
        description: '',
    });
    ElMessage.success('已重置注册表单');
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
}
const __VLS_4 = {}.ElSteps;
/** @type {[typeof __VLS_components.ElSteps, typeof __VLS_components.elSteps, typeof __VLS_components.ElSteps, typeof __VLS_components.elSteps, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    active: (__VLS_ctx.activeStep),
    alignCenter: true,
    finishStatus: "success",
    ...{ class: "register-steps" },
}));
const __VLS_6 = __VLS_5({
    active: (__VLS_ctx.activeStep),
    alignCenter: true,
    finishStatus: "success",
    ...{ class: "register-steps" },
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
__VLS_7.slots.default;
const __VLS_8 = {}.ElStep;
/** @type {[typeof __VLS_components.ElStep, typeof __VLS_components.elStep, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    title: "选择类型",
}));
const __VLS_10 = __VLS_9({
    title: "选择类型",
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
const __VLS_12 = {}.ElStep;
/** @type {[typeof __VLS_components.ElStep, typeof __VLS_components.elStep, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
    title: "配置参数",
}));
const __VLS_14 = __VLS_13({
    title: "配置参数",
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
const __VLS_16 = {}.ElStep;
/** @type {[typeof __VLS_components.ElStep, typeof __VLS_components.elStep, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    title: "测试连接",
}));
const __VLS_18 = __VLS_17({
    title: "测试连接",
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
const __VLS_20 = {}.ElStep;
/** @type {[typeof __VLS_components.ElStep, typeof __VLS_components.elStep, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
    title: "完成",
}));
const __VLS_22 = __VLS_21({
    title: "完成",
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
var __VLS_7;
if (__VLS_ctx.activeStep === 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "step-body" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "type-section" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "type-group-title" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "type-grid" },
    });
    for (const [type] of __VLS_getVForSourceType((__VLS_ctx.structuredTypes))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ onClick: (...[$event]) => {
                    if (!(__VLS_ctx.activeStep === 0))
                        return;
                    __VLS_ctx.form.type = type;
                } },
            key: (type),
            ...{ class: "type-card" },
            ...{ class: ({ 'is-active': __VLS_ctx.form.type === type }) },
        });
        const __VLS_24 = {}.ElIcon;
        /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
        // @ts-ignore
        const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
            size: (22),
        }));
        const __VLS_26 = __VLS_25({
            size: (22),
        }, ...__VLS_functionalComponentArgsRest(__VLS_25));
        __VLS_27.slots.default;
        const __VLS_28 = {}.Coin;
        /** @type {[typeof __VLS_components.Coin, ]} */ ;
        // @ts-ignore
        const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({}));
        const __VLS_30 = __VLS_29({}, ...__VLS_functionalComponentArgsRest(__VLS_29));
        var __VLS_27;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (type);
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "type-section" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "type-group-title" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "type-grid" },
    });
    for (const [type] of __VLS_getVForSourceType((__VLS_ctx.semiStructuredTypes))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ onClick: (...[$event]) => {
                    if (!(__VLS_ctx.activeStep === 0))
                        return;
                    __VLS_ctx.form.type = type;
                } },
            key: (type),
            ...{ class: "type-card" },
            ...{ class: ({ 'is-active': __VLS_ctx.form.type === type }) },
        });
        const __VLS_32 = {}.ElIcon;
        /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
        // @ts-ignore
        const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
            size: (22),
        }));
        const __VLS_34 = __VLS_33({
            size: (22),
        }, ...__VLS_functionalComponentArgsRest(__VLS_33));
        __VLS_35.slots.default;
        const __VLS_36 = {}.Document;
        /** @type {[typeof __VLS_components.Document, ]} */ ;
        // @ts-ignore
        const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({}));
        const __VLS_38 = __VLS_37({}, ...__VLS_functionalComponentArgsRest(__VLS_37));
        var __VLS_35;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (type);
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "type-section" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "type-group-title" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "type-grid" },
    });
    for (const [type] of __VLS_getVForSourceType((__VLS_ctx.unstructuredTypes))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ onClick: (...[$event]) => {
                    if (!(__VLS_ctx.activeStep === 0))
                        return;
                    __VLS_ctx.form.type = type;
                } },
            key: (type),
            ...{ class: "type-card" },
            ...{ class: ({ 'is-active': __VLS_ctx.form.type === type }) },
        });
        const __VLS_40 = {}.ElIcon;
        /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
        // @ts-ignore
        const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
            size: (22),
        }));
        const __VLS_42 = __VLS_41({
            size: (22),
        }, ...__VLS_functionalComponentArgsRest(__VLS_41));
        __VLS_43.slots.default;
        const __VLS_44 = {}.Picture;
        /** @type {[typeof __VLS_components.Picture, ]} */ ;
        // @ts-ignore
        const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({}));
        const __VLS_46 = __VLS_45({}, ...__VLS_functionalComponentArgsRest(__VLS_45));
        var __VLS_43;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (type);
    }
}
else if (__VLS_ctx.activeStep === 1) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "step-body" },
    });
    const __VLS_48 = {}.ElForm;
    /** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
    // @ts-ignore
    const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
        model: (__VLS_ctx.form),
        labelWidth: "120px",
        ...{ class: "register-form" },
    }));
    const __VLS_50 = __VLS_49({
        model: (__VLS_ctx.form),
        labelWidth: "120px",
        ...{ class: "register-form" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_49));
    __VLS_51.slots.default;
    const __VLS_52 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
        label: "数据源名称",
    }));
    const __VLS_54 = __VLS_53({
        label: "数据源名称",
    }, ...__VLS_functionalComponentArgsRest(__VLS_53));
    __VLS_55.slots.default;
    const __VLS_56 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
        modelValue: (__VLS_ctx.form.name),
        placeholder: "如：票务系统MySQL库",
    }));
    const __VLS_58 = __VLS_57({
        modelValue: (__VLS_ctx.form.name),
        placeholder: "如：票务系统MySQL库",
    }, ...__VLS_functionalComponentArgsRest(__VLS_57));
    var __VLS_55;
    const __VLS_60 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
        label: "主机地址",
    }));
    const __VLS_62 = __VLS_61({
        label: "主机地址",
    }, ...__VLS_functionalComponentArgsRest(__VLS_61));
    __VLS_63.slots.default;
    const __VLS_64 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
        modelValue: (__VLS_ctx.form.host),
        placeholder: "10.20.0.1",
    }));
    const __VLS_66 = __VLS_65({
        modelValue: (__VLS_ctx.form.host),
        placeholder: "10.20.0.1",
    }, ...__VLS_functionalComponentArgsRest(__VLS_65));
    var __VLS_63;
    const __VLS_68 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
        label: "端口",
    }));
    const __VLS_70 = __VLS_69({
        label: "端口",
    }, ...__VLS_functionalComponentArgsRest(__VLS_69));
    __VLS_71.slots.default;
    const __VLS_72 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
        modelValue: (__VLS_ctx.form.port),
        placeholder: "3306",
    }));
    const __VLS_74 = __VLS_73({
        modelValue: (__VLS_ctx.form.port),
        placeholder: "3306",
    }, ...__VLS_functionalComponentArgsRest(__VLS_73));
    var __VLS_71;
    const __VLS_76 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
        label: "数据库/库名",
    }));
    const __VLS_78 = __VLS_77({
        label: "数据库/库名",
    }, ...__VLS_functionalComponentArgsRest(__VLS_77));
    __VLS_79.slots.default;
    const __VLS_80 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
        modelValue: (__VLS_ctx.form.database),
        placeholder: "metro_ticket",
    }));
    const __VLS_82 = __VLS_81({
        modelValue: (__VLS_ctx.form.database),
        placeholder: "metro_ticket",
    }, ...__VLS_functionalComponentArgsRest(__VLS_81));
    var __VLS_79;
    const __VLS_84 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
        label: "用户名",
    }));
    const __VLS_86 = __VLS_85({
        label: "用户名",
    }, ...__VLS_functionalComponentArgsRest(__VLS_85));
    __VLS_87.slots.default;
    const __VLS_88 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
        modelValue: (__VLS_ctx.form.username),
        placeholder: "root",
    }));
    const __VLS_90 = __VLS_89({
        modelValue: (__VLS_ctx.form.username),
        placeholder: "root",
    }, ...__VLS_functionalComponentArgsRest(__VLS_89));
    var __VLS_87;
    const __VLS_92 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
        label: "密码",
    }));
    const __VLS_94 = __VLS_93({
        label: "密码",
    }, ...__VLS_functionalComponentArgsRest(__VLS_93));
    __VLS_95.slots.default;
    const __VLS_96 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
        modelValue: (__VLS_ctx.form.password),
        type: "password",
        showPassword: true,
        placeholder: "密码加密存储，界面掩码显示",
    }));
    const __VLS_98 = __VLS_97({
        modelValue: (__VLS_ctx.form.password),
        type: "password",
        showPassword: true,
        placeholder: "密码加密存储，界面掩码显示",
    }, ...__VLS_functionalComponentArgsRest(__VLS_97));
    var __VLS_95;
    const __VLS_100 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
        label: "所属分组",
    }));
    const __VLS_102 = __VLS_101({
        label: "所属分组",
    }, ...__VLS_functionalComponentArgsRest(__VLS_101));
    __VLS_103.slots.default;
    const __VLS_104 = {}.ElSelect;
    /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
    // @ts-ignore
    const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
        modelValue: (__VLS_ctx.form.groupName),
        ...{ class: "filter-select" },
    }));
    const __VLS_106 = __VLS_105({
        modelValue: (__VLS_ctx.form.groupName),
        ...{ class: "filter-select" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_105));
    __VLS_107.slots.default;
    for (const [group] of __VLS_getVForSourceType((__VLS_ctx.groups))) {
        const __VLS_108 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
            key: (group),
            label: (group),
            value: (group),
        }));
        const __VLS_110 = __VLS_109({
            key: (group),
            label: (group),
            value: (group),
        }, ...__VLS_functionalComponentArgsRest(__VLS_109));
    }
    var __VLS_107;
    var __VLS_103;
    const __VLS_112 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
        label: "负责人",
    }));
    const __VLS_114 = __VLS_113({
        label: "负责人",
    }, ...__VLS_functionalComponentArgsRest(__VLS_113));
    __VLS_115.slots.default;
    const __VLS_116 = {}.ElSelect;
    /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
    // @ts-ignore
    const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
        modelValue: (__VLS_ctx.form.owner),
        ...{ class: "filter-select" },
    }));
    const __VLS_118 = __VLS_117({
        modelValue: (__VLS_ctx.form.owner),
        ...{ class: "filter-select" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_117));
    __VLS_119.slots.default;
    for (const [owner] of __VLS_getVForSourceType((__VLS_ctx.owners))) {
        const __VLS_120 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({
            key: (owner),
            label: (owner),
            value: (owner),
        }));
        const __VLS_122 = __VLS_121({
            key: (owner),
            label: (owner),
            value: (owner),
        }, ...__VLS_functionalComponentArgsRest(__VLS_121));
    }
    var __VLS_119;
    var __VLS_115;
    const __VLS_124 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({
        label: "描述",
    }));
    const __VLS_126 = __VLS_125({
        label: "描述",
    }, ...__VLS_functionalComponentArgsRest(__VLS_125));
    __VLS_127.slots.default;
    const __VLS_128 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({
        modelValue: (__VLS_ctx.form.description),
        type: "textarea",
        rows: (2),
    }));
    const __VLS_130 = __VLS_129({
        modelValue: (__VLS_ctx.form.description),
        type: "textarea",
        rows: (2),
    }, ...__VLS_functionalComponentArgsRest(__VLS_129));
    var __VLS_127;
    var __VLS_51;
}
else if (__VLS_ctx.activeStep === 2) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "step-body test-body" },
    });
    if (__VLS_ctx.testState === 'idle') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
        const __VLS_132 = {}.ElEmpty;
        /** @type {[typeof __VLS_components.ElEmpty, typeof __VLS_components.elEmpty, ]} */ ;
        // @ts-ignore
        const __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132({
            description: "点击下方按钮开始测试连接",
            imageSize: (80),
        }));
        const __VLS_134 = __VLS_133({
            description: "点击下方按钮开始测试连接",
            imageSize: (80),
        }, ...__VLS_functionalComponentArgsRest(__VLS_133));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "test-actions" },
        });
        const __VLS_136 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_137 = __VLS_asFunctionalComponent(__VLS_136, new __VLS_136({
            ...{ 'onClick': {} },
            type: "danger",
            loading: (__VLS_ctx.isTesting),
        }));
        const __VLS_138 = __VLS_137({
            ...{ 'onClick': {} },
            type: "danger",
            loading: (__VLS_ctx.isTesting),
        }, ...__VLS_functionalComponentArgsRest(__VLS_137));
        let __VLS_140;
        let __VLS_141;
        let __VLS_142;
        const __VLS_143 = {
            onClick: (__VLS_ctx.runTest)
        };
        __VLS_139.slots.default;
        var __VLS_139;
    }
    else if (__VLS_ctx.isTesting) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "test-progress" },
        });
        const __VLS_144 = {}.ElProgress;
        /** @type {[typeof __VLS_components.ElProgress, typeof __VLS_components.elProgress, ]} */ ;
        // @ts-ignore
        const __VLS_145 = __VLS_asFunctionalComponent(__VLS_144, new __VLS_144({
            percentage: (__VLS_ctx.progress),
            status: "active",
            strokeWidth: (14),
        }));
        const __VLS_146 = __VLS_145({
            percentage: (__VLS_ctx.progress),
            status: "active",
            strokeWidth: (14),
        }, ...__VLS_functionalComponentArgsRest(__VLS_145));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: "test-tip" },
        });
        (__VLS_ctx.form.host);
        (__VLS_ctx.form.port);
    }
    else if (__VLS_ctx.testState === 'success') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "test-result test-result--success" },
        });
        const __VLS_148 = {}.ElIcon;
        /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
        // @ts-ignore
        const __VLS_149 = __VLS_asFunctionalComponent(__VLS_148, new __VLS_148({
            size: (48),
        }));
        const __VLS_150 = __VLS_149({
            size: (48),
        }, ...__VLS_functionalComponentArgsRest(__VLS_149));
        __VLS_151.slots.default;
        const __VLS_152 = {}.CircleCheckFilled;
        /** @type {[typeof __VLS_components.CircleCheckFilled, ]} */ ;
        // @ts-ignore
        const __VLS_153 = __VLS_asFunctionalComponent(__VLS_152, new __VLS_152({}));
        const __VLS_154 = __VLS_153({}, ...__VLS_functionalComponentArgsRest(__VLS_153));
        var __VLS_151;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "test-result-title" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "test-result-detail" },
        });
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "test-result test-result--fail" },
        });
        const __VLS_156 = {}.ElIcon;
        /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
        // @ts-ignore
        const __VLS_157 = __VLS_asFunctionalComponent(__VLS_156, new __VLS_156({
            size: (48),
        }));
        const __VLS_158 = __VLS_157({
            size: (48),
        }, ...__VLS_functionalComponentArgsRest(__VLS_157));
        __VLS_159.slots.default;
        const __VLS_160 = {}.CircleCloseFilled;
        /** @type {[typeof __VLS_components.CircleCloseFilled, ]} */ ;
        // @ts-ignore
        const __VLS_161 = __VLS_asFunctionalComponent(__VLS_160, new __VLS_160({}));
        const __VLS_162 = __VLS_161({}, ...__VLS_functionalComponentArgsRest(__VLS_161));
        var __VLS_159;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "test-result-title" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "test-result-detail" },
        });
        (__VLS_ctx.form.host);
        (__VLS_ctx.form.port);
    }
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "step-body finish-body" },
    });
    const __VLS_164 = {}.ElResult;
    /** @type {[typeof __VLS_components.ElResult, typeof __VLS_components.elResult, typeof __VLS_components.ElResult, typeof __VLS_components.elResult, ]} */ ;
    // @ts-ignore
    const __VLS_165 = __VLS_asFunctionalComponent(__VLS_164, new __VLS_164({
        icon: "success",
        title: "数据源注册完成",
        subTitle: "数据源已成功接入，可立即用于数据采集任务。",
    }));
    const __VLS_166 = __VLS_165({
        icon: "success",
        title: "数据源注册完成",
        subTitle: "数据源已成功接入，可立即用于数据采集任务。",
    }, ...__VLS_functionalComponentArgsRest(__VLS_165));
    __VLS_167.slots.default;
    {
        const { extra: __VLS_thisSlot } = __VLS_167.slots;
        const __VLS_168 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_169 = __VLS_asFunctionalComponent(__VLS_168, new __VLS_168({
            ...{ 'onClick': {} },
            type: "danger",
        }));
        const __VLS_170 = __VLS_169({
            ...{ 'onClick': {} },
            type: "danger",
        }, ...__VLS_functionalComponentArgsRest(__VLS_169));
        let __VLS_172;
        let __VLS_173;
        let __VLS_174;
        const __VLS_175 = {
            onClick: (__VLS_ctx.goList)
        };
        __VLS_171.slots.default;
        var __VLS_171;
        const __VLS_176 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_177 = __VLS_asFunctionalComponent(__VLS_176, new __VLS_176({
            ...{ 'onClick': {} },
        }));
        const __VLS_178 = __VLS_177({
            ...{ 'onClick': {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_177));
        let __VLS_180;
        let __VLS_181;
        let __VLS_182;
        const __VLS_183 = {
            onClick: (__VLS_ctx.reset)
        };
        __VLS_179.slots.default;
        var __VLS_179;
    }
    var __VLS_167;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "step-actions" },
});
if (__VLS_ctx.activeStep > 0 && __VLS_ctx.activeStep < 3) {
    const __VLS_184 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_185 = __VLS_asFunctionalComponent(__VLS_184, new __VLS_184({
        ...{ 'onClick': {} },
    }));
    const __VLS_186 = __VLS_185({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_185));
    let __VLS_188;
    let __VLS_189;
    let __VLS_190;
    const __VLS_191 = {
        onClick: (...[$event]) => {
            if (!(__VLS_ctx.activeStep > 0 && __VLS_ctx.activeStep < 3))
                return;
            __VLS_ctx.activeStep -= 1;
        }
    };
    __VLS_187.slots.default;
    var __VLS_187;
}
if (__VLS_ctx.activeStep < 2) {
    const __VLS_192 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_193 = __VLS_asFunctionalComponent(__VLS_192, new __VLS_192({
        ...{ 'onClick': {} },
        type: "danger",
    }));
    const __VLS_194 = __VLS_193({
        ...{ 'onClick': {} },
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_193));
    let __VLS_196;
    let __VLS_197;
    let __VLS_198;
    const __VLS_199 = {
        onClick: (...[$event]) => {
            if (!(__VLS_ctx.activeStep < 2))
                return;
            __VLS_ctx.activeStep += 1;
        }
    };
    __VLS_195.slots.default;
    var __VLS_195;
}
if (__VLS_ctx.activeStep === 2) {
    const __VLS_200 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_201 = __VLS_asFunctionalComponent(__VLS_200, new __VLS_200({
        ...{ 'onClick': {} },
        type: "danger",
        disabled: (__VLS_ctx.testState !== 'success'),
    }));
    const __VLS_202 = __VLS_201({
        ...{ 'onClick': {} },
        type: "danger",
        disabled: (__VLS_ctx.testState !== 'success'),
    }, ...__VLS_functionalComponentArgsRest(__VLS_201));
    let __VLS_204;
    let __VLS_205;
    let __VLS_206;
    const __VLS_207 = {
        onClick: (...[$event]) => {
            if (!(__VLS_ctx.activeStep === 2))
                return;
            __VLS_ctx.activeStep = 3;
        }
    };
    __VLS_203.slots.default;
    var __VLS_203;
}
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['standard-page']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['register-steps']} */ ;
/** @type {__VLS_StyleScopedClasses['step-body']} */ ;
/** @type {__VLS_StyleScopedClasses['type-section']} */ ;
/** @type {__VLS_StyleScopedClasses['type-group-title']} */ ;
/** @type {__VLS_StyleScopedClasses['type-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['type-card']} */ ;
/** @type {__VLS_StyleScopedClasses['type-section']} */ ;
/** @type {__VLS_StyleScopedClasses['type-group-title']} */ ;
/** @type {__VLS_StyleScopedClasses['type-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['type-card']} */ ;
/** @type {__VLS_StyleScopedClasses['type-section']} */ ;
/** @type {__VLS_StyleScopedClasses['type-group-title']} */ ;
/** @type {__VLS_StyleScopedClasses['type-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['type-card']} */ ;
/** @type {__VLS_StyleScopedClasses['step-body']} */ ;
/** @type {__VLS_StyleScopedClasses['register-form']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-select']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-select']} */ ;
/** @type {__VLS_StyleScopedClasses['step-body']} */ ;
/** @type {__VLS_StyleScopedClasses['test-body']} */ ;
/** @type {__VLS_StyleScopedClasses['test-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['test-progress']} */ ;
/** @type {__VLS_StyleScopedClasses['test-tip']} */ ;
/** @type {__VLS_StyleScopedClasses['test-result']} */ ;
/** @type {__VLS_StyleScopedClasses['test-result--success']} */ ;
/** @type {__VLS_StyleScopedClasses['test-result-title']} */ ;
/** @type {__VLS_StyleScopedClasses['test-result-detail']} */ ;
/** @type {__VLS_StyleScopedClasses['test-result']} */ ;
/** @type {__VLS_StyleScopedClasses['test-result--fail']} */ ;
/** @type {__VLS_StyleScopedClasses['test-result-title']} */ ;
/** @type {__VLS_StyleScopedClasses['test-result-detail']} */ ;
/** @type {__VLS_StyleScopedClasses['step-body']} */ ;
/** @type {__VLS_StyleScopedClasses['finish-body']} */ ;
/** @type {__VLS_StyleScopedClasses['step-actions']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            CircleCheckFilled: CircleCheckFilled,
            CircleCloseFilled: CircleCloseFilled,
            Coin: Coin,
            Document: Document,
            Picture: Picture,
            structuredTypes: structuredTypes,
            semiStructuredTypes: semiStructuredTypes,
            unstructuredTypes: unstructuredTypes,
            groups: groups,
            owners: owners,
            activeStep: activeStep,
            testState: testState,
            isTesting: isTesting,
            progress: progress,
            form: form,
            runTest: runTest,
            goList: goList,
            reset: reset,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
