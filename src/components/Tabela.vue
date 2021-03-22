<template>
  <v-card>
    <v-card-title class="font-weight-black indigo--text darken-5">
      <v-icon large color="indigo darken--5" class="mr-2"
        >mdi-table-large</v-icon
      >TABELA IPCA
      <v-spacer></v-spacer>
      <v-flex xs3>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Pesquisar"
          single-line
          hide-details
        ></v-text-field>
      </v-flex>
    </v-card-title>
    <v-col class="d-flex">
      <v-select
        dense
        append-icon="mdi-calendar"
        class="mx-3"
        :items="dataInicial"
        v-model="dtin"
        label="Data inicial"
        ><template v-slot:item="{ item }">
          <div
            v-html="
              item.toString().substring(4, 6) +
              '/' +
              item.toString().substring(0, 4)
            "
          />
        </template>
        <template v-slot:selection="{ item }">
          <div
            v-html="
              item.toString().substring(4, 6) +
              '/' +
              item.toString().substring(0, 4)
            "
          /> </template
      ></v-select>
      <v-select
        dense
        append-icon="mdi-calendar"
        class="mx-3"
        :items="dataFinal"
        v-model="dtfi"
        label="Data final"
        ><template v-slot:item="{ item }">
          <div
            v-html="
              item.toString().substring(4, 6) +
              '/' +
              item.toString().substring(0, 4)
            "
          />
        </template>
        <template v-slot:selection="{ item }">
          <div
            v-html="
              item.toString().substring(4, 6) +
              '/' +
              item.toString().substring(0, 4)
            "
          /> </template
      ></v-select>
      <v-select
        dense
        append-icon="mdi-grid-large"
        class="mx-3"
        :items="tlista"
        v-model="tipo"
        label="Tipo"
      ></v-select>
      <v-select
        dense
        append-icon="mdi-grid"
        class="mx-3"
        :items="glista"
        v-model="grupo"
        label="Grupo"
      ></v-select>
      <download-excel type="csv" :data="updateTable">
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              v-on="on"
              x-large
              class="mx-3 blue--text darken-3 text--right"
              >mdi-file</v-icon
            > </template
          >Baixar tabela em CSV
        </v-tooltip>
      </download-excel>
      <download-excel :data="updateTable">
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              v-on="on"
              x-large
              class="mx-3 green--text darken-3 text--right"
              >mdi-file-excel</v-icon
            > </template
          >Baixar tabela em Excel
        </v-tooltip>
      </download-excel>
    </v-col>
    <v-data-table
      :footer-props="{
        'items-per-page-text': 'Registros por página: ',
        'items-per-page-options': [10, 20, 30, 40],
      }"
      :items-per-page="40"
      :loading="loading"
      dense
      loading-text="Carregando... Aguarde"
      :headers="headers"
      :items="updateTable"
      :search="search"
      :expanded.sync="expanded"
      group-by="tipo"
      item-key="key"
      class="elevation-1"
    >
      <template v-slot:item.test="{ item }">
        <v-icon :color="colorir(item.variacao)" dark>{{
          icone(item.variacao)
        }}</v-icon>
      </template>
      <template v-slot:item.variacao="{ item }">
        <span>{{ item.variacao.toLocaleString() + "%" }}</span>
      </template>
      <template v-slot:item.action="{ item }">
        <v-icon small class="mr-2" title="title" @click="clickOnTheItem(item)"
          >fas fa-plus</v-icon
        >
      </template>
      <template v-slot:group.header="{ items, isOpen, toggle }">
        <th colspan="100%">
          <v-btn text icon small color="white" @click="toggle">
            <v-icon color="black">{{
              isOpen ? "mdi-minus" : "mdi-plus"
            }}</v-icon>
          </v-btn>
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <span
                v-on="on"
                style="font-size: 16px; font-weight: bold; margin-left: 342px"
                class="pl-4 force"
              >
                {{
                  items[0].tipo
                    .replace("acumulada", "")
                    .replace("IPCA - ", "")
                    .replace("no", "")
                    .replace("em", "")
                    .replace("12 meses", "12m")
                    .replace("Variação mensal", "Variação men")
                    .replace("Peso mensal", "Peso Mensal⠀")
                }}
              </span>
            </template>
            <span>{{ items[0].tipo.replace("acumulada", "") }}</span>
          </v-tooltip>
          <span style="margin-left: 756px" class="pl-16 subtitle-1">{{
            items[0].variacao.toLocaleString() + "%"
          }}</span>
          <v-icon
            style="margin-left: 32px"
            :color="colorir(items[0].variacao)"
            dark
            >{{ icone(items[0].variacao) }}</v-icon
          >
        </th>
      </template>
    </v-data-table>
  </v-card>
</template>
    
    

