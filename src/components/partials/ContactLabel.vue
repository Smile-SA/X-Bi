<template>
   <div class="pull-left info">
     <div>
       <p class="white">{{ displayName }}</p>
      </div>
      <span class="text-muted">{{ email }}</span>
   </div>
</template>
<script>
    export default {
        name: 'ContactLabel',
        props: ['displayName', 'email'],
    }
</script>
