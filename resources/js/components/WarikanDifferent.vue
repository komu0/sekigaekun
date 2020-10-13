<template>
  <div>
    <div class="mb-4">
      <h2>メンバーと金額を記入してください。<br>
      ※「メンバー、金額」の形で改行区切り<br>
      ※支払いを行う人を一番上に書いてください。</h2>
      <textarea v-model.trim="membersInText" rows=10></textarea>
      <div class="text-right mb-2">入力済：{{datas.length}}人</div>
      <div>
        <span v-show="duplicateUser">
          <i class="fa fa-exclamation-triangle"></i>名前「{{duplicateUser}}」が重複しています。
        </span>
        <span v-show="errorText">
          <i class="fa fa-exclamation-triangle"></i>{{errorText}}
        </span>
      </div>
    </div>
    <div class="mb-4">
      <button type="button" class="btn btn-primary" @click="prepared">
          入力完了(まだ抽選は行われません)
      </button>
       <table border="1">
          <tr>
            <th>抽選結果</th>
            <th
              v-for="data in displayDatas"
            >
              {{data.name}}
            </th>
          </tr>
          <tr
            v-for="(n,i) in randArray"
            :key="n"
          >
            <td>{{ i + 1 }}</td>
            <td
              v-for="data in displayDatas"
              :class="{'text-danger': data.isHigh[n]=== 1, 'text-primary': data.isHigh[n]=== 0}"
            >
              {{data.fee[n]}}
            </td>
          </tr>
        </table>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      membersInText: '',
      errorText: '',
      totalFee: 0,
      displayDatas: '',
      numberOfSacrifice: 0, //高いほうを払う羽目になる人の数。
      randArray: [],
    };
  },
  computed: {
    datas() {
      this.errorText = '';
      if (this.membersInText === ''){
        return [];
      }
      const rows = this.membersInText.split(/\n+/);
      let datas = [];
      rows.some((row, i)=>{
        let rowData = {};
        if(row.split('、').length !== 2){
          this.errorText = `入力ミスがあります。[${i+1}行目]`;
          return true;
        }
        if(!parseFloat(row.split('、')[1])){
          this.errorText = `数値の形式が違います。[${i+1}行目]`;
          return true;
        }
        rowData.name = row.split('、')[0];
        rowData.fee = parseFloat(row.split('、')[1]);
        datas.push(rowData);
      });
      if(this.errorText){
        return [];
      }
      return datas;
    },
    duplicateUser() {
      for(let i = 0; i < this.datas.length; i++){
        const user = this.datas[i].name;
        for (let j = i + 1; j < this.datas.length; j++){
          if (user === this.datas[j].name) {
            return user;
          }
        }
      }
      return '';
    },
  },
  components: {
  },
  methods: {
    prepared() {
      let datas = this.datas;
      let displayDatas = [];
      let totalFee = 0;
      datas.forEach((obj)=>{
        totalFee += obj.fee;
      });
      let sumOfLow = 0;
      let highRates = [];
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
        sumOfLow += obj.low.fee;
        let pushObj = {};
        pushObj.rate = obj.high.rate;
        pushObj.index = i;
        highRates.push(pushObj);
        displayDatas[i] = {};
        displayDatas[i].name = obj.name;
        displayDatas[i].fee = [];
        displayDatas[i].isHigh = [];
      });
      this.numberOfSacrifice = ( totalFee - sumOfLow ) / 1000;
      
      //highRates=[{'rate':600,'index':0},{},{}]、numberOfSacrifice=2
      for(let time = 0; time < 1000; time++){
        highRates.sort(function(a,b){
          if(a.rate > b.rate) return -1;
          if(a.rate < b.rate) return 1;
          return 0;
        });
        highRates.forEach((obj,i)=>{
          if(i < this.numberOfSacrifice){
            displayDatas[obj.index].fee.push(datas[obj.index].high.fee);
            displayDatas[obj.index].isHigh.push(1);
            obj.rate--;
          } else {
            displayDatas[obj.index].fee.push(datas[obj.index].low.fee);
            displayDatas[obj.index].isHigh.push(0);
          }
        });
      }
      this.displayDatas = displayDatas;
      
      let randArray = [];
      for(let i = 0; i < 1000; i++){
        randArray.push(i);
      }
      for(let i = randArray.length - 1; i > 0; i--){
        let rand = Math.floor(Math.random() * (i + 1));
        [randArray[i], randArray[rand]] = [randArray[rand], randArray[i]];
      }
      this.randArray = randArray;
      console.log(displayDatas);
    }
  }
};
</script>