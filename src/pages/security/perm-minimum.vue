<template>
  <div class="standard-page">
    <el-card shadow="never">
      <div class="panel-header">
        权限申请最小权限建议
        <div class="panel-actions">
          <el-button type="primary" plain>创建权限申请</el-button>
        </div>
      </div>

      <el-row :gutter="16">
        <el-col :xs="24" :md="8">
          <div class="panel-header">申请引导</div>
          <div class="guide-list">
            <div v-for="(g, i) in guides" :key="i" class="guide-item">
              <span class="guide-no">{{ i + 1 }}</span>
              <div class="guide-body">
                <div class="guide-title">{{ g.title }}</div>
                <div class="guide-desc">{{ g.desc }}</div>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :xs="24" :md="16">
          <div class="panel-header">最小权限建议卡</div>
          <el-table :data="suggestions" stripe height="340">
            <el-table-column prop="asset" label="资产" min-width="160" show-overflow-tooltip />
            <el-table-column prop="role" label="申请角色" width="110" />
            <el-table-column label="建议范围" min-width="160" show-overflow-tooltip>
              <template #default="{ row }">{{ row.scope }}</template>
            </el-table-column>
            <el-table-column label="建议期限" width="100">
              <template #default="{ row }">{{ row.duration }}</template>
            </el-table-column>
            <el-table-column label="审批提示" min-width="140" show-overflow-tooltip>
              <template #default="{ row }">{{ row.hint }}</template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-card>

    <el-card shadow="never">
      <div class="panel-header">定期复核</div>
      <el-table :data="reviews" stripe height="220">
        <el-table-column prop="user" label="用户" width="110" />
        <el-table-column prop="asset" label="持有资产权限" min-width="180" show-overflow-tooltip />
        <el-table-column label="最近使用" width="110">
          <template #default="{ row }">{{ row.lastUse }}</template>
        </el-table-column>
        <el-table-column label="复核建议" min-width="200" show-overflow-tooltip>
          <template #default="{ row }">{{ row.suggest }}</template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default>
            <el-button link type="primary" size="small">发起回收</el-button>
            <el-button link type="info" size="small">延长期限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const guides = [
  { title: '明确使用场景', desc: '选择业务场景而非通用授权，如「报表取数」' },
  { title: '选择最小权限', desc: '只勾选完成任务所需的表与操作' },
  { title: '设置合理期限', desc: '临时需求建议 7-30 天短期授权' },
  { title: '勾选脱敏要求', desc: '非必要不申请原始敏感字段' },
]

const suggestions = [
  { asset: 'ods_employee_profile', role: '数据分析师', scope: '仅 user_id / dept 字段（脱敏）', duration: '30 天', hint: '申请原始字段将被拦截' },
  { asset: 'dwd_ticket_clear_clean', role: '报表开发', scope: 'SELECT + 导出（脱敏模式）', duration: '90 天', hint: '清分比例字段需部门审批' },
  { asset: 'ods_flow_section', role: '运营分析', scope: 'SELECT（全字段）', duration: '180 天', hint: '低敏感，常规审批' },
  { asset: 'cert_key_config', role: '运维', scope: '仅只读，不含密钥明文', duration: '7 天', hint: '每次变更需单独审批' },
]

const reviews = ref([
  { user: '王数据', asset: 'ods_employee_profile（4 表）', lastUse: '2026-04-12', suggest: '超 60 天未使用，建议回收' },
  { user: '李开发', asset: 'cert_key_config', lastUse: '2026-06-14', suggest: '到期自动复核' },
  { user: '赵分析', asset: 'dwd_ticket_clear_clean', lastUse: '2026-06-16', suggest: '权限范围合理，续期' },
])
</script>

<style scoped>
.standard-page {
  display: grid;
  gap: 16px;
}

.guide-list {
  display: grid;
  gap: 12px;
}

.guide-item {
  display: flex;
  gap: 10px;
}

.guide-no {
  width: 24px;
  height: 24px;
  flex: none;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: rgba(218, 37, 29, 0.1);
  color: #da251d;
  font-size: 13px;
  font-weight: 700;
}

.guide-body {
  min-width: 0;
}

.guide-title {
  font-size: 13px;
  font-weight: 600;
  color: #4a4a4a;
}

.guide-desc {
  margin-top: 2px;
  color: #8c8c8c;
  font-size: 12px;
  line-height: 1.6;
}
</style>