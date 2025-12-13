"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_http = require("../../utils/http.js");
const _sfc_main = {
  __name: "ForgetPassword",
  setup(__props) {
    const formData = common_vendor.ref({
      UserName: "",
      Password: "",
      PhoneNumber: ""
    });
    const resetPassword = async () => {
      if (!formData.value.UserName) {
        common_vendor.index.showToast({
          title: "请输入账户",
          icon: "none"
        });
        return;
      }
      if (!formData.value.PhoneNumber) {
        common_vendor.index.showToast({
          title: "请输入手机号",
          icon: "none"
        });
        return;
      }
      if (!formData.value.Password) {
        common_vendor.index.showToast({
          title: "请输入密码",
          icon: "none"
        });
        return;
      }
      const { Data, Success } = await utils_http.Post("/User/ForgetPassword", formData.value);
      if (Success) {
        common_vendor.index.showToast({
          title: "密码重置成功",
          icon: "success"
        });
        common_vendor.index.redirectTo({
          url: "/pages/Front/Login"
        });
      }
    };
    const toLogin = () => {
      common_vendor.index.redirectTo({
        url: "/pages/Front/Login"
      });
    };
    return (_ctx, _cache) => {
      return {
        a: formData.value.UserName,
        b: common_vendor.o(($event) => formData.value.UserName = $event.detail.value),
        c: formData.value.PhoneNumber,
        d: common_vendor.o(($event) => formData.value.PhoneNumber = $event.detail.value),
        e: formData.value.Password,
        f: common_vendor.o(($event) => formData.value.Password = $event.detail.value),
        g: common_vendor.o(resetPassword),
        h: common_vendor.o(toLogin)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-9ac447c2"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/Front/ForgetPassword.js.map
