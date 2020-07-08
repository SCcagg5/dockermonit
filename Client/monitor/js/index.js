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
    order: function(){
      order = [[], [], []];
      count = 0;
      zone = 0; 
      for (var i in this.serversdata) {
         count += 9;
         count += this.serversdata[i].containers.length;
         if (count > 50) {
           count = 0;
           zone += 1
         }
         if (zone < 3) {
           order[zone].push(this.serversdata[i]);
         }
      }
      this.datas = order;
    },
    store: function(data) {
      let servername = data.config.url.split("&name=")[1]
      this.serversdata[servername] = JSON.parse(data.data)
      this.serversdata[servername]["name"] = servername;
      this.order()
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
                <td>{{ container['MemUsage'].split(' / ')[0] }} </td>
                <td>{{ container['NetIO'] }}                    </td>
                <td>{{ container['BlockIO'] }}                  </td>
                <td>{{ container['PIDs'] }}                     </td>
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
