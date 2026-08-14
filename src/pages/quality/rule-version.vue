<template>
  <div class="standard-page">
    <el-card shadow="never">
      <div class="panel-header">
        质量规则版本管理
        <div class="panel-actions">
          <el-button type="primary" plain>发起变更审批</el-button>
        </div>
      </div>

      <el-row :gutter="16">
        <el-col :xs="24" :md="16">
          <el-table :data="versions" stripe height="400">
            <el-table-column prop="rule" label="规则名称" min-width="180" show-overflow-tooltip />
            <el-table-column prop="version" label="当前版本" width="100" />
            <el-table-column prop="range" label="影响范围" min-width="150" show-overflow-tooltip />
            <el-table-column prop="status" label="状态" width="90">
              <template #default="{ row }">
                <el-tag :type="statusTag(row.status)" effect="light" size="small">{{ row.status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="updatedAt" label="更新时间" width="120" />
            <el-table-column label="操作" width="200" fixed="right">
              <template #default>
                <el-button link type="primary" size="small">对比</el-button>
                <el-button link type="warning" size="small">回滚</el-button>
                <el-button link type="info" size="small">历史</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :xs="24" :md="8">
          <div class="panel-header">变更审批流</div>
          <el-timeline>
            <el-timeline-item v-for="(a, i) in approvals" :key="i" :timestamp="a.time" :type="a.type">
              <div class="appr-line">
                <b>{{ a.user }}</b> · {{ a.action }}
              </div>
            </el-timeline-item>
          </el-timeline>
        </el-col>
      </el-row>

      <el-dialog v-model="compareVisible" title="版本对比" width="700px">
        <div v-if="diffRows.length" class="diff-table">
          <div class="diff-row diff-head">
            <span>配置项</span><span>v1.2.0（当前）</span><span>v1.1.6（历史）</span><span>变更</span>
          </div>
          <div v-for="d in diffRows" :key="d.key" class="diff-row">
            <span>{{ d.key }}</span>
            <span>{{ d.new }}</span>
            <span class="old">{{ d.old }}</span>
            <el-tag size="small" :type="d.impact === '高' ? 'danger' : 'warning'" effect="plain">{{ d.impact }}</el-tag>
          </div>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const versions = [
  { rule: '客票金额非负校验', version: 'v1.2.0', range: '影响 3 张表、12 个批次任务', status: '生效中', updatedAt: '2026-06-10' },
  { rule: '客流断面空值校验', version: 'v1.1.6', range: '影响 1 张表、4 个批次任务', status: '生效中', updatedAt: '2026-05-28' },
  { rule: '设备编码字典校验', version: 'v2.0.1', range: '影响 2 张表、8 个批次任务', status: '待审批', updatedAt: '2026-06-14' },
  { rule: '票务清分关联一致性', version: 'v1.0.3', range: '影响 4 张表、16 个批次任务', status: '生效中', updatedAt: '2026-05-15' },
]

const approvals = [
  { user: '王数据', action: '审核通过 v2.0.1 设备编码字典校验变更', time: '2026-06-15 10:20', type: 'success' },
  { user: '李开发', action: '提交规则版本变更申请', time: '2026-06-14 16:45', type: 'primary' },
  { user: '赵审查', action: '发现 v1.2.0 影响任务清单需评估', time: '2026-06-12 11:30', type: 'warning' },
]

const compareVisible = ref(false)

const diffRows = [
  { key: '校验粒度', new: '行级 + 批次级', old: '仅批次级', impact: '高' },
  { key: '告警阈值', new: '2%', old: '5%', impact: '中' },
  { key: '执行频率', new: '每小时', old: '每批后', impact: '中' },
  { key: '通知对象', new: '表责任人', old: '无', impact: '低' },
]

function statusTag(s: string) {
  return { 生效中: 'success', 待审批: 'warning', 已回滚: 'info' }[s] as 'success' | 'warning' | 'info'
}
</script>

<style scoped>
.standard-page {
  display: grid;
  gap: 16px;
}

.appr-line {
  font-size: 12px;
  color: #4a4a4a;
}

.diff-table {
  border: 1px solid #edf0f5;
  border-radius: 8px;
  overflow: hidden;
}

.diff-row {
  display: grid;
  grid-template-columns: 1.2fr 1.2fr 1.2fr 0.6fr;
  gap: 10px;
  padding: 10px 12px;
  border-bottom: 1px solid #edf0f5;
  font-size: 12px;
  color: #4a4a4a;
  align-items: center;
  min-width: 0;
}

.diff-row:last-child {
  border-bottom: none;
}

.diff-head {
  background: #f7f8fa;
  font-weight: 600;
  color: #4a4a4a;
}

.diff-row .old {
  color: #e34d59;
  text-decoration: line-through;
}
</style>