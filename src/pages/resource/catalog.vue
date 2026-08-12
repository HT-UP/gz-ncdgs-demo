<template>
  <div class="standard-page">
    <el-card class="panel-card dashboard-card" shadow="never">
      <template #header>
        <div class="panel-header">
          <span>资源目录</span>
          <div class="panel-actions">
            <el-button type="danger" :icon="Plus" @click="openRegister">资产注册入目</el-button>
          </div>
        </div>
      </template>

      <div class="catalog-layout">
        <div class="catalog-tree-panel">
          <el-input v-model="treeKeyword" placeholder="搜索目录" :prefix-icon="Search" clearable size="small" />
          <el-tree
            :data="filteredTree"
            node-key="id"
            default-expand-all
            highlight-current
            :props="{ label: 'label', children: 'children' }"
            @node-click="selectNode"
          >
            <template #default="{ data }">
              <span class="catalog-node">
                <el-icon :size="14"><component :is="nodeIcon[data.type === 'layer' ? 'layer' : 'folder']" /></el-icon>
                <span>{{ data.label }}</span>
                <span v-if="data.assetCount" class="catalog-count">{{ data.assetCount }}</span>
                <Lock v-if="data.type === 'custom' && data.id.startsWith('custom-map')" class="catalog-lock" :size="12" />
              </span>
            </template>
          </el-tree>
        </div>

        <div class="catalog-table-panel">
          <div class="toolbar-row">
            <el-input
              v-model="keyword"
              placeholder="按名称 / 类型 / 分级搜索"
              clearable
              class="search-input"
              :prefix-icon="Search"
            />
            <el-select v-model="filterLevel" placeholder="资产分级" clearable class="filter-select">
              <el-option label="L1 核心" value="L1" />
              <el-option label="L2 重要" value="L2" />
              <el-option label="L3 一般" value="L3" />
              <el-option label="L4 可公开" value="L4" />
            </el-select>
            <span class="catalog-context">{{ currentLabel }}</span>
          </div>

          <el-table :data="pagedAssets" stripe>
            <el-table-column prop="name" label="资产名称" min-width="150">
              <template #default="{ row }">
                <el-link :underline="false" type="primary" @click="openDetail(row)">{{ row.name }}</el-link>
              </template>
            </el-table-column>
            <el-table-column prop="type" label="类型" width="70" />
            <el-table-column label="分级" width="80" align="center">
              <template #default="{ row }">
                <span class="level-badge" :style="{ background: levelColor[row.level] }">{{ row.level }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="responsibleDept" label="责任部门" width="100" />
            <el-table-column prop="owner" label="责任人" width="80" />
            <el-table-column label="标签" min-width="140">
              <template #default="{ row }">
                <el-tag v-for="tag in row.tags" :key="tag" size="small" class="mr-4" effect="plain">{{ tag }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="storageLayer" label="存储层级" width="120" />
            <el-table-column label="操作" width="190" fixed="right">
              <template #default="{ row }">
                <el-button link type="primary" @click="openEdit(row)">属性</el-button>
                <el-button link type="warning" @click="openMigrate(row)">迁移</el-button>
                <el-button link type="danger" @click="removeAsset(row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-pagination
            class="pager"
            layout="total, prev, pager, next"
            :total="filteredAssets.length"
            :page-size="pageSize"
            :current-page="currentPage"
            background
            @current-change="changePage"
          />
        </div>
      </div>
    </el-card>

    <el-drawer v-model="registerVisible" title="资产注册入目" size="56%">
      <el-steps :active="1" finish-status="success" class="mb-16">
        <el-step title="选择服务" />
        <el-step title="属性设置" />
        <el-step title="完成" />
      </el-steps>
      <div class="section-title mb-8">数据服务列表</div>
      <el-table :data="servicePool" size="small" stripe highlight-current-row @current-change="selectService">
        <el-table-column prop="name" label="服务名称" min-width="150" />
        <el-table-column prop="type" label="类型" width="80" />
        <el-table-column prop="interfaceCount" label="接口数" width="80" align="center" />
        <el-table-column prop="desc" label="说明" min-width="160" />
      </el-table>
      <el-form :model="registerForm" label-width="90px" class="mt-16">
        <el-form-item label="所属目录">
          <el-select v-model="registerForm.catalog" class="w-full">
            <el-option v-for="node in flattenTree" :key="node.id" :label="node.label" :value="node.label" />
          </el-select>
        </el-form-item>
        <el-form-item label="责任部门">
          <el-select v-model="registerForm.dept" class="w-full">
            <el-option label="信息中心" value="信息中心" />
            <el-option label="票务部" value="票务部" />
            <el-option label="设备部" value="设备部" />
            <el-option label="运营部" value="运营部" />
          </el-select>
        </el-form-item>
        <el-form-item label="责任人">
          <el-input v-model="registerForm.owner" />
        </el-form-item>
        <el-form-item label="资产分级">
          <el-radio-group v-model="registerForm.level">
            <el-radio-button value="L1">L1 核心</el-radio-button>
            <el-radio-button value="L2">L2 重要</el-radio-button>
            <el-radio-button value="L3">L3 一般</el-radio-button>
            <el-radio-button value="L4">L4 可公开</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="资产标签">
          <el-select v-model="registerForm.tags" multiple filterable allow-create default-first-option class="w-full">
            <el-option v-for="tag in ['核心', '敏感', '个人隐私', '客流', '设备', '财务', '地图']" :key="tag" :label="tag" :value="tag" />
          </el-select>
        </el-form-item>
        <el-form-item label="资产描述">
          <el-input v-model="registerForm.desc" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="registerVisible = false">取消</el-button>
        <el-button type="danger" @click="submitRegister">注册入目</el-button>
      </template>
    </el-drawer>

    <el-drawer v-model="editVisible" title="资产属性设置" size="520px">
      <el-form :model="editForm" label-width="90px">
        <el-form-item label="资产名称">
          <el-input v-model="editForm.name" disabled />
        </el-form-item>
        <el-form-item label="所属目录">
          <el-select v-model="editForm.catalog" class="w-full">
            <el-option v-for="node in flattenTree" :key="node.id" :label="node.label" :value="node.label" />
          </el-select>
        </el-form-item>
        <el-form-item label="责任部门">
          <el-select v-model="editForm.dept" class="w-full">
            <el-option v-for="dept in ['信息中心', '票务部', '设备部', '运营部', '建设部', '财务部']" :key="dept" :label="dept" :value="dept" />
          </el-select>
        </el-form-item>
        <el-form-item label="责任人">
          <el-input v-model="editForm.owner" />
        </el-form-item>
        <el-form-item label="资产分级">
          <el-radio-group v-model="editForm.level">
            <el-radio-button value="L1">L1</el-radio-button>
            <el-radio-button value="L2">L2</el-radio-button>
            <el-radio-button value="L3">L3</el-radio-button>
            <el-radio-button value="L4">L4</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="资产标签">
          <el-select v-model="editForm.tags" multiple filterable allow-create default-first-option class="w-full">
            <el-option v-for="tag in ['核心', '敏感', '个人隐私', '客流', '设备', '财务', '地图']" :key="tag" :label="tag" :value="tag" />
          </el-select>
        </el-form-item>
        <el-form-item label="资产描述">
          <el-input v-model="editForm.desc" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editVisible = false">取消</el-button>
        <el-button type="danger" @click="saveEdit">保存属性</el-button>
      </template>
    </el-drawer>

    <el-drawer v-model="migrateVisible" title="资产迁移" size="420px">
      <div class="migrate-from">将「<b>{{ migrateTarget }}</b>」迁移至：</div>
      <el-tree
        :data="catalogTree"
        node-key="id"
        highlight-current
        :props="{ label: 'label', children: 'children' }"
        class="migrate-tree"
        @node-click="pickMigrateNode"
      />
      <template #footer>
        <el-button @click="migrateVisible = false">取消</el-button>
        <el-button type="danger" @click="submitMigrate">执行迁移</el-button>
      </template>
    </el-drawer>

    <el-drawer v-model="detailVisible" title="资产详情" size="560px">
      <template v-if="detailAsset">
        <el-descriptions title="基本信息" :column="2" border class="mb-16">
          <el-descriptions-item label="资产名称">{{ detailAsset.name }}</el-descriptions-item>
          <el-descriptions-item label="类型">{{ detailAsset.type }}</el-descriptions-item>
          <el-descriptions-item label="所属目录">{{ detailAsset.catalogPath }}</el-descriptions-item>
          <el-descriptions-item label="分级">
            <span class="level-badge" :style="{ background: levelColor[detailAsset.level] }">{{ detailAsset.level }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="责任部门">{{ detailAsset.responsibleDept }}</el-descriptions-item>
          <el-descriptions-item label="责任人">{{ detailAsset.owner }}</el-descriptions-item>
          <el-descriptions-item label="存储层级">{{ detailAsset.storageLayer }}</el-descriptions-item>
          <el-descriptions-item label="存储量">{{ (detailAsset.sizeMb / 1024).toFixed(2) }} GB</el-descriptions-item>
        </el-descriptions>
        <div class="section-title">资产标签</div>
        <div class="mb-16">
          <el-tag v-for="tag in detailAsset.tags" :key="tag" class="mr-4" effect="plain">{{ tag }}</el-tag>
        </div>
        <div class="section-title">服务信息</div>
        <el-timeline class="mt-8">
          <el-timeline-item timestamp="数据服务 · 接口 v1.0" type="primary">服务编码：{{ detailAsset.id }}-api · 已发布</el-timeline-item>
          <el-timeline-item timestamp="数据同步 · 每日 03:00" type="success">同步状态：正常 · 最近同步 2026-08-12 03:02</el-timeline-item>
        </el-timeline>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Folder, Lock, Plus, Search } from '@element-plus/icons-vue'
import { catalogTree, mockAssets, type AssetLevel, type AssetRecord } from '@/mock/resource'

const levelColor: Record<string, string> = {
  L1: '#E34D59',
  L2: '#ED7B2F',
  L3: '#2B6CB0',
  L4: '#8C8C8C',
}

const nodeIcon = { folder: Folder, layer: Folder }

const treeKeyword = ref('')
const keyword = ref('')
const filterLevel = ref('')
const currentPage = ref(1)
const pageSize = 20
const currentLabel = ref('全部目录')
const currentCatalogId = ref('')

const assets = ref([...mockAssets])

const servicePool = [
  { name: '票务查询服务', type: '查询类', interfaceCount: 12, desc: '票务数据统一查询接口' },
  { name: '客流统计服务', type: '统计类', interfaceCount: 8, desc: '客流指标聚合接口' },
  { name: '设备状态服务', type: '查询类', interfaceCount: 6, desc: '设备运行状态接入' },
  { name: '乘客信息服务', type: '管理类', interfaceCount: 5, desc: '乘客档案读写接口' },
]

const flattenTree = computed(() => {
  const result: { id: string; label: string }[] = []
  const walk = (nodes: typeof catalogTree) => {
    nodes.forEach((node) => {
      result.push({ id: node.id, label: node.label })
      if (node.children) walk(node.children)
    })
  }
  walk(catalogTree)
  return result.slice(1)
})

const filteredTree = computed(() => {
  if (!treeKeyword.value) return catalogTree
  const match = (node: (typeof catalogTree)[number]): boolean => {
    if (node.label.includes(treeKeyword.value)) return true
    if (node.children) return node.children.some((child) => match(child))
    return false
  }
  return catalogTree.filter(match)
})

const filteredAssets = computed(() =>
  assets.value.filter((asset) => {
    if (filterLevel.value && asset.level !== filterLevel.value) return false
    if (keyword.value) {
      const kw = keyword.value.toLowerCase()
      const matched =
        asset.name.toLowerCase().includes(kw) ||
        asset.type.toLowerCase().includes(kw) ||
        asset.level.toLowerCase().includes(kw)
      if (!matched) return false
    }
    if (currentCatalogId.value) {
      if (currentCatalogId.value.startsWith('biz-') && !asset.catalogPath.includes(currentCatalogId.value.replace('biz-', ''))) {
        return false
      }
      if ((currentCatalogId.value === 'layer-ods' || currentCatalogId.value === 'layer-dwd' || currentCatalogId.value === 'layer-dws' || currentCatalogId.value === 'layer-ads') && !asset.storageLayer.includes(currentCatalogId.value.replace('layer-', '').toUpperCase())) {
        return false
      }
    }
    return true
  }),
)

const pagedAssets = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredAssets.value.slice(start, start + pageSize)
})

