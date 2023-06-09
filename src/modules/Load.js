import { module } from 'modujs';
import modularLoad from 'modularload';

export default class extends module {
    constructor(m) {
        super(m);
    }

    init() {
        const load = new modularLoad({
            enterDelay: 200,
            transitions: {
                customTransition: {}
            }
        });

        load.on('loaded', (transition, oldContainer, newContainer) => {
            videoLoad();
            navCheck();
            this.call('destroy', oldContainer, 'app');
            this.call('update', newContainer, 'app');
        });

        

        function navCheck(){
    const main = document.body
            main.classList.remove('menu-open');
            main.classList.remove('menu-open--edu');

            
        }
        
        function videoLoad(){
            document.documentElement.classList.remove("video-load");
                    
                }
        
    
    }
}