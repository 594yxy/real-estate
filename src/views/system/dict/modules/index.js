import {
  axios
} from '@/utils/request';
const columns = [{
  title: '字典名称',
  dataIndex: 'name',
  key: 'name'
}, {
  title: '键值',
  dataIndex: 'key',
  key: 'key',
  align: 'center'
}, {
  title: '键名',
  dataIndex: 'value',
  key: 'value',
  align: 'center'
}, {
  title: '类型',
  dataIndex: 'type',
  key: 'type',
  align: 'center'
}, {
  title: '排序',
  dataIndex: 'sort',
  key: 'sort',
  align: 'center'
}, {
  title: '操作',
  dataIndex: 'action',
  align: 'center',
  fixed: 'right',
  width: '140px',
  scopedSlots: {
    customRender: 'action'
  }
}]

var indexMixin = {
  data() {
    return {
      Urls: {
        listUrl: '/biz/api/dict/page',
        editUrl: '/biz/api/dict/update/',
        delUrl: '/biz/api/dict/delete/',
        subListUrl: '/biz/api/dict/children/',
      },
      columns,
      valueStyle: {
        fontSize: '14px'
      },
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