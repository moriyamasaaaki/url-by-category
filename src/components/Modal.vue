<template>
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
                <span class="headline">カテゴリーの作成</span>
            </v-card-title>
            <v-card-text>
                <v-container>
                    <v-row>
                        <v-col cols="12" sm="6" md="4">
                            <v-text-field label="カテゴリー" v-model="category.title" required></v-text-field>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="dialog = false">
                    キャンセル
                </v-btn>
                <v-btn color="blue darken-1" text @click="submit()">
                    作成
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</v-row>
</template>

<script lang="ts">
import Vue from "vue";
import {
    mapActions
} from "vuex";

export type ModalType = {
    dialog: boolean,
    category: any,
    createdAt: Date,
    updatedAt: Date,
}

export default Vue.extend({
    data(): ModalType {
        return {
            dialog: false,
            category: {},
            createdAt: new Date(),
            updatedAt: new Date(),
        }
    },
    methods: {
        submit(): void {
            this.category.createdAt = this.createdAt;
            this.category.updatedAt = this.updatedAt;
            this.addCategory(this.category);
            this.dialog = false;
        },

        ...mapActions(["addCategory"])
    }
})
</script>
