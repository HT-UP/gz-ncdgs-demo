<template>
  <div class="standard-page">
    <el-card shadow="never">
      <div class="panel-header">
        数据资产订阅通知
        <div class="panel-actions">
          <el-button type="primary" @click="subVisible = true">新建订阅</el-button>
        </div>
      </div>

      <el-alert title="订阅类型：资产变更 / 质量问题 / 权限变化 / 血缘变化 / 数据更新" type="info" :closable="false" show-icon class="mb-16" />

      <div class="sub-grid">
        <div v-for="s in subs" :key="s.no" class="sub-card">
          <div class="sub-head">
            <span class="sub-name">{{ s.name }}</span>
            <el-tag :type="s.enabled ? 'success' : 'info'" size="small" effect="light">{{ s.enabled ? '启用' : '停用' }}</el-tag>
          </div>
          <div class="sub-assets">{{ s.assets }}</div>
          <div class="sub-types">
            <el-tag v-for="t in s.types" :key="t" size="small" effect="plain" type="primary">{{ t }}</el-tag>
          </div>
          <div class="sub-meta">通知方式：{{ s.channel }} · 最近推送 {{ s.lastPush }}</div>
          <div class="sub-actions">
            <el-button size="small" type="primary" plain>预览通知记录</el-button>
            <el-button size="small" :type="s.enabled ? '' : 'success'" @click="s.enabled = !s.enabled">{{ s.enabled ? '停用' : '启用' }}</el-button>
          </div>
        </div>
      </div>
    </el-card>

    <el-dialog v-model="subVisible" title="新建订阅" width="520px">
      <el-form label-width="100px">
        <el-form-item label="订阅名称">
          <el-input v-model="form.name" placeholder="如：客流表变更订阅" />
        </el-form-item>
        <el-form-item label="订阅资产">
          <el-select v-model="form.assets" multiple filterable placeholder="选择资产" class="w-full">
            <el-option v-for="a in assets" :key="a" :label="a" :value="a" />
          </el-select>
        </el-form-item>
        <el-form-item label="订阅类型">
          <el-checkbox-group v-model="form.types">
            <el-checkbox v-for="t in typeOptions" :key="t" :label="t">{{ t }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="通知方式">
          <el-checkbox-group v-model="form.channel">
            <el-checkbox label="站内信" />
            <el-checkbox label="邮件" />
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="subVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmSub">保存订阅</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const subs = ref([
  { no: 1, name: '客流核心表变更订阅', assets: 'ods_flow_section / dws_flow_section_daily（共 6 个资产）', types: ['资产变更', '血缘变化', '数据更新'], channel: '站内信 + 邮件', lastPush: '2026-06-15 10:02', enabled: true },
  { no: 2, name: '票务清分质量订阅', assets: 'ods_ticket_clear / dwd_ticket_clear_clean', types: ['质量问题'], channel: '站内信', lastPush: '2026-06-16 08:30', enabled: true },
  { no: 3, name: '个人信息资产权限订阅', assets: 'ods_employee_profile（敏感字段）', types: ['权限变化'], channel: '邮件', lastPush: '2026-06-12 14:20', enabled: false },
])

const subVisible = ref(false)
const form = ref({ name: '', assets: [] as string[], types: [] as string[], channel: [] as string[] })
const assets = ['ods_flow_section', 'dws_flow_section_daily', 'ods_ticket_clear', 'dwd_ticket_clear_clean', 'ods_employee_profile']
const typeOptions = ['资产变更', '质量问题', '权限变化', '血缘变化', '数据更新']

function confirmSub() {
  ElMessage.success('订阅已保存，将按通知偏好推送')
  subVisible.value = false
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

.sub-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 12px;
}

.sub-card {
  padding: 14px 16px;
  border: 1px solid #edf0f5;
  border-radius: 10px;
  background: #fafafa;
}

.sub-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sub-name {
  font-size: 14px;
  font-weight: 600;
  color: #4a4a4a;
}

.sub-assets {
  margin-top: 6px;
  color: #8c8c8c;
  font-size: 12px;
}

.sub-types {
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.sub-meta {
  margin-top: 10px;
  color: #8c8c8c;
  font-size: 11px;
}

.sub-actions {
  margin-top: 10px;
  display: flex;
  gap: 8px;
}
</style>