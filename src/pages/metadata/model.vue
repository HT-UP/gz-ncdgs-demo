<template>
  <div class="standard-page">
    <el-row :gutter="16">
      <el-col :span="16">
        <el-card class="panel-card dashboard-card" shadow="never">
          <template #header>
            <div class="panel-header">
              <span>元模型设计器</span>
              <div class="panel-actions">
                <el-select v-model="currentVersion" class="version-select" size="small">
                  <el-option v-for="version in versions" :key="version" :label="version" :value="version" />
                </el-select>
                <el-button size="small" @click="saveModel">保存</el-button>
                <el-button size="small" type="danger" @click="saveAsModel">另存为</el-button>
              </div>
            </div>
          </template>

          <div class="canvas-wrap model-canvas">
            <div class="model-toolbar">
              <el-button-group>
                <el-button size="small" :icon="ZoomIn" @click="zoom(0.1)">+</el-button>
                <el-button size="small" :icon="ZoomOut" @click="zoom(-0.1)">-</el-button>
              </el-button-group>
              <el-button size="small" type="danger" plain :icon="Download" @click="exportModel">导出</el-button>
              <el-button size="small" type="danger" plain :icon="Upload" @click="importModel">导入</el-button>
              <el-button size="small" :icon="CircleCheck" @click="validateModel">规范校验</el-button>
            </div>

            <div
              v-for="entity in entities"
              :key="entity.id"
              class="er-table model-entity"
              :style="{ top: `${entity.y}px`, left: `${entity.x}px`, transform: `scale(${scale})` }"
              :class="{ 'is-selected': selectedEntity?.id === entity.id }"
              @click="selectedEntity = entity"
            >
              <div class="er-table-title">
                <el-icon :size="14"><Grid /></el-icon>
                <span>{{ entity.name }}</span>
              </div>
              <div class="er-table-fields">
                <div
                  v-for="field in entity.fields"
                  :key="field.name"
                  class="er-table-field"
                  :class="{ 'is-key': field.isKey }"
                >
                  <span class="er-field-name">{{ field.name }}</span>
                  <span class="er-field-type">{{ field.type }}</span>
                  <el-icon v-if="field.isKey" class="er-field-key"><Key /></el-icon>
                </div>
              </div>
            </div>
          </div>

          <div class="model-validation mt-12">
            <div class="validation-title">
              <el-icon :size="14"><Warning /></el-icon>
              <span>建模规范校验结果</span>
            </div>
            <div class="validation-item">命名规范：通过（所有实体/字段符合下划线命名）</div>
            <div class="validation-item">主外键完整性：通过（3 个实体均含主键）</div>
            <div class="validation-item">重名检查：通过（无重名实体）</div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card class="panel-card dashboard-card" shadow="never">
          <template #header>
            <div class="panel-header">
              <span>属性配置</span>
            </div>
          </template>
          <div v-if="selectedEntity" class="property-form">
            <el-form label-width="80px" label-position="left">
              <el-form-item label="实体名称">
                <el-input v-model="selectedEntity.name" />
              </el-form-item>
              <el-form-item label="实体说明">
                <el-input v-model="selectedEntity.comment" />
              </el-form-item>
              <el-form-item label="关联标准">
                <el-select v-model="selectedEntity.standard" class="w-full">
                  <el-option label="客户信息数据元" value="客户信息数据元" />
                  <el-option label="线路编码标准" value="线路编码标准" />
                  <el-option label="车站信息数据元" value="车站信息数据元" />
                  <el-option label="未关联" value="未关联" />
                </el-select>
              </el-form-item>
            </el-form>
          </div>
          <el-empty v-else description="点击画布中的实体进行配置" :image-size="80" />
        </el-card>

        <el-card class="panel-card dashboard-card mt-16" shadow="never">
          <template #header>
            <div class="panel-header">
              <span>模型历史版本</span>
            </div>
          </template>
          <el-timeline>
            <el-timeline-item
              v-for="record in modelHistory"
              :key="record.time"
              :timestamp="record.time"
              placement="top"
              color="#DA251D"
            >
              <div class="list-item no-border">
                <span class="list-item-text">{{ record.content }}</span>
                <span class="list-item-meta">{{ record.user }}</span>
              </div>
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { CircleCheck, Download, Grid, Key, Upload, Warning, ZoomIn, ZoomOut } from '@element-plus/icons-vue'

type ModelField = { name: string; type: string; isKey: boolean }

type ModelEntity = {
  id: string
  name: string
  comment: string
  x: number
  y: number
  standard: string
  fields: ModelField[]
}

const versions = ref(['V3.2', 'V3.1', 'V3.0', 'V2.5'])
const currentVersion = ref('V3.2')
const scale = ref(1)
const selectedEntity = ref<ModelEntity | null>(null)

const entities = ref<ModelEntity[]>([
  {
    id: 'm1',
    name: '客户维度表',
    comment: '客户主数据维度',
    x: 70,
    y: 80,
    standard: '客户信息数据元',
    fields: [
      { name: 'cust_id', type: 'BIGINT', isKey: true },
      { name: 'cust_name', type: 'VARCHAR(64)', isKey: false },
      { name: 'cert_no', type: 'VARCHAR(32)', isKey: false },
      { name: 'phone', type: 'VARCHAR(20)', isKey: false },
    ],
  },
  {
    id: 'm2',
    name: '线路维度表',
    comment: '线路主数据维度',
    x: 420,
    y: 80,
    standard: '线路编码标准',
    fields: [
      { name: 'line_id', type: 'BIGINT', isKey: true },
      { name: 'line_code', type: 'VARCHAR(16)', isKey: false },
      { name: 'line_name', type: 'VARCHAR(64)', isKey: false },
    ],
  },
  {
    id: 'm3',
    name: '客流事实表',
    comment: '客流统计事实',
    x: 240,
    y: 340,
    standard: '未关联',
    fields: [
      { name: 'flow_id', type: 'BIGINT', isKey: true },
      { name: 'station_id', type: 'BIGINT', isKey: false },
      { name: 'flow_count', type: 'INT', isKey: false },
      { name: 'stat_date', type: 'DATE', isKey: false },
    ],
  },
])

const modelHistory = [
  { content: 'V3.2 保存：新增客流事实表统计粒度说明', time: '2026-08-11 09:30', user: '李四' },
  { content: 'V3.1 评审通过：客户维度表命名规范调整', time: '2026-08-09 15:20', user: '王工' },
  { content: 'V3.0 保存：建立与数据标准自动关联', time: '2026-08-05 11:10', user: '李四' },
]

const zoom = (delta: number) => {
  scale.value = Math.min(1.6, Math.max(0.6, scale.value + delta))
}

const saveModel = () => {
  ElMessage.success(`模型已保存（Mock），当前版本 ${currentVersion.value}`)
}

const saveAsModel = () => {
  const next = `V${(parseFloat(currentVersion.value.slice(1)) + 0.1).toFixed(1)}`
  versions.value.unshift(next)
  currentVersion.value = next
  ElMessage.success(`模型已另存为新版本 ${next}（Mock）`)
}

const exportModel = () => {
  ElMessage.success('模型已导出（支持 JSON / 通用建模格式）（Mock）')
}

const importModel = () => {
  ElMessage.info('请选择模型文件导入（Mock 演示）')
}

const validateModel = () => {
  ElMessageBox.alert('命名规范：通过\n主外键完整性：通过\n重名检查：通过\n\n建模规范校验全部通过！', '校验结果', {
    type: 'success',
  })
}
</script>
