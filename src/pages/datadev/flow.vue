<template>
  <div class="standard-page">
    <el-row :gutter="16">
      <el-col :span="5">
        <el-card class="panel-card dashboard-card" shadow="never">
          <template #header>
            <div class="panel-header">
              <span>节点组件</span>
            </div>
          </template>
          <div class="flow-node-palette">
            <div
              v-for="nodeType in nodeTypes"
              :key="nodeType.type"
              class="flow-palette-item"
              :style="{ borderColor: nodeType.color, color: nodeType.color }"
            >
              <span class="flow-palette-dot" :style="{ background: nodeType.color }"></span>
              <span>{{ nodeType.label }}</span>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="14">
        <el-card class="panel-card dashboard-card" shadow="never">
          <template #header>
            <div class="panel-header">
              <span>流程编排画布</span>
              <div class="panel-actions">
                <el-select v-model="flowVersion" size="small" class="version-select">
                  <el-option v-for="version in flowVersions" :key="version" :label="version" :value="version" />
                </el-select>
                <el-button size="small" @click="saveFlow">保存</el-button>
                <el-button size="small" type="danger" @click="debugFlow">断点调试</el-button>
              </div>
            </div>
          </template>
          <div class="canvas-wrap flow-canvas">
            <div
              v-for="node in flowNodes"
              :key="node.id"
              class="flow-node"
              :style="{ top: `${node.y}px`, left: `${node.x}px`, borderColor: node.color }"
              :class="{ 'is-selected': selectedNode?.id === node.id }"
              @click="selectedNode = node"
            >
              <div class="flow-node-title" :style="{ background: node.color }">
                <span>{{ node.label }}</span>
              </div>
              <div class="flow-node-status">
                <el-tag size="small" effect="plain" :type="node.status === '成功' ? 'success' : node.status === '失败' ? 'danger' : 'info'">
                  {{ node.status }}
                </el-tag>
              </div>
            </div>
            <svg class="flow-svg">
              <line
                v-for="edge in flowEdges"
                :key="edge.id"
                :x1="edge.fromX"
                :y1="edge.fromY"
                :x2="edge.toX"
                :y2="edge.toY"
                stroke="#A9B4C4"
                stroke-width="2"
                stroke-dasharray="6 4"
              />
            </svg>
          </div>
        </el-card>
      </el-col>

      <el-col :span="5">
        <el-card class="panel-card dashboard-card" shadow="never">
          <template #header>
            <div class="panel-header">
              <span>节点属性</span>
            </div>
          </template>
          <div v-if="selectedNode" class="property-form">
            <el-form label-width="70px" label-position="left">
              <el-form-item label="节点名称">
                <el-input v-model="selectedNode.label" />
              </el-form-item>
              <el-form-item label="节点类型">
                <el-input :model-value="selectedNode.typeLabel" disabled />
              </el-form-item>
              <el-form-item label="执行参数">
                <el-input v-model="selectedNode.params" type="textarea" :rows="4" />
              </el-form-item>
            </el-form>
            <el-button type="danger" class="w-full" @click="runNode">单步执行</el-button>
          </div>
          <el-empty v-else description="点击画布节点进行配置" :image-size="80" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'

type FlowNodeItem = {
  id: string
  label: string
  typeLabel: string
  color: string
  x: number
  y: number
  status: '成功' | '失败' | '未执行'
  params: string
}

const nodeTypes = [
  { type: 'batch', label: '批处理节点', color: '#2B6CB0' },
  { type: 'stream', label: '流处理节点', color: '#00A854' },
  { type: 'script', label: '脚本节点', color: '#ED7B2F' },
  { type: 'quality', label: '质量检查节点', color: '#DA251D' },
  { type: 'notify', label: '通知节点', color: '#9B59B6' },
  { type: 'branch', label: '条件分支', color: '#8C8C8C' },
  { type: 'loop', label: '循环节点', color: '#5B8DEF' },
]

const flowVersions = ref(['V2.3', 'V2.2', 'V2.1'])
const flowVersion = ref('V2.3')
const selectedNode = ref<FlowNodeItem | null>(null)

const flowNodes = ref<FlowNodeItem[]>([
  { id: 'n1', label: '票务数据同步', typeLabel: '批处理节点', color: '#2B6CB0', x: 30, y: 60, status: '成功', params: 'source=ticket_core\ntarget=ODS' },
  { id: 'n2', label: '数据清洗脚本', typeLabel: '脚本节点', color: '#ED7B2F', x: 290, y: 60, status: '成功', params: 'python clean.py' },
  { id: 'n3', label: '质量检查', typeLabel: '质量检查节点', color: '#DA251D', x: 550, y: 60, status: '成功', params: 'rules=QR-001,QR-006' },
  { id: 'n4', label: '客流实时汇聚', typeLabel: '流处理节点', color: '#00A854', x: 290, y: 250, status: '未执行', params: 'window=5min' },
  { id: 'n5', label: '通知运维', typeLabel: '通知节点', color: '#9B59B6', x: 550, y: 250, status: '未执行', params: 'channel=站内/邮件' },
])

const flowEdges = [
  { id: 'e1', fromX: 190, fromY: 100, toX: 290, toY: 100 },
  { id: 'e2', fromX: 450, fromY: 100, toX: 550, toY: 100 },
  { id: 'e3', fromX: 450, fromY: 100, toX: 290, toY: 250 },
  { id: 'e4', fromX: 450, fromY: 290, toX: 550, toY: 290 },
]

const saveFlow = () => {
  ElMessage.success('流程已保存（Mock）')
}

const debugFlow = () => {
  ElMessage.success('断点调试模式已开启，可单步执行节点（Mock）')
}

const runNode = () => {
  if (!selectedNode.value) return
  selectedNode.value.status = '成功'
  ElMessage.success(`节点「${selectedNode.value.label}」执行成功（Mock）`)
}
</script>
