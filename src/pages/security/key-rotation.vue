<template>
  <div class="standard-page">
    <el-card shadow="never">
      <div class="panel-header">
        加密密钥轮换流程
        <div class="panel-actions">
          <el-button type="primary" plain>创建轮换计划</el-button>
        </div>
      </div>

      <el-steps :active="rotateStep" align-center finish-status="success" class="rot-steps">
        <el-step v-for="s in rotateSteps" :key="s.title" :title="s.title" :description="s.desc" />
      </el-steps>

      <el-alert title="当前流程：切换执行 → 数据迁移（使用时间密钥解密并加解密）→ 旧钥销毁" type="info" :closable="false" show-icon class="mb-16" />
    </el-card>

    <el-card shadow="never">
      <div class="panel-header">
        密钥清单
        <div class="panel-actions">
          <el-input v-model="keyword" placeholder="搜索密钥" clearable class="search-input" />
        </div>
      </div>
      <el-table :data="keys" stripe height="380">
        <el-table-column prop="name" label="密钥名称" min-width="170" show-overflow-tooltip />
        <el-table-column prop="algorithm" label="算法" width="100" />
        <el-table-column prop="usedFor" label="用途" min-width="160" show-overflow-tooltip />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="keyStatusTag(row.status)" size="small" effect="light">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created" label="创建时间" width="110" />
        <el-table-column prop="expires" label="到期时间" width="110" />
        <el-table-column label="轮换进度" width="120">
          <template #default="{ row }">
            <el-progress :percentage="row.progress" :color="row.progress === 100 ? '#00a854' : '#2b6cb0'" :stroke-width="8" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="{ row }">
            <el-button v-if="row.status !== '已销毁'" link type="primary" size="small" @click="rotateStep = 2">执行轮换</el-button>
            <el-button link type="danger" size="small" :disabled="row.status === '已销毁'">销毁旧钥</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const rotateSteps = [
  { title: '轮换计划', desc: '制定轮换批次' },
  { title: '轮换准备', desc: '新钥生成与预演' },
  { title: '切换执行', desc: '密钥版本切换' },
  { title: '数据迁移', desc: '旧钥解密验证' },
  { title: '旧钥销毁', desc: '安全销毁留痕' },
]

const rotateStep = ref(2)

const keyword = ref('')

const keys = [
  { name: 'ds_enc_rw_key_v12', algorithm: 'AES-256-GCM', usedFor: '清分数据加密', status: '在用', created: '2025-12-01', expires: '2026-06-30', progress: 100 },
  { name: 'ds_enc_rw_key_v13', algorithm: 'AES-256-GCM', usedFor: '清分数据加密（轮换中）', status: '过渡', created: '2026-06-10', expires: '2027-06-30', progress: 75 },
  { name: 'field_mask_key_v5', algorithm: 'AES-128', usedFor: '脱敏字段加盐', status: '在用', created: '2026-01-15', expires: '2027-01-15', progress: 100 },
  { name: 'api_sign_key_v8', algorithm: 'HMAC-SHA256', usedFor: '接口签名', status: '在用', created: '2026-03-20', expires: '2026-09-20', progress: 100 },
  { name: 'ds_enc_rw_key_v11', algorithm: 'AES-256-GCM', usedFor: '清分数据加密（已废弃）', status: '已销毁', created: '2025-06-01', expires: '2026-06-10', progress: 100 },
]

function keyStatusTag(s: string) {
  return { 在用: 'success', 过渡: 'warning', 已销毁: 'info' }[s] as 'success' | 'warning' | 'info'
}
</script>

<style scoped>
.standard-page {
  display: grid;
  gap: 16px;
}

.rot-steps {
  margin: 14px 0 18px;
}

.mb-16 {
  margin-bottom: 16px;
}
</style>