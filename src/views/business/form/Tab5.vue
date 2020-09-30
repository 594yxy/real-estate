<template>
  <a-form-model ref="ruleForm" :model="model" class="my-form">
    <a-tabs type="card" v-model="activeKey" tab-position="left" class="my-card-tabs" :animated="false">
      <!-- 买方 -->
      <a-tab-pane key="buyer" tab="买方">
        <template v-if="model.buyerList[0].id">
          <a-card size="small" class="person" v-for="item in model.buyerList" :key="item.id">
            <ul class="person-box">
              <li class="person-box-item">
                <h4 class="title">{{ item.buyerName }}</h4>
                <ul class="con">
                  <li v-if="item.buyerIdcardFront">
                    <h4>身份证</h4>
                    <div class="img">
                      <UploadList :plus="false" :ids="item.buyerIdcardFront + ',' + item.buyerIdcardBack" />
                    </div>
                  </li>
                  <li v-if="item.buyerResidentFirst">
                    <h4>户口本</h4>
                    <div class="img">
                      <UploadList :plus="false" :ids="item.buyerResidentFirst + ',' + item.buyerResidentSelf" />
                    </div>
                  </li>
                  <li v-if="item.buyerMarriageCert">
                    <h4>婚姻证明</h4>
                    <div class="img"><UploadList :plus="false" :ids="item.buyerMarriageCert" /></div>
                  </li>
                </ul>
              </li>

              <li class="person-box-item" v-if="item.buyerMarriage == '02'">
                <h4 class="title">配偶</h4>
                <ul class="con">
                  <li v-if="item.spouseIdcardFront">
                    <h4>身份证</h4>
                    <div class="img">
                      <UploadList :plus="false" :ids="item.spouseIdcardFront + ',' + item.spouseIdcardBack" />
                    </div>
                  </li>
                  <li v-if="item.spouseResidentFirst">
                    <h4>户口本</h4>
                    <div class="img">
                      <UploadList :plus="false" :ids="item.spouseResidentFirst + ',' + item.spouseResidentSelf" />
                    </div>
                  </li>
                </ul>
              </li>

              <li class="person-box-item">
                <h4 class="title">进账银行</h4>
                <ul class="con">
                  <li v-for="bank in item.bankAccountList" :key="bank.id">
                    <div class="img">
                      <UploadList :plus="false" :ids="bank.bankCardFront + ',' + bank.bankCardBack" />
                    </div>
                  </li>
                </ul>
              </li>
            </ul>
          </a-card>
        </template>
      </a-tab-pane>
      <!-- 卖方 -->
      <a-tab-pane key="saler" tab="卖方">
        <template v-if="model.salerList[0].id">
          <a-card size="small" class="person" v-for="item in model.salerList" :key="item.id">
            <ul class="person-box">
              <li class="person-box-item">
                <h4 class="title">{{ item.salerName }}</h4>
                <ul class="con">
                  <li v-if="item.salerIdcardFront">
                    <h4>身份证</h4>
                    <div class="img">
                      <UploadList :plus="false" :ids="item.salerIdcardFront + ',' + item.salerIdcardBack" />
                    </div>
                  </li>
                </ul>
              </li>
              <li class="person-box-item" v-if="item.assignor">
                <h4 class="title">委托人</h4>
                <ul class="con">
                  <li>
                    <h4>身份证</h4>
                    <div class="img">
                      <UploadList
                        :plus="false"
                        :ids="item.assignor.personIdcardFront + ',' + item.assignor.personIdcardBack"
                      />
                    </div>
                  </li>
                  <li>
                    <h4>委托证明</h4>
                    <div class="img"><UploadList :plus="false" :ids="item.assignor.personCert" /></div>
                  </li>
                </ul>
              </li>
              <li class="person-box-item" v-if="item.guardianList.length > 0">
                <h4 class="title">监护人</h4>
                <ul class="con" v-for="guardian in item.guardianList" :key="guardian.id">
                  <li>
                    <h4>身份证</h4>
                    <div class="img">
                      <UploadList :plus="false" :ids="guardian.personIdcardFront + ',' + guardian.personIdcardBack" />
                    </div>
                  </li>
                  <li>
                    <h4>监护人证明</h4>
                    <div class="img"><UploadList :plus="false" :ids="guardian.personCert" /></div>
                  </li>
                </ul>
              </li>
            </ul>
          </a-card>
        </template>
      </a-tab-pane>
      <!-- 房产证 -->
      <a-tab-pane key="propertyCertifate" tab="房产证">
        <template v-if="model.property">
          <UploadList :plus="false" :ids="model.property.propertyCert" />
        </template>
      </a-tab-pane>
      <!-- 第三方身份证 -->
      <a-tab-pane key="thirdIdcard" tab="第三方身份证" v-if="model.thirdPayment">
        <UploadList
          :plus="false"
          :ids="model.thirdPayment.thirdIdcardFront + ',' + model.thirdPayment.thirdIdcardBack"
        />
      </a-tab-pane>
      <!-- 第三方进账凭证 -->
      <a-tab-pane key="thirdReceiptsCert" tab="第三方进账凭证" v-if="model.thirdPayment">
        <UploadList :plus="false" :ids="model.thirdPayment.thirdReceiptsCert" />
      </a-tab-pane>
      <!-- 第三方垫付申请书 -->
      <a-tab-pane key="thirdApplication" tab="第三方垫付申请书" v-if="model.thirdPayment">
        <UploadList :plus="false" :ids="model.thirdPayment.thirdApplication" />
      </a-tab-pane>

      <!-- 买卖合同 -->
      <a-tab-pane key="salesContract" tab="买卖合同">
        <UploadList :ids="model.salesContract" @setFileValue="(file) => setFileValue(file, 'salesContract')" />
      </a-tab-pane>
      <!-- 资金监管协议 -->
      <a-tab-pane key="regulatoryAgreement" tab="资金监管协议">
        <UploadList
          :ids="model.regulatoryAgreement"
          @setFileValue="(file) => setFileValue(file, 'regulatoryAgreement')"
        />
      </a-tab-pane>
      <!-- 资金托管协议 -->
      <a-tab-pane key="escrowAgreement" tab="资金托管协议">
        <UploadList :ids="model.escrowAgreement" @setFileValue="(file) => setFileValue(file, 'escrowAgreement')" />
      </a-tab-pane>
      <!-- 贷款担保合同 -->
      <a-tab-pane key="guaranteeContract" tab="贷款担保合同">
        <UploadList :ids="model.guaranteeContract" @setFileValue="(file) => setFileValue(file, 'guaranteeContract')" />
      </a-tab-pane>
      <!-- 首期款收据 -->
      <a-tab-pane key="downPaymentReceipt" tab="首期款收据">
        <UploadList
          :ids="model.downPaymentReceipt"
          @setFileValue="(file) => setFileValue(file, 'downPaymentReceipt')"
        />
      </a-tab-pane>
      <!-- 收款账号承诺书 -->
      <a-tab-pane key="accountCommitment" tab="收款账号承诺书">
        <UploadList :ids="model.accountCommitment" @setFileValue="(file) => setFileValue(file, 'accountCommitment')" />
      </a-tab-pane>
      <!-- 未婚申明书 -->
      <a-tab-pane key="unmarriedStatement" tab="　未婚声明书　（买方）">
        <UploadList
          :ids="model.unmarriedStatement"
          @setFileValue="(file) => setFileValue(file, 'unmarriedStatement')"
        />
      </a-tab-pane>
      <!-- 未再婚申明书 -->
      <a-tab-pane key="notRemarriageStatement" tab="　未再婚声明书　（买方）">
        <UploadList
          :ids="model.notRemarriageStatement"
          @setFileValue="(file) => setFileValue(file, 'notRemarriageStatement')"
        />
      </a-tab-pane>
      <!-- 新不动产证 -->
      <a-tab-pane key="newPropertyCert" tab="新不动产证">
        <UploadList :ids="model.newPropertyCert" @setFileValue="(file) => setFileValue(file, 'newPropertyCert')" />
      </a-tab-pane>
      <!-- 权证收条 -->
      <a-tab-pane key="warrantReceipt" tab="权证收条">
        <UploadList :ids="model.warrantReceipt" @setFileValue="(file) => setFileValue(file, 'warrantReceipt')" />
      </a-tab-pane>
      <!-- 抵押合同 -->
      <a-tab-pane key="mortageContract" tab="抵押合同">
        <UploadList :ids="model.mortageContract" @setFileValue="(file) => setFileValue(file, 'mortageContract')" />
      </a-tab-pane>
      <!-- 他项权证 -->
      <a-tab-pane key="otherWarrant" tab="他项权证">
        <UploadList :ids="model.otherWarrant" @setFileValue="(file) => setFileValue(file, 'otherWarrant')" />
      </a-tab-pane>
      <!-- 其他 -->
      <a-tab-pane key="otherInfo" tab="其他">
        <UploadList :ids="info.otherInfo" @setFileValue="(file) => setFileValue(file, 'otherInfo')" />
      </a-tab-pane>
    </a-tabs>
    <a-form-model-item class="form-btn" style="margin-top: 24px">
      <a-button>取 消</a-button>
      <a-button type="primary" @click="handleOk" style="margin-left: 24px">保 存</a-button>
    </a-form-model-item>
  </a-form-model>
</template>

<script>
import modalMixin from '@/components/Mixins/form'
import indexMixin from './modules/Tab5'
import UploadList from '@/components/Upload/list'
export default {
  name: 'Step5',
  mixins: [modalMixin, indexMixin],
  components: {
    UploadList,
  },
}
</script>
<style lang="less" scoped>
.card-tabs-wrap h3 {
  color: #1890ff;
}
.person {
  margin-bottom: 20px;
  ul {
    padding-left: 0;
    margin-bottom: 0;
  }
  .person-box {
    .person-box-item {
      padding: 10px 10px 0;
      .title {
        font-size: 15px;
        font-weight: bold;
      }
      .con {
        display: flex;
        flex-wrap: wrap;
        li {
          margin-right: 20px;
          &:last-child {
            margin-right: 0;
          }
        }
      }
    }
  }
}
</style>
