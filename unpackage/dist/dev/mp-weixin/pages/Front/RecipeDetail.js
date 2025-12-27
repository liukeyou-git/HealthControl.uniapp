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
  __name: "RecipeDetail",
  setup(__props) {
    const commonStore = store_index.useCommonStore();
    common_vendor.computed(() => commonStore.Token);
    common_vendor.computed(() => commonStore.UserInfo);
    common_vendor.computed(() => commonStore.RoleType);
    const UserId = common_vendor.computed(() => commonStore.UserId);
    const RecipeDetail = common_vendor.ref({});
    const imageList = common_vendor.ref([]);
    const where = common_vendor.reactive({});
    common_vendor.onLoad(async (option) => {
      where.Id = option.RecipeId;
    });
    common_vendor.onShow(async () => {
      await AddViewCountApi();
      await GetRecipeDetailApi();
      await CheckIsCollectApi();
      await CheckIsLikeRecordApi();
      await RecommendListApi();
    });
    common_vendor.onReady(async () => {
    });
    const goBack = () => {
      common_vendor.index.navigateBack();
    };
    const GetRecipeDetailApi = async () => {
      let {
        Data
      } = await utils_http.Post("/Recipe/Get", where);
      RecipeDetail.value = Data;
      if (Data.ImageUrls) {
        imageList.value = Data.ImageUrls.split(",").filter((url) => url.trim());
      }
    };
    const AddViewCountApi = async () => {
      await utils_http.Post("/Recipe/AddViewCount", { Id: where.Id });
    };
    const CollectId = common_vendor.ref(0);
    const LikeRecordId = common_vendor.ref(0);
    const CheckIsCollectApi = async () => {
      let {
        Success,
        Data
      } = await utils_http.Post("/CollectRecord/Get", {
        Id: 0,
        CollectUserId: UserId.value,
        CollectType: "食谱",
        RelativeId: where.Id
      });
      CollectId.value = Data.Id;
    };
    const CollectApi = async () => {
      if (CollectId.value > 0) {
        let {
          Success
        } = await utils_http.Post("/CollectRecord/Delete", {
          Id: CollectId.value
        });
        if (Success) {
          CollectId.value = 0;
          common_vendor.index.showToast({
            title: "取消收藏",
            icon: "none"
          });
        }
      } else {
        let {
          Success,
          Data
        } = await utils_http.Post("/CollectRecord/CreateOrEdit", {
          CollectUserId: UserId.value,
          CollectType: "食谱",
          RelativeId: where.Id
        });
        if (Success) {
          CollectId.value = Data.Id;
          common_vendor.index.showToast({
            title: "收藏成功",
            icon: "none"
          });
        }
      }
    };
    const CheckIsLikeRecordApi = async () => {
      let {
        Success,
        Data
      } = await utils_http.Post("/LikeRecord/Get", {
        Id: 0,
        LikeUserId: UserId.value,
        LikeType: "食谱",
        RelativeId: where.Id
      });
      LikeRecordId.value = Data.Id;
    };
    const LikeRecordApi = async () => {
      if (LikeRecordId.value > 0) {
        let {
          Success
        } = await utils_http.Post("/LikeRecord/Delete", {
          Id: LikeRecordId.value
        });
        if (Success) {
          LikeRecordId.value = 0;
          common_vendor.index.showToast({
            title: "取消点赞",
            icon: "none"
          });
        }
      } else {
        let {
          Success,
          Data
        } = await utils_http.Post("/LikeRecord/CreateOrEdit", {
          LikeUserId: UserId.value,
          LikeType: "食谱",
          RelativeId: where.Id
        });
        if (Success) {
          LikeRecordId.value = Data.Id;
          common_vendor.index.showToast({
            title: "点赞成功",
            icon: "none"
          });
        }
      }
    };
    const formatTime = (timeStr) => {
      if (!timeStr)
        return "";
      const date = new Date(timeStr);
      const now = /* @__PURE__ */ new Date();
      const diff = now - date;
      const days = Math.floor(diff / (1e3 * 60 * 60 * 24));
      if (days === 0) {
        return "今天发布";
      } else if (days === 1) {
        return "昨天发布";
      } else if (days < 7) {
        return `${days}天前发布`;
      } else {
        return date.toLocaleDateString().replace(/\//g, "-");
      }
    };
    const previewImage = (index) => {
      common_vendor.index.previewImage({
        current: index,
        urls: imageList.value
      });
    };
    const RecommendList = common_vendor.ref([]);
    const RecommendListApi = async () => {
      let {
        Data
      } = await utils_http.Post("/Recipe/RecommendList", {
        Id: where.Id
      });
      RecommendList.value = Data;
    };
    const goToDetail = (recipeId) => {
      common_vendor.index.redirectTo({
        url: `/pages/Front/RecipeDetail?RecipeId=${recipeId}`
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
          title: "食谱详情"
        }),
        c: RecipeDetail.value.VideoUrl
      }, RecipeDetail.value.VideoUrl ? {
        d: common_vendor.p({
          type: "videocam",
          color: "#4CAF50",
          size: "20"
        }),
        e: RecipeDetail.value.VideoUrl
      } : {}, {
        f: common_vendor.t(RecipeDetail.value.Title),
        g: common_vendor.p({
          type: "eye",
          color: "#4CAF50",
          size: "16"
        }),
        h: common_vendor.t(RecipeDetail.value.ViewCount || 0),
        i: common_vendor.p({
          type: "person",
          color: "#4CAF50",
          size: "18"
        }),
        j: RecipeDetail.value.PublishUserDto && RecipeDetail.value.PublishUserDto.ImageUrls
      }, RecipeDetail.value.PublishUserDto && RecipeDetail.value.PublishUserDto.ImageUrls ? {
        k: RecipeDetail.value.PublishUserDto.ImageUrls
      } : {
        l: common_vendor.p({
          type: "person",
          color: "#4CAF50",
          size: "24"
        })
      }, {
        m: common_vendor.t(RecipeDetail.value.PublishUserDto && RecipeDetail.value.PublishUserDto.Name || "匿名用户"),
        n: common_vendor.p({
          type: "calendar",
          color: "#81C784",
          size: "14"
        }),
        o: common_vendor.t(formatTime(RecipeDetail.value.CreationTime)),
        p: imageList.value.length > 0
      }, imageList.value.length > 0 ? {
        q: common_vendor.p({
          type: "image",
          color: "#4CAF50",
          size: "20"
        }),
        r: common_vendor.f(imageList.value, (image, index, i0) => {
          return {
            a: image,
            b: common_vendor.o(($event) => previewImage(index), index),
            c: common_vendor.t(index + 1),
            d: index
          };
        })
      } : {}, {
        s: common_vendor.p({
          type: "list",
          color: "#4CAF50",
          size: "20"
        }),
        t: RecipeDetail.value.Content,
        v: RecommendList.value.length > 0
      }, RecommendList.value.length > 0 ? {
        w: common_vendor.p({
          type: "heart",
          color: "#4CAF50",
          size: "22"
        }),
        x: common_vendor.f(RecommendList.value, (item, k0, i0) => {
          return common_vendor.e({
            a: item.Cover,
            b: "38f8363c-9-" + i0,
            c: common_vendor.t(item.ViewCount),
            d: common_vendor.t(item.Title),
            e: item.PublishUserDto && item.PublishUserDto.ImageUrls
          }, item.PublishUserDto && item.PublishUserDto.ImageUrls ? {
            f: item.PublishUserDto.ImageUrls
          } : {
            g: "38f8363c-10-" + i0,
            h: common_vendor.p({
              type: "person",
              color: "#4CAF50",
              size: "14"
            })
          }, {
            i: common_vendor.t(item.PublishUserDto && (item.PublishUserDto.Name || item.PublishUserDto.UserName) || "匿名用户"),
            j: common_vendor.t(formatTime(item.CreationTime)),
            k: common_vendor.t(item.AuditStatusFormat),
            l: item.ViewCount > 200
          }, item.ViewCount > 200 ? {
            m: "38f8363c-11-" + i0,
            n: common_vendor.p({
              type: "fire",
              color: "#FF6B35",
              size: "12"
            })
          } : {}, {
            o: item.Id,
            p: common_vendor.o(($event) => goToDetail(item.Id), item.Id)
          });
        }),
        y: common_vendor.p({
          type: "eye",
          color: "#fff",
          size: "12"
        })
      } : {}, {
        z: common_vendor.t(CollectId.value > 0 ? "❤️" : "🤍"),
        A: common_vendor.t(CollectId.value > 0 ? "已收藏" : "收藏"),
        B: CollectId.value > 0 ? 1 : "",
        C: CollectId.value > 0 ? 1 : "",
        D: common_vendor.o(CollectApi),
        E: common_vendor.t(LikeRecordId.value > 0 ? "👍" : "👍🏻"),
        F: common_vendor.t(LikeRecordId.value > 0 ? "已点赞" : "点赞"),
        G: LikeRecordId.value > 0 ? 1 : "",
        H: LikeRecordId.value > 0 ? 1 : "",
        I: common_vendor.o(LikeRecordApi)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-38f8363c"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/Front/RecipeDetail.js.map
