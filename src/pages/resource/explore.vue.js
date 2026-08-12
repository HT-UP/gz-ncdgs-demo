import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { DataLine, Plus, Search, TrendCharts } from '@element-plus/icons-vue';
import { mockExploreTasks } from '@/mock/resource';
import * as echarts from 'echarts';
const statusTagType = {
    运行中: 'warning',
    成功: 'success',
    失败: 'danger',
    待执行: 'warning',
};
const keyword = ref('');
const filterTrigger = ref('');
const filterStatus = ref('');
const createVisible = ref(false);
const resultVisible = ref(false);
const logVisible = ref(false);
const templatesVisible = ref(false);
const logTaskName = ref('');
const tasks = ref([...mockExploreTasks]);
const templates = [
    { name: '字段特征探查模板', desc: '识别语义类型 / 字段角色', icon: DataLine, version: 'V2.3' },
    { name: '数据分布探查模板', desc: '分布形状 / 极值监控', icon: TrendCharts, version: 'V1.8' },
    { name: '异常模式探查模板', desc: '离群点 / 突变检测', icon: Search, version: 'V3.1' },
];
const templateVersions = [
    { name: '字段特征探查模板', version: 'V2.3', updateTime: '2026-08-01', updater: '张三' },
    { name: '字段特征探查模板', version: 'V2.2', updateTime: '2026-06-15', updater: '李四' },
    { name: '异常模式探查模板', version: 'V3.1', updateTime: '2026-07-20', updater: '王五' },
    { name: '数据分布探查模板', version: 'V1.8', updateTime: '2026-05-30', updater: '张三' },
];
const createForm = reactive({
    name: '',
    target: 'ticket_sale_detail',
    type: '字段特征',
    trigger: '手动触发',
});
const trendChartRef = ref();
const resultChartRef = ref();
let trendChart = null;
let resultChart = null;
const resultRows = [
    { field: 'cust_name', type: '姓名', confidence: '96%', sample: '张三' },
    { field: 'phone_no', type: '手机号', confidence: '93%', sample: '138****1234' },
    { field: 'id_card_no', type: '身份证号码', confidence: '97%', sample: '4401**********1234' },
    { field: 'amount_num', type: '金额', confidence: '88%', sample: '12.50' },
];
const historyCompare = [
    { run: '2026-08-12 10:00', count: 386, avgConfidence: '91.2%', anomalies: '2 个突增模式' },
    { run: '2026-08-05 10:00', count: 374, avgConfidence: '90.5%', anomalies: '1 个离群点' },
    { run: '2026-07-29 10:00', count: 362, avgConfidence: '89.8%', anomalies: '无异常' },
];
const logContent = `2026-08-12 10:00:01 [INFO] 探查任务启动（手动触发）
2026-08-12 10:00:12 [INFO] 读取字段元数据 386 个
2026-08-12 10:00:40 [INFO] 字段特征识别完成，语义标注 312 个
2026-08-12 10:01:05 [INFO] 数据分布采样 50 万行
2026-08-12 10:01:48 [WARN] 发现 2 个突增模式（flow_count 08-11 03:00）
2026-08-12 10:02:10 [INFO] 写入特征标签，生成识别报告`;
const filteredTasks = computed(() => tasks.value.filter((task) => {
    if (filterTrigger.value && task.trigger !== filterTrigger.value)
        return false;
    if (filterStatus.value && task.status !== filterStatus.value)
        return false;
    if (!keyword.value)
        return true;
    const kw = keyword.value.toLowerCase();
    return task.name.toLowerCase().includes(kw) || task.owner.toLowerCase().includes(kw);
}));
const openCreate = () => {
    Object.assign(createForm, { name: '', target: 'ticket_sale_detail', type: '字段特征', trigger: '手动触发' });
    createVisible.value = true;
};
const saveCreate = () => {
    if (!createForm.name.trim()) {
        ElMessage.warning('请输入任务名称');
        return;
    }
    tasks.value.unshift({
        id: `ex-mock-${Date.now()}`,
        name: createForm.name,
        target: createForm.target,
        type: createForm.type,
        trigger: createForm.trigger,
        status: '待执行',
        progress: 0,
        lastRun: '-',
        owner: '张三',
        result: '尚未执行',
    });
    createVisible.value = false;
    ElMessage.success('探查任务已创建（Mock）');
};
const showResult = (_row) => {
    resultVisible.value = true;
    renderResultChart();
};
const showLog = (row) => {
    logTaskName.value = row.name;
    logVisible.value = true;
};
const run = (row) => {
    row.status = '运行中';
    row.progress = 30;
    ElMessage.success(`探查任务「${row.name}」已触发（Mock）`);
};
const useTemplate = (template) => {
    createForm.name = template.name;
    createForm.type = template.name.replace('探查模板', '');
    ElMessage.success(`已套用模板「${template.name}」（${template.version}）`);
};
const openTemplates = () => {
    templatesVisible.value = true;
};
const renderTrend = () => {
    if (!trendChartRef.value)
        return;
    trendChart?.dispose();
    trendChart = echarts.init(trendChartRef.value);
    const dates = Array.from({ length: 12 }, (_, i) => `${String(i + 1).padStart(2, '0')}/01`);
    trendChart.setOption({
        tooltip: { trigger: 'axis' },
        grid: { left: 35, right: 12, top: 24, bottom: 24 },
        xAxis: { type: 'category', data: dates, axisLabel: { fontSize: 10 } },
        yAxis: { type: 'value', splitLine: { lineStyle: { type: 'dashed', color: '#E4E7ED' } } },
        series: [
            {
                name: '探查任务数',
                type: 'line',
                smooth: true,
                data: [6, 9, 12, 10, 15, 14, 18, 22, 24, 26, 30, 35],
                lineStyle: { color: '#DA251D', width: 3 },
                itemStyle: { color: '#DA251D' },
                areaStyle: { color: 'rgba(218,37,29,0.08)' },
                symbolSize: 5,
            },
        ],
    });
};
const renderResultChart = () => {
    if (!resultChartRef.value)
        return;
    resultChart?.dispose();
    resultChart = echarts.init(resultChartRef.value);
    resultChart.setOption({
        tooltip: { trigger: 'axis' },
        grid: { left: 32, right: 10, top: 24, bottom: 24 },
        xAxis: { type: 'category', data: ['姓名', '手机号', '身份证', '金额'] },
        yAxis: { type: 'value', max: 100, splitLine: { lineStyle: { type: 'dashed', color: '#E4E7ED' } } },
        series: [
            {
                type: 'bar',
                barWidth: 22,
                data: [
                    { value: 96, itemStyle: { color: '#DA251D' } },
                    { value: 93, itemStyle: { color: '#2B6CB0' } },
                    { value: 97, itemStyle: { color: '#00A854' } },
                    { value: 88, itemStyle: { color: '#ED7B2F' } },
                ],
            },
        ],
    });
};
const handleResize = () => {
    trendChart?.resize();
    resultChart?.resize();
};
onMounted(() => {
    renderTrend();
    window.addEventListener('resize', handleResize);
});
onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize);
    trendChart?.dispose();
    resultChart?.dispose();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "standard-page" },
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
    ...{ class: "panel-card dashboard-card" },
    shadow: "never",
}));
const __VLS_10 = __VLS_9({
    ...{ class: "panel-card dashboard-card" },
    shadow: "never",
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
__VLS_11.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_11.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    const __VLS_12 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
        ...{ 'onClick': {} },
        type: "danger",
        icon: (__VLS_ctx.Plus),
    }));
    const __VLS_14 = __VLS_13({
        ...{ 'onClick': {} },
        type: "danger",
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
    modelValue: (__VLS_ctx.keyword),
    placeholder: "按任务名称 / 负责人搜索",
    clearable: true,
    ...{ class: "search-input" },
    prefixIcon: (__VLS_ctx.Search),
}));
const __VLS_22 = __VLS_21({
    modelValue: (__VLS_ctx.keyword),
    placeholder: "按任务名称 / 负责人搜索",
    clearable: true,
    ...{ class: "search-input" },
    prefixIcon: (__VLS_ctx.Search),
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
const __VLS_24 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    modelValue: (__VLS_ctx.filterTrigger),
    placeholder: "触发方式",
    clearable: true,
    ...{ class: "filter-select" },
}));
const __VLS_26 = __VLS_25({
    modelValue: (__VLS_ctx.filterTrigger),
    placeholder: "触发方式",
    clearable: true,
    ...{ class: "filter-select" },
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
__VLS_27.slots.default;
const __VLS_28 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
    label: "手动触发",
    value: "手动触发",
}));
const __VLS_30 = __VLS_29({
    label: "手动触发",
    value: "手动触发",
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
const __VLS_32 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
    label: "定时调度",
    value: "定时调度",
}));
const __VLS_34 = __VLS_33({
    label: "定时调度",
    value: "定时调度",
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
const __VLS_36 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    label: "事件触发",
    value: "事件触发",
}));
const __VLS_38 = __VLS_37({
    label: "事件触发",
    value: "事件触发",
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
var __VLS_27;
const __VLS_40 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
    modelValue: (__VLS_ctx.filterStatus),
    placeholder: "状态",
    clearable: true,
    ...{ class: "filter-select" },
}));
const __VLS_42 = __VLS_41({
    modelValue: (__VLS_ctx.filterStatus),
    placeholder: "状态",
    clearable: true,
    ...{ class: "filter-select" },
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
__VLS_43.slots.default;
const __VLS_44 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    label: "运行中",
    value: "运行中",
}));
const __VLS_46 = __VLS_45({
    label: "运行中",
    value: "运行中",
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
const __VLS_48 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
    label: "成功",
    value: "成功",
}));
const __VLS_50 = __VLS_49({
    label: "成功",
    value: "成功",
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
const __VLS_52 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
    label: "失败",
    value: "失败",
}));
const __VLS_54 = __VLS_53({
    label: "失败",
    value: "失败",
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
const __VLS_56 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
    label: "待执行",
    value: "待执行",
}));
const __VLS_58 = __VLS_57({
    label: "待执行",
    value: "待执行",
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
var __VLS_43;
const __VLS_60 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
    data: (__VLS_ctx.filteredTasks),
    stripe: true,
    ...{ class: "mt-12" },
}));
const __VLS_62 = __VLS_61({
    data: (__VLS_ctx.filteredTasks),
    stripe: true,
    ...{ class: "mt-12" },
}, ...__VLS_functionalComponentArgsRest(__VLS_61));
__VLS_63.slots.default;
const __VLS_64 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
    prop: "name",
    label: "任务名称",
    minWidth: "160",
}));
const __VLS_66 = __VLS_65({
    prop: "name",
    label: "任务名称",
    minWidth: "160",
}, ...__VLS_functionalComponentArgsRest(__VLS_65));
const __VLS_68 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
    prop: "target",
    label: "探查对象",
    width: "140",
}));
const __VLS_70 = __VLS_69({
    prop: "target",
    label: "探查对象",
    width: "140",
}, ...__VLS_functionalComponentArgsRest(__VLS_69));
const __VLS_72 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
    prop: "type",
    label: "探查类型",
    width: "100",
}));
const __VLS_74 = __VLS_73({
    prop: "type",
    label: "探查类型",
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_73));
__VLS_75.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_75.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_76 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
        effect: "plain",
        type: "danger",
    }));
    const __VLS_78 = __VLS_77({
        effect: "plain",
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_77));
    __VLS_79.slots.default;
    (row.type);
    var __VLS_79;
}
var __VLS_75;
const __VLS_80 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
    label: "触发方式",
    width: "100",
}));
const __VLS_82 = __VLS_81({
    label: "触发方式",
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_81));
__VLS_83.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_83.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    (row.trigger);
}
var __VLS_83;
const __VLS_84 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
    label: "状态",
    width: "90",
}));
const __VLS_86 = __VLS_85({
    label: "状态",
    width: "90",
}, ...__VLS_functionalComponentArgsRest(__VLS_85));
__VLS_87.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_87.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_88 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
        type: (__VLS_ctx.statusTagType[row.status]),
        effect: "dark",
    }));
    const __VLS_90 = __VLS_89({
        type: (__VLS_ctx.statusTagType[row.status]),
        effect: "dark",
    }, ...__VLS_functionalComponentArgsRest(__VLS_89));
    __VLS_91.slots.default;
    (row.status);
    var __VLS_91;
}
var __VLS_87;
const __VLS_92 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
    label: "进度",
    minWidth: "120",
}));
const __VLS_94 = __VLS_93({
    label: "进度",
    minWidth: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_93));
