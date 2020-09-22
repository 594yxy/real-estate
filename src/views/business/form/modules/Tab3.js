import {
  axios
} from '@/utils/request'
import pick from 'lodash.pick'

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
        addUrl: '/api/business/temp',
        editUrl: '/api/business/update/'
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
      downPayList: [],
      model: {
        loan: {},
        property: {}
      },
      loanTypeList: [],
      bankList: []
    }
  },
  filters: {},
  created() {
    this.model = this.info
    this.getDictData('loan_type', 'loanTypeList')
    this.getDictData('bank_code', 'bankList')
  },
  methods: {
    afterSubmit(data) {
      this.model = data
    },
    handleReturn() {
      this.$emit('prevStep')
    },
    // 追加首付
    addDownPayAmount() {
      this.downPayList.push({})
    },
    delDownPayAmount(i) {
      this.downPayList.splice(i, 1)
    },
    // 计算贷款额度
    handleCalculate() {
      this.$refs.loadModal.add()
    },
    // 多图片上传
    setFileValue(fileList, type, fileId) {
      let ids = fileList.map((item, index) => {
        this.fileIds.push(item.id)
        return item.id
      })
      this.model[type][fileId] = ids.join()
    },
  },
}
export default indexMixin