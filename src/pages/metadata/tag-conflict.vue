<template>
  <div class="standard-page">
    <el-card shadow="never">
      <div class="panel-header">
        数据标签规则冲突处理
        <div class="panel-actions">
          <el-button type="primary" plain>批量处理</el-button>
        </div>
      </div>

      <el-row :gutter="16" class="mb-16">
        <el-col v-for="c in conflictCards" :key="c.name" :xs="12" :md="6">
          <div class="conf-card">
            <div class="conf-name">{{ c.name }}</div>
            <div class="conf-count" :style="{ color: c.color }">{{ c.count }}</div>
            <div class="conf-desc">{{ c.desc }}</div>
          </div>
        </el-col>
      </el-row>

      <el-table :data="rows" stripe height="420" @selection-change="selection = $event">
        <el-table-column type="selection" width="46" />
        <el-table-column prop="asset" label="资产" min-width="170" show-overflow-tooltip />
        <el-table-column label="冲突类型" width="110">
          <template #default="{ row }">
            <el-tag :type="typeTag(row.type)" effect="light" size="small">{{ row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="冲突详情" min-width="260">
          <template #default="{ row }">
            <div class="conf-detail">{{ row.detail }}</div>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === '待处理' ? 'warning' : 'success'" effect="light" size="small">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="处理建议" width="180">
          <template #default>
            <el-tag size="small" effect="plain" type="info">按优先级解析</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" fixed="right">
          <template #default>
            <el-button link type="primary" size="small">处理</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const selection = ref([])

const conflictCards = [
  { name: '多规则命中', count: 18, desc: '同一资产命中多条自动打标规则', color: '#da251d' },
  { name: '互斥标签', count: 7, desc: '标签语义互斥同时被命中', color: '#ed7b2f' },
  { name: '规则与人工冲突', count: 12, desc: '规则建议与人工打标不一致', color: '#2b6cb0' },
  { name: '标签层级冲突', count: 5, desc: '父类与子类标签冲突', color: '#8b5cf6' },
]

const rows = [
  { asset: 'sale_order_2026（客户手机号）', type: '多规则命中', detail: '规则A「手机号识别」与规则B「证件号识别」同时命中', status: '待处理' },
  { asset: 'employee_profile.email', type: '互斥标签', detail: '标签「公开-通讯录」与「敏感-个人联系」互斥', status: '待处理' },
  { asset: 'ticket_refund.identity_no', type: '规则与人工冲突', detail: '规则建议「敏感-证件」；人工标记「公开-票据」', status: '待处理' },
  { asset: 'flow_daily_stat.station', type: '标签层级冲突', detail: '父标签「主题-客流」中子标签「敏感-出行轨迹」冲突', status: '待处理' },
  { asset: 'device_gps_log', type: '多规则命中', detail: '规则C「位置识别」与规则D「轨迹识别」同时命中', status: '已处理' },
  { asset: 'account_balance', type: '互斥标签', detail: '标签「内部-余额」与「公开-资产情况」互斥', status: '待处理' },
]

function typeTag(t: string) {
  return { 多规则命中: 'danger', 互斥标签: 'warning', 规则与人工冲突: 'primary', 标签层级冲突: 'warning' }[t] as 'danger' | 'warning' | 'primary'
}
</script>

<style scoped>
.standard-page {
  display: grid;
  gap: 16px;
}

.mb-16 {
  margin-bottom: 16px;
}

.conf-card {
  padding: 14px 16px;
  background: #fafafa;
  border: 1px solid #edf0f5;
  border-radius: 10px;
}

.conf-name {
  color: #8c8c8c;
  font-size: 12px;
}

.conf-count {
  margin-top: 4px;
  font-size: 24px;
  font-weight: 700;
}

.conf-desc {
  margin-top: 2px;
  color: #8c8c8c;
  font-size: 11px;
}

.conf-detail {
  font-size: 12px;
  color: #4a4a4a;
  line-height: 1.6;
}
</style>