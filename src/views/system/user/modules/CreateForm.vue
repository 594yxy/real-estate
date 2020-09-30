<template>
  <a-modal
    :title="textMap[dialogStatus]"
    :width="520"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-form-item label="用户账号">
          <a-input placeholder="请输入用户账号" v-decorator="['username', validatorRules.must]" />
        </a-form-item>
        <a-form-item label="真实姓名">
          <a-input placeholder="请输入您的姓名" v-decorator="['name', validatorRules.must]" />
        </a-form-item>
        <a-form-item label="手机号码">
          <a-input placeholder="请输入手机号码" v-decorator="['phone', validatorRules.phone]" />
        </a-form-item>
        <a-form-item label="所属部门">
          <a-tree-select
            allowClear
            :replaceFields="{ title: 'name', value: 'id', key: 'id' }"
            :treeData="orgList"
            placeholder="请选择用户所在部门"
            treeDefaultExpandAll
            v-decorator="['orgId', { rules: [{ required: true, message: '此字段为必填' }] }]"
          ></a-tree-select>
        </a-form-item>
        <a-form-item label="角色分配">
          <a-select
            mode="multiple"
            labelInValue
            showSearch
            optionFilterProp="children"
            v-decorator="['roles', validatorRules.must]"
            @change="handleRoleChange"
            placeholder="请选择用户角色"
          >
            <a-select-option v-for="(item, index) in roleList" :key="index" :value="item.id">{{
              item.name
            }}</a-select-option>
          </a-select>
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
  name: 'UserModal',
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
        add: '新增用户',
        edit: '编辑用户',
      },
      validatorRules: {
        username: {
          rules: [
            { required: true, message: '此字段为必填!' },
            { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' },
            {
              validator: (rule, value, callback) => {
                let pattern = /^[a-z|A-Z][a-z|A-Z\d_-]{0,}$/
                if (!pattern.test(value)) {
                  callback('用户名必须以字母开头，可包含数字、下划线、横杠')
                } else {
                  callback()
                }
              },
            },
          ],
        },
      },
      roleList: [],
      orgList: [],
    }
  },
  created() {
    /* console.log('custom modal created')

    // 防止表单未注册
    fields.forEach((v) => this.form.getFieldDecorator(v))

    // 当 model 发生改变时，为表单设置值
    this.$watch('model', () => {
      this.model && this.form.setFieldsValue(pick(this.model, fields))
    }) */
  },
  methods: {
    beforeOpen() {
      this.getRoleList()
      this.getOrgList()
    },

    // 角色列表
    getRoleList() {
      axios({
        url: this.Urls.roleListurl,
        method: 'get',
      }).then((res) => {
        if (res.code == 0) {
          this.roleList = res.data.records
        } else {
          this.$notification.error({
            message: res.msg,
          })
        }
      })
    },
    // 角色改变时
    handleRoleChange(value) {
      let roleArr = []
      if (value.length > 0) {
        value.map((item, index) => {
          roleArr[index] = {
            id: item.key,
            name: item.label,
          }
        })
      }
      this.$set(this.model, 'roles', roleArr)
    },

    // 机构列表
    getOrgList() {
      axios({
        url: this.Urls.orgListurl,
        method: 'get',
      }).then((res) => {
        if (res.code == 0) {
          let resData = res.data.records
          this.orgList = resData.map((item) => this.mapTreeLeaf(item))
        } else {
          this.$notification.error({
            message: res.msg,
          })
        }
      })
    },
    beforeSubmit(form) {
      form.roles = this.model.roles
      return form
    },
    setForm(data) {
      console.log(data)
      this.model = data
      let roleArr = []
      if (data.roles && data.roles.length > 0) {
        data.roles.map((item, index) => {
          roleArr[index] = {
            key: item.id,
            label: item.name,
          }
        })
      }
      this.$nextTick(() => {
        this.form.setFieldsValue({
          roles: roleArr,
        })
        this.form.setFieldsValue(pick(data, 'name', 'username', 'phone', 'orgId'))
      })
    },
  },
}
</script>
