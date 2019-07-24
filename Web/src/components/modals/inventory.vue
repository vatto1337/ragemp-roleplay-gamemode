<template>
  <div class="basic-modal" v-if="activeModal == 14 || activeModal == 15">
    <div class="inventory-screen" v-if="activeModal == 14">
      <div class="left-screen">
        <div class="left-options">
          <div v-tooltip="'Account stats'" @click="modalData.selectedPage = 1"
            :class="modalData.selectedPage == 1 ? 'entry active' : 'entry'">
            <i class="fas fa-user-circle"></i>
          </div>
          <div v-tooltip="'Players online'" @click="modalData.selectedPage = 2"
            :class="modalData.selectedPage == 2 ? 'entry active' : 'entry'">
            <i class="fas fa-users"></i>
          </div>
          <div v-tooltip="'Server Guide'" @click="modalData.selectedPage = 3"
            :class="modalData.selectedPage == 3 ? 'entry active' : 'entry'">
            <i class="fas fa-book"></i>
          </div>
          <div v-tooltip="'Server Commands'" @click="modalData.selectedPage = 4"
            :class="modalData.selectedPage == 4 ? 'entry active' : 'entry'">
            <i class="fas fa-question"></i>
          </div>
          <div v-tooltip="'Jobs skills'" @click="modalData.selectedPage = 5"
            :class="modalData.selectedPage == 5 ? 'entry active' : 'entry'">
            <i class="fas fa-briefcase"></i>
          </div>
        </div>
        <div class="page" v-if="modalData.selectedPage == 1">
          <h1 class="page-title">{{modalData.owner == modalData.viewer ? 'Account' : modalData.owner + "'s Account" }}
          </h1>
          <div class="page-container">
            <div class="info-entry">
              <div class="text">Level</div>
              <div class="value">{{modalData.info.level}}</div>
            </div>
            <div v-if="modalData.info.admin != 0" class="info-entry">
              <div class="text">Admin</div>
              <div class="value">{{ modalData.info.admin }}</div>
            </div>
            <div v-if="modalData.info.premium != 0" class="info-entry">
              <div class="text">Premium</div>
              <div class="value">{{ modalData.info.premium > 24 ? (modalData.info.premium / 24).toFixed(0) + ' days' : (modalData.info.premium).toFixed(0) + ' hours' }}</div>
            </div>
            <div class="info-entry">
              <div class="text">Cash</div>
              <div class="value">{{ formatMoney(modalData.info.wallet, 0)}}$</div>
            </div>
            <div class="info-entry">
              <div class="text">Bank</div>
              <div class="value">{{ formatMoney(modalData.info.bank, 0)}}$</div>
            </div>
            <div class="info-entry">
              <div class="text">Warns</div>
              <div class="value">{{modalData.info.warns}}/3</div>
            </div>
            <div class="info-entry">
              <div class="text">Gender</div>
              <div class="value">{{modalData.info.character.gender == 0 ? 'Male' : 'Female'}}</div>
            </div>
            <div class="info-entry">
              <div class="text">Respect Points</div>
              <div class="value">{{ modalData.info.respect + '/' + ( modalData.info.level * 4 - 2 )}}</div>
            </div>
            <div class="info-entry">
              <div class="text">Next level price</div>
              <div class="value">{{ formatMoney(modalData.info.level * 250, 0)}}$</div>
            </div>
            <div class="info-entry">
              <div class="text">Hours played</div>
              <div class="value">{{modalData.info.hoursPlayed}}</div>
            </div>
            <div class="info-entry">
              <div class="text">Crimes committed</div>
              <div class="value">{{modalData.info.crimes}}</div>
            </div>
            <div class="info-entry">
              <div class="text">Personal vehicles slots</div>
              <div class="value">{{modalData.info.inventory.filter(item => item.type == 15).length + '/' + modalData.info.personalSlots}}</div>
            </div>
          </div>
        </div>
        <div class="page" v-if="modalData.selectedPage == 2">
          <div class="page-title">{{modalData.players.length }} players online</div>
          <div class="page-container">
            <div v-if="getClass('civillians').length > 0">
              <div class="page-subtitle">
                <div class="text">Civillians</div>
                <div class="value">{{getClass('civillians').length}}</div>
              </div>
              <div v-for="(x, index) in getClass('civillians')" v-bind:key="index" class="online-entry">
                <div class="text">
                  {{x.name}} ({{x.id}}) 
                  <span v-if="x.admin != 0" class="badge bg-warning text-dark small rounded p-2 ml-2">{{x.admin == 1337 ? 'Owner' : 'Admin ' + x.admin}}</span>
                  <span v-if="x.premium != 0" class="badge bg-purple text-white small rounded p-2 ml-2">Premium</span>
                </div>
                <div class="value">
                  {{x.ping}}
                  <i class="fas fa-signal ml-1" :style="x.ping > 50 ? 'color: red' : 'color: green'"></i>
                </div>
              </div>
            </div>
              <div class="mb-4" v-if="getClass('premium').length > 0">
              <div class="page-subtitle">
                <div class="value">{{getClass('premium').length}}</div>
                <div class="text">Premium</div>
              </div>
              <div v-for="(x, index) in getClass('premium')" v-bind:key="index" class="online-entry">
                <div class="text">
                  {{x.name}} ({{x.id}}) 
                </div>
                <div class="value">
                  {{x.ping}}
                  <i class="fas fa-signal ml-1" :style="x.ping > 50 ? 'color: red' : 'color: green'"></i>
                </div>
              </div>
            </div>
            <div class="mb-4" v-if="getClass('admins').length > 0">
              <div class="page-subtitle">
                <div class="value">{{getClass('admins').length}}</div>
                <div class="text">Administrators</div>
              </div>
              <div v-for="(x, index) in getClass('admins')" v-bind:key="index" class="online-entry">
                <div class="text">
                  {{x.name}} ({{x.id}}) 
                  <span v-if="x.admin != 0" class="badge bg-warning text-dark small rounded p-2 ml-2">{{x.admin == 1337 ? 'Community Founder' : 'Admin ' + x.admin}}</span>
                </div>
                <div class="value">
                  {{x.ping}}
                  <i class="fas fa-signal ml-1" :style="x.ping > 50 ? 'color: red' : 'color: green'"></i>
                </div>
              </div>
            </div>
            <div class="mb-4" v-if="getFaction(0).length > 0">
              <div class="page-subtitle mt-3">
                <div class="value">{{getFaction(0).length}}</div>
                <div class="text">Police Department</div>
              </div>
              <div v-for="(x, index) in getFaction(0)" v-bind:key="index" class="online-entry">
                <div class="text">
                  {{x.name}} ({{x.id}}) 
                  <span v-if="x.leader != null" class="badge bg-info text-white small rounded p-2 ml-2">Leader</span>
                  <span v-if="x.leader == null" class="badge bg-success text-white small rounded p-2 ml-2">Rank {{x.rank}}</span>
                </div>
                <div class="value">
                  {{x.ping}}
                  <i class="fas fa-signal ml-1" :style="x.ping > 50 ? 'color: red' : 'color: green'"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="page" v-if="modalData.selectedPage == 3">
          <div class="page-title">Guide</div>
          <div class="page-container">
            <div class="question-scrollable">
              <div class="question-entry">
                <div class="question">Question: How do i get respect points ?</div>
                <div class="answer">For every hour spent in-game you'll get a respect point.</div>
              </div>
              <div class="question-entry">
                <div class="question">Question: How do i advance in level ?</div>
                <div class="answer">Type <b>/buylevel</b> in chat when you have enough respect and money.
                </div>
              </div>
              <div class="question-entry">
                <div class="question">Question: How do i get a job ?</div>
                <div class="answer">Type <b>/jobs</b> in chat and then choose what job you wish to have.</div>
              </div>
              <div class="question-entry">
                <div class="question">Question: How can i do a screenshot ?</div>
                <div class="answer">Press <b>Key F8</b> to screenshot in-game content.</div>
              </div>
              <div class="question-entry">
                <div class="question">Question: How can i hide game interfaces ?</div>
                <div class="answer">Press <b>Key F7</b> to hide & show them.</div>
              </div>
              <div class="question-entry">
                <div class="answer">More questions will be answered soon.</div>
              </div>
            </div>
          </div>
        </div>
        <div class="page" v-if="modalData.selectedPage == 4">
          <div class="page-title">Commands</div>
          <div class="page-container">
            <div class="command-title">Account</div>
            <div class="command">/stats /buylevel /licenses /changepassword /report /me</div>
            <div class="command">/findhouse /findbizz /id /n /tog /changespawn /gps /eject</div>
            <div class="command">/trade /shop</div>
            <div class="command-title">Phone</div>
            <div class="command">/call /number /p(ickup) /h(angup) /sms /youtube</div>
            <div class="command-title">Animations</div>
            <div class="command">/muscle /bird /faceplam /prostitute /sit</div>
            <div class="command">/chairsit /sleep /partying /cheering /leaning</div>
            <div class="command">/yoga /dance /handsbehind /handsup /holdhands</div>
            <!-- <div v-if="modalData.info.premium != 0">
              <div class="command-title">Premium</div>
              <div class="command">/(p)remium(c)hat</div>
            </div> -->
            <div v-if="modalData.info.leader != null">
              <div class="command-title">Leader commands</div>
              <div class="command">/lc /(un)invite /(un)fwarn /fmotd /fvr</div>
            </div>
              <div v-if="modalData.info.member != null">
              <div class="command-title">Faction commands</div>
              <div v-if="modalData.info.member == 0" class="command">/d /members /megaphone /suspect /mdc /(un)cuff /frisk /ticket /confiscate /arrest /wanted</div>
            </div>
            <div v-if="modalData.info.admin != 0">
              <div class="command-title">Administrator commands</div>
              <div class="command">
                <b>Admin 1</b> - /a /pm /aduty /goto /gotoxyz /cmc /reports /(un)mute /slap
              </div>
              <div class="command">
                <b>Admin 2</b> - /gethere /gotowarp /totowarp /warps /getveh /setmask /disarm /respawn /gotoveh
                /sethp /setdimension /setarmour /setskin
              </div>
              <div class="command">
                <b>Admin 3</b> - /givegun /check /rac /fixveh /mark /gotomark /kick /clearchat /(un)freeze
              </div>
              <div class="command">
                <b>Admin 4</b> - /warn /tod /setweather /agl /agps /awarps
              </div>
              <div class="command">
                <b>Admin 5</b> - /givemoney /takemony /setmoney /setbank /(un)ban
              </div>
              <div class="command">
                <b>Admin 6</b> - /givetoall /aevent
              </div>
              <div class="command">
                <b>Admin 7</b> - /sm /o /pb /ahouse
              </div>
              <div class="command">
                <b>Admin 8</b> - /makeadmin /restartserver /setinfo /reloaddata /savedata
              </div>
            </div>
          </div>
        </div>
        <div class="page job-skills" v-if="modalData.selectedPage == 5">
          <div class="page-title">Job Skills 
            <span v-if="modalData.info.job != null" class="small"><br>Current job: {{ modalData.info.jobSkills[modalData.info.job].title }}</span>
            <span v-if="modalData.info.paycheck > 0" class="paycheck">Next paycheck: {{formatMoney(modalData.info.paycheck, 0)}}$</span>
          </div>
          <div class="page-container">
            <div class="job-entry" v-for="(job, index) in modalData.info.jobSkills" :key=index>
              <div class="info">
                <div class="job-title">{{job.title}}</div>
                <div class="job-level">Level {{job.level}}</div>
                <div class="job-image" :style="{ backgroundImage: 'url(' + `assets/images/jobs/${index}.png` + ')' }"></div>
              </div>
              <div class="progress">
                  <div class="progress-bar progress-bar-striped" role="progressbar" v-bind:style="{width: getSkillPercentage(job.currentPoints, job.neededPoints) + '%'}" :aria-valuenow="job.currentPoints" aria-valuemin="0" :aria-valuemax="job.neededPoints">
                    <div class="current-skill">{{job.currentPoints}} / {{job.neededPoints}}</div>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="connected-time">
        {{ modalData.viewer == modalData.owner ? "You've" : modalData.owner }} started playing
        {{ getTime(modalData.connectedTime) }}.
      </div>
      <div class="inventory-container">
        <div class="inventory-header">
          <h1>{{modalData.owner == modalData.viewer ? 'Inventory' : modalData.owner + "'s Inventory" }}</h1>
          <div v-on:click="disableModals" class="cancel-button">
            <i class="fas fa-times"></i>
          </div>
        </div>
        <div class="inventory" v-if="modalData != null">
          <div v-if="modalData.info.inventory.length > 0" class="items-scrollable">
            <div @click="modalData.selectedItem = index, modalData.bullets = (item.type == 11 ? item.quantity : 0)"
              :class="modalData.selectedItem == index ? 'entry active': 'entry'"
              v-for="(item, index) in modalData.info.inventory" :key="index">
              <div v-if="item.type == 0" v-tooltip="item.title + `<br>Number: ${formatMoney(item.number, 0, '-', '-')}`"
                class="item-image"
                :style="{ backgroundImage: 'url(' + `assets/images/inventory/${item.type}.png` +')' }"></div>
              <div v-else-if="item.type == 11" v-tooltip="item.title" class="item-image"
                :style="{ backgroundImage: 'url(' + `assets/images/inventory/weapons/${item.weapon_name}.png` +')' }">
              </div>
              <div v-else-if="item.type == 12"
                v-tooltip="`House ${item.house_id} Key${modalData.info.houseSpawn == item.house_id && modalData.info.spawn == 1 ? '<br>Primary spawn' : ''}`"
                class="item-image"
                :style="{ backgroundImage: 'url(' + `assets/images/inventory/${item.type}.png` +')' }"></div>
              <div v-else-if="item.type == 13"
                v-tooltip="`House ${item.house_id} Contract${modalData.info.houseSpawn == item.house_id && modalData.info.spawn == 1 ? '<br>Primary spawn' : ''}`"
                class="item-image"
                :style="{ backgroundImage: 'url(' + `assets/images/inventory/${item.type}.png` +')' }"></div>
              <div v-else-if="item.type == 14" v-tooltip="`Business ${item.business_id} Contract`" class="item-image"
                :style="{ backgroundImage: 'url(' + `assets/images/inventory/${item.type}.png` +')' }"></div>
              <div v-else-if="item.type == 15"
                v-tooltip="`<b>${item.spawned == false ? item.modelName : item.modelName + ' (' + item.spawnedIndex + ')'}</b><br>Vehicle Key<br> ${item.spawned == true ? (item.despawnSeconds ? '<b>Despawn in ' + (item.despawnSeconds / 60).toFixed(0) + ' minutes' : '') : 'Not spawned'}`"
                class="item-image"
                :style="{ backgroundImage: 'url(' + `assets/images/inventory/${item.type}.png` +')' }"></div>
              <div v-else v-tooltip="item.title" class="item-image"
                :style="{ backgroundImage: 'url(' + `assets/images/inventory/${item.type}.png` +')' }"></div>
              <div v-if="item.stackable == true" class="quantity">{{item.quantity}}</div>
            </div>
          </div>
          <div class="items-scrollable d-flex align-items-center justify-content-center" v-else>Empty inventory.</div>
          <div class="inventory-buttons">
            <div class="d-flex align-items-center">
              <button v-if="modalData.owner == modalData.viewer || modalData.admin > 3"
                :disabled="modalData.selectedItem == null" @click="useItem(modalData.selectedItem)"
                class="btn btn-primary m-0 mr-4">Use item</button>
              <button v-if="modalData.owner == modalData.viewer || modalData.admin > 3"
                :disabled="modalData.selectedItem == null" @click="dropItem(modalData.selectedItem)"
                class="btn btn-primary m-0">Destroy item</button>
              <button :disabled="modalData.selectedItem == null" @click="confiscateItem(modalData.selectedItem)"
                v-if="modalData.admin > 5 && modalData.owner != modalData.viewer"
                class="btn btn-danger m-0 ml-4">Confiscate item</button>
            </div>
          </div>
        </div>
        <div class="ammo"
          v-if="modalData.selectedItem != null && modalData.info.inventory[modalData.selectedItem].type == 11">
          <input class="mr-2" v-model="modalData.bullets" type="range" min="1"
            :max="modalData.info.inventory[modalData.selectedItem].quantity">
          <p class="m-0 ml-2">Take {{modalData.bullets}} bullets.</p>
        </div>
      </div>
    </div>
    <div class="trade-screen" v-if="activeModal == 15">

      <div class="offer-instructions">
        <div class="text">
          <h1>{{modalData.yourName}} is trading with {{modalData.hisName}}.</h1>
          <h2>* Add the items you wish to your offer.</h2>
          <h2>* Click on ready to trade to lock your offer.</h2>
          <h2>* Click on accept trade to finish it.</h2>
          <h2>Your accept: {{modalData.yourAccept}}</h2>
          <h2>his accept: {{modalData.hisAccept}}</h2>
        </div>
        <div class="buttons">
          <button v-if="modalData.yourReady == true && modalData.hisReady == true" @click="finishTrade"
            :class="modalData.yourAccept == false ? 'btn btn-success m-0' : 'btn btn-danger m-0'">{{ modalData.yourAccept == false ? 'Accept trade' : "Decline trade" }}</button>
          <button :disabled="modalData.yourAccept == true || modalData.hisAccept == true" @click="switchTradeStatus"
            class="btn btn-primary m-0 ml-2">{{ modalData.yourReady == false ? "Ready to trade" : "Change offer" }}</button>
          <button @click="disableModals" class="btn btn-danger m-0 ml-2">Exit trade</button>
        </div>
      </div>
      <div class="trade-center">
        <div class="left-screen">
          <div class="your-inventory">
            <div class="header">Your inventory <span class="instruction-offer m-0 ml-auto small">(Click to add items to your offer)</span>
            </div>
            <div class="items-scrollable">
              <div @click="addToOffer(index)"
                :class="item.canBeTradable == false ? 'entry disabled' : (item.markedForTrade == true ? 'entry traded' : 'entry')"
                v-for="(item, index) in modalData.yourInventory" :key="index">
                <div v-if="item.type == 0"
                  v-tooltip="item.title + `<br>Number: ${formatMoney(item.number, 0, '-', '-')}`" class="item-image"
                  :style="{ backgroundImage: 'url(' + `assets/images/inventory/${item.type}.png` +')' }">
                </div>
                <div v-else-if="item.type == 11" v-tooltip="item.title" class="item-image"
                  :style="{ backgroundImage: 'url(' + `assets/images/inventory/weapons/${item.weapon_name}.png` +')' }">
                </div>
                <div v-else-if="item.type == 12" v-tooltip="`House ${item.house_id} Key`" class="item-image"
                  :style="{ backgroundImage: 'url(' + `assets/images/inventory/${item.type}.png` +')' }">
                </div>
                <div v-else-if="item.type == 13" v-tooltip="`House ${item.house_id} Contract`" class="item-image"
                  :style="{ backgroundImage: 'url(' + `assets/images/inventory/${item.type}.png` +')' }">
                </div>
                <div v-else-if="item.type == 14" v-tooltip="`Business ${item.business_id} Contract`" class="item-image"
                  :style="{ backgroundImage: 'url(' + `assets/images/inventory/${item.type}.png` +')' }">
                </div>
                <div v-else-if="item.type == 15"
                  v-tooltip="`<b>${item.spawned == false ? item.modelName : item.modelName + ' (' + item.spawnedIndex + ')'}</b><br>Vehicle Key<br> ${item.spawned == true ? (item.despawnSeconds ? '<b>Despawn in ' + (item.despawnSeconds / 60).toFixed(0) + ' minutes' : '') : 'Not spawned'}`"
                  class="item-image"
                  :style="{ backgroundImage: 'url(' + `assets/images/inventory/${item.type}.png` +')' }">
                </div>

                <div v-else v-tooltip="item.title" class="item-image"
                  :style="{ backgroundImage: 'url(' + `assets/images/inventory/${item.type}.png` +')' }">
                </div>
                <div v-if="item.stackable == true" class="quantity">{{item.quantity}}</div>
              </div>
            </div>
          </div>
          <div class="your-offer">
            <div class="header">Your offer: <span v-if="modalData.yourMoneyOffer > 0"
                class="instruction-offer m-0 ml-auto">(Click to remove from offer)</span>
            </div>
            <div class="items-scrollable">
              <div @click="removeFromOffer(index)" :class="item.canBeTradable == false ? 'entry disabled' : 'entry'"
                v-for="(item, index) in modalData.yourOffer" :key="index">
                <div v-if="item.type == 0"
                  v-tooltip="item.title + `<br>Number: ${formatMoney(item.number, 0, '-', '-')}`" class="item-image"
                  :style="{ backgroundImage: 'url(' + `assets/images/inventory/${item.type}.png` +')' }">
                </div>
                <div v-else-if="item.type == 11" v-tooltip="item.title" class="item-image"
                  :style="{ backgroundImage: 'url(' + `assets/images/inventory/weapons/${item.weapon_name}.png` +')' }">
                </div>
                <div v-else-if="item.type == 12" v-tooltip="`House ${item.house_id} Key`" class="item-image"
                  :style="{ backgroundImage: 'url(' + `assets/images/inventory/${item.type}.png` +')' }">
                </div>
                <div v-else-if="item.type == 13" v-tooltip="`House ${item.house_id} Contract`" class="item-image"
                  :style="{ backgroundImage: 'url(' + `assets/images/inventory/${item.type}.png` +')' }">
                </div>
                <div v-else-if="item.type == 14" v-tooltip="`Business ${item.business_id} Contract`" class="item-image"
                  :style="{ backgroundImage: 'url(' + `assets/images/inventory/${item.type}.png` +')' }">
                </div>
                <div v-else-if="item.type == 15"
                  v-tooltip="`<b>${item.spawned == false ? item.modelName : item.modelName + ' (' + item.spawnedIndex + ')'}</b><br>Vehicle Key<br> ${item.spawned == true ? (item.despawnSeconds ? '<b>Despawn in ' + (item.despawnSeconds / 60).toFixed(0) + ' minutes' : '') : 'Not spawned'}`"
                  class="item-image"
                  :style="{ backgroundImage: 'url(' + `assets/images/inventory/${item.type}.png` +')' }">
                </div>

                <div v-else v-tooltip="item.title" class="item-image"
                  :style="{ backgroundImage: 'url(' + `assets/images/inventory/${item.type}.png` +')' }">
                </div>
                <div v-if="item.stackable == true" class="quantity">{{item.quantity}}</div>
              </div>
              <div @click="moneyBar = 0, updateMoneyOffer()" v-if="modalData.yourMoneyOffer > 0" class="entry">
                <div v-tooltip="formatMoney(modalData.yourMoneyOffer, 0) + '$'" class="item-image"
                :style="{ backgroundImage: 'url(' + `assets/images/inventory/500.png` +')' }">
                </div>
              </div>
            </div>
            <div class="cash" v-tooltip="'Current offer: ' + formatMoney(moneyBar, 0) + '$'">
              <div class="text">{{formatMoney(moneyBar, 0)}}$</div>
              <input @input="updateMoneBar" :disabled="modalData.yourReady == true" type="number" class="form-control"
                min="0" :max="modalData.yourMoney" v-model="moneyBar" />
              <div class="text"><button :disabled="modalData.yourReady == true" @click="updateMoneyOffer"
                  class="btn btn-primary small">{{modalData.yourMoneyOffer > 0 ? 'Update cash' : 'Add cash' }}</button>
              </div>
            </div>
          </div>
        </div>
        <div class="right-screen">
          <div class="his-offer">
            <div class="header">{{modalData.hisName}}'s offer for you:</div>
            <div class="items-scrollable">
              <div class="entry" v-for="(item, index) in modalData.hisOffer" :key="index">
                <div v-if="item.type == 0"
                  v-tooltip="item.title + `<br>Number: ${formatMoney(item.number, 0, '-', '-')}`" class="item-image"
                  :style="{ backgroundImage: 'url(' + `assets/images/inventory/${item.type}.png` +')' }">
                </div>
                <div v-else-if="item.type == 11" v-tooltip="item.title" class="item-image"
                  :style="{ backgroundImage: 'url(' + `assets/images/inventory/weapons/${item.weapon_name}.png` +')' }">
                </div>
                <div v-else-if="item.type == 12" v-tooltip="`House ${item.house_id} Key`" class="item-image"
                  :style="{ backgroundImage: 'url(' + `assets/images/inventory/${item.type}.png` +')' }">
                </div>
                <div v-else-if="item.type == 13" v-tooltip="`House ${item.house_id} Contract`" class="item-image"
                  :style="{ backgroundImage: 'url(' + `assets/images/inventory/${item.type}.png` +')' }">
                </div>
                <div v-else-if="item.type == 14" v-tooltip="`Business ${item.business_id} Contract`" class="item-image"
                  :style="{ backgroundImage: 'url(' + `assets/images/inventory/${item.type}.png` +')' }">
                </div>
                <div v-else-if="item.type == 15"
                  v-tooltip="`<b>${item.modelName}</b><br>Vehicle Key<br>Insurance cost: ${formatMoney(item.insurance, 0)}$`"
                  class="item-image"
                  :style="{ backgroundImage: 'url(' + `assets/images/inventory/${item.type}.png` +')' }">
                </div>

                <div v-else v-tooltip="item.title" class="item-image"
                  :style="{ backgroundImage: 'url(' + `assets/images/inventory/${item.type}.png` +')' }">
                </div>
                <div v-if="item.stackable == true" class="quantity">{{item.quantity}}</div>
              </div>
              <div v-if="modalData.hisMoneyOffer > 0" class="entry">
                <div v-tooltip="formatMoney(modalData.hisMoneyOffer, 0) + '$'" class="item-image"
                :style="{ backgroundImage: 'url(' + `assets/images/inventory/500.png` +')' }">
                </div>
              </div>
            </div>
          </div>
          <div class="offer-chat">
            <div class="header">Chat</div>
            <div class="chat-entries">
              <div v-for="(entry, index) in modalData.tradeChat.slice().reverse()" :key="index" class="chat-entry"
                v-html="entry" />
            </div>
            <div class="chat-controls">
              <input v-model="chatMessage" placeholder="Write your message" @keyup.enter="sendChatMessage" type="text"
                class="form-control" />
              <button @click="sendChatMessage" class="btn btn-secondary">Send</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

  import timeago from 'node-time-ago';

  export default {
    name: "Inventory",
    computed: {
      modalData() {
        return this.$store.state.others.modalData;
      },
      activeModal() {
        return this.$store.state.others.activeModal;
      }
    },
    data: function () {
      return {
        moneyBar: 0,
        chatMessage: '',
        leftClicks: 0,
        leftClicked: null,
        rightClicks: 0
      };
    },
    mounted: function () {
      if (this.activeModal == 14 || this.activeModal == 15) {
        $(".entry").tooltip({ boundary: "window" });
      }
    },
    methods: {
      getFaction: function(faction) {
        let arrayPlayers = [];
        this.modalData.players.forEach((player, index) => {
          if(player.leader == faction || player.member == faction) {
            arrayPlayers.push(player);
          }
        });
        return arrayPlayers;
      },
      getClass: function(clasa) {
        if(clasa == 'civillians') {
          let arrayPlayers = [];
          this.modalData.players.forEach((player, index) => {
            if(player.admin != 0) return;
            if(player.leader != 0) return;
            if(player.member != 0) return;
            if(player.premium != 0) return;
            arrayPlayers.push(player);
          });
          return arrayPlayers;
        }
        if(clasa == 'admins') {
          let arrayPlayers = [];
          this.modalData.players.forEach((player, index) => {
            if(player.admin == 0) return;
            arrayPlayers.push(player);
          });
          return arrayPlayers;
        }
        if(clasa == 'premium') {
          let arrayPlayers = [];
          this.modalData.players.forEach((player, index) => {
            if(player.premium == 0) return;
            if(player.admin != 0) return;
            arrayPlayers.push(player);
          });
          return arrayPlayers;
        }
      },
      getSkillPercentage: function(currentPoints, neededPoints) {
        return currentPoints * 100 / neededPoints;
      },
      clearTrade: function () {
        this.chatMessage = '';
        this.moneyBar = 0;
      },
      getTimeFormat: function(time) {
        let message = 'undefined';
        if(time <= 60) {
          message = (time).toFixed(0) + " seconds";
        }
        if(time >= 60) {
          message = (time).toFixed(0) + " minutes";
        }
        if(time >= 3600) {
          message = (time / 3600).toFixed(0) + " hours";
        }
        if(time > 86400) {
          message = (time / 86400).toFixed(0) + " days";
        }
        return message;
      },
      finishTrade: function () {
        mp.trigger("finishTrade");
      },
      switchTradeStatus: function () {
        mp.trigger("switchTradeStatus");
      },
      sendChatMessage: function () {
        if (this.chatMessage.length < 1) return;
        mp.trigger("sendTradeMessage", this.chatMessage);
        this.chatMessage = '';
      },
      updateMoneBar: function () {
        if (this.modalData.yourMoney < this.moneyBar || this.moneyBar < 0) {
          this.moneyBar = this.modalData.yourMoney;
        }
      },
      updateMoneyOffer: function () {
        if (this.modalData.yourReady == true) return false;
        if (this.modalData.yourMoney < this.moneyBar || this.moneyBar < 0) {
          this.moneyBar = this.modalData.yourMoney;
        }
        mp.trigger("updateMoneyOffer", parseInt(this.moneyBar));
      },
      removeFromOffer: function (index) {
        if (this.modalData.yourReady == true) return false;
        mp.trigger("removedItemFromOffer", index);
      },
      addToOffer: function (index) {
        if (this.modalData.yourInventory[index].canBeTradable == false) return false;
        if (this.modalData.yourReady == true) return false;
        mp.trigger("addItemToOffer", index);
      },
      getTime: function (date) {
        date = new Date(date);
        return timeago(date);
        // console.log(timeago.format(date));
        // return timeago.format(date);
      },
      disableModals: function () {
        if (this.activeModal == 15) {
          mp.trigger("cancelTrade");
        }
        appData.commit("others/disableModals");
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
      setInventory: function (data) {
        data = JSON.parse(data);
        this.modalData.info = data;
        this.modalData.selectedItem = null;
      },
      confiscateItem: function (index) {
        let obj = {
          owner: this.modalData.owner,
          viewer: this.modalData.viewer,
          item: this.modalData.info.inventory[index],
          index: index
        };
        mp.trigger("inventory_confiscate", JSON.stringify(obj));
      },
      useItem: function (index) {
        let obj = {
          owner: this.modalData.owner,
          viewer: this.modalData.viewer,
          item: this.modalData.info.inventory[index],
          bullets: this.modalData.bullets,
          index: index
        };
        if (obj.item.canBeUsed == false) return gui.notify.push(0, 9, "This item can be used only via commands.", 10000);
        mp.trigger("inventory_use", JSON.stringify(obj));
        this.modalData.selectedItem = null;
      },
      dropItem: function (index) {
        let obj = {
          owner: this.modalData.owner,
          viewer: this.modalData.viewer,
          item: this.modalData.info.inventory[index],
          index: index
        };
        mp.trigger("inventory_drop", JSON.stringify(obj));
      }
    }
  };
</script>