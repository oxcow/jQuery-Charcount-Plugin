/**
 * @author Gina
 */
(function($) {
    var CharCountCSS = {
        divCss : {
            margin : '0px 0px',
            padding : '0px 0px',
            position : 'absolute',
            display : 'inline',
            'z-index' : '10px',
            'font-family' : 'Constantia, Georgia',
            'font-size' : '22px'
        },
        span2Css : {
            color : 'teal',
            'font-size' : '20px'
        },
        normalCss : {
            'font-weight' : 'normal',
            color : 'black'
        },
        overflowCss : {
            'font-weight' : 'bold',
            color : 'red'
        }
    };

    // 统计当前字符长度
    function countChar($obj) {
        return $obj.val() ? $obj.val().length : 0;
    };

    function _defaultOverflowEvent(maxLen) {
        $(this).val($(this).val().substring(0, maxLen));
    };

    $.fn.charcount = function(options) {

        if ( typeof options === 'number') {
            options = {
                max : options
            };
        }

        var opts = $.extend(true, {}, $.fn.charcount.defaults, options);

        var $div = $("<div>").css(CharCountCSS.divCss);

        this.after($div);

        var $span1 = $("<span>");

        var $span2 = opts.max ? $("<span>").css(CharCountCSS.span2Css).text("/" + opts.max) : null;

        var attrs = {
            offset : this.offset(),
            outerHeight : this.outerHeight(),
            outerWidth : this.outerWidth(),
        };
        //console.info(attrs);
        var $self = this;

        $div.bind("show.charcount", function(event, charLen) {

            $span1.html(charLen);

            $(this).append($span1).append($span2);

            var dh = $(this).height();
            var dw = $(this).width();

            var dtop = attrs.offset.top + attrs.outerHeight - dh;
            var dleft = attrs.offset.left + attrs.outerWidth - dw - 4;

            //console.info(dh, dw, dtop, dleft);

            $(this).offset({
                top : dtop,
                left : dleft
            });

        });

        this.bind("keyup.charcount", function() {
            if (opts.max && countChar($(this)) > opts.max) {
                $span1.css(CharCountCSS.overflowCss);
                opts.overflowevt.call($self[0], opts.max);
            } else {
                $span1.css(CharCountCSS.normalCss);
            }
            $div.trigger("show.charcount", countChar($(this)));
        });

        // 鼠标粘贴、剪贴事件
        this.bind("paste.charcount cut.charcount", function() {
            setTimeout(function() {
                $self.trigger('keyup.charcount');
            }, 5);
        });
    };

    $.fn.charcount.defaults = {
        max : 0,
        overflowevt : _defaultOverflowEvent
    };
})(jQuery);
