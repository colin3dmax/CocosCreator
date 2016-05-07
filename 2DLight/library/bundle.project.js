require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"DrawSeg":[function(require,module,exports){
"use strict";
cc._RFpush(module, '9abf2gT0JVFU6XeixbvW9PI', 'DrawSeg');
// Script/DrawSeg.js

var LightLine = {
    segA: cc.p(0, 0),
    segB: cc.p(0, 0)
};

var PointWithAngle = {
    point: cc.p(0, 0),
    angle: -1
};

cc.Class({
    "extends": cc.Component,

    properties: {
        /* 线段 */
        _segs: [],
        /* 角度 */
        _angle: [],
        /* 交叉点 */
        _intersects: [],

        /* 灯光 */
        _light: {
            "default": null,
            type: cc.Node,
            visible: true
        },

        /* 光线层(只是个节点) */
        _bufferLine: {
            "default": null,
            type: cc.Node,
            visible: true
        }
    },

    onLoad: function onLoad() {
        this._view = cc.view.getDesignResolutionSize();

        this._drawLine = new cc.DrawNode();
        this._updateDraw = new cc.DrawNode();
        this._drawLine.setPosition(0, 0);
        this._updateDraw.setPosition(0, 0);
        this.node._sgNode.addChild(this._drawLine);
        this._bufferLine._sgNode.addChild(this._updateDraw);
        this._per;

        this.initTouchEvent();
        this.initSegs();
        this.drawSegs();
        this.getEachPointAngle();
        this.drawSegsBuffer();
    },

    initTouchEvent: function initTouchEvent() {
        var self = this;
        cc.eventManager.addListener(cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: function onTouchBegan(event) {
                self._per = event.getLocation();
                return true;
            },
            onTouchMoved: function onTouchMoved(event) {

                if (self._bDrawBuffer) {
                    self._intersects = [];
                    self._angle = [];
                    self._bDrawBuffer = false;
                    if (self._updateDraw) {
                        self._updateDraw.clear();
                    }
                }

                var _l = event.getLocation();
                var _subX = _l.x - self._per.x;
                var _subY = _l.y - self._per.y;

                self._light.x += _subX;
                self._light.y += _subY;

                self._per = event.getLocation();

                if (!self._bDrawBuffer) {
                    self.getEachPointAngle();
                    self.drawSegsBuffer();
                }
            },
            onTouchEnded: function onTouchEnded(event) {}
        }), this);
    },

    /* 初始化线段端点 */
    initSegs: function initSegs() {

        // left line
        var _lightLine = Object.create(LightLine);
        _lightLine.segA = this._pointToJS(1, 1);
        _lightLine.segB = this._pointToJS(1, this._view.height - 1);
        this._segs.push(_lightLine);

        // up line
        var _lightLine = Object.create(LightLine);
        _lightLine.segA = this._pointToJS(1, this._view.height - 1);
        _lightLine.segB = this._pointToJS(this._view.width - 1, this._view.height - 1);
        this._segs.push(_lightLine);

        // right line
        var _lightLine = Object.create(LightLine);
        _lightLine.segA = this._pointToJS(this._view.width - 1, this._view.height - 1);
        _lightLine.segB = this._pointToJS(this._view.width - 1, 1);
        this._segs.push(_lightLine);

        // down line
        var _lightLine = Object.create(LightLine);
        _lightLine.segA = this._pointToJS(this._view.width - 1, 1);
        _lightLine.segB = this._pointToJS(1, 1);
        this._segs.push(_lightLine);

        // polygon #1
        var _lightLine = Object.create(LightLine);
        _lightLine.segA = this._pointToJS(80, 300);
        _lightLine.segB = this._pointToJS(120, 100);
        this._segs.push(_lightLine);

        var _lightLine = Object.create(LightLine);
        _lightLine.segA = this._pointToJS(120, 100);
        _lightLine.segB = this._pointToJS(240, 160);
        this._segs.push(_lightLine);

        var _lightLine = Object.create(LightLine);
        _lightLine.segA = this._pointToJS(240, 160);
        _lightLine.segB = this._pointToJS(160, 420);
        this._segs.push(_lightLine);

        var _lightLine = Object.create(LightLine);
        _lightLine.segA = this._pointToJS(160, 420);
        _lightLine.segB = this._pointToJS(80, 300);
        this._segs.push(_lightLine);

        // polygon #2
        var _lightLine = Object.create(LightLine);
        _lightLine.segA = this._pointToJS(100, 400);
        _lightLine.segB = this._pointToJS(140, 500);
        this._segs.push(_lightLine);

        var _lightLine = Object.create(LightLine);
        _lightLine.segA = this._pointToJS(140, 500);
        _lightLine.segB = this._pointToJS(20, 600);
        this._segs.push(_lightLine);

        var _lightLine = Object.create(LightLine);
        _lightLine.segA = this._pointToJS(20, 600);
        _lightLine.segB = this._pointToJS(100, 400);
        this._segs.push(_lightLine);

        // polygon #3
        var _lightLine = Object.create(LightLine);
        _lightLine.segA = this._pointToJS(300, 520);
        _lightLine.segB = this._pointToJS(340, 300);
        this._segs.push(_lightLine);

        var _lightLine = Object.create(LightLine);
        _lightLine.segA = this._pointToJS(340, 300);
        _lightLine.segB = this._pointToJS(500, 400);
        this._segs.push(_lightLine);

        var _lightLine = Object.create(LightLine);
        _lightLine.segA = this._pointToJS(500, 400);
        _lightLine.segB = this._pointToJS(600, 640);
        this._segs.push(_lightLine);

        var _lightLine = Object.create(LightLine);
        _lightLine.segA = this._pointToJS(600, 640);
        _lightLine.segB = this._pointToJS(300, 520);
        this._segs.push(_lightLine);

        // polygon #4
        var _lightLine = Object.create(LightLine);
        _lightLine.segA = this._pointToJS(580, 120);
        _lightLine.segB = this._pointToJS(620, 80);
        this._segs.push(_lightLine);

        var _lightLine = Object.create(LightLine);
        _lightLine.segA = this._pointToJS(620, 80);
        _lightLine.segB = this._pointToJS(640, 140);
        this._segs.push(_lightLine);

        var _lightLine = Object.create(LightLine);
        _lightLine.segA = this._pointToJS(640, 140);
        _lightLine.segB = this._pointToJS(580, 120);
        this._segs.push(_lightLine);

        // polygon #5
        var _lightLine = Object.create(LightLine);
        _lightLine.segA = this._pointToJS(800, 380);
        _lightLine.segB = this._pointToJS(1020, 340);
        this._segs.push(_lightLine);

        var _lightLine = Object.create(LightLine);
        _lightLine.segA = this._pointToJS(1020, 340);
        _lightLine.segB = this._pointToJS(980, 540);
        this._segs.push(_lightLine);

        var _lightLine = Object.create(LightLine);
        _lightLine.segA = this._pointToJS(980, 540);
        _lightLine.segB = this._pointToJS(760, 580);
        this._segs.push(_lightLine);

        var _lightLine = Object.create(LightLine);
        _lightLine.segA = this._pointToJS(760, 580);
        _lightLine.segB = this._pointToJS(800, 380);
        this._segs.push(_lightLine);

        // polygon #6
        var _lightLine = Object.create(LightLine);
        _lightLine.segA = this._pointToJS(700, 190);
        _lightLine.segB = this._pointToJS(1060, 100);
        this._segs.push(_lightLine);

        var _lightLine = Object.create(LightLine);
        _lightLine.segA = this._pointToJS(1060, 100);
        _lightLine.segB = this._pointToJS(860, 300);
        this._segs.push(_lightLine);

        var _lightLine = Object.create(LightLine);
        _lightLine.segA = this._pointToJS(860, 300);
        _lightLine.segB = this._pointToJS(700, 190);
        this._segs.push(_lightLine);
    },

    /* 绘制线段 */
    drawSegs: function drawSegs() {
        for (var i = 0; i < this._segs.length; i++) {
            this._drawLine.drawSegment(this._segs[i].segA, this._segs[i].segB);
        }
    },

    drawSegsBuffer: function drawSegsBuffer() {
        console.log(this._intersects);
        for (var i = 0; i < this._intersects.length - 1; i++) {
            this._updateDraw.drawSegment(cc.p(this._light.x, this._light.y), this._intersects[i].point);

            /* 查看光线范围打开注释, 有问题 */
            /*
            this._updateDraw.drawPoly( [ cc.p(this._light.x, this._light.y), this._intersects[i].point, this._intersects[ i + 1 ].point, cc.p(this._light.x, this._light.y)],
                                        cc.color(0, 255, 255, 50), 2, cc.color(255, 0, 255, 255));
            */
        }
        /* 查看光线范围打开注释, 有问题 */

        this._updateDraw.drawPoly([cc.p(this._light.x, this._light.y), this._intersects[0].point, this._intersects[this._intersects.length - 1].point, cc.p(this._light.x, this._light.y)], cc.color(0, 255, 255, 50), 2, cc.color(255, 0, 255, 255));

        this._bDrawBuffer = true;
    },

    /* 获得点角度 */
    getEachPointAngle: function getEachPointAngle() {
        /* 获得唯一点 */
        var tmpPoint = new Array();
        for (var i = 0; i < this._segs.length; i++) {
            var isFind = this._find(tmpPoint, this._segs[i].segA);
            if (-1 === isFind) {
                tmpPoint.push(this._segs[i].segA);
            }

            isFind = this._find(tmpPoint, this._segs[i].segB);
            if (-1 === isFind) {
                tmpPoint.push(this._segs[i].segB);
            }
        }

        /* 获得唯一点的角度 */
        for (var i = 0; i < tmpPoint.length; i++) {
            var _l = cc.p(this._light.x, this._light.y); //
            var _a = Math.atan2(tmpPoint[i].y - _l.y, tmpPoint[i].x - _l.x);
            this._angle.push(_a - 0.00001);
            this._angle.push(_a);
            this._angle.push(_a + 0.00001);
        }

        /* 循环各角度, 找出最近的点 */
        for (var i = 0; i < this._angle.length; i++) {
            var dx = Math.cos(this._angle[i]);
            var dy = Math.sin(this._angle[i]);

            var _lightLine = Object.create(LightLine);
            _lightLine.segA = cc.p(this._light.x, this._light.y);
            _lightLine.segB = cc.p(this._light.x + dx, this._light.y + dy);

            var minT1 = 0;
            for (var ii = 0; ii < this._segs.length; ii++) {
                var tmpT1 = this._getIntersection(_lightLine, this._segs[ii]);
                if (-1 === tmpT1) {
                    continue;
                }
                if (0 === minT1 || minT1 > tmpT1) {
                    minT1 = tmpT1;
                }
            }

            var _pAngle = Object.create(PointWithAngle);
            //_pAngle.point = this._pointToJS( this._light.x + minT1 * dx, this._light.y + minT1 * dy );
            _pAngle.point = cc.p(this._light.x + minT1 * dx, this._light.y + minT1 * dy);
            _pAngle.angle = this._angle[i];
            this._intersects.push(_pAngle);
        }

        this._intersects.sort(function (a, b) {
            return a.angle - b.angle;
        });
    },

    /* 射线判断交点 */
    _getIntersection: function _getIntersection(_ray, _seg) {
        var r_px = _ray.segA.x;
        var r_py = _ray.segA.y;
        var r_dx = _ray.segB.x - _ray.segA.x;
        var r_dy = _ray.segB.y - _ray.segA.y;

        var s_px = _seg.segA.x;
        var s_py = _seg.segA.y;
        var s_dx = _seg.segB.x - _seg.segA.x;
        var s_dy = _seg.segB.y - _seg.segA.y;

        var r_mag = Math.sqrt(r_dx * r_dx + r_dy * r_dy);
        var s_mag = Math.sqrt(s_dx * s_dx + s_dy * s_dy);
        if (r_dx / r_mag == s_dx / s_mag && r_dy / r_mag == s_dy / s_mag) {
            return -1;
        }

        var t2 = (r_dx * (s_py - r_py) + r_dy * (r_px - s_px)) / (s_dx * r_dy - s_dy * r_dx);
        var t1 = (s_px + s_dx * t2 - r_px) / r_dx;
        if (t1 < 0 || t2 < 0 || t2 > 1) {
            return -1;
        }

        return t1;
    },

    /* 点坐标转化 */
    _pointToJS: function _pointToJS(_x, _y) {
        return cc.p(-1 * this._view.width / 2 + _x, -1 * this._view.height / 2 + _y);
    },

    _find: function _find(_arr, _segPoint) {
        for (var i = 0; i < _arr.length; i++) {
            if (_arr[i].x === _segPoint.x && _arr[i].y === _segPoint.y) {
                return i;
            }
        }
        return -1;
    }

});

