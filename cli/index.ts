import prompt from "prompts";

const commands = [
    { title: "mint", description: "Increase the supply of a specific jewl token in the reserves.", value: async (): Promise<unknown> => import("./instructions/mint") },
    { title: "burn", description: "Decrease the supply of a specific jewl token out of the reserves.", value: async (): Promise<unknown> => import("./instructions/burn") },
    { title: "create", description: "Create a new jewl token.", value: async (): Promise<unknown> => import("./instructions/create") },
    { title: "destroy", description: "Destroy an existing jewl token.", value: async (): Promise<unknown> => import("./instructions/destroy") },
    { title: "buy", description: "Buy a specific amount of a specific jewl token from the reserves.", value: async (): Promise<unknown> => import("./instructions/buy") },
    { title: "sell", description: "Sell a specific amount of a specific jewl token to the reserves.", value: async (): Promise<unknown> => import("./instructions/sell") },
    { title: "deposit", description: "Deposit SOL into the reserves.", value: async (): Promise<unknown> => import("./instructions/deposit") },
    { title: "withdraw", description: "Withdraw SOL from the reserves.", value: async (): Promise<unknown> => import("./instructions/withdraw") },
    { title: "reserves", description: "Get the amount in reserves for a specific jewl token.", value: async (): Promise<unknown> => import("./instructions/reserves") },
    { title: "quote", description: "Get a quote for a specific jewl token conversion.", value: async (): Promise<unknown> => import("./instructions/quote") }
];

const response = await prompt({
    type: "select",
    name: "handler",
    message: "Select an instruction to execute",
    choices: commands
}) as { handler: () => Promise<unknown> };

await response.handler();
