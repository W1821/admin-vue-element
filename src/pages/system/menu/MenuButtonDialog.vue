<template>
    <el-dialog
            append-to-body
            @close="afterClose"
            title="编辑"
            :visible.sync="showDialog"
            top="10vh"
            :close-on-click-modal="false"
            width="40%">

        <div class="radio-button-type">
            <el-radio-group v-model="buttonType" @change="changeButtonType">
                <el-radio-button label="search-查询"><i class="el-icon-delete">查询</i></el-radio-button>
                <el-radio-button label="add-增加"><i class="el-icon-delete">增加</i></el-radio-button>
                <el-radio-button label="edit-编辑"><i class="el-icon-delete">编辑</i></el-radio-button>
                <el-radio-button label="delete-删除"><i class="el-icon-delete">删除</i></el-radio-button>
                <el-radio-button label="other-其他"><i class="el-icon-delete">其他</i></el-radio-button>
            </el-radio-group>
        </div>

        <el-form class="button-form" :model="button" :rules="rules" ref="buttonForm" label-width="100px">
            <el-form-item prop="buttonName" label="按钮名称">
                <el-input v-model="button.buttonName" placeholder="请输入按钮名称"></el-input>
            </el-form-item>
            <el-form-item prop="code" label="按钮标识">
                <el-input v-model="button.code" placeholder="请输入按钮标识"></el-input>
            </el-form-item>
            <el-form-item prop="actions" label="注册请求">
                <el-input v-model="button.actions" placeholder="请输入注册请求"></el-input>
            </el-form-item>
        </el-form>

        <div slot="footer">
            <el-button @click="clickCancel">取 消</el-button>
            <el-button type="primary" @click="clickOk">保 存</el-button>
        </div>

    </el-dialog>
</template>

<script>
    import {Button} from './menu.model';

    export default {
        props: {
            buttonBack: Function
        },
        data() {
            return {
                showDialog: false,
                buttonType: null,
                index: null,
                button: new Button(),
                rules: {
                    buttonName: [
                        {required: true, message: '请输入按钮名称', trigger: 'blur'},
                    ],
                    code: [
                        {required: true, message: '请输入按钮标识', trigger: 'blur'}
                    ],
                },
            };
        },
        methods: {
            openDialog(index, button) {
                // 修改按钮
                if (button) {
                    this.index = index;
                    this.button = button;
                    this.buttonType = button.code + '-' + button.buttonName;
                }
                this.showDialog = true;
            },
            afterClose() {
                this.button = new Button();
            },
            changeButtonType(type) {
                const arr = type.split('-');
                this.button.code = arr[0];
                this.button.buttonName = arr[1];
            },
            clickOk() {
                // 先验证
                this.$refs.buttonForm.validate(valid => {
                    if (!valid) {
                        return false;
                    }
                    // 返回编辑的按钮
                    this.$emit('clickOk', this.button, this.index);
                    this.clickCancel();
                });
            },
            clickCancel() {
                this.showDialog = false;
                // 清空表单
                this.afterClose();
                this.index = null;
            }
        }
    };
</script>

<style scoped>
    .radio-button-type {
        text-align: center;
        margin: 0 auto 10px;
    }
</style>
