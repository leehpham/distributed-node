#!/bin/bash

# The steps noted with CSR would be run on ONE very private machine,
# one that is just used for certificate generation purposes.

# The steps noted with APP would be performed on behalf of the new application.

# Happens once for the CA

# 1: CRS: Generate a private key ca-private-key.key for the Cerficate Authority (CA).
# You'll be prompted for a password. (use `abc123`` for now)
# `genrsa`: generate an RSA private key
# `-des3`: encrypts the private key with the des3 cipher.
# `-out`: output the key to the specified file.
openssl genrsa -des3 -out ca-private-key.key

# 2: CRC: Generate a root cert shared/tls/ca-certificate.cert (this will be provided to clients).
# You'll get asked a lot of questions, but they don't matter for this example.
# `openssl req`: cert request and cert generating.
# `-x509`: outputs a cert instead of a cert request.
# `-new`: generate a new cert request.
# `-noenc`: no encryption for newly created private key.
# `-key`: provides the private key for signing the new cert.
# `-days`: specifies the number of days to certify the cert for.
# `-out`: output the cert to the specified file.
openssl req -x509 -new -noenc -key ca-private-key.key \
  -sha256 -days 365 -out shared/tls/ca-certificate.cert

# Happens for each new certificate

# 3: APP: Generate a private key `producer-private-key.key` for a particular service.
# `2048`: key size in bits.
openssl genrsa -out recipe-api/tls/producer-private-key.key 2048

# 4: APP: Create a CSR (Certificate signing request) `producer.csr` for that same service.
# Be sure to answer `localhost` for the Common Name question,
# but other questions don't matter as much.
openssl req -new -key recipe-api/tls/producer-private-key.key \
  -out recipe-api/tls/producer.csr

# 5: CSR: Generate a service certificate producer-certificate.cert signed by the CA.
# `x509`: cert display and signing utility.
# `-req`: expects a cert request as an input.
# `-in`: input filename to read the cert request from.
# `-CA`: specifies the CA cert to be used for signing.
# `-CAkey`: sets the CA private key to sign a cert with.
# `-CAcreateserial`: creates a CA serial number file.
# `-out`: specifies the output filename to write to
# `-days arg`: specifies the number of days to make a cert valid for.
openssl x509 -req -in recipe-api/tls/producer.csr \
  -CA shared/tls/ca-certificate.cert \
  -CAkey ca-private-key.key -CAcreateserial \
  -out shared/tls/producer-certificate.cert -days 365 -sha256
