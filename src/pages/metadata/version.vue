<template>
  <div class="standard-page">
    <el-card shadow="never">
      <div class="panel-header">
        元数据版本管理
        <div class="panel-actions">
          <el-button type="primary" plain>发起变更申请</el-button>
        </div>
      </div>

      <el-steps :active="step" align-center finish-status="success" class="ver-steps">
        <el-step v-for="s in verSteps" :key="s.title" :title="s.title" :description="s.desc" />
      </el-steps>
    </el-card>

    <el-card v-if="step > 0" shadow="never">
      <div class="panel-header">当前变更：{{ currentChange.title }}</div>
      <el-descriptions :column="3" border size="small" class="ver-desc">
        <el-descriptions-item label="变更类型">{{ currentChange.kind }}</el-descriptions-item>
        <el-descriptions-item label="影响数据表">{{ currentChange.tables }} 张</el-descriptions-item>
        <el-descriptions-item label="影响下游任务">{{ currentChange.tasks }} 个</el-descriptions-item>
        <el-descriptions-item label="影响服务">{{ currentChange.services }} 个</el-descriptions-item>
        <el-descriptions-item label="影响报表">{{ currentChange.reports }} 个</el-descriptions-item>
        <el-descriptions-item label="影响标准映射">{{ currentChange.mappings }} 个</el-descriptions-item>
      </el-descriptions>
      <div v-if="step >= 2" class="impact-list mt-12">
        <div class="impact-title">影响范围明细</div>
        <div v-for="(imp, i) in impacts" :key="i" class="impact-row">
          <span class="impact-type">{{ imp.type }}</span>
          <span class="impact-name">{{ imp.name }}</span>
          <el-tag size="small" :type="imp.risk === '高' ? 'danger' : imp.risk === '中' ? 'warning' : 'info'" effect="plain">风险{{ imp.risk }}</el-tag>
          <el-button link type="primary" size="small">查看详情</el-button>
        </div>
      </div>
      <div class="ver-actions">
        <el-button @click="step = step > 0 ? step - 1 : 0">上一步</el-button>
        <el-button v-if="step < 4" type="primary" @click="step += 1">下一步</el-button>
        <template v-else>
          <el-button type="success" @click="publish">{{ verDone ? '已发布，重新发起' : '实施并发布' }}</el-button>
        </template>
      </div>
    </el-card>

    <el-card shadow="never">
      <div class="panel-header">版本历史</div>
      <el-table :data="history" stripe height="340">
        <el-table-column prop="version" label="版本号" width="100" />
        <el-table-column prop="title" label="变更内容" min-width="220" show-overflow-tooltip />
        <el-table-column prop="author" label="申请人" width="100" />
        <el-table-column label="状态" width="110">
          <template #default="{ row }">
            <el-tag :type="statusTag(row.status)" effect="light" size="small">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="time" label="提交时间" width="140" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default>
            <el-button link type="primary" size="small">版本对比</el-button>
            <el-button link type="warning" size="small">回滚</el-button>
            <el-button link type="info" size="small">通知</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const verSteps = [
  { title: '变更申请', desc: '发起元数据变更' },
  { title: '影响评估', desc: '自动扫描影响面' },
  { title: '审批', desc: '业务与技术评审' },
  { title: '实施', desc: '变更落地执行' },
  { title: '发布通知', desc: '知会相关责任人' },
]

const step = ref(1)

const currentChange = {
  title: '用户表 user_info 新增字段 register_source、clean_channel',
  kind: '表结构变更',
  tables: 1,
  tasks: 6,
  services: 3,
  reports: 2,
  mappings: 4,
}

const impacts = [
  { type: '下游任务', name: 'ods_user_info_to_dwd 同步任务', risk: '高' },
  { type: '调度任务', name: 'dwd_user_daily 指标加工', risk: '中' },
  { type: '数据服务', name: '用户维度查询服务 /api/v1/user', risk: '中' },
  { type: '报表', name: '运营用户增长分析（周报）', risk: '低' },
  { type: '标准映射', name: '数据元「用户注册来源」映射失效', risk: '高' },
]

const verDone = ref(false)

function publish() {
  verDone.value = true
  step.value = 0
  ElMessage.success('变更已实施并通过发布通知生效')
}

const history = [
  { version: 'v2.4.1', title: '用户表 user_info 新增 register_source 字段', author: '王工', status: '已发布', time: '2026-06-10 14:20' },
  { version: 'v2.4.0', title: '客流表 flow_hourly 分区策略调整', author: '李工', status: '已发布', time: '2026-06-02 09:41' },
  { version: 'v2.3.2', title: '票价表 ticket_price 字段精度调整', author: '赵工', status: '已发布', time: '2026-05-26 16:08' },
  { version: 'v2.3.1', title: '设备表 device_status 增加 online 状态列', author: '钱工', status: '已废止', time: '2026-05-18 11:30' },
  { version: 'v2.3.0', title: '清分表 settlement_temp 重命名 settlement_clean', author: '孙工', status: '已发布', time: '2026-05-12 10:02' },
]

function statusTag(s: string) {
  return { 已发布: 'success', 已废止: 'info', 待审批: 'warning', 实施中: 'primary' }[s] as 'success' | 'info' | 'warning' | 'primary'
}
</script>

<style scoped>
.standard-page {
  display: grid;
  gap: 16px;
}

.ver-steps {
  margin: 10px 0 4px;
}

.ver-desc {
  margin-top: 6px;
}

.impact-list {
  margin-top: 14px;
  display: grid;
  gap: 8px;
}

.impact-title {
  font-size: 13px;
  font-weight: 600;
  color: #4a4a4a;
}

.impact-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border: 1px solid #edf0f5;
  border-radius: 8px;
}

.impact-type {
  width: 90px;
  flex: none;
  color: #da251d;
  font-size: 12px;
  font-weight: 600;
}

.impact-name {
  flex: 1;
  min-width: 0;
  font-size: 12px;
  color: #4a4a4a;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ver-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px solid #edf0f5;
}

.mt-12 {
  margin-top: 12px;
}
</style>