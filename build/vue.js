"use strict";
(() => {
  // src/shared/util.ts
  var unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/;
  var _toString = Object.prototype.toString;
  var isPlainObject = (val) => _toString.call(val) === "[object Object]";
  var bailRE = new RegExp(`[^${unicodeRegExp.source}.$_\\d]`);

  // src/observer/observer.ts
  var proxy = (target, sourceKey, key) => {
    Object.defineProperty(target, key, {
      get() {
        return this[sourceKey][key];
      },
      set(val) {
        this[sourceKey][key] = val;
      }
    });
  };

  // src/mixin/state.ts
  function initState(vm) {
    const keys = Object.keys(vm.$data);
    keys.forEach((key) => {
      proxy(vm, "_data", key);
    });
    console.log(vm, "111");
  }
  function stateMixin(Vue2) {
    Object.defineProperty(Vue2.prototype, "$data", {
      get() {
        return this._data;
      }
    });
    Object.defineProperty(Vue2.prototype, "$props", {
      get() {
        return this._props;
      }
    });
  }

  // src/mixin/init.ts
  function initMixin(Vue2) {
    Vue2.prototype._init = function(options) {
      this.$options = options;
      this.$data = typeof options.data === "function" ? options.data.call(this) : options.data;
      initState(this);
    };
  }

  // src/mixin/render.ts
  function renderMixin(Vue2) {
    console.log(Vue2);
  }

  // src/mixin/event.ts
  function eventsMixin(Vue2) {
    console.log(Vue2);
  }

  // src/mixin/lifecycle.ts
  function lifecycleMixin(Vue2) {
    console.log(Vue2);
  }

  // src/vue.ts
  var Vue = class {
    // VmWatch;
    constructor(options) {
      this.$data = {};
      if (options && isPlainObject(options)) {
        this.$options = options;
        this._watchers = [];
        this._init(options);
      } else {
        throw new Error("Options \u4F20\u9012\u5BF9\u8C61");
      }
    }
  };
  initMixin(Vue);
  stateMixin(Vue);
  eventsMixin(Vue);
  lifecycleMixin(Vue);
  renderMixin(Vue);
  var vue_default = Vue;
})();
//# sourceMappingURL=vue.js.map
