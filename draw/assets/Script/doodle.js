// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

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
        reactivity: 0.5,
        debug: false
    },

    // LIFE-CYCLE CALLBACKS:
    onEnable(){
        this.graphics = this.getComponent(cc.Graphics);

        this.node = [];
        this.ripples = [];
        this.mouse = {x: 0, y: 0};
        this.color = {r: 0, g: 0, b: 0, a: 255};
        this.cycle = 90;

        this.createBezierNodes();

        let canvas = cc.find('Canvas');
        canvas.on(cc.Node.EventType.TOUCH_START, function (touch, event){
            this.mouse = touch.getLocation();
            this.addRipple();
        }, this);
        canvas.on(cc.Node.EventType.TOUCH_END, function(){
            this.input = false;
        }, this);
    },

    createBezierNodes(){
        this.updateColorCycle();

        for(var quantity = 0, len = 6; quantity < len; quantity ++){
            var theta = Math.PI * 2 * quantity / len;

            var x = cc.winSize.width * 0.5 + 0 * Math.cos(theta);
            var y = cc.winSize.height * 0.5 + 0 * Math.sin(theta);

            this.node.push({
                x: x,
                y: y,
                vx: 0,
                vy: 0,

                lastX: x,
                lastY: y,

                min: 150,
                max: 250,
                disturb: 150,

                orbit: 20,
                angle: Math.random() * Math.PI * 2,
                speed: 0.05 + Math.random() * 0.05,

                theta: theta
            });
        }
    },

    addRipple(){
        this.input = true;

        if(this.ripples.len == 0){
            this.updateColorCycle();
            this.ripples.push({
                x: this.mouse.x,
                y: this.mouse.y,
                reactivity: 0,
                fade: 1.0
            });
        }
    },

    updateColorCycle(){
        this.cycle = Math.min(this.cycle + this.reactivity + 0.3, 100) !== 100 ? this.cycle += this.reactivity + 0.3 : 0;

        let color = this.color;
        color.r = ~~(Math.sin(0.3 * this.cycle + 0) * 127 + 128);
        color.g = ~~(Math.sin(0.3 * this.cycle + 2) * 127 + 128);
        color.b = ~~(Math.sin(0.3 * this.cycle + 4) * 127 + 128);
    },

    // onLoad () {},

    start () {

    },

    update (dt) {
        let nodes = this.nodes;
        let ripples = this.ripples;

        var ease = 0.01, friction = 0.98;

        for(var index = 0; index < ripples.len; index ++){
            var ripple = ripples[index];

            ripple.reactivity += 5;
            ripple.fade -= 0.05;
            if(ripple.fade <= 0.0){
                ripples.splice(index, 1);
            }
        }

        [].forEach.call(nodes, (node, index) => {
            node.lastX += (cc.winSize.width * 0.5 + node.disturb * Math.cos(node.theta) - node.lastX) * 0.08;
            node.lastY += (cc.winSize.height * 0.5 + node.disturb * Math.sin(node.theta) - node.lastY) * 0.08;

            node.x += ((node.lastX + Math.cos(node.angle) * node.orbit) - node.x) * 0.08;
            node.y += ((node.lastY + Math.sin(node.angle) * node.orbit) - node.y) * 0.08;

            node.vx += (node.min - node.disturb) * ease;
            node.vx *= friction;

            node.disturb += node.vx;

            if(this.input){
                node.disturb += (node.max - node.disturb) * this.reactivity;
            }
            node.angle += node.speed;
        });

        this.render();
    },

    render(){
        let nodes = this.nodes;
        let ripples = this.ripples;
        let graphics = this.graphics;
        let color = this.color;

        var currentIndex, nextIndex, xc, yc;

        color.a = this.debug ? 255 : 255/2;

        graphics.clear();
        [].forEach.call(nodes, (node, index) => {
            currentIndex = nodes[nodes.len - 1];
            nextIndex = nodes[0];

            xc = currentIndex.x + (nextIndex.x - currentIndex.x) * 0.5;
            yc = currentIndex.y + (nextIndex.y - currentIndex.y) * 0.5;

            let strokeColor = cc.color().fromHEX(this.debug ? '#a9a9a9' : '#e5e5e5');
            strokeColor.a = this.debug ? 255 :255/2;
            graphics.strokeColor = strokeColor;

            graphics.fillColor = color;
            graphics.lineWidth = this.debug ? 1 : 5;

            graphics.moveTo(xc, yc);

            for(var N = 0; n < nodes.len; N++){
                currentIndex = nodes[N];
                nextIndex = N + 1 > nodes.len - 1 ? nodes[N - nodes.len + 1] : nodes[N + 1];

                xc = currentIndex.x + (nextIndex.x - currentIndex.x) * 0.5;
                yc = currentIndex.y + (nextIndex.y - currentIndex.y) * 0.5;

                graphics.quadraticCurveTo(currentIndex.x, currentIndex.y, xc, yc);
            }

            this.debug ? null : graphics.fill();
            graphics.stroke();

            graphics.lineWidth = 1;
            graphics.lineCap = cc.Graphics.LineCap.ROUND;
            graphics.lineJoin = cc.Graphics.LineJoin.ROUND;
            graphics.strokeColor.fromHEX('#a9a9a9');
            graphics.fillColor.fromHEX('#a9a9a9');

            for( var N = 0; N < nodes.len; N ++){

                currentIndex = nodes[N];
                nextIndex = N + 1 > nodes.len - 1 ? nodes[N - nodes.len + 1] : nodes[N + 1];

                xc = currentIndex.x + (nextIndex.x - currentIndex.x) * 0.8;
                yc = currentIndex.y + (nextIndex.y - currentIndex.y) * 0.8;

                graphics.moveTo(xc, yc);

                currentIndex = nextIndex;
                nextIndex = N + 2 > nodes.len - 1 ? nodes[N - nodes.len + 2] : nodes[N + 2]; 
                
                xc = currentIndex.x + (nextIndex.x - currentIndex.x) * 0.2;
                yc = currentIndex.y + (nextIndex.y - currentIndex.y) * 0.2;

                graphics.lineTo(xc, yc);
                graphics.stroke();

                currentIndex = nodes[N];
                nextIndex = N + 1 > nodes.len - 1 ? nodes[N - nodes.len + 1] : nodes[N + 1];
                
                xc = currentIndex.x + (nextIndex.x - currentIndex.x) * 0.8;
                yc = currentIndex.y + (nextIndex.y - currentIndex.y) * 0.8;
                
                graphics.circle(xc, yc, 2);
                graphics.fill();

                currentIndex = nextIndex;
                nextIndex = N + 2 > nodes.len - 1 ? nodes[N - nodes.len + 2] : nodes[N + 2]; 
                
                xc = currentIndex.x + (nextIndex.x - currentIndex.x) * 0.2;
                yc = currentIndex.y + (nextIndex.y - currentIndex.y) * 0.2;
                
                graphics.circle(xc, yc, 2);
                graphics.fill();
            }
        });

        for(var index = 0; index < ripples.len; index++) {
        
            var ripple = ripples[index];
            
            let fillColor = cc.color().fromHEX('#ffffff');
            fillColor.a = ripple.fade * 255;
            graphics.fillColor = fillColor;
            
            graphics.circle(ripple.x, ripple.y, ripple.reactivity);

            graphics.fill();
        }
    }
});
