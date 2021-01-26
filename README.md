#RC20 webapp
This script invoke RC20 and transfer tokens between ethereuem accounts.

Edit config.js:

```shell
config.sm_address: smart contracts address when deployed
config.account_address: you account address please copy one of your Metamask account
config.node_api: past here your rinkbey link from infura
config.private_key = copy your private key from Metamask it should be related to (account_address)
```
Then install requirements:
```shell
npm install
```
One finished, start the app:
```shell
npm start
```