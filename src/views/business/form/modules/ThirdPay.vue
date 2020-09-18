<template>
  <a-modal
    :title="textMap[dialogStatus]"
    :width="800"
    centered
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :maskClosable="false"
    class="my-modal"
  >
    <a-spin :spinning="confirmLoading">
      <a-form-model ref="ruleForm" :model="model" class="my-form">
        <!-- 基础信息 -->
        <div class="card-wrap">
          <a-card :bodyStyle="{padding: 0}">
            <div class="card-item">
              <a-row :gutter="gutter">
                <a-col :xs="24" :sm="24" :md="12" :xl="12">
                  <a-form-model-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="垫付金额">
                    <a-input
                      placeholder="请输入垫付金额"
                      v-decorator="['buyerName', validatorRules.must]"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="12" :xl="12">
                  <a-form-model-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="姓名">
                    <a-input
                      placeholder="请输入姓名"
                      v-decorator="['buyerExpiryDate', validatorRules.must]"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="12" :xl="12">
                  <a-form-model-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="性别">
                    <a-select placeholder="请选择" v-decorator="['buyerSex', validatorRules.must]">
                      <a-select-option value="1">男</a-select-option>
                      <a-select-option value="0">女</a-select-option>
                    </a-select>
                  </a-form-model-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="12" :xl="12">
                  <a-form-model-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="身份证号">
                    <a-input
                      placeholder="请输入身份证号码"
                      v-decorator="['buyerExpiryDate', validatorRules.must]"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="12" :xl="12">
                  <a-form-model-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="身份证有效期">
                    <a-input
                      placeholder="请输入身份证有效期"
                      read-only
                      v-decorator="['expiryDate', validatorRules.must]"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="12" :xl="12">
                  <a-form-model-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="联系电话">
                    <a-input
                      placeholder="请输入11位手机号码"
                      v-decorator="['buyerPhone', validatorRules.must]"
                    />
                  </a-form-model-item>
                </a-col>
              </a-row>
              <a-row :gutter="gutter">
                <a-col :xs="24" :sm="24" :md="24" :xl="24">
                  <a-form-model-item :labelCol="labelRowCol" :wrapperCol="wrapperRowCol" label="地址">
                    <a-input
                      placeholder="请输入详细地址"
                      v-decorator="['buyerAddress', validatorRules.must]"
                    />
                  </a-form-model-item>
                </a-col>
              </a-row>
              <a-row :gutter="gutter">
                <a-col :xs="24" :sm="24" :md="24" :xl="24">
                  <a-form-model-item
                    :labelCol="labelRowCol"
                    :wrapperCol="wrapperRowCol"
                    label="身份证"
                    style="margin-bottom: 0"
                    class="image-box"
                    required
                  >
                    <a-form-model-item>
                      <UploadImg
                        tip="身份证人像面"
                        :isCard1="true"
                        v-decorator="[`idCardFont`, {rules: [{ required: true, message: '请上传身份证人像面图' }]}]"
                      />
                    </a-form-model-item>
                    <a-form-model-item>
                      <UploadImg
                        tip="身份证国徽面"
                        :isCard2="true"
                        v-decorator="[`idCardBack`, {rules: [{ required: true, message: '请上传身份证国徽面图' }]}]"
                      />
                    </a-form-model-item>
                  </a-form-model-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="24" :xl="12" style="margin-bottom: 6px">
                  <a-form-model-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="垫付申请书">
                    <a-upload
                      name="file"
                      :multiple="true"
                      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    >
                      <a-button>
                        <a-icon type="upload" />点击上传
                      </a-button>
                    </a-upload>
                  </a-form-model-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="24" :xl="12">
                  <a-form-model-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="进账凭证">
                    <!-- <UploadImg tip="打印凭证" /> -->
                    <a-upload
                      name="file"
                      :multiple="true"
                      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    >
                      <a-button>
                        <a-icon type="upload" />点击上传
                      </a-button>
                    </a-upload>
                  </a-form-model-item>
                </a-col>
              </a-row>
            </div>
          </a-card>
        </div>
        <!-- 收打款银行 -->
        <div class="card-wrap">
          <div class="card-header">
            <span class="title">收款/打款银行：</span>
            <a-button type="primary" class="mr-8">添加收款银行卡</a-button>
          </div>
          <a-card :bodyStyle="{padding: 0}">
            <div class="card-item">
              <a-row :gutter="gutter">
                <a-col :xs="24" :sm="24" :md="12" :xl="12">
                  <a-form-model-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="开户名">
                    <a-input placeholder="请输入开户名" v-decorator="['buyerName', validatorRules.must]" />
                  </a-form-model-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="12" :xl="12">
                  <a-form-model-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="所属银行">
                    <a-input
                      placeholder="请输入所属银行"
                      v-decorator="['buyerExpiryDate', validatorRules.must]"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="12" :xl="12">
                  <a-form-model-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="开户行">
                    <a-input
                      placeholder="请输入开户行"
                      v-decorator="['buyerExpiryDate', validatorRules.must]"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="12" :xl="12">
                  <a-form-model-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="卡号">
                    <a-input
                      placeholder="请输入卡号"
                      v-decorator="['buyerExpiryDate', validatorRules.must]"
                    />
                  </a-form-model-item>
                </a-col>
              </a-row>
              <a-row :gutter="gutter">
                <a-col :xs="24" :sm="24" :md="24" :xl="24">
                  <a-form-model-item
                    :labelCol="labelRowCol"
                    :wrapperCol="wrapperRowCol"
                    label="银行卡"
                    class="image-box"
                    required
                  >
                    <a-form-model-item>
                      <UploadImg
                        tip="银行卡正面"
                        v-decorator="[`bankFont`, {rules: [{ required: true, message: '请上传银行卡正面' }]}]"
                      />
                    </a-form-model-item>
                    <a-form-model-item>
                      <UploadImg
                        tip="银行卡背面"
                        v-decorator="[`bankBack`, {rules: [{ required: true, message: '请上传银行卡背面' }]}]"
                      />
                    </a-form-model-item>
                  </a-form-model-item>
                </a-col>
              </a-row>
            </div>
          </a-card>
        </div>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
import modalMixin from '@/components/Mixins/modal'
import UploadImg from '@/components/Upload/index'
import { axios } from '@/utils/request'
export default {
  name: 'ThirdPay',
  mixins: [modalMixin],
  components: {
    UploadImg,
  },
  data() {
    return {
      labelCol: { xxl: { span: 8 }, sm: { span: 8 } },
      wrapperCol: { xxl: { span: 16 }, sm: { span: 16 } },
      labelRowCol: { xxl: { span: 4 }, sm: { span: 4 } },
      wrapperRowCol: { xxl: { span: 20 }, sm: { span: 20 } },
      gutter: 10,
      validatorRules: {
        must: { rules: [{ required: true, message: '此字段为必填项！' }] },
      },
      textMap: {
        add: '添加第三方垫付信息',
      },
      model: {
        bankAccountList: [],
      },
      rules: {
        must: {
          required: true,
          message: '此字段为必填！',
          trigger: 'blur',
        },
        phone: [
          {
            required: true,
            message: '此字段为必填！',
            trigger: 'blur',
          },
          {
            validator: this.validator.validatePhone,
            trigger: 'change',
          },
        ],
      },
    }
  },
  methods: {},
}
</script>

<style lang="less" scoped>
</style>
