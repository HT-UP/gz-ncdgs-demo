<template>
  <div class="standard-page">
    <el-row :gutter="16">
      <el-col :xs="24" :lg="6" v-for="metric in metrics" :key="metric.label">
        <el-card class="metric-card dashboard-card" shadow="hover">
          <div class="metric-title">{{ metric.label }}</div>
          <div class="metric-value">{{ metric.value }}</div>
          <div class="metric-subtitle">
            <span :class="metric.warning ? 'trend-negative' : 'trend-positive'">{{ metric.note }}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-alert type="success" :closable="false" class="grade-rule-alert">
      <template #title>
        <span class="dep-text">等级评定规则：</span>A 级（综合评分 ≥ 90，且无重大缺陷）· B 级（≥ 80）· C 级（≥ 70）· D 级（&lt; 70）；评级周期一年，逾期未续训自动降级。
      </template>
    </el-alert>

    <el-card class="panel-card dashboard-card mt-16" shadow="never">
      <template #header>
        <div class="panel-header">
          <span>质量认证证书</span>
          <el-button type="danger" :icon="Plus" @click="openApply">新申请认证</el-button>
        </div>
      </template>

      <div class="toolbar-row">
        <el-input
          v-model="keyword"
          placeholder="按资产名称 / 证书编号搜索"
          clearable
          class="search-input"
          :prefix-icon="Search"
        />
        <el-select v-model="filterGrade" placeholder="等级" clearable class="filter-select">
          <el-option label="A 级" value="A" />
          <el-option label="B 级" value="B" />
          <el-option label="C 级" value="C" />
          <el-option label="D 级" value="D" />
        </el-select>
        <el-select v-model="filterStatus" placeholder="状态" clearable class="filter-select">
          <el-option label="有效" value="有效" />
          <el-option label="即将到期" value="即将到期" />
          <el-option label="已过期" value="已过期" />
        </el-select>
      </div>

      <el-table :data="filteredCerts" stripe class="mt-12">
        <el-table-column prop="assetName" label="资产名称" min-width="150" />
        <el-table-column prop="assetType" label="资产类型" width="110" />
        <el-table-column label="等级" width="90" align="center">
          <template #default="{ row }">
            <span class="grade-badge" :style="{ background: gradeColor[row.grade], color: '#fff' }">{{ row.grade }}</span>
          </template>
        </el-table-column>
        <el-table-column label="评分" width="80" align="center">
          <template #default="{ row }">{{ row.score }}</template>
        </el-table-column>
        <el-table-column prop="certNo" label="证书编号" width="150" />
        <el-table-column label="有效期" min-width="200">
          <template #default="{ row }">{{ row.issueDate }} 至 {{ row.expireDate }}</template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="certStatusTagType[row.status]" effect="dark">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button v-if="row.status !== '已过期'" link type="danger" @click="renewCert(row)">续期</el-button>
            <el-button link type="primary" @click="showCert(row)">证书</el-button>
            <el-button link type="warning" @click="showHistory(row)">历史</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination class="pager" layout="total, prev, pager, next" :total="filteredCerts.length" :page-size="20" background />
    </el-card>

    <el-dialog v-model="applyVisible" title="质量认证申请" width="560px">
      <el-form :model="applyForm" label-width="100px">
        <el-form-item label="认证资产">
          <el-select v-model="applyForm.assetName" class="w-full">
            <el-option v-for="asset in ['票务核心库', '客流分析库', '设备信号库', '乘客信息库', '线路档案库']" :key="asset" :label="asset" :value="asset" />
          </el-select>
        </el-form-item>
        <el-form-item label="资产类型">
          <el-select v-model="applyForm.assetType" class="w-full">
            <el-option label="数据源" value="数据源" />
            <el-option label="数据集市" value="数据集市" />
            <el-option label="数据表" value="数据表" />
          </el-select>
        </el-form-item>
        <el-form-item label="申请说明">
          <el-input v-model="applyForm.note" type="textarea" :rows="3" placeholder="填写认证申请说明" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="applyVisible = false">取消</el-button>
        <el-button type="danger" @click="submitApply">提交申请</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="certVisible" :title="`质量认证证书：${certAssetName}`" width="560px">
      <div class="certificate-card">
        <div class="cert-head">
          <div class="cert-title">数据资产质量认证证书</div>
          <div class="cert-no">{{ certNo }}</div>
        </div>
        <div class="cert-body">
          <div class="cert-asset">兹认证数据资产「{{ certAssetName }}」</div>
          <div class="cert-score">综合质量评分 <span class="cert-score-num">{{ certScore }}</span> 分</div>
          <div class="cert-grade">
            质量等级
            <span class="grade-badge-grade" :style="{ background: gradeColor[certGrade], color: '#fff' }">{{ certGrade }}</span>
          </div>
          <div class="cert-dims">
            <div v-for="d in certDims" :key="d.name" class="cert-dim">
              <span class="cert-dim-name">{{ d.name }}</span>
              <el-progress :percentage="d.value" :stroke-width="8" :color="d.value >= 90 ? '#00A854' : d.value >= 80 ? '#2B6CB0' : '#E34D59'" class="cert-dim-bar" />
              <span class="cert-dim-value">{{ d.value }}</span>
            </div>
          </div>
          <div class="cert-validity">有效期至 {{ certExpire }}</div>
        </div>
        <div class="cert-footer">广州地铁新线建设数据治理中心 颁发</div>
      </div>
      <template #footer>
        <el-button type="danger" @click="downloadCert">下载证书</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, Search } from '@element-plus/icons-vue'
