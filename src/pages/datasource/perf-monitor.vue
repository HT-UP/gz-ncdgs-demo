<template>
  <div class="standard-page">
    <el-card shadow="never">
      <div class="panel-header">
        数据源性能监控
        <div class="panel-actions">
          <el-select v-model="scope" class="filter-select">
            <el-option v-for="s in scopes" :key="s" :label="s" :value="s" />
          </el-select>
          <el-button type="primary" plain>实时刷新</el-button>
        </div>
      </div>

      <el-row :gutter="16">
        <el-col v-for="m in metrics" :key="m.name" :xs="24" :md="6">
          <div class="metric-box">
            <div class="metric-name">{{ m.name }}</div>
            <div class="metric-main">
              <span class="metric-value" :style="{ color: m.color }">{{ m.value }}</span>
              <span class="metric-unit">{{ m.unit }}</span>
              <span class="metric-trend" :style="{ color: m.trend > 0 ? '#e34d59' : '#00a854' }">
                {{ m.trend > 0 ? '+' : '' }}{{ m.trend }}%
              </span>
            </div>
            <div class="metric-sub">{{ m.desc }}</div>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <el-card shadow="never">
      <div class="panel-header">实时指标曲线（近 1 小时）</div>
      <div class="chart-wrap">
        <div class="chart-legend">
          <span v-for="l in chartLines" :key="l.name" class="legend-item">
            <i :style="{ background: l.color }"></i>{{ l.name }}
          </span>
        </div>
        <div class="line-chart">
          <div class="line-y"></div>
          <div class="line-rows">
            <i v-for="line in chartLines" :key="line.name" class="line-row" :style="{ background: line.color, width: `${line.width}%` }" />
          </div>
          <div class="line-x">
            <span v-for="(t) in timeLabels" :key="t">{{ t }}</span>
          </div>
        </div>
      </div>
    </el-card>

    <el-card shadow="never">
      <div class="panel-header">
        采集任务性能明细
        <div class="panel-actions">
          <el-input v-model="keyword" placeholder="搜索任务" clearable class="search-input" />
        </div>
      </div>
      <el-table :data="tasks" stripe height="360">
        <el-table-column prop="name" label="任务名称" min-width="180" show-overflow-tooltip />
        <el-table-column prop="type" label="类型" width="120" />
        <el-table-column prop="source" label="数据源" min-width="140" show-overflow-tooltip />
        <el-table-column label="状态" width="90">
          <template #default="{ row }">
            <el-tag :type="row.status === '运行中' ? 'success' : row.status === '异常' ? 'danger' : 'info'" effect="light" size="small">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="records" label="处理记录" width="100" />
        <el-table-column label="吞吐" width="110">
          <template #default="{ row }">{{ row.throughput }} 条/s</template>
        </el-table-column>
        <el-table-column label="平均耗时" width="110">
          <template #default="{ row }">{{ row.cost }}ms</template>
        </el-table-column>
        <el-table-column label="资源占用" min-width="150">
          <template #default="{ row }">
            <div class="res-cell">
              <span>CPU</span><el-progress :percentage="row.cpu" :stroke-width="8" :color="pctColor(row.cpu)" />
              <span>MEM</span><el-progress :percentage="row.mem" :stroke-width="8" :color="pctColor(row.mem)" />
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const scope = ref('数仓数据库')
const scopes = ['数仓数据库', '大数据平台', '全部']

const metrics = [
  { name: '平均查询响应', value: 328, unit: 'ms', trend: -6.4, desc: '较昨日下降 6.4%', color: '#00a854' },
  { name: '写入吞吐', value: 1.86, unit: '万条/s', trend: 4.2, desc: 'QPS 峰值 2.4万', color: '#2b6cb0' },
  { name: 'CPU 利用率', value: 58.3, unit: '%', trend: 8.1, desc: '峰值 82%', color: '#ed7b2f' },
  { name: '内存利用率', value: 66.8, unit: '%', trend: 2.5, desc: '峰值 74%', color: '#da251d' },
]

const chartLines = [
  { name: '查询响应(ms)', color: '#da251d', width: 12 },
  { name: 'CPU(%)', color: '#2b6cb0', width: 8 },
  { name: '吞吐(万/s)', color: '#00a854', width: 5 },
]

const timeLabels = ['10:00', '10:10', '10:20', '10:30', '10:40', '10:50', '11:00']

const keyword = ref('')

const tasks = [
  { name: 'ODS订单增量采集', type: '增量采集', source: '客票清分库', status: '运行中', records: 128460, throughput: 2140, cost: 320, cpu: 42, mem: 55 },
  { name: '设备状态批量同步', type: '批量同步', source: '设备物联采集域', status: '运行中', records: 36520, throughput: 610, cost: 880, cpu: 38, mem: 60 },
  { name: '客流断面实时上报', type: '实时接入', source: '客流实时采集库', status: '运行中', records: 892340, throughput: 8270, cost: 96, cpu: 72, mem: 78 },
  { name: '安全日志汇聚', type: '日志采集', source: '安全审计存储库', status: '运行中', records: 51280, throughput: 428, cost: 450, cpu: 29, mem: 41 },
  { name: '信号系统增量抽取', type: '增量采集', source: '信号系统明细库', status: '异常', records: 0, throughput: 0, cost: 0, cpu: 12, mem: 30 },
  { name: '票务清分结算快照', type: '定时快照', source: '票务清分预结算库', status: '运行中', records: 4620, throughput: 156, cost: 2100, cpu: 35, mem: 48 },
]

const filtered = computed(() => tasks.filter((t) => !keyword.value || t.name.includes(keyword.value) || t.source.includes(keyword.value)))

function pctColor(v: number) {
  if (v < 50) return '#00a854'
  if (v < 75) return '#ed7b2f'
  return '#e34d59'
}
</script>

<style scoped>
.standard-page {
  display: grid;
  gap: 16px;
}

.metric-box {
  padding: 14px 16px;
  background: #fafafa;
  border: 1px solid #edf0f5;
  border-radius: 10px;
}

.metric-name {
  color: #8c8c8c;
  font-size: 12px;
}

.metric-main {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-top: 4px;
  min-width: 0;
}

.metric-value {
  font-size: 26px;
  font-weight: 700;
}

.metric-unit {
  color: #8c8c8c;
  font-size: 12px;
}

.metric-trend {
  margin-left: auto;
  font-size: 12px;
  font-weight: 600;
}

.metric-sub {
  margin-top: 4px;
  color: #8c8c8c;
  font-size: 11px;
}

.chart-wrap {
  padding: 6px 2px;
}

.chart-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-bottom: 14px;
}

.legend-item {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: #8c8c8c;
}

.legend-item i {
  width: 12px;
  height: 4px;
  border-radius: 2px;
}

.line-chart {
  height: 180px;
  position: relative;
  padding-bottom: 22px;
}

.line-rows {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 22px;
  display: flex;
  align-items: flex-end;
  gap: 10px;
  padding: 0 6px;
  border-bottom: 1px solid #e4e7ed;
}

.line-row {
  flex: 1;
  border-radius: 3px 3px 0 0;
  max-height: 100%;
  min-width: 0;
  opacity: 0.85;
}

.line-x {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #8c8c8c;
}

.res-cell {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: #8c8c8c;
  min-width: 0;
}

.res-cell .el-progress {
  width: 46px;
  flex: none;
}

.res-cell span {
  flex: none;
}
</style>