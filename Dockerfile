FROM alpine:3.20

# Add ca-certificates for HTTPS
RUN apk add --no-cache ca-certificates

# Copy the locally built binary (from root build/fix/)
COPY build/fix/ledger /usr/local/bin/formance-ledger

# Set entrypoint
ENTRYPOINT ["/usr/local/bin/formance-ledger"]
