#include <solana_sdk.h>

extern uint64_t jewl(SolParameters *params) {
    sol_log("static string");
    sol_log_64(params->data[0], params->data[1], params->data[2], params->data[3], params->data[4]);
    sol_log_array(params->data, params->data_len);
    sol_log_pubkey(params->program_id);
    sol_log_params(params);
    sol_log_compute_units();
    return SUCCESS;
}

extern uint64_t entrypoint(const uint8_t *input) {
    SolAccountInfo accounts[1];
    SolParameters params = (SolParameters){ .ka = accounts };

    if (!sol_deserialize(input, &params, SOL_ARRAY_SIZE(accounts))) {
      return ERROR_INVALID_ARGUMENT;
    }

    return jewl(&params);
}
