<template>
  <div class="standard-page">
    <el-card shadow="never">
      <div class="panel-header">
        网络与主机安全
        <div class="panel-actions">
          <el-button type="primary" plain>导出安全报告</el-button>
        </div>
      </div>

      <el-tabs v-model="activeTab">
        <el-tab-pane label="网络安全设计" name="net">
          <div class="tab-inner">
            <el-row :gutter="16">
              <el-col :xs="24" :md="8">
                <div class="panel-title">HTTPS 与传输安全</div>
                <div class="net-card">
                  <div class="net-item"><span>TLS 版本</span><el-tag size="small" type="success" effect="light">TLS 1.3</el-tag></div>
                  <div class="net-item"><span>证书管理</span><el-tag size="small" type="success" effect="light">自动续期</el-tag></div>
                  <div class="net-item"><span>覆盖率</span><b>100%</b></div>
                </div>
              </el-col>
              <el-col :xs="24" :md="8">
                <div class="panel-title">网络分区</div>
                <div class="zone-list">
                  <div v-for="z in zones" :key="z.name" class="zone-item">
                    <span class="zone-dot" :style="{ background: z.color }"></span>
                    <span class="zone-name">{{ z.name }}</span>
                    <span class="zone-desc">{{ z.desc }}</span>
                  </div>
                </div>
              </el-col>
              <el-col :xs="24" :md="8">
                <div class="panel-title">边界防护</div>
                <div class="border-list">
                  <div v-for="b in borders" :key="b.name" class="border-item">
                    <div class="border-name">{{ b.name }}</div>
                    <div class="border-meta">{{ b.status }}</div>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-tab-pane>
        <el-tab-pane label="主机安全设计" name="host">
          <div class="tab-inner">
            <el-table :data="hosts" stripe height="340">
              <el-table-column prop="host" label="主机" min-width="150" show-overflow-tooltip />
              <el-table-column prop="os" label="操作系统" width="130" />
              <el-table-column label="安全基线" width="100">
                <template #default>
                  <el-tag size="small" type="success" effect="light">达标</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="访问控制" width="110">
                <template #default>
                  <el-tag size="small" type="primary" effect="light">堡垒机</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="服务精简" width="110">
                <template #default="{ row }">{{ row.services }} 项</template>
              </el-table-column>
              <el-table-column label="补丁状态" min-width="150">
                <template #default="{ row }">
                  <el-progress :percentage="row.patch" :color="row.patch === 100 ? '#00a854' : '#ed7b2f'" :stroke-width="8" />
                </template>
              </el-table-column>
              <el-table-column label="防病毒" width="90">
                <template #default>
                  <el-tag size="small" type="success" effect="light">已部署</el-tag>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
        <el-tab-pane label="资源控制设计" name="res">
          <div class="tab-inner">
            <div class="res-grid">
              <div v-for="r in resControls" :key="r.name" class="res-card">
                <div class="res-title">{{ r.name }}</div>
                <div class="res-desc">{{ r.desc }}</div>
                <div class="res-limit"><el-tag size="small" type="primary" effect="plain">{{ r.limit }}</el-tag></div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const activeTab = ref('net')

const zones = [
  { name: 'DMZ 区', desc: '对外服务隔离', color: '#2b6cb0' },
  { name: '应用区', desc: 'Web/接口应用', color: '#00a854' },
  { name: '数据区', desc: '数据库/数仓', color: '#ed7b2f' },
  { name: '管理区', desc: '运维管理通道', color: '#8b5cf6' },
]

const borders = [
  { name: '下一代防火墙', status: '双活部署 · 规则 126 条' },
  { name: 'WAF', status: 'Web 防护 · 拦截率 99.2%' },
  { name: 'DDoS 防护', status: '清洗能力 40Gbps' },
]

const hosts = [
  { host: 'db-master-01', os: 'CentOS 7.9', services: 9, patch: 100 },
  { host: 'app-node-02', os: 'Ubuntu 22.04', services: 7, patch: 100 },
  { host: 'etl-node-03', os: 'CentOS 7.9', services: 12, patch: 86 },
  { host: 'web-gateway-01', os: 'Ubuntu 22.04', services: 5, patch: 100 },
]

const resControls = [
  { name: 'CPU 配额', desc: '容器与虚拟机按角色分配 CPU 上限', limit: '超限自动限流' },
  { name: '内存限制', desc: '防止单应用耗尽集群内存', limit: '最大 64G' },
  { name: '存储配额', desc: '按目录与账号设置存储限额', limit: '配额告警 80%' },
  { name: '进程与并发限制', desc: '限制单账号进程数/连接数', limit: '连接数 1000' },
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

.panel-title {
  font-size: 13px;
  font-weight: 600;
  color: #4a4a4a;
  margin-bottom: 12px;
  padding-left: 10px;
  border-left: 3px solid #da251d;
}

.net-card {
  display: grid;
  gap: 8px;
}

.net-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 10px;
  background: #fafafa;
  border: 1px solid #edf0f5;
  border-radius: 8px;
  font-size: 12px;
  color: #4a4a4a;
}

.zone-list {
  display: grid;
  gap: 8px;
}

.zone-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  background: #fafafa;
  border: 1px solid #edf0f5;
  border-radius: 8px;
  font-size: 12px;
}

.zone-dot {
  width: 10px;
  height: 10px;
  flex: none;
  border-radius: 50%;
}

.zone-name {
  flex: none;
  font-weight: 600;
  color: #4a4a4a;
}

.zone-desc {
  margin-left: auto;
  color: #8c8c8c;
}

.border-list {
  display: grid;
  gap: 8px;
}

.border-item {
  padding: 10px;
  background: #fafafa;
  border: 1px solid #edf0f5;
  border-radius: 8px;
}

.border-name {
  font-size: 13px;
  font-weight: 600;
  color: #4a4a4a;
}

.border-meta {
  margin-top: 2px;
  color: #8c8c8c;
  font-size: 12px;
}

.res-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
}

.res-card {
  padding: 14px;
  background: #fafafa;
  border: 1px solid #edf0f5;
  border-radius: 10px;
}

.res-title {
  font-size: 13px;
  font-weight: 600;
  color: #4a4a4a;
}

.res-desc {
  margin: 6px 0 10px;
  color: #8c8c8c;
  font-size: 12px;
  line-height: 1.6;
}
</style>