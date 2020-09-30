import axios from 'axios'
import {
  message,
  Modal
} from 'ant-design-vue'
export default {
  interfaceResult: {
    0: {
      mean: "成功",
      message: "二代身份证读取成功！",
      type: "success"
    },
    1: {
      mean: "端口打开失败",
      message: "未检测到二代身份证阅读器！",
      type: "warning"
    },
    2: {
      mean: "数据传输超时",
      message: "未检测到二代身份证阅读器！",
      type: "error"
    },
    10: {
      mean: "没有找到卡",
      message: "未读取到身份证，请重新刷卡！",
      type: "warning"
    },
    11: {
      mean: "读卡操作失败",
      message: "未检测到二代身份证！",
      type: "error"
    },
    20: {
      mean: "自检失败",
      message: "二代身份证读取失败！",
      type: "error"
    },
    30: {
      mean: "其他错误",
      message: "二代身份证读取失败！",
      type: "error"
    },
    40: {
      mean: "相片解码失败",
      message: "二代身份证读取失败！",
      type: "error"
    },
    100: {
      mean: "超时",
      message: "未读取到身份证，请重新刷卡！",
      type: "warning"
    },
    200: {
      mean: "GetBase64PhotoData",
      message: "二代身份证读取失败！",
      type: "error"
    }
  },
  // 检查驱动
  // 检查浏览器
  // 调用服务处理数据
  checkDrive() {
    return new Promise((resolve, reject) => {
      axios({
        url: '/req' + "/ZKIDROnline/info",
        method: 'get'
      }).then(res => {
        if (res.data.ret == 0) {
          resolve(res.data.data.start)
        }
      }).catch(() => {
        console.log('未安装驱动...')
        this.downloadDrive()
      })
    })
  },

  // 设置身份证信息
  async setCertificateData() {
    let device = await this.checkDrive();
    console.log('安装了驱动', device)
    if (device) {
      return new Promise((resolve, reject) => {
        axios({
          url: '/req' + "/ZKIDROnline/ScanReadIdCardInfo?OP-DEV=1&CMD-URL=4&REPEAT=1&common=1" + "&random=" + this.getRandomNum(),
          method: 'get',
          responseType: 'text'
        }).then(res => {
          if (!res.data.dev) {
            let data = res.data.replace(/\\/g, "/");
            let result = JSON.parse(data);
            if (result.ret == 0) {
              resolve(result.Certificate)
            }
          } else if (this.interfaceResult[res.data.ret]) {
            message.error(this.interfaceResult[res.data.ret].message)
          }
        }).catch((err) => {
          this.downloadDrive()
        })
      })
    }
  },
  getRandomNum() {
    var random = parseInt(Math.random() * 10000);
    return random;
  },
  // 检查浏览器
  getBrowserType() {
    var browserFlag = "";
    //是否支持html5的cors跨域
    if (typeof (Worker) !== "undefined") {
      browserFlag = "html5";
    }
    //此处判断ie8、ie9
    else if (navigator.userAgent.indexOf("MSIE 7.0") > 0 || navigator.userAgent.indexOf("MSIE 8.0") > 0 || navigator.userAgent.indexOf("MSIE 9.0") > 0) {
      browserFlag = "simple";
    } else {
      browserFlag = "upgradeBrowser"; //当前浏览器不支持该功能,请升级浏览器
    }
    return browserFlag;
  },
  downloadDrive() {
    Modal.confirm({
      title: '请安装相关硬件驱动,点击确定下载！',
      content: "安装完成后电脑需重启，请保存您的工作",
      onOk() {
        window.location.href = "/middleware/ZKIDROnline.exe";
      },
      onCancel() {
        console.log('Cancel');
      },
      class: 'test',
    });
  },
  // 设置银行信息
  setBankData(file) {
    return new Promise((resolve, reject) => {
      const formData = new FormData()
      formData.append('file', file)
      axios({
        url: process.env.VUE_APP_API_BASE_URL + '/ocr/api/ocr/bank',
        method: 'post',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 0,
        data: formData
      }).then(res => {
        if (res.data.code == 0 && res.data.data.validated) {
          resolve(res.data.data)
        } else {
          message.error('信息识别失败')
        }
      }).catch((err) => {
        message.error('服务发生错误，请稍候重试')
      })
    })
  },

}