__VLS_95.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_95.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_96 = {}.ElProgress;
    /** @type {[typeof __VLS_components.ElProgress, typeof __VLS_components.elProgress, ]} */ ;
    // @ts-ignore
    const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
        percentage: (row.progress),
        strokeWidth: (9),
    }));
    const __VLS_98 = __VLS_97({
        percentage: (row.progress),
        strokeWidth: (9),
    }, ...__VLS_functionalComponentArgsRest(__VLS_97));
}
var __VLS_95;
const __VLS_100 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
    label: "结果",
    minWidth: "150",
}));
const __VLS_102 = __VLS_101({
    label: "结果",
    minWidth: "150",
}, ...__VLS_functionalComponentArgsRest(__VLS_101));
__VLS_103.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_103.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "dep-text" },
    });
    (row.result);
}
var __VLS_103;
const __VLS_104 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
    label: "操作",
    width: "180",
    fixed: "right",
}));
const __VLS_106 = __VLS_105({
    label: "操作",
    width: "180",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_105));
__VLS_107.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_107.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_108 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }));
    const __VLS_110 = __VLS_109({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_109));
    let __VLS_112;
    let __VLS_113;
    let __VLS_114;
    const __VLS_115 = {
        onClick: (...[$event]) => {
            __VLS_ctx.showResult(row);
        }
    };
    __VLS_111.slots.default;
    var __VLS_111;
    const __VLS_116 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
        ...{ 'onClick': {} },
        link: true,
        type: "warning",
    }));
    const __VLS_118 = __VLS_117({
        ...{ 'onClick': {} },
        link: true,
        type: "warning",
    }, ...__VLS_functionalComponentArgsRest(__VLS_117));
    let __VLS_120;
    let __VLS_121;
    let __VLS_122;
    const __VLS_123 = {
        onClick: (...[$event]) => {
            __VLS_ctx.showLog(row);
        }
    };
    __VLS_119.slots.default;
    var __VLS_119;
    const __VLS_124 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({
        ...{ 'onClick': {} },
        link: true,
        type: "danger",
    }));
    const __VLS_126 = __VLS_125({
        ...{ 'onClick': {} },
        link: true,
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_125));
    let __VLS_128;
    let __VLS_129;
    let __VLS_130;
    const __VLS_131 = {
        onClick: (...[$event]) => {
            __VLS_ctx.run(row);
        }
    };
    __VLS_127.slots.default;
    var __VLS_127;
}
var __VLS_107;
var __VLS_63;
const __VLS_132 = {}.ElPagination;
/** @type {[typeof __VLS_components.ElPagination, typeof __VLS_components.elPagination, ]} */ ;
// @ts-ignore
const __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132({
    ...{ class: "pager" },
    layout: "total, prev, pager, next",
    total: (__VLS_ctx.filteredTasks.length),
    pageSize: (20),
    background: true,
}));
const __VLS_134 = __VLS_133({
    ...{ class: "pager" },
    layout: "total, prev, pager, next",
    total: (__VLS_ctx.filteredTasks.length),
    pageSize: (20),
    background: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_133));
