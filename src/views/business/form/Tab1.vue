<template>
  <a-form-model ref="ruleForm" :model="model" class="my-form" @submit="handleSubmit">
    <a-spin :spinning="confirmLoading">
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
          v-for="(pane,index) in model.buyerList"
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
                    <a-form-model-item
                      :labelCol="labelCol"
                      :wrapperCol="wrapperCol"
                      label="借款人"
                      :prop="'buyerList['+index+'].buyerName'"
                      :rules="rules.must"
                    >
                      <a-input placeholder="请输入姓名" read-only v-model="pane.buyerName">
                        <a-tooltip slot="addonAfter" title="点击读取信息">
                          <a-icon
                            type="idcard"
                            class="read-card-icon"
                            @click.native="getIdCardInfo(index, 'buyer')"
                          />
                        </a-tooltip>
                      </a-input>
                    </a-form-model-item>
                  </a-col>
                  <a-col :xs="24" :sm="24" :md="12" :xl="8">
                    <a-form-model-item
                      :labelCol="labelCol"
                      :wrapperCol="wrapperCol"
                      label="性别"
                      :prop="'buyerList['+index+'].buyerGender'"
                      :rules="rules.must"
                    >
                      <a-select placeholder="请选择" v-model="pane.buyerGender">
                        <a-select-option v-for="item in genderList" :key="item.key">{{ item.value }}</a-select-option>
                      </a-select>
                    </a-form-model-item>
                  </a-col>
                  <a-col :xs="24" :sm="24" :md="12" :xl="8">
                    <a-form-model-item
                      :labelCol="labelCol"
                      :wrapperCol="wrapperCol"
                      label="身份证号"
                      :prop="'buyerList['+index+'].buyerIdcard'"
                      :rules="rules.must"
                    >
                      <a-input placeholder="请输入身份证号码" read-only v-model="pane.buyerIdcard" />
                    </a-form-model-item>
                  </a-col>
                  <a-col :xs="24" :sm="24" :md="12" :xl="8">
                    <a-form-model-item
                      :labelCol="labelCol"
                      :wrapperCol="wrapperCol"
                      label="身份证有效期"
                      :prop="'buyerList['+index+'].buyerIdcardValidity'"
                      :rules="rules.must"
                    >
                      <a-range-picker format="YYYY-MM-DD" v-model="pane.buyerIdcardValidity" />
                    </a-form-model-item>
                  </a-col>
                  <a-col :xs="24" :sm="24" :md="12" :xl="8">
                    <a-form-model-item
                      :labelCol="labelCol"
                      :wrapperCol="wrapperCol"
                      label="联系电话"
                      :prop="'buyerList['+index+'].buyerPhone'"
                      :rules="rules.phone"
                    >
                      <a-input :max-length="11" placeholder="请输入11位手机号码" v-model="pane.buyerPhone" />
                    </a-form-model-item>
                  </a-col>
                  <a-col :xs="24" :sm="24" :md="12" :xl="8">
                    <a-form-model-item
                      :labelCol="labelCol"
                      :wrapperCol="wrapperCol"
                      label="婚姻情况"
                      :prop="'buyerList['+index+'].buyerMarriage'"
                      :rules="rules.must"
                    >
                      <a-select
                        placeholder="请选择"
                        v-model="pane.buyerMarriage"
                        @change="maritalStatusChange"
                      >
                        <a-select-option
                          v-for="item in maritalStatusList"
                          :key="item.key"
                        >{{item.value}}</a-select-option>
                      </a-select>
                    </a-form-model-item>
                  </a-col>
                </a-row>
                <a-row :gutter="gutter">
                  <a-col :xs="24" :sm="24" :md="24" :xl="24">
                    <a-form-model-item
                      :labelCol="labelSingleCol"
                      :wrapperCol="wrapperSingleCol"
                      label="地址"
                      class="row-letter"
                      :prop="'buyerList['+index+'].buyerAddr'"
                      :rules="rules.must"
                    >
                      <a-input read-only placeholder="请输入你的详细地址" v-model="pane.buyerAddr" />
                    </a-form-model-item>
                  </a-col>
                </a-row>
                <a-row :gutter="gutter">
                  <a-col :xs="24" :sm="24" :md="24" :xl="16">
                    <a-form-model-item
                      :labelCol="labelRowCol"
                      :wrapperCol="wrapperRowCol"
                      label="身份证"
                      class="image-box"
                      required
                    >
                      <a-form-model-item
                        :prop="'buyerList['+index+'].buyerIdcardFront'"
                        :rules="{required: true,message: '请上传身份证人像面',trigger: 'change'}"
                      >
                        <UploadImg
                          tip="身份证人像面"
                          :isCard1="true"
                          @setImageValue="file => setImageData(file, index, 'buyerIdcardFront')"
                          v-model="pane.buyerIdcardFront"
                        />
                      </a-form-model-item>
                      <a-form-model-item
                        :prop="'buyerList['+index+'].buyerIdcardBack'"
                        :rules="{required: true,message: '请上传身份证国徽面',trigger: 'change'}"
                      >
                        <UploadImg
                          tip="身份证国徽面"
                          :isCard2="true"
                          @setImageValue="file => setImageData(file, index, 'buyerIdcardBack')"
                          v-model="pane.buyerIdcardBack"
                        />
                      </a-form-model-item>
                    </a-form-model-item>
                  </a-col>
                  <a-col
                    :xs="24"
                    :sm="24"
                    :md="12"
                    :xl="8"
                    v-if="pane.buyerMarriage=='02' || pane.buyerMarriage=='03'"
                  >
                    <a-form-model-item
                      :labelCol="labelCol"
                      :wrapperCol="wrapperCol"
                      label="婚姻证明"
                      required
                      :prop="'buyerList['+index+'].buyerMarriageCert'"
                      :rules="{required: true,message: '请上传结婚证或者离婚证',trigger: 'change'}"
                    >
                      <UploadImg
                        tip="证件"
                        @setImageValue="file => setImageData(file, index, 'buyerMarriageCert')"
                        v-model="pane.buyerMarriageCert"
                      />
                    </a-form-model-item>
                  </a-col>
                  <a-col :xs="24" :sm="24" :md="24" :xl="16">
                    <a-form-model-item
                      :labelCol="labelRowCol"
                      :wrapperCol="wrapperRowCol"
                      label="户口本"
                      class="image-box"
                      required
                    >
                      <a-form-model-item
                        :prop="'buyerList['+index+'].buyerResidentFirst'"
                        :rules="{required: true,message: '请上传户口本首页',trigger: 'change'}"
                      >
                        <UploadImg
                          tip="户口本首页"
                          :isHouse1="true"
                          @setImageValue="file => setImageData(file, index, 'buyerResidentFirst')"
                          v-model="pane.buyerResidentFirst"
                        />
                      </a-form-model-item>
                      <a-form-model-item
                        :prop="'buyerList['+index+'].buyerResidentSelf'"
                        :rules="{required: true,message: '请上传户口本本人页',trigger: 'change'}"
                      >
                        <UploadImg
                          tip="户口本人页"
                          :isHouse2="true"
                          @setImageValue="file => setImageData(file, index, 'buyerResidentSelf')"
                          v-model="pane.buyerResidentSelf"
                        />
                      </a-form-model-item>
                    </a-form-model-item>
                  </a-col>
                </a-row>
              </div>

              <div class="card-item">
                <a-row :gutter="gutter">
                  <a-col :xs="24" :sm="24" :md="24" :xl="16">
                    <a-form-model-item
                      :labelCol="labelRowCol"
                      :wrapperCol="wrapperRowCol"
                      label="工作单位"
                      :prop="'buyerList['+index+'].buyerWorkplace'"
                      :rules="rules.must"
                    >
                      <a-input placeholder="请输入工作单位" v-model="pane.buyerWorkplace" />
                    </a-form-model-item>
                  </a-col>
                  <a-col :xs="24" :sm="24" :md="12" :xl="8">
                    <a-form-model-item
                      :labelCol="labelCol"
                      :wrapperCol="wrapperCol"
                      label="月收入"
                      :prop="'buyerList['+index+'].buyerIncome'"
                      :rules="rules.must"
                    >
                      <a-input
                        type="number"
                        suffix="元"
                        placeholder="请输入月收入"
                        v-model="pane.buyerIncome"
                      />
                    </a-form-model-item>
                  </a-col>
                </a-row>
                <a-form-model-item
                  :labelCol="labelSingleCol"
                  :wrapperCol="wrapperSingleCol"
                  label="单位地址"
                  class="row-letter"
                  required
                >
                  <a-row :gutter="gutter">
                    <a-col :xs="24" :sm="24" :md="12" :xl="5">
                      <a-form-model-item
                        :prop="'buyerList['+index+'].buyerAddrProv'"
                        :rules="rules.must"
                      >
                        <a-select
                          show-search
                          option-filter-prop="children"
                          placeholder="请选择省"
                          v-model="pane.buyerAddrProv"
                        >
                          <a-select-option value="1">男</a-select-option>
                          <a-select-option value="0">女</a-select-option>
                        </a-select>
                      </a-form-model-item>
                    </a-col>
                    <a-col :xs="24" :sm="24" :md="12" :xl="6">
                      <a-form-model-item
                        :prop="'buyerList['+index+'].buyerAddrCity'"
                        :rules="rules.must"
                      >
                        <a-select
                          show-search
                          option-filter-prop="children"
                          placeholder="请选择市"
                          v-model="pane.buyerAddrCity"
                        >
                          <a-select-option value="1">男</a-select-option>
                          <a-select-option value="0">女</a-select-option>
                        </a-select>
                      </a-form-model-item>
                    </a-col>
                    <a-col :xs="24" :sm="24" :md="12" :xl="5">
                      <a-form-model-item
                        :prop="'buyerList['+index+'].buyerAddrDistc'"
                        :rules="rules.must"
                      >
                        <a-select
                          show-search
                          option-filter-prop="children"
                          placeholder="请选择区/县"
                          v-model="pane.buyerAddrDistc"
                        >
                          <a-select-option value="1">男</a-select-option>
                          <a-select-option value="0">女</a-select-option>
                        </a-select>
                      </a-form-model-item>
                    </a-col>
                    <a-col :xs="24" :sm="24" :md="12" :xl="8">
                      <a-form-model-item
                        :prop="'buyerList['+index+'].buyerWorkplaceAddr'"
                        :rules="rules.must"
                      >
                        <a-input
                          placeholder="道路、门牌号、小区、楼栋号、单元室等"
                          v-model="pane.buyerWorkplaceAddr"
                        />
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                </a-form-model-item>
              </div>

              <div class="card-item" style="margin-bottom: 10px">
                <a-row :gutter="gutter">
                  <a-col :xs="24" :sm="24" :md="24" :xl="24">
                    <h4 style="line-height: 40px;" class="row-tit">公积金信息：</h4>
                  </a-col>
                </a-row>
                <a-row :gutter="gutter">
                  <a-col :xs="24" :sm="24" :md="12" :xl="8">
                    <a-form-model-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="工资基数">
                      <a-input
                        type="number"
                        suffix="元"
                        placeholder="请输入工资基数"
                        v-model="pane.buyerFundBased"
                      />
                    </a-form-model-item>
                  </a-col>
                  <a-col :xs="24" :sm="24" :md="12" :xl="8">
                    <a-form-model-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="月缴存额">
                      <a-input
                        type="number"
                        suffix="元"
                        placeholder="请输入月缴存额"
                        v-model="pane.buyerFundPayables"
                      />
                    </a-form-model-item>
                  </a-col>
                </a-row>
              </div>
            </a-card>
          </div>

          <!-- 配偶信息 -->
          <div class="card-wrap" v-if="pane.buyerMarriage=='02'">
            <div class="card-header">
              <span class="title">配偶信息：</span>
            </div>
            <a-card :bodyStyle="{padding: 0}">
              <div class="card-item">
                <a-row :gutter="gutter">
                  <a-col :xs="24" :sm="24" :md="12" :xl="8">
                    <a-form-model-item
                      :labelCol="labelCol"
                      :wrapperCol="wrapperCol"
                      label="姓名"
                      :prop="'buyerList['+index+'].spouseName'"
                      :rules="rules.must"
                    >
                      <a-input placeholder="请输入姓名" read-only v-model="pane.spouseName">
                        <a-tooltip slot="addonAfter" title="点击读取信息">
                          <a-icon
                            type="idcard"
                            class="read-card-icon"
                            @click.native="getIdCardInfo(index, 'spouse')"
                          />
                        </a-tooltip>
                      </a-input>
                    </a-form-model-item>
                  </a-col>
                  <a-col :xs="24" :sm="24" :md="12" :xl="8">
                    <a-form-model-item
                      :labelCol="labelCol"
                      :wrapperCol="wrapperCol"
                      label="性别"
                      :prop="'buyerList['+index+'].spouseGender'"
                      :rules="rules.must"
                    >
                      <a-select placeholder="请选择" v-model="pane.spouseGender">
                        <a-select-option v-for="item in genderList" :key="item.key">{{ item.value }}</a-select-option>
                      </a-select>
                    </a-form-model-item>
                  </a-col>
                  <a-col :xs="24" :sm="24" :md="12" :xl="8">
                    <a-form-model-item
                      :labelCol="labelCol"
                      :wrapperCol="wrapperCol"
                      label="身份证号"
                      :prop="'buyerList['+index+'].spouseIdcard'"
                      :rules="rules.must"
                    >
                      <a-input placeholder="请输入身份证号码" read-only v-model="pane.spouseIdcard" />
                    </a-form-model-item>
                  </a-col>
                  <a-col :xs="24" :sm="24" :md="12" :xl="8">
                    <a-form-model-item
                      :labelCol="labelCol"
                      :wrapperCol="wrapperCol"
                      label="身份证有效期"
                      :prop="'buyerList['+index+'].spouseIdcardValidity'"
                      :rules="rules.must"
                    >
                      <a-range-picker format="YYYY-MM-DD" v-model="pane.spouseIdcardValidity" />
                    </a-form-model-item>
                  </a-col>
                  <a-col :xs="24" :sm="24" :md="12" :xl="8">
                    <a-form-model-item
                      :labelCol="labelCol"
                      :wrapperCol="wrapperCol"
                      label="联系电话"
                      :prop="'buyerList['+index+'].spousePhone'"
                      :rules="rules.phone"
                    >
                      <a-input
                        :max-length="11"
                        placeholder="请输入11位手机号码"
                        v-model="pane.spousePhone"
                      />
                    </a-form-model-item>
                  </a-col>
                </a-row>
                <a-row :gutter="gutter">
                  <a-col :xs="24" :sm="24" :md="24" :xl="24">
                    <a-form-model-item
                      :labelCol="labelSingleCol"
                      :wrapperCol="wrapperSingleCol"
                      label="地址"
                      class="row-letter"
                      :prop="'buyerList['+index+'].spouseAddr'"
                      :rules="rules.must"
                    >
                      <a-input read-only placeholder="请输入你的详细地址" v-model="pane.spouseAddr" />
                    </a-form-model-item>
                  </a-col>
                </a-row>
                <a-row :gutter="gutter">
                  <a-col :xs="24" :sm="24" :md="24" :xl="12">
                    <a-form-model-item
                      :labelCol="labelRowCol"
                      :wrapperCol="wrapperRowCol"
                      label="身份证"
                      class="image-box row-letter"
                      required
                    >
                      <a-form-model-item
                        :prop="'buyerList['+index+'].spouseIdcardFront'"
                        :rules="{required: true,message: '请上传身份证人像面',trigger: 'change'}"
                      >
                        <UploadImg
                          tip="身份证人像面"
                          :isCard1="true"
                          @setImageValue="file => setImageData(file, index, 'spouseIdcardFront')"
                          v-model="pane.spouseIdcardFront"
                        />
                      </a-form-model-item>
                      <a-form-model-item
                        :prop="'buyerList['+index+'].spouseIdcardBack'"
                        :rules="{required: true,message: '请上传身份证国徽面',trigger: 'change'}"
                      >
                        <UploadImg
                          tip="身份证国徽面"
                          :isCard2="true"
                          @setImageValue="file => setImageData(file, index, 'spouseIdcardBack')"
                          v-model="pane.spouseIdcardBack"
                        />
                      </a-form-model-item>
                    </a-form-model-item>
                  </a-col>
                  <a-col :xs="24" :sm="24" :md="24" :xl="12">
                    <a-form-model-item
                      :labelCol="labelRowCol"
                      :wrapperCol="wrapperRowCol"
                      label="户口本"
                      class="image-box row-letter"
                      required
                    >
                      <a-form-model-item
                        :prop="'buyerList['+index+'].spouseResidentFirst'"
                        :rules="{required: true,message: '请上传户口本首页',trigger: 'change'}"
                      >
                        <UploadImg
                          tip="户口本首页"
                          :isHouse1="true"
                          @setImageValue="file => setImageData(file, index, 'spouseResidentFirst')"
                          v-model="pane.spouseResidentFirst"
                        />
                      </a-form-model-item>
                      <a-form-model-item
                        :prop="'buyerList['+index+'].spouseResidentSelf'"
                        :rules="{required: true,message: '请上传户口本人页',trigger: 'change'}"
                      >
                        <UploadImg
                          tip="户口本人页"
                          :isHouse2="true"
                          @setImageValue="file => setImageData(file, index, 'spouseResidentSelf')"
                          v-model="pane.spouseResidentSelf"
                        />
                      </a-form-model-item>
                    </a-form-model-item>
                  </a-col>
                </a-row>
              </div>

              <div class="card-item">
                <a-row :gutter="gutter">
                  <a-col :xs="24" :sm="24" :md="24" :xl="16">
                    <a-form-model-item
                      :labelCol="labelRowCol"
                      :wrapperCol="wrapperRowCol"
                      label="工作单位"
                    >
                      <a-input placeholder="请输入工作单位" v-model="pane.spouseWorkplace" />
                    </a-form-model-item>
                  </a-col>
                  <a-col :xs="24" :sm="24" :md="12" :xl="8">
                    <a-form-model-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="月收入">
                      <a-input
                        type="number"
                        suffix="元"
                        placeholder="请输入月收入"
                        v-model="pane.spouseIncome"
                      />
                    </a-form-model-item>
                  </a-col>
                </a-row>
                <a-form-model-item
                  :labelCol="labelSingleCol"
                  :wrapperCol="wrapperSingleCol"
                  label="单位地址"
                  class="row-letter"
                >
                  <a-row :gutter="gutter">
                    <a-col :xs="24" :sm="24" :md="12" :xl="5">
                      <a-form-model-item>
                        <a-select
                          show-search
                          option-filter-prop="children"
                          placeholder="请选择省"
                          v-model="pane.spouseAddrProv"
                        >
                          <a-select-option value="1">男</a-select-option>
                          <a-select-option value="0">女</a-select-option>
                        </a-select>
                      </a-form-model-item>
                    </a-col>
                    <a-col :xs="24" :sm="24" :md="12" :xl="6">
                      <a-form-model-item>
                        <a-select
                          show-search
                          option-filter-prop="children"
                          placeholder="请选择市"
                          v-model="pane.spouseAddrCityId"
                        >
                          <a-select-option value="1">男</a-select-option>
                          <a-select-option value="0">女</a-select-option>
                        </a-select>
                      </a-form-model-item>
                    </a-col>
                    <a-col :xs="24" :sm="24" :md="12" :xl="5">
                      <a-form-model-item>
                        <a-select
                          show-search
                          option-filter-prop="children"
                          placeholder="请选择区/县"
                          v-model="pane.spouseAddrDistc"
                        >
                          <a-select-option value="1">男</a-select-option>
                          <a-select-option value="0">女</a-select-option>
                        </a-select>
                      </a-form-model-item>
                    </a-col>
                    <a-col :xs="24" :sm="24" :md="12" :xl="8">
                      <a-form-model-item>
                        <a-input
                          placeholder="道路、门牌号、小区、楼栋号、单元室等"
                          v-model="pane.spouseWorkplaceAddr"
                        />
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                </a-form-model-item>
              </div>

              <div class="card-item" style="margin-bottom: 10px">
                <a-row :gutter="gutter">
                  <a-col :xs="24" :sm="24" :md="24" :xl="24">
                    <h4 style="line-height: 40px;" class="row-tit">公积金信息：</h4>
                  </a-col>
                </a-row>
                <a-row :gutter="gutter">
                  <a-col :xs="24" :sm="24" :md="12" :xl="8">
                    <a-form-model-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="工资基数">
                      <a-input
                        type="number"
                        suffix="元"
                        placeholder="请输入工资基数"
                        v-model="pane.spouseFundBased"
                      />
                    </a-form-model-item>
                  </a-col>
                  <a-col :xs="24" :sm="24" :md="12" :xl="8">
                    <a-form-model-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="月缴存额">
                      <a-input
                        type="number"
                        suffix="元"
                        placeholder="请输入月缴存额"
                        v-model="pane.spouseFundPayables"
                      />
                    </a-form-model-item>
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
                v-for="(bank,bankIndex) in pane.bankAccountList"
                :key="bankIndex"
              >
                <a-row :gutter="gutter">
                  <a-col :xs="24" :sm="24" :md="12" :xl="8">
                    <a-form-model-item
                      :labelCol="labelCol"
                      :wrapperCol="wrapperCol"
                      label="进账人"
                      :prop="'buyerList['+index+'].bankAccountList['+bankIndex+'].accountPersonName'"
                      :rules="rules.must"
                    >
                      <a-input placeholder="请输入进账人" v-model="bank.accountPersonName" />
                    </a-form-model-item>
                  </a-col>
                  <a-col :xs="24" :sm="24" :md="12" :xl="8">
                    <a-form-model-item
                      :labelCol="labelCol"
                      :wrapperCol="wrapperCol"
                      label="卡号"
                      :prop="'buyerList['+index+'].bankAccountList['+bankIndex+'].bankCardNo'"
                      :rules="rules.must"
                    >
                      <a-input placeholder="请输入卡号" v-model="bank.bankCardNo">
                        <a-tooltip slot="addonAfter" title="点击获取信息">
                          <a-icon type="camera" class="read-card-icon" />
                        </a-tooltip>
                      </a-input>
                    </a-form-model-item>
                  </a-col>
                  <a-col :xs="24" :sm="24" :md="12" :xl="8">
                    <a-form-model-item
                      :labelCol="labelCol"
                      :wrapperCol="wrapperCol"
                      label="开户行"
                      :prop="'buyerList['+index+'].bankAccountList['+bankIndex+'].bankName'"
                      :rules="rules.must"
                    >
                      <a-input placeholder="请输入开户行" v-model="bank.bankName" />
                    </a-form-model-item>
                  </a-col>
                </a-row>
                <a-row :gutter="gutter">
                  <a-col :xs="24" :sm="24" :md="24" :xl="16">
                    <a-form-model-item
                      :labelCol="labelRowCol"
                      :wrapperCol="wrapperRowCol"
                      label="银行卡"
                      class="image-box"
                      required
                    >
                      <a-form-model-item
                        :prop="'buyerList['+index+'].bankAccountList['+bankIndex+'].bankCardFront'"
                        :rules="{required: true,message: '请上传银行卡正面',trigger: 'change'}"
                      >
                        <UploadImg
                          tip="银行卡正面"
                          @setImageValue="file => setBankImageData(file, index, bankIndex, 'bankCardFront')"
                          v-model="bank.bankCardFront"
                        />
                      </a-form-model-item>
                      <a-form-model-item
                        :prop="'buyerList['+index+'].bankAccountList['+bankIndex+'].bankCardBack'"
                        :rules="{required: true,message: '请上传银行卡背面',trigger: 'change'}"
                      >
                        <UploadImg
                          tip="银行卡背面"
                          @setImageValue="file => setBankImageData(file, index, bankIndex, 'bankCardBack')"
                          v-model="bank.bankCardBack"
                        />
                      </a-form-model-item>
                    </a-form-model-item>
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
      <a-form-model-item class="form-btn" style="margin-top: 24px">
        <a-button @click.native="handleReturn">取 消</a-button>
        <a-button type="primary" html-type="submit" style="margin-left: 24px">保 存</a-button>
      </a-form-model-item>
    </a-spin>
  </a-form-model>
</template>

<script>
import modalMixin from '@/components/Mixins/modal'
import indexMixin from './modules/Tab1'
import UploadImg from '@/components/Upload/index'
export default {
  name: 'Tab1',
  mixins: [modalMixin, indexMixin],
  components: {
    UploadImg,
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
