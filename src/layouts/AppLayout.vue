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
        :collapse-transition="true"
        :unique-opened="true"
        background-color="#ffffff"
        text-color="#4a4a4a"
        active-text-color="#da251d"
      >
        <el-menu-item index="/dashboard">
          <el-icon><Monitor /></el-icon>
          <template #title>工作台</template>
        </el-menu-item>

        <el-menu-item index="/cockpit">
          <el-icon><DataAnalysis /></el-icon>
          <template #title>数据治理驾驶舱</template>
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
          <el-menu-item index="/standard/impact">
            <el-icon><DataAnalysis /></el-icon>
            <template #title>模型影响分析</template>
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
          <el-menu-item index="/metadata/schedule">
            <el-icon><Clock /></el-icon>
            <template #title>采集调度中心</template>
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
          <el-menu-item index="/datadev/collect-config">
            <el-icon><Calendar /></el-icon>
            <template #title>采集任务配置</template>
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

        <el-sub-menu index="/quality">
          <template #title>
            <el-icon><DataLine /></el-icon>
            <span>数据质量管理</span>
          </template>
          <el-menu-item index="/quality/overview">
            <el-icon><DataAnalysis /></el-icon>
            <template #title>质量总览</template>
          </el-menu-item>
          <el-menu-item index="/quality/rule">
            <el-icon><Setting /></el-icon>
            <template #title>规则定义</template>
          </el-menu-item>
          <el-menu-item index="/quality/task">
            <el-icon><VideoCamera /></el-icon>
            <template #title>质量任务</template>
          </el-menu-item>
          <el-menu-item index="/quality/audit">
            <el-icon><DocumentChecked /></el-icon>
            <template #title>审计与合规</template>
          </el-menu-item>
          <el-menu-item index="/quality/certification">
            <el-icon><Trophy /></el-icon>
            <template #title>质量认证</template>
          </el-menu-item>
          <el-menu-item index="/quality/report">
            <el-icon><DocumentCopy /></el-icon>
            <template #title>质量报告</template>
          </el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="/resource">
          <template #title>
            <el-icon><FolderOpened /></el-icon>
            <span>数据资源管理</span>
          </template>
          <el-menu-item index="/resource/overview">
            <el-icon><DataAnalysis /></el-icon>
            <template #title>资源总览</template>
          </el-menu-item>
          <el-menu-item index="/resource/catalog">
            <el-icon><Folder /></el-icon>
            <template #title>资源目录</template>
          </el-menu-item>
          <el-menu-item index="/resource/preview">
            <el-icon><View /></el-icon>
            <template #title>数据预览</template>
          </el-menu-item>
          <el-menu-item index="/resource/permission">
            <el-icon><Lock /></el-icon>
            <template #title>权限申请与审批</template>
          </el-menu-item>
          <el-menu-item index="/resource/lineage">
            <el-icon><Share /></el-icon>
            <template #title>血缘分析</template>
          </el-menu-item>
          <el-menu-item index="/resource/feature">
            <el-icon><Aim /></el-icon>
            <template #title>特征自动识别</template>
          </el-menu-item>
          <el-menu-item index="/resource/explore">
            <el-icon><Search /></el-icon>
            <template #title>探查任务管理</template>
          </el-menu-item>
          <el-menu-item index="/resource/detail">
            <el-icon><Tickets /></el-icon>
            <template #title>资产详情</template>
          </el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="/security">
          <template #title>
            <el-icon><Lock /></el-icon>
            <span>数据安全与合规</span>
          </template>
          <el-menu-item index="/security/overview">
            <el-icon><DataAnalysis /></el-icon>
            <template #title>安全总览</template>
          </el-menu-item>
          <el-menu-item index="/security/tenant">
            <el-icon><OfficeBuilding /></el-icon>
            <template #title>多租户管理</template>
          </el-menu-item>
          <el-menu-item index="/security/access-control">
            <el-icon><Key /></el-icon>
            <template #title>访问控制</template>
          </el-menu-item>
          <el-menu-item index="/security/audit">
            <el-icon><Document /></el-icon>
            <template #title>安全审计</template>
          </el-menu-item>
          <el-menu-item index="/security/encryption">
            <el-icon><Lock /></el-icon>
            <template #title>加密与脱敏</template>
          </el-menu-item>
          <el-menu-item index="/security/masking">
            <el-icon><View /></el-icon>
            <template #title>脱敏规则配置</template>
          </el-menu-item>
          <el-menu-item index="/security/compliance">
            <el-icon><Checked /></el-icon>
            <template #title>合规治理</template>
          </el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="/intelligence">
          <template #title>
            <el-icon><Cpu /></el-icon>
            <span>智能治理能力</span>
          </template>
          <el-menu-item index="/intelligence/overview">
            <el-icon><Monitor /></el-icon>
            <template #title>智能总览</template>
          </el-menu-item>
          <el-menu-item index="/intelligence/metadata-ai">
            <el-icon><MagicStick /></el-icon>
            <template #title>元数据智能补全</template>
          </el-menu-item>
          <el-menu-item index="/intelligence/classify">
            <el-icon><Collection /></el-icon>
            <template #title>智能分类分级</template>
          </el-menu-item>
          <el-menu-item index="/intelligence/knowledge">
            <el-icon><Notebook /></el-icon>
            <template #title>知识库管理</template>
          </el-menu-item>
          <el-menu-item index="/intelligence/agent">
            <el-icon><Cpu /></el-icon>
            <template #title>数据治理智能体</template>
          </el-menu-item>
          <el-menu-item index="/intelligence/capability">
            <el-icon><MagicStick /></el-icon>
            <template #title>智能体能力卡片</template>
          </el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="/share">
          <template #title>
            <el-icon><Service /></el-icon>
            <span>数据服务与共享</span>
          </template>
          <el-menu-item index="/share/register">
            <el-icon><Edit /></el-icon>
            <template #title>数据服务注册</template>
          </el-menu-item>
          <el-menu-item index="/share/publish">
            <el-icon><Checked /></el-icon>
            <template #title>服务发布审批</template>
          </el-menu-item>
          <el-menu-item index="/share/catalog">
            <el-icon><Files /></el-icon>
            <template #title>服务目录</template>
          </el-menu-item>
          <el-menu-item index="/share/auth">
            <el-icon><Key /></el-icon>
            <template #title>服务调用鉴权</template>
          </el-menu-item>
          <el-menu-item index="/share/monitor">
            <el-icon><Monitor /></el-icon>
            <template #title>服务监控看板</template>
          </el-menu-item>
          <el-menu-item index="/share/logs">
            <el-icon><Document /></el-icon>
            <template #title>调用日志</template>
          </el-menu-item>
          <el-menu-item index="/share/apply">
            <el-icon><EditPen /></el-icon>
            <template #title>共享申请与审批</template>
          </el-menu-item>
          <el-menu-item index="/share/ledger">
            <el-icon><Notebook /></el-icon>
            <template #title>共享台账</template>
          </el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="/system">
          <template #title>
            <el-icon><Setting /></el-icon>
            <span>系统管理</span>
          </template>
          <el-menu-item index="/system/user">
            <el-icon><User /></el-icon>
            <template #title>用户管理</template>
          </el-menu-item>
          <el-menu-item index="/system/role">
            <el-icon><UserFilled /></el-icon>
            <template #title>角色权限</template>
          </el-menu-item>
          <el-menu-item index="/system/monitor">
            <el-icon><Monitor /></el-icon>
            <template #title>运维监控</template>
          </el-menu-item>
          <el-menu-item index="/system/log">
            <el-icon><Document /></el-icon>
            <template #title>操作日志</template>
          </el-menu-item>
          <el-menu-item index="/system/baseline">
            <el-icon><CircleCheck /></el-icon>
            <template #title>安全基线核查</template>
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
import { Aim, Bell, Calendar, Setting, Checked, CircleCheck, Clock, Coin, Collection, Connection, Cpu, DataAnalysis, DataLine, Document, DocumentChecked, DocumentCopy, Download, Edit, EditPen, Expand, Files, Fold, Folder, FolderOpened, Grid, Key, List, Lock, MagicStick, Monitor, Notebook, OfficeBuilding, PriceTag, Promotion, Search, Service, SetUp, Share, Tickets, TrendCharts, Trophy, User, UserFilled, VideoCamera, View, WindPower } from '@element-plus/icons-vue'

