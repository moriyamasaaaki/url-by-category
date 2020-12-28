<template>
<div class="home">
    <div class="home__header">
        <h1 class="hdg">Category</h1>
        <div class="home__header-right">
            <Modal />
            <v-btn text dark small color="primary" @click="deleteActive()">
                <v-icon dark>
                    mdi-delete
                </v-icon>
            </v-btn>            
        </div>
    </div>
    <div class="home__category">
        <h2 class="home__category-error-title" v-if="!categores.length">何もありません...。</h2>
        <div class="home__category-list" v-for="(category, index) in categores" :key="`category-${index}-${category.id}`" :style="{ border: `thick double ${category.color}` }">
            <ul>
                <router-link tag="li" class="home__category-item" :to="{ name: 'CategoryDetail', params: { id: category.id } }">
                    <v-icon
                        color="blue darken-2"
                        class="icon"
                        >
                        mdi-folder
                    </v-icon>
                    {{ category.title }}
                </router-link>
            </ul>
            <v-btn @click="deleteCategoryId(category.id, category.title)" class="home__category-item-delete-btn" :class="{deleteBookmark: deleteBookmarkActive}" fab dark small color="primary">
                <v-icon dark>
                    mdi-minus
                </v-icon>
            </v-btn>
        </div>
    </div>
</div>
</template>

<script lang="ts">
import Vue from "vue";
import Modal from "@/components/Modal.vue";
import {
    mapActions
} from "vuex";

export type CategoryType = {
    categores: any[],
    deleteBookmarkActive: boolean,
}

export default Vue.extend({
    name: 'Home',
    components: {
        Modal
    },

    data(): CategoryType {
        return {
            categores: [],
            deleteBookmarkActive: false,
        }
    },

    async created() {
        await this.getCategores();

    },

    methods: {
        getCategores(): void {
            this.categores = this.$store.state.categores;
        },
        deleteCategoryId(id: string, title: string) {
            if (this.$store.getters.uid && confirm(`${title}削除しますか？`)) {
                this.deleteCategory({
                    id
                });
            }
        },
        deleteActive() {
            if (this.deleteBookmarkActive) {
                this.deleteBookmarkActive = false;
            } else {
                this.deleteBookmarkActive = true;
            }
        },
        ...mapActions(["deleteCategory"])
    }
})
</script>

<style lang="scss" scoped>
.hdg {
    font-size: 24px;
    font-weight: 600;
    font-family: "Hiragino Kaku Gothic ProN", sans-serif;
    color: #5E5E5E;
    padding-left: 8px;
}
.home {
    position: relative;
    max-width: 800px;
    margin: 0 auto;
    ul {
        padding: 0;
    }

    &__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 8px 0 24px;
    }

    &__header-right {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    &__category-error-title {
        font-size: 20px;
        font-weight: 600;
        font-family: "Hiragino Kaku Gothic ProN", sans-serif;
        color: #5E5E5E;
        text-align: center;
        margin-top: 80px;
    }

    &__category-list {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid rgb(211, 211, 211);
        padding: 24px 8px;
    }

    &__category-item {
        display: flex;
        align-items: center;
        list-style: none;
        text-align: center;
        font-weight: 500;
        font-size: 16px;
        font-family: "Hiragino Kaku Gothic ProN", sans-serif;
        color: #5E5E5E;
        cursor: pointer;
    }
    &__category-item-delete-btn {
        display: none;
    }
}

.icon {
    margin-right: 4px;
}
.deleteBookmark {
    display: block;
}
</style>
