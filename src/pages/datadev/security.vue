<template>
  <div class="standard-page">
    <el-row :gutter="16">
      <el-col :span="16">
        <el-card class="panel-card dashboard-card" shadow="never">
          <template #header>
            <div class="panel-header">
              <span>脱敏规则管理</span>
              <el-button type="danger" :icon="Plus" @click="openCreate">新增规则</el-button>
            </div>
          </template>

          <div class="toolbar-row">
            <el-input
              v-model="keyword"
              placeholder="按规则名称 / 字段搜索"
              clearable
              class="search-input"
              :prefix-icon="Search"
            />
            <el-select v-model="filterMethod" placeholder="脱敏方式" clearable class="filter-select">
              <el-option label="替换" value="替换" />
              <el-option label="掩码" value="掩码" />
              <el-option label="哈希" value="哈希" />
              <el-option label="保留格式" value="保留格式" />
            </el-select>
          </div>

          <el-table :data="filteredRules" stripe class="mt-12">
            <el-table-column prop="name" label="规则名称" min-width="140" />
            <el-table-column prop="field" label="字段" width="130" />
            <el-table-column prop="tableName" label="目标表" min-width="150" />
            <el-table-column label="脱敏方式" width="110">
              <template #default="{ row }">
                <el-tag effect="plain" type="danger">{{ row.method }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="算法" width="100">
              <template #default="{ row }">{{ row.algorithm }}</template>
            </el-table-column>
            <el-table-column label="版本" width="80" align="center">
              <template #default="{ row }">{{ row.version }}</template>
            </el-table-column>
            <el-table-column label="状态" width="90">
              <template #default="{ row }">
                <el-tag :type="ruleStatusTagType[row.status]" effect="dark">{{ row.status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="160" fixed="right">
              <template #default="{ row }">
                <el-button link type="danger" @click="submitApproval(row)">提交审批</el-button>
                <el-button link type="primary" @click="applyRule(row)">应用</el-button>
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
              <span>加密与密钥管理</span>
            </div>
          </template>
          <div class="encrypt-item" v-for="item in encryptItems" :key="item.name">
            <div class="encrypt-item-info">
              <div class="encrypt-item-name">{{ item.name }}</div>
              <div class="encrypt-item-desc">{{ item.desc }}</div>
            </div>
            <el-tag effect="plain" :type="item.enabled ? 'success' : 'info'">{{ item.enabled ? '已启用' : '未启用' }}</el-tag>
          </div>
          <div class="key-actions">
            <el-button size="small" type="danger" @click="rotateKey">轮换主密钥</el-button>
            <el-button size="small" @click="exportReport">生成合规报告</el-button>
          </div>
        </el-card>

        <el-card class="panel-card dashboard-card mt-16" shadow="never">
          <template #header>
            <div class="panel-header">
              <span>操作审计日志</span>
            </div>
          </template>
          <div class="audit-item" v-for="log in auditLogs" :key="`${log.time}-${log.action}`">
            <div class="audit-item-head">
              <el-tag effect="dark" size="small" :type="log.type">{{ log.user }}</el-tag>
              <span class="audit-item-time">{{ log.time }}</span>
            </div>
            <div class="audit-item-action">{{ log.action }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog v-model="editorVisible" title="新增脱敏规则" width="560px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="规则名称">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="目标表">
          <el-select v-model="form.tableName" class="w-full">
            <el-option label="customer_info" value="customer_info" />
            <el-option label="ticket_sale" value="ticket_sale" />
            <el-option label="employee" value="employee" />
          </el-select>
        </el-form-item>
        <el-form-item label="目标字段">
          <el-input v-model="form.field" placeholder="如 cert_no / phone" />
        </el-form-item>
        <el-form-item label="脱敏方式">
          <el-select v-model="form.method" class="w-full">
            <el-option label="替换" value="替换" />
            <el-option label="掩码" value="掩码" />
            <el-option label="哈希" value="哈希" />
            <el-option label="保留格式" value="保留格式" />
          </el-select>
        </el-form-item>
        <el-form-item label="算法">
          <el-select v-model="form.algorithm" class="w-full">
            <el-option label="AES-256" value="AES-256" />
            <el-option label="SHA-256" value="SHA-256" />
            <el-option label="FPE-FF1" value="FPE-FF1" />
            <el-option label="MD5" value="MD5" />
          </el-select>
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
import { Plus, Search } from '@element-plus/icons-vue'

type MaskRule = {
  name: string
  field: string
  tableName: string
  method: string
  algorithm: string
  version: string
  status: '已发布' | '审批中' | '草稿'
}

const ruleStatusTagType: Record<string, 'success' | 'warning' | 'info'> = {
  已发布: 'success',
  审批中: 'warning',
  草稿: 'info',
}

const keyword = ref('')
const filterMethod = ref('')
const editorVisible = ref(false)

const rules = ref<MaskRule[]>([
  { name: '证件号掩码规则', field: 'cert_no', tableName: 'customer_info', method: '掩码', algorithm: 'FPE-FF1', version: 'V2.1', status: '已发布' },
  { name: '手机号替换规则', field: 'phone', tableName: 'customer_info', method: '替换', algorithm: 'AES-256', version: 'V1.3', status: '已发布' },
  { name: '银行卡哈希规则', field: 'bank_no', tableName: 'account_info', method: '哈希', algorithm: 'SHA-256', version: 'V1.0', status: '审批中' },
  { name: '姓名保留格式', field: 'cust_name', tableName: 'ticket_sale', method: '保留格式', algorithm: 'FPE-FF1', version: 'V1.2', status: '已发布' },
  { name: '邮箱掩码规则', field: 'email', tableName: 'employee', method: '掩码', algorithm: 'FPE-FF1', version: 'V1.0', status: '草稿' },
])

const encryptItems = [
  { name: '传输层加密', desc: 'TLS 1.3 全链路加密', enabled: true },
  { name: '存储层加密', desc: 'AES-256 透明加密', enabled: true },
  { name: '主密钥管理', desc: 'KMS 托管，每 90 天轮换', enabled: true },
  { name: '字段级加密', desc: '敏感字段独立加密', enabled: false },
]

const auditLogs = [
  { user: '张三', time: '2026-08-11 14:05', action: '提交「手机号替换规则 V1.3」审批', type: 'primary' as const },
  { user: '王工', time: '2026-08-11 13:20', action: '审批通过「证件号掩码规则 V2.1」', type: 'success' as const },
  { user: '李四', time: '2026-08-11 10:45', action: '轮换主密钥（KMS-20260811）', type: 'warning' as const },
  { user: '赵六', time: '2026-08-10 17:30', action: '导出合规报告（2026-Q2）', type: 'info' as const },
]

const form = reactive({
  name: '',
  tableName: 'customer_info',
  field: '',
  method: '掩码',
  algorithm: 'FPE-FF1',
})

const filteredRules = computed(() =>
  rules.value.filter((rule) => {
    if (filterMethod.value && rule.method !== filterMethod.value) return false
    if (!keyword.value) return true
    const kw = keyword.value.toLowerCase()
    return rule.name.toLowerCase().includes(kw) || rule.field.toLowerCase().includes(kw)
  }),
)

const openCreate = () => {
  Object.assign(form, { name: '', tableName: 'customer_info', field: '', method: '掩码', algorithm: 'FPE-FF1' })
  editorVisible.value = true
}

const saveForm = () => {
  if (!form.name.trim() || !form.field.trim()) {
    ElMessage.warning('请填写规则名称和字段')
    return
  }
  rules.value.unshift({
    name: form.name,
    field: form.field,
    tableName: form.tableName,
    method: form.method,
    algorithm: form.algorithm,
    version: 'V1.0',
    status: '草稿',
  })
  editorVisible.value = false
  ElMessage.success('脱敏规则已创建（Mock）')
}

const submitApproval = (row: MaskRule) => {
  row.status = '审批中'
  ElMessage.success(`规则「${row.name}」已提交审批（Mock）`)
}

const applyRule = (row: MaskRule) => {
  ElMessage.success(`规则「${row.name}」已应用到 ${row.tableName}.${row.field}（Mock）`)
}

const rotateKey = () => {
  ElMessage.success('主密钥已轮换（Mock）')
}

const exportReport = () => {
  ElMessage.success('合规报告已生成并导出（Mock）')
}
</script>
