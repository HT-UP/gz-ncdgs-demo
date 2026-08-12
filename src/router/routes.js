import AppLayout from '@/layouts/AppLayout.vue';
import Workbench from '@/pages/Workbench.vue';
export const routes = [
    {
        path: '/',
        component: AppLayout,
        redirect: '/dashboard',
        children: [
            { path: 'dashboard', name: 'dashboard', component: Workbench },
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
                        path: 'lineage',
                        name: 'LineageAnalysis',
                        component: () => import('@/pages/metadata/lineage.vue'),
                    },
                    {
                        path: 'tag',
                        name: 'DataTag',
                        component: () => import('@/pages/metadata/tag.vue'),
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
                        path: 'compliance',
                        name: 'ComplianceGovern',
                        component: () => import('@/pages/security/compliance.vue'),
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
                ],
            },
        ],
    },
];
