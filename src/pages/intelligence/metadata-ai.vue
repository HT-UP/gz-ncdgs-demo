<template>
  <div class="standard-page">
    <el-card class="panel-card dashboard-card" shadow="never">
      <template #header>
        <div class="panel-header">
          <span>元数据智能补全</span>
          <div class="panel-actions">
            <el-button :icon="Clock" @click="historyVisible = true">补全历史</el-button>
            <el-button type="danger" :icon="MagicStick" @click="startWizard">新建补全任务</el-button>
          </div>
        </div>
      </template>

      <template v-if="!wizardActive">
        <div class="wizard-empty">
          <el-icon :size="56" color="#DA251D"><MagicStick /></el-icon>
          <div class="wizard-empty-title">元数据智能补全</div>
          <div class="wizard-empty-desc">基于大模型自动识别缺失的表中文名、表摘要、字段描述、维度指标类型与代码描述，并基于历史元数据学习命名规范与业务语义。</div>
          <el-button type="danger" size="large" :icon="MagicStick" @click="startWizard">开始三步补全向导</el-button>
          <div class="wizard-steps-preview">
            <el-steps :active="3" finish-status="success" simple>
              <el-step title="补全前状态识别" />
              <el-step title="AI 触发配置" />
              <el-step title="补全结果确认" />
            </el-steps>
          </div>
        </div>
      </template>

      <template v-else>
        <el-steps :active="step" finish-status="success" align-center class="wizard-steps">
          <el-step title="补全前状态识别" description="识别元数据缺失" />
          <el-step title="AI 触发配置" description="模型与提示词" />
          <el-step title="补全结果确认" description="人工确认与回写" />
        </el-steps>

        <div v-if="step === 1" class="wizard-panel">
          <div class="section-title mb-8">元数据缺失清单（自动识别）</div>
          <div class="missing-stats">
            <el-tag type="danger" effect="dark">表级缺失 3 项</el-tag>
            <el-tag type="warning" effect="dark">字段级缺失 5 项</el-tag>
            <el-tag type="primary" effect="plain">共识别 8 项缺失</el-tag>
          </div>
          <el-table :data="missingMeta" stripe size="small" class="mt-12">
            <el-table-column prop="tableName" label="表名" min-width="150" />
            <el-table-column prop="fieldName" label="字段名" width="110">
              <template #default="{ row }">
                <span v-if="row.fieldName">{{ row.fieldName }}</span>
                <span v-else class="dep-text">—</span>
              </template>
            </el-table-column>
            <el-table-column label="缺失类型" width="130">
              <template #default="{ row }">
                <el-tag size="small" effect="plain">{{ row.missingType }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="current" label="当前值" width="110">
              <template #default="{ row }">
                <span v-if="row.current" class="dep-text">{{ row.current }}</span>
                <span v-else class="missing-mark">缺失</span>
              </template>
            </el-table-column>
            <el-table-column prop="suggest" label="AI 建议补全值" min-width="200">
              <template #default="{ row }">
                <span class="suggest-value">{{ row.suggest }}</span>
              </template>
            </el-table-column>
          </el-table>
          <div class="wizard-actions">
            <el-button type="danger" @click="step = 2">下一步：AI 触发配置</el-button>
          </div>
        </div>

        <div v-if="step === 2" class="wizard-panel">
          <el-row :gutter="16">
            <el-col :span="10">
              <el-form label-width="100px">
                <div class="section-title mb-8">大模型 API 对接配置</div>
                <el-form-item label="模型选择">
                  <el-select v-model="config.model" class="w-full">
                    <el-option label="deepseek-v3" value="deepseek-v3" />
                    <el-option label="qwen-max" value="qwen-max" />
                    <el-option label="GLM-4" value="GLM-4" />
                  </el-select>
                </el-form-item>
                <el-form-item label="API 地址">
                  <el-input v-model="config.apiUrl" placeholder="https://api.example.com/v1" />
                </el-form-item>
                <el-form-item label="API Key">
                  <el-input v-model="config.apiKey" type="password" show-password placeholder="sk-****" />
                </el-form-item>
                <el-form-item label="温度参数">
                  <el-slider v-model="config.temperature" :min="0" :max="1" :step="0.1" />
                </el-form-item>
                <el-form-item label="最大 Token">
                  <el-input-number v-model="config.maxTokens" :min="256" :max="8192" :step="256" />
                </el-form-item>
              </el-form>
            </el-col>
            <el-col :span="14">
              <div class="section-title mb-8">提示词配置</div>
              <el-input v-model="config.prompt" type="textarea" :rows="10" />
              <div class="prompt-note">
                <el-icon :size="14"><InfoFilled /></el-icon>
                <span>基于历史元数据记录学习命名规范与业务语义，生成结果将附带置信度供人工确认。</span>
              </div>
              <div class="section-title mt-16 mb-8">学习数据统计</div>
              <el-descriptions :column="3" border size="small">
                <el-descriptions-item label="历史样本">1,286 条</el-descriptions-item>
                <el-descriptions-item label="业务域">5 个</el-descriptions-item>
                <el-descriptions-item label="学习准确率">93.5%</el-descriptions-item>
              </el-descriptions>
            </el-col>
          </el-row>
          <div class="wizard-actions">
            <el-button @click="step = 1">上一步</el-button>
            <el-button type="danger" @click="runCompletion">下一步：执行补全</el-button>
          </div>
        </div>

        <div v-if="step === 3" class="wizard-panel">
          <div class="section-title mb-8">补全结果确认（{{ completionResults.length }} 项）</div>
          <el-alert title="AI 已基于历史元数据完成补全，请人工确认后一键回写元数据中心。" type="success" :closable="false" class="mb-16" />
          <el-table :data="completionResults" stripe size="small">
            <el-table-column prop="tableName" label="表名" min-width="150" />
            <el-table-column prop="missingType" label="补全类型" width="130">
              <template #default="{ row }">
                <el-tag size="small" effect="plain">{{ row.missingType }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="AI 补全结果" min-width="180">
              <template #default="{ row }">
                <el-input v-model="row.result" size="small" />
              </template>
            </el-table-column>
            <el-table-column label="置信度" width="110">
              <template #default="{ row }">
                <span :style="{ color: confidenceColor(row.confidence) }">{{ row.confidence }}%</span>
              </template>
            </el-table-column>
            <el-table-column label="确认" width="110" align="center">
              <template #default="{ row }">
                <el-switch v-model="row.confirmed" active-text="确认" />
              </template>
            </el-table-column>
          </el-table>
          <div class="wizard-actions">
            <el-button @click="step = 2">上一步</el-button>
            <el-button type="danger" :icon="Promotion" @click="writeBack">一键回写元数据</el-button>
          </div>
        </div>
      </template>
    </el-card>

    <el-drawer v-model="historyVisible" title="补全历史记录" size="560px">
      <el-table :data="completionHistory" stripe size="small">
        <el-table-column prop="name" label="任务" min-width="170" />
        <el-table-column prop="count" label="识别数" width="80" align="center" />
        <el-table-column prop="success" label="补全数" width="80" align="center" />
        <el-table-column prop="time" label="时间" width="150" />
        <el-table-column label="操作" width="80">
          <template #default="{ row }">
            <el-button link type="primary" @click="viewHistory(row)">追溯</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Clock, InfoFilled, MagicStick, Promotion } from '@element-plus/icons-vue'
import { completionHistory, missingMeta } from '@/mock/intelligence'

const wizardActive = ref(false)
const step = ref(1)
const historyVisible = ref(false)

const config = reactive({
  model: 'deepseek-v3',
  apiUrl: 'https://api.example.com/v1',
  apiKey: 'sk-****demo****',
  temperature: 0.2,
  maxTokens: 2048,
  prompt:
    '你是轨道交通数据治理领域的元数据补全专家。请基于以下上下文补全缺失元数据：\n1. 严格遵循数据命名规范（表名：业务域_主题_层级；字段：驼峰命名）；\n2. 字段描述需包含业务含义与约束；\n3. 识别维度/指标类型与代码含义；\n4. 输出 JSON 格式结果并附带置信度。',
})

const completionResults = ref<{ id: string; tableName: string; missingType: string; result: string; confidence: number; confirmed: boolean }[]>([])

const startWizard = () => {
  wizardActive.value = true
  step.value = 1
}

const runCompletion = () => {
  step.value = 3
  completionResults.value = missingMeta.map((item, index) => ({
    id: item.id,
    tableName: item.tableName,
    missingType: item.missingType,
    result: item.suggest,
    confidence: 86 + ((index * 3) % 13),
    confirmed: true,
  }))
  ElMessage.success('AI 补全执行完成，请人工确认（Mock）')
}

const writeBack = () => {
  const confirmed = completionResults.value.filter((item) => item.confirmed).length
  wizardActive.value = false
  ElMessage.success(`已回写元数据中心 ${confirmed} 项补全结果（Mock）`)
}

const viewHistory = (row: (typeof completionHistory)[number]) => {
  ElMessage.info(`「${row.name}」追溯详情：成功 ${row.success}/${row.count}，已生成补全差异报告（Mock）`)
}

const confidenceColor = (value: number) => (value >= 90 ? '#00A854' : value >= 80 ? '#ED7B2F' : '#E34D59')
</script>