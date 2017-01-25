(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

/*! jquery-read-analysis v0.0.3 | (c) 2017, TomoyaOtsuka | MIT Licence */
(function ($) {

  var methods = {
    ua: function ua() {
      var u = window.navigator.userAgent.toLowerCase();
      return {
        Tablet: u.indexOf("windows") != -1 && u.indexOf("touch") != -1 && u.indexOf("tablet pc") == -1 || u.indexOf("ipad") != -1 || u.indexOf("android") != -1 && u.indexOf("mobile") == -1 || u.indexOf("firefox") != -1 && u.indexOf("tablet") != -1 || u.indexOf("kindle") != -1 || u.indexOf("silk") != -1 || u.indexOf("playbook") != -1,
        Mobile: u.indexOf("windows") != -1 && u.indexOf("phone") != -1 || u.indexOf("iphone") != -1 || u.indexOf("ipod") != -1 || u.indexOf("android") != -1 && u.indexOf("mobile") != -1 || u.indexOf("firefox") != -1 && u.indexOf("mobile") != -1 || u.indexOf("blackberry") != -1
      };
    }
  };

  $.fn.read = function (option) {

    var settings = $.extend(true, {
      category: "category",
      action: "action",
      label: "label",
      position: "default",
      runtime: 5000,
      gtm: true,
      touch: false,
      debug: false
    }, option);

    var $window = $(window);
    var $this = $(this);

    var targetOffset = void 0;
    var targetHeight = void 0;
    var windowHeight = void 0;
    var decisionArea = void 0;

    var scrollFlag = true;
    var clearScrollFlag = false;
    var scrollTimer = void 0;

    var touchFlag = true;
    var clearTouchFlag = false;
    var touchTimer = void 0;

    /**
     * Window on load時の初期化
     */

    $window.on('load pjax:load', function () {
      collectSize();
      calcSize();
    });

    /**
     * スクロールに関する読了判定
     */

    $window.on('scroll', function () {
      var scrolledValue = $(this).scrollTop();
      if ($this.is(':visible') && scrolledValue > decisionArea.top && scrolledValue < decisionArea.bottom && scrollFlag) {
        scrollFlag = false;
        clearScrollFlag = true;
        scrollRun();
      } else if (scrolledValue < decisionArea.top || scrolledValue > decisionArea.bottom) {
        if (clearScrollFlag) {
          scrollFlag = true;
          clearScrollFlag = false;
          scrollClear();
        }
      }
    });

    /**
     * タッチエンドに関する読了判定
     */

    if (settings.touch && methods.ua().Mobile) {
      $window.on('touchend', function () {
        var value = $(this).scrollTop();
        if (value > decisionArea.top && value < decisionArea.bottom && touchFlag) {
          touchFlag = false;
          clearTouchFlag = true;
          touchRun();
        } else if (value < decisionArea.top || value > decisionArea.bottom) {
          if (clearTouchFlag) {
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

    var collectSize = function collectSize() {
      targetOffset = $this.offset().top;
      targetHeight = $this.height();
      windowHeight = $window.height();
    };

    /**
     * 判定エリアの計算
     * @function
     */

    var calcSize = function calcSize() {
      if (settings.position == "cover") {
        decisionArea = {
          'top': targetOffset - windowHeight,
          'bottom': targetOffset + targetHeight
        };
      } else {
        decisionArea = {
          'top': targetOffset - windowHeight / 2,
          'bottom': targetOffset + targetHeight - windowHeight / 2
        };
      }
    };

    /**
     * メソッド
     * @function
     */

    var scrollRun = function scrollRun() {
      scrollTimer = setTimeout(function () {
        scrollSuccess();
      }, settings.runtime);
    };

    var scrollClear = function scrollClear() {
      if (settings.debug) {
        console.log("Cancel: " + $this.attr('class') + " event clear.");
      }
      clearTimeout(scrollTimer);
    };

    var scrollSuccess = function scrollSuccess() {
      scrollFlag = false;
      clearScrollFlag = false;
      transmit(false);
    };

    var touchRun = function touchRun() {
      touchTimer = setTimeout(function () {
        touchSuccess();
      }, settings.runtime);
    };

    var touchClear = function touchClear() {
      if (settings.debug) {
        console.log("Cancel: " + $this.attr('class') + " event clear.");
      }
      clearTimeout(touchTimer);
    };

    var touchSuccess = function touchSuccess() {
      touchFlag = false;
      clearTouchFlag = false;
      transmit(true);
    };

    /**
     * 読了判定時に実行する関数
     * @function
     */

    var transmit = function transmit(flag) {
      if (settings.debug) {
        var message = "Success: " + $this.attr('class') + ", " + (flag ? settings.category + '-touch' : settings.category) + ", " + settings.action + ", " + settings.label;
        console.log(message);
      } else {
        if (settings.gtm) {
          dataLayer.push({ 'event': 'ga-dl-push', 'ga_category': settings.category, 'ga_action': settings.action, 'ga_label': settings.label });
        } else {
          ga('send', 'event', settings.category, settings.action, settings.label, { 'nonInteraction': true });
        }
      }
    };

    return this;
  };
})(jQuery);

},{}]},{},[1]);
