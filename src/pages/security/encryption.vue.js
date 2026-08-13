import { computed, nextTick, reactive, ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { CircleCheck, Key, Plus as Plus1, Right, Search } from '@element-plus/icons-vue';
import { mockMaskingRules } from '@/mock/security';
const activeTab = ref('encrypt');
/* ========== 加密：传输加密配置 ========== */
const transport = reactive({
    httpsForce: true,
    tlsVersion: 'TLS 1.3',
    cipherSuite: 'TLS_AES_256_GCM_SHA384',
    hsts: true,
    hstsMaxAge: '2592000',
});
const channels = [
    { name: 'Web 前端 / 443', protocol: 'TLS 1.3 · HTTPS', encrypted: true },
    { name: '文件交换通道 / 22', protocol: 'AES-256-GCM · SFTP', encrypted: true },
    { name: '数据比对接口 / 8443', protocol: 'TLS 1.2 · 双向认证', encrypted: true },
    { name: '内部消息队列 / 9092', protocol: '明文传输', encrypted: false },
];
const certificates = ref([
    { name: 'api.datahub.cn', purpose: 'API 网关', issuer: 'CFCA 国密证书', expire: '2027-05-20', status: '有效', statusType: 'success' },
    { name: '*.datahub.com', purpose: 'Web 前端', issuer: 'DigiCert', expire: '2026-09-11', status: '即将过期', statusType: 'warning' },
    { name: 'sftp.datahub.cn', purpose: 'SFTP 通道', issuer: 'CFCA 国密证书', expire: '2028-01-08', status: '有效', statusType: 'success' },
    { name: 'es.datahub.com', purpose: '数据交换', issuer: '自行签发', expire: '2026-03-02', status: '已过期', statusType: 'danger' },
]);
/* ========== 加密：密钥生命周期配置 ========== */
const lifePolicy = reactive({
    autoRotate: true,
    rotateCycle: '90',
    warnAhead: 15,
    expireAction: '保留只读',
    approveBeforeDisable: true,
});
const keys = ref([
    { name: '数据加密主密钥', algorithm: 'SM4', usage: '存储加密', rotateCycle: '180 天', createdAt: '2026-01-15', expireAt: '2026-07-14', status: '正常', statusType: 'success' },
    { name: '传输会话密钥', algorithm: 'AES-256', usage: '传输会话', rotateCycle: '1 天', createdAt: '2026-06-01', expireAt: '2026-06-02', status: '正常', statusType: 'success' },
    { name: '脱敏 HMAC 密钥', algorithm: 'HMAC-SHA256', usage: '脱敏签名', rotateCycle: '30 天', createdAt: '2026-03-10', expireAt: '2026-06-10', status: '即将轮换', statusType: 'warning' },
    { name: '历史支付密钥（弃用）', algorithm: 'AES-256', usage: '历史数据解密', rotateCycle: '—', createdAt: '2024-11-20', expireAt: '2026-05-01', status: '已过期', statusType: 'danger' },
]);
const encryptStats = computed(() => [
    { label: 'HTTPS 强制', value: transport.httpsForce ? '已启用' : '未启用', color: transport.httpsForce ? '#00A854' : '#ED7B2F' },
    { label: '最低 TLS 版本', value: transport.tlsVersion, color: '#2B6CB0' },
    { label: '在管证书', value: `${certificates.value.length} 张`, color: '#2B6CB0' },
    { label: '待轮换密钥', value: `${keys.value.filter((k) => k.status === '即将轮换' || k.status === '已过期').length} 把`, color: '#ED7B2F' },
    { label: '密钥总数', value: `${keys.value.length} 把`, color: '#4A4A4A' },
]);
const runSecurityCheck = () => ElMessage.success('安全巡检完成：发现 1 个明文通道、1 张过期证书（Mock）');
const manageCert = () => ElMessage.info('打开证书管理（Mock）');
const renewCert = (row) => ElMessage.success(`证书「${row.name}」续期申请已提交（Mock）`);
const certDetail = (row) => ElMessage.info(`证书「${row.name}」：颁发机构 ${row.issuer}，有效期至 ${row.expire}（Mock）`);
const enableChannel = (c) => ElMessage.warning(`通道「${c.name}」整改任务已下发，升级为 TLS 1.2+（Mock）`);
const rotateKey = (row) => ElMessage.success(`密钥「${row.name}」轮换已触发，新密钥 24 小时内生效（Mock）`);
const destroyKey = (row) => ElMessage.warning(`密钥「${row.name}」销毁已生成审批单，待审批后执行（Mock）`);
const keyDrawerVisible = ref(false);
const keyForm = reactive({
    name: '',
    algorithm: 'SM4',
    usage: '存储加密',
    rotateCycle: '90 天',
    expireAt: '',
    desc: '',
});
const openKeyDrawer = () => {
    Object.assign(keyForm, { name: '', algorithm: 'SM4', usage: '存储加密', rotateCycle: '90 天', expireAt: '', desc: '' });
    keyDrawerVisible.value = true;
};
const saveKey = () => {
    if (!keyForm.name.trim()) {
        ElMessage.warning('请输入密钥名称');
        return;
    }
    keys.value.unshift({
        name: keyForm.name,
        algorithm: keyForm.algorithm,
        usage: keyForm.usage,
        rotateCycle: keyForm.rotateCycle,
        createdAt: new Date().toLocaleDateString('sv-SE'),
        expireAt: keyForm.expireAt || '—',
        status: '正常',
        statusType: 'success',
    });
    keyDrawerVisible.value = false;
    ElMessage.success(`密钥「${keyForm.name}」创建成功（Mock）`);
};
/* ========== 脱敏：规则配置列表 ========== */
const keyword = ref('');
const filterMethod = ref('');
const filterStatus = ref('');
const currentPage = ref(1);
const pageSize = 20;
const editorVisible = ref(false);
const editing = ref(false);
const formRef = ref();
const rules = ref([...mockMaskingRules]);
const tablePool = ['passenger_info', 'ticket_sale_detail'];
const fieldPool = [
    'passenger_info.cust_name',
    'passenger_info.phone',
    'passenger_info.id_card',
    'passenger_info.address',
    'passenger_info.email',
    'ticket_sale_detail.ticket_no',
    'ticket_sale_detail.amount',
    'ticket_sale_detail.passenger_name',
];
const rolePool = ['运营客服', '数据开发', '统计分析', '安全管理', '外部监管'];
const fieldsOfTable = computed(() => fieldPool.filter((f) => f.startsWith(`${form.table}.`)));
const methodTagType = {
    替换: 'primary',
    掩码: 'warning',
    哈希: 'info',
};
const ruleStatusTag = {
    已上线: 'success',
    审批中: 'warning',
    草稿: 'info',
};
const previewSample = '13804213190';
const previewText = computed(() => {
    const f = form;
    if (f.method === '掩码') {
        const head = f.mask.headKeep;
        const tail = f.mask.tailKeep;
        const maskLen = Math.max(0, previewSample.length - head - tail);
        return previewSample.slice(0, head) + f.mask.maskChar.repeat(Math.min(maskLen, 10)) + previewSample.slice(-tail);
    }
    if (f.method === '替换') {
        const ratio = Math.max(1, Math.round((previewSample.length * f.replace.ratio) / 100));
        const base = f.replace.replaceChar.repeat(ratio);
        return f.replace.keepLength ? base.padEnd(previewSample.length, f.replace.replaceChar) : base;
    }
    const algo = f.hash.algorithm;
    if (algo === 'MD5')
        return 'md5:9b8f7e6d5c4b3a21';
    if (algo === 'SM3')
        return 'sm3:a1b2c3d4e5f6a7b8';
    return 'sha256:e3a5f2d8c9b4f1a7';
});
const form = reactive({
    id: '',
    version: 'V1.0',
    name: '',
    description: '',
    table: 'passenger_info',
    field: 'passenger_info.phone',
    method: '掩码',
    preserveFormat: true,
    scope: '查询实时脱敏',
    applyAllRoles: true,
    roles: [],
    priority: 50,
    immediate: true,
    effectiveDate: '',
    remark: '',
    committed: '草稿',
    mask: { headKeep: 3, tailKeep: 4, maskChar: '*' },
    replace: { replaceChar: '*', ratio: 80, keepLength: true },
    hash: { algorithm: 'SHA-256', salt: true },
});
const filteredRules = computed(() => rules.value.filter((rule) => {
    if (filterMethod.value && rule.method !== filterMethod.value)
        return false;
    if (filterStatus.value && rule.status !== filterStatus.value)
        return false;
    if (!keyword.value)
        return true;
    const kw = keyword.value.toLowerCase();
    return rule.name.toLowerCase().includes(kw) || rule.field.toLowerCase().includes(kw);
}));
const pagedRules = computed(() => {
    const start = (currentPage.value - 1) * pageSize;
    return filteredRules.value.slice(start, start + pageSize);
});
const changePage = (page) => (currentPage.value = page);
watch([keyword, filterMethod, filterStatus], () => {
    currentPage.value = 1;
});
const formRules = {
    name: [{ required: true, message: '请输入规则名称', trigger: 'blur' }],
    field: [{ required: true, message: '请选择目标字段', trigger: 'change' }],
    scope: [{ required: true, message: '请选择脱敏场景', trigger: 'change' }],
    roles: [{ type: 'array', required: true, min: 1, message: '请至少指定一个角色', trigger: 'change' }],
    effectiveDate: [{ required: true, message: '请选择生效日期', trigger: 'change' }],
};
const resetForm = () => {
    Object.assign(form, {
        id: '',
        version: 'V1.0',
        name: '',
        description: '',
        table: 'passenger_info',
        field: fieldsOfTable.value[0] || 'passenger_info.phone',
        method: '掩码',
        preserveFormat: true,
        scope: ['查询实时脱敏'],
        applyAllRoles: true,
        roles: [],
        priority: 50,
        immediate: true,
        effectiveDate: '',
        remark: '',
        committed: '草稿',
        mask: { headKeep: 3, tailKeep: 4, maskChar: '*' },
        replace: { replaceChar: '*', ratio: 80, keepLength: true },
        hash: { algorithm: 'SHA-256', salt: true },
    });
};
const openCreate = () => {
    editing.value = false;
    resetForm();
    editorVisible.value = true;
    nextTick(() => formRef.value?.clearValidate());
};
const openEdit = (row) => {
    editing.value = true;
    const table = row.field.split('.')[0] || 'passenger_info';
    Object.assign(form, {
        id: row.id,
        version: row.version,
        name: row.name,
        description: row.description ?? '',
        table,
        field: row.field,
        method: row.method,
        preserveFormat: row.preserveFormat,
        scope: row.scope.split('、')[0],
        applyAllRoles: !row.roles || row.roles.includes('全部角色'),
        roles: row.roles && !row.roles.includes('全部角色') ? row.roles : [],
        priority: row.priority ?? 50,
        immediate: !row.effectiveDate || row.effectiveDate === '立即生效',
        effectiveDate: row.effectiveDate && row.effectiveDate !== '立即生效' ? row.effectiveDate : '',
        remark: '',
        committed: row.status,
        mask: {
            headKeep: row.maskParams?.headKeep ?? 3,
            tailKeep: row.maskParams?.tailKeep ?? 4,
            maskChar: row.maskParams?.maskChar ?? '*',
        },
        replace: {
            replaceChar: row.replaceParams?.replaceChar ?? '*',
            ratio: row.replaceParams?.ratio ?? 80,
            keepLength: true,
        },
        hash: {
            algorithm: row.hashParams?.algorithm ?? 'SHA-256',
            salt: row.hashParams?.salt ?? true,
        },
    });
    editorVisible.value = true;
    nextTick(() => formRef.value?.clearValidate());
};
const buildPayload = (status) => ({
    id: editing.value ? form.id : `msk-mock-${Date.now()}`,
    name: form.name,
    field: form.field,
    method: form.method,
    preserveFormat: form.preserveFormat,
    sampleBefore: previewSample,
    sampleAfter: previewText.value,
    scope: form.scope,
    status,
    version: editing.value ? form.version : 'V1.0',
    updateTime: new Date().toLocaleString('sv-SE').replace('T', ' '),
    description: form.description.trim() || undefined,
    priority: form.priority,
    roles: form.applyAllRoles ? ['全部角色'] : form.roles,
    effectiveDate: form.immediate ? '立即生效' : form.effectiveDate,
    maskParams: { headKeep: form.mask.headKeep, tailKeep: form.mask.tailKeep, maskChar: form.mask.maskChar },
    replaceParams: { replaceChar: form.replace.replaceChar, ratio: form.replace.ratio },
    hashParams: { algorithm: form.hash.algorithm, salt: form.hash.salt },
});
const submitMaskingForm = async () => {
    const valid = await formRef.value?.validate().catch(() => false);
    if (!valid)
        return;
    // 编辑保存时保留原状态，新增提交进入审批
    const status = editing.value ? form.committed ?? '草稿' : '审批中';
    const payload = buildPayload(status);
    if (editing.value) {
        const idx = rules.value.findIndex((r) => r.id === form.id);
        if (idx >= 0)
            rules.value[idx] = payload;
        ElMessage.success(`脱敏规则「${form.name}」已保存并进入审批（Mock）`);
    }
    else {
        rules.value.unshift(payload);
        ElMessage.success('脱敏规则已提交审批（Mock）');
    }
    editorVisible.value = false;
};
const saveAsDraft = async () => {
    const valid = await formRef.value?.validate().catch(() => false);
    if (!valid)
        return;
    const payload = buildPayload('草稿');
    if (editing.value) {
        const idx = rules.value.findIndex((r) => r.id === form.id);
        if (idx >= 0)
            rules.value[idx] = payload;
    }
    else {
        rules.value.unshift(payload);
    }
    ElMessage.success(`脱敏规则「${form.name}」已保存为草稿（Mock）`);
    editorVisible.value = false;
};
const versionHistory = (row) => {
    ElMessage.info(`「${row.name}」版本历史：${row.version} → V${Number(row.version.slice(1)) + 1}.0（Mock）`);
};
const onlineRule = (row) => {
    row.status = row.status === '已上线' ? '草稿' : '已上线';
    ElMessage.success(`规则「${row.name}」已${row.status === '已上线' ? '上线' : '下线'}（Mock）`);
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['mask-pane']} */ ;
/** @type {__VLS_StyleScopedClasses['el-table']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "standard-page encrypt-page" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "encrypt-tabs-wrap" },
});
const __VLS_0 = {}.ElTabs;
/** @type {[typeof __VLS_components.ElTabs, typeof __VLS_components.elTabs, typeof __VLS_components.ElTabs, typeof __VLS_components.elTabs, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    modelValue: (__VLS_ctx.activeTab),
    type: "border-card",
    stretch: true,
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.activeTab),
    type: "border-card",
    stretch: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
const __VLS_4 = {}.ElTabPane;
/** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    label: "加密",
    name: "encrypt",
}));
const __VLS_6 = __VLS_5({
    label: "加密",
    name: "encrypt",
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
__VLS_7.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "encrypt-pane" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "encrypt-stats" },
});
for (const [s] of __VLS_getVForSourceType((__VLS_ctx.encryptStats))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (s.label),
        ...{ class: "encrypt-stat" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "encrypt-stat-value" },
        ...{ style: ({ color: s.color }) },
    });
    (s.value);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "encrypt-stat-label" },
    });
    (s.label);
}
const __VLS_8 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    gutter: (16),
    ...{ class: "encrypt-rows" },
}));
const __VLS_10 = __VLS_9({
    gutter: (16),
    ...{ class: "encrypt-rows" },
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
__VLS_11.slots.default;
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
    ...{ class: "encrypt-card" },
    shadow: "never",
}));
const __VLS_18 = __VLS_17({
    ...{ class: "encrypt-card" },
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
    const __VLS_20 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
        ...{ 'onClick': {} },
        size: "small",
        icon: (__VLS_ctx.CircleCheck),
        type: "success",
        plain: true,
    }));
    const __VLS_22 = __VLS_21({
        ...{ 'onClick': {} },
        size: "small",
        icon: (__VLS_ctx.CircleCheck),
        type: "success",
        plain: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_21));
    let __VLS_24;
    let __VLS_25;
    let __VLS_26;
    const __VLS_27 = {
        onClick: (__VLS_ctx.runSecurityCheck)
    };
    __VLS_23.slots.default;
    var __VLS_23;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "transport-form" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "tf-item" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "tf-label" },
});
const __VLS_28 = {}.ElSwitch;
/** @type {[typeof __VLS_components.ElSwitch, typeof __VLS_components.elSwitch, ]} */ ;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
    modelValue: (__VLS_ctx.transport.httpsForce),
}));
const __VLS_30 = __VLS_29({
    modelValue: (__VLS_ctx.transport.httpsForce),
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "tf-tip" },
});
(__VLS_ctx.transport.httpsForce ? '外部请求仅允许 HTTPS' : '仅推荐，未强制');
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "tf-item" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "tf-label" },
});
const __VLS_32 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
    modelValue: (__VLS_ctx.transport.tlsVersion),
    size: "small",
    ...{ class: "tf-select" },
}));
const __VLS_34 = __VLS_33({
    modelValue: (__VLS_ctx.transport.tlsVersion),
    size: "small",
    ...{ class: "tf-select" },
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
__VLS_35.slots.default;
const __VLS_36 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    label: "TLS 1.3",
    value: "TLS 1.3",
}));
const __VLS_38 = __VLS_37({
    label: "TLS 1.3",
    value: "TLS 1.3",
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
const __VLS_40 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
    label: "TLS 1.2",
    value: "TLS 1.2",
}));
const __VLS_42 = __VLS_41({
    label: "TLS 1.2",
    value: "TLS 1.2",
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
var __VLS_35;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "tf-tip" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "tf-item" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "tf-label" },
});
const __VLS_44 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    modelValue: (__VLS_ctx.transport.cipherSuite),
    size: "small",
    ...{ class: "tf-select" },
    filterable: true,
}));
const __VLS_46 = __VLS_45({
    modelValue: (__VLS_ctx.transport.cipherSuite),
    size: "small",
    ...{ class: "tf-select" },
    filterable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
__VLS_47.slots.default;
const __VLS_48 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
    label: "TLS_AES_256_GCM_SHA384（推荐）",
    value: "TLS_AES_256_GCM_SHA384",
}));
const __VLS_50 = __VLS_49({
    label: "TLS_AES_256_GCM_SHA384（推荐）",
    value: "TLS_AES_256_GCM_SHA384",
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
const __VLS_52 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
    label: "TLS_CHACHA20_POLY1305_SHA256",
    value: "TLS_CHACHA20_POLY1305_SHA256",
}));
const __VLS_54 = __VLS_53({
    label: "TLS_CHACHA20_POLY1305_SHA256",
    value: "TLS_CHACHA20_POLY1305_SHA256",
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
const __VLS_56 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
    label: "ECDHE-ECDSA-AES128-GCM-SHA256",
    value: "ECDHE-ECDSA-AES128-GCM-SHA256",
}));
const __VLS_58 = __VLS_57({
    label: "ECDHE-ECDSA-AES128-GCM-SHA256",
    value: "ECDHE-ECDSA-AES128-GCM-SHA256",
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
var __VLS_47;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "tf-item" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "tf-label" },
});
const __VLS_60 = {}.ElSwitch;
/** @type {[typeof __VLS_components.ElSwitch, typeof __VLS_components.elSwitch, ]} */ ;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
    modelValue: (__VLS_ctx.transport.hsts),
}));
const __VLS_62 = __VLS_61({
    modelValue: (__VLS_ctx.transport.hsts),
}, ...__VLS_functionalComponentArgsRest(__VLS_61));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "tf-tip" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "tf-item" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "tf-label" },
});
const __VLS_64 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
    modelValue: (__VLS_ctx.transport.hstsMaxAge),
    size: "small",
    ...{ class: "tf-select" },
    disabled: (!__VLS_ctx.transport.hsts),
}));
const __VLS_66 = __VLS_65({
    modelValue: (__VLS_ctx.transport.hstsMaxAge),
    size: "small",
    ...{ class: "tf-select" },
    disabled: (!__VLS_ctx.transport.hsts),
}, ...__VLS_functionalComponentArgsRest(__VLS_65));
__VLS_67.slots.default;
const __VLS_68 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
    label: "1 周（604800）",
    value: "604800",
}));
const __VLS_70 = __VLS_69({
    label: "1 周（604800）",
    value: "604800",
}, ...__VLS_functionalComponentArgsRest(__VLS_69));
const __VLS_72 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
    label: "1 个月（2592000）",
    value: "2592000",
}));
const __VLS_74 = __VLS_73({
    label: "1 个月（2592000）",
    value: "2592000",
}, ...__VLS_functionalComponentArgsRest(__VLS_73));
const __VLS_76 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
    label: "6 个月（15768000）",
    value: "15768000",
}));
const __VLS_78 = __VLS_77({
    label: "6 个月（15768000）",
    value: "15768000",
}, ...__VLS_functionalComponentArgsRest(__VLS_77));
var __VLS_67;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "tf-item" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "tf-label" },
});
const __VLS_80 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
    ...{ 'onClick': {} },
    size: "small",
}));
const __VLS_82 = __VLS_81({
    ...{ 'onClick': {} },
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_81));
let __VLS_84;
let __VLS_85;
let __VLS_86;
const __VLS_87 = {
    onClick: (__VLS_ctx.manageCert)
};
__VLS_83.slots.default;
var __VLS_83;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "tf-tip" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "block-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "channel-list" },
});
for (const [c] of __VLS_getVForSourceType((__VLS_ctx.channels))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (c.name),
        ...{ class: "channel-item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "channel-name" },
    });
    (c.name);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "channel-protocol" },
    });
    (c.protocol);
    const __VLS_88 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
        size: "small",
        type: (c.encrypted ? 'success' : 'danger'),
        effect: "dark",
    }));
    const __VLS_90 = __VLS_89({
        size: "small",
        type: (c.encrypted ? 'success' : 'danger'),
        effect: "dark",
    }, ...__VLS_functionalComponentArgsRest(__VLS_89));
    __VLS_91.slots.default;
    (c.encrypted ? '已加密' : '明文');
    var __VLS_91;
    if (!c.encrypted) {
        const __VLS_92 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
            ...{ 'onClick': {} },
            size: "small",
            link: true,
            type: "danger",
        }));
        const __VLS_94 = __VLS_93({
            ...{ 'onClick': {} },
            size: "small",
            link: true,
            type: "danger",
        }, ...__VLS_functionalComponentArgsRest(__VLS_93));
        let __VLS_96;
        let __VLS_97;
        let __VLS_98;
        const __VLS_99 = {
            onClick: (...[$event]) => {
                if (!(!c.encrypted))
                    return;
                __VLS_ctx.enableChannel(c);
            }
        };
        __VLS_95.slots.default;
        var __VLS_95;
    }
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "block-title" },
});
(__VLS_ctx.certificates.length);
const __VLS_100 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
    data: (__VLS_ctx.certificates),
    size: "small",
    stripe: true,
}));
const __VLS_102 = __VLS_101({
    data: (__VLS_ctx.certificates),
    size: "small",
    stripe: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_101));
