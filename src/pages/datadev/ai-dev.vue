<template>
  <div class="standard-page">
    <el-card shadow="never">
      <div class="panel-header">
        AI 智能化开发集成
        <div class="panel-actions">
          <el-tag type="success" effect="light">大模型服务 已连接</el-tag>
        </div>
      </div>

      <el-row :gutter="16">
        <el-col :xs="24" :md="12">
          <el-card shadow="never" class="hc">
            <div class="panel-header">自然语言生成 SQL</div>
            <div class="nl-input">
              <el-input v-model="nlText" type="textarea" :rows="4" placeholder="例：统计上周各线路的日均客流，按线路降序排列" />
            </div>
            <div class="nl-actions">
              <el-button type="primary" @click="genSql">生成 SQL</el-button>
              <el-button plain>生成转换规则</el-button>
            </div>
            <div v-if="sqlResult" class="sql-box">
              <div class="sql-head">生成结果 <el-tag size="small" type="success" effect="plain">置信度 0.96</el-tag></div>
              <pre>{{ sqlResult }}</pre>
              <div class="sql-actions">
                <el-button size="small" type="primary" plain>执行</el-button>
                <el-button size="small">保存为任务</el-button>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :xs="24" :md="12">
          <el-card shadow="never" class="hc">
            <div class="panel-header">智能推荐</div>
            <div class="rec-list">
              <div class="rec-item">
                <div class="rec-title">推荐算子：数据清洗</div>
                <div class="rec-desc">检测到源表含 3 个字段空值率 &gt; 20%，建议添加「缺失值填充」算子</div>
                <el-button size="small" type="primary" plain>一键添加</el-button>
              </div>
              <div class="rec-item">
                <div class="rec-title">异常诊断：任务延迟</div>
                <div class="rec-desc">SIG_信号接口_增量 连续 2 次超时，疑似目标表锁竞争</div>
                <el-button size="small" type="primary" plain>查看诊断</el-button>
              </div>
              <div class="rec-item">
                <div class="rec-title">表关联推荐</div>
                <div class="rec-desc">flow_section 与 station_dim 存在 92% 字段相似度，可自动关联</div>
                <el-button size="small" type="primary" plain>建立关联</el-button>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const nlText = ref('')
const sqlResult = ref('')

function genSql() {
  if (!nlText.value.trim()) {
    ElMessage.warning('请输入自然语言描述')
    return
  }
  sqlResult.value = `SELECT
    l.line_name,
    ROUND(AVG(s.section_passengers) / 10000, 2) AS avg_daily_wan
FROM dws_flow_section_daily s
JOIN dim_line l ON s.line_id = l.line_id
WHERE s.stat_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
GROUP BY l.line_name
ORDER BY avg_daily_wan DESC`
  ElMessage.success('SQL 生成成功')
}
</script>

<style scoped>
.standard-page {
  display: grid;
  gap: 16px;
}

.hc {
  height: 100%;
}

.nl-input {
  margin-bottom: 10px;
}

.nl-actions {
  display: flex;
  gap: 10px;
}

.sql-box {
  margin-top: 14px;
  padding: 12px;
  background: #2d2f33;
  border-radius: 8px;
}

.sql-head {
  color: #d9e0ea;
  font-size: 12px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sql-box pre {
  margin: 0;
  color: #7dd3fc;
  font-size: 12px;
  line-height: 1.7;
  font-family: Consolas, Menlo, monospace;
  white-space: pre-wrap;
  word-break: break-all;
}

.sql-actions {
  margin-top: 10px;
}

.rec-list {
  display: grid;
  gap: 10px;
}

.rec-item {
  padding: 12px;
  border: 1px solid #edf0f5;
  border-radius: 10px;
  background: #fafafa;
}

.rec-title {
  font-size: 13px;
  font-weight: 600;
  color: #4a4a4a;
}

.rec-desc {
  margin: 6px 0 10px;
  color: #8c8c8c;
  font-size: 12px;
  line-height: 1.7;
}
</style>