<template>
  <div>
    <div class="mb-4">
      飲み会やボードゲームカフェなどで気軽に席替えを行いたいときにご利用ください。<br>
    </div>
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
      <button class="btn btn-primary mb-3 col-6" @click="showResult">結果表示</button>
      <div  style="min-height: 400px;">
        <div v-show="Object.keys(resultObject).length > 0">
          <div class="container">
            <div class="row">
              <div class="col-5 p-0">
                <div
                  v-for="(member, i) in resultObject.left"
                  :style="{'background-color': bgColors[i % 2]}"
                  class="pt-2 pb-2"
                >
                  {{member}}
                </div>
              </div>
              <div class="col-2 d-flex align-items-center" style="background-color: #cd5c5c;">
                <div class="m-auto">机</div>
              </div>
              <div class="col-5 p-0">
                <div
                  v-for="(member, i) in resultObject.right"
                  :style="{'background-color': bgColors[i % 2]}"
                  class="pt-2 pb-2"
                >
                  {{member}}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const bgColors = ['#dcdcdc', '#c0c0c0'];
export default {
  data () {
    return {
      membersInText: '',
      resultObject: '',
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
    showResult() {
      let members = this.members; //A,B,C,D
      let result = {};
      result['left'] = [];
      result['right'] = [];
      for(let i = members.length - 1; i > 0; i--){
          let rand = Math.floor(Math.random() * (i + 1));
          [members[i], members[rand]] = [members[rand], members[i]];
      }
      members.forEach((member, i) => {
        if(i % 2 === 0){
          result['left'].push(member);
        } else {
          result['right'].push(member);
        }
      });
      this.resultObject = result;
      console.log(result);
    },
  }
};
</script>