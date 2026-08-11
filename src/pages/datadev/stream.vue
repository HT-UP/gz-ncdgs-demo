<template>
  <div class="standard-page">
    <el-row :gutter="16">
      <el-col :span="16">
        <el-card class="panel-card dashboard-card" shadow="never">
          <template #header>
            <div class="panel-header">
              <span>流式处理任务</span>
              <el-button type="danger" :icon="Plus" @click="openCreate">新建流式任务</el-button>
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
            <el-select v-model="filterEngine" placeholder="消息队列" clearable class="filter-select">
              <el-option label="Kafka" value="Kafka" />
              <el-option label="Pulsar" value="Pulsar" />
              <el-option label="RocketMQ" value="RocketMQ" />
            </el-select>
          </div>

          <el-table :data="filteredTasks" stripe class="mt-12">
            <el-table-column prop="name" label="任务名称" min-width="180" />
            <el-table-column prop="engine" label="消息队列" width="110">
              <template #default="{ row }">
                <el-tag effect="plain" type="danger">{{ row.engine }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="窗口类型" width="110">
              <template #default="{ row }">{{ row.windowType }}</template>
            </el-table-column>
            <el-table-column label="CEP" width="80" align="center">
              <template #default="{ row }">
                <el-tag effect="plain" :type="row.cep ? 'success' : 'info'">{{ row.cep ? '启用' : '关闭' }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="Checkpoint" width="100" align="center">
              <template #default="{ row }">
                <el-tag effect="plain" :type="row.checkpoint ? 'success' : 'warning'">
                  {{ row.checkpoint ? '每 60s' : '未配置' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="状态" width="90">
              <template #default="{ row }">
                <el-tag :type="statusTagType[row.status]" effect="dark">{{ row.status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150" fixed="right">
              <template #default="{ row }">
                <el-button link type="primary" @click="showCheckpoint(row)">检查点</el-button>
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
              <span>流批一体协同</span>
            </div>
          </template>
          <div class="coop-item" v-for="item in coopItems" :key="item.name">
            <div class="coop-item-icon">
              <el-icon :size="16"><WindPower /></el-icon>
            </div>
            <div class="coop-item-info">
              <div class="coop-item-name">{{ item.name }}</div>
              <div class="coop-item-desc">{{ item.desc }}</div>
            </div>
          </div>
        </el-card>

        <el-card class="panel-card dashboard-card mt-16" shadow="never">
          <template #header>
            <div class="panel-header">
              <span>容错与一致性</span>
            </div>
          </template>
          <div class="coop-item">
            <div class="coop-item-icon"><el-icon :size="16"><CircleCheck /></el-icon></div>
            <div class="coop-item-info">
              <div class="coop-item-name">Exactly-Once 语义</div>
              <div class="coop-item-desc">Checkpoint 周期性快照，故障自动恢复</div>
            </div>
          </div>
          <div class="coop-item">
            <div class="coop-item-icon"><el-icon :size="16"><CircleCheck /></el-icon></div>
            <div class="coop-item-info">
              <div class="coop-item-name">事件时间处理</div>
              <div class="coop-item-desc">Watermark 机制处理乱序数据</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog v-model="editorVisible" title="新建流式任务" width="560px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="任务名称">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="消息队列">
          <el-select v-model="form.engine" class="w-full">
            <el-option label="Kafka" value="Kafka" />
            <el-option label="Pulsar" value="Pulsar" />
            <el-option label="RocketMQ" value="RocketMQ" />
          </el-select>
        </el-form-item>
        <el-form-item label="窗口类型">
          <el-select v-model="form.windowType" class="w-full">
            <el-option label="滚动窗口" value="滚动窗口" />
            <el-option label="滑动窗口" value="滑动窗口" />
            <el-option label="会话窗口" value="会话窗口" />
          </el-select>
        </el-form-item>
        <el-form-item label="窗口大小">
          <el-input-number v-model="form.windowSize" :min="1" :max="120" /> 分钟
        </el-form-item>
        <el-form-item label="CEP">
          <el-switch v-model="form.cep" active-text="启用复杂事件处理" />
        </el-form-item>
        <el-form-item label="处理逻辑">
          <el-input v-model="form.logic" type="textarea" :rows="4" placeholder="实时ETL / 窗口聚合 / 异常事件识别" />
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
import { ElMessage, ElMessageBox } from 'element-plus'
import { CircleCheck, Plus, Search, WindPower } from '@element-plus/icons-vue'
import { mockStreamTasks } from '@/mock/datadev'

const statusTagType: Record<string, 'warning' | 'success' | 'danger' | 'warning'> = {
  运行中: 'warning',
  成功: 'success',
  失败: 'danger',
  待执行: 'warning',
}

const windowTypes = ['滚动窗口', '滑动窗口', '会话窗口']
const engines = ['Kafka', 'Pulsar', 'RocketMQ']

const streamTasks = ref(
  mockStreamTasks.map((task, index) => ({
    ...task,
    engine: engines[index % engines.length],
    windowType: windowTypes[index % windowTypes.length],
    windowSize: 5 + (index % 4) * 5,
    cep: index % 2 === 0,
    checkpoint: index % 4 !== 1,
  })),
)

const coopItems = [
  { name: '流批一体调度', desc: '同一任务支持流式与批量两种执行模式' },
  { name: '统一元数据', desc: '流批共用表结构定义与质量规则' },
  { name: '双链路结果一致性', desc: '批式结果与流式结果自动校验' },
]

const keyword = ref('')
const filterEngine = ref('')
const editorVisible = ref(false)

const form = reactive({
  name: '',
  engine: 'Kafka',
  windowType: '滚动窗口',
  windowSize: 5,
  cep: true,
  logic: '',
})

const filteredTasks = computed(() =>
  streamTasks.value.filter((task) => {
    if (filterEngine.value && task.engine !== filterEngine.value) return false
    if (!keyword.value) return true
    return task.name.toLowerCase().includes(keyword.value.toLowerCase())
  }),
)

const openCreate = () => {
  Object.assign(form, { name: '', engine: 'Kafka', windowType: '滚动窗口', windowSize: 5, cep: true, logic: '' })
  editorVisible.value = true
}

const saveForm = () => {
  if (!form.name.trim()) {
    ElMessage.warning('请输入任务名称')
    return
  }
  streamTasks.value.unshift({
    id: `stream-mock-${Date.now()}`,
    name: form.name,
    type: '流式',
    sourceName: form.engine,
    targetName: '实时数仓',
    schedule: '持续运行',
    status: '待执行',
    progress: 0,
    dataCount: 0,
    owner: '张三',
    lastRunTime: '-',
    description: '新建流式任务',
    engine: form.engine,
    windowType: form.windowType,
    windowSize: form.windowSize,
    cep: form.cep,
    checkpoint: true,
  })
  editorVisible.value = false
  ElMessage.success('流式任务已创建（Mock）')
}

const showCheckpoint = (row: (typeof streamTasks.value)[number]) => {
  ElMessageBox.alert(
    `任务「${row.name}」\n最近检查点：2026-08-11 14:31:58\n状态：成功（Exactly-Once）\n恢复耗时：1.2s\n数据延迟：0ms`,
    'Checkpoint 容错信息',
    { type: 'success' },
  )
}
</script>
