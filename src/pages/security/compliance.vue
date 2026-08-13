<template>
  <div class="standard-page compliance-page">
    <div class="compliance-tabs-wrap">
      <el-tabs v-model="activeTab" type="border-card" stretch>
        <!-- ============ 数据分类分级 ============ -->
        <el-tab-pane label="数据分类分级" name="classify">
          <div class="classify-pane">
            <div class="compliance-stats">
              <div v-for="s in classifyStats" :key="s.label" class="compliance-stat">
                <div class="compliance-stat-value" :style="{ color: s.color }">{{ s.value }}</div>
                <div class="compliance-stat-label">{{ s.label }}</div>
              </div>
            </div>

            <el-row :gutter="16" class="compliance-rows">
              <el-col :span="7">
                <el-card class="compliance-card" shadow="never">
                  <template #header>
                    <div class="panel-header"><span>数据分级矩阵</span></div>
                  </template>
                  <div class="block-title dep-text">定级依据：《数据安全法》第二十一条 分类分级要求</div>
                  <div class="grade-matrix">
                    <div class="gm-head gm-object">影响对象</div>
                    <div class="gm-head">低影响</div>
                    <div class="gm-head">中影响</div>
                    <div class="gm-head">高影响</div>
                    <div v-for="row in gradeMatrix" :key="row.object" class="gm-row">
                      <div class="gm-object">{{ row.object }}</div>
                      <div class="gm-cell" :class="`level-${row.low}`">{{ row.low }}</div>
                      <div class="gm-cell" :class="`level-${row.mid}`">{{ row.mid }}</div>
                      <div class="gm-cell" :class="`level-${row.high}`">{{ row.high }}</div>
                    </div>
                  </div>

                  <div class="block-title">分级定义</div>
                  <div v-for="d in gradeDefine" :key="d.level" class="grade-item">
                    <el-tag size="small" :type="gradeTagType[d.level]" effect="dark">{{ d.level }}</el-tag>
                    <span class="grade-name">{{ d.name }}</span>
                    <span class="dep-text">：{{ d.desc }}</span>
                  </div>

                  <div class="block-title">分类目录（{{ categoryPool.length }} 类）</div>
                  <div class="category-tags">
                    <el-tag v-for="c in categoryPool" :key="c" size="small" effect="plain" type="info">{{ c }}</el-tag>
                  </div>
                </el-card>
              </el-col>

              <el-col :span="17">
                <el-card class="compliance-card" shadow="never">
                  <template #header>
                    <div class="panel-header">
                      <span>数据资产分级清单（{{ classifiedAssets.length }}）</span>
                      <div class="panel-actions">
                        <el-button type="danger" size="small" :icon="Plus" @click="openClassifyDrawer">新增定级</el-button>
                        <el-button size="small" :icon="Download" @click="exportClassify">导出清单</el-button>
                      </div>
                    </div>
                  </template>

                  <div class="toolbar-row">
                    <el-input v-model="classifyKeyword" placeholder="按资产名称 / 责任人搜索" clearable class="search-input" :prefix-icon="Search" />
                    <el-select v-model="classifyLevel" placeholder="分级" clearable class="filter-select">
                      <el-option v-for="l in ['L1', 'L2', 'L3', 'L4']" :key="l" :label="l" :value="l" />
                    </el-select>
                    <el-select v-model="classifyCategory" placeholder="分类" clearable class="filter-select">
                      <el-option v-for="c in categoryPool" :key="c" :label="c" :value="c" />
                    </el-select>
                  </div>

                  <el-table :data="filteredAssets" stripe>
                    <el-table-column prop="name" label="数据资产名称" min-width="150">
                      <template #default="{ row }">
                        <span class="asset-name">{{ row.name }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="domain" label="所属业务域" width="100" />
                    <el-table-column prop="category" label="数据分类" width="100" />
                    <el-table-column label="数据分级" width="76" align="center">
                      <template #default="{ row }">
                        <el-tag size="small" :type="gradeTagType[row.level]" effect="dark">{{ row.level }}</el-tag>
                      </template>
                    </el-table-column>
                    <el-table-column label="敏感字段" min-width="180">
                      <template #default="{ row }">
                        <el-tag v-for="s in row.sensitive" :key="s" size="small" type="danger" effect="plain" class="mr-4">{{ s }}</el-tag>
                      </template>
                    </el-table-column>
                    <el-table-column prop="regulation" label="依据法规" width="150" />
                    <el-table-column prop="owner" label="定级责任人" width="92" />
                    <el-table-column prop="updateTime" label="更新时间" width="96" />
                    <el-table-column label="操作" width="128" fixed="right" align="center">
                      <template #default="{ row }">
                        <el-button link type="primary" size="small" @click="adjustLevel(row)">调整级别</el-button>
                        <el-button link type="info" size="small" @click="assetDetail(row)">详情</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-card>
              </el-col>
            </el-row>
          </div>
        </el-tab-pane>

        <!-- ============ 合规检查 ============ -->
        <el-tab-pane label="合规检查" name="check">
          <div class="check-pane">
            <div class="compliance-stats">
              <div v-for="s in checkStats" :key="s.label" class="compliance-stat">
                <div class="compliance-stat-value" :style="{ color: s.color }">{{ s.value }}</div>
                <div class="compliance-stat-label">{{ s.label }}</div>
              </div>
            </div>

            <el-row :gutter="16" class="compliance-rows">
              <el-col :span="16">
                <el-card class="compliance-card" shadow="never">
                  <template #header>
                    <div class="panel-header">
                      <span>合规检查清单</span>
                      <div class="panel-actions">
                        <el-button type="primary" plain size="small" @click="autoCheck">自动检查</el-button>
                        <el-button type="danger" :icon="DocumentCopy" size="small" @click="jumpToReport">生成检查报告</el-button>
                      </div>
                    </div>
                  </template>

                  <div class="toolbar-row">
                    <el-input v-model="keyword" placeholder="按法规 / 条款 / 映射功能搜索" clearable class="search-input" :prefix-icon="Search" />
                    <el-select v-model="filterStatus" placeholder="状态" clearable class="filter-select">
                      <el-option label="合规" value="合规" />
                      <el-option label="不合规" value="不合规" />
                      <el-option label="待整改" value="待整改" />
                    </el-select>
                    <el-select v-model="filterRisk" placeholder="风险等级" clearable class="filter-select">
                      <el-option label="高" value="高" />
                      <el-option label="中" value="中" />
                      <el-option label="低" value="低" />
                    </el-select>
                  </div>

                  <el-table :data="pagedItems" stripe>
                    <el-table-column prop="regulation" label="法规" width="160" />
                    <el-table-column prop="clause" label="条款" width="128" />
                    <el-table-column prop="requirement" label="要求说明" min-width="190" show-overflow-tooltip />
                    <el-table-column prop="mappedFeature" label="映射系统功能" width="132" />
                    <el-table-column label="状态" width="84">
                      <template #default="{ row }">
                        <el-tag :type="complianceStatusTag[row.status]" effect="dark">{{ row.status }}</el-tag>
                      </template>
                    </el-table-column>
                    <el-table-column label="风险" width="78">
                      <template #default="{ row }">
                        <span class="security-level" :style="{ background: levelColor[row.riskLevel] }">{{ row.riskLevel }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="操作" width="132" fixed="right">
                      <template #default="{ row }">
                        <el-button v-if="row.riskId" link type="warning" size="small" @click="openRisk(row)">整改跟踪</el-button>
                        <el-button link type="primary" size="small" @click="viewEvidence(row)">证据</el-button>
                      </template>
                    </el-table-column>
                  </el-table>

                  <el-pagination
                    class="pager"
                    layout="total, prev, pager, next"
                    :total="filteredItems.length"
                    :page-size="pageSize"
                    :current-page="currentPage"
                    background
                    @current-change="changePage"
                  />
                </el-card>
              </el-col>

              <el-col :span="8">
                <el-card class="compliance-card" shadow="never">
                  <template #header>
                    <div class="panel-header"><span>风险整改跟踪</span></div>
                  </template>
                  <div v-for="risk in riskList" :key="risk.id" class="risk-item">
                    <div class="risk-head">
                      <span class="risk-id">{{ risk.id }}</span>
                      <el-tag size="small" :type="risk.stageTag" effect="plain">{{ risk.stage }}</el-tag>
                    </div>
                    <div class="risk-desc">{{ risk.title }}</div>
                    <el-steps :active="risk.activeStep" size="small" align-center class="risk-steps">
                      <el-step title="风险" />
                      <el-step title="工单" />
                      <el-step title="整改" />
                      <el-step title="验证" />
                    </el-steps>
                    <div class="dep-text">{{ risk.updateTime }} · {{ risk.owner }}</div>
                  </div>
                </el-card>

                <el-card class="compliance-card mt-16" shadow="never">
                  <template #header>
                    <div class="panel-header"><span>检查记录</span></div>
                  </template>
                  <div v-for="rec in checkRecords" :key="rec.time" class="record-item">
                    <div class="record-head">
                      <span class="record-time">{{ rec.time }}</span>
                      <el-tag size="small" :type="rec.result === '通过' ? 'success' : 'warning'" effect="dark">{{ rec.result }}</el-tag>
                    </div>
                    <div class="record-scope">{{ rec.scope }}</div>
                    <div class="dep-text">{{ rec.executor }} · {{ rec.summary }}</div>
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </div>
        </el-tab-pane>

        <!-- ============ 合规报告 ============ -->
        <el-tab-pane label="合规报告" name="report">
          <div class="report-pane">
            <div class="compliance-stats">
              <div v-for="s in reportStats" :key="s.label" class="compliance-stat">
                <div class="compliance-stat-value" :style="{ color: s.color }">{{ s.value }}</div>
                <div class="compliance-stat-label">{{ s.label }}</div>
              </div>
            </div>

            <el-card class="compliance-card" shadow="never">
              <template #header>
                <div class="panel-header">
                  <span>合规报告管理（{{ reports.length }}）</span>
                  <div class="panel-actions">
                    <el-button type="danger" size="small" :icon="DocumentCopy" @click="openReportDrawer">生成报告</el-button>
                  </div>
                </div>
              </template>

              <div class="toolbar-row">
                <el-input v-model="reportKeyword" placeholder="按报告名称 / 编号搜索" clearable class="search-input" :prefix-icon="Search" />
                <el-select v-model="reportTypeFilter" placeholder="报告类型" clearable class="filter-select">
                  <el-option label="年度" value="年度" />
                  <el-option label="季度" value="季度" />
                  <el-option label="专项" value="专项" />
                </el-select>
                <el-select v-model="reportConclusionFilter" placeholder="结论" clearable class="filter-select">
                  <el-option label="合规" value="合规" />
                  <el-option label="基本合规" value="基本合规" />
                  <el-option label="存在风险" value="存在风险" />
                </el-select>
                <span class="dep-text">共 {{ filteredReports.length }} 份报告</span>
              </div>

              <el-table :data="filteredReports" stripe>
                <el-table-column prop="id" label="报告编号" width="118" />
                <el-table-column prop="name" label="报告名称" min-width="190" show-overflow-tooltip />
                <el-table-column prop="type" label="类型" width="72">
                  <template #default="{ row }">
                    <el-tag size="small" :type="reportTypeTag[row.type]" effect="plain">{{ row.type }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="period" label="统计周期" width="180" />
                <el-table-column prop="regulationCount" label="覆盖法规" width="86" align="center">
                  <template #default="{ row }">
                    <span class="dep-text">{{ row.regulationCount }} 部</span>
                  </template>
                </el-table-column>
                <el-table-column prop="checkCount" label="检查项" width="72" align="center" />
                <el-table-column label="合规率" width="150">
                  <template #default="{ row }">
                    <el-progress :percentage="row.passRate" :stroke-width="8" :color="row.passRate >= 90 ? '#00A854' : '#ED7B2F'" />
                  </template>
                </el-table-column>
                <el-table-column label="结论" width="92">
                  <template #default="{ row }">
                    <el-tag size="small" :type="reportConclusionTag[row.conclusion]" effect="dark">{{ row.conclusion }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="createTime" label="生成时间" width="96" />
                <el-table-column prop="creator" label="生成人" width="88" />
                <el-table-column label="操作" width="150" fixed="right" align="center">
                  <template #default="{ row }">
                    <el-button link type="primary" size="small" @click="reportDetail(row)">查看</el-button>
                    <el-button link type="success" size="small" @click="downloadReport(row)">下载</el-button>
                    <el-button link type="warning" size="small" @click="regenerateReport(row)">重生成</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 新增 / 调整定级弹框 -->
    <el-dialog
      v-model="classifyDrawerVisible"
      :title="editingClassify ? '调整数据分级' : '新增数据定级'"
      width="640px"
      class="compliance-dialog"
      destroy-on-close
    >
      <el-form :model="classifyForm" label-width="104px">
        <div class="rule-section-title">资产信息</div>
        <el-form-item label="数据资产名称">
          <el-input v-model="classifyForm.name" placeholder="如表名 / 数据文件 / 接口名称" />
        </el-form-item>
        <el-form-item label="所属业务域">
          <el-select v-model="classifyForm.domain" class="w-full">
            <el-option v-for="d in domainPool" :key="d" :label="d" :value="d" />
          </el-select>
        </el-form-item>
        <el-form-item label="数据类型">
          <el-select v-model="classifyForm.dataType" class="w-full">
            <el-option label="结构化表" value="结构化表" />
            <el-option label="半结构化文件" value="半结构化文件" />
            <el-option label="非结构化文档" value="非结构化文档" />
            <el-option label="API 服务" value="API 服务" />
          </el-select>
        </el-form-item>

        <div class="rule-section-title">分类分级结果</div>
        <el-form-item label="数据分类">
          <el-select v-model="classifyForm.category" class="w-full">
            <el-option v-for="c in categoryPool" :key="c" :label="c" :value="c" />
          </el-select>
        </el-form-item>
        <el-form-item label="数据分级">
          <el-radio-group v-model="classifyForm.level">
            <el-radio v-for="l in ['L1', 'L2', 'L3', 'L4']" :key="l" :value="l">{{ l }} {{ gradeBrief[l] }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="敏感字段">
          <el-select v-model="classifyForm.sensitive" multiple filterable allow-create default-first-option class="w-full" placeholder="输入敏感字段后回车">
            <el-option v-for="f in sensitivePool" :key="f" :label="f" :value="f" />
          </el-select>
        </el-form-item>

        <div class="rule-section-title">定级管理</div>
        <el-form-item label="依据法规">
          <el-select v-model="classifyForm.regulation" class="w-full">
            <el-option v-for="r in regulationPool" :key="r" :label="r" :value="r" />
          </el-select>
        </el-form-item>
        <el-form-item label="定级责任人">
          <el-select v-model="classifyForm.owner" class="w-full">
            <el-option v-for="o in ownerPool" :key="o" :label="o" :value="o" />
          </el-select>
        </el-form-item>
        <el-form-item label="修订说明">
          <el-input v-model="classifyForm.remark" type="textarea" :rows="2" placeholder="本次定级 / 调整的依据与说明" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="classifyDrawerVisible = false">取消</el-button>
        <el-button type="danger" @click="saveClassify">保存定级</el-button>
      </template>
    </el-dialog>

    <!-- 生成合规报告弹框 -->
    <el-dialog v-model="reportDrawerVisible" title="生成合规报告" width="620px" class="compliance-dialog" destroy-on-close>
      <el-form :model="reportForm" label-width="96px">
        <el-form-item label="报告名称">
          <el-input v-model="reportForm.name" placeholder="如：2026 年第三季度数据安全合规检查报告" />
        </el-form-item>
        <el-form-item label="报告类型">
          <el-radio-group v-model="reportForm.type">
            <el-radio value="年度">年度</el-radio>
            <el-radio value="季度">季度</el-radio>
            <el-radio value="专项">专项</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="统计周期">
          <el-date-picker
            v-model="reportForm.period"
            type="daterange"
            value-format="YYYY-MM-DD"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            class="w-full"
          />
        </el-form-item>
        <el-form-item label="覆盖法规">
          <el-checkbox-group v-model="reportForm.regulations">
            <el-checkbox v-for="r in regulationPool" :key="r" :value="r">{{ r }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="负责人">
          <el-select v-model="reportForm.owner" class="w-full">
            <el-option v-for="o in ownerPool" :key="o" :label="o" :value="o" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="reportForm.remark" type="textarea" :rows="2" placeholder="报告关注重点 / 附加说明" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="reportDrawerVisible = false">取消</el-button>
        <el-button type="danger" @click="saveReport">生成</el-button>
      </template>
    </el-dialog>

    <!-- 风险整改闭环 -->
    <el-dialog v-model="riskVisible" title="风险整改闭环" width="640px">
      <template v-if="currentRisk">
        <el-descriptions :column="1" border size="small">
          <el-descriptions-item label="风险编号">{{ currentRisk.riskId }}</el-descriptions-item>
          <el-descriptions-item label="关联条款">{{ currentRisk.regulation }} {{ currentRisk.clause }}</el-descriptions-item>
          <el-descriptions-item label="风险内容">{{ currentRisk.requirement }}</el-descriptions-item>
          <el-descriptions-item label="责任部门">信息中心</el-descriptions-item>
        </el-descriptions>
        <div class="section-title mt-16">整改流程</div>
        <el-steps :active="2" align-center class="risk-steps">
          <el-step title="风险登记" />
          <el-step title="工单下发" />
          <el-step title="整改实施" />
          <el-step title="复验关闭" />
        </el-steps>
        <el-timeline class="mt-16">
          <el-timeline-item timestamp="2026-08-10 10:00" type="danger">风险登记：{{ currentRisk.regulation }} 检查不合规</el-timeline-item>
          <el-timeline-item timestamp="2026-08-10 15:20" type="warning">工单下发：WO-2026-0812 已派发至信息中心</el-timeline-item>
          <el-timeline-item timestamp="2026-08-12 09:30" type="primary">整改实施：修复完成，等待验证</el-timeline-item>
        </el-timeline>
      </template>
      <template #footer>
        <el-button type="primary" plain @click="closeRisk">标记验证通过</el-button>
        <el-button type="danger" @click="exportRiskEvidence">导出审计证据</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { DocumentCopy, Download, Plus, Search } from '@element-plus/icons-vue'
import { mockComplianceItems, type ComplianceItem } from '@/mock/security'

const activeTab = ref('classify')

/* ==================== 数据分类分级 ==================== */
const gradeMatrix = [
  { object: '国家安全', low: 'L2', mid: 'L3', high: 'L4' },
  { object: '公共利益', low: 'L2', mid: 'L3', high: 'L4' },
  { object: '个人权益', low: 'L1', mid: 'L2', high: 'L3' },
  { object: '企业权益', low: 'L1', mid: 'L2', high: 'L3' },
]

const gradeBrief: Record<string, string> = {
  L1: '一般',
  L2: '内部',
  L3: '敏感',
  L4: '核心',
}

const gradeTagType: Record<string, 'info' | 'primary' | 'warning' | 'danger'> = {
  L1: 'info',
  L2: 'primary',
  L3: 'warning',
  L4: 'danger',
}

const gradeDefine = [
  { level: 'L1', name: '一般数据', desc: '泄露后仅造成轻微影响，可公开' },
  { level: 'L2', name: '内部数据', desc: '泄露后造成一般影响，仅限内部使用' },
  { level: 'L3', name: '敏感数据', desc: '泄露后损害个人 / 企业合法权益' },
  { level: 'L4', name: '核心数据', desc: '泄露后危害国家安全、公共利益' },
]

const categoryPool = ['个人信息', '经营数据', '政务民生', '技术运维', '交通运行', '财务核算']
const domainPool = ['客运票务', '旅客服务', '基础设施', '设备运维', '运营调度', '财务共享']
const regulationPool = ['《数据安全法》', '《个人信息保护法》', '《网络安全法》', '《数据出境安全评估办法》', '《关基安全保护条例》']
const ownerPool = ['张工', '李工', '王工', '赵工']
const sensitivePool = ['身份证号', '手机号', '姓名', '家庭住址', '购票记录', '支付账户', '设备编号', 'GPS 轨迹', '员工号', '居住地址']

type ClassifiedAsset = {
  id: string
  name: string
  domain: string
  dataType: string
  category: string
  level: 'L1' | 'L2' | 'L3' | 'L4'
  sensitive: string[]
  regulation: string
  owner: string
  updateTime: string
}

const classifiedAssets = ref<ClassifiedAsset[]>([
  { id: 'cls-01', name: 'ticket_sale_detail', domain: '客运票务', dataType: '结构化表', category: '个人信息', level: 'L3', sensitive: ['身份证号', '姓名', '购票记录'], regulation: '《个人信息保护法》', owner: '李工', updateTime: '2026-08-05' },
  { id: 'cls-02', name: 'passenger_info', domain: '旅客服务', dataType: '结构化表', category: '个人信息', level: 'L3', sensitive: ['身份证号', '手机号', '家庭住址'], regulation: '《个人信息保护法》', owner: '李工', updateTime: '2026-08-05' },
  { id: 'cls-03', name: 'payment_record', domain: '财务共享', dataType: '结构化表', category: '经营数据', level: 'L4', sensitive: ['支付账户', '金额'], regulation: '《数据安全法》', owner: '赵工', updateTime: '2026-07-28' },
  { id: 'cls-04', name: 'flow_stat_daily', domain: '运营调度', dataType: '结构化表', category: '交通运行', level: 'L2', sensitive: ['客流统计'], regulation: '《数据安全法》', owner: '王工', updateTime: '2026-07-22' },
  { id: 'cls-05', name: 'device_status_log', domain: '设备运维', dataType: '结构化表', category: '技术运维', level: 'L2', sensitive: ['设备编号'], regulation: '《网络安全法》', owner: '王工', updateTime: '2026-07-15' },
  { id: 'cls-06', name: 'ticket_sale', domain: '客运票务', dataType: '结构化表', category: '个人信息', level: 'L3', sensitive: ['购票记录', '手机号'], regulation: '《个人信息保护法》', owner: '李工', updateTime: '2026-07-10' },
  { id: 'cls-07', name: 'line_info', domain: '基础设施', dataType: '结构化表', category: '交通运行', level: 'L1', sensitive: [], regulation: '《数据安全法》', owner: '张工', updateTime: '2026-06-30' },
  { id: 'cls-08', name: 'station_video_upload', domain: '旅客服务', dataType: '非结构化文档', category: '个人信息', level: 'L3', sensitive: ['人脸图像', 'GPS 轨迹'], regulation: '《个人信息保护法》', owner: '李工', updateTime: '2026-06-20' },
])

const classifyKeyword = ref('')
const classifyLevel = ref('')
const classifyCategory = ref('')

const filteredAssets = computed(() =>
  classifiedAssets.value.filter((a) => {
    if (classifyLevel.value && a.level !== classifyLevel.value) return false
    if (classifyCategory.value && a.category !== classifyCategory.value) return false
    if (!classifyKeyword.value) return true
    const kw = classifyKeyword.value.toLowerCase()
    return a.name.toLowerCase().includes(kw) || a.owner.toLowerCase().includes(kw) || a.domain.toLowerCase().includes(kw)
  }),
)

const classifyStats = computed(() => [
  { label: '数据资产总数', value: `${classifiedAssets.value.length} 项`, color: '#4A4A4A' },
  { label: 'L1 一般数据', value: classifiedAssets.value.filter((a) => a.level === 'L1').length, color: '#8c8c8c' },
  { label: 'L2 内部数据', value: classifiedAssets.value.filter((a) => a.level === 'L2').length, color: '#2B6CB0' },
  { label: 'L3 敏感数据', value: classifiedAssets.value.filter((a) => a.level === 'L3').length, color: '#ED7B2F' },
  { label: 'L4 核心数据', value: classifiedAssets.value.filter((a) => a.level === 'L4').length, color: '#DA251D' },
])

const classifyDrawerVisible = ref(false)
const editingClassify = ref(false)

const classifyForm = reactive({
  id: '',
  name: '',
  domain: '客运票务',
  dataType: '结构化表',
  category: '个人信息',
  level: 'L2',
  sensitive: [] as string[],
  regulation: '《数据安全法》',
  owner: '张工',
  remark: '',
})

const openClassifyDrawer = () => {
  editingClassify.value = false
  Object.assign(classifyForm, {
    id: '',
    name: '',
    domain: '客运票务',
    dataType: '结构化表',
    category: '个人信息',
    level: 'L2',
    sensitive: [],
    regulation: '《数据安全法》',
    owner: '张工',
    remark: '',
  })
  classifyDrawerVisible.value = true
}

const adjustLevel = (row: ClassifiedAsset) => {
  editingClassify.value = true
  Object.assign(classifyForm, {
    id: row.id,
    name: row.name,
    domain: row.domain,
    dataType: row.dataType,
    category: row.category,
    level: row.level,
    sensitive: row.sensitive,
    regulation: row.regulation,
    owner: row.owner,
    remark: '',
  })
  classifyDrawerVisible.value = true
}

const saveClassify = () => {
  if (!classifyForm.name.trim()) {
    ElMessage.warning('请输入数据资产名称')
    return
  }
  if (editingClassify.value) {
    const idx = classifiedAssets.value.findIndex((a) => a.id === classifyForm.id)
    if (idx >= 0) {
      classifiedAssets.value[idx] = { ...classifiedAssets.value[idx], ...classifyForm, level: classifyForm.level as ClassifiedAsset['level'], updateTime: new Date().toLocaleDateString('sv-SE') }
    }
    ElMessage.success(`「${classifyForm.name}」分级已调整为 ${classifyForm.level}（Mock）`)
  } else {
    classifiedAssets.value.unshift({
      id: `cls-mock-${Date.now()}`,
      name: classifyForm.name,
      domain: classifyForm.domain,
      dataType: classifyForm.dataType,
      category: classifyForm.category,
      level: classifyForm.level as ClassifiedAsset['level'],
      sensitive: classifyForm.sensitive,
      regulation: classifyForm.regulation,
      owner: classifyForm.owner,
      updateTime: new Date().toLocaleDateString('sv-SE'),
    })
    ElMessage.success(`数据资产「${classifyForm.name}」定级完成（Mock）`)
  }
  classifyDrawerVisible.value = false
}

const exportClassify = () => ElMessage.success('分级清单已导出为 Excel，含敏感字段与法规依据（Mock）')
const assetDetail = (row: ClassifiedAsset) => ElMessage.info(`「${row.name}」：${row.category}/${row.level}，依据 ${row.regulation}，敏感字段 ${row.sensitive.join('、') || '无'}（Mock）`)

/* ==================== 合规检查 ==================== */
const keyword = ref('')
const filterStatus = ref('')
const filterRisk = ref('')
const currentPage = ref(1)
const pageSize = 20
const riskVisible = ref(false)

const items = ref([...mockComplianceItems])

const levelColor: Record<string, string> = {
  高: '#E34D59',
  中: '#ED7B2F',
  低: '#2B6CB0',
}

const complianceStatusTag: Record<string, 'success' | 'danger' | 'warning'> = {
  合规: 'success',
  不合规: 'danger',
  待整改: 'warning',
}

const checkStats = computed(() => {
  const total = items.value.length
  const pass = items.value.filter((i) => i.status === '合规').length
  const fail = items.value.filter((i) => i.status === '不合规').length
  const pend = items.value.filter((i) => i.status === '待整改').length
  const high = items.value.filter((i) => i.riskLevel === '高').length
  const rate = total ? Math.round((pass / total) * 1000) / 10 : 0
  return [
    { label: '合规率', value: `${rate}%`, color: rate >= 90 ? '#00A854' : '#ED7B2F' },
    { label: '检查项', value: `${total} 项`, color: '#4A4A4A' },
    { label: '不合规', value: `${fail} 项`, color: '#DA251D' },
    { label: '待整改', value: `${pend} 项`, color: '#ED7B2F' },
    { label: '高风险', value: `${high} 项`, color: '#E34D59' },
  ]
})

const riskList = [
  { id: 'RISK-2026-01', title: '重要数据未配置密钥自动轮换', stage: '验证中', stageTag: 'primary' as const, activeStep: 3, updateTime: '2026-08-12 09:30', owner: '张工' },
  { id: 'RISK-2026-02', title: '个人信息导出流程缺少审批留痕', stage: '整改中', stageTag: 'warning' as const, activeStep: 2, updateTime: '2026-08-11 16:20', owner: '李工' },
  { id: 'RISK-2026-03', title: '数据出境场景未完成安全评估', stage: '工单中', stageTag: 'info' as const, activeStep: 1, updateTime: '2026-08-10 11:00', owner: '王工' },
]

const checkRecords = [
  { time: '2026-08-12 10:00', result: '通过', scope: '全部业务模块自动巡检', executor: '系统自动巡检', summary: '52 项检查 / 48 项合规' },
  { time: '2026-07-12 10:00', result: '通过', scope: '全部业务模块自动巡检', executor: '系统自动巡检', summary: '52 项检查 / 47 项合规' },
  { time: '2026-06-30 15:20', result: '警告', scope: '出口结算专项人工核查', executor: '安全管理员：张工', summary: '发现数据出境未评估风险' },
]

const currentRisk = ref<ComplianceItem | null>(null)

const filteredItems = computed(() =>
  items.value.filter((item) => {
    if (filterStatus.value && item.status !== filterStatus.value) return false
    if (filterRisk.value && item.riskLevel !== filterRisk.value) return false
    if (!keyword.value) return true
    const kw = keyword.value.toLowerCase()
    return (
      item.regulation.toLowerCase().includes(kw) ||
      item.clause.toLowerCase().includes(kw) ||
      item.mappedFeature.toLowerCase().includes(kw)
    )
  }),
)

const pagedItems = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredItems.value.slice(start, start + pageSize)
})

const changePage = (page: number) => (currentPage.value = page)

watch([keyword, filterStatus, filterRisk], () => {
  currentPage.value = 1
})

const autoCheck = () => {
  ElMessage.success('自动检查完成：52 项检查中 48 项合规（Mock）')
}

const jumpToReport = () => {
  ElMessage.success('检查数据已汇总，请在「合规报告」页签生成报告')
  activeTab.value = 'report'
}

const openRisk = (row: ComplianceItem) => {
  currentRisk.value = row
  riskVisible.value = true
}

const closeRisk = () => {
  riskVisible.value = false
  ElMessage.success('风险已通过复验，流程关闭（Mock）')
}

const exportRiskEvidence = () => {
  ElMessage.success('审计证据包已导出归档（Mock）')
}

const viewEvidence = (row: ComplianceItem) => {
  ElMessage.info(`查看「${row.regulation} ${row.clause}」检查证据（Mock）`)
}

/* ==================== 合规报告 ==================== */
type ComplianceReport = {
  id: string
  name: string
  type: '年度' | '季度' | '专项'
  period: string
  regulationCount: number
  checkCount: number
  passRate: number
  conclusion: '合规' | '基本合规' | '存在风险'
  createTime: string
  creator: string
}

const reports = ref<ComplianceReport[]>([
  { id: 'REP-2026Q2', name: '2026 年第二季度数据安全合规检查报告', type: '季度', period: '2026-04-01 ~ 2026-06-30', regulationCount: 4, checkCount: 52, passRate: 92.3, conclusion: '基本合规', createTime: '2026-07-05', creator: '系统生成' },
  { id: 'REP-2025YR', name: '2025 年度数据安全合规评估报告', type: '年度', period: '2025-01-01 ~ 2025-12-31', regulationCount: 5, checkCount: 52, passRate: 94.2, conclusion: '合规', createTime: '2026-01-15', creator: '系统生成' },
  { id: 'REP-2026P1', name: '数据出境安全评估专项报告', type: '专项', period: '2026-05-01 ~ 2026-05-31', regulationCount: 2, checkCount: 8, passRate: 75.0, conclusion: '存在风险', createTime: '2026-06-02', creator: '张工' },
  { id: 'REP-2026P2', name: '个人信息保护专项自查报告', type: '专项', period: '2026-06-01 ~ 2026-06-30', regulationCount: 3, checkCount: 24, passRate: 87.5, conclusion: '基本合规', createTime: '2026-07-10', creator: '李工' },
  { id: 'REP-2026Q1', name: '2026 年第一季度数据安全合规检查报告', type: '季度', period: '2026-01-01 ~ 2026-03-31', regulationCount: 4, checkCount: 52, passRate: 94.2, conclusion: '合规', createTime: '2026-04-08', creator: '系统生成' },
])

const reportKeyword = ref('')
const reportTypeFilter = ref('')
const reportConclusionFilter = ref('')

const reportTypeTag: Record<string, 'success' | 'warning' | 'danger' | 'primary'> = {
  年度: 'success',
  季度: 'primary',
  专项: 'warning',
}
const reportConclusionTag: Record<string, 'success' | 'warning' | 'danger'> = {
  合规: 'success',
  基本合规: 'warning',
  存在风险: 'danger',
}

const filteredReports = computed(() =>
  reports.value.filter((r) => {
    if (reportTypeFilter.value && r.type !== reportTypeFilter.value) return false
    if (reportConclusionFilter.value && r.conclusion !== reportConclusionFilter.value) return false
    if (!reportKeyword.value) return true
    const kw = reportKeyword.value.toLowerCase()
    return r.name.toLowerCase().includes(kw) || r.id.toLowerCase().includes(kw)
  }),
)

const avgPassRate = computed(() => reports.value.length ? Math.round((reports.value.reduce((s, r) => s + r.passRate, 0) / reports.value.length) * 10) / 10 : 0)

const reportStats = computed(() => [
  { label: '报告总数', value: `${reports.value.length} 份`, color: '#4A4A4A' },
  { label: '平均合规率', value: `${avgPassRate.value}%`, color: avgPassRate.value >= 90 ? '#00A854' : '#ED7B2F' },
  { label: '年度报告', value: reports.value.filter((r) => r.type === '年度').length, color: '#2B6CB0' },
  { label: '季度报告', value: reports.value.filter((r) => r.type === '季度').length, color: '#00A854' },
  { label: '专项报告', value: reports.value.filter((r) => r.type === '专项').length, color: '#ED7B2F' },
])

const reportDrawerVisible = ref(false)
const reportForm = reactive({
  name: '',
  type: '季度',
  period: [] as string[],
  regulations: [] as string[],
  owner: '系统生成',
  remark: '',
})

const openReportDrawer = () => {
  Object.assign(reportForm, { name: '', type: '季度', period: [], regulations: [regulationPool[0], regulationPool[1]] as string[], owner: '系统生成', remark: '' })
  reportDrawerVisible.value = true
}

const saveReport = () => {
  if (!reportForm.name.trim()) {
    ElMessage.warning('请输入报告名称')
    return
  }
  if (!reportForm.period.length) {
    ElMessage.warning('请选择统计周期')
    return
  }
  const pass = 85 + Math.round(Math.random() * 12)
  reports.value.unshift({
    id: `REP-${Date.now().toString().slice(-8)}`,
    name: reportForm.name,
    type: reportForm.type as ComplianceReport['type'],
    period: `${reportForm.period[0]} ~ ${reportForm.period[1]}`,
    regulationCount: reportForm.regulations.length || regulationPool.length,
    checkCount: 52,
    passRate: pass,
    conclusion: pass >= 90 ? '合规' : pass >= 80 ? '基本合规' : '存在风险',
    createTime: new Date().toLocaleDateString('sv-SE'),
    creator: reportForm.owner,
  })
  reportDrawerVisible.value = false
  ElMessage.success('合规报告已生成（Mock）')
}

const reportDetail = (row: ComplianceReport) => ElMessage.info(`报告「${row.name}」：覆盖 ${row.regulationCount} 部法规、${row.checkCount} 项检查，合规率 ${row.passRate}%（Mock）`)
const downloadReport = (row: ComplianceReport) => ElMessage.success(`「${row.name}」已导出为 PDF（Mock）`)
const regenerateReport = (row: ComplianceReport) => ElMessage.success(`「${row.name}」已基于最新检查结果重新生成（Mock）`)
</script>

<style lang="scss" scoped>
.compliance-page {
  height: 100%;
}

.compliance-tabs-wrap {
  height: 100%;
  min-height: 560px;
  display: flex;
  flex-direction: column;

  :deep(.el-tabs--border-card) {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    border-radius: 8px;
  }

  :deep(.el-tabs__header) {
    margin-bottom: 0;
  }

  :deep(.el-tabs__content) {
    flex: 1;
    min-height: 0;
    overflow: hidden;
  }

  :deep(.el-tab-pane) {
    height: 100%;
    overflow: hidden;
  }
}

.classify-pane,
.check-pane,
.report-pane {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.compliance-stats {
  display: flex;
  gap: 12px;
  flex: none;
}

.compliance-stat {
  flex: 1;
  border: 1px solid #edf0f5;
  border-radius: 8px;
  padding: 12px 14px;
  text-align: center;
  background: #fafafa;
}

.compliance-stat-value {
  font-size: 20px;
  font-weight: 700;
  line-height: 1.2;
}

.compliance-stat-label {
  margin-top: 4px;
  font-size: 12px;
  color: #8c8c8c;
}

.compliance-rows {
  flex: 1;
  min-height: 0;
  margin: 0 !important;

  :deep(.el-col) {
    height: 100%;
  }
}

.compliance-card {
  height: 100%;
  display: flex;
  flex-direction: column;

  :deep(.el-card__body) {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    padding: 12px 16px;
  }

  :deep(.el-table) {
    flex: 1;
    min-height: 0;
  }
}

.toolbar-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: none;
  margin-bottom: 10px;
}

.search-input {
  width: 220px;
}

.filter-select {
  width: 130px;
}

.block-title {
  font-size: 13px;
  font-weight: 700;
  color: #4a4a4a;
  margin: 12px 0 8px;
}

/* ========== 数据分类分级 ========== */
.grade-matrix {
  display: grid;
  grid-template-columns: 1.2fr repeat(3, 1fr);
  border: 1px solid #e5e9f0;
  border-radius: 8px;
  overflow: hidden;

  .gm-head,
  .gm-object,
  .gm-cell {
    padding: 8px 6px;
    text-align: center;
    font-size: 12px;
  }

  .gm-head {
    background: #f7f8fa;
    color: #8c8c8c;
    font-weight: 600;
    border-bottom: 1px solid #e5e9f0;

    &:not(:last-child) {
      border-right: 1px solid #e5e9f0;
    }
  }

  .gm-row {
    display: contents;

    .gm-object {
      text-align: left;
      padding-left: 12px;
      border-bottom: 1px solid #f0f2f6;
    }

    .gm-cell {
      border-left: 1px solid #f0f2f6;
      border-bottom: 1px solid #f0f2f6;

      &:last-child {
        border-right: none;
      }
    }
  }
}

.level-L1 {
  background: #f0f2f6;
  color: #8c8c8c;
  font-weight: 700;
}
.level-L2 {
  background: #e7f1fb;
  color: #2b6cb0;
  font-weight: 700;
}
.level-L3 {
  background: #fdf0e2;
  color: #ed7b2f;
  font-weight: 700;
}
.level-L4 {
  background: #fdecec;
  color: #da251d;
  font-weight: 700;
}

.grade-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 3px 0;
  font-size: 12px;
  color: #4a4a4a;
}

.grade-name {
  font-weight: 600;
  flex: none;
}

.category-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.mr-4 {
  margin-right: 4px;
}

.asset-name {
  font-weight: 600;
  color: #333;
}

/* ========== 合规检查 ========== */
.risk-item {
  padding: 10px 0;
  border-bottom: 1px solid #f0f2f6;

  &:last-child {
    border-bottom: none;
  }
}

.risk-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

.risk-id {
  font-size: 12px;
  font-weight: 700;
  color: #4a4a4a;
}

.risk-desc {
  font-size: 12px;
  color: #333;
  line-height: 1.5;
  margin-bottom: 8px;
}

.risk-steps {
  margin: 4px 0 6px;
}

.record-item {
  padding: 10px 0;
  border-bottom: 1px solid #f0f2f6;
  font-size: 12px;

  &:last-child {
    border-bottom: none;
  }
}

.record-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}

.record-time {
  font-weight: 700;
  color: #333;
}

.record-scope {
  color: #4a4a4a;
  margin-bottom: 2px;
}

.security-level {
  display: inline-block;
  min-width: 36px;
  text-align: center;
  color: #fff;
  font-size: 12px;
  border-radius: 3px;
  padding: 1px 6px;
}

.mt-16 {
  margin-top: 16px;
}

/* ========== 合规报告 ========== */
.dep-text {
  font-size: 12px;
  color: #8c8c8c;
}

.pager {
  flex: none;
  display: flex;
  justify-content: flex-end;
}

/* ========== 弹框 ========== */
.compliance-dialog {
  .rule-section-title {
    font-size: 13px;
    font-weight: 700;
    color: #4a4a4a;
    border-left: 3px solid #da251d;
    padding-left: 8px;
    margin: 0 0 12px;

    &:not(:first-child) {
      margin-top: 14px;
    }
  }
}
</style>