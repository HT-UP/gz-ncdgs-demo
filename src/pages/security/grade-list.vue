<template>
  <div class="standard-page">
    <el-card shadow="never">
      <div class="panel-header">
        数据资产分级清单
        <div class="panel-actions">
          <el-button type="primary" @click="addVisible = true">新增定级</el-button>
          <el-button type="primary" plain>调整级别</el-button>
          <el-button plain>导出清单</el-button>
        </div>
      </div>

      <div class="grade-sum-grid">
        <div v-for="g in gradeSummary" :key="g.level" class="grade-sum">
          <span class="gs-badge" :style="{ background: g.color }">{{ g.level }}</span>
          <b>{{ g.count }}</b>
          <span class="gs-label">{{ g.name }}</span>
        </div>
      </div>

      <el-table :data="rows" stripe height="400" @selection-change="selection = $event">
        <el-table-column type="selection" width="46" />
        <el-table-column prop="asset" label="资产" min-width="180" show-overflow-tooltip />
        <el-table-column prop="domain" label="业务域" width="110" />
        <el-table-column prop="owner" label="责任人" width="90" />
        <el-table-column label="级别" width="90">
          <template #default="{ row }">
            <span class="lvl-badge" :style="{ background: lvlColor(row.level) }">{{ row.level }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="basis" label="定级依据" min-width="200" show-overflow-tooltip />
        <el-table-column prop="adjusted" label="最近调整" width="110" />
        <el-table-column label="操作" width="100" fixed="right">
          <template #default>
            <el-button link type="primary" size="small">调整</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog v-model="addVisible" title="新增定级" width="480px">
        <el-form label-width="100px">
          <el-form-item label="资产">
            <el-select v-model="addForm.asset" filterable class="w-full" placeholder="选择资产">
              <el-option v-for="a in assetOptions" :key="a" :label="a" :value="a" />
            </el-select>
          </el-form-item>
          <el-form-item label="定级">
            <el-radio-group v-model="addForm.level">
              <el-radio v-for="l in levels" :key="l" :label="l">{{ l }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="定级依据">
            <el-input v-model="addForm.basis" type="textarea" :rows="3" placeholder="填写定级依据" />
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="addVisible = false">取消</el-button>
          <el-button type="primary">提交定级</el-button>
        </template>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const selection = ref([])
const addVisible = ref(false)
const addForm = ref({ asset: '', level: 'L2', basis: '' })
const levels = ['L1', 'L2', 'L3', 'L4']
const assetOptions = ['ods_flow_section_2026', 'dwd_ticket_clear_clean', 'ods_employee_profile']

const gradeSummary = [
  { level: 'L1', name: '公开数据', count: 386, color: '#00a854' },
  { level: 'L2', name: '内部数据', count: 1042, color: '#2b6cb0' },
  { level: 'L3', name: '敏感数据', count: 382, color: '#ed7b2f' },
  { level: 'L4', name: '机密数据', count: 71, color: '#e34d59' },
]

const rows = [
  { asset: 'ods_employee_profile', domain: '人力资源', owner: '王工', level: 'L3', basis: '含手机号/证件号等个人信息', adjusted: '2026-05-20' },
  { asset: 'dwd_ticket_clear_clean', domain: '票务清分', owner: '李工', level: 'L3', basis: '含清分比例可推导经营信息', adjusted: '2026-06-15' },
  { asset: 'cert_key_config', domain: '安全', owner: '管理员', level: 'L4', basis: '核心密钥配置', adjusted: '2026-05-02' },
  { asset: 'ods_flow_section', domain: '运营', owner: '赵工', level: 'L2', basis: '业务统计类数据', adjusted: '2026-04-18' },
  { asset: 'cad_line_10_models', domain: '新线建设', owner: '钱工', level: 'L2', basis: '设计文档（内部）', adjusted: '2026-06-08' },
  { asset: 'ids_dev_config', domain: '开发', owner: '孙工', level: 'L4', basis: '开发环境敏感配置', adjusted: '2026-05-26' },
]

function lvlColor(l: string) {
  return { L1: '#00a854', L2: '#2b6cb0', L3: '#ed7b2f', L4: '#e34d59' }[l]
}
</script>

<style scoped>
.standard-page {
  display: grid;
  gap: 16px;
}

.grade-sum-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
  margin-bottom: 14px;
}

.grade-sum {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: #fafafa;
  border: 1px solid #edf0f5;
  border-radius: 10px;
}

.gs-badge {
  width: 34px;
  height: 22px;
  border-radius: 6px;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  display: grid;
  place-items: center;
}

.grade-sum b {
  font-size: 20px;
  color: #4a4a4a;
}

.gs-label {
  color: #8c8c8c;
  font-size: 12px;
  margin-left: auto;
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
</style>