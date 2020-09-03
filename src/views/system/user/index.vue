<template>
  <page-header-wrapper :title="false">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="24">
            <a-col :md="8" :sm="24">
              <a-form-item label="关键词">
                <a-input allowClear v-model="queryParam.condition.keyWord" placeholder="用户名/手机号" />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="加入时间" class="date-picker-box">
                <j-date @start="handleStartTime" @end="handleEndTime" v-if="isShowDate"></j-date>
              </a-form-item>
            </a-col>
            <a-col :md="5" :sm="24">
              <a-form-item label="审核状态">
                <a-select allowClear v-model="queryParam.condition.auditStatus" placeholder="请选择">
                  <a-select-option
                    v-for="item in Object.keys(statusMap)"
                    :value="item"
                    :key="item"
                  >{{statusMap[item].text}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="!advanced && 3 || 24" :sm="24">
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
      <a-table
        :columns="columns"
        :dataSource="dataSource"
        :loading="localLoading"
        rowKey="id"
        :pagination="pagination"
        size="middle"
      >
        <template v-for="col in ['balance', 'allAmount']" :slot="col" slot-scope="text">
          <div :key="col">
            <template>
              <a-statistic prefix="￥" :value="text || 0" :value-style="valueStyle"></a-statistic>
            </template>
          </div>
        </template>
        <span
          slot="auditStatus"
          slot-scope="text,record"
          :class="text | statusTypeFilter"
        >{{record.auditStatusDesc}}</span>

        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleAccountType(record)">设置角色</a>
            <a-divider type="vertical" />
            <a @click="handleDel(record)">删除</a>
          </template>
        </span>
      </a-table>

      <audit-form ref="detailForm" @ok="afterSubmit" />
    </a-card>
  </page-header-wrapper>
</template>

<script>
import baseMixin from '@/components/Mixins/base'
import indexMixin from './mixin/index'
import { Ellipsis } from '@/components'
import AuditForm from './modules/AuditForm'
import JDate from '@/components/JDate/index'
import TableToolbar from '@/components/TableToolbar/index'

export default {
  name: 'UserList',
  mixins: [baseMixin, indexMixin],
  components: {
    Ellipsis,
    AuditForm,
    JDate,
    TableToolbar,
  },
}
</script>
