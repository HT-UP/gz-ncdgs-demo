<template>
  <div class="standard-page">
    <el-card shadow="never">
      <div class="panel-header">
        安全运营机制 · 事件处置
        <div class="panel-actions">
          <el-button type="primary" plain>新建事件单</el-button>
        </div>
      </div>

      <div class="ops-steps">
        <div v-for="(s, i) in opsFlow" :key="s" class="ops-step" :class="{ on: i <= opsIdx }">
          <div class="ops-step-icon">{{ i + 1 }}</div>
          <div class="ops-step-name">{{ s }}</div>
        </div>
      </div>

      <el-table :data="incidents" stripe height="320">
        <el-table-column prop="no" label="事件编号" width="140" />
        <el-table-column prop="title" label="安全事件" min-width="200" show-overflow-tooltip />
        <el-table-column prop="level" label="分级" width="90">
          <template #default="{ row }">
            <el-tag :type="levelTag(row.level)" size="small" effect="light">{{ row.level }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="stage" label="当前阶段" width="110" />
        <el-table-column prop="owner" label="处置人" width="90" />
        <el-table-column prop="time" label="发生时间" width="140" />
        <el-table-column label="复盘" width="90">
          <template #default>
            <el-button link type="primary" size="small">复盘</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-card shadow="never">
      <div class="panel-header">安全审计运营</div>
      <el-table :data="audits" stripe height="260">
        <el-table-column prop="name" label="审计项" min-width="200" show-overflow-tooltip />
        <el-table-column prop="freq" label="频率" width="100" />
        <el-table-column prop="last" label="最近执行" width="140" />
        <el-table-column prop="result" label="结果" width="100">
          <template #default="{ row }">
            <el-tag :type="row.result === '正常' ? 'success' : 'warning'" size="small" effect="light">{{ row.result }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="note" label="备注" min-width="160" show-overflow-tooltip />
      </el-table>
    </el-card>

    <el-card shadow="never">
      <div class="panel-header">应急演练</div>
      <div class="drill-list">
        <div v-for="d in drills" :key="d.name" class="drill-item">
          <div class="drill-body">
            <div class="drill-name">{{ d.name }}</div>
            <div class="drill-meta">{{ d.date }} · {{ d.participants }}</div>
          </div>
          <el-tag :type="d.status === '已完成' ? 'success' : 'warning'" size="small" effect="light">{{ d.status }}</el-tag>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const opsFlow = ['发现', '分级', '处置', '复盘']
const opsIdx = 2

const incidents = ref([
  { no: 'SEC-0616-01', title: '账号异地登录（未绑定多因素）', level: '高危', stage: '处置中', owner: '安全组', time: '2026-06-16 03:12' },
  { no: 'SEC-0615-04', title: '敏感接口未鉴权重放尝试', level: '中危', stage: '复盘', owner: '安全组', time: '2026-06-15 22:40' },
  { no: 'SEC-0615-02', title: '桌面终端违规连接外网', level: '低危', stage: '已闭环', owner: '网络组', time: '2026-06-15 15:20' },
])

const audits = ref([
  { name: '数据库账号权限一致性审计', freq: '每周', last: '2026-06-13', result: '正常', note: '-' },
  { name: 'OS 安全基线与补丁核查', freq: '每月', last: '2026-06-01', result: '需整改', note: '3 台主机补丁滞后' },
  { name: '网络边界策略复核', freq: '每周', last: '2026-06-14', result: '正常', note: '-' },
  { name: '弱口令与口令策略审计', freq: '每月', last: '2026-06-05', result: '正常', note: '已强制复杂度策略' },
])

const drills = [
  { name: '勒索软件应急处置演练', date: '2026-05-20', participants: '安全组/IT/运营 24 人', status: '已完成' },
  { name: '数据泄露响应复盘演练', date: '2026-06-10', participants: '安全组/信息组 15 人', status: '已完成' },
  { name: 'Q3 基础设施容灾切换演练', date: '2026-07-15（计划）', participants: '拟 30 人', status: '待执行' },
]

function levelTag(l: string) {
  return { 高危: 'danger', 中危: 'warning', 低危: 'info' }[l] as 'danger' | 'warning' | 'info'
}
</script>

<style scoped>
.standard-page {
  display: grid;
  gap: 16px;
}

.ops-steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
  gap: 8px;
  margin-bottom: 16px;
}

.ops-step {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  background: #fafafa;
  opacity: 0.6;
}

.ops-step.on {
  border-color: #da251d;
  background: rgba(218, 37, 29, 0.05);
  opacity: 1;
}

.ops-step-icon {
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

.ops-step.on .ops-step-icon {
  background: #da251d;
  color: #fff;
}

.ops-step-name {
  font-size: 12px;
  color: #4a4a4a;
}

.drill-list {
  display: grid;
  gap: 10px;
}

.drill-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border: 1px solid #edf0f5;
  border-radius: 8px;
  background: #fafafa;
}

.drill-body {
  flex: 1;
  min-width: 0;
}

.drill-name {
  font-size: 13px;
  font-weight: 600;
  color: #4a4a4a;
}

.drill-meta {
  margin-top: 2px;
  color: #8c8c8c;
  font-size: 12px;
}
</style>