__VLS_103.slots.default;
const __VLS_104 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
    prop: "name",
    label: "证书 / 域名",
    minWidth: "160",
}));
const __VLS_106 = __VLS_105({
    prop: "name",
    label: "证书 / 域名",
    minWidth: "160",
}, ...__VLS_functionalComponentArgsRest(__VLS_105));
const __VLS_108 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
    prop: "purpose",
    label: "用途",
    width: "96",
}));
const __VLS_110 = __VLS_109({
    prop: "purpose",
    label: "用途",
    width: "96",
}, ...__VLS_functionalComponentArgsRest(__VLS_109));
const __VLS_112 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
    prop: "issuer",
    label: "颁发机构",
    width: "140",
}));
const __VLS_114 = __VLS_113({
    prop: "issuer",
    label: "颁发机构",
    width: "140",
}, ...__VLS_functionalComponentArgsRest(__VLS_113));
const __VLS_116 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
    prop: "expire",
    label: "有效期至",
    width: "100",
}));
const __VLS_118 = __VLS_117({
    prop: "expire",
    label: "有效期至",
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_117));
const __VLS_120 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({
    label: "状态",
    width: "84",
}));
const __VLS_122 = __VLS_121({
    label: "状态",
    width: "84",
}, ...__VLS_functionalComponentArgsRest(__VLS_121));
__VLS_123.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_123.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_124 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({
        size: "small",
        type: (row.statusType),
        effect: "dark",
    }));
    const __VLS_126 = __VLS_125({
        size: "small",
        type: (row.statusType),
        effect: "dark",
    }, ...__VLS_functionalComponentArgsRest(__VLS_125));
    __VLS_127.slots.default;
    (row.status);
    var __VLS_127;
}
var __VLS_123;
const __VLS_128 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({
    label: "操作",
    width: "120",
    align: "center",
}));
const __VLS_130 = __VLS_129({
    label: "操作",
    width: "120",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_129));
