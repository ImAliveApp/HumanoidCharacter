﻿/// <reference path="Scripts/collections.ts" />

class AliveClass implements IAliveAgent {
    private configurationManager: IConfigurationManager;
    private textToSpeechManager: ITextToSpeechManager;
    private databaseManager: IDatabaseManager;
    private actionManager: IActionManager;
    private menuManager: IMenuManager;

    private voices: IVoice[];

    private currentVoiceIndex: number;
    private voiceIndexSet: boolean;

    public constructor() {
        this.currentVoiceIndex = 0;
        this.voiceIndexSet = false;
    }

    /**
     * This method gets called every 250 milliseconds by the system, any logic updates to the state of your character should occur here.
     * Note: onTick only gets called when the screen is ON.
     * @param time The current time (in milliseconds) on the device.
     */
    onTick(time: number): void {
        if (this.voices == null || this.voices.length == 0)
            this.voices = this.textToSpeechManager.getVoices();

        let index = this.databaseManager.getObject("Index");

        if (index != null) {
            this.currentVoiceIndex = parseInt(index);
            this.changeVoice(true);
        }
    }

    /**
     * This method sets the Text-To-Speech voice to a different voice (using the currentVoiceIndex).
     * @param force If true, we force a change.
     */
    changeVoice(force: boolean): void {
        if (this.voiceIndexSet && !force) return;

        this.voiceIndexSet = true;

        let name = this.getVoiceTextPresentation(this.voices[this.currentVoiceIndex]);
        this.menuManager.setProperty("LangTextBox", "Text", name);
        this.textToSpeechManager.setVoice(this.currentVoiceIndex);
        this.databaseManager.saveObject("Index", this.currentVoiceIndex.toString());
        this.databaseManager.saveObject("VoiceName", name);
    }

    /**
     * This method changes the text in the menu to the correct voice text.
     * @param v The current voice that we use.
     */
    getVoiceTextPresentation(v: IVoice): string {
        let gender = v.getName().indexOf("female") != -1 ? "female" : "";
        if (gender == "")
            gender = v.getName().indexOf("male") != -1 ? "male" : "unknown gender";
        return v.getISO3Language() + " " + gender + " " + this.currentVoiceIndex.toString() + "/" + (this.voices.length - 1).toString();
    }

    /**
     * This method gets called by the system every 1 hour (may be in a different rate depending on the device).
     * Note: this method only gets called when the screen is OFF.
     * @param time The current time (in milliseconds) on the device.
     */
    onBackgroundTick(time: number) {

    }

    /**
     * This method gets called once when the character is being activated by the system.
     * You can only get the references to the managers, but you can NOT use them untill onTick is called.
     * @param handler An object that allows the code to get reference to the managers.
     * @param disabledPermissions A list of permissions that the user disabled.
     */
    onStart(handler: IManagersHandler, disabledPermissions: string[]): void {
        this.configurationManager = handler.getConfigurationManager();
        this.textToSpeechManager = handler.getTextToSpeechManager();
        this.databaseManager = handler.getDatabaseManager();
        this.actionManager = handler.getActionManager();
        this.menuManager = handler.getMenuManager();

        if (!this.textToSpeechManager.isAvailable()) {
            handler.getActionManager().showSystemMessage("No Text-To-Speech Engine available, closing character..");
            handler.getActionManager().terminate();
        }
    }

    /**
     * This method gets called whenever a phone event (that you registered to) occur on the phone.
     * @param eventName The name of the event that occurred.
     * @param jsonedData The data of the event that occurred.
     * For example, SMS_RECEIVED event will hold data about who sent the SMS, and the SMS content.
     */
    onPhoneEventOccurred(eventName: string, jsonedData: string): void {
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
    }

    maybeSay(text: string, chance: number): void {
        let randomChance = Math.random() * 100;
        if (chance >= randomChance) {
            this.textToSpeechManager.say(text);
        }
    }

    /**
     * This method gets called when the user raised his finger off the character image (on screen).
     * @param currentX The X coordinate of the character image on screen (Top left).
     * @param currentY The Y coordinate of the character image on the screen (Top left).
     */
    onRelease(currentX: number, currentY: number): void {

    }

    /**
     * This method gets called whenever the user is holding the character image (on screen).
     * @param currentX The current X coordinate of the character image (Top left).
     * @param currentY The current Y coordinate of the character image (Top left).
     */
    onPick(currentX: number, currentY: number): void {

    }

    /**
     * This method gets called whenever the user has pressed a view in the character menu.
     * @param viewName The 'Name' property of the view that was pressed.
     */
    onMenuItemSelected(viewName: string): void {
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
    }

    /**
     * This method gets called once just before the onStart method and is where the character menu views are defined.
     * @param menuBuilder An object that fills the character menu.
     */
    onConfigureMenuItems(menuBuilder: IMenuBuilder): void {
        let PrevButton = new ButtonMenuItem();
        PrevButton.Height = 1;
        PrevButton.Width = 2;
        PrevButton.InitialX = 0;
        PrevButton.InitialY = 3;
        PrevButton.BackgroundColor = "#000000";
        PrevButton.Text = "Back";
        PrevButton.TextColor = "#0591de";
        PrevButton.Name = "PrevButton";

        let NextButton = new ButtonMenuItem();
        NextButton.Height = 1;
        NextButton.Width = 2;
        NextButton.InitialX = 2;
        NextButton.InitialY = 3;
        NextButton.BackgroundColor = "#000000";
        NextButton.Text = "Next";
        NextButton.TextColor = "#0591de";
        NextButton.Name = "NextButton";

        let text = this.databaseManager.getObject("VoiceName");
        if (text == null)
            text = "Current Language: English";

        let TextBox = new TextBoxMenuItem();
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
    }

    /**
     * This method gets called when the system done processing the speech recognition input.
     * @param results A stringed version of what the user said.
     */
    onSpeechRecognitionResults(results: string): void { }

    /**
     * This method is called when the system received a reply from a previously HTTP request made by the character.
     * @param response The reply body in a JSON form.
     */
    onResponseReceived(response: string): void {

    }

    /**
     * This method gets called when the system done collecting information about the device location.
     * @param location The location information collected by the system.
     */
    onLocationReceived(location: IAliveLocation): void {

    }

    /**
     * This method gets called when the system done collecting information about the user activity.
     * @param state Information about the user activity.
     * Possible states: IN_VEHICLE, ON_BICYCLE, ON_FOOT, STILL, TILTING, WALKING, RUNNING, UNKNOWN.
     */
    onUserActivityStateReceived(state: IAliveUserActivity) {

    }

    /**
     * This method gets called when the system done collecting information about nearby places around the device.
     * @param places A list of places that are near the device.
     */
    onPlacesReceived(places: IAlivePlaceLikelihood[]): void {

    }

    /**
     * This method gets called when the system done collecting information about the headphone state.
     * @param state 1 - the headphones are PLUGGED, 2 - the headphones are UNPLUGGED.
     */
    onHeadphoneStateReceived(state: number) {

    }

    /**
     * This method gets called when the system done collecting information about the weather in the location of the device.
     * @param weather Information about the weather.
     */
    onWeatherReceived(weather: IAliveWeather) {

    }

    /**
     * This method will be called once a user event will occur.
     * You can use AgentConstants.USER_EVENT_x to check which event occurred.
     * @param eventName The name of the event, compare this to AgentConstants.APPLICATION_EVENT_x.
     * @param jsonedData Extra data about the event.
     */
    onUserEventOccurred(eventName: string, jsonedData: string): void {

    }
}
