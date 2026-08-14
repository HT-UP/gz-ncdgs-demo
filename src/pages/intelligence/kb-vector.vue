<template>
  <div class="standard-page">
    <el-card shadow="never">
      <div class="panel-header">
        知识库 · 知识向量检索
        <div class="panel-actions">
          <el-tag type="success" effect="light">向量引擎 毫秒级响应</el-tag>
          <el-tag type="info" effect="light">索引维度 768</el-tag>
        </div>
      </div>

      <div class="search-bar">
        <el-input v-model="query" size="large" placeholder="输入自然语言问题，如：如何对清分数据进行脱敏？" clearable @keyup.enter="doSearch">
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
          <template #append>
            <el-button type="primary" @click="doSearch">向量检索</el-button>
          </template>
        </el-input>
      </div>

      <template v-if="searched">
        <div class="result-meta">共找到 {{ hits.length }} 条相关度结果，耗时 {{ cost }}ms</div>
        <div class="hit-list">
          <div v-for="(h, i) in hits" :key="i" class="hit-item">
            <div class="hit-head">
              <span class="hit-no">{{ i + 1 }}</span>
              <span class="hit-title">{{ h.title }}</span>
              <span class="hit-score">{{ h.score }}</span>
            </div>
            <div class="hit-snippet">{{ h.snippet }}</div>
            <div class="hit-tags">
              <el-tag v-for="t in h.tags" :key="t" size="small" effect="plain" type="info">{{ t }}</el-tag>
            </div>
          </div>
        </div>
      </template>

      <template v-else>
        <div class="empty-hint">
          <el-empty description="输入问题，将通过向量检索引擎匹配知识库语义内容" :image-size="80" />
        </div>
      </template>
    </el-card>

    <el-card shadow="never">
      <div class="panel-header">
        增强检索能力
        <div class="panel-actions">
          <el-button type="primary" plain size="small">索引管理</el-button>
        </div>
      </div>
      <div class="cap-grid">
        <div v-for="c in caps" :key="c.name" class="cap-card">
          <div class="cap-title">{{ c.name }}</div>
          <div class="cap-desc">{{ c.desc }}</div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Search } from '@element-plus/icons-vue'

const query = ref('')
const searched = ref(false)
const cost = ref(0)

const hits = ref([
  { title: '清分数据脱敏操作指引', snippet: '对票务清分明细中的手机号、证件号等个人字段执行脱敏...', score: 0.96, tags: ['数据安全', '脱敏'] },
  { title: 'L3 敏感数据访问控制规范', snippet: 'L3 数据强制脱敏预览，申请原始字段需单独审批...', score: 0.92, tags: ['数据安全', '分级'] },
  { title: '数据脱敏算法选型指南', snippet: '推荐使用哈希 + 掩码组合实现可逆与不可逆脱敏...', score: 0.87, tags: ['算法', '安全'] },
])

const caps = [
  { name: '向量索引', desc: '768 维语义向量，毫秒级召回' },
  { name: '混合检索', desc: '关键词 + 向量联合排序' },
  { name: '工具对接', desc: '支持智能体 / 数据服务调用' },
]

function doSearch() {
  if (!query.value.trim()) return
  searched.value = true
  cost.value = Math.floor(Math.random() * 60) + 12
}
</script>

<style scoped>
.standard-page {
  display: grid;
  gap: 16px;
}

.search-bar {
  margin: 6px 0 14px;
}

.result-meta {
  color: #8c8c8c;
  font-size: 12px;
  margin-bottom: 10px;
}

.hit-list {
  display: grid;
  gap: 10px;
}

.hit-item {
  padding: 12px 14px;
  border: 1px solid #edf0f5;
  border-radius: 10px;
}

.hit-head {
  display: flex;
  align-items: center;
  gap: 8px;
}

.hit-no {
  width: 20px;
  height: 20px;
  flex: none;
  border-radius: 50%;
  background: rgba(218, 37, 29, 0.1);
  color: #da251d;
  display: grid;
  place-items: center;
  font-size: 11px;
  font-weight: 700;
}

.hit-title {
  flex: 1;
  min-width: 0;
  font-size: 13px;
  font-weight: 600;
  color: #4a4a4a;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.hit-score {
  color: #da251d;
  font-size: 12px;
  font-weight: 600;
}

.hit-snippet {
  margin: 8px 0;
  color: #4a4a4a;
  font-size: 12px;
  line-height: 1.7;
}

.hit-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.empty-hint {
  padding: 10px 0;
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

.cap-title {
  font-size: 13px;
  font-weight: 600;
  color: #4a4a4a;
}

.cap-desc {
  margin-top: 4px;
  color: #8c8c8c;
  font-size: 12px;
}
</style>