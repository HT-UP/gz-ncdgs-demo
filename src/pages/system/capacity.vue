<template>
  <div class="standard-page">
    <el-card shadow="never">
      <div class="panel-header">
        容量评估机制
        <div class="panel-actions">
          <el-button type="primary" plain>发起评估</el-button>
        </div>
      </div>

      <el-row :gutter="16">
        <el-col v-for="d in dims" :key="d.name" :xs="24" :md="6">
          <div class="cap-card">
            <div class="cap-head">
              <span class="cap-name">{{ d.name }}</span>
              <el-tag :type="d.level === '充足' ? 'success' : d.level === '关注' ? 'warning' : 'danger'" size="small" effect="light">{{ d.level }}</el-tag>
            </div>
            <div class="cap-usage">
              <el-progress :percentage="d.usage" :color="d.usage > 80 ? '#e34d59' : d.usage > 60 ? '#ed7b2f' : '#00a854'" :stroke-width="12" />
            </div>
            <div class="cap-detail">
              <div class="cap-row"><span>已用</span><b>{{ d.used }}</b></div>
              <div class="cap-row"><span>总量</span><b>{{ d.total }}</b></div>
              <div class="cap-row"><span>增长率</span><b>{{ d.growth }}/月</b></div>
            </div>
            <div class="cap-expect">预计可用至 <b>{{ d.expect }}</b></div>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <el-card shadow="never">
      <div class="panel-header">评估明细</div>
      <el-table :data="details" stripe height="340">
        <el-table-column prop="name" label="评估项" min-width="190" show-overflow-tooltip />
        <el-table-column prop="usage" label="使用率" width="120">
          <template #default="{ row }">
            <el-progress :percentage="row.usage" :color="colorByUsage(row.usage)" :stroke-width="8" />
          </template>
        </el-table-column>
        <el-table-column label="趋势" min-width="150">
          <template #default>
            <div class="mini-trend"><i v-for="n in 7" :key="n" :style="{ height: `${10 + Math.random() * 40}%` }"></i></div>
          </template>
        </el-table-column>
        <el-table-column prop="action" label="建议动作" min-width="200" show-overflow-tooltip />
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const dims = [
  { name: '存储容量', level: '关注', usage: 74, used: '74 TB', total: '100 TB', growth: '2.1 TB', expect: '2026-12' },
  { name: '计算资源', level: '充足', usage: 52, used: '156 核', total: '300 核', growth: '8 核', expect: '2027-06' },
  { name: '网络带宽', level: '充足', usage: 46, used: '4.6 Gbps', total: '10 Gbps', growth: '0.4 Gbps', expect: '2027-03' },
  { name: '任务容量', level: '充足', usage: 35, used: '420', total: '1200', growth: '18/月', expect: '2027-12' },
  { name: '用户容量', level: '关注', usage: 66, used: '1320', total: '2000', growth: '40/月', expect: '2027-01' },
]

const details = ref([
  { name: '数仓热数据存储', usage: 82, action: '建议 2 个月内扩容或归档冷数据' },
  { name: '数仓冷数据存储', usage: 68, action: '保持自动归档策略' },
  { name: 'Kafka 消息缓冲', usage: 58, action: '调优保留时长' },
  { name: '集群 CPU', usage: 52, action: '高峰时段扩展 2 节点' },
  { name: '数据库连接池', usage: 61, action: '关注慢连接回收' },
])

function colorByUsage(v: number) {
  return v > 80 ? '#e34d59' : v > 60 ? '#ed7b2f' : '#00a854'
}
</script>

<style scoped>
.standard-page {
  display: grid;
  gap: 16px;
}

.cap-card {
  padding: 14px 16px;
  background: #fafafa;
  border: 1px solid #edf0f5;
  border-radius: 10px;
}

.cap-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.cap-name {
  font-size: 14px;
  font-weight: 600;
  color: #4a4a4a;
}

.cap-usage {
  margin-top: 10px;
}

.cap-detail {
  margin-top: 10px;
  display: grid;
  gap: 4px;
}

.cap-row {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #8c8c8c;
}

.cap-row b {
  color: #4a4a4a;
}

.cap-expect {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #e4e7ed;
  color: #8c8c8c;
  font-size: 12px;
}

.cap-expect b {
  color: #da251d;
}

.mini-trend {
  display: flex;
  align-items: flex-end;
  gap: 3px;
  height: 24px;
}

.mini-trend i {
  width: 6px;
  border-radius: 2px;
  background: #da251d;
}
</style>