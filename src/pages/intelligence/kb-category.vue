<template>
  <div class="standard-page">
    <el-card shadow="never">
      <div class="panel-header">
        知识库分类体系
        <div class="panel-actions">
          <el-button type="primary" plain>新增分类</el-button>
        </div>
      </div>

      <div class="cat-tree">
        <div v-for="root in rootCategories" :key="root.name" class="root-cat">
          <div class="root-head">
            <span class="root-icon" :style="{ background: root.color }">{{ root.icon }}</span>
            <div class="root-body">
              <div class="root-name">{{ root.name }}</div>
              <div class="root-count">{{ root.count }} 篇知识</div>
            </div>
            <el-tag size="small" effect="light">{{ root.topic }}</el-tag>
          </div>
          <div class="sub-list">
            <div v-for="s in root.subs" :key="s.name" class="sub-item">
              <span class="sub-name">{{ s.name }}</span>
              <span class="sub-count">{{ s.count }} 篇</span>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const rootCategories = ref([
  { name: '数据安全', icon: '🔒', color: '#e34d59', topic: '敏感数据防护', count: 186, subs: [{ name: '分类分级', count: 42 }, { name: '脱敏加密', count: 36 }, { name: '密钥管理', count: 24 }, { name: '审计合规', count: 48 }, { name: '应急响应', count: 36 }] },
  { name: '数据质量', icon: '✅', color: '#00a854', topic: '质量保障', count: 142, subs: [{ name: '规则模板', count: 32 }, { name: '质量评估', count: 28 }, { name: '工单整改', count: 46 }, { name: '实时监控', count: 20 }, { name: '报告导出', count: 16 }] },
  { name: '数据治理', icon: '📊', color: '#2b6cb0', topic: '治理体系', count: 96, subs: [{ name: '标准管理', count: 30 }, { name: '元数据', count: 24 }, { name: '资源目录', count: 18 }, { name: '权限管理', count: 24 }] },
  { name: '新线建设', icon: '🚇', color: '#ed7b2f', topic: '业务支撑', count: 54, subs: [{ name: 'BIM 模型', count: 18 }, { name: '设计规范', count: 22 }, { name: '移交标准', count: 14 }] },
])
</script>

<style scoped>
.standard-page {
  display: grid;
  gap: 16px;
}

.cat-tree {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 12px;
}

.root-cat {
  border: 1px solid #e4e7ed;
  border-radius: 10px;
  overflow: hidden;
}

.root-head {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  background: #fafafa;
  border-bottom: 1px solid #edf0f5;
}

.root-icon {
  width: 34px;
  height: 34px;
  flex: none;
  border-radius: 8px;
  display: grid;
  place-items: center;
  font-size: 16px;
}

.root-body {
  flex: 1;
  min-width: 0;
}

.root-name {
  font-size: 14px;
  font-weight: 700;
  color: #4a4a4a;
}

.root-count {
  font-size: 12px;
  color: #8c8c8c;
}

.sub-list {
  display: grid;
}

.sub-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 14px;
  border-bottom: 1px solid #f5f6f8;
  font-size: 12px;
  color: #4a4a4a;
}

.sub-item:last-child {
  border-bottom: none;
}

.sub-count {
  color: #8c8c8c;
}
</style>