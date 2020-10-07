<template>
  <div>
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
      <div class="container">
        <div class="row">
          
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
  },
  components: {
  },
  methods: {
  }
};
</script>