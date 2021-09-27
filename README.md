# Mongodb and Jest Testing

[![Ask Me Anything !](https://img.shields.io/badge/Ask%20me-anything-1abc9c.svg)](https://twitter.com/g_kampitakis)

How to test code that uses mongodb as storage.

## Description

I have created a `UserService` class which interacts with mongodb for
`creating`, `retrieving`, `updating` and `deleting` resources in `users`
collection. So in this repository explore different ways of testing the
functionality of that service.

## Development

### Prerequisites

- `yarn` or `npm` installed.
- Latest `nodejs` installed.
- Docker installed.

### Run

In order to run tests locally you need

- Run `yarn` or `npm install` for installing dependencies
- Execute tests
  - For mocks `yarn test:mock` or `npm run test:mock`
  - For docker `yarn test:docker` or `npm run test:docker`
  - For mongodb-memory-server `yarn test:memory` or `npm run test:memory`

## Useful commands

- Run jest in watch mode `yarn test:mock --watchAll`, useful for when writing
  tests.
- Run docker compose from root folder
  `docker-compose -f ./docker-method/docker-compose.yaml <command> <flags>`

## License

MIT License

<p align="center">
✌️ <a href="https://github.com/gkampitakis/mongodb-jest-testing/issues/new">For any questions or issues</a> ✌️
</p>
