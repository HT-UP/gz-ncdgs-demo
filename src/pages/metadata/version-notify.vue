<template>
  <div class="standard-page">
    <el-card shadow="never">
      <div class="panel-header">
        元数据版本通知
        <div class="panel-actions">
          <el-button type="primary" plain>新建通知</el-button>
        </div>
      </div>

      <el-alert
        title="版本发布后自动向 表/字段责任人、下游任务责任人、服务调用方、订阅用户 四类对象发送通知"
        type="info"
        :closable="false"
        show-icon
        class="mb-16"
      />

      <el-table :data="notices" stripe height="400">
        <el-table-column prop="title" label="通知标题" min-width="200" show-overflow-tooltip />
        <el-table-column prop="version" label="版本号" width="90" />
        <el-table-column prop="change" label="变更内容" min-width="200" show-overflow-tooltip />
        <el-table-column label="通知范围" min-width="240">
          <template #default="{ row }">
            <div class="scope-tags">
              <el-tag v-for="s in row.scope" :key="s" size="small" effect="plain">{{ s }}</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === '已发送' ? 'success' : row.status === '发送中' ? 'warning' : 'info'" effect="light" size="small">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="time" label="发送时间" width="140" />
        <el-table-column label="操作" width="100" fixed="right">
          <template #default>
            <el-button link type="primary" size="small">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-card shadow="never">
      <div class="panel-header">通知对象统计</div>
      <div class="obj-grid">
        <div v-for="o in objStats" :key="o.name" class="obj-card">
          <div class="obj-name">{{ o.name }}</div>
          <div class="obj-count">{{ o.count }}</div>
          <div class="obj-desc">{{ o.desc }}</div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const notices = ref([
  { title: 'user_info 表结构变更通知', version: 'v2.4.1', change: '新增 register_source、clean_channel 字段', scope: ['表责任人', '字段责任人', '下游任务责任人', '服务调用方'], status: '已发送', time: '2026-06-10 15:30' },
  { title: 'flow_hourly 分区策略变更', version: 'v2.4.0', change: '按天分区调整为按小时分区', scope: ['表责任人', '下游任务责任人'], status: '已发送', time: '2026-06-02 10:15' },
  { title: 'ticket_price 精度调整', version: 'v2.3.2', change: '金额字段 decimal(10,2) 调整为 decimal(12,2)', scope: ['字段责任人', '订阅用户'], status: '已发送', time: '2026-05-26 16:40' },
  { title: 'settlement_temp 表重命名', version: 'v2.3.0', change: '重命名为 settlement_clean，旧名保留 30 天', scope: ['表责任人', '下游任务责任人', '服务调用方'], status: '发送中', time: '2026-05-12 11:20' },
])

const objStats = [
  { name: '表/字段责任人', count: 26, desc: '涉及 12 张表、41 个字段' },
  { name: '下游任务责任人', count: 38, desc: '涉及 22 个调度任务' },
  { name: '服务调用方', count: 12, desc: '涉及 8 个数据服务' },
  { name: '订阅用户', count: 56, desc: '按个人偏好接收' },
]
</script>

<style scoped>
.standard-page {
  display: grid;
  gap: 16px;
}

.mb-16 {
  margin-bottom: 16px;
}

.scope-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.obj-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
}

.obj-card {
  padding: 14px 16px;
  background: #fafafa;
  border: 1px solid #edf0f5;
  border-radius: 10px;
}

.obj-name {
  color: #8c8c8c;
  font-size: 12px;
}

.obj-count {
  margin-top: 4px;
  font-size: 24px;
  font-weight: 700;
  color: #da251d;
}

.obj-desc {
  margin-top: 2px;
  color: #8c8c8c;
  font-size: 11px;
}
</style>