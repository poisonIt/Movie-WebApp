<template>
  <div class="detail-wrapper">
    <div class="fixed-title">
      <span class="back" @click="back">
        <i class="iconfont icon-back"></i>
      </span>
      <span class="type" ref="fixed">
        影人
      </span>
    </div>
    <scroll class="celebrity-detail" v-if="celebrityDetail.avatars" :data="celebrityDetail">
      <div class="scroll-wrapper">
        <div class="bg-image" ref="image">
          <img v-lazy="replaceUrl(celebrityDetail.avatars.large)"/>
        </div>
        <div class="celebrity-info">
          <div class="main">
            <h1 class="name-cn">{{celebrityDetail.name}}</h1>
            <span class="name-en">{{celebrityDetail.name_en}}</span>
            <div class="collect" 
                @click="saveCollect" 
                :class="{'has-collect': isCollected}"
            >
              <i class="iconfont icon-shoucang"></i>
              <span class="text">{{collectText}}</span>
            </div>
          </div>
          <div class="brief">
            <div class="title">个人简介</div>
            <p class="text" @click="showInfo">
              {{celebrityDetail.summary}}
              <span class="more"><i class="iconfont icon-next-m"></i></span>
            </p>
          </div>
          <scroll class="works" 
            :scrollX="this.scrollX" 
            :eventPassthrough="this.eventPassthrough" 
            ref="scroll" 
            v-if="works.length"
          >
            <div class="works-content" ref="content">
              <h2 class="title">代表作品</h2>
              <div 
                class="work-item" 
                v-for="(item, index) in works" 
                :key="index"
                @click="selectWork(item, $event)"
            >
                <img v-lazy="replaceUrl(item.image)" width="90" height="120">
                <h3 class="item-title">{{item.title}}</h3>
                <star :score="item.rating" :showScore="showScore"></star>
              </div>
            </div>
          </scroll>
          <div class="allWorks" @click="getAllWorks">
            查看全部作品
            <i class="iconfont icon-next-m"></i>
          </div>
        </div>
      </div>
    </scroll>
    <loadmore :fullScreen="fullScreen" v-if="!celebrityDetail.avatars"></loadmore>
    <celebrity-info :infoLists="celebrityDetail" ref="info"></celebrity-info>
    <router-view></router-view>
  </div>
</template>


