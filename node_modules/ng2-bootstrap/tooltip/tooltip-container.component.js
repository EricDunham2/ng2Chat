"use strict";
var core_1 = require('@angular/core');
var tooltip_config_1 = require('./tooltip.config');
var ng2_bootstrap_config_1 = require('../utils/ng2-bootstrap-config');
var TooltipContainerComponent = (function () {
    function TooltipContainerComponent(config) {
        Object.assign(this, config);
    }
    Object.defineProperty(TooltipContainerComponent.prototype, "isBs3", {
        get: function () {
            return ng2_bootstrap_config_1.isBs3();
        },
        enumerable: true,
        configurable: true
    });
    TooltipContainerComponent.prototype.ngAfterViewInit = function () {
        this.classMap = { in: false, fade: false };
        this.classMap[this.placement] = true;
        this.classMap['tooltip-' + this.placement] = true;
        this.classMap.in = true;
        if (this.animation) {
            this.classMap.fade = true;
        }
        if (this.popupClass) {
            this.classMap[this.popupClass] = true;
        }
    };
    TooltipContainerComponent.decorators = [
        { type: core_1.Component, args: [{
                    selector: 'bs-tooltip-container',
                    changeDetection: core_1.ChangeDetectionStrategy.OnPush,
                    // tslint:disable-next-line
                    host: {
                        '[class]': '"tooltip in tooltip-" + placement + " " + placement',
                        '[class.show]': '!isBs3',
                        role: 'tooltip'
                    },
                    template: "\n    <div class=\"tooltip-arrow\"></div>\n    <div class=\"tooltip-inner\"><ng-content></ng-content></div>\n    "
                },] },
    ];
    /** @nocollapse */
    TooltipContainerComponent.ctorParameters = function () { return [
        { type: tooltip_config_1.TooltipConfig, },
    ]; };
    return TooltipContainerComponent;
}());
exports.TooltipContainerComponent = TooltipContainerComponent;
