<template>
  <div class="standard-page share-register-page">
    <div class="share-stats">
      <div v-for="s in statsCards" :key="s.label" class="share-stat" :style="{ background: s.bg, color: s.color }">
        <div class="share-stat-value">{{ s.value }}</div>
        <div class="share-stat-label">{{ s.label }}</div>
      </div>
    </div>

    <el-row :gutter="16">
      <el-col :span="15">
        <el-card class="panel-card" shadow="never">
          <template #header>
            <div class="panel-header">
              <span>数据服务注册向导</span>
              <div class="panel-actions">
                <el-tag type="danger" effect="plain">当前步骤：{{ stepTitles[activeStep] }}</el-tag>
              </div>
            </div>
          </template>

          <el-steps :active="activeStep" align-center class="register-steps mt-12">
            <el-step title="选择资产" description="选择待封装的数据资产" />
            <el-step title="服务配置" description="入参 / 出参 / 自定义SQL" />
            <el-step title="预览发布" description="生成API文档并提交" />
          </el-steps>

          <!-- Step 0：选择资产 -->
          <div v-show="activeStep === 0" class="asset-step">
            <el-radio-group v-model="assetType" class="asset-type-tabs">
              <el-radio-button value="table">数据表</el-radio-button>
              <el-radio-button value="api">API 接口</el-radio-button>
              <el-radio-button value="qa">知识问答</el-radio-button>
            </el-radio-group>

            <el-table
              :data="filteredAssets"
              height="300"
              size="small"
              highlight-current-row
              @current-change="selectAsset"
            >
              <el-table-column prop="name" label="资产名称" min-width="180" />
              <el-table-column prop="source" label="来源" width="150" />
              <el-table-column prop="level" label="级别" width="70" align="center">
                <template #default="{ row }">
                  <span class="level-badge" :style="{ background: levelColor[row.level] }">{{ row.level }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="classified" label="分类分级" width="110" />
              <el-table-column prop="fields" label="字段数" width="70" align="center" />
            </el-table>

            <el-alert type="info" :closable="false" show-icon class="asset-tip">
              <template #title>
                封装类型：将所选数据资产封装为标准 RESTful API 服务；L3/L4 级资产发布后需启用调用鉴权与限流。
              </template>
            </el-alert>
          </div>

          <!-- Step 1：服务配置 -->
          <div v-show="activeStep === 1" class="config-step">
            <div class="rule-section-title">服务基本信息</div>
            <el-row :gutter="12">
              <el-col :span="8">
                <el-form-item label="服务名称">
                  <el-input v-model="serviceForm.name" placeholder="如：客流统计查询服务" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="服务路径">
                  <el-input v-model="serviceForm.path" placeholder="/api/v1/flow/stat" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="请求方式">
                  <el-select v-model="serviceForm.method" class="w-full">
                    <el-option label="GET" value="GET" />
                    <el-option label="POST" value="POST" />
                    <el-option label="PUT" value="PUT" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="所属业务域">
                  <el-select v-model="serviceForm.domain" class="w-full">
                    <el-option v-for="d in domainOptions" :key="d" :label="d" :value="d" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="服务类型">
                  <el-select v-model="serviceForm.kind" class="w-full">
                    <el-option label="实时查询" value="实时查询" />
                    <el-option label="指标计算" value="指标计算" />
                    <el-option label="数据抽取" value="数据抽取" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="接入鉴权">
                  <el-switch v-model="serviceForm.auth" active-text="启用" inactive-text="停用" />
                </el-form-item>
              </el-col>
            </el-row>

            <div class="rule-section-title">入参配置（{{ serviceForm.params.length }}）</div>
            <el-table :data="serviceForm.params" size="small" border>
              <el-table-column label="参数名" min-width="120">
                <template #default="{ row }">
                  <el-input v-model="row.name" size="small" placeholder="如 line_code" />
                </template>
              </el-table-column>
              <el-table-column label="类型" width="110">
                <template #default="{ row }">
                  <el-select v-model="row.type" size="small" class="w-full">
                    <el-option v-for="t in typeOptions" :key="t" :label="t" :value="t" />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="必填" width="70" align="center">
                <template #default="{ row }">
                  <el-switch v-model="row.required" size="small" />
                </template>
              </el-table-column>
              <el-table-column label="说明" min-width="140">
                <template #default="{ row }">
                  <el-input v-model="row.desc" size="small" placeholder="参数说明" />
                </template>
              </el-table-column>
              <el-table-column label="操作" width="56" align="center">
                <template #default="{ $index }">
                  <el-button type="danger" link :icon="Delete" @click="serviceForm.params.splice($index, 1)" />
                </template>
              </el-table-column>
            </el-table>
            <div class="form-actions">
              <el-button size="small" type="primary" plain :icon="Plus" @click="addParam(false)">添加入参</el-button>
            </div>

            <div class="rule-section-title">出参配置（{{ serviceForm.outputs.length }}）</div>
            <el-table :data="serviceForm.outputs" size="small" border>
              <el-table-column label="字段名" min-width="120">
                <template #default="{ row }">
                  <el-input v-model="row.name" size="small" placeholder="如 total_amount" />
                </template>
              </el-table-column>
              <el-table-column label="类型" width="110">
                <template #default="{ row }">
                  <el-select v-model="row.type" size="small" class="w-full">
                    <el-option v-for="t in typeOptions" :key="t" :label="t" :value="t" />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="别名" min-width="140">
                <template #default="{ row }">
                  <el-input v-model="row.alias" size="small" placeholder="返回字段别名" />
                </template>
              </el-table-column>
              <el-table-column label="操作" width="56" align="center">
                <template #default="{ $index }">
                  <el-button type="danger" link :icon="Delete" @click="serviceForm.outputs.splice($index, 1)" />
                </template>
              </el-table-column>
            </el-table>
            <div class="form-actions">
              <el-button size="small" type="primary" plain :icon="Plus" @click="addParam(true)">添加出参</el-button>
            </div>

            <el-form-item label="自定义SQL逻辑">
              <el-input
                v-model="serviceForm.sql"
                type="textarea"
                :rows="4"
                class="sql-editor"
                spellcheck="false"
                placeholder="SELECT line_code, SUM(amount) AS total_amount FROM ticket_sale WHERE line_code = #{line_code} GROUP BY line_code"
              />
            </el-form-item>
          </div>

          <!-- Step 2：预览发布 -->
          <div v-show="activeStep === 2" class="preview-step">
            <div class="api-preview">
              <div class="api-preview-row">
                <span class="api-label">调用地址</span>
                <code class="api-value">{{ baseUrl }}{{ serviceForm.path }}</code>
              </div>
              <div class="api-preview-row">
                <span class="api-label">请求方式</span>
                <el-tag size="small" type="danger" effect="dark">{{ serviceForm.method }}</el-tag>
              </div>
              <div class="api-preview-row">
                <span class="api-label">鉴权方式</span>
                <span class="dep-text">{{ serviceForm.auth ? 'AppKey/Secret + HMAC-SHA256 签名' : '免鉴权（公开服务）' }}</span>
              </div>
              <div class="api-preview-row">
                <span class="api-label">封装资产</span>
                <span class="dep-text">{{ selectedAsset?.name }}（{{ selectedAsset?.classified }}）</span>
              </div>
              <div class="api-preview-row">
                <span class="api-label">请求示例</span>
                <pre class="api-code">{{ requestSample }}</pre>
              </div>
            </div>
          </div>

          <div class="step-actions">
            <el-button v-if="activeStep > 0" @click="activeStep--">上一步</el-button>
            <el-button v-if="activeStep === 0" type="primary" :disabled="!selectedAsset" @click="activeStep++">下一步</el-button>
            <el-button v-if="activeStep === 1" type="primary" @click="validateConfig">下一步：生成预览</el-button>
            <el-button v-if="activeStep === 2" size="small" @click="saveService('草稿')">存草稿</el-button>
            <el-button v-if="activeStep === 2" type="danger" size="small" @click="saveService('待发布')">提交发布</el-button>
          </div>
        </el-card>
      </el-col>

      <el-col :span="9">
        <el-card class="panel-card" shadow="never">
          <template #header>
            <div class="panel-header">
              <span>我的服务注册记录</span>
              <div class="panel-actions">
                <el-tag size="small" type="info" effect="plain">共 {{ registrations.length }} 条</el-tag>
              </div>
            </div>
          </template>

          <div class="toolbar-row">
            <el-input v-model="regKeyword" placeholder="按服务名称 / 路径搜索" clearable class="search-input-sm" :prefix-icon="Search" />
            <el-select v-model="regStatus" placeholder="状态" clearable class="filter-select-sm">
              <el-option v-for="s in ['草稿', '待发布', '已发布', '已驳回']" :key="s" :label="s" :value="s" />
            </el-select>
          </div>

          <el-table :data="filteredRegistrations" size="small" stripe max-height="520">
            <el-table-column prop="name" label="服务名称" min-width="130" show-overflow-tooltip />
            <el-table-column prop="path" label="服务路径" min-width="150" show-overflow-tooltip />
            <el-table-column prop="asset" label="封装资产" width="90" show-overflow-tooltip />
            <el-table-column label="状态" width="80">
              <template #default="{ row }">
                <el-tag size="small" :type="regStatusTag[row.status]" effect="dark">{{ row.status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="updateTime" label="更新时间" width="100" />
            <el-table-column label="操作" width="140" fixed="right">
              <template #default="{ row }">
                <el-button link type="primary" size="small" @click="editService(row)">编辑</el-button>
                <el-button v-if="row.status === '草稿'" link type="warning" size="small" @click="submitService(row)">提交发布</el-button>
                <el-button v-else-if="row.status === '待发布'" link type="info" size="small" @click="viewDoc(row)">文档</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Delete, Plus, Search } from '@element-plus/icons-vue'

const stepTitles = ['选择资产', '服务配置', '预览发布']
const activeStep = ref(0)
const assetType = ref('table')
const baseUrl = 'https://api.gz-metro-data.cn'

const levelColor: Record<string, string> = {
  L1: '#8c8c8c',
  L2: '#2B6CB0',
  L3: '#ED7B2F',
  L4: '#DA251D',
}

const domainOptions = ['客运票务', '旅客服务', '运营调度', '财务共享', '设备运维']

const typeOptions = ['STRING', 'INT', 'BIGINT', 'DECIMAL', 'DATE', 'TIMESTAMP', 'BOOLEAN']

const statsCards = [
  { label: '已发布服务', value: '12', color: '#fff', bg: 'linear-gradient(135deg, #DA251D, #B71C1C)' },
  { label: '待发布审批', value: '3', color: '#ED7B2F', bg: 'rgba(237,123,47,.1)' },
  { label: '服务草稿', value: '5', color: '#2B6CB0', bg: 'rgba(43,108,176,.1)' },
  { label: '本周新增', value: '4', color: '#00A854', bg: 'rgba(0,168,84,.1)' },
]

const assetPool = [
  { name: 'ticket_sale', source: '票务运营库', level: 'L3', classified: '个人信息/敏感', fields: 12 },
  { name: 'dws_order_report', source: '数据仓库DWS', level: 'L2', classified: '经营数据/内部', fields: 8 },
  { name: 'ads_line_flow', source: '指标中台ADS', level: 'L2', classified: '交通运行/内部', fields: 7 },
  { name: 'station_info', source: '基础信息库', level: 'L1', classified: '基础信息/公开', fields: 5 },
  { name: 'line_info', source: '基础信息库', level: 'L1', classified: '基础信息/公开', fields: 4 },
  { name: '支付流水查询接口', source: '统一接口平台', level: 'L4', classified: '经营数据/核心', fields: 6 },
  { name: '乘客实名知识问答', source: '知识库', level: 'L3', classified: '个人信息/敏感', fields: 0 },
]

const filteredAssets = computed(() => {
  const typeKey = assetType.value === 'table' ? '表' : assetType.value === 'api' ? '接口' : '问答'
  if (assetType.value === 'table') return assetPool.filter((a) => !a.name.includes('接口') && !a.name.includes('问答'))
  if (assetType.value === 'api') return assetPool.filter((a) => a.name.includes('接口'))
  return assetPool.filter((a) => a.name.includes('问答'))
})

const selectedAsset = ref<(typeof assetPool)[number] | null>(null)

const selectAsset = (row: (typeof assetPool)[number] | null) => {
  selectedAsset.value = row
}

const serviceForm = ref({
  name: '',
  path: '',
  method: 'GET',
  domain: '客运票务',
  kind: '实时查询',
  auth: true,
  sql: '',
  params: [
    { name: 'line_code', type: 'STRING', required: true, desc: '线路编码' },
    { name: 'begin_date', type: 'DATE', required: false, desc: '开始日期' },
  ],
  outputs: [
    { name: 'line_code', type: 'STRING', alias: 'lineCode' },
    { name: 'total_amount', type: 'DECIMAL', alias: 'totalAmount' },
  ],
})

const addParam = (isOutput: boolean) => {
  if (isOutput) serviceForm.value.outputs.push({ name: '', type: 'STRING', alias: '' })
  else serviceForm.value.params.push({ name: '', type: 'STRING', required: false, desc: '' })
}

const requestSample = computed(() =>
  JSON.stringify(
    {
      url: `/api/v1/flow/stat`,
      method: serviceForm.value.method,
      headers: { 'X-AppKey': 'Zx9k...ab3c', 'X-Timestamp': '2026-08-13 10:00:00', 'X-Signature': 'HMAC-SHA256(...)' },
      body: serviceForm.value.params.reduce<Record<string, unknown>>((acc, p) => ({ ...acc, [p.name]: p.name === 'line_code' ? 'GZ-L1' : '2026-08-01' }), {}),
    },
    null,
    2,
  ),
)

const validateConfig = () => {
  if (!serviceForm.value.name.trim()) {
    ElMessage.warning('请填写服务名称')
    return
  }
  if (!serviceForm.value.path.trim().startsWith('/')) {
    ElMessage.warning('服务路径需以 / 开头')
    return
  }
  if (!serviceForm.value.sql.trim()) {
    ElMessage.warning('请填写自定义 SQL 逻辑')
    return
  }
  activeStep.value++
}

type Registration = {
  name: string
  path: string
  asset: string
  status: '草稿' | '待发布' | '已发布' | '已驳回'
  updateTime: string
}

const regStatusTag: Record<string, 'info' | 'warning' | 'success' | 'danger'> = {
  草稿: 'info',
  待发布: 'warning',
  已发布: 'success',
  已驳回: 'danger',
}

const registrations = ref<Registration[]>([
  { name: '客流统计查询服务', path: '/api/v1/flow/stat', asset: 'ads_line_flow', status: '已发布', updateTime: '2026-08-11 14:20' },
  { name: '线路基础信息服务', path: '/api/v1/line/detail', asset: 'line_info', status: '已发布', updateTime: '2026-08-09 09:10' },
  { name: '售票明细查询服务', path: '/api/v1/ticket/query', asset: 'ticket_sale', status: '待发布', updateTime: '2026-08-12 16:40' },
  { name: '车站信息同步服务', path: '/api/v1/station/list', asset: 'station_info', status: '草稿', updateTime: '2026-08-12 11:05' },
  { name: '订单汇总指标服务', path: '/api/v1/order/summary', asset: 'dws_order_report', status: '已驳回', updateTime: '2026-08-06 10:30' },
])

const regKeyword = ref('')
const regStatus = ref('')

const filteredRegistrations = computed(() =>
  registrations.value.filter((r) => {
    if (regStatus.value && r.status !== regStatus.value) return false
    if (!regKeyword.value) return true
    const kw = regKeyword.value.toLowerCase()
    return r.name.toLowerCase().includes(kw) || r.path.toLowerCase().includes(kw)
  }),
)

const saveService = (status: '草稿' | '待发布') => {
  if (!serviceForm.value.name.trim()) {
    ElMessage.warning('请填写服务名称')
    return
  }
  registrations.value.unshift({
    name: serviceForm.value.name,
    path: serviceForm.value.path,
    asset: selectedAsset.value?.name ?? '—',
    status,
    updateTime: new Date().toLocaleString('sv-SE').replace('T', ' '),
  })
  ElMessage.success(status === '草稿' ? '服务配置已保存为草稿' : '服务已提交发布审批（Mock）')
  activeStep.value = 0
  serviceForm.value = { ...serviceForm.value, name: '', path: '', sql: '' }
}

const editService = (row: Registration) => {
  serviceForm.value.name = row.name
  serviceForm.value.path = row.path
  activeStep.value = 1
  ElMessage.info('已载入服务配置，可编辑后重新保存（Mock）')
}

const submitService = (row: Registration) => {
  row.status = '待发布'
  ElMessage.success(`「${row.name}」已提交发布审批（Mock）`)
}

const viewDoc = (row: Registration) => {
  ElMessage.info(`生成 API 文档：${baseUrl}${row.path}（Mock）`)
}
</script>

<style lang="scss" scoped>
.share-register-page {
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;

  :deep(.el-col) {
    height: 100%;
  }
}

.share-stats {
  display: flex;
  gap: 12px;
}

.share-stat {
  flex: 1;
  border-radius: 8px;
  border: 1px solid #edf0f5;
  padding: 12px 14px;
  text-align: center;
}

.share-stat-value {
  font-size: 22px;
  font-weight: 700;
  line-height: 1.2;
}

.share-stat-label {
  margin-top: 4px;
  font-size: 12px;
  opacity: 0.9;
}

.asset-step,
.config-step,
.preview-step {
  min-height: 440px;
  padding-top: 12px;
}

.asset-type-tabs {
  margin-bottom: 10px;
}

.asset-tip {
  margin-top: 10px;
}

.rule-section-title {
  font-size: 13px;
  font-weight: 700;
  color: #4a4a4a;
  border-left: 3px solid #da251d;
  padding-left: 8px;
  margin: 0 0 10px;

  &:not(:first-child) {
    margin-top: 14px;
  }
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin: 6px 0 4px;
}

.api-preview {
  display: grid;
  gap: 10px;
}

.api-preview-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.api-label {
  width: 76px;
  flex: none;
  color: #8c8c8c;
  font-size: 12px;
}

.api-value {
  color: #da251d;
  font-size: 13px;
  word-break: break-all;
}

.api-code {
  flex: 1;
  margin: 0;
  padding: 12px;
  background: #2d2f33;
  color: #d9e0ea;
  border-radius: 6px;
  font-size: 12px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-all;
}

.step-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 14px;
  border-top: 1px solid #edf0f5;
}

.search-input-sm {
  width: 170px;
}

.filter-select-sm {
  width: 110px;
}
</style>