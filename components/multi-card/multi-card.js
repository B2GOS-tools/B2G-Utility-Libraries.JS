/**
 *  Module: Multi Card
 *
 *  Product: Open Web Device
 *
 *  Copyright(c) 2012 Telefónica I+D S.A.U.
 *
 *  LICENSE: Apache 2.0
 *
 *  @author Telefonica Digital
 *
 *  @example (Markup)
 *
 *  <section class="appMain multiCard">
 *   <section id="listCard" data-position="home">
 *   </section>
 *
 *   <section id="editCard" data-position="right">
 *   </section>
 *
 *   <section id="detailCard" data-position="right">
 *   </section>
 *  </section>
 *
 */

'use strict';

var owd = window.owd || {};

if(!owd.multiCard) {

  (function(doc) {
    owd.MultiCardHandler = function (container) {
      var currentCard; // Referente to current view
      var cards = {}; // Map of views
      var history = []; // Pool of views
      var dataPositionAttr = 'data-position';
      var position = {
        LEFT: 'left',
        RIGHT: 'right',
        TOP: 'top',
        DOWN: 'down',
        HOME: 'home'
      };

      var oppositePosition = {
        left: position.RIGHT,
        right: position.LEFT,
        top: position.DOWN,
        down: position.TOP
      };

      var childnodes = container.childNodes;
      var length = childnodes.length;

      for(var count = 0; count < length; count++) {
        var child = childnodes[count];
        if (child.tagName && child.tagName.toLowerCase() === "section") {
          cards[child.id] = child;
          if (child.getAttribute (dataPositionAttr) === position.HOME) {
            currentCard = child;
            history.push(currentCard);
          }
        }
      }

      if (!window.requestAnimFrame) {
        window.requestAnimFrame = (function() {
          return window.mozRequestAnimationFrame || window.requestAnimationFrame
                 || function(/* function */callback, /* DOMElement */element) {
                      window.setTimeout(callback, 1000 / 60);
                    };
                 })();
      }

      /*
       *  The view disappears in favour of the new view
       *
       *  @param {DOMElement} the view
       *
       *  @param {String} value
       *
       *  @param {String} view will be translated from this position
       *
       */
      function toggle (view, pos) {
        view.setAttribute (dataPositionAttr, oppositePosition[pos]);
      }

      return {
        /*
         *  Returns the view by identifier
         *
         *  @param {String} identifier of the view
         *
         */
        get: function (id) {
          return cards[id];
        },

        /*
         *  Navigates to a view by identifier
         *
         *  @param {String} identifier of the view
         *
         */
        go: function (id) {
          if (id !== currentCard.id) {
            var goCard = cards[id];
            requestAnimFrame(function (){
              toggle (currentCard, goCard.getAttribute (dataPositionAttr));
              currentCard = goCard;
              history.push(currentCard);
              currentCard.setAttribute (dataPositionAttr, position.HOME);
            });
          }
        },

        /*
         *  Navigates to the previous view
         */
        back: function () {
          var count = history.length;
          if (count > 1) {
            currentCard = history[count - 2];
            var lastCard = history.pop();
            requestAnimFrame(function (){
              toggle (lastCard, currentCard.getAttribute (dataPositionAttr));
              currentCard.setAttribute (dataPositionAttr, position.HOME)
            });
          }
        },

        /*
         *  Returns the current view
         */
        current: function () {
          return currentCard;
        }
      }
    }

    if (doc.readyState === 'complete') {
      exec();
    } else {
      window.addEventListener('DOMContentLoaded', function loaded() {
        window.removeEventListener('DOMContentLoaded', loaded);
        exec();
      });
    }

    function exec() {
      var multiCards = doc.querySelectorAll('.multiCard');
      if (multiCards.length > 0) {
        // Publishing the owd.multiCard API
        owd.multiCard = new owd.MultiCardHandler(multiCards[0]);
      }
    }

  })(document);
}