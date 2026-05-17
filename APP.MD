# Technical Specification – Note Taking Web App

## 1. Overview

This is a web application to control users and appointments from a gym or a pilates studio.
User can have two types, in group or individual.
I like to create an admin page, that can have some specific user to access all the pages, create users, control agendar and user details

### Core Features

- User authentication (sign up, login, logout) via better-auth
- Authenticated note management (CRUD)
- Rich text editor using TipTap with:
  - Bold, Italic
  - Heading levels (H1–H3) + normal text
  - Inline code + code blocks
  - Bullet lists
  - Horizontal rules
  - Public sharing of notes via a public URL (toggle on/off)

  ### 3 New Feaures

- Notes should be related to a specific user if needed
- Create and admin section to control the user data
- Create a user pages that will contain all the data from the user profile

### 3.1 Notes Management (Authenticated)

- Noted can be related to a specific user

### 3.2 Admin Management (Authenticated)

- CRUD to create, edit or update users profiles, there is no delete, but the user can have two status, active or not
- The active user should appear on the agenda list of users
- Delete shoild inactivate the user

### Users Management (Authenticated)

- List of users by status, active or inactive
