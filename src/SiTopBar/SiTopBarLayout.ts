
import * as ko from "knockout";
import { KoLayout, KnockoutTemplateBindingHandlerOptions } from "si-kolayout";

 

import { defaults, Factory, observable} from "si-decorators";
import * as PortalLayoutTemplate from "template!./templates/SiTopBarLayoutTemplate.html";
import "css!./content/TopBarLayout.less";
import { SiContextPaneLayout } from "../SiContextPane/SiContextPaneLayout";

import { ioc } from "si-dependency-injection";
declare module "si-dependency-injection" {
    interface IoC {
        (module: "AuthorizationManager"): any;
        (module: "UserManager"): any;
    }
}  

export class SiAvatarMenu {

    @observable displayName: string;
    @observable tooltip: string;
   

    @observable isAvatarOpen = false;

    @observable isTrial = false;

    @observable get currentTenantDisplayName() {
        return this.isTrial ? "Trial" : "Sponsor"
    };

    constructor() {

        let auth = ioc("AuthorizationManager");

        this.displayName = auth.user.profile.name;
        this.tooltip = this.displayName;
        this.isTrial = auth.user.profile.idp === "ApplicationTrialAccounts";
    }

    toggleAvatarMenu() {
        this.isAvatarOpen = !this.isAvatarOpen;
    }

    async signOut() {
       // await ioc("UserManager").clearStaleState();
       // await ioc("UserManager").removeUser();
        await ioc("UserManager").signoutRedirect({
            post_logout_redirect_uri: `${location.protocol}//${location.host}${location.pathname}`,
            id_token_hint: ioc("AuthorizationManager").user.id_token
        });
    }

    signUp() {
        this.isAvatarOpen = false;
      //  ioc("PortalLayout").rightContextpane = new SignupContextPaneLayout({ onClose: () => ioc("PortalLayout").rightContextpane = null });
    }
}


export interface SiTopBarLayoutOptions {
    inEditMode: boolean | KnockoutObservable<boolean>
}



const SiTopBarLayoutDefaults = {
    inEditMode: ()=>false
} as Factory<Partial<SiTopBarLayoutOptions>>

@defaults(SiTopBarLayoutDefaults, true)
export class SiTopBarLayout extends KoLayout {

    @observable inEditMode: boolean;

    @observable showMenu = false;
    @observable showSearching = false;
    @observable isExpanded = false;

    @observable isNotificationsOpen = false;
   
 

    avatarMenu = new SiAvatarMenu(); 

    constructor(options: SiTopBarLayoutOptions) {
        super({
                name: PortalLayoutTemplate,
                as: "$SiTopBarLayout"                   
            });

       

    }
    complete() {
        this.inEditMode = false;
    }

    toggleNotifications() {
        this.isNotificationsOpen = !this.isNotificationsOpen;
        
        ioc("PortalLayout").rightContextpane = this.isNotificationsOpen ? new SiContextPaneLayout({
            onClose: () => this.toggleNotifications(),
            hasNotifications: true
        }) : null;
        
    }

   
}

