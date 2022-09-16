<template>
  <div>
    <div class="selectSemester">
      <div class="selectSemester-section selectSemester-type">
        <label v-if="!isCourseModelSelectingSemester" class="selectSemester-label" for="type"
          >Type</label
        >
        <div class="position-relative" v-click-outside="closeSemesterDropdownIfOpen">
          <div
            class="selectSemester-dropdown-placeholder season-wrapper"
            @click="showHideSemesterContent"
            data-cyId="newSemester-seasonWrapper"
          >
            <!-- text to display in dropdown -->
            <div
              class="selectSemester-dropdown-placeholder season-placeholder"
              :style="{ color: displayOptions.semester.placeholderColor }"
            >
              {{ semesterPlaceholder }}
            </div>
            <div
              class="selectSemester-dropdown-placeholder season-arrow"
              :style="{ borderTopColor: displayOptions.semester.arrowColor }"
            ></div>
          </div>
          <div
            class="selectSemester-dropdown-content season-content position-absolute w-100"
            v-if="displayOptions.semester.shown"
          >
            <!-- show the list of semesters course shows up in -->
            <div
              v-for="s in semestersTakenList"
              :key="s"
              class="selectSemester-dropdown-content-item"
              @click="selectSemester(s)"
              data-cyId="newSemester-seasonItem"
            >
              {{ s }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue';
import { clickOutside } from '@/utilities';
import { inactiveGray, yuxuanBlue, darkPlaceholderGray } from '@/assets/constants/scss-variables';

type DisplayOption = {
  shown: boolean;
  stopClose: boolean;
  boxBorder: string;
  arrowColor: string;
  placeholderColor: string;
};

type Data = {
  semesterText: string;
  readonly displayOptions: {
    readonly semester: DisplayOption;
  };
};

export default defineComponent({
  props: {
    isEdit: { type: Boolean, default: false },
    isCourseModelSelectingSemester: { type: Boolean, default: false },
    semestersTaken: { type: Array as PropType<readonly FirestoreSemester[]>, required: true },
  },
  emits: {
    updateSemProps: (season: string): boolean => typeof season === 'string',
    duplicateSemester: (duplicate: boolean): boolean => typeof duplicate === 'boolean',
  },
  data(): Data {
    const placeholderColor = darkPlaceholderGray;
    return {
      semesterText: '',
      displayOptions: {
        semester: {
          shown: false,
          stopClose: false,
          boxBorder: '',
          arrowColor: '',
          placeholderColor,
        },
      },
    };
  },
  computed: {
    // shows the semester taken or 'Select Semester'
    semesterPlaceholder(): string {
      return this.semesterText || 'Select Semester';
    },
    semestersTakenList(): string[] {
      const semestersHash = new Map<string, number>();
      const semestersTakenList: string[] = [];
      for (const semester of this.semestersTaken) {
        const { year, season } = semester;
        const semesterString = `${season} ${year}`;
        const val = semestersHash.get(semesterString);
        let num = 0;
        if (val === undefined) {
          semestersHash.set(semesterString, 1);
        } else {
          num = val + 1;
          semestersHash.set(semesterString, num);
        }
        const fullSemesterString = num === 0 ? semesterString : `${semesterString} (#${num})`;
        semestersTakenList.push(fullSemesterString);
      }
      return semestersTakenList;
    },
  },
  directives: {
    'click-outside': clickOutside,
  },
  mounted(): void {
    this.$emit('updateSemProps', this.semesterPlaceholder);
  },
  methods: {
    showHideSemesterContent() {
      const displayOptions = this.displayOptions.semester;
      const contentShown = displayOptions.shown;
      displayOptions.shown = !contentShown;

      if (contentShown) {
        // clicked box when content shown. So then hide content
        displayOptions.boxBorder = inactiveGray;
        displayOptions.arrowColor = inactiveGray;
      } else {
        displayOptions.boxBorder = yuxuanBlue;
        displayOptions.arrowColor = yuxuanBlue;
      }
    },
    closeSemesterDropdownIfOpen() {
      const displayOptions = this.displayOptions.semester;
      if (displayOptions.stopClose) {
        displayOptions.stopClose = false;
      } else if (displayOptions.shown) {
        displayOptions.shown = false;
        displayOptions.boxBorder = inactiveGray;
        displayOptions.arrowColor = inactiveGray;
      }
    },
    selectSemester(semester: string) {
      this.semesterText = semester;
      const displayOptions = this.displayOptions.semester;
      displayOptions.shown = false;
      displayOptions.boxBorder = '#C4C4C4';
      displayOptions.arrowColor = '#C4C4C4';
      displayOptions.placeholderColor = '#757575';
      this.$emit('updateSemProps', this.semesterText || this.semesterPlaceholder);
    },
  },
});
</script>

<style lang="scss">
@import '@/assets/scss/_variables.scss';

.selectSemester {
  display: flex;
  flex-direction: row;
  &-section {
    font-size: 14px;
    line-height: 15px;
    color: #757575;
    display: flex;
    flex-direction: column;
  }

  &-type {
    width: 100%;
  }

  &-label {
    margin-bottom: 0.5rem;
  }

  &-select {
    background: #ffffff;
    // border: 1px solid #32A0F2;

    //when selected border-color: #32A0F2;

    box-sizing: border-box;
    border-radius: 2px;
    width: 100%;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 14px;

    color: $darkPlaceholderGray;
  }

  &-icon {
    width: 12px;
    height: 12px;
  }
  &-dropdown {
    &-placeholder {
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      line-height: 15px;

      color: #757575;

      background-color: white;
      color: #757575;

      &.season-wrapper {
        display: flex;
        flex-direction: row;
        width: 100%;
        border-radius: 2px;
        border: 1px solid #c4c4c4;
        cursor: pointer;
      }

      &.season-placeholder {
        margin-left: 7px;
        margin-top: 5px;
        margin-bottom: 5px;
        width: 100%;
      }

      &.season-arrow {
        width: 6.24px;
        height: 6.24px;
        border-left: 6.24px solid transparent;
        border-right: 6.24px solid transparent;
        border-top: 6.24px solid #c4c4c4;

        //when clicked border-top-color: #32A0F2;

        margin-top: 10.17px;
        margin-bottom: 10.17px;

        margin-right: 8.7px;
        margin-left: 5px;
      }
    }
  }

  &-dropdown-content {
    max-height: 8rem;

    background: #ffffff;
    box-shadow: -4px 4px 10px rgba(0, 0, 0, 0.25);
    border-radius: 0px 0px 7px 7px;

    &-season {
      padding-left: 0px;
      padding-right: 10px;
      height: 14px;
    }
    &-item {
      height: 31px;
      left: 454px;
      top: 213px;

      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      line-height: 15px;
      display: flex;
      align-items: center;
      color: #757575;
      padding-left: 10px;
      cursor: pointer;

      &:last-child {
        border-radius: 0px 0px 7px 7px;
      }
    }
  }

  &-dropdown-content div:hover {
    background: rgba(50, 160, 242, 0.15);
    width: 100%;
  }
}

select option {
  color: black;
}
select option:first-child {
  color: grey;
}
select.empty {
  color: grey;
}
/* Hidden placeholder */
select option[disabled]:first-child {
  display: none;
}
</style>