var __VLS_11;
var __VLS_7;
const __VLS_136 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_137 = __VLS_asFunctionalComponent(__VLS_136, new __VLS_136({
    span: (8),
}));
const __VLS_138 = __VLS_137({
    span: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_137));
__VLS_139.slots.default;
const __VLS_140 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_141 = __VLS_asFunctionalComponent(__VLS_140, new __VLS_140({
    ...{ class: "panel-card dashboard-card" },
    shadow: "never",
}));
const __VLS_142 = __VLS_141({
    ...{ class: "panel-card dashboard-card" },
    shadow: "never",
}, ...__VLS_functionalComponentArgsRest(__VLS_141));
__VLS_143.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_143.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
}
for (const [template] of __VLS_getVForSourceType((__VLS_ctx.templates))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.useTemplate(template);
            } },
        key: (template.name),
        ...{ class: "template-item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "template-icon" },
    });
    const __VLS_144 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_145 = __VLS_asFunctionalComponent(__VLS_144, new __VLS_144({
        size: (18),
    }));
    const __VLS_146 = __VLS_145({
        size: (18),
    }, ...__VLS_functionalComponentArgsRest(__VLS_145));
    __VLS_147.slots.default;
    const __VLS_148 = ((template.icon));
    // @ts-ignore
    const __VLS_149 = __VLS_asFunctionalComponent(__VLS_148, new __VLS_148({}));
    const __VLS_150 = __VLS_149({}, ...__VLS_functionalComponentArgsRest(__VLS_149));
    var __VLS_147;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "template-info" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "template-name" },
    });
    (template.name);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "template-desc" },
    });
    (template.desc);
    const __VLS_152 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_153 = __VLS_asFunctionalComponent(__VLS_152, new __VLS_152({
        size: "small",
        type: "danger",
        effect: "plain",
        ...{ class: "template-version" },
    }));
    const __VLS_154 = __VLS_153({
        size: "small",
        type: "danger",
        effect: "plain",
        ...{ class: "template-version" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_153));
    __VLS_155.slots.default;
    (template.version);
    var __VLS_155;
}
const __VLS_156 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_157 = __VLS_asFunctionalComponent(__VLS_156, new __VLS_156({
    ...{ 'onClick': {} },
    ...{ class: "w-full mt-12" },
    plain: true,
}));
const __VLS_158 = __VLS_157({
    ...{ 'onClick': {} },
    ...{ class: "w-full mt-12" },
    plain: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_157));
