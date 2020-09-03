import moment from 'moment'

var indexMixin = {
  props: {
    dateFormat: {
      type: String,
      default: 'YYYY-MM-DD HH:mm:ss'
    },
    showTime: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      startValue: null,
      endValue: null,
      endOpen: false,
    }
  },
  filters: {},
  created() {},
  methods: {
    disabledStartDate(startValue) {
      const endValue = this.endValue;
      if (!startValue || !endValue) {
        return false;
      }
      return startValue.valueOf() > endValue.valueOf();
    },
    disabledEndDate(endValue) {
      const startValue = this.startValue;
      if (!endValue || !startValue) {
        return false;
      }
      return startValue.valueOf() >= endValue.valueOf();
    },
    handleStartOpenChange(open) {
      if (!open) {
        this.endOpen = true;
      }
    },
    handleEndOpenChange(open) {
      this.endOpen = open;
    },
    handleStartChange(date, val) {
      this.$emit('start', val);
    },
    handleEndChange(date, val) {
      this.$emit('end', val);
    },
  }
}
export default indexMixin