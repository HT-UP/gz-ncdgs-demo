<template>
  <div class="standard-page">
    <el-card shadow="never">
      <div class="panel-header">
        质量问题工单状态机
        <div class="panel-actions">
          <el-button type="primary" plain>新建工单</el-button>
        </div>
      </div>

      <div class="flow-line">
        <div v-for="(s, i) in flow" :key="s.name" class="flow-step" :class="{ on: i <= flowIndex }">
          <div class="flow-step-icon">{{ i + 1 }}</div>
          <div class="flow-step-name">{{ s.name }}</div>
        </div>
      </div>

      <el-alert title="工单状态机：待派发 → 处理中 → 待复检 → 已销号 → 已关闭（支持驳回重开）" type="info" :closable="false" show-icon class="mb-16" />

      <el-table :data="tickets" stripe height="380">
        <el-table-column prop="no" label="工单编号" width="130" />
        <el-table-column prop="title" label="问题描述" min-width="220" show-overflow-tooltip />
        <el-table-column prop="asset" label="涉及资产" min-width="140" show-overflow-tooltip />
        <el-table-column prop="level" label="级别" width="80">
          <template #default="{ row }">
            <el-tag :type="levelTag(row.level)" size="small" effect="light">{{ row.level }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="当前状态" width="90">
          <template #default="{ row }">
            <el-tag :type="statusTag(row.status)" size="small" effect="light">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="owner" label="处理人" width="90" />
        <el-table-column prop="deadline" label="时限" width="100" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default>
            <el-button link type="primary" size="small">流转</el-button>
            <el-button link type="info" size="small">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const flow = [
  { name: '待派发' },
  { name: '处理中' },
  { name: '待复检' },
  { name: '已销号' },
  { name: '已关闭' },
]

const flowIndex = 2

const tickets = ref([
  { no: 'QT-20260616-01', title: '票务清分结果金额合计与明细不一致', asset: 'dwd_ticket_clear_clean', level: '严重', status: '处理中', owner: '李开发', deadline: '06-18' },
  { no: 'QT-20260616-02', title: '客流断面表 6 月数据缺失 2 小时窗口', asset: 'ods_flow_section', level: '严重', status: '待复检', owner: '王数据', deadline: '06-17' },
  { no: 'QT-20260615-08', title: '设备状态表唯一键重复', asset: 'ods_device_status', level: '警告', status: '待派发', owner: '-', deadline: '06-19' },
  { no: 'QT-20260615-05', title: '人员档案手机号格式不合法 38 条', asset: 'ods_employee_profile', level: '警告', status: '处理中', owner: '赵分析', deadline: '06-18' },
  { no: 'QT-20260614-11', title: '信号接口表引用完整性破坏', asset: 'ods_sig_interface', level: '严重', status: '已销号', owner: '钱运营', deadline: '06-16' },
])

function levelTag(l: string) {
  return { 严重: 'danger', 警告: 'warning', 提示: 'info' }[l] as 'danger' | 'warning' | 'info'
}

function statusTag(s: string) {
  return { 待派发: 'info', 处理中: 'primary', 待复检: 'warning', 已销号: 'success', 已关闭: 'success' }[s] as 'info' | 'primary' | 'warning' | 'success'
}
</script>

<style scoped>
.standard-page {
  display: grid;
  gap: 16px;
}

.flow-line {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 8px;
  margin-bottom: 16px;
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

.flow-step-icon {
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

.flow-step.on .flow-step-icon {
  background: #da251d;
  color: #fff;
}

.flow-step-name {
  font-size: 12px;
  color: #4a4a4a;
}

.mb-16 {
  margin-bottom: 16px;
}
</style>