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
      <div class="mb-4">
        <h2>メンバーを記入してください。<br>※改行区切り</h2>
        <textarea v-model.trim="membersInText" rows=10></textarea>
        <div class="text-right mb-2">入力済：{{members.length}}人</div>
        <div>
          <span v-show="duplicateUser">
            <i class="fa fa-exclamation-triangle"></i>名前「{{duplicateUser}}」が重複しています。
          </span>
        </div>
      </div>
      <div class="mb-4">
        <h2>一人当たりの金額か合計金額を入力してください。</h2>
        <div class="container">
          <div class="row">
            <div class="col-7 p-0">
              一人当たりの金額：
            </div>
            <input 
              :value="personFee"
              @input="inputPersonFee"
              @focusout="checkFee"
              class="col-5 p-0">
            </input>
          </div>
          <div class="row">
            <div class="col-7 p-0">
              合計金額：
            </div>
            <input
              :value="totalFee"
              @input="inputTotalFee"
              @focusout="checkFee"
              class="col-5 p-0">
            </input>
          </div>
        </div>
      </div>
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
      membersInText: '',
      personFee: 0,
      totalFee: 0,
    };
  },
  computed: {
    members() {
      if (this.membersInText === ''){
        return [];
      }
      return this.membersInText.split(/\n+/);
    },
    duplicateUser() {
      for(let i = 0; i < this.members.length; i++){
        const user = this.members[i];
        for (let j = i + 1; j < this.members.length; j++){
          if (user === this.members[j]) {
            return user;
          }
        }
      }
      return '';
    },
    fees() {
      
    }
  },
  components: {
  },
  methods: {
    inputPersonFee(event) {
      this.personFee = event.target.value;
      this.totalFee = this.personFee * this.members.length;
    },
    inputTotalFee(event) {
      this.totalFee = event.target.value;
      this.personFee = Math.round(this.totalFee * 100 / this.members.length) / 100;
    },
    checkFee() {
      if (this.personFee===''){
        this.personFee = 0;
      }
      if (this.totalFee===''){
        this.totalFee = 0;
      }
    }
  }
};
</script>