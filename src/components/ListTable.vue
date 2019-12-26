<template>
    <div>
        <!-- 表格 -->
        <el-table :data="tableData"
                  :height="tableHeight"
                  :row-key="rowKey"
                  :default-expand-all="expandAll"
                  :border="border"
                  :tree-props="{children: 'children'}"
                  id="tableList"
                  :max-height="maxHeight"
                  class="w100">
            <slot></slot>
        </el-table>
        <!-- 分页 -->
        <template v-if="pagination">
            <el-pagination
                    @current-change="onPageIndexChange"
                    :current-page.sync="pageBody.index"
                    :page-size.sync="pageBody.size"
                    :total="totalRows"
                    class="pagination"
                    background
                    layout="prev, pager, next">
            </el-pagination>
        </template>
    </div>
</template>

<script>
    export default {
        props: {
            // 显示的数据
            tableData: Array,
            // 是否默认展开所有行，当 Table 包含展开行存在或者为树形表格时有效
            expandAll: {
                type: Boolean,
                default: false,
            },
            // 是否带有纵向边框
            border: {
                type: Boolean,
                default: true,
            },
            // 行数据的 Key，用来优化 Table 的渲染；在使用 reserve-selection 功能与显示树形数据时，该属性是必填的。
            rowKey: {
                type: String,
                default: 'id',
            },
            // Table 的最大高度。合法的值为数字或者单位为 px 的高度。
            maxHeight: {
                type: [String, Number],
                default: 570,
            },
            // 是否显示分页组件
            pagination: {
                type: Boolean,
                default: true,
            },
            // 当前页码，每页显示条目个数
            pageBody: {
                type: Object,
                default: () => {
                    return {
                        index: 1,
                        size: 8,
                    };
                }
            },
            // 总条目数
            totalRows: Number,
        },
        data() {
            return {
                tableHeight: undefined,
            };
        },
        mounted() {
            // 定义窗口大小变更通知事件
            window.addEventListener('resize', this.onResize, false);
        },
        destroyed() {
            window.removeEventListener('resize', this.onResize);
        },

        methods: {
            onPageIndexChange() {
                // 刷新页面
                this.$emit('onPageIndexChange');
            },
            computeTableHeight() {
                const otherHeight = this.pagination ? 403 : 343;
                this.tableHeight = window.document.body.clientHeight - otherHeight;
            },
            onResize() {
                this.computeTableHeight();
            }
        }
    };
</script>

<style scoped>

</style>
