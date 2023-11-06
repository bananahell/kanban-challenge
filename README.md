# Kanban Challenge

Pedro Nogueira  
25 of October, 2023  

## Introduction

I've received this challenge in the 25<sup>th</sup> of October, 2023, with the deadline on the 9<sup>th</sup> of November.  
This is a back-end project that will use NestJS with typescript as framework and PostgresSQL as database.  

This is a Kanban board project with user authorization management.  
It has the functionalities of a board that contains status lists and task cards organized in them. Each task card can have attachments, comments, work checklists, and be grouped by tags.  
Users' password data is safely stored as hashes in the database. Users in this system can only edit a board's contents and manage its users if they're that board's owner, ownership which can be passed on to other users. Only users inserted into a board can see its cards and edit them, and comments made in cards can only be edited by their creators. A JWT session is opened at user's sign in, and the user uses JWT passport to have their actions in the application validated.  

## Usage

[All available commands](https://github.com/bananahell/kanban-challenge/blob/main/kanban-board/package.json) runnable inside the [kanban board folder](https://github.com/bananahell/kanban-challenge/tree/main/kanban-board).  
Run ```docker compose up dev-db -d``` to create a docker container using the [database's configuration](https://github.com/bananahell/kanban-challenge/blob/main/kanban-board/docker-compose.yml).  
To restart databases, run ```npm run db:dev:restart``` for development environment and ```npm run db:test:restart``` for test environment.  
Run ```npm run start:debug``` to start server.  
Run ```npm run test:e2e``` to run end to end tests.  


[Docs folder](https://github.com/bananahell/kanban-challenge/tree/main/docs) contains a ["daily mock"](https://github.com/bananahell/kanban-challenge/blob/main/docs/work-journal.txt) in text form, and the database's diagram in [PNG format](https://github.com/bananahell/kanban-challenge/blob/main/docs/bd-diagram.png) and [text format](https://github.com/bananahell/kanban-challenge/blob/main/docs/bd-diagram.txt).  

Using [npm](https://www.npmjs.com/) version 20.9.0.  
The project uses [PostgreSQL](https://www.postgresql.org/) inside a [Docker](https://www.docker.com/) container.  
[Prisma](https://www.prisma.io/) is used to connect the project with the database.  
For class validation pipes inside my DTOs, I'm using [Validation pipes](https://docs.nestjs.com/techniques/validation).  
For password hash creation, I'm using [argon2](https://www.npmjs.com/package/argon2).  
For environment variables usage, [NestJS config](https://docs.nestjs.com/techniques/configuration).  
For JWT passports for authentication usage, [JWT passports](https://docs.nestjs.com/security/authentication).  
For e2e test mocking, I'm using [pactum](https://pactumjs.github.io/).  
To use different config files in dev and testing, I'm using [dotenv](https://docs.nestjs.com/techniques/configuration).  
