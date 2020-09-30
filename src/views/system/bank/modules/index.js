import {
  axios
} from '@/utils/request';
const columns = [{
  title: '银行名称',
  dataIndex: 'username'
}, {
  title: '支行名称',
  dataIndex: 'name'
}, {
  title: '银行账户',
  dataIndex: 'roleNames'
}, {
  title: '创建时间',
  align: 'center',
  dataIndex: 'createTime'
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