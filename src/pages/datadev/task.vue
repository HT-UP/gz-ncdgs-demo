<template>
  <div class="standard-page">
    <el-row :gutter="16">
      <el-col :span="16">
        <el-card class="panel-card dashboard-card" shadow="never">
          <template #header>
            <div class="panel-header">
              <span>任务管理</span>
              <el-button type="danger" :icon="Plus" @click="openWizard">新建任务</el-button>
            </div>
          </template>

          <div class="toolbar-row">
            <el-input
              v-model="keyword"
              placeholder="按任务名称 / 负责人搜索"
              clearable
              class="search-input"
              :prefix-icon="Search"
            />
            <el-select v-model="filterStatus" placeholder="状态" clearable class="filter-select">
              <el-option label="运行中" value="运行中" />
              <el-option label="成功" value="成功" />
              <el-option label="失败" value="失败" />
              <el-option label="待执行" value="待执行" />
              <el-option label="已暂停" value="已暂停" />
            </el-select>
          </div>

          <el-table :data="filteredTasks" stripe class="mt-12">
            <el-table-column prop="name" label="任务名称" min-width="170" />
            <el-table-column prop="type" label="类型" width="80" />
            <el-table-column prop="templateName" label="模板" width="110">
              <template #default="{ row }">
                <el-tag effect="plain" type="info">{{ row.templateName }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="dependencies" label="依赖任务" width="150">
              <template #default="{ row }">
                <span class="dep-text">{{ row.dependencies || '无依赖' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="状态" width="90">
              <template #default="{ row }">
                <el-tag :type="statusTagType[row.status]" effect="dark">{{ row.status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="owner" label="负责人" width="90" />
            <el-table-column label="操作" width="260" fixed="right">
              <template #default="{ row }">
                <el-button link type="success" @click="toggleTask(row)">{{ row.status === '已暂停' ? '恢复' : '暂停' }}</el-button>
                <el-button link type="danger" @click="stopTask(row)">终止</el-button>
                <el-button link type="primary" @click="cloneTask(row)">克隆</el-button>
                <el-button link type="warning" @click="showAudit(row)">审计</el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-pagination class="pager" layout="total, prev, pager, next" :total="filteredTasks.length" :page-size="20" background />
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card class="panel-card dashboard-card" shadow="never">
          <template #header>
            <div class="panel-header">
              <span>任务模板</span>
              <el-link :underline="false" type="danger">更多 →</el-link>
            </div>
          </template>
          <div
            v-for="template in templates"
            :key="template.name"
            class="template-item"
            @click="applyTemplate(template)"
          >
            <div class="template-icon">
              <el-icon :size="18"><component :is="template.icon" /></el-icon>
            </div>
            <div class="template-info">
              <div class="template-name">{{ template.name }}</div>
              <div class="template-desc">{{ template.description }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog v-model="wizardVisible" title="新建任务（向导）" width="620px">
      <el-steps :active="wizardStep" align-center finish-status="success" class="register-steps">
        <el-step title="基本信息" />
        <el-step title="调度与依赖" />
        <el-step title="参数配置" />
      </el-steps>

      <div v-if="wizardStep === 0">
        <el-form label-width="100px">
          <el-form-item label="任务名称">
            <el-input v-model="form.name" />
          </el-form-item>
          <el-form-item label="任务类型">
            <el-radio-group v-model="form.type">
              <el-radio value="批量" />
              <el-radio value="实时" />
              <el-radio value="流式" />
            </el-radio-group>
          </el-form-item>
          <el-form-item label="选择模板">
            <el-select v-model="form.templateName" class="w-full">
              <el-option v-for="template in templates" :key="template.name" :label="template.name" :value="template.name" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>

      <div v-else-if="wizardStep === 1">
        <el-form label-width="100px">
          <el-form-item label="调度方式">
            <el-select v-model="form.schedule" class="w-full">
              <el-option label="每日 02:00" value="每日 02:00" />
              <el-option label="每小时" value="每小时" />
              <el-option label="每周一 03:00" value="每周一 03:00" />
              <el-option label="手动触发" value="手动触发" />
            </el-select>
          </el-form-item>
          <el-form-item label="依赖任务">
            <el-select v-model="form.dependencies" class="w-full" clearable multiple placeholder="选择前置任务">
              <el-option v-for="task in mockDevTasks.slice(0, 10)" :key="task.id" :label="task.name" :value="task.name" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>

      <div v-else>
        <el-form label-width="100px">
          <el-form-item label="参数化配置">
            <div class="param-row" v-for="(param, index) in form.params" :key="index">
              <el-input v-model="param.key" placeholder="参数名" class="param-input" />
              <el-input v-model="param.value" placeholder="参数值" class="param-input" />
              <el-button link type="danger" @click="removeParam(index)">删除</el-button>
            </div>
            <el-button size="small" type="danger" plain @click="addParam">+ 添加参数</el-button>
          </el-form-item>
        </el-form>
      </div>

      <template #footer>
        <el-button v-if="wizardStep > 0" @click="wizardStep -= 1">上一步</el-button>
        <el-button v-if="wizardStep < 2" type="danger" @click="wizardStep += 1">下一步</el-button>
        <el-button v-else type="danger" @click="saveForm">创建任务</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="auditVisible" title="操作留痕审计" width="560px">
      <el-table :data="auditRows" stripe size="small">
        <el-table-column prop="time" label="时间" width="150" />
        <el-table-column prop="user" label="操作人" width="90" />
        <el-table-column prop="action" label="操作" min-width="120" />
        <el-table-column prop="detail" label="详情" min-width="140" />
      </el-table>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Clock, DocumentCopy, List, Plus, Search, VideoCamera, WindPower } from '@element-plus/icons-vue'
import { mockDevTasks } from '@/mock/datadev'

const statusTagType: Record<string, 'warning' | 'success' | 'danger' | 'warning' | 'info'> = {
  运行中: 'warning',
  成功: 'success',
  失败: 'danger',
  待执行: 'warning',
  已暂停: 'info',
}

const templates = [
  { name: '标准日结任务', description: '每日数据同步 + 汇总', icon: Clock },
  { name: '增量同步模板', description: '时间戳增量同步', icon: DocumentCopy },
  { name: '实时告警模板', description: '实时事件监控告警', icon: VideoCamera },
  { name: '流式聚合模板', description: '滑动窗口流式聚合', icon: WindPower },
]

const taskTemplates = templates.map((template) => template.name)

const tasks = ref(
  mockDevTasks.map((task, index) => ({
    ...task,
    templateName: taskTemplates[index % taskTemplates.length],
    dependencies: index % 3 === 0 ? mockDevTasks[(index + 3) % mockDevTasks.length].name : '',
    status: task.status as typeof task.status | '已暂停',
  })),
)

const keyword = ref('')
const filterStatus = ref('')
const wizardVisible = ref(false)
const wizardStep = ref(0)
const auditVisible = ref(false)

const form = reactive({
  name: '',
  type: '批量',
  templateName: '标准日结任务',
  schedule: '每日 02:00',
  dependencies: [] as string[],
  params: [{ key: '', value: '' }],
})

const filteredTasks = computed(() =>
  tasks.value.filter((task) => {
    if (filterStatus.value && task.status !== filterStatus.value) return false
    if (!keyword.value) return true
    const kw = keyword.value.toLowerCase()
    return task.name.toLowerCase().includes(kw) || task.owner.toLowerCase().includes(kw)
  }),
)

const auditRows = [
  { time: '2026-08-11 14:02', user: '张三', action: '启动任务', detail: '任务由待执行→运行中' },
  { time: '2026-08-11 09:30', user: '李四', action: '修改参数', detail: '更新并行度 4→8' },
  { time: '2026-08-10 17:15', user: '张三', action: '克隆任务', detail: '从「票务日结」克隆' },
]

const openWizard = () => {
  wizardStep.value = 0
  Object.assign(form, {
    name: '',
    type: '批量',
    templateName: '标准日结任务',
    schedule: '每日 02:00',
    dependencies: [],
    params: [{ key: '', value: '' }],
  })
  wizardVisible.value = true
}

const applyTemplate = (template: (typeof templates)[number]) => {
  form.templateName = template.name
  ElMessage.success(`已套用模板「${template.name}」（Mock）`)
}

const addParam = () => {
  form.params.push({ key: '', value: '' })
}

const removeParam = (index: number) => {
  form.params.splice(index, 1)
}

const saveForm = () => {
  if (!form.name.trim()) {
    ElMessage.warning('请输入任务名称')
    return
  }
  tasks.value.unshift({
    id: `task-mock-${Date.now()}`,
    name: form.name,
    type: form.type as '批量' | '实时' | '流式',
    sourceName: '票务核心库',
    targetName: '数仓 DWD',
    schedule: form.schedule,
    status: '待执行',
    progress: 0,
    dataCount: 0,
    owner: '张三',
    lastRunTime: '-',
    description: '新建治理任务',
    templateName: form.templateName,
    dependencies: form.dependencies.join('，'),
  })
  wizardVisible.value = false
  ElMessage.success('任务已创建（Mock）')
}

const toggleTask = (row: (typeof tasks.value)[number]) => {
  if (row.status === '已暂停') {
    row.status = '待执行'
    ElMessage.success(`任务「${row.name}」已恢复（Mock）`)
  } else {
    row.status = '已暂停'
    ElMessage.info(`任务「${row.name}」已暂停（Mock）`)
  }
}

const stopTask = (row: (typeof tasks.value)[number]) => {
  row.status = '待执行'
  ElMessage.info(`任务「${row.name}」已终止（Mock）`)
}

const cloneTask = (row: (typeof tasks.value)[number]) => {
  tasks.value.push({ ...row, name: `${row.name}（副本）`, id: `clone-${Date.now()}` })
  ElMessage.success(`任务「${row.name}」已克隆（Mock）`)
}

const showAudit = (row: (typeof tasks.value)[number]) => {
  auditVisible.value = true
}
</script>
