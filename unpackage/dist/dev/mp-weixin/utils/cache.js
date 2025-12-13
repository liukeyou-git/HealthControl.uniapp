"use strict";
const common_vendor = require("../common/vendor.js");
const loginToken = "loginToken";
function SetLoginToken(value) {
  common_vendor.index.setStorageSync(loginToken, value);
}
function GetLoginToken() {
  return common_vendor.index.getStorageSync(loginToken);
}
function RemoveLoginToken() {
  common_vendor.index.removeStorageSync(loginToken);
}
exports.GetLoginToken = GetLoginToken;
exports.RemoveLoginToken = RemoveLoginToken;
exports.SetLoginToken = SetLoginToken;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/cache.js.map
