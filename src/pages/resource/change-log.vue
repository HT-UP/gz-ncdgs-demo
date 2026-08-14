<template>
  <div class="standard-page">
    <el-card shadow="never">
      <div class="panel-header">
        资产变更日志
        <div class="panel-actions">
          <el-select v-model="type" class="filter-select">
            <el-option v-for="t in types" :key="t" :label="t" :value="t" />
          </el-select>
          <el-input v-model="keyword" placeholder="搜索资产 / 操作人" clearable class="search-input" />
        </div>
      </div>

      <el-alert title="全程记录结构 / 分级 / 标签 / 权限 / 目录调整，日志不可篡改" type="info" :closable="false" show-icon class="mb-16" />

      <el-table :data="logs" stripe height="460">
        <el-table-column prop="time" label="时间" width="160" />
        <el-table-column prop="asset" label="资产" min-width="170" show-overflow-tooltip />
        <el-table-column prop="type" label="变更类型" width="110">
          <template #default="{ row }">
            <el-tag :type="typeTag(row.type)" size="small" effect="light">{{ row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="变更内容" min-width="280" show-overflow-tooltip>
          <template #default="{ row }">
            <span class="before">{{ row.before }}</span>
            <span class="arrow">→</span>
            <span class="after">{{ row.after }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="user" label="操作人" width="100" />
        <el-table-column prop="source" label="来源" width="100">
          <template #default="{ row }">
            <span class="src-source">{{ row.source }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const type = ref('全部')
const types = ['全部', '结构变更', '分级调整', '标签调整', '权限调整', '目录调整']

const logs = ref([
  { time: '2026-06-16 10:12:04', asset: 'ods_flow_section', type: '结构变更', before: '字段(18)', after: '字段(19) 新增 peak_flag', user: '李开发', source: 'DDL同步' },
  { time: '2026-06-16 08:45:30', asset: 'dwd_ticket_clear_clean', type: '分级调整', before: 'L2', after: 'L3（含清分比例）', user: '王数据', source: '人工调整' },
  { time: '2026-06-15 16:20:12', asset: 'ods_employee_profile', type: '标签调整', before: '敏感-个人信息', after: '敏感-个人信息+合规-个保法', user: '赵分析', source: '标签规则' },
  { time: '2026-06-15 11:03:51', asset: 'cert_key_config', type: '权限调整', before: '管理员组', after: '管理员组+审计组(只读)', user: '管理员', source: '权限申请' },
  { time: '2026-06-14 17:40:26', asset: 'cad_line_10_models', type: '目录调整', before: '未挂载', after: '新线建设/10号线/设计', user: '档案员', source: '目录整理' },
  { time: '2026-06-14 09:12:44', asset: 'ods_device_status', type: '结构变更', before: '字段(8)', after: '字段(9) 新增 online', user: '设备组', source: 'DDL同步' },
])

const keyword = ref('')

function typeTag(t: string) {
  return { 结构变更: 'primary', 分级调整: 'warning', 标签调整: 'success', 权限调整: 'danger', 目录调整: 'info' }[t] as 'primary' | 'warning' | 'success' | 'danger' | 'info'
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

.before {
  color: #8c8c8c;
  text-decoration: line-through;
  margin-right: 6px;
}

.arrow {
  color: #c0c4cc;
  margin-right: 6px;
}

.after {
  color: #da251d;
  font-weight: 600;
}

.src-source {
  font-size: 12px;
  color: #4a4a4a;
}
</style>