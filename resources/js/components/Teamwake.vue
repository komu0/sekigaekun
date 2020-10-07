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
    <div v-show="splitArray.length" id="split-adjust" class="mb-4">
      <h2 class="mb-0">何人ずつに分けますか。</h2>
      <div v-for="(number, index) in splitArray">
        <span :style="{color: colors[index]}">チーム{{index + 1}}</span>：
        <a href="#" @click.prevent="splitArray[index]--; splitArray.splice();">
          <i class="fa fa-minus-square-o"></i>
        </a>
          {{number}}
        <a href="#" @click.prevent="splitArray[index]++; splitArray.splice();">
          <i class="fa fa-plus-square-o"></i>
        </a>
      </div>
      <div v-show="splitArray.length">
        余り：{{splitSurplus}}
      </div>
    </div>
    <div v-show="!splitArray.length" class="mb-4">
      <i class="fa fa-exclamation-triangle"></i>チーム数を減らすかメンバーを増やしてください。
    </div>
    <div class="mb-4">
      <button class="btn btn-primary mb-2" @click="showResult">結果発表</button>
      <div v-show="Object.keys(resultArray).length > 0">
        <div v-for="(result, key, i) in resultArray" :style="{color: colors[i]}">
          {{key}}→
          <span v-for="(member, j) in result">
            <span v-show="j !== 0">、</span>
            {{member}}
          </span>
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
export default {
  data () {
    return {
      membersInText: '',
      splitNumber: 2,
      splitArray: [],
      resultArray: [],
      colors,
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
    membersIsMoreThan3() {
      if (this.members.length >= 3){
        return true;
      } else {
        return false;
      }
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
    }
  },
  components: {
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
      this.resultArray = result;
    }
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
