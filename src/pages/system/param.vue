<template>
  <div class="standard-page">
    <el-card shadow="never">
      <div class="panel-header">
        系统参数管理
        <div class="panel-actions">
          <el-input v-model="keyword" placeholder="搜索参数" clearable class="search-input" />
          <el-button type="primary" plain>修改留痕</el-button>
        </div>
      </div>

      <el-tabs v-model="activeTab">
        <el-tab-pane v-for="c in categories" :key="c.key" :label="`${c.label}（${paramCount(c.key)}）`" :name="c.key">
          <el-table :data="paramsByCat(c.key)" stripe height="420">
            <el-table-column prop="key" label="参数键" min-width="190" show-overflow-tooltip />
            <el-table-column prop="name" label="参数名称" min-width="150" show-overflow-tooltip />
            <el-table-column prop="value" label="当前值" min-width="160" show-overflow-tooltip />
            <el-table-column label="生效方式" width="140">
              <template #default="{ row }">
                <el-tag :type="row.effect === '热生效' ? 'success' : 'info'" size="small" effect="light">{{ row.effect }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="updatedBy" label="最近修改人" width="110" />
            <el-table-column prop="updatedAt" label="修改时间" width="130" />
            <el-table-column label="操作" width="140" fixed="right">
              <template #default="{ row }">
                <el-button link type="primary" size="small" @click="editParam(row)">编辑</el-button>
                <el-button link type="info" size="small">历史</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>

      <el-dialog v-model="editVisible" title="编辑参数" width="480px">
        <el-form label-width="100px">
          <el-form-item label="参数键">{{ editing?.key }}</el-form-item>
          <el-form-item label="参数值">
            <el-input v-model="editingValue" />
          </el-form-item>
          <el-form-item label="生效方式">
            <el-tag size="small" :type="editing?.effect === '热生效' ? 'success' : 'info'" effect="light">{{ editing?.effect }}</el-tag>
          </el-form-item>
        </el-form>
        <el-alert title="参数修改将全程留痕，需填写变更说明" type="info" :closable="false" show-icon />
        <el-form label-width="100px" class="mt-12">
          <el-form-item label="变更说明">
            <el-input v-model="editNote" type="textarea" :rows="2" placeholder="填写修改原因" />
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="editVisible = false">取消</el-button>
          <el-button type="primary" @click="saveParam">保存</el-button>
        </template>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const activeTab = ref('system')
const keyword = ref('')
const categories = [
  { key: 'system', label: '系统参数' },
  { key: 'business', label: '业务参数' },
  { key: 'process', label: '流程参数' },
]

type Param = { key: string; name: string; value: string; effect: string; updatedBy: string; updatedAt: string; cat: string }

const params: Param[] = [
  { key: 'sys.session.timeout', name: '会话超时', value: '30 分钟', effect: '热生效', updatedBy: '管理员', updatedAt: '2026-05-18', cat: 'system' },
  { key: 'sys.pwd.complexity', name: '密码复杂度策略', value: '8-20 位含大小写数字', effect: '重启生效', updatedBy: '管理员', updatedAt: '2026-03-10', cat: 'system' },
  { key: 'sys.log.retention', name: '操作日志保留期', value: '180 天', effect: '重启生效', updatedBy: '安全组', updatedAt: '2026-04-22', cat: 'system' },
  { key: 'sys.upload.maxsize', name: '上传大小限制', value: '200 MB', effect: '热生效', updatedBy: '管理员', updatedAt: '2026-06-02', cat: 'system' },
  { key: 'biz.preview.rows', name: '预览最大行数', value: '1000', effect: '热生效', updatedBy: '数据组', updatedAt: '2026-05-30', cat: 'business' },
  { key: 'biz.grade.default', name: '默认数据分级', value: 'L2', effect: '热生效', updatedBy: '数据组', updatedAt: '2026-05-26', cat: 'business' },
  { key: 'biz.quality.threshold', name: '质量通过率阈值', value: '95%', effect: '热生效', updatedBy: '质量组', updatedAt: '2026-06-08', cat: 'business' },
  { key: 'proc.perm.approve', name: '权限审批人', value: '部门负责人', effect: '重启生效', updatedBy: '管理员', updatedAt: '2026-04-15', cat: 'process' },
  { key: 'proc.schedule.retry', name: '调度失败重试次数', value: '3 次', effect: '热生效', updatedBy: '开发组', updatedAt: '2026-06-01', cat: 'process' },
]

const filtered = ref<Param[]>(params)

const editVisible = ref(false)
const editing = ref<Param | null>(null)
const editingValue = ref('')
const editNote = ref('')

function paramsByCat(cat: string) {
  if (!keyword.value) return params.filter((p) => p.cat === cat)
  return params.filter((p) => p.cat === cat && (p.key.includes(keyword.value) || p.name.includes(keyword.value)))
}

function paramCount(cat: string) {
  return params.filter((p) => p.cat === cat).length
}

function editParam(row: Param) {
  editing.value = row
  editingValue.value = row.value
  editNote.value = ''
  editVisible.value = true
}

function saveParam() {
  ElMessage.success(`参数已保存（${editing.value?.key}），留痕完成`)
  editVisible.value = false
}
</script>

<style scoped>
.standard-page {
  display: grid;
  gap: 16px;
}

.mt-12 {
  margin-top: 12px;
}
</style>