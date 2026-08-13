<template>
  <div class="standard-page baseline-page">
    <div class="base-stats">
      <div v-for="s in statsCards" :key="s.label" class="base-stat" :style="{ background: s.bg, color: s.color }">
        <div class="base-stat-value">{{ s.value }}</div>
        <div class="base-stat-label">{{ s.label }}</div>
      </div>
    </div>

    <el-row :gutter="16">
      <el-col :span="8">
        <el-card class="panel-card" shadow="never">
          <template #header>
            <div class="panel-header">
              <span>整体合规态势</span>
              <div class="panel-actions">
                <el-tag type="success" effect="dark" size="small">综合得分 {{ overallScore }}</el-tag>
              </div>
            </div>
          </template>
          <div ref="radarEl" class="radar-box"></div>
          <div class="base-actions">
            <el-button type="danger" :icon="Refresh" :loading="scanning" @click="startScan">立即全量核查</el-button>
            <el-button plain :icon="Document" @click="openReport">生成核查报告</el-button>
          </div>
          <el-progress
            v-if="scanning"
            :percentage="scanProgress"
            status="active"
            class="scan-progress"
            :stroke-width="14"
            text-inside
          />
          <div class="last-scan">上次核查：{{ lastScanTime }} · 周期：每季度</div>
        </el-card>
      </el-col>

      <el-col :span="16">
        <el-card class="panel-card" shadow="never">
          <template #header>
            <div class="panel-header">
              <span>七项安全基线核查</span>
              <div class="panel-actions">
                <el-radio-group v-model="statusFilter" size="small">
                  <el-radio-button value="全部">全部</el-radio-button>
                  <el-radio-button value="通过">通过</el-radio-button>
                  <el-radio-button value="关注">关注</el-radio-button>
                  <el-radio-button value="不通过">不通过</el-radio-button>
                </el-radio-group>
              </div>
            </div>
          </template>

          <div v-for="b in filteredBaselines" :key="b.key" class="base-item">
            <div class="base-item-head">
              <div class="base-item-icon" :style="{ background: iconBg[b.key] }">
                <el-icon :size="16"><component :is="iconMap[b.key]" /></el-icon>
              </div>
              <div class="base-item-main">
                <div class="base-item-name">{{ b.name }}</div>
                <div class="base-item-score">得分 {{ b.score }} 分</div>
              </div>
              <el-tag :type="b.status === '通过' ? 'success' : b.status === '关注' ? 'warning' : 'danger'" effect="dark">
                {{ b.status }}
              </el-tag>
            </div>
            <div class="base-item-body">
              <span class="base-item-desc">{{ b.desc }}</span>
              <div class="base-item-meta">上次核查 {{ b.checkTime }} · 风险 {{ b.risks }} 项</div>
              <div class="base-item-actions">
                <el-button size="small" link type="primary" @click="viewDetail(b)">明细</el-button>
                <el-button size="small" link type="warning" @click="startFix(b)">一键整改</el-button>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 核查明细 -->
    <el-drawer v-model="detailVisible" title="核查明细" size="520px">
      <template v-if="detailTarget">
        <div class="drawer-head">
          <span class="drawer-title">{{ detailTarget.name }}</span>
          <el-tag :type="detailTarget.status === '通过' ? 'success' : detailTarget.status === '关注' ? 'warning' : 'danger'" effect="dark">{{ detailTarget.status }}</el-tag>
        </div>
        <div class="drawer-score">核查得分：<b style="color:#DA251D">{{ detailTarget.score }}</b> 分（满分 100）</div>
        <div class="detail-section-title">核查项清单</div>
        <div v-for="(it, i) in detailTarget.items" :key="i" class="check-item">
          <div class="check-item-head">
            <span class="check-item-name">{{ it.name }}</span>
            <el-tag size="small" :type="it.pass ? 'success' : 'danger'" effect="plain">
              {{ it.pass ? '符合' : '不符合' }}
            </el-tag>
          </div>
          <div class="check-item-desc">{{ it.desc }}</div>
        </div>
      </template>
    </el-drawer>

    <!-- 核查报告 -->
    <el-dialog v-model="reportVisible" title="安全基线核查报告" width="720px">
      <div class="report-wrap">
        <div class="report-title">广州地铁新线建设数据治理系统 — 安全基线核查报告</div>
        <div class="report-meta">核查时间：{{ lastScanTime }} · 核查周期：季度 · 报告编号：SEC-CHK-2026-Q3</div>
        <div class="report-summary">本季度对系统口令策略、账号安全、权限配置、加密配置、脱敏配置、主机安全、审计完整性 7 个领域共 28 个核查项进行基线核查，综合得分 {{ overallScore }} 分。其中符合 {{ passedCount }} 项、关注 {{ warnCount }} 项、不符合 {{ failCount }} 项。</div>
        <div class="report-section">整改建议</div>
        <div v-for="(r, i) in reportAdvice" :key="i" class="report-advice">
          <span class="advice-no">{{ i + 1 }}</span>{{ r }}
        </div>
        <div class="report-section">检查依据</div>
        <div class="report-ref">《数据安全法》《个人信息保护法》GB/T 35273-2020 《信息安全技术 个人信息安全规范》· 企业安全基线制度（V2.0）</div>
      </div>
      <template #footer>
        <el-button @click="reportVisible = false">关闭</el-button>
        <el-button type="danger" @click="downloadReport">下载报告</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Document, Key, Lock, Monitor, Refresh, Setting, User, View } from '@element-plus/icons-vue'
