import {
  axios
} from '@/utils/request';
const columns = [{
    title: '昵称',
    dataIndex: 'username'
  },
  {
    title: '角色',
    align: 'center',
    dataIndex: 'roleNames'
  },
  {
    title: '机构',
    align: 'center',
    dataIndex: 'orgName'
  },
  {
    title: '加入时间',
    align: 'center',
    dataIndex: 'createTime'
  },
  {
    title: '状态',
    align: 'center',
    dataIndex: 'statusDesc'
  },
  {
    title: '操作',
    dataIndex: 'action',
    align: 'center',
    width: '130px',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
const statusMap = {
  'WAIT': {
    status: 'default',
    text: '未达标'
  },
  'AUDIT': {
    status: 'default',
    text: '待审核'
  },
  'REJECT': {
    status: 'error',
    text: '已拒绝'
  },
  'PASS': {
    status: 'success',
    text: '已通过'
  }
}

var indexMixin = {
  data() {
    return {
      Urls: {
        listUrl: '/auth/api/user/page',
        editUrl: '/auth/api/user/update/',
        delUrl: '/auth/api/user/delete/',
      },
      columns,
      statusMap,
      valueStyle: {
        fontSize: '14px'
      }
    }
  },
  filters: {
    statusFilter(type) {
      if (!type) {
        return ''
      }
      return statusMap[type].text
    },
    statusTypeFilter(type) {
      if (!type) {
        return ''
      }
      return statusMap[type].status
    }
  },
  created() {
    this.getList();
  },

  methods: {
    // 设置角色
    handleAccountType(record) {
      let _this = this
      _this.$confirm({
        title: '设置角色',
        content: `确定设置为${record.accountType=="INSIDE"?"普通分销员":"内部分销员"}？`,
        onOk() {
          axios({
            url: _this.Urls.editUrl + record.id,
            method: 'post',
            data: {
              accountType: record.accountType == "INSIDE" ? "OUTSIDE" : "INSIDE"
            }
          }).then(res => {
            if (res.code == 0) {
              _this.$message.success(`设置成功`)
              _this.getList()
            } else {
              _this.$message.error(`${res.msg}`)
            }
          })
        }
      });
    }
  }
};
export default indexMixin;