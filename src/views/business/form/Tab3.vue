<template>
  <div>
    <a-form :form="form" class="my-form">
      <div class="card-wrap">
        <a-card :bodyStyle="{padding: 0}">
          <LoanAmountCal ref="loadModal" />
          <div class="card-item" style="margin-bottom: 8px">
            <a-row :gutter="gutter">
              <div class="loan-limit">
                <a-button type="primary" @click="handleCalculate">计算贷款额度</a-button>
              </div>
              <a-col :xs="24" :sm="24" :md="12" :xl="16">
                <a-form-item
                  :labelCol="labelRowCol"
                  :wrapperCol="wrapperRowCol"
                  label="编号"
                  style="margin-bottom: 0"
                >20200812G101</a-form-item>
              </a-col>
              <a-col :xs="24" :sm="24" :md="12" :xl="8">
                <a-form-item
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                  label="日期"
                  style="margin-bottom: 0"
                >2020-09-16</a-form-item>
              </a-col>
              <a-col :xs="24" :sm="24" :md="12" :xl="8">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="贷款品类">
                  <a-select placeholder="请选择" v-decorator="['loadCategory', validatorRules.must]">
                    <a-select-option value="1">男</a-select-option>
                    <a-select-option value="0">女</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :xs="24" :sm="24" :md="12" :xl="8">
                <a-form-item :labelCol="labelCol" :wrapperCol="{ span: 12, offset: 4 }">
                  <a-checkbox v-decorator="['compose', validatorRules.must]">是否为组合</a-checkbox>
                </a-form-item>
              </a-col>
              <a-col :xs="24" :sm="24" :md="12" :xl="8">
                <a-form-item :labelCol="labelCol" :wrapperCol="{ span: 12, offset: 4 }">
                  <a-checkbox v-decorator="['fundTrusteeship', validatorRules.must]">是否需要资金托管</a-checkbox>
                </a-form-item>
              </a-col>
            </a-row>
          </div>
          <!-- 贷款信息 -->
          <div class="card-item" style="margin-bottom: 8px">
            <a-row :gutter="gutter">
              <a-col :xs="24" :sm="24" :md="12" :xl="8">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="成交金额">
                  <a-input
                    suffix="元"
                    type="number"
                    placeholder="请输入成交金额"
                    v-decorator="['transactionAmount', validatorRules.must]"
                  />
                </a-form-item>
              </a-col>
              <a-col :xs="24" :sm="24" :md="12" :xl="8">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="公积金余额">
                  <a-input
                    suffix="元"
                    type="number"
                    placeholder="请输入公积金余额"
                    v-decorator="['accumulationFundbBalance', validatorRules.must]"
                  />
                </a-form-item>
              </a-col>
              <a-col :xs="24" :sm="24" :md="12" :xl="8">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="首付金额">
                  <a-input
                    suffix="元"
                    type="number"
                    placeholder="请输入首付金额"
                    v-decorator="['firstAmount', validatorRules.must]"
                  >
                    <template slot="addonAfter">
                      <a-popover placement="right" trigger="click">
                        <template slot="content">
                          <a-button
                            size="small"
                            style="margin-bottom: 10px"
                            icon="plus"
                            @click="addDownPayAmount"
                          >追加首付</a-button>
                          <a-form-item
                            style="margin-bottom: 5px"
                            v-for="(k, index) in downPayList"
                            :key="index"
                          >
                            <a-input
                              suffix="元"
                              type="number"
                              placeholder="请输入追加金额"
                              v-decorator="[`downPay${index}`, validatorRules.must]"
                            >
                              <a-icon
                                slot="addonAfter"
                                class="read-card-icon"
                                type="minus-circle-o"
                                @click="delDownPayAmount(index)"
                              />
                            </a-input>
                          </a-form-item>
                        </template>
                        <a-icon type="plus-square" class="read-card-icon" />
                      </a-popover>
                    </template>
                  </a-input>
                </a-form-item>
              </a-col>
              <a-col :xs="24" :sm="24" :md="12" :xl="8">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="商贷金额">
                  <a-input
                    suffix="元"
                    type="number"
                    placeholder="请输入商贷金额"
                    v-decorator="['commercialLoanAmount', validatorRules.must]"
                  />
                </a-form-item>
              </a-col>
              <a-col :xs="24" :sm="24" :md="12" :xl="8">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="贷款期数">
                  <a-input
                    suffix="月"
                    type="number"
                    placeholder="请输入贷款时间"
                    v-decorator="['loanTerm', validatorRules.must]"
                  />
                </a-form-item>
              </a-col>
              <a-col :xs="24" :sm="24" :md="12" :xl="8">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="贷款银行">
                  <a-select placeholder="请选择" v-decorator="['buyerSex', validatorRules.must]">
                    <a-select-option value="1">男</a-select-option>
                    <a-select-option value="0">女</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
          </div>
          <!-- 监管账户 -->
          <div class="card-item" style="margin-bottom: 8px">
            <a-row :gutter="gutter">
              <a-col :xs="24" :sm="24" :md="12" :xl="8">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="监管银行">
                  <a-select placeholder="请选择" v-decorator="['buyerSex', validatorRules.must]">
                    <a-select-option value="1">男</a-select-option>
                    <a-select-option value="0">女</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :xs="24" :sm="24" :md="12" :xl="8">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="监管账户">
                  <a-input
                    placeholder="请输入监管账户"
                    v-decorator="['regulatoryAccount', validatorRules.must]"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </div>
          <!-- 权利人 -->
          <div class="card-item" style="margin-bottom: 8px">
            <a-row :gutter="gutter">
              <a-col :xs="24" :sm="24" :md="12" :xl="8">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="权利人">
                  <a-input placeholder="请输入姓名" v-decorator="['obligeeName', validatorRules.must]" />
                </a-form-item>
              </a-col>
              <a-col :xs="24" :sm="24" :md="12" :xl="8">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="产权证号">
                  <a-input
                    placeholder="请输入产权证号"
                    v-decorator="['PropertyRightCertNo', validatorRules.must]"
                  />
                </a-form-item>
              </a-col>
              <a-col :xs="24" :sm="24" :md="12" :xl="8">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="房屋面积">
                  <a-input
                    suffix="平方米"
                    type="number"
                    placeholder="请输入房屋面积"
                    v-decorator="['houseArea', validatorRules.must]"
                  />
                </a-form-item>
              </a-col>
              <a-col :xs="24" :sm="24" :md="12" :xl="8">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="权属情况">
                  <a-select placeholder="请选择" v-decorator="['qwnership', validatorRules.must]">
                    <a-select-option value="1">男</a-select-option>
                    <a-select-option value="0">女</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :xs="24" :sm="24" :md="24" :xl="16">
                <a-form-item :labelCol="labelRowCol" :wrapperCol="wrapperRowCol" label="房屋地址">
                  <a-input
                    read-only
                    placeholder="请输入你的详细地址"
                    v-decorator="['houseAddress', validatorRules.must]"
                  />
                </a-form-item>
              </a-col>
              <a-col :xs="24" :sm="24" :md="12" :xl="8">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="房龄">
                  <a-select placeholder="请选择" v-decorator="['houseAge', validatorRules.must]">
                    <a-select-option value="1">男</a-select-option>
                    <a-select-option value="0">女</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :xs="24" :sm="24" :md="12" :xl="8">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="房屋竣工时间">
                  <a-range-picker
                    v-decorator="['houseCompleteTime', validatorRules.must]"
                    format="YYYY-MM-DD"
                    style="width: 100%"
                  />
                </a-form-item>
              </a-col>
              <a-col :xs="24" :sm="24" :md="12" :xl="8">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="房屋土地使用年限">
                  <a-input
                    suffix="年"
                    type="number"
                    placeholder="请输入房屋土地使用年限"
                    v-decorator="['houseLandUseTerm', validatorRules.must]"
                  />
                </a-form-item>
              </a-col>
              <a-col :xs="24" :sm="24" :md="12" :xl="8">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="网签编号">
                  <a-input
                    placeholder="请输入网签编号"
                    v-decorator="['onlineSignNumber', validatorRules.must]"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="gutter">
              <a-col :xs="24" :sm="24" :md="24" :xl="16">
                <a-form-item
                  :labelCol="labelRowCol"
                  :wrapperCol="wrapperRowCol"
                  label="不动产权证"
                  required
                >
                  <a-upload
                    :file-list="fileList"
                    :before-upload="beforeUpload"
                    @preview="handlePreview"
                    :multiple="true"
                    v-decorator="['RealEstateCertificate', validatorRules.must]"
                  >
                    <a-button :loading="uploading" icon="upload">点击上传</a-button>
                  </a-upload>
                </a-form-item>
              </a-col>
            </a-row>
          </div>
          <!-- 评估信息 -->
          <div class="card-item" style="margin-bottom: 8px">
            <a-row :gutter="gutter">
              <a-col :xs="24" :sm="24" :md="12" :xl="8">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="评估公司">
                  <a-input
                    placeholder="请输入评估公司"
                    v-decorator="['appraisalCompany', validatorRules.must]"
                  />
                </a-form-item>
              </a-col>
              <a-col :xs="24" :sm="24" :md="12" :xl="8">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="评估金额">
                  <a-input
                    suffix="元"
                    type="number"
                    placeholder="请输入评估金额"
                    v-decorator="['appraisalAmount', validatorRules.must]"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </div>
          <!-- 中介 -->
          <div class="card-item" style="margin-bottom: 8px">
            <a-row :gutter="gutter">
              <a-col :xs="24" :sm="24" :md="12" :xl="8">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="中介公司">
                  <a-input
                    placeholder="请输入中介公司"
                    v-decorator="['intermediaryCompany', validatorRules.must]"
                  />
                </a-form-item>
              </a-col>
              <a-col :xs="24" :sm="24" :md="12" :xl="8">
                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="经办人">
                  <a-input
                    placeholder="请输入经办人姓名"
                    v-decorator="['intermediaryName', validatorRules.must]"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </div>
        </a-card>
      </div>

      <a-form-item class="form-btn" style="margin-top: 24px">
        <a-button>取 消</a-button>
        <a-button type="primary" @click="handleSubmit" style="margin-left: 8px">保 存</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import modalMixin from '@/components/Mixins/modal'
import indexMixin from './modules/Tab3'
import LoanAmountCal from './modules/LoanAmountCal'
export default {
  name: 'Tab3',
  mixins: [modalMixin, indexMixin],
  components: {
    LoanAmountCal,
  },
}
</script>

<style lang="less" scoped>
.loan-limit {
  position: absolute;
  right: -12px;
  z-index: 1000;
  top: -20px;
}
</style>
