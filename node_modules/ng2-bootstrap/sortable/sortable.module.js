"use strict";
var core_1 = require('@angular/core');
var common_1 = require('@angular/common');
var sortable_component_1 = require('./sortable.component');
var draggable_item_service_1 = require('./draggable-item.service');
var SortableModule = (function () {
    function SortableModule() {
    }
    SortableModule.forRoot = function () {
        return { ngModule: SortableModule, providers: [draggable_item_service_1.DraggableItemService] };
    };
    SortableModule.decorators = [
        { type: core_1.NgModule, args: [{
                    declarations: [sortable_component_1.SortableComponent],
                    imports: [common_1.CommonModule],
                    exports: [sortable_component_1.SortableComponent]
                },] },
    ];
    /** @nocollapse */
    SortableModule.ctorParameters = function () { return []; };
    return SortableModule;
}());
exports.SortableModule = SortableModule;