let __VLS_160;
let __VLS_161;
let __VLS_162;
const __VLS_163 = {
    onClick: (__VLS_ctx.openTemplates)
};
__VLS_159.slots.default;
var __VLS_159;
var __VLS_143;
const __VLS_164 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_165 = __VLS_asFunctionalComponent(__VLS_164, new __VLS_164({
    ...{ class: "panel-card dashboard-card mt-16" },
    shadow: "never",
}));
const __VLS_166 = __VLS_165({
    ...{ class: "panel-card dashboard-card mt-16" },
    shadow: "never",
}, ...__VLS_functionalComponentArgsRest(__VLS_165));
__VLS_167.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_167.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ref: "trendChartRef",
    ...{ class: "chart-box-trend" },
});
/** @type {typeof __VLS_ctx.trendChartRef} */ ;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "threshold-box" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "section-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "dep-text" },
});
var __VLS_167;
var __VLS_139;
var __VLS_3;
const __VLS_168 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_169 = __VLS_asFunctionalComponent(__VLS_168, new __VLS_168({
    modelValue: (__VLS_ctx.createVisible),
    title: "新建探查任务",
    width: "580px",
}));
const __VLS_170 = __VLS_169({
    modelValue: (__VLS_ctx.createVisible),
    title: "新建探查任务",
    width: "580px",
}, ...__VLS_functionalComponentArgsRest(__VLS_169));
__VLS_171.slots.default;
const __VLS_172 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_173 = __VLS_asFunctionalComponent(__VLS_172, new __VLS_172({
    model: (__VLS_ctx.createForm),
    labelWidth: "100px",
}));
const __VLS_174 = __VLS_173({
    model: (__VLS_ctx.createForm),
    labelWidth: "100px",
}, ...__VLS_functionalComponentArgsRest(__VLS_173));
__VLS_175.slots.default;
const __VLS_176 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_177 = __VLS_asFunctionalComponent(__VLS_176, new __VLS_176({
    label: "任务名称",
}));
const __VLS_178 = __VLS_177({
    label: "任务名称",
}, ...__VLS_functionalComponentArgsRest(__VLS_177));
__VLS_179.slots.default;
const __VLS_180 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_181 = __VLS_asFunctionalComponent(__VLS_180, new __VLS_180({
    modelValue: (__VLS_ctx.createForm.name),
}));
const __VLS_182 = __VLS_181({
    modelValue: (__VLS_ctx.createForm.name),
}, ...__VLS_functionalComponentArgsRest(__VLS_181));
var __VLS_179;
const __VLS_184 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_185 = __VLS_asFunctionalComponent(__VLS_184, new __VLS_184({
    label: "探查对象",
}));
const __VLS_186 = __VLS_185({
    label: "探查对象",
}, ...__VLS_functionalComponentArgsRest(__VLS_185));
__VLS_187.slots.default;
const __VLS_188 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_189 = __VLS_asFunctionalComponent(__VLS_188, new __VLS_188({
    modelValue: (__VLS_ctx.createForm.target),
    filterable: true,
    ...{ class: "w-full" },
}));
const __VLS_190 = __VLS_189({
    modelValue: (__VLS_ctx.createForm.target),
    filterable: true,
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_189));
__VLS_191.slots.default;
for (const [table] of __VLS_getVForSourceType((['ticket_sale_detail', 'passenger_info', 'flow_stat_daily', 'device_status_log', 'station_info']))) {
    const __VLS_192 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_193 = __VLS_asFunctionalComponent(__VLS_192, new __VLS_192({
        key: (table),
        label: (table),
        value: (table),
    }));
    const __VLS_194 = __VLS_193({
        key: (table),
        label: (table),
        value: (table),
    }, ...__VLS_functionalComponentArgsRest(__VLS_193));
}
var __VLS_191;
var __VLS_187;
const __VLS_196 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_197 = __VLS_asFunctionalComponent(__VLS_196, new __VLS_196({
    label: "探查类型",
}));
const __VLS_198 = __VLS_197({
    label: "探查类型",
}, ...__VLS_functionalComponentArgsRest(__VLS_197));
__VLS_199.slots.default;
const __VLS_200 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_201 = __VLS_asFunctionalComponent(__VLS_200, new __VLS_200({
    modelValue: (__VLS_ctx.createForm.type),
    ...{ class: "w-full" },
}));
const __VLS_202 = __VLS_201({
    modelValue: (__VLS_ctx.createForm.type),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_201));
