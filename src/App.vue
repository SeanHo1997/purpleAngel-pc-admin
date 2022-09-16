<template>
  <router-view></router-view>
</template>

<style>
.btn {
  @apply bg-purple-500 text-indigo-50 px-1 py-2 rounded-full hover:(bg-purple-900) transition-all duration-500 focus:(ring-8 ring-purple-900);
}
/* #nprogress .bar {
  background-color: #f4f4f4 !important;
  height: 50px !important;
} */
body {
  @apply bg-gray-100;
}

::-webkit-scrollbar {
  width: 3px !important;
}
</style>
