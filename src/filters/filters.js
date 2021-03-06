import Vue from 'vue'

const messages = {
  items: 'itens',
  'Please log in with your Google Drive account': 'Por favor, faça login com sua conta do Google Drive',
  'Create new Item': 'Criar novo Item',
  'Value': 'Valor',
  'Date': 'Data',
  'Description': 'Descrição',
  'Wallet': 'Carteira',
  'Currency': 'Moeda',
  'Notes': 'Observações',
  'Create new Wallet': 'Criar nova Carteira',
  'Name': 'Nome',
  'Total': 'Total',
  'Interval': 'Intervalo',
  'No items found': 'Nenhum item encontrado',
  // actions
  'Cancel': 'Cancelar',
  'Save': 'Salvar'
}

const currencyMap = {
  'US': 'USD',
  'BR': 'BRL'
}

function getLang () {
  if (navigator.languages !== undefined) {
    return navigator.languages[0]
  }

  return navigator.language
}

function getCountryCode (locale) {
  let components = locale.split('_')
  if (components.length === 2) {
    return components.pop()
  }

  components = locale.split('-')
  if (components.length === 2) {
    return components.pop()
  }
  return locale
}

function getCurrencyCode () {
  let countryCode = getCountryCode(getLang()).toUpperCase()
  if (countryCode in currencyMap) {
    return currencyMap[countryCode]
  }

  return 'USD'
}

Vue.filter('number', function (value) {
  if (!window.Intl) return value
  return new Intl.NumberFormat().format(value)
})

Vue.filter('currency', function (value, code) {
  console.log(getLang())
  let result = new Intl.NumberFormat(
    getLang(),
    {style: 'currency', currency: (code || getCurrencyCode())}
  ).format(value)
  return result
  // return 'R$ ' + value.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
})

Vue.filter('translate', function (value) {
  return messages[value] || value
})
