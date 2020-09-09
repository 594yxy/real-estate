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
        imgListUrl: '/file/api/file/batchSelect',
        uploadFileUrl: '/file/api/file/upload',
        delFileUrl: '/file/api/file/delete/',
        projectByIdUrl: '/biz/oaProject/get/',
        dictTypeUrl: '/ida/api/dict/typeList',
        editKeyValueUrl: '/api/setting/update/',
        keyValueListUrl: '/api/setting/list'
      },
      form: this.$form.createForm(this),
      visible: false,
      confirmLoading: false,
      isDisabled: false,
      model: {},
      textMap: {
        add: '添加',
        edit: '编辑',
        detail: '详情'
      },
      dialogStatus: 'add',
      tips: {
        add: '添加成功',
        edit: '编辑成功'
      },
      validatorRules: {
        must: {
          rules: [{
            required: true,
            message: '此字段为必填项！'
          }]
        }
      },
      fileList: [],
      uploading: false,
      singleFile: false,
      roleMark: localStorage.getItem('mark') || "",
      userId: localStorage.getItem('userId') || ""
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
    beforeOpen() {
      this.fileList = []
    },

    // 新增表单
    add() {
      this.edit({})
    },

    // 编辑表单
    edit(record) {
      this.beforeOpen(record)
      this.form.resetFields()
      this.model = Object.assign({}, record)
      this.visible = true
      this.setForm(this.model)
    },

    // 查看详情
    detail(record) {
      this.beforeOpen(record)
      this.form.resetFields()
      this.visible = true
      this.fillForm(record)
    },

    setForm(data) {
      this.model = data
    },

    // 详情表单
    fillForm(record) {
      this.confirmLoading = true
      axios({
        url: this.Urls.getByIdUrl + record.id,
        method: 'get'
      }).then(res => {
        this.confirmLoading = false
        if (res.code == 0) {
          this.setForm(res.data)
        } else {
          this.$notification.error({
            message: res.msg
          })
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
          this.beforeSubmit(values)
          let formData = Object.assign(this.model, values);
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
              this.visible = false
              this.afterSubmit()
              this.$emit('ok')
            } else {
              this.$notification.error({
                message: res.msg
              })
            }
          }).catch(() => {
            this.localLoading = false
          })
        } else {
          this.confirmLoading = false
        }
      })
    },
    //提交设置
    handleOk(e) {
      e.preventDefault();
      this.confirmLoading = true
      this.form.validateFields((errors, values) => {
        if (!errors) {
          this.beforeSubmit(values)
          let keys = Object.keys(values);
          let promiseList = keys.map((key) => {
            return this.updateKeyValue(key, values[key])
          })
          Promise.all(promiseList).then((allData) => {
            console.log('all', allData);
            this.confirmLoading = false
            this.$notification.success({
              message: this.tips.edit
            })
            this.afterOk()
          }).catch((err) => {
            this.confirmLoading = false
            this.$notification.error({
              message: err
            })
          })
        } else {
          this.confirmLoading = false
        }
      })
    },
    afterOk() {
      this.visible = false
      this.getKeyValueList()
    },
    // 循环提交
    updateKeyValue(key, value) {
      return new Promise((resolve, reject) => {
        axios({
          url: this.Urls.editKeyValueUrl + key,
          method: 'post',
          data: {
            settingValue: value
          }
        }).then(res => {
          if (res.code == 0) {
            resolve(res.data)
          } else {
            reject(res.msg)
          }
        }).catch(() => {
          reject('服务器发生错误！')
        })
      })
    },
    // 请求设置
    getKeyValueList() {
      this.confirmLoading = true
      axios({
        url: this.Urls.keyValueListUrl,
        method: 'get'
      }).then(res => {
        this.confirmLoading = false
        if (res.code == 0) {
          this.setKeyValue(res.data)
        } else {
          this.$notification.error({
            message: res.msg
          })
        }
      }).catch(() => {
        this.confirmLoading = false
      })
    },
    setKeyValue(data) {
      let list = data.records;
      list.map((item) => {
        this.model.formKeys.map((key) => {
          if (key == item.id) {
            this.model[key] = item.settingValue
          }
        })
      })
      this.setForm()
    },
    // 提交完成后
    afterSubmit() {},
    beforeSubmit(form) {},
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
          this.$notification.error({
            message: res.msg
          })
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
    // 文件上传
    beforeUpload(file) {
      const isXLSX = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      const isDOCX = file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      const isPDF = file.type === 'application/pdf';
      const isJPG = file.type === 'image/jpeg';
      const isPNG = file.type === 'image/png';
      if (!isXLSX && !isDOCX && !isPDF && !isJPG && !isPNG) {
        this.$message.error('上传格式有误')
        return false
      }

      const isLt20M = file.size / 1024 / 1024 < 20
      if (!isLt20M) {
        this.$message.error('文件大小不能超过20M!')
        return false
      }
      if (this.fileList.length > 0 && !this.singleFile) {
        this.$message.error('上传文件数量只限制1个')
        // this.handleFileRemove(this.fileList[0])
        return false
      }
      this.uploadFile(file)
      return false
    },
    uploadFile(file) {
      let formData = new FormData()
      formData.append('file', file);
      this.uploading = true;
      axios({
        url: this.Urls.uploadFileUrl,
        method: 'post',
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        timeout: 0,
        data: formData
      }).then(res => {
        this.uploading = false;
        if (res.code == 0) {
          this.$notification.success({
            message: '上传成功'
          })
          this.fileList.push({
            uid: res.data.id,
            name: res.data.name,
            status: res.data.status,
            url: res.data.url,
            ext: res.data.ext
          })
          this.afterUpload(res.data)
        } else {
          this.$notification.error({
            message: res.msg
          })
        }
      }).finally(() => {
        this.uploading = false;
      })
    },
    afterUpload() {},

    // 预览图片
    handlePreview(file) {
      if (file.ext == 'jpg' || file.ext == 'jpeg' || file.ext == 'png') {
        this.$refs.viewModal.handleView(file.url)
      } else if (file.ext == 'docx' || file.ext == 'pdf' || file.ext == 'xlsx') {
        this.$refs.viewModal.handleFile(file.url)
      }

    },
    // 删除图片
    handleFileRemove(file) {
      axios({
        url: this.Urls.delFileUrl + file.uid,
        method: 'get'
      }).then(res => {
        if (res.code == 0) {
          this.$notification.success({
            message: '删除成功'
          })
          const index = this.fileList.indexOf(file);
          const newFileList = this.fileList.slice();
          newFileList.splice(index, 1);
          this.fileList = newFileList;
        } else {
          this.$notification.error({
            message: res.msg
          })
        }
      })
    },
    // 不可选择的时间
    disabledDate(current) {
      // Can not select days before today and today
      // return current && current < moment().endOf('day');
      // return current && current < moment().subtract(1, "days");
      return current && current.valueOf() >= new Date();
    },
  }
}
export default modalMixin