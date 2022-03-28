import ContactLabel from '../src/components/Layout/contactLabel';
import {
    withKnobs,
    text,
} from '@storybook/addon-knobs';

export default {
    title: 'Contact',
    component: ContactLabel,
    decorators: [withKnobs],
};

export const Label = () => ({
    components: { ContactLabel },
    props: {
        name: {
            type: String,
            default: text('name', 'Admin'),
        },
        mail: {
            type: String,
            default: text('mail', 'rnd@alterway.fr'),
        },
    },
    template: '<contact-label :display-name="name" :email="mail" />',
});
