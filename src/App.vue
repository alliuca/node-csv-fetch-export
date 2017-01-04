<template>
  <div id="app">
    <form v-on:submit="initExport($event)">
      <p>Load the .csv file and fetch</p>
      <input type="file" name="fileinput" ref="fileinput"><br><br>
      <div>
        Import to
        <select ref="category">
          <template v-for="cat in PS_categories">
            <option :value="cat.id">{{ cat.name }}</option>
          </template>
        </select>
      </div>
      <button class="btn">Export</button>
    </form>
    <spinner v-if="inProgress"></spinner>
    <div class="results" ref="results">
      <ul>
        <li :class="r.state" v-for="r in results">{{ r.title }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import Spinner from './Spinner.vue';

export default {
  data () {
    return {
      fileData: '',
      PS_categories: [{id: '', name: ''}],
      results: [],
      inProgress: false
    }
  },

  components: {
    Spinner
  },

  mounted () {
    this.$http.get('http://play.centroprofessionaleaudio.dev/api/categories/?display=[id,name]&output_format=JSON', {
        // headers: {
        //   Authorization: 'Basic MVFCU0g3NzNKODVaMkZMVDhINklJTVRWMVpNQ0syNjQ6'
        // },
        credentials: true,
        before: function(request) {
          // request.headers.set('Access-Control-Allow-Credentials', 'true');
          // console.log(request.headers);
          // request.headers.set('Authorization', 'Basic MVFCU0g3NzNKODVaMkZMVDhINklJTVRWMVpNQ0syNjQ6');
          // request.headers.set('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8');
        }
    })
    .then((res) => {
      this.PS_categories = res.body.categories;
    }, (err) => {
      console.log('Error occured while fetching the categories');
      console.log(err);
    })
  },

  methods: {
    initExport: function(event) {
      this.inProgress = true;
      this.fileData = new FormData();
      this.fileData.append('fileinput', this.$refs.fileinput.files[0]);
      this.fileData.append('inputcategory', this.$refs.category.value);
      this.$http.post('/upload', this.fileData).then((res) => {
        console.log('File sent..');
        this.results = JSON.parse(res.data);
        this.inProgress = false;
      }, (err) => {
        console.log('Error occurred..');
        console.log(err);
      });
      event.preventDefault();
    }
  }
}
</script>

<style>
body {
  font-family: Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
}
#app {
  width: 90%;
  margin: 0 auto;
  text-align: center;
  overflow: hidden;
}
.btn {
  display: block;
  min-width: 200px;
  padding: 10px 15px;
  margin: 15px auto;
  border: 0;
  border-radius: 3px;
  background-color: lightgray;
  font-size: 14px;
  font-weight: 400;
  text-transform: uppercase;
  cursor: pointer;
}
.btn:hover {
  opacity: .8;
}
.results ul {
  max-width: 50%;
  max-height: 300px;
  margin: 0 auto;
  padding: 0;
  overflow-y: auto;
  list-style: none;
  counter-reset: results;
}
.results ul li {
  position: relative;
  padding: 8px 39px 8px;
  border: 1px solid #f5f5f5;
  border-top-width: 0;
  font-size: 12px;
}
.results ul li:before,
.results ul li:after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  display: block;
  width: 31px;
  height: 100%;
}
.results ul li:before {
  content: counter(results);
  right: auto;
  left: 0;
  background: #f5f5f5;
  line-height: 31px;
  counter-increment: results;
}
.results ul li:first-child {
  border-top: 1px solid #f5f5f5;
}
.results ul li.ok:after {
  background: lightgreen;
}
.results ul li.error:after {
  background: red;
}
</style>