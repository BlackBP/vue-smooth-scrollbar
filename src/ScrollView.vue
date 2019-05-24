<script>
    import SmoothScrollbar from 'smooth-scrollbar';

    /**
     * @param {Object} $status - smooth-scrollbar status object
     */
    function onInfiniteScroll($status) {
        if (!this.infiniteScroll) return;
        if (this.loading || this.completed) return;

        let threshold = this.loadThreshold;
        let {
            limit,
            offset
        } = $status;

        let loadOffset = limit.y - threshold;
        let canLoad = offset.y >= loadOffset;

        this.resolve = canLoad;

        if (!this.completed) {
            if (canLoad) {
                this.emitLoad(true);
            }
        } else {
            this.loading = false
        }
    }

    /**
     * @param {Object} $status - smooth-scrollbar status object
     */
    function onScroll($status) {
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
                this.$emit('endy')
            }
        }

        if (limitX > 0) {
            if (limitX === offsetX) {
                this.$emit('endx')
            }
        }

        this.$emit('scroll', $status);
    }

    /**
     *
     * @param {Function} callback
     * @param {Number} delay - in milliseconds
     * @return {Function}
     */
    function debounce(callback, delay) {

        let timer = null;

        return function (...args) {
            const onComplete = () => {
                callback.apply(this, args);
                timer = null;
            };

            if (timer) {
                clearTimeout(timer);
            }

            timer = setTimeout(onComplete, delay);
        };
    }

    /**
     *
     * @param opts
     * @param defaultOpts
     * @return {{}}
     */
    function mergeOptions(opts = {}, defaultOpts = {}) {
        if (typeof opts !== 'object') return {};
        if (Array.isArray(opts)) return {};

        let keys = Object.keys(defaultOpts);
        let mergedOpts = {};

        keys.forEach(key => {
            mergedOpts[key] = opts.hasOwnProperty(key) ? opts[key] : defaultOpts[key]
        });

        return mergedOpts;
    }

    const defaultOptions = {
        damping: 0.1,
        thumbMinSize: 20,
        renderByPixels: true,
        alwaysShowTracks: false,
        continuousScrolling: true,
        delegateTo: null,
        plugins: {},
    };

    export default {
        name: "c-scroll-view",
        props: {
            infiniteScroll: {
                type: Boolean,
                default: false
            },
            loadThreshold: {
                type: Number,
                default: 50
            },
            options: {
                type: Object,
                default: () => ({})
            },
            plugins: {
                type: Array,
                default: () => ([])
            }
        },
        data() {
            return {
                resolve: true,
                loading: false,
                completed: false,
                scrollBar: null,
                listeners: []
            }
        },
        computed: {
            hasPlugins() {
                if(Array.isArray(this.plugins)) {
                    return !!this.plugins.length
                } else {
                    return false
                }
            }
        },
        methods: {

            // Smooth-scrollbar api methods
            /**
             *
             * @param {Number} x
             * @param {Number} y
             * @param {Number} duration
             * @param {Object} options
             * @see https://github.com/idiotWu/smooth-scrollbar/blob/develop/docs/api.md#scrollbarscrollto
             */
            scrollTo(x = 0, y = 0, duration = 300, options = {}) {
                this.scrollBar.scrollTo(x, y, duration, options)
            },

            /**
             *
             * @param {HTMLElement} elem
             * @param {Object} [options]
             * @see https://github.com/idiotWu/smooth-scrollbar/blob/develop/docs/api.md#scrollbarscrollintoview
             */
            scrollIntoView(elem, options = {}) {
                this.scrollBar.scrollIntoView(elem, options)
            },

            /**
             *
             * @param {HTMLElement} elem
             * @see https://github.com/idiotWu/smooth-scrollbar/blob/develop/docs/api.md#scrollbarisvisible
             */
            isVisible(elem) {
                this.scrollBar.isVisible(elem);
            },

            /**
             *
             * @param {Function} listener
             * @see https://github.com/idiotWu/smooth-scrollbar/blob/develop/docs/api.md#scrollbaraddlistener
             */
            addListener(listener) {
                this.listeners.push(listener);
                this.scrollBar.addListener(listener)
            },

            /**
             *
             * @param {Function} listener
             * @see https://github.com/idiotWu/smooth-scrollbar/blob/develop/docs/api.md#scrollbarremovelistener
             */
            removeListener(listener) {
                this.listeners = this.listeners.filter(attached => {
                    if (attached === listener) {
                        this.scrollBar.removeListener(listener)
                    }

                    return attached !== listener
                });
            },

            /**
             *
             */
            removeAllListeners() {
                this.listeners.forEach(listener => {
                    this.scrollBar.removeListener(listener)
                });
                this.listeners = [];
            },

            /**
             * @see https://github.com/idiotWu/smooth-scrollbar/blob/develop/docs/api.md#scrollbarupdate
             */
            update() {
                this.scrollBar.update()
            },

            // Infinite scroll api methods

            /**
             * Emits loading event
             */
            emitLoad: debounce(function () {
                if (this.resolve) {
                    this.resolve = false;
                    this.loading = true;

                    this.$emit('loading', {
                        loaded: () => this.setLoaded(),
                        completed: () => this.setCompleted()
                    })
                }
            }, 300),

            /**
             * Sets loaded state
             */
            setLoaded() {
                this.resolve = true;
                this.loading = false;
                this.completed = false;
            },

            /**
             * Sets completed state
             */
            setCompleted() {
                this.resolve = false;
                this.loading = false;
                this.completed = true;
            },

            /**
             * Resets state
             */
            resetInfiniteScroll() {
                this.resolve = true;
                this.loading = false;
                this.completed = false;
            },

            // Misc
            focus() {
                this.scrollBar.containerEl.focus()
            },
            blur() {
                this.scrollBar.containerEl.blur()
            }
        },
        mounted() {
            this.$nextTick(() => {
                if(this.hasPlugins) {
                    this.plugins.forEach(plugin => {
                        SmoothScrollbar.use(plugin)
                    });
                }

                this.scrollBar = SmoothScrollbar.init(this.$refs.view, mergeOptions(this.options, defaultOptions));

                this.addListener(onInfiniteScroll.bind(this));
                this.addListener(onScroll.bind(this));
            });
        },
        beforeDestroy() {
            if (this.scrollBar !== null) {
                this.removeAllListeners();
                this.scrollBar.destroy();
            }
        },
        updated() {
            this.scrollBar && this.update()
        },
        render(h) {
            let containerData = {
                class: 'c-scroll-view',
                ref: 'view',
                attrs: {
                    'data-scrollbar': ''
                },
                on: {
                    mouseenter: this.focus
                },
                style: {
                    display: 'block',
                    height: '100%'
                }
            };

            return h('div', containerData, [
                h('div', this.$slots.default)
            ])
        }
    }
</script>
