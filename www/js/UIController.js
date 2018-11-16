
class UIController {
    constructor() {}

    OnButtonPressed(button, callback, add_class) {

        /*button.addEventListener('mousedown', () => {
            button.classList.add(add_class);

            if (callback) {
                callback();
            }
        });*/

        button.addEventListener('touchstart', () => {
            if (add_class) {
                button.classList.add(add_class);
            }

            if (callback) {
                callback();
            }
        });
    }

    OnButtonReleased(button, callback, remove_class) {

        // button.addEventListener('mouseup', () => {
        //     button.classList.remove(remove_class);
        //
        //     if (callback) {
        //         callback();
        //     }
        // });

        button.addEventListener('touchend', () => {
            if (remove_class) {
                button.classList.remove(remove_class);
            }

            if (callback) {
                callback();
            }
        });
    }

}