<template>
  <div class="standard-page masking-page">
    <div class="mask-stats">
      <div v-for="s in statsCards" :key="s.label" class="mask-stat" :style="{ background: s.bg, color: s.color }">
        <div class="mask-stat-value">{{ s.value }}</div>
        <div class="mask-stat-label">{{ s.label }}</div>
      </div>
    </div>

    <el-card class="panel-card" shadow="never">
      <el-tabs v-model="activeTab" class="mask-tabs">
        <el-tab-pane label="规则列表" name="rules">
          <div class="toolbar-row">
            <el-input v-model="ruleKeyword" placeholder="按规则名称 / 绑定表搜索" clearable class="search-input" :prefix-icon="Search" />
            <el-select v-model="ruleAlgo" placeholder="算法" clearable class="filter-select">
              <el-option v-for="a in algorithms" :key="a.key" :label="a.name" :value="a.key" />
            </el-select>
            <el-select v-model="ruleStatus" placeholder="状态" clearable class="filter-select">
              <el-option label="生效中" value="生效中" />
              <el-option label="草稿" value="草稿" />
              <el-option label="已停用" value="已停用" />
            </el-select>
            <span class="dep-text">共 {{ filteredRules.length }} 条</span>
            <div class="toolbar-right">
              <el-button type="danger" size="small" :icon="Plus" @click="openCreate">新建脱敏规则</el-button>
            </div>
          </div>

          <el-table :data="filteredRules" size="small" stripe class="mt-12">
            <el-table-column prop="name" label="规则名称" min-width="150" show-overflow-tooltip />
            <el-table-column label="算法" width="150">
              <template #default="{ row }">
                <el-tag size="small" effect="plain" type="primary">{{ algoName(row.algo) }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="paramText" label="算法参数" min-width="170" show-overflow-tooltip />
            <el-table-column prop="boundFields" label="绑定字段" width="76" align="center" />
            <el-table-column label="生效范围" width="120">
              <template #default="{ row }">
                <span class="dep-text">{{ row.scope }}</span>
              </template>
            </el-table-column>
            <el-table-column label="状态" width="82">
              <template #default="{ row }">
                <el-tag size="small" :type="statusTag[row.status]" effect="dark">{{ row.status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="updateTime" label="更新时间" width="106" />
            <el-table-column label="操作" width="200" fixed="right">
              <template #default="{ row }">
                <el-button link type="primary" size="small" @click="testRule(row)">试算预览</el-button>
                <el-button link type="warning" size="small" @click="editRule(row)">编辑</el-button>
                <el-button link :type="row.status === '生效中' ? 'info' : 'success'" size="small" @click="toggleRule(row)">
                  {{ row.status === '生效中' ? '停用' : row.status === '草稿' ? '启用' : '恢复' }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="字段绑定" name="binding">
          <div class="toolbar-row">
            <el-select v-model="bindClass" placeholder="按分类分级筛选" clearable class="filter-select-lg">
              <el-option label="个人信息/敏感" value="个人信息/敏感" />
              <el-option label="金融信息" value="金融信息" />
              <el-option label="生物识别信息" value="生物识别信息" />
              <el-option label="证件信息" value="证件信息" />
            </el-select>
            <el-select v-model="bindStatus" placeholder="绑定状态" clearable class="filter-select">
              <el-option label="已绑定" value="已绑定" />
              <el-option label="未绑定" value="未绑定" />
            </el-select>
            <div class="toolbar-right">
              <el-button size="small" plain :disabled="!selection.length" @click="bindBatch('清除')">清除绑定</el-button>
              <el-button size="small" type="danger" :icon="Link" :disabled="!selection.length" @click="openBatchBind">批量绑定规则</el-button>
            </div>
          </div>

          <el-table :data="filteredFields" size="small" stripe class="mt-12" @selection-change="onSelectionChange">
            <el-table-column type="selection" width="42" />
            <el-table-column prop="table" label="所属表" min-width="150" show-overflow-tooltip />
            <el-table-column prop="field" label="字段" width="120" />
            <el-table-column prop="classified" label="分类分级" width="130" />
            <el-table-column prop="source" label="识别来源" width="110" />
            <el-table-column label="绑定规则" min-width="150">
              <template #default="{ row }">
                <el-tag v-if="row.rule" size="small" type="success" effect="plain">{{ row.rule }}</el-tag>
                <el-tag v-else size="small" type="danger" effect="plain">未绑定</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="未脱敏监测" name="unmasked">
          <el-alert type="warning" :closable="false" show-icon class="mb-16">
            <template #title>以下 {{ unmaskedFields.length }} 个已识别敏感字段尚未绑定脱敏规则，存在数据泄露风险，请尽快处理。</template>
          </el-alert>
          <el-table :data="unmaskedFields" size="small" stripe>
            <el-table-column prop="table" label="所属表" min-width="160" />
            <el-table-column prop="field" label="字段" width="130" />
            <el-table-column prop="classified" label="分类分级" width="130" />
            <el-table-column prop="detectTime" label="识别时间" width="110" />
            <el-table-column label="风险等级" width="90">
              <template #default="{ row }">
                <span class="security-level" :style="{ background: row.risk === '高' ? '#DA251D' : '#ED7B2F' }">{{ row.risk }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120">
              <template #default="{ row }">
                <el-button link type="primary" size="small" @click="quickBind(row)">一键绑定</el-button>
                <el-button link type="info" size="small" @click="viewField(row)">忽略</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="审计溯源" name="audit">
          <div class="toolbar-row">
            <el-radio-group v-model="auditType" size="small">
              <el-radio-button value="all">全部</el-radio-button>
              <el-radio-button value="生效">生效验证</el-radio-button>
              <el-radio-button value="绑定">字段绑定</el-radio-button>
              <el-radio-button value="密钥">密钥变更</el-radio-button>
            </el-radio-group>
          </div>
          <el-table :data="auditLogs" size="small" stripe class="mt-12">
            <el-table-column prop="time" label="时间" width="150" />
            <el-table-column prop="operator" label="操作人" width="100" />
            <el-table-column prop="type" label="类型" width="90">
              <template #default="{ row }">
                <el-tag size="small" effect="plain">{{ row.type }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="content" label="操作内容" min-width="260" />
            <el-table-column label="结果" width="80">
              <template #default="{ row }">
                <span :class="row.result === '成功' ? 'audit-success' : 'audit-fail'">{{ row.result }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 新建 / 编辑规则 -->
    <el-dialog v-model="createVisible" :title="`${editingRule ? '编辑' : '新建'}脱敏规则`" width="760px" destroy-on-close>
      <el-form :model="ruleForm" label-width="110px">
        <el-row :gutter="12">
          <el-col :span="12">
            <el-form-item label="规则名称">
              <el-input v-model="ruleForm.name" placeholder="如：客户手机号脱敏" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="生效范围">
              <el-select v-model="ruleForm.scope" class="w-full">
                <el-option label="全局生效" value="全局生效" />
                <el-option label="指定服务" value="指定服务" />
                <el-option label="指定应用" value="指定应用" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="脱敏算法">
          <el-select v-model="ruleForm.algo" class="w-full" @change="onAlgoChange">
            <el-option v-for="a in algorithms" :key="a.key" :label="`${a.name}（${a.desc}）`" :value="a.key" />
          </el-select>
        </el-form-item>
        <div v-if="currentAlgo" class="algo-panel">
          <div class="algo-desc">{{ currentAlgo.desc }} · 示例输入：{{ currentAlgo.sample }} → {{ currentAlgo.output }}</div>
          <el-row v-if="algoParamsVisible" :gutter="12">
            <el-col :span="12">
              <el-form-item label="保留位数">
                <el-input-number v-model="ruleForm.keep" :min="0" :max="32" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="盐值 / 策略">
                <el-input v-model="ruleForm.salt" placeholder="可选" />
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <el-form-item label="试算预览">
          <div class="try-row">
            <el-input v-model="tryValue" placeholder="输入测试值，如 13812345678 / 张三 / 2026-08-13" class="try-input" />
            <span class="try-arrow">→</span>
            <code class="try-output">{{ tryResult }}</code>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="createVisible = false">取消</el-button>
        <el-button @click="saveRule(false)">存草稿</el-button>
        <el-button type="danger" @click="saveRule(true)">保存并启用</el-button>
      </template>
    </el-dialog>

    <!-- 批量绑定 -->
    <el-dialog v-model="batchVisible" title="批量绑定脱敏规则" width="420px">
      <div class="batch-info">已选择 {{ selection.length }} 个敏感字段</div>
      <el-select v-model="batchRule" placeholder="选择生效规则" class="w-full mt-12">
        <el-option v-for="r in rules" :key="r.name" :label="`${r.name}（${algoName(r.algo)}）`" :value="r.name" />
      </el-select>
      <template #footer>
        <el-button @click="batchVisible = false">取消</el-button>
        <el-button type="danger" :disabled="!batchRule" @click="saveBatchBind">确认绑定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Link, Plus, Search } from '@element-plus/icons-vue'

const activeTab = ref('rules')

const statsCards = [
  { label: '脱敏规则总数', value: '9', color: '#fff', bg: 'linear-gradient(135deg, #DA251D, #B71C1C)' },
  { label: '已绑定敏感字段', value: '86', color: '#00A854', bg: 'rgba(0,168,84,.1)' },
  { label: '未脱敏风险字段', value: '12', color: '#ED7B2F', bg: 'rgba(237,123,47,.1)' },
  { label: '生效中规则', value: '7', color: '#2B6CB0', bg: 'rgba(43,108,176,.1)' },
]

const algorithms = [
  { key: 'masking', name: '遮盖', desc: '将敏感字符统一替换为遮罩符', sample: '张三', output: '***' },
  { key: 'replace', name: '替换', desc: '按映射字典完成替换（拼音/同义词）', sample: '广州市', output: '广州市★' },
  { key: 'hash', name: '哈希', desc: 'SM3/SHA-256 加盐不可逆哈希', sample: '13812345678', output: 'f9b3a1…（64位）' },
  { key: 'encrypt', name: '加密', desc: 'AES-256 国密可逆加密保真', sample: '13812345678', output: 'R9wK…（密文）' },
  { key: 'shuffle', name: '洗牌', desc: '列内随机重排保持统计特性', sample: '张三', output: '李四' },
  { key: 'truncation', name: '截断', desc: '保留前 N 位并补全', sample: '510102199001011234', output: '5101021990********' },
  { key: 'dateOffset', name: '日期偏移取整', desc: '日期按月/年偏移取整', sample: '2026-08-13', output: '2026-08-01' },
  { key: 'keep', name: '掩码', desc: '保留首尾各 N 位，中间遮盖', sample: '13812345678', output: '138****5678' },
  { key: 'permute', name: '重排', desc: '字典映射替换（姓名→花名）', sample: '张三', output: '匿名_0284' },
  { key: 'rewrite', name: '重写', desc: '正则表达式规则化改写', sample: 'abc-12345', output: 'bcd-23456' },
  { key: 'limitRows', name: '限制返回行数', desc: '仅返回前 N 行数据', sample: '1000行', output: '前100行' },
]

const algoMap = Object.fromEntries(algorithms.map((a) => [a.key, a]))

const algoName = (key: string) => algoMap[key]?.name ?? key

const statusTag: Record<string, 'success' | 'info' | 'danger'> = { 生效中: 'success', 草稿: 'info', 已停用: 'danger' }

type MaskingRule = {
  id: number
  name: string
  algo: string
  paramText: string
  boundFields: number
  scope: string
  status: '生效中' | '草稿' | '已停用'
  updateTime: string
}

const rules = ref<MaskingRule[]>([
  { id: 1, name: '手机号脱敏', algo: 'keep', paramText: '保留前3后4', boundFields: 18, scope: '全局生效', status: '生效中', updateTime: '2026-08-10 10:30' },
  { id: 2, name: '身份证号脱敏', algo: 'truncation', paramText: '保留前6位', boundFields: 12, scope: '全局生效', status: '生效中', updateTime: '2026-08-09 16:20' },
  { id: 3, name: '姓名脱敏（掩码）', algo: 'masking', paramText: '全遮盖', boundFields: 15, scope: '指定服务', status: '生效中', updateTime: '2026-08-08 09:10' },
  { id: 4, name: '银行卡号脱敏', algo: 'keep', paramText: '保留前4后4', boundFields: 8, scope: '全局生效', status: '生效中', updateTime: '2026-08-07 14:45' },
  { id: 5, name: '邮箱地址脱敏', algo: 'replace', paramText: '本地部位置换', boundFields: 9, scope: '指定应用', status: '生效中', updateTime: '2026-08-06 11:00' },
  { id: 6, name: '地址信息脱敏', algo: 'rewrite', paramText: '正则仅保留区级', boundFields: 7, scope: '指定服务', status: '生效中', updateTime: '2026-08-05 15:30' },
  { id: 7, name: '出生日期偏移', algo: 'dateOffset', paramText: '按月取整', boundFields: 5, scope: '全局生效', status: '生效中', updateTime: '2026-08-04 10:20' },
  { id: 8, name: '支付宝账户脱敏', algo: 'hash', paramText: 'SHA-256 加盐', boundFields: 6, scope: '全局生效', status: '草稿', updateTime: '2026-08-11 09:12' },
  { id: 9, name: '飞行常客号', algo: 'permute', paramText: '字典置换', boundFields: 6, scope: '指定应用', status: '已停用', updateTime: '2026-07-28 17:40' },
])

const ruleKeyword = ref('')
const ruleAlgo = ref('')
const ruleStatus = ref('')

const filteredRules = computed(() =>
  rules.value.filter((r) => {
    if (ruleAlgo.value && r.algo !== ruleAlgo.value) return false
    if (ruleStatus.value && r.status !== ruleStatus.value) return false
    if (!ruleKeyword.value) return true
    return r.name.toLowerCase().includes(ruleKeyword.value.toLowerCase())
  }),
)

const createVisible = ref(false)
const editingRule = ref<MaskingRule | null>(null)
const ruleForm = ref({ name: '', algo: 'keep', scope: '全局生效', keep: 3, salt: '' })
const tryValue = ref('13812345678')
const currentAlgo = computed(() => algoMap[ruleForm.value.algo])
const algoParamsVisible = computed(() => ['keep', 'truncation', 'hash'].includes(ruleForm.value.algo))

const tryResult = computed(() => {
  const v = tryValue.value || currentAlgo.value?.sample || ''
  switch (ruleForm.value.algo) {
    case 'keep': {
      const k = Math.min(ruleForm.value.keep || 3, v.length - 1)
      return v.length <= ruleForm.value.keep * 2 ? '***'.repeat(Math.max(1, v.length)) : `${v.slice(0, k)}${'*'.repeat(Math.max(4, v.length - k * 2))}${v.slice(-k)}`
    }
    case 'masking':
      return '*'.repeat(Math.min(6, Math.max(3, v.length)))
    case 'truncation':
      return v.length > 6 ? `${v.slice(0, 6)}${'*'.repeat(v.length - 6)}` : v
    case 'hash':
      return '<哈希密文-不可逆>'
    case 'encrypt':
      return '<AES-256 密文>'
    case 'dateOffset':
      return v.replace(/-\d{2}$/, '-01')
    case 'replace':
      return `★${v}`
    case 'shuffle':
      return '（列内随机置换值）'
    case 'permute':
      return '匿名_0284'
    case 'rewrite':
      return v.replace(/[a-y]/g, (c) => String.fromCharCode(c.charCodeAt(0) + 1))
    case 'limitRows':
      return '（仅返回前 N 行）'
    default:
      return v
  }
})

const onAlgoChange = () => {
  tryValue.value = currentAlgo.value?.sample ?? ''
}

const openCreate = () => {
  editingRule.value = null
  ruleForm.value = { name: '', algo: 'keep', scope: '全局生效', keep: 3, salt: '' }
  tryValue.value = algorithms[7].sample
  createVisible.value = true
}

const editRule = (row: MaskingRule) => {
  editingRule.value = row
  ruleForm.value = { name: row.name, algo: row.algo, scope: row.scope, keep: 3, salt: '' }
  createVisible.value = true
}

const saveRule = (enabled: boolean) => {
  if (!ruleForm.value.name.trim()) {
    ElMessage.warning('请填写规则名称')
    return
  }
  ElMessage.success(enabled ? `脱敏规则「${ruleForm.value.name}」已启用并生效验证通过（Mock）` : '脱敏规则已保存为草稿（Mock）')
  createVisible.value = false
}

const testRule = (row: MaskingRule) => {
  ElMessage.success(`「${row.name}」试算预览：${algoName(row.algo)} 算法输出正常（Mock），点击新建弹窗可手动试算`)
}

const toggleRule = (row: MaskingRule) => {
  row.status = row.status === '生效中' ? '已停用' : '生效中'
  ElMessage.success(`「${row.name}」已${row.status}`)
}

type SensitiveField = {
  id: number
  table: string
  field: string
  classified: string
  source: string
  rule: string
  detectTime?: string
  risk?: '高' | '中'
}

const fields = ref<SensitiveField[]>([
  { id: 1, table: 'ticket_sale', field: 'id_card', classified: '证件信息', source: '特征识别', rule: '' },
  { id: 2, table: 'ticket_sale', field: 'phone', classified: '个人信息/敏感', source: '分类分级', rule: '手机号脱敏' },
  { id: 3, table: 'passenger_info', field: 'name', classified: '个人信息/敏感', source: '特征识别', rule: '姓名脱敏（掩码）' },
  { id: 4, table: 'payment_record', field: 'bank_no', classified: '金融信息', source: '分类分级', rule: '银行卡号脱敏' },
  { id: 5, table: 'passenger_info', field: 'email', classified: '个人信息/敏感', source: '特征识别', rule: '' },
  { id: 6, table: 'payment_record', field: 'owner_name', classified: '个人信息/敏感', source: '分类分级', rule: '姓名脱敏（掩码）' },
  { id: 7, table: 'ticket_sale', field: 'address', classified: '个人信息/敏感', source: '特征识别', rule: '地址信息脱敏' },
  { id: 8, table: 'staff_info', field: 'salary', classified: '金融信息', source: '分类分级', rule: '' },
  { id: 9, table: 'passenger_info', field: 'birthday', classified: '个人信息/敏感', source: '分类分级', rule: '出生日期偏移' },
  { id: 10, table: 'ticket_sale', field: 'alipay_no', classified: '金融信息', source: '特征识别', rule: '' },
])

const bindClass = ref('')
const bindStatus = ref('')
const selection = ref<SensitiveField[]>([])

const onSelectionChange = (rows: SensitiveField[]) => {
  selection.value = rows
}

const filteredFields = computed(() =>
  fields.value.filter((f) => {
    if (bindClass.value && f.classified !== bindClass.value) return false
    if (bindStatus.value === '已绑定' && !f.rule) return false
    if (bindStatus.value === '未绑定' && f.rule) return false
    return true
  }),
)

const batchVisible = ref(false)
const batchRule = ref('')

const openBatchBind = () => {
  batchRule.value = ''
  batchVisible.value = true
}

const saveBatchBind = () => {
  if (!batchRule.value) return
  selection.value.forEach((f) => (f.rule = batchRule.value))
  ElMessage.success(`已为 ${selection.value.length} 个敏感字段批量绑定「${batchRule.value}」（Mock）`)
  batchVisible.value = false
}

const bindBatch = (action: string) => {
  selection.value.forEach((f) => (f.rule = ''))
  ElMessage.success(`已${action} ${selection.value.length} 个字段的绑定（Mock）`)
}

const unmaskedFields = computed(() =>
  fields.value.filter((f) => !f.rule).map((f) => ({ ...f, detectTime: '2026-08-12 08:00', risk: f.classified === '金融信息' ? '高' : '中' })),
)

const quickBind = (row: SensitiveField) => {
  const target = fields.value.find((f) => f.id === row.id)
  if (target) target.rule = row.classified === '证件信息' ? '身份证号脱敏' : '手机号脱敏'
  ElMessage.success(`已为「${row.table}.${row.field}」绑定默认规则（Mock）`)
}

const viewField = (row: SensitiveField) => {
  ElMessage.info(`已忽略「${row.table}.${row.field}」，可在规则列表操作中重新绑定`)
}

const auditType = ref('all')

const allAudits = [
  { time: '2026-08-12 09:32', operator: '安全管理员', type: '生效', content: '手机号脱敏规则在 8 个数据服务上生效验证通过', result: '成功' },
  { time: '2026-08-12 09:18', operator: '数据治理员', type: '绑定', content: '批量绑定 5 个敏感字段至 银行卡号脱敏', result: '成功' },
  { time: '2026-08-11 17:02', operator: '安全管理员', type: '密钥', content: '主密钥 KEY-DSM-2026-01 轮换完成，新旧密钥双活', result: '成功' },
  { time: '2026-08-11 15:40', operator: '数据治理员', type: '绑定', content: '字段 ticket_sale.address 绑定 地址信息脱敏', result: '成功' },
  { time: '2026-08-11 10:12', operator: '系统管理员', type: '密钥', content: '密钥 KEY-UDF-2025-09 到期销毁，相关密文已迁移', result: '成功' },
  { time: '2026-08-10 16:08', operator: '数据治理员', type: '生效', content: '姓名脱敏（掩码）在指定服务范围生效验证失败，已回滚', result: '失败' },
]

const auditLogs = computed(() => (auditType.value === 'all' ? allAudits : allAudits.filter((a) => a.type === auditType.value)))
</script>

<style lang="scss" scoped>
.masking-page {
  height: 100%;
  overflow-y: auto;
}

.mask-stats {
  display: flex;
  gap: 12px;
}

.mask-stat {
  flex: 1;
  border-radius: 8px;
  border: 1px solid #edf0f5;
  padding: 12px 14px;
  text-align: center;
}

.mask-stat-value {
  font-size: 22px;
  font-weight: 700;
  line-height: 1.2;
}

.mask-stat-label {
  margin-top: 4px;
  font-size: 12px;
  opacity: 0.9;
}

.mask-tabs {
  :deep(.el-tabs__item) {
    font-weight: 600;
  }
}

.toolbar-row {
  position: relative;
}

.toolbar-right {
  margin-left: auto;
  display: flex;
  gap: 8px;
}

.filter-select-lg {
  width: 190px;
}

.algo-panel {
  margin-bottom: 14px;
  padding: 10px 12px;
  border-radius: 8px;
  background: rgba(218, 37, 29, 0.05);
  border: 1px solid rgba(218, 37, 29, 0.12);
}

.algo-desc {
  color: #4a4a4a;
  font-size: 12px;
  line-height: 1.7;
}

.try-row {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
}

.try-input {
  width: 280px;
}

.try-arrow {
  color: #8c8c8c;
}

.try-output {
  padding: 6px 10px;
  background: #2d2f33;
  color: #d9e0ea;
  border-radius: 6px;
  font-size: 12px;
  min-width: 220px;
}

.batch-info {
  color: #4a4a4a;
  font-size: 13px;
}

.audit-success {
  color: #00a854;
  font-weight: 600;
}

.audit-fail {
  color: #e34d59;
  font-weight: 600;
}
</style>