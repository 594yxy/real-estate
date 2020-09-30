<template>
  <a-form-model ref="ruleForm" :model="model" class="my-form">
    <a-spin :spinning="confirmLoading">
      <a-tabs v-model="activeKey" type="editable-card" size="small" :animated="false" @edit="onTabEdit">
        <!-- <template slot="tabBarExtraContent">
        <div class="tab-extra">添加共同购房人</div>
        </template>-->
        <a-tab-pane
          v-for="(pane, index) in model.buyerList"
          :key="pane.tabKey"
          :tab="pane.title"
          :closable="pane.closable"
        >
          <!-- 基本信息 -->
          <div class="card-wrap">
            <div class="card-header">
              <span class="title">基本信息：</span>
            </div>
            <a-card :bodyStyle="{ padding: 0 }">
              <div class="card-item">
                <a-row :gutter="gutter">
                  <a-col :xs="24" :sm="24" :md="12" :xl="8">
                    <a-form-model-item
                      :labelCol="labelCol"
                      :wrapperCol="wrapperCol"
                      label="借款人"
                      :prop="'buyerList[' + index + '].buyerName'"
                      :rules="rules.blur"
                    >
                      <a-input placeholder="请输入姓名" v-model.lazy="pane.buyerName">
                        <a-tooltip slot="addonAfter" title="点击读取信息">
                          <a-icon type="idcard" class="read-card-icon" @click.native="getIdCardInfo(index, 'buyer')" />
                        </a-tooltip>
                      </a-input>
                    </a-form-model-item>
                  </a-col>
                  <a-col :xs="24" :sm="24" :md="12" :xl="8">
                    <a-form-model-item
                      :labelCol="labelCol"
                      :wrapperCol="wrapperCol"
                      label="性别"
                      :prop="'buyerList[' + index + '].buyerGender'"
                      :rules="rules.change"
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
                      :prop="'buyerList[' + index + '].buyerIdcard'"
                      :rules="rules.blur"
                    >
                      <a-input placeholder="请输入身份证号码" v-model.lazy="pane.buyerIdcard" />
                    </a-form-model-item>
                  </a-col>
                  <a-col :xs="24" :sm="24" :md="12" :xl="8">
                    <a-form-model-item
                      :labelCol="labelCol"
                      :wrapperCol="wrapperCol"
                      label="身份证有效期"
                      required
                      style="margin-bottom: 0"
                    >
                      <a-input-group compact>
                        <a-form-model-item
                          :prop="'buyerList[' + index + '].buyerIdcardStart'"
                          :rules="rules.change"
                          style="width: 50%; margin-bottom: 0"
                        >
                          <a-date-picker
                            format="YYYY-MM-DD"
                            v-model="pane.buyerIdcardStart"
                            placeholder="开始日期"
                            @change="(date, dateString) => dateChange(date, dateString, index, 'buyer')"
                          />
                        </a-form-model-item>
                        <a-form-model-item
                          :prop="'buyerList[' + index + '].buyerIdcardEnd'"
                          :rules="rules.date"
                          style="width: 50%; margin-bottom: 0"
                        >
                          <a-input v-model.lazy="pane.buyerIdcardEnd" placeholder="结束日期" />
                        </a-form-model-item>
                      </a-input-group>
                    </a-form-model-item>
                  </a-col>
                  <a-col :xs="24" :sm="24" :md="12" :xl="8">
                    <a-form-model-item
                      :labelCol="labelCol"
                      :wrapperCol="wrapperCol"
                      label="联系电话"
                      :prop="'buyerList[' + index + '].buyerPhone'"
                      :rules="rules.phone"
                    >
                      <a-input :max-length="11" placeholder="请输入11位手机号码" v-model.lazy="pane.buyerPhone" />
                    </a-form-model-item>
                  </a-col>
                  <a-col :xs="24" :sm="24" :md="12" :xl="8">
                    <a-form-model-item
                      :labelCol="labelCol"
                      :wrapperCol="wrapperCol"
                      label="婚姻情况"
                      :prop="'buyerList[' + index + '].buyerMarriage'"
                      :rules="rules.change"
                    >
                      <a-select placeholder="请选择" v-model="pane.buyerMarriage">
                        <a-select-option v-for="item in maritalStatusList" :key="item.key">{{
                          item.value
                        }}</a-select-option>
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
                      :prop="'buyerList[' + index + '].buyerAddr'"
                      :rules="rules.blur"
                    >
                      <a-input placeholder="请输入你的详细地址" v-model.lazy="pane.buyerAddr" />
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
                        :prop="'buyerList[' + index + '].buyerIdcardFront'"
                        :rules="{ required: true, message: '请上传身份证人像面', trigger: 'change' }"
                      >
                        <UploadImg
                          tip="身份证人像面"
                          :isCard1="true"
                          :ids="pane.buyerIdcardFront"
                          @setImageValue="(file) => setImageData(file, index, 'buyerIdcardFront')"
                          v-model="pane.buyerIdcardFront"
                        />
                      </a-form-model-item>
                      <a-form-model-item
                        :prop="'buyerList[' + index + '].buyerIdcardBack'"
                        :rules="{ required: true, message: '请上传身份证国徽面', trigger: 'change' }"
                      >
                        <UploadImg
                          tip="身份证国徽面"
                          :isCard2="true"
                          :ids="pane.buyerIdcardBack"
                          @setImageValue="(file) => setImageData(file, index, 'buyerIdcardBack')"
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
                    v-if="pane.buyerMarriage == '02' || pane.buyerMarriage == '03'"
                  >
                    <a-form-model-item
                      :labelCol="labelCol"
                      :wrapperCol="wrapperCol"
                      label="婚姻证明"
                      class="image-box"
                      required
                      :prop="'buyerList[' + index + '].buyerMarriageCert'"
                      :rules="{ required: true, message: '请上传结婚证或者离婚证', trigger: 'change' }"
                    >
                      <UploadImg
                        tip="证件"
                        :ids="pane.buyerMarriageCert"
                        @setImageValue="(file) => setImageData(file, index, 'buyerMarriageCert')"
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
                        :prop="'buyerList[' + index + '].buyerResidentFirst'"
                        :rules="{ required: true, message: '请上传户口本首页', trigger: 'change' }"
                      >
                        <UploadImg
                          tip="户口本首页"
                          :isHouse1="true"
                          :ids="pane.buyerResidentFirst"
                          @setImageValue="(file) => setImageData(file, index, 'buyerResidentFirst')"
                          v-model="pane.buyerResidentFirst"
                        />
                      </a-form-model-item>
                      <a-form-model-item
                        :prop="'buyerList[' + index + '].buyerResidentSelf'"
                        :rules="{ required: true, message: '请上传户口本本人页', trigger: 'change' }"
                      >
                        <UploadImg
                          tip="户口本人页"
                          :isHouse2="true"
                          :ids="pane.buyerResidentSelf"
                          @setImageValue="(file) => setImageData(file, index, 'buyerResidentSelf')"
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
                      :prop="'buyerList[' + index + '].buyerWorkplace'"
                      :rules="rules.blur"
                    >
                      <a-input placeholder="请输入工作单位的名称" v-model.lazy="pane.buyerWorkplace" />
                    </a-form-model-item>
                  </a-col>
                  <a-col :xs="24" :sm="24" :md="12" :xl="8">
                    <a-form-model-item
                      :labelCol="labelCol"
                      :wrapperCol="wrapperCol"
                      label="月收入"
                      :prop="'buyerList[' + index + '].buyerIncome'"
                      :rules="rules.blur"
                    >
                      <a-input
                        type="number"
                        step="0.01"
                        min="0"
                        suffix="元"
                        placeholder="请输入月收入"
                        v-model.lazy="pane.buyerIncome"
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
                  style="margin-bottom: 0"
                >
                  <a-row :gutter="gutter">
                    <a-col :xs="24" :sm="24" :md="12" :xl="5">
                      <a-form-model-item :prop="'buyerList[' + index + '].buyerAddrProvId'" :rules="rules.change">
                        <a-select
                          show-search
                          option-filter-prop="children"
                          placeholder="请选择省"
                          v-model.lazy="pane.buyerAddrProvId"
                          @change="handleProvinceChange"
                        >
                          <a-select-option v-for="item in provinceList" :key="item.id">
                            {{ item.name }}
                          </a-select-option>
                        </a-select>
                      </a-form-model-item>
                    </a-col>
                    <a-col :xs="24" :sm="24" :md="12" :xl="6">
                      <a-form-model-item :prop="'buyerList[' + index + '].buyerAddrCityId'" :rules="rules.change">
                        <a-select
                          show-search
                          option-filter-prop="children"
                          placeholder="请选择市"
                          v-model.lazy="pane.buyerAddrCityId"
                          @change="handleCityChange"
                        >
                          <a-select-option v-for="item in cityList" :key="item.id">
                            {{ item.name }}
                          </a-select-option>
                        </a-select>
                      </a-form-model-item>
                    </a-col>
                    <a-col :xs="24" :sm="24" :md="12" :xl="5">
                      <a-form-model-item :prop="'buyerList[' + index + '].buyerAddrDistcId'" :rules="rules.change">
                        <a-select
                          show-search
                          option-filter-prop="children"
                          placeholder="请选择区/县"
                          v-model="pane.buyerAddrDistcId"
                        >
                          <a-select-option v-for="item in districtList" :key="item.id">
                            {{ item.name }}
                          </a-select-option>
                        </a-select>
                      </a-form-model-item>
                    </a-col>
                    <a-col :xs="24" :sm="24" :md="12" :xl="8">
                      <a-form-model-item :prop="'buyerList[' + index + '].buyerWorkplaceAddr'" :rules="rules.blur">
                        <a-input
                          placeholder="道路、门牌号、小区、楼栋号、单元室等"
                          v-model.lazy="pane.buyerWorkplaceAddr"
                        />
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                </a-form-model-item>
              </div>

              <div class="card-item">
                <a-row :gutter="gutter">
                  <a-col :xs="24" :sm="24" :md="24" :xl="24">
                    <h4 style="line-height: 40px" class="row-tit">公积金信息：</h4>
                  </a-col>
                </a-row>
                <a-row :gutter="gutter">
                  <a-col :xs="24" :sm="24" :md="12" :xl="8">
                    <a-form-model-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="工资基数">
                      <a-input
                        type="number"
                        step="0.01"
                        min="0"
                        suffix="元"
                        placeholder="请输入工资基数"
                        v-model.lazy="pane.buyerFundBased"
                      />
                    </a-form-model-item>
                  </a-col>
                  <a-col :xs="24" :sm="24" :md="12" :xl="8">
                    <a-form-model-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="月缴存额">
                      <a-input
                        type="number"
                        step="0.01"
                        min="0"
                        suffix="元"
                        placeholder="请输入月缴存额"
                        v-model.lazy="pane.buyerFundPayables"
                      />
                    </a-form-model-item>
                  </a-col>
                </a-row>
              </div>
            </a-card>
          </div>

          <!-- 配偶信息 -->
          <div class="card-wrap" v-if="pane.buyerMarriage == '02'">
            <div class="card-header">
              <span class="title">配偶信息：</span>
            </div>
            <a-card :bodyStyle="{ padding: 0 }">
              <div class="card-item">
                <a-row :gutter="gutter">
                  <a-col :xs="24" :sm="24" :md="12" :xl="8">
                    <a-form-model-item
                      :labelCol="labelCol"
                      :wrapperCol="wrapperCol"
                      label="姓名"
                      :prop="'buyerList[' + index + '].spouseName'"
                      :rules="rules.blur"
                    >
                      <a-input placeholder="请输入姓名" v-model.lazy="pane.spouseName">
                        <a-tooltip slot="addonAfter" title="点击读取信息">
                          <a-icon type="idcard" class="read-card-icon" @click.native="getIdCardInfo(index, 'spouse')" />
                        </a-tooltip>
                      </a-input>
                    </a-form-model-item>
                  </a-col>
                  <a-col :xs="24" :sm="24" :md="12" :xl="8">
                    <a-form-model-item
                      :labelCol="labelCol"
                      :wrapperCol="wrapperCol"
                      label="性别"
                      :prop="'buyerList[' + index + '].spouseGender'"
                      :rules="rules.change"
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
                      :prop="'buyerList[' + index + '].spouseIdcard'"
                      :rules="rules.blur"
                    >
                      <a-input placeholder="请输入身份证号码" v-model.lazy="pane.spouseIdcard" />
                    </a-form-model-item>
                  </a-col>
                  <a-col :xs="24" :sm="24" :md="12" :xl="8">
                    <a-form-model-item
                      :labelCol="labelCol"
                      :wrapperCol="wrapperCol"
                      label="身份证有效期"
                      required
                      style="margin-bottom: 0"
                    >
                      <a-input-group compact>
                        <a-form-model-item
                          :prop="'buyerList[' + index + '].spouseIdcardStart'"
                          :rules="rules.change"
                          style="width: 50%; margin-bottom: 0"
                        >
                          <a-date-picker
                            format="YYYY-MM-DD"
                            v-model="pane.spouseIdcardStart"
                            placeholder="开始日期"
                            @change="(date, dateString) => dateChange(date, dateString, index, 'spouse')"
                          />
                        </a-form-model-item>
                        <a-form-model-item
                          :prop="'buyerList[' + index + '].spouseIdcardEnd'"
                          :rules="rules.date"
                          style="width: 50%; margin-bottom: 0"
                        >
                          <a-input v-model="pane.spouseIdcardEnd" placeholder="结束日期" />
                        </a-form-model-item>
                      </a-input-group>
                    </a-form-model-item>
                  </a-col>
                  <a-col :xs="24" :sm="24" :md="12" :xl="8">
                    <a-form-model-item
                      :labelCol="labelCol"
                      :wrapperCol="wrapperCol"
                      label="联系电话"
                      :prop="'buyerList[' + index + '].spousePhone'"
                      :rules="rules.phone"
                    >
                      <a-input :max-length="11" placeholder="请输入11位手机号码" v-model.lazy="pane.spousePhone" />
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
                      :prop="'buyerList[' + index + '].spouseAddr'"
                      :rules="rules.blur"
                    >
                      <a-input placeholder="请输入你的详细地址" v-model.lazy="pane.spouseAddr" />
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
                        :prop="'buyerList[' + index + '].spouseIdcardFront'"
                        :rules="{ required: true, message: '请上传身份证人像面', trigger: 'change' }"
                      >
                        <UploadImg
                          tip="身份证人像面"
                          :isCard1="true"
                          :ids="pane.spouseIdcardFront"
                          @setImageValue="(file) => setImageData(file, index, 'spouseIdcardFront')"
                          v-model="pane.spouseIdcardFront"
                        />
                      </a-form-model-item>
                      <a-form-model-item
                        :prop="'buyerList[' + index + '].spouseIdcardBack'"
                        :rules="{ required: true, message: '请上传身份证国徽面', trigger: 'change' }"
                      >
                        <UploadImg
                          tip="身份证国徽面"
                          :isCard2="true"
                          :ids="pane.spouseIdcardBack"
                          @setImageValue="(file) => setImageData(file, index, 'spouseIdcardBack')"
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
                        :prop="'buyerList[' + index + '].spouseResidentFirst'"
                        :rules="{ required: true, message: '请上传户口本首页', trigger: 'change' }"
                      >
                        <UploadImg
                          tip="户口本首页"
                          :isHouse1="true"
                          :ids="pane.spouseResidentFirst"
                          @setImageValue="(file) => setImageData(file, index, 'spouseResidentFirst')"
                          v-model="pane.spouseResidentFirst"
                        />
                      </a-form-model-item>
                      <a-form-model-item
                        :prop="'buyerList[' + index + '].spouseResidentSelf'"
                        :rules="{ required: true, message: '请上传户口本人页', trigger: 'change' }"
                      >
                        <UploadImg
                          tip="户口本人页"
                          :isHouse2="true"
                          :ids="pane.spouseResidentSelf"
                          @setImageValue="(file) => setImageData(file, index, 'spouseResidentSelf')"
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
                    <a-form-model-item :labelCol="labelRowCol" :wrapperCol="wrapperRowCol" label="工作单位">
                      <a-input placeholder="请输入工作单位的名称" v-model.lazy="pane.spouseWorkplace" />
                    </a-form-model-item>
                  </a-col>
                  <a-col :xs="24" :sm="24" :md="12" :xl="8">
                    <a-form-model-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="月收入">
                      <a-input
                        type="number"
                        step="0.01"
                        min="0"
                        suffix="元"
                        placeholder="请输入月收入"
                        v-model.lazy="pane.spouseIncome"
                      />
                    </a-form-model-item>
                  </a-col>
                </a-row>
                <a-form-model-item
                  :labelCol="labelSingleCol"
                  :wrapperCol="wrapperSingleCol"
                  label="单位地址"
                  class="row-letter"
                  style="margin-bottom: 0"
                >
                  <a-row :gutter="gutter">
                    <a-col :xs="24" :sm="24" :md="12" :xl="5">
                      <a-form-model-item>
                        <a-select
                          show-search
                          option-filter-prop="children"
                          placeholder="请选择省"
                          v-model.lazy="pane.spouseAddrProvId"
                          @change="handleProvinceChange"
                        >
                          <a-select-option v-for="item in provinceList" :key="item.id">
                            {{ item.name }}
                          </a-select-option>
                        </a-select>
                      </a-form-model-item>
                    </a-col>
                    <a-col :xs="24" :sm="24" :md="12" :xl="6">
                      <a-form-model-item>
                        <a-select
                          show-search
                          option-filter-prop="children"
                          placeholder="请选择市"
                          v-model.lazy="pane.spouseAddrCityId"
                          @change="handleCityChange"
                        >
                          <a-select-option v-for="item in cityList" :key="item.id">
                            {{ item.name }}
                          </a-select-option>
                        </a-select>
                      </a-form-model-item>
                    </a-col>
                    <a-col :xs="24" :sm="24" :md="12" :xl="5">
                      <a-form-model-item>
                        <a-select
                          show-search
                          option-filter-prop="children"
                          placeholder="请选择区/县"
                          v-model="pane.spouseAddrDistcId"
                        >
                          <a-select-option v-for="item in districtList" :key="item.id">
                            {{ item.name }}
                          </a-select-option>
                        </a-select>
                      </a-form-model-item>
                    </a-col>
                    <a-col :xs="24" :sm="24" :md="12" :xl="8">
                      <a-form-model-item>
                        <a-input
                          placeholder="道路、门牌号、小区、楼栋号、单元室等"
                          v-model.lazy="pane.spouseWorkplaceAddr"
                        />
                      </a-form-model-item>
                    </a-col>
                  </a-row>
                </a-form-model-item>
              </div>

              <div class="card-item">
                <a-row :gutter="gutter">
                  <a-col :xs="24" :sm="24" :md="24" :xl="24">
                    <h4 style="line-height: 40px" class="row-tit">公积金信息：</h4>
                  </a-col>
                </a-row>
                <a-row :gutter="gutter">
                  <a-col :xs="24" :sm="24" :md="12" :xl="8">
                    <a-form-model-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="工资基数">
                      <a-input
                        type="number"
                        step="0.01"
                        min="0"
                        suffix="元"
                        placeholder="请输入工资基数"
                        v-model.lazy="pane.spouseFundBased"
                      />
                    </a-form-model-item>
                  </a-col>
                  <a-col :xs="24" :sm="24" :md="12" :xl="8">
                    <a-form-model-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="月缴存额">
                      <a-input
                        type="number"
                        step="0.01"
                        min="0"
                        suffix="元"
                        placeholder="请输入月缴存额"
                        v-model.lazy="pane.spouseFundPayables"
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
            <a-card :bodyStyle="{ padding: 0 }">
              <div class="card-item" v-for="(bank, bankIndex) in pane.bankAccountList" :key="bankIndex">
                <a-row :gutter="gutter">
                  <a-col :xs="24" :sm="24" :md="12" :xl="8">
                    <a-form-model-item
                      :labelCol="labelCol"
                      :wrapperCol="wrapperCol"
                      label="进账人"
                      :prop="'buyerList[' + index + '].bankAccountList[' + bankIndex + '].accountPersonName'"
                      :rules="rules.blur"
                    >
                      <a-input placeholder="请输入进账人" v-model="bank.accountPersonName" />
                    </a-form-model-item>
                  </a-col>
                  <a-col :xs="24" :sm="24" :md="12" :xl="8">
                    <a-form-model-item
                      :labelCol="labelCol"
                      :wrapperCol="wrapperCol"
                      label="卡号"
                      :prop="'buyerList[' + index + '].bankAccountList[' + bankIndex + '].bankCardNo'"
                      :rules="rules.bankCardNo"
                    >
                      <a-input placeholder="请输入银行卡号" :max-length="20" v-model="bank.bankCardNo">
                        <a-tooltip slot="addonAfter" title="点击上传识别">
                          <a-upload
                            name="file"
                            :show-upload-list="false"
                            :before-upload="OCRBeforeUpload"
                            @change="(info) => getBankInfo(info.file, index, bankIndex)"
                          >
                            <a-icon type="camera" class="read-card-icon" />
                          </a-upload>
                        </a-tooltip>
                      </a-input>
                    </a-form-model-item>
                  </a-col>
                  <a-col :xs="24" :sm="24" :md="12" :xl="8">
                    <a-form-model-item
                      :labelCol="labelCol"
                      :wrapperCol="wrapperCol"
                      label="开户行"
                      :prop="'buyerList[' + index + '].bankAccountList[' + bankIndex + '].bankName'"
                      :rules="rules.blur"
                    >
                      <a-input placeholder="请输入开户行" v-model.lazy="bank.bankName" />
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
                        :prop="'buyerList[' + index + '].bankAccountList[' + bankIndex + '].bankCardFront'"
                        :rules="{ required: true, message: '请上传银行卡正面', trigger: 'change' }"
                      >
                        <UploadImg
                          tip="银行卡正面"
                          :ids="bank.bankCardFront"
                          @setImageValue="(file) => setBankImageData(file, index, bankIndex, 'bankCardFront')"
                          v-model="bank.bankCardFront"
                        />
                      </a-form-model-item>
                      <a-form-model-item
                        :prop="'buyerList[' + index + '].bankAccountList[' + bankIndex + '].bankCardBack'"
                        :rules="{ required: true, message: '请上传银行卡背面', trigger: 'change' }"
                      >
                        <UploadImg
                          tip="银行卡背面"
                          :ids="bank.bankCardBack"
                          @setImageValue="(file) => setBankImageData(file, index, bankIndex, 'bankCardBack')"
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
        <a-button type="primary" @click="handleOk" style="margin-left: 24px">保 存</a-button>
      </a-form-model-item>
    </a-spin>
  </a-form-model>
</template>

<script>
import modalMixin from '@/components/Mixins/form'
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
.tab-extra {
  display: inline-block;
  vertical-align: 3px;
}
</style>
