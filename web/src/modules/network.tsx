import { ApiClient } from "jewl-core";

/**
    The server url to connect to as fetched from the
    env variables.
**/
const serverUrl = process.env.REACT_APP_SERVER_URL ?? "";

/**
    A client to connect to the jewl.app api.
**/
export const apiClient = new ApiClient(serverUrl);
