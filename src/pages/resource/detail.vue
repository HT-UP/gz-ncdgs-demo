<template>
  <div class="standard-page asset-detail-page">
    <el-card class="panel-card asset-head-card" shadow="never">
      <div class="asset-head">
        <div class="asset-icon"><el-icon :size="28"><Tickets /></el-icon></div>
        <div class="asset-info">
          <div class="asset-title-row">
            <span class="asset-name">{{ asset.name }}</span>
            <el-tag v-if="asset.sensitive" type="danger" effect="dark" size="small">敏感资产</el-tag>
            <el-tag type="success" effect="plain" size="small">{{ asset.status }}</el-tag>
          </div>
          <div class="asset-meta">
            <span>盘点类型：{{ asset.type }}</span>
            <span>负责人：{{ asset.owner }}</span>
            <span>业务域：{{ asset.domain }}</span>
            <span>GWIS 编码：{{ asset.code }}</span>
          </div>
        </div>
        <div class="asset-actions">
          <el-button type="danger" :icon="Share" plain @click="openShare">发起共享</el-button>
          <el-button :icon="Download" plain @click="downloadAsset">导出资产</el-button>
        </div>
      </div>
    </el-card>

    <el-card class="panel-card" shadow="never">
      <el-tabs v-model="activeTab" class="asset-tabs">
        <el-tab-pane label="概览" name="overview">
          <div class="overview-grid">
            <div class="ov-card"><div class="ov-value" style="color:#da251d">{{ asset.rows }}</div><div class="ov-label">数据行数（万）</div></div>
            <div class="ov-card"><div class="ov-value" style="color:#2b6cb0">{{ asset.fields }}</div><div class="ov-label">字段总数</div></div>
            <div class="ov-card"><div class="ov-value" style="color:#00a854">{{ asset.qualityScore }}</div><div class="ov-label">质量综合分</div></div>
            <div class="ov-card"><div class="ov-value" style="color:#ed7b2f">{{ asset.upstream }}</div><div class="ov-label">上游来源</div></div>
            <div class="ov-card"><div class="ov-value" style="color:#9b59b6">{{ asset.downstream }}</div><div class="ov-label">下游应用</div></div>
          </div>
          <el-descriptions :column="3" border class="mt-16">
            <el-descriptions-item label="存储引擎">{{ asset.engine }}</el-descriptions-item>
            <el-descriptions-item label="最近采集">{{ asset.lastCollect }}</el-descriptions-item>
            <el-descriptions-item label="数据规模">{{ asset.size }}</el-descriptions-item>
            <el-descriptions-item label="更新频率">{{ asset.frequency }}</el-descriptions-item>
            <el-descriptions-item label="保留周期">{{ asset.retention }}</el-descriptions-item>
            <el-descriptions-item label="关联数据集">{{ asset.related }}</el-descriptions-item>
          </el-descriptions>
        </el-tab-pane>

        <el-tab-pane label="结构" name="structure">
          <div class="toolbar-row">
            <el-select v-model="structureFilter" placeholder="全部字段" clearable class="filter-select">
              <el-option v-for="t in ['全部字段', '标识字段', '属性字段', '时间字段']" :key="t" :label="t" :value="t" />
            </el-select>
            <span class="dep-text">共 {{ fields.length }} 个字段</span>
          </div>
          <el-table :data="filteredFields" size="small" stripe class="mt-12">
            <el-table-column type="index" label="#" width="46" />
            <el-table-column prop="colName" label="字段名" min-width="140" />
            <el-table-column prop="colType" label="数据类型" width="120" />
            <el-table-column prop="comment" label="说明" min-width="160" />
            <el-table-column label="主键" width="70" align="center">
              <template #default="{ row }"><el-tag v-if="row.pk" type="danger" size="small" effect="dark">PK</el-tag></template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="质量" name="quality">
          <div class="quality-grid">
            <div class="q-card"><div class="q-num" style="color:#00a854">183/186</div><div class="q-label">规则执行通过</div></div>
            <div class="q-card"><div class="q-num" style="color:#da251d">12</div><div class="q-label">待修复问题</div></div>
            <div class="q-card"><div class="q-num" style="color:#2b6cb0">96.2%</div><div class="q-label">最近核查通过率</div></div>
          </div>
          <el-card class="panel-card mt-16 q-detail" shadow="never">
            <template #header><div class="panel-header"><span>问题明细</span></div></template>
            <el-table :data="qualityIssues" size="small">
              <el-table-column prop="rule" label="质量规则" min-width="150" />
              <el-table-column prop="level" label="严重级别" width="90">
                <template #default="{ row }"><el-tag size="small" :type="row.type" effect="dark">{{ row.level }}</el-tag></template>
              </el-table-column>
              <el-table-column prop="cnt" label="影响记录数" width="100" align="right" />
              <el-table-column prop="status" label="状态" width="90">
                <template #default="{ row }"><span :class="row.status === '已修复' ? 'trend-positive' : 'trend-negative'">{{ row.status }}</span></template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-tab-pane>

        <el-tab-pane label="血缘" name="lineage">
          <div class="lineage-row">
            <div class="lg-node lg-up">
              <div class="lg-title">上游</div>
              <div v-for="u in asset.upstreams" :key="u" class="lg-item">{{ u }}</div>
            </div>
            <div class="lg-arrow"><el-icon><Right /></el-icon></div>
            <div class="lg-node lg-self">
              <div class="lg-title">当前资产</div>
              <div class="lg-item lg-strong">{{ asset.name }}</div>
            </div>
            <div class="lg-arrow"><el-icon><Right /></el-icon></div>
            <div class="lg-node lg-down">
              <div class="lg-title">下游</div>
              <div v-for="d in asset.downstreams" :key="d" class="lg-item">{{ d }}</div>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="标准映射" name="standard">
          <el-table :data="standardMaps" size="small" stripe>
            <el-table-column prop="field" label="数字段" min-width="140" />
            <el-table-column prop="std" label="映射标准" min-width="180" />
            <el-table-column prop="stdType" label="标准分类" width="110" />
            <el-table-column label="符合性" width="90">
              <template #default="{ row }">
                <el-tag size="small" :type="row.ok ? 'success' : 'warning'" effect="dark">{{ row.ok ? '符合' : '偏离' }}</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="安全" name="security">
          <div class="toolbar-row">
            <span class="dep-text">分级：{{ asset.sensitive ? 'L3-L4（敏感）' : 'L1-L2（一般）' }}</span>
            <el-tag size="small" type="danger" effect="plain">脱敏策略：按字段动态脱敏</el-tag>
          </div>
          <div class="security-grid mt-12">
            <el-card class="s-card" shadow="never"><div class="s-col-title">授权账号（{{ 5 }}）</div><div class="s-list"><div v-for="a in authActors" :key="a" class="s-item">{{ a }}</div></div></el-card>
            <el-card class="s-card" shadow="never"><div class="s-col-title">加密策略</div><div class="s-list"><div class="s-item">字段加密：SM4</div><div class="s-item">传输加密：TLS 1.2+</div></div></el-card>
            <el-card class="s-card" shadow="never"><div class="s-col-title">访问审计</div><div class="s-list"><div class="s-item">最近访问：8 分钟前</div><div class="s-item">本月查询：312 次</div></div></el-card>
          </div>
        </el-tab-pane>

        <el-tab-pane label="共享服务" name="share">
          <el-table :data="shareServices" size="small" stripe>
            <el-table-column prop="svcName" label="共享服务" min-width="150" />
            <el-table-column prop="svcType" label="服务类型" width="110" />
            <el-table-column prop="callers" label="订阅方" min-width="140" />
            <el-table-column label="状态" width="90">
              <template #default="{ row }">
                <el-tag size="small" :type="row.online ? 'success' : 'info'" effect="dark">{{ row.online ? '已发布' : '已停用' }}</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Download, Right, Share, Tickets } from '@element-plus/icons-vue'

