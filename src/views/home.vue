<template>
    <div class="home-page">
        <el-button class="out-room" type="primary" @click="toShare()">屏幕共享DEMO -- 分享</el-button>
        <el-button class="out-room" type="primary" @click="toPlay()">屏幕共享DEMO -- 播放</el-button>
    </div>
</template>

<script>
export default {
    name: 'Home',
    data() {
        return {
            
        };
    },
    created() {
        
    },
    mounted() {},
    methods: {
        toShare() {
            this.$router.push({
                path: '/share',
            })
        },
        toPlay() {
            this.$router.push({
                path: '/play',
            })
        }
    }
};
</script>

<style lang="scss">
.home-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    padding-top: 100px;
    
    .el-button {
        margin: 10px 0;
    }
}
</style>
