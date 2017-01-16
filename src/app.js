/*! jquery-read-analysis v0.0.2 | (c) 2017, TomoyaOtsuka | MIT Licence */
(function($) {

  const methods = {
    ua: () => {
      const u = window.navigator.userAgent.toLowerCase();
      return {
        Tablet:(u.indexOf("windows") != -1 && u.indexOf("touch") != -1 && u.indexOf("tablet pc") == -1)
          || u.indexOf("ipad") != -1
          || (u.indexOf("android") != -1 && u.indexOf("mobile") == -1)
          || (u.indexOf("firefox") != -1 && u.indexOf("tablet") != -1)
          || u.indexOf("kindle") != -1
          || u.indexOf("silk") != -1
          || u.indexOf("playbook") != -1,
        Mobile:(u.indexOf("windows") != -1 && u.indexOf("phone") != -1)
          || u.indexOf("iphone") != -1
          || u.indexOf("ipod") != -1
          || (u.indexOf("android") != -1 && u.indexOf("mobile") != -1)
          || (u.indexOf("firefox") != -1 && u.indexOf("mobile") != -1)
          || u.indexOf("blackberry") != -1
      }
    }
  };

  $.fn.read = function( option ) {

    let settings = $.extend( true, {
      category: "category",
      action:   "action",
      label:    "label",
      position: "default",
      runtime:  5000,
      gtm:      true,
      touch:    false,
      debug:    false
    }, option);

    const $window = $(window);
    const $this = $(this);

    let targetOffset;
    let targetHeight;
    let windowHeight;
    let decisionArea;

    let scrollFlag      = true;
    let clearScrollFlag = false;
    let scrollTimer;

    let touchFlag       = true;
    let clearTouchFlag  = false;
    let touchTimer;



    /**
     * Window on load時の初期化
     */

    $window.on( 'load pjax:load', function() {
      collectSize();
      calcSize();
    });



    /**
     * スクロールに関する読了判定
     */

    $window.on( 'scroll', function() {
      let scrolledValue = $(this).scrollTop();
      if  (scrolledValue > decisionArea.top && scrolledValue < decisionArea.bottom && scrollFlag ) {
        scrollFlag = false;
        clearScrollFlag = true;
        scrollRun();
      }
      else if ( scrolledValue < decisionArea.top || scrolledValue > decisionArea.bottom ) {
        if ( clearScrollFlag ) {
          scrollFlag   = true;
          clearScrollFlag = false;
          scrollClear();
        }
      }
    });



    /**
     * タッチエンドに関する読了判定
     */

    if ( settings.touch && methods.ua().Mobile ) {
      $window.on( 'touchend', function() {
        let value = $(this).scrollTop();
          if ( value > decisionArea.top && value < decisionArea.bottom && touchFlag ) {
            touchFlag = false;
            clearTouchFlag = true;
            touchRun();
          }
          else if ( value < decisionArea.top || value > decisionArea.bottom ) {
            if ( clearTouchFlag ) {
              touchFlag = true;
              clearTouchFlag = false;
              touchClear();
            }
          }
      });
    }





    /**
     * ウィンドウ、エレメントサイズの取得
     * @function
     */

    const collectSize = () => {
      targetOffset = $this.offset().top;
      targetHeight = $this.height();
      windowHeight = $window.height();
    };



    /**
     * 判定エリアの計算
     * @function
     */

    const calcSize = () => {
      if ( settings.position == "cover" ) {
        decisionArea = {
          'top'   : targetOffset - windowHeight,
          'bottom': targetOffset + targetHeight
        };
      } else {
        decisionArea = {
          'top':    targetOffset - windowHeight / 2,
          'bottom': targetOffset + targetHeight - windowHeight / 2
        };
      }
    };



    /**
     * メソッド
     * @function
     */

    const scrollRun = () => {
      scrollTimer = setTimeout( function() { scrollSuccess(); }, settings.runtime );
    };

    const scrollClear = () => {
      if ( settings.debug ) { console.log( `Cancel: ${$this.attr('class')} event clear.` ); }
      clearTimeout( scrollTimer );
    };

    const scrollSuccess = () => {
      scrollFlag = false;
      clearScrollFlag = false;
      transmit( false );
    };

    const touchRun = () => {
      touchTimer = setTimeout( function() { touchSuccess(); }, settings.runtime );
    };

    const touchClear = () => {
      if ( settings.debug ) { console.log( `Cancel: ${$this.attr('class')} event clear.` ); }
      clearTimeout( touchTimer );
    };

    const touchSuccess = () => {
      touchFlag = false;
      clearTouchFlag = false;
      transmit( true );
    };



    /**
     * 読了判定時に実行する関数
     * @function
     */

    const transmit = ( flag ) => {
      if ( settings.debug ) {
        const message = `Success: ${$this.attr('class')}, ${ flag ? settings.category+'-touch' : settings.category }, ${settings.action}, ${settings.label}`;
        console.log( message );
      }
      else {
        if ( settings.gtm ) {
          dataLayer.push({ 'event': 'ga-dl-push', 'ga_category': settings.category, 'ga_action': settings.action, 'ga_label': settings.label });
        }
        else {
          ga('send', 'event', settings.category, settings.action, settings.label, { 'nonInteraction': true });
        }
      }
    };



    return(this);
  };
})(jQuery);
