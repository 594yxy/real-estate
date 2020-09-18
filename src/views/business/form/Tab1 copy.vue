<template>
  <a-form :form="form" class="my-form" @submit="handleSubmit">
    <a-tabs
      v-model="activeKey"
      type="editable-card"
      size="small"
      @change="tabChange"
      @edit="onTabEdit"
    >
      <!-- <template slot="tabBarExtraContent">
        <span class="extra">添加共同购房人</span>
      </template>-->
      <a-tab-pane
        v-for="(pane,index) in buyerList"
        :key="pane.tabKey"
        :tab="pane.title"
        :closable="pane.closable"
      >
        <!-- 基本信息 -->
        <div class="card-wrap">
          <div class="card-header">
            <span class="title">基本信息：</span>
          </div>
          <a-card :bodyStyle="{padding: 0}">
            <div class="card-item">
              <a-row :gutter="gutter">
                <a-col :xs="24" :sm="24" :md="12" :xl="8">
                  <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="借款人">
                    <a-input
                      placeholder="请输入姓名"
                      read-only
                      v-decorator="[`buyerList[${index}][buyerName]`, validatorRules.must]"
                    >
                      <a-tooltip slot="addonAfter" title="点击读取信息">
                        <a-icon
                          type="idcard"
                          class="read-card-icon"
                          @click.native="getIdCardInfo(index, 'buyer')"
                        />
                      </a-tooltip>
                    </a-input>
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="12" :xl="8">
                  <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="性别">
                    <a-select
                      placeholder="请选择"
                      v-decorator="[`buyerList[${index}][buyerGender]`, validatorRules.must]"
                    >
                      <a-select-option v-for="item in genderList" :key="item.key">{{ item.value }}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="12" :xl="8">
                  <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="身份证号">
                    <a-input
                      placeholder="请输入身份证号码"
                      read-only
                      v-decorator="[`buyerList[${index}][buyerIdcard]`, validatorRules.must]"
                    />
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="12" :xl="8">
                  <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="身份证有效期">
                    <a-range-picker
                      format="YYYY-MM-DD"
                      v-decorator="[`buyerList[${index}][buyerIdcardValidity]`, validatorRules.must]"
                    />
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="12" :xl="8">
                  <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="联系电话">
                    <a-input
                      :max-length="11"
                      placeholder="请输入11位手机号码"
                      v-decorator="[`buyerList[${index}][buyerPhone]`, validatorRules.phone]"
                    />
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="12" :xl="8">
                  <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="婚姻情况">
                    <a-select
                      placeholder="请选择"
                      v-decorator="[`buyerList[${index}][buyerMarriage]`, validatorRules.must]"
                      @change="maritalStatusChange"
                    >
                      <a-select-option
                        v-for="item in maritalStatusList"
                        :key="item.key"
                      >{{item.value}}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="gutter">
                <a-col :xs="24" :sm="24" :md="24" :xl="24">
                  <a-form-item
                    :labelCol="labelSingleCol"
                    :wrapperCol="wrapperSingleCol"
                    label="地址"
                    class="row-letter"
                  >
                    <a-input
                      read-only
                      placeholder="请输入你的详细地址"
                      v-decorator="[`buyerList[${index}][buyerAddr]`, validatorRules.must]"
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
                    class="image-box"
                    required
                  >
                    <a-form-item>
                      <UploadImg
                        tip="身份证人像面"
                        :isCard1="true"
                        @setImageValue="file => setImageData(file, index, 'buyerIdcardFront')"
                        v-decorator="[`buyerList[${index}][buyerIdcardFront]`, {rules: [{ required: true, message: '请上传身份证人像面图' }], validateTrigger: 'change'}]"
                      />
                    </a-form-item>
                    <a-form-item>
                      <UploadImg
                        tip="身份证国徽面"
                        :isCard2="true"
                        @setImageValue="file => setImageData(file, index, 'buyerIdcardBack')"
                        v-decorator="[`buyerList[${index}][buyerIdcardBack]`, {rules: [{ required: true, message: '请上传身份证国徽面图' }], validateTrigger: 'change'}]"
                      />
                    </a-form-item>
                  </a-form-item>
                </a-col>
                <a-col
                  :xs="24"
                  :sm="24"
                  :md="12"
                  :xl="8"
                  v-if="form.getFieldValue(`buyerList[${index}][buyerMarriage]`)=='02' || form.getFieldValue(`buyerList[${index}][buyerMarriage]`)=='03'"
                >
                  <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="婚姻证明" required>
                    <UploadImg
                      tip="证件"
                      @setImageValue="file => setImageData(file, index, 'buyerMarriageCert')"
                      v-decorator="[`buyerList[${index}][buyerMarriageCert]`, {rules: [{ required: true, message: '请上传结婚证或者离婚证' }], validateTrigger: 'change'}]"
                    />
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="24" :xl="16">
                  <a-form-item
                    :labelCol="labelRowCol"
                    :wrapperCol="wrapperRowCol"
                    label="户口本"
                    class="image-box"
                    required
                  >
                    <a-form-item>
                      <UploadImg
                        tip="户口首页"
                        :isHouse1="true"
                        @setImageValue="file => setImageData(file, index, 'buyerResidentFirst')"
                        v-decorator="[`buyerList[${index}][buyerResidentFirst]`, {rules: [{ required: true, message: '请上传户口本首页' }], validateTrigger: 'change'}]"
                      />
                    </a-form-item>
                    <a-form-item>
                      <UploadImg
                        tip="户口本人页"
                        :isHouse2="true"
                        @setImageValue="file => setImageData(file, index, 'buyerResidentSelf')"
                        v-decorator="[`buyerList[${index}][buyerResidentSelf]`, {rules: [{ required: true, message: '请上传户口本本人页' }], validateTrigger: 'change'}]"
                      />
                    </a-form-item>
                  </a-form-item>
                </a-col>
              </a-row>
            </div>

            <div class="card-item">
              <a-row :gutter="gutter">
                <a-col :xs="24" :sm="24" :md="24" :xl="16">
                  <a-form-item :labelCol="labelRowCol" :wrapperCol="wrapperRowCol" label="工作单位">
                    <a-input
                      placeholder="请输入工作单位"
                      v-decorator="[`buyerList[${index}][buyerWorkplace]`]"
                    />
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="12" :xl="8">
                  <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="月收入">
                    <a-input
                      type="number"
                      suffix="元"
                      placeholder="请输入月收入"
                      v-decorator="[`buyerList[${index}][buyerIncome]`]"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-form-item
                :labelCol="labelSingleCol"
                :wrapperCol="wrapperSingleCol"
                label="单位地址"
                class="row-letter"
              >
                <a-row :gutter="gutter">
                  <a-col :xs="24" :sm="24" :md="12" :xl="5">
                    <a-form-item>
                      <a-select
                        show-search
                        option-filter-prop="children"
                        placeholder="请选择省"
                        v-decorator="[`buyerList[${index}][buyerAddrProv]`, validatorRules.must]"
                      >
                        <a-select-option value="1">男</a-select-option>
                        <a-select-option value="0">女</a-select-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                  <a-col :xs="24" :sm="24" :md="12" :xl="6">
                    <a-form-item>
                      <a-select
                        show-search
                        option-filter-prop="children"
                        placeholder="请选择市"
                        v-decorator="[`buyerList[${index}][buyerAddrCity]`, validatorRules.must]"
                      >
                        <a-select-option value="1">男</a-select-option>
                        <a-select-option value="0">女</a-select-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                  <a-col :xs="24" :sm="24" :md="12" :xl="5">
                    <a-form-item>
                      <a-select
                        show-search
                        option-filter-prop="children"
                        placeholder="请选择区/县"
                        v-decorator="[`buyerList[${index}][buyerAddrDistc]`, validatorRules.must]"
                      >
                        <a-select-option value="1">男</a-select-option>
                        <a-select-option value="0">女</a-select-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                  <a-col :xs="24" :sm="24" :md="12" :xl="8">
                    <a-form-item>
                      <a-input
                        placeholder="道路、门牌号、小区、楼栋号、单元室等"
                        v-decorator="[`buyerList[${index}][buyerWorkplaceAddr]`, validatorRules.must]"
                      />
                    </a-form-item>
                  </a-col>
                </a-row>
              </a-form-item>
            </div>

            <div class="card-item" style="margin-bottom: 10px">
              <a-row :gutter="gutter">
                <a-col :xs="24" :sm="24" :md="24" :xl="24">
                  <h4 style="line-height: 40px;" class="row-tit">公积金信息：</h4>
                </a-col>
              </a-row>
              <a-row :gutter="gutter">
                <a-col :xs="24" :sm="24" :md="12" :xl="8">
                  <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="工资基数">
                    <a-input
                      type="number"
                      suffix="元"
                      placeholder="请输入工资基数"
                      v-decorator="[`buyerList[${index}][buyerFundBased]`]"
                    />
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="12" :xl="8">
                  <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="月缴存额">
                    <a-input
                      type="number"
                      suffix="元"
                      placeholder="请输入月缴存额"
                      v-decorator="[`buyerList[${index}][buyerFundPayables]`]"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
            </div>
          </a-card>
        </div>

        <!-- 配偶信息 -->
        <div
          class="card-wrap"
          v-if="form.getFieldValue(`buyerList[${index}][buyerMarriage]`)=='02'"
        >
          <div class="card-header">
            <span class="title">配偶信息：</span>
          </div>
          <a-card :bodyStyle="{padding: 0}">
            <div class="card-item">
              <a-row :gutter="gutter">
                <a-col :xs="24" :sm="24" :md="12" :xl="8">
                  <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="姓名">
                    <a-input
                      placeholder="请输入姓名"
                      read-only
                      v-decorator="[`buyerList[${index}][spouseName]`, validatorRules.must]"
                    >
                      <a-tooltip slot="addonAfter" title="点击读取信息">
                        <a-icon
                          type="idcard"
                          class="read-card-icon"
                          @click.native="getIdCardInfo(index, 'spouse')"
                        />
                      </a-tooltip>
                    </a-input>
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="12" :xl="8">
                  <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="性别">
                    <a-select
                      placeholder="请选择"
                      v-decorator="[`buyerList[${index}][spouseGender]`, validatorRules.must]"
                    >
                      <a-select-option v-for="item in genderList" :key="item.key">{{ item.value }}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="12" :xl="8">
                  <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="身份证号">
                    <a-input
                      placeholder="请输入身份证号码"
                      read-only
                      v-decorator="[`buyerList[${index}][spouseIdcard]`, validatorRules.must]"
                    />
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="12" :xl="8">
                  <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="身份证有效期">
                    <a-range-picker
                      format="YYYY-MM-DD"
                      v-decorator="[`buyerList[${index}][spouseIdcardValidity]`, validatorRules.must]"
                    />
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="12" :xl="8">
                  <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="联系电话">
                    <a-input
                      :max-length="11"
                      placeholder="请输入11位手机号码"
                      v-decorator="[`buyerList[${index}][spousePhone]`, validatorRules.phone]"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="gutter">
                <a-col :xs="24" :sm="24" :md="24" :xl="24">
                  <a-form-item
                    :labelCol="labelSingleCol"
                    :wrapperCol="wrapperSingleCol"
                    label="地址"
                    class="row-letter"
                  >
                    <a-input
                      read-only
                      placeholder="请输入你的详细地址"
                      v-decorator="[`buyerList[${index}][spouseAddr]`, validatorRules.must]"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="gutter">
                <a-col :xs="24" :sm="24" :md="24" :xl="12">
                  <a-form-item
                    :labelCol="labelRowCol"
                    :wrapperCol="wrapperRowCol"
                    label="身份证"
                    class="image-box row-letter"
                    required
                  >
                    <a-form-item>
                      <UploadImg
                        tip="身份证人像面"
                        :isCard1="true"
                        @setImageValue="file => setImageData(file, index, 'spouseIdcardFront')"
                        v-decorator="[`buyerList[${index}][spouseIdcardFront]`, {rules: [{ required: true, message: '请上传身份证人像面图' }], validateTrigger: 'change'}]"
                      />
                    </a-form-item>
                    <a-form-item>
                      <UploadImg
                        tip="身份证国徽面"
                        :isCard2="true"
                        @setImageValue="file => setImageData(file, index, 'spouseIdcardBack')"
                        v-decorator="[`buyerList[${index}][spouseIdcardBack]`, {rules: [{ required: true, message: '请上传身份证国徽面图' }], validateTrigger: 'change'}]"
                      />
                    </a-form-item>
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="24" :xl="12">
                  <a-form-item
                    :labelCol="labelRowCol"
                    :wrapperCol="wrapperRowCol"
                    label="户口本"
                    class="image-box row-letter"
                    required
                  >
                    <a-form-item>
                      <UploadImg
                        tip="户口本首页"
                        :isHouse1="true"
                        @setImageValue="file => setImageData(file, index, 'spouseResidentFirst')"
                        v-decorator="[`buyerList[${index}][spouseResidentFirst]`, {rules: [{ required: true, message: '请上传户口本首页' }], validateTrigger: 'change'}]"
                      />
                    </a-form-item>
                    <a-form-item>
                      <UploadImg
                        tip="户口本人页"
                        :isHouse2="true"
                        @setImageValue="file => setImageData(file, index, 'spouseResidentSelf')"
                        v-decorator="[`buyerList[${index}][spouseResidentSelf]`, {rules: [{ required: true, message: '请上传户口本本人页' }], validateTrigger: 'change'}]"
                      />
                    </a-form-item>
                  </a-form-item>
                </a-col>
              </a-row>
            </div>

            <div class="card-item">
              <a-row :gutter="gutter">
                <a-col :xs="24" :sm="24" :md="24" :xl="16">
                  <a-form-item :labelCol="labelRowCol" :wrapperCol="wrapperRowCol" label="工作单位">
                    <a-input
                      placeholder="请输入工作单位"
                      v-decorator="[`buyerList[${index}][spouseWorkplace]`]"
                    />
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="12" :xl="8">
                  <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="月收入">
                    <a-input
                      type="number"
                      suffix="元"
                      placeholder="请输入月收入"
                      v-decorator="[`buyerList[${index}][spouseIncome]`]"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-form-item
                :labelCol="labelSingleCol"
                :wrapperCol="wrapperSingleCol"
                label="单位地址"
                class="row-letter"
              >
                <a-row :gutter="gutter">
                  <a-col :xs="24" :sm="24" :md="12" :xl="5">
                    <a-form-item>
                      <a-select
                        show-search
                        option-filter-prop="children"
                        placeholder="请选择省"
                        v-decorator="[`buyerList[${index}][spouseAddrProv]`, validatorRules.must]"
                      >
                        <a-select-option value="1">男</a-select-option>
                        <a-select-option value="0">女</a-select-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                  <a-col :xs="24" :sm="24" :md="12" :xl="6">
                    <a-form-item>
                      <a-select
                        show-search
                        option-filter-prop="children"
                        placeholder="请选择市"
                        v-decorator="[`buyerList[${index}][spouseAddrCityId]`, validatorRules.must]"
                      >
                        <a-select-option value="1">男</a-select-option>
                        <a-select-option value="0">女</a-select-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                  <a-col :xs="24" :sm="24" :md="12" :xl="5">
                    <a-form-item>
                      <a-select
                        show-search
                        option-filter-prop="children"
                        placeholder="请选择区/县"
                        v-decorator="[`buyerList[${index}][spouseAddrDistc]`, validatorRules.must]"
                      >
                        <a-select-option value="1">男</a-select-option>
                        <a-select-option value="0">女</a-select-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                  <a-col :xs="24" :sm="24" :md="12" :xl="6">
                    <a-form-item>
                      <a-input
                        placeholder="道路、门牌号、小区、楼栋号、单元室等"
                        v-decorator="[`buyerList[${index}][spouseWorkplaceAddr]`, validatorRules.must]"
                      />
                    </a-form-item>
                  </a-col>
                </a-row>
              </a-form-item>
            </div>

            <div class="card-item" style="margin-bottom: 10px">
              <a-row :gutter="gutter">
                <a-col :xs="24" :sm="24" :md="24" :xl="24">
                  <h4 style="line-height: 40px;" class="row-tit">公积金信息：</h4>
                </a-col>
              </a-row>
              <a-row :gutter="gutter">
                <a-col :xs="24" :sm="24" :md="12" :xl="8">
                  <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="工资基数">
                    <a-input
                      type="number"
                      suffix="元"
                      placeholder="请输入工资基数"
                      v-decorator="[`buyerList[${index}][spouseFundBased]`]"
                    />
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="12" :xl="8">
                  <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="月缴存额">
                    <a-input
                      type="number"
                      suffix="元"
                      placeholder="请输入月缴存额"
                      v-decorator="[`buyerList[${index}][spouseFundPayables]`]"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
            </div>
          </a-card>
        </div>

        <!-- 进账银行 -->
        <div class="card-wrap">
          <div class="card-header">
            <span class="title">进账银行：</span>
            <a-button type="primary" class="mr-8" @click="addBank(index)">添加进账银行</a-button>
          </div>
          <a-card :bodyStyle="{padding: 0}">
            <div
              class="card-item"
              v-for="(bank,bankIndex) in buyerList[`${index}`].bankAccountList"
              :key="bankIndex"
            >
              <a-row :gutter="gutter">
                <a-col :xs="24" :sm="24" :md="12" :xl="8">
                  <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="进账人">
                    <a-input
                      placeholder="请输入进账人"
                      v-decorator="[`buyerList[${index}][bankAccountList][${bankIndex}][accountPersonName]`, validatorRules.must]"
                    />
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="12" :xl="8">
                  <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="卡号">
                    <a-input
                      placeholder="请输入卡号"
                      v-decorator="[`buyerList[${index}][bankAccountList][${bankIndex}][bankCardNo]`, validatorRules.must]"
                    >
                      <a-tooltip slot="addonAfter" title="点击获取信息">
                        <a-icon type="camera" class="read-card-icon" />
                      </a-tooltip>
                    </a-input>
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="12" :xl="8">
                  <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="开户行">
                    <a-input
                      placeholder="请输入开户行"
                      v-decorator="[`buyerList[${index}][bankAccountList][${bankIndex}][bankName]`, validatorRules.must]"
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
                    class="image-box"
                    required
                  >
                    <a-form-item>
                      <UploadImg
                        tip="银行卡正面"
                        @setImageValue="file => setBankImageData(file, index, bankIndex, 'bankCardFront')"
                        v-decorator="[`buyerList[${index}][bankAccountList][${bankIndex}][bankCardFront]`, {rules: [{ required: true, message: '请上传银行正面图' }], validateTrigger: 'change'}]"
                      />
                    </a-form-item>
                    <a-form-item>
                      <UploadImg
                        tip="银行卡背面"
                        @setImageValue="file => setBankImageData(file, index, bankIndex, 'bankCardBack')"
                        v-decorator="[`buyerList[${index}][bankAccountList][${bankIndex}][bankCardBack]`, {rules: [{ required: true, message: '请上传银行背面图' }], validateTrigger: 'change'}]"
                      />
                    </a-form-item>
                  </a-form-item>
                </a-col>
              </a-row>
              <div class="close-but">
                <a-icon type="minus-square" @click="removeBank(index, bankIndex)" />
              </div>
            </div>
          </a-card>
        </div>
      </a-tab-pane>
    </a-tabs>
    <!-- submit -->
    <a-form-item class="form-btn" style="margin-top: 24px">
      <a-button @click.native="handleReturn">取 消</a-button>
      <a-button type="primary" html-type="submit" style="margin-left: 24px">保 存</a-button>
    </a-form-item>
  </a-form>
</template>

<script>
import modalMixin from '@/components/Mixins/modal'
import indexMixin from './modules/Tab1'
import UploadImg from '@/components/Upload/index'
export default {
  name: 'Tab1',
  mixins: [modalMixin, indexMixin],
  components: {
    UploadImg
  },
}
</script>

<style lang="less" scoped>
.extra {
  display: inline-block;
  vertical-align: 3px;
  margin-left: 5px;
}
</style>
