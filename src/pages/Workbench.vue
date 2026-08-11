<template>
  <div class="workbench-page">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="12" :lg="6" v-for="item in stats" :key="item.label">
        <el-card class="metric-card" shadow="never">
          <div class="metric-title">{{ item.label }}</div>
          <div class="metric-value">{{ item.value }}</div>
          <div class="metric-subtitle">{{ item.note }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="mt-20">
      <el-col :xs="24" :lg="16">
        <el-card class="panel-card workbench-hero" shadow="never">
          <template #header>
            <div class="panel-header">
              <span>工作台总览</span>
              <el-tag type="danger" effect="dark">红色品牌主题</el-tag>
            </div>
          </template>
          <div class="hero-grid">
            <div class="hero-main">
              <h2>广州地铁新线建设数据治理系统</h2>
              <p>
                统一承载建设期数据“采、治、存、管、用”全流程能力，面向新线建设阶段的设计、监理、施工与建设单位提供数据治理工作台。
              </p>

              <div class="hero-actions">
                <el-button type="danger">进入标准治理</el-button>
                <el-button plain>查看质量任务</el-button>
              </div>
            </div>

            <div class="hero-side">
              <div class="hero-item">
                <span>今日待办</span>
                <strong>12</strong>
              </div>
              <div class="hero-item">
                <span>规则命中</span>
                <strong>98.2%</strong>
              </div>
              <div class="hero-item">
                <span>资产覆盖</span>
                <strong>1,248</strong>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :lg="8">
        <el-card class="panel-card" shadow="never">
          <template #header>
            <div class="panel-header">
              <span>快捷入口</span>
              <el-tag type="info">工作台</el-tag>
            </div>
          </template>
          <el-space direction="vertical" fill class="shortcut-list">
            <el-button class="shortcut-btn" type="danger" plain>数据标准管理</el-button>
            <el-button class="shortcut-btn" type="danger" plain>元数据治理</el-button>
            <el-button class="shortcut-btn" type="danger" plain>数据质量管理</el-button>
            <el-button class="shortcut-btn" type="danger" plain>数据开发流程</el-button>
          </el-space>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="mt-20">
      <el-col :xs="24" :lg="14">
        <el-card class="panel-card" shadow="never">
          <template #header>
            <div class="panel-header">
              <span>近期任务</span>
              <el-link type="danger" :underline="false">更多</el-link>
            </div>
          </template>
          <el-table :data="tasks" style="width: 100%" border>
            <el-table-column prop="name" label="任务名称" min-width="180" />
            <el-table-column prop="type" label="类型" width="120" />
            <el-table-column prop="status" label="状态" width="120">
              <template #default="{ row }">
                <el-tag :type="row.statusType" effect="dark">{{ row.status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="owner" label="责任人" width="100" />
          </el-table>
        </el-card>
      </el-col>

      <el-col :xs="24" :lg="10">
        <el-card class="panel-card" shadow="never">
          <template #header>
            <div class="panel-header">
              <span>治理进度</span>
              <el-tag type="success">运行中</el-tag>
            </div>
          </template>
          <div class="progress-block" v-for="item in progress" :key="item.label">
            <div class="progress-label">
              <span>{{ item.label }}</span>
              <strong>{{ item.value }}%</strong>
            </div>
            <el-progress :percentage="item.value" :stroke-width="12" :color="item.color" />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
const stats = [
  { label: '数据标准', value: '286', note: '本月新增 12 条' },
  { label: '元数据资产', value: '1,248', note: '覆盖率 92.4%' },
  { label: '质量规则', value: '156', note: '运行中 148 条' },
  { label: '治理任务', value: '43', note: '待处理 7 项' },
]

const tasks = [
  { name: '标准版本发布审批', type: '标准治理', status: '待处理', statusType: 'warning', owner: '张三' },
  { name: '施工数据质量巡检', type: '质量稽核', status: '进行中', statusType: 'danger', owner: '李四' },
  { name: '新增表血缘确认', type: '元数据', status: '已完成', statusType: 'success', owner: '王五' },
]

const progress = [
  { label: '标准覆盖率', value: 86, color: '#DA251D' },
  { label: '元数据完整度', value: 92, color: '#2B6CB0' },
  { label: '质量闭环率', value: 79, color: '#ED7B2F' },
]
</script>
