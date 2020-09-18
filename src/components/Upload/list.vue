<template>
  <div>
    <a-upload
      list-type="picture-card"
      :file-list="fileList"
      @preview="handlePreview"
      class="file-uploader"
      :before-upload="beforeUpload"
      @change="handleChange"
    >
      <template v-if="fileList.length < 8">
        <a-icon type="plus" />
        <div class="ant-upload-text">Upload</div>
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
  props: {},
  data() {
    return {
      Urls: {
        imgListUrl: '/file/api/file/batchSelect',
      },
      images: [],
      viewerShow: false,
      previewVisible: false,
      previewImage: '',
      fileList: [
        {
          uid: '-1',
          name: 'image.png',
          status: 'done',
          url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        },
        {
          uid: '-2',
          name: 'image.png',
          status: 'done',
          url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        },
        {
          uid: '-3',
          name: 'image.png',
          status: 'done',
          url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        },
        {
          uid: '-4',
          name: 'image.png',
          status: 'done',
          url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        },
        {
          uid: '-5',
          name: 'image.png',
          status: 'error',
        },
      ],
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
      console.log('image', this.images)
      this.$viewer.show()
    },
    // 格式限制
    beforeUpload(file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
      if (!isJpgOrPng) {
        this.$message.error('你只能上传图片!')
      }
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('图片大小不能超过2M!')
      }
      return isJpgOrPng && isLt2M
    },
    handleChange({ fileList }) {
      this.fileList = fileList
    },
    getSingleImgUrl(ids) {
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
  created() {},
  mounted() {},
}
</script>
<style lang='less' scoped>
</style>