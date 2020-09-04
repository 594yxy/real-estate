<template>
  <a-form :form="form" class="my-form" style="max-width: 1200px;">
    <a-tabs default-active-key="1" type="card" size="small">
      <a-tab-pane key="1" tab="买方信息">
        <!-- 基本信息 -->
        <div class="card-wrap">
          <div class="card-header">
            <span class="title">基本信息：</span>
            <a-button type="primary" class="mr-8">添加买方</a-button>
            <a-button>第三方垫付</a-button>
          </div>
          <a-card :bodyStyle="{padding: 0}">
            <div class="card-item">
              <a-row :gutter="gutter">
                <a-col :xs="24" :sm="24" :md="12" :xl="8">
                  <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="姓名">
                    <a-input placeholder="请输入姓名" v-decorator="['buyerName', validatorRules.must]" />
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="12" :xl="8">
                  <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="身份证号">
                    <a-input
                      placeholder="请输入身份证号码"
                      v-decorator="['buyerExpiryDate', validatorRules.must]"
                    />
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="12" :xl="8">
                  <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="性别">
                    <a-select placeholder="请选择" v-decorator="['buyerSex', validatorRules.must]">
                      <a-select-option value="1">男</a-select-option>
                      <a-select-option value="0">女</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="12" :xl="8">
                  <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="身份证有效期">
                    <a-range-picker
                      v-decorator="['buyerIdCard', validatorRules.must]"
                      format="YYYY-MM-DD"
                      style="width: 100%"
                    />
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="12" :xl="8">
                  <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="联系电话">
                    <a-input
                      placeholder="请输入11位手机号码"
                      v-decorator="['buyerPhone', validatorRules.must]"
                    />
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="12" :xl="8">
                  <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="婚姻状况">
                    <a-select
                      placeholder="请选择"
                      v-decorator="['buyerMaritalStatus', validatorRules.must]"
                    >
                      <a-select-option value="1">已婚</a-select-option>
                      <a-select-option value="0">未婚</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="gutter">
                <a-col :xs="24" :sm="24" :md="24" :xl="16">
                  <a-form-item
                    :labelCol="labelRowCol"
                    :wrapperCol="wrapperRowCol"
                    label="地址"
                    style="margin-bottom: 6px"
                  >
                    <a-textarea
                      placeholder="详细地址"
                      v-decorator="['buyerAddress', validatorRules.must]"
                      allow-clear
                    />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="gutter">
                <a-col :xs="24" :sm="24" :md="24" :xl="16">
                  <a-form-item
                    :labelCol="labelRowCol"
                    :wrapperCol="wrapperRowCol"
                    label="身份证"
                    style="margin-bottom: 0"
                  >
                    <UploadImg tip="人像面照片" />
                    <UploadImg tip="国徽面照片" />
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="12" :xl="8">
                  <a-form-item
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    label="离婚证"
                    style="margin-bottom: 0"
                  >
                    <UploadImg tip="离婚证" />
                  </a-form-item>
                </a-col>
              </a-row>
            </div>
            <a-divider class="my-divider" />
            <div class="card-item">
              <a-row :gutter="gutter">
                <a-col :xs="24" :sm="24" :md="12" :xl="8">
                  <a-form-item label="工作单位">
                    <a-input
                      placeholder="请输入工作单位"
                      v-decorator="['buyerWorkUnit', validatorRules.must]"
                    />
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="12" :xl="8">
                  <a-form-item label="月收入">
                    <a-input
                      placeholder="请输入月收入"
                      v-decorator="['buyerMonthlyIncome', validatorRules.must]"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-form-item label="单位地址">
                <a-row :gutter="gutter">
                  <a-col :xs="24" :sm="24" :md="12" :xl="8">
                    <a-form-item>
                      <a-select
                        placeholder="选择省份"
                        v-decorator="['provinceId', validatorRules.must]"
                      >
                        <a-select-option value="1">男</a-select-option>
                        <a-select-option value="0">女</a-select-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                  <a-col :xs="24" :sm="24" :md="12" :xl="8">
                    <a-form-item>
                      <a-select placeholder="选择市区" v-decorator="['cityId', validatorRules.must]">
                        <a-select-option value="1">男</a-select-option>
                        <a-select-option value="0">女</a-select-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                  <a-col :xs="24" :sm="24" :md="12" :xl="8">
                    <a-form-item>
                      <a-select
                        placeholder="选择区县"
                        v-decorator="['districtId', validatorRules.must]"
                      >
                        <a-select-option value="1">男</a-select-option>
                        <a-select-option value="0">女</a-select-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                  <a-col :xs="24" :sm="24" :md="12" :xl="16">
                    <a-form-item>
                      <a-input
                        placeholder="道路、门牌号、小区、楼栋号、单元室等"
                        v-decorator="['spouseName', validatorRules.must]"
                      />
                    </a-form-item>
                  </a-col>
                </a-row>
              </a-form-item>
            </div>
            <a-divider class="my-divider" />
            <div class="card-item" style="margin-bottom: 10px">
              <a-row :gutter="gutter">
                <a-col :xs="24" :sm="24" :md="24" :xl="3">
                  <h4 style="line-height: 40px">公积金信息：</h4>
                </a-col>
                <a-col :xs="24" :sm="24" :md="12" :xl="8">
                  <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="工资">
                    <a-input
                      placeholder="请输入月工资"
                      v-decorator="['buyerWorkUnit', validatorRules.must]"
                    />
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="12" :xl="8">
                  <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="月缴费用">
                    <a-input
                      placeholder="请输入月收入"
                      v-decorator="['buyerMonthlyIncome', validatorRules.must]"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
            </div>
          </a-card>
        </div>
        <!-- 配偶信息 -->
        <div class="card-wrap">
          <div class="card-header">
            <span class="title">配偶信息：</span>
          </div>
          <a-card :bodyStyle="{padding: 0}">
            <div class="card-item">
              <a-row :gutter="gutter">
                <a-col :xs="24" :sm="24" :md="12" :xl="8">
                  <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="姓名">
                    <a-input placeholder="请输入姓名" v-decorator="['spouseName', validatorRules.must]" />
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="12" :xl="8">
                  <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="身份证号">
                    <a-input
                      placeholder="请输入身份证号码"
                      v-decorator="['spouseIdCard', validatorRules.must]"
                    />
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="12" :xl="8">
                  <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="性别">
                    <a-select placeholder="请选择" v-decorator="['spouseSex', validatorRules.must]">
                      <a-select-option value="1">男</a-select-option>
                      <a-select-option value="0">女</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="12" :xl="8">
                  <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="身份证有效期">
                    <a-range-picker
                      v-decorator="['spouseExpiryDate', validatorRules.must]"
                      format="YYYY-MM-DD"
                      style="width: 100%"
                    />
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="12" :xl="8">
                  <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="联系电话">
                    <a-input
                      placeholder="请输入11位手机号码"
                      v-decorator="['spousePhone', validatorRules.must]"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="gutter">
                <a-col :xs="24" :sm="24" :md="24" :xl="16">
                  <a-form-item
                    :labelCol="labelRowCol"
                    :wrapperCol="wrapperRowCol"
                    label="地址"
                    style="margin-bottom: 6px"
                  >
                    <a-textarea
                      placeholder="请输入你的详细地址"
                      v-decorator="['spouseAddress', validatorRules.must]"
                      allow-clear
                    />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="gutter">
                <a-col :xs="24" :sm="24" :md="24" :xl="16">
                  <a-form-item
                    :labelCol="labelRowCol"
                    :wrapperCol="wrapperRowCol"
                    label="身份证"
                    style="margin-bottom: 0"
                  >
                    <UploadImg tip="人像面照片" />
                    <UploadImg tip="国徽面照片" />
                  </a-form-item>
                </a-col>
              </a-row>
            </div>
            <a-divider class="my-divider" />
            <div class="card-item">
              <a-row :gutter="gutter">
                <a-col :xs="24" :sm="24" :md="12" :xl="8">
                  <a-form-item label="工作单位">
                    <a-input
                      placeholder="请输入工作单位"
                      v-decorator="['buyerName', validatorRules.must]"
                    />
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="12" :xl="8">
                  <a-form-item label="月收入">
                    <a-input
                      placeholder="请输入月收入"
                      v-decorator="['buyerExpiryDate', validatorRules.must]"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-form-item label="单位地址">
                <a-row :gutter="gutter">
                  <a-col :xs="24" :sm="24" :md="12" :xl="8">
                    <a-form-item>
                      <a-select placeholder="请选择" v-decorator="['buyerSex', validatorRules.must]">
                        <a-select-option value="1">男</a-select-option>
                        <a-select-option value="0">女</a-select-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                  <a-col :xs="24" :sm="24" :md="12" :xl="8">
                    <a-form-item>
                      <a-select placeholder="请选择" v-decorator="['buyerSex', validatorRules.must]">
                        <a-select-option value="1">男</a-select-option>
                        <a-select-option value="0">女</a-select-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                  <a-col :xs="24" :sm="24" :md="12" :xl="8">
                    <a-form-item>
                      <a-select placeholder="请选择" v-decorator="['buyerSex', validatorRules.must]">
                        <a-select-option value="1">男</a-select-option>
                        <a-select-option value="0">女</a-select-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                  <a-col :xs="24" :sm="24" :md="12" :xl="16">
                    <a-form-item>
                      <a-input
                        placeholder="道路、门牌号、小区、楼栋号、单元室等"
                        v-decorator="['spouseName', validatorRules.must]"
                      />
                    </a-form-item>
                  </a-col>
                </a-row>
              </a-form-item>
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
                <a-col :xs="24" :sm="24" :md="12" :xl="8">
                  <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="开户名">
                    <a-input placeholder="请输入开户名" v-decorator="['buyerName', validatorRules.must]" />
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="12" :xl="8">
                  <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="所属银行">
                    <a-input
                      placeholder="请输入所属银行"
                      v-decorator="['buyerExpiryDate', validatorRules.must]"
                    />
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="12" :xl="8">
                  <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="开户行">
                    <a-input
                      placeholder="请输入开户行"
                      v-decorator="['buyerExpiryDate', validatorRules.must]"
                    />
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="12" :xl="8">
                  <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="卡号">
                    <a-input
                      placeholder="请输入卡号"
                      v-decorator="['buyerExpiryDate', validatorRules.must]"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="gutter">
                <a-col :xs="24" :sm="24" :md="24" :xl="16">
                  <a-form-item
                    :labelCol="labelRowCol"
                    :wrapperCol="wrapperRowCol"
                    label="银行卡"
                    style="margin-bottom: 0"
                  >
                    <UploadImg tip="银行卡正面" />
                    <UploadImg tip="银行卡背面" />
                  </a-form-item>
                </a-col>
              </a-row>
            </div>
          </a-card>
        </div>
      </a-tab-pane>
      <a-tab-pane key="2" tab="其它买方">Content of tab 2</a-tab-pane>
    </a-tabs>

    <a-form-item class="form-btn" style="margin-top: 24px">
      <a-button type="primary" size="large" @click="nextStep">下一步</a-button>
    </a-form-item>
  </a-form>
