require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"DrawSeg":[function(require,module,exports){
cc._RFpush(module, '9abf2gT0JVFU6XeixbvW9PI', 'DrawSeg');
// Script/DrawSeg.js

"use strict";

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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL0FwcGxpY2F0aW9ucy9Db2Nvc0NyZWF0b3IuYXBwL0NvbnRlbnRzL1Jlc291cmNlcy9hcHAuYXNhci9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiYXNzZXRzL1NjcmlwdC9EcmF3U2VnLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiY2MuX1JGcHVzaChtb2R1bGUsICc5YWJmMmdUMEpWRlU2WGVpeGJ2VzlQSScsICdEcmF3U2VnJyk7XG4vLyBTY3JpcHQvRHJhd1NlZy5qc1xuXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIExpZ2h0TGluZSA9IHtcbiAgICBzZWdBOiBjYy5wKDAsIDApLFxuICAgIHNlZ0I6IGNjLnAoMCwgMClcbn07XG5cbnZhciBQb2ludFdpdGhBbmdsZSA9IHtcbiAgICBwb2ludDogY2MucCgwLCAwKSxcbiAgICBhbmdsZTogLTFcbn07XG5cbmNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvKiDnur/mrrUgKi9cbiAgICAgICAgX3NlZ3M6IFtdLFxuICAgICAgICAvKiDop5LluqYgKi9cbiAgICAgICAgX2FuZ2xlOiBbXSxcbiAgICAgICAgLyog5Lqk5Y+J54K5ICovXG4gICAgICAgIF9pbnRlcnNlY3RzOiBbXSxcblxuICAgICAgICAvKiDnga/lhYkgKi9cbiAgICAgICAgX2xpZ2h0OiB7XG4gICAgICAgICAgICBcImRlZmF1bHRcIjogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLk5vZGUsXG4gICAgICAgICAgICB2aXNpYmxlOiB0cnVlXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyog5YWJ57q/5bGCKOWPquaYr+S4quiKgueCuSkgKi9cbiAgICAgICAgX2J1ZmZlckxpbmU6IHtcbiAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTm9kZSxcbiAgICAgICAgICAgIHZpc2libGU6IHRydWVcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdGhpcy5fdmlldyA9IGNjLnZpZXcuZ2V0RGVzaWduUmVzb2x1dGlvblNpemUoKTtcblxuICAgICAgICB0aGlzLl9kcmF3TGluZSA9IG5ldyBjYy5EcmF3Tm9kZSgpO1xuICAgICAgICB0aGlzLl91cGRhdGVEcmF3ID0gbmV3IGNjLkRyYXdOb2RlKCk7XG4gICAgICAgIHRoaXMuX2RyYXdMaW5lLnNldFBvc2l0aW9uKDAsIDApO1xuICAgICAgICB0aGlzLl91cGRhdGVEcmF3LnNldFBvc2l0aW9uKDAsIDApO1xuICAgICAgICB0aGlzLm5vZGUuX3NnTm9kZS5hZGRDaGlsZCh0aGlzLl9kcmF3TGluZSk7XG4gICAgICAgIHRoaXMuX2J1ZmZlckxpbmUuX3NnTm9kZS5hZGRDaGlsZCh0aGlzLl91cGRhdGVEcmF3KTtcbiAgICAgICAgdGhpcy5fcGVyO1xuXG4gICAgICAgIHRoaXMuaW5pdFRvdWNoRXZlbnQoKTtcbiAgICAgICAgdGhpcy5pbml0U2VncygpO1xuICAgICAgICB0aGlzLmRyYXdTZWdzKCk7XG4gICAgICAgIHRoaXMuZ2V0RWFjaFBvaW50QW5nbGUoKTtcbiAgICAgICAgdGhpcy5kcmF3U2Vnc0J1ZmZlcigpO1xuICAgIH0sXG5cbiAgICBpbml0VG91Y2hFdmVudDogZnVuY3Rpb24gaW5pdFRvdWNoRXZlbnQoKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgY2MuZXZlbnRNYW5hZ2VyLmFkZExpc3RlbmVyKGNjLkV2ZW50TGlzdGVuZXIuY3JlYXRlKHtcbiAgICAgICAgICAgIGV2ZW50OiBjYy5FdmVudExpc3RlbmVyLlRPVUNIX09ORV9CWV9PTkUsXG4gICAgICAgICAgICBvblRvdWNoQmVnYW46IGZ1bmN0aW9uIG9uVG91Y2hCZWdhbihldmVudCkge1xuICAgICAgICAgICAgICAgIHNlbGYuX3BlciA9IGV2ZW50LmdldExvY2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgb25Ub3VjaE1vdmVkOiBmdW5jdGlvbiBvblRvdWNoTW92ZWQoZXZlbnQpIHtcblxuICAgICAgICAgICAgICAgIGlmIChzZWxmLl9iRHJhd0J1ZmZlcikge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLl9pbnRlcnNlY3RzID0gW107XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuX2FuZ2xlID0gW107XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuX2JEcmF3QnVmZmVyID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWxmLl91cGRhdGVEcmF3KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLl91cGRhdGVEcmF3LmNsZWFyKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB2YXIgX2wgPSBldmVudC5nZXRMb2NhdGlvbigpO1xuICAgICAgICAgICAgICAgIHZhciBfc3ViWCA9IF9sLnggLSBzZWxmLl9wZXIueDtcbiAgICAgICAgICAgICAgICB2YXIgX3N1YlkgPSBfbC55IC0gc2VsZi5fcGVyLnk7XG5cbiAgICAgICAgICAgICAgICBzZWxmLl9saWdodC54ICs9IF9zdWJYO1xuICAgICAgICAgICAgICAgIHNlbGYuX2xpZ2h0LnkgKz0gX3N1Ylk7XG5cbiAgICAgICAgICAgICAgICBzZWxmLl9wZXIgPSBldmVudC5nZXRMb2NhdGlvbigpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCFzZWxmLl9iRHJhd0J1ZmZlcikge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmdldEVhY2hQb2ludEFuZ2xlKCk7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuZHJhd1NlZ3NCdWZmZXIoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgb25Ub3VjaEVuZGVkOiBmdW5jdGlvbiBvblRvdWNoRW5kZWQoZXZlbnQpIHt9XG4gICAgICAgIH0pLCB0aGlzKTtcbiAgICB9LFxuXG4gICAgLyog5Yid5aeL5YyW57q/5q6156uv54K5ICovXG4gICAgaW5pdFNlZ3M6IGZ1bmN0aW9uIGluaXRTZWdzKCkge1xuXG4gICAgICAgIC8vIGxlZnQgbGluZVxuICAgICAgICB2YXIgX2xpZ2h0TGluZSA9IE9iamVjdC5jcmVhdGUoTGlnaHRMaW5lKTtcbiAgICAgICAgX2xpZ2h0TGluZS5zZWdBID0gdGhpcy5fcG9pbnRUb0pTKDEsIDEpO1xuICAgICAgICBfbGlnaHRMaW5lLnNlZ0IgPSB0aGlzLl9wb2ludFRvSlMoMSwgdGhpcy5fdmlldy5oZWlnaHQgLSAxKTtcbiAgICAgICAgdGhpcy5fc2Vncy5wdXNoKF9saWdodExpbmUpO1xuXG4gICAgICAgIC8vIHVwIGxpbmVcbiAgICAgICAgdmFyIF9saWdodExpbmUgPSBPYmplY3QuY3JlYXRlKExpZ2h0TGluZSk7XG4gICAgICAgIF9saWdodExpbmUuc2VnQSA9IHRoaXMuX3BvaW50VG9KUygxLCB0aGlzLl92aWV3LmhlaWdodCAtIDEpO1xuICAgICAgICBfbGlnaHRMaW5lLnNlZ0IgPSB0aGlzLl9wb2ludFRvSlModGhpcy5fdmlldy53aWR0aCAtIDEsIHRoaXMuX3ZpZXcuaGVpZ2h0IC0gMSk7XG4gICAgICAgIHRoaXMuX3NlZ3MucHVzaChfbGlnaHRMaW5lKTtcblxuICAgICAgICAvLyByaWdodCBsaW5lXG4gICAgICAgIHZhciBfbGlnaHRMaW5lID0gT2JqZWN0LmNyZWF0ZShMaWdodExpbmUpO1xuICAgICAgICBfbGlnaHRMaW5lLnNlZ0EgPSB0aGlzLl9wb2ludFRvSlModGhpcy5fdmlldy53aWR0aCAtIDEsIHRoaXMuX3ZpZXcuaGVpZ2h0IC0gMSk7XG4gICAgICAgIF9saWdodExpbmUuc2VnQiA9IHRoaXMuX3BvaW50VG9KUyh0aGlzLl92aWV3LndpZHRoIC0gMSwgMSk7XG4gICAgICAgIHRoaXMuX3NlZ3MucHVzaChfbGlnaHRMaW5lKTtcblxuICAgICAgICAvLyBkb3duIGxpbmVcbiAgICAgICAgdmFyIF9saWdodExpbmUgPSBPYmplY3QuY3JlYXRlKExpZ2h0TGluZSk7XG4gICAgICAgIF9saWdodExpbmUuc2VnQSA9IHRoaXMuX3BvaW50VG9KUyh0aGlzLl92aWV3LndpZHRoIC0gMSwgMSk7XG4gICAgICAgIF9saWdodExpbmUuc2VnQiA9IHRoaXMuX3BvaW50VG9KUygxLCAxKTtcbiAgICAgICAgdGhpcy5fc2Vncy5wdXNoKF9saWdodExpbmUpO1xuXG4gICAgICAgIC8vIHBvbHlnb24gIzFcbiAgICAgICAgdmFyIF9saWdodExpbmUgPSBPYmplY3QuY3JlYXRlKExpZ2h0TGluZSk7XG4gICAgICAgIF9saWdodExpbmUuc2VnQSA9IHRoaXMuX3BvaW50VG9KUyg4MCwgMzAwKTtcbiAgICAgICAgX2xpZ2h0TGluZS5zZWdCID0gdGhpcy5fcG9pbnRUb0pTKDEyMCwgMTAwKTtcbiAgICAgICAgdGhpcy5fc2Vncy5wdXNoKF9saWdodExpbmUpO1xuXG4gICAgICAgIHZhciBfbGlnaHRMaW5lID0gT2JqZWN0LmNyZWF0ZShMaWdodExpbmUpO1xuICAgICAgICBfbGlnaHRMaW5lLnNlZ0EgPSB0aGlzLl9wb2ludFRvSlMoMTIwLCAxMDApO1xuICAgICAgICBfbGlnaHRMaW5lLnNlZ0IgPSB0aGlzLl9wb2ludFRvSlMoMjQwLCAxNjApO1xuICAgICAgICB0aGlzLl9zZWdzLnB1c2goX2xpZ2h0TGluZSk7XG5cbiAgICAgICAgdmFyIF9saWdodExpbmUgPSBPYmplY3QuY3JlYXRlKExpZ2h0TGluZSk7XG4gICAgICAgIF9saWdodExpbmUuc2VnQSA9IHRoaXMuX3BvaW50VG9KUygyNDAsIDE2MCk7XG4gICAgICAgIF9saWdodExpbmUuc2VnQiA9IHRoaXMuX3BvaW50VG9KUygxNjAsIDQyMCk7XG4gICAgICAgIHRoaXMuX3NlZ3MucHVzaChfbGlnaHRMaW5lKTtcblxuICAgICAgICB2YXIgX2xpZ2h0TGluZSA9IE9iamVjdC5jcmVhdGUoTGlnaHRMaW5lKTtcbiAgICAgICAgX2xpZ2h0TGluZS5zZWdBID0gdGhpcy5fcG9pbnRUb0pTKDE2MCwgNDIwKTtcbiAgICAgICAgX2xpZ2h0TGluZS5zZWdCID0gdGhpcy5fcG9pbnRUb0pTKDgwLCAzMDApO1xuICAgICAgICB0aGlzLl9zZWdzLnB1c2goX2xpZ2h0TGluZSk7XG5cbiAgICAgICAgLy8gcG9seWdvbiAjMlxuICAgICAgICB2YXIgX2xpZ2h0TGluZSA9IE9iamVjdC5jcmVhdGUoTGlnaHRMaW5lKTtcbiAgICAgICAgX2xpZ2h0TGluZS5zZWdBID0gdGhpcy5fcG9pbnRUb0pTKDEwMCwgNDAwKTtcbiAgICAgICAgX2xpZ2h0TGluZS5zZWdCID0gdGhpcy5fcG9pbnRUb0pTKDE0MCwgNTAwKTtcbiAgICAgICAgdGhpcy5fc2Vncy5wdXNoKF9saWdodExpbmUpO1xuXG4gICAgICAgIHZhciBfbGlnaHRMaW5lID0gT2JqZWN0LmNyZWF0ZShMaWdodExpbmUpO1xuICAgICAgICBfbGlnaHRMaW5lLnNlZ0EgPSB0aGlzLl9wb2ludFRvSlMoMTQwLCA1MDApO1xuICAgICAgICBfbGlnaHRMaW5lLnNlZ0IgPSB0aGlzLl9wb2ludFRvSlMoMjAsIDYwMCk7XG4gICAgICAgIHRoaXMuX3NlZ3MucHVzaChfbGlnaHRMaW5lKTtcblxuICAgICAgICB2YXIgX2xpZ2h0TGluZSA9IE9iamVjdC5jcmVhdGUoTGlnaHRMaW5lKTtcbiAgICAgICAgX2xpZ2h0TGluZS5zZWdBID0gdGhpcy5fcG9pbnRUb0pTKDIwLCA2MDApO1xuICAgICAgICBfbGlnaHRMaW5lLnNlZ0IgPSB0aGlzLl9wb2ludFRvSlMoMTAwLCA0MDApO1xuICAgICAgICB0aGlzLl9zZWdzLnB1c2goX2xpZ2h0TGluZSk7XG5cbiAgICAgICAgLy8gcG9seWdvbiAjM1xuICAgICAgICB2YXIgX2xpZ2h0TGluZSA9IE9iamVjdC5jcmVhdGUoTGlnaHRMaW5lKTtcbiAgICAgICAgX2xpZ2h0TGluZS5zZWdBID0gdGhpcy5fcG9pbnRUb0pTKDMwMCwgNTIwKTtcbiAgICAgICAgX2xpZ2h0TGluZS5zZWdCID0gdGhpcy5fcG9pbnRUb0pTKDM0MCwgMzAwKTtcbiAgICAgICAgdGhpcy5fc2Vncy5wdXNoKF9saWdodExpbmUpO1xuXG4gICAgICAgIHZhciBfbGlnaHRMaW5lID0gT2JqZWN0LmNyZWF0ZShMaWdodExpbmUpO1xuICAgICAgICBfbGlnaHRMaW5lLnNlZ0EgPSB0aGlzLl9wb2ludFRvSlMoMzQwLCAzMDApO1xuICAgICAgICBfbGlnaHRMaW5lLnNlZ0IgPSB0aGlzLl9wb2ludFRvSlMoNTAwLCA0MDApO1xuICAgICAgICB0aGlzLl9zZWdzLnB1c2goX2xpZ2h0TGluZSk7XG5cbiAgICAgICAgdmFyIF9saWdodExpbmUgPSBPYmplY3QuY3JlYXRlKExpZ2h0TGluZSk7XG4gICAgICAgIF9saWdodExpbmUuc2VnQSA9IHRoaXMuX3BvaW50VG9KUyg1MDAsIDQwMCk7XG4gICAgICAgIF9saWdodExpbmUuc2VnQiA9IHRoaXMuX3BvaW50VG9KUyg2MDAsIDY0MCk7XG4gICAgICAgIHRoaXMuX3NlZ3MucHVzaChfbGlnaHRMaW5lKTtcblxuICAgICAgICB2YXIgX2xpZ2h0TGluZSA9IE9iamVjdC5jcmVhdGUoTGlnaHRMaW5lKTtcbiAgICAgICAgX2xpZ2h0TGluZS5zZWdBID0gdGhpcy5fcG9pbnRUb0pTKDYwMCwgNjQwKTtcbiAgICAgICAgX2xpZ2h0TGluZS5zZWdCID0gdGhpcy5fcG9pbnRUb0pTKDMwMCwgNTIwKTtcbiAgICAgICAgdGhpcy5fc2Vncy5wdXNoKF9saWdodExpbmUpO1xuXG4gICAgICAgIC8vIHBvbHlnb24gIzRcbiAgICAgICAgdmFyIF9saWdodExpbmUgPSBPYmplY3QuY3JlYXRlKExpZ2h0TGluZSk7XG4gICAgICAgIF9saWdodExpbmUuc2VnQSA9IHRoaXMuX3BvaW50VG9KUyg1ODAsIDEyMCk7XG4gICAgICAgIF9saWdodExpbmUuc2VnQiA9IHRoaXMuX3BvaW50VG9KUyg2MjAsIDgwKTtcbiAgICAgICAgdGhpcy5fc2Vncy5wdXNoKF9saWdodExpbmUpO1xuXG4gICAgICAgIHZhciBfbGlnaHRMaW5lID0gT2JqZWN0LmNyZWF0ZShMaWdodExpbmUpO1xuICAgICAgICBfbGlnaHRMaW5lLnNlZ0EgPSB0aGlzLl9wb2ludFRvSlMoNjIwLCA4MCk7XG4gICAgICAgIF9saWdodExpbmUuc2VnQiA9IHRoaXMuX3BvaW50VG9KUyg2NDAsIDE0MCk7XG4gICAgICAgIHRoaXMuX3NlZ3MucHVzaChfbGlnaHRMaW5lKTtcblxuICAgICAgICB2YXIgX2xpZ2h0TGluZSA9IE9iamVjdC5jcmVhdGUoTGlnaHRMaW5lKTtcbiAgICAgICAgX2xpZ2h0TGluZS5zZWdBID0gdGhpcy5fcG9pbnRUb0pTKDY0MCwgMTQwKTtcbiAgICAgICAgX2xpZ2h0TGluZS5zZWdCID0gdGhpcy5fcG9pbnRUb0pTKDU4MCwgMTIwKTtcbiAgICAgICAgdGhpcy5fc2Vncy5wdXNoKF9saWdodExpbmUpO1xuXG4gICAgICAgIC8vIHBvbHlnb24gIzVcbiAgICAgICAgdmFyIF9saWdodExpbmUgPSBPYmplY3QuY3JlYXRlKExpZ2h0TGluZSk7XG4gICAgICAgIF9saWdodExpbmUuc2VnQSA9IHRoaXMuX3BvaW50VG9KUyg4MDAsIDM4MCk7XG4gICAgICAgIF9saWdodExpbmUuc2VnQiA9IHRoaXMuX3BvaW50VG9KUygxMDIwLCAzNDApO1xuICAgICAgICB0aGlzLl9zZWdzLnB1c2goX2xpZ2h0TGluZSk7XG5cbiAgICAgICAgdmFyIF9saWdodExpbmUgPSBPYmplY3QuY3JlYXRlKExpZ2h0TGluZSk7XG4gICAgICAgIF9saWdodExpbmUuc2VnQSA9IHRoaXMuX3BvaW50VG9KUygxMDIwLCAzNDApO1xuICAgICAgICBfbGlnaHRMaW5lLnNlZ0IgPSB0aGlzLl9wb2ludFRvSlMoOTgwLCA1NDApO1xuICAgICAgICB0aGlzLl9zZWdzLnB1c2goX2xpZ2h0TGluZSk7XG5cbiAgICAgICAgdmFyIF9saWdodExpbmUgPSBPYmplY3QuY3JlYXRlKExpZ2h0TGluZSk7XG4gICAgICAgIF9saWdodExpbmUuc2VnQSA9IHRoaXMuX3BvaW50VG9KUyg5ODAsIDU0MCk7XG4gICAgICAgIF9saWdodExpbmUuc2VnQiA9IHRoaXMuX3BvaW50VG9KUyg3NjAsIDU4MCk7XG4gICAgICAgIHRoaXMuX3NlZ3MucHVzaChfbGlnaHRMaW5lKTtcblxuICAgICAgICB2YXIgX2xpZ2h0TGluZSA9IE9iamVjdC5jcmVhdGUoTGlnaHRMaW5lKTtcbiAgICAgICAgX2xpZ2h0TGluZS5zZWdBID0gdGhpcy5fcG9pbnRUb0pTKDc2MCwgNTgwKTtcbiAgICAgICAgX2xpZ2h0TGluZS5zZWdCID0gdGhpcy5fcG9pbnRUb0pTKDgwMCwgMzgwKTtcbiAgICAgICAgdGhpcy5fc2Vncy5wdXNoKF9saWdodExpbmUpO1xuXG4gICAgICAgIC8vIHBvbHlnb24gIzZcbiAgICAgICAgdmFyIF9saWdodExpbmUgPSBPYmplY3QuY3JlYXRlKExpZ2h0TGluZSk7XG4gICAgICAgIF9saWdodExpbmUuc2VnQSA9IHRoaXMuX3BvaW50VG9KUyg3MDAsIDE5MCk7XG4gICAgICAgIF9saWdodExpbmUuc2VnQiA9IHRoaXMuX3BvaW50VG9KUygxMDYwLCAxMDApO1xuICAgICAgICB0aGlzLl9zZWdzLnB1c2goX2xpZ2h0TGluZSk7XG5cbiAgICAgICAgdmFyIF9saWdodExpbmUgPSBPYmplY3QuY3JlYXRlKExpZ2h0TGluZSk7XG4gICAgICAgIF9saWdodExpbmUuc2VnQSA9IHRoaXMuX3BvaW50VG9KUygxMDYwLCAxMDApO1xuICAgICAgICBfbGlnaHRMaW5lLnNlZ0IgPSB0aGlzLl9wb2ludFRvSlMoODYwLCAzMDApO1xuICAgICAgICB0aGlzLl9zZWdzLnB1c2goX2xpZ2h0TGluZSk7XG5cbiAgICAgICAgdmFyIF9saWdodExpbmUgPSBPYmplY3QuY3JlYXRlKExpZ2h0TGluZSk7XG4gICAgICAgIF9saWdodExpbmUuc2VnQSA9IHRoaXMuX3BvaW50VG9KUyg4NjAsIDMwMCk7XG4gICAgICAgIF9saWdodExpbmUuc2VnQiA9IHRoaXMuX3BvaW50VG9KUyg3MDAsIDE5MCk7XG4gICAgICAgIHRoaXMuX3NlZ3MucHVzaChfbGlnaHRMaW5lKTtcbiAgICB9LFxuXG4gICAgLyog57uY5Yi257q/5q61ICovXG4gICAgZHJhd1NlZ3M6IGZ1bmN0aW9uIGRyYXdTZWdzKCkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuX3NlZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuX2RyYXdMaW5lLmRyYXdTZWdtZW50KHRoaXMuX3NlZ3NbaV0uc2VnQSwgdGhpcy5fc2Vnc1tpXS5zZWdCKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBkcmF3U2Vnc0J1ZmZlcjogZnVuY3Rpb24gZHJhd1NlZ3NCdWZmZXIoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMuX2ludGVyc2VjdHMpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuX2ludGVyc2VjdHMubGVuZ3RoIC0gMTsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLl91cGRhdGVEcmF3LmRyYXdTZWdtZW50KGNjLnAodGhpcy5fbGlnaHQueCwgdGhpcy5fbGlnaHQueSksIHRoaXMuX2ludGVyc2VjdHNbaV0ucG9pbnQpO1xuXG4gICAgICAgICAgICAvKiDmn6XnnIvlhYnnur/ojIPlm7TmiZPlvIDms6jph4osIOaciemXrumimCAqL1xuICAgICAgICAgICAgLypcbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZURyYXcuZHJhd1BvbHkoIFsgY2MucCh0aGlzLl9saWdodC54LCB0aGlzLl9saWdodC55KSwgdGhpcy5faW50ZXJzZWN0c1tpXS5wb2ludCwgdGhpcy5faW50ZXJzZWN0c1sgaSArIDEgXS5wb2ludCwgY2MucCh0aGlzLl9saWdodC54LCB0aGlzLl9saWdodC55KV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2MuY29sb3IoMCwgMjU1LCAyNTUsIDUwKSwgMiwgY2MuY29sb3IoMjU1LCAwLCAyNTUsIDI1NSkpO1xuICAgICAgICAgICAgKi9cbiAgICAgICAgfVxuICAgICAgICAvKiDmn6XnnIvlhYnnur/ojIPlm7TmiZPlvIDms6jph4osIOaciemXrumimCAqL1xuXG4gICAgICAgIHRoaXMuX3VwZGF0ZURyYXcuZHJhd1BvbHkoW2NjLnAodGhpcy5fbGlnaHQueCwgdGhpcy5fbGlnaHQueSksIHRoaXMuX2ludGVyc2VjdHNbMF0ucG9pbnQsIHRoaXMuX2ludGVyc2VjdHNbdGhpcy5faW50ZXJzZWN0cy5sZW5ndGggLSAxXS5wb2ludCwgY2MucCh0aGlzLl9saWdodC54LCB0aGlzLl9saWdodC55KV0sIGNjLmNvbG9yKDAsIDI1NSwgMjU1LCA1MCksIDIsIGNjLmNvbG9yKDI1NSwgMCwgMjU1LCAyNTUpKTtcblxuICAgICAgICB0aGlzLl9iRHJhd0J1ZmZlciA9IHRydWU7XG4gICAgfSxcblxuICAgIC8qIOiOt+W+l+eCueinkuW6piAqL1xuICAgIGdldEVhY2hQb2ludEFuZ2xlOiBmdW5jdGlvbiBnZXRFYWNoUG9pbnRBbmdsZSgpIHtcbiAgICAgICAgLyog6I635b6X5ZSv5LiA54K5ICovXG4gICAgICAgIHZhciB0bXBQb2ludCA9IG5ldyBBcnJheSgpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuX3NlZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBpc0ZpbmQgPSB0aGlzLl9maW5kKHRtcFBvaW50LCB0aGlzLl9zZWdzW2ldLnNlZ0EpO1xuICAgICAgICAgICAgaWYgKC0xID09PSBpc0ZpbmQpIHtcbiAgICAgICAgICAgICAgICB0bXBQb2ludC5wdXNoKHRoaXMuX3NlZ3NbaV0uc2VnQSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlzRmluZCA9IHRoaXMuX2ZpbmQodG1wUG9pbnQsIHRoaXMuX3NlZ3NbaV0uc2VnQik7XG4gICAgICAgICAgICBpZiAoLTEgPT09IGlzRmluZCkge1xuICAgICAgICAgICAgICAgIHRtcFBvaW50LnB1c2godGhpcy5fc2Vnc1tpXS5zZWdCKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8qIOiOt+W+l+WUr+S4gOeCueeahOinkuW6piAqL1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRtcFBvaW50Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgX2wgPSBjYy5wKHRoaXMuX2xpZ2h0LngsIHRoaXMuX2xpZ2h0LnkpOyAvL1xuICAgICAgICAgICAgdmFyIF9hID0gTWF0aC5hdGFuMih0bXBQb2ludFtpXS55IC0gX2wueSwgdG1wUG9pbnRbaV0ueCAtIF9sLngpO1xuICAgICAgICAgICAgdGhpcy5fYW5nbGUucHVzaChfYSAtIDAuMDAwMDEpO1xuICAgICAgICAgICAgdGhpcy5fYW5nbGUucHVzaChfYSk7XG4gICAgICAgICAgICB0aGlzLl9hbmdsZS5wdXNoKF9hICsgMC4wMDAwMSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKiDlvqrnjq/lkITop5LluqYsIOaJvuWHuuacgOi/keeahOeCuSAqL1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuX2FuZ2xlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgZHggPSBNYXRoLmNvcyh0aGlzLl9hbmdsZVtpXSk7XG4gICAgICAgICAgICB2YXIgZHkgPSBNYXRoLnNpbih0aGlzLl9hbmdsZVtpXSk7XG5cbiAgICAgICAgICAgIHZhciBfbGlnaHRMaW5lID0gT2JqZWN0LmNyZWF0ZShMaWdodExpbmUpO1xuICAgICAgICAgICAgX2xpZ2h0TGluZS5zZWdBID0gY2MucCh0aGlzLl9saWdodC54LCB0aGlzLl9saWdodC55KTtcbiAgICAgICAgICAgIF9saWdodExpbmUuc2VnQiA9IGNjLnAodGhpcy5fbGlnaHQueCArIGR4LCB0aGlzLl9saWdodC55ICsgZHkpO1xuXG4gICAgICAgICAgICB2YXIgbWluVDEgPSAwO1xuICAgICAgICAgICAgZm9yICh2YXIgaWkgPSAwOyBpaSA8IHRoaXMuX3NlZ3MubGVuZ3RoOyBpaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIHRtcFQxID0gdGhpcy5fZ2V0SW50ZXJzZWN0aW9uKF9saWdodExpbmUsIHRoaXMuX3NlZ3NbaWldKTtcbiAgICAgICAgICAgICAgICBpZiAoLTEgPT09IHRtcFQxKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoMCA9PT0gbWluVDEgfHwgbWluVDEgPiB0bXBUMSkge1xuICAgICAgICAgICAgICAgICAgICBtaW5UMSA9IHRtcFQxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIF9wQW5nbGUgPSBPYmplY3QuY3JlYXRlKFBvaW50V2l0aEFuZ2xlKTtcbiAgICAgICAgICAgIC8vX3BBbmdsZS5wb2ludCA9IHRoaXMuX3BvaW50VG9KUyggdGhpcy5fbGlnaHQueCArIG1pblQxICogZHgsIHRoaXMuX2xpZ2h0LnkgKyBtaW5UMSAqIGR5ICk7XG4gICAgICAgICAgICBfcEFuZ2xlLnBvaW50ID0gY2MucCh0aGlzLl9saWdodC54ICsgbWluVDEgKiBkeCwgdGhpcy5fbGlnaHQueSArIG1pblQxICogZHkpO1xuICAgICAgICAgICAgX3BBbmdsZS5hbmdsZSA9IHRoaXMuX2FuZ2xlW2ldO1xuICAgICAgICAgICAgdGhpcy5faW50ZXJzZWN0cy5wdXNoKF9wQW5nbGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5faW50ZXJzZWN0cy5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgICAgICByZXR1cm4gYS5hbmdsZSAtIGIuYW5nbGU7XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKiDlsITnur/liKTmlq3kuqTngrkgKi9cbiAgICBfZ2V0SW50ZXJzZWN0aW9uOiBmdW5jdGlvbiBfZ2V0SW50ZXJzZWN0aW9uKF9yYXksIF9zZWcpIHtcbiAgICAgICAgdmFyIHJfcHggPSBfcmF5LnNlZ0EueDtcbiAgICAgICAgdmFyIHJfcHkgPSBfcmF5LnNlZ0EueTtcbiAgICAgICAgdmFyIHJfZHggPSBfcmF5LnNlZ0IueCAtIF9yYXkuc2VnQS54O1xuICAgICAgICB2YXIgcl9keSA9IF9yYXkuc2VnQi55IC0gX3JheS5zZWdBLnk7XG5cbiAgICAgICAgdmFyIHNfcHggPSBfc2VnLnNlZ0EueDtcbiAgICAgICAgdmFyIHNfcHkgPSBfc2VnLnNlZ0EueTtcbiAgICAgICAgdmFyIHNfZHggPSBfc2VnLnNlZ0IueCAtIF9zZWcuc2VnQS54O1xuICAgICAgICB2YXIgc19keSA9IF9zZWcuc2VnQi55IC0gX3NlZy5zZWdBLnk7XG5cbiAgICAgICAgdmFyIHJfbWFnID0gTWF0aC5zcXJ0KHJfZHggKiByX2R4ICsgcl9keSAqIHJfZHkpO1xuICAgICAgICB2YXIgc19tYWcgPSBNYXRoLnNxcnQoc19keCAqIHNfZHggKyBzX2R5ICogc19keSk7XG4gICAgICAgIGlmIChyX2R4IC8gcl9tYWcgPT0gc19keCAvIHNfbWFnICYmIHJfZHkgLyByX21hZyA9PSBzX2R5IC8gc19tYWcpIHtcbiAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciB0MiA9IChyX2R4ICogKHNfcHkgLSByX3B5KSArIHJfZHkgKiAocl9weCAtIHNfcHgpKSAvIChzX2R4ICogcl9keSAtIHNfZHkgKiByX2R4KTtcbiAgICAgICAgdmFyIHQxID0gKHNfcHggKyBzX2R4ICogdDIgLSByX3B4KSAvIHJfZHg7XG4gICAgICAgIGlmICh0MSA8IDAgfHwgdDIgPCAwIHx8IHQyID4gMSkge1xuICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHQxO1xuICAgIH0sXG5cbiAgICAvKiDngrnlnZDmoIfovazljJYgKi9cbiAgICBfcG9pbnRUb0pTOiBmdW5jdGlvbiBfcG9pbnRUb0pTKF94LCBfeSkge1xuICAgICAgICByZXR1cm4gY2MucCgtMSAqIHRoaXMuX3ZpZXcud2lkdGggLyAyICsgX3gsIC0xICogdGhpcy5fdmlldy5oZWlnaHQgLyAyICsgX3kpO1xuICAgIH0sXG5cbiAgICBfZmluZDogZnVuY3Rpb24gX2ZpbmQoX2FyciwgX3NlZ1BvaW50KSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgX2Fyci5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKF9hcnJbaV0ueCA9PT0gX3NlZ1BvaW50LnggJiYgX2FycltpXS55ID09PSBfc2VnUG9pbnQueSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiAtMTtcbiAgICB9XG5cbn0pO1xuXG5jYy5fUkZwb3AoKTsiXX0=
