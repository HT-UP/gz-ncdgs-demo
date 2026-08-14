import type { RouteRecordRaw } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'
import Workbench from '@/pages/Workbench.vue'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: AppLayout,
    redirect: '/dashboard',
    children: [
      { path: 'dashboard', name: 'dashboard', component: Workbench },
      {
        path: 'cockpit',
        name: 'GovernanceCockpit',
        component: () => import('@/pages/dashboard/cockpit.vue'),
      },
      {
        path: 'standard',
        name: 'Standard',
        redirect: '/standard/list',
        children: [
          {
            path: 'list',
            name: 'StandardList',
            component: () => import('@/pages/standard/list.vue'),
          },
          {
            path: 'impact',
            name: 'ImpactAnalysis',
            component: () => import('@/pages/standard/impact.vue'),
          },
          {
            path: 'model-design',
            name: 'ModelDesign',
            component: () => import('@/pages/standard/model-design.vue'),
          },
          {
            path: 'quality-standard',
            name: 'QualityStandard',
            component: () => import('@/pages/standard/quality-standard.vue'),
          },
          {
            path: 'implementation',
            name: 'Implementation',
            component: () => import('@/pages/standard/implementation.vue'),
          },
          {
            path: 'version',
            name: 'StandardVersion',
            component: () => import('@/pages/standard/version.vue'),
          },
          {
            path: 'lifecycle',
            name: 'StandardLifecycle',
            component: () => import('@/pages/standard/lifecycle.vue'),
          },
          {
            path: 'batch-import',
            name: 'StandardBatchImport',
            component: () => import('@/pages/standard/batch-import.vue'),
          },
          {
            path: 'batch-retire',
            name: 'StandardBatchRetire',
            component: () => import('@/pages/standard/batch-retire.vue'),
          },
          {
            path: 'mapping-find',
            name: 'MappingAutoFind',
            component: () => import('@/pages/standard/mapping-find.vue'),
          },
          {
            path: 'publish-notify',
            name: 'StandardPublishNotify',
            component: () => import('@/pages/standard/publish-notify.vue'),
          },
          {
            path: 'fallout-drill',
            name: 'FalloutDrill',
            component: () => import('@/pages/standard/fallout-drill.vue'),
          },
        ],
      },
      {
        path: 'datasource',
        name: 'DataSource',
        redirect: '/datasource/list',
        children: [
          {
            path: 'list',
            name: 'DataSourceList',
            component: () => import('@/pages/datasource/list.vue'),
          },
          {
            path: 'register',
            name: 'DataSourceRegister',
            component: () => import('@/pages/datasource/register.vue'),
          },
          {
            path: 'connection-pool',
            name: 'ConnectionPool',
            component: () => import('@/pages/datasource/connection-pool.vue'),
          },
          {
            path: 'template',
            name: 'TemplateManage',
            component: () => import('@/pages/datasource/template.vue'),
          },
          {
            path: 'group',
            name: 'DataSourceGroup',
            component: () => import('@/pages/datasource/group.vue'),
          },
          {
            path: 'monitor',
            name: 'DataSourceMonitor',
            component: () => import('@/pages/datasource/monitor.vue'),
          },
          {
            path: 'health',
            name: 'DataSourceHealth',
            component: () => import('@/pages/datasource/health.vue'),
          },
          {
            path: 'log-analysis',
            name: 'DataSourceLogAnalysis',
            component: () => import('@/pages/datasource/log-analysis.vue'),
          },
          {
            path: 'connectivity-test',
            name: 'ConnectivityTest',
            component: () => import('@/pages/datasource/connectivity-test.vue'),
          },
          {
            path: 'driver',
            name: 'DriverManage',
            component: () => import('@/pages/datasource/driver.vue'),
          },
          {
            path: 'batch-register',
            name: 'DataSourceBatchRegister',
            component: () => import('@/pages/datasource/batch-register.vue'),
          },
          {
            path: 'perf-monitor',
            name: 'DataSourcePerfMonitor',
            component: () => import('@/pages/datasource/perf-monitor.vue'),
          },
        ],
      },
      {
        path: 'metadata',
        name: 'Metadata',
        redirect: '/metadata/overview',
        children: [
          {
            path: 'overview',
            name: 'MetadataOverview',
            component: () => import('@/pages/metadata/overview.vue'),
          },
          {
            path: 'model',
            name: 'MetadataModel',
            component: () => import('@/pages/metadata/model.vue'),
          },
          {
            path: 'data-element',
            name: 'DataElement',
            component: () => import('@/pages/metadata/data-element.vue'),
          },
          {
            path: 'collection',
            name: 'MetadataCollection',
            component: () => import('@/pages/metadata/collection.vue'),
          },
          {
            path: 'schedule',
            name: 'MetaSchedule',
            component: () => import('@/pages/metadata/schedule.vue'),
          },
          {
            path: 'lineage',
            name: 'LineageAnalysis',
            component: () => import('@/pages/metadata/lineage.vue'),
          },
          {
            path: 'tag',
            name: 'DataTag',
            component: () => import('@/pages/metadata/tag.vue'),
          },
          {
            path: 'collection-overview',
            name: 'CollectionOverview',
            component: () => import('@/pages/metadata/collection-overview.vue'),
          },
          {
            path: 'collection-failure',
            name: 'CollectionFailure',
            component: () => import('@/pages/metadata/collection-failure.vue'),
          },
          {
            path: 'tag-stats',
            name: 'TagStats',
            component: () => import('@/pages/metadata/tag-stats.vue'),
          },
          {
            path: 'tag-conflict',
            name: 'TagConflict',
            component: () => import('@/pages/metadata/tag-conflict.vue'),
          },
          {
            path: 'version',
            name: 'MetadataVersion',
            component: () => import('@/pages/metadata/version.vue'),
          },
          {
            path: 'version-notify',
            name: 'MetadataVersionNotify',
            component: () => import('@/pages/metadata/version-notify.vue'),
          },
          {
            path: 'search',
            name: 'MetadataSearch',
            component: () => import('@/pages/metadata/search.vue'),
          },
        ],
      },
      {
        path: 'datadev',
        name: 'DataDev',
        redirect: '/datadev/overview',
        children: [
          {
            path: 'overview',
            name: 'DataDevOverview',
            component: () => import('@/pages/datadev/overview.vue'),
          },
          {
            path: 'batch',
            name: 'BatchProcessing',
            component: () => import('@/pages/datadev/batch.vue'),
          },
          {
            path: 'realtime',
            name: 'RealtimeProcessing',
            component: () => import('@/pages/datadev/realtime.vue'),
          },
          {
            path: 'stream',
            name: 'StreamProcessing',
            component: () => import('@/pages/datadev/stream.vue'),
          },
          {
            path: 'task',
            name: 'TaskManage',
            component: () => import('@/pages/datadev/task.vue'),
          },
          {
            path: 'collect-config',
            name: 'CollectConfig',
            component: () => import('@/pages/datadev/collect-config.vue'),
          },
          {
            path: 'monitor',
            name: 'TaskMonitor',
            component: () => import('@/pages/datadev/monitor.vue'),
          },
          {
            path: 'flow',
            name: 'FlowConfig',
            component: () => import('@/pages/datadev/flow.vue'),
          },
          {
            path: 'security',
            name: 'DataDevSecurity',
            component: () => import('@/pages/datadev/security.vue'),
          },
          {
            path: 'schedule-arch',
            name: 'ScheduleArch',
            component: () => import('@/pages/datadev/schedule-arch.vue'),
          },
          {
            path: 'refresh-compare',
            name: 'RefreshCompare',
            component: () => import('@/pages/datadev/refresh-compare.vue'),
          },
          {
            path: 'window-calc',
            name: 'WindowCalc',
            component: () => import('@/pages/datadev/window-calc.vue'),
          },
          {
            path: 'stream-adv',
            name: 'StreamAdvanced',
            component: () => import('@/pages/datadev/stream-adv.vue'),
          },
          {
            path: 'ai-dev',
            name: 'AIDevIntegration',
            component: () => import('@/pages/datadev/ai-dev.vue'),
          },
          {
            path: 'breakpoint',
            name: 'FlowBreakpoint',
            component: () => import('@/pages/datadev/breakpoint.vue'),
          },
          {
            path: 'step-preview',
            name: 'StepPreview',
            component: () => import('@/pages/datadev/step-preview.vue'),
          },
          {
            path: 'mock-verify',
            name: 'MockDataVerify',
            component: () => import('@/pages/datadev/mock-verify.vue'),
          },
          {
            path: 'template-clone',
            name: 'TaskTemplateClone',
            component: () => import('@/pages/datadev/template-clone.vue'),
          },
          {
            path: 'calendar',
            name: 'ScheduleCalendar',
            component: () => import('@/pages/datadev/calendar.vue'),
          },
        ],
      },
      {
        path: 'quality',
        name: 'Quality',
        redirect: '/quality/overview',
        children: [
          {
            path: 'overview',
            name: 'QualityOverview',
            component: () => import('@/pages/quality/overview.vue'),
          },
          {
            path: 'rule',
            name: 'QualityRule',
            component: () => import('@/pages/quality/rule.vue'),
          },
          {
            path: 'task',
            name: 'QualityTask',
            component: () => import('@/pages/quality/task.vue'),
          },
          {
            path: 'audit',
            name: 'QualityAudit',
            component: () => import('@/pages/quality/audit.vue'),
          },
          {
            path: 'certification',
            name: 'QualityCertification',
            component: () => import('@/pages/quality/certification.vue'),
          },
          {
            path: 'report',
            name: 'QualityReport',
            component: () => import('@/pages/quality/report.vue'),
          },
          {
            path: 'eval-model',
            name: 'QualityEvalModel',
            component: () => import('@/pages/quality/eval-model.vue'),
          },
          {
            path: 'rule-template',
            name: 'RuleTemplateLibrary',
            component: () => import('@/pages/quality/rule-template.vue'),
          },
          {
            path: 'rule-custom',
            name: 'RuleTemplateCustom',
            component: () => import('@/pages/quality/rule-custom.vue'),
          },
          {
            path: 'rule-version',
            name: 'RuleVersionManage',
            component: () => import('@/pages/quality/rule-version.vue'),
          },
          {
            path: 'issue-ticket',
            name: 'QualityIssueTicket',
            component: () => import('@/pages/quality/issue-ticket.vue'),
          },
          {
            path: 'report-export',
            name: 'QualityReportExport',
            component: () => import('@/pages/quality/report-export.vue'),
          },
          {
            path: 'realtime-monitor',
            name: 'RealtimeQualityMonitor',
            component: () => import('@/pages/quality/realtime-monitor.vue'),
          },
          {
            path: 'realtime-task',
            name: 'RealtimeTaskMetrics',
            component: () => import('@/pages/quality/realtime-task.vue'),
          },
          {
            path: 'dashboard',
            name: 'QualityDashboard',
            component: () => import('@/pages/quality/dashboard.vue'),
          },
        ],
      },
      {
        path: 'resource',
        name: 'Resource',
        redirect: '/resource/overview',
        children: [
          {
            path: 'overview',
            name: 'ResourceOverview',
            component: () => import('@/pages/resource/overview.vue'),
          },
          {
            path: 'catalog',
            name: 'ResourceCatalog',
            component: () => import('@/pages/resource/catalog.vue'),
          },
          {
            path: 'preview',
            name: 'DataPreview',
            component: () => import('@/pages/resource/preview.vue'),
          },
          {
            path: 'permission',
            name: 'PermissionApply',
            component: () => import('@/pages/resource/permission.vue'),
          },
          {
            path: 'lineage',
            name: 'ResourceLineage',
            component: () => import('@/pages/resource/lineage.vue'),
          },
          {
            path: 'feature',
            name: 'FeatureAutoIdentify',
            component: () => import('@/pages/resource/feature.vue'),
          },
          {
            path: 'explore',
            name: 'ExploreTask',
            component: () => import('@/pages/resource/explore.vue'),
          },
          {
            path: 'detail',
            name: 'AssetDetail',
            component: () => import('@/pages/resource/detail.vue'),
          },
          {
            path: 'compare',
            name: 'AssetCompare',
            component: () => import('@/pages/resource/compare.vue'),
          },
          {
            path: 'subscribe',
            name: 'AssetSubscribe',
            component: () => import('@/pages/resource/subscribe.vue'),
          },
          {
            path: 'favorite',
            name: 'AssetFavorite',
            component: () => import('@/pages/resource/favorite.vue'),
          },
          {
            path: 'asset-stats',
            name: 'AssetStats',
            component: () => import('@/pages/resource/asset-stats.vue'),
          },
          {
            path: 'field-stats',
            name: 'FieldStats',
            component: () => import('@/pages/resource/field-stats.vue'),
          },
          {
            path: 'preview-policy',
            name: 'PreviewPolicy',
            component: () => import('@/pages/resource/preview-policy.vue'),
          },
          {
            path: 'change-log',
            name: 'AssetChangeLog',
            component: () => import('@/pages/resource/change-log.vue'),
          },
          {
            path: 'probe-apply',
            name: 'ProbeApply',
            component: () => import('@/pages/resource/probe-apply.vue'),
          },
        ],
      },
      {
        path: 'security',
        name: 'Security',
        redirect: '/security/overview',
        children: [
          {
            path: 'overview',
            name: 'SecurityOverview',
            component: () => import('@/pages/security/overview.vue'),
          },
          {
            path: 'tenant',
            name: 'TenantManage',
            component: () => import('@/pages/security/tenant.vue'),
          },
          {
            path: 'access-control',
            name: 'AccessControl',
            component: () => import('@/pages/security/access-control.vue'),
          },
          {
            path: 'audit',
            name: 'SecurityAudit',
            component: () => import('@/pages/security/audit.vue'),
          },
          {
            path: 'encryption',
            name: 'EncryptionMasking',
            component: () => import('@/pages/security/encryption.vue'),
          },
          {
            path: 'masking',
            name: 'MaskingRuleConfig',
            component: () => import('@/pages/security/masking.vue'),
          },
          {
            path: 'compliance',
            name: 'ComplianceGovern',
            component: () => import('@/pages/security/compliance.vue'),
          },
          {
            path: 'classify-grade',
            name: 'ClassifyGrade',
            component: () => import('@/pages/security/classify-grade.vue'),
          },
          {
            path: 'compliance-check',
            name: 'ComplianceCheck',
            component: () => import('@/pages/security/compliance-check.vue'),
          },
          {
            path: 'grade-list',
            name: 'GradeList',
            component: () => import('@/pages/security/grade-list.vue'),
          },
          {
            path: 'key-rotation',
            name: 'KeyRotation',
            component: () => import('@/pages/security/key-rotation.vue'),
          },
          {
            path: 'perm-flow',
            name: 'PermFlow',
            component: () => import('@/pages/security/perm-flow.vue'),
          },
          {
            path: 'perm-batch',
            name: 'PermBatch',
            component: () => import('@/pages/security/perm-batch.vue'),
          },
          {
            path: 'perm-minimum',
            name: 'PermMinimum',
            component: () => import('@/pages/security/perm-minimum.vue'),
          },
          {
            path: 'sec-ops',
            name: 'SecurityOps',
            component: () => import('@/pages/security/sec-ops.vue'),
          },
          {
            path: 'net-host',
            name: 'NetHostSecurity',
            component: () => import('@/pages/security/net-host.vue'),
          },
          {
            path: 'sec-audit-analysis',
            name: 'SecurityAuditAnalysis',
            component: () => import('@/pages/security/sec-audit-analysis.vue'),
          },
        ],
      },
      {
        path: 'intelligence',
        name: 'Intelligence',
        redirect: '/intelligence/overview',
        children: [
          {
            path: 'overview',
            name: 'IntelligenceOverview',
            component: () => import('@/pages/intelligence/overview.vue'),
          },
          {
            path: 'metadata-ai',
            name: 'MetadataAI',
            component: () => import('@/pages/intelligence/metadata-ai.vue'),
          },
          {
            path: 'classify',
            name: 'IntelligenceClassify',
            component: () => import('@/pages/intelligence/classify.vue'),
          },
          {
            path: 'knowledge',
            name: 'KnowledgeBase',
            component: () => import('@/pages/intelligence/knowledge.vue'),
          },
          {
            path: 'agent',
            name: 'DataGovernAgent',
            component: () => import('@/pages/intelligence/agent.vue'),
          },
          {
            path: 'capability',
            name: 'AgentCapability',
            component: () => import('@/pages/intelligence/capability.vue'),
          },
          {
            path: 'meta-complete',
            name: 'MetaComplete',
            component: () => import('@/pages/intelligence/meta-complete.vue'),
          },
          {
            path: 'agent-summary',
            name: 'AgentSummary',
            component: () => import('@/pages/intelligence/agent-summary.vue'),
          },
          {
            path: 'agent-eval',
            name: 'AgentEval',
            component: () => import('@/pages/intelligence/agent-eval.vue'),
          },
          {
            path: 'kb-content',
            name: 'KBContent',
            component: () => import('@/pages/intelligence/kb-content.vue'),
          },
          {
            path: 'kb-vector',
            name: 'KBVector',
            component: () => import('@/pages/intelligence/kb-vector.vue'),
          },
          {
            path: 'kb-pilot',
            name: 'KBPilot',
            component: () => import('@/pages/intelligence/kb-pilot.vue'),
          },
          {
            path: 'kb-connect',
            name: 'KBConnect',
            component: () => import('@/pages/intelligence/kb-connect.vue'),
          },
          {
            path: 'kb-category',
            name: 'KBCategory',
            component: () => import('@/pages/intelligence/kb-category.vue'),
          },
          {
            path: 'kb-permission',
            name: 'KBPermission',
            component: () => import('@/pages/intelligence/kb-permission.vue'),
          },
          {
            path: 'kb-service',
            name: 'KBService',
            component: () => import('@/pages/intelligence/kb-service.vue'),
          },
          {
            path: 'agent-resource',
            name: 'AgentResource',
            component: () => import('@/pages/intelligence/agent-resource.vue'),
          },
        ],
      },
      {
        path: 'system',
        name: 'System',
        redirect: '/system/user',
        children: [
          {
            path: 'user',
            name: 'UserManage',
            component: () => import('@/pages/system/user.vue'),
          },
          {
            path: 'role',
            name: 'RolePermission',
            component: () => import('@/pages/system/role.vue'),
          },
          {
            path: 'monitor',
            name: 'SystemMonitor',
            component: () => import('@/pages/system/monitor.vue'),
          },
          {
            path: 'log',
            name: 'OperationLog',
            component: () => import('@/pages/system/log.vue'),
          },
          {
            path: 'baseline',
            name: 'SecurityBaseline',
            component: () => import('@/pages/system/baseline.vue'),
          },
          {
            path: 'capacity',
            name: 'CapacityEval',
            component: () => import('@/pages/system/capacity.vue'),
          },
          {
            path: 'storage-detail',
            name: 'StorageDetail',
            component: () => import('@/pages/system/storage-detail.vue'),
          },
          {
            path: 'storage-plan',
            name: 'StoragePlan',
            component: () => import('@/pages/system/storage-plan.vue'),
          },
          {
            path: 'user-org',
            name: 'UserOrgManage',
            component: () => import('@/pages/system/user-org.vue'),
          },
          {
            path: 'message',
            name: 'MessageNotify',
            component: () => import('@/pages/system/message.vue'),
          },
          {
            path: 'param',
            name: 'SystemParam',
            component: () => import('@/pages/system/param.vue'),
          },
        ],
      },
      {
        path: 'share',
        name: 'DataShare',
        redirect: '/share/catalog',
        children: [
          {
            path: 'register',
            name: 'ServiceRegister',
            component: () => import('@/pages/share/register.vue'),
          },
          {
            path: 'publish',
            name: 'ServicePublish',
            component: () => import('@/pages/share/publish.vue'),
          },
          {
            path: 'catalog',
            name: 'ServiceCatalog',
            component: () => import('@/pages/share/catalog.vue'),
          },
          {
            path: 'auth',
            name: 'ServiceAuth',
            component: () => import('@/pages/share/auth.vue'),
          },
          {
            path: 'monitor',
            name: 'ServiceMonitor',
            component: () => import('@/pages/share/monitor.vue'),
          },
          {
            path: 'logs',
            name: 'ServiceLogs',
            component: () => import('@/pages/share/logs.vue'),
          },
          {
            path: 'apply',
            name: 'ShareApply',
            component: () => import('@/pages/share/apply.vue'),
          },
          {
            path: 'ledger',
            name: 'ShareLedger',
            component: () => import('@/pages/share/ledger.vue'),
          },
        ],
      },
      {
        path: '/:pathMatch(.*)*',
        redirect: '/dashboard',
      },
    ],
  },
]
