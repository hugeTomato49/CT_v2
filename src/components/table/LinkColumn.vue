<template>
    <svg class="w-full h-full ">

    </svg>
    

    
</template>


<script>
import { useStore } from 'vuex'
export default {
    name: 'LinkColumn',
    props: ['level'],
    setup(props) {
        //selectionTree，遍历当前层(props.level)的结点，拿到父子id对， id1, id2

        //document.getElementById 拿到父子对id对应的TSCard id是card + id
        //element.offset 拿每个card的左上角的绝对坐标
         //document.getElementByClassName 获取table的绝对坐标作为参考系坐标 并且利用vuex中的cardHeight, plotWidth计算线两个端点在svg中的坐标, svg的宽度是20px
         

        const store = useStore()

    
        


    }
}

</script>


<style>

</style>