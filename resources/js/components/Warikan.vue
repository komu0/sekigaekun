<template>
  <div>
    <div class="mb-4">
      <h2>メンバーの使った金額は…</h2>
      <div class="row mr-1 ml-1">
        <button
          type="button"
          class="btn col-6 d-inline"
          :class="{'btn-primary': modeOfFunction === 'same', 'btn-secondary': modeOfFunction !== 'same'}"
          @click="modeOfFunction = 'same'">
            全員同じ
        </button>
        <button
          type="button"
          class="btn col-6 d-inline"
          :class="{'btn-primary': modeOfFunction === 'different', 'btn-secondary': modeOfFunction !== 'different'}"
          @click="modeOfFunction = 'different'">
            それぞれ違う
        </button>
      </div>
    </div>
    <section v-show="modeOfFunction === 'same'">
      <div>同じ金額です。</div>
    </section>
    <section v-show="modeOfFunction === 'different'">
      <div>金額は異なります。</div>
    </section>
  </div>
</template>


<script>
export default {
  data () {
    return {
      modeOfFunction: 'same',
    };
  },
  computed: {
  },
  components: {
  },
  methods: {
  }
};
</script>