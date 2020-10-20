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
      {{datas}}
    </div>
    <div>
      以下の金額/比率で抽選されます。
      <div style="overflow-x:auto;">
        <table border="1" align="center">
          <tr>
            <th>名前</th>
            <th>幸運</th>
            <th>不運</th>
          </tr>
          <tr
            v-for="data in datas"
            :key="data.name"
          >
            <td>{{ data.name }}</td>
            <td class="text-primary">
              {{data.low.fee}}円 / {{data.low.rate / 10}}%
            </td>
            <td class="text-danger">
              {{data.high.fee}}円 / {{data.high.rate / 10}}%
            </td>
          </tr>
        </table>
      </div>
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
    membersLength() {
      return this.members.length;
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
    
    datas() {
      this.displayTable = false;
      this.errorText = '';
      const members = this.members;
      const totalFee = this.totalFee;
      let datas = [];
      members.some((member, i)=>{
        let rowData = {};
        rowData.name = member;
        rowData.fee = this.personFee;
        datas.push(rowData);
      });
      datas.forEach((obj, i)=>{
        obj.low = {};
        obj.high = {};
        obj.sacrifice = [];
        if (i === 0){
          obj.low.fee = Math.floor(((obj.fee + 1000)-(totalFee % 1000))/1000)*1000 + totalFee % 1000 - 1000;
        } else {
          obj.low.fee = Math.floor(obj.fee / 1000) * 1000;
        }
        obj.high.fee = obj.low.fee + 1000;
        obj.low.rate = obj.high.fee - obj.fee;
        obj.high.rate = 1000 - obj.low.rate;
      });
      this.changedText = true;
      console.log(datas);
      return datas;
    },
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
      this.personFee = Math.round(this.totalFee / this.members.length);
    },
    checkFee() {
      if (isNaN(this.personFee)){
        this.personFee = 0;
      }
      if (isNaN(this.totalFee)){
        this.totalFee = 0;
      }
    }
  },
  watch: {
    membersLength() {
      this.totalFee = 0;
      this.personFee = 0;
    }
  }
};
</script>