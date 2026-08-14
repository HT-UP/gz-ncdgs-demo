<template>
  <div class="standard-page">
    <el-card shadow="never">
      <div class="panel-header">
        知识库 · 知识内容管理
        <div class="panel-actions">
          <el-input v-model="keyword" placeholder="搜索知识" clearable class="search-input" />
          <el-button type="primary" @click="addVisible = true">录入知识</el-button>
        </div>
      </div>

      <el-table :data="rows" stripe height="420">
        <el-table-column prop="title" label="知识标题" min-width="220" show-overflow-tooltip />
        <el-table-column prop="category" label="分类" width="120" />
        <el-table-column prop="author" label="编辑人" width="90" />
        <el-table-column label="状态" width="90">
          <template #default="{ row }">
            <el-tag :type="row.status === '已发布' ? 'success' : row.status === '待审核' ? 'warning' : 'info'" size="small" effect="light">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="views" label="浏览量" width="90" />
        <el-table-column label="收藏" width="80">
          <template #default="{ row }">
            <span>{{ row.favorites }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="updatedAt" label="更新时间" width="120" />
        <el-table-column label="操作" width="210" fixed="right">
          <template #default>
            <el-button link type="primary" size="small">编辑</el-button>
            <el-button link type="success" size="small">发布</el-button>
            <el-button link type="info" size="small">转Markdown</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog v-model="addVisible" title="录入知识" width="520px">
        <el-form label-width="90px">
          <el-form-item label="标题">
            <el-input v-model="form.title" />
          </el-form-item>
          <el-form-item label="分类">
            <el-select v-model="form.category" class="w-full">
              <el-option v-for="c in categories" :key="c" :label="c" :value="c" />
            </el-select>
          </el-form-item>
          <el-form-item label="内容">
            <el-input v-model="form.content" type="textarea" :rows="5" />
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="addVisible = false">取消</el-button>
          <el-button type="primary">保存并提交审核</el-button>
        </template>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const keyword = ref('')
const addVisible = ref(false)
const categories = ['数据安全', '数据质量', '数据治理', '新线建设']

const rows = ref([
  { title: '数据分类分级管理办法（2026 修订）', category: '数据治理', author: '安全组', status: '已发布', views: 268, favorites: 46, updatedAt: '2026-06-10' },
  { title: '个人信息匿名化处理操作指引', category: '数据安全', author: '安全组', status: '已发布', views: 182, favorites: 33, updatedAt: '2026-06-02' },
  { title: '质量规则模板定义规范', category: '数据质量', author: '质量组', status: '待审核', views: 96, favorites: 12, updatedAt: '2026-06-14' },
  { title: '票务清分主题域建设指南', category: '数据治理', author: '数据组', status: '草稿', views: 0, favorites: 0, updatedAt: '2026-06-13' },
  { title: '新线 BIM 模型数据移交规范', category: '新线建设', author: '设计部', status: '已发布', views: 320, favorites: 58, updatedAt: '2026-06-05' },
])

const form = ref({ title: '', category: '数据治理', content: '' })
</script>

<style scoped>
.standard-page {
  display: grid;
  gap: 16px;
}
</style>