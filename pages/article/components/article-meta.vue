<template>
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
        :to="{
          name: 'profile',
          params: {
            username: article.author.username,
          },
        }"
        class="author"
      >
        {{ article.author.username }}
      </nuxt-link>

      <span class="date"> {{ article.createdAt | date("MMM DD, YYYY") }}</span>
    </div>

    <template v-if="user.username === article.author.username">
      <span ng-show="$ctrl.canModify" class="ng-scope">
        <nuxt-link
          class="btn btn-outline-secondary btn-sm"
          :to="{
            name: 'editor',
            params: {
              slug: article.slug,
            },
          }"
        >
          <i class="ion-edit"></i> Edit Article
        </nuxt-link>

        <button class="btn btn-outline-danger btn-sm" @click="deleteArticle">
          <i class="ion-trash-a"></i> Delete Article
        </button>
      </span>
    </template>

    <template v-else>
      <button
        class="btn btn-sm btn-outline-secondary"
        :class="{
          active: article.author.following,
        }"
      >
        <i class="ion-plus-round"></i>
        &nbsp; Follow {{ article.author.username }}` <span class="counter"></span>
      </button>
      &nbsp;
      <button
        class="btn btn-sm btn-outline-primary"
        :class="{
          active: article.favorited,
        }"
      >
        <i class="ion-heart"></i>
        &nbsp; Favorite Post <span class="counter">({{ article.favoritesCount }})</span>
      </button>
    </template>
  </div>
</template>

    
  </div>
</template>

<script>
import { mapState } from "vuex";
import { deleteArticles } from "@/api/article";

export default {
  name: "ArticleMetaIndex",
  props: {
    article: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState(["user"]),
  },
  methods: {
    async deleteArticle() {
        await deleteArticles(this.article.slug)
        this.$router.push("/?tab=Your_Feed");
    },
  },
};
</script>

<style>
</style>