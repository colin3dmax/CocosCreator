cc.Class({
    extends: cc.Component,

    properties: 
    {
        
    },

    onLoad: function () 
    {
        this._view = cc.view.getDesignResolutionSize();
        
        this._drawNode = new cc.DrawNode();
        this._drawNode.setPosition( 0, 0 );
        this.node._sgNode.addChild( this._drawNode );
        
        // 初始化你想要的颜色， 可面板选择
        var enumColor = [];
        enumColor.push( cc.color( 254, 252, 75) );
        enumColor.push( cc.color( 208, 232, 65) );
        enumColor.push( cc.color( 104, 174, 59) );
        enumColor.push( cc.color( 24, 147, 204) );
        
        enumColor.push( cc.color( 16, 79, 250) );
        enumColor.push( cc.color( 61, 20, 161) );
        enumColor.push( cc.color( 133, 23, 172) );
        enumColor.push( cc.color( 165, 29, 76) );
        
        enumColor.push( cc.color( 251, 43, 36) );
        enumColor.push( cc.color( 250, 84, 34) );
        enumColor.push( cc.color( 249, 152, 39) );
        enumColor.push( cc.color( 248, 187, 42) );
        
        // 参数见官方函数 drawCircle
        var center = cc.p( 0, 0 );
        var radius = 100;
        var angle = 0;
        var segments = 360;
        var coef = 2.0 * Math.PI / segments;
        var vertices = [];
        
        var verMid = [];
        // 颜色厚度值
        var colorLen = 30;
        for (var i = 0; i <= segments; i++) {
            var rads = i * coef;
            var j = radius * Math.cos(rads + angle) + center.x;
            var k = radius * Math.sin(rads + angle) + center.y;
            vertices.push(cc.p(j, k));
            
            // 内圈周长点
            var m = (radius - colorLen) * Math.cos(rads + angle) + center.x;
            var n = (radius - colorLen) * Math.sin(rads + angle) + center.y;
            verMid.push(cc.p(m, n));
            
        }
        
        for(var ii = 1, len = vertices.length; ii < len; ii++ )
        {
            // 内圈透明
            var v = [];
            v.push( verMid[ ii - 1] );
            v.push( vertices[ ii - 1] ); 
            v.push( vertices[ ii ] ); 
            v.push( verMid[ ii ] ); 
            
            var enumIndex = Math.ceil( ii / ( segments / enumColor.length ) ) - 1;
            
            this._drawNode.drawPoly( v, enumColor[ enumIndex ], 1, enumColor[ enumIndex ] );
            
            // 内圈不透明，直接按照小半径画个圈就好了。
        }
        
    },

});
