<template>
  <div class="standard-page">
    <el-row :gutter="16">
      <el-col :span="16">
        <el-card class="panel-card dashboard-card" shadow="never">
          <template #header>
            <div class="panel-header">
              <span>版本历史</span>
              <el-button type="danger" :icon="Plus" @click="openChange">发起变更</el-button>
            </div>
          </template>

          <div class="toolbar-row">
            <el-input
              v-model="keyword"
              placeholder="按标准名称 / 编码搜索"
              clearable
              class="search-input"
              :prefix-icon="Search"
            />
            <el-select v-model="filterStage" placeholder="变更阶段" clearable class="filter-select">
              <el-option label="申请中" value="申请中" />
              <el-option label="审批中" value="审批中" />
              <el-option label="已实施" value="已实施" />
            </el-select>
          </div>

          <el-table :data="filteredVersions" stripe class="mt-12" @row-click="showVersion">
            <el-table-column prop="version" label="版本号" width="90" />
            <el-table-column prop="standardName" label="标准名称" min-width="180" />
            <el-table-column prop="standardCode" label="编码" width="110" />
            <el-table-column prop="stage" label="变更阶段" width="100">
              <template #default="{ row }">
                <el-tag :type="stageTagType[row.stage as keyof typeof stageTagType]" effect="dark">
                  {{ row.stage }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="changeType" label="变更类型" width="100" />
            <el-table-column prop="owner" label="申请人" width="90" />
            <el-table-column label="发布时间" width="150">
              <template #default="{ row }">{{ row.releaseTime }}</template>
            </el-table-column>
            <el-table-column label="操作" width="120" fixed="right">
              <template #default="{ row }">
                <el-button link type="danger" @click.stop="compareVersion(row)">版本对比</el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-pagination
            class="pager"
            layout="total, prev, pager, next"
            :total="filteredVersions.length"
            :page-size="20"
            background
          />
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card class="panel-card dashboard-card" shadow="never">
          <template #header>
            <div class="panel-header">
              <span>变更流程</span>
            </div>
          </template>
          <el-steps direction="vertical" :active="activeStep" finish-status="success">
            <el-step title="申请" description="填写变更内容与影响说明" />
            <el-step title="审批" description="评审委员会审批" />
            <el-step title="实施" description="发布新版本并通知" />
          </el-steps>
        </el-card>

        <el-card class="panel-card dashboard-card mt-16" shadow="never">
          <template #header>
            <div class="panel-header">
              <span>变更影响分析</span>
            </div>
          </template>
          <div class="impact-list">
            <div v-for="impact in impactItems" :key="impact.label" class="impact-item">
              <span>{{ impact.label }}</span>
              <el-tag :type="impact.count > 0 ? 'danger' : 'success'" effect="plain">
                {{ impact.count > 0 ? `${impact.count} 项受影响` : '无影响' }}
              </el-tag>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog v-model="compareVisible" :title="compareTitle" width="640px">
      <el-table :data="compareRows" border size="small">
        <el-table-column prop="field" label="字段" width="160" />
        <el-table-column label="旧版本" min-width="180">
          <template #default="{ row }">
            <span :class="{ 'diff-cell': row.changed }">{{ row.old }}</span>
          </template>
        </el-table-column>
        <el-table-column label="新版本" min-width="180">
          <template #default="{ row }">
            <span :class="{ 'diff-cell diff-cell--new': row.changed }">{{ row.new }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog v-model="changeVisible" title="发起变更申请" width="520px">
      <el-form :model="changeForm" label-width="90px">
        <el-form-item label="标准名称">
          <el-input v-model="changeForm.standardName" placeholder="选择或输入标准名称" />
        </el-form-item>
        <el-form-item label="变更类型">
          <el-select v-model="changeForm.changeType" class="w-full">
            <el-option label="字段调整" value="字段调整" />
            <el-option label="值域变更" value="值域变更" />
            <el-option label="名称修改" value="名称修改" />
            <el-option label="废止" value="废止" />
          </el-select>
        </el-form-item>
        <el-form-item label="变更说明">
          <el-input v-model="changeForm.description" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="changeVisible = false">取消</el-button>
        <el-button type="danger" @click="submitChange">提交申请</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, Search } from '@element-plus/icons-vue'

type VersionRow = {
  version: string
  standardName: string
  standardCode: string
  stage: string
  changeType: string
  owner: string
  releaseTime: string
}

const stageTagType = {
  申请中: 'warning',
  审批中: 'warning',
  已实施: 'success',
}

const keyword = ref('')
const filterStage = ref('')
const compareVisible = ref(false)
const compareTitle = ref('')
const changeVisible = ref(false)
const activeStep = ref(2)

const versions = ref<VersionRow[]>([
  { version: 'V2.1', standardName: '客户信息代码', standardCode: 'BZ-0001', stage: '已实施', changeType: '值域变更', owner: '张三', releaseTime: '2026-08-10 15:20' },
  { version: 'V2.0', standardName: '线路编码标准', standardCode: 'BZ-0007', stage: '已实施', changeType: '字段调整', owner: '李四', releaseTime: '2026-07-28 10:05' },
  { version: 'V1.3', standardName: '车站类型代码', standardCode: 'BZ-0013', stage: '审批中', changeType: '名称修改', owner: '王五', releaseTime: '2026-08-06 09:30' },
  { version: 'V1.2', standardName: '设备状态代码', standardCode: 'BZ-0026', stage: '已实施', changeType: '字段调整', owner: '赵六', releaseTime: '2026-07-15 14:45' },
  { version: 'V1.1', standardName: '工单类型标准', standardCode: 'BZ-0031', stage: '申请中', changeType: '值域变更', owner: '孙七', releaseTime: '2026-08-11 11:00' },
  { version: 'V1.0', standardName: '安全事件等级', standardCode: 'BZ-0042', stage: '已实施', changeType: '首次发布', owner: '张三', releaseTime: '2026-06-30 16:10' },
])

const impactItems = [
  { label: '关联数据模型', count: 3 },
  { label: '关联质量规则', count: 5 },
  { label: '字段映射关系', count: 12 },
  { label: '受影响业务系统', count: 2 },
]

const compareRows = [
  { field: '编码规则', old: 'BZ-XXXX 四位数字', new: 'BZ-XXXXX 五位数字', changed: true },
  { field: '值域范围', old: 'A-Z 单字符', new: 'A1-Z9 双字符', changed: true },
  { field: '责任人', old: '数据治理中心', new: '数据治理中心', changed: false },
  { field: '映射字段', old: '3 个', new: '3 个', changed: false },
]

const changeForm = reactive({
  standardName: '',
  changeType: '字段调整',
  description: '',
})

const filteredVersions = computed(() =>
  versions.value.filter((row) => {
    if (filterStage.value && row.stage !== filterStage.value) return false
    if (!keyword.value) return true
    const kw = keyword.value.toLowerCase()
    return (
      row.standardName.toLowerCase().includes(kw) || row.standardCode.toLowerCase().includes(kw)
    )
  }),
)

const showVersion = (row: VersionRow) => {
  ElMessage.info(`标准「${row.standardName}」${row.version} 版本详情（Mock）`)
}

const compareVersion = (row: VersionRow) => {
  compareTitle.value = `版本对比：${row.standardName} ${row.version} vs 上一版本`
  compareVisible.value = true
}

const openChange = () => {
  Object.assign(changeForm, { standardName: '', changeType: '字段调整', description: '' })
  changeVisible.value = true
}

const submitChange = () => {
  if (!changeForm.standardName.trim()) {
    ElMessage.warning('请输入标准名称')
    return
  }
  versions.value.unshift({
    version: `V${Math.random().toFixed(1)}`,
    standardName: changeForm.standardName,
    standardCode: `BZ-NEW-${versions.value.length + 1}`,
    stage: '申请中',
    changeType: changeForm.changeType,
    owner: '张三',
    releaseTime: new Date().toLocaleString('sv-SE').replace('T', ' '),
  })
  changeVisible.value = false
  ElMessage.success('变更申请已提交（Mock）')
}
</script>
