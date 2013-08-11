/**
 * @name        jQuery FullScreen Plugin
 * @author      Mitko Tschimev
 * @version     0.1
 * @license     Apache v2 License
 */
(function($) {
    function ConsoleView($root, options) {
        this.initialize($root, options);
    }

    ConsoleView.prototype = {

        /**
         * Default values merged with the options
         *
         * @type {{type: string, interval: number, receivedData: function, highlight: Array<object>}}
         */
        settings: {
            type: "event", //type of transportation
            interval: 200, //interval for ajax request
            receivedData: null,

            //highlighting
            highlight: [
                {
                    cssClass: "error",
                    matcher: "ERROR"
                },
                {
                    cssClass: "success",
                    matcher: "SUCCESS"
                },
                {
                    cssClass: "warn",
                    matcher: "WARN"
                }
            ]
        },

        /**
         * The root element
         *
         * @type {jQuery}
         */
        $consoleView: $(),

        /**
         * The highlight wrapper is used to replaced matches with this wrapper and the matcher color / class
         *
         * @type {string}
         */
        highlightWrapper: '<span class="highlight {%0}">{%1}</span>',

        /**
         * The wrapper for an line in the console view
         *
         * @type {string}
         */
        lineWrapper: '<p class="console-line">{%0}</p>',

        /**
         * The wrapper for the console lines
         *
         * @type {string}
         */
        consoleWrapper: '<div class="console-view"></div>',


        /**
         * Initialize the console view
         *
         * @param {jQuery} $root The jQuery root element
         * @param {{type: string, interval: number, receivedData: function,
         *          highlight: Array<{cssClass: string, matcher: string|RegExp}>}} options
         *        The options for the jquery plugin
         */
        initialize: function($root, options) {
            this.$consoleView = $root;

            this.setOptions(options);

            this.$consoleView.addClass("console");
            this.$consoleView.data("consoleView", this);

            //setup method
            this.setupViewWrapper();
            this.setupMethod();
            this.setupFullscreenMode();
        },

        /**
         *
         */
        setupViewWrapper: function () {
            this.$consoleView.append(this.consoleWrapper);
        },

        /**
         * Checks if fullscreen mode is supported and provides it
         */
        setupFullscreenMode: function () {
            var fullscreen = $('<div class="fullscreen"><span class="glyphicon glyphicon-fullscreen"></span></div>');
            if($.support.fullscreen) {
                fullscreen.on("click", this.onClickFullscreen.bind(this));
                this.$consoleView.prepend(fullscreen);
            }
        },

        onClickFullscreen: function () {
            this.$consoleView.fullScreen();
        },

        /**
         * This function is called after the data was received from ajax or websocket and can be used
         * for manipulation before the console view self is doing this
         *
         * Only use if you really want to customize the data!!
         *
         * @param {*} data The data received from the connection
         */
        receivedData: function (data) {
            return data;
        },

        /**
         * Simple printf implementation with one placeholder to not modify console output
         *
         * @param {string} text
         */
        format: function (text) {
            var replacements = Array.prototype.slice.call(arguments, 1);
            for (var i = replacements.length; i--;) {
                text = text.replace("{%" + i + "}", replacements[i]);
            }

            return text;
        },

        /**
         * Highlights the match from the replace statement with the given color or css class
         */
        highlightMatch: function(cssClass, match) {
            return this.format(this.highlightWrapper, cssClass, match);
        },

        /**
         * Highlights the data with the given setup data
         *
         * @param {String} data Text which gets highlighted with the set of colors and matcher
         */
        highlight: function(data) {
            var highlightOption, matcher;
            for (var i = this.settings.highlight.length; i--; ) {
                highlightOption = this.settings.highlight[i];
                matcher = highlightOption.matcher;

                var regExp = matcher instanceof RegExp ? matcher : RegExp(matcher, "g");
                data = data.replace(regExp, this.highlightMatch.bind(this, highlightOption.cssClass));
            }

            return data;
        },


        /**
         * Merge new options with the settings
         *
         * @param {{type: string, interval: number, receivedData: function,
         *          highlight: Array<{cssClass: string, matcher: string|RegExp}>}} options
         */
        setOptions: function (options) {
            this.settings = $.extend(this.settings, options);
        },


        /**
         * Adds the message to the console view
         *
         * @param {jQuery} event
         * @param {object|string} data The data for the console view
         */
        appendMessage: function (event, data) {
            /**
             * @type {Function}
             */
            var receivedData = this.settings.receivedData || this.receivedData;
            this.$consoleView.find(".console-view").append(this.format(this.lineWrapper, this.highlight(receivedData(data))));
        },


        setupAjax: function() {

        },

        setupWebsocket: function() {

        },

        /**
         * Setups the method how to receive data for the view
         */
        setupMethod: function () {
            switch (this.settings.type) {
                case "event":
                    this.$consoleView.on("message", this.appendMessage.bind(this));
                    break;
                case "ajax":
                    this.setupAjax();
                    break;
                case "websocket":
                    this.setupWebsocket();
                    break;
            }
        }
    };

    $.fn.consoleView = function( options ) {
        var consoleView = this.data("consoleView");
        if(consoleView) {
            consoleView.setOptions(options);
        } else {
            consoleView = new ConsoleView(this, options);
        }

        return this;
    }
 
}(jQuery));