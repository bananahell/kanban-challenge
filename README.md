# Kanban Challenge

Pedro Nogueira  
25 of October, 2023  

## Usage

The project uses Postgres inside a [Docker](https://www.docker.com/) container.  

[Prisma](https://www.prisma.io/) is used to connect the project with the database.  

For class validation pipes inside my DTOs, I'm using [Validation pipes](https://docs.nestjs.com/techniques/validation).  

For password hash creation, I'm using [argon2](https://www.npmjs.com/package/argon2).  

For environment variables usage, [NestJS config](https://docs.nestjs.com/techniques/configuration).  

For JWT passports for authentication usage, [JWT passports](https://docs.nestjs.com/security/authentication).  

## Introduction

I've received this challenge in the 25<sup>th</sup> of October, 2023, with the deadline on the 9<sup>th</sup> of November.  
This is a back-end project that will use NestJS with typescript as framework and PostgresSQL as database.  

The project is a Kanban board with user authorization management.  