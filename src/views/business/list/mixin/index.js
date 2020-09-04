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
    // 新建业务
    handleAdd() {
      this.$router.push({
        path: '/business/list/add',
        query: {}
      })
    }
  }
};
export default indexMixin;