class UIController {
    constructor() {
    }

    OnButtonPressed(button, callback, add_class) {
        button.addEventListener('touchstart', () => {
            if (add_class) {
                $(button).addClass(add_class);
            }

            if (callback) {
                callback();
            }
        });
    }

    OnButtonReleased(button, callback, remove_class) {
        button.addEventListener('touchend', () => {
            if (remove_class) {
                $(button).removeClass(remove_class);
            }

            if (callback) {
                callback();
            }
        });
    }

}