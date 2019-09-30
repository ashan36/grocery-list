## Problem
Creating a real-time syncing, shareable grocery list.

## Solution
In order to make this web app, my first thought was to make it an SPA. For any user only one page really needs to be displayed and the bulk of the content is the list itself. I also love responsiveness they can provide, so this makes the app feel more real time. To serve the app, I would use an Node express server.

## Technical Decisions
A majority of the tech stack decision were made by attempting to balance the vision I had for how I wanted the app to work, and my familiarity with each technology. Limited time made the latter concern increasingly more important, however it was also a goal to try things I've never done before and grow while working on this project.

## Tech Stack
- Database - PostGRES
- ORM - Sequelize
- Backend - Node.js
- Static Route Handler - Express
- Event Driven Server-Client Communication - Socket.io
- Frontend - React
- CSS Layout - Bootstrap
- Deployment - Heroku
- Testing - Jasmine

## Other Concerns
1. Right now the app stores too much data as objects from the database as state (User IDs, List IDs, etc), I also pass this info back and forth to allow the client to specify what it's requesting from the server. This couples the server's handling of requests with the client more than I would like. I think this is pretty unsafe and would allow someone to abuse my app in ways I hadn't planned for.

2. The app restricts the user from taking certain actions unless they are the owner of a list. This is accomplished only on the client side currently. If I spent more time working on it, I would implement some additional server side validation of inputs and to also validate the source of requests.

3. The app communicates with the user pretty heavily using window alerts, which I think isn't great for the user experience, but was done out of expediency. I would like to implement a cleaner way to provide this kind of information to the user.
