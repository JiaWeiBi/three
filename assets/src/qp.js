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
        c1:cc.SpriteFrame
        ,c2:cc.SpriteFrame
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.points = {
            '-3':{
                '3':{'x':195, 'y':1305}
                ,'0':{'x':195, 'y':950}
                ,'-3':{'x':195, 'y':595}
            }
            ,'-2':{
                '2':{'x':295, 'y':1200}
                ,'0':{'x':295, 'y':950}
                ,'-2':{'x':295, 'y':700}
            }
            ,'-1':{
                '1':{'x':415, 'y':1095}
                ,'0':{'x':415, 'y':950}
                ,'-1':{'x':415, 'y':805}
            }
            ,'0':{
                '-3':{'x':550, 'y':595}
                ,'-2':{'x':550, 'y':700}
                ,'-1':{'x':550, 'y':805}
                ,'1':{'x':550, 'y':1095}
                ,'2':{'x':550, 'y':1200}
                ,'3':{'x':550, 'y':1305}
            }
            ,'1':{
                '1':{'x':685, 'y':1095}
                ,'0':{'x':685, 'y':950}
                ,'-1':{'x':685, 'y':805}
            }
            ,'2':{
                '2':{'x':805, 'y':1200}
                ,'0':{'x':805, 'y':950}
                ,'-2':{'x':805, 'y':700}
            }
            ,'3':{
                '3':{'x':905, 'y':1305}
                ,'0':{'x':905, 'y':950}
                ,'-3':{'x':905, 'y':595}
            }
        }
    },

    start () {
        let self = this;
        console.log("QP=====start");
      
        Object.keys(this.points).forEach(x => {
            Object.keys(this.points[x]).forEach(y => {
                let node = new cc.Node('Sprite');
                let sp = node.addComponent(cc.Sprite);
                sp.spriteFrame = this.c2;
                node.parent = self.node;
                
                console.log(this.points[x][y].x, '==', this.points[x][y].y);
                node.setPosition(this.points[x][y].x - 540, this.points[x][y].y - 960);
            })
        });
        
    },

    // update (dt) {},
});
