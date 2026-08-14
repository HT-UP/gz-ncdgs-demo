<template>
  <div class="standard-page">
    <el-card shadow="never">
      <div class="panel-header">
        权限申请流程状态机
        <div class="panel-actions">
          <el-button type="primary" plain>新建权限申请</el-button>
        </div>
      </div>

      <div class="flow-line">
        <div v-for="(s, i) in flow" :key="s" class="flow-step" :class="{ on: i <= flowIdx }">
          <div class="flow-icon">{{ i + 1 }}</div>
          <div class="flow-name">{{ s }}</div>
        </div>
      </div>
    </el-card>

    <el-card shadow="never">
      <div class="panel-header">
        申请单列表
        <div class="panel-actions">
          <el-select v-model="status" class="filter-select">
            <el-option v-for="s in statusOptions" :key="s" :label="s" :value="s" />
          </el-select>
        </div>
      </div>
      <el-table :data="rows" stripe height="400">
        <el-table-column prop="no" label="申请单号" width="150" />
        <el-table-column prop="applicant" label="申请人" width="100" />
        <el-table-column prop="asset" label="申请资产" min-width="160" show-overflow-tooltip />
        <el-table-column prop="perm" label="申请权限" min-width="120" show-overflow-tooltip />
        <el-table-column prop="status" label="当前状态" width="110">
          <template #default="{ row }">
            <el-tag :type="statusTag(row.status)" size="small" effect="light">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="time" label="申请时间" width="140" />
        <el-table-column label="操作" width="110" fixed="right">
          <template #default>
            <el-button link type="primary" size="small">查看流程</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const flow = ['草稿', '待审批', '审批中', '已通过', '已授权', '已到期', '已回收']

const flowIdx = 4

const status = ref('全部')
const statusOptions = ['全部', '草稿', '待审批', '审批中', '已通过', '已驳回', '已授权', '已到期', '已回收']

const rows = ref([
  { no: 'PA-20260616-01', applicant: '王数据', asset: 'dwd_ticket_clear_clean', perm: 'SELECT（L3 脱敏）', status: '已授权', time: '2026-06-16 09:30' },
  { no: 'PA-20260615-02', applicant: '李开发', asset: 'ods_employee_profile', perm: 'SELECT 原始字段', status: '审批中', time: '2026-06-15 15:20' },
  { no: 'PA-20260614-03', applicant: '赵分析', asset: 'cert_key_config', perm: '只读配置', status: '已驳回', time: '2026-06-14 11:02' },
  { no: 'PA-20260612-04', applicant: '钱运营', asset: 'ods_flow_section', perm: 'SELECT + 导出', status: '已通过', time: '2026-06-12 10:40' },
  { no: 'PA-20260601-05', applicant: '孙工', asset: 'ads_运营大屏数据', perm: 'SELECT', status: '已到期', time: '2026-06-01 08:15' },
])

function statusTag(s: string) {
  return { 草稿: 'info', 待审批: 'warning', 审批中: 'primary', 已通过: 'success', 已驳回: 'danger', 已授权: 'success', 已到期: 'info', 已回收: 'info' }[s] as 'info' | 'warning' | 'primary' | 'success' | 'danger'
}
</script>

<style scoped>
.standard-page {
  display: grid;
  gap: 16px;
}

.flow-line {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
  gap: 8px;
  margin: 6px 0 4px;
}

.flow-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 10px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  background: #fafafa;
  opacity: 0.6;
}

.flow-step.on {
  border-color: #da251d;
  background: rgba(218, 37, 29, 0.05);
  opacity: 1;
}

.flow-icon {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: #e4e7ed;
  color: #8c8c8c;
  font-size: 12px;
  font-weight: 700;
}

.flow-step.on .flow-icon {
  background: #da251d;
  color: #fff;
}

.flow-name {
  font-size: 12px;
  color: #4a4a4a;
  white-space: nowrap;
}
</style>