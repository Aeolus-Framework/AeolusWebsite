# AeolusWebsite

![Build Status](https://jenkins.aeolus.se/buildStatus/icon?job=aeolus-website)

A Front End prototype in progress for the Aeolus Webapp

# Enviroment variables avaliable

| name                      | description                                    | default                    |
| ------------------------- | ---------------------------------------------- | -------------------------- |
| `API_HOST` _(optional)_   | Host and path to root of aeolus API            | `"https://aeolus.se/api/"` |
| `JWT_ISSUER` _(optional)_ | Issuer to use when creating and verifying JWTs | `"none"`                   |
| `JWT_SECRET` _(optional)_ | Secret to use when creating and verifying JWTs | `"123"`                    |
| `PORT` _(optional)_       | Port that server will listen on                | `5500`                     |
