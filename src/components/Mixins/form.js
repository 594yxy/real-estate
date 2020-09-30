import {
  axios
} from '@/utils/request'
import moment from 'moment'

var modalMixin = {
  data() {
    let rules = {
      blur: {
        required: true,
        message: '此项为必填！',
        trigger: 'blur'
      },
      change: {
        required: true,
        message: '请选择对应选项！',
        trigger: 'change'
      },
      phone: [{
        required: true,
        message: '此项为必填！'
      }, {
        validator: this.validator.phone,
        trigger: 'change'
      }],
      bankCardNo: [{
        required: true,
        message: '此项为必填！'
      }, {
        validator: this.validator.bankCardNo,
        trigger: 'change'
      }],
      date: [{
        required: true,
        message: '请输入到期日期！'
      }, {
        validator: this.validator.date,
        trigger: 'change'
      }]
    };

    function getBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = (error) => reject(error)
      })
    };
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
      rules,
      fileIds: [],
      roleMark: localStorage.getItem('mark') || "",
      userId: localStorage.getItem('userId') || "",
      // gender
      genderList: [],
      provinceList: [],
      cityList: [],
      districtList: [],
      ruleForm: {}
    }
  },
  filters: {},
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
      this.beforeOpen(record)
      this.visible = true
      this.model = Object.assign({}, record)
      this.setForm(this.model)
    },

    // 查看详情
    detail(record) {
      this.beforeOpen(record)
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
    // 提交
    handleOk(e) {
      e.preventDefault();
      this.$refs.ruleForm.validate(valid => {
        this.confirmLoading = true
        console.log('valid form', valid)
        if (valid) {
          let dataObj = this.beforeSubmit(this.model)
          console.log('submit!', dataObj)
          axios({
            url: this.model.id ? (this.Urls.editUrl + this.model.id) : this.Urls.addUrl,
            method: 'post',
            data: dataObj
          }).then(res => {
            this.confirmLoading = false
            if (res.code == 0) {
              this.$notification.success({
                message: this.model.id ? this.tips.edit : this.tips.add
              })
              this.close()
              let resData = res.data;
              this.afterSubmit(resData)
              this.$emit('ok', resData)
            } else {
              this.batchDelFile()
              this.$notification.error(res.msg)
            }
          }).catch(() => {
            this.batchDelFile()
            this.confirmLoading = false
          })
        } else {
          this
          console.log('error submit!!', this.model);
          this.confirmLoading = false
          return false;
        }
      });
    },
    beforeSubmit(form) {
      return form
    },
    // 提交完成后
    afterSubmit() {},
    close() {
      this.$emit('close')
      this.$nextTick(() => {
        this.$refs.ruleForm.resetFields();
      })
      this.visible = false;
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
    batchDelFile() {
      console.log('del ids', this.fileIds)
      if (this.fileIds.length == 0) {
        return false
      }
      axios({
        url: '/file/api/file/deletes',
        method: 'post',
        data: {
          ids: this.fileIds
        }
      }).then(res => {
        if (res.code == 0) {

        } else {
          this.$notification.error(res.msg)
        }
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
    OCRBeforeUpload() {
      return false
    }
  }
}
export default modalMixin