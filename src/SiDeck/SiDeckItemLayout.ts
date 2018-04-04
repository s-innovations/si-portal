


import * as ko from "knockout";
import { IKoLayout, KoLayout, KnockoutTemplateBindingHandlerOptions } from "si-kolayout";

import { observable, propergate } from "si-decorators";
import { ioc } from "si-dependency-injection";

import * as SiDeckItemLayoutTemplate from "template!./templates/SiDeckItemLayoutTemplate.html";
import "css!./content/SiDeckItemLayout.less";

import { SiDeckItemHeaderLayout, SiDeckItemHeaderLayoutOptions } from "./SiDeckItemHeaderLayout";
import { SiDeckItemContentLayout, SiDeckItemSepratorLayout } from "./SiDeckItemContentLayout";
import { SiDeckLayout } from "./SiDeckLayout";
import { Logger } from "si-logging";
import { defaults, Factory } from "si-decorators";

import {AppInsightsContext} from "si-appbuilder-application-insights-middleware";

declare module "si-dependency-injection" {
    interface IoC {

        (module:"AppContext"):AppInsightsContext;
    }
}  

export interface SiDeckItemLayoutOptions {
    layout: SiDeckLayout;
    titleOptions?: Partial<SiDeckItemHeaderLayoutOptions>;
    isMaximized?: boolean;
}

const SiDeckItemLayoutDefaults: Factory<Partial<SiDeckItemLayoutOptions>> = {
    isMaximized: () => true
}

declare global {
    interface EventTarget {
        files: FileList;
    }
    interface WebKitFileEntry extends WebKitEntry {
        file(successCallback: (file: File) => void, errorCallback?: WebKitErrorCallback): void;
    }
}

function makeDroppable(element: HTMLElement, callback: (file: File) => PromiseLike<void>) {



    let triggerCallback = async (e: DragEvent) => {
        let logger = new Logger(ioc("AppContext").appInsights);

        var files: FileList;
        if (e.dataTransfer) {
            files = e.dataTransfer.files;
        } else if (e.target) {
            files = e.target.files;
        }

        if (e.dataTransfer.items) {
            logger.logInformation("DragDrop Event recieved with {itemsCount} items", e.dataTransfer.items.length);
            let items = e.dataTransfer.items;

            let filePromises = [] as Array<Promise<File>>;

            for (let i = 0; i < items.length; i++) {
                let item = items[i];
                logger.logInformation("Adding DragDrop Event {itemNumber} {@item} ", i, { kind: item.kind, type: item.type, webkit: "webkitGetAsEntry" in item });
                if (item.kind === "file") {
                    if ("webkitGetAsEntry" in item) {
                        let entry = item.webkitGetAsEntry() as WebKitFileEntry;
                        logger.logInformation("{@entry} {itemNumber} read", {
                            fullPath: entry.fullPath,
                            isDirectory: entry.isDirectory,
                            isFile: entry.isFile,
                            name: entry.name,
                            webkit: "webkitGetAsEntry" in item
                        }, i);

                        filePromises.push(new Promise<File>((resolve, reject) => entry.file(resolve, reject)));



                    } else { 
                        //@ts-ignore
                        await callback(item.getAsFile());
                    }
                }
            }

            for (let promise of filePromises) {

                let file = await promise;

                logger.logInformation("{@file} read", {
                    name: file.name,
                    lastModifiedDate: file.lastModifiedDate,
                    size: file.size,
                    type: file.type,
                    webkitRelativePath: file.webkitRelativePath,
                });
                await callback(file);
            }

        } else {


            for (let j = 0; j < files.length; j++) {
                await callback(files.item(j));
            }

        }

        //Items vs files;


        //if (test) {
        //    for (let i = 0; i < test.length;i++) {
        //        console.log(test[i]);
        //    }
        //}

        //callback.call(null, files);
    }

    var input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('multiple', "true");
    input.style.display = 'none';

    input.addEventListener('change', triggerCallback);
    element.appendChild(input);

    element.addEventListener('dragover', function (e) {
        e.preventDefault();
        e.stopPropagation();
        element.classList.add('dragover');
    });

    element.addEventListener('dragleave', function (e) {
        e.preventDefault();
        e.stopPropagation();
        element.classList.remove('dragover');
    });

    element.addEventListener('drop', function (e) {
        e.preventDefault();
        e.stopPropagation();
        element.classList.remove('dragover');
        triggerCallback(e);
    });




}

@defaults(SiDeckItemLayoutDefaults, true)
export class SiDeckItemLayout extends KoLayout {

    layout: SiDeckLayout;

    header = new SiDeckItemHeaderLayout(Object.assign({ layout: this }, this.attributes.titleOptions || {}));

    @observable isMaximized = true;

    @observable get isVerticalStacked() {
        return !this.isMaximized;
    }

    contentLayouts = ko.observableArray<IKoLayout>([]);

    constructor(protected attributes: SiDeckItemLayoutOptions) {
        super(
            {
                name: SiDeckItemLayoutTemplate,
                as: "$SiDeckItemLayout",
                afterRender: a => this.rendered(a as HTMLElement[])
            } as KnockoutTemplateBindingHandlerOptions);




    }

    added(nodes: Array<Node>, model: any) {
        //console.log(model instanceof SiDeckItemContentLayout);
        if (model instanceof SiDeckItemSepratorLayout) {

            console.log(this.contentLayouts.indexOf(model));
            console.log(arguments);
        }
    }

    @propergate(function (this: SiDeckItemLayout) { return this.attributes.layout }, "closeItem")
    close(a: any, b: any) {

    }

    async rendered(elements: HTMLElement[]) {

        let deckItemElement = elements.filter(e => e.classList.contains("si-deck-item"))[0];
        makeDroppable(deckItemElement, async (file) => {
            await this.fileAdded(file);
        });
    }

    async fileAdded(file: File) {

    }

}

