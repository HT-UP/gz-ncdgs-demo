<template>
  <div class="standard-page">
    <el-row :gutter="16">
      <el-col :span="16">
        <el-card class="panel-card dashboard-card" shadow="never">
          <template #header>
            <div class="panel-header">
              <span>质量任务</span>
              <el-button type="danger" :icon="Plus" @click="openCreate">新建质量任务</el-button>
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
            <el-select v-model="filterTrigger" placeholder="触发方式" clearable class="filter-select">
              <el-option label="周期调度" value="周期调度" />
              <el-option label="实时触发" value="实时触发" />
              <el-option label="手动执行" value="手动执行" />
            </el-select>
            <el-select v-model="filterStatus" placeholder="状态" clearable class="filter-select">
              <el-option label="运行中" value="运行中" />
              <el-option label="成功" value="成功" />
              <el-option label="失败" value="失败" />
              <el-option label="待执行" value="待执行" />
            </el-select>
          </div>

          <el-table :data="filteredTasks" stripe class="mt-12">
            <el-table-column prop="name" label="任务名称" min-width="170" />
            <el-table-column label="触发方式" width="100">
              <template #default="{ row }">
                <el-tag effect="plain" type="danger">{{ row.trigger }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="ruleCount" label="规则数" width="70" align="center" />
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
            <el-table-column label="问题数据" width="100" align="center">
              <template #default="{ row }">
                <el-button v-if="row.problemCount > 0" link type="danger" @click="showProblems(row)">
                  {{ row.problemCount }} 条
                </el-button>
                <span v-else class="dep-text">—</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="180" fixed="right">
              <template #default="{ row }">
                <el-button link type="primary" @click="showLog(row)">日志</el-button>
                <el-button link type="danger" @click="runTask(row)">执行</el-button>
                <el-button link type="warning" @click="showDag(row)">依赖</el-button>
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
              <span>执行概览</span>
            </div>
          </template>
          <div class="overview-chips">
            <div class="chip chip-red">
              <div class="chip-value">12</div>
              <div class="chip-label">运行中</div>
            </div>
            <div class="chip chip-green">
              <div class="chip-value">68</div>
              <div class="chip-label">今日成功</div>
            </div>
            <div class="chip chip-orange">
              <div class="chip-value">3</div>
              <div class="chip-label">今日失败</div>
            </div>
          </div>

          <el-divider />

          <div class="section-title">资源隔离 / 优先级调度</div>
          <div class="coop-item">
            <div class="coop-item-icon"><el-icon :size="16"><Connection /></el-icon></div>
            <div class="coop-item-info">
              <div class="coop-item-name">队列：高质量队列</div>
              <div class="coop-item-desc">高优先级任务独占 8 个执行槽位</div>
            </div>
          </div>
          <div class="coop-item">
            <div class="coop-item-icon"><el-icon :size="16"><Search /></el-icon></div>
            <div class="coop-item-info">
              <div class="coop-item-name">增量检查模式</div>
              <div class="coop-item-desc">按增量分区检查，平均耗时缩短 62%</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog v-model="createVisible" title="新建质量任务" width="560px">
      <el-form :model="createForm" label-width="100px">
        <el-form-item label="任务名称">
          <el-input v-model="createForm.name" />
        </el-form-item>
        <el-form-item label="触发方式">
          <el-radio-group v-model="createForm.trigger">
            <el-radio value="周期调度" />
            <el-radio value="实时触发" />
            <el-radio value="手动执行" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="调度周期">
          <el-select v-model="createForm.schedule" class="w-full">
            <el-option label="每日 03:00" value="每日 03:00" />
            <el-option label="每小时" value="每小时" />
            <el-option label="实时" value="实时" />
            <el-option label="手动" value="手动" />
          </el-select>
        </el-form-item>
        <el-form-item label="检查范围">
          <el-input v-model="createForm.scope" />
        </el-form-item>
        <el-form-item label="增量检查">
          <el-switch v-model="createForm.incremental" active-text="启用" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="createVisible = false">取消</el-button>
        <el-button type="danger" @click="saveCreate">创建</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="problemVisible" title="问题数据明细" width="680px">
      <el-table :data="problemRows" stripe size="small">
        <el-table-column prop="pk" label="主键" width="120" />
        <el-table-column prop="field" label="问题字段" width="110" />
        <el-table-column prop="value" label="异常值" min-width="140" />
        <el-table-column prop="ruleName" label="命中规则" min-width="160" />
        <el-table-column prop="severity" label="级别" width="80">
          <template #default="{ row }">
            <el-tag :type="row.severity === '严重' ? 'danger' : row.severity === '警告' ? 'warning' : 'info'" size="small">
              {{ row.severity }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog v-model="logVisible" :title="`执行日志：${logTaskName}`" width="680px">
      <pre class="ddl-block">{{ logContent }}</pre>
    </el-dialog>

    <el-dialog v-model="dagVisible" title="任务依赖（DAG）" width="560px">
      <div class="dag-wrap">
        <div class="dag-node" v-for="(node, index) in dagNodes" :key="node.name" :class="{ 'dag-current': index === 2 }">
          <el-icon :size="14"><Connection /></el-icon>
          <span>{{ node.name }}</span>
          <span class="dag-status">{{ node.status }}</span>
        </div>
        <div class="dag-arrow" v-for="index in 2" :key="`arrow-${index}`">↓</div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Connection, Plus, Search, VideoCamera } from '@element-plus/icons-vue'
import { mockQualityTasks } from '@/mock/quality'

const statusTagType: Record<string, 'warning' | 'success' | 'danger' | 'warning'> = {
  运行中: 'warning',
  成功: 'success',
  失败: 'danger',
  待执行: 'warning',
}

const tasks = ref(mockQualityTasks.map((task, index) => ({
  ...task,
  dependencies: index % 2 === 0 ? `上游任务 qt-${(index % 5) + 1}` : '',
})))

const keyword = ref('')
const filterTrigger = ref('')
const filterStatus = ref('')
const createVisible = ref(false)
const problemVisible = ref(false)
const logVisible = ref(false)
const dagVisible = ref(false)
const logTaskName = ref('')

const createForm = reactive({
  name: '',
  trigger: '周期调度',
  schedule: '每日 03:00',
  scope: '票务核心库',
  incremental: true,
})

const problemRows = [
  { pk: 'TS-20260811-0001', field: 'cust_name', value: 'null', ruleName: '必填字段完整性检查', severity: '严重' },
  { pk: 'TS-20260811-0002', field: 'flow_count', value: '-128', ruleName: '客流量数值范围校验', severity: '严重' },
  { pk: 'TS-20260811-0003', field: 'phone', value: '138****', ruleName: '手机号格式准确性', severity: '警告' },
  { pk: 'TS-20260811-0004', field: 'ticket_no', value: '重复: T20260808015', ruleName: '票号唯一性检查', severity: '警告' },
  { pk: 'TS-20260811-0005', field: 'stat_date', value: '2026-08-09', ruleName: '数据及时性检查', severity: '提示' },
]

const logContent = `2026-08-11 03:00:02 [INFO] 质量任务启动（周期调度）
2026-08-11 03:00:05 [INFO] 加载 8 条检查规则
2026-08-11 03:00:45 [INFO] 完整性检查完成：通过 99.2%
2026-08-11 03:01:20 [WARN] 准确性检查发现 12 条异常（flow_count 为负值）
2026-08-11 03:02:10 [INFO] 一致性检查通过
2026-08-11 03:02:40 [WARN] 唯一性检查发现 8 条重复票号
2026-08-11 03:03:02 [INFO] 任务执行成功，共检查 1,280,450 条数据
2026-08-11 03:03:02 [INFO] 问题数据已生成工单，通知处理人`

const dagNodes = [
  { name: '元数据采集任务', status: '已完成' },
  { name: '数据标准映射', status: '已完成' },
  { name: '票务数据质量检查（当前）', status: '运行中' },
  { name: '问题工单生成', status: '待执行' },
]

const filteredTasks = computed(() =>
  tasks.value.filter((task) => {
    if (filterTrigger.value && task.trigger !== filterTrigger.value) return false
    if (filterStatus.value && task.status !== filterStatus.value) return false
    if (!keyword.value) return true
    const kw = keyword.value.toLowerCase()
    return task.name.toLowerCase().includes(kw) || task.owner.toLowerCase().includes(kw)
  }),
)

const openCreate = () => {
  Object.assign(createForm, { name: '', trigger: '周期调度', schedule: '每日 03:00', scope: '票务核心库', incremental: true })
  createVisible.value = true
}

const saveCreate = () => {
  if (!createForm.name.trim()) {
    ElMessage.warning('请输入任务名称')
    return
  }
  tasks.value.unshift({
    id: `qt-mock-${Date.now()}`,
    name: createForm.name,
    ruleCount: 8,
    trigger: createForm.trigger as '周期调度' | '实时触发' | '手动执行',
    schedule: createForm.schedule,
    status: '待执行',
    progress: 0,
    passCount: 0,
    problemCount: 0,
    owner: '张三',
    lastRunTime: '-',
    scope: createForm.scope,
    dependencies: '',
  })
  createVisible.value = false
  ElMessage.success('质量任务已创建（Mock）')
}

const showProblems = (row: (typeof tasks.value)[number]) => {
  problemVisible.value = true
}

const showLog = (row: (typeof tasks.value)[number]) => {
  logTaskName.value = row.name
  logVisible.value = true
}

const runTask = (row: (typeof tasks.value)[number]) => {
  row.status = '运行中'
  row.progress = 25
  ElMessage.success(`任务「${row.name}」已触发执行（Mock）`)
}

const showDag = (row: (typeof tasks.value)[number]) => {
  dagVisible.value = true
}
</script>