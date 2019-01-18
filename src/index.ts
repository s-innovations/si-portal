
import * as SiDeck from "./SiDeck/index";
import * as SiDashboard from "./SiDashboard/index";

import * as ko from "knockout";
import { KoLayout } from "si-kolayout";
import { observable, subscribe } from "si-decorators";

import { SiTopBarLayout, SiTopBarLayoutOptions } from "./SiTopBar/SiTopBarLayout";
import { SiDashboardLayout } from "./SiDashboard/SiDashboardLayout";

import * as PortalLayoutTemplate from "template!./templates/PortalLayoutTemplate.html";

import { SiExplorerLayout, SiExplorerLayoutOptions } from "./SiExplorer/SiExplorerLayout";
import { SiDeckLayout } from "./SiDeck/SiDeckLayout";

import { ServiceCollection, ServiceDescription, ServiceProvider, WithIOCInjector, ioc } from "si-dependency-injection";

import "css!flexboxgrid/flexboxgrid.min.css";
import "css!./content/PortalLayout.less";
import {AppInsightsContext} from "si-appbuilder-application-insights-middleware";

 
import { SiContextPaneLayout } from "./SiContextPane/SiContextPaneLayout";

export interface PortalAppContext extends AppInsightsContext{
    serviceCollection:ServiceCollection
}


export interface PortalLayoutOptions {
    context: PortalAppContext;
    topbar?: SiTopBarLayoutOptions;// { title: string, showNotificationsInTopbar?: boolean };
    explorer?: { collapsed: boolean, allResourcesText?: string, showAllResourcesButton?: boolean, showNewResourcesButton?: boolean }
}


declare module "si-dependency-injection" {
    interface IoC {
        (module: "PortalLayout"): PortalLayout;
    }
}    

    

export abstract class PortalLayout extends KoLayout {
    static TYPE = "PortalLayout";

    @observable inEditMode = false;

    @observable topbar: SiTopBarLayout = new SiTopBarLayout(Object.assign(this.layoutOptions.topbar||{}, {
        inEditMode: ko.computed({ read: () =>  this.inEditMode, write: (v) => this.inEditMode = v, deferEvaluation: true })
    }));

    @observable explorer: SiExplorerLayout;

    @observable deck = new SiDeckLayout({});

    @observable rightContextpane = null;

    @observable dashboard = new SiDashboardLayout({
        inEditMode: ko.computed({ read: () => { console.log("read edit"); return this.inEditMode; }, write: (v) => { console.log("write edit"); this.inEditMode = v; }, deferEvaluation: true }),
        tiles: [ ]
    });

    constructor(protected layoutOptions: PortalLayoutOptions) {
        super({ name: PortalLayoutTemplate, afterRender:(n)=>this.afterRender(n) });

        layoutOptions.context.serviceCollection.addSingleton(PortalLayout.TYPE, this);
          



        this.explorer = new SiExplorerLayout(Object.assign({ collapsed: true },layoutOptions.explorer||{}) as SiExplorerLayoutOptions);


               


    }

    afterRender(nodes:Node[]){


    }
    async init() {

        document.body.classList.add("loading-bg");
 
    }


    abstract async processRequest(context: { hash: string });
}



export { SiDashboard, SiDeck};

export default PortalLayout;