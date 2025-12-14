"use strict";
const common_vendor = require("../../common/vendor.js");
const store_index = require("../../store/index.js");
if (!Array) {
  const _easycom_uni_nav_bar2 = common_vendor.resolveComponent("uni-nav-bar");
  const _easycom_footer_bar2 = common_vendor.resolveComponent("footer-bar");
  (_easycom_uni_nav_bar2 + _easycom_footer_bar2)();
}
const _easycom_uni_nav_bar = () => "../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.js";
const _easycom_footer_bar = () => "../../components/footer-bar/footer-bar.js";
if (!Math) {
  (_easycom_uni_nav_bar + _easycom_footer_bar)();
}
const _sfc_main = {
  __name: "Index",
  setup(__props) {
    const commonStore = store_index.useCommonStore();
    const ToDietRecordList = () => {
      common_vendor.index.navigateTo({
        url: "/pages/Front/DietRecordList"
      });
    };
    common_vendor.onLoad(() => {
    });
    common_vendor.onShow(() => {
      if (commonStore.CheckIsLogin())
        ;
    });
    common_vendor.onHide(() => {
    });
    common_vendor.onUnload(() => {
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          dark: true,
          fixed: true,
          shadow: true,
          ["background-color"]: "var(--primary-color)",
          ["status-bar"]: true,
          title: "健康管理"
        }),
        b: common_vendor.o(($event) => ToDietRecordList())
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-b146bd57"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/Front/Index.js.map
