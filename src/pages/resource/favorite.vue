<template>
  <div class="standard-page">
    <el-card shadow="never">
      <div class="panel-header">
        资产收藏
        <div class="panel-actions">
          <el-button type="primary" plain @click="createBook">新建手册</el-button>
        </div>
      </div>

      <el-alert title="一键收藏常用资产，形成个人「场景化资产手册」，支持按场景分组管理" type="info" :closable="false" show-icon class="mb-16" />

      <el-row :gutter="16">
        <el-col :xs="24" :md="6">
          <div class="book-list">
            <div v-for="b in books" :key="b.name" class="book-item" :class="{ on: activeBook === b.name }" @click="activeBook = b.name">
              <div class="book-icon"><el-icon><Folder /></el-icon></div>
              <div class="book-body">
                <div class="book-name">{{ b.name }}</div>
                <div class="book-count">{{ b.count }} 个资产</div>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :xs="24" :md="18">
          <div class="panel-header">{{ activeBook }}（{{ favList.length }}）</div>
          <el-table :data="favList" stripe height="380">
            <el-table-column prop="name" label="资产名称" min-width="180" show-overflow-tooltip />
            <el-table-column prop="type" label="类型" width="90" />
            <el-table-column label="收藏时间" width="140">
              <template #default="{ row }">{{ row.time }}</template>
            </el-table-column>
            <el-table-column label="最近访问" width="140">
              <template #default="{ row }">{{ row.visited }}</template>
            </el-table-column>
            <el-table-column prop="note" label="备注" min-width="140" show-overflow-tooltip />
            <el-table-column label="操作" width="160" fixed="right">
              <template #default>
                <el-button link type="primary" size="small">打开</el-button>
                <el-button link type="danger" size="small">移除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Folder } from '@element-plus/icons-vue'

const books = [
  { name: '日常运营分析', count: 12 },
  { name: '新线设计沟通', count: 8 },
  { name: '质量问题跟踪', count: 5 },
]

const activeBook = ref('日常运营分析')

const favorites = [
  { book: '日常运营分析', name: 'dws_flow_section_daily', type: '表', time: '2026-06-10 10:20', visited: '2026-06-16 09:41', note: '日客流报表核心' },
  { book: '日常运营分析', name: 'ads_运营大屏数据', type: '表', time: '2026-06-10 10:21', visited: '2026-06-15 16:02', note: '大屏刷新展示' },
  { book: '日常运营分析', name: 'dwd_ticket_clear_clean', type: '表', time: '2026-06-11 09:08', visited: '2026-06-16 08:12', note: '清分对账用' },
  { book: '新线设计沟通', name: 'cad_line_10_models', type: '文档', time: '2026-06-12 15:40', visited: '2026-06-14 11:20', note: '10号线BIM模型' },
  { book: '新线设计沟通', name: 'design_interface_plan', type: '文档', time: '2026-06-12 15:41', visited: '2026-06-13 14:35', note: '接口设计方案' },
  { book: '质量问题跟踪', name: 'ods_employee_profile', type: '表', time: '2026-06-13 10:05', visited: '2026-06-15 17:18', note: '格式问题复核' },
]

const favList = computed(() => favorites.filter((f) => f.book === activeBook.value))

function createBook() {
  ElMessage.success('新建手册（弹出命名弹窗）')
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

.book-list {
  display: grid;
  gap: 8px;
}

.book-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border: 1px solid #e4e7ed;
  border-radius: 10px;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
}

.book-item.on {
  border-color: #da251d;
  background: rgba(218, 37, 29, 0.05);
}

.book-icon {
  width: 34px;
  height: 34px;
  flex: none;
  border-radius: 8px;
  display: grid;
  place-items: center;
  background: rgba(218, 37, 29, 0.08);
  color: #da251d;
}

.book-body {
  min-width: 0;
}

.book-name {
  font-size: 13px;
  font-weight: 600;
  color: #4a4a4a;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.book-count {
  margin-top: 2px;
  color: #8c8c8c;
  font-size: 11px;
}
</style>