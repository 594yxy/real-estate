const columns = [{
  title: '名称',
  dataIndex: 'name'
}, {
  title: '类型',
  dataIndex: 'type',
  align: 'center',
  scopedSlots: {
    customRender: 'type'
  }
}, {
  title: '图标',
  dataIndex: 'icon',
  align: 'center'
}, {
  title: '菜单路径',
  dataIndex: 'url',
  align: 'center'
}, {
  title: '后端路径',
  dataIndex: 'path',
  align: 'center'
}, {
  title: '权限标识',
  dataIndex: 'mark',
  align: 'center',
  scopedSlots: {
    customRender: 'mark'
  }
}, {
  title: '排序',
  align: 'center',
  dataIndex: 'sort',
}];
const typeList = [{
    name: '菜单',
    key: 'MENU',
  },
  {
    name: '按钮',
    key: 'BUTTON',
  },
  {
    name: '访问路径',
    key: 'PATH',
  },
  {
    name: '标签页',
    key: 'TAB',
  },
  {
    name: '页面',
    key: 'PAGE',
  },
  {
    name: '功能',
    key: 'FUNCTION',
  },
  {
    name: '服务',
    key: 'SERVER',
  },
];
const markList = [{
    name: '所有用户',
    key: 'NONE',
  },
  {
    name: '临时用户',
    key: 'TEMP',
  },
  {
    name: '登录用户',
    key: 'LOGIN',
  },
  {
    name: '平台用户',
    key: 'USER',
  },
  {
    name: '内部用户',
    key: 'INSIDE',
  },
  {
    name: '外部用户',
    key: 'OUTSIDE',
  },
  {
    name: '第三方用户',
    key: 'AUTH',
  },
  {
    name: '管理员用户',
    key: 'ADMIN',
  },
];

var indexMixin = {
  data() {
    return {
      Urls: {
        listUrl: '/auth/api/resource/page',
        editUrl: '/auth/api/resource/update/',
        delUrl: '/auth/api/resource/delete/',
        subListUrl: '/auth/api/resource/children/',
      },
      columns,
      typeList,
      markList,
      baseParam: {
        parentId: '0'
      }
    }
  },
  created() {
    this.getList();
  },

  methods: {}
};
export default indexMixin;