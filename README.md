# Project3

Link to ERD: https://lucid.app/lucidchart/c851940a-4834-4f33-8e79-e1b667cee303/edit?viewport_loc=-961%2C-940%2C3320%2C1450%2C0_0&invitationId=inv_5b91520f-53e6-4eb1-b6e6-d10419aea24f

Link to UML: https://lucid.app/lucidchart/95d2fffb-eb0c-4a0c-9f2a-b353c9f06dcb/edit?invitationId=inv_bee2ecda-d4cd-48e6-ace8-89028362625e&page=0_0#

## To import the data

```bash
mongoimport -d pet_store -c orders mongodb://localhost:27017 DATA/orders.json --jsonArray
```

## To run the node app

```bash
npm install
npm start
http://localhost:3000
```
