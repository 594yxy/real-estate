<template>
  <page-header-wrapper :title="false">
    <a-card :bordered="false">
      <a-tabs v-model="activeKey" class="my-tabs">
        <a-tab-pane key="1">
          <span slot="tab">
            <a-icon type="user" />买方信息
          </span>
          <Tab1 v-if="activeKey == '1'" />
        </a-tab-pane>
        <a-tab-pane key="2">
          <span slot="tab">
            <a-icon type="home" />卖方信息
          </span>
          <Tab2 v-if="activeKey == '2'" />
        </a-tab-pane>
        <a-tab-pane key="3">
          <span slot="tab">
            <a-icon type="red-envelope" />贷款信息
          </span>
          <Tab3 v-if="activeKey == '3'" />
        </a-tab-pane>
        <a-tab-pane key="4">
          <span slot="tab">
            <a-icon type="printer" />打印贷款资料
          </span>
          <Tab4 v-if="activeKey == '4'" />
        </a-tab-pane>
        <a-tab-pane key="5">
          <span slot="tab">
            <a-icon type="schedule" />完善贷款资料
          </span>
          <Tab5 v-if="activeKey == '5'" />
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import Tab1 from './Tab1'
import Tab2 from './Tab2'
import Tab3 from './Tab3'
import Tab4 from './Tab4'
import Tab5 from './Tab5'

export default {
  name: 'StepForm',
  components: {
    Tab1,
    Tab2,
    Tab3,
    Tab4,
    Tab5
  },
  data() {
    return {
      activeKey: '1',
      form: null,
    }
  },
  methods: {},
}
</script>

<style lang="less" scoped>
.my-tabs {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
