import "./greeting.css";
import { useAuth0 } from "@auth0/auth0-react";
import type { ReactElement } from "react";
import { useEffect } from "react";
import React, { useMemo } from "react";

/**
    The Greeting component that gets a virtual username
    from the user's email and renders that in the component.
**/
const Greeting = (): ReactElement => {
    const { user, getAccessTokenSilently } = useAuth0();

    const username = useMemo(() => {
        if (user?.email == null) { return ""; }
        const parts = user.email.split("@");
        if (parts.length === 0) { return ""; }
        return parts[0];
    }, [user]);

    useEffect(() => {
        getAccessTokenSilently()
            .then(console.log)
            .catch(console.log);
    }, []);

    return <div className="greeting-title">Hi, {username}!</div>;
};

export default Greeting;
