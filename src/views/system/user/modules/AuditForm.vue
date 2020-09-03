<template>
  <a-drawer
    title="审核信息"
    :maskClosable="true"
    :width="640"
    placement="right"
    :closable="true"
    @close="handleCancel"
    :visible="visible"
    class="detail-form"
  >
    <a-spin :spinning="confirmLoading">
      <a-card :bordered="false">
        <a-descriptions :column="2">
          <a-descriptions-item label="头像" :span="2">
            <a-avatar shape="square" :size="80" :src="model.image" />
          </a-descriptions-item>
          <a-descriptions-item label="昵称">{{model.nickName}}</a-descriptions-item>
          <a-descriptions-item label="性别">{{model.gender==1?"男":"女"}}</a-descriptions-item>
          <a-descriptions-item label="手机号">{{model.mobile}}</a-descriptions-item>
          <a-descriptions-item label="所属角色">{{model.accountTypeDesc}}</a-descriptions-item>
          <a-descriptions-item label="微信号" :span="2">{{model.unionId}}</a-descriptions-item>
          <a-descriptions-item label="应用ID" :span="2">{{model.appId}}</a-descriptions-item>
          <a-descriptions-item label="邀请方">{{model.parentName}}</a-descriptions-item>
          <a-descriptions-item label="等级">{{model.levelName}}</a-descriptions-item>
          <a-descriptions-item label="可提现余额">{{model.balance}}</a-descriptions-item>
          <a-descriptions-item label="累计收益">{{model.allAmount}}</a-descriptions-item>
          <a-descriptions-item label="累计客户">{{model.cusCount}}</a-descriptions-item>
          <a-descriptions-item label="审核状态">{{model.auditStatusDesc}}</a-descriptions-item>
          <a-descriptions-item label="加入时间" :span="2">{{model.startTime}}</a-descriptions-item>
          <a-descriptions-item label="备注" :span="2">{{model.remark}}</a-descriptions-item>
        </a-descriptions>
        <a-divider class="my-divider" />
        <a-form :form="form">
          <a-form-item label="原因">
            <a-textarea
              v-decorator="['remark',validatorRules.remark]"
              :rows="3"
              placeholder="描述..."
            />
          </a-form-item>
        </a-form>
      </a-card>
    </a-spin>
    <div class="drawer-bootom-button">
      <a-button @click="handleAudit($event,false)">拒 绝</a-button>
      <a-button type="primary" @click="handleAudit($event,true)">同 意</a-button>
    </div>
  </a-drawer>
</template>

<script>
import modalMixin from '@/components/Mixins/modal'
import { axios } from '@/utils/request'

export default {
  name: 'AuditForm',
  mixins: [modalMixin],
  components: {},
  data() {
    return {
      Urls: {
        getByIdUrl: '/api/user/get/',
        editUrl: '/api/user/update/',
      },
      validatorRules: {
        remark: {
          rules: [
            {
              required: true,
              message: '请填写原因!',
            },
          ],
        },
      },
    }
  },
  computed: {},
  methods: {
    handleAudit(e, flag) {
      e.preventDefault()
      this.confirmLoading = true
      if (flag) {
        this.handleAjax(flag, {})
      } else {
        this.form.validateFields((err, values) => {
          if (!err) {
            this.handleAjax(flag, values)
          } else {
            this.confirmLoading = false
          }
        })
      }
    },
    handleAjax(flag, values) {
      axios({
        url: this.Urls.editUrl + this.model.id,
        method: 'post',
        data: {
          auditStatus: flag ? 'PASS' : 'REJECT',
          remark: values.remark,
        },
      })
        .then((res) => {
          this.confirmLoading = false
          if (res.code == 0) {
            this.$message.success(`审核通过`)
            this.visible = false
            this.$emit('ok')
          } else {
            this.$message.error(`${res.msg}`)
          }
        })
        .catch(() => {
          this.confirmLoading = false
        })
    },
  },
}
</script>

<style lang="less" scoped>
</style>