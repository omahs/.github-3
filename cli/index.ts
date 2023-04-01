import prompt from "prompts";

const commands = [
    { title: "init", description: "Initialize the jewl.app program's state.", value: async (): Promise<unknown> => import("./instructions/init") },
    { title: "create", description: "Add a new jewl token to the jewl program", value: async (): Promise<unknown> => import("./instructions/create") },
    { title: "destroy", description: "Destroy an existing jewl token and reclaim rent.", value: async (): Promise<unknown> => import("./instructions/destroy") },
    { title: "mint", description: "Mint a specific amount of a jewl token in exchange for SOL.", value: async (): Promise<unknown> => import("./instructions/mint") },
    { title: "burn", description: "Burn a specific amount of a jewl token in exchange for SOL", value: async (): Promise<unknown> => import("./instructions/burn") },
    { title: "deposit", description: "Deposit SOL into the jewl.app vault.", value: async (): Promise<unknown> => import("./instructions/deposit") },
    { title: "withdraw", description: "Withdraw SOL from the jewl.app vault.", value: async (): Promise<unknown> => import("./instructions/withdraw") },
    { title: "supply", description: "Get the supply and health of the jewl.app program.", value: async (): Promise<unknown> => import("./instructions/supply") },
    { title: "balance", description: "Get the balances of the current signing account.", value: async (): Promise<unknown> => import("./instructions/balance") }
];

const response = await prompt({
    type: "select",
    name: "handler",
    message: "Select an instruction to execute",
    choices: commands
}) as { handler: () => Promise<unknown> };

await response.handler();
