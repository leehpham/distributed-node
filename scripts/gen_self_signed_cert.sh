#!/bin/bash

# TODO: might need to consider the relative path (or use an absolute path).

mkdir -p ./{recipe-api,shared}/tls

# `openssl req`: cert request and cert generating command.
# `-noenc`: the output private key will not be encrypted.
# `-x509`: outputs a cert instead of a cert request.
# `-keyout filename`: name of the private key.
# `-out filename`: name of the cert.
openssl req -noenc -x509 \
  -keyout recipe-api/tls/basic-private-key.key \
  -out shared/tls/basic-certificate.cert
