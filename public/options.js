const vm = new Vue({
  data: {
    count: 0,
    foo: {
      bar: true
    },
    arr: [1, 2, 3, 4],
    arrObj: [
      {
        id: 1,
        value: 'tab1',
      },
      {
        id: 2,
        value: 'tab2'
      },
      {
        id: 3,
        value: 'tab3'
      }
    ]
  },
  computed: {
    countNext() {
      return this.count + 1;
    },
    notFooBar() {
      return !this.foo.bar; 
    },
  },
  beforeCreate() {

  },
  created() {

  },
  beforeMount() {

  },
  mounted() {

  },
  beforeUpdate() {

  },
  beforeDestroy() {

  },
  destroyed() {

  },
  
  watch: {
    count: function(newVal, oldVal) {

    },
    foo: {
      handler(newVal, oldVal) {

      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    add() {
      this.count += 1;
    },
    toggleFoo() {
      this.foo.bar = !this.foo.bar;
    },
    arrPush() {
      arr.push(5);
    },
    arrObjPush() {
      arrObj.push({
        id: 10,
        value: 'tab4'
      });
    }
  }
});