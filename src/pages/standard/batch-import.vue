<template>
  <div class="standard-page">
    <el-card shadow="never">
      <div class="panel-header">
        批量导入向导
        <div class="panel-actions">
          <el-button @click="downloadTemplate"><el-icon class="act-icon"><Download /></el-icon>下载导入模板</el-button>
          <el-upload
            :auto-upload="false"
            accept=".xlsx,.xls"
            :limit="1"
            :on-change="onFileChange"
            :show-file-list="false"
          >
            <el-button type="primary"><el-icon class="act-icon"><Upload /></el-icon>上传标准文件</el-button>
          </el-upload>
        </div>
      </div>
      <el-alert
        title="导入说明"
        type="info"
        :closable="false"
        show-icon
        description="支持一次性导入四类标准（数据元 / 编码 / 指标 / 质量标准）。文件将按行校验，校验通过后即可执行导入，失败行可下载错误详情修正后再传。"
      />
    </el-card>

    <el-card shadow="never">
      <div class="panel-header">
        逐行校验结果
        <div class="panel-actions">
          <div class="verify-stats" v-if="rows.length">
            <span class="vs-pass">通过 {{ passCount }}</span>
            <span class="vs-fail">失败 {{ failCount }}</span>
            <span class="vs-total">共 {{ rows.length }} 行</span>
          </div>
          <el-button type="primary" :disabled="passCount === 0" @click="doImport">执行导入</el-button>
        </div>
      </div>

      <el-empty v-if="!rows.length" description="请先上传标准文件（Excel 模板）" :image-size="90" />
      <template v-else>
        <el-table :data="rows" stripe height="400">
          <el-table-column prop="rowNo" label="行号" width="70" />
          <el-table-column prop="code" label="标准编号" width="150" show-overflow-tooltip />
          <el-table-column prop="name" label="标准名称" min-width="200" show-overflow-tooltip />
          <el-table-column prop="type" label="标准类型" width="110">
            <template #default="{ row }">
              <el-tag effect="plain" size="small">{{ row.type }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="校验结果" width="90">
            <template #default="{ row }">
              <span :class="row.passed ? 'ck-pass' : 'ck-fail'">
                {{ row.passed ? '通过' : '失败' }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="errors" label="错误原因" min-width="240" show-overflow-tooltip>
            <template #default="{ row }">
              <span class="err-text">{{ row.errors || '—' }}</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="import-progress" v-if="importing">
          <el-progress :percentage="importProgress" :stroke-width="10" />
        </div>
      </template>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'

type VerifyRow = {
  rowNo: number
  code: string
  name: string
  type: string
  passed: boolean
  errors: string
}

const rows = ref<VerifyRow[]>([])
const importing = ref(false)
const importProgress = ref(0)

const passCount = computed(() => rows.value.filter((r) => r.passed).length)
const failCount = computed(() => rows.value.length - passCount.value)

const sample: VerifyRow[] = [
  { rowNo: 1, code: 'STD-DE-1001', name: '乘车站编码', type: '编码', passed: true, errors: '' },
  { rowNo: 2, code: 'STD-DE-1002', name: '乘车日期', type: '数据元', passed: true, errors: '' },
  { rowNo: 3, code: 'STD-DE-1003', name: '清分金额', type: '数据元', passed: true, errors: '' },
  { rowNo: 4, code: 'STD-DE-1004', name: '', type: '指标', passed: false, errors: '标准名称不能为空' },
  { rowNo: 5, code: '', name: '车辆段编码', type: '编码', passed: false, errors: '标准编号缺失；编号与现有标准重复' },
  { rowNo: 6, code: 'STD-DE-1006', name: '断面客流量', type: '指标', passed: true, errors: '' },
  { rowNo: 7, code: 'STD-DE-1007', name: '信号级别', type: '数据元', passed: true, errors: '' },
  { rowNo: 8, code: 'STD-DE-1008', name: '用电能耗', type: '质量标准', passed: false, errors: '类型编码非法；值域格式不符' },
  { rowNo: 9, code: 'STD-DE-1009', name: '设备完好率', type: '指标', passed: true, errors: '' },
  { rowNo: 10, code: 'STD-DE-1010', name: '列车准点率', type: '指标', passed: true, errors: '' },
]

function downloadTemplate() {
  ElMessage.success('模板下载已开始：标准批量导入模板_V2.0.xlsx')
}

function onFileChange() {
  rows.value = sample.map((r, i) => ({ ...r, rowNo: i + 1 }))
  ElMessage.info('文件已读取，开始逐行校验')
}

async function doImport() {
  if (importing.value) return
  importing.value = true
  importProgress.value = 0
  const total = passCount.value
  for (let i = 0; i <= 20; i++) {
    importProgress.value = Math.round((i / 20) * 100)
    await new Promise((r) => setTimeout(r, 60))
  }
  const done = Math.round(importProgress.value * (total / 100))
  ElMessage.success(`导入完成：成功 ${total} 条，跳过 ${failCount.value} 条错误记录`)
  importing.value = false
}
</script>

<style scoped>
.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.act-icon {
  margin-right: 4px;
}

.verify-stats {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
}

.vs-pass {
  color: #00a854;
  font-weight: 600;
}

.vs-fail {
  color: #e34d59;
  font-weight: 600;
}

.vs-total {
  color: #8c8c8c;
}

.ck-pass {
  color: #00a854;
  font-weight: 600;
}

.ck-fail {
  color: #e34d59;
  font-weight: 600;
}

.err-text {
  color: #e34d59;
  font-size: 12px;
}

.import-progress {
  margin-top: 16px;
}
</style>