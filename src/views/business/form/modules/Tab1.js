import {
  axios
} from '@/utils/request'
import moment from 'moment'
import IdCard from '@/components/IdCard/index'

var indexMixin = {
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
      tips: {
        add: '买方信息保存成功',
        edit: '买方信息编辑成功'
      },
      maritalStatusList: [],
      fileIds: [],
      model: {
        buyerList,
      },
      activeKey: buyerList[0].tabKey,
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
    this.getDictData('marital_status', 'maritalStatusList')
    console.log('current tab', this.activeKey)
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
      this.model.buyerList = data.buyerList
      this.model.buyerList.map((item, index) => {
        item.title = "买方信息"
        item.tabKey = index
      })
    },

    // 返回至列表
    handleReturn() {
      this.$router.push({
        path: '/business/list'
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
    // remove Tab
    remove(targetKey) {
      let activeKey = this.activeKey;
      let lastIndex;
      this.model.buyerList.forEach((pane, i) => {
        if (pane.tabKey === targetKey) {
          lastIndex = i - 1;
        }
      });
      const panes = this.model.buyerList.filter(pane => pane.tabKey !== targetKey);
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

    maritalStatusChange(value) {},

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
      this.model.buyerList[index].bankAccountList[k][field] = file
      this.$forceUpdate();
      this.fileIds.push(field)
    }
  },
}
export default indexMixin