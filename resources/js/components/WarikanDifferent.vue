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
      {{datas}}
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
      this.errorText = '';
      if (this.membersInText === ''){
        return [];
      }
      const lows = this.membersInText.split(/\n+/);
      let datas = [];
      lows.some((low, i)=>{
        let lowData = {};
        if(low.split('、').length !== 2){
          console.log('入力不足');
          this.errorText = `入力ミスがあります。[${i+1}行目]`;
          return true;
        }
        if(!parseFloat(low.split('、')[1])){
          console.log('数値形式');
          this.errorText = `数値の形式が違います。[${i+1}行目]`;
          return true;
        }
        lowData.name = low.split('、')[0];
        lowData.fee = parseFloat(low.split('、')[1]);
        datas.push(lowData);
      });
      if(this.errorText){
        return [];
      }
      console.log(datas);
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
  }
};
</script>