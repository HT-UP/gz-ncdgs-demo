<template>
  <div class="standard-page">
    <el-card shadow="never">
      <div class="panel-header">
        资产级统计分析
        <div class="panel-actions">
          <el-radio-group v-model="level" size="small">
            <el-radio-button label="按数据源">按数据源</el-radio-button>
            <el-radio-button label="按分层">按分层</el-radio-button>
            <el-radio-button label="按主题">按主题</el-radio-button>
          </el-radio-group>
        </div>
      </div>

      <el-table :data="statRows" stripe height="300">
        <el-table-column prop="name" label="统计维度" min-width="160" show-overflow-tooltip />
        <el-table-column prop="tables" label="表数量" width="100" />
        <el-table-column prop="storage" label="存储量" min-width="130" show-overflow-tooltip />
        <el-table-column label="存储占比" min-width="180">
          <template #default="{ row }">
            <div class="stor-cell">
              <el-progress :percentage="row.percent" :color="pctColor(row.percent)" :stroke-width="10" />
              <span>{{ row.percent }}%</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="heat" label="热度指数" width="110">
          <template #default="{ row }">
            <b :style="{ color: row.heat > 80 ? '#da251d' : '#4a4a4a' }">{{ row.heat }}</b>
          </template>
        </el-table-column>
        <el-table-column prop="quality" label="平均质量分" width="110" />
        <el-table-column prop="issues" label="待处理问题" width="110" />
      </el-table>
    </el-card>

    <el-card shadow="never">
      <div class="panel-header">
        存储量 Top 数据源
        <div class="panel-actions">
          <el-button type="primary" plain size="small" @click="refresh">刷新统计</el-button>
        </div>
      </div>
      <div class="top-bars">
        <div v-for="(t, i) in topStorages" :key="t.name" class="top-bar-row">
          <span class="top-rank">{{ i + 1 }}</span>
          <span class="top-name">{{ t.name }}</span>
          <div class="top-track">
            <div class="top-fill" :style="{ width: `${t.pct}%` }" :title="`${t.storage}`"></div>
          </div>
          <span class="top-value">{{ t.storage }}</span>
        </div>
      </div>
    </el-card>

    <el-card shadow="never">
      <div class="panel-header">
        热度排行
        <div class="panel-actions">
          <el-button type="primary" plain size="small">热度详情</el-button>
        </div>
      </div>
      <el-table :data="heatList" stripe height="280">
        <el-table-column type="index" width="60" />
        <el-table-column prop="asset" label="资产名称" min-width="200" show-overflow-tooltip />
        <el-table-column prop="visits" label="访问次数（周）" width="130" />
        <el-table-column label="热度趋势" min-width="180">
          <template #default>
            <div class="mini-trend">
              <i v-for="n in 7" :key="n" :style="{ height: `${10 + Math.random() * 40}%` }"></i>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="rank" label="热度排名" width="90">
          <template #default="{ row }">
            <el-tag size="small" :type="row.rank <= 3 ? 'danger' : 'info'" effect="light">#{{ row.rank }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const level = ref('按数据源')

const statRows = [
  { name: '地铁线网运营主库', tables: 428, storage: '3.8 TB', percent: 29, heat: 92, quality: 97.2, issues: 6 },
  { name: '客流实时采集库', tables: 96, storage: '1.2 TB', percent: 9, heat: 96, quality: 94.5, issues: 22 },
  { name: '运营分析数仓', tables: 612, storage: '4.6 TB', percent: 36, heat: 88, quality: 96.1, issues: 15 },
  { name: '设备物联采集域', tables: 254, storage: '2.1 TB', percent: 16, heat: 74, quality: 89.3, issues: 18 },
  { name: '历史归档中心', tables: 486, storage: '1.1 TB', percent: 8, heat: 36, quality: 93.0, issues: 4 },
  { name: '安全审计存储库', tables: 42, storage: '0.2 TB', percent: 2, heat: 58, quality: 98.4, issues: 1 },
]

const topStorages = [
  { name: '运营分析数仓', storage: '4.6 TB', pct: 100 },
  { name: '地铁线网运营主库', storage: '3.8 TB', pct: 83 },
  { name: '设备物联采集域', storage: '2.1 TB', pct: 46 },
  { name: '客流实时采集库', storage: '1.2 TB', pct: 26 },
]

const heatList = [
  { asset: 'dws_flow_section_daily', visits: 1280, rank: 1 },
  { asset: 'ads_运营大屏数据', visits: 986, rank: 2 },
  { asset: 'dwd_ticket_clear_clean', visits: 742, rank: 3 },
  { asset: 'ods_device_status', visits: 516, rank: 4 },
  { asset: 'ods_employee_profile', visits: 328, rank: 5 },
]

function pctColor(v: number) {
  if (v >= 30) return '#da251d'
  if (v >= 15) return '#ed7b2f'
  return '#00a854'
}

function refresh() {
  ElMessage.success('统计已刷新')
}
</script>

<style scoped>
.standard-page {
  display: grid;
  gap: 16px;
}

.stor-cell {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.stor-cell .el-progress {
  flex: 1;
  min-width: 0;
}

.stor-cell span {
  width: 42px;
  flex: none;
  text-align: right;
  color: #4a4a4a;
  font-size: 12px;
}

.top-bars {
  display: grid;
  gap: 14px;
}

.top-bar-row {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.top-rank {
  width: 20px;
  height: 20px;
  flex: none;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: rgba(218, 37, 29, 0.1);
  color: #da251d;
  font-size: 11px;
  font-weight: 700;
}

.top-name {
  width: 150px;
  flex: none;
  font-size: 13px;
  color: #4a4a4a;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.top-track {
  flex: 1;
  min-width: 0;
  height: 12px;
  background: #f0f2f5;
  border-radius: 6px;
  overflow: hidden;
}

.top-fill {
  height: 100%;
  border-radius: 6px;
  background: linear-gradient(90deg, #da251d, #e5716b);
}

.top-value {
  width: 70px;
  flex: none;
  text-align: right;
  color: #4a4a4a;
  font-size: 13px;
  font-weight: 600;
}

.mini-trend {
  display: flex;
  align-items: flex-end;
  gap: 3px;
  height: 24px;
}

.mini-trend i {
  width: 6px;
  border-radius: 2px;
  background: #da251d;
}
</style>