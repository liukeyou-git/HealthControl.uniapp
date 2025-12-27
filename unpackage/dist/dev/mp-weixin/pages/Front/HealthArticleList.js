"use strict";
const common_vendor = require("../../common/vendor.js");
const store_index = require("../../store/index.js");
const utils_http = require("../../utils/http.js");
if (!Array) {
  const _easycom_uni_nav_bar2 = common_vendor.resolveComponent("uni-nav-bar");
  const _easycom_uni_search_bar2 = common_vendor.resolveComponent("uni-search-bar");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  (_easycom_uni_nav_bar2 + _easycom_uni_search_bar2 + _easycom_uni_icons2)();
}
const _easycom_uni_nav_bar = () => "../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.js";
const _easycom_uni_search_bar = () => "../../uni_modules/uni-search-bar/components/uni-search-bar/uni-search-bar.js";
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  (_easycom_uni_nav_bar + _easycom_uni_search_bar + _easycom_uni_icons)();
}
const _sfc_main = {
  __name: "HealthArticleList",
  setup(__props) {
    const commonStore = store_index.useCommonStore();
    common_vendor.computed(() => commonStore.Token);
    common_vendor.computed(() => commonStore.UserInfo);
    common_vendor.computed(() => commonStore.RoleType);
    common_vendor.computed(() => commonStore.UserId);
    const HealthArticleList = common_vendor.ref([]);
    const HealthArticleTypeList = common_vendor.ref([]);
    const searchKeyword = common_vendor.ref("");
    const selectedCategoryId = common_vendor.ref(0);
    const where = common_vendor.reactive({
      KeyWord: "",
      HealthArticleTypeId: null,
      AuditStatus: 2
    });
    const filteredArticleList = common_vendor.computed(() => {
      let filtered = HealthArticleList.value;
      if (selectedCategoryId.value !== 0) {
        filtered = filtered.filter(
          (article) => article.HealthArticleTypeId === selectedCategoryId.value
        );
      }
      return filtered;
    });
    common_vendor.onLoad(async (option) => {
      await GetHealthArticleTypeListApi();
      await GetHealthArticleListApi();
    });
    common_vendor.onShow(async () => {
    });
    common_vendor.onReady(async () => {
    });
    const goBack = () => {
      common_vendor.index.navigateBack();
    };
    const GetHealthArticleTypeListApi = async () => {
      try {
        const { Success, Data: { Items } } = await utils_http.Post("/HealthArticleType/List", {});
        if (Success) {
          HealthArticleTypeList.value = Items.sort((a, b) => a.Sort - b.Sort);
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/Front/HealthArticleList.vue:148", "获取健康知识类型列表失败:", error);
      }
    };
    const GetHealthArticleListApi = async () => {
      try {
        const response = await utils_http.Post("/HealthArticle/List", where);
        if (response.Success && response.Data && response.Data.Items) {
          HealthArticleList.value = response.Data.Items;
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/Front/HealthArticleList.vue:160", "获取健康知识列表失败:", error);
        common_vendor.index.showToast({
          title: "获取数据失败",
          icon: "error"
        });
      }
    };
    const onSearchInput = (value) => {
      searchKeyword.value = value;
      where.KeyWord = value.trim();
      GetHealthArticleListApi();
    };
    const onSearchClear = () => {
      searchKeyword.value = "";
      where.KeyWord = "";
      GetHealthArticleListApi();
    };
    const selectCategory = (categoryId) => {
      selectedCategoryId.value = categoryId;
      where.HealthArticleTypeId = categoryId === 0 ? null : categoryId;
      GetHealthArticleListApi();
    };
    const goToArticleDetail = (articleId) => {
      common_vendor.index.navigateTo({
        url: `/pages/Front/HealthArticleDetail?HealthArticleId=${articleId}`
      });
    };
    const formatTime = (timeString) => {
      if (!timeString)
        return "";
      const date = new Date(timeString);
      const now = /* @__PURE__ */ new Date();
      const diff = now.getTime() - date.getTime();
      const minutes = Math.floor(diff / (1e3 * 60));
      const hours = Math.floor(diff / (1e3 * 60 * 60));
      const days = Math.floor(diff / (1e3 * 60 * 60 * 24));
      if (minutes < 60) {
        return `${minutes}分钟前`;
      } else if (hours < 24) {
        return `${hours}小时前`;
      } else if (days < 7) {
        return `${days}天前`;
      } else {
        return timeString.split(" ")[0];
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
          title: "健康知识列表"
        }),
        c: common_vendor.o(onSearchInput),
        d: common_vendor.o(onSearchClear),
        e: common_vendor.o(($event) => searchKeyword.value = $event),
        f: common_vendor.p({
          placeholder: "搜索健康知识...",
          cancelButton: "none",
          modelValue: searchKeyword.value
        }),
        g: selectedCategoryId.value === 0 ? 1 : "",
        h: common_vendor.o(($event) => selectCategory(0)),
        i: common_vendor.f(HealthArticleTypeList.value, (category, k0, i0) => {
          return {
            a: common_vendor.t(category.Name),
            b: category.Id,
            c: selectedCategoryId.value === category.Id ? 1 : "",
            d: common_vendor.o(($event) => selectCategory(category.Id), category.Id)
          };
        }),
        j: common_vendor.f(filteredArticleList.value, (article, k0, i0) => {
          return {
            a: article.Cover,
            b: common_vendor.t(article.AuditStatusFormat),
            c: article.AuditStatus === 2 ? 1 : "",
            d: article.AuditStatus === 1 ? 1 : "",
            e: common_vendor.t(article.Title),
            f: common_vendor.t(article.HealthArticleTypeDto.Name),
            g: "b9c695d9-2-" + i0,
            h: common_vendor.t(article.ViewCount),
            i: common_vendor.t(article.PublishUserDto.Name),
            j: common_vendor.t(formatTime(article.CreationTime)),
            k: article.Id,
            l: common_vendor.o(($event) => goToArticleDetail(article.Id), article.Id)
          };
        }),
        k: common_vendor.p({
          type: "eye",
          size: "14",
          color: "#999"
        }),
        l: filteredArticleList.value.length === 0
      }, filteredArticleList.value.length === 0 ? {
        m: common_vendor.p({
          type: "info",
          size: "48",
          color: "#ccc"
        })
      } : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-b9c695d9"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/Front/HealthArticleList.js.map
