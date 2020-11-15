<template>
<section class="category-detail">
    <p>カテゴリー{{ $route.params.id }}</p>
    <div>
        <p>{{ category.title }}</p>
        <v-text-field label="カテゴリー" v-model="category.title" required></v-text-field>
        <v-btn tile color="success" @click="editCategory()">
            <v-icon>
                mdi-pencil
            </v-icon>
        </v-btn>
    </div>

    <div v-for="(bookmark, index) in bookmarks" :key="`bookmark-${index}-${bookmark.id}`">
        <img :src="bookmark.url.match(/^https?:\/{2,}(.*?)(?:\/|\?|#|$)/)[0] + 'favicon.ico'" alt="" onerror="this.src='https://1.bp.blogspot.com/-lGOEBC53sNk/WvQHXNpNfiI/AAAAAAABL6I/EF8b66sqJicObf9JkISl-cuvfc5m4EUrACLcBGAs/s800/internet_404_page_not_found_j.png'; this.removeAttribute('onerror')">
        <a :href="bookmark.url">{{ bookmark.title }}</a>
        <span>{{ bookmark.memo }}</span>
    </div>

    <v-row justify="center">
        <v-dialog v-model="dialog" persistent max-width="600px">
            <template v-slot:activator="{ on, attrs }">
                <v-btn class="mx-2" fab dark color="indigo" v-bind="attrs" v-on="on">
                    <v-icon dark>
                        mdi-plus
                    </v-icon>
                </v-btn>
            </template>
            <v-card>
                <v-card-title>
                    <span class="headline">ブックマークの作成</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12">
                                <v-text-field label="タイトル" v-model="bookmark.title" required></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field label="URL" v-model="bookmark.url" required></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-textarea label="メモ" v-model="bookmark.memo" required></v-textarea>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="dialog = false">
                        キャンセル
                    </v-btn>
                    <v-btn color="blue darken-1" text @click="submit($route.params.id)">
                        作成
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>
</section>
</template>

<script lang="ts">
import Vue from "vue";
import firebase from 'firebase/app';
import {
    mapActions
} from "vuex";

export type CategoryType = {
    category: object,
    dialog: boolean,
    createdAt: Date,
    updatedAt: Date,
    bookmarks: any,
    bookmark: any,
    categoryId: string,

}

export default Vue.extend({
    data(): CategoryType {
        return {
            category: {},
            dialog: false,
            createdAt: new Date(),
            updatedAt: new Date(),
            bookmarks: [],
            bookmark: {},
            categoryId: '',
        }
    },

    async created() {
        await this.getCategory();
        await this.getBookmark();
    },

    computed: {
        user(): string | null {
            return this.$store.getters.uid;
        }
    },

    methods: {
        addBookmark(): void {
            if (this.$store.getters.uid) {
                firebase
                    .firestore()
                    .collection(`users/${this.$store.getters.uid}/categores/${this.$route.params.id}/bookmark`)
                    .add(this.bookmark)
            }
        },
        getBookmark(): void {
            if (this.$store.getters.uid) {
                firebase
                    .firestore()
                    .collection(`users/${this.$store.getters.uid}/categores/${this.$route.params.id}/bookmark`)
                    .orderBy('updatedAt', 'desc')
                    .onSnapshot((bookmarks) => {
                        bookmarks.docChanges().forEach((bookmark) => {
                            this.bookmarks.push(bookmark.doc.data());
                        })
                    })
            }
        },
        getCategory(): void {
            const category = this.$store.getters.getCategoryId(this.$route.params.id);
            if (category) {
                this.category = category;
            }
        },
        editCategory(): void {
            this.updateCategory({
                id: this.$route.params.id,
                category: this.category
            });
        },
        submit(): void {
            this.bookmark.createdAt = this.createdAt;
            this.bookmark.updatedAt = this.updatedAt;
            this.addBookmark();
            this.dialog = false;
        },
        ...mapActions(["updateCategory"])
    }
})
</script>

<style lang="scss" scoped>
.category-detail {
    img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: 1px solid rgb(242, 241, 241);
    }
}
</style>
