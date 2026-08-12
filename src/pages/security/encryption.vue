<template>
  <div class="standard-page">
    <el-row :gutter="16">
      <el-col :span="16">
        <el-card class="panel-card dashboard-card" shadow="never">
          <template #header>
            <div class="panel-header">
              <span>脱敏规则配置</span>
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
            </el-select>
            <el-select v-model="filterStatus" placeholder="状态" clearable class="filter-select">
              <el-option label="已上线" value="已上线" />
              <el-option label="审批中" value="审批中" />
              <el-option label="草稿" value="草稿" />
            </el-select>
          </div>

          <el-table :data="pagedRules" stripe class="mt-12">
            <el-table-column prop="name" label="规则名称" min-width="140" />
            <el-table-column prop="field" label="目标字段" min-width="170" />
            <el-table-column label="方式" width="80">
              <template #default="{ row }">
                <el-tag :type="methodTagType[row.method]" effect="plain">{{ row.method }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="保留格式" width="90" align="center">
              <template #default="{ row }">
                <span :class="row.preserveFormat ? 'trend-positive' : 'dep-text'">{{ row.preserveFormat ? '是' : '否' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="示例" min-width="210">
              <template #default="{ row }">
                <span class="mask-sample-before">{{ row.sampleBefore }}</span>
                <span class="dep-text"> → </span>
                <span class="mask-sample-after">{{ row.sampleAfter }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="scope" label="场景" width="130" />
            <el-table-column prop="version" label="版本" width="70" align="center" />
            <el-table-column label="状态" width="90">
              <template #default="{ row }">
                <el-tag :type="ruleStatusTag[row.status]" effect="dark">{{ row.status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="190" fixed="right">
              <template #default="{ row }">
                <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
                <el-button link type="warning" @click="versionHistory(row)">版本</el-button>
                <el-button link type="success" @click="onlineRule(row)">{{ row.status === '已上线' ? '下线' : '上线' }}</el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-pagination
            class="pager"
            layout="total, prev, pager, next"
            :total="filteredRules.length"
            :page-size="pageSize"
            :current-page="currentPage"
            background
            @current-change="changePage"
          />
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card class="panel-card dashboard-card" shadow="never">
          <template #header>
            <div class="panel-header"><span>传输加密配置</span></div>
          </template>
          <el-form label-width="100px">
            <el-form-item label="HTTPS 强制">
              <el-switch v-model="transport.https" active-text="强制启用" />
            </el-form-item>
            <el-form-item label="TLS 版本">
              <el-select v-model="transport.tls" class="w-full">
                <el-option label="TLS 1.3" value="TLS 1.3" />
                <el-option label="TLS 1.2" value="TLS 1.2" />
              </el-select>
            </el-form-item>
            <el-form-item label="证书管理">
              <el-button size="small" @click="manageCert">管理证书</el-button>
            </el-form-item>
          </el-form>
          <el-divider />
          <div class="section-title">存储加密配置</div>
          <el-form label-width="100px">
            <el-form-item label="加密算法">
              <el-select v-model="storage.algorithm" class="w-full">
                <el-option label="SM4（国密）" value="SM4" />
                <el-option label="AES-256" value="AES-256" />
              </el-select>
            </el-form-item>
            <el-form-item label="密钥轮换">
              <el-switch v-model="storage.rotation" active-text="自动轮换" />
            </el-form-item>
            <el-form-item label="轮换周期">
              <el-select v-model="storage.rotationCycle" :disabled="!storage.rotation" class="w-full">
                <el-option label="30 天" value="30" />
                <el-option label="90 天" value="90" />
                <el-option label="180 天" value="180" />
              </el-select>
            </el-form-item>
          </el-form>
        </el-card>

        <el-card class="panel-card dashboard-card mt-16" shadow="never">
          <template #header>
            <div class="panel-header"><span>密钥生命周期</span></div>
          </template>
          <div class="key-item" v-for="key in keys" :key="key.name">
            <div class="key-icon" :style="{ background: key.color }"><el-icon :size="16"><Key /></el-icon></div>
            <div class="key-info">
              <div class="key-name">{{ key.name }}</div>
              <div class="key-desc">{{ key.desc }}</div>
            </div>
            <el-tag size="small" :type="key.statusType" effect="dark">{{ key.status }}</el-tag>
          </div>
          <div class="maintain-actions mt-12">
            <el-button size="small" type="danger" plain @click="rotateKey">轮换密钥</el-button>
            <el-button size="small" @click="createKey">创建密钥</el-button>
            <el-button size="small" type="warning" plain @click="destroyKey">销毁</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-drawer v-model="editorVisible" :title="editing ? '编辑脱敏规则' : '新增脱敏规则'" size="520px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="规则名称">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="目标字段">
          <el-select v-model="form.field" filterable class="w-full">
            <el-option v-for="field in fieldPool" :key="field" :label="field" :value="field" />
          </el-select>
        </el-form-item>
        <el-form-item label="脱敏方式">
          <el-radio-group v-model="form.method">
            <el-radio value="替换" />
            <el-radio value="掩码" />
            <el-radio value="哈希" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="保留格式">
          <el-switch v-model="form.preserveFormat" active-text="启用" inactive-text="关闭" />
        </el-form-item>
        <el-form-item label="脱敏场景">
          <el-radio-group v-model="form.scope">
            <el-radio value="查询实时脱敏" />
            <el-radio value="存储静态脱敏" />
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editorVisible = false">取消</el-button>
        <el-button type="danger" @click="saveForm">保存</el-button>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Key, Plus, Search } from '@element-plus/icons-vue'
import { mockMaskingRules, type MaskingRule } from '@/mock/security'

const keyword = ref('')
const filterMethod = ref('')
const filterStatus = ref('')
const currentPage = ref(1)
const pageSize = 20
const editorVisible = ref(false)
const editing = ref(false)

const rules = ref([...mockMaskingRules])

const fieldPool = ['passenger_info.cust_name', 'passenger_info.phone', 'passenger_info.id_card', 'passenger_info.address', 'ticket_sale_detail.ticket_no']

const methodTagType: Record<string, 'primary' | 'warning' | 'info'> = {
  替换: 'primary',
  掩码: 'warning',
  哈希: 'info',
}

const ruleStatusTag: Record<string, 'success' | 'warning' | 'info'> = {
  已上线: 'success',
  审批中: 'warning',
  草稿: 'info',
}

const transport = reactive({ https: true, tls: 'TLS 1.3' })
const storage = reactive({ algorithm: 'SM4', rotation: true, rotationCycle: '90' })

const keys = [
  { name: '数据加密主密钥', desc: 'SM4 · 创建于 2026-01-15', status: '正常', statusType: 'success' as const, color: '#00A854' },
  { name: '传输会话密钥', desc: 'TLS 1.3 · 每日轮换', status: '正常', statusType: 'success' as const, color: '#2B6CB0' },
  { name: '脱敏 HMAC 密钥', desc: 'HMAC-SHA256 · 30 天轮换', status: '即将轮换', statusType: 'warning' as const, color: '#ED7B2F' },
]

const form = reactive({
  name: '',
  field: 'passenger_info.phone',
  method: '掩码',
  preserveFormat: true,
  scope: '查询实时脱敏',
})

const filteredRules = computed(() =>
  rules.value.filter((rule) => {
    if (filterMethod.value && rule.method !== filterMethod.value) return false
    if (filterStatus.value && rule.status !== filterStatus.value) return false
    if (!keyword.value) return true
    const kw = keyword.value.toLowerCase()
    return rule.name.toLowerCase().includes(kw) || rule.field.toLowerCase().includes(kw)
  }),
)

const pagedRules = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredRules.value.slice(start, start + pageSize)
})

const changePage = (page: number) => (currentPage.value = page)

watch([keyword, filterMethod, filterStatus], () => {
  currentPage.value = 1
})

const openCreate = () => {
  editing.value = false
  Object.assign(form, { name: '', field: 'passenger_info.phone', method: '掩码', preserveFormat: true, scope: '查询实时脱敏' })
  editorVisible.value = true
}

const openEdit = (row: MaskingRule) => {
  editing.value = true
  Object.assign(form, {
    name: row.name,
    field: row.field,
    method: row.method,
    preserveFormat: row.preserveFormat,
    scope: row.scope,
  })
  editorVisible.value = true
}

const saveForm = () => {
  if (!form.name.trim()) {
    ElMessage.warning('请输入规则名称')
    return
  }
  if (editing.value) {
    ElMessage.success(`脱敏规则「${form.name}」已保存并进入审批（Mock）`)
  } else {
    rules.value.unshift({
      id: `msk-mock-${Date.now()}`,
      name: form.name,
      field: form.field,
      method: form.method as MaskingRule['method'],
      preserveFormat: form.preserveFormat,
      sampleBefore: '示例数据',
      sampleAfter: form.method === '掩码' ? '示例****' : '示例数据',
      scope: form.scope,
      status: '审批中',
      version: 'V1.0',
      updateTime: new Date().toLocaleString('sv-SE').replace('T', ' '),
    })
    ElMessage.success('脱敏规则已提交审批（Mock）')
  }
  editorVisible.value = false
}

const versionHistory = (row: MaskingRule) => {
  ElMessage.info(`「${row.name}」版本历史：${row.version} → V${Number(row.version.slice(1)) + 1}.0（Mock）`)
}

const onlineRule = (row: MaskingRule) => {
  row.status = row.status === '已上线' ? '草稿' : '已上线'
  ElMessage.success(`规则「${row.name}」已${row.status === '已上线' ? '上线' : '下线'}（Mock）`)
}

const manageCert = () => ElMessage.info('打开证书管理（Mock）')
const rotateKey = () => ElMessage.success('密钥轮换已触发，新密钥将在 24 小时内生效（Mock）')
const createKey = () => ElMessage.info('创建新密钥向导（Mock）')
const destroyKey = () => ElMessage.warning('销毁操作需要二次审批，已生成审批单（Mock）')
</script>