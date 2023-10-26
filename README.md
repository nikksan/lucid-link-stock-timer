# Lucid Link Stock Timer

## Summary

Minimalistic service providing best entry and exit based on a stock price history.

## Requirements

* NodeJS v16.10.0 or newer
* [PostgreSQL Server 15.4 or newer](https://www.postgresql.org/docs/current/tutorial-install.html).

## Setup

### Install required packages

Execute `npm install`

### Configure local environment variables

- Execute `cp .env.sample .env` in the project root directory

## Environment setup

Current working environment could be changed by setting `NODE_ENV` environment variable. Available options are `development` (default), `testing`, `staging` and `production`.

## Usage

* `npm start` - starts the service
* `npm run test` - runs the tests
* `npm run migrate:up` - runs migrations
* `npm run seed <from> <records>` - runs the seeder, expects two arguments - start date and number of records to insert

For example.
```
$ npm run seed "2020-01-01 00:00:00" 1000000
```

## Example flow
```
$ npm install
$ cp .env.sample .env
$ npm run seed "2023-01-01 00:00:00" 2000000
$ npm start
```

## Configuration

Configuration options could be provided by either setting them as environment variables, when the server is run or by putting
them in the `.env` file. Following options are supported:

* `LOG_LEVEL` - log level at which messages should be logged. Following log levels are supported.
  (in priority order, lowest to highest): `error`, `warn`, `info`, `debug`. Defaults to `debug` for dev and `info` for stage/prod
* `SERVER_PORT` - self-explanatory. Defaults to `3000` for dev and `80` for stage/prod
* `SERVER_ENABLE_CORS` - boolean, whether to allow cors or not. Defaults to `true` for dev and `false` for stage/prod
* `DB_NAME` - self-explanatory
* `DB_USER` - self-explanatory
* `DB_PASSWORD` - self-explanatory
* `DB_HOST` - self-explanatory, defaults to `5432`
* `DB_PORT` - self-explanatory, defaults to `localhost`

## API Docs

API documentation is written in OpenAPI 3.0 format and resides within `docs/` directory. It could be accessed via `/docs` endpoint.
