### Create Sign of Request Package
Kuveyt Turk API Market currently supports two authorization flows:

* The authorization code flow is used to obtain both access tokens and refresh tokens and is optimized for confidential clients. Since this is a redirection-based flow, the client must be capable of interacting with the resource owner's user-agent (typically a web browser) and capable of receiving incoming requests (via redirection) from the authorization server.

* Client Authentication flow allows you to call Kuveyt Turk APIs by supplying your client credentials (client ID and secret key). This flow is used in server-to-server authentication. Only endpoints that do not access user information can be accessed.

To allow you to call Kuveyt Turk APIs which are required the authorization code flow, you have to add signature to request header. For post methods, you must be sign access token and request body. For get methods, you must be sign only access token and query string.

To sign a request, you need a certificate which can be verisign or not. You can create a certificate with openssl. After generation private key and public key, you must be add the public key to your application page on Kuveyt Turk API Market. API Gateway of Kuveyt Turk validates the request with your public key.

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
