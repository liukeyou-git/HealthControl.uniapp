"use strict";
const common_vendor = require("../../common/vendor.js");
const store_index = require("../../store/index.js");
const utils_http = require("../../utils/http.js");
if (!Array) {
  const _easycom_uni_nav_bar2 = common_vendor.resolveComponent("uni-nav-bar");
  const _easycom_uni_datetime_picker2 = common_vendor.resolveComponent("uni-datetime-picker");
  (_easycom_uni_nav_bar2 + _easycom_uni_datetime_picker2)();
}
const _easycom_uni_nav_bar = () => "../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.js";
const _easycom_uni_datetime_picker = () => "../../uni_modules/uni-datetime-picker/components/uni-datetime-picker/uni-datetime-picker.js";
if (!Math) {
  (_easycom_uni_nav_bar + _easycom_uni_datetime_picker)();
}
const _sfc_main = {
  __name: "HealthIndicatorRecordList",
  setup(__props) {
    const commonStore = store_index.useCommonStore();
    common_vendor.computed(() => commonStore.Token);
    common_vendor.computed(() => commonStore.UserInfo);
    common_vendor.computed(() => commonStore.RoleType);
    const UserId = common_vendor.computed(() => commonStore.UserId);
    const HealthIndicatorRecordList = common_vendor.ref([]);
    const getTodayRange = () => {
      const today = /* @__PURE__ */ new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
      const formatDateTime2 = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hour = String(date.getHours()).padStart(2, "0");
        const minute = String(date.getMinutes()).padStart(2, "0");
        const second = String(date.getSeconds()).padStart(2, "0");
        return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
      };
      return [formatDateTime2(startOfDay), formatDateTime2(endOfDay)];
    };
    const timeRange = common_vendor.ref(getTodayRange());
    const where = common_vendor.reactive({
      RecordTimeRange: getTodayRange()
    });
    common_vendor.onLoad(async (option) => {
    });
    common_vendor.onShow(async () => {
      where.RecordUserId = UserId.value;
      GetHealthIndicatorRecordListApi();
    });
    common_vendor.onReady(async () => {
    });
    const goBack = () => {
      common_vendor.index.navigateBack();
    };
    const GetHealthIndicatorRecordListApi = async () => {
      try {
        let {
          Data: {
            Items
          }
        } = await utils_http.Post("/HealthIndicatorRecord/List", where);
        HealthIndicatorRecordList.value = Items || [];
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/Front/HealthIndicatorRecordList.vue:179", "获取健康记录失败:", error);
        HealthIndicatorRecordList.value = [];
      }
    };
    const ShowDeleteModal = async (Id) => {
      common_vendor.index.showModal({
        title: "提示",
        content: "确认删除该健康记录吗？",
        success: async (res) => {
          if (res.confirm) {
            try {
              const { Success } = await utils_http.Post(`/HealthIndicatorRecord/Delete`, { Id });
              if (Success) {
                await GetHealthIndicatorRecordListApi();
                common_vendor.index.showToast({
                  title: "删除成功",
                  icon: "success"
                });
              }
            } catch (error) {
              common_vendor.index.__f__("error", "at pages/Front/HealthIndicatorRecordList.vue:201", "删除失败:", error);
              common_vendor.index.showToast({
                title: "删除失败",
                icon: "error"
              });
            }
          }
        }
      });
    };
    const onStartTimeChange = (e) => {
      timeRange.value[0] = e;
      updateTimeRange();
    };
    const onEndTimeChange = (e) => {
      timeRange.value[1] = e;
      updateTimeRange();
    };
    const updateTimeRange = () => {
      if (timeRange.value[0] && timeRange.value[1]) {
        where.RecordTimeRange = [timeRange.value[0], timeRange.value[1]];
      } else {
        where.RecordTimeRange = [];
      }
    };
    const handleQuery = () => {
      if (timeRange.value[0] && timeRange.value[1]) {
        if (new Date(timeRange.value[0]) > new Date(timeRange.value[1])) {
          common_vendor.index.showToast({
            title: "开始时间不能大于结束时间",
            icon: "none"
          });
          return;
        }
      }
      GetHealthIndicatorRecordListApi();
    };
    const handleReset = () => {
      const todayRange = getTodayRange();
      timeRange.value = todayRange;
      where.RecordTimeRange = todayRange;
      GetHealthIndicatorRecordListApi();
    };
    const formatDateTime = (dateTimeStr) => {
      if (!dateTimeStr)
        return "";
      const date = new Date(dateTimeStr);
      return date.toLocaleString("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
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
          title: "我的健康记录"
        }),
        c: common_vendor.o(onStartTimeChange),
        d: common_vendor.o(($event) => timeRange.value[0] = $event),
        e: common_vendor.p({
          type: "datetime",
          placeholder: "开始时间",
          modelValue: timeRange.value[0]
        }),
        f: common_vendor.o(onEndTimeChange),
        g: common_vendor.o(($event) => timeRange.value[1] = $event),
        h: common_vendor.p({
          type: "datetime",
          placeholder: "结束时间",
          modelValue: timeRange.value[1]
        }),
        i: common_vendor.o(handleQuery),
        j: common_vendor.o(handleReset),
        k: HealthIndicatorRecordList.value.length === 0
      }, HealthIndicatorRecordList.value.length === 0 ? {} : {
        l: common_vendor.f(HealthIndicatorRecordList.value, (item, index, i0) => {
          return common_vendor.e({
            a: item.HealthIndicatorDto.Cover
          }, item.HealthIndicatorDto.Cover ? {
            b: item.HealthIndicatorDto.Cover
          } : {
            c: common_vendor.t(item.HealthIndicatorDto.Name.charAt(0))
          }, {
            d: common_vendor.t(item.HealthIndicatorDto.Name),
            e: common_vendor.t(item.HealthIndicatorTypeDto.Name),
            f: common_vendor.o(($event) => ShowDeleteModal(item.Id), item.Id),
            g: common_vendor.t(item.RecordValue),
            h: item.IsAbnormity === "Y" ? 1 : "",
            i: item.IsAbnormity === "Y"
          }, item.IsAbnormity === "Y" ? {} : {}, {
            j: common_vendor.t(item.HealthIndicatorDto.Threshold),
            k: common_vendor.t(formatDateTime(item.RecordTime)),
            l: common_vendor.t(item.RecordUserDto.Name),
            m: item.HealthIndicatorDto.Content
          }, item.HealthIndicatorDto.Content ? {
            n: common_vendor.t(item.HealthIndicatorDto.Content)
          } : {}, {
            o: item.Id
          });
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-80f964fb"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/Front/HealthIndicatorRecordList.js.map
