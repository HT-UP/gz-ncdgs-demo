<template>
  <div class="standard-page">
    <el-row :gutter="16">
      <el-col :span="16">
        <el-card class="panel-card dashboard-card" shadow="never">
          <template #header>
            <div class="panel-header">
              <span>模型设计画布</span>
              <div class="panel-actions">
                <el-radio-group v-model="modelLevel" size="small">
                  <el-radio-button label="概念模型">概念模型</el-radio-button>
                  <el-radio-button label="逻辑模型">逻辑模型</el-radio-button>
                  <el-radio-button label="物理模型">物理模型</el-radio-button>
                </el-radio-group>
              </div>
            </div>
          </template>

          <div class="canvas-wrap">
            <div class="canvas-grid">
              <div class="canvas-zoom">
                <el-button-group>
                  <el-button size="small" :icon="ZoomIn" @click="zoom(0.1)">+</el-button>
                  <el-button size="small" :icon="ZoomOut" @click="zoom(-0.1)">-</el-button>
                </el-button-group>
              </div>

              <div
                v-for="table in tables"
                :key="table.id"
                class="er-table"
                :style="{ top: `${table.y}px`, left: `${table.x}px`, transform: `scale(${scale})` }"
                :class="{ 'is-selected': selectedTable?.id === table.id }"
                @click="selectedTable = table"
              >
                <div class="er-table-title">
                  <el-icon :size="14"><Grid /></el-icon>
                  <span>{{ table.name }}</span>
                </div>
                <div class="er-table-fields">
                  <div
                    v-for="field in table.fields"
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

          <div v-if="selectedTable" class="property-form">
            <el-form label-width="80px" label-position="left">
              <el-form-item label="表名称">
                <el-input v-model="selectedTable.name" />
              </el-form-item>
              <el-form-item label="表说明">
                <el-input v-model="selectedTable.comment" />
              </el-form-item>
              <el-form-item label="字段数量">
                <el-input-number :model-value="selectedTable.fields.length" :min="1" :max="20" @change="syncFieldCount" />
              </el-form-item>
              <el-form-item label="目标库">
                <el-select v-model="targetDb" class="w-full">
                  <el-option label="MySQL" value="MySQL" />
                  <el-option label="PostgreSQL" value="PostgreSQL" />
                  <el-option label="达梦 DM" value="达梦 DM" />
                  <el-option label="人大金仓" value="人大金仓" />
                </el-select>
              </el-form-item>
            </el-form>
            <el-button type="danger" class="w-full" @click="generateDdl">生成 DDL 脚本</el-button>
          </div>

          <el-empty v-else description="请点击画布中的表进行配置" :image-size="80" />
        </el-card>

        <el-card class="panel-card dashboard-card mt-16" shadow="never">
          <template #header>
            <div class="panel-header">
              <span>模型评审记录</span>
            </div>
          </template>
          <el-timeline>
            <el-timeline-item
              v-for="record in reviewRecords"
              :key="`${record.time}-${record.content}`"
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

    <el-dialog v-model="ddlVisible" title="DDL 脚本预览" width="620px">
      <pre class="ddl-block">{{ ddlScript }}</pre>
      <template #footer>
        <el-button @click="ddlVisible = false">关闭</el-button>
        <el-button type="danger" @click="copyDdl">复制</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Grid, Key, ZoomIn, ZoomOut } from '@element-plus/icons-vue'

type ModelField = {
  name: string
  type: string
  isKey: boolean
}

type ModelTable = {
  id: string
  name: string
  comment: string
  x: number
  y: number
  fields: ModelField[]
}

const modelLevel = ref('概念模型')
const targetDb = ref('MySQL')
const selectedTable = ref<ModelTable | null>(null)
const scale = ref(1)
const ddlVisible = ref(false)
const ddlScript = ref('')

const tables = ref<ModelTable[]>([
  {
    id: 't1',
    name: '客户信息表',
    comment: '客户基础信息',
    x: 80,
    y: 90,
    fields: [
      { name: 'cust_id', type: 'VARCHAR(32)', isKey: true },
      { name: 'cust_name', type: 'VARCHAR(64)', isKey: false },
      { name: 'cert_no', type: 'VARCHAR(32)', isKey: false },
      { name: 'phone', type: 'VARCHAR(20)', isKey: false },
      { name: 'created_at', type: 'DATETIME', isKey: false },
    ],
  },
  {
    id: 't2',
    name: '线路信息表',
    comment: '地铁线路信息',
    x: 420,
    y: 90,
    fields: [
      { name: 'line_id', type: 'VARCHAR(32)', isKey: true },
      { name: 'line_code', type: 'VARCHAR(16)', isKey: false },
      { name: 'line_name', type: 'VARCHAR(64)', isKey: false },
      { name: 'start_station', type: 'VARCHAR(64)', isKey: false },
      { name: 'end_station', type: 'VARCHAR(64)', isKey: false },
    ],
  },
  {
    id: 't3',
    name: '车站信息表',
    comment: '车站基础信息',
    x: 250,
    y: 340,
    fields: [
      { name: 'station_id', type: 'VARCHAR(32)', isKey: true },
      { name: 'line_id', type: 'VARCHAR(32)', isKey: false },
      { name: 'station_name', type: 'VARCHAR(64)', isKey: false },
      { name: 'station_type', type: 'VARCHAR(16)', isKey: false },
    ],
  },
])

const reviewRecords = [
  { content: '概念模型评审通过，建议补充数据字典', time: '2026-08-08 10:20', user: '王工' },
  { content: '逻辑模型完成物理字段映射', time: '2026-08-09 15:40', user: '李四' },
  { content: '物理模型 DDL 已生成待评审', time: '2026-08-11 09:10', user: '王工' },
]

const zoom = (delta: number) => {
  scale.value = Math.min(1.6, Math.max(0.6, scale.value + delta))
}

const syncFieldCount = (count: number) => {
  if (!selectedTable.value) return
  const current = selectedTable.value.fields.length
  if (count > current) {
    for (let i = current; i < count; i += 1) {
      selectedTable.value.fields.push({
        name: `new_field_${i + 1}`,
        type: 'VARCHAR(64)',
        isKey: false,
      })
    }
  } else if (count < current) {
    selectedTable.value.fields.splice(count)
  }
}

const generateDdl = () => {
  if (!selectedTable.value) return
  const table = selectedTable.value
  const fields = table.fields
    .map((field) => {
      const key = field.isKey ? ' PRIMARY KEY' : ''
      return `  \`${field.name}\` ${field.type}${key},`
    })
    .join('\n')
  ddlScript.value = `CREATE TABLE \`${table.name}\` (\n${fields}\n) COMMENT='${table.comment}';`
  ddlVisible.value = true
}

const copyDdl = () => {
  navigator.clipboard?.writeText(ddlScript.value).then(() => ElMessage.success('已复制到剪贴板'))
}
</script>
