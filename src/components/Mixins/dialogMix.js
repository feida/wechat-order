
export const dialogMix = {
  props: ["show"],
  methods: {
    close() {
      this.show = false;
    }
  }
}
