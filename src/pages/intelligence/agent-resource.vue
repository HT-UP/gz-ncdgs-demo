<template>
  <div class="standard-page">
    <el-card shadow="never">
      <div class="panel-header">
        数据资源管理智能体（细化）
        <div class="panel-actions">
          <el-button type="primary" plain>运行智能体</el-button>
        </div>
      </div>

      <el-steps :active="2" align-center finish-status="success" class="flow-steps">
        <el-step v-for="s in flow" :key="s.title" :title="s.title" :description="s.desc" />
      </el-steps>
    </el-card>

    <el-card shadow="never">
      <div class="panel-header">
        智能分析归类
        <div class="panel-actions">
          <el-input v-model="keyword" placeholder="搜索资产" clearable class="search-input" />
        </div>
      </div>
      <el-table :data="assets" stripe height="380">
        <el-table-column prop="asset" label="资产" min-width="170" show-overflow-tooltip />
        <el-table-column prop="inferred" label="智能推断分类" min-width="170" show-overflow-tooltip />
        <el-table-column label="置信度" width="130">
          <template #default="{ row }">
            <div class="conf-cell">
              <el-progress :percentage="row.confidence" :color="row.confidence >= 90 ? '#00a854' : '#ed7b2f'" :stroke-width="8" />
              <span>{{ row.confidence }}%</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="110">
          <template #default="{ row }">
            <el-tag :type="row.status === '待确认' ? 'warning' : 'success'" size="small" effect="light">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default>
            <el-button link type="primary" size="small">确认归类</el-button>
            <el-button link type="info" size="small">调整目录</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-card shadow="never">
      <div class="panel-header">目录回写记录</div>
      <el-table :data="writebacks" stripe height="260">
        <el-table-column prop="time" label="时间" width="150" />
        <el-table-column prop="asset" label="资产" min-width="160" show-overflow-tooltip />
        <el-table-column prop="target" label="回写目录" min-width="180" show-overflow-tooltip />
        <el-table-column label="结果" width="100">
          <template #default="{ row }">
            <el-tag :type="row.result === '成功' ? 'success' : 'warning'" size="small" effect="light">{{ row.result }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const flow = [
  { title: '智能分析归类', desc: '解析资产特征' },
  { title: '目录信息确认', desc: '人工确认分类' },
  { title: '资产挂载', desc: '挂载目标目录' },
  { title: '目录回写', desc: '同步资源目录' },
]

const keyword = ref('')

const assets = ref([
  { asset: 'ods_flow_section_2026', inferred: '主题域-客流 · 分层-ODS', confidence: 96, status: '已确认' },
  { asset: 'cad_line_10_models', inferred: '新线建设-BIM模型', confidence: 93, status: '已确认' },
  { asset: 'ticket_clear_result', inferred: '主题域-票务 · 分层-DWD', confidence: 91, status: '待确认' },
  { asset: 'device_gps_log', inferred: '主题域-设备 · 分层-ODS', confidence: 82, status: '待确认' },
  { asset: 'quality_rule_set', inferred: '治理域-质量规则', confidence: 88, status: '待确认' },
])

const writebacks = ref([
  { time: '2026-06-16 09:42', asset: 'ods_flow_section_2026', target: '运营业务域/客流主题/ODS层', result: '成功' },
  { time: '2026-06-16 09:42', asset: 'cad_line_10_models', target: '新线建设/10号线/设计模型', result: '成功' },
  { time: '2026-06-15 16:20', asset: 'ticket_clear_result', target: '财务业务域/票务主题/DWD层', result: '待确认' },
])
</script>

<style scoped>
.standard-page {
  display: grid;
  gap: 16px;
}

.flow-steps {
  margin: 14px 0 6px;
}

.conf-cell {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.conf-cell .el-progress {
  flex: 1;
  min-width: 0;
}

.conf-cell span {
  width: 38px;
  flex: none;
  text-align: right;
  font-size: 12px;
  color: #4a4a4a;
}
</style>