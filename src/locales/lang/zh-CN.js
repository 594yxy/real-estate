import antd from 'ant-design-vue/es/locale-provider/zh_CN'
import momentCN from 'moment/locale/zh-cn'

const components = {
  antLocale: antd,
  momentName: 'zh-cn',
  momentLocale: momentCN
}

const locale = {
  'message': '-',
  'menu.home': '主页',
  'menu.dashboard': '仪表盘',
  'menu.dashboard.workplace': '工作台',

  'layouts.usermenu.dialog.title': '提示信息',
  'layouts.usermenu.dialog.content': '确定退出当前账号？'
}

export default {
  ...components,
  ...locale
}