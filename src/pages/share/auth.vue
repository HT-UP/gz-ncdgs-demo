<template>
  <div class="standard-page share-auth-page">
    <div class="auth-stats">
      <div v-for="s in statsCards" :key="s.label" class="auth-stat" :style="{ background: s.bg, color: s.color }">
        <div class="auth-stat-value">{{ s.value }}</div>
        <div class="auth-stat-label">{{ s.label }}</div>
      </div>
    </div>

    <el-row :gutter="16">
      <el-col :span="16">
        <el-card class="panel-card auth-card" shadow="never">
          <template #header>
            <div class="panel-header">
              <span>调用应用与凭证管理</span>
              <div class="panel-actions">
                <el-button type="danger" size="small" :icon="Plus" @click="openCreate">新建调用应用</el-button>
              </div>
            </div>
          </template>

          <div class="toolbar-row">
            <el-input v-model="appKeyword" placeholder="按应用名称 / AppKey 搜索" clearable class="search-input" :prefix-icon="Search" />
            <el-select v-model="appStatus" placeholder="状态" clearable class="filter-select">
              <el-option label="启用" value="启用" />
              <el-option label="停用" value="停用" />
            </el-select>
          </div>

          <el-table :data="filteredApps" stripe>
            <el-table-column prop="name" label="应用名称" min-width="140" />
            <el-table-column label="AppKey" width="150">
              <template #default="{ row }">
                <code class="key-visible">{{ maskKey(row.appKey) }}</code>
              </template>
            </el-table-column>
            <el-table-column label="Secret" width="120">
              <template #default="{ row }">
                <el-tooltip :content="row.secret" placement="top">
                  <code class="key-masked">••••••••{{ row.secret.slice(-4) }}</code>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="限流（频率/并发）" width="130">
              <template #default="{ row }">
                <span class="dep-text">{{ row.rate }}/{{ row.concurrent }}</span>
              </template>
            </el-table-column>
            <el-table-column label="状态" width="70">
              <template #default="{ row }">
                <el-tag size="small" :type="row.status === '启用' ? 'success' : 'info'" effect="dark">{{ row.status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="owner" label="负责人" width="72" />
            <el-table-column prop="createTime" label="创建时间" width="100" />
            <el-table-column label="操作" width="190" fixed="right">
              <template #default="{ row }">
                <el-button link type="primary" size="small" @click="rotateKey(row)">重置Secret</el-button>
                <el-button link type="warning" size="small" @click="toggleApp(row)">{{ row.status === '启用' ? '停用' : '启用' }}</el-button>
                <el-button link type="danger" size="small" @click="deleteApp(row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card class="panel-card" shadow="never">
          <template #header>
            <div class="panel-header"><span>签名鉴权说明（HMAC-SHA256）</span></div>
          </template>
          <el-steps direction="vertical" :active="4" class="sign-steps">
            <el-step title="构造待签字符串" description="method\npath\nX-Timestamp\nX-Nonce\n参数规范化后拼接" />
            <el-step title="计算签名" description="Base64(HMAC-SHA256(Secret, content))" />
            <el-step title="携带请求头" description="X-AppKey / X-Timestamp / X-Nonce / X-Signature" />
            <el-step title="网关校验" description="时间戳 ±5min、Nonce 防重放、签名一致校验" />
          </el-steps>
          <div class="sign-note">
            生产环境建议每小时轮换 Secret，通知期内新旧 Secret 双活校验，避免调用中断。
          </div>
        </el-card>

        <el-card class="panel-card mt-16" shadow="never">
          <template #header>
            <div class="panel-header"><span>限流策略参考</span></div>
          </template>
          <div v-for="r in ratePolicy" :key="r.name" class="rate-item">
            <div class="rate-item-name">{{ r.name }}</div>
            <div class="rate-item-desc">{{ r.desc }}</div>
            <el-tag size="small" type="warning" effect="plain">{{ r.limit }}</el-tag>
          </div>
          <el-alert type="info" :closable="false" show-icon class="mt-12">
            <template #title>触发限流返回错误码 42900 / 42901，并计入调用日志与监控看板。</template>
          </el-alert>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog v-model="createVisible" title="新建调用应用" width="520px" destroy-on-close>
      <el-form :model="createForm" label-width="96px">
        <el-form-item label="应用名称">
          <el-input v-model="createForm.name" placeholder="如：智能客流分析平台" />
        </el-form-item>
        <el-form-item label="负责人">
          <el-input v-model="createForm.owner" placeholder="负责人姓名" />
        </el-form-item>
        <el-form-item label="限流频率">
          <el-input-number v-model="createForm.rate" :min="1" :max="10000" />
          <span class="dep-text ml-4">次/分钟</span>
        </el-form-item>
        <el-form-item label="最大并发">
          <el-input-number v-model="createForm.concurrent" :min="1" :max="500" />
        </el-form-item>
        <el-form-item label="启用状态">
          <el-switch v-model="createForm.enabled" active-text="启用" inactive-text="停用" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="createVisible = false">取消</el-button>
        <el-button type="danger" @click="createApp">生成 AppKey/Secret</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search } from '@element-plus/icons-vue'

const statsCards = [
  { label: '调用应用总数', value: '8', color: '#fff', bg: 'linear-gradient(135deg, #DA251D, #B71C1C)' },
  { label: '启用凭证', value: '6', color: '#00A854', bg: 'rgba(0,168,84,.1)' },
  { label: '今日调用量', value: '86.4k', color: '#2B6CB0', bg: 'rgba(43,108,176,.1)' },
  { label: '今日触发限流', value: '12', color: '#ED7B2F', bg: 'rgba(237,123,47,.1)' },
]

type CallApp = {
  id: number
  name: string
  appKey: string
  secret: string
  rate: number
  concurrent: number
  status: '启用' | '停用'
  owner: string
  createTime: string
}

const apps = ref<CallApp[]>([
  { id: 1, name: '智能客流分析平台', appKey: 'AK8f2a91c0d34e', secret: 'Zx9kQw7mN2pBsL0v', rate: 100, concurrent: 20, status: '启用', owner: '张工', createTime: '2026-07-01' },
  { id: 2, name: '线网规划仿真系统', appKey: 'AK6b1d88e27f41', secret: 'Yt7pRw3kVm2a4sDc', rate: 50, concurrent: 10, status: '启用', owner: '李工', createTime: '2026-07-12' },
  { id: 3, name: '车站大屏展示端', appKey: 'AK3c9e77a15b20', secret: 'Xw8jQs2nBm1z5rFg', rate: 200, concurrent: 30, status: '启用', owner: '王工', createTime: '2026-07-20' },
  { id: 4, name: '外部科研合作方', appKey: 'AK7e4d33b28c09', secret: 'Vb6hTn1mKj9p0wEf', rate: 20, concurrent: 5, status: '停用', owner: '赵工', createTime: '2026-06-15' },
])

const appKeyword = ref('')
const appStatus = ref('')

const filteredApps = computed(() =>
  apps.value.filter((a) => {
    if (appStatus.value && a.status !== appStatus.value) return false
    if (!appKeyword.value) return true
    const kw = appKeyword.value.toLowerCase()
    return a.name.toLowerCase().includes(kw) || a.appKey.toLowerCase().includes(kw)
  }),
)

const maskKey = (key: string) => `${key.slice(0, 6)}••••${key.slice(-4)}`

const createVisible = ref(false)
const createForm = ref({ name: '', owner: '', rate: 100, concurrent: 20, enabled: true })

const openCreate = () => {
  createForm.value = { name: '', owner: '', rate: 100, concurrent: 20, enabled: true }
  createVisible.value = true
}

const createApp = () => {
  if (!createForm.value.name.trim() || !createForm.value.owner.trim()) {
    ElMessage.warning('请填写应用名称与负责人')
    return
  }
  apps.value.unshift({
    id: Date.now(),
    name: createForm.value.name,
    appKey: `AK${Math.random().toString(16).slice(2, 14)}`,
    secret: Math.random().toString(36).slice(2, 16) + Math.random().toString(36).slice(2, 16).toUpperCase(),
    rate: createForm.value.rate,
    concurrent: createForm.value.concurrent,
    status: createForm.value.enabled ? '启用' : '停用',
    owner: createForm.value.owner,
    createTime: new Date().toLocaleDateString('sv-SE'),
  })
  createVisible.value = false
  ElMessage.success('已生成 AppKey/Secret（Mock），请在凭证页复制保存')
}

const rotateKey = (row: CallApp) => {
  ElMessageBox.confirm(`重置后旧 Secret 立即失效，确认重置「${row.name}」凭证？`, '重置确认', { type: 'warning' })
    .then(() => {
      row.secret = Math.random().toString(36).slice(2, 16) + Math.random().toString(36).slice(2, 16).toUpperCase()
      ElMessage.success('Secret 已重置，请通知调用方更新（Mock）')
    })
    .catch(() => {})
}

const toggleApp = (row: CallApp) => {
  row.status = row.status === '启用' ? '停用' : '启用'
  ElMessage.success(`「${row.name}」已${row.status}`)
}

const deleteApp = (row: CallApp) => {
  ElMessageBox.confirm(`删除后将无法继续调用服务，确认删除「${row.name}」？`, '删除确认', { type: 'warning' })
    .then(() => {
      apps.value = apps.value.filter((a) => a.id !== row.id)
      ElMessage.success('调用应用已删除（Mock）')
    })
    .catch(() => {})
}

const ratePolicy = [
  { name: '实时查询类', desc: '接口响应快、调用频繁', limit: '50~200 次/分钟' },
  { name: '指标计算类', desc: '计算开销较大', limit: '20~80 次/分钟' },
  { name: '数据抽取类', desc: '批量拉取、体积大', limit: '5~30 次/分钟' },
  { name: '知识问答类', desc: 'AI 推理开销高', limit: '10~30 次/分钟' },
]
</script>

<style lang="scss" scoped>
.share-auth-page {
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;

  :deep(.el-col) {
    height: auto;
  }
}

.auth-stats {
  display: flex;
  gap: 12px;
}

.auth-stat {
  flex: 1;
  border-radius: 8px;
  border: 1px solid #edf0f5;
  padding: 12px 14px;
  text-align: center;
}

.auth-stat-value {
  font-size: 22px;
  font-weight: 700;
  line-height: 1.2;
}

.auth-stat-label {
  margin-top: 4px;
  font-size: 12px;
  opacity: 0.9;
}

.auth-card {
  :deep(.el-card__body) {
    overflow: hidden;
  }
}

.key-visible {
  color: #2b6cb0;
  font-size: 12px;
}

.key-masked {
  color: #8c8c8c;
  font-size: 12px;
  letter-spacing: 1px;
}

.sign-steps {
  margin-top: 8px;

  :deep(.el-step__description) {
    font-family: Consolas, Menlo, monospace;
    font-size: 11px;
  }
}

.sign-note {
  margin-top: 12px;
  padding: 10px 12px;
  border-radius: 8px;
  background: rgba(43, 108, 176, 0.08);
  color: #2b6cb0;
  font-size: 12px;
  line-height: 1.7;
}

.mt-16 {
  margin-top: 16px;
}

.mt-12 {
  margin-top: 12px;
}

.ml-4 {
  margin-left: 4px;
}

.rate-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid #edf0f5;

  &:last-of-type {
    border-bottom: none;
  }
}

.rate-item-name {
  width: 92px;
  flex: none;
  font-size: 13px;
  font-weight: 600;
  color: #4a4a4a;
}

.rate-item-desc {
  flex: 1;
  color: #8c8c8c;
  font-size: 12px;
}
</style>