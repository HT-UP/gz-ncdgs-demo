<template>
  <div class="standard-page">
    <el-card shadow="never">
      <div class="panel-header">
        字段级统计分析
        <div class="panel-actions">
          <el-select v-model="table" class="filter-select">
            <el-option v-for="t in tables" :key="t" :label="t" :value="t" />
          </el-select>
        </div>
      </div>

      <el-alert title="统计字段维度的值分布、空值率、唯一值率与类型推断，辅助质量与分级" type="info" :closable="false" show-icon class="mb-16" />

      <el-table :data="fields" stripe height="400">
        <el-table-column prop="name" label="字段名" min-width="150" show-overflow-tooltip />
        <el-table-column prop="type" label="类型推断" width="110">
          <template #default="{ row }">
            <el-tag size="small" effect="plain" type="primary">{{ row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="sample" label="值分布（Top 样本）" min-width="220" show-overflow-tooltip />
        <el-table-column label="空值率" min-width="140">
          <template #default="{ row }">
            <div class="rate-cell">
              <el-progress :percentage="row.nullRate" :color="row.nullRate > 20 ? '#e34d59' : row.nullRate > 5 ? '#ed7b2f' : '#00a854'" :stroke-width="8" />
              <span>{{ row.nullRate }}%</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="唯一值率" min-width="140">
          <template #default="{ row }">
            <div class="rate-cell">
              <el-progress :percentage="row.uniqueRate" color="#2b6cb0" :stroke-width="8" />
              <span>{{ row.uniqueRate }}%</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="suggest" label="质量建议" min-width="180" show-overflow-tooltip />
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const table = ref('ods_flow_section_2026')
const tables = ['ods_flow_section_2026', 'dwd_ticket_clear_clean', 'ods_employee_profile']

const fields = [
  { name: 'station_id', type: '字符型', sample: 'S0111 / S0112 / S0113 / S0114', nullRate: 0, uniqueRate: 38, suggest: '建议建立索引' },
  { name: 'section_passengers', type: '数值型', sample: '8260 / 5230 / 1280 / 960', nullRate: 3, uniqueRate: 100, suggest: '峰值时段需校验阈值' },
  { name: 'direction', type: '枚举型', sample: '上行 / 下行', nullRate: 0, uniqueRate: 2, suggest: '校验字典一致性' },
  { name: 'stat_date', type: '日期型', sample: '2026-06-16 / 2026-06-15', nullRate: 8, uniqueRate: 62, suggest: '检查数据新鲜度' },
  { name: 'remark', type: '长文本', sample: '天气原因 / 设备故障 / -', nullRate: 42, uniqueRate: 88, suggest: '高空值率，建议可选字段' },
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

.rate-cell {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.rate-cell .el-progress {
  flex: 1;
  min-width: 0;
}

.rate-cell span {
  width: 40px;
  flex: none;
  text-align: right;
  font-size: 12px;
  color: #4a4a4a;
}
</style>