<template>
  <div class="profile-page">
    <div class="user-info">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-md-10 offset-md-1">
            <img :src="profile.image" class="user-img" />
            <h4>{{ profile.username }}</h4>
            <p>
              {{ profile.bio }}
            </p>
            <template v-if="profile.username != user.username">
              <button class="btn btn-sm btn-outline-secondary action-btn">
                <i class="ion-plus-round"></i>
                &nbsp; Follow {{ profile.username }}
              </button>
            </template>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">
        <div class="col-xs-12 col-md-10 offset-md-1">
          <div class="articles-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <nuxt-link
                  exact
                  class="nav-link"
                  :class="{
                    active: favoritespath == null
                  }"
                  :to="{
                    name: 'profile',
                    params: {
                      username: profile.username,
                    },
                  }"
                >
                  My Articles
                </nuxt-link>
              </li>
              <li class="nav-item">
                <nuxt-link
                  exact
                  class="nav-link"
                  :class="{
                    active: favoritespath != null
                  }"
                  :to="{
                    name: 'profile',
                    params: {
                      username: profile.username,
                      favoritespath: 'favorites'
                    },
                  }"
                >
                  Favorited Articles
                </nuxt-link>
              </li>
            </ul>
          </div>

          <div
            class="article-preview"
            v-for="article in my_articles"
            :key="article.slug"
          >
            <div class="article-meta">
              <img :src="article.author.image" />
              <div class="info">
                <nuxt-link
                  class="author"
                  :to="{
                    name: 'profile',
                    params: {
                      username: article.author.username,
                    },
                  }"
                >
                  {{ article.author.username }}
                </nuxt-link>
                <span class="date">
                  {{ article.createdAt | date("MMM DD, YYYY") }}</span
                >
              </div>
              <button class="btn btn-outline-primary btn-sm pull-xs-right">
                <i
                  class="ion-heart"
                  :class="{
                    active: article.favorited,
                  }"
                ></i>
                {{ article.favoritesCount }}
              </button>
            </div>

            <nuxt-link
              class="preview-link"
              :to="{
                name: 'article',
                params: {
                  slug: article.slug,
                },
              }"
            >
              <h1>
                {{ article.favorititletesCount }}
              </h1>
              <p>{{ article.description }}</p>
              <span>Read more...</span>
              <ul class="tag-list" v-for="tag in article.tagList" :key="tag">
                <li class="tag-default tag-pill tag-outline">tag</li>
              </ul>
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getProfiles } from "@/api/profile";
import { getArticles } from "@/api/article";

export default {
  name: "ProfileIndex",
  // 在路由匹配组件渲染之前会先执行中间件处理
  middleware: "authenticated",
  computed: {
    ...mapState(["user"]),
  },
  async asyncData({ params }) {
    const username = params.username;
    const favoritespath = params.favoritespath;

    const limit = 20;
    const offset = 0;
    let articleResBody = {}
    if (favoritespath != null) {
      articleResBody = { favorited: username, limit, offset }
    } else {
      articleResBody = { author: username, limit, offset }
    }

    const [profileRes, articlesRes] = await Promise.all([
      getProfiles(username),
      getArticles(articleResBody),
    ]);
    const profile = profileRes.data.profile;
    const my_articles = articlesRes.data.articles;

    return {
      profile,
      my_articles,
      favoritespath
    };
  },
};
</script>

<style>
</style>