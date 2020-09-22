<template>
  <div>
    <a-upload :file-list="fileList" @preview="handlePreview" :before-upload="beforeUpload">
      <a-button>
        <a-icon type="upload" />点击上传
      </a-button>
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
    fileIds: {
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
      console.log(file)
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file)
      }
      this.images = file.url ? file.url.split() : file.preview.split()
      console.log('image', this.images)
      this.$viewer.show()
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
      this.fileList = [...this.fileList, file]
      console.log('lala', file)
      return false
    },
    // 上传图片
    handleUpload() {
      const formData = new FormData()
      this.fileList.forEach((file) => {
        formData.append('files[]', file)
      })
      this.uploading = true

      this.uploading = true
      axios({
        url: this.Urls.uploadFileUrl,
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
            this.$emit('setFileValue', this.fileList)
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
          this.$emit('setFileValue', this.fileList)
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
        console.log('返回的文件列表', res)
        if (res.code == 0) {
          this.fileList = res.data
          this.$emit('setFileValue', this.fileList)
        } else {
          this.$notification.error({
            message: res.msg,
          })
        }
      })
    },
  },
  created() {
    if (this.fileIds) {
      this.getFile(this.fileIds)
    }
  },
  mounted() {},
}
</script>
<style lang='less' scoped>
</style>