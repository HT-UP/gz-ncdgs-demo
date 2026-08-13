<template>
  <div class="catalog-page share-catalog-page">
    <el-card class="panel-card catalog-card" shadow="never">
      <div class="catalog-layout">
        <div class="catalog-tree-panel">
          <div class="panel-header"><span>服务分类</span></div>
          <el-input v-model="treeKeyword" placeholder="筛选分类" size="small" clearable class="mt-12 search-input-sm w-full" :prefix-icon="Search" />
          <el-tree ref="treeRef" :data="treeData" :props="{ label: 'name', children: 'children' }" node-key="key" default-expand-all :filter-node-method="filterTree" @node-click="onNodeClick">
            <template #default="{ data }">
              <div class="catalog-node">
                <el-icon><component :is="data.icon" /></el-icon>
                <span>{{ data.name }}</span>
                <span class="catalog-count">{{ data.type === 'domain' ? countByDomain(data.name) : data.type === 'kind' ? countByKind(data.name) : '' }}</span>
              </div>
            </template>
          </el-tree>
        </div>

        <div class="catalog-table-panel">
          <div class="toolbar-row">
            <el-input v-model="svcKeyword" placeholder="搜索服务名称 / 路径 / 资产" clearable class="search-input" :prefix-icon="Search" />
            <el-select v-model="kindFilter" placeholder="服务类型" clearable class="filter-select">
              <el-option v-for="k in kindOptions" :key="k" :label="k" :value="k" />
            </el-select>
            <el-select v-model="domainFilter" placeholder="业务域" clearable class="filter-select">
              <el-option v-for="d in domainOptions" :key="d" :label="d" :value="d" />
            </el-select>
            <span class="dep-text">共 {{ filterByTree.length }} 个已发布服务</span>
          </div>

          <el-row :gutter="12" class="catalog-grid">
            <el-col v-for="s in filterByTree" :key="s.id" :span="8">
              <div class="svc-card" @click="openDetail(s)">
                <div class="svc-card-top">
                  <div class="svc-icon"><el-icon><Share /></el-icon></div>
                  <el-tag size="small" type="success" effect="dark">已发布</el-tag>
                </div>
                <div class="svc-name">{{ s.name }}</div>
                <div class="svc-path">{{ s.path }}</div>
                <div class="svc-meta">
                  <span>{{ s.kind }}</span>
                  <span>{{ s.method }}</span>
                  <span :style="{ color: levelColorMap[s.level] }">{{ s.level }}</span>
                </div>
                <div class="svc-footer">
                  <span class="dep-text">{{ s.calls }} 次调用</span>
                  <span class="dep-text">{{ s.owner }}</span>
                </div>
              </div>
            </el-col>
          </el-row>
          <el-empty v-if="!filterByTree.length" description="当前分类下暂无已发布服务" />
        </div>
      </div>
    </el-card>

    <el-drawer v-model="detailVisible" title="服务详情" size="480px">
      <template v-if="detailSvc">
        <div class="detail-head">
          <div class="detail-name">{{ detailSvc.name }}</div>
          <el-tag type="success" size="small" effect="dark">已发布</el-tag>
        </div>
        <el-descriptions :column="1" border size="small" class="mt-12">
          <el-descriptions-item label="调用地址">
            <code class="detail-call">{{ detailBaseUrl }}{{ detailSvc.path }}</code>
          </el-descriptions-item>
          <el-descriptions-item label="请求方式">{{ detailSvc.method }}</el-descriptions-item>
          <el-descriptions-item label="服务类型">{{ detailSvc.kind }}</el-descriptions-item>
          <el-descriptions-item label="所属业务域">{{ detailSvc.domain }}</el-descriptions-item>
          <el-descriptions-item label="封装资产">{{ detailSvc.asset }}</el-descriptions-item>
          <el-descriptions-item label="数据分级">
            <span class="security-level" :style="{ background: levelColorMap[detailSvc.level] }">{{ detailSvc.level }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="鉴权方式">{{ detailSvc.auth ? 'AppKey/Secret' : '免鉴权' }}</el-descriptions-item>
          <el-descriptions-item label="限流策略">{{ detailSvc.limit }}</el-descriptions-item>
          <el-descriptions-item label="服务负责人">{{ detailSvc.owner }}</el-descriptions-item>
          <el-descriptions-item label="发布时间">{{ detailSvc.publishTime }}</el-descriptions-item>
        </el-descriptions>

        <div class="detail-section">入参</div>
        <el-table :data="detailSvc.params" size="small" border>
          <el-table-column prop="name" label="参数名" />
          <el-table-column prop="type" label="类型" width="90" />
          <el-table-column label="必填" width="60" align="center">
            <template #default="{ row }">{{ row.required ? '是' : '否' }}</template>
          </el-table-column>
        </el-table>

        <div class="detail-section">出参</div>
        <el-table :data="detailSvc.outputs" size="small" border>
          <el-table-column prop="name" label="字段名" />
          <el-table-column prop="type" label="类型" width="100" />
          <el-table-column prop="alias" label="别名" />
        </el-table>

        <div class="detail-actions">
          <el-button type="primary" plain @click="testSvc">在线测试</el-button>
          <el-button type="danger" plain @click="applySvc">申请共享</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Files, Folder, Search, Share, Tickets } from '@element-plus/icons-vue'

