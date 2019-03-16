import * as ko from "knockout";

export function propergateToParent() {
    return (target: any, key: string) => {


        // if (!(key in target)) {
        let old = Object.getOwnPropertyDescriptor(target, key);

        return {
            configurable: false,
            value: function (vm: any, event: MouseEvent) {

                let ctx = ko.contextFor(event.target as Node);
                let parent: Function = ctx["$parent"][key];
                parent.apply(ctx["$parent"], arguments);
                //let parent = getter.call(this);

                //parent[parentKey || key].apply(parent, Array.prototype.concat.apply([], arguments).concat([this]));
                //old.value.apply(this, arguments);
            }
        };
        // }

    };
}
