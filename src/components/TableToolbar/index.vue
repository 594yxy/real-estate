<template>
  <div class="toolbar">
    <a-tooltip>
      <template slot="title">刷新</template>
      <span @click="handleReload">
        <a-icon type="reload" />
      </span>
    </a-tooltip>
    <a-popover placement="bottomRight" trigger="click" @visibleChange="handleClickChange">
      <div slot="title" class="toolbar-check-title">
        <a-checkbox
          :indeterminate="indeterminate"
          :checked="checkAll"
          @change="checkAllColumnsChange"
        >全部</a-checkbox>
        <a href="javascript:;" @click="toolbarReset">重置</a>
      </div>
      <div class="toolbar-check-list" slot="content">
        <a-checkbox-group
          v-model="checkedColumns"
          :options="optionsColumns"
          @change="checkedChange"
        />
      </div>
      <a-tooltip>
        <template slot="title">列设置</template>
        <span>
          <a-icon type="setting" />
        </span>
      </a-tooltip>
    </a-popover>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    columns: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      // table column show or hide
      optionsColumns: [],
      checkedColumns: [],
      checkAll: false,
      indeterminate: true,
      newColumns: [],
    }
  },
  computed: {},
  watch: {
    checkedColumns(arr) {
      this.newColumns.map((item) => {
        if (arr.indexOf(item.title) !== -1) {
          item.isShow = true
        } else {
          item.isShow = false
        }
      })
      if (arr.length == this.optionsColumns.length) {
        this.checkAll = true
        this.indeterminate = false
      }
      // 动态控制列
      this.$emit('toolbarChange', this.newColumns)
    },
  },
  methods: {
    // 刷新
    handleReload() {
      this.$emit('refresh')
    },
    // 列设置
    handleClickChange(visible) {
      if (visible) {
        if (this.optionsColumns.length > 0) {
          this.optionsColumns = [...this.optionsColumns]
          this.newColumns = [...this.newColumns]
        } else {
          this.newColumns = this.columns.map((item, index) => {
            this.optionsColumns[index] = item.title
            item.isShow = true
            return item
          })
          this.checkedColumns = this.optionsColumns
        }
      }
    },
    // 重置选项时
    toolbarReset() {
      this.checkedColumns = this.optionsColumns
    },
    // 选中项发生变化时
    checkedChange(checkedList) {
      this.indeterminate = !!checkedList.length && checkedList.length < this.optionsColumns.length
      this.checkAll = checkedList.length === this.optionsColumns.length
    },
    // 点击全选时
    checkAllColumnsChange(e) {
      Object.assign(this, {
        checkedColumns: e.target.checked ? this.optionsColumns : [],
        indeterminate: false,
        checkAll: e.target.checked,
      })
    },
  },
}
</script>
<style lang='scss' scoped>
</style>