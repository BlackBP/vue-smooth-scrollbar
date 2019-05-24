<template>
    <div class="app-wrap">

        <div class="app-box">

            <scroll-view class="app-box__view"
                         :plugins="scrollViewPlugins"
                         :options="scrollViewOpts"
                         :infinite-loading="true"
                         @loading="onInfinite">
                <p v-for="item in list"
                   :key="`p-${item.id}`"
                   style="margin-top: 0;">
                    <b>{{ item.id }}.</b> Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aperiam architecto dolorem doloremque ea
                    harum incidunt ipsa itaque
                    iure minima modi mollitia nesciunt, numquam officia omnis quia, repellendus sunt, vel.
                </p>
            </scroll-view>

            <div class="app-box__meta">
                <b>Page</b>: {{ meta.page }} of {{ meta.total }}
            </div>

            <transition name="transition-fade-in">
                <div v-show="loading"
                     class="app-loader">
                    <div class="app-loader__box">
                        <div class="app-loader__spinner"></div>
                        <div class="app-loader__text">Loading...</div>
                    </div>
                </div>
            </transition>

        </div>

    </div>
</template>

<script>
    import OverScrollPlugin from 'smooth-scrollbar/plugins/overscroll';

    import ScrollView from '../ScrollView';

    export default {
        name: "App",
        components: {
            ScrollView
        },
        data() {
            return {
                list: [],
                loading: false,
                meta: {
                    page: 0,
                    total: 10
                }
            }
        },
        computed: {
            scrollViewOpts() {
                return {
                    damping: 0.25,
                    alwaysShowTracks: true
                }
            },
            scrollViewPlugins() {
                return [OverScrollPlugin]
            }
        },
        methods: {
            async onInfinite($state) {
                try {
                    let response = await this.getData();
                    this.list = [...this.list, ...response];

                    if (this.meta.page < this.meta.total) {
                        this.$nextTick(() => $state.loaded())
                    } else {
                        this.$nextTick(() => $state.completed())
                    }
                } catch (errors) {
                    $state.completed();
                    console.error(errors);
                }
            },

            getData() {
                return new Promise(resolve => {
                    this.loading = true;

                    setTimeout(() => {
                        let lastItemId = this.list.length;
                        let data = [...Array(10)];

                        data = data.map((item, index) => {
                            return {
                                id: lastItemId + ++index
                            }
                        });

                        this.meta.page = ++this.meta.page;
                        this.loading = false;
                        resolve(data)
                    }, 500)
                })
            },
        }
    }
</script>

