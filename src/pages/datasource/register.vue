<template>
  <div class="standard-page">
    <el-card class="panel-card dashboard-card" shadow="never">
      <template #header>
        <div class="panel-header">
          <span>数据源注册</span>
        </div>
      </template>

      <el-steps :active="activeStep" align-center finish-status="success" class="register-steps">
        <el-step title="选择类型" />
        <el-step title="配置参数" />
        <el-step title="测试连接" />
        <el-step title="完成" />
      </el-steps>

      <div v-if="activeStep === 0" class="step-body">
        <div class="type-section">
          <div class="type-group-title">结构化数据源</div>
          <div class="type-grid">
            <div
              v-for="type in structuredTypes"
              :key="type"
              class="type-card"
              :class="{ 'is-active': form.type === type }"
              @click="form.type = type"
            >
              <el-icon :size="22"><Coin /></el-icon>
              <span>{{ type }}</span>
            </div>
          </div>
        </div>
        <div class="type-section">
          <div class="type-group-title">半结构化数据源</div>
          <div class="type-grid">
            <div
              v-for="type in semiStructuredTypes"
              :key="type"
              class="type-card"
              :class="{ 'is-active': form.type === type }"
              @click="form.type = type"
            >
              <el-icon :size="22"><Document /></el-icon>
              <span>{{ type }}</span>
            </div>
          </div>
        </div>
        <div class="type-section">
          <div class="type-group-title">非结构化数据源</div>
          <div class="type-grid">
            <div
              v-for="type in unstructuredTypes"
              :key="type"
              class="type-card"
              :class="{ 'is-active': form.type === type }"
              @click="form.type = type"
            >
              <el-icon :size="22"><Picture /></el-icon>
              <span>{{ type }}</span>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="activeStep === 1" class="step-body">
        <el-form :model="form" label-width="120px" class="register-form">
          <el-form-item label="数据源名称">
            <el-input v-model="form.name" placeholder="如：票务系统MySQL库" />
          </el-form-item>
          <el-form-item label="主机地址">
            <el-input v-model="form.host" placeholder="10.20.0.1" />
          </el-form-item>
          <el-form-item label="端口">
            <el-input v-model="form.port" placeholder="3306" />
          </el-form-item>
          <el-form-item label="数据库/库名">
            <el-input v-model="form.database" placeholder="metro_ticket" />
          </el-form-item>
          <el-form-item label="用户名">
            <el-input v-model="form.username" placeholder="root" />
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="form.password" type="password" show-password placeholder="密码加密存储，界面掩码显示" />
          </el-form-item>
          <el-form-item label="所属分组">
            <el-select v-model="form.groupName" class="filter-select">
              <el-option v-for="group in groups" :key="group" :label="group" :value="group" />
            </el-select>
          </el-form-item>
          <el-form-item label="负责人">
            <el-select v-model="form.owner" class="filter-select">
              <el-option v-for="owner in owners" :key="owner" :label="owner" :value="owner" />
            </el-select>
          </el-form-item>
          <el-form-item label="描述">
            <el-input v-model="form.description" type="textarea" :rows="2" />
          </el-form-item>
        </el-form>
      </div>

      <div v-else-if="activeStep === 2" class="step-body test-body">
        <div v-if="testState === 'idle'">
          <el-empty description="点击下方按钮开始测试连接" :image-size="80" />
          <div class="test-actions">
            <el-button type="danger" :loading="isTesting" @click="runTest">开始测试连接</el-button>
          </div>
        </div>
        <div v-else-if="isTesting" class="test-progress">
          <el-progress :percentage="progress" status="active" :stroke-width="14" />
          <p class="test-tip">正在连接 {{ form.host }}:{{ form.port }} ...</p>
        </div>
        <div v-else-if="testState === 'success'" class="test-result test-result--success">
          <el-icon :size="48"><CircleCheckFilled /></el-icon>
          <div>
            <div class="test-result-title">连接测试通过</div>
            <div class="test-result-detail">响应时间 23ms，握手完成，字符集 utf8mb4</div>
          </div>
        </div>
        <div v-else class="test-result test-result--fail">
          <el-icon :size="48"><CircleCloseFilled /></el-icon>
          <div>
            <div class="test-result-title">连接测试失败</div>
            <div class="test-result-detail">连接超时：无法访问 {{ form.host }}:{{ form.port }}，请检查网络或参数</div>
          </div>
        </div>
      </div>

      <div v-else class="step-body finish-body">
        <el-result icon="success" title="数据源注册完成" sub-title="数据源已成功接入，可立即用于数据采集任务。">
          <template #extra>
            <el-button type="danger" @click="goList">查看数据源列表</el-button>
            <el-button @click="reset">再注册一个</el-button>
          </template>
        </el-result>
      </div>

      <div class="step-actions">
        <el-button v-if="activeStep > 0 && activeStep < 3" @click="activeStep -= 1">上一步</el-button>
        <el-button v-if="activeStep < 2" type="danger" @click="activeStep += 1">下一步</el-button>
        <el-button v-if="activeStep === 2" type="danger" :disabled="testState !== 'success'" @click="activeStep = 3">
          完成注册
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { CircleCheckFilled, CircleCloseFilled, Coin, Document, Picture } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const structuredTypes = ['MySQL', 'Oracle', 'SQLServer', 'OceanBase', 'GaussDB', '虚谷', '金仓', '崖山', 'HBase']
const semiStructuredTypes = ['MongoDB', 'Kafka', 'RabbitMQ', 'JSON/XML']
const unstructuredTypes = ['文本/CSV', '图片/音视频']

const groups = ['客运数据组', '建设数据组', '设备数据组', '财务数据组', '安全数据组']
const owners = ['张三', '李四', '王五', '赵六', '孙七']

const activeStep = ref(0)
const testState = ref<'idle' | 'testing' | 'success' | 'fail'>('idle')
const isTesting = computed(() => testState.value === 'testing')
const progress = ref(0)
let timer: number | undefined

const form = reactive({
  type: 'MySQL',
  name: '',
  host: '',
  port: '',
  database: '',
  username: '',
  password: '',
  groupName: '客运数据组',
  owner: '张三',
  description: '',
})

const runTest = () => {
  testState.value = 'testing'
  progress.value = 0
  timer = window.setInterval(() => {
    progress.value += 10
    if (progress.value >= 100) {
      window.clearInterval(timer)
      testState.value = form.host ? 'success' : 'fail'
    }
  }, 100)
}

const goList = () => {
  router.push('/datasource/list')
}

const reset = () => {
  activeStep.value = 0
  testState.value = 'idle'
  Object.assign(form, {
    type: 'MySQL',
    name: '',
    host: '',
    port: '',
    database: '',
    username: '',
    password: '',
    description: '',
  })
  ElMessage.success('已重置注册表单')
}
</script>
