<template>
  <div class="standard-page">
    <el-card shadow="never">
      <div class="panel-header">
        实时任务监控指标
        <div class="panel-actions">
          <el-button type="primary" plain>刷新指标</el-button>
        </div>
      </div>

      <el-row :gutter="16">
        <el-col v-for="m in metrics" :key="m.name" :xs="24" :md="6">
          <div class="metric-card">
            <div class="metric-name">{{ m.name }}</div>
            <div class="metric-main">
              <span class="metric-value" :style="{ color: m.color }">{{ m.value }}</span>
              <span class="metric-trend" :style="{ color: m.trend > 0 ? '#00a854' : '#e34d59' }">{{ m.trend > 0 ? '↑' : '↓' }} {{ Math.abs(m.trend) }}%</span>
            </div>
            <div class="metric-sub">{{ m.sub }}</div>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <el-card shadow="never">
      <div class="panel-header">
        实时任务明细
        <div class="panel-actions">
          <el-input v-model="keyword" placeholder="搜索任务" clearable class="search-input" />
        </div>
      </div>
      <el-table :data="tasks" stripe height="400">
        <el-table-column prop="name" label="任务名称" min-width="180" show-overflow-tooltip />
        <el-table-column label="运行状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === '正常' ? 'success' : row.status === '异常' ? 'danger' : 'warning'" effect="light" size="small">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="consume" label="消费速率" width="110">
          <template #default="{ row }">{{ row.consume }} 条/s</template>
        </el-table-column>
        <el-table-column label="积压量" width="100">
          <template #default="{ row }">
            <b class="lag" :style="{ color: row.lag > 100000 ? '#e34d59' : row.lag > 10000 ? '#ed7b2f' : '#00a854' }">{{ row.lag }}</b>
          </template>
        </el-table-column>
        <el-table-column label="吞吐" width="110">
          <template #default="{ row }">{{ row.throughput }} 条/s</template>
        </el-table-column>
        <el-table-column label="资源占用" width="140">
          <template #default="{ row }">
            <el-progress :percentage="row.resource" :color="row.resource > 80 ? '#e34d59' : row.resource > 60 ? '#ed7b2f' : '#00a854'" :stroke-width="8" />
          </template>
        </el-table-column>
        <el-table-column label="质量监控" width="110">
          <template #default="{ row }">
            <el-tag :type="row.quality === '通过' ? 'success' : 'warning'" size="small" effect="plain">{{ row.quality }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const metrics = [
  { name: '运行中任务', value: 14, color: '#00a854', trend: 0, sub: '共 18 个实时任务' },
  { name: '平均消费速率', value: '4.6k', color: '#2b6cb0', trend: 6.2, sub: '条/秒' },
  { name: '总积压量', value: '82k', color: '#ed7b2f', trend: -12.4, sub: '较 1 小时前下降' },
  { name: '平均吞吐', value: '4.5k', color: '#8b5cf6', trend: 3.1, sub: '条/秒' },
]

const keyword = ref('')

const tasks = [
  { name: '客流断面实时清洗', status: '正常', consume: 8200, lag: 820, throughput: 8150, resource: 68, quality: '通过' },
  { name: '设备状态实时接入', status: '正常', consume: 3100, lag: 4600, throughput: 3050, resource: 54, quality: '通过' },
  { name: '票务清分实时汇总', status: '异常', consume: 240, lag: 246000, throughput: 220, resource: 92, quality: '未通过' },
  { name: '安全日志实时分析', status: '正常', consume: 600, lag: 1200, throughput: 598, resource: 41, quality: '通过' },
  { name: '应急事件实时监测', status: '降级', consume: 0, lag: 88000, throughput: 0, resource: 35, quality: '未通过' },
]
</script>

<style scoped>
.standard-page {
  display: grid;
  gap: 16px;
}

.metric-card {
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
  gap: 8px;
  margin-top: 4px;
}

.metric-value {
  font-size: 24px;
  font-weight: 700;
}

.metric-trend {
  font-size: 12px;
  font-weight: 600;
}

.metric-sub {
  margin-top: 2px;
  color: #8c8c8c;
  font-size: 11px;
}

.lag {
  font-size: 13px;
}
</style>