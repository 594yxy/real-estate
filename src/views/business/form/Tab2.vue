<template>
  <a-form-model ref="ruleForm" :model="model" class="my-form">
    <a-spin :spinning="confirmLoading">
      <a-tabs v-model="activeKey" type="editable-card" size="small" :animated="false" @edit="onTabEdit">
        <template slot="tabBarExtraContent">
          <div class="tab-extra">
            <a-button type="danger" class="ml-8" @click.native="addThirdPay">第三方垫付</a-button>
          </div>
        </template>

        <a-tab-pane
          v-for="(pane, index) in model.salerList"
          :key="pane.tabKey"
          :tab="pane.title"
          :closable="pane.closable"
        >
          <!-- 卖方基本信息 -->
          <div class="card-wrap">
            <div class="card-header">
              <span class="title">基本信息：</span>
              <a-button type="primary" @click.native="addAssignor(index)" class="mr-8">添加委托人</a-button>
              <a-button type="primary" @click.native="addGuardian(index)">添加监护人</a-button>
            </div>
            <a-card :bodyStyle="{ padding: 0 }">
              <div class="card-item">
                <a-row :gutter="gutter">
                  <a-col :xs="24" :sm="24" :md="12" :xl="8">
                    <a-form-model-item
                      :labelCol="labelCol"
                      :wrapperCol="wrapperCol"
                      label="姓名"
                      :prop="'salerList[' + index + '].salerName'"
                      :rules="rules.blur"
                    >
                      <a-input placeholder="请输入姓名" v-model="pane.salerName">
                        <a-tooltip slot="addonAfter" title="点击读取信息">
                          <a-icon type="idcard" class="read-card-icon" @click.native="getIdCardInfo(index, 'saler')" />
                        </a-tooltip>
                      </a-input>
                    </a-form-model-item>
                  </a-col>
                  <a-col :xs="24" :sm="24" :md="12" :xl="8">
                    <a-form-model-item
                      :labelCol="labelCol"
                      :wrapperCol="wrapperCol"
                      label="性别"
                      :prop="'salerList[' + index + '].salerGender'"
                      :rules="rules.change"
                    >
                      <a-select placeholder="请选择" v-model="pane.salerGender">
                        <a-select-option v-for="item in genderList" :key="item.key">{{ item.value }}</a-select-option>
                      </a-select>
                    </a-form-model-item>
                  </a-col>
                  <a-col :xs="24" :sm="24" :md="12" :xl="8">
                    <a-form-model-item
                      :labelCol="labelCol"
                      :wrapperCol="wrapperCol"
                      label="身份证号"
                      :prop="'salerList[' + index + '].salerIdcard'"
                      :rules="rules.blur"
                    >
                      <a-input placeholder="请输入身份证号码" v-model="pane.salerIdcard" />
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
                          :prop="'salerList[' + index + '].salerIdcardStart'"
                          :rules="rules.change"
                          style="width: 50%; margin-bottom: 0"
                        >
                          <a-date-picker
                            format="YYYY-MM-DD"
                            v-model="pane.salerIdcardStart"
                            placeholder="开始日期"
                            @change="(date, dateString) => dateChange(date, dateString, index, 'saler')"
                          />
                        </a-form-model-item>
                        <a-form-model-item
                          :prop="'salerList[' + index + '].salerIdcardEnd'"
                          :rules="rules.date"
                          style="width: 50%; margin-bottom: 0"
                        >
                          <a-input v-model="pane.salerIdcardEnd" placeholder="结束日期" />
                        </a-form-model-item>
                      </a-input-group>
                    </a-form-model-item>
                  </a-col>
                  <a-col :xs="24" :sm="24" :md="12" :xl="8">
                    <a-form-model-item
                      :labelCol="labelCol"
                      :wrapperCol="wrapperCol"
                      label="联系电话"
                      :prop="'salerList[' + index + '].salerPhone'"
                      :rules="rules.phone"
                    >
                      <a-input :max-length="11" placeholder="请输入11位手机号码" v-model="pane.salerPhone" />
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
                      :prop="'salerList[' + index + '].salerAddr'"
                      :rules="rules.blur"
                    >
                      <a-input placeholder="请输入你的详细地址" v-model="pane.salerAddr" />
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
                        :prop="'salerList[' + index + '].salerIdcardFront'"
                        :rules="{ required: true, message: '请上传身份证人像面', trigger: 'change' }"
                      >
                        <UploadImg
                          tip="身份证人像面"
                          :isCard1="true"
                          :ids="pane.salerIdcardFront"
                          @setImageValue="(file) => setImageData(file, index, 'salerIdcardFront')"
                          v-model="pane.salerIdcardFront"
                        />
                      </a-form-model-item>
                      <a-form-model-item
                        :prop="'salerList[' + index + '].salerIdcardBack'"
                        :rules="{ required: true, message: '请上传身份证国徽面', trigger: 'change' }"
                      >
                        <UploadImg
                          tip="身份证国徽面"
                          :isCard2="true"
                          :ids="pane.salerIdcardBack"
                          @setImageValue="(file) => setImageData(file, index, 'salerIdcardBack')"
                          v-model="pane.salerIdcardBack"
                        />
                      </a-form-model-item>
                    </a-form-model-item>
                  </a-col>
                </a-row>
              </div>
            </a-card>
          </div>

          <!-- 委托人信息 -->
          <div class="card-wrap" v-if="pane.assignor">
            <div class="card-header">
              <span class="title">委托人信息：</span>
            </div>
            <a-card :bodyStyle="{ padding: 0 }">
              <div class="card-item">
                <a-row :gutter="gutter">
                  <a-col :xs="24" :sm="24" :md="12" :xl="8">
                    <a-form-model-item
                      :labelCol="labelCol"
                      :wrapperCol="wrapperCol"
                      label="姓名"
                      :prop="'salerList[' + index + '].assignor.personName'"
                      :rules="rules.blur"
                    >
                      <a-input placeholder="请输入姓名" v-model="pane.assignor.personName">
                        <a-tooltip slot="addonAfter" title="点击读取信息">
                          <a-icon
                            type="idcard"
                            class="read-card-icon"
                            @click.native="getIdCardInfo(index, 'person', 'assignor')"
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
                      :prop="'salerList[' + index + '].assignor.personGender'"
                      :rules="rules.change"
                    >
                      <a-select placeholder="请选择" v-model="pane.assignor.personGender">
                        <a-select-option v-for="item in genderList" :key="item.key">{{ item.value }}</a-select-option>
                      </a-select>
                    </a-form-model-item>
                  </a-col>
                  <a-col :xs="24" :sm="24" :md="12" :xl="8">
                    <a-form-model-item
                      :labelCol="labelCol"
                      :wrapperCol="wrapperCol"
                      label="身份证号"
                      :prop="'salerList[' + index + '].assignor.personIdcard'"
                      :rules="rules.blur"
                    >
                      <a-input placeholder="请输入身份证号码" v-model="pane.assignor.personIdcard" />
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
                          :prop="'salerList[' + index + '].assignor.personIdcardStart'"
                          :rules="rules.change"
                          style="width: 50%; margin-bottom: 0"
                        >
                          <a-date-picker
                            format="YYYY-MM-DD"
                            v-model="pane.personIdcardStart"
                            placeholder="开始日期"
                            @change="(date, dateString) => dateChange(date, dateString, index, 'person', 'assignor')"
                          />
                        </a-form-model-item>
                        <a-form-model-item
                          :prop="'salerList[' + index + '].assignor.personIdcardEnd'"
                          :rules="rules.date"
                          style="width: 50%; margin-bottom: 0"
                        >
                          <a-input v-model="pane.personIdcardEnd" placeholder="结束日期" />
                        </a-form-model-item>
                      </a-input-group>
                    </a-form-model-item>
                  </a-col>
                  <a-col :xs="24" :sm="24" :md="12" :xl="8">
                    <a-form-model-item
                      :labelCol="labelCol"
                      :wrapperCol="wrapperCol"
                      label="联系电话"
                      :prop="'salerList[' + index + '].assignor.personPhone'"
                      :rules="rules.phone"
                    >
                      <a-input :max-length="11" placeholder="请输入11位手机号码" v-model="pane.assignor.personPhone" />
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
                      :prop="'salerList[' + index + '].assignor.personIdcardAddr'"
                      :rules="rules.blur"
                    >
                      <a-input placeholder="请输入你的详细地址" v-model="pane.assignor.personIdcardAddr" />
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
                        :prop="'salerList[' + index + '].assignor.personIdcardFront'"
                        :rules="{ required: true, message: '请上传身份证人像面', trigger: 'change' }"
                      >
                        <UploadImg
                          tip="身份证人像面"
                          :isCard1="true"
                          :ids="pane.assignor.personIdcardFront"
                          @setImageValue="(file) => setImageData(file, index, 'personIdcardFront', 'assignor')"
                          v-model="pane.assignor.personIdcardFront"
                        />
                      </a-form-model-item>
                      <a-form-model-item
                        :prop="'salerList[' + index + '].assignor.personIdcardBack'"
                        :rules="{ required: true, message: '请上传身份证国徽面', trigger: 'change' }"
                      >
                        <UploadImg
                          tip="身份证国徽面"
                          :isCard2="true"
                          :ids="pane.assignor.personIdcardBack"
                          @setImageValue="(file) => setImageData(file, index, 'personIdcardBack', 'assignor')"
                          v-model="pane.assignor.personIdcardBack"
                        />
                      </a-form-model-item>
                    </a-form-model-item>
                  </a-col>
                  <a-col :xs="24" :sm="24" :md="12" :xl="8">
                    <a-form-model-item
                      :labelCol="labelCol"
                      :wrapperCol="wrapperCol"
                      label="委托证明"
                      class="image-box"
                      :prop="'salerList[' + index + '].assignor.personCert'"
                      :rules="{ required: true, message: '请上传委托证明', trigger: 'change' }"
                    >
                      <UploadImg
                        tip="委托证明"
                        :ids="pane.assignor.personCert"
                        @setImageValue="(file) => setImageData(file, index, 'personCert', 'assignor')"
                        v-model="pane.assignor.personCert"
                      />
                    </a-form-model-item>
                  </a-col>
                </a-row>
                <div class="close-but">
                  <a-icon type="minus-square" @click="removeAssignor(index)" />
                </div>
              </div>
            </a-card>
          </div>

          <!-- 监护人信息 -->
          <div class="card-wrap" v-if="pane.guardianList.length > 0">
            <div class="card-header">
              <span class="title">监护人信息：</span>
            </div>
            <a-card :bodyStyle="{ padding: 0 }">
              <div class="card-item" v-for="(guardian, keyIndex) in pane.guardianList" :key="keyIndex">
                <a-row :gutter="gutter">
                  <a-col :xs="24" :sm="24" :md="12" :xl="8">
                    <a-form-model-item
                      :labelCol="labelCol"
                      :wrapperCol="wrapperCol"
                      label="姓名"
                      :prop="'salerList[' + index + '].guardianList[' + keyIndex + '].personName'"
                      :rules="rules.blur"
                    >
                      <a-input placeholder="请输入姓名" v-model="guardian.personName">
                        <a-tooltip slot="addonAfter" title="点击读取信息">
                          <a-icon
                            type="idcard"
                            class="read-card-icon"
                            @click.native="getIdCardInfo(index, 'person', 'guardianList', keyIndex)"
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
                      :prop="'salerList[' + index + '].guardianList[' + keyIndex + '].personGender'"
                      :rules="rules.change"
                    >
                      <a-select placeholder="请选择" v-model="guardian.personGender">
                        <a-select-option v-for="item in genderList" :key="item.key">{{ item.value }}</a-select-option>
                      </a-select>
                    </a-form-model-item>
                  </a-col>
                  <a-col :xs="24" :sm="24" :md="12" :xl="8">
                    <a-form-model-item
                      :labelCol="labelCol"
                      :wrapperCol="wrapperCol"
                      label="身份证号"
                      :prop="'salerList[' + index + '].guardianList[' + keyIndex + '].personIdcard'"
                      :rules="rules.blur"
                    >
                      <a-input placeholder="请输入身份证号码" v-model="guardian.personIdcard" />
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
                          :prop="'salerList[' + index + '].guardianList[' + keyIndex + '].personIdcardStart'"
                          :rules="rules.change"
                          style="width: 50%; margin-bottom: 0"
                        >
                          <a-date-picker
                            format="YYYY-MM-DD"
                            v-model="guardian.personIdcardStart"
                            placeholder="开始日期"
                            @change="
                              (date, dateString) =>
                                dateChange(date, dateString, index, 'person', 'guardianList', keyIndex)
                            "
                          />
                        </a-form-model-item>
                        <a-form-model-item
                          :prop="'salerList[' + index + '].guardianList[' + keyIndex + '].personIdcardEnd'"
                          :rules="rules.date"
                          style="width: 50%; margin-bottom: 0"
                        >
                          <a-input v-model="guardian.personIdcardEnd" placeholder="结束日期" />
                        </a-form-model-item>
                      </a-input-group>
                    </a-form-model-item>
                  </a-col>
                  <a-col :xs="24" :sm="24" :md="12" :xl="8">
                    <a-form-model-item
                      :labelCol="labelCol"
                      :wrapperCol="wrapperCol"
                      label="联系电话"
                      :prop="'salerList[' + index + '].guardianList[' + keyIndex + '].personPhone'"
                      :rules="rules.phone"
                    >
                      <a-input :max-length="11" placeholder="请输入11位手机号码" v-model="guardian.personPhone" />
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
                      :prop="'salerList[' + index + '].guardianList[' + keyIndex + '].personIdcardAddr'"
                      :rules="rules.blur"
                    >
                      <a-input placeholder="请输入你的详细地址" v-model="guardian.personIdcardAddr" />
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
                        :prop="'salerList[' + index + '].guardianList[' + keyIndex + '].personIdcardFront'"
                        :rules="{ required: true, message: '请上传身份证人像面', trigger: 'change' }"
                      >
                        <UploadImg
                          tip="身份证人像面"
                          :isCard1="true"
                          :ids="guardian.personIdcardFront"
                          @setImageValue="
                            (file) => setImageData(file, index, 'personIdcardFront', 'guardianList', keyIndex)
                          "
                          v-model="guardian.personIdcardFront"
                        />
                      </a-form-model-item>
                      <a-form-model-item
                        :prop="'salerList[' + index + '].guardianList[' + keyIndex + '].personIdcardBack'"
                        :rules="{ required: true, message: '请上传身份证国徽面', trigger: 'change' }"
                      >
                        <UploadImg
                          tip="身份证国徽面"
                          :isCard2="true"
                          :ids="guardian.personIdcardBack"
                          @setImageValue="
                            (file) => setImageData(file, index, 'personIdcardBack', 'guardianList', keyIndex)
                          "
                          v-model="guardian.personIdcardBack"
                        />
                      </a-form-model-item>
                    </a-form-model-item>
                  </a-col>
                  <a-col :xs="24" :sm="24" :md="12" :xl="8">
                    <a-form-model-item
                      :labelCol="labelCol"
                      :wrapperCol="wrapperCol"
                      label="监护人证明"
                      class="image-box"
                      :prop="'salerList[' + index + '].guardianList[' + keyIndex + '].personCert'"
                      :rules="{ required: true, message: '请上传监护人证明', trigger: 'change' }"
                    >
                      <UploadImg
                        tip="证明"
                        :ids="guardian.personCert"
                        @setImageValue="(file) => setImageData(file, index, 'personCert', 'guardianList', keyIndex)"
                        v-model="guardian.personCert"
                      />
                    </a-form-model-item>
                  </a-col>
                </a-row>
                <div class="close-but">
                  <a-icon type="minus-square" @click="removeGuardian(index, keyIndex)" />
                </div>
              </div>
            </a-card>
          </div>

          <!-- 收款银行 -->
          <div class="card-wrap">
            <div class="card-header">
              <span class="title">收款银行：</span>
              <a-button type="primary" @click.native="addBank(index, 'SALER_DOWN_PAYMENT')" class="mr-8"
                >添加首期收款银行</a-button
              >
              <a-button type="primary" @click.native="addBank(index, 'SALER_BALANCE')">添加尾款收款银行</a-button>
            </div>
            <a-card :bodyStyle="{ padding: 0 }">
              <div class="card-item" v-for="(bank, bankIndex) in pane.bankAccountList" :key="bankIndex">
                <a-row :gutter="gutter">
                  <a-col :xs="24" :sm="24" :md="12" :xl="8">
                    <a-form-model-item
                      :labelCol="labelCol"
                      :wrapperCol="wrapperCol"
                      label="类型"
                      :prop="'salerList[' + index + '].bankAccountList[' + bankIndex + '].accountBusinessType'"
                      :rules="rules.change"
                    >
                      <a-select placeholder="请选择" v-model="bank.accountBusinessType">
                        <a-select-option v-for="item in bankBisTypeList" :key="item.key">{{
                          item.value
                        }}</a-select-option>
                      </a-select>
                    </a-form-model-item>
                  </a-col>
                </a-row>
                <a-row :gutter="gutter">
                  <a-col :xs="24" :sm="24" :md="12" :xl="8">
                    <a-form-model-item
                      :labelCol="labelCol"
                      :wrapperCol="wrapperCol"
                      label="收款人"
                      :prop="'salerList[' + index + '].bankAccountList[' + bankIndex + '].accountPersonName'"
                      :rules="rules.blur"
                    >
                      <a-input placeholder="请输入收款人姓名" v-model="bank.accountPersonName" />
                    </a-form-model-item>
                  </a-col>
                  <a-col :xs="24" :sm="24" :md="12" :xl="8">
                    <a-form-model-item
                      :labelCol="labelCol"
                      :wrapperCol="wrapperCol"
                      label="卡号"
                      :prop="'salerList[' + index + '].bankAccountList[' + bankIndex + '].bankCardNo'"
                      :rules="rules.bankCardNo"
                    >
                      <a-input placeholder="请输入卡号" :max-length="20" v-model="bank.bankCardNo">
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
                      :prop="'salerList[' + index + '].bankAccountList[' + bankIndex + '].bankName'"
                      :rules="rules.blur"
                    >
                      <a-input placeholder="请输入开户行" v-model="bank.bankName" />
                    </a-form-model-item>
                  </a-col>
                  <a-col :xs="24" :sm="24" :md="24" :xl="16">
                    <a-form-model-item
                      :labelCol="labelRowCol"
                      :wrapperCol="wrapperRowCol"
                      label="银行卡"
                      class="image-box"
                      required
                    >
                      <a-form-model-item
                        :prop="'salerList[' + index + '].bankAccountList[' + bankIndex + '].bankCardFront'"
                        :rules="{ required: true, message: '请上传银行卡正面', trigger: 'change' }"
                      >
                        <UploadImg
                          tip="银行卡正面"
                          :ids="bank.bankCardFront"
                          @setImageValue="
                            (file) => setImageData(file, index, 'bankCardFront', 'bankAccountList', bankIndex)
                          "
                          v-model="bank.bankCardFront"
                        />
                      </a-form-model-item>
                      <a-form-model-item
                        :prop="'salerList[' + index + '].bankAccountList[' + bankIndex + '].bankCardBack'"
                        :rules="{ required: true, message: '请上传银行卡背面', trigger: 'change' }"
                      >
                        <UploadImg
                          tip="银行卡背面"
                          :ids="bank.bankCardBack"
                          @setImageValue="
                            (file) => setImageData(file, index, 'bankCardBack', 'bankAccountList', bankIndex)
                          "
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

      <a-form-model-item class="form-btn" style="margin-top: 24px">
        <a-button @click="handleReturn">返 回</a-button>
        <a-button type="primary" @click="handleOk" style="margin-left: 24px">保 存</a-button>
      </a-form-model-item>
    </a-spin>
    <ThirdPay ref="thirdForm" @ok="setThirdValue" />
  </a-form-model>
</template>

<script>
import modalMixin from '@/components/Mixins/form'
import indexMixin from './modules/Tab2'
import UploadImg from '@/components/Upload/index'
import ThirdPay from './modules/ThirdPay'
export default {
  name: 'Tab2',
  mixins: [modalMixin, indexMixin],
  components: {
    UploadImg,
    ThirdPay,
  },
}
</script>

<style lang="less" scoped>
.tab-extra {
  display: inline-block;
  vertical-align: 3px;
}
</style>
