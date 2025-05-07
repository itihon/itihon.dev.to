---
published: true
title: 'Using the same validation logic on the client and server side with Isomorphic-validation.'
cover_image: 'https://raw.githubusercontent.com/itihon/itihon.dev.to/master/blog-posts/using-the-same-validation-logic-on-client-and-server-side/assets/cover.png'
description: 'A step by step tutorial of using isomorphic-validation javascript library on the client and server side.'
tags: webdev, javascript, validation, api
series:
canonical_url:
---

In this post I want to briefly describe the usage of **Isomorphic-validation**, a [javascript validation library](https://itihon.github.io/isomorphic-validation/) that was intended to be used on the client and server side and make the process of validating user input seamless across your application.

In the two previous posts I covered some aspects of using this library on the client side by creating a sign-in and sign-up form:

 - [Part 1](https://dev.to/itihon/quick-introduction-to-isomorphic-validation-javascript-library-48p6)
 - [Part 2](https://dev.to/itihon/handling-asynchronous-validators-and-mutually-dependent-fields-using-isomorphic-validation-library-n96)

 Here I will show why this library is actually isomorphic. I'm going to incorporate that sign-in and sign-up examples into a simple `Node.js` application.

 If you want to run this project locally it is there:

 {% cta https://github.com/itihon/signup_signin_example_actualized %}
 View on Github 
 {% endcta %}

## 0. Setting up the project

First, I created the following folder structure:

```bash
.
⊟── public
│   ⊞─── bundles
│   ├── signin.html
│   ├── signup.html
│   └── style.css
├── repository.js
⊟─── validation
    ⊞── profiles
    ⊞── ui
    ⊞── validations
    ⊞── validators
```

{% details repository.js %}
```js
// repository.js
```
{% enddetails %}

{% details public/signin.html %}
```html
<!-- public/signin.html -->
```
{% enddetails %}

{% details public/signup.html %}
```html
<!-- public/signup.html -->
```
{% enddetails %}

{% details public/style.css %}
```scss
// public/style.css
```
{% enddetails %}

I didn't want to set up the whole database for this simple demonstration, so I just created a mock repository file with registerd e-mail addresses in order to implement the checking an e-mail for existance functionality on the sign-up form.

## 1. Preparing validators

```bash
.
⊞─── public
├── repository.js
⊟─── validation
    ⊞── profiles
    ⊞── ui
    ⊞── validations
    ⊟── validators
        ├── is-email.js
        ├── is-email-not-registered.js
        ├── is-email-not-registered-s.js
        ├── is-max-length.js
        ├── is-min-length.js
        ├── is-password-confirmed.js
        └── is-strong-password.js
```

{% details validation/validators/is-email.js %}
```js
// validation/validators/is-email.js
```
{% enddetails %}

{% details validation/validators/is-email-not-registered.js %}
```js
// validation/validators/is-email-not-registered.js
```
{% enddetails %}

{% details validation/validators/is-email-not-registered-s.js %}
```js
// validation/validators/is-email-not-registered-s.js
```
{% enddetails %}

{% details validation/validators/is-max-length.js %}
```js
// validation/validators/is-max-length.js
```
{% enddetails %}

{% details validation/validators/is-min-length.js %}
```js
// validation/validators/is-min-length.js
```
{% enddetails %}

{% details validation/validators/is-password-confirmed.js %}
```js
// validation/validators/is-password-confirmed.js
```
{% enddetails %}

{% details validation/validators/is-strong-password.js %}
```js
// validation/validators/is-strong-password.js
```
{% enddetails %}

Here I'm using validators from the library [validator.js](https://github.com/validatorjs/validator.js). You can use validators provided by other libraries or write your own. They only have to return a `Boolean` value or a `Promise` that fullfils with a `Boolean` value. I wrap them in `Predicate` in order to pass error messages along with them. If your project requires internationalization you can pass translation keys instead. See an example of [usage with i18next](https://itihon.github.io/isomorphic-validation/api/validation/instance-methods/constraint/#parameter-anydata) library.

There are two validators that will be checking an e-mail registration,  one `is-email-not-registered.js` which will be executed on the client side and make a request to the server, and `is-email-not-registered-s.js` which will be making a request to the database on the server, that is in our case to the mock repository.

## 2. Preparing validations

```bash
.
⊞─── public
├── repository.js
⊟─── validation
    ⊞── profiles
    ⊞── ui
    ⊟── validations
    │   ├── email.js
    │   └── password.js
    ⊞─── validators
```

{% details validation/validations/email.js %}
```js
// validation/validations/email.js
```
{% enddetails %}

{% details validation/validations/password.js %}
```js
// validation/validations/password.js
```
{% enddetails %}

Here I'm creating two `Validation` objects for e-mail and password fields with validators that will be shared by both forms. We **do not duplicate** the validation logic even though the sign-up form differs from the sign-in form in the way that it requires additional validators for checking an e-mail registration and checking password and password confirmation equality. We will add them in the following steps.

At this point our dependency graph looks like this:

![validations dependency graph](./assets/validations-dep-graph.png)

## 3. Creating UI effects

```bash
.
⊞─── public
├── repository.js
⊟─── validation
    ⊞── profiles
    ⊟── ui
    │   └── apply-effects.js
    ⊞── validations
    ⊞── validators
```

{% details validation/ui/apply-effects.js %}
```js
// validation/ui/apply-effects.js
```
{% enddetails %}

Here I simply wrap the effects I demonstrated in the [previous post's example](https://dev.to/itihon/handling-asynchronous-validators-and-mutually-dependent-fields-using-isomorphic-validation-library-n96) in a function in order to apply them to both forms. Insted of using the library's UI effect functions, you can also create your own effects, make them a part of your components and use `Validation` or `Predicate` objects inside your components to connect validity states to your components' states.

## 4. Creating validation profiles

```bash
.
⊟── public
├── repository.js
⊟── validation
    ⊟── profiles
    │   ├── signin.js
    │   └── signup.js
    ⊞─── ui
    ⊞─── validations
    ⊞─── validators
```

{% details validation/profiles/signin.js %}
```js
// validation/profiles/signin.js
```
{% enddetails %}

{% details validation/profiles/signup.js %}
```js
// validation/profiles/signup.js
```
{% enddetails %}

Here `signin.js` and `signup.js` will be entry points for a module bundler. This is the place where we apply UI effects. Also, `signup.js` is the place to add sign-up form specific validators:

```js
// this validator will be added on the client side only
signupV.email.client.constraint(isEmailNotRegistered, { debounce: 5000 });

Validation.glue(signupV.password, signupV.pwdConfirm)
  .constraint(isPasswordConfirmed);
```

Now our dependency graph has the following structure:

![profiles dependency graph](./assets/profiles-dep-graph.png)

We are using the same validations on both forms **without duplicating**.

## 5. Creating the server

```bash
.
├── index.js
⊞─── public
├── repository.js
⊟── validation
    ⊞─── profiles
    ⊞─── ui
    ⊞─── validations
    ⊞─── validators
```

{% details index.js %}
```js
// index.js
```
{% enddetails %}

On the server side, we use validations as `Express` middleware functions:

```js
// here the .server property actually can be ommited
const emailV = signupV.email.server.constraint(isEmailNotRegisteredS);

// validations are added as middleware functions
app.post('/signin', urlencodeParser, signinV, signinHandler);
app.post('/signup', urlencodeParser, signupV, signupHandler);
app.post('/checkemail', urlencodeParser, emailV, checkemailHandler);
```

## Final result

This is the final project's file system structure:
```bash
.
├── index.js
⊟── public
│   ⊞─── bundles
│   ├── signin.html
│   ├── signup.html
│   └── style.css
├── repository.js
⊟── validation
    ⊟── profiles
    │   ├── signin.js
    │   └── signup.js
    ⊟── ui
    │   └── apply-effects.js
    ⊟── validations
    │   ├── email.js
    │   └── password.js
    ⊟── validators
        ├── is-email.js
        ├── is-email-not-registered.js
        ├── is-email-not-registered-s.js
        ├── is-max-length.js
        ├── is-min-length.js
        ├── is-password-confirmed.js
        └── is-strong-password.js
```

The final dependency graph looks as the following:

![final dependency graph](./assets/final-dependency-graph.png)

## Conclusion

What we achived so far:

- No duplicates of validation logic across different forms with the same kind of fields.

- No duplicates of validation logic between client and server. 

- All validation logic resides in one place which provides one source of truth.

If you read up to this point I'd like to know your opinion. What do you think about this approach? Does this library have the right to exist?