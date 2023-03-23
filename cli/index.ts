import prompt from "prompts";

const commands = [
    { title: "mint", description: "Increase the supply of a specific jewl token in the reserves.", value: async (): Promise<unknown> => import("./mint") },
    { title: "burn", description: "Decrease the supply of a specific jewl token out of the reserves.", value: async (): Promise<unknown> => import("./burn") },
    { title: "create", description: "Create a new jewl token.", value: async (): Promise<unknown> => import("./create") },
    { title: "destroy", description: "Destroy an existing jewl token.", value: async (): Promise<unknown> => import("./destroy") },
    { title: "buy", description: "Buy a specific amount of a specific jewl token from the reserves.", value: async (): Promise<unknown> => import("./buy") },
    { title: "sell", description: "Sell a specific amount of a specific jewl token to the reserves.", value: async (): Promise<unknown> => import("./sell") },
    { title: "deposit", description: "Deposit SOL into the reserves.", value: async (): Promise<unknown> => import("./deposit") },
    { title: "withdraw", description: "Withdraw SOL from the reserves.", value: async (): Promise<unknown> => import("./withdraw") }
];

const response = await prompt({
    type: "select",
    name: "handler",
    message: "Select an instruction to execute",
    choices: commands
}) as { handler: () => Promise<unknown> };

await response.handler();
