/*
 * Gamepad API Test
 * Written in 2013 by Ted Mielczarek <ted@mielczarek.org>, updated by Travis Rennemann in 2017
 *
 * To the extent possible under law, the author(s) have dedicated all copyright and related and neighboring rights to this software to the public domain worldwide. This software is distributed without any warranty.
 *
 * You should have received a copy of the CC0 Public Domain Dedication along with this software. If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.
 */

var gamepadAPI = {
    controllers: {},

    connecthandler: function (e) {
        gamepadAPI.addgamepad(e.gamepad);
    },

    addgamepad: function (gamepad) {
        gamepadAPI.controllers[gamepad.index] = gamepad; var d = document.createElement("div");
        d.setAttribute("id", "controller" + gamepad.index);
        var t = document.createElement("h1");
        t.appendChild(document.createTextNode("gamepad: " + gamepad.id));
        d.appendChild(t);
        var b = document.createElement("div");
        b.className = "buttons";
        for (var i = 0; i < gamepad.buttons.length; i++) {
            var e = document.createElement("span");
            e.className = "button";
            e.innerHTML = i;
            b.appendChild(e);
        }
        d.appendChild(b);
        var a = document.createElement("div");
        a.className = "axes";
        for (i = 0; i < gamepad.axes.length; i++) {
            e = document.createElement("progress");
            e.className = "axis";
            e.setAttribute("max", "2");
            e.setAttribute("value", "1");
            e.innerHTML = i;
            a.appendChild(e);
        }
        d.appendChild(a);
        document.getElementById("start").style.display = "none";
        document.body.appendChild(d);
        window.requestAnimationFrame(gamepadAPI.updateStatus);
    },

    disconnecthandler: function (e) {
        gamepadAPI.removegamepad(e.gamepad);
    },

    removegamepad: function (gamepad) {
        var d = document.getElementById("controller" + gamepad.index);
        document.body.removeChild(d);
        delete gamepadAPI.controllers[gamepad.index];
    },

    updateStatus: function () {
        gamepadAPI.scangamepads();
        for (j in gamepadAPI.controllers) {
            var controller = gamepadAPI.controllers[j];
            var d = document.getElementById("controller" + j);
            var buttons = d.getElementsByClassName("button");
            for (var n = 0; n < controller.buttons.length; n++) {
                var b = buttons[n];
                var val = controller.buttons[n];
                var pressed = val === 1.0;
                if (typeof val === "object") {
                    pressed = val.pressed;
                    val = val.value;
                }
                var pct = Math.round(val * 100) + "%";
                b.style.backgroundSize = pct + " " + pct;
                if (pressed) {
                    b.className = "button pressed";
                } else {
                    b.className = "button";
                }
            }

            var axes = d.getElementsByClassName("axis");
            for (var i = 0; i < controller.axes.length; i++) {
                var a = axes[i];
                a.innerHTML = i + ": " + controller.axes[i].toFixed(4);
                a.setAttribute("value", controller.axes[i] + 1);
            }
        }
        window.requestAnimationFrame(gamepadAPI.updateStatus);
    },

    scangamepads: function () {
        var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
        for (var i = 0; i < gamepads.length; i++) {
            if (gamepads[i]) {
                if (!(gamepads[i].index in gamepadAPI.controllers)) {
                    addgamepad(gamepads[i]);
                } else {
                    gamepadAPI.controllers[gamepads[i].index] = gamepads[i];
                }
            }
        }
    }
};

var haveEvents = 'GamepadEvent' in window;
var haveWebkitEvents = 'WebKitGamepadEvent' in window;

if (haveEvents) {
    window.addEventListener("gamepadconnected", gamepadAPI.connecthandler);
    window.addEventListener("gamepaddisconnected", gamepadAPI.disconnecthandler);
} else if (haveWebkitEvents) {
    window.addEventListener("webkitgamepadconnected", gamepadAPI.connecthandler);
    window.addEventListener("webkitgamepaddisconnected", gamepadAPI.disconnecthandler);
} else {
    setInterval(gamepadAPI.scangamepads, 500);
}
