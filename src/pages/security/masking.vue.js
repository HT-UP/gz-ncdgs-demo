import { computed, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { Link, Plus, Search } from '@element-plus/icons-vue';
const activeTab = ref('rules');
const statsCards = [
    { label: '脱敏规则总数', value: '9', color: '#fff', bg: 'linear-gradient(135deg, #DA251D, #B71C1C)' },
    { label: '已绑定敏感字段', value: '86', color: '#00A854', bg: 'rgba(0,168,84,.1)' },
    { label: '未脱敏风险字段', value: '12', color: '#ED7B2F', bg: 'rgba(237,123,47,.1)' },
    { label: '生效中规则', value: '7', color: '#2B6CB0', bg: 'rgba(43,108,176,.1)' },
];
const algorithms = [
    { key: 'masking', name: '遮盖', desc: '将敏感字符统一替换为遮罩符', sample: '张三', output: '***' },
    { key: 'replace', name: '替换', desc: '按映射字典完成替换（拼音/同义词）', sample: '广州市', output: '广州市★' },
    { key: 'hash', name: '哈希', desc: 'SM3/SHA-256 加盐不可逆哈希', sample: '13812345678', output: 'f9b3a1…（64位）' },
    { key: 'encrypt', name: '加密', desc: 'AES-256 国密可逆加密保真', sample: '13812345678', output: 'R9wK…（密文）' },
    { key: 'shuffle', name: '洗牌', desc: '列内随机重排保持统计特性', sample: '张三', output: '李四' },
    { key: 'truncation', name: '截断', desc: '保留前 N 位并补全', sample: '510102199001011234', output: '5101021990********' },
    { key: 'dateOffset', name: '日期偏移取整', desc: '日期按月/年偏移取整', sample: '2026-08-13', output: '2026-08-01' },
    { key: 'keep', name: '掩码', desc: '保留首尾各 N 位，中间遮盖', sample: '13812345678', output: '138****5678' },
    { key: 'permute', name: '重排', desc: '字典映射替换（姓名→花名）', sample: '张三', output: '匿名_0284' },
    { key: 'rewrite', name: '重写', desc: '正则表达式规则化改写', sample: 'abc-12345', output: 'bcd-23456' },
    { key: 'limitRows', name: '限制返回行数', desc: '仅返回前 N 行数据', sample: '1000行', output: '前100行' },
];
const algoMap = Object.fromEntries(algorithms.map((a) => [a.key, a]));
const algoName = (key) => algoMap[key]?.name ?? key;
const statusTag = { 生效中: 'success', 草稿: 'info', 已停用: 'danger' };
const rules = ref([
    { id: 1, name: '手机号脱敏', algo: 'keep', paramText: '保留前3后4', boundFields: 18, scope: '全局生效', status: '生效中', updateTime: '2026-08-10 10:30' },
    { id: 2, name: '身份证号脱敏', algo: 'truncation', paramText: '保留前6位', boundFields: 12, scope: '全局生效', status: '生效中', updateTime: '2026-08-09 16:20' },
    { id: 3, name: '姓名脱敏（掩码）', algo: 'masking', paramText: '全遮盖', boundFields: 15, scope: '指定服务', status: '生效中', updateTime: '2026-08-08 09:10' },
    { id: 4, name: '银行卡号脱敏', algo: 'keep', paramText: '保留前4后4', boundFields: 8, scope: '全局生效', status: '生效中', updateTime: '2026-08-07 14:45' },
    { id: 5, name: '邮箱地址脱敏', algo: 'replace', paramText: '本地部位置换', boundFields: 9, scope: '指定应用', status: '生效中', updateTime: '2026-08-06 11:00' },
    { id: 6, name: '地址信息脱敏', algo: 'rewrite', paramText: '正则仅保留区级', boundFields: 7, scope: '指定服务', status: '生效中', updateTime: '2026-08-05 15:30' },
    { id: 7, name: '出生日期偏移', algo: 'dateOffset', paramText: '按月取整', boundFields: 5, scope: '全局生效', status: '生效中', updateTime: '2026-08-04 10:20' },
    { id: 8, name: '支付宝账户脱敏', algo: 'hash', paramText: 'SHA-256 加盐', boundFields: 6, scope: '全局生效', status: '草稿', updateTime: '2026-08-11 09:12' },
    { id: 9, name: '飞行常客号', algo: 'permute', paramText: '字典置换', boundFields: 6, scope: '指定应用', status: '已停用', updateTime: '2026-07-28 17:40' },
]);
const ruleKeyword = ref('');
const ruleAlgo = ref('');
const ruleStatus = ref('');
const filteredRules = computed(() => rules.value.filter((r) => {
    if (ruleAlgo.value && r.algo !== ruleAlgo.value)
        return false;
    if (ruleStatus.value && r.status !== ruleStatus.value)
        return false;
    if (!ruleKeyword.value)
        return true;
    return r.name.toLowerCase().includes(ruleKeyword.value.toLowerCase());
}));
const createVisible = ref(false);
const editingRule = ref(null);
const ruleForm = ref({ name: '', algo: 'keep', scope: '全局生效', keep: 3, salt: '' });
const tryValue = ref('13812345678');
const currentAlgo = computed(() => algoMap[ruleForm.value.algo]);
const algoParamsVisible = computed(() => ['keep', 'truncation', 'hash'].includes(ruleForm.value.algo));
const tryResult = computed(() => {
    const v = tryValue.value || currentAlgo.value?.sample || '';
    switch (ruleForm.value.algo) {
        case 'keep': {
            const k = Math.min(ruleForm.value.keep || 3, v.length - 1);
            return v.length <= ruleForm.value.keep * 2 ? '***'.repeat(Math.max(1, v.length)) : `${v.slice(0, k)}${'*'.repeat(Math.max(4, v.length - k * 2))}${v.slice(-k)}`;
        }
        case 'masking':
            return '*'.repeat(Math.min(6, Math.max(3, v.length)));
        case 'truncation':
            return v.length > 6 ? `${v.slice(0, 6)}${'*'.repeat(v.length - 6)}` : v;
        case 'hash':
            return '<哈希密文-不可逆>';
        case 'encrypt':
            return '<AES-256 密文>';
        case 'dateOffset':
            return v.replace(/-\d{2}$/, '-01');
        case 'replace':
            return `★${v}`;
        case 'shuffle':
            return '（列内随机置换值）';
        case 'permute':
            return '匿名_0284';
        case 'rewrite':
            return v.replace(/[a-y]/g, (c) => String.fromCharCode(c.charCodeAt(0) + 1));
        case 'limitRows':
            return '（仅返回前 N 行）';
        default:
            return v;
    }
});
const onAlgoChange = () => {
    tryValue.value = currentAlgo.value?.sample ?? '';
};
const openCreate = () => {
    editingRule.value = null;
    ruleForm.value = { name: '', algo: 'keep', scope: '全局生效', keep: 3, salt: '' };
    tryValue.value = algorithms[7].sample;
    createVisible.value = true;
};
const editRule = (row) => {
    editingRule.value = row;
    ruleForm.value = { name: row.name, algo: row.algo, scope: row.scope, keep: 3, salt: '' };
    createVisible.value = true;
};
const saveRule = (enabled) => {
    if (!ruleForm.value.name.trim()) {
        ElMessage.warning('请填写规则名称');
        return;
    }
    ElMessage.success(enabled ? `脱敏规则「${ruleForm.value.name}」已启用并生效验证通过（Mock）` : '脱敏规则已保存为草稿（Mock）');
    createVisible.value = false;
};
const testRule = (row) => {
    ElMessage.success(`「${row.name}」试算预览：${algoName(row.algo)} 算法输出正常（Mock），点击新建弹窗可手动试算`);
};
const toggleRule = (row) => {
    row.status = row.status === '生效中' ? '已停用' : '生效中';
    ElMessage.success(`「${row.name}」已${row.status}`);
};
const fields = ref([
    { id: 1, table: 'ticket_sale', field: 'id_card', classified: '证件信息', source: '特征识别', rule: '' },
    { id: 2, table: 'ticket_sale', field: 'phone', classified: '个人信息/敏感', source: '分类分级', rule: '手机号脱敏' },
    { id: 3, table: 'passenger_info', field: 'name', classified: '个人信息/敏感', source: '特征识别', rule: '姓名脱敏（掩码）' },
    { id: 4, table: 'payment_record', field: 'bank_no', classified: '金融信息', source: '分类分级', rule: '银行卡号脱敏' },
    { id: 5, table: 'passenger_info', field: 'email', classified: '个人信息/敏感', source: '特征识别', rule: '' },
    { id: 6, table: 'payment_record', field: 'owner_name', classified: '个人信息/敏感', source: '分类分级', rule: '姓名脱敏（掩码）' },
    { id: 7, table: 'ticket_sale', field: 'address', classified: '个人信息/敏感', source: '特征识别', rule: '地址信息脱敏' },
    { id: 8, table: 'staff_info', field: 'salary', classified: '金融信息', source: '分类分级', rule: '' },
    { id: 9, table: 'passenger_info', field: 'birthday', classified: '个人信息/敏感', source: '分类分级', rule: '出生日期偏移' },
    { id: 10, table: 'ticket_sale', field: 'alipay_no', classified: '金融信息', source: '特征识别', rule: '' },
]);
const bindClass = ref('');
const bindStatus = ref('');
const selection = ref([]);
const onSelectionChange = (rows) => {
    selection.value = rows;
};
const filteredFields = computed(() => fields.value.filter((f) => {
    if (bindClass.value && f.classified !== bindClass.value)
        return false;
    if (bindStatus.value === '已绑定' && !f.rule)
        return false;
    if (bindStatus.value === '未绑定' && f.rule)
        return false;
    return true;
}));
const batchVisible = ref(false);
const batchRule = ref('');
const openBatchBind = () => {
    batchRule.value = '';
    batchVisible.value = true;
};
const saveBatchBind = () => {
    if (!batchRule.value)
        return;
    selection.value.forEach((f) => (f.rule = batchRule.value));
    ElMessage.success(`已为 ${selection.value.length} 个敏感字段批量绑定「${batchRule.value}」（Mock）`);
    batchVisible.value = false;
};
const bindBatch = (action) => {
    selection.value.forEach((f) => (f.rule = ''));
    ElMessage.success(`已${action} ${selection.value.length} 个字段的绑定（Mock）`);
};
const unmaskedFields = computed(() => fields.value.filter((f) => !f.rule).map((f) => ({ ...f, detectTime: '2026-08-12 08:00', risk: f.classified === '金融信息' ? '高' : '中' })));
const quickBind = (row) => {
    const target = fields.value.find((f) => f.id === row.id);
    if (target)
        target.rule = row.classified === '证件信息' ? '身份证号脱敏' : '手机号脱敏';
    ElMessage.success(`已为「${row.table}.${row.field}」绑定默认规则（Mock）`);
};
const viewField = (row) => {
    ElMessage.info(`已忽略「${row.table}.${row.field}」，可在规则列表操作中重新绑定`);
};
const auditType = ref('all');
const allAudits = [
    { time: '2026-08-12 09:32', operator: '安全管理员', type: '生效', content: '手机号脱敏规则在 8 个数据服务上生效验证通过', result: '成功' },
    { time: '2026-08-12 09:18', operator: '数据治理员', type: '绑定', content: '批量绑定 5 个敏感字段至 银行卡号脱敏', result: '成功' },
    { time: '2026-08-11 17:02', operator: '安全管理员', type: '密钥', content: '主密钥 KEY-DSM-2026-01 轮换完成，新旧密钥双活', result: '成功' },
    { time: '2026-08-11 15:40', operator: '数据治理员', type: '绑定', content: '字段 ticket_sale.address 绑定 地址信息脱敏', result: '成功' },
    { time: '2026-08-11 10:12', operator: '系统管理员', type: '密钥', content: '密钥 KEY-UDF-2025-09 到期销毁，相关密文已迁移', result: '成功' },
    { time: '2026-08-10 16:08', operator: '数据治理员', type: '生效', content: '姓名脱敏（掩码）在指定服务范围生效验证失败，已回滚', result: '失败' },
];
const auditLogs = computed(() => (auditType.value === 'all' ? allAudits : allAudits.filter((a) => a.type === auditType.value)));
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "standard-page masking-page" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "mask-stats" },
});
for (const [s] of __VLS_getVForSourceType((__VLS_ctx.statsCards))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (s.label),
        ...{ class: "mask-stat" },
        ...{ style: ({ background: s.bg, color: s.color }) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "mask-stat-value" },
    });
    (s.value);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "mask-stat-label" },
    });
    (s.label);
}
const __VLS_0 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ class: "panel-card" },
    shadow: "never",
}));
const __VLS_2 = __VLS_1({
    ...{ class: "panel-card" },
    shadow: "never",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
const __VLS_4 = {}.ElTabs;
/** @type {[typeof __VLS_components.ElTabs, typeof __VLS_components.elTabs, typeof __VLS_components.ElTabs, typeof __VLS_components.elTabs, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    modelValue: (__VLS_ctx.activeTab),
    ...{ class: "mask-tabs" },
}));
const __VLS_6 = __VLS_5({
    modelValue: (__VLS_ctx.activeTab),
    ...{ class: "mask-tabs" },
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
__VLS_7.slots.default;
const __VLS_8 = {}.ElTabPane;
/** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    label: "规则列表",
    name: "rules",
}));
const __VLS_10 = __VLS_9({
    label: "规则列表",
    name: "rules",
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
__VLS_11.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "toolbar-row" },
});
const __VLS_12 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
    modelValue: (__VLS_ctx.ruleKeyword),
    placeholder: "按规则名称 / 绑定表搜索",
    clearable: true,
    ...{ class: "search-input" },
    prefixIcon: (__VLS_ctx.Search),
}));
const __VLS_14 = __VLS_13({
    modelValue: (__VLS_ctx.ruleKeyword),
    placeholder: "按规则名称 / 绑定表搜索",
    clearable: true,
    ...{ class: "search-input" },
    prefixIcon: (__VLS_ctx.Search),
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
const __VLS_16 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    modelValue: (__VLS_ctx.ruleAlgo),
    placeholder: "算法",
    clearable: true,
    ...{ class: "filter-select" },
}));
const __VLS_18 = __VLS_17({
    modelValue: (__VLS_ctx.ruleAlgo),
    placeholder: "算法",
    clearable: true,
    ...{ class: "filter-select" },
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
__VLS_19.slots.default;
for (const [a] of __VLS_getVForSourceType((__VLS_ctx.algorithms))) {
    const __VLS_20 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
        key: (a.key),
        label: (a.name),
        value: (a.key),
    }));
    const __VLS_22 = __VLS_21({
        key: (a.key),
        label: (a.name),
        value: (a.key),
    }, ...__VLS_functionalComponentArgsRest(__VLS_21));
}
var __VLS_19;
const __VLS_24 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    modelValue: (__VLS_ctx.ruleStatus),
    placeholder: "状态",
    clearable: true,
    ...{ class: "filter-select" },
}));
const __VLS_26 = __VLS_25({
    modelValue: (__VLS_ctx.ruleStatus),
    placeholder: "状态",
    clearable: true,
    ...{ class: "filter-select" },
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
__VLS_27.slots.default;
const __VLS_28 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
    label: "生效中",
    value: "生效中",
}));
const __VLS_30 = __VLS_29({
    label: "生效中",
    value: "生效中",
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
const __VLS_32 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
    label: "草稿",
    value: "草稿",
}));
const __VLS_34 = __VLS_33({
    label: "草稿",
    value: "草稿",
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
const __VLS_36 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    label: "已停用",
    value: "已停用",
}));
const __VLS_38 = __VLS_37({
    label: "已停用",
    value: "已停用",
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
var __VLS_27;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "dep-text" },
});
(__VLS_ctx.filteredRules.length);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "toolbar-right" },
});
const __VLS_40 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
    ...{ 'onClick': {} },
    type: "danger",
    size: "small",
    icon: (__VLS_ctx.Plus),
}));
const __VLS_42 = __VLS_41({
    ...{ 'onClick': {} },
    type: "danger",
    size: "small",
    icon: (__VLS_ctx.Plus),
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
let __VLS_44;
let __VLS_45;
let __VLS_46;
const __VLS_47 = {
    onClick: (__VLS_ctx.openCreate)
};
__VLS_43.slots.default;
var __VLS_43;
const __VLS_48 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
    data: (__VLS_ctx.filteredRules),
    size: "small",
    stripe: true,
    ...{ class: "mt-12" },
}));
const __VLS_50 = __VLS_49({
    data: (__VLS_ctx.filteredRules),
    size: "small",
    stripe: true,
    ...{ class: "mt-12" },
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
__VLS_51.slots.default;
const __VLS_52 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
    prop: "name",
    label: "规则名称",
    minWidth: "150",
    showOverflowTooltip: true,
}));
const __VLS_54 = __VLS_53({
    prop: "name",
    label: "规则名称",
    minWidth: "150",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
const __VLS_56 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
    label: "算法",
    width: "150",
}));
const __VLS_58 = __VLS_57({
    label: "算法",
    width: "150",
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
__VLS_59.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_59.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_60 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
        size: "small",
        effect: "plain",
        type: "primary",
    }));
    const __VLS_62 = __VLS_61({
        size: "small",
        effect: "plain",
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_61));
    __VLS_63.slots.default;
    (__VLS_ctx.algoName(row.algo));
    var __VLS_63;
}
var __VLS_59;
const __VLS_64 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
    prop: "paramText",
    label: "算法参数",
    minWidth: "170",
    showOverflowTooltip: true,
}));
const __VLS_66 = __VLS_65({
    prop: "paramText",
    label: "算法参数",
    minWidth: "170",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_65));
const __VLS_68 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
    prop: "boundFields",
    label: "绑定字段",
    width: "76",
    align: "center",
}));
const __VLS_70 = __VLS_69({
    prop: "boundFields",
    label: "绑定字段",
    width: "76",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_69));
const __VLS_72 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
    label: "生效范围",
    width: "120",
}));
const __VLS_74 = __VLS_73({
    label: "生效范围",
    width: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_73));
__VLS_75.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_75.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "dep-text" },
    });
    (row.scope);
}
var __VLS_75;
const __VLS_76 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
    label: "状态",
    width: "82",
}));
const __VLS_78 = __VLS_77({
    label: "状态",
    width: "82",
}, ...__VLS_functionalComponentArgsRest(__VLS_77));
__VLS_79.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_79.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_80 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
        size: "small",
        type: (__VLS_ctx.statusTag[row.status]),
        effect: "dark",
    }));
    const __VLS_82 = __VLS_81({
        size: "small",
        type: (__VLS_ctx.statusTag[row.status]),
        effect: "dark",
    }, ...__VLS_functionalComponentArgsRest(__VLS_81));
    __VLS_83.slots.default;
    (row.status);
    var __VLS_83;
}
var __VLS_79;
const __VLS_84 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
    prop: "updateTime",
    label: "更新时间",
    width: "106",
}));
const __VLS_86 = __VLS_85({
    prop: "updateTime",
    label: "更新时间",
    width: "106",
}, ...__VLS_functionalComponentArgsRest(__VLS_85));
const __VLS_88 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
    label: "操作",
    width: "200",
    fixed: "right",
}));
const __VLS_90 = __VLS_89({
    label: "操作",
    width: "200",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_89));
__VLS_91.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_91.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_92 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
        size: "small",
    }));
    const __VLS_94 = __VLS_93({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_93));
    let __VLS_96;
    let __VLS_97;
    let __VLS_98;
    const __VLS_99 = {
        onClick: (...[$event]) => {
            __VLS_ctx.testRule(row);
        }
    };
    __VLS_95.slots.default;
    var __VLS_95;
    const __VLS_100 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
        ...{ 'onClick': {} },
        link: true,
        type: "warning",
        size: "small",
    }));
    const __VLS_102 = __VLS_101({
        ...{ 'onClick': {} },
        link: true,
        type: "warning",
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_101));
    let __VLS_104;
    let __VLS_105;
    let __VLS_106;
    const __VLS_107 = {
        onClick: (...[$event]) => {
            __VLS_ctx.editRule(row);
        }
    };
    __VLS_103.slots.default;
    var __VLS_103;
    const __VLS_108 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
        ...{ 'onClick': {} },
        link: true,
        type: (row.status === '生效中' ? 'info' : 'success'),
        size: "small",
    }));
    const __VLS_110 = __VLS_109({
        ...{ 'onClick': {} },
        link: true,
        type: (row.status === '生效中' ? 'info' : 'success'),
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_109));
    let __VLS_112;
    let __VLS_113;
    let __VLS_114;
    const __VLS_115 = {
        onClick: (...[$event]) => {
            __VLS_ctx.toggleRule(row);
        }
    };
    __VLS_111.slots.default;
    (row.status === '生效中' ? '停用' : row.status === '草稿' ? '启用' : '恢复');
    var __VLS_111;
}
var __VLS_91;
var __VLS_51;
var __VLS_11;
const __VLS_116 = {}.ElTabPane;
/** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
// @ts-ignore
const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
    label: "字段绑定",
    name: "binding",
}));
const __VLS_118 = __VLS_117({
    label: "字段绑定",
    name: "binding",
}, ...__VLS_functionalComponentArgsRest(__VLS_117));
__VLS_119.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "toolbar-row" },
});
const __VLS_120 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({
    modelValue: (__VLS_ctx.bindClass),
    placeholder: "按分类分级筛选",
    clearable: true,
    ...{ class: "filter-select-lg" },
}));
const __VLS_122 = __VLS_121({
    modelValue: (__VLS_ctx.bindClass),
    placeholder: "按分类分级筛选",
    clearable: true,
    ...{ class: "filter-select-lg" },
}, ...__VLS_functionalComponentArgsRest(__VLS_121));
__VLS_123.slots.default;
const __VLS_124 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({
    label: "个人信息/敏感",
    value: "个人信息/敏感",
}));
const __VLS_126 = __VLS_125({
    label: "个人信息/敏感",
    value: "个人信息/敏感",
}, ...__VLS_functionalComponentArgsRest(__VLS_125));
const __VLS_128 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({
    label: "金融信息",
    value: "金融信息",
}));
const __VLS_130 = __VLS_129({
    label: "金融信息",
    value: "金融信息",
}, ...__VLS_functionalComponentArgsRest(__VLS_129));
const __VLS_132 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132({
    label: "生物识别信息",
    value: "生物识别信息",
}));
const __VLS_134 = __VLS_133({
    label: "生物识别信息",
    value: "生物识别信息",
}, ...__VLS_functionalComponentArgsRest(__VLS_133));
const __VLS_136 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_137 = __VLS_asFunctionalComponent(__VLS_136, new __VLS_136({
    label: "证件信息",
    value: "证件信息",
}));
const __VLS_138 = __VLS_137({
    label: "证件信息",
    value: "证件信息",
}, ...__VLS_functionalComponentArgsRest(__VLS_137));
var __VLS_123;
const __VLS_140 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_141 = __VLS_asFunctionalComponent(__VLS_140, new __VLS_140({
    modelValue: (__VLS_ctx.bindStatus),
    placeholder: "绑定状态",
    clearable: true,
    ...{ class: "filter-select" },
}));
const __VLS_142 = __VLS_141({
    modelValue: (__VLS_ctx.bindStatus),
    placeholder: "绑定状态",
    clearable: true,
    ...{ class: "filter-select" },
}, ...__VLS_functionalComponentArgsRest(__VLS_141));
__VLS_143.slots.default;
const __VLS_144 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_145 = __VLS_asFunctionalComponent(__VLS_144, new __VLS_144({
    label: "已绑定",
    value: "已绑定",
}));
const __VLS_146 = __VLS_145({
    label: "已绑定",
    value: "已绑定",
}, ...__VLS_functionalComponentArgsRest(__VLS_145));
const __VLS_148 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_149 = __VLS_asFunctionalComponent(__VLS_148, new __VLS_148({
    label: "未绑定",
    value: "未绑定",
}));
const __VLS_150 = __VLS_149({
    label: "未绑定",
    value: "未绑定",
}, ...__VLS_functionalComponentArgsRest(__VLS_149));
var __VLS_143;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "toolbar-right" },
});
const __VLS_152 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_153 = __VLS_asFunctionalComponent(__VLS_152, new __VLS_152({
    ...{ 'onClick': {} },
    size: "small",
    plain: true,
    disabled: (!__VLS_ctx.selection.length),
}));
const __VLS_154 = __VLS_153({
    ...{ 'onClick': {} },
    size: "small",
    plain: true,
    disabled: (!__VLS_ctx.selection.length),
}, ...__VLS_functionalComponentArgsRest(__VLS_153));
let __VLS_156;
let __VLS_157;
let __VLS_158;
const __VLS_159 = {
    onClick: (...[$event]) => {
        __VLS_ctx.bindBatch('清除');
    }
};
__VLS_155.slots.default;
var __VLS_155;
const __VLS_160 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_161 = __VLS_asFunctionalComponent(__VLS_160, new __VLS_160({
    ...{ 'onClick': {} },
    size: "small",
    type: "danger",
    icon: (__VLS_ctx.Link),
    disabled: (!__VLS_ctx.selection.length),
}));
const __VLS_162 = __VLS_161({
    ...{ 'onClick': {} },
    size: "small",
    type: "danger",
    icon: (__VLS_ctx.Link),
    disabled: (!__VLS_ctx.selection.length),
}, ...__VLS_functionalComponentArgsRest(__VLS_161));
let __VLS_164;
let __VLS_165;
let __VLS_166;
const __VLS_167 = {
    onClick: (__VLS_ctx.openBatchBind)
};
__VLS_163.slots.default;
var __VLS_163;
const __VLS_168 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_169 = __VLS_asFunctionalComponent(__VLS_168, new __VLS_168({
    ...{ 'onSelectionChange': {} },
    data: (__VLS_ctx.filteredFields),
    size: "small",
    stripe: true,
    ...{ class: "mt-12" },
}));
const __VLS_170 = __VLS_169({
    ...{ 'onSelectionChange': {} },
    data: (__VLS_ctx.filteredFields),
    size: "small",
    stripe: true,
    ...{ class: "mt-12" },
}, ...__VLS_functionalComponentArgsRest(__VLS_169));
let __VLS_172;
let __VLS_173;
let __VLS_174;
const __VLS_175 = {
    onSelectionChange: (__VLS_ctx.onSelectionChange)
};
__VLS_171.slots.default;
const __VLS_176 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_177 = __VLS_asFunctionalComponent(__VLS_176, new __VLS_176({
    type: "selection",
    width: "42",
}));
const __VLS_178 = __VLS_177({
    type: "selection",
    width: "42",
}, ...__VLS_functionalComponentArgsRest(__VLS_177));
const __VLS_180 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_181 = __VLS_asFunctionalComponent(__VLS_180, new __VLS_180({
    prop: "table",
    label: "所属表",
    minWidth: "150",
    showOverflowTooltip: true,
}));
const __VLS_182 = __VLS_181({
    prop: "table",
    label: "所属表",
    minWidth: "150",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_181));
const __VLS_184 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_185 = __VLS_asFunctionalComponent(__VLS_184, new __VLS_184({
    prop: "field",
    label: "字段",
    width: "120",
}));
const __VLS_186 = __VLS_185({
    prop: "field",
    label: "字段",
    width: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_185));
const __VLS_188 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_189 = __VLS_asFunctionalComponent(__VLS_188, new __VLS_188({
    prop: "classified",
    label: "分类分级",
    width: "130",
}));
const __VLS_190 = __VLS_189({
    prop: "classified",
    label: "分类分级",
    width: "130",
}, ...__VLS_functionalComponentArgsRest(__VLS_189));
const __VLS_192 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_193 = __VLS_asFunctionalComponent(__VLS_192, new __VLS_192({
    prop: "source",
    label: "识别来源",
    width: "110",
}));
const __VLS_194 = __VLS_193({
    prop: "source",
    label: "识别来源",
    width: "110",
}, ...__VLS_functionalComponentArgsRest(__VLS_193));
const __VLS_196 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_197 = __VLS_asFunctionalComponent(__VLS_196, new __VLS_196({
    label: "绑定规则",
    minWidth: "150",
}));
const __VLS_198 = __VLS_197({
    label: "绑定规则",
    minWidth: "150",
}, ...__VLS_functionalComponentArgsRest(__VLS_197));
__VLS_199.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_199.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    if (row.rule) {
        const __VLS_200 = {}.ElTag;
        /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
        // @ts-ignore
        const __VLS_201 = __VLS_asFunctionalComponent(__VLS_200, new __VLS_200({
            size: "small",
            type: "success",
            effect: "plain",
        }));
        const __VLS_202 = __VLS_201({
            size: "small",
            type: "success",
            effect: "plain",
        }, ...__VLS_functionalComponentArgsRest(__VLS_201));
        __VLS_203.slots.default;
        (row.rule);
        var __VLS_203;
    }
    else {
        const __VLS_204 = {}.ElTag;
        /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
        // @ts-ignore
        const __VLS_205 = __VLS_asFunctionalComponent(__VLS_204, new __VLS_204({
            size: "small",
            type: "danger",
            effect: "plain",
        }));
        const __VLS_206 = __VLS_205({
            size: "small",
            type: "danger",
            effect: "plain",
        }, ...__VLS_functionalComponentArgsRest(__VLS_205));
        __VLS_207.slots.default;
        var __VLS_207;
    }
}
var __VLS_199;
var __VLS_171;
var __VLS_119;
const __VLS_208 = {}.ElTabPane;
/** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
// @ts-ignore
const __VLS_209 = __VLS_asFunctionalComponent(__VLS_208, new __VLS_208({
    label: "未脱敏监测",
    name: "unmasked",
}));
const __VLS_210 = __VLS_209({
    label: "未脱敏监测",
    name: "unmasked",
}, ...__VLS_functionalComponentArgsRest(__VLS_209));
__VLS_211.slots.default;
const __VLS_212 = {}.ElAlert;
/** @type {[typeof __VLS_components.ElAlert, typeof __VLS_components.elAlert, typeof __VLS_components.ElAlert, typeof __VLS_components.elAlert, ]} */ ;
// @ts-ignore
const __VLS_213 = __VLS_asFunctionalComponent(__VLS_212, new __VLS_212({
    type: "warning",
    closable: (false),
    showIcon: true,
    ...{ class: "mb-16" },
}));
const __VLS_214 = __VLS_213({
    type: "warning",
    closable: (false),
    showIcon: true,
    ...{ class: "mb-16" },
}, ...__VLS_functionalComponentArgsRest(__VLS_213));
__VLS_215.slots.default;
{
    const { title: __VLS_thisSlot } = __VLS_215.slots;
    (__VLS_ctx.unmaskedFields.length);
}
var __VLS_215;
const __VLS_216 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_217 = __VLS_asFunctionalComponent(__VLS_216, new __VLS_216({
    data: (__VLS_ctx.unmaskedFields),
    size: "small",
    stripe: true,
}));
const __VLS_218 = __VLS_217({
    data: (__VLS_ctx.unmaskedFields),
    size: "small",
    stripe: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_217));
__VLS_219.slots.default;
const __VLS_220 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_221 = __VLS_asFunctionalComponent(__VLS_220, new __VLS_220({
    prop: "table",
    label: "所属表",
    minWidth: "160",
}));
const __VLS_222 = __VLS_221({
    prop: "table",
    label: "所属表",
    minWidth: "160",
}, ...__VLS_functionalComponentArgsRest(__VLS_221));
const __VLS_224 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_225 = __VLS_asFunctionalComponent(__VLS_224, new __VLS_224({
    prop: "field",
    label: "字段",
    width: "130",
}));
const __VLS_226 = __VLS_225({
    prop: "field",
    label: "字段",
    width: "130",
}, ...__VLS_functionalComponentArgsRest(__VLS_225));
const __VLS_228 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_229 = __VLS_asFunctionalComponent(__VLS_228, new __VLS_228({
    prop: "classified",
    label: "分类分级",
    width: "130",
}));
const __VLS_230 = __VLS_229({
    prop: "classified",
    label: "分类分级",
    width: "130",
}, ...__VLS_functionalComponentArgsRest(__VLS_229));
const __VLS_232 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_233 = __VLS_asFunctionalComponent(__VLS_232, new __VLS_232({
    prop: "detectTime",
    label: "识别时间",
    width: "110",
}));
const __VLS_234 = __VLS_233({
    prop: "detectTime",
    label: "识别时间",
    width: "110",
}, ...__VLS_functionalComponentArgsRest(__VLS_233));
const __VLS_236 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_237 = __VLS_asFunctionalComponent(__VLS_236, new __VLS_236({
    label: "风险等级",
    width: "90",
}));
const __VLS_238 = __VLS_237({
    label: "风险等级",
    width: "90",
}, ...__VLS_functionalComponentArgsRest(__VLS_237));
__VLS_239.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_239.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "security-level" },
        ...{ style: ({ background: row.risk === '高' ? '#DA251D' : '#ED7B2F' }) },
    });
    (row.risk);
}
var __VLS_239;
const __VLS_240 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_241 = __VLS_asFunctionalComponent(__VLS_240, new __VLS_240({
    label: "操作",
    width: "120",
}));
const __VLS_242 = __VLS_241({
    label: "操作",
    width: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_241));
