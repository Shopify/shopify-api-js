---
"@shopify/shopify-api": minor
---
Updates the Session class to handle the associated user information on the session object.

Updates the Session `fromPropertyArray` to handle all user info fields.

<details>

```ts
const sessionProperties = session.toPropertyArray(true);
/*
  if sessionProperties has the following data...
  [
    ['id', 'online_session_id'],
    ['shop', 'online-session-shop'],
    ['state', 'online-session-state'],
    ['isOnline', true],
    ['scope', 'online-session-scope'],
    ['accessToken', 'online-session-token'],
    ['expires', 1641013200000],  // example = January 1, 2022, as number of milliseconds since Jan 1, 1970
    ['userId', 1],
    ['first_name', 'online-session-first-name'],
    ['last_name', 'online-session-last-name'],
    ['email', 'online-session-email'],
    ['locale', 'online-session-locale'],
    ['email_verified', false]
    ['account_owner', true,]
    ['collaborator', false],
    ],
 */

const session = Session.fromPropertyArray(sessionProperties, true);
/*
  ... then session will have the following data...
  {
    id: 'online_session_id',
    shop: 'online-session-shop',
    state: 'online-session-state',
    isOnline: true,
    scope: 'online-session-scope',
    accessToken: 'online-session-token',
    expires: 2022-01-01T05:00:00.000Z,  // Date object
    onlineAccessInfo: {
      associated_user: {
        id: 1,
        first_name: 'online-session-first-name'
        last_name: 'online-session-last-name',
        email: 'online-session-email',
        locale: 'online-session-locale',
        email_verified: false,
        account_owner: true,
        collaborator: false,
      },
    }
  }
 */
```

</details>

Updates the Session `toPropertyArray` to handle all user info fields. New optional argument `returnUserData`, (defaulted to `false`), will return the user data as part of property array object. This will be defaulted to `true` in an upcoming version.

<details>

```ts
const {session, headers} = shopify.auth.callback({
  rawRequest: req,
  rawResponse: res,
});

/*
  If session has the following data content...
  {
    id: 'online_session_id',
    shop: 'online-session-shop',
    state: 'online-session-state',
    isOnline: true,
    scope: 'online-session-scope',
    accessToken: 'online-session-token',
    expires: 2022-01-01T05:00:00.000Z,  // Date object
    onlineAccessInfo: {
      expires_in: 1,
      associated_user_scope: 'online-session-user-scope',
      associated_user: {
        id: 1,
        first_name: 'online-session-first-name',
        last_name: 'online-session-last-name',
        email: 'online-session-email',
        locale: 'online-session-locale',
        email_verified: true,
        account_owner: true,
        collaborator: false,
      },
    }
  }
 */

const sessionProperties = session.toPropertyArray();
/*
  ... then sessionProperties will have the following data...
   [
    ['id', 'online_session_id'],
    ['shop', 'online-session-shop'],
    ['state', 'online-session-state'],
    ['isOnline', true],
    ['scope', 'online-session-scope'],
    ['accessToken', 'online-session-token'],
    ['expires', 1641013200000],  // example = January 1, 2022, as number of milliseconds since Jan 1, 1970
    ['userId', 1], // New returns the user id under the userId key instead of onlineAccessInfo
    ['first_name', 'online-session-first-name'],
    ['last_name', 'online-session-last-name'],
    ['email', 'online-session-email'],
    ['locale', 'online-session-locale'],
    ['email_verified', false]
    ['account_owner', true,]
    ['collaborator', false],
    ],
 */
```
</details>
