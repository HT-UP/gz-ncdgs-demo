import { computed, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Plus, Search } from '@element-plus/icons-vue';
const statsCards = [
    { label: '调用应用总数', value: '8', color: '#fff', bg: 'linear-gradient(135deg, #DA251D, #B71C1C)' },
    { label: '启用凭证', value: '6', color: '#00A854', bg: 'rgba(0,168,84,.1)' },
    { label: '今日调用量', value: '86.4k', color: '#2B6CB0', bg: 'rgba(43,108,176,.1)' },
    { label: '今日触发限流', value: '12', color: '#ED7B2F', bg: 'rgba(237,123,47,.1)' },
];
const apps = ref([
    { id: 1, name: '智能客流分析平台', appKey: 'AK8f2a91c0d34e', secret: 'Zx9kQw7mN2pBsL0v', rate: 100, concurrent: 20, status: '启用', owner: '张工', createTime: '2026-07-01' },
    { id: 2, name: '线网规划仿真系统', appKey: 'AK6b1d88e27f41', secret: 'Yt7pRw3kVm2a4sDc', rate: 50, concurrent: 10, status: '启用', owner: '李工', createTime: '2026-07-12' },
    { id: 3, name: '车站大屏展示端', appKey: 'AK3c9e77a15b20', secret: 'Xw8jQs2nBm1z5rFg', rate: 200, concurrent: 30, status: '启用', owner: '王工', createTime: '2026-07-20' },
    { id: 4, name: '外部科研合作方', appKey: 'AK7e4d33b28c09', secret: 'Vb6hTn1mKj9p0wEf', rate: 20, concurrent: 5, status: '停用', owner: '赵工', createTime: '2026-06-15' },
]);
const appKeyword = ref('');
const appStatus = ref('');
const filteredApps = computed(() => apps.value.filter((a) => {
    if (appStatus.value && a.status !== appStatus.value)
        return false;
    if (!appKeyword.value)
        return true;
    const kw = appKeyword.value.toLowerCase();
    return a.name.toLowerCase().includes(kw) || a.appKey.toLowerCase().includes(kw);
}));
const maskKey = (key) => `${key.slice(0, 6)}••••${key.slice(-4)}`;
const createVisible = ref(false);
const createForm = ref({ name: '', owner: '', rate: 100, concurrent: 20, enabled: true });
const openCreate = () => {
    createForm.value = { name: '', owner: '', rate: 100, concurrent: 20, enabled: true };
    createVisible.value = true;
};
const createApp = () => {
    if (!createForm.value.name.trim() || !createForm.value.owner.trim()) {
        ElMessage.warning('请填写应用名称与负责人');
        return;
    }
    apps.value.unshift({
        id: Date.now(),
        name: createForm.value.name,
        appKey: `AK${Math.random().toString(16).slice(2, 14)}`,
        secret: Math.random().toString(36).slice(2, 16) + Math.random().toString(36).slice(2, 16).toUpperCase(),
        rate: createForm.value.rate,
        concurrent: createForm.value.concurrent,
        status: createForm.value.enabled ? '启用' : '停用',
        owner: createForm.value.owner,
        createTime: new Date().toLocaleDateString('sv-SE'),
    });
    createVisible.value = false;
    ElMessage.success('已生成 AppKey/Secret（Mock），请在凭证页复制保存');
};
const rotateKey = (row) => {
    ElMessageBox.confirm(`重置后旧 Secret 立即失效，确认重置「${row.name}」凭证？`, '重置确认', { type: 'warning' })
        .then(() => {
        row.secret = Math.random().toString(36).slice(2, 16) + Math.random().toString(36).slice(2, 16).toUpperCase();
        ElMessage.success('Secret 已重置，请通知调用方更新（Mock）');
    })
        .catch(() => { });
};
const toggleApp = (row) => {
    row.status = row.status === '启用' ? '停用' : '启用';
    ElMessage.success(`「${row.name}」已${row.status}`);
};
const deleteApp = (row) => {
    ElMessageBox.confirm(`删除后将无法继续调用服务，确认删除「${row.name}」？`, '删除确认', { type: 'warning' })
        .then(() => {
        apps.value = apps.value.filter((a) => a.id !== row.id);
        ElMessage.success('调用应用已删除（Mock）');
    })
        .catch(() => { });
};
const ratePolicy = [
    { name: '实时查询类', desc: '接口响应快、调用频繁', limit: '50~200 次/分钟' },
    { name: '指标计算类', desc: '计算开销较大', limit: '20~80 次/分钟' },
    { name: '数据抽取类', desc: '批量拉取、体积大', limit: '5~30 次/分钟' },
    { name: '知识问答类', desc: 'AI 推理开销高', limit: '10~30 次/分钟' },
];
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "standard-page share-auth-page" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "auth-stats" },
});
for (const [s] of __VLS_getVForSourceType((__VLS_ctx.statsCards))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (s.label),
        ...{ class: "auth-stat" },
        ...{ style: ({ background: s.bg, color: s.color }) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "auth-stat-value" },
    });
    (s.value);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "auth-stat-label" },
    });
    (s.label);
}
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
    ...{ class: "panel-card auth-card" },
    shadow: "never",
}));
const __VLS_10 = __VLS_9({
    ...{ class: "panel-card auth-card" },
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
    const __VLS_12 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
        ...{ 'onClick': {} },
        type: "danger",
        size: "small",
        icon: (__VLS_ctx.Plus),
    }));
    const __VLS_14 = __VLS_13({
        ...{ 'onClick': {} },
        type: "danger",
        size: "small",
        icon: (__VLS_ctx.Plus),
    }, ...__VLS_functionalComponentArgsRest(__VLS_13));
    let __VLS_16;
    let __VLS_17;
    let __VLS_18;
    const __VLS_19 = {
        onClick: (__VLS_ctx.openCreate)
    };
    __VLS_15.slots.default;
    var __VLS_15;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "toolbar-row" },
});
const __VLS_20 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
    modelValue: (__VLS_ctx.appKeyword),
    placeholder: "按应用名称 / AppKey 搜索",
    clearable: true,
    ...{ class: "search-input" },
    prefixIcon: (__VLS_ctx.Search),
}));
const __VLS_22 = __VLS_21({
    modelValue: (__VLS_ctx.appKeyword),
    placeholder: "按应用名称 / AppKey 搜索",
    clearable: true,
    ...{ class: "search-input" },
    prefixIcon: (__VLS_ctx.Search),
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
const __VLS_24 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    modelValue: (__VLS_ctx.appStatus),
    placeholder: "状态",
    clearable: true,
    ...{ class: "filter-select" },
}));
const __VLS_26 = __VLS_25({
    modelValue: (__VLS_ctx.appStatus),
    placeholder: "状态",
    clearable: true,
    ...{ class: "filter-select" },
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
__VLS_27.slots.default;
const __VLS_28 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
    label: "启用",
    value: "启用",
}));
const __VLS_30 = __VLS_29({
    label: "启用",
    value: "启用",
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
const __VLS_32 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
    label: "停用",
    value: "停用",
}));
const __VLS_34 = __VLS_33({
    label: "停用",
    value: "停用",
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
var __VLS_27;
const __VLS_36 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    data: (__VLS_ctx.filteredApps),
    stripe: true,
}));
const __VLS_38 = __VLS_37({
    data: (__VLS_ctx.filteredApps),
    stripe: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
__VLS_39.slots.default;
const __VLS_40 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
    prop: "name",
    label: "应用名称",
    minWidth: "140",
}));
const __VLS_42 = __VLS_41({
    prop: "name",
    label: "应用名称",
    minWidth: "140",
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
const __VLS_44 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    label: "AppKey",
    width: "150",
}));
const __VLS_46 = __VLS_45({
    label: "AppKey",
    width: "150",
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
__VLS_47.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_47.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.code, __VLS_intrinsicElements.code)({
        ...{ class: "key-visible" },
    });
    (__VLS_ctx.maskKey(row.appKey));
}
var __VLS_47;
const __VLS_48 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
    label: "Secret",
    width: "120",
}));
const __VLS_50 = __VLS_49({
    label: "Secret",
    width: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
__VLS_51.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_51.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_52 = {}.ElTooltip;
    /** @type {[typeof __VLS_components.ElTooltip, typeof __VLS_components.elTooltip, typeof __VLS_components.ElTooltip, typeof __VLS_components.elTooltip, ]} */ ;
    // @ts-ignore
    const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
        content: (row.secret),
        placement: "top",
    }));
    const __VLS_54 = __VLS_53({
        content: (row.secret),
        placement: "top",
    }, ...__VLS_functionalComponentArgsRest(__VLS_53));
    __VLS_55.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.code, __VLS_intrinsicElements.code)({
        ...{ class: "key-masked" },
    });
    (row.secret.slice(-4));
    var __VLS_55;
}
var __VLS_51;
const __VLS_56 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
    label: "限流（频率/并发）",
    width: "130",
}));
const __VLS_58 = __VLS_57({
    label: "限流（频率/并发）",
    width: "130",
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
__VLS_59.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_59.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "dep-text" },
    });
    (row.rate);
    (row.concurrent);
}
var __VLS_59;
const __VLS_60 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
    label: "状态",
    width: "70",
}));
const __VLS_62 = __VLS_61({
    label: "状态",
    width: "70",
}, ...__VLS_functionalComponentArgsRest(__VLS_61));
__VLS_63.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_63.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_64 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
        size: "small",
        type: (row.status === '启用' ? 'success' : 'info'),
        effect: "dark",
    }));
    const __VLS_66 = __VLS_65({
        size: "small",
        type: (row.status === '启用' ? 'success' : 'info'),
        effect: "dark",
    }, ...__VLS_functionalComponentArgsRest(__VLS_65));
    __VLS_67.slots.default;
    (row.status);
    var __VLS_67;
}
var __VLS_63;
const __VLS_68 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
    prop: "owner",
    label: "负责人",
    width: "72",
}));
const __VLS_70 = __VLS_69({
    prop: "owner",
    label: "负责人",
    width: "72",
}, ...__VLS_functionalComponentArgsRest(__VLS_69));
const __VLS_72 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
    prop: "createTime",
    label: "创建时间",
    width: "100",
}));
const __VLS_74 = __VLS_73({
    prop: "createTime",
    label: "创建时间",
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_73));
const __VLS_76 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
    label: "操作",
    width: "190",
    fixed: "right",
}));
const __VLS_78 = __VLS_77({
    label: "操作",
    width: "190",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_77));
