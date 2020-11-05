<template>
<section class="login">
    <v-btn @click="signInGoogle()" color="primary">
        Googleログイン
    </v-btn>
    <v-btn @click="signInFacebook()" color="indigo">
        Facebookログイン
    </v-btn>
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
