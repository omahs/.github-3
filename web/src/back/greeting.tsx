import "./greeting.css";
import { useAuth0 } from "@auth0/auth0-react";
import type { ReactElement } from "react";
import React, { useMemo } from "react";

const Greeting = (): ReactElement => {
    const { user } = useAuth0();

    const username = useMemo(() => {
        if (user?.email == null) { return ""; }
        const parts = user.email.split("@");
        if (parts.length === 0) { return ""; }
        return parts[0];
    }, [user]);

    return <div className="greeting-title">Hi, {username}!</div>;
};

export default Greeting;
