<template>
  <section
    ref="preview"
    class="course-search-preview"
    role="dialog"
    aria-modal="true"
    aria-labelledby="course-search-preview-title"
    @keydown.esc.prevent.stop="$emit('close')"
    @keydown.tab="containTab"
    data-cyId="course-search-preview-dialog"
  >
    <header class="course-search-preview-header" :style="{ backgroundColor: `#${color}` }">
      <h1 id="course-search-preview-title" :title="title">{{ title }}</h1>
      <button
        ref="closeButton"
        type="button"
        aria-label="Close course preview and return to search"
        @click="$emit('close')"
        data-cyId="course-search-preview-close"
      >
        <img src="@/assets/images/x-white.svg" alt="" />
      </button>
    </header>
    <div class="course-search-preview-status" aria-live="polite">
      <div v-if="detailsLoading" role="status">Loading course information…</div>
      <div v-else-if="detailsFailed">
        Course information could not be loaded.
        <button type="button" @click="retryDetails">Retry course information</button>
      </div>
      <div v-if="reviewsLoading" role="status">Loading reviews…</div>
      <div v-else-if="reviewsFailed">
        Reviews could not be loaded.
        <button type="button" @click="retryReviews">Retry reviews</button>
      </div>
    </div>
    <div class="course-search-preview-body">
      <BottomBarCourse :courseObj="previewCourse" />
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import BottomBarCourse from '@/components/BottomBar/BottomBarCourse.vue';
import { courseToSearchPreview, loadCourseDetails, loadCourseReviews } from '@/course-information';

export default defineComponent({
  components: { BottomBarCourse },
  props: {
    course: { type: Object as PropType<CornellCourseRosterCourse>, required: true },
    color: { type: String, required: true },
  },
  emits: ['close'],
  data() {
    return {
      previewCourse: courseToSearchPreview(this.course, this.color),
      detailsLoading: false,
      reviewsLoading: false,
      detailsFailed: false,
      reviewsFailed: false,
      detailsRequest: 0,
      reviewsRequest: 0,
    };
  },
  computed: {
    title(): string {
      return `${this.course.subject} ${this.course.catalogNbr}: ${this.course.titleLong}`;
    },
  },
  watch: {
    course() {
      this.previewCourse = courseToSearchPreview(this.course, this.color);
      this.loadDetails();
      this.loadReviews();
    },
    color() {
      this.previewCourse = { ...this.previewCourse, color: this.color };
    },
  },
  mounted() {
    (this.$refs.closeButton as HTMLButtonElement).focus();
    document.addEventListener('focusin', this.containFocus);
    this.loadDetails();
    this.loadReviews();
  },
  beforeUnmount() {
    this.detailsRequest += 1;
    this.reviewsRequest += 1;
    document.removeEventListener('focusin', this.containFocus);
  },
  methods: {
    retryDetails() {
      (this.$refs.closeButton as HTMLButtonElement).focus();
      this.loadDetails();
    },
    retryReviews() {
      (this.$refs.closeButton as HTMLButtonElement).focus();
      this.loadReviews();
    },
    async loadDetails() {
      this.detailsRequest += 1;
      const request = this.detailsRequest;
      this.detailsLoading = true;
      this.detailsFailed = false;
      try {
        const { roster, information } = await loadCourseDetails(
          this.course.roster,
          this.course.subject,
          this.course.catalogNbr
        );
        if (request === this.detailsRequest) {
          Object.assign(this.previewCourse, information, { currRoster: roster });
        }
      } catch {
        if (request === this.detailsRequest) this.detailsFailed = true;
      } finally {
        if (request === this.detailsRequest) this.detailsLoading = false;
      }
    },
    async loadReviews() {
      this.reviewsRequest += 1;
      const request = this.reviewsRequest;
      this.reviewsLoading = true;
      this.reviewsFailed = false;
      try {
        const reviews = await loadCourseReviews(this.course.subject, this.course.catalogNbr);
        if (request === this.reviewsRequest) Object.assign(this.previewCourse, reviews);
      } catch {
        if (request === this.reviewsRequest) this.reviewsFailed = true;
      } finally {
        if (request === this.reviewsRequest) this.reviewsLoading = false;
      }
    },
    containFocus(event: FocusEvent) {
      if (!(this.$refs.preview as HTMLElement).contains(event.target as Node)) {
        (this.$refs.closeButton as HTMLButtonElement).focus();
      }
    },
    containTab(event: KeyboardEvent) {
      const elements = Array.from(
        (this.$refs.preview as HTMLElement).querySelectorAll<HTMLElement>(
          'button:not(:disabled), a[href], [tabindex="0"]'
        )
      ).filter(element => element.getClientRects().length > 0);
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    },
  },
});
</script>

<style lang="scss">
@import '@/assets/scss/_variables.scss';

.modal-content.content-course-preview {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 48rem;
  max-width: calc(100vw - 2rem);
  height: 28rem;
  min-height: 0;
  max-height: calc(100vh - 2rem);
  max-height: calc(100dvh - 2rem);
  margin: 0;
  padding: 0;
  background: $white;
  overflow: hidden;
}

.course-search-preview {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 100%;
  height: 100%;
  margin: 0;
  min-width: 0;
  min-height: 0;
  font-family: 'ProximaNova', sans-serif;

  &-header {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    height: 40px;
    padding-left: 16px;
    color: $white;

    h1 {
      flex: 1;
      min-width: 0;
      margin: 0;
      font-size: 16px;
      line-height: 40px;
      color: $white;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    button {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      width: 40px;
      height: 40px;
      border: 0;
      background: transparent;

      img {
        width: 14px;
        height: 14px;
      }

      &:focus-visible {
        outline: 2px solid $white;
        outline-offset: -4px;
      }
    }
  }

  &-status {
    flex-shrink: 0;
    font-size: 12px;
    color: $primaryGray;

    > div {
      padding: 4px 20px;
    }

    button {
      color: $yuxuanBlue;
      text-decoration: underline;
    }
  }

  &-body {
    flex: 1;
    min-height: 0;
  }
}
</style>
