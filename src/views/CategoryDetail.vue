<template>
<section class="category-detail">
    <div>
        <div class="category-detail__head">
            <h1 class="hdg" :class="{categiryPassive: editCategiryPassive}">{{ category.title }}</h1>
            <div class="category-detail__edit" :class="{editCategiry: editCategiryActive}">
                <v-text-field label="カテゴリー" v-model="category.title" required></v-text-field>
            </div>
            <div class="category-detail__head-right">
                <v-btn tile text color="success" @click="editCategory()">
                    <v-icon>
                        mdi-pencil
                    </v-icon>
                </v-btn>
                <v-btn tile text color="success" class="category-detail__edit" :class="{editCategiry: editCategiryActive}" @click="editCategorySubmit()">
                    <v-icon>
                        mdi-update
                    </v-icon>
                </v-btn>
            </div>
        </div>
    </div>
    <div v-for="(bookmark, index) in bookmarks" :key="`bookmark-${index}-${bookmark.id}`">
        <div class="category-detail__bookmnark">
        <div class="category-detail__bookmnark-item">
        <div class="category-detail__bookmnark-item-text">
            <img :src="bookmark.url.match(/^https?:\/{2,}(.*?)(?:\/|\?|#|$)/)[0] + 'favicon.ico'" alt="" onerror="this.src='https://1.bp.blogspot.com/-lGOEBC53sNk/WvQHXNpNfiI/AAAAAAABL6I/EF8b66sqJicObf9JkISl-cuvfc5m4EUrACLcBGAs/s800/internet_404_page_not_found_j.png'; this.removeAttribute('onerror')">
            <a :href="bookmark.url">{{ bookmark.title }}</a>
        </div>
        <v-btn tile text color="primary" @click="editBookmark()">
            <v-icon>
                mdi-pencil
            </v-icon>
        </v-btn>
        </div>

        <div class="category-detail__edit" :class="{editBookmark: editBookmarkActive}">
            <v-text-field label="URL" v-model="bookmark.url" required></v-text-field>
            <v-text-field label="タイトル" v-model="bookmark.title" required></v-text-field>
            <div class="category-detail__edit-buttons">
                <v-btn tile text color="primary" @click="updateBookmark(bookmark.id, bookmark)">
                    <v-icon>
                        mdi-update
                    </v-icon>
                </v-btn>
                <v-btn text @click="deleteBookmark(bookmark.id, bookmark.title)" color="error">
                    <v-icon>
                        mdi-delete
                    </v-icon>
                </v-btn>
            </div>
        </div>
        </div>
    </div>
    <v-row class="modal">
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
                    <v-form ref="form">
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
                    </v-form>
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
    // bookmarksStorage: any,
    bookmark: any,
    categoryId: string,
    editCategiryActive: boolean,
    editCategiryPassive: boolean,
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
            // bookmarksStorage: [],
            bookmark: {},
            categoryId: '',
            editCategiryActive: false,
            editCategiryPassive: false,
            editBookmarkActive: false,
        }
    },

    async created() {
        const categoryId = this.$store.getters.getCategoryId(this.$route.params.id);
        if(categoryId) {
            await this.getCategory();
            await this.getBookmark();
        } else {
            this.$router.push('/');
        }

        // const json = await JSON.parse(localStorage.getItem(`${this.$route.params.id}`));
        // this.bookmarksStorage.push(json);
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
                        // this.bookmark.id = bookmark.id;
                        // localStorage.setItem(`${this.$route.params.id}-${this.bookmark.id}`, JSON.stringify(this.bookmark));
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
                            if (bookmark.type === 'added') {
                                this.bookmarks.push(bookmark.doc.data());
                            }
                        })
                    })
            }
        },
        deleteBookmark(id: string, title: string): void {
            if (this.$store.getters.uid && confirm(`${title}削除しますか？`)) {
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
        editCategory(): void {
            if (this.editCategiryActive) {
                this.editCategiryActive = false;
                this.editCategiryPassive = false;
            } else {
                this.editCategiryActive = true;
                this.editCategiryPassive = true;
            }
        },
        editCategorySubmit(): void {
            this.updateCategory({
                id: this.$route.params.id,
                category: this.category
            });
            this.editCategiryActive = false;
            this.editCategiryPassive = false;
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
                    });
            }
        },
        submit(id: string): void {
            this.bookmark.id = this.id;
            this.bookmark.createdAt = this.createdAt;
            this.bookmark.updatedAt = this.updatedAt;
            this.addBookmark();
            (this as any).$refs.form.reset();
            this.dialog = false;
        },
        ...mapActions(['updateCategory']),
    },
});
</script>

<style lang="scss" scoped>
.hdg {
    font-size: 20px;
    font-weight: 600;
    font-family: "Hiragino Kaku Gothic ProN", sans-serif;
    color: #5E5E5E;
}

.category-detail {
    padding: 0 8px;
    max-width: 800px;
    margin: 0 auto;
    img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: 1px solid rgb(242, 241, 241);
    }

    &__head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 8px 0 24px;
    }

    &__head-right {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    &__bookmnark {
        margin-bottom: 16px;

        img {
            display: block;
            margin-right: 8px;
        }
    }

    &__bookmnark-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid rgb(211, 211, 211);
        padding: 8px 0;
        margin-bottom: 16px;
    }

    &__bookmnark-item-text {
        display: flex;
        justify-content: space-between;
        align-items: center;

        a {
            font-family: "Hiragino Kaku Gothic ProN", sans-serif;
            font-size: 16px;
            font-weight: 500;
            color: #5E5E5E;
            text-decoration: none;
        }
    }

    &__edit {
        display: none;
        margin: 0 0 0 auto;
    }
    &__edit-buttons {
        text-align: right;
    }
}

.modal {
    width: 23%;
    margin: 0 0 0 auto;
}

.editCategiry,
.editBookmark {
    display: block;
}
.categiryPassive {
    display: none;
}
</style>
