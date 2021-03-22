<template>
  <v-app-bar class="barra" app :clipped-left="$vuetify.breakpoint.lgAndUp">
    <v-app-bar-nav-icon
      color="white"
      @click.stop="$emit('toggle-drawer')"
    ></v-app-bar-nav-icon>
    <vue-typed-js :typeSpeed="60" :strings="['Dashboard IPCA']">
      <h1 class="typing font-weight-bold white--text digitando"></h1>
    </vue-typed-js>

    <v-spacer></v-spacer>
    <v-btn icon>
      <v-icon>mdi-apps</v-icon>
    </v-btn>
    <v-btn icon>
      <v-icon>mdi-bell</v-icon>
    </v-btn>
    <v-btn icon large>
      <v-avatar size="32px" item>
        <v-icon dark>mdi-account-circle</v-icon>
      </v-avatar>
    </v-btn>
  </v-app-bar>
</template>
<script>
import { VueTypedJs } from "vue-typed-js";
export default {
  components: {
    VueTypedJs,
  },
};
</script>
<style scoped>
.barra {
  background: rgb(27, 27, 136);
  background: linear-gradient(
    90deg,
    rgba(27, 27, 136, 1) 0%,
    rgba(0, 212, 255, 1) 100%
  );
}
</style>


