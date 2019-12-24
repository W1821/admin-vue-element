<template>
    <el-dialog
            @close="afterClose"
            v-loading="isLoading"
            :title="dialogTitle"
            :visible.sync="showDialog"
            top="10vh"
            :close-on-click-modal="false"
            :width="dialogWidth">

        <el-container>
            <el-main :style="styles">
                <el-form class="edit-form" :model="formModel" :rules="formRules" ref="editForm" label-width="20%">
                    <slot></slot>
                </el-form>
            </el-main>
        </el-container>

        <div slot="footer">
            <el-button @click="clickCancel">取 消</el-button>
            <el-button type="primary" @click="clickOk">保 存</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import NotificationService from '../common/service/NotificationService';

    export default {
        props: {
            saveCallback: {
                type: Function,
                default: () => {
                    return Promise.resolve(false);
                }
            },
            formModel: Object,
            formRules: {
                type: Object,
                default: () => {
                    return {};
                },
            },
            dialogTitle: {
                type: String,
                default: '增加/编辑',
            },
            dialogWidth: {
                type: String,
                default: '70%',
            },
            successNoticeMsg: {
                type: String,
                default: '保存成功',
            },
            minHeight: {
                type: String,
                default: '60vh',
            },
        },
        data() {
            return {
                showDialog: false,
                isLoading: false,
                styles: {
                    minHeight: this.minHeight,
                }
            };
        },
        methods: {
            openDialog() {
                this.showDialog = true;
            },
            afterClose() {
                // 重置表单
                this.$refs.editForm.resetFields();
                this.$emit('afterClose');
            },
            /**
             * 点击确认按钮
             */
            clickOk() {
                if (this.isLoading) {
                    return;
                }
                window.console.log('EditModalComponent->clickOk');

                // 先验证
                this.$refs.editForm.validate(valid => {
                    if (!valid) {
                        return false;
                    }
                    // 开始转圈
                    this.isLoading = true;
                    // 调用回调方法
                    this.saveCallback().then((success) => {
                        // 取消转圈
                        this.isLoading = false;
                        if (success) {
                            NotificationService.success(this.successNoticeMsg);
                            this.clickCancel();
                        }
                    });
                });
            },
            /**
             * 关闭弹窗
             */
            clickCancel() {
                this.afterClose();
                this.showDialog = !this.showDialog;
            },

        }
    };
</script>

<style scoped>
    .el-main {
        background-color: #f0f2f5;
        padding-bottom: 0;
        overflow-x: hidden;
        overflow-y: auto;
        max-height: 60vh;
    }

    .edit-form {
        width: 70%;
    }

    .edit-form .el-input {
        width: 70%;
    }

</style>