__VLS_243.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_243.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_244 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_245 = __VLS_asFunctionalComponent(__VLS_244, new __VLS_244({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
        size: "small",
    }));
    const __VLS_246 = __VLS_245({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_245));
    let __VLS_248;
    let __VLS_249;
    let __VLS_250;
    const __VLS_251 = {
        onClick: (...[$event]) => {
            __VLS_ctx.quickBind(row);
        }
    };
    __VLS_247.slots.default;
    var __VLS_247;
    const __VLS_252 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_253 = __VLS_asFunctionalComponent(__VLS_252, new __VLS_252({
        ...{ 'onClick': {} },
        link: true,
        type: "info",
        size: "small",
    }));
    const __VLS_254 = __VLS_253({
        ...{ 'onClick': {} },
        link: true,
        type: "info",
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_253));
    let __VLS_256;
    let __VLS_257;
    let __VLS_258;
    const __VLS_259 = {
        onClick: (...[$event]) => {
            __VLS_ctx.viewField(row);
        }
    };
    __VLS_255.slots.default;
    var __VLS_255;
}
var __VLS_243;
var __VLS_219;
var __VLS_211;
const __VLS_260 = {}.ElTabPane;
/** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
// @ts-ignore
const __VLS_261 = __VLS_asFunctionalComponent(__VLS_260, new __VLS_260({
    label: "审计溯源",
    name: "audit",
}));
const __VLS_262 = __VLS_261({
    label: "审计溯源",
    name: "audit",
}, ...__VLS_functionalComponentArgsRest(__VLS_261));
__VLS_263.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "toolbar-row" },
});
const __VLS_264 = {}.ElRadioGroup;
/** @type {[typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, ]} */ ;
// @ts-ignore
const __VLS_265 = __VLS_asFunctionalComponent(__VLS_264, new __VLS_264({
    modelValue: (__VLS_ctx.auditType),
    size: "small",
}));
const __VLS_266 = __VLS_265({
    modelValue: (__VLS_ctx.auditType),
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_265));
__VLS_267.slots.default;
const __VLS_268 = {}.ElRadioButton;
/** @type {[typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, ]} */ ;
// @ts-ignore
const __VLS_269 = __VLS_asFunctionalComponent(__VLS_268, new __VLS_268({
    value: "all",
}));
const __VLS_270 = __VLS_269({
    value: "all",
}, ...__VLS_functionalComponentArgsRest(__VLS_269));
__VLS_271.slots.default;
var __VLS_271;
const __VLS_272 = {}.ElRadioButton;
/** @type {[typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, ]} */ ;
// @ts-ignore
const __VLS_273 = __VLS_asFunctionalComponent(__VLS_272, new __VLS_272({
    value: "生效",
}));
const __VLS_274 = __VLS_273({
    value: "生效",
}, ...__VLS_functionalComponentArgsRest(__VLS_273));
__VLS_275.slots.default;
var __VLS_275;
const __VLS_276 = {}.ElRadioButton;
/** @type {[typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, ]} */ ;
// @ts-ignore
const __VLS_277 = __VLS_asFunctionalComponent(__VLS_276, new __VLS_276({
    value: "绑定",
}));
const __VLS_278 = __VLS_277({
    value: "绑定",
}, ...__VLS_functionalComponentArgsRest(__VLS_277));
__VLS_279.slots.default;
var __VLS_279;
const __VLS_280 = {}.ElRadioButton;
/** @type {[typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, ]} */ ;
// @ts-ignore
const __VLS_281 = __VLS_asFunctionalComponent(__VLS_280, new __VLS_280({
    value: "密钥",
}));
const __VLS_282 = __VLS_281({
    value: "密钥",
}, ...__VLS_functionalComponentArgsRest(__VLS_281));
__VLS_283.slots.default;
var __VLS_283;
var __VLS_267;
const __VLS_284 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_285 = __VLS_asFunctionalComponent(__VLS_284, new __VLS_284({
    data: (__VLS_ctx.auditLogs),
    size: "small",
    stripe: true,
    ...{ class: "mt-12" },
}));
const __VLS_286 = __VLS_285({
    data: (__VLS_ctx.auditLogs),
    size: "small",
    stripe: true,
    ...{ class: "mt-12" },
}, ...__VLS_functionalComponentArgsRest(__VLS_285));
__VLS_287.slots.default;
const __VLS_288 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_289 = __VLS_asFunctionalComponent(__VLS_288, new __VLS_288({
    prop: "time",
    label: "时间",
    width: "150",
}));
const __VLS_290 = __VLS_289({
    prop: "time",
    label: "时间",
    width: "150",
}, ...__VLS_functionalComponentArgsRest(__VLS_289));
const __VLS_292 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_293 = __VLS_asFunctionalComponent(__VLS_292, new __VLS_292({
    prop: "operator",
    label: "操作人",
    width: "100",
}));
const __VLS_294 = __VLS_293({
    prop: "operator",
    label: "操作人",
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_293));
const __VLS_296 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_297 = __VLS_asFunctionalComponent(__VLS_296, new __VLS_296({
    prop: "type",
    label: "类型",
    width: "90",
}));
const __VLS_298 = __VLS_297({
    prop: "type",
    label: "类型",
    width: "90",
}, ...__VLS_functionalComponentArgsRest(__VLS_297));
__VLS_299.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_299.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_300 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_301 = __VLS_asFunctionalComponent(__VLS_300, new __VLS_300({
        size: "small",
        effect: "plain",
    }));
    const __VLS_302 = __VLS_301({
        size: "small",
        effect: "plain",
    }, ...__VLS_functionalComponentArgsRest(__VLS_301));
    __VLS_303.slots.default;
    (row.type);
    var __VLS_303;
}
var __VLS_299;
const __VLS_304 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_305 = __VLS_asFunctionalComponent(__VLS_304, new __VLS_304({
    prop: "content",
    label: "操作内容",
    minWidth: "260",
}));
const __VLS_306 = __VLS_305({
    prop: "content",
    label: "操作内容",
    minWidth: "260",
}, ...__VLS_functionalComponentArgsRest(__VLS_305));
const __VLS_308 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_309 = __VLS_asFunctionalComponent(__VLS_308, new __VLS_308({
    label: "结果",
    width: "80",
}));
const __VLS_310 = __VLS_309({
    label: "结果",
    width: "80",
}, ...__VLS_functionalComponentArgsRest(__VLS_309));
__VLS_311.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_311.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: (row.result === '成功' ? 'audit-success' : 'audit-fail') },
    });
    (row.result);
}
var __VLS_311;
var __VLS_287;
var __VLS_263;
var __VLS_7;
var __VLS_3;
const __VLS_312 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_313 = __VLS_asFunctionalComponent(__VLS_312, new __VLS_312({
    modelValue: (__VLS_ctx.createVisible),
    title: (`${__VLS_ctx.editingRule ? '编辑' : '新建'}脱敏规则`),
    width: "760px",
    destroyOnClose: true,
}));
const __VLS_314 = __VLS_313({
    modelValue: (__VLS_ctx.createVisible),
    title: (`${__VLS_ctx.editingRule ? '编辑' : '新建'}脱敏规则`),
    width: "760px",
    destroyOnClose: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_313));