import { mockCertifications, type CertificationRecord } from '@/mock/quality'

const gradeColor: Record<string, string> = {
  A: '#00A854',
  B: '#2B6CB0',
  C: '#ED7B2F',
  D: '#E34D59',
}

const certStatusTagType: Record<string, 'success' | 'warning' | 'danger'> = {
  有效: 'success',
  即将到期: 'warning',
  已过期: 'danger',
}

const metrics = [
  { label: '认证资产总数', value: '120', note: '覆盖 7 类数据资产', warning: false },
  { label: 'A/B 级占比', value: '76%', note: '较上季度 +5%', warning: false },
  { label: '即将到期', value: '9', note: '7 天内需续期', warning: true },
  { label: '已过期', value: '3', note: '已进入整改流程', warning: true },
]

const keyword = ref('')
const filterGrade = ref('')
const filterStatus = ref('')
const applyVisible = ref(false)
const certVisible = ref(false)
const certAssetName = ref('')
const certNo = ref('')
const certScore = ref(0)
const certGrade = ref<CertificationRecord['grade']>('A')
const certExpire = ref('')

const certs = ref([...mockCertifications])

const certDims = [
  { name: '完整性', value: 96 },
  { name: '准确性', value: 94 },
  { name: '一致性', value: 92 },
  { name: '及时性', value: 89 },
  { name: '可用性', value: 95 },
]

const applyForm = reactive({
  assetName: '票务核心库',
  assetType: '数据源',
  note: '',
})

const filteredCerts = computed(() =>
  certs.value.filter((cert) => {
    if (filterGrade.value && cert.grade !== filterGrade.value) return false
    if (filterStatus.value && cert.status !== filterStatus.value) return false
    if (!keyword.value) return true
    const kw = keyword.value.toLowerCase()
    return cert.assetName.toLowerCase().includes(kw) || cert.certNo.toLowerCase().includes(kw)
  }),
)

const openApply = () => {
  Object.assign(applyForm, { assetName: '票务核心库', assetType: '数据源', note: '' })
  applyVisible.value = true
}

const submitApply = () => {
  applyVisible.value = false
  ElMessage.success('认证申请已提交，进入评定流程（Mock）')
}

const showCert = (row: CertificationRecord) => {
  certAssetName.value = row.assetName
  certNo.value = row.certNo
  certScore.value = row.score
  certGrade.value = row.grade
  certExpire.value = row.expireDate
  certVisible.value = true
}

const downloadCert = () => {
  ElMessage.success('认证证书已下载（Mock）')
}

const renewCert = (row: CertificationRecord) => {
  ElMessage.info(`已为「${row.assetName}」发起续期申请（Mock）`)
}

const showHistory = (row: CertificationRecord) => {
  ElMessage.info(`「${row.assetName}」认证历史：2024 B级 → 2025 A级 → 2026 ${row.grade}级（Mock）`)
}
</script>

<style lang="scss" scoped>
.grade-rule-alert {
  margin-top: 16px;
}

.cert-dims {
  margin: 8px 0;
}

.cert-dim {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 4px 0;
}

.cert-dim-name {
  width: 52px;
  flex: none;
  font-size: 12px;
  color: #8c8c8c;
}

.cert-dim-bar {
  flex: 1;
}

.cert-dim-value {
  width: 30px;
  text-align: right;
  color: #4a4a4a;
  font-size: 12px;
  font-weight: 600;
}
</style>