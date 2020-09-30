<template>
  <a-modal
    :title="textMap[dialogStatus]"
    :width="760"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <a-form :form="form">
      <a-form-item :labelCol="labelRowCol" :wrapperCol="wrapperRowCol" label="类型">
        <a-radio-group v-decorator="['type', { initialValue: 'MENU' }]">
          <a-radio v-for="item in typeList" :value="item.key" :key="item.key">{{ item.name }}</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item :labelCol="labelRowCol" :wrapperCol="wrapperRowCol" label="名称">
        <a-input placeholder="请输入名称" v-decorator="['name', validatorRules.name]" />
      </a-form-item>
      <a-form-item :labelCol="labelRowCol" :wrapperCol="wrapperRowCol" label="上级菜单">
        <a-tree-select
          allowClear
          :replaceFields="{ title: 'name', value: 'id', key: 'id' }"
          :treeData="treeData"
          placeholder="请选择父级菜单"
          treeDefaultExpandAll
          v-decorator="['parentId', { rules: [{ required: true, message: '请选择父级菜单!' }] }]"
          :disabled="isDisabled"
        ></a-tree-select>
      </a-form-item>
      <a-row :gutter="15" v-if="form.getFieldValue('type') == 'MENU'">
        <a-col :md="12" :sm="24">
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="菜单路径">
            <a-input placeholder="请输入菜单路径" v-decorator="['url']" />
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="菜单图标">
            <a-input placeholder="点击右侧按钮选择图标" read-only v-model="model.icon">
              <a-icon slot="addonAfter" type="select" @click="selectIcons" />
            </a-input>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="15">
        <a-col :md="12" :sm="24">
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="后端路径">
            <a-input placeholder="请输入后端路径" v-decorator="['path', { initialValue: '/**' }]" />
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="排序">
            <a-input-number placeholder="请输入菜单排序" v-decorator="['sort']" :min="0" style="width: 100%" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-form-item :labelCol="labelRowCol" :wrapperCol="wrapperRowCol" label="权限标识">
        <a-select
          mode="multiple"
          showSearch
          optionFilterProp="children"
          v-decorator="['mark', { rules: [{ required: true, message: '请选择权限标识!' }] }]"
          placeholder="请选择，此处可为多选"
        >
          <a-select-option v-for="item in markList" :value="item.key" :key="item.key">{{ item.name }}</a-select-option>
        </a-select>
      </a-form-item>
    </a-form>

    <!-- 选择图标 -->
    <icons @choose="handleIconChoose" @close="handleIconCancel" :iconChooseVisible="iconChooseVisible"></icons>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'
import { axios } from '@/utils/request'
import modalMixin from '@/components/Mixins/modal'
import Icons from '../icon/Icons'

// 表单字段
const fields = ['description', 'id']

export default {
  name: 'PermissionModal',
  mixins: [modalMixin],
  components: {
    Icons,
  },
  data() {
    const typeList = [
      {
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
    ]
    const markList = [
      {
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
    ]
    return {
      Urls: {
        addUrl: '/auth/api/resource/insert',
        editUrl: '/auth/api/resource/update/',
        getByIdUrl: '/auth/api/resource/get/',
        treeListUrl: '/auth/api/resource/tree',
      },
      textMap: {
        add: '新增',
        edit: '编辑',
      },
      labelCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 6,
        },
      },
      wrapperCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 18,
        },
      },
      labelRowCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 3,
        },
      },
      wrapperRowCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 21,
        },
      },
      typeList,
      markList,
      validatorRules: {
        name: {
          rules: [
            { required: true, message: '请输入菜单标题!' },
            { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' },
          ],
        },
        pers: { rules: [{ required: false, message: '请输入授权标识!' }, { validator: this.validatePerms }] },
      },
      treeData: [
        {
          name: '顶级菜单',
          key: '0',
          value: '0',
          id: '0',
          children: [],
        },
      ],
      model: {
        icon: '',
      },
      iconChooseVisible: false,
    }
  },
  created() {},
  methods: {
    beforeOpen() {
      this.getTreeData()
      this.isDisabled = false
    },
    beforeSubmit(form) {
      form.mark = form.mark.join()
      form.icon = this.model.icon
      return form
    },
    setForm(data) {
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(data, 'type', 'name', 'parentId', 'url', 'path', 'sort'))
        this.form.setFieldsValue({
          mark: data.mark ? data.mark.split(',') : undefined,
        })
      })
    },
    selectIcons() {
      this.iconChooseVisible = true
    },
    handleIconCancel() {
      this.iconChooseVisible = false
    },
    handleIconChoose(value) {
      this.model.icon = value
      this.iconChooseVisible = false
    },
  },
}
</script>
