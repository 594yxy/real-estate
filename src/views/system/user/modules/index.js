import {
  axios
} from '@/utils/request';
const columns = [{
  title: '用户账号',
  dataIndex: 'username'
}, {
  title: '真实姓名',
  dataIndex: 'name'
}, {
  title: '角色',
  align: 'center',
  dataIndex: 'roleNames'
}, {
  title: '所属部门',
  align: 'center',
  dataIndex: 'orgName'
}, {
  title: '创建时间',
  align: 'center',
  dataIndex: 'createTime'
}, {
  title: '状态',
  align: 'center',
  dataIndex: 'statusDesc'
}];
const userStatusList = [{
  key: 'ENABLED',
  name: '启用'
}, {
  key: 'DISABLE',
  name: '禁用'
}];

var indexMixin = {
  data() {
    return {
      Urls: {
        listUrl: '/auth/api/user/page',
        editUrl: '/auth/api/user/update/',
        delUrl: '/auth/api/user/delete/',
      },
      columns,
      userStatusList
    }
  },
  created() {
    this.getList();
  },

  methods: {}
};
export default indexMixin;