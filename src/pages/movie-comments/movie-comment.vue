<template>
    <div class="movie-comment">
        <div class="type-title" v-if="needTitle">
            短评{{commentNum}}条
        </div>
        <ul>
            <li 
                class="comment-item"
                v-for="(comment, index) of comments"
                :key="index"
            >
                <div class="avatar">
                    <img v-lazy="comment.author.avatar" width="36" height="36">
                </div>
                <div class="content">
                    <h1 class="name">{{comment.author.name}}</h1>
                    <star :size="24" :score="comment.rating.value * 2"></star>
                    <p class="text">{{comment.content}}</p>
                    <span class="date">{{comment.created_at}}</span>
                    <div 
                        class="useful-count"
                        @click="markItem(comment.id, index)"
                        :class="{'like': isLike(comment.id)}"
                    >
                        <i class="iconfont icon-dianzan"></i>
                        {{comment.useful_count}}
                    </div>
                </div>
            </li>
        </ul>
        <div class="allComment" @click="needAllComments" v-if="!needTitle">
            <span>全部短评{{commentNum}}个</span>
        </div>
        <loadmore 
            :hasMore="hasMore" 
            v-show="comments.length" 
            v-if="needTitle"
        ></loadmore>
    </div>
</template>


<script>
    import Star from 'common/star/Star'
    import Loadmore from 'common/loadmore/Loadmore'
    import { mapActions, mapGetters } from 'vuex'
    export default {
        name: 'MovieComment',
        props: {
            comments: {
                type: Array,
                default: []
            },
            commentNum: {
                type: Number,
                default: 0
            },
            needTitle: {
                type: Boolean,
                default: false
            },
            hasMore: {
                type: Boolean,
                default: true
            }
        },
        computed: {
            ...mapGetters([
                'favoriteComments'
            ])
        },
        methods: {
            needAllComments () {
                this.$emit('needAllComments')
            },
            markItem (id, index) {
                //提交actions
                this.markComment(id);
                //进行模拟点赞加减的动作、不作为真实数据
                const CommentIndex = this.favoriteComments.findIndex((item) => {
                    return item === id
                });
                if (CommentIndex > -1) {
                    this.comments[index].useful_count ++
                } else {
                    this.comments[index].useful_count --
                }
            },
            isLike (id) {
                const index = this.favoriteComments.findIndex((item) => {
                    return item === id;
                });
                if(index > -1) {
                    return true
                }
                return false
            },
            ...mapActions([
                'markComment'
            ])
        },
        components: {
            Star,
            Loadmore
        }
    }
</script>


<style lang="stylus" scoped>
    @import '~assets/stylus/variable.styl';
    .movie-comment
        padding 20px
        background $color-background
        .type-title
            font-size $font-size-medium
            margin-bottom 15px
        .comment-item
            display flex
            margin-bottom 20px
            .avatar
                flex 0 0 36px
                width 36px
                margin-right 12px
                img     
                    border-radius 50%
            .content
                flex 1
                position relative
                font-size $font-size-medium
                color $color-text-f
                .name
                    display inline-block
                    line-height 25px
                    margin-right 5px
                .star
                    display inline-block
                .text   
                    line-height 20px
                .date
                    font-size $font-size-small
                    color $color-text
                    line-height 25px
                .useful-count
                    position absolute
                    color $color-text
                    top 5px
                    right 5px
                    &.like
                        color $color-theme-f
        .allComment
            font-size $font-size-medium
            color $color-theme-f
            text-align center
            padding-bottom 10px

</style>

