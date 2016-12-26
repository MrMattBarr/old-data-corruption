Template.popover.viewmodel({
    share: 'header',
    currentMessage: null,
    shouldShowPopover: function() {
        if (!Meteor.user()) return false;

        var account = Accounts.findOne({ user: Meteor.user()._id });
        var message = Messages.findOne({ recipient: account.currentCharacter });

        if (!message) return false;

        if (message.attachment) {
            if (message.attachmentType == 'ITEM') {
                message.attachment = Items.findOne({ _id: message.attachment });
            }
        }


        this.currentMessage(message);
        return true;
    },
    dismissMessage: function() {
        var message = this.currentMessage.value;
        Messages.remove(this.currentMessage.value._id);
        this.currentMessage(null);

        if (message.route) {
            if (message.argument) {
                Router.go(message.route, {
                    _id: message.argument
                });
            } else {
                Router.go(message.route)
            }
        }
    }
});
