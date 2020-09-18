import {
  axios
} from '@/utils/request'
import pick from 'lodash.pick'

var indexMixin = {
  data() {
    let panes = [{
        key: '1',
        title: '买卖合同',
        content: '1',
      },
      {
        key: '2',
        title: '资金监管协议',
        content: '1',
      },
      {
        key: '3',
        title: '资金托管协议',
        content: '1',
      },
      {
        key: '4',
        title: '第三方垫付申请书',
        content: '1',
      },
      {
        key: '5',
        title: '贷款担保合同',
        content: '1',
      },
      {
        key: '6',
        title: '首期款收据',
        content: '1',
      },
      {
        key: '7',
        title: '收款账号承诺书',
        content: '1',
      },
      {
        key: '8',
        title: '公积金贷款委托书',
        content: '1',
      },
      {
        key: '9',
        title: '贷款申请资料收件确认单',
        content: '1',
      },
      {
        key: '10',
        title: '个人婚姻登录信息查询授权书',
        content: '1',
      },
      {
        key: '11',
        title: '未再婚声明书（买方',
        content: '1',
      },
      {
        key: '12',
        title: '未婚声明书（买方）',
        content: '1',
      },
      {
        key: '13',
        title: '二手房公积金贷款担保书',
        content: '1',
      },
      {
        key: '14',
        title: '担保函',
        content: '1',
      },
      {
        key: '15',
        title: '权证收条',
        content: '1',
      },
    ]
    return {
      activeKey: panes[0].key,
      panes,
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
    }
  },
  filters: {},
  created() {},
  methods: {
    // submit
    handleSubmit() {
      const {
        form: {
          validateFields
        },
      } = this
      // 先校验，通过表单校验后，才进入下一步
      validateFields((err, values) => {
        console.log(values)
        if (!err) {}
      })
    }
  },
}
export default indexMixin