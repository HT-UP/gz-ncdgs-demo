<template>
  <div class="standard-page">
    <el-card shadow="never">
      <div class="panel-header">
        刷新采集与数据比对
        <div class="panel-actions">
          <el-button type="primary" plain>发起比对</el-button>
        </div>
      </div>

      <el-tabs v-model="activeTab">
        <el-tab-pane label="比对任务" name="task">
          <el-table :data="tasks" stripe height="360">
            <el-table-column prop="name" label="比对任务" min-width="180" show-overflow-tooltip />
            <el-table-column prop="source" label="源表" min-width="160" show-overflow-tooltip />
            <el-table-column prop="target" label="目标表" min-width="160" show-overflow-tooltip />
            <el-table-column label="差异识别" width="90">
              <template #default>
                <el-tag size="small" type="warning" effect="light">自动识别</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="row.status === '完成' ? 'success' : row.status === '比对中' ? 'primary' : 'info'" effect="light" size="small">{{ row.status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="time" label="最近比对" width="140" />
            <el-table-column label="差异统计" min-width="200">
              <template #default="{ row }">
                <div class="diff-stats">
                  <el-tag v-if="row.diff.add" type="success" size="small" effect="plain">新增 {{ row.diff.add }}</el-tag>
                  <el-tag v-if="row.diff.update" type="warning" size="small" effect="plain">更新 {{ row.diff.update }}</el-tag>
                  <el-tag v-if="row.diff.del" type="danger" size="small" effect="plain">删除 {{ row.diff.del }}</el-tag>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="差异明细" name="detail">
          <el-table :data="diffs" stripe height="380">
            <el-table-column type="index" width="50" />
            <el-table-column label="差异类型" width="100">
              <template #default="{ row }">
                <el-tag :type="diffTag(row.kind)" effect="light" size="small">{{ row.kind }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="主键" width="140">
              <template #default="{ row }">{{ row.pk }}</template>
            </el-table-column>
            <el-table-column label="源表值" min-width="200" show-overflow-tooltip>
              <template #default="{ row }">{{ row.sourceVal }}</template>
            </el-table-column>
            <el-table-column label="目标表值" min-width="200" show-overflow-tooltip>
              <template #default="{ row }">{{ row.targetVal }}</template>
            </el-table-column>
            <el-table-column prop="field" label="差异字段" width="140" />
            <el-table-column label="操作" width="120" fixed="right">
              <template #default>
                <el-button link type="primary" size="small">同步</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const activeTab = ref('task')

const tasks = [
  { name: '客流断面-ODS 增量比对', source: 'source.flow_section', target: 'ods.flow_section', status: '完成', time: '2026-06-16 09:30', diff: { add: 126, update: 34, del: 8 } },
  { name: '设备状态-实时刷新比对', source: 'iot.device_status', target: 'ods.device_status', status: '比对中', time: '2026-06-16 10:00', diff: { add: 0, update: 0, del: 0 } },
  { name: '票务清分结果-DWD 比对', source: 'ods.ticket_clear', target: 'dwd.ticket_clear_clean', status: '完成', time: '2026-06-16 08:30', diff: { add: 0, update: 42, del: 0 } },
  { name: '人员信息-主数据比对', source: 'mdm.employee', target: 'ods.employee', status: '完成', time: '2026-06-16 07:50', diff: { add: 5, update: 12, del: 1 } },
]

const diffs = [
  { pk: 'PK-10086', kind: '新增', sourceVal: '(007520, 20260616, 8888)', targetVal: '(不存在)', field: '整行' },
  { pk: 'PK-10085', kind: '更新', sourceVal: 'status=1, ts=2026061609:00', targetVal: 'status=0, ts=2026061508:00', field: 'status, ts' },
  { pk: 'PK-10084', kind: '删除', sourceVal: '(不存在)', targetVal: '(007520, 20260615, 9999)', field: '整行' },
  { pk: 'PK-10083', kind: '更新', sourceVal: 'passengers=1520', targetVal: 'passengers=1526', field: 'passengers' },
]

function diffTag(k: string) {
  return { 新增: 'success', 更新: 'warning', 删除: 'danger' }[k] as 'success' | 'warning' | 'danger'
}
</script>

<style scoped>
.standard-page {
  display: grid;
  gap: 16px;
}

.diff-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
</style>