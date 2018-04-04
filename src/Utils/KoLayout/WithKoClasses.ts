
import * as ko from "knockout";
import { IKoLayout, KoLayout } from "si-kolayout";


/*
*  Are there any way to infer the constructor arguments of T to the returned class?
*  The extension should add the registerClass method to T
*/

export interface KoLayoutConstructor {
    new(...args: any[]): IKoLayout;
}

export interface ClassHandlingExtension extends IKoLayout {
    registerClass(getter: () => string): void;
}
export interface ClassHandlingExtensionConstructable {
    new(...args: any[]): ClassHandlingExtension;
}

export function WithKoClasses<T extends KoLayoutConstructor>(SuperClass: T) {
    return class extends (<KoLayoutConstructor>SuperClass) {

        private _classes: Array<string> = [];

        constructor(...args: any[]) {
            super(...args);

        }

        private classRegistrations = [] as Array<KnockoutComputed<string>>;
        private classes = ko.computed({
            read: () => {

                var value = this._classes.slice(0);
                for (var i in this.classRegistrations) {
                    value.push(this.classRegistrations[i]());
                }
                return value.join(" ");
            },
            deferEvaluation: true,
        });

        registerClass(getter: () => string) {
            var value = ko.computed({
                read: getter,
                deferEvaluation: true,
                owner: this,
                //disposeWhenNodeIsRemoved:el
            });

            this.classRegistrations.push(value);
        }



    } as ClassHandlingExtensionConstructable;
}

export default WithKoClasses;