import Vue from 'vue';
import { mount, shallowMount } from '@vue/test-utils';
import NavBar from '@/components/NavBar.vue';
import Dashboard from '@/containers/Dashboard.vue';
import App from '@/App.vue';

import {
  smallBreakpoint,
  mediumBreakpoint,
  veryLargeBreakpoint,
} from '@/assets/scss/_variables.scss';

// describe('App', () => {
//   // Inspect the raw component options
//   it('has data', () => {
//     expect(typeof Dashboard.data).toBe('function');
//   });
// });

describe('Mounted App', () => {
  // const wrapper = mount(App);

  // test('is a Vue instance', () => {
  //   expect(wrapper.isVueInstance()).toBeTruthy();
  // });

  // it('renders the correct markup', () => {
  //   expect(wrapper.html()).toContain('What is the sum of the two numbers?');
  // });

  // // it's also easy to check for the existence of elements
  // it('has a button', () => {
  //   expect(wrapper.contains('button')).toBe(true);
  // });

  // MOUNT test
  // describe('Dashboard tests', () => {
  //   let Cmp;
  //   let vm: any;

  //   beforeEach(() => {
  //     Cmp = Vue.extend(Dashboard); // Create a copy of the original component
  //     vm = new Cmp({
  //       data: {
  //         // Replace data value with this fake data
  //         messages: ['Cat'],
  //       },
  //     }).$mount(); // Instances and mounts the component
  //   });

  //   it('equals messages to ["Cat"]', () => {
  //     expect(vm.messages).toEqual(['Cat']);
  //   });

  //   it('has the expected html structure', () => {
  //     expect(vm.$el).toMatchSnapshot();
  //   });
  // });

  // Shallow mount test
  // describe('Dashboard tests', () => {
  //   let Cmp: any;
  //   let vm: any;

  //   beforeEach(() => {
  //     Cmp = Vue.extend(Dashboard); // Create a copy of the original component
  //     vm = shallowMount(Cmp, {
  //       // cmp = shallowMount(Dashboard, {
  //       // Create a shallow instance of the component
  //       data: {
  //         // Replace data value with this fake data
  //         messages: ['Cat'],
  //       },
  //     });
  //   });

  //   it('equals messages to ["Cat"]', () => {
  //     expect(vm.messages).toEqual(['Cat']);
  //   });

  //   // it('has the expected html structure', () => {
  //   //   expect(Cmp.vm.$el).toMatchSnapshot();
  //   // });
  // });

  // Vue.js doc test
  test('NavBar', () => {
    // render the component
    const wrapper = shallowMount(NavBar);

    // should not allow for `username` less than 7 characters, excludes whitespace
    wrapper.setData({ username: ' '.repeat(7) });

    // assert that a class is rendered
    expect(wrapper.find('.navbar-bottom').exists()).toBe(true);

    // it('has the expected html structure', () => {
    //   expect(wrapper).toMatchSnapshot();
    // });
  });

  it('renders correctly', () => {
    const wrapper = mount(Dashboard, {
      data() {
        // data values from Dashboard.vue, hardcoded some values in
        return {
          loaded: true,
          compactVal: false,
          isOnboarding: false,
          isEditingProfile: false,
          isOpeningRequirements: false,
          isTablet: false,
          isMobile: false,
          maxBottomBarTabs: 4,
          welcomeHidden: false,
          startTour: false,
          showTourEndWindow: false,
        };
      },
    });
    expect(wrapper.element).toMatchSnapshot();
  });

  // it('button click without correct sum', () => {
  //   expect(wrapper.vm.message).toBe("")
  //   const button = wrapper.find('button')
  //   button.trigger('click')
  //   expect(wrapper.vm.message).toBe('TRY AGAIN')
  // })

  // it('button click with correct sum', () => {
  //   wrapper.setData({ guess: "15" })
  //   const button = wrapper.find('button')
  //   button.trigger('click')
  //   expect(wrapper.vm.message).toBe('SUCCESS!')
  // })
});
