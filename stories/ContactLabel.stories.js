import ContactLabel from '../src/components/partials/ContactLabel';
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
    template: '<contact-label :displayName="name" :email="mail" />',
});
