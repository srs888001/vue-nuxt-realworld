<template>
  <div class="home-page">
    <div class="banner">
      <div class="container">
        <h1 class="logo-font">conduit</h1>
        <p>A place to share your knowledge.</p>
      </div>
    </div>

    <div class="container page">
      <div class="row">
        <div class="col-md-9">
          <div class="feed-toggle">
            <ul class="nav nav-pills outline-active">
              <li v-if="user" class="nav-item">
                <nuxt-link
                  exact
                  class="nav-link"
                  :class="{
                    active: tab === 'Your_Feed',
                  }"
                  :to="{
                    name: 'home',
                    query: { tab: 'Your_Feed' },
                  }"
                  >Your Feed</nuxt-link
                >
              </li>

              <li class="nav-item">
                <nuxt-link
                  exact
                  class="nav-link"
                  :class="{
                    active: tab === 'Global_Feed',
                  }"
                  :to="{
                    name: 'home',
                    query: { tab: 'Global_Feed' },
                  }"
                  >Global Feed</nuxt-link
                >
              </li>

              <li v-if="tag" class="nav-item">
                <nuxt-link
                  exact
                  class="nav-link"
                  :class="{
                    active: tab === 'tag',
                  }"
                  :to="{
                    name: 'home',
                    query: { tab: 'tag', tag: tag },
                  }"
                  ># {{ tag }}</nuxt-link
                >
              </li>
            </ul>
          </div>

          <div
            class="article-preview"
            v-for="article in articles"
            :key="article.slug"
          >
            <div class="article-meta">
              <nuxt-link
                :to="{
                  name: 'profile',
                  params: {
                    username: article.author.username,
                  },
                }"
              >
                <img :src="article.author.image" />
              </nuxt-link>
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

                <!-- 管道符号 使用data过滤器 -->
                <span class="date"> {{ article.createdAt | date('MMM DD, YYYY') }}</span>
              </div>
              <button
                class="btn btn-outline-primary btn-sm pull-xs-right"
                :class="{
                  active: article.favorited,
                }"
                @click="updateFavorited(article)"
                :disabled="article.favoriteDisabled"
              >
                <i class="ion-heart"></i> {{ article.favoritesCount }}
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
              <h1>{{ article.title }}</h1>
              <p>{{ article.description }}</p>
              <span>Read more...</span>
            </nuxt-link>
          </div>

          <!-- 分页列表 -->
          <nav>
            <ul class="pagination">
              <li
                class="page-item"
                :class="{
                  active: item === pageIndex,
                }"
                v-for="item in totalPage"
                :key="item"
              >
                <nuxt-link
                  class="page-link"
                  :to="{
                    name: 'home',
                    query: {
                      page: item,
                      tag: $route.query.tag,
                      tab: tab
                    },
                  }"
                  >{{ item }}</nuxt-link
                >
              </li>
            </ul>
          </nav>
        </div>
        <!-- /分页列表 -->
        <div class="col-md-3">
          <div class="sidebar">
            <p>Popular Tags</p>

            <div class="tag-list">
              <nuxt-link
                :to="{
                  name: 'home',
                  query: {
                    tab: 'tag',
                    tag: item,
                  },
                }"
                class="tag-pill tag-default"
                v-for="item in tags"
                :key="item"
                >{{ item }}</nuxt-link
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getArticles, getYourFeedArticles, addFavorite, deleteFavorite } from "@/api/article";
import { getTags } from "@/api/tag";
import { mapState } from 'vuex'

export default {
  name: "HomeIndex",
  async asyncData({ query }) {
    const pageIndex = Number.parseInt(query.page || 1);
    const limit = 20;
    const tag = query.tag;
    const tab = query.tab || "Global_Feed";
    const loadArticles = tab === 'Your_Feed'
      ? getYourFeedArticles 
      : getArticles

    const [articleRes, tagsRes] = await Promise.all([
      loadArticles({
        limit,
        offset: (pageIndex - 1) * limit,
        tag,
      }),
      getTags(),
    ]);

    const { articles, articlesCount } = articleRes.data;
    const { tags } = tagsRes.data;

    // 记录是否可以点击
    articles.forEach(article => {
      article.favoriteDisabled = false;
    });

    return {
      articles,
      articlesCount,
      tags,
      limit,
      pageIndex,
      tab,
      tag,
    };
  },
  // url变化会出现asyncData
  watchQuery: ["page", "tag", "tab"],
  computed: {
    ...mapState(['user']),
    totalPage() {
      return Math.ceil(this.articlesCount / this.limit);
    },
  },
  methods: {
    async updateFavorited(article) {
      article.favoriteDisabled = true;
      if (article.favorited) {
        await deleteFavorite(article.slug);
        article.favorited = false;
        article.favoritesCount -= 1;
      } else {
        await addFavorite(article.slug);
        article.favorited = true;
        article.favoritesCount += 1;
      }
      article.favoriteDisabled = false;
    }
  }
};
</script>

<style>
</style>