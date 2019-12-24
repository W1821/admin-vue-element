<template>
    <div>
        <el-upload
                class="avatar-uploader"
                action=""
                :show-file-list="false"
                :before-upload="beforeUpload">
            <div class="img-wrapper">
                <img v-if="croppedImageUrl" :src="croppedImageUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </div>
        </el-upload>

        <el-dialog
                append-to-body
                @close="clickCancel"
                v-loading="isLoading"
                title="上传图片"
                :visible.sync="showDialog"
                top="10vh"
                :close-on-click-modal="false"
                width="50%">
            <el-container>
                <el-main>
                    <div v-if="selectedImageUrl" class="cropper">
                        <vueCropper ref="cropper"
                                    :img="selectedImageUrl"
                                    :info="false"
                                    :fixed="true"
                                    :centerBox="true"
                                    :autoCrop="true"
                                    :autoCropWidth="100"
                                    :autoCropHeight="100"
                                    :fixedNumber="option.fixedNumber"
                                    :fixedBox="false"
                                    :outputSize="1"
                                    outputType="png">
                        </vueCropper>
                    </div>
                </el-main>
            </el-container>

            <div slot="footer">
                <el-button @click="clickCancel">取 消</el-button>
                <el-button type="primary" @click="cropImage">确 定</el-button>
            </div>

        </el-dialog>

    </div>
</template>

<script>
    import NotificationService from '../common/service/NotificationService';
    import {VueCropper} from 'vue-cropper';
    import HttpService from '../common/service/HttpService';

    export default {
        components: {
            VueCropper,
        },
        props: {
            uploadUrl: {
                type: String,
                default: '',
            },
            // 可能是图片地址
            imageUrl: {
                type: String,
                default: '',
            },
        },
        data() {
            return {
                selectedImageUrl: '',
                croppedImageUrl: '',
                option: {
                    fixedNumber: [1, 1],    // 截图框的宽高比例
                },
                showDialog: false,
                isLoading: false,
                reader: new FileReader(),
            };
        },
        watch: {
            imageUrl(val) {
                this.croppedImageUrl = val;
            }
        },
        created() {
            // 初始化裁剪
            this.reader.addEventListener('load', this.fileLoadSuccess);
        },
        beforeDestroy() {
            this.reader.removeEventListener('load', this.fileLoadSuccess);
        },
        methods: {
            clickCancel() {
                this.showDialog = false;
            },
            cropImage() {
                this.$refs.cropper.getCropData((data) => {
                    this.croppedImageUrl = data;
                    if (this.uploadUrl) {
                        // 上传图片，返回图片访问相对地址
                        this.upload();
                    } else {
                        // 裁剪图片返回base64格式字符串
                        this.$emit('onCropSuccess', this.croppedImageUrl);
                        this.clickCancel();
                    }
                });
            },
            openModal(file) {
                // 显示弹窗
                this.showDialog = true;
                // 读取本地文件
                this.reader.readAsDataURL(file);
            },
            beforeUpload(file) {
                const isImage = file.type.startsWith('image');
                if (!isImage) {
                    NotificationService.error('请选择图片格式的文件！');
                } else {
                    this.openModal(file);
                }
                return false;
            },
            /**
             * 上传文件
             */
            upload() {
                this.isLoading = true;
                const body = {file: this.croppedImageUrl};
                HttpService.post(this.uploadUrl, body).then((response) => {
                    this.isLoading = false;
                    if (response.success) {
                        // 返回上传图片的地址
                        this.$emit('onUploadSuccess', response.data);
                        this.clickCancel();
                    }
                });
            },
            fileLoadSuccess() {
                this.selectedImageUrl = this.reader.result;
            },
        }
    };
</script>

<style scoped>
    .cropper {
        width: auto;
        height: 55vh;
    }

    .el-main {
        background-color: #f0f2f5;
        padding-bottom: 0;
        overflow-x: hidden;
        overflow-y: auto;
        min-height: 60vh;
        max-height: 60vh;
    }

    .img-wrapper {
        border: 1px dashed #d9d9d9;
        border-radius: 4px;
        font-size: 30px;
        color: #8c939d;
        width: 110px;
        height: 110px;
        line-height: 100px;
        text-align: center;
    }

    .img-wrapper:hover {
        border-color: #409EFF;
    }

    .avatar {
        width: 94px;
        height: 94px;
        margin-top: 8px;
    }
</style>
