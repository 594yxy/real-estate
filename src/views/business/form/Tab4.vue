<template>
  <a-form :form="form">
    <a-tabs type="card" default-active-key="1" tab-position="left">
      <a-tab-pane v-for="item in panes" :key="item.key" :tab="`${item.title}`">{{ item.content }}</a-tab-pane>
    </a-tabs>
    <a-form-item class="form-btn" style="margin-top: 24px">
      <a-button>取 消</a-button>
      <a-button type="primary" @click="handleSubmit" style="margin-left: 24px">打 印</a-button>
    </a-form-item>
  </a-form>
</template>

<script>
import modalMixin from '@/components/Mixins/modal'
import indexMixin from './modules/Tab4'
export default {
  name: 'Step4',
  mixins: [modalMixin, indexMixin],
}
</script>
<style lang="less" scoped>
</style>
