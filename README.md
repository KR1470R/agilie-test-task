

<h1 align="center">Test task for NodeJS Developer at Agilie</h1>

General information
The system to be developed is part of some fintech application. It supports the following
types of cryptocurrencies with their standard symbols. They are also used on mobile
clients so that only they should be used in all external interfaces, API requests, and
responses: 
 - Bitcoin 
 - BTC Bitcoin Cash 
 - BCH Ethereum - ETH
<hr>

### Tasks
1. It is necessary to develop an API that will allow you to get the exchange rate of one
or more cryptocurrencies to one or more fiat currencies (USD, EUR, CAD, JPY,
GBP, CHF, AUD). The exchange rate must be based on the information from
https://docs.kraken.com/websockets/. At the same time, the API should work as
quickly as possible, so the exchange rates must be received and updated on an
ongoing basis, and when the API is requested, the latest relevant data should be
returned.
2. In the system there is a list of accounts. Each of them has a balance in some
crypto asset and reference fiat currency (both can be generated randomly). Each
day at 00:00 the system should calculate and store the balance of each specific
account in the reference currency according to the latest exchange rate.
<hr>

### TODO
 - [x] Implement 1 task
	 - [x] init project.
	 - [x] implement clever and clear project architecture
	 - [x] create appropriate endpoint for currency exchanging.
	 - [x] add timeout for /prices endpoint.
 - [x] Implement 2 task.
	 - [x] connect PrismaORM PostgreSQL datebase.
	 - [x] add all necessary interfaces and entities.
	 - [x] implement balance exchanger for every user.
 - [x] Add instructions how to run.
 - [x] Code Review.

### How to run & use

 1. Clone
`git clone https://github.com/KR1470R/agilie-test-task.git`
2. Install dependencies
`npm ci` 
3. Run PostgreSQL server via Docker Compose
`docker-compose up` 
4. Run migration to use accounts
`npm run migration`
5. Run server
`npm run start:dev`

### Configuration
In `/.env` file you can change default server and database parameters.

### Testing endpoints

| Method | Endpoint | Description | Request | Response |
|--------|----------|-------------|-------|--------|
| GET    |`/prices` | get the last currency rates | `curl -X GET http://localhost:3000/prices\?pairs\=XBT/USD` |  `{"rates":[{"channelId":340,"exchangePair":"XBT/USD","rate":"26905.20000"}]}`  
| POST |  `/accounts`| create an account with specified crypto balance | `curl -X POST http://localhost:3000/accounts\?pair\=XBT/USD\&balanceCrypto\=10` | 201, if created.|
| GET |  `/accounts` | get list of users | `curl -X GET http://localhost:3000/accounts` | `{"users":[{"id":1,"pair":"XBT/USD","rate":"26951.50000","balanceCrypto":10,"balanceFiat":269515},{"id":2,"pair":"XBT/USD","rate":"26896.40000","balanceCrypto":10,"balanceFiat":268964}]}`|
| POST| `/delete-accounts` | clear all users in db | `curl -X POST http://localhost:3000/delete-accounts` |200, if success.| 

**All currency rates in all users in the database will be updated every midnight to the last currency rate of Kraken Websockets API.**
