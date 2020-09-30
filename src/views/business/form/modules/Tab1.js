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
      maritalStatusList: [],
      activeKey: buyerList[0].tabKey,
      newTabIndex: 1,
      tips: {
        add: '买方信息保存成功',
        edit: '买方信息保存成功'
      },
    }
  },
  filters: {},
  created() {
    this.getArea('100000', 'provinceList')
    this.getDictData('gender', 'genderList')
    this.getDictData('marital_status', 'maritalStatusList')
    this.model = this.info
    if (this.model.id) {
      this.setForm()
    }
  },
  methods: {
    // 赋值
    setForm() {
      console.log('买方信息', this.model.buyerList)
      if (this.model.buyerList && this.model.buyerList.length > 0) {
        this.model.buyerList.map((item, index) => {
          item.title = index == 0 ? "买方信息" : "共同购房人"
          item.closable = index == 0 ? false : true
          item.tabKey = index
          if (item.buyerAddrCityId) {
            this.getArea(item.buyerAddrProvId, 'cityList')
          }
          if (item.buyerAddrDistcId) {
            this.getArea(item.buyerAddrCityId, 'districtList')
          }
          if (item.spouseAddrCityId) {
            this.getArea(item.spouseAddrProvId, 'cityList')
          }
          if (item.spouseAddrDistcId) {
            this.getArea(item.spouseAddrCityId, 'districtList')
          }
        })
      }
    },

    // 提交以后
    afterSubmit(data) {
      this.$nextTick(() => {
        this.model = data
        this.setForm()
      })
    },

    // 返回至列表
    handleReturn() {
      this.$router.push({
        path: '/business/list'
      })
    },

    // 日期格式
    dateChange(date, dateString, index, type) {
      this.model.buyerList[index][`${type}IdcardStart`] = dateString
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
    async getBankInfo(file, index, bankIndex) {
      let data = await IdCard.setBankData(file)
      console.log('bank Info', data)
      this.$set(this.model.buyerList[index].bankAccountList[bankIndex], 'bankCardNo', data.cardNo)
      this.$set(this.model.buyerList[index].bankAccountList[bankIndex], 'bankName', data.bankName)
      return false
    },

    // 获取身份证信息
    async getIdCardInfo(index, type) {
      let data = await IdCard.setCertificateData()
      console.log('idcard info', data)
      this.$set(this.model.buyerList[index], `${type}Name`, data.Name)
      this.$set(this.model.buyerList[index], `${type}Gender`, data.Sex)
      this.$set(this.model.buyerList[index], `${type}Idcard`, data.IDNumber)
      this.$set(this.model.buyerList[index], `${type}IdcardStart`, moment(data.IssuedData).format('YYYY-MM-DD'))
      this.$set(this.model.buyerList[index], `${type}IdcardEnd`, data.ValidDate == "长期" ? "长期" : moment(data.ValidDate).format('YYYY-MM-DD'))
      this.$set(this.model.buyerList[index], `${type}Addr`, data.Address)
    },

    // 图片验证并设置值
    setImageData(file, index, field) {
      console.log('file id', file)
      this.$set(this.model.buyerList[index], `${field}`, file)
      this.fileIds.push(file)
    },

    // 银行图片并设置值
    setBankImageData(file, i, k, field) {
      console.log('file id', file)
      this.$set(this.model.buyerList[i].bankAccountList[k], `${field}`, file)
      this.fileIds.push(file)
    }
  },
}
export default indexMixin