__VLS_131.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_131.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_132 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
        size: "small",
    }));
    const __VLS_134 = __VLS_133({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_133));
    let __VLS_136;
    let __VLS_137;
    let __VLS_138;
    const __VLS_139 = {
        onClick: (...[$event]) => {
            __VLS_ctx.renewCert(row);
        }
    };
    __VLS_135.slots.default;
    var __VLS_135;
    const __VLS_140 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_141 = __VLS_asFunctionalComponent(__VLS_140, new __VLS_140({
        ...{ 'onClick': {} },
        link: true,
        type: "info",
        size: "small",
    }));
    const __VLS_142 = __VLS_141({
        ...{ 'onClick': {} },
        link: true,
        type: "info",
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_141));
    let __VLS_144;
    let __VLS_145;
    let __VLS_146;
    const __VLS_147 = {
        onClick: (...[$event]) => {
            __VLS_ctx.certDetail(row);
        }
    };
    __VLS_143.slots.default;
    var __VLS_143;
}
var __VLS_131;
var __VLS_103;
var __VLS_19;
var __VLS_15;
const __VLS_148 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_149 = __VLS_asFunctionalComponent(__VLS_148, new __VLS_148({
    span: (10),
}));
const __VLS_150 = __VLS_149({
    span: (10),
}, ...__VLS_functionalComponentArgsRest(__VLS_149));
__VLS_151.slots.default;
const __VLS_152 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_153 = __VLS_asFunctionalComponent(__VLS_152, new __VLS_152({
    ...{ class: "encrypt-card" },
    shadow: "never",
}));
const __VLS_154 = __VLS_153({
    ...{ class: "encrypt-card" },
    shadow: "never",
}, ...__VLS_functionalComponentArgsRest(__VLS_153));
__VLS_155.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_155.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-actions" },
    });
    const __VLS_156 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_157 = __VLS_asFunctionalComponent(__VLS_156, new __VLS_156({
        ...{ 'onClick': {} },
        type: "danger",
        size: "small",
        icon: (__VLS_ctx.Plus1),
    }));
    const __VLS_158 = __VLS_157({
        ...{ 'onClick': {} },
        type: "danger",
        size: "small",
        icon: (__VLS_ctx.Plus1),
    }, ...__VLS_functionalComponentArgsRest(__VLS_157));
    let __VLS_160;
    let __VLS_161;
    let __VLS_162;
    const __VLS_163 = {
        onClick: (__VLS_ctx.openKeyDrawer)
    };
    __VLS_159.slots.default;
    var __VLS_159;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "life-policy" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "lp-item" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "lp-label" },
});
const __VLS_164 = {}.ElSwitch;
/** @type {[typeof __VLS_components.ElSwitch, typeof __VLS_components.elSwitch, ]} */ ;
// @ts-ignore
const __VLS_165 = __VLS_asFunctionalComponent(__VLS_164, new __VLS_164({
    modelValue: (__VLS_ctx.lifePolicy.autoRotate),
}));
const __VLS_166 = __VLS_165({
    modelValue: (__VLS_ctx.lifePolicy.autoRotate),
}, ...__VLS_functionalComponentArgsRest(__VLS_165));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "tf-tip" },
});
(__VLS_ctx.lifePolicy.autoRotate ? '开通' : '关闭');
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "lp-item" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "lp-label" },
});
const __VLS_168 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_169 = __VLS_asFunctionalComponent(__VLS_168, new __VLS_168({
    modelValue: (__VLS_ctx.lifePolicy.rotateCycle),
    size: "small",
    ...{ class: "tf-select" },
    disabled: (!__VLS_ctx.lifePolicy.autoRotate),
}));
const __VLS_170 = __VLS_169({
    modelValue: (__VLS_ctx.lifePolicy.rotateCycle),
    size: "small",
    ...{ class: "tf-select" },
    disabled: (!__VLS_ctx.lifePolicy.autoRotate),
}, ...__VLS_functionalComponentArgsRest(__VLS_169));
__VLS_171.slots.default;
const __VLS_172 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_173 = __VLS_asFunctionalComponent(__VLS_172, new __VLS_172({
    label: "30 天",
    value: "30",
}));
const __VLS_174 = __VLS_173({
    label: "30 天",
    value: "30",
}, ...__VLS_functionalComponentArgsRest(__VLS_173));
const __VLS_176 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_177 = __VLS_asFunctionalComponent(__VLS_176, new __VLS_176({
    label: "90 天",
    value: "90",
}));
const __VLS_178 = __VLS_177({
    label: "90 天",
    value: "90",
}, ...__VLS_functionalComponentArgsRest(__VLS_177));
const __VLS_180 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_181 = __VLS_asFunctionalComponent(__VLS_180, new __VLS_180({
    label: "180 天",
    value: "180",
}));
const __VLS_182 = __VLS_181({
    label: "180 天",
    value: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_181));
const __VLS_184 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_185 = __VLS_asFunctionalComponent(__VLS_184, new __VLS_184({
    label: "365 天",
    value: "365",
}));
const __VLS_186 = __VLS_185({
    label: "365 天",
    value: "365",
}, ...__VLS_functionalComponentArgsRest(__VLS_185));
var __VLS_171;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "lp-item" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "lp-label" },
});
const __VLS_188 = {}.ElInputNumber;
/** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
// @ts-ignore
const __VLS_189 = __VLS_asFunctionalComponent(__VLS_188, new __VLS_188({
    modelValue: (__VLS_ctx.lifePolicy.warnAhead),
    min: (1),
    max: (90),
    size: "small",
    ...{ class: "lp-number" },
}));
const __VLS_190 = __VLS_189({
    modelValue: (__VLS_ctx.lifePolicy.warnAhead),
    min: (1),
    max: (90),
    size: "small",
    ...{ class: "lp-number" },
}, ...__VLS_functionalComponentArgsRest(__VLS_189));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "tf-tip" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "lp-item" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "lp-label" },
});
const __VLS_192 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_193 = __VLS_asFunctionalComponent(__VLS_192, new __VLS_192({
    modelValue: (__VLS_ctx.lifePolicy.expireAction),
    size: "small",
    ...{ class: "tf-select" },
}));
const __VLS_194 = __VLS_193({
    modelValue: (__VLS_ctx.lifePolicy.expireAction),
    size: "small",
    ...{ class: "tf-select" },
}, ...__VLS_functionalComponentArgsRest(__VLS_193));
__VLS_195.slots.default;
const __VLS_196 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_197 = __VLS_asFunctionalComponent(__VLS_196, new __VLS_196({
    label: "保留只读",
    value: "保留只读",
}));
const __VLS_198 = __VLS_197({
    label: "保留只读",
    value: "保留只读",
}, ...__VLS_functionalComponentArgsRest(__VLS_197));
const __VLS_200 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_201 = __VLS_asFunctionalComponent(__VLS_200, new __VLS_200({
    label: "自动销毁",
    value: "自动销毁",
}));
const __VLS_202 = __VLS_201({
    label: "自动销毁",
    value: "自动销毁",
}, ...__VLS_functionalComponentArgsRest(__VLS_201));
const __VLS_204 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_205 = __VLS_asFunctionalComponent(__VLS_204, new __VLS_204({
    label: "人工审批",
    value: "人工审批",
}));
const __VLS_206 = __VLS_205({
    label: "人工审批",
    value: "人工审批",
}, ...__VLS_functionalComponentArgsRest(__VLS_205));
var __VLS_195;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "lp-item" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "lp-label" },
});
const __VLS_208 = {}.ElSwitch;
/** @type {[typeof __VLS_components.ElSwitch, typeof __VLS_components.elSwitch, ]} */ ;
// @ts-ignore
const __VLS_209 = __VLS_asFunctionalComponent(__VLS_208, new __VLS_208({
    modelValue: (__VLS_ctx.lifePolicy.approveBeforeDisable),
}));
const __VLS_210 = __VLS_209({
    modelValue: (__VLS_ctx.lifePolicy.approveBeforeDisable),
}, ...__VLS_functionalComponentArgsRest(__VLS_209));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "tf-tip" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "block-title" },
});
(__VLS_ctx.keys.length);
const __VLS_212 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_213 = __VLS_asFunctionalComponent(__VLS_212, new __VLS_212({
    data: (__VLS_ctx.keys),
    size: "small",
    stripe: true,
}));
const __VLS_214 = __VLS_213({
    data: (__VLS_ctx.keys),
    size: "small",
    stripe: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_213));
__VLS_215.slots.default;
const __VLS_216 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_217 = __VLS_asFunctionalComponent(__VLS_216, new __VLS_216({
    prop: "name",
    label: "密钥名称",
    minWidth: "140",
}));
const __VLS_218 = __VLS_217({
    prop: "name",
    label: "密钥名称",
    minWidth: "140",
}, ...__VLS_functionalComponentArgsRest(__VLS_217));
__VLS_219.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_219.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "key-name-cell" },
    });
    const __VLS_220 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_221 = __VLS_asFunctionalComponent(__VLS_220, new __VLS_220({
        size: (13),
        ...{ class: "key-ic" },
    }));
    const __VLS_222 = __VLS_221({
        size: (13),
        ...{ class: "key-ic" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_221));
    __VLS_223.slots.default;
    const __VLS_224 = {}.Key;
    /** @type {[typeof __VLS_components.Key, ]} */ ;
    // @ts-ignore
    const __VLS_225 = __VLS_asFunctionalComponent(__VLS_224, new __VLS_224({}));
    const __VLS_226 = __VLS_225({}, ...__VLS_functionalComponentArgsRest(__VLS_225));
    var __VLS_223;
    (row.name);
}
var __VLS_219;
const __VLS_228 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_229 = __VLS_asFunctionalComponent(__VLS_228, new __VLS_228({
    prop: "algorithm",
    label: "算法",
    width: "104",
}));
const __VLS_230 = __VLS_229({
    prop: "algorithm",
    label: "算法",
    width: "104",
}, ...__VLS_functionalComponentArgsRest(__VLS_229));
const __VLS_232 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_233 = __VLS_asFunctionalComponent(__VLS_232, new __VLS_232({
    prop: "usage",
    label: "用途",
    width: "92",
}));
const __VLS_234 = __VLS_233({
    prop: "usage",
    label: "用途",
    width: "92",
}, ...__VLS_functionalComponentArgsRest(__VLS_233));
const __VLS_236 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_237 = __VLS_asFunctionalComponent(__VLS_236, new __VLS_236({
    prop: "rotateCycle",
    label: "轮换周期",
    width: "78",
}));
const __VLS_238 = __VLS_237({
    prop: "rotateCycle",
    label: "轮换周期",
    width: "78",
}, ...__VLS_functionalComponentArgsRest(__VLS_237));
const __VLS_240 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_241 = __VLS_asFunctionalComponent(__VLS_240, new __VLS_240({
    prop: "expireAt",
    label: "到期时间",
    width: "96",
}));
const __VLS_242 = __VLS_241({
    prop: "expireAt",
    label: "到期时间",
    width: "96",
}, ...__VLS_functionalComponentArgsRest(__VLS_241));
const __VLS_244 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_245 = __VLS_asFunctionalComponent(__VLS_244, new __VLS_244({
    label: "状态",
    width: "86",
}));
const __VLS_246 = __VLS_245({
    label: "状态",
    width: "86",
}, ...__VLS_functionalComponentArgsRest(__VLS_245));
__VLS_247.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_247.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_248 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_249 = __VLS_asFunctionalComponent(__VLS_248, new __VLS_248({
        size: "small",
        type: (row.statusType),
        effect: "dark",
    }));
    const __VLS_250 = __VLS_249({
        size: "small",
        type: (row.statusType),
        effect: "dark",
    }, ...__VLS_functionalComponentArgsRest(__VLS_249));
    __VLS_251.slots.default;
    (row.status);
    var __VLS_251;
}
var __VLS_247;
const __VLS_252 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_253 = __VLS_asFunctionalComponent(__VLS_252, new __VLS_252({
    label: "操作",
    width: "116",
    align: "center",
    fixed: "right",
}));
const __VLS_254 = __VLS_253({
    label: "操作",
    width: "116",
    align: "center",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_253));
