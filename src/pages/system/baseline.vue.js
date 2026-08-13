import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { Document, Key, Lock, Monitor, Refresh, Setting, User, View } from '@element-plus/icons-vue';
import * as echarts from 'echarts';
const statsCards = [
    { label: '综合合规得分', value: '88', color: '#00A854', bg: 'rgba(0,168,84,.1)' },
    { label: '通过核查项', value: '18', color: '#2B6CB0', bg: 'rgba(43,108,176,.1)' },
    { label: '关注核查项', value: '7', color: '#ED7B2F', bg: 'rgba(237,123,47,.1)' },
    { label: '不符合核查项', value: '3', color: '#DA251D', bg: 'rgba(218,37,29,.1)' },
];
const iconMap = {
    pwd: Key,
    account: User,
    perm: Key,
    crypt: Lock,
    mask: View,
    host: Monitor,
    audit: Setting,
};
const iconBg = {
    pwd: 'rgba(218,37,29,.08)',
    account: 'rgba(43,108,176,.08)',
    perm: 'rgba(0,168,84,.08)',
    crypt: 'rgba(237,123,47,.08)',
    mask: 'rgba(155,89,182,.08)',
    host: 'rgba(140,140,140,.08)',
    audit: 'rgba(43,108,176,.08)',
};
const baselines = ref([
    {
        key: 'pwd',
        name: '口令策略',
        score: 92,
        status: '通过',
        desc: '密码复杂度、有效期、多因子认证策略核查',
        risks: 1,
        checkTime: '2026-06-30',
        items: [
            { name: '密码复杂度策略', pass: true, desc: '≥12 位并含大小写数字特殊字符' },
            { name: '口令有效期', pass: true, desc: '90 天强制更换，历史 5 代不可复用' },
            { name: '多因子认证', pass: true, desc: '管理后台强制 MFA' },
            { name: '弱口令字典拦截', pass: false, desc: '有 3 个账号使用生日类弱口令未拦截' },
        ],
    },
    {
        key: 'account',
        name: '账号安全',
        score: 88,
        status: '关注',
        desc: '账号有效期、锁定期、休眠账号清理核查',
        risks: 2,
        checkTime: '2026-06-30',
        items: [
            { name: '账号有效期管理', pass: true, desc: '按角色设置有效期' },
            { name: '错误尝试锁定', pass: true, desc: '5 次失败锁定 30 分钟' },
            { name: '休眠账号清理', pass: false, desc: '2 个离职账号未停用' },
            { name: '公共账号管控', pass: false, desc: '1 个公共账号多人共享' },
        ],
    },
    {
        key: 'perm',
        name: '权限配置',
        score: 85,
        status: '关注',
        desc: '最小权限、权限复核、越权风险核查',
        risks: 3,
        checkTime: '2026-06-30',
        items: [
            { name: '最小权限原则', pass: true, desc: '90% 账号为最小权限集' },
            { name: '权限定期复核', pass: false, desc: '业务侧权限复核季度延迟 20 天' },
            { name: '敏感操作权限', pass: true, desc: '数据导出需二次授权' },
            { name: '离职权限回收', pass: false, desc: '回收流程未完全闭环' },
        ],
    },
    {
        key: 'crypt',
        name: '加密配置',
        score: 95,
        status: '通过',
        desc: '传输加密、存储加密、密钥算法核查',
        risks: 1,
        checkTime: '2026-06-30',
        items: [
            { name: '传输通道加密', pass: true, desc: '全链路 HTTPS/TLS1.2+ 覆盖' },
            { name: '敏感列存储加密', pass: true, desc: '敏感字段国密算法落盘加密' },
            { name: '密钥轮换机制', pass: true, desc: '密钥生命周期自动化轮换' },
            { name: '算法合规性', pass: false, desc: '遗留 MD5 场景 1 处未完成迁移' },
        ],
    },
    {
        key: 'mask',
        name: '脱敏配置',
        score: 90,
        status: '通过',
        desc: '敏感字段脱敏规则覆盖率核查',
        risks: 1,
        checkTime: '2026-06-30',
        items: [
            { name: 'L3/L4 预览脱敏', pass: true, desc: '数据预览强制脱敏' },
            { name: '脱敏算法策略', pass: true, desc: '国密算法与掩码策略符合基线' },
            { name: '开发测试环境脱敏', pass: true, desc: '克隆数据自动脱敏' },
            { name: '规则覆盖率', pass: false, desc: '12 个敏感字段未绑定规则' },
        ],
    },
    {
        key: 'host',
        name: '主机安全',
        score: 82,
        status: '关注',
        desc: '补丁、端口、基线加固、防病毒核查',
        risks: 3,
        checkTime: '2026-06-30',
        items: [
            { name: '安全补丁更新', pass: false, desc: '3 台主机补丁滞后超过 30 天' },
            { name: '高危端口收敛', pass: true, desc: '仅开放业务必需端口' },
            { name: '基线加固', pass: true, desc: 'SSH 仅密钥登录' },
            { name: '防病毒与入侵检测', pass: false, desc: '防病毒库 1 台未同步' },
        ],
    },
    {
        key: 'audit',
        name: '审计完整性',
        score: 86,
        status: '关注',
        desc: '日志留存、防篡改、审计覆盖核查',
        risks: 2,
        checkTime: '2026-06-30',
        items: [
            { name: '日志留存期限', pass: true, desc: '操作日志保留 180 天' },
            { name: '日志防篡改', pass: false, desc: '关键日志 WORM 存储未部署' },
            { name: '审计覆盖范围', pass: true, desc: '登录/访问/权限/操作全覆盖' },
            { name: '审计告警联动', pass: false, desc: '异常行为识别未接入告警' },
        ],
    },
]);
const statusFilter = ref('全部');
const filteredBaselines = computed(() => statusFilter.value === '全部' ? baselines.value : baselines.value.filter((b) => b.status === statusFilter.value));
const overallScore = computed(() => Math.round(baselines.value.reduce((s, b) => s + b.score, 0) / baselines.value.length));
const passedCount = computed(() => baselines.value.reduce((s, b) => s + b.items.filter((i) => i.pass).length, 0));
const warnCount = computed(() => baselines.value.reduce((s, b) => s + b.items.filter((i) => !i.pass).length, 0));
const failCount = computed(() => baselines.value.filter((b) => b.status === '不通过').length);
const lastScanTime = '2026-06-30 10:00:00';
const reportAdvice = [
    '口令策略：启用弱口令字典实时拦截，对存量弱口令账号强制改密。',
    '账号安全：完成离职账号停用与公共账号实名化改造，关闭共享账号。',
    '权限配置：季度权限复核纳入自动化任务，敏感导出权限与离职账号权限联动回收。',
    '加密配置：限期完成遗留 MD5 摘要场景迁移至国产 SM3 算法。',
    '脱敏配置：为 12 个未绑定敏感字段完成规则绑定并进入生效验证。',
    '主机安全：补齐 3 台主机安全补丁，同步防病毒库并纳入集中监控。',
    '审计完整性：部署日志防篡改存储（WORM），建立异常识别与告警联动。',
];
const scanning = ref(false);
const scanProgress = ref(0);
let scanTimer;
const startScan = () => {
    if (scanning.value)
        return;
    scanning.value = true;
    scanProgress.value = 0;
    scanTimer = window.setInterval(() => {
        scanProgress.value += 4;
        if (scanProgress.value >= 100) {
            window.clearInterval(scanTimer);
            scanning.value = false;
            baselines.value.forEach((b) => {
                b.score = Math.min(100, b.score + (Math.random() > 0.4 ? 1 : -1));
                b.status = b.score >= 90 ? '通过' : b.score >= 82 ? '关注' : '不通过';
            });
            ElMessage.success('安全基线核查完成，结果已更新（Mock）');
        }
    }, 120);
};
const detailVisible = ref(false);
const detailTarget = ref(null);
const viewDetail = (b) => {
    detailTarget.value = b;
    detailVisible.value = true;
};
const startFix = (b) => {
    ElMessage.success(`已创建「${b.name}」整改工单并通知责任人（Mock）`);
};
const reportVisible = ref(false);
const openReport = () => {
    reportVisible.value = true;
};
const downloadReport = () => {
    ElMessage.success('核查报告（PDF）已生成并下载（Mock）');
    reportVisible.value = false;
};
const radarEl = ref();
let radarChart = null;
const renderRadar = () => {
    if (!radarEl.value)
        return;
    radarChart = echarts.init(radarEl.value);
    radarChart.setOption({
        radar: {
            indicator: [
                { name: '口令策略', max: 100 },
                { name: '账号安全', max: 100 },
                { name: '权限配置', max: 100 },
                { name: '加密配置', max: 100 },
                { name: '脱敏配置', max: 100 },
                { name: '主机安全', max: 100 },
                { name: '审计完整性', max: 100 },
            ],
            radius: '68%',
            splitNumber: 4,
            axisName: { color: '#8c8c8c', fontSize: 11 },
            splitArea: { areaStyle: { color: ['#fff', '#fafbfd'] } },
        },
        series: [
            {
                type: 'radar',
                data: [
                    {
                        value: baselines.value.map((b) => b.score),
                        name: '核查得分',
                        areaStyle: { color: 'rgba(218,37,29,.18)' },
                        lineStyle: { color: '#DA251D', width: 2 },
                        itemStyle: { color: '#DA251D' },
                    },
                ],
            },
        ],
    });
};
onMounted(() => {
    renderRadar();
});
onBeforeUnmount(() => {
    if (scanTimer)
        window.clearInterval(scanTimer);
    radarChart?.dispose?.();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "standard-page baseline-page" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "base-stats" },
});
for (const [s] of __VLS_getVForSourceType((__VLS_ctx.statsCards))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (s.label),
        ...{ class: "base-stat" },
        ...{ style: ({ background: s.bg, color: s.color }) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "base-stat-value" },
    });
    (s.value);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "base-stat-label" },
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
    span: (8),
}));
const __VLS_6 = __VLS_5({
    span: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
__VLS_7.slots.default;
const __VLS_8 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    ...{ class: "panel-card" },
    shadow: "never",
}));
const __VLS_10 = __VLS_9({
    ...{ class: "panel-card" },
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
        type: "success",
        effect: "dark",
        size: "small",
    }));
    const __VLS_14 = __VLS_13({
        type: "success",
        effect: "dark",
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_13));
    __VLS_15.slots.default;
    (__VLS_ctx.overallScore);
    var __VLS_15;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ref: "radarEl",
    ...{ class: "radar-box" },
});
/** @type {typeof __VLS_ctx.radarEl} */ ;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "base-actions" },
});
const __VLS_16 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    ...{ 'onClick': {} },
    type: "danger",
    icon: (__VLS_ctx.Refresh),
    loading: (__VLS_ctx.scanning),
}));
const __VLS_18 = __VLS_17({
    ...{ 'onClick': {} },
    type: "danger",
    icon: (__VLS_ctx.Refresh),
    loading: (__VLS_ctx.scanning),
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
let __VLS_20;
let __VLS_21;
let __VLS_22;
const __VLS_23 = {
    onClick: (__VLS_ctx.startScan)
};
__VLS_19.slots.default;
var __VLS_19;
const __VLS_24 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    ...{ 'onClick': {} },
    plain: true,
    icon: (__VLS_ctx.Document),
}));
const __VLS_26 = __VLS_25({
    ...{ 'onClick': {} },
    plain: true,
    icon: (__VLS_ctx.Document),
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
let __VLS_28;
let __VLS_29;
let __VLS_30;
const __VLS_31 = {
    onClick: (__VLS_ctx.openReport)
};
__VLS_27.slots.default;
var __VLS_27;
if (__VLS_ctx.scanning) {
    const __VLS_32 = {}.ElProgress;
    /** @type {[typeof __VLS_components.ElProgress, typeof __VLS_components.elProgress, ]} */ ;
    // @ts-ignore
    const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
        percentage: (__VLS_ctx.scanProgress),
        status: "active",
        ...{ class: "scan-progress" },
        strokeWidth: (14),
        textInside: true,
    }));
    const __VLS_34 = __VLS_33({
        percentage: (__VLS_ctx.scanProgress),
        status: "active",
        ...{ class: "scan-progress" },
        strokeWidth: (14),
        textInside: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_33));
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "last-scan" },
});
(__VLS_ctx.lastScanTime);
var __VLS_11;
var __VLS_7;
const __VLS_36 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    span: (16),
}));
const __VLS_38 = __VLS_37({
    span: (16),
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
__VLS_39.slots.default;
const __VLS_40 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
    ...{ class: "panel-card" },
    shadow: "never",
}));
const __VLS_42 = __VLS_41({
    ...{ class: "panel-card" },
    shadow: "never",
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
__VLS_43.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_43.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-actions" },
    });
    const __VLS_44 = {}.ElRadioGroup;
    /** @type {[typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, ]} */ ;
    // @ts-ignore
    const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
        modelValue: (__VLS_ctx.statusFilter),
        size: "small",
    }));
    const __VLS_46 = __VLS_45({
        modelValue: (__VLS_ctx.statusFilter),
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_45));
    __VLS_47.slots.default;
    const __VLS_48 = {}.ElRadioButton;
    /** @type {[typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, ]} */ ;
    // @ts-ignore
    const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
        value: "全部",
    }));
    const __VLS_50 = __VLS_49({
        value: "全部",
    }, ...__VLS_functionalComponentArgsRest(__VLS_49));
    __VLS_51.slots.default;
    var __VLS_51;
    const __VLS_52 = {}.ElRadioButton;
    /** @type {[typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, ]} */ ;
    // @ts-ignore
    const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
        value: "通过",
    }));
    const __VLS_54 = __VLS_53({
        value: "通过",
    }, ...__VLS_functionalComponentArgsRest(__VLS_53));
    __VLS_55.slots.default;
    var __VLS_55;
    const __VLS_56 = {}.ElRadioButton;
    /** @type {[typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, ]} */ ;
    // @ts-ignore
    const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
        value: "关注",
    }));
    const __VLS_58 = __VLS_57({
        value: "关注",
    }, ...__VLS_functionalComponentArgsRest(__VLS_57));
    __VLS_59.slots.default;
    var __VLS_59;
    const __VLS_60 = {}.ElRadioButton;
    /** @type {[typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, ]} */ ;
    // @ts-ignore
    const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
        value: "不通过",
    }));
    const __VLS_62 = __VLS_61({
        value: "不通过",
    }, ...__VLS_functionalComponentArgsRest(__VLS_61));
    __VLS_63.slots.default;
    var __VLS_63;
    var __VLS_47;
}
for (const [b] of __VLS_getVForSourceType((__VLS_ctx.filteredBaselines))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (b.key),
        ...{ class: "base-item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "base-item-head" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "base-item-icon" },
        ...{ style: ({ background: __VLS_ctx.iconBg[b.key] }) },
    });
    const __VLS_64 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
        size: (16),
    }));
    const __VLS_66 = __VLS_65({
        size: (16),
    }, ...__VLS_functionalComponentArgsRest(__VLS_65));
    __VLS_67.slots.default;
    const __VLS_68 = ((__VLS_ctx.iconMap[b.key]));
    // @ts-ignore
    const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({}));
    const __VLS_70 = __VLS_69({}, ...__VLS_functionalComponentArgsRest(__VLS_69));
    var __VLS_67;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "base-item-main" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "base-item-name" },
    });
    (b.name);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "base-item-score" },
    });
    (b.score);
    const __VLS_72 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
        type: (b.status === '通过' ? 'success' : b.status === '关注' ? 'warning' : 'danger'),
        effect: "dark",
    }));
    const __VLS_74 = __VLS_73({
        type: (b.status === '通过' ? 'success' : b.status === '关注' ? 'warning' : 'danger'),
        effect: "dark",
    }, ...__VLS_functionalComponentArgsRest(__VLS_73));
    __VLS_75.slots.default;
    (b.status);
    var __VLS_75;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "base-item-body" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "base-item-desc" },
    });
    (b.desc);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "base-item-meta" },
    });
    (b.checkTime);
    (b.risks);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "base-item-actions" },
    });
    const __VLS_76 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
        ...{ 'onClick': {} },
        size: "small",
        link: true,
        type: "primary",
    }));
    const __VLS_78 = __VLS_77({
        ...{ 'onClick': {} },
        size: "small",
        link: true,
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_77));
    let __VLS_80;
    let __VLS_81;
    let __VLS_82;
    const __VLS_83 = {
        onClick: (...[$event]) => {
            __VLS_ctx.viewDetail(b);
        }
    };
    __VLS_79.slots.default;
    var __VLS_79;
    const __VLS_84 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
        ...{ 'onClick': {} },
        size: "small",
        link: true,
        type: "warning",
    }));
    const __VLS_86 = __VLS_85({
        ...{ 'onClick': {} },
        size: "small",
        link: true,
        type: "warning",
    }, ...__VLS_functionalComponentArgsRest(__VLS_85));
    let __VLS_88;
    let __VLS_89;
    let __VLS_90;
    const __VLS_91 = {
        onClick: (...[$event]) => {
            __VLS_ctx.startFix(b);
        }
    };
    __VLS_87.slots.default;
    var __VLS_87;
}
var __VLS_43;
var __VLS_39;
var __VLS_3;
const __VLS_92 = {}.ElDrawer;
/** @type {[typeof __VLS_components.ElDrawer, typeof __VLS_components.elDrawer, typeof __VLS_components.ElDrawer, typeof __VLS_components.elDrawer, ]} */ ;
// @ts-ignore
const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
    modelValue: (__VLS_ctx.detailVisible),
    title: "核查明细",
    size: "520px",
}));
const __VLS_94 = __VLS_93({
    modelValue: (__VLS_ctx.detailVisible),
    title: "核查明细",
    size: "520px",
}, ...__VLS_functionalComponentArgsRest(__VLS_93));
__VLS_95.slots.default;
if (__VLS_ctx.detailTarget) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "drawer-head" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "drawer-title" },
    });
    (__VLS_ctx.detailTarget.name);
    const __VLS_96 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
        type: (__VLS_ctx.detailTarget.status === '通过' ? 'success' : __VLS_ctx.detailTarget.status === '关注' ? 'warning' : 'danger'),
        effect: "dark",
    }));
    const __VLS_98 = __VLS_97({
        type: (__VLS_ctx.detailTarget.status === '通过' ? 'success' : __VLS_ctx.detailTarget.status === '关注' ? 'warning' : 'danger'),
        effect: "dark",
    }, ...__VLS_functionalComponentArgsRest(__VLS_97));
    __VLS_99.slots.default;
    (__VLS_ctx.detailTarget.status);
    var __VLS_99;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "drawer-score" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.b, __VLS_intrinsicElements.b)({
        ...{ style: {} },
    });
    (__VLS_ctx.detailTarget.score);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "detail-section-title" },
    });
    for (const [it, i] of __VLS_getVForSourceType((__VLS_ctx.detailTarget.items))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            key: (i),
            ...{ class: "check-item" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "check-item-head" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "check-item-name" },
        });
        (it.name);
        const __VLS_100 = {}.ElTag;
        /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
        // @ts-ignore
        const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
            size: "small",
            type: (it.pass ? 'success' : 'danger'),
            effect: "plain",
        }));
        const __VLS_102 = __VLS_101({
            size: "small",
            type: (it.pass ? 'success' : 'danger'),
            effect: "plain",
        }, ...__VLS_functionalComponentArgsRest(__VLS_101));
        __VLS_103.slots.default;
        (it.pass ? '符合' : '不符合');
        var __VLS_103;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "check-item-desc" },
        });
        (it.desc);
    }
}
var __VLS_95;
const __VLS_104 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
    modelValue: (__VLS_ctx.reportVisible),
    title: "安全基线核查报告",
    width: "720px",
}));
const __VLS_106 = __VLS_105({
    modelValue: (__VLS_ctx.reportVisible),
    title: "安全基线核查报告",
    width: "720px",
}, ...__VLS_functionalComponentArgsRest(__VLS_105));
__VLS_107.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "report-wrap" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "report-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "report-meta" },
});
(__VLS_ctx.lastScanTime);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "report-summary" },
});
(__VLS_ctx.overallScore);
(__VLS_ctx.passedCount);
(__VLS_ctx.warnCount);
(__VLS_ctx.failCount);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "report-section" },
});
for (const [r, i] of __VLS_getVForSourceType((__VLS_ctx.reportAdvice))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (i),
        ...{ class: "report-advice" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "advice-no" },
    });
    (i + 1);
    (r);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "report-section" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "report-ref" },
});
{
    const { footer: __VLS_thisSlot } = __VLS_107.slots;
    const __VLS_108 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
        ...{ 'onClick': {} },
    }));
    const __VLS_110 = __VLS_109({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_109));
    let __VLS_112;
    let __VLS_113;
    let __VLS_114;
    const __VLS_115 = {
        onClick: (...[$event]) => {
            __VLS_ctx.reportVisible = false;
        }
    };
    __VLS_111.slots.default;
    var __VLS_111;
    const __VLS_116 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
        ...{ 'onClick': {} },
        type: "danger",
    }));
    const __VLS_118 = __VLS_117({
        ...{ 'onClick': {} },
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_117));
    let __VLS_120;
    let __VLS_121;
    let __VLS_122;
    const __VLS_123 = {
        onClick: (__VLS_ctx.downloadReport)
    };
    __VLS_119.slots.default;
    var __VLS_119;
}
var __VLS_107;
/** @type {__VLS_StyleScopedClasses['standard-page']} */ ;
/** @type {__VLS_StyleScopedClasses['baseline-page']} */ ;
/** @type {__VLS_StyleScopedClasses['base-stats']} */ ;
/** @type {__VLS_StyleScopedClasses['base-stat']} */ ;
/** @type {__VLS_StyleScopedClasses['base-stat-value']} */ ;
/** @type {__VLS_StyleScopedClasses['base-stat-label']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['radar-box']} */ ;
/** @type {__VLS_StyleScopedClasses['base-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['scan-progress']} */ ;
/** @type {__VLS_StyleScopedClasses['last-scan']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['base-item']} */ ;
/** @type {__VLS_StyleScopedClasses['base-item-head']} */ ;
/** @type {__VLS_StyleScopedClasses['base-item-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['base-item-main']} */ ;
/** @type {__VLS_StyleScopedClasses['base-item-name']} */ ;
/** @type {__VLS_StyleScopedClasses['base-item-score']} */ ;
/** @type {__VLS_StyleScopedClasses['base-item-body']} */ ;
/** @type {__VLS_StyleScopedClasses['base-item-desc']} */ ;
/** @type {__VLS_StyleScopedClasses['base-item-meta']} */ ;
/** @type {__VLS_StyleScopedClasses['base-item-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['drawer-head']} */ ;
/** @type {__VLS_StyleScopedClasses['drawer-title']} */ ;
/** @type {__VLS_StyleScopedClasses['drawer-score']} */ ;
/** @type {__VLS_StyleScopedClasses['detail-section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['check-item']} */ ;
/** @type {__VLS_StyleScopedClasses['check-item-head']} */ ;
/** @type {__VLS_StyleScopedClasses['check-item-name']} */ ;
/** @type {__VLS_StyleScopedClasses['check-item-desc']} */ ;
/** @type {__VLS_StyleScopedClasses['report-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['report-title']} */ ;
/** @type {__VLS_StyleScopedClasses['report-meta']} */ ;
/** @type {__VLS_StyleScopedClasses['report-summary']} */ ;
/** @type {__VLS_StyleScopedClasses['report-section']} */ ;
/** @type {__VLS_StyleScopedClasses['report-advice']} */ ;
/** @type {__VLS_StyleScopedClasses['advice-no']} */ ;
/** @type {__VLS_StyleScopedClasses['report-section']} */ ;
/** @type {__VLS_StyleScopedClasses['report-ref']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Document: Document,
            Refresh: Refresh,
            statsCards: statsCards,
            iconMap: iconMap,
            iconBg: iconBg,
            statusFilter: statusFilter,
            filteredBaselines: filteredBaselines,
            overallScore: overallScore,
            passedCount: passedCount,
            warnCount: warnCount,
            failCount: failCount,
            lastScanTime: lastScanTime,
            reportAdvice: reportAdvice,
            scanning: scanning,
            scanProgress: scanProgress,
            startScan: startScan,
            detailVisible: detailVisible,
            detailTarget: detailTarget,
            viewDetail: viewDetail,
            startFix: startFix,
            reportVisible: reportVisible,
            openReport: openReport,
            downloadReport: downloadReport,
            radarEl: radarEl,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
