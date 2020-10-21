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
    <div class="mb-4" v-if="membersInText && personFee && totalFee">
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
    <div class="mb-4">
      <button
        type="button"
        class="btn btn-primary mb-2"
        :disabled ="(!membersInText || !!duplicateUser || !personFee || !totalFee)"
        @click="prepared">
        結果を表示
      </button>
      <div
        v-if="displayResult === true"
        class="mb-2"
      >
        <div class="mb-2">
          1～1000の数字をランダムに抽選し、<br>
          <span style="font-size: 40px">{{resultNumber + 1}}<br></span>
          が出ました。<br>
          対応表と照らし合わせた結果、それぞれの支払額は以下の通りとなります。
        </div>
        <div class="mb-2">
          <div style="font-size: 20px"
            v-for = "data in datasForDisplay"
            :class="{'text-danger': data.isHigh[randArray[resultNumber]] === 1, 'text-primary':data.isHigh[randArray[resultNumber]] === 0}">
            {{data.name}}：{{data.fee[randArray[resultNumber]]}}円
          </div>
        </div>
        <button type="button" class="btn btn-primary mb-2" @click="displayTable = !displayTable">
          {{textOnButton}}
        </button>
        <div
          v-if="displayTable === true"
          class="mb-2"
        >
          <div
            style="overflow-x:auto;"
            v-if="displayTable === true"
          >
            <table border="1" align="center">
              <tr>
                <th>抽選結果</th>
                <th
                  v-for="data in datasForDisplay"
                >
                  {{data.name}}
                </th>
              </tr>
              <tr
                v-for="(n,i) in randArray"
                :key="n"
                :class="{'bg-warning': resultNumber === i}"
              >
                <td>
                  {{ i + 1 }}
                </td>
                <td
                  v-for="data in datasForDisplay"
                  :class="{'text-danger': data.isHigh[n]=== 1, 'text-primary': data.isHigh[n]=== 0}"
                >
                  {{data.fee[n]}}円
                </td>
              </tr>
            </table>
          </div>
        </div>
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
      datasForDisplay: '',
      changedText: true,
      numberOfSacrifice: 0, //高いほうを払う羽目になる人の数。
      randArray: [], //0～999。datasが変更後+ボタン押せば変わる。
      resultNumber: 0, //0～999。毎回変わる。
      displayResult: false,
      displayTable: false,
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
      return datas;
    },
    textOnButton() {
      if(this.displayTable){
        return '対応表を非表示';
      } else {
        return '対応表を表示';
      }
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
      this.personFee = Math.round(this.totalFee / this.members.length);
    },
    checkFee() {
      if (isNaN(this.personFee)){
        this.personFee = 0;
      }
      if (isNaN(this.totalFee)){
        this.totalFee = 0;
      }
    },
    prepared() {
      this.displayResult = true;
      let datas = this.datas;
      let datasForDisplay = [];
      let totalFee = this.totalFee;
      let sumOfLow = 0;
      let highRates = [];
      datas.forEach((obj, i)=>{
        sumOfLow += obj.low.fee;
        let pushObj = {};
        pushObj.rate = obj.high.rate;
        pushObj.index = i;
        highRates.push(pushObj);
        datasForDisplay[i] = {};
        datasForDisplay[i].name = obj.name;
        datasForDisplay[i].fee = [];
        datasForDisplay[i].isHigh = [];
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
            datasForDisplay[obj.index].fee.push(datas[obj.index].high.fee);
            datasForDisplay[obj.index].isHigh.push(1);
            obj.rate--;
          } else {
            datasForDisplay[obj.index].fee.push(datas[obj.index].low.fee);
            datasForDisplay[obj.index].isHigh.push(0);
          }
        });
      }
      this.datasForDisplay = datasForDisplay;
      
      if (this.changedText === true) {
        let randArray = [];
        for(let i = 0; i < 1000; i++){
          randArray.push(i);
        }
        for(let i = randArray.length - 1; i > 0; i--){
          let rand = Math.floor(Math.random() * (i + 1));
          [randArray[i], randArray[rand]] = [randArray[rand], randArray[i]];
        }
        this.randArray = randArray;
        this.changedText = false;
      }
      this.resultNumber = Math.floor(Math.random() * 1000 );
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