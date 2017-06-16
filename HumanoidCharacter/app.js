var AliveClass = (function () {
    function AliveClass() {
        this.currentVoiceIndex = 0;
        this.voiceIndexSet = false;
    }
    AliveClass.prototype.onTick = function (time) {
        if (this.voices == null || this.voices.length == 0)
            this.voices = this.textToSpeechManager.getVoices();
        var index = this.databaseManager.getObject("Index");
        if (index != null) {
            this.currentVoiceIndex = parseInt(index);
            this.changeVoice(true);
        }
    };
    AliveClass.prototype.changeVoice = function (force) {
        if (this.voiceIndexSet && !force)
            return;
        this.voiceIndexSet = true;
        var name = this.getVoiceTextPresentation(this.voices[this.currentVoiceIndex]);
        this.menuManager.setProperty("LangTextBox", "Text", name);
        this.textToSpeechManager.setVoice(this.currentVoiceIndex);
        this.databaseManager.saveObject("Index", this.currentVoiceIndex.toString());
        this.databaseManager.saveObject("VoiceName", name);
    };
    AliveClass.prototype.getVoiceTextPresentation = function (v) {
        var gender = v.getName().indexOf("female") != -1 ? "female" : "";
        if (gender == "")
            gender = v.getName().indexOf("male") != -1 ? "male" : "unknown gender";
        return v.getISO3Language() + " " + gender + " " + this.currentVoiceIndex.toString() + "/" + (this.voices.length - 1).toString();
    };
    AliveClass.prototype.onBackgroundTick = function (time) {
    };
    AliveClass.prototype.onStart = function (handler, disabledPermissions) {
        this.configurationManager = handler.getConfigurationManager();
        this.textToSpeechManager = handler.getTextToSpeechManager();
        this.databaseManager = handler.getDatabaseManager();
        this.actionManager = handler.getActionManager();
        this.menuManager = handler.getMenuManager();
        if (!this.textToSpeechManager.isAvailable()) {
            handler.getActionManager().showSystemMessage("No Text-To-Speech Engine available, closing character..");
            handler.getActionManager().terminate();
        }
    };
    AliveClass.prototype.onPhoneEventOccurred = function (eventName, jsonedData) {
        if (this.textToSpeechManager.isSpeaking()) {
            return;
        }
        switch (eventName) {
            case "CHARACTER_ACTIVATION":
                this.maybeSay("Hello, my name is Humanoid, and i'm here to serve you.", 100);
                break;
            case "POWER_CONNECTED":
                this.maybeSay("I will be here if you will need be.", 100);
                break;
            case "POWER_DISCONNECTED":
                this.maybeSay("Thank you for charging me.", 100);
                break;
            case "AIRPLANE_MODE_OFF":
                this.maybeSay("We are back to normal.", 100);
                break;
            case "AIRPLANE_MODE_ON":
                this.maybeSay("The airplane mode is on.", 100);
                break;
            case "CALL_ENDED":
                this.maybeSay("I hope you had a good talk.", 100);
                break;
            case "CLOSE_SYSTEM_DIALOGS":
                this.maybeSay("Allright.", 5);
                break;
            case "HEADSET_PLUG_OFF":
                this.maybeSay("Speakers are on.", 100);
                break;
            case "HEADSET_PLUG_ON":
                this.maybeSay("Entering stealth mode.", 100);
                break;
            case "INCOMING_CALL":
                this.maybeSay("We have an incoming call.", 100);
                break;
            case "MOBILE_INTERNET_OFF":
                this.maybeSay("Alert! we are now offline.", 100);
                break;
            case "MOBILE_INTERNET_ON":
                this.maybeSay("We are now online.", 100);
                break;
            case "NEW_OUTGOING_CALL":
                this.maybeSay("Starting a call operation.", 100);
                break;
            case "PACKAGE_ADDED":
                this.maybeSay("Package installation completed.", 100);
                break;
            case "PACKAGE_REMOVED":
                this.maybeSay("Package was uninstalled successfully", 100);
                break;
            case "SCREEN_OFF":
                this.maybeSay("Good bye.", 100);
                break;
            case "SCREEN_ON":
                this.maybeSay("Ready to serve.", 100);
                break;
            case "WIFI_OFF":
                this.maybeSay("Alert! we are now offline.", 100);
                break;
            case "WIFI_ON":
                this.maybeSay("We are now online.", 100);
                break;
        }
    };
    AliveClass.prototype.maybeSay = function (text, chance) {
        var randomChance = Math.random() * 100;
        if (chance >= randomChance) {
            this.textToSpeechManager.say(text);
        }
    };
    AliveClass.prototype.onMove = function (oldX, oldY, newX, newY) {
    };
    AliveClass.prototype.onRelease = function (currentX, currentY) {
    };
    AliveClass.prototype.onPick = function (currentX, currentY) {
    };
    AliveClass.prototype.onMenuItemSelected = function (viewName) {
        if (this.voices == null || this.voices.length == 0)
            this.voices = this.textToSpeechManager.getVoices();
        switch (viewName) {
            case "PrevButton":
                if (this.currentVoiceIndex > 0)
                    this.currentVoiceIndex--;
                else
                    this.currentVoiceIndex = this.voices.length - 1;
                break;
            case "NextButton":
                if (this.currentVoiceIndex == this.voices.length - 1)
                    this.currentVoiceIndex = 0;
                else
                    this.currentVoiceIndex++;
                break;
        }
        this.changeVoice(true);
    };
    AliveClass.prototype.onConfigureMenuItems = function (menuBuilder) {
        var PrevButton = new ButtonMenuItem();
        PrevButton.Height = 1;
        PrevButton.Width = 2;
        PrevButton.InitialX = 0;
        PrevButton.InitialY = 3;
        PrevButton.BackgroundColor = "#000000";
        PrevButton.Text = "Back";
        PrevButton.TextColor = "#0591de";
        PrevButton.Name = "PrevButton";
        var NextButton = new ButtonMenuItem();
        NextButton.Height = 1;
        NextButton.Width = 2;
        NextButton.InitialX = 2;
        NextButton.InitialY = 3;
        NextButton.BackgroundColor = "#000000";
        NextButton.Text = "Next";
        NextButton.TextColor = "#0591de";
        NextButton.Name = "NextButton";
        var text = this.databaseManager.getObject("VoiceName");
        if (text == null)
            text = "Current Language: English";
        var TextBox = new TextBoxMenuItem();
        TextBox.BackgroundColor = "#000000";
        TextBox.Height = 3;
        TextBox.InitialX = 0;
        TextBox.InitialY = 0;
        TextBox.Name = "LangTextBox";
        TextBox.Text = text;
        TextBox.TextColor = "#0591de";
        TextBox.Width = menuBuilder.getMaxColumns();
        menuBuilder.createButton(PrevButton);
        menuBuilder.createButton(NextButton);
        menuBuilder.createTextBox(TextBox);
    };
    AliveClass.prototype.onSpeechRecognitionResults = function (results) { };
    AliveClass.prototype.onResponseReceived = function (response) {
    };
    AliveClass.prototype.onLocationReceived = function (location) {
    };
    AliveClass.prototype.onUserActivityStateReceived = function (state) {
    };
    AliveClass.prototype.onPlacesReceived = function (places) {
    };
    AliveClass.prototype.onHeadphoneStateReceived = function (state) {
    };
    AliveClass.prototype.onWeatherReceived = function (weather) {
    };
    AliveClass.prototype.onUserEventOccurred = function (eventName, jsonedData) {
    };
    return AliveClass;
}());
//# sourceMappingURL=app.js.map