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

      <div class="sidebar-divider"></div>

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

        <el-sub-menu index="/datasource">
          <template #title>
            <el-icon><Connection /></el-icon>
            <span>数据源管理</span>
          </template>
          <el-menu-item index="/datasource/list">
            <el-icon><List /></el-icon>
            <template #title>数据源列表</template>
          </el-menu-item>
          <el-menu-item index="/datasource/register">
            <el-icon><Edit /></el-icon>
            <template #title>数据源注册</template>
          </el-menu-item>
          <el-menu-item index="/datasource/connection-pool">
            <el-icon><SetUp /></el-icon>
            <template #title>连接池管理</template>
          </el-menu-item>
          <el-menu-item index="/datasource/template">
            <el-icon><Files /></el-icon>
            <template #title>参数模板管理</template>
          </el-menu-item>
          <el-menu-item index="/datasource/group">
            <el-icon><Folder /></el-icon>
            <template #title>分组管理</template>
          </el-menu-item>
          <el-menu-item index="/datasource/monitor">
            <el-icon><Monitor /></el-icon>
            <template #title>数据源监控</template>
          </el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="/metadata">
          <template #title>
            <el-icon><Coin /></el-icon>
            <span>元数据管理</span>
          </template>
          <el-menu-item index="/metadata/overview">
            <el-icon><DataAnalysis /></el-icon>
            <template #title>元数据总览</template>
          </el-menu-item>
          <el-menu-item index="/metadata/model">
            <el-icon><Grid /></el-icon>
            <template #title>元模型管理</template>
          </el-menu-item>
          <el-menu-item index="/metadata/data-element">
            <el-icon><Document /></el-icon>
            <template #title>数据元管理</template>
          </el-menu-item>
          <el-menu-item index="/metadata/collection">
            <el-icon><Download /></el-icon>
            <template #title>元数据采集</template>
          </el-menu-item>
          <el-menu-item index="/metadata/lineage">
            <el-icon><Share /></el-icon>
            <template #title>血缘解析</template>
          </el-menu-item>
          <el-menu-item index="/metadata/tag">
            <el-icon><PriceTag /></el-icon>
            <template #title>数据标签管理</template>
          </el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="/datadev">
          <template #title>
            <el-icon><Promotion /></el-icon>
            <span>数据开发集成</span>
          </template>
          <el-menu-item index="/datadev/overview">
            <el-icon><DataAnalysis /></el-icon>
            <template #title>开发总览</template>
          </el-menu-item>
          <el-menu-item index="/datadev/batch">
            <el-icon><DocumentCopy /></el-icon>
            <template #title>批量处理</template>
          </el-menu-item>
          <el-menu-item index="/datadev/realtime">
            <el-icon><VideoCamera /></el-icon>
            <template #title>实时处理</template>
          </el-menu-item>
          <el-menu-item index="/datadev/stream">
            <el-icon><WindPower /></el-icon>
            <template #title>流式数据处理</template>
          </el-menu-item>
          <el-menu-item index="/datadev/task">
            <el-icon><List /></el-icon>
            <template #title>任务管理</template>
          </el-menu-item>
          <el-menu-item index="/datadev/monitor">
            <el-icon><Monitor /></el-icon>
            <template #title>任务监控</template>
          </el-menu-item>
          <el-menu-item index="/datadev/flow">
            <el-icon><Share /></el-icon>
            <template #title>流程化配置</template>
          </el-menu-item>
          <el-menu-item index="/datadev/security">
            <el-icon><Lock /></el-icon>
            <template #title>安全与合规</template>
          </el-menu-item>
        </el-sub-menu>
      </el-menu>

      <div class="sidebar-footer">
        <div class="collapse-trigger" @click="collapsed = !collapsed">
          <el-icon :size="16"><Expand v-if="collapsed" /><Fold v-else /></el-icon>
          <span>{{ collapsed ? '' : '收起菜单' }}</span>
        </div>
      </div>
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
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { Bell, Checked, Clock, Coin, Connection, DataAnalysis, Document, DocumentCopy, Download, Edit, Expand, Files, Fold, Folder, Grid, List, Lock, Monitor, PriceTag, Promotion, Search, SetUp, Share, Tickets, TrendCharts, UserFilled, VideoCamera, WindPower } from '@element-plus/icons-vue'

const route = useRoute()
const collapsed = ref(false)

const pageTitleMap: Record<string, { parent: string; current: string }> = {
  '/dashboard': { parent: '', current: '工作台' },
  '/standard/list': { parent: '数据标准管理', current: '标准列表' },
  '/standard/model-design': { parent: '数据标准管理', current: '模型设计' },
  '/standard/quality-standard': { parent: '数据标准管理', current: '数据质量标准' },
  '/standard/implementation': { parent: '数据标准管理', current: '标准实施监控' },
  '/standard/version': { parent: '数据标准管理', current: '版本管理' },
  '/datasource/list': { parent: '数据源管理', current: '数据源列表' },
  '/datasource/register': { parent: '数据源管理', current: '数据源注册' },
  '/datasource/connection-pool': { parent: '数据源管理', current: '连接池管理' },
  '/datasource/template': { parent: '数据源管理', current: '参数模板管理' },
  '/datasource/group': { parent: '数据源管理', current: '分组管理' },
  '/datasource/monitor': { parent: '数据源管理', current: '数据源监控' },
  '/datadev/overview': { parent: '数据开发集成', current: '开发总览' },
  '/datadev/batch': { parent: '数据开发集成', current: '批量处理' },
  '/datadev/realtime': { parent: '数据开发集成', current: '实时处理' },
  '/datadev/stream': { parent: '数据开发集成', current: '流式数据处理' },
  '/datadev/task': { parent: '数据开发集成', current: '任务管理' },
  '/datadev/monitor': { parent: '数据开发集成', current: '任务监控' },
  '/datadev/flow': { parent: '数据开发集成', current: '流程化配置' },
  '/datadev/security': { parent: '数据开发集成', current: '安全与合规' },
  '/metadata/overview': { parent: '元数据管理', current: '元数据总览' },
  '/metadata/model': { parent: '元数据管理', current: '元模型管理' },
  '/metadata/data-element': { parent: '元数据管理', current: '数据元管理' },
  '/metadata/collection': { parent: '元数据管理', current: '元数据采集' },
  '/metadata/lineage': { parent: '元数据管理', current: '血缘解析' },
  '/metadata/tag': { parent: '元数据管理', current: '数据标签管理' },
}

const breadcrumb = computed(() => {
  const matched = Object.keys(pageTitleMap)
    .filter((path) => route.path.startsWith(path))
    .sort((a, b) => b.length - a.length)[0]
  return pageTitleMap[matched ?? '/dashboard']
})
</script>
