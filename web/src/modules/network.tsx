import { ApiClient } from "jewl-core";

const serverUrl = process.env.REACT_APP_SERVER_URL ?? "";
export const apiClient = new ApiClient(serverUrl);