const activeTab = ref('overview')

const asset = {
  name: 'ads_line_flow（线网客流指标）',
  type: '汇总指标资产',
  owner: '张工',
  domain: '运营调度',
  code: 'GWIS-SWG-2026-0012',
  status: '已发布',
  sensitive: true,
  rows: '2,360',
  fields: 24,
  qualityScore: '92.6',
  upstream: 4,
  downstream: 6,
  engine: 'Doris（MPP）',
  lastCollect: '2026-08-13 02:00',
  size: '1.2 TB',
  frequency: '每 30 分钟',
  retention: '24 个月',
  related: '客流分析数据集',
  upstreams: ['dws_ticket_daily', 'ods_station_flow', 'dim_station_info', 'dim_line_info'],
  downstreams: ['客流统计查询服务', '月度客流分析报表', '线网规划仿真系统', '车站大屏展示端', '运力调度决策平台', '外部科研合作方'],
}

const fields = [
  { colName: 'line_code', colType: 'VARCHAR(16)', comment: '线路编码', pk: true },
  { colName: 'station_code', colType: 'VARCHAR(16)', comment: '站点编码', pk: true },
  { colName: 'period', colType: 'VARCHAR(20)', comment: '统计区间', pk: true },
  { colName: 'total_passengers', colType: 'BIGINT', comment: '客流量', pk: false },
  { colName: 'peak_cnt', colType: 'BIGINT', comment: '高峰期客流', pk: false },
  { colName: 'congestion', colType: 'DECIMAL(5,2)', comment: '拥挤度指数', pk: false },
  { colName: 'update_time', colType: 'DATETIME', comment: '更新时间', pk: false },
]

