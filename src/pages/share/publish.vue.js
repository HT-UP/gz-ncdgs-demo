import { computed, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { DocumentCopy, Search } from '@element-plus/icons-vue';
const docBaseUrl = 'https://api.gz-metro-data.cn';
const levelColor = { L1: '#8c8c8c', L2: '#2B6CB0', L3: '#ED7B2F', L4: '#DA251D' };
const statsCards = [
    { label: '待审批申请', value: '3', color: '#fff', bg: 'linear-gradient(135deg, #DA251D, #B71C1C)' },
    { label: '本月已发布', value: '5', color: '#00A854', bg: 'rgba(0,168,84,.1)' },
    { label: '本月已驳回', value: '2', color: '#8c8c8c', bg: 'rgba(140,140,140,.1)' },
    { label: '平均审批时长', value: '1.5h', color: '#ED7B2F', bg: 'rgba(237,123,47,.1)' },
];
const stageTag = { 待审批: 'warning', 已通过: 'success', 已驳回: 'danger' };
const pendings = ref([
    {
        id: 'PUB-2026-018',
        serviceName: '售票明细查询服务',
        path: '/api/v1/ticket/query',
        method: 'POST',
        auth: true,
        asset: 'ticket_sale',
        level: 'L3',
        stage: '待审批',
        applicant: '张工',
        applyTime: '2026-08-12 16:40',
        params: [
            { name: 'begin_date', type: 'DATE', required: true, desc: '查询开始日期' },
            { name: 'end_date', type: 'DATE', required: true, desc: '查询结束日期' },
            { name: 'ticket_type', type: 'STRING', required: false, desc: '客票类型过滤' },
        ],
        outputs: [
            { name: 'order_id', type: 'STRING', alias: 'orderId' },
            { name: 'amount', type: 'DECIMAL', alias: 'amount' },
            { name: 'sale_time', type: 'TIMESTAMP', alias: 'saleTime' },
        ],
        sql: 'SELECT order_id, amount, sale_time FROM ticket_sale WHERE sale_time >= #{begin_date} AND sale_time <= #{end_date} /* AND ticket_type = #{ticket_type} */',
    },
    {
        id: 'PUB-2026-017',
        serviceName: '订单汇总指标服务',
        path: '/api/v1/order/summary',
        method: 'GET',
        auth: true,
        asset: 'dws_order_report',
        level: 'L2',
        stage: '待审批',
        applicant: '李工',
        applyTime: '2026-08-12 15:10',
        params: [{ name: 'line_code', type: 'STRING', required: true, desc: '线路编码' }],
        outputs: [
            { name: 'total_amount', type: 'DECIMAL', alias: 'totalAmount' },
            { name: 'order_count', type: 'INT', alias: 'orderCount' },
        ],
        sql: 'SELECT SUM(total_amount) AS total_amount, SUM(order_count) AS order_count FROM dws_order_report WHERE line_code = #{line_code}',
    },
    {
        id: 'PUB-2026-016',
        serviceName: '乘客信息批量导出服务',
        path: '/api/v1/passenger/export',
        method: 'GET',
        auth: false,
        asset: 'passenger_info',
        level: 'L3',
        stage: '待审批',
        applicant: '王工',
        applyTime: '2026-08-11 09:30',
        params: [{ name: 'page', type: 'INT', required: false, desc: '页码' }],
        outputs: [
            { name: 'passenger_name', type: 'STRING', alias: 'name' },
            { name: 'phone', type: 'STRING', alias: 'phone' },
        ],
        sql: 'SELECT passenger_name, phone FROM passenger_info LIMIT 1000',
    },
    {
        id: 'PUB-2026-014',
        serviceName: '线路基础信息服务',
        path: '/api/v1/line/detail',
        method: 'GET',
        auth: true,
        asset: 'line_info',
        level: 'L1',
        stage: '已通过',
        applicant: '张工',
        applyTime: '2026-08-09 09:10',
        approveTime: '2026-08-09 11:00',
        comment: '基础公开数据，准予发布',
        params: [{ name: 'line_code', type: 'STRING', required: true, desc: '线路编码' }],
        outputs: [
            { name: 'line_name', type: 'STRING', alias: 'lineName' },
            { name: 'status', type: 'STRING', alias: 'status' },
        ],
        sql: 'SELECT line_name, status FROM line_info WHERE line_code = #{line_code}',
    },
]);
const pubKeyword = ref('');
const currentPubId = ref('');
const currentPub = ref(null);
const approveComment = ref('');
const docVisible = ref(false);
const docTarget = ref(null);
const filteredPendings = computed(() => pendings.value.filter((p) => {
    if (!pubKeyword.value)
        return true;
    const kw = pubKeyword.value.toLowerCase();
    return p.serviceName.toLowerCase().includes(kw) || p.id.toLowerCase().includes(kw);
}));
const selectPub = (row) => {
    currentPub.value = row;
    currentPubId.value = row?.id ?? '';
    approveComment.value = '';
};
const doApprove = (pass) => {
    const p = currentPub.value;
    if (!p)
        return;
    p.stage = pass ? '已通过' : '已驳回';
    p.approveTime = new Date().toLocaleString('sv-SE').replace('T', ' ');
    p.comment = approveComment.value;
    ElMessage.success(pass ? `「${p.serviceName}」审批通过，已正式发布` : `「${p.serviceName}」已驳回`);
    approveComment.value = '';
};
const genDoc = (p) => {
    if (!p)
        return;
    docTarget.value = p;
    docVisible.value = true;
};
const docSample = computed(() => docTarget.value
    ? JSON.stringify({
        request: {
            method: docTarget.value.method,
            url: `${docBaseUrl}${docTarget.value.path}`,
            headers: { 'X-AppKey': 'Zx9k...ab3c', 'X-Timestamp': '2026-08-13 10:05:00', 'X-Signature': 'HMAC-SHA256' },
            body: docTarget.value.params.reduce((acc, p) => ({ ...acc, [p.name]: '示例值' }), {}),
        },
        response: {
            code: 0,
            message: 'success',
            data: docTarget.value.outputs.reduce((acc, o) => ({ ...acc, [o.alias || o.name]: '示例值' }), {}),
        },
    }, null, 2)
    : '');
const downloadDoc = () => {
    ElMessage.success('API 文档（Markdown/Swagger）已下载（Mock）');
    docVisible.value = false;
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "standard-page share-publish-page" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "pub-stats" },
});
for (const [s] of __VLS_getVForSourceType((__VLS_ctx.statsCards))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (s.label),
        ...{ class: "pub-stat" },
        ...{ style: ({ background: s.bg, color: s.color }) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "pub-stat-value" },
    });
    (s.value);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "pub-stat-label" },
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
    span: (9),
}));
const __VLS_6 = __VLS_5({
    span: (9),
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
__VLS_7.slots.default;
const __VLS_8 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    ...{ class: "panel-card pub-card" },
    shadow: "never",
}));
const __VLS_10 = __VLS_9({
    ...{ class: "panel-card pub-card" },
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
    (__VLS_ctx.filteredPendings.length);
    var __VLS_15;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "toolbar-row" },
});
const __VLS_16 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    modelValue: (__VLS_ctx.pubKeyword),
    placeholder: "按服务名称 / 单号搜索",
    clearable: true,
    ...{ class: "search-input-sm w-full" },
    prefixIcon: (__VLS_ctx.Search),
}));
const __VLS_18 = __VLS_17({
    modelValue: (__VLS_ctx.pubKeyword),
    placeholder: "按服务名称 / 单号搜索",
    clearable: true,
    ...{ class: "search-input-sm w-full" },
    prefixIcon: (__VLS_ctx.Search),
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
const __VLS_20 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
    ...{ 'onCurrentChange': {} },
    data: (__VLS_ctx.filteredPendings),
    size: "small",
    highlightCurrentRow: true,
    height: "470",
    currentRowKey: (__VLS_ctx.currentPubId),
}));
const __VLS_22 = __VLS_21({
    ...{ 'onCurrentChange': {} },
    data: (__VLS_ctx.filteredPendings),
    size: "small",
    highlightCurrentRow: true,
    height: "470",
    currentRowKey: (__VLS_ctx.currentPubId),
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
let __VLS_24;
let __VLS_25;
let __VLS_26;
const __VLS_27 = {
    onCurrentChange: (__VLS_ctx.selectPub)
};
__VLS_23.slots.default;
const __VLS_28 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
    prop: "id",
    label: "申请单号",
    width: "110",
}));
const __VLS_30 = __VLS_29({
    prop: "id",
    label: "申请单号",
    width: "110",
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
const __VLS_32 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
    prop: "serviceName",
    label: "服务名称",
    minWidth: "130",
    showOverflowTooltip: true,
}));
const __VLS_34 = __VLS_33({
    prop: "serviceName",
    label: "服务名称",
    minWidth: "130",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
const __VLS_36 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    label: "状态",
    width: "80",
}));
const __VLS_38 = __VLS_37({
    label: "状态",
    width: "80",
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
__VLS_39.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_39.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_40 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
        size: "small",
        type: (__VLS_ctx.stageTag[row.stage]),
        effect: "dark",
    }));
    const __VLS_42 = __VLS_41({
        size: "small",
        type: (__VLS_ctx.stageTag[row.stage]),
        effect: "dark",
    }, ...__VLS_functionalComponentArgsRest(__VLS_41));
    __VLS_43.slots.default;
    (row.stage);
    var __VLS_43;
}
var __VLS_39;
const __VLS_44 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    prop: "applicant",
    label: "申请人",
    width: "64",
}));
const __VLS_46 = __VLS_45({
    prop: "applicant",
    label: "申请人",
    width: "64",
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
const __VLS_48 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
    prop: "applyTime",
    label: "申请时间",
    width: "106",
}));
const __VLS_50 = __VLS_49({
    prop: "applyTime",
    label: "申请时间",
    width: "106",
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
var __VLS_23;
var __VLS_11;
var __VLS_7;
const __VLS_52 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
    span: (15),
}));
const __VLS_54 = __VLS_53({
    span: (15),
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
__VLS_55.slots.default;
const __VLS_56 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
    ...{ class: "panel-card pub-card" },
    shadow: "never",
}));
const __VLS_58 = __VLS_57({
    ...{ class: "panel-card pub-card" },
    shadow: "never",
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
__VLS_59.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_59.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-actions" },
    });
    const __VLS_60 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
        ...{ 'onClick': {} },
        size: "small",
        plain: true,
        icon: (__VLS_ctx.DocumentCopy),
        disabled: (!__VLS_ctx.currentPub),
    }));
    const __VLS_62 = __VLS_61({
        ...{ 'onClick': {} },
        size: "small",
        plain: true,
        icon: (__VLS_ctx.DocumentCopy),
        disabled: (!__VLS_ctx.currentPub),
    }, ...__VLS_functionalComponentArgsRest(__VLS_61));
    let __VLS_64;
    let __VLS_65;
    let __VLS_66;
    const __VLS_67 = {
        onClick: (...[$event]) => {
            __VLS_ctx.genDoc(__VLS_ctx.currentPub);
        }
    };
    __VLS_63.slots.default;
    var __VLS_63;
}
if (__VLS_ctx.currentPub) {
    const __VLS_68 = {}.ElDescriptions;
    /** @type {[typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, ]} */ ;
    // @ts-ignore
    const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
        column: (3),
        border: true,
        size: "small",
    }));
    const __VLS_70 = __VLS_69({
        column: (3),
        border: true,
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_69));
    __VLS_71.slots.default;
    const __VLS_72 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
        label: "服务名称",
    }));
    const __VLS_74 = __VLS_73({
        label: "服务名称",
    }, ...__VLS_functionalComponentArgsRest(__VLS_73));
    __VLS_75.slots.default;
    (__VLS_ctx.currentPub.serviceName);
    var __VLS_75;
    const __VLS_76 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
        label: "申请单号",
    }));
    const __VLS_78 = __VLS_77({
        label: "申请单号",
    }, ...__VLS_functionalComponentArgsRest(__VLS_77));
    __VLS_79.slots.default;
    (__VLS_ctx.currentPub.id);
    var __VLS_79;
    const __VLS_80 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
        label: "申请人",
    }));
    const __VLS_82 = __VLS_81({
        label: "申请人",
    }, ...__VLS_functionalComponentArgsRest(__VLS_81));
    __VLS_83.slots.default;
    (__VLS_ctx.currentPub.applicant);
    var __VLS_83;
    const __VLS_84 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
        label: "服务路径",
    }));
    const __VLS_86 = __VLS_85({
        label: "服务路径",
    }, ...__VLS_functionalComponentArgsRest(__VLS_85));
    __VLS_87.slots.default;
    (__VLS_ctx.currentPub.path);
    var __VLS_87;
    const __VLS_88 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
        label: "请求方式",
    }));
    const __VLS_90 = __VLS_89({
        label: "请求方式",
    }, ...__VLS_functionalComponentArgsRest(__VLS_89));
    __VLS_91.slots.default;
    (__VLS_ctx.currentPub.method);
    var __VLS_91;
    const __VLS_92 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
        label: "接入鉴权",
    }));
    const __VLS_94 = __VLS_93({
        label: "接入鉴权",
    }, ...__VLS_functionalComponentArgsRest(__VLS_93));
    __VLS_95.slots.default;
    (__VLS_ctx.currentPub.auth ? '启用' : '停用');
    var __VLS_95;
    const __VLS_96 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
        label: "封装资产",
        span: (2),
    }));
    const __VLS_98 = __VLS_97({
        label: "封装资产",
        span: (2),
    }, ...__VLS_functionalComponentArgsRest(__VLS_97));
    __VLS_99.slots.default;
    (__VLS_ctx.currentPub.asset);
    var __VLS_99;
    const __VLS_100 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
        label: "风险等级",
    }));
    const __VLS_102 = __VLS_101({
        label: "风险等级",
    }, ...__VLS_functionalComponentArgsRest(__VLS_101));
    __VLS_103.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "security-level" },
        ...{ style: ({ background: __VLS_ctx.levelColor[__VLS_ctx.currentPub.level] }) },
    });
    (__VLS_ctx.currentPub.level);
    var __VLS_103;
    var __VLS_71;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "block-title" },
    });
    const __VLS_104 = {}.ElTable;
    /** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
    // @ts-ignore
    const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
        data: (__VLS_ctx.currentPub.params),
        size: "mini",
        border: true,
    }));
    const __VLS_106 = __VLS_105({
        data: (__VLS_ctx.currentPub.params),
        size: "mini",
        border: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_105));
    __VLS_107.slots.default;
    const __VLS_108 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
        prop: "name",
        label: "参数名",
        minWidth: "110",
    }));
    const __VLS_110 = __VLS_109({
        prop: "name",
        label: "参数名",
        minWidth: "110",
    }, ...__VLS_functionalComponentArgsRest(__VLS_109));
    const __VLS_112 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
        prop: "type",
        label: "类型",
        width: "90",
    }));
    const __VLS_114 = __VLS_113({
        prop: "type",
        label: "类型",
        width: "90",
    }, ...__VLS_functionalComponentArgsRest(__VLS_113));
    const __VLS_116 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
        label: "必填",
        width: "60",
        align: "center",
    }));
    const __VLS_118 = __VLS_117({
        label: "必填",
        width: "60",
        align: "center",
    }, ...__VLS_functionalComponentArgsRest(__VLS_117));
    __VLS_119.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_119.slots;
        const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
        const __VLS_120 = {}.ElTag;
        /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
        // @ts-ignore
        const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({
            size: "small",
            type: (row.required ? 'danger' : 'info'),
            effect: "plain",
        }));
        const __VLS_122 = __VLS_121({
            size: "small",
            type: (row.required ? 'danger' : 'info'),
            effect: "plain",
        }, ...__VLS_functionalComponentArgsRest(__VLS_121));
        __VLS_123.slots.default;
        (row.required ? '是' : '否');
        var __VLS_123;
    }
    var __VLS_119;
    const __VLS_124 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({
        prop: "desc",
        label: "说明",
        minWidth: "120",
    }));
    const __VLS_126 = __VLS_125({
        prop: "desc",
        label: "说明",
        minWidth: "120",
    }, ...__VLS_functionalComponentArgsRest(__VLS_125));
    var __VLS_107;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "block-title" },
    });
    const __VLS_128 = {}.ElTable;
    /** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
    // @ts-ignore
    const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({
        data: (__VLS_ctx.currentPub.outputs),
        size: "mini",
        border: true,
    }));
    const __VLS_130 = __VLS_129({
        data: (__VLS_ctx.currentPub.outputs),
        size: "mini",
        border: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_129));
    __VLS_131.slots.default;
    const __VLS_132 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132({
        prop: "name",
        label: "字段名",
        minWidth: "110",
    }));
    const __VLS_134 = __VLS_133({
        prop: "name",
        label: "字段名",
        minWidth: "110",
    }, ...__VLS_functionalComponentArgsRest(__VLS_133));
    const __VLS_136 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_137 = __VLS_asFunctionalComponent(__VLS_136, new __VLS_136({
        prop: "type",
        label: "类型",
        width: "90",
    }));
    const __VLS_138 = __VLS_137({
        prop: "type",
        label: "类型",
        width: "90",
    }, ...__VLS_functionalComponentArgsRest(__VLS_137));
    const __VLS_140 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_141 = __VLS_asFunctionalComponent(__VLS_140, new __VLS_140({
        prop: "alias",
        label: "返回别名",
        minWidth: "110",
    }));
    const __VLS_142 = __VLS_141({
        prop: "alias",
        label: "返回别名",
        minWidth: "110",
    }, ...__VLS_functionalComponentArgsRest(__VLS_141));
    var __VLS_131;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "block-title" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.pre, __VLS_intrinsicElements.pre)({
        ...{ class: "pub-sql" },
    });
    (__VLS_ctx.currentPub.sql);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "pub-approve" },
    });
    const __VLS_144 = {}.ElForm;
    /** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
    // @ts-ignore
    const __VLS_145 = __VLS_asFunctionalComponent(__VLS_144, new __VLS_144({
        labelWidth: "80px",
        ...{ class: "pub-form" },
    }));
    const __VLS_146 = __VLS_145({
        labelWidth: "80px",
        ...{ class: "pub-form" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_145));
    __VLS_147.slots.default;
    const __VLS_148 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_149 = __VLS_asFunctionalComponent(__VLS_148, new __VLS_148({
        label: "审批意见",
    }));
    const __VLS_150 = __VLS_149({
        label: "审批意见",
    }, ...__VLS_functionalComponentArgsRest(__VLS_149));
    __VLS_151.slots.default;
    const __VLS_152 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_153 = __VLS_asFunctionalComponent(__VLS_152, new __VLS_152({
        modelValue: (__VLS_ctx.approveComment),
        type: "textarea",
        rows: (3),
        placeholder: "填写审批意见（必填）",
    }));
    const __VLS_154 = __VLS_153({
        modelValue: (__VLS_ctx.approveComment),
        type: "textarea",
        rows: (3),
        placeholder: "填写审批意见（必填）",
    }, ...__VLS_functionalComponentArgsRest(__VLS_153));
    var __VLS_151;
    var __VLS_147;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "pub-actions" },
    });
    const __VLS_156 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_157 = __VLS_asFunctionalComponent(__VLS_156, new __VLS_156({
        ...{ 'onClick': {} },
        type: "danger",
        disabled: (!__VLS_ctx.approveComment.trim()),
    }));
    const __VLS_158 = __VLS_157({
        ...{ 'onClick': {} },
        type: "danger",
        disabled: (!__VLS_ctx.approveComment.trim()),
    }, ...__VLS_functionalComponentArgsRest(__VLS_157));
    let __VLS_160;
    let __VLS_161;
    let __VLS_162;
    const __VLS_163 = {
        onClick: (...[$event]) => {
            if (!(__VLS_ctx.currentPub))
                return;
            __VLS_ctx.doApprove(false);
        }
    };
    __VLS_159.slots.default;
    var __VLS_159;
    const __VLS_164 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_165 = __VLS_asFunctionalComponent(__VLS_164, new __VLS_164({
        ...{ 'onClick': {} },
        type: "primary",
        disabled: (!__VLS_ctx.approveComment.trim()),
    }));
    const __VLS_166 = __VLS_165({
        ...{ 'onClick': {} },
        type: "primary",
        disabled: (!__VLS_ctx.approveComment.trim()),
    }, ...__VLS_functionalComponentArgsRest(__VLS_165));
    let __VLS_168;
    let __VLS_169;
    let __VLS_170;
    const __VLS_171 = {
        onClick: (...[$event]) => {
            if (!(__VLS_ctx.currentPub))
                return;
            __VLS_ctx.doApprove(true);
        }
    };
    __VLS_167.slots.default;
    var __VLS_167;
}
else {
    const __VLS_172 = {}.ElEmpty;
    /** @type {[typeof __VLS_components.ElEmpty, typeof __VLS_components.elEmpty, ]} */ ;
    // @ts-ignore
    const __VLS_173 = __VLS_asFunctionalComponent(__VLS_172, new __VLS_172({
        description: "请从左侧选择一条发布申请进行审批",
    }));
    const __VLS_174 = __VLS_173({
        description: "请从左侧选择一条发布申请进行审批",
    }, ...__VLS_functionalComponentArgsRest(__VLS_173));
}
var __VLS_59;
var __VLS_55;
var __VLS_3;
const __VLS_176 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_177 = __VLS_asFunctionalComponent(__VLS_176, new __VLS_176({
    modelValue: (__VLS_ctx.docVisible),
    title: "API 文档生成",
    width: "720px",
}));
const __VLS_178 = __VLS_177({
    modelValue: (__VLS_ctx.docVisible),
    title: "API 文档生成",
    width: "720px",
}, ...__VLS_functionalComponentArgsRest(__VLS_177));
__VLS_179.slots.default;
if (__VLS_ctx.docTarget) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "doc-call" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "dep-text" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.code, __VLS_intrinsicElements.code)({
        ...{ class: "doc-endpoint" },
    });
    (__VLS_ctx.docBaseUrl);
    (__VLS_ctx.docTarget.path);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "doc-rows" },
    });
    for (const [p, i] of __VLS_getVForSourceType((__VLS_ctx.docTarget.params))) {
        const __VLS_180 = {}.ElTag;
        /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
        // @ts-ignore
        const __VLS_181 = __VLS_asFunctionalComponent(__VLS_180, new __VLS_180({
            key: (i),
            size: "small",
            effect: "plain",
            ...{ class: "doc-param" },
        }));
        const __VLS_182 = __VLS_181({
            key: (i),
            size: "small",
            effect: "plain",
            ...{ class: "doc-param" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_181));
        __VLS_183.slots.default;
        (p.name);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "doc-type" },
        });
        (p.type);
        var __VLS_183;
    }
    const __VLS_184 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_185 = __VLS_asFunctionalComponent(__VLS_184, new __VLS_184({
        type: "success",
        size: "small",
        effect: "plain",
        ...{ class: "doc-param" },
    }));
    const __VLS_186 = __VLS_185({
        type: "success",
        size: "small",
        effect: "plain",
        ...{ class: "doc-param" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_185));
    __VLS_187.slots.default;
    var __VLS_187;
    const __VLS_188 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_189 = __VLS_asFunctionalComponent(__VLS_188, new __VLS_188({
        type: "warning",
        size: "small",
        effect: "plain",
        ...{ class: "doc-param" },
    }));
    const __VLS_190 = __VLS_189({
        type: "warning",
        size: "small",
        effect: "plain",
        ...{ class: "doc-param" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_189));
    __VLS_191.slots.default;
    var __VLS_191;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.pre, __VLS_intrinsicElements.pre)({
        ...{ class: "api-code" },
    });
    (__VLS_ctx.docSample);
}
{
    const { footer: __VLS_thisSlot } = __VLS_179.slots;
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
            __VLS_ctx.docVisible = false;
        }
    };
    __VLS_195.slots.default;
    var __VLS_195;
    const __VLS_200 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_201 = __VLS_asFunctionalComponent(__VLS_200, new __VLS_200({
        ...{ 'onClick': {} },
        type: "primary",
    }));
    const __VLS_202 = __VLS_201({
        ...{ 'onClick': {} },
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_201));
    let __VLS_204;
    let __VLS_205;
    let __VLS_206;
    const __VLS_207 = {
        onClick: (__VLS_ctx.downloadDoc)
    };
    __VLS_203.slots.default;
    var __VLS_203;
}
var __VLS_179;
/** @type {__VLS_StyleScopedClasses['standard-page']} */ ;
/** @type {__VLS_StyleScopedClasses['share-publish-page']} */ ;
/** @type {__VLS_StyleScopedClasses['pub-stats']} */ ;
/** @type {__VLS_StyleScopedClasses['pub-stat']} */ ;
/** @type {__VLS_StyleScopedClasses['pub-stat-value']} */ ;
/** @type {__VLS_StyleScopedClasses['pub-stat-label']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['pub-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['toolbar-row']} */ ;
/** @type {__VLS_StyleScopedClasses['search-input-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['pub-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['security-level']} */ ;
/** @type {__VLS_StyleScopedClasses['block-title']} */ ;
/** @type {__VLS_StyleScopedClasses['block-title']} */ ;
/** @type {__VLS_StyleScopedClasses['block-title']} */ ;
/** @type {__VLS_StyleScopedClasses['pub-sql']} */ ;
/** @type {__VLS_StyleScopedClasses['pub-approve']} */ ;
/** @type {__VLS_StyleScopedClasses['pub-form']} */ ;
/** @type {__VLS_StyleScopedClasses['pub-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['doc-call']} */ ;
/** @type {__VLS_StyleScopedClasses['dep-text']} */ ;
/** @type {__VLS_StyleScopedClasses['doc-endpoint']} */ ;
/** @type {__VLS_StyleScopedClasses['doc-rows']} */ ;
/** @type {__VLS_StyleScopedClasses['doc-param']} */ ;
/** @type {__VLS_StyleScopedClasses['doc-type']} */ ;
/** @type {__VLS_StyleScopedClasses['doc-param']} */ ;
/** @type {__VLS_StyleScopedClasses['doc-param']} */ ;
/** @type {__VLS_StyleScopedClasses['api-code']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            DocumentCopy: DocumentCopy,
            Search: Search,
            docBaseUrl: docBaseUrl,
            levelColor: levelColor,
            statsCards: statsCards,
            stageTag: stageTag,
            pubKeyword: pubKeyword,
            currentPubId: currentPubId,
            currentPub: currentPub,
            approveComment: approveComment,
            docVisible: docVisible,
            docTarget: docTarget,
            filteredPendings: filteredPendings,
            selectPub: selectPub,
            doApprove: doApprove,
            genDoc: genDoc,
            docSample: docSample,
            downloadDoc: downloadDoc,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
