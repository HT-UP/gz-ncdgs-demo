<template>
  <div class="standard-page">
    <el-card shadow="never">
      <div class="panel-header">
        质量规则模板库明细
        <div class="panel-actions">
          <el-select v-model="category" class="filter-select">
            <el-option v-for="c in categories" :key="c" :label="c" :value="c" />
          </el-select>
          <el-input v-model="keyword" placeholder="搜索模板" clearable class="search-input" />
        </div>
      </div>

      <div class="tpl-summary">
        <div v-for="c in catStats" :key="c.name" class="tpl-stat">
          <div class="tpl-stat-name">{{ c.name }}</div>
          <div class="tpl-stat-count">{{ c.count }}</div>
        </div>
      </div>

      <el-table :data="filtered" stripe height="440">
        <el-table-column type="index" width="50" />
        <el-table-column prop="name" label="模板名称" min-width="170" show-overflow-tooltip />
        <el-table-column prop="category" label="分类" width="90" />
        <el-table-column prop="desc" label="功能说明" min-width="240" show-overflow-tooltip />
        <el-table-column label="示例配置" min-width="180">
          <template #default="{ row }">
            <code class="tpl-code">{{ row.example }}</code>
          </template>
        </el-table-column>
        <el-table-column prop="usage" label="使用次数" width="90" />
        <el-table-column label="操作" width="110" fixed="right">
          <template #default>
            <el-button link type="primary" size="small">立即使用</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const category = ref('全部')
const categories = ['全部', '完整性', '准确性', '一致性', '唯一性', '时效性']

const catStats = [
  { name: '完整性类', count: 3 },
  { name: '准确性类', count: 4 },
  { name: '一致性类', count: 3 },
  { name: '唯一性类', count: 2 },
  { name: '时效性类', count: 2 },
]

const rows = [
  { name: '非空校验', category: '完整性', desc: '校验字段是否为空值/空串，支持自定义排除值', example: 'not null', usage: 86 },
  { name: '格式校验', category: '准确性', desc: '按正则表达式校验字段格式（手机号/身份证/邮箱）', example: '^1[3-9]\\d{9}$', usage: 64 },
  { name: '字典值域校验', category: '准确性', desc: '校验字段值是否在指定字典/枚举范围内', example: 'IN (01,02,03)', usage: 58 },
  { name: '唯一性校验', category: '唯一性', desc: '校验字段或字段组合是否重复', example: 'unique (id)', usage: 52 },
  { name: '关联一致性校验', category: '一致性', desc: '校验主外键关联、跨表一致性', example: 'ref check', usage: 39 },
  { name: '数值范围校验', category: '准确性', desc: '校验数值是否在 [min, max] 范围内', example: '0 <= v <= 100', usage: 47 },
  { name: '时间格式校验', category: '时效性', desc: '校验日期时间格式与逻辑合法性', example: 'yyyy-MM-dd', usage: 33 },
  { name: '数据新鲜度校验', category: '时效性', desc: '校验数据是否在预期时间内完成更新', example: 'T-1 10:00', usage: 28 },
  { name: '重复记录校验', category: '唯一性', desc: '整行或关键字段组合重复检测', example: 'dup rows', usage: 24 },
  { name: '前后值波动校验', category: '准确性', desc: '对比周期值，波动超阈值告警', example: '±20%', usage: 18 },
  { name: '码值映射校验', category: '一致性', desc: '校验源码值在目标系统中映射完整', example: 'map check', usage: 15 },
  { name: '引用完整性校验', category: '一致性', desc: '校验外键引用是否存在（孤儿检测）', example: 'fk exists', usage: 21 },
]

const keyword = ref('')

const filtered = computed(() =>
  rows.filter(
    (r) =>
      (category.value === '全部' || r.category === category.value) &&
      (!keyword.value || r.name.includes(keyword.value) || r.desc.includes(keyword.value)),
  ),
)
</script>

<style scoped>
.standard-page {
  display: grid;
  gap: 16px;
}

.tpl-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: 12px;
  margin-bottom: 4px;
}

.tpl-stat {
  padding: 12px;
  background: #fafafa;
  border: 1px solid #edf0f5;
  border-radius: 10px;
  text-align: center;
}

.tpl-stat-name {
  color: #8c8c8c;
  font-size: 12px;
}

.tpl-stat-count {
  margin-top: 2px;
  font-size: 22px;
  font-weight: 700;
  color: #da251d;
}

.tpl-code {
  font-family: Consolas, Menlo, monospace;
  font-size: 11px;
  background: #f0f2f5;
  padding: 2px 6px;
  border-radius: 4px;
  color: #2b6cb0;
}
</style>