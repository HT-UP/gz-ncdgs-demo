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
          <el-menu-item index="/standard/lifecycle">
            <el-icon><Tickets /></el-icon>
            <template #title>标准生命周期</template>
          </el-menu-item>
          <el-menu-item index="/standard/batch-import">
            <el-icon><Upload /></el-icon>
            <template #title>标准批量导入</template>
          </el-menu-item>
          <el-menu-item index="/standard/batch-retire">
            <el-icon><Delete /></el-icon>
            <template #title>标准批量废止</template>
          </el-menu-item>
          <el-menu-item index="/standard/mapping-find">
            <el-icon><MagicStick /></el-icon>
            <template #title>映射自动发现</template>
          </el-menu-item>
          <el-menu-item index="/standard/publish-notify">
            <el-icon><Bell /></el-icon>
            <template #title>发布通知配置</template>
          </el-menu-item>
          <el-menu-item index="/standard/fallout-drill">
            <el-icon><DataAnalysis /></el-icon>
            <template #title>落标率钻取分析</template>
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
          <el-menu-item index="/datasource/health">
            <el-icon><TrendCharts /></el-icon>
            <template #title>健康度评估</template>
          </el-menu-item>
          <el-menu-item index="/datasource/log-analysis">
            <el-icon><Document /></el-icon>
            <template #title>日志分析</template>
          </el-menu-item>
          <el-menu-item index="/datasource/connectivity-test">
            <el-icon><Connection /></el-icon>
            <template #title>连通性测试</template>
          </el-menu-item>
          <el-menu-item index="/datasource/driver">
            <el-icon><Download /></el-icon>
            <template #title>驱动管理</template>
          </el-menu-item>
          <el-menu-item index="/datasource/batch-register">
            <el-icon><Files /></el-icon>
            <template #title>批量注册</template>
          </el-menu-item>
          <el-menu-item index="/datasource/perf-monitor">
            <el-icon><DataLine /></el-icon>
            <template #title>性能监控</template>
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
          <el-menu-item index="/metadata/collection-overview">
            <el-icon><DataAnalysis /></el-icon>
            <template #title>采集概览</template>
          </el-menu-item>
          <el-menu-item index="/metadata/collection-failure">
            <el-icon><Bell /></el-icon>
            <template #title>采集失败处理</template>
          </el-menu-item>
          <el-menu-item index="/metadata/tag-stats">
            <el-icon><TrendCharts /></el-icon>
            <template #title>标签统计</template>
          </el-menu-item>
          <el-menu-item index="/metadata/tag-conflict">
            <el-icon><Setting /></el-icon>
            <template #title>标签冲突处理</template>
          </el-menu-item>
          <el-menu-item index="/metadata/version">
            <el-icon><Clock /></el-icon>
            <template #title>元数据版本管理</template>
          </el-menu-item>
          <el-menu-item index="/metadata/version-notify">
            <el-icon><Bell /></el-icon>
            <template #title>版本通知</template>
          </el-menu-item>
          <el-menu-item index="/metadata/search">
            <el-icon><Search /></el-icon>
            <template #title>检索增强</template>
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
          <el-menu-item index="/datadev/schedule-arch">
            <el-icon><Connection /></el-icon>
            <template #title>调度与执行架构</template>
          </el-menu-item>
          <el-menu-item index="/datadev/refresh-compare">
            <el-icon><Collection /></el-icon>
            <template #title>刷新采集数据比对</template>
          </el-menu-item>
          <el-menu-item index="/datadev/window-calc">
            <el-icon><Calendar /></el-icon>
            <template #title>实时窗口计算</template>
          </el-menu-item>
          <el-menu-item index="/datadev/stream-adv">
            <el-icon><Cpu /></el-icon>
            <template #title>流式处理增强</template>
          </el-menu-item>
          <el-menu-item index="/datadev/ai-dev">
            <el-icon><MagicStick /></el-icon>
            <template #title>AI智能化开发</template>
          </el-menu-item>
          <el-menu-item index="/datadev/breakpoint">
            <el-icon><VideoCamera /></el-icon>
            <template #title>流程断点调试</template>
          </el-menu-item>
          <el-menu-item index="/datadev/step-preview">
            <el-icon><View /></el-icon>
            <template #title>单步执行与预览</template>
          </el-menu-item>
          <el-menu-item index="/datadev/mock-verify">
            <el-icon><Checked /></el-icon>
            <template #title>模拟数据验证</template>
          </el-menu-item>
          <el-menu-item index="/datadev/template-clone">
            <el-icon><Files /></el-icon>
            <template #title>任务模板与克隆</template>
          </el-menu-item>
          <el-menu-item index="/datadev/calendar">
            <el-icon><Calendar /></el-icon>
            <template #title>调度日历</template>
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
          <el-menu-item index="/quality/eval-model">
            <el-icon><DataAnalysis /></el-icon>
            <template #title>质量评估模型</template>
          </el-menu-item>
          <el-menu-item index="/quality/rule-template">
            <el-icon><Files /></el-icon>
            <template #title>规则模板库</template>
          </el-menu-item>
          <el-menu-item index="/quality/rule-custom">
            <el-icon><EditPen /></el-icon>
            <template #title>模板定制</template>
          </el-menu-item>
          <el-menu-item index="/quality/rule-version">
            <el-icon><Clock /></el-icon>
            <template #title>规则版本管理</template>
          </el-menu-item>
          <el-menu-item index="/quality/issue-ticket">
            <el-icon><Document /></el-icon>
            <template #title>问题工单</template>
          </el-menu-item>
          <el-menu-item index="/quality/report-export">
            <el-icon><Download /></el-icon>
            <template #title>报告导出</template>
          </el-menu-item>
          <el-menu-item index="/quality/realtime-monitor">
            <el-icon><Monitor /></el-icon>
            <template #title>实时质量监控</template>
          </el-menu-item>
          <el-menu-item index="/quality/realtime-task">
            <el-icon><VideoCamera /></el-icon>
            <template #title>实时任务指标</template>
          </el-menu-item>
          <el-menu-item index="/quality/dashboard">
            <el-icon><TrendCharts /></el-icon>
            <template #title>质量看板</template>
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
          <el-menu-item index="/resource/compare">
            <el-icon><Collection /></el-icon>
            <template #title>资产对比分析</template>
          </el-menu-item>
          <el-menu-item index="/resource/subscribe">
            <el-icon><Bell /></el-icon>
            <template #title>资产订阅通知</template>
          </el-menu-item>
          <el-menu-item index="/resource/favorite">
            <el-icon><Trophy /></el-icon>
            <template #title>资产收藏</template>
          </el-menu-item>
          <el-menu-item index="/resource/asset-stats">
            <el-icon><DataLine /></el-icon>
            <template #title>资产级统计</template>
          </el-menu-item>
          <el-menu-item index="/resource/field-stats">
            <el-icon><List /></el-icon>
            <template #title>字段级统计</template>
          </el-menu-item>
          <el-menu-item index="/resource/preview-policy">
            <el-icon><Key /></el-icon>
            <template #title>分级预览策略</template>
          </el-menu-item>
          <el-menu-item index="/resource/change-log">
            <el-icon><DocumentCopy /></el-icon>
            <template #title>资产变更日志</template>
          </el-menu-item>
          <el-menu-item index="/resource/probe-apply">
            <el-icon><MagicStick /></el-icon>
            <template #title>探查结果应用</template>
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
          <el-menu-item index="/security/classify-grade">
            <el-icon><Key /></el-icon>
            <template #title>数据分类分级</template>
          </el-menu-item>
          <el-menu-item index="/security/compliance-check">
            <el-icon><DocumentChecked /></el-icon>
            <template #title>合规检查</template>
          </el-menu-item>
          <el-menu-item index="/security/grade-list">
            <el-icon><List /></el-icon>
            <template #title>资产分级清单</template>
          </el-menu-item>
          <el-menu-item index="/security/key-rotation">
            <el-icon><SetUp /></el-icon>
            <template #title>密钥轮换</template>
          </el-menu-item>
          <el-menu-item index="/security/perm-flow">
            <el-icon><Connection /></el-icon>
            <template #title>权限流程状态机</template>
          </el-menu-item>
          <el-menu-item index="/security/perm-batch">
            <el-icon><Tickets /></el-icon>
            <template #title>权限批量处理</template>
          </el-menu-item>
          <el-menu-item index="/security/perm-minimum">
            <el-icon><Lock /></el-icon>
            <template #title>最小权限建议</template>
          </el-menu-item>
          <el-menu-item index="/security/sec-ops">
            <el-icon><Bell /></el-icon>
            <template #title>安全运营机制</template>
          </el-menu-item>
          <el-menu-item index="/security/net-host">
            <el-icon><Monitor /></el-icon>
            <template #title>网络与主机安全</template>
          </el-menu-item>
          <el-menu-item index="/security/sec-audit-analysis">
            <el-icon><Document /></el-icon>
            <template #title>安全审计分析</template>
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
          <el-menu-item index="/intelligence/meta-complete">
            <el-icon><MagicStick /></el-icon>
            <template #title>元数据智能补全</template>
          </el-menu-item>
          <el-menu-item index="/intelligence/agent-summary">
            <el-icon><Document /></el-icon>
            <template #title>智能体运行摘要</template>
          </el-menu-item>
          <el-menu-item index="/intelligence/agent-eval">
            <el-icon><TrendCharts /></el-icon>
            <template #title>智能体效果评估</template>
          </el-menu-item>
          <el-menu-item index="/intelligence/kb-content">
            <el-icon><Document /></el-icon>
            <template #title>知识内容管理</template>
          </el-menu-item>
          <el-menu-item index="/intelligence/kb-vector">
            <el-icon><Search /></el-icon>
            <template #title>知识向量检索</template>
          </el-menu-item>
          <el-menu-item index="/intelligence/kb-pilot">
            <el-icon><Promotion /></el-icon>
            <template #title>试点知识库建设</template>
          </el-menu-item>
          <el-menu-item index="/intelligence/kb-connect">
            <el-icon><Share /></el-icon>
            <template #title>知识库与智能体对接</template>
          </el-menu-item>
          <el-menu-item index="/intelligence/kb-category">
            <el-icon><Grid /></el-icon>
            <template #title>知识库分类体系</template>
          </el-menu-item>
          <el-menu-item index="/intelligence/kb-permission">
            <el-icon><Lock /></el-icon>
            <template #title>知识库权限控制</template>
          </el-menu-item>
          <el-menu-item index="/intelligence/kb-service">
            <el-icon><Service /></el-icon>
            <template #title>知识服务化发布</template>
          </el-menu-item>
          <el-menu-item index="/intelligence/agent-resource">
            <el-icon><Folder /></el-icon>
            <template #title>资源管理智能体</template>
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
          <el-menu-item index="/system/capacity">
            <el-icon><DataLine /></el-icon>
            <template #title>容量评估</template>
          </el-menu-item>
          <el-menu-item index="/system/storage-detail">
            <el-icon><Files /></el-icon>
            <template #title>存储分层明细</template>
          </el-menu-item>
          <el-menu-item index="/system/storage-plan">
            <el-icon><Folder /></el-icon>
            <template #title>存储容量规划</template>
          </el-menu-item>
          <el-menu-item index="/system/user-org">
            <el-icon><UserFilled /></el-icon>
            <template #title>用户与组织管理</template>
          </el-menu-item>
          <el-menu-item index="/system/message">
            <el-icon><Bell /></el-icon>
            <template #title>消息通知管理</template>
          </el-menu-item>
          <el-menu-item index="/system/param">
            <el-icon><Setting /></el-icon>
            <template #title>系统参数管理</template>
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
import { Aim, Bell, Calendar, Setting, Checked, CircleCheck, Clock, Coin, Collection, Connection, Cpu, DataAnalysis, DataLine, Delete, Document, DocumentChecked, DocumentCopy, Download, Edit, EditPen, Expand, Files, Fold, Folder, FolderOpened, Grid, Key, List, Lock, MagicStick, Monitor, Notebook, OfficeBuilding, PriceTag, Promotion, Search, Service, SetUp, Share, Tickets, TrendCharts, Trophy, Upload, User, UserFilled, VideoCamera, View, WindPower } from '@element-plus/icons-vue'

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
  '/standard/lifecycle': { parent: '数据标准管理', current: '标准生命周期' },
  '/standard/batch-import': { parent: '数据标准管理', current: '标准批量导入' },
  '/standard/batch-retire': { parent: '数据标准管理', current: '标准批量废止' },
  '/standard/mapping-find': { parent: '数据标准管理', current: '映射自动发现' },
  '/standard/publish-notify': { parent: '数据标准管理', current: '发布通知配置' },
  '/standard/fallout-drill': { parent: '数据标准管理', current: '落标率钻取分析' },
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

