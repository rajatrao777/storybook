import addons from '@storybook/addons';
import { EVENTS } from './constants';

addons.ready(channel => {
  channel.on(EVENTS.REQUEST, () => {
    channel.emit(EVENTS.RESULT, Math.random());
  });
});
