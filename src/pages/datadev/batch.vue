<template>
  <div class="standard-page">
    <el-row :gutter="16">
      <el-col :span="16">
        <el-card class="panel-card dashboard-card" shadow="never">
          <template #header>
            <div class="panel-header">
              <span>批量处理任务</span>
              <el-button type="danger" :icon="Plus" @click="openCreate">新建批量任务</el-button>
            </div>
          </template>

          <div class="toolbar-row">
            <el-input
              v-model="keyword"
              placeholder="按任务名称搜索"
              clearable
              class="search-input"
              :prefix-icon="Search"
            />
            <el-select v-model="filterStatus" placeholder="状态" clearable class="filter-select">
              <el-option label="运行中" value="运行中" />
              <el-option label="成功" value="成功" />
              <el-option label="失败" value="失败" />
              <el-option label="待执行" value="待执行" />
            </el-select>
          </div>

          <el-table :data="filteredTasks" stripe class="mt-12">
            <el-table-column prop="name" label="任务名称" min-width="180" />
            <el-table-column prop="sourceName" label="数据源" width="130" />
            <el-table-column prop="schedule" label="调度" width="120" />
            <el-table-column label="同步模式" width="90">
              <template #default="{ row }">{{ row.mode }}</template>
            </el-table-column>
            <el-table-column label="状态" width="90">
              <template #default="{ row }">
                <el-tag :type="statusTagType[row.status]" effect="dark">{{ row.status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="进度" min-width="130">
              <template #default="{ row }">
                <el-progress :percentage="row.progress" :stroke-width="10" />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200" fixed="right">
              <template #default="{ row }">
                <el-button link type="danger" @click="openEditor(row)">编辑</el-button>
                <el-button link type="primary" @click="cloneTask(row)">克隆</el-button>
                <el-button link type="warning" @click="runTask(row)">运行</el-button>
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
              <span>处理算子库</span>
            </div>
          </template>
          <div class="operator-list">
            <div v-for="operator in operators" :key="operator.name" class="operator-item">
              <div class="operator-icon">
                <el-icon :size="16"><component :is="operator.icon" /></el-icon>
              </div>
              <div>
                <div class="operator-name">{{ operator.name }}</div>
                <div class="operator-desc">{{ operator.desc }}</div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog v-model="editorVisible" :title="editingTask ? '编辑批量任务' : '新建批量任务'" width="680px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="任务名称">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="数据源">
          <el-select v-model="form.source" class="w-full">
            <el-option v-for="source in sources" :key="source" :label="source" :value="source" />
          </el-select>
        </el-form-item>
        <el-form-item label="调度配置">
          <el-select v-model="form.schedule" class="w-full">
            <el-option v-for="schedule in schedules" :key="schedule" :label="schedule" :value="schedule" />
          </el-select>
        </el-form-item>
        <el-form-item label="同步模式">
          <el-radio-group v-model="form.mode">
            <el-radio value="全量" />
            <el-radio value="增量-时间戳" />
            <el-radio value="增量-自增ID" />
            <el-radio value="刷新采集" />
            <el-radio value="数据比对" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="失败重试">
          <el-checkbox v-model="form.retry">自动重试（最多 3 次）</el-checkbox>
        </el-form-item>
        <el-form-item label="SQL 脚本">
          <el-input v-model="form.sql" type="textarea" :rows="6" class="sql-editor" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editorVisible = false">取消</el-button>
        <el-button type="danger" @click="saveForm">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Aim, Brush, Coin, Filter, Lock, MagicStick, Plus, Refresh, Sort, Search } from '@element-plus/icons-vue'
import { mockDevTasks, type DevTask } from '@/mock/datadev'

const statusTagType: Record<string, 'warning' | 'success' | 'danger' | 'warning'> = {
  运行中: 'warning',
  成功: 'success',
  失败: 'danger',
  待执行: 'warning',
}

const modes = ['全量', '增量-时间戳', '增量-自增ID', '刷新采集', '数据比对']

type BatchTask = DevTask & { mode: string }

const batchTasks = ref<BatchTask[]>(
  mockDevTasks.filter((task) => task.type === '批量').map((task) => ({ ...task, mode: modes[task.id.charCodeAt(task.id.length - 1) % modes.length] })),
)

const operators = [
  { name: '条件过滤', desc: '按字段条件筛选记录', icon: Filter },
  { name: '字段映射', desc: '源字段到目标字段映射', icon: Coin },
  { name: '类型转换', desc: '数据类型自动转换', icon: Refresh },
  { name: '数据清洗', desc: '去空、去重、格式化', icon: Brush },
  { name: '数据归并', desc: '多表合并与聚合', icon: Sort },
  { name: '数据富化', desc: '关联外部数据补充', icon: MagicStick },
  { name: '数据标准化', desc: '按数据标准统一口径', icon: Aim },
  { name: '脱敏加密', desc: '敏感字段脱敏处理', icon: Lock },
]

const sources = ['票务核心库', '设备信号库', '客流分析库', '建设进度库', '运维工单库', '资产管理系统']
const schedules = ['每日 02:00', '每小时', '每周一 03:00', '每分钟', '手动触发']

const keyword = ref('')
const filterStatus = ref('')
const editorVisible = ref(false)
const editingTask = ref<BatchTask | null>(null)

const form = reactive({
  name: '',
  source: '票务核心库',
  schedule: '每日 02:00',
  mode: '全量',
  retry: true,
  sql: 'SELECT * FROM ticket_sale WHERE stat_date = \'${bizDate}\'',
})

const filteredTasks = computed(() =>
  batchTasks.value.filter((task) => {
    if (filterStatus.value && task.status !== filterStatus.value) return false
    if (!keyword.value) return true
    return task.name.toLowerCase().includes(keyword.value.toLowerCase())
  }),
)

const openCreate = () => {
  editingTask.value = null
  Object.assign(form, {
    name: '',
    source: '票务核心库',
    schedule: '每日 02:00',
    mode: '全量',
    retry: true,
    sql: 'SELECT * FROM ticket_sale WHERE stat_date = \'${bizDate}\'',
  })
  editorVisible.value = true
}

const openEditor = (row: BatchTask) => {
  editingTask.value = row
  Object.assign(form, {
    name: row.name,
    source: row.sourceName,
    schedule: row.schedule,
    mode: modes[0],
    retry: true,
    sql: `SELECT * FROM ${row.sourceName.split(' ')[0].toLowerCase()} WHERE ${row.schedule.includes('增量') ? 'updated_at >= ${lastSyncTime}' : '1=1'}`,
  })
  editorVisible.value = true
}

const saveForm = () => {
  if (!form.name.trim()) {
    ElMessage.warning('请输入任务名称')
    return
  }
  if (editingTask.value) {
    ElMessage.success(`批量任务「${form.name}」已保存（Mock）`)
  } else {
    batchTasks.value.unshift({
      id: `dev-batch-${Date.now()}`,
      name: form.name,
      type: '批量',
      sourceName: form.source,
      targetName: '数仓 DWD',
      schedule: form.schedule,
      status: '待执行',
      progress: 0,
      dataCount: 0,
      owner: '张三',
      lastRunTime: '-',
      description: '新建批量任务',
      mode: form.mode,
    })
    ElMessage.success('批量任务已创建（Mock）')
  }
  editorVisible.value = false
}

const cloneTask = (row: BatchTask) => {
  batchTasks.value.push({ ...row, name: `${row.name}（副本）`, id: `dev-clone-${Date.now()}` })
  ElMessage.success(`任务「${row.name}」已克隆（Mock）`)
}

const runTask = (row: BatchTask) => {
  row.status = '运行中'
  row.progress = 20
  ElMessage.success(`任务「${row.name}」已触发执行（Mock）`)
}
</script>
