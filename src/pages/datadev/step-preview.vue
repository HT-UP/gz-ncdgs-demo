<template>
  <div class="standard-page">
    <el-card shadow="never">
      <div class="panel-header">
        单步执行与数据预览
        <div class="panel-actions">
          <el-button type="primary" plain @click="stepRun" :disabled="currentIndex >= nodes.length - 1">单步执行</el-button>
          <el-button type="success" plain :disabled="currentIndex < 0">运行到下一分支</el-button>
        </div>
      </div>

      <el-steps :active="currentIndex" align-center finish-status="success" class="run-steps">
        <el-step v-for="(n, i) in nodes" :key="n.id" :title="n.name" :description="i === currentIndex && runInfo ? runInfo[n.id] : ''" />
      </el-steps>

      <div class="branch-panel">
        <div class="branch-title">分支验证</div>
        <div class="branch-cards">
          <div v-for="b in branches" :key="b.name" class="branch-card" :class="{ on: b.name === activeBranch }" @click="activeBranch = b.name">
            <div class="branch-name">{{ b.name }}</div>
            <div class="branch-desc">{{ b.desc }}</div>
          </div>
        </div>
      </div>

      <el-row :gutter="16">
        <el-col :xs="24" :md="16">
          <div class="panel-header">执行数据预览</div>
          <el-table :data="previewData" stripe height="300">
            <el-table-column prop="station" label="站点" width="100" />
            <el-table-column prop="direction" label="方向" width="80" />
            <el-table-column prop="passengers" label="客运量" width="100" />
            <el-table-column prop="qualified" label="质检结果" width="100">
              <template #default="{ row }">
                <el-tag :type="row.qualified === '通过' ? 'success' : 'danger'" size="small" effect="light">{{ row.qualified }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="note" label="说明" min-width="180" show-overflow-tooltip />
          </el-table>
        </el-col>
        <el-col :xs="24" :md="8">
          <div class="panel-header">权限约束</div>
          <div class="perm-note">
            <el-alert
              title="数据预览受权限约束"
              type="info"
              :closable="false"
              show-icon
              description="L3 及以上敏感字段已脱敏展示；预览行数上限 1000 行；全量数据需申请探查权限。"
            />
            <div class="perm-stats">
              <div class="perm-stat"><b>128</b><span>当前可预览字段</span></div>
              <div class="perm-stat"><b>4</b><span>脱敏字段</span></div>
              <div class="perm-stat"><b>2</b><span>受控字段</span></div>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const nodes = [
  { id: 'read', name: '读取源表' },
  { id: 'filter', name: '过滤空值' },
  { id: 'transform', name: '字段转换' },
  { id: 'quality', name: '质量校验' },
  { id: 'write', name: '写入结果' },
]

const runInfo: Record<string, string> = {
  read: '读取 1280 行',
  filter: '过滤 32 行',
  transform: '转换 6 字段',
  quality: '校验 1248 行',
  write: '写入成功',
}

const currentIndex = ref(-1)

function stepRun() {
  if (currentIndex.value < nodes.length - 1) {
    currentIndex.value += 1
  }
}

const branches = [
  { name: '主分支', desc: '正常数据流（1248 行）' },
  { name: '异常分支', desc: '质检未通过（32 行）' },
  { name: '补数分支', desc: '空值填充后数据（8 行）' },
]

const activeBranch = ref('主分支')

const previewData = [
  { station: 'S0111', direction: '上行', passengers: 8260, qualified: '通过', note: '断面数据完整' },
  { station: 'S0112', direction: '上行', passengers: 5230, qualified: '通过', note: '断面数据完整' },
  { station: 'S0113', direction: '下行', passengers: 1280, qualified: '通过', note: '补数后入库' },
  { station: 'S0114', direction: '下行', passengers: 960, qualified: '不通过', note: '客运量低于阈值，转异常分支' },
]
</script>

<style scoped>
.standard-page {
  display: grid;
  gap: 16px;
}

.run-steps {
  margin: 14px 0 18px;
}

.branch-panel {
  margin-bottom: 16px;
}

.branch-title {
  font-size: 13px;
  font-weight: 600;
  color: #4a4a4a;
  margin-bottom: 10px;
  padding-left: 10px;
  border-left: 3px solid #da251d;
}

.branch-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
}

.branch-card {
  padding: 12px 14px;
  border: 1px solid #e4e7ed;
  border-radius: 10px;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.branch-card.on {
  border-color: #da251d;
  box-shadow: 0 4px 14px rgba(218, 37, 29, 0.12);
}

.branch-name {
  font-size: 13px;
  font-weight: 700;
  color: #4a4a4a;
}

.branch-desc {
  margin-top: 4px;
  color: #8c8c8c;
  font-size: 12px;
}

.perm-note {
  display: grid;
  gap: 12px;
}

.perm-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
  gap: 10px;
}

.perm-stat {
  padding: 12px;
  background: #fafafa;
  border: 1px solid #edf0f5;
  border-radius: 8px;
  text-align: center;
}

.perm-stat b {
  display: block;
  font-size: 20px;
  color: #da251d;
}

.perm-stat span {
  margin-top: 2px;
  display: block;
  color: #8c8c8c;
  font-size: 11px;
}
</style>