__VLS_315.slots.default;
const __VLS_316 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_317 = __VLS_asFunctionalComponent(__VLS_316, new __VLS_316({
    model: (__VLS_ctx.ruleForm),
    labelWidth: "110px",
}));
const __VLS_318 = __VLS_317({
    model: (__VLS_ctx.ruleForm),
    labelWidth: "110px",
}, ...__VLS_functionalComponentArgsRest(__VLS_317));
__VLS_319.slots.default;
const __VLS_320 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
// @ts-ignore
const __VLS_321 = __VLS_asFunctionalComponent(__VLS_320, new __VLS_320({
    gutter: (12),
}));
const __VLS_322 = __VLS_321({
    gutter: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_321));
__VLS_323.slots.default;
const __VLS_324 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_325 = __VLS_asFunctionalComponent(__VLS_324, new __VLS_324({
    span: (12),
}));
const __VLS_326 = __VLS_325({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_325));
__VLS_327.slots.default;
const __VLS_328 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_329 = __VLS_asFunctionalComponent(__VLS_328, new __VLS_328({
    label: "规则名称",
}));
const __VLS_330 = __VLS_329({
    label: "规则名称",
}, ...__VLS_functionalComponentArgsRest(__VLS_329));
__VLS_331.slots.default;
const __VLS_332 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_333 = __VLS_asFunctionalComponent(__VLS_332, new __VLS_332({
    modelValue: (__VLS_ctx.ruleForm.name),
    placeholder: "如：客户手机号脱敏",
}));
const __VLS_334 = __VLS_333({
    modelValue: (__VLS_ctx.ruleForm.name),
    placeholder: "如：客户手机号脱敏",
}, ...__VLS_functionalComponentArgsRest(__VLS_333));
var __VLS_331;
var __VLS_327;
const __VLS_336 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_337 = __VLS_asFunctionalComponent(__VLS_336, new __VLS_336({
    span: (12),
}));
const __VLS_338 = __VLS_337({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_337));
__VLS_339.slots.default;
const __VLS_340 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_341 = __VLS_asFunctionalComponent(__VLS_340, new __VLS_340({
    label: "生效范围",
}));
const __VLS_342 = __VLS_341({
    label: "生效范围",
}, ...__VLS_functionalComponentArgsRest(__VLS_341));
__VLS_343.slots.default;
const __VLS_344 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_345 = __VLS_asFunctionalComponent(__VLS_344, new __VLS_344({
    modelValue: (__VLS_ctx.ruleForm.scope),
    ...{ class: "w-full" },
}));
const __VLS_346 = __VLS_345({
    modelValue: (__VLS_ctx.ruleForm.scope),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_345));
