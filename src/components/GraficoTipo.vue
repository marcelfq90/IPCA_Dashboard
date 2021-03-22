<template>
  <v-flex xs6>
    <v-card
      style="overflow-x: hidden; overflow-y: auto; height: 650px"
      class="my-3"
    >
      <v-card-title class="font-weight-black indigo--text darken-5">
        <v-icon large color="indigo darken--5" class="mr-2"
          >mdi-grid-large</v-icon
        >Gráfico por tipo
      </v-card-title>
      <div id="chart">
        <v-col class="d-flex" cols="12" sm="12">
          <v-select
            append-icon="mdi-calendar"
            class="mx-3"
            :items="dataInicial"
            item-text="mesinhos"
            v-model="dtin"
            label="Data inicial"
          >
            <template v-slot:item="{ item }">
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
              />
            </template>
          </v-select>
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
    tipo: "",
    dtin: 201911,
    dtfi: 201912,
    dataInicial: [],
    dataFinal: ["201912"],
    pegaData: [],
    loading: true,
    ariene: [],
  }),
  computed: {
    mesinhos() {
      var novoArray = [];
      var v = [];
      v = this.dadosTabela
        .map((a) => a.am_ref)
        .filter((n) => !isNaN(parseFloat(n)) && isFinite(n))
        .sort((a, b) => b - a);
      let vai = [...new Set(v)].forEach((element) => {
        novoArray.push(
          element.toString().substring(4, 6) +
            "/" +
            element.toString().substring(0, 4)
        );
      });
      return Array.from(novoArray);
    },
    mesinhosValue() {
      var novoArray = [];
      var v = [];
      v = this.dadosTabela
        .map((a) => a.am_ref)
        .filter((n) => !isNaN(parseFloat(n)) && isFinite(n))
        .sort((a, b) => b - a);
      let vai = [...new Set(v)].forEach((element) => {
        novoArray.push(element);
      });
      return novoArray;
    },

    chartOptions() {
      return {
        chart: {
          height: 350,
          type: "line",
          zoom: {
            enabled: false,
          },
        },
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
      const series1 = this.dadosTabela
        .filter(
          (v) =>
            parseFloat(v.am_ref) >= parseFloat(this.dtin) &&
            parseFloat(v.am_ref) <= parseFloat(this.dtfi) &&
            v.grupo === "Índice geral" &&
            v.tipo === "IPCA - Variação mensal"
        )
        .map((a) => parseFloat(a.variacao));
      const series2 = this.dadosTabela
        .filter(
          (v) =>
            parseFloat(v.am_ref) >= parseFloat(this.dtin) &&
            parseFloat(v.am_ref) <= parseFloat(this.dtfi) &&
            v.grupo === "Índice geral" &&
            v.tipo === "IPCA - Variação acumulada no ano"
        )
        .map((a) => parseFloat(a.variacao));
      const series3 = this.dadosTabela
        .filter(
          (v) =>
            parseFloat(v.am_ref) >= parseFloat(this.dtin) &&
            parseFloat(v.am_ref) <= parseFloat(this.dtfi) &&
            v.grupo === "Índice geral" &&
            v.tipo === "IPCA - Variação acumulada em 12 meses"
        )
        .map((a) => parseFloat(a.variacao));

      return [
        {
          name: "IPCA - Variação mensal",
          data: series1,
        },
        {
          name: "IPCA - Variação acumulada no ano",
          data: series2,
        },
        {
          name: "IPCA - Variação acumulada em 12 meses",
          data: series3,
        },
      ];
      //.filter((v, i, s) => s.indexOf(v) === i);
    },
  },
  watch: {
    dados(value) {
      this.dadosTabela = value;
      if (this.dadosTabela) {
        this.loading = false;
      }

      this.escolheDatas();

      //this.updateData();
      //this.dataEscolhida();
      //this.variacao();
      //console.log(this.updateSeries);
    },

    dtin(value) {
      if (value <= this.dtfi) {
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
  },
};
</script>