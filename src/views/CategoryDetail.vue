<template>
<div>
    <p>カテゴリー{{ $route.params.id }}</p>
    <div>
        <p>{{ category.title }}</p>
    </div>
</div>
</template>

<script lang="ts">
export type CategoryType = {
    category: object,
}

export default {
    data(): CategoryType {
        return {
            category: {},
        }
    },

    async created() {
        await this.getCategory();
    },

    methods: {
        getCategory(): void {
            const category = this.$store.getters.getCategoryId(this.$route.params.id);
            if (category) {
                this.category = category;
            }

        }
    }
}
</script>
