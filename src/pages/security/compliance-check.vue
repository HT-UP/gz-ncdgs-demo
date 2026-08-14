<template>
  <div class="standard-page">
    <el-card shadow="never">
      <div class="panel-header">
        合规治理 · 合规检查
        <div class="panel-actions">
          <el-button type="primary" plain>新建检查任务</el-button>
        </div>
      </div>

      <el-row :gutter="16" class="mb-16">
        <el-col v-for="m in summary" :key="m.name" :xs="12" :md="6">
          <div class="sum-card">
            <div class="sum-name">{{ m.name }}</div>
            <div class="sum-val" :style="{ color: m.color }">{{ m.val }}</div>
            <div class="sum-desc">{{ m.desc }}</div>
          </div>
        </el-col>
      </el-row>

      <el-table :data="checks" stripe height="380">
        <el-table-column prop="name" label="检查项" min-width="200" show-overflow-tooltip />
        <el-table-column prop="category" label="合规类别" width="130" />
        <el-table-column prop="scope" label="检查范围" min-width="150" show-overflow-tooltip />
        <el-table-column label="检查结果" width="100">
          <template #default="{ row }">
            <el-tag :type="row.result === '通过' ? 'success' : row.result === '未通过' ? 'danger' : 'warning'" size="small" effect="light">{{ row.result }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="problems" label="发现问题" min-width="160" show-overflow-tooltip />
        <el-table-column label="整改闭环" width="110">
          <template #default>
            <el-button link type="primary" size="small">整改工单</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-card shadow="never">
      <div class="panel-header">整改工单闭环</div>
      <el-table :data="tickets" stripe height="240">
        <el-table-column prop="no" label="工单号" width="140" />
        <el-table-column prop="title" label="整改事项" min-width="220" show-overflow-tooltip />
        <el-table-column prop="owner" label="责任人" width="90" />
        <el-table-column prop="deadline" label="限期" width="110" />
        <el-table-column label="状态" width="90">
          <template #default="{ row }">
            <el-tag :type="row.status === '已闭环' ? 'success' : 'warning'" size="small" effect="light">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const summary = [
  { name: '检查任务', val: 18, color: '#da251d', desc: '本月已执行' },
  { name: '检查项总数', val: 96, color: '#2b6cb0', desc: '覆盖 5 大类' },
  { name: '通过率', val: '94.8%', color: '#00a854', desc: '较上月 +2.1%' },
  { name: '未闭环整改', val: 5, color: '#ed7b2f', desc: '需重点关注' },
]

const checks = ref([
  { name: '个人信息处理合法合规检查', category: '个保法', scope: '8 个信息系统', result: '未通过', problems: '2 个流程未登记处理权限' },
  { name: '数据安全法-重要数据保护', category: '数据安全法', scope: '关键信息基础设施', result: '通过', problems: '-' },
  { name: '数据分类分级落地检查', category: '分级合规', scope: '全量资产', result: '部分通过', problems: '62 张表未完成定级' },
  { name: '数据质量标准符合性', category: '质量合规', scope: '核心数据域', result: '通过', problems: '-' },
  { name: '技术防护措施检查', category: '技术合规', scope: '数据库/接口/传输', result: '未通过', problems: '3 个接口未启用 HTTPS' },
  { name: '重要数据识别与目录登记', category: '数据安全法', scope: '数据资源目录', result: '通过', problems: '-' },
])

const tickets = ref([
  { no: 'CG-20260615-01', title: '个人信息处理权限登记补录', owner: '安全组', deadline: '2026-06-20', status: '处理中' },
  { no: 'CG-20260614-02', title: '62 张表定级补全任务', owner: '数据组', deadline: '2026-06-22', status: '处理中' },
  { no: 'CG-20260613-01', title: '3 个接口 HTTPS 改配', owner: '开发组', deadline: '2026-06-18', status: '已闭环' },
])
</script>

<style scoped>
.standard-page {
  display: grid;
  gap: 16px;
}

.mb-16 {
  margin-bottom: 16px;
}

.sum-card {
  padding: 14px 16px;
  background: #fafafa;
  border: 1px solid #edf0f5;
  border-radius: 10px;
}

.sum-name {
  color: #8c8c8c;
  font-size: 12px;
}

.sum-val {
  margin-top: 4px;
  font-size: 24px;
  font-weight: 700;
}

.sum-desc {
  margin-top: 2px;
  color: #8c8c8c;
  font-size: 11px;
}
</style>