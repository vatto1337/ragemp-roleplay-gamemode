<template>
  <div class="gui-modals">
    <!-- Others -->
    <Ban/>
    <Reports/>
    <gps />
    <bizz ref="bizz" />
    <customs ref="customs" />
    <skins />
    <youtube />
    <clothes ref="clothes" />
    <inventory ref="inventory" />
    <dealership />
    <jobs />
    <factions />
  </div>
</template>

<script>
import Ban from "@/components/modals/ban.vue";
import Reports from "@/components/modals/reports.vue";
import gps from "@/components/modals/gps.vue";
import bizz from "@/components/modals/bizz.vue";
import customs from "@/components/modals/customs.vue";
import skins from "@/components/modals/skins.vue";
import youtube from "@/components/modals/youtube.vue";
import clothes from "@/components/modals/clothes.vue";
import inventory from "@/components/modals/inventory.vue";
import dealership from "@/components/modals/dealership.vue";
import jobs from "@/components/modals/jobs.vue";
import factions from "@/components/modals/factions.vue";

export default {
  name: "Modals",
  components: {
    Ban,
    Reports,
    gps,
    bizz,
    customs,
    skins,
    youtube,
    clothes,
    inventory,
    dealership,
    jobs,
    factions
  },
  mounted: function() {    
    gui.modals[0] = this.$refs.customs;
    gui.modals[1] = this.$refs.bizz;
    gui.modals[2] = this.$refs.clothes;
    gui.modals[3] = this.$refs.inventory;
  }
};
</script>