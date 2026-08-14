<template>
  <div class="standard-page">
    <el-card shadow="never">
      <div class="panel-header">
        安全审计分析
        <div class="panel-actions">
          <el-button type="primary" plain>导出审计报告</el-button>
        </div>
      </div>

      <el-tabs v-model="activeTab">
        <el-tab-pane label="登录分析" name="login">
          <div class="tab-inner">
            <el-row :gutter="16">
              <el-col v-for="m in loginMetrics" :key="m.name" :xs="12" :md="6">
                <div class="ana-card">
                  <div class="ana-name">{{ m.name }}</div>
                  <div class="ana-val" :style="{ color: m.color }">{{ m.val }}</div>
                  <div class="ana-desc">{{ m.desc }}</div>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-tab-pane>
        <el-tab-pane label="访问分析" name="access">
          <div class="tab-inner">
            <div class="ana-table">
              <el-table :data="accessLogs" stripe height="300">
                <el-table-column prop="asset" label="访问对象" min-width="180" show-overflow-tooltip />
                <el-table-column prop="times" label="访问次数" width="100" />
                <el-table-column prop="users" label="访问用户" width="100" />
                <el-table-column prop="trend" label="趋势" min-width="160">
                  <template #default>
                    <div class="mini-trend"><i v-for="n in 7" :key="n" :style="{ height: `${10 + Math.random() * 40}%` }"></i></div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="权限分析" name="perm">
          <div class="tab-inner">
            <el-table :data="permLogs" stripe height="300">
              <el-table-column prop="user" label="用户" width="110" />
              <el-table-column prop="action" label="权限操作" min-width="200" show-overflow-tooltip />
              <el-table-column prop="target" label="对象" min-width="160" show-overflow-tooltip />
              <el-table-column prop="time" label="时间" width="150" />
              <el-table-column prop="result" label="结果" width="90">
                <template #default="{ row }">
                  <el-tag :type="row.result === '成功' ? 'success' : 'danger'" size="small" effect="light">{{ row.result }}</el-tag>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
        <el-tab-pane label="异常识别" name="anomaly">
          <div class="tab-inner">
            <el-table :data="anomalies" stripe height="300">
              <el-table-column prop="type" label="异常类型" width="130" />
              <el-table-column prop="desc" label="异常描述" min-width="240" show-overflow-tooltip />
              <el-table-column prop="count" label="次数" width="90" />
              <el-table-column label="风险等级" width="100">
                <template #default="{ row }">
                  <el-tag :type="row.risk === '高' ? 'danger' : 'warning'" size="small" effect="light">{{ row.risk }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="处置建议" min-width="180" show-overflow-tooltip>
                <template #default="{ row }">{{ row.suggest }}</template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <el-card shadow="never">
      <div class="panel-header">
        审计报告与保障
        <div class="panel-actions">
          <el-button type="primary" plain size="small">生成月度报告</el-button>
        </div>
      </div>
      <div class="report-cards">
        <div v-for="r in reports" :key="r.name" class="report-card">
          <div class="report-name">{{ r.name }}</div>
          <div class="report-meta">{{ r.range }} · {{ r.format }}</div>
          <el-button size="small" type="primary" plain>下载</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const activeTab = ref('login')

const loginMetrics = [
  { name: '登录总数（周）', val: '18.6k', color: '#2b6cb0', desc: '正常登录 18.3k' },
  { name: '失败登录', val: 312, color: '#ed7b2f', desc: '环比 -12%' },
  { name: '异常登录', val: 6, color: '#e34d59', desc: '已全部阻断' },
  { name: '账号爆破尝试', val: 48, color: '#da251d', desc: '来源 IP 12 个' },
]

const accessLogs = ref([
  { asset: 'dwd_ticket_clear_clean', times: 2860, users: 24 },
  { asset: 'ods_flow_section', times: 1980, users: 18 },
  { asset: 'cert_key_config', times: 120, users: 5 },
  { asset: 'ods_employee_profile', times: 460, users: 12 },
])

const permLogs = ref([
  { user: '王数据', action: '授权变更：新增脱敏查看', target: 'dwd_ticket_clear_clean', time: '2026-06-16 09:20', result: '成功' },
  { user: '管理员', action: '临时提权：恢复被锁账号', target: 'system_account', time: '2026-06-15 23:48', result: '成功' },
  { user: '李开发', action: '尝试越权：读取 L4 密钥', target: 'cert_key_config', time: '2026-06-15 20:12', result: '失败' },
])

const anomalies = ref([
  { type: '越权访问', desc: '非授权用户访问 L4 数据', count: 3, risk: '高', suggest: '阻断 + 权限复核' },
  { type: '异常时段操作', desc: '凌晨 02:00-05:00 批量导出', count: 5, risk: '中', suggest: '确认任务来源' },
  { type: '账号复用', desc: '多台主机使用同一账号', count: 8, risk: '中', suggest: '拆分账号' },
])

const reports = [
  { name: '2026 年 5 月安全审计月报', range: '2026-05-01 ~ 2026-05-31', format: 'PDF · 2.8MB' },
  { name: '2026 年第 24 周安全审计周报', range: '2026-06-08 ~ 2026-06-14', format: 'PDF · 1.2MB' },
  { name: '越权与异常操作专项报告', range: '2026-06-01 ~ 2026-06-15', format: 'Excel · 0.6MB' },
]
</script>

<style scoped>
.standard-page {
  display: grid;
  gap: 16px;
}

.tab-inner {
  padding-top: 6px;
}

.ana-card {
  padding: 14px 16px;
  background: #fafafa;
  border: 1px solid #edf0f5;
  border-radius: 10px;
}

.ana-name {
  color: #8c8c8c;
  font-size: 12px;
}

.ana-val {
  margin-top: 4px;
  font-size: 24px;
  font-weight: 700;
}

.ana-desc {
  margin-top: 2px;
  color: #8c8c8c;
  font-size: 11px;
}

.mini-trend {
  display: flex;
  align-items: flex-end;
  gap: 3px;
  height: 24px;
}

.mini-trend i {
  width: 6px;
  border-radius: 2px;
  background: #da251d;
}

.report-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 12px;
}

.report-card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 14px;
  background: #fafafa;
  border: 1px solid #edf0f5;
  border-radius: 10px;
}

.report-name {
  font-size: 13px;
  font-weight: 600;
  color: #4a4a4a;
}

.report-meta {
  color: #8c8c8c;
  font-size: 12px;
}
</style>