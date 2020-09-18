import {
  axios
} from '@/utils/request'
import moment from 'moment'
import IdCard from '@/components/IdCard/index'

var indexMixin = {
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
        addUrl: '/api/business/temp',
        editUrl: '/api/business/update/',
        getByIdUrl: '/api/business/all/get/'
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
      fileIds: [],
      tips: {
        add: '卖方信息保存成功',
        edit: '卖方信息编辑成功'
      },
      model: {
        salerList,
      },
      activeKey: salerList[0].tabKey,
      newTabIndex: 1,
      rules: {
        must: {
          required: true,
          message: '此字段为必填！',
          trigger: 'blur'
        },
        phone: [{
          required: true,
          message: '此字段为必填！',
          trigger: 'blur'
        }, {
          validator: this.validator.validatePhone,
          trigger: 'change'
        }],
      }
    }
  },
  filters: {},
  created() {
    this.getDictData('gender', 'genderList')
    this.model.id = this.$route.query.id
    if (this.model.id) {
      this.fillForm(this.model.id)
    }
  },
  methods: {
    // 提交
    handleSubmit(e) {
      e.preventDefault();
      this.$refs.ruleForm.validate(valid => {
        this.confirmLoading = true
        // if (valid) {
        console.log('submit!', this.model)
        axios({
          url: this.model.id ? (this.Urls.editUrl + this.model.id) : this.Urls.addUrl,
          method: 'post',
          data: this.model
        }).then(res => {
          this.confirmLoading = false
          if (res.code == 0) {
            this.$notification.success({
              message: this.model.id ? this.tips.edit : this.tips.add
            })
            this.visible = false
            this.afterSubmit()
            this.$emit('ok')
          } else {
            this.$notification.error({
              message: res.msg
            })
          }
        }).catch(() => {
          this.confirmLoading = false
        })
        /* } else {
          this.confirmLoading = false
          return false;
        } */
      });
    },

    // 赋值
    setForm(data) {
      console.log('form', data)
      this.model.salerList = data.salerList
      this.model.salerList.map((item, index) => {
        item.title = "卖方信息"
        item.tabKey = index
      })
    },

    // tab change
    tabChange(key) {
      // this.setFormValue(key)
    },

    onTabEdit(targetKey, action) {
      this[action](targetKey)
    },
    // add Tab
    add() {
      const panes = this.model.salerList;
      const activeKey = `${this.newTabIndex++}`;
      panes.push({
        title: `共同人`,
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
      this.model.salerList.forEach((pane, i) => {
        if (pane.tabKey === targetKey) {
          lastIndex = i - 1;
        }
      });
      const panes = this.model.salerList.filter(pane => pane.tabKey !== targetKey);
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

    // 第三方垫付
    addThirdPay() {
      this.$refs.modalForm.add()
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

    // 获取身份证信息
    async getIdCardInfo(index, type, obj, keyIndex) {
      let data = await IdCard.setCertificateData()
      console.log('idcard info', data)
      if (obj && typeof (keyIndex) == 'undefined') {
        // object
        this.model.salerList[index][`${obj}`][`${type}Name`] = data.Name
        this.model.salerList[index][`${obj}`][`${type}Gender`] = data.Sex
        this.model.salerList[index][`${obj}`][`${type}Idcard`] = data.IDNumber
        this.model.salerList[index][`${obj}`][`${type}IdcardValidity`] = [
          moment(data.IssuedData).format('YYYY-MM-DD'),
          moment(data.ValidDate).format('YYYY-MM-DD'),
        ]
        this.model.salerList[index][`${obj}`][`${type}Addr`] = data.Address
      } else if (obj && typeof (keyIndex) == 'number') {
        // array
        this.model.salerList[index][`${obj}`][`${keyIndex}`][`${type}Name`] = data.Name
        this.model.salerList[index][`${obj}`][`${keyIndex}`][`${type}Gender`] = data.Sex
        this.model.salerList[index][`${obj}`][`${keyIndex}`][`${type}Idcard`] = data.IDNumber
        this.model.salerList[index][`${obj}`][`${keyIndex}`][`${type}IdcardValidity`] = [
          moment(data.IssuedData).format('YYYY-MM-DD'),
          moment(data.ValidDate).format('YYYY-MM-DD'),
        ]
        this.model.salerList[index][`${obj}`][`${keyIndex}`][`${type}Addr`] = data.Address
      } else {
        // all
        this.model.salerList[index][`${type}Name`] = data.Name
        this.model.salerList[index][`${type}Gender`] = data.Sex
        this.model.salerList[index][`${type}Idcard`] = data.IDNumber
        this.model.salerList[index][`${type}IdcardValidity`] = [
          moment(data.IssuedData).format('YYYY-MM-DD'),
          moment(data.ValidDate).format('YYYY-MM-DD'),
        ]
        this.model.salerList[index][`${type}Addr`] = data.Address
      }
      this.$forceUpdate();
    },

    // 图片验证并设置值
    setImageData(file, index, field, type, keyIndex) {
      let model = {}
      if (type) {
        this.model.salerList[`${index}`][`${type}`][`${field}`] = file
      } else if (keyIndex) {
        this.model.salerList[`${index}`][`${type}`][`${keyIndex}`][`${field}`] = file
      } else {
        this.model.salerList[`${index}`][`${field}`] = file
      }
      this.$forceUpdate();
      this.fileIds.push(field)
    }
  },
}
export default indexMixin