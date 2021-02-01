// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Vue from 'vue';

declare module 'vue/types/vue' {
  interface VueConstructor {
    $dragula: {
      $service: {
        eventBus: {
          $on: (
            event:
              | 'drag'
              | 'drop'
              | 'dragend'
              | 'cancel'
              | 'remove'
              | 'shadow'
              | 'over'
              | 'out'
              | 'cloned',
            listener: (e: Element) => void
          ) => void;
        };
      };
    };
  }
}
