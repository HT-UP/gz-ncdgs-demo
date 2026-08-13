import { computed, ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { DataAnalysis, Notification, Search } from '@element-plus/icons-vue';
const models = ref([
    { id: 1, name: '票务运营域逻辑模型', dom: '客运票务', tables: 56, lastChange: '2026-08-10' },
    { id: 2, name: '旅客服务域逻辑模型', dom: '旅客服务', tables: 38, lastChange: '2026-08-05' },
    { id: 3, name: '设备运维域物理模型', dom: '设备运维', tables: 64, lastChange: '2026-07-30' },
    { id: 4, name: '财务共享域逻辑模型', dom: '财务共享', tables: 42, lastChange: '2026-07-22' },
    { id: 5, name: '调度指挥域物理模型', dom: '运营调度', tables: 47, lastChange: '2026-07-15' },
]);
const modelKeyword = ref('');
const filteredModels = computed(() => models.value.filter((m) => (modelKeyword.value ? m.name.includes(modelKeyword.value) : true)));
const activeModelId = ref(null);
const activeModel = computed(() => models.value.find((m) => m.id === activeModelId.value) ?? null);
const selectModel = (m) => {
    activeModelId.value = m.id;
    analysisDone.value = false;
    result.value = [];
};
const changeTypes = ['新增字段', '删除字段', '修改字段类型', '修改字段长度', '新增索引', '表重命名', '字段改名'];
const changeType = ref('修改字段类型');
const changeObjects = ref([]);
const changeDesc = ref('');
const changeObjectsMap = {
    '票务运营域逻辑模型': ['ticket_sale.sale_time', 'ticket_sale.amount', 'dws_ticket_daily.line_code', 'ads_flow_stat.total_passengers'],
    '旅客服务域逻辑模型': ['passenger_info.phone', 'passenger_info.name', 'station_service_feedback.score'],
    '设备运维域物理模型': ['device_health.temperature', 'device_fault.code'],
    '财务共享域逻辑模型': ['finance_order.amount', 'finance_pay.status'],
    '调度指挥域物理模型': ['train_plan.departure_time'],
};
const applyChangeObjects = () => {
    changeObjects.value = changeObjectsMap[activeModel.value?.name ?? ''] ?? [];
    const obj = changeObjects.value[0];
    changeObject.value = obj ?? '';
    changeDesc.value = obj ? `将字段 ${obj} 的类型由 VARCHAR(32) 调整为 VARCHAR(64)` : '';
};
const changeObject = ref('');
const result = ref([]);
const analysisDone = ref(false);
const impactTab = ref('表');
const levelTag = { 高: 'danger', 中: 'warning', 低: 'info' };
const sampleImpacts = [
    { type: '表', name: 'dws_ticket_daily', owner: '李工', level: '高', path: 'ticket_sale.amount → dws_ticket_daily.amount', desc: '上游字段类型变更，需同步调整字段类型，否则任务将失败' },
    { type: '表', name: 'ads_flow_stat', owner: '张工', level: '高', path: 'dws_ticket_daily.amount → ads_flow_stat.total_amount', desc: '依赖上游聚合字段，变更需评估重算量' },
    { type: '表', name: 'rpt_ticket_monthly', owner: '王工', level: '中', path: '取自 ads_flow_stat', desc: '月报引用上游结果，需验证数据口径' },
    { type: '任务', name: '离线-票务日汇总 DWS 加工', owner: '李工', level: '高', path: '读取 ticket_sale.amount', desc: '字段类型变化可能导致数据转换异常' },
    { type: '任务', name: '实时-售票金额告警流', owner: '赵工', level: '中', path: '消费 ticket_sale 变更事件', desc: '下游实时任务需同步更新字段映射' },
    { type: '任务', name: '补数任务-历史重灌', owner: '赵工', level: '低', path: '主动重算历史分区', desc: '变更后需安排历史数据重算' },
    { type: '服务', name: '客流统计查询服务', owner: '张工', level: '高', path: '/api/v1/flow/stat', desc: '接口出参依赖 total_amount，影响 SLA' },
    { type: '服务', name: '订单汇总指标服务', owner: '张工', level: '中', path: '/api/v1/order/summary', desc: '出参映射需要同步调整' },
    { type: '报表', name: '月度客流运营分析报表', owner: '王工', level: '中', path: 'BI 数据集引用 ads_flow_stat', desc: '报表字段需同步刷新' },
    { type: '报表', name: '票务稽核日报', owner: '王工', level: '低', path: '直连 dws_ticket_daily', desc: '不影响统计口径，仅建议验证' },
    { type: '标准映射', name: 'GB/T 金额类数据元（amount_amt）', owner: '标准管理员', level: '高', path: 'ticket_sale.amount 映射数据元', desc: '字段类型变更违反标准映射约束' },
    { type: '标准映射', name: '数据分级映射（L3 敏感）', owner: '标准管理员', level: '低', path: '金额字段分级不变', desc: '无影响' },
];
const runAnalysis = () => {
    if (!activeModel.value)
        return;
    if (!changeDesc.value.trim()) {
        ElMessage.warning('请填写变更内容说明');
        return;
    }
    result.value = sampleImpacts.map((i) => ({ ...i }));
    analysisDone.value = true;
    impactTab.value = '表';
    ElMessage.success(`已自动计算下游影响对象：${result.value.length} 个（表/任务/服务/报表/标准映射）`);
};
const impactTotal = computed(() => result.value.length);
const impactCountByLevel = computed(() => {
    const count = { 高: 0, 中: 0, 低: 0 };
    result.value.forEach((i) => (count[i.level] += 1));
    return count;
});
const impactByType = computed(() => {
    const grouped = { 表: [], 任务: [], 服务: [], 报表: [], 标准映射: [] };
    result.value.forEach((i) => {
        if (grouped[i.type])
            grouped[i.type].push(i);
    });
    return grouped;
});
const notifyOwners = () => {
    const owners = Array.from(new Set(result.value.map((i) => i.owner)));
    ElMessage.success(`已通过站内信+邮件通知 ${owners.length} 位责任人（${owners.join('、')}）`);
};
watch(() => activeModel.value?.name, () => {
    if (activeModel.value)
        applyChangeObjects();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "standard-page impact-page" },
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
    span: (6),
}));
const __VLS_6 = __VLS_5({
    span: (6),
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
__VLS_7.slots.default;
const __VLS_8 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    ...{ class: "panel-card impact-left" },
    shadow: "never",
}));
const __VLS_10 = __VLS_9({
    ...{ class: "panel-card impact-left" },
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
    const __VLS_12 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
        size: "small",
        type: "info",
        effect: "plain",
    }));
    const __VLS_14 = __VLS_13({
        size: "small",
        type: "info",
        effect: "plain",
    }, ...__VLS_functionalComponentArgsRest(__VLS_13));
    __VLS_15.slots.default;
    (__VLS_ctx.models.length);
    var __VLS_15;
}
const __VLS_16 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    modelValue: (__VLS_ctx.modelKeyword),
    placeholder: "搜索模型",
    clearable: true,
    size: "small",
    ...{ class: "mb-12 w-full" },
    prefixIcon: (__VLS_ctx.Search),
}));
const __VLS_18 = __VLS_17({
    modelValue: (__VLS_ctx.modelKeyword),
    placeholder: "搜索模型",
    clearable: true,
    size: "small",
    ...{ class: "mb-12 w-full" },
    prefixIcon: (__VLS_ctx.Search),
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "model-list" },
});
for (const [m] of __VLS_getVForSourceType((__VLS_ctx.filteredModels))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.selectModel(m);
            } },
        key: (m.id),
        ...{ class: "model-item" },
        ...{ class: ({ 'is-active': __VLS_ctx.activeModelId === m.id }) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "model-item-head" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "model-item-name" },
    });
    (m.name);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "model-item-tables" },
    });
    (m.tables);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "model-item-meta" },
    });
    (m.dom);
    (m.lastChange);
}
var __VLS_11;
var __VLS_7;
const __VLS_20 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
    span: (18),
}));
const __VLS_22 = __VLS_21({
    span: (18),
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
__VLS_23.slots.default;
const __VLS_24 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    ...{ class: "panel-card" },
    shadow: "never",
}));
const __VLS_26 = __VLS_25({
    ...{ class: "panel-card" },
    shadow: "never",
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
__VLS_27.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_27.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.activeModel ? ` — ${__VLS_ctx.activeModel.name}` : '');
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-actions" },
    });
    const __VLS_28 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
        ...{ 'onClick': {} },
        size: "small",
        type: "danger",
        plain: true,
        icon: (__VLS_ctx.DataAnalysis),
        disabled: (!__VLS_ctx.activeModel),
    }));
    const __VLS_30 = __VLS_29({
        ...{ 'onClick': {} },
        size: "small",
        type: "danger",
        plain: true,
        icon: (__VLS_ctx.DataAnalysis),
        disabled: (!__VLS_ctx.activeModel),
    }, ...__VLS_functionalComponentArgsRest(__VLS_29));
    let __VLS_32;
    let __VLS_33;
    let __VLS_34;
    const __VLS_35 = {
        onClick: (__VLS_ctx.runAnalysis)
    };
    __VLS_31.slots.default;
    var __VLS_31;
    const __VLS_36 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
        ...{ 'onClick': {} },
        size: "small",
        plain: true,
        icon: (__VLS_ctx.Notification),
        disabled: (!__VLS_ctx.analysisDone),
    }));
    const __VLS_38 = __VLS_37({
        ...{ 'onClick': {} },
        size: "small",
        plain: true,
        icon: (__VLS_ctx.Notification),
        disabled: (!__VLS_ctx.analysisDone),
    }, ...__VLS_functionalComponentArgsRest(__VLS_37));
    let __VLS_40;
    let __VLS_41;
    let __VLS_42;
    const __VLS_43 = {
        onClick: (__VLS_ctx.notifyOwners)
    };
    __VLS_39.slots.default;
    var __VLS_39;
}
if (__VLS_ctx.activeModel) {
    const __VLS_44 = {}.ElForm;
    /** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
    // @ts-ignore
    const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
        inline: true,
        size: "small",
        ...{ class: "change-form" },
    }));
    const __VLS_46 = __VLS_45({
        inline: true,
        size: "small",
        ...{ class: "change-form" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_45));
    __VLS_47.slots.default;
    const __VLS_48 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
        label: "变更类型",
    }));
    const __VLS_50 = __VLS_49({
        label: "变更类型",
    }, ...__VLS_functionalComponentArgsRest(__VLS_49));
    __VLS_51.slots.default;
    const __VLS_52 = {}.ElSelect;
    /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
    // @ts-ignore
    const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
        modelValue: (__VLS_ctx.changeType),
        ...{ class: "wf-160" },
    }));
    const __VLS_54 = __VLS_53({
        modelValue: (__VLS_ctx.changeType),
        ...{ class: "wf-160" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_53));
    __VLS_55.slots.default;
    for (const [c] of __VLS_getVForSourceType((__VLS_ctx.changeTypes))) {
        const __VLS_56 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
            key: (c),
            label: (c),
            value: (c),
        }));
        const __VLS_58 = __VLS_57({
            key: (c),
            label: (c),
            value: (c),
        }, ...__VLS_functionalComponentArgsRest(__VLS_57));
    }
    var __VLS_55;
    var __VLS_51;
    const __VLS_60 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
        label: "变更对象",
    }));
    const __VLS_62 = __VLS_61({
        label: "变更对象",
    }, ...__VLS_functionalComponentArgsRest(__VLS_61));
    __VLS_63.slots.default;
    const __VLS_64 = {}.ElSelect;
    /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
    // @ts-ignore
    const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
        modelValue: (__VLS_ctx.changeObject),
        filterable: true,
        defaultFirstOption: true,
        ...{ class: "wf-160" },
    }));
    const __VLS_66 = __VLS_65({
        modelValue: (__VLS_ctx.changeObject),
        filterable: true,
        defaultFirstOption: true,
        ...{ class: "wf-160" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_65));
    __VLS_67.slots.default;
    for (const [c] of __VLS_getVForSourceType((__VLS_ctx.changeObjects))) {
        const __VLS_68 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
            key: (c),
            label: (c),
            value: (c),
        }));
        const __VLS_70 = __VLS_69({
            key: (c),
            label: (c),
            value: (c),
        }, ...__VLS_functionalComponentArgsRest(__VLS_69));
    }
    var __VLS_67;
    var __VLS_63;
    const __VLS_72 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
        label: "变更内容",
    }));
    const __VLS_74 = __VLS_73({
        label: "变更内容",
    }, ...__VLS_functionalComponentArgsRest(__VLS_73));
    __VLS_75.slots.default;
    const __VLS_76 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
        modelValue: (__VLS_ctx.changeDesc),
        placeholder: "如：新增字段 passenger_phone",
        ...{ class: "wf-240" },
    }));
    const __VLS_78 = __VLS_77({
        modelValue: (__VLS_ctx.changeDesc),
        placeholder: "如：新增字段 passenger_phone",
        ...{ class: "wf-240" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_77));
    var __VLS_75;
    var __VLS_47;
    if (__VLS_ctx.analysisDone) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "impact-summary" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "impact-summary-item" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "impact-summary-num" },
            ...{ style: {} },
        });
        (__VLS_ctx.impactTotal);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "impact-summary-label" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "impact-summary-item" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "impact-summary-num" },
            ...{ style: {} },
        });
        (__VLS_ctx.impactCountByLevel['高']);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "impact-summary-label" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "impact-summary-item" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "impact-summary-num" },
            ...{ style: {} },
        });
        (__VLS_ctx.impactCountByLevel['中']);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "impact-summary-label" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "impact-summary-item" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "impact-summary-num" },
            ...{ style: {} },
        });
        (__VLS_ctx.impactCountByLevel['低']);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "impact-summary-label" },
        });
    }
    if (__VLS_ctx.analysisDone) {
        const __VLS_80 = {}.ElTabs;
        /** @type {[typeof __VLS_components.ElTabs, typeof __VLS_components.elTabs, typeof __VLS_components.ElTabs, typeof __VLS_components.elTabs, ]} */ ;
        // @ts-ignore
        const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
            modelValue: (__VLS_ctx.impactTab),
            ...{ class: "impact-tabs" },
        }));
        const __VLS_82 = __VLS_81({
            modelValue: (__VLS_ctx.impactTab),
            ...{ class: "impact-tabs" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_81));
        __VLS_83.slots.default;
        const __VLS_84 = {}.ElTabPane;
        /** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
        // @ts-ignore
        const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
            label: (`表（${__VLS_ctx.impactByType['表'].length}）`),
            name: "表",
        }));
        const __VLS_86 = __VLS_85({
            label: (`表（${__VLS_ctx.impactByType['表'].length}）`),
            name: "表",
        }, ...__VLS_functionalComponentArgsRest(__VLS_85));
        __VLS_87.slots.default;
        const __VLS_88 = {}.ElTable;
        /** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
        // @ts-ignore
        const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
            data: (__VLS_ctx.impactByType['表']),
            size: "small",
            stripe: true,
        }));
        const __VLS_90 = __VLS_89({
            data: (__VLS_ctx.impactByType['表']),
            size: "small",
            stripe: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_89));
        __VLS_91.slots.default;
        const __VLS_92 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
            prop: "name",
            label: "受影响表",
            minWidth: "170",
        }));
        const __VLS_94 = __VLS_93({
            prop: "name",
            label: "受影响表",
            minWidth: "170",
        }, ...__VLS_functionalComponentArgsRest(__VLS_93));
        const __VLS_96 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
            prop: "owner",
            label: "表责任人",
            width: "90",
        }));
        const __VLS_98 = __VLS_97({
            prop: "owner",
            label: "表责任人",
            width: "90",
        }, ...__VLS_functionalComponentArgsRest(__VLS_97));
        const __VLS_100 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
            label: "影响等级",
            width: "80",
        }));
        const __VLS_102 = __VLS_101({
            label: "影响等级",
            width: "80",
        }, ...__VLS_functionalComponentArgsRest(__VLS_101));
        __VLS_103.slots.default;
        {
            const { default: __VLS_thisSlot } = __VLS_103.slots;
            const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
            const __VLS_104 = {}.ElTag;
            /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
            // @ts-ignore
            const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
                size: "small",
                type: (__VLS_ctx.levelTag[row.level]),
                effect: "dark",
            }));
            const __VLS_106 = __VLS_105({
                size: "small",
                type: (__VLS_ctx.levelTag[row.level]),
                effect: "dark",
            }, ...__VLS_functionalComponentArgsRest(__VLS_105));
            __VLS_107.slots.default;
            (row.level);
            var __VLS_107;
        }
        var __VLS_103;
        const __VLS_108 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
            label: "影响路径",
            minWidth: "200",
            showOverflowTooltip: true,
        }));
        const __VLS_110 = __VLS_109({
            label: "影响路径",
            minWidth: "200",
            showOverflowTooltip: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_109));
        __VLS_111.slots.default;
        {
            const { default: __VLS_thisSlot } = __VLS_111.slots;
            const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
            (row.path);
        }
        var __VLS_111;
        const __VLS_112 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
            label: "影响说明",
            minWidth: "200",
            showOverflowTooltip: true,
        }));
        const __VLS_114 = __VLS_113({
            label: "影响说明",
            minWidth: "200",
            showOverflowTooltip: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_113));
        __VLS_115.slots.default;
        {
            const { default: __VLS_thisSlot } = __VLS_115.slots;
            const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
            (row.desc);
        }
        var __VLS_115;
        var __VLS_91;
        var __VLS_87;
        const __VLS_116 = {}.ElTabPane;
        /** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
        // @ts-ignore
        const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
            label: (`任务（${__VLS_ctx.impactByType['任务'].length}）`),
            name: "任务",
        }));
        const __VLS_118 = __VLS_117({
            label: (`任务（${__VLS_ctx.impactByType['任务'].length}）`),
            name: "任务",
        }, ...__VLS_functionalComponentArgsRest(__VLS_117));
        __VLS_119.slots.default;
        const __VLS_120 = {}.ElTable;
        /** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
        // @ts-ignore
        const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({
            data: (__VLS_ctx.impactByType['任务']),
            size: "small",
            stripe: true,
        }));
        const __VLS_122 = __VLS_121({
            data: (__VLS_ctx.impactByType['任务']),
            size: "small",
            stripe: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_121));
        __VLS_123.slots.default;
        const __VLS_124 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({
            prop: "name",
            label: "受影响任务",
            minWidth: "180",
        }));
        const __VLS_126 = __VLS_125({
            prop: "name",
            label: "受影响任务",
            minWidth: "180",
        }, ...__VLS_functionalComponentArgsRest(__VLS_125));
        const __VLS_128 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({
            prop: "owner",
            label: "任务责任人",
            width: "90",
        }));
        const __VLS_130 = __VLS_129({
            prop: "owner",
            label: "任务责任人",
            width: "90",
        }, ...__VLS_functionalComponentArgsRest(__VLS_129));
        const __VLS_132 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132({
            label: "影响等级",
            width: "80",
        }));
        const __VLS_134 = __VLS_133({
            label: "影响等级",
            width: "80",
        }, ...__VLS_functionalComponentArgsRest(__VLS_133));
        __VLS_135.slots.default;
        {
            const { default: __VLS_thisSlot } = __VLS_135.slots;
            const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
            const __VLS_136 = {}.ElTag;
            /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
            // @ts-ignore
            const __VLS_137 = __VLS_asFunctionalComponent(__VLS_136, new __VLS_136({
                size: "small",
                type: (__VLS_ctx.levelTag[row.level]),
                effect: "dark",
            }));
            const __VLS_138 = __VLS_137({
                size: "small",
                type: (__VLS_ctx.levelTag[row.level]),
                effect: "dark",
            }, ...__VLS_functionalComponentArgsRest(__VLS_137));
            __VLS_139.slots.default;
            (row.level);
            var __VLS_139;
        }
        var __VLS_135;
        const __VLS_140 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_141 = __VLS_asFunctionalComponent(__VLS_140, new __VLS_140({
            prop: "path",
            label: "影响路径",
            minWidth: "200",
            showOverflowTooltip: true,
        }));
        const __VLS_142 = __VLS_141({
            prop: "path",
            label: "影响路径",
            minWidth: "200",
            showOverflowTooltip: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_141));
        const __VLS_144 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_145 = __VLS_asFunctionalComponent(__VLS_144, new __VLS_144({
            prop: "desc",
            label: "影响说明",
            minWidth: "200",
            showOverflowTooltip: true,
        }));
        const __VLS_146 = __VLS_145({
            prop: "desc",
            label: "影响说明",
            minWidth: "200",
            showOverflowTooltip: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_145));
        var __VLS_123;
        var __VLS_119;
        const __VLS_148 = {}.ElTabPane;
        /** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
        // @ts-ignore
        const __VLS_149 = __VLS_asFunctionalComponent(__VLS_148, new __VLS_148({
            label: (`服务（${__VLS_ctx.impactByType['服务'].length}）`),
            name: "服务",
        }));
        const __VLS_150 = __VLS_149({
            label: (`服务（${__VLS_ctx.impactByType['服务'].length}）`),
            name: "服务",
        }, ...__VLS_functionalComponentArgsRest(__VLS_149));
        __VLS_151.slots.default;
        const __VLS_152 = {}.ElTable;
        /** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
        // @ts-ignore
        const __VLS_153 = __VLS_asFunctionalComponent(__VLS_152, new __VLS_152({
            data: (__VLS_ctx.impactByType['服务']),
            size: "small",
            stripe: true,
        }));
        const __VLS_154 = __VLS_153({
            data: (__VLS_ctx.impactByType['服务']),
            size: "small",
            stripe: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_153));
        __VLS_155.slots.default;
        const __VLS_156 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_157 = __VLS_asFunctionalComponent(__VLS_156, new __VLS_156({
            prop: "name",
            label: "受影响服务",
            minWidth: "180",
        }));
        const __VLS_158 = __VLS_157({
            prop: "name",
            label: "受影响服务",
            minWidth: "180",
        }, ...__VLS_functionalComponentArgsRest(__VLS_157));
        const __VLS_160 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_161 = __VLS_asFunctionalComponent(__VLS_160, new __VLS_160({
            prop: "owner",
            label: "服务负责人",
            width: "90",
        }));
        const __VLS_162 = __VLS_161({
            prop: "owner",
            label: "服务负责人",
            width: "90",
        }, ...__VLS_functionalComponentArgsRest(__VLS_161));
        const __VLS_164 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_165 = __VLS_asFunctionalComponent(__VLS_164, new __VLS_164({
            label: "影响等级",
            width: "80",
        }));
        const __VLS_166 = __VLS_165({
            label: "影响等级",
            width: "80",
        }, ...__VLS_functionalComponentArgsRest(__VLS_165));
        __VLS_167.slots.default;
        {
            const { default: __VLS_thisSlot } = __VLS_167.slots;
            const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
            const __VLS_168 = {}.ElTag;
            /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
            // @ts-ignore
            const __VLS_169 = __VLS_asFunctionalComponent(__VLS_168, new __VLS_168({
                size: "small",
                type: (__VLS_ctx.levelTag[row.level]),
                effect: "dark",
            }));
            const __VLS_170 = __VLS_169({
                size: "small",
                type: (__VLS_ctx.levelTag[row.level]),
                effect: "dark",
            }, ...__VLS_functionalComponentArgsRest(__VLS_169));
            __VLS_171.slots.default;
            (row.level);
            var __VLS_171;
        }
        var __VLS_167;
        const __VLS_172 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_173 = __VLS_asFunctionalComponent(__VLS_172, new __VLS_172({
            prop: "path",
            label: "调用路径",
            minWidth: "180",
            showOverflowTooltip: true,
        }));
        const __VLS_174 = __VLS_173({
            prop: "path",
            label: "调用路径",
            minWidth: "180",
            showOverflowTooltip: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_173));
        const __VLS_176 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_177 = __VLS_asFunctionalComponent(__VLS_176, new __VLS_176({
            prop: "desc",
            label: "影响说明",
            minWidth: "200",
            showOverflowTooltip: true,
        }));
        const __VLS_178 = __VLS_177({
            prop: "desc",
            label: "影响说明",
            minWidth: "200",
            showOverflowTooltip: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_177));
        var __VLS_155;
        var __VLS_151;
        const __VLS_180 = {}.ElTabPane;
        /** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
        // @ts-ignore
        const __VLS_181 = __VLS_asFunctionalComponent(__VLS_180, new __VLS_180({
            label: (`报表（${__VLS_ctx.impactByType['报表'].length}）`),
            name: "报表",
        }));
        const __VLS_182 = __VLS_181({
            label: (`报表（${__VLS_ctx.impactByType['报表'].length}）`),
            name: "报表",
        }, ...__VLS_functionalComponentArgsRest(__VLS_181));
        __VLS_183.slots.default;
        const __VLS_184 = {}.ElTable;
        /** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
        // @ts-ignore
        const __VLS_185 = __VLS_asFunctionalComponent(__VLS_184, new __VLS_184({
            data: (__VLS_ctx.impactByType['报表']),
            size: "small",
            stripe: true,
        }));
        const __VLS_186 = __VLS_185({
            data: (__VLS_ctx.impactByType['报表']),
            size: "small",
            stripe: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_185));
        __VLS_187.slots.default;
        const __VLS_188 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_189 = __VLS_asFunctionalComponent(__VLS_188, new __VLS_188({
            prop: "name",
            label: "受影响报表",
            minWidth: "180",
        }));
        const __VLS_190 = __VLS_189({
            prop: "name",
            label: "受影响报表",
            minWidth: "180",
        }, ...__VLS_functionalComponentArgsRest(__VLS_189));
        const __VLS_192 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_193 = __VLS_asFunctionalComponent(__VLS_192, new __VLS_192({
            prop: "owner",
            label: "报表责任人",
            width: "90",
        }));
        const __VLS_194 = __VLS_193({
            prop: "owner",
            label: "报表责任人",
            width: "90",
        }, ...__VLS_functionalComponentArgsRest(__VLS_193));
        const __VLS_196 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_197 = __VLS_asFunctionalComponent(__VLS_196, new __VLS_196({
            label: "影响等级",
            width: "80",
        }));
        const __VLS_198 = __VLS_197({
            label: "影响等级",
            width: "80",
        }, ...__VLS_functionalComponentArgsRest(__VLS_197));
        __VLS_199.slots.default;
        {
            const { default: __VLS_thisSlot } = __VLS_199.slots;
            const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
            const __VLS_200 = {}.ElTag;
            /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
            // @ts-ignore
            const __VLS_201 = __VLS_asFunctionalComponent(__VLS_200, new __VLS_200({
                size: "small",
                type: (__VLS_ctx.levelTag[row.level]),
                effect: "dark",
            }));
            const __VLS_202 = __VLS_201({
                size: "small",
                type: (__VLS_ctx.levelTag[row.level]),
                effect: "dark",
            }, ...__VLS_functionalComponentArgsRest(__VLS_201));
            __VLS_203.slots.default;
            (row.level);
            var __VLS_203;
        }
        var __VLS_199;
        const __VLS_204 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_205 = __VLS_asFunctionalComponent(__VLS_204, new __VLS_204({
            prop: "path",
            label: "引用位置",
            minWidth: "180",
            showOverflowTooltip: true,
        }));
        const __VLS_206 = __VLS_205({
            prop: "path",
            label: "引用位置",
            minWidth: "180",
            showOverflowTooltip: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_205));
        const __VLS_208 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_209 = __VLS_asFunctionalComponent(__VLS_208, new __VLS_208({
            prop: "desc",
            label: "影响说明",
            minWidth: "200",
            showOverflowTooltip: true,
        }));
        const __VLS_210 = __VLS_209({
            prop: "desc",
            label: "影响说明",
            minWidth: "200",
            showOverflowTooltip: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_209));
        var __VLS_187;
        var __VLS_183;
        const __VLS_212 = {}.ElTabPane;
        /** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
        // @ts-ignore
        const __VLS_213 = __VLS_asFunctionalComponent(__VLS_212, new __VLS_212({
            label: (`标准映射（${__VLS_ctx.impactByType['标准映射'].length}）`),
            name: "标准映射",
        }));
        const __VLS_214 = __VLS_213({
            label: (`标准映射（${__VLS_ctx.impactByType['标准映射'].length}）`),
            name: "标准映射",
        }, ...__VLS_functionalComponentArgsRest(__VLS_213));
        __VLS_215.slots.default;
        const __VLS_216 = {}.ElTable;
        /** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
        // @ts-ignore
        const __VLS_217 = __VLS_asFunctionalComponent(__VLS_216, new __VLS_216({
            data: (__VLS_ctx.impactByType['标准映射']),
            size: "small",
            stripe: true,
        }));
        const __VLS_218 = __VLS_217({
            data: (__VLS_ctx.impactByType['标准映射']),
            size: "small",
            stripe: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_217));
        __VLS_219.slots.default;
        const __VLS_220 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_221 = __VLS_asFunctionalComponent(__VLS_220, new __VLS_220({
            prop: "name",
            label: "关联标准",
            minWidth: "180",
        }));
        const __VLS_222 = __VLS_221({
            prop: "name",
            label: "关联标准",
            minWidth: "180",
        }, ...__VLS_functionalComponentArgsRest(__VLS_221));
        const __VLS_224 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_225 = __VLS_asFunctionalComponent(__VLS_224, new __VLS_224({
            prop: "owner",
            label: "标准责任人",
            width: "90",
        }));
        const __VLS_226 = __VLS_225({
            prop: "owner",
            label: "标准责任人",
            width: "90",
        }, ...__VLS_functionalComponentArgsRest(__VLS_225));
        const __VLS_228 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_229 = __VLS_asFunctionalComponent(__VLS_228, new __VLS_228({
            label: "影响等级",
            width: "80",
        }));
        const __VLS_230 = __VLS_229({
            label: "影响等级",
            width: "80",
        }, ...__VLS_functionalComponentArgsRest(__VLS_229));
        __VLS_231.slots.default;
        {
            const { default: __VLS_thisSlot } = __VLS_231.slots;
            const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
            const __VLS_232 = {}.ElTag;
            /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
            // @ts-ignore
            const __VLS_233 = __VLS_asFunctionalComponent(__VLS_232, new __VLS_232({
                size: "small",
                type: (__VLS_ctx.levelTag[row.level]),
                effect: "dark",
            }));
            const __VLS_234 = __VLS_233({
                size: "small",
                type: (__VLS_ctx.levelTag[row.level]),
                effect: "dark",
            }, ...__VLS_functionalComponentArgsRest(__VLS_233));
            __VLS_235.slots.default;
            (row.level);
            var __VLS_235;
        }
        var __VLS_231;
        const __VLS_236 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_237 = __VLS_asFunctionalComponent(__VLS_236, new __VLS_236({
            prop: "path",
            label: "映射关系",
            minWidth: "200",
            showOverflowTooltip: true,
        }));
        const __VLS_238 = __VLS_237({
            prop: "path",
            label: "映射关系",
            minWidth: "200",
            showOverflowTooltip: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_237));
        const __VLS_240 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_241 = __VLS_asFunctionalComponent(__VLS_240, new __VLS_240({
            prop: "desc",
            label: "影响说明",
            minWidth: "200",
            showOverflowTooltip: true,
        }));
        const __VLS_242 = __VLS_241({
            prop: "desc",
            label: "影响说明",
            minWidth: "200",
            showOverflowTooltip: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_241));
        var __VLS_219;
        var __VLS_215;
        var __VLS_83;
    }
    else {
        const __VLS_244 = {}.ElEmpty;
        /** @type {[typeof __VLS_components.ElEmpty, typeof __VLS_components.elEmpty, ]} */ ;
        // @ts-ignore
        const __VLS_245 = __VLS_asFunctionalComponent(__VLS_244, new __VLS_244({
            description: "选择模型并配置变更内容后，点击「自动分析影响」计算下游影响对象",
        }));
        const __VLS_246 = __VLS_245({
            description: "选择模型并配置变更内容后，点击「自动分析影响」计算下游影响对象",
        }, ...__VLS_functionalComponentArgsRest(__VLS_245));
    }
}
else {
    const __VLS_248 = {}.ElEmpty;
    /** @type {[typeof __VLS_components.ElEmpty, typeof __VLS_components.elEmpty, ]} */ ;
    // @ts-ignore
    const __VLS_249 = __VLS_asFunctionalComponent(__VLS_248, new __VLS_248({
        description: "请从左侧选择需要分析的数据模型",
    }));
    const __VLS_250 = __VLS_249({
        description: "请从左侧选择需要分析的数据模型",
    }, ...__VLS_functionalComponentArgsRest(__VLS_249));
}
var __VLS_27;
var __VLS_23;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['standard-page']} */ ;
/** @type {__VLS_StyleScopedClasses['impact-page']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['impact-left']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-12']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['model-list']} */ ;
/** @type {__VLS_StyleScopedClasses['model-item']} */ ;
/** @type {__VLS_StyleScopedClasses['model-item-head']} */ ;
/** @type {__VLS_StyleScopedClasses['model-item-name']} */ ;
/** @type {__VLS_StyleScopedClasses['model-item-tables']} */ ;
/** @type {__VLS_StyleScopedClasses['model-item-meta']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['change-form']} */ ;
/** @type {__VLS_StyleScopedClasses['wf-160']} */ ;
/** @type {__VLS_StyleScopedClasses['wf-160']} */ ;
/** @type {__VLS_StyleScopedClasses['wf-240']} */ ;
/** @type {__VLS_StyleScopedClasses['impact-summary']} */ ;
/** @type {__VLS_StyleScopedClasses['impact-summary-item']} */ ;
/** @type {__VLS_StyleScopedClasses['impact-summary-num']} */ ;
/** @type {__VLS_StyleScopedClasses['impact-summary-label']} */ ;
/** @type {__VLS_StyleScopedClasses['impact-summary-item']} */ ;
/** @type {__VLS_StyleScopedClasses['impact-summary-num']} */ ;
/** @type {__VLS_StyleScopedClasses['impact-summary-label']} */ ;
/** @type {__VLS_StyleScopedClasses['impact-summary-item']} */ ;
/** @type {__VLS_StyleScopedClasses['impact-summary-num']} */ ;
/** @type {__VLS_StyleScopedClasses['impact-summary-label']} */ ;
/** @type {__VLS_StyleScopedClasses['impact-summary-item']} */ ;
/** @type {__VLS_StyleScopedClasses['impact-summary-num']} */ ;
/** @type {__VLS_StyleScopedClasses['impact-summary-label']} */ ;
/** @type {__VLS_StyleScopedClasses['impact-tabs']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            DataAnalysis: DataAnalysis,
            Notification: Notification,
            Search: Search,
            models: models,
            modelKeyword: modelKeyword,
            filteredModels: filteredModels,
            activeModelId: activeModelId,
            activeModel: activeModel,
            selectModel: selectModel,
            changeTypes: changeTypes,
            changeType: changeType,
            changeObjects: changeObjects,
            changeDesc: changeDesc,
            changeObject: changeObject,
            analysisDone: analysisDone,
            impactTab: impactTab,
            levelTag: levelTag,
            runAnalysis: runAnalysis,
            impactTotal: impactTotal,
            impactCountByLevel: impactCountByLevel,
            impactByType: impactByType,
            notifyOwners: notifyOwners,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
