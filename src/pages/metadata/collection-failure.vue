<template>
  <div class="standard-page">
    <el-card shadow="never">
      <div class="panel-header">
        元数据采集失败处理
        <div class="panel-actions">
          <el-select v-model="kind" class="filter-select">
            <el-option v-for="k in kindOptions" :key="k" :label="k" :value="k" />
          </el-select>
          <el-button type="primary" plain @click="retryAll">批量重试</el-button>
        </div>
      </div>

      <el-row :gutter="16" class="mb-16">
        <el-col v-for="c in kindCards" :key="c.name" :xs="12" :md="6">
          <div class="kind-card">
            <div class="kind-card-name">{{ c.name }}</div>
            <div class="kind-card-count" :style="{ color: c.color }">{{ c.count }}</div>
            <div class="kind-card-desc">{{ c.desc }}</div>
          </div>
        </el-col>
      </el-row>

      <el-table :data="rows" stripe height="420" @selection-change="onSelect">
        <el-table-column type="selection" width="46" />
        <el-table-column prop="task" label="采集任务" min-width="170" show-overflow-tooltip />
        <el-table-column prop="source" label="数据源" min-width="130" show-overflow-tooltip />
        <el-table-column label="失败类型" width="110">
          <template #default="{ row }">
            <el-tag :type="kindTag(row.type)" effect="light" size="small">{{ row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="time" label="失败时间" width="150" />
        <el-table-column prop="reason" label="失败原因" min-width="200" show-overflow-tooltip />
        <el-table-column label="自动重试" width="100">
          <template #default="{ row }">
            <el-switch v-model="row.auto" size="small" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130" fixed="right">
          <template #default>
            <el-button link type="primary" size="small">重试</el-button>
            <el-button link type="danger" size="small">忽略</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const kind = ref('全部')
const kindOptions = ['全部', '连接失败', '权限失败', '解析失败', '超时失败', '变更冲突']

const kindCards = [
  { name: '连接失败', count: 8, desc: '网络不可达 / 服务未启动', color: '#e34d59' },
  { name: '权限失败', count: 5, desc: '账号权限不足 / 密码变更', color: '#ed7b2f' },
  { name: '解析失败', count: 3, desc: 'DDL 语法不兼容', color: '#8b5cf6' },
  { name: '超时失败', count: 2, desc: '元数据查询超时', color: '#2b6cb0' },
]

type Row = { id: number; task: string; source: string; type: string; time: string; reason: string; auto: boolean }

const rows = ref<Row[]>([
  { id: 1, task: 'SIG_信号接口_增量', source: '信号系统明细库', type: '连接失败', time: '2026-06-16 09:12:05', reason: '连接超时：等待数据库响应超过 10s', auto: true },
  { id: 2, task: '归档_历史快照_全量', source: '历史归档中心', type: '解析失败', time: '2026-06-16 08:40:22', reason: 'Parquet 文件校验和异常，块 1024 损坏', auto: true },
  { id: 3, task: '外部_接口网关注册', source: '外部接口网关库', type: '权限失败', time: '2026-06-16 08:15:48', reason: '账号 meta_scan 缺少 SELECT 权限', auto: false },
  { id: 4, task: '票务_清分表结构_增量', source: '票务清分预结算库', type: '变更冲突', time: '2026-06-16 07:58:10', reason: '源表已删除，元数据版本冲突', auto: true },
  { id: 5, task: '客流_实时视图_全量', source: '客流实时采集库', type: '超时失败', time: '2026-06-15 23:30:55', reason: '视图元数据查询超过 30s 限制', auto: false },
  { id: 6, task: '设备_物联表清单_扫描', source: '设备物联采集域', type: '连接失败', time: '2026-06-15 22:12:33', reason: 'RegionServer 心跳超时', auto: true },
  { id: 7, task: '安全_审计表_全量', source: '安全审计存储库', type: '权限失败', time: '2026-06-15 20:04:17', reason: '账号只读权限被策略收紧', auto: false },
  { id: 8, task: '运营_数仓表_增量', source: '运营分析数仓', type: '解析失败', time: '2026-06-15 19:26:42', reason: '视图 DDL 包含不支持的语法（WITH 递归）', auto: true },
])

function kindTag(t: string) {
  return { 连接失败: 'danger', 权限失败: 'warning', 解析失败: 'danger', 超时失败: 'warning', 变更冲突: 'info' }[t] as 'danger' | 'warning' | 'info'
}

function onSelect() {
  // 批量重试选择行
}

function retryAll() {
  ElMessage.success('已提交批量重试，将在 1 分钟后执行')
}
</script>

<style scoped>
.standard-page {
  display: grid;
  gap: 16px;
}

.mb-16 {
  margin-bottom: 16px;
}

.kind-card {
  padding: 14px 16px;
  background: #fafafa;
  border: 1px solid #edf0f5;
  border-radius: 10px;
}

.kind-card-name {
  color: #8c8c8c;
  font-size: 12px;
}

.kind-card-count {
  margin-top: 4px;
  font-size: 24px;
  font-weight: 700;
}

.kind-card-desc {
  margin-top: 2px;
  color: #8c8c8c;
  font-size: 11px;
}
</style>