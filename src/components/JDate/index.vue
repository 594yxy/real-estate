<template>
  <a-row :gutter="15">
    <a-col :md="12" :sm="24">
      <a-form-item>
        <a-date-picker
          style="width: 100%"
          :disabledDate="disabledStartDate"
          :showTime="showTime"
          :format="dateFormat"
          v-model="startValue"
          placeholder="开始时间"
          @openChange="handleStartOpenChange"
          @change="handleStartChange"
        />
      </a-form-item>
    </a-col>
    <span class="till">~</span>
    <a-col :md="12" :sm="24">
      <a-form-item>
        <a-date-picker
          style="width: 100%"
          :disabledDate="disabledEndDate"
          :showTime="showTime"
          :format="dateFormat"
          placeholder="结束时间"
          v-model="endValue"
          :open="endOpen"
          @openChange="handleEndOpenChange"
          @change="handleEndChange"
        />
      </a-form-item>
    </a-col>
  </a-row>
</template>

<script>
import indexMixin from './module/index'

export default {
  name: 'JDate',
  mixins: [indexMixin]
}
</script>
