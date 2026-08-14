<template>
  <div class="standard-page">
    <el-card shadow="never">
      <div class="panel-header">
        数据源批量注册
        <div class="panel-actions">
          <el-button type="primary" @click="downloadTemplate">{{ tpl.templateName }}</el-button>
          <el-button type="primary">导入 Excel</el-button>
        </div>
      </div>

      <el-steps :active="step" finish-status="success" align-center class="reg-steps">
        <el-step v-for="s in regSteps" :key="s.title" :title="s.title" :description="s.desc" />
      </el-steps>

      <el-tabs v-model="activeTab">
        <el-tab-pane label="导入清单" name="list">
          <el-table :data="rows" stripe height="380">
            <el-table-column type="index" width="50" />
            <el-table-column prop="name" label="数据源名称" min-width="150" show-overflow-tooltip />
            <el-table-column prop="type" label="类型" width="110" />
            <el-table-column prop="host" label="地址" min-width="140" show-overflow-tooltip />
            <el-table-column prop="db" label="实例/库" min-width="110" show-overflow-tooltip />
            <el-table-column label="校验结果" width="110">
              <template #default="{ row }">
                <el-tag :type="row.check === '通过' ? 'success' : 'danger'" effect="light" size="small">{{ row.check }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="message" label="校验说明" min-width="160" show-overflow-tooltip />
            <el-table-column label="操作" width="70" fixed="right">
              <template #default>
                <el-button link type="primary" size="small">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="分组设置" name="group">
          <div class="group-panel">
            <el-table :data="rows" stripe height="320">
              <el-table-column prop="name" label="数据源名称" min-width="150" show-overflow-tooltip />
              <el-table-column label="归属分组" min-width="220">
                <template #default>
                  <el-select placeholder="选择分组" class="w-full">
                    <el-option v-for="g in groups" :key="g" :label="g" :value="g" />
                  </el-select>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
        <el-tab-pane label="注册报告" name="report">
          <div class="report-body">
            <el-row :gutter="16">
              <el-col :xs="12" :md="6">
                <div class="report-stat">
                  <div class="report-stat-value" style="color: #2b6cb0">24</div>
                  <div class="report-stat-label">导入总数</div>
                </div>
              </el-col>
              <el-col :xs="12" :md="6">
                <div class="report-stat">
                  <div class="report-stat-value" style="color: #00a854">21</div>
                  <div class="report-stat-label">注册成功</div>
                </div>
              </el-col>
              <el-col :xs="12" :md="6">
                <div class="report-stat">
                  <div class="report-stat-value" style="color: #ed7b2f">2</div>
                  <div class="report-stat-label">需人工确认</div>
                </div>
              </el-col>
              <el-col :xs="12" :md="6">
                <div class="report-stat">
                  <div class="report-stat-value" style="color: #e34d59">1</div>
                  <div class="report-stat-label">注册失败</div>
                </div>
              </el-col>
            </el-row>
            <el-table :data="failedRows" stripe class="mt-12" height="200">
              <el-table-column prop="name" label="数据源名称" min-width="150" show-overflow-tooltip />
              <el-table-column prop="fail" label="失败原因" min-width="260" show-overflow-tooltip />
              <el-table-column label="处理建议" width="200">
                <template #default>
                  <el-button link type="primary" size="small">查看错误详情</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const step = ref(1)
const activeTab = ref('list')

const regSteps = [
  { title: '导入 Excel', desc: '批量导入数据源信息' },
  { title: '批量校验', desc: '逐行校验必填与格式' },
  { title: '批量分组', desc: '归属业务分组' },
  { title: '注册报告', desc: '结果汇总与失败处理' },
]

const tpl = { templateName: '下载导入模板' }

const groups = ['运营库组', '采集库组', '分析库组', '归档库组', '接口库组']

const rows = [
  { name: '01号线AFC票务库', type: 'PostgreSQL', host: '10.20.5.10', db: 'afc_l1', check: '通过', message: '连通性正常' },
  { name: '02号线SCADA实时库', type: 'MySQL', host: '10.20.6.12', db: 'scada_l2', check: '通过', message: '连通性正常' },
  { name: '03号线设备状态库', type: 'MySQL', host: '10.20.7.15', db: 'device_l3', check: '通过', message: '连通性正常' },
  { name: '04号线客流断面库', type: 'Doris', host: '10.21.2.20', db: 'flow_l4', check: '通过', message: '连通性正常' },
  { name: '05号线信号接口库', type: 'SQLServer', host: '10.23.1.30', db: 'sig_l5', check: '需确认', message: '主机可达，库名需确认' },
  { name: '06号线安防视频库', type: 'HBase', host: '10.22.4.15', db: 'video_l6', check: '失败', message: '端口不可达' },
]

const failedRows = [
  { name: '06号线安防视频库', fail: 'HBase RegionServer 端口 16020 不可达，请确认网络策略后重试' },
  { name: '05号线信号接口库', fail: '实例库名与连接串不一致，需人工确认库名' },
]

function downloadTemplate() {
  ElMessage.success('已生成批量导入模板（batch-ds-template.xlsx）')
}
</script>

<style scoped>
.standard-page {
  display: grid;
  gap: 16px;
}

.reg-steps {
  margin: 14px 0 18px;
}

.group-panel {
  padding-top: 2px;
}

.report-body {
  padding-top: 6px;
}

.report-stat {
  padding: 16px;
  background: #fafafa;
  border: 1px solid #edf0f5;
  border-radius: 10px;
  text-align: center;
}

.report-stat-value {
  font-size: 26px;
  font-weight: 700;
}

.report-stat-label {
  margin-top: 2px;
  color: #8c8c8c;
  font-size: 12px;
}

.mt-12 {
  margin-top: 12px;
}
</style>