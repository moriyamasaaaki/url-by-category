<template>
<div class="home">
    <h1>ブックマーク</h1>
    <div class="home__category">
        <div class="home__category-list" v-for="category in categores" :key="category.id" :style="{ border: `thick double ${category.color}` }">
            <ul>
                <router-link tag="li" class="home__category-item" :to="{ name: 'CategoryDetail', params: { id: category.id } }">{{ category.title }}</router-link>
            </ul>
        </div>
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
            categores: [],
        }
    },

    async created() {
        await this.getCategores();

    },

    methods: {
        getCategores(): void {
            this.categores = this.$store.state.categores;
        },
    }
})
</script>

<style lang="scss" scoped>
.home {
    &__category {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        flex-wrap: wrap;
        width: 100%;
    }

    ul {
        padding: 0;
    }

    &__category-list {
        width: 48%;
        border-radius: 8px;
        margin-bottom: 8px;
    }

    &__category-item {
        list-style: none;
        text-align: center;
        font-weight: 600;
        color: #5E5E5E;
        padding: 40px 8px;
    }
}
</style>
