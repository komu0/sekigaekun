<template>
  <div>
  <h2>メンバーを改行区切りで記入してください。</h2>
  <div>入力済：{{numberOfMembers}}人</div>
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
</template>

<script>
export default {
  data () {
    return {
      membersInText: '',
    };
  },
  computed: {
    numberOfMembers() {
      return this.members.length;
    },
    members() {
      if (this.membersInText === ''){
        return [];
      }
      return this.membersInText.split(/\n+/);
    },
    membersIsMoreThan3() {
      if (this.numberOfMembers >= 3){
        return true;
      } else {
        return false;
      }
    },
    membersIsUnique() {
      const s = new Set(this.members);
      if (s.size != this.numberOfMembers){
        return false;
      }else{
        return true;
      }
    }
  },
  components: {
  },
  methods: {
  }
};
</script>
