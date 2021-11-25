import {generateAPIUrl} from "../../../variables";

export default {
    name: 'header',
    components: {},
    data() {
        return {
            tenant: '',
            image: 'https://images.theconversation.com/files/350865/original/file-20200803-24-50u91u.jpg?ixlib=rb-1.1.0&rect=37%2C29%2C4955%2C3293&q=45&auto=format&w=926&fit=clip'
            ,
            email: 'rnd@alterway.fr',
           api: generateAPIUrl()
        }
    },
    created() {
        fetch(`${this.api}/current`, {credentials: 'include'})
            .then(response => response.json())
            .then(r => this.tenant = r.results);
    },
    computed: {},
    mounted() {

    },
    methods: {
        logoutUser() {
            return (`${this.api}/logout`)
        },
    }
}


