<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-10 offset-md-1 col-xs-12">
          <form @submit.prevent="onDismiss">
            <fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  v-model="article.title"
                  class="form-control form-control-lg"
                  placeholder="Article Title"
                  required
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  v-model="article.description"
                  class="form-control"
                  placeholder="What's this article about?"
                  required
                />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  class="form-control"
                  v-model="article.body"
                  rows="8"
                  placeholder="Write your article (in markdown)"
                  required
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  v-model="article.tagInput"
                  class="form-control"
                  placeholder="Enter tags"
                  @keyup.enter="onTagEnter"
                />
                <div class="tag-list">
                  <span
                    class="tag-default tag-pill"
                    v-for="tag in article.tagList"
                    :key="tag"
                  >
                    <i class="ion-close-round" @click="removeTag(tag)"></i>
                    {{ tag }}
                  </span>
                </div>
              </fieldset>
              <button
                class="btn btn-lg pull-xs-right btn-primary"
                type="button"
                @click="onSubmit"
              >
                Publish Article
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
import { getArticle, updateArticles, createArticles } from "@/api/article";

export default {
  name: "EditorIndex",
  // 在路由匹配组件渲染之前会先执行中间件处理
  middleware: "authenticated",

  async asyncData({ params }) {
    if (!params.slug) {
      return {
        article: {
          title: "",
          description: "",
          body: "",
          tagInput: "",
          tagList: [],
          slug: "",
        },
      };
    }
    const { data } = await getArticle(params.slug);
    const { article } = data;
    article.tagInput = ""

    return {
      article,
      slug: article.slug,
    };
  },
  computed: {
    ...mapState(["user"]),
  },
  methods: {
    async onSubmit() {
      const { data } = this.slug ? await updateArticles( this.slug, this.article ) : await createArticles( this.article )
      this.$router.push({
        name: "article",
        params: {
          slug: data.article.slug,
        },
      });
    },
    async onTagEnter() {
      if (this.article.tagInput === "") {
        return;
      }
      const index = this.article.tagList.indexOf(this.article.tagInput);
      if (index != -1) {
        return;
      }
      this.article.tagList.push(this.article.tagInput);
      this.article.tagInput = "";
    },
    async onDismiss() {},
    async removeTag(tag) {
      console.log("Srs tag:", tag);
      const index = this.article.tagList.indexOf(tag);
      if (index === -1) {
        return;
      }
      this.article.tagList.splice(index, 1);
    },
  },
};
</script>

<style>
</style>