"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var test_1 = require("@playwright/test");
exports.default = test_1.defineConfig({
    projects: [
        {
            name: 'safari',
            use: __assign(__assign({}, test_1.devices['iPhone 13 Mini landscape']), { browserName: 'webkit' }),
        },
        {
            name: 'chromium',
            use: __assign(__assign({}, test_1.devices['iPhone 13 Mini landscape']), { browserName: 'chromium' }),
        },
    ],
});
//# sourceMappingURL=laywright.config.js.map