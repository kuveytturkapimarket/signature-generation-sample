### Create Sign of Request Package
Kuveyt Turk API Market currently supports two authorization flows:

* The authorization code flow is used to obtain both access tokens and refresh tokens and is optimized for confidential clients. Since this is a redirection-based flow, the client must be capable of interacting with the resource owner's user-agent (typically a web browser) and capable of receiving incoming requests (via redirection) from the authorization server.

* The client credentials flow allows you to call Kuveyt Turk APIs by supplying your client credentials (client ID and secret key). This flow is used in server-to-server authentication. Only endpoints that do not access user information can be accessed.

To call the Kuveyt Turk APIs which require the authorization code flow, you have to add a signature to the request header. For POST methods, you must sign the access token and the request body. For GET methods, you must sign the access token and query string.

To sign a request, you need a digital certificate. You can either get a certificate from Verisign or similar trusted certificate providers, or create a certificate with OpenSSL. After generating the private key and the public key, you must add the public key to your application page on Kuveyt Turk API Market. Then, Kuveyt Turk API Gateway validates the request with your public key.

### Sample Request to Generating Signature
```
curl -X POST \
  http://localhost:3000 \
  -H 'authorization: Bearer daccfc535ad80ed4f281550ec08a4c1ab02f18f02511b5bdc475e3a12e127b4c' \
  -H 'content-type: application/json' \
  -d '{
  "SenderAccountSuffix": 1,
  "ReceiverName": "Dohn",
  "ReceiverIBAN": "TR660020500009105718200001",
  "Amount": 1,
  "Comment": "test test",
  "PaymentTypeId": 99
}'
```
### Sample Request For Sending Money To IBAN with Signature
```
curl -X POST \
  https://apitest.kuveytturk.com.tr/prep/v1/transfers/ToIBAN \
  -H 'authorization: Bearer daccfc535ad80ed4f281550ec08a4c1ab02f18f02511b5bdc475e3a12e127b4c' \
  -H 'content-type: application/json' \
  -H 'signature: bCT3GBj/1wsQuHcM3AZQFF2YBmGcp/iKMdS+o6RoTIH+S8jSXPLD6WHVUcgeA+gvCZ1QV4F4bBqMzYtta4glvfs6K6gCg3QSpEAmDGs0WT8cSW3fEfAgJ6nCwReMlo/Dnthvg2nRnJabHdVYz82WMWDeMpt/F2SQ6ub9koCD2Co=' \
  -d '{
  "SenderAccountSuffix": 1,
  "ReceiverName": "Dohn",
  "ReceiverIBAN": "TR660020500009105718200001",
  "Amount": 1,
  "Comment": "test test",
  "PaymentTypeId": 99
}'
```
