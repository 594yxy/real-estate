<template>
  <page-header-wrapper :title="false">
    <a-card :bordered="false">
      <a-spin :spinning="confirmLoading">
        <a-tabs v-model="activeKey" class="my-tabs" @change="tabChange" :animated="false" v-if="showTab">
          <a-tab-pane :key="1">
            <span slot="tab"> <a-icon type="user" />买方信息 </span>
            <Tab1 v-if="activeKey == 1" :info="business" @ok="setModel" />
          </a-tab-pane>
          <a-tab-pane :key="2">
            <span slot="tab"> <a-icon type="home" />卖方信息 </span>
            <Tab2 v-if="activeKey == 2" @prevStep="prevStep" :info="business" @ok="setModel" />
          </a-tab-pane>
          <a-tab-pane :key="3">
            <span slot="tab"> <a-icon type="red-envelope" />贷款信息 </span>
            <Tab3 v-if="activeKey == 3" @prevStep="prevStep" :info="business" @ok="setModel" />
          </a-tab-pane>
          <a-tab-pane :key="4">
            <span slot="tab"> <a-icon type="printer" />打印贷款资料 </span>
            <Tab4 v-if="activeKey == 4" @prevStep="prevStep" :info="business" />
          </a-tab-pane>
          <a-tab-pane :key="5">
            <span slot="tab"> <a-icon type="schedule" />完善贷款资料 </span>
            <Tab5 v-if="activeKey == 5" @prevStep="prevStep" :info="business" />
          </a-tab-pane>
        </a-tabs>
      </a-spin>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import Tab1 from './Tab1'
import Tab2 from './Tab2'
import Tab3 from './Tab3'
import Tab4 from './Tab4'
import Tab5 from './Tab5'
import { axios } from '@/utils/request'

export default {
  name: 'TabForm',
  components: {
    Tab1,
    Tab2,
    Tab3,
    Tab4,
    Tab5,
  },
  data() {
    const business = {
      id: '',
      buyerList: [
        {
          title: '买方信息',
          tabKey: 0,
          closable: false,
          bankAccountList: [{}],
        },
      ],
      salerList: [
        {
          title: '卖方信息',
          tabKey: 0,
          closable: false,
          assignor: null,
          guardianList: [],
          bankAccountList: [
            {
              accountBusinessType: 'SALER',
            },
          ],
        },
      ],
      loan: {},
      property: {},
      downPayment: [],
    }
    return {
      Urls: {
        getByIdUrl: '/biz/api/business/all/get/',
      },
      activeKey: 1,
      form: null,
      business,
      showTab: true,
      confirmLoading: false,
    }
  },
  created() {
    let actKey = localStorage.getItem('bisActKey') || 1
    console.log('main', actKey)
    this.activeKey = Number(actKey)
  },
  mounted() {
    let businessId = this.$route.query.id
    if (businessId) {
      this.fillForm(businessId)
    }
  },
  methods: {
    // 详情表单
    fillForm(id) {
      this.confirmLoading = true
      axios({
        url: this.Urls.getByIdUrl + id,
        method: 'get',
      })
        .then((res) => {
          this.confirmLoading = false
          if (res.code == 0) {
            this.business = res.data
            console.log('业务对象', this.business)
            if (!res.data.buyerList || res.data.buyerList.length == 0) {
              this.business.buyerList = [
                {
                  title: '买方信息',
                  tabKey: 0,
                  closable: false,
                  bankAccountList: [{}],
                },
              ]
            }
            if (!res.data.salerList || res.data.salerList.length == 0) {
              this.business.salerList = [
                {
                  title: '卖方信息',
                  tabKey: 0,
                  closable: false,
                  assignor: null,
                  guardianList: [],
                  bankAccountList: [
                    {
                      accountBusinessType: 'SALER',
                    },
                  ],
                },
              ]
            }

            if (!res.data.loan) {
              this.business.loan = {}
            }
            if (!res.data.property) {
              this.business.property = {}
            }
            this.showTab = false
            this.$nextTick(() => {
              this.showTab = true
            })
          } else {
            this.$notification.error({
              message: res.msg,
            })
          }
        })
        .catch(() => {})
    },
    tabChange(key) {
      console.log('改变key', this.business)
      localStorage.setItem('bisActKey', key)
    },
    prevStep() {
      if (this.activeKey > 0) {
        this.activeKey -= 1
      }
    },
    setModel(data) {
      this.business = data
    },
  },
  beforeDestroy() {
    localStorage.removeItem('bisActKey')
  },
}
</script>

<style lang="less" scoped>
.my-tabs {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