import * as echarts from 'echarts'

const statsCards = [
  { label: '综合合规得分', value: '88', color: '#00A854', bg: 'rgba(0,168,84,.1)' },
  { label: '通过核查项', value: '18', color: '#2B6CB0', bg: 'rgba(43,108,176,.1)' },
  { label: '关注核查项', value: '7', color: '#ED7B2F', bg: 'rgba(237,123,47,.1)' },
  { label: '不符合核查项', value: '3', color: '#DA251D', bg: 'rgba(218,37,29,.1)' },
]

const iconMap = {
  pwd: Key,
  account: User,
  perm: Key,
  crypt: Lock,
  mask: View,
  host: Monitor,
  audit: Setting,
} as Record<string, typeof Key>
const iconBg: Record<string, string> = {
  pwd: 'rgba(218,37,29,.08)',
  account: 'rgba(43,108,176,.08)',
  perm: 'rgba(0,168,84,.08)',
  crypt: 'rgba(237,123,47,.08)',
  mask: 'rgba(155,89,182,.08)',
  host: 'rgba(140,140,140,.08)',
  audit: 'rgba(43,108,176,.08)',
}

type BaselineItem = {
  key: string
  name: string
  score: number
  status: '通过' | '关注' | '不通过'
  desc: string
  risks: number
  checkTime: string
  items: { name: string; pass: boolean; desc: string }[]
}