const detailBaseUrl = 'https://api.gz-metro-data.cn'
const levelColorMap: Record<string, string> = { L1: '#8c8c8c', L2: '#2B6CB0', L3: '#ED7B2F', L4: '#DA251D' }

const domainOptions = ['客运票务', '旅客服务', '运营调度', '财务共享', '设备运维']
const kindOptions = ['实时查询', '指标计算', '数据抽取', '知识问答']

const services = ref([
  { id: 1, name: '客流统计查询服务', path: '/api/v1/flow/stat', method: 'GET', kind: '实时查询', domain: '运营调度', asset: 'ads_line_flow', level: 'L2', auth: true, limit: '100次/分钟', owner: '张工', publishTime: '2026-08-01 10:00', calls: 2381, params: [{ name: 'line_code', type: 'STRING', required: true }], outputs: [{ name: 'total_passengers', type: 'INT', alias: 'totalPassengers' }] },
  { id: 2, name: '线路基础信息服务', path: '/api/v1/line/detail', method: 'GET', kind: '实时查询', domain: '运营调度', asset: 'line_info', level: 'L1', auth: true, limit: '200次/分钟', owner: '李工', publishTime: '2026-07-28 14:00', calls: 1654, params: [{ name: 'line_code', type: 'STRING', required: true }], outputs: [{ name: 'line_name', type: 'STRING', alias: 'lineName' }] },
  { id: 3, name: '车站信息同步服务', path: '/api/v1/station/list', method: 'GET', kind: '数据抽取', domain: '客运票务', asset: 'station_info', level: 'L1', auth: false, limit: '500次/分钟', owner: '王工', publishTime: '2026-07-25 09:30', calls: 3209, params: [{ name: 'page', type: 'INT', required: false }], outputs: [{ name: 'station_name', type: 'STRING', alias: 'stationName' }] },
  { id: 4, name: '售票明细查询服务', path: '/api/v1/ticket/query', method: 'POST', kind: '实时查询', domain: '客运票务', asset: 'ticket_sale', level: 'L3', auth: true, limit: '50次/分钟', owner: '张工', publishTime: '2026-08-12 18:00', calls: 318, params: [{ name: 'begin_date', type: 'DATE', required: true }], outputs: [{ name: 'order_id', type: 'STRING', alias: 'orderId' }] },
  { id: 5, name: '订单汇总指标服务', path: '/api/v1/order/summary', method: 'GET', kind: '指标计算', domain: '财务共享', asset: 'dws_order_report', level: 'L2', auth: true, limit: '80次/分钟', owner: '李工', publishTime: '2026-08-11 11:20', calls: 892, params: [{ name: 'line_code', type: 'STRING', required: true }], outputs: [{ name: 'total_amount', type: 'DECIMAL', alias: 'totalAmount' }] },
  { id: 6, name: '站点设施知识问答', path: '/api/v1/qa/station', method: 'POST', kind: '知识问答', domain: '旅客服务', asset: '知识库', level: 'L1', auth: true, limit: '30次/分钟', owner: '赵工', publishTime: '2026-08-08 15:10', calls: 420, params: [], outputs: [{ name: 'answer', type: 'STRING', alias: 'answer' }] },
])

