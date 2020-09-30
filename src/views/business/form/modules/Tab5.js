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
      activeKey: 'buyer',
      gutter: 15,
      validatorRules: {
        must: {
          rules: [{
            required: true,
            message: '此字段为必填项！'
          }]
        },
        phone: {
          rules: [{
            validator: this.validator.validatePhone
          }]
        },
      },
      tips: {
        add: '保证成功',
        edit: '保存成功'
      },
    }
  },
  filters: {},
  created() {
    console.log('贷款资料', this.info)
    this.model = this.info
  },
  methods: {
    afterSubmit(data) {
      this.$nextTick(() => {
        this.model = data
      })
    },
    // 多图片上传
    setFileValue(ids, field) {
      console.log('多', ids)
      this.fileIds = [this.fileIds, ...ids]
      this.$set(this.model, `${field}`, ids.join())
    },
  },
}
export default indexMixin