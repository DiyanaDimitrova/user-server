# user-server

## Setup

To setup the application you need to have installed npm or yarn, and run the following command

```
$ yarn install
```

## Running

To run the application you need to run the following command

```
$ yarn start
$ yarn start:dev
```

## Testing

To test the application you need to run the following commands

```
$ yarn test
$ yarn coverage
```

## Features

User Management API

- HTTP REST API implemented with Node.js, Express.js and MongoDB
- The API contains tests, implemented with Mocha, Chai and Instanbul
- The API have sanitisations checks of the input data
- User Model contains the following attributes:
  - id - a unique user id
  - email - a user's email address
  - givenName - a user's first name
  - familyName - a user's last name
  - created - the date and time the user was added
- Following CRUD operations are possible to be executed on the User model:

| Method           | Purpose                                                      |
| ---------------- | ------------------------------------------------------------ |
| POST /user       | Create user                                                  |
| GET /user        | Return all users                                             |
| GET /user/:id    | Return user based on ID                                      |
| PUT /user/:id    | Update user based on ID                                      |
| DELETE /user/:id | Remove user based on ID                                      |
| GET /posts       | Return all posts by tag and paginated for the front-end task |

## Docker

You need to have installed docker on your machine!

To build image locally execute the following command:

```
$ docker build -t <name> .
```

To run execute the following command:

```
$ docker run -p 3001:3001 -d <name>
```

# License

MIT
