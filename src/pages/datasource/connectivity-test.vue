<template>
  <div class="standard-page">
    <el-card shadow="never">
      <div class="panel-header">
        数据源连通性测试
        <div class="panel-actions">
          <el-select v-model="source" placeholder="选择数据源" class="filter-select">
            <el-option v-for="s in sourceOptions" :key="s" :label="s" :value="s" />
          </el-select>
          <el-button type="primary" :loading="testing" @click="runTest">开始测试</el-button>
        </div>
      </div>

      <div class="test-stage">
        <div v-for="(layer, i) in layers" :key="layer.key" class="stage-card" :class="{ done: i < passedCount, current: i === passedCount }">
          <div class="stage-icon">
            <el-icon v-if="i < passedCount"><CircleCheck /></el-icon>
            <el-icon v-else-if="i === passedCount"><Loading /></el-icon>
            <span v-else class="stage-num">{{ i + 1 }}</span>
          </div>
          <div class="stage-name">{{ layer.name }}</div>
          <div class="stage-desc">{{ layer.desc }}</div>
          <div v-if="i < passedCount" class="stage-cost">{{ layer.cost }}ms</div>
          <el-tag v-if="i < passedCount" type="success" size="small" effect="light">通过</el-tag>
          <el-tag v-else-if="i === passedCount && testing" type="primary" size="small" effect="light">测试中</el-tag>
        </div>
      </div>

      <div v-if="passedCount === 0 && !testing" class="idle-tip">
        <el-empty description="选择数据源后点击「开始测试」，将按 网络层 → 认证层 → 连接层 → 权限层 → 数据层 依次验证" :image-size="80" />
      </div>
    </el-card>

    <el-card v-if="passedCount === layers.length" shadow="never">
      <div class="panel-header">测试结果</div>
      <el-result icon="success" title="数据源连通性测试通过" sub-title="五个层级的校验均已完成，连接配置可用">
        <template #extra>
          <div class="result-cells">
            <div v-for="l in layers" :key="l.key" class="result-cell">
              <div class="result-cell-name">{{ l.name }}</div>
              <div class="result-cell-value">{{ l.cost }}ms</div>
            </div>
          </div>
          <el-button type="primary">保存为测试记录</el-button>
        </template>
      </el-result>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { CircleCheck, Loading } from '@element-plus/icons-vue'

const sourceOptions = ['地铁线网运营主库', '客流实时采集库', '运营分析数仓', '设备物联采集域', '票务清分预结算库']
const source = ref('地铁线网运营主库')

type Layer = { key: string; name: string; desc: string; cost: number }

const layers = ref<Layer[]>([
  { key: 'net', name: '网络层', desc: '目标主机 / 端口连通性', cost: 18 },
  { key: 'auth', name: '认证层', desc: '账号密码 / Token 校验', cost: 46 },
  { key: 'conn', name: '连接层', desc: '会话建立与驱动加载', cost: 62 },
  { key: 'perm', name: '权限层', desc: '操作权限 / 白名单校验', cost: 35 },
  { key: 'data', name: '数据层', desc: '元数据读取与基础查询', cost: 88 },
])

const testing = ref(false)
const passedCount = ref(0)
let timer: ReturnType<typeof setTimeout> | undefined

function runTest() {
  if (testing.value) return
  testing.value = true
  passedCount.value = 0
  let i = 0
  const tick = () => {
    if (i >= layers.value.length) {
      testing.value = false
      ElMessage.success('连通性测试完成')
      return
    }
    i += 1
    passedCount.value = i
    timer = setTimeout(tick, 500)
  }
  timer = setTimeout(tick, 500)
}
</script>

<style scoped>
.standard-page {
  display: grid;
  gap: 16px;
}

.test-stage {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
  padding: 10px 0 6px;
}

@media (max-width: 900px) {
  .test-stage {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  }
}

.stage-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 16px 10px;
  border: 1px solid #e4e7ed;
  border-radius: 10px;
  text-align: center;
  min-width: 0;
}

.stage-card.done {
  border-color: #00a854;
  background: rgba(0, 168, 84, 0.04);
}

.stage-card.current {
  border-color: #da251d;
  background: rgba(218, 37, 29, 0.04);
}

.stage-icon {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: #f0f2f5;
  color: #fff;
  font-weight: 700;
  font-size: 15px;
}

.stage-card.done .stage-icon {
  background: #00a854;
}

.stage-card.current .stage-icon {
  background: #da251d;
}

.stage-num {
  color: #8c8c8c;
}

.stage-name {
  font-size: 14px;
  font-weight: 600;
  color: #4a4a4a;
}

.stage-desc {
  font-size: 12px;
  color: #8c8c8c;
  min-height: 32px;
}

.stage-cost {
  font-size: 12px;
  color: #00a854;
  font-weight: 600;
}

.idle-tip {
  padding-top: 4px;
}

.result-cells {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
  gap: 12px;
  max-width: 620px;
  width: 100%;
  margin: 0 auto 20px;
}

.result-cell {
  padding: 10px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  background: #fafafa;
}

.result-cell-name {
  font-size: 12px;
  color: #8c8c8c;
}

.result-cell-value {
  margin-top: 4px;
  font-size: 18px;
  font-weight: 700;
  color: #4a4a4a;
}
</style>