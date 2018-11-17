
class VKAuth {
    constructor() {
        this.user = {
            first_name: "Друг"
        };
        VK.init(() => {
            this.GetUserNames();
        }, () => {
            let error = document.getElementById('vk-init-err');
            $(error).show();
            setTimeout(() => {$(error).hide()}, 2500);
        }, '5.87');
    }

    GetFirstName() {
        return this.user.first_name;
    }

    GetUserNames() {
        VK.api("users.get", (data) => {
            if (data && data.response) {
                let user = data.response[0];
                if (user) {
                    this.user = user;
                }
            }
            // Print updated user
            console.log(this.user);
        });
    }
}