## Humanoid Project:

### Main concept:
This is an actual code of the Humanoid character that is in the app.
This character will use react to almost every phone event with the help of the Text-To-Speech engine on the users phone.

### How to use:
In order to use this template, do the following steps:

1. Download and build it this project ([guide](https://github.com/hay12396/ImAliveGuide/wiki/How-to:-Build-and-upload-a-character-code))

2. Register your character to the phone events that you wish to responds to ([guide](https://www.youtube.com/watch?v=SByJnkZn4gI&feature=youtu.be))

3. Publish your character and see the results! ([guide](https://github.com/hay12396/ImAliveGuide/wiki/How-to:-Publish-your-character))

### The code:
Most of the work is done in the "onPhoneEventOccurred" method:
```javascript
    onPhoneEventOccurred(eventName: string, jsonedData: string): void {
           if (this.textToSpeechManager.isSpeaking())
        {
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
```

**Note**:

We check in the `onStart` method that there is a Text-To-Speech engine available on the user phone, and if not, we terminate the character.
