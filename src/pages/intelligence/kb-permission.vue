<template>
  <div class="standard-page">
    <el-card shadow="never">
      <div class="panel-header">
        知识库权限控制
        <div class="panel-actions">
          <el-button type="primary" plain>新增角色</el-button>
        </div>
      </div>

      <el-alert title="四级权限：知识管理员 / 知识编辑者 / 知识使用者 / 外部调用方" type="info" :closable="false" show-icon class="mb-16" />

      <el-table :data="roles" stripe height="340">
        <el-table-column prop="name" label="角色" min-width="130" show-overflow-tooltip />
        <el-table-column label="查看" width="80">
          <template #default="{ row }">
            <el-icon v-if="row.view" color="#00a854"><Checked /></el-icon>
          </template>
        </el-table-column>
        <el-table-column label="编辑" width="80">
          <template #default="{ row }">
            <el-icon v-if="row.edit" color="#00a854"><Checked /></el-icon>
          </template>
        </el-table-column>
        <el-table-column label="审核发布" width="90">
          <template #default="{ row }">
            <el-icon v-if="row.publish" color="#00a854"><Checked /></el-icon>
          </template>
        </el-table-column>
        <el-table-column label="删除" width="80">
          <template #default="{ row }">
            <el-icon v-if="row.delete" color="#00a854"><Checked /></el-icon>
          </template>
        </el-table-column>
        <el-table-column label="对外调用" width="100">
          <template #default="{ row }">
            <el-icon v-if="row.api" color="#00a854"><Checked /></el-icon>
          </template>
        </el-table-column>
        <el-table-column prop="memberCount" label="成员数" width="90" />
        <el-table-column prop="scope" label="权限范围" min-width="180" show-overflow-tooltip />
      </el-table>

      <div class="sub-title mt-16">成员管理</div>
      <el-table :data="members" stripe height="240">
        <el-table-column prop="user" label="成员" width="130" />
        <el-table-column prop="role" label="角色" width="130">
          <template #default="{ row }">
            <el-tag size="small" :type="roleTag(row.role)" effect="light">{{ row.role }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="dept" label="部门" min-width="140" show-overflow-tooltip />
        <el-table-column prop="joined" label="加入时间" width="130" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default>
            <el-button link type="primary" size="small">调整角色</el-button>
            <el-button link type="danger" size="small">移除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Checked } from '@element-plus/icons-vue'

const roles = ref([
  { name: '知识管理员', view: true, edit: true, publish: true, delete: true, api: true, memberCount: 4, scope: '全知识库 + 分类维护' },
  { name: '知识编辑者', view: true, edit: true, publish: false, delete: false, api: false, memberCount: 12, scope: '指定分类编辑' },
  { name: '知识使用者', view: true, edit: false, publish: false, delete: false, api: false, memberCount: 86, scope: '检索与查看' },
  { name: '外部调用方', view: false, edit: false, publish: false, delete: false, api: true, memberCount: 6, scope: '服务化接口调用' },
])

const members = ref([
  { user: '管理员', role: '知识管理员', dept: '信息中心', joined: '2026-03-02' },
  { user: '安全组小王', role: '知识管理员', dept: '安全合规组', joined: '2026-03-05' },
  { user: '质量组小李', role: '知识编辑者', dept: '数据治理部', joined: '2026-04-11' },
  { user: '业务组小赵', role: '知识使用者', dept: '运营管理中心', joined: '2026-05-20' },
])

function roleTag(r: string) {
  return { 知识管理员: 'danger', 知识编辑者: 'primary', 知识使用者: 'success', 外部调用方: 'info' }[r] as 'danger' | 'primary' | 'success' | 'info'
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

.mt-16 {
  margin-top: 16px;
}

.sub-title {
  font-size: 13px;
  font-weight: 600;
  color: #4a4a4a;
  margin-bottom: 10px;
  padding-left: 10px;
  border-left: 3px solid #da251d;
}
</style>