__VLS_79.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_79.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_80 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
        size: "small",
    }));
    const __VLS_82 = __VLS_81({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_81));
    let __VLS_84;
    let __VLS_85;
    let __VLS_86;
    const __VLS_87 = {
        onClick: (...[$event]) => {
            __VLS_ctx.rotateKey(row);
        }
    };
    __VLS_83.slots.default;
    var __VLS_83;
    const __VLS_88 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
        ...{ 'onClick': {} },
        link: true,
        type: "warning",
        size: "small",
    }));
    const __VLS_90 = __VLS_89({
        ...{ 'onClick': {} },
        link: true,
        type: "warning",
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_89));
    let __VLS_92;
    let __VLS_93;
    let __VLS_94;
    const __VLS_95 = {
        onClick: (...[$event]) => {
            __VLS_ctx.toggleApp(row);
        }
    };
    __VLS_91.slots.default;
    (row.status === '启用' ? '停用' : '启用');
    var __VLS_91;
    const __VLS_96 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
        ...{ 'onClick': {} },
        link: true,
        type: "danger",
        size: "small",
    }));
    const __VLS_98 = __VLS_97({
        ...{ 'onClick': {} },
        link: true,
        type: "danger",
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_97));
    let __VLS_100;
    let __VLS_101;
    let __VLS_102;
    const __VLS_103 = {
        onClick: (...[$event]) => {
            __VLS_ctx.deleteApp(row);
        }
    };
    __VLS_99.slots.default;
    var __VLS_99;
}
var __VLS_79;
var __VLS_39;
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
    ...{ class: "panel-card" },
    shadow: "never",
}));
const __VLS_110 = __VLS_109({
    ...{ class: "panel-card" },
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
const __VLS_112 = {}.ElSteps;
/** @type {[typeof __VLS_components.ElSteps, typeof __VLS_components.elSteps, typeof __VLS_components.ElSteps, typeof __VLS_components.elSteps, ]} */ ;
// @ts-ignore
const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
    direction: "vertical",
    active: (4),
    ...{ class: "sign-steps" },
}));
const __VLS_114 = __VLS_113({
    direction: "vertical",
    active: (4),
    ...{ class: "sign-steps" },
}, ...__VLS_functionalComponentArgsRest(__VLS_113));
__VLS_115.slots.default;
const __VLS_116 = {}.ElStep;
/** @type {[typeof __VLS_components.ElStep, typeof __VLS_components.elStep, ]} */ ;
// @ts-ignore
const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
    title: "构造待签字符串",
    description: "\u006d\u0065\u0074\u0068\u006f\u0064\u005c\u006e\u0070\u0061\u0074\u0068\u005c\u006e\u0058\u002d\u0054\u0069\u006d\u0065\u0073\u0074\u0061\u006d\u0070\u005c\u006e\u0058\u002d\u004e\u006f\u006e\u0063\u0065\u005c\u006e\u53c2\u6570\u89c4\u8303\u5316\u540e\u62fc\u63a5",
}));
const __VLS_118 = __VLS_117({
    title: "构造待签字符串",
    description: "\u006d\u0065\u0074\u0068\u006f\u0064\u005c\u006e\u0070\u0061\u0074\u0068\u005c\u006e\u0058\u002d\u0054\u0069\u006d\u0065\u0073\u0074\u0061\u006d\u0070\u005c\u006e\u0058\u002d\u004e\u006f\u006e\u0063\u0065\u005c\u006e\u53c2\u6570\u89c4\u8303\u5316\u540e\u62fc\u63a5",
}, ...__VLS_functionalComponentArgsRest(__VLS_117));
const __VLS_120 = {}.ElStep;
/** @type {[typeof __VLS_components.ElStep, typeof __VLS_components.elStep, ]} */ ;
// @ts-ignore
const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({
    title: "计算签名",
    description: "Base64(HMAC-SHA256(Secret, content))",
}));
const __VLS_122 = __VLS_121({
    title: "计算签名",
    description: "Base64(HMAC-SHA256(Secret, content))",
}, ...__VLS_functionalComponentArgsRest(__VLS_121));
const __VLS_124 = {}.ElStep;
/** @type {[typeof __VLS_components.ElStep, typeof __VLS_components.elStep, ]} */ ;
// @ts-ignore
const __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({
    title: "携带请求头",
    description: "X-AppKey / X-Timestamp / X-Nonce / X-Signature",
}));
const __VLS_126 = __VLS_125({
    title: "携带请求头",
    description: "X-AppKey / X-Timestamp / X-Nonce / X-Signature",
}, ...__VLS_functionalComponentArgsRest(__VLS_125));
const __VLS_128 = {}.ElStep;
/** @type {[typeof __VLS_components.ElStep, typeof __VLS_components.elStep, ]} */ ;
// @ts-ignore
const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({
    title: "网关校验",
    description: "时间戳 ±5min、Nonce 防重放、签名一致校验",
}));
const __VLS_130 = __VLS_129({
    title: "网关校验",
    description: "时间戳 ±5min、Nonce 防重放、签名一致校验",
}, ...__VLS_functionalComponentArgsRest(__VLS_129));
var __VLS_115;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "sign-note" },
});
var __VLS_111;
const __VLS_132 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132({
    ...{ class: "panel-card mt-16" },
    shadow: "never",
}));
const __VLS_134 = __VLS_133({
    ...{ class: "panel-card mt-16" },
    shadow: "never",
}, ...__VLS_functionalComponentArgsRest(__VLS_133));
__VLS_135.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_135.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
}
for (const [r] of __VLS_getVForSourceType((__VLS_ctx.ratePolicy))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (r.name),
        ...{ class: "rate-item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "rate-item-name" },
    });
    (r.name);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "rate-item-desc" },
    });
    (r.desc);
    const __VLS_136 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_137 = __VLS_asFunctionalComponent(__VLS_136, new __VLS_136({
        size: "small",
        type: "warning",
        effect: "plain",
    }));
    const __VLS_138 = __VLS_137({
        size: "small",
        type: "warning",
        effect: "plain",
    }, ...__VLS_functionalComponentArgsRest(__VLS_137));
    __VLS_139.slots.default;
    (r.limit);
    var __VLS_139;
}
const __VLS_140 = {}.ElAlert;
/** @type {[typeof __VLS_components.ElAlert, typeof __VLS_components.elAlert, typeof __VLS_components.ElAlert, typeof __VLS_components.elAlert, ]} */ ;
// @ts-ignore
const __VLS_141 = __VLS_asFunctionalComponent(__VLS_140, new __VLS_140({
    type: "info",
    closable: (false),
    showIcon: true,
    ...{ class: "mt-12" },
}));
const __VLS_142 = __VLS_141({
    type: "info",
    closable: (false),
    showIcon: true,
    ...{ class: "mt-12" },
}, ...__VLS_functionalComponentArgsRest(__VLS_141));
__VLS_143.slots.default;
{
    const { title: __VLS_thisSlot } = __VLS_143.slots;
}
var __VLS_143;
var __VLS_135;
var __VLS_107;
var __VLS_3;
const __VLS_144 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_145 = __VLS_asFunctionalComponent(__VLS_144, new __VLS_144({
    modelValue: (__VLS_ctx.createVisible),
    title: "新建调用应用",
    width: "520px",
    destroyOnClose: true,
}));
const __VLS_146 = __VLS_145({
    modelValue: (__VLS_ctx.createVisible),
    title: "新建调用应用",
    width: "520px",
    destroyOnClose: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_145));
