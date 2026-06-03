# Architecture

# Server
## API Overview

| Method | Endpoint                      | Description                                                          |
| ------ | ----------------------------- | -------------------------------------------------------------------- |
| GET    | /api/links                    | Retrieve all active links for the authenticated user.                |
| POST   | /api/links                    | Create a shorten link with optional expiration date and/or password. |
| POST   | /api/links/verify             | Verify a password for a protected link and authorize access.         |
| DELETE | /api/links/:id                | Soft-delete a single link.                                           |
| DELETE | /api/links/bulk-delete        | Soft-delete multiple links                                           |
| GET    | /api/dashboard/overview       | Retrieve summary data for the authenticated user.                    |
| GET    | /api/dashboard/creation-trend | Retrieve authenticated user's creation count for last 30 days.       |
| GET    | /api/users                    | List all active users.                                               |
| POST   | /api/users                    | Create a new user.                                                   |
| patch  | /api/users/:id                | Update user account.                                                 |
| DELETE | /api/users/:id                | Soft-delete user account.                                            |
| GET    | /api/user/profile             | Get/Refresh the user session.                                        |

## Link Creation Flow

```mermaid
flowchart TD
    %% Define styles
    classDef user fill:#45c234,stroke:#4b5563,color:#fff;
    classDef public fill:#3b82f6,stroke:#2563eb,color:#fff;
    classDef backend fill:#10b981,stroke:#059669,color:#fff;
    classDef db fill:#f59e0b,stroke:#d97706,color:#fff;

    Start([User: Create Short Link])
    Form[Enter Long URL & Settings]
    Submit[Submit Form]
    
    BackendValidate[Server: Validate Request]
    GenSlug[Generate/Validate Slug]
    DBInsert[(DB: Insert into Links Table)]
    
    CheckSession{Logged In?}
    AttachUser[Attach userId to Record]
    StoreAnonymous[Save as Guest Link]
    
    Response[Return Short URL]

    
    %% Flow
    Start --> Form
    Form --> Submit
    Submit --> BackendValidate
    
    BackendValidate --> GenSlug
    GenSlug --> DBInsert
    
    DBInsert --> CheckSession
    CheckSession -- Yes --> AttachUser
    CheckSession -- No --> StoreAnonymous
    
    AttachUser --> Response
    StoreAnonymous --> Response
    
    Response --> ShowLink[Show Short URL]

    %% Styles
    class Start,Form,Submit,ShowLink,Login user;
    class BackendValidate,GenSlug,CheckSession,AttachUser,StoreAnonymous,Response,AuthCheck public;
    class DBInsert,FetchUserLinks db;
```

## Link Redirection Flow

See `/server/middleware/01.redirect.ts`.

```mermaid
%%{init: {
  'theme': 'base',
  'themeVariables': {
    'fontFamily': 'sans-serif',
    'fontSize': '14px'
  }
}%%
flowchart TD
    %% Node Definitions
    Start([Incoming Request])
    Filter{Method GET/HEAD?}
    ParsePath[Parse Pathname]
    CheckSlug{Slug Valid & Not Reserved?}
    DBLookup[Query DB for Active Link]
    Found{Link Found?}
    IsProtected{Is Password Protected?}
    CheckCookie{"Already entered password? (authorized_slug Cookie)"}
    SetIntent["Set session Cookie (prevent retry)"]
    RedirectProtect["`Redirect to /protect/slug and ask for the link password`"]
    RedirectFinal[Redirect to Long URL]
    IncrementCount[Increment Hit Count]
    Handle404[Throw 404 Error]
    PasswordCorrect{Password correct?}

    %% Flow Execution
    Start --> Filter
    Filter -- No --> End[Pass to next handler]
    Filter -- Yes --> ParsePath
    ParsePath --> CheckSlug
    CheckSlug -- No --> End
    CheckSlug -- Yes --> DBLookup
    DBLookup --> Found
    
    Found -- No --> Handle404
    Found -- Yes --> IsProtected
    
    IsProtected -- No --> RedirectFinal
    IsProtected -- Yes --> CheckCookie
    
    CheckCookie -- Yes --> RedirectFinal
    CheckCookie -- No --> SetIntent
    SetIntent --> RedirectProtect
    RedirectProtect --> PasswordCorrect
    PasswordCorrect -- Yes --> RedirectFinal
    PasswordCorrect -- No --> RedirectProtect
    
    RedirectFinal --> IncrementCount
    
    %% Styles
    classDef gate fill:#fef3c7,stroke:#b45309,stroke-width:2px,color:#78350f;
    classDef action fill:#dcfce7,stroke:#15803d,stroke-width:2px,color:#166534;
    classDef error fill:#fee2e2,stroke:#b91c1c,stroke-width:2px,color:#991b1b;
    
    class CheckSlug,Found,IsProtected,CheckCookie,PasswordCorrect gate;
    class RedirectFinal,SetIntent,IncrementCount action;
    class Handle404 error;
```
