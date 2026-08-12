<template>
  <div class="standard-page">
    <el-row :gutter="16">
      <el-col :span="16">
        <el-card class="panel-card dashboard-card" shadow="never">
          <template #header>
            <div class="panel-header">
              <span>{{ activeTab === 'approval' ? '待审批列表' : '数据申请列表' }}</span>
              <el-button type="danger" :icon="Plus" @click="openCreate">创建数据申请</el-button>
            </div>
          </template>

          <el-tabs v-model="activeTab" @tab-change="() => {}">
            <el-tab-pane label="我的申请" name="mine" />
            <el-tab-pane label="全部申请" name="all" />
            <el-tab-pane label="待审批" name="approval" />
          </el-tabs>

          <div class="toolbar-row">
            <el-input
              v-model="keyword"
              placeholder="按资源 / 申请人搜索"
              clearable
              class="search-input"
              :prefix-icon="Search"
            />
            <el-select v-model="filterStatus" placeholder="状态" clearable class="filter-select">
              <el-option label="已批准" value="已批准" />
              <el-option label="待审批" value="待审批" />
              <el-option label="已驳回" value="已驳回" />
              <el-option label="已到期" value="已到期" />
            </el-select>
            <el-button v-if="activeTab === 'approval'" type="success" :icon="CircleCheck" @click="batchApprove">批量通过</el-button>
          </div>

          <el-table :data="filteredList" stripe class="mt-12">
            <el-table-column v-if="activeTab === 'approval'" type="selection" width="44" />
            <el-table-column prop="id" label="工单号" width="110" />
            <el-table-column prop="applicant" label="申请人" width="80" />
            <el-table-column prop="resourceName" label="资源" min-width="140" />
            <el-table-column label="权限类型" width="80">
              <template #default="{ row }">
                <el-tag :type="row.permType === '读' ? 'primary' : row.permType === '写' ? 'warning' : 'danger'" effect="plain">
                  {{ row.permType }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="reason" label="申请理由" min-width="130" />
            <el-table-column label="有效期" width="170">
              <template #default="{ row }">{{ row.effectiveDate }} 至 {{ row.expireDate }}</template>
            </el-table-column>
            <el-table-column label="状态" width="90">
              <template #default="{ row }">
                <el-tag :type="statusTagType[row.status]" effect="dark">{{ row.status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column v-if="activeTab !== 'approval'" label="操作" width="110" fixed="right">
              <template #default="{ row }">
                <el-button v-if="row.status === '已批准'" link type="warning" @click="renew(row)">续期</el-button>
                <el-button link type="primary" @click="viewOpinion(row)">详情</el-button>
              </template>
            </el-table-column>
            <el-table-column v-else label="操作" width="150" fixed="right">
              <template #default="{ row }">
                <el-button link type="success" @click="approve(row, true)">通过</el-button>
                <el-button link type="danger" @click="approve(row, false)">驳回</el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-pagination class="pager" layout="total, prev, pager, next" :total="filteredList.length" :page-size="20" background />
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card class="panel-card dashboard-card" shadow="never">
          <template #header>
            <div class="panel-header"><span>待申请推荐资源</span></div>
          </template>
          <div v-for="resource in recommendations" :key="resource.id" class="rec-item">
            <div class="rec-info">
              <div class="rec-name">{{ resource.name }}</div>
              <div class="rec-desc">{{ resource.catalog }} · {{ resource.frequency }}</div>
            </div>
            <el-button link type="danger" size="small" @click="quickApply(resource)">申请</el-button>
          </div>
        </el-card>

        <el-card class="panel-card dashboard-card mt-16" shadow="never">
          <template #header>
            <div class="panel-header"><span>权限状态统计</span></div>
          </template>
          <div class="overview-chips">
            <div class="chip chip-green">
              <div class="chip-value">62</div>
              <div class="chip-label">已批准</div>
            </div>
            <div class="chip chip-orange">
              <div class="chip-value">31</div>
              <div class="chip-label">待审批</div>
            </div>
            <div class="chip chip-red">
              <div class="chip-value">13</div>
              <div class="chip-label">已驳回</div>
            </div>
          </div>
          <el-divider />
          <div class="section-title">到期提醒</div>
          <div class="dep-text mt-6">3 项权限将于 7 天内到期，请及时续期（Mock）</div>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog v-model="createVisible" title="创建数据申请工单" width="600px">
      <el-form :model="createForm" label-width="100px">
        <el-form-item label="选择资源">
          <el-select v-model="createForm.resource" filterable class="w-full">
            <el-option v-for="resource in resourcePool" :key="resource" :label="resource" :value="resource" />
          </el-select>
        </el-form-item>
        <el-form-item label="权限类型">
          <el-radio-group v-model="createForm.permType">
            <el-radio value="读">读</el-radio>
            <el-radio value="写">写</el-radio>
            <el-radio value="全部">全部</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="申请理由">
          <el-input v-model="createForm.reason" type="textarea" :rows="3" placeholder="请填写申请用途" />
        </el-form-item>
        <el-form-item label="有效期">
          <el-date-picker
            v-model="createForm.range"
            type="daterange"
            start-placeholder="生效日期"
            end-placeholder="截止日期"
            class="w-full"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="createVisible = false">取消</el-button>
        <el-button type="danger" @click="submitCreate">提交申请</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { ElMessage, type ElTable } from 'element-plus'
import { CircleCheck, Plus, Search } from '@element-plus/icons-vue'
import { mockPermissions, type PermissionApplication } from '@/mock/resource'

const statusTagType: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
  已批准: 'success',
  待审批: 'warning',
  已驳回: 'danger',
  已到期: 'info',
}

const activeTab = ref('mine')
const keyword = ref('')
const filterStatus = ref('')
const createVisible = ref(false)

const applications = ref([...mockPermissions])

const resourcePool = ['ticket_sale_detail', 'passenger_info', 'flow_stat_daily', 'device_status_log', 'station_info', 'line_info']

const recommendations = [
  { id: 1, name: 'ticket_sale_detail', catalog: 'DWD 明细层', frequency: '日更 52 万行', approved: false },
  { id: 2, name: 'flow_stat_daily', catalog: 'DWS 汇总层', frequency: '日更 1.2 万行', approved: false },
  { id: 3, name: 'station_info', catalog: 'ODS 贴源层', frequency: '低频', approved: false },
  { id: 4, name: 'device_status_log', catalog: 'DWD 明细层', frequency: '小时级', approved: true },
  { id: 5, name: 'train_operation_log', catalog: 'DWD 明细层', frequency: '事件型', approved: false },
]

const createForm = reactive({
  resource: 'ticket_sale_detail',
  permType: '读',
  reason: '',
  range: [] as string[],
})

const filteredList = computed(() => {
  let source: PermissionApplication[]
  if (activeTab.value === 'mine') source = applications.value.filter((item) => item.applicant === '张三')
  else if (activeTab.value === 'approval') source = applications.value.filter((item) => item.status === '待审批')
  else source = applications.value

  return source.filter((item) => {
    if (filterStatus.value && item.status !== filterStatus.value) return false
    if (!keyword.value) return true
    const kw = keyword.value.toLowerCase()
    return item.resourceName.toLowerCase().includes(kw) || item.applicant.toLowerCase().includes(kw)
  })
})

const openCreate = () => {
  Object.assign(createForm, { resource: 'ticket_sale_detail', permType: '读', reason: '', range: [] as string[] })
  createVisible.value = true
}

const submitCreate = () => {
  if (!createForm.reason.trim()) {
    ElMessage.warning('请填写申请理由')
    return
  }
  applications.value.unshift({
    id: `perm-mock-${Date.now()}`,
    applicant: '张三',
    resourceName: createForm.resource,
    resourceType: '表',
    permType: createForm.permType as PermissionApplication['permType'],
    reason: createForm.reason,
    effectiveDate: createForm.range[0] ?? '2026-08-12',
    expireDate: createForm.range[1] ?? '2026-09-12',
    status: '待审批',
    applyTime: new Date().toLocaleString('sv-SE').replace('T', ' '),
  })
  createVisible.value = false
  ElMessage.success('申请工单已提交，等待审批（Mock）')
}

const approve = (row: PermissionApplication, pass: boolean) => {
  row.status = pass ? '已批准' : '已驳回'
  row.approver = '王工'
  row.opinion = pass ? '用途合理，同意' : '材料不足，已驳回'
  ElMessage[pass ? 'success' : 'warning'](`工单 ${row.id} 已${pass ? '通过' : '驳回'}（Mock）`)
}

const batchApprove = () => ElMessage.success('已批量通过选中申请工单（Mock）')

const renew = (row: PermissionApplication) => {
  row.status = '待审批'
  ElMessage.info(`「${row.resourceName}」续期申请已提交，等待审批（Mock）`)
}

const viewOpinion = (row: PermissionApplication) => {
  ElMessage.info(`审批意见：${row.opinion ?? '暂无意见'} | 审批人：${row.approver ?? '-'} | 消息已通过站内信通知（Mock）`)
}

const quickApply = (resource: (typeof recommendations)[number]) => {
  recommendations[resource.id - 1].approved = true
  ElMessage.success(`已快速申请「${resource.name}」读权限（Mock）`)
}
</script>