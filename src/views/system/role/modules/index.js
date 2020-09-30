import {
  axios
} from '@/utils/request';
const columns = [{
  title: '角色名称',
  dataIndex: 'name',
}, {
  title: '角色标识',
  align: 'center',
  dataIndex: 'mark',

}, {
  title: '数据权限',
  align: 'center',
  dataIndex: 'dataRole',
  scopedSlots: {
    customRender: 'dataRole'
  }
}, {
  title: '状态',
  align: 'center',
  dataIndex: 'roleStatus',
  scopedSlots: {
    customRender: 'status'
  }
}, {
  title: '角色描述',
  dataIndex: 'remark',
}]
const roleStatusList = [{
  key: 'ENABLED',
  name: '启用'
}, {
  key: 'DISABLE',
  name: '禁用'
}];
const dataRoleList = [{
    key: 'NONE',
    name: '无',
  },
  {
    key: 'CREATE',
    name: '创建者',
  },
  {
    key: 'ORG',
    name: '平级(机构)',
  },
  {
    key: 'ORG_S',
    name: '平级及子集(机构)',
  },
  {
    key: 'AREA',
    name: '平级(区域)',
  },
  {
    key: 'AREA_S',
    name: '平级和子集(区域)',
  },
  {
    key: 'ALL',
    name: '所有',
  },
]

var indexMixin = {
  data() {
    return {
      Urls: {
        listUrl: '/auth/api/role/page',
        editUrl: '/auth/api/role/update/',
        delUrl: '/auth/api/role/delete/',
      },
      columns,
      roleStatusList,
      dataRoleList
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
    // 设置权限
    handleSetMenu() {
      this.$refs.menuModal.detail(this.selectionRows[0])
    },
  }
};
export default indexMixin;