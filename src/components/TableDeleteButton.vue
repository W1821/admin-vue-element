<template>
    <el-popconfirm
            @onConfirm="ok"
            placement="top"
            confirmButtonText='好的'
            cancelButtonText='不用了'
            icon="el-icon-info"
            iconColor="red"
            :title="title">
        <el-button slot="reference" size="small" type="danger" icon="el-icon-delete">删除</el-button>
    </el-popconfirm>
</template>

<script>
    export default {
        props: {
            row: Object,
            title: String,
        },
        methods: {
            ok() {
                this.$emit('onConfirm', this.row);
            }
        }
    };
</script>

<style scoped>

</style>
