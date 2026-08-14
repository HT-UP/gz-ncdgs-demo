<template>
  <div class="standard-page">
    <el-card shadow="never">
      <div class="panel-header">
        模拟数据验证
        <div class="panel-actions">
          <el-button type="primary" plain @click="runVerify">运行验证</el-button>
        </div>
      </div>

      <el-row :gutter="16">
        <el-col :xs="24" :md="10">
          <div class="panel-header">模拟数据输入</div>
          <el-radio-group v-model="dataMode" class="mode-radio">
            <el-radio-button label="manual">手工录入</el-radio-button>
            <el-radio-button label="template">模板生成</el-radio-button>
            <el-radio-button label="sample">抽样样本</el-radio-button>
          </el-radio-group>
          <el-input
            v-model="mockRows"
            type="textarea"
            :rows="10"
            class="mock-input"
            placeholder="station,passengers,qualified&#10;S0111,8260,1&#10;S0112,-1,0&#10;S0113,,1"
          />
        </el-col>
        <el-col :xs="24" :md="14">
          <div class="panel-header">流程执行情景</div>
          <div class="scenario-list">
            <div v-for="s in scenarios" :key="s.name" class="scenario-item">
              <el-radio v-model="scenario" :label="s.name">
                <span class="scenario-name">{{ s.name }}</span>
                <span class="scenario-desc">{{ s.desc }}</span>
              </el-radio>
            </div>
          </div>
        </el-col>
      </el-row>

      <template v-if="verified">
        <div class="panel-header">结果校验</div>
        <el-row :gutter="16">
          <el-col v-for="r in results" :key="r.name" :xs="12" :md="6">
            <div class="result-card">
              <div class="result-name">{{ r.name }}</div>
              <div class="result-val" :style="{ color: r.color }">{{ r.val }}</div>
              <div class="result-desc">{{ r.desc }}</div>
            </div>
          </el-col>
        </el-row>
        <div class="pass-bar">
          <span class="pass-label">通过率</span>
          <el-progress :percentage="97.4" :stroke-width="14" color="#00a854" />
        </div>
      </template>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const dataMode = ref('manual')
const mockRows = ref('')
const scenario = ref('正常数据流')

const scenarios = [
  { name: '正常数据流', desc: '校验数据完整性与格式' },
  { name: '边界数据流', desc: '极值、空值、超长文本' },
  { name: '异常数据流', desc: '类型错误、主键冲突' },
  { name: '增量数据流', desc: '对比增量批次效果' },
]

const verified = ref(false)
const results = ref([
  { name: '校验记录', val: '128', color: '#2b6cb0', desc: '有效记录数' },
  { name: '通过', val: '125', color: '#00a854', desc: '通过校验' },
  { name: '警告', val: '2', color: '#ed7b2f', desc: '缺省值补充' },
  { name: '异常', val: '1', color: '#e34d59', desc: '类型非法' },
])

function runVerify() {
  verified.value = true
  ElMessage.success(`按「${scenario.value}」情景完成模拟数据验证`)
}
</script>

<style scoped>
.standard-page {
  display: grid;
  gap: 16px;
}

.mode-radio {
  margin-bottom: 10px;
}

.mock-input {
  font-family: Consolas, Menlo, monospace;
}

.scenario-list {
  display: grid;
  gap: 8px;
}

.scenario-item {
  padding: 10px 12px;
  border: 1px solid #edf0f5;
  border-radius: 8px;
  background: #fafafa;
}

.scenario-name {
  font-weight: 600;
  color: #4a4a4a;
  font-size: 13px;
}

.scenario-desc {
  margin-left: 8px;
  color: #8c8c8c;
  font-size: 12px;
}

.result-card {
  padding: 14px 16px;
  background: #fafafa;
  border: 1px solid #edf0f5;
  border-radius: 10px;
}

.result-name {
  color: #8c8c8c;
  font-size: 12px;
}

.result-val {
  margin-top: 4px;
  font-size: 24px;
  font-weight: 700;
}

.result-desc {
  margin-top: 2px;
  color: #8c8c8c;
  font-size: 11px;
}

.pass-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 16px;
  min-width: 0;
}

.pass-label {
  flex: none;
  color: #4a4a4a;
  font-size: 13px;
}

.pass-bar .el-progress {
  flex: 1;
  min-width: 0;
}
</style>