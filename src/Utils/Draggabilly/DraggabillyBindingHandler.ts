import * as ko from "knockout";
import Draggabilly = require("draggabilly");
import isDefined from "../isDefined";


interface DraggabillyViewModel {
    draggie: Draggabilly;
    dragOptions: DraggabilityOptions;
    onDragStart(): void;
    onDragMove(): void;
    onDragEnd(): void;
}
interface DraggabillyKnockoutBindingContext extends KnockoutBindingContext {
    draggie: Draggabilly;
}

function registerEvent(draggie: Draggabilly, handler: Function, name: string) {
    if (isDefined(handler)) {
        draggie.on(name, handler);
    }
}
function createDraggie(bindingContext: DraggabillyKnockoutBindingContext, element: HTMLElement, dragHandler: DraggabillyViewModel) {
    if (!bindingContext.draggie) {

        bindingContext.draggie = dragHandler.draggie = new Draggabilly(element, dragHandler.dragOptions);

        registerEvent(dragHandler.draggie, dragHandler.onDragStart, "dragStart");
        registerEvent(dragHandler.draggie, dragHandler.onDragMove, "dragMove");
        if ("onDragEnd" in dragHandler) {
            registerEvent(dragHandler.draggie, dragHandler.onDragEnd, "dragEnd");
        }

    } else {
        bindingContext.draggie.enable();
    }
}
function destroyDraggie(bindingContext: DraggabillyKnockoutBindingContext, element: HTMLElement, dragHandler: DraggabillyViewModel) {
    if (bindingContext.draggie) {

        bindingContext.draggie.disable();
        if (dragHandler) {
            //delete dragHandler.draggie;
        }
    }
}
ko.bindingHandlers.draggabilly = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {




    },
    update: function (element: HTMLElement, valueAccessor, allBindingsAccessor, viewModel, bindingContext: DraggabillyKnockoutBindingContext) {


        var vm = valueAccessor();
        var dragHandler = ko.unwrap(vm);
        if (isDefined(dragHandler)) {

            if (isDefined(dragHandler.if)) {
                if (ko.unwrap(dragHandler.if)) {
                    createDraggie(bindingContext, element, dragHandler);
                } else {
                    destroyDraggie(bindingContext, element, dragHandler);
                }
            } else {
                createDraggie(bindingContext, element, dragHandler);
            }


        } else {
            destroyDraggie(bindingContext, element, dragHandler);
        }

        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            // or whatever code is necessary to clean-up the widget
            destroyDraggie(bindingContext, element, dragHandler);
            delete bindingContext.draggie;
        })

    }
}

export default Draggabilly;