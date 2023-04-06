import { module } from 'modujs';

export default class extends module {
    constructor(m) {
        super(m);
    }
    init(){
        const el = this.el
    if(window.innerWidth < 767){
        el.setAttribute("src", "https://files.starterapp.co/api/v1/buckets/breadhead/objects/download?preview=true&prefix=dmlsZXQgb2sgQk9STiBBRi0zMDAwLm1wNA==&version_id=null")
    }
    }
}  