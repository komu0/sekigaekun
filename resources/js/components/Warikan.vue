<template>
  <div>
    <div class="mb-4">
      割り勘を行う際、小銭のやり取りが面倒くさいときにご利用ください。<br>
      支払う金額の期待値はそのままで、1000円未満の金額の切り上げ・もしくは切り捨てを行います。
    </div>
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
      <WarikanSame />
    </section>
    
    <section v-show="modeOfFunction === 'different'">
      <WarikanDifferent />
    </section>
  </div>
</template>


<script>
import WarikanSame from './WarikanSame.vue';
import WarikanDifferent from './WarikanDifferent.vue';

export default {
  data () {
    return {
      modeOfFunction: 'same',
    };
  },
  components: {
    WarikanSame,
    WarikanDifferent,
  }
};
</script>