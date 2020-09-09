export default {
  validatePhone(rule, value, callback) {
    if (!value) {
      callback()
    } else {
      if (new RegExp(/^1[3|4|5|7|8|9][0-9]\d{8}$/).test(value)) {
        callback();
      } else {
        callback("请输入正确格式的手机号码!");
      }
    }
  }
}