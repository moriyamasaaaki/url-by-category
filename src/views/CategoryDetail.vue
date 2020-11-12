<template>
<section>
    <p>カテゴリー{{ $route.params.id }}</p>
    <div>
        <p>{{ category.title }}</p>
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

export type CategoryType = {
    category: object,
    dialog: boolean,
    createdAt: Date,
    updatedAt: Date,
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
            bookmark: {},
            categoryId: '',
        }
    },

    async created() {
        await this.getCategory();
    },

    computed: {
        user(): any {
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
        getCategory(): void {
            const category = this.$store.getters.getCategoryId(this.$route.params.id);
            if (category) {
                this.category = category;
            }
        },
        submit(): void {
            this.bookmark.createdAt = this.createdAt;
            this.bookmark.updatedAt = this.updatedAt;
            this.addBookmark();
            this.dialog = false;
        },
    }
})
</script>
