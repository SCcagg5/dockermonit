Vue.use(vcdonut.default);

Vue.component('monit', {
  data: function () {
    return {
      serversdata: {},
      datas: [],
      render: false
    }
  },

  components: { vcdonut },

  filters: {
    fixed : function(number){
      number = number.toFixed(2);
      return number;
    }
  },

  methods: {
    sum: function(arr){
    if (arr.length == 0)
      return 0;
    const reducer = (accumulator, currentValue) => accumulator + currentValue;
    return arr.reduce(reducer);
    },
    update: function(){
      for (var i in servers) {
        axios.get("./proxy.php?server=" + servers[i] + "&name=" + i)
            .then(response => this.store(response))
            .catch(error => this.error(error));
      }
      this.$forceUpdate();
    },
    error: function(err){
      console.log(err)
    },
    order: function(data){
      serversdata = []
      order = [[], [], []];
      count = [[], [], []]
      for (var i in data) {
        serversdata.push(data[i]);
      }
      serversdata.sort(function(e1,e2){ return e2.containers.length - e1.containers.length });
      var i1 = 0;
      while (i1 < serversdata.length) {
         i2 = 0;
         while (i2 < 3) {
           if (this.sum(count[i2]) + serversdata[i1].containers.length + 15 < 60) {
             order[i2].push(serversdata[i1]);
             count[i2].push(serversdata[i1].containers.length + 15);
             i2 = 5;
           }
           i2 += 1;
         }
         i1 += 1;
      }
      i2 = 0;
      while (i2 < 3 ** 2){
        p = i2 % (3 - 1);
        if (this.sum(count[p]) < this.sum(count[p + 1])){
          temp = count[p];
          count[p] = count[p + 1];
          count[p + 1] = temp;
          temp = order[p];
          order[p] = order[p + 1];
          order[p + 1] = temp;
        }
        i2 += 1;
      }
      this.datas = order;
    },
    store: function(data) {
      let servername = data.config.url.split("&name=")[1]
      this.serversdata[servername] = JSON.parse(data.data)
      this.serversdata[servername]["name"] = servername;
      this.order(this.serversdata);
      this.$forceUpdate();
    }
  },
  template: `
  <div class="row" style="margin: 20px;">
    <div class="col-12 float-left">
      By SCcagg5
      <h2>DockMonit</h2>
    </div>
    <div v-for="columns in datas" class="col-md-6 col-lg-5 col-xl-4">
      <div v-for="data in columns" class="card">
        <div class="card-body row">
          <div class="col-6 ml-1">
            <h5 class="color">{{ data.name }}</h5>
          </div>
          <div class="ml-auto white" style="margin-top: 2px">
            <b >
              CPU
            <b>
          </div>
          <div class="col-1">
            <vc-donut ref='donut'
            size=25
            thickness=45
            background="#27293d"
            foreground="#525f7f"
            :sections='[{value: data.CPU, color: "#e14eca"}]'
            ></vc-donut>
          </div>
          <div class=" ml-2 white" style="margin-top: 2px">
            <b >
              RAM
            <b>
          </div>
          <div class="col-1 mr-3">
            <vc-donut ref='donut'
            size=25
            thickness=45
            background="#27293d"
            foreground="#525f7f"
            :sections='[{value: data.memory > 98 ? 99 : data.memory, color: data.memory > 90 ? "red" : "#ba54f5"}]'
            ></vc-donut>
          </div>
        </div>
        <div class="row">
          <div class="col-11 ml-3">
            <div class="back trans">
            </div>
          </div>
        </div>
        <div class="card-body row text-center">
          <div class="ml-auto mr-auto col-auto white">
            Mémoire: {{ data.memory | fixed }}%
          </div>
          <div class="ml-auto mr-auto col-auto white">
            CPU: {{ data.CPU | fixed }}%
          </div>
          <div class="ml-auto mr-auto col-auto white">
            Containers: {{ data.containers.length }}
          </div>
          <div class="col-12">
          <table id="datatable" class="table table-striped dataTable dtr-inline collapsed" cellspacing="0" width="100%">
            <thead>
              <tr>
                <th class="th-sm">Name</th>
                <th class="th-sm">MemUsage</th>
                <th class="th-sm">NetIO</th>
                <th class="th-sm">BlockIO</th>
                <th class="th-sm">PIDs</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="container in data.containers">
                <td>{{ container['Name'] }}                     </td>
                <td>{{ container['PIDs'] != 0 ? container['MemUsage'].split(' / ')[0] : '' }} </td>
                <td>{{ container['PIDs'] != 0 ? container['NetIO'] : ''   }}                    </td>
                <td>{{ container['PIDs'] != 0 ? container['BlockIO'] : '' }}                  </td>
                <td>{{ container['PIDs'] != 0 ? container['PIDs'] : 'OFFLINE'}}                     </td>
              </tr>
            </tbody>
          </table>
          </div>
        </div>
      </div>
    </div>
    <div class="ml-auto mr-auto col-6">
    </div>
  </div>
  `,

  mounted() {
    setInterval(this.update, 4000);
  }
});



new Vue({ el: '#monit' });