const structureFilter = ref('')
const filteredFields = computed(() => (structureFilter.value === '全部字段' || !structureFilter.value ? fields : fields))

const qualityIssues = [
  { rule: '完整性-必填字段非空', level: '一般', type: 'warning' as const, cnt: 8, status: '待修复' },
  { rule: '准确性-客流阈值校验', level: '严重', type: 'danger' as const, cnt: 3, status: '待修复' },
  { rule: '一致性-线路编码参照', level: '严重', type: 'danger' as const, cnt: 1, status: '已修复' },
]

const standardMaps = [
  { field: 'line_code', std: '线路编码数据元标准', stdType: '基础类', ok: true },
  { field: 'station_code', std: '站点编码数据元标准', stdType: '基础类', ok: true },
  { field: 'total_passengers', std: '客流指标口径标准', stdType: '指标类', ok: false },
  { field: 'update_time', std: '时间格式规范', stdType: '格式类', ok: true },
]

const authActors = ['数据平台管理员（读写）', '运营调度组（只读）', 'BI 报表服务账户（只读）', '客流分析平台（订阅）', '审计账户（只读）']

const shareServices = [
  { svcName: '客流统计查询服务', svcType: 'RESTful API', callers: '车站大屏、客流分析平台', online: true },
  { svcName: '客流数据共享目录项', svcType: '数据集共享', callers: '线网规划仿真系统', online: true },
  { svcName: '旧版点查接口', svcType: 'RESTful API', callers: '历史遗留应用', online: false },
]

const openShare = () => ElMessage.info('已进入共享申请流程（Mock）')
const downloadAsset = () => ElMessage.success('资产信息已导出（Mock）')
</script>

<style lang="scss" scoped>
.asset-detail-page {
  display: grid;
  gap: 16px;
}

.asset-head {
  display: flex;
  align-items: center;
  gap: 18px;
}

.asset-icon {
  width: 56px;
  height: 56px;
  flex: none;
  border-radius: 12px;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #da251d, #b71c1c);
  color: #fff;
}

.asset-info {
  flex: 1;
  min-width: 0;
}

.asset-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.asset-name {
  font-size: 20px;
  font-weight: 700;
  color: #4a4a4a;
}

.asset-meta {
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px 20px;
  color: #8c8c8c;
  font-size: 13px;
}

.overview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
  gap: 12px;
}

.ov-card,
.q-card {
  border: 1px solid #edf0f5;
  border-radius: 8px;
  padding: 16px 12px;
  text-align: center;
  background: #fafbfd;
}

.ov-value,
.q-num {
  font-size: 24px;
  font-weight: 700;
}

.ov-label,
.q-label {
  margin-top: 4px;
  color: #8c8c8c;
  font-size: 12px;
}

.mt-16 {
  margin-top: 16px;
}

.mt-12 {
  margin-top: 12px;
}

.quality-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.lineage-row {
  display: flex;
  align-items: stretch;
  gap: 14px;
  min-height: 160px;
}

.lg-node {
  flex: 1;
  border-radius: 10px;
  padding: 14px;
  background: #fff;
}

.lg-up {
  border: 1px solid #e4e7ed;
  background: rgba(43, 108, 176, 0.05);
}

.lg-down {
  border: 1px solid #e4e7ed;
  background: rgba(0, 168, 84, 0.05);
}

.lg-self {
  border: 2px solid #da251d;
  background: rgba(218, 37, 29, 0.05);
  display: grid;
  place-items: center;
}

.lg-title {
  font-weight: 700;
  color: #8c8c8c;
  margin-bottom: 10px;
}

.lg-item {
  padding: 6px 10px;
  border-radius: 6px;
  background: #fff;
  margin-bottom: 6px;
  border: 1px solid #edf0f5;
  font-size: 12px;
}

.lg-strong {
  font-weight: 700;
  color: #da251d;
}

.lg-arrow {
  display: grid;
  place-items: center;
  color: #c0c4cc;
}

.security-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.s-card {
  border: 1px solid #edf0f5;
}

.s-col-title {
  font-size: 14px;
  font-weight: 700;
  color: #4a4a4a;
}

.s-list {
  display: grid;
  gap: 6px;
}

.s-item {
  font-size: 12px;
  color: #4a4a4a;
  padding: 6px 0;
  border-bottom: 1px dashed #edf0f5;

  &:last-child {
    border-bottom: none;
  }
}

.asset-tabs {
  :deep(.el-tabs__item) {
    font-weight: 600;
  }
}
</style>