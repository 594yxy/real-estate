import {
  axios
} from '@/utils/request';
const columns = [{
  title: '编号',
  fixed: 'left',
  dataIndex: 'id'
}, {
  title: '流程节点',
  dataIndex: 'procNodeDesc'
}, {
  title: '贷款品种',
  align: 'center',
  dataIndex: 'subTypeDesc'
}, {
  title: '业务类型',
  align: 'center',
  dataIndex: 'businessTypeDesc'
}, {
  title: '卖方',
  align: 'center',
  dataIndex: 'salers',
  customRender: (text) => `${text || ""}`
}, {
  title: '买方',
  align: 'center',
  dataIndex: 'buyers',
  customRender: (text) => `${text || ""}`
}, {
  title: '贷款金额',
  align: 'center',
  dataIndex: 'loanSum',
  scopedSlots: {
    customRender: 'loanSum'
  }
}, {
  title: '产权证号',
  dataIndex: 'propertyNo'
}, {
  title: '承办部门',
  align: 'center',
  dataIndex: 'responsibleDept'
}, {
  title: '评估公司',
  dataIndex: 'appraisers'
}, {
  title: '创建时间',
  align: 'center',
  dataIndex: 'createTime'
}]

const procNodes = [{
  key: '',
  value: '新建业务'
}]

var indexMixin = {
  data() {
    return {
      Urls: {
        listUrl: '/biz/api/business/all/page',
        orgListUrl: '/auth/api/org/list'
      },
      columns,
      procNodes,
      valueStyle: {
        fontSize: '14px'
      },
      loanTypeList: [],
      busTypeList: [],
      orgList: []
    }
  },
  filters: {},
  created() {
    this.getList();
    this.getDictData('loan_type', 'loanTypeList')
    this.getDictData('business_type', 'busTypeList')
    this.getOrgList()
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
      if (this.selectedRowKeys.length == 0) {
        this.$message.warning('请选择你要进行操作的数据!');
        return false
      }
      this.$router.push({
        path: '/business/list/add',
        query: {
          id: this.selectedRowKeys.join()
        }
      })
    },
    // 部门列表
    getOrgList() {
      axios({
        url: this.Urls.orgListUrl,
        method: 'get'
      }).then(res => {
        if (res.code == 0) {
          this.orgList = res.data.records || [];
        } else {
          this.$notification.error(res.msg)
        }
      })
    },
  }
};
export default indexMixin;