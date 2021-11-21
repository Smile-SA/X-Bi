import { generateAPIUrl } from '../../variables'

export default {
  name: 'Login',
  data () {
    return {
      api: generateAPIUrl()
    }
  },

  methods: {

    login_user: function() {
      return(`${this.api}/login_user`)
    },
    password: function() {
      return(`${this.api}/password`)
    },
    signup: function() {
      return(`${this.api}/signup`)
    }
  },

}
