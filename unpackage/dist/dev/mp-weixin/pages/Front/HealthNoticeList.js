"use strict";
const common_vendor = require("../../common/vendor.js");
const store_index = require("../../store/index.js");
const utils_http = require("../../utils/http.js");
if (!Array) {
  const _easycom_uni_nav_bar2 = common_vendor.resolveComponent("uni-nav-bar");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  (_easycom_uni_nav_bar2 + _easycom_uni_icons2)();
}
const _easycom_uni_nav_bar = () => "../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.js";
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  (_easycom_uni_nav_bar + _easycom_uni_icons)();
}
const _sfc_main = {
  __name: "HealthNoticeList",
  setup(__props) {
    const commonStore = store_index.useCommonStore();
    common_vendor.computed(() => commonStore.Token);
    common_vendor.computed(() => commonStore.UserInfo);
    common_vendor.computed(() => commonStore.RoleType);
    common_vendor.computed(() => commonStore.UserId);
    const HealthNoticeList = common_vendor.ref([]);
    const where = common_vendor.reactive({
      PageIndex: 1,
      PageSize: 100
    });
    common_vendor.onLoad(async (option) => {
    });
    common_vendor.onShow(async () => {
      GetHealthNoticeListApi();
    });
    common_vendor.onReady(async () => {
    });
    const goBack = () => {
      common_vendor.index.navigateBack();
    };
    const goToAdd = () => {
      common_vendor.index.navigateTo({
        url: "/pages/Front/HealthNoticeForm"
      });
    };
    const goToEdit = (Id) => {
      common_vendor.index.navigateTo({
        url: `/pages/Front/HealthNoticeForm?Id=${Id}`
      });
    };
    const GetHealthNoticeListApi = async () => {
      try {
        let {
          Data: {
            Items
          }
        } = await utils_http.Post("/HealthNotice/List", where);
        HealthNoticeList.value = Items || [];
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/Front/HealthNoticeList.vue:136", "获取健康提醒列表失败:", error);
        HealthNoticeList.value = [];
      }
    };
    const ShowDeleteModal = async (Id) => {
      common_vendor.index.showModal({
        title: "确认删除",
        content: "确认删除该健康提醒吗？",
        confirmText: "删除",
        confirmColor: "var(--primary-color)",
        success: async (res) => {
          if (res.confirm) {
            try {
              const { Success } = await utils_http.Post(`/HealthNotice/Delete`, { Id });
              if (Success) {
                await GetHealthNoticeListApi();
                common_vendor.index.showToast({
                  title: "删除成功",
                  icon: "success"
                });
              }
            } catch (error) {
              common_vendor.index.__f__("error", "at pages/Front/HealthNoticeList.vue:160", "删除失败:", error);
              common_vendor.index.showToast({
                title: "删除失败",
                icon: "error"
              });
            }
          }
        }
      });
    };
    const formatDateTime = (dateTime) => {
      if (!dateTime)
        return "";
      const date = new Date(dateTime);
      date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      return `${month}-${day} ${hours}:${minutes}`;
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
          title: "健康提醒"
        }),
        c: HealthNoticeList.value.length > 0
      }, HealthNoticeList.value.length > 0 ? {
        d: common_vendor.f(HealthNoticeList.value, (item, k0, i0) => {
          return common_vendor.e({
            a: "ad7cdc56-1-" + i0,
            b: common_vendor.t(item.Title),
            c: common_vendor.t(item.IsRemind ? "已提醒" : "未提醒"),
            d: item.IsRemind == true ? 1 : "",
            e: item.IsRemind == false ? 1 : "",
            f: item.IsRemind == null ? 1 : "",
            g: common_vendor.t(item.Content),
            h: "ad7cdc56-2-" + i0,
            i: common_vendor.t(formatDateTime(item.RemindTime)),
            j: "ad7cdc56-3-" + i0,
            k: common_vendor.t(item.RemindType),
            l: item.IsRemind == false
          }, item.IsRemind == false ? {
            m: "ad7cdc56-4-" + i0,
            n: common_vendor.p({
              type: "compose",
              size: "14",
              color: "white"
            }),
            o: common_vendor.o(($event) => goToEdit(item.Id), item.Id)
          } : {}, {
            p: "ad7cdc56-5-" + i0,
            q: common_vendor.o(($event) => ShowDeleteModal(item.Id), item.Id),
            r: common_vendor.o(() => {
            }, item.Id),
            s: item.Id,
            t: common_vendor.o(($event) => goToEdit(item.Id), item.Id)
          });
        }),
        e: common_vendor.p({
          type: "heart-filled",
          size: "16",
          color: "var(--primary-color)"
        }),
        f: common_vendor.p({
          type: "calendar",
          size: "14",
          color: "var(--primary-color)"
        }),
        g: common_vendor.p({
          type: "notification",
          size: "14",
          color: "var(--primary-color)"
        }),
        h: common_vendor.p({
          type: "trash",
          size: "14",
          color: "white"
        })
      } : {
        i: common_vendor.p({
          type: "heart",
          size: "80",
          color: "var(--primary-color)"
        })
      }, {
        j: common_vendor.p({
          type: "plus",
          size: "24",
          color: "white"
        }),
        k: common_vendor.o(goToAdd)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-ad7cdc56"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/Front/HealthNoticeList.js.map
