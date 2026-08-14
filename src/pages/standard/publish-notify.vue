<template>
  <div class="standard-page">
    <el-row :gutter="16">
      <el-col :xs="24" :md="10">
        <el-card shadow="never">
          <div class="panel-header">发布范围配置</div>
          <el-form label-width="80px" class="notify-form">
            <el-form-item label="发布标准">
              <el-select v-model="publishTarget" class="w-full">
                <el-option label="STD-KG-001 城市轨道交通数据元_线路基础信息" value="s1" />
                <el-option label="STD-KG-002 车站编码规范_V2.1" value="s2" />
                <el-option label="STD-KG-004 客流断面统计指标" value="s3" />
              </el-select>
            </el-form-item>
            <el-form-item label="按角色">
              <el-select v-model="roles" multiple class="w-full" placeholder="选择接收角色">
                <el-option v-for="r in roleOptions" :key="r.value" :label="r.label" :value="r.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="按部门">
              <el-tree
                v-model:checked-keys="deptKeys"
                :data="deptTree"
                show-checkbox
                node-key="id"
                default-expand-all
                class="dept-tree"
              />
            </el-form-item>
            <el-form-item label="通知渠道">
              <el-checkbox-group v-model="channels">
                <el-checkbox value="site">站内信</el-checkbox>
                <el-checkbox value="mail">邮件</el-checkbox>
                <el-checkbox value="wechat">企业微信</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="通知时机">
              <el-radio-group v-model="timing">
                <el-radio value="immediate">发布即通知</el-radio>
                <el-radio value="schedule">定时通知</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
          <div class="notify-actions">
            <el-button>存草稿</el-button>
            <el-button type="primary" @click="publishNow">立即发布并通知</el-button>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :md="14">
        <el-card shadow="never">
          <div class="panel-header">
            通知模板
            <el-button size="small" type="primary" plain @click="resetTemplate">恢复默认</el-button>
          </div>
          <el-input v-model="template.title" class="mt-8" placeholder="模板标题" />
          <el-input v-model="template.body" class="mt-8" type="textarea" :rows="6" placeholder="模板正文（支持占位符 {{标准名称}}）" />
          <div class="tmpl-preview mt-12">
            <div class="pv-title">{{ template.title || '标准发布通知' }}</div>
            <div class="pv-body">
              <p>尊敬的同事：</p>
              <p>数据标准 <b>{{ publishTargetLabel }}</b> 已通过审批并正式发布，自发布之日起在各系统生效，请相关责任人及时查阅并按标准执行。</p>
              <p class="pv-foot">数据治理委员会 · 2026-06-16</p>
            </div>
          </div>
        </el-card>

        <el-card shadow="never" class="mt-16">
          <div class="panel-header">发布记录跟踪</div>
          <el-table :data="records" stripe height="300">
            <el-table-column prop="target" label="发布标准" min-width="180" show-overflow-tooltip />
            <el-table-column prop="time" label="发布时间" width="130" />
            <el-table-column prop="scope" label="通知范围" min-width="150" show-overflow-tooltip />
            <el-table-column label="通知人数" width="90">
              <template #default="{ row }"><b>{{ row.notified }}</b></template>
            </el-table-column>
            <el-table-column label="已读" width="90">
              <template #default="{ row }">{{ row.read }}</template>
            </el-table-column>
            <el-table-column label="状态" width="90">
              <template #default="{ row }">
                <el-tag :type="row.status === '已完成' ? 'success' : 'primary'" size="small">{{ row.status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="90" fixed="right">
              <template #default>
                <el-button link type="primary" size="small">查看回执</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'

const publishTarget = ref('s1')
const roles = ref<string[]>([])
const deptKeys = ref<number[]>([])
const channels = ref<string[]>(['site', 'mail'])
const timing = ref('immediate')
const template = ref({ title: '【标准发布】{{标准名称}} 正式发布通知', body: '' })

const roleOptions = [
  { label: '数据标准管理员', value: 'r1' },
  { label: '数据架构师', value: 'r2' },
  { label: '数据开发工程师', value: 'r3' },
  { label: '数据质量负责人', value: 'r4' },
  { label: '业务部门接口人', value: 'r5' },
]

const deptTree = [
  { id: 1, label: '运营总部', children: [
    { id: 11, label: '运营调度中心' },
    { id: 12, label: '票务收益中心' },
    { id: 13, label: '客运管理部' },
  ]},
  { id: 2, label: '建设总部', children: [
    { id: 21, label: '工程管理部' },
    { id: 22, label: '机电设备部' },
  ]},
  { id: 3, label: '数字化中心', children: [
    { id: 31, label: '数据管理部' },
    { id: 32, label: '研发部' },
  ]},
]

const records = [
  { target: 'STD-KG-001 线路基础信息数据元', time: '2026-05-12 09:41', scope: '数据架构师 / 数字化中心', notified: 38, read: 36, status: '已完成' },
  { target: 'STD-KG-004 客流断面统计指标', time: '2026-05-08 14:18', scope: '运营调度中心 / 票务收益中心', notified: 52, read: 48, status: '已完成' },
  { target: 'STD-KG-002 车站编码规范_V2.1', time: '2026-05-14 10:02', scope: '全部角色 / 全部部门', notified: 120, read: 87, status: '通知中' },
]

const publishTargetLabel = computed(() => {
  const map: Record<string, string> = {
    s1: 'STD-KG-001 城市轨道交通数据元_线路基础信息',
    s2: 'STD-KG-002 车站编码规范_V2.1',
    s3: 'STD-KG-004 客流断面统计指标',
  }
  return map[publishTarget.value] || ''
})

function resetTemplate() {
  template.value = { title: '【标准发布】{{标准名称}} 正式发布通知', body: '' }
  ElMessage.info('已恢复默认模板')
}

function publishNow() {
  if (!channels.value.length) {
    ElMessage.warning('请至少选择一个通知渠道')
    return
  }
  ElMessage.success(`已发布并通知「${publishTargetLabel}」，通知范围 ${roles.value.length} 个角色 + ${deptKeys.value.length} 个部门`)
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

.notify-form {
  margin-top: 8px;
}

.dept-tree {
  width: 100%;
  max-height: 220px;
  overflow-y: auto;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  padding: 6px;
}

.notify-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 8px;
}

.mt-8 {
  margin-top: 8px;
}

.mt-12 {
  margin-top: 12px;
}

.mt-16 {
  margin-top: 16px;
}

.w-full {
  width: 100%;
}

.tmpl-preview {
  border: 1px dashed #e4e7ed;
  border-radius: 8px;
  padding: 14px 18px;
  background: #fafbfc;
}

.pv-title {
  font-weight: 700;
  font-size: 14px;
  color: #4a4a4a;
  margin-bottom: 8px;
}

.pv-body p {
  margin: 6px 0;
  color: #4a4a4a;
  font-size: 13px;
  line-height: 1.7;
}

.pv-foot {
  color: #8c8c8c;
  font-size: 12px;
}
</style>