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
  </div>
</template>

<script>
export default {
  data () {
    return {
      membersInText: '',
      errorText:'',
    };
  },
  computed: {
    datas() {
      if (this.membersInText === ''){
        return [];
      }
      const lows = this.membersInText.split(/\n+/);
      let datas = [];
      lows.forEach((low, i)=>{
        let lowArray = [];
        if(low.split('、').length !== 2){
          this.errorText = `入力に不足があります。[${i}行目]`;
          return[];
        }
        if(!parseFloat(low.split('、')[1])){
          this.errorText = `数値の形式が違います。[${i}行目]`;
        }
        lowArray.push(low.split('、')[0]);
        lowArray.push(parseFloat(low.split('、')[1]));
        datas.push(lowArray);
      });
      console.log(datas);
      this.errorText = '';
      return datas;
    },
    duplicateUser() {
      for(let i = 0; i < this.datas.length; i++){
        const user = this.datas[i][0];
        for (let j = i + 1; j < this.datas.length; j++){
          if (user === this.datas[j][0]) {
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