cc._RFpop();
},{}]},{},["DrawSeg"])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL0FwcGxpY2F0aW9ucy9Db2Nvc0NyZWF0b3IuYXBwL0NvbnRlbnRzL1Jlc291cmNlcy9hcHAuYXNhci9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiYXNzZXRzL1NjcmlwdC9EcmF3U2VnLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICc5YWJmMmdUMEpWRlU2WGVpeGJ2VzlQSScsICdEcmF3U2VnJyk7XG4vLyBTY3JpcHQvRHJhd1NlZy5qc1xuXG52YXIgTGlnaHRMaW5lID0ge1xuICAgIHNlZ0E6IGNjLnAoMCwgMCksXG4gICAgc2VnQjogY2MucCgwLCAwKVxufTtcblxudmFyIFBvaW50V2l0aEFuZ2xlID0ge1xuICAgIHBvaW50OiBjYy5wKDAsIDApLFxuICAgIGFuZ2xlOiAtMVxufTtcblxuY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8qIOe6v+autSAqL1xuICAgICAgICBfc2VnczogW10sXG4gICAgICAgIC8qIOinkuW6piAqL1xuICAgICAgICBfYW5nbGU6IFtdLFxuICAgICAgICAvKiDkuqTlj4nngrkgKi9cbiAgICAgICAgX2ludGVyc2VjdHM6IFtdLFxuXG4gICAgICAgIC8qIOeBr+WFiSAqL1xuICAgICAgICBfbGlnaHQ6IHtcbiAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTm9kZSxcbiAgICAgICAgICAgIHZpc2libGU6IHRydWVcbiAgICAgICAgfSxcblxuICAgICAgICAvKiDlhYnnur/lsYIo5Y+q5piv5Liq6IqC54K5KSAqL1xuICAgICAgICBfYnVmZmVyTGluZToge1xuICAgICAgICAgICAgXCJkZWZhdWx0XCI6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5Ob2RlLFxuICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB0aGlzLl92aWV3ID0gY2Mudmlldy5nZXREZXNpZ25SZXNvbHV0aW9uU2l6ZSgpO1xuXG4gICAgICAgIHRoaXMuX2RyYXdMaW5lID0gbmV3IGNjLkRyYXdOb2RlKCk7XG4gICAgICAgIHRoaXMuX3VwZGF0ZURyYXcgPSBuZXcgY2MuRHJhd05vZGUoKTtcbiAgICAgICAgdGhpcy5fZHJhd0xpbmUuc2V0UG9zaXRpb24oMCwgMCk7XG4gICAgICAgIHRoaXMuX3VwZGF0ZURyYXcuc2V0UG9zaXRpb24oMCwgMCk7XG4gICAgICAgIHRoaXMubm9kZS5fc2dOb2RlLmFkZENoaWxkKHRoaXMuX2RyYXdMaW5lKTtcbiAgICAgICAgdGhpcy5fYnVmZmVyTGluZS5fc2dOb2RlLmFkZENoaWxkKHRoaXMuX3VwZGF0ZURyYXcpO1xuICAgICAgICB0aGlzLl9wZXI7XG5cbiAgICAgICAgdGhpcy5pbml0VG91Y2hFdmVudCgpO1xuICAgICAgICB0aGlzLmluaXRTZWdzKCk7XG4gICAgICAgIHRoaXMuZHJhd1NlZ3MoKTtcbiAgICAgICAgdGhpcy5nZXRFYWNoUG9pbnRBbmdsZSgpO1xuICAgICAgICB0aGlzLmRyYXdTZWdzQnVmZmVyKCk7XG4gICAgfSxcblxuICAgIGluaXRUb3VjaEV2ZW50OiBmdW5jdGlvbiBpbml0VG91Y2hFdmVudCgpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICBjYy5ldmVudE1hbmFnZXIuYWRkTGlzdGVuZXIoY2MuRXZlbnRMaXN0ZW5lci5jcmVhdGUoe1xuICAgICAgICAgICAgZXZlbnQ6IGNjLkV2ZW50TGlzdGVuZXIuVE9VQ0hfT05FX0JZX09ORSxcbiAgICAgICAgICAgIG9uVG91Y2hCZWdhbjogZnVuY3Rpb24gb25Ub3VjaEJlZ2FuKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgc2VsZi5fcGVyID0gZXZlbnQuZ2V0TG9jYXRpb24oKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBvblRvdWNoTW92ZWQ6IGZ1bmN0aW9uIG9uVG91Y2hNb3ZlZChldmVudCkge1xuXG4gICAgICAgICAgICAgICAgaWYgKHNlbGYuX2JEcmF3QnVmZmVyKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuX2ludGVyc2VjdHMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5fYW5nbGUgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5fYkRyYXdCdWZmZXIgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGYuX3VwZGF0ZURyYXcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuX3VwZGF0ZURyYXcuY2xlYXIoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHZhciBfbCA9IGV2ZW50LmdldExvY2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgdmFyIF9zdWJYID0gX2wueCAtIHNlbGYuX3Blci54O1xuICAgICAgICAgICAgICAgIHZhciBfc3ViWSA9IF9sLnkgLSBzZWxmLl9wZXIueTtcblxuICAgICAgICAgICAgICAgIHNlbGYuX2xpZ2h0LnggKz0gX3N1Ylg7XG4gICAgICAgICAgICAgICAgc2VsZi5fbGlnaHQueSArPSBfc3ViWTtcblxuICAgICAgICAgICAgICAgIHNlbGYuX3BlciA9IGV2ZW50LmdldExvY2F0aW9uKCk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIXNlbGYuX2JEcmF3QnVmZmVyKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuZ2V0RWFjaFBvaW50QW5nbGUoKTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5kcmF3U2Vnc0J1ZmZlcigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBvblRvdWNoRW5kZWQ6IGZ1bmN0aW9uIG9uVG91Y2hFbmRlZChldmVudCkge31cbiAgICAgICAgfSksIHRoaXMpO1xuICAgIH0sXG5cbiAgICAvKiDliJ3lp4vljJbnur/mrrXnq6/ngrkgKi9cbiAgICBpbml0U2VnczogZnVuY3Rpb24gaW5pdFNlZ3MoKSB7XG5cbiAgICAgICAgLy8gbGVmdCBsaW5lXG4gICAgICAgIHZhciBfbGlnaHRMaW5lID0gT2JqZWN0LmNyZWF0ZShMaWdodExpbmUpO1xuICAgICAgICBfbGlnaHRMaW5lLnNlZ0EgPSB0aGlzLl9wb2ludFRvSlMoMSwgMSk7XG4gICAgICAgIF9saWdodExpbmUuc2VnQiA9IHRoaXMuX3BvaW50VG9KUygxLCB0aGlzLl92aWV3LmhlaWdodCAtIDEpO1xuICAgICAgICB0aGlzLl9zZWdzLnB1c2goX2xpZ2h0TGluZSk7XG5cbiAgICAgICAgLy8gdXAgbGluZVxuICAgICAgICB2YXIgX2xpZ2h0TGluZSA9IE9iamVjdC5jcmVhdGUoTGlnaHRMaW5lKTtcbiAgICAgICAgX2xpZ2h0TGluZS5zZWdBID0gdGhpcy5fcG9pbnRUb0pTKDEsIHRoaXMuX3ZpZXcuaGVpZ2h0IC0gMSk7XG4gICAgICAgIF9saWdodExpbmUuc2VnQiA9IHRoaXMuX3BvaW50VG9KUyh0aGlzLl92aWV3LndpZHRoIC0gMSwgdGhpcy5fdmlldy5oZWlnaHQgLSAxKTtcbiAgICAgICAgdGhpcy5fc2Vncy5wdXNoKF9saWdodExpbmUpO1xuXG4gICAgICAgIC8vIHJpZ2h0IGxpbmVcbiAgICAgICAgdmFyIF9saWdodExpbmUgPSBPYmplY3QuY3JlYXRlKExpZ2h0TGluZSk7XG4gICAgICAgIF9saWdodExpbmUuc2VnQSA9IHRoaXMuX3BvaW50VG9KUyh0aGlzLl92aWV3LndpZHRoIC0gMSwgdGhpcy5fdmlldy5oZWlnaHQgLSAxKTtcbiAgICAgICAgX2xpZ2h0TGluZS5zZWdCID0gdGhpcy5fcG9pbnRUb0pTKHRoaXMuX3ZpZXcud2lkdGggLSAxLCAxKTtcbiAgICAgICAgdGhpcy5fc2Vncy5wdXNoKF9saWdodExpbmUpO1xuXG4gICAgICAgIC8vIGRvd24gbGluZVxuICAgICAgICB2YXIgX2xpZ2h0TGluZSA9IE9iamVjdC5jcmVhdGUoTGlnaHRMaW5lKTtcbiAgICAgICAgX2xpZ2h0TGluZS5zZWdBID0gdGhpcy5fcG9pbnRUb0pTKHRoaXMuX3ZpZXcud2lkdGggLSAxLCAxKTtcbiAgICAgICAgX2xpZ2h0TGluZS5zZWdCID0gdGhpcy5fcG9pbnRUb0pTKDEsIDEpO1xuICAgICAgICB0aGlzLl9zZWdzLnB1c2goX2xpZ2h0TGluZSk7XG5cbiAgICAgICAgLy8gcG9seWdvbiAjMVxuICAgICAgICB2YXIgX2xpZ2h0TGluZSA9IE9iamVjdC5jcmVhdGUoTGlnaHRMaW5lKTtcbiAgICAgICAgX2xpZ2h0TGluZS5zZWdBID0gdGhpcy5fcG9pbnRUb0pTKDgwLCAzMDApO1xuICAgICAgICBfbGlnaHRMaW5lLnNlZ0IgPSB0aGlzLl9wb2ludFRvSlMoMTIwLCAxMDApO1xuICAgICAgICB0aGlzLl9zZWdzLnB1c2goX2xpZ2h0TGluZSk7XG5cbiAgICAgICAgdmFyIF9saWdodExpbmUgPSBPYmplY3QuY3JlYXRlKExpZ2h0TGluZSk7XG4gICAgICAgIF9saWdodExpbmUuc2VnQSA9IHRoaXMuX3BvaW50VG9KUygxMjAsIDEwMCk7XG4gICAgICAgIF9saWdodExpbmUuc2VnQiA9IHRoaXMuX3BvaW50VG9KUygyNDAsIDE2MCk7XG4gICAgICAgIHRoaXMuX3NlZ3MucHVzaChfbGlnaHRMaW5lKTtcblxuICAgICAgICB2YXIgX2xpZ2h0TGluZSA9IE9iamVjdC5jcmVhdGUoTGlnaHRMaW5lKTtcbiAgICAgICAgX2xpZ2h0TGluZS5zZWdBID0gdGhpcy5fcG9pbnRUb0pTKDI0MCwgMTYwKTtcbiAgICAgICAgX2xpZ2h0TGluZS5zZWdCID0gdGhpcy5fcG9pbnRUb0pTKDE2MCwgNDIwKTtcbiAgICAgICAgdGhpcy5fc2Vncy5wdXNoKF9saWdodExpbmUpO1xuXG4gICAgICAgIHZhciBfbGlnaHRMaW5lID0gT2JqZWN0LmNyZWF0ZShMaWdodExpbmUpO1xuICAgICAgICBfbGlnaHRMaW5lLnNlZ0EgPSB0aGlzLl9wb2ludFRvSlMoMTYwLCA0MjApO1xuICAgICAgICBfbGlnaHRMaW5lLnNlZ0IgPSB0aGlzLl9wb2ludFRvSlMoODAsIDMwMCk7XG4gICAgICAgIHRoaXMuX3NlZ3MucHVzaChfbGlnaHRMaW5lKTtcblxuICAgICAgICAvLyBwb2x5Z29uICMyXG4gICAgICAgIHZhciBfbGlnaHRMaW5lID0gT2JqZWN0LmNyZWF0ZShMaWdodExpbmUpO1xuICAgICAgICBfbGlnaHRMaW5lLnNlZ0EgPSB0aGlzLl9wb2ludFRvSlMoMTAwLCA0MDApO1xuICAgICAgICBfbGlnaHRMaW5lLnNlZ0IgPSB0aGlzLl9wb2ludFRvSlMoMTQwLCA1MDApO1xuICAgICAgICB0aGlzLl9zZWdzLnB1c2goX2xpZ2h0TGluZSk7XG5cbiAgICAgICAgdmFyIF9saWdodExpbmUgPSBPYmplY3QuY3JlYXRlKExpZ2h0TGluZSk7XG4gICAgICAgIF9saWdodExpbmUuc2VnQSA9IHRoaXMuX3BvaW50VG9KUygxNDAsIDUwMCk7XG4gICAgICAgIF9saWdodExpbmUuc2VnQiA9IHRoaXMuX3BvaW50VG9KUygyMCwgNjAwKTtcbiAgICAgICAgdGhpcy5fc2Vncy5wdXNoKF9saWdodExpbmUpO1xuXG4gICAgICAgIHZhciBfbGlnaHRMaW5lID0gT2JqZWN0LmNyZWF0ZShMaWdodExpbmUpO1xuICAgICAgICBfbGlnaHRMaW5lLnNlZ0EgPSB0aGlzLl9wb2ludFRvSlMoMjAsIDYwMCk7XG4gICAgICAgIF9saWdodExpbmUuc2VnQiA9IHRoaXMuX3BvaW50VG9KUygxMDAsIDQwMCk7XG4gICAgICAgIHRoaXMuX3NlZ3MucHVzaChfbGlnaHRMaW5lKTtcblxuICAgICAgICAvLyBwb2x5Z29uICMzXG4gICAgICAgIHZhciBfbGlnaHRMaW5lID0gT2JqZWN0LmNyZWF0ZShMaWdodExpbmUpO1xuICAgICAgICBfbGlnaHRMaW5lLnNlZ0EgPSB0aGlzLl9wb2ludFRvSlMoMzAwLCA1MjApO1xuICAgICAgICBfbGlnaHRMaW5lLnNlZ0IgPSB0aGlzLl9wb2ludFRvSlMoMzQwLCAzMDApO1xuICAgICAgICB0aGlzLl9zZWdzLnB1c2goX2xpZ2h0TGluZSk7XG5cbiAgICAgICAgdmFyIF9saWdodExpbmUgPSBPYmplY3QuY3JlYXRlKExpZ2h0TGluZSk7XG4gICAgICAgIF9saWdodExpbmUuc2VnQSA9IHRoaXMuX3BvaW50VG9KUygzNDAsIDMwMCk7XG4gICAgICAgIF9saWdodExpbmUuc2VnQiA9IHRoaXMuX3BvaW50VG9KUyg1MDAsIDQwMCk7XG4gICAgICAgIHRoaXMuX3NlZ3MucHVzaChfbGlnaHRMaW5lKTtcblxuICAgICAgICB2YXIgX2xpZ2h0TGluZSA9IE9iamVjdC5jcmVhdGUoTGlnaHRMaW5lKTtcbiAgICAgICAgX2xpZ2h0TGluZS5zZWdBID0gdGhpcy5fcG9pbnRUb0pTKDUwMCwgNDAwKTtcbiAgICAgICAgX2xpZ2h0TGluZS5zZWdCID0gdGhpcy5fcG9pbnRUb0pTKDYwMCwgNjQwKTtcbiAgICAgICAgdGhpcy5fc2Vncy5wdXNoKF9saWdodExpbmUpO1xuXG4gICAgICAgIHZhciBfbGlnaHRMaW5lID0gT2JqZWN0LmNyZWF0ZShMaWdodExpbmUpO1xuICAgICAgICBfbGlnaHRMaW5lLnNlZ0EgPSB0aGlzLl9wb2ludFRvSlMoNjAwLCA2NDApO1xuICAgICAgICBfbGlnaHRMaW5lLnNlZ0IgPSB0aGlzLl9wb2ludFRvSlMoMzAwLCA1MjApO1xuICAgICAgICB0aGlzLl9zZWdzLnB1c2goX2xpZ2h0TGluZSk7XG5cbiAgICAgICAgLy8gcG9seWdvbiAjNFxuICAgICAgICB2YXIgX2xpZ2h0TGluZSA9IE9iamVjdC5jcmVhdGUoTGlnaHRMaW5lKTtcbiAgICAgICAgX2xpZ2h0TGluZS5zZWdBID0gdGhpcy5fcG9pbnRUb0pTKDU4MCwgMTIwKTtcbiAgICAgICAgX2xpZ2h0TGluZS5zZWdCID0gdGhpcy5fcG9pbnRUb0pTKDYyMCwgODApO1xuICAgICAgICB0aGlzLl9zZWdzLnB1c2goX2xpZ2h0TGluZSk7XG5cbiAgICAgICAgdmFyIF9saWdodExpbmUgPSBPYmplY3QuY3JlYXRlKExpZ2h0TGluZSk7XG4gICAgICAgIF9saWdodExpbmUuc2VnQSA9IHRoaXMuX3BvaW50VG9KUyg2MjAsIDgwKTtcbiAgICAgICAgX2xpZ2h0TGluZS5zZWdCID0gdGhpcy5fcG9pbnRUb0pTKDY0MCwgMTQwKTtcbiAgICAgICAgdGhpcy5fc2Vncy5wdXNoKF9saWdodExpbmUpO1xuXG4gICAgICAgIHZhciBfbGlnaHRMaW5lID0gT2JqZWN0LmNyZWF0ZShMaWdodExpbmUpO1xuICAgICAgICBfbGlnaHRMaW5lLnNlZ0EgPSB0aGlzLl9wb2ludFRvSlMoNjQwLCAxNDApO1xuICAgICAgICBfbGlnaHRMaW5lLnNlZ0IgPSB0aGlzLl9wb2ludFRvSlMoNTgwLCAxMjApO1xuICAgICAgICB0aGlzLl9zZWdzLnB1c2goX2xpZ2h0TGluZSk7XG5cbiAgICAgICAgLy8gcG9seWdvbiAjNVxuICAgICAgICB2YXIgX2xpZ2h0TGluZSA9IE9iamVjdC5jcmVhdGUoTGlnaHRMaW5lKTtcbiAgICAgICAgX2xpZ2h0TGluZS5zZWdBID0gdGhpcy5fcG9pbnRUb0pTKDgwMCwgMzgwKTtcbiAgICAgICAgX2xpZ2h0TGluZS5zZWdCID0gdGhpcy5fcG9pbnRUb0pTKDEwMjAsIDM0MCk7XG4gICAgICAgIHRoaXMuX3NlZ3MucHVzaChfbGlnaHRMaW5lKTtcblxuICAgICAgICB2YXIgX2xpZ2h0TGluZSA9IE9iamVjdC5jcmVhdGUoTGlnaHRMaW5lKTtcbiAgICAgICAgX2xpZ2h0TGluZS5zZWdBID0gdGhpcy5fcG9pbnRUb0pTKDEwMjAsIDM0MCk7XG4gICAgICAgIF9saWdodExpbmUuc2VnQiA9IHRoaXMuX3BvaW50VG9KUyg5ODAsIDU0MCk7XG4gICAgICAgIHRoaXMuX3NlZ3MucHVzaChfbGlnaHRMaW5lKTtcblxuICAgICAgICB2YXIgX2xpZ2h0TGluZSA9IE9iamVjdC5jcmVhdGUoTGlnaHRMaW5lKTtcbiAgICAgICAgX2xpZ2h0TGluZS5zZWdBID0gdGhpcy5fcG9pbnRUb0pTKDk4MCwgNTQwKTtcbiAgICAgICAgX2xpZ2h0TGluZS5zZWdCID0gdGhpcy5fcG9pbnRUb0pTKDc2MCwgNTgwKTtcbiAgICAgICAgdGhpcy5fc2Vncy5wdXNoKF9saWdodExpbmUpO1xuXG4gICAgICAgIHZhciBfbGlnaHRMaW5lID0gT2JqZWN0LmNyZWF0ZShMaWdodExpbmUpO1xuICAgICAgICBfbGlnaHRMaW5lLnNlZ0EgPSB0aGlzLl9wb2ludFRvSlMoNzYwLCA1ODApO1xuICAgICAgICBfbGlnaHRMaW5lLnNlZ0IgPSB0aGlzLl9wb2ludFRvSlMoODAwLCAzODApO1xuICAgICAgICB0aGlzLl9zZWdzLnB1c2goX2xpZ2h0TGluZSk7XG5cbiAgICAgICAgLy8gcG9seWdvbiAjNlxuICAgICAgICB2YXIgX2xpZ2h0TGluZSA9IE9iamVjdC5jcmVhdGUoTGlnaHRMaW5lKTtcbiAgICAgICAgX2xpZ2h0TGluZS5zZWdBID0gdGhpcy5fcG9pbnRUb0pTKDcwMCwgMTkwKTtcbiAgICAgICAgX2xpZ2h0TGluZS5zZWdCID0gdGhpcy5fcG9pbnRUb0pTKDEwNjAsIDEwMCk7XG4gICAgICAgIHRoaXMuX3NlZ3MucHVzaChfbGlnaHRMaW5lKTtcblxuICAgICAgICB2YXIgX2xpZ2h0TGluZSA9IE9iamVjdC5jcmVhdGUoTGlnaHRMaW5lKTtcbiAgICAgICAgX2xpZ2h0TGluZS5zZWdBID0gdGhpcy5fcG9pbnRUb0pTKDEwNjAsIDEwMCk7XG4gICAgICAgIF9saWdodExpbmUuc2VnQiA9IHRoaXMuX3BvaW50VG9KUyg4NjAsIDMwMCk7XG4gICAgICAgIHRoaXMuX3NlZ3MucHVzaChfbGlnaHRMaW5lKTtcblxuICAgICAgICB2YXIgX2xpZ2h0TGluZSA9IE9iamVjdC5jcmVhdGUoTGlnaHRMaW5lKTtcbiAgICAgICAgX2xpZ2h0TGluZS5zZWdBID0gdGhpcy5fcG9pbnRUb0pTKDg2MCwgMzAwKTtcbiAgICAgICAgX2xpZ2h0TGluZS5zZWdCID0gdGhpcy5fcG9pbnRUb0pTKDcwMCwgMTkwKTtcbiAgICAgICAgdGhpcy5fc2Vncy5wdXNoKF9saWdodExpbmUpO1xuICAgIH0sXG5cbiAgICAvKiDnu5jliLbnur/mrrUgKi9cbiAgICBkcmF3U2VnczogZnVuY3Rpb24gZHJhd1NlZ3MoKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5fc2Vncy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5fZHJhd0xpbmUuZHJhd1NlZ21lbnQodGhpcy5fc2Vnc1tpXS5zZWdBLCB0aGlzLl9zZWdzW2ldLnNlZ0IpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIGRyYXdTZWdzQnVmZmVyOiBmdW5jdGlvbiBkcmF3U2Vnc0J1ZmZlcigpIHtcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5faW50ZXJzZWN0cyk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5faW50ZXJzZWN0cy5sZW5ndGggLSAxOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZURyYXcuZHJhd1NlZ21lbnQoY2MucCh0aGlzLl9saWdodC54LCB0aGlzLl9saWdodC55KSwgdGhpcy5faW50ZXJzZWN0c1tpXS5wb2ludCk7XG5cbiAgICAgICAgICAgIC8qIOafpeeci+WFiee6v+iMg+WbtOaJk+W8gOazqOmHiiwg5pyJ6Zeu6aKYICovXG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgdGhpcy5fdXBkYXRlRHJhdy5kcmF3UG9seSggWyBjYy5wKHRoaXMuX2xpZ2h0LngsIHRoaXMuX2xpZ2h0LnkpLCB0aGlzLl9pbnRlcnNlY3RzW2ldLnBvaW50LCB0aGlzLl9pbnRlcnNlY3RzWyBpICsgMSBdLnBvaW50LCBjYy5wKHRoaXMuX2xpZ2h0LngsIHRoaXMuX2xpZ2h0LnkpXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYy5jb2xvcigwLCAyNTUsIDI1NSwgNTApLCAyLCBjYy5jb2xvcigyNTUsIDAsIDI1NSwgMjU1KSk7XG4gICAgICAgICAgICAqL1xuICAgICAgICB9XG4gICAgICAgIC8qIOafpeeci+WFiee6v+iMg+WbtOaJk+W8gOazqOmHiiwg5pyJ6Zeu6aKYICovXG5cbiAgICAgICAgdGhpcy5fdXBkYXRlRHJhdy5kcmF3UG9seShbY2MucCh0aGlzLl9saWdodC54LCB0aGlzLl9saWdodC55KSwgdGhpcy5faW50ZXJzZWN0c1swXS5wb2ludCwgdGhpcy5faW50ZXJzZWN0c1t0aGlzLl9pbnRlcnNlY3RzLmxlbmd0aCAtIDFdLnBvaW50LCBjYy5wKHRoaXMuX2xpZ2h0LngsIHRoaXMuX2xpZ2h0LnkpXSwgY2MuY29sb3IoMCwgMjU1LCAyNTUsIDUwKSwgMiwgY2MuY29sb3IoMjU1LCAwLCAyNTUsIDI1NSkpO1xuXG4gICAgICAgIHRoaXMuX2JEcmF3QnVmZmVyID0gdHJ1ZTtcbiAgICB9LFxuXG4gICAgLyog6I635b6X54K56KeS5bqmICovXG4gICAgZ2V0RWFjaFBvaW50QW5nbGU6IGZ1bmN0aW9uIGdldEVhY2hQb2ludEFuZ2xlKCkge1xuICAgICAgICAvKiDojrflvpfllK/kuIDngrkgKi9cbiAgICAgICAgdmFyIHRtcFBvaW50ID0gbmV3IEFycmF5KCk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5fc2Vncy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGlzRmluZCA9IHRoaXMuX2ZpbmQodG1wUG9pbnQsIHRoaXMuX3NlZ3NbaV0uc2VnQSk7XG4gICAgICAgICAgICBpZiAoLTEgPT09IGlzRmluZCkge1xuICAgICAgICAgICAgICAgIHRtcFBvaW50LnB1c2godGhpcy5fc2Vnc1tpXS5zZWdBKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaXNGaW5kID0gdGhpcy5fZmluZCh0bXBQb2ludCwgdGhpcy5fc2Vnc1tpXS5zZWdCKTtcbiAgICAgICAgICAgIGlmICgtMSA9PT0gaXNGaW5kKSB7XG4gICAgICAgICAgICAgICAgdG1wUG9pbnQucHVzaCh0aGlzLl9zZWdzW2ldLnNlZ0IpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyog6I635b6X5ZSv5LiA54K555qE6KeS5bqmICovXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdG1wUG9pbnQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBfbCA9IGNjLnAodGhpcy5fbGlnaHQueCwgdGhpcy5fbGlnaHQueSk7IC8vXG4gICAgICAgICAgICB2YXIgX2EgPSBNYXRoLmF0YW4yKHRtcFBvaW50W2ldLnkgLSBfbC55LCB0bXBQb2ludFtpXS54IC0gX2wueCk7XG4gICAgICAgICAgICB0aGlzLl9hbmdsZS5wdXNoKF9hIC0gMC4wMDAwMSk7XG4gICAgICAgICAgICB0aGlzLl9hbmdsZS5wdXNoKF9hKTtcbiAgICAgICAgICAgIHRoaXMuX2FuZ2xlLnB1c2goX2EgKyAwLjAwMDAxKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qIOW+queOr+WQhOinkuW6piwg5om+5Ye65pyA6L+R55qE54K5ICovXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5fYW5nbGUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBkeCA9IE1hdGguY29zKHRoaXMuX2FuZ2xlW2ldKTtcbiAgICAgICAgICAgIHZhciBkeSA9IE1hdGguc2luKHRoaXMuX2FuZ2xlW2ldKTtcblxuICAgICAgICAgICAgdmFyIF9saWdodExpbmUgPSBPYmplY3QuY3JlYXRlKExpZ2h0TGluZSk7XG4gICAgICAgICAgICBfbGlnaHRMaW5lLnNlZ0EgPSBjYy5wKHRoaXMuX2xpZ2h0LngsIHRoaXMuX2xpZ2h0LnkpO1xuICAgICAgICAgICAgX2xpZ2h0TGluZS5zZWdCID0gY2MucCh0aGlzLl9saWdodC54ICsgZHgsIHRoaXMuX2xpZ2h0LnkgKyBkeSk7XG5cbiAgICAgICAgICAgIHZhciBtaW5UMSA9IDA7XG4gICAgICAgICAgICBmb3IgKHZhciBpaSA9IDA7IGlpIDwgdGhpcy5fc2Vncy5sZW5ndGg7IGlpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgdG1wVDEgPSB0aGlzLl9nZXRJbnRlcnNlY3Rpb24oX2xpZ2h0TGluZSwgdGhpcy5fc2Vnc1tpaV0pO1xuICAgICAgICAgICAgICAgIGlmICgtMSA9PT0gdG1wVDEpIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICgwID09PSBtaW5UMSB8fCBtaW5UMSA+IHRtcFQxKSB7XG4gICAgICAgICAgICAgICAgICAgIG1pblQxID0gdG1wVDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgX3BBbmdsZSA9IE9iamVjdC5jcmVhdGUoUG9pbnRXaXRoQW5nbGUpO1xuICAgICAgICAgICAgLy9fcEFuZ2xlLnBvaW50ID0gdGhpcy5fcG9pbnRUb0pTKCB0aGlzLl9saWdodC54ICsgbWluVDEgKiBkeCwgdGhpcy5fbGlnaHQueSArIG1pblQxICogZHkgKTtcbiAgICAgICAgICAgIF9wQW5nbGUucG9pbnQgPSBjYy5wKHRoaXMuX2xpZ2h0LnggKyBtaW5UMSAqIGR4LCB0aGlzLl9saWdodC55ICsgbWluVDEgKiBkeSk7XG4gICAgICAgICAgICBfcEFuZ2xlLmFuZ2xlID0gdGhpcy5fYW5nbGVbaV07XG4gICAgICAgICAgICB0aGlzLl9pbnRlcnNlY3RzLnB1c2goX3BBbmdsZSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9pbnRlcnNlY3RzLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICAgIHJldHVybiBhLmFuZ2xlIC0gYi5hbmdsZTtcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qIOWwhOe6v+WIpOaWreS6pOeCuSAqL1xuICAgIF9nZXRJbnRlcnNlY3Rpb246IGZ1bmN0aW9uIF9nZXRJbnRlcnNlY3Rpb24oX3JheSwgX3NlZykge1xuICAgICAgICB2YXIgcl9weCA9IF9yYXkuc2VnQS54O1xuICAgICAgICB2YXIgcl9weSA9IF9yYXkuc2VnQS55O1xuICAgICAgICB2YXIgcl9keCA9IF9yYXkuc2VnQi54IC0gX3JheS5zZWdBLng7XG4gICAgICAgIHZhciByX2R5ID0gX3JheS5zZWdCLnkgLSBfcmF5LnNlZ0EueTtcblxuICAgICAgICB2YXIgc19weCA9IF9zZWcuc2VnQS54O1xuICAgICAgICB2YXIgc19weSA9IF9zZWcuc2VnQS55O1xuICAgICAgICB2YXIgc19keCA9IF9zZWcuc2VnQi54IC0gX3NlZy5zZWdBLng7XG4gICAgICAgIHZhciBzX2R5ID0gX3NlZy5zZWdCLnkgLSBfc2VnLnNlZ0EueTtcblxuICAgICAgICB2YXIgcl9tYWcgPSBNYXRoLnNxcnQocl9keCAqIHJfZHggKyByX2R5ICogcl9keSk7XG4gICAgICAgIHZhciBzX21hZyA9IE1hdGguc3FydChzX2R4ICogc19keCArIHNfZHkgKiBzX2R5KTtcbiAgICAgICAgaWYgKHJfZHggLyByX21hZyA9PSBzX2R4IC8gc19tYWcgJiYgcl9keSAvIHJfbWFnID09IHNfZHkgLyBzX21hZykge1xuICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHQyID0gKHJfZHggKiAoc19weSAtIHJfcHkpICsgcl9keSAqIChyX3B4IC0gc19weCkpIC8gKHNfZHggKiByX2R5IC0gc19keSAqIHJfZHgpO1xuICAgICAgICB2YXIgdDEgPSAoc19weCArIHNfZHggKiB0MiAtIHJfcHgpIC8gcl9keDtcbiAgICAgICAgaWYgKHQxIDwgMCB8fCB0MiA8IDAgfHwgdDIgPiAxKSB7XG4gICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdDE7XG4gICAgfSxcblxuICAgIC8qIOeCueWdkOagh+i9rOWMliAqL1xuICAgIF9wb2ludFRvSlM6IGZ1bmN0aW9uIF9wb2ludFRvSlMoX3gsIF95KSB7XG4gICAgICAgIHJldHVybiBjYy5wKC0xICogdGhpcy5fdmlldy53aWR0aCAvIDIgKyBfeCwgLTEgKiB0aGlzLl92aWV3LmhlaWdodCAvIDIgKyBfeSk7XG4gICAgfSxcblxuICAgIF9maW5kOiBmdW5jdGlvbiBfZmluZChfYXJyLCBfc2VnUG9pbnQpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBfYXJyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoX2FycltpXS54ID09PSBfc2VnUG9pbnQueCAmJiBfYXJyW2ldLnkgPT09IF9zZWdQb2ludC55KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIC0xO1xuICAgIH1cblxufSk7XG5cbmNjLl9SRnBvcCgpOyJdfQ==
