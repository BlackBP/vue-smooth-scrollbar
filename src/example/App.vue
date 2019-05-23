<template>
    <div class="app-wrap">

        <div class="app-view">

            <scroll-view :infinite-scroll="true"
                         @infinite="onInfinite">
                <div class="app-view__content">
                    <p v-for="item in list"
                       :key="`p-${item.id}`">
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aperiam architecto dolorem doloremque ea harum incidunt ipsa itaque
                        iure minima modi mollitia nesciunt, numquam officia omnis quia, repellendus sunt, vel.
                    </p>
                </div>
            </scroll-view>

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
    import ScrollView from '../ScrollView'

    export default {
        name: "App",
        components: {
            ScrollView
        },
        data() {
            return {
                list: [],
                loading: false
            }
        },
        methods: {
            async onInfinite($state) {
                try {
                    let response = await this.getData();
                    this.list = [...this.list, ...response];
                    this.$nextTick(() => $state.loaded())
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

                        this.loading = false;
                        resolve(data)
                    }, 1000)
                })
            },
        },
        async mounted() {
            let response = await this.getData();
            this.list = [...this.list, ...response];
        }
    }
</script>

<style lang="scss">
    @import url('https://fonts.googleapis.com/css?family=Roboto:400,700');
    @import "~normalize.css/normalize.css";

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

    .app-view {
        $self: #{&};
        $content: #{$self}__content;

        $size: 50%;

        @at-root {
            #{$self} {
                position: relative;
                flex: 1 1 $size;
                display: block;
                width: 100%;
                max-width: $size;
                height: 100%;
                max-height: $size;
                margin: auto;
                background-color: #ffffff;
                border-radius: $g-border-radius;
                overflow: hidden;
                box-shadow: 0 3px 5px -1px rgba(#000, 0.15),
                0 6px 10px 0 rgba(#000, 0.1),
                0 1px 18px 0 rgba(#000, 0.09);
            }

            #{$content} {
                padding: 15px;
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
