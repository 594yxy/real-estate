import {
  axios
} from '@/utils/request'
import moment from 'moment'

var modalMixin = {
  data() {
    return {
      labelCol: {
        xs: {
          span: 24
        },
        sm: {
          span: 3
        }
      },
      wrapperCol: {
        xs: {
          span: 24
        },
        sm: {
          span: 21
        }
      },
      Urls: {
        addUrl: '',
        editUrl: '',
        getByIdUrl: '',
        dictTypeUrl: '/biz/api/dict/typeList',
        areaListUrl: '/auth/api/area/children/',
      },
      form: this.$form.createForm(this),
      visible: false,
      confirmLoading: false,
      isDisabled: false,
      model: {},
      textMap: {
        add: '新增',
        edit: '修改',
        detail: '详情'
      },
      dialogStatus: 'add',
      tips: {
        add: '新增成功',
        edit: '修改成功'
      },
      validatorRules: {
        must: {
          rules: [{
            required: true,
            message: '此项为必填！'
          }]
        },
        phone: {
          rules: [{
            required: true,
            message: '请输入您的联系电话'
          }, {
            validator: this.validator.validatePhone
          }]
        },
      },
      fileList: [],
      uploading: false,
      roleMark: localStorage.getItem('mark') || "",
      userId: localStorage.getItem('userId') || "",
      // gender
      genderList: [],
      provinceList: [],
      cityList: [],
      districtList: []
    }
  },
  filters: {
    amountFilter: (val) => {
      if (!val) {
        return 0
      }
      return parseFloat((val / 100).toFixed(2))
    }
  },
  mounted() {},
  methods: {

    // 表单打开之前
    beforeOpen() {},

    // 新增表单
    add() {
      this.edit({})
    },

    // 修改表单
    edit(record) {
      this.visible = true
      this.beforeOpen(record)
      this.form.resetFields()
      this.model = Object.assign({}, record)
      this.setForm(this.model)
    },

    // 查看详情
    detail(record) {
      this.beforeOpen(record)
      this.form.resetFields()
      this.visible = true
      this.fillForm(record.id)
    },

    setForm(data) {
      this.model = data
    },

    // 详情表单
    fillForm(id) {
      this.confirmLoading = true
      axios({
        url: this.Urls.getByIdUrl + id,
        method: 'get'
      }).then(res => {
        this.confirmLoading = false
        if (res.code == 0) {
          this.setForm(res.data)
        } else {
          this.$notification.error(res.msg)
        }
      }).catch(() => {
        this.confirmLoading = false
      })
    },

    // 提交表单
    handleSubmit(e) {
      e.preventDefault();
      this.confirmLoading = true
      this.form.validateFields((errors, values) => {
        if (!errors) {
          let dataObj = this.beforeSubmit(values)
          let formData = Object.assign(this.model, dataObj);
          console.log('form value', formData)
          axios({
            url: this.model.id ? (this.Urls.editUrl + this.model.id) : this.Urls.addUrl,
            method: 'post',
            data: formData
          }).then(res => {
            this.confirmLoading = false
            if (res.code == 0) {
              this.$notification.success({
                message: this.model.id ? this.tips.edit : this.tips.add
              })
              this.close()
              this.afterSubmit()
              this.$emit('ok')
            } else {
              this.$notification.error(res.msg)
            }
          }).catch(() => {
            this.localLoading = false
          })
        } else {
          this.confirmLoading = false
        }
      })
    },
    beforeSubmit(form) {
      return form
    },
    // 提交完成后
    afterSubmit() {},
    close() {
      this.$emit('close')
      this.visible = false;
      this.form.resetFields();
    },
    handleCancel() {
      this.close()
    },
    // 获取字典数据
    getDictData(type, data) {
      axios({
        url: this.Urls.dictTypeUrl,
        method: 'get',
        params: {
          type: type
        }
      }).then(res => {
        if (res.code == 0) {
          this[data] = res.data.records
        } else {
          this.$notification.error(res.msg)
        }
      })
    },

    // 获取图片列表
    getImg(ids) {
      axios({
        url: this.Urls.imgListUrl,
        method: 'get',
        params: {
          ids: ids
        }
      }).then(res => {
        let resData = []
        for (let i = 0; i < res.data.length; i++) {
          resData[i] = {
            uid: res.data[i].id,
            name: res.data[i].name,
            status: res.data[i].status,
            url: res.data[i].url,
            ext: res.data[i].ext,
            title: this.fileTitleList[i]
          }
        }
        this.fileList = resData
      })
    },

    // 提交如果报错 删除所有图片
    batchDelFile(ids) {
      axios({
        url: this.Urls.batchDelFileUrl,
        method: 'post',
        data: {
          ids: ids.join()
        }
      }).then(res => {
        if (res.code == 0) {} else {}
      }).catch(() => {})
    },

    // 不可选择的时间
    disabledDate(current) {
      // Can not select days before today and today
      // return current && current < moment().endOf('day');
      // return current && current < moment().subtract(1, "days");
      return current && current.valueOf() >= new Date();
    },

    // 地区数据
    getArea(id, data) {
      axios({
        url: this.Urls.areaListUrl + id,
        method: 'get'
      }).then(res => {
        if (res.code == 0) {
          this[data] = res.data.records;
        } else {

        }
      })
    },
    handleProvinceChange(val) {
      this.getArea(val, 'cityList')
    },
    handleCityChange(val) {
      this.getArea(val, 'districtList')
    },
    // 格式化树
    mapTreeLeaf(item) {
      const haveChildren = Array.isArray(item.children) && item.children.length > 0
      item.isLeaf = item.isLeaf == 1 ? true : false
      item.children = haveChildren ? item.children.map(i => this.mapTreeLeaf(i)) : []
      return item
    },
    // 获取树级
    getTreeData() {
      axios({
        url: this.Urls.treeListUrl,
        method: 'get',
      }).then((res) => {
        if (res.code == 0) {
          let resData = res.data.records || []
          this.treeData[0].children = resData.map((item) => this.mapTreeLeaf(item))
        } else {
          this.$notification.error(res.msg)
        }
      })
    },
  }
}
export default modalMixin