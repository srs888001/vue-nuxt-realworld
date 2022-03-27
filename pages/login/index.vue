<template>
  <div class="auth-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">{{ isLogin ? "Sign in " : "Sign up" }}</h1>
          <p class="text-xs-center">
            <!-- <a href="">Have an account?</a> -->
            <nuxt-link v-if="isLogin" to="/register">
              Need an account?
            </nuxt-link>
            <nuxt-link v-else to="/login"> Have an account? </nuxt-link>
          </p>

          <ul class="error-messages">
            <!-- template 不会生成Dom -->
            <!-- 备用接口错误信息要调整下 -->
            <template v-for="(value, key) in errors">
              <li :key="key">
                {{ key }} {{ value }}
              </li>
            </template>

            <!-- <template v-for="(values, key) in errors">
              <li v-for="(value, index) in values" :key="index">
                {{ key }} {{ value }}
              </li>
            </template> -->
          </ul>

          <!-- prevent 去除浏览器默认提交行为 -->
          <!-- required 使用浏览器默认行为判空 -->
          <form @submit.prevent="onSubmit">
            <fieldset class="form-group" v-if="!isLogin">
              <input
                class="form-control form-control-lg"
                v-model="user.username"
                type="text"
                placeholder="Your Name"
                required
              />
            </fieldset>
            <fieldset class="form-group">
              <input
                class="form-control form-control-lg"
                v-model="user.email"
                type="email"
                placeholder="Email"
                required
              />
            </fieldset>
            <fieldset class="form-group">
              <input
                class="form-control form-control-lg"
                v-model="user.password"
                type="password"
                placeholder="Password"
                required
                minlength="6"
              />
            </fieldset>
            <button class="btn btn-lg btn-primary pull-xs-right">
              {{ isLogin ? "Sign in " : "Sign up" }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { login, register } from "@/api/user";

// 仅在客户端加载 js-cookie 包
// process.client是nuxt定义的
const Cookie = process.client ? require('js-cookie') : undefined

export default {
  // 在路由匹配组件渲染之前会先执行中间件处理
  middleware: 'notAuthenticated',
  name: "LoginIndex",
  computed: {
    isLogin() {
      return this.$route.name === "login";
    },
  },

  data() {
    return {
      user: {
        username: "srs1",
        email: "srs1@163.com",
        password: "111111",
      },
      errors: {}, // 错误信息
    };
  },
  methods: {
    async onSubmit() {
      try {
        const { data } = this.isLogin
          ? await login({
              user: this.user,
            })
          : await register({
              user: this.user,
            });

        // console.log(data)
        // 保存用户的登录状态
        this.$store.commit('setUser', data.user);

        // 为了防止刷新页面数据丢失，我们需要把数据持久化
        Cookie.set('user', JSON.stringify(data.user));

        this.$router.push("/");
      } catch (err) {
        console.dir(err);
        this.errors = err.response.data.errors;

        // let user =  {
        //     username: "srs",
        //     email: "srs@163.com",
        //     password: "",
        //     image: "https://api.realworld.io/images/smiley-cyrus.jpeg"
        // }
        // this.$store.commit('setUser', user);
        // Cookie.set('user', JSON.stringify(user));
        // this.$router.push("/");
      }
    },
  },
};
</script>

<style>
</style>