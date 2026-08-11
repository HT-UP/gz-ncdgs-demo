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
              placeholder="按规则名称 / 编号搜索"
              clearable
              class="search-input"
              :prefix-icon="Search"
            />
            <el-radio-group v-model="ruleCategory" size="small">
              <el-radio-button label="完整性" />
              <el-radio-button label="准确性" />
              <el-radio-button label="一致性" />
              <el-radio-button label="唯一性" />
              <el-radio-button label="及时性" />
            </el-radio-group>
          </div>

          <el-table :data="filteredRules" stripe class="mt-12">
            <el-table-column prop="code" label="规则编号" width="130" />
            <el-table-column prop="name" label="规则名称" min-width="200" />
            <el-table-column prop="category" label="类型" width="90" />
            <el-table-column prop="level" label="级别" width="80" align="center">
              <template #default="{ row }">
                <el-tag :type="levelTagType[row.level as keyof typeof levelTagType]" effect="dark">
                  {{ row.level }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="权重" width="80" align="center">
              <template #default="{ row }">{{ row.weight }}%</template>
            </el-table-column>
            <el-table-column label="作用范围" width="90" align="center">
              <template #default="{ row }">{{ row.scope }}</template>
            </el-table-column>
            <el-table-column prop="source" label="来源" width="110" />
            <el-table-column label="操作" width="200" fixed="right">
              <template #default="{ row }">
                <el-button link type="danger" @click="openDetail(row)">详情</el-button>
                <el-button link type="primary" @click="runTest(row)">试跑</el-button>
                <el-button link type="danger" @click="confirmDelete(row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-pagination
            class="pager"
            layout="total, prev, pager, next"
            :total="filteredRules.length"
            :page-size="20"
            background
          />
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card class="panel-card dashboard-card" shadow="never">
          <template #header>
            <div class="panel-header">
              <span>规则模板库</span>
              <el-link :underline="false" type="danger">一键套用</el-link>
            </div>
          </template>
          <div
            v-for="template in templates"
            :key="template.name"
            class="template-item"
            @click="applyTemplate(template)"
          >
            <div class="template-icon">
              <el-icon :size="18"><Checked /></el-icon>
            </div>
            <div class="template-info">
              <div class="template-name">{{ template.name }}</div>
              <div class="template-desc">{{ template.description }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog v-model="editorVisible" :title="editing ? '编辑规则' : '新增规则'" width="560px">
      <el-form :model="form" label-width="90px">
        <el-form-item label="规则名称">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="规则类型">
          <el-select v-model="form.category" class="w-full">
            <el-option label="完整性" value="完整性" />
            <el-option label="准确性" value="准确性" />
            <el-option label="一致性" value="一致性" />
            <el-option label="唯一性" value="唯一性" />
            <el-option label="及时性" value="及时性" />
          </el-select>
        </el-form-item>
        <el-form-item label="规则级别">
          <el-radio-group v-model="form.level">
            <el-radio value="核心" />
            <el-radio value="重要" />
            <el-radio value="一般" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="权重">
          <el-slider v-model="form.weight" :min="1" :max="100" show-input />
        </el-form-item>
        <el-form-item label="规则描述">
          <el-input v-model="form.description" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editorVisible = false">取消</el-button>
        <el-button type="danger" @click="saveForm">保存</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="detailVisible" :title="detailRow?.name ?? '规则详情'" width="560px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="规则编号">{{ detailRow?.code }}</el-descriptions-item>
        <el-descriptions-item label="规则类型">{{ detailRow?.category }}</el-descriptions-item>
        <el-descriptions-item label="级别">{{ detailRow?.level }}</el-descriptions-item>
        <el-descriptions-item label="权重">{{ detailRow?.weight }}%</el-descriptions-item>
        <el-descriptions-item label="作用范围">{{ detailRow?.scope }}</el-descriptions-item>
        <el-descriptions-item label="来源">{{ detailRow?.source }}</el-descriptions-item>
        <el-descriptions-item label="描述" :span="2">{{ detailRow?.description }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Checked, Plus, Search } from '@element-plus/icons-vue'

type RuleItem = {
  code: string
  name: string
  category: string
  level: string
  weight: number
  scope: string
  source: string
  description: string
}

const levelTagType = {
  核心: 'danger',
  重要: 'warning',
  一般: 'info',
}

const keyword = ref('')
const ruleCategory = ref('完整性')
const editorVisible = ref(false)
const detailVisible = ref(false)
const editing = ref<RuleItem | null>(null)
const detailRow = ref<RuleItem | null>(null)

const rules = ref<RuleItem[]>([
  { code: 'QR-001', name: '字段非空校验', category: '完整性', level: '核心', weight: 20, scope: '字段级', source: '标准即规则', description: '目标字段不允许为空值或空白字符串' },
  { code: 'QR-002', name: '必填字段完整性检查', category: '完整性', level: '核心', weight: 15, scope: '表级', source: '手工配置', description: '业务关键字段必须全部填写' },
  { code: 'QR-003', name: '编码格式校验', category: '准确性', level: '重要', weight: 12, scope: '字段级', source: '规则模板', description: '字段值必须符合约定的编码格式' },
  { code: 'QR-004', name: '数值范围检查', category: '准确性', level: '重要', weight: 10, scope: '字段级', source: '规则模板', description: '数值字段取值必须在定义范围内' },
  { code: 'QR-005', name: '跨表一致性校验', category: '一致性', level: '核心', weight: 18, scope: '表级', source: '手工配置', description: '关联表相同业务字段取值一致' },
  { code: 'QR-006', name: '主键唯一性检查', category: '唯一性', level: '核心', weight: 15, scope: '字段级', source: '标准即规则', description: '主键或唯一字段不允许重复' },
  { code: 'QR-007', name: '采集时效检查', category: '及时性', level: '一般', weight: 5, scope: '表级', source: '规则模板', description: '数据必须在约定时间内完成采集' },
  { code: 'QR-008', name: '数据同步延迟监控', category: '及时性', level: '重要', weight: 5, scope: '表级', source: '手工配置', description: '同步延迟不得超过阈值' },
])

const templates = [
  { name: '非空校验模板', description: '字段不允许为空，适用于核心业务字段', category: '完整性' },
  { name: '格式校验模板', description: '校验编码、证件号、手机号等格式', category: '准确性' },
  { name: '唯一性校验模板', description: '校验主键及唯一索引不重复', category: '唯一性' },
  { name: '一致性校验模板', description: '跨表、跨系统同义字段取值一致', category: '一致性' },
  { name: '时效性校验模板', description: '数据采集与同步时间阈值校验', category: '及时性' },
]

const form = reactive({
  name: '',
  category: '完整性',
  level: '核心',
  weight: 10,
  description: '',
})

const filteredRules = computed(() =>
  rules.value.filter((rule) => {
    if (rule.category !== ruleCategory.value) return false
    if (!keyword.value) return true
    const kw = keyword.value.toLowerCase()
    return rule.name.toLowerCase().includes(kw) || rule.code.toLowerCase().includes(kw)
  }),
)

const openCreate = () => {
  editing.value = null
  Object.assign(form, { name: '', category: ruleCategory.value, level: '核心', weight: 10, description: '' })
  editorVisible.value = true
}

const saveForm = () => {
  if (!form.name.trim()) {
    ElMessage.warning('请输入规则名称')
    return
  }
  if (editing.value) {
    Object.assign(editing.value, { ...form })
    ElMessage.success('规则已更新（Mock）')
  } else {
    rules.value.unshift({
      code: `QR-${String(rules.value.length + 1).padStart(3, '0')}`,
      name: form.name,
      category: form.category,
      level: form.level,
      weight: form.weight,
      scope: '字段级',
      source: '手工配置',
      description: form.description,
    })
    ElMessage.success('规则已新增（Mock）')
  }
  editorVisible.value = false
}

const openDetail = (row: RuleItem) => {
  detailRow.value = row
  detailVisible.value = true
}

const runTest = (row: RuleItem) => {
  ElMessage.success(`规则「${row.name}」试跑完成：通过率 96.8%（Mock）`)
}

const confirmDelete = (row: RuleItem) => {
  ElMessageBox.confirm(`确认删除规则「${row.name}」吗？`, '删除确认', { type: 'warning' })
    .then(() => {
      const index = rules.value.indexOf(row)
      if (index > -1) rules.value.splice(index, 1)
      ElMessage.success('规则已删除（Mock）')
    })
    .catch(() => {})
}

const applyTemplate = (template: (typeof templates)[number]) => {
  ruleCategory.value = template.category
  Object.assign(form, {
    name: template.name,
    category: template.category,
    level: '重要',
    weight: 10,
    description: template.description,
  })
  editorVisible.value = true
}
</script>
