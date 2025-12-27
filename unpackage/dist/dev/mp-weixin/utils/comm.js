"use strict";
const common_vendor = require("../common/vendor.js");
function GetFileNameByPath(path) {
  if (!path) {
    return "";
  }
  var pos1 = path.lastIndexOf("/");
  var pos2 = path.lastIndexOf("\\");
  var pos = Math.max(pos1, pos2);
  if (pos < 0) {
    return path;
  } else {
    return path.substring(pos + 1);
  }
}
function GetFileTypeByPath(path) {
  if (!path) {
    return "";
  }
  var pos = path.lastIndexOf(".");
  if (pos < 0) {
    return "";
  } else {
    return path.substring(pos + 1);
  }
}
function ConvertArray(value = "", cutting = ",") {
  if (!value) {
    return [];
  }
  return value.split(cutting);
}
function FullConvertUrlArray(value = "", cutting = ",") {
  var arr = ConvertArray(value, cutting);
  return arr.map((x) => {
    return {
      url: x,
      name: GetFileNameByPath(x),
      type: GetFileTypeByPath(x)
    };
  });
}
function GetObjectValue(obj, name) {
  if (!name) {
    return void 0;
  }
  if (!obj) {
    return void 0;
  }
  if (name.indexOf(".") != -1) {
    var array = name.split(".");
    var value = obj;
    array.forEach((item) => {
      value = value[`${item}`];
    });
    return value;
  } else {
    return obj[`${name}`];
  }
}
function GetFormatFullDate(date) {
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let hour = date.getHours();
  let minutes = date.getMinutes();
  let seconds = date.getSeconds();
  month = month < 10 ? "0" + month : month;
  day = day < 10 ? "0" + day : day;
  hour = hour < 10 ? "0" + hour : hour;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;
  let currentDate = year + "-" + month + "-" + day + " " + hour + ":" + minutes + ":" + seconds;
  return currentDate;
}
function ChooseImageAsync(count = 1) {
  return new Promise((resolve, reject) => {
    common_vendor.index.chooseImage({
      count,
      //默认9
      sizeType: ["original", "compressed"],
      //可以指定是原图还是压缩图，默认二者都有
      sourceType: ["album", "camera"],
      //从相册选择
      success: (res) => {
        resolve(res);
      }
    });
  });
}
function GetLoginCode(count = 1) {
  return new Promise((resolve, reject) => {
    common_vendor.index.__f__("log", "at utils/comm.js:211", "aa");
    common_vendor.index.login({
      provider: "weixin",
      onlyAuthorize: true,
      // 微信登录仅请求授权认证
      success: function(event) {
        common_vendor.index.__f__("log", "at utils/comm.js:216", "得到登录的code", event.code);
        resolve(event.code);
      },
      fail: function(err) {
        common_vendor.index.__f__("log", "at utils/comm.js:220", "获取微信的登录状态code失败", err);
        reject(code);
      }
    });
  });
}
exports.ChooseImageAsync = ChooseImageAsync;
exports.FullConvertUrlArray = FullConvertUrlArray;
exports.GetFormatFullDate = GetFormatFullDate;
exports.GetLoginCode = GetLoginCode;
exports.GetObjectValue = GetObjectValue;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/comm.js.map