const route = useRoute()
const collapsed = ref(false)

const pageTitleMap: Record<string, { parent: string; current: string }> = {
  '/dashboard': { parent: '', current: '工作台' },
  '/cockpit': { parent: '', current: '数据治理驾驶舱' },
  '/standard/list': { parent: '数据标准管理', current: '标准列表' },
  '/standard/impact': { parent: '数据标准管理', current: '模型影响分析' },
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
  '/datadev/collect-config': { parent: '数据开发集成', current: '采集任务配置' },
  '/datadev/monitor': { parent: '数据开发集成', current: '任务监控' },
  '/datadev/flow': { parent: '数据开发集成', current: '流程化配置' },
  '/datadev/security': { parent: '数据开发集成', current: '安全与合规' },
  '/quality/overview': { parent: '数据质量管理', current: '质量总览' },
  '/quality/rule': { parent: '数据质量管理', current: '规则定义' },
  '/quality/task': { parent: '数据质量管理', current: '质量任务' },
  '/quality/audit': { parent: '数据质量管理', current: '审计与合规' },
  '/quality/certification': { parent: '数据质量管理', current: '质量认证' },
  '/quality/report': { parent: '数据质量管理', current: '质量报告' },
  '/resource/overview': { parent: '数据资源管理', current: '资源总览' },
  '/resource/catalog': { parent: '数据资源管理', current: '资源目录' },
  '/resource/preview': { parent: '数据资源管理', current: '数据预览' },
  '/resource/permission': { parent: '数据资源管理', current: '权限申请与审批' },
  '/resource/lineage': { parent: '数据资源管理', current: '血缘分析' },
  '/resource/feature': { parent: '数据资源管理', current: '特征自动识别' },
  '/resource/explore': { parent: '数据资源管理', current: '探查任务管理' },
  '/resource/detail': { parent: '数据资源管理', current: '资产详情' },
  '/security/overview': { parent: '数据安全与合规', current: '安全总览' },
  '/security/tenant': { parent: '数据安全与合规', current: '多租户管理' },
  '/security/access-control': { parent: '数据安全与合规', current: '访问控制' },
  '/security/audit': { parent: '数据安全与合规', current: '安全审计' },
  '/security/encryption': { parent: '数据安全与合规', current: '加密与脱敏' },
  '/security/masking': { parent: '数据安全与合规', current: '脱敏规则配置' },
  '/security/compliance': { parent: '数据安全与合规', current: '合规治理' },
  '/intelligence/overview': { parent: '智能治理能力', current: '智能总览' },
  '/intelligence/metadata-ai': { parent: '智能治理能力', current: '元数据智能补全' },
  '/intelligence/classify': { parent: '智能治理能力', current: '智能分类分级' },
  '/intelligence/knowledge': { parent: '智能治理能力', current: '知识库管理' },
  '/intelligence/agent': { parent: '智能治理能力', current: '数据治理智能体' },
  '/intelligence/capability': { parent: '智能治理能力', current: '智能体能力卡片' },
  '/system/user': { parent: '系统管理', current: '用户管理' },
  '/system/role': { parent: '系统管理', current: '角色权限' },
  '/system/monitor': { parent: '系统管理', current: '运维监控' },
  '/system/log': { parent: '系统管理', current: '操作日志' },
  '/system/baseline': { parent: '系统管理', current: '安全基线核查' },
  '/share/register': { parent: '数据服务与共享', current: '数据服务注册' },
  '/share/publish': { parent: '数据服务与共享', current: '服务发布审批' },
  '/share/catalog': { parent: '数据服务与共享', current: '服务目录' },
  '/share/auth': { parent: '数据服务与共享', current: '服务调用鉴权' },
  '/share/monitor': { parent: '数据服务与共享', current: '服务监控看板' },
  '/share/logs': { parent: '数据服务与共享', current: '调用日志' },
  '/share/apply': { parent: '数据服务与共享', current: '共享申请与审批' },
  '/share/ledger': { parent: '数据服务与共享', current: '共享台账' },
  '/metadata/overview': { parent: '元数据管理', current: '元数据总览' },
  '/metadata/model': { parent: '元数据管理', current: '元模型管理' },
  '/metadata/data-element': { parent: '元数据管理', current: '数据元管理' },
  '/metadata/collection': { parent: '元数据管理', current: '元数据采集' },
  '/metadata/schedule': { parent: '元数据管理', current: '采集调度中心' },
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
