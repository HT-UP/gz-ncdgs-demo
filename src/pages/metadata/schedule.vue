<template>
  <div class="standard-page meta-schedule-page">
    <!-- 采集概览看板 -->
    <div class="ovw-grid">
      <div v-for="o in overview" :key="o.label" class="ovw-card">
        <div class="ovw-num" :style="{ color: o.color }">{{ o.value }}</div>
        <div class="ovw-label">{{ o.label }}</div>
        <div class="ovw-note">{{ o.note }}</div>
      </div>
    </div>

    <!-- 三种调度方式 -->
    <div class="sec-title">调度方式</div>
    <div class="mode-grid">
      <div v-for="m in modes" :key="m.name" class="mode-card">
        <div class="mode-head">
          <span class="mode-name">{{ m.name }}</span>
          <el-tag size="small" :type="m.enabled ? 'success' : 'info'" effect="dark">{{ m.enabled ? '已启用' : '已停用' }}</el-tag>
        </div>
        <div class="mode-desc">{{ m.desc }}</div>
        <div class="mode-meta dep-text">适用：{{ m.scope }} · {{ m.tasks }} 个任务</div>
      </div>
    </div>

    <el-card class="panel-card mt-16" shadow="never">
      <template #header>
        <div class="panel-header">
          <span>采集调度任务</span>
          <el-button type="danger" :icon="Plus" @click="addTask">新建采集任务</el-button>
        </div>
      </template>
      <el-table :data="tasks" size="small" stripe>
        <el-table-column prop="name" label="采集任务" min-width="150" />
        <el-table-column prop="source" label="数据源" min-width="110" />
        <el-table-column label="调度方式" width="100">
          <template #default="{ row }">
            <el-tag size="small" :type="modeType[row.mode]" effect="plain">{{ row.mode }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="cycle" label="调度周期" width="110" />
        <el-table-column label="状态" width="90">
          <template #default="{ row }">
            <el-tag size="small" :type="statusType[row.status]" effect="dark">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="失败处理" min-width="130">
          <template #default="{ row }">{{ row.failPolicy }}</template>
        </el-table-column>
        <el-table-column prop="last" label="最近执行" width="110" />
      </el-table>
    </el-card>

    <el-card class="panel-card mt-16" shadow="never">
      <template #header>
        <div class="panel-header">
          <span>失败处理机制</span>
          <el-tag size="small" type="warning" effect="plain">今日失败 {{ failedTasks.length }} 个</el-tag>
        </div>
      </template>
      <div class="fail-grid">
        <div class="fail-policy">
          <div class="policy-title">自动重试</div>
          <div class="policy-desc">默认指数退避重试 3 次（间隔 1min/5min/15min），重试成功后自动恢复。</div>
          <el-tag size="small" type="success" effect="plain">已启用</el-tag>
        </div>
        <div class="fail-policy">
          <div class="policy-title">告警通知</div>
          <div class="policy-desc">连续失败触发站内信 + 企业微信告警，通知任务责任人。</div>
          <el-tag size="small" type="success" effect="plain">已启用</el-tag>
        </div>
        <div class="fail-policy">
          <div class="policy-title">人工补救</div>
          <div class="policy-desc">支持断点续采 / 增量补偿 / 手工导入，失败数据可追溯。</div>
          <el-tag size="small" type="warning" effect="plain">按需</el-tag>
        </div>
      </div>
      <div class="mt-12">
        <div v-for="f in failedTasks" :key="f.id" class="fail-item">
          <el-tag size="small" type="danger" effect="dark">失败</el-tag>
          <span class="fail-name">{{ f.name }}</span>
          <span class="fail-reason dep-text">{{ f.reason }}</span>
          <el-button size="small" link type="primary" @click="retry(f)">重试</el-button>
          <el-button size="small" link type="warning" @click="remedy(f)">人工补救</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

const overview = [
  { label: '接入采集源', value: '32', note: '+3 本周', color: '#da251d' },
  { label: '今日采集表', value: '1,284', note: '较昨日 +6.2%', color: '#2b6cb0' },
  { label: '采集成功率', value: '99.2%', note: '近 7 日', color: '#00a854' },
  { label: '平均耗时', value: '12.6s', note: '单任务', color: '#ed7b2f' },
]

const modes = [
  { name: '全量调度', enabled: true, desc: '定期对数据源全量采集，适合数据量小、变更不频繁的元数据。', scope: '基础信息 / 档案类', tasks: 12 },
  { name: '增量调度', enabled: true, desc: '基于时间戳或水位线采集增量变化，降低资源开销。', scope: '运营流水 / 业务表', tasks: 15 },
  { name: '变更捕获', enabled: true, desc: '通过日志/CDC 实时捕获结构变更，秒级同步元数据。', scope: '核心表 / 实时需求', tasks: 5 },
]

const modeType: Record<string, 'primary' | 'success' | 'warning'> = { 全量调度: 'primary', 增量调度: 'success', 变更捕获: 'warning' }
const statusType: Record<string, 'success' | 'warning' | 'danger' | 'info'> = { 运行中: 'success', 待执行: 'info', 已失败: 'danger' }

const tasks = ref([
  { id: 1, name: '生产库-全量采集', source: '票务库', mode: '全量调度', cycle: '每日 02:00', status: '运行中', failPolicy: '重试 3 次 + 告警', last: '08-13 02:12' },
  { id: 2, name: '生产库-增量采集', source: '票务库', mode: '增量调度', cycle: '每 10 分钟', status: '运行中', failPolicy: '断点续采 + 告警', last: '08-13 10:30' },
  { id: 3, name: '财务共享-变更捕获', source: '财务库', mode: '变更捕获', cycle: '实时', status: '运行中', failPolicy: '重放补偿 + 告警', last: '08-13 10:31' },
  { id: 4, name: '运营日志-增量采集', source: '日志仓', mode: '增量调度', cycle: '每 5 分钟', status: '待执行', failPolicy: '重试 3 次 + 告警', last: '08-13 10:25' },
  { id: 5, name: '设备档案-全量采集', source: '设备库', mode: '全量调度', cycle: '每周日 03:00', status: '已失败', failPolicy: '重试 3 次 + 告警', last: '08-10 03:00' },
])

const failedTasks = computed(() => tasks.value.filter((t) => t.status === '已失败').map((t) => ({ ...t, reason: '连接超时 / 表结构不兼容' })))

const addTask = () => ElMessage.info('打开新建采集任务向导（Mock）')
const retry = (t: { name: string }) => {
  const task = tasks.value.find((x) => x.name === t.name)
  if (task) task.status = '运行中'
  ElMessage.success(`「${t.name}」已触发重试（Mock）`)
}
const remedy = (t: { name: string }) => ElMessage.info(`「${t.name}」进入人工补救流程（Mock）`)
</script>

<style lang="scss" scoped>
.meta-schedule-page {
  display: grid;
  gap: 16px;
}

.ovw-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
}

