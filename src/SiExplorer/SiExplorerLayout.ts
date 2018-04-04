


import { AzurePortalSideBarLayout } from "./AzurePortalSideBarLayout";
import { PortalLayout } from "../index";
import { WithIOCInjector } from "si-dependency-injection";
import { observable, defaults } from "si-decorators";
import { SiDeckItemLayout } from "../SiDeck/SiDeckItemLayout";
 
import { SiDeckItemContentLayout } from "../SiDeck/SiDeckItemContentLayout";


import * as module from "module";
import { ioc } from "si-dependency-injection";
 

export interface SiExplorerLayoutOptions {
    collapsed: boolean;
    portalLayout?:PortalLayout;
}

const SiExplorerLayoutDefaults={
    portalLayout : ()=>ioc("PortalLayout")
};

defaults(SiExplorerLayoutDefaults,true)
export class SiExplorerLayout extends AzurePortalSideBarLayout {

    @observable portalLayout: PortalLayout;

    constructor(options: SiExplorerLayoutOptions) {
        super(options || {
            collapsed: false,
            favorites: {
                favorites: [
                    { opensExternal: true, label: "Test 1", uri: "#/Test1" },
                    { opensExternal: true, label: "Test 2", uri: "#/Test2" },
                    { opensExternal: true, label: "Test 3", uri: "#/Test3" },
                    { opensExternal: true, label: "Test 4", uri: "#/Test4" },
                    { opensExternal: true, label: "Test 5", uri: "#/Test5" },
                ]
            }
        })
       
       
        
    }

    async createNew(vm: any, event: Event) {

        location.hash = "/deck/create-new";   
    }

    showResources(vm, event) {

        location.hash = "/deck/list-resources";
        return new Promise((resolve, reject) => {
            setTimeout(resolve, 10000);
        });
    }
}

//export const SiExplorerLayoutIoCEnabled = WithIOCInjector(SiExplorerLayout, `ioc!PortalLayout`);

