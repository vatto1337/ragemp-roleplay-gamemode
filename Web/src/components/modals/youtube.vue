<template>
  <div class="basic-modal youtube" v-if="activeModal == 11">
    <div class="card">
      <div class="card-header card-header-gta card-header-gta-smaller d-flex align-items-center">
        <div class="modal-title m-0 mr-auto">
          <i class="fab fa-youtube"></i> Youtube
        </div>
        <div v-on:click="disableModals" class="cancel-button">
          <i class="fas fa-times"></i>
        </div>
      </div>
      <div class="card-body">
        <div class="youtube-container">
          <div class="form-group d-flex">
            <input
              type="text"
              class="form-control"
              placeholder="Type here your youtube video title.."
              v-model="modalData.youtube.search"
            >
            <button @click="youtubeSearch" class="d-block btn btn-primary ml-2">Search</button>
          </div>
          <div class="scrollable">
            <div v-for="(video, index) in modalData.youtube.result" :key="index" class="entry">
              <div class="d-flex align-items-center">
                <div
                  class="video-thumbnail"
                  :style="'background-image: url(' + video.thumbnails.default.url +')'"
                ></div>
                <h1 class="title">{{video.title}}</h1>
                <div @click="playVideo(video.link, video.title, video.kind)" class="play">Play</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import youtubeSearch from "youtube-search";

export default {
  name: "Youtube",
  data: function() {
    return {
      youtube_spam: {
        play: 0,
        search: 0
      }
    };
  },
  computed: {
    modalData() {
      return this.$store.state.others.modalData;
    },
    activeModal() {
      return this.$store.state.others.activeModal;
    }
  },
  methods: {
    playVideo: function(url, title, kind) {
      if (kind == "youtube#video" || kind == "youtube#playlist") {
        if (this.youtube_spam.play > 0)
          return Swal({
            title: "Error!",
            text:
              "Wait " +
              this.youtube_spam.play +
              " seconds before playing something else.",
            type: "error",
            confirmButtonText: "Ok"
          });
        this.youtube_spam.play = 10;
        mp.trigger("youtube_playVideo", url, title, kind);
      } else {
        Swal({
          title: "Error!",
          text: "Format invalid. Choose a video or playlist.",
          type: "error",
          confirmButtonText: "Ok"
        });
      }
    },
    youtubeSearch: function() {
      var opts = {
        maxResults: 5,
        key: "AIzaSyD8X5-vGIY7upwit-Ze-Kv1FohzXFTKPM4"
      };

      let self = this;

      youtubeSearch(this.modalData.youtube.search, opts, function(
        err,
        results
      ) {
        if (err) console.log(err);

        if (err != null)
          return Swal({
            title: "Error!",
            text: "Youtube API Error. Try again later.",
            type: "error",
            confirmButtonText: "Ok"
          });
        if (results.length < 1)
          return Swal({
            title: "Error!",
            text: "0 Results for: " + self.modalData.youtube.search,
            type: "error",
            confirmButtonText: "Ok"
          });
        if (self.youtube_spam.search > 0)
          return Swal({
            title: "Error!",
            text:
              "Wait " +
              self.youtube_spam.search +
              " seconds before searching something else.",
            type: "error",
            confirmButtonText: "Ok"
          });
        self.youtube_spam.search = 30;
        self.modalData.youtube.result = results;
      });
    },
    disableModals: function() {
      appData.commit("others/disableModals");
    }
  },
  mounted() {
    setInterval(() => {
      if(this.activeModal != 11) return;
      if (this.youtube_spam.play > 0) {
        this.youtube_spam.play--;
      }
      if (this.youtube_spam.search > 0) {
        this.youtube_spam.search--;
      }
    }, 1000);
  }
};
</script>

