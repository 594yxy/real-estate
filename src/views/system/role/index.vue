<template>
  <page-header-wrapper :title="false">
    <a-card :bordered="false">
      <!-- 搜索 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="24">
            <a-col :md="10" :sm="24">
              <a-form-item label="关键词">
                <a-input allowClear v-model="queryParam.condition.keyWord" placeholder="角色名称" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="状态">
                <a-select allowClear v-model="queryParam.condition.roleStatus" placeholder="请选择">
                  <a-select-option v-for="item in roleStatusList" :value="item.key" :key="item.key">{{
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
      <!-- 表格 -->
      <div class="table-operator">
        <a-button type="primary" icon="plus" @click="handleAdd" class="mr-8">新增角色</a-button>
        <a-button-group>
          <a-button icon="edit" @click="handleEdit">编辑</a-button>
          <a-button icon="delete" @click="handleDel">删除</a-button>
          <a-button @click="handleSetMenu">设置权限</a-button>
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
        <span slot="dataRole" slot-scope="text">
          <span>{{ filterName(dataRoleList, text) }}</span>
        </span>
        <span slot="status" slot-scope="text">
          <span>{{ filterName(roleStatusList, text) }}</span>
        </span>
      </a-table>

      <!-- 表单 -->
      <create-form ref="modalForm" @ok="afterSubmit" />
      <menu-modal ref="menuModal" @ok="afterSubmit"></menu-modal>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import baseMixin from '@/components/Mixins/base'
import indexMixin from './modules/index'
import CreateForm from './modules/CreateForm'
import menuModal from './modules/menuModal'

export default {
  name: 'RoleList',
  mixins: [baseMixin, indexMixin],
  components: {
    CreateForm,
    menuModal,
  },
}
</script>
