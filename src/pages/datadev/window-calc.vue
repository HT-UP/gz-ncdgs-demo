<template>
  <div class="standard-page">
    <el-card shadow="never">
      <div class="panel-header">
        实时窗口计算
        <div class="panel-actions">
          <el-button type="primary" plain>新建窗口任务</el-button>
        </div>
      </div>

      <el-row :gutter="16">
        <el-col v-for="w in windowTypes" :key="w.name" :xs="24" :md="8">
          <div class="window-card">
            <div class="window-head">
              <span class="window-icon">{{ w.icon }}</span>
              <span class="window-title">{{ w.name }}</span>
            </div>
            <div class="window-desc">{{ w.desc }}</div>
            <div class="window-ops">
              <el-tag v-for="o in w.ops" :key="o" size="small" effect="plain">{{ o }}</el-tag>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <el-card shadow="never">
      <div class="panel-header">
        窗口计算任务
        <div class="panel-actions">
          <el-input v-model="keyword" placeholder="搜索任务" clearable class="search-input" />
        </div>
      </div>
      <el-table :data="tasks" stripe height="360">
        <el-table-column prop="name" label="任务名称" min-width="190" show-overflow-tooltip />
        <el-table-column prop="window" label="窗口类型" width="110" />
        <el-table-column prop="interval" label="窗口大小" width="110" />
        <el-table-column prop="trigger" label="触发频率" width="100" />
        <el-table-column prop="result" label="计算结果" min-width="240" show-overflow-tooltip />
        <el-table-column label="状态" width="90">
          <template #default="{ row }">
            <el-tag :type="row.status === '运行中' ? 'success' : 'info'" effect="light" size="small">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" fixed="right">
          <template #default>
            <el-button link type="primary" size="small">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const windowTypes = [
  { name: '滑动窗口', icon: '⟲', desc: '按固定间隔向前滑动，统计最近 N 分钟数据聚合结果', ops: ['近5分钟客流', '滑动30秒' ] },
  { name: '滚动窗口', icon: '⟳', desc: '按固定周期滚动切分，各周期数据互相独立不重叠', ops: ['每分钟计数', '每小时均值'] },
  { name: '会话窗口', icon: '⇄', desc: '基于事件间隔划分，无活动事件后自动结束会话', ops: ['用户会话', '接口会话'] },
]

const keyword = ref('')

const tasks = [
  { name: '客流断面-每5分钟滑动聚合', window: '滑动窗口', interval: '5 min', trigger: '1 min', result: 'station=s0111, passengers=3260/h', status: '运行中' },
  { name: '设备状态-每分钟滚动计数', window: '滚动窗口', interval: '1 min', trigger: '1 min', result: 'device_count=1862, online=96.2%', status: '运行中' },
  { name: '票务清分-每小时滚动汇总', window: '滚动窗口', interval: '60 min', trigger: '5 min', result: 'amount=128.6万, tickets=4.8万', status: '运行中' },
  { name: '用户会话-活跃度统计', window: '会话窗口', interval: '动态', trigger: '会话结束', result: 'active_users=2830, avg_session=4m12s', status: '运行中' },
]
</script>

<style scoped>
.standard-page {
  display: grid;
  gap: 16px;
}

.window-card {
  padding: 16px;
  border: 1px solid #e4e7ed;
  border-radius: 10px;
  background: #fafafa;
  height: 100%;
}

.window-head {
  display: flex;
  align-items: center;
  gap: 10px;
}

.window-icon {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  display: grid;
  place-items: center;
  background: rgba(218, 37, 29, 0.08);
  color: #da251d;
  font-size: 16px;
}

.window-title {
  font-size: 14px;
  font-weight: 700;
  color: #4a4a4a;
}

.window-desc {
  margin: 10px 0;
  color: #8c8c8c;
  font-size: 12px;
  line-height: 1.7;
  min-height: 42px;
}

.window-ops {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
</style>