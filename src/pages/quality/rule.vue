<template>
  <div class="standard-page">
    <el-row :gutter="16">
      <el-col :span="16">
        <el-card class="panel-card dashboard-card" shadow="never">
          <template #header>
            <div class="panel-header">
              <span>质量规则定义</span>
              <el-button type="danger" :icon="Plus" @click="openCreate">新增规则</el-button>
            </div>
          </template>

          <div class="toolbar-row">
            <el-input
              v-model="keyword"
              placeholder="按规则名称 / 表名搜索"
              clearable
              class="search-input"
              :prefix-icon="Search"
            />
            <el-select v-model="filterType" placeholder="规则类型" clearable class="filter-select">
              <el-option v-for="type in ruleTypes" :key="type" :label="type" :value="type" />
            </el-select>
            <el-select v-model="filterStatus" placeholder="状态" clearable class="filter-select">
              <el-option label="启用" value="启用" />
              <el-option label="停用" value="停用" />
              <el-option label="草稿" value="草稿" />
            </el-select>
          </div>

          <el-table :data="filteredRules" stripe class="mt-12">
            <el-table-column prop="name" label="规则名称" min-width="170" />
            <el-table-column label="类型" width="90">
              <template #default="{ row }">
                <el-tag :type="typeTagType[row.type]" effect="plain">{{ row.type }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="level" label="级别" width="80" />
            <el-table-column prop="tableName" label="目标表" width="130" />
            <el-table-column prop="fieldName" label="字段" width="110" />
            <el-table-column label="权重" width="80" align="center">
              <template #default="{ row }">{{ row.weight }}</template>
            </el-table-column>
            <el-table-column prop="priority" label="优先级" width="80" />
            <el-table-column label="状态" width="80">
              <template #default="{ row }">
                <el-tag :type="statusTagType[row.status]" effect="dark">{{ row.status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="version" label="版本" width="70" align="center" />
            <el-table-column label="操作" width="190" fixed="right">
              <template #default="{ row }">
                <el-button link type="danger" @click="trialRule(row)">试跑</el-button>
                <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
                <el-button link type="warning" @click="toggleRule(row)">{{ row.status === '启用' ? '停用' : '启用' }}</el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-pagination class="pager" layout="total, prev, pager, next" :total="filteredRules.length" :page-size="20" background />
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card class="panel-card dashboard-card" shadow="never">
          <template #header>
            <div class="panel-header">
              <span>内置规则模板库</span>
              <el-button type="danger" size="small" @click="recommendRules">智能推荐</el-button>
            </div>
          </template>
          <div v-for="template in templates" :key="template.name" class="template-item" @click="applyTemplate(template)">
            <div class="template-icon">
              <el-icon :size="18"><component :is="template.icon" /></el-icon>
            </div>
            <div class="template-info">
              <div class="template-name">{{ template.name }}</div>
              <div class="template-desc">{{ template.description }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog v-model="editorVisible" :title="editingRule ? '编辑质量规则' : '新增质量规则'" width="620px">
      <el-form :model="form" label-width="110px">
        <el-form-item label="规则名称">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="规则类型">
          <el-select v-model="form.type" class="w-full">
            <el-option v-for="type in ruleTypes" :key="type" :label="type" :value="type" />
          </el-select>
        </el-form-item>
        <el-form-item label="规则级别">
          <el-radio-group v-model="form.level">
            <el-radio value="字段级" />
            <el-radio value="表级" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="目标表">
          <el-select v-model="form.tableName" class="w-full">
            <el-option v-for="table in tablePool" :key="table" :label="table" :value="table" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.level === '字段级'" label="目标字段">
          <el-select v-model="form.fieldName" class="w-full">
            <el-option v-for="field in fieldPool" :key="field" :label="field" :value="field" />
          </el-select>
        </el-form-item>
        <el-form-item label="权重">
          <el-slider v-model="form.weight" :min="0.1" :max="1" :step="0.1" show-input />
        </el-form-item>
        <el-form-item label="优先级">
          <el-radio-group v-model="form.priority">
            <el-radio value="高" />
            <el-radio value="中" />
            <el-radio value="低" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="检查逻辑">
          <el-input v-model="form.description" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editorVisible = false">取消</el-button>
        <el-button type="danger" @click="saveForm">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { CircleCheck, Clock, Connection, Lock, Plus, Search, Setting } from '@element-plus/icons-vue'
import { mockQualityRules, type QualityRule, type QualityRuleType } from '@/mock/quality'

const ruleTypes: QualityRuleType[] = ['完整性', '准确性', '一致性', '唯一性', '及时性']
const tablePool = ['ticket_sale', 'passenger_info', 'station_info', 'line_info', 'device_status', 'flow_stat']
const fieldPool = ['flow_count', 'station_name', 'ticket_no', 'cust_name', 'phone', 'line_code', 'device_no', 'stat_date']

const typeTagType: Record<string, 'danger' | 'primary' | 'success' | 'warning' | 'info'> = {
  完整性: 'danger',
  准确性: 'primary',
  一致性: 'success',
  唯一性: 'warning',
  及时性: 'info',
}

const statusTagType: Record<string, 'success' | 'info' | 'warning'> = {
  启用: 'success',
  停用: 'info',
  草稿: 'warning',
}

const templates = [
  { name: '必填完整性模板', description: '关键字段非空检查', icon: CircleCheck },
  { name: '格式准确性模板', description: '手机号/证件号格式校验', icon: Setting },
  { name: '标准一致性模板', description: '字典码值标准比对', icon: Connection },
  { name: '唯一性检查模板', description: '主键/业务键重复检查', icon: Lock },
  { name: '及时性检查模板', description: '数据入库时效检查', icon: Clock },
]

const keyword = ref('')
const filterType = ref('')
const filterStatus = ref('')
const editorVisible = ref(false)
const editingRule = ref<QualityRule | null>(null)

const form = reactive({
  name: '',
  type: '完整性' as QualityRuleType,
  level: '字段级',
  tableName: 'ticket_sale',
  fieldName: 'ticket_no',
  weight: 0.3,
  priority: '中',
  description: '',
})

const filteredRules = computed(() =>
  mockQualityRules.filter((rule) => {
    if (filterType.value && rule.type !== filterType.value) return false
    if (filterStatus.value && rule.status !== filterStatus.value) return false
    if (!keyword.value) return true
    const kw = keyword.value.toLowerCase()
    return rule.name.toLowerCase().includes(kw) || rule.tableName.toLowerCase().includes(kw)
  }),
)

const applyTemplate = (template: (typeof templates)[number]) => {
  form.name = template.name
  form.description = `${template.description}（套用模板）`
  ElMessage.success(`已套用模板「${template.name}」`)
}

const recommendRules = () => {
  ElMessage.success('根据最新发布的数据标准自动生成 12 条质量规则（Mock）')
}

const openCreate = () => {
  editingRule.value = null
  Object.assign(form, {
    name: '',
    type: '完整性',
    level: '字段级',
    tableName: 'ticket_sale',
    fieldName: 'ticket_no',
    weight: 0.3,
    priority: '中',
    description: '',
  })
  editorVisible.value = true
}

const openEdit = (row: QualityRule) => {
  editingRule.value = row
  Object.assign(form, {
    name: row.name,
    type: row.type,
    level: row.level,
    tableName: row.tableName,
    fieldName: row.fieldName,
    weight: row.weight,
    priority: row.priority,
    description: row.description,
  })
  editorVisible.value = true
}

const saveForm = () => {
  if (!form.name.trim()) {
    ElMessage.warning('请输入规则名称')
    return
  }
  if (editingRule.value) {
    ElMessage.success(`规则「${form.name}」已保存，版本 ${editingRule.value.version}（Mock）`)
  } else {
    mockQualityRules.unshift({
      id: `qr-mock-${Date.now()}`,
      name: form.name,
      type: form.type,
      level: form.level as '表级' | '字段级',
      tableName: form.tableName,
      fieldName: form.fieldName,
      templateName: `${form.type}检查模板`,
      weight: form.weight,
      priority: form.priority as '高' | '中' | '低',
      status: '草稿',
      owner: '张三',
      version: 'V1.0',
      updateTime: new Date().toLocaleString('sv-SE').replace('T', ' '),
      description: form.description,
    })
    ElMessage.success('质量规则已新增（Mock）')
  }
  editorVisible.value = false
}

const trialRule = (row: QualityRule) => {
  ElMessage.success(`规则「${row.name}」试跑完成：检查 12,845 条，发现 26 条问题（Mock）`)
}

const toggleRule = (row: QualityRule) => {
  row.status = row.status === '启用' ? '停用' : '启用'
  ElMessage.info(`规则「${row.name}」已${row.status === '启用' ? '启用' : '停用'}（Mock）`)
}
</script>
