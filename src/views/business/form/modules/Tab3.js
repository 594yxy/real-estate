import {
  axios
} from '@/utils/request'

var indexMixin = {
  props: {
    info: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      Urls: {
        addUrl: '/biz/api/business/temp',
        editUrl: '/biz/api/business/update/'
      },
      labelCol: {
        xxl: {
          span: 8
        },
        xl: {
          span: 8
        },
        sm: {
          span: 6
        },
      },
      wrapperCol: {
        xxl: {
          span: 16
        },
        xl: {
          span: 16
        },
        sm: {
          span: 18
        },
      },
      labelRowCol: {
        xxl: {
          span: 4
        },
        xl: {
          span: 4
        },
        md: {
          span: 3
        },
        sm: {
          span: 6
        },
      },
      wrapperRowCol: {
        xxl: {
          span: 20
        },
        xl: {
          span: 20
        },
        md: {
          span: 21
        },
        sm: {
          span: 18
        },
      },
      gutter: 15,
      loanTypeList: [],
      busTypeList: [],
      bankList: [],
      tips: {
        add: '贷款信息保存成功',
        edit: '贷款信息保存成功'
      },
    }
  },
  watch: {
    'model.loan.loanSubType': {
      handler: function (val) {
        if (!val) {
          this.model.loan.loanSubType = undefined
        }
      },
      deep: true
    },
    'model.loan.loanType': {
      handler: function (val) {
        if (!val) {
          this.model.loan.loanType = undefined
        }
      },
      deep: true
    },
    'model.supervisoryBankName': {
      handler: function (val) {
        if (!val) {
          this.model.supervisoryBankName = undefined
        }
      },
      deep: true
    },
    'model.property.isMortgage': {
      handler: function (val) {
        if (val == null) {
          this.model.property.isMortgage = undefined
        }
      },
      deep: true
    }
  },
  filters: {},
  created() {
    this.model = this.info
    console.log('贷款信息', this.model.loan)
    this.getDictData('loan_type', 'loanTypeList')
    this.getDictData('bank_code', 'bankList')
    this.getDictData('business_type', 'busTypeList')
  },
  methods: {
    afterSubmit(data) {
      this.$nextTick(() => {
        this.model = data
      })
    },
    handleReturn() {
      this.$emit('prevStep')
    },
    // 追加首付
    addDownPayAmount() {
      this.model.downPayment.push({})
    },
    delDownPayAmount(i) {
      this.model.downPayment.splice(i, 1)
    },
    // 计算贷款额度
    handleCalculate() {
      this.$refs.loadModal.add()
    },
    // 多图片上传
    setFileValue(ids, type, field) {
      console.log('多', ids)
      this.fileIds = [this.fileIds, ...ids]
      this.$set(this.model[type], `${field}`, ids.join())
    },
  },
}
export default indexMixin