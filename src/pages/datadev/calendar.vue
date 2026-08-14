<template>
  <div class="standard-page">
    <el-card shadow="never">
      <div class="panel-header">
        调度日历
        <div class="panel-actions">
          <el-button-group>
            <el-button size="small" @click="shiftMonth(-1)">‹ 上月</el-button>
            <el-button size="small" @click="shiftMonth(1)">下月 ›</el-button>
          </el-button-group>
          <el-button type="danger" plain size="small">冲突检测</el-button>
        </div>
      </div>

      <div class="cal-toolbar">
        <span class="cal-month">{{ displayMonth }}</span>
        <div class="cal-legend">
          <span class="cal-legend-item"><i style="background: #da251d"></i>有任务</span>
          <span class="cal-legend-item"><i style="background: #ed7b2f"></i>任务冲突</span>
          <span class="cal-legend-item"><i style="background: #2b6cb0"></i>需补跑</span>
        </div>
      </div>

      <div class="cal-grid">
        <div class="cal-head" v-for="d in weekDays" :key="d">{{ d }}</div>
        <div v-for="cell in cells" :key="cell.key" class="cal-cell" :class="{ other: !cell.current, today: cell.today }">
          <div class="cal-day">{{ cell.day }}</div>
          <div v-for="t in cell.tasks" :key="t.name" class="cal-task" :class="t.kind" @click="openDetail(t)">
            <span class="cal-task-time">{{ t.time }}</span>
            <span class="cal-task-name">{{ t.name }}</span>
          </div>
        </div>
      </div>
    </el-card>

    <el-dialog v-model="detailVisible" title="任务调度详情" width="520px">
      <template v-if="activeTask">
        <el-descriptions :column="2" border size="small">
          <el-descriptions-item label="任务">{{ activeTask.name }}</el-descriptions-item>
          <el-descriptions-item label="调度时间">{{ activeTask.time }}</el-descriptions-item>
          <el-descriptions-item label="调度类型">{{ activeTask.type }}</el-descriptions-item>
          <el-descriptions-item label="优先级">{{ activeTask.priority }}</el-descriptions-item>
          <el-descriptions-item label="执行节点">{{ activeTask.node }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag size="small" :type="activeTask.kind === 'conflict' ? 'warning' : 'primary'" effect="light">{{ activeTask.kind === 'conflict' ? '冲突' : '正常' }}</el-tag>
          </el-descriptions-item>
        </el-descriptions>
        <div class="dlg-actions">
          <el-button type="primary" @click="ElMessage.success('已提交补跑')">立即补跑</el-button>
          <el-button @click="ElMessage.success('已加入队列')">加入队列</el-button>
          <el-button>变更调度</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'

const year = ref(2026)
const month = ref(5)
const detailVisible = ref(false)
const activeTask = ref<null | TaskItem>(null)

const weekDays = ['一', '二', '三', '四', '五', '六', '日']

type TaskItem = { name: string; time: string; kind: 'task' | 'conflict' | 'backfill'; type: string; priority: string; node: string }

const tasksMap: Record<string, TaskItem[]> = {
  '1': [
    { name: 'ODS_客流明细_实时', time: '10:00', kind: 'task', type: '实时', priority: 'P0', node: '节点-02' },
    { name: 'DWD_票务清分_小时', time: '11:00', kind: 'task', type: '小时', priority: 'P1', node: '节点-01' },
  ],
  '3': [
    { name: 'DWS_运营指标_日', time: '06:00', kind: 'conflict', type: '日调度', priority: 'P1', node: '节点-03' },
    { name: 'ADS_报表数据_日', time: '06:00', kind: 'conflict', type: '日调度', priority: 'P2', node: '节点-04' },
  ],
  '5': [{ name: 'SIG_信号接口_增量', time: '09:15', kind: 'backfill', type: '增量', priority: 'P1', node: '节点-02' }],
  '8': [{ name: '归档_历史快照', time: '07:00', kind: 'task', type: '日调度', priority: 'P3', node: '节点-01' }],
  '12': [{ name: '设备状态_实时接入', time: '每5min', kind: 'task', type: '实时', priority: 'P1', node: '节点-02' }],
  '15': [{ name: '安全日志汇聚', time: '05:30', kind: 'task', type: '日调度', priority: 'P2', node: '节点-03' }],
  '20': [{ name: '客流断面_周报数据', time: '08:00', kind: 'backfill', type: '周调度', priority: 'P2', node: '节点-01' }],
  '23': [{ name: '票务月度清分', time: '02:00', kind: 'task', type: '月调度', priority: 'P1', node: '节点-04' }],
  '28': [{ name: '大屏刷新任务', time: '00:05', kind: 'task', type: '日调度', priority: 'P2', node: '节点-01' }],
}

const displayMonth = computed(() => `${year.value} 年 ${month.value + 1} 月`)

const cells = computed(() => {
  const first = new Date(year.value, month.value, 1)
  const startIdx = (first.getDay() + 6) % 7
  const last = new Date(year.value, month.value + 1, 0).getDate()
  const prevLast = new Date(year.value, month.value, 0).getDate()
  const list: { key: string; day: number; current: boolean; tasks: TaskItem[]; today: boolean }[] = []
  for (let i = startIdx - 1; i >= 0; i -= 1) {
    list.push({ key: `p${i}`, day: prevLast - i, current: false, tasks: [], today: false })
  }
  const now = new Date()
  for (let d = 1; d <= last; d += 1) {
    const today = now.getFullYear() === year.value && now.getMonth() === month.value && now.getDate() === d
    list.push({ key: `c${d}`, day: d, current: true, tasks: tasksMap[String(d)] ?? [], today })
  }
  let nx = 1
  while (list.length % 7 !== 0) {
    list.push({ key: `n${nx}`, day: nx, current: false, tasks: [], today: false })
    nx += 1
  }
  return list
})

function shiftMonth(delta: number) {
  month.value += delta
  if (month.value > 11) {
    month.value = 0
    year.value += 1
  } else if (month.value < 0) {
    month.value = 11
    year.value -= 1
  }
}

function openDetail(t: TaskItem) {
  activeTask.value = t
  detailVisible.value = true
}
</script>

<style scoped>
.standard-page {
  display: grid;
  gap: 16px;
}

.cal-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
  padding: 6px 0 12px;
}

