"use strict";
const common_vendor = require("../../common/vendor.js");
const store_index = require("../../store/index.js");
const utils_http = require("../../utils/http.js");
const utils_comm = require("../../utils/comm.js");
if (!Array) {
  const _easycom_uni_nav_bar2 = common_vendor.resolveComponent("uni-nav-bar");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_datetime_picker2 = common_vendor.resolveComponent("uni-datetime-picker");
  (_easycom_uni_nav_bar2 + _easycom_uni_icons2 + _easycom_uni_datetime_picker2)();
}
const _easycom_uni_nav_bar = () => "../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.js";
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_datetime_picker = () => "../../uni_modules/uni-datetime-picker/components/uni-datetime-picker/uni-datetime-picker.js";
if (!Math) {
  (_easycom_uni_nav_bar + _easycom_uni_icons + _easycom_uni_datetime_picker)();
}
const _sfc_main = {
  __name: "BatchRecordForm",
  setup(__props) {
    const commonStore = store_index.useCommonStore();
    common_vendor.computed(() => commonStore.Token);
    common_vendor.computed(() => commonStore.UserInfo);
    const UserId = common_vendor.computed(() => commonStore.UserId);
    const indicatorList = common_vendor.ref([]);
    const recordData = common_vendor.ref([]);
    common_vendor.onLoad(async (option) => {
      try {
        indicatorList.value = JSON.parse(common_vendor.index.getStorageSync("selectedIndicators"));
        initRecordData();
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/Front/BatchRecordForm.vue:108", "解析指标数据失败:", error);
        common_vendor.index.showToast({
          title: "数据解析失败",
          icon: "error"
        });
        setTimeout(() => {
          common_vendor.index.navigateBack();
        }, 1500);
      }
    });
    const initRecordData = () => {
      recordData.value = indicatorList.value.map((indicator) => ({
        HealthIndicatorTypeId: indicator.HealthIndicatorTypeId,
        HealthIndicatorId: indicator.Id,
        RecordUserId: UserId.value,
        RecordTime: utils_comm.GetFormatFullDate(/* @__PURE__ */ new Date()),
        RecordValue: "",
        IsAbnormity: false
      }));
    };
    const checkAbnormity = (index) => {
      const record = recordData.value[index];
      const indicator = indicatorList.value[index];
      if (!record.RecordValue || !indicator.Threshold) {
        record.IsAbnormity = false;
        return;
      }
      const value = parseFloat(record.RecordValue);
      const threshold = indicator.Threshold;
      if (threshold.includes("-")) {
        const [min, max] = threshold.split("-").map((v) => parseFloat(v.trim()));
        record.IsAbnormity = value < min || value > max;
      } else if (threshold.includes(">")) {
        const min = parseFloat(threshold.replace(">", "").trim());
        record.IsAbnormity = value <= min;
      } else if (threshold.includes("<")) {
        const max = parseFloat(threshold.replace("<", "").trim());
        record.IsAbnormity = value >= max;
      } else {
        record.IsAbnormity = false;
      }
    };
    const getUnit = (threshold) => {
      const units = ["ml", "mg/dl", "mmol/L", "mIU/L", "pmol/L", "%", "bpm", "mmHg"];
      for (const unit of units) {
        if (threshold.includes(unit)) {
          return unit;
        }
      }
      return "";
    };
    const formatDateTime = (dateTime) => {
      if (!dateTime)
        return "";
      const date = new Date(dateTime);
      return date.toLocaleString("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
      });
    };
    const validRecordsCount = common_vendor.computed(() => {
      return recordData.value.filter((record) => record.RecordValue && record.RecordTime).length;
    });
    const isFormValid = common_vendor.computed(() => {
      return validRecordsCount.value > 0;
    });
    const submitRecords = async () => {
      if (!isFormValid.value) {
        common_vendor.index.showToast({
          title: "请至少填写一项数据",
          icon: "none"
        });
        return;
      }
      try {
        common_vendor.index.showLoading({ title: "提交中..." });
        const validRecords = recordData.value.filter(
          (record) => record.RecordValue && record.RecordTime
        ).map((record) => ({
          ...record,
          RecordValue: parseFloat(record.RecordValue),
          IsAbnormity: record.IsAbnormity ? "Y" : "N"
        }));
        const { Success } = await utils_http.Post("/HealthIndicatorRecord/BatchAdd", validRecords);
        common_vendor.index.hideLoading();
        if (Success) {
          common_vendor.index.showToast({
            title: "提交成功",
            icon: "success"
          });
          setTimeout(() => {
            common_vendor.index.navigateBack();
          }, 1500);
        }
      } catch (error) {
        common_vendor.index.hideLoading();
        common_vendor.index.__f__("error", "at pages/Front/BatchRecordForm.vue:233", "提交失败:", error);
        common_vendor.index.showToast({
          title: "提交失败",
          icon: "error"
        });
      }
    };
    const goBack = () => {
      common_vendor.index.navigateBack();
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(goBack),
        b: common_vendor.p({
          dark: true,
          fixed: true,
          shadow: true,
          ["background-color"]: "var(--primary-color)",
          ["status-bar"]: true,
          ["left-icon"]: "left",
          title: "批量录入数据"
        }),
        c: common_vendor.p({
          type: "list",
          size: "20",
          color: "#4CAF50"
        }),
        d: common_vendor.t(indicatorList.value.length),
        e: common_vendor.f(indicatorList.value, (indicator, index, i0) => {
          return common_vendor.e({
            a: indicator.Cover
          }, indicator.Cover ? {
            b: indicator.Cover
          } : {
            c: "b3a71a80-2-" + i0,
            d: common_vendor.p({
              type: "pulse",
              size: "20",
              color: "#4CAF50"
            })
          }, {
            e: common_vendor.t(indicator.Name),
            f: common_vendor.t(indicator.HealthIndicatorTypeName),
            g: common_vendor.t(indicator.Threshold),
            h: common_vendor.t(indicator.Content),
            i: common_vendor.o([($event) => recordData.value[index].RecordValue = $event.detail.value, ($event) => checkAbnormity(index)], indicator.Id),
            j: recordData.value[index].RecordValue,
            k: common_vendor.t(getUnit(indicator.Threshold)),
            l: common_vendor.t(formatDateTime(recordData.value[index].RecordTime) || "点击选择时间"),
            m: "b3a71a80-3-" + i0,
            n: common_vendor.o(($event) => recordData.value[index].RecordTime = $event, indicator.Id),
            o: common_vendor.p({
              type: "datetime",
              ["clear-icon"]: false,
              modelValue: recordData.value[index].RecordTime
            }),
            p: recordData.value[index].IsAbnormity
          }, recordData.value[index].IsAbnormity ? {
            q: "b3a71a80-4-" + i0,
            r: common_vendor.p({
              type: "info-filled",
              size: "16",
              color: "#FF9800"
            })
          } : {}, {
            s: indicator.Id
          });
        }),
        f: common_vendor.t(validRecordsCount.value),
        g: common_vendor.t(indicatorList.value.length),
        h: common_vendor.o(submitRecords),
        i: !isFormValid.value
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-b3a71a80"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/Front/BatchRecordForm.js.map
