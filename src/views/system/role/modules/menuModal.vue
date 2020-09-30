<template>
  <a-modal
    title="设置权限"
    :width="600"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item style="margin-bottom: 5px" :labelCol="labelCol" :wrapperCol="wrapperCol" label="职务名称">
          <span>{{ model.name }}</span>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="设置权限">
          <a-tree
            checkable
            :replaceFields="{ title: 'name', key: 'id' }"
            :autoExpandParent="autoExpandParent"
            v-model="checkedKeys"
            @check="onCheck"
            :treeData="treeData"
          />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import modalMixin from '@/components/Mixins/modal'
import { axios } from '@/utils/request'
import pick from 'lodash.pick'

export default {
  name: 'menuModel',
  mixins: [modalMixin],
  data() {
    return {
      Urls: {
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
      validatorRules: {
        must: { rules: [{ required: true, message: '此字段为必填!' }] },
      },
      userList: [],
      tips: {
        edit: '设置权限成功',
      },
      autoExpandParent: true,
      treeData: [],
      checkedKeys: [],
      checkedArr: [],
    }
  },
  created() {},
  methods: {
    beforeSubmit(form) {
      form.resources = []
      for (let item in this.checkedArr) {
        form.resources[item] = {
          id: this.checkedArr[item],
        }
      }
      return form
    },
    onCheck(checkedKeys, e) {
      this.checkedArr = checkedKeys.concat(e.halfCheckedKeys)
    },
    setForm(data) {
      this.model = data
      let resData = data.checkResources
      this.treeData = resData.map((item) => this.mapTreeLeaf(item))
      let keys = [],
        keyIds = []
      function checkedKey(data) {
        for (let i = 0; i < data.length; i++) {
          let key = data[i]
          if (key.checked == true) {
            keyIds.push(key.id)
          }
          if (key.children.length > 0) {
            checkedKey(key.children)
          } else {
            if (key.checked == true) {
              keys.push(key.id)
            }
          }
        }
      }
      checkedKey(resData)
      this.checkedKeys = keys
      this.checkedArr = keyIds
    }
  },
}
</script>

<style scoped>
</style>