<style lang="scss">
    @import url('https://fonts.googleapis.com/css?family=Roboto:400,700');
    @import "~normalize.css/normalize.css";

    // Media queries
    @mixin media( $breakpoints ) {
        @each $breakpoint in $breakpoints {

            @if $breakpoint == xs-s {
                @media screen and (max-width: 320px) {
                    @content;
                }
            }
            @if $breakpoint == xs-m {
                @media screen and (min-width: 321px) and (max-width: 375px) {
                    @content;
                }
            }
            @if $breakpoint == xs-l {
                @media screen and (min-width: 376px) and (max-width: 425px) {
                    @content;
                }
            }
            @if $breakpoint == xs {
                @media screen and (max-width: 575px) {
                    @content;
                }
            }
            @if $breakpoint == sm {
                @media screen and (min-width: 576px) and (max-width: 767px) {
                    @content;
                }
            }
            @if $breakpoint == md {
                @media screen and (min-width: 768px) and (max-width: 991px) {
                    @content;
                }
            }
            @if $breakpoint == lg {
                @media screen and (min-width: 992px) and (max-width: 1199px) {
                    @content;
                }
            }
            @if $breakpoint == xl {
                @media screen and (min-width: 1200px) {
                    @content;
                }
            }

        }
    }

    // Loader spin animation
    @keyframes loaderSpin {
        0% {
            transform: rotate(0deg);
        }
        50% {
            transform: rotate(180deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }

    $g-border-radius: 12px;
    $color-primary: #4db3ff;

    /*
    ** Reset
    */
    *,
    *::before,
    *::after {
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
    }

    * {
        font-family: inherit;
        font-weight: inherit;
        font-size: inherit;
        color: inherit;
        line-height: inherit;
        -webkit-font-smoothing: inherit;
        -moz-osx-font-smoothing: inherit;
    }

    html,
    body {
        display: block;
        min-height: 100vh;
        background-color: #e8e8e8;
    }

    html {
        font-size: 16px;
        font-family: 'Roboto', sans-serif;
        font-weight: normal;
        line-height: 1.2rem;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }

    .app-wrap {
        display: flex;
        justify-content: center;
        width: 100vw;
        height: 100vh;
        padding: 15px;
    }

    .app-box {
        $self: #{&};
        $view: #{$self}__view;
        $meta: #{$self}__meta;

        $box-padding: 15px;

        @at-root {
            #{$self} {
                position: relative;
                display: flex;
                flex-flow: column nowrap;
                width: 100%;
                height: 100%;
                margin: auto;
                padding: $box-padding;
                background-color: #ffffff;
                border-radius: $g-border-radius;
                overflow: hidden;
                box-shadow: 0 3px 5px -1px rgba(#000, 0.15),
                0 6px 10px 0 rgba(#000, 0.1),
                0 1px 18px 0 rgba(#000, 0.09);
            }

            #{$view} {
                height: 100%;
            }

            #{$meta} {
                flex: 0 0 auto;
                background: #fff;
                padding-top: 15px;
                border-top: 1px solid #ddd;
                margin-top: $box-padding;
            }
        }
    }

    .app-loader {
        $self: #{&};
        $box: #{$self}__box;
        $spinner: #{$self}__spinner;
        $text: #{$self}__text;

        $border: none;
        $border-radius: 10px;

        $spinner-size: 45px;
        $spinner-border: 6px solid;
        $spinner-color: $color-primary;
        $spinner-track-color: #DDD;

        $text-color: #555;
        $text-size: 1.2rem;

        @at-root {
            #{$self} {
                position: absolute;
                z-index: 99;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                display: flex;
                flex-flow: column nowrap;
                justify-content: center;
                width: 100%;
                height: 100%;
                background-color: rgba(#000, 0.35);
            }

            #{$box} {
                flex: 0 0 auto;
                display: inline-flex;
                flex-flow: row nowrap;
                align-items: center;
                width: auto;
                height: auto;
                margin: auto;
                padding: 15px;
                background-color: #fff;
                border-radius: $g-border-radius;
                font-weight: bold;
                font-size: 1.2rem;
                box-shadow: 0 3px 3px -2px rgba(#000, 0.15),
                0 3px 4px 0 rgba(#000, 0.1),
                0 1px 8px 0 rgba(#000, 0.09);
            }

            #{$spinner} {
                position: relative;
                display: block;
                font-size: $spinner-size;
                width: 1em;
                height: 1em;
                margin: 0 auto;

                &:before,
                &:after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    display: block;
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                }

                &:before {
                    z-index: 2;
                    border: $spinner-border;
                    border-color: transparent transparent transparent $spinner-color;
                    animation: loaderSpin 0.6s linear infinite;
                }

                &:after {
                    z-index: 1;
                    border: $spinner-border;
                    border-color: $spinner-track-color;
                }
            }

            #{$text} {
                display: block;
                margin-left: 0.5em;
                font-weight: bold;
                font-size: 1em;
            }

            // Media queries
            @include media(xl lg) {

            }
        }
    }

    // Transition
    .transition-fade-in {
        &-enter-active,
        &-leave-active {
            transition: opacity .2s ease;
        }

        &-enter,
        &-leave-to {
            opacity: 0;
        }
    }

</style>
