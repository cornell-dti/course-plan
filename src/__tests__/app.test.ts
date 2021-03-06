import { mount } from '@vue/test-utils';
import Dashboard from '@/containers/Dashboard.vue';
import App from '@/App.vue';

// describe('App', () => {
//   // Inspect the raw component options
//   it('has data', () => {
//     expect(typeof Dashboard.data).toBe('function');
//   });
// });

describe('Mounted App', () => {
  const wrapper = mount(App);

  test('is a Vue instance', () => {
    expect(wrapper.isVueInstance()).toBeTruthy();
  });
});