const baselines = ref<BaselineItem[]>([
  {
    key: 'pwd',
    name: '口令策略',
    score: 92,
    status: '通过',
    desc: '密码复杂度、有效期、多因子认证策略核查',
    risks: 1,
    checkTime: '2026-06-30',
    items: [
      { name: '密码复杂度策略', pass: true, desc: '≥12 位并含大小写数字特殊字符' },
      { name: '口令有效期', pass: true, desc: '90 天强制更换，历史 5 代不可复用' },
      { name: '多因子认证', pass: true, desc: '管理后台强制 MFA' },
      { name: '弱口令字典拦截', pass: false, desc: '有 3 个账号使用生日类弱口令未拦截' },
    ],
  },
  {
    key: 'account',
    name: '账号安全',
    score: 88,
    status: '关注',
    desc: '账号有效期、锁定期、休眠账号清理核查',
    risks: 2,
    checkTime: '2026-06-30',
    items: [
      { name: '账号有效期管理', pass: true, desc: '按角色设置有效期' },
      { name: '错误尝试锁定', pass: true, desc: '5 次失败锁定 30 分钟' },
      { name: '休眠账号清理', pass: false, desc: '2 个离职账号未停用' },
      { name: '公共账号管控', pass: false, desc: '1 个公共账号多人共享' },
    ],
  },
  {
    key: 'perm',
    name: '权限配置',
    score: 85,
    status: '关注',
    desc: '最小权限、权限复核、越权风险核查',
    risks: 3,
    checkTime: '2026-06-30',
    items: [
      { name: '最小权限原则', pass: true, desc: '90% 账号为最小权限集' },
      { name: '权限定期复核', pass: false, desc: '业务侧权限复核季度延迟 20 天' },
      { name: '敏感操作权限', pass: true, desc: '数据导出需二次授权' },
      { name: '离职权限回收', pass: false, desc: '回收流程未完全闭环' },
    ],
  },
  {
    key: 'crypt',
    name: '加密配置',
    score: 95,
    status: '通过',
    desc: '传输加密、存储加密、密钥算法核查',
    risks: 1,
    checkTime: '2026-06-30',
    items: [
      { name: '传输通道加密', pass: true, desc: '全链路 HTTPS/TLS1.2+ 覆盖' },
      { name: '敏感列存储加密', pass: true, desc: '敏感字段国密算法落盘加密' },
      { name: '密钥轮换机制', pass: true, desc: '密钥生命周期自动化轮换' },
      { name: '算法合规性', pass: false, desc: '遗留 MD5 场景 1 处未完成迁移' },
    ],
  },
  {
    key: 'mask',
    name: '脱敏配置',
    score: 90,
    status: '通过',
    desc: '敏感字段脱敏规则覆盖率核查',
    risks: 1,
    checkTime: '2026-06-30',
    items: [
      { name: 'L3/L4 预览脱敏', pass: true, desc: '数据预览强制脱敏' },
      { name: '脱敏算法策略', pass: true, desc: '国密算法与掩码策略符合基线' },
      { name: '开发测试环境脱敏', pass: true, desc: '克隆数据自动脱敏' },
      { name: '规则覆盖率', pass: false, desc: '12 个敏感字段未绑定规则' },
    ],
  },
  {
    key: 'host',
    name: '主机安全',
    score: 82,
    status: '关注',
    desc: '补丁、端口、基线加固、防病毒核查',
    risks: 3,
    checkTime: '2026-06-30',
    items: [
      { name: '安全补丁更新', pass: false, desc: '3 台主机补丁滞后超过 30 天' },
      { name: '高危端口收敛', pass: true, desc: '仅开放业务必需端口' },
      { name: '基线加固', pass: true, desc: 'SSH 仅密钥登录' },
      { name: '防病毒与入侵检测', pass: false, desc: '防病毒库 1 台未同步' },
    ],
  },
  {
    key: 'audit',
    name: '审计完整性',
    score: 86,
    status: '关注',
    desc: '日志留存、防篡改、审计覆盖核查',
    risks: 2,
    checkTime: '2026-06-30',
    items: [
      { name: '日志留存期限', pass: true, desc: '操作日志保留 180 天' },
      { name: '日志防篡改', pass: false, desc: '关键日志 WORM 存储未部署' },
      { name: '审计覆盖范围', pass: true, desc: '登录/访问/权限/操作全覆盖' },
      { name: '审计告警联动', pass: false, desc: '异常行为识别未接入告警' },
    ],
  },
])

const statusFilter = ref('全部')

const filteredBaselines = computed(() =>
  statusFilter.value === '全部' ? baselines.value : baselines.value.filter((b) => b.status === statusFilter.value),
)

