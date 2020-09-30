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
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="部门名称">
          <a-input
            placeholder="请输入部门名称"
            v-decorator="['name', { rules: [{ required: true, message: '请输入部门名称' }] }]"
          />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="上级部门">
          <a-tree-select
            allowClear
            :replaceFields="{ title: 'name', value: 'id', key: 'id' }"
            :treeData="treeData"
            placeholder="请选择上级部门"
            treeDefaultExpandAll
            v-decorator="['parentId', { rules: [{ required: true, message: '请选择上级部门' }] }]"
            :disabled="isDisabled"
          ></a-tree-select>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="所属地区" required style="margin-bottom: 0">
          <a-row :gutter="10">
            <a-col :md="8" :sm="24">
              <a-form-item>
                <a-select
                  showSearch
                  label-in-value
                  optionFilterProp="children"
                  placeholder="选择省"
                  @change="handleProvinceChange"
                  v-decorator="['provinceId', { rules: [{ required: true, message: '请选择省份' }] }]"
                >
                  <a-select-option v-for="item in provinceList" :key="item.id" :value="item.id">{{
                    item.name
                  }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item>
                <a-select
                  showSearch
                  label-in-value
                  optionFilterProp="children"
                  placeholder="选择市"
                  @change="handleCityChange"
                  v-decorator="['cityId']"
                >
                  <a-select-option v-for="item in cityList" :key="item.id" :value="item.id">{{
                    item.name
                  }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item>
                <a-select
                  showSearch
                  label-in-value
                  optionFilterProp="children"
                  placeholder="选择区县"
                  @change="handledistrictChange"
                  v-decorator="['areaId']"
                >
                  <a-select-option v-for="item in districtList" :key="item.id" :value="item.id">{{
                    item.name
                  }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="部门描述">
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
  name: 'OrgModal',
  mixins: [modalMixin],
  data() {
    return {
      Urls: {
        addUrl: '/auth/api/org/insert',
        editUrl: '/auth/api/org/update/',
        getByIdUrl: '/auth/api/org/get/',
        treeListUrl: '/auth/api/org/tree',
      },
      textMap: {
        add: '新增部门',
        edit: '编辑部门',
      },
      validatorRules: {
        username: {
          rules: [
            { required: true, message: '此字段为必填!' },
            { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' },
          ],
        },
      },
      treeData: [
        {
          name: '置业担保',
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
    beforeOpen(record) {
      this.getArea('100000', 'provinceList')
      this.getTreeData()
      if (record.cityId) {
        this.getArea(record.provinceId, 'cityList')
      }
      if (record.areaId) {
        this.getArea(record.cityId, 'districtList')
      }
    },
    handleProvinceChange(val) {
      this.getArea(val.key, 'cityList')
      this.model.provinceName = val.label
    },
    handleCityChange(val) {
      this.getArea(val.key, 'districtList')
      this.model.cityName = val.label
    },
    handledistrictChange(val) {
      this.model.areaName = val.label
    },
    beforeSubmit(form) {
      form.orgStatus = 'ENABLED'
      form.areaName = form.provinceId.label + ',' + form.cityId.label + ',' + form.areaId.label
      form.provinceId = form.provinceId.key
      form.cityId = form.cityId.key
      form.areaId = form.areaId.key
      return form
    },
    setForm(data) {
      this.model = data
      this.$nextTick(() => {
        this.form.setFieldsValue({
          provinceId: data.provinceId
            ? { key: data.provinceId, label: data.areaName ? data.areaName.split(',')[0] : '' }
            : undefined,
          cityId: data.provinceId
            ? { key: data.cityId, label: data.areaName ? data.areaName.split(',')[1] : '' }
            : undefined,
          areaId: data.provinceId
            ? { key: data.areaId, label: data.areaName ? data.areaName.split(',')[2] : '' }
            : undefined,
        })
        this.form.setFieldsValue(pick(data, 'name', 'parentId', 'remark'))
      })
    },
  },
}
</script>
