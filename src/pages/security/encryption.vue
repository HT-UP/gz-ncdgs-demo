<template>
  <div class="standard-page encrypt-page">
    <div class="encrypt-tabs-wrap">
      <el-tabs v-model="activeTab" type="border-card" stretch>
        <el-tab-pane label="加密" name="encrypt">
          <div class="encrypt-pane">
            <div class="encrypt-stats">
              <div v-for="s in encryptStats" :key="s.label" class="encrypt-stat">
                <div class="encrypt-stat-value" :style="{ color: s.color }">{{ s.value }}</div>
                <div class="encrypt-stat-label">{{ s.label }}</div>
              </div>
            </div>

            <el-row :gutter="16" class="encrypt-rows">
              <el-col :span="14">
                <el-card class="encrypt-card" shadow="never">
                  <template #header>
                    <div class="panel-header">
                      <span>传输加密配置</span>
                      <div class="panel-actions">
                        <el-button size="small" :icon="CircleCheck" type="success" plain @click="runSecurityCheck">安全巡检</el-button>
                      </div>
                    </div>
                  </template>

                  <div class="transport-form">
                    <div class="tf-item">
                      <span class="tf-label">HTTPS 强制</span>
                      <el-switch v-model="transport.httpsForce" />
                      <span class="tf-tip">{{ transport.httpsForce ? '外部请求仅允许 HTTPS' : '仅推荐，未强制' }}</span>
                    </div>
                    <div class="tf-item">
                      <span class="tf-label">最低 TLS 版本</span>
                      <el-select v-model="transport.tlsVersion" size="small" class="tf-select">
                        <el-option label="TLS 1.3" value="TLS 1.3" />
                        <el-option label="TLS 1.2" value="TLS 1.2" />
                      </el-select>
                      <span class="tf-tip">低于该版本拒绝连接</span>
                    </div>
                    <div class="tf-item">
                      <span class="tf-label">密码套件</span>
                      <el-select v-model="transport.cipherSuite" size="small" class="tf-select" filterable>
                        <el-option label="TLS_AES_256_GCM_SHA384（推荐）" value="TLS_AES_256_GCM_SHA384" />
                        <el-option label="TLS_CHACHA20_POLY1305_SHA256" value="TLS_CHACHA20_POLY1305_SHA256" />
                        <el-option label="ECDHE-ECDSA-AES128-GCM-SHA256" value="ECDHE-ECDSA-AES128-GCM-SHA256" />
                      </el-select>
                    </div>
                    <div class="tf-item">
                      <span class="tf-label">HSTS</span>
                      <el-switch v-model="transport.hsts" />
                      <span class="tf-tip">浏览器强制 HTTPS</span>
                    </div>
                    <div class="tf-item">
                      <span class="tf-label">HSTS 时长</span>
                      <el-select v-model="transport.hstsMaxAge" size="small" class="tf-select" :disabled="!transport.hsts">
                        <el-option label="1 周（604800）" value="604800" />
                        <el-option label="1 个月（2592000）" value="2592000" />
                        <el-option label="6 个月（15768000）" value="15768000" />
                      </el-select>
                    </div>
                    <div class="tf-item">
                      <span class="tf-label">证书管理</span>
                      <el-button size="small" @click="manageCert">管理证书</el-button>
                      <span class="tf-tip">支持 CFCA / DigiCert 签发</span>
                    </div>
                  </div>

                  <div class="block-title">常用通道加密状态</div>
                  <div class="channel-list">
                    <div v-for="c in channels" :key="c.name" class="channel-item">
                      <span class="channel-name">{{ c.name }}</span>
                      <span class="channel-protocol">{{ c.protocol }}</span>
                      <el-tag size="small" :type="c.encrypted ? 'success' : 'danger'" effect="dark">
                        {{ c.encrypted ? '已加密' : '明文' }}
                      </el-tag>
                      <el-button v-if="!c.encrypted" size="small" link type="danger" @click="enableChannel(c)">立即整改</el-button>
                    </div>
                  </div>

                  <div class="block-title">证书清单（{{ certificates.length }}）</div>
                  <el-table :data="certificates" size="small" stripe>
                    <el-table-column prop="name" label="证书 / 域名" min-width="160" />
                    <el-table-column prop="purpose" label="用途" width="96" />
                    <el-table-column prop="issuer" label="颁发机构" width="140" />
                    <el-table-column prop="expire" label="有效期至" width="100" />
                    <el-table-column label="状态" width="84">
                      <template #default="{ row }">
                        <el-tag size="small" :type="row.statusType" effect="dark">{{ row.status }}</el-tag>
                      </template>
                    </el-table-column>
                    <el-table-column label="操作" width="120" align="center">
                      <template #default="{ row }">
                        <el-button link type="primary" size="small" @click="renewCert(row)">续期</el-button>
                        <el-button link type="info" size="small" @click="certDetail(row)">详情</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-card>
              </el-col>

              <el-col :span="10">
                <el-card class="encrypt-card" shadow="never">
                  <template #header>
                    <div class="panel-header">
                      <span>密钥生命周期配置</span>
                      <div class="panel-actions">
                        <el-button type="danger" size="small" :icon="Plus1" @click="openKeyDrawer">创建密钥</el-button>
                      </div>
                    </div>
                  </template>

                  <div class="life-policy">
                    <div class="lp-item">
                      <span class="lp-label">自动轮换</span>
                      <el-switch v-model="lifePolicy.autoRotate" />
                      <span class="tf-tip">{{ lifePolicy.autoRotate ? '开通' : '关闭' }}</span>
                    </div>
                    <div class="lp-item">
                      <span class="lp-label">轮换周期</span>
                      <el-select v-model="lifePolicy.rotateCycle" size="small" class="tf-select" :disabled="!lifePolicy.autoRotate">
                        <el-option label="30 天" value="30" />
                        <el-option label="90 天" value="90" />
                        <el-option label="180 天" value="180" />
                        <el-option label="365 天" value="365" />
                      </el-select>
                    </div>
                    <div class="lp-item">
                      <span class="lp-label">到期前提醒</span>
                      <el-input-number v-model="lifePolicy.warnAhead" :min="1" :max="90" size="small" class="lp-number" />
                      <span class="tf-tip">天前通知</span>
                    </div>
                    <div class="lp-item">
                      <span class="lp-label">过期策略</span>
                      <el-select v-model="lifePolicy.expireAction" size="small" class="tf-select">
                        <el-option label="保留只读" value="保留只读" />
                        <el-option label="自动销毁" value="自动销毁" />
                        <el-option label="人工审批" value="人工审批" />
                      </el-select>
                    </div>
                    <div class="lp-item">
                      <span class="lp-label">变更审批</span>
                      <el-switch v-model="lifePolicy.approveBeforeDisable" />
                      <span class="tf-tip">轮换 / 销毁需审批</span>
                    </div>
                  </div>

                  <div class="block-title">密钥列表（{{ keys.length }}）</div>
                  <el-table :data="keys" size="small" stripe>
                    <el-table-column prop="name" label="密钥名称" min-width="140">
                      <template #default="{ row }">
                        <span class="key-name-cell"><el-icon :size="13" class="key-ic"><Key /></el-icon>{{ row.name }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="algorithm" label="算法" width="104" />
                    <el-table-column prop="usage" label="用途" width="92" />
                    <el-table-column prop="rotateCycle" label="轮换周期" width="78" />
                    <el-table-column prop="expireAt" label="到期时间" width="96" />
                    <el-table-column label="状态" width="86">
                      <template #default="{ row }">
                        <el-tag size="small" :type="row.statusType" effect="dark">{{ row.status }}</el-tag>
                      </template>
                    </el-table-column>
                    <el-table-column label="操作" width="116" align="center" fixed="right">
                      <template #default="{ row }">
                        <el-button link type="primary" size="small" @click="rotateKey(row)">轮换</el-button>
                        <el-button link type="danger" size="small" @click="destroyKey(row)">销毁</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-card>
              </el-col>
            </el-row>
          </div>
        </el-tab-pane>

        <el-tab-pane label="脱敏" name="mask">
          <div class="mask-pane">
            <div class="mask-toolbar">
              <div class="panel-header">
                <span>脱敏规则配置</span>
                <div class="panel-actions">
                  <el-button type="danger" size="small" :icon="Plus1" @click="openCreate">新增规则</el-button>
                </div>
              </div>
              <div class="toolbar-row">
                <el-input
                  v-model="keyword"
                  placeholder="按规则名称 / 字段搜索"
                  clearable
                  class="search-input"
                  :prefix-icon="Search"
                />
                <el-select v-model="filterMethod" placeholder="脱敏方式" clearable class="filter-select">
                  <el-option label="替换" value="替换" />
                  <el-option label="掩码" value="掩码" />
                  <el-option label="哈希" value="哈希" />
                </el-select>
                <el-select v-model="filterStatus" placeholder="状态" clearable class="filter-select">
                  <el-option label="已上线" value="已上线" />
                  <el-option label="审批中" value="审批中" />
                  <el-option label="草稿" value="草稿" />
                </el-select>
                <span class="dep-text">共 {{ filteredRules.length }} 条规则</span>
              </div>
            </div>

            <el-table :data="pagedRules" stripe>
              <el-table-column prop="name" label="规则名称" min-width="140" />
              <el-table-column prop="field" label="目标字段" min-width="170" />
              <el-table-column label="方式" width="80">
                <template #default="{ row }">
                  <el-tag :type="methodTagType[row.method]" effect="plain">{{ row.method }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="保留格式" width="90" align="center">
                <template #default="{ row }">
                  <span :class="row.preserveFormat ? 'trend-positive' : 'dep-text'">{{ row.preserveFormat ? '是' : '否' }}</span>
                </template>
              </el-table-column>
              <el-table-column label="示例" min-width="210">
                <template #default="{ row }">
                  <span class="mask-sample-before">{{ row.sampleBefore }}</span>
                  <span class="dep-text"> → </span>
                  <span class="mask-sample-after">{{ row.sampleAfter }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="scope" label="场景" width="130" />
              <el-table-column prop="version" label="版本" width="70" align="center" />
              <el-table-column label="状态" width="90">
                <template #default="{ row }">
                  <el-tag :type="ruleStatusTag[row.status]" effect="dark">{{ row.status }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="190" fixed="right">
                <template #default="{ row }">
                  <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
                  <el-button link type="warning" @click="versionHistory(row)">版本</el-button>
                  <el-button link type="success" @click="onlineRule(row)">{{ row.status === '已上线' ? '下线' : '上线' }}</el-button>
                </template>
              </el-table-column>
            </el-table>

            <el-pagination
              class="pager"
              layout="total, prev, pager, next"
              :total="filteredRules.length"
              :page-size="pageSize"
              :current-page="currentPage"
              background
              @current-change="changePage"
            />
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <el-dialog
      v-model="editorVisible"
      :title="editing ? '编辑脱敏规则' : '新增脱敏规则'"
      width="780px"
      align-center
      destroy-on-close
      class="mask-rule-dialog"
    >
      <el-form ref="formRef" :model="form" :rules="formRules" label-width="96px">
        <div class="rule-section-title">基本信息</div>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="规则名称" prop="name">
              <el-input v-model="form.name" placeholder="如：手机号码掩码规则" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属数据表" prop="table">
              <el-select v-model="form.table" class="w-full">
                <el-option v-for="t in tablePool" :key="t" :label="t" :value="t" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="规则描述">
          <el-input v-model="form.description" type="textarea" :rows="2" placeholder="说明规则用途、适用范围及注意事项" maxlength="200" show-word-limit />
        </el-form-item>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="目标字段" prop="field">
              <el-select v-model="form.field" filterable class="w-full">
                <el-option v-for="f in fieldsOfTable" :key="f" :label="f" :value="f" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="脱敏方式" prop="method">
              <el-radio-group v-model="form.method">
                <el-radio-button value="掩码" />
                <el-radio-button value="替换" />
                <el-radio-button value="哈希" />
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <div class="rule-section-title">脱敏参数</div>
        <el-row v-if="form.method === '掩码'" :gutter="16">
          <el-col :span="8">
            <el-form-item label="保留前位">
              <el-input-number v-model="form.mask.headKeep" :min="0" :max="15" class="w-full" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="保留后位">
              <el-input-number v-model="form.mask.tailKeep" :min="0" :max="15" class="w-full" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="掩码字符">
              <el-input v-model="form.mask.maskChar" maxlength="2" placeholder="*" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-else-if="form.method === '替换'" :gutter="16">
          <el-col :span="8">
            <el-form-item label="替换字符">
              <el-input v-model="form.replace.replaceChar" maxlength="2" placeholder="*" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="替换比例">
              <el-input-number v-model="form.replace.ratio" :min="10" :max="100" :step="10" class="w-full" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="保留原长度">
              <el-switch v-model="form.replace.keepLength" active-text="是" inactive-text="否" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-else :gutter="16">
          <el-col :span="12">
            <el-form-item label="哈希算法">
              <el-select v-model="form.hash.algorithm" class="w-full">
                <el-option label="SHA-256（推荐）" value="SHA-256" />
                <el-option label="MD5" value="MD5" />
                <el-option label="SM3（国密）" value="SM3" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="加盐处理">
              <el-switch v-model="form.hash.salt" active-text="固定项目盐值" inactive-text="不加盐" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="脱敏预览">
          <div class="mask-preview">
            <span class="preview-before">{{ previewSample }}</span>
            <el-icon class="preview-arrow"><Right /></el-icon>
            <el-tag type="warning" effect="dark">{{ previewText }}</el-tag>
          </div>
        </el-form-item>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="保留格式">
              <el-switch v-model="form.preserveFormat" active-text="启用" inactive-text="关闭" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="优先级">
              <el-input-number v-model="form.priority" :min="1" :max="100" class="w-full" />
              <span class="dep-text tf-tip">数字越小越优先</span>
            </el-form-item>
          </el-col>
        </el-row>

        <div class="rule-section-title">生效范围与策略</div>
        <el-form-item label="脱敏场景" prop="scope">
          <el-radio-group v-model="form.scope">
            <el-radio value="查询实时脱敏">查询实时脱敏</el-radio>
            <el-radio value="存储静态脱敏">存储静态脱敏</el-radio>
            <el-radio value="数据导出脱敏">数据导出脱敏</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="适用角色">
          <el-switch v-model="form.applyAllRoles" active-text="全部角色" inactive-text="指定角色" />
        </el-form-item>
        <el-form-item v-if="!form.applyAllRoles" label="指定角色" prop="roles">
          <el-select v-model="form.roles" multiple class="w-full" placeholder="选择可查看明文的角色">
            <el-option v-for="r in rolePool" :key="r" :label="r" :value="r" />
          </el-select>
        </el-form-item>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="生效时间">
              <el-switch v-model="form.immediate" active-text="立即生效" inactive-text="指定日期" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="!form.immediate" label="生效日期" prop="effectiveDate">
              <el-date-picker v-model="form.effectiveDate" type="date" value-format="YYYY-MM-DD" class="w-full" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" :rows="2" placeholder="审批备注 / 变更说明" maxlength="200" show-word-limit />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editorVisible = false">取消</el-button>
        <el-button @click="saveAsDraft">存草稿</el-button>
        <el-button type="danger" @click="submitMaskingForm">提交审批</el-button>
      </template>
    </el-dialog>

    <el-drawer v-model="keyDrawerVisible" title="创建密钥" size="460px">
      <el-form :model="keyForm" label-width="92px">
        <el-form-item label="密钥名称">
          <el-input v-model="keyForm.name" placeholder="如：数据交换密钥" />
        </el-form-item>
        <el-form-item label="加密算法">
          <el-select v-model="keyForm.algorithm" class="w-full">
            <el-option label="SM4（国密）" value="SM4" />
            <el-option label="AES-256" value="AES-256" />
            <el-option label="HMAC-SHA256" value="HMAC-SHA256" />
            <el-option label="RSA-2048" value="RSA-2048" />
          </el-select>
        </el-form-item>
        <el-form-item label="密钥用途">
          <el-select v-model="keyForm.usage" class="w-full">
            <el-option label="存储加密" value="存储加密" />
            <el-option label="传输会话" value="传输会话" />
            <el-option label="脱敏签名" value="脱敏签名" />
            <el-option label="数据交换" value="数据交换" />
          </el-select>
        </el-form-item>
        <el-form-item label="轮换周期">
          <el-select v-model="keyForm.rotateCycle" class="w-full">
            <el-option label="30 天" value="30 天" />
            <el-option label="90 天" value="90 天" />
            <el-option label="180 天" value="180 天" />
          </el-select>
        </el-form-item>
        <el-form-item label="到期时间">
          <el-date-picker v-model="keyForm.expireAt" type="date" value-format="YYYY-MM-DD" class="w-full" placeholder="选择到期日期" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="keyForm.desc" type="textarea" :rows="2" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="keyDrawerVisible = false">取消</el-button>
        <el-button type="danger" @click="saveKey">创建</el-button>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, reactive, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { CircleCheck, Key, Plus as Plus1, Right, Search } from '@element-plus/icons-vue'
import { mockMaskingRules, type MaskingRule } from '@/mock/security'

const activeTab = ref('encrypt')

/* ========== 加密：传输加密配置 ========== */
const transport = reactive({
  httpsForce: true,
  tlsVersion: 'TLS 1.3',
  cipherSuite: 'TLS_AES_256_GCM_SHA384',
  hsts: true,
  hstsMaxAge: '2592000',
})

const channels = [
  { name: 'Web 前端 / 443', protocol: 'TLS 1.3 · HTTPS', encrypted: true },
  { name: '文件交换通道 / 22', protocol: 'AES-256-GCM · SFTP', encrypted: true },
  { name: '数据比对接口 / 8443', protocol: 'TLS 1.2 · 双向认证', encrypted: true },
  { name: '内部消息队列 / 9092', protocol: '明文传输', encrypted: false },
]

const certificates = ref([
  { name: 'api.datahub.cn', purpose: 'API 网关', issuer: 'CFCA 国密证书', expire: '2027-05-20', status: '有效', statusType: 'success' as const },
  { name: '*.datahub.com', purpose: 'Web 前端', issuer: 'DigiCert', expire: '2026-09-11', status: '即将过期', statusType: 'warning' as const },
  { name: 'sftp.datahub.cn', purpose: 'SFTP 通道', issuer: 'CFCA 国密证书', expire: '2028-01-08', status: '有效', statusType: 'success' as const },
  { name: 'es.datahub.com', purpose: '数据交换', issuer: '自行签发', expire: '2026-03-02', status: '已过期', statusType: 'danger' as const },
])

/* ========== 加密：密钥生命周期配置 ========== */
const lifePolicy = reactive({
  autoRotate: true,
  rotateCycle: '90',
  warnAhead: 15,
  expireAction: '保留只读',
  approveBeforeDisable: true,
})

type KeyRow = {
  name: string
  algorithm: string
  usage: string
  rotateCycle: string
  createdAt: string
  expireAt: string
  status: string
  statusType: 'success' | 'warning' | 'danger'
}

const keys = ref<KeyRow[]>([
  { name: '数据加密主密钥', algorithm: 'SM4', usage: '存储加密', rotateCycle: '180 天', createdAt: '2026-01-15', expireAt: '2026-07-14', status: '正常', statusType: 'success' },
  { name: '传输会话密钥', algorithm: 'AES-256', usage: '传输会话', rotateCycle: '1 天', createdAt: '2026-06-01', expireAt: '2026-06-02', status: '正常', statusType: 'success' },
  { name: '脱敏 HMAC 密钥', algorithm: 'HMAC-SHA256', usage: '脱敏签名', rotateCycle: '30 天', createdAt: '2026-03-10', expireAt: '2026-06-10', status: '即将轮换', statusType: 'warning' },
  { name: '历史支付密钥（弃用）', algorithm: 'AES-256', usage: '历史数据解密', rotateCycle: '—', createdAt: '2024-11-20', expireAt: '2026-05-01', status: '已过期', statusType: 'danger' },
])

const encryptStats = computed(() => [
  { label: 'HTTPS 强制', value: transport.httpsForce ? '已启用' : '未启用', color: transport.httpsForce ? '#00A854' : '#ED7B2F' },
  { label: '最低 TLS 版本', value: transport.tlsVersion, color: '#2B6CB0' },
  { label: '在管证书', value: `${certificates.value.length} 张`, color: '#2B6CB0' },
  { label: '待轮换密钥', value: `${keys.value.filter((k) => k.status === '即将轮换' || k.status === '已过期').length} 把`, color: '#ED7B2F' },
  { label: '密钥总数', value: `${keys.value.length} 把`, color: '#4A4A4A' },
])

const runSecurityCheck = () => ElMessage.success('安全巡检完成：发现 1 个明文通道、1 张过期证书（Mock）')
const manageCert = () => ElMessage.info('打开证书管理（Mock）')
const renewCert = (row: (typeof certificates.value)[number]) => ElMessage.success(`证书「${row.name}」续期申请已提交（Mock）`)
const certDetail = (row: (typeof certificates.value)[number]) => ElMessage.info(`证书「${row.name}」：颁发机构 ${row.issuer}，有效期至 ${row.expire}（Mock）`)
const enableChannel = (c: (typeof channels)[number]) => ElMessage.warning(`通道「${c.name}」整改任务已下发，升级为 TLS 1.2+（Mock）`)

const rotateKey = (row: KeyRow) => ElMessage.success(`密钥「${row.name}」轮换已触发，新密钥 24 小时内生效（Mock）`)
const destroyKey = (row: KeyRow) => ElMessage.warning(`密钥「${row.name}」销毁已生成审批单，待审批后执行（Mock）`)

const keyDrawerVisible = ref(false)
const keyForm = reactive({
  name: '',
  algorithm: 'SM4',
  usage: '存储加密',
  rotateCycle: '90 天',
  expireAt: '',
  desc: '',
})

const openKeyDrawer = () => {
  Object.assign(keyForm, { name: '', algorithm: 'SM4', usage: '存储加密', rotateCycle: '90 天', expireAt: '', desc: '' })
  keyDrawerVisible.value = true
}

const saveKey = () => {
  if (!keyForm.name.trim()) {
    ElMessage.warning('请输入密钥名称')
    return
  }
  keys.value.unshift({
    name: keyForm.name,
    algorithm: keyForm.algorithm,
    usage: keyForm.usage,
    rotateCycle: keyForm.rotateCycle,
    createdAt: new Date().toLocaleDateString('sv-SE'),
    expireAt: keyForm.expireAt || '—',
    status: '正常',
    statusType: 'success',
  })
  keyDrawerVisible.value = false
  ElMessage.success(`密钥「${keyForm.name}」创建成功（Mock）`)
}

/* ========== 脱敏：规则配置列表 ========== */
const keyword = ref('')
const filterMethod = ref('')
const filterStatus = ref('')
const currentPage = ref(1)
const pageSize = 20
const editorVisible = ref(false)
const editing = ref(false)
const formRef = ref<FormInstance>()

const rules = ref([...mockMaskingRules])

const tablePool = ['passenger_info', 'ticket_sale_detail']

const fieldPool = [
  'passenger_info.cust_name',
  'passenger_info.phone',
  'passenger_info.id_card',
  'passenger_info.address',
  'passenger_info.email',
  'ticket_sale_detail.ticket_no',
  'ticket_sale_detail.amount',
  'ticket_sale_detail.passenger_name',
]

const rolePool = ['运营客服', '数据开发', '统计分析', '安全管理', '外部监管']

const fieldsOfTable = computed(() => fieldPool.filter((f) => f.startsWith(`${form.table}.`)))

const methodTagType: Record<string, 'primary' | 'warning' | 'info'> = {
  替换: 'primary',
  掩码: 'warning',
  哈希: 'info',
}

const ruleStatusTag: Record<string, 'success' | 'warning' | 'info'> = {
  已上线: 'success',
  审批中: 'warning',
  草稿: 'info',
}

const previewSample = '13804213190'

const previewText = computed(() => {
  const f = form
  if (f.method === '掩码') {
    const head = f.mask.headKeep
    const tail = f.mask.tailKeep
    const maskLen = Math.max(0, previewSample.length - head - tail)
    return previewSample.slice(0, head) + f.mask.maskChar.repeat(Math.min(maskLen, 10)) + previewSample.slice(-tail)
  }
  if (f.method === '替换') {
    const ratio = Math.max(1, Math.round((previewSample.length * f.replace.ratio) / 100))
    const base = f.replace.replaceChar.repeat(ratio)
    return f.replace.keepLength ? base.padEnd(previewSample.length, f.replace.replaceChar) : base
  }
  const algo = f.hash.algorithm
  if (algo === 'MD5') return 'md5:9b8f7e6d5c4b3a21'
  if (algo === 'SM3') return 'sm3:a1b2c3d4e5f6a7b8'
  return 'sha256:e3a5f2d8c9b4f1a7'
})

const form = reactive({
  id: '',
  version: 'V1.0',
  name: '',
  description: '',
  table: 'passenger_info',
  field: 'passenger_info.phone',
  method: '掩码',
  preserveFormat: true,
  scope: '查询实时脱敏',
  applyAllRoles: true,
  roles: [] as string[],
  priority: 50,
  immediate: true,
  effectiveDate: '',
  remark: '',
  committed: '草稿',
  mask: { headKeep: 3, tailKeep: 4, maskChar: '*' },
  replace: { replaceChar: '*', ratio: 80, keepLength: true },
  hash: { algorithm: 'SHA-256', salt: true },
})

const filteredRules = computed(() =>
  rules.value.filter((rule) => {
    if (filterMethod.value && rule.method !== filterMethod.value) return false
    if (filterStatus.value && rule.status !== filterStatus.value) return false
    if (!keyword.value) return true
    const kw = keyword.value.toLowerCase()
    return rule.name.toLowerCase().includes(kw) || rule.field.toLowerCase().includes(kw)
  }),
)

const pagedRules = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredRules.value.slice(start, start + pageSize)
})

const changePage = (page: number) => (currentPage.value = page)

watch([keyword, filterMethod, filterStatus], () => {
  currentPage.value = 1
})

const formRules: FormRules = {
  name: [{ required: true, message: '请输入规则名称', trigger: 'blur' }],
  field: [{ required: true, message: '请选择目标字段', trigger: 'change' }],
  scope: [{ required: true, message: '请选择脱敏场景', trigger: 'change' }],
  roles: [{ type: 'array', required: true, min: 1, message: '请至少指定一个角色', trigger: 'change' }],
  effectiveDate: [{ required: true, message: '请选择生效日期', trigger: 'change' }],
}

const resetForm = () => {
  Object.assign(form, {
    id: '',
    version: 'V1.0',
    name: '',
    description: '',
    table: 'passenger_info',
    field: fieldsOfTable.value[0] || 'passenger_info.phone',
    method: '掩码',
    preserveFormat: true,
    scope: ['查询实时脱敏'],
    applyAllRoles: true,
    roles: [],
    priority: 50,
    immediate: true,
    effectiveDate: '',
    remark: '',
    committed: '草稿',
    mask: { headKeep: 3, tailKeep: 4, maskChar: '*' },
    replace: { replaceChar: '*', ratio: 80, keepLength: true },
    hash: { algorithm: 'SHA-256', salt: true },
  })
}

const openCreate = () => {
  editing.value = false
  resetForm()
  editorVisible.value = true
  nextTick(() => formRef.value?.clearValidate())
}

const openEdit = (row: MaskingRule) => {
  editing.value = true
  const table = row.field.split('.')[0] || 'passenger_info'
  Object.assign(form, {
    id: row.id,
    version: row.version,
    name: row.name,
    description: row.description ?? '',
    table,
    field: row.field,
    method: row.method,
    preserveFormat: row.preserveFormat,
    scope: row.scope.split('、')[0],
    applyAllRoles: !row.roles || row.roles.includes('全部角色'),
    roles: row.roles && !row.roles.includes('全部角色') ? row.roles : [],
    priority: row.priority ?? 50,
    immediate: !row.effectiveDate || row.effectiveDate === '立即生效',
    effectiveDate: row.effectiveDate && row.effectiveDate !== '立即生效' ? row.effectiveDate : '',
    remark: '',
    committed: row.status,
    mask: {
      headKeep: row.maskParams?.headKeep ?? 3,
      tailKeep: row.maskParams?.tailKeep ?? 4,
      maskChar: row.maskParams?.maskChar ?? '*',
    },
    replace: {
      replaceChar: row.replaceParams?.replaceChar ?? '*',
      ratio: row.replaceParams?.ratio ?? 80,
      keepLength: true,
    },
    hash: {
      algorithm: row.hashParams?.algorithm ?? 'SHA-256',
      salt: row.hashParams?.salt ?? true,
    },
  })
  editorVisible.value = true
  nextTick(() => formRef.value?.clearValidate())
}

const buildPayload = (status: MaskingRule['status']): MaskingRule => ({
  id: editing.value ? form.id : `msk-mock-${Date.now()}`,
  name: form.name,
  field: form.field,
  method: form.method as MaskingRule['method'],
  preserveFormat: form.preserveFormat,
  sampleBefore: previewSample,
  sampleAfter: previewText.value,
  scope: form.scope,
  status,
  version: editing.value ? form.version : 'V1.0',
  updateTime: new Date().toLocaleString('sv-SE').replace('T', ' '),
  description: form.description.trim() || undefined,
  priority: form.priority,
  roles: form.applyAllRoles ? ['全部角色'] : form.roles,
  effectiveDate: form.immediate ? '立即生效' : form.effectiveDate,
  maskParams: { headKeep: form.mask.headKeep, tailKeep: form.mask.tailKeep, maskChar: form.mask.maskChar },
  replaceParams: { replaceChar: form.replace.replaceChar, ratio: form.replace.ratio },
  hashParams: { algorithm: form.hash.algorithm, salt: form.hash.salt },
})

const submitMaskingForm = async () => {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  // 编辑保存时保留原状态，新增提交进入审批
  const status: MaskingRule['status'] = editing.value ? (form.committed as MaskingRule['status']) ?? '草稿' : '审批中'
  const payload = buildPayload(status)
  if (editing.value) {
    const idx = rules.value.findIndex((r) => r.id === form.id)
    if (idx >= 0) rules.value[idx] = payload
    ElMessage.success(`脱敏规则「${form.name}」已保存并进入审批（Mock）`)
  } else {
    rules.value.unshift(payload)
    ElMessage.success('脱敏规则已提交审批（Mock）')
  }
  editorVisible.value = false
}

const saveAsDraft = async () => {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  const payload = buildPayload('草稿')
  if (editing.value) {
    const idx = rules.value.findIndex((r) => r.id === form.id)
    if (idx >= 0) rules.value[idx] = payload
  } else {
    rules.value.unshift(payload)
  }
  ElMessage.success(`脱敏规则「${form.name}」已保存为草稿（Mock）`)
  editorVisible.value = false
}

const versionHistory = (row: MaskingRule) => {
  ElMessage.info(`「${row.name}」版本历史：${row.version} → V${Number(row.version.slice(1)) + 1}.0（Mock）`)
}

const onlineRule = (row: MaskingRule) => {
  row.status = row.status === '已上线' ? '草稿' : '已上线'
  ElMessage.success(`规则「${row.name}」已${row.status === '已上线' ? '上线' : '下线'}（Mock）`)
}
</script>

<style lang="scss" scoped>
.encrypt-page {
  height: 100%;
}

.encrypt-tabs-wrap {
  height: 100%;
  min-height: 560px;
  display: flex;
  flex-direction: column;

  :deep(.el-tabs--border-card) {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    border-radius: 8px;
  }

  :deep(.el-tabs__header) {
    margin-bottom: 0;
  }

  :deep(.el-tabs__content) {
    flex: 1;
    min-height: 0;
    overflow: hidden;
  }

  :deep(.el-tab-pane) {
    height: 100%;
    overflow: hidden;
  }
}

/* ========== 加密页 ========== */
.encrypt-pane {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.encrypt-stats {
  display: flex;
  gap: 12px;
  flex: none;
}

.encrypt-stat {
  flex: 1;
  border: 1px solid #edf0f5;
  border-radius: 8px;
  padding: 12px 14px;
  text-align: center;
  background: #fafafa;
}

.encrypt-stat-value {
  font-size: 20px;
  font-weight: 700;
  line-height: 1.2;
}

.encrypt-stat-label {
  margin-top: 4px;
  font-size: 12px;
  color: #8c8c8c;
}

.encrypt-rows {
  flex: 1;
  min-height: 0;
  margin: 0 !important;

  :deep(.el-col) {
    height: 100%;
  }
}

.encrypt-card {
  height: 100%;
  display: flex;
  flex-direction: column;

  :deep(.el-card__body) {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    padding: 12px 16px;
  }

  :deep(.el-table) {
    flex: 1;
    min-height: 0;
  }
}

.transport-form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px 24px;
  background: #f7f8fa;
  border-radius: 8px;
  padding: 12px 14px;
}

.tf-item {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.tf-label {
  width: 84px;
  flex: none;
  text-align: right;
  font-size: 12px;
  color: #4a4a4a;
  font-weight: 600;
}

.tf-select {
  width: 158px;
}

.tf-tip {
  font-size: 12px;
  color: #8c8c8c;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.block-title {
  font-size: 13px;
  font-weight: 700;
  color: #4a4a4a;
  margin: 12px 0 8px;
}

.channel-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 4px;
}

.channel-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 10px;
  background: #f7f8fa;
  border-radius: 6px;
}

.channel-name {
  flex: 1;
  font-size: 12px;
  color: #333;
  font-weight: 600;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.channel-protocol {
  font-size: 12px;
  color: #8c8c8c;
}

.life-policy {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: #f7f8fa;
  border-radius: 8px;
  padding: 10px 12px;
}

.lp-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.lp-label {
  width: 76px;
  flex: none;
  font-size: 12px;
  color: #4a4a4a;
  font-weight: 600;
}

.lp-number {
  width: 110px;
}

.key-name-cell {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-weight: 600;
  color: #333;
}

.key-ic {
  color: #b6bfcb;
}

/* ========== 脱敏页 ========== */
.mask-pane {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.mask-toolbar {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: none;
}

.toolbar-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.mask-pane {
  :deep(.el-table) {
    flex: 1;
    min-height: 0;
  }

  .pager {
    flex: none;
    display: flex;
    justify-content: flex-end;
  }
}

/* ========== 脱敏规则弹框 ========== */
.mask-rule-dialog {
  .rule-section-title {
    font-size: 13px;
    font-weight: 700;
    color: #4a4a4a;
    border-left: 3px solid #da251d;
    padding-left: 8px;
    margin: 2px 0 12px;

    &:not(:first-child) {
      margin-top: 14px;
    }
  }

  .mask-preview {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    background: #f7f8fa;
    border-radius: 6px;
    padding: 6px 12px;
  }

  .preview-before {
    font-size: 13px;
    font-weight: 600;
    color: #333;
    font-family: Consolas, Monaco, monospace;
  }

  .preview-arrow {
    color: #b6bfcb;
  }

  .dep-text {
    font-size: 12px;
    color: #8c8c8c;
  }
}
</style>