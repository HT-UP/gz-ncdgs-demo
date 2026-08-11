import { computed, reactive, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Folder, FolderOpened, InfoFilled, Plus } from '@element-plus/icons-vue';
import { mockDataSources } from '@/mock/datasource';
const groups = ref([
    { id: 'g1', name: '客运数据组', description: '客运业务相关数据源', count: 0, users: ['张三', '李四'], readers: ['王五'] },
    { id: 'g2', name: '建设数据组', description: '建设期业务数据源', count: 0, users: ['李四'], readers: ['张三', '赵六'] },
    { id: 'g3', name: '设备数据组', description: '设备设施数据源', count: 0, users: ['王五', '赵六'], readers: [] },
    { id: 'g4', name: '财务数据组', description: '财务资产数据源', count: 0, users: ['孙七'], readers: ['张三'] },
]);
const permissionGroup = ref('g1');
const pendingUser = ref('');
const pendingReader = ref('');
const groupEditorVisible = ref(false);
const editingGroup = ref(null);
const dragId = ref('');
const groupForm = reactive({ name: '', description: '' });
const allUsers = ['张三', '李四', '王五', '赵六', '孙七', '周八'];
const selectedGroup = computed(() => groups.value.find((group) => group.id === permissionGroup.value) ?? groups.value[0]);
const selectedGroupUsers = computed(() => selectedGroup.value.users);
const selectedGroupReaders = computed(() => selectedGroup.value.readers);
const activeGroupSources = computed(() => mockDataSources.filter((item) => item.groupName === selectedGroup.value.name));
const handleDrop = (groupId) => {
    const source = mockDataSources.find((item) => item.id === dragId.value);
    if (!source)
        return;
    const group = groups.value.find((item) => item.id === groupId);
    if (!group)
        return;
    const oldGroup = groups.value.find((item) => item.name === source.groupName);
    source.groupName = group.name;
    if (oldGroup)
        oldGroup.count = mockDataSources.filter((item) => item.groupName === oldGroup.name).length;
    group.count = mockDataSources.filter((item) => item.groupName === group.name).length;
    ElMessage.success(`「${source.name}」已移动到「${group.name}」`);
};
const openCreateGroup = () => {
    editingGroup.value = null;
    Object.assign(groupForm, { name: '', description: '' });
    groupEditorVisible.value = true;
};
const editGroup = (group) => {
    editingGroup.value = group;
    Object.assign(groupForm, { name: group.name, description: group.description });
    groupEditorVisible.value = true;
};
const saveGroup = () => {
    if (!groupForm.name.trim()) {
        ElMessage.warning('请输入分组名称');
        return;
    }
    if (editingGroup.value) {
        editingGroup.value.name = groupForm.name;
        editingGroup.value.description = groupForm.description;
    }
    else {
        groups.value.push({
            id: `g${Date.now()}`,
            name: groupForm.name,
            description: groupForm.description,
            count: 0,
            users: [],
            readers: [],
        });
    }
    groupEditorVisible.value = false;
    ElMessage.success('分组已保存（Mock）');
};
const removeGroup = (group) => {
    ElMessageBox.confirm(`确认删除分组「${group.name}」吗？分组内数据源不会删除。`, '删除确认', { type: 'warning' })
        .then(() => {
        groups.value = groups.value.filter((item) => item.id !== group.id);
        ElMessage.success('分组已删除（Mock）');
    })
        .catch(() => { });
};
const addUser = (user) => {
    if (user && !selectedGroup.value.users.includes(user)) {
        selectedGroup.value.users.push(user);
    }
    pendingUser.value = '';
};
const removeUser = (user) => {
    selectedGroup.value.users = selectedGroup.value.users.filter((item) => item !== user);
};
const addReader = (user) => {
    if (user && !selectedGroup.value.readers.includes(user)) {
        selectedGroup.value.readers.push(user);
    }
    pendingReader.value = '';
};
const removeReader = (user) => {
    selectedGroup.value.readers = selectedGroup.value.readers.filter((item) => item !== user);
};
const savePermission = () => {
    ElMessage.success(`「${selectedGroup.value.name}」授权已保存（Mock）`);
};
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
    xs: (24),
    lg: (9),
}));
const __VLS_6 = __VLS_5({
    xs: (24),
    lg: (9),
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
        onClick: (__VLS_ctx.openCreateGroup)
    };
    __VLS_15.slots.default;
    var __VLS_15;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "group-tree-wrap" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "group-tree-node" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "group-tree-title" },
});
const __VLS_20 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
    size: (16),
}));
const __VLS_22 = __VLS_21({
    size: (16),
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
__VLS_23.slots.default;
const __VLS_24 = {}.Folder;
/** @type {[typeof __VLS_components.Folder, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({}));
const __VLS_26 = __VLS_25({}, ...__VLS_functionalComponentArgsRest(__VLS_25));
var __VLS_23;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
const __VLS_28 = {}.ElTag;
/** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
    size: "small",
    effect: "plain",
}));
const __VLS_30 = __VLS_29({
    size: "small",
    effect: "plain",
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
__VLS_31.slots.default;
(__VLS_ctx.mockDataSources.length);
var __VLS_31;
for (const [group] of __VLS_getVForSourceType((__VLS_ctx.groups))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ onDragover: () => { } },
        ...{ onDrop: (...[$event]) => {
                __VLS_ctx.handleDrop(group.id);
            } },
        key: (group.id),
        ...{ class: "group-tree-child" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "group-tree-title" },
    });
    const __VLS_32 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
        size: (16),
    }));
    const __VLS_34 = __VLS_33({
        size: (16),
    }, ...__VLS_functionalComponentArgsRest(__VLS_33));
    __VLS_35.slots.default;
    const __VLS_36 = {}.FolderOpened;
    /** @type {[typeof __VLS_components.FolderOpened, ]} */ ;
    // @ts-ignore
    const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({}));
    const __VLS_38 = __VLS_37({}, ...__VLS_functionalComponentArgsRest(__VLS_37));
    var __VLS_35;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (group.name);
    const __VLS_40 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
        size: "small",
        effect: "plain",
    }));
    const __VLS_42 = __VLS_41({
        size: "small",
        effect: "plain",
    }, ...__VLS_functionalComponentArgsRest(__VLS_41));
    __VLS_43.slots.default;
    (group.count);
    var __VLS_43;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "group-actions" },
    });
    const __VLS_44 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
        ...{ 'onClick': {} },
        link: true,
        type: "danger",
        size: "small",
    }));
    const __VLS_46 = __VLS_45({
        ...{ 'onClick': {} },
        link: true,
        type: "danger",
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_45));
    let __VLS_48;
    let __VLS_49;
    let __VLS_50;
    const __VLS_51 = {
        onClick: (...[$event]) => {
            __VLS_ctx.editGroup(group);
        }
    };
    __VLS_47.slots.default;
    var __VLS_47;
    const __VLS_52 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
        ...{ 'onClick': {} },
        link: true,
        type: "danger",
        size: "small",
    }));
    const __VLS_54 = __VLS_53({
        ...{ 'onClick': {} },
        link: true,
        type: "danger",
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_53));
    let __VLS_56;
    let __VLS_57;
    let __VLS_58;
    const __VLS_59 = {
        onClick: (...[$event]) => {
            __VLS_ctx.removeGroup(group);
        }
    };
    __VLS_55.slots.default;
    var __VLS_55;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "drag-tip" },
});
const __VLS_60 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({}));
const __VLS_62 = __VLS_61({}, ...__VLS_functionalComponentArgsRest(__VLS_61));
__VLS_63.slots.default;
const __VLS_64 = {}.InfoFilled;
/** @type {[typeof __VLS_components.InfoFilled, ]} */ ;
// @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({}));
const __VLS_66 = __VLS_65({}, ...__VLS_functionalComponentArgsRest(__VLS_65));
var __VLS_63;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
var __VLS_11;
var __VLS_7;
const __VLS_68 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
    xs: (24),
    lg: (15),
}));
const __VLS_70 = __VLS_69({
    xs: (24),
    lg: (15),
}, ...__VLS_functionalComponentArgsRest(__VLS_69));
__VLS_71.slots.default;
const __VLS_72 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
    ...{ class: "panel-card dashboard-card" },
    shadow: "never",
}));
const __VLS_74 = __VLS_73({
    ...{ class: "panel-card dashboard-card" },
    shadow: "never",
}, ...__VLS_functionalComponentArgsRest(__VLS_73));
__VLS_75.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_75.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-actions" },
    });
    const __VLS_76 = {}.ElSelect;
    /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
    // @ts-ignore
    const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
        modelValue: (__VLS_ctx.permissionGroup),
        ...{ class: "filter-select" },
        size: "small",
    }));
    const __VLS_78 = __VLS_77({
        modelValue: (__VLS_ctx.permissionGroup),
        ...{ class: "filter-select" },
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_77));
    __VLS_79.slots.default;
    for (const [group] of __VLS_getVForSourceType((__VLS_ctx.groups))) {
        const __VLS_80 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
            key: (group.id),
            label: (group.name),
            value: (group.id),
        }));
        const __VLS_82 = __VLS_81({
            key: (group.id),
            label: (group.name),
            value: (group.id),
        }, ...__VLS_functionalComponentArgsRest(__VLS_81));
    }
    var __VLS_79;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "permission-row" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "permission-label" },
});
for (const [user] of __VLS_getVForSourceType((__VLS_ctx.selectedGroupUsers))) {
    const __VLS_84 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
        ...{ 'onClose': {} },
        key: (user),
        closable: true,
        effect: "plain",
        type: "danger",
    }));
    const __VLS_86 = __VLS_85({
        ...{ 'onClose': {} },
        key: (user),
        closable: true,
        effect: "plain",
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_85));
    let __VLS_88;
    let __VLS_89;
    let __VLS_90;
    const __VLS_91 = {
        onClose: (...[$event]) => {
            __VLS_ctx.removeUser(user);
        }
    };
    __VLS_87.slots.default;
    (user);
    var __VLS_87;
}
const __VLS_92 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.pendingUser),
    placeholder: "添加用户",
    size: "small",
    ...{ class: "permission-add" },
}));
const __VLS_94 = __VLS_93({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.pendingUser),
    placeholder: "添加用户",
    size: "small",
    ...{ class: "permission-add" },
}, ...__VLS_functionalComponentArgsRest(__VLS_93));
let __VLS_96;
let __VLS_97;
let __VLS_98;
const __VLS_99 = {
    onChange: (__VLS_ctx.addUser)
};
__VLS_95.slots.default;
for (const [user] of __VLS_getVForSourceType((__VLS_ctx.allUsers))) {
    const __VLS_100 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
        key: (user),
        label: (user),
        value: (user),
    }));
    const __VLS_102 = __VLS_101({
        key: (user),
        label: (user),
        value: (user),
    }, ...__VLS_functionalComponentArgsRest(__VLS_101));
}
var __VLS_95;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "permission-row" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "permission-label" },
});
for (const [user] of __VLS_getVForSourceType((__VLS_ctx.selectedGroupReaders))) {
    const __VLS_104 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
        ...{ 'onClose': {} },
        key: (user),
        closable: true,
        effect: "plain",
        type: "info",
    }));
    const __VLS_106 = __VLS_105({
        ...{ 'onClose': {} },
        key: (user),
        closable: true,
        effect: "plain",
        type: "info",
    }, ...__VLS_functionalComponentArgsRest(__VLS_105));
    let __VLS_108;
    let __VLS_109;
    let __VLS_110;
    const __VLS_111 = {
        onClose: (...[$event]) => {
            __VLS_ctx.removeReader(user);
        }
    };
    __VLS_107.slots.default;
    (user);
    var __VLS_107;
}
const __VLS_112 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.pendingReader),
    placeholder: "添加用户",
    size: "small",
    ...{ class: "permission-add" },
}));
const __VLS_114 = __VLS_113({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.pendingReader),
    placeholder: "添加用户",
    size: "small",
    ...{ class: "permission-add" },
}, ...__VLS_functionalComponentArgsRest(__VLS_113));
let __VLS_116;
let __VLS_117;
let __VLS_118;
const __VLS_119 = {
    onChange: (__VLS_ctx.addReader)
};
__VLS_115.slots.default;
for (const [user] of __VLS_getVForSourceType((__VLS_ctx.allUsers))) {
    const __VLS_120 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({
        key: (user),
        label: (user),
        value: (user),
    }));
    const __VLS_122 = __VLS_121({
        key: (user),
        label: (user),
        value: (user),
    }, ...__VLS_functionalComponentArgsRest(__VLS_121));
}
var __VLS_115;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "permission-actions" },
});
const __VLS_124 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({
    ...{ 'onClick': {} },
    type: "danger",
    size: "small",
}));
const __VLS_126 = __VLS_125({
    ...{ 'onClick': {} },
    type: "danger",
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_125));
let __VLS_128;
let __VLS_129;
let __VLS_130;
const __VLS_131 = {
    onClick: (__VLS_ctx.savePermission)
};
__VLS_127.slots.default;
var __VLS_127;
var __VLS_75;
const __VLS_132 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132({
    ...{ class: "panel-card dashboard-card mt-16" },
    shadow: "never",
}));
const __VLS_134 = __VLS_133({
    ...{ class: "panel-card dashboard-card mt-16" },
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
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "ds-mini-grid" },
});
for (const [item] of __VLS_getVForSourceType((__VLS_ctx.activeGroupSources))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ onDragstart: (...[$event]) => {
                __VLS_ctx.dragId = item.id;
            } },
        key: (item.id),
        ...{ class: "ds-mini-card" },
        draggable: "true",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "ds-card-name" },
    });
    (item.name);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "ds-card-meta" },
    });
    (item.type);
    (item.env);
}
if (__VLS_ctx.activeGroupSources.length === 0) {
    const __VLS_136 = {}.ElEmpty;
    /** @type {[typeof __VLS_components.ElEmpty, typeof __VLS_components.elEmpty, ]} */ ;
    // @ts-ignore
    const __VLS_137 = __VLS_asFunctionalComponent(__VLS_136, new __VLS_136({
        description: "该分组下暂无数据源",
        imageSize: (70),
    }));
    const __VLS_138 = __VLS_137({
        description: "该分组下暂无数据源",
        imageSize: (70),
    }, ...__VLS_functionalComponentArgsRest(__VLS_137));
}
var __VLS_135;
var __VLS_71;
var __VLS_3;
const __VLS_140 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_141 = __VLS_asFunctionalComponent(__VLS_140, new __VLS_140({
    modelValue: (__VLS_ctx.groupEditorVisible),
    title: (__VLS_ctx.editingGroup ? '编辑分组' : '新增分组'),
    width: "460px",
}));
const __VLS_142 = __VLS_141({
    modelValue: (__VLS_ctx.groupEditorVisible),
    title: (__VLS_ctx.editingGroup ? '编辑分组' : '新增分组'),
    width: "460px",
}, ...__VLS_functionalComponentArgsRest(__VLS_141));
__VLS_143.slots.default;
const __VLS_144 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_145 = __VLS_asFunctionalComponent(__VLS_144, new __VLS_144({
    model: (__VLS_ctx.groupForm),
    labelWidth: "90px",
}));
const __VLS_146 = __VLS_145({
    model: (__VLS_ctx.groupForm),
    labelWidth: "90px",
}, ...__VLS_functionalComponentArgsRest(__VLS_145));
__VLS_147.slots.default;
const __VLS_148 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_149 = __VLS_asFunctionalComponent(__VLS_148, new __VLS_148({
    label: "分组名称",
}));
const __VLS_150 = __VLS_149({
    label: "分组名称",
}, ...__VLS_functionalComponentArgsRest(__VLS_149));
__VLS_151.slots.default;
const __VLS_152 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_153 = __VLS_asFunctionalComponent(__VLS_152, new __VLS_152({
    modelValue: (__VLS_ctx.groupForm.name),
}));
const __VLS_154 = __VLS_153({
    modelValue: (__VLS_ctx.groupForm.name),
}, ...__VLS_functionalComponentArgsRest(__VLS_153));
var __VLS_151;
const __VLS_156 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_157 = __VLS_asFunctionalComponent(__VLS_156, new __VLS_156({
    label: "分组描述",
}));
const __VLS_158 = __VLS_157({
    label: "分组描述",
}, ...__VLS_functionalComponentArgsRest(__VLS_157));
__VLS_159.slots.default;
const __VLS_160 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_161 = __VLS_asFunctionalComponent(__VLS_160, new __VLS_160({
    modelValue: (__VLS_ctx.groupForm.description),
    type: "textarea",
    rows: (2),
}));
const __VLS_162 = __VLS_161({
    modelValue: (__VLS_ctx.groupForm.description),
    type: "textarea",
    rows: (2),
}, ...__VLS_functionalComponentArgsRest(__VLS_161));
var __VLS_159;
var __VLS_147;
{
    const { footer: __VLS_thisSlot } = __VLS_143.slots;
    const __VLS_164 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_165 = __VLS_asFunctionalComponent(__VLS_164, new __VLS_164({
        ...{ 'onClick': {} },
    }));
    const __VLS_166 = __VLS_165({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_165));
    let __VLS_168;
    let __VLS_169;
    let __VLS_170;
    const __VLS_171 = {
        onClick: (...[$event]) => {
            __VLS_ctx.groupEditorVisible = false;
        }
    };
    __VLS_167.slots.default;
    var __VLS_167;
    const __VLS_172 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_173 = __VLS_asFunctionalComponent(__VLS_172, new __VLS_172({
        ...{ 'onClick': {} },
        type: "danger",
    }));
    const __VLS_174 = __VLS_173({
        ...{ 'onClick': {} },
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_173));
    let __VLS_176;
    let __VLS_177;
    let __VLS_178;
    const __VLS_179 = {
        onClick: (__VLS_ctx.saveGroup)
    };
    __VLS_175.slots.default;
    var __VLS_175;
}
var __VLS_143;
/** @type {__VLS_StyleScopedClasses['standard-page']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['group-tree-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['group-tree-node']} */ ;
/** @type {__VLS_StyleScopedClasses['group-tree-title']} */ ;
/** @type {__VLS_StyleScopedClasses['group-tree-child']} */ ;
/** @type {__VLS_StyleScopedClasses['group-tree-title']} */ ;
/** @type {__VLS_StyleScopedClasses['group-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['drag-tip']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-select']} */ ;
/** @type {__VLS_StyleScopedClasses['permission-row']} */ ;
/** @type {__VLS_StyleScopedClasses['permission-label']} */ ;
/** @type {__VLS_StyleScopedClasses['permission-add']} */ ;
/** @type {__VLS_StyleScopedClasses['permission-row']} */ ;
/** @type {__VLS_StyleScopedClasses['permission-label']} */ ;
/** @type {__VLS_StyleScopedClasses['permission-add']} */ ;
/** @type {__VLS_StyleScopedClasses['permission-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-card']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['ds-mini-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['ds-mini-card']} */ ;
/** @type {__VLS_StyleScopedClasses['ds-card-name']} */ ;
/** @type {__VLS_StyleScopedClasses['ds-card-meta']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Folder: Folder,
            FolderOpened: FolderOpened,
            InfoFilled: InfoFilled,
            Plus: Plus,
            mockDataSources: mockDataSources,
            groups: groups,
            permissionGroup: permissionGroup,
            pendingUser: pendingUser,
            pendingReader: pendingReader,
            groupEditorVisible: groupEditorVisible,
            editingGroup: editingGroup,
            dragId: dragId,
            groupForm: groupForm,
            allUsers: allUsers,
            selectedGroupUsers: selectedGroupUsers,
            selectedGroupReaders: selectedGroupReaders,
            activeGroupSources: activeGroupSources,
            handleDrop: handleDrop,
            openCreateGroup: openCreateGroup,
            editGroup: editGroup,
            saveGroup: saveGroup,
            removeGroup: removeGroup,
            addUser: addUser,
            removeUser: removeUser,
            addReader: addReader,
            removeReader: removeReader,
            savePermission: savePermission,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
