<template>
  <div class="standard-page">
    <el-card shadow="never">
      <div class="panel-header">
        合规治理 · 数据分类分级
        <div class="panel-actions">
          <el-button type="primary" plain>新建分级任务</el-button>
        </div>
      </div>

      <el-tabs v-model="activeTab">
        <el-tab-pane label="分类分级标准" name="standard">
          <div class="tab-inner">
            <el-alert title="内置国标（GB/T 43697-2024）/ 行业模板（轨道交通）两套模板" type="success" :closable="false" show-icon class="mb-16" />
            <el-table :data="categories" stripe height="300">
              <el-table-column prop="level" label="级别" width="80">
                <template #default="{ row }">
                  <span class="lvl-badge" :style="{ background: row.color }">{{ row.level }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="name" label="级别名称" min-width="120" show-overflow-tooltip />
              <el-table-column prop="criterion" label="定级准则" min-width="240" show-overflow-tooltip />
              <el-table-column prop="examples" label="典型数据" min-width="220" show-overflow-tooltip />
              <el-table-column prop="control" label="管控要求" min-width="180" show-overflow-tooltip />
            </el-table>
          </div>
        </el-tab-pane>
        <el-tab-pane label="自动分级任务" name="task">
          <div class="tab-inner">
            <el-table :data="gradeTasks" stripe height="300">
              <el-table-column prop="name" label="任务名称" min-width="190" show-overflow-tooltip />
              <el-table-column prop="scope" label="扫描范围" min-width="160" show-overflow-tooltip />
              <el-table-column prop="progress" label="进度" width="120">
                <template #default="{ row }">
                  <el-progress :percentage="row.progress" :color="row.progress === 100 ? '#00a854' : '#2b6cb0'" :stroke-width="8" />
                </template>
              </el-table-column>
              <el-table-column label="状态" width="90">
                <template #default="{ row }">
                  <el-tag :type="row.status === '完成' ? 'success' : 'primary'" size="small" effect="light">{{ row.status }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="hits" label="命中敏感项" width="110" />
            </el-table>
          </div>
        </el-tab-pane>
        <el-tab-pane label="分级结果复核" name="review">
          <div class="tab-inner">
            <el-table :data="reviews" stripe height="300">
              <el-table-column prop="asset" label="资产" min-width="180" show-overflow-tooltip />
              <el-table-column label="自动判定级别" width="120">
                <template #default="{ row }">
                  <el-tag size="small" :type="lvlType(row.auto)" effect="light">{{ row.auto }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="人工复核级别" width="120">
                <template #default="{ row }">
                  <el-tag size="small" :type="lvlType(row.manual)" effect="light">{{ row.manual }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="结果" width="90">
                <template #default="{ row }">
                  <el-tag v-if="row.consistent" type="success" size="small" effect="plain">一致</el-tag>
                  <el-tag v-else type="warning" size="small" effect="plain">待复核</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="reason" label="依据说明" min-width="240" show-overflow-tooltip />
            </el-table>
          </div>
        </el-tab-pane>
        <el-tab-pane label="分级结果应用" name="apply">
          <div class="tab-inner">
            <div class="apply-grid">
              <div v-for="a in applies" :key="a.name" class="apply-card">
                <div class="apply-title">{{ a.name }}</div>
                <div class="apply-desc">{{ a.desc }}</div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const activeTab = ref('standard')

const categories = [
  { level: 'L1', name: '公开数据', color: '#00a854', criterion: '可对外公开，不涉及个人与经营秘密', examples: '线路基础信息、运营时间', control: '开放共享' },
  { level: 'L2', name: '内部数据', color: '#2b6cb0', criterion: '仅在组织内部使用', examples: '客流统计、设备台账', control: '登录访问' },
  { level: 'L3', name: '敏感数据', color: '#ed7b2f', criterion: '泄露可能损害个人权益或企业利益', examples: '个人信息、清分明细', control: '脱敏+审批' },
  { level: 'L4', name: '机密数据', color: '#e34d59', criterion: '泄露可能造成严重危害', examples: '密钥、核心接口鉴权', control: '最小授权+留痕' },
]

const gradeTasks = ref([
  { name: '全量资产敏感扫描', scope: '12 个数据源 · 1881 张表', progress: 100, status: '完成', hits: 1246 },
  { name: '新增表增量分级', scope: '近 7 日新增 19 张表', progress: 100, status: '完成', hits: 86 },
  { name: '标签触发重分级', scope: '标签变更资产 42 张表', progress: 64, status: '执行中', hits: 0 },
])

const reviews = ref([
  { asset: 'ods_employee_profile', auto: 'L3', manual: 'L3', consistent: true, reason: '含个人信息，命中身份证/手机号规则' },
  { asset: 'dwd_ticket_clear_clean', auto: 'L2', manual: 'L3', consistent: false, reason: '含清分比例，可能推导经营信息' },
  { asset: 'cert_key_config', auto: 'L4', manual: 'L4', consistent: true, reason: '核心密钥配置' },
  { asset: 'ods_flow_section', auto: 'L2', manual: 'L2', consistent: true, reason: '业务统计类数据' },
])

const applies = [
  { name: '访问控制', desc: '按分级自动匹配访问控制策略' },
  { name: '脱敏策略', desc: 'L3 自动脱敏，L4 禁止明细预览' },
  { name: '加密存储', desc: 'L3/L4 强制加密存储' },
  { name: '审计留痕', desc: '敏感数据访问全程审计' },
]

function lvlType(l: string) {
  return { L1: 'success', L2: 'primary', L3: 'warning', L4: 'danger' }[l] as 'success' | 'primary' | 'warning' | 'danger'
}
</script>

<style scoped>
.standard-page {
  display: grid;
  gap: 16px;
}

.tab-inner {
  padding-top: 4px;
}

.mb-16 {
  margin-bottom: 16px;
}

.lvl-badge {
  display: inline-grid;
  place-items: center;
  min-width: 34px;
  height: 22px;
  border-radius: 6px;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
}

.apply-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.apply-card {
  padding: 14px;
  background: #fafafa;
  border: 1px solid #edf0f5;
  border-radius: 10px;
}

.apply-title {
  font-size: 13px;
  font-weight: 600;
  color: #4a4a4a;
}

.apply-desc {
  margin-top: 4px;
  color: #8c8c8c;
  font-size: 12px;
}
</style>