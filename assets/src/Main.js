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
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

        var self = this;
        window.status = 0;
        window.notice = this.notice
        starx.init({ host: '192.168.0.100', port: 5000, path: '/three_game' }, function () {

            starx.on("onRoomInfo", self.onRoomInfo);
            starx.on("notice", self.onNotice);
            starx.on("onStatus", self.onStatus);
            starx.on("onStep", self.onStep);
            starx.on("onSettle", self.onSettle);

            starx.request("roomMgr.Login", "login", function (roleInfo) {
                window.roleInfo = roleInfo

                let roleNode2 = cc.find("Canvas/room/role2");
                // 显示自身信息
                cc.loader.load({ url: roleInfo.icon, type: 'jpg' }, function (err, tex) {
                    if (err) {
                        notice( '加载头像失败')
                        return;
                    }
                    let txNode2 = cc.find("txMask/tx", roleNode2);
                    let spf = new cc.SpriteFrame(tex);
                    txNode2.getComponent(cc.Sprite).spriteFrame = spf
                });
                roleNode2.getChildByName("name").getComponent(cc.Label).string = roleInfo.name;
                roleNode2.getChildByName("level").getComponent(cc.Label).string = roleInfo.level+"段棋手";
                roleNode2.getChildByName("gold").getComponent(cc.Label).string = "金币："+roleInfo.gold;
                
                starx.request("roomMgr.StartMatch", "starmatch", function (msg) {
                    notice("开始匹配")
                })
            });
        })
    },

    // 房间信息
    onRoomInfo(msg) {
        if (status != 0) {
            return
        }

        qp.draw(msg.pointmap)
        let role1, role2;
        // 一号玩家
        if (roleInfo.id == msg.fplayer.id) {
            window.roleFlag = 1
            role1 = msg.splayer
            role2 = msg.fplayer
        } else if (roleInfo.id == msg.splayer.id) { // 二号玩家
            window.roleFlag = 2
            role1 = msg.fplayer
            role2 = msg.splayer
        } else {
            window.roleFlag = 0
        }
        let roleNode1 = cc.find("Canvas/room/role1");
        let roleNode2 = cc.find("Canvas/room/role2");
        // 显示玩家信息
        cc.loader.load({ url: role2.icon, type: 'jpg' }, function (err, tex) {
            if (err) {
                notice( '加载头像失败')
                return;
            }
            let txNode2 = cc.find("txMask/tx", roleNode2);
            let spf = new cc.SpriteFrame(tex);
            txNode2.getComponent(cc.Sprite).spriteFrame = spf
        });
        roleNode2.getChildByName("name").getComponent(cc.Label).string = role2.name;
        roleNode2.getChildByName("level").getComponent(cc.Label).string = role2.level+"段棋手";
        roleNode2.getChildByName("gold").getComponent(cc.Label).string = "金币："+role2.gold;

        cc.loader.load({ url: role1.icon, type: 'jpg' }, function (err, tex) {
            if (err) {
                notice( '加载头像失败')
                return;
            }
            let spf = new cc.SpriteFrame(tex);
            let txNode1 = cc.find("txMask/tx", roleNode1);
            txNode1.getComponent(cc.Sprite).spriteFrame = spf;
        });
        roleNode1.getChildByName("name").getComponent(cc.Label).string = role1.name;
        roleNode1.getChildByName("level").getComponent(cc.Label).string = role1.level+"段棋手";
        roleNode1.getChildByName("gold").getComponent(cc.Label).string = "金币："+role1.gold;

        status = msg.status
        window.roomInfo = msg
        starx.request("roomHandlers.Ready", "")
    },

    // 提示信息
    onNotice(msg) {
        notice(msg.content)
    },
    //改变状态
    onStatus(msg) {
        if(msg > 10 && msg % 10 == 3){
            cc.audioEngine.play(qp.csAudio, false, 1)
        }
        status = Number(msg)
    },
    //回合步骤
    onStep(msg) {
        switch (msg.type) {
            case 1:
                let node = pointMap[`${msg.src.x}_${msg.src.y}`];
               
                if (msg.player == roomInfo.fplayer.id) {
                    node.getComponent(cc.Sprite).spriteFrame = qp.c1;
                    node.v = 1
                } else if (msg.player == roomInfo.splayer.id) {
                    node.getComponent(cc.Sprite).spriteFrame = qp.c2;
                    node.v = 2
                }

                node.opacity = 250
                break;
            case 2:
                let src = pointMap[`${msg.src.x}_${msg.src.y}`]
                let dst = pointMap[`${msg.dst.x}_${msg.dst.y}`]
                dst.v = src.v
                dst.getComponent(cc.Sprite).spriteFrame = src.getComponent(cc.Sprite).spriteFrame;
                src.opacity = 0
                src.v = 0
                dst.opacity = 250
                break;
            case 3:
                let n = pointMap[`${msg.src.x}_${msg.src.y}`]
                n.v = 3
                n.opacity = 0
                break;
        }
    },
    // 结算
    onSettle(msg) {
        switch (Number(msg.winner)) {
            case 1:
                notice("一号玩家胜利")
                
                break
            case 2:
            notice("二号玩家胜利")
                break
        }
        status = 0
        qp.reset()
    },
    // 提示
    notice(msg, icon, dura){
        if(!!window.wx){
            wx.showToast({
                title: msg,
                icon: icon || 'none',
                duration: dura || 2000
            })
        }else{
            alert(msg)
        }
    },
    // update (dt) {},
});
