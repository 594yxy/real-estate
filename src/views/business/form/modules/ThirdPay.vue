<template>
  <a-modal
    :title="textMap[dialogStatus]"
    :width="800"
    centered
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
    :maskClosable="false"
    class="my-modal"
  >
    <template slot="footer">
      <a-button @click="handleCancel">取 消</a-button>
      <a-button @click="handleReset">清 空</a-button>
      <a-button type="primary" @click="handleOk">保 存</a-button>
    </template>
    <a-spin :spinning="confirmLoading">
      <a-form-model ref="ruleForm" :model="ruleForm" class="my-form">
        <!-- 基础信息 -->
        <div class="card-wrap">
          <a-card :bodyStyle="{ padding: 0 }">
            <div class="card-item">
              <a-row :gutter="gutter">
                <a-col :xs="24" :sm="24" :md="12" :xl="12">
                  <a-form-model-item
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    label="垫付金额"
                    prop="thirdSum"
                    :rules="rules.blur"
                  >
                    <a-input
                      type="number"
                      step="0.01"
                      suffix="元"
                      v-model="ruleForm.thirdSum"
                      placeholder="请输入垫付金额"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="12" :xl="12">
                  <a-form-model-item
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    label="姓名"
                    prop="thirdName"
                    :rules="rules.blur"
                  >
                    <a-input placeholder="请输入姓名" v-model="ruleForm.thirdName">
                      <a-tooltip slot="addonAfter" title="点击读取信息">
                        <a-icon type="idcard" class="read-card-icon" @click.native="getIdCardInfo('third')" />
                      </a-tooltip>
                    </a-input>
                  </a-form-model-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="12" :xl="12">
                  <a-form-model-item
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    label="性别"
                    prop="thirdGender"
                    :rules="rules.change"
                  >
                    <a-select placeholder="请选择" v-model="ruleForm.thirdGender">
                      <a-select-option v-for="item in genderList" :key="item.key">{{ item.value }}</a-select-option>
                    </a-select>
                  </a-form-model-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="12" :xl="12">
                  <a-form-model-item
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    label="身份证号"
                    prop="thirdIdcard"
                    :rules="rules.blur"
                  >
                    <a-input placeholder="请输入身份证号码" v-model="ruleForm.thirdIdcard" />
                  </a-form-model-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="12" :xl="12">
                  <a-form-model-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="身份证有效期" required>
                    <a-input-group compact>
                      <a-form-model-item
                        prop="thirdIdcardStart"
                        :rules="rules.change"
                        style="width: 50%; margin-bottom: 0"
                      >
                        <a-date-picker
                          format="YYYY-MM-DD"
                          v-model="ruleForm.thirdIdcardStart"
                          placeholder="开始日期"
                          @change="(date, dateString) => dateChange(date, dateString, 'third')"
                        />
                      </a-form-model-item>
                      <a-form-model-item prop="thirdIdcardEnd" :rules="rules.date" style="width: 50%; margin-bottom: 0">
                        <a-input v-model="ruleForm.thirdIdcardEnd" placeholder="结束日期" />
                      </a-form-model-item>
                    </a-input-group>
                  </a-form-model-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="12" :xl="12">
                  <a-form-model-item
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    label="联系电话"
                    prop="thirdPhone"
                    :rules="rules.phone"
                  >
                    <a-input :max-length="11" placeholder="请输入11位手机号码" v-model="ruleForm.thirdPhone" />
                  </a-form-model-item>
                </a-col>
              </a-row>
              <a-row :gutter="gutter">
                <a-col :xs="24" :sm="24" :md="24" :xl="24">
                  <a-form-model-item
                    :labelCol="labelRowCol"
                    :wrapperCol="wrapperRowCol"
                    label="地址"
                    prop="thirdAddr"
                    :rules="rules.blur"
                  >
                    <a-input placeholder="请输入详细地址" v-model="ruleForm.thirdAddr" />
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
                    <a-form-model-item
                      prop="thirdIdcardFront"
                      :rules="{ required: true, message: '请上传身份证人像面', trigger: 'change' }"
                    >
                      <UploadImg
                        tip="身份证人像面"
                        :isCard1="true"
                        :ids="ruleForm.thirdIdcardFront"
                        @setImageValue="(file) => setImageData(file, 'thirdIdcardFront')"
                        v-model="ruleForm.thirdIdcardFront"
                      />
                    </a-form-model-item>
                    <a-form-model-item
                      prop="thirdIdcardBack"
                      :rules="{ required: true, message: '请上传身份证国徽面', trigger: 'change' }"
                    >
                      <UploadImg
                        tip="身份证国徽面"
                        :isCard2="true"
                        :ids="ruleForm.thirdIdcardBack"
                        @setImageValue="(file) => setImageData(file, 'thirdIdcardBack')"
                        v-model="ruleForm.thirdIdcardBack"
                      />
                    </a-form-model-item>
                  </a-form-model-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="24" :xl="12" style="margin-bottom: 6px">
                  <a-form-model-item
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    label="垫付申请书"
                    prop="thirdApplication"
                    :rules="{ required: true, message: '请上传垫付申请书', trigger: 'change' }"
                  >
                    <UploadFile
                      v-model="ruleForm.thirdApplication"
                      :ids="ruleForm.thirdApplication"
                      @setFileValue="(file) => setFileValue(file, 'thirdApplication')"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="24" :xl="12">
                  <a-form-model-item
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    label="进账凭证"
                    prop="thirdReceiptsCert"
                    :rules="{ required: true, message: '请上传进账凭证', trigger: 'change' }"
                  >
                    <UploadFile
                      v-model="ruleForm.thirdReceiptsCert"
                      :ids="ruleForm.thirdReceiptsCert"
                      @setFileValue="(file) => setFileValue(file, 'thirdReceiptsCert')"
                    />
                  </a-form-model-item>
                </a-col>
              </a-row>
            </div>
          </a-card>
        </div>
        <!-- 收款银行 -->
        <div class="card-wrap">
          <div class="card-header">
            <span class="title">收款/打款银行：</span>
            <a-button type="primary" class="mr-8" @click="addBank">添加收款银行卡</a-button>
          </div>
          <a-card :bodyStyle="{ padding: 0 }">
            <div class="card-item" v-for="(bank, bankIndex) in ruleForm.bankAccountList" :key="bankIndex">
              <a-row :gutter="gutter">
                <a-col :xs="24" :sm="24" :md="12" :xl="12">
                  <a-form-model-item
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    label="收款人"
                    :prop="'bankAccountList[' + bankIndex + '].accountPersonName'"
                    :rules="rules.blur"
                  >
                    <a-input placeholder="请输入收款人" v-model="bank.accountPersonName" />
                  </a-form-model-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="12" :xl="12">
                  <a-form-model-item
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    label="卡号"
                    :prop="'bankAccountList[' + bankIndex + '].bankCardNo'"
                    :rules="rules.bankCardNo"
                  >
                    <a-input placeholder="请输入卡号" :max-length="20" v-model="bank.bankCardNo">
                      <a-tooltip slot="addonAfter" title="点击上传识别">
                        <a-upload
                          name="file"
                          :show-upload-list="false"
                          :before-upload="OCRBeforeUpload"
                          @change="(info) => getBankInfo(info.file, bankIndex)"
                        >
                          <a-icon type="camera" class="read-card-icon" />
                        </a-upload>
                      </a-tooltip>
                    </a-input>
                  </a-form-model-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="12" :xl="12">
                  <a-form-model-item
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    label="收款银行"
                    :prop="'bankAccountList[' + bankIndex + '].bankName'"
                    :rules="rules.blur"
                  >
                    <a-input placeholder="请输入收款银行" v-model="bank.bankName" />
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
                    <a-form-model-item
                      :prop="'bankAccountList[' + bankIndex + '].bankCardFront'"
                      :rules="{ required: true, message: '请上传银行卡正面', trigger: 'change' }"
                    >
                      <UploadImg
                        tip="银行卡正面"
                        :ids="bank.bankCardFront"
                        @setImageValue="(file) => setBankImageData(file, bankIndex, 'bankCardFront')"
                        v-model="bank.bankCardFront"
                      />
                    </a-form-model-item>
                    <a-form-model-item
                      :prop="'bankAccountList[' + bankIndex + '].bankCardBack'"
                      :rules="{ required: true, message: '请上传银行卡背面', trigger: 'change' }"
                    >
                      <UploadImg
                        tip="银行卡背面"
                        :ids="bank.bankCardBack"
                        @setImageValue="(file) => setBankImageData(file, bankIndex, 'bankCardBack')"
                        v-model="bank.bankCardBack"
                      />
                    </a-form-model-item>
                  </a-form-model-item>
                </a-col>
              </a-row>
              <div class="close-but" v-if="ruleForm.bankAccountList.length > 1">
                <a-icon type="minus-square" @click="removeBank(bankIndex)" />
              </div>
            </div>
          </a-card>
        </div>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
