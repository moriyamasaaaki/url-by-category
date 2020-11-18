<template>
<section class="category-detail">
    <div>
        <p class="category-detail__title">{{ category.title }}</p>
        <v-btn tile color="success" @click="editCategory()" v-if="!editCategiryActive">
            <v-icon>
                mdi-pencil
            </v-icon>
        </v-btn>
        <div class="category-detail__edit" :class="{editCategiry: editCategiryActive}">
            <v-text-field label="カテゴリー" v-model="category.title" required></v-text-field>
            <v-btn tile color="success" @click="editCategorySubmit()">
                <v-icon>
                    mdi-update
                </v-icon>
            </v-btn>
            <v-btn tile color="error" @click="notEditCategory()">
                <v-icon>
                    mdi-backspace
                </v-icon>
            </v-btn>
        </div>
    </div>

    <div v-for="(bookmark, index) in bookmarks" :key="`bookmark-${index}-${bookmark.id}`">
        <img :src="bookmark.url.match(/^https?:\/{2,}(.*?)(?:\/|\?|#|$)/)[0] + 'favicon.ico'" alt="" onerror="this.src='https://1.bp.blogspot.com/-lGOEBC53sNk/WvQHXNpNfiI/AAAAAAABL6I/EF8b66sqJicObf9JkISl-cuvfc5m4EUrACLcBGAs/s800/internet_404_page_not_found_j.png'; this.removeAttribute('onerror')">
        <a :href="bookmark.url">{{ bookmark.title }}</a>
        <span>{{ bookmark.memo }}</span>
        <v-btn tile color="primary" @click="editBookmark()">
            <v-icon>
                mdi-pencil
            </v-icon>
        </v-btn>

        <div class="category-detail__edit" :class="{editBookmark: editBookmarkActive}">
            <v-text-field label="URL" v-model="bookmark.url" required></v-text-field>
            <v-text-field label="タイトル" v-model="bookmark.title" required></v-text-field>
            <v-btn tile color="success" @click="updateBookmark(bookmark.id, bookmark)">
                <v-icon>
                    mdi-update
                </v-icon>
            </v-btn>
            <v-btn tile color="error" @click="deleteBookmark(bookmark.id)">
                <v-icon>
                    mdi-backspace
                </v-icon>
            </v-btn>
        </div>
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
    id: string,
    category: object,
    dialog: boolean,
    createdAt: Date,
    updatedAt: Date,
    bookmarks: any,
    bookmark: any,
    categoryId: string,
    editCategiryActive: boolean,
    editBookmarkActive: boolean,

}

export default Vue.extend({
    data(): CategoryType {
        return {
            id: '',
            category: {},
            dialog: false,
            createdAt: new Date(),
            updatedAt: new Date(),
            bookmarks: [],
            bookmark: {},
            categoryId: '',
            editCategiryActive: false,
            editBookmarkActive: false,
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
        addBookmark() {
            if (this.$store.getters.uid) {
                let self = this;
                let db = firebase.firestore().collection(`users/${this.$store.getters.uid}/categores/${this.$route.params.id}/bookmark`);
                    db.add(this.bookmark)
                    .then((bookmark) => {
                        db
                        .doc(bookmark.id)
                        .set({
                            id: bookmark.id
                        },{ merge: true })
                    })
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
        deleteBookmark(id: string) {
            if (this.$store.getters.uid) {
                firebase
                    .firestore()
                    .collection(`users/${this.$store.getters.uid}/categores/${this.$route.params.id}/bookmark`)
                    .doc(id)
                    .delete()
                    .then(() => {
                        const index = this.bookmarks.findIndex((bookmark: any) => {
                            return bookmark.id === id;
                        });
                        this.bookmarks.splice(index, 1);
                    })
            }
        },
        getCategory(): void {
            const category = this.$store.getters.getCategoryId(this.$route.params.id);
            if (category) {
                this.category = category;
            }
        },
        editCategory(): boolean {
            return this.editCategiryActive = true;
        },
        editCategorySubmit(): void {
            this.updateCategory({
                id: this.$route.params.id,
                category: this.category
            });
            this.editCategiryActive = false;
        },
        notEditCategory(): boolean {
            return this.editCategiryActive = false;
        },
        editBookmark(id: string): void {
            if(this.editBookmarkActive) {
                this.editBookmarkActive = false;
            } else {
                this.editBookmarkActive = true;
            }
        },
        updateBookmark(id: string, bookmark: any): void {
            console.log(bookmark)
            if (this.$store.getters.uid) {
                let self = this;
                firebase
                    .firestore()
                    .collection(`users/${this.$store.getters.uid}/categores/${this.$route.params.id}/bookmark`)
                    .doc(id)
                    .update({
                        id: bookmark.id,
                        title: bookmark.title,
                        url: bookmark.url,
                        updatedAt: new Date()
                    })
                    .then(() => {
                        console.log('aaaa')
                        const index = this.bookmarks.findIndex((bookmark: any) => {
                            return bookmark.id === id;
                        });
                        this.bookmarks[index];
                        console.log(this.bookmarks[index])
                        this.bookmarks.splice(index, 1);
                    })
                    .catch(() => {
                        console.log('error')
                    })
            }
        },
        submit(id: string): void {
            this.bookmark.id = this.id;
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

    &__edit {
        display: none;
    }
}

.editCategiry,
.editBookmark {
    display: block;
}
</style>
