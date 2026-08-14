<template>
  <div class="standard-page">
    <el-card shadow="never">
      <div class="panel-header">
        智能体效果评估
        <div class="panel-actions">
          <el-button type="primary" plain>触发优化流程</el-button>
        </div>
      </div>

      <div class="eval-head">
        <div v-for="m in metrics" :key="m.name" class="eval-metric">
          <div class="eval-name">{{ m.name }}</div>
          <div class="eval-val" :style="{ color: m.pass ? '#00a854' : '#e34d59' }">{{ m.val }}</div>
          <div class="eval-status">
            <el-tag :type="m.pass ? 'success' : 'danger'" size="small" effect="light">{{ m.pass ? '达标' : '不达标' }}</el-tag>
          </div>
        </div>
      </div>
    </el-card>

    <el-card shadow="never">
      <div class="panel-header">8 项指标定期评估</div>
      <el-table :data="indicators" stripe height="360">
        <el-table-column prop="name" label="指标" min-width="160" show-overflow-tooltip />
        <el-table-column label="达标线" width="90">
          <template #default="{ row }">{{ row.target }}</template>
        </el-table-column>
        <el-table-column label="当前值" width="100">
          <template #default="{ row }">
            <b :style="{ color: row.score >= row.threshold ? '#00a854' : '#e34d59' }">{{ row.score }}</b>
          </template>
        </el-table-column>
        <el-table-column label="达成进度" min-width="160">
          <template #default="{ row }">
            <el-progress :percentage="row.percent" :color="row.score >= row.threshold ? '#00a854' : '#e34d59'" :stroke-width="9" />
          </template>
        </el-table-column>
        <el-table-column prop="trend" label="趋势" width="110">
          <template #default="{ row }">
            <span :style="{ color: row.trend >= 0 ? '#00a854' : '#e34d59' }">{{ row.trend >= 0 ? '↑' : '↓' }} {{ Math.abs(row.trend) }}%</span>
          </template>
        </el-table-column>
        <el-table-column label="评估周期" width="100">
          <template #default="{ row }">{{ row.cycle }}</template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const metrics = [
  { name: '综合评分', val: '86.4', pass: true },
  { name: '达标指标', val: '7/8', pass: true },
  { name: '不达标指标', val: '1', pass: false },
  { name: '触发优化', val: '已生成 2 条', pass: false },
]

const indicators = ref([
  { name: '识别准确率', target: '≥ 90%', score: '94.2%', threshold: 90, percent: 94, trend: 3.1, cycle: '月度' },
  { name: '分类覆盖率', target: '≥ 85%', score: '93.7%', threshold: 85, percent: 94, trend: 2.4, cycle: '月度' },
  { name: '目录挂载成功率', target: '≥ 95%', score: '93.7%', threshold: 95, percent: 94, trend: 0.8, cycle: '月度' },
  { name: '处理耗时', target: '≤ 20min', score: '12min', threshold: 100, percent: 100, trend: -12.0, cycle: '月度' },
  { name: '人工干预率', target: '≤ 10%', score: '6.3%', threshold: 90, percent: 90, trend: -2.2, cycle: '月度' },
  { name: '用户满意度', target: '≥ 4.5', score: '4.6', threshold: 92, percent: 92, trend: 0.2, cycle: '季度' },
  { name: '异常告警率', target: '≤ 2%', score: '1.2%', threshold: 98, percent: 98, trend: -0.5, cycle: '月度' },
  { name: '模型自迭代次数', target: '≥ 2', score: '3', threshold: 100, percent: 100, trend: 1.0, cycle: '季度' },
])
</script>

<style scoped>
.standard-page {
  display: grid;
  gap: 16px;
}

.eval-head {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
}

.eval-metric {
  padding: 14px 16px;
  background: #fafafa;
  border: 1px solid #edf0f5;
  border-radius: 10px;
}

.eval-name {
  color: #8c8c8c;
  font-size: 12px;
}

.eval-val {
  margin-top: 4px;
  font-size: 26px;
  font-weight: 700;
}

.eval-status {
  margin-top: 4px;
}
</style>