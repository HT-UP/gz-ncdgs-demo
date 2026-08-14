<template>
  <div class="standard-page">
    <el-card shadow="never">
      <div class="panel-header">
        流程断点调试
        <div class="panel-actions">
          <el-button type="primary" plain @click="startDebug">开始调试</el-button>
          <el-button type="success" plain :disabled="!paused" @click="resume">继续运行</el-button>
          <el-button plain :disabled="!paused" @click="stopDebug">结束调试</el-button>
        </div>
      </div>

      <div class="debug-stage">
        <div
          v-for="(n, i) in nodes"
          :key="n.id"
          class="dbg-node"
          :class="{ current: i === currentIndex, done: i < currentIndex, paused: i === currentIndex && paused }"
        >
          <div class="dbg-dot">{{ i + 1 }}</div>
          <div class="dbg-name">{{ n.name }}</div>
          <el-tag v-if="n.breakpoint" size="small" type="warning" effect="light" class="bp-tag">断点</el-tag>
          <div v-if="i === currentIndex && paused" class="paused-flag">已暂停</div>
        </div>
      </div>

      <el-alert
        v-if="paused"
        title="已命中断点：DWD 清洗算子 —— 可查看当前中间数据，或选择「单步执行 / 继续运行 / 结束调试」"
        type="warning"
        :closable="false"
        show-icon
        class="mb-16"
      />

      <div class="debug-panel" :class="{ dim: !paused }">
        <el-row :gutter="16">
          <el-col :xs="24" :md="12">
            <div class="panel-header">断点列表</div>
            <el-table :data="breakpoints" size="small" height="200">
              <el-table-column prop="node" label="节点" width="120" />
              <el-table-column prop="type" label="断点类型" width="110" />
              <el-table-column prop="cond" label="条件" min-width="180" show-overflow-tooltip />
              <el-table-column label="命中次数" width="80" />
            </el-table>
          </el-col>
          <el-col :xs="24" :md="12">
            <div class="panel-header">中间数据预览</div>
            <el-table :data="previewRows" size="small" height="200">
              <el-table-column prop="station" label="站点" width="90" />
              <el-table-column prop="passengers" label="客运量" width="90" />
              <el-table-column prop="status" label="状态" width="80" />
              <el-table-column prop="ts" label="时间戳" min-width="120" />
            </el-table>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const nodes = [
  { id: 'src', name: 'ODS 读取', breakpoint: false },
  { id: 'filter', name: '数据过滤', breakpoint: false },
  { id: 'clean', name: 'DWD 清洗算子', breakpoint: true },
  { id: 'join', name: '维度关联', breakpoint: false },
  { id: 'write', name: '结果写入', breakpoint: false },
]

const currentIndex = ref(-1)
const paused = ref(false)
const breakpoints = [
  { node: 'DWD 清洗算子', type: '条件断点', cond: 'passengers > 5000', hit: 2 },
  { node: '维度关联', type: '行断点', cond: '第 10000 行', hit: 0 },
]

const previewRows = [
  { station: 'S0111', passengers: 8260, status: '正常', ts: '2026-06-16 10:00:00' },
  { station: 'S0112', passengers: 5230, status: '正常', ts: '2026-06-16 10:00:00' },
  { station: 'S0113', passengers: 1280, status: '待清洗', ts: '2026-06-16 10:00:00' },
]

function startDebug() {
  currentIndex.value = 0
  paused.value = false
}

function resume() {
  if (currentIndex.value < nodes.length - 1) {
    currentIndex.value += 1
  }
  paused.value = false
}

function stopDebug() {
  currentIndex.value = -1
  paused.value = false
}
</script>

<style scoped>
.standard-page {
  display: grid;
  gap: 16px;
}

.debug-stage {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding: 14px 0 6px;
}

.dbg-node {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border: 1px solid #e4e7ed;
  border-radius: 10px;
  background: #fafafa;
}

.dbg-node.done {
  border-color: #00a854;
  background: rgba(0, 168, 84, 0.05);
}

.dbg-node.current {
  border-color: #da251d;
  box-shadow: 0 0 0 2px rgba(218, 37, 29, 0.15);
}

.dbg-dot {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #e4e7ed;
  color: #8c8c8c;
  display: grid;
  place-items: center;
  font-size: 12px;
  font-weight: 700;
}

.dbg-node.done .dbg-dot {
  background: #00a854;
  color: #fff;
}

.dbg-node.current .dbg-dot {
  background: #da251d;
  color: #fff;
}

.dbg-name {
  font-size: 13px;
  font-weight: 600;
  color: #4a4a4a;
}

.paused-flag {
  position: absolute;
  top: -9px;
  right: -6px;
  background: #e34d59;
  color: #fff;
  font-size: 10px;
  padding: 1px 6px;
  border-radius: 8px;
}

.debug-panel {
  transition: opacity 0.2s;
}

.debug-panel.dim {
  opacity: 0.45;
}

.mb-16 {
  margin-bottom: 16px;
}
</style>