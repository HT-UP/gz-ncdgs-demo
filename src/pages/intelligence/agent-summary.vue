<template>
  <div class="standard-page">
    <el-card shadow="never">
      <div class="panel-header">
        智能体运行摘要
        <div class="panel-actions">
          <el-select v-model="agent" class="filter-select">
            <el-option v-for="a in agents" :key="a" :label="a" :value="a" />
          </el-select>
          <el-button type="primary" plain>重新生成摘要</el-button>
        </div>
      </div>

      <div class="summary-card">
        <div class="summary-head">
          <div class="summary-icon"><el-icon><MagicStick /></el-icon></div>
          <div class="summary-meta">
            <div class="summary-title">{{ agent }} · 运行摘要</div>
            <div class="summary-time">本次运行 2026-06-16 09:30 ~ 09:42</div>
          </div>
          <el-tag type="success" effect="light">状态正常</el-tag>
        </div>
        <div class="summary-body">
          <div class="summary-section">执行动作</div>
          <div class="action-flow">
            <div v-for="(a, i) in summary.actions" :key="i" class="action-item">
              <span class="action-no">{{ i + 1 }}</span>
              <span class="action-text">{{ a }}</span>
            </div>
          </div>
          <div class="summary-section mt-16">处理对象</div>
          <div class="obj-tags">
            <el-tag v-for="o in summary.objects" :key="o" effect="plain" size="large">{{ o }}</el-tag>
          </div>
          <div class="summary-section mt-16">效果统计</div>
          <el-row :gutter="16">
            <el-col v-for="s in summary.stats" :key="s.name" :xs="12" :md="6">
              <div class="effect-card">
                <div class="effect-name">{{ s.name }}</div>
                <div class="effect-val">{{ s.val }}</div>
              </div>
            </el-col>
          </el-row>
          <div class="summary-section mt-16">优化建议</div>
          <div class="suggest-box">
            <div v-for="(sg, i) in summary.suggests" :key="i" class="suggest-item">
              <span class="suggest-dot"></span>{{ sg }}
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { MagicStick } from '@element-plus/icons-vue'

const agent = ref('数据资源管理智能体')
const agents = ['数据资源管理智能体', '元数据补全智能体', '质量规则推荐智能体', '主数据治理智能体']

const summary = {
  actions: ['扫描 286 张新增表', '智能解析 1,240 个字段', '自动归类至 12 个业务域', '回写资产目录并生成画像'],
  objects: ['操作域：数据资源目录', '更新资产 286 个', '生成画像 286 份', '挂载目录 268 个'],
  stats: [
    { name: '处理资产', val: '286' },
    { name: '自动归类', val: '93.7%' },
    { name: '人工确认', val: '18 个' },
    { name: '耗时', val: '12 分钟' },
  ],
  suggests: ['10 号线 BIM 资产建议单独建立子目录', '2 个字段识别置信度低，建议人工复核', '目录挂载成功率 93.7%，可优化识别模型'],
}
</script>

<style scoped>
.standard-page {
  display: grid;
  gap: 16px;
}

.summary-card {
  margin-top: 4px;
}

.summary-head {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 14px;
  border-bottom: 1px solid #edf0f5;
}

.summary-icon {
  width: 40px;
  height: 40px;
  flex: none;
  border-radius: 10px;
  display: grid;
  place-items: center;
  background: rgba(218, 37, 29, 0.1);
  color: #da251d;
}

.summary-meta {
  flex: 1;
  min-width: 0;
}

.summary-title {
  font-size: 15px;
  font-weight: 600;
  color: #4a4a4a;
}

.summary-time {
  margin-top: 2px;
  color: #8c8c8c;
  font-size: 12px;
}

.summary-body {
  padding-top: 14px;
}

.summary-section {
  font-size: 13px;
  font-weight: 600;
  color: #4a4a4a;
  margin-bottom: 10px;
  padding-left: 10px;
  border-left: 3px solid #da251d;
}

.mt-16 {
  margin-top: 16px;
}

.action-flow {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: #f7f8fa;
  border: 1px solid #eef0f4;
  border-radius: 8px;
  font-size: 12px;
  color: #4a4a4a;
}

.action-no {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: rgba(218, 37, 29, 0.1);
  color: #da251d;
  display: grid;
  place-items: center;
  font-size: 11px;
  font-weight: 700;
}

.obj-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.effect-card {
  padding: 12px;
  background: #fafafa;
  border: 1px solid #edf0f5;
  border-radius: 8px;
  text-align: center;
}

.effect-name {
  color: #8c8c8c;
  font-size: 11px;
}

.effect-val {
  margin-top: 2px;
  font-size: 20px;
  font-weight: 700;
  color: #da251d;
}

.suggest-box {
  display: grid;
  gap: 8px;
}

.suggest-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 10px 12px;
  background: #fdf8f7;
  border: 1px solid #f5e5e3;
  border-radius: 8px;
  font-size: 12px;
  color: #4a4a4a;
}

.suggest-dot {
  width: 8px;
  height: 8px;
  flex: none;
  margin-top: 5px;
  border-radius: 50%;
  background: #da251d;
}
</style>