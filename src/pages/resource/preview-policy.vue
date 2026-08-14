<template>
  <div class="standard-page">
    <el-card shadow="never">
      <div class="panel-header">
        数据分级预览策略
        <div class="panel-actions">
          <el-button type="primary" plain>策略调整</el-button>
        </div>
      </div>

      <el-table :data="levels" stripe height="300">
        <el-table-column label="级别" width="90">
          <template #default="{ row }">
            <span class="lvl-badge" :style="{ background: row.color }">{{ row.level }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="级别名称" min-width="130" show-overflow-tooltip />
        <el-table-column prop="preview" label="预览策略" min-width="220" show-overflow-tooltip />
        <el-table-column prop="apply" label="审批要求" min-width="180" show-overflow-tooltip />
        <el-table-column prop="note" label="说明" min-width="180" show-overflow-tooltip />
      </el-table>
    </el-card>

    <el-card shadow="never">
      <div class="panel-header">预览效果模拟</div>
      <el-row :gutter="16">
        <el-col v-for="l in previewCards" :key="l.level" :xs="24" :md="6">
          <div class="pv-card">
            <div class="pv-head" :style="{ background: l.color }">{{ l.level }} · {{ l.title }}</div>
            <div class="pv-body">
              <div v-for="(r, i) in l.rows" :key="i" class="pv-row">
                <span>{{ r.label }}</span>
                <b>{{ r.value }}</b>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <el-card shadow="never">
      <div class="panel-header">
        预览记录
        <div class="panel-actions">
          <el-button type="primary" plain size="small">导出审计日志</el-button>
        </div>
      </div>
      <el-table :data="logs" stripe height="240">
        <el-table-column prop="time" label="时间" width="160" />
        <el-table-column prop="user" label="用户" width="110" />
        <el-table-column prop="asset" label="资产" min-width="160" show-overflow-tooltip />
        <el-table-column prop="level" label="数据级别" width="100" />
        <el-table-column prop="mode" label="预览方式" min-width="200" show-overflow-tooltip />
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const levels = [
  { level: 'L1', name: '公开数据', color: '#00a854', preview: '正常预览全部字段', apply: '无需审批', note: '对外可共享' },
  { level: 'L2', name: '内部数据', color: '#2b6cb0', preview: '正常预览，可导出', apply: '登录即可', note: '内部使用' },
  { level: 'L3', name: '敏感数据', color: '#ed7b2f', preview: '强制脱敏预览（手机/证件打码）', apply: '需权限申请', note: '脱敏后可见' },
  { level: 'L4', name: '机密数据', color: '#e34d59', preview: '禁止预览明细，仅可查看统计', apply: '需审批 + 脱敏', note: '最小授权原则' },
]

const previewCards = [
  { level: 'L1', title: '线路基础信息', color: '#00a854', rows: [{ label: '线路编码', value: 'L10' }, { label: '线路名称', value: '十号线' }, { label: '状态', value: '在建' }] },
  { level: 'L2', title: '客流断面统计', color: '#2b6cb0', rows: [{ label: '站点', value: 'S0111' }, { label: '断面客运量', value: '8260' }, { label: '方向', value: '上行' }] },
  { level: 'L3', title: '票务清分明细', color: '#ed7b2f', rows: [{ label: '手机号', value: '138****6821' }, { label: '证件号', value: '44******1990******' }, { label: '金额', value: '28.00' }] },
  { level: 'L4', title: '核心接口密钥', color: '#e34d59', rows: [{ label: '密钥', value: '******' }, { label: '算法', value: 'AES-256' }, { label: '签发人', value: '***' }] },
]

const logs = ref([
  { time: '2026-06-16 09:24:12', user: '王数据', asset: 'dwd_ticket_clear_clean', level: 'L3', mode: '脱敏预览（4 字段）' },
  { time: '2026-06-16 08:51:02', user: '李开发', asset: 'ods_flow_section', level: 'L2', mode: '正常预览' },
  { time: '2026-06-15 17:33:41', user: '赵分析', asset: 'cert_key_config', level: 'L4', mode: '审批通过后统计预览' },
])
</script>

<style scoped>
.standard-page {
  display: grid;
  gap: 16px;
}

.lvl-badge {
  display: inline-grid;
  place-items: center;
  min-width: 34px;
  height: 22px;
  border-radius: 6px;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
}

.pv-card {
  border: 1px solid #e4e7ed;
  border-radius: 10px;
  overflow: hidden;
  height: 100%;
}

.pv-head {
  color: #fff;
  padding: 8px 12px;
  font-size: 13px;
  font-weight: 600;
}

.pv-body {
  padding: 10px 12px;
  display: grid;
  gap: 6px;
}

.pv-row {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #4a4a4a;
  padding: 4px 0;
  border-bottom: 1px dashed #edf0f5;
}

.pv-row:last-child {
  border-bottom: none;
}
</style>