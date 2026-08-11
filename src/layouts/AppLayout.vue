<template>
  <div class="app-shell">
    <aside class="sidebar" :class="{ collapsed }">
      <div class="brand">
        <div class="brand-mark">穗</div>
        <div v-if="!collapsed" class="brand-text">
          <div class="brand-title">广州地铁</div>
          <div class="brand-subtitle">新线建设数据治理系统</div>
        </div>
      </div>

      <div v-if="!collapsed" class="sidebar-divider"></div>

      <el-menu
        class="sidebar-menu"
        router
        :default-active="route.path"
        :collapse="collapsed"
        :collapse-transition="false"
        background-color="#ffffff"
        text-color="#4a4a4a"
        active-text-color="#da251d"
      >
        <el-menu-item index="/dashboard">
          <el-icon><Monitor /></el-icon>
          <template #title>工作台</template>
        </el-menu-item>

        <el-sub-menu index="/standard">
          <template #title>
            <el-icon><Files /></el-icon>
            <span>数据标准管理</span>
          </template>
          <el-menu-item index="/standard/list">
            <el-icon><Tickets /></el-icon>
            <template #title>标准列表</template>
          </el-menu-item>
          <el-menu-item index="/standard/model-design">
            <el-icon><Grid /></el-icon>
            <template #title>模型设计</template>
          </el-menu-item>
          <el-menu-item index="/standard/quality-standard">
            <el-icon><Checked /></el-icon>
            <template #title>数据质量标准</template>
          </el-menu-item>
          <el-menu-item index="/standard/implementation">
            <el-icon><TrendCharts /></el-icon>
            <template #title>标准实施监控</template>
          </el-menu-item>
          <el-menu-item index="/standard/version">
            <el-icon><Clock /></el-icon>
            <template #title>版本管理</template>
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </aside>

    <div class="main-area">
      <header class="topbar">
        <div class="topbar-brand">
          <div class="metro-logo">
            <div class="metro-logo-mark">◆</div>
          </div>
          <div class="topbar-title-wrap">
            <div class="topbar-title">广州地铁新线建设数据治理系统</div>
            <div class="topbar-subtitle">Guangzhou Metro New Line Construction Data Governance System</div>
          </div>
        </div>

        <div class="topbar-actions">
          <el-input class="search-box" placeholder="全局搜索" size="small" clearable>
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          <el-badge :value="3" class="notify-badge">
            <el-button class="icon-button" circle>
              <el-icon><Bell /></el-icon>
            </el-button>
          </el-badge>
          <div class="user-panel">
            <div class="user-avatar">
              <el-icon><UserFilled /></el-icon>
            </div>
            <div class="user-meta">
              <div class="user-name">张三</div>
              <div class="user-role">系统管理员</div>
            </div>
          </div>
        </div>
      </header>

      <div class="breadcrumb-bar">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>首页</el-breadcrumb-item>
          <el-breadcrumb-item v-if="breadcrumb.parent">{{ breadcrumb.parent }}</el-breadcrumb-item>
          <el-breadcrumb-item>{{ breadcrumb.current }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <main class="content">
        <router-view />
      </main>

      <footer class="footer">广州地铁 © 2026 版权所有 ｜ 版本 V1.0 ｜ 技术支持：数据治理中心</footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Bell, Checked, Clock, Files, Grid, Monitor, Search, Tickets, TrendCharts, UserFilled } from '@element-plus/icons-vue'

const route = useRoute()
const collapsed = false

const pageTitleMap: Record<string, { parent: string; current: string }> = {
  '/dashboard': { parent: '', current: '工作台' },
  '/standard/list': { parent: '数据标准管理', current: '标准列表' },
  '/standard/model-design': { parent: '数据标准管理', current: '模型设计' },
  '/standard/quality-standard': { parent: '数据标准管理', current: '数据质量标准' },
  '/standard/implementation': { parent: '数据标准管理', current: '标准实施监控' },
  '/standard/version': { parent: '数据标准管理', current: '版本管理' },
}

const breadcrumb = computed(() => {
  const matched = Object.keys(pageTitleMap)
    .filter((path) => route.path.startsWith(path))
    .sort((a, b) => b.length - a.length)[0]
  return pageTitleMap[matched ?? '/dashboard']
})
</script>
