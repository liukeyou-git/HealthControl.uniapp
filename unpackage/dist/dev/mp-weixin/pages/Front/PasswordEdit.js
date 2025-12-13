"use strict";
const common_vendor = require("../../common/vendor.js");
const store_index = require("../../store/index.js");
const utils_http = require("../../utils/http.js");
if (!Array) {
  const _easycom_uni_nav_bar2 = common_vendor.resolveComponent("uni-nav-bar");
  const _easycom_uni_easyinput2 = common_vendor.resolveComponent("uni-easyinput");
  const _easycom_uni_forms_item2 = common_vendor.resolveComponent("uni-forms-item");
  const _easycom_uni_forms2 = common_vendor.resolveComponent("uni-forms");
  const _easycom_uni_section2 = common_vendor.resolveComponent("uni-section");
  (_easycom_uni_nav_bar2 + _easycom_uni_easyinput2 + _easycom_uni_forms_item2 + _easycom_uni_forms2 + _easycom_uni_section2)();
}
const _easycom_uni_nav_bar = () => "../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.js";
const _easycom_uni_easyinput = () => "../../uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.js";
const _easycom_uni_forms_item = () => "../../uni_modules/uni-forms/components/uni-forms-item/uni-forms-item.js";
const _easycom_uni_forms = () => "../../uni_modules/uni-forms/components/uni-forms/uni-forms.js";
const _easycom_uni_section = () => "../../uni_modules/uni-section/components/uni-section/uni-section.js";
if (!Math) {
  (_easycom_uni_nav_bar + _easycom_uni_easyinput + _easycom_uni_forms_item + _easycom_uni_forms + _easycom_uni_section)();
}
const _sfc_main = {
  __name: "PasswordEdit",
  setup(__props) {
    const commonStore = store_index.useCommonStore();
    const editModalForm = common_vendor.ref(null);
    const formData = common_vendor.reactive({
      OrginPassword: "",
      NewPassword: "",
      TwoPassword: ""
    });
    const rules = {
      OrginPassword: {
        rules: [{
          required: true,
          errorMessage: "请输入原始密码"
        }]
      },
      NewPassword: {
        rules: [{
          required: true,
          errorMessage: "请输入新密码"
        }]
      },
      TwoPassword: {
        rules: [{
          required: true,
          errorMessage: "请再次输入新密码"
        }]
      }
    };
    common_vendor.computed(() => commonStore.Token);
    common_vendor.computed(() => commonStore.UserInfo);
    common_vendor.computed(() => commonStore.RoleType);
    const UserId = common_vendor.computed(() => commonStore.UserId);
    const goBack = () => {
      common_vendor.index.navigateBack();
    };
    const createOrEdit = async () => {
      editModalForm.value.validate().then(async (res) => {
        const updatedUserInfo = {
          Id: UserId.value,
          OrginPassword: formData.OrginPassword,
          Password: formData.TwoPassword
        };
        const { Success } = await utils_http.Post("/User/ChangePassword", updatedUserInfo);
        if (Success) {
          await commonStore.Logout();
        }
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(goBack),
        b: common_vendor.p({
          dark: true,
          fixed: true,
          shadow: true,
          ["background-color"]: "var(--primary-color)",
          ["status-bar"]: true,
          ["left-icon"]: "left",
          ["left-text"]: "返回",
          title: "修改密码"
        }),
        c: common_vendor.o(($event) => formData.OrginPassword = $event),
        d: common_vendor.p({
          type: "password",
          placeholder: "请输入原始密码",
          modelValue: formData.OrginPassword
        }),
        e: common_vendor.p({
          label: "原始密码",
          required: true,
          name: "OrginPassword"
        }),
        f: common_vendor.o(($event) => formData.NewPassword = $event),
        g: common_vendor.p({
          type: "password",
          placeholder: "请输入新密码",
          modelValue: formData.NewPassword
        }),
        h: common_vendor.p({
          label: "新密码",
          required: true,
          name: "NewPassword"
        }),
        i: common_vendor.o(($event) => formData.TwoPassword = $event),
        j: common_vendor.p({
          type: "password",
          placeholder: "请再次输入新密码",
          modelValue: formData.TwoPassword
        }),
        k: common_vendor.p({
          label: "确认密码",
          required: true,
          name: "TwoPassword"
        }),
        l: common_vendor.sr(editModalForm, "76190189-2,76190189-1", {
          "k": "editModalForm"
        }),
        m: common_vendor.p({
          model: formData,
          rules,
          ["label-width"]: "100",
          ["label-position"]: "top"
        }),
        n: common_vendor.o(createOrEdit),
        o: common_vendor.p({
          title: "修改密码"
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-76190189"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/Front/PasswordEdit.js.map
