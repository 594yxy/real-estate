<template>
  <page-header-wrapper :title="false">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="24">
            <a-col :md="10" :sm="24">
              <a-form-item label="关键词">
                <a-input allowClear v-model="queryParam.condition.keyWord" placeholder="名称/标题" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="类型">
                <a-select allowClear v-model="queryParam.condition.type" placeholder="请选择">
                  <a-select-option v-for="item in typeList" :value="item.key" :key="item.key">{{
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
      <div class="table-operator">
        <a-button type="primary" icon="plus" @click="handleAdd" class="mr-8">新增</a-button>
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
      >
        <span slot="type" slot-scope="text">
          <span>{{ filterName(typeList, text) }}</span>
        </span>
        <span slot="mark" slot-scope="text">
          <span>{{ filterName(markList, text) }}</span>
        </span>
      </a-table>

      <create-form ref="modalForm" @ok="afterSubmit" />
    </a-card>
  </page-header-wrapper>
</template>

<script>
import baseMixin from '@/components/Mixins/base'
import indexMixin from './modules/index'
import CreateForm from './modules/CreateForm'

export default {
  name: 'MenuList',
  mixins: [baseMixin, indexMixin],
  components: {
    CreateForm,
  },
}
</script>
