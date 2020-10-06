<template>
  <div  class="mt-4">
    <h1 id="title" class="mb-4">
      <span class="d-block">席替えくん / </span>
      <span class="d-block">チーム分けくん</span>
    </h1>
    <h2>
      何を行いますか？
    </h2>
    <div class="row mr-1 ml-1">
      <button
        type="button"
        class="btn col-6 d-inline"
        :class="{'btn-primary': modeOfFunction === 'sekigae', 'btn-secondary': modeOfFunction !== 'sekigae'}"
        @click="modeOfFunction = 'sekigae'">
          席替え
      </button>
      <button
        type="button"
        class="btn col-6 d-inline"
        :class="{'btn-primary': modeOfFunction === 'teamwake', 'btn-secondary': modeOfFunction !== 'teamwake'}"
        @click="modeOfFunction = 'teamwake'">
          チーム分け
      </button>
    </div>
    <section>
      <section v-show="modeOfFunction === 'sekigae'">
        <Sekigae />
      </section>
      <section v-show="modeOfFunction === 'teamwake'">
        <Teamwake />
      </section>
    </section>
  </div>
</template>

<script>
import Sekigae from '../components/Sekigae.vue';
import Teamwake from '../components/Teamwake.vue';
export default {
  data () {
    return {
      modeOfFunction: '',
    };
  },
  components: {
    Sekigae,
    Teamwake,
  },
  methods: {
  }
};
</script>