__VLS_255.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_255.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_256 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_257 = __VLS_asFunctionalComponent(__VLS_256, new __VLS_256({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
        size: "small",
    }));
    const __VLS_258 = __VLS_257({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_257));
    let __VLS_260;
    let __VLS_261;
    let __VLS_262;
    const __VLS_263 = {
        onClick: (...[$event]) => {
            __VLS_ctx.rotateKey(row);
        }
    };
    __VLS_259.slots.default;
    var __VLS_259;
    const __VLS_264 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_265 = __VLS_asFunctionalComponent(__VLS_264, new __VLS_264({
        ...{ 'onClick': {} },
        link: true,
        type: "danger",
        size: "small",
    }));
    const __VLS_266 = __VLS_265({
        ...{ 'onClick': {} },
        link: true,
        type: "danger",
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_265));
    let __VLS_268;
    let __VLS_269;
    let __VLS_270;
    const __VLS_271 = {
        onClick: (...[$event]) => {
            __VLS_ctx.destroyKey(row);
        }
    };
    __VLS_267.slots.default;
    var __VLS_267;
}
var __VLS_255;
var __VLS_215;
var __VLS_155;
var __VLS_151;
var __VLS_11;
var __VLS_7;
const __VLS_272 = {}.ElTabPane;
/** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
// @ts-ignore
const __VLS_273 = __VLS_asFunctionalComponent(__VLS_272, new __VLS_272({
    label: "脱敏",
    name: "mask",
}));
const __VLS_274 = __VLS_273({
    label: "脱敏",
    name: "mask",
}, ...__VLS_functionalComponentArgsRest(__VLS_273));
__VLS_275.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "mask-pane" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "mask-toolbar" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "panel-header" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "panel-actions" },
});
const __VLS_276 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_277 = __VLS_asFunctionalComponent(__VLS_276, new __VLS_276({
    ...{ 'onClick': {} },
    type: "danger",
    size: "small",
    icon: (__VLS_ctx.Plus1),
}));
const __VLS_278 = __VLS_277({
    ...{ 'onClick': {} },
    type: "danger",
    size: "small",
    icon: (__VLS_ctx.Plus1),
}, ...__VLS_functionalComponentArgsRest(__VLS_277));
let __VLS_280;
let __VLS_281;
let __VLS_282;
const __VLS_283 = {
    onClick: (__VLS_ctx.openCreate)
};
__VLS_279.slots.default;
var __VLS_279;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "toolbar-row" },
});
const __VLS_284 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_285 = __VLS_asFunctionalComponent(__VLS_284, new __VLS_284({
    modelValue: (__VLS_ctx.keyword),
    placeholder: "按规则名称 / 字段搜索",
    clearable: true,
    ...{ class: "search-input" },
    prefixIcon: (__VLS_ctx.Search),
}));
const __VLS_286 = __VLS_285({
    modelValue: (__VLS_ctx.keyword),
    placeholder: "按规则名称 / 字段搜索",
    clearable: true,
    ...{ class: "search-input" },
    prefixIcon: (__VLS_ctx.Search),
}, ...__VLS_functionalComponentArgsRest(__VLS_285));
const __VLS_288 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_289 = __VLS_asFunctionalComponent(__VLS_288, new __VLS_288({
    modelValue: (__VLS_ctx.filterMethod),
    placeholder: "脱敏方式",
    clearable: true,
    ...{ class: "filter-select" },
}));
const __VLS_290 = __VLS_289({
    modelValue: (__VLS_ctx.filterMethod),
    placeholder: "脱敏方式",
    clearable: true,
    ...{ class: "filter-select" },
}, ...__VLS_functionalComponentArgsRest(__VLS_289));
__VLS_291.slots.default;
const __VLS_292 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_293 = __VLS_asFunctionalComponent(__VLS_292, new __VLS_292({
    label: "替换",
    value: "替换",
}));
const __VLS_294 = __VLS_293({
    label: "替换",
    value: "替换",
}, ...__VLS_functionalComponentArgsRest(__VLS_293));
const __VLS_296 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_297 = __VLS_asFunctionalComponent(__VLS_296, new __VLS_296({
    label: "掩码",
    value: "掩码",
}));
const __VLS_298 = __VLS_297({
    label: "掩码",
    value: "掩码",
}, ...__VLS_functionalComponentArgsRest(__VLS_297));
const __VLS_300 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_301 = __VLS_asFunctionalComponent(__VLS_300, new __VLS_300({
    label: "哈希",
    value: "哈希",
}));
const __VLS_302 = __VLS_301({
    label: "哈希",
    value: "哈希",
}, ...__VLS_functionalComponentArgsRest(__VLS_301));
var __VLS_291;
const __VLS_304 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_305 = __VLS_asFunctionalComponent(__VLS_304, new __VLS_304({
    modelValue: (__VLS_ctx.filterStatus),
    placeholder: "状态",
    clearable: true,
    ...{ class: "filter-select" },
}));
const __VLS_306 = __VLS_305({
    modelValue: (__VLS_ctx.filterStatus),
    placeholder: "状态",
    clearable: true,
    ...{ class: "filter-select" },
}, ...__VLS_functionalComponentArgsRest(__VLS_305));
__VLS_307.slots.default;
const __VLS_308 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_309 = __VLS_asFunctionalComponent(__VLS_308, new __VLS_308({
    label: "已上线",
    value: "已上线",
}));
const __VLS_310 = __VLS_309({
    label: "已上线",
    value: "已上线",
}, ...__VLS_functionalComponentArgsRest(__VLS_309));
const __VLS_312 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_313 = __VLS_asFunctionalComponent(__VLS_312, new __VLS_312({
    label: "审批中",
    value: "审批中",
}));
const __VLS_314 = __VLS_313({
    label: "审批中",
    value: "审批中",
}, ...__VLS_functionalComponentArgsRest(__VLS_313));
const __VLS_316 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_317 = __VLS_asFunctionalComponent(__VLS_316, new __VLS_316({
    label: "草稿",
    value: "草稿",
}));
const __VLS_318 = __VLS_317({
    label: "草稿",
    value: "草稿",
}, ...__VLS_functionalComponentArgsRest(__VLS_317));
var __VLS_307;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "dep-text" },
});
(__VLS_ctx.filteredRules.length);
const __VLS_320 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_321 = __VLS_asFunctionalComponent(__VLS_320, new __VLS_320({
    data: (__VLS_ctx.pagedRules),
    stripe: true,
}));
const __VLS_322 = __VLS_321({
    data: (__VLS_ctx.pagedRules),
    stripe: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_321));
__VLS_323.slots.default;
const __VLS_324 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_325 = __VLS_asFunctionalComponent(__VLS_324, new __VLS_324({
    prop: "name",
    label: "规则名称",
    minWidth: "140",
}));
const __VLS_326 = __VLS_325({
    prop: "name",
    label: "规则名称",
    minWidth: "140",
}, ...__VLS_functionalComponentArgsRest(__VLS_325));
const __VLS_328 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_329 = __VLS_asFunctionalComponent(__VLS_328, new __VLS_328({
    prop: "field",
    label: "目标字段",
    minWidth: "170",
}));
const __VLS_330 = __VLS_329({
    prop: "field",
    label: "目标字段",
    minWidth: "170",
}, ...__VLS_functionalComponentArgsRest(__VLS_329));
const __VLS_332 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_333 = __VLS_asFunctionalComponent(__VLS_332, new __VLS_332({
    label: "方式",
    width: "80",
}));
const __VLS_334 = __VLS_333({
    label: "方式",
    width: "80",
}, ...__VLS_functionalComponentArgsRest(__VLS_333));
__VLS_335.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_335.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_336 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_337 = __VLS_asFunctionalComponent(__VLS_336, new __VLS_336({
        type: (__VLS_ctx.methodTagType[row.method]),
        effect: "plain",
    }));
    const __VLS_338 = __VLS_337({
        type: (__VLS_ctx.methodTagType[row.method]),
        effect: "plain",
    }, ...__VLS_functionalComponentArgsRest(__VLS_337));
    __VLS_339.slots.default;
    (row.method);
    var __VLS_339;
}
var __VLS_335;
const __VLS_340 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_341 = __VLS_asFunctionalComponent(__VLS_340, new __VLS_340({
    label: "保留格式",
    width: "90",
    align: "center",
}));
const __VLS_342 = __VLS_341({
    label: "保留格式",
    width: "90",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_341));
__VLS_343.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_343.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: (row.preserveFormat ? 'trend-positive' : 'dep-text') },
    });
    (row.preserveFormat ? '是' : '否');
}
var __VLS_343;
const __VLS_344 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_345 = __VLS_asFunctionalComponent(__VLS_344, new __VLS_344({
    label: "示例",
    minWidth: "210",
}));
const __VLS_346 = __VLS_345({
    label: "示例",
    minWidth: "210",
}, ...__VLS_functionalComponentArgsRest(__VLS_345));
__VLS_347.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_347.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "mask-sample-before" },
    });
    (row.sampleBefore);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "dep-text" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "mask-sample-after" },
    });
    (row.sampleAfter);
}
var __VLS_347;
const __VLS_348 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_349 = __VLS_asFunctionalComponent(__VLS_348, new __VLS_348({
    prop: "scope",
    label: "场景",
    width: "130",
}));
const __VLS_350 = __VLS_349({
    prop: "scope",
    label: "场景",
    width: "130",
}, ...__VLS_functionalComponentArgsRest(__VLS_349));
const __VLS_352 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_353 = __VLS_asFunctionalComponent(__VLS_352, new __VLS_352({
    prop: "version",
    label: "版本",
    width: "70",
    align: "center",
}));
const __VLS_354 = __VLS_353({
    prop: "version",
    label: "版本",
    width: "70",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_353));
const __VLS_356 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_357 = __VLS_asFunctionalComponent(__VLS_356, new __VLS_356({
    label: "状态",
    width: "90",
}));
const __VLS_358 = __VLS_357({
    label: "状态",
    width: "90",
}, ...__VLS_functionalComponentArgsRest(__VLS_357));
__VLS_359.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_359.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_360 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_361 = __VLS_asFunctionalComponent(__VLS_360, new __VLS_360({
        type: (__VLS_ctx.ruleStatusTag[row.status]),
        effect: "dark",
    }));
    const __VLS_362 = __VLS_361({
        type: (__VLS_ctx.ruleStatusTag[row.status]),
        effect: "dark",
    }, ...__VLS_functionalComponentArgsRest(__VLS_361));
    __VLS_363.slots.default;
    (row.status);
    var __VLS_363;
}
var __VLS_359;
const __VLS_364 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_365 = __VLS_asFunctionalComponent(__VLS_364, new __VLS_364({
    label: "操作",
    width: "190",
    fixed: "right",
}));
const __VLS_366 = __VLS_365({
    label: "操作",
    width: "190",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_365));
__VLS_367.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_367.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_368 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_369 = __VLS_asFunctionalComponent(__VLS_368, new __VLS_368({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }));
    const __VLS_370 = __VLS_369({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_369));
    let __VLS_372;
    let __VLS_373;
    let __VLS_374;
    const __VLS_375 = {
        onClick: (...[$event]) => {
            __VLS_ctx.openEdit(row);
        }
    };
    __VLS_371.slots.default;
    var __VLS_371;
    const __VLS_376 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_377 = __VLS_asFunctionalComponent(__VLS_376, new __VLS_376({
        ...{ 'onClick': {} },
        link: true,
        type: "warning",
    }));
    const __VLS_378 = __VLS_377({
        ...{ 'onClick': {} },
        link: true,
        type: "warning",
    }, ...__VLS_functionalComponentArgsRest(__VLS_377));
    let __VLS_380;
    let __VLS_381;
    let __VLS_382;
    const __VLS_383 = {
        onClick: (...[$event]) => {
            __VLS_ctx.versionHistory(row);
        }
    };
    __VLS_379.slots.default;
    var __VLS_379;
    const __VLS_384 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_385 = __VLS_asFunctionalComponent(__VLS_384, new __VLS_384({
        ...{ 'onClick': {} },
        link: true,
        type: "success",
    }));
    const __VLS_386 = __VLS_385({
        ...{ 'onClick': {} },
        link: true,
        type: "success",
    }, ...__VLS_functionalComponentArgsRest(__VLS_385));
    let __VLS_388;
    let __VLS_389;
    let __VLS_390;
    const __VLS_391 = {
        onClick: (...[$event]) => {
            __VLS_ctx.onlineRule(row);
        }
    };
    __VLS_387.slots.default;
    (row.status === '已上线' ? '下线' : '上线');
    var __VLS_387;
}
var __VLS_367;
var __VLS_323;
const __VLS_392 = {}.ElPagination;
/** @type {[typeof __VLS_components.ElPagination, typeof __VLS_components.elPagination, ]} */ ;
// @ts-ignore
const __VLS_393 = __VLS_asFunctionalComponent(__VLS_392, new __VLS_392({
    ...{ 'onCurrentChange': {} },
    ...{ class: "pager" },
    layout: "total, prev, pager, next",
    total: (__VLS_ctx.filteredRules.length),
    pageSize: (__VLS_ctx.pageSize),
    currentPage: (__VLS_ctx.currentPage),
    background: true,
}));
const __VLS_394 = __VLS_393({
    ...{ 'onCurrentChange': {} },
    ...{ class: "pager" },
    layout: "total, prev, pager, next",
    total: (__VLS_ctx.filteredRules.length),
    pageSize: (__VLS_ctx.pageSize),
    currentPage: (__VLS_ctx.currentPage),
    background: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_393));
