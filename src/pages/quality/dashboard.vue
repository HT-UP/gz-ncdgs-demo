<template>
  <div class="standard-page">
    <el-row :gutter="16">
      <el-col :xs="24" :md="6">
        <div class="qk-card">
          <div class="qk-label">整体通过率</div>
          <div class="qk-value">96.8%</div>
          <el-progress :percentage="96.8" :stroke-width="10" color="#00a854" />
        </div>
      </el-col>
      <el-col :xs="24" :md="6">
        <div class="qk-card">
          <div class="qk-label">待处理问题</div>
          <div class="qk-value" style="color: #e34d59">86</div>
          <div class="qk-sub">严重 12 · 警告 54 · 提示 20</div>
        </div>
      </el-col>
      <el-col :xs="24" :md="6">
        <div class="qk-card">
          <div class="qk-label">规则命中趋势</div>
          <div class="qk-value" style="color: #2b6cb0">1.2k</div>
          <div class="qk-sub">近 24 小时命中次数</div>
        </div>
      </el-col>
      <el-col :xs="24" :md="6">
        <div class="qk-card">
          <div class="qk-label">整改闭环率</div>
          <div class="qk-value" style="color: #ed7b2f">91.4%</div>
          <el-progress :percentage="91.4" :stroke-width="10" color="#ed7b2f" />
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="16">
      <el-col :xs="24" :md="8">
        <el-card shadow="never" class="hc">
          <div class="panel-header">问题分布</div>
          <div class="dist-legend">
            <div v-for="d in dists" :key="d.name" class="dist-row">
              <span class="dist-dot" :style="{ background: d.color }"></span>
              <span class="dist-name">{{ d.name }}</span>
              <span class="dist-count" :style="{ color: d.color }">{{ d.count }}</span>
            </div>
          </div>
          <div class="dist-bars">
            <div v-for="d in dists" :key="d.name" class="dist-bar">
              <span class="dist-bar-label">{{ d.name }}</span>
              <el-progress :percentage="d.pct" :color="d.color" :stroke-width="10" />
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :md="8">
        <el-card shadow="never" class="hc">
          <div class="panel-header">趋势分析</div>
          <div class="trend-bars">
            <div v-for="(t, i) in trend" :key="i" class="tbar-col">
              <div class="tbar-num">{{ t.count }}</div>
              <div class="tbar-track">
                <div class="tbar-fill" :style="{ height: `${t.pct}%` }"></div>
              </div>
              <div class="tbar-label">{{ t.label }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :md="8">
        <el-card shadow="never" class="hc">
          <div class="panel-header">Top 排行</div>
          <div class="rank-list">
            <div v-for="(r, i) in tops" :key="r.name" class="rank-item">
              <span class="rank-no" :class="{ top: i < 3 }">{{ i + 1 }}</span>
              <span class="rank-name">{{ r.name }}</span>
              <div class="rank-progress">
                <el-progress :percentage="r.pct" :color="i < 3 ? '#da251d' : '#8c8c8c'" :stroke-width="8" />
              </div>
              <span class="rank-count">{{ r.count }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-card shadow="never">
      <div class="panel-header">
        预警联动
        <div class="panel-actions">
          <el-button type="primary" plain size="small">查看全部预警</el-button>
        </div>
      </div>
      <el-table :data="alerts" stripe height="260">
        <el-table-column prop="time" label="时间" width="160" />
        <el-table-column prop="title" label="预警内容" min-width="260" show-overflow-tooltip />
        <el-table-column prop="level" label="级别" width="90">
          <template #default="{ row }">
            <el-tag :type="row.level === '高' ? 'danger' : 'warning'" size="small" effect="light">{{ row.level }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="link" label="联动处置" min-width="180" show-overflow-tooltip />
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const dists = [
  { name: '完整性', count: 32, pct: 37, color: '#da251d' },
  { name: '准确性', count: 26, pct: 30, color: '#2b6cb0' },
  { name: '一致性', count: 14, pct: 16, color: '#00a854' },
  { name: '唯一性', count: 8, pct: 9, color: '#ed7b2f' },
  { name: '时效性', count: 6, pct: 7, color: '#8b5cf6' },
]

const trend = [
  { label: '6-10', count: 96, pct: 48 },
  { label: '6-11', count: 110, pct: 55 },
  { label: '6-12', count: 132, pct: 66 },
  { label: '6-13', count: 124, pct: 62 },
  { label: '6-14', count: 168, pct: 84 },
  { label: '6-15', count: 186, pct: 93 },
  { label: '6-16', count: 200, pct: 100 },
]

const tops = [
  { name: '票务清分结果表', count: 42, pct: 100 },
  { name: '客流断面明细表', count: 36, pct: 86 },
  { name: '设备状态表', count: 28, pct: 67 },
  { name: '人员档案表', count: 18, pct: 43 },
]

const alerts = ref([
  { time: '2026-06-16 10:40', title: '票务清分表通过率跌破预警线（< 95%：当前 91.2%）', level: '高', link: '创建整改工单 →' },
  { time: '2026-06-16 08:55', title: '设备状态表唯一性异常持续 3 小时', level: '高', link: '调度增量校验规则 →' },
  { time: '2026-06-15 22:10', title: '客流断面表空值率上升至 8.6%', level: '中', link: '通知表责任人 →' },
  { time: '2026-06-15 16:30', title: '归档表新鲜度超时（T-1 未更新）', level: '中', link: '触发补跑任务 →' },
])
</script>

<style scoped>
.standard-page {
  display: grid;
  gap: 16px;
}

.qk-card {
  padding: 14px 16px;
  background: #fafafa;
  border: 1px solid #edf0f5;
  border-radius: 10px;
}

.qk-label {
  color: #8c8c8c;
  font-size: 12px;
}

.qk-value {
  margin: 4px 0 6px;
  font-size: 26px;
  font-weight: 700;
  color: #00a854;
}

.qk-sub {
  margin-top: 6px;
  color: #8c8c8c;
  font-size: 11px;
}

.hc {
  height: 100%;
}

.dist-legend {
  display: grid;
  gap: 8px;
  margin-bottom: 14px;
}

.dist-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #4a4a4a;
}

.dist-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.dist-count {
  margin-left: auto;
  font-weight: 700;
}

.dist-bars {
  display: grid;
  gap: 8px;
  border-top: 1px solid #edf0f5;
  padding-top: 12px;
}

.dist-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.dist-bar-label {
  width: 60px;
  flex: none;
  font-size: 12px;
  color: #8c8c8c;
}

.dist-bar .el-progress {
  flex: 1;
  min-width: 0;
}

.trend-bars {
  display: flex;
  align-items: flex-end;
  gap: 10px;
  height: 220px;
}

.tbar-col {
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  min-width: 0;
}

.tbar-track {
  width: 55%;
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: flex-end;
  background: #f0f2f5;
  border-radius: 6px 6px 0 0;
  overflow: hidden;
}

.tbar-fill {
  width: 100%;
  background: linear-gradient(180deg, #da251d, #e5716b);
  border-radius: 6px 6px 0 0;
}

.tbar-num {
  margin-bottom: 4px;
  font-size: 11px;
  color: #8c8c8c;
}

.tbar-label {
  margin-top: 6px;
  font-size: 11px;
  color: #8c8c8c;
}

.rank-list {
  display: grid;
  gap: 12px;
}

.rank-item {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.rank-no {
  width: 20px;
  height: 20px;
  flex: none;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: #f0f2f5;
  color: #8c8c8c;
  font-size: 11px;
  font-weight: 700;
}

.rank-no.top {
  background: rgba(218, 37, 29, 0.1);
  color: #da251d;
}

.rank-name {
  width: 130px;
  flex: none;
  font-size: 12px;
  color: #4a4a4a;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.rank-progress {
  flex: 1;
  min-width: 0;
}

.rank-count {
  width: 36px;
  flex: none;
  text-align: right;
  font-weight: 700;
  color: #4a4a4a;
  font-size: 13px;
}
</style>