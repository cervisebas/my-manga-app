package com.cervisebas.backgroundsync

import android.util.Log
import android.content.Intent
import com.facebook.react.HeadlessJsTaskService
import com.facebook.react.bridge.Arguments
import com.facebook.react.jstasks.HeadlessJsTaskConfig

class SyncTaskService : HeadlessJsTaskService() {

    override fun getTaskConfig(intent: Intent?): HeadlessJsTaskConfig {
        Log.d("BackgroundSync", "Headless task requested")

        return HeadlessJsTaskConfig(
            "BackgroundTasks",
            Arguments.createMap(),
            1 * 60 * 1000, //10 * 60 * 1000,
            true
        )
    }
}