<template>
  <div class="standard-page share-publish-page">
    <div class="pub-stats">
      <div v-for="s in statsCards" :key="s.label" class="pub-stat" :style="{ background: s.bg, color: s.color }">
        <div class="pub-stat-value">{{ s.value }}</div>
        <div class="pub-stat-label">{{ s.label }}</div>
      </div>
    </div>

    <el-row :gutter="16">
      <el-col :span="9">
        <el-card class="panel-card pub-card" shadow="never">
          <template #header>
            <div class="panel-header">
              <span>服务发布申请</span>
              <div class="panel-actions">
                <el-tag size="small" type="info" effect="plain">共 {{ filteredPendings.length }} 条</el-tag>
              </div>
            </div>
          </template>

          <div class="toolbar-row">
            <el-input v-model="pubKeyword" placeholder="按服务名称 / 单号搜索" clearable class="search-input-sm w-full" :prefix-icon="Search" />
          </div>

          <el-table
            :data="filteredPendings"
            size="small"
            highlight-current-row
            height="470"
            :current-row-key="currentPubId"
            @current-change="selectPub"
          >
            <el-table-column prop="id" label="申请单号" width="110" />
            <el-table-column prop="serviceName" label="服务名称" min-width="130" show-overflow-tooltip />
            <el-table-column label="状态" width="80">
              <template #default="{ row }">
                <el-tag size="small" :type="stageTag[row.stage]" effect="dark">{{ row.stage }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="applicant" label="申请人" width="64" />
            <el-table-column prop="applyTime" label="申请时间" width="106" />
          </el-table>
        </el-card>
      </el-col>

      <el-col :span="15">
        <el-card class="panel-card pub-card" shadow="never">
          <template #header>
            <div class="panel-header">
              <span>发布审批详情</span>
              <div class="panel-actions">
                <el-button size="small" plain :icon="DocumentCopy" :disabled="!currentPub" @click="genDoc(currentPub)">生成API文档</el-button>
              </div>
            </div>
          </template>

          <template v-if="currentPub">
            <el-descriptions :column="3" border size="small">
              <el-descriptions-item label="服务名称">{{ currentPub.serviceName }}</el-descriptions-item>
              <el-descriptions-item label="申请单号">{{ currentPub.id }}</el-descriptions-item>
              <el-descriptions-item label="申请人">{{ currentPub.applicant }}</el-descriptions-item>
              <el-descriptions-item label="服务路径">{{ currentPub.path }}</el-descriptions-item>
              <el-descriptions-item label="请求方式">{{ currentPub.method }}</el-descriptions-item>
              <el-descriptions-item label="接入鉴权">{{ currentPub.auth ? '启用' : '停用' }}</el-descriptions-item>
              <el-descriptions-item label="封装资产" :span="2">{{ currentPub.asset }}</el-descriptions-item>
              <el-descriptions-item label="风险等级">
                <span class="security-level" :style="{ background: levelColor[currentPub.level] }">{{ currentPub.level }}</span>
              </el-descriptions-item>
            </el-descriptions>

            <div class="block-title">入参定义</div>
            <el-table :data="currentPub.params" size="mini" border>
              <el-table-column prop="name" label="参数名" min-width="110" />
              <el-table-column prop="type" label="类型" width="90" />
              <el-table-column label="必填" width="60" align="center">
                <template #default="{ row }">
                  <el-tag size="small" :type="row.required ? 'danger' : 'info'" effect="plain">{{ row.required ? '是' : '否' }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="desc" label="说明" min-width="120" />
            </el-table>

            <div class="block-title">出参定义</div>
            <el-table :data="currentPub.outputs" size="mini" border>
              <el-table-column prop="name" label="字段名" min-width="110" />
              <el-table-column prop="type" label="类型" width="90" />
              <el-table-column prop="alias" label="返回别名" min-width="110" />
            </el-table>

            <div class="block-title">自定义 SQL</div>
            <pre class="pub-sql">{{ currentPub.sql }}</pre>

            <div class="pub-approve">
              <el-form label-width="80px" class="pub-form">
                <el-form-item label="审批意见">
                  <el-input v-model="approveComment" type="textarea" :rows="3" placeholder="填写审批意见（必填）" />
                </el-form-item>
              </el-form>
              <div class="pub-actions">
                <el-button type="danger" :disabled="!approveComment.trim()" @click="doApprove(false)">驳回发布</el-button>
                <el-button type="primary" :disabled="!approveComment.trim()" @click="doApprove(true)">审批通过并发布</el-button>
              </div>
            </div>
          </template>

          <el-empty v-else description="请从左侧选择一条发布申请进行审批" />
        </el-card>
      </el-col>
    </el-row>

    <el-dialog v-model="docVisible" title="API 文档生成" width="720px">
      <template v-if="docTarget">
        <div class="doc-call">
          <span class="dep-text">正式调用地址</span>
          <code class="doc-endpoint">{{ docBaseUrl }}{{ docTarget.path }}</code>
        </div>
        <div class="doc-rows">
          <el-tag v-for="(p, i) in docTarget.params" :key="i" size="small" effect="plain" class="doc-param">
            {{ p.name }}<span class="doc-type">:{{ p.type }}</span>
          </el-tag>
          <el-tag type="success" size="small" effect="plain" class="doc-param">AppKey 签名鉴权</el-tag>
          <el-tag type="warning" size="small" effect="plain" class="doc-param">限流 100 次/分钟</el-tag>
        </div>
        <pre class="api-code">{{ docSample }}</pre>
      </template>
      <template #footer>
        <el-button @click="docVisible = false">关闭</el-button>
        <el-button type="primary" @click="downloadDoc">下载文档</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { DocumentCopy, Search } from '@element-plus/icons-vue'

const docBaseUrl = 'https://api.gz-metro-data.cn'
const levelColor: Record<string, string> = { L1: '#8c8c8c', L2: '#2B6CB0', L3: '#ED7B2F', L4: '#DA251D' }

const statsCards = [
  { label: '待审批申请', value: '3', color: '#fff', bg: 'linear-gradient(135deg, #DA251D, #B71C1C)' },
  { label: '本月已发布', value: '5', color: '#00A854', bg: 'rgba(0,168,84,.1)' },
  { label: '本月已驳回', value: '2', color: '#8c8c8c', bg: 'rgba(140,140,140,.1)' },
  { label: '平均审批时长', value: '1.5h', color: '#ED7B2F', bg: 'rgba(237,123,47,.1)' },
]

type PublishApply = {
  id: string
  serviceName: string
  path: string
  method: string
  auth: boolean
  asset: string
  level: string
  stage: '待审批' | '已通过' | '已驳回'
  applicant: string
  applyTime: string
  approveTime?: string
  comment?: string
  params: { name: string; type: string; required: boolean; desc: string }[]
  outputs: { name: string; type: string; alias: string }[]
  sql: string
}

const stageTag: Record<string, 'warning' | 'success' | 'danger'> = { 待审批: 'warning', 已通过: 'success', 已驳回: 'danger' }

const pendings = ref<PublishApply[]>([
  {
    id: 'PUB-2026-018',
    serviceName: '售票明细查询服务',
    path: '/api/v1/ticket/query',
    method: 'POST',
    auth: true,
    asset: 'ticket_sale',
    level: 'L3',
    stage: '待审批',
    applicant: '张工',
    applyTime: '2026-08-12 16:40',
    params: [
      { name: 'begin_date', type: 'DATE', required: true, desc: '查询开始日期' },
      { name: 'end_date', type: 'DATE', required: true, desc: '查询结束日期' },
      { name: 'ticket_type', type: 'STRING', required: false, desc: '客票类型过滤' },
    ],
    outputs: [
      { name: 'order_id', type: 'STRING', alias: 'orderId' },
      { name: 'amount', type: 'DECIMAL', alias: 'amount' },
      { name: 'sale_time', type: 'TIMESTAMP', alias: 'saleTime' },
    ],
    sql: 'SELECT order_id, amount, sale_time FROM ticket_sale WHERE sale_time >= #{begin_date} AND sale_time <= #{end_date} /* AND ticket_type = #{ticket_type} */',
  },
  {
    id: 'PUB-2026-017',
    serviceName: '订单汇总指标服务',
    path: '/api/v1/order/summary',
    method: 'GET',
    auth: true,
    asset: 'dws_order_report',
    level: 'L2',
    stage: '待审批',
    applicant: '李工',
    applyTime: '2026-08-12 15:10',
    params: [{ name: 'line_code', type: 'STRING', required: true, desc: '线路编码' }],
    outputs: [
      { name: 'total_amount', type: 'DECIMAL', alias: 'totalAmount' },
      { name: 'order_count', type: 'INT', alias: 'orderCount' },
    ],
    sql: 'SELECT SUM(total_amount) AS total_amount, SUM(order_count) AS order_count FROM dws_order_report WHERE line_code = #{line_code}',
  },
  {
    id: 'PUB-2026-016',
    serviceName: '乘客信息批量导出服务',
    path: '/api/v1/passenger/export',
    method: 'GET',
    auth: false,
    asset: 'passenger_info',
    level: 'L3',
    stage: '待审批',
    applicant: '王工',
    applyTime: '2026-08-11 09:30',
    params: [{ name: 'page', type: 'INT', required: false, desc: '页码' }],
    outputs: [
      { name: 'passenger_name', type: 'STRING', alias: 'name' },
      { name: 'phone', type: 'STRING', alias: 'phone' },
    ],
    sql: 'SELECT passenger_name, phone FROM passenger_info LIMIT 1000',
  },
  {
    id: 'PUB-2026-014',
    serviceName: '线路基础信息服务',
    path: '/api/v1/line/detail',
    method: 'GET',
    auth: true,
    asset: 'line_info',
    level: 'L1',
    stage: '已通过',
    applicant: '张工',
    applyTime: '2026-08-09 09:10',
    approveTime: '2026-08-09 11:00',
    comment: '基础公开数据，准予发布',
    params: [{ name: 'line_code', type: 'STRING', required: true, desc: '线路编码' }],
    outputs: [
      { name: 'line_name', type: 'STRING', alias: 'lineName' },
      { name: 'status', type: 'STRING', alias: 'status' },
    ],
    sql: 'SELECT line_name, status FROM line_info WHERE line_code = #{line_code}',
  },
])

const pubKeyword = ref('')
const currentPubId = ref('')
const currentPub = ref<PublishApply | null>(null)
const approveComment = ref('')
const docVisible = ref(false)
const docTarget = ref<PublishApply | null>(null)

const filteredPendings = computed(() =>
  pendings.value.filter((p) => {
    if (!pubKeyword.value) return true
    const kw = pubKeyword.value.toLowerCase()
    return p.serviceName.toLowerCase().includes(kw) || p.id.toLowerCase().includes(kw)
  }),
)

const selectPub = (row: PublishApply | null) => {
  currentPub.value = row
  currentPubId.value = row?.id ?? ''
  approveComment.value = ''
}

const doApprove = (pass: boolean) => {
  const p = currentPub.value
  if (!p) return
  p.stage = pass ? '已通过' : '已驳回'
  p.approveTime = new Date().toLocaleString('sv-SE').replace('T', ' ')
  p.comment = approveComment.value
  ElMessage.success(pass ? `「${p.serviceName}」审批通过，已正式发布` : `「${p.serviceName}」已驳回`)
  approveComment.value = ''
}

const genDoc = (p: PublishApply | null) => {
  if (!p) return
  docTarget.value = p
  docVisible.value = true
}

const docSample = computed(() =>
  docTarget.value
    ? JSON.stringify(
        {
          request: {
            method: docTarget.value.method,
            url: `${docBaseUrl}${docTarget.value.path}`,
            headers: { 'X-AppKey': 'Zx9k...ab3c', 'X-Timestamp': '2026-08-13 10:05:00', 'X-Signature': 'HMAC-SHA256' },
            body: docTarget.value.params.reduce<Record<string, string>>((acc, p) => ({ ...acc, [p.name]: '示例值' }), {}),
          },
          response: {
            code: 0,
            message: 'success',
            data: docTarget.value.outputs.reduce<Record<string, unknown>>((acc, o) => ({ ...acc, [o.alias || o.name]: '示例值' }), {}),
          },
        },
        null,
        2,
      )
    : '',
)

const downloadDoc = () => {
  ElMessage.success('API 文档（Markdown/Swagger）已下载（Mock）')
  docVisible.value = false
}
</script>

<style lang="scss" scoped>
.share-publish-page {
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;

  :deep(.el-col) {
    height: 100%;
  }
}

.pub-stats {
  display: flex;
  gap: 12px;
}

.pub-stat {
  flex: 1;
  border-radius: 8px;
  border: 1px solid #edf0f5;
  padding: 12px 14px;
  text-align: center;
}

.pub-stat-value {
  font-size: 22px;
  font-weight: 700;
  line-height: 1.2;
}

.pub-stat-label {
  margin-top: 4px;
  font-size: 12px;
  opacity: 0.9;
}

.pub-card {
  height: calc(100vh - 240px);
  display: flex;
  flex-direction: column;

  :deep(.el-card__body) {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  :deep(.el-table) {
    flex: 1;
    min-height: 0;
  }
}

.block-title {
  font-size: 13px;
  font-weight: 700;
  color: #4a4a4a;
  margin: 14px 0 8px;
}

.pub-sql {
  margin: 0;
  padding: 12px;
  background: #f7f8fa;
  border: 1px dashed #e4e7ed;
  border-radius: 6px;
  font-size: 12px;
  line-height: 1.7;
  color: #4a4a4a;
  white-space: pre-wrap;
  word-break: break-all;
}

.pub-approve {
  margin-top: 14px;
  padding-top: 4px;
}

.pub-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.doc-call {
  display: flex;
  align-items: center;
  gap: 12px;
}

.doc-endpoint {
  color: #da251d;
  font-size: 14px;
  word-break: break-all;
}

.doc-rows {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 14px 0;
}

.doc-param .doc-type {
  color: #8c8c8c;
  margin-left: 2px;
}

.api-code {
  margin: 0;
  padding: 12px;
  background: #2d2f33;
  color: #d9e0ea;
  border-radius: 6px;
  font-size: 12px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-all;
  max-height: 340px;
  overflow-y: auto;
}
</style>