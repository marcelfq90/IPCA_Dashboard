<template>
  <v-navigation-drawer fixed mini-variant v-model="drawer" dark clipped>
    <v-list-item>
      <v-list-item-avatar>
        <v-img src="https://randomuser.me/api/portraits/men/78.jpg"></v-img>
      </v-list-item-avatar>

      <v-list-item-content>
        <v-list-item-title class="caption">$usuario</v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-divider></v-divider>

    <v-list dense>
      <v-list-item v-for="item in items" :key="item.title" link>
        <v-list-item-icon>
          <v-icon @click.stop="dialog = true" color="white">{{item.icon}}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title class="overline">{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-dialog v-model="dialog" max-width="460">
      <v-card>
        <v-card-title class="headline">Dashboard IPCA - IBGE v.1</v-card-title>
        <v-card-text>Desenvolvido por Marcel Ferradás Quadros (c131698)</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false">Fechar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-navigation-drawer>
</template>
<script>
export default {
  data: () => ({
    drawer: false,
    dialog: false,
    items: [{ title: "Info", icon: "mdi-account" }]
  })
};
</script>