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
  __name: "SportRecordList",
  setup(__props) {
    const commonStore = store_index.useCommonStore();
    common_vendor.computed(() => commonStore.Token);
    common_vendor.computed(() => commonStore.UserInfo);
    common_vendor.computed(() => commonStore.RoleType);
    const UserId = common_vendor.computed(() => commonStore.UserId);
    const SportRecordList = common_vendor.ref([]);
    const where = common_vendor.reactive({
      UserId: UserId.value
    });
    common_vendor.onLoad(async (option) => {
    });
    common_vendor.onShow(async () => {
      GetSportRecordListApi();
      SportRecordSummaryApi();
    });
    common_vendor.onReady(async () => {
    });
    const goBack = () => {
      common_vendor.index.navigateBack();
    };
    const goToAddSportRecord = () => {
      common_vendor.index.navigateTo({
        url: "/pages/Front/SportList"
      });
    };
    const GetSportRecordListApi = async () => {
      let {
        Data: {
          Items
        }
      } = await utils_http.Post("/SportRecord/List", where);
      SportRecordList.value = Items;
    };
    const SportRecordSummary = common_vendor.ref([]);
    const SportRecordSummaryApi = async () => {
      let {
        Data
      } = await utils_http.Post("/SportRecord/SportRecordSummary", where);
      SportRecordSummary.value = Data;
    };
    const formatTime = (timeStr) => {
      if (!timeStr)
        return "";
      const date = new Date(timeStr);
      const now = /* @__PURE__ */ new Date();
      const diff = now - date;
      const minutes = Math.floor(diff / 6e4);
      const hours = Math.floor(diff / 36e5);
      const days = Math.floor(diff / 864e5);
      if (isNaN(date.getTime())) {
        return timeStr;
      }
      if (minutes < 1) {
        return "刚刚";
      } else if (minutes < 60) {
        return `${minutes}分钟前`;
      } else if (hours < 24) {
        return `${hours}小时前`;
      } else if (days < 7) {
        return `${days}天前`;
      } else {
        return date.toLocaleString("zh-CN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit"
        });
      }
    };
    const calculateCalories = (recordValue, unitCalories) => {
      return Math.round(recordValue * unitCalories);
    };
    const calculateAvgCalories = () => {
      if (SportRecordSummary.value.TotalSportCountMonth > 0) {
        return (SportRecordSummary.value.TotalCaloriesMonth / SportRecordSummary.value.TotalSportCountMonth).toFixed(1);
      }
      return 0;
    };
    const ShowDeleteModal = async (Id) => {
      common_vendor.index.showModal({
        title: "提示",
        content: "确认删除该运动记录吗？",
        success: async (res) => {
          if (res.confirm) {
            const { Success } = await utils_http.Post(`/SportRecord/Delete`, { Id });
            if (Success) {
              await GetSportRecordListApi();
              common_vendor.index.showToast({
                title: "删除成功",
                icon: "success"
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
          title: "运动记录列表"
        }),
        c: common_vendor.p({
          type: "bar-chart",
          size: "20",
          color: "#007aff"
        }),
        d: common_vendor.t(SportRecordSummary.value.TotalCalories || 0),
        e: common_vendor.t(SportRecordSummary.value.TotalCaloriesWeek || 0),
        f: common_vendor.t(SportRecordSummary.value.TotalCaloriesMonth || 0),
        g: common_vendor.t(SportRecordSummary.value.TotalSportCountWeek || 0),
        h: common_vendor.t(SportRecordSummary.value.TotalSportCountMonth || 0),
        i: common_vendor.t(calculateAvgCalories()),
        j: SportRecordList.value.length > 0
      }, SportRecordList.value.length > 0 ? {
        k: common_vendor.f(SportRecordList.value, (record, k0, i0) => {
          return {
            a: record.SportDto.Cover,
            b: common_vendor.t(record.SportDto.Name),
            c: common_vendor.t(formatTime(record.RecordTime)),
            d: "0f544f89-2-" + i0,
            e: common_vendor.o(($event) => ShowDeleteModal(record.Id), record.Id),
            f: common_vendor.t(record.RecordValue),
            g: common_vendor.t(record.SportUnitDto.UnitName),
            h: common_vendor.t(calculateCalories(record.RecordValue, record.SportUnitDto.Calories)),
            i: common_vendor.t(record.SportDto.Content),
            j: record.Id
          };
        }),
        l: common_vendor.p({
          type: "trash",
          size: "20",
          color: "#ff4757"
        })
      } : {
        m: common_vendor.p({
          type: "list",
          size: "80",
          color: "#c0c4cc"
        })
      }, {
        n: common_vendor.p({
          type: "plus",
          size: "24",
          color: "#fff"
        }),
        o: common_vendor.o(goToAddSportRecord)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-0f544f89"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/Front/SportRecordList.js.map
