import isDefined from "./isDefined";
 
import { } from "si-kolayout";
export type Constructor<T> = new (...args: any[]) => T;

export function isFunc(objOrFunc: any): objOrFunc is Function {
    return typeof objOrFunc === "function";
}
 

export interface Base {
}

export interface TOGuard<T, O> {
    (o: T | O): o is T
}

export function constructorMapper<VM, VMOptions>(guard: TOGuard<VM, VMOptions>, ctor: new (p: VMOptions) => VM): (o: Array<VM | VMOptions> | VM | VMOptions) => Array<VM> | VM {
    return (o: Array<VM | VMOptions> | VM | VMOptions) => {

        function mapper(vmOrOptions: VM | VMOptions) {
            if (guard(vmOrOptions)) {
                return vmOrOptions;
            } else {
                return new ctor(vmOrOptions);
            }
        }

        if (Array.isArray(o)) {
            return o.map(mapper);
        } else {
            return mapper(o);
        }
    };
}

export function setDefaultProperties(obj: any, props: any, defaults: any, mapper?: any) {
    for (var key in defaults) {
        let value = isDefined(props[key]) ? props[key] : defaults[key];
        obj[key] = mapper && mapper[key] ? mapper[key](value) : value;


    }
}

export function WithDefaultProperties<T extends Base, TOptions>(SuperClass: Constructor<T>) {
    return class extends (<Constructor<Base>>SuperClass) {

        constructor(props: TOptions, defaults: any, ...args: any[]) {
            super(...args);
            setDefaultProperties(this, props, defaults);

        }
    } as Constructor<T>;
}

