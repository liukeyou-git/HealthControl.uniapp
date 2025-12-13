"use strict";
const common_vendor = require("../../common/vendor.js");
const store_index = require("../../store/index.js");
const utils_http = require("../../utils/http.js");
if (!Array) {
  const _easycom_uni_nav_bar2 = common_vendor.resolveComponent("uni-nav-bar");
  const _easycom_uni_easyinput2 = common_vendor.resolveComponent("uni-easyinput");
  const _easycom_uni_forms_item2 = common_vendor.resolveComponent("uni-forms-item");
  const _easycom_uni_datetime_picker2 = common_vendor.resolveComponent("uni-datetime-picker");
  const _easycom_upload_images2 = common_vendor.resolveComponent("upload-images");
  const _easycom_uni_forms2 = common_vendor.resolveComponent("uni-forms");
  const _easycom_uni_section2 = common_vendor.resolveComponent("uni-section");
  (_easycom_uni_nav_bar2 + _easycom_uni_easyinput2 + _easycom_uni_forms_item2 + _easycom_uni_datetime_picker2 + _easycom_upload_images2 + _easycom_uni_forms2 + _easycom_uni_section2)();
}
const _easycom_uni_nav_bar = () => "../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.js";
const _easycom_uni_easyinput = () => "../../uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.js";
const _easycom_uni_forms_item = () => "../../uni_modules/uni-forms/components/uni-forms-item/uni-forms-item.js";
const _easycom_uni_datetime_picker = () => "../../uni_modules/uni-datetime-picker/components/uni-datetime-picker/uni-datetime-picker.js";
const _easycom_upload_images = () => "../../components/upload-images/upload-images.js";
const _easycom_uni_forms = () => "../../uni_modules/uni-forms/components/uni-forms/uni-forms.js";
const _easycom_uni_section = () => "../../uni_modules/uni-section/components/uni-section/uni-section.js";
if (!Math) {
  (_easycom_uni_nav_bar + _easycom_uni_easyinput + _easycom_uni_forms_item + _easycom_uni_datetime_picker + _easycom_upload_images + _easycom_uni_forms + _easycom_uni_section)();
}
const _sfc_main = {
  __name: "UserInfoEdit",
  setup(__props) {
    const commonStore = store_index.useCommonStore();
    common_vendor.computed(() => commonStore.Token);
    common_vendor.computed(() => commonStore.UserInfo);
    common_vendor.computed(() => commonStore.RoleType);
    common_vendor.computed(() => commonStore.UserId);
    const formData = common_vendor.reactive({});
    const editModalForm = common_vendor.ref(null);
    const editModalFormRules = {
      Name: {
        rules: [{
          required: true,
          errorMessage: "该项为必填项"
        }]
      },
      Email: {
        rules: [{
          required: true,
          errorMessage: "该项为必填项"
        }]
      },
      PhoneNumber: {
        rules: [{
          required: true,
          errorMessage: "该项为必填项"
        }]
      },
      Birth: {
        rules: [{
          required: true,
          errorMessage: "该项为必填项"
        }]
      },
      ImageUrls: {
        rules: [{
          required: true,
          errorMessage: "该项为必填项"
        }]
      }
    };
    common_vendor.onLoad(async () => {
      let { Data } = await commonStore.GetInfo();
      Object.assign(formData, Data);
      editModalForm.value.setRules(editModalFormRules);
    });
    common_vendor.onShow(async () => {
    });
    const goBack = () => {
      common_vendor.index.navigateBack();
    };
    const createOrEditAsync = async () => {
      editModalForm.value.validate().then((res) => {
        common_vendor.index.showModal({
          title: "提示",
          content: "你确定要操作吗?",
          showCancel: true,
          cancelText: "取消",
          confirmText: "确定",
          success: async (res2) => {
            if (res2.confirm) {
              let { Data, Success } = await utils_http.Post("/User/CreateOrEdit", formData);
              if (Success) {
                common_vendor.index.showToast({
                  title: "操作成功",
                  icon: "success"
                });
                await commonStore.GetInfo();
                common_vendor.index.navigateBack();
              }
            }
          }
        });
      }).catch((err) => {
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
          title: "修改个人信息"
        }),
        c: common_vendor.o(($event) => formData.Name = $event),
        d: common_vendor.p({
          placeholder: "请输入姓名",
          primaryColor: "var(--primary-color)",
          modelValue: formData.Name
        }),
        e: common_vendor.p({
          label: "名称",
          required: true,
          name: "Name"
        }),
        f: common_vendor.o(($event) => formData.Email = $event),
        g: common_vendor.p({
          placeholder: "请输入邮箱",
          primaryColor: "var(--primary-color)",
          modelValue: formData.Email
        }),
        h: common_vendor.p({
          label: "邮箱",
          required: true,
          name: "Email"
        }),
        i: common_vendor.o(($event) => formData.PhoneNumber = $event),
        j: common_vendor.p({
          placeholder: "请输入手机号码",
          primaryColor: "var(--primary-color)",
          modelValue: formData.PhoneNumber
        }),
        k: common_vendor.p({
          label: "手机号码",
          required: true,
          name: "PhoneNumber"
        }),
        l: common_vendor.o(($event) => formData.Birth = $event),
        m: common_vendor.p({
          type: "datetime",
          ["return-type"]: "string",
          format: "yyyy-MM-dd HH:mm:ss",
          primaryColor: "var(--primary-color)",
          modelValue: formData.Birth
        }),
        n: common_vendor.p({
          label: "出生时间",
          required: true,
          name: "Birth"
        }),
        o: common_vendor.o(($event) => formData.ImageUrls = $event),
        p: common_vendor.p({
          limit: 1,
          modelValue: formData.ImageUrls
        }),
        q: common_vendor.p({
          label: "上传头像",
          name: "ImageUrls"
        }),
        r: common_vendor.sr(editModalForm, "8c917684-2,8c917684-1", {
          "k": "editModalForm"
        }),
        s: common_vendor.p({
          model: formData,
          rules: editModalFormRules,
          ["label-width"]: "100",
          ["label-position"]: "top"
        }),
        t: common_vendor.o(createOrEditAsync),
        v: common_vendor.p({
          title: "请填写用户信息"
        })
      };
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/Front/UserInfoEdit.js.map