</template>

<script>
import modalMixin from '@/components/Mixins/modal'
import UploadImg from '@/components/Upload/index'
import { axios } from '@/utils/request'
export default {
  name: 'Step1',
  mixins: [modalMixin],
  components: {
    UploadImg,
  },
  data() {
    return {
      // :xs="24" :sm="24" :md="12" :xl="8"
      labelCol: { xxl: { span: 8 }, xl: { span: 8 }, sm: { span: 8 } },
      wrapperCol: { xxl: { span: 16 }, xl: { span: 16 }, sm: { span: 16 } },
      labelRowCol: { xxl: { span: 4 }, xl: { span: 4 }, sm: { span: 4 } },
      wrapperRowCol: { xxl: { span: 20 }, xl: { span: 20 }, sm: { span: 20 } },
      gutter: 18,
      validatorRules: {
        must: {
          rules: [
            {
              required: true,
              message: '此字段为必填项！',
            },
          ],
        },
      },
    }
  },
  methods: {
    nextStep() {
      const {
        form: { validateFields },
      } = this
      // 先校验，通过表单校验后，才进入下一步
      validateFields((err, values) => {
        if (!err) {
          this.$emit('nextStep')
        }
      })
    },
  },
}
</script>

<style lang="less" scoped>
.step-form-style-desc {
  padding: 0 56px;
  color: rgba(0, 0, 0, 0.45);

  h3 {
    margin: 0 0 12px;
    color: rgba(0, 0, 0, 0.45);
    font-size: 16px;
    line-height: 32px;
  }

  h4 {
    margin: 0 0 4px;
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
    line-height: 22px;
  }

  p {
    margin-top: 0;
    margin-bottom: 12px;
    line-height: 22px;
  }
}
</style>
