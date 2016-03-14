var LightLine = 
{
    segA: cc.p( 0, 0 ),
    segB: cc.p( 0, 0 ),
};

var PointWithAngle = 
{
    point: cc.p( 0, 0 ),
    angle: -1,
};

cc.Class({
    extends: cc.Component,

    properties:
    {
        /* 线段 */
        _segs: [],
        /* 角度 */
        _angle: [],
        /* 交叉点 */
        _intersects: [],
        
        /* 灯光 */
        _light:
        {
            default: null,
            type: cc.Node,
            visible: true,
        },
        
        /* 光线层(只是个节点) */
        _bufferLine:
        {
            default: null,
            type: cc.Node,
            visible: true,
        }
    },

    onLoad: function () 
    {
        this._view = cc.view.getDesignResolutionSize();
        
        this._drawLine = new cc.DrawNode();
        this._updateDraw = new cc.DrawNode();
        this._drawLine.setPosition( 0, 0 );
        this._updateDraw.setPosition( 0, 0 );
        this.node._sgNode.addChild( this._drawLine );
        this._bufferLine._sgNode.addChild( this._updateDraw );
        this._per;
        
        this.initTouchEvent();
        this.initSegs();
        this.drawSegs();
        this.getEachPointAngle();
        this.drawSegsBuffer();
    },
    
    initTouchEvent: function()
    {
        let self = this;
        cc.eventManager.addListener(cc.EventListener.create({
            event : cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan : function(event) {
                self._per = event.getLocation();
                return true;
            },
            onTouchMoved : function(event) {

                if( self._bDrawBuffer )
                {
                    self._intersects = [];
                    self._angle = [];
                    self._bDrawBuffer = false;
                    if( self._updateDraw )
                    {
                        self._updateDraw.clear();
                    }
                }
                
                var _l = event.getLocation();
                var _subX = _l.x - self._per.x;
                var _subY = _l.y - self._per.y;
                
                self._light.x += _subX;
                self._light.y += _subY;
                
                self._per = event.getLocation();
                
                if( !self._bDrawBuffer )
                {
                    self.getEachPointAngle();
                    self.drawSegsBuffer();
                }
            
            },
            onTouchEnded : function(event) {
            },
        }), this);
    },
    
    /* 初始化线段端点 */
    initSegs: function()
    { 
        
        // left line
        var _lightLine = Object.create( LightLine );
        _lightLine.segA = this._pointToJS( 1, 1 );
        _lightLine.segB = this._pointToJS( 1, this._view.height - 1 );
        this._segs.push( _lightLine );
        
        // up line
        var _lightLine = Object.create( LightLine );
        _lightLine.segA = this._pointToJS( 1, this._view.height - 1 );
        _lightLine.segB = this._pointToJS( this._view.width - 1, this._view.height - 1 );
        this._segs.push( _lightLine );
        
        // right line
        var _lightLine = Object.create( LightLine );
        _lightLine.segA = this._pointToJS( this._view.width - 1, this._view.height - 1 );
        _lightLine.segB = this._pointToJS( this._view.width - 1, 1 );
        this._segs.push( _lightLine );
        
        // down line
        var _lightLine = Object.create( LightLine );
        _lightLine.segA = this._pointToJS( this._view.width - 1, 1 );
        _lightLine.segB = this._pointToJS( 1, 1 );
        this._segs.push( _lightLine );
        
        // polygon #1
        var _lightLine = Object.create( LightLine );
        _lightLine.segA = this._pointToJS( 80, 300 );
        _lightLine.segB = this._pointToJS( 120, 100 );
        this._segs.push( _lightLine );
        
        var _lightLine = Object.create( LightLine );
        _lightLine.segA = this._pointToJS( 120, 100 );
        _lightLine.segB = this._pointToJS( 240, 160 );
        this._segs.push( _lightLine );
        
        var _lightLine = Object.create( LightLine );
        _lightLine.segA = this._pointToJS( 240, 160 );
        _lightLine.segB = this._pointToJS( 160, 420 );
        this._segs.push( _lightLine );
        
        var _lightLine = Object.create( LightLine );
        _lightLine.segA = this._pointToJS( 160, 420 );
        _lightLine.segB = this._pointToJS( 80, 300 );
        this._segs.push( _lightLine );
        
        // polygon #2
        var _lightLine = Object.create( LightLine );
        _lightLine.segA = this._pointToJS( 100, 400 );
        _lightLine.segB = this._pointToJS( 140, 500 );
        this._segs.push( _lightLine );
        
        var _lightLine = Object.create( LightLine );
        _lightLine.segA = this._pointToJS( 140, 500 );
        _lightLine.segB = this._pointToJS( 20, 600 );
        this._segs.push( _lightLine );
    
        var _lightLine = Object.create( LightLine );
        _lightLine.segA = this._pointToJS( 20, 600 );
        _lightLine.segB = this._pointToJS( 100, 400 );
        this._segs.push( _lightLine );

        // polygon #3
        var _lightLine = Object.create( LightLine );
        _lightLine.segA = this._pointToJS( 300, 520 );
        _lightLine.segB = this._pointToJS( 340, 300 );
        this._segs.push( _lightLine );

        var _lightLine = Object.create( LightLine );
        _lightLine.segA = this._pointToJS( 340, 300 );
        _lightLine.segB = this._pointToJS( 500, 400 );
        this._segs.push( _lightLine );

        var _lightLine = Object.create( LightLine );
        _lightLine.segA = this._pointToJS( 500, 400 );
        _lightLine.segB = this._pointToJS( 600, 640 );
        this._segs.push( _lightLine );

        var _lightLine = Object.create( LightLine );
        _lightLine.segA = this._pointToJS( 600, 640 );
        _lightLine.segB = this._pointToJS( 300, 520 );
        this._segs.push( _lightLine );

        // polygon #4
        var _lightLine = Object.create( LightLine );
        _lightLine.segA = this._pointToJS( 580, 120 );
        _lightLine.segB = this._pointToJS( 620, 80 );
        this._segs.push( _lightLine );

        var _lightLine = Object.create( LightLine );
        _lightLine.segA = this._pointToJS( 620, 80 );
        _lightLine.segB = this._pointToJS( 640, 140 );
        this._segs.push( _lightLine );

        var _lightLine = Object.create( LightLine );
        _lightLine.segA = this._pointToJS( 640, 140 );
        _lightLine.segB = this._pointToJS( 580, 120 );
        this._segs.push( _lightLine );

        // polygon #5
        var _lightLine = Object.create( LightLine );
        _lightLine.segA = this._pointToJS( 800, 380 );
        _lightLine.segB = this._pointToJS( 1020, 340 );
        this._segs.push( _lightLine );

        var _lightLine = Object.create( LightLine );
        _lightLine.segA = this._pointToJS( 1020, 340 );
        _lightLine.segB = this._pointToJS( 980, 540 );
        this._segs.push( _lightLine );

        var _lightLine = Object.create( LightLine );
        _lightLine.segA = this._pointToJS( 980, 540 );
        _lightLine.segB = this._pointToJS( 760, 580 );
        this._segs.push( _lightLine );

        var _lightLine = Object.create( LightLine );
        _lightLine.segA = this._pointToJS( 760, 580 );
        _lightLine.segB = this._pointToJS( 800, 380 );
        this._segs.push( _lightLine );

        // polygon #6
        var _lightLine = Object.create( LightLine );
        _lightLine.segA = this._pointToJS( 700, 190 );
        _lightLine.segB = this._pointToJS( 1060, 100 );
        this._segs.push( _lightLine );

        var _lightLine = Object.create( LightLine );
        _lightLine.segA = this._pointToJS( 1060, 100 );
        _lightLine.segB = this._pointToJS( 860, 300 );
        this._segs.push( _lightLine );
 
        var _lightLine = Object.create( LightLine );
        _lightLine.segA = this._pointToJS( 860, 300 );
        _lightLine.segB = this._pointToJS( 700, 190 );
        this._segs.push( _lightLine );
        
    },
    
    /* 绘制线段 */
    drawSegs: function()
    {
        for( var i = 0; i < this._segs.length; i++ )
        {
            this._drawLine.drawSegment( this._segs[i].segA, this._segs[i].segB );
        }
    },
    
    drawSegsBuffer: function()
    {
        console.log( this._intersects );
        for( var i = 0; i < (this._intersects.length - 1); i++ )
        {
            this._updateDraw.drawSegment( cc.p( this._light.x, this._light.y ), this._intersects[i].point );
            
            /* 查看光线范围打开注释, 有问题 */
            /*
            this._updateDraw.drawPoly( [ cc.p(this._light.x, this._light.y), this._intersects[i].point, this._intersects[ i + 1 ].point, cc.p(this._light.x, this._light.y)],
                                        cc.color(0, 255, 255, 50), 2, cc.color(255, 0, 255, 255));
            */
        }
        /* 查看光线范围打开注释, 有问题 */
        
        this._updateDraw.drawPoly( [cc.p(this._light.x, this._light.y), this._intersects[0].point, this._intersects[this._intersects.length - 1].point, cc.p(this._light.x, this._light.y)],
                                        cc.color(0, 255, 255, 50), 2, cc.color(255, 0, 255, 255)); 
        
        
        this._bDrawBuffer = true;
    },
    
    /* 获得点角度 */
    getEachPointAngle: function()
    {
        /* 获得唯一点 */
        var tmpPoint = new Array();
        for( var i = 0; i < this._segs.length; i++ )
        {
            var isFind = this._find( tmpPoint, this._segs[i].segA );
            if( -1 === isFind )
            {
                tmpPoint.push( this._segs[i].segA );
            }
            
            isFind = this._find( tmpPoint, this._segs[i].segB );
            if( -1 === isFind )
            {
                tmpPoint.push( this._segs[i].segB );
            }
        }
        
        /* 获得唯一点的角度 */
        for( var i = 0; i < tmpPoint.length; i++ )
        {
            var _l = cc.p( this._light.x, this._light.y ); // 
            var _a = Math.atan2( tmpPoint[i].y - _l.y, tmpPoint[i].x - _l.x );
            this._angle.push( _a - 0.00001 );
            this._angle.push( _a );
            this._angle.push( _a + 0.00001 );
        }
        
        /* 循环各角度, 找出最近的点 */
        for( var i = 0; i < this._angle.length; i++ )
        {
            var dx = Math.cos( this._angle[i] );
            var dy = Math.sin( this._angle[i] );
            
            
            var _lightLine = Object.create( LightLine );
            _lightLine.segA = cc.p( this._light.x, this._light.y );
            _lightLine.segB = cc.p( this._light.x + dx, this._light.y + dy );
            
            var minT1 = 0;
            for( var ii = 0; ii < this._segs.length; ii++ )
            {
                var tmpT1 = this._getIntersection( _lightLine, this._segs[ii] );
                if( -1 === tmpT1 )
                {
                    continue;
                }
                if( 0 === minT1 || minT1 > tmpT1 )
                {
                    minT1 = tmpT1;
                }
            }
            
            var _pAngle = Object.create( PointWithAngle );
            //_pAngle.point = this._pointToJS( this._light.x + minT1 * dx, this._light.y + minT1 * dy );
            _pAngle.point = cc.p( this._light.x + minT1 * dx, this._light.y + minT1 * dy );
            _pAngle.angle = this._angle[i];
            this._intersects.push( _pAngle );
        }
        
        this._intersects.sort( function( a, b ){
            return a.angle - b.angle;
        });
        
    },
    
    /* 射线判断交点 */
    _getIntersection: function( _ray, _seg )
    {
        var r_px = _ray.segA.x;
        var r_py = _ray.segA.y;
        var r_dx = _ray.segB.x - _ray.segA.x;
        var r_dy = _ray.segB.y - _ray.segA.y;
        
        var s_px = _seg.segA.x;
        var s_py = _seg.segA.y;
        var s_dx = _seg.segB.x - _seg.segA.x;
        var s_dy = _seg.segB.y - _seg.segA.y;

        var r_mag = Math.sqrt( r_dx * r_dx + r_dy * r_dy );
        var s_mag = Math.sqrt( s_dx * s_dx + s_dy * s_dy );
        if( ( r_dx / r_mag ) == ( s_dx / s_mag ) && ( r_dy / r_mag ) == ( s_dy / s_mag) )
        {
            return -1;
        }
        
        var t2 = ( r_dx * (s_py-r_py) + r_dy * (r_px - s_px)) / (s_dx*r_dy - s_dy*r_dx);
        var t1 = ( s_px + s_dx * t2 - r_px )/ r_dx;
        if( t1 < 0 || t2 < 0 || t2 > 1 )
        {
            return -1;
        }

        return t1;
    },
    
    /* 点坐标转化 */
    _pointToJS: function( _x, _y )
    {
        return cc.p( -1 * this._view.width / 2 + _x, -1 * this._view.height / 2 + _y );
    },
    
    _find: function( _arr, _segPoint )
    {
        for( var i = 0; i < _arr.length; i++ )
        {
            if( _arr[i].x === _segPoint.x && _arr[i].y === _segPoint.y )
            {
                return i;
            }
        }
        return -1;
    }

});
