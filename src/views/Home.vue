<template>
<div class="home">
    <h1>ブックマーク</h1>
    <div class="home__category">
        <div class="home__category-list" v-for="category in categores" :key="category.id" :style="{ border: `thick double ${category.color}` }">
            <ul>
                <router-link tag="li" class="home__category-item" :to="{ name: 'CategoryDetail', params: { id: category.id } }">{{ category.title }}</router-link>
            </ul>
            <v-btn @click="deleteCategoryId(category.id)" class="home__category-item-delete-btn" fab dark small color="primary">
                <v-icon dark>
                    mdi-minus
                </v-icon>
            </v-btn>
        </div>
    </div>
    <Modal />
</div>
</template>

<script lang="ts">
import Vue from "vue";
import Modal from "@/components/Modal";
import {
    mapActions
} from "vuex";

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
        deleteCategoryId(id: string) {
            this.deleteCategory({
                id
            });
        },
        ...mapActions(["deleteCategory"])
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
        position: relative;
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

    &__category-item-delete-btn {
        position: absolute;
        top: -15%;
        right: -7%;
    }
}
</style>
