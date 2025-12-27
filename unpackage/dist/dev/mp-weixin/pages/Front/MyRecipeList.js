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
  __name: "MyRecipeList",
  setup(__props) {
    const commonStore = store_index.useCommonStore();
    common_vendor.computed(() => commonStore.Token);
    common_vendor.computed(() => commonStore.UserInfo);
    common_vendor.computed(() => commonStore.RoleType);
    const UserId = common_vendor.computed(() => commonStore.UserId);
    const RecipeList = common_vendor.ref([]);
    const where = common_vendor.reactive({
      // 可以添加筛选条件
      PublishUserId: UserId.value
    });
    common_vendor.onLoad(async (option) => {
    });
    common_vendor.onShow(async () => {
      GetRecipeListApi();
    });
    common_vendor.onReady(async () => {
    });
    const goBack = () => {
      common_vendor.index.navigateBack();
    };
    const goToAdd = () => {
      common_vendor.index.navigateTo({
        url: "/pages/Front/RecipeForm"
      });
    };
    const goToEdit = (id) => {
      common_vendor.index.navigateTo({
        url: `/pages/Front/RecipeForm?Id=${id}`
      });
    };
    const GetRecipeListApi = async () => {
      try {
        let {
          Data: {
            Items
          }
        } = await utils_http.Post("/Recipe/List", where);
        RecipeList.value = Items || [];
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/Front/MyRecipeList.vue:136", "获取食谱列表失败:", error);
        common_vendor.index.showToast({
          title: "获取数据失败",
          icon: "none"
        });
      }
    };
    const ShowDeleteModal = async (Id) => {
      common_vendor.index.showModal({
        title: "提示",
        content: "确认删除该食谱吗？",
        success: async (res) => {
          if (res.confirm) {
            try {
              const { Success } = await utils_http.Post(`/Recipe/Delete`, { Id });
              if (Success) {
                await GetRecipeListApi();
                common_vendor.index.showToast({
                  title: "删除成功",
                  icon: "success"
                });
              }
            } catch (error) {
              common_vendor.index.__f__("error", "at pages/Front/MyRecipeList.vue:161", "删除失败:", error);
              common_vendor.index.showToast({
                title: "删除失败",
                icon: "none"
              });
            }
          }
        }
      });
    };
    const getStatusClass = (status) => {
      switch (status) {
        case 2:
          return "status-approved";
        case 1:
          return "status-pending";
        case 3:
          return "status-rejected";
        default:
          return "status-pending";
      }
    };
    const formatDate = (dateString) => {
      if (!dateString)
        return "";
      const date = new Date(dateString);
      return `${date.getMonth() + 1}-${date.getDate()}`;
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
          title: "我的食谱"
        }),
        c: RecipeList.value.length > 0
      }, RecipeList.value.length > 0 ? {
        d: common_vendor.f(RecipeList.value, (recipe, k0, i0) => {
          return common_vendor.e({
            a: recipe.VideoUrl
          }, recipe.VideoUrl ? {
            b: recipe.VideoUrl,
            c: common_vendor.t(recipe.AuditStatusFormat),
            d: common_vendor.n(getStatusClass(recipe.AuditStatus))
          } : {}, {
            e: common_vendor.t(recipe.Title),
            f: "bf31baef-1-" + i0,
            g: common_vendor.t(recipe.ViewCount),
            h: "bf31baef-2-" + i0,
            i: common_vendor.t(formatDate(recipe.CreationTime)),
            j: recipe.AuditReply
          }, recipe.AuditReply ? {
            k: common_vendor.t(recipe.AuditReply)
          } : {}, {
            l: "bf31baef-3-" + i0,
            m: common_vendor.o(($event) => goToEdit(recipe.Id), recipe.Id),
            n: "bf31baef-4-" + i0,
            o: common_vendor.o(($event) => ShowDeleteModal(recipe.Id), recipe.Id),
            p: recipe.Id
          });
        }),
        e: common_vendor.p({
          type: "eye",
          size: "14",
          color: "#999"
        }),
        f: common_vendor.p({
          type: "calendar",
          size: "14",
          color: "#999"
        }),
        g: common_vendor.p({
          type: "compose",
          size: "16",
          color: "#007AFF"
        }),
        h: common_vendor.p({
          type: "trash",
          size: "16",
          color: "#FF3B30"
        })
      } : {
        i: common_vendor.p({
          type: "document",
          size: "80",
          color: "#ccc"
        })
      }, {
        j: common_vendor.p({
          type: "plus",
          size: "20",
          color: "#fff"
        }),
        k: common_vendor.o(goToAdd)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-bf31baef"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/Front/MyRecipeList.js.map
