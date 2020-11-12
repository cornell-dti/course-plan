export default function getCurrentSeason() {
  let currentSeason;
  const currentMonth = new Date().getMonth();
  if (currentMonth === 0) {
    currentSeason = 'Winter';
  } else if (currentMonth <= 4) {
    currentSeason = 'Spring';
  } else if (currentMonth <= 7) {
    currentSeason = 'Summer';
  } else {
    currentSeason = 'Fall';
  }
  return currentSeason;
}

export const clickOutside = {
  bind(el: any, binding: any, vnode: any) {
    el.event = (event: any) => {
      if (!(el === event.target || el.contains(event.target))) {
        vnode.context[binding.expression](event, binding.arg);
      }
    };
    document.body.addEventListener('click', el.event);
  },
  unbind(el: any) {
    document.body.removeEventListener('click', el.event);
  },
};
