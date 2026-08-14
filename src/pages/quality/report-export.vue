<template>
  <div class="standard-page">
    <el-card shadow="never">
      <div class="panel-header">
        质量报告导出
        <div class="panel-actions">
          <el-button type="primary" @click="exportReport('pdf')">导出 PDF</el-button>
          <el-button type="primary" plain @click="exportReport('excel')">导出 Excel</el-button>
          <el-button type="primary" plain @click="exportReport('word')">导出 Word</el-button>
        </div>
      </div>

      <el-row :gutter="16">
        <el-col :xs="24" :md="10">
          <div class="panel-header">导出内容配置</div>
          <el-checkbox-group v-model="contents" class="content-check">
            <el-checkbox v-for="c in contentOptions" :key="c" :label="c">{{ c }}</el-checkbox>
          </el-checkbox-group>
          <div class="panel-header mt-16">附加设置</div>
          <el-form label-width="100px" class="opt-form">
            <el-form-item label="嵌入图表">
              <el-switch v-model="withChart" />
            </el-form-item>
            <el-form-item label="水印标识">
              <el-switch v-model="withWatermark" />
            </el-form-item>
            <el-form-item label="报告周期">
              <el-date-picker v-model="period" type="daterange" range-separator="至" start-placeholder="开始" end-placeholder="结束" style="width: 100%" />
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :xs="24" :md="14">
          <div class="panel-header">计划分发</div>
          <div class="dist-list">
            <div v-for="d in distributions" :key="d.name" class="dist-item">
              <div class="dist-head">
                <span class="dist-name">{{ d.name }}</span>
                <el-tag size="small" :type="d.enabled ? 'success' : 'info'" effect="light">{{ d.enabled ? '启用' : '停用' }}</el-tag>
              </div>
              <div class="dist-meta">{{ d.rule }} · {{ d.receivers }}</div>
            </div>
          </div>
        </el-col>
      </el-row>

      <div class="export-log">
        <div class="panel-header">导出记录</div>
        <el-table :data="logs" stripe height="260">
          <el-table-column prop="file" label="文件名" min-width="220" show-overflow-tooltip />
          <el-table-column prop="format" label="格式" width="80" />
          <el-table-column prop="user" label="导出人" width="100" />
          <el-table-column prop="time" label="导出时间" width="150" />
          <el-table-column prop="size" label="大小" width="90" />
          <el-table-column label="状态" width="90">
            <template #default>
              <el-tag size="small" type="success" effect="light">完成</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const contents = ref(['质量总览', '问题分布', '趋势分析'])
const contentOptions = ['质量总览', '问题分布', '趋势分析', 'Top 排行', '整改情况', '资产明细']
const withChart = ref(true)
const withWatermark = ref(true)
const period = ref<[string, string] | undefined>(undefined)

const distributions = [
  { name: '领导周报', rule: '每周一 09:00', receivers: '管理层 6 人', enabled: true },
  { name: '责任部门月报', rule: '每月 1 日 10:00', receivers: '8 个部门责任人', enabled: true },
  { name: '质量例会材料', rule: '每周五 16:00', receivers: '质量组成员 12 人', enabled: false },
]

const logs = [
  { file: '2026W24_数据质量周报.pdf', format: 'PDF', user: '王数据', time: '2026-06-12 09:02', size: '2.4MB' },
  { file: '2026年5月_质量月报.xlsx', format: 'Excel', user: '李开发', time: '2026-06-02 11:30', size: '5.8MB' },
  { file: '2026Q2_质量评估报告.docx', format: 'Word', user: '王数据', time: '2026-06-01 17:20', size: '3.1MB' },
]

function exportReport(kind: string) {
  ElMessage.success(`开始导出 ${kind.toUpperCase()} 格式质量报告`)
}
</script>

<style scoped>
.standard-page {
  display: grid;
  gap: 16px;
}

.content-check {
  display: grid;
  gap: 8px;
  padding: 4px 0;
}

.mt-16 {
  margin-top: 16px;
}

.opt-form {
  max-width: 520px;
}

.dist-list {
  display: grid;
  gap: 10px;
}

.dist-item {
  padding: 10px 12px;
  border: 1px solid #edf0f5;
  border-radius: 8px;
  background: #fafafa;
}

.dist-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dist-name {
  font-size: 13px;
  font-weight: 600;
  color: #4a4a4a;
}

.dist-meta {
  margin-top: 4px;
  color: #8c8c8c;
  font-size: 12px;
}

.export-log {
  margin-top: 4px;
}
</style>