<template>
  <div class="standard-page">
    <el-card shadow="never">
      <div class="panel-header">
        质量规则模板定制
        <div class="panel-actions">
          <el-button type="primary" @click="step = 0">新建模板</el-button>
        </div>
      </div>

      <el-steps :active="step" align-center finish-status="success" class="cus-steps">
        <el-step v-for="s in steps" :key="s.title" :title="s.title" :description="s.desc" />
      </el-steps>

      <div v-if="step === 0" class="step-body">
        <div class="sub-title">选择模板类型</div>
        <div class="type-grid">
          <div v-for="t in types" :key="t.name" class="type-card" @click="selectType(t)">
            <el-icon :size="20"><component :is="t.icon" /></el-icon>
            <div class="type-name">{{ t.name }}</div>
            <div class="type-desc">{{ t.desc }}</div>
          </div>
        </div>
      </div>

      <div v-if="step === 1" class="step-body">
        <div class="sub-title">参数化配置</div>
        <el-form label-width="120px" class="param-form">
          <el-form-item label="模板名称">
            <el-input v-model="form.name" placeholder="请输入模板名称" />
          </el-form-item>
          <el-form-item label="模板分类">
            <el-select v-model="form.category" class="w-full">
              <el-option v-for="c in categories" :key="c" :label="c" :value="c" />
            </el-select>
          </el-form-item>
          <el-form-item label="校验规则">
            <el-input v-model="form.rule" type="textarea" :rows="3" placeholder="如：字段值非空且长度 <= 20" />
          </el-form-item>
          <el-form-item label="严重级别">
            <el-radio-group v-model="form.level">
              <el-radio label="提示">提示</el-radio>
              <el-radio label="警告">警告</el-radio>
              <el-radio label="严重">严重</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="告警阈值">
            <el-input-number v-model="form.threshold" :min="0" :max="100" /> %
          </el-form-item>
        </el-form>
      </div>

      <div v-if="step === 2" class="step-body">
        <div class="sub-title">分类与共享</div>
        <el-form label-width="120px" class="param-form">
          <el-form-item label="所属分类">
            <el-tree-select v-model="form.categoryPath" :data="categoryTree" :render-after-expand="false" class="w-full" />
          </el-form-item>
          <el-form-item label="共享范围">
            <el-radio-group v-model="form.share">
              <el-radio label="私有">私有</el-radio>
              <el-radio label="部门">部门共享</el-radio>
              <el-radio label="全局">全局共享</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="共享说明">
            <el-input v-model="form.shareNote" type="textarea" :rows="2" placeholder="填写共享说明" />
          </el-form-item>
        </el-form>
      </div>

      <div v-if="step === 3" class="step-body">
        <div class="sub-title">版本与沉淀</div>
        <el-descriptions :column="1" border size="small" class="ver-info">
          <el-descriptions-item label="模板名称">{{ form.name }}</el-descriptions-item>
          <el-descriptions-item label="初始版本">v1.0.0</el-descriptions-item>
          <el-descriptions-item label="校验规则">{{ form.rule }}</el-descriptions-item>
          <el-descriptions-item label="共享范围">{{ form.share }}</el-descriptions-item>
        </el-descriptions>
        <el-alert title="保存后将生成 v1.0.0 版本并纳入模板库" type="info" :closable="false" show-icon class="mt-12" />
      </div>

      <div class="step-actions">
        <el-button :disabled="step === 0" @click="step -= 1">上一步</el-button>
        <el-button v-if="step < 3" type="primary" @click="step += 1">下一步</el-button>
        <el-button v-else type="primary" @click="save">完成并保存</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { List, Calendar, Collection, DocumentChecked } from '@element-plus/icons-vue'

const step = ref(0)
const steps = [
  { title: '模板创建', desc: '选择类型' },
  { title: '参数化', desc: '配置规则' },
  { title: '分类', desc: '分类共享' },
  { title: '版本', desc: '版本沉淀' },
]

const types = [
  { name: '完整性模板', desc: '空值、缺失检测', icon: List },
  { name: '准确性模板', desc: '格式、范围、正则', icon: DocumentChecked },
  { name: '一致性模板', desc: '关联、映射、引用', icon: Collection },
  { name: '时效性模板', desc: '新鲜度、波动', icon: Calendar },
]

const categories = ['完整性', '准确性', '一致性', '唯一性', '时效性']

const form = ref({ name: '', category: '准确性', rule: '', level: '警告', threshold: 5, categoryPath: '', share: '私有', shareNote: '' })

const categoryTree = [
  { label: '质量规则模板', value: 'root', children: [
    { label: '完整性', value: 'integrity' },
    { label: '准确性', value: 'accuracy' },
    { label: '一致性', value: 'consistency' },
  ] },
]

function selectType(t: (typeof types)[number]) {
  form.value.category = t.name
  step.value = 1
}

function save() {
  ElMessage.success('模板已保存，版本 v1.0.0 已沉淀至模板库')
  step.value = 0
}
</script>

<style scoped>
.standard-page {
  display: grid;
  gap: 16px;
}

.cus-steps {
  margin: 14px 0 18px;
}

.step-body {
  min-height: 280px;
}

.sub-title {
  font-size: 13px;
  font-weight: 600;
  color: #4a4a4a;
  margin-bottom: 12px;
  padding-left: 10px;
  border-left: 3px solid #da251d;
}

.type-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
  gap: 12px;
}

.type-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px 10px;
  border: 1px solid #e4e7ed;
  border-radius: 10px;
  color: #4a4a4a;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s, color 0.2s;
}

.type-card:hover {
  border-color: #da251d;
  color: #da251d;
  box-shadow: 0 4px 14px rgba(218, 37, 29, 0.1);
}

.type-name {
  font-size: 14px;
  font-weight: 600;
}

.type-desc {
  font-size: 12px;
  color: #8c8c8c;
}

.param-form {
  max-width: 620px;
}

.ver-info {
  max-width: 620px;
}

.mt-12 {
  margin-top: 12px;
}

.step-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 14px;
  border-top: 1px solid #edf0f5;
}
</style>