<template>
  <a-form-model ref="ruleForm" :model="model" class="my-form">
    <a-spin :spinning="confirmLoading">
      <div class="card-wrap">
        <a-card :bodyStyle="{padding: 0}">
          <LoanAmountCal ref="loadModal" />
          <div class="card-item" style="margin-bottom: 8px">
            <a-row :gutter="gutter">
              <div class="loan-limit">
                <a-button type="primary" @click="handleCalculate">计算贷款额度</a-button>
              </div>
              <template v-if="model.id">
                <a-col :xs="24" :sm="24" :md="12" :xl="16">
                  <a-form-model-item
                    :labelCol="labelRowCol"
                    :wrapperCol="wrapperRowCol"
                    label="编号"
                    style="margin-bottom: 0"
                  >{{model.id}}</a-form-model-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="12" :xl="8">
                  <a-form-model-item
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    label="日期"
                    style="margin-bottom: 0"
                  >{{model.createTime}}</a-form-model-item>
                </a-col>
              </template>
              <a-col :xs="24" :sm="24" :md="12" :xl="8">
                <a-form-model-item
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                  label="贷款品类"
                  prop="loan.loanSubType"
                  :rules="rules.must"
                >
                  <a-select placeholder="请选择" v-model="model.loan.loanSubType">
                    <a-select-option v-for="item in loanTypeList" :key="item.key">{{ item.value }}</a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col :xs="24" :sm="24" :md="12" :xl="8">
                <a-form-model-item
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                  label="业务类型"
                  prop="loan.loanType"
                  :rules="rules.must"
                >
                  <a-select placeholder="请选择" v-model="model.loan.loanType">
                    <a-select-option v-for="item in loanTypeList" :key="item.key">{{ item.value }}</a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col :xs="24" :sm="24" :md="12" :xl="8">
                <a-form-model-item :labelCol="labelCol" :wrapperCol="{ span: 12, offset: 4 }">
                  <a-checkbox v-model="model.escrowAgreement">是否需要资金托管</a-checkbox>
                </a-form-model-item>
              </a-col>
            </a-row>
          </div>
          <!-- 贷款信息 -->
          <div class="card-item" style="margin-bottom: 8px">
            <a-row :gutter="gutter">
              <a-col :xs="24" :sm="24" :md="12" :xl="8">
                <a-form-model-item
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                  label="成交金额"
                  prop="loan.finalPrice"
                  :rules="rules.must"
                >
                  <a-input
                    suffix="元"
                    type="number"
                    placeholder="请输入成交金额"
                    v-model="model.loan.finalPrice"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :xs="24" :sm="24" :md="12" :xl="8">
                <a-form-model-item
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                  label="公积金余额"
                  prop="loan.fundSum"
                  :rules="rules.must"
                >
                  <a-input
                    suffix="元"
                    type="number"
                    placeholder="请输入公积金余额"
                    v-model="model.loan.fundSum"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :xs="24" :sm="24" :md="12" :xl="8">
                <a-form-model-item
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                  label="首付金额"
                  prop="loan.downPayment"
                  :rules="rules.must"
                >
                  <a-input
                    suffix="元"
                    type="number"
                    placeholder="请输入首付金额"
                    v-model="model.loan.downPayment"
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
                          <a-form-model-item
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
                          </a-form-model-item>
                        </template>
                        <a-icon type="plus-square" class="read-card-icon" />
                      </a-popover>
                    </template>
                  </a-input>
                </a-form-model-item>
              </a-col>
              <a-col :xs="24" :sm="24" :md="12" :xl="8">
                <a-form-model-item
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                  label="商贷金额"
                  prop="loan.commercialSum"
                  :rules="rules.must"
                >
                  <a-input
                    suffix="元"
                    type="number"
                    placeholder="请输入商贷金额"
                    v-model="model.loan.commercialSum"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :xs="24" :sm="24" :md="12" :xl="8">
                <a-form-model-item
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                  label="贷款期数"
                  prop="loan.comclTimeLimit"
                  :rules="rules.must"
                >
                  <a-input
                    suffix="月"
                    type="number"
                    placeholder="请输入贷款期限"
                    v-model="model.loan.comclTimeLimit"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :xs="24" :sm="24" :md="12" :xl="8">
                <a-form-model-item
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                  label="贷款银行"
                  prop="loan.loanBankName"
                  :rules="rules.must"
                >
                  <a-select placeholder="请选择" v-model="model.loan.loanBankName">
                    <a-select-option v-for="item in bankList" :key="item.key">{{ item.value }}</a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
            </a-row>
          </div>
          <!-- 监管账户 -->
          <div class="card-item" style="margin-bottom: 8px">
            <a-row :gutter="gutter">
              <a-col :xs="24" :sm="24" :md="12" :xl="8">
                <a-form-model-item
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                  label="监管银行"
                  prop="supervisoryBankName"
                  :rules="rules.must"
                >
                  <a-select placeholder="请选择" v-model="model.supervisoryBankName">
                    <a-select-option v-for="item in bankList" :key="item.key">{{ item.value }}</a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col :xs="24" :sm="24" :md="12" :xl="8">
                <a-form-model-item
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                  label="监管账户"
                  prop="supervisoryBankAccount"
                  :rules="rules.must"
                >
                  <a-input placeholder="请输入监管账户" v-model="model.supervisoryBankAccount" />
                </a-form-model-item>
              </a-col>
            </a-row>
          </div>
          <!-- 房产信息 -->
          <div class="card-item" style="margin-bottom: 8px">
            <a-row :gutter="gutter">
              <a-col :xs="24" :sm="24" :md="12" :xl="8">
                <a-form-model-item
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                  label="权利人"
                  prop="property.propertyOwner"
                  :rules="rules.must"
                >
                  <a-input placeholder="请输入权利人" v-model="model.property.propertyOwner" />
                </a-form-model-item>
              </a-col>
              <a-col :xs="24" :sm="24" :md="12" :xl="8">
                <a-form-model-item
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                  label="产权证号"
                  prop="property.propertyNo"
                  :rules="rules.must"
                >
                  <a-input placeholder="请输入产权证号" v-model="model.property.propertyNo" />
                </a-form-model-item>
              </a-col>
              <a-col :xs="24" :sm="24" :md="12" :xl="8">
                <a-form-model-item
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                  label="房屋面积"
                  prop="property.builtUpArea"
                  :rules="rules.must"
                >
                  <a-input
                    suffix="平方米"
                    type="number"
                    placeholder="请输入房屋面积"
                    v-model="model.property.builtUpArea"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :xs="24" :sm="24" :md="12" :xl="8">
                <a-form-model-item
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                  label="权属情况"
                  prop="property.isMortgage"
                  :rules="rules.must"
                >
                  <a-select placeholder="请选择" v-model="model.property.isMortgage">
                    <a-select-option :value="1">有抵押</a-select-option>
                    <a-select-option :value="0">无抵押</a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col :xs="24" :sm="24" :md="24" :xl="16">
                <a-form-model-item
                  :labelCol="labelRowCol"
                  :wrapperCol="wrapperRowCol"
                  label="房屋地址"
                  prop="property.propertyAddr"
                  :rules="rules.must"
                >
                  <a-input read-only placeholder="请输入你的详细地址" v-model="model.property.propertyAddr" />
                </a-form-model-item>
              </a-col>
              <a-col :xs="24" :sm="24" :md="12" :xl="8">
                <a-form-model-item
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                  label="房龄"
                  prop="property.housingAge"
                  :rules="rules.must"
                >
                  <a-input
                    suffix="年"
                    type="number"
                    placeholder="请输入房龄"
                    v-model="model.property.housingAge"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :xs="24" :sm="24" :md="12" :xl="8">
                <a-form-model-item
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                  label="房屋土地使用年限"
                  prop="property.landUsageTerm"
                >
                  <a-input
                    suffix="年"
                    type="number"
                    placeholder="请输入房屋土地使用年限"
                    v-model="model.property.landUsageTerm"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :xs="24" :sm="24" :md="12" :xl="8">
                <a-form-model-item
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                  label="房屋竣工时间"
                  prop="property.completionDate"
                >
                  <a-date-picker
                    format="YYYY-MM-DD"
                    style="width: 100%"
                    v-model="model.property.completionDate"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :xs="24" :sm="24" :md="12" :xl="8">
                <a-form-model-item
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                  label="网签编号"
                  prop="property.signedOnlineNo"
                >
                  <a-input placeholder="请输入网签编号" v-model="model.property.signedOnlineNo" />
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row :gutter="gutter">
              <a-col :xs="24" :sm="24" :md="24" :xl="16">
                <a-form-model-item
                  :labelCol="labelRowCol"
                  :wrapperCol="wrapperRowCol"
                  label="不动产权证"
                  prop="property.housingAge"
                  :rules="rules.must"
                >
                  <UploadFile
                    v-model="model.property.propertyCert"
                    :fileIds="model.property.propertyCert"
                    @setFileValue="file => setFileValue(file, 'property', 'propertyCert')"
                  />
                </a-form-model-item>
              </a-col>
            </a-row>
          </div>
          <!-- 评估信息 -->
          <div class="card-item" style="margin-bottom: 8px">
            <a-row :gutter="gutter">
              <a-col :xs="24" :sm="24" :md="12" :xl="16">
                <a-form-model-item
                  :labelCol="labelRowCol"
                  :wrapperCol="wrapperRowCol"
                  label="评估公司"
                  prop="loan.appraisers"
                >
                  <a-input placeholder="请输入评估公司" v-model="model.loan.appraisers" />
                </a-form-model-item>
              </a-col>
              <a-col :xs="24" :sm="24" :md="12" :xl="8">
                <a-form-model-item
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                  label="评估金额"
                  prop="loan.appraiseAccount"
                >
                  <a-input
                    suffix="元"
                    type="number"
                    placeholder="请输入评估金额"
                    v-model="model.loan.appraiseAccount"
                  />
                </a-form-model-item>
              </a-col>
            </a-row>
          </div>
          <!-- 中介 -->
          <div class="card-item" style="margin-bottom: 8px">
            <a-row :gutter="gutter">
              <a-col :xs="24" :sm="24" :md="12" :xl="16">
                <a-form-model-item
                  :labelCol="labelRowCol"
                  :wrapperCol="wrapperRowCol"
                  label="中介公司"
                  prop="agency"
                >
                  <a-input placeholder="请输入中介公司" v-model="model.agency" />
                </a-form-model-item>
              </a-col>
              <a-col :xs="24" :sm="24" :md="12" :xl="8">
                <a-form-model-item
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                  label="经办人"
                  prop="agent"
                >
                  <a-input placeholder="请输入经办人姓名" v-model="model.agent" />
                </a-form-model-item>
              </a-col>
            </a-row>
          </div>
        </a-card>
      </div>

      <a-form-model-item class="form-btn" style="margin-top: 24px">
        <a-button @click="handleReturn">取 消</a-button>
        <a-button type="primary" @click="handleOk" style="margin-left: 8px">保 存</a-button>
      </a-form-model-item>
    </a-spin>
  </a-form-model>
</template>

<script>
import modalMixin from '@/components/Mixins/form'
import indexMixin from './modules/Tab3'
import LoanAmountCal from './modules/LoanAmountCal'
import UploadFile from '@/components/Upload/file'
export default {
  name: 'Tab3',
  mixins: [modalMixin, indexMixin],
  components: {
    LoanAmountCal,
    UploadFile,
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
