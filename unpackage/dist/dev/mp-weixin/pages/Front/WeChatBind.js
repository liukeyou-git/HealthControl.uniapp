"use strict";
const common_vendor = require("../../common/vendor.js");
const store_index = require("../../store/index.js");
const utils_http = require("../../utils/http.js");
if (!Array) {
  const _easycom_uni_nav_bar2 = common_vendor.resolveComponent("uni-nav-bar");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_badge2 = common_vendor.resolveComponent("uni-badge");
  const _easycom_uni_card2 = common_vendor.resolveComponent("uni-card");
  (_easycom_uni_nav_bar2 + _easycom_uni_icons2 + _easycom_uni_badge2 + _easycom_uni_card2)();
}
const _easycom_uni_nav_bar = () => "../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.js";
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_badge = () => "../../uni_modules/uni-badge/components/uni-badge/uni-badge.js";
const _easycom_uni_card = () => "../../uni_modules/uni-card/components/uni-card/uni-card.js";
if (!Math) {
  (_easycom_uni_nav_bar + _easycom_uni_icons + _easycom_uni_badge + _easycom_uni_card)();
}
const _sfc_main = {
  __name: "WeChatBind",
  setup(__props) {
    const commonStore = store_index.useCommonStore();
    common_vendor.computed(() => commonStore.Token);
    common_vendor.computed(() => commonStore.UserInfo);
    common_vendor.computed(() => commonStore.RoleType);
    const UserId = common_vendor.computed(() => commonStore.UserId);
    const OpenId = common_vendor.computed(() => commonStore.UserInfo.OpenId);
    const isBinding = common_vendor.ref(false);
    const isUnbinding = common_vendor.ref(false);
    const isWechatBound = common_vendor.computed(() => {
      return OpenId.value && OpenId.value.trim() !== "";
    });
    const bindStatus = common_vendor.computed(() => {
      return isWechatBound.value ? "已绑定" : "未绑定";
    });
    const maskedOpenId = common_vendor.computed(() => {
      if (!OpenId.value)
        return "";
      const openId = OpenId.value;
      if (openId.length <= 8)
        return openId;
      const start = openId.substring(0, 4);
      const end = openId.substring(openId.length - 4);
      return `${start}****${end}`;
    });
    common_vendor.onLoad(async (option) => {
      await commonStore.GetInfo();
    });
    common_vendor.onShow(async () => {
    });
    common_vendor.onReady(async () => {
    });
    const BindWechatApi = async () => {
      common_vendor.index.__f__("log", "at pages/Front/WeChatBind.vue:130", "BindWechatApi", UserId.value);
      isBinding.value = true;
      common_vendor.index.login({
        "provider": "weixin",
        "onlyAuthorize": true,
        // 微信登录仅请求授权认证
        success: async (res) => {
          await utils_http.Post(`/User/BindWechat`, { WxCode: res.code, Id: UserId.value });
          await commonStore.GetInfo();
          isBinding.value = false;
        },
        fail: (res) => {
          isBinding.value = false;
          common_vendor.index.__f__("log", "at pages/Front/WeChatBind.vue:145", res);
        }
      });
    };
    const UnbindWechatApi = async () => {
      common_vendor.index.showModal({
        title: "确认解绑",
        content: "解绑后将无法使用微信快速登录，确定要解绑吗？",
        success: async (res) => {
          await utils_http.Post(`/User/UnbindWechat`, { Id: UserId.value });
          await commonStore.GetInfo();
        }
      });
    };
    const goBack = () => {
      common_vendor.index.navigateBack();
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
          title: "微信绑定"
        }),
        c: common_vendor.p({
          type: "weixin",
          size: "80",
          color: "#07c160"
        }),
        d: common_vendor.p({
          text: bindStatus.value,
          type: isWechatBound.value ? "success" : "warning",
          size: "normal"
        }),
        e: OpenId.value
      }, OpenId.value ? {
        f: common_vendor.t(maskedOpenId.value)
      } : {}, {
        g: isWechatBound.value
      }, isWechatBound.value ? {} : {}, {
        h: !isWechatBound.value
      }, !isWechatBound.value ? {
        i: common_vendor.t(isBinding.value ? "绑定中..." : "绑定微信"),
        j: isBinding.value,
        k: isBinding.value,
        l: common_vendor.o(BindWechatApi)
      } : {
        m: common_vendor.t(isUnbinding.value ? "解绑中..." : "解绑微信"),
        n: isUnbinding.value,
        o: common_vendor.o(UnbindWechatApi)
      }, {
        p: common_vendor.p({
          type: "info-filled",
          size: "16",
          color: "#909399"
        }),
        q: common_vendor.p({
          type: "info-filled",
          size: "16",
          color: "#909399"
        }),
        r: !OpenId.value
      }, !OpenId.value ? {
        s: common_vendor.p({
          type: "info-filled",
          size: "16",
          color: "#f56c6c"
        })
      } : {}, {
        t: common_vendor.p({
          ["is-shadow"]: false,
          spacing: "0"
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-4ef3b937"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/Front/WeChatBind.js.map
