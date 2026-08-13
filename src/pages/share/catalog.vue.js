import { computed, ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { Files, Folder, Search, Share, Tickets } from '@element-plus/icons-vue';
const detailBaseUrl = 'https://api.gz-metro-data.cn';
const levelColorMap = { L1: '#8c8c8c', L2: '#2B6CB0', L3: '#ED7B2F', L4: '#DA251D' };
const domainOptions = ['客运票务', '旅客服务', '运营调度', '财务共享', '设备运维'];
const kindOptions = ['实时查询', '指标计算', '数据抽取', '知识问答'];
const services = ref([
    { id: 1, name: '客流统计查询服务', path: '/api/v1/flow/stat', method: 'GET', kind: '实时查询', domain: '运营调度', asset: 'ads_line_flow', level: 'L2', auth: true, limit: '100次/分钟', owner: '张工', publishTime: '2026-08-01 10:00', calls: 2381, params: [{ name: 'line_code', type: 'STRING', required: true }], outputs: [{ name: 'total_passengers', type: 'INT', alias: 'totalPassengers' }] },
    { id: 2, name: '线路基础信息服务', path: '/api/v1/line/detail', method: 'GET', kind: '实时查询', domain: '运营调度', asset: 'line_info', level: 'L1', auth: true, limit: '200次/分钟', owner: '李工', publishTime: '2026-07-28 14:00', calls: 1654, params: [{ name: 'line_code', type: 'STRING', required: true }], outputs: [{ name: 'line_name', type: 'STRING', alias: 'lineName' }] },
    { id: 3, name: '车站信息同步服务', path: '/api/v1/station/list', method: 'GET', kind: '数据抽取', domain: '客运票务', asset: 'station_info', level: 'L1', auth: false, limit: '500次/分钟', owner: '王工', publishTime: '2026-07-25 09:30', calls: 3209, params: [{ name: 'page', type: 'INT', required: false }], outputs: [{ name: 'station_name', type: 'STRING', alias: 'stationName' }] },
    { id: 4, name: '售票明细查询服务', path: '/api/v1/ticket/query', method: 'POST', kind: '实时查询', domain: '客运票务', asset: 'ticket_sale', level: 'L3', auth: true, limit: '50次/分钟', owner: '张工', publishTime: '2026-08-12 18:00', calls: 318, params: [{ name: 'begin_date', type: 'DATE', required: true }], outputs: [{ name: 'order_id', type: 'STRING', alias: 'orderId' }] },
    { id: 5, name: '订单汇总指标服务', path: '/api/v1/order/summary', method: 'GET', kind: '指标计算', domain: '财务共享', asset: 'dws_order_report', level: 'L2', auth: true, limit: '80次/分钟', owner: '李工', publishTime: '2026-08-11 11:20', calls: 892, params: [{ name: 'line_code', type: 'STRING', required: true }], outputs: [{ name: 'total_amount', type: 'DECIMAL', alias: 'totalAmount' }] },
    { id: 6, name: '站点设施知识问答', path: '/api/v1/qa/station', method: 'POST', kind: '知识问答', domain: '旅客服务', asset: '知识库', level: 'L1', auth: true, limit: '30次/分钟', owner: '赵工', publishTime: '2026-08-08 15:10', calls: 420, params: [], outputs: [{ name: 'answer', type: 'STRING', alias: 'answer' }] },
]);
const treeKeyword = ref('');
const svcKeyword = ref('');
const kindFilter = ref('');
const domainFilter = ref('');
const treeKey = ref('');
const treeData = ref([
    { key: 'domain', name: '按业务域', type: 'root', icon: Folder, children: domainOptions.map((d, i) => ({ key: `domain-${i}`, name: d, type: 'domain', icon: Folder })) },
    { key: 'kind', name: '按服务类型', type: 'root', icon: Files, children: kindOptions.map((k, i) => ({ key: `kind-${i}`, name: k, type: 'kind', icon: Tickets })) },
]);
watch(treeKeyword, (v) => treeRef.value?.filter(v));
const treeRef = ref();
const filterTree = (value, data) => data.name.includes(value);
const onNodeClick = (data) => {
    treeKey.value = data.type === 'domain' || data.type === 'kind' ? `${data.type}:${data.name}` : '';
};
const countByDomain = (name) => services.value.filter((s) => s.domain === name).length;
const countByKind = (name) => services.value.filter((s) => s.kind === name).length;
const filterByTree = computed(() => {
    const [type, name] = treeKey.value.split(':');
    return services.value.filter((s) => {
        if (type === 'domain' && s.domain !== name)
            return false;
        if (type === 'kind' && s.kind !== name)
            return false;
        if (kindFilter.value && s.kind !== kindFilter.value)
            return false;
        if (domainFilter.value && s.domain !== domainFilter.value)
            return false;
        if (!svcKeyword.value)
            return true;
        const kw = svcKeyword.value.toLowerCase();
        return s.name.toLowerCase().includes(kw) || s.path.toLowerCase().includes(kw) || s.asset.toLowerCase().includes(kw);
    });
});
const detailVisible = ref(false);
const detailSvc = ref(null);
const openDetail = (s) => {
    detailSvc.value = s;
    detailVisible.value = true;
};
const testSvc = () => ElMessage.info('在线测试即将打开（Mock），可输入参数并查看响应');
const applySvc = () => ElMessage.success('已跳转共享申请流程（Mock）');
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "catalog-page share-catalog-page" },
});
const __VLS_0 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ class: "panel-card catalog-card" },
    shadow: "never",
}));
const __VLS_2 = __VLS_1({
    ...{ class: "panel-card catalog-card" },
    shadow: "never",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "catalog-layout" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "catalog-tree-panel" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "panel-header" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
const __VLS_4 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    modelValue: (__VLS_ctx.treeKeyword),
    placeholder: "筛选分类",
    size: "small",
    clearable: true,
    ...{ class: "mt-12 search-input-sm w-full" },
    prefixIcon: (__VLS_ctx.Search),
}));
const __VLS_6 = __VLS_5({
    modelValue: (__VLS_ctx.treeKeyword),
    placeholder: "筛选分类",
    size: "small",
    clearable: true,
    ...{ class: "mt-12 search-input-sm w-full" },
    prefixIcon: (__VLS_ctx.Search),
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
const __VLS_8 = {}.ElTree;
/** @type {[typeof __VLS_components.ElTree, typeof __VLS_components.elTree, typeof __VLS_components.ElTree, typeof __VLS_components.elTree, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    ...{ 'onNodeClick': {} },
    ref: "treeRef",
    data: (__VLS_ctx.treeData),
    props: ({ label: 'name', children: 'children' }),
    nodeKey: "key",
    defaultExpandAll: true,
    filterNodeMethod: (__VLS_ctx.filterTree),
}));
const __VLS_10 = __VLS_9({
    ...{ 'onNodeClick': {} },
    ref: "treeRef",
    data: (__VLS_ctx.treeData),
    props: ({ label: 'name', children: 'children' }),
    nodeKey: "key",
    defaultExpandAll: true,
    filterNodeMethod: (__VLS_ctx.filterTree),
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
let __VLS_12;
let __VLS_13;
let __VLS_14;
const __VLS_15 = {
    onNodeClick: (__VLS_ctx.onNodeClick)
};
/** @type {typeof __VLS_ctx.treeRef} */ ;
var __VLS_16 = {};
__VLS_11.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_11.slots;
    const [{ data }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "catalog-node" },
    });
    const __VLS_18 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_19 = __VLS_asFunctionalComponent(__VLS_18, new __VLS_18({}));
    const __VLS_20 = __VLS_19({}, ...__VLS_functionalComponentArgsRest(__VLS_19));
    __VLS_21.slots.default;
    const __VLS_22 = ((data.icon));
    // @ts-ignore
    const __VLS_23 = __VLS_asFunctionalComponent(__VLS_22, new __VLS_22({}));
    const __VLS_24 = __VLS_23({}, ...__VLS_functionalComponentArgsRest(__VLS_23));
    var __VLS_21;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (data.name);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "catalog-count" },
    });
    (data.type === 'domain' ? __VLS_ctx.countByDomain(data.name) : data.type === 'kind' ? __VLS_ctx.countByKind(data.name) : '');
}
var __VLS_11;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "catalog-table-panel" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "toolbar-row" },
});
const __VLS_26 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_27 = __VLS_asFunctionalComponent(__VLS_26, new __VLS_26({
    modelValue: (__VLS_ctx.svcKeyword),
    placeholder: "搜索服务名称 / 路径 / 资产",
    clearable: true,
    ...{ class: "search-input" },
    prefixIcon: (__VLS_ctx.Search),
}));
const __VLS_28 = __VLS_27({
    modelValue: (__VLS_ctx.svcKeyword),
    placeholder: "搜索服务名称 / 路径 / 资产",
    clearable: true,
    ...{ class: "search-input" },
    prefixIcon: (__VLS_ctx.Search),
}, ...__VLS_functionalComponentArgsRest(__VLS_27));
const __VLS_30 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_31 = __VLS_asFunctionalComponent(__VLS_30, new __VLS_30({
    modelValue: (__VLS_ctx.kindFilter),
    placeholder: "服务类型",
    clearable: true,
    ...{ class: "filter-select" },
}));
const __VLS_32 = __VLS_31({
    modelValue: (__VLS_ctx.kindFilter),
    placeholder: "服务类型",
    clearable: true,
    ...{ class: "filter-select" },
}, ...__VLS_functionalComponentArgsRest(__VLS_31));
__VLS_33.slots.default;
for (const [k] of __VLS_getVForSourceType((__VLS_ctx.kindOptions))) {
    const __VLS_34 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_35 = __VLS_asFunctionalComponent(__VLS_34, new __VLS_34({
        key: (k),
        label: (k),
        value: (k),
    }));
    const __VLS_36 = __VLS_35({
        key: (k),
        label: (k),
        value: (k),
    }, ...__VLS_functionalComponentArgsRest(__VLS_35));
}
var __VLS_33;
const __VLS_38 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_39 = __VLS_asFunctionalComponent(__VLS_38, new __VLS_38({
    modelValue: (__VLS_ctx.domainFilter),
    placeholder: "业务域",
    clearable: true,
    ...{ class: "filter-select" },
}));
const __VLS_40 = __VLS_39({
    modelValue: (__VLS_ctx.domainFilter),
    placeholder: "业务域",
    clearable: true,
    ...{ class: "filter-select" },
}, ...__VLS_functionalComponentArgsRest(__VLS_39));
__VLS_41.slots.default;
for (const [d] of __VLS_getVForSourceType((__VLS_ctx.domainOptions))) {
    const __VLS_42 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_43 = __VLS_asFunctionalComponent(__VLS_42, new __VLS_42({
        key: (d),
        label: (d),
        value: (d),
    }));
    const __VLS_44 = __VLS_43({
        key: (d),
        label: (d),
        value: (d),
    }, ...__VLS_functionalComponentArgsRest(__VLS_43));
}
var __VLS_41;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "dep-text" },
});
(__VLS_ctx.filterByTree.length);
const __VLS_46 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
// @ts-ignore
const __VLS_47 = __VLS_asFunctionalComponent(__VLS_46, new __VLS_46({
    gutter: (12),
    ...{ class: "catalog-grid" },
}));
const __VLS_48 = __VLS_47({
    gutter: (12),
    ...{ class: "catalog-grid" },
}, ...__VLS_functionalComponentArgsRest(__VLS_47));
__VLS_49.slots.default;
for (const [s] of __VLS_getVForSourceType((__VLS_ctx.filterByTree))) {
    const __VLS_50 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_51 = __VLS_asFunctionalComponent(__VLS_50, new __VLS_50({
        key: (s.id),
        span: (8),
    }));
    const __VLS_52 = __VLS_51({
        key: (s.id),
        span: (8),
    }, ...__VLS_functionalComponentArgsRest(__VLS_51));
    __VLS_53.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.openDetail(s);
            } },
        ...{ class: "svc-card" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "svc-card-top" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "svc-icon" },
    });
    const __VLS_54 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_55 = __VLS_asFunctionalComponent(__VLS_54, new __VLS_54({}));
    const __VLS_56 = __VLS_55({}, ...__VLS_functionalComponentArgsRest(__VLS_55));
    __VLS_57.slots.default;
    const __VLS_58 = {}.Share;
    /** @type {[typeof __VLS_components.Share, ]} */ ;
    // @ts-ignore
    const __VLS_59 = __VLS_asFunctionalComponent(__VLS_58, new __VLS_58({}));
    const __VLS_60 = __VLS_59({}, ...__VLS_functionalComponentArgsRest(__VLS_59));
    var __VLS_57;
    const __VLS_62 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_63 = __VLS_asFunctionalComponent(__VLS_62, new __VLS_62({
        size: "small",
        type: "success",
        effect: "dark",
    }));
    const __VLS_64 = __VLS_63({
        size: "small",
        type: "success",
        effect: "dark",
    }, ...__VLS_functionalComponentArgsRest(__VLS_63));
    __VLS_65.slots.default;
    var __VLS_65;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "svc-name" },
    });
    (s.name);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "svc-path" },
    });
    (s.path);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "svc-meta" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (s.kind);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (s.method);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ style: ({ color: __VLS_ctx.levelColorMap[s.level] }) },
    });
    (s.level);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "svc-footer" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "dep-text" },
    });
    (s.calls);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "dep-text" },
    });
    (s.owner);
    var __VLS_53;
}
var __VLS_49;
if (!__VLS_ctx.filterByTree.length) {
    const __VLS_66 = {}.ElEmpty;
    /** @type {[typeof __VLS_components.ElEmpty, typeof __VLS_components.elEmpty, ]} */ ;
    // @ts-ignore
    const __VLS_67 = __VLS_asFunctionalComponent(__VLS_66, new __VLS_66({
        description: "当前分类下暂无已发布服务",
    }));
    const __VLS_68 = __VLS_67({
        description: "当前分类下暂无已发布服务",
    }, ...__VLS_functionalComponentArgsRest(__VLS_67));
}
var __VLS_3;
const __VLS_70 = {}.ElDrawer;
/** @type {[typeof __VLS_components.ElDrawer, typeof __VLS_components.elDrawer, typeof __VLS_components.ElDrawer, typeof __VLS_components.elDrawer, ]} */ ;
// @ts-ignore
const __VLS_71 = __VLS_asFunctionalComponent(__VLS_70, new __VLS_70({
    modelValue: (__VLS_ctx.detailVisible),
    title: "服务详情",
    size: "480px",
}));
const __VLS_72 = __VLS_71({
    modelValue: (__VLS_ctx.detailVisible),
    title: "服务详情",
    size: "480px",
}, ...__VLS_functionalComponentArgsRest(__VLS_71));
__VLS_73.slots.default;
if (__VLS_ctx.detailSvc) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "detail-head" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "detail-name" },
    });
    (__VLS_ctx.detailSvc.name);
    const __VLS_74 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_75 = __VLS_asFunctionalComponent(__VLS_74, new __VLS_74({
        type: "success",
        size: "small",
        effect: "dark",
    }));
    const __VLS_76 = __VLS_75({
        type: "success",
        size: "small",
        effect: "dark",
    }, ...__VLS_functionalComponentArgsRest(__VLS_75));
    __VLS_77.slots.default;
    var __VLS_77;
    const __VLS_78 = {}.ElDescriptions;
    /** @type {[typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, ]} */ ;
    // @ts-ignore
    const __VLS_79 = __VLS_asFunctionalComponent(__VLS_78, new __VLS_78({
        column: (1),
        border: true,
        size: "small",
        ...{ class: "mt-12" },
    }));
    const __VLS_80 = __VLS_79({
        column: (1),
        border: true,
        size: "small",
        ...{ class: "mt-12" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_79));
    __VLS_81.slots.default;
    const __VLS_82 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_83 = __VLS_asFunctionalComponent(__VLS_82, new __VLS_82({
        label: "调用地址",
    }));
    const __VLS_84 = __VLS_83({
        label: "调用地址",
    }, ...__VLS_functionalComponentArgsRest(__VLS_83));
    __VLS_85.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.code, __VLS_intrinsicElements.code)({
        ...{ class: "detail-call" },
    });
    (__VLS_ctx.detailBaseUrl);
    (__VLS_ctx.detailSvc.path);
    var __VLS_85;
    const __VLS_86 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_87 = __VLS_asFunctionalComponent(__VLS_86, new __VLS_86({
        label: "请求方式",
    }));
    const __VLS_88 = __VLS_87({
        label: "请求方式",
    }, ...__VLS_functionalComponentArgsRest(__VLS_87));
    __VLS_89.slots.default;
    (__VLS_ctx.detailSvc.method);
    var __VLS_89;
    const __VLS_90 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_91 = __VLS_asFunctionalComponent(__VLS_90, new __VLS_90({
        label: "服务类型",
    }));
    const __VLS_92 = __VLS_91({
        label: "服务类型",
    }, ...__VLS_functionalComponentArgsRest(__VLS_91));
    __VLS_93.slots.default;
    (__VLS_ctx.detailSvc.kind);
    var __VLS_93;
    const __VLS_94 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_95 = __VLS_asFunctionalComponent(__VLS_94, new __VLS_94({
        label: "所属业务域",
    }));
    const __VLS_96 = __VLS_95({
        label: "所属业务域",
    }, ...__VLS_functionalComponentArgsRest(__VLS_95));
    __VLS_97.slots.default;
    (__VLS_ctx.detailSvc.domain);
    var __VLS_97;
    const __VLS_98 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_99 = __VLS_asFunctionalComponent(__VLS_98, new __VLS_98({
        label: "封装资产",
    }));
    const __VLS_100 = __VLS_99({
        label: "封装资产",
    }, ...__VLS_functionalComponentArgsRest(__VLS_99));
    __VLS_101.slots.default;
    (__VLS_ctx.detailSvc.asset);
    var __VLS_101;
    const __VLS_102 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_103 = __VLS_asFunctionalComponent(__VLS_102, new __VLS_102({
        label: "数据分级",
    }));
    const __VLS_104 = __VLS_103({
        label: "数据分级",
    }, ...__VLS_functionalComponentArgsRest(__VLS_103));
    __VLS_105.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "security-level" },
        ...{ style: ({ background: __VLS_ctx.levelColorMap[__VLS_ctx.detailSvc.level] }) },
    });
    (__VLS_ctx.detailSvc.level);
    var __VLS_105;
    const __VLS_106 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_107 = __VLS_asFunctionalComponent(__VLS_106, new __VLS_106({
        label: "鉴权方式",
    }));
    const __VLS_108 = __VLS_107({
        label: "鉴权方式",
    }, ...__VLS_functionalComponentArgsRest(__VLS_107));
    __VLS_109.slots.default;
    (__VLS_ctx.detailSvc.auth ? 'AppKey/Secret' : '免鉴权');
    var __VLS_109;
    const __VLS_110 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_111 = __VLS_asFunctionalComponent(__VLS_110, new __VLS_110({
        label: "限流策略",
    }));
    const __VLS_112 = __VLS_111({
        label: "限流策略",
    }, ...__VLS_functionalComponentArgsRest(__VLS_111));
    __VLS_113.slots.default;
    (__VLS_ctx.detailSvc.limit);
    var __VLS_113;
    const __VLS_114 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_115 = __VLS_asFunctionalComponent(__VLS_114, new __VLS_114({
        label: "服务负责人",
    }));
    const __VLS_116 = __VLS_115({
        label: "服务负责人",
    }, ...__VLS_functionalComponentArgsRest(__VLS_115));
    __VLS_117.slots.default;
    (__VLS_ctx.detailSvc.owner);
    var __VLS_117;
    const __VLS_118 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_119 = __VLS_asFunctionalComponent(__VLS_118, new __VLS_118({
        label: "发布时间",
    }));
    const __VLS_120 = __VLS_119({
        label: "发布时间",
    }, ...__VLS_functionalComponentArgsRest(__VLS_119));
    __VLS_121.slots.default;
    (__VLS_ctx.detailSvc.publishTime);
    var __VLS_121;
    var __VLS_81;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "detail-section" },
    });
    const __VLS_122 = {}.ElTable;
    /** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
    // @ts-ignore
    const __VLS_123 = __VLS_asFunctionalComponent(__VLS_122, new __VLS_122({
        data: (__VLS_ctx.detailSvc.params),
        size: "small",
        border: true,
    }));
    const __VLS_124 = __VLS_123({
        data: (__VLS_ctx.detailSvc.params),
        size: "small",
        border: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_123));
    __VLS_125.slots.default;
    const __VLS_126 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_127 = __VLS_asFunctionalComponent(__VLS_126, new __VLS_126({
        prop: "name",
        label: "参数名",
    }));
    const __VLS_128 = __VLS_127({
        prop: "name",
        label: "参数名",
    }, ...__VLS_functionalComponentArgsRest(__VLS_127));
    const __VLS_130 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_131 = __VLS_asFunctionalComponent(__VLS_130, new __VLS_130({
        prop: "type",
        label: "类型",
        width: "90",
    }));
    const __VLS_132 = __VLS_131({
        prop: "type",
        label: "类型",
        width: "90",
    }, ...__VLS_functionalComponentArgsRest(__VLS_131));
    const __VLS_134 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_135 = __VLS_asFunctionalComponent(__VLS_134, new __VLS_134({
        label: "必填",
        width: "60",
        align: "center",
    }));
    const __VLS_136 = __VLS_135({
        label: "必填",
        width: "60",
        align: "center",
    }, ...__VLS_functionalComponentArgsRest(__VLS_135));
    __VLS_137.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_137.slots;
        const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
        (row.required ? '是' : '否');
    }
    var __VLS_137;
    var __VLS_125;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "detail-section" },
    });
    const __VLS_138 = {}.ElTable;
    /** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
    // @ts-ignore
    const __VLS_139 = __VLS_asFunctionalComponent(__VLS_138, new __VLS_138({
        data: (__VLS_ctx.detailSvc.outputs),
        size: "small",
        border: true,
    }));
    const __VLS_140 = __VLS_139({
        data: (__VLS_ctx.detailSvc.outputs),
        size: "small",
        border: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_139));
    __VLS_141.slots.default;
    const __VLS_142 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_143 = __VLS_asFunctionalComponent(__VLS_142, new __VLS_142({
        prop: "name",
        label: "字段名",
    }));
    const __VLS_144 = __VLS_143({
        prop: "name",
        label: "字段名",
    }, ...__VLS_functionalComponentArgsRest(__VLS_143));
    const __VLS_146 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_147 = __VLS_asFunctionalComponent(__VLS_146, new __VLS_146({
        prop: "type",
        label: "类型",
        width: "100",
    }));
    const __VLS_148 = __VLS_147({
        prop: "type",
        label: "类型",
        width: "100",
    }, ...__VLS_functionalComponentArgsRest(__VLS_147));
    const __VLS_150 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_151 = __VLS_asFunctionalComponent(__VLS_150, new __VLS_150({
        prop: "alias",
        label: "别名",
    }));
    const __VLS_152 = __VLS_151({
        prop: "alias",
        label: "别名",
    }, ...__VLS_functionalComponentArgsRest(__VLS_151));
    var __VLS_141;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "detail-actions" },
    });
    const __VLS_154 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_155 = __VLS_asFunctionalComponent(__VLS_154, new __VLS_154({
        ...{ 'onClick': {} },
        type: "primary",
        plain: true,
    }));
    const __VLS_156 = __VLS_155({
        ...{ 'onClick': {} },
        type: "primary",
        plain: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_155));
    let __VLS_158;
    let __VLS_159;
    let __VLS_160;
    const __VLS_161 = {
        onClick: (__VLS_ctx.testSvc)
    };
    __VLS_157.slots.default;
    var __VLS_157;
    const __VLS_162 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_163 = __VLS_asFunctionalComponent(__VLS_162, new __VLS_162({
        ...{ 'onClick': {} },
        type: "danger",
        plain: true,
    }));
    const __VLS_164 = __VLS_163({
        ...{ 'onClick': {} },
        type: "danger",
        plain: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_163));
    let __VLS_166;
    let __VLS_167;
    let __VLS_168;
    const __VLS_169 = {
        onClick: (__VLS_ctx.applySvc)
    };
    __VLS_165.slots.default;
    var __VLS_165;
}
var __VLS_73;
/** @type {__VLS_StyleScopedClasses['catalog-page']} */ ;
/** @type {__VLS_StyleScopedClasses['share-catalog-page']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['catalog-card']} */ ;
/** @type {__VLS_StyleScopedClasses['catalog-layout']} */ ;
/** @type {__VLS_StyleScopedClasses['catalog-tree-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-12']} */ ;
/** @type {__VLS_StyleScopedClasses['search-input-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['catalog-node']} */ ;
/** @type {__VLS_StyleScopedClasses['catalog-count']} */ ;
/** @type {__VLS_StyleScopedClasses['catalog-table-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['toolbar-row']} */ ;
/** @type {__VLS_StyleScopedClasses['search-input']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-select']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-select']} */ ;
/** @type {__VLS_StyleScopedClasses['dep-text']} */ ;
/** @type {__VLS_StyleScopedClasses['catalog-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['svc-card']} */ ;
/** @type {__VLS_StyleScopedClasses['svc-card-top']} */ ;
/** @type {__VLS_StyleScopedClasses['svc-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['svc-name']} */ ;
/** @type {__VLS_StyleScopedClasses['svc-path']} */ ;
/** @type {__VLS_StyleScopedClasses['svc-meta']} */ ;
/** @type {__VLS_StyleScopedClasses['svc-footer']} */ ;
/** @type {__VLS_StyleScopedClasses['dep-text']} */ ;
/** @type {__VLS_StyleScopedClasses['dep-text']} */ ;
/** @type {__VLS_StyleScopedClasses['detail-head']} */ ;
/** @type {__VLS_StyleScopedClasses['detail-name']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-12']} */ ;
/** @type {__VLS_StyleScopedClasses['detail-call']} */ ;
/** @type {__VLS_StyleScopedClasses['security-level']} */ ;
/** @type {__VLS_StyleScopedClasses['detail-section']} */ ;
/** @type {__VLS_StyleScopedClasses['detail-section']} */ ;
/** @type {__VLS_StyleScopedClasses['detail-actions']} */ ;
// @ts-ignore
var __VLS_17 = __VLS_16;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Search: Search,
            Share: Share,
            detailBaseUrl: detailBaseUrl,
            levelColorMap: levelColorMap,
            domainOptions: domainOptions,
            kindOptions: kindOptions,
            treeKeyword: treeKeyword,
            svcKeyword: svcKeyword,
            kindFilter: kindFilter,
            domainFilter: domainFilter,
            treeData: treeData,
            treeRef: treeRef,
            filterTree: filterTree,
            onNodeClick: onNodeClick,
            countByDomain: countByDomain,
            countByKind: countByKind,
            filterByTree: filterByTree,
            detailVisible: detailVisible,
            detailSvc: detailSvc,
            openDetail: openDetail,
            testSvc: testSvc,
            applySvc: applySvc,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
