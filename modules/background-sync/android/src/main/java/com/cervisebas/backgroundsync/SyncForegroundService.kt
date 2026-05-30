package com.cervisebas.backgroundsync

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Intent
import android.os.Build
import android.os.IBinder
import androidx.core.app.NotificationCompat
import android.util.Log

class SyncForegroundService : Service() {

    override fun onCreate() {
        super.onCreate()
        Log.d("BackgroundSync", "Foreground service started")

        createChannel()

        // Esto proboca crasheos
        /* val notification: Notification =
            NotificationCompat.Builder(this, "sync_channel")
                .setContentTitle("Sincronizando")
                .setContentText("Verificando actualización de libros...")
                .setSmallIcon(android.R.drawable.stat_notify_sync)
                .build()

        startForeground(1, notification) */

        val intent =
            Intent(this, SyncTaskService::class.java)

        startService(intent)

        AlarmScheduler.schedule(this)

        stopSelf()
    }

    private fun createChannel() {

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {

            val channel = NotificationChannel(
                "sync_channel",
                "Background Sync",
                NotificationManager.IMPORTANCE_LOW
            )

            val manager =
                getSystemService(NotificationManager::class.java)

            manager.createNotificationChannel(channel)
        }
    }

    override fun onBind(intent: Intent?): IBinder? = null
}