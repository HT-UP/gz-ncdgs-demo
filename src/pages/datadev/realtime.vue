<template>
  <div class="standard-page">
    <el-row :gutter="16">
      <el-col :span="16">
        <el-card class="panel-card dashboard-card" shadow="never">
          <template #header>
            <div class="panel-header">
              <span>实时处理任务</span>
              <el-button type="danger" :icon="Plus" @click="openCreate">新建实时任务</el-button>
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
            <el-select v-model="filterChannel" placeholder="消息队列" clearable class="filter-select">
              <el-option label="Kafka" value="Kafka" />
              <el-option label="RabbitMQ" value="RabbitMQ" />
            </el-select>
          </div>

          <el-table :data="filteredTasks" stripe class="mt-12">
            <el-table-column prop="name" label="任务名称" min-width="180" />
            <el-table-column prop="channel" label="消息队列" width="110">
              <template #default="{ row }">
                <el-tag effect="plain" type="danger">{{ row.channel }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="topic" label="主题/Topic" width="140" />
            <el-table-column label="消息格式" width="90">
              <template #default="{ row }">{{ row.format }}</template>
            </el-table-column>
            <el-table-column label="CDC" width="80" align="center">
              <template #default="{ row }">
                <el-tag effect="plain" :type="row.cdc ? 'success' : 'info'">{{ row.cdc ? '启用' : '关闭' }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="状态" width="90">
              <template #default="{ row }">
                <el-tag :type="statusTagType[row.status]" effect="dark">{{ row.status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="180" fixed="right">
              <template #default="{ row }">
                <el-button link type="primary" @click="previewTask(row)">采样</el-button>
                <el-button link type="danger" @click="openCreate">编辑</el-button>
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
              <span>实时数据预览</span>
            </div>
          </template>
          <div class="preview-bar">
            <el-tag effect="dark" type="danger">实时流</el-tag>
            <span class="preview-topic">{{ previewTopic }}</span>
          </div>
          <el-table :data="previewRows" size="small" stripe class="mt-12">
            <el-table-column prop="field" label="字段" width="110" />
            <el-table-column prop="value" label="采样值" min-width="120" />
            <el-table-column prop="timestamp" label="时间" width="150" />
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog v-model="editorVisible" title="新建实时任务" width="560px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="任务名称">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="消息队列">
          <el-select v-model="form.channel" class="w-full">
            <el-option label="Kafka" value="Kafka" />
            <el-option label="RabbitMQ" value="RabbitMQ" />
          </el-select>
        </el-form-item>
        <el-form-item label="Topic/队列">
          <el-input v-model="form.topic" placeholder="如 metro.customer.delta" />
        </el-form-item>
        <el-form-item label="消息格式">
          <el-select v-model="form.format" class="w-full">
            <el-option label="JSON" value="JSON" />
            <el-option label="XML" value="XML" />
            <el-option label="Avro" value="Avro" />
          </el-select>
        </el-form-item>
        <el-form-item label="CDC 捕获">
          <el-switch v-model="form.cdc" active-text="启用" />
        </el-form-item>
        <el-form-item label="处理逻辑">
          <el-input v-model="form.logic" type="textarea" :rows="4" placeholder="时间窗口聚合 / 实时清洗转换 / 实时质量检查" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editorVisible = false">取消</el-button>
        <el-button type="danger" @click="saveForm">创建</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, Search } from '@element-plus/icons-vue'
import { mockRealtimeTasks } from '@/mock/datadev'

const statusTagType: Record<string, 'warning' | 'success' | 'danger' | 'warning'> = {
  运行中: 'warning',
  成功: 'success',
  失败: 'danger',
  待执行: 'warning',
}

const realtimeTasks = ref(
  mockRealtimeTasks.map((task, index) => ({
    ...task,
    channel: index % 2 === 0 ? 'Kafka' : 'RabbitMQ',
    topic: index % 2 === 0 ? `metro.${task.sourceName.split(' ')[0]}.delta` : `queue.${task.sourceName.split(' ')[0]}`,
    format: ['JSON', 'JSON', 'Avro', 'XML'][index % 4],
    cdc: index % 3 !== 0,
  })),
)

const keyword = ref('')
const filterChannel = ref('')
const editorVisible = ref(false)
const previewTopic = ref('metro.customer.delta')

const previewRows = [
  { field: 'cust_id', value: 'C1000001', timestamp: '14:32:08.124' },
  { field: 'cust_name', value: '张三', timestamp: '14:32:08.124' },
  { field: 'op_type', value: 'UPDATE', timestamp: '14:32:08.124' },
  { field: 'cert_no', value: '4401***9123（脱敏）', timestamp: '14:32:08.124' },
]

const form = reactive({
  name: '',
  channel: 'Kafka',
  topic: '',
  format: 'JSON',
  cdc: true,
  logic: '',
})

const filteredTasks = computed(() =>
  realtimeTasks.value.filter((task) => {
    if (filterChannel.value && task.channel !== filterChannel.value) return false
    if (!keyword.value) return true
    return task.name.toLowerCase().includes(keyword.value.toLowerCase())
  }),
)

const openCreate = () => {
  Object.assign(form, { name: '', channel: 'Kafka', topic: '', format: 'JSON', cdc: true, logic: '' })
  editorVisible.value = true
}

const saveForm = () => {
  if (!form.name.trim() || !form.topic.trim()) {
    ElMessage.warning('请填写任务名称和 Topic')
    return
  }
  realtimeTasks.value.unshift({
    id: `realtime-mock-${Date.now()}`,
    name: form.name,
    type: '实时',
    sourceName: form.channel,
    targetName: '实时数仓',
    schedule: '实时',
    status: '待执行',
    progress: 0,
    dataCount: 0,
    owner: '张三',
    lastRunTime: '-',
    description: '新建实时任务',
    channel: form.channel,
    topic: form.topic,
    format: form.format,
    cdc: form.cdc,
  })
  editorVisible.value = false
  ElMessage.success('实时任务已创建（Mock）')
}

const previewTask = (row: (typeof realtimeTasks.value)[number]) => {
  previewTopic.value = row.topic
  ElMessage.success(`已获取「${row.name}」实时采样数据 4 条（Mock）`)
}
</script>
