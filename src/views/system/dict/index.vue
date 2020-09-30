<template>
  <page-header-wrapper :title="false">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="24">
            <a-col :md="8" :sm="24">
              <a-form-item label="关键词">
                <a-input allowClear v-model="queryParam.condition.keyWord" placeholder="字典名称" />
              </a-form-item>
            </a-col>
            <a-col :md="(!advanced && 3) || 24" :sm="24">
              <span class="table-page-search-submitButtons">
                <a-button type="primary" @click="handleSearch">查询</a-button>
                <a-button style="margin-left: 8px" @click="searchReset">重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <div class="table-operator">
        <a-button type="primary" icon="plus" @click="handleAdd" class="mr-8">新建字典</a-button>
        <a-button-group>
          <a-button icon="edit" @click="handleEdit">编辑</a-button>
          <a-button icon="delete" @click="handleDel">删除</a-button>
          <a-button @click="handleAddSub">添加子级</a-button>
        </a-button-group>
      </div>
      <a-table
        :columns="columns"
        :dataSource="dataSource"
        :loading="localLoading"
        rowKey="id"
        :pagination="pagination"
        size="middle"
        :custom-row="rowClick"
        :row-selection="rowSelection"
        @expand="handleExpand"
        v-if="tableShow"
      ></a-table>
      <!-- 表单 -->
      <create-form ref="modalForm" @ok="afterSubmit" />
    </a-card>
  </page-header-wrapper>
</template>

<script>
import baseMixin from '@/components/Mixins/base'
import indexMixin from './modules/index'
import { Ellipsis } from '@/components'
import CreateForm from './modules/CreateForm'
import JDate from '@/components/JDate/index'
import TableToolbar from '@/components/TableToolbar/index'

export default {
  name: 'UserList',
  mixins: [baseMixin, indexMixin],
  components: {
    Ellipsis,
    CreateForm,
    JDate,
    TableToolbar,
  },
}
</script>
