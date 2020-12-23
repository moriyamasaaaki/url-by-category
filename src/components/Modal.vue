<template>
<v-row class="modal">
    <v-btn class="mx-2" dark text color="indigo" @click="dialog = true">
        <v-icon dark>
            mdi-plus
        </v-icon>
    </v-btn>
    <v-dialog v-model="dialog" persistent max-width="600px">
        <v-card>
            <v-card-title>
                <span class="headline">カテゴリーの作成</span>
            </v-card-title>
            <v-card-text>
                <v-form ref="form">
                <v-container>
                    <v-row>
                        <v-col cols="12" sm="6" md="4">
                            <v-text-field label="カテゴリー" v-model="category.title" required></v-text-field>
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
            (this as any).$refs.form.reset();
            this.dialog = false;
        },

        ...mapActions(["addCategory"])
    }
})
</script>