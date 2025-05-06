---
published: false
title: 'Using the same validation logic on the client and server side with Isomorphic-validation.'
cover_image: 'https://raw.githubusercontent.com/itihon/itihon.dev.to/master/blog-posts/using-the-same-validation-logic-on-the-client-and-server-side/assets/cover.png'
description: 'A step by step tutorial of using isomorphic-validation javascript library on the client and server side.'
tags: webdev, javascript, validation, api
series:
canonical_url:
---

In this post I want to briefly describe the usage of **Isomorphic-validation**, a [javascript validation library](https://itihon.github.io/isomorphic-validation/) that was intended to be used on client and server side and make the process of validating user input seamless across your application.

In the two previous posts I covered some aspects of using this library on the client side by creating a sign-in and sign-up form:

 - [Part 1](https://dev.to/itihon/quick-introduction-to-isomorphic-validation-javascript-library-48p6)
 - [Part 2](https://dev.to/itihon/handling-asynchronous-validators-and-mutually-dependent-fields-using-isomorphic-validation-library-n96)

 Here I will show why this library is actually isomorphic. I'm going to incorporate that sign-in and sign-up examples into a simple `Node.js` application.

## 0. Setting up the project

```bash
.
├── index.js
⊟── public
│   ⊞─── bundles
│   ├── signin.html
│   ├── signup.html
│   └── style.css
├── repository.js
├── rollup.config.mjs
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

First, I created the following folder structure:

```bash
.
⊟── public
│   ⊞─── bundles
│   ├── signin.html
│   ├── signup.html
│   └── style.css
├── repository.js
├── rollup.config.mjs
⊞── validation
    ⊞── profiles
    ⊞── ui
    ⊞── validations
    ⊞── validators
```

{% details repository.js %}
```js
/**
 * Mock repository
 */

const existingEmails = new Map([ 
    ['ww@ww.ww', 1], ['xx@xx.xx', 2], ['yy@yy.yy', 3], ['zz@zz.zz', 4],
]);

export default {
    async getUserIdBy({ email = '' }) {
        return existingEmails.get(email);
    }
}
```
{% enddetails %}

{% details rollup.config.mjs %}
```js
import ignore from 'rollup-plugin-ignore';
import { cleandir } from "rollup-plugin-cleandir";
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
    input: [
        'validation/profiles/signin.js',
        'validation/profiles/signup.js',
    ],
    output: {
        format: 'esm',
        dir: 'public/bundles/',
        entryFileNames: '[name].js',
    },
    plugins: [
        ignore('../../repository.js'),
        nodeResolve(),
        cleandir('public/bundles'),
    ],
};
```
{% enddetails %}

{% details public/signin.html %}
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Sign in</title>
    <link rel="stylesheet" href="style.css">
  </head>
  <body>
    <form action="signin" method="post" name="signinForm" autocomplete="off">
      <h2>Sign in</h2>

      <label class="form-field" for="email">
        <input type="text" name="email" id="email" required>
        <span class="field-title">E-mail</span>
      </label>

      <label class="form-field" for="password">
        <input type="password" name="password" id="password" required>
        <span class="field-title">Password</span>
      </label>

      <input type="submit" name="submitBtn" disabled>
    </form>
    <script type="module" src="bundles/signin.js"></script>
  </body>
</html>
```
{% enddetails %}

{% details public/signup.html %}
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Sign up</title>
    <link rel="stylesheet" href="style.css">
  </head>
  <body>
    <form action="signup" method="post" name="signupForm" autocomplete="off">
      <h2>Sign up</h2>

      <label class="form-field" for="email">
        <input type="text" name="email" id="email" required>
        <span class="field-title">E-mail</span>
      </label>

      <label class="form-field" for="password">
        <input type="password" name="password" id="password" required>
        <span class="field-title">Password</span>
      </label>
      
      <label class="form-field" for="pwdConfirm">
        <input type="password" name="pwdConfirm" id="pwdConfirm" required>
        <span class="field-title">Password confirmation</span>
      </label>

      <input type="submit" name="submitBtn" disabled>
    </form>
    <script type="module" src="bundles/signup.js"></script>
  </body>
</html>
```
{% enddetails %}

{% details public/style.css %}
```css
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  font-family: Helvetica;
}

body {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: lightslategray;
}

h2 {
  text-align: center;
  width: 100%;
}

form {
  display: flex;
  flex-wrap: wrap;
  gap: 48px;
  justify-content: flex-start;
  align-items: center;
  width: min-content;
  padding-inline: 24px;
  padding-block: 32px;
  border: 1px solid slategray;
  border-radius: 2px;

  background: rgb(255,255,255);
  background: linear-gradient(123deg, rgba(255,255,255,1) 24%, rgba(244,250,255,1) 51%, rgba(255,255,255,1) 77%);
}

label {
  padding: 4px;
  background-color: white;
}

input { 
  height: 32px;
  width: 100%;
  border: none;
  background: none;
  outline: none;
  font-size: 16px;
}

input[type="submit"] {
  height: 42px;
  border: 1px solid lightslategray;
  background-color: slategray;
  color: white;
  transition: opacity .1s;
}

input[type="submit"]:disabled {
  opacity: .5;
  cursor: not-allowed;
}

input[type="submit"]:not(:disabled):hover {
  filter: brightness(1.1);
}

.form-field {
  width: 220px;
  position: relative;
  border: 1px solid slategray;
  border-radius: 2px;
  cursor: text;
}

.field-title {
  position: absolute;
  top: 0;
  padding-block: 4px;
  display: grid;
  align-items: center;
  height: 100%;
  color: slategray;
  transition: font-size .1s, height .1s ease-out;
}

.form-field > input:valid + .field-title {
  font-size: 12px;
  height: 20px;
}

.form-field > input:valid {
  padding-top: 14px; 
}
```
{% enddetails %}

## 1. Preparing validators

A typical use case, as I mentioned above, is when you have two DOM elements placed inside different parent containers (or maybe they come from different component libraries, or you are not allowed to modify any of them), and you need to to stick them together so that if one of them (the observed one) changes the coordinates of its bounding rectangle, the other one moves along.

## 2. Preparing validations

One of possible approaches is to crop the `root` bounding box to the size of the observed element by setting negative values to `rootMargin`. This approach has several drawbacks.

When an observed element is partly overlapped by its scrollable parent container, it creates a situation in which `intersectionRatio` doesn't change when the element moves until it is fully visible, therefore position change can not be detected.

![partly ovelapped](./assets/partly_overlapped.png)

The solution may be to calculate `rootMargin` so that `rootBounds` rectangle is captured inside the overlapping container and never leaves its boundaries. When the observed element is fully scrolled out of view, we just "switch" the observer to full vewport size to detect when the element gets visible again, so when it happens, we "switch" back to the cropped size.

![captured root](./assets/captured_root.png)

Another problem occurs when resizing browser window, since `rootMargin` set in pixels it is static, `rootBounds` rectangle shrinks and expands with the window, creating "blind areas" with `intersectionRatio = 1.0`.

![resized window](./assets/resized_window.png)

The solution to this may be calculating `rootMargin` in percents relation of the element's left and top coordinates to viewport's width and hight respectively. Now `rootMargin` is dynamic, `rootBounds` rectangle has a fixed size, but this way it runs away from the element on window resize. Although it doesn't prevent position change from being detected, when both element and detector are able to move, it makes the whole solution slightly less predicatble and adds more edge cases to check.

![resized window solution](./assets/resized_window_solution.png)

An observed element itself can also change its size. This entails the same consequences as described above. This can be possibly solved by using two `IntersectionObservers` with the cropped `rootBounds` rectangle per element, inner and outer. One detects size decrease, the other one detects size increase. They both would be needed to be recreated after every resize or position change. Another solution to this problem may be to use `ResizeObserver` in combination with `IntersectionObserver`.

This already gets us closer to the 4-observers concept.

## 3. Creating UI effects

Keeping in mind all edge cases of the approach with `rootBounds` rectangle cropped to the target element size, I realized it would be much easier to observe each side of the element's bounding box instead of an element as a whole. No matter in which direction an element moves, its position or size change will be relibly detected by at least one observer. For that an element must be at least partly visible.

The algorithm is simple: we create 4 observers whose `rootBounds` rectangles initially intersect each side of the observed element by 2 pixels. If an intersection deviates from the range between 1 and 2 pixels in any direction, position or size change is detected. Since the same change can be detected by more than one observer, we invoke the `.takeRecords()` method of the rest observers in order to gather pending records and prevent repetetive callback function calls. Then we mark those observers for recreation whose records we collected. In the worst case (diagonal movement) it would be all 4. Then we "unobserve" all 4 observers, start a [`requestAnimationFrame` loop](https://github.com/itihon/request-animation-frame-loop/) and keep it running until the element's bounding rectangle stops changing. Once it happens, we stop the loop, and recreate the marked observers.

![position observer flow chart](./assets/position_observer_flow_chart.png)

This looks more straithforward and implies much less edge cases to handle. If position change happens in between observer creation and its first callback invokation, we just repeat the cycle as if it was actual position change detection but only if the target element is inside document's viewport boundaries. This is a protection against an infinite loop. Whereas in the "cropped observer" approach, due to its variaty of edge cases, I had to implement the mechanics to distinguish between the first call of a callback after the `new IntersectionObserver().observe()` method invokation and an actual intersection change notification.

## 4. Creating validation profiles


## Conclusion

