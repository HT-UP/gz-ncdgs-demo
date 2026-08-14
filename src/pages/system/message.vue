<template>
  <div class="standard-page">
    <el-card shadow="never">
      <div class="panel-header">
        消息通知管理
        <div class="panel-actions">
          <el-button type="primary" plain>发送新通知</el-button>
        </div>
      </div>

      <el-row :gutter="16">
        <el-col v-for="m in msgStats" :key="m.name" :xs="12" :md="6">
          <div class="msg-stat">
            <div class="msg-stat-name">{{ m.name }}</div>
            <div class="msg-stat-val" :style="{ color: m.color }">{{ m.val }}</div>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <el-card shadow="never">
      <div class="panel-header">消息中心</div>
      <el-table :data="messages" stripe height="380">
        <el-table-column prop="title" label="消息标题" min-width="220" show-overflow-tooltip />
        <el-table-column prop="category" label="分类" width="110">
          <template #default="{ row }">
            <el-tag size="small" effect="plain">{{ row.category }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="渠道" width="150">
          <template #default="{ row }">
            <div class="ch-tags">
              <el-tag v-for="c in row.channels" :key="c" size="small" effect="light" type="info">{{ c }}</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="targets" label="发送对象" min-width="160" show-overflow-tooltip />
        <el-table-column prop="time" label="发送时间" width="140" />
        <el-table-column prop="status" label="状态" width="90">
          <template #default="{ row }">
            <el-tag :type="row.status === '已送达' ? 'success' : 'warning'" size="small" effect="light">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-card shadow="never">
      <div class="panel-header">
        通知模板与个人偏好
        <div class="panel-actions">
          <el-button type="primary" plain size="small">新建模板</el-button>
        </div>
      </div>
      <el-row :gutter="16">
        <el-col :xs="24" :md="12">
          <div class="sub-title">通知模板</div>
          <div class="tpl-list">
            <div v-for="t in tpls" :key="t.name" class="tpl-item">
              <span class="tpl-name">{{ t.name }}</span>
              <el-tag size="small" effect="plain" type="info">{{ t.channel }}</el-tag>
              <el-button link type="primary" size="small">编辑</el-button>
            </div>
          </div>
        </el-col>
        <el-col :xs="24" :md="12">
          <div class="sub-title">个人通知偏好</div>
          <el-form label-width="110px" class="pref-form">
            <el-form-item label="质量告警">
              <el-switch v-model="prefs.quality" />
            </el-form-item>
            <el-form-item label="权限变更">
              <el-switch v-model="prefs.perm" />
            </el-form-item>
            <el-form-item label="订阅推送">
              <el-switch v-model="prefs.sub" />
            </el-form-item>
            <el-form-item label="邮件汇总">
              <el-switch v-model="prefs.email" />
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const msgStats = [
  { name: '今日发送', val: 186, color: '#2b6cb0' },
  { name: '站内信', val: 128, color: '#00a854' },
  { name: '邮件', val: 58, color: '#ed7b2f' },
  { name: '待重试', val: 3, color: '#e34d59' },
]

const messages = ref([
  { title: '客流断面表质量告警：空值率 8.6%', category: '质量告警', channels: ['站内信', '邮件'], targets: '表责任人（4 人）', time: '2026-06-15 22:10', status: '已送达' },
  { title: '权限变更通知：脱敏查看授权', category: '权限变更', channels: ['站内信'], targets: '申请人王数据', time: '2026-06-16 09:20', status: '已送达' },
  { title: '元数据版本发布：v2.4.1', category: '版本通知', channels: ['站内信', '邮件'], targets: '表/字段责任人 26 人', time: '2026-06-10 15:30', status: '已送达' },
  { title: '周度质量报告已生成', category: '报告推送', channels: ['邮件'], targets: '管理层 6 人', time: '2026-06-12 09:02', status: '待重试' },
])

const tpls = [
  { name: '质量告警通知模板', channel: '站内信 + 邮件' },
  { name: '权限审批结果模板', channel: '站内信' },
  { name: '版本发布通知模板', channel: '站内信 + 邮件' },
  { name: '周报推送模板', channel: '邮件' },
]

const prefs = ref({ quality: true, perm: true, sub: true, email: false })
</script>

<style scoped>
.standard-page {
  display: grid;
  gap: 16px;
}

.msg-stat {
  padding: 14px 16px;
  background: #fafafa;
  border: 1px solid #edf0f5;
  border-radius: 10px;
}

.msg-stat-name {
  color: #8c8c8c;
  font-size: 12px;
}

.msg-stat-val {
  margin-top: 4px;
  font-size: 24px;
  font-weight: 700;
}

.ch-tags {
  display: flex;
  gap: 4px;
}

.sub-title {
  font-size: 13px;
  font-weight: 600;
  color: #4a4a4a;
  margin-bottom: 12px;
  padding-left: 10px;
  border-left: 3px solid #da251d;
}

.tpl-list {
  display: grid;
  gap: 8px;
}

.tpl-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border: 1px solid #edf0f5;
  border-radius: 8px;
  background: #fafafa;
}

.tpl-name {
  flex: 1;
  min-width: 0;
  font-size: 13px;
  color: #4a4a4a;
}

.pref-form {
  max-width: 460px;
}
</style>