Template.account.viewmodel({
    share: ['header', 'menu'],
    onRendered: function() {
        var vm = this;
        vm.headerText("Account Settings");
        vm.printHeaderMessages(["user.account"]);
        if (!Meteor.user()) {
            Router.go("login");
        }
        vm.menuItems(
            [{
                label: "Home",
                icon: "fa-bars",
                route: 'home'
            }, {
                label: "New Character",
                icon: "fa-plus",
                action: vm.newCharacter,
                arguments: vm
            }, {
                label: "Sign Out",
                icon: "fa-sign-out",
                action: vm.logOut,
                arguments: vm
            }]);
    },
    account: function() {
        return Accounts.findOne({ user: Meteor.user()._id });
    },
    characters: function() {
        if (Meteor.user()) {
            return Characters.find({ user: Meteor.user()._id });
        }
        return []
    },
    saveAccount: function() {
        Accounts.update(this._id(), {
            $set: {
                name: this.name.value
            }
        });
    },
    currentCharacter: function() {
        var account = Accounts.findOne({ user: Meteor.user()._id });
        return Characters.findOne({ _id: account.currentCharacter });
    },
    isCurrentCharacter: function(character) {
        var account = Accounts.findOne({ user: Meteor.user()._id });
        return account.currentCharacter == character._id;
    },
    selectCharacter: function(character) {
        var id = this.account()._id;
        if (id && character) {
            Accounts.update(id, { $set: { currentCharacter: character._id } });
            Router.go('home');
        }
    },
    deleteCurrentCharacter: function() {
        Characters.remove(this.currentCharacter()._id);
        Router.go('home');
    },
    newCharacter: function(vm) {
        var firstNames = ["Alan", "Bea", "Carla", "David", "Emily"];
        var lastNames = ["French", "Gonzales", "Henry", "Insly", "Johnson"];
        var first = firstNames[Math.floor(Math.random() * firstNames.length)];
        var last = lastNames[Math.floor(Math.random() * lastNames.length)];
        var name = first + " " + last;
        if (Meteor.user()._id) {
            Characters.insert({
                name: name,
                createdAt: new Date(),
                user: Meteor.user()._id
            });
        } else {
            vm.printMessage["no user logged in"];
        }
    },
    logOut: function(vm) {
        Meteor.logout(function() {
            Router.go('login');
        });
    }
});
