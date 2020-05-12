import React from "react";
import { Switch, Route } from "react-router-dom";
import { withOidcSecure } from "@axa-fr/react-oidc-context";
import { AuthenticatedComponent } from "../AuthenticatedComponent";

const PageNotFound = () => <div>Page not found</div>;
function Home() {
    return <div>The home component</div>;
}

function Callback(props: any) {
    console.log(props);
    return <div> got called back</div>;
}

function Pix(props: any) {
    console.log("Sunt un pix");
    return <div>pixu</div>;
}

export function Routes() {
    return (
        <Switch>
            <Route path="/pix" component={Pix} />
            <Route path="/dashboard/callback.html" component={Callback} />
            <Route path="/authenticated" component={withOidcSecure(AuthenticatedComponent)} />
            <Route exact path="/" component={Home} />
            <Route component={PageNotFound} />
        </Switch>
    );
}
