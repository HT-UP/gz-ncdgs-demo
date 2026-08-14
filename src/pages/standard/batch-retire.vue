<template>
  <div class="standard-page">
    <el-card shadow="never">
      <div class="panel-header">批量废止流程（选择 → 引用检查 → 批量审批 → 废止执行）</div>
      <el-steps :active="step" align-center finish-status="success" class="retire-steps">
        <el-step title="批量选择" description="选取待废止标准" />
        <el-step title="引用检查" description="扫描下游引用" />
        <el-step title="批量审批" description="填报审批意见" />
        <el-step title="废止执行" description="执行与归档" />
      </el-steps>
    </el-card>

    <el-card shadow="never">
      <template v-if="step === 0">
        <div class="panel-header">
          待废止标准
          <div class="panel-actions">
            <el-button :disabled="!selectedSet.size" type="primary" @click="nextStep">下一步：引用检查</el-button>
          </div>
        </div>
        <el-table :data="standards" stripe height="360" @selection-change="onSelect">
          <el-table-column type="selection" width="46" />
          <el-table-column prop="code" label="标准编号" width="150" />
          <el-table-column prop="name" label="标准名称" min-width="200" show-overflow-tooltip />
          <el-table-column prop="type" label="类型" width="110" />
          <el-table-column prop="state" label="当前状态" width="100" />
          <el-table-column prop="owner" label="负责人" width="100" />
          <el-table-column prop="updateTime" label="最近更新" width="120" />
        </el-table>
      </template>

      <template v-else-if="step === 1">
        <div class="panel-header">
          引用检查结果
          <div class="panel-actions">
            <el-button @click="step = 0">上一步</el-button>
            <el-button type="primary" @click="step = 2">下一步：批量审批</el-button>
          </div>
        </div>
        <el-table :data="refChecks" stripe height="360">
          <el-table-column prop="code" label="标准编号" width="150" />
          <el-table-column prop="name" label="标准名称" min-width="180" show-overflow-tooltip />
          <el-table-column label="被引用对象" min-width="260">
            <template #default="{ row }">
              <div class="ref-tags">
                <el-tag v-for="t in row.refs" :key="t.name" size="small" type="info" effect="plain">
                  {{ t.name }} × {{ t.count }}
                </el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="引用风险" width="110">
            <template #default="{ row }">
              <el-tag :type="row.risk === '高' ? 'danger' : row.risk === '中' ? 'warning' : 'success'" effect="light">
                {{ row.risk }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="建议" min-width="160" show-overflow-tooltip>
            <template #default="{ row }">
              <span class="ref-advice">{{ row.advice }}</span>
            </template>
          </el-table-column>
        </el-table>
        <el-alert
          class="mt-12"
          type="warning"
          :closable="false"
          show-icon
          title="存在高风险引用"
          description="2 条标准仍被数据服务或日度任务引用，废止后可能影响下游运行，请在审批意见中备注处置方案。"
        />
      </template>

      <template v-else-if="step === 2">
        <div class="panel-header">
          批量审批
          <div class="panel-actions">
            <el-button @click="step = 1">上一步</el-button>
            <el-button type="primary" @click="doApprove">提交审批</el-button>
          </div>
        </div>
        <el-form label-width="96px" class="retire-form">
          <el-form-item label="审批人">
            <el-input v-model="approver" placeholder="审批人姓名" />
          </el-form-item>
          <el-form-item label="审批意见">
            <el-input v-model="approveComment" type="textarea" :rows="4" placeholder="填写批量废止审批意见" />
          </el-form-item>
          <el-form-item label="审批方式">
            <el-radio-group v-model="approveMode">
              <el-radio value="batch">批量统一意见</el-radio>
              <el-radio value="per">逐条签署</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="废止原因">
            <el-select v-model="retireReason" class="w-full">
              <el-option label="标准修订升级" value="upgrade" />
              <el-option label="业务取消" value="business" />
              <el-option label="规则合并" value="merge" />
              <el-option label="重复标准" value="duplicate" />
            </el-select>
          </el-form-item>
        </el-form>
      </template>

      <template v-else>
        <div class="panel-header">废止执行</div>
        <div class="exec-console">
          <div v-for="s in selectedList" :key="s.id" class="exec-item">
            <span class="exec-code">{{ s.code }}</span>
            <span class="exec-progress">
              <el-progress :percentage="successItems.has(s.id) ? 100 : runningId === s.id ? 60 : 0" :stroke-width="8" />
            </span>
            <span class="exec-state">{{ successItems.has(s.id) ? '已废止' : runningId === s.id ? '执行中' : '等待' }}</span>
          </div>
          <el-button v-if="!done" type="danger" class="mt-12" @click="runRetire">开始执行</el-button>
          <el-alert v-else class="mt-12" type="success" :closable="false" show-icon title="废止完成"
            :description="`已废止 ${successItems.size} 条标准，并生成版本快照 ${done ? '2.0.0-archived' : ''}`" />
        </div>
      </template>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'

type Std = { id: number; code: string; name: string; type: string; state: string; owner: string; updateTime: string }

const step = ref(0)
const selectedSet = ref<Set<number>>(new Set())
const selectedList = ref<Std[]>([])
const importValue = ref(0)
const standards: Std[] = [
  { id: 1, code: 'STD-KG-101', name: '旧版售检票数据元（V1.0）', type: '数据元', state: '已发布', owner: '钱工', updateTime: '2025-08-15' },
  { id: 2, code: 'STD-KG-102', name: '信号联锁编码（旧）', type: '编码', state: '已发布', owner: '孙工', updateTime: '2025-07-20' },
  { id: 3, code: 'STD-KG-103', name: '能耗统计指标（停用）', type: '指标', state: '待审核', owner: '李工', updateTime: '2025-06-30' },
  { id: 4, code: 'STD-KG-104', name: '车辆检修周期字典（过期）', type: '编码', state: '已发布', owner: '周工', updateTime: '2025-09-02' },
  { id: 5, code: 'STD-KG-105', name: '客流仿真参数数据元', type: '数据元', state: '已发布', owner: '王工', updateTime: '2025-10-11' },
]

const refChecks = computed(() =>
  selectedList.value.map((s, i) => ({
    code: s.code,
    name: s.name,
    refs: [
      { name: '物理模型', count: i % 2 === 0 ? 3 : 0 },
      { name: '数据开发任务', count: i % 3 === 0 ? 5 : 1 },
      { name: '数据服务', count: i === 0 ? 4 : 0 },
    ].filter((r) => r.count > 0),
    risk: i === 0 || i === 2 ? '高' : i === 1 ? '中' : '低',
    advice: i === 0 ? '已有替代标准，建议同步重绑定' : i === 2 ? '涉及方案调整，请确认' : '直接废止',
  })),
)

const approver = ref('')
const approveComment = ref('')
const approveMode = ref<'batch' | 'per'>('batch')
const retireReason = ref('upgrade')

const runningId = ref<number | null>(null)
const successItems = ref<Set<number>>(new Set())
const done = ref(false)

function onSelect(sel: Std[]) {
  selectedSet.value = new Set(sel.map((s) => s.id))
  selectedList.value = sel
}

function nextStep() {
  if (!selectedSet.value.size) {
    ElMessage.warning('请先选择待废止标准')
    return
  }
  step.value = 1
}

function doApprove() {
  if (!approver.value || !approveComment.value) {
    ElMessage.warning('请填写审批人与审批意见')
    return
  }
  ElMessage.success('审批已提交，进入废止执行')
  step.value = 3
}

async function runRetire() {
  done.value = false
  successItems.value = new Set()
  for (const s of selectedList.value) {
    runningId.value = s.id
    await new Promise((r) => setTimeout(r, 420))
    successItems.value.add(s.id)
  }
  runningId.value = null
  done.value = true
  ElMessage.success('批量废止执行完成')
}
</script>

<style scoped>
.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.retire-steps {
  margin: 12px 0 4px;
}

.ref-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.ref-advice {
  color: #4a4a4a;
  font-size: 12px;
}

.retire-form {
  max-width: 640px;
  margin-top: 8px;
}

.exec-console {
  display: grid;
  gap: 14px;
  padding: 4px 2px;
}

.exec-item {
  display: flex;
  align-items: center;
  gap: 16px;
}

.exec-code {
  width: 160px;
  flex: none;
  font-weight: 600;
  font-size: 13px;
  color: #4a4a4a;
}

.exec-progress {
  flex: 1;
  min-width: 0;
}

.exec-state {
  width: 56px;
  flex: none;
  text-align: right;
  font-size: 12px;
  color: #8c8c8c;
}

.mt-12 {
  margin-top: 12px;
}
</style>