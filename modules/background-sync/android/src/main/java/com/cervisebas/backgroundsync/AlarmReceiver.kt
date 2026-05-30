package com.cervisebas.backgroundsync

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent

class AlarmReceiver : BroadcastReceiver() {

    override fun onReceive(context: Context, intent: Intent) {
        val serviceIntent =
            Intent(context, SyncForegroundService::class.java)

        context.startService(serviceIntent)
    }
}