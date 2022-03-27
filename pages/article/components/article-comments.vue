<template>
  <div>
    <form class="card comment-form" @submit.prevent="onAddComment">
      <div class="card-block">
        <textarea
          v-model="commentBody"
          class="form-control"
          placeholder="Write a comment..."
          rows="3"
        ></textarea>

      </div>
      <div class="card-footer">
        <img :src="user.image" class="comment-author-img" />
        <button class="btn btn-sm btn-primary">
          Post Comment
        </button>
      </div>
    </form>

    <div class="card" v-for="comment in comments" :key="comment.id">
      <div class="card-block">
        <p class="card-text">
          {{ comment.body }}
        </p>
      </div>
      <div class="card-footer">
        <nuxt-link
          class="comment-author"
          :to="{
            name: 'profile',
            params: {
              username: comment.author.username,
            },
          }"
        >
          <img :src="comment.author.image" class="comment-author-img" />
        </nuxt-link>
        &nbsp;
        <nuxt-link
          class="comment-author"
          :to="{
            name: 'profile',
            params: {
              username: comment.author.username,
            },
          }"
        >
          {{ comment.author.username }}
        </nuxt-link>

        <span class="date-posted">
          {{ comment.createdAt | date("MMM DD, YYYY") }}</span
        >
      </div>
    </div>
  </div>
</template>

<script>
import { getComments, addComments } from "@/api/article";
import { mapState } from "vuex";

export default {
  name: "ArticleCommentsIndex",
  props: {
    article: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState(["user"]),
  },
  data() {
    return {
      commentBody: "",
      comments: [],
    };
  },
  async mounted() {
    const { data } = await getComments(this.article.slug);
    this.comments = data.comments;
  },
  methods: {
    async onAddComment() {
        try {
            const { data } = await addComments(this.article.slug, {"comment": {"body": this.commentBody}});
            this.comments.splice(0, 0, data.comment);
            this.commentBody = ""
        } catch (error) {
        }
    },
  },
};
</script>

<style>
</style>