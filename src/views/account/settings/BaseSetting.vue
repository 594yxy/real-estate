<template>
  <div class="account-settings-info-view">
    <a-row :gutter="16">
      <a-col :md="24" :lg="16">
        <a-form :form="form" layout="vertical">
          <a-form-item label="昵称">
            <a-input disabled v-decorator="['username']" placeholder="昵称" />
          </a-form-item>
          <a-form-item label="手机号">
            <a-input disabled v-decorator="['mobile']" placeholder="手机号" />
          </a-form-item>
          <a-form-item label="角色" :required="false">
            <a-select disabled v-decorator="['accountType']" placeholder="角色">
              <a-select-option value="OUTSIDE">外部用户</a-select-option>
              <a-select-option value="INSIDE">内部账户</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="备注" :required="false">
            <a-textarea rows="4" v-decorator="['remark']" disabled placeholder="..." />
          </a-form-item>
        </a-form>
      </a-col>
      <a-col :md="24" :lg="8" :style="{ minHeight: '180px' }">
        <div class="ant-upload-preview">
          <img :src="option.img" />
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import pick from 'lodash.pick'
import modalMixin from '@/components/Mixins/modal'
import { axios } from '@/utils/request'

export default {
  mixins: [modalMixin],
  data() {
    return {
      // cropper
      preview: {},
      option: {
        img: '/avatar2.jpg',
        info: true,
        size: 1,
        outputType: 'jpeg',
        canScale: false,
        autoCrop: true,
        // 只有自动截图开启 宽度高度才生效
        autoCropWidth: 180,
        autoCropHeight: 180,
        fixedBox: true,
        // 开启宽度和高度比例
        fixed: true,
        fixedNumber: [1, 1],
      },
    }
  },
  created() {
    this.fillForm()
  },
  methods: {
    fillForm() {
      this.confirmLoading = true
      axios({
        url: '/api/auth/current',
        method: 'get',
      })
        .then((res) => {
          this.confirmLoading = false
          if (res.code == 0) {
            this.setForm(res.data)
          } else {
            this.$notification.error({
              message: res.msg,
            })
          }
        })
        .catch(() => {
          this.confirmLoading = false
        })
    },
    setavatar(url) {
      this.option.img = url
    },
    setForm(data) {
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(data, 'username', 'mobile', 'accountType', 'remark'))
      })
    },
  },
}
</script>

<style lang="less" scoped>
.avatar-upload-wrapper {
  height: 200px;
  width: 100%;
}

.ant-upload-preview {
  position: relative;
  margin: 0 auto;
  width: 100%;
  max-width: 180px;
  border-radius: 50%;
  box-shadow: 0 0 4px #ccc;

  .upload-icon {
    position: absolute;
    top: 0;
    right: 10px;
    font-size: 1.4rem;
    padding: 0.5rem;
    background: rgba(222, 221, 221, 0.7);
    border-radius: 50%;
    border: 1px solid rgba(0, 0, 0, 0.2);
  }
  .mask {
    opacity: 0;
    position: absolute;
    background: rgba(0, 0, 0, 0.4);
    cursor: pointer;
    transition: opacity 0.4s;

    &:hover {
      opacity: 1;
    }

    i {
      font-size: 2rem;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-left: -1rem;
      margin-top: -1rem;
      color: #d6d6d6;
    }
  }

  img,
  .mask {
    width: 100%;
    max-width: 180px;
    height: 100%;
    border-radius: 50%;
    overflow: hidden;
  }
}
</style>
