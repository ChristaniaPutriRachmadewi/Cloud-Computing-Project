# IT Support Ticketing System

## Project Overview

The IT Support Ticketing System is a containerized web application
designed to manage IT-related issues and service requests within
an organization.

Users can submit support tickets, while IT Support Staff can
assign, prioritize, investigate, and resolve reported issues.

## Project Objectives

- Submit IT support requests
- Generate unique ticket IDs
- Assign tickets to IT technicians
- Track ticket priorities and statuses
- Record ticket resolutions
- Store ticket data in a database
- Monitor application health

## Technology Stack

- React
- Node.js
- Express.js
- Nginx
- Docker
- Docker Compose
- Amazon EC2
- Amazon ECR
- Amazon RDS MySQL

## Architecture

The system consists of two containerized application services:

1. React Web UI served through Nginx
2. Node.js and Express REST API

The backend connects to MySQL for persistent ticket storage.

The application will be deployed on Amazon EC2, with
container images stored in Amazon ECR and the database
hosted on Amazon RDS.

## Ticket Status

- OPEN
- ASSIGNED
- IN_PROGRESS
- RESOLVED
- CLOSED
- CANCELLED

## Project Structure

```text
it-ticketing-system/
├── backend/
├── frontend/
├── docs/
├── README.md
└── .gitignore