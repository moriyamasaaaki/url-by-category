<template>
<div class="home">
    <h1>ブックマーク</h1>
    <div v-for="category in categores" :key="category.id">
        <ul>
            <li>{{ category.id }}</li>
            <li>{{ category.title }}</li>
        </ul>
    </div>
    <Modal />
</div>
</template>

<script lang="ts">
import Vue from "vue";
import Modal from "@/components/Modal";

export type CategoryType = {
    categores: any[],
}

export default Vue.extend({
    name: 'Home',
    components: {
        Modal
    },

    data(): CategoryType {
        return {
            categores: []
        }
    },

    async created() {
        await this.getCategores();
    },

    methods: {
        getCategores(): void {
            this.categores = this.$store.state.categores;
        }
    }
})
</script>
