<template>
  <v-container grid-list-md>
    <v-alert
      :value="!sites.length"
      type="warning"
    >
      데이터가 없습니다
    </v-alert>
    <v-layout row wrap>
      <v-flex xs12 sm6 md4 v-for="site in sites" :key="site._id">
        <v-card>
          <v-card-title primary-title>
            <div>
              <h3 class="headline mb-0">{{site.title}}</h3>
            </div>
          </v-card-title>
          <v-divider light></v-divider>
          <v-card-text primary-text>
            <div>
              <div>아이콘: {{site.icon}}</div>
              <div>하단: {{site.copyright}}</div>
              <div>색상: {{site.dark}}</div>
            </div>
          </v-card-text>
          <v-divider light></v-divider>
          <v-card-actions>
            <v-btn color="orange" @click="putDialog(site)">수정</v-btn>
            <v-btn color="error" @click="delSite(site._id)">삭제</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
    <v-dialog v-model="dialog" persistent max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">사이트 수정</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm6 md4>
                <v-text-field
                  label="사이트 아이콘"
                  hint="아무거나"
                  persistent-hint
                  required
                  v-model="siteIcon"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field
                  label="사이트 이름"
                  hint="아무거나"
                  persistent-hint
                  required
                  v-model="siteTitle"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field
                  label="사이트 하단"
                  hint="아무거나"
                  persistent-hint
                  required
                  v-model="siteCopyright"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-switch
                  label="다크모드"
                  v-model="siteDark"
                ></v-switch>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="putSite">수정</v-btn>
          <v-btn color="blue darken-1" flat @click.native="dialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
export default {
  data () {
    return {
      sites: [],
      dialog: false,
      siteIcon: '',
      siteTitle: '',
      siteCopyright: '',
      siteDark: false,
      putId: ''
    }
  },
  mounted () {
    this.getSites()
  },
  methods: {
    getSites () {
      this.$axios.get('manage/site')
        .then((r) => {
          this.sites = r.data.ds
        })
        .catch((e) => {
          if (!e.response) this.$store.commit('pop', { msg: e.message, color: 'error' })
        })
    },
    putDialog (site) {
      this.putId = site._id
      this.dialog = true
      this.siteIcon = site.icon
      this.siteTitle = site.title
      this.siteCopyright = site.copyright
      this.siteDark = site.dark
    },
    putSite () {
      this.dialog = false
      this.$axios.put(`manage/site/${this.putId}`, {
        icon: this.siteIcon, title: this.siteTitle, copyright: this.siteCopyright, dark: this.siteDark
      })
        .then((r) => {
          this.$store.commit('pop', { msg: '사이트 수정완료', color: 'success' })
          this.getSites()
        })
        .catch((e) => {
          if (!e.response) this.$store.commit('pop', { msg: e.message, color: 'error' })
        })
    },
    delSite (id) {
      this.$axios.delete(`manage/site/${id}`)
        .then((r) => {
          this.$store.commit('pop', { msg: '사이트 삭제완료', color: 'success' })
          this.getSites()
        })
        .catch((e) => {
          if (!e.response) this.$store.commit('pop', { msg: e.message, color: 'error' })
        })
    }
  }
}
</script>
