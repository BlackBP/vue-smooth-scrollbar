<template>
    <div data-scrollbar
         ref="view"
         class="c-scroll-view"
         @mouseenter="focus">
        <div><slot/></div>
    </div>
</template>

<script>
    import SmoothScrollbar from 'smooth-scrollbar';
    import OverScrollPlugin from 'smooth-scrollbar/plugins/overscroll';

    SmoothScrollbar.use(OverScrollPlugin);

    function onInfiniteScroll($status, $vue) {
        if (!$vue.infiniteScroll) return;
        if ($vue.loading || $vue.completed) return;

        let threshold = $vue.loadThreshold;
        let {
            limit,
            offset
        } = $status;

        let loadOffset = limit.y - threshold;
        let canLoad = offset.y >= loadOffset;

        $vue.resolve = canLoad;

        if (!$vue.completed) {
            if (canLoad) {
                $vue.emitLoad(true);
            }
        } else {
            $vue.loading = false
        }
    }

    function onScroll($status, $vue) {
        let {
            limit,
            offset
        } = $status;

        let limitX = limit.x;
        let limitY = limit.y;

        let offsetX = offset.x;
        let offsetY = offset.y;

        if (limitY > 0) {
            if (limitY === offsetY) {
                $vue.$emit('endy')
            }
        }

        if (limitX > 0) {
            if (limitX === offsetX) {
                $vue.$emit('endx')
            }
        }

        $vue.$emit('scroll', $status);
    }

    function debounce(f, ms) {

        let timer = null;

        return function (...args) {
            const onComplete = () => {
                f.apply(this, args);
                timer = null;
            };

            if (timer) {
                clearTimeout(timer);
            }

            timer = setTimeout(onComplete, ms);
        };
    }

    export default {
        name: "c-scroll-view",
        props: {
            infiniteScroll: {
                type: Boolean,
                default: false,
                required: false
            },
            loadThreshold: {
                type: Number,
                default: 50,
                required: false
            }
        },
        data() {
            return {
                resolve: true,
                loading: false,
                completed: false,
                renderCount: 0,
                scrollBar: null
            }
        },
        methods: {
            scrollTo(x = 0, y = 0) {
                this.scrollBar.scrollTo(x, y, 300)
            },
            emitLoad: debounce(function () {
                if (this.resolve) {
                    this.resolve = false;
                    this.loading = true;

                    this.$emit('infinite', {
                        loaded: () => this.setLoaded(),
                        completed: () => this.setCompleted()
                    })
                }
            }, 300),
            setLoaded() {
                this.resolve = true;
                this.loading = false;
                this.completed = false;
            },
            setCompleted() {
                this.resolve = false;
                this.loading = false;
                this.completed = true;
            },
            resetInfiniteScroll() {
                this.resolve = true;
                this.loading = false;
                this.completed = false;
            },

            // Misc
            focus() {
                this.scrollBar.containerEl.focus()
            }
        },
        mounted() {
            this.$nextTick(() => {
                this.scrollBar = SmoothScrollbar.init(this.$refs.view, {
                    damping: 0.25,
                    alwaysShowTracks: true,
                    continuousScrolling: true
                });

                this.scrollBar.addListener(status => onInfiniteScroll(status, this));
                this.scrollBar.addListener(status => onScroll(status, this));
            });
        },
        beforeDestroy() {
            if (this.scrollBar !== null) {
                this.scrollBar.removeListener(status => onInfiniteScroll(status, this));
                this.scrollBar.removeListener(status => onScroll(status, this));
                this.scrollBar.destroy();
            }
        },
        updated() {
            this.scrollBar && this.scrollBar.update()
        }
    }
</script>

<style>
    .c-scroll-view {
        display: block;
        height: 100%;
    }
</style>
