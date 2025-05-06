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
// repository.js
```
{% enddetails %}

{% details rollup.config.mjs %}
```js
// rollup.config.mjs
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

```scss
// code/public/style.css

```