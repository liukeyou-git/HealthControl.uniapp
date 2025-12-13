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
  __name: "CommHealthIndicatorTypeList",
  setup(__props) {
    const commonStore = store_index.useCommonStore();
    common_vendor.computed(() => commonStore.Token);
    common_vendor.computed(() => commonStore.UserInfo);
    common_vendor.computed(() => commonStore.RoleType);
    const UserId = common_vendor.computed(() => commonStore.UserId);
    common_vendor.ref([]);
    common_vendor.reactive({});
    const expandedCategories = common_vendor.ref([]);
    common_vendor.onLoad(async (option) => {
    });
    common_vendor.onShow(async () => {
      GetCommHealthIndicatorTypeListApi();
    });
    common_vendor.onReady(async () => {
    });
    const goBack = () => {
      common_vendor.index.navigateBack();
    };
    const CommHealthIndicatorTypeList = common_vendor.ref([]);
    const GetCommHealthIndicatorTypeListApi = async () => {
      let {
        Data: {
          Items
        }
      } = await utils_http.Post("/HealthIndicatorType/CommUserHealthIndicatorList", {
        IsComm: true
      });
      CommHealthIndicatorTypeList.value = Items;
    };
    const toggleCategory = (index) => {
      const expandIndex = expandedCategories.value.indexOf(index);
      if (expandIndex > -1) {
        expandedCategories.value.splice(expandIndex, 1);
      } else {
        expandedCategories.value.push(index);
      }
    };
    const selectIndicator = async (indicator) => {
      if (indicator.IsSelected) {
        let { Success } = await utils_http.Post("/HealthIndicator/UserCancelCommIndicator", {
          Name: indicator.Name,
          BelongUserId: UserId.value
        });
        if (Success) {
          indicator.IsSelected = false;
          common_vendor.index.showToast({
            title: `已取消选择：${indicator.Name}`,
            icon: "none"
          });
        }
      } else {
        let { Success } = await utils_http.Post("/HealthIndicator/UserAddCommIndicator", {
          Name: indicator.Name,
          Content: indicator.Content,
          Threshold: indicator.Threshold,
          HealthIndicatorTypeId: indicator.HealthIndicatorTypeId,
          Cover: indicator.Cover,
          BelongUserId: UserId.value
        });
        if (Success) {
          indicator.IsSelected = true;
          common_vendor.index.showToast({
            title: `已选择：${indicator.Name}`,
            icon: "none"
          });
        }
      }
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
          title: "官方健康指标"
        }),
        c: CommHealthIndicatorTypeList.value.length > 0
      }, CommHealthIndicatorTypeList.value.length > 0 ? {
        d: common_vendor.f(CommHealthIndicatorTypeList.value, (category, index, i0) => {
          return {
            a: "e3b59ed8-1-" + i0,
            b: common_vendor.t(category.Name),
            c: common_vendor.t(category.HealthIndicatorDtoList.length),
            d: "e3b59ed8-2-" + i0,
            e: expandedCategories.value.includes(index) ? 1 : "",
            f: common_vendor.o(($event) => toggleCategory(index), category.Id),
            g: common_vendor.f(category.HealthIndicatorDtoList, (indicator, k1, i1) => {
              return common_vendor.e({
                a: indicator.Cover
              }, indicator.Cover ? {
                b: indicator.Cover
              } : {
                c: "e3b59ed8-3-" + i0 + "-" + i1,
                d: common_vendor.p({
                  type: "image",
                  size: "20",
                  color: "#ccc"
                })
              }, {
                e: common_vendor.t(indicator.Name),
                f: common_vendor.t(indicator.Content),
                g: common_vendor.t(indicator.Threshold),
                h: indicator.IsSelected
              }, indicator.IsSelected ? {
                i: "e3b59ed8-4-" + i0 + "-" + i1,
                j: common_vendor.p({
                  type: "checkmarkempty",
                  size: "18",
                  color: "#ffffff"
                })
              } : {
                k: "e3b59ed8-5-" + i0 + "-" + i1,
                l: common_vendor.p({
                  type: "plus",
                  size: "18",
                  color: "#4CAF50"
                })
              }, {
                m: indicator.IsSelected ? 1 : "",
                n: indicator.Id,
                o: common_vendor.o(($event) => selectIndicator(indicator), indicator.Id)
              });
            }),
            h: expandedCategories.value.includes(index),
            i: category.Id
          };
        }),
        e: common_vendor.p({
          type: "heart",
          size: "22",
          color: "#4CAF50"
        }),
        f: common_vendor.p({
          type: "arrowdown",
          size: "16",
          color: "#666"
        })
      } : {
        g: common_vendor.p({
          type: "info",
          size: "60",
          color: "#ccc"
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-e3b59ed8"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/Front/CommHealthIndicatorTypeList.js.map