const treeKeyword = ref('')
const svcKeyword = ref('')
const kindFilter = ref('')
const domainFilter = ref('')
const treeKey = ref('')

const treeData = ref([
  { key: 'domain', name: '按业务域', type: 'root', icon: Folder, children: domainOptions.map((d, i) => ({ key: `domain-${i}`, name: d, type: 'domain', icon: Folder })) },
  { key: 'kind', name: '按服务类型', type: 'root', icon: Files, children: kindOptions.map((k, i) => ({ key: `kind-${i}`, name: k, type: 'kind', icon: Tickets })) },
])

watch(treeKeyword, (v) => treeRef.value?.filter(v))

const treeRef = ref()

const filterTree = (value: string, data: { name: string }) => data.name.includes(value)

const onNodeClick = (data: { type: string; name: string }) => {
  treeKey.value = data.type === 'domain' || data.type === 'kind' ? `${data.type}:${data.name}` : ''
}

const countByDomain = (name: string) => services.value.filter((s) => s.domain === name).length
const countByKind = (name: string) => services.value.filter((s) => s.kind === name).length

const filterByTree = computed(() => {
  const [type, name] = treeKey.value.split(':')
  return services.value.filter((s) => {
    if (type === 'domain' && s.domain !== name) return false
    if (type === 'kind' && s.kind !== name) return false
    if (kindFilter.value && s.kind !== kindFilter.value) return false
    if (domainFilter.value && s.domain !== domainFilter.value) return false
    if (!svcKeyword.value) return true
    const kw = svcKeyword.value.toLowerCase()
    return s.name.toLowerCase().includes(kw) || s.path.toLowerCase().includes(kw) || s.asset.toLowerCase().includes(kw)
  })
})

const detailVisible = ref(false)
const detailSvc = ref<(typeof services.value)[number] | null>(null)

const openDetail = (s: (typeof services.value)[number]) => {
  detailSvc.value = s
  detailVisible.value = true
}

const testSvc = () => ElMessage.info('在线测试即将打开（Mock），可输入参数并查看响应')
const applySvc = () => ElMessage.success('已跳转共享申请流程（Mock）')
</script>

<style lang="scss" scoped>
.share-catalog-page {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.catalog-card {
  flex: 1;
  min-height: 0;
  margin: 0;

  :deep(.el-card__body) {
    height: 100%;
  }
}

.catalog-grid {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  align-content: flex-start;
  margin-top: 4px;

  :deep(.el-col) {
    margin-bottom: 12px;
  }
}

.svc-card {
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 12px 14px;
  cursor: pointer;
  background: #fff;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;

  &:hover {
    border-color: #da251d;
    box-shadow: 0 6px 18px rgba(218, 37, 29, 0.12);
    transform: translateY(-2px);
  }
}

.svc-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.svc-icon {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  display: grid;
  place-items: center;
  background: rgba(218, 37, 29, 0.08);
  color: #da251d;
}

.svc-name {
  font-size: 14px;
  font-weight: 700;
  color: #4a4a4a;
  margin-bottom: 2px;
}

.svc-path {
  font-size: 12px;
  color: #8c8c8c;
  margin-bottom: 8px;
  word-break: break-all;
}

.svc-meta {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;

  span {
    font-size: 12px;
    color: #8c8c8c;
    padding: 1px 6px;
    border-radius: 4px;
    background: #f7f8fa;
  }
}

.svc-footer {
  display: flex;
  justify-content: space-between;
  padding-top: 6px;
  border-top: 1px solid #edf0f5;
}

.detail-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.detail-name {
  font-size: 16px;
  font-weight: 700;
  color: #4a4a4a;
}

.detail-call {
  color: #da251d;
  font-size: 12px;
  word-break: break-all;
}

.detail-section {
  font-size: 13px;
  font-weight: 700;
  color: #4a4a4a;
  margin: 16px 0 8px;
  padding-left: 8px;
  border-left: 3px solid #da251d;
}

.detail-actions {
  display: flex;
  gap: 10px;
  margin-top: 18px;
}
</style>