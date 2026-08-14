<template>
  <div class="standard-page">
    <el-card shadow="never">
      <div class="panel-header">
        质量评估模型
        <div class="panel-actions">
          <el-button type="primary" plain>新建评估</el-button>
        </div>
      </div>

      <div class="weight-panel">
        <div class="weight-title">五维权重模型</div>
        <div class="weight-list">
          <div v-for="w in weights" :key="w.name" class="weight-item">
            <span class="weight-name">{{ w.name }}</span>
            <el-progress :percentage="w.pct" :color="w.color" :stroke-width="14" />
            <b class="weight-pct">{{ w.pct }}%</b>
          </div>
        </div>
      </div>
    </el-card>

    <el-card shadow="never">
      <div class="panel-header">资产质量等级分布</div>
      <div class="grade-grid">
        <div v-for="g in grades" :key="g.name" class="grade-card" :style="{ borderColor: g.color }">
          <div class="grade-name" :style="{ color: g.color }">{{ g.name }}</div>
          <div class="grade-count">{{ g.count }}</div>
          <div class="grade-range">{{ g.range }}</div>
        </div>
      </div>
    </el-card>

    <el-card shadow="never">
      <div class="panel-header">
        评估明细
        <div class="panel-actions">
          <el-input v-model="keyword" placeholder="搜索资产" clearable class="search-input" />
        </div>
      </div>
      <el-table :data="rows" stripe height="360">
        <el-table-column prop="asset" label="资产" min-width="170" show-overflow-tooltip />
        <el-table-column label="完整性" width="120">
          <template #default="{ row }">
            <div class="dim-cell"><b>{{ row.dims.integrity }}</b><span>/25</span></div>
          </template>
        </el-table-column>
        <el-table-column label="准确性" width="120">
          <template #default="{ row }">
            <div class="dim-cell"><b>{{ row.dims.accuracy }}</b><span>/25</span></div>
          </template>
        </el-table-column>
        <el-table-column label="一致性" width="120">
          <template #default="{ row }">
            <div class="dim-cell"><b>{{ row.dims.consistency }}</b><span>/20</span></div>
          </template>
        </el-table-column>
        <el-table-column label="唯一性" width="110">
          <template #default="{ row }">
            <div class="dim-cell"><b>{{ row.dims.uniqueness }}</b><span>/15</span></div>
          </template>
        </el-table-column>
        <el-table-column label="及时性" width="110">
          <template #default="{ row }">
            <div class="dim-cell"><b>{{ row.dims.timeliness }}</b><span>/15</span></div>
          </template>
        </el-table-column>
        <el-table-column label="总分" width="100">
          <template #default="{ row }">
            <b class="total">{{ row.total }}</b>
          </template>
        </el-table-column>
        <el-table-column label="等级" width="90">
          <template #default="{ row }">
            <el-tag :color="gradeColor(row.grade)" effect="dark" size="small">{{ row.grade }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const weights = [
  { name: '完整性', pct: 25, color: '#da251d' },
  { name: '准确性', pct: 25, color: '#2b6cb0' },
  { name: '一致性', pct: 20, color: '#00a854' },
  { name: '唯一性', pct: 15, color: '#ed7b2f' },
  { name: '及时性', pct: 15, color: '#8b5cf6' },
]

const grades = [
  { name: 'A 级', count: 36, range: '90-100 分', color: '#00a854' },
  { name: 'B 级', count: 42, range: '75-89 分', color: '#2b6cb0' },
  { name: 'C 级', count: 15, range: '60-74 分', color: '#ed7b2f' },
  { name: '不认证', count: 7, range: '60 分以下', color: '#e34d59' },
]

const keyword = ref('')

const rows = [
  { asset: 'ods_flow_section_2026', dims: { integrity: 24, accuracy: 23, consistency: 19, uniqueness: 15, timeliness: 14 }, total: 95, grade: 'A' },
  { asset: 'dwd_ticket_clear_clean', dims: { integrity: 23, accuracy: 24, consistency: 18, uniqueness: 14, timeliness: 13 }, total: 92, grade: 'A' },
  { asset: 'dws_station_daily', dims: { integrity: 22, accuracy: 20, consistency: 17, uniqueness: 12, timeliness: 12 }, total: 83, grade: 'B' },
  { asset: 'ods_device_status', dims: { integrity: 20, accuracy: 19, consistency: 16, uniqueness: 13, timeliness: 10 }, total: 78, grade: 'B' },
  { asset: 'ods_employee_profile', dims: { integrity: 17, accuracy: 15, consistency: 14, uniqueness: 10, timeliness: 9 }, total: 65, grade: 'C' },
  { asset: 'ods_legacy_archives', dims: { integrity: 13, accuracy: 12, consistency: 11, uniqueness: 8, timeliness: 7 }, total: 51, grade: '不认证' },
]

function gradeColor(g: string) {
  return { A: '#00a854', B: '#2b6cb0', C: '#ed7b2f', 不认证: '#e34d59' }[g]
}
</script>

<style scoped>
.standard-page {
  display: grid;
  gap: 16px;
}

.weight-panel {
  padding: 6px 0 2px;
}

.weight-title {
  font-size: 13px;
  font-weight: 600;
  color: #4a4a4a;
  margin-bottom: 14px;
}

.weight-list {
  display: grid;
  gap: 12px;
}

.weight-item {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.weight-name {
  width: 70px;
  flex: none;
  font-size: 13px;
  color: #4a4a4a;
}

.weight-item .el-progress {
  flex: 1;
  min-width: 0;
}

.weight-pct {
  width: 48px;
  flex: none;
  text-align: right;
  color: #4a4a4a;
}

.grade-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
}

.grade-card {
  padding: 14px;
  border: 2px solid;
  border-radius: 10px;
  background: #fafafa;
  text-align: center;
}

.grade-name {
  font-size: 14px;
  font-weight: 700;
}

.grade-count {
  margin-top: 6px;
  font-size: 26px;
  font-weight: 700;
  color: #4a4a4a;
}

.grade-range {
  margin-top: 2px;
  color: #8c8c8c;
  font-size: 12px;
}

.dim-cell b {
  color: #4a4a4a;
}

.dim-cell span {
  color: #c0c4cc;
  font-size: 11px;
}

.total {
  font-size: 16px;
  color: #da251d;
}
</style>