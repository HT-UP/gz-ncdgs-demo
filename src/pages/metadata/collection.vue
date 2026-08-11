<template>
  <div class="standard-page">
    <el-card class="panel-card dashboard-card" shadow="never">
      <template #header>
        <div class="panel-header">
          <span>采集任务管理</span>
          <el-button type="danger" :icon="Plus" @click="openCreate">创建采集任务</el-button>
        </div>
      </template>

      <div class="toolbar-row">
        <el-input
          v-model="keyword"
          placeholder="按任务名称 / 数据源搜索"
          clearable
          class="search-input"
          :prefix-icon="Search"
        />
        <el-select v-model="filterStatus" placeholder="任务状态" clearable class="filter-select">
          <el-option label="成功" value="成功" />
          <el-option label="运行中" value="运行中" />
          <el-option label="失败" value="失败" />
          <el-option label="等待调度" value="等待调度" />
        </el-select>
        <el-select v-model="filterType" placeholder="数据源类型" clearable class="filter-select">
          <el-option v-for="type in sourceTypes" :key="type" :label="type" :value="type" />
        </el-select>
      </div>

      <el-table :data="filteredTasks" stripe class="mt-12">
        <el-table-column prop="name" label="任务名称" min-width="200" />
        <el-table-column prop="sourceName" label="数据源" width="140" />
        <el-table-column prop="sourceType" label="类型" width="100" />
        <el-table-column prop="schedule" label="调度方式" width="130" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="statusTagType[row.status]" effect="dark">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="collectedCount" label="已采集(条)" width="110" align="center" />
        <el-table-column prop="lastRunTime" label="上次执行" width="150" />
        <el-table-column prop="owner" label="负责人" width="90" />
        <el-table-column label="操作" width="240" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="runNow(row)">立即执行</el-button>
            <el-button link type="warning" @click="rerunTask(row)">重跑</el-button>
            <el-button link type="danger" @click="stopTask(row)">中止</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination class="pager" layout="total, prev, pager, next" :total="filteredTasks.length" :page-size="20" background />
    </el-card>

    <el-dialog v-model="createVisible" title="创建采集任务" width="620px">
      <el-steps :active="createStep" align-center finish-status="success" class="register-steps">
        <el-step title="选择数据源" />
        <el-step title="选择采集范围" />
        <el-step title="调度配置" />
      </el-steps>

      <div v-if="createStep === 0">
        <el-select v-model="createForm.sourceName" placeholder="选择数据源" class="w-full">
          <el-option v-for="source in availableSources" :key="source" :label="source" :value="source" />
        </el-select>
        <div class="used-source-tip">
          <el-icon><InfoFilled /></el-icon>
          <span>以下数据源已被采集任务使用，不可重复选择：</span>
        </div>
        <div class="used-source-tags">
          <el-tag v-for="source in usedSources" :key="source" type="info" effect="plain" disabled>{{ source }}</el-tag>
        </div>
      </div>

      <div v-else-if="createStep === 1">
        <el-checkbox-group v-model="createForm.scope">
          <el-checkbox v-for="scope in scopeOptions" :key="scope" :label="scope" />
        </el-checkbox-group>
      </div>

      <div v-else>
        <el-form label-width="100px">
          <el-form-item label="调度方式">
            <el-select v-model="createForm.schedule" class="w-full">
              <el-option label="每分钟" value="每分钟" />
              <el-option label="每小时" value="每小时" />
              <el-option label="每日 02:00" value="每日 02:00" />
              <el-option label="每周一 03:00" value="每周一 03:00" />
              <el-option label="立即执行" value="立即执行" />
            </el-select>
          </el-form-item>
          <el-form-item label="任务名称">
            <el-input v-model="createForm.name" />
          </el-form-item>
        </el-form>
      </div>

      <template #footer>
        <el-button v-if="createStep > 0" @click="createStep -= 1">上一步</el-button>
        <el-button v-if="createStep < 2" type="danger" @click="createStep += 1">下一步</el-button>
        <el-button v-else type="danger" @click="submitCreate">创建任务</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { InfoFilled, Plus, Search } from '@element-plus/icons-vue'
import { mockCollectionTasks, type CollectionTask } from '@/mock/metadata'

const keyword = ref('')
const filterStatus = ref('')
const filterType = ref('')
const createVisible = ref(false)
const createStep = ref(0)

const sourceTypes = Array.from(new Set(mockCollectionTasks.map((item) => item.sourceType)))

const statusTagType: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
  成功: 'success',
  运行中: 'warning',
  失败: 'danger',
  等待调度: 'info',
}

const usedSources = Array.from(new Set(mockCollectionTasks.map((item) => item.sourceName)))
const availableSources = ['票务核心库', '设备信号库', '客流分析库', '建设进度库', '资产管理系统', '运维工单库'].filter(
  (source) => !usedSources.includes(source),
)
const scopeOptions = ['表结构', '字段信息', '主键索引', '存储过程', '视图定义', '分区信息']

const createForm = reactive({
  sourceName: '',
  scope: ['表结构', '字段信息'] as string[],
  schedule: '每日 02:00',
  name: '',
})

const filteredTasks = computed(() =>
  mockCollectionTasks.filter((task) => {
    if (filterStatus.value && task.status !== filterStatus.value) return false
    if (filterType.value && task.sourceType !== filterType.value) return false
    if (!keyword.value) return true
    const kw = keyword.value.toLowerCase()
    return task.name.toLowerCase().includes(kw) || task.sourceName.toLowerCase().includes(kw)
  }),
)

const openCreate = () => {
  createStep.value = 0
  Object.assign(createForm, { sourceName: '', scope: ['表结构', '字段信息'], schedule: '每日 02:00', name: '' })
  createVisible.value = true
}

const submitCreate = () => {
  if (!createForm.sourceName || !createForm.name) {
    ElMessage.warning('请完整填写任务信息')
    return
  }
  mockCollectionTasks.unshift({
    id: `task-mock-${Date.now()}`,
    name: createForm.name,
    sourceName: createForm.sourceName,
    sourceType: 'MySQL',
    schedule: createForm.schedule,
    status: '等待调度',
    collectedCount: 0,
    lastRunTime: '-',
    owner: '张三',
  })
  createVisible.value = false
  ElMessage.success('采集任务已创建（Mock）')
}

const runNow = (row: CollectionTask) => {
  row.status = '运行中'
  ElMessage.success(`任务「${row.name}」已触发立即执行（Mock）`)
}

const rerunTask = (row: CollectionTask) => {
  row.status = '运行中'
  ElMessage.success(`任务「${row.name}」已重跑（Mock）`)
}

const stopTask = (row: CollectionTask) => {
  row.status = '等待调度'
  ElMessage.info(`任务「${row.name}」已中止（Mock）`)
}
</script>