__VLS_203.slots.default;
for (const [type] of __VLS_getVForSourceType((['字段特征', '数据分布', '异常模式', '周期规律', '业务规则']))) {
    const __VLS_204 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_205 = __VLS_asFunctionalComponent(__VLS_204, new __VLS_204({
        key: (type),
        label: (type),
        value: (type),
    }));
    const __VLS_206 = __VLS_205({
        key: (type),
        label: (type),
        value: (type),
    }, ...__VLS_functionalComponentArgsRest(__VLS_205));
}
var __VLS_203;
var __VLS_199;
const __VLS_208 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_209 = __VLS_asFunctionalComponent(__VLS_208, new __VLS_208({
    label: "触发方式",
}));
const __VLS_210 = __VLS_209({
    label: "触发方式",
}, ...__VLS_functionalComponentArgsRest(__VLS_209));
__VLS_211.slots.default;
const __VLS_212 = {}.ElRadioGroup;
/** @type {[typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, ]} */ ;
// @ts-ignore
const __VLS_213 = __VLS_asFunctionalComponent(__VLS_212, new __VLS_212({
    modelValue: (__VLS_ctx.createForm.trigger),
}));
const __VLS_214 = __VLS_213({
    modelValue: (__VLS_ctx.createForm.trigger),
}, ...__VLS_functionalComponentArgsRest(__VLS_213));
__VLS_215.slots.default;
const __VLS_216 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
const __VLS_217 = __VLS_asFunctionalComponent(__VLS_216, new __VLS_216({
    value: "手动触发",
}));
const __VLS_218 = __VLS_217({
    value: "手动触发",
}, ...__VLS_functionalComponentArgsRest(__VLS_217));
const __VLS_220 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
const __VLS_221 = __VLS_asFunctionalComponent(__VLS_220, new __VLS_220({
    value: "定时调度",
}));
const __VLS_222 = __VLS_221({
    value: "定时调度",
}, ...__VLS_functionalComponentArgsRest(__VLS_221));
const __VLS_224 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
const __VLS_225 = __VLS_asFunctionalComponent(__VLS_224, new __VLS_224({
    value: "事件触发",
}));
const __VLS_226 = __VLS_225({
    value: "事件触发",
}, ...__VLS_functionalComponentArgsRest(__VLS_225));
var __VLS_215;
var __VLS_211;
var __VLS_175;
{
    const { footer: __VLS_thisSlot } = __VLS_171.slots;
    const __VLS_228 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_229 = __VLS_asFunctionalComponent(__VLS_228, new __VLS_228({
        ...{ 'onClick': {} },
    }));
    const __VLS_230 = __VLS_229({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_229));
    let __VLS_232;
    let __VLS_233;
    let __VLS_234;
    const __VLS_235 = {
        onClick: (...[$event]) => {
            __VLS_ctx.createVisible = false;
        }
    };
    __VLS_231.slots.default;
    var __VLS_231;
    const __VLS_236 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_237 = __VLS_asFunctionalComponent(__VLS_236, new __VLS_236({
        ...{ 'onClick': {} },
        type: "danger",
    }));
    const __VLS_238 = __VLS_237({
        ...{ 'onClick': {} },
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_237));
    let __VLS_240;
    let __VLS_241;
    let __VLS_242;
    const __VLS_243 = {
        onClick: (__VLS_ctx.saveCreate)
    };
    __VLS_239.slots.default;
    var __VLS_239;
}
var __VLS_171;
const __VLS_244 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_245 = __VLS_asFunctionalComponent(__VLS_244, new __VLS_244({
    modelValue: (__VLS_ctx.resultVisible),
    title: "探查结果可视化",
    width: "760px",
}));
const __VLS_246 = __VLS_245({
    modelValue: (__VLS_ctx.resultVisible),
    title: "探查结果可视化",
    width: "760px",
}, ...__VLS_functionalComponentArgsRest(__VLS_245));
__VLS_247.slots.default;
const __VLS_248 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
// @ts-ignore
const __VLS_249 = __VLS_asFunctionalComponent(__VLS_248, new __VLS_248({
    gutter: (16),
}));
const __VLS_250 = __VLS_249({
    gutter: (16),
}, ...__VLS_functionalComponentArgsRest(__VLS_249));
__VLS_251.slots.default;
const __VLS_252 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_253 = __VLS_asFunctionalComponent(__VLS_252, new __VLS_252({
    span: (12),
}));
const __VLS_254 = __VLS_253({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_253));
__VLS_255.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ref: "resultChartRef",
    ...{ class: "chart-box" },
});
/** @type {typeof __VLS_ctx.resultChartRef} */ ;
var __VLS_255;
const __VLS_256 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_257 = __VLS_asFunctionalComponent(__VLS_256, new __VLS_256({
    span: (12),
}));
const __VLS_258 = __VLS_257({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_257));
__VLS_259.slots.default;
const __VLS_260 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_261 = __VLS_asFunctionalComponent(__VLS_260, new __VLS_260({
    data: (__VLS_ctx.resultRows),
    size: "small",
    stripe: true,
}));
const __VLS_262 = __VLS_261({
    data: (__VLS_ctx.resultRows),
    size: "small",
    stripe: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_261));
