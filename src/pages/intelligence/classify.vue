<template>
  <div class="standard-page">
    <el-row :gutter="16">
      <el-col :span="16">
        <el-card class="panel-card dashboard-card" shadow="never">
          <template #header>
            <div class="panel-header">
              <span>分类分级结果</span>
              <div class="panel-actions">
                <el-button type="danger" :icon="Plus" @click="createBatch">批量处理任务</el-button>
              </div>
            </div>
          </template>

          <div class="toolbar-row">
            <el-input
              v-model="keyword"
              placeholder="按资产名称 / 分级检索"
              clearable
              class="search-input"
              :prefix-icon="Search"
            />
            <el-select v-model="filterLevel" placeholder="分级" clearable class="filter-select">
              <el-option label="L1 核心" value="L1" />
              <el-option label="L2 重要" value="L2" />
              <el-option label="L3 一般" value="L3" />
              <el-option label="L4 可公开" value="L4" />
            </el-select>
            <el-select v-model="filterStatus" placeholder="状态" clearable class="filter-select">
              <el-option label="待复核" value="待复核" />
              <el-option label="已通过" value="已通过" />
              <el-option label="已驳回" value="已驳回" />
            </el-select>
            <span class="dep-text">{{ pendingCount }} 条待复核</span>
          </div>

          <el-table :data="pagedResults" stripe class="mt-12">
            <el-table-column prop="assetName" label="资产名称" min-width="150" />
            <el-table-column prop="domain" label="所属业务域" width="110" />
            <el-table-column label="智能分级" width="90">
              <template #default="{ row }">
                <span class="level-badge" :style="{ background: levelColor[row.predictedLevel] }">{{ row.predictedLevel }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="predictedLevelName" label="分级名称" width="90" />
            <el-table-column label="智能标签" min-width="130">
              <template #default="{ row }">
                <el-tag v-for="tag in row.tags" :key="tag" size="small" effect="plain" class="mr-4">{{ tag }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="置信度" width="120">
              <template #default="{ row }">
                <el-progress :percentage="row.confidence" :stroke-width="8" :color="confidenceColor(row.confidence)" />
              </template>
            </el-table-column>
            <el-table-column label="状态" width="90">
              <template #default="{ row }">
                <el-tag :type="resultStatusTag[row.status]" effect="dark" size="small">{{ row.status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150" fixed="right">
              <template #default="{ row }">
                <template v-if="row.status === '待复核'">
                  <el-button link type="success" @click="review(row, true)">通过</el-button>
                  <el-button link type="danger" @click="review(row, false)">驳回</el-button>
                </template>
                <el-button v-else link type="primary" @click="viewResult(row)">查看</el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-pagination
            class="pager"
            layout="total, prev, pager, next"
            :total="filteredResults.length"
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
            <div class="panel-header"><span>分级统计</span></div>
          </template>
          <div ref="levelChartRef" class="chart-box"></div>
        </el-card>

        <el-card class="panel-card dashboard-card mt-16" shadow="never">
          <template #header>
            <div class="panel-header"><span>模型配置管理</span></div>
          </template>
          <el-table :data="classifyModels" size="small" stripe>
            <el-table-column prop="name" label="模型" min-width="140" />
            <el-table-column label="准确率" width="90">
              <template #default="{ row }">
                <span :style="{ color: confidenceColor(row.accuracy) }">{{ row.accuracy }}%</span>
              </template>
            </el-table-column>
            <el-table-column prop="version" label="版本" width="60" />
            <el-table-column label="状态" width="70">
              <template #default="{ row }">
                <el-tag :type="row.status === '生效' ? 'success' : 'info'" effect="dark" size="small">{{ row.status }}</el-tag>
              </template>
            </el-table-column>
          </el-table>
          <div class="maintain-actions mt-12">
            <el-button size="small" :icon="Plus" @click="addModel">新增模型</el-button>
            <el-button size="small" type="primary" @click="trainModel">训练/重训</el-button>
            <el-button size="small" type="warning" plain @click="manageModel">版本管理</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-drawer v-model="batchVisible" title="批量处理任务" size="480px">
      <el-form label-width="100px">
        <el-form-item label="处理范围">
          <el-radio-group v-model="batchForm.scope">
            <el-radio value="全部资产" />
            <el-radio value="未分级资产" />
            <el-radio value="指定业务域" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="选择模型">
          <el-select v-model="batchForm.model" class="w-full">
            <el-option v-for="model in classifyModels" :key="model.id" :label="model.name" :value="model.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="回写策略">
          <el-checkbox v-model="batchForm.autoWrite">复核通过后自动回写资产属性</el-checkbox>
        </el-form-item>
      </el-form>
      <el-progress :percentage="batchProgress" :stroke-width="12" v-if="batchRunning" />
      <div class="dep-text mt-8" v-if="batchRunning">正在处理 1,080 条资产（Mock）...</div>
      <template #footer>
        <el-button @click="batchVisible = false">取消</el-button>
        <el-button type="danger" :loading="batchRunning" @click="startBatch">开始执行</el-button>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, Search } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import { classifyModels, mockClassifyResults } from '@/mock/intelligence'

const keyword = ref('')
const filterLevel = ref('')
const filterStatus = ref('')
const currentPage = ref(1)
const pageSize = 20
const batchVisible = ref(false)
const batchRunning = ref(false)
const batchProgress = ref(0)

const results = ref([...mockClassifyResults])

const levelColor: Record<string, string> = {
  L1: '#E34D59',
  L2: '#ED7B2F',
  L3: '#2B6CB0',
  L4: '#8C8C8C',
}

const resultStatusTag: Record<string, 'warning' | 'success' | 'danger'> = {
  待复核: 'warning',
  已通过: 'success',
  已驳回: 'danger',
}

const batchForm = reactive({
  scope: '未分级资产',
  model: '轨道交通分类模型 V3',
  autoWrite: true,
})

const filteredResults = computed(() =>
  results.value.filter((item) => {
    if (filterLevel.value && item.predictedLevel !== filterLevel.value) return false
    if (filterStatus.value && item.status !== filterStatus.value) return false
    if (!keyword.value) return true
    return item.assetName.toLowerCase().includes(keyword.value.toLowerCase())
  }),
)

const pendingCount = computed(() => results.value.filter((item) => item.status === '待复核').length)

const pagedResults = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredResults.value.slice(start, start + pageSize)
})

const changePage = (page: number) => (currentPage.value = page)

watch([keyword, filterLevel, filterStatus], () => {
  currentPage.value = 1
})

const confidenceColor = (value: number) => (value >= 85 ? '#00A854' : value >= 75 ? '#ED7B2F' : '#E34D59')

const review = (row: (typeof results.value)[number], pass: boolean) => {
  row.status = pass ? '已通过' : '已驳回'
  ElMessage[pass ? 'success' : 'warning'](`资产「${row.assetName}」已${pass ? '通过' : '驳回'}${pass ? '并回写资产分级与标签' : ''}（Mock）`)
}

const viewResult = (row: (typeof results.value)[number]) => {
  ElMessage.info(`「${row.assetName}」分级 ${row.predictedLevel} ${row.predictedLevelName}，标签：${row.tags.join('、')}（Mock）`)
}

const createBatch = () => {
  batchVisible.value = true
}

const startBatch = () => {
  batchRunning.value = true
  batchProgress.value = 20
  const timer = setInterval(() => {
    batchProgress.value += 15
    if (batchProgress.value >= 100) {
      clearInterval(timer)
      batchRunning.value = false
      batchVisible.value = false
      ElMessage.success('批量分类分级完成，生成了 1,080 条待复核结果（Mock）')
    }
  }, 400)
}

const addModel = () => ElMessage.info('打开模型配置向导（Mock）')
const trainModel = () => ElMessage.success('模型训练任务已提交（Mock）')
const manageModel = () => ElMessage.info('打开模型版本管理（Mock）')

const levelChartRef = ref<HTMLElement>()
let levelChart: echarts.ECharts | null = null

const renderLevelChart = () => {
  if (!levelChartRef.value) return
  levelChart?.dispose()
  levelChart = echarts.init(levelChartRef.value)
  const counts = ['L1', 'L2', 'L3', 'L4'].map((level) => mockClassifyResults.filter((item) => item.predictedLevel === level).length)
  levelChart.setOption({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: 34, right: 10, top: 20, bottom: 26 },
    xAxis: { type: 'category', data: ['L1 核心', 'L2 重要', 'L3 一般', 'L4 可公开'] },
    yAxis: { type: 'value', splitLine: { lineStyle: { type: 'dashed', color: '#E4E7ED' } } },
    series: [
      {
        type: 'bar',
        barWidth: 28,
        data: counts.map((count, index) => ({ value: count, itemStyle: { color: ['#E34D59', '#ED7B2F', '#2B6CB0', '#8C8C8C'][index] } })),
      },
    ],
  })
}

const handleResize = () => levelChart?.resize()

onMounted(() => {
  renderLevelChart()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  levelChart?.dispose()
})
</script>