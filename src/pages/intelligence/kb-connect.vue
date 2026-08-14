<template>
  <div class="standard-page">
    <el-card shadow="never">
      <div class="panel-header">
        知识库与智能体对接全过程
        <div class="panel-actions">
          <el-button type="primary" plain>新建对接</el-button>
        </div>
      </div>

      <el-steps :active="3" align-center finish-status="success" class="flow-steps">
        <el-step v-for="s in flow" :key="s.title" :title="s.title" :description="s.desc" />
      </el-steps>

      <el-row :gutter="16" class="mt-16">
        <el-col v-for="c in connections" :key="c.name" :xs="24" :md="8">
          <div class="conn-card">
            <div class="conn-head">
              <span class="conn-name">{{ c.name }}</span>
              <el-tag :type="c.status === '已对接' ? 'success' : 'warning'" size="small" effect="light">{{ c.status }}</el-tag>
            </div>
            <div class="conn-route">{{ c.route }}</div>
            <div class="conn-meta">
              <div class="conn-item"><span>知识库</span><b>{{ c.kb }}</b></div>
              <div class="conn-item"><span>接入分类</span><b>{{ c.category }}</b></div>
              <div class="conn-item"><span>验证结果</span><b :style="{ color: c.pass ? '#00a854' : '#e34d59' }">{{ c.pass ? '通过' : '待验证' }}</b></div>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <el-card shadow="never">
      <div class="panel-header">对接验证记录</div>
      <el-table :data="records" stripe height="260">
        <el-table-column prop="time" label="验证时间" width="150" />
        <el-table-column prop="kb" label="知识库" min-width="150" show-overflow-tooltip />
        <el-table-column prop="agent" label="智能体" min-width="150" show-overflow-tooltip />
        <el-table-column prop="result" label="结果" width="90">
          <template #default="{ row }">
            <el-tag :type="row.result === '通过' ? 'success' : 'warning'" size="small" effect="light">{{ row.result }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="qa" label="问答验证场景" min-width="220" show-overflow-tooltip />
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const flow = [
  { title: '知识库分类', desc: '分类体系确立' },
  { title: '知识入库', desc: '内容标准化入库' },
  { title: '智能体接入', desc: '接入向量检索' },
  { title: '应用验证', desc: '问答场景验证' },
]

const connections = ref([
  { name: '安全智能体-数据安全库', status: '已对接', route: '安全智能体 → 数据安全知识库（向量）', kb: '数据安全知识库', category: '数据安全/脱敏', pass: true },
  { name: '质量智能体-数据质量库', status: '已对接', route: '质量智能体 → 数据质量知识库（向量）', kb: '数据质量知识库', category: '数据质量/规则', pass: true },
  { name: '资源管理智能体-治理库', status: '验证中', route: '资源智能体 → 数据治理知识库', kb: '数据治理知识库', category: '数据治理/目录', pass: false },
])

const records = ref([
  { time: '2026-06-10 14:30', kb: '数据安全知识库', agent: '安全智能体', result: '通过', qa: '「如何进行 L3 数据脱敏？」回答准确率 96%' },
  { time: '2026-06-10 15:02', kb: '数据质量知识库', agent: '质量智能体', result: '通过', qa: '「非空校验模板怎么用？」回答完整' },
  { time: '2026-06-12 10:20', kb: '数据治理知识库', agent: '资源管理智能体', result: '待完善', qa: '「目录挂载规则」回答需补充来源引用' },
])
</script>

<style scoped>
.standard-page {
  display: grid;
  gap: 16px;
}

.flow-steps {
  margin: 14px 0 6px;
}

.mt-16 {
  margin-top: 16px;
}

.conn-card {
  padding: 14px 16px;
  border: 1px solid #e4e7ed;
  border-radius: 10px;
  background: #fafafa;
  height: 100%;
}

.conn-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.conn-name {
  font-size: 14px;
  font-weight: 600;
  color: #4a4a4a;
}

.conn-route {
  margin-top: 8px;
  padding: 8px 10px;
  background: #fff;
  border: 1px dashed #e4e7ed;
  border-radius: 8px;
  font-size: 12px;
  color: #2b6cb0;
}

.conn-meta {
  margin-top: 10px;
  display: grid;
  gap: 4px;
}

.conn-item {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #8c8c8c;
}

.conn-item b {
  color: #4a4a4a;
}
</style>