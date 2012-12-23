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
            'z-index' : '10',
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

    // TODO: 可选择显示位置
    // TODO: 自适应高度
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

        var offset = this.offset();

        $.data(this[0], "W", this.outerWidth());
        $.data(this[0], "H", this.outerHeight());

        this.bind("mouseup", function() {
            var _dh = $(this).outerHeight();
            var _dw = $(this).outerWidth();

            if ($.data(this, "W") != _dw || $.data(this, "H") != _dh) {

                var div_offset = $div.offset();

                var _dtop = div_offset.top + (_dh - $.data(this, "H"));
                var _dleft = div_offset.left + (_dw - $.data(this, "W"));

                $div.offset({
                    top : _dtop,
                    left : _dleft
                });

                $.data(this, "W", _dw);
                $.data(this, "H", _dh);

            }
        });

        var $self = this;

        $div.bind("show.charcount", function(event, charLen) {

            $span1.html(charLen);

            $(this).append($span1).append($span2);

            var dtop = offset.top + $self.outerHeight() - $(this).height() - 2;
            var dleft = offset.left + $self.outerWidth() - $(this).width() - 6;

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
