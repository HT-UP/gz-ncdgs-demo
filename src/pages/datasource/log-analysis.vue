<template>
  <div class="standard-page">
    <el-card shadow="never">
      <div class="panel-header">
        数据源日志分析
        <div class="panel-actions">
          <el-date-picker v-model="range" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" class="search-input" />
          <el-select v-model="source" placeholder="全部数据源" clearable class="filter-select">
            <el-option v-for="s in sourceOptions" :key="s" :label="s" :value="s" />
          </el-select>
          <el-button type="primary" plain>查询分析</el-button>
        </div>
      </div>
      <el-tabs v-model="activeTab">
        <el-tab-pane label="操作画像" name="ops">
          <div class="tab-inner">
            <el-row :gutter="16">
              <el-col :xs="24" :md="9">
                <div class="sub-panel-title">操作类型分布</div>
                <div class="op-legend">
                  <div v-for="o in opTypes" :key="o.name" class="op-item">
                    <span class="op-dot" :style="{ background: o.color }"></span>
                    <span class="op-name">{{ o.name }}</span>
                    <el-progress :percentage="o.percent" :color="o.color" :stroke-width="10" />
                    <b>{{ o.count }}</b>
                  </div>
                </div>
              </el-col>
              <el-col :xs="24" :md="15">
                <div class="sub-panel-title">活跃用户TOP</div>
                <el-table :data="activeUsers" size="small" height="260">
                  <el-table-column prop="user" label="用户" min-width="100" />
                  <el-table-column prop="times" label="操作次数" width="90" />
                  <el-table-column label="主要操作" min-width="180" show-overflow-tooltip>
                    <template #default="{ row }">{{ row.mainProc }}</template>
                  </el-table-column>
                  <el-table-column label="活跃趋势" min-width="130">
                    <template #default>
                      <div class="trend-bars">
                        <i v-for="n in 7" :key="n" :style="{ height: `${15 + Math.random() * 40}%` }"></i>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>
            </el-row>
          </div>
        </el-tab-pane>
        <el-tab-pane label="失败分析" name="fail">
          <div class="tab-inner">
            <el-alert title="近 30 天共发生 126 次失败操作，环比下降 18.2%" type="warning" :closable="false" show-icon class="mb-16" />
            <el-table :data="failLogs" stripe height="320">
              <el-table-column prop="time" label="时间" width="150" />
              <el-table-column prop="source" label="数据源" min-width="140" show-overflow-tooltip />
              <el-table-column prop="proc" label="操作" min-width="150" show-overflow-tooltip />
              <el-table-column label="失败类型" width="120">
                <template #default="{ row }">
                  <el-tag :type="failTag(row.kind)" effect="plain" size="small">{{ row.kind }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="reason" label="失败原因" min-width="180" show-overflow-tooltip />
              <el-table-column label="耗时" width="90">
                <template #default="{ row }">{{ row.cost }}ms</template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
        <el-tab-pane label="性能分析" name="perf">
          <div class="tab-inner">
            <el-row :gutter="16">
              <el-col :xs="24" :md="12">
                <div class="sub-panel-title">平均响应时间（ms）</div>
                <div class="perf-row">
                  <span class="perf-label">查询</span>
                  <el-progress :percentage="68" :stroke-width="12" color="#da251d" />
                  <b>342</b>
                </div>
                <div class="perf-row">
                  <span class="perf-label">写入</span>
                  <el-progress :percentage="45" :stroke-width="12" color="#2b6cb0" />
                  <b>186</b>
                </div>
                <div class="perf-row">
                  <span class="perf-label">DDL</span>
                  <el-progress :percentage="30" :stroke-width="12" color="#00a854" />
                  <b>98</b>
                </div>
              </el-col>
              <el-col :xs="24" :md="12">
                <div class="sub-panel-title">慢查询 TOP5</div>
                <div class="slow-list">
                  <div v-for="(s, i) in slowQueries" :key="i" class="slow-item">
                    <span class="slow-no">{{ i + 1 }}</span>
                    <div class="slow-body">
                      <div class="slow-sql">{{ s.sql }}</div>
                      <div class="slow-meta">{{ s.source }} · {{ s.cost }}ms</div>
                    </div>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-tab-pane>
        <el-tab-pane label="趋势分析" name="trend">
          <div class="tab-inner">
            <div class="sub-panel-title">访问量 / 失败量 7 日趋势</div>
            <div class="trend-chart">
              <div class="trend-axis"></div>
              <div v-for="(t, i) in trendData" :key="i" class="trend-col">
                <div class="trend-total" :style="{ height: `${t.totalPct}%` }" :title="`访问 ${t.total}`"></div>
                <div class="trend-fail" :style="{ height: `${t.failPct}%` }" :title="`失败 ${t.fail}`"></div>
                <span class="trend-day">{{ t.day }}</span>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="安全分析" name="sec">
          <div class="tab-inner">
            <div class="sec-grid">
              <div v-for="s in secItems" :key="s.name" class="sec-card">
                <div class="sec-title">{{ s.name }}</div>
                <div class="sec-value" :style="{ color: s.color }">{{ s.value }}</div>
                <div class="sec-desc">{{ s.desc }}</div>
              </div>
            </div>
            <el-table :data="secLogs" stripe class="mt-12" height="200">
              <el-table-column prop="time" label="时间" width="150" />
              <el-table-column prop="event" label="安全事件" min-width="180" show-overflow-tooltip />
              <el-table-column prop="source" label="数据源" min-width="130" show-overflow-tooltip />
              <el-table-column label="级别" width="90">
                <template #default="{ row }">
                  <el-tag :type="row.level === '高危' ? 'danger' : 'warning'" size="small">{{ row.level }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="status" label="处置状态" width="100" />
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const activeTab = ref('ops')
const range = ref<[string, string] | undefined>(undefined)
const source = ref('')
const sourceOptions = ['地铁线网运营主库', '客流实时采集库', '运营分析数仓', '票务清分预结算库']

const opTypes = [
  { name: '查询', count: 4820, percent: 66, color: '#2b6cb0' },
  { name: '写入', count: 1680, percent: 23, color: '#00a854' },
  { name: 'DDL变更', count: 540, percent: 8, color: '#ed7b2f' },
  { name: '管理操作', count: 220, percent: 3, color: '#8c8c8c' },
]

const activeUsers = [
  { user: '王数据', times: 1260, mainProc: '主题指标查询' },
  { user: '李开发', times: 986, mainProc: 'ETL任务调试' },
  { user: '赵分析', times: 754, mainProc: '报表数据抽取' },
  { user: '钱运营', times: 602, mainProc: '客流看板刷新' },
]

const failLogs = [
  { time: '2026-06-15 14:32:10', source: '客流实时采集库', proc: 'INSERT INTO flows_tb', kind: '权限失败', reason: '写入用户缺少 INSERT 权限', cost: 420 },
  { time: '2026-06-15 13:18:44', source: '设备物联采集域', proc: 'SCAN iot_metrics', kind: '连接失败', reason: 'RegionServer 心跳超时', cost: 8200 },
  { time: '2026-06-14 22:05:30', source: '运营分析数仓', proc: 'SELECT dw_station_stat', kind: '超时失败', reason: '查询超过 30s 超时限制', cost: 30210 },
  { time: '2026-06-14 09:41:15', source: '票务清分预结算库', proc: 'UPDATE t_ticket_clear', kind: '锁冲突', reason: '行锁等待超时', cost: 5100 },
  { time: '2026-06-13 16:22:08', source: '历史归档中心', proc: 'MOVE arch_batch', kind: '解析失败', reason: '文件块校验和异常', cost: 9330 },
]

const slowQueries = [
  { sql: 'SELECT * FROM ods_flows_detail WHERE station = ? AND date > ?', source: '客流实时采集库', cost: 14200 },
  { sql: 'SELECT t.*, r.* FROM ticket t LEFT JOIN refund r ON ...', source: '票务清分预结算库', cost: 9800 },
  { sql: 'SELECT COUNT(*) FROM device_log GROUP BY device_id, date', source: '设备物联采集域', cost: 8640 },
  { sql: 'SELECT SUM(amount) FROM settlement GROUP BY line, direction, hour', source: '运营分析数仓', cost: 7310 },
  { sql: 'SELECT * FROM security_audit WHERE action LIKE ...', source: '安全审计存储库', cost: 6590 },
]

const trendData = [
  { day: '06-10', total: 820, totalPct: 70, fail: 22, failPct: 30 },
  { day: '06-11', total: 860, totalPct: 76, fail: 18, failPct: 26 },
  { day: '06-12', total: 940, totalPct: 84, fail: 25, failPct: 34 },
  { day: '06-13', total: 880, totalPct: 78, fail: 15, failPct: 22 },
  { day: '06-14', total: 1080, totalPct: 94, fail: 20, failPct: 28 },
  { day: '06-15', total: 1150, totalPct: 100, fail: 14, failPct: 20 },
  { day: '06-16', total: 620, totalPct: 55, fail: 6, failPct: 10 },
]

const secItems = [
  { name: '高危越权尝试', value: 6, desc: '已全部阻断并告警', color: '#e34d59' },
  { name: '异常登录', value: 3, desc: '来源IP已拉黑', color: '#ed7b2f' },
  { name: '敏感字段读取', value: 84, desc: '均通过脱敏通道', color: '#2b6cb0' },
  { name: '审计合规率', value: '99.6%', desc: '操作留痕完整', color: '#00a854' },
]

const secLogs = [
  { time: '2026-06-15 23:12:01', event: 'root 用户异地登录尝试', source: '运营分析数仓', level: '高危', status: '已阻断' },
  { time: '2026-06-15 20:48:33', event: '批量导出敏感字段被拦截', source: '票务清分预结算库', level: '高危', status: '已拦截' },
  { time: '2026-06-15 11:05:20', event: '弱口令登录尝试（防暴力破解触发）', source: '客流实时采集库', level: '警告', status: '观察中' },
  { time: '2026-06-14 17:30:42', event: '临时账号权限回收', source: '设备物联采集域', level: '提示', status: '已处置' },
]

function failTag(kind: string) {
  const map: Record<string, 'danger' | 'warning' | 'info'> = { 连接失败: 'danger', 超时失败: 'warning', 权限失败: 'warning', 锁冲突: 'info', 解析失败: 'danger' }
  return map[kind] ?? 'info'
}
</script>

<style scoped>
.tab-inner {
  padding-top: 4px;
}

.sub-panel-title {
  font-size: 13px;
  font-weight: 600;
  color: #4a4a4a;
  margin-bottom: 12px;
  padding-left: 10px;
  border-left: 3px solid #da251d;
}

.op-legend {
  display: grid;
  gap: 12px;
}

.op-item {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.op-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex: none;
}

.op-name {
  width: 64px;
  flex: none;
  color: #4a4a4a;
  font-size: 13px;
}

.op-item .el-progress {
  flex: 1;
  min-width: 0;
}

.op-item b {
  width: 42px;
  text-align: right;
  color: #4a4a4a;
}

.trend-bars {
  display: flex;
  align-items: flex-end;
  gap: 3px;
  height: 26px;
}

.trend-bars i {
  width: 6px;
  border-radius: 2px;
  background: #da251d;
}

.perf-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
  min-width: 0;
}

.perf-label {
  width: 64px;
  flex: none;
  color: #4a4a4a;
  font-size: 13px;
}

.perf-row .el-progress {
  flex: 1;
  min-width: 0;
}

.perf-row b {
  width: 44px;
  text-align: right;
  color: #4a4a4a;
}

.slow-list {
  display: grid;
  gap: 8px;
}

.slow-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 8px 10px;
  background: #fafafa;
  border: 1px solid #edf0f5;
  border-radius: 8px;
  min-width: 0;
}

