<template>
  <div class="gui-hud">
    <div
      v-if="youtubeVideo != null"
      :style="`opacity: ${hudStatus > 0 ? '1' : '0'}`"
      class="youtube-player"
    >
      <div :style="`opacity: ${statusF3 == true ? '1' : '0'}`" @click="stopYoutube" class="close">
        <i class="fas fa-window-close"></i>
      </div>
      <iframe
        v-if="youtubeKind == 'youtube#playlist'"
        :style="`opacity: ${statusF3 == true ? '1' : '0'}`"
        :src="'https://www.youtube.com/embed/videoseries?list=' + youtubeVideo + '&autoplay=1&loop=1'"
        frameborder="0"
        allow="autoplay; encrypted-media"
        allowfullscreen
      ></iframe>
      <iframe
        v-if="youtubeKind == 'youtube#video'"
        :style="`opacity: ${statusF3 == true ? '1' : '0'}`"
        width="300"
        height="180"
        :src="'https://www.youtube-nocookie.com/embed/' + youtubeVideo + '?autoplay=1&loop=1'"
        frameborder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      ></iframe>
    </div>
  </div>
</template>

<script>
export default {
  name: "Hud",
  data: function() {
    return {
      youtubeVideo: null,
      youtubeKind: null
    };
  },
  methods: {
    stopYoutube: function() {
      mp.trigger("youtube_stop");
      this.youtubeVideo = null;
    },
    stopForceYoutube: function() {
      this.youtubeVideo = null;
    },
    updateYoutube: function(videoCode, kind) {
      this.youtubeVideo = videoCode;
      this.youtubeKind = kind;
    }
  },
  computed: {
    hudStatus() {
      return this.$store.state.others.hudStatus;
    },
    statusF3() {
      return this.$store.state.others.statusF3;
    }
  },
  mounted: function() {
    // let self = this;
  }
};
</script>