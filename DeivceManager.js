/**
 * @version {2024.09.27} 1.0.3
 * @environment RhinoJS
 */
"use strict";
module.exports = (function() {
    const Context = Api.getContext();
    const os = android.os;

    function DeviceManager() {
        if (this instanceof DeviceManager)
            throw new Error("class DeviceManager is static; cannot be used as a constructor");
    }

    function throwNoPackageError(packageName) {
        const e = new Error(`Cannot find package ${packageName}`);
        Error.captureStackTrace(e);
        e.name = "NoPackageError";
        e.stack = e.stack.split("\n").slice(1).join("\n");
        throw e;
    }

    DeviceManager.getAppNameByPackage = function(packageName) {
        try {
            const pm = Context.getPackageManager();
            return pm.getApplicationLabel(pm.getApplicationInfo(packageName, 0)).toString();
        } catch (e) {
            throwNoPackageError(packageName);
        }
    };
    
    DeviceManager.toString = function() {
        return 'class DeviceManager';
    };
    
    DeviceManager.isAirplaneModeOn = function() {
        return android.provider.Settings.Global.getString(Context.getContentResolver(), "airplane_mode_on") == 1;
    };

    DeviceManager.isWifiOn = function() {
        return android.provider.Settings.Global.getString(Context.getContentResolver(), "wifi_on") == 1;
    };

    DeviceManager.isMobileDataOn = function() {
        return android.provider.Settings.Global.getString(Context.getContentResolver(), "mobile_data") == 1;
    };
    
    DeviceManager.getScreenBrightness = function() {
        return android.provider.Settings.System.getString(Context.getContentResolver(), "screen_brightness");
    };

    DeviceManager.getBatteryStatus = function() {
        let batteryIntent = Context.registerReceiver(null, new android.content.IntentFilter(android.content.Intent.ACTION_BATTERY_CHANGED));
        let status = batteryIntent.getIntExtra(android.os.BatteryManager.EXTRA_STATUS, -1);
        return status;
    };

    DeviceManager.isCharging = function() {
        let status = DeviceManager.getBatteryStatus();
        let chargingStates = [2, 5];
        return chargingStates.includes(status);
    };

    DeviceManager.getBatteryLevel = function() {
        let batteryManager = Context.getSystemService(android.content.Context.BATTERY_SERVICE);
        let batteryCapacity = batteryManager.getIntProperty(android.os.BatteryManager.BATTERY_PROPERTY_CAPACITY);
        return batteryCapacity;
    };

    DeviceManager.getAudioRingerMode = function() {
        let audioManager = Context.getSystemService(android.content.Context.AUDIO_SERVICE);
        let mode = audioManager.getRingerMode();
        return mode;
    };

    DeviceManager.getBatteryTemperature = function() {
        let batteryIntent = Context.registerReceiver(null, new android.content.IntentFilter(android.content.Intent.ACTION_BATTERY_CHANGED));
        let temperature = batteryIntent.getIntExtra(android.os.BatteryManager.EXTRA_TEMPERATURE, -1) / 10;
        return temperature;
    };

    DeviceManager.getBatteryHealth = function() {
        let batteryIntent = Context.registerReceiver(null, new android.content.IntentFilter(android.content.Intent.ACTION_BATTERY_CHANGED));
        let health = batteryIntent.getIntExtra(android.os.BatteryManager.EXTRA_HEALTH, -1);
        return health;
    };

    DeviceManager.getDeviceName = function() {
        return android.provider.Settings.Global.getString(Context.getContentResolver(), "device_name");
    };

    DeviceManager.getBatteryVoltage = function() {
        let batteryIntent = Context.registerReceiver(null, new android.content.IntentFilter(android.content.Intent.ACTION_BATTERY_CHANGED));
        let voltage = batteryIntent.getIntExtra(android.os.BatteryManager.EXTRA_VOLTAGE, -1);
        return voltage;
    };

    DeviceManager.getBootCount = function() {
        return android.provider.Settings.Global.getString(Context.getContentResolver(), "boot_count");
    };

    DeviceManager.isPowerSaveModeOn = function() {
        let powerManager = Context.getSystemService(android.content.Context.POWER_SERVICE);
        let powerSaveMode = powerManager.isPowerSaveMode();
        return powerSaveMode;      
    };

    DeviceManager.getDefaultDialerAppName = function() {
        let telecomManager = Context.getSystemService(android.content.Context.TELECOM_SERVICE);
        let defaultDialerPackage = telecomManager.getDefaultDialerPackage();
        return DeviceManager.getAppNameByPackage(defaultDialerPackage);
    };

    DeviceManager.getSdkVersion = function() {
        return android.os.Build.VERSION.SDK_INT;
    };

    DeviceManager.getAndroidVersion = function() {
        return android.os.Build.VERSION.RELEASE;
    };

    DeviceManager.getPlugType = function() {
        let batteryStatus = Context.registerReceiver(null, 
            new android.content.IntentFilter(android.content.Intent.ACTION_BATTERY_CHANGED));
        
        let plugged = batteryStatus.getIntExtra(android.os.BatteryManager.EXTRA_PLUGGED, -1);
        let plugTypes = {
            1: "ac",
            2: "usb",
            4: "wireless"
        };
       
        return plugTypes[plugged] || "unknown";
    };

    DeviceManager.getDeviceBrand = function() {
        return android.os.Build.BRAND;
    };

    DeviceManager.getDeviceModel = function() {
        return android.os.Build.MODEL;
    };

    DeviceManager.getBatteryIntent = function() {
        return Context.registerReceiver(null, new android.content.IntentFilter(android.content.Intent.ACTION_BATTERY_CHANGED));
    };

    DeviceManager.isScreenOn = function() {
        let powerManager = Context.getSystemService(android.content.Context.POWER_SERVICE);
        return powerManager.isInteractive();
    };

    DeviceManager.getMediaVolume = function() {
        let audioManager = Context.getSystemService(android.content.Context.AUDIO_SERVICE);
        let current = audioManager.getStreamVolume(android.media.AudioManager.STREAM_MUSIC);
        let max = audioManager.getStreamMaxVolume(android.media.AudioManager.STREAM_MUSIC);
        return Math.round(current / max * 100);
    };

    DeviceManager.getRingtoneVolume = function() {
        let audioManager = Context.getSystemService(android.content.Context.AUDIO_SERVICE);
        let current = audioManager.getStreamVolume(android.media.AudioManager.STREAM_RING);
        let max = audioManager.getStreamMaxVolume(android.media.AudioManager.STREAM_RING);
        return Math.round(current / max * 100);
    };

    DeviceManager.getNotificationVolume = function() {
        let audioManager = Context.getSystemService(android.content.Context.AUDIO_SERVICE);
        let current = audioManager.getStreamVolume(android.media.AudioManager.STREAM_NOTIFICATION);
        let max = audioManager.getStreamMaxVolume(android.media.AudioManager.STREAM_NOTIFICATION);
        return Math.round(current / max * 100);
    };

    DeviceManager.getSystemVolume = function() {
        let audioManager = Context.getSystemService(android.content.Context.AUDIO_SERVICE);
        let current = audioManager.getStreamVolume(android.media.AudioManager.STREAM_SYSTEM);
        let max = audioManager.getStreamMaxVolume(android.media.AudioManager.STREAM_SYSTEM);
        return Math.round(current / max * 100);
    };
    
    DeviceManager.getDeviceLanguage = function() {
        return java.util.Locale.getDefault().getDisplayLanguage();
    };

    DeviceManager.getConnectedNetworkType = function() {
        let cm = Context.getSystemService(android.content.Context.CONNECTIVITY_SERVICE);
        let net = cm.getActiveNetworkInfo();
        let type = "NONE";
        if (net !== null) type = net.getTypeName();
        return type;
    };

    DeviceManager.getConnectedNetworkSpeed = function() {
        let speed = Context.getSystemService(Context.WIFI_SERVICE).getConnectionInfo().getLinkSpeed();
        if (speed === -1) speed = "unknown";
        return speed;
    };

    DeviceManager.isDarkModeOn = function() {
        let resources = Context.getResources();
        let uiMode = resources.getConfiguration().uiMode & android.content.res.Configuration.UI_MODE_NIGHT_MASK;
        return uiMode === android.content.res.Configuration.UI_MODE_NIGHT_YES;
    };

    DeviceManager.getDeviceCountryCode = function() {
        return java.util.Locale.getDefault().getCountry();
    };

    DeviceManager.getDeviceTimeZone = function() {
        return java.util.TimeZone.getDefault().getID();
    };

    DeviceManager.getDeviceDpi = function() {
        let metrics = new android.util.DisplayMetrics();
        Context.getSystemService(android.content.Context.WINDOW_SERVICE).getDefaultDisplay().getMetrics(metrics);
        return metrics.densityDpi;
    };

    DeviceManager.getScreenWidth = function() {
        const metrics = new android.util.DisplayMetrics();
        Context.getSystemService(android.content.Context.WINDOW_SERVICE).getDefaultDisplay().getMetrics(metrics);
        return metrics.widthPixels;
    };

    DeviceManager.isBluetoothOn = function() {
        let bluetoothAdapter = android.bluetooth.BluetoothAdapter.getDefaultAdapter();
        return bluetoothAdapter && bluetoothAdapter.isEnabled();
    };

    DeviceManager.getScreenHeight = function() {
        let metrics = new android.util.DisplayMetrics();
        Context.getSystemService(android.content.Context.WINDOW_SERVICE).getDefaultDisplay().getMetrics(metrics);
        return metrics.heightPixels;
    };

    DeviceManager.getWifiName = function() {
        let wifiManager = Context.getSystemService(android.content.Context.WIFI_SERVICE);
        let wifiInfo = wifiManager.getConnectionInfo();
        return wifiInfo.getSSID().slice(1, -1);
    };

    DeviceManager.getBuildNumber = function() {
        return android.os.Build.DISPLAY;
    };

    DeviceManager.getScreenDensity = function() {
        let metrics = new android.util.DisplayMetrics();
        Context.getSystemService(android.content.Context.WINDOW_SERVICE).getDefaultDisplay().getMetrics(metrics);
        return metrics.density;
    };

    DeviceManager.getNetworkOperatorName = function() {
        let telephonyManager = Api.getContext().getSystemService(android.content.Context.TELEPHONY_SERVICE);
        return telephonyManager.getNetworkOperatorName();
    };

    DeviceManager.getWifiFrequency = function() {
        return (Context.getSystemService(android.content.Context.WIFI_SERVICE).getConnectionInfo().getFrequency() * 0.001);
    };

    DeviceManager.isDoNotDisturbModeOn = function() {
        let notificationManager = Api.getContext().getSystemService(android.content.Context.NOTIFICATION_SERVICE);
        let filterNone = android.app.NotificationManager.INTERRUPTION_FILTER_NONE;
        let isDndOn = notificationManager.getCurrentInterruptionFilter() != android.app.NotificationManager.INTERRUPTION_FILTER_ALL;
        return isDndOn;
    };
    
    DeviceManager.getTotalMemory = function (){
        let Runtime = java.lang.Runtime.getRuntime();
        return Runtime.maxMemory()
    };
    
    DeviceManager.getUsingMemory = function (){
        let Runtime = java.lang.Runtime.getRuntime();
        return Runtime.totalMemory()
    }; 
    
    DeviceManager.getMemoryPercentage = function (){
        let Runtime = java.lang.Runtime.getRuntime();
        return Runtime.totalMemory() / Runtime.maxMemory() * 100
    };
    
    DeviceManager.setTorchMode = function (mode) {
        let modes = {"on":true,"off":false}
        if(modes[mode] == undefined) throw Error("mode must on or off")
        let cm = Api.getContext().getSystemService(android.content.Context.CAMERA_SERVICE);
        return cm.setTorchMode(cm.getCameraIdList()[0], modes[mode]);        
    };
    
    DeviceManager.getUptime = function () {
        let uptime = android.os.SystemClock.elapsedRealtime();
        return uptime;
    };
    
    DeviceManager.getScreenOffTimeout = function (){
        let context = Api.getContext().getContentResolver();
        let screen_off_timeout = android.provider.Settings.System.getString(context, "screen_off_timeout");
        let seconds = java.util.concurrent.TimeUnit.MILLISECONDS.toSeconds(screen_off_timeout) % 60;
        let minutes = java.util.concurrent.TimeUnit.MILLISECONDS.toMinutes(screen_off_timeout) % 60;
        return  (minutes == 0?"":minutes )+ (seconds == 0 ?"":seconds);
    };
    
    DeviceManager.getHourClockType = function  () {
        let context = Api.getContext().getContentResolver();
        return android.provider.Settings.System.getString(context, "time_12_24");
    };
    
    return DeviceManager;
    
})()