const overallScore = computed(() => Math.round(baselines.value.reduce((s, b) => s + b.score, 0) / baselines.value.length))
const passedCount = computed(() => baselines.value.reduce((s, b) => s + b.items.filter((i) => i.pass).length, 0))
const warnCount = computed(() => baselines.value.reduce((s, b) => s + b.items.filter((i) => !i.pass).length, 0))
const failCount = computed(() => baselines.value.filter((b) => b.status === '不通过').length)

const lastScanTime = '2026-06-30 10:00:00'

const reportAdvice = [
  '口令策略：启用弱口令字典实时拦截，对存量弱口令账号强制改密。',
  '账号安全：完成离职账号停用与公共账号实名化改造，关闭共享账号。',
  '权限配置：季度权限复核纳入自动化任务，敏感导出权限与离职账号权限联动回收。',
  '加密配置：限期完成遗留 MD5 摘要场景迁移至国产 SM3 算法。',
  '脱敏配置：为 12 个未绑定敏感字段完成规则绑定并进入生效验证。',
  '主机安全：补齐 3 台主机安全补丁，同步防病毒库并纳入集中监控。',
  '审计完整性：部署日志防篡改存储（WORM），建立异常识别与告警联动。',
]

const scanning = ref(false)
const scanProgress = ref(0)
let scanTimer: number | undefined

const startScan = () => {
  if (scanning.value) return
  scanning.value = true
  scanProgress.value = 0
  scanTimer = window.setInterval(() => {
    scanProgress.value += 4
    if (scanProgress.value >= 100) {
      window.clearInterval(scanTimer)
      scanning.value = false
      baselines.value.forEach((b) => {
        b.score = Math.min(100, b.score + (Math.random() > 0.4 ? 1 : -1))
        b.status = b.score >= 90 ? '通过' : b.score >= 82 ? '关注' : '不通过'
      })
      ElMessage.success('安全基线核查完成，结果已更新（Mock）')
    }
  }, 120)
}

const detailVisible = ref(false)
const detailTarget = ref<BaselineItem | null>(null)

const viewDetail = (b: BaselineItem) => {
  detailTarget.value = b
  detailVisible.value = true
}

const startFix = (b: BaselineItem) => {
  ElMessage.success(`已创建「${b.name}」整改工单并通知责任人（Mock）`)
}

const reportVisible = ref(false)
const openReport = () => {
  reportVisible.value = true
}

const downloadReport = () => {
  ElMessage.success('核查报告（PDF）已生成并下载（Mock）')
  reportVisible.value = false
}

const radarEl = ref<HTMLElement>()
let radarChart: echarts.ECharts | null = null

const renderRadar = () => {
  if (!radarEl.value) return
  radarChart = echarts.init(radarEl.value)
  radarChart.setOption({
    radar: {
      indicator: [
        { name: '口令策略', max: 100 },
        { name: '账号安全', max: 100 },
        { name: '权限配置', max: 100 },
        { name: '加密配置', max: 100 },
        { name: '脱敏配置', max: 100 },
        { name: '主机安全', max: 100 },
        { name: '审计完整性', max: 100 },
      ],
      radius: '68%',
      splitNumber: 4,
      axisName: { color: '#8c8c8c', fontSize: 11 },
      splitArea: { areaStyle: { color: ['#fff', '#fafbfd'] } },
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: baselines.value.map((b) => b.score),
            name: '核查得分',
            areaStyle: { color: 'rgba(218,37,29,.18)' },
            lineStyle: { color: '#DA251D', width: 2 },
            itemStyle: { color: '#DA251D' },
          },
        ],
      },
    ],
  })
}

onMounted(() => {
  renderRadar()
})

onBeforeUnmount(() => {
  if (scanTimer) window.clearInterval(scanTimer)
  radarChart?.dispose?.()
})
</script>

<style lang="scss" scoped>
.baseline-page {
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
}

