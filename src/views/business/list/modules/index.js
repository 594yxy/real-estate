import {
  axios
} from '@/utils/request';
const columns = [{
  title: '编号',
  dataIndex: 'id'
}, {
  title: '流程节点',
  dataIndex: 'procStatusDesc'
}, {
  title: '业务类型',
  align: 'center',
  dataIndex: 'businessTypeDesc'
}, {
  title: '卖方',
  align: 'center',
  dataIndex: 'salers'
}, {
  title: '买方',
  align: 'center',
  dataIndex: 'buyers'
}, {
  title: '贷款金额',
  align: 'center',
  dataIndex: 'statusDesc',
  customRender: (text, record, index) => ""
}, {
  title: '产权证号',
  dataIndex: 'propertyNo'
}, {
  title: '评估公司',
  dataIndex: 'appraisers'
}, {
  title: '创建时间',
  align: 'center',
  dataIndex: 'createTime'
}]

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
        listUrl: '/api/business/all/page'
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
    },
    handleEdit() {
      console.log(this.selectionRows)
      this.$router.push({
        path: '/business/list/add',
        query: {
          id: this.selectedRowKeys.join()
        }
      })
    }
  }
};
export default indexMixin;