# AeolusWebsite

![Build Status](https://jenkins.aeolus.se/buildStatus/icon?job=aeolus-website)

A Front End prototype in progress for the Aeolus Webapp

# Enviroment variables avaliable

| name                            | description                                                 | default                    |
| ------------------------------- | ----------------------------------------------------------- | -------------------------- |
| `MONGODB_HOST`                  | Host with a mongo instance running, may include port number |
| `MONGODB_DATABASE`              | Database to use                                             |
| `GOOGLE_CLIENT_ID`              | Google OAuth client ID                                      |
| `GOOGLE_CLIENT_SECRET`          | Google OAuth client secret                                  |
| `MONGODB_USERNAME` _(optional)_ | Username to access database                                 | _None_                     |
| `MONGODB_PASSWORD` _(optional)_ | Password to access database                                 | _None_                     |
| `API_HOST` _(optional)_         | Host and path to root of aeolus API                         | `"https://aeolus.se/api/"` |
| `JWT_ISSUER` _(optional)_       | Issuer to use when creating and verifying JWTs              | `"none"`                   |
| `JWT_SECRET` _(optional)_       | Secret to use when creating and verifying JWTs              | `"123"`                    |
| `PORT` _(optional)_             | Port that server will listen on                             | `5500`                     |
