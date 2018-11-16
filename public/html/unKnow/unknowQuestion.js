let app = new Vue({
  el: '#app',
  data: {

  },
  methods:{
    _initData: function () {
      axios.get('http://localhost:8080/api/model/module')
    }
  },
  mounted(){
    this._initData()
  }
})