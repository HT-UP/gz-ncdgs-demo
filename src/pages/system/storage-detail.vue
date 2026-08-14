<template>
  <div class="standard-page">
    <el-card shadow="never">
      <div class="panel-header">
        数据分层分主题存储明细
        <div class="panel-actions">
          <el-input v-model="keyword" placeholder="搜索分层 / 主题" clearable class="search-input" />
        </div>
      </div>

      <el-table :data="rows" stripe height="480">
        <el-table-column prop="layer" label="数据层" min-width="120" show-overflow-tooltip>
          <template #default="{ row }">
            <el-tag :type="layerTag(row.layer)" effect="light" size="small">{{ row.layer }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="topic" label="主题域" min-width="150" show-overflow-tooltip />
        <el-table-column prop="tables" label="表数量" width="90" />
        <el-table-column prop="storage" label="存储量" min-width="110" show-overflow-tooltip />
        <el-table-column label="占比" min-width="160">
          <template #default="{ row }">
            <div class="pct-cell">
              <el-progress :percentage="row.percent" :color="row.percent > 25 ? '#da251d' : '#2b6cb0'" :stroke-width="8" />
              <span>{{ row.percent }}%</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="lifecycle" label="生命周期策略" min-width="180" show-overflow-tooltip />
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const keyword = ref('')

const rows = [
  { layer: '热数据层', topic: '客流 / 票务实时', tables: 28, storage: '8.6 TB', percent: 34, lifecycle: '90 天自动转温' },
  { layer: '温数据层', topic: '运营统计 / 设备历史', tables: 96, storage: '9.2 TB', percent: 36, lifecycle: '180 天自动转冷' },
  { layer: '冷数据层', topic: '历史归档 / 审计', tables: 268, storage: '3.8 TB', percent: 15, lifecycle: '无需迁移' },
  { layer: '主题层', topic: '运营域 / 财务域 / 设备域', tables: 480, storage: '1.6 TB', percent: 6, lifecycle: '长期保留' },
  { layer: '贴源层', topic: 'ODS 全量明细', tables: 612, storage: '2.0 TB', percent: 8, lifecycle: '按业务保留' },
  { layer: '向量库', topic: '知识向量 / 语义索引', tables: 4, storage: '0.3 TB', percent: 1, lifecycle: '随知识库更新' },
]

function layerTag(l: string) {
  const map: Record<string, 'danger' | 'warning' | 'primary' | 'success' | 'info'> = { 热数据层: 'danger', 温数据层: 'warning', 冷数据层: 'info', 主题层: 'success', 贴源层: 'primary', 向量库: 'warning' }
  return map[l]
}
</script>

<style scoped>
.standard-page {
  display: grid;
  gap: 16px;
}

.pct-cell {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.pct-cell .el-progress {
  flex: 1;
  min-width: 0;
}

.pct-cell span {
  width: 40px;
  flex: none;
  text-align: right;
  font-size: 12px;
  color: #4a4a4a;
}
</style>