# Tech Debits

## Backend

- lock mechanism for deposit once it has a limit of 25% of all unpaid jobs. jobs must be locked.
- add username and password to Profiles
- Implement auth with JWT..
- improve testing (date ranges) and possibly buggy implementation for best professions and best clients
- Write tests to cover the non official end end points - /login and /profiles
- get sqlite working with docker


## Front end

- complete refactor once it is being built in a pretty limited time range.
- implement test suite - unit
- implement test suite - e2e with cypress
- update login component to use username and password.
- improve the application state workflow by implementing more Data Providers using the Context API.

## Suggestions

- Refactor the backend to follow the `Hexagonal Architecture` and `DDD` patterns.
    - Generic Handlers - it would support ExpressJS and aws Lambdas. Then we can deploy different kind of use cases.
    - Data repositories could give the ability to agnostic consume different databases.

The above changes, by nature, give the ability to run as DDD monolithic app under Express.js. Not least also easily drives a `microservice` approach.

When it comes to support `Lambda Functions`, in coordination with the serverless framework, we can have different repos for each domains, which increase complexity, or we can have just one code repository applying a DDD monolithic approach. Each domain and it use case have a respective Lambda handler / end point. Though when deploying it with the serverless framework
will going to result in different Lambdas instances, that in other words, is meaning you still are running microservices rather a monolithic instance.
