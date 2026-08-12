<template>
  <div class="standard-page">
    <el-row :gutter="16">
      <el-col :span="16">
        <el-card class="panel-card dashboard-card" shadow="never">
          <template #header>
            <div class="panel-header">
              <span>特征识别结果</span>
              <el-button type="danger" :icon="Refresh" @click="runBatch">批量识别</el-button>
            </div>
          </template>

          <div class="toolbar-row">
            <el-input
              v-model="keyword"
              placeholder="按表 / 字段 / 语义类型搜索"
              clearable
              class="search-input"
              :prefix-icon="Search"
            />
            <el-select v-model="filterStatus" placeholder="状态" clearable class="filter-select">
              <el-option label="已确认" value="已确认" />
              <el-option label="待确认" value="待确认" />
            </el-select>
            <el-select v-model="filterRole" placeholder="字段角色" clearable class="filter-select">
              <el-option label="主键" value="主键" />
              <el-option label="外键" value="外键" />
              <el-option label="业务字段" value="业务字段" />
            </el-select>
          </div>

          <el-table :data="filteredList" stripe class="mt-12">
            <el-table-column prop="tableName" label="所属表" width="140" />
            <el-table-column prop="fieldName" label="字段" width="110">
              <template #default="{ row }">
                <span class="field-name">{{ row.fieldName }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="dataType" label="数据类型" width="90">
              <template #default="{ row }">
                <span class="type-badge type-badge-blue">{{ row.dataType }}</span>
              </template>
            </el-table-column>
            <el-table-column label="语义类型" width="120">
              <template #default="{ row }">
                <el-tag effect="dark" type="danger">{{ row.semanticType }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="字段角色" width="100">
              <template #default="{ row }">
                <el-tag :type="row.fieldRole === '主键' ? 'danger' : row.fieldRole === '外键' ? 'warning' : 'info'" effect="plain">
                  {{ row.fieldRole }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="数据模式" min-width="130">
              <template #default="{ row }">
                <span class="dep-text">{{ row.distribution }} · {{ row.pattern }}</span>
              </template>
            </el-table-column>
            <el-table-column label="识别置信度" width="130">
              <template #default="{ row }">
                <el-progress :percentage="row.confidence" :stroke-width="8" :color="row.confidence >= 90 ? '#00A854' : '#2B6CB0'" />
              </template>
            </el-table-column>
            <el-table-column label="状态" width="90">
              <template #default="{ row }">
                <el-tag :type="row.status === '已确认' ? 'success' : 'warning'" effect="dark">{{ row.status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120" fixed="right">
              <template #default="{ row }">
                <el-button link type="primary" @click="openDetail(row)">详情</el-button>
                <el-button link type="success" @click="confirm(row)">确认</el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-pagination class="pager" layout="total, prev, pager, next" :total="filteredList.length" :page-size="20" background />
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card class="panel-card dashboard-card" shadow="never">
          <template #header>
            <div class="panel-header"><span>识别总览</span></div>
          </template>
          <div class="overview-chips">
            <div class="chip chip-red">
              <div class="chip-value">96</div>
              <div class="chip-label">已确认特征</div>
            </div>
            <div class="chip chip-orange">
              <div class="chip-value">24</div>
              <div class="chip-label">待确认</div>
            </div>
            <div class="chip chip-green">
              <div class="chip-value">8.6</div>
              <div class="chip-label">平均置信度</div>
            </div>
          </div>

          <el-divider />
          <div class="section-title">特征标签分布</div>
          <div class="tag-cloud">
            <span v-for="tag in tagCloud" :key="tag.name" class="tag-cloud-item" :style="{ background: tag.bg, color: tag.color, fontSize: tag.size + 'px' }">
              {{ tag.name }} <em>{{ tag.count }}</em>
            </span>
          </div>

          <el-divider />
          <div class="section-title">业务规则识别</div>
          <div v-for="rule in businessRules" :key="rule.name" class="coop-item">
            <div class="coop-item-icon"><el-icon :size="16"><Connection /></el-icon></div>
            <div class="coop-item-info">
              <div class="coop-item-name">{{ rule.name }}</div>
              <div class="coop-item-desc">{{ rule.value }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-drawer v-model="detailVisible" title="特征识别详情" size="560px">
      <template v-if="detail">
        <el-descriptions :column="1" border title="字段特征">
          <el-descriptions-item label="字段">{{ detail.tableName }}.{{ detail.fieldName }}</el-descriptions-item>
          <el-descriptions-item label="数据类型">{{ detail.dataType }}</el-descriptions-item>
          <el-descriptions-item label="语义类型">{{ detail.semanticType }}</el-descriptions-item>
          <el-descriptions-item label="字段角色">{{ detail.fieldRole }}</el-descriptions-item>
        </el-descriptions>
        <div class="section-title mt-16">数据模式识别</div>
        <div class="feature-box">
          <div>分布特征：{{ detail.distribution }}</div>
          <div>规律特征：{{ detail.pattern }}</div>
        </div>
        <div class="section-title mt-16">业务规则识别</div>
        <div v-for="rule in detail.rules" :key="rule" class="feature-box">
          <el-icon style="margin-right: 6px"><Connection /></el-icon>{{ rule }}
        </div>
        <div class="section-title mt-16">特征标签</div>
        <el-tag v-for="tag in detail.tags" :key="tag" class="mr-6" effect="plain">{{ tag }}</el-tag>
        <div class="section-title mt-16">人工修正</div>
        <el-input v-model="manualNote" type="textarea" :rows="3" placeholder="如需修正识别结果，请填写修正说明" />
      </template>
      <template #footer>
        <el-button @click="detailVisible = false">取消</el-button>
        <el-button type="danger" @click="saveManual">确认/修正</el-button>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Connection, Refresh, Search } from '@element-plus/icons-vue'
import { mockFeatures, type FeatureResult } from '@/mock/resource'

const keyword = ref('')
const filterStatus = ref('')
const filterRole = ref('')
const detailVisible = ref(false)
const detail = ref<FeatureResult | null>(null)
const manualNote = ref('')

const features = ref([...mockFeatures])

const tagCloud = [
  { name: '标识类', count: 36, bg: 'rgba(218,37,29,0.10)', color: '#DA251D', size: 15 },
  { name: '描述类', count: 28, bg: 'rgba(43,108,176,0.10)', color: '#2B6CB0', size: 13 },
  { name: '度量类', count: 32, bg: 'rgba(0,168,84,0.10)', color: '#00A854', size: 14 },
  { name: '时间类', count: 24, bg: 'rgba(237,123,47,0.10)', color: '#ED7B2F', size: 12 },
]

const businessRules = [
  { name: '枚举校验', value: 'status ∈ {0, 1, 2}，已生成规则 rl-102' },
  { name: '取值范围', value: 'age ∈ [18, 100] · flow_count ∈ [0, +∞)' },
  { name: '关联约束', value: 'station_id → station_info.id（外键依赖）' },
]

const filteredList = computed(() =>
  features.value.filter((item) => {
    if (filterStatus.value && item.status !== filterStatus.value) return false
    if (filterRole.value && item.fieldRole !== filterRole.value) return false
    if (!keyword.value) return true
    const kw = keyword.value.toLowerCase()
    return (
      item.tableName.toLowerCase().includes(kw) ||
      item.fieldName.toLowerCase().includes(kw) ||
      item.semanticType.toLowerCase().includes(kw)
    )
  }),
)

const runBatch = () => ElMessage.success('已对 12 张表的 386 个字段启动批量识别（Mock）')

const openDetail = (row: FeatureResult) => {
  detail.value = row
  manualNote.value = ''
  detailVisible.value = true
}

const confirm = (row: FeatureResult) => {
  row.status = '已确认'
  ElMessage.success(`属性「${row.tableName}.${row.fieldName}」特征已确认（Mock）`)
}

const saveManual = () => {
  if (detail.value) detail.value.status = '已确认'
  detailVisible.value = false
  ElMessage.success(manualNote.value ? '修正意见已提交，更新标签（Mock）' : '特征识别结果已确认（Mock）')
}
</script>