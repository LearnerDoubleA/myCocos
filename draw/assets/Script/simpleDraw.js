// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
let LineJoin = cc.Graphics.LineJoin;
let LineCap = cc.Graphics.LineCap;

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.g = this.getComponent(cc.Graphics);
        //画线
        this.g.lineWidth = 10;
        this.g.fillColor.fromHEX('#ff0000');

        this.g.moveTo(-20, 0);
        this.g.lineTo(0, -100);
        this.g.lineTo(20, 0);
        this.g.lineTo(0, 100);
        this.g.close();

        //线头和节点
        // this.g.lineWidth = 20;
        // this.time = 0;
        // this.radius = 100;

        // this.draw();

        //矩形
        this.g.lineWidth = 10;
        this.g.fillColor.fromHEX('#ff0000');

        this.g.rect(-290, 0, 40, 30);//（左上x，左上y，长，宽）
        this.g.roundRect(250, -50, 200, 100, 20);//（左上x，左上y，长，宽，圆角半径）

        //圆形，椭圆
        this.g.circle(150, 0, 100);
        this.g.ellipse(-150, 0, 100, 70);

        //扇形
        this.g.arc(80, 80, 100, Math.PI/2, Math.PI, false);//(圆心x,圆心y,半径,起始弧度,结束弧度,顺时针/逆时针)
        this.g.lineTo(80, 80);
        this.g.close();

        this.g.stroke();
        this.g.fill();
    },

    start () {

    },

    update (dt) {
        // this.time += dt * 0.5;
        // this.draw();
    },

    draw(){
        let g = this.g;
        g.clear();//清除图像

        let rx = this.radius * Math.sin(this.time);
        let ry = this.radius * Math.cos(this.time);
        g.lineCap = LineCap.BUTT;//Butt默认平角，Round圆角，Square正方形，比Butt长
        g.lineJoin = LineJoin.BEVEL;//Bevel平角，Round圆角，Miter尖角
        this.drawLine(-200, 0, rx, ry);
    },

    drawLine(x, y, rx, ry){
        let g = this.g;

        g.moveTo(x + rx, y + ry);
        g.lineTo(x, y);
        g.lineTo(x - rx, y + ry);
        g.stroke();
    }
});
