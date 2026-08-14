<template>
  <div class="standard-page">
    <el-card shadow="never">
      <div class="panel-header">
        流式数据处理增强
        <div class="panel-actions">
          <el-radio-group v-model="engine" size="small">
            <el-radio-button label="Flink">Flink</el-radio-button>
            <el-radio-button label="SparkStreaming">Spark Streaming</el-radio-button>
            <el-radio-button label="流批一体">流批一体协同</el-radio-button>
          </el-radio-group>
        </div>
      </div>

      <el-row :gutter="16">
        <el-col :xs="24" :md="8">
          <el-card shadow="never" class="hc">
            <div class="panel-header">引擎集成状态</div>
            <div class="engine-list">
              <div v-for="e in engines" :key="e.name" class="engine-item">
                <div class="engine-head">
                  <span class="engine-name">{{ e.name }}</span>
                  <el-tag :type="e.status === '运行中' ? 'success' : 'info'" size="small" effect="light">{{ e.status }}</el-tag>
                </div>
                <div class="engine-meta">{{ e.version }} · 集群 {{ e.nodes }} 节点</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :xs="24" :md="16">
          <el-card shadow="never" class="hc">
            <div class="panel-header">CEP 复杂事件处理</div>
            <div class="cep-list">
              <div v-for="r in cepRules" :key="r.name" class="cep-item">
                <div class="cep-name">{{ r.name }}</div>
                <div class="cep-pattern">{{ r.pattern }}</div>
                <div class="cep-meta">
                  <span class="cep-trigger">最近触发：{{ r.lastTrigger }}</span>
                  <el-tag size="small" :type="r.count > 0 ? 'danger' : 'info'" effect="plain">今日 {{ r.count }} 次</el-tag>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <el-card shadow="never">
        <div class="panel-header">流批一体作业</div>
        <el-table :data="jobs" stripe height="300">
          <el-table-column prop="name" label="作业名称" min-width="180" show-overflow-tooltip />
          <el-table-column prop="mode" label="模式" width="120" />
          <el-table-column prop="source" label="数据源" min-width="140" show-overflow-tooltip />
          <el-table-column prop="sink" label="结果表" min-width="140" show-overflow-tooltip />
          <el-table-column prop="throughput" label="吞吐" width="100" />
          <el-table-column label="状态" width="90">
            <template #default="{ row }">
              <el-tag :type="row.status === '运行中' ? 'success' : 'danger'" effect="light" size="small">{{ row.status }}</el-tag>
            </template>
          </el-table-column>
        </el-table>
        </el-card>
      </el-card>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const engine = ref('Flink')

const engines = [
  { name: 'Flink 集群', version: '1.18.1', nodes: 6, status: '运行中' },
  { name: 'Spark Streaming', version: '3.5.1', nodes: 4, status: '运行中' },
  { name: 'Kafka Streams', version: '3.7.0', nodes: 3, status: '运行中' },
]

const cepRules = [
  { name: '连续 3 次设备离线告警', pattern: 'SEQ(offline, offline, offline) WITHIN 5min', lastTrigger: '2026-06-16 09:58', count: 2 },
  { name: '客流突变（3 分钟增长 200%）', pattern: 'A(flow) WHERE inc > 200% NEXT B(flow) WITHIN 3min', lastTrigger: '2026-06-16 08:41', count: 1 },
  { name: '票务金额异常波动', pattern: 'SEQ(settle, settle) WHERE abs(amount) > 5x', lastTrigger: '2026-06-15 22:15', count: 0 },
]

const jobs = [
  { name: '客流实时汇入 ODS', mode: '流批一体', source: 'Kafka: flow_topic', sink: 'ods.flow_section', throughput: '8.2k/s', status: '运行中' },
  { name: '设备状态实时同步', mode: '流批一体', source: 'Kafka: device_topic', sink: 'ods.device_status', throughput: '3.1k/s', status: '运行中' },
  { name: '票务清分实时汇总', mode: '批流互转', source: 'MySQL binlog', sink: 'dwd.ticket_clear_clean', throughput: '1.4k/s', status: '运行中' },
  { name: '安全日志实时规则命中', mode: '流式处理', source: 'Kafka: sec_log_topic', sink: 'dws.sec_alert', throughput: '0.6k/s', status: '运行中' },
]
</script>

<style scoped>
.standard-page {
  display: grid;
  gap: 16px;
}

.hc {
  height: 100%;
}

.engine-list {
  display: grid;
  gap: 10px;
}

.engine-item {
  padding: 10px 12px;
  border: 1px solid #edf0f5;
  border-radius: 8px;
  background: #fafafa;
}

.engine-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.engine-name {
  font-size: 13px;
  font-weight: 600;
  color: #4a4a4a;
}

.engine-meta {
  margin-top: 2px;
  color: #8c8c8c;
  font-size: 12px;
}

.cep-list {
  display: grid;
  gap: 10px;
}

.cep-item {
  padding: 10px 12px;
  border: 1px solid #edf0f5;
  border-radius: 8px;
}

.cep-name {
  font-size: 13px;
  font-weight: 600;
  color: #4a4a4a;
}

.cep-pattern {
  margin-top: 4px;
  font-family: Consolas, Menlo, monospace;
  font-size: 12px;
  color: #2b6cb0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cep-meta {
  margin-top: 6px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #8c8c8c;
  font-size: 11px;
}
</style>