<template>
<v-app>
    <v-app-bar app color="primary" dark>
        <v-icon dark v-if="this.$route.name === 'CategoryDetail'" @click="back()">
        mdi-arrow-left
        </v-icon>
        <span>キオクン</span>
    </v-app-bar>

    <v-main>
        <router-view></router-view>
    </v-main>
</v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import firebase from "firebase";
import {
    mapActions
} from "vuex";
import { Route } from 'vue-router/types/router';

export default Vue.extend({
    name: 'App',

    data: () => ({
        //
    }),

    created() {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                this.setLoginUser(user);
                this.fetchCategores();
            } else {
                this.logoutUser();
            }
        });
    },

    methods: {
        back(): Promise<Route> {
            return this.$router.push('/');
        },
        ...mapActions([
            "setLoginUser",
            "logoutUser",
            "fetchCategores",
        ])
    }
});
</script>