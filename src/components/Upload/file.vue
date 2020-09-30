<template>
  <div>
    <a-upload
      :file-list="fileList"
      @preview="handlePreview"
      :before-upload="beforeUpload"
      :remove="handleRemove"
      @change="handleChange"
    >
      <a-button> <a-icon type="upload" />点击上传 </a-button>
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
  name: 'UploadFile',
  props: {
    ids: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      Urls: {
        imgListUrl: '/file/api/file/batchSelect',
        uploadFileUrl: '/file/api/file/multiUpload',
        delFileUrl: '/file/api/file/delete/',
        batchDelFileUrl: '/file/api/file/removes',
      },
      images: [],
      viewerShow: false,
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
        file.preview = await getBase64(file)
      }
      this.images = file.url ? file.url.split() : file.preview.split()
      this.$viewer.show()
    },
    handleRemove(file) {
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
    },
    // 格式限制
    beforeUpload(file) {
      /* const isXLSX = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      const isDOCX = file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      const isPDF = file.type === 'application/pdf';
      const isJPG = file.type === 'image/jpeg';
      const isPNG = file.type === 'image/png'; */

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
    // 上传图片
    handleChange({ file }) {
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

    // 预览图片
    handlePreviewOld(file) {
      console.log('预览', file)
      getBase64(file, (imageUrl) => {
        // this.imageUrl = imageUrl
      })
      /* if (file.ext == 'jpg' || file.ext == 'jpeg' || file.ext == 'png') {
        this.$refs.viewModal.handleView(file.url)
      } else if (file.ext == 'docx' || file.ext == 'pdf' || file.ext == 'xlsx') {
        this.$refs.viewModal.handleFile(file.url)
      } */
    },
    // 删除图片
    handleFileRemove(file) {
      axios({
        url: this.Urls.delFileUrl + file.uid,
        method: 'get',
      }).then((res) => {
        if (res.code == 0) {
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
    },
    getFile(ids) {
      axios({
        url: this.Urls.imgListUrl,
        method: 'get',
        params: {
          ids: ids,
        },
      }).then((res) => {
        if (res.code == 0) {
          this.fileList = res.data.map((item) => {
            return {
              uid: item.id,
              name: item.name,
              status: item.status,
              url: item.url,
              ext: item.ext,
            }
          })
        } else {
          this.$notification.error({
            message: res.msg,
          })
        }
      })
    },
  },
  created() {
    if (this.ids) {
      this.getFile(this.ids)
    }
  },
  mounted() {},
}
</script>
<style lang='less' scoped>
</style>