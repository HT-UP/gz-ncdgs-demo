<template>
  <div class="standard-page">
    <el-card shadow="never">
      <div class="panel-header">
        实时质量监控
        <div class="panel-actions">
          <el-tag type="success" effect="light">实时订阅通道正常</el-tag>
        </div>
      </div>

      <el-row :gutter="16">
        <el-col v-for="m in metrics" :key="m.name" :xs="24" :md="6">
          <div class="rm-card">
            <div class="rm-name">{{ m.name }}</div>
            <div class="rm-value" :style="{ color: m.color }">{{ m.value }}</div>
            <div class="rm-desc">{{ m.desc }}</div>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <el-card shadow="never">
      <div class="panel-header">
        实时校验事件流
        <div class="panel-actions">
          <el-switch v-model="liveListen" active-text="实时监听" />
        </div>
      </div>
      <el-table :data="events" stripe height="360">
        <el-table-column prop="time" label="时间" width="170" />
        <el-table-column prop="asset" label="数据表" min-width="160" show-overflow-tooltip />
        <el-table-column prop="rule" label="命中规则" min-width="180" show-overflow-tooltip />
        <el-table-column prop="type" label="类型" width="90">
          <template #default="{ row }">
            <el-tag :type="row.type === '拦截' ? 'danger' : row.type === '预警' ? 'warning' : 'info'" size="small" effect="light">{{ row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="detail" label="事件明细" min-width="240" show-overflow-tooltip />
        <el-table-column label="状态" width="90">
          <template #default="{ row }">
            <el-tag :type="row.status === '已处理' ? 'success' : 'warning'" size="small" effect="plain">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const liveListen = ref(true)

const metrics = [
  { name: '实时数据变更', value: '1.2万/s', color: '#2b6cb0', desc: '订阅变更通道' },
  { name: '即时拦截', value: 86, color: '#e34d59', desc: '今日拦截异常写入' },
  { name: '实时通过率', value: '99.3%', color: '#00a854', desc: '较昨日 +0.4%' },
  { name: '待处置事件', value: 12, color: '#ed7b2f', desc: '最长等待 8 分钟' },
]

const events = ref([
  { time: '2026-06-16 11:02:14', asset: 'ods_flow_section', rule: '空值校验', type: '拦截', detail: '插入记录含 2 个必填字段为空，已阻止写入', status: '已处理' },
  { time: '2026-06-16 10:58:03', asset: 'dwd_ticket_clear_clean', rule: '金额非负校验', type: '拦截', detail: '4 条负金额记录被拦截，已转人工', status: '处理中' },
  { time: '2026-06-16 10:47:42', asset: 'ods_device_status', rule: '唯一性校验', type: '预警', detail: '检测到 device_id 重复插入，即将冲突', status: '处理中' },
  { time: '2026-06-16 10:35:21', asset: 'ods_employee_profile', rule: '格式校验', type: '拦截', detail: '手机号格式非法 6 条，已拒绝入库', status: '已处理' },
  { time: '2026-06-16 10:22:08', asset: 'dws_station_daily', rule: '值域校验', type: '预警', detail: '客运量超过设定阈值 20%', status: '待处理' },
])
</script>

<style scoped>
.standard-page {
  display: grid;
  gap: 16px;
}

.rm-card {
  padding: 14px 16px;
  background: #fafafa;
  border: 1px solid #edf0f5;
  border-radius: 10px;
}

.rm-name {
  color: #8c8c8c;
  font-size: 12px;
}

.rm-value {
  margin-top: 4px;
  font-size: 26px;
  font-weight: 700;
}

.rm-desc {
  margin-top: 2px;
  color: #8c8c8c;
  font-size: 11px;
}
</style>