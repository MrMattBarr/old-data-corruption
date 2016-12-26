Template.lootDetail.viewmodel({
    share: ['master', 'header', 'messages', 'character'],
    onRendered: function() {
        this.headerText("Loot Detail");
        this.printHeaderMessages(["boop a booo"]);
    },
    assignLoot: function(recipient) {
        var account = Accounts.findOne({ user: Meteor.user()._id });
        if (account) {
            var character = Characters.findOne({ _id: account.currentCharacter });
        }

        var message = {
            recipient: character._id,
            text: "Item sent to " + recipient.name + ".",
            confirmation: "Great"
        };
        this.sendMessage(message);

        message = {
            recipient: recipient._id,
            text: "Item received: " + this.name() + ".",
            attachment: this._id.value,
            attachmentType: 'ITEM',
            confirmation: "Check it out",
            route: 'item',
            argument: this._id.value
        };
        this.sendMessage(message);

        Items.update(this._id(), { $set: { character: recipient._id } });
        Router.go('loot');
    }
});
