/**
 * Created by JiaDing on 14-4-19.
 */

var GameScene = cc.Scene.extend({

    TAG_CurrentView:1,

   onEnter:function()
   {
       this._super();

       var winSize = cc.Director.getInstance().getWinSize();
       var w = winSize.width;
       var h = winSize.height;
       var bg = cc.Sprite.create(s_pic_bg);
       bg.setAnchorPoint(0,0);
       this.addChild(bg,0);

       var startLayer = StartLayer.create();
       this.addChild(startLayer,1,this.TAG_CurrentView);


       cc.AudioEngine.getInstance().preloadSound(s_sound_bg);
       cc.AudioEngine.getInstance().preloadSound(s_sound_btn);
       cc.AudioEngine.getInstance().preloadSound(s_sound_kick);
       cc.AudioEngine.getInstance().preloadSound(s_sound_lose);
       cc.AudioEngine.getInstance().preloadSound(s_sound_win);

       cc.AudioEngine.getInstance().playMusic(s_sound_bg,true);

       cc.NotificationCenter.getInstance().addObserver(this,this.changeToGameLayer,"changeToGameLayer");
       cc.NotificationCenter.getInstance().addObserver(this,this.gameOver,"gameOver");

   },
    changeToGameLayer:function()
    {
        this.removeChildByTag(this.TAG_CurrentView,true);

        var gameLayer = GameLayer.create();
        this.addChild(gameLayer,1,this.TAG_CurrentView);
    },
    gameOver:function(isWin)
    {
        this.removeChildByTag(this.TAG_CurrentView,true);
        var overLayer = GameOverLayer.create(isWin);
        this.addChild(overLayer,1,this.TAG_CurrentView);
    }

});
