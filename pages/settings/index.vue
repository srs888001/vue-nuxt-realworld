<template>
  <div class="settings-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Your Settings</h1>

          <form @submit.prevent="onSubmit">
            <fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control"
                  type="text"
                  v-model="userinfo.image"
                  placeholder="URL of profile picture"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  v-model="userinfo.username"
                  required
                  type="text"
                  placeholder="Your Name"
                />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  class="form-control form-control-lg"
                  v-model="userinfo.bio"
                  rows="8"
                  placeholder="Short bio about you"
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  v-model="userinfo.email"
                  required
                  type="text"
                  placeholder="Email"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  v-model="userinfo.password"
                  required
                  minlength="6"
                  type="password"
                  placeholder="Password"
                />
              </fieldset>
              <button class="btn btn-lg btn-primary pull-xs-right">
                Update Settings
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { updateUser } from "@/api/user";

// 仅在客户端加载 js-cookie 包
// process.client是nuxt定义的
const Cookie = process.client ? require("js-cookie") : undefined;

export default {
  name: "SettingsIndex",
  // 在路由匹配组件渲染之前会先执行中间件处理
  middleware: "authenticated",
  data() {
    return {
      userinfo: {
        username: '',
        email: '',
        bio: '',
        image: '',
        password: '******',
      },
    };
  },
  mounted() {
    Object.keys(this.user).forEach((key) => {
      this.userinfo[key] = this.userinfo[key] || this.user[key];
    });
  },
  computed: {
    ...mapState(["user"]),
  },
  methods: {
    async onSubmit() {
      try {
        console.log("Srs1==>", JSON.stringify(this.userinfo));

        let _userinfo = {};
        // 简单这样处理
        Object.keys(this.userinfo).forEach((key) => {
          if(!(key === "password" && this.userinfo[key] === '******')) {
             _userinfo[key] = this.userinfo[key];
          }
        });

        const { data } = await updateUser({
          user: _userinfo,
        });

        // console.log(data)
        // 保存用户的登录状态
        this.$store.commit("setUser", data.user);

        // 为了防止刷新页面数据丢失，我们需要把数据持久化
        Cookie.set("user", JSON.stringify(data.user));

      } catch (err) {}
    },

  },
};
</script>

<style>
</style>