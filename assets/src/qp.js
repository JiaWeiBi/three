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
        c1: cc.SpriteFrame
        , c2: cc.SpriteFrame
        ,csAudio: {
            default: null,
            type: cc.AudioClip
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.points = {
            '-3': {
                '3': { 'x': 195, 'y': 1305 }
                , '0': { 'x': 195, 'y': 950 }
                , '-3': { 'x': 195, 'y': 595 }
            }
            , '-2': {
                '2': { 'x': 295, 'y': 1200 }
                , '0': { 'x': 295, 'y': 950 }
                , '-2': { 'x': 295, 'y': 700 }
            }
            , '-1': {
                '1': { 'x': 415, 'y': 1095 }
                , '0': { 'x': 415, 'y': 950 }
                , '-1': { 'x': 415, 'y': 805 }
            }
            , '0': {
                '-3': { 'x': 550, 'y': 595 }
                , '-2': { 'x': 550, 'y': 700 }
                , '-1': { 'x': 550, 'y': 805 }
                , '1': { 'x': 550, 'y': 1095 }
                , '2': { 'x': 550, 'y': 1200 }
                , '3': { 'x': 550, 'y': 1305 }
            }
            , '1': {
                '1': { 'x': 685, 'y': 1095 }
                , '0': { 'x': 685, 'y': 950 }
                , '-1': { 'x': 685, 'y': 805 }
            }
            , '2': {
                '2': { 'x': 805, 'y': 1200 }
                , '0': { 'x': 805, 'y': 950 }
                , '-2': { 'x': 805, 'y': 700 }
            }
            , '3': {
                '3': { 'x': 905, 'y': 1305 }
                , '0': { 'x': 905, 'y': 950 }
                , '-3': { 'x': 905, 'y': 595 }
            }
        }
    },

    start() {
        let self = this;
        window.qp = this
        this.moveAction = cc.repeatForever(cc.blink(1, 2));
    
        // Object.keys(this.points).forEach(x => {
        //     Object.keys(this.points[x]).forEach(y => {
        //         let node = new cc.Node('Sprite');
        //         let sp = node.addComponent(cc.Sprite);
        //         sp.spriteFrame = this.c1;
        //         node.parent = self.node;

        //         node.setPosition(this.points[x][y].x - 540, this.points[x][y].y - 960);
        //         node.on('mousedown', function (event) {

        //             node.getComponent(cc.Sprite).spriteFrame=self.c2;
        //           }, this);
        //     })
        // });

    },

    draw(pointMap) {

        window.pointMap = {};
        Object.keys(qp.points).forEach(x => {
            Object.keys(qp.points[x]).forEach(y => {
                let node = new cc.Node('Sprite');
                let sp = node.addComponent(cc.Sprite);
                node.parent = qp.node;
                node.X = x
                node.Y = y
                node.v = pointMap[`{X:${x},Y:${y}}`]
                switch (node.v) {
                    case 1:
                        sp.spriteFrame = qp.c1;
                        break;
                    case 2:
                        sp.spriteFrame = qp.c2;
                        break;
                    case 3:
                        //sp.spriteFrame = new cc.SpriteFrame("X");
                        break;
                    default:
                        node.opacity = 0
                        sp.spriteFrame = qp.c1;

                }
                node.setPosition(qp.points[x][y].x - 540, qp.points[x][y].y - 960);
                if(!!window.wx){
                    node.on('touchend', qp.mouseDown, node);
                }else{
                    node.on('mousedown', qp.mouseDown, node);
                }
                
                window.pointMap[`${x}_${y}`] = node
            })
        });

    },

    // mouseDown
    mouseDown(event) {
        switch (roleFlag) {
            //一号玩家
            case 1:
                switch (Number(status)) {
                    case 0:
                        notice("休息会儿。。")
                        break;
                    case 1:
                        notice("二号未准备")
                        break;
                    case 2:
                        notice("一号未准备")
                        break;
                    case 11:
                        qp.put(this.X, this.Y)
                        break;
                    case 12:
                        if (window.hasOwnProperty("moveCache")) {
                            if (moveCache.X == this.X && moveCache.Y == this.Y) {
                                window.moveCache.stopAction(qp.moveAction)
                                delete window.moveCache
                            } else {
                                qp.move(moveCache, this)
                            }
                        } else {
                            if (this.v != 1) {
                                notice("无法移动此位置")
                                return
                            }
                            window.moveCache = this
                            this.runAction(qp.moveAction)
                        }
                        break;
                    case 13:
                        if (this.v == 2) {
                            qp.take(this.X, this.Y)
                        }
                        break;
                    default:
                        notice("对方操作时间")
                }
                break;
            //二号玩家
            case 2:
                switch (Number(status)) {
                    case 0:
                        notice("休息会儿。。")
                        break;
                    case 1:
                        notice("二号未准备")
                        break;
                    case 2:
                        notice("一号未准备")
                        break;
                    case 21:
                        qp.put(this.X, this.Y)
                        break;
                    case 22:
                        if (window.hasOwnProperty("moveCache")) {
                            if (moveCache.X == this.X && moveCache.Y == this.Y) {
                                window.moveCache.stopAction(qp.moveAction)
                                delete window.moveCache
                            } else {
                                qp.move(moveCache, this)
                            }
                        } else {
                            if (this.v != 2) {
                                notice("无法移动此位置")
                                return
                            }
                            window.moveCache = this
                            this.runAction(qp.moveAction)
                        }
                        break;
                    case 23:
                        if (this.v == 1) {
                            qp.take(this.X, this.Y)
                        }
                        break;
                    default:
                        notice("对方操作时间")
                }
                break;
            default:
                return
        }
    },


    // update (dt) {},
    // 落子
    put(x, y) {
        starx.request("roomHandlers.Put", { "x": Number(x), "y": Number(y) })
    },
    //走子
    move(src, dst) {
        let data = {}
        data.type = 2
        data.src = { "x": Number(src.X), "y": Number(src.Y) }
        data.dst = { "x": Number(dst.X), "y": Number(dst.Y) }
        starx.request("roomHandlers.Move", data)
        window.moveCache.stopAction(qp.moveAction)
        delete window.moveCache
    },
    //揪子
    take(x, y) {
        starx.request("roomHandlers.Take", { "x": Number(x), "y": Number(y) })
    },
    // 复位
    reset(){
        Object.keys(window.pointMap).forEach((key)=>{
            window.pointMap[key].opacity = 0;
            window.pointMap[key].v = 0;
        })
    }
});
