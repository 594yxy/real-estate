<template>
  <a-modal
    :title="textMap[dialogStatus]"
    :width="560"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <a-form :form="form" :labelCol="labelCol" :wrapperCol="wrapperCol">
      <a-form-item label="角色名称">
        <a-input placeholder="请输入角色名称" v-decorator="['name', validatorRules.must]" />
      </a-form-item>
      <a-form-item label="角色标识" style="margin-bottom: 10px">
        <a-input placeholder="请输入角色标识" v-decorator="['mark', validatorRules.must]" />
      </a-form-item>
      <a-form-item label="提示">
        <a-alert message="角色标识不能随意更改，如需更改请联系相关开发人员" type="warning" showIcon />
      </a-form-item>
      <a-form-item label="数据权限">
        <a-select
          placeholder="数据权限"
          allowClear
          showSearch
          optionFilterProp="children"
          v-decorator="['dataRole', validatorRules.must]"
        >
          <a-select-option v-for="(item, index) in dataRoleList" :key="index" :value="item.key">{{
            item.name
          }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="角色描述">
        <a-textarea :rows="3" v-decorator="['remark']" placeholder="..." />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'
import { axios } from '@/utils/request'
import modalMixin from '@/components/Mixins/modal'

export default {
  name: 'RoleModal',
  mixins: [modalMixin],
  data() {
    const dataRoleList = [
      {
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
    return {
      Urls: {
        addUrl: '/auth/api/role/insert',
        editUrl: '/auth/api/role/update/',
        getByIdUrl: '/auth/api/role/get/',
      },

      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
      textMap: {
        add: '新增角色',
        edit: '编辑角色',
      },
      validatorRules: {
        name: {
          rules: [
            { required: true, message: '请输入角色名称!' },
            { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' },
          ],
        },
      },
      dataRoleList,
    }
  },
  created() {},
  methods: {
    beforeSubmit(form) {
      form.roleStatus = 'ENABLED'
      return form
    },
    setForm(data) {
      console.log('编辑', data)
      this.model = data
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(data, 'name', 'mark', 'dataRole', 'remark'))
      })
    },
  },
}
</script>
