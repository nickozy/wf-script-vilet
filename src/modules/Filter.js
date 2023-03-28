import { module } from "modujs";

export default class extends module {
  constructor(m) {
    super(m);
  }

  init() {
    window.addEventListener("load", ()=>{
      console.log('true')
      FsAttributes.cmsfilter.destroy()
      FsAttributes.cmsfilter.init()
    })
    }
}
