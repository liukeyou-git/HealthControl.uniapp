"use strict";
const common_vendor = require("../../common/vendor.js");
const store_index = require("../../store/index.js");
const _sfc_main = {
  name: "fb",
  options: {
    // 在微信小程序中将组件节点渲染为虚拟节点
    virtualHost: true,
    // 使其成为纯数据组件
    pureDataPattern: /^_/
  },
  setup() {
    const store = store_index.useCommonStore();
    const currentIndex = common_vendor.ref(0);
    const tabbarHeight = common_vendor.ref(50);
    const safeAreaBottom = common_vendor.ref(0);
    const footerBarList = common_vendor.computed(() => store.FooterBarList);
    common_vendor.onMounted(() => {
      let pages = getCurrentPages();
      let currentPageRoute = pages[pages.length - 1].route;
      let mapFooterBarList = footerBarList.value.map((x) => x.url.replace("/", ""));
      let position = mapFooterBarList.indexOf(currentPageRoute);
      currentIndex.value = position;
      getSystemInfo();
    });
    const getSystemInfo = () => {
      common_vendor.index.getSystemInfo({
        success: (res) => {
          const baseHeight = 50;
          const isIOS = res.platform === "ios";
          if (res.safeArea) {
            safeAreaBottom.value = res.screenHeight - res.safeArea.bottom;
          }
          tabbarHeight.value = baseHeight;
          if (isIOS && safeAreaBottom.value > 0)
            ;
          else if (!isIOS) {
            safeAreaBottom.value = Math.max(safeAreaBottom.value, 8);
          }
        }
      });
    };
    const skip = (url) => {
      common_vendor.index.redirectTo({
        url
      });
    };
    return {
      currentIndex,
      tabbarHeight,
      safeAreaBottom,
      footerBarList,
      skip
    };
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($setup.footerBarList, (item, index, i0) => {
      return {
        a: item.icon,
        b: $setup.currentIndex === index ? 1 : "",
        c: common_vendor.t(item.label),
        d: $setup.currentIndex === index ? 1 : "",
        e: $setup.currentIndex === index ? 1 : "",
        f: common_vendor.o(($event) => $setup.skip(item.url), index),
        g: index
      };
    }),
    b: `${$setup.tabbarHeight}px`,
    c: `${$setup.safeAreaBottom}px`
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-1a4a092b"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/footer-bar/footer-bar.js.map
