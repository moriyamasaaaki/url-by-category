<template>
<section class="login">
    <h1 class="hdg">Login/ログイン</h1>
    <div class="login__buttons">
        <div class="login__button-left">
            <v-btn class="login__button" @click="signInGoogle()">
                <img src="@/assets/google_icon.png" width="20" alt="">
                Google
            </v-btn>
        </div>

        <div class="login__button-right">
            <v-btn class="login__button" @click="signInFacebook()">
                <img src="@/assets/facebook.png" width="20" alt="">
                Facebook
            </v-btn>
        </div>
    </div>
</section>
</template>

<script lang="ts">
import Vue from "vue";
import {
    mapActions
} from 'vuex'
export default Vue.extend({
    name: "login",
    methods: {
        signInGoogle(): void {
            this.googleLogin().then(() => {
                this.$router.push('/');
            })
        },
        signInFacebook(): void {
            this.facebookLogin().then(() => {
                this.$router.push('/');
            })
        },
        ...mapActions(['googleLogin', 'facebookLogin'])
    }
});
</script>

<style lang="scss" scoped>
.hdg {
    font-size: 24px;
    font-weight: 600;
    font-family: "Hiragino Kaku Gothic ProN", sans-serif;
    color: #5E5E5E;
    padding-left: 8px;
    text-align: center;
}
.login {
    position: relative;
    height: 100%;
    &__buttons {
        display: flex;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translateY(-50%) translateX(-50%);
        -webkit-transform: translateY(-50%) translateX(-50%);
    }

    &__button {
        margin: 0 80px;
    }

    img {
        display: block;
        margin-right: 8px;
    }
}
</style>
