<template>
  <a-upload
    name="avatar"
    list-type="picture-card"
    :show-upload-list="false"
    class="avatar-uploader"
    :before-upload="beforeUpload"
    @change="handleChange"
  >
    <img v-if="imageUrl" :src="imageUrl" alt="avatar" />
    <template v-else>
      <div class="image-bg">
        <img src="@/assets/img/idCrad1.png" v-if="isCard1" />
        <img src="@/assets/img/idCard2.png" v-if="isCard2" />
        <img src="@/assets/img/household1.png" v-if="isHouse1" />
        <img src="@/assets/img/household2.png" v-if="isHouse2" />
      </div>
      <a-icon :type="loading ? 'loading' : 'plus'" />
      <div class="ant-upload-text">{{tip}}</div>
    </template>
  </a-upload>
</template>

<script>
function getBase64(file, callback) {
  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.addEventListener('load', () => callback(reader.result))
}
import { axios } from '@/utils/request'
export default {
  name: 'Upload',
  props: {
    tip: {
      type: String,
      default: '',
    },
    isCard1: {
      type: Boolean,
      default: false,
    },
    isCard2: {
      type: Boolean,
      default: false,
    },
    isHouse1: {
      type: Boolean,
      default: false,
    },
    isHouse2: {
      type: Boolean,
      default: false,
    },
    imageId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      loading: false,
      imageUrl: '',
      Urls: {
        imgListUrl: '/file/api/file/batchSelect',
        imgUploadUrl: '/file/api/file/upload',
      },
    }
  },
  computed: {},
  watch: {},
  methods: {
    // 格式限制
    beforeUpload(file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
      if (!isJpgOrPng) {
        this.$message.error('你只能上传图片!')
        return false
      }
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('图片大小不能超过2M!')
        return false
      }
      return false
    },
    // 上传
    handleChange(info) {
      console.log('info', info)
      let file = info.file
      let formData = new FormData()
      formData.append('file', file)
      this.loading = true
      axios({
        url: this.Urls.imgUploadUrl,
        method: 'post',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 0,
        data: formData,
      })
        .then((res) => {
          this.loading = false
          getBase64(file, (imageUrl) => {
            this.imageUrl = imageUrl
          })
          if (res.code == 0) {
            this.$emit('setImageValue', res.data.id)
          } else {
            this.$notification.error({
              message: res.msg,
            })
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 回填图片
    getImgUrl(ids) {
      axios({
        url: this.Urls.imgListUrl,
        method: 'get',
        params: {
          ids: ids,
        },
      }).then((res) => {
        console.log('qie', res)
        if (res.code == 0) {
          this.imageUrl = res.data[0].url
        }
        this.imageUrl = 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
      })
    },
  },
  created() {
    if (this.imageId) {
      this.getImgUrl(this.imageId)
    }
  },
  mounted() {},
}
</script>
<style lang='less' scoped>
</style>