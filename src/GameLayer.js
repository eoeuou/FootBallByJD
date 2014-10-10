/**
 * Created by JiaDing on 14-4-20.
 */

var GameLayer = cc.Layer.extend({

    TAG_MAN:1,
    TAG_Ball:2,
    TAG_DashBoard:3,
    TAG_DOOR:4,

    havePcMouseDown:false,
    rotationSpeed:11,

    MIN_ROTATION: - 135,
    MAX_ROTATION: -45,

    init:function()
    {
        if(this._super())
        {

            var winSize = cc.Director.getInstance().getWinSize();

            var door = cc.Sprite.create(s_pic_door);
            var scale = 0.7;
            door.setScale(scale);
            door.setAnchorPoint(cc.p(0,1));
            door.setPosition(cc.p((winSize.width + 30 - door.getContentSize().width * scale)/2,
                winSize.height-150));
            this.addChild(door);
            door.setTag(this.TAG_DOOR);

            var dashBoardBg = cc.Sprite.create(s_pic_dashBoard);
            dashBoardBg.setAnchorPoint(cc.p(0.5,0));
            dashBoardBg.setScale(0.7);
            dashBoardBg.setPosition(cc.p(winSize.width - dashBoardBg.getContentSize().width * dashBoardBg.getScale()/2,dashBoardBg.getContentSize().height / 2 + 300));
            this.addChild(dashBoardBg);
            dashBoardBg.setTag(this.TAG_DashBoard);

            var arrow = cc.Sprite.create(s_pic_arrow);
            arrow.setAnchorPoint(cc.p(0,0.5));
            arrow.setScale(0.55);
            arrow.setPositionX(dashBoardBg.getContentSize().width/2);
            arrow.setRotation(-90);
            dashBoardBg.addChild(arrow);
            arrow.setTag(1);

            ccs.ArmatureDataManager.getInstance().addArmatureFileInfo(s_exportJson_FootMan);
            ccs.ArmatureDataManager.getInstance().addArmatureFileInfo(s_exportJson_RoundBall);

            var man = ccs.Armature.create("FootMan");
            man.setAnchorPoint(cc.p(0,0));
            man.setPosition(cc.p(100,20));
            this.addChild(man);
            man.setTag(this.TAG_MAN);

            var ball= ccs.Armature.create("RoundBall");
            ball.setScale(0.6);
            ball.setPosition(cc.p(winSize.width/2,200));
            this.addChild(ball);
            ball.setTag(this.TAG_Ball);


            var label = cc.LabelTTF.create("伙计么看这儿！！\n你认为我会告诉你鼠标按着不动瞄准,\n松开射门这句话么？","Microsoft Yahei Font",25);
            label.setPosition(cc.p(winSize.width/2,70));
            label.setColor(cc.c3b(255,0,0));
            this.addChild(label);

            if( 'touches' in sys.capabilities )
                this.setTouchEnabled(true);
            else if ('mouse' in sys.capabilities )
                this.setMouseEnabled(true);





            return true;
        }
        return false;
    },

    touchenable:true,
    haveMobileTouch:false,

    onTouchesBegan:function()
    {
        if(!this.touchenable)
        {
            this.haveMobileTouch = false;
            return false;
        }
        this.touchenable = false;
        this.haveMobileTouch = true;
        this.ready();
        return true;
    },
    onMouseDown:function (event)
    {
        if(!this.touchenable)
        {
            this.havePcMouseDown = false;
            return;
        }
        this.touchenable = false;
        this.havePcMouseDown = true;
        this.ready();
    },

    onTouchesEnded:function()
    {
        if(this.haveMobileTouch)
        {
            this.run();
        }
    },
    onMouseUp:function()
    {

        if(this.havePcMouseDown)
        {
            this.run();
        }
    },


    ready:function()
    {
        this.schedule(this.update,0.016);
    },
    update:function()
    {
        var arrow = this.getChildByTag(this.TAG_DashBoard).getChildByTag(1);
        var rot = arrow.getRotation();
        if(rot <= -135 || rot >= -45)
        {
            this.rotationSpeed = this.rotationSpeed * -1;
        }
        arrow.setRotation(rot + this.rotationSpeed);
    },
    run:function()
    {
        this.unschedule(this.update);

        var man = this.getChildByTag(this.TAG_MAN);
        man.getAnimation().playWithIndex(0);

        var action = cc.Sequence.create(
            cc.MoveBy.create(2,cc.p(150,50)),
            cc.DelayTime.create(0.3),
            cc.CallFunc.create(function(){
                this.kick();
            }.bind(this),this)
        );
        man.runAction(action);
    },
    kick:function()
    {
        var man = this.getChildByTag(this.TAG_MAN);
        man.getAnimation().playWithIndex(1);
        man.getAnimation().setMovementEventCallFunc(function(armature, movementType, movementID){
            if (movementType == ccs.MovementEventType.complete)
            {
                cc.AudioEngine.getInstance().playEffect(s_sound_kick,false);

                var ball = this.getChildByTag(this.TAG_Ball);
                ball.getAnimation().playWithIndex(0);

                var arrow = this.getChildByTag(this.TAG_DashBoard).getChildByTag(1);
                var rotation = arrow.getRotation();
                var door = this.getChildByTag(this.TAG_DOOR);
                var doorWidth = door.getContentSize().width * door.getScale();
                var doorHeight = door.getContentSize().height * door.getScale();

                var doorLeftX = door.getPositionX();
                var doorRightX = door.getPositionX() + doorWidth;

                var minX = doorLeftX - 300;
                var maxX = doorRightX + 300;
                var targetX = (rotation + (this.MIN_ROTATION * -1)) / (this.MAX_ROTATION + (this.MIN_ROTATION * -1)) * (maxX - minX) + minX;

                var action = cc.Sequence.create(
                    cc.MoveTo.create(1,cc.p(targetX,door.getPositionY() - doorHeight + 30)),
                    cc.CallFunc.create(function(){
                        var win = false;
                        if(targetX > doorLeftX && targetX < doorRightX)
                        {
                            win = true;
                        }
                        this.gameOVer(win);
                    }.bind(this),this)
                );
                ball.runAction(action);
            }
        }.bind(this),this);

    },
    gameOVer:function(isWin)
    {
        cc.NotificationCenter.getInstance().postNotification("gameOver",isWin);
    }

});

GameLayer.create = function()
{
    var obj = new GameLayer();
    if(obj && obj.init())
    {
        return obj;
    }
    return null;
};