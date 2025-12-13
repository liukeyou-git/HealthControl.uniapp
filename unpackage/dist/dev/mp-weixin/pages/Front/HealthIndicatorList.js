"use strict";
const common_vendor = require("../../common/vendor.js");
const store_index = require("../../store/index.js");
const utils_http = require("../../utils/http.js");
const common_assets = require("../../common/assets.js");
if (!Array) {
  const _easycom_uni_nav_bar2 = common_vendor.resolveComponent("uni-nav-bar");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_footer_bar2 = common_vendor.resolveComponent("footer-bar");
  (_easycom_uni_nav_bar2 + _easycom_uni_icons2 + _easycom_footer_bar2)();
}
const _easycom_uni_nav_bar = () => "../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.js";
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_footer_bar = () => "../../components/footer-bar/footer-bar.js";
if (!Math) {
  (_easycom_uni_nav_bar + _easycom_uni_icons + _easycom_footer_bar)();
}
const _sfc_main = {
  __name: "HealthIndicatorList",
  setup(__props) {
    const commonStore = store_index.useCommonStore();
    common_vendor.computed(() => commonStore.Token);
    common_vendor.computed(() => commonStore.UserInfo);
    common_vendor.computed(() => commonStore.RoleType);
    const UserId = common_vendor.computed(() => commonStore.UserId);
    common_vendor.ref([]);
    common_vendor.reactive({});
    common_vendor.onLoad(async (option) => {
    });
    common_vendor.onShow(async () => {
      GetUserHealthIndicatorTypeListApi();
    });
    common_vendor.onReady(async () => {
    });
    const UserHealthIndicatorTypeList = common_vendor.ref([]);
    const selectedIndicators = common_vendor.ref([]);
    const isSelectionMode = common_vendor.ref(false);
    const GetUserHealthIndicatorTypeListApi = async () => {
      let {
        Data: {
          Items
        }
      } = await utils_http.Post("/HealthIndicatorType/UserHealthIndicatorList", {
        BelongUserId: UserId.value
      });
      UserHealthIndicatorTypeList.value = Items;
    };
    const UserRemoveIndicatorApi = async (Id) => {
      let { Success } = await utils_http.Post("/HealthIndicator/UserRemoveIndicator", {
        Id
      });
      if (Success) {
        await GetUserHealthIndicatorTypeListApi();
      }
    };
    const goToOfficialIndicators = () => {
      common_vendor.index.navigateTo({
        url: "/pages/Front/CommHealthIndicatorTypeList"
      });
    };
    const goToCustomIndicators = () => {
      common_vendor.index.navigateTo({
        url: "/pages/Front/HealthIndicatorForm?Id="
      });
    };
    const goToRecordList = () => {
      common_vendor.index.navigateTo({
        url: "/pages/Front/HealthIndicatorRecordList"
      });
    };
    const goToIndicatorDetail = (indicator) => {
      if (isSelectionMode.value) {
        toggleIndicatorSelection(indicator);
      } else {
        showActionModal(indicator);
      }
    };
    const toggleIndicatorSelection = (indicator) => {
      const index = selectedIndicators.value.findIndex((item) => item.Id === indicator.Id);
      if (index > -1) {
        selectedIndicators.value.splice(index, 1);
      } else {
        selectedIndicators.value.push({
          Id: indicator.Id,
          Name: indicator.Name,
          HealthIndicatorTypeId: indicator.HealthIndicatorTypeId,
          HealthIndicatorTypeName: getUserIndicatorTypeName(indicator.HealthIndicatorTypeId),
          Threshold: indicator.Threshold,
          Content: indicator.Content,
          Cover: indicator.Cover
        });
      }
    };
    const isIndicatorSelected = (indicatorId) => {
      return selectedIndicators.value.some((item) => item.Id === indicatorId);
    };
    const getUserIndicatorTypeName = (typeId) => {
      const type = UserHealthIndicatorTypeList.value.find((item) => item.Id === typeId);
      return type ? type.Name : "";
    };
    const toggleSelectionMode = () => {
      isSelectionMode.value = !isSelectionMode.value;
      if (!isSelectionMode.value) {
        selectedIndicators.value = [];
      }
    };
    const goToBatchRecord = () => {
      if (selectedIndicators.value.length === 0) {
        common_vendor.index.showToast({
          title: "请先选择指标",
          icon: "none"
        });
        return;
      }
      common_vendor.index.setStorageSync("selectedIndicators", JSON.stringify(selectedIndicators.value));
      common_vendor.index.navigateTo({
        url: `/pages/Front/BatchRecordForm?`
      });
    };
    const showActionModal = (indicator) => {
      common_vendor.index.showActionSheet({
        itemList: ["编辑指标", "删除指标"],
        itemColor: "#333333",
        success: (res) => {
          if (res.tapIndex === 0) {
            editIndicator(indicator);
          } else if (res.tapIndex === 1) {
            confirmDeleteIndicator(indicator);
          }
        }
      });
    };
    const editIndicator = (indicator) => {
      common_vendor.index.navigateTo({
        url: `/pages/Front/HealthIndicatorForm?Id=${indicator.Id}`
      });
    };
    const confirmDeleteIndicator = (indicator) => {
      common_vendor.index.showModal({
        title: "确认删除",
        content: `确定要删除指标"${indicator.Name}"吗？此操作不可恢复。`,
        confirmText: "删除",
        confirmColor: "#F44336",
        cancelText: "取消",
        success: async (res) => {
          if (res.confirm) {
            try {
              await UserRemoveIndicatorApi(indicator.Id);
              common_vendor.index.showToast({
                title: "删除成功",
                icon: "success"
              });
            } catch (error) {
              common_vendor.index.showToast({
                title: "删除失败",
                icon: "error"
              });
            }
          }
        }
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          dark: true,
          fixed: true,
          shadow: true,
          ["background-color"]: "var(--primary-color)",
          ["status-bar"]: true,
          l: true,
          title: "健康指标"
        }),
        b: common_vendor.unref(common_assets.selectIcon),
        c: common_vendor.p({
          type: "arrowright",
          size: "14",
          color: "#ffffff"
        }),
        d: common_vendor.o(goToOfficialIndicators),
        e: common_vendor.unref(common_assets.addIcon),
        f: common_vendor.p({
          type: "arrowright",
          size: "14",
          color: "#ffffff"
        }),
        g: common_vendor.o(goToCustomIndicators),
        h: common_vendor.unref(common_assets.recordIcon),
        i: common_vendor.p({
          type: "arrowright",
          size: "16",
          color: "#ffffff"
        }),
        j: common_vendor.o(goToRecordList),
        k: UserHealthIndicatorTypeList.value.length > 0
      }, UserHealthIndicatorTypeList.value.length > 0 ? common_vendor.e({
        l: common_vendor.p({
          type: "bars",
          size: "18",
          color: "#4CAF50"
        }),
        m: !isSelectionMode.value
      }, !isSelectionMode.value ? {
        n: common_vendor.p({
          type: "checkmarkempty",
          size: "14",
          color: "#ffffff"
        }),
        o: common_vendor.o(toggleSelectionMode)
      } : {
        p: common_vendor.p({
          type: "close",
          size: "14",
          color: "#ffffff"
        }),
        q: common_vendor.o(toggleSelectionMode)
      }, {
        r: isSelectionMode.value
      }, isSelectionMode.value ? common_vendor.e({
        s: common_vendor.p({
          type: "info",
          size: "16",
          color: "#4CAF50"
        }),
        t: common_vendor.t(selectedIndicators.value.length),
        v: selectedIndicators.value.length > 0
      }, selectedIndicators.value.length > 0 ? {
        w: common_vendor.p({
          type: "compose",
          size: "14",
          color: "#ffffff"
        }),
        x: common_vendor.o(goToBatchRecord)
      } : {}) : {}, {
        y: common_vendor.f(UserHealthIndicatorTypeList.value, (category, categoryIndex, i0) => {
          return {
            a: common_vendor.t(category.Name),
            b: common_vendor.t(category.HealthIndicatorDtoList.length),
            c: common_vendor.f(category.HealthIndicatorDtoList, (indicator, indicatorIndex, i1) => {
              return common_vendor.e(isSelectionMode.value ? common_vendor.e({
                a: isIndicatorSelected(indicator.Id)
              }, isIndicatorSelected(indicator.Id) ? {
                b: "920f6292-9-" + i0 + "-" + i1,
                c: common_vendor.p({
                  type: "checkmarkempty",
                  size: "16",
                  color: "#ffffff"
                })
              } : {}, {
                d: isIndicatorSelected(indicator.Id) ? 1 : ""
              }) : {}, {
                e: indicator.Cover
              }, indicator.Cover ? {
                f: indicator.Cover
              } : {
                g: "920f6292-10-" + i0 + "-" + i1,
                h: common_vendor.p({
                  type: "pulse",
                  size: "24",
                  color: "#4CAF50"
                })
              }, {
                i: common_vendor.t(indicator.Name),
                j: common_vendor.t(indicator.Threshold),
                k: common_vendor.t(indicator.Content)
              }, !isSelectionMode.value ? {
                l: "920f6292-11-" + i0 + "-" + i1,
                m: common_vendor.p({
                  type: "arrowright",
                  size: "14",
                  color: "#cccccc"
                })
              } : {}, {
                n: indicator.Id,
                o: isIndicatorSelected(indicator.Id) ? 1 : "",
                p: common_vendor.o(($event) => goToIndicatorDetail(indicator), indicator.Id)
              });
            }),
            d: category.Id
          };
        }),
        z: isSelectionMode.value,
        A: !isSelectionMode.value,
        B: isSelectionMode.value ? 1 : ""
      }) : {
        C: common_vendor.p({
          type: "list",
          size: "60",
          color: "#cccccc"
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-920f6292"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/Front/HealthIndicatorList.js.map
