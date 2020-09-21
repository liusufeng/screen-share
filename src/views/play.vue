<template>
    <div class="play-page">
        <el-form ref="form" class="share-form" :model="formData" v-if="!isAtRoom">
            <div class="title">屏幕共享DEMO -- 播放</div>
            <el-form-item label="用户名" prop="userId" :rules="{ required: true, message: '请输入用户名', trigger: 'blur' }">
                <el-input v-model.trim="formData.userId" placeholder="用户名"></el-input>
            </el-form-item>
            <el-form-item label="房间号" prop="roomId" :rules="{ required: true, message: '请输入房间号', trigger: 'blur' }">
                <el-input v-model.trim="formData.roomId" placeholder="房间号" oninput="value=value.replace(/[^\d]/g,'')"></el-input>
            </el-form-item>
            <el-button class="enter-room" type="primary" @click="enterRoom()">进入房间</el-button>
        </el-form>
        <template v-else>
            <el-button class="out-room" @click="outRoom()">退出房间</el-button>
            <div id="remote_stream" class="remote_stream"></div>
        </template>
    </div>
</template>

<script>
import TRTC from 'trtc-js-sdk';
export default {
    name: 'Play',
    data() {
        return {
            isSupport: false, // 浏览器是否支持
            isAtRoom: false, // 是否已进房

            formData: {
                userId: '',
                roomId: ''
            },
            sdkAppId: '',
            userSig: '',
            client: null,
            remoteStream: null
        };
    },
    async created() {
        // 检测浏览器是否兼容 TRTC
        if (!(await TRTC.checkSystemRequirements())) {
            this.$alert('浏览器不兼容 TRTC，请安装最新版Chrome浏览器');
            return false;
        }
        // 检测浏览器是否支持屏幕分享
        if (!(await TRTC.isScreenShareSupported())) {
            this.$alert('浏览器不支持屏幕分享，请安装最新版Chrome浏览器');
            return false;
        }
        this.isSupport = true;
    },
    destroyed() {
        this.outRoom();
    },
    methods: {
        // 进入房间
        enterRoom() {
            if (this.isSupport) {
                this.$refs.form.validate(valid => {
                    if (valid) {
                        this.getUserSig();
                    }
                });
            } else {
                this.$alert('浏览器环境不支持，请安装最新版Chrome浏览器后重试');
            }
        },
        // 退出房间
        outRoom() {
            if (this.client) {
                this.client.leave().then(() => {
                    // leaving room success
                    console.log('退房成功');
                    if (this.remoteStream) {
                        this.remoteStream.close();
                    }
                    this.remoteStream = null;
                    this.client = null;
                    this.isAtRoom = false;
                });
            }
        },
        // 获取用户签名
        getUserSig() {
            const userId = this.formData.userId;
            this.$axios
                .get(`/屏幕共享DEMO/API/getUserSig.php?userId=${userId}`)
                .then(res => {
                    const { sdkAppId, userSig } = res.data;
                    this.sdkAppId = sdkAppId;
                    this.userSig = userSig;
                    // 创建客户端对象
                    this.createClient();
                })
                .catch(() => {});
        },
        // 创建客户端对象
        createClient() {
            const userId = this.formData.userId;
            const sdkAppId = this.sdkAppId;
            const userSig = this.userSig;
            this.client = TRTC.createClient({
                mode: 'live',
                sdkAppId,
                userId,
                userSig
            });
            console.log('client客户端对象创建成功');
            this.subscribeStream();
            this.joinRoom();
        },
        // 订阅远端流
        subscribeStream() {
            this.client.on('stream-added', event => {
                const remoteStream = event.stream;
                console.log('远端流增加: ' + remoteStream.getId());
                //订阅远端流
                this.client.subscribe(remoteStream);
            });
        },
        // 进房
        joinRoom() {
            const roomId = this.formData.roomId;
            this.client
                .join({ roomId, role: 'audience' })
                .then(() => {
                    console.log('进房成功');
                    this.isAtRoom = true;
                    this.playStream();
                })
                .catch(() => {});
        },
        // 播放远端流
        playStream() {
            this.client.on('stream-subscribed', event => {
                const remoteStream = event.stream;
                // 远端流订阅成功，播放远端音视频流
                console.log('远端流订阅成功，播放远端音视频流', event);
                remoteStream.play('remote_stream');
            });
            this.client.on('stream-removed', event => {
                const remoteStream = event.stream;
                console.log('remoteStream ID: ' + remoteStream.getId() + ' has been removed');
                // 停止播放并删除相应<video>标签
                remoteStream.stop();
                document.getElementById('remote_stream').innerHTML = '';
            });
        }
    }
};
</script>

<style>
.play-page {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: #f5f5f5;
}
.share-form {
    width: 350px;
    margin: auto;
    background-color: #fff;
    padding: 50px;
}
.title {
    font-size: 24px;
    color: #409eff;
    font-weight: bold;
    text-align: center;
    margin-bottom: 20px;
}
.enter-room {
    width: 100%;
    margin-top: 20px;
}
.share-div {
    width: 100%;
    height: 100%;
    text-align: center;
    padding: 100px;
    box-sizing: border-box;
    position: relative;
}
.out-room {
    margin: 10px auto;
}
.remote_stream {
    width: 100%;
    height: calc(100% - 60px);
}
</style>
