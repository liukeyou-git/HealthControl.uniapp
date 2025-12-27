"use strict";
const common_vendor = require("../../common/vendor.js");
const store_index = require("../../store/index.js");
const utils_http = require("../../utils/http.js");
if (!Array) {
  const _easycom_uni_nav_bar2 = common_vendor.resolveComponent("uni-nav-bar");
  const _easycom_uni_easyinput2 = common_vendor.resolveComponent("uni-easyinput");
  const _easycom_uni_forms_item2 = common_vendor.resolveComponent("uni-forms-item");
  const _easycom_sigle_select2 = common_vendor.resolveComponent("sigle-select");
  const _easycom_upload_images2 = common_vendor.resolveComponent("upload-images");
  const _easycom_rich_text_edit2 = common_vendor.resolveComponent("rich-text-edit");
  const _easycom_uni_forms2 = common_vendor.resolveComponent("uni-forms");
  const _easycom_uni_section2 = common_vendor.resolveComponent("uni-section");
  (_easycom_uni_nav_bar2 + _easycom_uni_easyinput2 + _easycom_uni_forms_item2 + _easycom_sigle_select2 + _easycom_upload_images2 + _easycom_rich_text_edit2 + _easycom_uni_forms2 + _easycom_uni_section2)();
}
const _easycom_uni_nav_bar = () => "../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.js";
const _easycom_uni_easyinput = () => "../../uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.js";
const _easycom_uni_forms_item = () => "../../uni_modules/uni-forms/components/uni-forms-item/uni-forms-item.js";
const _easycom_sigle_select = () => "../../components/sigle-select/sigle-select.js";
const _easycom_upload_images = () => "../../components/upload-images/upload-images.js";
const _easycom_rich_text_edit = () => "../../components/rich-text-edit/rich-text-edit.js";
const _easycom_uni_forms = () => "../../uni_modules/uni-forms/components/uni-forms/uni-forms.js";
const _easycom_uni_section = () => "../../uni_modules/uni-section/components/uni-section/uni-section.js";
if (!Math) {
  (_easycom_uni_nav_bar + _easycom_uni_easyinput + _easycom_uni_forms_item + _easycom_sigle_select + _easycom_upload_images + _easycom_rich_text_edit + _easycom_uni_forms + _easycom_uni_section)();
}
const _sfc_main = {
  __name: "HealthArticleForm",
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
      HealthArticleTypeId: {
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
      AuditUserId: {
        rules: [
          {
            required: true,
            errorMessage: "该项为必填项"
          }
        ]
      },
      AuditStatus: {
        rules: [
          {
            required: true,
            errorMessage: "该项为必填项"
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
      ViewCount: {
        rules: [
          {
            required: true,
            errorMessage: "该项为必填项"
          }
        ]
      },
      AuditTime: {
        rules: [
          {
            required: true,
            errorMessage: "该项为必填项"
          }
        ]
      }
    };
    const ContentRichTextEditRef = common_vendor.ref(null);
    common_vendor.onLoad(async (option) => {
      Id.value = option.Id;
      ShowEditModal(Id.value);
    });
    common_vendor.onShow(async () => {
    });
    common_vendor.onReady(async () => {
    });
    const ShowEditModal = async (Id2) => {
      const { Data } = await utils_http.Post(`/HealthArticle/Get`, { Id: Id2 });
      if (!Id2) {
        Data.PublishUserId = UserId.value;
        Data.AuditStatus = 1;
      }
      Object.assign(formData, Data);
      if (ContentRichTextEditRef.value) {
        ContentRichTextEditRef.value.setContent(Data.Content);
      }
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
              formData.Content = await ContentRichTextEditRef.value.getContent();
              if (!formData.Content) {
                common_vendor.index.showToast({
                  title: "请输入内容",
                  icon: "none"
                });
                return;
              }
              let { Data, Success } = await utils_http.Post("/HealthArticle/CreateOrEdit", formData);
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
          title: "健康知识信息"
        }),
        c: common_vendor.o(($event) => formData.Title = $event),
        d: common_vendor.p({
          placeholder: "请输入标题",
          primaryColor: "var(--primary-color)",
          modelValue: formData.Title
        }),
        e: common_vendor.p({
          label: "标题",
          required: true,
          name: "Title"
        }),
        f: common_vendor.o(($event) => formData.HealthArticleTypeId = $event),
        g: common_vendor.p({
          url: "/HealthArticleType/List",
          columnName: "Name",
          columnValue: "Id",
          modelValue: formData.HealthArticleTypeId
        }),
        h: common_vendor.p({
          label: "分类",
          required: true,
          name: "HealthArticleTypeId"
        }),
        i: common_vendor.o(($event) => formData.Cover = $event),
        j: common_vendor.p({
          modelValue: formData.Cover
        }),
        k: common_vendor.p({
          label: "封面",
          required: true,
          name: "Cover"
        }),
        l: common_vendor.sr(ContentRichTextEditRef, "2c18ed1a-10,2c18ed1a-9", {
          "k": "ContentRichTextEditRef"
        }),
        m: common_vendor.o(($event) => formData.Content = $event),
        n: common_vendor.p({
          modelValue: formData.Content
        }),
        o: common_vendor.p({
          label: "内容",
          name: "Content"
        }),
        p: common_vendor.sr(editModalForm, "2c18ed1a-2,2c18ed1a-1", {
          "k": "editModalForm"
        }),
        q: common_vendor.p({
          model: formData,
          rules: editModalFormRules,
          ["label-width"]: "100",
          ["label-position"]: "top"
        }),
        r: common_vendor.o(createOrEditAsync),
        s: common_vendor.p({
          title: "请填写健康知识信息"
        })
      };
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/Front/HealthArticleForm.js.map