__VLS_263.slots.default;
const __VLS_264 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_265 = __VLS_asFunctionalComponent(__VLS_264, new __VLS_264({
    prop: "field",
    label: "字段",
    width: "90",
}));
const __VLS_266 = __VLS_265({
    prop: "field",
    label: "字段",
    width: "90",
}, ...__VLS_functionalComponentArgsRest(__VLS_265));
const __VLS_268 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_269 = __VLS_asFunctionalComponent(__VLS_268, new __VLS_268({
    prop: "type",
    label: "识别类型",
    width: "90",
}));
const __VLS_270 = __VLS_269({
    prop: "type",
    label: "识别类型",
    width: "90",
}, ...__VLS_functionalComponentArgsRest(__VLS_269));
const __VLS_272 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_273 = __VLS_asFunctionalComponent(__VLS_272, new __VLS_272({
    prop: "confidence",
    label: "置信度",
    width: "70",
}));
const __VLS_274 = __VLS_273({
    prop: "confidence",
    label: "置信度",
    width: "70",
}, ...__VLS_functionalComponentArgsRest(__VLS_273));
const __VLS_276 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_277 = __VLS_asFunctionalComponent(__VLS_276, new __VLS_276({
    prop: "sample",
    label: "样例",
    minWidth: "110",
}));
const __VLS_278 = __VLS_277({
    prop: "sample",
    label: "样例",
    minWidth: "110",
}, ...__VLS_functionalComponentArgsRest(__VLS_277));
var __VLS_263;
var __VLS_259;
var __VLS_251;
const __VLS_280 = {}.ElDivider;
/** @type {[typeof __VLS_components.ElDivider, typeof __VLS_components.elDivider, ]} */ ;
// @ts-ignore
const __VLS_281 = __VLS_asFunctionalComponent(__VLS_280, new __VLS_280({}));
const __VLS_282 = __VLS_281({}, ...__VLS_functionalComponentArgsRest(__VLS_281));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "section-title" },
});
const __VLS_284 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_285 = __VLS_asFunctionalComponent(__VLS_284, new __VLS_284({
    data: (__VLS_ctx.historyCompare),
    size: "small",
    stripe: true,
}));
const __VLS_286 = __VLS_285({
    data: (__VLS_ctx.historyCompare),
    size: "small",
    stripe: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_285));
