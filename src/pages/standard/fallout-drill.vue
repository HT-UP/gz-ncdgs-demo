<template>
  <div class="standard-page">
    <el-card shadow="never">
      <div class="drill-nav">
        <span class="drill-title">落标率钻取分析</span>
        <el-divider direction="vertical" />
        <span
          v-for="(l, i) in layers"
          :key="l.key"
          class="drill-layer"
          :class="{ active: i === level }"
          @click="level = i"
        >
          {{ l.label }}
        </span>
        <span v-if="path" class="drill-path">当前：{{ path }}</span>
      </div>
    </el-card>

    <!-- 总览层 -->
    <template v-if="level === 0">
      <el-row :gutter="16">
        <el-col :xs="24" :md="8">
          <el-card shadow="never" class="gauge-card">
            <div class="gauge-num">{{ overall.rate }}%</div>
            <div class="gauge-label">总体落标率</div>
            <el-progress :percentage="overall.rate" :show-text="false" :stroke-width="14" color="#da251d" />
            <div class="gauge-meta">统计周期：近 30 天 · 评估资产 {{ overall.total }} 项</div>
          </el-card>
        </el-col>
        <el-col v-for="s in overallStats" :key="s.label" :xs="12" :md="8">
          <el-card shadow="never" class="gauge-card">
            <div class="gauge-num" :style="{ color: s.color }">{{ s.value }}</div>
            <div class="gauge-label">{{ s.label }}</div>
            <div class="gauge-meta">{{ s.desc }}</div>
          </el-card>
        </el-col>
      </el-row>
      <el-card shadow="never">
        <div class="panel-header">近 6 期落标率趋势</div>
        <div class="trend-bars">
          <div v-for="t in trend" :key="t.period" class="trend-col">
            <span class="trend-val">{{ t.rate }}%</span>
            <div class="trend-bar" :style="{ height: t.rate * 2.2 + 'px', background: t.rate > 20 ? '#da251d' : '#00a854' }"></div>
            <span class="trend-period">{{ t.period }}</span>
          </div>
        </div>
      </el-card>
      <el-card shadow="never">
        <div class="panel-header">
          维度入口
          <el-button type="primary" plain size="small" @click="level = 1">进入维度层</el-button>
        </div>
        <div class="dim-grid">
          <div v-for="d in dims" :key="d.name" class="dim-card" @click="enterDim(d.name)">
            <div class="dim-name">{{ d.name }}</div>
            <el-progress :percentage="d.rate" :color="d.rate > 20 ? '#da251d' : '#00a854'" :show-text="false" />
            <div class="dim-meta">落标率 {{ d.rate }}% · 资产 {{ d.count }} 项</div>
          </div>
        </div>
      </el-card>
    </template>

    <!-- 维度层 -->
    <template v-else-if="level === 1">
      <el-card shadow="never">
        <div class="panel-header">
          {{ selectedDim || '全部业务域' }} · 维度落标分析
          <div class="panel-actions">
            <el-button size="small" @click="level = 0">返回总览</el-button>
          </div>
        </div>
        <el-table :data="dimRows" stripe height="400" @row-click="enterDetail">
          <el-table-column prop="domain" label="业务域 / 主题域" min-width="200" />
          <el-table-column prop="assets" label="资产数" width="90" />
          <el-table-column label="落标数" width="90">
            <template #default="{ row }"><b class="text-red">{{ row.failed }}</b></template>
          </el-table-column>
          <el-table-column label="落标率" width="200">
            <template #default="{ row }">
              <div class="rate-cell">
                <el-progress :percentage="row.rate" :color="row.rate > 20 ? '#da251d' : '#00a854'" :show-text="false" :stroke-width="8" />
                <span>{{ row.rate }}%</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="level" label="落标层级" width="110">
            <template #default="{ row }">
              <el-tag :type="row.level === '严重' ? 'danger' : row.level === '中度' ? 'warning' : 'info'" size="small">{{ row.level }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="90" fixed="right">
            <template #default>
              <el-button link type="primary" size="small">钻取明细</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </template>

    <!-- 明细层 -->
    <template v-else-if="level === 2">
      <el-card shadow="never">
        <div class="panel-header">
          落标明细（{{ detailRows.length }}）
          <div class="panel-actions">
            <el-button size="small" @click="level = 1">返回维度层</el-button>
            <el-button size="small" type="primary" @click="level = 3">进入整改层</el-button>
          </div>
        </div>
        <el-table :data="detailRows" stripe height="420">
          <el-table-column prop="asset" label="资产 / 表名" min-width="190" show-overflow-tooltip />
          <el-table-column prop="field" label="字段" min-width="140" show-overflow-tooltip />
          <el-table-column prop="std" label="未落标标准" min-width="180" show-overflow-tooltip />
          <el-table-column prop="reason" label="落标原因" min-width="170" show-overflow-tooltip />
          <el-table-column prop="level" label="严重度" width="90">
            <template #default="{ row }">
              <el-tag :type="row.level === '严重' ? 'danger' : 'warning'" size="small">{{ row.level }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="状态" width="100">
            <template #default="{ row }">
              <span :class="row.state === '已整改' ? 'text-green' : 'text-orange'">{{ row.state }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </template>

    <!-- 整改层 -->
    <template v-else-if="level === 3">
      <el-card shadow="never">
        <div class="panel-header">
          整改任务
          <div class="panel-actions">
            <el-button size="small" @click="level = 2">返回明细层</el-button>
            <el-button size="small" type="primary" @click="level = 4">进入对比层</el-button>
          </div>
        </div>
        <el-table :data="fixTasks" stripe height="420">
          <el-table-column prop="id" label="工单号" width="120" />
          <el-table-column prop="asset" label="涉及资产" min-width="200" show-overflow-tooltip />
          <el-table-column prop="action" label="整改措施" min-width="220" show-overflow-tooltip />
          <el-table-column prop="owner" label="责任人" width="100" />
          <el-table-column prop="deadline" label="期限" width="110" />
          <el-table-column label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="row.state === '已完成' ? 'success' : row.state === '进行中' ? 'primary' : 'warning'" size="small">{{ row.state }}</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </template>

    <!-- 对比层 -->
    <template v-else>
      <el-card shadow="never">
        <div class="panel-header">
          期初 vs 期末对比
          <div class="panel-actions">
            <el-button size="small" @click="level = 3">返回整改层</el-button>
          </div>
        </div>
        <div class="compare-bars">
          <div v-for="c in compare" :key="c.name" class="cmp-row">
            <span class="cmp-name">{{ c.name }}</span>
            <div class="cmp-track">
              <div class="cmp-bar" :style="{ width: c.after + '%', background: c.before > c.after ? '#00a854' : '#da251d' }"></div>
            </div>
            <span class="cmp-num">{{ c.before }}% → {{ c.after }}%</span>
          </div>
        </div>
        <el-alert
          class="mt-12"
          type="success"
          :closable="false"
          show-icon
          title="对比结论"
          description="整改后整体落标率由 26.4% 降至 9.8%，其中「信号系统接口数据」域下降最明显（-18.2pp），建议保持季度评估频率。"
        />
      </el-card>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const layers = [
  { key: 'overview', label: '总览层' },
  { key: 'dim', label: '维度层' },
  { key: 'detail', label: '明细层' },
  { key: 'fix', label: '整改层' },
  { key: 'compare', label: '对比层' },
]

const level = ref(0)
const selectedDim = ref('')
const overall = { rate: 9.8, total: 1286 }

const overallStats = [
  { label: '未落标资产', value: 126, color: '#da251d', desc: '存在 1 项以上标准未落实' },
  { label: '整改中', value: 34, color: '#ed7b2f', desc: '已有整改工单跟踪' },
  { label: '已落标', value: 1160, color: '#00a854', desc: '全部标准均已落实' },
]

const trend = [
  { period: '1月', rate: 26.4 },
  { period: '2月', rate: 22.1 },
  { period: '3月', rate: 18.6 },
  { period: '4月', rate: 14.2 },
  { period: '5月', rate: 11.3 },
  { period: '6月', rate: 9.8 },
]

const dims = [
  { name: '客流票务域', rate: 6.2, count: 320 },
  { name: '车辆信号域', rate: 14.8, count: 240 },
  { name: '运营调度域', rate: 9.1, count: 310 },
  { name: '设备资产域', rate: 12.6, count: 260 },
  { name: '新线建设域', rate: 22.4, count: 156 },
]

const dimRows = [
  { domain: '客流票务域 / 乘车记录', assets: 120, failed: 8, rate: 6.7, level: '轻度' },
  { domain: '客流票务域 / 清分结算', assets: 90, failed: 5, rate: 5.6, level: '轻度' },
  { domain: '车辆信号域 / 列车运行日志', assets: 140, failed: 24, rate: 17.1, level: '中度' },
  { domain: '车辆信号域 / 信号系统接口', assets: 100, failed: 26, rate: 26.0, level: '严重' },
  { domain: '运营调度域 / 调度指令', assets: 130, failed: 11, rate: 8.5, level: '轻度' },
  { domain: '设备资产域 / 检修台账', assets: 110, failed: 16, rate: 14.5, level: '中度' },
  { domain: '新线建设域 / 工程进度', assets: 156, failed: 35, rate: 22.4, level: '严重' },
]

const detailRows = [
  { asset: 'DWD.signal_iface.ats_command', field: 'cmd_sequence', std: '信号命令序号规范', reason: '字段未映射标准数据元', level: '严重', state: '整改中' },
  { asset: 'DWD.signal_iface.ats_command', field: 'device_code', std: '信号设备编码', reason: '值域与标准不一致', level: '严重', state: '已整改' },
  { asset: 'DWD.train_log.door_status', field: 'door_id', std: '车门编号规则', reason: '命名与标准差异较大', level: '中度', state: '待处理' },
  { asset: 'ODS.engineering.mileage', field: 'progress_rate', std: '工程进度统计指标', reason: '口径与标准定义不符', level: '严重', state: '整改中' },
  { asset: 'ODS.engineering.mileage', field: 'stake_no', std: '里程桩号编码', reason: '缺少必填标准字段', level: '中度', state: '待处理' },
  { asset: 'DWS.asset.maintenance', field: 'cycle_type', std: '检修周期字典', reason: '字典值与标准不一致', level: '中度', state: '已整改' },
]

const fixTasks = [
  { id: 'FIX-20260601', asset: 'DWD.signal_iface.ats_command', action: '新增 cmd_sequence → 信号命令序号标准映射，并补充转换逻辑', owner: '张工', deadline: '2026-06-25', state: '进行中' },
  { id: 'FIX-20260603', asset: 'ODS.engineering.mileage', action: '统一 progress_rate 统计口径，与工程进度指标对齐', owner: '刘工', deadline: '2026-06-28', state: '进行中' },
  { id: 'FIX-20260605', asset: 'ODS.engineering.mileage', action: '补充 stake_no 必填字段，修复数据接入链路', owner: '陈工', deadline: '2026-06-20', state: '已完成' },
  { id: 'FIX-20260608', asset: 'DWS.asset.maintenance', action: '同步检修周期字典为标准版本 V2.0', owner: '王工', deadline: '2026-07-02', state: '待开始' },
]

const compare = [
  { name: '客流票务域', before: 8.9, after: 6.2 },
  { name: '车辆信号域', before: 33.0, after: 14.8 },
  { name: '运营调度域', before: 12.4, after: 9.1 },
  { name: '设备资产域', before: 18.2, after: 12.6 },
  { name: '新线建设域', before: 35.1, after: 22.4 },
  { name: '整体', before: 26.4, after: 9.8 },
]

const path = computed(() => {
  if (level.value === 0) return ''
  if (level.value === 1) return selectedDim.value || '全部业务域'
  if (level.value === 2) return `${selectedDim.value || '全部业务域'} / 落标明细`
  if (level.value === 3) return `${selectedDim.value || '全部业务域'} / 整改任务`
  return `${selectedDim.value || '全部业务域'} / 期初期末对比`
})

function enterDim(name: string) {
  selectedDim.value = name
  level.value = 1
}

function enterDetail() {
  level.value = 2
}
</script>

<style scoped>
.drill-nav {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.drill-title {
  font-weight: 700;
  font-size: 15px;
  color: #4a4a4a;
}

.drill-layer {
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 13px;
  color: #8c8c8c;
  cursor: pointer;
  transition: all 0.2s ease;
}

.drill-layer:hover {
  color: #da251d;
}

.drill-layer.active {
  background: #da251d;
  color: #fff;
  font-weight: 600;
}

.drill-path {
  margin-left: auto;
  color: #8c8c8c;
  font-size: 12px;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.gauge-card {
  text-align: center;
}

.gauge-card :deep(.el-card__body) {
  padding: 20px 24px;
}

.gauge-num {
  font-size: 34px;
  font-weight: 700;
  color: #da251d;
}

.gauge-label {
  margin: 4px 0 10px;
  color: #8c8c8c;
  font-size: 13px;
}

.gauge-meta {
  margin-top: 10px;
  color: #8c8c8c;
  font-size: 12px;
}

.trend-bars {
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  gap: 12px;
  padding: 16px 8px 4px;
  height: 190px;
}

.trend-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  flex: 1;
  min-width: 0;
}

.trend-val {
  font-size: 12px;
  font-weight: 600;
  color: #4a4a4a;
}

.trend-bar {
  width: 60%;
  border-radius: 6px 6px 0 0;
  min-height: 4px;
}

.trend-period {
  color: #8c8c8c;
  font-size: 12px;
}

.dim-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
  margin-top: 8px;
}

.dim-card {
  padding: 14px 16px;
  border: 1px solid #edf0f5;
  border-radius: 8px;
  cursor: pointer;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.dim-card:hover {
  border-color: #da251d;
  box-shadow: 0 4px 14px rgba(218, 37, 29, 0.1);
}

.dim-name {
  font-weight: 600;
  color: #4a4a4a;
  font-size: 13px;
  margin-bottom: 10px;
}

.dim-meta {
  margin-top: 6px;
  color: #8c8c8c;
  font-size: 12px;
}

.rate-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.rate-cell .el-progress {
  flex: 1;
  min-width: 0;
}

.text-red {
  color: #da251d;
}

.text-green {
  color: #00a854;
  font-weight: 600;
}

.text-orange {
  color: #ed7b2f;
  font-weight: 600;
}

.mt-12 {
  margin-top: 12px;
}

.compare-bars {
  display: grid;
  gap: 16px;
  padding: 8px 2px;
}

.cmp-row {
  display: flex;
  align-items: center;
  gap: 14px;
}

.cmp-name {
  width: 110px;
  flex: none;
  font-size: 13px;
  color: #4a4a4a;
}

.cmp-track {
  flex: 1;
  min-width: 0;
  background: #f0f2f5;
  border-radius: 6px;
  height: 14px;
  overflow: hidden;
}

.cmp-bar {
  height: 100%;
  border-radius: 6px;
  transition: width 0.4s ease;
}

.cmp-num {
  width: 130px;
  flex: none;
  text-align: right;
  font-size: 13px;
  color: #4a4a4a;
  font-weight: 600;
}
</style>