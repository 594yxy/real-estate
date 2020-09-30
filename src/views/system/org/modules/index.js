import {
  axios
} from '@/utils/request';
const columns = [{
  title: '部门名称',
  dataIndex: 'name'
}, {
  title: '所属地区',
  align: 'center',
  dataIndex: 'areaName'
}, {
  title: '部门描述',
  dataIndex: 'remark'
}, {
  title: '创建时间',
  align: 'center',
  dataIndex: 'createTime'
}]

const orgStatusList = [{
  key: 'ENABLED',
  name: '启用'
}, {
  key: 'DISABLE',
  name: '禁用'
}]

var indexMixin = {
  data() {
    return {
      Urls: {
        listUrl: '/auth/api/org/page',
        editUrl: '/auth/api/org/update/',
        delUrl: '/auth/api/org/delete/',
        subListUrl: '/auth/api/org/children/',
      },
      columns,
      orgStatusList,
      baseParam: {
        parentId: '0'
      }
    }
  },
  filters: {},
  created() {
    this.getList();
  },

  methods: {}
};
export default indexMixin;