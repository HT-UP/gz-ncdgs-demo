<template>
  <div class="standard-page">
    <el-card shadow="never">
      <div class="panel-header">
        探查结果应用
        <div class="panel-actions">
          <el-button type="primary" plain>发起新探查</el-button>
        </div>
      </div>

      <el-row :gutter="16">
        <el-col :xs="24" :md="12">
          <div class="panel-header">探查任务列表</div>
          <el-table :data="tasks" stripe height="320">
            <el-table-column prop="name" label="探查任务" min-width="170" show-overflow-tooltip />
            <el-table-column prop="asset" label="探查对象" min-width="150" show-overflow-tooltip />
            <el-table-column label="状态" width="90">
              <template #default="{ row }">
                <el-tag :type="row.status === '已完成' ? 'success' : 'primary'" size="small" effect="light">{{ row.status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="90" fixed="right">
              <template #default>
                <el-button link type="primary" size="small">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :xs="24" :md="12">
          <div class="panel-header">探查结果应用</div>
          <div class="apply-list">
            <div v-for="a in applies" :key="a.name" class="apply-item">
              <div class="apply-icon" :style="{ background: a.color }"><el-icon><component :is="a.icon" /></el-icon></div>
              <div class="apply-body">
                <div class="apply-title">{{ a.name }}</div>
                <div class="apply-desc">{{ a.desc }}</div>
              </div>
              <el-button size="small" type="primary" plain>应用</el-button>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <el-card shadow="never">
      <div class="panel-header">资产画像摘要（基于探查结果）</div>
      <el-descriptions :column="3" border size="small">
        <el-descriptions-item label="资产名称">ods_flow_section_2026</el-descriptions-item>
        <el-descriptions-item label="数据量">约 1.2 亿行</el-descriptions-item>
        <el-descriptions-item label="存储">1.2 TB</el-descriptions-item>
        <el-descriptions-item label="更新频率">实时</el-descriptions-item>
        <el-descriptions-item label="建议分级">L2</el-descriptions-item>
        <el-descriptions-item label="质量规则建议">补充峰值阈值校验</el-descriptions-item>
        <el-descriptions-item label="容量规划">预计 90 天后需扩容 30%</el-descriptions-item>
        <el-descriptions-item label="异常预警">6 月 15 日 22:00 空值率 8.6%</el-descriptions-item>
        <el-descriptions-item label="探查建议">关联 dws_station_daily 提升复用</el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Files, Warning, Grid, TrendCharts } from '@element-plus/icons-vue'

const tasks = ref([
  { name: '客流表结构探查', asset: 'ods_flow_section_2026', status: '已完成' },
  { name: '票务清分字段探查', asset: 'dwd_ticket_clear_clean', status: '已完成' },
  { name: '人员档案敏感字段探查', asset: 'ods_employee_profile', status: '执行中' },
])

const applies = [
  { name: '资产画像生成', desc: '基于探查结果自动生成资产画像', color: '#da251d', icon: Files },
  { name: '质量规则建议', desc: '发现 3 个字段需补充校验规则', color: '#2b6cb0', icon: Warning },
  { name: '分级辅助判定', desc: '结合样本推断建议数据分级', color: '#ed7b2f', icon: Grid },
  { name: '容量规划支撑', desc: '推算增长率与扩容时点', color: '#00a854', icon: TrendCharts },
]
</script>

<style scoped>
.standard-page {
  display: grid;
  gap: 16px;
}

.apply-list {
  display: grid;
  gap: 10px;
}

.apply-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border: 1px solid #edf0f5;
  border-radius: 10px;
  background: #fafafa;
  min-width: 0;
}

.apply-icon {
  width: 34px;
  height: 34px;
  flex: none;
  border-radius: 8px;
  display: grid;
  place-items: center;
  color: #fff;
}

.apply-body {
  flex: 1;
  min-width: 0;
}

.apply-title {
  font-size: 13px;
  font-weight: 600;
  color: #4a4a4a;
}

.apply-desc {
  margin-top: 2px;
  color: #8c8c8c;
  font-size: 12px;
}
</style>