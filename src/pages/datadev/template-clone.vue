<template>
  <div class="standard-page">
    <el-card shadow="never">
      <div class="panel-header">
        任务模板与克隆
        <div class="panel-actions">
          <el-button type="primary" @click="saveVisible = true">保存为模板</el-button>
        </div>
      </div>

      <el-row :gutter="16">
        <el-col :xs="24" :md="14">
          <div class="panel-header">模板列表</div>
          <el-table :data="templates" stripe height="380">
            <el-table-column prop="name" label="模板名称" min-width="170" show-overflow-tooltip />
            <el-table-column prop="category" label="分类" width="100" />
            <el-table-column label="复用次数" width="90" />
            <el-table-column label="共享" width="80">
              <template #default="{ row }">
                <el-tag v-if="row.shared" type="success" size="small" effect="plain">已共享</el-tag>
                <span v-else class="no-tag">私有</span>
              </template>
            </el-table-column>
            <el-table-column prop="owner" label="创建人" width="90" />
            <el-table-column label="操作" width="160" fixed="right">
              <template #default>
                <el-button link type="primary" size="small">克隆</el-button>
                <el-button link type="warning" size="small">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :xs="24" :md="10">
          <div class="panel-header">克隆审计</div>
          <el-timeline>
            <el-timeline-item v-for="c in clones" :key="c.time" :timestamp="c.time" :type="c.type">
              <div class="clone-line">
                <b>{{ c.user }}</b> 克隆「{{ c.template }}」→「{{ c.task }}」
                <span class="clone-status">{{ c.status }}</span>
              </div>
            </el-timeline-item>
          </el-timeline>
        </el-col>
      </el-row>

      <el-dialog v-model="saveVisible" title="保存为模板" width="480px">
        <el-form label-width="80px">
          <el-form-item label="模板名称">
            <el-input v-model="tplName" placeholder="如：客流日加工模板" />
          </el-form-item>
          <el-form-item label="分类">
            <el-select v-model="tplCategory" class="w-full">
              <el-option v-for="c in categories" :key="c" :label="c" :value="c" />
            </el-select>
          </el-form-item>
          <el-form-item label="共享">
            <el-switch v-model="tplShared" />
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="saveVisible = false">取消</el-button>
          <el-button type="primary" @click="saveTpl">保存</el-button>
        </template>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const templates = [
  { name: '客流断面日加工模板', category: '日调度', reuse: 26, shared: true, owner: '李工' },
  { name: '设备状态实时接入模板', category: '实时', reuse: 12, shared: true, owner: '王工' },
  { name: '票务清分批处理模板', category: '批处理', reuse: 8, shared: true, owner: '赵工' },
  { name: '安全日志汇聚模板', category: '日志', reuse: 5, shared: false, owner: '钱工' },
  { name: '报表宽表加工模板', category: '日调度', reuse: 3, shared: false, owner: '孙工' },
]

const clones = [
  { user: '周工', template: '客流断面日加工模板', task: '客流断面_10号线日加工', time: '2026-06-15 14:20', status: '已克隆', type: 'primary' },
  { user: '吴工', template: '设备状态实时接入模板', task: '设备状态_4号线实时接入', time: '2026-06-14 10:05', status: '已克隆', type: 'primary' },
  { user: '郑工', template: '票务清分批处理模板', task: '票务清分_7号线批处理', time: '2026-06-12 16:40', status: '已克隆', type: 'primary' },
]

const saveVisible = ref(false)
const tplName = ref('')
const tplCategory = ref('日调度')
const tplShared = ref(false)
const categories = ['日调度', '实时', '批处理', '日志', '自定义']

function saveTpl() {
  if (!tplName.value.trim()) {
    ElMessage.warning('请输入模板名称')
    return
  }
  ElMessage.success('模板保存成功')
  saveVisible.value = false
}
</script>

<style scoped>
.standard-page {
  display: grid;
  gap: 16px;
}

.no-tag {
  color: #c0c4cc;
  font-size: 12px;
}

.clone-line {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  align-items: center;
  font-size: 12px;
  color: #4a4a4a;
}

.clone-status {
  color: #00a854;
  font-weight: 600;
}
</style>