import { module } from 'modujs';
import PerfectScrollbar from 'perfect-scrollbar';

export default class extends module {
    constructor(m) {
        super(m);
        this.events = {
            click: {
              header: 'updateScroll',
              open: 'openScroll',
            }
          }
    }

    init() {
        this.scrollbar = new
            PerfectScrollbar(this.el, {
            wheelSpeed: 1,
            wheelPropagation: true,
            minScrollbarLength: 20
        });
    }
    updateScroll(){
        const container = document.querySelector(".store-locator__collection")
        container.scrollTop = 0;
        if(window.innerWidth < 767){
        const elem = document.querySelector(".store-locator__filter")
        elem.classList.remove("is-open")
    }
    }
    openScroll(){
        const elem = document.querySelector(".store-locator__filter")
        elem.classList.toggle("is-open")
    }
}