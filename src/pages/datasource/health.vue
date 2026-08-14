<template>
  <div class="standard-page">
    <el-row :gutter="16">
      <el-col :xs="24" :md="16">
        <el-card shadow="never">
          <div class="panel-header">数据源健康度总览</div>
          <div class="health-summary">
            <div class="health-gauge">
              <div class="gauge-inner">
                <div class="gauge-num">87.6</div>
                <div class="gauge-unit">综合健康度</div>
              </div>
            </div>
            <div class="health-dimensions">
              <div v-for="d in dims" :key="d.name" class="health-dim">
                <div class="dim-head">
                  <span>{{ d.name }}</span>
                  <b :style="{ color: d.color }">{{ d.score }}</b>
                </div>
                <el-progress :percentage="d.score" :color="d.color" :stroke-width="10" />
                <div class="dim-note">权重 {{ d.weight }}%</div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :md="8">
        <el-card shadow="never">
          <div class="panel-header">健康分布</div>
          <div class="level-legend">
            <div v-for="l in levels" :key="l.name" class="level-item">
              <span class="level-dot" :style="{ background: l.color }"></span>
              <span class="level-name">{{ l.name }}</span>
              <b>{{ l.count }}</b>
            </div>
          </div>
          <div class="level-bars">
            <div v-for="l in levels" :key="l.name" class="level-bar-row">
              <span class="level-bar-label">{{ l.name }}</span>
              <el-progress :percentage="(l.count / 12) * 100" :color="l.color" :show-text="false" :stroke-width="12" />
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-card shadow="never">
      <div class="panel-header">
        数据源健康度清单
        <div class="panel-actions">
          <el-input v-model="keyword" placeholder="搜索数据源" clearable class="search-input" />
          <el-button type="primary" plain>重新评估</el-button>
        </div>
      </div>
      <el-table :data="filtered" stripe height="420">
        <el-table-column prop="name" label="数据源名称" min-width="170" show-overflow-tooltip />
        <el-table-column prop="type" label="类型" width="110" />
        <el-table-column prop="host" label="地址 / 实例" min-width="150" show-overflow-tooltip />
        <el-table-column label="健康等级" width="100">
          <template #default="{ row }">
            <el-tag :type="levelTag(row.level)" effect="light">{{ row.level }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="综合得分" width="130">
          <template #default="{ row }">
            <div class="score-cell">
              <el-progress :percentage="row.score" :color="scoreColor(row.level)" :stroke-width="8" />
              <span class="score-num">{{ row.score }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="各维得分" min-width="260">
          <template #default="{ row }">
            <div class="dim-inline">
              <span v-for="d in row.dims" :key="d.name" class="dim-chip" :title="`${d.name} ${d.score}`">
                <i :style="{ background: dimScoreColor(d.score) }"></i>{{ d.score }}
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="owner" label="负责人" width="90" />
        <el-table-column prop="updatedAt" label="评估时间" width="110" />
        <el-table-column label="操作" width="80" fixed="right">
          <template #default>
            <el-button link type="primary" size="small">明细</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

type HealthRow = {
  name: string
  type: string
  host: string
  level: string
  score: number
  owner: string
  updatedAt: string
  dims: { name: string; score: number }[]
}

const dims = [
  { name: '连通性', score: 92, weight: 30, color: '#00a854' },
  { name: '稳定性', score: 88, weight: 30, color: '#2b6cb0' },
  { name: '性能', score: 84, weight: 25, color: '#ed7b2f' },
  { name: '容量', score: 86, weight: 15, color: '#8b5cf6' },
]

const levels = [
  { name: '健康', count: 8, color: '#00a854' },
  { name: '关注', count: 3, color: '#ed7b2f' },
  { name: '异常', count: 1, color: '#e34d59' },
]

const rows: HealthRow[] = [
  { name: '地铁线网运营主库', type: 'Oracle', host: '10.20.1.55:1521/OPDB', level: '健康', score: 94, owner: '张工', updatedAt: '2026-06-12', dims: [{ name: '连通', score: 96 }, { name: '稳定', score: 93 }, { name: '性能', score: 92 }, { name: '容量', score: 95 }] },
  { name: '客流实时采集库', type: 'MySQL', host: '10.20.3.12:3306/flows', level: '健康', score: 91, owner: '李工', updatedAt: '2026-06-12', dims: [{ name: '连通', score: 93 }, { name: '稳定', score: 90 }, { name: '性能', score: 89 }, { name: '容量', score: 92 }] },
  { name: '运营分析数仓', type: 'Doris', host: '10.21.2.8:8030/dw', level: '健康', score: 89, owner: '王工', updatedAt: '2026-06-12', dims: [{ name: '连通', score: 91 }, { name: '稳定', score: 88 }, { name: '性能', score: 87 }, { name: '容量', score: 90 }] },
  { name: '设备物联采集域', type: 'HBase', host: '10.22.4.6:2181/iot', level: '关注', score: 78, owner: '赵工', updatedAt: '2026-06-12', dims: [{ name: '连通', score: 82 }, { name: '稳定', score: 76 }, { name: '性能', score: 80 }, { name: '容量', score: 74 }] },
  { name: '票务清分预结算库', type: 'PostgreSQL', host: '10.20.5.9:5432/ccrs', level: '健康', score: 90, owner: '钱工', updatedAt: '2026-06-12', dims: [{ name: '连通', score: 92 }, { name: '稳定', score: 91 }, { name: '性能', score: 88 }, { name: '容量', score: 89 }] },
  { name: '信号系统明细库', type: 'SQLServer', host: '10.23.1.21:1433/sig', level: '关注', score: 75, owner: '孙工', updatedAt: '2026-06-12', dims: [{ name: '连通', score: 80 }, { name: '稳定', score: 72 }, { name: '性能', score: 74 }, { name: '容量', score: 75 }] },
  { name: '历史归档中心', type: 'HDFS', host: '10.24.1.30:8020/arch', level: '健康', score: 86, owner: '周工', updatedAt: '2026-06-12', dims: [{ name: '连通', score: 87 }, { name: '稳定', score: 85 }, { name: '性能', score: 84 }, { name: '容量', score: 88 }] },
  { name: '外部接口网关库', type: 'Redis', host: '10.20.3.40:6379/gw', level: '关注', score: 72, owner: '吴工', updatedAt: '2026-06-12', dims: [{ name: '连通', score: 78 }, { name: '稳定', score: 70 }, { name: '性能', score: 75 }, { name: '容量', score: 65 }] },
  { name: '安全审计存储库', type: 'ClickHouse', host: '10.25.2.11:8123/sa', level: '健康', score: 88, owner: '郑工', updatedAt: '2026-06-12', dims: [{ name: '连通', score: 89 }, { name: '稳定', score: 87 }, { name: '性能', score: 90 }, { name: '容量', score: 86 }] },
  { name: '信源数据汇聚区', type: 'Kafka', host: '10.22.1.5:9092/ods', level: '关注', score: 76, owner: '冯工', updatedAt: '2026-06-12', dims: [{ name: '连通', score: 80 }, { name: '稳定', score: 73 }, { name: '性能', score: 78 }, { name: '容量', score: 72 }] },
  { name: '防汛应急专题库', type: 'MongoDB', host: '10.26.3.3:27017/emerg', level: '健康', score: 93, owner: '陈工', updatedAt: '2026-06-12', dims: [{ name: '连通', score: 94 }, { name: '稳定', score: 93 }, { name: '性能', score: 92 }, { name: '容量', score: 93 }] },
  { name: '新线设计文档库', type: 'Elasticsearch', host: '10.27.1.18:9200/cad', level: '异常', score: 58, owner: '褚工', updatedAt: '2026-06-12', dims: [{ name: '连通', score: 62 }, { name: '稳定', score: 55 }, { name: '性能', score: 66 }, { name: '容量', score: 48 }] },
]

const keyword = ref('')

const filtered = computed(() => rows.filter((r) => !keyword.value || r.name.includes(keyword.value) || r.host.includes(keyword.value)))

function levelTag(level: string) {
  return { 健康: 'success', 关注: 'warning', 异常: 'danger' }[level] as 'success' | 'warning' | 'danger'
}

function scoreColor(level: string) {
  return { 健康: '#00a854', 关注: '#ed7b2f', 异常: '#e34d59' }[level]
}

function dimScoreColor(score: number) {
  if (score >= 85) return '#00a854'
  if (score >= 70) return '#ed7b2f'
  return '#e34d59'
}
</script>

<style scoped>
.standard-page {
  display: grid;
  gap: 16px;
}

.health-summary {
  display: grid;
  grid-template-columns: 180px 1fr;
  gap: 20px;
  align-items: center;
  padding: 8px 0 4px;
}

@media (max-width: 1100px) {
  .health-summary {
    grid-template-columns: 1fr;
  }
}

.health-gauge {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  margin: 0 auto;
  background: conic-gradient(#da251d 0deg 315deg, #eee 315deg 360deg);
  display: grid;
  place-items: center;
}

.gauge-inner {
  width: 112px;
  height: 112px;
  border-radius: 50%;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.gauge-num {
  font-size: 30px;
  font-weight: 700;
  color: #da251d;
  line-height: 1;
}

.gauge-unit {
  margin-top: 4px;
  color: #8c8c8c;
  font-size: 12px;
}

.health-dimensions {
  display: grid;
  gap: 12px;
  min-width: 0;
}

.health-dim {
  min-width: 0;
}

.dim-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: #4a4a4a;
  margin-bottom: 4px;
}

.dim-note {
  margin-top: 2px;
  color: #8c8c8c;
  font-size: 11px;
}

.level-legend {
  display: grid;
  gap: 10px;
  padding: 4px 0 12px;
}

.level-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #4a4a4a;
}

.level-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.level-name {
  flex: 1;
}

.level-bars {
  display: grid;
  gap: 10px;
  border-top: 1px solid #edf0f5;
  padding-top: 12px;
}

.level-bar-row {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.level-bar-label {
  width: 42px;
  flex: none;
  color: #8c8c8c;
  font-size: 12px;
}

.level-bar-row .el-progress {
  flex: 1;
  min-width: 0;
}

.score-cell {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.score-cell .el-progress {
  flex: 1;
  min-width: 0;
}

.score-num {
  font-weight: 700;
  color: #4a4a4a;
  font-size: 13px;
}

.dim-inline {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.dim-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 1px 8px;
  border-radius: 10px;
  background: #f7f8fa;
  font-size: 12px;
  color: #4a4a4a;
}

.dim-chip i {
  width: 7px;
  height: 7px;
  border-radius: 50%;
}
</style>