let __VLS_396;
let __VLS_397;
let __VLS_398;
const __VLS_399 = {
    onCurrentChange: (__VLS_ctx.changePage)
};
var __VLS_395;
var __VLS_275;
var __VLS_3;
const __VLS_400 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_401 = __VLS_asFunctionalComponent(__VLS_400, new __VLS_400({
    modelValue: (__VLS_ctx.editorVisible),
    title: (__VLS_ctx.editing ? '编辑脱敏规则' : '新增脱敏规则'),
    width: "780px",
    alignCenter: true,
    destroyOnClose: true,
    ...{ class: "mask-rule-dialog" },
}));
const __VLS_402 = __VLS_401({
    modelValue: (__VLS_ctx.editorVisible),
    title: (__VLS_ctx.editing ? '编辑脱敏规则' : '新增脱敏规则'),
    width: "780px",
    alignCenter: true,
    destroyOnClose: true,
    ...{ class: "mask-rule-dialog" },
}, ...__VLS_functionalComponentArgsRest(__VLS_401));
__VLS_403.slots.default;
const __VLS_404 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_405 = __VLS_asFunctionalComponent(__VLS_404, new __VLS_404({
    ref: "formRef",
    model: (__VLS_ctx.form),
    rules: (__VLS_ctx.formRules),
    labelWidth: "96px",
}));
const __VLS_406 = __VLS_405({
    ref: "formRef",
    model: (__VLS_ctx.form),
    rules: (__VLS_ctx.formRules),
    labelWidth: "96px",
}, ...__VLS_functionalComponentArgsRest(__VLS_405));
/** @type {typeof __VLS_ctx.formRef} */ ;
var __VLS_408 = {};
__VLS_407.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "rule-section-title" },
});
const __VLS_410 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
// @ts-ignore
const __VLS_411 = __VLS_asFunctionalComponent(__VLS_410, new __VLS_410({
    gutter: (16),
}));
const __VLS_412 = __VLS_411({
    gutter: (16),
}, ...__VLS_functionalComponentArgsRest(__VLS_411));
__VLS_413.slots.default;
const __VLS_414 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_415 = __VLS_asFunctionalComponent(__VLS_414, new __VLS_414({
    span: (12),
}));
const __VLS_416 = __VLS_415({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_415));
__VLS_417.slots.default;
const __VLS_418 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_419 = __VLS_asFunctionalComponent(__VLS_418, new __VLS_418({
    label: "规则名称",
    prop: "name",
}));
const __VLS_420 = __VLS_419({
    label: "规则名称",
    prop: "name",
}, ...__VLS_functionalComponentArgsRest(__VLS_419));
__VLS_421.slots.default;
const __VLS_422 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_423 = __VLS_asFunctionalComponent(__VLS_422, new __VLS_422({
    modelValue: (__VLS_ctx.form.name),
    placeholder: "如：手机号码掩码规则",
}));
const __VLS_424 = __VLS_423({
    modelValue: (__VLS_ctx.form.name),
    placeholder: "如：手机号码掩码规则",
}, ...__VLS_functionalComponentArgsRest(__VLS_423));
var __VLS_421;
var __VLS_417;
const __VLS_426 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_427 = __VLS_asFunctionalComponent(__VLS_426, new __VLS_426({
    span: (12),
}));
const __VLS_428 = __VLS_427({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_427));
__VLS_429.slots.default;
const __VLS_430 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_431 = __VLS_asFunctionalComponent(__VLS_430, new __VLS_430({
    label: "所属数据表",
    prop: "table",
}));
const __VLS_432 = __VLS_431({
    label: "所属数据表",
    prop: "table",
}, ...__VLS_functionalComponentArgsRest(__VLS_431));
__VLS_433.slots.default;
const __VLS_434 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_435 = __VLS_asFunctionalComponent(__VLS_434, new __VLS_434({
    modelValue: (__VLS_ctx.form.table),
    ...{ class: "w-full" },
}));
const __VLS_436 = __VLS_435({
    modelValue: (__VLS_ctx.form.table),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_435));
__VLS_437.slots.default;
for (const [t] of __VLS_getVForSourceType((__VLS_ctx.tablePool))) {
    const __VLS_438 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_439 = __VLS_asFunctionalComponent(__VLS_438, new __VLS_438({
        key: (t),
        label: (t),
        value: (t),
    }));
    const __VLS_440 = __VLS_439({
        key: (t),
        label: (t),
        value: (t),
    }, ...__VLS_functionalComponentArgsRest(__VLS_439));
}
var __VLS_437;
var __VLS_433;
var __VLS_429;
var __VLS_413;
const __VLS_442 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_443 = __VLS_asFunctionalComponent(__VLS_442, new __VLS_442({
    label: "规则描述",
}));
const __VLS_444 = __VLS_443({
    label: "规则描述",
}, ...__VLS_functionalComponentArgsRest(__VLS_443));
__VLS_445.slots.default;
const __VLS_446 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_447 = __VLS_asFunctionalComponent(__VLS_446, new __VLS_446({
    modelValue: (__VLS_ctx.form.description),
    type: "textarea",
    rows: (2),
    placeholder: "说明规则用途、适用范围及注意事项",
    maxlength: "200",
    showWordLimit: true,
}));
const __VLS_448 = __VLS_447({
    modelValue: (__VLS_ctx.form.description),
    type: "textarea",
    rows: (2),
    placeholder: "说明规则用途、适用范围及注意事项",
    maxlength: "200",
    showWordLimit: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_447));
