<template>
  <div class="standard-page">
    <el-card shadow="never">
      <div class="panel-header">元数据检索增强</div>
      <div class="search-bar">
        <el-input v-model="keyword" size="large" placeholder="输入关键词 / SQL / 自然语言检索元数据…" clearable @keyup.enter="doSearch">
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
          <template #append>
            <el-button type="primary" @click="doSearch">检索</el-button>
          </template>
        </el-input>
        <div class="search-modes">
          <el-radio-group v-model="mode" size="small">
            <el-radio-button label="text">全文检索</el-radio-button>
            <el-radio-button label="combo">组合检索</el-radio-button>
            <el-radio-button label="semantic">语义检索</el-radio-button>
          </el-radio-group>
        </div>
      </div>

      <template v-if="searched">
        <div class="result-summary">命中 {{ results.length }} 条结果，耗时 {{ cost }}ms</div>
        <div class="result-list">
          <div v-for="r in results" :key="r.name" class="result-item">
            <div class="result-head">
              <el-tag size="small" :type="r.kind === '表' ? 'primary' : r.kind === '字段' ? 'warning' : 'success'" effect="light">{{ r.kind }}</el-tag>
              <span class="result-name">{{ r.name }}</span>
              <el-button link type="primary" size="small">查看详情</el-button>
            </div>
            <div class="result-desc">{{ r.desc }}</div>
            <div class="result-meta">
              <el-tag v-for="t in r.tags" :key="t" size="small" effect="plain" type="info">{{ t }}</el-tag>
              <span class="result-score">相似度 {{ r.score }}</span>
            </div>
          </div>
        </div>
      </template>

      <template v-else>
        <div class="suggest-block">
          <div class="suggest-title">热门检索</div>
          <div class="suggest-tags">
            <el-tag v-for="s in hotKeywords" :key="s" size="large" class="suggest-tag" @click="keyword = s; doSearch()">{{ s }}</el-tag>
          </div>
          <div class="suggest-title mt-12">检索能力</div>
          <div class="cap-grid">
            <div v-for="c in caps" :key="c.name" class="cap-card">
              <div class="cap-icon"><el-icon><component :is="c.icon" /></el-icon></div>
              <div class="cap-name">{{ c.name }}</div>
              <div class="cap-desc">{{ c.desc }}</div>
            </div>
          </div>
        </div>
      </template>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Search, Files, Grid, MagicStick, Star } from '@element-plus/icons-vue'

const keyword = ref('')
const mode = ref('text')
const searched = ref(false)
const cost = ref(0)

const hotKeywords = ['客流断面', '票务清分', '个人信息', 'device_status', '注册来源']

const caps = [
  { name: '全文检索', desc: '名称/注释/DDL 关键字匹配', icon: Files },
  { name: '组合检索', desc: '类型+层级+标签+时间多条件', icon: Grid },
  { name: '语义检索', desc: '自然语言理解与向量相似度', icon: MagicStick },
  { name: '相似推荐', desc: '关联资产与相似表推荐', icon: Star },
]

type Result = { kind: string; name: string; desc: string; tags: string[]; score: string }

const results = ref<Result[]>([])

function doSearch() {
  if (!keyword.value.trim()) return
  searched.value = true
  cost.value = Math.floor(Math.random() * 200) + 40
  results.value = [
    { kind: '表', name: 'ods_flow_section_2026', desc: '客流断面数据明细表（分时/分站/分方向）', tags: ['主题-客流', '分层-ODS', 'L2'], score: '0.94' },
    { kind: '表', name: 'dws_flow_section_daily', desc: '客流断面日汇总宽表，用于报表与指标加工', tags: ['主题-客流', '分层-DWS', 'L2'], score: '0.91' },
    { kind: '字段', name: 'section_passenger_count', desc: '断面客运量（人次），来源 AFC 清分结算', tags: ['指标-客运量', '责任人-李工'], score: '0.88' },
    { kind: '表', name: 'ticket_clear_result', desc: '票务清分结果表，含清分比例与结算金额', tags: ['主题-票务', '分层-DWD', 'L3'], score: '0.85' },
  ]
}
</script>

<style scoped>
.standard-page {
  display: grid;
  gap: 16px;
}

.search-bar {
  display: grid;
  gap: 10px;
}

.search-modes {
  display: flex;
  justify-content: flex-end;
}

.result-summary {
  margin-top: 16px;
  color: #8c8c8c;
  font-size: 12px;
}

.result-list {
  margin-top: 8px;
  display: grid;
  gap: 10px;
}

.result-item {
  padding: 12px 14px;
  border: 1px solid #edf0f5;
  border-radius: 10px;
  min-width: 0;
}

.result-head {
  display: flex;
  align-items: center;
  gap: 8px;
}

.result-name {
  flex: 1;
  min-width: 0;
  font-weight: 600;
  font-size: 13px;
  color: #4a4a4a;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.result-desc {
  margin-top: 6px;
  color: #4a4a4a;
  font-size: 12px;
  line-height: 1.6;
}

.result-meta {
  margin-top: 6px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
}

.result-score {
  margin-left: auto;
  color: #da251d;
  font-size: 12px;
  font-weight: 600;
}

.suggest-block {
  padding-top: 10px;
}

.suggest-title {
  font-size: 13px;
  font-weight: 600;
  color: #4a4a4a;
  margin-bottom: 10px;
  padding-left: 10px;
  border-left: 3px solid #da251d;
}

.suggest-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.suggest-tag {
  cursor: pointer;
}

.mt-12 {
  margin-top: 20px;
}

.cap-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.cap-card {
  padding: 14px;
  background: #fafafa;
  border: 1px solid #edf0f5;
  border-radius: 10px;
}

.cap-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: grid;
  place-items: center;
  background: rgba(218, 37, 29, 0.08);
  color: #da251d;
}

.cap-name {
  margin-top: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #4a4a4a;
}

.cap-desc {
  margin-top: 2px;
  color: #8c8c8c;
  font-size: 12px;
}
</style>