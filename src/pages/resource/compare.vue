<template>
  <div class="standard-page">
    <el-card shadow="never">
      <div class="panel-header">
        资产对比分析
        <div class="panel-actions">
          <el-select v-model="dimension" class="filter-select">
            <el-option v-for="d in dimensions" :key="d" :label="d" :value="d" />
          </el-select>
          <el-button type="primary" plain>生成对比</el-button>
        </div>
      </div>

      <el-alert title="当前按【时间对比】展示：昨日 vs 今日资产关键指标变化" type="info" :closable="false" show-icon class="mb-16" />

      <el-table :data="comparisons" stripe height="380">
        <el-table-column prop="metric" label="对比指标" min-width="180" show-overflow-tooltip />
        <el-table-column prop="base" label="基准值（昨日）" min-width="170" show-overflow-tooltip />
        <el-table-column prop="target" label="对比值（今日）" min-width="170" show-overflow-tooltip />
        <el-table-column label="变化量" min-width="170">
          <template #default="{ row }">
            <div class="delta-cell">
              <span class="delta-val" :style="{ color: row.deltaPct >= 0 ? '#00a854' : '#e34d59' }">{{ row.delta > 0 ? '+' : '' }}{{ row.delta }}</span>
              <span class="delta-pct" :style="{ color: row.deltaPct >= 0 ? '#00a854' : '#e34d59' }">({{ row.deltaPct >= 0 ? '+' : '' }}{{ row.deltaPct }}%)</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="insight" label="洞察建议" min-width="200" show-overflow-tooltip />
      </el-table>
    </el-card>

    <el-card shadow="never">
      <div class="panel-header">对比维度快捷切换</div>
      <div class="dim-cards">
        <div v-for="d in dimCardList" :key="d.name" class="dim-card" :class="{ on: dimension === d.name }" @click="dimension = d.name">
          <div class="dim-card-name">{{ d.name }}</div>
          <div class="dim-card-desc">{{ d.desc }}</div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const dimension = ref('时间对比')
const dimensions = ['时间对比', '数据源对比', '环境对比', '版本对比']

const comparisons = [
  { metric: '存储量', base: '12.4 TB', target: '12.9 TB', delta: '+0.5TB', deltaPct: 4.0, insight: '增量正常，无异常膨胀' },
  { metric: '表数量', base: '1862', target: '1881', delta: '+19', deltaPct: 1.0, insight: '新增 19 张表，来源 ODS 层' },
  { metric: '字段总数', base: '26850', target: '26920', delta: '+70', deltaPct: 0.3, insight: '字段增长与新增表一致' },
  { metric: '质量通过率', base: '95.8%', target: '96.8%', delta: '+1.0%', deltaPct: 1.0, insight: '整改后提升，情况良好' },
  { metric: '被访问次数', base: '2840', target: '3120', delta: '+280', deltaPct: 9.9, insight: '访问热度上升，关注业务需求' },
  { metric: '未挂载目录资产', base: '86', target: '74', delta: '-12', deltaPct: -14.0, insight: '清理进度正常' },
]

const dimCardList = [
  { name: '时间对比', desc: '昨日 / 今日 / 本周 / 上月指标对比' },
  { name: '数据源对比', desc: '不同数据源同类资产对比' },
  { name: '环境对比', desc: '生产 / 测试 / 预生产环境差异' },
  { name: '版本对比', desc: '不同元数据版本结构差异' },
]
</script>

<style scoped>
.standard-page {
  display: grid;
  gap: 16px;
}

.mb-16 {
  margin-bottom: 16px;
}

.delta-cell {
  display: flex;
  align-items: center;
  gap: 6px;
}

.delta-val {
  font-weight: 700;
  font-size: 13px;
}

.delta-pct {
  font-size: 12px;
}

.dim-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
}

.dim-card {
  padding: 14px;
  border: 1px solid #e4e7ed;
  border-radius: 10px;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.dim-card.on {
  border-color: #da251d;
  background: rgba(218, 37, 29, 0.04);
  box-shadow: 0 4px 14px rgba(218, 37, 29, 0.1);
}

.dim-card-name {
  font-size: 14px;
  font-weight: 600;
  color: #4a4a4a;
}

.dim-card-desc {
  margin-top: 4px;
  color: #8c8c8c;
  font-size: 12px;
  line-height: 1.6;
}
</style>