.slow-no {
  width: 18px;
  height: 18px;
  flex: none;
  border-radius: 50%;
  background: #da251d;
  color: #fff;
  font-size: 11px;
  display: grid;
  place-items: center;
  margin-top: 2px;
}

.slow-body {
  flex: 1;
  min-width: 0;
}

.slow-sql {
  font-family: Consolas, Menlo, monospace;
  font-size: 12px;
  color: #4a4a4a;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.slow-meta {
  margin-top: 2px;
  color: #8c8c8c;
  font-size: 11px;
}

.trend-chart {
  display: flex;
  align-items: flex-end;
  gap: 10px;
  height: 220px;
  padding: 0 8px;
  position: relative;
  border-bottom: 1px solid #e4e7ed;
  padding-bottom: 26px;
}

.trend-col {
  position: relative;
  flex: 1;
  height: 194px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 4px;
  min-width: 0;
}

.trend-total {
  width: 18px;
  max-height: 170px;
  border-radius: 4px 4px 0 0;
  background: linear-gradient(180deg, #da251d, #e5716b);
}

.trend-fail {
  width: 14px;
  max-height: 60px;
  border-radius: 4px 4px 0 0;
  background: #3a3a3a;
}

.trend-day {
  position: absolute;
  bottom: -24px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 11px;
  color: #8c8c8c;
  white-space: nowrap;
}

.sec-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
}

.sec-card {
  padding: 14px 16px;
  background: #fafafa;
  border: 1px solid #edf0f5;
  border-radius: 8px;
}

.sec-title {
  color: #8c8c8c;
  font-size: 12px;
}

.sec-value {
  margin-top: 6px;
  font-size: 26px;
  font-weight: 700;
}

.sec-desc {
  margin-top: 4px;
  color: #8c8c8c;
  font-size: 12px;
}
</style>