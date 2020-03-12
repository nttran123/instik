<template>
    <div class="show-log">
        <span>{{ textMsg }}</span>
    </div>
</template>

<script>
export default {
    name: 'ErrorDialog',
    props: {
        textMsg: {
            type: Object,
            default: null
        }
    },
}
</script>

<style scoped>
    .show-log {
        width: 100%;
        float: left;
        text-align: center;
        padding: 10px;
    }

    .show-log span {
        color: #ff0000;
        font-size: 16px;
    }
</style>>