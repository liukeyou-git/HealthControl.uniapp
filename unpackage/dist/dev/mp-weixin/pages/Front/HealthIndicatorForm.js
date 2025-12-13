"use strict";
const common_vendor = require("../../common/vendor.js");
const store_index = require("../../store/index.js");
const utils_http = require("../../utils/http.js");
if (!Array) {
  const _easycom_uni_nav_bar2 = common_vendor.resolveComponent("uni-nav-bar");
  const _easycom_uni_easyinput2 = common_vendor.resolveComponent("uni-easyinput");
  const _easycom_uni_forms_item2 = common_vendor.resolveComponent("uni-forms-item");
  const _easycom_uni_tag2 = common_vendor.resolveComponent("uni-tag");
  const _easycom_upload_images2 = common_vendor.resolveComponent("upload-images");
  const _easycom_uni_forms2 = common_vendor.resolveComponent("uni-forms");
  const _easycom_uni_section2 = common_vendor.resolveComponent("uni-section");
  (_easycom_uni_nav_bar2 + _easycom_uni_easyinput2 + _easycom_uni_forms_item2 + _easycom_uni_tag2 + _easycom_upload_images2 + _easycom_uni_forms2 + _easycom_uni_section2)();
}
const _easycom_uni_nav_bar = () => "../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.js";
const _easycom_uni_easyinput = () => "../../uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.js";
const _easycom_uni_forms_item = () => "../../uni_modules/uni-forms/components/uni-forms-item/uni-forms-item.js";
const _easycom_uni_tag = () => "../../uni_modules/uni-tag/components/uni-tag/uni-tag.js";
const _easycom_upload_images = () => "../../components/upload-images/upload-images.js";
const _easycom_uni_forms = () => "../../uni_modules/uni-forms/components/uni-forms/uni-forms.js";
const _easycom_uni_section = () => "../../uni_modules/uni-section/components/uni-section/uni-section.js";
if (!Math) {
  (_easycom_uni_nav_bar + _easycom_uni_easyinput + _easycom_uni_forms_item + _easycom_uni_tag + _easycom_upload_images + _easycom_uni_forms + _easycom_uni_section)();
}
const _sfc_main = {
  __name: "HealthIndicatorForm",
  setup(__props) {
    const commonStore = store_index.useCommonStore();
    common_vendor.computed(() => commonStore.Token);
    common_vendor.computed(() => commonStore.UserInfo);
    common_vendor.computed(() => commonStore.RoleType);
    const UserId = common_vendor.computed(() => commonStore.UserId);
    const pageTitle = common_vendor.computed(() => {
      return Id.value ? "编辑健康指标信息" : "新建健康指标信息";
    });
    const formData = common_vendor.reactive({});
    const editModalForm = common_vendor.ref(null);
    const Id = common_vendor.ref(null);
    const editModalFormRules = {
      Name: {
        rules: [
          {
            required: true,
            errorMessage: "该项为必填项"
          }
        ]
      },
      BelongUserId: {
        rules: [
          {
            required: true,
            errorMessage: "该项为必填项"
          }
        ]
      },
      HealthIndicatorTypeId: {
        rules: [
          {
            required: true,
            errorMessage: "该项为必填项"
          }
        ]
      },
      HealthIndicatorTypeName: {
        rules: [
          {
            required: true,
            errorMessage: "请选择或输入指标归类"
          },
          {
            validator: (rule, value, callback) => {
              if (!value || value.trim() === "") {
                callback(new Error("指标归类不能为空"));
                return;
              }
              callback();
            },
            errorMessage: "指标归类不能为空"
          }
        ]
      },
      Cover: {
        rules: [
          {
            required: true,
            errorMessage: "该项为必填项"
          }
        ]
      },
      IsComm: {
        rules: [
          {
            required: true,
            errorMessage: "该项为必填项"
          }
        ]
      },
      Threshold: {
        rules: [
          {
            required: true,
            errorMessage: "该项为必填项"
          },
          {
            validator: (rule, value, callback) => {
              if (!value) {
                callback();
                return;
              }
              const rangePattern = /^\d+(\.\d+)?-\d+(\.\d+)?$/;
              const greaterPattern = /^>\d+(\.\d+)?$/;
              const lessPattern = /^<\d+(\.\d+)?$/;
              if (rangePattern.test(value) || greaterPattern.test(value) || lessPattern.test(value)) {
                if (rangePattern.test(value)) {
                  const [start, end] = value.split("-").map(Number);
                  if (start >= end) {
                    callback(new Error("范围格式中前面的数值应小于后面的数值"));
                    return;
                  }
                }
                callback();
              } else {
                callback(new Error("格式错误，请输入：范围(3.4-17.1) 或 大于(>1.04) 或 小于(<3.4)"));
              }
            },
            errorMessage: "阈值格式不正确"
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
      }
    };
    common_vendor.onLoad(async (option) => {
      Id.value = option.Id;
      await GetUserHealthIndicatorTypeApi();
      if (Id.value) {
        await ShowEditModal(Id.value);
      } else {
        Object.assign(formData, {
          BelongUserId: UserId.value,
          IsComm: false
        });
        common_vendor.nextTick$1(() => {
          editModalForm.value.setRules(editModalFormRules);
        });
      }
    });
    common_vendor.onShow(async () => {
    });
    common_vendor.onReady(async () => {
    });
    const UserHealthIndicatorTypeList = common_vendor.ref([]);
    const customTypeName = common_vendor.ref("");
    const selectExistingType = (item) => {
      formData.HealthIndicatorTypeId = item.Id;
      formData.HealthIndicatorTypeName = item.Name;
      customTypeName.value = "";
    };
    const selectCustomType = () => {
      if (customTypeName.value && customTypeName.value.trim()) {
        formData.HealthIndicatorTypeId = null;
        formData.HealthIndicatorTypeName = customTypeName.value.trim();
      }
    };
    const onCustomTypeInput = (value) => {
      customTypeName.value = value;
    };
    const onCustomTypeBlur = () => {
    };
    const GetUserHealthIndicatorTypeApi = async () => {
      const { Data: { Items } } = await utils_http.Post(`/HealthIndicatorType/List`, {
        BelongUserId: UserId.value
      });
      UserHealthIndicatorTypeList.value = Items;
    };
    const ShowEditModal = async (Id2) => {
      const { Data } = await utils_http.Post(`/HealthIndicator/Get`, { Id: Id2 });
      Object.assign(formData, Data);
      if (Data.HealthIndicatorTypeId && UserHealthIndicatorTypeList.value.length > 0) {
        const healthIndicatorType = UserHealthIndicatorTypeList.value.find((item) => item.Id === Data.HealthIndicatorTypeId);
        if (healthIndicatorType) {
          formData.HealthIndicatorTypeName = healthIndicatorType.Name;
        }
      }
      common_vendor.nextTick$1(() => {
        editModalForm.value.setRules(editModalFormRules);
      });
    };
    const goBack = () => {
      common_vendor.index.navigateBack();
    };
    const createOrEditAsync = async () => {
      editModalForm.value.validate().then(async (res) => {
        common_vendor.index.showModal({
          title: "提示",
          content: "你确定要操作吗?",
          showCancel: true,
          cancelText: "取消",
          confirmText: "确定",
          success: async (res2) => {
            if (res2.confirm) {
              try {
                let { Data, Success } = await utils_http.Post("/HealthIndicator/UserCreateOrEditIndicator", formData);
                if (Success) {
                  common_vendor.index.showToast({
                    title: "操作成功",
                    icon: "success"
                  });
                  common_vendor.index.navigateBack();
                }
              } catch (error) {
                common_vendor.index.showToast({
                  title: "操作失败",
                  icon: "none"
                });
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
      return common_vendor.e({
        a: common_vendor.o(goBack),
        b: common_vendor.p({
          dark: true,
          fixed: true,
          shadow: true,
          ["background-color"]: "var(--primary-color)",
          ["status-bar"]: true,
          ["left-icon"]: "left",
          ["left-text"]: "返回",
          title: pageTitle.value
        }),
        c: common_vendor.o(($event) => formData.Name = $event),
        d: common_vendor.p({
          placeholder: "请输入指标名称",
          primaryColor: "var(--primary-color)",
          modelValue: formData.Name
        }),
        e: common_vendor.p({
          label: "指标名称",
          required: true,
          name: "Name"
        }),
        f: common_vendor.f(UserHealthIndicatorTypeList.value, (item, k0, i0) => {
          return {
            a: item.Id,
            b: common_vendor.o(($event) => selectExistingType(item), item.Id),
            c: "8a16d654-6-" + i0 + ",8a16d654-5",
            d: common_vendor.p({
              text: item.Name,
              type: formData.HealthIndicatorTypeId === item.Id ? "primary" : "default",
              inverted: formData.HealthIndicatorTypeId === item.Id,
              size: "normal"
            })
          };
        }),
        g: common_vendor.o(onCustomTypeInput),
        h: common_vendor.o(onCustomTypeBlur),
        i: common_vendor.o(($event) => customTypeName.value = $event),
        j: common_vendor.p({
          placeholder: "输入新的指标归类",
          primaryColor: "var(--primary-color)",
          modelValue: customTypeName.value
        }),
        k: customTypeName.value && customTypeName.value.trim()
      }, customTypeName.value && customTypeName.value.trim() ? {
        l: common_vendor.o(selectCustomType)
      } : {}, {
        m: formData.HealthIndicatorTypeName
      }, formData.HealthIndicatorTypeName ? {
        n: common_vendor.t(formData.HealthIndicatorTypeName)
      } : {}, {
        o: common_vendor.p({
          label: "指标归类",
          required: true,
          name: "HealthIndicatorTypeName"
        }),
        p: common_vendor.o(($event) => formData.Cover = $event),
        q: common_vendor.p({
          limit: 1,
          modelValue: formData.Cover
        }),
        r: common_vendor.p({
          label: "封面",
          required: true,
          name: "Cover"
        }),
        s: common_vendor.o(($event) => formData.Threshold = $event),
        t: common_vendor.p({
          placeholder: "范围格式：3.4-17.1 或 >1.04 或 <3.4",
          primaryColor: "var(--primary-color)",
          modelValue: formData.Threshold
        }),
        v: common_vendor.p({
          label: "阈值",
          required: true,
          name: "Threshold"
        }),
        w: common_vendor.o(($event) => formData.Content = $event),
        x: common_vendor.p({
          type: "textarea",
          placeholder: "请输入描述内容",
          primaryColor: "var(--primary-color)",
          modelValue: formData.Content
        }),
        y: common_vendor.p({
          label: "描述内容",
          required: true,
          name: "Content"
        }),
        z: common_vendor.sr(editModalForm, "8a16d654-2,8a16d654-1", {
          "k": "editModalForm"
        }),
        A: common_vendor.p({
          model: formData,
          rules: editModalFormRules,
          ["label-width"]: "100",
          ["label-position"]: "top"
        }),
        B: common_vendor.o(createOrEditAsync),
        C: common_vendor.p({
          title: "请填写健康指标信息"
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-8a16d654"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/Front/HealthIndicatorForm.js.map
