"use strict";
const common_vendor = require("../../common/vendor.js");
const store_index = require("../../store/index.js");
const utils_http = require("../../utils/http.js");
if (!Array) {
  const _easycom_uni_nav_bar2 = common_vendor.resolveComponent("uni-nav-bar");
  const _easycom_uni_easyinput2 = common_vendor.resolveComponent("uni-easyinput");
  const _easycom_uni_forms_item2 = common_vendor.resolveComponent("uni-forms-item");
  const _easycom_uni_datetime_picker2 = common_vendor.resolveComponent("uni-datetime-picker");
  const _easycom_uni_data_picker2 = common_vendor.resolveComponent("uni-data-picker");
  const _easycom_uni_forms2 = common_vendor.resolveComponent("uni-forms");
  (_easycom_uni_nav_bar2 + _easycom_uni_easyinput2 + _easycom_uni_forms_item2 + _easycom_uni_datetime_picker2 + _easycom_uni_data_picker2 + _easycom_uni_forms2)();
}
const _easycom_uni_nav_bar = () => "../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.js";
const _easycom_uni_easyinput = () => "../../uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.js";
const _easycom_uni_forms_item = () => "../../uni_modules/uni-forms/components/uni-forms-item/uni-forms-item.js";
const _easycom_uni_datetime_picker = () => "../../uni_modules/uni-datetime-picker/components/uni-datetime-picker/uni-datetime-picker.js";
const _easycom_uni_data_picker = () => "../../uni_modules/uni-data-picker/components/uni-data-picker/uni-data-picker.js";
const _easycom_uni_forms = () => "../../uni_modules/uni-forms/components/uni-forms/uni-forms.js";
if (!Math) {
  (_easycom_uni_nav_bar + _easycom_uni_easyinput + _easycom_uni_forms_item + _easycom_uni_datetime_picker + _easycom_uni_data_picker + _easycom_uni_forms)();
}
const _sfc_main = {
  __name: "HealthNoticeForm",
  setup(__props) {
    const commonStore = store_index.useCommonStore();
    common_vendor.computed(() => commonStore.Token);
    common_vendor.computed(() => commonStore.UserInfo);
    common_vendor.computed(() => commonStore.RoleType);
    const UserId = common_vendor.computed(() => commonStore.UserId);
    const formData = common_vendor.reactive({});
    const editModalForm = common_vendor.ref(null);
    const Id = common_vendor.ref(null);
    const editModalFormRules = {
      Title: {
        rules: [
          {
            required: true,
            errorMessage: "该项为必填项"
          }
        ]
      },
      PublishUserId: {
        rules: [
          {
            required: true,
            errorMessage: "该项为必填项"
          }
        ]
      },
      Num: {
        rules: [
          {
            required: true,
            errorMessage: "该项为必填项"
          }
        ]
      },
      RemindTime: {
        rules: [
          {
            required: true,
            errorMessage: "该项为必填项"
          }
        ]
      },
      IsRemind: {
        rules: [
          {
            required: true,
            errorMessage: "该项为必填项"
          }
        ]
      },
      Content: {
        rules: [
          {
            required: true,
            errorMessage: "该项为必填项"
          }
        ]
      },
      RemindType: {
        rules: [
          {
            required: true,
            errorMessage: "该项为必填项"
          }
        ]
      }
    };
    common_vendor.onLoad(async (option) => {
      Id.value = option.Id;
      ShowEditModal(Id.value);
    });
    common_vendor.onShow(async () => {
    });
    common_vendor.onReady(async () => {
    });
    const ShowEditModal = async (Id2) => {
      const { Data } = await utils_http.Post(`/HealthNotice/Get`, { Id: Id2 });
      if (!Id2) {
        Data.IsRemind = false;
        Data.PublishUserId = UserId.value;
        Data.Num = 1;
      }
      Object.assign(formData, Data);
      common_vendor.nextTick$1(() => {
        editModalForm.value.setRules(editModalFormRules);
      });
    };
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
              let { Data, Success } = await utils_http.Post("/HealthNotice/CreateOrEdit", formData);
              if (Success) {
                common_vendor.index.showToast({
                  title: "操作成功",
                  icon: "success"
                });
                common_vendor.index.navigateBack();
              }
            }
          }
        });
      }).catch((err) => {
        common_vendor.index.showToast({
          title: "请检测输入项是否正确",
          icon: "none"
        });
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
          title: "健康提醒信息"
        }),
        c: common_vendor.o(($event) => formData.Title = $event),
        d: common_vendor.p({
          placeholder: "请输入提醒标题",
          primaryColor: "var(--primary-color)",
          modelValue: formData.Title
        }),
        e: common_vendor.p({
          label: "提醒标题",
          required: true,
          name: "Title"
        }),
        f: common_vendor.o(($event) => formData.Content = $event),
        g: common_vendor.p({
          type: "textarea",
          placeholder: "请输入提醒内容",
          primaryColor: "var(--primary-color)",
          modelValue: formData.Content
        }),
        h: common_vendor.p({
          label: "提醒内容",
          required: true,
          name: "Content"
        }),
        i: common_vendor.o(($event) => formData.RemindTime = $event),
        j: common_vendor.p({
          type: "datetime",
          ["return-type"]: "string",
          primaryColor: "var(--primary-color)",
          modelValue: formData.RemindTime
        }),
        k: common_vendor.p({
          label: "提醒时间",
          required: true,
          name: "RemindTime"
        }),
        l: common_vendor.o(($event) => formData.RemindType = $event),
        m: common_vendor.p({
          localdata: [{
            text: "邮件",
            value: "邮件"
          }],
          modelValue: formData.RemindType
        }),
        n: common_vendor.p({
          label: "提醒方式",
          required: true,
          name: "RemindType"
        }),
        o: common_vendor.sr(editModalForm, "0aeddf02-1", {
          "k": "editModalForm"
        }),
        p: common_vendor.p({
          model: formData,
          rules: editModalFormRules,
          ["label-width"]: "100",
          ["label-position"]: "top"
        }),
        q: common_vendor.o(createOrEditAsync)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-0aeddf02"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/Front/HealthNoticeForm.js.map
