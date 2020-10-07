<template>
  <div>
    <div class="mb-4">
      <h2>メンバーを記入してください。<br>(改行区切り)</h2>
      <textarea v-model.trim="membersInText" rows=10></textarea>
      <div class="text-right mb-2">入力済：{{members.length}}人</div>
      <div>
        <span v-show="duplicateUser">
          <i class="fa fa-exclamation-triangle"></i>名前「{{duplicateUser}}」が重複しています。
        </span>
      </div>
    </div>
    <div class="mb-4">
      <h2>何チームに分けますか。</h2>
      <div class="row mr-1 ml-1">
        <button
          type="button"
          class="btn col-2 d-inline"
          :class="{'btn-primary': splitNumber === n + 1, 'btn-outline-primary': splitNumber !== n + 1}"
          @click="splitNumber = n + 1"
          v-for="n in 12">
            {{n + 1}}
        </button>
      </div>
    </div>
    <div v-show="splitArray.length" class="mb-4">
      <h2 class="mb-0">何人ずつに分けますか。</h2>
      <div id="split-adjust">
        <div v-for="(number, index) in splitArray">
          <span :style="{color: colors[index]}">チーム{{index + 1}}</span>：
          <span v-if="number===0">
            <i class="fa fa-minus-square-o"></i>
          </span>
          <a
            v-else
            href="#"
            @click.prevent="splitArray[index]--; splitArray.splice();"
          >
            <i class="fa fa-minus-square-o"></i>
          </a>
            {{number}}
          <a href="#" @click.prevent="splitArray[index]++; splitArray.splice();">
            <i class="fa fa-plus-square-o"></i>
          </a>
        </div>
      </div>
      <div v-show="splitArray.length" class="text-right">
        <i v-show="splitSurplus !== 0" class="fa fa-exclamation-triangle"></i>余り：{{splitSurplus}}
      </div>
    </div>
    <div v-show="!splitArray.length" class="mb-4">
      <i class="fa fa-exclamation-triangle"></i>チーム数を減らすかメンバーを増やしてください。
    </div>
    <div class="mb-4">
      <button class="btn btn-primary mb-2 col-6" @click="showResult">結果表示</button>
      <div  style="min-height: 400px;">
        <div v-show="Object.keys(resultObject).length > 0">
          <div class="container">
            <div class="row">
              <div class="col-6 p-0" v-for="(result, key, i) in resultObject" :style="{'background-color': bgColors[i]}">
                <span style="font-size: 20px">{{key}}<br></span>
                <span v-for="(member, j) in result"><span v-show="j !== 0"><br></span>{{member}}</span>
              </div>
            </div>
          </div>
          <div class="text-right">
            <a
              href="javascript:void(0)"
              v-clipboard:copy="resultForCopy"
              v-clipboard:success="onCopy"
              v-clipboard:error="onError"
            >
              <i class="fa fa-clone"></i>結果をコピー
            </a>
            <span style="white-space: pre;">
              {{copyResult}}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const colors = [
  '#FF0033','#3300FF','#CCCC00','#33CC00','#FF9933', '#9900CC', '#FF33CC', '#33CCFF',
  '#FF0033','#3300FF','#CCCC00','#33CC00','#FF9933', '#9900CC', '#FF33CC', '#33CCFF',
  '#FF0033','#3300FF','#CCCC00','#33CC00','#FF9933', '#9900CC', '#FF33CC', '#33CCFF',
];
const bgColors = [
  '#FF6684','#669BFF','#FFFF32','#65FF32','#FFCC99', '#CC32FF', '#FF99E5', '#99E5FF',
  '#FF6684','#669BFF','#FFFF32','#65FF32','#FFCC99', '#CC32FF', '#FF99E5', '#99E5FF',
  '#FF6684','#669BFF','#FFFF32','#65FF32','#FFCC99', '#CC32FF', '#FF99E5', '#99E5FF',
];
export default {
  data () {
    return {
      membersInText: '',
      splitNumber: 2,
      splitArray: [],
      resultObject: {},
      copyResult: "",
      colors,
      bgColors,
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
      // これだと何が重複しているかわからないので却下。
      // const s = new Set(this.members);
      // if (s.size != this.members.length){
      //   return true;
      // }else{
      //   return false;
      // }
      
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
    splitSurplus() {
      return this.members.length - this.splitArray.reduce((a,x) => a+=x,0);
    },
    resultForCopy() {
      let result = '';
      Object.keys(this.resultObject).forEach((key,i ) => {
        if(i != 0){
          result += '\n';
        }
        result += `${key}→`;
        this.resultObject[key].forEach((member, j) => {
          if(j !== 0){
            result += '、';
          }
          result += member;
        });
      });
      return result;
    }
  },
  methods: {
    remakeSplitArray() {
      const array = [];
      if (this.members.length >= this.splitNumber) {
        const less = Math.floor(this.members.length / this.splitNumber);
        const surplus = this.members.length % this.splitNumber;
        for(let i = 0; i < surplus; i++) {
          array.push(less + 1);
        }
        for(let i = 0; i < this.splitNumber - surplus; i++) {
          array.push(less);
        }
      }
      this.splitArray = array;
    },
    showResult() {
      let members = this.members; //A,B,C,D
      let result = {};
      for(let i = members.length - 1; i > 0; i--){
          let rand = Math.floor(Math.random() * (i + 1));
          [members[i], members[rand]] = [members[rand], members[i]];
      }
      let membersIndex = 0;
      for(let i = 0; i < this.splitArray.length; i++) {
        result[`チーム${i+1}`] = [];
        for(let j = 0; j < this.splitArray[i]; j++) {
          result[`チーム${i+1}`].push(members[membersIndex]);
          membersIndex++;
        }
      }
      this.resultObject = result;
    },
    onCopy() {
      const now =new Date();
      const H =('0' + now.getHours()).slice(-2);
      const M =('0' + now.getMinutes()).slice(-2);
      const S =('0' + now.getSeconds()).slice(-2);
      const displayNow = `${H}時${M}分${S}秒`;
      const result =
        `結果をコピーしました！
        (${displayNow})`;
      this.copyResult = result;
      console.log(result);
    },
    onError() {
      const now =new Date();
      const H =('0' + now.getHours()).slice(-2);
      const M =('0' + now.getMinutes()).slice(-2);
      const S =('0' + now.getSeconds()).slice(-2);
      const displayNow = `${H}時${M}分${S}秒`;
      const result =
        `結果のコピーに失敗しました……。
        (${displayNow})`;
      this.copyResult = result;
    },
  },
  watch: {
    membersLength: function() {
      this.remakeSplitArray();
    },
    splitNumber: function() {
      this.remakeSplitArray();
    },
  }
};
</script>