var __VLS_445;
const __VLS_450 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
// @ts-ignore
const __VLS_451 = __VLS_asFunctionalComponent(__VLS_450, new __VLS_450({
    gutter: (16),
}));
const __VLS_452 = __VLS_451({
    gutter: (16),
}, ...__VLS_functionalComponentArgsRest(__VLS_451));
__VLS_453.slots.default;
const __VLS_454 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_455 = __VLS_asFunctionalComponent(__VLS_454, new __VLS_454({
    span: (12),
}));
const __VLS_456 = __VLS_455({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_455));
__VLS_457.slots.default;
const __VLS_458 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_459 = __VLS_asFunctionalComponent(__VLS_458, new __VLS_458({
    label: "目标字段",
    prop: "field",
}));
const __VLS_460 = __VLS_459({
    label: "目标字段",
    prop: "field",
}, ...__VLS_functionalComponentArgsRest(__VLS_459));
__VLS_461.slots.default;
const __VLS_462 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_463 = __VLS_asFunctionalComponent(__VLS_462, new __VLS_462({
    modelValue: (__VLS_ctx.form.field),
    filterable: true,
    ...{ class: "w-full" },
}));
const __VLS_464 = __VLS_463({
    modelValue: (__VLS_ctx.form.field),
    filterable: true,
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_463));
__VLS_465.slots.default;
for (const [f] of __VLS_getVForSourceType((__VLS_ctx.fieldsOfTable))) {
    const __VLS_466 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_467 = __VLS_asFunctionalComponent(__VLS_466, new __VLS_466({
        key: (f),
        label: (f),
        value: (f),
    }));
    const __VLS_468 = __VLS_467({
        key: (f),
        label: (f),
        value: (f),
    }, ...__VLS_functionalComponentArgsRest(__VLS_467));
}
var __VLS_465;
var __VLS_461;
var __VLS_457;
const __VLS_470 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_471 = __VLS_asFunctionalComponent(__VLS_470, new __VLS_470({
    span: (12),
}));
const __VLS_472 = __VLS_471({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_471));
__VLS_473.slots.default;
const __VLS_474 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_475 = __VLS_asFunctionalComponent(__VLS_474, new __VLS_474({
    label: "脱敏方式",
    prop: "method",
}));
const __VLS_476 = __VLS_475({
    label: "脱敏方式",
    prop: "method",
}, ...__VLS_functionalComponentArgsRest(__VLS_475));
__VLS_477.slots.default;
const __VLS_478 = {}.ElRadioGroup;
/** @type {[typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, ]} */ ;
// @ts-ignore
const __VLS_479 = __VLS_asFunctionalComponent(__VLS_478, new __VLS_478({
    modelValue: (__VLS_ctx.form.method),
}));
const __VLS_480 = __VLS_479({
    modelValue: (__VLS_ctx.form.method),
}, ...__VLS_functionalComponentArgsRest(__VLS_479));
__VLS_481.slots.default;
const __VLS_482 = {}.ElRadioButton;
/** @type {[typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, ]} */ ;
// @ts-ignore
const __VLS_483 = __VLS_asFunctionalComponent(__VLS_482, new __VLS_482({
    value: "掩码",
}));
const __VLS_484 = __VLS_483({
    value: "掩码",
}, ...__VLS_functionalComponentArgsRest(__VLS_483));
const __VLS_486 = {}.ElRadioButton;
/** @type {[typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, ]} */ ;
// @ts-ignore
const __VLS_487 = __VLS_asFunctionalComponent(__VLS_486, new __VLS_486({
    value: "替换",
}));
const __VLS_488 = __VLS_487({
    value: "替换",
}, ...__VLS_functionalComponentArgsRest(__VLS_487));
const __VLS_490 = {}.ElRadioButton;
/** @type {[typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, ]} */ ;
// @ts-ignore
const __VLS_491 = __VLS_asFunctionalComponent(__VLS_490, new __VLS_490({
    value: "哈希",
}));
const __VLS_492 = __VLS_491({
    value: "哈希",
}, ...__VLS_functionalComponentArgsRest(__VLS_491));
var __VLS_481;
var __VLS_477;
var __VLS_473;
var __VLS_453;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "rule-section-title" },
});
if (__VLS_ctx.form.method === '掩码') {
    const __VLS_494 = {}.ElRow;
    /** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
    // @ts-ignore
    const __VLS_495 = __VLS_asFunctionalComponent(__VLS_494, new __VLS_494({
        gutter: (16),
    }));
    const __VLS_496 = __VLS_495({
        gutter: (16),
    }, ...__VLS_functionalComponentArgsRest(__VLS_495));
    __VLS_497.slots.default;
    const __VLS_498 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_499 = __VLS_asFunctionalComponent(__VLS_498, new __VLS_498({
        span: (8),
    }));
    const __VLS_500 = __VLS_499({
        span: (8),
    }, ...__VLS_functionalComponentArgsRest(__VLS_499));
    __VLS_501.slots.default;
    const __VLS_502 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_503 = __VLS_asFunctionalComponent(__VLS_502, new __VLS_502({
        label: "保留前位",
    }));
    const __VLS_504 = __VLS_503({
        label: "保留前位",
    }, ...__VLS_functionalComponentArgsRest(__VLS_503));
    __VLS_505.slots.default;
    const __VLS_506 = {}.ElInputNumber;
    /** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
    // @ts-ignore
    const __VLS_507 = __VLS_asFunctionalComponent(__VLS_506, new __VLS_506({
        modelValue: (__VLS_ctx.form.mask.headKeep),
        min: (0),
        max: (15),
        ...{ class: "w-full" },
    }));
    const __VLS_508 = __VLS_507({
        modelValue: (__VLS_ctx.form.mask.headKeep),
        min: (0),
        max: (15),
        ...{ class: "w-full" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_507));
    var __VLS_505;
    var __VLS_501;
    const __VLS_510 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_511 = __VLS_asFunctionalComponent(__VLS_510, new __VLS_510({
        span: (8),
    }));
    const __VLS_512 = __VLS_511({
        span: (8),
    }, ...__VLS_functionalComponentArgsRest(__VLS_511));
    __VLS_513.slots.default;
    const __VLS_514 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_515 = __VLS_asFunctionalComponent(__VLS_514, new __VLS_514({
        label: "保留后位",
    }));
    const __VLS_516 = __VLS_515({
        label: "保留后位",
    }, ...__VLS_functionalComponentArgsRest(__VLS_515));
    __VLS_517.slots.default;
    const __VLS_518 = {}.ElInputNumber;
    /** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
    // @ts-ignore
    const __VLS_519 = __VLS_asFunctionalComponent(__VLS_518, new __VLS_518({
        modelValue: (__VLS_ctx.form.mask.tailKeep),
        min: (0),
        max: (15),
        ...{ class: "w-full" },
    }));
    const __VLS_520 = __VLS_519({
        modelValue: (__VLS_ctx.form.mask.tailKeep),
        min: (0),
        max: (15),
        ...{ class: "w-full" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_519));
    var __VLS_517;
    var __VLS_513;
    const __VLS_522 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_523 = __VLS_asFunctionalComponent(__VLS_522, new __VLS_522({
        span: (8),
    }));
    const __VLS_524 = __VLS_523({
        span: (8),
    }, ...__VLS_functionalComponentArgsRest(__VLS_523));
    __VLS_525.slots.default;
    const __VLS_526 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_527 = __VLS_asFunctionalComponent(__VLS_526, new __VLS_526({
        label: "掩码字符",
    }));
    const __VLS_528 = __VLS_527({
        label: "掩码字符",
    }, ...__VLS_functionalComponentArgsRest(__VLS_527));
    __VLS_529.slots.default;
    const __VLS_530 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_531 = __VLS_asFunctionalComponent(__VLS_530, new __VLS_530({
        modelValue: (__VLS_ctx.form.mask.maskChar),
        maxlength: "2",
        placeholder: "*",
    }));
    const __VLS_532 = __VLS_531({
        modelValue: (__VLS_ctx.form.mask.maskChar),
        maxlength: "2",
        placeholder: "*",
    }, ...__VLS_functionalComponentArgsRest(__VLS_531));
    var __VLS_529;
    var __VLS_525;
    var __VLS_497;
}
else if (__VLS_ctx.form.method === '替换') {
    const __VLS_534 = {}.ElRow;
    /** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
    // @ts-ignore
    const __VLS_535 = __VLS_asFunctionalComponent(__VLS_534, new __VLS_534({
        gutter: (16),
    }));
    const __VLS_536 = __VLS_535({
        gutter: (16),
    }, ...__VLS_functionalComponentArgsRest(__VLS_535));
    __VLS_537.slots.default;
    const __VLS_538 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_539 = __VLS_asFunctionalComponent(__VLS_538, new __VLS_538({
        span: (8),
    }));
    const __VLS_540 = __VLS_539({
        span: (8),
    }, ...__VLS_functionalComponentArgsRest(__VLS_539));
    __VLS_541.slots.default;
    const __VLS_542 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_543 = __VLS_asFunctionalComponent(__VLS_542, new __VLS_542({
        label: "替换字符",
    }));
    const __VLS_544 = __VLS_543({
        label: "替换字符",
    }, ...__VLS_functionalComponentArgsRest(__VLS_543));
    __VLS_545.slots.default;
    const __VLS_546 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_547 = __VLS_asFunctionalComponent(__VLS_546, new __VLS_546({
        modelValue: (__VLS_ctx.form.replace.replaceChar),
        maxlength: "2",
        placeholder: "*",
    }));
    const __VLS_548 = __VLS_547({
        modelValue: (__VLS_ctx.form.replace.replaceChar),
        maxlength: "2",
        placeholder: "*",
    }, ...__VLS_functionalComponentArgsRest(__VLS_547));
    var __VLS_545;
    var __VLS_541;
    const __VLS_550 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_551 = __VLS_asFunctionalComponent(__VLS_550, new __VLS_550({
        span: (8),
    }));
    const __VLS_552 = __VLS_551({
        span: (8),
    }, ...__VLS_functionalComponentArgsRest(__VLS_551));
    __VLS_553.slots.default;
    const __VLS_554 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_555 = __VLS_asFunctionalComponent(__VLS_554, new __VLS_554({
        label: "替换比例",
    }));
    const __VLS_556 = __VLS_555({
        label: "替换比例",
    }, ...__VLS_functionalComponentArgsRest(__VLS_555));
    __VLS_557.slots.default;
    const __VLS_558 = {}.ElInputNumber;
    /** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
    // @ts-ignore
    const __VLS_559 = __VLS_asFunctionalComponent(__VLS_558, new __VLS_558({
        modelValue: (__VLS_ctx.form.replace.ratio),
        min: (10),
        max: (100),
        step: (10),
        ...{ class: "w-full" },
    }));
    const __VLS_560 = __VLS_559({
        modelValue: (__VLS_ctx.form.replace.ratio),
        min: (10),
        max: (100),
        step: (10),
        ...{ class: "w-full" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_559));
    var __VLS_557;
    var __VLS_553;
    const __VLS_562 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_563 = __VLS_asFunctionalComponent(__VLS_562, new __VLS_562({
        span: (8),
    }));
    const __VLS_564 = __VLS_563({
        span: (8),
    }, ...__VLS_functionalComponentArgsRest(__VLS_563));
    __VLS_565.slots.default;
    const __VLS_566 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_567 = __VLS_asFunctionalComponent(__VLS_566, new __VLS_566({
        label: "保留原长度",
    }));
    const __VLS_568 = __VLS_567({
        label: "保留原长度",
    }, ...__VLS_functionalComponentArgsRest(__VLS_567));
    __VLS_569.slots.default;
    const __VLS_570 = {}.ElSwitch;
    /** @type {[typeof __VLS_components.ElSwitch, typeof __VLS_components.elSwitch, ]} */ ;
    // @ts-ignore
    const __VLS_571 = __VLS_asFunctionalComponent(__VLS_570, new __VLS_570({
        modelValue: (__VLS_ctx.form.replace.keepLength),
        activeText: "是",
        inactiveText: "否",
    }));
    const __VLS_572 = __VLS_571({
        modelValue: (__VLS_ctx.form.replace.keepLength),
        activeText: "是",
        inactiveText: "否",
    }, ...__VLS_functionalComponentArgsRest(__VLS_571));
    var __VLS_569;
    var __VLS_565;
    var __VLS_537;
}
else {
    const __VLS_574 = {}.ElRow;
    /** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
    // @ts-ignore
    const __VLS_575 = __VLS_asFunctionalComponent(__VLS_574, new __VLS_574({
        gutter: (16),
    }));
    const __VLS_576 = __VLS_575({
        gutter: (16),
    }, ...__VLS_functionalComponentArgsRest(__VLS_575));
    __VLS_577.slots.default;
    const __VLS_578 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_579 = __VLS_asFunctionalComponent(__VLS_578, new __VLS_578({
        span: (12),
    }));
    const __VLS_580 = __VLS_579({
        span: (12),
    }, ...__VLS_functionalComponentArgsRest(__VLS_579));
    __VLS_581.slots.default;
    const __VLS_582 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_583 = __VLS_asFunctionalComponent(__VLS_582, new __VLS_582({
        label: "哈希算法",
    }));
    const __VLS_584 = __VLS_583({
        label: "哈希算法",
    }, ...__VLS_functionalComponentArgsRest(__VLS_583));
    __VLS_585.slots.default;
    const __VLS_586 = {}.ElSelect;
    /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
    // @ts-ignore
    const __VLS_587 = __VLS_asFunctionalComponent(__VLS_586, new __VLS_586({
        modelValue: (__VLS_ctx.form.hash.algorithm),
        ...{ class: "w-full" },
    }));
    const __VLS_588 = __VLS_587({
        modelValue: (__VLS_ctx.form.hash.algorithm),
        ...{ class: "w-full" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_587));
    __VLS_589.slots.default;
    const __VLS_590 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_591 = __VLS_asFunctionalComponent(__VLS_590, new __VLS_590({
        label: "SHA-256（推荐）",
        value: "SHA-256",
    }));
    const __VLS_592 = __VLS_591({
        label: "SHA-256（推荐）",
        value: "SHA-256",
    }, ...__VLS_functionalComponentArgsRest(__VLS_591));
    const __VLS_594 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_595 = __VLS_asFunctionalComponent(__VLS_594, new __VLS_594({
        label: "MD5",
        value: "MD5",
    }));
    const __VLS_596 = __VLS_595({
        label: "MD5",
        value: "MD5",
    }, ...__VLS_functionalComponentArgsRest(__VLS_595));
    const __VLS_598 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_599 = __VLS_asFunctionalComponent(__VLS_598, new __VLS_598({
        label: "SM3（国密）",
        value: "SM3",
    }));
    const __VLS_600 = __VLS_599({
        label: "SM3（国密）",
        value: "SM3",
    }, ...__VLS_functionalComponentArgsRest(__VLS_599));
    var __VLS_589;
    var __VLS_585;
    var __VLS_581;
    const __VLS_602 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_603 = __VLS_asFunctionalComponent(__VLS_602, new __VLS_602({
        span: (12),
    }));
    const __VLS_604 = __VLS_603({
        span: (12),
    }, ...__VLS_functionalComponentArgsRest(__VLS_603));
    __VLS_605.slots.default;
    const __VLS_606 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_607 = __VLS_asFunctionalComponent(__VLS_606, new __VLS_606({
        label: "加盐处理",
    }));
    const __VLS_608 = __VLS_607({
        label: "加盐处理",
    }, ...__VLS_functionalComponentArgsRest(__VLS_607));
    __VLS_609.slots.default;
    const __VLS_610 = {}.ElSwitch;
    /** @type {[typeof __VLS_components.ElSwitch, typeof __VLS_components.elSwitch, ]} */ ;
    // @ts-ignore
    const __VLS_611 = __VLS_asFunctionalComponent(__VLS_610, new __VLS_610({
        modelValue: (__VLS_ctx.form.hash.salt),
        activeText: "固定项目盐值",
        inactiveText: "不加盐",
    }));
    const __VLS_612 = __VLS_611({
        modelValue: (__VLS_ctx.form.hash.salt),
        activeText: "固定项目盐值",
        inactiveText: "不加盐",
    }, ...__VLS_functionalComponentArgsRest(__VLS_611));
    var __VLS_609;
    var __VLS_605;
    var __VLS_577;
}
const __VLS_614 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_615 = __VLS_asFunctionalComponent(__VLS_614, new __VLS_614({
    label: "脱敏预览",
}));
const __VLS_616 = __VLS_615({
    label: "脱敏预览",
}, ...__VLS_functionalComponentArgsRest(__VLS_615));
__VLS_617.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "mask-preview" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "preview-before" },
});
(__VLS_ctx.previewSample);
const __VLS_618 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_619 = __VLS_asFunctionalComponent(__VLS_618, new __VLS_618({
    ...{ class: "preview-arrow" },
}));
const __VLS_620 = __VLS_619({
    ...{ class: "preview-arrow" },
}, ...__VLS_functionalComponentArgsRest(__VLS_619));
__VLS_621.slots.default;
const __VLS_622 = {}.Right;
/** @type {[typeof __VLS_components.Right, ]} */ ;
// @ts-ignore
const __VLS_623 = __VLS_asFunctionalComponent(__VLS_622, new __VLS_622({}));
const __VLS_624 = __VLS_623({}, ...__VLS_functionalComponentArgsRest(__VLS_623));
var __VLS_621;
const __VLS_626 = {}.ElTag;
/** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
// @ts-ignore
const __VLS_627 = __VLS_asFunctionalComponent(__VLS_626, new __VLS_626({
    type: "warning",
    effect: "dark",
}));
const __VLS_628 = __VLS_627({
    type: "warning",
    effect: "dark",
}, ...__VLS_functionalComponentArgsRest(__VLS_627));
__VLS_629.slots.default;
(__VLS_ctx.previewText);
var __VLS_629;
var __VLS_617;
const __VLS_630 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
// @ts-ignore
const __VLS_631 = __VLS_asFunctionalComponent(__VLS_630, new __VLS_630({
    gutter: (16),
}));
const __VLS_632 = __VLS_631({
    gutter: (16),
}, ...__VLS_functionalComponentArgsRest(__VLS_631));
__VLS_633.slots.default;
const __VLS_634 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_635 = __VLS_asFunctionalComponent(__VLS_634, new __VLS_634({
    span: (12),
}));
const __VLS_636 = __VLS_635({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_635));
__VLS_637.slots.default;
const __VLS_638 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_639 = __VLS_asFunctionalComponent(__VLS_638, new __VLS_638({
    label: "保留格式",
}));
const __VLS_640 = __VLS_639({
    label: "保留格式",
}, ...__VLS_functionalComponentArgsRest(__VLS_639));
__VLS_641.slots.default;
const __VLS_642 = {}.ElSwitch;
/** @type {[typeof __VLS_components.ElSwitch, typeof __VLS_components.elSwitch, ]} */ ;
// @ts-ignore
const __VLS_643 = __VLS_asFunctionalComponent(__VLS_642, new __VLS_642({
    modelValue: (__VLS_ctx.form.preserveFormat),
    activeText: "启用",
    inactiveText: "关闭",
}));
const __VLS_644 = __VLS_643({
    modelValue: (__VLS_ctx.form.preserveFormat),
    activeText: "启用",
    inactiveText: "关闭",
}, ...__VLS_functionalComponentArgsRest(__VLS_643));
var __VLS_641;
var __VLS_637;
const __VLS_646 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_647 = __VLS_asFunctionalComponent(__VLS_646, new __VLS_646({
    span: (12),
}));
const __VLS_648 = __VLS_647({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_647));
__VLS_649.slots.default;
const __VLS_650 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_651 = __VLS_asFunctionalComponent(__VLS_650, new __VLS_650({
    label: "优先级",
}));
const __VLS_652 = __VLS_651({
    label: "优先级",
}, ...__VLS_functionalComponentArgsRest(__VLS_651));
__VLS_653.slots.default;
const __VLS_654 = {}.ElInputNumber;
/** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
// @ts-ignore
const __VLS_655 = __VLS_asFunctionalComponent(__VLS_654, new __VLS_654({
    modelValue: (__VLS_ctx.form.priority),
    min: (1),
    max: (100),
    ...{ class: "w-full" },
}));
const __VLS_656 = __VLS_655({
    modelValue: (__VLS_ctx.form.priority),
    min: (1),
    max: (100),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_655));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "dep-text tf-tip" },
});
var __VLS_653;
var __VLS_649;
var __VLS_633;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "rule-section-title" },
});
const __VLS_658 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_659 = __VLS_asFunctionalComponent(__VLS_658, new __VLS_658({
    label: "脱敏场景",
    prop: "scope",
}));
const __VLS_660 = __VLS_659({
    label: "脱敏场景",
    prop: "scope",
}, ...__VLS_functionalComponentArgsRest(__VLS_659));
__VLS_661.slots.default;
const __VLS_662 = {}.ElRadioGroup;
/** @type {[typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, ]} */ ;
// @ts-ignore
const __VLS_663 = __VLS_asFunctionalComponent(__VLS_662, new __VLS_662({
    modelValue: (__VLS_ctx.form.scope),
}));
const __VLS_664 = __VLS_663({
    modelValue: (__VLS_ctx.form.scope),
}, ...__VLS_functionalComponentArgsRest(__VLS_663));
__VLS_665.slots.default;
const __VLS_666 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
const __VLS_667 = __VLS_asFunctionalComponent(__VLS_666, new __VLS_666({
    value: "查询实时脱敏",
}));
const __VLS_668 = __VLS_667({
    value: "查询实时脱敏",
}, ...__VLS_functionalComponentArgsRest(__VLS_667));
__VLS_669.slots.default;
var __VLS_669;
const __VLS_670 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
const __VLS_671 = __VLS_asFunctionalComponent(__VLS_670, new __VLS_670({
    value: "存储静态脱敏",
}));
const __VLS_672 = __VLS_671({
    value: "存储静态脱敏",
}, ...__VLS_functionalComponentArgsRest(__VLS_671));
__VLS_673.slots.default;
var __VLS_673;
const __VLS_674 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
const __VLS_675 = __VLS_asFunctionalComponent(__VLS_674, new __VLS_674({
    value: "数据导出脱敏",
}));
const __VLS_676 = __VLS_675({
    value: "数据导出脱敏",
}, ...__VLS_functionalComponentArgsRest(__VLS_675));
__VLS_677.slots.default;
var __VLS_677;
var __VLS_665;
var __VLS_661;
const __VLS_678 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_679 = __VLS_asFunctionalComponent(__VLS_678, new __VLS_678({
    label: "适用角色",
}));
const __VLS_680 = __VLS_679({
    label: "适用角色",
}, ...__VLS_functionalComponentArgsRest(__VLS_679));
__VLS_681.slots.default;
const __VLS_682 = {}.ElSwitch;
/** @type {[typeof __VLS_components.ElSwitch, typeof __VLS_components.elSwitch, ]} */ ;
// @ts-ignore
const __VLS_683 = __VLS_asFunctionalComponent(__VLS_682, new __VLS_682({
    modelValue: (__VLS_ctx.form.applyAllRoles),
    activeText: "全部角色",
    inactiveText: "指定角色",
}));
const __VLS_684 = __VLS_683({
    modelValue: (__VLS_ctx.form.applyAllRoles),
    activeText: "全部角色",
    inactiveText: "指定角色",
}, ...__VLS_functionalComponentArgsRest(__VLS_683));
var __VLS_681;
if (!__VLS_ctx.form.applyAllRoles) {
    const __VLS_686 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_687 = __VLS_asFunctionalComponent(__VLS_686, new __VLS_686({
        label: "指定角色",
        prop: "roles",
    }));
    const __VLS_688 = __VLS_687({
        label: "指定角色",
        prop: "roles",
    }, ...__VLS_functionalComponentArgsRest(__VLS_687));
    __VLS_689.slots.default;
    const __VLS_690 = {}.ElSelect;
    /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
    // @ts-ignore
    const __VLS_691 = __VLS_asFunctionalComponent(__VLS_690, new __VLS_690({
        modelValue: (__VLS_ctx.form.roles),
        multiple: true,
        ...{ class: "w-full" },
        placeholder: "选择可查看明文的角色",
    }));
    const __VLS_692 = __VLS_691({
        modelValue: (__VLS_ctx.form.roles),
        multiple: true,
        ...{ class: "w-full" },
        placeholder: "选择可查看明文的角色",
    }, ...__VLS_functionalComponentArgsRest(__VLS_691));
    __VLS_693.slots.default;
    for (const [r] of __VLS_getVForSourceType((__VLS_ctx.rolePool))) {
        const __VLS_694 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_695 = __VLS_asFunctionalComponent(__VLS_694, new __VLS_694({
            key: (r),
            label: (r),
            value: (r),
        }));
        const __VLS_696 = __VLS_695({
            key: (r),
            label: (r),
            value: (r),
        }, ...__VLS_functionalComponentArgsRest(__VLS_695));
    }
    var __VLS_693;
    var __VLS_689;
}
const __VLS_698 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
// @ts-ignore
const __VLS_699 = __VLS_asFunctionalComponent(__VLS_698, new __VLS_698({
    gutter: (16),
}));
const __VLS_700 = __VLS_699({
    gutter: (16),
}, ...__VLS_functionalComponentArgsRest(__VLS_699));
__VLS_701.slots.default;
const __VLS_702 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_703 = __VLS_asFunctionalComponent(__VLS_702, new __VLS_702({
    span: (12),
}));
const __VLS_704 = __VLS_703({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_703));
__VLS_705.slots.default;
const __VLS_706 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_707 = __VLS_asFunctionalComponent(__VLS_706, new __VLS_706({
    label: "生效时间",
}));
const __VLS_708 = __VLS_707({
    label: "生效时间",
}, ...__VLS_functionalComponentArgsRest(__VLS_707));
__VLS_709.slots.default;
const __VLS_710 = {}.ElSwitch;
/** @type {[typeof __VLS_components.ElSwitch, typeof __VLS_components.elSwitch, ]} */ ;
// @ts-ignore
const __VLS_711 = __VLS_asFunctionalComponent(__VLS_710, new __VLS_710({
    modelValue: (__VLS_ctx.form.immediate),
    activeText: "立即生效",
    inactiveText: "指定日期",
}));
const __VLS_712 = __VLS_711({
    modelValue: (__VLS_ctx.form.immediate),
    activeText: "立即生效",
    inactiveText: "指定日期",
}, ...__VLS_functionalComponentArgsRest(__VLS_711));
var __VLS_709;
var __VLS_705;
const __VLS_714 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_715 = __VLS_asFunctionalComponent(__VLS_714, new __VLS_714({
    span: (12),
}));
const __VLS_716 = __VLS_715({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_715));
__VLS_717.slots.default;
if (!__VLS_ctx.form.immediate) {
    const __VLS_718 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_719 = __VLS_asFunctionalComponent(__VLS_718, new __VLS_718({
        label: "生效日期",
        prop: "effectiveDate",
    }));
    const __VLS_720 = __VLS_719({
        label: "生效日期",
        prop: "effectiveDate",
    }, ...__VLS_functionalComponentArgsRest(__VLS_719));
    __VLS_721.slots.default;
    const __VLS_722 = {}.ElDatePicker;
    /** @type {[typeof __VLS_components.ElDatePicker, typeof __VLS_components.elDatePicker, ]} */ ;
    // @ts-ignore
    const __VLS_723 = __VLS_asFunctionalComponent(__VLS_722, new __VLS_722({
        modelValue: (__VLS_ctx.form.effectiveDate),
        type: "date",
        valueFormat: "YYYY-MM-DD",
        ...{ class: "w-full" },
    }));
    const __VLS_724 = __VLS_723({
        modelValue: (__VLS_ctx.form.effectiveDate),
        type: "date",
        valueFormat: "YYYY-MM-DD",
        ...{ class: "w-full" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_723));
    var __VLS_721;
}
var __VLS_717;
var __VLS_701;
const __VLS_726 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_727 = __VLS_asFunctionalComponent(__VLS_726, new __VLS_726({
    label: "备注",
}));
const __VLS_728 = __VLS_727({
    label: "备注",
}, ...__VLS_functionalComponentArgsRest(__VLS_727));
__VLS_729.slots.default;
const __VLS_730 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_731 = __VLS_asFunctionalComponent(__VLS_730, new __VLS_730({
    modelValue: (__VLS_ctx.form.remark),
    type: "textarea",
    rows: (2),
    placeholder: "审批备注 / 变更说明",
    maxlength: "200",
    showWordLimit: true,
}));
const __VLS_732 = __VLS_731({
    modelValue: (__VLS_ctx.form.remark),
    type: "textarea",
    rows: (2),
    placeholder: "审批备注 / 变更说明",
    maxlength: "200",
    showWordLimit: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_731));
var __VLS_729;
var __VLS_407;
{
    const { footer: __VLS_thisSlot } = __VLS_403.slots;
    const __VLS_734 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_735 = __VLS_asFunctionalComponent(__VLS_734, new __VLS_734({
        ...{ 'onClick': {} },
    }));
    const __VLS_736 = __VLS_735({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_735));
    let __VLS_738;
    let __VLS_739;
    let __VLS_740;
    const __VLS_741 = {
        onClick: (...[$event]) => {
            __VLS_ctx.editorVisible = false;
        }
    };
    __VLS_737.slots.default;
    var __VLS_737;
    const __VLS_742 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_743 = __VLS_asFunctionalComponent(__VLS_742, new __VLS_742({
        ...{ 'onClick': {} },
    }));
    const __VLS_744 = __VLS_743({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_743));
    let __VLS_746;
    let __VLS_747;
    let __VLS_748;
    const __VLS_749 = {
        onClick: (__VLS_ctx.saveAsDraft)
    };
    __VLS_745.slots.default;
    var __VLS_745;
    const __VLS_750 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_751 = __VLS_asFunctionalComponent(__VLS_750, new __VLS_750({
        ...{ 'onClick': {} },
        type: "danger",
    }));
    const __VLS_752 = __VLS_751({
        ...{ 'onClick': {} },
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_751));
    let __VLS_754;
    let __VLS_755;
    let __VLS_756;
    const __VLS_757 = {
        onClick: (__VLS_ctx.submitMaskingForm)
    };
    __VLS_753.slots.default;
    var __VLS_753;
}
var __VLS_403;
const __VLS_758 = {}.ElDrawer;
/** @type {[typeof __VLS_components.ElDrawer, typeof __VLS_components.elDrawer, typeof __VLS_components.ElDrawer, typeof __VLS_components.elDrawer, ]} */ ;
// @ts-ignore
const __VLS_759 = __VLS_asFunctionalComponent(__VLS_758, new __VLS_758({
    modelValue: (__VLS_ctx.keyDrawerVisible),
    title: "创建密钥",
    size: "460px",
}));
const __VLS_760 = __VLS_759({
    modelValue: (__VLS_ctx.keyDrawerVisible),
    title: "创建密钥",
    size: "460px",
}, ...__VLS_functionalComponentArgsRest(__VLS_759));
__VLS_761.slots.default;
const __VLS_762 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_763 = __VLS_asFunctionalComponent(__VLS_762, new __VLS_762({
    model: (__VLS_ctx.keyForm),
    labelWidth: "92px",
}));
const __VLS_764 = __VLS_763({
    model: (__VLS_ctx.keyForm),
    labelWidth: "92px",
}, ...__VLS_functionalComponentArgsRest(__VLS_763));
__VLS_765.slots.default;
const __VLS_766 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_767 = __VLS_asFunctionalComponent(__VLS_766, new __VLS_766({
    label: "密钥名称",
}));
const __VLS_768 = __VLS_767({
    label: "密钥名称",
}, ...__VLS_functionalComponentArgsRest(__VLS_767));
__VLS_769.slots.default;
const __VLS_770 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_771 = __VLS_asFunctionalComponent(__VLS_770, new __VLS_770({
    modelValue: (__VLS_ctx.keyForm.name),
    placeholder: "如：数据交换密钥",
}));
const __VLS_772 = __VLS_771({
    modelValue: (__VLS_ctx.keyForm.name),
    placeholder: "如：数据交换密钥",
}, ...__VLS_functionalComponentArgsRest(__VLS_771));
var __VLS_769;
const __VLS_774 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_775 = __VLS_asFunctionalComponent(__VLS_774, new __VLS_774({
    label: "加密算法",
}));
const __VLS_776 = __VLS_775({
    label: "加密算法",
}, ...__VLS_functionalComponentArgsRest(__VLS_775));
__VLS_777.slots.default;
const __VLS_778 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_779 = __VLS_asFunctionalComponent(__VLS_778, new __VLS_778({
    modelValue: (__VLS_ctx.keyForm.algorithm),
    ...{ class: "w-full" },
}));
const __VLS_780 = __VLS_779({
    modelValue: (__VLS_ctx.keyForm.algorithm),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_779));
__VLS_781.slots.default;
const __VLS_782 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_783 = __VLS_asFunctionalComponent(__VLS_782, new __VLS_782({
    label: "SM4（国密）",
    value: "SM4",
}));
const __VLS_784 = __VLS_783({
    label: "SM4（国密）",
    value: "SM4",
}, ...__VLS_functionalComponentArgsRest(__VLS_783));
const __VLS_786 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_787 = __VLS_asFunctionalComponent(__VLS_786, new __VLS_786({
    label: "AES-256",
    value: "AES-256",
}));
const __VLS_788 = __VLS_787({
    label: "AES-256",
    value: "AES-256",
}, ...__VLS_functionalComponentArgsRest(__VLS_787));
const __VLS_790 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_791 = __VLS_asFunctionalComponent(__VLS_790, new __VLS_790({
    label: "HMAC-SHA256",
    value: "HMAC-SHA256",
}));
const __VLS_792 = __VLS_791({
    label: "HMAC-SHA256",
    value: "HMAC-SHA256",
}, ...__VLS_functionalComponentArgsRest(__VLS_791));
const __VLS_794 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_795 = __VLS_asFunctionalComponent(__VLS_794, new __VLS_794({
    label: "RSA-2048",
    value: "RSA-2048",
}));
const __VLS_796 = __VLS_795({
    label: "RSA-2048",
    value: "RSA-2048",
}, ...__VLS_functionalComponentArgsRest(__VLS_795));
var __VLS_781;
var __VLS_777;
const __VLS_798 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_799 = __VLS_asFunctionalComponent(__VLS_798, new __VLS_798({
    label: "密钥用途",
}));
const __VLS_800 = __VLS_799({
    label: "密钥用途",
}, ...__VLS_functionalComponentArgsRest(__VLS_799));
__VLS_801.slots.default;
const __VLS_802 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_803 = __VLS_asFunctionalComponent(__VLS_802, new __VLS_802({
    modelValue: (__VLS_ctx.keyForm.usage),
    ...{ class: "w-full" },
}));
const __VLS_804 = __VLS_803({
    modelValue: (__VLS_ctx.keyForm.usage),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_803));
__VLS_805.slots.default;
const __VLS_806 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_807 = __VLS_asFunctionalComponent(__VLS_806, new __VLS_806({
    label: "存储加密",
    value: "存储加密",
}));
const __VLS_808 = __VLS_807({
    label: "存储加密",
    value: "存储加密",
}, ...__VLS_functionalComponentArgsRest(__VLS_807));
const __VLS_810 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_811 = __VLS_asFunctionalComponent(__VLS_810, new __VLS_810({
    label: "传输会话",
    value: "传输会话",
}));
const __VLS_812 = __VLS_811({
    label: "传输会话",
    value: "传输会话",
}, ...__VLS_functionalComponentArgsRest(__VLS_811));
const __VLS_814 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_815 = __VLS_asFunctionalComponent(__VLS_814, new __VLS_814({
    label: "脱敏签名",
    value: "脱敏签名",
}));
const __VLS_816 = __VLS_815({
    label: "脱敏签名",
    value: "脱敏签名",
}, ...__VLS_functionalComponentArgsRest(__VLS_815));
const __VLS_818 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_819 = __VLS_asFunctionalComponent(__VLS_818, new __VLS_818({
    label: "数据交换",
    value: "数据交换",
}));
const __VLS_820 = __VLS_819({
    label: "数据交换",
    value: "数据交换",
}, ...__VLS_functionalComponentArgsRest(__VLS_819));
var __VLS_805;
var __VLS_801;
const __VLS_822 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_823 = __VLS_asFunctionalComponent(__VLS_822, new __VLS_822({
    label: "轮换周期",
}));
const __VLS_824 = __VLS_823({
    label: "轮换周期",
}, ...__VLS_functionalComponentArgsRest(__VLS_823));
__VLS_825.slots.default;
const __VLS_826 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_827 = __VLS_asFunctionalComponent(__VLS_826, new __VLS_826({
    modelValue: (__VLS_ctx.keyForm.rotateCycle),
    ...{ class: "w-full" },
}));
const __VLS_828 = __VLS_827({
    modelValue: (__VLS_ctx.keyForm.rotateCycle),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_827));
__VLS_829.slots.default;
const __VLS_830 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_831 = __VLS_asFunctionalComponent(__VLS_830, new __VLS_830({
    label: "30 天",
    value: "30 天",
}));
const __VLS_832 = __VLS_831({
    label: "30 天",
    value: "30 天",
}, ...__VLS_functionalComponentArgsRest(__VLS_831));
const __VLS_834 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_835 = __VLS_asFunctionalComponent(__VLS_834, new __VLS_834({
    label: "90 天",
    value: "90 天",
}));
const __VLS_836 = __VLS_835({
    label: "90 天",
    value: "90 天",
}, ...__VLS_functionalComponentArgsRest(__VLS_835));
const __VLS_838 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_839 = __VLS_asFunctionalComponent(__VLS_838, new __VLS_838({
    label: "180 天",
    value: "180 天",
}));
const __VLS_840 = __VLS_839({
    label: "180 天",
    value: "180 天",
}, ...__VLS_functionalComponentArgsRest(__VLS_839));
var __VLS_829;
var __VLS_825;
const __VLS_842 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_843 = __VLS_asFunctionalComponent(__VLS_842, new __VLS_842({
    label: "到期时间",
}));
const __VLS_844 = __VLS_843({
    label: "到期时间",
}, ...__VLS_functionalComponentArgsRest(__VLS_843));
__VLS_845.slots.default;
const __VLS_846 = {}.ElDatePicker;
/** @type {[typeof __VLS_components.ElDatePicker, typeof __VLS_components.elDatePicker, ]} */ ;
// @ts-ignore
const __VLS_847 = __VLS_asFunctionalComponent(__VLS_846, new __VLS_846({
    modelValue: (__VLS_ctx.keyForm.expireAt),
    type: "date",
    valueFormat: "YYYY-MM-DD",
    ...{ class: "w-full" },
    placeholder: "选择到期日期",
}));
const __VLS_848 = __VLS_847({
    modelValue: (__VLS_ctx.keyForm.expireAt),
    type: "date",
    valueFormat: "YYYY-MM-DD",
    ...{ class: "w-full" },
    placeholder: "选择到期日期",
}, ...__VLS_functionalComponentArgsRest(__VLS_847));
var __VLS_845;
const __VLS_850 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_851 = __VLS_asFunctionalComponent(__VLS_850, new __VLS_850({
    label: "描述",
}));
const __VLS_852 = __VLS_851({
    label: "描述",
}, ...__VLS_functionalComponentArgsRest(__VLS_851));
__VLS_853.slots.default;
const __VLS_854 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_855 = __VLS_asFunctionalComponent(__VLS_854, new __VLS_854({
    modelValue: (__VLS_ctx.keyForm.desc),
    type: "textarea",
    rows: (2),
}));
const __VLS_856 = __VLS_855({
    modelValue: (__VLS_ctx.keyForm.desc),
    type: "textarea",
    rows: (2),
}, ...__VLS_functionalComponentArgsRest(__VLS_855));
var __VLS_853;
var __VLS_765;
{
    const { footer: __VLS_thisSlot } = __VLS_761.slots;
    const __VLS_858 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_859 = __VLS_asFunctionalComponent(__VLS_858, new __VLS_858({
        ...{ 'onClick': {} },
    }));
    const __VLS_860 = __VLS_859({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_859));
    let __VLS_862;
    let __VLS_863;
    let __VLS_864;
    const __VLS_865 = {
        onClick: (...[$event]) => {
            __VLS_ctx.keyDrawerVisible = false;
        }
    };
    __VLS_861.slots.default;
    var __VLS_861;
    const __VLS_866 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_867 = __VLS_asFunctionalComponent(__VLS_866, new __VLS_866({
        ...{ 'onClick': {} },
        type: "danger",
    }));
    const __VLS_868 = __VLS_867({
        ...{ 'onClick': {} },
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_867));
    let __VLS_870;
    let __VLS_871;
    let __VLS_872;
    const __VLS_873 = {
        onClick: (__VLS_ctx.saveKey)
    };
    __VLS_869.slots.default;
    var __VLS_869;
}
var __VLS_761;
/** @type {__VLS_StyleScopedClasses['standard-page']} */ ;
/** @type {__VLS_StyleScopedClasses['encrypt-page']} */ ;
/** @type {__VLS_StyleScopedClasses['encrypt-tabs-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['encrypt-pane']} */ ;
/** @type {__VLS_StyleScopedClasses['encrypt-stats']} */ ;
/** @type {__VLS_StyleScopedClasses['encrypt-stat']} */ ;
/** @type {__VLS_StyleScopedClasses['encrypt-stat-value']} */ ;
/** @type {__VLS_StyleScopedClasses['encrypt-stat-label']} */ ;
/** @type {__VLS_StyleScopedClasses['encrypt-rows']} */ ;
/** @type {__VLS_StyleScopedClasses['encrypt-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['transport-form']} */ ;
/** @type {__VLS_StyleScopedClasses['tf-item']} */ ;
/** @type {__VLS_StyleScopedClasses['tf-label']} */ ;
/** @type {__VLS_StyleScopedClasses['tf-tip']} */ ;
/** @type {__VLS_StyleScopedClasses['tf-item']} */ ;
/** @type {__VLS_StyleScopedClasses['tf-label']} */ ;
/** @type {__VLS_StyleScopedClasses['tf-select']} */ ;
/** @type {__VLS_StyleScopedClasses['tf-tip']} */ ;
/** @type {__VLS_StyleScopedClasses['tf-item']} */ ;
/** @type {__VLS_StyleScopedClasses['tf-label']} */ ;
/** @type {__VLS_StyleScopedClasses['tf-select']} */ ;
/** @type {__VLS_StyleScopedClasses['tf-item']} */ ;
/** @type {__VLS_StyleScopedClasses['tf-label']} */ ;
/** @type {__VLS_StyleScopedClasses['tf-tip']} */ ;
/** @type {__VLS_StyleScopedClasses['tf-item']} */ ;
/** @type {__VLS_StyleScopedClasses['tf-label']} */ ;
/** @type {__VLS_StyleScopedClasses['tf-select']} */ ;
/** @type {__VLS_StyleScopedClasses['tf-item']} */ ;
/** @type {__VLS_StyleScopedClasses['tf-label']} */ ;
/** @type {__VLS_StyleScopedClasses['tf-tip']} */ ;
/** @type {__VLS_StyleScopedClasses['block-title']} */ ;
/** @type {__VLS_StyleScopedClasses['channel-list']} */ ;
/** @type {__VLS_StyleScopedClasses['channel-item']} */ ;
/** @type {__VLS_StyleScopedClasses['channel-name']} */ ;
/** @type {__VLS_StyleScopedClasses['channel-protocol']} */ ;
/** @type {__VLS_StyleScopedClasses['block-title']} */ ;
/** @type {__VLS_StyleScopedClasses['encrypt-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['life-policy']} */ ;
/** @type {__VLS_StyleScopedClasses['lp-item']} */ ;
/** @type {__VLS_StyleScopedClasses['lp-label']} */ ;
/** @type {__VLS_StyleScopedClasses['tf-tip']} */ ;
/** @type {__VLS_StyleScopedClasses['lp-item']} */ ;
/** @type {__VLS_StyleScopedClasses['lp-label']} */ ;
/** @type {__VLS_StyleScopedClasses['tf-select']} */ ;
/** @type {__VLS_StyleScopedClasses['lp-item']} */ ;
/** @type {__VLS_StyleScopedClasses['lp-label']} */ ;
/** @type {__VLS_StyleScopedClasses['lp-number']} */ ;
/** @type {__VLS_StyleScopedClasses['tf-tip']} */ ;
/** @type {__VLS_StyleScopedClasses['lp-item']} */ ;
/** @type {__VLS_StyleScopedClasses['lp-label']} */ ;
/** @type {__VLS_StyleScopedClasses['tf-select']} */ ;
/** @type {__VLS_StyleScopedClasses['lp-item']} */ ;
/** @type {__VLS_StyleScopedClasses['lp-label']} */ ;
/** @type {__VLS_StyleScopedClasses['tf-tip']} */ ;
/** @type {__VLS_StyleScopedClasses['block-title']} */ ;
/** @type {__VLS_StyleScopedClasses['key-name-cell']} */ ;
/** @type {__VLS_StyleScopedClasses['key-ic']} */ ;
/** @type {__VLS_StyleScopedClasses['mask-pane']} */ ;
/** @type {__VLS_StyleScopedClasses['mask-toolbar']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['toolbar-row']} */ ;
/** @type {__VLS_StyleScopedClasses['search-input']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-select']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-select']} */ ;
/** @type {__VLS_StyleScopedClasses['dep-text']} */ ;
/** @type {__VLS_StyleScopedClasses['mask-sample-before']} */ ;
/** @type {__VLS_StyleScopedClasses['dep-text']} */ ;
/** @type {__VLS_StyleScopedClasses['mask-sample-after']} */ ;
/** @type {__VLS_StyleScopedClasses['pager']} */ ;
/** @type {__VLS_StyleScopedClasses['mask-rule-dialog']} */ ;
/** @type {__VLS_StyleScopedClasses['rule-section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['rule-section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mask-preview']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-before']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-arrow']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['dep-text']} */ ;
/** @type {__VLS_StyleScopedClasses['tf-tip']} */ ;
/** @type {__VLS_StyleScopedClasses['rule-section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
// @ts-ignore
var __VLS_409 = __VLS_408;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            CircleCheck: CircleCheck,
            Key: Key,
            Plus1: Plus1,
            Right: Right,
            Search: Search,
            activeTab: activeTab,
            transport: transport,
            channels: channels,
            certificates: certificates,
            lifePolicy: lifePolicy,
            keys: keys,
            encryptStats: encryptStats,
            runSecurityCheck: runSecurityCheck,
            manageCert: manageCert,
            renewCert: renewCert,
            certDetail: certDetail,
            enableChannel: enableChannel,
            rotateKey: rotateKey,
            destroyKey: destroyKey,
            keyDrawerVisible: keyDrawerVisible,
            keyForm: keyForm,
            openKeyDrawer: openKeyDrawer,
            saveKey: saveKey,
            keyword: keyword,
            filterMethod: filterMethod,
            filterStatus: filterStatus,
            currentPage: currentPage,
            pageSize: pageSize,
            editorVisible: editorVisible,
            editing: editing,
            formRef: formRef,
            tablePool: tablePool,
            rolePool: rolePool,
            fieldsOfTable: fieldsOfTable,
            methodTagType: methodTagType,
            ruleStatusTag: ruleStatusTag,
            previewSample: previewSample,
            previewText: previewText,
            form: form,
            filteredRules: filteredRules,
            pagedRules: pagedRules,
            changePage: changePage,
            formRules: formRules,
            openCreate: openCreate,
            openEdit: openEdit,
            submitMaskingForm: submitMaskingForm,
            saveAsDraft: saveAsDraft,
            versionHistory: versionHistory,
            onlineRule: onlineRule,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