__VLS_347.slots.default;
const __VLS_348 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_349 = __VLS_asFunctionalComponent(__VLS_348, new __VLS_348({
    label: "全局生效",
    value: "全局生效",
}));
const __VLS_350 = __VLS_349({
    label: "全局生效",
    value: "全局生效",
}, ...__VLS_functionalComponentArgsRest(__VLS_349));
const __VLS_352 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_353 = __VLS_asFunctionalComponent(__VLS_352, new __VLS_352({
    label: "指定服务",
    value: "指定服务",
}));
const __VLS_354 = __VLS_353({
    label: "指定服务",
    value: "指定服务",
}, ...__VLS_functionalComponentArgsRest(__VLS_353));
const __VLS_356 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_357 = __VLS_asFunctionalComponent(__VLS_356, new __VLS_356({
    label: "指定应用",
    value: "指定应用",
}));
const __VLS_358 = __VLS_357({
    label: "指定应用",
    value: "指定应用",
}, ...__VLS_functionalComponentArgsRest(__VLS_357));
var __VLS_347;
var __VLS_343;
var __VLS_339;
var __VLS_323;
const __VLS_360 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_361 = __VLS_asFunctionalComponent(__VLS_360, new __VLS_360({
    label: "脱敏算法",
}));
const __VLS_362 = __VLS_361({
    label: "脱敏算法",
}, ...__VLS_functionalComponentArgsRest(__VLS_361));
__VLS_363.slots.default;
const __VLS_364 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_365 = __VLS_asFunctionalComponent(__VLS_364, new __VLS_364({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.ruleForm.algo),
    ...{ class: "w-full" },
}));
const __VLS_366 = __VLS_365({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.ruleForm.algo),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_365));
let __VLS_368;
let __VLS_369;
let __VLS_370;
const __VLS_371 = {
    onChange: (__VLS_ctx.onAlgoChange)
};
__VLS_367.slots.default;
for (const [a] of __VLS_getVForSourceType((__VLS_ctx.algorithms))) {
    const __VLS_372 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_373 = __VLS_asFunctionalComponent(__VLS_372, new __VLS_372({
        key: (a.key),
        label: (`${a.name}（${a.desc}）`),
        value: (a.key),
    }));
    const __VLS_374 = __VLS_373({
        key: (a.key),
        label: (`${a.name}（${a.desc}）`),
        value: (a.key),
    }, ...__VLS_functionalComponentArgsRest(__VLS_373));
}
var __VLS_367;
var __VLS_363;
if (__VLS_ctx.currentAlgo) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "algo-panel" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "algo-desc" },
    });
    (__VLS_ctx.currentAlgo.desc);
    (__VLS_ctx.currentAlgo.sample);
    (__VLS_ctx.currentAlgo.output);
    if (__VLS_ctx.algoParamsVisible) {
        const __VLS_376 = {}.ElRow;
        /** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
        // @ts-ignore
        const __VLS_377 = __VLS_asFunctionalComponent(__VLS_376, new __VLS_376({
            gutter: (12),
        }));
        const __VLS_378 = __VLS_377({
            gutter: (12),
        }, ...__VLS_functionalComponentArgsRest(__VLS_377));
        __VLS_379.slots.default;
        const __VLS_380 = {}.ElCol;
        /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
        // @ts-ignore
        const __VLS_381 = __VLS_asFunctionalComponent(__VLS_380, new __VLS_380({
            span: (12),
        }));
        const __VLS_382 = __VLS_381({
            span: (12),
        }, ...__VLS_functionalComponentArgsRest(__VLS_381));
        __VLS_383.slots.default;
        const __VLS_384 = {}.ElFormItem;
        /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
        // @ts-ignore
        const __VLS_385 = __VLS_asFunctionalComponent(__VLS_384, new __VLS_384({
            label: "保留位数",
        }));
        const __VLS_386 = __VLS_385({
            label: "保留位数",
        }, ...__VLS_functionalComponentArgsRest(__VLS_385));
        __VLS_387.slots.default;
        const __VLS_388 = {}.ElInputNumber;
        /** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
        // @ts-ignore
        const __VLS_389 = __VLS_asFunctionalComponent(__VLS_388, new __VLS_388({
            modelValue: (__VLS_ctx.ruleForm.keep),
            min: (0),
            max: (32),
        }));
        const __VLS_390 = __VLS_389({
            modelValue: (__VLS_ctx.ruleForm.keep),
            min: (0),
            max: (32),
        }, ...__VLS_functionalComponentArgsRest(__VLS_389));
        var __VLS_387;
        var __VLS_383;
        const __VLS_392 = {}.ElCol;
        /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
        // @ts-ignore
        const __VLS_393 = __VLS_asFunctionalComponent(__VLS_392, new __VLS_392({
            span: (12),
        }));
        const __VLS_394 = __VLS_393({
            span: (12),
        }, ...__VLS_functionalComponentArgsRest(__VLS_393));
        __VLS_395.slots.default;
        const __VLS_396 = {}.ElFormItem;
        /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
        // @ts-ignore
        const __VLS_397 = __VLS_asFunctionalComponent(__VLS_396, new __VLS_396({
            label: "盐值 / 策略",
        }));
        const __VLS_398 = __VLS_397({
            label: "盐值 / 策略",
        }, ...__VLS_functionalComponentArgsRest(__VLS_397));
        __VLS_399.slots.default;
        const __VLS_400 = {}.ElInput;
        /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
        // @ts-ignore
        const __VLS_401 = __VLS_asFunctionalComponent(__VLS_400, new __VLS_400({
            modelValue: (__VLS_ctx.ruleForm.salt),
            placeholder: "可选",
        }));
        const __VLS_402 = __VLS_401({
            modelValue: (__VLS_ctx.ruleForm.salt),
            placeholder: "可选",
        }, ...__VLS_functionalComponentArgsRest(__VLS_401));
        var __VLS_399;
        var __VLS_395;
        var __VLS_379;
    }
}
const __VLS_404 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_405 = __VLS_asFunctionalComponent(__VLS_404, new __VLS_404({
    label: "试算预览",
}));
const __VLS_406 = __VLS_405({
    label: "试算预览",
}, ...__VLS_functionalComponentArgsRest(__VLS_405));
__VLS_407.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "try-row" },
});
const __VLS_408 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_409 = __VLS_asFunctionalComponent(__VLS_408, new __VLS_408({
    modelValue: (__VLS_ctx.tryValue),
    placeholder: "输入测试值，如 13812345678 / 张三 / 2026-08-13",
    ...{ class: "try-input" },
}));
const __VLS_410 = __VLS_409({
    modelValue: (__VLS_ctx.tryValue),
    placeholder: "输入测试值，如 13812345678 / 张三 / 2026-08-13",
    ...{ class: "try-input" },
}, ...__VLS_functionalComponentArgsRest(__VLS_409));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "try-arrow" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.code, __VLS_intrinsicElements.code)({
    ...{ class: "try-output" },
});
(__VLS_ctx.tryResult);
var __VLS_407;
var __VLS_319;
{
    const { footer: __VLS_thisSlot } = __VLS_315.slots;
    const __VLS_412 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_413 = __VLS_asFunctionalComponent(__VLS_412, new __VLS_412({
        ...{ 'onClick': {} },
    }));
    const __VLS_414 = __VLS_413({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_413));
    let __VLS_416;
    let __VLS_417;
    let __VLS_418;
    const __VLS_419 = {
        onClick: (...[$event]) => {
            __VLS_ctx.createVisible = false;
        }
    };
    __VLS_415.slots.default;
    var __VLS_415;
    const __VLS_420 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_421 = __VLS_asFunctionalComponent(__VLS_420, new __VLS_420({
        ...{ 'onClick': {} },
    }));
    const __VLS_422 = __VLS_421({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_421));
    let __VLS_424;
    let __VLS_425;
    let __VLS_426;
    const __VLS_427 = {
        onClick: (...[$event]) => {
            __VLS_ctx.saveRule(false);
        }
    };
    __VLS_423.slots.default;
    var __VLS_423;
    const __VLS_428 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_429 = __VLS_asFunctionalComponent(__VLS_428, new __VLS_428({
        ...{ 'onClick': {} },
        type: "danger",
    }));
    const __VLS_430 = __VLS_429({
        ...{ 'onClick': {} },
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_429));
    let __VLS_432;
    let __VLS_433;
    let __VLS_434;
    const __VLS_435 = {
        onClick: (...[$event]) => {
            __VLS_ctx.saveRule(true);
        }
    };
    __VLS_431.slots.default;
    var __VLS_431;
}
var __VLS_315;
const __VLS_436 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_437 = __VLS_asFunctionalComponent(__VLS_436, new __VLS_436({
    modelValue: (__VLS_ctx.batchVisible),
    title: "批量绑定脱敏规则",
    width: "420px",
}));
const __VLS_438 = __VLS_437({
    modelValue: (__VLS_ctx.batchVisible),
    title: "批量绑定脱敏规则",
    width: "420px",
}, ...__VLS_functionalComponentArgsRest(__VLS_437));
__VLS_439.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "batch-info" },
});
(__VLS_ctx.selection.length);
const __VLS_440 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_441 = __VLS_asFunctionalComponent(__VLS_440, new __VLS_440({
    modelValue: (__VLS_ctx.batchRule),
    placeholder: "选择生效规则",
    ...{ class: "w-full mt-12" },
}));
const __VLS_442 = __VLS_441({
    modelValue: (__VLS_ctx.batchRule),
    placeholder: "选择生效规则",
    ...{ class: "w-full mt-12" },
}, ...__VLS_functionalComponentArgsRest(__VLS_441));
__VLS_443.slots.default;
for (const [r] of __VLS_getVForSourceType((__VLS_ctx.rules))) {
    const __VLS_444 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_445 = __VLS_asFunctionalComponent(__VLS_444, new __VLS_444({
        key: (r.name),
        label: (`${r.name}（${__VLS_ctx.algoName(r.algo)}）`),
        value: (r.name),
    }));
    const __VLS_446 = __VLS_445({
        key: (r.name),
        label: (`${r.name}（${__VLS_ctx.algoName(r.algo)}）`),
        value: (r.name),
    }, ...__VLS_functionalComponentArgsRest(__VLS_445));
}
var __VLS_443;
{
    const { footer: __VLS_thisSlot } = __VLS_439.slots;
    const __VLS_448 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_449 = __VLS_asFunctionalComponent(__VLS_448, new __VLS_448({
        ...{ 'onClick': {} },
    }));
    const __VLS_450 = __VLS_449({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_449));
    let __VLS_452;
    let __VLS_453;
    let __VLS_454;
    const __VLS_455 = {
        onClick: (...[$event]) => {
            __VLS_ctx.batchVisible = false;
        }
    };
    __VLS_451.slots.default;
    var __VLS_451;
    const __VLS_456 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_457 = __VLS_asFunctionalComponent(__VLS_456, new __VLS_456({
        ...{ 'onClick': {} },
        type: "danger",
        disabled: (!__VLS_ctx.batchRule),
    }));
    const __VLS_458 = __VLS_457({
        ...{ 'onClick': {} },
        type: "danger",
        disabled: (!__VLS_ctx.batchRule),
    }, ...__VLS_functionalComponentArgsRest(__VLS_457));
    let __VLS_460;
    let __VLS_461;
    let __VLS_462;
    const __VLS_463 = {
        onClick: (__VLS_ctx.saveBatchBind)
    };
    __VLS_459.slots.default;
    var __VLS_459;
}
var __VLS_439;
/** @type {__VLS_StyleScopedClasses['standard-page']} */ ;
/** @type {__VLS_StyleScopedClasses['masking-page']} */ ;
/** @type {__VLS_StyleScopedClasses['mask-stats']} */ ;
/** @type {__VLS_StyleScopedClasses['mask-stat']} */ ;
/** @type {__VLS_StyleScopedClasses['mask-stat-value']} */ ;
/** @type {__VLS_StyleScopedClasses['mask-stat-label']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['mask-tabs']} */ ;
/** @type {__VLS_StyleScopedClasses['toolbar-row']} */ ;
/** @type {__VLS_StyleScopedClasses['search-input']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-select']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-select']} */ ;
/** @type {__VLS_StyleScopedClasses['dep-text']} */ ;
/** @type {__VLS_StyleScopedClasses['toolbar-right']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-12']} */ ;
/** @type {__VLS_StyleScopedClasses['dep-text']} */ ;
/** @type {__VLS_StyleScopedClasses['toolbar-row']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-select-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-select']} */ ;
/** @type {__VLS_StyleScopedClasses['toolbar-right']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-12']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
/** @type {__VLS_StyleScopedClasses['security-level']} */ ;
/** @type {__VLS_StyleScopedClasses['toolbar-row']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-12']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['algo-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['algo-desc']} */ ;
/** @type {__VLS_StyleScopedClasses['try-row']} */ ;
/** @type {__VLS_StyleScopedClasses['try-input']} */ ;
/** @type {__VLS_StyleScopedClasses['try-arrow']} */ ;
/** @type {__VLS_StyleScopedClasses['try-output']} */ ;
/** @type {__VLS_StyleScopedClasses['batch-info']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-12']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Link: Link,
            Plus: Plus,
            Search: Search,
            activeTab: activeTab,
            statsCards: statsCards,
            algorithms: algorithms,
            algoName: algoName,
            statusTag: statusTag,
            rules: rules,
            ruleKeyword: ruleKeyword,
            ruleAlgo: ruleAlgo,
            ruleStatus: ruleStatus,
            filteredRules: filteredRules,
            createVisible: createVisible,
            editingRule: editingRule,
            ruleForm: ruleForm,
            tryValue: tryValue,
            currentAlgo: currentAlgo,
            algoParamsVisible: algoParamsVisible,
            tryResult: tryResult,
            onAlgoChange: onAlgoChange,
            openCreate: openCreate,
            editRule: editRule,
            saveRule: saveRule,
            testRule: testRule,
            toggleRule: toggleRule,
            bindClass: bindClass,
            bindStatus: bindStatus,
            selection: selection,
            onSelectionChange: onSelectionChange,
            filteredFields: filteredFields,
            batchVisible: batchVisible,
            batchRule: batchRule,
            openBatchBind: openBatchBind,
            saveBatchBind: saveBatchBind,
            bindBatch: bindBatch,
            unmaskedFields: unmaskedFields,
            quickBind: quickBind,
            viewField: viewField,
            auditType: auditType,
            auditLogs: auditLogs,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
