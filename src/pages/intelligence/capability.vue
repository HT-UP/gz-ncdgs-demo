<template>
  <div class="standard-page agent-capability-page">
    <!-- 运行摘要 -->
    <div class="rs-grid">
      <div v-for="r in runSummary" :key="r.label" class="rs-card">
        <div class="rs-num" :style="{ color: r.color }">{{ r.value }}</div>
        <div class="rs-label">{{ r.label }}</div>
        <div class="rs-note dep-text">{{ r.note }}</div>
      </div>
    </div>

    <!-- 6 区域能力卡片 -->
    <div class="sec-title">六大能力区域</div>
    <div class="cap-grid">
      <div v-for="c in capabilities" :key="c.name" class="cap-card">
        <div class="cap-head">
          <div class="cap-title-row">
            <div class="cap-icon" :style="{ background: c.bg, color: '#fff' }"><el-icon :size="18"><component :is="c.iconComponent" /></el-icon></div>
            <span class="cap-name">{{ c.name }}</span>
          </div>
          <el-tag size="small" type="success" effect="dark">运行中</el-tag>
        </div>
        <div class="cap-desc">{{ c.desc }}</div>
        <div class="cap-metrics">
          <div class="cap-metric">
            <div class="cap-m-value">{{ c.today }}</div>
            <div class="cap-m-label dep-text">今日调用</div>
          </div>
          <div class="cap-metric">
            <div class="cap-m-value" style="color:#00a854">{{ c.acc }}%</div>
            <div class="cap-m-label dep-text">准确率</div>
          </div>
          <div class="cap-metric">
            <div class="cap-m-value" style="color:#2b6cb0">{{ c.avg }}ms</div>
            <div class="cap-m-label dep-text">平均耗时</div>
          </div>
        </div>
        <div class="cap-run">运行摘要：{{ c.summary }}</div>
      </div>
    </div>

    <!-- 效果评估机制 -->
    <div class="sec-title">效果评估机制</div>
    <el-card class="panel-card" shadow="never">
      <el-tabs v-model="evalTab">
        <el-tab-pane label="评估指标趋势" name="trend">
          <div class="eval-layout">
            <div ref="evalChartRef" class="eval-chart"></div>
            <div class="eval-side">
              <div class="eval-side-title">评估说明</div>
              <div class="eval-side-item">· 数据来源：人工抽检标注 + 业务反馈 + 自动回归</div>
              <div class="eval-side-item">· 评估周期：每日自动评估，每周出具报告</div>
              <div class="eval-side-item">· 阈值策略：准确率 &lt; 90% 自动进入训练池</div>
              <div class="eval-side-item">· 版本管理：效果回滚自动触发</div>
              <el-button type="danger" class="mt-12" plain @click="exportReport">导出评估报告</el-button>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="各智能体评估得分" name="score">
          <el-table :data="agentScores" size="small" stripe>
            <el-table-column prop="name" label="智能体" min-width="150" />
            <el-table-column prop="precision" label="精准率" width="100" align="center" />
            <el-table-column prop="recall" label="召回率" width="100" align="center" />
            <el-table-column prop="f1" label="F1" width="100" align="center" />
            <el-table-column label="评估等级" width="110">
              <template #default="{ row }">
                <el-tag size="small" :type="row.precision >= 95 ? 'success' : row.precision >= 90 ? 'warning' : 'danger'" effect="dark">
                  {{ row.precision >= 95 ? '优秀' : row.precision >= 90 ? '良好' : '需优化' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="updated" label="最近评估" width="110" />
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'
import { Collection, MagicStick, Notebook, Search, Tickets, TrendCharts } from '@element-plus/icons-vue'

const runSummary = [
  { label: '在线智能体', value: '6', note: '全部在线', color: '#da251d' },
  { label: '今日总调用', value: '2,714', note: '+8.2% 较昨日', color: '#2b6cb0' },
  { label: '平均响应', value: '0.8s', note: 'P95 1.5s', color: '#00a854' },
  { label: '综合效果评分', value: '94.3', note: '较上周 +0.6', color: '#ed7b2f' },
]

const capabilities = [
  { name: '元数据抽取', desc: '自动识别表结构、主外键与数据字典，输出结构化元数据。', today: 128, acc: 98.2, avg: 420, bg: '#2b6cb0', iconComponent: Tickets, summary: '本轮抽取 1,024 张表，字段级抽取完整率 99.1%' },
  { name: '元数据补全', desc: '基于语义推断补全业务描述、数据元映射与标签。', today: 342, acc: 94.5, avg: 260, bg: '#00a854', iconComponent: MagicStick, summary: '生成补全建议 186 条，人工确认采纳 172 条' },
  { name: '智能分级分类', desc: '按敏感要素自动完成分级（L1-L4）与业务分类。', today: 89, acc: 93.1, avg: 380, bg: '#ed7b2f', iconComponent: Collection, summary: '处理 2.4 万字段，敏感命中率 96.8%' },
  { name: '知识检索问答', desc: '面向治理知识与数据资产的语义检索与问答。', today: 2156, acc: 92.8, avg: 620, bg: '#da251d', iconComponent: Notebook, summary: '高频问题 48 个，答案溯源率 100%' },
  { name: '合规稽核', desc: '自动稽查标准落地、脱敏与权限执行情况。', today: 46, acc: 95.6, avg: 760, bg: '#8c8c8c', iconComponent: Search, summary: '发现标准偏离 12 处、未脱敏字段 8 个' },
  { name: '决策建议', desc: '基于治理运行态势输出优化建议与根因分析。', today: 18, acc: 90.2, avg: 1120, bg: '#9b59b6', iconComponent: TrendCharts, summary: '输出月度治理建议 9 条，采纳 7 条' },
]

const evalTab = ref('trend')

const evalChartRef = ref<HTMLElement>()
let evalChart: echarts.ECharts | null = null

const renderEval = () => {
  if (!evalChartRef.value) return
  evalChart?.dispose()
  evalChart = echarts.init(evalChartRef.value)
  evalChart.setOption({
    tooltip: { trigger: 'axis' },
    legend: { data: ['精准率', '召回率', 'F1'], top: 0 },
    grid: { left: 48, right: 20, top: 40, bottom: 30 },
    xAxis: { type: 'category', data: ['第1周', '第2周', '第3周', '第4周', '第5周', '第6周'], axisLine: { lineStyle: { color: '#e4e7ed' } } },
    yAxis: { type: 'value', min: 88, max: 100, splitLine: { lineStyle: { type: 'dashed', color: '#e4e7ed' } } },
    series: [
      { name: '精准率', type: 'line', smooth: true, data: [92.1, 92.8, 93.5, 94.2, 94.8, 95.4], lineStyle: { color: '#da251d', width: 3 }, itemStyle: { color: '#da251d' } },
      { name: '召回率', type: 'line', smooth: true, data: [90.5, 91.2, 92.0, 92.8, 93.4, 94.1], lineStyle: { color: '#2b6cb0', width: 3 }, itemStyle: { color: '#2b6cb0' } },
      { name: 'F1', type: 'line', smooth: true, data: [91.3, 92.0, 92.7, 93.5, 94.1, 94.7], lineStyle: { color: '#00a854', width: 3 }, itemStyle: { color: '#00a854' } },
    ],
  })
}

const agentScores = [
  { name: '元数据抽取', precision: 98.2, recall: 96.5, f1: 97.3, updated: '2026-08-13' },
  { name: '元数据补全', precision: 94.5, recall: 93.1, f1: 93.8, updated: '2026-08-13' },
  { name: '智能分级分类', precision: 93.1, recall: 92.4, f1: 92.7, updated: '2026-08-13' },
  { name: '知识检索问答', precision: 92.8, recall: 91.6, f1: 92.2, updated: '2026-08-13' },
  { name: '合规稽核', precision: 95.6, recall: 93.8, f1: 94.7, updated: '2026-08-12' },
  { name: '决策建议', precision: 90.2, recall: 88.9, f1: 89.5, updated: '2026-08-12' },
]

onMounted(renderEval)

const handleResize = () => evalChart?.resize()
onMounted(() => window.addEventListener('resize', handleResize))
onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  evalChart?.dispose()
})

