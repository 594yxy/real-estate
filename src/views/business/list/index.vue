<template>
  <page-header-wrapper :title="false">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="24">
            <a-col :xl="6" :md="12" :sm="24">
              <a-form-item label="业务编号">
                <a-input allowClear v-model="queryParam.condition.id" placeholder="请输入业务编号" />
              </a-form-item>
            </a-col>
            <a-col :xl="6" :md="12" :sm="24">
              <a-form-item label="买方/卖方">
                <a-input allowClear v-model="queryParam.condition.personName" placeholder="请输入买方或者卖方的姓名" />
              </a-form-item>
            </a-col>
            <a-col :xl="6" :md="12" :sm="24">
              <a-form-item label="房产证号">
                <a-input allowClear v-model="queryParam.condition.propertyNo" placeholder="请输入房产证号" />
              </a-form-item>
            </a-col>
            <a-col :xl="6" :md="12" :sm="24">
              <a-form-item label="身份证号">
                <a-input allowClear v-model="queryParam.condition.personIdcard" placeholder="请输入身份证号" />
              </a-form-item>
            </a-col>
            <a-col :xl="6" :md="12" :sm="24">
              <a-form-item label="流程节点">
                <a-select allowClear v-model="queryParam.condition.auditStatus" placeholder="请选择">
                  <a-select-option v-for="item in procNodes" :value="item.key" :key="item.key">
                    {{ item.value }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :md="12" :sm="24">
              <a-form-item label="承办部门">
                <a-select allowClear v-model="queryParam.condition.auditStatus" placeholder="请选择">
                  <a-select-option v-for="item in orgList" :value="item.id" :key="item.id">
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :md="12" :sm="24">
              <a-form-item label="贷款品种">
                <a-select allowClear v-model="queryParam.condition.subType" placeholder="请选择">
                  <a-select-option v-for="item in loanTypeList" :value="item.key" :key="item.key">{{
                    item.value
                  }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :md="12" :sm="24">
              <a-form-item label="业务类型">
                <a-select allowClear v-model="queryParam.condition.businessType" placeholder="请选择">
                  <a-select-option v-for="item in busTypeList" :value="item.key" :key="item.key">{{
                    item.value
                  }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :md="12" :sm="24">
              <a-form-item label="评估公司">
                <a-input allowClear v-model="queryParam.condition.appraisers" placeholder="请输入评估公司" />
              </a-form-item>
            </a-col>
            <a-col :xl="10" :md="24" :sm="24">
              <a-form-item label="办理时间" class="date-picker-box">
                <j-date @start="handleStartTime" @end="handleEndTime" v-if="isShowDate"></j-date>
              </a-form-item>
            </a-col>
            <a-col :xl="8" :md="24" :sm="24">
              <span class="table-page-search-submitButtons" style="float:right; overflow: 'hidden">
                <a-button type="primary" @click="handleSearch">查询</a-button>
                <a-button style="margin-left: 8px" @click="searchReset">重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <div class="table-operator">
        <a-button type="primary" icon="plus" @click="handleAdd" class="mr-8">新建业务</a-button>
        <a-button-group>
          <a-button @click="handleEdit">编辑</a-button>
          <a-button>提交</a-button>
          <a-button>转移</a-button>
          <a-button>申请终止</a-button>
        </a-button-group>
      </div>
      <a-menu :style="menuStyle" v-if="menuVisible" class="contextmenu">
        <a-menu-item key="1" @click="handleDetail(rowData)">查看详情</a-menu-item>
      </a-menu>
      <a-table
        :columns="columns"
        :dataSource="dataSource"
        :loading="localLoading"
        rowKey="id"
        :pagination="pagination"
        size="middle"
        :row-selection="rowSelection"
        :custom-row="rowClick"
      >
        <template v-for="col in ['loanSum']" :slot="col" slot-scope="text">
          <div :key="col">
            <template>
              <a-statistic prefix="￥" :value="text || 0" :value-style="valueStyle"></a-statistic>
            </template>
          </div>
        </template>
      </a-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import baseMixin from '@/components/Mixins/base'
import indexMixin from './modules/index'
import { Ellipsis } from '@/components'
import JDate from '@/components/JDate/index'

export default {
  name: 'UserList',
  mixins: [baseMixin, indexMixin],
  components: {
    Ellipsis,
    JDate,
  },
}
</script>
