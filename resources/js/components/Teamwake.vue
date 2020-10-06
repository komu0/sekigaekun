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
    <div id="split-adjust" class="mb-4">
      <h2 class="mb-0">何人ずつに分けますか。</h2>
      <div v-for="(number, index) in splitArray">
        チーム{{index + 1}}：
        <a href="#" @click.prevent="splitArray[index]--; splitArray.splice();">
          <i class="fa fa-minus-square-o"></i>
        </a>
          {{splitArray[index]}}
        <a href="#" @click.prevent="splitArray[index]++; splitArray.splice();">
          <i class="fa fa-plus-square-o"></i>
        </a>
      </div>
      <div v-show="splitArray.length">
        余り：{{splitSurplus}}
      </div>
    </div>
    <div class="mb-4">
      <button class="btn btn-primary" @click="showResult">結果発表</button>
      <div v-show="Object.keys(resultArray).length > 0">
        {{resultArray}}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      membersInText: '',
      splitNumber: 2,
      splitArray: [],
      resultArray: [],
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
      if (this.members.length < this.splitNumber) {
      } else {
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
