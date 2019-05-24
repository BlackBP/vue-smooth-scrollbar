# vue-smooth-scrollbar
[idiotWu/smooth-scrollbar](https://github.com/idiotWu/smooth-scrollbar) for Vue.js projects.

## Features
1. Infinite loading

## Demo
[GitHub Pages](https://blackbp.github.io/vue-smooth-scrollbar/)

## Usage

### 1. Install dependency
```
yarn add @blackbp/vue-smooth-scrollbar
```

### 2. Import component into your app.js or component

In your App.js
```js
import Vue from 'vue'
...
import ScrollView from '@blackbp/vue-smooth-scrollbar'
...

new Vue({
    components: {
        ScrollView
    }
})
```

In vue single file component
```js
import ScrollView from '@blackbp/vue-smooth-scrollbar'

export default {
    components: {
        ScrollView
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
| `infiniteLoading`| `Boolean` | `false` | Enable infinite loading |
| `loadThreshold` | `Number` | 50 | Infinite loading threshold (distance from a bottom of content) |
| `options` | `Object` | {} | smooth-scroll options. [See here.](https://github.com/idiotWu/smooth-scrollbar/tree/develop/docs#available-options-for-scrollbar) |
| `plugins` | Array | [] | Array of smooth-scrollbar plugins |

## Events

| Event name | Args | Description |
| --- | :-: | --- |
| `@endy` | - | Reaching the end of the scroll on the y axis |
| `@endx` | - | Reaching the end of the scroll on the x axis |
| `@scroll` | `status: Object` | Fires when scrolling on every axis (see details below) |
| `@loading` | `state: Object` | Fires when reaching the end of the content |

@scroll status object:
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

@loading state object:
```
// Your component
<template>
    <scroll-view ref="scrollView" 
                 :infinite-loading="true" 
                 @loading="onInfinite">
        <div v-for="item in list" 
             :key="`awesome-item-${item.id}`">
            ...awesome content
        </div>
    </scroll-view>
</template>

export default {
    data() {
        return {
            list: [],
            page: 1
        }
    },
    methods: {
        async onInfinite(state) {
            let res = await someAsyncFunc();
            
            if(res.list) {
                this.list.push(...rest.list);
                this.page = ++this.page;
                state.loaded(); // If there is data, then set state loaded (keep emit @loading event)
            } else {
                state.completed(); // If no data, then set state completed (stop emit @loading event)
            }
        },
        resetInfScroll() {
            this.$refs.scrollView.resetInfLoad(); // Resets the state of the infinite load
        }
    }
}
```

## To run example
Clone this repo
```
yarn install
yarn run serve
```

## Backlog
* [x] Plugin structure
* [x] Basic implementation
* [x] Options
* [x] Events
* [x] Methods
* [ ] Styling
* [x] Build dist
* [ ] SSR / nuxt
