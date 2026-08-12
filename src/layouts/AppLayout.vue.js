import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { Aim, Bell, Setting, Checked, Clock, Coin, Connection, DataAnalysis, DataLine, Document, DocumentChecked, DocumentCopy, Download, Edit, Expand, Files, Fold, Folder, FolderOpened, Grid, List, Lock, Monitor, PriceTag, Promotion, Search, SetUp, Share, Tickets, TrendCharts, Trophy, UserFilled, VideoCamera, View, WindPower } from '@element-plus/icons-vue';
const route = useRoute();
const collapsed = ref(false);
const pageTitleMap = {
    '/dashboard': { parent: '', current: '工作台' },
    '/standard/list': { parent: '数据标准管理', current: '标准列表' },
    '/standard/model-design': { parent: '数据标准管理', current: '模型设计' },
    '/standard/quality-standard': { parent: '数据标准管理', current: '数据质量标准' },
    '/standard/implementation': { parent: '数据标准管理', current: '标准实施监控' },
    '/standard/version': { parent: '数据标准管理', current: '版本管理' },
    '/datasource/list': { parent: '数据源管理', current: '数据源列表' },
    '/datasource/register': { parent: '数据源管理', current: '数据源注册' },
    '/datasource/connection-pool': { parent: '数据源管理', current: '连接池管理' },
    '/datasource/template': { parent: '数据源管理', current: '参数模板管理' },
    '/datasource/group': { parent: '数据源管理', current: '分组管理' },
    '/datasource/monitor': { parent: '数据源管理', current: '数据源监控' },
    '/datadev/overview': { parent: '数据开发集成', current: '开发总览' },
    '/datadev/batch': { parent: '数据开发集成', current: '批量处理' },
    '/datadev/realtime': { parent: '数据开发集成', current: '实时处理' },
    '/datadev/stream': { parent: '数据开发集成', current: '流式数据处理' },
    '/datadev/task': { parent: '数据开发集成', current: '任务管理' },
    '/datadev/monitor': { parent: '数据开发集成', current: '任务监控' },
    '/datadev/flow': { parent: '数据开发集成', current: '流程化配置' },
    '/datadev/security': { parent: '数据开发集成', current: '安全与合规' },
    '/quality/overview': { parent: '数据质量管理', current: '质量总览' },
    '/quality/rule': { parent: '数据质量管理', current: '规则定义' },
    '/quality/task': { parent: '数据质量管理', current: '质量任务' },
    '/quality/audit': { parent: '数据质量管理', current: '审计与合规' },
    '/quality/certification': { parent: '数据质量管理', current: '质量认证' },
    '/quality/report': { parent: '数据质量管理', current: '质量报告' },
    '/resource/overview': { parent: '数据资源管理', current: '资源总览' },
    '/resource/catalog': { parent: '数据资源管理', current: '资源目录' },
    '/resource/preview': { parent: '数据资源管理', current: '数据预览' },
    '/resource/permission': { parent: '数据资源管理', current: '权限申请与审批' },
    '/resource/lineage': { parent: '数据资源管理', current: '血缘分析' },
    '/resource/feature': { parent: '数据资源管理', current: '特征自动识别' },
    '/resource/explore': { parent: '数据资源管理', current: '探查任务管理' },
    '/metadata/overview': { parent: '元数据管理', current: '元数据总览' },
    '/metadata/model': { parent: '元数据管理', current: '元模型管理' },
    '/metadata/data-element': { parent: '元数据管理', current: '数据元管理' },
    '/metadata/collection': { parent: '元数据管理', current: '元数据采集' },
    '/metadata/lineage': { parent: '元数据管理', current: '血缘解析' },
    '/metadata/tag': { parent: '元数据管理', current: '数据标签管理' },
};
const breadcrumb = computed(() => {
    const matched = Object.keys(pageTitleMap)
        .filter((path) => route.path.startsWith(path))
        .sort((a, b) => b.length - a.length)[0];
    return pageTitleMap[matched ?? '/dashboard'];
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "app-shell" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.aside, __VLS_intrinsicElements.aside)({
    ...{ class: "sidebar" },
    ...{ class: ({ collapsed: __VLS_ctx.collapsed }) },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "brand" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "brand-mark" },
});
if (!__VLS_ctx.collapsed) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "brand-text" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "brand-title" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "brand-subtitle" },
    });
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "sidebar-divider" },
});
const __VLS_0 = {}.ElMenu;
/** @type {[typeof __VLS_components.ElMenu, typeof __VLS_components.elMenu, typeof __VLS_components.ElMenu, typeof __VLS_components.elMenu, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ class: "sidebar-menu" },
    router: true,
    defaultActive: (__VLS_ctx.route.path),
    collapse: (__VLS_ctx.collapsed),
    collapseTransition: (false),
    backgroundColor: "#ffffff",
    textColor: "#4a4a4a",
    activeTextColor: "#da251d",
}));
const __VLS_2 = __VLS_1({
    ...{ class: "sidebar-menu" },
    router: true,
    defaultActive: (__VLS_ctx.route.path),
    collapse: (__VLS_ctx.collapsed),
    collapseTransition: (false),
    backgroundColor: "#ffffff",
    textColor: "#4a4a4a",
    activeTextColor: "#da251d",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
const __VLS_4 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    index: "/dashboard",
}));
const __VLS_6 = __VLS_5({
    index: "/dashboard",
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
__VLS_7.slots.default;
const __VLS_8 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({}));
const __VLS_10 = __VLS_9({}, ...__VLS_functionalComponentArgsRest(__VLS_9));
__VLS_11.slots.default;
const __VLS_12 = {}.Monitor;
/** @type {[typeof __VLS_components.Monitor, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({}));
const __VLS_14 = __VLS_13({}, ...__VLS_functionalComponentArgsRest(__VLS_13));
var __VLS_11;
{
    const { title: __VLS_thisSlot } = __VLS_7.slots;
}
var __VLS_7;
const __VLS_16 = {}.ElSubMenu;
/** @type {[typeof __VLS_components.ElSubMenu, typeof __VLS_components.elSubMenu, typeof __VLS_components.ElSubMenu, typeof __VLS_components.elSubMenu, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    index: "/standard",
}));
const __VLS_18 = __VLS_17({
    index: "/standard",
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
__VLS_19.slots.default;
{
    const { title: __VLS_thisSlot } = __VLS_19.slots;
    const __VLS_20 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({}));
    const __VLS_22 = __VLS_21({}, ...__VLS_functionalComponentArgsRest(__VLS_21));
    __VLS_23.slots.default;
    const __VLS_24 = {}.Files;
    /** @type {[typeof __VLS_components.Files, ]} */ ;
    // @ts-ignore
    const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({}));
    const __VLS_26 = __VLS_25({}, ...__VLS_functionalComponentArgsRest(__VLS_25));
    var __VLS_23;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
}
const __VLS_28 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
    index: "/standard/list",
}));
const __VLS_30 = __VLS_29({
    index: "/standard/list",
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
__VLS_31.slots.default;
const __VLS_32 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({}));
const __VLS_34 = __VLS_33({}, ...__VLS_functionalComponentArgsRest(__VLS_33));
__VLS_35.slots.default;
const __VLS_36 = {}.Tickets;
/** @type {[typeof __VLS_components.Tickets, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({}));
const __VLS_38 = __VLS_37({}, ...__VLS_functionalComponentArgsRest(__VLS_37));
var __VLS_35;
{
    const { title: __VLS_thisSlot } = __VLS_31.slots;
}
var __VLS_31;
const __VLS_40 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
    index: "/standard/model-design",
}));
const __VLS_42 = __VLS_41({
    index: "/standard/model-design",
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
__VLS_43.slots.default;
const __VLS_44 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({}));
const __VLS_46 = __VLS_45({}, ...__VLS_functionalComponentArgsRest(__VLS_45));
__VLS_47.slots.default;
const __VLS_48 = {}.Grid;
/** @type {[typeof __VLS_components.Grid, ]} */ ;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({}));
const __VLS_50 = __VLS_49({}, ...__VLS_functionalComponentArgsRest(__VLS_49));
var __VLS_47;
{
    const { title: __VLS_thisSlot } = __VLS_43.slots;
}
var __VLS_43;
const __VLS_52 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
    index: "/standard/quality-standard",
}));
const __VLS_54 = __VLS_53({
    index: "/standard/quality-standard",
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
__VLS_55.slots.default;
const __VLS_56 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({}));
const __VLS_58 = __VLS_57({}, ...__VLS_functionalComponentArgsRest(__VLS_57));
__VLS_59.slots.default;
const __VLS_60 = {}.Checked;
/** @type {[typeof __VLS_components.Checked, ]} */ ;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({}));
const __VLS_62 = __VLS_61({}, ...__VLS_functionalComponentArgsRest(__VLS_61));
var __VLS_59;
{
    const { title: __VLS_thisSlot } = __VLS_55.slots;
}
var __VLS_55;
const __VLS_64 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
    index: "/standard/implementation",
}));
const __VLS_66 = __VLS_65({
    index: "/standard/implementation",
}, ...__VLS_functionalComponentArgsRest(__VLS_65));
__VLS_67.slots.default;
const __VLS_68 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({}));
const __VLS_70 = __VLS_69({}, ...__VLS_functionalComponentArgsRest(__VLS_69));
__VLS_71.slots.default;
const __VLS_72 = {}.TrendCharts;
/** @type {[typeof __VLS_components.TrendCharts, ]} */ ;
// @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({}));
const __VLS_74 = __VLS_73({}, ...__VLS_functionalComponentArgsRest(__VLS_73));
var __VLS_71;
{
    const { title: __VLS_thisSlot } = __VLS_67.slots;
}
var __VLS_67;
const __VLS_76 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
    index: "/standard/version",
}));
const __VLS_78 = __VLS_77({
    index: "/standard/version",
}, ...__VLS_functionalComponentArgsRest(__VLS_77));
__VLS_79.slots.default;
const __VLS_80 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({}));
const __VLS_82 = __VLS_81({}, ...__VLS_functionalComponentArgsRest(__VLS_81));
__VLS_83.slots.default;
const __VLS_84 = {}.Clock;
/** @type {[typeof __VLS_components.Clock, ]} */ ;
// @ts-ignore
const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({}));
const __VLS_86 = __VLS_85({}, ...__VLS_functionalComponentArgsRest(__VLS_85));
var __VLS_83;
{
    const { title: __VLS_thisSlot } = __VLS_79.slots;
}
var __VLS_79;
var __VLS_19;
const __VLS_88 = {}.ElSubMenu;
/** @type {[typeof __VLS_components.ElSubMenu, typeof __VLS_components.elSubMenu, typeof __VLS_components.ElSubMenu, typeof __VLS_components.elSubMenu, ]} */ ;
// @ts-ignore
const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
    index: "/datasource",
}));
const __VLS_90 = __VLS_89({
    index: "/datasource",
}, ...__VLS_functionalComponentArgsRest(__VLS_89));
__VLS_91.slots.default;
{
    const { title: __VLS_thisSlot } = __VLS_91.slots;
    const __VLS_92 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({}));
    const __VLS_94 = __VLS_93({}, ...__VLS_functionalComponentArgsRest(__VLS_93));
    __VLS_95.slots.default;
    const __VLS_96 = {}.Connection;
    /** @type {[typeof __VLS_components.Connection, ]} */ ;
    // @ts-ignore
    const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({}));
    const __VLS_98 = __VLS_97({}, ...__VLS_functionalComponentArgsRest(__VLS_97));
    var __VLS_95;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
}
const __VLS_100 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
    index: "/datasource/list",
}));
const __VLS_102 = __VLS_101({
    index: "/datasource/list",
}, ...__VLS_functionalComponentArgsRest(__VLS_101));
__VLS_103.slots.default;
const __VLS_104 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({}));
const __VLS_106 = __VLS_105({}, ...__VLS_functionalComponentArgsRest(__VLS_105));
__VLS_107.slots.default;
const __VLS_108 = {}.List;
/** @type {[typeof __VLS_components.List, ]} */ ;
// @ts-ignore
const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({}));
const __VLS_110 = __VLS_109({}, ...__VLS_functionalComponentArgsRest(__VLS_109));
var __VLS_107;
{
    const { title: __VLS_thisSlot } = __VLS_103.slots;
}
var __VLS_103;
const __VLS_112 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
    index: "/datasource/register",
}));
const __VLS_114 = __VLS_113({
    index: "/datasource/register",
}, ...__VLS_functionalComponentArgsRest(__VLS_113));
__VLS_115.slots.default;
const __VLS_116 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({}));
const __VLS_118 = __VLS_117({}, ...__VLS_functionalComponentArgsRest(__VLS_117));
__VLS_119.slots.default;
const __VLS_120 = {}.Edit;
/** @type {[typeof __VLS_components.Edit, ]} */ ;
// @ts-ignore
const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({}));
const __VLS_122 = __VLS_121({}, ...__VLS_functionalComponentArgsRest(__VLS_121));
var __VLS_119;
{
    const { title: __VLS_thisSlot } = __VLS_115.slots;
}
var __VLS_115;
const __VLS_124 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
const __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({
    index: "/datasource/connection-pool",
}));
const __VLS_126 = __VLS_125({
    index: "/datasource/connection-pool",
}, ...__VLS_functionalComponentArgsRest(__VLS_125));
__VLS_127.slots.default;
const __VLS_128 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({}));
const __VLS_130 = __VLS_129({}, ...__VLS_functionalComponentArgsRest(__VLS_129));
__VLS_131.slots.default;
const __VLS_132 = {}.SetUp;
/** @type {[typeof __VLS_components.SetUp, ]} */ ;
// @ts-ignore
const __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132({}));
const __VLS_134 = __VLS_133({}, ...__VLS_functionalComponentArgsRest(__VLS_133));
var __VLS_131;
{
    const { title: __VLS_thisSlot } = __VLS_127.slots;
}
var __VLS_127;
const __VLS_136 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
const __VLS_137 = __VLS_asFunctionalComponent(__VLS_136, new __VLS_136({
    index: "/datasource/template",
}));
const __VLS_138 = __VLS_137({
    index: "/datasource/template",
}, ...__VLS_functionalComponentArgsRest(__VLS_137));
__VLS_139.slots.default;
const __VLS_140 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_141 = __VLS_asFunctionalComponent(__VLS_140, new __VLS_140({}));
const __VLS_142 = __VLS_141({}, ...__VLS_functionalComponentArgsRest(__VLS_141));
__VLS_143.slots.default;
const __VLS_144 = {}.Files;
/** @type {[typeof __VLS_components.Files, ]} */ ;
// @ts-ignore
const __VLS_145 = __VLS_asFunctionalComponent(__VLS_144, new __VLS_144({}));
const __VLS_146 = __VLS_145({}, ...__VLS_functionalComponentArgsRest(__VLS_145));
var __VLS_143;
{
    const { title: __VLS_thisSlot } = __VLS_139.slots;
}
var __VLS_139;
const __VLS_148 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
const __VLS_149 = __VLS_asFunctionalComponent(__VLS_148, new __VLS_148({
    index: "/datasource/group",
}));
const __VLS_150 = __VLS_149({
    index: "/datasource/group",
}, ...__VLS_functionalComponentArgsRest(__VLS_149));
__VLS_151.slots.default;
const __VLS_152 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_153 = __VLS_asFunctionalComponent(__VLS_152, new __VLS_152({}));
const __VLS_154 = __VLS_153({}, ...__VLS_functionalComponentArgsRest(__VLS_153));
__VLS_155.slots.default;
const __VLS_156 = {}.Folder;
/** @type {[typeof __VLS_components.Folder, ]} */ ;
// @ts-ignore
const __VLS_157 = __VLS_asFunctionalComponent(__VLS_156, new __VLS_156({}));
const __VLS_158 = __VLS_157({}, ...__VLS_functionalComponentArgsRest(__VLS_157));
var __VLS_155;
{
    const { title: __VLS_thisSlot } = __VLS_151.slots;
}
var __VLS_151;
const __VLS_160 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
const __VLS_161 = __VLS_asFunctionalComponent(__VLS_160, new __VLS_160({
    index: "/datasource/monitor",
}));
const __VLS_162 = __VLS_161({
    index: "/datasource/monitor",
}, ...__VLS_functionalComponentArgsRest(__VLS_161));
__VLS_163.slots.default;
const __VLS_164 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_165 = __VLS_asFunctionalComponent(__VLS_164, new __VLS_164({}));
const __VLS_166 = __VLS_165({}, ...__VLS_functionalComponentArgsRest(__VLS_165));
__VLS_167.slots.default;
const __VLS_168 = {}.Monitor;
/** @type {[typeof __VLS_components.Monitor, ]} */ ;
// @ts-ignore
const __VLS_169 = __VLS_asFunctionalComponent(__VLS_168, new __VLS_168({}));
const __VLS_170 = __VLS_169({}, ...__VLS_functionalComponentArgsRest(__VLS_169));
var __VLS_167;
{
    const { title: __VLS_thisSlot } = __VLS_163.slots;
}
var __VLS_163;
var __VLS_91;
const __VLS_172 = {}.ElSubMenu;
/** @type {[typeof __VLS_components.ElSubMenu, typeof __VLS_components.elSubMenu, typeof __VLS_components.ElSubMenu, typeof __VLS_components.elSubMenu, ]} */ ;
// @ts-ignore
const __VLS_173 = __VLS_asFunctionalComponent(__VLS_172, new __VLS_172({
    index: "/metadata",
}));
const __VLS_174 = __VLS_173({
    index: "/metadata",
}, ...__VLS_functionalComponentArgsRest(__VLS_173));
__VLS_175.slots.default;
{
    const { title: __VLS_thisSlot } = __VLS_175.slots;
    const __VLS_176 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_177 = __VLS_asFunctionalComponent(__VLS_176, new __VLS_176({}));
    const __VLS_178 = __VLS_177({}, ...__VLS_functionalComponentArgsRest(__VLS_177));
    __VLS_179.slots.default;
    const __VLS_180 = {}.Coin;
    /** @type {[typeof __VLS_components.Coin, ]} */ ;
    // @ts-ignore
    const __VLS_181 = __VLS_asFunctionalComponent(__VLS_180, new __VLS_180({}));
    const __VLS_182 = __VLS_181({}, ...__VLS_functionalComponentArgsRest(__VLS_181));
    var __VLS_179;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
}
const __VLS_184 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
const __VLS_185 = __VLS_asFunctionalComponent(__VLS_184, new __VLS_184({
    index: "/metadata/overview",
}));
const __VLS_186 = __VLS_185({
    index: "/metadata/overview",
}, ...__VLS_functionalComponentArgsRest(__VLS_185));
__VLS_187.slots.default;
const __VLS_188 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_189 = __VLS_asFunctionalComponent(__VLS_188, new __VLS_188({}));
const __VLS_190 = __VLS_189({}, ...__VLS_functionalComponentArgsRest(__VLS_189));
__VLS_191.slots.default;
const __VLS_192 = {}.DataAnalysis;
/** @type {[typeof __VLS_components.DataAnalysis, ]} */ ;
// @ts-ignore
const __VLS_193 = __VLS_asFunctionalComponent(__VLS_192, new __VLS_192({}));
const __VLS_194 = __VLS_193({}, ...__VLS_functionalComponentArgsRest(__VLS_193));
var __VLS_191;
{
    const { title: __VLS_thisSlot } = __VLS_187.slots;
}
var __VLS_187;
const __VLS_196 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
const __VLS_197 = __VLS_asFunctionalComponent(__VLS_196, new __VLS_196({
    index: "/metadata/model",
}));
const __VLS_198 = __VLS_197({
    index: "/metadata/model",
}, ...__VLS_functionalComponentArgsRest(__VLS_197));
__VLS_199.slots.default;
const __VLS_200 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_201 = __VLS_asFunctionalComponent(__VLS_200, new __VLS_200({}));
const __VLS_202 = __VLS_201({}, ...__VLS_functionalComponentArgsRest(__VLS_201));
__VLS_203.slots.default;
const __VLS_204 = {}.Grid;
/** @type {[typeof __VLS_components.Grid, ]} */ ;
// @ts-ignore
const __VLS_205 = __VLS_asFunctionalComponent(__VLS_204, new __VLS_204({}));
const __VLS_206 = __VLS_205({}, ...__VLS_functionalComponentArgsRest(__VLS_205));
var __VLS_203;
{
    const { title: __VLS_thisSlot } = __VLS_199.slots;
}
var __VLS_199;
const __VLS_208 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
const __VLS_209 = __VLS_asFunctionalComponent(__VLS_208, new __VLS_208({
    index: "/metadata/data-element",
}));
const __VLS_210 = __VLS_209({
    index: "/metadata/data-element",
}, ...__VLS_functionalComponentArgsRest(__VLS_209));
__VLS_211.slots.default;
const __VLS_212 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_213 = __VLS_asFunctionalComponent(__VLS_212, new __VLS_212({}));
const __VLS_214 = __VLS_213({}, ...__VLS_functionalComponentArgsRest(__VLS_213));
__VLS_215.slots.default;
const __VLS_216 = {}.Document;
/** @type {[typeof __VLS_components.Document, ]} */ ;
// @ts-ignore
const __VLS_217 = __VLS_asFunctionalComponent(__VLS_216, new __VLS_216({}));
const __VLS_218 = __VLS_217({}, ...__VLS_functionalComponentArgsRest(__VLS_217));
var __VLS_215;
{
    const { title: __VLS_thisSlot } = __VLS_211.slots;
}
var __VLS_211;
const __VLS_220 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
const __VLS_221 = __VLS_asFunctionalComponent(__VLS_220, new __VLS_220({
    index: "/metadata/collection",
}));
const __VLS_222 = __VLS_221({
    index: "/metadata/collection",
}, ...__VLS_functionalComponentArgsRest(__VLS_221));
__VLS_223.slots.default;
const __VLS_224 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_225 = __VLS_asFunctionalComponent(__VLS_224, new __VLS_224({}));
const __VLS_226 = __VLS_225({}, ...__VLS_functionalComponentArgsRest(__VLS_225));
__VLS_227.slots.default;
const __VLS_228 = {}.Download;
/** @type {[typeof __VLS_components.Download, ]} */ ;
// @ts-ignore
const __VLS_229 = __VLS_asFunctionalComponent(__VLS_228, new __VLS_228({}));
const __VLS_230 = __VLS_229({}, ...__VLS_functionalComponentArgsRest(__VLS_229));
var __VLS_227;
{
    const { title: __VLS_thisSlot } = __VLS_223.slots;
}
var __VLS_223;
const __VLS_232 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
const __VLS_233 = __VLS_asFunctionalComponent(__VLS_232, new __VLS_232({
    index: "/metadata/lineage",
}));
const __VLS_234 = __VLS_233({
    index: "/metadata/lineage",
}, ...__VLS_functionalComponentArgsRest(__VLS_233));
__VLS_235.slots.default;
const __VLS_236 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_237 = __VLS_asFunctionalComponent(__VLS_236, new __VLS_236({}));
const __VLS_238 = __VLS_237({}, ...__VLS_functionalComponentArgsRest(__VLS_237));
__VLS_239.slots.default;
const __VLS_240 = {}.Share;
/** @type {[typeof __VLS_components.Share, ]} */ ;
// @ts-ignore
const __VLS_241 = __VLS_asFunctionalComponent(__VLS_240, new __VLS_240({}));
const __VLS_242 = __VLS_241({}, ...__VLS_functionalComponentArgsRest(__VLS_241));
var __VLS_239;
{
    const { title: __VLS_thisSlot } = __VLS_235.slots;
}
var __VLS_235;
const __VLS_244 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
const __VLS_245 = __VLS_asFunctionalComponent(__VLS_244, new __VLS_244({
    index: "/metadata/tag",
}));
const __VLS_246 = __VLS_245({
    index: "/metadata/tag",
}, ...__VLS_functionalComponentArgsRest(__VLS_245));
__VLS_247.slots.default;
const __VLS_248 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_249 = __VLS_asFunctionalComponent(__VLS_248, new __VLS_248({}));
const __VLS_250 = __VLS_249({}, ...__VLS_functionalComponentArgsRest(__VLS_249));
__VLS_251.slots.default;
const __VLS_252 = {}.PriceTag;
/** @type {[typeof __VLS_components.PriceTag, ]} */ ;
// @ts-ignore
const __VLS_253 = __VLS_asFunctionalComponent(__VLS_252, new __VLS_252({}));
const __VLS_254 = __VLS_253({}, ...__VLS_functionalComponentArgsRest(__VLS_253));
var __VLS_251;
{
    const { title: __VLS_thisSlot } = __VLS_247.slots;
}
var __VLS_247;
var __VLS_175;
const __VLS_256 = {}.ElSubMenu;
/** @type {[typeof __VLS_components.ElSubMenu, typeof __VLS_components.elSubMenu, typeof __VLS_components.ElSubMenu, typeof __VLS_components.elSubMenu, ]} */ ;
// @ts-ignore
const __VLS_257 = __VLS_asFunctionalComponent(__VLS_256, new __VLS_256({
    index: "/datadev",
}));
const __VLS_258 = __VLS_257({
    index: "/datadev",
}, ...__VLS_functionalComponentArgsRest(__VLS_257));
__VLS_259.slots.default;
{
    const { title: __VLS_thisSlot } = __VLS_259.slots;
    const __VLS_260 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_261 = __VLS_asFunctionalComponent(__VLS_260, new __VLS_260({}));
    const __VLS_262 = __VLS_261({}, ...__VLS_functionalComponentArgsRest(__VLS_261));
    __VLS_263.slots.default;
    const __VLS_264 = {}.Promotion;
    /** @type {[typeof __VLS_components.Promotion, ]} */ ;
    // @ts-ignore
    const __VLS_265 = __VLS_asFunctionalComponent(__VLS_264, new __VLS_264({}));
    const __VLS_266 = __VLS_265({}, ...__VLS_functionalComponentArgsRest(__VLS_265));
    var __VLS_263;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
}
const __VLS_268 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
const __VLS_269 = __VLS_asFunctionalComponent(__VLS_268, new __VLS_268({
    index: "/datadev/overview",
}));
const __VLS_270 = __VLS_269({
    index: "/datadev/overview",
}, ...__VLS_functionalComponentArgsRest(__VLS_269));
__VLS_271.slots.default;
const __VLS_272 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_273 = __VLS_asFunctionalComponent(__VLS_272, new __VLS_272({}));
const __VLS_274 = __VLS_273({}, ...__VLS_functionalComponentArgsRest(__VLS_273));
__VLS_275.slots.default;
const __VLS_276 = {}.DataAnalysis;
/** @type {[typeof __VLS_components.DataAnalysis, ]} */ ;
// @ts-ignore
const __VLS_277 = __VLS_asFunctionalComponent(__VLS_276, new __VLS_276({}));
const __VLS_278 = __VLS_277({}, ...__VLS_functionalComponentArgsRest(__VLS_277));
var __VLS_275;
{
    const { title: __VLS_thisSlot } = __VLS_271.slots;
}
var __VLS_271;
const __VLS_280 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
const __VLS_281 = __VLS_asFunctionalComponent(__VLS_280, new __VLS_280({
    index: "/datadev/batch",
}));
const __VLS_282 = __VLS_281({
    index: "/datadev/batch",
}, ...__VLS_functionalComponentArgsRest(__VLS_281));
__VLS_283.slots.default;
const __VLS_284 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_285 = __VLS_asFunctionalComponent(__VLS_284, new __VLS_284({}));
const __VLS_286 = __VLS_285({}, ...__VLS_functionalComponentArgsRest(__VLS_285));
__VLS_287.slots.default;
const __VLS_288 = {}.DocumentCopy;
/** @type {[typeof __VLS_components.DocumentCopy, ]} */ ;
// @ts-ignore
const __VLS_289 = __VLS_asFunctionalComponent(__VLS_288, new __VLS_288({}));
const __VLS_290 = __VLS_289({}, ...__VLS_functionalComponentArgsRest(__VLS_289));
var __VLS_287;
{
    const { title: __VLS_thisSlot } = __VLS_283.slots;
}
var __VLS_283;
const __VLS_292 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
const __VLS_293 = __VLS_asFunctionalComponent(__VLS_292, new __VLS_292({
    index: "/datadev/realtime",
}));
const __VLS_294 = __VLS_293({
    index: "/datadev/realtime",
}, ...__VLS_functionalComponentArgsRest(__VLS_293));
__VLS_295.slots.default;
const __VLS_296 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_297 = __VLS_asFunctionalComponent(__VLS_296, new __VLS_296({}));
const __VLS_298 = __VLS_297({}, ...__VLS_functionalComponentArgsRest(__VLS_297));
__VLS_299.slots.default;
const __VLS_300 = {}.VideoCamera;
/** @type {[typeof __VLS_components.VideoCamera, ]} */ ;
// @ts-ignore
const __VLS_301 = __VLS_asFunctionalComponent(__VLS_300, new __VLS_300({}));
const __VLS_302 = __VLS_301({}, ...__VLS_functionalComponentArgsRest(__VLS_301));
var __VLS_299;
{
    const { title: __VLS_thisSlot } = __VLS_295.slots;
}
var __VLS_295;
const __VLS_304 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
const __VLS_305 = __VLS_asFunctionalComponent(__VLS_304, new __VLS_304({
    index: "/datadev/stream",
}));
const __VLS_306 = __VLS_305({
    index: "/datadev/stream",
}, ...__VLS_functionalComponentArgsRest(__VLS_305));
__VLS_307.slots.default;
const __VLS_308 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_309 = __VLS_asFunctionalComponent(__VLS_308, new __VLS_308({}));
const __VLS_310 = __VLS_309({}, ...__VLS_functionalComponentArgsRest(__VLS_309));
__VLS_311.slots.default;
const __VLS_312 = {}.WindPower;
/** @type {[typeof __VLS_components.WindPower, ]} */ ;
// @ts-ignore
const __VLS_313 = __VLS_asFunctionalComponent(__VLS_312, new __VLS_312({}));
const __VLS_314 = __VLS_313({}, ...__VLS_functionalComponentArgsRest(__VLS_313));
var __VLS_311;
{
    const { title: __VLS_thisSlot } = __VLS_307.slots;
}
var __VLS_307;
const __VLS_316 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
const __VLS_317 = __VLS_asFunctionalComponent(__VLS_316, new __VLS_316({
    index: "/datadev/task",
}));
const __VLS_318 = __VLS_317({
    index: "/datadev/task",
}, ...__VLS_functionalComponentArgsRest(__VLS_317));
__VLS_319.slots.default;
const __VLS_320 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_321 = __VLS_asFunctionalComponent(__VLS_320, new __VLS_320({}));
const __VLS_322 = __VLS_321({}, ...__VLS_functionalComponentArgsRest(__VLS_321));
__VLS_323.slots.default;
const __VLS_324 = {}.List;
/** @type {[typeof __VLS_components.List, ]} */ ;
// @ts-ignore
const __VLS_325 = __VLS_asFunctionalComponent(__VLS_324, new __VLS_324({}));
const __VLS_326 = __VLS_325({}, ...__VLS_functionalComponentArgsRest(__VLS_325));
var __VLS_323;
{
    const { title: __VLS_thisSlot } = __VLS_319.slots;
}
var __VLS_319;
const __VLS_328 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
const __VLS_329 = __VLS_asFunctionalComponent(__VLS_328, new __VLS_328({
    index: "/datadev/monitor",
}));
const __VLS_330 = __VLS_329({
    index: "/datadev/monitor",
}, ...__VLS_functionalComponentArgsRest(__VLS_329));
__VLS_331.slots.default;
const __VLS_332 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_333 = __VLS_asFunctionalComponent(__VLS_332, new __VLS_332({}));
const __VLS_334 = __VLS_333({}, ...__VLS_functionalComponentArgsRest(__VLS_333));
__VLS_335.slots.default;
const __VLS_336 = {}.Monitor;
/** @type {[typeof __VLS_components.Monitor, ]} */ ;
// @ts-ignore
const __VLS_337 = __VLS_asFunctionalComponent(__VLS_336, new __VLS_336({}));
const __VLS_338 = __VLS_337({}, ...__VLS_functionalComponentArgsRest(__VLS_337));
var __VLS_335;
{
    const { title: __VLS_thisSlot } = __VLS_331.slots;
}
var __VLS_331;
const __VLS_340 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
const __VLS_341 = __VLS_asFunctionalComponent(__VLS_340, new __VLS_340({
    index: "/datadev/flow",
}));
const __VLS_342 = __VLS_341({
    index: "/datadev/flow",
}, ...__VLS_functionalComponentArgsRest(__VLS_341));
__VLS_343.slots.default;
const __VLS_344 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_345 = __VLS_asFunctionalComponent(__VLS_344, new __VLS_344({}));
const __VLS_346 = __VLS_345({}, ...__VLS_functionalComponentArgsRest(__VLS_345));
__VLS_347.slots.default;
const __VLS_348 = {}.Share;
/** @type {[typeof __VLS_components.Share, ]} */ ;
// @ts-ignore
const __VLS_349 = __VLS_asFunctionalComponent(__VLS_348, new __VLS_348({}));
const __VLS_350 = __VLS_349({}, ...__VLS_functionalComponentArgsRest(__VLS_349));
var __VLS_347;
{
    const { title: __VLS_thisSlot } = __VLS_343.slots;
}
var __VLS_343;
const __VLS_352 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
const __VLS_353 = __VLS_asFunctionalComponent(__VLS_352, new __VLS_352({
    index: "/datadev/security",
}));
const __VLS_354 = __VLS_353({
    index: "/datadev/security",
}, ...__VLS_functionalComponentArgsRest(__VLS_353));
__VLS_355.slots.default;
const __VLS_356 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_357 = __VLS_asFunctionalComponent(__VLS_356, new __VLS_356({}));
const __VLS_358 = __VLS_357({}, ...__VLS_functionalComponentArgsRest(__VLS_357));
__VLS_359.slots.default;
const __VLS_360 = {}.Lock;
/** @type {[typeof __VLS_components.Lock, ]} */ ;
// @ts-ignore
const __VLS_361 = __VLS_asFunctionalComponent(__VLS_360, new __VLS_360({}));
const __VLS_362 = __VLS_361({}, ...__VLS_functionalComponentArgsRest(__VLS_361));
var __VLS_359;
{
    const { title: __VLS_thisSlot } = __VLS_355.slots;
}
var __VLS_355;
var __VLS_259;
const __VLS_364 = {}.ElSubMenu;
/** @type {[typeof __VLS_components.ElSubMenu, typeof __VLS_components.elSubMenu, typeof __VLS_components.ElSubMenu, typeof __VLS_components.elSubMenu, ]} */ ;
// @ts-ignore
const __VLS_365 = __VLS_asFunctionalComponent(__VLS_364, new __VLS_364({
    index: "/quality",
}));
const __VLS_366 = __VLS_365({
    index: "/quality",
}, ...__VLS_functionalComponentArgsRest(__VLS_365));
__VLS_367.slots.default;
{
    const { title: __VLS_thisSlot } = __VLS_367.slots;
    const __VLS_368 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_369 = __VLS_asFunctionalComponent(__VLS_368, new __VLS_368({}));
    const __VLS_370 = __VLS_369({}, ...__VLS_functionalComponentArgsRest(__VLS_369));
    __VLS_371.slots.default;
    const __VLS_372 = {}.DataLine;
    /** @type {[typeof __VLS_components.DataLine, ]} */ ;
    // @ts-ignore
    const __VLS_373 = __VLS_asFunctionalComponent(__VLS_372, new __VLS_372({}));
    const __VLS_374 = __VLS_373({}, ...__VLS_functionalComponentArgsRest(__VLS_373));
    var __VLS_371;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
}
const __VLS_376 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
const __VLS_377 = __VLS_asFunctionalComponent(__VLS_376, new __VLS_376({
    index: "/quality/overview",
}));
const __VLS_378 = __VLS_377({
    index: "/quality/overview",
}, ...__VLS_functionalComponentArgsRest(__VLS_377));
__VLS_379.slots.default;
const __VLS_380 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_381 = __VLS_asFunctionalComponent(__VLS_380, new __VLS_380({}));
const __VLS_382 = __VLS_381({}, ...__VLS_functionalComponentArgsRest(__VLS_381));
__VLS_383.slots.default;
const __VLS_384 = {}.DataAnalysis;
/** @type {[typeof __VLS_components.DataAnalysis, ]} */ ;
// @ts-ignore
const __VLS_385 = __VLS_asFunctionalComponent(__VLS_384, new __VLS_384({}));
const __VLS_386 = __VLS_385({}, ...__VLS_functionalComponentArgsRest(__VLS_385));
var __VLS_383;
{
    const { title: __VLS_thisSlot } = __VLS_379.slots;
}
var __VLS_379;
const __VLS_388 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
const __VLS_389 = __VLS_asFunctionalComponent(__VLS_388, new __VLS_388({
    index: "/quality/rule",
}));
const __VLS_390 = __VLS_389({
    index: "/quality/rule",
}, ...__VLS_functionalComponentArgsRest(__VLS_389));
__VLS_391.slots.default;
const __VLS_392 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_393 = __VLS_asFunctionalComponent(__VLS_392, new __VLS_392({}));
const __VLS_394 = __VLS_393({}, ...__VLS_functionalComponentArgsRest(__VLS_393));
__VLS_395.slots.default;
const __VLS_396 = {}.Setting;
/** @type {[typeof __VLS_components.Setting, ]} */ ;
// @ts-ignore
const __VLS_397 = __VLS_asFunctionalComponent(__VLS_396, new __VLS_396({}));
const __VLS_398 = __VLS_397({}, ...__VLS_functionalComponentArgsRest(__VLS_397));
var __VLS_395;
{
    const { title: __VLS_thisSlot } = __VLS_391.slots;
}
var __VLS_391;
const __VLS_400 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
const __VLS_401 = __VLS_asFunctionalComponent(__VLS_400, new __VLS_400({
    index: "/quality/task",
}));
const __VLS_402 = __VLS_401({
    index: "/quality/task",
}, ...__VLS_functionalComponentArgsRest(__VLS_401));
__VLS_403.slots.default;
const __VLS_404 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_405 = __VLS_asFunctionalComponent(__VLS_404, new __VLS_404({}));
const __VLS_406 = __VLS_405({}, ...__VLS_functionalComponentArgsRest(__VLS_405));
__VLS_407.slots.default;
const __VLS_408 = {}.VideoCamera;
/** @type {[typeof __VLS_components.VideoCamera, ]} */ ;
// @ts-ignore
const __VLS_409 = __VLS_asFunctionalComponent(__VLS_408, new __VLS_408({}));
const __VLS_410 = __VLS_409({}, ...__VLS_functionalComponentArgsRest(__VLS_409));
var __VLS_407;
{
    const { title: __VLS_thisSlot } = __VLS_403.slots;
}
var __VLS_403;
const __VLS_412 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
const __VLS_413 = __VLS_asFunctionalComponent(__VLS_412, new __VLS_412({
    index: "/quality/audit",
}));
const __VLS_414 = __VLS_413({
    index: "/quality/audit",
}, ...__VLS_functionalComponentArgsRest(__VLS_413));
__VLS_415.slots.default;
const __VLS_416 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_417 = __VLS_asFunctionalComponent(__VLS_416, new __VLS_416({}));
const __VLS_418 = __VLS_417({}, ...__VLS_functionalComponentArgsRest(__VLS_417));
__VLS_419.slots.default;
const __VLS_420 = {}.DocumentChecked;
/** @type {[typeof __VLS_components.DocumentChecked, ]} */ ;
// @ts-ignore
const __VLS_421 = __VLS_asFunctionalComponent(__VLS_420, new __VLS_420({}));
const __VLS_422 = __VLS_421({}, ...__VLS_functionalComponentArgsRest(__VLS_421));
var __VLS_419;
{
    const { title: __VLS_thisSlot } = __VLS_415.slots;
}
var __VLS_415;
const __VLS_424 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
const __VLS_425 = __VLS_asFunctionalComponent(__VLS_424, new __VLS_424({
    index: "/quality/certification",
}));
const __VLS_426 = __VLS_425({
    index: "/quality/certification",
}, ...__VLS_functionalComponentArgsRest(__VLS_425));
__VLS_427.slots.default;
const __VLS_428 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_429 = __VLS_asFunctionalComponent(__VLS_428, new __VLS_428({}));
const __VLS_430 = __VLS_429({}, ...__VLS_functionalComponentArgsRest(__VLS_429));
__VLS_431.slots.default;
const __VLS_432 = {}.Trophy;
/** @type {[typeof __VLS_components.Trophy, ]} */ ;
// @ts-ignore
const __VLS_433 = __VLS_asFunctionalComponent(__VLS_432, new __VLS_432({}));
const __VLS_434 = __VLS_433({}, ...__VLS_functionalComponentArgsRest(__VLS_433));
var __VLS_431;
{
    const { title: __VLS_thisSlot } = __VLS_427.slots;
}
var __VLS_427;
const __VLS_436 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
const __VLS_437 = __VLS_asFunctionalComponent(__VLS_436, new __VLS_436({
    index: "/quality/report",
}));
const __VLS_438 = __VLS_437({
    index: "/quality/report",
}, ...__VLS_functionalComponentArgsRest(__VLS_437));
__VLS_439.slots.default;
const __VLS_440 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_441 = __VLS_asFunctionalComponent(__VLS_440, new __VLS_440({}));
const __VLS_442 = __VLS_441({}, ...__VLS_functionalComponentArgsRest(__VLS_441));
__VLS_443.slots.default;
const __VLS_444 = {}.DocumentCopy;
/** @type {[typeof __VLS_components.DocumentCopy, ]} */ ;
// @ts-ignore
const __VLS_445 = __VLS_asFunctionalComponent(__VLS_444, new __VLS_444({}));
const __VLS_446 = __VLS_445({}, ...__VLS_functionalComponentArgsRest(__VLS_445));
var __VLS_443;
{
    const { title: __VLS_thisSlot } = __VLS_439.slots;
}
var __VLS_439;
var __VLS_367;
const __VLS_448 = {}.ElSubMenu;
/** @type {[typeof __VLS_components.ElSubMenu, typeof __VLS_components.elSubMenu, typeof __VLS_components.ElSubMenu, typeof __VLS_components.elSubMenu, ]} */ ;
// @ts-ignore
const __VLS_449 = __VLS_asFunctionalComponent(__VLS_448, new __VLS_448({
    index: "/resource",
}));
const __VLS_450 = __VLS_449({
    index: "/resource",
}, ...__VLS_functionalComponentArgsRest(__VLS_449));
__VLS_451.slots.default;
{
    const { title: __VLS_thisSlot } = __VLS_451.slots;
    const __VLS_452 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_453 = __VLS_asFunctionalComponent(__VLS_452, new __VLS_452({}));
    const __VLS_454 = __VLS_453({}, ...__VLS_functionalComponentArgsRest(__VLS_453));
    __VLS_455.slots.default;
    const __VLS_456 = {}.FolderOpened;
    /** @type {[typeof __VLS_components.FolderOpened, ]} */ ;
    // @ts-ignore
    const __VLS_457 = __VLS_asFunctionalComponent(__VLS_456, new __VLS_456({}));
    const __VLS_458 = __VLS_457({}, ...__VLS_functionalComponentArgsRest(__VLS_457));
    var __VLS_455;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
}
const __VLS_460 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
const __VLS_461 = __VLS_asFunctionalComponent(__VLS_460, new __VLS_460({
    index: "/resource/overview",
}));
const __VLS_462 = __VLS_461({
    index: "/resource/overview",
}, ...__VLS_functionalComponentArgsRest(__VLS_461));
__VLS_463.slots.default;
const __VLS_464 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_465 = __VLS_asFunctionalComponent(__VLS_464, new __VLS_464({}));
const __VLS_466 = __VLS_465({}, ...__VLS_functionalComponentArgsRest(__VLS_465));
__VLS_467.slots.default;
const __VLS_468 = {}.DataAnalysis;
/** @type {[typeof __VLS_components.DataAnalysis, ]} */ ;
// @ts-ignore
const __VLS_469 = __VLS_asFunctionalComponent(__VLS_468, new __VLS_468({}));
const __VLS_470 = __VLS_469({}, ...__VLS_functionalComponentArgsRest(__VLS_469));
var __VLS_467;
{
    const { title: __VLS_thisSlot } = __VLS_463.slots;
}
var __VLS_463;
const __VLS_472 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
const __VLS_473 = __VLS_asFunctionalComponent(__VLS_472, new __VLS_472({
    index: "/resource/catalog",
}));
const __VLS_474 = __VLS_473({
    index: "/resource/catalog",
}, ...__VLS_functionalComponentArgsRest(__VLS_473));
__VLS_475.slots.default;
const __VLS_476 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_477 = __VLS_asFunctionalComponent(__VLS_476, new __VLS_476({}));
const __VLS_478 = __VLS_477({}, ...__VLS_functionalComponentArgsRest(__VLS_477));
__VLS_479.slots.default;
const __VLS_480 = {}.Folder;
/** @type {[typeof __VLS_components.Folder, ]} */ ;
// @ts-ignore
const __VLS_481 = __VLS_asFunctionalComponent(__VLS_480, new __VLS_480({}));
const __VLS_482 = __VLS_481({}, ...__VLS_functionalComponentArgsRest(__VLS_481));
var __VLS_479;
{
    const { title: __VLS_thisSlot } = __VLS_475.slots;
}
var __VLS_475;
const __VLS_484 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
const __VLS_485 = __VLS_asFunctionalComponent(__VLS_484, new __VLS_484({
    index: "/resource/preview",
}));
const __VLS_486 = __VLS_485({
    index: "/resource/preview",
}, ...__VLS_functionalComponentArgsRest(__VLS_485));
__VLS_487.slots.default;
const __VLS_488 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_489 = __VLS_asFunctionalComponent(__VLS_488, new __VLS_488({}));
const __VLS_490 = __VLS_489({}, ...__VLS_functionalComponentArgsRest(__VLS_489));
__VLS_491.slots.default;
const __VLS_492 = {}.View;
/** @type {[typeof __VLS_components.View, ]} */ ;
// @ts-ignore
const __VLS_493 = __VLS_asFunctionalComponent(__VLS_492, new __VLS_492({}));
const __VLS_494 = __VLS_493({}, ...__VLS_functionalComponentArgsRest(__VLS_493));
var __VLS_491;
{
    const { title: __VLS_thisSlot } = __VLS_487.slots;
}
var __VLS_487;
const __VLS_496 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
const __VLS_497 = __VLS_asFunctionalComponent(__VLS_496, new __VLS_496({
    index: "/resource/permission",
}));
const __VLS_498 = __VLS_497({
    index: "/resource/permission",
}, ...__VLS_functionalComponentArgsRest(__VLS_497));
__VLS_499.slots.default;
const __VLS_500 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_501 = __VLS_asFunctionalComponent(__VLS_500, new __VLS_500({}));
const __VLS_502 = __VLS_501({}, ...__VLS_functionalComponentArgsRest(__VLS_501));
__VLS_503.slots.default;
const __VLS_504 = {}.Lock;
/** @type {[typeof __VLS_components.Lock, ]} */ ;
// @ts-ignore
const __VLS_505 = __VLS_asFunctionalComponent(__VLS_504, new __VLS_504({}));
const __VLS_506 = __VLS_505({}, ...__VLS_functionalComponentArgsRest(__VLS_505));
var __VLS_503;
{
    const { title: __VLS_thisSlot } = __VLS_499.slots;
}
var __VLS_499;
const __VLS_508 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
const __VLS_509 = __VLS_asFunctionalComponent(__VLS_508, new __VLS_508({
    index: "/resource/lineage",
}));
const __VLS_510 = __VLS_509({
    index: "/resource/lineage",
}, ...__VLS_functionalComponentArgsRest(__VLS_509));
__VLS_511.slots.default;
const __VLS_512 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_513 = __VLS_asFunctionalComponent(__VLS_512, new __VLS_512({}));
const __VLS_514 = __VLS_513({}, ...__VLS_functionalComponentArgsRest(__VLS_513));
__VLS_515.slots.default;
const __VLS_516 = {}.Share;
/** @type {[typeof __VLS_components.Share, ]} */ ;
// @ts-ignore
const __VLS_517 = __VLS_asFunctionalComponent(__VLS_516, new __VLS_516({}));
const __VLS_518 = __VLS_517({}, ...__VLS_functionalComponentArgsRest(__VLS_517));
var __VLS_515;
{
    const { title: __VLS_thisSlot } = __VLS_511.slots;
}
var __VLS_511;
const __VLS_520 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
const __VLS_521 = __VLS_asFunctionalComponent(__VLS_520, new __VLS_520({
    index: "/resource/feature",
}));
const __VLS_522 = __VLS_521({
    index: "/resource/feature",
}, ...__VLS_functionalComponentArgsRest(__VLS_521));
__VLS_523.slots.default;
const __VLS_524 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_525 = __VLS_asFunctionalComponent(__VLS_524, new __VLS_524({}));
const __VLS_526 = __VLS_525({}, ...__VLS_functionalComponentArgsRest(__VLS_525));
__VLS_527.slots.default;
const __VLS_528 = {}.Aim;
/** @type {[typeof __VLS_components.Aim, ]} */ ;
// @ts-ignore
const __VLS_529 = __VLS_asFunctionalComponent(__VLS_528, new __VLS_528({}));
const __VLS_530 = __VLS_529({}, ...__VLS_functionalComponentArgsRest(__VLS_529));
var __VLS_527;
{
    const { title: __VLS_thisSlot } = __VLS_523.slots;
}
var __VLS_523;
const __VLS_532 = {}.ElMenuItem;
/** @type {[typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, typeof __VLS_components.ElMenuItem, typeof __VLS_components.elMenuItem, ]} */ ;
// @ts-ignore
const __VLS_533 = __VLS_asFunctionalComponent(__VLS_532, new __VLS_532({
    index: "/resource/explore",
}));
const __VLS_534 = __VLS_533({
    index: "/resource/explore",
}, ...__VLS_functionalComponentArgsRest(__VLS_533));
__VLS_535.slots.default;
const __VLS_536 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_537 = __VLS_asFunctionalComponent(__VLS_536, new __VLS_536({}));
const __VLS_538 = __VLS_537({}, ...__VLS_functionalComponentArgsRest(__VLS_537));
__VLS_539.slots.default;
const __VLS_540 = {}.Search;
/** @type {[typeof __VLS_components.Search, ]} */ ;
// @ts-ignore
const __VLS_541 = __VLS_asFunctionalComponent(__VLS_540, new __VLS_540({}));
const __VLS_542 = __VLS_541({}, ...__VLS_functionalComponentArgsRest(__VLS_541));
var __VLS_539;
{
    const { title: __VLS_thisSlot } = __VLS_535.slots;
}
var __VLS_535;
var __VLS_451;
var __VLS_3;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "sidebar-footer" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.collapsed = !__VLS_ctx.collapsed;
        } },
    ...{ class: "collapse-trigger" },
});
const __VLS_544 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_545 = __VLS_asFunctionalComponent(__VLS_544, new __VLS_544({
    size: (16),
}));
const __VLS_546 = __VLS_545({
    size: (16),
}, ...__VLS_functionalComponentArgsRest(__VLS_545));
__VLS_547.slots.default;
if (__VLS_ctx.collapsed) {
    const __VLS_548 = {}.Expand;
    /** @type {[typeof __VLS_components.Expand, ]} */ ;
    // @ts-ignore
    const __VLS_549 = __VLS_asFunctionalComponent(__VLS_548, new __VLS_548({}));
    const __VLS_550 = __VLS_549({}, ...__VLS_functionalComponentArgsRest(__VLS_549));
}
else {
    const __VLS_552 = {}.Fold;
    /** @type {[typeof __VLS_components.Fold, ]} */ ;
    // @ts-ignore
    const __VLS_553 = __VLS_asFunctionalComponent(__VLS_552, new __VLS_552({}));
    const __VLS_554 = __VLS_553({}, ...__VLS_functionalComponentArgsRest(__VLS_553));
}
var __VLS_547;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
(__VLS_ctx.collapsed ? '' : '收起菜单');
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "main-area" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.header, __VLS_intrinsicElements.header)({
    ...{ class: "topbar" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "topbar-brand" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "metro-logo" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "metro-logo-mark" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "topbar-title-wrap" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "topbar-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "topbar-subtitle" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "topbar-actions" },
});
const __VLS_556 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_557 = __VLS_asFunctionalComponent(__VLS_556, new __VLS_556({
    ...{ class: "search-box" },
    placeholder: "全局搜索",
    size: "small",
    clearable: true,
}));
const __VLS_558 = __VLS_557({
    ...{ class: "search-box" },
    placeholder: "全局搜索",
    size: "small",
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_557));
__VLS_559.slots.default;
{
    const { prefix: __VLS_thisSlot } = __VLS_559.slots;
    const __VLS_560 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_561 = __VLS_asFunctionalComponent(__VLS_560, new __VLS_560({}));
    const __VLS_562 = __VLS_561({}, ...__VLS_functionalComponentArgsRest(__VLS_561));
    __VLS_563.slots.default;
    const __VLS_564 = {}.Search;
    /** @type {[typeof __VLS_components.Search, ]} */ ;
    // @ts-ignore
    const __VLS_565 = __VLS_asFunctionalComponent(__VLS_564, new __VLS_564({}));
    const __VLS_566 = __VLS_565({}, ...__VLS_functionalComponentArgsRest(__VLS_565));
    var __VLS_563;
}
var __VLS_559;
const __VLS_568 = {}.ElBadge;
/** @type {[typeof __VLS_components.ElBadge, typeof __VLS_components.elBadge, typeof __VLS_components.ElBadge, typeof __VLS_components.elBadge, ]} */ ;
// @ts-ignore
const __VLS_569 = __VLS_asFunctionalComponent(__VLS_568, new __VLS_568({
    value: (3),
    ...{ class: "notify-badge" },
}));
const __VLS_570 = __VLS_569({
    value: (3),
    ...{ class: "notify-badge" },
}, ...__VLS_functionalComponentArgsRest(__VLS_569));
__VLS_571.slots.default;
const __VLS_572 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_573 = __VLS_asFunctionalComponent(__VLS_572, new __VLS_572({
    ...{ class: "icon-button" },
    circle: true,
}));
const __VLS_574 = __VLS_573({
    ...{ class: "icon-button" },
    circle: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_573));
__VLS_575.slots.default;
const __VLS_576 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_577 = __VLS_asFunctionalComponent(__VLS_576, new __VLS_576({}));
const __VLS_578 = __VLS_577({}, ...__VLS_functionalComponentArgsRest(__VLS_577));
__VLS_579.slots.default;
const __VLS_580 = {}.Bell;
/** @type {[typeof __VLS_components.Bell, ]} */ ;
// @ts-ignore
const __VLS_581 = __VLS_asFunctionalComponent(__VLS_580, new __VLS_580({}));
const __VLS_582 = __VLS_581({}, ...__VLS_functionalComponentArgsRest(__VLS_581));
var __VLS_579;
var __VLS_575;
var __VLS_571;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "user-panel" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "user-avatar" },
});
const __VLS_584 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_585 = __VLS_asFunctionalComponent(__VLS_584, new __VLS_584({}));
const __VLS_586 = __VLS_585({}, ...__VLS_functionalComponentArgsRest(__VLS_585));
__VLS_587.slots.default;
const __VLS_588 = {}.UserFilled;
/** @type {[typeof __VLS_components.UserFilled, ]} */ ;
// @ts-ignore
const __VLS_589 = __VLS_asFunctionalComponent(__VLS_588, new __VLS_588({}));
const __VLS_590 = __VLS_589({}, ...__VLS_functionalComponentArgsRest(__VLS_589));
var __VLS_587;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "user-meta" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "user-name" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "user-role" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "breadcrumb-bar" },
});
const __VLS_592 = {}.ElBreadcrumb;
/** @type {[typeof __VLS_components.ElBreadcrumb, typeof __VLS_components.elBreadcrumb, typeof __VLS_components.ElBreadcrumb, typeof __VLS_components.elBreadcrumb, ]} */ ;
// @ts-ignore
const __VLS_593 = __VLS_asFunctionalComponent(__VLS_592, new __VLS_592({
    separator: "/",
}));
const __VLS_594 = __VLS_593({
    separator: "/",
}, ...__VLS_functionalComponentArgsRest(__VLS_593));
__VLS_595.slots.default;
const __VLS_596 = {}.ElBreadcrumbItem;
/** @type {[typeof __VLS_components.ElBreadcrumbItem, typeof __VLS_components.elBreadcrumbItem, typeof __VLS_components.ElBreadcrumbItem, typeof __VLS_components.elBreadcrumbItem, ]} */ ;
// @ts-ignore
const __VLS_597 = __VLS_asFunctionalComponent(__VLS_596, new __VLS_596({}));
const __VLS_598 = __VLS_597({}, ...__VLS_functionalComponentArgsRest(__VLS_597));
__VLS_599.slots.default;
var __VLS_599;
if (__VLS_ctx.breadcrumb.parent) {
    const __VLS_600 = {}.ElBreadcrumbItem;
    /** @type {[typeof __VLS_components.ElBreadcrumbItem, typeof __VLS_components.elBreadcrumbItem, typeof __VLS_components.ElBreadcrumbItem, typeof __VLS_components.elBreadcrumbItem, ]} */ ;
    // @ts-ignore
    const __VLS_601 = __VLS_asFunctionalComponent(__VLS_600, new __VLS_600({}));
    const __VLS_602 = __VLS_601({}, ...__VLS_functionalComponentArgsRest(__VLS_601));
    __VLS_603.slots.default;
    (__VLS_ctx.breadcrumb.parent);
    var __VLS_603;
}
const __VLS_604 = {}.ElBreadcrumbItem;
/** @type {[typeof __VLS_components.ElBreadcrumbItem, typeof __VLS_components.elBreadcrumbItem, typeof __VLS_components.ElBreadcrumbItem, typeof __VLS_components.elBreadcrumbItem, ]} */ ;
// @ts-ignore
const __VLS_605 = __VLS_asFunctionalComponent(__VLS_604, new __VLS_604({}));
const __VLS_606 = __VLS_605({}, ...__VLS_functionalComponentArgsRest(__VLS_605));
__VLS_607.slots.default;
(__VLS_ctx.breadcrumb.current);
var __VLS_607;
var __VLS_595;
__VLS_asFunctionalElement(__VLS_intrinsicElements.main, __VLS_intrinsicElements.main)({
    ...{ class: "content" },
});
const __VLS_608 = {}.RouterView;
/** @type {[typeof __VLS_components.RouterView, typeof __VLS_components.routerView, ]} */ ;
// @ts-ignore
const __VLS_609 = __VLS_asFunctionalComponent(__VLS_608, new __VLS_608({}));
const __VLS_610 = __VLS_609({}, ...__VLS_functionalComponentArgsRest(__VLS_609));
__VLS_asFunctionalElement(__VLS_intrinsicElements.footer, __VLS_intrinsicElements.footer)({
    ...{ class: "footer" },
});
/** @type {__VLS_StyleScopedClasses['app-shell']} */ ;
/** @type {__VLS_StyleScopedClasses['sidebar']} */ ;
/** @type {__VLS_StyleScopedClasses['brand']} */ ;
/** @type {__VLS_StyleScopedClasses['brand-mark']} */ ;
/** @type {__VLS_StyleScopedClasses['brand-text']} */ ;
/** @type {__VLS_StyleScopedClasses['brand-title']} */ ;
/** @type {__VLS_StyleScopedClasses['brand-subtitle']} */ ;
/** @type {__VLS_StyleScopedClasses['sidebar-divider']} */ ;
/** @type {__VLS_StyleScopedClasses['sidebar-menu']} */ ;
/** @type {__VLS_StyleScopedClasses['sidebar-footer']} */ ;
/** @type {__VLS_StyleScopedClasses['collapse-trigger']} */ ;
/** @type {__VLS_StyleScopedClasses['main-area']} */ ;
/** @type {__VLS_StyleScopedClasses['topbar']} */ ;
/** @type {__VLS_StyleScopedClasses['topbar-brand']} */ ;
/** @type {__VLS_StyleScopedClasses['metro-logo']} */ ;
/** @type {__VLS_StyleScopedClasses['metro-logo-mark']} */ ;
/** @type {__VLS_StyleScopedClasses['topbar-title-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['topbar-title']} */ ;
/** @type {__VLS_StyleScopedClasses['topbar-subtitle']} */ ;
/** @type {__VLS_StyleScopedClasses['topbar-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['search-box']} */ ;
/** @type {__VLS_StyleScopedClasses['notify-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['icon-button']} */ ;
/** @type {__VLS_StyleScopedClasses['user-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['user-avatar']} */ ;
/** @type {__VLS_StyleScopedClasses['user-meta']} */ ;
/** @type {__VLS_StyleScopedClasses['user-name']} */ ;
/** @type {__VLS_StyleScopedClasses['user-role']} */ ;
/** @type {__VLS_StyleScopedClasses['breadcrumb-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['content']} */ ;
/** @type {__VLS_StyleScopedClasses['footer']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Aim: Aim,
            Bell: Bell,
            Setting: Setting,
            Checked: Checked,
            Clock: Clock,
            Coin: Coin,
            Connection: Connection,
            DataAnalysis: DataAnalysis,
            DataLine: DataLine,
            Document: Document,
            DocumentChecked: DocumentChecked,
            DocumentCopy: DocumentCopy,
            Download: Download,
            Edit: Edit,
            Expand: Expand,
            Files: Files,
            Fold: Fold,
            Folder: Folder,
            FolderOpened: FolderOpened,
            Grid: Grid,
            List: List,
            Lock: Lock,
            Monitor: Monitor,
            PriceTag: PriceTag,
            Promotion: Promotion,
            Search: Search,
            SetUp: SetUp,
            Share: Share,
            Tickets: Tickets,
            TrendCharts: TrendCharts,
            Trophy: Trophy,
            UserFilled: UserFilled,
            VideoCamera: VideoCamera,
            View: View,
            WindPower: WindPower,
            route: route,
            collapsed: collapsed,
            breadcrumb: breadcrumb,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