.base-stats {
  display: flex;
  gap: 12px;
}

.base-stat {
  flex: 1;
  border-radius: 8px;
  border: 1px solid #edf0f5;
  padding: 12px 14px;
  text-align: center;
}

.base-stat-value {
  font-size: 22px;
  font-weight: 700;
  line-height: 1.2;
}

.base-stat-label {
  margin-top: 4px;
  font-size: 12px;
  opacity: 0.9;
}

.radar-box {
  height: 300px;
  width: 100%;
}

.base-actions {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.scan-progress {
  margin-top: 14px;
}

.last-scan {
  margin-top: 10px;
  color: #8c8c8c;
  font-size: 12px;
}

.base-item {
  padding: 12px 14px;
  border: 1px solid #edf0f5;
  border-radius: 8px;
  margin-bottom: 10px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    border-color: #da251d;
    box-shadow: 0 4px 12px rgba(218, 37, 29, 0.08);
  }
}

.base-item-head {
  display: flex;
  align-items: center;
  gap: 10px;
}

.base-item-icon {
  width: 32px;
  height: 32px;
  flex: none;
  border-radius: 8px;
  display: grid;
  place-items: center;
  color: #4a4a4a;
}

.base-item-main {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
}

.base-item-name {
  font-size: 14px;
  font-weight: 700;
  color: #4a4a4a;
}

.base-item-score {
  color: #da251d;
  font-size: 12px;
  font-weight: 600;
}

.base-item-body {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 8px;
  padding-left: 42px;
  flex-wrap: wrap;
}

.base-item-desc {
  flex: 1;
  min-width: 200px;
  color: #8c8c8c;
  font-size: 12px;
}

.base-item-meta {
  color: #8c8c8c;
  font-size: 11px;
}

.base-item-actions {
  display: flex;
  gap: 4px;
}

.drawer-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.drawer-title {
  font-size: 16px;
  font-weight: 700;
  color: #4a4a4a;
}

.drawer-score {
  color: #8c8c8c;
  font-size: 13px;
  margin-bottom: 4px;
}

.detail-section-title {
  font-size: 13px;
  font-weight: 700;
  color: #4a4a4a;
  margin: 14px 0 8px;
  padding-left: 8px;
  border-left: 3px solid #da251d;
}

.check-item {
  padding: 10px 0;
  border-bottom: 1px solid #edf0f5;

  &:last-child {
    border-bottom: none;
  }
}

.check-item-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.check-item-name {
  font-size: 13px;
  font-weight: 600;
  color: #4a4a4a;
}

.check-item-desc {
  margin-top: 4px;
  color: #8c8c8c;
  font-size: 12px;
}

.report-wrap {
  padding: 4px 8px;
}

.report-title {
  font-size: 17px;
  font-weight: 700;
  text-align: center;
  color: #4a4a4a;
}

.report-meta {
  margin-top: 8px;
  text-align: center;
  color: #8c8c8c;
  font-size: 12px;
}

.report-summary {
  margin-top: 14px;
  padding: 10px 14px;
  background: rgba(218, 37, 29, 0.05);
  border-radius: 8px;
  color: #4a4a4a;
  font-size: 13px;
  line-height: 1.7;
}

.report-section {
  margin-top: 16px;
  font-weight: 600;
  color: #4a4a4a;
  font-size: 13px;
  padding-left: 8px;
  border-left: 3px solid #da251d;
}

.report-advice {
  display: flex;
  gap: 8px;
  margin-top: 8px;
  color: #4a4a4a;
  font-size: 12px;
  line-height: 1.7;
}

.advice-no {
  width: 20px;
  height: 20px;
  flex: none;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: rgba(218, 37, 29, 0.1);
  color: #da251d;
  font-size: 11px;
  font-weight: 700;
}

.report-ref {
  margin-top: 8px;
  color: #8c8c8c;
  font-size: 12px;
  line-height: 1.7;
}
</style>