__VLS_287.slots.default;
const __VLS_288 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_289 = __VLS_asFunctionalComponent(__VLS_288, new __VLS_288({
    prop: "run",
    label: "运行批次",
    width: "110",
}));
const __VLS_290 = __VLS_289({
    prop: "run",
    label: "运行批次",
    width: "110",
}, ...__VLS_functionalComponentArgsRest(__VLS_289));
const __VLS_292 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_293 = __VLS_asFunctionalComponent(__VLS_292, new __VLS_292({
    prop: "count",
    label: "识别字段数",
    width: "90",
}));
const __VLS_294 = __VLS_293({
    prop: "count",
    label: "识别字段数",
    width: "90",
}, ...__VLS_functionalComponentArgsRest(__VLS_293));
const __VLS_296 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_297 = __VLS_asFunctionalComponent(__VLS_296, new __VLS_296({
    prop: "avgConfidence",
    label: "平均置信度",
    width: "100",
}));
const __VLS_298 = __VLS_297({
    prop: "avgConfidence",
    label: "平均置信度",
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_297));
const __VLS_300 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_301 = __VLS_asFunctionalComponent(__VLS_300, new __VLS_300({
    prop: "anomalies",
    label: "异常发现",
    minWidth: "140",
}));
const __VLS_302 = __VLS_301({
    prop: "anomalies",
    label: "异常发现",
    minWidth: "140",
}, ...__VLS_functionalComponentArgsRest(__VLS_301));
var __VLS_287;
var __VLS_247;
const __VLS_304 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_305 = __VLS_asFunctionalComponent(__VLS_304, new __VLS_304({
    modelValue: (__VLS_ctx.logVisible),
    title: (`执行日志：${__VLS_ctx.logTaskName}`),
    width: "640px",
}));
const __VLS_306 = __VLS_305({
    modelValue: (__VLS_ctx.logVisible),
    title: (`执行日志：${__VLS_ctx.logTaskName}`),
    width: "640px",
}, ...__VLS_functionalComponentArgsRest(__VLS_305));
__VLS_307.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.pre, __VLS_intrinsicElements.pre)({
    ...{ class: "ddl-block" },
});
(__VLS_ctx.logContent);
var __VLS_307;
const __VLS_308 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_309 = __VLS_asFunctionalComponent(__VLS_308, new __VLS_308({
    modelValue: (__VLS_ctx.templatesVisible),
    title: "模板版本管理",
    width: "600px",
}));
const __VLS_310 = __VLS_309({
    modelValue: (__VLS_ctx.templatesVisible),
    title: "模板版本管理",
    width: "600px",
}, ...__VLS_functionalComponentArgsRest(__VLS_309));
__VLS_311.slots.default;
const __VLS_312 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_313 = __VLS_asFunctionalComponent(__VLS_312, new __VLS_312({
    data: (__VLS_ctx.templateVersions),
    stripe: true,
    size: "small",
}));
const __VLS_314 = __VLS_313({
    data: (__VLS_ctx.templateVersions),
    stripe: true,
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_313));
__VLS_315.slots.default;
const __VLS_316 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_317 = __VLS_asFunctionalComponent(__VLS_316, new __VLS_316({
    prop: "name",
    label: "模板名称",
    minWidth: "140",
}));
const __VLS_318 = __VLS_317({
    prop: "name",
    label: "模板名称",
    minWidth: "140",
}, ...__VLS_functionalComponentArgsRest(__VLS_317));
const __VLS_320 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_321 = __VLS_asFunctionalComponent(__VLS_320, new __VLS_320({
    prop: "version",
    label: "版本",
    width: "100",
}));
const __VLS_322 = __VLS_321({
    prop: "version",
    label: "版本",
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_321));
const __VLS_324 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_325 = __VLS_asFunctionalComponent(__VLS_324, new __VLS_324({
    prop: "updateTime",
    label: "更新时间",
    width: "150",
}));
const __VLS_326 = __VLS_325({
    prop: "updateTime",
    label: "更新时间",
    width: "150",
}, ...__VLS_functionalComponentArgsRest(__VLS_325));
const __VLS_328 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_329 = __VLS_asFunctionalComponent(__VLS_328, new __VLS_328({
    prop: "updater",
    label: "维护人",
    width: "90",
}));
const __VLS_330 = __VLS_329({
    prop: "updater",
    label: "维护人",
    width: "90",
}, ...__VLS_functionalComponentArgsRest(__VLS_329));
const __VLS_332 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_333 = __VLS_asFunctionalComponent(__VLS_332, new __VLS_332({
    label: "操作",
    width: "140",
}));
const __VLS_334 = __VLS_333({
    label: "操作",
    width: "140",
}, ...__VLS_functionalComponentArgsRest(__VLS_333));
__VLS_335.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_335.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_336 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_337 = __VLS_asFunctionalComponent(__VLS_336, new __VLS_336({
        link: true,
        type: "primary",
    }));
    const __VLS_338 = __VLS_337({
        link: true,
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_337));
    __VLS_339.slots.default;
    var __VLS_339;
    const __VLS_340 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_341 = __VLS_asFunctionalComponent(__VLS_340, new __VLS_340({
        link: true,
        type: "danger",
    }));
    const __VLS_342 = __VLS_341({
        link: true,
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_341));
    __VLS_343.slots.default;
    var __VLS_343;
}
var __VLS_335;
var __VLS_315;
var __VLS_311;
/** @type {__VLS_StyleScopedClasses['standard-page']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['toolbar-row']} */ ;
/** @type {__VLS_StyleScopedClasses['search-input']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-select']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-select']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-12']} */ ;
/** @type {__VLS_StyleScopedClasses['dep-text']} */ ;
/** @type {__VLS_StyleScopedClasses['pager']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['template-item']} */ ;
/** @type {__VLS_StyleScopedClasses['template-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['template-info']} */ ;
/** @type {__VLS_StyleScopedClasses['template-name']} */ ;
/** @type {__VLS_StyleScopedClasses['template-desc']} */ ;
/** @type {__VLS_StyleScopedClasses['template-version']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-12']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-box-trend']} */ ;
/** @type {__VLS_StyleScopedClasses['threshold-box']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['dep-text']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-box']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['ddl-block']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Plus: Plus,
            Search: Search,
            statusTagType: statusTagType,
            keyword: keyword,
            filterTrigger: filterTrigger,
            filterStatus: filterStatus,
            createVisible: createVisible,
            resultVisible: resultVisible,
            logVisible: logVisible,
            templatesVisible: templatesVisible,
            logTaskName: logTaskName,
            templates: templates,
            templateVersions: templateVersions,
            createForm: createForm,
            trendChartRef: trendChartRef,
            resultChartRef: resultChartRef,
            resultRows: resultRows,
            historyCompare: historyCompare,
            logContent: logContent,
            filteredTasks: filteredTasks,
            openCreate: openCreate,
            saveCreate: saveCreate,
            showResult: showResult,
            showLog: showLog,
            run: run,
            useTemplate: useTemplate,
            openTemplates: openTemplates,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
