<template>
  <div class="standard-page">
    <el-card shadow="never">
      <div class="panel-header">
        试点知识库建设
        <div class="panel-actions">
          <el-button type="primary" plain>新建试点库</el-button>
        </div>
      </div>

      <div class="pilot-grid">
        <div v-for="p in pilots" :key="p.name" class="pilot-card">
          <div class="pilot-head">
            <span class="pilot-name">{{ p.name }}</span>
            <el-tag :type="p.progress === 100 ? 'success' : 'primary'" size="small" effect="light">{{ p.progress === 100 ? '已建成' : '建设中' }}</el-tag>
          </div>
          <div class="pilot-progress">
            <el-progress :percentage="p.progress" :color="p.progress === 100 ? '#00a854' : '#2b6cb0'" :stroke-width="10" />
          </div>
          <div class="pilot-meta">
            <div class="pilot-stat"><span>知识条目</span><b>{{ p.entries }}</b></div>
            <div class="pilot-stat"><span>覆盖主题</span><b>{{ p.topics }}</b></div>
            <div class="pilot-stat"><span>智能体接入</span><b>{{ p.agents }}</b></div>
          </div>
          <div class="pilot-desc">{{ p.desc }}</div>
        </div>
      </div>
    </el-card>

    <el-card shadow="never">
      <div class="panel-header">试点建设全流程验证</div>
      <el-steps :active="3" align-center finish-status="success" class="pilot-steps">
        <el-step title="分类建立" description="确定分类体系" />
        <el-step title="知识入库" description="内容标准化" />
        <el-step title="向量索引" description="语义检索上线" />
        <el-step title="智能体接入" description="应用验证" />
      </el-steps>
      <el-alert title="数据安全知识库、数据质量知识库已完成全流程验证，可复制到其他知识域" type="success" :closable="false" show-icon />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const pilots = ref([
  { name: '数据安全知识库', progress: 100, entries: 186, topics: 8, agents: 3, desc: '覆盖分类分级/脱敏/密钥/审计等主题，已接入安全智能体' },
  { name: '数据质量知识库', progress: 100, entries: 142, topics: 7, agents: 2, desc: '覆盖质量规则/模板/工单/报告等主题，已接入质量智能体' },
  { name: '数据治理知识库', progress: 68, entries: 96, topics: 6, agents: 1, desc: '覆盖标准/元数据/目录治理主题，建设中' },
  { name: '新线建设知识库', progress: 45, entries: 54, topics: 5, agents: 1, desc: 'BIM/设计规范/移交标准，建设中' },
])
</script>

<style scoped>
.standard-page {
  display: grid;
  gap: 16px;
}

.pilot-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 12px;
}

.pilot-card {
  padding: 16px;
  border: 1px solid #e4e7ed;
  border-radius: 10px;
  background: #fafafa;
}

.pilot-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.pilot-name {
  font-size: 14px;
  font-weight: 600;
  color: #4a4a4a;
}

.pilot-progress {
  margin: 12px 0;
}

.pilot-meta {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.pilot-stat {
  text-align: center;
}

.pilot-stat span {
  display: block;
  color: #8c8c8c;
  font-size: 11px;
}

.pilot-stat b {
  font-size: 18px;
  color: #4a4a4a;
}

.pilot-desc {
  margin-top: 10px;
  color: #8c8c8c;
  font-size: 12px;
  line-height: 1.6;
}

.pilot-steps {
  margin-bottom: 18px;
}
</style>