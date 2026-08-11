<template>
  <div class="standard-page">
    <el-card class="panel-card dashboard-card" shadow="never">
      <template #header>
        <div class="panel-header">
          <span>参数模板管理</span>
          <el-button type="danger" :icon="Plus" @click="openCreate">新增模板</el-button>
        </div>
      </template>

      <div class="toolbar-row">
        <el-input
          v-model="keyword"
          placeholder="按模板名称搜索"
          clearable
          class="search-input"
          :prefix-icon="Search"
        />
        <el-select v-model="filterEnv" placeholder="环境" clearable class="filter-select">
          <el-option label="生产" value="生产" />
          <el-option label="测试" value="测试" />
          <el-option label="开发" value="开发" />
        </el-select>
        <el-select v-model="filterType" placeholder="模板类型" clearable class="filter-select">
          <el-option label="MySQL" value="MySQL" />
          <el-option label="Oracle" value="Oracle" />
          <el-option label="Kafka" value="Kafka" />
          <el-option label="MongoDB" value="MongoDB" />
        </el-select>
      </div>

      <el-table :data="filteredTemplates" stripe class="mt-12">
        <el-table-column prop="name" label="模板名称" min-width="170" />
        <el-table-column prop="type" label="类型" width="100" />
        <el-table-column prop="env" label="环境" width="80">
          <template #default="{ row }">
            <el-tag :type="envTagType[row.env]" effect="dark">{{ row.env }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="version" label="版本" width="80" />
        <el-table-column label="驱动" width="90">
          <template #default="{ row }">
            <el-tag effect="plain" type="info">{{ row.driver }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="owner" label="维护人" width="90" />
        <el-table-column label="更新时间" width="150">
          <template #default="{ row }">{{ row.updateTime }}</template>
        </el-table-column>
        <el-table-column label="操作" width="240" fixed="right">
          <template #default="{ row }">
            <el-button link type="danger" @click="applyTemplate(row)">套用</el-button>
            <el-button link type="primary" @click="copyTemplate(row)">复制</el-button>
            <el-button link type="warning" @click="rollbackTemplate(row)">回滚</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination class="pager" layout="total, prev, pager, next" :total="filteredTemplates.length" :page-size="20" background />
    </el-card>

    <el-dialog v-model="editorVisible" title="新增参数模板" width="520px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="模板名称">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="form.type" class="w-full">
            <el-option label="MySQL" value="MySQL" />
            <el-option label="Oracle" value="Oracle" />
            <el-option label="Kafka" value="Kafka" />
            <el-option label="MongoDB" value="MongoDB" />
          </el-select>
        </el-form-item>
        <el-form-item label="环境">
          <el-select v-model="form.env" class="w-full">
            <el-option label="生产" value="生产" />
            <el-option label="测试" value="测试" />
            <el-option label="开发" value="开发" />
          </el-select>
        </el-form-item>
        <el-form-item label="驱动">
          <el-select v-model="form.driver" class="w-full">
            <el-option label="JDBC" value="JDBC" />
            <el-option label="原生" value="原生" />
            <el-option label="客户端" value="客户端" />
          </el-select>
        </el-form-item>
        <el-form-item label="模板内容">
          <el-input v-model="form.content" type="textarea" :rows="4" placeholder="jdbc:mysql://host:3306/db?useSSL=false" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editorVisible = false">取消</el-button>
        <el-button type="danger" @click="saveForm">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search } from '@element-plus/icons-vue'

type TemplateRow = {
  name: string
  type: string
  env: string
  version: string
  driver: string
  owner: string
  updateTime: string
  content: string
}

const envTagType: Record<string, 'danger' | 'warning' | 'info'> = {
  生产: 'danger',
  测试: 'warning',
  开发: 'info',
}

const keyword = ref('')
const filterEnv = ref('')
const filterType = ref('')
const editorVisible = ref(false)

const templates = ref<TemplateRow[]>([
  { name: '生产MySQL标准模板', type: 'MySQL', env: '生产', version: 'V1.3', driver: 'JDBC', owner: '张三', updateTime: '2026-08-10 14:20', content: 'jdbc:mysql://10.20.1.100:3306/metro?useSSL=false&rewriteBatchedStatements=true' },
  { name: '测试MySQL标准模板', type: 'MySQL', env: '测试', version: 'V1.2', driver: 'JDBC', owner: '张三', updateTime: '2026-08-01 09:10', content: 'jdbc:mysql://10.20.2.100:3306/metro_test?useSSL=false' },
  { name: '开发MySQL标准模板', type: 'MySQL', env: '开发', version: 'V1.1', driver: 'JDBC', owner: '李四', updateTime: '2026-07-20 11:00', content: 'jdbc:mysql://localhost:3306/metro_dev?useSSL=false' },
  { name: '生产Oracle标准模板', type: 'Oracle', env: '生产', version: 'V1.0', driver: 'JDBC', owner: '王五', updateTime: '2026-07-15 16:40', content: 'jdbc:oracle:thin:@10.20.1.150:1521:METRO' },
  { name: '生产Kafka标准模板', type: 'Kafka', env: '生产', version: 'V2.0', driver: '客户端', owner: '赵六', updateTime: '2026-08-08 10:00', content: 'bootstrap.servers=10.20.1.20:9092,10.20.1.21:9092' },
  { name: '测试Kafka标准模板', type: 'Kafka', env: '测试', version: 'V1.1', driver: '客户端', owner: '赵六', updateTime: '2026-07-28 15:30', content: 'bootstrap.servers=10.20.2.20:9092' },
  { name: '生产MongoDB标准模板', type: 'MongoDB', env: '生产', version: 'V1.0', driver: '原生', owner: '孙七', updateTime: '2026-07-10 09:00', content: 'mongodb://10.20.1.180:27017/metro_core' },
])

const form = reactive({
  name: '',
  type: 'MySQL',
  env: '生产',
  driver: 'JDBC',
  content: '',
})

const filteredTemplates = computed(() =>
  templates.value.filter((row) => {
    if (filterEnv.value && row.env !== filterEnv.value) return false
    if (filterType.value && row.type !== filterType.value) return false
    if (!keyword.value) return true
    return row.name.toLowerCase().includes(keyword.value.toLowerCase())
  }),
)

const openCreate = () => {
  Object.assign(form, { name: '', type: 'MySQL', env: '生产', driver: 'JDBC', content: '' })
  editorVisible.value = true
}

const saveForm = () => {
  if (!form.name.trim()) {
    ElMessage.warning('请输入模板名称')
    return
  }
  templates.value.unshift({
    name: form.name,
    type: form.type,
    env: form.env,
    version: 'V1.0',
    driver: form.driver,
    owner: '张三',
    updateTime: new Date().toLocaleString('sv-SE').replace('T', ' '),
    content: form.content,
  })
  editorVisible.value = false
  ElMessage.success('模板已新增（Mock）')
}

const applyTemplate = (row: TemplateRow) => {
  ElMessage.success(`模板「${row.name}」已套用，可快速创建新数据源（Mock）`)
}

const copyTemplate = (row: TemplateRow) => {
  templates.value.push({ ...row, name: `${row.name}（副本）`, version: 'V1.0', owner: '张三' })
  ElMessage.success('模板已复制（Mock）')
}

const rollbackTemplate = (row: TemplateRow) => {
  ElMessageBox.confirm(`确认将「${row.name}」回滚到上一版本吗？`, '版本回滚', { type: 'warning' })
    .then(() => {
      ElMessage.success(`模板「${row.name}」已回滚（Mock）`)
    })
    .catch(() => {})
}
</script>
