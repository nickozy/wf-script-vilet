import { module } from "modujs";

export default class extends module {
  constructor(m) {
    super(m);
  }

  init() {
    window.onload = () => {
    setTimeout(()=>{
      FsAttributes.cmsfilter.destroy();
      FsAttributes.cmsfilter.init();
    }, 50)
  }  
}
}
