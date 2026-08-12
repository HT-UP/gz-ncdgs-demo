<template>
  <div class="standard-page">
    <el-row :gutter="16">
      <el-col :span="16">
        <el-card class="panel-card dashboard-card" shadow="never">
          <template #header>
            <div class="panel-header">
              <span>报告管理</span>
              <el-button type="danger" :icon="Plus" @click="openCreate">生成新报告</el-button>
            </div>
          </template>

          <div class="toolbar-row">
            <el-input
              v-model="keyword"
              placeholder="按报告名称搜索"
              clearable
              class="search-input"
              :prefix-icon="Search"
            />
            <el-select v-model="filterFreq" placeholder="生成频度" clearable class="filter-select">
              <el-option label="日报告" value="日报告" />
              <el-option label="周报告" value="周报告" />
              <el-option label="月报告" value="月报告" />
              <el-option label="季度报告" value="季度报告" />
              <el-option label="年度报告" value="年度报告" />
            </el-select>
          </div>

          <el-table :data="filteredReports" stripe class="mt-12">
            <el-table-column prop="name" label="报告名称" min-width="170" />
            <el-table-column prop="freq" label="频度" width="100">
              <template #default="{ row }">
                <el-tag effect="plain" type="danger">{{ row.freq }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="dimension" label="维度" width="120" />
            <el-table-column prop="generatedAt" label="生成时间" width="150" />
            <el-table-column prop="creator" label="创建人" width="80" />
            <el-table-column label="内容概览" min-width="200">
              <template #default="{ row }">
                <span class="dep-text">{{ row.summary }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200" fixed="right">
              <template #default="{ row }">
                <el-dropdown @command="(format: string) => exportReport(row, format)" trigger="click">
                  <el-button link type="danger">
                    导出<el-icon class="el-icon--right"><ArrowDown /></el-icon>
                  </el-button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item command="PDF">PDF</el-dropdown-item>
                      <el-dropdown-item command="Excel">Excel</el-dropdown-item>
                      <el-dropdown-item command="HTML">HTML</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
                <el-button link type="primary" @click="previewReport(row)">预览</el-button>
                <el-button link type="warning" @click="regenerate(row)">重新生成</el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-pagination class="pager" layout="total, prev, pager, next" :total="filteredReports.length" :page-size="20" background />
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card class="panel-card dashboard-card" shadow="never">
          <template #header>
            <div class="panel-header">
              <span>报告模板</span>
            </div>
          </template>
          <div v-for="template in templates" :key="template.name" class="template-item" @click="applyTemplate(template)">
            <div class="template-icon">
              <el-icon :size="18"><component :is="template.icon" /></el-icon>
            </div>
            <div class="template-info">
              <div class="template-name">{{ template.name }}</div>
              <div class="template-desc">{{ template.description }}</div>
            </div>
          </div>
        </el-card>

        <el-card class="panel-card dashboard-card mt-16" shadow="never">
          <template #header>
            <div class="panel-header">
              <span>订阅推送</span>
              <el-button type="danger" size="small" @click="openSubscribe">新增订阅</el-button>
            </div>
          </template>
          <div v-for="sub in subscriptions" :key="sub.name" class="coop-item">
            <div class="coop-item-icon"><el-icon :size="16"><Promotion /></el-icon></div>
            <div class="coop-item-info">
              <div class="coop-item-name">{{ sub.name }}</div>
              <div class="coop-item-desc">{{ sub.desc }} · {{ sub.channel }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog v-model="createVisible" title="生成新报告" width="560px">
      <el-form :model="createForm" label-width="100px">
        <el-form-item label="报告名称">
          <el-input v-model="createForm.name" />
        </el-form-item>
        <el-form-item label="生成频度">
          <el-select v-model="createForm.freq" class="w-full">
            <el-option v-for="freq in freqs" :key="freq" :label="freq" :value="freq" />
          </el-select>
        </el-form-item>
        <el-form-item label="统计维度">
          <el-select v-model="createForm.dimension" class="w-full">
            <el-option label="按业务域" value="按业务域" />
            <el-option label="按组织单位" value="按组织单位" />
            <el-option label="按系统" value="按系统" />
            <el-option label="按表/字段" value="按表/字段" />
          </el-select>
        </el-form-item>
        <el-form-item label="报告模板">
          <el-select v-model="createForm.template" class="w-full">
            <el-option v-for="template in templates" :key="template.name" :label="template.name" :value="template.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="订阅推送">
          <el-checkbox v-model="createForm.subscribe">生成后自动推送给订阅人</el-checkbox>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="createVisible = false">取消</el-button>
        <el-button type="danger" @click="saveCreate">生成</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="previewVisible" title="报告预览" width="720px">
      <div class="report-preview">
        <div class="preview-title">{{ preview.name }}（{{ preview.freq }}）</div>
        <div class="preview-meta">生成时间：{{ preview.generatedAt }} ｜ 统计维度：{{ preview.dimension }} ｜ 创建人：{{ preview.creator }}</div>
        <div class="preview-summary">同比：{{ preview.summary }}</div>
        <div class="preview-section">一、总体质量概况</div>
        <div class="preview-item" v-for="item in previewItems" :key="item.label">
          <span class="preview-item-label">{{ item.label }}</span>
          <el-progress :percentage="item.value" :color="item.value >= 90 ? '#00A854' : item.value >= 80 ? '#2B6CB0' : '#ED7B2F'" :stroke-width="10" />
        </div>
      </div>
    </el-dialog>

    <el-dialog v-model="subscribeVisible" title="新增订阅" width="520px">
      <el-form :model="subscribeForm" label-width="100px">
        <el-form-item label="订阅对象">
          <el-select v-model="subscribeForm.target" class="w-full">
            <el-option v-for="freq in freqs" :key="freq" :label="freq" :value="freq" />
          </el-select>
        </el-form-item>
        <el-form-item label="推送渠道">
          <el-checkbox-group v-model="subscribeForm.channel">
            <el-checkbox value="站内" />
            <el-checkbox value="邮件" />
            <el-checkbox value="短信" />
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="接收人">
          <el-select v-model="subscribeForm.users" class="w-full" multiple>
            <el-option v-for="user in ['张三', '李四', '王五', '赵六']" :key="user" :label="user" :value="user" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="subscribeVisible = false">取消</el-button>
        <el-button type="danger" @click="saveSubscribe">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { ArrowDown, Calendar, DocumentCopy, Plus, Promotion, Search, TrendCharts } from '@element-plus/icons-vue'
import { mockQualityTasks } from '@/mock/quality'

const freqs = ['日报告', '周报告', '月报告', '季度报告', '年度报告']

const reportNames = ['数据质量周报', '数据质量月报', '票务域质量日报', '设备域季度报告', '年度质量总报告']

const reports = ref(
  mockQualityTasks.slice(0, 56).map((task, index) => ({
    id: `rp-${index + 1}`,
    name: reportNames[index % reportNames.length],
    freq: freqs[index % freqs.length],
    dimension: ['按业务域', '按组织单位', '按系统', '按表/字段'][index % 4],
    generatedAt: task.lastRunTime,
    creator: task.owner,
    summary: `${90 - (index % 8)}.${index % 10} 分，共检查 ${task.passCount.toLocaleString()} 条数据`,
    templateName: '标准质量报告',
  })),
)

const templates = [
  { name: '标准质量报告', description: '五维度评分 + 明细', icon: DocumentCopy },
  { name: '日报速览模板', description: '核心指标快速呈现', icon: Calendar },
  { name: '趋势分析模板', description: '多维趋势与预测', icon: TrendCharts },
]

const subscriptions = [
  { name: '月度质量报告订阅', desc: '每月 1 日 09:00 推送', channel: '邮件 + 站内' },
  { name: '票务域日报订阅', desc: '每日 08:30 推送', channel: '邮件' },
  { name: '季度合规报告订阅', desc: '每季度初推送', channel: '站内' },
]

const keyword = ref('')
const filterFreq = ref('')
const createVisible = ref(false)
const previewVisible = ref(false)
const subscribeVisible = ref(false)

const preview = ref<(typeof reports.value)[number]>(reports.value[0])
const previewItems = [
  { label: '完整性', value: 95 },
  { label: '准确性', value: 91 },
  { label: '一致性', value: 89 },
  { label: '唯一性', value: 94 },
  { label: '及时性', value: 92 },
]

const createForm = reactive({
  name: '',
  freq: '月报告',
  dimension: '按业务域',
  template: '标准质量报告',
  subscribe: true,
})

const subscribeForm = reactive({
  target: '月报告',
  channel: ['邮件'] as string[],
  users: ['张三'] as string[],
})

const filteredReports = computed(() =>
  reports.value.filter((report) => {
    if (filterFreq.value && report.freq !== filterFreq.value) return false
    if (!keyword.value) return true
    return report.name.toLowerCase().includes(keyword.value.toLowerCase())
  }),
)

const openCreate = () => {
  Object.assign(createForm, { name: '', freq: '月报告', dimension: '按业务域', template: '标准质量报告', subscribe: true })
  createVisible.value = true
}

const saveCreate = () => {
  if (!createForm.name.trim()) {
    ElMessage.warning('请输入报告名称')
    return
  }
  reports.value.unshift({
    id: `rp-mock-${Date.now()}`,
    name: createForm.name,
    freq: createForm.freq,
    dimension: createForm.dimension,
    generatedAt: new Date().toLocaleString('sv-SE').replace('T', ' '),
    creator: '张三',
    summary: '新报告生成中，请稍后刷新',
    templateName: createForm.template,
  })
  createVisible.value = false
  ElMessage.success(`报告「${createForm.name}」已开始生成（Mock）`)
}

const exportReport = (row: (typeof reports.value)[number], format: string) => {
  ElMessage.success(`报告「${row.name}」已导出为 ${format} 格式（Mock）`)
}

const previewReport = (row: (typeof reports.value)[number]) => {
  preview.value = row
  previewVisible.value = true
}

const regenerate = (row: (typeof reports.value)[number]) => {
  row.generatedAt = new Date().toLocaleString('sv-SE').replace('T', ' ')
  ElMessage.success(`报告「${row.name}」已重新生成（Mock）`)
}

const applyTemplate = (template: (typeof templates)[number]) => {
  createForm.template = template.name
  ElMessage.success(`已选择报告模板「${template.name}」`)
}

const openSubscribe = () => {
  Object.assign(subscribeForm, { target: '月报告', channel: ['邮件'], users: ['张三'] })
  subscribeVisible.value = true
}

const saveSubscribe = () => {
  subscribeVisible.value = false
  ElMessage.success('订阅推送已配置（Mock）')
}
</script>