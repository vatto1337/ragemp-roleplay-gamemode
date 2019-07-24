<template>
  <div></div>
</template>

<script>
export default {
  name: "notify",
  data: function() {
    return {};
  },
  methods: {
    notify: function(type, layout, message, time) {
      message = unescape(message);
      var types = ["error", "success", "information", "warning"];
      var layouts = [
        "top",
        "topLeft",
        "topCenter",
        "topRight",
        "center",
        "centerLeft",
        "centerRight",
        "bottom",
        "bottomLeft",
        "bottomCenter",
        "bottomRight"
      ];
      var icons = [
        '<i class="fas fa-exclamation-triangle"></i>',
        '<i class="far fa-check-circle"></i>',
        '<i class="fas fa-info-circle"></i>',
        '<i class="fas fa-exclamation"></i>'
      ];
      // console.log('notty');
      // console.log(message);
      message =
        '<div class="noty-container">' + icons[type] + message + "</div>";
      new Noty({
        type: types[type],
        layout: layouts[layout],
        theme: "relax",
        text: message,
        timeout: time,
        progressBar: true,
        animation: {
          open: "noty_effects_open",
          close: "noty_effects_close"
        }
      }).show();
    }
  }
};
</script>