<script>
import JsonExcel from "vue-json-excel";
//import { indexWhere } from "@/helpers/helpers.js";
export default {
  components: {
    JsonExcel,
  },
  props: {
    dados: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
    dadosTabela: [],
    expanded: [],
    groupSortDescending: false,
    test: [],
    search: "",
    grupo: "",
    glista: [],
    tipo: "",
    tlista: [],
    dtin: 201912,
    dtfi: 201912,
    dataInicial: [],
    dataInicialTexto: [],
    dataFinal: ["201912"],
    dataFinalTexto: [],
    loading: true,
    headers: [
      { text: "Ano/Mês", value: "ref" },
      { text: "Grupo", value: "grupo" },
      { text: "Valor/Variação", value: "variacao", align: "right" },
      { text: "Var", value: "test", align: "left" },
      { text: "", value: "expand", align: "end" },
    ],
  }),
  computed: {
    updateTable() {
      return this.dadosTabela
        .filter(
          (v) =>
            parseFloat(v.am_ref) >= parseFloat(this.dtin) &&
            parseFloat(v.am_ref) <= parseFloat(this.dtfi)
        )
        .filter((v) => (this.tipo === "" ? v.tipo : v.tipo === this.tipo))
        .filter((v) => (this.grupo !== "" ? v.grupo === this.grupo : v.grupo));
    },
  },
  watch: {
    dados(value) {
      this.dadosTabela = value;
      if (this.dadosTabela) {
        this.loading = false;
      }

      this.escolheDatas();
      this.dataInicialNomes();
      this.escolheGrupo();
      this.escolheTipo();
      //this.variacao();
    },

    dtin(value) {
      if (value < this.dtfi) {
        this.dtfi = this.dtfi;
        this.dataFinal = this.dataInicial.filter(
          (v) => parseFloat(v) >= parseFloat(value)
        );
      }
      if (value > this.dtfi) {
        this.dtfi = value;
        this.dataFinal = this.dataInicial.filter(
          (v) => parseFloat(v) >= parseFloat(this.dtfi)
        );
      }
      if (value === this.dtfi) {
        this.dtfi = this.dtfi;
      }
    },
    grupo(value) {
      this.grupo = value;
    },
    tipo(value) {
      this.tipo = value;
    },
    updateTable(value) {
      //console.log(value);
    },
  },

  methods: {
    //blacklist() {
    //  var i = 0;
    //  this.dadosTabela
    //    //.filter(n => !isNaN(parseFloat(n.am_ref)) && isFinite(n.am_ref))
    //    //.sort((a, b) => parseFloat(b.am_ref) - parseFloat(a.am_ref))
    //    .forEach((element, y) => {
    //      element["key"] = i;
    //      element["grupo"] = element.D2N + element.D4N;
    //      element["vrant"] = y + 1;
    //      delete element.D1C;
    //      delete element.NN;
    //      delete element.NC;
    //      delete element.D1N;
    //      delete element.D2C;
    //      delete element.MC;
    //      i++;
    //    });
    //},

    colorir(variacao) {
      if (variacao > 0) return "green";
      else if (variacao === 0) return "orange";
      else return "red";
    },
    icone(variacao) {
      if (variacao > 0) return "mdi-chevron-up";
      else if (variacao === 0) return "mdi-minus-circle-outline";
      else return "mdi-chevron-down";
    },
    escolheDatas() {
      var test = this.dadosTabela
        .map((a) => parseInt(a.am_ref))
        .filter((n) => !isNaN(parseFloat(n)) && isFinite(n))
        .sort((a, b) => b - a);
      let unique = [...new Set(test)];
      this.dataInicial = unique;
      this.dataFinal = [201912];
      //this.dataInicialTexto =
    },
    RevertData(string) {
      parseFloat(
        string.substr(0, 4) +
          this.obterNumeros(string.replace("/", "").substr(4, 2))
      );
    },
    obterMeses(string) {
      switch (string) {
        case "12":
          return "Dez";
        case "11":
          return "Nov";
        case "10":
          return "Out";
        case "09":
          return "Set";
        case "08":
          return "Ago";
        case "07":
          return "Jul";
        case "06":
          return "Jun";
        case "05":
          return "Mai";
        case "04":
          return "Abr";
        case "03":
          return "Mar";
        case "02":
          return "Fev";
        case "01":
          return "Jan";
        default:
          return "dez";
      }
    },
    obterNumeros(string) {
      switch (string) {
        case "Dez":
          return "12";
        case "Nov":
          return "11";
        case "out":
          return "10";
        case "Set":
          return "09";
        case "Ago":
          return "08";
        case "Jul":
          return "07";
        case "Jun":
          return "06";
        case "Mai":
          return "05";
        case "Abr":
          return "04";
        case "Mar":
          return "03";
        case "Fev":
          return "02";
        case "Jan":
          return "01";
        default:
          return "12";
      }
    },
    dataInicialNomes() {
      var test = this.dadosTabela
        .map(
          (a) =>
            String(a.am_ref).substr(0, 4) +
            "/" +
            this.obterMeses(String(a.am_ref).substr(4, 2))
        )
        .sort((a, b) => b - a);
      let unique = [...new Set(test)];
      this.dataInicialTexto = unique.reverse();
      //console.log(this.dataInicialTexto);
      //this.dataInicialTexto =
    },
    escolheGrupo() {
      var test = this.dadosTabela.map((a) => a.grupo);
      let unique = [...new Set(test)];
      this.glista = unique;
      this.glista.unshift("");
    },
    escolheTipo() {
      var test = this.dadosTabela.map((a) => a.tipo);
      let unique = [...new Set(test)];
      this.tlista = unique;
      this.tlista.unshift("");
      //console.log(this.dadosTabela);
    },
  },
};
</script>
<style>
.force {
  font-family: Consolas, Monaco, Lucida Console, Liberation Mono,
    DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
}
</style>