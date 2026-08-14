<template>
  <div class="standard-page">
    <el-card shadow="never">
      <div class="panel-header">
        驱动管理
        <div class="panel-actions">
          <el-input v-model="keyword" placeholder="搜索驱动" clearable class="search-input" />
          <el-button type="primary" @click="uploadVisible = true">上传驱动</el-button>
        </div>
      </div>

      <el-row :gutter="16" class="mb-16">
        <el-col v-for="s in statCards" :key="s.name" :xs="12" :md="6">
          <div class="mini-stat">
            <div class="mini-stat-value" :style="{ color: s.color }">{{ s.value }}</div>
            <div class="mini-stat-label">{{ s.name }}</div>
          </div>
        </el-col>
      </el-row>

      <el-table :data="filtered" stripe height="430">
        <el-table-column prop="name" label="驱动名称" min-width="170" show-overflow-tooltip />
        <el-table-column prop="type" label="数据库类型" width="110" />
        <el-table-column prop="version" label="版本" width="90" />
        <el-table-column label="状态" width="90">
          <template #default="{ row }">
            <el-tag :type="row.status === '启用' ? 'success' : 'info'" effect="light">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="安全校验" width="100">
          <template #default="{ row }">
            <el-tag :type="row.secure === '已签名' ? 'success' : 'warning'" size="small" effect="plain">{{ row.secure }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="usage" label="关联数据源（使用次数）" min-width="150" show-overflow-tooltip />
        <el-table-column prop="size" label="体积" width="90" />
        <el-table-column prop="updatedAt" label="更新时间" width="110" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="use(row)">使用跟踪</el-button>
            <el-button link type="danger" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="uploadVisible" title="上传驱动" width="520px">
      <el-form label-width="90px">
        <el-form-item label="驱动文件">
          <el-upload drag action="#" :auto-upload="false" style="width: 100%">
            <el-icon class="el-icon--upload"><Upload /></el-icon>
            <div class="el-upload__text">拖拽驱动 jar 文件到此处，或<em>点击上传</em></div>
            <template #tip>
              <div class="el-upload__tip">支持 .jar 格式，上传后将进行安全校验与签名</div>
            </template>
          </el-upload>
        </el-form-item>
        <el-form-item label="数据库类型">
          <el-select v-model="driverType" class="w-full">
            <el-option v-for="t in driverTypes" :key="t" :label="t" :value="t" />
          </el-select>
        </el-form-item>
        <el-form-item label="版本号">
          <el-input v-model="driverVersion" placeholder="如 8.2.1" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="uploadVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmUpload">上传并校验</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Upload } from '@element-plus/icons-vue'

const keyword = ref('')
const uploadVisible = ref(false)
const driverType = ref('Oracle')
const driverVersion = ref('')

const driverTypes = ['Oracle', 'MySQL', 'PostgreSQL', 'SQLServer', 'Doris', 'HBase', 'Redis', 'MongoDB', 'ClickHouse']

const statCards = [
  { name: '驱动总数', value: 26, color: '#da251d' },
  { name: '已签名安全', value: 22, color: '#00a854' },
  { name: '待升级', value: 6, color: '#ed7b2f' },
  { name: '本月上传', value: 4, color: '#2b6cb0' },
]

const rows = [
  { name: 'ojdbc11.jar', type: 'Oracle', version: '21.5', status: '启用', secure: '已签名', usage: '地铁线网运营主库等 6 个', size: '6.8MB', updatedAt: '2026-05-28' },
  { name: 'mysql-connector-j-8.4.0.jar', type: 'MySQL', version: '8.4.0', status: '启用', secure: '已签名', usage: '客流实时采集库等 5 个', size: '2.4MB', updatedAt: '2026-05-30' },
  { name: 'postgresql-42.7.3.jar', type: 'PostgreSQL', version: '42.7.3', status: '启用', secure: '已签名', usage: '票务清分预结算库', size: '1.1MB', updatedAt: '2026-05-24' },
  { name: 'mssql-jdbc-12.4.2.jre11.jar', type: 'SQLServer', version: '12.4.2', status: '启用', secure: '已签名', usage: '信号系统明细库', size: '8.2MB', updatedAt: '2026-05-18' },
  { name: 'doris-client-1.2.8.jar', type: 'Doris', version: '1.2.8', status: '启用', secure: '已签名', usage: '运营分析数仓', size: '1.8MB', updatedAt: '2026-06-02' },
  { name: 'hbase-client-2.5.7.jar', type: 'HBase', version: '2.5.7', status: '启用', secure: '待复核', usage: '设备物联采集域', size: '21.5MB', updatedAt: '2026-05-10' },
  { name: 'lettuce-core-6.3.2.jar', type: 'Redis', version: '6.3.2', status: '启用', secure: '已签名', usage: '外部接口网关库', size: '0.6MB', updatedAt: '2026-05-20' },
  { name: 'mongodb-driver-sync-5.1.0.jar', type: 'MongoDB', version: '5.1.0', status: '启用', secure: '已签名', usage: '防汛应急专题库', size: '1.5MB', updatedAt: '2026-06-04' },
  { name: 'clickhouse-jdbc-0.6.0.jar', type: 'ClickHouse', version: '0.6.0', status: '启用', secure: '已签名', usage: '安全审计存储库', size: '0.9MB', updatedAt: '2026-05-15' },
  { name: 'odps-client-3.6.2.jar', type: 'MaxCompute', version: '3.6.2', status: '停用', secure: '已签名', usage: '历史归档中心（待切换）', size: '3.2MB', updatedAt: '2025-11-30' },
]

const filtered = computed(() =>
  rows.filter((r) => !keyword.value || r.name.includes(keyword.value) || r.type.includes(keyword.value)),
)

function use(row: (typeof rows)[number]) {
  ElMessage.info(`查看驱动「${row.name}」使用记录`)
}

function confirmUpload() {
  if (!driverVersion.value) {
    ElMessage.warning('请填写版本号')
    return
  }
  ElMessage.success('驱动上传成功，已加入安全校验队列')
  uploadVisible.value = false
}
</script>

<style scoped>
.standard-page {
  display: grid;
  gap: 16px;
}

.mb-16 {
  margin-bottom: 16px;
}

.mini-stat {
  padding: 14px 16px;
  background: #fafafa;
  border: 1px solid #edf0f5;
  border-radius: 10px;
}

.mini-stat-value {
  font-size: 24px;
  font-weight: 700;
}

.mini-stat-label {
  margin-top: 2px;
  color: #8c8c8c;
  font-size: 12px;
}
</style>