const exportReport = () => ElMessage.success('智能体效果评估报告已导出（Mock）')
</script>

<style lang="scss" scoped>
.agent-capability-page {
  display: grid;
  gap: 16px;
}

.rs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
}

.rs-card {
  border: 1px solid #edf0f5;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
  background: #fff;
}

.rs-num {
  font-size: 26px;
  font-weight: 700;
}

.rs-label {
  color: #4a4a4a;
  font-size: 13px;
}

.rs-note {
  margin-top: 4px;
  font-size: 12px;
}

.sec-title {
  margin-top: 6px;
  font-size: 14px;
  font-weight: 700;
  color: #4a4a4a;
  padding-left: 10px;
  border-left: 4px solid #da251d;
}

.cap-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 12px;
}

.cap-card {
  border: 1px solid #e4e7ed;
  border-radius: 10px;
  padding: 14px;
  background: #fff;
  transition: box-shadow 0.2s ease, transform 0.2s ease;

  &:hover {
    box-shadow: 0 8px 20px rgba(218, 37, 29, 0.1);
    transform: translateY(-2px);
  }
}

.cap-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.cap-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.cap-icon {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  display: grid;
  place-items: center;
}

.cap-name {
  font-weight: 700;
  color: #4a4a4a;
}

.cap-desc {
  margin-top: 10px;
  color: #666;
  font-size: 12px;
  line-height: 1.7;
  min-height: 40px;
}

.cap-metrics {
  display: flex;
  gap: 8px;
  margin-top: 10px;
}

.cap-metric {
  flex: 1;
  text-align: center;
  padding: 8px 4px;
  border-radius: 8px;
  background: #fafbfd;
}

.cap-m-value {
  font-weight: 700;
  color: #4a4a4a;
}

.cap-m-label {
  font-size: 11px;
  margin-top: 2px;
}

.cap-run {
  margin-top: 10px;
  padding: 8px 10px;
  border-radius: 6px;
  background: rgba(218, 37, 29, 0.05);
  color: #4a4a4a;
  font-size: 12px;
  line-height: 1.6;
}

.eval-layout {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 16px;
}

.eval-chart {
  height: 300px;
}

.eval-side-title {
  font-weight: 700;
  color: #4a4a4a;
  margin-bottom: 10px;
}

.eval-side-item {
  color: #4a4a4a;
  font-size: 12px;
  line-height: 2;
}

.mt-12 {
  margin-top: 12px;
}
</style>