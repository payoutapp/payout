<template>
    <md-dialog ref="new_item_dialog" :md-active.sync="showDialog" :md-click-outside-to-close="false" :md-close-on-esc="false" class="md-layout-item md-size-50 md-small-size-100 md-xsmall-size-100">
      <md-dialog-title>Create new Filter</md-dialog-title>
      <md-dialog-content >

        <form novalidate @submit.stop.prevent="submit">
          <md-field>
            <md-icon>local_atm</md-icon>
            <label>{{ 'Name' | translate }}</label>
            <md-input v-model="name"></md-input>
          </md-field>
          <md-divider></md-divider>

          <md-field>
            <label>{{ 'Description' | translate }}</label>
            <md-input v-model="item.description"></md-input>
            <md-select v-model="currency" md-align-trigger>
              <md-option value="BRL">BRL</md-option>
              <md-option value="USD">USD</md-option>
            </md-select>
          </md-field>
          <md-field>
            <md-icon>account_balance_wallet</md-icon>
            <label>Conta</label>
            <md-select v-model="wallet" md-align-trigger>
              <md-option v-for="item in wallets" :value="item._id" :key="item._id">
                {{item.name}}
              </md-option>
            </md-select>
          </md-field>
          <md-field>
            <md-icon>info_outline</md-icon>
            <label>Observação</label>
            <md-input v-model="item.note"></md-input>
          </md-field>
        </form>
      </md-dialog-content>
      <md-dialog-actions>
        <md-button class="md-primary" @click.native="showCreateFilter(false)">Cancel</md-button>
        <md-button @click.native="inputItem()">Save</md-button>
      </md-dialog-actions>
    </md-dialog>
</template>

<script>
import { defaultBill, uuidv4 } from '../api.js'
import { mapActions, mapState } from 'vuex'
import _ from 'lodash'

export default {
  name: 'CreateNewFilterDialog',
  props: ['valuetype'],
  data () {
    return {
      _id: null,
      name: '',
      item: null,
      date: new Date(),
      wallet: null,
      value: null
    }
  },
  mounted: function () {
    this.fetchData()
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.item = defaultBill()
    },
    inputItem () {
      this.item._id = uuidv4()
      this.item.due = this.date.toJSON()
      this.item.resource = _.clone(this.wallets.find(x => x._id === this.wallet))
      this.item.value = parseFloat(this.value) * this.valuetype
      this.insertItem(_.clone(this.item, true))
      this.saveFile()
      this.showCreateFilter(false)
    },
    openDialog () {
      this.item = _.clone(defaultBill())
      this.showCreateFilter(true)
    },
    ...mapActions([
      'insertItem',
      'saveFile',
      'showCreateFilter'
    ])
  },
  computed: {
    ...mapState({
      items: state => state.bills.items,
      wallets: state => state.bills.wallets,
      showDialog: state => state.events.showCreateFilter
    }),
    activeClass: function () {
      return this.item.value >= 0 ? 'positive' : 'negative'
    },
    type: function () {
      return this.item.value >= 0 ? 'receita' : 'despesa'
    }
  }
}
</script>

<style>
  .md-menu.md-menu-content {
    margin-left: 12px;
  }
  .md-field>.md-icon~.md-select>.md-input {
    margin-left: 12px;
  }
  .item {
    background: #fff !important;
  }
  .main header {
    text-align: center;
    color: #fff;
    /*border-bottom: 1px solid #ededed;*/
  }
  .main header.positive {
    color: #1abc9c;
  }
  .main header.negative {
    color: #e74c3c;
  }
  .header-title {
    outline: none;
    position: relative;
    margin: 0 auto;
  }
  .header-title-inner {
    line-height: 20px;
    padding: 6px 0;
    position: relative;
  }
  .header-content {
    font-size: 25px;
    padding-top: 20px;
    position: relative;
    margin: 0 auto;
    width: 100%;
  }
  .md-menu-content {
    z-index: 10 !important;
  }

</style>
