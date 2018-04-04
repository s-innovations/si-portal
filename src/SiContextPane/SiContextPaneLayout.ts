
import * as ko from "knockout";
import { KoLayout, KnockoutTemplateBindingHandlerOptions } from "si-kolayout";



import { defaults, Factory, observable } from "si-decorators";
import * as PortalLayoutTemplate from "template!./templates/SiContextPaneLayoutTemplate.html";
import * as SiNotificationContextPanelContentLayoutTemplate from "template!./templates/SiNotificationContextPanelContentLayoutTemplate.html";
import * as SiSignupContextPanelContentLayoutTemplate from "template!./templates/SiSignupContextPanelContentLayoutTemplate.html";

import "css!./content/SiContextPaneLayout.less";


 
import { Friend } from "si-friendly";
 
import { PasswordInputLayout,EmailInputLayout, TextInputLayout } from "si-forms";
import { ioc } from "si-dependency-injection";


export class SiNotificationContextPanelContentLayout extends KoLayout {
    constructor() {
        super({ name: SiNotificationContextPanelContentLayoutTemplate})
    }
    @observable hasNotifications = false;

    dismissOptions = [{
        name: "Informational",
        isEnabled: true
    }, {
        name: "Completed",
        isEnabled: true
    }, {
        name: "All",
        isEnabled: true
    }];
}

export interface SiContextPaneLayoutOptions {
    onClose?: any
    hasNotifications?: boolean;
}



const SiContextPaneLayoutDefaults = {
    hasNotifications: () => false
} as Factory<Partial<SiContextPaneLayoutOptions>>

@defaults(SiContextPaneLayoutDefaults, true)
export class SiContextPaneLayout extends KoLayout {

    @observable content: KoLayout= new SiNotificationContextPanelContentLayout();
  
   

    constructor(protected attributes: SiContextPaneLayoutOptions) {
        super({
            name: PortalLayoutTemplate,
            as: "$SiContextPaneLayout"
        });


    }

    close() {
        this.attributes.onClose();
    }
}

// export class SiSignupContextPanelContentLayout extends KoLayout {

   
//     firstName = new TextInputLayout({ label: "First Name", name: "first_name" });
//     lastName = new TextInputLayout({ label: "Last Name", name: "last_name" });
//     email = new EmailInputLayout({ label: "Email", name: "email" });
//     phone = new TextInputLayout({ label: "Phone", name: "phone" });
//     password = new PasswordInputLayout({ label: "Password", name: "password" });

//     @observable friend = new Friend({
//         lookAt: [this.firstName, this.email, this.phone, this.lastName],
//         coverEyes: () => this.password.hasFocus
//     });

//     stripe = Stripe(stripConfiguration.publishableKey);
//     card;
//     constructor() {
//         super({ name: SiSignupContextPanelContentLayoutTemplate, afterRender : ()=>this.afterRender() })
//     }
//     afterRender() {
      
 
//         // Create a Stripe client.
//         // Create a Stripe client.
       

//         // Create an instance of Elements.
//         var elements = this.stripe.elements();

//         // Custom styling can be passed to options when creating an Element.
//         // (Note that this demo uses a wider set of styles than the guide below.)
//         var style = {
//             base: {
//                 color: '#32325d',
//                 lineHeight: '18px',
//                 fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
//                 fontSmoothing: 'antialiased',
//                 fontSize: '16px',
//                 '::placeholder': {
//                     color: '#aab7c4'
//                 }
//             },
//             invalid: {
//                 color: '#fa755a',
//                 iconColor: '#fa755a'
//             }
//         };

//         // Create an instance of the card Element.
//         this.card = elements.create('card', { style: style });
//         this.card.on("focus", () => this.friend.coverEyes());
//         // Add an instance of the card Element into the `card-element` <div>.
//         this.card.mount('#card-element');

//         // Handle real-time validation errors from the card Element.
//         this.card.addEventListener('change', (event) => {

//             this.friend.coverEyes();

//             var displayError = document.getElementById('card-errors');
//             if (event.error) {
//                 displayError.textContent = event.error.message;
//             } else {
//                 displayError.textContent = '';
//             }
//         });

//         // Handle form submission.
//         //var form = document.getElementById('payment-form');
//         //form.addEventListener('submit', function (event) {
//         //    event.preventDefault();

           
//         //});
//     }

//     async submit() {
//         let result = await this.stripe.createToken(this.card);

//             if (result.error) {
//                 // Inform the user if there was an error.
//                 var errorElement = document.getElementById('card-errors');
//                 errorElement.textContent = result.error.message;
//             } else {
//                 // Send the token to your server.
//                 // stripeTokenHandler(result.token);
//                 console.log(result.token);

               

//                 let user = await fetch(`${ioc("AppContext").endpoints.resourceApiEndpoint}/providers/EarthML.Identity/users/me`,
//                     {                    
//                         credentials: "include",
//                         headers: new Headers({
//                             "Content-Type": "application/json",
//                             "Authorization": "Bearer " + ioc("AuthorizationManager").user.access_token
//                         }),
//                         body: JSON.stringify({
//                             first_name: this.firstName.fieldState.value,
//                             last_name: this.lastName.fieldState.value,
//                             phone: this.phone.fieldState.value,
//                             userName: this.email.fieldState.value,
//                             password: this.password.fieldState.value,
//                             stripeToken: result.token, 
//                         }),     
//                         method: "PUT"
//                     });

//                 let user1 = await ioc("UserManager").getUser();
//                 console.log(user);
//                 console.log(user1);

//                 let a = await ioc("UserManager").signinSilent();
//                 console.log(a);

//                 location.reload();
//             }
 
//     }
// }

// export class SignupContextPaneLayout extends SiContextPaneLayout {

//     constructor(options: SiContextPaneLayoutOptions) {
//         super(options);
//         this.content = new SiSignupContextPanelContentLayout();
//     }
// }