const changePage = (page: number) => {
  currentPage.value = page
}

watch([keyword, filterLevel, currentCatalogId], () => {
  currentPage.value = 1
})

watch(filteredAssets, (list) => {
  const maxPage = Math.max(1, Math.ceil(list.length / pageSize))
  if (currentPage.value > maxPage) currentPage.value = maxPage
})

const selectNode = (data: (typeof catalogTree)[number]) => {
  if (data.assetCount === undefined) return
  currentLabel.value = data.label
  currentCatalogId.value = data.id
  currentPage.value = 1
  ElMessage.info(`已定位至「${data.label}」目录，共 ${data.assetCount} 项资产（Mock）`)
}

const registerVisible = ref(false)
const registerForm = reactive({
  catalog: '客运管理',
  dept: '信息中心',
  owner: '',
  level: 'L3' as AssetLevel,
  tags: [] as string[],
  desc: '',
})

const openRegister = () => {
  Object.assign(registerForm, { catalog: '客运管理', dept: '信息中心', owner: '张三', level: 'L3' as AssetLevel, tags: [], desc: '' })
  registerVisible.value = true
}

const selectService = (row: (typeof servicePool)[number]) => {
  ElMessage.info(`已选择服务「${row.name}」（Mock）`)
}

const submitRegister = () => {
  registerVisible.value = false
  ElMessage.success('资产已注册入目（Mock）')
}