__VLS_147.slots.default;
const __VLS_148 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_149 = __VLS_asFunctionalComponent(__VLS_148, new __VLS_148({
    model: (__VLS_ctx.createForm),
    labelWidth: "96px",
}));
const __VLS_150 = __VLS_149({
    model: (__VLS_ctx.createForm),
    labelWidth: "96px",
}, ...__VLS_functionalComponentArgsRest(__VLS_149));
__VLS_151.slots.default;
const __VLS_152 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_153 = __VLS_asFunctionalComponent(__VLS_152, new __VLS_152({
    label: "应用名称",
}));
const __VLS_154 = __VLS_153({
    label: "应用名称",
}, ...__VLS_functionalComponentArgsRest(__VLS_153));
__VLS_155.slots.default;
const __VLS_156 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_157 = __VLS_asFunctionalComponent(__VLS_156, new __VLS_156({
    modelValue: (__VLS_ctx.createForm.name),
    placeholder: "如：智能客流分析平台",
}));
const __VLS_158 = __VLS_157({
    modelValue: (__VLS_ctx.createForm.name),
    placeholder: "如：智能客流分析平台",
}, ...__VLS_functionalComponentArgsRest(__VLS_157));
var __VLS_155;
const __VLS_160 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_161 = __VLS_asFunctionalComponent(__VLS_160, new __VLS_160({
    label: "负责人",
}));
const __VLS_162 = __VLS_161({
    label: "负责人",
}, ...__VLS_functionalComponentArgsRest(__VLS_161));
__VLS_163.slots.default;
const __VLS_164 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_165 = __VLS_asFunctionalComponent(__VLS_164, new __VLS_164({
    modelValue: (__VLS_ctx.createForm.owner),
    placeholder: "负责人姓名",
}));
const __VLS_166 = __VLS_165({
    modelValue: (__VLS_ctx.createForm.owner),
    placeholder: "负责人姓名",
}, ...__VLS_functionalComponentArgsRest(__VLS_165));
var __VLS_163;
const __VLS_168 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_169 = __VLS_asFunctionalComponent(__VLS_168, new __VLS_168({
    label: "限流频率",
}));
const __VLS_170 = __VLS_169({
    label: "限流频率",
}, ...__VLS_functionalComponentArgsRest(__VLS_169));
__VLS_171.slots.default;
const __VLS_172 = {}.ElInputNumber;
/** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
// @ts-ignore
const __VLS_173 = __VLS_asFunctionalComponent(__VLS_172, new __VLS_172({
    modelValue: (__VLS_ctx.createForm.rate),
    min: (1),
    max: (10000),
}));
const __VLS_174 = __VLS_173({
    modelValue: (__VLS_ctx.createForm.rate),
    min: (1),
    max: (10000),
}, ...__VLS_functionalComponentArgsRest(__VLS_173));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "dep-text ml-4" },
});
var __VLS_171;
const __VLS_176 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_177 = __VLS_asFunctionalComponent(__VLS_176, new __VLS_176({
    label: "最大并发",
}));
const __VLS_178 = __VLS_177({
    label: "最大并发",
}, ...__VLS_functionalComponentArgsRest(__VLS_177));
__VLS_179.slots.default;
const __VLS_180 = {}.ElInputNumber;
/** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
// @ts-ignore
const __VLS_181 = __VLS_asFunctionalComponent(__VLS_180, new __VLS_180({
    modelValue: (__VLS_ctx.createForm.concurrent),
    min: (1),
    max: (500),
}));
const __VLS_182 = __VLS_181({
    modelValue: (__VLS_ctx.createForm.concurrent),
    min: (1),
    max: (500),
}, ...__VLS_functionalComponentArgsRest(__VLS_181));
var __VLS_179;
const __VLS_184 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_185 = __VLS_asFunctionalComponent(__VLS_184, new __VLS_184({
    label: "启用状态",
}));
const __VLS_186 = __VLS_185({
    label: "启用状态",
}, ...__VLS_functionalComponentArgsRest(__VLS_185));
__VLS_187.slots.default;
const __VLS_188 = {}.ElSwitch;
/** @type {[typeof __VLS_components.ElSwitch, typeof __VLS_components.elSwitch, ]} */ ;
// @ts-ignore
const __VLS_189 = __VLS_asFunctionalComponent(__VLS_188, new __VLS_188({
    modelValue: (__VLS_ctx.createForm.enabled),
    activeText: "启用",
    inactiveText: "停用",
}));
const __VLS_190 = __VLS_189({
    modelValue: (__VLS_ctx.createForm.enabled),
    activeText: "启用",
    inactiveText: "停用",
}, ...__VLS_functionalComponentArgsRest(__VLS_189));
var __VLS_187;
var __VLS_151;
{
    const { footer: __VLS_thisSlot } = __VLS_147.slots;
    const __VLS_192 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_193 = __VLS_asFunctionalComponent(__VLS_192, new __VLS_192({
        ...{ 'onClick': {} },
    }));
    const __VLS_194 = __VLS_193({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_193));
    let __VLS_196;
    let __VLS_197;
    let __VLS_198;
    const __VLS_199 = {
        onClick: (...[$event]) => {
            __VLS_ctx.createVisible = false;
        }
    };
    __VLS_195.slots.default;
    var __VLS_195;
    const __VLS_200 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_201 = __VLS_asFunctionalComponent(__VLS_200, new __VLS_200({
        ...{ 'onClick': {} },
        type: "danger",
    }));
    const __VLS_202 = __VLS_201({
        ...{ 'onClick': {} },
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_201));
    let __VLS_204;
    let __VLS_205;
    let __VLS_206;
    const __VLS_207 = {
        onClick: (__VLS_ctx.createApp)
    };
    __VLS_203.slots.default;
    var __VLS_203;
}
var __VLS_147;
/** @type {__VLS_StyleScopedClasses['standard-page']} */ ;
/** @type {__VLS_StyleScopedClasses['share-auth-page']} */ ;
/** @type {__VLS_StyleScopedClasses['auth-stats']} */ ;
/** @type {__VLS_StyleScopedClasses['auth-stat']} */ ;
/** @type {__VLS_StyleScopedClasses['auth-stat-value']} */ ;
/** @type {__VLS_StyleScopedClasses['auth-stat-label']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['auth-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['toolbar-row']} */ ;
/** @type {__VLS_StyleScopedClasses['search-input']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-select']} */ ;
/** @type {__VLS_StyleScopedClasses['key-visible']} */ ;
/** @type {__VLS_StyleScopedClasses['key-masked']} */ ;
/** @type {__VLS_StyleScopedClasses['dep-text']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['sign-steps']} */ ;
/** @type {__VLS_StyleScopedClasses['sign-note']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['rate-item']} */ ;
/** @type {__VLS_StyleScopedClasses['rate-item-name']} */ ;
/** @type {__VLS_StyleScopedClasses['rate-item-desc']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-12']} */ ;
/** @type {__VLS_StyleScopedClasses['dep-text']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Plus: Plus,
            Search: Search,
            statsCards: statsCards,
            appKeyword: appKeyword,
            appStatus: appStatus,
            filteredApps: filteredApps,
            maskKey: maskKey,
            createVisible: createVisible,
            createForm: createForm,
            openCreate: openCreate,
            createApp: createApp,
            rotateKey: rotateKey,
            toggleApp: toggleApp,
            deleteApp: deleteApp,
            ratePolicy: ratePolicy,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
