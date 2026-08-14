<template>
  <div class="standard-page">
    <el-card shadow="never">
      <div class="panel-header">
        任务调度与执行架构
        <div class="panel-actions">
          <el-tag type="success" effect="light">调度中心 运行中</el-tag>
          <el-tag type="success" effect="light">执行节点 8/8 在线</el-tag>
        </div>
      </div>

      <div class="arch-visual">
        <div class="arch-node arch-center">
          <div class="arch-title">调度中心</div>
          <div class="arch-sub">策略编排 · 失败重试 · 并发控制</div>
        </div>
        <div class="arch-flow arch-arrow">调度分发 ▼</div>
        <div class="arch-nodes">
          <div v-for="n in execNodes" :key="n.name" class="arch-node arch-exec">
            <div class="arch-title">{{ n.name }}</div>
            <div class="arch-sub">节点 {{ n.ip }} · 任务 {{ n.tasks }} 个</div>
            <div class="arch-load">
              <el-progress :percentage="n.load" :color="n.load > 80 ? '#e34d59' : n.load > 60 ? '#ed7b2f' : '#00a854'" :stroke-width="8" />
            </div>
          </div>
        </div>
      </div>
    </el-card>

    <el-row :gutter="16">
      <el-col :xs="24" :md="12">
        <el-card shadow="never" class="hc">
          <div class="panel-header">调度策略配置</div>
          <el-table :data="strategies" size="small" height="280">
            <el-table-column prop="name" label="策略" min-width="130" show-overflow-tooltip />
            <el-table-column prop="value" label="配置值" min-width="150" show-overflow-tooltip />
            <el-table-column prop="desc" label="说明" min-width="150" show-overflow-tooltip />
          </el-table>
        </el-card>
      </el-col>
      <el-col :xs="24" :md="12">
        <el-card shadow="never" class="hc">
          <div class="panel-header">执行节点负载</div>
          <div class="node-load-list">
            <div v-for="n in execNodes" :key="n.name" class="node-load">
              <span class="node-load-name">{{ n.name }}</span>
              <el-progress :percentage="n.load" :color="n.load > 80 ? '#e34d59' : n.load > 60 ? '#ed7b2f' : '#00a854'" :stroke-width="10" />
              <span class="node-load-num">{{ n.load }}%</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-card shadow="never">
      <div class="panel-header">
        调度任务执行记录
        <div class="panel-actions">
          <el-input v-model="keyword" placeholder="搜索任务" clearable class="search-input" />
        </div>
      </div>
      <el-table :data="records" stripe height="320">
        <el-table-column prop="name" label="任务名称" min-width="180" show-overflow-tooltip />
        <el-table-column prop="priority" label="优先级" width="90" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="statusTag(row.status)" effect="light" size="small">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="node" label="执行节点" min-width="120" show-overflow-tooltip />
        <el-table-column prop="start" label="开始时间" width="140" />
        <el-table-column prop="cost" label="耗时" width="90" />
        <el-table-column prop="retry" label="重试次数" width="80" />
        <el-table-column prop="compensate" label="补偿" width="90">
          <template #default="{ row }">
            <el-tag v-if="row.compensate === '已补偿'" type="warning" size="small" effect="plain">{{ row.compensate }}</el-tag>
            <span v-else class="no-comp">-</span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const execNodes = [
  { name: '调度执行节点-01', ip: '10.30.1.11', tasks: 32, load: 68 },
  { name: '调度执行节点-02', ip: '10.30.1.12', tasks: 41, load: 82 },
  { name: '调度执行节点-03', ip: '10.30.1.13', tasks: 25, load: 55 },
  { name: '调度执行节点-04', ip: '10.30.2.11', tasks: 18, load: 46 },
]

const strategies = [
  { name: '失败重试', value: '3 次 / 指数退避', desc: '间隔 30s→60s→120s' },
  { name: '并发控制', value: '单任务最大 8', desc: '超限进入等待队列' },
  { name: '优先级', value: 'P0-P4', desc: 'P0 实时任务优先' },
  { name: '补偿机制', value: '开启', desc: '跨天补跑自动触发' },
  { name: '限流策略', value: '集群 500 并发', desc: '防止资源雪崩' },
]

const keyword = ref('')

const records = [
  { name: 'ODS_客流明细_实时', priority: 'P0', status: '运行中', node: '执行节点-02', start: '2026-06-16 10:00:00', cost: '-', retry: 0, compensate: '-' },
  { name: 'DWD_票务清分_小时', priority: 'P1', status: '成功', node: '执行节点-01', start: '2026-06-16 09:00:02', cost: '3m20s', retry: 1, compensate: '-' },
  { name: 'DWS_运营指标_日', priority: 'P1', status: '成功', node: '执行节点-03', start: '2026-06-16 08:30:00', cost: '12m05s', retry: 0, compensate: '-' },
  { name: 'ADS_报表数据_日', priority: 'P2', status: '成功', node: '执行节点-04', start: '2026-06-16 08:00:00', cost: '8m42s', retry: 2, compensate: '-' },
  { name: 'SIG_信号接口_增量', priority: 'P1', status: '失败', node: '执行节点-02', start: '2026-06-16 09:15:00', cost: '2m01s', retry: 3, compensate: '已补偿' },
  { name: '归档_历史快照', priority: 'P3', status: '成功', node: '执行节点-01', start: '2026-06-16 07:00:00', cost: '25m18s', retry: 0, compensate: '-' },
]

function statusTag(s: string) {
  return { 成功: 'success', 运行中: 'primary', 失败: 'danger', 等待中: 'info' }[s] as 'success' | 'primary' | 'danger' | 'info'
}
</script>

<style scoped>
.standard-page {
  display: grid;
  gap: 16px;
}

.arch-visual {
  padding: 16px 0 8px;
  display: grid;
  gap: 14px;
}

.arch-node {
  padding: 14px 18px;
  border: 1px solid #e4e7ed;
  border-radius: 10px;
  background: #fafafa;
}

.arch-center {
  border-left: 4px solid #da251d;
  background: rgba(218, 37, 29, 0.04);
}

.arch-title {
  font-size: 14px;
  font-weight: 700;
  color: #4a4a4a;
}

.arch-sub {
  margin-top: 2px;
  font-size: 12px;
  color: #8c8c8c;
}

.arch-flow {
  text-align: center;
  color: #8c8c8c;
  font-size: 12px;
}

.arch-nodes {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.arch-exec {
  border-top: 3px solid #2b6cb0;
}

.arch-load {
  margin-top: 8px;
}

.hc {
  height: 100%;
}

.node-load-list {
  display: grid;
  gap: 14px;
  padding: 4px 0;
}

.node-load {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.node-load-name {
  width: 130px;
  flex: none;
  font-size: 12px;
  color: #4a4a4a;
}

.node-load .el-progress {
  flex: 1;
  min-width: 0;
}

.node-load-num {
  width: 42px;
  flex: none;
  text-align: right;
  font-size: 12px;
  color: #4a4a4a;
  font-weight: 600;
}

.no-comp {
  color: #c0c4cc;
}
</style>