.ovw-card {
  border: 1px solid #edf0f5;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
  background: #fff;
}

.ovw-num {
  font-size: 26px;
  font-weight: 700;
}

.ovw-label {
  color: #4a4a4a;
  font-size: 13px;
  margin-top: 2px;
}

.ovw-note {
  color: #8c8c8c;
  font-size: 12px;
  margin-top: 4px;
}

.sec-title {
  font-size: 14px;
  font-weight: 700;
  color: #4a4a4a;
  padding-left: 10px;
  border-left: 4px solid #da251d;
}

.mode-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 12px;
}

.mode-card {
  border: 1px solid #e4e7ed;
  border-radius: 10px;
  padding: 14px;
  background: #fff;
}

.mode-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.mode-name {
  font-weight: 700;
  color: #4a4a4a;
}

.mode-desc {
  margin-top: 8px;
  color: #666;
  font-size: 12px;
  line-height: 1.7;
  min-height: 40px;
}

.mode-meta {
  margin-top: 10px;
  font-size: 12px;
}

.mt-16 {
  margin-top: 16px;
}

.mt-12 {
  margin-top: 12px;
}

.fail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 12px;
}

.fail-policy {
  border: 1px solid #edf0f5;
  border-radius: 8px;
  padding: 14px;
}

.policy-title {
  font-weight: 700;
  color: #4a4a4a;
  margin-bottom: 6px;
}

.policy-desc {
  color: #666;
  font-size: 12px;
  line-height: 1.7;
  margin-bottom: 10px;
}

.fail-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px dashed #edf0f5;
  font-size: 12px;
}

.fail-name {
  color: #4a4a4a;
}

.fail-reason {
  flex: 1;
}
</style>