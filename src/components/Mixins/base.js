import {
  axios
} from '@/utils/request'
var baseMixin = {
  data() {
    return {
      // 高级搜索 展开/关闭
      advanced: false,
      // 搜索参数
      baseParam: {},
      queryParam: {
        condition: {},
        orderBy: [{
          desc: true,
          orderBy: 'createTime'
        }]
      },
      // 分页参数
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        showTotal: total => `共 ${total} 条`,
        size: 'small',
        onChange: (page, pageSize) => this.onChangePage(page, pageSize),
        showSizeChanger: true,
        onShowSizeChange: (page, pageSize) => this.onShowSizeChange(page, pageSize)
      },
      columns: [],
      dataSource: [],
      localLoading: false,
      expandedRowKeys: [],
      tableShow: true,
      selectedRowKeys: [],
      selectedRows: [],
      Urls: {
        listUrl: '',
        delUrl: '',
        dictTypeUrl: '/biz/api/dict/typeList',
        dictChildrenUrl: '/biz/api/dict/typeList',
        batchDelUrl: '',
        downloadExcelUrl: '',
        exportTempUrl: '',
        importExcelUrl: '',
        areaListUrl: '/auth/api/area/children/',
        fileIdsUrl: '',
        batchFileIdsUrl: '',
        downloadFilelUrl: '/file/api/file/batchDownload',
      },
      roleMark: localStorage.getItem('mark') || "",
      userId: localStorage.getItem('userId') || "",
      fileExt: '.xlsx',
      uploading: false,
      isShowDate: true,
      // 地区
      proviceList: [],
      cityList: [],
      districtList: [],
      menuVisible: false,
      menuStyle: {
        position: "fixed",
        top: "0",
        left: "0",
        border: "1px solid #eee",
        zIndex: 1
      }
    }
  },
  computed: {
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange,
        type: 'radio'
      }
    }
  },
  watch: {
    'pagination.current'(val) {
      this.selectedRowKeys = []
      this.selectedRows = []
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
  created() {},
  mounted() {},
  methods: {
    // 加载列表数据-分页
    getList(arg) {
      if (arg === 1) {
        this.pagination.current = 1;
      };
      this.queryParam.pageIndex = this.pagination.current
      this.queryParam.pageSize = this.pagination.pageSize
      this.queryParam.condition = Object.assign({}, this.baseParam, this.queryParam.condition)
      this.localLoading = true;
      axios({
        url: this.Urls.listUrl,
        method: 'post',
        data: this.queryParam
      }).then(res => {
        this.localLoading = false
        if (res.code == 0) {
          this.pagination.total = res.data.total;
          if (res.data.list) {
            // 递归
            let listMap = (list) => {
              let data = [];
              data = list.map(item => {
                // 判断是否为子节点
                if (item.isLeaf == 0) {
                  // 子节点有数据
                  if (item.children && item.children.length > 0) {
                    listMap(item.children);
                  } else {
                    let loadChild = {
                      id: `${item.id}_loadChild`,
                      name: 'loading...',
                      isLoading: true
                    }
                    item.children = [loadChild];
                  }
                } else {
                  item.children = null;
                }
                return item
              })
              return [...data]
            }
            // 赋值
            this.dataSource = listMap(res.data.list);
            if (res.data.list.length === 0 && this.pagination.current > 1) {
              this.pagination.current--
              this.getList()
              return
            }
            this.refreshTable()
          } else {
            this.dataSource = [];
          }
        } else {
          this.$notification.error(res.msg);
        }
      }).finally(() => {
        this.localLoading = false;
      })
    },
    refreshTable() {
      this.tableShow = false
      this.$nextTick(() => {
        this.tableShow = true
      })
    },
    // 根据已展开的行查询数据（用于保存后刷新时异步加载子级的数据）
    loadDataByExpandedRows(dataList) {
      let id = this.expandedRowKeys[0]
      if (this.expandedRowKeys.length > 0) {
        axios({
          url: this.Urls.subListUrl + id,
          method: 'get'
        }).then(res => {
          if (res.code == 0) {
            let childrenMap = res.data.records
            let fn = (list) => {
              list.forEach(data => {
                if (this.expandedRowKeys.includes(data.id)) {
                  data.children = childrenMap
                  fn(data.children)
                }
              })
            }
            fn(dataList)
          } else {
            this.$notification.error(res.msg)
          }
        })
      }
    },
    // 点击展开树图标
    handleExpand(expanded, record) {
      // this.expandedRowKeys[0] = record.id
      // 判断是否是展开状态
      if (expanded) {
        // 判断子级的首个项的标记是否是“正在加载中”，如果是就加载数据
        if (record.children[0].isLoading === true) {
          const id = record.id
          const data = this.dataSource
          axios({
            url: this.Urls.subListUrl + record.id,
            method: 'get'
          }).then(res => {
            if (res.code == 0) {
              const children = res.data.records || []
              const dataMap = (items) => {
                items.find((item) => {
                  if (item.id === id) {
                    item.children = children
                    for (let i = 0; i < item.children.length; i++) {
                      if (item.children[i].isLeaf == 0) {
                        let loadChild = {
                          id: `${item.children[i].id}_loadChild`,
                          name: 'loading...',
                          isLoading: true
                        }
                        item.children[i].children = [loadChild]
                      }
                    }
                    return items
                  }
                  if (item.children && item.children.length > 0) {
                    dataMap(item.children)
                  }
                })
              }
              dataMap(data || [])
            } else {
              this.$notification.error(res.msg)
            }
          })
        }
      }
    },
    // 搜索查询
    handleSearch() {
      console.log('search param...', this.queryParam.condition)
      this.queryParam.condition.parentId = null;
      this.getList(1);
      this.afterSearch();
    },
    // 搜索重置
    searchReset() {
      this.isShowDate = false;
      this.$nextTick(() => {
        this.isShowDate = true;
      });
      this.queryParam.condition = {};
      this.getList(1);
      this.afterSearch();
    },
    afterSearch() {},
    // 加载列表数据-无分页
    getData() {
      this.localLoading = true
      axios({
        url: this.Urls.listUrl,
        method: 'get'
      }).then(res => {
        this.localLoading = false
        if (res.code == 0) {
          this.dataSource = res.data.records || [];
        } else {
          this.$notification.error(res.msg)
        }
      })
    },
    // 改变页码
    onChangePage(page, pageSize) {
      this.pagination.current = page;
      this.pagination.pageSize = pageSize;
      this.getList();
    },
    // 改变分页条数
    onShowSizeChange(page, pageSize) {
      this.pagination.current = page;
      this.pagination.pageSize = pageSize;
      this.getList();
    },
    // 表格字段排序
    handleTableChange(pagination, filters, sorter) {
      if (Object.keys(sorter).length > 0) {
        this.queryParam.orderBy[0].desc = (sorter.order == 'ascend') ? false : true
        this.queryParam.orderBy[0].orderBy = sorter.field
      };
      this.pagination = pagination;
      this.getList();
    },
    // 搜索栏展开
    toggleAdvanced() {
      this.advanced = !this.advanced
    },

    // table勾选时
    onSelectChange(selectedRowKeys, selectionRows) {
      console.log(selectedRowKeys, selectionRows)
      this.selectedRowKeys = selectedRowKeys
      this.selectionRows = selectionRows
    },
    // 全选
    allSelect() {
      this.selectedRowKeys = this.dataSource.map(item => {
        return item.id
      })
    },
    // 反选
    reverseSelect() {
      let newArr = this.dataSource.filter(item => !this.selectedRowKeys.some(ele => ele === item.id))
      this.selectedRowKeys = newArr.map(item => item.id)
    },

    // 获取一级字典数据
    getDictData(type, data) {
      axios({
        url: this.Urls.dictTypeUrl,
        method: 'get',
        params: {
          type: type
        }
      }).then(res => {
        if (res.code == 0) {
          this[data] = res.data.records;
        } else {
          this.$notification.error(res.msg)
        }
      })
    },
    // 获取子级字典数据
    getDictChildrenData(type, key, data) {
      axios({
        url: this.Urls.dictChildrenUrl,
        method: 'get',
        params: {
          type: type,
          key: key
        }
      }).then(res => {
        if (res.code == 0) {
          this[data] = res.data.records
        } else {
          this.$notification.error(res.msg)
        }
      })
    },

    // 打开表单
    handleAdd() {
      this.$refs.modalForm.dialogStatus = 'add'
      this.$refs.modalForm.isDisabled = false
      this.$refs.modalForm.add()
    },
    // 添加子级
    handleAddSub() {
      if (this.selectedRowKeys.length == 0) {
        this.$message.warning('请选择你要进行操作的数据!');
        return false
      }
      this.$refs.modalForm.dialogStatus = 'add'
      this.$refs.modalForm.isDisabled = true
      this.$refs.modalForm.edit({
        'parentId': this.selectionRows[0].id
      });
    },
    // 表单提交之后的动作
    afterSubmit() {
      this.getList(1)
    },
    // 编辑表单
    handleEdit() {
      console.log('此条数据', this.selectionRows)
      if (this.selectedRowKeys.length == 0) {
        this.$message.warning('请选择你要进行操作的数据!');
        return false
      }
      this.$refs.modalForm.dialogStatus = 'edit'
      this.$refs.modalForm.isDisabled = false
      this.$refs.modalForm.edit(this.selectionRows[0])
    },
    // 删除数据
    handleDel() {
      var _this = this
      if (_this.selectedRowKeys.length == 0) {
        _this.$message.warning('请选择你要进行操作的数据!');
        return false
      }
      let id = _this.selectionRows[0].id
      _this.$confirm({
        title: '确定要删除该条数据？',
        content: '删除不可恢复',
        okType: 'danger',
        onOk() {
          axios({
            url: _this.Urls.delUrl + id,
            method: 'get'
          }).then(res => {
            if (res.code == 0) {
              _this.$notification.success({
                message: '删除成功'
              })
              _this.afterSubmit()
            } else {
              _this.$notification.error(res.msg)
            }
          })
        }
      })
    },
    // 批量删除
    handleBatchDel() {
      var _this = this
      _this.$confirm({
        title: '确定要删除您选择的数据？',
        content: '删除不可恢复',
        okType: 'danger',
        onOk() {
          axios({
            url: _this.Urls.batchDelUrl,
            method: 'post',
            data: {
              ids: _this.selectedRowKeys
            }
          }).then(res => {
            if (res.code == 0) {
              _this.$notification.success({
                message: '删除成功'
              })
              _this.afterSubmit()
            } else {
              _this.$notification.error(res.msg)
            }
          })
        },
        class: 'test'
      })
    },
    // 表单详情
    handleDetail() {
      if (this.selectedRowKeys.length == 0) {
        this.$message.warning('请选择你要进行操作的数据!');
        return false
      }
      this.$refs.detailForm.detail(this.selectionRows[0])
    },

    // 验证Excel表格式
    beforeUpload(file, fileList) {

      // image/jpeg
      // image/png
      // application/vnd.openxmlformats-officedocument.wordprocessingml.document
      // application/pdf
      // application/vnd.openxmlformats-officedocument.spreadsheetml.sheet

      const isXLSX = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      if (!isXLSX) {
        this.$message.error('导入文件格式有误,只支持.xlsx格式')
        return false
      }

      this.handleImport(file)
      return false
    },
    // 导入Excel表数据
    handleImport(file) {
      var formData = new FormData()
      formData.append('file', file)
      this.uploading = true;
      axios({
        url: this.Urls.importExcelUrl,
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
            message: '导入成功'
          })
          this.getList(1)
        } else {
          this.$notification.error(res.msg)
        }
      }).finally(() => {
        this.uploading = false;
      })
    },
    // 下载模板
    handleExport() {
      window.open(process.env.VUE_APP_API_BASE_URL + this.Urls.exportTempUrl)
    },
    // 更多操作
    handleMenuClick(e) {
      if (this.selectedRowKeys.length == 0) {
        this.$notification.warning({
          message: '请选择你要进行操作的数据!'
        })
        return
      }
      switch (e.key) {
        case 'download':
          this.handleDownload()
          break;
        case 'del':
          this.handleBatchDel('DISABLE')
      }
      this.selfMenuClick(e)
    },
    selfMenuClick(e) {},
    // 批量导出Excel
    handleDownload() {
      axios({
        url: this.Urls.downloadExcelUrl,
        method: 'post',
        data: {
          ids: this.selectedRowKeys
        },
        responseType: 'blob'
      }).then(res => {
        if (!res) {
          return
        }
        const blob = new Blob([res])
        let fileName = this.$route.meta.title + this.fileExt
        if ('download' in document.createElement('a')) {
          // 非IE下载
          const elink = document.createElement('a')
          elink.download = fileName
          elink.style.display = 'none'
          elink.href = URL.createObjectURL(blob)
          document.body.appendChild(elink)
          elink.click()
          URL.revokeObjectURL(elink.href) // 释放URL 对象
          document.body.removeChild(elink)
        } else {
          // IE10+下载
          navigator.msSaveBlob(blob, fileName)
        }
      })
    },

    // 文件下载
    handleFileDownload(record) {
      axios({
        url: this.Urls.fileIdsUrl + record.id,
        method: 'get'
      }).then(res => {
        if (res.code == 0) {
          let id = res.data
          this.downloadFilel(id)
        }
      })
    },
    downloadFilel(ids) {
      window.open(process.env.VUE_APP_API_BASE_URL + this.Urls.downloadFilelUrl + '?ids=' + ids)
    },
    // 批量文件下载
    handleFileBatchDownload() {
      axios({
        url: this.Urls.batchFileIdsUrl,
        method: 'post',
        data: this.selectedRowKeys,
      }).then(res => {
        if (res.code == 0) {
          let ids = res.data.join()
          this.downloadFilel(ids)
        }
      })
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

    // 查询条件 时间
    handleStartTime(date) {
      this.queryParam.condition.startTime = date
    },
    handleEndTime(date) {
      this.queryParam.condition.endTime = date
    },

    // 表格点击行事件
    rowClick(record, index) {
      return {
        on: {
          click: (e) => {
            e.preventDefault();
            let keys = [],
              rows = [];
            keys.push(record.id)
            rows.push(record)
            this.selectedRowKeys = keys
            this.selectionRows = rows
          },
          contextmenu: (e) => {
            e.preventDefault();
            let keys = []
            keys.push(record.id)
            this.selectedRowKeys = keys
            this.menuVisible = true;
            this.menuStyle.top = e.clientY + "px";
            this.menuStyle.left = e.clientX + "px";
            document.addEventListener("click", this.cancelClick);
          }
        }
      }
    },
    cancelClick() {
      this.menuVisible = false
      document.addEventListener("click", this.cancelClick);
    },
    // 刷新
    refresh() {
      this.getList(1)
    },
    // 列设置
    toolbarChange(newColumns) {
      this.columns = newColumns.filter((item) => {
        return item.isShow == true
      })
    },
    // 列表过滤表头标题
    filterName(array, text) {
      if (!text) {
        return "无"
      } else {
        let obj = array.find((item, index) => {
          if (item.key == text) {
            return item.name
          }
        })
        return obj.name
      }
    },
    mapTreeLeaf(item) {
      const haveChildren = Array.isArray(item.children) && item.children.length > 0
      item.isLeaf = item.isLeaf == 1 ? true : false
      item.children = haveChildren ? item.children.map(i => this.mapTreeLeaf(i)) : []
      return item
    },
  }
}
export default baseMixin