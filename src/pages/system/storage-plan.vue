<template>
  <div class="standard-page">
    <el-card shadow="never">
      <div class="panel-header">
        存储容量规划
        <div class="panel-actions">
          <el-button type="primary" plain>生成规划报告</el-button>
        </div>
      </div>

      <el-row :gutter="16" class="mb-16">
        <el-col v-for="m in summary" :key="m.name" :xs="12" :md="6">
          <div class="sum-card">
            <div class="sum-name">{{ m.name }}</div>
            <div class="sum-val" :style="{ color: m.color }">{{ m.val }}</div>
            <div class="sum-desc">{{ m.desc }}</div>
          </div>
        </el-col>
      </el-row>

      <el-table :data="plans" stripe height="340">
        <el-table-column prop="category" label="存储类型" min-width="150" show-overflow-tooltip />
        <el-table-column prop="current" label="当前容量" min-width="110" show-overflow-tooltip />
        <el-table-column prop="required" label="规划容量" min-width="110" show-overflow-tooltip />
        <el-table-column label="采购状态" width="120">
          <template #default="{ row }">
            <el-tag :type="row.status === '已采购' ? 'success' : row.status === '采购中' ? 'warning' : 'info'" size="small" effect="light">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="deadline" label="到位时间" width="100" />
        <el-table-column prop="note" label="说明" min-width="200" show-overflow-tooltip />
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const summary = [
  { name: '结构化存储需求', val: '5 TB', color: '#da251d', desc: '当前 4.2 TB · 缺口 0.8 TB' },
  { name: '非结构化存储需求', val: '2 TB', color: '#2b6cb0', desc: '当前 1.5 TB · 缺口 0.5 TB' },
  { name: '消息缓冲', val: '0.6 TB', color: '#ed7b2f', desc: 'Kafka 保留 7 天' },
  { name: '向量存储', val: '0.5 TB', color: '#8b5cf6', desc: '知识库语义索引' },
]

const plans = ref([
  { category: '结构化数据（MPP 数仓）', current: '4.2 TB', required: '5 TB', status: '已采购', deadline: '2026-08', note: 'Q3 扩容 800GB SSD' },
  { category: '非结构化数据（对象存储）', current: '1.5 TB', required: '2 TB', status: '采购中', deadline: '2026-09', note: 'BIM 模型增长较快' },
  { category: '消息缓冲（Kafka）', current: '0.4 TB', required: '0.6 TB', status: '已采购', deadline: '2026-07', note: '扩容 2 个 broker' },
  { category: '向量存储', current: '0.2 TB', required: '0.5 TB', status: '计划中', deadline: '2026-10', note: '知识库二期建设' },
  { category: '备份存储', current: '6.8 TB', required: '8 TB', status: '已采购', deadline: '2026-08', note: '含异地灾备副本' },
])
</script>

<style scoped>
.standard-page {
  display: grid;
  gap: 16px;
}

.mb-16 {
  margin-bottom: 16px;
}

.sum-card {
  padding: 14px 16px;
  background: #fafafa;
  border: 1px solid #edf0f5;
  border-radius: 10px;
}

.sum-name {
  color: #8c8c8c;
  font-size: 12px;
}

.sum-val {
  margin-top: 4px;
  font-size: 24px;
  font-weight: 700;
}

.sum-desc {
  margin-top: 2px;
  color: #8c8c8c;
  font-size: 11px;
}
</style>