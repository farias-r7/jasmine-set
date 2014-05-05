//
// jasmine-set - 0.1.4
//
// A plugin for the Jasmine behavior-driven Javascript testing framework that
// adds a `set` global function. It is inspired by rspec's very nice `let` syntax.
//
// Works in both node.js and a browser environment.
//
// Requires jasmine.js and underscore.js.
//
// @author Joe Vennix
// @copyright Rapid7 2014
// @see https://github.com/jvennix-r7/jasmine-set
//
// Released under the MIT License.
//

(function() {
  var context, install, jasmine;

  install = function(_, jasmine, beforeSuite, afterSuite) {
    var context, globalPatches, namespaceStack, suites;
    suites = {};
    namespaceStack = {};
    context = this;
    globalPatches = {
      set: function(name, opts, fn) {
        var ret;
        beforeSuite(function() {
          var id, obj, _ref, _ref1, _ref2;
          id = jasmine != null ? (_ref = jasmine.getEnv()) != null ? (_ref1 = _ref.currentSpec) != null ? (_ref2 = _ref1.suite) != null ? _ref2.id : void 0 : void 0 : void 0 : void 0;
          obj = _.find(suites[id], function(obj) {
            return obj.name === name;
          });
          if (obj == null) {
            return;
          }
          namespaceStack[name] || (namespaceStack[name] = []);
          namespaceStack[name].push(obj);
          return obj != null ? typeof obj.fn === "function" ? obj.fn() : void 0 : void 0;
        });
        afterSuite(function() {
          var _ref, _ref1;
          delete context[name];
          if ((_ref = namespaceStack[name]) != null) {
            _ref.pop();
          }
          return (_ref1 = _.last(namespaceStack[name])) != null ? typeof _ref1.fn === "function" ? _ref1.fn() : void 0 : void 0;
        });
        if (_.isFunction(opts)) {
          fn = opts;
          opts = null;
        }
        opts || (opts = {});
        if (opts.now == null) {
          opts.now = false;
        }
        ret = function(fn) {
          var doit, id, oncePerSuiteWrapper, setter, _ref, _ref1;
          setter = function(x) {
            oncePerSuiteWrapper();
            delete context[name];
            return context[name] = x;
          };
          oncePerSuiteWrapper = null;
          doit = function() {
            var cachedId, cachedResult;
            if (opts.now) {
              return context[name] = fn();
            } else {
              cachedId = null;
              cachedResult = null;
              oncePerSuiteWrapper = function() {
                var id, _ref, _ref1, _ref2;
                id = (jasmine != null ? (_ref = jasmine.getEnv()) != null ? (_ref1 = _ref.currentSpec) != null ? (_ref2 = _ref1.suite) != null ? _ref2.id : void 0 : void 0 : void 0 : void 0) || globalPatches.__autoIncrement++;
                if (id !== cachedId) {
                  cachedResult = fn();
                  cachedId = id;
                }
                return cachedResult;
              };
              return Object.defineProperty(context, name, {
                get: oncePerSuiteWrapper,
                set: setter,
                configurable: true
              });
            }
          };
          id = jasmine != null ? (_ref = jasmine.getEnv()) != null ? (_ref1 = _ref.currentSuite) != null ? _ref1.id : void 0 : void 0 : void 0;
          suites[id] || (suites[id] = []);
          return suites[id].push({
            fn: doit,
            name: name
          });
        };
        if (fn) {
          return ret(fn);
        } else {
          return ret;
        }
      }
    };
    return _.extend(this, globalPatches);
  };

  context = (typeof window === "object" && window) || (typeof global === "object" && global) || this;

  jasmine = context.jasmine || require("jasmine");

  if (this.beforeSuite == null) {
    require("jasmine-before-suite");
  }

  if (jasmine == null) {
    console.error("jasmine-set: Jasmine must be required first. Aborting.");
  } else {
    install.call(context, context._ || require("underscore"), jasmine, context.beforeSuite, context.afterSuite);
  }

}).call(this);
