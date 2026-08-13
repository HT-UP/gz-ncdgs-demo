<template>
  <div class="standard-page lineage-page">
    <div class="lineage-tabs-wrap">
      <el-tabs v-model="activeTab" type="border-card" stretch>
        <el-tab-pane label="血缘可视化" name="visual">
          <div class="lineage-visual-pane">
            <div class="lineage-toolbar">
              <el-input
                v-model="searchTable"
                placeholder="搜索表名 / 字段名"
                clearable
                size="small"
                class="search-input-sm"
                @keyup.enter="highlightTable"
              />
              <el-button type="danger" size="small" @click="highlightTable">定位</el-button>
            </div>
            <div ref="lineageChartRef" class="lineage-chart"></div>
            <div class="sankey-legend">
              <span v-for="item in legendItems" :key="item.label" class="sankey-legend-item">
                <i class="sankey-legend-dot" :style="{ background: item.color }"></i>{{ item.label }}
              </span>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="血缘明细" name="detail">
          <div class="lineage-detail-pane">
            <div class="lineage-toolbar">
              <el-select v-model="detailFilter" size="small" class="filter-select-sm">
                <el-option label="全部目标表" value="" />
                <el-option v-for="t in targetTables" :key="t" :label="t" :value="t" />
              </el-select>
              <span class="dep-text">共 {{ filteredDetails.length }} 条字段级血缘记录</span>
            </div>
            <el-table :data="filteredDetails" size="small" stripe height="100%">
              <el-table-column label="源字段" min-width="170">
                <template #default="{ row }">
                  <span class="field-source">{{ row.source }}</span>
                </template>
              </el-table-column>
              <el-table-column label="处理函数" width="140">
                <template #default="{ row }">
                  <el-tag size="small" type="warning" effect="plain">{{ row.func }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="目标字段" min-width="170">
                <template #default="{ row }">
                  <span class="field-target">{{ row.target }}</span>
                </template>
              </el-table-column>
              <el-table-column label="数据量" width="100" align="right">
                <template #default="{ row }">{{ row.flowText }}</template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>

        <el-tab-pane label="异常血缘追踪" name="anomaly">
          <div class="lineage-anomaly-pane">
            <el-alert title="系统自动巡检血缘链路，标记断裂、循环、孤立、口径冲突与函数告警，供人工复核处理（Mock）" type="warning" :closable="false" show-icon class="mb-12" />
            <div class="anomaly-list">
              <div v-for="item in anomalies" :key="item.text" class="anomaly-item">
                <el-tag effect="dark" :type="item.level" size="small">{{ item.type }}</el-tag>
                <span class="anomaly-text">{{ item.text }}</span>
              </div>
            </div>
            <div class="anomaly-stats">
              <div v-for="stat in anomalyStats" :key="stat.label" class="anomaly-stat">
                <div class="anomaly-stat-value" :style="{ color: stat.color }">{{ stat.value }}</div>
                <div class="anomaly-stat-label">{{ stat.label }}</div>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="血缘填报列表" name="report">
          <div class="report-pane">
            <div class="report-pane-toolbar">
              <el-button type="danger" size="small" :icon="Connection" @click="openLineageDialog">新建血缘填报</el-button>
              <el-input
                v-model="batchKeyword"
                placeholder="按填报单号 / 填报人 / 说明搜索"
                clearable
                size="small"
                class="search-input-sm"
                :prefix-icon="Search"
              />
              <el-select v-model="batchStatusFilter" placeholder="状态" clearable size="small" class="filter-select-sm">
                <el-option v-for="s in batchStatusList" :key="s" :label="s" :value="s" />
              </el-select>
              <span class="dep-text">共 {{ filteredBatches.length }} 个填报批次 · 已生效 {{ passedBatches }} 个</span>
            </div>

            <el-table :data="filteredBatches" size="small" stripe class="batch-table">
              <el-table-column type="expand">
                <template #default="{ row }">
                  <div class="batch-detail">
                    <div v-if="row.title" class="batch-detail-title">填报说明：{{ row.title }}</div>
                    <el-table :data="row.links" size="mini" border>
                      <el-table-column label="上游（表 · 字段）" min-width="190">
                        <template #default="{ row: l }">
                          <span class="field-source">{{ l.upTable }}.{{ l.upField }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column label="处理函数" width="130">
                        <template #default="{ row: l }">
                          <el-tag size="small" type="warning" effect="plain">{{ l.func }}</el-tag>
                        </template>
                      </el-table-column>
                      <el-table-column label="下游（表 · 字段）" min-width="190">
                        <template #default="{ row: l }">
                          <span class="field-target">{{ l.downTable }}.{{ l.downField }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column label="校验" min-width="230">
                        <template #default="{ row: l }">
                          <template v-if="l.issues && l.issues.length">
                            <el-tag v-for="(it, i) in l.issues" :key="i" size="mini" :type="it.level === 'error' ? 'danger' : 'warning'" effect="plain" class="mr-4">{{ it.text }}</el-tag>
                          </template>
                          <el-tag v-else size="mini" type="success" effect="plain">通过</el-tag>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="id" label="填报单号" width="130" />
              <el-table-column prop="creator" label="填报人" width="76" />
              <el-table-column prop="createTime" label="填报时间" width="128" />
              <el-table-column label="连线数" width="72" align="center">
                <template #default="{ row }">
                  <span class="dep-text">{{ row.links.length }} 条</span>
                </template>
              </el-table-column>
              <el-table-column label="校验结果" width="106">
                <template #default="{ row }">
                  <el-tag v-if="row.errorCount === 0" type="success" effect="dark" size="small">校验通过</el-tag>
                  <el-tag v-else type="danger" effect="dark" size="small">{{ row.errorCount }} 项异常</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="状态" width="86">
                <template #default="{ row }">
                  <el-tag :type="batchStatusTag[row.status]" effect="dark" size="small">{{ row.status }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="审批人 / 审批时间" min-width="150">
                <template #default="{ row }">
                  <span class="dep-text">{{ row.approver ? `${row.approver} · ${row.approveTime}` : '—' }}</span>
                </template>
              </el-table-column>
              <el-table-column label="图谱版本" width="84" align="center">
                <template #default="{ row }">
                  <span class="dep-text">{{ row.versionNo || '—' }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="210" fixed="right" align="center">
                <template #default="{ row }">
                  <el-button v-if="row.status === '草稿'" link type="primary" size="small" @click="editBatch(row)">编辑</el-button>
                  <el-button v-if="row.status === '草稿'" link type="warning" size="small" @click="submitBatch(row)">提交审批</el-button>
                  <el-button v-if="row.status === '待审批'" link type="warning" size="small" @click="openApproveDialog(row)">审批</el-button>
                  <el-button v-if="['已通过', '已回滚'].includes(row.status)" link type="primary" size="small" @click="openVersionCompare(row)">版本对比</el-button>
                  <el-button v-if="row.status === '已通过'" link type="danger" size="small" @click="rollbackBatch(row)">回滚</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <el-dialog
      v-model="lineageDialogVisible"
      title="血缘填报 · 拖拽连线"
      fullscreen
      class="lineage-report-dialog"
      destroy-on-close
    >
      <el-alert class="report-hint" type="info" :closable="false" show-icon>
        <template #title>
          从左侧<span class="hint-strong">上游源表</span>的行或端口按住拖拽，连线到右侧<span class="hint-strong">下游目标表</span>的行，
          松手即建立一条血缘连线；请在下方为每条连线选择<span class="hint-strong">源字段 / 目标字段</span>并调整处理函数，
          系统将自动执行对象存在性、字段类型匹配、环路、重复与自引用校验，通过后可提交审批，审批通过后生效入图谱。
        </template>
      </el-alert>

      <div class="report-title-row">
        <span class="dep-text">填报说明</span>
        <el-input v-model="reportTitle" size="small" placeholder="本次填报的目的与说明（选填）" />
      </div>

      <div class="report-builder">
        <div id="report-canvas" ref="wrapRef" class="report-canvas-wrap">
          <svg class="report-svg">
            <path
              v-for="lnk in computedLinks"
              :key="lnk.id"
              :d="lnk.path"
              :class="{ 'is-active': activeLinkId === lnk.id || hoverLinkId === lnk.id }"
              @mouseenter="hoverLinkId = lnk.id"
              @mouseleave="hoverLinkId = null"
            />
            <path v-if="dragging" :d="tempPath" class="report-temp-path" />
          </svg>
          <div v-if="hoverTip" class="report-hover-tip" :style="{ left: hoverTip.x + 'px', top: hoverTip.y + 'px' }">
            {{ hoverTip.text }}
          </div>

          <aside class="report-side report-side-left" @scroll="linkRevision++">
            <div class="side-title">上游源表（数据库）</div>
            <div v-for="db in upDbs" :key="db.name" class="db-section">
              <div class="db-head">{{ db.name }}</div>
              <div
                v-for="t in db.tables"
                :key="t"
                class="table-row"
                :ref="setTableEl(`up:${db.name}:${t}`)"
                @pointerdown="startDrag($event, 'up', db.name, t)"
              >
                <span class="table-name">{{ t }}</span>
                <span class="port port-right" title="拖拽到右侧建立血缘" />
              </div>
            </div>
          </aside>

          <aside class="report-side report-side-right" @scroll="linkRevision++">
            <div class="side-title">下游目标表（数据库）</div>
            <div v-for="db in downDbs" :key="db.name" class="db-section">
              <div class="db-head">{{ db.name }}</div>
              <div
                v-for="t in db.tables"
                :key="t"
                class="table-row"
                :ref="setTableEl(`down:${db.name}:${t}`)"
                @pointerdown="startDrag($event, 'down', db.name, t)"
              >
                <span class="port port-left" title="拖拽到左侧建立血缘" />
                <span class="table-name">{{ t }}</span>
              </div>
            </div>
          </aside>
        </div>

        <div class="report-links">
          <el-table :data="reportLinks" size="small" height="176" highlight-current-row @row-click="onRowClick">
            <el-table-column label="上游（数据库 · 表）" min-width="170">
              <template #default="{ row }">
                <span class="field-source">{{ row.upDb }} · {{ row.upTable }}</span>
              </template>
            </el-table-column>
            <el-table-column label="源字段" width="120">
              <template #default="{ row }">
                <el-select v-model="row.upField" size="small" filterable allow-create default-first-option placeholder="选择 / 输入" @change="validateReportLinks">
                  <el-option v-for="f in fieldsOf(row.upTable)" :key="f" :label="f" :value="f" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="处理函数" width="140">
              <template #default="{ row }">
                <el-select v-model="row.func" size="small" filterable allow-create default-first-option>
                  <el-option v-for="f in funcOptions" :key="f" :label="f" :value="f" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="目标字段" width="120">
              <template #default="{ row }">
                <el-select v-model="row.downField" size="small" filterable allow-create default-first-option placeholder="选择 / 输入" @change="validateReportLinks">
                  <el-option v-for="f in fieldsOf(row.downTable)" :key="f" :label="f" :value="f" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="下游（数据库 · 表）" min-width="170">
              <template #default="{ row }">
                <span class="field-target">{{ row.downDb }} · {{ row.downTable }}</span>
              </template>
            </el-table-column>
            <el-table-column label="校验" width="150">
              <template #default="{ row }">
                <el-tooltip :disabled="!row.issues || !row.issues.length" placement="top">
                  <template #content>
                    <div v-for="(it, i) in row.issues" :key="i" class="issue-line" :class="it.level === 'error' ? 'issue-error' : 'issue-warn'">
                      {{ it.level === 'error' ? '✗' : '!' }} {{ it.text }}
                    </div>
                  </template>
                  <el-tag v-if="hasErrorIssue(row.issues)" type="danger" size="small" effect="dark">
                    {{ errorIssueCount(row.issues) }} 项异常
                  </el-tag>
                  <el-tag v-else-if="hasWarnIssue(row.issues)" type="warning" size="small" effect="plain">有提示</el-tag>
                  <el-tag v-else type="success" size="small" effect="plain">通过</el-tag>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="64" align="center">
              <template #default="{ row }">
                <el-button type="danger" link :icon="Delete" @click.stop="removeLink(row.id)" />
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

      <template #footer>
        <div class="report-footer">
          <span class="report-count">
            已填报 {{ reportLinks.length }} 条 · 校验
            <span :class="batchErrorCount > 0 ? 'issue-error' : 'trend-positive'">{{ batchErrorCount > 0 ? `${batchErrorCount} 项异常` : '全部通过' }}</span>
          </span>
          <el-button size="small" @click="resetBuilder">重置</el-button>
          <el-button size="small" @click="lineageDialogVisible = false">取消</el-button>
          <el-button size="small" type="primary" @click="saveBatch('草稿')">存草稿</el-button>
          <el-button type="danger" size="small" :disabled="batchErrorCount > 0" @click="saveBatch('待审批')">提交审批</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog v-model="approveVisible" title="血缘填报审批" width="680px" class="batch-approve-dialog" destroy-on-close>
      <template v-if="approveTarget">
        <el-descriptions :column="2" border size="small">
          <el-descriptions-item label="填报单号">{{ approveTarget.id }}</el-descriptions-item>
          <el-descriptions-item label="填报人">{{ approveTarget.creator }}</el-descriptions-item>
          <el-descriptions-item label="填报时间" :span="1">{{ approveTarget.createTime }}</el-descriptions-item>
          <el-descriptions-item label="连线数量">{{ approveTarget.links.length }} 条</el-descriptions-item>
          <el-descriptions-item label="校验结果" :span="2">
            <el-tag size="small" :type="approveTarget.errorCount === 0 ? 'success' : 'danger'" effect="dark">
              {{ approveTarget.errorCount === 0 ? '校验通过' : `${approveTarget.errorCount} 项异常` }}
            </el-tag>
          </el-descriptions-item>
        </el-descriptions>
        <div class="block-title">待审批血缘明细</div>
        <div class="approve-links">
          <div v-for="l in approveTarget.links" :key="l.id" class="approve-link-item">
            <span class="field-source">{{ l.upTable }}.{{ l.upField }}</span>
            <span class="dep-text">—[{{ l.func }}]→</span>
            <span class="field-target">{{ l.downTable }}.{{ l.downField }}</span>
          </div>
        </div>
        <el-form label-width="84px" class="approve-form">
          <el-form-item label="审批人">
            <el-select v-model="approveForm.approver" class="w-full">
              <el-option v-for="a in approverPool" :key="a" :label="a" :value="a" />
            </el-select>
          </el-form-item>
          <el-form-item label="审批意见">
            <el-input v-model="approveForm.comment" type="textarea" :rows="3" placeholder="请填写审批意见（必填）" />
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <el-button @click="approveVisible = false">取消</el-button>
        <el-button type="danger" @click="doApprove(false)">驳回</el-button>
        <el-button type="primary" @click="doApprove(true)">审批通过</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="compareVisible" title="填报版本对比" width="720px" class="version-compare-dialog" destroy-on-close>
      <div class="compare-bar">
        <span class="dep-text">基线版本</span>
        <el-select v-model="compareBase" size="small" class="filter-select-sm" filterable>
          <el-option v-for="v in compareOptions" :key="v.value" :label="v.label" :value="v.value" />
        </el-select>
        <span class="dep-text">对比版本</span>
        <el-select v-model="compareTarget" size="small" class="filter-select-sm" filterable>
          <el-option v-for="v in compareOptions" :key="v.value" :label="v.label" :value="v.value" />
        </el-select>
      </div>
      <div class="compare-summary">
        <span>新增 <b class="issue-error">{{ diffResult.added.length }}</b> 条</span>
        <span>移除 <b class="dep-text">{{ diffResult.removed.length }}</b> 条</span>
        <span>未变化 <b class="trend-positive">{{ diffResult.common }}</b> 条</span>
      </div>
      <el-table :data="diffRows" size="small" max-height="380" stripe>
        <el-table-column label="变更" width="70" align="center">
          <template #default="{ row }">
            <el-tag size="small" :type="row.change === '新增' ? 'danger' : row.change === '移除' ? 'info' : 'success'" effect="dark">{{ row.change }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="上游（表 · 字段）" min-width="210">
          <template #default="{ row }">
            <span class="field-source">{{ row.source }}</span>
          </template>
        </el-table-column>
        <el-table-column label="处理函数" width="140">
          <template #default="{ row }">
            <el-tag size="small" type="warning" effect="plain">{{ row.func }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="下游（表 · 字段）" min-width="210">
          <template #default="{ row }">
            <span class="field-target">{{ row.target }}</span>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <el-button type="primary" plain @click="compareVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import * as echarts from 'echarts'
import { Connection, Delete, Search } from '@element-plus/icons-vue'

type FieldLink = {
  source: string
  target: string
  func: string
  flow: number
}

type Layer = 'source' | 'mid' | 'target'

const fieldLineage: FieldLink[] = [
  { source: 'ticket_sale.order_id', target: 'dwd_order_detail.order_id', func: '直接映射', flow: 128640 },
  { source: 'ticket_sale.order_date', target: 'dwd_order_detail.order_date', func: 'TO_DATE(order_date)', flow: 128640 },
  { source: 'ticket_sale.amount', target: 'dwd_order_detail.amount', func: 'NVL(amount, 0)', flow: 128640 },
  { source: 'ticket_sale.ticket_type', target: 'dwd_order_detail.ticket_type', func: 'TRIM(ticket_type)', flow: 128640 },
  { source: 'ticket_sale.line_code', target: 'dwd_order_detail.line_code', func: '直接映射', flow: 128640 },
  { source: 'passenger_info.passenger_id', target: 'dim_passenger.passenger_id', func: '直接映射', flow: 8620 },
  { source: 'passenger_info.passenger_name', target: 'dim_passenger.passenger_name', func: 'CONCAT(first_name, last_name)', flow: 8620 },
  { source: 'passenger_info.age', target: 'dim_passenger.age_group', func: 'CASE WHEN 年龄分箱', flow: 8620 },
  { source: 'station_info.station_code', target: 'dim_station.station_code', func: '直接映射', flow: 128 },
  { source: 'station_info.station_name', target: 'dim_station.station_name', func: '直接映射', flow: 128 },
  { source: 'line_info.line_code', target: 'dim_line.line_code', func: '直接映射', flow: 8 },
  { source: 'line_info.line_name', target: 'dim_line.line_name', func: '直接映射', flow: 8 },
  { source: 'dwd_order_detail.order_id', target: 'dws_order_report.order_id', func: '直接映射', flow: 128640 },
  { source: 'dwd_order_detail.amount', target: 'dws_order_report.total_amount', func: 'SUM(amount)', flow: 128640 },
  { source: 'dwd_order_detail.order_id', target: 'dws_order_report.order_count', func: 'COUNT(DISTINCT order_id)', flow: 128640 },
  { source: 'dim_line.line_code', target: 'dws_order_report.line_code', func: 'JOIN 映射', flow: 8 },
  { source: 'dim_line.line_name', target: 'dws_order_report.line_name', func: 'JOIN 映射', flow: 8 },
  { source: 'dim_passenger.passenger_id', target: 'ads_line_flow.total_passengers', func: 'COUNT(passenger_id)', flow: 8620 },
  { source: 'dim_passenger.age_group', target: 'ads_line_flow.avg_age', func: 'AVG(age)', flow: 8620 },
  { source: 'dim_line.line_code', target: 'ads_line_flow.line_code', func: 'JOIN 映射', flow: 8 },
  { source: 'dim_line.line_name', target: 'ads_line_flow.line_name', func: 'JOIN 映射', flow: 8 },
  { source: 'dim_station.station_code', target: 'ads_line_flow.station_code', func: 'JOIN 映射', flow: 128 },
  { source: 'dim_station.station_name', target: 'ads_line_flow.station_name', func: 'JOIN 映射', flow: 128 },
]

const tableMeta: Record<string, { label: string; layer: Layer }> = {
  ticket_sale: { label: '售票明细表', layer: 'source' },
  passenger_info: { label: '乘客信息表', layer: 'source' },
  station_info: { label: '车站信息表', layer: 'source' },
  line_info: { label: '线路信息表', layer: 'source' },
  dwd_order_detail: { label: '订单明细层', layer: 'mid' },
  dim_passenger: { label: '乘客维度表', layer: 'mid' },
  dim_station: { label: '车站维度表', layer: 'mid' },
  dim_line: { label: '线路维度表', layer: 'mid' },
  dws_order_report: { label: '订单汇总报表', layer: 'target' },
  ads_line_flow: { label: '线路客流报表', layer: 'target' },
}

const tableFields: Record<string, string[]> = {
  ticket_sale: ['order_id', 'order_date', 'line_code', 'amount', 'ticket_type', 'status', 'create_time'],
  passenger_info: ['passenger_id', 'passenger_name', 'age', 'phone', 'create_time'],
  station_info: ['station_code', 'station_name', 'station_type', 'status'],
  line_info: ['line_code', 'line_name', 'status'],
  dwd_order_detail: ['order_id', 'order_date', 'line_code', 'amount', 'ticket_type', 'create_time'],
  dim_passenger: ['passenger_id', 'passenger_name', 'age_group', 'create_time'],
  dim_station: ['station_code', 'station_name'],
  dim_line: ['line_code', 'line_name'],
  dws_order_report: ['order_id', 'order_date', 'line_code', 'line_name', 'total_amount', 'order_count', 'ticket_type', 'create_time'],
  ads_line_flow: ['line_code', 'line_name', 'station_code', 'station_name', 'total_passengers', 'avg_age', 'flow_date', 'update_time'],
}

const pkFields = new Set([
  'ticket_sale.order_id',
  'passenger_info.passenger_id',
  'station_info.station_code',
  'line_info.line_code',
  'dwd_order_detail.order_id',
  'dim_passenger.passenger_id',
  'dim_station.station_code',
  'dim_line.line_code',
  'dws_order_report.order_id',
])

const layerTables: Record<Layer, string[]> = {
  source: ['ticket_sale', 'passenger_info', 'station_info', 'line_info'],
  mid: ['dwd_order_detail', 'dim_passenger', 'dim_station', 'dim_line'],
  target: ['dws_order_report', 'ads_line_flow'],
}

const layerColor: Record<Layer, string> = {
  source: '#2B6CB0',
  mid: '#00A854',
  target: '#DA251D',
}

const layerName: Record<Layer, string> = {
  source: '源系统表',
  mid: '中间层表',
  target: '汇总报表层',
}

const legendItems = [
  { label: '源系统表', color: '#2B6CB0' },
  { label: '中间层表（ODS/DWD/DIM）', color: '#00A854' },
  { label: '汇总报表层', color: '#DA251D' },
]

const anomalies = [
  { type: '断裂', level: 'danger', text: 'station_info.station_type 无下游字段，缺少类型转换规则（Mock）' },
  { type: '循环', level: 'warning', text: 'dim_order.order_id ↔ dws_order_report 疑似循环引用，已自动阻断（Mock）' },
  { type: '孤立', level: 'danger', text: 'temp_ticket_sale.temp_field 无上游且无下游，未纳入解析（Mock）' },
  { type: '冲突', level: 'warning', text: 'dws_order_report.total_amount 存在多口径上游，请确认统计口径（Mock）' },
  { type: '告警', level: 'info', text: 'ticket_sale.amount 使用 NVL 隐式转换，建议显式 CAST（Mock）' },
]

const anomalyStats = [
  { label: '断裂', value: 1, color: '#DA251D' },
  { label: '循环', value: 1, color: '#ED7B2F' },
  { label: '孤立', value: 1, color: '#DA251D' },
  { label: '冲突', value: 1, color: '#ED7B2F' },
  { label: '告警', value: 1, color: '#2B6CB0' },
]

const formatFlow = (value: number) => (value >= 10000 ? `${(value / 10000).toFixed(1)} 万` : `${value}`)

const lineageChartRef = ref<HTMLElement>()
const searchTable = ref('')
const detailFilter = ref('')
const activeTab = ref('visual')
let lineageChart: echarts.ECharts | null = null

const targetTables = computed(() => [...new Set(fieldLineage.map((link) => link.target.split('.')[0]))])

const filteredDetails = computed(() =>
  detailFilter.value
    ? fieldLineage.map((link) => ({ ...link, flowText: formatFlow(link.flow) })).filter((link) => link.target.startsWith(`${detailFilter.value}.`))
    : fieldLineage.map((link) => ({ ...link, flowText: formatFlow(link.flow) })),
)

const cardWidthOf = (table: string) => {
  const maxLen = Math.max(...tableFields[table].map((f) => f.length + (pkFields.has(`${table}.${f}`) ? 4 : 0)))
  return Math.max(160, Math.min(260, maxLen * 7.5 + 34))
}

const cardHeightOf = (table: string) => tableFields[table].length * 20 + 48

const renderLineage = (highlight?: string) => {
  if (!lineageChartRef.value) return
  lineageChart?.dispose()
  lineageChart = echarts.init(lineageChartRef.value)

  // 横向分层布局：源系统表 → 中间层 → 汇总报表
  const colMaxWidth: Record<Layer, number> = { source: 0, mid: 0, target: 0 }
  ;(Object.keys(layerTables) as Layer[]).forEach((layer) => {
    colMaxWidth[layer] = Math.max(...layerTables[layer].map(cardWidthOf))
  })
  const xs: Record<Layer, number> = { source: 20, mid: 0, target: 0 }
  const layerOrder: Layer[] = ['source', 'mid', 'target']
  layerOrder.forEach((layer, i) => {
    if (i > 0) xs[layer] = xs[layerOrder[i - 1]] + colMaxWidth[layerOrder[i - 1]] + 200
  })

  const ys: Record<string, number> = {}
  layerOrder.forEach((layer) => {
    let y = 20
    layerTables[layer].forEach((table) => {
      ys[table] = y
      y += cardHeightOf(table) + 46
    })
  })

  const nodes = layerOrder.flatMap((layer) =>
    layerTables[layer].map((table) => {
      const meta = tableMeta[table]
      const color = layerColor[meta.layer]
      const width = cardWidthOf(table)
      const matched = !!highlight && (table.includes(highlight) || tableFields[table].some((f) => f.includes(highlight)))
      return {
        name: table,
        x: xs[layer],
        y: ys[table],
        symbol: 'rect',
        symbolSize: [width, cardHeightOf(table)],
        tipHtml: `<b>${table}</b><br/>${meta.label}｜${layerName[meta.layer]}<br/>字段数：${tableFields[table].length}`,
        itemStyle: matched
          ? { color: '#fff', borderColor: '#DA251D', borderWidth: 2.5, borderRadius: 6, shadowBlur: 12, shadowColor: 'rgba(218,37,29,0.4)' }
          : { color: '#fff', borderColor: '#D3D8E0', borderWidth: 1.5, borderRadius: 6 },
        label: {
          show: true,
          position: 'inside',
          formatter: () =>
            `{title|${table}}\n{fields|${tableFields[table]
              .map((f) => (pkFields.has(`${table}.${f}`) ? `PK · ${f}` : f))
              .join('\n')}}`,
          rich: {
            title: {
              width: width - 8,
              height: 30,
              backgroundColor: color,
              color: '#fff',
              fontSize: 13,
              fontWeight: 700,
              lineHeight: 30,
              padding: [0, 10, 0, 10],
              align: 'left',
              verticalAlign: 'middle',
              borderRadius: [6, 6, 0, 0],
            },
            fields: {
              width: width - 8,
              color: '#4A4A4A',
              backgroundColor: '#FFFFFF',
              fontSize: 12,
              lineHeight: 20,
              padding: [6, 10, 12, 10],
              align: 'left',
              verticalAlign: 'top',
              borderRadius: [0, 0, 6, 6],
            },
          },
        },
      }
    }),
  )

  // 表级连线分组：同一对表的多条字段映射渲染为自边缘扇出的平行浅灰弧线
  const groupMap = new Map<string, FieldLink[]>()
  fieldLineage.forEach((link) => {
    const fromTable = link.source.split('.')[0]
    const toTable = link.target.split('.')[0]
    const key = `${fromTable}>${toTable}`
    if (!groupMap.has(key)) groupMap.set(key, [])
    groupMap.get(key)!.push(link)
  })

  const links: any[] = []
  // 图表底部边界，用于判断每条连线所处的垂直位置
  const bottomMax = Math.max(...layerOrder.flatMap((layer) => layerTables[layer].map((table) => ys[table] + cardHeightOf(table))))
  groupMap.forEach((mappers, key) => {
    const [fromTable, toTable] = key.split('>')
    const fromCenterY = ys[fromTable] + cardHeightOf(fromTable) / 2
    const toCenterY = ys[toTable] + cardHeightOf(toTable) / 2
    const midY = (fromCenterY + toCenterY) / 2
    // 0~1 垂直位置：0 顶部，1 底部
    const t = bottomMax > 0 ? midY / bottomMax : 0.5
    // 正曲率向上弯、负曲率向下弯：上方连线向上弯，下方连线向下弯，中部渐近平缓
    const direction = 0.5 - t
    mappers.forEach((_m, i) => {
      // 同组多条线沿相同弯曲方向微幅扇开
      const spread = i * 0.03 * (direction >= 0 ? 1 : -1)
      const curveness = direction * 0.7 + spread
      const matched =
        !!highlight &&
        (fromTable.includes(highlight) ||
          toTable.includes(highlight) ||
          mappers.some((x) => x.source.includes(highlight) || x.target.includes(highlight)))
      links.push({
        source: fromTable,
        target: toTable,
        curveness,
        mappings: mappers,
        matched,
        lineStyle: matched
          ? { color: '#DA251D', width: 2.5, curveness, opacity: 1 }
          : { color: '#C7CDD8', width: 0.9, curveness, opacity: 0.9 },
      })
    })
  })

  lineageChart.setOption({
    tooltip: {
      trigger: 'item',
      formatter: (params: { dataType: string; data: { mappings?: FieldLink[]; tipHtml?: string; source?: string; target?: string } }) => {
        if (params.dataType === 'edge') {
          const d = params.data
          const rows = (d.mappings ?? [])
            .map(
              (m) =>
                `<span style="color:#2B6CB0">${m.source}</span> —[${m.func}]→ <span style="color:#DA251D">${m.target}</span>`,
            )
            .join('<br/>')
          return `<b>${d.source} → ${d.target}</b><br/><br/>${rows}`
        }
        return params.data?.tipHtml ?? params.data?.source ?? ''
      },
    },
    series: [
      {
        type: 'graph',
        layout: 'none',
        roam: true,
        draggable: true,
        data: nodes,
        links,
        lineStyle: { color: '#C7CDD8', width: 0.9, curveness: 0.3, opacity: 0.9 },
        emphasis: { focus: 'adjacency', lineStyle: { width: 2.5, color: '#DA251D', opacity: 1 } },
      },
    ],
  })
}

const highlightTable = () => {
  const keyword = searchTable.value.trim()
  if (!keyword) {
    ElMessage.warning('请输入要定位的表名或字段名')
    return
  }
  renderLineage(keyword)
  ElMessage.success(`已定位到「${keyword}」及其血缘链路`)
}

const lineageDialogVisible = ref(false)

type DbNode = { name: string; tables: string[] }

const upDbs: DbNode[] = [
  { name: '票务运营库', tables: ['ticket_sale', 'passenger_info', 'payment_record'] },
  { name: '基础信息库', tables: ['station_info', 'line_info', 'train_info'] },
  { name: '设备监控库', tables: ['device_status_log', 'train_operation_log'] },
  { name: '数据仓库ODS', tables: ['ods_order_detail', 'ods_passenger', 'ods_station'] },
]

const downDbs: DbNode[] = [
  { name: '数据仓库DWD', tables: ['dwd_order_detail', 'dwd_payment', 'dwd_ticket'] },
  { name: '数据仓库DIM', tables: ['dim_passenger', 'dim_station', 'dim_line'] },
  { name: '数据仓库DWS', tables: ['dws_order_report', 'dws_line_flow'] },
  { name: '指标中台ADS', tables: ['ads_line_flow', 'ads_operation_kpi'] },
]

const funcOptions = ['直接映射', 'TO_DATE()', 'NVL()', 'TRIM()', 'CONCAT()', 'CASE WHEN', 'SUM()', 'COUNT()', 'AVG()', 'JOIN 映射']

type ReportLink = {
  id: number
  upDb: string
  upTable: string
  downDb: string
  downTable: string
  func: string
  upField: string
  downField: string
  issues?: { level: 'error' | 'warn'; text: string }[]
}

type Point = { x: number; y: number }

const reportLinks = ref<ReportLink[]>([])
const activeLinkId = ref<number | null>(null)
const hoverLinkId = ref<number | null>(null)
const linkRevision = ref(0)
let reportLinkSeq = 0

const wrapRef = ref<HTMLElement>()
const tableEls = new Map<string, HTMLElement>()

const setTableEl =
  (key: string) =>
  (el: unknown) => {
    if (el instanceof HTMLElement) tableEls.set(key, el)
  }

const wrapRect = () => wrapRef.value?.getBoundingClientRect()

const sidePoint = (el: HTMLElement, side: 'left' | 'right'): Point => {
  const wr = wrapRect()
  if (!wr) return { x: 0, y: 0 }
  const r = el.getBoundingClientRect()
  return { x: r.left - wr.left + (side === 'right' ? r.width : 0), y: r.top - wr.top + r.height / 2 }
}

type ReportLinkView = ReportLink & { path: string; mid?: Point }

const computedLinks = computed<ReportLinkView[]>(() => {
  void linkRevision.value
  const wr = wrapRect()
  if (!wr) return []
  return reportLinks.value.map((lnk) => {
    const sp = tableEls.get(`up:${lnk.upDb}:${lnk.upTable}`)
    const dp = tableEls.get(`down:${lnk.downDb}:${lnk.downTable}`)
    if (!sp || !dp) return { ...lnk, path: '' }
    const s = sidePoint(sp, 'right')
    const d = sidePoint(dp, 'left')
    const dx = Math.max(60, (d.x - s.x) / 2)
    return {
      ...lnk,
      path: `M ${s.x} ${s.y} C ${s.x + dx} ${s.y}, ${d.x - dx} ${d.y}, ${d.x} ${d.y}`,
      mid: { x: (s.x + d.x) / 2, y: (s.y + d.y) / 2 },
    }
  })
})

const hoverTip = computed(() => {
  const lnk = computedLinks.value.find((l) => l.id === hoverLinkId.value)
  if (!lnk || !lnk.mid) return null
  return { x: lnk.mid.x, y: lnk.mid.y, text: `${lnk.upTable} —[${lnk.func}]→ ${lnk.downTable}` }
})

const dragging = ref<{ side: 'up' | 'down'; key: string; start: Point } | null>(null)
const dragPos = ref<Point>({ x: 0, y: 0 })

const tempPath = computed(() => {
  const d = dragging.value
  if (!d) return ''
  const p = dragPos.value
  const dx = Math.max(60, (p.x - d.start.x) / 2)
  return `M ${d.start.x} ${d.start.y} C ${d.start.x + dx} ${d.start.y}, ${p.x - dx} ${p.y}, ${p.x} ${p.y}`
})

const toWrapPoint = (e: PointerEvent): Point => {
  const wr = wrapRect()
  if (!wr) return { x: 0, y: 0 }
  return { x: e.clientX - wr.left, y: e.clientY - wr.top }
}

const startDrag = (e: PointerEvent, side: 'up' | 'down', db: string, table: string) => {
  if (e.button !== 0) return
  e.preventDefault()
  const key = `${side}:${db}:${table}`
  const el = tableEls.get(key)
  if (!el) return
  dragging.value = { side, key, start: sidePoint(el, side === 'up' ? 'right' : 'left') }
  dragPos.value = dragging.value.start
  window.addEventListener('pointermove', onDragMove)
  window.addEventListener('pointerup', onDragUp)
}

const onDragMove = (e: PointerEvent) => {
  if (!dragging.value) return
  dragPos.value = toWrapPoint(e)
}

const onDragUp = (e: PointerEvent) => {
  const d = dragging.value
  if (d) {
    const p = toWrapPoint(e)
    const targetSide = d.side === 'up' ? 'down' : 'up'
    const hit = [...tableEls.entries()].find(([key, el]) => {
      if (!key.startsWith(`${targetSide}:`)) return false
      const wr = wrapRect()
      if (!wr) return false
      const r = el.getBoundingClientRect()
      return (
        p.x >= r.left - wr.left - 8 &&
        p.x <= r.left - wr.left + r.width + 8 &&
        p.y >= r.top - wr.top - 8 &&
        p.y <= r.top - wr.top + r.height + 8
      )
    })
    if (hit) {
      const targetKey = hit[0]
      const [, tDb, tTable] = targetKey.split(':')
      const [, sDb, sTable] = d.key.split(':')
      const up = d.side === 'up' ? { db: sDb, table: sTable } : { db: tDb, table: tTable }
      const down = d.side === 'down' ? { db: sDb, table: sTable } : { db: tDb, table: tTable }
      const dup = reportLinks.value.some((l) => l.upTable === up.table && l.downTable === down.table)
      if (dup) {
        ElMessage.warning(`「${up.table} → ${down.table}」已存在，请先删除原连线`)
      } else {
        reportLinks.value.push({
          id: ++reportLinkSeq,
          upDb: up.db,
          upTable: up.table,
          downDb: down.db,
          downTable: down.table,
          func: '直接映射',
          upField: `${up.table}_id`,
          downField: `${down.table}_id`,
        })
        linkRevision.value++
        validateReportLinks()
      }
    }
  }
  cleanupDrag()
}

const cleanupDrag = () => {
  dragging.value = null
  window.removeEventListener('pointermove', onDragMove)
  window.removeEventListener('pointerup', onDragUp)
}

const openLineageDialog = () => {
  editingBatchId.value = null
  reportTitle.value = ''
  reportLinks.value = []
  activeLinkId.value = null
  lineageDialogVisible.value = true
  nextTick(() => {
    linkRevision.value++
    validateReportLinks()
  })
}

const editBatch = (batch: ReportBatch) => {
  editingBatchId.value = batch.id
  reportTitle.value = batch.title
  reportLinks.value = batch.links.map((l) => ({ ...l }))
  activeLinkId.value = null
  lineageDialogVisible.value = true
  nextTick(() => {
    linkRevision.value++
    validateReportLinks()
  })
}

const resetBuilder = () => {
  reportLinks.value = []
  activeLinkId.value = null
  linkRevision.value++
  validateReportLinks()
}

const removeLink = (id: number) => {
  reportLinks.value = reportLinks.value.filter((l) => l.id !== id)
  if (activeLinkId.value === id) activeLinkId.value = null
  linkRevision.value++
  validateReportLinks()
}

const onRowClick = (row: ReportLink) => {
  activeLinkId.value = row.id
}

const ensureReportTable = (table: string, field: string, side: 'up' | 'down') => {
  if (!tableFields[table]) {
    tableFields[table] = [field]
    const layer: Layer = /^(dws|ads|rpt|report)/i.test(table)
      ? 'target'
      : /^(dim|dwd|ods|mid|fct)/i.test(table)
        ? 'mid'
        : side === 'up'
          ? 'source'
          : 'mid'
    layerTables[layer].push(table)
    tableMeta[table] = { label: `新增表 ${table}`, layer }
  } else if (field && !tableFields[table].includes(field)) {
    tableFields[table].push(field)
  }
}

/* ==================== 血缘填报 · 校验 ==================== */
const tableFieldTypes: Record<string, string> = {
  'ticket_sale.order_id': 'STRING', 'ticket_sale.order_date': 'DATE', 'ticket_sale.line_code': 'STRING',
  'ticket_sale.amount': 'DECIMAL', 'ticket_sale.ticket_type': 'STRING', 'ticket_sale.status': 'STRING',
  'ticket_sale.create_time': 'TIMESTAMP',
  'passenger_info.passenger_id': 'STRING', 'passenger_info.passenger_name': 'STRING', 'passenger_info.age': 'INT',
  'passenger_info.phone': 'STRING', 'passenger_info.create_time': 'TIMESTAMP',
  'station_info.station_code': 'STRING', 'station_info.station_name': 'STRING', 'station_info.station_type': 'STRING',
  'station_info.status': 'STRING',
  'line_info.line_code': 'STRING', 'line_info.line_name': 'STRING', 'line_info.status': 'STRING',
  'dwd_order_detail.order_id': 'STRING', 'dwd_order_detail.order_date': 'DATE', 'dwd_order_detail.line_code': 'STRING',
  'dwd_order_detail.amount': 'DECIMAL', 'dwd_order_detail.ticket_type': 'STRING', 'dwd_order_detail.create_time': 'TIMESTAMP',
  'dim_passenger.passenger_id': 'STRING', 'dim_passenger.passenger_name': 'STRING', 'dim_passenger.age_group': 'STRING',
  'dim_passenger.create_time': 'TIMESTAMP',
  'dim_station.station_code': 'STRING', 'dim_station.station_name': 'STRING',
  'dim_line.line_code': 'STRING', 'dim_line.line_name': 'STRING',
  'dws_order_report.order_id': 'STRING', 'dws_order_report.order_date': 'DATE', 'dws_order_report.line_code': 'STRING',
  'dws_order_report.line_name': 'STRING', 'dws_order_report.total_amount': 'DECIMAL', 'dws_order_report.order_count': 'INT',
  'dws_order_report.ticket_type': 'STRING', 'dws_order_report.create_time': 'TIMESTAMP',
  'ads_line_flow.line_code': 'STRING', 'ads_line_flow.line_name': 'STRING', 'ads_line_flow.station_code': 'STRING',
  'ads_line_flow.station_name': 'STRING', 'ads_line_flow.total_passengers': 'INT', 'ads_line_flow.avg_age': 'DECIMAL',
  'ads_line_flow.flow_date': 'DATE', 'ads_line_flow.update_time': 'TIMESTAMP',
}

const knownTables = computed(() => {
  const set = new Set<string>(Object.keys(tableFields))
  upDbs.forEach((db) => db.tables.forEach((t) => set.add(t)))
  downDbs.forEach((db) => db.tables.forEach((t) => set.add(t)))
  return set
})

const fieldsOf = (table: string) => tableFields[table] || []

const typeGroup = (t: string) =>
  ['INT', 'BIGINT', 'DECIMAL', 'DOUBLE', 'NUMERIC'].includes(t) ? 'num' : ['DATE', 'DATETIME', 'TIMESTAMP'].includes(t) ? 'time' : t

const typeCompatible = (a: string, b: string) => typeGroup(a) === typeGroup(b) || typeGroup(b) === 'STRING'

const reachable = (adj: Map<string, Set<string>>, from: string, to: string) => {
  if (!adj.has(from)) return false
  const queue = [from]
  const seen = new Set([from])
  while (queue.length) {
    const cur = queue.shift()!
    if (cur === to) return true
    for (const next of adj.get(cur) ?? []) {
      if (!seen.has(next)) {
        seen.add(next)
        queue.push(next)
      }
    }
  }
  return false
}

const reportTitle = ref('')
const editingBatchId = ref<string | null>(null)
const batchErrorCount = ref(0)

const errorIssueCount = (issues?: ReportLink['issues']) => (issues ?? []).filter((i) => i.level === 'error').length
const hasErrorIssue = (issues?: ReportLink['issues']) => errorIssueCount(issues) > 0
const hasWarnIssue = (issues?: ReportLink['issues']) => (issues ?? []).some((i) => i.level === 'warn')

const validateReportLinks = () => {
  const existingEdges = new Set(fieldLineage.map((f) => `${f.source.split('.')[0]}>${f.target.split('.')[0]}`))
  const adj = new Map<string, Set<string>>()
  fieldLineage.forEach((f) => {
    const u = f.source.split('.')[0]
    const v = f.target.split('.')[0]
    if (!adj.has(u)) adj.set(u, new Set())
    adj.get(u)!.add(v)
  })

  reportLinks.value.forEach((l) => {
    const issues: { level: 'error' | 'warn'; text: string }[] = []
    const upT = l.upTable
    const downT = l.downTable
    const upF = l.upField || ''
    const downF = l.downField || ''

    // 自引用检测
    if (upT === downT && upF === downF) {
      issues.push({ level: 'error', text: '自引用检测：上下游为同一字段' })
    } else if (upT === downT) {
      issues.push({ level: 'error', text: '自引用检测：字段归属同一张表，请确认血缘方向' })
    }

    // 对象存在性检测
    if (!knownTables.value.has(upT)) issues.push({ level: 'error', text: `对象存在性：上游表「${upT}」在元数据中不存在` })
    if (!knownTables.value.has(downT)) issues.push({ level: 'error', text: `对象存在性：下游表「${downT}」在元数据中不存在` })
    if (tableFields[upT] && upF && !tableFields[upT].includes(upF)) {
      issues.push({ level: 'warn', text: `上游字段「${upF}」尚未在元数据中采集，生效时将自动补齐` })
    }
    if (tableFields[downT] && downF && !tableFields[downT].includes(downF)) {
      issues.push({ level: 'warn', text: `下游字段「${downF}」尚未在元数据中采集，生效时将自动补齐` })
    }

    // 字段类型匹配检测
    if (upF && downF) {
      const ut = tableFieldTypes[`${upT}.${upF}`]
      const dt = tableFieldTypes[`${downT}.${downF}`]
      if (ut && dt && !typeCompatible(ut, dt)) {
        issues.push({ level: 'error', text: `字段类型不匹配：${upF}(${ut}) → ${downF}(${dt})` })
      } else if (!ut || !dt) {
        issues.push({ level: 'warn', text: '字段类型未知，建议确认映射类型' })
      }
    }

    // 重复检测（与已生效图谱 / 本批次内）
    const key = `${upT}>${downT}`
    if (existingEdges.has(key)) issues.push({ level: 'error', text: '重复检测：该表级血缘在生效图谱中已存在' })

    // 环路检测：加入后是否形成环（当前图中 downT 已达 upT）
    if (reachable(adj, downT, upT)) issues.push({ level: 'error', text: '环路检测：该连线将形成血缘环路' })

    if (!adj.has(upT)) adj.set(upT, new Set())
    adj.get(upT)!.add(downT)
    existingEdges.add(key)
    l.issues = issues
  })
  batchErrorCount.value = reportLinks.value.reduce((s, l) => s + (l.issues ?? []).filter((i) => i.level === 'error').length, 0)
}

const nowText = () => new Date().toLocaleString('sv-SE').replace('T', ' ')

let batchSeq = 0
const nextBatchId = () => {
  batchSeq++
  return `RP-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(batchSeq).padStart(3, '0')}`
}

const saveBatch = (status: '草稿' | '待审批') => {
  if (!reportLinks.value.length) {
    ElMessage.warning('请先从左侧拖拽连线到右侧，建立至少一条血缘关系')
    return
  }
  if (status === '待审批' && reportLinks.value.some((l) => !l.upField || !l.downField)) {
    ElMessage.warning('存在未选择源字段 / 目标字段的连线，请补充字段')
    return
  }
  validateReportLinks()
  if (status === '待审批' && batchErrorCount.value > 0) {
    ElMessage.warning(`存在 ${batchErrorCount.value} 项校验异常，请修复后再提交审批`)
    return
  }
  const links = reportLinks.value.map((l) => ({ ...l }))
  if (editingBatchId.value) {
    const idx = batches.value.findIndex((b) => b.id === editingBatchId.value)
    if (idx >= 0) {
      const old = batches.value[idx]
      batches.value[idx] = {
        ...old,
        title: reportTitle.value,
        links,
        errorCount: batchErrorCount.value,
        status: status === '待审批' ? '待审批' : old.status,
        ...(status === '待审批' ? { submitTime: nowText() } : {}),
      }
    }
  } else {
    batches.value.unshift({
      id: nextBatchId(),
      title: reportTitle.value,
      creator: '当前用户',
      createTime: nowText(),
      links,
      errorCount: batchErrorCount.value,
      status,
      ...(status === '待审批' ? { submitTime: nowText() } : {}),
    })
  }
  lineageDialogVisible.value = false
  reportLinks.value = []
  ElMessage.success(status === '草稿' ? '已保存为草稿，可在填报列表中继续编辑' : '已提交审批，等待管理员审批')
}

/* ==================== 填报批次列表 ==================== */
type BatchStatus = '草稿' | '待审批' | '已通过' | '已驳回' | '已回滚'

type ReportBatch = {
  id: string
  title: string
  creator: string
  createTime: string
  links: ReportLink[]
  errorCount: number
  status: BatchStatus
  submitTime?: string
  approver?: string
  approveTime?: string
  comment?: string
  versionNo?: string
  rollbackTime?: string
}

const batchStatusList = ['草稿', '待审批', '已通过', '已驳回', '已回滚']
const batchStatusTag: Record<string, 'info' | 'warning' | 'success' | 'danger' | 'primary'> = {
  草稿: 'info',
  待审批: 'warning',
  已通过: 'success',
  已驳回: 'danger',
  已回滚: 'primary',
}

const batches = ref<ReportBatch[]>([
  {
    id: 'RP-20260801-001',
    title: '支付流水接入 ODS 层（历史批次基线）',
    creator: '张工',
    createTime: '2026-08-01 10:20',
    links: [
      { id: 1, upDb: '票务运营库', upTable: 'ticket_sale', upField: 'order_id', downDb: '数据仓库ODS', downTable: 'dwd_order_detail', downField: 'order_id', func: '直接映射', issues: [] },
      { id: 2, upDb: '票务运营库', upTable: 'passenger_info', upField: 'passenger_id', downDb: '数据仓库DIM', downTable: 'dim_passenger', downField: 'passenger_id', func: '直接映射', issues: [] },
    ],
    errorCount: 0,
    status: '已通过',
    submitTime: '2026-08-01 11:00',
    approver: '安全管理员',
    approveTime: '2026-08-01 15:30',
    comment: '核对无误，准予生效',
    versionNo: 'V2.0',
  },
  {
    id: 'RP-20260806-002',
    title: '客流指标口径拆分（待审批）',
    creator: '李工',
    createTime: '2026-08-06 14:00',
    links: [
      { id: 1, upDb: '数据仓库DWD', upTable: 'dwd_order_detail', upField: 'amount', downDb: '数据仓库DWS', downTable: 'dws_order_report', downField: 'total_amount', func: 'SUM()', issues: [] },
    ],
    errorCount: 0,
    status: '待审批',
    submitTime: '2026-08-06 16:00',
  },
  {
    id: 'RP-20260810-003',
    title: '设备状态接入运营报表（草稿，含重复连线）',
    creator: '王工',
    createTime: '2026-08-10 09:30',
    links: [
      { id: 1, upDb: '设备监控库', upTable: 'device_status_log', upField: 'device_id', downDb: '数据仓库DWS', downTable: 'train_operation_log', downField: 'device_id', func: '直接映射', issues: [] },
      { id: 2, upDb: '数据仓库DWD', upTable: 'dwd_order_detail', upField: 'order_id', downDb: '数据仓库DWS', downTable: 'dws_order_report', downField: 'order_id', func: '直接映射', issues: [] },
    ],
    errorCount: 1,
    status: '草稿',
  },
  {
    id: 'RP-20260812-004',
    title: '临时表迁移方案（已驳回）',
    creator: '李工',
    createTime: '2026-08-12 11:20',
    links: [
      { id: 1, upDb: '基础信息库', upTable: 'station_info', upField: 'station_code', downDb: '数据仓库DIM', downTable: 'dim_station', downField: 'station_code', func: '直接映射', issues: [{ level: 'warn', text: '审批意见：与已有映射重复' }] },
    ],
    errorCount: 0,
    status: '已驳回',
    submitTime: '2026-08-12 11:40',
    approver: '安全管理员',
    approveTime: '2026-08-12 14:10',
    comment: '与现有血缘重复，请补充差异说明后重新提交',
  },
])

const batchKeyword = ref('')
const batchStatusFilter = ref('')

const filteredBatches = computed(() =>
  batches.value.filter((b) => {
    if (batchStatusFilter.value && b.status !== batchStatusFilter.value) return false
    if (!batchKeyword.value) return true
    const kw = batchKeyword.value.toLowerCase()
    return b.id.toLowerCase().includes(kw) || b.creator.toLowerCase().includes(kw) || b.title.toLowerCase().includes(kw)
  }),
)

const passedBatches = computed(() => batches.value.filter((b) => b.status === '已通过').length)

const submitBatch = (batch: ReportBatch) => {
  if (batch.errorCount > 0) {
    ElMessage.warning(`该批次存在 ${batch.errorCount} 项校验异常，请编辑修复后再提交`)
    return
  }
  batch.status = '待审批'
  batch.submitTime = nowText()
  ElMessage.success(`批次「${batch.id}」已提交审批（Mock）`)
}

/* ==================== 提交审批流 ==================== */
const approveVisible = ref(false)
const approveTarget = ref<ReportBatch | null>(null)
const approverPool = ['安全管理员', '数据治理管理员', '平台管理员']
const approveForm = reactive({ approver: '安全管理员', comment: '' })

let graphVersionSeq = 2

const openApproveDialog = (batch: ReportBatch) => {
  approveTarget.value = batch
  approveForm.approver = '安全管理员'
  approveForm.comment = ''
  approveVisible.value = true
}

const applyBatchToLineage = (batch: ReportBatch) => {
  let added = 0
  batch.links.forEach((l) => {
    const source = `${l.upTable}.${l.upField}`
    const target = `${l.downTable}.${l.downField}`
    if (!fieldLineage.some((f) => f.source === source && f.target === target)) {
      fieldLineage.push({ source, target, func: l.func || '直接映射', flow: Math.round(Math.random() * 5000) + 500 })
      added++
    }
    ensureReportTable(l.upTable, l.upField, 'up')
    ensureReportTable(l.downTable, l.downField, 'down')
  })
  return added
}

const doApprove = (pass: boolean) => {
  const b = approveTarget.value
  if (!b) return
  if (!approveForm.approver) {
    ElMessage.warning('请选择审批人')
    return
  }
  if (!approveForm.comment.trim()) {
    ElMessage.warning('请填写审批意见')
    return
  }
  if (pass && b.errorCount > 0) {
    ElMessage.warning('该批次存在校验异常，不能审批通过')
    return
  }
  if (pass) {
    const added = applyBatchToLineage(b)
    b.status = '已通过'
    b.approver = approveForm.approver
    b.approveTime = nowText()
    b.comment = approveForm.comment
    b.versionNo = `V${++graphVersionSeq}.0`
    renderLineage()
    ElMessage.success(`审批通过，${added} 条血缘已生效入图谱，当前图谱版本 ${b.versionNo}`)
  } else {
    b.status = '已驳回'
    b.approver = approveForm.approver
    b.approveTime = nowText()
    b.comment = approveForm.comment
    ElMessage.warning('已驳回该填报批次')
  }
  approveVisible.value = false
}

/* ==================== 版本对比与回滚 ==================== */
const compareVisible = ref(false)
const compareBase = ref('BASE')
const compareTarget = ref('')
const compareOptions = ref<{ label: string; value: string }[]>([])

const openVersionCompare = (batch: ReportBatch) => {
  compareOptions.value = [
    { label: '基线版本（初始图谱 V1.0）', value: 'BASE' },
    ...batches.value
      .filter((b) => b.status === '已通过' || b.status === '已回滚')
      .map((b) => ({ label: `${b.id}（${b.versionNo ?? '—'}）`, value: b.id })),
  ]
  compareBase.value = 'BASE'
  compareTarget.value = batch.id
  compareVisible.value = true
}

const snapshotOf = (option: string): { source: string; func: string; target: string }[] => {
  if (option === 'BASE') {
    const applied = new Set(
      batches.value
        .filter((b) => b.status === '已通过' || b.status === '已回滚')
        .flatMap((b) => b.links.map((l) => `${l.upTable}.${l.upField}>${l.downTable}.${l.downField}`)),
    )
    return fieldLineage.filter((f) => !applied.has(`${f.source}>${f.target}`)).map((f) => ({ source: f.source, func: f.func, target: f.target }))
  }
  const b = batches.value.find((x) => x.id === option)
  return b ? b.links.map((l) => ({ source: `${l.upTable}.${l.upField}`, func: l.func, target: `${l.downTable}.${l.downField}` })) : []
}

const diffResult = computed(() => {
  const a = snapshotOf(compareBase.value)
  const b = snapshotOf(compareTarget.value)
  const key = (r: { source: string; target: string }) => `${r.source}>${r.target}`
  const setB = new Set(b.map(key))
  const setA = new Set(a.map(key))
  return {
    added: b.filter((r) => !setA.has(key(r))),
    removed: a.filter((r) => !setB.has(key(r))),
    common: a.filter((r) => setB.has(key(r))).length,
  }
})

const diffRows = computed(() => [
  ...diffResult.value.added.map((r) => ({ ...r, change: '新增' as const })),
  ...diffResult.value.removed.map((r) => ({ ...r, change: '移除' as const })),
])

const rollbackBatch = (batch: ReportBatch) => {
  ElMessageBox.confirm(
    `确认回滚批次「${batch.id}」？该批次生效的 ${batch.links.length} 条血缘将从图谱中移除，图谱回到上一版本。`,
    '回滚确认',
    { type: 'warning', confirmButtonText: '确认回滚', cancelButtonText: '取消' },
  )
    .then(() => {
      let removed = 0
      batch.links.forEach((l) => {
        const source = `${l.upTable}.${l.upField}`
        const target = `${l.downTable}.${l.downField}`
        const idx = fieldLineage.findIndex((f) => f.source === source && f.target === target)
        if (idx >= 0) {
          fieldLineage.splice(idx, 1)
          removed++
        }
      })
      batch.status = '已回滚'
      batch.rollbackTime = nowText()
      renderLineage()
      ElMessage.success(`已回滚，${removed} 条血缘已从图谱移除（Mock）`)
    })
    .catch(() => {})
}

const handleResize = () => lineageChart?.resize()

watch(activeTab, () => {
  if (activeTab.value === 'visual') {
    nextTick(() => handleResize())
  }
})

let reportResizeObserver: ResizeObserver | null = null

watch(lineageDialogVisible, (visible) => {
  if (visible) {
    nextTick(() => {
      // 弹框打开后重算连线坐标，并监听容器尺寸变化自动刷新
      linkRevision.value++
      reportResizeObserver?.disconnect()
      if (wrapRef.value && typeof ResizeObserver !== 'undefined') {
        reportResizeObserver = new ResizeObserver(() => linkRevision.value++)
        reportResizeObserver.observe(wrapRef.value)
      }
    })
  } else {
    reportResizeObserver?.disconnect()
    reportResizeObserver = null
  }
})

let chartResizeObserver: ResizeObserver | null = null

onMounted(() => {
  renderLineage()
  window.addEventListener('resize', handleResize)
  // 容器尺寸变化时自动同步 ECharts 画布（CSS 高度变化 / 折叠侧栏 / 标签页切换等）
  if (lineageChartRef.value && typeof ResizeObserver !== 'undefined') {
    chartResizeObserver = new ResizeObserver(() => handleResize())
    chartResizeObserver.observe(lineageChartRef.value)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  chartResizeObserver?.disconnect()
  reportResizeObserver?.disconnect()
  lineageChart?.dispose()
})
</script>

<style lang="scss" scoped>
/* el-dialog 渲染为子组件内部节点，需用全局选择器才能确保命中 */
:global(.lineage-report-dialog .el-dialog__header) {
  padding: 12px 20px;
  margin-right: 0;
}

:global(.lineage-report-dialog .el-dialog__body) {
  padding: 8px 20px 4px;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 128px);
  min-height: 420px;
}

:global(.lineage-report-dialog .el-dialog__footer) {
  padding: 8px 20px 14px;
}

.lineage-page {
  height: 100%;
}

.lineage-tabs-wrap {
  height: 100%;
  min-height: 540px;
  display: flex;
  flex-direction: column;

  :deep(.el-tabs--border-card) {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    border-radius: 8px;
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

.lineage-visual-pane,
.lineage-detail-pane,
.lineage-anomaly-pane {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.lineage-anomaly-pane {
  overflow: auto;
}

.lineage-toolbar {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.filter-select-sm {
  width: 130px;
}

.lineage-detail-pane {
  :deep(.el-table) {
    flex: 1;
    min-height: 0;
  }
}

.lineage-chart {
  flex: 1;
  min-height: 0;
  width: 100%;
  height: auto;
  overflow: hidden;
}

.sankey-legend {
  display: flex;
  gap: 18px;
  flex-wrap: wrap;
  padding: 6px 2px 0;
}

.sankey-legend-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #8c8c8c;
}

.sankey-legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 3px;
  display: inline-block;
}

.anomaly-text {
  color: #4a4a4a;
  line-height: 1.6;
}

.anomaly-stats {
  display: flex;
  gap: 12px;
  margin-top: 16px;
  flex-wrap: wrap;
}

.anomaly-stat {
  flex: 1;
  min-width: 110px;
  border: 1px solid #edf0f5;
  border-radius: 8px;
  padding: 14px;
  text-align: center;
  background: #fafafa;
}

.anomaly-stat-value {
  font-size: 24px;
  font-weight: 700;
  line-height: 1.2;
}

.anomaly-stat-label {
  margin-top: 4px;
  font-size: 12px;
  color: #8c8c8c;
}

.field-source {
  color: #2b6cb0;
  font-weight: 600;
  font-size: 12px;
}

.field-target {
  color: #da251d;
  font-weight: 600;
  font-size: 12px;
}

/* ========== 血缘填报列表 ========== */
.report-pane {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.report-pane-toolbar {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: none;
}

.batch-table {
  flex: 1;
  min-height: 0;

  :deep(.el-table__expanded-cell) {
    background: #fafbfd;
  }
}

.batch-detail {
  padding: 4px 8px;

  .batch-detail-title {
    font-size: 12px;
    color: #4a4a4a;
    margin-bottom: 8px;
    font-weight: 600;
  }
}

.report-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.issue-line {
  font-size: 12px;
  line-height: 1.7;
}

.issue-error {
  color: #da251d;
  font-weight: 600;
}

.issue-warn {
  color: #ed7b2f;
  font-weight: 600;
}

.trend-positive {
  color: #00a854;
  font-weight: 600;
}

.mr-4 {
  margin-right: 4px;
}

.approve-links {
  display: flex;
  flex-direction: column;
  gap: 6px;
  background: #f7f8fa;
  border-radius: 8px;
  padding: 10px 12px;
  max-height: 200px;
  overflow-y: auto;
  margin-bottom: 12px;
}

.approve-link-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}

.approve-form {
  margin-top: 4px;
}

.compare-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.compare-summary {
  display: flex;
  gap: 18px;
  font-size: 12px;
  color: #4a4a4a;
  margin-bottom: 10px;
}

.block-title {
  font-size: 13px;
  font-weight: 700;
  color: #4a4a4a;
  margin: 10px 0 8px;
}

.lineage-report-dialog {
  .report-hint {
    margin-bottom: 10px;

    .hint-strong {
      font-weight: 700;
      color: #da251d;
      margin: 0 2px;
    }
  }

  .report-builder {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
    height: calc(100vh - 190px);
    min-height: 420px;
  }

  .report-canvas-wrap {
    position: relative;
    flex: 1;
    min-height: 0;
    border: 1px solid #e5e9f0;
    border-radius: 8px;
    background-color: #fbfcfe;
    background-image: radial-gradient(#e8ecf3 1px, transparent 1px);
    background-size: 20px 20px;
    overflow: hidden;
  }

  .report-svg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;

    path {
      fill: none;
      stroke: #c7cdd8;
      stroke-width: 1.6;
      pointer-events: strokePainted;
      cursor: pointer;

      &:hover,
      &.is-active {
        stroke: #da251d;
        stroke-width: 2.6;
      }
    }
  }

  .report-temp-path {
    stroke: #da251d;
    stroke-width: 1.6;
    stroke-dasharray: 6 4;
    pointer-events: none;
  }

  .report-hover-tip {
    position: absolute;
    z-index: 5;
    max-width: 320px;
    background: rgba(42, 46, 53, 0.88);
    color: #fff;
    font-size: 12px;
    padding: 4px 10px;
    border-radius: 4px;
    pointer-events: none;
    transform: translate(-50%, -135%);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .report-side {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 240px;
    overflow-y: auto;
    background: #fff;
    z-index: 1;
  }

  .report-side-left {
    left: 0;
    border-right: 1px solid #edf0f5;
  }

  .report-side-right {
    right: 0;
    border-left: 1px solid #edf0f5;
  }

  .side-title {
    position: sticky;
    top: 0;
    z-index: 2;
    background: #f7f8fa;
    font-size: 12px;
    font-weight: 700;
    color: #4a4a4a;
    padding: 8px 12px;
    border-bottom: 1px solid #edf0f5;
  }

  .db-section {
    padding: 0 0 6px;
  }

  .db-head {
    font-size: 12px;
    color: #8c8c8c;
    padding: 10px 12px 4px;
    font-weight: 600;
  }

  .table-row {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 5px 10px;
    cursor: grab;
    border-radius: 6px;
    user-select: none;

    &:hover {
      background: #f3f6fb;
      .port {
        border-color: #da251d;
        background: #fff1f0;
      }
    }

    &:active {
      cursor: grabbing;
    }

    .table-name {
      font-size: 12px;
      color: #333;
      flex: 1;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .port {
    flex: none;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #fff;
    border: 2px solid #b6bfcb;
  }

  .report-links {
    flex: 0 0 auto;
  }

  .report-footer {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .report-count {
    flex: 1;
    font-size: 12px;
    color: #8c8c8c;
  }
}
</style>
