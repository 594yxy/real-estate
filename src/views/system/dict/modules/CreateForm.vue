<template>
  <a-modal
    :title="textMap[dialogStatus]"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item :labelCol="labelRowCol" :wrapperCol="wrapperRowCol" label="上级字典">
          <a-tree-select
            allowClear
            :replaceFields="{ title: 'name', value: 'id', key: 'id' }"
            :treeData="treeData"
            placeholder="请选择上级字典"
            treeDefaultExpandAll
            v-decorator="['parentId', { rules: [{ required: true, message: '请选择上级字典' }] }]"
            :disabled="isDisabled"
          ></a-tree-select>
        </a-form-item>
        <a-row :gutter="15">
          <a-col :md="12" :sm="24">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="键值">
              <a-input placeholder="请输入键值" v-decorator="['key']" />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="键名">
              <a-input placeholder="请输入键名" v-decorator="['value']" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item :labelCol="labelRowCol" :wrapperCol="wrapperRowCol" label="字典名称">
          <a-input
            placeholder="请输入字典名称"
            v-decorator="['name', { rules: [{ required: true, message: '请输入字典名称' }] }]"
          />
        </a-form-item>
        <a-row :gutter="15">
          <a-col :md="12" :sm="24">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="字典分类">
              <a-select
                v-decorator="['category', { rules: [{ required: true, message: '此字段为必填' }] }]"
                placeholder="请选择"
              >
                <a-select-option value="dict">字典</a-select-option>
                <a-select-option value="tree">树</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="字典类型">
              <a-input
                placeholder="请输入字典类型"
                v-decorator="['type', { rules: [{ required: true, message: '此字段为必填' }] }]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item :labelCol="labelRowCol" :wrapperCol="wrapperRowCol" label="排序">
          <a-input-number placeholder="请输入字典排序" v-decorator="['sort']" :min="0" style="width: 100%" />
        </a-form-item>
        <a-form-item :labelCol="labelRowCol" :wrapperCol="wrapperRowCol" label="备注">
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

// 表单字段
const fields = ['description', 'id']

export default {
  name: 'DictModal',
  mixins: [modalMixin],
  data() {
    const labelCol = {
      xs: {
        span: 24,
      },
      sm: {
        span: 6,
      },
    }
    const wrapperCol = {
      xs: {
        span: 24,
      },
      sm: {
        span: 18,
      },
    }
    const labelRowCol = {
      xs: {
        span: 24,
      },
      sm: {
        span: 3,
      },
    }
    const wrapperRowCol = {
      xs: {
        span: 24,
      },
      sm: {
        span: 21,
      },
    }
    return {
      Urls: {
        addUrl: '/biz/api/dict/insert',
        editUrl: '/biz/api/dict/update/',
        getByIdUrl: '/biz/api/dict/get/',
        treeListUrl: '/biz/api/dict/typeTree',
      },
      textMap: {
        add: '新建字典',
        edit: '修改字典',
      },
      validatorRules: {
        username: {
          rules: [
            { required: true, message: '此字段为必填!' },
            { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' },
          ],
        },
      },
      labelCol,
      wrapperCol,
      labelRowCol,
      wrapperRowCol,
      treeData: [
        {
          name: '根节点',
          key: '0',
          value: '0',
          id: '0',
          children: [],
        },
      ],
    }
  },
  created() {},
  methods: {
    beforeOpen() {
      this.getTreeData()
    },
    beforeSubmit(form) {
      return form
    },
    setForm(data) {
      this.model = data
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(data, 'name', 'key', 'value', 'category', 'type', 'sort', 'remark'))
      })
    },
  },
}
</script>