const editVisible = ref(false)
const editForm = reactive({
  id: '',
  name: '',
  catalog: '',
  dept: '',
  owner: '',
  level: 'L3' as AssetLevel,
  tags: [] as string[],
  desc: '',
})

const openEdit = (row: AssetRecord) => {
  Object.assign(editForm, {
    id: row.id,
    name: row.name,
    catalog: row.catalogPath.replace('/按业务域/', ''),
    dept: row.responsibleDept,
    owner: row.owner,
    level: row.level,
    tags: [...row.tags],
    desc: row.description,
  })
  editVisible.value = true
}

const saveEdit = () => {
  const target = assets.value.find((item) => item.id === editForm.id)
  if (target) {
    target.responsibleDept = editForm.dept
    target.owner = editForm.owner
    target.level = editForm.level
    target.tags = [...editForm.tags]
    target.description = editForm.desc
  }
  editVisible.value = false
  ElMessage.success('资产属性已保存（Mock）')
}

const migrateVisible = ref(false)
const migrateTarget = ref('')
let migrateRow: AssetRecord | null = null

const openMigrate = (row: AssetRecord) => {
  migrateRow = row
  migrateTarget.value = row.name
  migrateVisible.value = true
}

const pickMigrateNode = (data: (typeof catalogTree)[number]) => {
  if (migrateRow) {
    migrateRow.catalogPath = `/按业务域/${data.label}`
  }
}

const submitMigrate = () => {
  migrateVisible.value = false
  ElMessage.success(`资产「${migrateTarget.value}」已迁移目录（Mock）`)
}

const detailVisible = ref(false)
const detailAsset = ref<AssetRecord | null>(null)

const openDetail = (row: AssetRecord) => {
  detailAsset.value = row
  detailVisible.value = true
}

const removeAsset = (row: AssetRecord) => {
  assets.value = assets.value.filter((item) => item.id !== row.id)
  ElMessage.success(`资产「${row.name}」已删除（Mock）`)
}
</script>