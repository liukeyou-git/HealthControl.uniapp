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
  __name: "MyHealthArticleList",
  setup(__props) {
    const commonStore = store_index.useCommonStore();
    common_vendor.computed(() => commonStore.Token);
    common_vendor.computed(() => commonStore.UserInfo);
    common_vendor.computed(() => commonStore.RoleType);
    const UserId = common_vendor.computed(() => commonStore.UserId);
    const HealthArticleList = common_vendor.ref([]);
    const where = common_vendor.reactive({
      // 可以添加筛选条件，只显示当前用户的文章
      PublishUserId: UserId.value
    });
    common_vendor.onLoad(async (option) => {
    });
    common_vendor.onShow(async () => {
      GetHealthArticleListApi();
    });
    common_vendor.onReady(async () => {
    });
    const goBack = () => {
      common_vendor.index.navigateBack();
    };
    const GetHealthArticleListApi = async () => {
      try {
        let {
          Data: {
            Items
          }
        } = await utils_http.Post("/HealthArticle/List", where);
        HealthArticleList.value = Items;
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/Front/MyHealthArticleList.vue:107", "获取文章列表失败:", error);
        common_vendor.index.showToast({
          title: "获取数据失败",
          icon: "none"
        });
      }
    };
    const editArticle = (articleId) => {
      common_vendor.index.navigateTo({
        url: `/pages/Front/HealthArticleForm?Id=${articleId}&type=edit`
      });
    };
    const addNewArticle = () => {
      common_vendor.index.navigateTo({
        url: "/pages/Front/HealthArticleForm?type=add"
      });
    };
    const ShowDeleteModal = async (Id) => {
      common_vendor.index.showModal({
        title: "提示",
        content: "确认删除该健康知识文章吗？",
        success: async (res) => {
          if (res.confirm) {
            try {
              const { Success } = await utils_http.Post(`/HealthArticle/Delete`, { Id });
              if (Success) {
                await GetHealthArticleListApi();
                common_vendor.index.showToast({
                  title: "删除成功",
                  icon: "success"
                });
              }
            } catch (error) {
              common_vendor.index.__f__("error", "at pages/Front/MyHealthArticleList.vue:146", "删除失败:", error);
              common_vendor.index.showToast({
                title: "删除失败",
                icon: "none"
              });
            }
          }
        }
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
          title: "我的健康知识"
        }),
        c: HealthArticleList.value.length === 0
      }, HealthArticleList.value.length === 0 ? {} : {}, {
        d: common_vendor.f(HealthArticleList.value, (article, k0, i0) => {
          return {
            a: article.Cover,
            b: common_vendor.t(article.Title),
            c: common_vendor.t(article.HealthArticleTypeDto.Name),
            d: common_vendor.t(article.ViewCount),
            e: common_vendor.t(article.AuditStatusFormat),
            f: article.AuditStatus === 1 ? 1 : "",
            g: article.AuditStatus === 2 ? 1 : "",
            h: common_vendor.t(article.CreationTime),
            i: "6f23e8f5-1-" + i0,
            j: common_vendor.o(($event) => editArticle(article.Id), article.Id),
            k: "6f23e8f5-2-" + i0,
            l: common_vendor.o(($event) => ShowDeleteModal(article.Id), article.Id),
            m: article.Id
          };
        }),
        e: common_vendor.p({
          type: "compose",
          size: "16",
          color: "#007AFF"
        }),
        f: common_vendor.p({
          type: "trash",
          size: "16",
          color: "#FF3B30"
        }),
        g: common_vendor.p({
          type: "plus",
          size: "20",
          color: "#fff"
        }),
        h: common_vendor.o(addNewArticle)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-6f23e8f5"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/Front/MyHealthArticleList.js.map
