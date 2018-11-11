
class UIController {
    constructor() {}

    OnButtonPressed(button, add_class, callback) {

        button.addEventListener('mousedown', () => {
            button.classList.add(add_class);

            if (callback) {
                callback();
            }
        });

        button.addEventListener('touchstart', () => {
            button.classList.add(add_class);

            if (callback) {
                callback();
            }
        });
    }

    OnButtonReleased(button, remove_class, callback) {

        button.addEventListener('mouseup', () => {
            button.classList.remove(remove_class);

            if (callback) {
                callback();
            }
        });

        button.addEventListener('touchend', () => {
            button.classList.remove(remove_class);

            if (callback) {
                callback();
            }
        });
    }

}