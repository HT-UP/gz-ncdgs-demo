<template>
  <div class="standard-page">
    <el-card shadow="never">
      <div class="panel-header">
        知识服务化发布
        <div class="panel-actions">
          <el-button type="primary" plain>注册新服务</el-button>
        </div>
      </div>

      <el-alert title="知识问答 / 检索能力按需注册发布为数据服务，供业务系统与智能体调用" type="info" :closable="false" show-icon class="mb-16" />

      <el-table :data="services" stripe height="380">
        <el-table-column prop="name" label="服务名称" min-width="180" show-overflow-tooltip />
        <el-table-column prop="type" label="能力类型" width="110">
          <template #default="{ row }">
            <el-tag size="small" effect="plain" :type="row.type === '问答' ? 'primary' : 'success'">{{ row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="endpoint" label="服务地址" min-width="190" show-overflow-tooltip />
        <el-table-column prop="kb" label="关联知识库" min-width="140" show-overflow-tooltip />
        <el-table-column label="状态" width="90">
          <template #default="{ row }">
            <el-tag :type="row.status === '已发布' ? 'success' : 'warning'" size="small" effect="light">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="called" label="调用次数" width="100" />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default>
            <el-button link type="primary" size="small">接口文档</el-button>
            <el-button link type="danger" size="small">下线</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-card shadow="never">
      <div class="panel-header">
        服务调用统计
        <div class="panel-actions">
          <el-button type="primary" plain size="small">调用详情</el-button>
        </div>
      </div>
      <el-row :gutter="16">
        <el-col v-for="s in stats" :key="s.name" :xs="12" :md="6">
          <div class="stat-card">
            <div class="stat-name">{{ s.name }}</div>
            <div class="stat-val">{{ s.val }}</div>
            <div class="stat-desc">{{ s.desc }}</div>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const services = ref([
  { name: '数据安全知识问答服务', type: '问答', endpoint: '/api/kb/qa/security', kb: '数据安全知识库', status: '已发布', called: 2860 },
  { name: '数据质量知识检索服务', type: '检索', endpoint: '/api/kb/search/quality', kb: '数据质量知识库', status: '已发布', called: 1420 },
  { name: '治理规范智能问答', type: '问答', endpoint: '/api/kb/qa/governance', kb: '数据治理知识库', status: '已发布', called: 860 },
  { name: '新线规范检索服务', type: '检索', endpoint: '/api/kb/search/buildline', kb: '新线建设知识库', status: '测试中', called: 0 },
])

const stats = [
  { name: '总调用', val: '5.1k', desc: '近 30 天' },
  { name: '平均响应', val: '86ms', desc: '毫秒级响应' },
  { name: '命中率', val: '94.2%', desc: '有效回答比例' },
  { name: '调用方', val: 6, desc: '业务系统 / 智能体' },
]
</script>

<style scoped>
.standard-page {
  display: grid;
  gap: 16px;
}

.mb-16 {
  margin-bottom: 16px;
}

.stat-card {
  padding: 14px 16px;
  background: #fafafa;
  border: 1px solid #edf0f5;
  border-radius: 10px;
}

.stat-name {
  color: #8c8c8c;
  font-size: 12px;
}

.stat-val {
  margin-top: 4px;
  font-size: 24px;
  font-weight: 700;
  color: #da251d;
}

.stat-desc {
  margin-top: 2px;
  color: #8c8c8c;
  font-size: 11px;
}
</style>