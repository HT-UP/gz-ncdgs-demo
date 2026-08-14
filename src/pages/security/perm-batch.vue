<template>
  <div class="standard-page">
    <el-card shadow="never">
      <div class="panel-header">
        权限申请批量处理
        <div class="panel-actions">
          <el-button type="success" plain :disabled="!selected.length" @click="batchPass">批量通过</el-button>
          <el-button type="danger" plain :disabled="!selected.length" @click="batchReject">批量驳回</el-button>
        </div>
      </div>

      <div class="batch-tip">已选择 <b>{{ selected.length }}</b> 条申请，批量通过/驳回将进入处理队列</div>

      <el-table :data="rows" stripe height="360">
        <el-table-column type="selection" width="46" @selection-change="onSelect" />
        <el-table-column prop="no" label="申请单号" width="150" />
        <el-table-column prop="applicant" label="申请人" width="90" />
        <el-table-column prop="asset" label="申请资产" min-width="160" show-overflow-tooltip />
        <el-table-column prop="perm" label="权限" min-width="130" show-overflow-tooltip />
        <el-table-column prop="level" label="数据级别" width="90" />
        <el-table-column prop="time" label="申请时间" width="140" />
      </el-table>
    </el-card>

    <el-card shadow="never">
      <div class="panel-header">批量申请（多资产一键提交）</div>
      <div class="batch-apply">
        <div class="ba-form">
          <el-select v-model="assets" multiple filterable placeholder="选择多个资产" class="w-full">
            <el-option v-for="a in allAssets" :key="a" :label="a" :value="a" />
          </el-select>
          <el-select v-model="perm" class="w-full">
            <el-option v-for="p in perms" :key="p" :label="p" :value="p" />
          </el-select>
          <el-button type="primary" @click="submitBatch">一键提交（{{ assets.length }} 个资产）</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const selected = ref<unknown[]>([])

const rows = [
  { no: 'PA-20260616-02', applicant: '周工', asset: 'ods_flow_section', perm: 'SELECT', level: 'L2', time: '2026-06-16 10:02' },
  { no: 'PA-20260616-03', applicant: '吴工', asset: 'ods_device_status', perm: 'SELECT + 导出', level: 'L2', time: '2026-06-16 09:44' },
  { no: 'PA-20260616-04', applicant: '郑工', asset: 'dws_station_daily', perm: 'SELECT', level: 'L2', time: '2026-06-16 08:36' },
  { no: 'PA-20260616-05', applicant: '冯工', asset: 'dwd_ticket_clear_clean', perm: 'SELECT（脱敏）', level: 'L3', time: '2026-06-16 08:12' },
]

function onSelect(sel: unknown[]) {
  selected.value = sel
}

function batchPass() {
  ElMessage.success(`已批量通过 ${selected.value.length} 条申请`)
}

function batchReject() {
  ElMessage.warning(`已批量驳回 ${selected.value.length} 条申请`)
}

const assets = ref<string[]>([])
const allAssets = ['ods_flow_section', 'ods_device_status', 'dws_station_daily', 'dwd_ticket_clear_clean', 'ods_employee_profile']
const perm = ref('SELECT（脱敏）')
const perms = ['SELECT', 'SELECT + 导出', 'SELECT（脱敏）', 'SELECT（脱敏 + 导出）']

function submitBatch() {
  if (!assets.value.length) {
    ElMessage.warning('请选择资产')
    return
  }
  ElMessage.success(`已提交 ${assets.value.length} 个资产的权限批量申请`)
}
</script>

<style scoped>
.standard-page {
  display: grid;
  gap: 16px;
}

.batch-tip {
  margin-bottom: 12px;
  color: #8c8c8c;
  font-size: 12px;
}

.batch-tip b {
  color: #da251d;
}

.batch-apply {
  padding: 4px 0;
}

.ba-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 640px;
}
</style>