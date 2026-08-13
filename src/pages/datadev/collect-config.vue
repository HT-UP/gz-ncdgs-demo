<template>
  <div class="standard-page collect-config-page">
    <el-tabs v-model="activeTab" type="border-card" stretch class="collect-tabs">
      <!-- 调度日历 -->
      <el-tab-pane label="调度日历" name="calendar">
        <div class="calendar-grid">
          <div class="cal-main">
            <el-calendar v-model="currentDate">
              <template #date-cell="{ data }">
                <div class="cal-cell" :class="{ 'cal-day-selected': selectedDay === data.day }" @click="selectedDay = data.day">
                  <div class="cal-day-num">{{ data.day.split('-')[2] }}</div>
                  <div v-if="schedMap[data.day]" class="cal-task-nums">
                    <span class="cal-ok">{{ schedMap[data.day].success }}</span>
                    <span v-if="schedMap[data.day].failed" class="cal-bad">{{ schedMap[data.day].failed }}</span>
                  </div>
                </div>
              </template>
            </el-calendar>
          </div>
          <div class="cal-side">
            <div class="side-title">{{ selectedDay }} 调度计划</div>
            <div v-for="t in selectedDayPlans" :key="t.id" class="plan-item">
              <span class="plan-time">{{ t.time }}</span>
              <span class="plan-name">{{ t.name }}</span>
              <el-tag size="small" :type="t.ok ? 'success' : 'warning'" effect="dark">{{ t.ok ? '成功' : '失败' }}</el-tag>
            </div>
          </div>
        </div>
      </el-tab-pane>

      <!-- 数据比对 -->
      <el-tab-pane label="数据比对" name="compare">
        <div class="toolbar-row">
          <el-input v-model="compareKw" placeholder="按任务 / 数据源搜索" clearable class="search-input" :prefix-icon="Search" />
          <el-button type="danger" plain :icon="RefreshRight" @click="runCompare">立即比对</el-button>
        </div>
        <el-table :data="compareTasks" size="small" stripe class="mt-12">
          <el-table-column prop="name" label="比对任务" min-width="150" />
          <el-table-column prop="source" label="源端" min-width="120" />
          <el-table-column prop="target" label="目标端" min-width="120" />
          <el-table-column label="源记录数" width="100" align="right">
            <template #default="{ row }">{{ row.srcCnt }}</template>
          </el-table-column>
          <el-table-column label="目标记录数" width="100" align="right">
            <template #default="{ row }">{{ row.tgtCnt }}</template>
          </el-table-column>
          <el-table-column label="差异数" width="90" align="right">
            <template #default="{ row }">
              <span :class="row.diff === 0 ? 'trend-positive' : 'trend-negative'">{{ row.diff }}</span>
            </template>
          </el-table-column>
          <el-table-column label="结果" width="90">
            <template #default="{ row }">
              <el-tag size="small" :type="row.diff === 0 ? 'success' : 'danger'" effect="dark">{{ row.diff === 0 ? '一致' : '存在差异' }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="last" label="最近比对" width="110" />
        </el-table>
      </el-tab-pane>

      <!-- 流批一体 -->
      <el-tab-pane label="流批一体" name="unified">
        <div class="unified-grid">
          <div v-for="u in unifiedJobs" :key="u.logic" class="unified-card">
            <div class="unified-head">
              <span class="unified-logic">{{ u.logic }}</span>
              <el-tag size="small" type="success" effect="plain">双链路</el-tag>
            </div>
            <div class="unified-row">
              <span class="unified-side">批</span>
              <span class="unified-name">{{ u.batch.name }}</span>
              <span class="dep-text">{{ u.batch.cycle }}</span>
            </div>
            <div class="unified-row">
              <span class="unified-side">流</span>
              <span class="unified-name">{{ u.stream.name }}</span>
              <span class="dep-text">{{ u.stream.window }}</span>
            </div>
            <div class="unified-note">{{ u.note }}</div>
          </div>
        </div>
      </el-tab-pane>

      <!-- AI 辅助配置 -->
      <el-tab-pane label="AI 辅助配置" name="ai">
        <div class="toolbar-row">
          <el-tag size="small" type="info" effect="plain">AI 辅助已启用 · 本月建议 24 条 · 采纳率 83%</el-tag>
        </div>
        <el-table :data="aiSuggests" size="small" stripe class="mt-12">
          <el-table-column prop="type" label="建议类型" width="110" />
          <el-table-column prop="content" label="建议内容" min-width="260" />
          <el-table-column prop="conf" label="置信度" width="90" align="center">
            <template #default="{ row }"><span class="trend-positive">{{ row.conf }}%</span></template>
          </el-table-column>
          <el-table-column label="操作" width="170">
            <template #default="{ row }">
              <el-button v-if="row.status === '待处理'" size="small" type="primary" link @click="applySug(row)">一键采纳</el-button>
              <el-button v-if="row.status === '待处理'" size="small" type="info" link @click="ignoreSug(row)">忽略</el-button>
              <span v-else class="dep-text">{{ row.status }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { RefreshRight, Search } from '@element-plus/icons-vue'

const activeTab = ref('calendar')
const currentDate = ref(new Date('2026-08-13'))
const selectedDay = ref('2026-08-13')

const schedMap: Record<string, { success: number; failed: number }> = {
  '2026-08-01': { success: 18, failed: 0 },
  '2026-08-02': { success: 20, failed: 1 },
  '2026-08-03': { success: 19, failed: 0 },
  '2026-08-04': { success: 22, failed: 0 },
  '2026-08-05': { success: 21, failed: 1 },
  '2026-08-06': { success: 19, failed: 0 },
  '2026-08-07': { success: 20, failed: 0 },
  '2026-08-08': { success: 18, failed: 0 },
  '2026-08-09': { success: 17, failed: 1 },
  '2026-08-10': { success: 22, failed: 0 },
  '2026-08-11': { success: 23, failed: 0 },
  '2026-08-12': { success: 20, failed: 1 },
  '2026-08-13': { success: 21, failed: 1 },
}

const plansMap: Record<string, { id: number; time: string; name: string; ok: boolean }[]> = {
  '2026-08-13': [
    { id: 1, time: '02:00', name: '全量采集-票务库', ok: true },
    { id: 2, time: '02:30', name: '增量采集-实名库', ok: true },
    { id: 3, time: '06:00', name: '指标重算-客流事实', ok: true },
    { id: 4, time: '10:00', name: '流批合并-订单汇总', ok: false },
  ],
}

const selectedDayPlans = computed(() => plansMap[selectedDay.value] ?? [])

const compareKw = ref('')
const compareTasks = ref([
  { name: '票务明细-全量比对', source: 'MySQL', target: 'Doris', srcCnt: 1280452, tgtCnt: 1280452, diff: 0, last: '2026-08-13 02:10' },
  { name: '客流事实-增量比对', source: 'Kafka', target: 'Doris', srcCnt: 86412, tgtCnt: 86394, diff: 18, last: '2026-08-13 10:30' },
  { name: '订单汇总-日比对', source: 'Oracle', target: 'Hive', srcCnt: 324900, tgtCnt: 324880, diff: 20, last: '2026-08-13 03:00' },
  { name: '车站档案-全量比对', source: 'MySQL', target: 'Redis', srcCnt: 56208, tgtCnt: 56208, diff: 0, last: '2026-08-12 02:00' },
])

const runCompare = () => ElMessage.success('已触发 4 个数据比对任务（Mock）')

const unifiedJobs = [
  { logic: '客流日指标计算', batch: { name: '批-客流指标加工', cycle: '每日 03:00' }, stream: { name: '流-客流实时聚合', window: '5min 窗口' }, note: '共用口径：乘客数、拥挤度、周转量' },
  { logic: '欠费订单识别', batch: { name: '批-欠费扫描', cycle: '每日 02:00' }, stream: { name: '流-欠费实时告警', window: '1min 窗口' }, note: '共用规则引擎：阈值 + 规则模板' },
  { logic: '车站拥挤度评估', batch: { name: '批-拥挤度评级', cycle: '每小时' }, stream: { name: '流-拥挤度快照', window: '10s 窗口' }, note: '共用模型：CNN 客流预测' },
]

const aiSuggests = ref([
  { type: '字段映射', content: '新增字段 station_name 建议映射至站点档案维度表 dim_station_info.station_name（语义相似度 0.93）', conf: 93, status: '待处理' },
  { type: '分区裁剪', content: '表 dws_ticket_daily 近 30 日按 line_code 分区可裁剪 62% 扫描量，建议启用动态分区', conf: 88, status: '待处理' },
  { type: '参数调优', content: '客流事件流 batchSize 建议由 1000 提升至 2000，延迟预计下降 34%', conf: 82, status: '待处理' },
  { type: '调度建议', content: '票务增量采集由每 30 分钟调整为每 10 分钟，可满足实时看板 SLA', conf: 90, status: '已采纳' },
])

const applySug = (row: (typeof aiSuggests.value)[number]) => {
  row.status = '已采纳'
  ElMessage.success('AI 建议已应用（Mock）')
}

const ignoreSug = (row: (typeof aiSuggests.value)[number]) => {
  row.status = '已忽略'
  ElMessage.info('已忽略该建议')
}
</script>

<style lang="scss" scoped>
.collect-config-page {
  :deep(.el-tabs__content) {
    min-height: 420px;
  }
}

.calendar-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 280px;
  gap: 16px;
}

.cal-main {
  min-width: 0;
  overflow-x: auto;

  :deep(.el-calendar) {
    width: 100%;
    min-width: 0;
  }
}

.cal-cell {
  min-height: 56px;
  cursor: pointer;
  border-radius: 6px;
  padding: 4px;
}

.cal-day-selected {
  background: rgba(218, 37, 29, 0.08);
}

.cal-day-num {
  font-weight: 600;
  color: #4a4a4a;
}

.cal-task-nums {
  display: flex;
  gap: 6px;
  margin-top: 2px;
  font-size: 11px;
}

.cal-ok {
  color: #00a854;
}

.cal-bad {
  color: #da251d;
}

.cal-side {
  border-left: 1px solid #e4e7ed;
  padding-left: 14px;
}

.side-title {
  font-weight: 700;
  color: #4a4a4a;
  margin-bottom: 12px;
}

.plan-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  border-bottom: 1px dashed #edf0f5;
  font-size: 12px;
}

.plan-time {
  color: #8c8c8c;
}

.plan-name {
  flex: 1;
  color: #4a4a4a;
}

.mt-12 {
  margin-top: 12px;
}

.unified-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 12px;
}

.unified-card {
  border: 1px solid #e4e7ed;
  border-radius: 10px;
  padding: 14px;
}

.unified-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.unified-logic {
  font-weight: 700;
  color: #4a4a4a;
  font-size: 14px;
}

.unified-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 0;
  font-size: 12px;
}

.unified-side {
  width: 22px;
  height: 22px;
  flex: none;
  border-radius: 6px;
  display: grid;
  place-items: center;
  background: rgba(43, 108, 176, 0.1);
  color: #2b6cb0;
  font-weight: 700;
}

.unified-name {
  flex: 1;
  color: #4a4a4a;
}

.unified-note {
  margin-top: 8px;
  padding: 8px 10px;
  border-radius: 6px;
  background: #fafbfd;
  color: #8c8c8c;
  font-size: 12px;
}
</style>