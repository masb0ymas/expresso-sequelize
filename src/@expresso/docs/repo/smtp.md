# Simple Mail Transfer Protocol (SMTP)

I am using the `nodemailer`, `nodemailer-mailgun-transport` and `googleapis` package to email provider.

## Config

There are several ways to use smtp, the first is basic, the second is mailgun api, and googleapis.

### Basic

```sh
MAIL_DRIVER=smtp
MAIL_HOST=smtp.mailgun.org
MAIL_PORT=465
MAIL_AUTH_TYPE=
MAIL_USERNAME=your_mail@domain.com
MAIL_PASSWORD=your_password
MAIL_ENCRYPTION=
```

### Using Mailgun API

```sh
MAILGUN_API_KEY=your_api_key_mailgun
MAILGUN_DOMAIN=your_domain
```

### Using Google OAuth ( Gmail )

```sh
MAIL_DRIVER=gmail
MAIL_HOST=
MAIL_PORT=
MAIL_AUTH_TYPE=OAuth2
MAIL_USERNAME=your_account@gmail.com
MAIL_PASSWORD=
MAIL_ENCRYPTION=

OAUTH_CLIENT_ID=your_client_id
OAUTH_CLIENT_SECRET=your_client_secret
OAUTH_REDIRECT_URL=https://developers.google.com/oauthplayground
OAUTH_REFRESH_TOKEN=your_refresh_token
```

[Setup Google OAuth](https://medium.com/@nickroach_50526/sending-emails-with-node-js-using-smtp-gmail-and-oauth2-316fe9c790a1)

## HTML Template

To be able to process data in html I use [handlebars](https://www.npmjs.com/package/handlebars). how to use it like this:

```html
...

<span style="font-size: 16px">
  <b>Hai {{ fullName }},</b>
  <br /><br />
  Thank you for registering an account at
  <strong>{{ APP_NAME }}</strong>.
</span>

...
```

## Send Mail

You can define the send mail function according to your needs at `helpers/SendMail.ts`

```javascript
// helpers/SendMail.ts

...

const subject = 'Email Verification'
const urlToken = `${BASE_URL_CLIENT}/email/verify?token=${token}`
const dataTemplate = { APP_NAME, fullName, urlToken }

// initial class email provider
const Email = new EmailProvider()

readHTMLFile(pathTemplate, (error: Error, html: any) => {
  if (error) {
    throw new ResponseError.NotFound('email template not found')
  }

  // compale handlebars html
  const template = handlebars.compile(html)
  const htmlToSend = template(dataTemplate)

  // call the send function in the email class
  Email.send(email, subject, htmlToSend)
})
```

How to implement the send mail:

```javascript
// controllers/auth/service.ts

...

// Initial Send an e-mail
SendMail.AccountRegister(formData, tokenVerify)

...
```
