<template>
  <div class="standard-page">
    <el-card shadow="never">
      <div class="panel-header">
        元数据智能补全学习机制
        <div class="panel-actions">
          <el-button type="primary" plain>触发学习</el-button>
        </div>
      </div>

      <el-steps :active="3" align-center finish-status="success" class="learn-steps">
        <el-step v-for="s in learnSteps" :key="s.title" :title="s.title" :description="s.desc" />
      </el-steps>
    </el-card>

    <el-card shadow="never">
      <div class="panel-header">
        样本积累与模型优化
        <div class="panel-actions">
          <el-button type="primary" plain size="small" @click="ElMessage.success('模型优化已触发')" />
        </div>
      </div>
      <el-row :gutter="16">
        <el-col v-for="m in metrics" :key="m.name" :xs="12" :md="6">
          <div class="metric-card">
            <div class="metric-name">{{ m.name }}</div>
            <div class="metric-val" :style="{ color: m.color }">{{ m.val }}</div>
            <div class="metric-desc">{{ m.desc }}</div>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <el-card shadow="never">
      <div class="panel-header">补全推荐列表（按置信度分级）</div>
      <el-table :data="recommends" stripe height="380">
        <el-table-column prop="asset" label="资产" min-width="170" show-overflow-tooltip />
        <el-table-column prop="field" label="字段" width="120" />
        <el-table-column prop="suggest" label="补全建议" min-width="220" show-overflow-tooltip />
        <el-table-column label="置信度" width="130">
          <template #default="{ row }">
            <div class="conf-cell">
              <el-progress :percentage="row.confidence" :color="row.confidence >= 90 ? '#00a854' : row.confidence >= 75 ? '#2b6cb0' : '#ed7b2f'" :stroke-width="8" />
              <span>{{ row.confidence }}%</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="90">
          <template #default="{ row }">
            <el-tag :type="row.status === '已采纳' ? 'success' : 'warning'" size="small" effect="light">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="反馈" width="150" fixed="right">
          <template #default>
            <div class="fb-actions">
              <el-button link type="success" size="small">采纳</el-button>
              <el-button link type="danger" size="small">拒绝</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const learnSteps = [
  { title: '样本积累', desc: '人工标注沉淀样本' },
  { title: '特征学习', desc: '名称/类型/语义特征' },
  { title: '模型优化', desc: '补全模型迭代' },
  { title: '反馈闭环', desc: '采纳/拒绝回流' },
  { title: '置信度分级', desc: '高/中/低分级展示' },
]

const metrics = [
  { name: '样本量', val: '12.6k', color: '#2b6cb0', desc: '本月新增 1.8k' },
  { name: '补全准确率', val: '92.4%', color: '#00a854', desc: '较上月 +3.1%' },
  { name: '待复核条数', val: 186, color: '#ed7b2f', desc: '置信度 < 90%' },
  { name: '反馈采纳率', val: '76.8%', color: '#8b5cf6', desc: '人工反馈闭环' },
]

const recommends = ref([
  { asset: 'ods_flow_section', field: 'peak_flag', suggest: '建议补充注释：是否为客流高峰时段', confidence: 96, status: '已采纳' },
  { asset: 'dwd_ticket_clear_clean', field: 'clear_ratio', suggest: '建议补充数据元映射：清分比例', confidence: 92, status: '待确认' },
  { asset: 'ods_device_status', field: 'online', suggest: '建议打标：设备在线状态', confidence: 88, status: '待确认' },
  { asset: 'ads_运营大屏数据', field: 'ts', suggest: '建议推断类型为时间戳（毫秒级）', confidence: 74, status: '待确认' },
])
</script>

<style scoped>
.standard-page {
  display: grid;
  gap: 16px;
}

.learn-steps {
  margin: 14px 0 18px;
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

.metric-val {
  margin-top: 4px;
  font-size: 24px;
  font-weight: 700;
}

.metric-desc {
  margin-top: 2px;
  color: #8c8c8c;
  font-size: 11px;
}

.conf-cell {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.conf-cell .el-progress {
  flex: 1;
  min-width: 0;
}

.conf-cell span {
  width: 38px;
  flex: none;
  text-align: right;
  font-size: 12px;
  color: #4a4a4a;
}

.fb-actions {
  display: flex;
  gap: 6px;
}
</style>