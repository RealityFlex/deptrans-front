<template>
  <apexchart :options="chartOptions" :series="series" type="radialBar" height="350" />
</template>

<script>
import VueApexCharts from "vue3-apexcharts";

export default {
  components: {
    apexchart: VueApexCharts,
  },
  props: {
    score: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    series() {
      return [this.score * 100];
    },
  },
  data() {
    return {
      chartOptions: {
        chart: {
          height: 300,
          type: 'radialBar',
          offsetY: -10,
        },
        plotOptions: {
          radialBar: {
            startAngle: -135,
            endAngle: 135,
            dataLabels: {
              value: {
                offsetY: -10,
                fontSize: '16px',
                color: 'red',
                formatter(val) {
                  return val + '/100';
                },
              },
              name: {
                fontSize: '14px',
                color: 'black',
                offsetY: 100,
              },
            },
          },
        },
        fill: {
          type: 'gradient',
          gradient: {
            shade: 'dark',
            shadeIntensity: 0.15,
            inverseColors: false,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 50, 65, 91],
            colorStops: [
              {
                offset: 0,
                color: '#E4000D',
                opacity: 1,
              },
              {
                offset: 100,
                color: '#E4000D',
                opacity: 1,
              },
            ],
          },
        },
        stroke: {
          dashArray: 4,
        },
        labels: ['Оценка системы'],
      },
    };
  },
};
</script>

<style lang="scss" scoped>
</style>
