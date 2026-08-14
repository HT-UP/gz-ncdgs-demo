<template>
  <div class="standard-page">
    <el-card shadow="never">
      <div class="panel-header">
        用户与组织管理
        <div class="panel-actions">
          <el-input v-model="keyword" placeholder="搜索用户 / 部门" clearable class="search-input" />
          <el-button type="primary" @click="addVisible = true">新增用户</el-button>
        </div>
      </div>

      <el-row :gutter="16">
        <el-col :xs="24" :md="6">
          <div class="org-tree">
            <div class="org-title">组织架构</div>
            <el-tree :data="orgTree" :props="{ label: 'name', children: 'children' }" default-expand-all node-key="id" @node-click="onOrgClick">
              <template #default="{ data }">
                <span class="org-node">{{ data.name }} <b>{{ data.count }}</b></span>
              </template>
            </el-tree>
          </div>
        </el-col>
        <el-col :xs="24" :md="18">
          <el-table :data="filteredUsers" stripe height="460">
            <el-table-column prop="name" label="用户名" min-width="110" show-overflow-tooltip />
            <el-table-column prop="real" label="姓名" width="100" />
            <el-table-column prop="dept" label="部门" min-width="130" show-overflow-tooltip />
            <el-table-column prop="group" label="用户组" width="110" />
            <el-table-column label="状态" width="90">
              <template #default="{ row }">
                <el-tag :type="row.status === '启用' ? 'success' : 'info'" size="small" effect="light">{{ row.status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="lastLogin" label="最近登录" width="130" />
            <el-table-column label="操作" width="180" fixed="right">
              <template #default>
                <el-button link type="primary" size="small">编辑</el-button>
                <el-button link type="warning" size="small">重置密码</el-button>
                <el-button link type="danger" size="small">停用</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>

      <el-dialog v-model="addVisible" title="新增用户" width="480px">
        <el-form label-width="90px">
          <el-form-item label="用户名">
            <el-input v-model="form.username" />
          </el-form-item>
          <el-form-item label="姓名">
            <el-input v-model="form.real" />
          </el-form-item>
          <el-form-item label="所属部门">
            <el-select v-model="form.dept" class="w-full">
              <el-option v-for="d in depts" :key="d.name" :label="d.name" :value="d.name" />
            </el-select>
          </el-form-item>
          <el-form-item label="用户组">
            <el-select v-model="form.group" class="w-full">
              <el-option v-for="g in groups" :key="g" :label="g" :value="g" />
            </el-select>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="addVisible = false">取消</el-button>
          <el-button type="primary">创建并初始化密码</el-button>
        </template>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const keyword = ref('')
const addVisible = ref(false)

const depts = [
  { name: '运营管理中心', count: 42 },
  { name: '数据治理部', count: 36 },
  { name: '信息中心', count: 28 },
  { name: '新线建设部', count: 18 },
  { name: '安全合规组', count: 12 },
]

const orgTree = [
  { id: 1, name: '广州地铁集团', count: 1320, children: depts },
]

const groups = ['数据管理员', '数据开发', '数据分析', '业务运营', '安全审计']

const users = [
  { name: 'wangzhang', real: '王工', dept: '数据治理部', group: '数据管理员', status: '启用', lastLogin: '2026-06-16 09:12' },
  { name: 'lidong', real: '李工', dept: '数据治理部', group: '数据开发', status: '启用', lastLogin: '2026-06-16 08:40' },
  { name: 'zhaoyan', real: '赵工', dept: '运营管理中心', group: '数据分析', status: '启用', lastLogin: '2026-06-15 18:02' },
  { name: 'qianshi', real: '钱工', dept: '新线建设部', group: '业务运营', status: '停用', lastLogin: '2026-05-20 10:30' },
  { name: 'sunjiang', real: '孙工', dept: '安全合规组', group: '安全审计', status: '启用', lastLogin: '2026-06-16 07:55' },
]

const form = ref({ username: '', real: '', dept: '', group: '' })

const filteredUsers = computed(() =>
  users.filter((u) => !keyword.value || u.name.includes(keyword.value) || u.dept.includes(keyword.value)),
)

function onOrgClick(data: { name: string }) {
  // 过滤部门用户
}
</script>

<style scoped>
.standard-page {
  display: grid;
  gap: 16px;
}

.org-tree {
  padding: 4px 0;
}

.org-title {
  font-size: 13px;
  font-weight: 600;
  color: #4a4a4a;
  margin-bottom: 10px;
  padding-left: 10px;
  border-left: 3px solid #da251d;
}

.org-node {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  font-size: 13px;
}

.org-node b {
  color: #8c8c8c;
  font-size: 12px;
}
</style>