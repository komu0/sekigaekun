<template>
  <div>
    <div class="mb-4">
      <h2>メンバーを記入してください。<br>
      ※改行区切り<br>
      ※支払いを行う人を一番上に書いてください。</h2>
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
            class="col-5 p-0"
            type="number">
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
            class="col-5 p-0"
            type="number">
          </input>
        </div>
      </div>
    </div>
    <div class="mb-4">
      {{fees}}
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
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
      let result = {
        manager:
          {
            low: {},
            high: {},
          },
        other: 
          {
            low: {},
            high: {},
          },
      };
      result.manager.low.fee = Math.floor(((this.personFee + 1000)-(this.totalFee % 1000))/1000)*1000 + this.totalFee % 1000 - 1000;
      result.manager.high.fee = result.manager.low.fee + 1000;
      result.other.low.fee = Math.floor(this.personFee / 1000) * 1000;
      result.other.high.fee = result.other.low.fee + 1000;
      result.manager.low.rate = (result.manager.high.fee - this.personFee) / 1000;
      result.manager.high.rate = 1 - result.manager.low.rate;
      result.other.low.rate = (result.other.high.fee - this.personFee) / 1000;
      result.other.high.rate = 1 - result.other.low.rate;
      return result;
    }
  },
  components: {
  },
  methods: {
    inputPersonFee(event) {
      this.personFee = parseFloat(event.target.value);
      this.totalFee = this.personFee * this.members.length;
    },
    inputTotalFee(event) {
      this.totalFee = parseFloat(event.target.value);
      this.personFee = Math.round(this.totalFee * 100 / this.members.length) / 100;
    },
    checkFee() {
      if (isNaN(this.personFee)){
        this.personFee = 0;
      }
      if (isNaN(this.totalFee)){
        this.totalFee = 0;
      }
    }
  }
};
</script>