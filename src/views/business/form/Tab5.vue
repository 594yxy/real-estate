<template>
  <a-form :form="form">
    <a-tabs type="card" default-active-key="1" tab-position="left" class="my-card-tabs">
      <a-tab-pane v-for="item in panes" :key="item.key" :tab="`${item.title}`">
        <UploadList />
      </a-tab-pane>
    </a-tabs>

    <a-form-item class="form-btn" style="margin-top: 24px">
      <a-button>取 消</a-button>
      <a-button type="primary" @click="handleSubmit" style="margin-left: 24px">打 印</a-button>
    </a-form-item>
  </a-form>
</template>

<script>
import modalMixin from '@/components/Mixins/modal'
import indexMixin from './modules/Tab5'
import UploadList from '@/components/Upload/list'
export default {
  name: 'Step5',
  mixins: [modalMixin, indexMixin],
  components: {
    UploadList,
  },
}
</script>
<style lang="less" scoped>
</style>
