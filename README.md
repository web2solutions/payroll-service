# Simple Payroll Service

This project is organized as a monorepo that coordinates a [backend](./backend) and a [frontend](./frontend) project.

The [backend](./backend) is a REST API with some different end points and the [frontend](./frontend) is consuming that API.

It was made as a Home Task for Deel. Please see the [original requirements](./README_original.md)

## Tech debits

Due the time limitation, there is a [list with some known tech debits](./TECH-DEBITS.md) that I would like to complete.

## Application stacks

### Backend

- Javascript
- Express
- Express Parser
- Sequelize
- SQLite
- Supertest
- Redis

### Frontend

- React
- Context API
- fetch API
- Bootstrap css

### Project tooling

- Git
- Eslint
- Husky
- Commitizen
- npm
- Docker



## Testing

Due the time limitation, actually only the [backend](./backend) have a [test suite](./backend/test/integration/).

Rather than to write unit tests to cover the application, I decided to implement integration tests.

To test the backend application you need to navigate to it folder through your terminal in prior.

```bash
    $   cd backend
```

***`Note1:`  Do not start the API to test it.***
***`Note2:`  Delete the file `/backend/database.sqlite3`, if it exists, before running the tests .***

Now you can run the test suite:

```bash
    $   npm test
```


## How to run the application?

If you don't have Docker then you can manual run it.

### Manually running the applications

It is recommended to have at least the version `18` of `Node.js`.

You will need to have [Redis](https://redis.io/docs/install/install-redis/) installed to manual run the application

#### Install

To get able to reach the frontend application and see it running integrated with the backend, you need to install it prior.

```bash
    $   npm run install:all
```

***Please do not run `npm install` because it will not install both projects.***

#### Run the applications.

This project offers a command that concurrently starts both applications.

```bash
    $   npm start
```

Now you can reach it through your preferred browser by accessing `http://localhost:3000/`.


### Running the applications with Docker


```bash
    $   npm run docker
```

Once the containers are started, you can reach it through your preferred browser by accessing `http://localhost:3000/`.
