<template>
  <div>
    <div class="mb-4">
      <h2>メンバーを改行区切りで記入してください。</h2>
      <div>入力済：{{members.length}}人</div>
      <div>
        <span v-show="!membersIsMoreThan3">&#x2610;</span>
        <span v-show="membersIsMoreThan3">&#x2611;</span>
        3人以上入力しましょう。
      </div>
      <div>
        <span v-show="!membersIsUnique">&#x2610;</span>
        <span v-show="membersIsUnique">&#x2611;</span>
        同じ名前を書かないようにしましょう。
      </div>
      <textarea v-model.trim="membersInText" rows=10></textarea>
    </div>
    <div class="mb-4">
      <h2>何チームに分けますか。</h2>
      <div class="row mr-1 ml-1 mb-4">
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
    <div class="mb-4">
      <h2>何人ずつに分けますか。</h2>
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
  </div>
</template>

<script>
export default {
  data () {
    return {
      membersInText: '',
      splitNumber: 2,
      splitArray: [],
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
    membersIsUnique() {
      const s = new Set(this.members);
      if (s.size != this.members.length){
        return false;
      }else{
        return true;
      }
    },
    splitSurplus() {
      return this.members.length - this.splitArray.reduce((a,x) => a+=x,0);
    }
  },
  components: {
  },
  methods: {
    remakeSplitArray(){
      const array = [];
      if (this.members.length < this.splitNumber) {
      } else {
        const less = Math.floor(this.members.length / this.splitNumber);
        const surplus = this.members.length % this.splitNumber;
        for(let $i = 0; $i < surplus; $i++) {
          array.push(less + 1);
        }
        for(let $i = 0; $i < this.splitNumber - surplus; $i++) {
          array.push(less);
        }
      }
      console.log('splitArray:',array);
      this.splitArray = array;
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
