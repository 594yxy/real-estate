import {
  axios
} from '@/utils/request'
import moment from 'moment'
import IdCard from '@/components/IdCard/index'

var indexMixin = {
  props: {
    info: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    const salerList = [{
      title: '卖方信息',
      tabKey: 0,
      closable: false,
      assignor: null,
      guardianList: [],
      bankAccountList: [{
        accountBusinessType: 'SALER'
      }]
    }]
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
      labelSingleCol: {
        xxl: {
          span: 2
        },
        xl: {
          span: 2
        },
        md: {
          span: 3
        },
        sm: {
          span: 6
        },
      },
      wrapperSingleCol: {
        xxl: {
          span: 22
        },
        xl: {
          span: 22
        },
        md: {
          span: 21
        },
        sm: {
          span: 18
        },
      },
      gutter: 15,
      bankBisTypeList: [{
        key: "SALER",
        value: "收款银行"
      }, {
        key: "SALER_DOWN_PAYMENT",
        value: "首期款银行"
      }, {
        key: "SALER_BALANCE",
        value: "尾款银行"
      }],
      tips: {
        add: '卖方信息保存成功',
        edit: '卖方信息保存成功'
      },
      activeKey: salerList[0].tabKey,
      newTabIndex: 1
    }
  },
  filters: {},
  created() {
    this.getDictData('gender', 'genderList')
    this.model = this.info
    if (this.model.id) {
      this.setForm()
    }
  },
  methods: {
    // 赋值
    setForm() {
      console.log('卖方信息', this.model.salerList)
      if (this.model.salerList && this.model.salerList.length > 0) {
        this.model.salerList.map((item, index) => {
          item.title = index == 0 ? "卖房信息" : "共有人"
          item.closable = index == 0 ? false : true
          item.tabKey = index
        })
      }
    },
    afterSubmit(data) {
      this.$nextTick(() => {
        this.model = data
        this.setForm()
      })
    },
    onTabEdit(targetKey, action) {
      this[action](targetKey)
    },
    // add Tab
    add() {
      const panes = this.model.salerList;
      const activeKey = `${this.newTabIndex++}`;
      panes.push({
        title: `共有人`,
        tabKey: activeKey,
        guardianList: [],
        assignor: null,
        bankAccountList: [{
          accountBusinessType: 'SALER'
        }]
      });
      this.model.salerList = panes;
      this.activeKey = activeKey;
    },
    // remove Tab
    remove(targetKey) {
      let activeKey = this.activeKey;
      let lastIndex;
      const panes = this.model.salerList;
      panes.forEach((pane, i) => {
        if (pane.tabKey === targetKey) {
          lastIndex = i - 1;
        }
      });
      panes.splice(targetKey, 1)
      if (panes.length && activeKey === targetKey) {
        if (lastIndex >= 0) {
          activeKey = panes[lastIndex].tabKey;
        } else {
          activeKey = panes[0].tabKey;
        }
      }
      this.model.salerList = panes;
      this.activeKey = activeKey;
    },
    handleReturn() {
      this.$emit('prevStep')
    },
    // 第三方垫付
    addThirdPay() {
      if (this.model.thirdPayment) {
        this.$refs.thirdForm.edit(this.model)
        this.$refs.thirdForm.dialogStatus = 'edit'
      } else {
        this.$refs.thirdForm.edit(this.model)
        this.$refs.thirdForm.dialogStatus = 'add'
      }
    },
    setThirdValue(data) {
      this.model.thirdPayment = data.thirdPayment
    },

    // 委托人
    addAssignor(index) {
      this.model.salerList[index].assignor = {}
    },
    removeAssignor(index) {
      this.model.salerList[index].assignor = undefined
    },

    // 监护人
    addGuardian(index) {
      if (this.model.salerList[index].guardianList.length == 2) {
        return
      }
      this.model.salerList[index].guardianList.push({})
    },

    removeGuardian(index, keyIndex) {
      this.model.salerList[index].guardianList.splice(keyIndex, 1)
    },

    // 银行信息
    addBank(index, type) {
      let len = this.model.salerList[index].bankAccountList.length
      this.model.salerList[index].bankAccountList.push({
        accountBusinessType: type
      })
    },
    removeBank(index, keyIndex) {
      if (this.model.salerList[index].bankAccountList.length === 1) {
        return
      }
      this.model.salerList[index].bankAccountList.splice(keyIndex, 1)
    },

    // 日期格式
    dateChange(date, dateString, index, type, obj, keyIndex) {
      if (obj && typeof (keyIndex) == 'undefined') {
        // object
        this.model.salerList[index][`${obj}`][`${type}IdcardStart`] = dateString
      } else if (obj && typeof (keyIndex) == 'number') {
        // array
        this.model.salerList[index][`${obj}`][`${keyIndex}`][`${type}IdcardStart`] = dateString
      } else {
        // all
        this.model.salerList[index][`${type}IdcardStart`] = dateString
      }
    },

    // 获取银行信息
    async getBankInfo(file, index, bankIndex) {
      let data = await IdCard.setBankData(file)
      console.log('bank Info', data)
      this.$set(this.model.salerList[index].bankAccountList[bankIndex], 'bankCardNo', data.cardNo)
      this.$set(this.model.salerList[index].bankAccountList[bankIndex], 'bankName', data.bankName)
      return false
    },

    // 获取身份证信息
    async getIdCardInfo(index, type, obj, keyIndex) {
      let data = await IdCard.setCertificateData()
      console.log('idcard info', data)
      if (obj && typeof (keyIndex) == 'undefined') {
        // object
        this.$set(this.model.salerList[index][`${obj}`], `${type}Name`, data.Name)
        this.$set(this.model.salerList[index][`${obj}`], `${type}Gender`, data.Sex)
        this.$set(this.model.salerList[index][`${obj}`], `${type}Idcard`, data.IDNumber)
        this.$set(this.model.salerList[index][`${obj}`], `${type}IdcardStart`, moment(data.IssuedData).format('YYYY-MM-DD'))
        this.$set(this.model.salerList[index][`${obj}`], `${type}IdcardEnd`, data.ValidDate == "长期" ? "长期" : moment(data.ValidDate).format('YYYY-MM-DD'))
        this.$set(this.model.salerList[index][`${obj}`], `${type}Addr`, data.Address)
      } else if (obj && typeof (keyIndex) == 'number') {
        // array
        this.$set(this.model.salerList[index][`${obj}`][`${keyIndex}`], `${type}Name`, data.Name)
        this.$set(this.model.salerList[index][`${obj}`][`${keyIndex}`], `${type}Gender`, data.Sex)
        this.$set(this.model.salerList[index][`${obj}`][`${keyIndex}`], `${type}Idcard`, data.IDNumber)
        this.$set(this.model.salerList[index][`${obj}`][`${keyIndex}`], `${type}IdcardStart`, moment(data.IssuedData).format('YYYY-MM-DD'))
        this.$set(this.model.salerList[index][`${obj}`][`${keyIndex}`], `${type}IdcardEnd`, data.ValidDate == "长期" ? "长期" : moment(data.ValidDate).format('YYYY-MM-DD'))
        this.$set(this.model.salerList[index][`${obj}`][`${keyIndex}`], `${type}Addr`, data.Address)
      } else {
        // all
        this.$set(this.model.salerList[index], `${type}Name`, data.Name)
        this.$set(this.model.salerList[index], `${type}Gender`, data.Sex)
        this.$set(this.model.salerList[index], `${type}Idcard`, data.IDNumber)
        this.$set(this.model.salerList[index], `${type}IdcardStart`, moment(data.IssuedData).format('YYYY-MM-DD'))
        this.$set(this.model.salerList[index], `${type}IdcardEnd`, data.ValidDate == "长期" ? "长期" : moment(data.ValidDate).format('YYYY-MM-DD'))
        this.$set(this.model.salerList[index], `${type}Addr`, data.Address)
      }
    },

    // 图片验证并设置值
    setImageData(file, index, field, type, keyIndex) {
      if (type && typeof (keyIndex) == 'undefined') {
        this.$set(this.model.salerList[index][type], `${field}`, file)
      } else if (type && typeof (keyIndex) == 'number') {
        this.$set(this.model.salerList[index][type][keyIndex], `${field}`, file)
      } else {
        this.$set(this.model.salerList[index], `${field}`, file)
      }
      this.fileIds.push(file)
    }
  },
}
export default indexMixin