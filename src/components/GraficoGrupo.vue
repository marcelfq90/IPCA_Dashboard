<template>
  <v-flex xs6>
    <v-card
      style="scrollbar-width: none; overflow-x: hidden; height: 650px"
      class="my-3"
    >
      <v-card-title class="font-weight-black indigo--text darken-5">
        <v-icon large color="indigo darken--5" class="mr-2">mdi-grid</v-icon
        >Gráfico por grupo
      </v-card-title>
      <div id="chart">
        <v-col class="d-flex" cols="12" sm="12">
          <v-select
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
            append-icon="mdi-grid-large"
            class="mx-3"
            :items="tlista"
            v-model="tipo"
            label="Tipo"
          ></v-select>
          <v-select
            append-icon="mdi-grid"
            class="mx-3"
            :items="glista"
            v-model="grupo"
            label="Grupo"
          ></v-select>
        </v-col>
        <VueApexCharts
          type="line"
          height="450"
          :options="chartOptions"
          :series="updateSeries"
        ></VueApexCharts>
      </div>
    </v-card>
  </v-flex>
</template>
<script>
import VueApexCharts from "vue-apexcharts";
export default {
  props: {
    dados: {
      type: Array,
      required: true,
    },
  },
  components: {
    VueApexCharts,
  },
  data: () => ({
    dadosTabela: [],
    test: [],
    search: "",
    tipo: "IPCA - Variação mensal",
    grupo: "",
    tlista: [],
    glista: [],
    dtin: 201911,
    dtfi: 201912,
    dataInicial: [],
    dataFinal: ["201912"],
    pegaData: [],
    loading: true,
  }),
  computed: {
    chartOptions() {
      return {
        chart: {
          height: 450,
          type: "line",
          zoom: {
            enabled: false,
          },
        },
        colors: [
          "#3F51B5",
          "#C4BBAF",
          "#FEB019",
          "#C5D86D",
          "#775DD0",
          "#33B2DF",
          "#546E7A",
          "#D4526E",
          "#13D8AA",
          "#A5978B",
          "#449DD1",
          "#F86624",
          "#EA3546",
          "#662E9B",
          "#FF4560",
        ],
        dataLabels: {
          enabled: false,
        },
        stroke: {
          width: [5, 7, 5],
          curve: "straight",
          dashArray: [0, 8, 5],
        },

        legend: {
          tooltipHoverFormatter: function (val, opts) {
            return (
              val +
              " - " +
              opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] +
              ""
            );
          },
        },
        markers: {
          size: 0,
          hover: {
            sizeOffset: 6,
          },
        },
        xaxis: {
          categories: this.updateData,
        },
        tooltip: {
          y: [
            {
              title: {
                formatter: function (val) {
                  return val + " (mins)";
                },
              },
            },
            {
              title: {
                formatter: function (val) {
                  return val + " per session";
                },
              },
            },
            {
              title: {
                formatter: function (val) {
                  return val;
                },
              },
            },
          ],
        },
        grid: {
          borderColor: "#f1f1f1",
        },
      };
    },
    updateData() {
      return this.dadosTabela
        .filter(
          (v) =>
            parseFloat(v.am_ref) >= parseFloat(this.dtin) &&
            parseFloat(v.am_ref) <= parseFloat(this.dtfi)
        )
        .map((a) => a.ref)
        .filter((v, i, s) => s.indexOf(v) === i);
    },
    updateSeries() {
      if (this.grupo === "") {
        const series1 = this.dadosTabela
          .filter(
            (v) =>
              parseFloat(v.am_ref) >= parseFloat(this.dtin) &&
              parseFloat(v.am_ref) <= parseFloat(this.dtfi) &&
              v.grupo === "Alimentação e bebidas" &&
              v.tipo === this.tipo
          )
          .map((a) => parseFloat(a.variacao));
        const series2 = this.dadosTabela
          .filter(
            (v) =>
              parseFloat(v.am_ref) >= parseFloat(this.dtin) &&
              parseFloat(v.am_ref) <= parseFloat(this.dtfi) &&
              v.grupo === "Habitação" &&
              v.tipo === this.tipo
          )
          .map((a) => parseFloat(a.variacao));
        const series3 = this.dadosTabela
          .filter(
            (v) =>
              parseFloat(v.am_ref) >= parseFloat(this.dtin) &&
              parseFloat(v.am_ref) <= parseFloat(this.dtfi) &&
              v.grupo === "Artigos de residência" &&
              v.tipo === this.tipo
          )
          .map((a) => parseFloat(a.variacao));
        const series4 = this.dadosTabela
          .filter(
            (v) =>
              parseFloat(v.am_ref) >= parseFloat(this.dtin) &&
              parseFloat(v.am_ref) <= parseFloat(this.dtfi) &&
              v.grupo === "Vestuário" &&
              v.tipo === this.tipo
          )
          .map((a) => parseFloat(a.variacao));
        const series5 = this.dadosTabela
          .filter(
            (v) =>
              parseFloat(v.am_ref) >= parseFloat(this.dtin) &&
              parseFloat(v.am_ref) <= parseFloat(this.dtfi) &&
              v.grupo === "Transportes" &&
              v.tipo === this.tipo
          )
          .map((a) => parseFloat(a.variacao));
        const series6 = this.dadosTabela
          .filter(
            (v) =>
              parseFloat(v.am_ref) >= parseFloat(this.dtin) &&
              parseFloat(v.am_ref) <= parseFloat(this.dtfi) &&
              v.grupo === "Saúde e cuidados pessoais" &&
              v.tipo === this.tipo
          )
          .map((a) => parseFloat(a.variacao));
        const series7 = this.dadosTabela
          .filter(
            (v) =>
              parseFloat(v.am_ref) >= parseFloat(this.dtin) &&
              parseFloat(v.am_ref) <= parseFloat(this.dtfi) &&
              v.grupo === "Despesas pessoais" &&
              v.tipo === this.tipo
          )
          .map((a) => parseFloat(a.variacao));
        const series8 = this.dadosTabela
          .filter(
            (v) =>
              parseFloat(v.am_ref) >= parseFloat(this.dtin) &&
              parseFloat(v.am_ref) <= parseFloat(this.dtfi) &&
              v.grupo === "Educação" &&
              v.tipo === this.tipo
          )
          .map((a) => parseFloat(a.variacao));
        const series9 = this.dadosTabela
          .filter(
            (v) =>
              parseFloat(v.am_ref) >= parseFloat(this.dtin) &&
              parseFloat(v.am_ref) <= parseFloat(this.dtfi) &&
              v.grupo === "Comunicação" &&
              v.tipo === this.tipo
          )
          .map((a) => parseFloat(a.variacao));

        return [
          {
            name: "Alimentação e bebidas",
            data: series1,
          },
          {
            name: "Habitação",
            data: series2,
          },
          {
            name: "Artigos de residência",
            data: series3,
          },
          {
            name: "Vestuário",
            data: series4,
          },
          {
            name: "Transportes",
            data: series5,
          },
          {
            name: "Saúde e cuidados pessoais",
            data: series6,
          },
          {
            name: "Despesas pessoais",
            data: series7,
          },
          {
            name: "Educação",
            data: series8,
          },
          {
            name: "Comunicação",
            data: series9,
          },
        ];
        //.filter((v, i, s) => s.indexOf(v) === i);
      } else {
        const series1 = this.dadosTabela
          .filter(
            (v) =>
              parseFloat(v.am_ref) >= parseFloat(this.dtin) &&
              parseFloat(v.am_ref) <= parseFloat(this.dtfi) &&
              v.grupo === this.grupo &&
              v.tipo === this.tipo
          )
          .map((a) => parseFloat(a.variacao));
        return [
          {
            name: this.grupo,
            data: series1,
          },
        ];
      }
    },
  },
  watch: {
    dados(value) {
      this.dadosTabela = value;
      if (this.dadosTabela) {
        this.loading = false;
      }

      this.escolheDatas();
      this.escolheTipo();
      this.escolheGrupo();
      //this.updateData();
      //this.dataEscolhida();
      //this.variacao();
      //console.log(this.glista);
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
    },
    tipo(value) {
      this.tipo = value;
    },
    grupo(value) {
      this.grupo = value;
    },
    updateData(value) {
      //console.log(this.categories);
    },
  },
  methods: {
    escolheDatas() {
      var test = this.dadosTabela
        .map((a) => parseInt(a.am_ref))
        .filter((n) => !isNaN(parseFloat(n)) && isFinite(n))
        .sort((a, b) => b - a);
      let unique = [...new Set(test)];
      this.dataInicial = unique;
      this.dataFinal = [201912];
    },
    escolheTipo() {
      var test = this.dadosTabela.map((a) => a.tipo);
      let unique = [...new Set(test)];
      this.tlista = unique;
    },
    escolheGrupo() {
      var test = this.dadosTabela.map((a) => a.grupo);
      let unique = [...new Set(test)];
      this.glista = unique;
      this.glista.unshift("");
    },
  },
};
</script>