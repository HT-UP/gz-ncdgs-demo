<template>
  <div class="standard-page">
    <el-card shadow="never">
      <div class="panel-header">
        数据标签统计
        <div class="panel-actions">
          <el-date-picker v-model="range" type="daterange" range-separator="至" start-placeholder="开始" end-placeholder="结束" class="search-input" />
          <el-button type="primary" plain>统计</el-button>
        </div>
      </div>
      <el-tabs v-model="activeTab">
        <el-tab-pane label="使用频率" name="freq">
          <div class="tab-body">
            <div class="freq-list">
              <div v-for="(t, i) in freqTags" :key="t.name" class="freq-item">
                <span class="freq-rank" :class="{ top: i < 3 }">{{ i + 1 }}</span>
                <span class="freq-name">{{ t.name }}</span>
                <el-progress :percentage="t.percent" :color="t.color" :stroke-width="10" />
                <b>{{ t.count }}</b>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="分布情况" name="dist">
          <div class="tab-body">
            <div class="dist-grid">
              <div v-for="d in dists" :key="d.name" class="dist-card">
                <div class="dist-name">{{ d.name }}</div>
                <div class="dist-count">{{ d.count }}</div>
                <div class="dist-pct">{{ d.pct }}%</div>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="覆盖情况" name="cover">
          <div class="tab-body">
            <el-table :data="covers" stripe height="300">
              <el-table-column prop="level" label="业务域" width="140" />
              <el-table-column prop="tagged" label="已打标资产" width="120" />
              <el-table-column prop="total" label="资产总数" width="120" />
              <el-table-column label="覆盖率" min-width="220">
                <template #default="{ row }">
                  <el-progress :percentage="row.rate" :color="row.rate >= 80 ? '#00a854' : row.rate >= 60 ? '#ed7b2f' : '#e34d59'" :stroke-width="10" />
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
        <el-tab-pane label="使用趋势" name="trend">
          <div class="tab-body">
            <div class="trend-bars">
              <div v-for="(d, i) in trend" :key="i" class="tbar-col">
                <div class="tbar-num">{{ d.count }}</div>
                <div class="tbar-track">
                  <div class="tbar-fill" :style="{ height: `${d.pct}%` }"></div>
                </div>
                <div class="tbar-label">{{ d.label }}</div>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="关联特征" name="rel">
          <div class="tab-body">
            <div class="rel-tags">
              <el-tag v-for="r in relTags" :key="r.name" :type="r.type" effect="light" size="large">{{ r.name }}</el-tag>
            </div>
            <div class="rel-note">标签之间关联度由协同出现次数计算，可用于分类分级、资产画像与检索推荐。</div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const activeTab = ref('freq')
const range = ref<[string, string] | undefined>(undefined)

const freqTags = [
  { name: '敏感-个人信息', count: 8640, percent: 96, color: '#da251d' },
  { name: '分级-L3', count: 6280, percent: 70, color: '#ed7b2f' },
  { name: '主题-客流', count: 5210, percent: 58, color: '#2b6cb0' },
  { name: '分层-ODS', count: 4480, percent: 50, color: '#00a854' },
  { name: '质量-待修复', count: 1820, percent: 20, color: '#8b5cf6' },
  { name: '分级-L2', count: 1260, percent: 14, color: '#8c8c8c' },
]

const dists = [
  { name: '分类标签', count: 4820, pct: 32 },
  { name: '分级标签', count: 7540, pct: 50 },
  { name: '主题标签', count: 5210, pct: 35 },
  { name: '质量标签', count: 2130, pct: 14 },
  { name: '运营标签', count: 3860, pct: 26 },
]

const covers = [
  { level: '运营业务域', tagged: 1520, total: 1660, rate: 92 },
  { level: '设备业务域', tagged: 820, total: 1050, rate: 78 },
  { level: '财务业务域', tagged: 640, total: 760, rate: 84 },
  { level: '安全业务域', tagged: 460, total: 980, rate: 47 },
]

const trend = [
  { label: '6-10', count: 1260, pct: 52 },
  { label: '6-11', count: 1380, pct: 58 },
  { label: '6-12', count: 1650, pct: 68 },
  { label: '6-13', count: 1720, pct: 71 },
  { label: '6-14', count: 1890, pct: 78 },
  { label: '6-15', count: 2260, pct: 93 },
  { label: '6-16', count: 2430, pct: 100 },
]

const relTags = [
  { name: '敏感-个人信息', type: 'danger' },
  { name: '分级-L3', type: 'warning' },
  { name: '主题-客流', type: 'primary' },
  { name: '分层-ODS', type: 'success' },
  { name: '合规-个保法', type: 'danger' },
  { name: '质量-待修复', type: 'warning' },
]
</script>

<style scoped>
.tab-body {
  padding-top: 6px;
}

.freq-list {
  display: grid;
  gap: 14px;
  max-width: 860px;
}

.freq-item {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.freq-rank {
  width: 22px;
  height: 22px;
  flex: none;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: #f0f2f5;
  color: #8c8c8c;
  font-size: 12px;
  font-weight: 700;
}

.freq-rank.top {
  background: rgba(218, 37, 29, 0.1);
  color: #da251d;
}

.freq-name {
  width: 150px;
  flex: none;
  font-size: 13px;
  color: #4a4a4a;
}

.freq-item .el-progress {
  flex: 1;
  min-width: 0;
}

.freq-item b {
  width: 44px;
  text-align: right;
  color: #4a4a4a;
}

.dist-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
}

.dist-card {
  padding: 16px;
  background: #fafafa;
  border: 1px solid #edf0f5;
  border-radius: 10px;
  text-align: center;
}

.dist-name {
  color: #8c8c8c;
  font-size: 12px;
}

.dist-count {
  margin-top: 4px;
  font-size: 24px;
  font-weight: 700;
  color: #da251d;
}

.dist-pct {
  margin-top: 2px;
  color: #8c8c8c;
  font-size: 12px;
}

.trend-bars {
  display: flex;
  align-items: flex-end;
  gap: 10px;
  height: 220px;
}

.tbar-col {
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  min-width: 0;
}

.tbar-track {
  width: 55%;
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: flex-end;
  background: #f0f2f5;
  border-radius: 6px 6px 0 0;
  overflow: hidden;
}

.tbar-fill {
  width: 100%;
  background: linear-gradient(180deg, #da251d, #e5716b);
  border-radius: 6px 6px 0 0;
}

.tbar-num {
  margin-bottom: 4px;
  font-size: 11px;
  color: #8c8c8c;
}

.tbar-label {
  margin-top: 6px;
  font-size: 11px;
  color: #8c8c8c;
}

.rel-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.rel-note {
  margin-top: 14px;
  color: #8c8c8c;
  font-size: 12px;
  line-height: 1.8;
}
</style>