"use strict";
const common_vendor = require("../../common/vendor.js");
const store_index = require("../../store/index.js");
const utils_comm = require("../../utils/comm.js");
const utils_http = require("../../utils/http.js");
if (!Array) {
  const _easycom_uni_file_picker2 = common_vendor.resolveComponent("uni-file-picker");
  _easycom_uni_file_picker2();
}
const _easycom_uni_file_picker = () => "../../uni_modules/uni-file-picker/components/uni-file-picker/uni-file-picker.js";
if (!Math) {
  _easycom_uni_file_picker();
}
const _sfc_main = {
  __name: "upload-video",
  props: {
    modelValue: {
      type: [Number, String],
      default: ""
    },
    limit: {
      type: Number,
      default: 1
    },
    fileExtname: {
      type: Array,
      default: () => ["mp4", "mov", "avi", "wmv", "flv", "mkv"]
    }
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const commonStore = store_index.useCommonStore();
    common_vendor.computed(() => commonStore.Token);
    common_vendor.computed(() => commonStore.UserInfo);
    common_vendor.computed(() => commonStore.RoleType);
    common_vendor.computed(() => commonStore.UserId);
    const props = __props;
    const emit = __emit;
    const fileLists = common_vendor.ref([]);
    common_vendor.watch(() => props.modelValue, (newVal) => {
      if (newVal) {
        fileLists.value = newVal.split(",").map((x) => {
          let fileInfo = utils_comm.FullConvertUrlArray(x);
          return {
            url: fileInfo[0].url,
            extname: fileInfo[0].type,
            name: fileInfo[0].name
          };
        });
      } else {
        fileLists.value = [];
      }
    }, { immediate: true });
    const select = async (e) => {
      const { tempFilePaths, tempFiles } = e;
      if (tempFilePaths && tempFilePaths.length > 0) {
        for (let tempFilePath of tempFilePaths) {
          let { Data } = await utils_http.Upload(tempFilePath);
          for (var item of Data) {
            let fileInfo = utils_comm.FullConvertUrlArray(item.Url);
            fileLists.value.push({
              url: fileInfo[0].url,
              extname: fileInfo[0].type,
              name: fileInfo[0].name
            });
          }
        }
        covertUrl();
      }
    };
    const progress = (e) => {
    };
    const success = (e) => {
      covertUrl();
    };
    const fail = (e) => {
    };
    const deleteFile = (e) => {
      fileLists.value.splice(e.index, 1);
      covertUrl();
    };
    const covertUrl = () => {
      let url = fileLists.value.length > 0 ? fileLists.value.map((x) => x.url).join(",") : "";
      emit("update:modelValue", url);
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(select),
        b: common_vendor.o(progress),
        c: common_vendor.o(success),
        d: common_vendor.o(fail),
        e: common_vendor.o(deleteFile),
        f: common_vendor.o(($event) => fileLists.value = $event),
        g: common_vendor.p({
          limit: __props.limit,
          title: "最多选择" + __props.limit + "个视频",
          ["file-mediatype"]: "video",
          ["file-extname"]: __props.fileExtname,
          modelValue: fileLists.value
        }),
        h: fileLists.value.length > 0
      }, fileLists.value.length > 0 ? {
        i: common_vendor.f(fileLists.value, (item, index, i0) => {
          return {
            a: item.url,
            b: common_vendor.t(item.name),
            c: index
          };
        })
      } : {});
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-0f288c53"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/upload-video/upload-video.js.map
