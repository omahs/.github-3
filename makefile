OUT_DIR := dist
SRC_DIR := sol
SOLANA_TOOLS = $(shell dirname $(shell which cargo-build-bpf))
include $(SOLANA_TOOLS)/sdk/bpf/c/bpf.mk
