<template>
  <div class="basic-modal bizz" v-if="activeModal == 8 || activeModal == 9 || activeModal == 12 || activeModal == 17">
    <div v-if="activeModal == 8" class="card">
      <div class="card-header card-header-gta card-header-gta-smaller d-flex align-items-center">
        <div class="modal-title m-0 mr-auto">General store</div>
        <div v-on:click="disableModals" class="cancel-button">
          <i class="fas fa-times"></i>
        </div>
      </div>
      <div class="card-body">
        <div class="bizz-container">
          <div class="scrollable">
            <div v-for="(prod, index) in modalData.products" :key="index" @click="modalData.selected = index"
              :class="modalData.selected == index ? 'entry active' : 'entry'">
              <div class="title">{{prod.title}}</div>
              <div class="price">{{formatMoney(prod.price, 0)}}$</div>
            </div>
          </div>
          <div class="buttons d-flex">
            <button @click="buyBizz(modalData.selected)" class="btn btn-primary"
              :disabled="modalData.selected == null ? true : false">Purchase this item</button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="activeModal == 9" class="card">
      <div class="card-header card-header-gta card-header-gta-smaller d-flex align-items-center">
        <div class="modal-title m-0 mr-auto">Gun Store</div>
        <div v-on:click="disableModals" class="cancel-button">
          <i class="fas fa-times"></i>
        </div>
      </div>
      <div class="card-body">
        <div class="bizz-container">
          <div class="scrollable">
            <div v-for="(prod, index) in modalData.products" :key="index" @click="modalData.selected = index"
              :class="modalData.selected == index ? 'entry active' : 'entry'">
              <div class="title">{{prod.title}}</div>
              <div class="price">{{formatMoney(prod.price, 0)}}$</div>
            </div>
          </div>
          <div class="buttons d-flex">
            <button @click="buyGun(modalData.selected)" class="btn btn-primary"
              :disabled="modalData.selected == null ? true : false">Purchase this item</button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="activeModal == 12" class="card bizz-creator">
      <div class="card-header card-header-gta card-header-gta-smaller d-flex align-items-center">
        <div class="modal-title m-0 mr-auto">Create Business</div>
        <div v-on:click="disableModals" class="cancel-button">
          <i class="fas fa-times"></i>
        </div>
      </div>
      <div class="card-body">
        <div class="bizz-container">
          <div class="scrollable">
            <div class="form-group">
              <label>Title</label>
              <input type="text" v-model="bizzData.title" class="form-control" placeholder="Business title">
            </div>
            <div class="d-flex">
              <div class="form-group mr-2">
                <label>Type</label>
                <input type="number" v-model="bizzData.type" class="form-control" placeholder="Type">
              </div>
              <div class="form-group mr-2">
                <label>Blip</label>
                <input type="number" v-model="bizzData.blipIcon" class="form-control" placeholder="Icon">
              </div>
              <div class="form-group">
                <label>Blip Color</label>
                <input type="number" v-model="bizzData.blipColor" class="form-control" placeholder="Color">
              </div>
            </div>
            <div class="small-scrollable">
              <p class="text-muted small m-0 mb-1 entry">
                Types: (1) 24/7, (2) Pay'n Spray, (3) Bank, (4) Ammo, (5) Ads, (6)
                Clothes, (7) Bar, (8) Barber
              </p>
              <p class="text-muted small m-0 mb-2 entry">
                Blips: (52) 24/7, (72) Pay'n Spray, (500) Bank, (567) Ammo, (590)
                Ads, (73) Clothes, (93) Bar, (71) Barber
              </p>
              <p class="text-muted small m-0 mb-2 entry">Colors: (4) Gray, (1) Red, (2) - Green, (5) Yellow, (23) Pink
              </p>
            </div>
            <div class="form-group">
              <label class="mb-1">Entrance</label>
              <p class="text-muted small coord" v-if="bizzData.haveEntrance == true && bizzData.entrance != null">
                Entrance:
                {{bizzData.entrance}}
              </p>
              <p class="text-muted small coord" v-if="bizzData.haveEntrance == true && bizzData.exit != null">
                Exit:
                {{bizzData.exit}}
              </p>
              <div class="d-flex align-items-center">
                <button v-on:click="bizzData.haveEntrance = (bizzData.haveEntrance == false ? true: false)"
                  class="btn btn-block btn-primary m-0">Has entrance: {{bizzData.haveEntrance}}</button>
                <button :disabled="currentPosition == null" class="btn btn-block btn-secondary ml-auto m-0"
                  v-if="bizzData.haveEntrance == true" @click="bizzData.entrance = currentPosition">
                  Set
                  entrance
                </button>
                <button :disabled="currentPosition == null" v-if="bizzData.haveEntrance == true"
                  class="btn btn-block btn-primary mr-2 m-0" @click="bizzData.exit = currentPosition">Set exit</button>
              </div>
            </div>
            <div class="form-group">
              <label class="mb-1">Buy point</label>
              <p class="text-muted small coord" v-if="bizzData.haveBuyPoint == true && bizzData.buyPoint != null">
                {{bizzData.buyPoint}}</p>
              <button @click="bizzData.haveBuyPoint = (bizzData.haveBuyPoint == true ? false : true)"
                class="btn btn-block btn-primary">Has buy point: {{bizzData.haveBuyPoint}}</button>
              <button :disabled="currentPosition == null" class="mr-1 btn btn-block btn-primary"
                v-if="bizzData.haveBuyPoint == true" @click="bizzData.buyPoint = currentPosition">Set position</button>
            </div>
            <div class="form-group">
              <label class="mb-1">Rob point</label>
              <p class="text-muted small coord" v-if="bizzData.haveRobPoint == true && bizzData.robPoint != null">
                {{bizzData.robPoint}}</p>
              <button @click="bizzData.haveRobPoint = (bizzData.haveRobPoint == true ? false : true)"
                class="btn btn-block btn-primary">Has rob point: {{bizzData.haveRobPoint}}</button>
              <button :disabled="currentPosition == null" class="mr-1 btn btn-block btn-primary"
                v-if="bizzData.haveRobPoint == true" @click="bizzData.robPoint = currentPosition">Set position</button>
            </div>
            <div class="form-group">
              <label>IPLS</label>
              <div class="d-flex">
                <input v-model="iplText" class="form-control" type="text">
                <button @click="addIpl" class="btn btn-primary">Add</button>
              </div>
              <div v-if="bizzData.ipls && bizzData.ipls.length > 0" class="small-scrollable">
                <p v-for="(ipl,index) in bizzData.ipls" :key="index"
                  class="mt-2 text-muted small">
                  IPL Loaded: {{ipl}} -
                  <span @click="bizzData.ipls.splice(index, 1)" class="text-danger">
                    Delete
                    this
                  </span>
                </p>
              </div>
            </div>
            <div class="form-group">
              <label>Extra Points</label>
              <div class="d-flex">
                <button @click="bizzData.haveExtra = (bizzData.haveExtra == true ? false : true)"
                  class="btn btn-primary btn-block m-0">Has Extra: {{bizzData.haveExtra}}</button>
                <button v-if="bizzData.haveExtra == true" @click="addExtra"
                  class="btn btn-block btn-primary m-0 ml-2">Add Extra</button>
              </div>
              <div v-if="bizzData.haveExtra == true && bizzData.extraPoints != null" class="small-scrollable">
                <div class="entry mb-2 p-2" v-for="(extra, index) in bizzData.extraPoints" :key="index">
                  <div class="form-group w-100 d-flex flex-column align-items-center justify-content-center">
                    <input type="text" class="form-control mb-1" v-model="extra.message">
                    <input type="text" class="form-control mb-1" v-model="extra.command">
                    <div class="d-flex w-100">
                      <button v-on:click="deleteExtra(index)" class="btn btn-block btn-primary text-danger m-0">
                        Delete
                        this extra {{index}}
                      </button>
                      <button :disabled="currentPosition == null"
                        @click="extra.x = currentPosition.x, extra.y = currentPosition.y, extra.z = currentPosition.z"
                        class="btn btn-block btn-primary m-0 ml-2">Set position</button>
                    </div>
                    <p class="text-muted small py-2">Coords: {{extra.x + ',' + extra.y + ','+ extra.z }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!--  -->
          <hr>
          <div class="d-flex justify-content-center align-items-center my-2 mb-3">
            <button @click="getCurrentPosition" class="btn btn-primary mr-1">Get current position</button>
            <button @click="saveBusiness" class="btn btn-primary mr-1">Create this business</button>
            <button @click="bizzData = original_bizzData, currentPosition = null"
              class="btn btn-primary ml-2">Reset</button>
          </div>
          <div v-if="currentPosition != null" class="d-flex justify-content-center align-items-center py-1">
            <p class="m-0 text-muted small">
              Current saved position: {{currentPosition.x}}, {{currentPosition.y}},
              {{currentPosition.z}} with angle: {{currentPosition.angle}}
            </p>
          </div>
        </div>
      </div>
    </div>
    <div v-if="activeModal == 17" class="card">
      <div class="card-header card-header-gta card-header-gta-smaller d-flex align-items-center">
        <div class="modal-title m-0 mr-auto">Premium Shop</div>
        <div v-on:click="disableModals" class="cancel-button">
          <i class="fas fa-times"></i>
        </div>
      </div>
      <div class="card-body">
        <div class="bizz-container">
          <div class="scrollable">
            <div v-for="(prod, index) in modalData.products" :key="index" @click="modalData.selected = index"
              :class="modalData.selected == index ? 'entry active' : 'entry'">
              <div class="title">{{prod.title}}</div>
              <div class="price">{{formatMoney(prod.price, 0)}} <i class="fas fa-coins"></i></div>
            </div>
          </div>
          <div class="buttons d-flex">
            <button @click="buyShop(modalData.selected)" class="btn btn-primary"
              :disabled="modalData.selected == null ? true : false">Purchase this item</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Business",
    data: function () {
      return {
        currentPosition: null,
        iplText: "",
        bizzData: {
          title: "",
          haveEntrance: false,
          haveBuyPoint: false,
          haveRobPoint: false,
          haveExtra: false,
          type: 0,
          blipIcon: 0,
          blipColor: 0,
          price: 0,
          level: 0,
          entrance: null,
          exit: null,
          ipls: null,
          buyPoint: null,
          robPoint: null,
          extraPoints: null
        },
        original_bizzData: {
          title: "",
          haveEntrance: false,
          haveBuyPoint: false,
          haveRobPoint: false,
          haveExtra: false,
          type: 0,
          blipIcon: 0,
          blipColor: 0,
          price: 0,
          level: 0,
          entrance: null,
          exit: null,
          ipls: null,
          buyPoint: null,
          robPoint: null,
          extraPoints: null
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
      buyShop: function(index) {
        mp.trigger("buyFromShop", index);
      },
      deleteExtra: function (index) {
        this.bizzData.extraPoints.splice(index, 1);
      },
      addExtra: function () {
        if (this.bizzData.extraPoints == null) {
          this.bizzData.extraPoints = [];
        }
        this.bizzData.extraPoints.push({
          x: 0,
          y: 0,
          z: 0,
          message: "Message here",
          command: "command"
        });
      },
      addIpl: function () {
        if (this.bizzData.ipls == null) {
          this.bizzData.ipls = [];
        }
        console.log(this.bizzData.ipls);
        this.bizzData.ipls.push(this.iplText);
      },
      saveBusiness: function () {
        mp.trigger("bizz_saveBusiness", JSON.stringify(this.bizzData));
      },
      setCurrentPosition: function (x, y, z, angle) {
        this.currentPosition = {
          x: parseFloat(x),
          y: parseFloat(y),
          z: parseFloat(z),
          angle: parseFloat(angle)
        };
      },
      getCurrentPosition: function () {
        mp.trigger("bizz_getCurrentPosition");
      },
      disableModals: function () {
        appData.commit("others/disableModals");
      },
      buyBizz: function (index) {
        let item = this.modalData.products[index];
        mp.trigger("bizz_buyItem", item.price, index, this.modalData.bizz);
      },
      formatMoney: function (n, c, d, t) {
        var c = isNaN((c = Math.abs(c))) ? 2 : c,
          d = d == undefined ? "." : d,
          t = t == undefined ? "," : t,
          s = n < 0 ? "-" : "",
          i = String(parseInt((n = Math.abs(Number(n) || 0).toFixed(c)))),
          j = (j = i.length) > 3 ? j % 3 : 0;
        return (
          s +
          (j ? i.substr(0, j) + t : "") +
          i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) +
          (c
            ? d +
            Math.abs(n - i)
              .toFixed(c)
              .slice(2)
            : "")
        );
      },
      buyGun: function (index) {
        let item = this.modalData.products[index];
        // console.log(item);
        mp.trigger(
          "bizz_buyGun",
          item.title,
          item.price,
          item.weapon_name,
          item.ammo,
          this.modalData.bizz
        );
      }
    }
  };
</script>