<template>
  <div class="standard-page">
    <el-row :gutter="16">
      <el-col :xs="24" :lg="6" v-for="stat in poolStats" :key="stat.label">
        <el-card class="metric-card dashboard-card" shadow="hover">
          <div class="metric-title">{{ stat.label }}</div>
          <div class="metric-value">{{ stat.value }}</div>
          <div class="metric-subtitle">
            <span class="trend-positive">{{ stat.note }}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16" class="mb-16">
      <el-col :xs="24" :lg="14">
        <el-card class="panel-card dashboard-card" shadow="never">
          <template #header>
            <div class="panel-header">
              <span>连接池运行状态</span>
              <el-link :underline="false" type="danger" @click="refreshStatus">刷新状态</el-link>
            </div>
          </template>
          <div ref="poolChartRef" class="chart-box chart-box--compact"></div>
        </el-card>
      </el-col>

      <el-col :xs="24" :lg="10">
        <el-card class="panel-card dashboard-card" shadow="never">
          <template #header>
            <div class="panel-header">
              <span>连接池参数配置</span>
            </div>
          </template>
          <el-form :model="poolConfig" label-width="140px" label-position="left">
            <el-form-item label="最大连接数">
              <el-input-number v-model="poolConfig.maxActive" :min="10" :max="500" />
            </el-form-item>
            <el-form-item label="最小空闲连接数">
              <el-input-number v-model="poolConfig.minIdle" :min="1" :max="50" />
            </el-form-item>
            <el-form-item label="连接超时时间(s)">
              <el-input-number v-model="poolConfig.timeout" :min="5" :max="120" />
            </el-form-item>
            <el-form-item label="最大等待时间(ms)">
              <el-input-number v-model="poolConfig.maxWait" :min="100" :max="30000" :step="100" />
            </el-form-item>
            <el-form-item label="健康检查周期(s)">
              <el-input-number v-model="poolConfig.healthCheck" :min="10" :max="600" :step="10" />
            </el-form-item>
            <el-form-item label="自动回收无效连接">
              <el-switch v-model="poolConfig.autoRecycle" />
            </el-form-item>
          </el-form>
          <div class="pool-actions">
            <el-button type="danger" @click="saveConfig">保存配置</el-button>
            <el-button @click="forceRecycle">立即回收</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-card class="panel-card dashboard-card" shadow="never">
      <template #header>
        <div class="panel-header">
          <span>配置变更审计</span>
        </div>
      </template>
      <el-table :data="auditRows" stripe>
        <el-table-column prop="time" label="时间" width="160" />
        <el-table-column prop="operator" label="操作人" width="100" />
        <el-table-column prop="action" label="变更动作" width="180" />
        <el-table-column prop="detail" label="变更内容" min-width="260" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'

const poolStats = [
  { label: '活跃连接数', value: '128', note: '峰值 156' },
  { label: '空闲连接数', value: '46', note: '正常区间' },
  { label: '等待线程数', value: '3', note: '无阻塞' },
  { label: '连接池健康度', value: '98.6%', note: '运行良好' },
]

const poolConfig = reactive({
  maxActive: 200,
  minIdle: 20,
  timeout: 30,
  maxWait: 3000,
  healthCheck: 60,
  autoRecycle: true,
})

const auditRows = [
  { time: '2026-08-11 10:32', operator: '张三', action: '修改连接池参数', detail: '最大连接数 200 → 260' },
  { time: '2026-08-09 16:20', operator: '李四', action: '修改连接池参数', detail: '超时时间 60s → 30s' },
  { time: '2026-08-07 09:15', operator: '王五', action: '启用自动回收', detail: '自动回收无效连接已开启' },
]

const poolChartRef = ref<HTMLElement>()
let poolChart: echarts.ECharts | null = null

const renderPoolChart = () => {
  if (!poolChartRef.value) return
  poolChart?.dispose()
  poolChart = echarts.init(poolChartRef.value)
  poolChart.setOption({
    tooltip: { trigger: 'axis' },
    legend: { data: ['活跃连接数', '空闲连接数', '等待线程数'], top: 0, left: 0 },
    grid: { left: 40, right: 20, top: 36, bottom: 32 },
    xAxis: {
      type: 'category',
      data: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00'],
    },
    yAxis: [
      { type: 'value', splitLine: { lineStyle: { type: 'dashed', color: '#E4E7ED' } } },
      { type: 'value', min: 0, max: 10, splitLine: { show: false } },
    ],
    series: [
      {
        name: '活跃连接数',
        type: 'line',
        smooth: true,
        data: [86, 104, 128, 156, 132, 118, 128],
        lineStyle: { color: '#DA251D', width: 3 },
        itemStyle: { color: '#DA251D' },
        symbol: 'circle',
        symbolSize: 6,
      },
      {
        name: '空闲连接数',
        type: 'line',
        smooth: true,
        data: [40, 34, 28, 18, 26, 38, 46],
        lineStyle: { color: '#00A854', width: 2 },
        itemStyle: { color: '#00A854' },
      },
      {
        name: '等待线程数',
        type: 'line',
        smooth: true,
        yAxisIndex: 1,
        data: [1, 2, 3, 8, 4, 2, 3],
        lineStyle: { color: '#ED7B2F', width: 2 },
        itemStyle: { color: '#ED7B2F' },
      },
    ],
  })
}

const refreshStatus = () => {
  ElMessage.success('连接池状态已刷新（Mock）')
}

const saveConfig = () => {
  ElMessage.success('连接池参数已保存（Mock）')
}

const forceRecycle = () => {
  ElMessage.success('已回收 12 条无效连接（Mock）')
}

const handleResize = () => {
  poolChart?.resize()
}

onMounted(() => {
  renderPoolChart()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  poolChart?.dispose()
})
</script>
