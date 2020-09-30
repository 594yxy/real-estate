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
    <a-spin :spinning="confirmLoading">
      <a-form :form="form" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-form-item label="银行名称">
          <a-input placeholder="请输入银行名称" v-decorator="['name', validatorRules.name]" />
        </a-form-item>
        <a-form-item label="支行">
          <a-input placeholder="请输入所在支行" v-decorator="['username', validatorRules.must]" />
        </a-form-item>
        <a-form-item label="银行账户">
          <a-input
            placeholder="请输入银行账户"
            :max-length="20"
            v-decorator="['bankCardNo', validatorRules.bankCardNo]"
          />
        </a-form-item>
        <a-form-item label="备注">
          <a-textarea :rows="3" v-decorator="['remark']" placeholder="..." />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'
import { axios } from '@/utils/request'
import modalMixin from '@/components/Mixins/modal'

export default {
  name: 'BankModal',
  mixins: [modalMixin],
  data() {
    return {
      Urls: {
        addUrl: '/auth/api/user/insert',
        editUrl: '/auth/api/user/update/',
        getByIdUrl: '/auth/api/user/get/',
        roleListurl: '/auth/api/role/list',
        orgListurl: '/auth/api/org/tree',
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
        add: '新增银行',
        edit: '编辑银行',
      },
      validatorRules: {
        name: {
          rules: [
            { required: true, message: '请输入银行名称!' },
            { min: 2, max: 30, message: '长度在 2 到 20 个字符', trigger: 'blur' },
          ],
        },
        bankCardNo: {
          rules: [{ required: true, message: '请输入监管银行账户' }, { validator: this.validator.bankCardNo }],
        },
      },
      roleList: [],
      orgList: [],
    }
  },
  created() {},
  methods: {
    setForm(data) {
      this.model = data
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(data, 'name', 'username', 'phone', 'orgId', 'remark'))
      })
    },
  },
}
</script>
