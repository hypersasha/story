class UIController {
    constructor() {
    }

    OnButtonPressed(button, callback, add_class) {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            console.log(e);
            if (add_class) {
                $(button).addClass(add_class);
            }

            if (callback) {
                callback();
            }
        });
    }

    OnButtonReleased(button, callback, remove_class) {
        button.addEventListener('touchend', (e) => {
            e.preventDefault();
            if (remove_class) {
                $(button).removeClass(remove_class);
            }

            if (callback) {
                callback();
            }
        });
    }

}