const moduleNames: Record<string, string> = {
  dashboard: '工作台',
  cockpit: '数据治理驾驶舱',
  standard: '数据标准管理',
  datasource: '数据源管理',
  metadata: '元数据管理',
  datadev: '数据开发集成',
  quality: '数据质量管理',
  resource: '数据资源管理',
  security: '数据安全与合规',
  intelligence: '智能治理能力',
  system: '系统管理',
  share: '数据服务与共享',
}

const pageSegmentTitles: Record<string, string> = {
  health: '健康度评估', 'log-analysis': '日志分析', 'connectivity-test': '连通性测试', driver: '驱动管理', 'batch-register': '批量注册', 'perf-monitor': '性能监控',
  'collection-overview': '采集概览', 'collection-failure': '采集失败处理', 'tag-stats': '标签统计', 'tag-conflict': '标签冲突处理', version: '元数据版本管理', 'version-notify': '版本通知', search: '检索增强',
  'schedule-arch': '调度与执行架构', 'refresh-compare': '刷新采集数据比对', 'window-calc': '实时窗口计算', 'stream-adv': '流式处理增强', 'ai-dev': 'AI智能化开发', breakpoint: '流程断点调试', 'step-preview': '单步执行与预览', 'mock-verify': '模拟数据验证', 'template-clone': '任务模板与克隆', calendar: '调度日历',
  'eval-model': '质量评估模型', 'rule-template': '规则模板库', 'rule-custom': '模板定制', 'rule-version': '规则版本管理', 'issue-ticket': '问题工单', 'report-export': '报告导出', 'realtime-monitor': '实时质量监控', 'realtime-task': '实时任务指标', dashboard: '质量看板',
  compare: '资产对比分析', subscribe: '资产订阅通知', favorite: '资产收藏', 'asset-stats': '资产级统计', 'field-stats': '字段级统计', 'preview-policy': '分级预览策略', 'change-log': '资产变更日志', 'probe-apply': '探查结果应用',
  'classify-grade': '数据分类分级', 'compliance-check': '合规检查', 'grade-list': '资产分级清单', 'key-rotation': '密钥轮换', 'perm-flow': '权限流程状态机', 'perm-batch': '权限批量处理', 'perm-minimum': '最小权限建议', 'sec-ops': '安全运营机制', 'net-host': '网络与主机安全', 'sec-audit-analysis': '安全审计分析',
  capacity: '容量评估', 'storage-detail': '存储分层明细', 'storage-plan': '存储容量规划', 'user-org': '用户与组织管理', message: '消息通知管理', param: '系统参数管理',
  'meta-complete': '元数据智能补全', 'agent-summary': '智能体运行摘要', 'agent-eval': '智能体效果评估', 'kb-content': '知识内容管理', 'kb-vector': '知识向量检索', 'kb-pilot': '试点知识库建设', 'kb-connect': '知识库与智能体对接', 'kb-category': '知识库分类体系', 'kb-permission': '知识库权限控制', 'kb-service': '知识服务化发布', 'agent-resource': '资源管理智能体',
}

const breadcrumb = computed(() => {
  const matched = Object.keys(pageTitleMap)
    .filter((path) => route.path.startsWith(path))
    .sort((a, b) => b.length - a.length)[0]
  if (matched) return pageTitleMap[matched]
  const seg = route.path.split('/').filter(Boolean)
  const module = seg[0] ?? 'dashboard'
  const last = seg[seg.length - 1] ?? 'dashboard'
  return { parent: moduleNames[module] ?? '工作台', current: pageSegmentTitles[last] ?? last }
})
</script>
