import {
  axios
} from '@/utils/request'
import pick from 'lodash.pick'

var indexMixin = {
  data() {
    return {
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
      downPayList: []
    }
  },
  filters: {},
  created() {},
  methods: {
    // submit
    handleSubmit() {
      this.form.validateFields((err, values) => {
        console.log(values)
        if (!err) {}
      })
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
    }
  },
}
export default indexMixin