.cal-month {
  font-size: 16px;
  font-weight: 700;
  color: #4a4a4a;
}

.cal-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
}

.cal-legend-item {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: #8c8c8c;
}

.cal-legend-item i {
  width: 10px;
  height: 10px;
  border-radius: 3px;
}

.cal-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
  min-width: 0;
  overflow: hidden;
}

@media (max-width: 900px) {
  .cal-grid {
    min-width: 760px;
  }
}

.cal-head {
  text-align: center;
  font-size: 12px;
  color: #8c8c8c;
  padding: 6px 0;
}

.cal-cell {
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  min-height: 96px;
  padding: 6px;
  background: #fff;
  min-width: 0;
  overflow: hidden;
}

.cal-cell.other {
  background: #fafafa;
  opacity: 0.6;
}

.cal-cell.today {
  border-color: #da251d;
  box-shadow: 0 0 0 1px #da251d inset;
}

.cal-day {
  font-size: 12px;
  color: #4a4a4a;
  font-weight: 600;
  margin-bottom: 4px;
}

.cal-task {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 6px;
  margin-bottom: 3px;
  border-radius: 5px;
  font-size: 11px;
  color: #fff;
  cursor: pointer;
  min-width: 0;
  overflow: hidden;
}

.cal-task.task {
  background: #da251d;
}

.cal-task.conflict {
  background: #ed7b2f;
}

.cal-task.backfill {
  background: #2b6cb0;
}

.cal-task-time {
  flex: none;
  opacity: 0.9;
}

.cal-task-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dlg-actions {
  display: flex;
  gap: 10px;
  margin-top: 16px;
  justify-content: flex-end;
}
</style>