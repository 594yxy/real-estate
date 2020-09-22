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
    const buyerList = [{
      title: '买方信息',
      tabKey: 0,
      closable: false,
      bankAccountList: [{}]
    }]
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
      maritalStatusList: [],
      model: {
        buyerList,
      },
      activeKey: buyerList[0].tabKey,
      newTabIndex: 1
    }
  },
  filters: {},
  created() {
    this.getDictData('gender', 'genderList')
    this.getDictData('marital_status', 'maritalStatusList')
    this.model = this.info
    if (this.model.id) {
      this.setForm()
    }
  },
  methods: {
    // 赋值
    setForm(data) {
      console.log('买方信息', this.model.buyerList)
      if (this.model.buyerList && this.model.buyerList.length > 0) {
        this.model.buyerList.map((item, index) => {
          item.title = index == 0 ? "买方信息" : "共同购房人"
          item.closable = index == 0 ? false : true
          item.tabKey = index
          if (item.buyerIdcardValidity && typeof (item.buyerIdcardValidity) == 'string') {
            item.buyerIdcardValidity = item.buyerIdcardValidity.split(",")
          }
          if (item.spouseIdcardValidity && typeof (item.spouseIdcardValidity) == 'string') {
            item.spouseIdcardValidity.split(",")
          }
        })
      }
    },

    // 提交以后
    afterSubmit(data) {
      this.model.id = data.id
      this.model = data
      this.setForm()
    },

    // 有效期格式处理
    beforeSubmit(form) {
      if (form.salerList && form.salerList.length > 0) {
        form.salerList.map((item, index) => {
          if (item.salerIdcardValidity) {
            item.salerIdcardValidity = item.salerIdcardValidity.join()
          }
          if (item.assignor && item.assignor.personIdcardValidity) {
            item.assignor.personIdcardValidity = item.assignor.personIdcardValidity.join()
          }
          if (item.guardianList.length > 0) {
            item.guardianList.map((key, k) => {
              key.personIdcardValidity = key.personIdcardValidity.join()
            })
          }
        })
      }
      if (form.buyerList && form.buyerList.length > 0) {
        form.buyerList.map((item, index) => {
          if (item.buyerIdcardValidity) {
            item.buyerIdcardValidity = item.buyerIdcardValidity.join()
          }
          if (item.spouseIdcardValidity) {
            item.spouseIdcardValidity.join()
          }
        })
      }
      return form
    },

    // 返回至列表
    handleReturn() {
      this.$router.push({
        path: '/business/list'
      })
    },

    // tab 
    onTabEdit(targetKey, action) {
      this[action](targetKey)
    },
    add() {
      const panes = this.model.buyerList;
      const activeKey = `${this.newTabIndex++}`;
      panes.push({
        title: `共同购房人`,
        tabKey: activeKey,
        bankAccountList: [{}]
      });
      this.model.buyerList = panes;
      this.activeKey = activeKey;
    },
    remove(targetKey) {
      let activeKey = this.activeKey;
      let lastIndex;
      const panes = this.model.buyerList
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
      this.model.buyerList = panes;
      this.activeKey = activeKey;
    },

    // 添加银行
    addBank(index) {
      this.model.buyerList[index].bankAccountList.push({})
    },
    removeBank(i, k) {
      if (this.model.buyerList[i].bankAccountList.length === 1) {
        return
      }
      this.model.buyerList[i].bankAccountList.splice(k, 1)
    },
    // 获取银行信息
    async getBankInfo(file) {
      console.log('银行图片', file)
      let base64 = await this.getBase64(file)
      let data = await IdCard.setBankData(base64)
      console.log('bank Info', data)
      return false
    },

    // 获取身份证信息
    async getIdCardInfo(index, type) {
      let data = await IdCard.setCertificateData()
      console.log('idcard info', data)
      this.model.buyerList[index][`${type}Name`] = data.Name
      this.model.buyerList[index][`${type}Gender`] = data.Sex
      this.model.buyerList[index][`${type}Idcard`] = data.IDNumber
      this.model.buyerList[index][`${type}IdcardValidity`] = [moment(data.IssuedData).format('YYYY-MM-DD'), moment(data.ValidDate).format('YYYY-MM-DD')]
      this.model.buyerList[index][`${type}Addr`] = data.Address
      this.$forceUpdate();
    },

    // 图片验证并设置值
    setImageData(file, index, field) {
      this.model.buyerList[index][field] = file
      this.$forceUpdate();
      this.fileIds.push(field)
    },

    // 银行图片并设置值
    setBankImageData(file, i, k, field) {
      this.model.buyerList[i].bankAccountList[k][field] = file
      this.$forceUpdate();
      this.fileIds.push(field)
    }
  },
}
export default indexMixin