import modalMixin from '@/components/Mixins/form'
import UploadImg from '@/components/Upload/index'
import UploadFile from '@/components/Upload/file'
import { axios } from '@/utils/request'
import moment from 'moment'
import IdCard from '@/components/IdCard/index'
export default {
  name: 'ThirdPay',
  mixins: [modalMixin],
  components: {
    UploadImg,
    UploadFile,
  },
  data() {
    return {
      Urls: {
        addUrl: '/biz/api/business/temp',
        editUrl: '/biz/api/business/update/',
      },
      labelCol: { xxl: { span: 8 }, sm: { span: 8 } },
      wrapperCol: { xxl: { span: 16 }, sm: { span: 16 } },
      labelRowCol: { xxl: { span: 4 }, sm: { span: 4 } },
      wrapperRowCol: { xxl: { span: 20 }, sm: { span: 20 } },
      gutter: 10,
      textMap: {
        add: '添加第三方垫付',
        edit: '修改第三方垫付',
      },
      ruleForm: {
        bankAccountList: [{}],
      },
      businessId: '',
    }
  },
  methods: {
    // 赋值
    setForm(data) {
      console.log('第三方', this.model)
      this.model.isThirdPayment = 1
      if (data.thirdPayment) {
        this.ruleForm = data.thirdPayment
      }
    },
    beforeOpen() {
      this.getDictData('gender', 'genderList')
    },
    handleReset(e) {
      this.$nextTick(() => {
        this.$refs.ruleForm.resetFields()
      })
      this.model.isThirdPayment = 0
      this.handleOk(e)
    },
    // 添加银行
    addBank() {
      this.ruleForm.bankAccountList.push({})
    },
    removeBank(k) {
      if (this.ruleForm.bankAccountList.length === 1) {
        return
      }
      this.ruleForm.bankAccountList.splice(k, 1)
    },
    // 日期格式
    dateChange(date, dateString, type) {
      this.ruleForm[`${type}IdcardStart`] = dateString
    },
    // 获取身份证信息
    async getIdCardInfo(type) {
      let data = await IdCard.setCertificateData()
      console.log('idcard info', data)
      this.$set(this.ruleForm, `${type}Name`, data.Name)
      this.$set(this.ruleForm, `${type}Gender`, data.Sex)
      this.$set(this.ruleForm, `${type}Idcard`, data.IDNumber)
      this.$set(this.ruleForm, `${type}IdcardStart`, moment(data.IssuedData).format('YYYY-MM-DD'))
      this.$set(
        this.ruleForm,
        `${type}IdcardEnd`,
        data.ValidDate == '长期' ? '长期' : moment(data.ValidDate).format('YYYY-MM-DD')
      )
      this.$set(this.ruleForm, `${type}Addr`, data.Address)
    },

    // 获取银行信息
    async getBankInfo(file, bankIndex) {
      let data = await IdCard.setBankData(file)
      console.log('bank Info', data)
      this.$set(this.ruleForm.bankAccountList[bankIndex], 'bankCardNo', data.cardNo)
      this.$set(this.ruleForm.bankAccountList[bankIndex], 'bankName', data.bankName)
      return false
    },

    // 图片验证并设置值
    setImageData(file, field) {
      this.$set(this.ruleForm, `${field}`, file)
      this.fileIds.push(file)
    },
    // 银行图片并设置值
    setBankImageData(file, k, field) {
      this.$set(this.ruleForm.bankAccountList[k], `${field}`, file)
      this.fileIds.push(file)
    },
    // 多图片上传
    setFileValue(ids, field) {
      console.log('多', ids)
      this.fileIds = [this.fileIds, ...ids]
      this.$set(this.ruleForm, `${field}`, ids.join())
    },
    beforeSubmit(form) {
      form.thirdPayment = this.ruleForm
      return form
    },
  },
}
</script>

<style lang="less" scoped>
</style>
