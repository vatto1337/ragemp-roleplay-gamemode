<template>
  <div v-if="discord != null" class="card shadow-lg mt-2">
    <div class="card-body">
    <h5 class="card-title mb-1">
      <div class="row">
        <div class="col-4 font-weight-lighter text-uppercasett">
          Discord
        </div>
        <div class="col-8">
          <div class="d-flex justify-content-end align-items-center">
          <p class="font-weight-normal small text-muted m-0">{{ discord.data.members.length }} players online on discord</p>
          </div>
        </div>
      </div>
    </h5>
    <hr />
    <div class="discord my-2">
      <div class="user shadow" v-for="user in discord.data.members.slice(0,10)" :key=user.id v-bind:style="{ backgroundImage: 'url(' + user.avatar_url + ')' }" /> 
    </div>
    <a v-on:click="joinDiscord" class="btn btn-primary">Join this discord</a>
    </div>
  </div>		
</template>

<script>
import axios from 'axios';

export default {
	name: "discord",
	data: function() {
		return {
			discord: null
		}
	},
	mounted: function() {
		let self = this;
		axios.get('https://discordapp.com/api/guilds/535150381404127232/widget.json')
		.then(function (response) {
			self.discord = response;
		});
	},
	methods: {
		joinDiscord: function(event) {
			event.preventDefault();
			return Swal({
				title: "Instructions",
				html: "In order to join our discord server you must visit the following address in your computer's browser: <b>www.discord.me/v-romania</b>",
				type: "info",
				confirmButtonText: "Understood"
			});
		}
	}
};
</script>

<style lang="scss">
  .discord {
		max-height: 140px;
		overflow: hidden;
    .user {
      display: inline-block;
      height: 60px;
      width: 65px;
      background-size: cover;
      margin: 5px;
    }
  }
</style>