<script>
    import Star from 'common/star/Star';
    import Scroll from 'common/scroll/Scroll';
    import Loadmore from 'common/loadmore/Loadmore';
    import CelebrityInfo from 'pages/celebrity-info/celebrity-info';
    import { createMovieList } from 'assets/js/movielist';
    import Celebrity from 'assets/js/celebrity';
    import { getCelebrity } from 'api/celebrity'
    import { mapGetters, mapMutations, mapActions } from 'vuex'  
    export default {
        name: 'celebrity',
        data() {
            return {
                celebrityDetail: {},
                works: [],
                showScore: true,
                scrollX: true,
                fullScreen: true,
                eventPassthrough: 'vertical',
                collectText: '收藏',
                isCollected: false
            }
        },
        computed: {
            ...mapGetters([
                'currentCelebrityId',
                'collectedCelebrities'
            ])
        },
        created() {
            this._getCelebrity()
        },
        methods: {
            back () {
                this.$router.back()
            },
            saveCollect() {
                this.markCelebrity(this.celebrity)
                this.isCollected = !this.isCollected;
                if (!this.isCollected) {
                    this.collectText = "收藏"
                } else {
                    this.collectText = "已收藏"
                }
            },
            _getCelebrity() {
            if (!this.currentCelebrityId) { // 当前页面浏览器刷新跳转回主页
                this.$router.push('/home');
                return;
            }
            
            getCelebrity(this.currentCelebrityId).then((res) => {
                if (!this.$route.params.celebrityId) { // 防止快速切换报错
                    return;
                }
                this.celebrityDetail = res;
                // 需要把影人作品包装成电影类，否则传递给vuex的类型会出现问题，即使以对象的格式只传入id，如果在跳转后的界面进行收藏操作也会由于数据不全影响收藏列表的展示
                let ret = [];
                res.works.forEach((item) => {
                    ret.push(item.subject);
                });
                this.works = createMovieList(ret);
                this._checkCollect();
                // 把影人包装成影人类，便于收藏和读取收藏
                const mainWorks = [];
                 res.works.forEach((item) => {
                    mainWorks.push(item.subject.title);
                });
                 this.celebrity = new Celebrity({
                    id: res.id,
                    name: res.name,
                    image: res.avatars.large,
                    works: mainWorks.slice(0, 3).join('/')
                });
                    this._initPics();
                });
            },
            _initPics() {
                let picWidth = 90;
                let margin = 8;
                let width = (picWidth + margin) * this.celebrityDetail.works.length - margin;
                this.$nextTick(() => { //由于横向scroll组件v-if，这里的引用需要等待dom刷新
                    this.$refs.content.style.width = width + 'px';
                }) 
            },
            replaceUrl(srcUrl) {
                if (srcUrl !== undefined) {
                    return ('https://images.weserv.nl/?url=' + srcUrl.replace(/http\w{0,1}:\/\//, '')); 
                }
            },
            showInfo () {
                this.$refs.info.show()
            },
            selectWork (movie) {
                if (!event._constructed) { //忽略浏览器派发的点击事件、只留下scroll组件派发的事件
                    return
                }
                this.setMovie(movie)
                this.$router.push({
                    path: `/movie/${movie.id}`
                })
            },
            getAllWorks () {
                this.$router.push({
                    path: `/celebrity/${this.currentCelebrityId}/works`
                })
            },
            _checkCollect() {
                const index = this.collectedCelebrities.findIndex((item) => {
                    return item.id === this.celebrityDetail.id
                });
                    console.log(index)

                if (index > -1) {
                    this.isCollected = true;
                    this.collectText = "已收藏"
                } else {
                    this.isCollected = false;
                    this.collectText = "收藏"
                }
            },
            ...mapMutations({
                setMovie: 'SET_MOVIE'
            }),
            ...mapActions([
                'markCelebrity'
            ])
        },
        components: {
            Star,
            Scroll,
            Loadmore,
            CelebrityInfo
        }
    }
</script>


<style lang="stylus" scoped>
    @import '~assets/stylus/variable.styl';
    @import '~assets/stylus/mixin.styl';
        .detail-wrapper
            position: fixed
            top: 0
            bottom: 0
            left: 0
            right: 0
            background: $color-background-f
            z-index: 10
            .fixed-title
                position: fixed
                top: 0
                width: 100%
                height: 40px
                z-index: 100
                background-color: rgba(85, 85, 85, .6)
                .back
                    position: absolute
                    top: 0px
                    left: 6px
                    z-index: 50
                    .icon-back
                        display: block
                        padding: 11px
                        font-size: $font-size-large
                        color: $color-background
                .type
                    display: inline-block
                    padding-top: 12px
                    padding-left: 50px
                    font-size: $font-size-medium-x
                    color: $color-background
            .celebrity-detail
                position fixed
                top 0
                bottom 0
                right 0
                left 0
                background $color-background-f
                .bg-image
                    text-align center
                    padding 50px 0 20px 0
                    background $color-background-f
                    img 
                        width 40%
                .celebrity-info
                    background $color-background
                    padding 15px 20px 0 20px
                    .main
                        position relative
                        .name-cn
                            font-size $font-size-medium-x
                            color $color-text-f
                        .name-en
                            font-size $font-size-medium
                            padding-top 7px
                            display inline-block
                        .collect
                            position absolute
                            top 0
                            right 0
                            height 30px
                            line-height 30px
                            width 80px
                            text-align center
                            font-size $font-size-medium
                            border 1px solid $color-theme-f
                            border-radius 10px
                            &.has-collect
                                border 1px solid $color-collect
                                color $color-collect
                                .icon-shoucang
                                    color $color-collect
                                .text
                                    color $color-collect
                            .icon-shoucang
                                display inline-block
                                color $color-theme-f
                            .text
                                display inline-block
                                font-size $font-size-small
                                color $color-theme-f
                    .brief
                        position relative
                        margin-top 30px
                        font-size $font-size-medium
                        .text
                            position: relative;
                            padding-right: 15px;
                            display: -webkit-box;
                            box-sizing border-box
                            -webkit-line-clamp: 3;
                            overflow: hidden;
                            margin-top: 20px;
                            color $color-text-f
                            line-height 20px

                            .more
                                position absolute
                                top 50%
                                transform translateY(-50%)
                                right 0
                                font-size $font-size-large-x
                                color $color-theme-f
                    .works
                        margin-top 30px
                        padding-bottom 20px
                        font-size $font-size-medium
                        white-space nowrap
                        overflow hidden
                        font-size 0 
                        border-bottom-1px(#ccc)
                        .works-content
                            .title
                                font-size $font-size-medium
                                padding-bottom 20px
                            .work-item
                                width 90px
                                vertical-align top
                                display inline-block
                                margin-right 8px
                                font-size $font-size-medium
                                img     
                                    height 120px
                                    width 90px
                                .item-title
                                    color $color-text-f
                                    padding 8px 0 5px 0
                                    no-wrap()
                    .allWorks
                        padding 20px 0
                        font-size $font-size-medium
                        i 
                            display inline-block
                            padding 5px
                            font-size $font-size-medium
                            vertical-align middle
</style>
