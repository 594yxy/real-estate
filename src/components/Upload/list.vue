<template>
  <div>
    <a-upload
      list-type="picture-card"
      :file-list="fileList"
      @preview="handlePreview"
      class="file-uploader"
      :before-upload="beforeUpload"
      :remove="handleRemove"
    >
      <template v-if="plus">
        <a-icon type="plus" />
        <div class="ant-upload-text">点击上传</div>
      </template>
    </a-upload>
    <viewer :images="images" @inited="inited" class="viewer" ref="viewer">
      <img v-for="src in images" :src="src" :key="src" />
    </viewer>
  </div>
</template>

<script>
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}
import { axios } from '@/utils/request'
export default {
  name: 'UploadList',
  components: {},
  props: {
    plus: {
      type: Boolean,
      default: true,
    },
    ids: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      Urls: {
        imgListUrl: '/file/api/file/batchSelect',
        delFileUrl: '/file/api/file/delete/',
      },
      images: [],
      viewerShow: false,
      previewVisible: false,
      previewImage: '',
      fileList: [],
    }
  },
  computed: {},
  watch: {},
  methods: {
    inited(viewer) {
      this.$viewer = viewer
    },
    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj)
      }
      this.images = file.url.split() || file.preview.split()
      this.$viewer.show()
    },
    handleRemove(file) {
      if (this.plus) {
        axios({
          url: this.Urls.delFileUrl + file.uid,
          method: 'get',
        }).then((res) => {
          if (res.code == 0) {
            this.$notification.success({
              message: '删除成功',
            })
            const index = this.fileList.indexOf(file)
            const newFileList = this.fileList.slice()
            newFileList.splice(index, 1)
            this.fileList = newFileList

            let fileIds = this.fileList.map((item) => {
              return item.uid
            })
            this.$emit('setFileValue', fileIds)
          } else {
            this.$notification.error({
              message: res.msg,
            })
          }
        })
      } else {
        return false
      }
    },
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
      this.uploadImgList(file)
      return false
    },
    uploadImgList(file) {
      const formData = new FormData()
      formData.append('file', file)
      /* this.fileList.forEach((file) => {
        formData.append('files[]', file)
      }) */
      this.uploading = true
      axios({
        url: '/file/api/file/upload',
        method: 'post',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 0,
        data: formData,
      })
        .then((res) => {
          this.uploading = false
          if (res.code == 0) {
            this.fileList.push({
              uid: res.data.id,
              name: res.data.name,
              status: res.data.status,
              url: res.data.url,
              ext: res.data.ext,
            })
            let fileIds = this.fileList.map((item) => {
              return item.uid
            })
            this.$emit('setFileValue', fileIds)
          } else {
            this.$notification.error({
              message: res.msg,
            })
          }
        })
        .finally(() => {
          this.uploading = false
        })
    },
    geImgtList(ids) {
      axios({
        url: this.Urls.imgListUrl,
        method: 'get',
        params: {
          ids: ids,
        },
      }).then((res) => {
        if (res.code == 0) {
          this.fileList = res.data.map((item, index) => {
            item.uid = item.id
            return item
          })
        }
      })
    },
  },
  created() {
    if (this.ids) {
      this.geImgtList(this.ids)
    }
  },
  mounted() {},
}
</script>
<style lang='less' scoped>
</style>