<template>
  <page-header-wrapper :title="false">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="24">
            <a-col :md="10" :sm="24">
              <a-form-item label="关键词">
                <a-input allowClear v-model.trim="queryParam.condition.keyWord" placeholder="用户名/手机号" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="用户状态">
                <a-select allowClear v-model="queryParam.condition.auditStatus" placeholder="请选择">
                  <a-select-option v-for="item in userStatusList" :value="item.key" :key="item.key">{{
                    item.name
                  }}</a-select-option>
                </a-select>
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
      <!-- <div class="table-operator">
        <table-toolbar :columns="columns" @refresh="refresh" @toolbarChange="toolbarChange"></table-toolbar>
        <a-dropdown v-action:edit v-if="selectedRowKeys.length > 0">
          <a-menu slot="overlay">
            <a-menu-item key="1">
              <a-icon type="delete" />删除
            </a-menu-item>
            <a-menu-item key="2">
              <a-icon type="lock" />锁定
            </a-menu-item>
          </a-menu>
          <a-button style="margin-left: 8px">
            批量操作
            <a-icon type="down" />
          </a-button>
        </a-dropdown>
      </div>-->
      <div class="table-operator">
        <a-button type="primary" icon="plus" @click="handleAdd" class="mr-8">新增用户</a-button>
        <a-button-group>
          <a-button icon="edit" @click="handleEdit">编辑</a-button>
          <a-button icon="delete" @click="handleDel">删除</a-button>
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
      >
      </a-table>

      <!-- 表单 -->
      <create-form ref="modalForm" @ok="afterSubmit" />
    </a-card>
  </page-header-wrapper>
</template>

<script>
import baseMixin from '@/components/Mixins/base'
import indexMixin from './modules/index'
import CreateForm from './modules/CreateForm'
import TableToolbar from '@/components/TableToolbar/index'

export default {
  name: 'UserList',
  mixins: [baseMixin, indexMixin],
  components: {
    CreateForm,
    TableToolbar,
  },
}
</script>
