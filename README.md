# vue-smooth-scrollbar
A wrapper for [smooth-scrollbar](https://github.com/idiotWu/smooth-scrollbar) to Vue Component.

## Features
1. Infinite scroll

## Usage

### 1. Install dependency
```
yarn add @blackbp/vue-smooth-scrollbar
```

### 2. Import component into your app.js or component
```js
// src/app.js
import Vue from 'vue'
...
import ScrollView from '@blackbp/vue-smooth-scrollbar'
...

new Vue({
    components: {
        ScrollView,
        ...
    }
})

// or src/App.vue
import ScrollView from '@blackbp/vue-smooth-scrollbar'

export default {
    ...,
    components: {
        ScrollView,
        ...
    }
}
```
### 3. Use component in your templates
> You should set height to component! This is important

```
<template>
    <scroll-view class="scroll-area">
        ...awesome content
    </scroll-view>
</template>

<style>
  .scroll-area {
    width: 100%;
    height: 500px; // You should set height to component! This is important
  }
</style>
```

## Props

| Prop name | Type | Default | Description |
| --- | :-: | :-: | --- |
| `infiniteScroll`| `Boolean` | `false` | Enable infinite scroll |
| `loadThreshold` | `Number` | 50 | Infinite scroll loading threshold (distance from a bottom of content) |

## Events

| Event name | Args | Description |
| --- | :-: | --- |
| `@endy` | - | Reaching the end of the scroll on the y axis |
| `@endx` | - | Reaching the end of the scroll on the x axis |
| `@scroll` | `status: Object` | Fires on scroll on every axis (see details below) |

Details:
```js
let status = {
    offset: {
        x: number,
        y: number,
    },
    limit: {
        x: number,
        y: number,
    },
}
```

## To run example
Clone this repo
```
yarn install
yarn run serve
```

## Backlog
* [ ] Plugin structure
* [x] Basic implementation
* [ ] Options
* [ ] Events
* [ ] Methods
* [ ] Styling
* [ ] Build dist
* [ ] SSR / nuxt
