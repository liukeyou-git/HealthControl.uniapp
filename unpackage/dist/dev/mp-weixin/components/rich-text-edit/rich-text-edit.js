"use strict";
const common_vendor = require("../../common/vendor.js");
const store_index = require("../../store/index.js");
const utils_comm = require("../../utils/comm.js");
const utils_http = require("../../utils/http.js");
const MAX_RETRY_COUNT = 10;
const MAX_EDITOR_READY_RETRY = 10;
const _sfc_main = {
  __name: "rich-text-edit",
  props: {
    modelValue: {
      type: String,
      default: ""
    },
    readOnly: {
      type: Boolean,
      default: false
    }
  },
  emits: ["update:modelValue", "contentChange"],
  setup(__props, { expose: __expose, emit: __emit }) {
    store_index.useCommonStore();
    const instance = common_vendor.getCurrentInstance();
    const props = __props;
    const emit = __emit;
    const formats = common_vendor.ref({});
    const content = common_vendor.ref("");
    const editorCtx = common_vendor.ref(null);
    const editorReady = common_vendor.ref(false);
    const setContentRetryCount = common_vendor.ref(0);
    const editorReadyRetryCount = common_vendor.ref(0);
    common_vendor.watch(() => props.modelValue, (newValue, oldValue) => {
      const newContent = newValue || "";
      const currentContent = content.value || "";
      if (newContent === currentContent) {
        return;
      }
      if (editorReady.value && editorCtx.value) {
        setContentRetryCount.value = 0;
        setContent(newContent);
      } else {
        const checkEditorReady = () => {
          if (editorReady.value && editorCtx.value) {
            setContentRetryCount.value = 0;
            setContent(newContent);
          } else if (setContentRetryCount.value < MAX_RETRY_COUNT) {
            setContentRetryCount.value++;
            setTimeout(checkEditorReady, 200);
          }
        };
        checkEditorReady();
      }
    }, { immediate: true });
    const onEditorReady = () => {
      if (editorReady.value && editorCtx.value) {
        return;
      }
      if (editorReadyRetryCount.value >= MAX_EDITOR_READY_RETRY) {
        common_vendor.index.__f__("error", "at components/rich-text-edit/rich-text-edit.vue:153", "富文本编辑器：初始化失败，已达到最大重试次数");
        return;
      }
      common_vendor.nextTick$1(() => {
        setTimeout(() => {
          try {
            let componentInstance = instance;
            if (instance && instance.proxy) {
              componentInstance = instance.proxy;
            } else if (instance && instance.ctx) {
              componentInstance = instance.ctx;
            }
            let query = common_vendor.index.createSelectorQuery();
            if (componentInstance) {
              query = query.in(componentInstance);
            }
            const selectQuery = query.select("#editor");
            selectQuery.context((res) => {
              if (!res || !res.context) {
                editorReadyRetryCount.value++;
                if (editorReadyRetryCount.value < MAX_EDITOR_READY_RETRY) {
                  common_vendor.index.__f__("warn", "at components/rich-text-edit/rich-text-edit.vue:189", `富文本编辑器：获取上下文失败，将重试 (${editorReadyRetryCount.value}/${MAX_EDITOR_READY_RETRY})`, res);
                  setTimeout(() => {
                    onEditorReady();
                  }, 300);
                } else {
                  common_vendor.index.__f__("error", "at components/rich-text-edit/rich-text-edit.vue:195", "富文本编辑器：获取上下文失败，已达到最大重试次数", res);
                }
                return;
              }
              editorCtx.value = res.context;
              editorReady.value = true;
              editorReadyRetryCount.value = 0;
              setTimeout(() => {
                if (props.modelValue) {
                  setContentRetryCount.value = 0;
                  setContent(props.modelValue);
                }
              }, 200);
            }).exec();
          } catch (error) {
            editorReadyRetryCount.value++;
            if (editorReadyRetryCount.value < MAX_EDITOR_READY_RETRY) {
              common_vendor.index.__f__("warn", "at components/rich-text-edit/rich-text-edit.vue:217", `富文本编辑器：初始化异常，将重试 (${editorReadyRetryCount.value}/${MAX_EDITOR_READY_RETRY}):`, error);
              setTimeout(() => {
                onEditorReady();
              }, 300);
            } else {
              common_vendor.index.__f__("error", "at components/rich-text-edit/rich-text-edit.vue:222", "富文本编辑器：初始化异常，已达到最大重试次数:", error);
            }
          }
        }, 200);
      });
    };
    const undo = () => {
      editorCtx.value.undo();
    };
    const redo = () => {
      editorCtx.value.redo();
    };
    const format = (e) => {
      let { name, value } = e.target.dataset;
      if (!name)
        return;
      editorCtx.value.format(name, value);
    };
    const onStatusChange = (e) => {
      formats.value = e.detail;
    };
    const onEditorInput = () => {
      if (!editorCtx.value || !editorReady.value)
        return;
      editorCtx.value.getContents({
        success: ({ html, text, delta }) => {
          content.value = html;
          emit("update:modelValue", html);
          emit("contentChange", { html, text, delta });
        }
      });
    };
    const insertDivider = () => {
      editorCtx.value.insertDivider({
        success: function() {
        }
      });
    };
    const clear = () => {
      editorCtx.value.clear({
        success: function(res) {
        }
      });
    };
    const removeFormat = () => {
      editorCtx.value.removeFormat();
    };
    const insertDate = () => {
      const date = /* @__PURE__ */ new Date();
      const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
      editorCtx.value.insertText({
        text: formatDate
      });
    };
    const insertImage = async () => {
      try {
        const { tempFilePaths, tempFiles } = await utils_comm.ChooseImageAsync(1);
        if (tempFilePaths && tempFilePaths.length > 0) {
          const { Data } = await utils_http.Upload(tempFilePaths[0]);
          editorCtx.value.insertImage({
            src: Data[0].Url,
            alt: "图像",
            success: function() {
            }
          });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at components/rich-text-edit/rich-text-edit.vue:313", "插入图片失败:", error);
      }
    };
    const getContent = async () => {
      return new Promise((resolve, reject) => {
        editorCtx.value.getContents({
          success: async ({ html, text, delta }) => {
            content.value = html;
            emit("update:modelValue", html);
            emit("contentChange", { html, text, delta });
            resolve(html);
          },
          fail: (err) => {
            reject(err);
          }
        });
      });
    };
    const setContent = (text) => {
      if (!editorCtx.value || !editorReady.value) {
        setContentRetryCount.value++;
        if (setContentRetryCount.value > MAX_RETRY_COUNT) {
          common_vendor.index.__f__("warn", "at components/rich-text-edit/rich-text-edit.vue:342", "富文本编辑器设置内容失败：编辑器未就绪");
          setContentRetryCount.value = 0;
          return;
        }
        setTimeout(() => {
          setContent(text);
        }, 300);
        return;
      }
      setContentRetryCount.value = 0;
      const contentToSet = text || "";
      editorCtx.value.setContents({
        html: contentToSet,
        success: () => {
          content.value = contentToSet;
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at components/rich-text-edit/rich-text-edit.vue:366", "富文本编辑器设置内容失败:", err);
        }
      });
    };
    __expose({
      getContent,
      setContent,
      clear,
      undo,
      redo
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.n(formats.value.bold ? "ql-active" : ""),
        b: common_vendor.n(formats.value.italic ? "ql-active" : ""),
        c: common_vendor.n(formats.value.underline ? "ql-active" : ""),
        d: common_vendor.n(formats.value.strike ? "ql-active" : ""),
        e: common_vendor.n(formats.value.align === "left" ? "ql-active" : ""),
        f: common_vendor.n(formats.value.align === "center" ? "ql-active" : ""),
        g: common_vendor.n(formats.value.align === "right" ? "ql-active" : ""),
        h: common_vendor.n(formats.value.align === "justify" ? "ql-active" : ""),
        i: common_vendor.n(formats.value.lineHeight ? "ql-active" : ""),
        j: common_vendor.n(formats.value.letterSpacing ? "ql-active" : ""),
        k: common_vendor.n(formats.value.marginTop ? "ql-active" : ""),
        l: common_vendor.n(formats.value.previewarginBottom ? "ql-active" : ""),
        m: common_vendor.o(removeFormat),
        n: common_vendor.n(formats.value.fontFamily ? "ql-active" : ""),
        o: common_vendor.n(formats.value.fontSize === "24px" ? "ql-active" : ""),
        p: common_vendor.n(formats.value.color === "#0000ff" ? "ql-active" : ""),
        q: common_vendor.n(formats.value.backgroundColor === "#00ff00" ? "ql-active" : ""),
        r: common_vendor.o(insertDate),
        s: common_vendor.n(formats.value.list === "ordered" ? "ql-active" : ""),
        t: common_vendor.n(formats.value.list === "bullet" ? "ql-active" : ""),
        v: common_vendor.o(undo),
        w: common_vendor.o(redo),
        x: common_vendor.o(insertDivider),
        y: common_vendor.o(insertImage),
        z: common_vendor.n(formats.value.header === 1 ? "ql-active" : ""),
        A: common_vendor.n(formats.value.script === "sub" ? "ql-active" : ""),
        B: common_vendor.n(formats.value.script === "super" ? "ql-active" : ""),
        C: common_vendor.o(clear),
        D: common_vendor.n(formats.value.direction === "rtl" ? "ql-active" : ""),
        E: common_vendor.o(format),
        F: common_vendor.o(onStatusChange),
        G: __props.readOnly,
        H: common_vendor.o(onEditorReady),
        I: common_vendor.o(onEditorInput)
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-0385b401"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/rich-text-edit/rich-text-edit.js.map
