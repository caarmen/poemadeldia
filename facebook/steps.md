# Steps to implement posting to a Facebook page.

## 1. Store these parameters:

Not secret:
* `fb_app_id`
* `fb_page_id`
* `fb_api_version` (v20.0)

Secret:
* `fb_client_secret`

## 2. Get a long-lived page access token.
### 2.1. MANUAL INTERACTION: Get a short lived user access token from the website
https://developers.facebook.com/tools/explorer/

Save it as `fb_short_lived_user_access_token`

### 2.2. Get long-lived user access token:
GET https://graph.facebook.com/{{fb_api_version}}/oauth/access_token?grant_type=fb_exchange_token&client_id={{fb_app_id}}&client_secret={{fb_client_secret}}&fb_exchange_token={{fb_short_lived_user_access_token}}

Returns body like this:
```json
{
    "access_token": "..."
}
```
Save the value of `access_token` as `fb_long_lived_user_access_token`.

### 2.3. Get the app-scoped user id:
https://graph.facebook.com/{{fb_api_version}}/debug_token?input_token={{fb_short_lived_user_access_token}}&access_token={{fb_short_lived_user_access_token}}
(Also works with `fb_long_lived_user_access_token`)

Returns a body like this:
```json
{
    "data": {
        "user_id": "..."
    }
}
```

Save the value of `user_id` as `fb_app_scoped_user_id`.

### 2.4. Get long-lived page access token:
https://graph.facebook.com/{{fb_api_version}}/{{fb_app_scoped_user_id}}/accounts?access_token={{fb_long_lived_user_access_token}}

Returns a body like this:
```json
{
    "data": [
        {
            "access_token": "..."
        }
    ]
}
```

Save the value of `access_token` as `fb_long_lived_page_access_token`.

## 3. Post to the page:
POST https://graph.facebook.com/{{fb_api_version}}/{{fb_page_id}}/feed

headers:
* `Content-Type: application/x-www-form-urlencoded`

form fields:
* `access_token`: `fb_long_lived_page_access_token`
* `message`: content

