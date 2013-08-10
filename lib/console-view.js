(function($) {

    $.fn.consoleView = function( options ) {
 
        /**
         * Default values merged with the options
         *
         * @type {{type: string, interval: number, receivedData: function, highlight: Array<object>}}
         */
        var settings = $.extend({    
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
        }, options );

        /**
         * The root element
         *
         * @type {jQuery}
         */
        var $consoleView = this;

        /**
         * The highlight wrapper is used to replaced matches with this wrapper and the matcher color / class
         *
         * @type {string}
         */
        var highlightWrapper = '<span class="highlight {%0}">{%1}</span>';

        /**
         * The wrapper for an line in the console view
         *
         * @type {string}
         */
        var lineWrapper = '<p class="console-line">{%0}</p>';


        //====================END OF PROPERTIES====================

        /**
         * This function is called after the data was received from ajax or websocket and can be used
         * for manipulation before the console view self is doing this
         *
         * Only use if you really want to customize the data!!
         *
         * @param {*} data The data received from the source
         */
        function receivedData(data) {
            return data;
        }

        /**
         * Simple printf implementation with one placeholder to not modify console output
         *
         * @param {string} text
         */
        function format(text) {
            var replacements = Array.prototype.slice.call(arguments, 1);
            for (var i = replacements.length; i--;) {
                text = text.replace("{%" + i + "}", replacements[i]);
            }

            return text;
        }

        /**
         * Highlights the match from the replace statement with the given color or css class
         */
        function highlightMatch(match) {
            return format(highlightWrapper, this.cssClass, match);
        }

        /**
         * Highlights the data with the given setup data
         *
         * @param {String} data Text which gets highlighted with the set of colors and matcher
         */
        function highlight(data) {
            var highlightOption, matcher;
            for (var i = settings.highlight.length; i--; ) {
                highlightOption = settings.highlight[i];
                matcher = highlightOption.matcher;
                
                var regExp = matcher instanceof RegExp ? matcher : RegExp(matcher, "g");
                data = data.replace(regExp, highlightMatch.bind(highlightOption));
            }

            return data;
        }



        /**
         * Adds the message to the console view
         *
         * @param {jQuery} event
         * @param {object|string} data The data for the console view
         */
        function appendMessage(event, data) {
            $consoleView.append(format(lineWrapper, highlight(receivedData(data))))
        }


        function setupAjax() {

        }

        function setupWebsockets() {

        }

        /**
         * Setups the method how to receive data for the view
         */
        function setupMethod() {
            switch (settings.type) {
                case "event":
                    $consoleView.on("message", appendMessage);
                    break;
                case "ajax":
                    setupAjax();
                    break;
                case "websocket":
                    setupWebsockets();
                    break;
            }
        }

        /**
         * Initialize the console view
         *
         * @returns {jQuery}
         */
        function initialize() {
            $consoleView.addClass("console-view");
            //setup method
            setupMethod();
            
            return $consoleView;
        }
        
        return initialize();     
    };
 
}(jQuery));