<template>
  <div class="standard-page">
    <el-card shadow="never">
      <div class="panel-header">元数据采集概览</div>
      <el-row :gutter="16">
        <el-col :xs="12" :md="6">
          <div class="ovw-chip">
            <div class="ovw-chip-value">9</div>
            <div class="ovw-chip-label">接入数据源类型</div>
            <div class="ovw-chip-desc">Oracle/MySQL/.../Kafka</div>
          </div>
        </el-col>
        <el-col :xs="12" :md="6">
          <div class="ovw-chip">
            <div class="ovw-chip-value">12</div>
            <div class="ovw-chip-label">已采集资产（万）</div>
            <div class="ovw-chip-desc">表/字段/索引/视图</div>
          </div>
        </el-col>
        <el-col :xs="12" :md="6">
          <div class="ovw-chip">
            <div class="ovw-chip-value" style="color: #00a854">98.6%</div>
            <div class="ovw-chip-label">采集完成率</div>
            <div class="ovw-chip-desc">昨日任务 126 个</div>
          </div>
        </el-col>
        <el-col :xs="12" :md="6">
          <div class="ovw-chip">
            <div class="ovw-chip-value" style="color: #ed7b2f">97.2%</div>
            <div class="ovw-chip-label">采集成功率</div>
            <div class="ovw-chip-desc">待处理失败 3 项</div>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <el-row :gutter="16">
      <el-col :xs="24" :md="8">
        <el-card shadow="never" class="hc">
          <div class="panel-header">数据源类型覆盖</div>
          <div class="coverage-list">
            <div v-for="c in coverage" :key="c.name" class="coverage-item">
              <div class="coverage-head">
                <span>{{ c.name }}</span>
                <b>{{ c.pct }}%</b>
              </div>
              <el-progress :percentage="c.pct" :color="c.color" :stroke-width="9" />
              <div class="coverage-desc">已采集 {{ c.done }} / 总量 {{ c.total }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :md="8">
        <el-card shadow="never" class="hc">
          <div class="panel-header">今日采集任务</div>
          <div class="task-mini-list">
            <div v-for="t in todayTasks" :key="t.name" class="task-mini">
              <span class="task-mini-name">{{ t.name }}</span>
              <el-tag :type="t.status === '成功' ? 'success' : t.status === '失败' ? 'danger' : 'info'" size="small" effect="light">{{ t.status }}</el-tag>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :md="8">
        <el-card shadow="never" class="hc">
          <div class="panel-header">采集增长趋势（周）</div>
          <div class="bar-chart">
            <div v-for="(d, i) in weekData" :key="i" class="bar-col">
              <div class="bar-value">{{ d.value }}</div>
              <div class="bar-track">
                <div class="bar-fill" :style="{ height: `${d.pct}%` }"></div>
              </div>
              <div class="bar-day">{{ d.label }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-card shadow="never">
      <div class="panel-header">
        待处理任务
        <div class="panel-actions">
          <el-button type="primary" plain size="small">查看全部</el-button>
        </div>
      </div>
      <el-table :data="pending" stripe height="260">
        <el-table-column prop="task" label="任务名称" min-width="180" show-overflow-tooltip />
        <el-table-column prop="source" label="数据源" min-width="140" show-overflow-tooltip />
        <el-table-column prop="type" label="采集类型" width="110" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === '失败' ? 'danger' : 'warning'" effect="light" size="small">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="reason" label="原因" min-width="200" show-overflow-tooltip />
        <el-table-column label="操作" width="120" fixed="right">
          <template #default>
            <el-button link type="primary" size="small">重试</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const coverage = [
  { name: '关系型数据库', pct: 96, done: 216, total: 225, color: '#da251d' },
  { name: '大数据组件', pct: 88, done: 44, total: 50, color: '#2b6cb0' },
  { name: '消息队列', pct: 92, done: 46, total: 50, color: '#ed7b2f' },
  { name: '文件存储', pct: 76, done: 38, total: 50, color: '#00a854' },
  { name: '检索与分析', pct: 80, done: 40, total: 50, color: '#8b5cf6' },
]

const todayTasks = [
  { name: 'ODS_客流明细_全量', status: '成功' },
  { name: 'AFC_票务清分_增量', status: '成功' },
  { name: 'SCADA_设备状态_全量', status: '成功' },
  { name: 'SIG_信号接口_增量', status: '失败' },
  { name: '归档_历史快照_全量', status: '运行中' },
  { name: '安全_审计日志_增量', status: '成功' },
]

const weekData = [
  { label: '周一', value: '218', pct: 62 },
  { label: '周二', value: '245', pct: 70 },
  { label: '周三', value: '232', pct: 66 },
  { label: '周四', value: '287', pct: 82 },
  { label: '周五', value: '310', pct: 88 },
  { label: '周六', value: '182', pct: 52 },
  { label: '周日', value: '352', pct: 100 },
]

const pending = ref([
  { task: 'SIG_信号接口_增量', source: '信号系统明细库', type: '增量采集', status: '失败', reason: '连接超时：等待握手超 10s' },
  { task: '归档_历史快照_全量', source: '历史归档中心', type: '全量采集', status: '重试中', reason: '解析失败：文件块校验和异常' },
  { task: '外部_接口网关注册', source: '外部接口网关库', type: '扫描注册', status: '待处理', reason: '未配置抽取规则' },
])
</script>

<style scoped>
.standard-page {
  display: grid;
  gap: 16px;
}

.ovw-chip {
  padding: 14px 16px;
  background: #fafafa;
  border: 1px solid #edf0f5;
  border-radius: 10px;
}

.ovw-chip-value {
  font-size: 24px;
  font-weight: 700;
  color: #da251d;
}

.ovw-chip-label {
  margin-top: 2px;
  color: #4a4a4a;
  font-size: 13px;
  font-weight: 600;
}

.ovw-chip-desc {
  margin-top: 2px;
  color: #8c8c8c;
  font-size: 11px;
}

.hc {
  height: 100%;
}

.coverage-list {
  display: grid;
  gap: 12px;
}

.coverage-item {
  min-width: 0;
}

.coverage-head {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #4a4a4a;
  margin-bottom: 4px;
}

.coverage-desc {
  margin-top: 2px;
  color: #8c8c8c;
  font-size: 11px;
}

.task-mini-list {
  display: grid;
  gap: 8px;
}

.task-mini {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 10px;
  background: #fafafa;
  border: 1px solid #edf0f5;
  border-radius: 8px;
  min-width: 0;
}

.task-mini-name {
  font-size: 12px;
  color: #4a4a4a;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 8px;
}

.bar-chart {
  display: flex;
  align-items: flex-end;
  gap: 10px;
  height: 200px;
  padding-top: 6px;
}

.bar-col {
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  min-width: 0;
}

.bar-track {
  width: 60%;
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: flex-end;
  border-radius: 6px 6px 0 0;
  background: #f0f2f5;
  overflow: hidden;
}

.bar-fill {
  width: 100%;
  border-radius: 6px 6px 0 0;
  background: linear-gradient(180deg, #da251d, #e5716b);
}

.bar-value {
  margin-bottom: 4px;
  font-size: 11px;
  color: #8c8c8c;
}

.bar-day {
  margin-top: 6px;
  font-size: 11px;
  color: #8c8c8c;
}
</style>