import { generateAPIUrl } from '../../../variables'
export default {
  name: 'Profile',
  props: ['email', 'image'],
  watch: {},
  data() {
    return {
      tenant: '',
      api: generateAPIUrl()
    }
  },
  created() {
    fetch(`${this.api}/current`, {credentials: 'include'})
        .then(response => response.json())
        .then(r => this.tenant = r.results)
  },
  methods: {
    logoutUser() {
      return(`${this.api}/logout`)
    },
  }
}