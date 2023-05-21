
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
 - [ ] Implement 2 task.
	 - [x] connect PrismaORM PostgreSQL datebase.
	 - [x] add all necessary interfaces and entities.
	 - [ ] implement balance exchanger for every user. 

