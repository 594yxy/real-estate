<template>
  <a-modal
    title="计算贷款额度"
    :width="600"
    centered
    @cancel="handleCancel"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :maskClosable="false"
    class="my-modal"
  >
    <template slot="footer">
      <a-button @click="handleCancel">取 消</a-button>
      <a-button>填 入</a-button>
      <a-button type="primary" @click="handleSubmit">开始计算</a-button>
    </template>
    <a-spin :spinning="confirmLoading">
      <a-form :form="form" class="my-form">
        <a-card :bodyStyle="{padding: '24px'}">
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="公积金个人月缴存额">
            <a-input placeholder="请输入住房公积金个人月缴存额" v-decorator="['buyerName', validatorRules.must]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="缴存比例">
            <a-input placeholder="请输入缴存比例" v-decorator="['buyerName', validatorRules.must]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="配偶公积金个人月缴存额">
            <a-input
              placeholder="请输入配偶住房公积金个人月缴存额"
              v-decorator="['buyerName', validatorRules.must]"
            />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="缴存比例">
            <a-input placeholder="请输入缴存比例" v-decorator="['buyerName', validatorRules.must]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="房屋评估价值或实际购房款">
            <a-input
              placeholder="请输入房屋评估价值或实际购房款"
              v-decorator="['buyerName', validatorRules.must]"
            />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="房屋性质">
            <a-input placeholder="请输入房屋性质" v-decorator="['buyerName', validatorRules.must]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="贷款申请年限">
            <a-input placeholder="请输入贷款申请年限" v-decorator="['buyerName', validatorRules.must]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="个人信用等级">
            <a-input placeholder="请输入个人信用等级" v-decorator="['buyerName', validatorRules.must]" />
          </a-form-item>
        </a-card>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import modalMixin from '@/components/Mixins/modal'
import { axios } from '@/utils/request'
export default {
  name: 'LoanAmountCal',
  mixins: [modalMixin],
  components: {},
  data() {
    return {
      labelCol: { xxl: { span: 9 }, sm: { span: 9 } },
      wrapperCol: { xxl: { span: 15 }, sm: { span: 15 } },
    }
  },
  methods: {},
}
</script>

<style lang="less" scoped>
</style>
