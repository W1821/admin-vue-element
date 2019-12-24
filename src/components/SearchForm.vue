<template>
    <el-form :inline="true" :model="searchBody">

        <slot></slot>

        <el-form-item>
            <el-button type="primary" @click="doSearch" plain>查询</el-button>
            <el-button @click="clear" plain>重置</el-button>
        </el-form-item>

    </el-form>
</template>

<script>
    export default {
        props: {
            searchBody: Object,
        },
        methods: {
            doSearch() {
                this.$emit('searchFunction');
            },
            clear() {
                Object.keys(this.searchBody).forEach((key) => {
                    this.searchBody[key] = null;
                });
            },
        }
    };
</script>
