import { module } from 'modujs';

export default class extends module {
    constructor(m) {
        super(m);
        this.events = {
            click: {
              toggle: 'toggle',
            }
          }
    }
    toggle(){
        const el = this.el
        el.classList.toggle("play")
        let videoEl = document.getElementsByTagName('video')[0];
        videoEl.muted = (videoEl.muted == false) ? true : false;
}
}  