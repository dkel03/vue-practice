<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-12">
          <v-toolbar dark color="green darken-3">
            <v-toolbar-title>로그인</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-text-field prepend-icon="person" v-model="form.id" label="아이디" type="text"></v-text-field>
              <v-text-field prepend-icon="lock" v-model="form.pwd" label="비밀번호" type="password"></v-text-field>
              <v-checkbox
                v-model="form.remember"
                label="암호 기억하기(최대 7일간 보관 됩니다.)"
              ></v-checkbox>
            </v-form>
            <!-- <small class="ma-2">로그인을 반드시 해주세요</small> -->
          </v-card-text>

          <v-card-actions>
            <v-btn dark color="secondary" @click="$router.push('/register')">signUp</v-btn>
            <v-spacer></v-spacer>
            <v-btn dark color="green darken-3" @click="signIn">로그인</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return {
      form: {
        id: '',
        pwd: '',
        remember: false
      }
    }
  },
  methods: {
    signIn () {
      axios.post('sign/in', this.form)
        .then(r => {
          if (!r.data.success) {
            this.$store.commit('pop', { msg: r.data.msg, color: 'warning' })
            return console.error(r.data.msg)
          }
          localStorage.setItem('token', r.data.token) // 로컬 스토리지에 토큰 저장
          this.$store.commit('getToken', r.data.user)
          this.$store.commit('pop', { msg: '로그인 성공!!', color: 'success' })
          this.$router.push('/') // 페이지 이동
        })
        .catch((e) => {
          if (!e.response) this.$store.commit('pop', { msg: e.message, color: 'error' })
        })
    }
  }
}
</script>
